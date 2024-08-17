import { createWorker,PSM, type RecognizeOptions,OEM, type ImageLike } from 'tesseract.js';


export async function ocr_captcha( 
  img:ImageLike,
  options: Partial<RecognizeOptions>={},
  char_whitelist:string="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
):Promise<string>{

      const worker = await createWorker('eng',OEM.DEFAULT,
        //{logger: m => console.log(m)}
      );
      await worker.setParameters({
        tessedit_char_whitelist:char_whitelist,
        tessedit_pageseg_mode: PSM.SINGLE_CHAR
      });
      const ret = await worker.recognize(img,options);
      console.log("CAPTCHA:"+ret.data.text);
      worker.terminate();
      return ret.data.text;
      //await worker.terminate();
  }
