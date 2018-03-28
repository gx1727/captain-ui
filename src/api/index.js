/**
 * Created by gx1727 on 2018/3/14.
 */
import axios from 'axios'

import {
    LoginApi,
    RoleListApi,
    RoleEditApi,
    MenuGetTreeApi,
    MenuGetItemApi,
    MenuFormItemApi,
    MenuDelItemApi,
    CmsSortFormItemApi,
    CmsSortGetTreeApi,
    CmsSortGetItemApi,
    CmsSortDelItemApi,
    CmsTagGroupListApi,
    CmsTagGroupAddApi,
    CmsTagGroupEditApi,
    CmsTagGroupDelApi,
    CmsTagListApi,
    CmsTagAddApi,
    CmsTagEditApi,
    CmsTagDelApi,
    CmsTagGetApi
} from './config'

export default {
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
    },
    GetApiPath (apiName) {
        switch (apiName) {
            case 'LoginApi':
                return LoginApi;
            case 'RoleListApi':
                return RoleListApi;
            case 'RoleEditApi':
                return RoleEditApi;
            case 'MenuGetTreeApi':
                return MenuGetTreeApi;
            case 'MenuGetItemApi':
                return MenuGetItemApi;
            case 'MenuFormItemApi':
                return MenuFormItemApi;
            case 'MenuDelItemApi':
                return MenuDelItemApi;
            case 'CmsSortFormItemApi':
                return CmsSortFormItemApi;
            case 'CmsSortGetTreeApi':
                return CmsSortGetTreeApi;
            case 'CmsSortGetItemApi':
                return CmsSortGetItemApi;
            case 'CmsSortDelItemApi':
                return CmsSortDelItemApi;
            case 'CmsTagGroupListApi':
                return CmsTagGroupListApi;
            case 'CmsTagGroupAddApi':
                return CmsTagGroupAddApi;
            case 'CmsTagGroupEditApi':
                return CmsTagGroupEditApi;
            case 'CmsTagGroupDelApi':
                return CmsTagGroupDelApi;
            case 'CmsTagListApi':
                return CmsTagListApi;
            case 'CmsTagAddApi':
                return CmsTagAddApi;
            case 'CmsTagEditApi':
                return CmsTagEditApi;
            case 'CmsTagDelApi':
                return CmsTagDelApi;
            case 'CmsTagGetApi':
                return CmsTagGetApi;
        }
    },
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