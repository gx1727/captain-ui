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
                    编辑列表
                </p>
                <a href="#" @click="createEditor" slot="extra">
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
                            remote-api="CmsEditorListApi"
                            @on-delete="handleDelete"
                            :hover-show="true"
                            :edit-incell="false"
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
        name: 'cms-editor',
        components: {
            commonTable
        },
        data () {
            return {
                searchParam: {
                    keyword: ''
                },
                tableColumn: [
                    {
                        title: '#',
                        type: 'index',
                        width: 100,
                        align: 'center'
                    },
                    {
                        title: '用户名',
                        align: 'center',
                        key: 'user_name'
                    },
                    {
                        title: '创建时间',
                        align: 'center',
                        key: 'user_atime',
                        sortable: 'user_atime',
                        width: 150
                    },
                    {
                        title: '真实姓名',
                        align: 'center',
                        key: 'user_true_name',
                        sortable: 'user_true_name',
                        width: 150
                    },
                    {
                        title: '电话',
                        align: 'center',
                        key: 'user_phone',
                        sortable: 'user_phone',
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
                let argu = {user_id: row.user_id};
                this.$router.push({
                    name: 'cms_editor_form',
                    params: argu
                });
            },
            handleCancelSearch () {
                this.searchParam.keyword = '';
                this.refresh();
            },
            createEditor () { //新建编辑
                let argu = {user_id: 0};
                this.$router.push({
                    name: 'cms_editor_form',
                    params: argu
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
        },
        mounted () {
        },
        created () {
        }
    }
</script>