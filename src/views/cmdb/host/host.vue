<template>
  <div class="app-container">
    <div class="filter-container">

      <el-input v-model="listQuery.host_ip" placeholder="主机IP" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button  class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>

      <el-button class="filter-item" :show-dialog.sync="dialogFormVisible" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate" >
        添加主机
      </el-button>
      <el-button style="margin-bottom:20px" type="primary" icon="el-icon-document" @click="handleDownload">
        下载linux agent
      </el-button>
      <el-button style="margin-bottom:20px" type="primary" icon="el-icon-document" @click="handleDownloadWindows">
        下载windows agent
      </el-button>
    </div>
    <download-excel
      class = "filter-container"
      :fields = "json_fields"
      :data="list"
      :before-finish = "finishDownload"
      name = "主机信息表.xls"
      type="xls">
      <el-button>导出主机</el-button>
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
      <el-table-column label="主机IP" width="160px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.host_ip }}</span>
        </template>
      </el-table-column>
      <el-table-column label="主机名" align="center" width="160px">
        <template slot-scope="{row}">
          <span>{{ row.host_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="运行状态" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.status }}</span>
        </template>
      </el-table-column>
      <el-table-column label="系统类型" width="130px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.os_type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="cpu" align="center" width="50px">
        <template slot-scope="{row}">
          <span>{{ row.cpu }}</span>
        </template>
      </el-table-column>
      <el-table-column label="内存" align="center" width="50px">
        <template slot-scope="{row}">
          <span>{{ row.mem }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Actions" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">编辑</el-button>
          <el-button slot="reference" size="mini" type="danger" @click="handleDelete(row.host_ip)" >删除</el-button>
          <el-button type="primary" size="mini" @click="handleScript(row)">script</el-button>
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
      <el-form :model="host_list">
        <el-form-item label="主机IP" :label-width="formLabelWidth">
          <el-input  v-model="host_list.host_ip"  style="width: 400px" ></el-input>
        </el-form-item>
        <el-form-item  label="主机名" :label-width="formLabelWidth">
          <el-input  v-model="host_list.host_name"  style="width: 400px" ></el-input>
        </el-form-item>
        <el-form-item label="系统类型" :label-width="formLabelWidth">
          <el-input v-model="host_list.os_type"  style="width: 400px" ></el-input>
        </el-form-item>
        <el-form-item label="系统版本" :label-width="formLabelWidth">
          <el-input v-model="host_list.os_name"  style="width: 400px" ></el-input>
        </el-form-item>
        <el-form-item label="cpu" :label-width="formLabelWidth">
          <el-input v-model="host_list.cpu"  style="width: 400px" ></el-input>
        </el-form-item>
        <el-form-item label="内存" :label-width="formLabelWidth">
          <el-input v-model="host_list.mem"  style="width: 400px" ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAdd(host_list)">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑主机 -->
    <el-dialog
      title="编辑用户"
      :visible.sync="dialogHostVisible"
    >
      <el-form :model="host_list">
        <el-form-item label="主机IP" :label-width="formLabelWidth">
          <el-input  v-model="host_list.host_ip"  style="width: 400px" ></el-input>
        </el-form-item>
        <el-form-item  label="主机名" :label-width="formLabelWidth">
          <el-input  v-model="host_list.host_name"  style="width: 400px" ></el-input>
        </el-form-item>
        <el-form-item label="系统类型" :label-width="formLabelWidth">
          <el-input v-model="host_list.os_type"  style="width: 400px" ></el-input>
        </el-form-item>
        <el-form-item label="系统版本" :label-width="formLabelWidth">
          <el-input v-model="host_list.os_name"  style="width: 400px" ></el-input>
        </el-form-item>
        <el-form-item label="cpu" :label-width="formLabelWidth">
          <el-input v-model="host_list.cpu"  style="width: 400px" ></el-input>
        </el-form-item>
        <el-form-item label="内存" :label-width="formLabelWidth">
          <el-input v-model="host_list.mem"  style="width: 400px" ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleEdit(host_list)">确 定</el-button>
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
        <el-button type="primary" @click="handleEditScript()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { hostAdd, hostDel, hostList, hostScript, hostUpdate, searchHost } from '@/api/host'
import { paginationListHost } from '@/api/host'
import JsonExcel from 'vue-json-excel'

export default {
  name: 'HostManager',
  components: { Pagination,
      'download-excel': JsonExcel,
  },
  data(){
    return {
      downloadLoading: false,
      listQuery: {
        page: 1,
        limit: 20,
        host_ip: null,
      },
      dialogFormVisible: false,
      dialogScriptVisible: false,
      tableKey: 0,
      total: 0,
      listLoading: false,
      list: null,
      host_list: {
        host_ip: null,
        host_name: null,
        status: null,
        cpu: null,
        mem: null,
        os_name: null,
        os_type: null,
      },
      formLabelWidth: '80px', //添加用户表框宽度
      dialogHostVisible: false,
      old_ip: null,
      script: null,
      bookType: 'xlsx',
      filename: '',
      autoWidth: true,
      json_fields: {
        "主机IP": "host_ip",
        "主机名": "host_name",
        "运行状态": "status",
        "cpu": "cpu",
        "内存": "mem",
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
      paginationListHost({
        "page": vm.listQuery.page,
        "limit": vm.listQuery.limit
      }).then(function(response){
        vm.list = response.data.host_list,
          vm.total = response.data.total
        setTimeout(() =>{
          vm.listLoading = false
        },1.5*1000)
      })
    },
    getList() {
      this.listLoading = false
      hostList().then(response => {
        this.list = response.data
        this.listLoading = false
      })
    },
    handleFilter(){
      var vm = this
      this.listLoading = true
      searchHost({
        "host_ip": vm.listQuery.host_ip
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
      this.host_list = Object.assign({}, row) // copy obj
      this.old_ip = this.host_list.host_ip
      this.dialogHostVisible = true
    },
    handleDelete(host_ip){
      var vm = this
      hostDel({
        "host_ip": host_ip
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
    handleAdd(host_list){
      var vm = this
      hostAdd(host_list).then(function(response) {
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
    handleEdit(host_list){
      var vm = this
      hostUpdate({
        "host_ip": host_list.host_ip,
        "host_name": host_list.host_name,
        "old_ip": vm.old_ip,
        "os_type": host_list.os_type,
        "os_name": host_list.os_name,
        "cpu": host_list.cpu,
        "mem": host_list.mem
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
    handleScript(row){
      this.host_list = Object.assign({}, row) // copy obj
      this.old_ip = this.host_list.host_ip
      this.dialogScriptVisible = true
    },
    handleEditScript(){
      var vm=this
      hostScript({"script": vm.script,"old_ip":vm.old_ip}).then(
        function(resp) {
          if ( resp.code == 200 ) {
            vm.$message({
              message: '执行成功',
              type: 'success'
            });
            vm.getList()
          }
        }
      ).catch(function() {
        vm.$message.error('执行失败');
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
