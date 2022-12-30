import { useEffect, useState } from "react";
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
import SliderCaptcha from "@slider-captcha/react";
import { IconBrandWhatsapp, IconCheck, IconBug } from "@tabler/icons";
import { signIn } from "next-auth/react";
import { showNotification } from "@mantine/notifications";

export function AuthenticationForm(props) {
  const [type, toggle] = useToggle(["login", "register"]);
  useEffect(() => {
    if (props.type) {
      toggle(props.type);
    }
  }, [props.type, toggle]);

  const [isUsingPassword, setUsingPassword] = useState(false);
  const [verified, setVerified] = useState(false);
  const [onSubmitting, setSubmitting] = useState(false);

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

  const verifiedCallback = () => {
    setVerified(true);
    form.setFieldValue("captcha", true);
  };

  return (
    <Paper radius="md" p="xl" withBorder {...props}>
      <Text size="lg" weight={500}>
        Welcome to Mantine, {type} with {type === "register" && "email"}
      </Text>

      {type === "login" && (
        <Group grow mb="md" mt="md">
          <GoogleButton radius="xl" onClick={() => signIn("google")}>
            Google
          </GoogleButton>
        </Group>
      )}

      <Divider
        label={type === "login" && "Or continue with email"}
        labelPosition="center"
        my="lg"
      />

      <form
        onSubmit={form.onSubmit(
          async (values, _event) => {
            setSubmitting(true);
            if (type === "login" && !values.password) {
              signIn("email", { email: values.email });
              return;
            }

            if (type === "login" && values.password) {
              signIn("credentials", {
                email: values.email,
                password: values.password,
              });
              return;
            }
            if (type === "register") {
              const { wa, ...rest } = values;
              const isRegistered = await fetch("/api/auth/myr", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  ...rest,
                  wa: "62" + wa,
                }),
              });
              if (isRegistered.status === 200) {
                showNotification({
                  id: "registration-letter",
                  disallowClose: false,
                  autoClose: false,
                  onClose: () => (window.location.href = "/"),
                  title: "Thank you for registering!",
                  message: (
                    <>
                      <Text color="white">
                        An email has been sent from &quot;us&quot; to{" "}
                        {values.email} with a link to verify your account. You
                        must verify your account to get full access to our
                        store.
                      </Text>
                      <br />
                      <Text color="white">
                        If you have not received the email after a few minutes,
                        check your spam folder. Please email
                        &quot;our.support@gmail.com&quot; for further
                        assistance.
                      </Text>
                      <br />
                      <Text color="white">
                        If you previously verified your account, you will not
                        need to do so again. Simply try to login with your
                        credentials`
                      </Text>
                    </>
                  ),
                  color: "green",
                  icon: <IconCheck size={20} />,
                  style: { left: "-18%" },
                  sx: {
                    width: 600,
                    paddingTop: 55,
                    paddingBottom: 55,
                    maxHeight: 500,
                  },
                  loading: false,
                });
              } else {
                showNotification({
                  id: "registration-error",
                  disallowClose: false,
                  autoClose: false,
                  onClose: () => (window.location.href = `/static/contact-us`),
                  title: "Error occurred when registering!",
                  message: (
                    <>
                      <Text color="white">
                        There is an error occurred. Please re-check your
                        credentials information. It is possible if your
                        information already as our member, try to login instead.
                        Or if you believe the error in our side, Do not hesitate
                        to contact us.
                      </Text>
                    </>
                  ),
                  color: "red",
                  icon: <IconBug size={20} />,
                  style: { left: "-18%" },
                  sx: {
                    width: 600,
                    paddingTop: 35,
                    paddingBottom: 35,
                    maxHeight: 500,
                  },
                  loading: false,
                });
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
              setUsingPassword(true);
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
          <SliderCaptcha
            create="/api/auth/captcha"
            verify="/api/auth/captcha"
            callback={verifiedCallback}
          />
          <Button disabled={!verified} type="submit" loading={onSubmitting}>
            {upperFirst(
              type === "login" && !isUsingPassword
                ? `${type} tanpa password`
                : type
            )}
          </Button>
        </Group>
      </form>
    </Paper>
  );
}
