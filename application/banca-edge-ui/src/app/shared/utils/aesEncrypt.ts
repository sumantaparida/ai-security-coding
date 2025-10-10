import * as CryptoJS from 'crypto-js';
import { environment } from '@environments/environment';
export const aesDecrypt = (data) => {
  // console.log('encrpytData',data)
  if (!data) return null;

  // console.log('decrypted', CryptoJS.AES.decrypt(data,  environment.AES_SECRET_KEY.trim()).toString(CryptoJS.enc.Utf8));
  return JSON.parse(
    CryptoJS.AES.decrypt(data, environment.AES_SECRET_KEY.trim()).toString(CryptoJS.enc.Utf8),
  );
};

export const aesEncrypt = (data) => {
  // console.log('plainData',data)
  const loginDataEncrypt = CryptoJS.AES.encrypt(data, environment.AES_SECRET_KEY.trim()).toString();
  console.log(loginDataEncrypt);
  return loginDataEncrypt;
};
