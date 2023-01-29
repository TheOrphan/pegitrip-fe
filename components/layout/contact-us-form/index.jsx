import { useEffect, useState } from "react";
import { useForm } from "@mantine/form";
import {
  TextInput,
  NumberInput,
  Textarea,
  Text,
  Paper,
  Group,
  Button,
  Stack,
  Select,
} from "@mantine/core";
import {
  IconBrandWhatsapp,
  IconCheck,
  IconBug,
  IconMailFast,
} from "@tabler/icons";
import { showNotification } from "@mantine/notifications";

export function ContactUsForm(props) {
  const [verified, setVerified] = useState(false);
  const [submitOk, setSubmitOk] = useState(false);
  const [onSubmitting, setSubmitting] = useState(false);

  const form = useForm({
    initialValues: {
      type: "",
      name: "",
      wa: "",
      msg: "",
      captcha: false,
      myt: props.myt,
    },

    validate: {
      wa: (val) =>
        Math.ceil(Math.log10(val + 1)) < 9
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
      <form
        onSubmit={form.onSubmit(
          async (values, _event) => {
            setSubmitting(true);
            const { wa, ...rest } = values;
            const isSent = await fetch("/api/static/myc", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                ...rest,
                wa: "62" + wa,
              }),
            });
            if (isSent.status === 200) {
              setSubmitOk(true);
              setSubmitting(false);
              showNotification({
                id: "contact-us-letter",
                onClose: () => window.location.reload,
                autoClose: 2 * 1000,
                title: "Thank you for contacting us!",
                message: (
                  <>
                    <Text color="white">
                      Your message has been sent to support team. We will reach
                      you as soon as we can.
                    </Text>
                  </>
                ),
                color: "green",
                icon: <IconCheck size={20} />,
                loading: false,
              });
            } else {
              showNotification({
                id: "contact-us-error",
                autoClose: 2 * 1000,
                onClose: () => window.location.reload,
                title: "Error occurred when sending message!",
                message: (
                  <>
                    <Text color="white">
                      There is an error occurred. Please retry send your problem
                      or message.
                    </Text>
                  </>
                ),
                color: "red",
                icon: <IconBug size={20} />,
                loading: false,
              });
            }
          },
          (validationErrors, _values, _event) => {
            console.log(validationErrors);
          }
        )}
        onReset={form.onReset}
      >
        <Stack>
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
              return !Number.isNaN(parseFloat(value)) ? `+62 ${value}` : "+62 ";
            }}
            error={form.errors.wa}
          />
          <Select
            required
            label="Category"
            placeholder="Pick one"
            onChange={(value) => form.setFieldValue("type", value)}
            data={[
              {
                value: "pesanan",
                label: "Pesanan bermasalah atau tidak sesuai",
              },
              { value: "pembayaran", label: "Masalah pembayaran" },
              {
                value: "interest",
                label: "Kesepakatan franchise atau mau dong jualan kaya gini",
              },
              {
                value: "feedback",
                label:
                  "Ada masalah di-web atau kayanya webnya bisa lebih bagus kalo.....",
              },
            ]}
          />
          <Textarea
            required
            placeholder="Pesan anda untuk admin"
            label="Pesan"
            autosize
            minRows={2}
            onChange={(event) => form.setFieldValue("msg", event.target.value)}
          />
        </Stack>

        <Group position="apart" mt="xl">
          <Button
            rightIcon={
              submitOk ? <IconCheck size={24} /> : <IconMailFast size={24} />
            }
            disabled={!verified || submitOk}
            type="submit"
            loading={onSubmitting}
          >
            Send
          </Button>
        </Group>
      </form>
    </Paper>
  );
}
