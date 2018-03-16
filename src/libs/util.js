import axios from 'axios';
import env from '../../build/env';
import semver from 'semver';
import packjson from '../../package.json';
import md5 from 'blueimp-md5';
import NodeRSA from 'node-rsa';

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
    if (!name || !routers || !routers.length) {
        return null;
    }
    // debugger;
    let routerObj = null;
    for (let item of routers) {
        if (item.name === name) {
            return item;
        }
        if(Array.isArray(item.children)) {
            routerObj = util.getRouterObjByName(item.children, name);
            if (routerObj) {
                return routerObj;
            }
        }
    }
    return null;
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
    let isOtherRouter = false;
    vm.$store.state.app.routers.forEach(item => {
        if (item.children.length === 1) {
            if (item.children[0].name === name) {
                title = util.handleTitle(vm, item);
                if (item.name === 'otherRouter') {
                    isOtherRouter = true;
                }
            }
        } else {
            item.children.forEach(child => {
                if (child.name === name) {
                    title = util.handleTitle(vm, child);
                    if (item.name === 'otherRouter') {
                        isOtherRouter = true;
                    }
                }
            });
        }
    });
    let currentPathArr = [];
    if (name === 'home_index') {
        currentPathArr = [
            {
                title: util.handleTitle(vm, util.getRouterObjByName(vm.$store.state.app.routers, 'home_index')),
                path: '',
                name: 'home_index'
            }
        ];
    } else if ((name.indexOf('_index') >= 0 || isOtherRouter) && name !== 'home_index') {
        currentPathArr = [
            {
                title: util.handleTitle(vm, util.getRouterObjByName(vm.$store.state.app.routers, 'home_index')),
                path: '/home',
                name: 'home_index'
            },
            {
                title: title,
                path: '',
                name: name
            }
        ];
    } else {
        let currentPathObj = vm.$store.state.app.routers.filter(item => {
            if (item.children.length <= 1) {
                return item.children[0].name === name;
            } else {
                let i = 0;
                let childArr = item.children;
                let len = childArr.length;
                while (i < len) {
                    if (childArr[i].name === name) {
                        return true;
                    }
                    i++;
                }
                return false;
            }
        })[0];
        if (currentPathObj.children.length <= 1 && currentPathObj.name === 'home') {
            currentPathArr = [
                {
                    title: '首页',
                    path: '',
                    name: 'home_index'
                }
            ];
        } else if (currentPathObj.children.length <= 1 && currentPathObj.name !== 'home') {
            currentPathArr = [
                {
                    title: '首页',
                    path: '/home',
                    name: 'home_index'
                },
                {
                    title: currentPathObj.title,
                    path: '',
                    name: name
                }
            ];
        } else {
            let childObj = currentPathObj.children.filter((child) => {
                return child.name === name;
            })[0];
            currentPathArr = [
                {
                    title: '首页',
                    path: '/home',
                    name: 'home_index'
                },
                {
                    title: currentPathObj.title,
                    path: '',
                    name: currentPathObj.name
                },
                {
                    title: childObj.title,
                    path: currentPathObj.path + '/' + childObj.path,
                    name: name
                }
            ];
        }
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
        let tag = vm.$store.state.app.tagsList.filter((item) => {
            if (item.children) {
                return name === item.children[0].name;
            } else {
                return name === item.name;
            }
        });
        tag = tag[0];
        if (tag) {
            tag = tag.children ? tag.children[0] : tag;
            if (argu) {
                tag.argu = argu;
            }
            if (query) {
                tag.query = query;
            }
            vm.$store.commit('increateTag', tag);
        }
    }
    vm.$store.commit('setCurrentPageName', name);
};

util.toDefaultPage = function (routers, name, route, next) {
    let len = routers.length;
    let i = 0;
    let notHandle = true;
    while (i < len) {
        if (routers[i].name === name && routers[i].children && routers[i].redirect === undefined) {
            route.replace({
                name: routers[i].children[0].name
            });
            notHandle = false;
            next();
            break;
        }
        i++;
    }
    if (notHandle) {
        next();
    }
};

util.fullscreenEvent = function (vm) {
    vm.$store.commit('initCachepage');
    // 权限菜单过滤相关
    vm.$store.commit('updateMenulist');
    // 全屏相关
};

util.checkUpdate = function (vm) {
    axios.get('https://api.github.com/repos/iview/iview-admin/releases/latest').then(res => {
        let version = res.data.tag_name;
        vm.$Notice.config({
            duration: 0
        });
        if (semver.lt(packjson.version, version)) {
            vm.$Notice.info({
                title: 'iview-admin更新啦',
                desc: '<p>iView-admin更新到了' + version + '了，去看看有哪些变化吧</p><a style="font-size:13px;" href="https://github.com/iview/iview-admin/releases" target="_blank">前往github查看</a>'
            });
        }
    });
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
