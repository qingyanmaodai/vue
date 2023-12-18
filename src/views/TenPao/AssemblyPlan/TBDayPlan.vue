<!-- 激光月计划 -->
<template>
  <div
    class="APSContainer flex_column content_height bgWhite"
    v-loading="adminLoading"
  >
    <div class="admin_head" ref="headRef">
      <div v-for="i in [0]" :key="i + 'head'" v-show="labelStatus1 === i">
        <ComSearch
          ref="searchRef"
          :searchData="formSearchs[i].datas"
          :searchForm="formSearchs[i].forms"
          :remark="i"
          :isLoading="isLoading"
          :btnForm="btnForm"
          :signName="i"
          :Region="Region[i]"
          @btnClick="btnClick"
        />
      </div>
    </div>
    <div class="admin_content pd-0-6">
      <div class="ant-table-title">
        <el-row>
          <el-col :span="8"
            ><span class="title">{{ title }}</span>
          </el-col>
          <el-col :span="16" class="flex_flex_end">
            <!-- 下拉框 -->
            <!-- <el-select
              v-model="colorType"
              filterable
              size="small"
              clearable
              class="margin_right_10"
            >
              <el-option
                v-for="(op, index) in colorStatus"
                :label="op.label"
                :value="op.value"
                :key="'select' + index"
              ></el-option>
            </el-select>
            <el-color-picker
              size="small"
              v-model="colorValue"
              class="margin_right_10"
            ></el-color-picker>
            <el-button
              class="margin_right_20"
              size="small"
              type="primary"
              @click="updateColor(labelStatus1)"
              >确定</el-button
            > -->
            <!-- <div v-for="(item, y) in Status1" :key="y">
              <span
                @click="changeStatus(item, y)"
                :class="
                  labelStatus1 == item['index']
                    ? 'statusActive cursor'
                    : 'cursor'
                "
                >{{ item.label }}</span
              >
              <el-divider direction="vertical"></el-divider></div
          > -->
          </el-col>
        </el-row>
      </div>
    </div>
    <div
      class="admin_content flex_grow"
      id="tableContainer"
      v-for="item in [0]"
      :key="item + 'table'"
      v-show="labelStatus1 === item"
    >
      <ComSpreadTable
        :ref="`spreadsheetRef${item}`"
        :height="'100%'"
        :tableData="tableData[item]"
        :tableColumns="tableColumns[item]"
        :tableLoading="tableLoading[item]"
        :remark="item"
        :sysID="sysID[item]['ID']"
        :pagination="tablePagination[item]"
        @pageChange="pageChange"
        @pageSize="pageSize"
        @workbookInitialized="workbookInitialized"
        @selectfun="selectFun"
      />
    </div>
  </div>
</template>

