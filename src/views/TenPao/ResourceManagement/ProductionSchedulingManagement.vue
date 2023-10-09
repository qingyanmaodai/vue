<!--设备与工装汇总-->
<template>
  <div class="APSContainer flex_column content_height" v-loading="adminLoading">
    <splitpanes class="default-theme" horizontal>
      <pane :size="60">
        <div class="flex_column" style="width: 100%; height: 100%">
          <div class="admin_head" ref="headRef">
            <ComSearch
              ref="searchRef"
              :searchData="formSearchs[0].datas"
              :searchForm="formSearchs[0].forms"
              :remark="0"
              :isLoading="isLoading"
              :btnForm="btnForm"
              @btnClick="btnClick"
              :signName="0"
            />
          </div>
          <!-- <div class="ant-table-title" ref="headRef_2">
            <el-row>
              <el-col :span="4"><span class="title">{{ title }}</span></el-col>
              <el-col :span="20" class="flex_flex_end">
                <span>新增行数：</span>
                <el-input-number v-model.trim="addNum" :min="1" :max="100" :step="10" placeholder="请输入"
                  size="small"></el-input-number>
                <el-divider direction="vertical"></el-divider></el-col>
            </el-row>
          </div> -->
          <div v-for="item in [0]" :key="item" class="admin_content flex_grow">
            <ComVxeTable
              :ref="`tableRef${item}`"
              :rowKey="'RowNumber'"
              height="100%"
              :tableData="tableData[item]"
              :tableHeader="tableColumns[item]"
              :tableLoading="tableLoading[item]"
              :isToolbar="false"
              :remark="item"
              :sysID="sysID[item]['ID']"
              :hasSelect="hasSelect[item]"
              :isEdit="isEdit[item]"
              :isClear="isClear[item]"
              :keepSource="true"
              :pagination="tablePagination[item]"
              @pageChange="pageChange"
              @pageSize="pageSize"
              @sortChange="sortChange"
              @selectfun="selectFun"
              @handleRowClick="handleRowClick"
            />
            <!-- <ComSpreadTable
              ref="spreadsheetRef"
              height="100%"
              :tableData="tableData[0]"
              :tableColumns="tableColumns[0]"
              :tableLoading="tableLoading[0]"
              :remark="0"
              :sysID="sysID[0]['ID']"
              :pagination="tablePagination[0]"
              @pageChange="pageChange"
              @pageSize="pageSize"
              @workbookInitialized="workbookInitialized"
              @selectChanged="selectChanged"
            /> -->
          </div>
        </div>
      </pane>
      <pane :size="40">
        <div class="flex_column" style="width: 100%; height: 100%">
          <div
            class="admin_head"
            ref="headRef"
            v-for="item in [1, 2, 3]"
            :key="item + 'head'"
            v-show="Number(selectedIndex) === item"
          >
            <ComSearch
              ref="searchRef"
              :searchData="formSearchs[item].datas"
              :searchForm="formSearchs[item].forms"
              :remark="item"
              :isLoading="isLoading"
              :btnForm="btnForm"
              @btnClick="btnClick"
              :signName="item"
            />
          </div>
          <!-- <div class="ant-table-title" ref="headRef_2">
            <el-row>
              <el-col :span="6"><el-tabs v-model="selectedIndex" @tab-click="handleClick" :stretch="true">
                  <el-tab-pane label="关联产品配置" name="1"></el-tab-pane>
                  <el-tab-pane label="关联产品族" name="2"></el-tab-pane>
                  <el-tab-pane label="TPM设备明细" name="3"></el-tab-pane> </el-tabs></el-col>
              <el-col :span="18" class="flex_flex_end">
                <el-divider direction="vertical"></el-divider>
                <el-button type="primary" size="mini" @click="AddEvent(1)" v-show="selectedIndex === '1'">
                  添加产品
                </el-button>
                <el-button type="primary" size="mini" @click="AddEvent(2)" v-show="selectedIndex === '2'">
                  添加产品族
                </el-button>
                <el-button type="primary" size="mini" @click="AddEvent(3)" v-show="selectedIndex === '3'">
                  添加TPM设备
                </el-button>
              </el-col>
            </el-row>
          </div> -->
          <div v-for="item in [1]" :key="item" class="admin_content flex_grow">
            <ComVxeTable
              :ref="`tableRef${item}`"
              :rowKey="'RowNumber'"
              height="100%"
              :tableData="tableData[item]"
              :tableHeader="tableColumns[item]"
              :tableLoading="tableLoading[item]"
              :isToolbar="false"
              :remark="item"
              :sysID="sysID[item]['ID']"
              :hasSelect="hasSelect[item]"
              :isEdit="isEdit[item]"
              :isClear="isClear[item]"
              :keepSource="true"
              :pagination="tablePagination[item]"
              @handleRowdbClick="handleRowdbClick"
              @pageChange="pageChange"
              @pageSize="pageSize"
              @sortChange="sortChange"
              @selectfun="selectFun"
              :treeConfig="{
                children: 'children',
                iconOpen: 'vxe-icon-square-minus-fill',
                iconClose: 'vxe-icon-square-plus-fill',
              }"
            />
          </div>
        </div>
      </pane>
    </splitpanes>
    <!-- 弹框-->
    <el-dialog
      :title="'计划调整'"
      :visible.sync="colDialogVisible2"
      width="70%"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      ><div
        style="
          height: 60vh;
          overflow-x: hidden;
          display: flex;
          flex-direction: column;
        "
      >
        <div class="ant-table-title">
          <el-row>
            <el-col :span="6"
              ><span class="title">销售订单：{{ SalesOrderNo }}</span></el-col
            >
            <el-col :span="6"
              ><span class="title">行项目：{{ SalesLineNum }} </span></el-col
            >
            <el-col :span="6"
              ><span class="title">交期：{{ SalesDeliveryDate }} </span></el-col
            >
            <el-col :span="6"
              ><span class="title">前置期： {{ FrontDate }} </span></el-col
            >
          </el-row>
        </div>
        <div v-for="item in [2]" :key="item" class="flex_grow">
          <ComVxeTable
            :ref="`tableRef${item}`"
            :rowKey="'RowNumber'"
            height="100%"
            :tableData="tableData[item]"
            :tableHeader="tableColumns[item]"
            :tableLoading="tableLoading[item]"
            :isToolbar="false"
            :remark="item"
            :sysID="sysID[item]['ID']"
            :hasSelect="true"
            :isEdit="isEdit[item]"
            :isClear="isClear[item]"
            :keepSource="true"
            :pagination="tablePagination[item]"
            @pageChange="pageChange"
            @pageSize="pageSize"
            @sortChange="sortChange"
            @selectfun="selectFun"
          />
        </div>
        <div style="height: 40px; margin-top: 6px">
          <el-row>
            <el-col :span="6">
              <div>
                原因:<el-select
                  clearable
                  filterable
                  size="small"
                  placeholder="请选择原因"
                  v-model="ChangeReason"
                >
                  <el-option
                    v-for="(item, i) in ChangeReasonArray"
                    :key="i"
                    :label="item.value"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
            </el-col>
            <el-col :span="6"
              ><span class="title">
                <div>
                  备注:
                  <el-input
                    size="small"
                    v-model="Extend1"
                    style="width: 160px"
                    placeholder="请输入备注"
                  ></el-input>
                </div> </span
            ></el-col>
          </el-row>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-checkbox v-model="IgnoreSunday" border style="margin-right: 10px"
          >忽略周日</el-checkbox
        >
        <el-button type="primary" @click="Reschedule()">重算排期</el-button>
        <el-button type="primary" @click="dataSave2()">确定</el-button>
        <el-button @click="colDialogVisible2 = false">取消</el-button>
      </span>
    </el-dialog>
    <!-- <DialogTable title="添加产品" :tableDialog="colDialogVisible2" :sysID="sysID[2]['ID']" width="80%" :hasSelect="true"
      @closeDialog="colDialogVisible2 = false" :searchForm="formSearchs[2]" :isToolbar="false" :isConfirmBtn="true"
      @confirmDialog="confirmDialog"></DialogTable> -->
    <!-- <DialogTable title="添加产品族" :tableDialog="colDialogVisible5" :sysID="sysID[5]['ID']" width="80%" :hasSelect="true"
      @closeDialog="colDialogVisible5 = false" :searchForm="formSearchs[5]" :isToolbar="false" :isConfirmBtn="true"
      @confirmDialog="confirmDialog"></DialogTable>
    <DialogTable title="添加TPM设备" :tableDialog="colDialogVisible6" :sysID="sysID[6]['ID']" width="80%" :hasSelect="true"
      @closeDialog="colDialogVisible6 = false" :searchForm="formSearchs[6]" :isToolbar="false" :isConfirmBtn="true"
      @confirmDialog="confirmDialog"></DialogTable> -->
  </div>
