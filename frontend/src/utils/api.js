import axios from 'axios'

const api = axios.create({
  baseURL:"https://mern-ecommerce-backend-4cby.onrender.com",
})

export default api
