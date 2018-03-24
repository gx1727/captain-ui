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
                    <Input v-model="searchParam.name" placeholder="请输入姓名搜搜..." style="width: 200px"/>
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
                            @on-delete="handleDelete"
                            :on-current-change="handCurrentChange"
                            :on-selection-change="handSelectionChange"
                            :on-remote-data="handRemoteData"
                            :hover-show="true"
                            :edit-incell="true"
                            :columns-list="tableColumn"
                            :search-param="searchParam"
                    ></common-table>
                    <div class="margin-top-10">
                        <Button @click="handleSelectAll(true)">修改列</Button>
                    </div>
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
                    name: ''
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
                        title: '姓名',
                        align: 'center',
                        key: 'name',
                        width: 200,
                        editable: true,
                        sortable: 'name',
                        filters: [
                            {
                                label: 'Greater than 25',
                                value: 1
                            },
                            {
                                label: 'Less than 25',
                                value: 2
                            }
                        ],
                        filterMultiple: false,
                        filterRemote (values, key) {
                            console.log(values);
                            console.log(key);
                        }
                    },
                    {
                        title: '性别',
                        align: 'left',
                        key: 'sex',
                        sortable: 'sex',
                        type: 'html'
                    },
                    {
                        title: '岗位',
                        align: 'center',
                        width: 200,
                        key: 'work',
                        editable: true
                    },
                    {
                        title: '操作',
                        align: 'center',
                        width: 200,
                        key: 'handle',
                        handle: [
                            'edit',
                            'delete',
                            {
                                title: '测试',
                                fun: this.testButton
                            }
                        ]
                    }
                ]
            };
        },
        methods: {
            testButton (row) {
                console.log(row);
            },
            handleSelectAll () {
                let vm = this;
                this.tableColumn[2].title = 'hello';
                this.tableColumn[3].filters = [
                    {
                        label: '男',
                        value: '男'
                    },
                    {
                        label: '女',
                        value: '女'
                    }];
                this.tableColumn[3].filterRemote = function (values, key) {
                    if (values.length <= 0) {
                        delete vm.searchParam[key];
                    } else {
                        vm.searchParam[key] = JSON.stringify(values);
                    }
                    vm.refresh();
                }
            },

            refresh () { // 刷新列表
                this.$refs.table.$emit('refresh'); // 解发列表刷新事件
            },
            /**
             * 处理排序
             * @param sort
             */
            handleSortChange(sort) {
                console.log(sort);
                console.log(sort.key);
                console.log(sort.order);
            },
            getData () {
            },
            handleNetConnect (state) {
                this.breakConnect = state;
            },
            handleLowSpeed (state) {
                this.lowNetSpeed = state;
            },
            handleCellChange (val, index, key) {
                console.log(val);
                this.$Message.success('修改了第 ' + (index + 1) + ' 行列名为 ' + key + ' 的数据');
            },
            handleChange (val, index) {
                console.log(val);
                this.$Message.success('修改了第' + (index + 1) + '行数据');
            },
            handleDelete(val, index) {
                console.log('on-delete');
                console.log(val[index]);
            },
            /**
             * 处理单选
             * @param row 当前行
             * @param oldRow 上一行
             */
            handCurrentChange (row, oldRow) {
//                console.log(oldRow);
//                console.log(row);
            },
            /**
             * 处理多选
             * @param selection 选中的数组
             */
            handSelectionChange (selection) {
//                console.log(selection);
            },
            handRemoteData (data) {
                return data;
            },
            handleCancelSearch () {
                this.searchParam.name = '';
                this.refresh();
            }
        },
        created () {
//            this.getData();
        }
    };
</script>
