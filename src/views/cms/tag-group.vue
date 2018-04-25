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
                    文章TAG分组
                </p>
                <a href="#" @click="addTagGroup" slot="extra">
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
                            remote-api="CmsTagGroupListApi"
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
                <Alert>
                    分组类型说明:
                    <template slot="desc">
                        1: 常规文章TAG <br/>
                        2: 车型库 <br/>
                        3: 营地 <br/>
                        4: 功能性
                    </template>
                </Alert>
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
                tableKey: 'tag_group_list', // 列表名称
                searchParam: {
                    keyword: ''
                },
                tableColumn: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '序号',
                        key: 'ctg_id',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '分组类型',
                        align: 'center',
                        key: 'ctg_type',
                        editable: true
                    },
                    {
                        title: '分组名称',
                        align: 'center',
                        key: 'ctg_name',
                        editable: true
                    },
                    {
                        title: '分组标题',
                        align: 'center',
                        key: 'ctg_title',
                        editable: true
                    },
                    {
                        title: '分组排序',
                        align: 'center',
                        key: 'ctg_order',
                        editable: true
                    },
                    {
                        title: '分组图片',
                        align: 'center',
                        key: 'ctg_img',
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

                api.Post('CmsTagGroupEditApi', {
                    ctg_id: val.ctg_id,
                    postData: JSON.stringify(postData)
                }, function (res) {
                    vm.$Message.destroy();
                    if (res.code === 0) {
                        vm.$Notice.success({
                            title: '修改成功'
                        });
                    } else {
                        vm.$Notice.warning({
                            title: '修改失败',
                            desc: res.msg
                        });
                    }
                });
            },
            handleChange (val, index) {
                let vm = this;
                vm.$Message.info('提交中...');
                api.Post('CmsTagGroupEditApi', {
                    ctg_id: val.ctg_id,
                    postData: JSON.stringify(val)
                }, function (res) {
                    vm.$Message.destroy();
                    if (res.code === 0) {
                        vm.$Notice.success({
                            title: '修改成功'
                        });
                    } else {
                        vm.$Notice.warning({
                            title: '修改失败',
                            desc: res.msg
                        });
                    }
                });
            },
            handleDelete(val, index) {
                let vm = this;
                vm.$Message.info('提交中...');
                api.Post('CmsTagGroupDelApi', {
                    ctg_id: val.ctg_id,
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
            addTagGroup () {
                let vm = this;
                api.Post('CmsTagGroupAddApi', {}, function (res) {
                    if (res.code === 0) {
                        vm.refresh();
                    } else {
                        vm.$Notice.warning({
                            title: '错误',
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
                }
                this.$refs.table.$emit('cache'); // 设置 开始缓存
                vm.refresh();
            }
        },
        mounted () {
            this.initTable();
        },
        created () {
        }
    }
</script>