const emailOverflow = (email) => {
  const emailLen = email.length;
  if (emailLen > 24) {
    const each = email.split("@");
    const domainLen = each[1].length + 1;
    const addressLen = each[0].length;
    const substrLen = 24 - domainLen;
    return (
      each[0].substr(0, Math.floor(substrLen / 2)) +
      "..." +
      each[0].substr(addressLen - Math.floor(substrLen / 3), addressLen) +
      "@" +
      each[1]
    );
  }
  return email;
};

export { emailOverflow };
