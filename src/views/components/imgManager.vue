<style lang="less">
    @import '../../styles/common.less';
</style>
<template>
    <div>
        <Modal
                ref="imgManagerModel"
                v-model="showImgManager"
                width="80"
                :scrollable="true"
                :mask-closable="false"
                @on-ok="ok"
                @on-visible-change="handleVisibleChange"
                :styles="{top: '20px'}">
            <Tabs>
                <TabPane label="素材库" style="height: 70vh;overflow: auto;">
                    <div v-if="!showImgList">
                        <div v-bind:class="['img-manager-img-list', checkSelected(item) ? 'img-manager-selected' : '']" :style="imgNodeSize" v-for="item in uploadList">
                            <img :src="item.url">
                            <div class="img-manager-img-list-cover" @click="handleSelect(item)">
                                <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                            </div>
                        </div>
                    </div>
                    <div style="padding: 5px;" v-if="showImgList">
                        <Table :columns="tableColumn" :data="uploadList"></Table>
                    </div>
                    <div style="padding: 5px;text-align: center;">
                        <Page :current="page" :total="total" :page-size="pagesize" @on-change="handlePageChange" show-total></Page>
                    </div>

                </TabPane>
                <TabPane label="本地上传">
                    <Upload
                            style="margin: 20px;"
                            multiple
                            :show-upload-list="false"
                            :with-credentials="true"
                            :on-success="handleSuccess"
                            :on-format-error="handleFormatError"
                            :on-exceeded-size="handleMaxSize"
                            :before-upload="handleBeforeUpload"
                            :format="['jpg','jpeg','png', 'gif']"
                            type="drag"
                            :action="actionUrl">
                        <div style="padding: 20px 0">
                            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                            <p>点击 或 拖拽 文件上传</p>
                        </div>
                    </Upload>
                    <div v-bind:class="['img-manager-img-list', checkSelected(item) ? 'img-manager-selected' : '']" :style="imgNodeSize" v-for="item in uploadListLast">
                        <img :src="item.url">
                        <div class="img-manager-img-list-cover" @click="handleSelect(item)">
                            <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                        </div>
                    </div>
                </TabPane>
                <TabPane label="网络图片"></TabPane>
                <Row slot="extra" style="width: 45vw;overflow: hidden;">
                    <Col span="5">
                    <Select>
                        <Option value="">全部</Option>
                        <Option value="collection">收藏</Option>
                    </Select>
                    </Col>
                    <Col span="5" style="text-align: center;">
                    <ButtonGroup>
                        <Button :type="showImgList ? 'primary' : 'default'" @click="showImgList = !showImgList" icon="navicon-round"></Button>
                        <Button :type="showImgList ? 'default' : 'primary'" @click="showImgList = !showImgList" icon="android-apps"></Button>
                    </ButtonGroup>
                    </Col>
                    <Col span="14" style="text-align: right;">
                    <Input v-model="searchKeyword" icon="ios-search" @keyup.enter.native="search" placeholder="输入关键词..."></Input>
                    </Col>
                </Row>
            </Tabs>
        </Modal>
        <Modal title="预览图片" v-model="visible">
            <div slot="footer"></div>
            <img :src="imgViewUrl" style="width: 100%">
        </Modal>
    </div>

