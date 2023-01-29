import PocketBase from "pocketbase";

export default async function pbAuth() {
  const pb = new PocketBase(process.env.NEXT_PUBLIC_BE_URI);
  await pb
    .collection("users")
    .authWithPassword(
      process.env.NEXT_PUBLIC_BE_USERNAME,
      process.env.NEXT_PUBLIC_BE_PASSWORD
    );

  return pb;
}
