<!--PCB总排期-->
<template>
  <div class="APSContainer" v-loading="adminLoading">
    <div class="admin_head" ref="headRef">
      <div v-for="i in [0, 1]" :key="i" v-show="labelStatus1 == i">
        <ComSearch
          ref="searchRef"
          :searchData="formSearchs[i].datas"
          :searchForm="formSearchs[i].forms"
          :remark="i"
          :isLoading="isLoading"
          :btnForm="btnForm"
          :signName="labelStatus1"
          @btnClick="btnClick"
        />
      </div>
    </div>
    <div>
      <div class="admin_content">
        <div class="ant-table-title">
          <el-row>
            <el-col :span="4"
              ><span class="title">{{ title }}</span></el-col
            >
            <el-col :span="20" class="flex_flex_end">
              <div>
                <span>选择机台/班组：</span>
                <el-select
                  clearable
                  filterable
                  size="mini"
                  v-model="ruleForm.LineIDs"
                  @change="setFooterLabel"
                  style="width: 320px"
                >
                  <el-option
                    v-for="(item, i) in lines"
                    :key="i"
                    :label="item.LineName"
                    :value="item.LineID"
                  >
                  </el-option>
                </el-select>
                <span>生产时段：</span>
                <el-date-picker
                  v-model="ruleForm.ProducedDate"
                  type="date"
                  size="mini"
                  placeholder="选择生产时段"
                >
                </el-date-picker>
                <el-divider direction="vertical"></el-divider>
              </div>
              <div v-for="(item, y) in Status1" :key="y">
                <span
                  @click="changeStatus(item, y)"
                  :class="labelStatus1 == y ? 'statusActive cursor' : 'cursor'"
                  >{{ item.label }}</span
                >
                <el-divider direction="vertical"></el-divider>
              </div>
            </el-col>
          </el-row>
        </div>
        <!-- <div class="flex_column" :style="{ height: height }" v-show="labelStatus1 == 1"> -->
        <!-- <div class="spreadContainer" v-loading="tableLoading[1]">
            <gc-spread-sheets class="sample-spreadsheets" @workbookInitialized="initSpread">
              <gc-worksheet></gc-worksheet>
            </gc-spread-sheets>
          </div> -->
        <!-- <div class="flex_row_spaceBtn pagination"> -->
        <!-- <div>
              <span @click="toPageSetting(sysID[1].ID)" class="primaryColor cursor">SysID:{{ sysID[1].ID }}
              </span>
            </div> -->
        <!-- <div class="flex"> -->
        <!-- 去掉分页，因为会导致计算排期没有全选工序工时被清空问题 -->
        <!-- <span>共{{ tablePagination[1].pageTotal }}条</span> -->
        <!-- <el-pagination
                background
                @size-change="(val) => pageSize(val, 1)"
                :current-page="tablePagination[1].pageIndex"
                :page-sizes="[200, 500, 1000, 3000, 5000, 10000]"
                :page-size="tablePagination[1].pageSize"
                :total="tablePagination[1].pageTotal"
                @current-change="(val) => pageChange(val, 1)"
                layout="total, sizes, prev, pager, next,jumper"
              >
              </el-pagination> -->
        <!-- </div> -->
        <!-- </div> -->
        <!-- </div> -->
        <!-- <div v-for="item in [0, 1]" :key="item" v-show="labelStatus1 == item"> -->
          <!-- <ComVxeTable
            :rowKey="'RowNumber'"
            :ref="`tableRef${item}`"
            :height="height"
            :tableData="tableData[item]"
            :tableHeader="tableColumns[item]"
            :tableLoading="tableLoading[item]"
            :isEdit="isEdit"
            :hasSelect="hasSelect[item]"
            :remark="item"
            :cellStyle="cellStyle0"
            :sysID="sysID[item].ID"
            :isClear="isClear[item]"
            :footerLabel="footerLabel[item]"
            :pagination="tablePagination[item]"
            @pageChange="pageChange"
            @pageSize="pageSize"
            @selectfun="selectFun"
            @keyupEnter="editSort"
            @sortChange="sortChange"
          /> -->
        <!-- </div> -->
        <div
            class="flex_column"
            v-for="item in [0, 1]"
            :key="item"
            v-show="labelStatus1 == item"
          >
            <ComSpreadTable
              style="box-sizing: border-box;"
              ref="`spreadsheetRef${item}`"
              :height="height"
              :hasSelect="hasSelect[item]"
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

      <!-- 点击齐套率弹框-->
      <DialogTable
        title="订单齐套分析"
        :tableDialog="colDialogVisible"
        :sysID="7916"
        width="80%"
        @closeDialog="colDialogVisible = false"
        :searchForm="dialogSearchForm"
        :isToolbar="false"
      ></DialogTable>
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
GC.Spread.Common.CultureManager.culture('zh-cn');

