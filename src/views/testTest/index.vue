<template>
  <div class="login-container">
    测试
    <div>
      <img v-lazy="picUrl" class="item-pic">
    </div>
    <div>
      <!-- 调用组件  -->
      <draggable v-model="listData">
        <el-button v-for="item in listData">{{item.name}}</el-button>
      </draggable>
      <br>
      <!-- 展示list数据效果 -->
      {{listData}}
      <div style="margin-top: 20px">编号(点击可以复制)：
        <span data-clipboard-action="copy" class="cobyOrderData1" :data-clipboard-text="orderData" @click="copyText1">{{orderData}}</span>
        <el-button class="cobyOrderData2" @click="copyText2(orderData)">copy</el-button>
      </div>
      <div style="margin-top: 20px">
        <el-button @click="downLoad">downLoad</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import draggable from 'vuedraggable'
  import clipboard from 'clipboard'
  import { saveAs } from 'file-saver'
  export default {
    name: 'TestTest',
    components: {
      draggable
    },
    data() {
      return {
        picUrl: '',
        orderData: '1234231412341324312',
        listData:[
          {
            id: 1,
            name: 'draggable1'
          },
          {
            id: 2,
            name: 'draggable2'
          },
          {
            id: 3,
            name: 'draggable3'
          },
          {
            id: 4,
            name: 'draggable4'
          },
          {
            id: 5,
            name: 'draggable5'
          }
        ]
      }
    },
    mounted() {
      // this.genData()
    },
    methods: {
      getData() {
        this.$Http.selectThemeList({
          cmstoken: 'rKdzOSqkVIAwD2FvLoS0tXbAhFpkU9invdG3JtknXFX4-uGTVTauN1yvPFI0B-DlfT7rsERa7StT-LzP9DteBC6X7fDDIg7JCdpDNxSITJoArq9_emOcrEmLUkDuSOfZEmhTrC2X1LsUWVf9NqIXNg5polmRL6ZBmqRZAuWYiys'
        }).then(res => {
          console.log(res)
          this.picUrl = res.obj[res.obj.length - 1].viewImg
        })
      },
      //
      copyText1() {
        let clipboardText1 = new clipboard(".cobyOrderData1")
        clipboardText1.on('success', () => {
          this.$message.success("复制成功")
          // 释放内存
          clipboardText1.destroy()
        })
        clipboardText1.on('error', () => {
          this.$message.error("复制失败")
          // 释放内存
          clipboardText1.destroy()
        })
      },
      copyText2 (data) {
        let clipboardText2 = new clipboard('.cobyOrderData2', {
          text: function () {
            return data
          }
        })
        clipboardText2.on('success', e => {
          this.$message.success("复制成功")
          // 释放内存
          clipboardText2.destroy()
        })
        clipboardText2.on('error', e => {
          this.$message.error("复制失败")
          // 释放内存
          clipboardText2.destroy()
        })
      },
      downLoad() {
        const codeStr = this.orderData
        const fileName = this.orderData
        const blob = new Blob([codeStr], { type: 'text/plain;charset=utf-8' })
        saveAs(blob, fileName)
      }
    }
  }
</script>
<style lang="scss" scoped>
  .cobyOrderData1{
    color: #00afff;
    cursor: pointer;
  }
</style>
