import Jimp from "jimp";

export async function prepare(img:HTMLImageElement):Promise<void>{

  let url = img.src.split(',')[1];
  let buffer=Buffer.from(url,"base64");

  const image = await Jimp.read(img.src);
  console.log("read done")
  image.threshold({ max: 200, replace: 200, autoGreyscale: false });
  console.log("process done")
  img.src=await image.getBase64Async(Jimp.MIME_PNG);
  console.log("prepare done")
}