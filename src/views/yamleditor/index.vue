<template>
  <div class="app-container">
  <div>
    <codemirror
      ref="cm"
      v-model="code"
      :options="cmOptions"
      @input="inputChange"
    ></codemirror>
  </div>
  <div>
    <el-select style='position: absolute;right:310px;top:5px;'  v-model="selected_resource" placeholder="请选择资源类型"
    >
      <el-option
        v-for="item in resource_kind"
        :value="item">
      </el-option>
    </el-select>
    <el-input style='position: absolute;width:150px;right:110px;top:5px;' v-model="tempInfo.namespace" placeholder="请输入命名空间"></el-input>
    <el-button style='position: absolute;height:40px;right:10px;top:5px;' type="primary" size="mini" @click="handleCode">
      提交代码
    </el-button>
  </div>
  </div>
</template>

<script>
// 全局引入vue-codemirror
import {codemirror} from 'vue-codemirror';
// 引入css文件
import 'codemirror/lib/codemirror.css'
// 引入主题 可以从 codemirror/theme/ 下引入多个
import 'codemirror/theme/idea.css'
// 引入语言模式 可以从 codemirror/mode/ 下引入多个
//import 'codemirror/mode/sql/sql.js';
import 'codemirror/mode/yaml/yaml.js';
import {codeEdit} from '@/api/pods'


export default {
  name: 'Simple',
  components: {codemirror},
  data() {
    return {
      filename: "",
      code: '',
      selected_resource: null,
      resource_kind: [
        "deployment",
        "statefulSet",
        "daemonSet",
        "service",
        "ingress",
        "configMap",
        "secret"
      ],
      cmOptions: {
        // 语言及语法模式
        mode: 'text/x-yaml',
        // 主题
        theme: 'idea',
        // 显示函数
        line: true,
        lineNumbers: true,
        // 软换行
        lineWrapping: true,
        // tab宽度
        tabSize: 4,
      },
      tempInfo: {
        cluster_name: null,
        namespace: null
      }
    }
  },
  created() {
    this.tempInfo.cluster_name = this.$route.params.cluster_name
    this.tempInfo.namespace = this.$route.params.namespace
  },
  methods: {
    inputChange(content) {
      this.$nextTick(() => {
        console.log("code:" + this.code);
        console.log("content:" + content)
      });
    },
    handleCode(){
      var vm = this
      if(vm.selected_resource){
        codeEdit({
          "code": vm.code,
          "cluster_name": vm.tempInfo.cluster_name,
          "namespace": vm.tempInfo.namespace,
          "resource_kind": vm.selected_resource,
        }).then(function(resp){
          if(resp.code == 200){
            vm.$message({
              message: "deploy 部署成功",
              type: 'success'
            })
          }
        })
      } else {
        vm.$message.warning("请选择需要部署的资源类型")
      }

    },
  },
}
</script>
