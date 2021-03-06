import Main from '@/views/Main.vue';

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: '/login',
    name: 'login',
    ignore: true,
    meta: {
        title: 'Login - 登录'
    },
    component: () => import('@/views/login.vue')
};

export const page404 = {
    path: '/*',
    name: 'error-404',
    ignore: true,
    meta: {
        title: '404-页面不存在'
    },
    component: () => import('@/views/error-page/404.vue')
};

export const page403 = {
    path: '/403',
    ignore: true,
    meta: {
        title: '403-权限不足'
    },
    name: 'error-403',
    component: () => import('@//views/error-page/403.vue')
};

export const page500 = {
    path: '/500',
    ignore: true,
    meta: {
        title: '500-服务端错误'
    },
    name: 'error-500',
    component: () => import('@/views/error-page/500.vue')
};

/**
 *
 * @type {{path: string, name: string, component: (()=>*)}}
 */

export const preview = {
    path: '/preview',
    name: 'preview',
    ignore: true,
    component: () => import('@/views/form/article-publish/preview.vue')
};


export const locking = {
    path: '/locking',
    name: 'locking',
    ignore: true,
    component: () => import('@/views/main-components/lockscreen/components/locking-page.vue')
};

export const appRouter = {
    path: '/',
    name: 'appRouter',
    icon: 'key',
    title: '',
    component: Main,
    children: [
        {path: 'admin/home', title: {i18n: 'home'}, name: 'admin_home', component: () => import('@/views/admin/admin_home.vue')}, // 管理员home
        {path: 'manager/home', title: {i18n: 'home'}, name: 'manager_home', component: () => import('@/views/manager/manager_home.vue')}, // manager home
        {path: 'ownspace_index', title: '个人中心', icon: 'android-menu', name: 'ownspace_index', component: () => import('@/views/own-space/own-space.vue')},

        {path: 'auth/role', title: '角色管理', icon: 'android-people', name: 'auth_role', component: () => import('@/views/auth/role.vue')},
        {path: 'auth/menu', title: '菜单管理', icon: 'android-menu', name: 'auth_menu', component: () => import('@/views/auth/menu.vue')},

        {path: 'cms/article', title: '文章发布', icon: 'android-menu', name: 'cms_article', component: () => import('@/views/cms/article.vue')},
        {path: 'cms/article/list', title: '文章列表', icon: 'android-menu', name: 'cms_article_list', component: () => import('@/views/cms/article_list.vue')},
        {path: 'cms/article/publish/:a_id', title: '文章发布', icon: 'android-menu', name: 'cms_article_publish', component: () => import('@/views/cms/article_publish.vue')},
        {path: 'cms/sort', title: '文章分类', icon: 'android-menu', name: 'cms_sort', component: () => import('@/views/cms/sort.vue')},
        {path: 'cms/tag_group', title: '文章TAG分组', icon: 'android-menu', name: 'cms_tag_group', component: () => import('@/views/cms/tag-group.vue')},
        {path: 'cms/tag', title: '文章TAG', icon: 'android-menu', name: 'cms_tag', component: () => import('@/views/cms/tag.vue')},
        {path: 'cms/view', title: '栏目管理', icon: 'android-menu', name: 'cms_view', component: () => import('@/views/cms/view.vue')},
        {path: 'cms/editor', title: '编辑列表', icon: 'android-menu', name: 'cms_editor', component: () => import('@/views/cms/editor_list.vue')},
        {path: 'cms/editor/form/:user_id', title: '编辑人员信息', icon: 'android-menu', name: 'cms_editor_form', component: () => import('@/views/cms/editor_form.vue')},
        {path: 'rv/brands', title: '房车品牌', icon: 'android-menu', name: 'rv_brands', component: () => import('@/views/rv/rv_brands.vue')},
        {path: 'rv/rv', title: '房车车系', icon: 'android-menu', name: 'rv_rv', component: () => import('@/views/rv/rv_rv.vue')},
        {path: 'rv/rv/form/:rv_id', title: '编辑车系信息', icon: 'android-menu', name: 'cms_rv_form', component: () => import('@/views/rv/rv_rv_form.vue')},
        {path: 'rv/model', title: '房车车型', icon: 'android-menu', name: 'rv_model', component: () => import('@/views/rv/rv_model.vue')},
        {path: 'rv/model/form/:rm_id', title: '编辑车型信息', icon: 'android-menu', name: 'cms_model_form', component: () => import('@/views/rv/rv_model_form.vue')},
        {path: 'cms/template/list', title: '模板列表', icon: 'android-menu', name: 'template_list', component: () => import('@/views/cms/template_list.vue')},
        {path: 'cms/template/form/:t_id', title: '编辑模板', icon: 'android-menu', name: 'template_form', component: () => import('@/views/cms/template_form.vue')},
        {path: 'cms/special/list', title: '专题列表', icon: 'android-menu', name: 'special_list', component: () => import('@/views/cms/special_list.vue')},
        {path: 'cms/special/form/:s_id', title: '编辑专题', icon: 'android-menu', name: 'special_form', component: () => import('@/views/cms/special_form.vue')}
    ]
};

