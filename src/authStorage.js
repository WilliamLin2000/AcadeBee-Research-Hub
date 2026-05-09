/** 與 Header、Dashboard 等處相同：從 localStorage 讀取目前登入使用者（無則 null） */
export function getStoredUser() {
  try {
    const raw = window.localStorage.getItem('currentUser')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}
