import { Text } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { IconCheck, IconBug } from "@tabler/icons";

const successAuthNotif = ({ email }) =>
  showNotification({
    id: "registration-letter",
    disallowClose: false,
    autoClose: false,
    onClose: () => (window.location.href = "/auth/login"),
    title: "Thank you for registering!",
    message: (
      <>
        <Text color="white">
          An email has been sent from &quot;us&quot; to {email} with a link to
          verify your account. You must verify your account to get full access
          to our store.
        </Text>
        <br />
        <Text color="white">
          If you have not received the email after a few minutes, check your
          spam folder. Please email &quot;our.support@gmail.com&quot; for
          further assistance.
        </Text>
        <br />
        <Text color="white">
          If you previously verified your account, you will not need to do so
          again. Simply try to login with your credentials`
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

const failAuthNotif = () =>
  showNotification({
    id: "registration-error",
    disallowClose: false,
    autoClose: false,
    onClose: () => (window.location.href = `/static/contact-us`),
    title: "Error occurred when registering!",
    message: (
      <Text color="white">
        There is an error occurred. Please re-check your credentials
        information. It is possible if your information already as our member,
        try to login instead. Or if you believe the error in our side, Do not
        hesitate to contact us.
      </Text>
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

export { successAuthNotif, failAuthNotif };
