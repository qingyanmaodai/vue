<!--设备与工装汇总-->
<template>
  <div class="APSContainer flex_column content_height" v-loading="adminLoading">
    <splitpanes class="default-theme">
      <pane :size="60">
        <div class="flex_column" style="width: 100%; height: 100%">
          <div class="admin_head" ref="headRef">
            <div class="flex">
              <div
                class="flex_grow"
                v-for="item in [0, 1]"
                :key="item"
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
                  :Region="Region[item]"
                />
              </div>
            </div>
          </div>

          <div class="ant-table-title pd-0-6">
            <el-row>
              <el-col :span="4"></el-col>
              <el-col :span="20" class="flex_flex_end">
                <div style="margin-right: 10px">
                  <el-tabs
                    v-model="selectedIndex"
                    @tab-click="handleClick"
                    :stretch="true"
                  >
                    <el-tab-pane label="产品" name="0"></el-tab-pane>
                    <el-tab-pane label="产品族" name="1"></el-tab-pane
                  ></el-tabs>
                </div>
              </el-col>
            </el-row>
          </div>
          <div
            v-for="item in [0, 1]"
            :key="item"
            class="admin_content flex_grow"
            v-show="Number(selectedIndex) === item"
          >
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
              :isToggleCheckbox="true"
              @handleRowClick="handleRowClick"
              @pageChange="pageChange"
              @pageSize="pageSize"
              @sortChange="sortChange"
              @selectfun="selectFun"
            />
          </div>
        </div>
      </pane>
      <pane :size="40">
        <div class="flex_column" style="width: 100%; height: 100%">
          <div
            class="admin_head"
            ref="headRef"
            v-for="item in [2]"
            :key="item + 'head'"
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
              :Region="Region[item]"
            />
          </div>
          <div v-for="item in [2]" :key="item" class="admin_content flex_grow">
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
              :isEdit="true"
              :isClear="isClear[item]"
              :keepSource="true"
              :pagination="tablePagination[item]"
              :isToggleCheckbox="true"
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

    <el-dialog
      :title="'添加主辅线'"
      :visible.sync="colDialogVisible3"
      :width="'60%'"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
    >
      <div class="admin_head" ref="headRef" v-for="i in [3]" :key="'head' + i">
        <ComSearch
          ref="searchRef"
          :searchData="formSearchs[i]['datas']"
          :searchForm="formSearchs[i]['forms']"
          :remark="i"
          :btnForm="btnForm"
          :isLoading="isLoading"
          :signName="i"
          :Region="Region[i]"
          @btnClick="btnClick"
        />
      </div>
      <div class="admin_content flex_grow" v-for="item in [3]" :key="item">
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
          :isEdit="true"
          :isClear="isClear[item]"
          :keepSource="true"
          :pagination="tablePagination[item]"
          @pageChange="pageChange"
          @pageSize="pageSize"
          @sortChange="sortChange"
          @selectfun="selectFun"
        />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="colDialogVisible3 = false">关 闭</el-button>
        <el-button type="primary" @click="confirmDialog(3)"
          >批量关联线体</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
