<template>
  <div ref="terminal" style="min-height: 500px;
    padding: 10px"></div>
</template>

<script>

import {Terminal} from 'xterm'


export default {
  name: 'terminal',
  data(){
    return {
      rows: 40,
      cols: 100,
      term:null,//终端对象
      ws:null, //ws 客户端
      wsInited:false, //是否初始化完毕
      //url: null,
      ws_url: null
    }
  },
  mounted() {
    //this.handleTerminal()
    this.initTerm()
    this.initWS()
  },
  methods: {
    handleTerminal(){
      this.$router.back();
      // let term = new Terminal()
      // term.open(this.$refs.terminal)
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
      term.prompt = () => {
        term.writeln("\n\n Welcome. ");
        term.writeln("\n 正在初始化终端");
      };
      term.prompt();

      //回车触发
      term.onData((key)=> {
        if(this.wsInited){
          this.ws.send(key)
        }
      });
      this.term=term
    },
    //初始化 websocket 客户端
    initWS(){
      var vm = this
      this.ws_url = process.env.VUE_APP_WS_URL
      console.log(this.ws_url)
      //var ws = new WebSocket("ws://localhost:8083/pod/terminal?namespace=default&name=web-96d5df5c8-9qbjb&cname=nginx&cluster_name=cluster3");
      var ws = new WebSocket(this.ws_url+"/pod/terminal?namespace="+this.$route.params.namespace+"&name="+
      this.$route.params.pod_name+"&cluster_name="+this.$route.params.cluster_name)
      ws.onopen = function(){
        console.log("open");
      }
      ws.onmessage = res=>{
        this.wsInited=true //初始化完毕
        this.term.write(res.data) //调用term的打印方法打印后端返回的消息结果
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

<style scoped>

</style>
