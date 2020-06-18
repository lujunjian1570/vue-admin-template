<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="listQuery" :inline="true" label-width="84px">
      <el-form-item label="作者：" prop="author">
        <el-input
          v-model="listQuery.author"
          placeholder="请输入作者"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态：" prop="status">
        <el-select
          v-model="listQuery.status"
          placeholder="使用状态"
          clearable
          size="small"
          style="width: 240px"
        >
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间：">
        <el-date-picker
          v-model="dateRange"
          size="small"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="作者" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标题">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column label="访问量" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.pageviews }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="状态" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status | statusFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.display_time }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="180"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            v-if="scope.row.userId !== 1"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog title="修改内容" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="作者：" prop="author">
              <el-input v-model="form.author" size="small" placeholder="请输入作者" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态：">
              <el-select v-model="form.status" size="small" placeholder="请选择">
                <el-option
                  v-for="item in statusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="标题：">
              <el-input v-model="form.title" type="textarea" size="small" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="submitForm">确 定</el-button>
        <el-button size="mini" @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import { getArticleList } from '@/api'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 10,
        author: undefined,
        status: undefined,
        startTime: undefined,
        endTime: undefined
      },
      dateRange: [],
      statusOptions: [
        {
          label: '全部',
          value: undefined
        },
        {
          label: 'success',
          value: 'published'
        },
        {
          label: 'gray',
          value: 'draft'
        },
        {
          label: 'danger',
          value: 'deleted'
        }
      ],
      // 是否显示弹出层
      open: false,
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        author: [
          { required: true, message: '作者不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      // this.listLoading = true
      const params = this.listQuery
      params.startTime = this.dateRange[0] ? `${this.dateRange[0]} 00:00:00` : undefined
      params.endTime = this.dateRange[1] ? `${this.dateRange[1]} 23:59:59` : undefined
      this.$Http.getArticleList(params).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        // this.listLoading = false
      })
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.listQuery.page = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = []
      this.$refs['queryForm'].resetFields()
      this.handleQuery()
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.form = {
        author: row.author,
        status: row.status,
        title: row.title
      }
      this.open = true
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.open = false
        }
      })
    },
    /** 关闭弹层*/
    cancel: function() {
      this.open = false
    },
    /** 删除*/
    handleDelete(row) {
      this.$confirm('是否确认删除编号为"' + row.id + '"的数据项?', '警告', {
        type: 'warning'
      }).then(() => {
        this.$message({
          message: `编号为${row.id}的数据删除成功！`,
          type: 'success',
          duration: 3 * 1000
        })
      }).catch(function() {})
    }
    /* async getList() {
      const res = await this.$Http.getTableList()
      this.list = res.items
      this.total = res.total
      // this.listLoading = false
    }*/
  }
}
</script>
