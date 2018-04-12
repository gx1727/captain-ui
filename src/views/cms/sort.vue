<style lang="less">
    @import '../../styles/common.less';
    @import '../components/styles/table.less';
</style>
<template>
    <div>
        <Row class="margin-top-10">
            <Col span="10">
            <Card>
                <p slot="title">
                    <Icon type="android-menu"></Icon>
                    分类
                </p>
                <a href="#" @click="refreshCmsSortTree" slot="extra">
                    <Icon type="ios-loop-strong"></Icon>
                    刷新
                </a>
                <Row>
                    <Tree :data="cmsSortTree" @on-select-change="onCmsSortTreeSelectChange"></Tree>
                </Row>
            </Card>
            </Col>
            <Col span="14">
            <Card>
                <p slot="title">
                    <Icon type="android-menu"></Icon>
                    分类明细 [{{ cmsTitle }}]
                </p>
                <Poptip slot="extra" placement="bottom" confirm @on-ok="delCmsSort" title="您确认删除这个分类项吗？" v-if="cmsSort.cs_id > 0">
                    <Button type="error" size="small" shape="circle" class="margin-right-10">删除</Button>
                </Poptip>
                <a href="#" @click="cleanCmsSort" slot="extra">
                    <Icon type="android-add"></Icon>
                    新增
                </a>
                <a href="#" @click="refreshCmsSort" slot="extra">
                    <Icon type="ios-loop-strong"></Icon>
                    刷新
                </a>
                <Form :model="cmsSort" :label-width="80" :rules="ruleValidate" ref="formSort">
                    <FormItem label="上级分类">
                        <Select v-model="cmsSort.cs_parent">
                            <Option v-for="item in parentSortList" :value="item.id" :key="item.id">{{ item.title }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="分类名">
                        <Input v-model="cmsSort.cs_name" placeholder="请输入分类名"/>
                    </FormItem>
                    <FormItem label="分类标题" prop="cs_title">
                        <Input v-model="cmsSort.cs_title" placeholder="请输入分类标题"/>
                    </FormItem>
                    <FormItem label="分类模板">
                        <Input v-model="cmsSort.cs_template" placeholder="请输入分类模板"/>
                    </FormItem>
                    <FormItem label="分类图片">
                        <Row>
                            <Col span="18">
                                <Input v-model="cmsSort.cs_img" placeholder="请输入分类图片">
                                    <Button type="ghost" slot="append" @click="handleSelectImg" icon="ios-cloud-upload-outline">选择文件</Button>
                                </Input>
                            </Col>
                            <Col span="6">
                                <img v-if="cmsSort.cs_img" :src="cmsSort.cs_img" width="100%"/>
                            </Col>
                        </Row>
                    </FormItem>
                    <FormItem label="排序">
                        <InputNumber :min="1" v-model="cmsSort.cs_order"></InputNumber>
                    </FormItem>
                    <FormItem>
                        <Button type="primary" @click="btnSubmit">确定</Button>
                    </FormItem>
                </Form>
            </Card>
            </Col>
        </Row>
        <img-manager
                ref="imgManager"
        ></img-manager>
    </div>
</template>
<script>
    import imgManager from '../components/imgManager.vue';
    import api from '../../api';
    export default {
        name: 'cms-sort',
        components: {
            imgManager
        },
        data () {
            return {
                cmsTitle: '新增',
                cmsSortTree: [],
                parentSortList: [{
                    id: 0,
                    title: '无'
                }],
                cmsSort: {
                    cs_id: 0,
                    cs_parent: 0,
                    cs_name: '',
                    cs_title: '',
                    cs_template: '',
                    cs_order: 0,
                    cs_img: ''

                },
                ruleValidate: {
                    cs_title: [{required: true, message: '标题不能为空', trigger: 'blur'}],
                }
            };
        },
        computed: {},
        methods: {
            refreshCmsSortTree: function () {
                let vm = this;
                api.Post('CmsSortGetTreeApi', {cs_id: 0}, function (res) {
                    if (res.code === 0) {
                        vm.parentSortList = [{
                            id: 0,
                            title: '无'
                        }]; // 重置上级菜单的选项
                        for (let key in res.sortList) {
                            vm.parentSortList.push(
                                {
                                    id: res.sortList[key].sort_id,
                                    title: res.sortList[key].title
                                }
                            );
                        }

                        vm.cmsSortTree = res.sortTree;
                    } else {
                        vm.$Notice.warning({
                            title: '错误',
                            desc: res.msg
                        });
                    }
                });
            },
            onCmsSortTreeSelectChange: function (sortNode) {
                if (sortNode.length > 0) {
                    this.cmsSort.cs_id = sortNode[0].cs_id;
                    this.refreshCmsSort();
                }
            },
            delCmsSort: function () {
                let vm = this;
                api.Post('CmsSortDelItemApi', {cs_id: vm.cmsSort.cs_id}, function (res) {
                    if (res.code === 0) {
                        vm.refreshCmsSortTree();
                        vm.cleanCmsSort();
                    } else {
                        vm.$Notice.warning({
                            title: '错误',
                            desc: res.msg
                        });
                    }
                });
            },
            cleanCmsSort: function () {
                this.cmsTitle = '新增';
                this.cmsSort.cs_id = 0;
                this.cmsSort.cs_parent = 0;
                this.cmsSort.cs_name = '';
                this.cmsSort.cs_title = '';
                this.cmsSort.cs_template = '';
                this.cmsSort.cs_order = 0;
                this.cmsSort.cs_img = '';
            },
            refreshCmsSort: function () {
                let vm = this;
                if (vm.cmsSort.cs_id > 0) {
                    api.Post('CmsSortGetItemApi', {cs_id: vm.cmsSort.cs_id}, function (res) {
                        if (res.code === 0) {
                            vm.cmsSort.cs_parent = res.cs_parent;
                            vm.cmsSort.cs_name = res.cs_name;
                            vm.cmsSort.cs_title = res.cs_title;
                            vm.cmsSort.cs_template = res.cs_template;
                            vm.cmsSort.cs_order = res.cs_order;
                            vm.cmsSort.cs_img = res.cs_img;

                            vm.cmsTitle = '编辑 ' + vm.cmsSort.cs_title;
                        } else {
                            vm.$Notice.warning({
                                title: '错误',
                                desc: res.msg
                            });
                        }
                    });
                } else {
                    vm.cleanCmsSort();
                }
            },
            handleSelectImg () {
                let vm = this;
                this.$refs.imgManager.$emit('open', function(selectedImg){
                    selectedImg = selectedImg[0];
                    vm.cmsSort.cs_img = selectedImg.url;
                });
            },
            btnSubmit: function () {
                let vm = this;
                this.$refs['formSort'].validate((valid) => {
                    if (valid) {
                        api.Post('CmsSortFormItemApi', this.cmsSort, function (res) {
                            if (res.code === 0) {
                                vm.refreshCmsSortTree();
                                vm.refreshCmsSort();
                                vm.$Notice.success({
                                    title: '编辑成功'
                                });
                            } else if (res.code === 6) {
                                vm.$Notice.info({
                                    title: '提示',
                                    desc: res.msg
                                });
                                vm.refreshCmsSortTree();
                                vm.refreshCmsSort();
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
            this.refreshCmsSortTree();
        },
        created () {
        }
    }
</script>