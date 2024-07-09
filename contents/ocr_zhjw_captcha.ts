import type { PlasmoCSConfig } from "plasmo"
import { createWorker,PSM } from 'tesseract.js';
import '/lib/ocr_captcha.ts';
import { ocr_captcha } from "~lib/ocr_captcha";
import { prepare } from "~lib/prepare";
import { prepare_manual } from "~lib/prepare_manual";


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
    //await prepare(img);
    console.log("prepare start")
    //await prepare_manual(img);
    console.log("prepare done")
    input.value=await ocr_captcha(img);
  }catch(e){

  }
}

process();
