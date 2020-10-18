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
              <el-button type="warning" icon="el-icon-bangzhu" @click="showSetRights(scope.row)">分配权限</el-button>
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
      <!-- 分配权限对话框 -->
      <el-dialog title="分配权限" :visible.sync="showSet" width="50%" @close="rightsDialogClosed">
       <el-tree
          ref=treeRef
          :default-checked-keys="defKeys"
          :data="permission"
          show-checkbox
          node-key="id"
          default-expand-all
          :props="defaultProps">
        </el-tree>
        <div slot="footer" class="dialog-footer">
          <el-button @click="showSet = false">取 消</el-button>
          <el-button type="primary" @click="allotRights">确 定</el-button>
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
        //分配权限对话框是否显示
        showSet:false,
        //添加新角色的数据源
        roleData:
          {
            roleName:'',
            roleDesc:''
          },
        //所有权限数据
        permission:[],
        //被编辑角色的id
        allocation:'',
        defaultProps: {
          label: 'authName',
          children: 'children',
        },
        //默认选中的节点ID值数组
        defKeys:[],
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
      },
      //展示分配权限对话框
      async showSetRights(role){
      const {data:res} = await this.$http.get('rights/tree')
      this.permission=res.data
      this.allocation=role.id
      //调用获取三级权限的递归函数
      this.getLeafKeys(role,this.defKeys)
      this.showSet=true
      },
      //通过递归的形式获取当前角色所有三级id
      getLeafKeys(node,arr){
        //如果当前节点不包含children属性，那他就是三级节点，就可以把他push给arr数组
        if(!node.children){
          return arr.push(node.id) 
        }
        //递归函数，自己调用自己，找到那个没有children属性的节点
        node.children.forEach(item => {
          this.getLeafKeys(item,arr)
        });
      },
      //监听权限对话框的关闭事件
      rightsDialogClosed(){
        //我们给defKeys这个数组清空，从而达到重置的效果
        //这样我们关闭再打开权限对话框就不会因为上一次打开保存在数组中的数据受影响
        this.defKeys = []
      },
      //点击为角色分配器权限
      async allotRights(){
        //拿到半选与全选中的权限id
        const keys=[
          ...this.$refs.treeRef.getCheckedKeys(),//全选
          ...this.$refs.treeRef.getHalfCheckedKeys()//半选
        ]
        // console.log(keys)
        //拿到这个选中的id后，是数组形式的  转成字符串
        const idStr=keys.join(',')
        //调用接口发送请求
      const {data:res} = await this.$http.post(`roles/${this.allocation}/rights`,{rids:idStr})
      if(res.meta.status!==200){
        return this.$message.error('分配角色失败')
      }
      this.$message.success('分配角色成功')
      this.showSet = false
      this.getRoleList()

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