<template>
  <div class="app-container">
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
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column width="128px" align="center" label="运行状态">
        <template slot-scope="{row}">
          <span>{{ row.status }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" class-name="status-col" label="节点IP" width="140">
        <template slot-scope="{row}">
          {{ row.host_ip }}
        </template>
      </el-table-column>

      <el-table-column align="center" class-name="status-col" label="命名空间" width="140">
        <template slot-scope="{row}">
          {{ row.namespace }}
        </template>
      </el-table-column>

      <el-table-column align="center" class-name="status-col" label="PodIP" width="140">
        <template slot-scope="{row}">
          {{ row.pod_ip }}
        </template>
      </el-table-column>

      <!--      <el-table-column width="200px" align="center" label="添加时间">-->
      <!--        <template slot-scope="{row}">-->
      <!--          <span>{{-->
      <!--              row.create_time-->
      <!--            }}</span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column label="Actions" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleTerminal(row)" >
            远程登陆
          </el-button>
          <el-button type="primary" size="mini" @click="handleLog(row)" >
            查看日志
          </el-button>
        </template>
      </el-table-column>

    </el-table>


<!--  <el-dialog-->
<!--    title="terminal"-->
<!--    :visible.sync="dialogTerminalVisible"-->
<!--  >-->
<!--    <div ref="terminal">hello Terminal</div>-->
<!--  </el-dialog>-->
  </div>
</template>

<script>

import {podsList} from '@/api/pods'

// 引入css
// import "xterm/dist/xterm.css";
// import "xterm/dist/addons/fullscreen/fullscreen.css";
import {Terminal} from 'xterm'
// import {FitAddon} from 'xterm-addon-fit'
// import {AttachAddon} from 'xterm-addon-attach'
// // 自适应插件
// import * as fit from "xterm/lib/addons/fit/fit";
// // 全屏插件
// import * as fullscreen from "xterm/lib/addons/fullscreen/fullscreen";
// // web链接插件
// import * as webLinks from "xterm/lib/addons/webLinks/webLinks";
// // websocket插件
// import * as attach from "xterm/lib/addons/attach/attach";

export default {
  name: 'pod',
  data(){
    return {
      tableKey: 0,
      listLoading: false,
      formLabelWidth: '80px', //添加用户表框宽度
      dialogTerminalVisible: false,
      list: null,
      tempInfo: {
        namespace: null,
        workloadname: null,
        cluster_name: null,
        host_ip: null,
        cname: null
      },
      socket: null
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList(){
      var vm = this
      podsList({
        namespace: vm.$route.params.namespace,
        workloadname: vm.$route.params.workloadname,
        name: vm.$route.params.name
      }).then(function(response){
        vm.list = response.data
        vm.tempInfo.cluster_name = vm.$route.params.name
        vm.tempInfo.namespace = vm.$route.params.namespace
      })
    },
    handleTerminal(row){
      //this.$router.push('terminal')
      var vm = this
      this.$router.push({
        path: '/pod/terminal',
        name: 'terminal',
        params: {
          namespace: vm.tempInfo.namespace,
          cluster_name: vm.tempInfo.cluster_name,
          pod_name: row.name,
        }
      })

    },
    handleLog(row){
      var vm = this
      this.$router.push({
        name: 'containerLog',
        params: {
          containers: row.pod_containers,
          cluster_name: vm.tempInfo.cluster_name,
          namespace: row.namespace,
          name: row.name
        }
      })
    },
  }
}
</script>


