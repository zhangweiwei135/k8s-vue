<template>
  <div class="app-container">
    <div class="filter-container">

      <el-input v-model="listQuery.alert_name" placeholder="告警主题" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button  class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>

      <el-button class="filter-item" :show-dialog.sync="dialogFormVisible" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate" >
        添加工单
      </el-button>

    </div>
    <download-excel
      class = "filter-container"
      :fields = "json_fields"
      :data="list"
      :before-finish = "finishDownload"
      name = "告警信息表.xls"
      type="xls">
      <el-button>导出工单</el-button>
    </download-excel>
    <!--    :before-generate = "startDownload"-->

    <el-table
      :key="tableKey"
      :data="list"
      v-loading="listLoading"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="序号"  type="index" align="center" width="80" >
      </el-table-column>
      <el-table-column label="工单编号" width="160px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.order_code }}</span>
        </template>
      </el-table-column>
      <el-table-column label="主题" width="230px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.alert_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="工单分类" align="center" width="160px">
        <template slot-scope="{row}">
          <span>{{ row.order_class }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.state }}</span>
        </template>
      </el-table-column>
      <el-table-column label="级别" width="130px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.level }}</span>
        </template>
      </el-table-column>
      <el-table-column label="处理人" align="center" width="110px">
        <template slot-scope="{row}">
          <span>{{ row.processor }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建人" align="center" width="110px">
        <template slot-scope="{row}">
          <span>{{ row.creator }}</span>
        </template>
      </el-table-column>
      <el-table-column label="告警时间" align="center" width="218px">
        <template slot-scope="{row}">
          <span>{{ row.alert_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="解决时间" align="center" width="160px">
        <template slot-scope="{row}">
          <span>{{ row.solution_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Actions" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">编辑</el-button>
          <el-button slot="reference" size="mini" type="danger" @click="handleDelete(row)" >删除</el-button>
<!--          <el-button type="primary" size="mini" @click="handleScript(row)">挂起</el-button>-->
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页信息-->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="fatchList" />

    <!-- 新增主机 -->
    <el-dialog
      title="添加用户"
      :visible.sync="dialogFormVisible"
    >
      <el-form :model="alert_list">
        <el-form-item label="告警主题" :label-width="formLabelWidth">
          <el-input  v-model="alert_list.alert_name"  style="width: 400px" ></el-input>
        </el-form-item>
        <el-form-item  label="工单类别" :label-width="formLabelWidth">
          <el-input  v-model="alert_list.order_class"  style="width: 400px" ></el-input>
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth">
          <el-input v-model="alert_list.state"  style="width: 400px" ></el-input>
        </el-form-item>
        <el-form-item label="级别" :label-width="formLabelWidth">
          <el-input v-model="alert_list.level"  style="width: 400px" ></el-input>
        </el-form-item>
        <el-form-item label="处理人" :label-width="formLabelWidth">
          <el-input v-model="alert_list.processor"  style="width: 400px" ></el-input>
        </el-form-item>
        <el-form-item label="提单人" :label-width="formLabelWidth">
          <el-input v-model="alert_list.creator"  style="width: 400px" ></el-input>
        </el-form-item>
        <el-form-item label="告警详情" :label-width="formLabelWidth">
          <el-input v-model="alert_list.description"  style="width: 400px" ></el-input>
        </el-form-item>
        <el-form-item label="告警原因" :label-width="formLabelWidth">
          <el-input v-model="alert_list.reason"  style="width: 400px" ></el-input>
        </el-form-item>
        <el-form-item label="告警时间" :label-width="formLabelWidth">
          <el-input v-model="alert_list.alert_time"  style="width: 400px" ></el-input>
        </el-form-item>
        <el-form-item label="解决时间" :label-width="formLabelWidth">
          <el-input v-model="alert_list.solution_time"  style="width: 400px" ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAdd(alert_list)">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑主机 -->
    <el-dialog
      title="编辑用户"
      :visible.sync="dialogHostVisible"
    >
      <el-form :model="alert_list">
        <el-form-item label="告警主题" :label-width="formLabelWidth">
          <el-input  v-model="alert_list.alert_name"  style="width: 400px" ></el-input>
        </el-form-item>
        <el-form-item  label="工单类别" :label-width="formLabelWidth">
          <el-input  v-model="alert_list.order_class"  style="width: 400px" ></el-input>
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth">
          <el-input v-model="alert_list.state"  style="width: 400px" ></el-input>
        </el-form-item>
        <el-form-item label="级别" :label-width="formLabelWidth">
          <el-input v-model="alert_list.level"  style="width: 400px" ></el-input>
        </el-form-item>
        <el-form-item label="处理人" :label-width="formLabelWidth">
          <el-input v-model="alert_list.processor"  style="width: 400px" ></el-input>
        </el-form-item>
        <el-form-item label="提单人" :label-width="formLabelWidth">
          <el-input v-model="alert_list.creator"  style="width: 400px" ></el-input>
        </el-form-item>
        <el-form-item label="告警详情" :label-width="formLabelWidth">
          <el-input v-model="alert_list.description"  style="width: 400px" ></el-input>
        </el-form-item>
        <el-form-item label="告警原因" :label-width="formLabelWidth">
          <el-input v-model="alert_list.reason"  style="width: 400px" ></el-input>
        </el-form-item>
        <el-form-item label="告警时间" :label-width="formLabelWidth">
          <el-input v-model="alert_list.alert_time"  style="width: 400px" ></el-input>
        </el-form-item>
        <el-form-item label="解决时间" :label-width="formLabelWidth">
          <el-input v-model="alert_list.solution_time"  style="width: 400px" ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleEdit(alert_list)">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 执行命令 -->
    <el-dialog
      title="编辑用户"
      :visible.sync="dialogScriptVisible"
    >
      <el-form :model="script">
        <el-form-item label="请输入命令"  :label-width="100" >
          <el-input  v-model="script"  style="width: 400px;height: 200px" ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { alertAdd, alertDel, alertList,  alertUpdate, searchAlert } from '@/api/alert'
import { paginationListAlert } from '@/api/alert'
import JsonExcel from 'vue-json-excel'

export default {
  name: 'AlertManager',
  components: { Pagination,
    'download-excel': JsonExcel,
  },
  data(){
    return {
      downloadLoading: false,
      listQuery: {
        page: 1,
        limit: 20,
        alert_name: null,
      },
      dialogFormVisible: false,
      dialogScriptVisible: false,
      tableKey: 0,
      total: 0,
      listLoading: false,
      list: null,
      alert_list: {
        order_code: null,
        alert_name: null,
        order_class: null,
        state: null,
        level: null,
        processor: null,
        creator: null,
        alert_time: null,
        solution_time: null,
        description: null,
        reason: null,
      },
      formLabelWidth: '80px', //添加用户表框宽度
      dialogHostVisible: false,
      old_ip: null,
      script: null,
      bookType: 'xlsx',
      filename: '',
      autoWidth: true,
      json_fields: {
        "告警编号": "order_code",
        "告警名称": "alert_name",
        "告警状态": "state",
        "告警原因": "reason",
        "告警详情": "description",
        "告警类别": "order_class",
        "告警等级":"level",
        "处理者":"processor",
        "创建者":"creator",
        "告警时间":"alert_time",
        "解决时间":"solution_time",
      }
    }
  },

  created() {
    this.fatchList()
  },
  methods: {
    fatchList(){
      var vm = this
      this.listLoading = false
      paginationListAlert({
        "page": vm.listQuery.page,
        "limit": vm.listQuery.limit
      }).then(function(response){
        vm.list = response.data.alert_list,
          vm.total = response.data.total
        setTimeout(() =>{
          vm.listLoading = false
        },1.5*1000)
      })
    },
    getList() {
      this.listLoading = false
      alertList().then(response => {
        this.list = response.data
        this.listLoading = false
      })
    },
    handleFilter(){
      var vm = this
      this.listLoading = true
      searchAlert({
        "alert_name": vm.listQuery.alert_name
      }).then(function(response){
        vm.listLoading = false
        vm.list = response.data
        vm.listQuery.page = 1
      })
    },
    handleCreate(){
      this.dialogFormVisible = true
    },
    handleUpdate(row){
      this.alert_list = Object.assign({}, row) // copy obj
      this.dialogHostVisible = true
    },
    handleDelete(row){
      var vm = this
      alertDel({
        "alert_name": row.alert_name,
        "order_code": row.order_code
      }).then(function(resp) {
        if ( resp.code == 200 ) {
          vm.$message({
            message: '删除成功',
            type: 'success'
          });
          vm.getList()
        }
      }).catch(function(){
        vm.$message.error('删除失败');
      })
    },
    handleAdd(alert_list){
      var vm = this
      alertAdd(alert_list).then(function(response) {
        if ( response.code == 200 ) {
          vm.$message({
            message: '添加成功',
            type: 'success'
          });
          vm.getList()
        }
      }).catch(function() {
        vm.$message.error('添加失败');
      })
    },
    handleEdit(alert_list){
      var vm = this
      alertUpdate({
        "order_code": alert_list.order_code,
        "alert_name": alert_list.alert_name,
        "description": alert_list.description,
        "level": alert_list.level,
        "reason": alert_list.reason,
        "solution_time": alert_list.solution_time,
        "processor": alert_list.processor,
        "state": alert_list.state
      }).then(function(response) {
        if ( response.code == 200 ) {
          vm.$message({
            message: '修改成功',
            type: 'success'
          });
          vm.getList()
        }
      }).catch(function() {
        vm.$message.error('修改失败');
      })
    },
    handleDownload() {
      // axios({
      //   url: "http://139.9.58.140:9000/kubeconfig/k8sops.yml"
      // }).then(resp => {
      //   console.log(resp)
      //   }
      // )
      let a = document.createElement('a')
      a.href = process.env.VUE_APP_AGENT_URL
      //a.href = linuxAgentUrl
      a.click()
    },
    handleDownloadWindows(){
      let a = document.createElement('a')
      a.href = process.env.VUE_APP_WIN_AGENT_URL
      a.click()
    },
    finishDownload(){
      var vm = this
      vm.$message({
        message: "导出成功",
        type: 'success',
      })
    },
  }
}
</script>
