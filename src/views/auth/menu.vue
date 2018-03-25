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
                    菜单树
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
                    菜单明细
                </p>
                <a href="#" @click="refreshMenu" slot="extra">
                    <Icon type="ios-loop-strong"></Icon>
                    刷新
                </a>
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
                currectRole: 0,
                currectMenu: 0,
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
                roleMenuTree: [
                    {
                        title: 'parent 1',
                        expand: true,
                        children: [
                            {
                                title: 'parent 1-1',
                                expand: true,
                                children: [
                                    {
                                        title: 'leaf 1-1-1'
                                    },
                                    {
                                        title: 'leaf 1-1-2'
                                    }
                                ]
                            },
                            {
                                title: 'parent 1-2',
                                expand: true,
                                children: [
                                    {
                                        title: 'leaf 1-2-1'
                                    },
                                    {
                                        title: 'leaf 1-2-1'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        },
        methods: {
            refreshMenuTree: function () {
                api.Post('MenuGetByRoleApi', {role_id: this.currectRole}, function (res) {
                    if (res.code === 0) {
                        console.log(res);
                    } else {
                        vm.$Notice.warning({
                            title: '错误',
                            desc: res.msg
                        });
                    }
                });
            },
            refreshMenu: function () {

            },
            onRoleListCurrentChange: function (roleNode) { // 切换角色
                this.currectRole = roleNode.role_id;
                this.refreshMenuTree();
            },
            onMenuTreeSelectChange: function (menuNode) { // 选中菜单树
                console.log(menuNode);
            },

            /**
             * 获到角色对应的菜单
             * @param role_id
             */
            getMenuTree: function () {

            }
        },
        mounted () {
            let vm = this;
            api.Post('RoleListApi', {pagesize: 9999999}, function (res) {
                if (res.code === 0) {
                    vm.roleList = res.data;
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