<style lang="less">
    @import './login.less';
</style>

<template>
    <div class="login" @keydown.enter="handleSubmit">
        <div class="login-con">
            <Card :bordered="false">
                <p slot="title">
                    <Icon type="log-in"></Icon>
                    欢迎登录
                </p>
                <div class="form-con">
                    <Form ref="loginForm" :model="form" :rules="rules">
                        <FormItem prop="userName">
                            <Input v-model="form.userName" placeholder="请输入用户名">
                            <span slot="prepend">
                                    <Icon :size="16" type="person"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem prop="password">
                            <Input type="password" v-model="form.password" placeholder="请输入密码">
                            <span slot="prepend">
                                    <Icon :size="14" type="locked"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem>
                            <Button @click="handleSubmit" type="primary" long>登录</Button>
                        </FormItem>
                    </Form>
                    <p class="login-tip">输入 用户名 和 密码 </p>
                </div>
            </Card>
        </div>
    </div>
</template>

<script>
    import Cookies from 'js-cookie';
    import util from '@/libs/util.js';
    import api from '../api';

    export default {
        data () {
            return {
                form: {
                    userName: 'admin',
                    password: '111111'
                },
                rules: {
                    userName: [
                        {required: true, message: '账号不能为空', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '密码不能为空', trigger: 'blur'}
                    ]
                }
            };
        },
        methods: {
            handleSubmit () {
                let vm = this;
                this.$refs.loginForm.validate((valid) => {
                    if (valid) {
                        vm.$Message.loading({
                            content: 'Loading...',
                            duration: 0
                        });
                        api.Login({
                            'username': this.form.userName,
                            'pwd': util.secret(this.form.password)
                        }).then(function (response) {
                            vm.$Message.destroy();
                            if (response.status === 200) {
                                let res = response.data;
                                if (typeof response.data === 'string') {
                                    res = JSON.parse(response.data);
                                }
                                if (res.code === 0) {
                                    localStorage.loginUser = JSON.stringify(res); // 放在localStorage中
                                    Cookies.set('user', vm.form.userName);
                                    Cookies.set('user_code', res.user_code);
                                    Cookies.set('role', res.role.role_name);
                                    Cookies.set('homeurl', res.role.role_homeurl);
                                    vm.$store.commit('setAvator', res.user_photo);
                                    api.Post('MenuGetTreeApi', {role_id: res.role.role_id}, function (res) {
                                        if (res.code === 0) {
                                            localStorage.menuTreeData = JSON.stringify(res.menuTree);
                                            vm.$store.commit('updateMenulist');
                                        } else {
                                            localStorage.menuTreeData = false;
                                            vm.$Notice.warning({
                                                title: '获到菜单数据失败',
                                                desc: res.msg
                                            });
                                        }
                                    });
                                    vm.$router.push({
                                        name: res.role.role_homeurl
                                    });
                                } else {
                                    vm.$Notice.warning({
                                        title: '登录失败',
                                        desc: res.msg
                                    });
                                }
                            }
                        }).catch(function (e) {
                            vm.$Message.destroy();
                            vm.$Notice.error({
                                title: '网络错误，服务请求失败',
                                desc: e.message
                            });
                        });
                    }
                });
            }
        }
    };
</script>

<style>

</style>
