/**
 * Created by gx1727 on 2018/3/14.
 */
import axios from 'axios'

import {
    LoginApi,
    RoleListApi,
    RoleEditApi,
    MenuGetByRoleApi,
    MenuGetTreeApi
} from './config'

export default {
    GetApiPath (apiName) {
        switch (apiName) {
            case 'LoginApi':
                return LoginApi;
            case 'RoleListApi':
                return RoleListApi;
            case 'RoleEditApi':
                return RoleEditApi;
            case 'MenuGetByRoleApi':
                return MenuGetByRoleApi;
            case 'MenuGetTreeApi':
                return MenuGetTreeApi;
        }
    },
    ManageFaild (e, statusText) {
        console.log(typeof e == 'object' ? e.message : (e + '[' + statusText + ']'));
    },
    Login (param) {
        return axios.post(LoginApi, param);
    },
    Post (api, param, success, faild) {
        if (typeof faild != 'function') {
            faild = this.ManageFaild;
        }
        axios.post(this.GetApiPath(api), param).then(function (response) {
            if (response.status === 200) {
                success(manageResponse(response.data));
            } else {
                faild(response.status, response.statusText);
            }
        }).catch(function (e) {
            faild(e, '');
        })
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
    },
    RoleEdit (param, success, faild) {
        axios.post(RoleEditApi, param).then(function (response) {
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

const manageResponse = function (response) {
    let res = response;
    if (typeof response === 'string') {
        res = JSON.parse(response);
    }
    if (res.code === undefined) {
        res.code = -1;
        if (res.msg === undefined) {
            res.msg = '未知错误';
        }
    }
    return res;
}