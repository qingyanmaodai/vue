<template>
  <!-- :keyboard-config="{isArrow: true, isDel: false, isEnter: true, isTab: true, isEdit: true}" -->
  <!-- :custom-config="{storage: true, checkMethod: checkColumnMethod}" -->
  <!-- :span-method="arraySpanMethod" -->
  <!-- :scroll-x="{enable: false, gt: -1}" -->
  <!-- :scroll-y="{enable: false, gt: -1}" -->
  <!-- :footer-method="footerMethod" -->
  <!-- show-overflow  show-overflow-->
  <div div class="flex_column" style="height: 100%;">
    <div class="table-container">
      <vxe-toolbar ref="xToolbar1" custom print class="toolbar" v-show="isToolbar">
      </vxe-toolbar>
      <vxe-table ref="vxeTable" border highlight-current-row highlight-hover-row id="vxeTable_1" :height="height"
        size="mini" show-overflow :loading="tableLoading" :cell-class-name="tableCellClassName"
        :row-class-name="tableRowClassName" :checkbox-config="{
          checkMethod: checCheckboxkMethod,
          highlight: true,
          checkField: 'isChecked',
        }" :custom-config="{ storage: true, checkMethod: checkColumnCustomMethod }" :mouse-config="{ selected: true }"
        :cell-style="cellStyle" auto-resize resizable :print-config="{}" :show-footer="showFooter"
        :footer-method="footerMethod" @checkbox-change="handleSelectionChange" @checkbox-all="handleSelectionChange"
        @cell-click="handleRowClick" @cell-dblclick="handleRowdbClick" @sort-change="sortChange"
        @custom="toolbarCustomEvent" :keep-source="keepSource" :span-method="rowspanMethod">
        <vxe-column :reserve-selection="true" type="checkbox" fixed="left" width="45" style="height: 27.42px"
          v-if="hasSelect"></vxe-column>
        <vxe-column type="seq" min-width="60" v-if="IsIndex" title="序号"></vxe-column>
        <vxe-column v-for="(x, z) in tableHeaderChange" :key="z" :resizable="true"
          :tree-node="z == 0 ? true : x.treeNode ? x.treeNode : false" :sortable="x.sortable == 'custom' ? true : false"
          :field="x.prop" :title="x.label" :min-width="x.width" :fixed="x.fix"
          :filters="x.filters ? [{ data: '' }] : [{ data: '' }]" :filter-method="filterMethod"
          :filter-recover-method="filterRecoverMethod" :align="x.align">
          <template #filter="{ $panel, column }">
            <input class="my-input" type="type" v-for="(option, index) in column.filters" :key="index"
              v-model.trim="option.data" @input="$panel.changeOption($event, !!option.data, option)"
              @keyup.enter="$panel.confirmFilter()" placeholder="按回车确认筛选" style="margin: 10px; height: 35px" />
          </template>
          <template v-if="x.children">
            <vxe-column :field="i.prop" :title="i.label" v-for="(i, k) in x.children" :align="i.align"
              :tree-node="z == 0 ? true : x.treeNode ? x.treeNode : false" :key="k" :fixed="i.fix"
              :filters="x.filters ? [{ data: '' }] : [{ data: '' }]" :filter-method="filterMethod"
              :filter-recover-method="filterRecoverMethod">
              <template #filter="{ $panel, column }">
                <input class="my-input" type="type" v-for="(option, index) in column.filters" :key="index"
                  v-model="option.data" @input="$panel.changeOption($event, !!option.data, option)"
                  @keyup.enter="$panel.confirmFilter()" placeholder="按回车确认筛选" style="margin: 10px; height: 35px" />
              </template>
              <template slot-scope="scope">
                <span v-if="i.active">
                  <span v-for="(x2, index2) in i.active" :key="index2">
                    <span v-show="x2.condition ? x2.condition(scope.row) : true" size="mini" :style="{
                      margin: '0 5px',
                      color: x2.color,
                      cursor: 'pointer',
                    }" @click.stop="
  operation(
    x2.methods,
    scope.row,
    scope.row[i.prop],
    i.prop,
    scope.$rowIndex
  )
  ">{{ x2.name }}</span>
                  </span>
                </span>
                <span v-else-if="i.button">
                  <el-button v-show="o.condition ? o.condition(scope.row) : true" v-for="(o, key) in i.button" :key="key"
                    plain @click.stop="
                      operation(
                        o.methods,
                        scope.row,
                        scope.row[i.prop],
                        i.prop,
                        scope.$rowIndex
                      )
                      " :type="o.type" :circle="o.circle" :icon="o.icon" size="mini">
                    <template v-show="o.name">
                      {{ o.name }}
                    </template>
                  </el-button>
                </span>
                <span v-else-if="i.render && !i.component">{{
                  i.render(scope.row)
                }}</span>
                <span v-else-if="i.routerName">
                  <a :style="{
                    color: theme,
                    'text-decoration': 'underline',
                    cursor: 'pointer',
                  }" @click="handleActive(scope.row, i.routerName, i.prop)">
                    <span v-if="!i.format" v-html="scope.row[i.prop]"></span>
                    <span v-else>{{
                      i.format(scope.row[i.prop], scope.row)
                    }}</span>
                  </a>
                </span>
                <span v-else-if="i.component">
                  <span v-if="scope.row['update']">
                    <span v-if="i.component.type == 'input' && i.component.inputChange
                      ">
                      <el-input v-model="scope.row[i.prop]" :type="i.component.inputType || 'text'" size="mini" :rows="1"
                        @change="
                          operation(
                            i.component.inputChange,
                            scope.row,
                            scope.row[i.prop],
                            i.prop,
                            scope.$rowIndex
                          )
                          ">
                      </el-input>
                    </span>
                    <span v-else-if="i.component.inputType == 'number'">
                      <el-input v-model="scope.row[i.prop]" @input="
                        operation(
                          i.component.methods,
                          scope.row,
                          scope.row[i.prop],
                          i.prop,
                          scope.$rowIndex
                        )
                        " @keyup.enter.native="
    operation2(
      x.component.methods2,
      scope.row,
      scope.row[x.prop],
      x.prop,
      scope.$rowIndex
    )
    " type="number" size="mini"></el-input>
                    </span>
                    <span v-else-if="i.component.type == 'input' &&
                      i.component.inputType != 'number'
                      ">
                      <el-input v-model="scope.row[i.prop]" :type="i.component.inputType || 'text'" size="mini" :rows="1"
                        @input="
                          operation(
                            i.component.methods,
                            scope.row,
                            scope.row[i.prop],
                            i.prop,
                            scope.$rowIndex
                          )
                          "></el-input>
                    </span>
                    <span v-else-if="i.component.type == 'select' && i.component.selectChange
                      ">
                      <el-select filterable clearable :multiple="i.component.multiple" value-key="label"
                        :disabled="i.component.disabled" v-model="scope.row[i.prop]" size="mini" @change="
                          operation(
                            i.component.methods,
                            scope.row,
                            scope.row[i.prop],
                            i.prop,
                            scope.$rowIndex
                          )
                          ">
                        <el-option v-for="x2 in scope.row[i.component.prop]" :key="x2.value" :label="x2.label"
                          :value="x2.value"></el-option>
                      </el-select>
                    </span>
                    <span v-else-if="i.component.type == 'select'">
                      <el-select filterable clearable :multiple="i.component.multiple" v-model="scope.row[i.prop]"
                        size="mini" :disabled="i.component.disabled" placeholder>
                        <el-option v-for="x2 in scope.row[i.component.prop]" :key="x2.value" :label="x2.label"
                          :value="x2.value"></el-option>
                      </el-select>
                    </span>
                    <span v-else-if="i.component.type == 'date'">
                      <el-date-picker size="mini" @change="
                        operation(
                          i.component.methods,
                          scope.row,
                          scope.row[i.prop],
                          i.prop,
                          scope.$rowIndex
                        )
                        " v-model="scope.row[i.prop]" type="date" editable clearable placeholder="选择日期"
                        :picker-options="getPickerTime(scope.row)" value-format="yyyy-MM-dd"
                        style="width: 100%"></el-date-picker>
                    </span>
                    <span v-else-if="i.component.type == 'datetime'">
                      <el-date-picker size="mini" @change="
                        operation(
                          i.component.methods,
                          scope.row,
                          scope.row[i.prop],
                          i.prop,
                          scope.$rowIndex
                        )
                        " v-model="scope.row[i.prop]" type="datetime" editable clearable placeholder="选择日期"
                        value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss"
                        style="width: 100%"></el-date-picker>
                    </span>
                    <span v-else-if="i.component.type == 'time'">
                      <el-time-select size="mini" style="width: 100%" v-model="scope.row[i.prop]" :picker-options="{
                        start: '00:00',
                        step: '00:15',
                        end: '24:00',
                      }" :placeholder="i.placeholder">
                      </el-time-select>
                    </span>
                    <span v-else-if="i.component.type == 'checkbox'">
                      <el-checkbox v-model="scope.row[i.prop]" @change="
                        operation(
                          i.component.methods,
                          scope.row,
                          scope.row[i.prop],
                          i.prop,
                          scope.$rowIndex
                        )
                        "></el-checkbox>
                    </span>
                    <span v-else-if="i.component.type == 'switch'">
                      <el-switch v-model="scope.row[i.prop]" :active-color="i.component.activeColor"
                        :inactive-color="i.component.inactiveColor" :active-value="i.component.activeValue"
                        :inactive-value="i.component.inactiveValue"></el-switch>
                    </span>
                    <span v-else-if="i.component.type == 'autocomplete'">
                      <el-autocomplete size="mini" v-model="scope.row[i.prop]" :fetch-suggestions="(queryString, cb) => {
                        fetchsuggertions(
                          queryString,
                          cb,
                          i.component.methods
                        );
                      }
                        " @select="(item) => getRemote(row, item, i.component.methods)
    ">
                        <template slot-scope="{ item }">
                          <div style="border-bottom: 1px dashed #8c8e8e">
                            <el-form label-width="100px" inline>
                              <el-form-item style="margin-bottom: 5px" :label="i.component.label"><span
                                  style="color: orange">{{
                                    item[i.component.prop]
                                  }}</span>
                              </el-form-item>
                              <el-form-item style="margin-bottom: 5px" :label="i.component.label2"><span
                                  style="color: orange">{{
                                    item[i.component.prop2]
                                  }}</span>
                              </el-form-item>
                            </el-form>
                          </div>
                        </template>
                      </el-autocomplete>
                    </span>
                    <span v-else-if="i.component.type == 'tag'">
                      <el-tag class="table_tag" @click.stop.native="i.component.handleClick(scope.row)">
                        {{ scope.row[i.prop] }}</el-tag>
                    </span>
                  </span>
                  <span v-else>{{ scope.row[i.prop] }}</span>
                </span>
                <span v-else-if="i.format">{{
                  i.format(scope.row[i.prop], scope.row)
                }}</span>
                <span v-else v-html="scope.row[i.propName ? i.propName : i.prop]"></span>
              </template>
            </vxe-column>
            <vxe-column v-if="isEditDel" label="操作" prop="" fixed="right" width="85px">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" circle size="mini"
                  @click="editRow(scope.row, scope.$rowIndex)"></el-button>
                <el-button type="danger" icon="el-icon-delete" circle size="mini"
                  @click="delRow(scope.row, scope.$rowIndex)"></el-button>
              </template>
            </vxe-column>
          </template>
          <template slot-scope="scope">
            <span v-if="x.active">
              <span v-for="(x2, index2) in x.active" :key="index2">
                <span v-show="x2.condition ? x2.condition(scope.row) : true" size="mini" :style="{
                  margin: '0 5px',
                  color: x2.color,
                  cursor: 'pointer',
                }" @click.stop="
  operation(
    x2.methods,
    scope.row,
    scope.row[x.prop],
    x.prop,
    scope.$rowIndex
  )
  ">{{ x2.name }}</span>
              </span>
            </span>
            <span v-else-if="x.button">
              <el-button v-show="o.condition ? o.condition(scope.row) : true" v-for="(o, key) in x.button" :key="key"
                plain @click.stop="
                  operation(
                    o.methods,
                    scope.row,
                    scope.row[x.prop],
                    x.prop,
                    scope.$rowIndex
                  )
                  " :type="o.type" :circle="o.circle" :icon="o.icon" size="mini">
                <template v-show="o.name">
                  {{ o.name }}
                </template>
              </el-button>
            </span>
            <span v-else-if="x.render">{{ x.render(scope.row) }}</span>
            <span v-else-if="x.routerName">
              <a :style="{
                color: theme,
                'text-decoration': 'underline',
                cursor: 'pointer',
              }" @click="handleActive(scope.row, x.routerName, x.prop)">
                <span v-if="!x.format" v-html="scope.row[x.prop]"></span>
                <span v-else>{{ x.format(scope.row[x.prop], scope.row) }}</span>
              </a>
            </span>
            <span v-else-if="x.component">
              <span v-if="scope.row['update']">
                <span v-if="x.component.type == 'input' && x.component.inputChange">
                  <el-input v-model="scope.row[x.prop]" :type="x.component.inputType || 'text'"
                    :disabled="scope.row[x.component.disabled]" size="mini" :rows="1" @input="
                      operation(
                        x.component.methods,
                        scope.row,
                        scope.row[x.prop],
                        x.prop,
                        scope.$rowIndex
                      )
                      " @change="
    operation(
      x.component.inputChange,
      scope.row,
      scope.row[x.prop],
      x.prop,
      scope.$rowIndex
    )
    "></el-input>
                </span>
                <span v-else-if="x.component.inputType == 'number'">
                  <el-input v-model="scope.row[x.prop]" @input="
                    operation(
                      x.component.methods,
                      scope.row,
                      scope.row[x.prop],
                      x.prop,
                      scope.$rowIndex
                    )
                    " :disabled="scope.row[x.component.disabled]" @keyup.enter.native="
    operation2(
      x.component.methods2,
      scope.row,
      scope.row[x.prop],
      x.prop,
      scope.$rowIndex
    )
    " type="number" size="mini"></el-input>
                </span>
                <span v-else-if="x.component.type == 'input' &&
                  x.component.inputType != 'number'
                  ">
                  <el-input v-model="scope.row[x.prop]" :type="x.component.inputType || 'text'" :rows="1"
                    :disabled="scope.row[x.component.disabled]" size="mini" @blur="
                      operation(
                        x.component.methods,
                        scope.row,
                        scope.row[x.prop],
                        x.prop,
                        scope.$rowIndex
                      )
                      "></el-input>
                </span>
                <span v-else-if="x.component.selectChange">
                  <el-select filterable clearable :multiple="x.component.multiple"
                    :disabled="scope.row[x.component.disabled]" value-key="label" v-model="scope.row[x.prop]" size="mini"
                    @change="
                      operation(
                        x.component.methods,
                        scope.row,
                        scope.row[x.prop],
                        x.prop,
                        scope.$rowIndex
                      )
                      ">
                    <el-option v-for="x2 in scope.row[x.component.prop]" :key="x2.value" :label="x2.label"
                      :value="x2.value"></el-option>
                  </el-select>
                </span>
                <span v-else-if="x.component.type == 'select'">
                  <el-select v-model="scope.row[x.prop]" size="mini" :multiple="x.component.multiple"
                    :disabled="scope.row[x.component.disabled]" filterable clearable>
                    <el-option v-for="x2 in scope.row[x.component.prop]" :key="x2.value" :label="x2.label"
                      :value="x2.value"></el-option>
                  </el-select>
                </span>
                <span v-else-if="x.component.type == 'date'">
                  <el-date-picker size="mini" :disabled="scope.row[x.component.disabled] ||
                    scope.row[x.component[x.prop]]
                    ? true
                    : false
                    " @change="
    operation(
      x.component.methods,
      scope.row,
      scope.row[x.prop],
      x.prop,
      scope.$rowIndex
    )
    " v-model="scope.row[x.prop]" type="date" editable clearable placeholder="选择日期"
                    :picker-options="getPickerTime(scope.row)" value-format="yyyy-MM-dd"
                    style="width: 100%"></el-date-picker>
                </span>
                <span v-else-if="x.component.type == 'datetime'">
                  <el-date-picker size="mini" @change="
                    operation(
                      x.component.methods,
                      scope.row,
                      scope.row[x.prop],
                      x.prop,
                      scope.$rowIndex
                    )
                    " v-model="scope.row[x.prop]" type="datetime" editable clearable
                    :disabled="scope.row[x.component.disabled]" placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss"
                    format="yyyy-MM-dd HH:mm:ss" style="width: 100%"></el-date-picker>
                </span>
                <span v-else-if="x.component.type == 'time'">
                  <el-time-select size="mini" style="width: 100%" :disabled="scope.row[x.component.disabled]"
                    v-model="scope.row[x.prop]" :picker-options="{
                      start: '00:00',
                      step: '00:15',
                      end: '24:00',
                    }" :placeholder="x.placeholder">
                  </el-time-select>
                </span>
                <span v-else-if="x.component.type == 'checkbox'">
                  <el-checkbox v-model="scope.row[x.prop]" @change="
                    operation(
                      x.component.methods,
                      scope.row,
                      scope.row[x.prop],
                      x.prop,
                      scope.$rowIndex
                    )
                    "></el-checkbox>
                </span>
                <span v-else-if="x.component.type == 'switch'">
                  <el-switch v-model="scope.row[x.prop]" :active-color="x.component.activeColor"
                    :inactive-color="x.component.inactiveColor" :active-value="x.component.activeValue"
                    :inactive-value="x.component.inactiveValue"></el-switch>
                </span>
                <span v-else-if="x.component.type == 'autocomplete'">
                  <el-autocomplete size="mini" :disabled="scope.row[x.component.disabled]" v-model="scope.row[x.prop]"
                    :fetch-suggestions="(queryString, cb) => {
                      fetchsuggertions(queryString, cb, x.component.methods);
                    }
                      " @select="(item) => getRemote(row, item, x.component.methods)
    ">
                    <template slot-scope="{ item }">
                      <div style="border-bottom: 1px dashed #8c8e8e">
                        <el-form label-width="100px" inline>
                          <el-form-item style="margin-bottom: 5px" :label="x.component.label"><span
                              style="color: orange">{{
                                item[x.component.prop]
                              }}</span>
                          </el-form-item>
                          <el-form-item style="margin-bottom: 5px" :label="x.component.label2"><span
                              style="color: orange">{{
                                item[x.component.prop2]
                              }}</span>
                          </el-form-item>
                        </el-form>
                      </div>
                    </template>
                  </el-autocomplete>
                </span>
                <span v-else-if="x.component.type == 'tag'">
                  <el-tag class="table_tag" @click.stop.native="x.component.handleClick(scope.row)">
                    {{ scope.row[x.prop] }}</el-tag>
                </span>
              </span>
              <span v-else-if="x.component.type == 'checkbox'">
                <el-tag v-if="scope.row[x.prop] == true" size="mini" effect="light">是
                </el-tag>
                <el-tag v-else type="info" size="mini" effect="light">否
                </el-tag>
              </span>
              <span v-else-if="x.prop == 'Status'">
                <el-tag v-if="scope.row.Status == 1" size="mini" effect="light">启用
                </el-tag>
                <el-tag v-else type="danger" size="mini" effect="light">禁用
                </el-tag>
              </span>
              <span v-else v-html="scope.row[x.propName ? x.propName : x.prop]"></span>
            </span>
            <span v-else-if="x.format">{{
              x.format(scope.row[x.prop], scope.row)
            }}</span>
            <span v-else v-html="scope.row[x.propName ? x.propName : x.prop]"></span>
          </template>
        </vxe-column>
        <vxe-column v-if="isEditDel" label="操作" prop="" fixed="right" width="85px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" circle size="mini"
              @click="editRow(scope.row, scope.$rowIndex)"></el-button>
            <el-button v-show="condition ? condition(scope.row) : true" type="danger" icon="el-icon-delete" circle
              size="mini" @click="delRow(scope.row, scope.$rowIndex)"></el-button>
          </template>
        </vxe-column>
      </vxe-table>
    </div>
    <div class="flex_shrink">
      <div v-if="showPagination" class="flex_row_spaceBtn pagination">
        <div v-show="sysID > 0">
          <span @click="toPageSetting" class="primaryColor cursor">SysID:{{ sysID }}
          </span>
          <span style="color: red; font-weight: bold; margin-left: 10px">{{
            Prompt
          }}</span>
        </div>
        <div class="flex">
          <div class="footer_label" v-show="multipleSelection.length != 0">
            已选[<span style="color: red; font-weight: bold">{{
              multipleSelection.length
            }}</span>]
          </div>
          <div class="margin_right_20">
            {{ footerLabel }}
          </div>
          <el-pagination background @size-change="pageSize" :current-page="pagination.pageIndex" :page-sizes="[
            10, 20, 32, 50, 100, 150, 200, 250, 300, 350, 500, 400, 800, 1000,
            1500, 2000, 3000, 4000, 5000,
          ]" :page-size="pagination.pageSize" :total="pagination.pageTotal" @current-change="pageChange"
            layout="total, sizes, prev, pager, next,jumper">
          </el-pagination>
        </div>
      </div>
      <div v-else class="flex_row_spaceBtn pagination">
        <div v-show="sysID > 0">
          <span @click="toPageSetting" class="primaryColor cursor">SysID:{{ sysID }}
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
import XEUtils from "xe-utils";
import { GetSearchData } from "@/api/Common";
export default {
  props: {
    // 是否显示底部合计
    showFooter: {
      type: Boolean,
      default: false,
    },
    // 合计包含哪些字段
    includeFields: {
      type: Array,
      default: function () {
        return [];
      },
    },
    IsIndex: {
      type: Boolean,
      default: false,
    },
    // 传行内列样式
    cellStyle: {
      type: Function,
      default: () => {
        return null;
      },
    },
    // 行样式
    tableRowClassName: {
      type: Function,
      default: () => {
        return null;
      },
    },
    // 控制选框条件
    checCheckboxkMethod: {
      type: Function,
      default: () => {
        return true;
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
    footerLabel: {
      type: String,
      default: "",
      required: false,
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
    // 默认当前用户显示表格的列
    defaultTableHeader: {
      type: Array,
      default: function () {
        return [];
      },
      required: false,
    },
    isToolbar: {
      type: Boolean,
      default: true,
    },
    // 懒加载
    keepSource: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      Prompt: "",
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
      // 解决其他页面弹框状态下跳转到配置表弹框不关闭的bug
      this.$emit("toPageSetting");
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
      if (this.hasSelect) {
        // let index = 0;
        // for (var i = 0; i < this.tableHeader.length; i++) {
        //   if (this.tableHeader[i].isMerge) {
        //     this.spanMethods[index] = i;
        //     this.spanarr2.push([]);
        //     this.spanarr.push([]);
        //     this.prop[index] = this.tableHeader[i].prop;
        //     index++;
        //   }
        // }
        // let num2 = 0;
        // this.tableHeader.some((x, y) => {
        //   if (x.isMerge && y != this.tableHeader.length - 1) {
        //     this.colspanDel.push(y);
        //     num2++;
        //   } else if (x.isMerge && y == this.tableHeader.length - 1) {
        //     this.colspanDel.push(y);
        //     this.colspan.push({ start: y - num2, end: y });
        //     return;
        //   } else if (num2) {
        //     this.colspan.push({ start: y - num2, end: y - 1 });
        //     num2 = 0;
        //   }
        // });
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
    // 通用行合并函数（将相同多列数据合并为一行）
    rowspanMethod({ row, rowIndex, column, visibleData }) {
      let fields
      if (this.tableHeader
      ) {
        fields = this.tableHeader.map(item => {
          if (item['isMerge']) {
            return item.prop
          }
        })
      }
      let cellValue = row[column.property]
      if (cellValue && fields.includes(column.property)) {
        let prevRow = visibleData[rowIndex - 1]
        let nextRow = visibleData[rowIndex + 1]
        if (prevRow && prevRow[column.property] === cellValue) {
          console.log({ rowspan: 0, colspan: 0 });
          return { rowspan: 0, colspan: 0 }
        } else {
          let countRowspan = 1
          while (nextRow && nextRow[column.property] === cellValue) {
            nextRow = visibleData[++countRowspan + rowIndex]
          }
          if (countRowspan > 1) {
            return { rowspan: countRowspan, colspan: 1 }
          }
        }
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
    // 表格的回车事件
    operation2(methods, row, val, prop, index) {
      this.$emit(
        "keyupEnter",
        row,
        val,
        prop,
        index,
        this.remark,
        this.filtertb
      );
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
      this.$refs.vxeTable.clearCheckboxRow();
      this.$emit(
        "sortChange",
        column.order,
        column.property,
        this.remark,
        this.filtertb
      );
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
    // 选择操作
    handleSelectionChange({ records, row }) {
      if (this.isMultiple) {
        this.multipleSelection = records;
        this.$emit("selectfun", this.multipleSelection, this.remark);
      } else {
        this.multipleSelection = [];
        if (records.length > 1) {
          this.$refs.vxeTable.clearCheckboxRow();
          this.$refs.vxeTable.setCheckboxRow(row, true);
        }
        this.multipleSelection.push(row);
        this.$emit("selectfun", this.multipleSelection, this.remark);
      }
    },
    //合并同一名称
    arraySpanMethod: function ({ row, column, rowIndex, columnIndex }) {
      if (this.isSpanMethods && this.spanMethods) {
        for (var i = 0; i < this.spanMethods.length; i++) {
          let num = this.spanMethods[i];
          if (columnIndex == this.spanMethods[i] && !column.parentId) {
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
    // // 行样式控制
    // tableRowClassName({ row, rowIndex }) {
    //   let className = "";
    //   if (row["IsAdd"]) {
    //     className += "purpleBgColor";
    //   }
    //   return className;
    // },
    //可编辑列加背景颜色
    tableCellClassName({ row, column, rowIndex, columnIndex }) {
      let className = "";
      return className;
    },
    // 禁用勾选
    selectInit({ row }) {
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
    // 筛选条件
    filterMethod({ option, row, column }) {
      if (option.data) {
        if (row[column.property]) {
          return JSON.stringify(row[column.property]).includes(option.data);
        }
      }
    },
    // 筛选列选框控制
    checkColumnCustomMethod({ column }) {
      return true;
    },
    //后端筛选
    filterChange(filters) {
      // 筛选值
      let val = filters.datas[0];
      // 筛选的字段
      let property = filters.property;
      // this.remark 操作的表格下标
      this.$emit("filterChange", val, property, this.remark);
      console.log("filters", filters);
      console.log("tableHeader", this.tableHeader);
    },
    // 显示隐藏列
    toolbarCustomEvent(params) {
      const visibleColumn = this.$refs.vxeTable.getColumns();
      switch (params.type) {
        case "confirm": {
          //确认
          break;
        }
        case "reset": {
          //还原
          break;
        }
        case "close": {
          //关闭
          break;
        }
      }
    },
    filterRecoverMethod({ option }) {
      // 如果是自定义筛选模板，当为点击确认时，该选项将被恢复为默认值
      option.data = "";
    },

    // 底部合计栏
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
    async getFooterRemark() {
      let form = {};
      form["dicID"] = 33;
      form["page"] = 1;
      form["rows"] = 0;
      form["DictionaryID"] = this.sysID;
      let res = await GetSearchData(form);
      const { result, data, count, msg } = res.data;
      if (result) {
        if (data.length && data[0].Remark1) {
          this.Prompt = data[0].Remark1;
        }
      }
    },
  },
  mounted() {
    if (this.$refs.vxeTable) {
      //这个if判断是怕拿不到table报错，也可以直接在table方法后加问号 '？'
      //list是要默认显示的列field数组
      if (this.defaultTableHeader.length != 0) {
        //res是拿到表格里的所有列field数组
        const res = this.$refs.vxeTable
          .getColumns()
          .map((item) => item.property);
        //显而易见，我在遍历查找，找到了就显示没找到就隐藏噢
        res.forEach((item) => {
          const column = this.$refs.vxeTable.getColumnByField(item);
          if (this.defaultTableHeader.findIndex((x) => x === item) !== -1) {
            column && this.$refs.vxeTable.showColumn(column);
          } else {
            column && this.$refs.vxeTable.hideColumn(column);
          }
        });
      }
    }
  },
  watch: {
    tableHeader: {
      handler(newValue, oldValue) {
        if ((this.isSpanMethods || this.fixSpanMethods) && this.tableHeader) {
          this.header();
        }
        this.$set(this, "tableHeader", newValue);
      },
      deep: true,
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
      if (this.tableData && this.isSpanMethods) {
        this.info();
      }
    },
    isClear: {
      handler(newValue, oldValue) {
        if (newValue) {
          if (this.multipleSelection.length != 0) {
            this.$refs.vxeTable.clearCheckboxRow();
            this.$set(this, "multipleSelection", []);
          }
        }
      },
      immediate: true,
      deep: true,
    },
  },
  computed: {
    tableHeaderChange() {
      //如果hasSelect值存在的话
      if (this.hasSelect) {
        //删除带有选择的一列
        let isChecked = this.tableHeader.findIndex(
          (item) => item.prop == "isChecked"
        );
        if (isChecked !== -1) {
          this.tableHeader.splice(isChecked, 1);
        }
      }
      return this.tableHeader;
    },
  },
  activated() {
    // // 在 keep-alive 钩子函数中，显示之后手动调用
    // this.$nextTick(() => {
    //   this.$refs.vxeTable.recalculate();
    // });
  },
  created() {
    this.getFooterRemark();
    this.$nextTick(() => {
      // 手动将表格和工具栏进行关联
      this.$refs.vxeTable.connect(this.$refs.xToolbar1);
    });
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
</style>
