/* eslint-disable @typescript-eslint/no-explicit-any */
import CryptoJS from 'crypto-js'
const keyValue = import.meta.env.VITE_CRYPTO_SECRET_KEY // your key value (eg: key)
const encrypted = false

function encrypt(value: any) {
  return CryptoJS.AES.encrypt(value, keyValue).toString()
}

function decrypt(value: any) {
  if (value) {
    try {
      return CryptoJS.AES.decrypt(value, keyValue).toString(CryptoJS.enc.Utf8)
    } catch {
      return null
    }
  } else {
    return null
  }
}

function storage(methods: string) {
  return (name: string, value?: any) => {
    let global_storage: Record<string, any>
    
    if(localStorage.getItem('global_storage')) {
      if (encrypted) global_storage = JSON.parse(decrypt(localStorage.getItem('global_storage')) ?? '')
      else global_storage = JSON.parse(localStorage.getItem('global_storage') ?? '') ?? {}
    } else {
      global_storage = {}
    }
    // create/rewrite local storage
    if (methods === 'create') {
      if (!global_storage) global_storage = {}
      global_storage[name] = value

      if (encrypted) localStorage.setItem('global_storage', encrypt(JSON.stringify(global_storage)))
      else localStorage.setItem('global_storage', JSON.stringify(global_storage))
    } 
    // get data from local storage
    else if (methods === 'read') {
      if (global_storage) {
        if (global_storage[name]) {
          return global_storage[name]
        } else {
          return null
        }
      } else return null
    } 
    // delete data from local storage
    else if (methods === 'delete') {
      if (!global_storage) global_storage = {}
      localStorage.removeItem(name)
      delete global_storage[name]

      if (encrypted) localStorage.setItem('global_storage', encrypt(JSON.stringify(global_storage)))
      else localStorage.setItem('global_storage', JSON.stringify(global_storage))
    }
  }
}

function decryptUrl(urlSafeString: string) {
  const parts = urlSafeString.split('.')
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted string format')
  }

  const [saltHex, ivHex, ciphertextHex] = parts
  const key = keyValue // Kunci harus sama

  // 2. Ubah kembali dari Hex ke WordArray
  const saltWA = CryptoJS.enc.Hex.parse(saltHex ?? '')
  const ivWA = CryptoJS.enc.Hex.parse(ivHex ?? '')
  const ciphertextWA = CryptoJS.enc.Hex.parse(ciphertextHex ?? '')

  // 3. Buat objek CipherParams manual
  const encryptedData = CryptoJS.lib.CipherParams.create({
    ciphertext: ciphertextWA,
    salt: saltWA,
    iv: ivWA,
  })

  // 4. Dekripsi
  const decrypted = CryptoJS.AES.decrypt(encryptedData, key)

  // 5. Kembalikan sebagai string UTF-8
  return decrypted.toString(CryptoJS.enc.Utf8)
}
export const storageHelper = {
  setItem: storage('create'),
  getItem: storage('read'),
  removeItem: storage('delete'),
  decryptUrl: (value: string) => decryptUrl(value),
  clear: () => localStorage.clear(),
}
