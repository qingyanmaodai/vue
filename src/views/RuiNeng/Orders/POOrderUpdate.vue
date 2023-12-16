<!--订单明细-->
<template>
  <div class="APSContainer" v-loading="adminLoading">
    <div class="admin_head" ref="headRef">
      <div v-for="i in [0]" :key="i" v-show="labelStatus1 == i">
        <ComSearch
          ref="searchRef"
          :searchData="formSearchs[i].datas"
          :searchForm="formSearchs[i].forms"
          :remark="i"
          :isLoading="isLoading"
          :btnForm="btnForm"
          :signName="labelStatus1"
          :Region="Region[i]"
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
            <el-col :span="20" class="flex_flex_end"> </el-col>
          </el-row>
        </div>
        <div
          class="flex_column"
          v-for="item in [0]"
          :key="item"
          v-show="labelStatus1 == item"
        >
          <ComSpreadTable
            ref="spreadsheetRef"
            :height="height"
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
import ComSearch from '@/components/ComSearch/AdvancedSearch';
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
  name: 'POOrderUpdate',
  components: {
    ComSearch,
    ComVxeTable,
    DialogTable,
    ComSpreadTable,
  },
  data() {
    return {
      dialogSearchForm: {},
      colDialogVisible: false,
      ////////////////// Search /////////////////
      footerLabel: ['', '', '', '', '', '', ''],
      sysID: [
        { ID: 5156 },
        { ID: 5615 },
        { ID: 5156 },
        { ID: 5156 },
        { ID: 5156 },
        { ID: 5156 },
        { ID: 5156 },
      ],
      // Status1: [
      //   { label: "待维护PO", value: 0 },
      //   { label: "暂停挂起", value: 1 },
      //   { label: "已完成", value: 3 },
      //   { label: "排产中", value: 4 },
      //   { label: "全部", value: 5 }
      // ],
      title: this.$route.meta.title,
      labelStatus1: 0,
      PrepareDate: '',
      adminLoading: false,
      checkdBtnCodes: [],
      drawer: false,
      height: '707px',
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
        {
          datas: {},
          forms: [],
        },
      ],
      btnForm: [],
      spread: [[], [], [], [], []],
      tableData: [[], [], [], [], [], [], []],
      delData: [[], [], [], [], [], [], []],
      tableColumns: [[], [], [], [], [], [], []],
      tableLoading: [false, false, false, false, false, false],
      isClear: [false, false, false, false, false, false],
      hasSelect: [false, false, false, false, false, false],
      Region: [6, 6, 6, 6, 6, 6],
      tablePagination: [
        { pageIndex: 1, pageSize: 500, pageTotal: 0 },
        { pageIndex: 1, pageSize: 0, pageTotal: 0 },
        { pageIndex: 1, pageSize: 100, pageTotal: 0 },
        { pageIndex: 1, pageSize: 3000, pageTotal: 0 },
        { pageIndex: 1, pageSize: 3000, pageTotal: 0 },
        { pageIndex: 1, pageSize: 100, pageTotal: 0 },
        { pageIndex: 1, pageSize: 100, pageTotal: 0 },
      ],
      height: '707px',
      showPagination: true,
      tagRemark: 0,
      isLoading: false,
      initialBtnData: [],
      tagRremark: 1,
      selectionData: [[], [], [], [], [], [], []],
      hasSelect: [true, true, false, true, false, false],
      isEdit: false,
      losePrepareDate: 1,
      losePrepareDate2: 1,
      sheetSelectRows: [],
      sheetSelectObj: { start: 0, end: 0, count: 0 },
      ruleForm: {
        LineIDs: [],
        ProducedDate: '',
      },
      lines: [],
    };
  },
  watch: {},
  created() {
    _this = this;
    this.adminLoading = true;
    this.getTableHeader();
    // 获取所有按钮
    this.btnForm = this.$route.meta.btns;
    this.judgeBtn(this.btnForm);
  },
  // activated() {
  //   if (this.spread) {
  //     this.spread.refresh();
  //   }
  // },
  mounted() {
    setTimeout(() => {
      this.setHeight();
    }, 450);
  },
  methods: {
    judgeBtn(routeBtn) {
      if (routeBtn && routeBtn.length > 0)
        routeBtn.some((item, index) => {
          if (item.ButtonCode == 'save') {
            this.$set(this, 'isEdit', true);
          }
        });
      this.$set(this, 'btnForm', routeBtn);
    },
    //获取子组件实例
    workbookInitialized: function (workbook, remarkTb) {
      this.spread[remarkTb] = workbook;
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
    // excle表数据渲染
    async setData(remarkTb) {
      try {
        this.spread[remarkTb].suspendPaint();
        // 获取活动表单
        let sheet = this.spread[remarkTb].getActiveSheet();
        // 重置表单
        sheet.reset();
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
            // colInfos.push({
            //   name: x.prop,
            //   displayName: x.label,
            //   cellType: "",
            //   size: parseInt(x.width)
            // });
            let newData = [];
            // let list = null;
            this.tableData[remarkTb].map((item, index) => {
              if (x.DataSourceID && x.DataSourceName) {
                newData = item[x.DataSourceName]; // 设置列表每行下拉菜单
                this.bindComboBoxToCell(sheet, index, y, newData);
              }
            });
          } else if (
            x.DataType == 'datetime' ||
            x.DataType === 'varchar' ||
            x.DataType === 'nvarchar'
          ) {
            x.formatter = '@';
            // colInfos.push({
            //   name: x.prop,
            //   displayName: x.label,
            //   size: parseInt(x.width),
            //   formatter: "@" //字符串格式
            // });
          }

          //行，start,end
          if (x.isEdit) {
            sheet.getCell(-1, y).locked(false).foreColor('#2a06ecd9');
            // sheet.getRange(-1, cellIndex, 1, 1).locked(false);
            // let cell = sheet.getCell(
            //   -1,
            //   cellIndex,
            //   GC.Spread.Sheets.SheetArea.viewport
            // );
            // cell.foreColor("#2a06ecd9");
          }
          // cellIndex++;
        });
        //渲染数据源
        sheet.setDataSource(this.tableData[remarkTb]);
        //渲染列
        sheet.bindColumns(this.tableColumns[remarkTb]); //此方法一定要放在setDataSource后面才能正确渲染列名
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
        let hideRowFilter = new GC.Spread.Sheets.Filter.HideRowFilter(
          cellrange,
        );
        sheet.rowFilter(hideRowFilter);

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

        //设置数据渲染的单元格默认的样式
        var defaultStyle = new GC.Spread.Sheets.Style();
        defaultStyle.font =
          '12px basefontRegular, Roboto, Helvetica, Arial, sans-serif';
        defaultStyle.hAlign = GC.Spread.Sheets.HorizontalAlign.left;
        defaultStyle.vAlign = GC.Spread.Sheets.HorizontalAlign.left;
        sheet.setDefaultStyle(
          defaultStyle,
          GC.Spread.Sheets.SheetArea.viewport,
        );
        defaultStyle.showEllipsis = true;
        // 冻结
        sheet.frozenColumnCount(this.tableColumns[remarkTb][1].FixCount);

        this.spread[remarkTb].options.tabStripVisible = false; //是否显示表单标签
        this.spread[remarkTb].options.scrollbarMaxAlign = true;
        // this.spread[remarkTb].options.scrollByPixel = true;

        this.spread[remarkTb].resumePaint();
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
      } catch (error) {
        console.log('表格渲染的错误信息:', error);
      }
      // this.spread[remarkTb].refresh(); //重新定位宽高度
    },
    bindComboBoxToCell(sheet, row, col, dataSourceName) {
      // 获取要绑定下拉菜单的单元格对象
      let cell = sheet.getCell(row, col);

      // 创建下拉菜单单元格类型，并设置其选项数据
      let comboBox = new GC.Spread.Sheets.CellTypes.ComboBox();
      comboBox.editorValueType(
        GC.Spread.Sheets.CellTypes.EditorValueType.value,
      );
      comboBox.editable(true);
      // 获取下拉菜单的选项数据

      comboBox.items(dataSourceName);
      comboBox.itemHeight(24);

      // 将下拉菜单单元格类型绑定到指定的单元格中
      cell.cellType(comboBox);
    },
    getSelectionData() {
      let sheet = this.spread.getActiveSheet();
      let newData = sheet.getDataSource();
      this.selectionData[1] = [];
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
        this.$store.getters.reduceHeight;
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
          m.some((n, index) => {
            if (index === 1) {
              this.tablePagination[i]['pageSize'] = n['pageSize'];
              this.hasSelect[i] = n['IsSelect'];
              this.Region[i] = n['Region'] ? n['Region'] : this.Region[i];
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
    // 选择数据
    selectFun(data, remarkTb, row) {
      this.$set(this.selectionData, remarkTb, data);
    },
    // 改变状态
    changeStatus(x, index) {
      this.labelStatus1 = index;
      this.dataSearch(index);
    },

    // 保存
    async dataSave(data1, index) {
      this.adminLoading = true;

      let res = await SaveData(data1);
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
  },
};
</script>
