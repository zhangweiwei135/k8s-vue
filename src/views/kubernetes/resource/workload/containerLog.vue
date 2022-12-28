<template>
  <div>
    <div style="padding-left: 20px;padding-top:30px">
      容器: <el-select  @change="containerChange"  placeholder="选择容器"
                      v-model="selectedContainer">
      <el-option v-for="c in containers "
                 :label="c.name"
                 :value="c.name"/>
    </el-select>
    </div>
    <div ref="terminal" class="logs">

    </div>
  </div>
</template>
<script>

import { ws_url } from '@/api/pods'
import { Terminal } from 'xterm'

export default {
  name: 'containerLog',
  data(){
    return {
      logs: null,
      containers: null,
      selectedContainer: null,
      cluster_name: null,
      namespace: null,
      name: null,  //pod名称
      // logs: null,
      ws_url: null,
      rows: 40,
      cols: 100,
      term:null,//终端对象
      ws:null, //ws 客户端
      wsInited:false, //是否初始化完毕
    }
  },
  created() {
    this.containers = this.$route.params.containers
    this.cluster_name = this.$route.params.cluster_name
    this.namespace = this.$route.params.namespace
    this.name = this.$route.params.name
  },
  mounted() {
    //this.handleTerminal()
    this.initTerm()
  },
  methods: {
    containerChange(){
      this.initWS()

    },
    initTerm(){
      let term = new Terminal({
        rendererType: "canvas", //渲染类型
        rows: parseInt(this.rows), //行数
        cols: parseInt(this.cols), // 不指定行数，自动回车后光标从下一行开始
        convertEol: true, //启用时，光标将设置为下一行的开头
        disableStdin: false, //是否应禁用输入。
        cursorStyle: "underline", //光标样式
        cursorBlink: true, //光标闪烁
        theme: {
          foreground: "#7e9192", //字体
          background: "#002833", //背景色
          cursor: "help", //设置光标
          lineHeight: 16
        }
      });
      // 创建terminal实例
      term.open(this.$refs.terminal);
      // term.prompt = () => {
      //   term.writeln("\n\n Welcome. ");
      //   term.writeln("\n 正在初始化终端");
      // };
      // term.prompt();

      //回车触发
      // term.onData((key)=> {
      //   if(this.wsInited){
      //     this.ws.send(key)
      //   }
      // });
      this.term=term
    },
    initWS(){
      var vm = this
      this.ws_url = ws_url
      //var ws = new WebSocket("ws://localhost:8083/pod/terminal?namespace=default&name=web-96d5df5c8-9qbjb&cname=nginx&cluster_name=cluster3");
      var ws = new WebSocket(this.ws_url+"/kubernetes/workload/pod/log?namespace=" + this.namespace  +
      '&name=' + this.name + '&cname=' + this.selectedContainer +'&cluster_name=' + this.cluster_name)
      ws.onopen = function(){
        console.log("open");
      }
      ws.onmessage = res=>{
        this.wsInited=true //初始化完毕
        this.term.write(res.data) //调用term的打印方法打印后端返回的消息结果
        //this.logs = res.data
      }
      ws.onclose = function(){
        console.log("close");
        ws.close();
        //this.handleTerminal();
        // this.$router.back();
      }
      ws.onerror = function(){
        console.log();
      }
      this.ws=ws
    }

  }
}


</script>

<style>
.logs{
  overflow: auto;

  margin:10px auto;
  min-height: 200px;
  max-height: 400px;
  border: solid 1px black;
  background-color: #454545;
  padding: 10px;

  color:#27aa5e;
  line-height: 21pt;
  white-space: pre;
  width: 90%
}
</style>
