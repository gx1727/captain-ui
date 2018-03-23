/**
 * Created by gx1727 on 2018/3/14.
 */
import axios from 'axios'

import {
    LoginApi,
    RoleListApi
} from './config'

export default {
    Login (param) {
        return axios.post(LoginApi, param);
    },
    RoleList (param, success, faild) {
        axios.post(RoleListApi, param).then(function (response) {
            if (response.status === 200) {
                success(manageResponse(response.data));
            } else {
                faild(response.status, response.statusText);
            }
        }).catch(function (e) {
            faild(e, '');
        })
    }
}

const manageResponse = function(response) {
    let res = response;
    if (typeof response === 'string') {
        res = JSON.parse(response);
    }
    if(res.code === undefined) {
        res.code = -1;
        if(res.msg === undefined) {
            res.msg = '未知错误';
        }
    }
    return res;
}