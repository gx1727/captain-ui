<style lang="less">
    @import '../../styles/common.less';
    @import './styles/publish_article.less';
</style>
<template>
    <div>
        <Row>
            <Col span="18">
            <Card>
                <Form :label-width="80">
                    <FormItem label="文章标题">
                        <Input v-model="article.a_title" @on-blur="handleArticletitleBlur" icon="android-list"/>
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
            <Card>
                <p slot="title">
                    <Icon type="paper-airplane"></Icon>
                    发布
                </p>
                <p class="margin-top-10">
                    <Icon type="android-time"></Icon>状态：
                    <Tag size="small" color="blue">已发布 03-28 12:03</Tag>
                </p>
                <p class="margin-top-10">
                    <Icon type="eye"></Icon>草稿：
                    <Tag size="small"> 2018-03-28 12:03:00</Tag>
                </p>
                <p class="margin-top-10">
                    <Icon type="ios-calendar-outline"></Icon>&nbsp;&nbsp;
                    <span v-if="publishTimeType === 'immediately'">立即发布</span><span v-else>定时：{{ publishTime }}</span>
                    <Button v-show="!editPublishTime" size="small" @click="handleEditPublishTime" type="text">修改</Button>
                    <transition name="publish-time">
                        <div v-show="editPublishTime" class="publish-time-picker-con">
                            <div class="margin-top-10">
                                <DatePicker @on-change="setPublishTime" type="datetime" style="width:200px;" placeholder="选择日期和时间" ></DatePicker>
                            </div>
                            <div class="margin-top-10">
                                <Button type="primary" @click="handleSavePublishTime">确认</Button>
                                <Button type="ghost" @click="cancelEditPublishTime">取消</Button>
                            </div>
                        </div>
                    </transition>
                </p>
                <Row class="margin-top-20 publish-button-con">
                    <span class="publish-button"><Button @click="handlePreview">预览</Button></span>
                    <span class="publish-button"><Button @click="handleSaveDraft">保存草稿</Button></span>
                    <span class="publish-button"><Button @click="handlePublish" :loading="publishLoading" icon="ios-checkmark" style="width:90px;" type="primary">发布</Button></span>
                </Row>
            </Card>
            <div class="margin-top-10" v-for="tagGroupItem in tagDB">
                <Card>
                    <p slot="title">
                        <Icon type="ios-pricetags-outline"></Icon>
                        {{ tagGroupItem.title  }}
                    </p>
                    <Row>
                        <Col span="24">
                        <Select v-model="articleTagSelected[tagGroupItem.name]" filterable multiple>
                            <Option v-for="tag in tagGroupItem.tagList" :value="tag.name" :key="tag.name">{{ tag.title }}</Option>
                        </Select>
                        </Col>
                    </Row>
                </Card>
            </div>
            <div class="margin-top-10">
                <Card>
                    <p slot="title">
                        <Icon type="navicon-round"></Icon>
                        分类目录
                    </p>
                    <Tabs type="card">
                        <TabPane label="所有分类目录">
                            <div class="classification-con">
                                <Tree :data="sortList" @on-check-change="setClassificationInAll" show-checkbox></Tree>
                            </div>
                        </TabPane>
                    </Tabs>
                </Card>
            </div>
            <div class="margin-top-10">
                <Card>
                    <p slot="title">
                        <Icon type="ios-pricetags-outline"></Icon>
                        标签
                    </p>
                    <Row>
                        <Col span="18">

                        <Select v-model="articleTagSelected['other']" multiple filterable @on-change="handleSelectTag" placeholder="请选择文章标签">
                            <Option v-for="item in otherTagDB" :value="item.name" :key="item.name">{{ item.title }}</Option>
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
                                <Input v-model="newTagName" placeholder="请输入标签名" />
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
            </Col>
        </Row>
    </div>
