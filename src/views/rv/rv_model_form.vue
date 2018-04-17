<style lang="less">
    @import '../../styles/common.less';
    @import '../components/styles/table.less';
</style>
<template>
    <div>
        <Row>
            <Col span="24">
            <Card>
                <Form :model="rv_model" :label-width="120" :rules="ruleValidate" ref="formEditor">
                    <FormItem label="年款">
                        <Input v-model="rv_model.rm_year" icon="android-list"/>
                    </FormItem>
                    <FormItem label="车型名" prop="rm_name">
                        <Input v-model="rv_model.rm_name" icon="android-list"/>
                    </FormItem>

                    <FormItem label="图片">
                        <Row>
                            <Col span="18">
                            <Input v-model="rv_model.rm_img" placeholder="请输入图片">
                            <Button type="ghost" slot="append" @click="handleSelectImg" icon="ios-cloud-upload-outline">选择文件</Button>
                            </Input>
                            </Col>
                            <Col span="6">
                            <img v-if="rv_model.rm_img" :src="rv_model.rm_img" width="100%"/>
                            </Col>
                        </Row>
                    </FormItem>
                    <FormItem label="市场价格">
                        <Row :gutter="16">
                            <Col span="10">
                            最低价：
                            <Input v-model="rv_model.rm_price_min"/>
                            </Col>
                            <Col span="10">
                            最高价：
                            <Input v-model="rv_model.rm_price_max"/>
                            </Col>
                        </Row>
                    </FormItem>
                    <FormItem label="厂商指导价格">
                        <Input v-model="rv_model.rm_guide_price" icon="android-list"/>
                    </FormItem>
                    <FormItem label="驱动方式">
                        <Input v-model="rv_model.rm_driving_mode" icon="android-list"/>
                    </FormItem>
                    <FormItem label="整车重量">
                        <Input v-model="rv_model.rm_weight" icon="android-list"/>
                    </FormItem>
                    <FormItem label="总床位数">
                        <Input v-model="rv_model.rm_beds" icon="android-list"/>
                    </FormItem>
                    <FormItem label="可承载人数">
                        <Input v-model="rv_model.rm_capacity" icon="android-list"/>
                    </FormItem>
                    <FormItem label="油箱容积(L)">
                        <Input v-model="rv_model.rm_tank_volume" icon="android-list"/>
                    </FormItem>
                    <FormItem label="排量">
                        <Input v-model="rv_model.rm_displacement" icon="android-list"/>
                    </FormItem>
                    <FormItem label="准驾驾驶证">
                        <Select v-model="rv_model.rm_driver_license">
                            <Option v-for="item in driverLicenseList" :value="item.ct_name" :key="item.ct_name">{{ item.ct_title }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="燃料">
                        <Input v-model="rv_model.rm_fuel" icon="android-list"/>
                    </FormItem>
                    <FormItem label="长*宽*高 (mm)">
                        <Input v-model="rv_model.rm_size" icon="android-list"/>
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
                rv_model: {
                    rm_id: 0,
                    rm_year: 0,
                    rm_name: '',
                    rm_img: '',
                    rm_price_min: '',
                    rm_price_max: '',
                    rm_guide_price: '',
                    rm_driving_mode: '',
                    rm_beds: '',
                    rm_capacity: '',
                    rm_tank_volume: '',
                    rm_displacement: '',
                    rm_driver_license: '',
                    rm_fuel: '',
                    rm_size: ''
                },
                ruleValidate: {
                    rv_name: [{required: true, message: '名称不能为空', trigger: 'blur'}],
                },
                driverLicenseList: []
            };
        },
        computed: {},
        methods: {
            handleSelectImg: function () {
                let vm = this;
                this.$refs.imgManager.$emit('open', function (selectedImg) {
                    selectedImg = selectedImg[0];
                    vm.rv_model.rm_img = selectedImg.url;
                });
            },
            btnSubmit: function () {
                let vm = this;
                this.$refs['formEditor'].validate((valid) => {
                    if (valid) {
                        api.Post('CmsModelFormApi', this.rv_model, function (res) {
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
            let rm_id = parseInt(this.$route.params.rm_id.toString());
            this.rv_model.rm_id = rm_id;
            if (rm_id) {
                api.Post('CmsModelGetApi', {rm_id: rm_id}, function (res) {
                    if (res.code === 0) {
                        vm.rv_model.rm_id = res.rm_id;
                        vm.rv_model.rm_year = res.rm_year;
                        vm.rv_model.rm_name = res.rm_name;
                        vm.rv_model.rm_img = res.rm_img;
                        vm.rv_model.rm_price_min = res.rm_price_min;
                        vm.rv_model.rm_price_max = res.rm_price_max;
                        vm.rv_model.rm_guide_price = res.rm_guide_price;
                        vm.rv_model.rm_driving_mode = res.rm_driving_mode;
                        vm.rv_model.rm_beds = res.rm_beds;
                        vm.rv_model.rm_capacity = res.rm_capacity;
                        vm.rv_model.rm_tank_volume = res.rm_tank_volume;
                        vm.rv_model.rm_displacement = res.rm_displacement;
                        vm.rv_model.rm_driver_license = res.rm_driver_license;
                        vm.rv_model.rm_fuel = res.rm_fuel;
                        vm.rv_model.rm_size = res.rm_size;
                    } else {
                        vm.$Notice.warning({
                            title: '错误',
                            desc: res.msg
                        });
                    }
                });
            }
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