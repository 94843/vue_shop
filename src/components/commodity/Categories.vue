<template>
    <div>
      <!-- 面包屑导航 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品分类</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 卡片 -->
      <el-card>
        <!-- 添加分类按钮 -->
        <el-row>
          <el-col>
            <el-button type="primary" @click="openAddClassify">添加分类</el-button>
          </el-col>
        </el-row>
        <!-- 表格区域 -->
        <tree-table 
        :data="allData" 
        :columns="columns" 
        :selection-type="false" 
        :expand-type="false" 
        :show-index="true"
        :show-row-hover="false "
        index-text="#"
        border>
        <!-- 是都有效 -->
          <template slot="isok" slot-scope="scope">
            <i class="el-icon-circle-close" v-if="scope.row.cat_deleted === true" style="color:red"></i>
            <i class="el-icon-circle-check" v-else style="color:lightgreen"></i>
          </template>
        <!-- 排序 -->
          <!-- <template slot="sort" slot-scope="scope"> -->
          <template v-slot:sort="scope">
            <el-tag v-if="scope.row.cat_level===0">一级</el-tag>
            <el-tag v-else-if="scope.row.cat_level===1">二级</el-tag>
            <el-tag v-else-if="scope.row.cat_level===2">三级</el-tag>
          </template>
          <!-- 操作 -->
          <template slot="operation">
             <el-button type="primary" size="mini" icon="el-icon-edit"  @click="openEditDialog">编辑</el-button>
             <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
          </template>
        </tree-table>
        <!-- 分页区域 -->
        <div class="block">
          <el-pagination
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
            :current-page="queryInfo.pagenum"
            :page-size="queryInfo.pagesize"
            layout="prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </div>
      </el-card>
      <!-- 编辑对话框 -->
      <el-dialog
        title="编辑"
        :visible.sync="editDialog"
        width="30%">
        <!-- 内容区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialog = false">取 消</el-button>
          <el-button type="primary" @click="editDialog = false">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 添加对话框 -->
      <el-dialog
        title="添加分类"
        :visible.sync="addClassify"
        width="30%">
        <el-form :model="dataForm" :rules="rules" ref="ruleForm" label-width="20%" class="demo-ruleForm">
          <!-- 分类名称区域 -->
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="dataForm.cat_name"></el-input>
          </el-form-item>
          <!-- 父级分类名称区域 -->
           <el-form-item label="父级分类">
             <div class="block">
              <el-cascader
                v-model="value"
                expandTrigger='hover'
                :options="options"
                :props="deployProps"
                @change="handleChange"></el-cascader>
            </div>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addClassify = false">取 消</el-button>
          <el-button type="primary" @click="addClassifyclk">确 定</el-button>
        </span>
      </el-dialog>
    </div>
</template>
<script>
export default {
  //数据
    data(){
      return{
        //查询条件
        queryInfo:{
          type: 3,
          //当前页数
          pagenum: 1,
          //当前每页显示多少数据
          pagesize: 7
        },
        total:0,
        //分类列表所有数据
        allData:[],
        //tree-table类的配置对象
        columns:[
          {
          //指定标题
          label:'分类名称',
          prop:'cat_name'
          },
          //是否有效
          {
            label:'是否有效',
            //将该列定义为模板列
            type:'template',
            //指定为那个模板
            template:'isok'
          },
          //排序
          {
            label:'排序',
            //将该列定义为模板列
            type:'template',
            //指定为那个模板
            template:'sort'
          },
          //操作
          {
            label:'操作',
            //将该列定义为模板列
            type:'template',
            //指定为那个模板
            template:'operation'
          }
        ],
        //编辑对话框是否弹出
        editDialog:false,
        //添加分类对话框是否弹出
        addClassify:false,
        //添加分类的表单验证
        rules: {
          cat_name: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 3, max: 7, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
        },
        //添加分类的数据源
        dataForm:{
          cat_pid:0,
          cat_name:'',
          cat_level:0
        },
        //级联选择器的数据源
        options:[],
        //被选中的元素id的数组
        value:[],
        //级联选择器的配置对象
        deployProps:{
          //所指定的属性
          value:'cat_id',
          //所看到的属性
          label:'cat_name',
          children:'children',
          // expandTrigger:'hover'
        },
      }
    },
    //生命周期函数
    created(){
      this.getSortList()
    },
    //行为方法
    methods: {
      //获取数据渲染表格
      async getSortList(){
        const {data:res} = await this.$http.get('categories',{ params : this.queryInfo}) 
        if(res.meta.status!==200){
          return this.$message.error('获取分类列表失败')
        }
        //为总数据赋值
        this.allData=res.data.result
        //为总数据条数赋值
        this.total=res.data.total
      },
      //监听分页size事件 点击翻页
      handleSizeChange(newSize){
      this.queryInfo.pagesize=newSize
      this.getSortList()
      },
      //监听分页pagenum事件 输入框输入翻页
      handleCurrentChange(newPage){
        this.queryInfo.pagenum=newPage
        this.getSortList()
      },
      //弹出编辑对话框
      openEditDialog(){
        this.editDialog=true
      },
      //弹出添加分类对话框
      async openAddClassify(){
        this.addClassify=true
        const {data:res} = await this.$http.get('categories',{params:{type:2}})
        if(res.meta.status!==200){
          return this.$message.error('获取权限失败')
        }
        //将获取到的数组添加到级联选择器的数据中
        this.options=res.data
      },
      //选择项发生变化时触发
      handleChange(value) {
        // console.log(value);
        this.dataForm.cat_pid=value.length+1
        this.dataForm.cat_level=value.length
        // console.log(this.dataForm);
      },
      //添加分类对话框中的确认按钮的点击事件
      addClassifyclk(){
        this.$refs.ruleForm.validate(async valid=>{
          if(!valid) return
          //调用接口发起请求
          const {data:res}=await this.$http.post('categories',this.dataForm)
        })
        this.addClassify=false
      }
    },
}
</script>
<style lang="less" scoped>
    .el-card{
      margin-top: 15px;
    }
    .el-cascader{
      width: 100%;
    }
</style>