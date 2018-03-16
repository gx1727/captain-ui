<style lang="less">
    @import "./manager_home.less";
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
                                <b class="card-user-infor-name">Admin</b>
                            </div>
                        </Row>
                        </Col>
                    </Row>
                    <div class="line-gray"></div>
                    <Row class="margin-top-8">
                        <Col span="8">
                        <p class="notwrap">{{ loginUser ? loginUser.role.role_title : '' }}</p>
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
                <Col :xs="24" :sm="12" :md="12" :style="{marginBottom: '10px'}">
                <infor-card
                        id-name="user_created_count"
                        :end-val="count.createUser"
                        iconType="social-buffer"
                        color="#2d8cf0"
                        intro-text="发布文章数"
                ></infor-card>
                </Col>
                <Col :xs="24" :sm="12" :md="12" :style="{marginBottom: '10px'}">
                <infor-card
                        id-name="visit_count"
                        :end-val="count.visit"
                        iconType="edit"
                        color="#64d572"
                        :iconSize="50"
                        intro-text="草稿数"
                ></infor-card>
                </Col>
            </Row>
            </Col>
        </Row>
    </div>
</template>

<script>
    import countUp from '../components/countUp.vue';
    import toDoListItem from '../components/toDoListItem.vue';
    import inforCard from '../components/inforCard.vue';
    import util from '@/libs/util.js';


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
                    {
                        title: '去iView官网学习完整的iView组件'
                    },
                    {
                        title: '去iView官网学习完整的iView组件'
                    },
                    {
                        title: '去iView官网学习完整的iView组件'
                    },
                    {
                        title: '去iView官网学习完整的iView组件'
                    },
                    {
                        title: '去iView官网学习完整的iView组件'
                    }
                ],
                count: {
                    createUser: 496,
                    visit: 3264,
                    collection: 24389305,
                    transfer: 39503498
                },
                showAddNewTodo: false,
                newToDoItemValue: ''
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
            }
        }
    };
</script>
