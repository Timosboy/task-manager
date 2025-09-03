import axios from 'axios'
export const baseURL =
  import.meta.env.VITE_API_BASE || 'https://jsonplaceholder.typicode.com'
export const api = axios.create({ baseURL })
