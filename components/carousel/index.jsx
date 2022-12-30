import { Carousel } from "react-responsive-carousel";
import { Image } from "@mantine/core";

export default function Component(props) {
  return (
    props?.images && (
      <Carousel
        showStatus={false}
        showThumbs={false}
        emulateTouch
        showArrows
        {...props}
      >
        {props.images.map((each) => (
          <Image
            key={each}
            src={each.src}
            alt={each.alt || each.src}
            withPlaceholder={!each.src}
          />
        ))}
      </Carousel>
    )
  );
}
