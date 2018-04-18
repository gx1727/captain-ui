<style lang="less">
    @import './styles/common-table.less';
</style>

<template>
    <div>
        <Table stripe border ref="commontable" :columns="columnsList" :data="thisTableData" :loading="loading"
               @on-sort-change="onSortChange" :highlight-row="true" @on-current-change="onCurrentChange"
               @on-selection-change="onSelectionChange"></Table>
        <div class="margin-top-10" style="text-align: right;">
            <Page v-if="total > pageSizeOpts[0]" :total="total" :page-size="pagesize" :current="page" :page-size-opts="pageSizeOpts"
                  :show-total="true" placement="top" :transfer="true"
                  size="small" :show-elevator="(total / pagesize) > 1" :show-sizer="total > 10"
                  @on-change="onPageChange" @on-page-size-change="onPageSizeChange"></Page>
        </div>

    </div>
</template>

<script>
    import api from '../../api';
    export default {
        name: 'commonTable',
        props: {
            remoteApi: String,
            columnsList: Array,
            onCurrentChange: {
                type: Function,
                default: function () {
                }
            },
            onSelectionChange: {
                type: Function,
                default: function () {
                }
            },
            onRemoteData: {
                type: Function,
                default: function (data) {
                    return data;
                }
            },
            editIncell: { // 是否可以单元格修改
                type: Boolean,
                default: false
            },
            hoverShow: { // 鼠标hover事件，显示修改按钮
                type: Boolean,
                default: false
            },
            searchParam: Object // api额外参数
        },
        data () {
            return {
                page: 1,
                pagesize: 10,
                orderby: '',
                ordertype: 'desc',
                total: 0,
                loading: false, // 列表加载 loading
                remoteData: [], // 原始数据
                columns: [],
                thisTableData: [],
                edittingStore: [],
                pageSizeOpts: [10, 20, 50, 100]
            };
        },
        created () {
            this.remote();

            /**
             * 定义 refresh事件处理函数
             */
            this.$on('refresh', function () {
                this.remote();
            });
        },
        methods: {
            init () {
                let vm = this;
                let editableCell = this.columnsList.filter(item => {
                    if (item.editable) {
                        if (item.editable === true) {
                            return item;
                        }
                    }
                });

                let res = [];
                res = this.remoteData.map((item, index) => {
                    let isEditting = false;
                    if (this.thisTableData[index]) {
                        if (this.thisTableData[index].editting) {
                            isEditting = true;
                        } else {
                            for (const cell in this.thisTableData[index].edittingCell) {
                                if (this.thisTableData[index].edittingCell[cell] === true) {
                                    isEditting = true;
                                }
                            }
                        }
                    }

                    if (isEditting) {
                        return this.thisTableData[index];
                    } else {
                        this.$set(item, 'editting', false);
                        let edittingCell = {};
                        editableCell.forEach(item => {
                            edittingCell[item.key] = false;
                        });
                        this.$set(item, 'edittingCell', edittingCell);
                        return item;
                    }
                });
                this.thisTableData = res;
                this.edittingStore = JSON.parse(JSON.stringify(this.thisTableData));
                this.columnsList.forEach(item => {
                    if (item.editable) {
                        item.render = (h, param) => {
                            let currentRow = this.thisTableData[param.index];
                            if (!currentRow.editting) {
                                if (this.editIncell) {
                                    return h('Row', {
                                        props: {
                                            type: 'flex',
                                            align: 'middle',
                                            justify: 'center'
                                        }
                                    }, [
                                        h('Col', {
                                            props: {
                                                span: '22'
                                            }
                                        }, [
                                            !currentRow.edittingCell[param.column.key] ? h('span', currentRow[item.key]) : cellInput(this, h, param, item)
                                        ]),
                                        h('Col', {
                                            props: {
                                                span: '2'
                                            }
                                        }, [
                                            currentRow.edittingCell[param.column.key] ? saveIncellEditBtn(this, h, param) : inCellEditBtn(this, h, param)
                                        ])
                                    ]);
                                } else {
                                    return h('span', currentRow[item.key]);
                                }
                            } else {
                                return h('Input', {
                                    props: {
                                        type: 'text',
                                        value: currentRow[item.key]
                                    },
                                    on: {
                                        'on-change' (event) {
                                            let key = param.column.key;
                                            vm.edittingStore[param.index][key] = event.target.value;
                                        }
                                    }
                                });
                            }
                        };
                    }
                    if (item.handle) {
                        item.render = (h, param) => {
                            let currentRowData = this.thisTableData[param.index];
                            let children = [];
                            item.handle.forEach(itemNode => {
                                if (itemNode === 'edit') {
                                    children.push(editButton(this, h, currentRowData, param.index));
                                } else if (itemNode === 'delete') {
                                    children.push(deleteButton(this, h, currentRowData, param.index));
                                } else {
                                    // 其它按钮
                                    children.push(
                                        h('Button', {
                                            props: {
                                                type: itemNode.type ? itemNode.type : 'text',
                                                size: 'small'
                                            },
                                            style: {
                                                margin: '0 5px'
                                            },
                                            on: {
                                                'click': (() => {
                                                    if (itemNode.fun) {
                                                        itemNode.fun(currentRowData);
                                                    }
                                                })
                                            }
                                        }, itemNode.title)
                                    );
                                }
                            });
                            return h('div', children);
                        };
                    }
                });
            },
            handleBackdata (data) {
                let clonedData = JSON.parse(JSON.stringify(data));
                delete clonedData.editting;
                delete clonedData.edittingCell;
                delete clonedData.saving;
//                clonedData.forEach(item => {
//                    delete item.editting;
//                    delete item.edittingCell;
//                    delete item.saving;
//                });
                return clonedData;
            },
            /**
             * 处理排序事件
             * @param sort
             */
            onSortChange (sort) {
                this.orderby = sort.key;
                this.ordertype = sort.order === 'asc' ? 'asc' : (sort.order === 'desc' ? 'desc' : '');
                this.$emit('refresh');
            },
            onPageChange (page) {
                this.page = page;
                this.$emit('refresh');
            },
            onPageSizeChange (pageSize) {
                this.pagesize = pageSize;
                this.$emit('refresh');
            },
            /**
             * 获取服务器数据
             */
            remote () {
                let vm = this;
                vm.loading = true;
                api.Post(vm.remoteApi, vm.getParam(), function (response) {
                    if (response.code === 0) {
                        let remoteData = vm.onRemoteData(response); // 前端作最后的处理
                        vm.remoteData = remoteData.data;
                        vm.total = response.total;
                        vm.init();
                    } else {
                        vm.$Notice.warning({
                            title: '警告',
                            desc: response.msg
                        });
                    }
                    vm.loading = false;
                }, function (e, statusText) {
                    vm.loading = false;
                    vm.$Notice.error({
                        title: '网络错误，服务请求失败',
                        desc: typeof e == 'object' ? e.message : (e + '[' + statusText + ']')
                    });
                })
                vm.init();
            },
            /**
             * 获到附加参数
             * @returns {({}&{page: *, pagesize: *, orderby: *, ordertype: *}&(ObjectConstructor|Object|*|searchParam|{name}))|({}&{page: *, pagesize: *, orderby: *, ordertype: *})|({}&{page: *, pagesize: *, orderby: *, ordertype: *}&(ObjectConstructor|Object|*|searchParam|{name})&W)|any}
             */
            getParam () {
                return Object.assign({}, {
                    page: this.page,
                    pagesize: this.pagesize,
                    orderby: this.orderby,
                    ordertype: this.ordertype
                }, this.searchParam);
            },
            cacheParam () {

            }
        },
        mounted () {
            console.log('here');
        },
        watch: {
//            value (data) {
//                this.init();
//            }
        }
    };

    /**
     * 编辑按钮
     */
    const editButton = (vm, h, currentRow, index) => {
        return h('Button', {
            props: {
                type: currentRow.editting ? 'success' : 'primary',
                loading: currentRow.saving,
                size: 'small'
            },
            style: {
                margin: '0 5px'
            },
            on: {
                'click': () => {
                    if (!currentRow.editting) {
                        if (currentRow.edittingCell) {
                            for (let name in currentRow.edittingCell) {
                                currentRow.edittingCell[name] = false;
                                vm.edittingStore[index].edittingCell[name] = false;
                            }
                        }
                        vm.edittingStore[index].editting = true;
                        vm.thisTableData = JSON.parse(JSON.stringify(vm.edittingStore));
                    } else {
                        vm.edittingStore[index].saving = true;
                        vm.thisTableData = JSON.parse(JSON.stringify(vm.edittingStore));
                        let edittingRow = vm.edittingStore[index];
                        edittingRow.editting = false;
                        edittingRow.saving = false;
                        vm.thisTableData = JSON.parse(JSON.stringify(vm.edittingStore));
                        // vm.$emit('input', vm.handleBackdata(vm.thisTableData));
                        vm.$emit('on-change', vm.handleBackdata(vm.thisTableData[index]), index);
                    }
                }
            }
        }, currentRow.editting ? '保存' : '编辑');
    };

    /**
     * 删除按钮
     * @param vm
     * @param h
     * @param currentRow
     * @param index
     * @returns {*}
     */
    const deleteButton = (vm, h, currentRow, index) => {
        return h('Poptip', {
            props: {
                confirm: true,
                title: '您确定要删除这条数据吗?',
                transfer: true
            },
            on: {
                'on-ok': () => {
                    vm.$emit('on-delete', vm.handleBackdata(vm.thisTableData[index]), index);
                }
            }
        }, [
            h('Button', {
                style: {
                    margin: '0 5px'
                },
                props: {
                    type: 'error',
                    placement: 'top',
                    size: 'small'
                }
            }, '删除')
        ]);
    };

    /**
     * 单元格edit按钮
     * @param vm
     * @param h
     * @param param
     * @returns {*}
     */
    const inCellEditBtn = (vm, h, param) => {
        if (vm.hoverShow) { // 鼠标hover事件，显示修改按钮
            return h('div', {
                'class': {
                    'show-edit-btn': vm.hoverShow
                }
            }, [
                h('Button', {
                    props: {
                        type: 'text',
                        icon: 'edit'
                    },
                    on: {
                        click: (event) => {
                            vm.edittingStore[param.index].edittingCell[param.column.key] = true;
                            vm.thisTableData = JSON.parse(JSON.stringify(vm.edittingStore));
                        }
                    }
                })
            ]);
        } else {
            return h('Button', {
                props: {
                    type: 'text',
                    icon: 'edit'
                },
                on: {
                    click: (event) => {
                        vm.edittingStore[param.index].edittingCell[param.column.key] = true;
                        vm.thisTableData = JSON.parse(JSON.stringify(vm.edittingStore));
                    }
                }
            });
        }
    };

    /**
     * 单元格保存按钮
     * @param vm
     * @param h
     * @param param
     * @returns {*}
     */
    const saveIncellEditBtn = (vm, h, param) => {
        return h('Button', {
            props: {
                type: 'text',
                icon: 'checkmark'
            },
            on: {
                click: (event) => {
                    vm.edittingStore[param.index].edittingCell[param.column.key] = false;
                    vm.thisTableData = JSON.parse(JSON.stringify(vm.edittingStore));
                    // vm.$emit('input', vm.handleBackdata(vm.thisTableData));
                    vm.$emit('on-cell-change', vm.handleBackdata(vm.thisTableData[param.index]), param.index, param.column.key);
                }
            }
        });
    };

    /**
     * 单元格 文本框编辑器
     * @param vm
     * @param h
     * @param param
     * @param item
     * @returns {*}
     */
    const cellInput = (vm, h, param, item) => {
        return h('Input', {
            props: {
                type: 'text',
                value: vm.edittingStore[param.index][item.key]
            },
            on: {
                'on-change' (event) {
                    let key = item.key;
                    vm.edittingStore[param.index][key] = event.target.value;
                }
            }
        });
    };
</script>
