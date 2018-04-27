<style lang="less">
    @import "./admin_home.less";
    @import "../../styles/common.less";
</style>
<template>
    <div class="home-main">
        <Row :gutter="10">
            <Col :md="24" :lg="8">
            <Row class-name="home-page-row1" :gutter="10">
                <Col :md="12" :lg="24" :style="{marginBottom: '10px'}">
                <Card>
                    <Row type="flex" class="user-infor">
                        <Col span="8">
                        <Row class-name="made-child-con-middle" type="flex" align="middle">
                            <img class="avator-img" :src="avatorPath"/>
                        </Row>
                        </Col>
                        <Col span="16" style="padding-left:6px;">
                        <Row class-name="made-child-con-middle" type="flex" align="middle">
                            <div>
                                <b class="card-user-infor-name">{{ loginUser ? loginUser.user_name : '' }}</b>
                            </div>
                        </Row>
                        </Col>
                    </Row>
                    <div class="line-gray"></div>
                    <Row class="margin-top-8">
                        <Col span="8">
                        <p class="notwrap">{{ loginUser ? loginUser.role.role_title : '' }}</p>
                        </Col>
                        <Col span="8">
                        <p class="notwrap">{{ loginUser ? loginUser.user_true_name : '' }}</p>
                        </Col>
                    </Row>
                </Card>
                </Col>
                <Col :md="12" :lg="24" :style="{marginBottom: '10px'}">
                <Card>
                    <p slot="title" class="card-title">
                        <Icon type="android-checkbox-outline"></Icon>
                        待办事项
                    </p>
                    <a type="text" slot="extra" @click.prevent="addNewToDoItem">
                        <Icon type="plus-round"></Icon>
                    </a>
                    <Modal
                            v-model="showAddNewTodo"
                            title="添加新的待办事项"
                            @on-ok="addNew"
                            @on-cancel="cancelAdd">
                        <Row type="flex" justify="center">
                            <Input v-model="newToDoItemValue" icon="compose" placeholder="请输入..." style="width: 300px"/>
                        </Row>
                        <Row slot="footer">
                            <Button type="text" @click="cancelAdd">取消</Button>
                            <Button type="primary" @click="addNew">确定</Button>
                        </Row>
                    </Modal>
                    <div class="to-do-list-con">
                        <div v-for="(item, index) in toDoList" :key="'todo-item' + (toDoList.length - index)" class="to-do-item">
                            <to-do-list-item :content="item.title"></to-do-list-item>
                        </div>
                    </div>
                </Card>
                </Col>
            </Row>
            </Col>
            <Col :md="24" :lg="16">
            <Row :gutter="5">
                <Col :xs="24" :sm="12" :md="12" :style="{marginBottom: '10px'}" @click.native="redirect('article_list')">
                <infor-card
                        id-name="user_created_count"
                        :end-val="count.article"
                        iconType="social-buffer"
                        color="#2d8cf0"
                        intro-text="发布文章数"
                ></infor-card>
                </Col>
                <Col :xs="24" :sm="12" :md="12" :style="{marginBottom: '10px'}" @click.native="redirect('article_edit')">
                <infor-card
                        id-name="visit_count"
                        :end-val="count.draft"
                        iconType="edit"
                        color="#64d572"
                        :iconSize="50"
                        intro-text="草稿数"
                ></infor-card>
                </Col>
            </Row>
            <Table border :columns="draftColumns" :data="draftList"></Table>
            </Col>
        </Row>
    </div>
</template>

<script>
    import countUp from '../components/countUp.vue';
    import toDoListItem from '../components/toDoListItem.vue';
    import inforCard from '../components/inforCard.vue';
    import util from '@/libs/util.js';
    import api from '../../api';

    export default {
        name: 'manager_home',
        components: {
            countUp,
            toDoListItem,
            inforCard
        },
        data () {
            return {
                toDoList: [
                ],
                count: {
                    article: 0,
                    draft: 0,
                },
                showAddNewTodo: false,
                newToDoItemValue: '',
                draftColumns:[
                    {
                        title: '文章ID',
                        key: 'a_id',
                        width: 80

                    },
                    {
                        title: '文章标题',
                        key: 'a_title',
                        type: 'html'
                    },
                    {
                        title: '草稿时间',
                        key: 'a_etime'
                    },
                    {
                        title: '是否已发布',
                        key: 'publish',
                        width: 80

                    },
                    {
                        title: '发布时间',
                        key: 'a_ptime'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        fixed: 'right',
                        width: 120,
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
                                            let argu = {a_id: params.row.a_id};
                                            this.$router.push({
                                                name: 'cms_article_publish',
                                                params: argu
                                            });
                                        }
                                    }
                                }, '编辑'),
                                h('Poptip', {
                                    props: {
                                        confirm: true,
                                        title: '您确定要删除这条数据吗?',
                                        transfer: true
                                    },
                                    on: {
                                        'on-ok': () => {
                                            this.handleDelete(params.row);
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
                                ])
                            ]);
                        }
                    }
                ],
                draftList: []
            };
        },
        computed: {
            avatorPath () {
                return localStorage.avatorImgPath;
            },
            loginUser () {
                let loginUser;
                if (util.isset(localStorage.loginUser)) {
                    loginUser = JSON.parse(localStorage.loginUser);
                }
                return loginUser;
            }
        },
        methods: {
            addNewToDoItem () {
                this.showAddNewTodo = true;
            },
            addNew () {
                if (this.newToDoItemValue.length !== 0) {
                    this.toDoList.unshift({
                        title: this.newToDoItemValue
                    });
                    setTimeout(() => {
                        this.newToDoItemValue = '';
                    }, 200);
                    this.showAddNewTodo = false;
                } else {
                    this.$Message.error('请输入待办事项内容');
                }
            },
            cancelAdd () {
                this.showAddNewTodo = false;
                this.newToDoItemValue = '';
            },
            redirect (key) {
                if(key === 'article_list') {
                    this.$router.push({
                        name: 'cms_article_list'
                    });
                } else if(key === 'article_edit') {
                    this.$router.push({
                        name: 'cms_article_publish'
                    });
                }
            },
            handleDelete(val) {
                let vm = this;
                vm.$Message.info('提交中...');

                api.Post('CmsArticleDelDraftApi', {
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
            refresh () {
                let vm = this;
                api.Post('CmsEditorInfoApi', {

                }, function(ret){
                    if(ret) {
                        vm.count.article = ret.article;
                        vm.count.draft = ret.draft ? ret.draft.length : 0;
                        vm.draftList = ret.draft
                    } else {
                        vm.$Notice.warning({
                            title: '错误',
                            desc: res.msg
                        });
                    }
                });
            }
        },
        mounted () {
            this.refresh();
        }
    };
</script>
