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
                    <p class="login-tip">输入任意用户名和密码即可</p>
                </div>
            </Card>
        </div>
    </div>
</template>

<script>
    import Cookies from 'js-cookie';
    import util from '@/libs/util.js';
    import api from '../api'

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
                let _this = this;
                this.$refs.loginForm.validate((valid) => {
                    if (valid) {
                        _this.$Message.loading({
                            content: 'Loading...',
                            duration: 0
                        });
                        api.Login({
                            'username': this.form.userName,
                            'pwd': util.secret(this.form.password)
                        }).then(function (response) {
                            _this.$Message.destroy();
                            if (response.status === 200) {
                                let res = response.data;
                                if (typeof response.data === 'string') {
                                    res = JSON.parse(response.data);
                                }
                                if (res.code === 0) {
                                    localStorage.loginUser = JSON.stringify(res); // 放在localStorage中
                                    Cookies.set('user', _this.form.userName);
                                    Cookies.set('user_code', res.user_code);
                                    _this.$store.commit('setAvator', res.user_photo);
                                    _this.$router.push({
                                        name: 'manager_home'
                                    });
                                } else {
                                    _this.$Notice.warning({
                                        title: '登录失败',
                                        desc: res.msg
                                    });
                                }
                            }
                        }).catch(function (e) {
                            _this.$Message.destroy();
                            _this.$Notice.error({
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
