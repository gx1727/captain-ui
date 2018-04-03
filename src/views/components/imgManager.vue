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
            <Tabs>
                <TabPane label="素材库" style="height: 70vh;overflow: auto;">
                    <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p>
                    <p>dddddddddddddd</p>sss

                </TabPane>
                <TabPane label="本地上传">标签二的内容</TabPane>
                <TabPane label="网络图片">标签三的内容</TabPane>
                <Row slot="extra" style="width: 45vw;">
                    <Col span="5">
                        <Select>
                            <Option value="all">全部</Option>
                            <Option value="s">收藏</Option>
                        </Select>
                    </Col>
                    <Col span="5" style="text-align: center;">
                    <ButtonGroup>
                        <Button type="primary" icon="android-list"></Button>
                        <Button icon="android-apps"></Button>
                    </ButtonGroup>
                    </Col>
                    <Col span="14" style="text-align: right;">
                    <Input v-model="searchKey" icon="ios-clock-outline" placeholder="输入关系词..."></Input>
                    </Col>
                </Row>
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