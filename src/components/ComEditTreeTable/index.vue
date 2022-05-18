<template>
<!-- 树形table -->
  <div class="table-temp">
    <el-table
      ref="ComEditTreeTable"
      :height="height"
      :row-key="rowKey"
      :data="tableData"
      border
      fit
      highlight-current-row
      stripe
      v-loading="loading"
      lazy
      :load="load"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      style="width:100%;margin-bottom:10px;"
      @sort-change="sortChange"
      @row-click="handleRowClick"
      @row-dblclick="handleRowDBClick"
    >
      <!-- prop: 字段名name, label: 展示的名称, fixed: 是否需要固定(left, right), minWidth: 设置列的最小宽度(不传默认值), active: 是否有操作列
      active.name: 操作列字段名称, active.clickFun: 操作列点击事件, formatData: 格式化内容-->
      <el-table-column
        v-for="(item, key) in tableHeader"
        :key="key"
        :prop="item.prop"
        :label="item.label"
        :fixed="item.fixed"
        :min-width="item.minWidth"
        :align="item.align"
        :sortable="item.sortable"
      >
        <template slot-scope="scope">
          <span v-if="item.active">
            <el-button
              v-for="(o, key) in item.active"
              :key="key"
              @click.stop="o.handle(scope.row)"
              :type="o.type"
              :icon="o.icon"
              size="small"
            >{{o.name}}</el-button>
          </span>
          <span v-else>
            <a
              v-if="item.routerName"
              @click="handleActive(scope.row, item.routerName, item.routerId)"
              :style="{color:theme,'text-decoration':'underline'}"
            >
              <span v-if="!item.format">{{ scope.row[item.prop] }}</span>
              <span v-else>{{ item.format(scope.row[item.prop], scope.row) }}</span>
            </a>
            <a
              v-else-if="item.handle"
              @click="item.handle(scope.row)"
              :style="{color:theme,'text-decoration':'underline'}"
            >
              <span v-if="!item.format">{{ scope.row[item.prop] }}</span>
              <span v-else>{{ item.format(scope.row[item.prop], scope.row) }}</span>
            </a>
            <span v-else>
              <span v-if="scope.row['update']&&item.component">
                <el-input
                  v-if="scope.row['update']&&item.component.type=='input'"
                  :type="item.component.inputType || 'text'"
                  size="small"
                  v-model="scope.row[item.prop]"
                ></el-input>
                <el-select
                  v-else-if="scope.row['update']&&item.component.type=='select'&&item.component.selectChange"
                  size="small"
                  v-model="scope.row[item.prop]"
                  placeholder
                  @change="((val)=>{item.component.selectChange(val, scope.row)})"
                >
                  <el-option
                    v-for="item in item.component.options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <el-select
                  v-else-if="scope.row['update']&&item.component.type=='select'"
                  size="small"
                  v-model="scope.row[item.prop]"
                  placeholder
                >
                  <el-option
                    v-for="item in item.component.options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <el-date-picker
                  v-else-if="scope.row['update']&&item.component.type=='date'"
                  v-model="scope.row[item.prop]"
                  type="date"
                  editable
                  clearable
                  placeholder="选择日期"
                  style="width: 100%;"
                ></el-date-picker>
                <el-switch
                  v-else-if="scope.row['update']&&item.component.type=='switch'"
                  v-model="scope.row[item.prop]"
                  :active-color="item.component.activeColor"
                  :inactive-color="item.component.inactiveColor"
                  :active-value="item.component.activeValue"
                  :inactive-value="item.component.inactiveValue"
                ></el-switch>
                <el-autocomplete
                  v-else-if="scope.row['update']&&item.component.type=='autocomplete'"
                  v-model="scope.row[item.prop]"
                  :fetch-suggestions="item.component.querySearchAsync"
                  @select="(val)=>{item.component.handleSelect(val, scope.row)}"
                ></el-autocomplete>
                <el-tag
                  v-else-if="scope.row['update']&&item.component.type=='tag'"
                  style="float: left;margin-left: 3px;cursor: pointer;background: #fff;color: #933EC5"
                  @click.stop.native="item.component.handleClick(scope.row)"
                >{{ scope.row[item.prop] || "选择" }}</el-tag>
                <span v-else>{{ scope.row[item.prop] }}</span>
              </span>
              <span v-else-if="item.format">{{ item.format(scope.row[item.prop], scope.row) }}</span>
              <span v-else>{{ scope.row[item.prop] }}</span>
            </span>
          </span>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        v-if="pagination.pageTotal>0"
        background
        layout="total, prev, pager, next"
        :current-page="pagination.pageIndex"
        :page-size="pagination.pageSize"
        :total="pagination.pageTotal"
        @current-change="handlePageChange"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
var _ = require("lodash");
export default {
  props: {
    height: {
      type: String,
      required: false,
    },
    rowKey: {
      type: String,
      required: true,
    },
    tableData: {
      type: Array,
      default: function () {
        return [];
      },
    },
    tableHeader: {
      type: Array,
      default: function () {
        return [];
      },
    },
    loading: {
      type: Boolean,
      default: false,
    },
    pagination: {
      type: Object,
      default() {
        return {
          pageIndex: 0,
          pageSize: 15,
          pageTotal: 0,
        };
      },
    },
  },
  data() {
    return {
      newPagination: {
        pageIndex: 0,
        pageSize: 15,
        pageTotal: 0,
      },
    };
  },
  methods: {
    // 分页导航
    handlePageChange(val) {
      this.$set(this.pagination, "pageIndex", val);
      //调用父组件方法
      this.$emit("pageChange", { backData: this.pagination });
    },
    // row:本行数据，route：要跳转的路由路径，跳转要传的参数routeId
    handleActive(row, routeName, routeId) {
      this.$router.push({
        name: routeName,
        query: {
          id: row[routeId],
        },
      });
    },
    //后端排序
    sortChange(column) {
      //console.log('sortChange:', column);
      //调用父组件方法
      this.$emit("sortChange", { backData: column });
    },
    async load(tree, treeNode, resolve) {
      this.$emit("load", tree, treeNode, resolve);
    },
    handleRowDBClick(row, column, event) {
      this.$emit("handleRowDBClick", row, column, event);
    },
    handleRowClick(row, column, event) {
      this.$emit("handleRowClick", row, column, event);
    },
    refresh() {
      this.$refs.ComEditTreeTable.store.states.treeData = [];
      this.$refs.ComEditTreeTable.store.states.lazyTreeNodeMap = {};
    },
  },
  watch: {
    loading: {
      handler(n, o) {
        if (n) {
          this.refresh();
        }
      },
      deep: true,
    },
  },
  computed: {
    theme() {
      return this.$store.state.settings.theme;
    },
  },
  created() {},
};
</script>

<style lang="scss" scoped>
.el-table ::v-deep .el-table__row ::v-deep .cell {
  display: flex;
  flex-direction: row;
  align-items: center;
  vertical-align: middle;
  justify-content: center;

  .el-input__inner {
    text-align: center;
  }
}
</style>