var _this;
import { Splitpanes, Pane } from 'splitpanes';
import 'splitpanes/dist/splitpanes.css';
import ComSearch from '@/components/ComSearch/AdvancedSearch';
import ComVxeTable from '@/components/ComVxeTable';
import ComSpreadTable from '@/components/ComSpreadTable';
import ComReportTable from '@/components/ComReportTable';
import DialogTable from '@/components/Dialog/dialogTable';
import DialogOptTable from '@/components/Dialog/dialogOptTable';
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
  name: 'MainLineSettings',
  components: {
    ComSearch,
    ComVxeTable,
    ComReportTable,
    Splitpanes,
    Pane,
    DialogTable,
    ComSpreadTable,
    DialogOptTable,
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
          formsAll: [],
        },
        {
          datas: {},
          forms: [],
          required: [], //获取必填项
          formsAll: [],
        },
        {
          datas: { ProductPlatformType: '产品' },
          forms: [],
          required: [], //获取必填项
          formsAll: [],
        },
        {
          datas: {},
          forms: [],
          required: [], //获取必填项
          formsAll: [],
        },
        {
          datas: {},
          forms: [],
          required: [], //获取必填项
          formsAll: [],
        },
        {
          datas: {},
          forms: [],
          required: [], //获取必填项
          formsAll: [],
        },
        {
          datas: {},
          forms: [],
          required: [], //获取必填项
          formsAll: [],
        },
        {
          datas: {},
          forms: [],
          required: [], //获取必填项
          formsAll: [],
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
      OrderNos: [{}, {}, {}, {}],
      sysID: [{ ID: 11171 }, { ID: 11172 }, { ID: 125 }, { ID: 11173 }],
      isEdit: [false, false, true, false, false, false, false],
      Region: [6, 6, 6, 6],
      userInfo: {},
      selectedIndex: '0',
      colDialogVisible3: false,
      addNum: 1,
      DataSourceList: [{}, {}, {}, {}],
      sheetSelectRows: [],
      sheetSelectObj: { start: 0, end: 0, count: 0 },
      clickRow: null,
      linkTableData: [],
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
    console.log(this.$route.meta.btns, 'this.$route.meta.btns');
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
    selectFun(data, remarkTb, row) {
      this.$set(this.selectionData, remarkTb, data);
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
    handleClick(tab, event) {
      this.clickRow = null;
      this.selectedIndex = tab.name;
      let materialNameIndex = -1;
      let codeIndex = -1;
      this.tableColumns[2].forEach((item, index) => {
        if (item['prop'] === 'MaterialName') {
          materialNameIndex = index;
        } else if (item['prop'] === 'Code') {
          codeIndex = index;
        }
      });
      if (Number(this.selectedIndex) === 0) {
        this.formSearchs[2].datas['MaterialTypeID'] = null;
        this.formSearchs[2].datas['ProductPlatformType'] = '产品';
        if (materialNameIndex !== -1) {
          this.$set(this.tableColumns[2][materialNameIndex], 'visible', true);
        }
        if (codeIndex !== -1) {
          this.$set(this.tableColumns[2][codeIndex], 'visible', true);
        }
      } else if (Number(this.selectedIndex) === 1) {
        this.formSearchs[2].datas['MaterialID'] = null;
        this.formSearchs[2].datas['ProductPlatformType'] = '产品族';
        if (materialNameIndex !== -1) {
          this.$set(this.tableColumns[2][materialNameIndex], 'visible', false);
        }
        if (codeIndex !== -1) {
          this.$set(this.tableColumns[2][codeIndex], 'visible', false);
        }
      }
      this.dataSearch(Number(this.selectedIndex));
      this.dataSearch(2);
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
      console.log(this.isClear, 'this.isClear');
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
      let changeRecords = [];
      if (newData) {
        changeRecords = newData;
      } else {
        if ($table) {
          const { insertRecords, updateRecords, removeRecords } =
            $table.getRecordset();
          changeRecords = insertRecords.concat(updateRecords, removeRecords);
        } else {
          // let DirtyRows = sheet.getDirtyRows().map((row) => row.item); //获取修改过的数据
          // let InsertRows = sheet.getInsertRows().map((row) => row.item); //获取插入过的数据
          // let DeletedRows = sheet.getDeletedRows().map((row) => row.item);
          // DeletedRows.forEach((item) => {
          //   item["ElementDeleteFlag"] = 1;
          // }); //获取被删除的数据
          // changeRecords = [...DirtyRows, ...InsertRows, ...DeletedRows];
        }
      }
      if (changeRecords.length == 0) {
        this.$set(this, 'adminLoading', false);
        this.$message.error('当前数据没做修改，请先修改再保存！');
        return;
      }
      if (changeRecords.length > 0 && remarkTb === 0) {
        if (this.formSearchs[remarkTb].required.length) {
          // 动态检验必填项
          changeRecords.map((item1, index1) => {
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

      res = await SaveData(changeRecords);

      const { datas, forms, result, msg } = res.data;
      if (result) {
        this.$message({
          message: msg,
          type: 'success',
          dangerouslyUseHTMLString: true,
        });
        if (remarkTb === 0 || remarkTb === 1) {
          this.formSearchs[2].datas['MaterialID'] = null;
          this.formSearchs[2].datas['MaterialTypeID'] = null;
        }
        await this.dataSearch(remarkTb);
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
      const { datas, forms, result, msg, formsAll } = res.data;
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
            if (n.Required) {
              this.formSearchs[i].required.push(n);
            }
            if (index === 1) {
              this.tablePagination[i]['pageSize'] = n['pageSize'];
              this.hasSelect[i] = n['IsSelect'];
              this.Region[i] = n['Region'] ? n['Region'] : this.Region[i];
            }
          });
          this.$set(this.OrderNos, i, m);
          this.$set(this.tableColumns, i, m);

          // this.OrderNos[i] = this.OrderNos[i]
          //   .filter((item) => item.isEdit)
          //   .map((item) => {
          //     return {
          //       value: item.prop,
          //       label: item.label,
          //     };
          //   });
        });
        // 获取查询的初始化字段 组件 按钮
        forms.some((x, z) => {
          this.$set(this.formSearchs[z].datas, 'dicID', IDs[z].ID);
          x.forEach((y) => {
            if (y.prop && y.value) {
              this.$set(this.formSearchs[z].datas, [y.prop], y.value);
            } else {
              this.$set(this.formSearchs[z].datas, [y.prop], '');
            }
          });
          this.$set(this.formSearchs[z], 'forms', x);
          this.$set(this.formSearchs[z], 'formsAll', formsAll[z]);
        });
        await this.getTableData(this.formSearchs[0].datas, 0);
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
    // 选择数据
    async selectFun(data, remarkTb, row) {
      this.selectionData[remarkTb] = data;
      if (remarkTb === 0) {
        this.formSearchs[2].datas['MaterialID'] = null;
        this.formSearchs[2].datas['MaterialID'] = this.selectionData[remarkTb]
          .map((item) => item['MaterialID'])
          .join(',');
        await this.dataSearch(2);
      } else if (remarkTb === 1) {
        this.formSearchs[2].datas['MaterialTypeID'] = null;
        this.formSearchs[2].datas['MaterialTypeID'] = this.selectionData[
          remarkTb
        ]
          .map((item) => item['MaterialTypeID'])
          .join(',');
        await this.dataSearch(2);
      }
    },
    // 单击获取明细
    async handleRowClick(data, remarkTb) {
      this.selectionData[remarkTb] = data;
      if (remarkTb === 0) {
        this.formSearchs[2].datas['MaterialID'] = null;
        this.formSearchs[2].datas['MaterialID'] = this.selectionData[remarkTb]
          .map((item) => item['MaterialID'])
          .join(',');
        await this.dataSearch(2);
      } else if (remarkTb === 1) {
        this.formSearchs[2].datas['MaterialTypeID'] = null;
        this.formSearchs[2].datas['MaterialTypeID'] = this.selectionData[
          remarkTb
        ]
          .map((item) => item['MaterialTypeID'])
          .join(',');
        await this.dataSearch(2);
      }
    },
    // 增行
    addRow(remarkTb) {
      // 获取修改记录
      const $table = this.$refs[`tableRef${remarkTb}`]?.[0].$refs.vxeTable;
      if (!this.addNum) {
        this.$message.error('请输入需要添加的行数!');
        return;
      }
      // 下拉数据是需要获取数据源
      for (let x = 0; x < this.addNum; x++) {
        let obj = {
          dicID: this.sysID[remarkTb]['ID'],
          RowNumber: _.uniqueId(),
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
        $table.insert(obj);
      }
    },
    async LinkLine(remarkTb) {
      if (this.selectionData[Number(this.selectedIndex)].length === 0) {
        this.$message.error('请选择需要绑定的数据！');
        return;
      }
      let form = {};
      if (Number(this.selectedIndex) === 0) {
        form['ProductPlatformType'] = '产品';
        form['MaterialID'] = this.selectionData[remarkTb]
          .map((item) => item['MaterialID'])
          .join(',');
      } else if (Number(this.selectedIndex) === 1) {
        form['ProductPlatformType'] = '产品族';
        form['MaterialTypeID'] = this.selectionData[remarkTb]
          .map((item) => item['MaterialTypeID'])
          .join(',');
      }
      form['rows'] = 0;
      form['dicID'] = 125;
      let res = await GetSearchData(form);
      const { result, data, msg } = res.data;
      if (result) {
        // 获取每个表头
        this.$set(this, 'linkTableData', data);
      } else {
        this.$message({
          message: msg,
          type: 'error',
          dangerouslyUseHTMLString: true,
        });
      }
      this.colDialogVisible3 = true;
      this.dataSearch(3);
    },
    //添加产品机台
    async confirmDialog(remarkTb) {
      if (this.selectionData[remarkTb].length == 0) {
        this.$message.error('请选择需要操作的数据！');
        return;
      }
      let newData = [];
      if (remarkTb === 3) {
        this.selectionData[Number(this.selectedIndex)].forEach((item0) => {
          this.selectionData[remarkTb].forEach((item3) => {
            let matchingItem;
            if (Number(this.selectedIndex) === 0) {
              matchingItem = _.cloneDeep(
                this.linkTableData.find(
                  (iteml) =>
                    iteml.MaterialID === item0.MaterialID &&
                    iteml.OrganizeID === item3.OrganizeID,
                ),
              );
            } else if (Number(this.selectedIndex) === 1) {
              matchingItem = _.cloneDeep(
                this.linkTableData.find(
                  (iteml) =>
                    iteml.MaterialTypeID === item0.MaterialTypeID &&
                    iteml.OrganizeID === item3.OrganizeID,
                ),
              );
            }
            if (!matchingItem) {
              let addData = _.cloneDeep(item3);
              if (Number(this.selectedIndex) === 0) {
                addData['MaterialID'] = item0['MaterialID'];
              } else if (Number(this.selectedIndex) === 1) {
                addData['MaterialTypeID'] = item0['MaterialTypeID'];
              }
              addData['dicID'] = 125;
              newData.push(addData);
            }
          });
        });
        this.colDialogVisible3 = false;
        await this.dataSave(Number(this.selectedIndex), null, null, newData);
      }
    },
    // 删除
    async dataDel(remarkTb, index, parms) {
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
::v-deep .el-tabs__item {
  padding: 5px !important;

  /* 设置为0或调整合适的数值 */
}
::v-deep .el-dialog__body {
  height: 70vh !important;
  overflow: auto;
  display: flex;
  flex-direction: column;
}
</style>