<script>
var _this;
const GCsheets = GC.Spread.Sheets;
import '@grapecity/spread-sheets-vue';
import GC from '@grapecity/spread-sheets';
import '@grapecity/spread-sheets/styles/gc.spread.sheets.excel2013white.css';
import '@grapecity/spread-sheets/js/zh.js';
import { mapState } from 'vuex';
GC.Spread.Common.CultureManager.culture('zh-cn');
import ComSearch from '@/components/ComSearch/AdvancedSearch';
import ComReportTable from '@/components/ComReportTable';
import ComAsideTree from '@/components/ComAsideTree';
import ComSpreadTable from '@/components/ComSpreadTable';
import ComVxeTable from '@/components/ComVxeTable';
import { HeaderCheckBoxCellType } from '@/static/data.js';
import {
  GetHeader,
  GetSearchData,
  ExportData,
  SaveData,
  GetSearch,
} from '@/api/Common';
import DialogOptTable from '@/components/Dialog/dialogOptTable';
export default {
  name: 'TBDayPlan',
  components: {
    ComSearch,
    ComReportTable,
    ComAsideTree,
    DialogOptTable,
    ComVxeTable,
    ComSpreadTable,
  },
  data() {
    return {
      labelStatus1: 0,
      spread: [[], [], [], [], [], [], []],
      addNum: 1,
      ////////////////// Search /////////////////
      title: this.$route.meta.title,
      DataSourceList: [{}, {}, {}, {}, {}, {}, {}],
      formSearchs: [
        {
          datas: {},
          forms: [],
        },
        {
          datas: {},
          forms: [],
        },
        {
          datas: {},
          forms: [],
        },
        {
          datas: {},
          forms: [],
        },
        {
          datas: {},
          forms: [],
        },
        {
          datas: {},
          forms: [],
        },
      ],
      btnForm: [],
      tableData: [[], [], [], [], [], []],
      tableColumns: [[], [], [], [], [], []],
      tableLoading: [false, false, false, false, false, false],
      isClear: [false, false, false, false, false, false],
      hasSelect: [false, false, false, false, false, false],
      tablePagination: [
        { pageIndex: 1, pageSize: 20, pageTotal: 0 },
        { pageIndex: 1, pageSize: 20, pageTotal: 0 },
        { pageIndex: 1, pageSize: 20, pageTotal: 0 },
        { pageIndex: 1, pageSize: 0, pageTotal: 0 },
        { pageIndex: 1, pageSize: 0, pageTotal: 0 },
        { pageIndex: 1, pageSize: 0, pageTotal: 0 },
      ],
      colorType: 0,
      colorValue: null,
      colorStatus: [
        { label: '字体颜色', value: 0 },
        { label: '背景颜色', value: 1 },
      ],
      tagRemark: 0,
      isLoading: false,
      sysID: [{ ID: 7946 }],
      adminLoading: false,
      selectionData: [[], [], [], [], [], [], []],
      NoWorkHour: [],
      LineViewSort: [],
      sheetSelectRows: [],
      sheetSelectObj: { start: 0, end: 0, count: 0 },
      isEdit: [false, false, false, false, false, false],
      colDialogVisible1: false,
      Status1: [
        { label: '', value: {}, index: 0 },
        { label: '', value: {}, index: 1 },
        { label: '', value: {}, index: 2 },
        { label: '', value: {}, index: 3 },
        { label: '', value: {}, index: 4 },
        { label: '', value: {}, index: 5 },
      ],
      Region: [5, 6, 6, 6, 6, 6],
      apsurl: null,
      formData1: {
        SalesOrderNo: null,
        Code: null,
        CustomerMaterialName: null,
        MaterialName: null,
        DataSource: null,
        PlanQty: null,
        OutType: null,
        Qty: null,
      },
    };
  },
  watch: {},
  created() {
    this.apsurl = localStorage.getItem('apsurl');
    _this = this;
    this.adminLoading = true;
    // 获取所有按钮
    this.btnForm = this.$route.meta.btns;
    this.judgeBtn(this.btnForm);
    this.getTableHeader();
  },
  activated() {
    if (this.spread) {
      this.spread[this.labelStatus1].refresh();
    }
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo,
    }),
  },
  mounted() {},
  methods: {
    updateColor(remarkTb) {
      let sheet = this.spread[remarkTb].getActiveSheet();
      sheet.suspendPaint();
      const { col, colCount, row, rowCount } = sheet.getSelections()[0];

      this.tableData[remarkTb].forEach((rowItem, rowIndex) => {
        this.tableColumns[remarkTb].forEach((column, columnIndex) => {
          const key = column.prop;

          if (
            row <= rowIndex &&
            rowIndex < rowCount + row &&
            col <= columnIndex &&
            columnIndex < colCount + col
          ) {
            if (this.colorType === 0) {
              if (
                Object.prototype.toString.call(rowItem['FColors']) !==
                '[object Object]'
              ) {
                rowItem['FColors'] = {};
              }
              let colorIndex = this.tableColumns[remarkTb].findIndex(
                (item) => item['prop'] === key + 'FColor',
              );
              sheet.setValue(rowIndex, colorIndex, this.colorValue);
              rowItem['FColors'][key] = this.colorValue;
            } else if (this.colorType === 1) {
              if (
                Object.prototype.toString.call(rowItem['BColors']) !==
                '[object Object]'
              ) {
                rowItem['BColors'] = {};
              }
              let colorIndex = this.tableColumns[remarkTb].findIndex(
                (item) => item['prop'] === key + 'BColor',
              );
              sheet.setValue(rowIndex, colorIndex, this.colorValue);
              rowItem['BColors'][key] = this.colorValue;
            }
          }

          // 获取当前单元格
          const cell = sheet.getCell(rowIndex, columnIndex);
          cell.foreColor('black');
          cell.backColor('white');
          if (column['isEdit']) {
            cell.locked(false).foreColor('#2a06ecd9');
          }
          if (
            Object.prototype.toString.call(rowItem['FColors']) ===
            '[object Object]'
          ) {
            Object.keys(rowItem['FColors']).forEach((key) => {
              const columnIndex = this.tableColumns[remarkTb].findIndex(
                (column) => column.prop === key,
              );
              if (columnIndex !== -1) {
                // 这里使用 rowIndex 和 columnIndex 获取单元格
                const cell = sheet.getCell(rowIndex, columnIndex);
                cell.foreColor(rowItem['FColors'][key]);
              }
            });
          }
          if (
            Object.prototype.toString.call(rowItem['BColors']) ===
            '[object Object]'
          ) {
            Object.keys(rowItem['BColors']).forEach((key) => {
              const columnIndex = this.tableColumns[remarkTb].findIndex(
                (column) => column.prop === key,
              );
              if (columnIndex !== -1) {
                // 这里使用 rowIndex 和 columnIndex 获取单元格
                const cell = sheet.getCell(rowIndex, columnIndex);
                cell.backColor(rowItem['BColors'][key]);
              }
            });
          }
        });
      });
      sheet.resumePaint();
    },
    startObserving(remarkTb) {
      const tableElement = this.$refs[`spreadsheetRef${remarkTb}`]?.[0].$el;
      if (tableElement) {
        this[`resizeObserver${remarkTb}`] = new ResizeObserver((entries) => {
          // for (const entry of entries) {
          this.spread[remarkTb].refresh();
          // }
        });
        this[`resizeObserver${remarkTb}`].observe(tableElement);
      }
    },
    //按钮权限
    judgeBtn(routeBtn) {
      console.log(routeBtn, 'routeBtn');
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
        this[methods](remarkTb, index);
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
    // 删除
    async dataDel(remarkTb, index, parms) {
      let newData = [];
      if (this.selectionData[remarkTb].length == 0) {
        this.$message.error('请选择需要操作的数据！');
        return;
      } else {
        newData = _.cloneDeep(
          this.selectionData[remarkTb].map((obj) => {
            obj['ElementDeleteFlag'] = 1;
            return obj;
          }),
        );
      }
      this.$confirm('确定要删除的【' + newData.length + '】数据吗？')
        .then((_) => {
          _this.dataSave(remarkTb, index, null, newData);
        })
        .catch((_) => {});
    },
    // 退回
    async dataDel(remarkTb, index, parms) {
      let newData = [];
      if (this.selectionData[remarkTb].length == 0) {
        this.$message.error('请选择需要操作的数据！');
        return;
      } else {
        newData = _.cloneDeep(
          this.selectionData[remarkTb].map((obj) => {
            obj['ElementDeleteFlag'] = 1;
            return obj;
          }),
        );
      }
      this.$confirm('确定要退回的【' + newData.length + '】数据吗？')
        .then((_) => {
          _this.dataSave(remarkTb, index, null, newData);
        })
        .catch((_) => {});
    },
    resetScheduling(remarkTb, index, parms) {
      let newData = [];
      if (this.selectionData[remarkTb].length == 0) {
        this.$message.error('请选择需要操作的数据！');
        return;
      } else {
        this.adminLoading = true;
        newData = _.cloneDeep(
          this.selectionData[remarkTb].map((obj) => {
            return obj;
          }),
        );
      }
      this.$confirm('确定要重排选择的【' + newData.length + '】数据吗？')
        .then(async (_) => {
          let res = await GetSearch(
            newData,
            '/APSAPI/MOPlanSaveToDayPlan?isPlan=1',
          );
          this.adminLoading = true;
          this.adminLoading = true;
          const { result, data, count, msg } = res.data;
          if (result) {
            this.dataSearch(remarkTb);
            this.adminLoading = false;
            this.$message({
              message: msg,
              type: 'success',
              dangerouslyUseHTMLString: true,
            });
          } else {
            this.adminLoading = false;
            this.$message({
              message: msg,
              type: 'error',
              dangerouslyUseHTMLString: true,
            });
          }
        })
        .catch((_) => {});
    },
    // 单击行
    handleRowClick(row, remarkTb) {},
    // 保存
    async dataSave(remarkTb, index, parms, newData) {
      this.adminLoading = true;
      const sheet =
        this.spread[remarkTb] &&
        typeof this.spread[remarkTb].getActiveSheet === 'function'
          ? this.spread[remarkTb].getActiveSheet()
          : undefined;

      const $table = this.$refs[`tableRef${remarkTb}`]?.[0].$refs.vxeTable;
      if (sheet && sheet.isEditing()) {
        sheet.endEdit();
      }
      // 获取修改记录
      let changeRecords = [];
      if (newData) {
        changeRecords = newData;
      } else {
        if ($table) {
          changeRecords = $table.getUpdateRecords();
        } else {
          let DirtyRows = sheet.getDirtyRows().map((row) => row.item); //获取修改过的数据
          let InsertRows = sheet.getInsertRows().map((row) => row.item); //获取插入过的数据
          let DeletedRows = sheet.getDeletedRows().map((row) => row.item);
          DeletedRows.forEach((item) => {
            item['ElementDeleteFlag'] = 1;
          }); //获取被删除的数据
          console.log(DirtyRows, InsertRows, DeletedRows);
          changeRecords = [...DirtyRows, ...InsertRows, ...DeletedRows];
        }
      }
      if (changeRecords.length == 0) {
        this.$set(this, 'adminLoading', false);
        this.$message.error('当前数据没做修改，请先修改再保存！');
        return;
      }
      let res = await SaveData(changeRecords);
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
          m.some((n, index) => {
            //从列获取下拉数据源
            // if (i === 1) {
            if (n.DataSourceID && n.ControlType === 'combobox') {
              this.DataSourceList[i] = {
                [n.DataSourceName]: n.items,
                ...this.DataSourceList[i],
              };
            }
            // }

            if (index === 1) {
              this.tablePagination[i]['pageSize'] = n['pageSize'];
              this.hasSelect[i] = n['IsSelect'];
              this.Region[i] = n['Region'] ? n['Region'] : this.Region[i];
            }
          });
          this.$set(this.tableColumns, i, m);
          this.startObserving(i);
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
        });
        await this.changeStatus(this.Status1[0], 0);
        this.adminLoading = false;
      }
    },
    // 验证数据
    verifyData(n) {
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
      form['dicID'] = this.sysID[remarkTb]['ID'];
      let res = await GetSearchData(form);

      const { result, data, count, msg, Columns } = res.data;
      if (result) {
        if (Columns && Columns.length != 0) {
          Columns[0].some((n, i) => {
            this.verifyData(n);
            if (n.children && n.children.length != 0) {
              n.children.forEach((x) => {
                this.verifyData(x);
              });
            }
          });
          this.$set(this.tableColumns, remarkTb, Columns[0]);
        }
        this.$set(this.tableData, remarkTb, data);
        this.$set(this.tablePagination[remarkTb], 'pageTotal', count);
        this.setData(remarkTb);
      } else {
        this.$message({
          message: msg,
          type: 'error',
          dangerouslyUseHTMLString: true,
        });
      }
      this.$set(this.tableLoading, remarkTb, false);
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
      // let colInfos = [];
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
        // if (x.isEdit) {
        //   sheet.getCell(-1, y).locked(false).foreColor("#2a06ecd9");
        // }
      });
      //渲染列
      sheet.bindColumns(this.tableColumns[remarkTb]); //此方法一定要放在setDataSource后面才能正确渲染列名
      sheet.setRowCount(1, GC.Spread.Sheets.SheetArea.colHeader);
      colHeader1.forEach(function (value, index) {
        sheet.setValue(0, index, value, GC.Spread.Sheets.SheetArea.colHeader);
      });

      // 设置整个列头的背景色和前景色。
      /**
       * 参数1:表示行
       * 参数2:列，-1表示
       * 参数3:
       * 参数4:
       * 参数5:
       */
      let colHeaderStyle = sheet.getRange(
        0,
        -1,
        1,
        -1,
        GC.Spread.Sheets.SheetArea.colHeader,
      );
      colHeaderStyle.foreColor('000000d9');
      colHeaderStyle.backColor('#f3f3f3');
      colHeaderStyle.font(
        '12px basefontRegular, Roboto, Helvetica, Arial, sans-serif',
      );
      colHeaderStyle.hAlign(GC.Spread.Sheets.HorizontalAlign.left);
      colHeaderStyle.vAlign(GC.Spread.Sheets.HorizontalAlign.left);

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
      this.tableData[remarkTb].forEach((rowItem, rowIndex) => {
        this.tableColumns[remarkTb].forEach((columnItem, columnIndex) => {
          // 获取当前单元格
          const cell = sheet.getCell(rowIndex, columnIndex);
          cell.foreColor('black');
          cell.backColor('white');
          if (columnItem['isEdit']) {
            cell.locked(false).foreColor('#2a06ecd9');
          }
          if (
            Object.prototype.toString.call(rowItem['FColors']) ===
            '[object Object]'
          ) {
            Object.keys(rowItem['FColors']).forEach((key) => {
              const columnIndex = this.tableColumns[remarkTb].findIndex(
                (columnItem) => columnItem.prop === key,
              );
              if (columnIndex !== -1) {
                // 这里使用 rowIndex 和 columnIndex 获取单元格
                const cell = sheet.getCell(rowIndex, columnIndex);
                cell.foreColor(rowItem['FColors'][key]);
              }
            });
          }
          if (
            Object.prototype.toString.call(rowItem['BColors']) ===
            '[object Object]'
          ) {
            Object.keys(rowItem['BColors']).forEach((key) => {
              const columnIndex = this.tableColumns[remarkTb].findIndex(
                (columnItem) => columnItem.prop === key,
              );
              if (columnIndex !== -1) {
                // 这里使用 rowIndex 和 columnIndex 获取单元格
                const cell = sheet.getCell(rowIndex, columnIndex);
                cell.backColor(rowItem['BColors'][key]);
              }
            });
          }
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
        if (m.isEdit) {
          sheet.getRange(-1, cellIndex, 1, 1).locked(false);
          var cell = sheet.getCell(
            -1,
            cellIndex,
            GC.Spread.Sheets.SheetArea.viewport,
          );
          //cell.foreColor("#2a06ecd9");
        } else {
          var cell = sheet.getCell(
            -1,
            cellIndex,
            GC.Spread.Sheets.SheetArea.viewport,
          );
          // cell.foreColor("gray");
        }

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

      var insertRowsCopyStyle = {
        canUndo: true,
        name: 'insertRowsCopyStyle',
        execute: function (context, options, isUndo) {
          var Commands = GC.Spread.Sheets.Commands;
          if (isUndo) {
            Commands.undoTransaction(context, options);
            return true;
          } else {
            sheet.suspendPaint();
            sheet.addRows(options.activeRow, _this.sheetSelectRows.length);
            //  sheet.setArray(options.activeRow, 0,_this.sheetSelectRows);
            // console.log(_this.sheetSelectRows);

            // console.log(_this.sheetSelectObj.start+_this.sheetSelectRows.length)
            //删除旧行
            if (_this.sheetSelectObj.start > options.activeRow) {
              //说明从下面插入上面
              sheet.copyTo(
                _this.sheetSelectObj.start + _this.sheetSelectRows.length,
                0,
                options.activeRow,
                0,
                _this.sheetSelectRows.length,
                sheet.getColumnCount(),
                GC.Spread.Sheets.CopyToOptions.all,
              );

              //   sheet.setArray(options.activeRow, 0, _this.sheetSelectRows);
              sheet.deleteRows(
                _this.sheetSelectObj.start + _this.sheetSelectRows.length,
                _this.sheetSelectObj.count,
              );
              // sheet.removeRow(_this.sheetSelectObj.start+ _this.sheetSelectRows.length)
            } else {
              //从上面往下面插入
              sheet.copyTo(
                _this.sheetSelectObj.start,
                0,
                options.activeRow,
                0,
                _this.sheetSelectRows.length,
                sheet.getColumnCount(),
                GC.Spread.Sheets.CopyToOptions.all,
              );
              //  sheet.setArray(options.activeRow, 0, _this.sheetSelectRows);
              sheet.deleteRows(
                _this.sheetSelectObj.start,
                _this.sheetSelectObj.count,
              );
            }
            let count = sheet.getRowCount(GC.Spread.Sheets.SheetArea.viewport);

            let lineID = _this.sheetSelectRows[0][lineIDIndex];
            let isFind = false;
            let viewSort = 1;

            for (var i = 0; i < count; i++) {
              if (isFind == false && sheet.getValue(i, lineIDIndex) == lineID) {
                isFind = true;
              }
              if (isFind && sheet.getValue(i, lineIDIndex) != lineID) {
                break;
              }
              if (isFind) {
                sheet.setValue(i, viewSortIndex, viewSort);
                viewSort++;
              }
            }

            // Commands.startTransaction(context, options);

            // sheet.suspendPaint();

            // var beforeRowCount = 0;

            //  sheet.suspendPaint();

            // Commands.endTransaction(context, options);
            sheet.resumePaint();

            return true;
          }
        },
      };

      this.spread[remarkTb]
        .commandManager()
        .register('insertRowsCopyStyle', insertRowsCopyStyle);

      function MyContextMenu() {}
      MyContextMenu.prototype = new GC.Spread.Sheets.ContextMenu.ContextMenu(
        this.spread[remarkTb],
      );
      MyContextMenu.prototype.onOpenMenu = function (
        menuData,
        itemsDataForShown,
        hitInfo,
        spread,
      ) {
        itemsDataForShown.forEach(function (item, index) {
          // console.log(item);
          if (item && item.name === 'gc.spread.rowHeaderinsertCutCells') {
            item.command = 'insertRowsCopyStyle';
          }
          //  else if (item && item.name === "gc.spread.cut") {

          //     item.command = "insertRowsCut";
          //   }
        });
      };
      var contextMenu = new MyContextMenu();
      this.spread[remarkTb].contextMenu = contextMenu;
      // 剪贴板事件绑定
      sheet.bind(
        GC.Spread.Sheets.Events.ClipboardChanged,
        function (sender, args) {
          let s = sheet.getSelections()[0];
          console.log(sheet.getDataItem(s.row));
          _this.sheetSelectRows = sheet.getArray(
            s.row,
            0,
            s.rowCount,
            _this.tableColumns[remarkTb].length,
          );
          _this.sheetSelectObj.start = s.row;

          _this.sheetSelectObj.count = s.rowCount;
        },
      );

      /////////////////表格事件/////////////
      //绑定表格事件前，需清除之前的绑定事件
      this.spread[remarkTb].unbindAll();
      this.spread[remarkTb].bind(GCsheets.Events.ButtonClicked, (e, args) => {
        const { sheet, row, col } = args;
        const cellType = sheet.getCellType(row, col);
        if (cellType instanceof GCsheets.CellTypes.Button) {
        }
        if (cellType instanceof GCsheets.CellTypes.CheckBox) {
        }
        if (cellType instanceof GCsheets.CellTypes.HyperLink) {
        }
      });
      //表格编辑事件

      // this.spread[remarkTb].bind(
      //   GCsheets.Events.EditStarting,
      //   function (e, args) {},
      // );
      // this.spread[remarkTb].bind(GCsheets.Events.EditEnded, function (e, args) {
      // 自动计算数量
      // _this.computedNum(args.row, args.col, args.editingText);
      // for (var i = args.col + 1; i < _this.tableColumns[0].length; i++) {
      //   sheet.setArray(args.row, i, [2021]);
      // }
      // });
      // 表格单击齐套率弹框事件
      // this.spread[remarkTb].bind(GCsheets.Events.CellClick, function (e, args) {
      // });
      //脏数据清除
      // sheet.bind(GC.Spread.Sheets.Events.RowChanged, function (e, info) {});
      this.spread[remarkTb].resumePaint();
      this.adminLoading = false;
      this.tableLoading[remarkTb] = false;
      setTimeout(() => {
        this.spread[remarkTb].refresh(); //重新定位宽高度
      });
    },
    // 自动计算数量
    computedNum(rowIndex, colIndex, val) {
      let sheet = this.spread[0].getActiveSheet();
      let dataSource = sheet.getDataSource();
      if (val == null) {
        val = 0;
      } else if (val == 0) {
        //输入0不触发自动计算
        return;
      }
      let currentRow = dataSource[rowIndex];
      if (currentRow.ID == -1) {
        return false;
      }
      let currentlabel = this.tableColumns[0][colIndex].prop + 'dy';
      if (!currentRow[currentlabel]) {
        //不是天日的数量
        currentlabel = this.tableColumns[0][colIndex].prop;
        // if (currentlabel == "ViewSort") {
        //   val = currentRow[currentlabel];
        //   if (val) {
        //     let newRowindex = 1;
        //     let flag = false;
        //     let lineID = currentRow["LineID"];
        //     //循环上面
        //     for (var r = 0; r < dataSource.length - 1; r++) {
        //       let row = dataSource[r];
        //       if (lineID != row["LineID"]) {
        //         continue;
        //       }
        //       let thisValue = newRowindex; //row[currentlabel];
        //       if (row["Code"] == null || row["Code"] == "") {
        //         break;
        //       }
        //       if (r < rowIndex) {
        //         //当前循环的在当前操作行的上面
        //         if (thisValue >= val && flag === false) {
        //           newRowindex = val + 1;
        //           flag = true;
        //         }

        //         thisValue = newRowindex;
        //         newRowindex++;
        //       } else if (r > rowIndex) {
        //         //当前循环的在当前操作行的下面
        //         if (newRowindex == val) {
        //           newRowindex++;
        //         }

        //         thisValue = newRowindex;
        //         newRowindex++;
        //       } else {
        //         thisValue = val;
        //       }
        //       sheet.setValue(r, colIndex, thisValue);
        //     }
        //   }
        // } else {
        // }
        sheet.setDataSource(this.tableData[0]);
        return;
      }
      if (
        !currentRow[currentlabel].TotalHours ||
        parseInt(currentRow[currentlabel].TotalHours) <= 0
      ) {
        this.$message.error('该天休息，上班时间为0');

        sheet.setValue(rowIndex, colIndex, '');

        return;
      }

      let Qty = parseInt(currentRow.OweQty);
      let Capacity = parseInt(currentRow.Capacity);
      if (!Capacity) {
        this.$message.error('该单据没有产能');
        return;
      }
      let list = [];
      let editNum = 0;
      let remainNum = 0;
      // 填一个数量自动将之后的全清干净，前面的累计 prop2有值
      this.tableColumns[0].some((x, i) => {
        if (i <= colIndex) {
          list.push(currentRow[x.prop]);
          if (x.prop2 && i != colIndex && currentRow[x.prop]) {
            editNum = parseInt(editNum) + parseInt(currentRow[x.prop]);
          }
        } else {
          if (x.prop2 && i != colIndex && currentRow[x.prop]) {
            list.push('');
          } else {
            list.push(currentRow[x.prop]);
          }
        }
      });
      remainNum = Qty - editNum;

      if (parseInt(val) > remainNum) {
        this.$message.error(
          '输入的数量不能大于剩余排产数，剩余排产数为：' + remainNum,
        );
        list[colIndex] = '';
        for (var j = 0; j < this.tableColumns[0].length; j++) {
          sheet.setArray(rowIndex, j, [list[j]]);
        }
        return;
      } else {
        // 接着计算下面每一个空格该有的数
        for (var j = colIndex + 1; j < this.tableColumns[0].length; j++) {
          if (this.tableColumns[0][j]['prop2']) {
            let label = this.tableColumns[0][j].prop + 'dy';
            let obj = currentRow[label];
            remainNum = remainNum - parseInt(val);
            let maxNum =
              (Capacity * obj.TotalHours * obj.DayCapacity) /
              currentRow.StandardPeoples;
            maxNum = parseInt(maxNum);
            if (remainNum <= 0) {
              list[j] = null;
            } else {
              if (remainNum <= maxNum) {
                list[j] = remainNum;
                break;
              } else {
                list[j] = maxNum;
                remainNum -= maxNum;
              }
            }
          }
        }
        for (var j = 0; j < this.tableColumns[0].length; j++) {
          sheet.setArray(rowIndex, j, [list[j]]);
        }
      }
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
    selectFun(data, remarkTb, row) {
      this.$set(this.selectionData, remarkTb, data);
    },
    // 改变状态
    async changeStatus(item, index) {
      this.labelStatus1 = item['index'];
      Object.assign(this.formSearchs[this.labelStatus1].datas, item['value']);
      await this.dataSearch(this.labelStatus1);
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
::v-deep .el-dialog3 {
  .el-dialog {
    margin-top: 10vh !important;
    height: 80vh !important;
    display: flex;
    flex-direction: column;
    .el-dialog__body {
      padding: 2px !important;
      flex-grow: 1;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    .dialog-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
}
</style>
