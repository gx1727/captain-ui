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
                    专题
                </p>
                <a href="#" @click="createSpecial" slot="extra">
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
                            remote-api="CmsSpecialListApi"
                            @on-delete="handleDelete"
                            :hover-show="true"
                            :edit-incell="false"
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
        name: 'special-list',
        components: {
            commonTable
        },
        data () {
            return {
                tableKey: 'special_list',
                searchParam: {
                    keyword: ''
                },
                tableColumn: [
                    {
                        title: '#',
                        key: 's_id',
                        width: 100,
                        align: 'center'
                    },
                    {
                        title: '专题名称',
                        align: 'left',
                        key: 's_name',
                        width: 300
                    },
                    {
                        title: '专题标题',
                        align: 'left',
                        key: 's_title',
                        width: 300
                    },
                    {
                        title: '专题标志',
                        align: 'center',
                        key: 'flag',
                        width: 100
                    },
                    {
                        title: '专题模板',
                        align: 'center',
                        key: 's_template',
                        width: 100
                    },
                    {
                        title: '扩展参数',
                        align: 'left',
                        key: 's_extended'
                    },
                    {
                        title: '操作',
                        align: 'center',
                        width: 180,
                        key: 'handle',
                        fixed: 'right',
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
            createSpecial () { // 新建专题
                let argu = {s_id: 0};
                this.$router.push({
                    name: 'special_form',
                    params: argu
                });
            },
            editButton (row) {
                let argu = {s_id: row.s_id};
                this.$router.push({
                    name: 'special_form',
                    params: argu
                });
            },
            handleCancelSearch () {
                this.searchParam.keyword = '';
                this.refresh();
            },
            handleDelete (val, index) {
                let vm = this;
                vm.$Message.info('提交中...');

                api.Post('CmsSpecialDelApi', {
                    s_id: val.s_id
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
            }
        },
        mounted () {
            this.refresh();
        },
        created () {
        }
    }
</script>