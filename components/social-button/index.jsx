import { Button, Group } from "@mantine/core";
import {
  IconBrandGithub as GithubIcon,
  IconBrandDiscord as DiscordIcon,
  IconBrandTwitter as TwitterIcon,
} from "@tabler/icons";
import { GoogleIcon } from "./google-icon";

export function GoogleButton(props) {
  return (
    <Button
      leftIcon={<GoogleIcon />}
      variant="default"
      color="gray"
      {...props}
    />
  );
}

export function DiscordButton(props) {
  return (
    <Button
      leftIcon={<DiscordIcon size={16} />}
      sx={(theme) => ({
        backgroundColor: theme.colorScheme === "dark" ? "#5865F2" : "#5865F2",
        "&:hover": {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.fn.lighten("#5865F2", 0.05)
              : theme.fn.darken("#5865F2", 0.05),
        },
      })}
      {...props}
    />
  );
}

// Twitter button as anchor
export function TwitterButton(props) {
  return (
    <Button
      component="a"
      leftIcon={<TwitterIcon size={16} color="#00ACEE" />}
      variant="default"
      {...props}
    />
  );
}

export function GithubButton(props) {
  return (
    <Button
      {...props}
      leftIcon={<GithubIcon size={16} />}
      sx={(theme) => ({
        backgroundColor:
          theme.colors.dark[theme.colorScheme === "dark" ? 9 : 6],
        color: "#fff",
        "&:hover": {
          backgroundColor:
            theme.colors.dark[theme.colorScheme === "dark" ? 9 : 6],
        },
      })}
    />
  );
}

export function SocialButtons() {
  return (
    <Group position="center" sx={{ padding: 15 }}>
      <GoogleButton>Continue with Google</GoogleButton>
      <TwitterButton href="https://twitter.com/mantinedev" target="_blank">
        Follow on Twitter
      </TwitterButton>
      <GithubButton>Login with GitHub</GithubButton>
      <DiscordButton>Join Discord community</DiscordButton>
    </Group>
  );
}
