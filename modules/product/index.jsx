import {
  Container,
  Text,
  Image,
  Card,
  Badge,
  Grid,
  Button,
  Accordion,
  TextInput,
  NumberInput,
  Select,
  Chip,
  Modal,
  Table,
  createStyles,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useId } from "@mantine/hooks";
// import { useSession } from "next-auth/react";
import LoadingComp from "../../components/loading";
import { useProductBySlug } from "../../lib/hooks/useProduct";
import { useCheckRoleApi } from "../../lib/hooks/useCustomApi";
import useProductForm from "../../lib/hooks/useProductForm";
import usePaymentMethodC from "../../lib/hooks/usePaymentMethodC";
import usePaymentMethod from "../../lib/hooks/usePaymentMethod";
import useVariant from "../../lib/hooks/useVariant";
import { useState } from "react";
import { Paper } from "@mantine/core";
import { useEffect } from "react";
import * as dayjs from "dayjs";
import { showNotification } from "@mantine/notifications";
import { IconCheck, IconBug } from "@tabler/icons";
import { encrypt } from "lib/crypto";

export default function Products({ slug, myt, qParams }) {
  // const { data: session, status } = useSession();

  const { classes } = useStyles();
  const { classes: chipClasses } = useChipStyles();
  const uuid = (id) => useId(id);

  const [requiredForm, setRequiredForm] = useState([]);
  const [modalClue, setModalClueVisible] = useState(false);
  const [theVariant, setVariant] = useState(0);
  const [paymentMethodChoosen, setPaymentMethod] = useState(null);
  const [verified, setVerified] = useState(false);
  const [onSubmitting, setSubmitting] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [onPurchasing, setPurchasing] = useState(false);
  const [userNickname, setUserNickname] = useState("");

  const { product, isLoading, isError } = useProductBySlug(slug);
  const { checkRoleAPI } = useCheckRoleApi(product?.id);

  const getNickname = async (values) => {
    const reqNickname = await fetch("/api/get-nickname/mole", {
      method: "post",
      body: JSON.stringify({
        values,
        checkRoleAPI,
      }),
    });
    const response = await reqNickname.json();
    setUserNickname(response?.data?.username);
  };

  const form = useForm({
    validate: {
      requiredForm: (val) => (val.length > 0 ? null : "Mohon lengkapi data"),
      variant: (val) => (!val ? "Mohon pilih nominal" : null),
      // paymentMethod: (val) =>
      //   !val ? "Mohon konfirmasi cara pembayaran" : null,
      captcha: (val) => (!val ? "Captcha failed" : null),
      wa: (val) =>
        Math.ceil(Math.log10(val + 1)) < 9
          ? "WhatsApp should at least 9 characters"
          : null,
    },
  });

  useEffect(() => {
    if (requiredForm) {
      form.setFieldValue("requiredForm", requiredForm);
    }
  }, [requiredForm]);

  const verifiedCallback = () => {
    setVerified(true);
    form.setFieldValue("captcha", true);
  };

  const {
    variants,
    isLoading: isLoadV,
    isError: isErrV,
  } = useVariant(product?.id);
  const {
    forms,
    isLoading: isLoadF,
    isError: isErrF,
  } = useProductForm(product?.id);
  const {
    paymentMethodC,
    isLoading: isLoadPC,
    isError: isErrPC,
  } = usePaymentMethodC();
  const {
    paymentMethod,
    isLoading: isLoadPM,
    isError: isErrPM,
  } = usePaymentMethod();

  useEffect(() => {
    if (qParams.status_code || qParams.transaction_status) {
      if (
        qParams.status_code === 200 ||
        qParams.transaction_status === "capture"
      ) {
        showNotification({
          id: "purchase-letter",
          title: (
            <Text color="white">
              Thank you for purchasing! <br />
              Please check your email.
            </Text>
          ),
          color: "green",
          icon: <IconCheck size={20} />,
          onClose: () => window.location.reload(),
        });
      } else {
        showNotification({
          id: "purchase-error",
          title: "Error occurred when purchasing!",
          message: (
            <Text color="white">
              There is an error occurred. If you believe the error in our side,
              Do not hesitate to contact us.
            </Text>
          ),
          color: "red",
          icon: <IconBug size={20} />,
        });
      }
    }
  }, [qParams]);

  return (
    <Container px={0}>
      <Grid>
        <Grid.Col span={4}>
          <Card shadow="sm" radius="lg" style={{ padding: 0 }}>
            {isLoading ||
            isLoadV ||
            isLoadPM ||
            isLoadPC ||
            isLoadF ||
            !product?.id ? (
              <LoadingComp />
            ) : (
              <>
                <Card.Section>
                  <Image
                    src={
                      !isError
                        ? `${process.env.NEXT_PUBLIC_CONTENT_URI}/assets/uploads/files/products/${product?.thumbnail}`
                        : "https://via.placeholder.com/300x150"
                    }
                    alt={product?.name}
                    withPlaceholder
                  />
                </Card.Section>
                <div style={{ padding: "1rem" }}>
                  <Text size="lg" weight={500}>
                    {product?.name}
                  </Text>
                  <Badge color="pink" variant="light">
                    {product?.subtitle}
                  </Badge>
                  {/* <Badge color="pink" variant="light" ml={"xs"}>
                  24 JAM
                </Badge> */}
                  <div
                    dangerouslySetInnerHTML={{
                      __html: product?.instruction_text,
                    }}
                  />
                </div>
              </>
            )}
          </Card>
        </Grid.Col>
        <Grid.Col span={8} px={0}>
          <Card shadow="sm" radius="lg">
            <Container pl={0}>
              <form
                onSubmit={form.onSubmit(
                  async (values, _event) => {
                    setSubmitting(true);
                    // console.log(values);
                    getNickname({
                      user_id: requiredForm[0].value,
                      zone_id: requiredForm[1].value,
                    });
                    setModalVisible(true);
                  },
                  (validationErrors, _values, _event) => {
                    console.log(validationErrors);
                  }
                )}
                onReset={form.onReset}
              >
                {forms?.map((e, i) => {
                  const props = {
                    placeholder: e.placeholder,
                    label: e.label,
                    required: true,
                    mt: i > 0 && "xs",
                    key: uuid(e.label + i),
                    onChange: (evOrVal) =>
                      setRequiredForm((prev) => {
                        const currForm = {
                          label: e.label,
                          value:
                            e.type === "input"
                              ? evOrVal?.target?.value
                              : evOrVal,
                        };
                        const sameIdx = prev.findIndex(
                          (old) => old.label === e.label
                        );
                        if (sameIdx > -1) {
                          prev[sameIdx] = currForm;
                          return prev;
                        }
                        return [...prev, currForm];
                      }),
                  };

                  const selectData = e?.value?.split(";") || [];
                  if (e.type === "input") {
                    return <TextInput {...props} />;
                  } else if (e.type === "select") {
                    return <Select {...props} data={selectData} />;
                  } else if (e.type === "integer") {
                    return <NumberInput {...props} />;
                  }
                })}
                <Text color="red" size="sm">
                  {form.errors.requiredForm}
                </Text>
                {product?.nickname_clue && (
                  <Text size="sm" my={10} ta="right">
                    <Button onClick={() => setModalClueVisible(true)}>
                      Petunjuk
                    </Button>
                    <Modal
                      opened={modalClue}
                      onClose={() => setModalClueVisible(false)}
                      p={10}
                    >
                      <img
                        src={`${process.env.NEXT_PUBLIC_CONTENT_URI}/assets/uploads/files/products/${product?.nickname_clue}`}
                        alt="petunjuk-image"
                        width={"100%"}
                      />
                    </Modal>
                  </Text>
                )}
                <Text size="sm" weight={700} transform="uppercase" mt={"xs"}>
                  Pilih Nominal
                </Text>
                <Text color="red" size="sm">
                  {form.errors.variant}
                </Text>
                <Chip.Group
                  style={{ marginTop: 4 }}
                  onChange={(value) => {
                    form.setFieldValue("product", product?.name);
                    form.setFieldValue("variant", value);
                    setVariant(value);
                  }}
                >
                  {variants?.map((e, i) => (
                    <Chip
                      key={uuid(e.variant_name + i)}
                      value={
                        e.variant_name + ";" + e.variant_price + ";" + e.id
                      }
                      classNames={chipClasses}
                    >
                      {e.thumbnail && (
                        <img
                          src={`${process.env.NEXT_PUBLIC_CONTENT_URI}/assets/uploads/files/variants/${e.thumbnail}`}
                          alt="variant-icon"
                          height={20}
                          style={{ marginRight: 10 }}
                        />
                      )}
                      {/* thumbnail */}
                      {e.variant_name +
                        " - " +
                        new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          maximumSignificantDigits: 3,
                        }).format(e.variant_price)}
                    </Chip>
                  ))}
                </Chip.Group>
                <TextInput
                  placeholder="Masukan NOMOR WA kamu"
                  label="NOMOR WA AKTIF"
                  required
                  mt={"xs"}
                  onChange={(event) =>
                    form.setFieldValue("wa", event.currentTarget.value)
                  }
                />
                <TextInput
                  placeholder="Masukan alamat email kamu"
                  label="Email"
                  required
                  mt={"xs"}
                  onChange={(event) =>
                    form.setFieldValue("email", event.currentTarget.value)
                  }
                />
                <Text color="red" size="sm">
                  {form.errors.wa}
                </Text>
                {!theVariant ? null : (
                  <>
                    {/* <Text
                      size="sm"
                      weight={700}
                      transform="uppercase"
                      mt={"xs"}
                    >
                      Pilih METODE PEMBAYARAN
                    </Text>
                    <Text color="red" size="sm">
                      {form.errors.paymentMethod}
                    </Text>
                    <Accordion
                      radius="xs"
                      mx="auto"
                      mt="xs"
                      variant="filled"
                      classNames={classes}
                      className={classes.root}
                    >
                      {paymentMethodC?.map((e, i) => (
                        <Accordion.Item
                          value={e.name + i}
                          key={uuid(e.name + i)}
                        >
                          <Accordion.Control>{e.name}</Accordion.Control>
                          <Accordion.Panel>
                            <Chip.Group
                              onChange={(value) => {
                                form.setFieldValue("paymentMethod", value);
                                setPaymentMethod(value);
                              }}
                              value={paymentMethodChoosen}
                            >
                              {paymentMethod?.map((pm, ipm) => {
                                const totalPrice =
                                  parseInt(theVariant.split(";")[1]) +
                                  parseInt(pm.fee);
                                return (
                                  pm.payment_method_id === e.id && (
                                    <Chip
                                      classNames={chipClasses}
                                      value={
                                        pm.tenant_name +
                                        ";" +
                                        totalPrice +
                                        ";" +
                                        pm.id
                                      }
                                      key={uuid(pm.tenant_name + ipm)}
                                    >
                                      {pm.icon && (
                                        <img
                                          src={`${process.env.NEXT_PUBLIC_CONTENT_URI}/assets/uploads/files/payment-methods/${pm.icon}`}
                                          alt="payment-method-icon"
                                          height={20}
                                          style={{ marginRight: 10 }}
                                        />
                                      )}
                                      {pm.tenant_name} -{" "}
                                      {new Intl.NumberFormat("id-ID", {
                                        style: "currency",
                                        currency: "IDR",
                                        maximumSignificantDigits: 3,
                                      }).format(totalPrice)}
                                    </Chip>
                                  )
                                );
                              })}
                            </Chip.Group>
                          </Accordion.Panel>
                        </Accordion.Item>
                      ))}
                    </Accordion> */}
                    <Paper style={{ width: 150 }} my={20}></Paper>
                    <Text color="red" size="sm">
                      {form.errors.captcha}
                    </Text>
                    <Button
                      disabled={!verified}
                      fullWidth
                      type="submit"
                      mt={"lg"}
                      loading={onSubmitting}
                    >
                      Lanjut Bayar
                    </Button>
                  </>
                )}
              </form>
            </Container>
          </Card>
        </Grid.Col>
      </Grid>
      <Modal
        opened={modalVisible}
        onClose={() => setModalVisible(false)}
        title="Data Pesanan"
        centered
        closeOnClickOutside={false}
        closeOnEscape={false}
        withCloseButton={false}
      >
        <Table>
          <tbody>
            <tr key={uuid("produk")}>
              <td>Produk</td>
              <td>{form.values?.product}</td>
            </tr>
            <tr key={uuid("nickname")}>
              <td>Nickname</td>
              <td>
                <Text color={!userNickname && "red"} size="sm">
                  {userNickname || "Invalid Server and ML ID"}
                </Text>
              </td>
            </tr>
            {form.values?.requiredForm?.map((each, idx) => (
              <tr key={uuid("requiredForm" + idx)}>
                <td>{each.label}</td>
                <td>{each.value}</td>
              </tr>
            ))}
            <tr key={uuid("variant")}>
              <td>Nominal</td>
              <td>{form.values?.variant?.split(";")[0]}</td>
            </tr>
            <tr key={uuid("paymentMethod2")}>
              <td>Harga Belanja</td>
              <td>
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  maximumSignificantDigits: 3,
                }).format(form.values?.variant?.split(";")[1]) || "-"}
              </td>
            </tr>
            <tr key={uuid("layanan")}>
              <td>Biaya layanan</td>
              <td>Rp 2.000</td>
            </tr>
            <tr key={uuid("promo")}>
              <td>Promo</td>
              <td>{form.values?.promo || "-"}</td>
            </tr>
            <tr key={uuid("paymentMethod0")}>
              <td>Total harga</td>
              <td>
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  maximumSignificantDigits: 3,
                }).format(
                  2000 + parseInt(form.values?.variant?.split(";")[1])
                ) || "-"}
              </td>
            </tr>
            {/* <tr key={uuid("paymentMethod1")}>
              <td>Metode Pembayaran</td>
              <td>{form.values?.paymentMethod?.split(";")[0] || "-"}</td>
            </tr> */}
          </tbody>
        </Table>
        <Grid mt={"1rem"} justify="flex-end" align="center">
          <Paper>
            <Button
              disabled={!userNickname}
              variant="subtle"
              onClick={() => {
                setPurchasing(true);
                order({ ...form.values, myt });
              }}
              loading={onPurchasing}
            >
              Beli Sekarang
            </Button>
            <Button
              variant="filled"
              color="red"
              onClick={() => {
                window.location.reload();
                setModalVisible((o) => !o);
              }}
              loading={onPurchasing}
            >
              Batalkan Pesanan
            </Button>
          </Paper>
        </Grid>
      </Modal>
    </Container>
  );
}
const order = async (dataOrder) => {
  const invoiceNumber = `OU-${dataOrder || "G"}-${dayjs().format(
    "YYYYMMDDTHHmmsss"
  )}`;
  // const grossAmount = 2000 + parseInt(dataOrder.paymentMethod?.split(";")[1]);
  const grossAmount = 2000 + parseInt(dataOrder.variant?.split(";")[1]);
  const dataInvoice = {
    emailInvoice: {
      dataOrder,
      expired: dayjs().add(3, "hour").format("DD-MM-YYYY HH:mm"),
      status: "pending",
      wording:
        "Harap dibayar sebelum 3 jam! Segera lakukan pembayaran sesuai total yang harus di bayar.",
      uid_invoice: dataOrder.requiredForm.map((e) => e.value + " ").toString(),
      rek_seller: "0112131931 A/N BAPAK PENJUAL",
    },
    email: dataOrder.email,
    variant_id: dataOrder.variant?.split(";")[2],
    // payment_fee_id: dataOrder.paymentMethod?.split(";")[2],
    user_id: dataOrder || "guest@@@" + dataOrder.email,
    phone: dataOrder.wa,
    invoice_number: invoiceNumber,
    total_price: grossAmount,
    uid_game: JSON.stringify(dataOrder.requiredForm),
    created_at: dayjs().format("DD-MM-YYYY HH:mm"),
    captcha: dataOrder.captcha,
    myt: dataOrder.myt,
  };

  const doTrx = await fetch("/api/trx", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data: encrypt(JSON.stringify(dataInvoice)) }),
  });
  if (doTrx.status === 200) {
    const trxRes = await doTrx.json();
    window.location.href = `/payment?trxId=${invoiceNumber}`;
  } else {
    showNotification({
      id: "purchase-error",
      title: "Error occurred when purchasing!",
      message: (
        <Text color="white">
          There is an error occurred. If you believe the error in our side, Do
          not hesitate to contact us.
        </Text>
      ),
      color: "red",
      icon: <IconBug size={20} />,
    });
  }
};

const useStyles = createStyles((theme) => ({
  root: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[6]
        : theme.colors.gray[0],
    borderRadius: theme.radius.sm,
  },

  item: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[6]
        : theme.colors.gray[0],
    border: "1px solid transparent",
    position: "relative",
    zIndex: 0,
    transition: "transform 150ms ease",
    "&[data-active]": {
      transform: "scale(1.03)",
      backgroundColor:
        theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
      boxShadow: theme.shadows.md,
      borderColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[4]
          : theme.colors.gray[2],
      borderRadius: theme.radius.md,
    },
  },
  control: { padding: 14 },
  chevron: {
    "&[data-rotate]": {
      transform: "rotate(-90deg)",
    },
  },
}));

const useChipStyles = createStyles((theme) => ({
  label: {
    height: 40,
    lineHeight: "2.5em",
  },
}));
