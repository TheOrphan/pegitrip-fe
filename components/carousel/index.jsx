import { useRef } from "react";
import { Carousel } from "@mantine/carousel";
import { Image, createStyles } from "@mantine/core";
import Autoplay from "embla-carousel-autoplay";
import { IconArrowRight, IconArrowLeft } from "@tabler/icons";

const useStyles = createStyles((_theme, _params, getRef) => ({
  controls: {
    ref: getRef("controls"),
    transition: "opacity 150ms ease",
    opacity: 0,
  },

  root: {
    "&:hover": {
      [`& .${getRef("controls")}`]: {
        opacity: 1,
      },
    },
  },
}));

export default function Component(props) {
  const { classes } = useStyles();
  const autoplay = useRef(Autoplay({ delay: 5000 }));
  const slider = {
    slideSize: "33.333333%",
    height: 200,
    slideGap: "md",
    breakpoints: [
      { maxWidth: "md", slideSize: "50%" },
      { maxWidth: "sm", slideSize: "100%", slideGap: 0 },
    ],
  };
  return (
    props?.images && (
      <Carousel
        classNames={classes}
        withIndicators
        width="100%"
        loop
        align="start"
        nextControlIcon={<IconArrowRight size={16} />}
        previousControlIcon={<IconArrowLeft size={16} />}
        {...(!props.autoplay
          ? {
              ...{
                plugins: [autoplay.current],
                onMouseEnter: autoplay.current.stop,
                onMouseLeave: autoplay.current.reset,
              },
            }
          : {})}
        {...(props.slider ? { ...slider, ...props } : { ...props })}
      >
        {props.images.map((each) => (
          <Carousel.Slide key={btoa(each.src)}>
            <div
              style={{
                backgroundImage: `url(${each.src})`,
                height: 200,
                backgroundAttachment: "fixed",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                borderRadius: 20,
              }}
            />
            {/* <Image
              radius="md"
              width={400}
              height={200}
              alt={each.alt || each.src}
              src={each.src}
              withPlaceholder={!each.src}
            /> */}
          </Carousel.Slide>
        ))}
      </Carousel>
    )
  );
}
