// small helper: hash password using Web Crypto
export async function hashPassword(text){
  if (!text) return ''
  if (window.crypto && window.crypto.subtle){
    const enc = new TextEncoder().encode(text)
    const hash = await crypto.subtle.digest('SHA-256', enc)
    return Array.from(new Uint8Array(hash)).map(b=>b.toString(16).padStart(2,'0')).join('')
  }
  // fallback
  return btoa(text)
}
