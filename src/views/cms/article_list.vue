<style lang="less">
    @import '../../styles/common.less';
    @import '../components/styles/table.less';
</style>
<template>
    <div>
        <Row class="margin-top-10">
            <Col span="24">
            <Card>
                <p slot="title">
                    <Icon type="clipboard"></Icon>
                    文章列表
                </p>
                <a href="#" @click="createArticle" slot="extra">
                    <Icon type="android-add"></Icon>
                    新增
                </a>
                <a href="#" @click="refresh" slot="extra">
                    <Icon type="ios-loop-strong"></Icon>
                    刷新
                </a>
                <Row>
                    <Select v-model="searchParam.user_code" style="width:200px" placeholder="编辑人员...">
                        <Option v-for="item in editorList" :value="item.user_code" :key="item.user_code">{{ item.user_name }}</Option>
                    </Select>
                    <Select v-model="searchParam.lanmu" style="width:200px" placeholder="栏目...">
                        <Option v-for="item in lanmuList" :value="item.name" :key="item.name">{{ item.title }}</Option>
                    </Select>
                    <Select v-model="searchParam.a_status" style="width:100px" placeholder="文章状态...">
                        <Option value="0">所有</Option>
                        <Option value="1">正常显示</Option>
                        <Option value="2">未发布,不显示</Option>
                        <Option value="3">草稿中</Option>
                    </Select>
                    <Input v-model="searchParam.keyword" placeholder="请输入关键字..." style="width: 200px"/>
                    <span @click="refresh" style="margin: 0 10px;"><Button type="primary" icon="search">搜索</Button></span>
                    <Button @click="handleCancelSearch" type="ghost">取消</Button>
                </Row>
                <Row :gutter="10" class="margin-top-10">
                    <Col span="24">
                    <common-table
                            ref="table"
                            remote-api="CmsArticleListApi"
                            @on-cell-change="handleCellChange"
                            @on-change="handleChange"
                            @on-delete="handleDelete"
                            :hover-show="true"
                            :edit-incell="true"
                            :columns-list="tableColumn"
                            :table-key="tableKey"
                            :search-param="searchParam"
                    ></common-table>
                    </Col>
                </Row>
            </Card>
            </Col>
        </Row>
    </div>
