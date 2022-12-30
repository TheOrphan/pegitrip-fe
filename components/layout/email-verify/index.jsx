import {
  createStyles,
  Image,
  Container,
  Title,
  Text,
  Button,
  SimpleGrid,
} from "@mantine/core";
import Link from "next/link";

const useStyles = createStyles((theme) => ({
  root: {
    paddingTop: 80,
    paddingBottom: 80,
  },

  title: {
    fontWeight: 900,
    fontSize: 34,
    marginBottom: theme.spacing.md,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,

    [theme.fn.smallerThan("sm")]: {
      fontSize: 32,
    },
  },

  control: {
    [theme.fn.smallerThan("sm")]: {
      width: "100%",
    },
  },

  mobileImage: {
    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },

  desktopImage: {
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },
}));

export function EmailVerifiedImage({ message, status, user }) {
  const { classes } = useStyles();

  return (
    <Container className={classes.root}>
      <SimpleGrid
        spacing={80}
        cols={2}
        breakpoints={[{ maxWidth: "sm", cols: 1, spacing: 40 }]}
      >
        <Image
          src={
            status
              ? "/image/undraw_happy_news_re_tsbd.svg"
              : "/image/undraw_meditation_re_gll0.svg"
          }
          alt="illustarion-image-email-verify"
          className={classes.mobileImage}
        />
        <div>
          <Title className={classes.title}>
            {status ? "Account activated!" : "Something is not right..."}
          </Title>

          {status ? (
            <Text color="dimmed" size="lg">
              Hello, {user.name}, {message}
              <br />
              Thank you, your account is now active. Please use the link below
              to login to your account. Thank you for choosing Our Store.
            </Text>
          ) : (
            <Text color="dimmed" size="lg">
              Email verification have problem. {message} If you think this is an
              error contact support.
            </Text>
          )}

          <Link href={status ? "/auth/login" : "/static/contact"}>
            <Button
              variant="outline"
              size="md"
              mt="xl"
              className={classes.control}
            >
              {status ? "Login Page" : "Contact support"}
            </Button>
          </Link>
        </div>
        <Image
          src={
            status
              ? "/image/undraw_happy_news_re_tsbd.svg"
              : "/image/undraw_meditation_re_gll0.svg"
          }
          alt="illustarion-image-email-verify"
          className={classes.desktopImage}
        />
      </SimpleGrid>
    </Container>
  );
}
