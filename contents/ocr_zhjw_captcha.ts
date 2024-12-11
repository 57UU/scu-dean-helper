import type { PlasmoCSConfig } from "plasmo"
import { createWorker,PSM } from 'tesseract.js';
import '/lib/ocr_captcha.ts';
import { ocr_captcha } from "~lib/ocr_captcha";



export const config: PlasmoCSConfig = {
  matches: ["*://zhjw.scu.edu.cn/*"],
  run_at: "document_end",
}

var img=document.getElementById("captchaImg")as HTMLImageElement;
var input=document.getElementById("input_checkcode") as HTMLInputElement;

img.addEventListener("click",function(){
  process();
});



async function process():Promise<void>{
  try{ 
    input.value=await ocr_captcha(img);
  }catch(e){

  }
}

process();
