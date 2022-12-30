import { Stack, Box, Group, Image, Text } from "@mantine/core";

export default function Page() {
  return (
    <Box
      sx={(theme) => ({
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.colors.dark[6]
            : theme.colors.gray[0],
        padding: theme.spacing.md,
        borderRadius: theme.radius.lg,
        "&:hover": {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[5]
              : theme.colors.gray[1],
        },
      })}
    >
      <Group position="apart">
        <Text weight={500}>Games</Text>
      </Group>
      <Text size="sm" style={{ lineHeight: 1.5 }}>
        With Fjord Tours you can explore more of the magical fjord landscapes
        with tours and activities on and around the fjords of Norway
      </Text>
    </Box>
  );
}
