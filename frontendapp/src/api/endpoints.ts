export const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"

export const ENDPOINTS = {
  AUTH: {
    LOGIN: `${BASE_URL}/token`,
    REGISTER: `${BASE_URL}/register`,
    ME: `${BASE_URL}/users/me`,
  },
//   PRODUCTS: {
//     ALL: `${BASE_URL}/products`,
//     BY_ID: (id: number) => `${BASE_URL}/product/${id}`,
//     ADD: `${BASE_URL}/product`,
//     UPDATE: (id: number) => `${BASE_URL}/product/${id}`,
//     DELETE: (id: number) => `${BASE_URL}/product/${id}`,
//   },
};