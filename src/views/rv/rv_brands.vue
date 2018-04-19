<style lang="less">
    @import '../../styles/common.less';
    @import '../components/styles/table.less';
</style>
<template>
    <Row class="margin-top-10">
        <Col span="24">
        <Card>
            <p slot="title">
                <Icon type="clipboard"></Icon>
                品牌列表
            </p>
            <!--<a href="#" @click="createBrands" slot="extra">-->
                <!--<Icon type="android-add"></Icon>-->
                <!--新增-->
            <!--</a>-->
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
                        remote-api="CmsBrandsListApi"
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
</template>
<script>
    import commonTable from '../components/commonTable.vue';
    import api from '../../api';
    export default {
        name: 'menu-view',
        components: {
            commonTable
        },
        data () {
            return {
                tableKey: 'brands_list',
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
                        title: '首字母',
                        align: 'center',
                        key: 'rb_initials',
                        width: 80
                    },
                    {
                        title: '名称',
                        align: 'center',
                        key: 'rb_name',
                        sortable: 'rb_name',
                        width: 150
                    },
                    {
                        title: '标题',
                        align: 'center',
                        key: 'rb_title',
                        sortable: 'rb_title',
                    }
//                    ,{
//                        title: '操作',
//                        align: 'center',
//                        width: 200,
//                        key: 'handle',
//                        handle: [
//                            {
//                                title: '编辑',
//                                type: 'primary',
//                                fun: this.editButton
//                            },
//                            'delete'
//                        ]
//                    }
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
            createBrands () { //新建编辑
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
