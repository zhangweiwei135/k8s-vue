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
          <!--          跳转pod信息-->
          <span >{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column width="202px" align="center" label="标签">
        <template slot-scope="{row}">
          <span>{{ row.labels }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" class-name="status-col" label="type" width="140">
        <template slot-scope="{row}">
          {{ row.svc_type }}
        </template>
      </el-table-column>

      <el-table-column align="center" class-name="status-col" label="ip" width="140">
        <template slot-scope="{row}">
          {{ row.ip }}
        </template>
      </el-table-column>



      <el-table-column label="操作" align="center" width="320" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button slot="reference" size="mini" type="danger" @click="handleEdit(row)">yaml</el-button>
          <el-button slot="reference" size="mini" type="danger" @click="handleDelete(row)" >删除</el-button>
          <!--        <el-button slot="reference" size="mini" type="danger" @click="handleEvent(row)" >事件</el-button>-->
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { k8sList, nsList } from '@/api/kubernetes'
import { DeleteSvc, SvcList } from '@/api/service'

export default {
  name: 'service',
  data(){
    return{
      tableKey: 0,
      listLoading: false,
      formLabelWidth: '80px', //添加用户表框宽度
      list: null,
      clusterInfo: null,
      selectedCluster: null,
      namespace: null,
      selectedns: null,
      nslist: null,
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList(){
      this.listLoading = false
      console.log(this.selectedCluster)
      var vm = this
      if(this.selectedCluster){
        SvcList({
          cluster_name: vm.selectedCluster,
          namespace: vm.selectedns,
        }).then(function(response){
          vm.list = response.data
          // vm.listLoading = false
        })
      }
    },

    handleList(){
      var vm = this
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
    handleNsList(val){
      var vm = this
      if(vm.selectedCluster){
        SvcList({
          cluster_name: vm.selectedCluster,
          namespace: val,
        }).then(function(response){
          vm.list = response.data
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
    handleDelete(row){
      var vm = this
      DeleteSvc({
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
    handleEdit(row){},

  }
}
</script>

<style scoped>

</style>
