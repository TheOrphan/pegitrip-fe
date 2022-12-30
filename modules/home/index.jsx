import CardList from "../../components/cardlist";
import Carousel from "../../components/carousel";
import { Container, Skeleton, Title, Menu, ActionIcon } from "@mantine/core";
import useBanner from "../../lib/hooks/useBanner";
import {
  IconHeadset,
  IconBrandInstagram,
  IconBrandWhatsapp,
  IconBrandYoutube,
} from "@tabler/icons";

export default function Page({ datalist, socialMedias }) {
  const { banners, isLoading, isError } = useBanner();
  return (
    <div style={{ position: "relative" }}>
      <Container p={0} mb={"1em"}>
        {!isError && (
          <Skeleton visible={isLoading}>
            <Carousel
              {...{
                images: banners?.map((each) => {
                  return {
                    src: `${process.env.NEXT_PUBLIC_CONTENT_URI}/assets/uploads/files/contents/${each.image}`,
                  };
                }),
                autoPlay: true,
                infiniteLoop: true,
                interval: 5000,
              }}
            />
          </Skeleton>
        )}
      </Container>
      {datalist.map((each) => (
        <div key={(Math.random() + 1).toString(36).substring(7) + each.name}>
          <Title order={2} className="marker-font" pt="lg" pb="xs">
            {each.name}
          </Title>
          <CardList {...{ isLoading: false, products: each.products }} />
          <br />
        </div>
      ))}
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
              href={socialMedias?.filter((res) => res.key === e.key)[0].value}
              rel="noopener noreferrer"
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
