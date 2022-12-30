import { useState } from "react";
import { Modal, Button, Group, TextInput, Select, Chip } from "@mantine/core";

export default function CustomModal() {
  const [opened, setOpened] = useState(true);

  return (
    <>
      <Modal
        centered
        opened={opened}
        onClose={() => setOpened(false)}
        title="BELI Nama Varian"
      >
        <TextInput placeholder="Masukan ID game kamu" label="ID" required />
        <TextInput
          placeholder="Masukan SERVER kamu"
          label="SERVER"
          required
          mt={"xs"}
        />
        <TextInput
          placeholder="Masukan NOMOR WA kamu"
          label="NOMOR WA AKTIF"
          required
          mt={"xs"}
        />
        <Select
          mt={"xs"}
          label="METODE PEMBAYARAN"
          placeholder="Pilih cara pembayaran"
          data={[
            { value: "react", label: "Saldo - 125.000" },
            { value: "ng", label: "Bank Transfer - 125.000" },
            { value: "svelte", label: "E Wallet - 125.000" },
            { value: "vue", label: "Virtual Account - 125.000" },
            { value: "vue", label: "Convenience Store - 125.000" },
          ]}
        />
        <Chip.Group mt={"md"}>
          <Chip value="react">BCA - 125.000</Chip>
          <Chip value="ng">BRI - 125.000</Chip>
          <Chip value="svelte">MANDIRI - 125.000</Chip>
          <Chip value="vue">BNI - 125.000</Chip>
        </Chip.Group>
        <Chip.Group mt={"md"}>
          <Chip value="react">Shoppe Pay QRIS - 125.000</Chip>
        </Chip.Group>
        <Chip.Group mt={"md"}>
          <Chip value="react">BCA - 125.000</Chip>
          <Chip value="ng">BRI - 125.000</Chip>
          <Chip value="svelte">MANDIRI - 125.000</Chip>
          <Chip value="vue">BNI - 125.000</Chip>
          <Chip value="vue1">BNC - 125.000</Chip>
          <Chip value="v2ue">CIMB NIAGA - 125.000</Chip>
          <Chip value="v3ue">DANAMON - 125.000</Chip>
          <Chip value="v4ue">MAYBANK - 125.000</Chip>
          <Chip value="v5ue">PERMATA - 125.000</Chip>
          <Chip value="vu6e">SINARMAS - 125.000</Chip>
          <Chip value="vu7e">BRIVA - 125.000</Chip>
          <Chip value="vu8e">MUAMALAT - 125.000</Chip>
          <Chip value="vu9e">SAMPOERNA - 125.000</Chip>
          <Chip value="vuge">BSI - 125.000</Chip>
        </Chip.Group>
        <Chip.Group mt={"md"}>
          <Chip value="react">ALFAMART - 125.000</Chip>
          <Chip value="ng">INDOMART - 125.000</Chip>
          <Chip value="svelte">ALFAMIDI - 125.000</Chip>
        </Chip.Group>
        <Button fullWidth mt={"lg"}>
          Lanjut Bayar
        </Button>
      </Modal>

      <Group position="center">
        <Button onClick={() => setOpened(true)}>Open Modal</Button>
      </Group>
    </>
  );
}
