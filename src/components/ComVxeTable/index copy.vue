<template>
  <div>
    <vxe-table
      ref="vxeTable"
      border
      show-overflow
      highlight-hover-row
      :height="height"
      size="mini"
      :loading="tableLoading"
      :id="rowKey"
      :cell-class-name="tableCellClassName"
      :row-class-name="tableRowClassName"
      :keyboard-config="{
        isArrow: true,
        isDel: true,
        isEnter: true,
        isTab: true,
        isEdit: true,
      }"
      :mouse-config="{ selected: true }"
      resizable
      @checkbox-change="handleSelectionChange"
      @cell-click="handleRowClick"
      @cell-dblclick="handleRowdbClick"
      @sort-change="sortChange"
      :edit-config="{ trigger: 'click', mode: 'row', showStatus: true }"
    >
      >
      <vxe-column
        :reserve-selection="true"
        type="checkbox"
        width="45"
        v-if="hasSelect"
        fixed="left"
      ></vxe-column>
      <vxe-column tree-node type="seq" min-width="60" title="序号"></vxe-column>
      <vxe-column
        v-for="(x, z) in tableHeader"
        :key="z"
        :resizable="true"
        :sortable="x.sortable == 'custom' ? true : false"
        :field="x.prop"
        :title="x.label"
        :min-width="x.width"
        :fixed="x.fix"
        :edit-render="{ name: 'input' }"
      >
      </vxe-column>
      <vxe-column
        v-if="isEditDel"
        label="操作"
        prop=""
        fixed="right"
        width="85px"
      >
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            circle
            size="mini"
            @click="editRow(scope.row, scope.$index)"
          ></el-button>
          <el-button
            v-show="condition ? condition(scope.row) : true"
            type="danger"
            icon="el-icon-delete"
            circle
            size="mini"
            @click="delRow(scope.row, scope.$index)"
          ></el-button>
        </template>
      </vxe-column>
    </vxe-table>
    <div>
      <div v-if="showPagination" class="flex_row_spaceBtn pagination">
        <div v-show="sysID > 0">
          <span @click="toPageSetting" class="primaryColor cursor"
            >SysID:{{ sysID }}
          </span>
        </div>
        <div class="flex">
          <div class="footer_label" v-show="multipleSelection.length != 0">
            已选[<span style="color: red; font-weight: bold">{{
              multipleSelection.length
            }}</span
            >]
          </div>
          <el-pagination
            background
            @size-change="pageSize"
            :current-page="pagination.pageIndex"
            :page-sizes="[
              32, 50, 100, 150, 200, 250, 300, 350, 400, 800, 1000, 1500, 2000,
            ]"
            :page-size="pagination.pageSize"
            :total="pagination.pageTotal"
            @current-change="pageChange"
            layout="total, sizes, prev, pager, next,jumper"
          >
          </el-pagination>
        </div>
      </div>
      <div v-else class="flex_row_spaceBtn pagination">
        <div v-show="sysID > 0">
          <span @click="toPageSetting" class="primaryColor cursor"
            >SysID:{{ sysID }}
          </span>
        </div>
        <div>
          <span>共{{ pagination.pageTotal }}条数据</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    // 固定合并列显示
    fixSpanMethods: {
      type: Boolean,
      default: false,
    },
    // 是否显示分页
    showPagination: {
      type: Boolean,
      default: true,
    },
    // 查询的时候需要过滤哪个表格的数据
    filtertb: {
      type: Number,
      default: -1,
      required: false,
    },
    //单击是否可编辑
    isEdit: {
      type: Boolean,
      default: false,
    },
    //是否合计
    summary: {
      type: Boolean,
      default: false,
    },
    // 是否多选
    isMultiple: {
      type: Boolean,
      default: true,
    },
    // 系统id
    sysID: {
      type: Number,
      default: 0,
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
    tableLoading: {
      type: Boolean,
      default: false,
    },
    // 是否禁用选框
    forbidden: {
      type: Boolean,
      default: false,
    },
    unifypagination: {
      type: Boolean,
      default: false,
    },
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
    height: {
      type: String,
      required: false,
      default: "600px",
    },
    rowKey: {
      type: String,
      required: true,
    },
    // 选框禁用或显示操作
    // 是否显示选框
    forbidden: {
      type: Boolean,
      default: false,
    },
    // 是否单击需要勾选
    isChecked: {
      type: Boolean,
      default: false,
    },
    // 是否要合并
    isSpanMethods: {
      type: Boolean,
      default: false,
    },
    // 是否有选框
    hasSelect: {
      type: Boolean,
      default: false,
    },
    // 是否清除选框
    isClear: {
      type: Boolean,
      default: false,
    },
    // 是否出现编辑跟删除
    isEditDel: {
      type: Boolean,
      default: false,
    },
    // 是否显示删除
    condition: {
      type: Function,
      default: function () {
        return true;
      },
    },
    // 表格的下标
    remark: {
      type: Number,
      required: false,
    },
    // 头部黄色，可编辑状态
    yellowHeader: {
      type: Boolean,
      default: false,
    },
    // 头部深蓝色，查看状态
    blueHeader: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      singleSelection: {},
      multipleSelection: [],
      getPickerTime(row = {}) {
        return {
          disabledDate(time) {
            if (row.hasOwnProperty("PreStartDate") && row.PreStartDate) {
              return time.getTime() < new Date(row.PreStartDate).getTime();
            }
          },
        };
      },
      spanMethods: [],
      spanarr: [],
      spanarr2: [],
      variable: [], //存取变量名称
      prop: [], // 存取prop
      colspan: [],
      colspanDel: [],
      scrollTop: 0,
      theme: "#409EFF",
      isChangeColor: true,
    };
  },
  methods: {
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
    // 编辑行
    editRow(row, index) {
      this.$emit("editRow", row, index, this.remark);
    },
    // 删除行
    delRow(row, index) {
      this.$emit("delRow", row, index, this.remark);
    },
    // 表头颜色控制
    updateStyle(isLook, isEdit) {
      if (isLook) {
        return "fontBlueInkColor";
      }
      if (isEdit) {
        return "fontBluesInkColor";
      }
    },
    // 合并取几列
    header() {
      if (!this.hasSelect) {
        let index = 0;
        for (var i = 0; i < this.tableHeader.length; i++) {
          if (this.tableHeader[i].isMerge) {
            this.spanMethods[index] = i;
            this.spanarr2.push([]);
            this.spanarr.push([]);
            this.prop[index] = this.tableHeader[i].prop;
            index++;
          }
        }
        let num2 = 0;
        this.tableHeader.some((x, y) => {
          if (x.isMerge && y != this.tableHeader.length - 1) {
            this.colspanDel.push(y);
            num2++;
          } else if (x.isMerge && y == this.tableHeader.length - 1) {
            this.colspanDel.push(y);
            this.colspan.push({ start: y - num2, end: y });
            return;
          } else if (num2) {
            this.colspan.push({ start: y - num2, end: y - 1 });
            num2 = 0;
          }
        });
      } else {
        let index = 0;
        for (var i = 1; i <= this.tableHeader.length; i++) {
          if (this.tableHeader[i - 1].isMerge) {
            this.spanMethods[index] = i;
            this.spanarr.push([]);
            this.spanarr2.push([]);
            this.prop[index] = this.tableHeader[i - 1].prop;
            index++;
          }
        }

        // 获取从第几列开始合并几项
        let num = 1;
        this.tableHeader.some((x, y) => {
          if (x.isMerge && y != this.tableHeader.length - 1) {
            this.colspanDel.push(y + 1);
            num++;
          } else if (x.isMerge && y == this.tableHeader.length - 1) {
            this.colspanDel.push(y + 1);
            this.colspan.push({ start: y - num + 2, end: y + 1 });
            return;
          } else if (num != 1) {
            this.colspan.push({ start: y - num + 2, end: y });
            num = 1;
          }
        });
      }
    },
    // 滚动
    scroll({ scrollTop, scrollLeft }) {
      this.scrollTop = scrollTop;
    },
    // 合并列数据
    info() {
      let a = JSON.stringify(this.spanarr2);
      let b = JSON.parse(a);
      this.spanarr = b;
      for (var j = 0; j < this.tableData.length; j++) {
        if (j === 0) {
          for (var i = 0; i < this.spanarr.length; i++) {
            this.spanarr[i].push(1);
            this.variable[i] = 0;
          }
        } else {
          // 判断当前元素与上一个元素是否相同(第1)
          let index = 0;
          for (var x = 0; x < this.prop.length; x++) {
            let prop = this.prop[x];
            if (this.tableData[j][prop] == this.tableData[j - 1][prop]) {
              //那个字段要合并就判断上一个和下一个的字段是否相同
              let sign = this.variable[index];
              this.spanarr[index][sign] += 1; //相同就累加
              this.spanarr[index].push(0);
              index++;
            } else {
              this.spanarr[index].push(1); //
              this.variable[index] = j;
              index++;
            }
          }
        }
      }
    },
    // 远程搜索
    fetchsuggertions(val, cb, methods) {
      if (methods) {
        this.$emit(methods, val, cb);
      }
    },
    // 获取远程搜索数据
    getRemote(row, item, methods) {
      if (methods) {
        this.$emit(methods, row, item);
      }
    },
    // row:本行数据 route：要跳转的路由路径 跳转要传的参数routeId
    handleActive(row, routerName) {
      this.$router.push({
        name: routerName.name,
        query: { row: row },
      });
    },
    // 表格触发事件
    operation(methods, row, val, prop, index) {
      // debugger
      // if (val) {
      //   let value = JSON.parse(JSON.stringify(val));
      //   this.$set(this.tableData[index], prop, value);
      //   this.$emit("sortChange", 0, 0, this.remark, -100, row, index);
      // }
      if (methods) {
        this.$emit(methods, row, val, prop, index, this.remark, this.filtertb);
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
    //后端排序
    sortChange(column) {
      //调用父组件方法
      this.$refs.vxeTable.clearSelection();
      this.$emit(
        "sortChange",
        column.order,
        column.prop,
        this.remark,
        this.filtertb
      );
    },
    // 单击行
    handleRowClick({ row }) {
      if (this.isChecked) {
        this.$refs.tableRef.toggleRowSelection(row);
      }
      this.$emit("handleRowClick", row, this.remark);
    },
    // 双击行
    handleRowdbClick({ row, column }) {
      console.log(row);
      if (this.isEdit && !row.update) {
        this.$set(row, "update", true);
      }
      this.$emit("handleRowdbClick", row, this.remark);
    },
    // 选择操作
    handleSelectionChange(val, row) {
      if (this.ismultiple) {
        this.multipleSelection = val;
        this.$emit("selectfun", this.multipleSelection, this.remark, row);
      } else {
        if (val.length > 1) {
          var valtmp = val[1];
          this.$refs.tableRef.clearSelection();
          this.$refs.tableRef.toggleRowSelection(valtmp);
          this.singleSelection = valtmp;
        } else {
          this.singleSelection = val[0];
        }
        let data = [];
        data.push(this.singleSelection);
        this.$emit("selectfun", data, this.remark, row);
      }
    },
    //合并同一名称
    arraySpanMethod: function ({ row, column, rowIndex, columnIndex }) {
      if (this.isApanMethods && this.spanMethods) {
        for (let i = 0; i < this.spanMethods.length; i++) {
          if (columnIndex === this.spanMethods[i]) {
            //第几列合并判断
            const _row = this.spanarr[i][rowIndex];
            const _col = _row > 0 ? 1 : 0;
            return {
              rowspan: _row,
              colspan: _col,
            };
          }
        }
      } else if (this.fixSpanMethods) {
        if (row.Summary) {
          if (row.Summary) {
            if (
              this.colspan.findIndex((t) => {
                return t.start == columnIndex;
              }) != -1
            ) {
              let newIndex = this.colspan.findIndex((t) => {
                return t.start == columnIndex;
              });
              let end = 0;
              end =
                parseInt(this.colspan[newIndex].end) -
                parseInt(this.colspan[newIndex].start) +
                1;
              if (columnIndex) {
                return [1, end];
              }
            } else if (
              this.colspanDel.findIndex((o) => {
                return o == columnIndex;
              }) != -1
            ) {
              if (columnIndex) {
                return [0, 0];
              }
            }
          }
        }
      }
    },
    // 行样式控制
    tableRowClassName({ row, rowIndex }) {
      let className = "";
      if (row["IsAdd"]) {
        className += "purpleBgColor";
      }
      return className;
    },
    //可编辑列加背景颜色
    tableCellClassName({ row, column, rowIndex, columnIndex }) {
      let className = "";
      return className;
    },
    // 禁用勾选
    selectInit(row) {
      if (this.forbidden) {
        if (row.ProcessGroupID) {
          return true; //可勾选
        } else {
          return false; //不可勾选
        }
      } else if (row.hasOwnProperty("IsSelectInit") == false) {
        return true; //可勾选
      } else if (
        row.hasOwnProperty("IsSelectInit") &&
        row.IsSelectInit == "true"
      ) {
        return true;
      } else {
        return false;
      }
    },
  },
  mounted() {
    // this.$refs.vxeTable.doLayout(); //解决表格错位
  },
  watch: {
    tableHeader() {
      if ((this.isSpanMethods || this.fixSpanMethods) && this.tableHeader) {
        this.header();
      }
    },
    height: {
      handler(newValue, oldValue) {
        this.$set(this, "height", newValue);
      },
      // 代表在wacth里声明了firstName这个方法之后立即先去执行handler方法
      immediate: true,
      deep: true,
    },
    tableData() {
      if (this.tableData) {
        this.$refs.vxeTable.reloadData(this.tableData);
      }
      if (this.tableData && this.isApanMethods) {
        this.info();
      }
    },
    isClear() {
      if (this.isClear) {
        if (this.multipleSelection.length != 0) {
          this.$refs.tableRef.clearSelection();
        }
      } else {
        return;
      }
    },
  },
  computed: {},
  created() {},
};
</script>
