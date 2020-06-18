<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="formRules" label-width="80px">
      <el-form-item prop="name" label="姓名：">
        <el-input v-model="form.name" placeholder="请输入姓名（需大于四个字符）" />
      </el-form-item>
      <el-form-item prop="region" label="城市：">
        <el-select v-model="form.region" placeholder="请选择所在城市">
          <el-option label="Zone one" value="shanghai" />
          <el-option label="Zone two" value="beijing" />
        </el-select>
      </el-form-item>
      <el-form-item prop="date1" label="时间：">
        <el-col :span="11">
          <el-date-picker v-model="form.date1" type="date" placeholder="选择日期" style="width: 100%;" />
        </el-col>
        <!--<el-col :span="2" class="line">-</el-col>
        <el-col :span="11">
          <el-time-picker v-model="form.date2" type="fixed-time" placeholder="Pick a time" style="width: 100%;"/>
        </el-col>-->
      </el-form-item>
      <el-form-item prop="delivery" label="状态：">
        <el-switch v-model="form.delivery" />
      </el-form-item>
      <el-form-item prop="type" label="类型：">
        <el-checkbox-group v-model="form.type">
          <el-checkbox label="Online activities" name="type" />
          <el-checkbox label="Promotion activities" name="type" />
          <el-checkbox label="Offline activities" name="type" />
          <el-checkbox label="Simple brand exposure" name="type" />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item prop="resource" label="radio：">
        <el-radio-group v-model="form.resource">
          <el-radio label="Sponsor" />
          <el-radio label="Venue" />
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="desc" label="textarea：">
        <el-input v-model="form.desc" type="textarea" :rows="5" show-word-limit />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button @click="onCancel">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    const validateNname = (rule, value, callback) => {
      if (!this.$Utils.validUsername(value)) {
        callback(new Error('请输入符合要求的姓名'))
      } else {
        callback()
      }
    }
    return {
      form: {
        name: '',
        region: '',
        date1: '',
        // date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      formRules: {
        name: [{ required: true, trigger: 'blur', validator: validateNname }],
        region: [{ required: true, message: '请选择所在城市', trigger: 'blur' }]
      }
    }
  },
  methods: {
    onSubmit() {
      // this.$message('submit!')
      this.$refs.form.validate(valid => {
        if (valid) {
          alert(JSON.stringify(this.form))
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    onCancel() {
      this.$refs.form.resetFields()
    }
  }
}
</script>

<style scoped>
  .line {
    text-align: center;
  }
</style>

