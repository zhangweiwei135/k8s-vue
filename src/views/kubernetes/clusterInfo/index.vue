<template>
  <div class="app-container">
    <div class="filter-container" >
      <el-button class="filter-item" :show-dialog.sync="dialogFormVisible" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate" >
        添加集群
      </el-button>
    </div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%">
      <el-table-column label="序号"  type="index" align="center" width="80" >
      </el-table-column>

      <el-table-column width="130px" align="center" label="集群名称">
        <template slot-scope="{row}">
          <span >{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column width="128px" align="center" label="集群版本">
        <template slot-scope="{row}">
          <span>{{ row.version }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" class-name="status-col" label="集群状态" width="140">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" class-name="status-col" label="节点数" width="140">
        <template slot-scope="{row}">
            {{ row.nodeNum }}
        </template>
      </el-table-column>

      <el-table-column width="200px" align="center" label="添加时间">
        <template slot-scope="{row}">
          <span>{{
              row.create_time
            }}</span>
        </template>
      </el-table-column>


      <el-table-column label="Actions" align="center" width="194" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button slot="reference" size="mini" type="danger" @click="handleDelete(row.name)" >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

<!--    添加进群-->
    <el-dialog
      title="添加集群"
      :visible.sync="dialogFormVisible"
    >
      <el-form :model="clusterInfo">
        <el-form-item label="集群名称" :label-width="formLabelWidth">
          <el-input  v-model="clusterInfo.name"  style="width: 400px" ></el-input>
        </el-form-item>
        <el-form-item  label="token" :label-width="formLabelWidth">
          <el-input placeholder="token" type="text" v-model="clusterInfo.config"  style="width: 400px" ></el-input>
        </el-form-item>

        <el-upload
          class="upload-demo"
          action="http://127.0.0.1:8083/kubernetes/clusterInfo/upload"
          :before-remove="beforeRemove"
          :on-success="handleSuccess"
          multiple
          :limit="3"
          :on-exceed="handleExceed"
          :file-list="fileList">
          <el-button  size="mini" type="primary">上传文件</el-button>
          <div slot="tip" class="el-upload__tip">kubeConf yaml或者json格式</div>
        </el-upload>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAdd(clusterInfo)">确 定</el-button>
      </div>
    </el-dialog>
    <!--   修改集群信息-->
    <el-dialog
      title="修改集群"
      :visible.sync="dialogClusterVisible"
    >
      <el-form :model="clusterInfo">
        <el-form-item label="集群名称" :label-width="formLabelWidth">
          <el-input  v-model="clusterInfo.name"  style="width: 400px" ></el-input>
        </el-form-item>
        <el-form-item  label="认证信息" :label-width="formLabelWidth">
          <el-input placeholder="kubeConfig"  v-model="clusterInfo.config"  style="width: 400px" ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleEdit(clusterInfo)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import { parseTime } from '@/utils'
import { k8sList } from '@/api/kubernetes'
import { k8sAdd } from '@/api/kubernetes'
import {k8sDel} from '@/api/kubernetes'
import {k8sUpdate} from '@/api/kubernetes'

export default {
  name: 'kubernetesInfo',
  filters: {
    parseTime: parseTime,
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      tableKey: 0,
      listLoading: false,
      dialogFormVisible: false,
      dialogClusterVisible: false,
      formLabelWidth: '80px', //添加用户表框宽度
      fileList: null,
      list: [{
        name: 'food.jpeg',
        url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
      }],
      clusterInfo: {
        name: null,
        config: null,
        filename: null,
      },
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList(){
      var vm = this
      this.listLoading = true
      k8sList().then(function(response){
        vm.list = response.data
        vm.listLoading = false
      })
    },
    handleCreate() {
      this.dialogFormVisible = true
    },
    handleAdd(clusterInfo){
      var vm = this
      k8sAdd({
        name: clusterInfo.name,
        config: clusterInfo.config,
        filename: clusterInfo.filename,
      }).then(function(response){
        if ( response.code == 200 ) {
          vm.$message({
            message: '添加成功',
            type: 'success'
          });
          vm.getList()
        }
        }).catch(function(){
          vm.$message.error("添加失败");
      })
    },
    handleUpdate(row){
      this.clusterInfo = Object.assign({}, row) // copy obj
      this.oldname = this.clusterInfo.name
      this.dialogClusterVisible = true
    },
    handleEdit(clusterInfo){
      var vm = this
      k8sUpdate({
        name: clusterInfo.name,
        oldname: vm.oldname,
        config: clusterInfo.config,
      }).then(function(response){
        if(response.code == 200){
          vm.$message({
            message: '修改成功',
            type: 'success'
          });
          vm.getList()
        }
      }).catch(function(){
        vm.$message.error("修改失败")
      })
    },
    handleDelete(name){
      var vm = this
      k8sDel({
        name: name,
      }).then(function(response){
        if(response.code == 200){
          vm.$message({
            message: "删除成功",
            type: 'success'
          })
          vm.getList()
        }
      }).catch(function(){
        vm.$message.error("删除失败")
      })
    },
    // handleInfo(row){
    //   console.log(row)
    //   //this.$router.push('workload')
    //   this.$router.push({
    //     name: 'deployment', params: {clustername: row.name}
    //    })
    //   //this.$route.push({path: 'http://127.0.0.1:8083/kubernetes/workload/deployment/list?name=' + row.name})
    // },
    handleSuccess(response, file, fileList){
      if(response.code == 200){
        this.clusterInfo.filename = file.name
        console.log(this.clusterInfo.filename)
      }
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件`);
    },
    beforeRemove(file,fileList) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    },
  }
}

</script>

<style>

.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}

</style>
