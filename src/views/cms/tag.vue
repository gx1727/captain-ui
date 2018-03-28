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
                    文章TAG
                </p>
                <a href="#" @click="fromTag = true" slot="extra">
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
                            remote-api="CmsTagListApi"
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
        <Modal
                v-model="fromTag"
                title="新增TAG"
                :loading="loading"
                @on-ok="addTag">
            <Row class="margin-top-10">
                <Col span="24">
                <Form :model="tagNode" :label-width="80" :rules="ruleValidate" ref="formTag">
                    <FormItem label="TAG分组" prop="ctg_name">
                        <Select v-model="tagNode.ctg_name">
                            <Option v-for="item in tagGroupList" :value="item.ctg_name" :key="item.ctg_name">{{ item.ctg_title }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="TAG标题" prop="ct_title">
                        <Input v-model="tagNode.ct_title" placeholder="请输入TAG标题"/>
                    </FormItem>
                    <FormItem label="TAG模板">
                        <Input v-model="tagNode.ct_template" placeholder="请输入TAG模板"/>
                    </FormItem>
                    <FormItem label="TAG排序">
                        <Input v-model="tagNode.ct_order" placeholder="请输入TAG排序"/>
                    </FormItem>
                    <FormItem label="TAG图片">
                        <Input v-model="tagNode.ct_img" placeholder="请输入TAG图片"/>
                    </FormItem>
                </Form>
                </Col>
            </Row>
        </Modal>
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
                ruleValidate: {
                    ctg_name: [
                        {required: true, message: 'TAG标题不能为空', trigger: 'blur'}
                    ],
                    ct_title: [
                        {required: true, message: 'TAG标题不能为空', trigger: 'blur'}
                    ]
                },
                tableColumn: [
                    {
                        title: '#',
                        type: 'index',
                        width: 100,
                        align: 'center'
                    },
                    {
                        title: '分组名称',
                        align: 'center',
                        key: 'ctg_name_title',
                        width: 200,
                        filters: [],
                        filterMultiple: false,
                        filterRemote (values, key) {
                        }
                    },
                    {
                        title: 'TAG名称',
                        align: 'center',
                        key: 'ct_name',
                        editable: true
                    },
                    {
                        title: 'TAG标题',
                        align: 'center',
                        key: 'ct_title',
                        editable: true
                    },
                    {
                        title: 'TAG模板',
                        align: 'center',
                        key: 'ct_template',
                        editable: true
                    },
                    {
                        title: 'TAG排序',
                        align: 'center',
                        key: 'ct_order',
                        sortable: 'ct_order',
                        editable: true
                    },
                    {
                        title: 'TAG图片',
                        align: 'center',
                        key: 'ct_img',
                        editable: true
                    },
                    {
                        title: '操作',
                        align: 'center',
                        width: 150,
                        key: 'handle',
                        handle: [
                            'edit', 'delete'
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
            handleCancelSearch () {
                this.searchParam.keyword = '';
                this.refresh();
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