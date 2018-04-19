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
                车系列表
            </p>
            <a href="#" @click="createRv" slot="extra">
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
                        remote-api="CmsRvListApi"
                        @on-delete="handleDelete"
                        :on-remote-data="handRemoteData"
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
                tableKey: 'rv_list', // 列表名称
                searchParam: {
                    keyword: '',
                    rb_id: ''
                },
                tableColumn: [
                    {
                        title: '#',
                        key: 'rv_id',
                        width: 100,
                        align: 'center'
                    },
                    {
                        title: '房车名',
                        align: 'left',
                        key: 'rv_name',
                        sortable: 'rv_name',
                        width: 150
                    },
                    {
                        title: '图片',
                        align: 'center',
                        key: 'img',
                        type: 'html',
                        width: 140
                    },
                    {
                        title: '品牌',
                        align: 'center',
                        key: 'brands',
//                        sortable: 'rb_id',
                        width: 150,
                        filters: [],
                        filterMultiple: false,
                        filterRemote (values, key) {
                        }
                    },
                    {
                        title: '级别分类',
                        align: 'left',
                        key: 'level',
                        width: 150
                    },
                    {
                        title: '底盘',
                        align: 'left',
                        key: 'chassis',
                        width: 150
                    },
                    {
                        title: '房车标题',
                        align: 'center',
                        key: 'rv_title',
                        sortable: 'rv_title',
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
                let argu = {rv_id: row.rv_id};
                this.$router.push({
                    name: 'cms_rv_form',
                    params: argu
                });
            },
            handleCancelSearch () {
                this.searchParam.keyword = '';
                this.refresh();
            },
            createRv () { //新建编辑
                let argu = {rv_id: 0};
                this.$router.push({
                    name: 'cms_rv_form',
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
            handRemoteData (data) {
                let len = data.data.length;
                for (let i = 0; i < len; i++) {
                    data.data[i]['img'] = '<img src="' + data.data[i].rv_img + '" style="height:60px"/>';
                }
                return data;
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
                    if (param.rb_id) {
                        this.searchParam.rb_id = param.rb_id;
                    }
                }
                this.$refs.table.$emit('cache'); // 设置 开始缓存
                vm.refresh();
            }
        },
        mounted () {
            let vm = this;
            this.initTable();

            api.Post('CmsBrandsAllApi', {
                keyword: ''
            }, function (res) {
                if (res.code === 0) {
                    let filters = [];
                    for (let index in res.data) {
                        filters.push({
                            label: res.data[index],
                            value: index
                        });
                    }

                    vm.tableColumn[3].filters = filters;
                    vm.tableColumn[3].filterRemote = function (values, key) {
                        if (key === 'brands') {
                            key = 'rb_id';
                        }
                        if (values.length <= 0) {
                            delete vm.searchParam[key];
                        } else {
                            vm.searchParam[key] = values[0];
                        }
                        vm.refresh();
                    }
                }
            });
        },
        created () {
        }
    }
</script>
