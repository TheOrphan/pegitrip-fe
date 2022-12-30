import * as crypto from "crypto";

const algorithm = "aes256"; //algorithm to use
const key = "NkTheOrphanRnTrWt3y5A7DanTrhn3y5";
const iv = "e85f0fe3756cca7f"; // generate different ciphertext everytime

export const encrypt = (text) => {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const encrypted = cipher.update(text, "utf8", "hex") + cipher.final("hex"); // encrypted text
  return encrypted;
};

export const decrypt = (encrypted) => {
  try {
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    const decrypted =
      decipher.update(encrypted, "hex", "utf8") + decipher.final("utf8"); //deciphered text
    return decrypted;
  } catch (error) {
    return false;
  }
};
