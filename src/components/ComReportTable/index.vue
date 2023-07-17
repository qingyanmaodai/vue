<template>
  <!-- 只查看的表格 -->
  <div class="container">
    <div class="flex_grow">
      <vxe-toolbar
        ref="xToolbar1"
        custom
        print
        class="toolbar"
        v-show="isToolbar"
      >
      </vxe-toolbar>
      <vxe-table
        ref="vxeTable"
        border
        show-overflow
        highlight-current-row
        highlight-hover-row
        :height="height"
        size="mini"
        :loading="tableLoading"
        :cell-style="cellStyle"
        :cell-class-name="tableCellClassName"
        :row-class-name="tableRowClassName"
        :show-footer="showFooter"
        :footer-method="footerMethod"
        @cell-click="handleRowClick"
        @cell-dblclick="handleRowdbClick"
        resizable
        auto-resize
        @sort-change="sortChange"
      >
        <vxe-column
          type="seq"
          min-width="60"
          v-if="IsIndex"
          title="序号"
        ></vxe-column>
        <vxe-column
          v-for="(x, z) in tableHeader"
          :key="z"
          :resizable="true"
          :tree-node="z == 0 ? true : x.treeNode ? x.treeNode : false"
          :sortable="x.sortable == 'custom' ? true : false"
          :field="x.prop"
          :title="x.label"
          :min-width="x.width"
          :fixed="x.fix"
          :filters="
            x.filters
              ? [{ data: '' }]
              : ControlTypeList.includes(x.ControlType)
              ? [{ data: '' }]
              : null
          "
          :filter-method="filterMethod"
          :filter-recover-method="filterRecoverMethod"
        >
          <template #filter="{ $panel, column }">
            <input
              v-for="(option, index) in column.filters"
              :key="index"
              class="my-input"
              type="type"
              v-model.trim="option.data"
              @input="$panel.changeOption($event, !!option.data, option)"
              @keyup.enter="$panel.confirmFilter()"
              placeholder="按回车确认筛选"
              style="margin: 10px; height: 35px"
            />
          </template>
          <template slot-scope="scope">
            <span v-if="x.routerName">
              <a
                :style="{
                  color: theme,
                  'text-decoration': 'underline',
                  cursor: 'pointer',
                }"
                @click="handleActive(scope.row, x.routerName, x.prop)"
              >
                <span v-if="!x.format" v-html="scope.row[x.prop]"></span>
                <span v-else>{{ x.format(scope.row[x.prop], scope.row) }}</span>
              </a>
            </span>
            <span v-else-if="x.component">
              <span v-if="scope.row['update']">
                <span
                  v-if="x.component.type == 'input' && x.component.inputChange"
                >
                  <el-input
                    v-model="scope.row[x.prop]"
                    :type="x.component.inputType || 'text'"
                    :disabled="scope.row[x.component.disabled]"
                    size="mini"
                    :rows="1"
                    @input="
                      operation(
                        x.component.methods,
                        scope.row,
                        scope.row[x.prop],
                        x.prop,
                        scope.$rowIndex
                      )
                    "
                    @change="
                      operation(
                        x.component.inputChange,
                        scope.row,
                        scope.row[x.prop],
                        x.prop,
                        scope.$rowIndex
                      )
                    "
                  ></el-input>
                </span>
                <span v-else-if="x.component.inputType == 'number'">
                  <el-input
                    v-model="scope.row[x.prop]"
                    @input="
                      operation(
                        x.component.methods,
                        scope.row,
                        scope.row[x.prop],
                        x.prop,
                        scope.$rowIndex
                      )
                    "
                    :disabled="scope.row[x.component.disabled]"
                    @keyup.enter.native="
                      operation2(
                        x.component.methods2,
                        scope.row,
                        scope.row[x.prop],
                        x.prop,
                        scope.$rowIndex
                      )
                    "
                    type="number"
                    size="mini"
                  ></el-input>
                </span>
                <span
                  v-else-if="
                    x.component.type == 'input' &&
                    x.component.inputType != 'number'
                  "
                >
                  <el-input
                    v-model="scope.row[x.prop]"
                    :type="x.component.inputType || 'text'"
                    :rows="1"
                    :disabled="scope.row[x.component.disabled]"
                    size="mini"
                    @blur="
                      operation(
                        x.component.methods,
                        scope.row,
                        scope.row[x.prop],
                        x.prop,
                        scope.$rowIndex
                      )
                    "
                  ></el-input>
                </span>
                <span v-else-if="x.component.selectChange">
                  <el-select
                    filterable
                    clearable
                    :multiple="x.component.multiple"
                    :disabled="scope.row[x.component.disabled]"
                    value-key="label"
                    v-model="scope.row[x.prop]"
                    size="mini"
                    @change="
                      operation(
                        x.component.methods,
                        scope.row,
                        scope.row[x.prop],
                        x.prop,
                        scope.$rowIndex
                      )
                    "
                  >
                    <el-option
                      v-for="x2 in scope.row[x.component.prop]"
                      :key="x2.value"
                      :label="x2.label"
                      :value="x2.value"
                    ></el-option>
                  </el-select>
                </span>
                <span v-else-if="x.component.type == 'select'">
                  <el-select
                    v-model="scope.row[x.prop]"
                    size="mini"
                    :multiple="x.component.multiple"
                    :disabled="scope.row[x.component.disabled]"
                    filterable
                    clearable
                  >
                    <el-option
                      v-for="x2 in scope.row[x.component.prop]"
                      :key="x2.value"
                      :label="x2.label"
                      :value="x2.value"
                    ></el-option>
                  </el-select>
                </span>
                <span v-else-if="x.component.type == 'date'">
                  <el-date-picker
                    size="mini"
                    :disabled="scope.row[x.component.disabled]"
                    @change="
                      operation(
                        x.component.methods,
                        scope.row,
                        scope.row[x.prop],
                        x.prop,
                        scope.$rowIndex
                      )
                    "
                    v-model="scope.row[x.prop]"
                    type="date"
                    editable
                    clearable
                    placeholder="选择日期"
                    :picker-options="getPickerTime(scope.row)"
                    value-format="yyyy-MM-dd"
                    style="width: 100%"
                  ></el-date-picker>
                </span>
                <span v-else-if="x.component.type == 'datetime'">
                  <el-date-picker
                    size="mini"
                    @change="
                      operation(
                        x.component.methods,
                        scope.row,
                        scope.row[x.prop],
                        x.prop,
                        scope.$rowIndex
                      )
                    "
                    v-model="scope.row[x.prop]"
                    type="datetime"
                    editable
                    clearable
                    :disabled="scope.row[x.component.disabled]"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    format="yyyy-MM-dd HH:mm:ss"
                    style="width: 100%"
                  ></el-date-picker>
                </span>
                <span v-else-if="x.component.type == 'time'">
                  <el-time-select
                    size="mini"
                    style="width: 100%"
                    :disabled="scope.row[x.component.disabled]"
                    v-model="scope.row[x.prop]"
                    :picker-options="{
                      start: '00:00',
                      step: '00:15',
                      end: '24:00',
                    }"
                    :placeholder="x.placeholder"
                  >
                  </el-time-select>
                </span>
                <span v-else-if="x.component.type == 'checkbox'">
                  <el-checkbox
                    v-model="scope.row[x.prop]"
                    @change="
                      operation(
                        x.component.methods,
                        scope.row,
                        scope.row[x.prop],
                        x.prop,
                        scope.$rowIndex
                      )
                    "
                  ></el-checkbox>
                </span>
                <span v-else-if="x.component.type == 'switch'">
                  <el-switch
                    v-model="scope.row[x.prop]"
                    :active-color="x.component.activeColor"
                    :inactive-color="x.component.inactiveColor"
                    :active-value="x.component.activeValue"
                    :inactive-value="x.component.inactiveValue"
                  ></el-switch>
                </span>
                <span v-else-if="x.component.type == 'autocomplete'">
                  <el-autocomplete
                    size="mini"
                    :disabled="scope.row[x.component.disabled]"
                    v-model="scope.row[x.prop]"
                    :fetch-suggestions="
                      (queryString, cb) => {
                        fetchsuggertions(queryString, cb, x.component.methods);
                      }
                    "
                    @select="
                      (item) => getRemote(row, item, x.component.methods)
                    "
                  >
                    <template slot-scope="{ item }">
                      <div style="border-bottom: 1px dashed #8c8e8e">
                        <el-form label-width="100px" inline>
                          <el-form-item
                            style="margin-bottom: 5px"
                            :label="x.component.label"
                            ><span style="color: orange">{{
                              item[x.component.prop]
                            }}</span>
                          </el-form-item>
                          <el-form-item
                            style="margin-bottom: 5px"
                            :label="x.component.label2"
                            ><span style="color: orange">{{
                              item[x.component.prop2]
                            }}</span>
                          </el-form-item>
                        </el-form>
                      </div>
                    </template>
                  </el-autocomplete>
                </span>
                <span v-else-if="x.component.type == 'tag'">
                  <el-tag
                    class="table_tag"
                    @click.stop.native="x.component.handleClick(scope.row)"
                  >
                    {{ scope.row[x.prop] }}</el-tag
                  >
                </span>
              </span>
              <span v-else-if="x.component.type == 'checkbox'">
                <el-tag
                  v-if="scope.row[x.prop] == true"
                  size="mini"
                  effect="light"
                  >是
                </el-tag>
                <el-tag v-else type="info" size="mini" effect="light"
                  >否
                </el-tag>
              </span>
              <span v-else-if="x.prop == 'Status'">
                <el-tag v-if="scope.row.Status == 1" size="mini" effect="light"
                  >启用
                </el-tag>
                <el-tag v-else type="danger" size="mini" effect="light"
                  >禁用
                </el-tag>
              </span>
              <span
                v-else
                v-html="scope.row[x.propName ? x.propName : x.prop]"
              ></span>
            </span>
            <span
              v-else
              v-html="scope.row[x.propName ? x.propName : x.prop]"
            ></span>
          </template>
        </vxe-column>
      </vxe-table>
    </div>

    <div class="flex_shrink" v-if="isShowFooter">
      <div v-if="showPagination" class="flex_row_spaceBtn pagination">
        <div v-show="sysID > 0">
          <span @click="toPageSetting" class="primaryColor cursor"
            >SysID:{{ sysID }}
          </span>
          <span style="color: red; font-weight: bold; margin-left: 10px">
            {{ Prompt }}
          </span>
        </div>
        <div class="flex">
          <el-pagination
            background
            @size-change="pageSize"
            :current-page="pagination.pageIndex"
            :page-sizes="[
              32, 50, 100, 200, 300, 500, 700, 900, 1200, 1500, 1000, 2000,
              3000, 4000, 5000,
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
          <span style="color: red; font-weight: bold; margin-left: 10px">{{
            Prompt
          }}</span>
        </div>
        <div>
          <span>共{{ pagination.pageTotal }}条数据</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { setTimeout } from "timers";
