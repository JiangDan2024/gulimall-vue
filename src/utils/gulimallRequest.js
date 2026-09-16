import axios from 'axios'

const service = axios.create({
  baseURL: '/gulimall-api',   // 注意这里是 /gulimall-api，不是 /dev-api
  timeout: 10000
})

service.interceptors.request.use(
  config => {
    // 按需加 Token，没有就删掉这段
    const token = localStorage.getItem('gulimall-token')
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token
    }
    return config
  },
  error => Promise.reject(error)
)

service.interceptors.response.use(
  response => response.data,
  error => {
    console.error('谷粒商城请求失败:', error)
    return Promise.reject(error)
  }
)

export default service