<template>
      <el-container class="Bigbox">
        <el-header>
          <div class="portrait">
            <img src="../assets/logo.png" alt="">
          </div>
          <span>后台管理系统</span>
          <el-button id="out-btn" @click="logout">退出</el-button>
        </el-header>
        <el-container>
          <el-aside :width="isCollapse ? '60px' : '200px' " style="background-color:#fff">
            <div class="toggle-button" @click="toggle_clk">|　|　|</div>
            <!-- 侧面菜单区域 -->
            <el-menu :router="true" :collapse="isCollapse" :collapse-transition='false'>
              <el-submenu :index="item.id + ''" :key="item.id" v-for="item in menulist">
                <!-- 一级菜单 -->
                <template slot="title">
                  <!-- 图标 -->
                  <i class="el-icon-message"></i>
                  <!-- 文本 -->
                  <span>{{item.authName}}</span>
                  </template>
                  <!-- 二级菜单 -->
                 <el-menu-item-group>
                  <el-menu-item :index="'/' + subItem.path + ''" :key="subItem.id" v-for="subItem in item.children">
                    <!-- 图标 -->
                  <i class="el-icon-message"></i>
                    <!-- 文本 -->
                  <span>{{subItem.authName}}</span>
                  </el-menu-item>
                </el-menu-item-group>
              </el-submenu>
            </el-menu>
          </el-aside>
          <el-main style="background-color: #fff;">
            <router-view></router-view>
          </el-main>
        </el-container>
      </el-container>
</template>
<script>
export default {
  data(){
    return{
      menulist:[],
      isCollapse:false
    }
  },
  created(){
    this.getMenuList()
  },
    methods:{
        logout(){
        window.sessionStorage.clear()
        this.$router.push('/login')
        },
        async getMenuList(){
        const{data:res}=await this.$http.get('menus')
        if(res.meta.status!==200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.menulist=res.data
        console.log(res);
      },
      toggle_clk(){
        this.isCollapse=!this.isCollapse
      }
    },
}
</script>
<style lang="less" scoped>
.Bigbox{
  height: 720px;
  .el-header {
      background-image: linear-gradient(#000, #fff);
      color: #fff;
      border-bottom: 1px solid red;
      display: flex;
      line-height: 60px;
      justify-content: space-between;
      span{
        position: absolute;
        left: 85px;
      }   
      #out-btn{
        background-image: linear-gradient(#000, #fff);
        color: #fff;
        border: none;
      }
      .portrait{
        width: 60px;
        height: 60px;
        img{
          width: 100%;
        }
      }
    }
}  
  .el-aside {
    color: #fff;
    // height: 500px;
    height: 100%;
  }
  .toggle-button{
    background-color: red;
    color: black;
    text-align: center;
    font-size: 10px;
    line-height: 24px;
    cursor: pointer;
  }
</style>