import XEUtils from "xe-utils";
import { GetSearchData } from "@/api/Common";
export default {
  props: {
    // 传行内样式
    cellStyle: {
      type: Function,
      default: () => {
        return null;
      },
    },
    IsIndex: {
      type: Boolean,
      default: false,
    },
    //合计行
    showFooter: {
      type: Boolean,
      default: false,
    },
    //底部展示
    isShowFooter: {
      type: Boolean,
      default: true,
    },
    includeFields: {
      type: Array,
      default: function () {
        return [];
      },
    },
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
    isToolbar: {
      type: Boolean,
      default: true,
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
    isFooterRemark: {
      type: Boolean,
      default: true,
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
      Prompt: "",
      ControlTypeList: [
        "textbox",
        "textarea",
        "el-input",
        "el-input-number",
        "el-autocomplete",
      ], //允许筛选的控件类型
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
    // 单击行
    handleRowClick({ row }) {
      if (this.isChecked) {
        this.$refs.vxeTable.setCheckboxRow(row, true);
      }
      this.$emit("handleRowClick", row, this.remark);
    },
    // 双击行
    handleRowdbClick({ row, column }) {
      if (this.isEdit && !row.update) {
        this.$set(row, "update", true);
      }
      this.$emit("handleRowdbClick", row, this.remark);
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
    handleActive(row, routerName, prop) {
      this.$emit("toPage", row, prop);
      // this.$router.push({
      //   name: routerName.name,
      //   query: { row: row },
      // });
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
    sortChange({ column }) {
      //调用父组件方法
      this.$refs.vxeTable.clearSelected();
      this.$emit(
        "sortChange",
        column.order,
        column.property,
        this.remark,
        this.filtertb
      );
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

      if (row["blueSummaryColor"]) {
        className += "blueSummaryColor";
      }
      return className;
    },
    //可编辑列加背景颜色
    tableCellClassName({ row, column, rowIndex, columnIndex }) {
      let className = "";
      if (
        column.property == "PlanQtyP" &&
        row["receiveColor"] &&
        parseFloat(row["receiveColor"]) >= 100
      ) {
        className += "receiveGreenBg";
      }
      if (
        column.property == "PlanQtyP" &&
        row["receiveColor"] &&
        parseFloat(row["receiveColor"]) < 100
      ) {
        className += "receiveYellowBg";
      }
      return className;
    },
    footerMethod({ columns, data }) {
      if (!this.showFooter) {
        return;
      }
      const footerData = [
        columns.map((column, columnIndex) => {
          if (columnIndex === 0) {
            return "合计";
          }
          if (this.includeFields.includes(column.property)) {
            return XEUtils.sum(data, column.property);
          }
          return null;
        }),
      ];
      return footerData;
    },
    // 筛选条件
    filterMethod({ option, row, column }) {
      if (option.data) {
        if (row[column.property]) {
          return JSON.stringify(row[column.property]).includes(option.data);
          // return row[column.property].includes(option.data);
        }
      }
      // 已改为调用筛选时后端接口方法filterChange
    },
    filterRecoverMethod({ option }) {
      // 如果是自定义筛选模板，当为点击确认时，该选项将被恢复为默认值
      option.data = "";
    },
    //后端筛选
    filterChange(filters) {
      // 筛选值
      let val = filters.datas[0];
      // 筛选的字段
      let property = filters.property;
      // this.remark 操作的表格下标
      this.$emit("filterChange", val, property, this.remark);
    },
    async getFooterRemark() {
      let form = {};
      form["dicID"] = 33;
      form["page"] = 1;
      form["rows"] = 0;
      form["DictionaryID"] = this.sysID;
      let res = await GetSearchData(form);
      const { result, data, count, msg } = res.data;
      if (result) {
        if (data && data[0] && data[0].Remark1) {
          this.Prompt = data[0].Remark1;
        }
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
        // this.$refs.vxeTable.reloadData(this.tableData);//加载数据并清除所有状态,使用这个调用后端筛选、排序接口后条件被清空
        this.$refs.vxeTable.loadData(this.tableData); //加载数据
      }
      if (this.tableData && this.isApanMethods) {
        this.info();
      }
    },
  },
  computed: {},
  created() {
    if (isFooterRemark) {
      this.getFooterRemark();
    }
  },
};
</script>
<style lang="scss" scoped>
.toolbar {
  position: absolute;
  /* width: 100px; */
  z-index: 99;
  height: 30px;
  left: 110px;
  top: 6px;
  background: rgba(0, 0, 0, 0);
}

::v-deep .vxe-button.type--button {
  height: 30px !important;
}

::v-deep .vxe-button.type--button.is--circle {
  min-width: 30px !important;
}

::v-deep .vxe-toolbar .vxe-custom--option-wrapper {
  right: -150px !important;
}

.container {
  display: flex;
  flex-direction: column;
  height: 100%;
}
::v-deep .vxe-footer--row {
  height: 35px;
}
</style>
