<template>
  <div class="app-container">
    <div class="filter-container">

      <el-input v-model="listQuery.name" placeholder="用户名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button  class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>

      <el-button class="filter-item" :show-dialog.sync="dialogFormVisible" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate" >
        添加用户
      </el-button>
      <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        导出用户
      </el-button>

    </div>

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
      <el-table-column label="用户ID" width="90px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.uid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名" align="center" width="130px">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.role }}</span>
        </template>
      </el-table-column>
      <el-table-column label="部门" width="130px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.department }}</span>
        </template>
      </el-table-column>
      <el-table-column label="电话" align="center" width="140px">
        <template slot-scope="{row}">
          <span>{{ row.mobile }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邮件" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.mail }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Actions" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button slot="reference" size="mini" type="danger" @click="handleDelete(row.name)" >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="fatchList" />

    <!-- 新增用户 -->
    <el-dialog
      title="添加用户"
      :visible.sync="dialogFormVisible"
    >
      <el-form :model="ulist">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input  v-model="ulist.name"  style="width: 400px" ></el-input>
        </el-form-item>
        <el-form-item  label="密码" :label-width="formLabelWidth">
          <el-input type="password" v-model="ulist.password"  style="width: 400px" ></el-input>
        </el-form-item>
        <el-form-item label="角色" :label-width="formLabelWidth">
          <el-input v-model="ulist.role"  style="width: 400px" ></el-input>
        </el-form-item>
        <el-form-item label="部门" :label-width="formLabelWidth">
          <el-input v-model="ulist.department"  style="width: 400px" ></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="ulist.mobile"  style="width: 400px" ></el-input>
        </el-form-item>
        <el-form-item label="邮件" :label-width="formLabelWidth">
          <el-input v-model="ulist.mail"  style="width: 400px" ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAdd(ulist)">确 定</el-button>
      </div>
    </el-dialog>



    <el-dialog
      title="编辑用户"
      :visible.sync="dialogUserVisible"
    >
      <el-form :model="ulist">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input  v-model="ulist.name"  style="width: 400px" ></el-input>
        </el-form-item>
        <el-form-item  label="密码" :label-width="formLabelWidth">
          <el-input type="password" v-model="ulist.password"  style="width: 400px" ></el-input>
        </el-form-item>
        <el-form-item label="角色" :label-width="formLabelWidth">
          <el-input v-model="ulist.role"  style="width: 400px" ></el-input>
        </el-form-item>
        <el-form-item label="部门" :label-width="formLabelWidth">
          <el-input v-model="ulist.department"  style="width: 400px" ></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="ulist.mobile"  style="width: 400px" ></el-input>
        </el-form-item>
        <el-form-item label="邮件" :label-width="formLabelWidth">
          <el-input v-model="ulist.mail"  style="width: 400px" ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleEdit(ulist)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import Pagination from '@/components/Pagination' // secondary package based on el-pagination

//导入获取用户信息
import { userList } from '@/api/setting'
import { userDel } from '@/api/setting'
import { userAdd } from '@/api/setting'
import { userUpdate } from '@/api/setting'
import { paginationList } from '@/api/setting'
import { parseTime } from '@/utils'
import { searchUser } from '@/api/setting'

export default {
  name: 'ComplexTable',
  components: { Pagination },
  data() {
    return {
      downloadLoading: false,
      tableKey: 0,
      list: null,
      searchName: null,
      ulist: {
        name: null,
        password: null,
        role: null,
        mail: null,
        mobile: null,
        department: null
      },
      formLabelWidth: '80px', //添加用户表框宽度
      dialogFormVisible: false,
      dialogUserVisible: false,
      oldname: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined,
      },
    }
  },
  created() {
    //this.getList()
    this.fatchList()
  },
  methods: {
    fatchList(){
      var vm = this
      this.listLoading = true
      paginationList({
        "page": vm.listQuery.page,
        "limit": vm.listQuery.limit
      }).then(function(response){
        vm.list = response.data.userlist,
        vm.total = response.data.total
        setTimeout(() =>{
          vm.listLoading = false
        },1.5*1000)
      })
    },
    getList() {
      this.listLoading = true
      userList().then(response => {
        this.list = response.data
        this.listLoading = false
      })
    },
    handleFilter() {
      var vm = this
      this.listLoading = true
      searchUser({
        "name": vm.listQuery.name
      }).then(function(response){
        vm.listLoading = false
        vm.list = response.data
        this.listQuery.page = 1
      })
    },
    handleDelete(name) {
      var vm = this
      userDel({
        "username": name
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
    handleAdd(ulist){
      var vm = this
      userAdd(ulist).then(function(response) {
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
    handleCreate() {
      this.dialogFormVisible = true
    },
    handleUpdate(row) {
      this.ulist = Object.assign({}, row) // copy obj
      this.oldname = this.ulist.name
      this.dialogUserVisible = true
    },
    handleEdit(ulist){
      var vm = this
      userUpdate({
        "name": ulist.name,
        "password": ulist.password,
        "oldname": vm.oldname,
        "mobile": ulist.mobile,
        "mail": ulist.mail,
        "department": ulist.department,
        "role": ulist.role
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
      var vm = this
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = [ '用户ID', '用户名', '角色', '部门','电话','邮件']
        const filterVal = ['uid', 'name', 'role', 'department','mobile','mail']
        const list = vm.list
        const data = vm.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '用户信息',
          autoWidth: true,
          bookType: "xlsx"
        })
        vm.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>
