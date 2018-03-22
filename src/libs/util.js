import axios from 'axios';
import env from '../../build/env';
import semver from 'semver';
import packjson from '../../package.json';
import md5 from 'blueimp-md5';
import NodeRSA from 'node-rsa';
import Cookies from 'js-cookie';

let util = {};

/**
 * 修改title
 * @param title
 */
util.title = function (title) {
    title = title || 'Captain Admin';
    window.document.title = title;
};


/**
 * 判断两个数组是否有交集
 *
 * @param arr
 * @param targetArr
 * @returns {boolean}
 */
util.inOf = function (arr, targetArr) {
    let res = true;
    arr.forEach(item => {
        if (targetArr.indexOf(item) < 0) {
            res = false;
        }
    });
    return res;
};

/**
 * 判断数组中是否包含
 * @param ele
 * @param targetArr
 * @returns {boolean}
 */
util.oneOf = function (ele, targetArr) {
    if (targetArr.indexOf(ele) >= 0) {
        return true;
    } else {
        return false;
    }
};

/**
 * 判断权限是否通过
 * @param itAccess
 * @param currentAccess
 * @returns {boolean}
 */
util.showThisRoute = function (itAccess, currentAccess) {
    if (typeof itAccess === 'object' && Array.isArray(itAccess)) {
        return util.oneOf(currentAccess, itAccess);
    } else {
        return itAccess === currentAccess;
    }
};

/**
 * 通过路由名，获到路由对象
 *
 * 递归查找
 * @param routers 路由库
 * @param name 路由名
 * @returns {*}
 */
util.getRouterObjByName = function (routers, name) {
    return routers[name];
};

/**
 * 获到 对象title
 * 判断 处理i18n
 * @param vm
 * @param item 对象，必须含有item字段
 * @returns {String}
 */
util.handleTitle = function (vm, item) {
    if (typeof item.title === 'object') {
        return vm.$t(item.title.i18n);
    } else {
        return item.title;
    }
};

/**
 * 设置当前的path
 * 处理 面包屑数组
 * @param vm
 * @param name
 * @returns {Array}
 */
util.setCurrentPath = function (vm, name) {
    let title = '';

    let currentPathArr = [
        {
            title: util.handleTitle(vm, util.getRouterObjByName(vm.$store.state.app.routers, Cookies.get('homeurl'))),
            path: '',
            name: Cookies.get('homeurl')
        }
    ];
    if (name !== Cookies.get('homeurl')) {

        let currentPathObj = vm.$store.state.app.routers[name];

        if (currentPathObj.parent) { //有父级菜单
            let menu = null;
            vm.$store.state.app.menuList.forEach(item => {
                if (item.name == currentPathObj.parent) {
                    menu = item;
                }
            })

            currentPathArr.push({
                title: menu.title,
                path: '',
                name: menu.name,
            })
        }

        currentPathArr.push({
            title: currentPathObj.title,
            path: currentPathObj.path,
            name: currentPathObj.name
        });
    }

    vm.$store.commit('setCurrentPath', currentPathArr);

    return currentPathArr;
};

util.openNewPage = function (vm, name, argu, query) {
    let pageOpenedList = vm.$store.state.app.pageOpenedList;
    let openedPageLen = pageOpenedList.length;
    let i = 0;
    let tagHasOpened = false;
    while (i < openedPageLen) {
        if (name === pageOpenedList[i].name) { // 页面已经打开
            vm.$store.commit('pageOpenedList', {
                index: i,
                argu: argu,
                query: query
            });
            tagHasOpened = true;
            break;
        }
        i++;
    }
    if (!tagHasOpened) {
        let tag = vm.$store.state.app.routers[name];
        if (tag) {
            tag = tag.children ? tag.children[0] : tag;
            if (argu) {
                tag.argu = argu;
            }
            if (query) {
                tag.query = query;
            }
            if(tag.name.indexOf('error') < 0) { // error页不进tag
                vm.$store.commit('increateTag', tag);
            }
            vm.$store.commit('setCurrentPageName', name);

        } else {
            // 没有指定路由
            vm.$router.replace({
                name: 'error-404'
            });
        }
    }
};

util.toDefaultPage = function (routers, name, route, next) {
    if (name === 'appRouter') { // 回到自己的首页
        route.replace({
            name: Cookies.get('homeurl')
        });
    }
    next();
};

util.fullscreenEvent = function (vm) {
    vm.$store.commit('initCachepage');
    // 权限菜单过滤相关
    vm.$store.commit('updateMenulist');
    // 全屏相关
};

/**
 * 加密字符串
 * content = "" + md5(plaintext) + token;
 * content = 倒序 content;
 * @param plaintext
 * @param token
 * @returns {*}
 */
util.secret = function (plaintext, token) {
    if (typeof token === 'undefined') {
        token = '';
    }
    let content = "" + md5(plaintext) + token;
    content = content.split('').reverse().join('');

    let key = new NodeRSA('-----BEGIN PUBLIC KEY-----\n' +
        'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwL4aIEULJOYYGnGNMvOR\n' +
        'WZR978yUAysIITt1IfCSAeGf2tJVuKhTf8qgxZGJICH1BBd6mJZxOPSSlitznlrE\n' +
        'ZJmDwHn+ktaCtCVcU6KrOO/ZJOnkmCe3seUVTorynTHQMNfvueL4/YGqTULwt6DM\n' +
        's3XtVoDAXst9RR/6b4JINcYAdAvjaNXRepxYL7P+8H8jQ0OTom2nvDGGIhX6ylas\n' +
        'q33nYXmCxmF4uajRbQ5JfE3WKlNgEAPpFST8FbcoZWjJWw5L8Pg8jwvRsbUHWpH6\n' +
        'TYGSpAeADuvcrGmRqn99/pEXJFpEeDQQed7OwvFh5UDAL9dxNPtlYeY07WJRMCWv\n' +
        'OQIDAQAB\n' +
        '-----END PUBLIC KEY-----', {encryptionScheme: {scheme: 'pkcs1'}});

    return key.encrypt(content, 'base64');
};

util.md5 = function (content) {
    return md5(content);
}


/**
 *
 * @param obj
 * @param k
 * @returns {boolean}
 */
util.isset = function (obj, k) {
    if ((typeof(obj) == "array" || typeof(obj) == "object") && typeof(k) != 'undefined') {
        return !(typeof(obj[k]) == "undefined");
    } else {
        return !(typeof(obj) == 'undefined');
    }
}
export default util;
