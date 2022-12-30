import { Container, Text, Card, Grid } from "@mantine/core";
import { Parser as HtmlToReactParser } from "html-to-react";
import { ContactUsForm } from "components/layout/contact-us-form";

export default function StaticPage({ data, keyOfPage, myt }) {
  const htmlToReactParser = new HtmlToReactParser();
  const reactElement = htmlToReactParser.parse(data);
  return (
    <Container px={0}>
      <Grid>
        <Grid.Col span={12}>
          <Card>
            <Text>{reactElement}</Text>
          </Card>
          {keyOfPage === "contact" && (
            <Card>
              <ContactUsForm {...{ myt }} />
            </Card>
          )}
        </Grid.Col>
      </Grid>
    </Container>
  );
}
