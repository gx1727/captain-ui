<style lang="less">
    @import '../../styles/common.less';
    @import '../components/styles/table.less';
</style>
<template>
    <div>
        <Row style="margin-bottom: 200px;">
            <Col span="18">
            <Card>
                <Form :label-width="80">
                    <FormItem label="模板标题">
                        <Input v-model="template.t_title" icon="android-list" placeholder="输入模板标题..."/>
                    </FormItem>
                    <FormItem label="模板描述">
                        <Input type="textarea" v-model="template.t_des" placeholder="输入模板描述..."/>
                    </FormItem>
                    <FormItem label="模板内容">
                        <Input v-model="template.t_content" type="textarea" :autosize="{minRows: 50}" placeholder="输入模板内容..."/>
                    </FormItem>
                </Form>
            </Card>
            </Col>
            <Col span="6" class="padding-left-10">
            <Card>
                <p slot="title">
                    <Icon type="paper-airplane"></Icon>
                    属性
                </p>
                <Button slot="extra" type="ghost" shape="circle" icon="edit" @click="refresh()">重新加载</Button>
                <p class="margin-top-10">
                    模板名称：
                    <Input v-model="template.t_name" placeholder="模板名称..."/>
                </p>
                <p class="margin-top-10">
                    文件路径：
                    <Input v-model="template.t_path" placeholder="文件保存路径..."/>
                </p>
                <p class="margin-top-10">
                    模板种类：
                    <Select v-model="template.t_type">
                        <Option value="T">显示模板</Option>
                        <Option value="J">js文件</Option>
                        <Option value="S">style样式文件</Option>
                    </Select>
                </p>
                <p class="margin-top-10">
                    模板分类：
                    <Select v-model="template.t_class">
                        <Option value="A">文章</Option>
                        <Option value="L">列表</Option>
                        <Option value="S">专有</Option>
                        <Option value="C">组件</Option>
                    </Select>
                </p>
                <Row class="margin-top-20 publish-button-con">
                    <a :href="'/preview/template/' + template.t_id" target="_blank">预览</a>
                    <span class="publish-button"><Button @click="handleSaveTemplate">保存</Button></span>
                    <span class="publish-button"><Button @click="handlePublish" :loading="publishLoading" icon="ios-checkmark" style="width:90px;" type="primary">发布</Button></span>
                </Row>
            </Card>
            <Card class="margin-top-10">
                <p slot="title">
                    <Icon type="paper-airplane"></Icon>
                    版本
                </p>
                <Button slot="extra" type="ghost" shape="circle" icon="edit" @click="backup()">备份</Button>
                <Card :bordered="false" class="margin-top-10" v-for="(item, index) in template.history" :key="'template_history_' + item.t_id">
                    <p slot="title">{{ item.t_title }}</p>
                    <Button slot="extra" type="dashed" size="small" icon="eye" @click="handleViewHistory(item.t_id)">查看</Button>
                    <Poptip
                            confirm
                            slot="extra"
                            title="你确定要删除该备份吗?"
                            @on-ok="handleDeleteHistory(item.t_id)">
                        <Button type="dashed" size="small" icon="android-delete">删除</Button>
                    </Poptip>
                    <p>{{ item.t_des }}</p>
                    <p>{{ item.atime }}</p>
                </Card>
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
                publishLoading: false,
                template: {
                    t_id: 0,
                    t_name: '',
                    t_title: '',
                    t_type: '',
                    t_class: '',
                    t_path: '',
                    t_des: '',
                    t_content: '',
                    t_atime: '',
                    t_status: '',
                    history: []
                }
            };
        },
        computed: {},
        methods: {
            refresh () {
                let vm = this;
                api.Post('CmsTemplateGetApi', {
                    t_id: this.template.t_id
                }, function (res) {
                    if (res.code === 0) {
                        vm.template.t_id = res.t_id;
                        vm.template.t_name = res.t_name;
                        vm.template.t_title = res.t_title;
                        vm.template.t_type = res.t_type;
                        vm.template.t_class = res.t_class;
                        vm.template.t_path = res.t_path;
                        vm.template.t_des = res.t_des;
                        vm.template.t_content = res.t_content;
                        vm.template.t_atime = res.t_atime;
                        vm.template.t_status = res.t_status;
                        vm.template.history = res.history;
                    }
                })
            },
            handleSaveTemplate: function () {
                let vm = this;
                api.Post('CmsTemplateFormApi', this.template, function (ret) {
                    if (ret.code === 0) {
                        vm.$Message.info('保存成功');
                        if (!vm.template.t_id) {
                            vm.template.t_id = ret.id;
                        }
                        vm.refresh();
                    } else {
                        vm.$Notice.warning({
                            title: '错误',
                            desc: ret.msg
                        });
                    }
                })
            },
            backup () {
                let vm = this;
                if (this.template.t_id) {
                    api.Post('CmsTemplateBackupApi', this.template, function (ret) {
                        if (ret.code === 0) {
                            vm.$Message.info('保存成功');
                            vm.refresh();
                        } else {
                            vm.$Notice.warning({
                                title: '错误',
                                desc: ret.msg
                            });
                        }
                    });
                }
            },
            handleViewHistory: function (t_id) {
                let vm = this;
                api.Post('CmsTemplateGetApi', {
                    t_id: t_id
                }, function (res) {
                    if (res.code === 0) {
                        vm.template.t_title = res.t_title;
                        vm.template.t_des = res.t_des;
                        vm.template.t_content = res.t_content;
                    }
                });
            },
            handleDeleteHistory: function (t_id) {
                let vm = this;
                api.Post('CmsTemplateDelApi', {t_id: t_id}, function (ret) {
                    if (ret.code === 0) {
                        vm.$Message.info('保存成功');
                        vm.refresh();
                    } else {
                        vm.$Notice.warning({
                            title: '错误',
                            desc: ret.msg
                        });
                    }
                });
            },
            handlePublish: function () {
                let vm = this;
                api.Post('CmsTemplateFormApi', this.template, function (ret) {
                    if (ret.code === 0) {
                        vm.$Message.info('保存成功');
                        if (!vm.template.t_id) {
                            vm.template.t_id = ret.id;
                        }
                        api.Post('CmsTemplatePublishApi', {t_id: vm.template.t_id}, function (ret) {
                            if (ret.code === 0) {
                                vm.$Message.info('发布成功');
                                vm.refresh();
                            } else {
                                vm.$Notice.warning({
                                    title: '错误',
                                    desc: ret.msg
                                });
                            }
                        });
                        vm.refresh();
                    } else {
                        vm.$Notice.warning({
                            title: '错误',
                            desc: ret.msg
                        });
                    }
                })
            }
        },
        mounted () {
            let t_id = 0;
            if (this.$route.params.t_id) {
                t_id = parseInt(this.$route.params.t_id.toString());
            }
            if (t_id) { // 编辑
                this.template.t_id = t_id;
                this.refresh();
            }
        },
        created () {
        }
    };
</script>