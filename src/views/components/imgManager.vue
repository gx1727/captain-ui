<style lang="less">
    @import '../../styles/common.less';
</style>
<template>
    <div>
        <Modal
                v-model="showCurrentTableData"
                width="80"
                :scrollable="true"
                :mask-closable="false"
                :styles="{top: '20px'}">
            <Row :gutter="16" style="border-bottom: 1px solid #ababab;padding-bottom: 3px;">
                <Col span="10">
                <ButtonGroup>
                    <Button>素材库</Button>
                    <Button type="primary">本地上传</Button>
                    <Button>网络图片</Button>
                </ButtonGroup>
                </Col>
                <Col span="4">
                <ButtonGroup style="float: right;">
                    <Button type="primary" icon="android-list"></Button>
                    <Button icon="android-apps"></Button>
                </ButtonGroup>
                </Col>
                <Col span="10">
                <Input v-model="searchKey" icon="ios-clock-outline" placeholder="输入关系词..."></Input>
                </Col>
            </Row>
            <Tabs >
                <TabPane label="素材库" style="height: 70vh;overflow: auto;">
                    <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p> <p>dddddddddddddd</p> <p>dddddddddddddd</p> <p>dddddddddddddd</p> <p>dddddddddddddd</p> <p>dddddddddddddd</p> <p>dddddddddddddd</p> <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p> <p>dddddddddddddd</p> <p>dddddddddddddd</p> <p>dddddddddddddd</p> <p>dddddddddddddd</p> <p>dddddddddddddd</p> <p>dddddddddddddd</p> <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p> <p>dddddddddddddd</p> <p>dddddddddddddd</p> <p>dddddddddddddd</p> <p>dddddddddddddd</p> <p>dddddddddddddd</p> <p>dddddddddddddd</p> <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p> <p>dddddddddddddd</p> <p>dddddddddddddd</p> <p>dddddddddddddd</p> <p>dddddddddddddd</p> <p>dddddddddddddd</p> <p>dddddddddddddd</p> <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p> <p>dddddddddddddd</p> <p>dddddddddddddd</p> <p>dddddddddddddd</p> <p>dddddddddddddd</p> <p>dddddddddddddd</p> <p>dddddddddddddd</p> <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p> <p>dddddddddddddd</p> <p>dddddddddddddd</p> <p>dddddddddddddd</p> <p>dddddddddddddd</p> <p>dddddddddddddd</p> <p>dddddddddddddd</p> <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p> <p>dddddddddddddd</p> <p>dddddddddddddd</p> <p>dddddddddddddd</p> <p>dddddddddddddd</p> <p>dddddddddddddd</p> <p>dddddddddddddd</p> <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p> <p>dddddddddddddd</p> <p>dddddddddddddd</p> <p>dddddddddddddd</p> <p>dddddddddddddd</p> <p>dddddddddddddd</p> <p>dddddddddddddd</p> <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p> <p>dddddddddddddd</p> <p>dddddddddddddd</p> <p>dddddddddddddd</p> <p>dddddddddddddd</p> <p>dddddddddddddd</p> <p>dddddddddddddd</p> <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p> <p>dddddddddddddd</p> <p>dddddddddddddd</p> <p>dddddddddddddd</p> <p>dddddddddddddd</p> <p>dddddddddddddd</p> <p>dddddddddddddd</p> <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p> <p>dddddddddddddd</p> <p>dddddddddddddd</p> <p>dddddddddddddd</p> <p>dddddddddddddd</p> <p>dddddddddddddd</p> <p>dddddddddddddd</p> <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p> <p>dddddddddddddd</p> <p>dddddddddddddd</p> <p>dddddddddddddd</p> <p>dddddddddddddd</p> <p>dddddddddddddd</p> <p>dddddddddddddd</p>sss

                </TabPane>
                <TabPane label="本地上传">标签二的内容</TabPane>
                <TabPane label="网络图片">标签三的内容</TabPane>
                <Input v-model="searchKey" icon="ios-clock-outline" placeholder="输入关系词..."></Input>
                <!--<Button type="ghost" @click="handleTabsAdd" size="small" slot="extra">增加</Button>-->
            </Tabs>

        </Modal>
    </div>
</template>
<script>
    import api from '../../api';
    export default {
        name: 'img-manager',
        components: {},
        data () {
            return {
                searchKey: '',
                showCurrentTableData: true
            };
        },
        computed: {},
        methods: {},
        mounted () {
        },
        created () {
        }
    }
</script>