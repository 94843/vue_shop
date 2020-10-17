<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
       <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
       <el-breadcrumb-item>权限管理</el-breadcrumb-item>
       <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="roleRole = true">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->
      <el-table :data="rolelist" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row :class="['bdbottom',i1 == 0 ? 'bdtop' : '','vcenter']" v-for="(item1,i1) in scope.row.children" :key="item1.id">
              <!-- 一级权限 -->
              <el-col :span="5" >
                <el-tag>{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级和三级 -->
              <el-col :span="19"> 
                <el-row :class="[i2 == 0 ? '' : 'bdtop','vcenter']" v-for="(item2,i2) in item1.children" :key="item2.id">
                  <!-- 二级菜单 -->
                  <el-col :span="5">
                    <el-tag type="success">{{item2.authName}}</el-tag>
                     <i class="el-icon-caret-right"></i>                
                  </el-col>
                  <!-- 三级菜单 -->
                  <el-col :span="19">
                    <el-tag type="warning" v-for="item3 in item2.children" :key="item3.id" style="margin-right:10px"   closable @close="removeRightId(scope.row,item3.id)">{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- index索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>       
        <el-table-column label="操作">
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" @click="editRoleInfo(scope.row.id)">编辑</el-button>
              <el-button type="danger" icon="el-icon-delete" @click="delRole(scope.row.id)">删除</el-button>
              <el-button type="warning" icon="el-icon-bangzhu">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
      <!-- 添加角色对话框 -->
      <el-dialog title="添加角色" :visible.sync="roleRole" @close="addRole">
        <el-form :model="roleData" label-width="130px" ref="roleUserRef">
          <el-form-item label="请输入角色昵称" prop="roleName">
            <el-input v-model="roleData.roleName"></el-input>
          </el-form-item>
          <el-form-item label="请输入角色描述" prop="roleDesc">
            <el-input v-model="roleData.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="roleRole = false">取 消</el-button>
          <el-button type="primary" @click="addNewRole">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 编辑角色对话框 -->
      <el-dialog title="编辑角色" :visible.sync="editRole" >
        <el-form :model="editRoleData" label-width="130px" ref="roleUserRef">
          <el-form-item label="角色昵称" prop="roleName">
            <el-input v-model="editRoleData.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="editRoleData.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editRole = false">取 消</el-button>
          <el-button type="primary" @click="confirmEdit(editRoleData.roleId)">确 定</el-button>
        </div>
      </el-dialog>
  </div>
</template>
<script>
export default {
  //数据
    data(){
      return{
        //所有角色列表数据
        rolelist:[],
        //添加对话框是否显示
        roleRole:false,
        //编辑对话框是否显示
        editRole:false,
        //添加新角色的数据源
        roleData:
          {
            roleName:'',
            roleDesc:''
          },
        //编辑角色的数据源
        editRoleData:{
          roleId:'',
          roleName:'',
          roleDesc:''
        }       
      }
    },
    //生命周期函数
    created(){
      this.getRoleList()
    },
    methods:{
      //获取数据并渲染页面
      async getRoleList(){
        const {data:res} = await this.$http.get('roles')
        this.rolelist=res.data
        console.log(res.data);
      },
      //删除三级标签
      async removeRightId(val,id){
        // console.log(1);
        const confirmRights = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
        // console.log(confirmRights);
        if(confirmRights !== 'confirm'){
          return this.$message.info('取消了删除')
        }
        const {data:res} = await this.$http.delete(`roles/${val.id}/rights/${id}`)
        if(res.meta.status!==200){
          return this.$message.error('删除失败')
        }
        //重新渲染页面的话展开列会自动关闭
        //为当前的角色信息重新赋值一下权限即可
        val.children = res.data
        this.$message.info('删除成功')
      },
      //添加角色对话框关闭后清空内容
      addRole(){
        this.$refs.roleUserRef.resetFields()
      },
      //点击确定发送请求添加新角色
      addNewRole(){
        this.$refs.roleUserRef.validate(async valid=>{
          if(!valid) return 
          //发送请求
          const {data:res} =await this.$http.post('roles',this.roleData)
          if(res.meta.status!==201){
            this.$message.error('添加失败')
            return
          }else{
            this.$message.success('添加成功')
            this.roleRole=false
            this.getRoleList()
          }         
        })
      },
      //删除角色
      async delRole(delid){
        const delcomfrim = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
        // console.log(delcomfrim)
        if(delcomfrim !== 'confirm'){
          return this.$confirm.info('取消了删除')
        }else{
          const {data:res} = await this.$http.delete('roles/' + delid)
          if(res.meta.status!==200){
            return this.$message.error('删除失败')
          }
          this.$message.success('删除成功')
          this.getRoleList()
        }
      },
      //编辑角色按钮事件
      async editRoleInfo(id){
        // console.log(id);
      const {data:res} = await this.$http.get('roles/' + id)
      if(res.meta.status!==200){
        return this.$message.error('获取角色信息失败')
      }
      this.$message.success('获取角色信息成功')
      this.editRoleData=res.data
      this.editRole=true
      },
      //编辑对话框中的确认按钮事件
      async confirmEdit(id){
      const {data:res} = await this.$http.put('roles/' + id,this.editRoleData)
      if(res.meta.status!==200){
        return this.$message.error('修改角色信息失败')
      }
      this.$message.success('修改角色信息成功')
      this.getRoleList()
      this.editRole=false
      }
    }
}
</script>
<style lang="less" scoped>
    .el-card{
      margin-top: 15px;
      .el-tag{
        margin: 8px 0;
      }
      .bdtop{
        border-top: 1px solid #ccc;
      }
      .bdbottom{
        border-bottom: 1px solid #ccc;
      }
    }
    .vcenter{
      display: flex;
      align-items: center;
    }
</style>