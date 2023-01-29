const getBase64FromUrl = async (url) => {
  const imageUrl = url;
  const imageUrlData = await fetch(imageUrl);
  const buffer = await imageUrlData.arrayBuffer();
  const stringifiedBuffer = Buffer.from(buffer).toString("base64");
  const contentType = imageUrlData.headers.get("content-type");
  return `data:image/${contentType};base64,${stringifiedBuffer}`;
};

export default getBase64FromUrl;