/**
 * 所有路由
 * @type {Array}
 *         {path: 'order/:order_id', title: '订单详情', name: 'order-info', component: () => import('@/views/advanced-router/component/order-info.vue')}, // 用于展示动态路由
 {path: 'shopping', title: '购物详情', name: 'shopping', component: () => import('@/views/advanced-router/component/shopping-info.vue')}, // 用于展示带参路由
 {path: 'message', title: '消息中心', name: 'message_index', component: () => import('@/views/message/message.vue')},
 */

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter2 = [
    // {
    //     path: '/access',
    //     icon: 'key',
    //     name: 'access',
    //     title: '权限管理',
    //     component: Main,
    //     children: [
    //         {path: 'index', title: '权限管理', name: 'access_index', component: () => import('@/views/access/access.vue')}
    //     ]
    // },
    // {
    //     path: '/access-test',
    //     icon: 'lock-combination',
    //     title: '权限测试页',
    //     name: 'accesstest',
    //     access: 0,
    //     component: Main,
    //     children: [
    //         {path: 'index', title: '权限测试页', name: 'accesstest_index', access: 0, component: () => import('@/views/access/access-test.vue')}
    //     ]
    // },
    {
        path: '/international',
        icon: 'earth',
        title: {i18n: 'international'},
        name: 'international',
        component: Main,
        children: [
            {path: 'index', title: {i18n: 'international'}, name: 'international_index', component: () => import('@/views/international/international.vue')}
        ]
    },
    {
        path: '/component',
        icon: 'social-buffer',
        name: 'component',
        title: '组件',
        component: Main,
        children: [
            {
                path: 'text-editor',
                icon: 'compose',
                name: 'text-editor',
                title: '富文本编辑器',
                component: () => import('@/views/my-components/text-editor/text-editor.vue')
            },
            {
                path: 'md-editor',
                icon: 'pound',
                name: 'md-editor',
                title: 'Markdown编辑器',
                component: () => import('@/views/my-components/markdown-editor/markdown-editor.vue')
            },
            {
                path: 'image-editor',
                icon: 'crop',
                name: 'image-editor',
                title: '图片预览编辑',
                component: () => import('@/views/my-components/image-editor/image-editor.vue')
            },
            {
                path: 'draggable-list',
                icon: 'arrow-move',
                name: 'draggable-list',
                title: '可拖拽列表',
                component: () => import('@/views/my-components/draggable-list/draggable-list.vue')
            },
            {
                path: 'area-linkage',
                icon: 'ios-more',
                name: 'area-linkage',
                title: '城市级联',
                component: () => import('@/views/my-components/area-linkage/area-linkage.vue')
            },
            {
                path: 'file-upload',
                icon: 'android-upload',
                name: 'file-upload',
                title: '文件上传',
                component: () => import('@/views/my-components/file-upload/file-upload.vue')
            },
            {
                path: 'count-to',
                icon: 'arrow-graph-up-right',
                name: 'count-to',
                title: '数字渐变',
                // component: () => import('@/views/my-components/count-to/count-to.vue')
                component: () => import('@/views/my-components/count-to/count-to.vue')
            },
            {
                path: 'split-pane-page',
                icon: 'ios-pause',
                name: 'split-pane-page',
                title: 'split-pane',
                component: () => import('@/views/my-components/split-pane/split-pane-page.vue')
            }
        ]
    },
    {
        path: '/form',
        icon: 'android-checkbox',
        name: 'form',
        title: '表单编辑',
        component: Main,
        children: [
            {path: 'artical-publish', title: '文章发布', name: 'artical-publish', icon: 'compose', component: () => import('@/views/form/article-publish/article-publish.vue')},
            {path: 'workflow', title: '工作流', name: 'workflow', icon: 'arrow-swap', component: () => import('@/views/form/work-flow/work-flow.vue')}

        ]
    },
    {
        path: '/tables',
        icon: 'ios-grid-view',
        name: 'tables',
        title: '表格',
        component: Main,
        children: [
            {path: 'dragableTable', title: '可拖拽排序', name: 'dragable-table', icon: 'arrow-move', component: () => import('@/views/tables/dragable-table.vue')},
            {path: 'editableTable', title: '可编辑表格', name: 'editable-table', icon: 'edit', component: () => import('@/views/tables/editable-table.vue')},
            {path: 'searchableTable', title: '可搜索表格', name: 'searchable-table', icon: 'search', component: () => import('@/views/tables/searchable-table.vue')},
            {path: 'exportableTable', title: '表格导出数据', name: 'exportable-table', icon: 'code-download', component: () => import('@/views/tables/exportable-table.vue')},
            {path: 'table2image', title: '表格转图片', name: 'table-to-image', icon: 'images', component: () => import('@/views/tables/table-to-image.vue')}
        ]
    },
    {
        path: '/advanced-router',
        icon: 'ios-infinite',
        name: 'advanced-router',
        title: '高级路由',
        component: Main,
        children: [
            {path: 'mutative-router', title: '动态路由', name: 'mutative-router', icon: 'link', component: () => import('@/views/advanced-router/mutative-router.vue')},
            {path: 'argument-page', title: '带参页面', name: 'argument-page', icon: 'android-send', component: () => import('@/views/advanced-router/argument-page.vue')}
        ]
    },
    {
        path: '/error-page',
        icon: 'android-sad',
        title: '错误页面',
        name: 'errorpage',
        component: Main,
        children: [
            {path: 'index', title: '错误页面', name: 'errorpage_index', component: () => import('@/views/error-page/error-page.vue')}
        ]
    }
];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    loginRouter,
    preview,
    locking,
    appRouter,
    page500,
    page403,
    page404
];
