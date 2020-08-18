const moment = require('moment');
import { companyId } from './api'

export const DOMAIN_LIST = [
  /* Default domains included */
  "aol.com", "att.net", "comcast.net", "facebook.com", "gmail.com", "gmx.com", "googlemail.com",
  "google.com", "hotmail.com", "hotmail.co.uk", "mac.com", "me.com", "mail.com", "msn.com",
  "live.com", "sbcglobal.net", "verizon.net", "yahoo.com", "yahoo.co.uk",

  /* Other global domains */
  "email.com", "fastmail.fm", "games.com" /* AOL */, "gmx.net", "hush.com", "hushmail.com", "icloud.com",
  "iname.com", "inbox.com", "lavabit.com", "love.com" /* AOL */, "outlook.com", "pobox.com", "protonmail.ch", "protonmail.com", "tutanota.de", "tutanota.com", "tutamail.com", "tuta.io",
 "keemail.me", "rocketmail.com" /* Yahoo */, "safe-mail.net", "wow.com" /* AOL */, "ygm.com" /* AOL */,
  "ymail.com" /* Yahoo */, "zoho.com", "yandex.com",

  /* United States ISP domains */
  "bellsouth.net", "charter.net", "cox.net", "earthlink.net", "juno.com",

  /* British ISP domains */
  "btinternet.com", "virginmedia.com", "blueyonder.co.uk", "freeserve.co.uk", "live.co.uk",
  "ntlworld.com", "o2.co.uk", "orange.net", "sky.com", "talktalk.co.uk", "tiscali.co.uk",
  "virgin.net", "wanadoo.co.uk", "bt.com",

  /* Domains used in Asia */
  "sina.com", "sina.cn", "qq.com", "naver.com", "hanmail.net", "daum.net", "nate.com", "yahoo.co.jp", "yahoo.co.kr", "yahoo.co.id", "yahoo.co.in", "yahoo.com.sg", "yahoo.com.ph", "163.com", "yeah.net", "126.com", "21cn.com", "aliyun.com", "foxmail.com",

  /* French ISP domains */
  "hotmail.fr", "live.fr", "laposte.net", "yahoo.fr", "wanadoo.fr", "orange.fr", "gmx.fr", "sfr.fr", "neuf.fr", "free.fr",

  /* German ISP domains */
  "gmx.de", "hotmail.de", "live.de", "online.de", "t-online.de" /* T-Mobile */, "web.de", "yahoo.de",

  /* Italian ISP domains */
  "libero.it", "virgilio.it", "hotmail.it", "aol.it", "tiscali.it", "alice.it", "live.it", "yahoo.it", "email.it", "tin.it", "poste.it", "teletu.it",

  /* Russian ISP domains */
  "mail.ru", "rambler.ru", "yandex.ru", "ya.ru", "list.ru",

  /* Belgian ISP domains */
  "hotmail.be", "live.be", "skynet.be", "voo.be", "tvcablenet.be", "telenet.be",

  /* Argentinian ISP domains */
  "hotmail.com.ar", "live.com.ar", "yahoo.com.ar", "fibertel.com.ar", "speedy.com.ar", "arnet.com.ar",

  /* Domains used in Mexico */
  "yahoo.com.mx", "live.com.mx", "hotmail.es", "hotmail.com.mx", "prodigy.net.mx",

  /* Domains used in Canada */
  "yahoo.ca", "hotmail.ca", "bell.net", "shaw.ca", "sympatico.ca", "rogers.com",

  /* Domains used in Brazil */
  "yahoo.com.br", "hotmail.com.br", "outlook.com.br", "uol.com.br", "bol.com.br", "terra.com.br", "ig.com.br", "itelefonica.com.br", "r7.com", "zipmail.com.br", "globo.com", "globomail.com", "oi.com.br"
]

export const validEmail = (email) => {
  const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return pattern.test(email)
}

export const get_json = (val) => {
  let res = {}
  try {
    res = JSON.parse(val.answer)
  } catch(e) {}
  return res
}

export const parse_array = (val) => {
  let res = []
  try {
    res = JSON.parse(val.answer)
  } catch(e) {}
  return res
}

export const beautifyEmail = (email) => {
  if (validEmail(email)) {
    return `<a href="mailto:${email}">${email}</a>`
  } else {
    return `${email}`
  }
}

export const beautifyDuration = (duration) => {
  return moment(duration, 'x').format('HH:mm:ss')
}
export const beautifyDateTimeFromUnix = (timestamp) => {
  return moment(timestamp, 'x').format('DD MMM YYYY, HH:mm:ss')
}

export const beautifyDateTime = (date) => {
  return moment(date).format('DD MMM YYYY, HH:mm:ss')
}

export const beautifyDate = (date) => {
  return moment(date).format('DD MMM YYYY')
}

export const beautifyDateZ = (date) => {
  return moment(date, 'YYYYMMDDHHmmss').format('MMM DD YYYY HH:mm:ss')
}

export const removeQuotes = (val) => {
  return val.replace(/\"/g, "")
}

export const readNewLine = (val) => {
  return val.replace(/\\n/g, '<br \\>')
}

export const getTableName = (val) => {
  const _val = val.toLowerCase().replace(' ', '_');
  var letters = /^[0-9a-zA-Z_]+$/;
  let name = ''
  for (var i = 0; i < _val.length; i++) {
    if (_val.charAt(i).match(letters)) {
      name += _val.charAt(i)
    }
  }

  return name
}

export const hexEncode = (str) =>  {
  var hex, i;

  var result = "";
  for (i=0; i < str.length; i++) {
      hex = str.charCodeAt(i).toString(16);
      result += (":"+hex).slice(-4);
  }

  return result.slice(1, result.length-2)
}

export const WBChannels = () => {
  return [
    {text: '162.400 MHz', value:'162.400'},
    {text: '162.425 MHz', value: '162.425'},
    {text: '162.450 MHz', value: '162.450'},
    {text: '162.475 MHz', value: '162.475'},
    {text: '162.500 MHz', value: '162.500'},
    {text: '162.525 MHz', value: '162.525'},
    {text: '162.550 MHz', value: '162.550'},
  ]
}