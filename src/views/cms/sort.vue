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
                <a href="#" @click="refreshCmsSort" slot="extra">
                    <Icon type="ios-loop-strong"></Icon>
                    刷新
                </a>
                <Row>
                    <Tree :data="cmsSortTree" @on-select-change="onCmsSortTreeSelectChange"></Tree>
                </Row>
            </Card>
            </Col>
            <Col span="14">
            <p slot="title">
                <Icon type="android-menu"></Icon>
                分类明细
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
            <Form :model="cmsSort" :label-width="80" :rules="ruleValidate" ref="cmsSort">

                <FormItem label="排序">
                    <InputNumber :max="99" :min="1" v-model="cmsSort.cs_order"></InputNumber>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="btnSubmit">确定</Button>
                </FormItem>
            </Form>
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
                cmsSortTree: [],
                cmsSort: {
                    cs_id: 0
                }
            };
        },
        computed: {},
        methods: {
            refreshCmsSort: function () {

            },
            onCmsSortTreeSelectChange: function () {

            },
            delCmsSort: function () {

            },
            cleanCmsSort: function () {

            },
            refreshCmsSort: function () {

            },
            btnSubmit: function () {
            }
        },
        mounted () {
        },
        created () {
        }
    }
</script>