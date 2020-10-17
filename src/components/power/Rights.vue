<template>
    <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
       <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
       <el-breadcrumb-item>权限管理</el-breadcrumb-item>
       <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 主体卡片区域 -->
    <el-card>
      <el-table :data="allData" style="width: 100%" border>
        <el-table-column
          type="index">
        </el-table-column>
        <el-table-column
          prop="authName"
          label="权限名称">
        </el-table-column>
         <el-table-column
          prop="path"
          label="路径">
        </el-table-column>
         <el-table-column prop="level" label="权限等级">
            <template slot-scope="scope"> 
                <el-tag v-if="scope.row.level === '0' ">一级权限</el-tag>
                <el-tag v-if="scope.row.level === '1' " type="success">二级权限</el-tag>
                <el-tag v-if="scope.row.level === '2' " type="warning">三级权限</el-tag>
            </template>
        </el-table-column>
      </el-table>
    </el-card>
    </div>
</template>
<script>
export default {
  //数据
    data(){
      return{
        //所有权限数据
        allData:[],
      }
    },
  //生命周期函数
  created(){
    this.getAllData()
  },
  //方法事件
  methods: {
    async getAllData(){
    const {data:res} = await this.$http.get('rights/list')
    if(res.meta.status!==200){
      return this.$message.error('获取权限列表失败')
    }
    this.$message.success('获取权限列表成功')
    this.allData=res.data
    }   
  },
}
</script>
<style lang="less" scoped>
    .el-breadcrumb{
      margin-bottom: 15px;
    }
</style>