import { useEffect, useState, useRef } from "react";
import { useToggle, upperFirst } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import {
  TextInput,
  NumberInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  Button,
  Divider,
  Checkbox,
  Anchor,
  Stack,
} from "@mantine/core";
import { GoogleButton } from "../../social-button";
import { IconBrandWhatsapp } from "@tabler/icons";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { successAuthNotif, failAuthNotif } from "./auth.notif";
import { loginGoogle, loginEmail } from "./auth.helper";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

export default function AuthenticationForm(props) {
  const sb = useSupabaseClient();
  const [captchaToken, setCaptchaToken] = useState();
  const captcha = useRef();
  const [type, toggle] = useToggle(["login", "register"]);
  const [verified, setVerified] = useState(false);
  const [onSubmitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (props.type) {
      toggle(props.type);
    }
  }, [props.type, toggle]);

  const form = useForm({
    initialValues: {
      email: "",
      name: "",
      wa: "",
      password: "",
      terms: true,
      captcha: false,
      myt: props.myt,
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
      password: (val) =>
        type === "register" && val.length <= 6
          ? "Password should include at least 6 characters"
          : null,
      wa: (val) =>
        type === "register" && Math.ceil(Math.log10(val + 1)) < 9
          ? "WhatsApp should at least 9 characters"
          : null,
    },
  });

  return (
    <Paper radius="md" p="xl" withBorder {...props}>
      <Text size="lg" weight={500}>
        Welcome to Pegitrip, {type} with {type === "register" && "email"}
      </Text>
      {type === "login" && (
        <Group grow mb="md" mt="md">
          <GoogleButton radius="xl" onClick={() => loginGoogle({ sb })}>
            Google
          </GoogleButton>
        </Group>
      )}
      <Divider label={type === "login" && "Or continue with email"} />
      <form
        onSubmit={form.onSubmit(
          async (values, _event) => {
            setSubmitting(true);
            if (type === "login" && values.password) {
              loginEmail({
                sb,
                email: values.email,
                password: values.password,
                captchaToken,
              });
              window.location.href = "/";
              return;
            }
            if (type === "register") {
              captcha.current.resetCaptcha();
              const isRegistered = await sb.auth.signUp({
                email: values.email,
                password: values.password,
                options: { captchaToken },
              });
              if (isRegistered.data.user.aud === "authenticated") {
                successAuthNotif(values);
              } else {
                failAuthNotif();
              }
            }
          },
          (validationErrors, _values, _event) => {
            console.log(validationErrors);
          }
        )}
        onReset={form.onReset}
      >
        <Stack>
          {type === "register" && (
            <>
              <TextInput
                required
                label="Name"
                placeholder="Your name"
                value={form.values.name}
                onChange={(event) =>
                  form.setFieldValue("name", event.currentTarget.value)
                }
              />
              <NumberInput
                required
                label="WhatsApp"
                icon={<IconBrandWhatsapp size={18} />}
                onChange={(value) => form.setFieldValue("wa", value)}
                parser={(value) => value.replace(/\+62\s?|(,*)/g, "")}
                formatter={(value) => {
                  return !Number.isNaN(parseFloat(value))
                    ? `+62 ${value}`
                    : "+62 ";
                }}
                error={form.errors.wa}
              />
            </>
          )}

          <TextInput
            required
            label="Email"
            placeholder="hello@mantine.dev"
            value={form.values.email}
            onChange={(event) =>
              form.setFieldValue("email", event.currentTarget.value)
            }
            error={form.errors.email}
          />

          <PasswordInput
            label="Password"
            placeholder="Your password"
            value={form.values.password}
            onChange={(event) => {
              form.setFieldValue("password", event.currentTarget.value);
            }}
            error={form.errors.password}
          />

          {type === "register" && (
            <Checkbox
              required
              label={
                <Text>
                  I accept{" "}
                  <Anchor
                    component="button"
                    onClick={() =>
                      (window.location.href = "/static/ketentuan-dan-kondisi")
                    }
                    type="button"
                    color="dimmed"
                  >
                    <i>
                      <u>terms and conditions</u>
                    </i>
                  </Anchor>
                </Text>
              }
              checked={form.values.terms}
              onChange={(event) =>
                form.setFieldValue("terms", event.currentTarget.checked)
              }
            />
          )}
        </Stack>

        <Group position="apart" mt="xl">
          <Anchor
            component="button"
            onClick={() =>
              (window.location.href =
                type === "register" ? "/auth/login" : "/auth/register")
            }
            type="button"
            color="dimmed"
            size="xs"
          >
            {type === "register"
              ? "Already have an account? Login"
              : "Don't have an account? Register"}
          </Anchor>
          <HCaptcha
            ref={captcha}
            sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY}
            onVerify={(token) => {
              setCaptchaToken(token);
              setVerified(true);
            }}
          />
          <Button
            disabled={!verified}
            type="submit"
            loading={onSubmitting}
            fullWidth
          >
            {upperFirst(type)}
          </Button>
        </Group>
      </form>
    </Paper>
  );
}
