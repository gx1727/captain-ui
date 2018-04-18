<style lang="less">
    @import '../../styles/common.less';
    @import './styles/publish_article.less';
</style>
<template>
    <div>
        <Row style="margin-bottom: 200px;">
            <Col span="18">
            <Card>
                <Form :label-width="80">
                    <FormItem label="文章标题">
                        <Input v-model="article.a_title" icon="android-list"/>
                    </FormItem>
                    <FormItem label="文章描述">
                        <Input type="textarea" v-model="article.a_abstract"/>
                    </FormItem>
                </Form>
                <div class="margin-top-20">
                    <textarea id="articleEditor"></textarea>
                </div>
            </Card>
            </Col>
            <Col span="6" class="padding-left-10">
            <Tabs type="card"
                  @on-click="handleTabPaneClick">
                <TabPane label="属性">
                    <Card>
                        <p slot="title">
                            <Icon type="paper-airplane"></Icon>
                            发布
                        </p>
                        <p class="margin-top-10">
                            <Icon type="android-time"></Icon>
                            状态：
                            <Tag v-if="article.a_status < 0" size="small" color="yellow">等待创建新文章</Tag>
                            <Tag v-if="article.a_status === 0" size="small" color="red">已删除</Tag>
                            <Tag v-if="article.a_status === 1" size="small" color="blue"><a :href="'/' + article.a_code" target="_blank">已发布 {{ article.publish_time }}</a></Tag>
                            <Tag v-if="article.a_status === 2" size="small" color="#EF6AFF">定时发布,不显示</Tag>
                            <Tag v-if="article.a_status === 3" size="small" color="blue">正在编辑中</Tag>
                        </p>
                        <p class="margin-top-10" v-if="isReloadLastDraft">
                            <Button v-show="!editPublishTime" size="small" @click="reloadLastDraft" type="dashed">恢复最后一次编辑草稿</Button>
                        </p>
                        <p class="margin-top-10" v-if="article.draft_etime">
                            <Icon type="eye"></Icon>
                            草稿：
                            <Tag size="small"> {{ article.draft_etime }}</Tag>
                            <a :href="'/preview/' + article.a_id" target="_blank">预览</a>
                        </p>
                        <p class="margin-top-10">
                            <Icon type="ios-calendar-outline"></Icon>
                            <span v-if="publishTimeType === 'immediately'">立即发布</span><span v-else>定时：{{ article.a_publish_time }}</span>
                            <Button v-show="!editPublishTime" size="small" @click="handleEditPublishTime" type="text">修改</Button>
                            <transition name="publish-time">
                                <div v-show="editPublishTime" class="publish-time-picker-con">
                                    <div class="margin-top-10">
                                        <DatePicker @on-change="setPublishTime" :value="article.a_publish_time" type="datetime" style="width:200px;" placeholder="选择日期和时间"></DatePicker>
                                    </div>
                                    <div class="margin-top-10">
                                        <Button type="primary" @click="handleSavePublishTime">确认</Button>
                                        <Button type="ghost" @click="cancelEditPublishTime">取消</Button>
                                    </div>
                                </div>
                            </transition>
                        </p>
                        <p class="margin-top-10">
                            <Icon type="star"></Icon>
                            <Checkbox v-model="article.a_recommend">推荐</Checkbox>
                        </p>
                        <Row class="margin-top-20 publish-button-con">
                            <span class="publish-button"><Button @click="handleSaveDraft">保存草稿</Button></span>
                            <span class="publish-button"><Button @click="handlePublish" :loading="publishLoading" icon="ios-checkmark" style="width:90px;" type="primary">发布</Button></span>
                        </Row>
                    </Card>

                    <div class="margin-top-10">
                        <Card>
                            <p slot="title">
                                <Icon type="navicon-round"></Icon>
                                分类目录
                            </p>
                            <Tabs type="card">
                                <TabPane label="所有分类目录">
                                    <div class="classification-con">
                                        <Tree :data="sortList" @on-check-change="handleSelectSort" show-checkbox></Tree>
                                    </div>
                                </TabPane>
                            </Tabs>
                        </Card>
                    </div>

                    <Card>
                        <p slot="title">
                            <Icon type="ios-pricetags-outline"></Icon>
                            功能
                        </p>
                        <Tabs type="card" class="margin-top-10">
                            <TabPane :label="tagGroupItem.title" v-for="tagGroupItem in tagDB" :key="tagGroupItem.name">
                                <div class="classification-con">
                                    <Row>
                                        <Col span="24">
                                        <Select v-model="articleTagSelected[tagGroupItem.name]" filterable multiple transfer>
                                            <Option v-for="tag in tagGroupItem.tagList" :value="tag.name" :key="tag.name">{{ tag.title }}</Option>
                                        </Select>
                                        </Col>
                                    </Row>
                                </div>
                            </TabPane>
                        </Tabs>
                    </Card>

                    <div class="margin-top-10">
                        <Card>
                            <p slot="title">
                                <Icon type="ios-pricetags-outline"></Icon>
                                标签
                            </p>
                            <Row>
                                <Col span="18">
                                <Select v-model="articleTagSelected['common']" multiple filterable transfer @on-change="handleSelectTag" placeholder="请选择文章标签">
                                    <Option v-for="item in commonTagDB" :value="item.name" :key="item.name">{{ item.title }}</Option>
                                </Select>
                                </Col>
                                <Col span="6" class="padding-left-10">
                                <Button v-show="!addingNewTag" @click="handleAddNewTag" long type="ghost">新建</Button>
                                </Col>
                            </Row>
                            <transition name="add-new-tag">
                                <div v-show="addingNewTag" class="add-new-tag-con">
                                    <Row>
                                        <Col span="14">
                                        <Input v-model="newTagName" placeholder="请输入标签名"/>
                                        </Col>
                                        <Col span="5" class="padding-left-10">
                                        <Button @click="createNewTag" long type="primary">确定</Button>
                                        </Col>
                                        <Col span="5" class="padding-left-10">
                                        <Button @click="cancelCreateNewTag" long type="ghost">取消</Button>
                                        </Col>
                                    </Row>
                                </div>
                            </transition>
                        </Card>
                    </div>
                </TabPane>
                <TabPane label="图片">
                    <Card>
                        <p slot="title">
                            <Icon type="flag"></Icon>
                            封面图
                        </p>
                        <Button slot="extra" type="ghost" @click="handleSelectImg" icon="ios-cloud-upload-outline">选择文件</Button>
                        <img :src="article.a_img" style="width: 100%">
                    </Card>
                    <Card>
                        <p slot="title">
                            <Icon type="flag"></Icon>
                            网络图片素材
                        </p>
                        <Button slot="extra" type="ghost" @click="handleRefreshPicture" icon="refresh"></Button>
                        <Button slot="extra" type="ghost" @click="handlePictureNetwork" icon="ios-cloud-upload-outline">抓取</Button>
                        <div v-if="pictureNetwork.length > 0">
                            <div v-for="item in pictureNetwork">
                                <img  @click="handleSetAImg(item)" :src="item.url ? item.url : item.original" style="width: 100%;">
                                <div>原地址：<textarea style="width: 100%;" readonly>{{ item.original}}</textarea></div>
                                <div>新地址：<textarea style="width: 100%;" readonly>{{ item.url}}</textarea></div>
                            </div>
                        </div>
                    </Card>
                </TabPane>
                <TabPane label="房车">
                </TabPane>
                <TabPane label="营地">
                </TabPane>
            </Tabs>
            </Col>
        </Row>
        <img-manager
                ref="imgManager"
        ></img-manager>
    </div>
