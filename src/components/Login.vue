<template>
  <div class="login_con">
    <div class="login-box">
      <!-- 头像区域 -->
      <div class="avatar">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 表单区域 -->
      <el-form
        ref="LoginFormRef"
        :model="loginForm"
        :rules="rules"
        label-width="0px"
        class="login-form"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            class="el-icon-user"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password"></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button id="btnss" @click="login">登陆</el-button>
          <el-button id="btnss" @click="resetForm('LoginFormRef')"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loginForm: {
        username: "admin",
        password: "123456"
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 5, max: 16, message: "长度在 5 到 16 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入登陆密码", trigger: "blur" },
          { min: 6, max: 16, message: "长度在 6 到 16 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    login(){
      this.$refs.LoginFormRef.validate(async valid=>{
        if(!valid) return
        const {data:res}=await this.$http.post('login',this.loginForm)
        console.log(res);
        if(res.meta.status!==200) return this.$message.error('登陆失败')
        this.$message.success('登陆成功')
        //保存token到内存中
        window.sessionStorage.setItem('token', res.data.token)
        //跳转页面
        this.$router.push('/home')
      })
    }
  }
};
</script>
<style lang="less" scoped>
.login_con {
  width: 450px;
  height: 320px;
  background-color: black;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 10px goldenrod;
  .avatar {
    width: 130px;
    height: 130px;
    border: 1px solid gold;
    border-radius: 50%;
    overflow: hidden;
    padding: 10px;
    box-shadow: 0 0 15px goldenrod;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: black;
    img {
      width: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}
.login-form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 15px;
  box-sizing: border-box;
  #btnss {
    background-color: black;
    color: #fff;
    border: 1px solid gold;
  }
}
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
