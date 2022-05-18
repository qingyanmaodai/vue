<template>
  <div>
    <el-table
      ref="tableRef"
      v-loading="tableLoading"
      :show-summary="summary"
      :data="tableData"
      :row-key="true"
      :span-method="arraySpanMethod"
      :row-class-name="tableRwoClassName"
      :cell-class-name="tableRowClassName"
      highlight-current-row
      border
      :height="height"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      @selection-change="handleSelectionChange"
      @select="handleSelectionChange"
      @sort-change="sortChange"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      @row-click="handleRowClick"
      @row-dblclick="handleRowdbClick"
    >
      <el-table-column
        v-if="hasSelect"
        type="selection"
        :reserve-selection="true"
        align="center"
        width="45px"
        :selectable="selectInit"
      />
      <el-table-column
        v-for="(x, key) in tableHeader"
        :key="key"
        :prop="x.prop"
        :label="x.label"
        :align="x.align"
        :show-overflow-tooltip="x.tooltip"
        :label-class-name="updateStyle(x.isLook, x.isEdit)"
        :fixed="x.fix"
        :min-width="x.width"
        :sortable="x.sortable"
      >
        <template v-if="x.children">
          <el-table-column
            :prop="i.prop"
            :label="i.label"
            v-for="(i, k) in x.children"
            :align="i.align"
            :show-overflow-tooltip="i.tooltip"
            :label-class-name="updateStyle(i.isLook, i.isEdit)"
            :key="k"
          >
            <template slot-scope="scope">
              <span v-if="i.active">
                <span
                  v-for="(x2, index2) in i.active"
                  :key="index2"
                >
                  <span
                    v-show="x2.condition ? x2.condition(scope.row) : true"
                    size="mini"
                    :style="{
                      margin: '0 5px',
                      color: x2.color,
                      cursor: 'pointer',
                    }"
                    @click.stop="
                      operation(
                        x2.methods,
                        scope.row,
                        scope.row[i.prop],
                        i.prop,
                        scope.$index
                      )
                    "
                  >{{ x2.name }}</span>
                </span>
              </span>
              <span v-else-if="i.button">
                <el-button
                  v-show="o.condition ? o.condition(scope.row) : true"
                  v-for="(o, key) in i.button"
                  :key="key"
                  @click.stop="
                    operation(
                      o.methods,
                      scope.row,
                      scope.row[i.prop],
                      i.prop,
                      scope.$index
                    )
                  "
                  :type="o.type"
                  :circle="o.circle"
                  :icon="o.icon"
                  size="mini"
                >
                  <template v-show="o.name">
                    {{ o.name }}
                  </template>
                </el-button>
              </span>
              <span v-else-if="i.render && !i.component">{{
                i.render(scope.row)
              }}</span>
              <span v-else-if="i.routerName">
                <a
                  :style="{
                    color: theme,
                    'text-decoration': 'underline',
                    cursor: 'pointer',
                  }"
                  @click="handleActive(scope.row, i.routerName)"
                >
                  <span
                    v-if="!i.format"
                    v-html="scope.row[i.prop]"
                  ></span>
                  <span v-else>{{
                    i.format(scope.row[i.prop], scope.row)
                  }}</span>
                </a>
              </span>
              <span v-else-if="i.component">
                <span v-if="scope.row['update']">
                  <span v-if="
                      i.component.type == 'input' && i.component.inputChange
                    ">
                    <el-input
                      v-model="scope.row[i.prop]"
                      :type="i.component.inputType || 'text'"
                      size="mini"
                      @change="
                        operation(
                          i.component.inputChange,
                          scope.row,
                          scope.row[i.prop],
                          i.prop,
                          scope.$index
                        )
                      "
                    >
                    </el-input>
                  </span>
                  <span v-else-if="
                      i.component.type == 'input' &&
                      i.component.inputType == 'number'
                    ">
                    <el-input
                      v-model="scope.row[i.prop]"
                      @input="
                        operation(
                          i.component.methods,
                          scope.row,
                          scope.row[i.prop],
                          i.prop,
                          scope.$index
                        )
                      "
                      :type="i.component.inputType || 'text'"
                      size="mini"
                    ></el-input>
                  </span>
                  <span v-else-if="
                      i.component.type == 'input' &&
                      i.component.inputType != 'number'
                    ">
                    <el-input
                      v-model="scope.row[i.prop]"
                      :type="i.component.inputType || 'text'"
                      size="mini"
                    ></el-input>
                  </span>
                  <span v-else-if="
                      i.component.type == 'select' && i.component.selectChange
                    ">
                    <el-select
                      value-key="label"
                      v-model="scope.row[i.prop]"
                      size="mini"
                      :multiple="i.component.multiple"
                      clearable
                      filterable
                      @change="
                        operation(
                          i.component.methods,
                          scope.row,
                          scope.row[i.prop],
                          i.prop,
                          scope.$index
                        )
                      "
                    >
                      <el-option
                        v-for="x2 in scope.row[i.component.prop]"
                        :key="x2.value"
                        :label="x2.label"
                        :value="x2"
                      ></el-option>
                    </el-select>
                  </span>
                  <span v-else-if="i.component.type == 'select'">
                    <el-select
                      :multiple="i.component.multiple"
                      clearable
                      filterable
                      v-model="scope.row[i.prop]"
                      size="mini"
                      placeholder
                    >
                      <el-option
                        v-for="x2 in scope.row[i.component.prop]"
                        :key="x2.value"
                        :label="x2.label"
                        :value="x2.value"
                      ></el-option>
                    </el-select>
                  </span>
                  <span v-else-if="i.component.type == 'date'">
                    <el-date-picker
                      size="mini"
                      @change="
                        operation(
                          i.component.methods,
                          scope.row,
                          scope.row[i.prop],
                          i.prop,
                          scope.$index
                        )
                      "
                      v-model="scope.row[i.prop]"
                      type="date"
                      editable
                      clearable
                      placeholder="选择日期"
                      :picker-options="getPickerTime(scope.row)"
                      value-format="yyyy-MM-dd"
                      style="width: 100%"
                    ></el-date-picker>
                  </span>
                  <span v-else-if="i.component.type == 'datetime'">
                    <el-date-picker
                      size="mini"
                      @change="
                        operation(
                          i.component.methods,
                          scope.row,
                          scope.row[i.prop],
                          i.prop,
                          scope.$index
                        )
                      "
                      v-model="scope.row[i.prop]"
                      type="datetime"
                      editable
                      clearable
                      placeholder="选择日期"
                      value-format="yyyy-MM-dd HH:mm"
                      format="yyyy-MM-dd HH:mm"
                      style="width: 100%"
                    ></el-date-picker>
                  </span>
                  <span v-else-if="i.component.type == 'time'">
                    <el-time-select
                      size="mini"
                      style="width:100%"
                      v-model="scope.row[i.prop]"
                      :picker-options="{
    start: '00:00',
    step: '00:15',
    end: '24:00'
  }"
                      :placeholder="i.placeholder"
                    >
                    </el-time-select>
                  </span>
                  <span v-else-if="i.component.type == 'switch'">
                    <el-switch
                      v-model="scope.row[i.prop]"
                      :active-color="i.component.activeColor"
                      :inactive-color="i.component.inactiveColor"
                      :active-value="i.component.activeValue"
                      :inactive-value="i.component.inactiveValue"
                    ></el-switch>
                  </span>
                  <span v-else-if="i.component.type == 'autocomplete'">
                    <el-autocomplete
                      size="mini"
                      v-model="scope.row[i.prop]"
                      :fetch-suggestions="
                        (queryString, cb) => {
                          fetchsuggertions(
                            queryString,
                            cb,
                            i.component.methods
                          );
                        }
                      "
                      @select="
                        (item) => getRemote(row, item, i.component.methods)
                      "
                    >
                      <template slot-scope="{ item }">
                        <div style="border-bottom: 1px dashed #8c8e8e">
                          <el-form
                            label-width="100px"
                            inline
                          >
                            <el-form-item
                              style="margin-bottom: 5px"
                              :label="i.component.label"
                            ><span style="color: orange">{{
                                item[i.component.prop]
                              }}</span>
                            </el-form-item>
                            <el-form-item
                              style="margin-bottom: 5px"
                              :label="i.component.label2"
                            ><span style="color: orange">{{
                                item[i.component.prop2]
                              }}</span>
                            </el-form-item>
                          </el-form>
                        </div>
                      </template>
                    </el-autocomplete>
                  </span>
                  <span v-else-if="i.component.type == 'tag'">
                    <el-tag
                      class="table_tag"
                      @click.stop.native="i.component.handleClick(scope.row)"
                    >
                      {{ scope.row[i.prop] }}</el-tag>
                  </span>
                </span>
                <span v-else>{{ scope.row[i.prop] }}</span>
              </span>
              <span v-else-if="i.format">{{
                i.format(scope.row[i.prop], scope.row)
              }}</span>
              <span
                v-else
                v-html="scope.row[i.propName ? i.propName : i.prop]"
              ></span>
            </template>
          </el-table-column>
          <el-table-column
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
                @click="editRow(scope.row)"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                circle
                size="mini"
                @click="delRow(scope.row)"
              ></el-button>
            </template>
          </el-table-column>
        </template>
        <template slot-scope="scope">
          <span v-if="x.active">
            <span
              v-for="(x2, index2) in x.active"
              :key="index2"
            >
              <span
                v-show="x2.condition ? x2.condition(scope.row) : true"
                size="mini"
                :style="{
                  margin: '0 5px',
                  color: x2.color,
                  cursor: 'pointer',
                }"
                @click.stop="
                  operation(
                    x2.methods,
                    scope.row,
                    scope.row[x.prop],
                    x.prop,
                    scope.$index
                  )
                "
              >{{ x2.name }}</span>
            </span>
          </span>
          <span v-else-if="x.button">
            <el-button
              v-show="o.condition ? o.condition(scope.row) : true"
              v-for="(o, key) in x.button"
              :key="key"
              @click.stop="
                operation(
                  o.methods,
                  scope.row,
                  scope.row[x.prop],
                  x.prop,
                  scope.$index
                )
              "
              :type="o.type"
              :circle="o.circle"
              :icon="o.icon"
              size="mini"
            >
              <template v-show="o.name">
                {{ o.name }}
              </template>
            </el-button>
          </span>
          <span v-else-if="x.render && !x.component">{{
            x.render(scope.row)
          }}</span>
          <span v-else-if="x.routerName">
            <a
              :style="{
                color: theme,
                'text-decoration': 'underline',
                cursor: 'pointer',
              }"
              @click="handleActive(scope.row, x.routerName)"
            >
              <span
                v-if="!x.format"
                v-html="scope.row[x.prop]"
              ></span>
              <span v-else>{{ x.format(scope.row[x.prop], scope.row) }}</span>
            </a>
          </span>
          <span v-else-if="x.component">
            <span v-if="scope.row['update']">
              <span v-if="x.component.type == 'input' && x.component.inputChange">
                <el-input
                  v-model="scope.row[x.prop]"
                  :type="x.component.inputType || 'text'"
                  size="mini"
                  @change="
                    operation(
                      x.component.inputChange,
                      scope.row,
                      scope.row[x.prop],
                      x.prop,
                      scope.$index
                    )
                  "
                ></el-input>
              </span>
              <span v-else-if="
                  x.component.type == 'input' &&
                  x.component.inputType == 'number'
                ">
                <el-input
                  v-model="scope.row[x.prop]"
                  @input="
                    operation(
                      x.component.methods,
                      scope.row,
                      scope.row[x.prop],
                      x.prop,
                      scope.$index
                    )
                  "
                  :type="x.component.inputType || 'text'"
                  size="mini"
                ></el-input>
              </span>
              <span v-else-if="
                  x.component.type == 'input' &&
                  x.component.inputType != 'number'
                ">
                <el-input
                  v-model="scope.row[x.prop]"
                  :type="x.component.inputType || 'text'"
                  size="mini"
                ></el-input>
              </span>
              <span v-else-if="x.component.selectChange">
                <el-select
                  :multiple="x.component.multiple"
                  value-key="label"
                  filterable
                  clearable
                  v-model="scope.row[x.prop]"
                  size="mini"
                  @change="
                    operation(
                      x.component.methods,
                      scope.row,
                      scope.row[x.prop],
                      x.prop,
                      scope.$index
                    )
                  "
                >
                  <el-option
                    v-for="x2 in scope.row[x.component.prop]"
                    :key="x2.value"
                    :label="x2.label"
                    :value="x2"
                  ></el-option>
                </el-select>
              </span>
              <span v-else-if="x.component.type == 'select'">
                <el-select
                  v-model="scope.row[x.prop]"
                  size="mini"
                  :multiple="x.component.multiple"
                  clearable
                  filterable
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
                  @change="
                    operation(
                      x.component.methods,
                      scope.row,
                      scope.row[x.prop],
                      x.prop,
                      scope.$index
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
                      scope.$index
                    )
                  "
                  v-model="scope.row[x.prop]"
                  type="datetime"
                  editable
                  clearable
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd HH:mm"
                  format="yyyy-MM-dd HH:mm"
                  style="width: 100%"
                ></el-date-picker>
              </span>
              <span v-else-if="x.component.type == 'time'">
                <el-time-select
                  size="mini"
                  style="width:100%"
                  v-model="scope.row[x.prop]"
                  :picker-options="{
    start: '00:00',
    step: '00:15',
    end: '24:00'
  }"
                  :placeholder="x.placeholder"
                >
                </el-time-select>
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
                  v-model="scope.row[x.prop]"
                  :fetch-suggestions="
                    (queryString, cb) => {
                      fetchsuggertions(queryString, cb, x.component.methods);
                    }
                  "
                  @select="(item) => getRemote(row, item, x.component.methods)"
                >
                  <template slot-scope="{ item }">
                    <div style="border-bottom: 1px dashed #8c8e8e">
                      <el-form
                        label-width="100px"
                        inline
                      >
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
                  {{ scope.row[x.prop] }}</el-tag>
              </span>
            </span>
            <span v-else>{{ scope.row[x.prop] }}</span>
          </span>
          <span v-else-if="x.format">{{
            x.format(scope.row[x.prop], scope.row)
          }}</span>
          <span
            v-else
            v-html="scope.row[x.propName ? x.propName : x.prop]"
          ></span>
        </template>
      </el-table-column>

      <el-table-column
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
            @click="editRow(scope.row)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            circle
            size="mini"
            @click="delRow(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <div>
      <div
        v-if="showPagination"
        class="flex_row_spaceBtn pagination"
      >
        <div v-show="sysID > 0">
          <span
            @click="toPageSetting"
            class="primaryColor"
          >SysID:{{ sysID }}
          </span>
        </div>
        <div class="flex">
          <div
            class="footer_label"
            v-show="multipleSelection.length != 0"
          >
            已选[<span style="color: red; font-weight: bold">{{
              multipleSelection.length
            }}</span>]
          </div>
          <el-pagination
            background
            @size-change="pageSize"
            :current-page="pagination.pageIndex"
            :page-sizes="[32, 100, 150, 200, 250, 300, 350, 400]"
            :page-size="pagination.pageSize"
            :total="pagination.pageTotal"
            @current-change="pageChange"
            layout="total, sizes, prev, pager, next,jumper"
          >
          </el-pagination>
        </div>
      </div>
      <div
        v-else
        class="flex_row_spaceBtn pagination"
      >
        <div v-show="sysID > 0">
          <span
            @click="toPageSetting"
            class="primaryColor"
          >SysID:{{ sysID }}
          </span>
        </div>
        <div>
          <span>共{{ pagination.pageTotal }}条数据</span>
        </div>
      </div>
    </div>
    <div class="clearBoth"></div>
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
    // 是否禁用没配置工艺
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
    // 是否要合并
    isspanmethods: {
      type: Boolean,
      default: false,
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
      spanmethods: [],
      spanarr: [],
      spanarr2: [],
      variable: [], //存取变量名称
      prop: [], // 存取prop
      colspan: [],
      colspanDel: [],
      theme: "#409EFF",
    };
  },
  methods: {
    // 跳转至页面配置
    toPageSetting() {
      this.$router.push({
        name: "SettingPage",
        query: { ID: this.sysID },
      });
    },
    // 编辑行
    editRow(row) {
      this.$emit("editRow", row);
    },
    // 删除行
    delRow(row) {
      this.$emit("delRow", row);
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
            this.spanmethods[index] = i;
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
            this.spanmethods[index] = i;
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
      if (val) {
        let value = JSON.parse(JSON.stringify(val));
        this.$set(this.tableData[index], prop, value);
        this.$emit("sortChange", 0, 0, this.remark, -100, row, index);
      }
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
      this.$refs.tableRef.clearSelection();
      this.$emit(
        "sortChange",
        column.order,
        column.prop,
        this.remark,
        this.filtertb
      );
    },
    // 单击行
    handleRowClick(row) {
      if (this.isChecked) {
        this.$refs.tableRef.toggleRowSelection(row);
      }
      this.$emit("handleRowClick", row, this.remark);
    },
    // 双击行
    handleRowdbClick(row, column) {
      if (this.isEdit && !row.update) {
        this.$set(row, "update", true);
      }
      this.$emit("handleRowdbClick", row, this.remark);
    },
    // 选择操作
    handleSelectionChange(val, row) {
      if (this.isMultiple) {
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
      if (this.isspanmethods && this.spanmethods) {
        for (let i = 0; i < this.spanmethods.length; i++) {
          if (columnIndex === this.spanmethods[i]) {
            //第几列合并判断
            const _row = this.spanarr[i][rowIndex];
            const _col = _row > 0 ? 1 : 0;
            return {
              rowspan: _row,
              colspan: _col,
            };
          }
        }
      } else if (this.fixspanmethods) {
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
    tableRwoClassName({ row, rowIndex }) {},
    //可编辑列加背景颜色
    tableRowClassName({ row, column, rowIndex, columnIndex }) {
      let className = null;
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
    this.$refs.tableRef.doLayout(); //解决表格错位
  },
  watch: {
    tableHeader() {
      if ((this.isSpanMethods || this.fixSpanMethods) && this.tableHeader) {
        this.header();
      }
    },
    tableData() {
      if (this.isSpanMethods && this.tableData) {
        this.info();
      }
    },
    isClear: {
      handler(newValue, oldValue) {
        if (newValue) {
          if (this.multipleSelection.length != 0) {
            this.$refs.plxTable.clearSelection();
          }
        }
      },
      deep: true,
    },
  },
  computed: {},
  created() {},
};
</script>