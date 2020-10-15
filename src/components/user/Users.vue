<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
       <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
       <el-breadcrumb-item>用户管理</el-breadcrumb-item>
       <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
     <!-- 卡片区域 -->
    <el-card class="box-card">
      <!-- 输入框区域 -->
      <el-row :gutter="20">
        <el-col :span="10"><div>        
            <el-input placeholder="请输入内容">
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </div></el-col>
          <el-col :span="14"><div>
            <el-button type="primary">添加用户</el-button>
          </div></el-col>         
      </el-row>
      <!-- 详细信息区域 -->
      
    </el-card>
    <el-card>
      <el-table :data="userData" stripe border style="width: 100%">
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template >
            <el-tooltip content="编辑" placement="top">
              <el-button type="primary" size="mini" icon="el-icon-edit"></el-button>          
            </el-tooltip>
            <el-tooltip content="分配角色" placement="top">
              <el-button type="warning" size="mini" icon="el-icon-bangzhu"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button type="danger" size="mini" icon="el-icon-delete"></el-button>
            </el-tooltip>
            
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
   data(){
    return {
      tableData: [{
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          }, {
            date: '2016-05-04',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1517 弄'
          }, {
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄'
          }, {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
          }],
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      userData:[],
      total:0
    }
  },
    created(){
      this.getInfoData()
    },
   methods:{
        async getInfoData(){
        const { data:res } = await this.$http.get('users', {
        params: this.queryInfo
          })
        if(res.meta.status!==200){
           return this.$message.error('获取失败')
        }
        this.userData=res.data.users
        this.total=res.data.total
        console.log(this.userData);
      }
    },
}
</script>
<style lang="less" scoped>
    .el-breadcrumb{
      margin-bottom: 20px;
    }
    .box-card{
      box-shadow: darkgrey 10px 10px 30px 5px !important;
      .input-with-select{
        width: 500px;
      }
    }
</style>