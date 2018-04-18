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
                车型列表
            </p>
            <a href="#" @click="createModel" slot="extra">
                <Icon type="android-add"></Icon>
                新增
            </a>
            <a href="#" @click="refresh" slot="extra">
                <Icon type="ios-loop-strong"></Icon>
                刷新
            </a>
            <Row>
                <Select v-model="searchParam.rb_id" @on-change="handleBrandsChange" style="width:200px" placeholder="品牌..." filterable>
                    <Option v-for="item in brandsList" :value="item.rb_id" :key="item.rb_id">{{ item.rb_title }}</Option>
                </Select>
                <Select v-model="searchParam.rv_id" style="width:200px" placeholder="车系..." filterable>
                    <Option v-for="item in rvList" :value="item.rv_id" :key="item.rv_id">{{ item.rv_title }}</Option>
                </Select>
                <Input v-model="searchParam.keyword" placeholder="请输入关键字..." style="width: 200px"/>
                <span @click="refresh" style="margin: 0 10px;"><Button type="primary" icon="search">搜索</Button></span>
                <Button @click="handleCancelSearch" type="ghost">取消</Button>
            </Row>
            <Row :gutter="10" class="margin-top-10">
                <Col span="24">
                <common-table
                        ref="table"
                        remote-api="CmsModelListApi"
                        @on-delete="handleDelete"
                        :on-remote-data="handleRemoteData"
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
                brandsList: [], // 品牌列表
                rvList: [], // 车系列表
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
                    },
                    {
                        title: '车系',
                        align: 'center',
                        key: 'rv',
                    },
                    {
                        title: '年款',
                        align: 'center',
                        key: 'rm_year',
                        sortable: 'rm_year',
                        width: 80
                    },
                    {
                        title: '车型名',
                        align: 'left',
                        key: 'rm_name',
                        width: 200
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
                let argu = {rm_id: row.rm_id};
                this.$router.push({
                    name: 'cms_model_form',
                    params: argu
                });
            },
            handleCancelSearch () {
                this.searchParam.keyword = '';
                this.refresh();
            },
            createModel () { //新建编辑
                let argu = {rm_id: 0};
                this.$router.push({
                    name: 'cms_model_form',
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
            handleRemoteData (data) {
                let len = data.data.length;
                for (let i = 0; i < len; i++) {
                    data.data[i]['img'] = '<img src="' + data.data[i].rm_img + '" style="height:60px"/>';
                }
                return data;
            },
            handleBrandsChange () {
                let vm = this;
                api.Post('CmsRvBrandsApi', {
                    rb_id: vm.searchParam.rb_id
                }, function (res) {
                    vm.rvList = [{
                        rv_id: 0,
                        rv_title: '所有'
                    }]
                    if (res.code === 0) {
                        for (let index in res.data){
                            vm.rvList.push({
                                rv_id: index,
                                rv_title: res.data[index]
                            });
                        }

                    }
                });
            }
        },
        mounted () {
            let vm = this;
            api.Post('CmsBrandsAllApi', {
                keyword: ''
            }, function (res) {
                vm.brandsList = [{
                    rb_id: 0,
                    rb_title: '所有'
                }]
                if (res.code === 0) {
                    for (let index in res.data){
                        vm.brandsList.push({
                            rb_id: index,
                            rb_title: res.data[index]
                        });
                    }

                }
            });
        },
        created () {
        }
    }
</script>
