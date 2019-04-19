import axios from 'axios'

const io = axios.create({
    baseURL: process.env.VUE_APP_API,
    timeout: 180000
})

io.interceptors.response.use(response => {    
    if (response.status == 200) {
        const res = response.data
        if (res.code == 200) {
            return res.data
        } else {
            alert(res.message)
            return null
        }
    } else {
        return null
    }
  }, function (error) {
    // Do something with response error
    return null
})

export default io