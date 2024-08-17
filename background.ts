import {ImageClassifier} from "lib/ocr_captcha_onnx"

export {}
 
console.log(
  "background service started"
)

ImageClassifier.loadModel()
.then(()=>{
    //console.log("model loaded")
})
.catch()