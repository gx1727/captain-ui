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
        name: 'cms-tag-group',
        components: {
            commonTable
        },
        data () {
            return {
                fromTag: false,
                loading: true,
                searchParam: {
                    keyword: ''
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
                        type: 'index',
                        width: 100,
                        align: 'center'
                    },
                    {
                        title: '文章标题',
                        align: 'center',
                        key: 'a_title'
                    },
                    {
                        title: '创建时间',
                        align: 'center',
                        key: 'a_atime',
                        sortable: 'a_atime',
                        width: 150
                    },
                    {
                        title: '修改时间',
                        align: 'center',
                        key: 'a_etime',
                        sortable: 'a_etime',
                        width: 150
                    },
                    {
                        title: '查看次数',
                        align: 'center',
                        key: 'a_count',
                        sortable: 'a_count',
                        width: 100
                    },
                    {
                        title: '状态',
                        align: 'center',
                        key: 'a_status_title',
                        width: 100
                    },
                    {
                        title: '操作',
                        align: 'center',
                        width: 200,
                        key: 'handle',
                        handle: [
                            {
                                title: '编辑',
                                type: 'primary',
                                fun: this.editButton
                            }, {
                                title: '预览',
                                type: '',
                                fun: this.previewButton
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
                window.open('/' + row.a_id, '_blank');
            },
            handleCancelSearch () {
                this.searchParam.keyword = '';
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

                api.Post('CmsTagDelApi', {
                    ct_id: val.ct_id,
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
                }, function (e, statusText) {
                    vm.$Notice.error({
                        title: '网络错误，服务请求失败',
                        desc: typeof e == 'object' ? e.message : (e + '[' + statusText + ']')
                    });
                });
            },
            addTag () {
                let vm = this;
                this.$refs['formTag'].validate((valid) => {
                    if (valid) {
                        api.Post('CmsTagAddApi', vm.tagNode, function (res) {
                            vm.fromTag = false;
                            if (res.code === 0) {
                                vm.refresh();
                                vm.$Notice.success({
                                    title: '新增TAG成功'
                                });
                            } else if (res.code === 6) {
                                vm.$Notice.info({
                                    title: '提示',
                                    desc: res.msg
                                });
                                vm.refresh();
                            } else {
                                vm.$Notice.warning({
                                    title: '错误',
                                    desc: res.msg
                                });
                            }
                        });
                    } else {
                    }
                });
            }
        },
        mounted () {
            let vm = this;
            api.Post('CmsTagGroupListApi', {
                keyword: ''
            }, function (res) {
                if (res.code === 0) {
                    if (res.total > 0) {
                        vm.tagGroupList = res.data;
                        let filters = []
                        res.data.forEach(item => {
                            filters.push({
                                label: item.ctg_title,
                                value: item.ctg_name
                            });

                        });
                        vm.tableColumn[1].filters = filters;
                        vm.tableColumn[1].filterRemote = function (values, key) {
                            if (key == 'ctg_name_title') {
                                key = 'ctg_name';
                            }
                            if (values.length <= 0) {
                                delete vm.searchParam[key];
                            } else {
                                vm.searchParam[key] = JSON.stringify(values);
                            }
                            vm.refresh();
                        }
                    }
                } else {
                    vm.$Notice.warning({
                        title: '获取分组失败',
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
        created () {
        }
    }
</script>