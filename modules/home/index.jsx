import Carousel from "../../components/carousel";
import {
  Skeleton,
  Title,
  Card,
  Group,
  Badge,
  Text,
  Button,
  Grid,
  Menu,
  ActionIcon,
} from "@mantine/core";
import {
  IconHeadset,
  IconBrandInstagram,
  IconBrandWhatsapp,
  IconBrandYoutube,
  IconMapPin,
} from "@tabler/icons";
import useBanner from "../../lib/hooks/useBanner";
import useProduct from "../../lib/hooks/useProduct";

export default function Page({ socialMedias }) {
  const { banners, isLoading, isError } = useBanner();
  const { products, isLoading: isLoadingP, isError: isErrorP } = useProduct();

  return (
    <div style={{ position: "relative" }}>
      {!isError && (
        <Skeleton visible={isLoading}>
          <Carousel
            {...{
              slider: true,
              images: banners?.map((each) => {
                return {
                  src: `${each.imageSrc}`,
                };
              }),
            }}
          />
        </Skeleton>
      )}
      <Grid mt={20}>
        {!isErrorP && (
          <Skeleton visible={isLoadingP}>
            {products?.map((product) => (
              <Grid.Col
                xs={12}
                sm={6}
                md={4}
                lg={3}
                key={
                  (Math.random() + 1).toString(36).substring(7) + product.name
                }
              >
                <Card p="sm">
                  <Card.Section>
                    <Carousel
                      {...{
                        autoplay: false,
                        images: product.thumbnails?.map((each) => {
                          return {
                            src: `${each}`,
                          };
                        }),
                      }}
                    />
                  </Card.Section>
                  <Group position="apart" mt="sm">
                    <Badge color="pink" variant="light">
                      {product.subtitle}
                    </Badge>
                  </Group>
                  <Text weight={500}>{product.name}</Text>
                  <Text>{product.price}</Text>
                  <Text fz="md" mt={10}>
                    <IconMapPin size={14} /> {product.expand.location_id.name}
                  </Text>
                </Card>
              </Grid.Col>
            ))}
          </Skeleton>
        )}
      </Grid>
      <Menu
        shadow="md"
        style={{ position: "sticky", bottom: 5, float: "right" }}
      >
        <Menu.Target>
          <ActionIcon
            variant="light"
            color="yellow"
            onClick={() => scrollTo({ y: 0 })}
          >
            <IconHeadset size={22} />
          </ActionIcon>
        </Menu.Target>

        <Menu.Dropdown>
          {[
            { key: "ig", comp: <IconBrandInstagram size={24} />, col: "grape" },
            { key: "wa", comp: <IconBrandWhatsapp size={22} />, col: "lime" },
            {
              key: "youtube",
              comp: <IconBrandYoutube size={24} />,
              col: "red",
            },
          ].map((e, i) => (
            <a
              target="_blank"
              // href={socialMedias?.filter((res) => res.key === e.key)[0].value}
              rel="noopener noreferrer"
              key={i + e.col}
            >
              <ActionIcon
                key={i + e.col}
                variant="subtle"
                color={e.col}
                onClick={() => scrollTo({ y: 0 })}
              >
                {e.comp}
              </ActionIcon>
            </a>
          ))}
        </Menu.Dropdown>
      </Menu>
    </div>
  );
}
