import { useRef } from "react";
import { Carousel } from "@mantine/carousel";
import { Image } from "@mantine/core";
import Autoplay from "embla-carousel-autoplay";
import { IconArrowRight, IconArrowLeft } from "@tabler/icons";

export default function Component(props) {
  const autoplay = useRef(Autoplay({ delay: 2000 }));
  return (
    props?.images && (
      <Carousel
        withIndicators
        loop
        height="100%"
        nextControlIcon={<IconArrowRight size={16} />}
        previousControlIcon={<IconArrowLeft size={16} />}
        plugins={[autoplay.current]}
        onMouseEnter={autoplay.current.stop}
        onMouseLeave={autoplay.current.reset}
        {...props}
      >
        {props.images.map((each) => (
          <Carousel.Slide key={btoa(each.src)}>
            <Image
              alt={each.alt || each.src}
              src={each.src}
              withPlaceholder={!each.src}
            />
          </Carousel.Slide>
        ))}
      </Carousel>
    )
  );
}
