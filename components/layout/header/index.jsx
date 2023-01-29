import { useState } from "react";
import useSWR from "swr";
import { useDebouncedValue } from "@mantine/hooks";
import {
  Grid,
  Image,
  Select,
  Text,
  Space,
  Flex,
  UnstyledButton,
  Avatar,
  Skeleton,
  Menu,
  Center,
  Header,
  Container,
  Group,
  Button,
  Burger,
} from "@mantine/core";
import Link from "next/link";
import AutoCompleteItem from "./AutoComplete";
import { IconLogout } from "@tabler/icons";
import { useDisclosure } from "@mantine/hooks";
import { headerStyle, HEADER_HEIGHT } from "./header.usestyle";
import { emailOverflow, nameOverflow } from "@helper";

const fetcher = async (key) =>
  fetch("/api/products?search=" + key).then((res) => res.json());

export default function Page() {
  // const session = useUser();
  const { classes } = headerStyle();
  const [opened, { toggle }] = useDisclosure(false);
  const [searchVal, setSearch] = useState("");
  const [search] = useDebouncedValue(searchVal, 200);
  const { data: searchData } = useSWR(search, fetcher);
  return (
    <Header
      height={HEADER_HEIGHT}
      sx={{ borderBottom: 0, boxShadow: "0px 1px 5px -5px black" }}
      mb={120}
      px={"4rem"}
    >
      <Container className={classes.inner} fluid>
        <Group>
          <Burger
            opened={opened}
            onClick={toggle}
            className={classes.burger}
            size="sm"
          />
          <Link href="/">
            <Image height={60} src="/image/logo.png" alt="our-brand-logo" />
          </Link>
        </Group>
        <Group spacing={5} className={classes.links}>
          <div>
            <Select
              className={classes.search}
              placeholder="Tour ujung kulon"
              data={searchData?.data || []}
              itemComponent={AutoCompleteItem}
              clearable
              searchable
              onSearchChange={(value) => setSearch(value)}
              onChange={(value) =>
                value && (window.location.href = `/product/${value}`)
              }
              onKeyDown={(event) =>
                event.key === "Enter" &&
                (window.location.href = `/?search=${searchVal}`)
              }
              searchValue={searchVal}
              nothingFound={search?.length > 0 && "No game found"}
              maxDropdownHeight={350}
              filter={(value, item) =>
                item.name.toLowerCase().includes(value?.toLowerCase().trim())
              }
            />
            <Flex
              direction={{ base: "column", sm: "row" }}
              pl={15}
              pt={5}
              justify="flex-start"
              align="flex-start"
              wrap="wrap"
            >
              <Text fz="sm" c="dimmed">
                Open trip
              </Text>
              <Space w="md" />
              <Text fz="sm" c="dimmed">
                Private trip
              </Text>
              <Space w="md" />
              <Text fz="sm" c="dimmed">
                Promo
              </Text>
              <Space w="md" />
              <Text fz="sm" c="dimmed">
                Angkasa pura
              </Text>
              <Space w="md" />
              <Text fz="sm" c="dimmed">
                Company outbound
              </Text>
            </Flex>
          </div>
        </Group>
        <Group position="right" spacing="xs" grow>
          <Button m={0} onClick={() => (window.location.href = "/auth/login")}>
            Sign in
          </Button>
          {/* {!session && (
          )}
          {session?.user && (
            <Menu shadow="md" width={200} position="bottom-end">
              <Menu.Target>
                <UnstyledButton>
                  <Group spacing="xs" style={{ flexWrap: "nowrap" }}>
                    {session.user.image ? (
                      <Avatar size={40} src={session.user.image} />
                    ) : (
                      <Avatar size={40} color="blue">
                        {session.user.name
                          ?.split(" ")
                          ?.map((e) => e.charAt(0).toUpperCase())}
                      </Avatar>
                    )}
                    <Group spacing="0">
                      <Text size="xs" className="prevent-overflow">
                        {nameOverflow(session?.user?.name)}
                      </Text>
                      <Text
                        size="xs"
                        color="dimmed"
                        className="prevent-overflow"
                      >
                        {emailOverflow(session.user.email)}
                      </Text>
                    </Group>
                  </Group>
                </UnstyledButton>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>Settings</Menu.Label>
                <Menu.Item
                  icon={<IconLogout size={14} />}
                  onClick={(e) => {
                    e.preventDefault();
                    signOut();
                  }}
                >
                  <UnstyledButton>Sign out</UnstyledButton>
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          )} */}
        </Group>
      </Container>
    </Header>
  );
}
