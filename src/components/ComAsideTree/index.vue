<template>
  <div>
    <div class="flex px-2 py-1.5 border-b-1 tree_Head">
      <span class="tree_text">{{ title }}</span>
      <div class="flex_flex_end flex-1">
        <el-input
          size="mini"
          clearable
          v-model="Value"
          :placeholder="placeholder"
          class="cx_margin_right1"
          :class="classNameInput"
          @input="searchTree"
          @keyup.enter.native="searchTreeEnter"
        >
        <!-- 搜索图标可点击查询 -->
        <i
          slot="suffix"
          class="el-icon-search"
          @click.stop="searchTreeEnter"
        ></i>
        </el-input>
        <el-dropdown
          v-show="!isEdit"
          @command="handleCommand"
          class="flex_inline"
        >
          <img src="../../assets/svg/dot.svg" />
          <el-dropdown-menu
            slot="dropdown"
            
          >
            <el-dropdown-item command="1">展开全部</el-dropdown-item>
            <el-dropdown-item command="2">折叠全部</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-dropdown
              v-show="isEdit"
          @command="handleCommand2"
          class="flex_inline"
        >
          <img src="../../assets/svg/dot.svg" />
          <el-dropdown-menu
            slot="dropdown"
      
          >
            <el-dropdown-item command="1">新增</el-dropdown-item>
            <el-dropdown-item command="2">编辑</el-dropdown-item>
            <el-dropdown-item command="3" divided>删除</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <el-tree
      class="tree-line"
      :indent="0"
      ref="asideTree"
      :node-key="nodekey"
      :default-expand-all="expand?isOpen:expand"
      :data="treeData"
      :props="treeProps"
      :load="loadNode"
      :style="{ height: '' + treeHeight + '', overflow: 'auto' }"
      highlight-current
      :expand-on-click-node="expandOnClickNode"
      @node-click="handleNodeClick"
      v-loading="loading"
    ></el-tree>
    <div>
      <div
        v-if="showPagination"
        class="flex_row_spaceBtn pagination flex_column flex-start"
      >
        <div v-show="sysID > 0">
          <span
            @click="toPageSetting"
            class="primaryColor cursor"
          >SysID:{{ sysID }}
          </span>
          <span style="color: red; font-weight: bold;margin-left: 10px;">{{Prompt}}</span>
        </div>
        <div class="flex">
          <!-- <div
            class="footer_label"
            v-show="multipleSelection.length != 0"
          >
            已选[<span style="color: red; font-weight: bold">{{
              multipleSelection.length
            }}</span>]
          </div> -->
          <el-pagination
            background
            @size-change="pageSize"
            :current-page="pagination.pageIndex"
            :page-sizes="pageSizes"
            :page-size="pagination.pageSize"
            :total="pagination.pageTotal"
            @current-change="pageChange"
            :layout="layout"
            :small="small"
            :pager-count="pagerCount"
          >
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
    treeData: {
      type: Array,
      default: function () {
        return [];
      },
    },
    title: {
      type: String,
      default: "",
    },
    nodekey: {
      type: String,
      required: false,
    },
    treeProps: {
      type: Object,
      default: function () {
        return {};
      },
    },
    treeHeight: {
      type: String,
      default: "500px",
    },
    // 是否显示分页
    showPagination: {
      type: Boolean,
      default: false,
    },
    // 系统id
    sysID: {
      type: Number,
      default: 0,
    },
    //条数
    pagination: {
      type: Object,
      default() {
        return {
          pageIndex: 0,
          pageSize: 30,
          pageTotal: 0,
        };
      },
    },
    // 表格的下标
    remark: {
      type: Number,
      required: false,
    },
    // 查询的时候需要过滤哪个表格的数据
    filtertb: {
      type: Number,
      default: -1,
      required: false,
    },
    // 分页组件布局
    layout:{
      type: String,
      default: "total, sizes, prev, pager, next",
    },
    // 分页样式
    small:{
      type: Boolean,
      default: true,
    },
    pagerCount:{
      type: Number,
      default: 7,//5~21之间的奇数
    },
    pageSizes:{
      type: Array,
      default: function () {
        return [32,50,100,150,200,250,300,350,400,800,1000,1500,2000,];
      },
    },
    expand:{
      type: Boolean,
      default: true,
    },
    // 是否在点击节点的时候展开或者收缩节点
    expandOnClickNode:{
      type: Boolean,
      default: false,
    },
    //自定义样式
    classNameInput:{
      type: String,
      default: "w2\/3",
    },
    //输入框提示文字
    placeholder:{
      type: String,
      default: "搜索",
    },
    //加载
    loading:{
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      Value: "",
      // treeHeight: document.documentElement.clientHeight - 150 + "px",
      dataTree: {},
      nodeTree: {},
      isOpen: true,
      // multipleSelection: [],
      Prompt:'',//底部文本
    };
  },
  computed: {},
  watch: {},
  mounted() {
    this.$nextTick().then(() => {});
  },
  created() {},
  methods: {
    // 异步树叶子节点懒加载逻辑
    loadNode(node, resolve) {
      // 一级节点处理
      if (node.level === 0) {
      }
      // 其余节点处理
      if (node.level >= 1) {
      }
    },
    handleNodeClick(data, node) {
      this.dataTree = data;
      this.nodeTree = node;
      this.$emit("handleNodeClick", data, node);
    },
    //删除节点
    deleteTree() {
      if (this.nodeTree.data == undefined) {
        this.$message.error("请选择一条数据进行操作");
      } else {
        this.$emit("deleteTree", this.nodeTree);
      }
    },
    //修改节点
    editTree() {
      if (this.nodeTree.data == undefined) {
        this.$message.error("请选择一条数据进行操作");
      } else {
        this.$emit("editTree", this.nodeTree);
      }
    },
    //添加节点
    addTree() {
      this.$emit("addTree");
    },
    // 下拉选择事件
    handleCommand(val) {
      if (val == 1 && !this.isOpen) {
        this.isOpen = true;
        this.changeTreeNodeStatus(this.$refs.asideTree.store.root);
      } else if (val == 2 && this.isOpen) {
        // 改变每个节点的状态
        this.isOpen = false;
        this.changeTreeNodeStatus(this.$refs.asideTree.store.root);
      }
    },
    handleCommand2(val){
    this.$emit('handleCommand',val);
    },
    // 改变节点状态
    changeTreeNodeStatus(node) {
      node.expanded = this.isOpen;
      for (let i = 0; i < node.childNodes.length; i++) {
        // 改变节点的自身expanded状态
        node.childNodes[i].expanded = this.isOpen;
        // 遍历子节点
        if (node.childNodes[i].childNodes.length > 0) {
          this.changeTreeNodeStatus(node.childNodes[i]);
        }
      }
    },
    // 查找树
    searchTree() {
      this.$emit("searchTree", this.Value);
    },
    // 回车查询
    searchTreeEnter(){
      this.$emit("searchTreeEnter", this.Value);
    },
    // 跳转至页面配置
    toPageSetting() {
      if (this.sysID == 35) {
        this.$emit("oneselftSysID", 35);
      } else {
        this.$router.push({
          name: "FieldInfo",
          params: { ID: this.sysID },
        });
      }
    },
    // 选择一页显示多少数据
    pageSize(val) {
      this.$emit("pageSize", val, this.remark, this.filtertb);
    },
    // 分页导航
    pageChange(val) {
      this.$emit("pageChange", val, this.remark, this.filtertb);
    },
  },
};
</script>
