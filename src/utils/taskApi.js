import { ofetch } from 'ofetch'

// 🌟 API client สำหรับระบบ To-Do (tasks)
// ใช้ URL เดียวกับ services/api.js คือ VITE_API_URL + /api/backend
// (utils/api.js เดิมใช้ VITE_API_BASE_URL || '/api' ซึ่งไม่ได้ตั้งค่าไว้ ทำให้ยิงไปที่ frontend แล้วได้ index.html กลับมา)
const apiRoot = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '')

export const $api = ofetch.create({
  baseURL: `${apiRoot}/api/backend`,
  async onRequest({ options }) {
    const accessToken = useCookie('accessToken').value
    if (accessToken) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      }
    }
  },
})
