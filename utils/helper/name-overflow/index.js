const nameOverflow = (name) => {
  const nameLen = name?.length;
  if (nameLen > 24) {
    const each = name.split(" ");
    return (
      each[0].charAt(0).toUpperCase() +
      each[0].slice(1) +
      " " +
      each[1].charAt(0).toUpperCase()
    );
  }
  return name
    ?.split(" ")
    ?.map((e) => e.charAt(0).toUpperCase() + e.slice(1) + " ");
};

export { nameOverflow };
