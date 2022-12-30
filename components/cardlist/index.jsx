import Link from "next/link";
import {
  Card,
  Image,
  Text,
  Badge,
  Group,
  Grid,
  Skeleton,
  Button,
} from "@mantine/core";
import { IconArrowBackUp } from "@tabler/icons";
import MyModal from "./modal";

export default function Component(props) {
  return (
    <Grid gutter="xs">
      {props.isLoading && !props.products
        ? [...Array(20)].map((e, i) => (
            <Grid.Col span={2} key={e + "skeleton" + i}>
              <Card shadow="sm" p="sm" radius="lg">
                <Skeleton />
              </Card>
            </Grid.Col>
          ))
        : props.products.map((each) => (
            <Grid.Col span={2} key={each.thumbnail + each.name}>
              <Link
                href={each?.slug === "/" ? "/" : "product/" + each?.slug || "#"}
              >
                <Card
                  shadow="sm"
                  p="xs"
                  radius="lg"
                  style={{ cursor: "pointer", padding: 10 }}
                >
                  {!props.noimage && (
                    <Card.Section>
                      {each?.thumbnail === "go-back" ? (
                        <Button
                          color="gray"
                          variant="outline"
                          radius="md"
                          size="xl"
                          my="sm"
                          mx="auto"
                          style={{ display: "flex" }}
                        >
                          <IconArrowBackUp size={48} />
                        </Button>
                      ) : (
                        <Image
                          src={
                            `${process.env.NEXT_PUBLIC_CONTENT_URI}/assets/uploads/files/products/${each?.thumbnail}` ||
                            "https://via.placeholder.com/300x180"
                          }
                          height={180}
                          alt={each?.name || each?.name || "no image available"}
                        />
                      )}
                    </Card.Section>
                  )}
                  <Group
                    position="apart"
                    style={{
                      marginBottom: 0,
                      marginTop: 8,
                      justifyContent: "center",
                    }}
                  >
                    <Text weight={180} style={{ textAlign: "center" }}>
                      {each?.name}
                    </Text>
                    {/* <Badge color="pink" variant="light">
                      On Sale
                    </Badge> */}
                  </Group>
                </Card>
              </Link>
            </Grid.Col>
          ))}
    </Grid>
  );
}
