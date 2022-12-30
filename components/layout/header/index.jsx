import { useState } from "react";
import useSWR from "swr";
import { useDebouncedValue } from "@mantine/hooks";
import {
  Grid,
  Image,
  Select,
  Text,
  Button,
  Container,
  UnstyledButton,
  Group,
  Avatar,
  Menu,
  Skeleton,
} from "@mantine/core";
import Link from "next/link";
import AutoCompleteItem from "./AutoComplete";
import { signOut, useSession } from "next-auth/react";
import { IconLogout } from "@tabler/icons";

const fetcher = async (key) =>
  fetch(process.env.NEXT_PUBLIC_BE_URI + "/api/products?search=" + key).then(
    (res) => res.json()
  );

export default function Page() {
  const [searchVal, setSearch] = useState("");
  const [search] = useDebouncedValue(searchVal, 200);

  const { data: session, status } = useSession();
  const loading = status === "loading";
  const { data: searchData } = useSWR(
    `/api/products?search=${search}`,
    fetcher
  );
  const nameOverflow = (name) => {
    const nameLen = name?.length;
    if (nameLen > 24) {
      const each = name.split(" ");
      return (
        each[0].charAt(0).toUpperCase() +
        each[0].slice(1) +
        " " +
        each[1].charAt(0).toUpperCase()
      );
    }
    return name
      ?.split(" ")
      ?.map((e) => e.charAt(0).toUpperCase() + e.slice(1) + " ");
  };
  const emailOverflow = (email) => {
    const emailLen = email.length;
    if (emailLen > 24) {
      const each = email.split("@");
      const domainLen = each[1].length + 1;
      const addressLen = each[0].length;
      const substrLen = 24 - domainLen;
      return (
        each[0].substr(0, Math.floor(substrLen / 2)) +
        "..." +
        each[0].substr(addressLen - Math.floor(substrLen / 3), addressLen) +
        "@" +
        each[1]
      );
    }
    return email;
  };
  return (
    <Container px={0}>
      <noscript>
        <style>{`.nojs-show { opacity: 1; top: 0; }`}</style>
      </noscript>
      <Grid align="center" gutter="xs" grow>
        <Grid.Col
          span={12}
          px={50}
          py={5}
          sx={(theme) => ({
            backgroundColor: theme.colors.gray,
          })}
        >
          <Group position="right">
            <Link href="/static/about">
              <Text style={{ cursor: "pointer" }} size="xs" color="dimmed">
                Tentang Bakul Voucher Game
              </Text>
            </Link>
            <Text style={{ cursor: "pointer" }} size="xs" color="dimmed">
              Jadi Mitra
            </Text>
            <Text style={{ cursor: "pointer" }} size="xs" color="dimmed">
              Promo
            </Text>
            <Text style={{ cursor: "pointer" }} size="xs" color="dimmed">
              Invoice
            </Text>
            <Link href="/static/contact-us">
              <Text style={{ cursor: "pointer" }} size="xs" color="dimmed">
                Contact
              </Text>
            </Link>
            <Text style={{ cursor: "pointer" }} size="xs" color="dimmed">
              Price List
            </Text>
            <Link href="/static/ketentuan-dan-kondisi">
              <Text style={{ cursor: "pointer" }} size="xs" color="dimmed">
                Ketentuan dan Kondisi
              </Text>
            </Link>
            <Link href="/static/kebijakan-privasi">
              <Text style={{ cursor: "pointer" }} size="xs" color="dimmed">
                Privacy and policy
              </Text>
            </Link>
          </Group>
        </Grid.Col>
        <Grid.Col span={2}>
          <Link href="/">
            <Image
              fit="contain"
              src="/image/logo.png"
              alt="our-brand-logo"
              style={{ paddingBottom: "1rem" }}
            />
          </Link>
        </Grid.Col>
        <Grid.Col span={!session ? 8 : 7}>
          <Select
            placeholder="Cari mobile legend"
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
        </Grid.Col>
        <Grid.Col span={!session ? 1 : 3}>
          {loading ? (
            <Skeleton height={40} />
          ) : (
            <Group position="right" spacing="xs" grow>
              {!session && (
                <Button
                  m={0}
                  onClick={() => (window.location.href = "/auth/login")}
                >
                  Sign in
                </Button>
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
              )}
            </Group>
          )}
        </Grid.Col>
      </Grid>
    </Container>
  );
}
