<style lang="less">
    @import '../../styles/common.less';
    @import '../components/styles/table.less';
</style>
<template>
    <div>
        <Row class="margin-top-10">
            <Col span="6">
            <Card>
                <p slot="title">
                    <Icon type="android-people"></Icon>
                    角色
                </p>
                <Row>
                    <Table :columns="roleColumn" :data="roleList" :highlight-row="true" @on-current-change="onRoleListCurrentChange"></Table>
                </Row>
            </Card>
            </Col>
            <Col span="8">
            <Card>
                <p slot="title">
                    <Icon type="android-menu"></Icon>
                    菜单树 [{{ roleMenuTitle }}]
                </p>
                <a href="#" @click="refreshMenuTree" slot="extra">
                    <Icon type="ios-loop-strong"></Icon>
                    刷新
                </a>
                <Row>
                    <Tree :data="roleMenuTree" @on-select-change="onMenuTreeSelectChange"></Tree>
                </Row>
            </Card>
            </Col>
            <Col span="10">
            <Card>
                <p slot="title">
                    <Icon type="android-menu"></Icon>
                    菜单明细 [{{ enuTitle }}]
                </p>
                <Poptip slot="extra" placement="bottom" confirm @on-ok="delMenu" title="您确认删除这个菜单项吗？" v-if="menuNode.menu_id > 0">
                    <Button type="error" size="small" shape="circle" class="margin-right-10">删除</Button>
                </Poptip>

                <a href="#" @click="cleanMenuNode" slot="extra">
                    <Icon type="android-add"></Icon>
                    新增
                </a>
                <a href="#" @click="refreshMenu" slot="extra">
                    <Icon type="ios-loop-strong"></Icon>
                    刷新
                </a>
                <Form :model="menuNode" :label-width="80" :rules="ruleValidate" ref="formMenu">
                    <FormItem label="上级菜单" prop="menu_parent">
                        <Select v-model="menuNode.menu_parent">
                            <Option v-for="item in parentMenuList" :value="item.name">{{ item.title }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="菜单标题" prop="menu_title">
                        <Input v-model="menuNode.menu_title" placeholder="请输入菜单标题"/>
                    </FormItem>
                    <FormItem label="菜单icon">
                        <Input v-model="menuNode.menu_icon" placeholder="请输入菜单icon"/>
                    </FormItem>
                    <FormItem label="菜单路径" prop="menu_href">
                        <Input v-model="menuNode.menu_href" placeholder="请输入菜单路径"/>
                    </FormItem>
                    <FormItem label="排序">
                        <InputNumber :max="99" :min="1" v-model="menuNode.menu_order"></InputNumber>
                    </FormItem>
                    <FormItem>
                        <Button type="primary" @click="btnSubmit">确定</Button>
                    </FormItem>
                </Form>
            </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
    import api from '../../api';
    export default {
        name: 'menu-view',
        components: {},
        data () {
            return {
                roleMenuTitle: '', // 标题
                enuTitle: '',
                currectRole: {},
                currectTreeRoot: {},
                roleColumn: [
                    {
                        title: '角色名',
                        key: 'role_name'
                    },
                    {
                        title: '角色标题',
                        key: 'role_title'
                    },
                ],
                roleList: [],
                roleListData: [],
                roleMenuTree: [], // 用与展示的菜单树
                parentMenuList: [], // 上级菜单的下拉列表
                menuNode: {
                    menu_id: 0,
                    menu_title: '',
                    menu_href: '',
                    menu_icon: '',
                    menu_parent: 0,
                    menu_order: 0
                },
                ruleValidate: {
                    menu_parent: [
                        {type: "number", min: 1, required: true, message: '请选择上级菜单', trigger: 'change'}
                    ],
                    menu_title: [
                        {required: true, message: '标题不能为空', trigger: 'blur'}
                    ],
                    menu_href: [
                        {required: true, message: '目录名不能为空', trigger: 'blur'}
                    ]
                }
            }
        },
        computed: {},
        methods: {
            /**
             * 刷新目录树
             */
            refreshMenuTree: function () {
                let vm = this;
                api.Post('MenuGetTreeApi', {role_id: this.currectRole.role_id}, function (res) {
                    if (res.code === 0) {
                        vm.parentMenuList = []; // 重置上级菜单的选项
                        vm.currectTreeRoot = res.root;
                        vm.parentMenuList.push(
                            {
                                name: vm.currectTreeRoot.menu_id,
                                title: vm.currectTreeRoot.menu_title,
                            }
                        );
                        vm.roleMenuTree = res.menuTree;

                        if (res.menuTree.length > 0) {
                            vm.menuNode.menu_id = res.menuTree[0].menu_id;
                            res.menuTree.forEach((item) => {
                                vm.parentMenuList.push(
                                    {
                                        name: item.menu_id,
                                        title: ' ' + item.menu_title,
                                    }
                                );
                            });
                        } else {
                            vm.menuNode.menu_id = 0;
                        }

                        vm.refreshMenu();

                    } else {
                        vm.$Notice.warning({
                            title: '错误',
                            desc: res.msg
                        });
                    }
                });
            },

            /**
             * 刷新目录详细
             */
            refreshMenu: function () {
                let vm = this;
                if (vm.menuNode.menu_id > 0) {
                    vm.enuTitle = '编辑 ' + vm.menuNode.menu_title;

                    api.Post('MenuGetItemApi', {menu_id: vm.menuNode.menu_id}, function (res) {
                        if (res.code === 0) {
                            vm.menuNode.menu_title = res.menu_title;
                            vm.menuNode.menu_href = res.menu_href;
                            vm.menuNode.menu_icon = res.menu_icon;
                            vm.menuNode.menu_parent = res.menu_parent;
                            vm.menuNode.menu_order = res.menu_order;
                        } else {
                            vm.$Notice.warning({
                                title: '错误',
                                desc: res.msg
                            });
                        }
                    });
                } else {
                    vm.cleanMenuNode();
                }
            },
            cleanMenuNode: function () {
                this.enuTitle = '新增';
                this.menuNode.menu_id = 0;
                this.menuNode.menu_title = '';
                this.menuNode.menu_href = '';
                this.menuNode.menu_icon = '';
                this.menuNode.menu_parent = 0;
                this.menuNode.menu_order = 0;
            },
            onRoleListCurrentChange: function (roleNode) { // 切换角色
                this.currectRole = roleNode;
                this.roleMenuTitle = roleNode.role_title;
                this.refreshMenuTree();
            },
            onMenuTreeSelectChange: function (menuNode) { // 选中菜单树
                if (menuNode.length > 0) {
                    this.menuNode.menu_id = menuNode[0].menu_id;
                    this.refreshMenu();
                }
            },
            btnSubmit: function () {
                let vm = this;
                this.$refs['formMenu'].validate((valid) => {
                    if (valid) {
                        api.Post('MenuFormItemApi', this.menuNode, function (res) {
                            if (res.code === 0) {
                                vm.refreshMenuTree();
                            } else {
                                vm.$Notice.warning({
                                    title: '错误',
                                    desc: res.msg
                                });
                            }
                        });
                    }
                })
            },
            delMenu: function () {
                let vm = this;
                this.$refs['formMenu'].validate((valid) => {
                    if (valid) {
                        api.Post('MenuDelItemApi', {menu_id: vm.menuNode.menu_id}, function (res) {
                            if (res.code === 0) {
                                vm.refreshMenuTree();
                            } else {
                                vm.$Notice.warning({
                                    title: '错误',
                                    desc: res.msg
                                });
                            }
                        });
                    }
                })
            }
        },
        mounted () {
            let vm = this;
            api.Post('RoleListApi', {pagesize: 9999999}, function (res) {
                if (res.code === 0) {
                    vm.roleList = res.data;
                    vm.onRoleListCurrentChange(res.data[0]);
                } else {
                    vm.$Notice.warning({
                        title: '错误',
                        desc: res.msg
                    });
                }
            })
        },
        created () {
        }
    }
</script>