import ComSearch from '@/components/ComSearch';
import ComVxeTable from '@/components/ComVxeTable';
import ComSpreadTable from '@/components/ComSpreadTable';
import { HeaderCheckBoxCellType } from '@/static/data.js';
import {
  GetHeader,
  GetSearchData,
  ExportData,
  SaveData,
  GetSearch,
} from '@/api/Common';
import DialogTable from '@/components/Dialog/dialogTable';
export default {
  name: 'TBTotalSchedule',
  components: {
    ComSearch,
    ComVxeTable,
    DialogTable,
    ComSpreadTable
  },
  data() {
    return {
      dialogSearchForm: {},
      colDialogVisible: false,
      ////////////////// Search /////////////////
      footerLabel: ['', '', '', '', '', '', ''],
      sysID: [
        // { ID: 5156 },
        // { ID: 5615 },
        { ID: 7958 },
        { ID: 7958 },
        // { ID: 5156 },
        // { ID: 5156 },
        // { ID: 5156 },
        // { ID: 5156 },
        // { ID: 5156 },
      ],
      Status1: [
        { label: '总排期', value: 0 },
        // { label: 'PCB月计划', value: 1 },
        // { label: "SMT待排", value: 2 },
        // { label: "SMT已排", value: 2 },
        // { label: "补焊待排", value: 3 },
        // { label: "补焊已排", value: 3 },
        { label: '已完成', value: 1 },
        // { label: '待转入备料', value: 4 },
        // { label: '已转入备料', value: 5 },
      ],
      title: this.$route.meta.title,
      labelStatus1: 0,
      PrepareDate: '',
      adminLoading: false,
      checkdBtnCodes: [],
      drawer: false,
      height: '400px',
      formSearchs: [
        {
          datas: {CompletionStatus:0},
          forms: [],
        },
        {
          datas: {CompletionStatus:1},
          forms: [],
        },
        {
          datas: {},
          forms: [],
        },
        {
          datas: { IsSetPrepare: '未生成' },
          forms: [],
        },
        {
          datas: { IsSetPrepare: '已生成' },
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
      parmsBtn: [
        {
          ButtonCode: 'save',
          BtnName: '保存',
          Type: 'warning',
          Ghost: true,
          Size: 'small',
          signName: [0],
          Methods: 'dataSave',
          Icon: '',
        },
        {
          ButtonCode: 'save',
          BtnName: '计算排期',
          Type: 'warning',
          Ghost: true,
          Size: 'small',
          signName:[0],
          Methods: 'computedPlan',
          Icon: '',
        },
        {
          ButtonCode: 'save',
          BtnName: '转入日计划',
          Type: 'primary',
          Ghost: true,
          Size: 'small',
          signName: [0],
          Methods: 'setPlan',
          Params: { ProcessID: 'P202009092233201' },
          Icon: '',
        },
        {
          ButtonCode: 'save',
          BtnName: '退回',
          Type: 'danger',
          Ghost: true,
          signName: [0],
          Size: 'small',
          Methods: 'backData',
          Icon: '',
        }
      ],
      tableData: [[], [], [], [], [], [], []],
      delData: [[], [], [], [], [], [], []],
      tableColumns: [[], [], [], [], [], [], []],
      tableLoading: [false, false, false, false, false, false],
      isClear: [false, false, false, false, false, false],
      tablePagination: [
        { pageIndex: 1, pageSize: 500, pageTotal: 0 },
        { pageIndex: 1, pageSize: 0, pageTotal: 0 },
        { pageIndex: 1, pageSize: 100, pageTotal: 0 },
        { pageIndex: 1, pageSize: 3000, pageTotal: 0 },
        { pageIndex: 1, pageSize: 3000, pageTotal: 0 },
        { pageIndex: 1, pageSize: 100, pageTotal: 0 },
        { pageIndex: 1, pageSize: 100, pageTotal: 0 },
      ],
      height: '450px',
      showPagination: true,
      tagRemark: 0,
      isLoading: false,
      initialBtnData: [],
      tagRremark: 1,
      selectionData: [[], [], [], [], [], [], []],
      hasSelect: [true, false, false, true, false, false],
      isEdit: false,
      losePrepareDate: 1,
      losePrepareDate2: 1,
      ruleForm: {
        LineIDs: [],
        ProducedDate: '',
      },
      lines: [],
      spread: [],
      sheetSelectRows: [],
      sheetSelectObj: { start: 0, end: 0, count: 0 },
    };
  },
  watch: {},
  created() {
    _this = this;
    this.adminLoading = true;
    this.getLine();
    this.getTableHeader();
    
    // 获取所有按钮
    this.btnForm = this.$route.meta.btns;
    this.judgeBtn(this.btnForm);
  },
  activated() {
    if (this.spread) {
      this.spread.refresh();
    }
  },
  mounted() {
    setTimeout(() => {
      this.setHeight();
      
    }, 450);
  },
  methods: {
    workbookInitialized: function (workbook, remarkTb) {
      this.spread[remarkTb] = workbook;
    },

    // 回退
    backData(remarkTb) {
      // this.getSelectionData();
      if (this.selectionData[remarkTb].length == 0) {
        this.$message.error('请选择需要操作的数据！');
      } else {
        this.$confirm('确定退回吗？')
          .then(() => {
            // 确定
            this.adminLoading = true;
            this.selectionData[remarkTb].forEach((a) => {
              a['ElementDeleteFlag'] = 1;
            });
            this.dataSave(this.selectionData[remarkTb], 0);
          })
          .catch(() => {
            // 取消
          });
      }
    },
    // 跳转至页面配置
    toPageSetting(id) {
      this.$router.push({
        name: 'FieldInfo',
        params: {
          ID: id,
        },
      });
    },
    // 判断按钮权限
    judgeBtn(routeBtn) {
      if (routeBtn && routeBtn.length > 0)
        routeBtn.some((item, index) => {
          if (item.ButtonCode == 'save') {
            this.$set(this, 'isEdit', true);
          }
        });
      this.$set(this, 'btnForm', routeBtn);
    },
    initSpread: function (spread,index) {
      this.spread[index] = spread;
    },

    setData(remarkTb) {
      //sheet获取
      this.spread[remarkTb].suspendPaint();
      let sheet = this.spread[remarkTb].getActiveSheet();
      sheet.options.allowCellOverflow = true;
      sheet.defaults.rowHeight = 23;
      sheet.defaults.colWidth = 100;
      sheet.defaults.colHeaderRowHeight = 23;
      sheet.defaults.rowHeaderColWidth = 60;
      let colHeader1 = [];
      let colInfos = [];
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
      if (this.tableColumns[remarkTb][0]['FixCount']) {
        // 冻结
        sheet.frozenColumnCount(this.tableColumns[remarkTb][0].FixCount);
      }

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

      this.spread[remarkTb].options.tabStripVisible = false; //是否显示表单标签

      //改变字体颜色
      this.tableData[remarkTb].forEach((rowItem, rowIndex) => {
        this.tableColumns[remarkTb].forEach((column, columnIndex) => {
          // 获取当前单元格
          const cell = sheet.getCell(rowIndex, columnIndex);
          cell.foreColor('black');
          cell.backColor('white');
          if (column['isEdit']) {
            cell.locked(false).foreColor('#2a06ecd9');
          }
          if (rowItem['Code'] == null) {
            cell.backColor('#A0CFFF');
            cell.foreColor('black');
          }
          if (rowItem['Capacity'] && column['name'] === 'Capacity') {
            cell.foreColor('red');
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
      /////////////////表格事件/////////////
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
                GC.Spread.Sheets.CopyToOptions.style,
              );
              sheet.setArray(options.activeRow, 0, _this.sheetSelectRows);
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
              sheet.setArray(options.activeRow, 0, _this.sheetSelectRows);
              sheet.deleteRows(
                _this.sheetSelectObj.start,
                _this.sheetSelectObj.count,
              );
            }
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
          if (item && item.name === 'gc.spread.rowHeaderinsertCutCells') {
            item.command = 'insertRowsCopyStyle';
          }
        });
      };
      var contextMenu = new MyContextMenu();
      this.spread[remarkTb].contextMenu = contextMenu;
      // 剪贴板事件绑定
      sheet.bind(
        GC.Spread.Sheets.Events.ClipboardChanged,
        function (sender, args) {
          let s = sheet.getSelections()[0];
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

      // 表格单击齐套率弹框事件
      this.spread[remarkTb].bind(GCsheets.Events.CellClick, function (e, args) {
        if (_this.tableColumns[remarkTb].length) {
          _this.tableColumns[remarkTb].map((item, index) => {
            if (item.name === 'K1' && args.col === index) {
              
              // 显示ERP供需平衡表
              _this.colDialogVisible = true;
              _this.dialogSearchForm.AUFNR =
                _this.tableData[_this.tagRemark][args.row].OrderNo;
              _this.dialogSearchForm.ZQLS = 0;
            }
          });
        }
      });

      //表格编辑事件
      this.spread[remarkTb].bind(
        GCsheets.Events.EditStarting,
        function (e, args) {},
      );
      this.spread[remarkTb].bind(
        GCsheets.Events.EditEnded,
        function (e, args) {},
      );
      this.spread[remarkTb].resumePaint();
      this.adminLoading = false;
      this.tableLoading[remarkTb] = false;
      this.spread[remarkTb].refresh(); //重新定位宽高度
    },

     //转入月计划
    async ToPlan() {
     

      if (this.selectionData[0].length == 0) {
        this.$message({
          message: '请选择要操作的数据',
          type: 'error',
          dangerouslyUseHTMLString: true,
        });
      } else {
        this.adminLoading = true;
        let res = await GetSearch(
          this.selectionData[0],
          '/APSAPI/InsertIntoPCBByOrderID',
        );
        const { result, data, count, msg } = res.data;
        if (result) {
          this.adminLoading = false;
          this.dataSearch(0);
        } else {
          this.adminLoading = false;
          this.$message({
            message: msg,
            type: 'error',
            dangerouslyUseHTMLString: true,
          });
        }
      }
    },
    getSelectionData(remarkTb) {
      let sheet = this.spread[remarkTb].getActiveSheet();
      let newData = sheet.getDataSource();
      this.selectionData[remarkTb] = [];
      if (newData.length != 0) {
        newData.forEach((x) => {
          if (x.isChecked) {
            this.selectionData[1].push(x);
          }
        });
      }
    },
    // 高度控制
    setHeight() {
      let headHeight = this.$refs.headRef.offsetHeight;

      let rem =
        document.documentElement.clientHeight -
        headHeight -
        this.$store.getters.reduceHeight ;
      let newHeight = rem + 'px';
      this.$set(this, 'height', newHeight);
    },
    // 编辑行
    editRow(row) {
      this.$set(row, 'update', true);
    },
    // 删除行
    delRow(row) {
      this.$confirm('确定要删除该菜单嘛？')
        .then((_) => {})
        .catch((_) => {});
    },
    // 单击行
    handleRowClick(row, remarkTb) {
      this.delData[remarkTb] = [];
      this.delData[remarkTb].push(row);
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
    dataSearch(remarkTb) {
      this.tagRemark = remarkTb;
      this.tableData[remarkTb] = [];
      this.$set(this.tableLoading, remarkTb, true);
      this.$set(this.isClear, remarkTb, true);
      this.tablePagination[remarkTb].pageIndex = 1;
      this.getTableData(this.formSearchs[remarkTb].datas, remarkTb);
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
    // 导出
    async dataExport(remarkTb) {
      this.adminLoading = true;
      let form = JSON.parse(JSON.stringify(this.formSearchs[remarkTb].datas));
      form['rows'] = 0;
      let res = await ExportData(form);
      this.adminLoading = false;
      this.$store.dispatch('user/exportData', res.data);
    },
    // 通用直接保存
    async generalSaveData(newData, remarkTb, index) {
     
      let res = await SaveData(newData);
      
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
    },
    // 保存返回结果自己处理事件
    async returnResultData(newData) {
      let res = await SaveData(newData);
      return res;
    },
    // 获取表头数据
    async getTableHeader() {
      let IDs = this.sysID;
      let res = await GetHeader(IDs);
      const { datas, forms, result, msg } = res.data;
      if (result) {
        // 获取每个表头
        datas.some((m, i) => {
          m.forEach((n) => {
            // 进行验证
            if (n.prop == 'MenuCode' || n.prop == 'MenuName') {
              this.$set(n, 'treeNode', true);
            }
            this.verifyDta(n);
            if (n.children && n.children.length != 0) {
              n.children.forEach((x) => {
                this.verifyDta(x);
              });
            }
          });
          this.$set(this.tableColumns, i, m);
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
        
        // this.formSearchs[2].datas['CompletionStatus'] = '1';
        // this.formSearchs[1].datas['productionstatus'] = [21, 22, 23, 24, 26];
        // this.getTableData(this.formSearchs[1].datas, );
        this.getTableData(this.formSearchs[this.labelStatus1].datas, this.labelStatus1);
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
      // form['CompletionStatus'] = this.
      let res = await GetSearchData(form);
      const { result, data, count, msg } = res.data;
      this.$set(this.tableLoading, remarkTb, false);
      if (result) {
        // if(data.length != 0){
        //   data.forEach(a=>{
        //     a.ViewSort = a.RowNumber
        //   })
        // } // 只能强行给1-最后用来行号测试，不确定后台数据怎么存，一开始这些数据就不是从1开始排序

        this.$set(this.tableData, remarkTb, data);
        this.setData(remarkTb);
        this.$set(this.tablePagination[remarkTb], 'pageTotal', count);
      } else {
        this.$message({
          message: msg,
          type: 'error',
          dangerouslyUseHTMLString: true,
        });
      }
    },
    // 填写行号自动排好序
    editSort(row, val, prop, index) {
      if (this.labelStatus1 != 0) {
        return;
      }
      let newData = [];
      let newData_1 = [];
      let newData_2 = [];
      let newData_3 = [];
      let newData_4 = [];
      if (val < row.RowNumber) {
        // 改成比之前更小的行号 row.RowNumber为目标行数
        newData_1 = this.tableData[1].filter(
          (a) => parseInt(a.ViewSort) < parseInt(val),
        ); //把最终行号的前面的数取出来
        newData_2 = this.tableData[1].filter((b) => {
          return (
            parseInt(b.RowNumber) >= parseInt(val) &&
            parseInt(b.RowNumber) != parseInt(row.RowNumber)
          );
        }); //把前面的数过滤掉且过滤掉自身
        newData_3 = [row];
        newData = newData_1.concat(newData_3).concat(newData_2);
      } else {
        // 改成比原来大的数
        newData_1 = this.tableData[1].filter(
          (a) => parseInt(a.ViewSort) < parseInt(row.RowNumber),
        ); //把最终行号的前面的数取出来
        newData_2 = this.tableData[1].filter((b) => {
          return (
            parseInt(b.RowNumber) > parseInt(row.RowNumber) &&
            parseInt(b.RowNumber) <= parseInt(val)
          );
        }); //把介于两数之间，大于原来的数，小于目标数的数拿出来
        newData_3 = [row];
        newData_4 = this.tableData[1].filter((b) => {
          return parseInt(b.RowNumber) > parseInt(val);
        });
        newData = newData_1
          .concat(newData_2)
          .concat(newData_3)
          .concat(newData_4);
      }

      let realyData = JSON.parse(JSON.stringify(newData));
      realyData.forEach((c, i) => {
        c.ViewSort = i + 1;
        c.RowNumber = i + 1;
      });
      this.$set(this.tableData, 0, realyData);
    },
    // 选择数据
    selectFun(data, remarkTb, row) {
      this.$set(this.selectionData, remarkTb, data);
    },
    // 改变状态
    changeStatus(x, index) {
      this.labelStatus1 = index;
      this.dataSearch(index);
    },

    // 同步装配排程
    async refreshPlan(row, prop, val, index) {
      this.adminLoading = true;
      let res = await GetSearch('', '/APSAPI/InsertIntoPCB');
      const { result, data, count, msg } = res.data;
      if (result) {
        this.adminLoading = false;
        this.dataSearch(index);
      } else {
        this.adminLoading = false;
        this.$message({
          message: msg,
          type: 'error',
          dangerouslyUseHTMLString: true,
        });
      }
    },

    // 保存排序
    async saveSort() {
      let sheet = this.spread.getActiveSheet();
      let newData = sheet.getDirtyRows();
      let submitData = [];
      if (newData.length != 0) {
        newData.forEach((x) => {
          submitData.push(x.item);
        });
      }
      if (submitData.length == 0) {
        this.$message.error('没修改过任何数据！');
        return;
      }
      this.adminLoading = true;
      let res = await SaveData(submitData);

      const { result, data, count, msg } = res.data;

      if (result) {
        this.dataSearch(1);
        this.$message({
          message: msg,
          type: 'success',
          dangerouslyUseHTMLString: true,
        });
      } else {
        this.$message({
          message: msg,
          type: 'error',
          dangerouslyUseHTMLString: true,
        });
      }
      this.adminLoading = false;
    },
    // 清空排期
    clearPlan(remarkTb) {
      if (this.selectionData[remarkTb].length != 0) {
        this.selectionData[remarkTb].forEach((a) => {
          a.StartDate = '';
        });
      }
    },
    // 计算排期
    async computedPlan(remarkTb) {
      // let data = this.selectionData[remarkTb]
      let  data = {
        MaterialProp:'SMT'
        ,WERKS:'2888,8088'
      }
      // if(data.length === 0 ){
      //   this.$message.error('请选择需要转入日计划的数据！');  
      //   return
      // }
      // this.$confirm('确定要将选择的【' + data.length + '】数据转入日计划吗？')
      //   .then(res=>{
      //     GetSearch( data, '/APSAPI/InsertProcessPlanByOrderID')
      //       .then(r=>{
      //         if(!r.result){
      //           this.$message.error('下达失败,请重试!');  
      //           return
      //         }
      //         this.$message.success('下达成功!');
      //         this.refrshPage()
      //       })
      //   })
      this.$confirm('确定要计算排期吗？')
      .then(res=>{
        GetSearch( data, '/APSAPI/APSSalesStartDate')
            .then(r=>{
              if(!r.data.result){ 
                this.$message({
                  message: r.data.msg,
                  type: 'error',
                  dangerouslyUseHTMLString: true,
                });
                return
              }
              this.$message({
                  message: r.data.msg,
                  type: 'success',
                  dangerouslyUseHTMLString: true,
                });
              this.refrshPage()
            })
      })
      .catch(err=>{
        // 取消
      })
            
    },

    // 保存
    // async dataSave(remarkTb, index) {
    //   // console.log('save')
    //   this.adminLoading = true;
    //   let res = await SaveData(remarkTb);
    //   const { result, data, count, msg } = res.data;

    //   if (result) {
    //     this.dataSearch(0);
    //     this.$message({
    //       message: msg,
    //       type: 'success',
    //       dangerouslyUseHTMLString: true,
    //     });
    //   } else {
    //     this.$message({
    //       message: msg,
    //       type: 'error',
    //       dangerouslyUseHTMLString: true,
    //     });
    //   }
    //   this.adminLoading = false;
    // },
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
      console.log('changeRecords',changeRecords)
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
    // 转入日计划
    async setPlan(remarkTb, index, params) {
      let data = this.selectionData[remarkTb]
      if(data.length === 0 ){
        this.$message({
          message:'请选择需要转入日计划的数据！',
          type:'error',
          dangerouslyUseHTMLString: true,
        })
        return
      }
      this.$confirm('确定要将【' + data.length + '】条数据转入日计划吗？')
        .then(res=>{
          GetSearch( data, '/APSAPI/InsertProcessPlanByOrderID')
            .then(r=>{
              if(!r.data.result){
                this.$message({
                  message: r.data.msg,
                  type: 'error',
                  dangerouslyUseHTMLString: true,
                });
                return
              }
              this.$message({
                  message: r.data.msg,
                  type: 'success',
                  dangerouslyUseHTMLString: true,
                });
              this.refrshPage()
            })
        })
      
      
    },
    // 选线获取剩余工时
    setFooterLabel(val) {
      let LineIDs = this.lines.filter((a) =>
        this.ruleForm.LineIDs.some((b) => b == a.LineID),
      );
      let LineName = LineIDs.map((c) => c.LineName).join(',');
      //查询线别剩余工时
      let StrValue = `提示：当前所选${LineName}线，在${this.ruleForm.ProducedDate}共有350个小时，已占用250小时，剩余100小时【已选4项，预计占用50小时，剩余50小时】`;
      this.$set(this.footerLabel, 0, StrValue);
    },
    // 获取线别
    async getLine() {
      let form = {};
      form['rows'] = 0;
      form['dicID'] = 36;
      form['Status'] = 1;
      form['OrganizeTypeID'] = 6;
      let res = await GetSearchData(form);
      const { result, data, count, msg } = res.data;
      if (result) {
        if (data.length != 0) {
          data.forEach((a) => {
            a['LineID'] = a.OrganizeID;
            a['LineName'] = a.OrganizeName;
          });
        }
        this.lines = data;
      } else {
        this.$message({
          message: msg,
          type: 'error',
          dangerouslyUseHTMLString: true,
        });
      }
    },
    // 备料任务
    async readyTask(remarkTb, index, MOSchedulingType) {
      let submitData = this.selectionData[remarkTb];
      if (submitData.length != 0) {
        this.adminLoading = true;
        let url = '/APSAPI/SetPreParePlanV2';
        let res = await GetSearch(submitData, url);
        const { result, data, count, msg } = res.data;
        if (result) {
          this.dataSearch(this.tagRemark);
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
      } else {
        this.$message.error('请选择需要操作的数据！');
      }
    },
  },
};
</script>
