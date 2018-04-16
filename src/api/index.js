/**
 * Created by gx1727 on 2018/3/14.
 */
import axios from 'axios'
import Vue from 'vue';
import store from '../store';

import {
    LoginApi,
    RoleListApi,
    RoleEditApi,
    MenuGetTreeApi,
    MenuGetApi,
    MenuFormApi,
    MenuDelApi,
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
    CmsTagGetApi,
    CmsTagByGroupApi,
    CmsArticleGetApi,
    CmsArticleListApi,
    CmsArticleCreateApi,
    CmsArticleEditApi,
    CmsArticlePublishApi,
    CmsArticleDelApi,
    SystemAttListApi,
    CmsEditorListApi,
    CmsEditorFormApi,
    CmsEditorDelApi,
    CmsEditorAuthApi,
    CmsEditorGetApi,
    CmsBrandsListApi,
    CmsBrandsAllApi,
    CmsRvListApi,
    CmsRvGetApi,
    CmsRvFormApi,
    CmsRvDelApi,
    CmsModelListApi
} from './config'

const service = axios.create({
    timeout: 5000, // 请求的超时时间
    withCredentials: true // 允许携带cookie
});

export default {
    ManageFaild (e, statusText) {
        let vm = Vue.prototype;
        vm.$Notice.error({
            title: '网络错误，服务请求失败',
            desc: typeof e == 'object' ? e.message : (e + '[' + statusText + ']')
        });
    },
    Login (param) {
        return service.post(LoginApi, param);
    },
    Post (api, param, success, faild) {

        if (typeof faild != 'function') {
            faild = this.ManageFaild;
        }
        service.post(this.GetApiPath(api), param).then(function (response) {
            if (response.status === 200) {
                let res = manageResponse(response.data);
                if (res.code === 998) { // 退出登录
                    store.commit('logout');
                    store.commit('clearOpenedSubmenu');
                    location.reload();
                } else {
                    success(res);
                }
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
            case 'MenuGetApi':
                return MenuGetApi;
            case 'MenuFormApi':
                return MenuFormApi;
            case 'MenuDelApi':
                return MenuDelApi;
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
            case 'CmsTagByGroupApi':
                return CmsTagByGroupApi;
            case 'CmsArticleGetApi':
                return CmsArticleGetApi;
            case 'CmsArticleListApi':
                return CmsArticleListApi;
            case 'CmsArticleCreateApi':
                return CmsArticleCreateApi;
            case 'CmsArticleEditApi':
                return CmsArticleEditApi;
            case 'CmsArticlePublishApi':
                return CmsArticlePublishApi;
            case 'CmsArticleDelApi':
                return CmsArticleDelApi;
            case 'SystemAttListApi':
                return SystemAttListApi;
            case 'CmsEditorListApi':
                return CmsEditorListApi;
            case 'CmsEditorFormApi':
                return CmsEditorFormApi;
            case 'CmsEditorDelApi':
                return CmsEditorDelApi;
            case 'CmsEditorAuthApi':
                return CmsEditorAuthApi;
            case 'CmsEditorGetApi':
                return CmsEditorGetApi;
            case 'CmsBrandsListApi':
                return CmsBrandsListApi;
            case 'CmsBrandsAllApi':
                return CmsBrandsAllApi;
            case 'CmsRvListApi':
                return CmsRvListApi;
            case 'CmsRvGetApi':
                return CmsRvGetApi;
            case 'CmsRvFormApi':
                return CmsRvFormApi;
            case 'CmsRvDelApi':
                return CmsRvDelApi;
            case 'CmsModelListApi':
                return CmsModelListApi;
        }
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