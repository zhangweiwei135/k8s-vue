<template>
<div class="app-container">
  <div class="filter-container" >
    <el-button class="filter-item"  style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate" >
      新建
    </el-button>

    <el-select v-model="selectedCluster" placeholder="请选择集群" @change="handleList" @visible-change="handleClusterInfo($event)"
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
    <el-table-column label="序号"  type="index" align="center" width="86" >
    </el-table-column>

    <el-table-column width="140px" align="center" label="名称">
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



    <el-table-column label="操作" align="center" width="320" class-name="small-padding fixed-width">
      <template slot-scope="{row,$index}">
        <el-button type="primary" size="mini" @click="handlePodNum(row)">
          副本数
        </el-button>
        <el-button slot="reference" size="mini" type="danger" @click="handleEdit(row)">yaml</el-button>
        <el-button slot="reference" size="mini" type="danger" @click="handleDelete(row)" >删除</el-button>
<!--        <el-button slot="reference" size="mini" type="danger" @click="handleEvent(row)" >事件</el-button>-->
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
import { k8sList, nsList } from '@/api/kubernetes'
import { DeleteSts, StsList, UpdateStsReplicas } from '@/api/statefulSet'


export default {
  name: 'statefulSet',
  data(){
    return {
      tableKey: 0,
      listLoading: false,
      formLabelWidth: '80px', //添加用户表框宽度
      list: null,
      replicas: null,
      dialogPodNumVisible: false,
      clusterInfo: null,
      selectedCluster: null,
      namespace: null,
      nslist: null,
      selectedns: null,
      tempInfo: {
        clusterName: null,
        namespace: null,
        stsName: null,
      },
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = false
      var vm = this
      if(this.selectedCluster){
        StsList({
          cluster_name: vm.selectedCluster,
          namespace: vm.selectedns,
        }).then(function(response){
          vm.list = response.data
          // vm.listLoading = false
        })
      }
    },

    handleList(){
      //console.log(val)
      var vm = this
      // console.log(vm.tempInfo.clusterName)
      vm.getList()
    },
    handleClusterInfo(val){
      var vm = this
      if(val){
        k8sList().then(function(response){
          vm.clusterInfo = response.data
        })
      }
    },
    //编辑yaml文件，跳转其它组件
    handleCreate(){
      var vm = this
      if(vm.selectedCluster){
        vm.$router.push({
          name: 'yamlEditor',
          params: {
            cluster_name: vm.selectedCluster,
          }
        })
      } else {
        vm.$message.info("请选择集群")
      }

    },
    handleEdit(row){},
    //删除
    handleDelete(row){
      var vm = this
      DeleteSts({
        "name": row.name,
        "cluster_name": vm.selectedCluster,
        "namespace": row.namespace,
      }).then(function(resp){
        if(resp.code == 200){
          vm.$message({
            message: "delete success",
            type: 'success'
          })
          vm.getList()
        }
      })
    },
    handlePods(row){
      var vm = this
      vm.$router.push({
        name: 'pod',
        params: {
          name: vm.selectedCluster,
          namespace: row.namespace,
          workloadname: row.name,
        }
      })
    },

    handleNsList(val){
      //console.log(val)
      var vm = this
      vm.tempInfo.namespace = val
      // console.log(vm.tempInfo.clusterName)
      if(vm.selectedCluster){
        StsList({
          cluster_name: vm.selectedCluster,
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
        if(vm.selectedCluster){
          nsList({
            cluster_name: vm.selectedCluster
          }).then(function(response){
            vm.nslist = response.data
          })
        }
      }
    },

    handlePodNum(row){
      var vm = this
      this.dialogPodNumVisible = true
      vm.tempInfo.stsName = row.name
      vm.tempInfo.namespace = row.namespace
    },

    handleReplicasNum(){
      var vm = this
      UpdateStsReplicas({
        name: vm.tempInfo.stsName,
        namespace: vm.tempInfo.namespace,
        cluster_name: vm.selectedCluster,
        replicas: vm.replicas
      }).then(function(response){
        if(response.code == 200){
          vm.$message({
            message: "修改成功",
            type: 'success'
          });
          vm.getList()
          vm.dialogPodNumVisible = false
        }
      })
    },
  }
}
</script>

<style scoped>

</style>
