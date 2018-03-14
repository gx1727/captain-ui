/**
 * Created by gx1727 on 2018/3/14.
 */
import axios from 'axios'

import {
    LoginApi,
} from './config'

export default {
    Login (param) {
        return axios.post(LoginApi, param);
    }
}