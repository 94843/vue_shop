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
      <el-row :gutter="20" style="margin-bottom:15px">
        <el-col :span="10"><div>        
            <el-input placeholder="请输入内容"  v-model="queryInfo.query" clearable @clear="cleardata">
              <el-button slot="append" icon="el-icon-search" @click="seachData"></el-button>
            </el-input>
          </div></el-col>
          <el-col :span="14">
            <el-button type="primary" @click="addUserInfo = true">添加用户</el-button>            
          </el-col>         
      </el-row>
      <!-- 详细信息区域 -->
      <el-table :data="userData" stripe border style="width: 100%">
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change='changeStatus(scope.row)'></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip content="编辑" placement="top" >
              <el-button type="primary" size="mini" icon="el-icon-edit" @click="editUserGo(scope.row.id)"></el-button>          
            </el-tooltip>
            <el-tooltip content="分配角色" placement="top">
              <el-button type="warning" size="mini" icon="el-icon-bangzhu" @click="assigningRoles"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeUserId(scope.row.id)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分页 -->
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 3, 4]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="addUserInfo" @close="addClosed">
      <el-form :model="adduser" :rules="addrules" label-width="70px" ref="addUserRef">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="adduser.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="adduser.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="adduser.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="adduser.mobile"></el-input>
        </el-form-item>
      </el-form>
       <div slot="footer" class="dialog-footer">
        <el-button @click="addUserInfo = false">取 消</el-button>
        <el-button type="primary" @click="addUsery">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改用户弹出层 -->
    <el-dialog title="修改用户信息" :visible.sync="editUser"  @close="editClosed">
      <el-form :model="editForm" :rules="addrules" label-width="70px" ref="editUserRef" >
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
       <div slot="footer">
        <el-button @click="editUser = false">取 消</el-button>
        <el-button type="primary" @click="edity(editForm.id)">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色" :visible.sync="assigningRolesDialog">
     分配角色
    </el-dialog>
  </div>
</template>
<script>
export default {
  //数据
   data(){
     //验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^\w+@\w+(\.\w+)+$/
      if (regEmail.test(value)) {
        return cb()
      }
      //返回一个错误提示
      cb(new Error('请输入合法的邮箱'))
    }
    //验证手机号码的规则
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^1[34578]\d{9}$/
      if (regMobile.test(value)) {
        return cb()
      }
      //返回一个错误提示
      cb(new Error('请输入合法的手机号码'))
    }
    return {
      queryInfo: {
        query: '',
        //当前页数
        pagenum: 1,
        //当前每页显示多少数据
        pagesize: 2
      },
      userData:[],
      total:0,
      //是否显示对话框
      addUserInfo:false,
      editUser:false,
      assigningRolesDialog:false,
      //查询到的用户信息
      editForm:{},
      //添加用户的各项参数
      adduser:{
        username:'',
        password:'',
        email:'',
        mobile:''
      },
      //添加表单的验证规则
       addrules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
          ],
          email: [
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            { validator:checkEmail, message: '邮箱格式不正确，请重新输入', trigger: 'blur' }
          ],
          mobile: [
            { required: true, message: '请输入手机号', trigger: 'blur' },
            { validator:checkMobile, message: '手机号码不正确，请重新输入', trigger: 'blur' }
          ]
        }
    }
  },
    //入口函数
    created(){
      this.getInfoData()
    },
    //方法
    methods:{
      //发送请求获取数据渲染页面
        async getInfoData(){
        const { data:res } = await this.$http.get('users', {
        params: this.queryInfo
          })
        if(res.meta.status!==200){
           return this.$message.error('获取失败')
        }
        this.userData=res.data.users
        this.total=res.data.total
        console.log(res.data);
      },
      //监听pagesize改变事件
      handleSizeChange(newSize){
        //将监听到的值绑定到queryInfo.pagesize身上
        this.queryInfo.pagesize = newSize
        //newsize发生变化后我们就应该根据最新的newsize重新发送请求
        this.getInfoData()  

      },
      //监听页码值改变的事件
      handleCurrentChange(newPage){
        this.queryInfo.pagenum = newPage
        this.getInfoData()  
      },
      //监听开关状态的改变
      async changeStatus(userinfo){
       const{data:res} = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
       if(res.meta.status!==200){
         userinfo.mg_state=!userinfo.mg_state
         return this.$$message.error('更新用户状态失败')
       }
       this.$message.success('更新用户状态成功')
      },
      //输入框内的小X功能
      cleardata(){
        this.getInfoData()
      },
      //查找用户功能
      seachData(){
        this.getInfoData()
      },
      //监听添加用户对话框的关闭事件
      addClosed(){
        this.$refs.addUserRef.resetFields()
      },
      //点击按钮添加新用户
      addUsery(){
        this.$refs.addUserRef.validate(async valid=>{
          if(!valid) return
          //发起添加用户的网络请求
          const {data:res} =await  this.$http.post('users',this.adduser)
          if(res.meta.status!==201){
            this.$message.error('添加用户失败')
          }else{
            this.$message.success('添加用户成功')
            this.addUserInfo=false
            this.getInfoData()
          }
        })
      },
      //修改用户信息
      async editUserGo(id){
      //插槽获取到的id
      const {data:res} = await this.$http.get('users/' + id)
      if(res.meta.status!==200){
        return this.$message.error('不行')
      }
        this.editForm=res.data
        this.editUser=true
      },
      //监听修改用户对话框的关闭事件
      editClosed(){
        this.$refs.editUserRef.resetFields()
      },
      //修改数据中的确认按钮的点击事件
      edity(id){
        this.$refs.editUserRef.validate(async valid=>{
          if(!valid) return
          const {data:res} = await this.$http.put('users/' + id,{
            email:this.editForm.email,
            mobile:this.editForm.mobile
          })
          if(res.meta.status!==200){
            this.$message.error('编辑失败')
          }
          this.$message.success('编辑用户成功')
          this.editUser=false
          this.getInfoData()
        })

      },
      //删除按钮点击事件
      async removeUserId(id){
        // console.log(id)
        //询问是否删除该数据
        const deleteUser = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        //如果用户点击了确认，则会返回值为字符串的 confirm
        //如果用户点击了取消，则会返回值为字串的 cancel
        console.log(deleteUser)
        if(deleteUser!=='confirm'){
          return this.$message.info('已取消删除')
        }
        const {data:res} = await this.$http.delete('users/' + id)
        if(res.meta.status!==200){
          return this.$message.error('删除失败')
        }
        this.$message.success('删除成功')
        this.getInfoData()
      },
      //分配角色点击事件
      assigningRoles(){
        this.assigningRolesDialog=true
      }
    },
}
</script>
<style lang="less" scoped>
    .el-breadcrumb{
      margin-bottom: 20px;
    }
    .box-card{
      box-shadow: darkgrey 0px 0px 5px 0px !important;
      .input-with-select{
        width: 500px;
      }
    }
</style>