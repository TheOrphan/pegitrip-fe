import {
  Container,
  Text,
  Card,
  Grid,
  Paper,
  Button,
  Group,
} from "@mantine/core";
import { IconChecks, IconShoppingBag } from "@tabler/icons";

export default function Page({ transactionDetail }) {
  const { transaction, product, variant } = transactionDetail;
  console.log(product);
  return (
    <Container px={0}>
      <Grid justify="center">
        <Grid.Col span={12}>
          <Card withBorder radius="md" p={0}>
            <Group noWrap spacing={0}>
              <div
                style={{
                  backgroundImage: `url(${process.env.NEXT_PUBLIC_CONTENT_URI}/assets/uploads/files/products/${product?.thumbnail})`,
                  height: 600,
                  width: "100%",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                }}
              />
              <div style={{ padding: "2rem" }}>
                <Text size="xl" weight={500} mb="xl">
                  Ringkasan Pesanan
                </Text>
                <Text fw={700} mt={3}>
                  {product.name}
                </Text>
                <Text fw={700} mb="xl">
                  {variant}
                </Text>
                <Text>Order ID</Text>
                <Text fw={700} mb="md">
                  {transaction.invoice_number}
                </Text>
                <Text>Email</Text>
                <Text fw={700} mb="md">
                  {transaction.user_id.split("@@@")[1]}
                </Text>
                <Text>Total Pembayaran</Text>
                <Text fw={700} mb="md">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    maximumSignificantDigits: 3,
                  }).format(transaction.total_price) || "-"}
                </Text>
                <Text>Status Pembayaran</Text>
                <Text fw={700} mb="xl">
                  {transaction.status === 0
                    ? "Menunggu pembayaran"
                    : transaction.status === 1
                    ? "Pembayaran berhasil"
                    : "Pembelian gagal"}
                </Text>
                <Paper mt={3}>
                  {transaction.status === 0 ? (
                    <Button
                      fullWidth
                      onClick={() => {
                        window.snap.pay(transaction.snap_token);
                      }}
                    >
                      Bayar
                    </Button>
                  ) : transaction.status === 1 ? (
                    <Button
                      fullWidth
                      leftIcon={<IconChecks size={14} />}
                      color="lime"
                    >
                      Terima kasih
                    </Button>
                  ) : (
                    <Button
                      fullWidth
                      leftIcon={<IconShoppingBag size={14} />}
                      color="orange"
                      onClick={() => {
                        window.location.href = `/product/${product.slug}`;
                      }}
                    >
                      Kembali berbelanja
                    </Button>
                  )}
                </Paper>
              </div>
            </Group>
          </Card>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
