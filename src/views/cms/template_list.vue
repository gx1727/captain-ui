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
                    模板
                </p>
                <a href="#" @click="createTemplate" slot="extra">
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
                            remote-api="CmsTemplateListApi"
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
        name: 'template-list',
        components: {
            commonTable
        },
        data () {
            return {
                tableKey: 'template_list',
                searchParam: {
                    keyword: ''
                },
                tableColumn: [
                    {
                        title: '#',
                        key: 't_id',
                        width: 100,
                        align: 'center'
                    },
                    {
                        title: '模板标题',
                        align: 'left',
                        key: 't_title',
                        width: 300
                    },
                    {
                        title: '模板种类',
                        align: 'center',
                        key: 't_type',
                        width: 100
                    },
                    {
                        title: '模板分类',
                        align: 'center',
                        key: 't_class',
                        width: 100
                    },
                    {
                        title: '模板路径',
                        align: 'center',
                        key: 't_path'
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
            createTemplate () { //新建文章
                let argu = {t_id: 0};
                this.$router.push({
                    name: 'template_form',
                    params: argu
                });
            },
            editButton (row) {
                let argu = {t_id: row.t_id};
                this.$router.push({
                    name: 'template_form',
                    params: argu
                });
            },
            handleCancelSearch () {
                this.searchParam.keyword = '';
                this.refresh();
            },
            handleDelete(val, index) {
                let vm = this;
                vm.$Message.info('提交中...');

                api.Post('CmsTemplateDelApi', {
                    t_id: val.t_id,
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