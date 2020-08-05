import BECH32 from 'bech32';

/**
 * 处理hex编码
 *
 * @type {hex}
 */
const Hex = {
  hexToBytes(hex) {
    const bytes = [];

    for (let c = 0; c < hex.length; c += 2) {
      bytes.push(parseInt(hex.substr(c, 2), 16));
    }

    return bytes;
  },
  bytesToHex(bytes) {
    const hex = [];

    for (let i = 0; i < bytes.length; i++) {
      hex.push((bytes[i] >>> 4).toString(16));
      hex.push((bytes[i] & 0xf).toString(16));
    }

    return hex.join('').toUpperCase();
  },
  stringToHex(str) {
    const bytes = [];

    for (let i = 0; i < str.length; i++) {
      bytes.push(str.charCodeAt(i).toString(16));
    }

    return bytes.join('');
  },
  isHex(str) {
    return /^[0-9a-fA-F]*$/i.test(str.replace('0x', ''));
  },
};

/**
 * 处理bech32编码
 *
 * @type {bech32}
 */
const bech32 = {
  /**
   *
   * @param bech32Str  使用bech32编码后的字符串
   * @returns {string} 大写的hex字符串
   */
  fromBech32(bech32Str) {
    const ownKey = BECH32.decode(bech32Str);

    return Hex.bytesToHex(BECH32.fromWords(ownKey.words)).toUpperCase();
  },
  /**
   *
   * @param prefix bech32编码前缀
   * @param str    待编码的字符串
   * @returns {*}  bech32编码后的字符串
   */
  toBech32(prefix, str) {
    const strByte = BECH32.toWords(Buffer.from(str, 'hex'));

    return BECH32.encode(prefix, strByte);
  },
  /**
   *
   * @param prefix bech32编码
   * @param str    待编码的字符串
   * @returns
   */
  isBech32(prefix, str) {
    if (!prefix || prefix.length === 0) {
      return false;
    }

    const preReg = new RegExp(`^${prefix}1`);

    if (!preReg.test(str)) {
      return false;
    }

    const allReg = new RegExp(/^[0-9a-zA-Z]*$/i);

    if (!allReg.test(str)) {
      return false;
    }

    try {
      bech32.fromBech32(str);

      return true;
    } catch (e) {
      return false;
    }
  },
};

export default {
  Hex,
  Bech32: bech32,
};
