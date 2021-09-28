import axios from 'axios'

const Axios = axios.create({
    baseURL: 'https://mehek-masale.herokuapp.com/'
})

export default Axios