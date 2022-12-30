import { forwardRef } from "react";
import { Group, Avatar, Text } from "@mantine/core";

const AutoCompleteItem = forwardRef(
  ({ slug, name, subtitle, thumbnail, ...others }, ref) => (
    <div ref={ref} {...others}>
      <Group noWrap>
        <Avatar
          src={`${process.env.NEXT_PUBLIC_CONTENT_URI}/assets/uploads/files/products/${thumbnail}`}
        />

        <div>
          <Text>{name}</Text>
          <Text style={{ cursor: "pointer" }} size="xs" color="dimmed">
            {subtitle}
          </Text>
        </div>
      </Group>
    </div>
  )
);
AutoCompleteItem.displayName = "AutoCompleteItem";

export default AutoCompleteItem;
