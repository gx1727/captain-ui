<style lang="less">
    @import './styles/common-table.less';
</style>

<template>
    <div>
        <Table stripe border ref="commontable" :columns="columnsList" :data="thisTableData" :loading="loading" @on-sort-change="onSortChange"></Table>
    </div>
</template>

<script>
    import api from '../../api';
    export default {
        name: 'commonTable',
        props: {
            columnsList: Array,
            url: String,
            editIncell: {
                type: Boolean,
                default: false
            },
            hoverShow: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                page: 1,
                pagesize: 10,
                orderby: '',
                ordertype: 'desc',
                param: {}, // api额外参数
                loading: false, // 列表加载 loading
                remoteData: [], // 原始数据
                columns: [],
                thisTableData: [],
                edittingStore: []
            };
        },
        created () {
            this.remote();

            this.$on('refresh', function () {
                this.remote();
            })
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
                            item.handle.forEach(item => {
                                if (item === 'edit') {
                                    children.push(editButton(this, h, currentRowData, param.index));
                                } else if (item === 'delete') {
                                    children.push(deleteButton(this, h, currentRowData, param.index));
                                }
                            });
                            return h('div', children);
                        };
                    }
                });
            },
            handleBackdata (data) {
                let clonedData = JSON.parse(JSON.stringify(data));
                clonedData.forEach(item => {
                    delete item.editting;
                    delete item.edittingCell;
                    delete item.saving;
                });
                return clonedData;
            },
            onSortChange (sort) {
                console.log(sort);
                console.log(sort.key);
                console.log(sort.order);
            },
            remote () { // 获取服务器数据
                let _this = this;
                _this.loading = true;
                api.RoleList(_this.getParam(), function (response) {
                    if (response.code === 0) {
                        _this.remoteData = response.data;
                        _this.init();
                    } else {
                        _this.$Notice.warning({
                            title: '警告',
                            desc: response.msg,
                        });
                    }
                    console.log(response);
                    _this.loading = false;
                }, function (e, statusText) {
                    _this.loading = false;
                    _this.$Notice.error({
                        title: '网络错误，服务请求失败',
                        desc: typeof e == 'object' ? e.message : (e + '[' + statusText + ']')
                    });
                })
            },
            getParam() {
                return Object.assign({}, {
                    page: this.page,
                    pagesize: this.pagesize,
                    orderby: this.orderby,
                    ordertype: this.ordertype
                }, this.param);
            }
        },
        watch: {
//            value (data) {
//                this.init();
//            }
        }
    };

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
                        vm.$emit('input', vm.handleBackdata(vm.thisTableData));
                        vm.$emit('on-change', vm.handleBackdata(vm.thisTableData), index);
                    }
                }
            }
        }, currentRow.editting ? '保存' : '编辑');
    };
    const deleteButton = (vm, h, currentRow, index) => {
        return h('Poptip', {
            props: {
                confirm: true,
                title: '您确定要删除这条数据吗?',
                transfer: true
            },
            on: {
                'on-ok': () => {
                    vm.thisTableData.splice(index, 1);
                    vm.$emit('input', vm.handleBackdata(vm.thisTableData));
                    vm.$emit('on-delete', vm.handleBackdata(vm.thisTableData), index);
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
    const inCellEditBtn = (vm, h, param) => {
        if (vm.hoverShow) {
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
                    vm.$emit('input', vm.handleBackdata(vm.thisTableData));
                    vm.$emit('on-cell-change', vm.handleBackdata(vm.thisTableData), param.index, param.column.key);
                }
            }
        });
    };
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