</template>
<script>
    import commonTable from '../components/commonTable.vue';
    import api from '../../api';
    export default {
        name: 'cms-article-list',
        components: {
            commonTable
        },
        data () {
            return {
                editorList: [], // 编辑人员列表
                lanmuList: [], // 栏目
                tableKey: 'article_list', // 列表名称
                searchParam: {
                    keyword: '',
                    user_code: '',
                    a_status: '1',
                    lanmu: ''
                },
                tagGroupList: [], // 分组数据
                tagNode: {
                    ctg_name: '',
                    ct_title: '',
                    ct_template: '',
                    ct_order: 0,
                    ct_img: ''
                },
                tableColumn: [
                    {
                        title: '#',
                        key: 'a_id',
                        width: 100,
                        align: 'center'
                    },
                    {
                        title: '文章标题',
                        align: 'left',
                        key: 'a_title',
                        width: 300
                    },
                    {
                        title: '发布者',
                        align: 'center',
                        key: 'user_name',
                        width: 150
                    },
                    {
                        title: '发布时间',
                        align: 'center',
                        key: 'a_ptime',
                        sortable: 'a_ptime',
                        width: 150
                    },
                    {
                        title: '栏目',
                        align: 'center',
                        key: 'lanmu',
                        width: 100
                    },

                    {
                        title: '状态',
                        align: 'center',
                        key: 'a_status_title',
                        width: 100
                    },
                    {
                        title: '查看次数',
                        align: 'center',
                        key: 'a_count',
                        sortable: 'a_count',
                        width: 100
                    },
                    {
                        title: 'TAG',
                        align: 'center',
                        key: 'tags',
                        type: 'html',
                        width: 100
                    },
                    {
                        title: '其它分类',
                        align: 'center',
                        key: 'sorts',
                        type: 'html',
                        width: 100
                    },
                    {
                        title: '修改时间',
                        align: 'center',
                        key: 'a_etime',
                        sortable: 'a_etime',
                        width: 150
                    },
                    {
                        title: '操作',
                        align: 'center',
                        width: 180,
                        key: 'handle',
                        fixed: 'right',
                        handle: [
                            {
                                title: '预览',
                                type: '',
                                fun: this.previewButton
                            },
                            {
                                title: '编辑',
                                type: 'primary',
                                fun: this.editButton
                            },
                            'delete'
                        ]
                    }
                ]
            }
        },
        computed: {},
        methods: {
            refresh () { // 刷新列表
                this.$refs.table.$emit('refresh'); // 解发列表刷新事件
            },
            editButton (row) {
                let argu = {a_id: row.a_id};
                this.$router.push({
                    name: 'cms_article_publish',
                    params: argu
                });
            },
            previewButton (row) {
                window.open('/' + row.a_code, '_blank');
            },
            handleCancelSearch () {
                this.searchParam.user_code = '';
                this.searchParam.a_status = '1';
                this.searchParam.keyword = '';
                this.searchParam.lanmu = '';
                this.refresh();
            },
            createArticle () { //新建文章
                let argu = {a_id: 0};
                this.$router.push({
                    name: 'cms_article_publish',
                    params: argu
                });
            },
            handleCellChange (val, index, key) {
                let vm = this;
                let postData = {};
                postData[key] = val[key];
                vm.$Message.info('提交中...');

                api.Post('CmsTagEditApi', {
                    ct_id: val.ct_id,
                    postData: JSON.stringify(postData)
                }, function (res) {
                    vm.$Message.destroy();
                    if (res.code === 0) {
                        vm.refresh();
                        vm.$Notice.success({
                            title: '修改成功'
                        });
                    } else {
                        vm.refresh();
                        vm.$Notice.warning({
                            title: '修改失败',
                            desc: res.msg
                        });
                    }
                }, function (e, statusText) {
                    vm.$Notice.error({
                        title: '网络错误，服务请求失败',
                        desc: typeof e == 'object' ? e.message : (e + '[' + statusText + ']')
                    });
                });
            },
            handleChange (val, index) {
                let vm = this;
                vm.$Message.info('提交中...');
                api.Post('CmsTagEditApi', {
                    ct_id: val.ct_id,
                    postData: JSON.stringify(val)
                }, function (res) {
                    vm.$Message.destroy();
                    if (res.code === 0) {
                        vm.refresh();
                        vm.$Notice.success({
                            title: '修改成功'
                        });
                    } else {
                        vm.refresh();
                        vm.$Notice.warning({
                            title: '修改失败',
                            desc: res.msg
                        });
                    }
                }, function (e, statusText) {
                    vm.$Notice.error({
                        title: '网络错误，服务请求失败',
                        desc: typeof e == 'object' ? e.message : (e + '[' + statusText + ']')
                    });
                });
            },
            handleDelete(val, index) {
                let vm = this;
                vm.$Message.info('提交中...');

                api.Post('CmsArticleDelApi', {
                    a_id: val.a_id,
                    postData: JSON.stringify(val)
                }, function (res) {
                    vm.$Message.destroy();
                    if (res.code === 0) {
                        vm.refresh();
                        vm.$Notice.success({
                            title: '删除成功'
                        });
                    } else {
                        vm.$Notice.warning({
                            title: '删除',
                            desc: res.msg
                        });
                    }
                });
            },
            /**
             * 初始化table
             */
            initTable () {
                let vm = this;
                if (this.tableKey && localStorage[this.tableKey]) {
                    // 读取缓存列表参数
                    let param = JSON.parse(localStorage[this.tableKey]);
                    if (param.keyword) {
                        this.searchParam.keyword = param.keyword;
                    }
                    if (param.user_code) {
                        this.searchParam.user_code = param.user_code;
                    }
                    if (param.a_status) {
                        this.searchParam.a_status = param.a_status;
                    }
                    if (param.lanmu) {
                        this.searchParam.lanmu = param.lanmu;
                    }
                }
                this.$refs.table.$emit('cache'); // 设置 开始缓存
                vm.refresh();
            }
        },
        mounted () {
            let vm = this;
            this.initTable();
            api.Post('CmsArticleLanmuApi', {
                keyword: ''
            }, function (res) {
                vm.lanmuList = [{name: '', title: '全部'}]
                if (res.code === 0) {
                    for (let i in res.lanmu) {
                        vm.lanmuList.push(res.lanmu[i]);
                    }
                } else {
                    vm.$Notice.warning({
                        title: '获取栏目失败',
                        desc: res.msg
                    });
                }
            });
        },
        created () {
        }
    }
</script>