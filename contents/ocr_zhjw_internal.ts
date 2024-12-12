import type { PlasmoCSConfig } from "plasmo"
import '/lib/ocr_captcha.ts';
import {ocr_external} from "lib/ocr_external"

export const config: PlasmoCSConfig = {
  matches: ["*://id.scu.edu.cn/*"],
  run_at: "document_end",
}