</template>

<script>
var _this;
import { Splitpanes, Pane } from 'splitpanes';
import 'splitpanes/dist/splitpanes.css';
import ComSearch from '@/components/ComSearch';
import ComVxeTable from '@/components/ComVxeTable';
import ComSpreadTable from '@/components/ComSpreadTable';
import ComReportTable from '@/components/ComReportTable';
import DialogTable from '@/components/Dialog/dialogTable';
import '@grapecity/spread-sheets-vue';
import GC from '@grapecity/spread-sheets';
const GCsheets = GC.Spread.Sheets;
GC.Spread.Common.CultureManager.culture('zh-cn');
import '@grapecity/spread-sheets/styles/gc.spread.sheets.excel2013white.css';
import { HeaderCheckBoxCellType } from '@/static/data.js';
import {
  GetHeader,
  GetSearchData,
  ExportData,
  SaveData,
  GetServerTime,
  GetSearch,
} from '@/api/Common';
export default {
  name: 'ProductionSchedulingManagement',
  components: {
    ComSearch,
    ComVxeTable,
    ComReportTable,
    Splitpanes,
    Pane,
    DialogTable,
    ComSpreadTable,
  },
  data() {
    return {
      ////////////////// Search /////////////////
      footerLabel: [''],
      selectionData: [[], [], [], [], [], [], []],
      title: this.$route.meta.title,
      includeFields: [[], [], []],
      formSearchs: [
        {
          datas: {},
          forms: [],
          required: [], //获取必填项
        },
        {
          datas: {},
          forms: [],
          required: [], //获取必填项
        },
        {
          datas: {},
          forms: [],
          required: [], //获取必填项
        },
        {
          datas: {},
          forms: [],
          required: [], //获取必填项
        },
        {
          datas: {},
          forms: [],
          required: [], //获取必填项
        },
        {
          datas: {},
          forms: [],
          required: [], //获取必填项
        },
        {
          datas: {},
          forms: [],
          required: [], //获取必填项
        },
      ],
      btnForm: [],
      tableData: [[], [], [], [], [], [], []],
      spread: [],
      tableColumns: [[], [], [], [], [], [], []],
      tableLoading: [false, false, false, false, false, false, false],
      isClear: [false, false, false, false, false, false, false],
      hasSelect: [false, false, false, false, false, false, false],
      tablePagination: [
        { pageIndex: 1, pageSize: 20, pageTotal: 0 },
        { pageIndex: 1, pageSize: 20, pageTotal: 0 },
        { pageIndex: 1, pageSize: 20, pageTotal: 0 },
        { pageIndex: 1, pageSize: 20, pageTotal: 0 },
        { pageIndex: 1, pageSize: 20, pageTotal: 0 },
        { pageIndex: 1, pageSize: 20, pageTotal: 0 },
        { pageIndex: 1, pageSize: 20, pageTotal: 0 },
      ],
      tagRemark: 0,
      isLoading: false,
      adminLoading: false,
      OrderNo: '',
      OrderNoValue: '',
      OrderNos: [],
      Status1: [
        { label: '待确认', value: '未开始' },
        { label: '已完成', value: '已完成' },
        { label: '全部', value: '' },
      ],
      Status2: [
        { label: '全部', value: 0 },
        { label: '未点检', value: 1 },
        { label: '异常', value: 2 },
        { label: '已领未点', value: 3 },
      ],
      labelStatus1: 0,
      labelStatus2: 0,
      sysID: [
        { ID: 11150 },
        { ID: 11149 },
        { ID: 5139 },
        { ID: 11148 },
        { ID: 1180 },
        { ID: 11142 },
        { ID: 133 },
      ],
      isEdit: [false, false, true, false, false, false, false],
      userInfo: {},
      selectedIndex: '1',
      colDialogVisible2: false,
      colDialogVisible5: false,
      colDialogVisible6: false,
      addNum: 1,
      DataSourceList: [{}],
      ChangeReason: null,
      ChangeReasonArray: [],
      Extend1: null,
      SalesOrderNo: null,
      SalesLineNum: null,
      SalesDeliveryDate: null,
      FrontDate: null,
      IgnoreSunday: true,
    };
  },
  watch: {},
  created() {
    _this = this;
    this.adminLoading = true;
    this.userInfo = this.$store.getters.userInfo;
    this.getTableHeader();
    // 获取所有按钮
    this.btnForm = this.$route.meta.btns;
    this.judgeBtn(this.btnForm);
  },
  mounted() {},
  methods: {
    //按钮权限
    judgeBtn(routeBtn) {
      if (routeBtn && routeBtn.length > 0)
        routeBtn.some((item, index) => {
          if (item.ButtonCode == 'save') {
            //假如signName为空，则所有表都显示保存按钮而且全部可编辑，假如不为空，则控制哪个表才可以编辑
            if (!item['signName'] || item['signName'].length === 0) {
              this.isEdit.fill(true);
            } else if (item['signName'] && item['signName'].length > 0) {
              item['signName'].map((item) => {
                this.$set(this.isEdit, item, true);
              });
            }
          }
        });
      this.$set(this, 'btnForm', routeBtn);
    },
    //获取子组件实例
    workbookInitialized: function (workbook, remarkTb) {
      this.spread[remarkTb] = workbook;
    },
    //获取当前选中行的值
    selectChanged(newValue, remarkTb) {
      // 在子组件计算属性发生变化时，更新父组件的计算属性
      this.selectionData[remarkTb] = newValue;
    },
    // 第几页
    pageChange(val, remarkTb, filtertb) {
      this.$set(this.tablePagination[remarkTb], 'pageIndex', val);
      this.getTableData(this.formSearchs[remarkTb].datas, remarkTb);
    },
    // 页数
    pageSize(val, remarkTb, filtertb) {
      this.$set(this.tablePagination[remarkTb], 'pageSize', val);
      this.getTableData(this.formSearchs[remarkTb].datas, remarkTb);
    },
    // 排序
    sortChange(order, prop, remarkTb, filtertb, row, index) {
      if (filtertb == -100) {
        // 改变父表格的行数据
        this.changeTableRowData(remarkTb, row, index);
        return;
      }
      if (order) {
        if (order === 'desc') {
          this.formSearchs[remarkTb].datas['sort'] = prop + ' DESC';
        } else {
          this.formSearchs[remarkTb].datas['sort'] = prop + ' ASC';
        }
      } else {
        this.formSearchs[remarkTb].datas['sort'] = null;
      }
      this.dataSearch(remarkTb);
    },
    // 改变父组件表格行数据
    changeTableRowData(remarkTb, row, index) {
      for (let name in row) {
        this.$set(this.tableData[remarkTb][index], name, row[name]);
      }
    },
    // 统一渲染按钮事件
    btnClick(methods, parms, index, remarkTb) {
      if (parms) {
        // 下标 要用的数据 标题 ref
        this[methods](remarkTb, index, parms);
      } else {
        this[methods](remarkTb);
      }
    },
    // 查询
    async dataSearch(remarkTb) {
      this.tagRemark = remarkTb;
      this.tableData[remarkTb] = [];
      this.$set(this.tableLoading, remarkTb, true);
      this.$set(this.isClear, remarkTb, true);
      this.tablePagination[remarkTb].pageIndex = 1;
      await this.getTableData(this.formSearchs[remarkTb].datas, remarkTb);
      setTimeout(() => {
        this.$set(this.isClear, remarkTb, false);
      });
    },
    // 重置
    dataReset(remarkTb) {
      for (let name in this.formSearchs[remarkTb].datas) {
        if (name != 'dicID') {
          if (this.formSearchs[remarkTb].forms.length) {
            // 判断是否是页面显示的查询条件，是的字段才清空
            this.formSearchs[remarkTb].forms.forEach((element) => {
              if (element.prop === name) {
                this.formSearchs[remarkTb].datas[name] = null;
              }
            });
          }
        }
      }
    },
    // 导出
    async dataExport(remarkTb) {
      this.adminLoading = true;
      let form = JSON.parse(JSON.stringify(this.formSearchs[remarkTb].datas));
      form['rows'] = 0;
      let res = await ExportData(form);
      this.adminLoading = false;
      this.$store.dispatch('user/exportData', res.data);
    },
    // 保存
    async dataSave(remarkTb, index, parms, newData) {
      this.adminLoading = true;
      // const sheet = this.spread[remarkTb]?.getActiveSheet();
      const $table = this.$refs[`tableRef${remarkTb}`]?.[0].$refs.vxeTable;
      // if (sheet && sheet.isEditing()) {
      //   sheet.endEdit();
      // }
      // 获取修改记录
      let updateRecords = [];
      if (newData) {
        updateRecords = newData;
      } else {
        if ($table) {
          updateRecords = $table.getUpdateRecords();
        } else {
          // let DirtyRows = sheet.getDirtyRows().map((row) => row.item); //获取修改过的数据
          // let InsertRows = sheet.getInsertRows().map((row) => row.item); //获取插入过的数据
          // let DeletedRows = sheet.getDeletedRows().map((row) => row.item);
          // DeletedRows.forEach((item) => {
          //   item["ElementDeleteFlag"] = 1;
          // }); //获取被删除的数据
          // updateRecords = [...DirtyRows, ...InsertRows, ...DeletedRows];
        }
      }
      console.log(updateRecords, 'updateRecords', this.$refs);
      if (updateRecords.length == 0) {
        this.$set(this, 'adminLoading', false);
        this.$message.error('当前数据没做修改，请先修改再保存！');
        return;
      }
      console.log(updateRecords, 'updateRecords.length');
      if (updateRecords.length > 0 && remarkTb === 0) {
        if (this.formSearchs[remarkTb].required.length) {
          // 动态检验必填项
          updateRecords.map((item1, index1) => {
            this.formSearchs[remarkTb].required.map((item2, index2) => {
              let content = item1[item2['prop']];
              if (!content && (content !== 0) & (content !== false)) {
                this.$message.error(`${item2['label']}不能为空，请选择`);
                this.$set(this, 'adminLoading', false);
                return;
              }
            });
          });
          // for (let i = 0; i < updateRecords.length; i++) {
          //   for (
          //     let x = 0;
          //     x < this.formSearchs[remarkTb].required.length;
          //     x++
          //   ) {
          //     let content =
          //       updateRecords[i][
          //       this.formSearchs[remarkTb].required[x]["prop"]
          //       ];
          //     if (!content && (content !== 0) & (content !== false)) {
          //       this.$message.error(
          //         `${this.formSearchs[remarkTb].required[x]["label"]}不能为空，请选择`
          //       );
          //       this.$set(this, "adminLoading", false);
          //       return;
          //     }
          //   }
          // }
        }
      }
      let res;

      res = await SaveData(updateRecords);

      const { datas, forms, result, msg } = res.data;
      if (result) {
        this.$message({
          message: msg,
          type: 'success',
          dangerouslyUseHTMLString: true,
        });
        this.dataSearch(remarkTb);
        this.$set(this, 'adminLoading', false);
      } else {
        this.$message({
          message: msg,
          type: 'error',
          dangerouslyUseHTMLString: true,
        });
        this.$set(this, 'adminLoading', false);
      }
    },
    // 获取表头数据
    async getTableHeader() {
      let IDs = this.sysID;
      let res = await GetHeader(IDs);
      const { datas, forms, result, msg } = res.data;
      if (result) {
        // 获取每个表头
        datas.some((m, i) => {
          m.forEach((n, index) => {
            // 进行验证
            this.verifyDta(n);
            if (n.childrens && n.children.length != 0) {
              n.childrens.forEach((x) => {
                this.verifyDta(x);
              });
            }
            //从列获取下拉数据源
            if (n.DataSourceID && n.ControlType === 'combobox' && i === 0) {
              this.DataSourceList[i] = {
                [n.DataSourceName]: n.items,
                ...this.DataSourceList[i],
              };
            }
            if (n.required) {
              this.formSearchs[i].required.push(n);
            }
            if (index === 1) {
              this.tablePagination[i]['pageSize'] = n['pageSize'];
              this.hasSelect[i] = n['IsSelect'];
            }
          });
          this.$set(this.OrderNos, i, m);

          this.OrderNos[i] = this.OrderNos[i]
            .filter((item) => item.isEdit)
            .map((item) => {
              return {
                value: item.prop,
                label: item.label,
              };
            });
          console.log(this.OrderNos, 'this.OrderNo');
        });
        // 获取查询的初始化字段 组件 按钮
        forms.some((x, z) => {
          this.$set(this.formSearchs[z].datas, 'dicID', IDs[z].ID);
          this.$set(
            this.formSearchs[z].datas,
            'Accounts',
            `$${this.userInfo.Account}$`,
          );
          if (z === 0) {
            x = [
              {
                type: 'Daterange',
                label: '日期',
                width: null,
                prop: 'Days',
                placeholder: '请输入日期',
                methods: null,
                options: null,
                dicID: '11150',
                icon: null,
                multiple: false,
                value: [
                  this.$moment().format('YYYY-MM-DD'),
                  this.$moment().add(30, 'days').format('YYYY-MM-DD'),
                ],
              },
            ].concat(x);
          } else if (z === 1) {
            x = [
              {
                type: 'Daterange',
                label: '日期',
                width: null,
                prop: 'Days',
                placeholder: '请输入日期',
                methods: null,
                options: null,
                dicID: '11149',
                icon: null,
                multiple: false,
                value: [
                  this.$moment().format('YYYY-MM-DD'),
                  this.$moment().add(30, 'days').format('YYYY-MM-DD'),
                ],
              },
            ].concat(x);
          }
          x.forEach((y, n) => {
            if (y.prop && y.value) {
              this.$set(this.formSearchs[z].datas, [y.prop], y.value);
            } else {
              this.$set(this.formSearchs[z].datas, [y.prop], '');
            }
          });
          this.$set(this.formSearchs[z], 'forms', x);
        });
        this.getTableData(this.formSearchs[0].datas, 0);
        this.adminLoading = false;
      }
    },
    // 验证数据
    verifyDta(n) {
      for (let name in n) {
        if (
          (name == 'component' && n[name]) ||
          (name == 'button' && n[name]) ||
          (name == 'active' && n[name])
        ) {
          n[name] = eval('(' + n[name] + ')');
        }
      }
    },
    // 获取表格数据
    async getTableData(form, remarkTb) {
      this.$set(this.tableLoading, remarkTb, true);
      form['rows'] = this.tablePagination[remarkTb].pageSize;
      form['page'] = this.tablePagination[remarkTb].pageIndex;
      let res = await GetSearchData(form);
      const { result, data, count, msg, Columns } = res.data;
      if (result) {
        // 获取每个表头
        Columns.some((m, i) => {
          m.forEach((n, index) => {
            // 进行验证
            this.verifyDta(n);
            if (n.childrens && n.children.length != 0) {
              n.childrens.forEach((x) => {
                this.verifyDta(x);
              });
            }
            this.$set(this.tableColumns, remarkTb, m);
          });
        });
        this.$set(this.tableData, remarkTb, data);
        // if (remarkTb === 0) {
        //   this.setData(remarkTb);
        // }
        this.$set(this.tablePagination[remarkTb], 'pageTotal', count);
      } else {
        this.$message({
          message: msg,
          type: 'error',
          dangerouslyUseHTMLString: true,
        });
      }
      this.$set(this.tableLoading, remarkTb, false);
    },
    // 刷新页面
    refrshPage() {
      this.$store.dispatch('tagsView/delCachedView', this.$route).then(() => {
        const { fullPath } = this.$route;
        this.$nextTick(() => {
          this.$router.replace({
            path: '/redirect' + fullPath,
          });
        });
      });
    },
    // 改变状态
    changeStatus(item, index) {
      this.labelStatus1 = index;
      this.formSearchs[0].datas['IsCompleteInspect'] = item.value;
      this.$set(this.tableData, 1, []);
      this.dataSearch(0);
    },
    // 改变状态
    changeStatus2(item, index) {
      if (!this.formSearchs[1].datas['SalesOrderDetailID']) {
        this.$message.error('请单击上方行数据再查询！');
        return;
      }
      this.labelStatus2 = index;
      this.formSearchs[1].datas.PrepareType = '';
      this.formSearchs[1].datas.InspectStatus = '';
      this.formSearchs[1].datas.UnIssuedQty = '';
      if (index == 1) {
        this.formSearchs[1].datas.InspectStatus = 0;
      } else if (index == 2) {
        this.formSearchs[1].datas.InspectStatus = 2;
      } else if (index == 3) {
        this.formSearchs[1].datas.UnIssuedQty = '0';
        this.formSearchs[1].datas.InspectStatus = 0;
      }
      this.$set(this.tableData, 1, []);
      this.dataSearch(1);
    },
    // 选择数据
    selectFun(data, remarkTb, row) {
      this.selectionData[remarkTb] = data;
    },
    // 单击获取明细
    handleRowClick(row, remarkTb) {
      this.formSearchs[1].datas['CustomerID'] = row.CustomerID;
      this.dataSearch(this.selectedIndex);
    },
    handleClick(tab, event) {
      console.log(tab, event);
      this.selectedIndex = tab.name;
      this.dataSearch(this.selectedIndex);
    },
    AddEvent(index) {
      if (index === 1) {
        this.colDialogVisible2 = true;
        this.formSearchs[3]['MachineTypeID'] = 'M20230614001';
      }
      if (index === 2) {
        this.colDialogVisible5 = true;
      }
      if (index === 3) {
        this.colDialogVisible6 = true;
      }
    },
    // 行内样式
    cellStyle0({ row, column }) {
      if (column.property == 'IsCompleteInspect') {
        if (row.IsCompleteInspect == '未开始') {
          return {
            backgroundColor: '#ff7b7b',
          };
        } else if (row.IsCompleteInspect == '进行中') {
          return {
            backgroundColor: '#fdfd8f',
          };
        } else if (row.IsCompleteInspect == '已完成') {
          return {
            backgroundColor: '#9fff9f',
          };
        }
      }
    },
    // 行内样式
    cellStyle({ row, column }) {
      if (column.property == 'OrderNo') {
        if (row.InspectStatus == 2) {
          return {
            backgroundColor: '#ff7b7b',
          };
        } else {
          if (row.InspectStatus == 1) {
            return {
              backgroundColor: '#9fff9f',
            };
          }
        }
      }
    },
    // 增行
    addRow(remarkTb) {
      if (!this.addNum) {
        this.$message.error('请输入需要添加的行数!');
        return;
      }
      // 下拉数据是需要获取数据源
      for (let x = 0; x < this.addNum; x++) {
        let obj = {
          dicID: this.sysID[remarkTb].ID,
          rowNum: _.uniqueId('rowNum_'),
        };
        this.tableColumns[remarkTb].map((item) => {
          obj[item.prop] = null;
          obj['update'] = true;
          if (item.prop === 'Status') {
            obj[item.prop] = 1;
          }
          for (let key in this.DataSourceList[remarkTb]) {
            if (item.DataSourceName === key) {
              obj[key] = this.DataSourceList[remarkTb][key];
            }
          }
        });

        console.log('this.addNum', this.addNum);

        this.tableData[remarkTb].unshift(obj);
      }

      console.log('this.tableData[remarkTb]', this.tableData[remarkTb]);
    },
    //添加产品机台
    confirmDialog(data) {
      let tagNumber = Number(this.selectedIndex);
      data.map((item) => {
        item['RAMID'] = this.formSearchs[tagNumber]['datas']['RAMID'];
        item['dicID'] = this.sysID[tagNumber]['ID'];
      });
      this.colDialogVisible2 = false;
      this.colDialogVisible5 = false;
      this.colDialogVisible6 = false;
      this.dataSave(tagNumber, null, null, data);
    },
    // 删除
    async dataDel(remarkTb, index, parms) {
      let res = null;
      let newData = [];
      if (this.selectionData[remarkTb].length == 0) {
        this.$message.error('请选择需要操作的数据！');
        return;
      } else {
        this.selectionData[remarkTb].forEach((x) => {
          let obj = x;
          obj['ElementDeleteFlag'] = 1;
          newData.push(obj);
        });
      }
      this.$confirm('确定要删除的【' + newData.length + '】数据吗？')
        .then((_) => {
          _this.dataSave(remarkTb, index, null, newData);
        })
        .catch((_) => {});
    },
    async dataSave2(remarkTb, index, parms) {
      if (this.selectionData[2].length == 0) {
        this.$message.error('请选择需要操作的数据！');
        return;
      }
      const HasData = this.selectionData[2].some(
        (row) => !row.NewStartDate || !row.NewEndDate,
      );
      if (HasData) {
        this.$message.error('选择保存的数据中没有变更日期');
        return;
      }
      if (!this.ChangeReason) {
        this.$message.error('没有填写原因');
        return;
      }

      let updateRecords = JSON.parse(JSON.stringify(this.selectionData[2]));
      updateRecords.forEach((item) => {
        console.log(item, 'item');
        item['ChangeReason'] = this.ChangeReason;
        item['Status'] = 0;
        item['Extend1'] = this.Extend1;
        item['StartDate'] = item['ERPStartDate'];
        item['EndDate'] = item['ERPEndDate'];
        item['DataSource'] = '计划提交';
        item['dicID'] = 5644;
      });
      let res = await SaveData(updateRecords);
      const { datas, forms, result, msg } = res.data;
      if (result) {
        this.$message({
          message: msg,
          type: 'success',
          dangerouslyUseHTMLString: true,
        });
        this.colDialogVisible2 = false;
        // this.dataSearch(remarkTb);
      } else {
        this.$message({
          message: msg,
          type: 'error',
          dangerouslyUseHTMLString: true,
        });
      }
    },
    //双击事件
    async handleRowdbClick(row, remarkTb) {
      //获取原因数据源
      if (remarkTb === 1) {
        let res = await GetSearch(
          { DataSourceID: 'D2307210001' },
          '/APSAPI/GetDataSource',
        );
        const { result, data, count, msg } = res.data;
        if (result) {
          this.ChangeReasonArray = data;
        } else {
          this.$message({
            message: msg,
            type: 'error',
            dangerouslyUseHTMLString: true,
          });
        }

        this.colDialogVisible2 = true;
        this.formSearchs[2].datas['OrderID'] = row.OrderID;
        this.formSearchs[2].datas['SalesOrderDetailID'] =
          row.SalesOrderDetailID;
        this.formSearchs[2].datas['Code'] = row.Code;
        this.formSearchs[2].datas['CustomerID'] = row.CustomerID;
        // this.formSearchs[2].datas['LineNum'] = row.LineNum;
        await this.dataSearch(2);
        this.selectionData[2] = [];
        this.SalesLineNum = '';
        this.SalesDeliveryDate = '';
        this.FrontDate = '';
        this.SalesOrderNo = '';
        if (this.tableData[2] && this.tableData[2][0]) {
          let row = this.tableData[2][0];
          this.SalesLineNum = row['SalesLineNum'];
          this.SalesDeliveryDate = row['SalesDeliveryDate'];
          this.FrontDate = row['FrontDate'];
          this.SalesOrderNo = row['SalesOrderNo'];
        }
      }
    },
    //重算
    async Reschedule() {
      if (this.selectionData[2].length == 0) {
        this.$message.error('请选择需要操作的数据！');
        return;
      }
      this.selectionData[2].forEach((item) => {
        item['IgnoreSunday'] = this.IgnoreSunday;
      });
      let res = await GetSearch(
        this.selectionData[2],
        '/APSAPI/CalculationStartDate',
      );
      const { data, result, msg } = res.data;
      if (result) {
        this.$message({
          message: msg,
          type: 'success',
          dangerouslyUseHTMLString: true,
        });
        if (data) {
          const $table = this.$refs[`tableRef${2}`]?.[0].$refs.vxeTable;
          // 对应匹配并更新表格数据
          data.forEach((newData) => {
            const rowIndex = this.tableData[2].findIndex(
              (row) => row.OrderID === newData.OrderID,
            );

            if (rowIndex !== -1) {
              $table.remove(this.tableData[2][rowIndex]);
              $table.insertAt(newData, rowIndex);

              // this.tableData[2].splice(rowIndex, 1, newData);
            }
          });
          this.selectionData[2] = $table.getCheckboxRecords();
        }
      } else {
        this.$message({
          message: msg,
          type: 'error',
          dangerouslyUseHTMLString: true,
        });
      }
    },
    // 渲染数据
    setData(remarkTb) {
      this.spread[remarkTb].suspendPaint();
      let sheet = this.spread[remarkTb].getActiveSheet();
      sheet.options.allowCellOverflow = true;
      sheet.defaults.rowHeight = 23;
      sheet.defaults.colWidth = 100;
      sheet.defaults.colHeaderRowHeight = 23;
      sheet.defaults.rowHeaderColWidth = 60;
      let colHeader1 = [];
      sheet.setDataSource(this.tableData[remarkTb]);
      // 渲染列
      this.tableColumns[remarkTb].forEach((x, y) => {
        x['name'] = x['prop'];
        x['displayName'] = x['label'];
        x['width'] = parseInt(x.width);
        if (x.prop === 'isChecked') {
          // 选框
          sheet.setCellType(
            0,
            0,
            new HeaderCheckBoxCellType(),
            GCsheets.SheetArea.colHeader,
          );
          x.cellType = new GC.Spread.Sheets.CellTypes.CheckBox();
        } else if (
          x.ControlType === 'comboboxMultiple' ||
          x.ControlType === 'combobox'
        ) {
          this.tableData[remarkTb].map((item, index) => {
            if (x.DataSourceID && x.DataSourceName) {
              let newData = item[x.DataSourceName]; // 设置列表每行下拉菜单
              // 获取要绑定下拉菜单的单元格对象
              let cell = sheet.getCell(index, y);
              // 创建下拉菜单单元格类型，并设置其选项数据
              let comboBox = new GC.Spread.Sheets.CellTypes.ComboBox();
              comboBox.editorValueType(
                GC.Spread.Sheets.CellTypes.EditorValueType.value,
              );
              comboBox.editable(true);
              // 获取下拉菜单的选项数据
              comboBox.items(newData);
              comboBox.itemHeight(24);
              // 将下拉菜单单元格类型绑定到指定的单元格中
              cell.cellType(comboBox);
            }
          });
        } else if (x.ControlType === 'checkbox') {
          let cellType = new GC.Spread.Sheets.CellTypes.CheckBox();
          cellType.caption('');
          cellType.textTrue('');
          cellType.textFalse('');
          cellType.textIndeterminate('');
          cellType.textAlign(
            GC.Spread.Sheets.CellTypes.CheckBoxTextAlign.center,
          );
          cellType.isThreeState(false);
          sheet.getCell(-1, y).cellType(cellType);
        } else if (
          x.DataType == 'datetime' ||
          x.DataType === 'varchar' ||
          x.DataType === 'nvarchar'
        ) {
          x.formatter = '@';
        }

        //行，start,end
        if (x.isEdit) {
          sheet.getCell(-1, y).locked(false).foreColor('#2a06ecd9');
        }
      });
      //渲染列
      sheet.bindColumns(this.tableColumns[remarkTb]); //此方法一定要放在setDataSource后面才能正确渲染列名
      sheet.setRowCount(1, GC.Spread.Sheets.SheetArea.colHeader);
      colHeader1.forEach(function (value, index) {
        sheet.setValue(0, index, value, GC.Spread.Sheets.SheetArea.colHeader);
      });

      var defaultStyle = new GC.Spread.Sheets.Style();
      defaultStyle.font =
        '12px basefontRegular, Roboto, Helvetica, Arial, sans-serif';
      defaultStyle.hAlign = GC.Spread.Sheets.HorizontalAlign.left;
      defaultStyle.vAlign = GC.Spread.Sheets.HorizontalAlign.center;
      defaultStyle.borderLeft = new GC.Spread.Sheets.LineBorder(
        'gray',
        GC.Spread.Sheets.LineStyle.thin,
      );
      defaultStyle.borderTop = new GC.Spread.Sheets.LineBorder(
        'gray',
        GC.Spread.Sheets.LineStyle.thin,
      );
      defaultStyle.borderRight = new GC.Spread.Sheets.LineBorder(
        'gray',
        GC.Spread.Sheets.LineStyle.thin,
      );
      defaultStyle.borderBottom = new GC.Spread.Sheets.LineBorder(
        'gray',
        GC.Spread.Sheets.LineStyle.thin,
      );
      defaultStyle.showEllipsis = true;
      sheet.setDefaultStyle(defaultStyle, GC.Spread.Sheets.SheetArea.viewport);

      // 冻结第一列

      sheet.frozenColumnCount(this.tableColumns[remarkTb][0].FixCount);

      // 列筛选
      // 参数2 开始列
      // 参数3
      // 参数4 结束列
      let cellrange = new GC.Spread.Sheets.Range(
        -1,
        -1,
        -1,
        this.tableColumns[remarkTb].length,
      );
      let hideRowFilter = new GC.Spread.Sheets.Filter.HideRowFilter(cellrange);
      sheet.rowFilter(hideRowFilter);

      // sheet.bindColumns(colInfos);
      this.spread[remarkTb].options.tabStripVisible = false; //是否显示表单标签

      //改变字体颜色
      this.tableData[remarkTb].forEach((row, rowIndex) => {
        this.tableColumns[remarkTb].forEach((column, columnIndex) => {
          // 获取当前单元格
          const cell = sheet.getCell(rowIndex, columnIndex);
        });
      });

      let cellIndex = 0;
      let viewSortIndex = 0; //排序的索引
      let lineIDIndex = 0;
      this.tableColumns[remarkTb].forEach((m) => {
        //行，start,end
        if (m.prop == 'ViewSort') {
          viewSortIndex = cellIndex;
        }
        if (m.prop == 'LineID') {
          lineIDIndex = cellIndex;
        }
        //行，start,end

        cellIndex++;
      });
      sheet.options.protectionOptions.allowResizeColumns = true;
      sheet.options.isProtected = true;
      sheet.options.protectionOptions.allowResizeColumns = true;
      sheet.options.protectionOptions.allowInsertRows = true;
      sheet.options.protectionOptions.allowDeleteRows = true;
      sheet.options.protectionOptions.allowSelectLockedCells = true;
      sheet.options.protectionOptions.allowSelectUnlockedCells = true;
      sheet.options.protectionOptions.allowDeleteColumns = true;
      sheet.options.protectionOptions.allowInsertColumns = true;
      sheet.options.protectionOptions.allowDargInsertRows = true;
      sheet.options.protectionOptions.allowDragInsertColumns = true;
      sheet.options.protectionOptions.allowSort = true;
      sheet.options.protectionOptions.allowFilter = true;
      sheet.options.allowUserDragDrop = true;

      // var insertRowsCopyStyle = {
      //   canUndo: true,
      //   name: "insertRowsCopyStyle",
      //   execute: function (context, options, isUndo) {
      //     var Commands = GC.Spread.Sheets.Commands;
      //     if (isUndo) {
      //       Commands.undoTransaction(context, options);
      //       return true;
      //     } else {
      //       sheet.suspendPaint();
      //       sheet.addRows(options.activeRow, _this.sheetSelectRows.length);
      //       //  sheet.setArray(options.activeRow, 0,_this.sheetSelectRows);
      //       // console.log(_this.sheetSelectRows);

      //       // console.log(_this.sheetSelectObj.start+_this.sheetSelectRows.length)
      //       //删除旧行
      //       if (_this.sheetSelectObj.start > options.activeRow) {
      //         //说明从下面插入上面
      //         sheet.copyTo(
      //           _this.sheetSelectObj.start + _this.sheetSelectRows.length,
      //           0,
      //           options.activeRow,
      //           0,
      //           _this.sheetSelectRows.length,
      //           sheet.getColumnCount(),
      //           GC.Spread.Sheets.CopyToOptions.all
      //         );

      //         //   sheet.setArray(options.activeRow, 0, _this.sheetSelectRows);
      //         sheet.deleteRows(
      //           _this.sheetSelectObj.start + _this.sheetSelectRows.length,
      //           _this.sheetSelectObj.count
      //         );
      //         // sheet.removeRow(_this.sheetSelectObj.start+ _this.sheetSelectRows.length)
      //       } else {
      //         //从上面往下面插入
      //         sheet.copyTo(
      //           _this.sheetSelectObj.start,
      //           0,
      //           options.activeRow,
      //           0,
      //           _this.sheetSelectRows.length,
      //           sheet.getColumnCount(),
      //           GC.Spread.Sheets.CopyToOptions.all
      //         );
      //         //  sheet.setArray(options.activeRow, 0, _this.sheetSelectRows);
      //         sheet.deleteRows(
      //           _this.sheetSelectObj.start,
      //           _this.sheetSelectObj.count
      //         );
      //       }
      //       let count = sheet.getRowCount(GC.Spread.Sheets.SheetArea.viewport);

      //       let lineID = _this.sheetSelectRows[0][lineIDIndex];
      //       let isFind = false;
      //       let viewSort = 1;

      //       for (var i = 0; i < count; i++) {
      //         if (isFind == false && sheet.getValue(i, lineIDIndex) == lineID) {
      //           isFind = true;
      //         }
      //         if (isFind && sheet.getValue(i, lineIDIndex) != lineID) {
      //           break;
      //         }
      //         if (isFind) {
      //           sheet.setValue(i, viewSortIndex, viewSort);
      //           viewSort++;
      //         }
      //       }
      //       sheet.resumePaint();

      //       return true;
      //     }
      //   },
      // };

      // this.spread[remarkTb]
      //   .commandManager()
      //   .register("insertRowsCopyStyle", insertRowsCopyStyle);

      // function MyContextMenu() {}
      // MyContextMenu.prototype = new GC.Spread.Sheets.ContextMenu.ContextMenu(
      //   this.spread[remarkTb]
      // );
      // MyContextMenu.prototype.onOpenMenu = function (
      //   menuData,
      //   itemsDataForShown,
      //   hitInfo,
      //   spread
      // ) {
      //   itemsDataForShown.forEach(function (item, index) {
      //     // console.log(item);
      //     if (item && item.name === "gc.spread.rowHeaderinsertCutCells") {
      //       item.command = "insertRowsCopyStyle";
      //     }
      //     //  else if (item && item.name === "gc.spread.cut") {

      //     //     item.command = "insertRowsCut";
      //     //   }
      //   });
      // };
      // var contextMenu = new MyContextMenu();
      // this.spread[remarkTb].contextMenu = contextMenu;
      // // 剪贴板事件绑定
      // sheet.bind(
      //   GC.Spread.Sheets.Events.ClipboardChanged,
      //   function (sender, args) {
      //     let s = sheet.getSelections()[0];
      //     console.log(sheet.getDataItem(s.row));
      //     _this.sheetSelectRows = sheet.getArray(
      //       s.row,
      //       0,
      //       s.rowCount,
      //       _this.tableColumns[remarkTb].length
      //     );
      //     _this.sheetSelectObj.start = s.row;

      //     _this.sheetSelectObj.count = s.rowCount;
      //   }
      // );

      /////////////////表格事件/////////////
      // this.spread[remarkTb].bind(GCsheets.Events.ButtonClicked, (e, args) => {
      //   const { sheet, row, col } = args;
      //   const cellType = sheet.getCellType(row, col);
      //   if (cellType instanceof GCsheets.CellTypes.Button) {
      //   }
      //   if (cellType instanceof GCsheets.CellTypes.CheckBox) {
      //   }
      //   if (cellType instanceof GCsheets.CellTypes.HyperLink) {
      //   }
      // });
      // //表格编辑事件

      // this.spread[remarkTb].bind(
      //   GCsheets.Events.EditStarting,
      //   function (e, args) {}
      // );
      // this.spread[remarkTb].bind(GCsheets.Events.EditEnded, function (e, args) {
      //   // 自动计算数量
      // });
      // // 表格单击齐套率弹框事件
      // this.spread[remarkTb].bind(
      //   GCsheets.Events.CellClick,
      //   function (e, args) {}
      // );
      // //脏数据清除
      // sheet.bind(GC.Spread.Sheets.Events.RowChanged, function (e, info) {
      //   console.log(
      //     info.row +
      //       "," +
      //       info.col +
      //       "," +
      //       "由" +
      //       info.oldValue +
      //       "改变为" +
      //       info.newValue
      //   );
      //   var arr = sheet.getDirtyRows();
      //   var arr2 = sheet.getInsertRows();
      //   console.log(arr, arr2);
      //   // sheet.clearPendingChanges();
      // });
      this.spread[remarkTb].resumePaint();
      this.adminLoading = false;
      this.tableLoading[remarkTb] = false;
      setTimeout(() => {
        this.spread[remarkTb].refresh(); //重新定位宽高度
      });
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-dialog__header {
  background-color: #409eff !important;
}
::v-deep .el-dialog__title {
  color: #fff !important;
}
::v-deep .el-dialog__close {
  color: #fff !important;
}
</style>
