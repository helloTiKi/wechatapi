
import crypto from 'crypto'


class WXBizDataCrypt {

  constructor(appId, sessionKey) {
    this.appId = appId
    this.sessionKey = sessionKey
  }
  decryptData(encryptedData, iv) {
    // base64 decode
    var sessionKey = Buffer.from(this.sessionKey, 'base64')
    encryptedData = Buffer.from(encryptedData, 'base64')
    iv = Buffer.from(iv, 'base64')
    try {
      // 解密
      var decipher = crypto.createDecipheriv('aes-128-cbc', sessionKey, iv)
      // 设置自动 padding 为 true，删除填充补位
      decipher.setAutoPadding(true)
      var decoded = decipher.update(encryptedData, 'binary', 'utf8')
      decoded += decipher.final('utf8')
      decoded = JSON.parse(decoded)
    } catch (err) {
      throw new Error('Illegal Buffer')
    }
    if (decoded.watermark.appid !== this.appId) {
      throw new Error('Illegal Buffer')
    }
    return decoded
  }
}
export default WXBizDataCrypt
