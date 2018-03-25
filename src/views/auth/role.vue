<style lang="less">
    @import '../../styles/common.less';
    @import '../components/styles/table.less';
</style>

<template>
    <div>
        <Row class="margin-top-10">
            <Col span="24">
            <Card extra="hello">
                <p slot="title">
                    <Icon type="clipboard"></Icon>
                    角色管理页
                </p>
                <a href="#" @click="refresh" slot="extra">
                    <Icon type="ios-loop-strong"></Icon>
                    刷新
                </a>
                <Row>
                    <Input v-model="searchParam.keyword" placeholder="请输入key..." style="width: 200px"/>
                    <span @click="refresh" style="margin: 0 10px;"><Button type="primary" icon="search">搜索</Button></span>
                    <Button @click="handleCancelSearch" type="ghost">取消</Button>
                </Row>
                <Row :gutter="10" class="margin-top-10">
                    <Col span="24">
                    <common-table
                            ref="table"
                            remote-api="RoleList"
                            @on-cell-change="handleCellChange"
                            @on-change="handleChange"
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
        name: 'editable-table',
        components: {
            commonTable
        },
        data () {
            return {
                searchParam: {
                    keyword: ''
                }, // 搜索参数
                tableColumn: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '序号',
                        type: 'index',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '角色编码',
                        align: 'center',
                        key: 'role_code',
                        type: 'html'
                    },
                    {
                        title: '角色名称',
                        align: 'center',
                        key: 'role_name',
                        width: 200,
                        editable: true
                    },
                    {
                        title: '角色标题',
                        align: 'center',
                        key: 'role_title',
                        editable: true
                    },
                    {
                        title: '使用的菜单',
                        align: 'center',
                        key: 'role_menu',
                        sortable: 'role_menu',
                        editable: true
                    },
                    {
                        title: '角色主页',
                        align: 'center',
                        key: 'role_homeurl',
                        editable: true
                    },
                    {
                        title: '角色显示模板',
                        align: 'center',
                        key: 'role_template',
                        sortable: 'role_template',
                        editable: true
                    },
                    {
                        title: '角色说明',
                        align: 'center',
                        key: 'role_remark',
                        editable: true
                    },
                    {
                        title: '操作',
                        align: 'center',
                        width: 200,
                        key: 'handle',
                        handle: [
                            'edit'
                        ]
                    }
                ]
            };
        },
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
                api.Post('RoleEditApi', {
                    role_id: val.role_id,
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
                api.Post('RoleEditApi', {
                    role_id: val.role_id,
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
                }, function (e, statusText) {
                    vm.$Notice.error({
                        title: '网络错误，服务请求失败',
                        desc: typeof e == 'object' ? e.message : (e + '[' + statusText + ']')
                    });
                });
            }

        },
        created () {
        }
    };
</script>
