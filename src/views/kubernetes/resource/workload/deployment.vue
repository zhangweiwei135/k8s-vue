<template>
  <div class="app-container">
    <div class="filter-container" >
      <el-button class="filter-item"  style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate" >
        新建
      </el-button>

      <el-select v-model="sortEnd" placeholder="请选择集群" @change="handleList($event)" @visible-change="handleClusterInfo($event)"
      >
        <el-option
          v-for="item in clusterInfo"
          :value="item.name">
        </el-option>
      </el-select>
      <el-select v-model="selectedns" placeholder="请选择命名空间" @change="handleNsList($event)" @visible-change="handleNsInfo($event)"
      >
        <el-option
          v-for="item in nslist"
          :value="item">
        </el-option>
      </el-select>

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

      <el-table-column width="130px" align="center" label="名称">
        <template slot-scope="{row}">
          <span @click="handlePods(row)" >{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column width="202px" align="center" label="标签">
        <template slot-scope="{row}">
          <span>{{ row.labels }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" class-name="status-col" label="Selector" width="140">
        <template slot-scope="{row}">
            {{ row.selectpod }}
        </template>
      </el-table-column>

      <el-table-column align="center" class-name="status-col" label="运行/期望" width="140">
        <template slot-scope="{row}">
          {{ row.expected }}
        </template>
      </el-table-column>

<!--      <el-table-column width="200px" align="center" label="添加时间">-->
<!--        <template slot-scope="{row}">-->
<!--          <span>{{-->
<!--              row.create_time-->
<!--            }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->


      <el-table-column label="操作" align="center" width="320" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handlePodNum(row)">
            副本数
          </el-button>
          <el-button slot="reference" size="mini" type="danger" @click="handleEdit(row)">yaml</el-button>
          <el-button slot="reference" size="mini" type="danger" @click="handleDelete(row)" >删除</el-button>
          <el-button slot="reference" size="mini" type="danger" @click="handleEvent(row)" >事件</el-button>
        </template>
      </el-table-column>
    </el-table>


      <el-dialog
        title="修改pod数量"
        :visible.sync="dialogPodNumVisible"
      >
        <el-input v-model="replicas" placeholder="请输入数量" @keyup.enter.native="handleReplicasNum"></el-input>
      </el-dialog>


  </div>
</template>


<script>

import {deployList} from '@/api/deployment'
import { k8sList } from '@/api/kubernetes'
import {UpdateDeployReplicas} from '@/api/deployment'
import {DeleteDeploy} from '@/api/deployment'
import {nsList} from '@/api/kubernetes'

export default {
  name: 'workloadDeployment',
  data(){
    return {
      tableKey: 0,
      listLoading: false,
      formLabelWidth: '80px', //添加用户表框宽度
      dialogPodNumVisible: false,
      list: null,
      nslist: null,
      replicas: null,
      tempInfo: {
        clusterName: null,
        namespace: null,
        deployName: null,
      },
      clusterInfo: null,
      sortEnd: "",
      selectedns: null,
    }
  },
  created() {
    this.getList(this.tempInfo)
  },
  methods: {
    getList(val) {
      this.listLoading = false
      console.log("hello")
      var vm = this
      if(val.clusterName){
        deployList({
          name: val.clusterName
        }).then(function(response){
          vm.list = response.data
         // vm.listLoading = false
        })
      }
    },

    handleNsList(val){
      //console.log(val)
      var vm = this
      vm.tempInfo.namespace = val
      // console.log(vm.tempInfo.clusterName)
      if(vm.tempInfo.clusterName){
        deployList({
          name: vm.tempInfo.clusterName,
          namespace: val,
        }).then(function(response){
          vm.list = response.data
          // vm.listLoading = false
        })
      }
    },


    handleNsInfo(val){
      var vm = this
      if(val){
        if(vm.tempInfo.clusterName){
          nsList({
            cluster_name: vm.tempInfo.clusterName
          }).then(function(response){
            vm.nslist = response.data
          })
        }
      }
    },

    handleClusterInfo(val){
      var vm = this
      if(val){
        k8sList().then(function(response){
          vm.clusterInfo = response.data
        })
      }
    },

    handlePods(row){
      var vm = this
      console.log(row)
      console.log(vm.tempInfo.clusterName)
      vm.$router.push({
        name: 'pod',
        params: {
          name: vm.tempInfo.clusterName,
          namespace: row.namespace,
          workloadname: row.name,
          host_ip: row.host_ip
        }
      })
    },
    handleList(val){
      //console.log(val)
      var vm = this
      vm.tempInfo.clusterName = val
     // console.log(vm.tempInfo.clusterName)
      vm.getList(vm.tempInfo)
    },

    //新建deployment
    handleEdit(row){},
    //修改pod数量
    handleReplicasNum(){
      var vm = this
      UpdateDeployReplicas({
        name: vm.tempInfo.deployName,
        namespace: vm.tempInfo.namespace,
        cluster_name: vm.tempInfo.clusterName,
        replicas: vm.replicas
      }).then(function(response){
        if(response.code == 200){
          vm.$message({
            message: "修改成功",
            type: 'success'
          });
          vm.getList(vm.tempInfo.clusterName)
          vm.dialogPodNumVisible = false
        }
      })
    },
    handlePodNum(row){
      var vm = this
      console.log(vm.tempInfo.clusterName,vm.replicas)
      this.dialogPodNumVisible = true
      vm.tempInfo.deployName = row.name
      vm.tempInfo.namespace = row.namespace
    },
    //编辑yaml文件，跳转其它组件
    handleCreate(){
      var vm = this
      vm.$router.push({
        name: 'yamlEditor',
        params: {
          cluster_name: vm.tempInfo.clusterName,
        }
      })
    },
    //删除
    handleDelete(row){
      var vm = this
      DeleteDeploy({
        "name": row.name,
        "cluster_name": vm.tempInfo.clusterName,
        "namespace": row.namespace,
      }).then(function(resp){
        if(resp.code == 200){
          vm.$message({
            message: "delete success",
            type: 'success'
          })
          vm.getList(vm.tempInfo.clusterName)
        }
      })
    },
    //事件
    handleEvent(row){},
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
