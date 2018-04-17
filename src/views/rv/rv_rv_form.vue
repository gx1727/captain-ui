<style lang="less">
    @import '../../styles/common.less';
    @import '../components/styles/table.less';
</style>
<template>
    <div>
        <Row>
            <Col span="24">
            <Card>
                <Form :model="rv" :label-width="120" :rules="ruleValidate" ref="formEditor">
                    <FormItem label="房车名" prop="rv_name">
                        <Input v-model="rv.rv_name" icon="android-list"/>
                    </FormItem>
                    <FormItem label="房车标题">
                        <Input v-model="rv.rv_title" icon="android-list"/>
                    </FormItem>
                    <FormItem label="图片">
                        <Row>
                            <Col span="18">
                            <Input v-model="rv.rv_img" placeholder="请输入图片">
                            <Button type="ghost" slot="append" @click="handleSelectImg" icon="ios-cloud-upload-outline">选择文件</Button>
                            </Input>
                            </Col>
                            <Col span="6">
                            <img v-if="rv.rv_img" :src="rv.rv_img" width="100%"/>
                            </Col>
                        </Row>
                    </FormItem>
                    <FormItem label="市场价格">
                        <Row :gutter="16">
                            <Col span="10">
                            最低价：
                            <Input v-model="rv.rv_price_min"/>
                            </Col>
                            <Col span="10">
                            最高价：
                            <Input v-model="rv.rv_price_max"/>
                            </Col>
                        </Row>
                    </FormItem>
                    <FormItem label="厂商指导价格">
                        <Row :gutter="16">
                            <Col span="10">
                            最低价：
                            <Input v-model="rv.rv_guide_price_min"/>
                            </Col>
                            <Col span="10">
                            最高价：
                            <Input v-model="rv.rv_guide_price_max"/>
                            </Col>
                        </Row>
                    </FormItem>
                    <FormItem label="级别分类">
                        <Select v-model="rv.rv_level">
                            <Option v-for="item in levelList" :value="item.ct_name" :key="item.ct_name">{{ item.ct_title }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="地盘">
                        <Select v-model="rv.rv_chassis">
                            <Option v-for="item in chassisList" :value="item.ct_name" :key="item.ct_name">{{ item.ct_title }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="国别">
                        <Input v-model="rv.rv_country" icon="android-list"/>
                    </FormItem>
                    <FormItem label="产地">
                        <Input v-model="rv.rv_origin" icon="android-list"/>
                    </FormItem>
                    <FormItem label="准驾驾驶证">
                        <Select v-model="rv.rv_driver_license">
                            <Option v-for="item in driverLicenseList" :value="item.ct_name" :key="item.ct_name">{{ item.ct_title }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="排量">
                        <Input v-model="rv.rv_displacement" icon="android-list"/>
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
        name: 'menu-view',
        components: {
            imgManager
        },
        data () {
            return {
                rv: {
                    rv_id: 0,
                    rv_name: '',
                    rv_title: '',
                    rv_img: '',
                    rv_price_min: '',
                    rv_price_max: '',
                    rv_guide_price_min: '',
                    rv_guide_price_max: '',
                    rv_level: '',
                    rv_chassis: '',
                    rv_country: '',
                    rv_origin: '',
                    rv_driver_license: '',
                    rv_displacement: ''
                },
                ruleValidate: {
                    rv_name: [{required: true, message: '名称不能为空', trigger: 'blur'}],
                },
                levelList: [],
                chassisList: [],
                driverLicenseList: []
            };
        },
        computed: {},
        methods: {
            handleSelectImg: function () {
                let vm = this;
                this.$refs.imgManager.$emit('open', function (selectedImg) {
                    selectedImg = selectedImg[0];
                    vm.rv.rv_img = selectedImg.url;
                });
            },
            btnSubmit: function () {
                let vm = this;
                this.$refs['formEditor'].validate((valid) => {
                    if (valid) {
                        api.Post('CmsRvFormApi', this.rv, function (res) {
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
            let rv_id = parseInt(this.$route.params.rv_id.toString());
            this.rv.rv_id = rv_id;
            if (rv_id) {
                api.Post('CmsRvGetApi', {rv_id: rv_id}, function (res) {
                    if (res.code === 0) {
                        vm.rv.rv_id = res.rv_id;
                        vm.rv.rv_name = res.rv_name;
                        vm.rv.rv_title = res.rv_title;
                        vm.rv.rv_img = res.rv_img;
                        vm.rv.rv_price_min = res.rv_price_min;
                        vm.rv.rv_price_max = res.rv_price_max;
                        vm.rv.rv_guide_price_min = res.rv_guide_price_min;
                        vm.rv.rv_guide_price_max = res.rv_guide_price_max;
                        vm.rv.rv_level = res.rv_level;
                        vm.rv.rv_chassis = res.rv_chassis;
                        vm.rv.rv_country = res.rv_country;
                        vm.rv.rv_origin = res.rv_origin;
                        vm.rv.rv_driver_license = res.rv_driver_license;
                        vm.rv.rv_displacement = res.rv_displacement;
                    } else {
                        vm.$Notice.warning({
                            title: '错误',
                            desc: res.msg
                        });
                    }
                });
            }
            api.Post('CmsTagByGroupApi', {group: 'level'}, function (res) {
                if (res.code === 0) {
                    vm.levelList = res.tagData;
                }

            });
            api.Post('CmsTagByGroupApi', {group: 'chassis'}, function (res) {
                if (res.code === 0) {
                    vm.chassisList = res.tagData;
                }

            });
            api.Post('CmsTagByGroupApi', {group: 'driverlicense'}, function (res) {
                if (res.code === 0) {
                    vm.driverLicenseList = res.tagData;
                }

            })
        },
        created () {
        }
    }
</script>