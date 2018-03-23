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
                    <Input v-model="searchConName3" placeholder="请输入姓名搜搜..." style="width: 200px"/>
                    <span @click="handleSearch3" style="margin: 0 10px;"><Button type="primary" icon="search">搜索</Button></span>
                    <Button @click="handleCancel3" type="ghost">取消</Button>
                </Row>
                <Row :gutter="10" class="margin-top-10">
                    <Col span="24">
                    <common-table
                            ref="table"
                            @on-cell-change="handleCellChange"
                            @on-change="handleChange"
                            @on-sort-change="handleChange"
                            :hover-show="true"
                            :editIncell="true"
                            :columns-list="editInlineAndCellColumn"
                    ></common-table>
                    <div class="margin-top-10">
                        <Button @click="handleSelectAll(true)">全选</Button>
                        <Button @click="handleSelectAll(false)">清空</Button>
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
    import tableData from './components/table_data.js';
    import api from '../../api';
    export default {
        name: 'editable-table',
        components: {
            commonTable
        },
        data () {
            return {
                searchConName3: '',
                roleList: [],
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
                        width: 200,
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
                ]
            };
        },
        methods: {
            handleSelectAll (status) {
                this.roleList.push({
                    name: 'Aresn',
                    sex: '男',
                    work: '前端开发'
                });
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
            handleSearch3 () {
            },
            handleCancel3 () {
            }
        },
        created () {
//            this.getData();
        }
    };
</script>
