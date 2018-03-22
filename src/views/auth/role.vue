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
                <a href="#" slot="extra">
                    <Icon type="ios-loop-strong"></Icon>
                    Change
                </a>
                <Row>
                    <Input v-model="searchConName3" placeholder="请输入姓名搜搜..." style="width: 200px" />
                    <span @click="handleSearch3" style="margin: 0 10px;"><Button type="primary" icon="search">搜索</Button></span>
                    <Button @click="handleCancel3" type="ghost" >取消</Button>
                </Row>
                <Row :gutter="10" class="margin-top-10">
                    <Col span="24">
                        <common-table
                                refs="table"
                                v-model="editInlineAndCellData"
                                @on-cell-change="handleCellChange"
                                @on-change="handleChange"
                                :hover-show="true"
                                :editIncell="true"
                                :columns-list="editInlineAndCellColumn"
                        ></common-table>
                        <div class="margin-top-10">
                            <Button @click="handleSelectAll(true)">全选</Button>
                            <Button @click="handleSelectAll(false)">清空</Button>
                        </div>
                        <Table stripe border :loading="loading" ref="selection" height="200" :columns="columns" :data="data" @on-sort-change="onSortChange"></Table>

                    </Col>
                </Row>
            </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
    import commonTable from '../components/commonTable.vue';
    import tableData from './components/table_data.js';
    export default {
        name: 'editable-table',
        components: {
            commonTable
        },
        data () {
            return {
                loading: false,
                searchConName3: '',
                editInlineAndCellData: [
                    {
                        name: 'Aresn',
                        sex: '男',
                        work: '前端开发'
                    },
                    {
                        name: 'Lison',
                        sex: '男',
                        work: '前端开发'
                    },
                    {
                        name: 'lisa',
                        sex: '女',
                        work: '程序员鼓励师'
                    }
                ],
                editInlineAndCellColumn: [
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
                        width: 300,
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
                        filterMethod (value, row) {
                            if (value === 1) {
                                return row.age > 25;
                            } else if (value === 2) {
                                return row.age < 25;
                            }
                        }
                    },
                    {
                        title: '性别',
                        align: 'center',
                        key: 'sex'
                    },
                    {
                        title: '岗位',
                        align: 'center',
                        width: 300,
                        key: 'work',
                        editable: true
                    },
                    {
                        title: '操作',
                        align: 'center',
                        width: 200,
                        key: 'handle',
                        handle: ['edit', 'delete']
                    }
                ],
                columns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: 'Name',
                        key: 'name',
                        sortable: 'name'
                    },
                    {
                        title: 'Age',
                        key: 'age',
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
                        filterMethod (value, row) {
                            if (value === 1) {
                                return row.age > 25;
                            } else if (value === 2) {
                                return row.age < 25;
                            }
                        }
                    },
                    {
                        title: 'Address',
                        key: 'address',
                        filters: [
                            {
                                label: 'New York',
                                value: 'New York'
                            },
                            {
                                label: 'London',
                                value: 'London'
                            },
                            {
                                label: 'Sydney',
                                value: 'Sydney'
                            }
                        ],
                        filterMethod (value, row) {
                            return row.address.indexOf(value) > -1;
                        }
                    },
                    {
                        title: 'Action',
                        key: 'action',
                        width: 150,
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                           console.log(params);
                                        }
                                    }
                                }, '编辑'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            console.log(params.index);
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    }
                ],
                data: [
                    {
                        name: 'John Brown',
                        age: 18,
                        address: 'New York No. 1 Lake Park',
                        date: '2016-10-03'
                    },
                    {
                        name: 'Jim Green',
                        age: 24,
                        address: 'London No. 1 Lake Park',
                        date: '2016-10-01'
                    },
                    {
                        name: 'Joe Black',
                        age: 30,
                        address: 'Sydney No. 1 Lake Park',
                        date: '2016-10-02'
                    },
                    {
                        name: 'Jon Snow',
                        age: 26,
                        address: 'Ottawa No. 2 Lake Park',
                        date: '2016-10-04'
                    }
                ]
            };
        },
        methods: {
            handleSelectAll (status) {
                this.$refs.selection.selectAll(status);
                this.editInlineAndCellData.push({
                    name: 'Aresn',
                    sex: '男',
                    work: '前端开发'
                });

                this.data.push(
                    {
                        name: 'John Brown',
                        age: 18,
                        address: 'New York No. 1 Lake Park',
                        date: '2016-10-03'
                    }
                );
            },
            onSortChange(sort) {
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
            handleSearch3 () {
            },
            handleCancel3 () {
            }
        },
        created () {
            this.getData();
        }
    };
</script>