</template>
<script>
    import api from '../../api';
    import {API_ROOT} from '../../api/config'
    import util from '@/libs/util.js';
    export default {
        name: 'img-manager',
        props: {
            multiple: { // 是否可以多选
                type: Boolean,
                default: false
            }
        },
        components: {},
        data () {
            return {
                showImgManager: false, // 是否显示图片选择器
                imgViewUrl: '', // 预览图片地址
                imgNodeSize: { // 图片尺寸
                    width: '158px',
                    height: '102px'
                },
                searchKeyword: '', // 搜索关键词
                showImgList: false, // 是否显示图片列表
                selectedImg: [], // 选中的图片
                uploadListLast: [], // 最新上传的图片
                uploadList: [], // 显示的图片
                page: 1,
                total: 0,
                pagesize: 40,
                actionUrl: '',
                tableColumn: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '图',
                        align: 'center',
                        width: 100,
                        key: 'thumbnail',
                        type: 'html'
                    },
                    {
                        title: '名称',
                        align: 'left',
                        key: 'att_originalname',
                        type: 'html'
                    },
                    {
                        title: 'URL',
                        align: 'left',
                        key: 'url',
                        type: 'html'
                    },
                    {
                        title: '大小',
                        width: 100,
                        align: 'center',
                        key: 'size',
                        sortable: 'att_size',
                        type: 'html'
                    },
                    {
                        title: '上传时间',
                        align: 'center',
                        width: 200,
                        key: 'att_atime'
                    },
                    {
                        title: '操作',
                        align: 'center',
                        width: 100,
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    on: {
                                        'click': () => {
                                            this.handleView(params.row.url);
                                        }
                                    }
                                }, '预览')
                            ]);
                        }
                    }
                ],
                visible: false,
                callback: function () {
                }
            };
        },
        computed: {},
        methods: {
            open () {
                this.showImgManager = true;


            },
            close () {
                this.showImgManager = false;
            },
            handleVisibleChange (flag) {
                let vm = this;
                if (flag) {
                    let imgManagerModel = this.$refs.imgManagerModel.$el;
                    this.$nextTick(function () {
                        let cur = imgManagerModel.querySelectorAll("div[class='ivu-tabs-tabpane']");
                        vm.imgNodeSize.width = (cur[0].clientWidth / 8 - (cur[0].clientWidth < 800 ? 12 : 14)) + 'px';
                        vm.imgNodeSize.height = vm.imgNodeSize.width;
                        vm.refresh();
                    });
                }
            },
            refresh () {
                let vm = this;
                api.Post('SystemAttListApi', {
                    page: this.page,
                    pagesize: this.pagesize,
                    keyword: this.searchKeyword
                }, function (response) {
                    if (response.code === 0) {
                        vm.uploadList = [];
                        vm.total = response.total;
                        let len = response.data.length;
                        for (let i = 0; i < len; i++) {
                            vm.uploadList.push(response.data[i]);
                        }
                    } else {
                        vm.$Notice.warning({
                            title: '警告',
                            desc: response.msg,
                        });
                    }
                    vm.loading = false;
                }, function (e, statusText) {
                    vm.loading = false;
                    vm.$Notice.error({
                        title: '网络错误，服务请求失败',
                        desc: typeof e === 'object' ? e.message : (e + '[' + statusText + ']')
                    });
                });
            },
            search () {
                this.refresh(); // 列表刷新事件
            },
            checkSelected (file) { // 查看是否选中
                return util.inArray(file.id, this.selectedImg);
            },
            handleSelect (file) {
                if (util.inArray(file.id, this.selectedImg)) {
                    let len = this.selectedImg.length;
                    let index;
                    for (index = 0; index < len; index++) {
                        if (this.selectedImg[index] === file.id) {
                            break;
                        }
                    }
                    this.selectedImg.splice(index, 1);
                } else {
                    if (this.multiple) {
                        this.selectedImg.push(file.id); // 选中图片
                    } else {
                        this.selectedImg = [file.id];
                    }
                }
            },
            handleView (url) {
                this.imgViewUrl = url;
                this.visible = true;
                return false;
            },

            // 上传文件
            handleSuccess (res, file) {
                this.uploadListLast.push({
                    'id': res.att_id,
                    'name': res.att_originalname,
                    'url': res.att_cdn ? res.att_cdn : (res.att_domain + res.att_filepath)
                });
                console.log(res);
                console.log(file);
            },
            handleFormatError (file) {
                this.$Notice.warning({
                    title: '上传文件格式不合法',
                    desc: '您选择的文件： ' + file.name + ' 格式不合法, 请重新选择.'
                });
            },
            handleMaxSize (file) {
                this.$Notice.warning({
                    title: '上传文件大小不合法',
                    desc: '您选择的文件： ' + file.name + ' 太大了.'
                });
            },
            handleBeforeUpload () {
            },
            previewButton (row) { // 预览图片
                this.handleView(row.url);
            },
            handlePageChange (page) {
                this.page = page;
                this.refresh();
            },
            ok () {
                if (typeof this.callback === 'function') {
                    let returnImage = [];
                    for (let i = 0; i < this.uploadList.length; i++) {
                        if (util.inArray(this.uploadList[i].id, this.selectedImg)) {
                            returnImage.push(this.uploadList[i]);
                        }
                    }
                    for (let i = 0; i < this.uploadListLast.length; i++) {
                        if (util.inArray(this.uploadListLast[i].id, this.selectedImg)) {
                            returnImage.push(this.uploadListLast[i]);
                        }
                    }
                    if (returnImage.length > 0) {
                        this.callback(returnImage);
                    }
                }
            }
        },
        mounted () {
            this.actionUrl = API_ROOT + '/attachment/upload';
        },
        created () {
            let vm = this;
            /**
             * 定义 open事件处理函数
             */
            this.$on('open', function (callback) {
                vm.callback = callback;
                vm.open();
            });
            /**
             * 定义 close事件处理函数
             */
            this.$on('close', function () {
                this.close();
            });
        }
    }
</script>

<style>
    .img-manager-img-list {
        display: inline-block;
        text-align: right;
        line-height: 30px;
        border: 2px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 0px 0px rgba(0, 0, 0, .2);
        margin-right: 10px;
        margin-bottom: 10px;
    }

    .img-manager-selected {
        background: #2d8cf0;
    }

    .img-manager-img-list img {
        width: 100%;
        height: 100%;
    }

    .img-manager-img-list-cover {
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, .6);
    }

    .img-manager-img-list:hover .img-manager-img-list-cover {
        display: block;
    }

    .img-manager-img-list-cover i {
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 5px 0 0;
    }
</style>