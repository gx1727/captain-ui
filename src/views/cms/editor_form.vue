<style lang="less">
    @import '../../styles/common.less';
    @import '../components/styles/table.less';
</style>
<template>
    <div>
        <Row>
            <Col span="24">
            <Card>
                <Form :model="editor" :label-width="80" :rules="ruleValidate" ref="formEditor">
                    <FormItem label="用户名" prop="user_name">
                        <Input v-model="editor.user_name" icon="android-list"/>
                    </FormItem>
                    <FormItem label="密码">
                        <Input v-model="editor.pwd" icon="android-list"/>
                    </FormItem>
                    <FormItem label="真实姓名">
                        <Input v-model="editor.user_true_name" icon="android-list"/>
                    </FormItem>
                    <FormItem label="手机号码">
                        <Input v-model="editor.user_phone" icon="android-list"/>
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
    import util from '@/libs/util.js';

    export default {
        name: 'menu-view',
        components: {},
        data () {
            return {
                editor: {
                    user_id: 0,
                    user_name: '',
                    pwd: '',
                    user_pwd: '',
                    user_true_name: '',
                    user_phone: ''
                },
                ruleValidate: {
                    user_name: [{required: true, message: '用户名不能为空', trigger: 'blur'}],
                }
            };
        },
        computed: {},
        methods: {
            btnSubmit: function () {
                let vm = this;
                this.$refs['formEditor'].validate((valid) => {
                    if (valid) {
                        this.editor.user_pwd = util.secret(this.editor.pwd);
                        api.Post('CmsEditorFormApi', this.editor, function (res) {
                            if (res.code === 0) {
                                vm.$Notice.success({
                                    title: '编辑成功'
                                });
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
            let user_id = parseInt(this.$route.params.user_id.toString());
            this.editor.user_id = user_id;
            api.Post('CmsEditorGetApi', {user_id: user_id}, function (res) {
                if(res.code === 0) {
                    vm.editor.user_id = res.user_id;
                    vm.editor.user_name = res.user_name;
                    vm.editor.user_true_name = res.user_true_name;
                    vm.editor.user_phone = res.user_phone;
                    vm.editor.pwd = '';
                    vm.editor.user_pwd = '';
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