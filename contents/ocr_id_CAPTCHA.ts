import type { PlasmoCSConfig } from "plasmo"
import { createWorker,PSM } from 'tesseract.js';
import '/lib/ocr_captcha.ts';
import { ocr_captcha } from "~lib/ocr_captcha";
import { prepare } from "~lib/prepare";
import { prepare_manual } from "~lib/prepare_manual";
import {ImageClassifier} from "lib/ocr_captcha_onnx"


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
  process();
});


const rectangle ={left: 12, top: 2, width: 60, height: 23 };

async function process():Promise<void>{
  try{ 
    //await prepare(img);
    //var result=await ocr_captcha(img,{rectangle},"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ");
    var result=await ImageClassifier.classification(img);
    input.value=result;
  }catch(e){
    console.log(e)
  }
}

//process();
