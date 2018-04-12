import Cookies from 'js-cookie';

const user = {
    state: {
        user: '',
        user_code: '',
        role: '',
        homeurl: ''
    },
    mutations: {
        setAvator (state, path) {
            localStorage.avatorImgPath = path;
        },
        logout (state) {
            Cookies.remove('user');
            Cookies.remove('user_code');
            Cookies.remove('role');
            // 恢复默认样式
            let themeLink = document.querySelector('link[name="theme"]');
            themeLink.setAttribute('href', '');
            // 清空打开的页面等数据，但是保存主题数据
            let theme = '';
            if (localStorage.theme) {
                theme = localStorage.theme;
            }
            localStorage.clear();
            if (theme) {
                localStorage.theme = theme;
            }
        }
    }
};

export default user;
