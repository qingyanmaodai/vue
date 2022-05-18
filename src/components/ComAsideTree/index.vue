<template>
  <div>
    <div class="flex px-2 py-1.5 border-b-1 tree_Head">
      <span class="tree_text">{{ title }}</span>
      <div class="flex_flex_end flex-1">
        <el-input
          size="mini"
          clearable
          v-model="Value"
          placeholder="搜索"
          suffix-icon="el-icon-search"
          class="w2/3 cx_margin_right1"
          @input="searchTree"
        ></el-input>
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
      :default-expand-all="isOpen"
      :data="treeData"
      :props="treeProps"
      :load="loadNode"
      :style="{ height: '' + treeHeight + '', overflow: 'auto' }"
      highlight-current
      :expand-on-click-node="false"
      @node-click="handleNodeClick"
    ></el-tree>
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
  },
  data() {
    return {
      Value: "",
      // treeHeight: document.documentElement.clientHeight - 150 + "px",
      dataTree: {},
      nodeTree: {},
      isOpen: true,
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
  },
};
</script>
