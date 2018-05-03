<style lang="less">
    @import '../../styles/common.less';
    @import '../components/styles/table.less';
</style>
<template>
    <div>
        <Row style="margin-bottom: 200px;">
            <Col span="18">
            <Card>
                <Form :label-width="80">
                    <FormItem label="专题标题">
                        <Input v-model="special.s_title" icon="android-list" placeholder="输入专题标题..."/>
                    </FormItem>
                    <FormItem label="专题描述">
                        <Input type="textarea" v-model="special.s_abstract" placeholder="输入专题描述..."/>
                    </FormItem>
                </Form>
                <div class="margin-top-20">
                    <textarea id="articleEditor"></textarea>
                </div>
            </Card>
            <Row class="margin-top-10">
                <Col span="12">
                <Card>
                    <Form :label-width="80">
                        <FormItem label="专题模板" class="padding-top-10">
                            <Select v-model="special.s_template">
                                <OptionGroup label="默认">
                                    <Option value="" label="" >
                                        <span>默认</span>
                                        <span style="float:right;color:#ccc">系统默认模板</span>
                                    </Option>
                                </OptionGroup>
                                <OptionGroup :label="group.title" v-for="group in templates">
                                    <Option :value="item.t_name" :label="item.t_title"  v-for="item in group.template">
                                        <span>{{ item.t_title }}</span>
                                        <span style="float:right;color:#ccc">{{ item.t_des }}</span>
                                    </Option>
                                </OptionGroup>
                            </Select>
                        </FormItem>
                    </Form>
                </Card>
                </Col>
                <Col span="12">
                <Card>
                    <Form>
                        <FormItem label="关联TAG(可组合)" class="padding-top-10">
                            <Input v-model="special.s_extended" type="textarea"/>
                        </FormItem>
                    </Form>
                </Card>
                </Col>
            </Row>
            </Col>
            <Col span="6" class="padding-left-10">
            <Card>
                <p slot="title">
                    <Icon type="flag"></Icon>
                    封面图
                </p>
                <Button slot="extra" type="ghost" @click="handleSelectImg" icon="ios-cloud-upload-outline">选择文件</Button>
                <img :src="special.s_img" style="width: 100%">
            </Card>
            <Card class="margin-top-10">
                <p slot="title">
                    <Icon type="paper-airplane"></Icon>
                    属性
                </p>
                <p class="margin-top-10">
                    专题名称：
                    <Input v-model="special.s_name" placeholder="专题名称..."/>
                </p>
                <p class="margin-top-10">
                    <Icon type="star"></Icon>
                    <Checkbox v-model="special.recommend">推荐</Checkbox>
                    <Checkbox v-model="special.top">置顶</Checkbox>
                    <Checkbox v-model="special.cover">封面</Checkbox>
                    <Checkbox v-model="special.special">特殊</Checkbox>
                </p>
                <Row class="margin-top-20 publish-button-con">
                    <span class="publish-button"><Button @click="handleSaveSpecial" :loading="publishLoading" icon="ios-checkmark" style="width:90px;" type="primary">保存</Button></span>
                </Row>
            </Card>
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
        name: 'menu-view',
        components: {
            imgManager
        },
        data () {
            return {
                publishLoading: false,
                templates: [], // 所有模板
                special: {
                    s_id: 0,
                    s_name: '',
                    s_title: '',
                    s_img: '',
                    s_abstract: '',
                    s_content: '',
                    s_extended: '',
                    s_template: '',
                    recommend: false,
                    top: false,
                    cover: false,
                    special: false,
                    s_atime: '',
                    s_status: 0
                }
            };
        },
        computed: {},
        methods: {
            refresh () {
                let vm = this;
                api.Post('CmsSpecialGetApi', {
                    s_id: this.special.s_id
                }, function (res) {
                    if (res.code === 0) {
                        vm.special.s_id = res.s_id;
                        vm.special.s_name = res.s_name;
                        vm.special.s_title = res.s_title;
                        vm.special.s_img = res.s_img;
                        vm.special.s_abstract = res.s_abstract;
                        vm.special.s_content = res.s_content;
                        vm.special.s_extended = res.s_extended;
                        vm.special.s_template = res.s_template;
                        vm.special.t_atime = res.t_atime;
                        vm.special.recommend = res.flag.recommend ? true : false;
                        vm.special.top = res.flag.top ? true : false;
                        vm.special.cover = res.flag.cover ? true : false;
                        vm.special.special = res.flag.special ? true : false;
                        vm.special.s_atime = res.s_atime;
                        vm.special.s_status = res.s_status;
                    }
                    vm.initEditor();
                });
            },
            handleSelectImg () {
                let vm = this;
                this.$refs.imgManager.$emit('open', function (selectedImg) {
                    selectedImg = selectedImg[0];
                    vm.special.s_img = selectedImg.url;
                });
            },
            /**
             * 初始化编辑器
             */
            initEditor () {
                this.$nextTick(() => {
                    let vm = this;
                    let height = document.body.offsetHeight - 300;

//                    tinymce.baseURL = '/dist';
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
                                tinymce.get('articleEditor').setContent(vm.special.s_content ? vm.special.s_content : '');
                            });
//                            editor.on('keydown', function (e) {
//                                    localStorage.editorContent = tinymce.get('articleEditor').getContent();
//                            });
                        }
                    });
                });
            },
            handleSaveSpecial: function () {
                let vm = this;
                vm.special.s_content = tinymce.get('articleEditor').getContent();
                api.Post('CmsSpecialFormApi', this.special, function (ret) {
                    if (ret.code === 0) {
                        vm.$Message.info('保存成功');
                        if(!vm.special.s_id) {
                            vm.special.s_id = ret.id;
                        }
                        vm.refresh();
                    } else {
                        vm.$Notice.warning({
                            title: '错误',
                            desc: ret.msg
                        });
                    }
                });
            }
        },
        mounted () {
            let vm = this;
            let s_id = 0;
            if (this.$route.params.s_id) {
                s_id = parseInt(this.$route.params.s_id.toString());
            }
            if (s_id) { // 编辑
                this.special.s_id = s_id;
                this.refresh();
            } else {
                this.initEditor();
            }

            api.Post('CmsTemplateSelectApi', {
                test: 0
            }, function (res) {
                if (res.code === 0) {
                    vm.templates = res.data;
                } else {
                    vm.$Notice.warning({
                        title: '错误',
                        desc: res.msg
                    });
                }
            });
        },
        created () {
        },
        destroyed () {
            tinymce.get('articleEditor').destroy();
        }
    }
</script>