</template>
<script>
    import tinymce from 'tinymce';
    import api from '../../api';
    export default {
        name: 'publish-article',
        components: {},
        data () {
            return {
                articleTagSelected: {}, // 文章选中的标签
                tagDB: [],
                otherTagDB: [],
                article: {
                    a_id: 0,
                    user_code: '',
                    a_title: '',
                    a_img: '',
                    a_abstract: '',
                    a_content: '',
                    a_count: '',
                    a_extended: '',
                    a_publish_time: 0,
                    a_status: 3
                },
                topArticle: false,
                publishTime: '',
                publishTimeType: 'immediately',
                editPublishTime: false, // 是否正在编辑发布时间
                articleTagList: [], // 所有标签列表
                sortList: [],
                classificationSelected: [], // 在所有分类目录中选中的目录数组
                classificationFinalSelected: [], // 最后实际选择的目录
                publishLoading: false,
                addingNewTag: false, // 添加新标签
                newTagName: '' // 新建标签名
            }
        },
        computed: {},
        methods: {
            handleArticletitleBlur () {
                if (this.article.a_title.length !== 0) {
                } else {
                    this.$Message.error('文章标题不可为空哦');
                }
            },
            editArticlePath () {
            },
            handleEditPublishTime () {
                this.editPublishTime = !this.editPublishTime;
            },
            handleSavePublishTime () {
                this.publishTimeType = 'timing';
                this.editPublishTime = false;
            },
            cancelEditPublishTime () {
                this.publishTimeType = 'immediately';
                this.editPublishTime = false;
            },
            setPublishTime (datetime) {
                this.publishTime = datetime;
            },
            setClassificationInAll (selectedArray) {
                this.classificationFinalSelected = selectedArray.map(item => {
                    return item.title;
                });
                localStorage.classificationSelected = JSON.stringify(this.classificationFinalSelected); // 本地存储所选目录列表
            },
            handleAddNewTag () {
                this.addingNewTag = !this.addingNewTag;
            },
            createNewTag () {
                let vm = this;
                if (vm.newTagName.length !== 0) {
                    api.Post('CmsTagAddApi', {
                        ctg_name: 'other',
                        ct_title: vm.newTagName
                    }, function (res) {
                        if (res.code === 0) {
                            vm.addingNewTag = false;
                            vm.otherTagDB.push ({
                                name: res.ct_name,
                                title: res.ct_title,
                            });
                            vm.articleTagSelected.other.push(res.ct_name);
                            vm.$Notice.success({
                                title: '新增TAG成功'
                            });
                        } else if (res.code === 6) {
                            vm.addingNewTag = false;
                            vm.otherTagDB.push ({
                                name: res.ct_name,
                                title: res.ct_title,
                            });
                            vm.articleTagSelected.other.push(res.ct_name);
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

                    this.articleTagList.push({value: this.newTagName});
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
            handlePreview () {
                if (this.canPublish()) {
                    if (this.publishTimeType === 'immediately') {
                        let date = new Date();
                        let year = date.getFullYear();
                        let month = date.getMonth() + 1;
                        let day = date.getDate();
                        let hour = date.getHours();
                        let minute = date.getMinutes();
                        let second = date.getSeconds();
                        localStorage.publishTime = year + ' 年 ' + month + ' 月 ' + day + ' 日 -- ' + hour + ' : ' + minute + ' : ' + second;
                    } else {
                        localStorage.publishTime = this.publishTime; // 本地存储发布时间
                    }
                    localStorage.content = tinymce.activeEditor.getContent();
                    this.$router.push({
                        name: 'preview'
                    });
                }
            },
            handleSaveDraft () {
                if (!this.canPublish()) {
                    //
                }
            },
            handlePublish () {
                console.log(this.article);
                console.log(this.articleTagSelected);
                console.log(localStorage.classificationSelected);

                if (this.canPublish()) {
                    this.publishLoading = true;
                    setTimeout(() => {
                        this.publishLoading = false;
                        this.$Notice.success({
                            title: '保存成功',
                            desc: '文章《' + this.article.a_title + '》保存成功'
                        });
                    }, 1000);
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
                        for(let ctg_name in res.tagData) {
                            if(ctg_name === 'other') {
                                res.tagData[ctg_name].tagList.forEach((item) => {
                                    vm.otherTagDB.push ({
                                        name: item.ct_name,
                                        title: item.ct_title,
                                    });
                                })
                            } else {
                                let tagList = [];
                                res.tagData[ctg_name].tagList.forEach((item) => {
                                    tagList.push ({
                                        name: item.ct_name,
                                        title: item.ct_title,
                                    });
                                })
                                vm.tagDB.push({
                                    name: res.tagData[ctg_name].ctg_name,
                                    title: res.tagData[ctg_name].ctg_title,
                                    tagList: tagList
                                })
                            }
                            vm.articleTagSelected[ctg_name] = [];
                        }
                    } else {
                        vm.$Notice.warning({
                            title: '错误',
                            desc: res.msg
                        });
                    }
                });
            },

            /**
             * 初始化分类树
             */
            initSortList () {
                let vm = this;
                api.Post('CmsSortGetTreeApi', {cs_id: 0}, function (res) {
                    if (res.code === 0) {
                        console.log(res.sortTree);
                        vm.sortList  = res.sortTree;
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
                    tinymce.baseURL = '/dist';
                    tinymce.init({
                        selector: '#articleEditor',
                        branding: false,
                        elementpath: false,
                        height: 600,
                        language: 'zh_CN.GB2312',
                        menubar: 'edit insert view format table tools',
                        theme: 'modern',
                        plugins: [
                            'advlist autolink lists link image charmap print preview hr anchor pagebreak imagetools',
                            'searchreplace visualblocks visualchars code fullscreen fullpage',
                            'insertdatetime media nonbreaking save table contextmenu directionality',
                            'emoticons paste textcolor colorpicker textpattern imagetools codesample'
                        ],
                        toolbar1: ' newnote print preview | undo redo | insert | styleselect | forecolor backcolor bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image emoticons media codesample',
                        autosave_interval: '20s',
                        image_advtab: true,
                        table_default_styles: {
                            width: '100%',
                            borderCollapse: 'collapse'
                        },
                        setup: function (editor) {
                            editor.on('init', function (e) {
                                vm.spinShow = false;
                                if (localStorage.editorContent) {
                                    tinymce.get('articleEditor').setContent(localStorage.editorContent);
                                }
                            });
                            editor.on('keydown', function (e) {
                                localStorage.editorContent = tinymce.get('articleEditor').getContent();
                            });
                        }
                    });
                })
            }
        },
        computed: {
            completeUrl () {
            }
        },
        mounted () {
            this.articleTagList = [
                {value: 'vue'},
                {value: 'iview'},
                {value: 'ES6'},
                {value: 'webpack'},
                {value: 'babel'},
                {value: 'eslint'}
            ];

            this.initTagData();
            this.initSortList();
            this.initEditor();
        },
        created () {
        },
        destroyed () {
            tinymce.get('articleEditor').destroy();
        }
    }
</script>