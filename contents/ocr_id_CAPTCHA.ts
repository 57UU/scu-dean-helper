import type { PlasmoCSConfig } from "plasmo"
import { createWorker,PSM } from 'tesseract.js';
import '/lib/ocr_captcha.ts';
import { ocr_captcha } from "~lib/ocr_captcha";
import {ocr_external} from "lib/ocr_external"

export const config: PlasmoCSConfig = {
  matches: ["*://id.scu.edu.cn/*"],
  run_at: "document_end",
}

var img=document.getElementsByClassName("captcha-img")[0]as HTMLImageElement;
var input=document.getElementsByClassName("ivu-input ivu-input-default")[2] as HTMLInputElement;

img.onload=()=>{
  process();
}
img.addEventListener("click",function(){
  //process();
});

const rectangle ={left: 12, top: 2, width: 60, height: 23 };

async function process():Promise<void>{
  try{ 
    var result=await ocr_external(img);
    console.log("ocr: "+result)
    input.value=result;
  }catch(e){
    console.error(e)
  }
}