</template>
<script>
    import imgManager from '../components/imgManager.vue';
    import tinymce from 'tinymce';
    import api from '../../api';
    import util from '@/libs/util.js';
    export default {
        name: 'publish-article',
        components: {
            imgManager
        },
        data () {
            return {
                showCurrentTableData: true,
                articleTagSelected: {}, // 文章选中的标签
                tagDB: [],
                commonTagDB: [],
                article: {
                    a_id: 0,
                    user_code: '',
                    a_title: '',
                    a_img: '',
                    a_abstract: '',
                    a_content: '',
                    a_count: '',
                    a_extended: '',
                    a_publish_time: '', // 计划发布时间
                    a_recommend: false,
                    a_status: -1,
                    publish_time: '', // 最新已发布时间
                    draft_etime: '' // 最新草稿时间 2018-03-28 12:03:00
                },
                publishTimeType: 'immediately',
                editPublishTime: false, // 是否正在编辑发布时间
                sortList: [], // 分类树
                sortSelected: [], // 最后实际选择的目录
                tagSelected: [], // 最后实际选择的tag
                publishLoading: false,
                addingNewTag: false, // 添加新标签
                newTagName: '', // 新建标签名
                showImgManager: true, // 显示图片处理器
                pictureNetwork: [],  // 网络图片素材
            };
        },
        computed: {},
        methods: {
            createArticle () { // 创建新文章
                let vm = this;
                api.Post('CmsArticleCreateApi', {
                    a_title: ''
                }, function (res) {
                    if (res.code === 0) {
                        let argu = {a_id: res.a_id};
                        vm.$router.push({
                            name: 'cms_article_publish',
                            params: argu
                        });
                        location.reload();
                    } else {
                        vm.$Notice.warning({
                            title: '错误',
                            desc: res.msg
                        });
                    }
                });
            },
            /**
             * 修改发布时间按钮
             */
            handleEditPublishTime () {
                this.editPublishTime = !this.editPublishTime;
            },
            setPublishTime (datetime) {
                this.article.a_publish_time = datetime;
            },
            handleSavePublishTime () {
                if (this.article.a_publish_time) {
                    this.publishTimeType = 'timing';
                    this.editPublishTime = false;
                } else {
                    this.publishTimeType = 'immediately';
                    this.editPublishTime = false;
                }
            },
            cancelEditPublishTime () {
                this.article.a_publish_time = '';
                this.publishTimeType = 'immediately';
                this.editPublishTime = false;
            },

            handleSelectSort (selectedSort) {
                this.sortSelected = selectedSort.map(item => {
                    return item.name;
                });
            },
            /**
             * 打开新建TAG页面
             */
            handleAddNewTag () {
                this.addingNewTag = !this.addingNewTag;
            },

            /**
             *
             */
            handleSelectImg () {
                let vm = this;
                this.$refs.imgManager.$emit('open', function (selectedImg) {
                    selectedImg = selectedImg[0];
                    vm.article.a_img = selectedImg.url;
                });
            },
            /**
             * 创建新的TAG
             */
            createNewTag () {
                let vm = this;
                if (vm.newTagName.length !== 0) {
                    api.Post('CmsTagAddApi', {
                        ctg_name: 'common',
                        ct_title: vm.newTagName
                    }, function (res) {
                        if (res.code === 0) {
                            vm.addingNewTag = false;
                            vm.commonTagDB.push({
                                name: res.ct_name,
                                title: res.ct_title
                            });
                            vm.articleTagSelected.common.push(res.ct_name);
                            vm.$Notice.success({
                                title: '新增TAG成功'
                            });
                        } else if (res.code === 6) {
                            vm.addingNewTag = false;
                            vm.commonTagDB.push({
                                name: res.ct_name,
                                title: res.ct_title
                            });
                            vm.articleTagSelected.common.push(res.ct_name);
                            vm.$Notice.info({
                                title: '提示',
                                desc: res.msg
                            });
                        } else {
                            vm.$Notice.warning({
                                title: '错误',
                                desc: res.msg
                            });
                        }
                    });

                    this.addingNewTag = false;
                    setTimeout(() => {
                        this.newTagName = '';
                    }, 200);
                } else {
                    this.$Message.error('请输入标签名');
                }
            },
            cancelCreateNewTag () {
                this.newTagName = '';
                this.addingNewTag = false;
            },
            canPublish () {
                if (this.article.a_title.length === 0) {
                    this.$Message.error('请输入文章标题');
                    return false;
                } else {
                    return true;
                }
            },
            /**
             * 保存草稿
             */
            handleSaveDraft (fun) {
                let vm = this;
                if (this.canPublish()) {
                    this.article.a_content = tinymce.get('articleEditor').getContent();

                    this.tagSelected = [];
                    for (let key in this.articleTagSelected) {
                        this.articleTagSelected[key].forEach((item) => {
                            this.tagSelected.push(item);
                        });
                    }

                    api.Post('CmsArticleEditApi',
                        Object.assign({}, this.article, {tag: JSON.stringify(this.tagSelected), sort: JSON.stringify(this.sortSelected)}),
                        function (res) {
                            if (res.code === 0) {
                                vm.article.draft_etime = res.draft_etime;
                                if (typeof fun === 'function') { // callback ，可以作发布用
                                    fun(res);
                                } else {
                                    vm.$Message.info('草稿保存成功');
                                }
                            } else {
                                vm.$Notice.warning({
                                    title: '错误',
                                    desc: res.msg
                                });
                            }
                        }, function (e, statusText) {
                            vm.$Notice.error({
                                title: '网络错误，服务请求失败',
                                desc: typeof e == 'object' ? e.message : (e + '[' + statusText + ']')
                            });
                        });
                }
            },
            /**
             * 发布文章
             */
            handlePublish () {
                let vm = this;
                if (vm.canPublish()) {
                    vm.publishLoading = true;
                    vm.handleSaveDraft(function (res) {
                        api.Post('CmsArticlePublishApi', {
                            a_id: vm.article.a_id,
                            publish_time: vm.publishTimeType === 'immediately' ? '' : vm.article.publish_time
                        }, function (res) {
                            vm.publishLoading = false;
                            vm.$Notice.success({
                                title: '保存成功',
                                desc: '文章《' + vm.article.a_title + '》保存成功'
                            });
                            console.log(res);
                        }, function (e, statusText) {
                            vm.$Notice.error({
                                title: '网络错误，服务请求失败',
                                desc: typeof e == 'object' ? e.message : (e + '[' + statusText + ']')
                            });
                        });

                    });
                }
            },
            handleSelectTag () {
                localStorage.tagsList = JSON.stringify(this.articleTagSelected); // 本地存储文章标签列表
            },

            /**
             *  初始化TAG数据
             */
            initTagData () {
                let vm = this;
                api.Post('CmsTagGetApi', {cs_id: 0}, function (res) {
                    if (res.code === 0) {
                        for (let ctg_name in res.tagData) {
                            if (!vm.articleTagSelected[ctg_name]) {
                                vm.articleTagSelected[ctg_name] = [];
                            }
                            if (ctg_name === 'common') {
                                res.tagData[ctg_name].tagList.forEach((item) => {
                                    vm.commonTagDB.push({
                                        name: item.ct_name,
                                        title: item.ct_title
                                    });
                                    if (util.oneOf(item.ct_name, vm.tagSelected)) { // 已选中
                                        vm.articleTagSelected[ctg_name].push(item.ct_name);
                                    }
                                });
                            } else {
                                let tagList = [];
                                res.tagData[ctg_name].tagList.forEach((item) => {
                                    tagList.push({
                                        name: item.ct_name,
                                        title: item.ct_title
                                    });
                                    if (util.oneOf(item.ct_name, vm.tagSelected)) { // 已选中
                                        vm.articleTagSelected[ctg_name].push(item.ct_name);
                                    }
                                })
                                vm.tagDB.push({
                                    name: res.tagData[ctg_name].ctg_name,
                                    title: res.tagData[ctg_name].ctg_title,
                                    tagList: tagList
                                });
                            }
                        }
                    } else {
                        vm.$Notice.warning({
                            title: '错误',
                            desc: res.msg
                        });
                    }
                });
            },

            getSortTree (sortTree) {
                let tree = [];
                let sortTreeLength = sortTree.length;
                for (let key = 0; key < sortTreeLength; key++) {
                    let node = {
                        name: sortTree[key].name,
                        title: sortTree[key].title,
                        expand: true
                    };
                    if (util.oneOf(sortTree[key].name, this.sortSelected)) {
                        node.checked = true;
                    }
                    if (sortTree[key].children) {
                        node.children = this.getSortTree(sortTree[key].children);
                    }
                    tree.push(node);
                }
                return tree;
            },

            /**
             * 初始化分类树
             */
            initSortList () {
                let vm = this;
                api.Post('CmsSortGetTreeApi', {cs_id: 0}, function (res) {
                    if (res.code === 0) {
                        vm.sortList = vm.getSortTree(res.sortTree);
                    } else {
                        vm.$Notice.warning({
                            title: '错误',
                            desc: res.msg
                        });
                    }
                });
            },

            /**
             * 初始化编辑器
             */
            initEditor () {
                this.$nextTick(() => {
                    let vm = this;
                    let height = document.body.offsetHeight - 300;

//                    tinymce.baseURL = '/dist'; // /static/dist
                    tinymce.baseURL = '/static/dist';
                    tinymce.init({
                        selector: '#articleEditor',
                        branding: false,
                        elementpath: false,
                        height: height,
                        language: 'zh_CN.GB2312',
                        menubar: 'edit insert view format table tools',
                        theme: 'modern',
                        plugins: [
                            'advlist autolink lists link image charmap print preview hr anchor pagebreak imagetools',
                            'searchreplace visualblocks visualchars code fullscreen', /*fullpage  imagetools*/
                            'insertdatetime media nonbreaking save table contextmenu directionality',
                            'emoticons paste textcolor colorpicker textpattern codesample'
                        ],
                        toolbar1: 'fullscreen newnote print preview | undo redo | insert | styleselect | forecolor backcolor bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image emoticons media codesample',
                        autosave_interval: '20s',
                        image_advtab: true,
//                        imagetools_cors_hosts: ['localhost:8080', 'localhost-o'],
//                        imagetools_proxy: 'http://localhost-o/tools/imagetools_proxy',
//                        file_browser_callback: function(field_name, url, type, win) {
//                            win.document.getElementById(field_name).value = 'my browser value';
//                        },
                        file_picker_callback: function (callback, value, meta) {
                            // Provide file and text for the link dialog
                            if (meta.filetype == 'file') {
//                                callback('mypage.html', {text: 'My text'});
                            }

                            // Provide image and alt text for the image dialog
                            if (meta.filetype == 'image') {
                                document.getElementById('mce-modal-block').style.zIndex = 998;
                                if (document.getElementById('mce-modal-block').previousElementSibling) {
                                    document.getElementById('mce-modal-block').previousElementSibling.style.zIndex = 999;
                                }

                                vm.$refs.imgManager.$emit('open', function (img) {
                                    img = img[0];
                                    callback(img.url, {alt: img.name});
                                }); // 解发open事件
                            }

                            // Provide alternative source and posted for the media dialog
                            if (meta.filetype == 'media') {
//                                callback('movie.mp4', {source2: 'alt.ogg', poster: 'image.jpg'});
                            }
                        },
                        table_default_styles: {
                            width: '100%',
                            borderCollapse: 'collapse'
                        },
                        setup: function (editor) {
                            editor.on('init', function (e) {
                                vm.spinShow = false;
                                tinymce.get('articleEditor').setContent(vm.article.a_content ? vm.article.a_content : "");
//                                if (localStorage.editorContent) {
//                                    tinymce.get('articleEditor').setContent(localStorage.editorContent);
//                                }
                            });
//                            editor.on('keydown', function (e) {
//                                    localStorage.editorContent = tinymce.get('articleEditor').getContent();
//                            });
                        }
                    });
                });
            },
            /**
             * 恢复最后一次编辑草稿
             */
            reloadLastDraft () {
                let argu = {a_id: localStorage.article_a_id};
                this.$router.replace({
                    name: 'cms_article_publish',
                    params: argu
                });
            },

            /**
             * 刷新文章
             * 所有的修改会恢复
             * 注，分类数据不恢复
             */
            refreshArticle () {
                let vm = this;
                api.Post('CmsArticleGetApi', {
                    a_id: this.article.a_id
                }, function (res) {
                    if (res.code === 0) {
                        console.log(res);
                        vm.article.user_code = res.user_code;
                        vm.article.a_title = res.a_title;
                        vm.article.a_img = res.a_img;
                        vm.article.a_abstract = res.a_abstract;
                        vm.article.a_content = res.a_content;
                        vm.article.a_count = res.a_count;
                        vm.article.a_extended = res.a_extended;
                        vm.article.a_publish_time = res.a_publish_time;
                        vm.article.a_recommend = res.a_recommend ? true : false;
                        vm.article.a_status = res.a_status;
                        vm.article.publish_time = res.publish_time;
                        vm.article.draft_etime = res.draft_etime;


                        vm.sortSelected = [];
                        res.sort.forEach((item) => {
                            vm.sortSelected.push(item.cs_name);
                        });

                        vm.tagSelected = [];
                        res.tag.forEach((item) => {
                            vm.tagSelected.push(item.ct_name);
                        });
                    } else {
                        vm.$Notice.warning({
                            title: '错误',
                            desc: res.msg
                        });
                    }
                    vm.initTagData();
                    vm.initSortList();
                    vm.initEditor();
                }, function (e, statusText) {
                    vm.initTagData();
                    vm.initSortList();
                    vm.initEditor();

                    vm.$Notice.error({
                        title: '网络错误，服务请求失败',
                        desc: typeof e == 'object' ? e.message : (e + '[' + statusText + ']')
                    });
                });
            },
            /**
             * 网络图片素材
             */
            handlePictureNetwork: function () {
                let vm = this;
                if (this.pictureNetwork.length > 0) {
                    api.Post('SystemAttNetworkApi', {
                        picture: JSON.stringify(vm.pictureNetwork)
                    }, function (res) {
                        if (res.code === 0) {
                            vm.pictureNetwork = res.picture;
                            // 原文章中的图片地址替换
                            let content = tinymce.get('articleEditor').getContent();
                            for(let i = 0; i < vm.pictureNetwork.length; i++) {
                                while (content.indexOf(vm.pictureNetwork[i].original) >= 0){
                                    content = content.replace(vm.pictureNetwork[i].original, vm.pictureNetwork[i].url);
                                }
                            }
                            tinymce.get('articleEditor').setContent(content);
                        } else {
                            vm.$Notice.warning({
                                title: '错误',
                                desc: res.msg
                            });
                        }
                    });
                }
            },
            handleRefreshPicture: function () {
                let content = tinymce.get('articleEditor').getContent();

                let imgReg = /<img.*?(?:>|\/>)/gi;
                let srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
                let arr = content.match(imgReg);
                if(arr) {
                    for (let i = 0; i < arr.length; i++) {
                        var src = arr[i].match(srcReg);
                        //获取图片地址
                        if(src[1]){
                            let flag = false;
                            for(let j=0; j<this.pictureNetwork.length; j++) {
                                if(this.pictureNetwork[j]['original'] == src[1] ||
                                    this.pictureNetwork[j]['url'] == src[1]) {
                                    flag = true;
                                }
                            }
                            if(!flag) {
                                let url = '';
                                if(src[1].indexOf('p7bo76bgm.bkt.clouddn.com') >= 0) {
                                    url = src[1]; //是自己的图片
                                }
                                this.pictureNetwork.push({
                                    original: src[1],
                                    url: url
                                })
                            }
                        }
                    }
                }
            },
            handleTabPaneClick: function(index) {
                if(index === 1) { //图片
                    this.handleRefreshPicture();
                }
            },
            handleSetAImg: function (item) {
                this.article.a_img = item.url;
            }
        },
        computed: {
            isReloadLastDraft () { // 就否显示 恢复按钮
                return localStorage.article_a_id && parseInt(localStorage.article_a_id) !== this.article.a_id;
            },
        },
        mounted () {
            let a_id = 0;
            if(this.$route.params.a_id) {
                a_id = parseInt(this.$route.params.a_id.toString());
            }
            if (a_id) { // 编辑
                localStorage.article_a_id = a_id.toString(); // 记录到本地缓存中
                this.article.a_id = a_id;
                this.refreshArticle();
            } else {
                // 创建新文章
                this.createArticle();
            }
        },
        created () {
        },
        destroyed () {
            tinymce.get('articleEditor').destroy();
        }
    }
</script>