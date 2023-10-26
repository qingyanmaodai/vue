<!-- 业务订单明细 -->
<template>
  <div
    class="APSContainer flex_column content_height bgWhite"
    v-loading="adminLoading"
  >
    <div class="admin_head" ref="headRef">
      <div v-for="i in [0]" :key="i">
        <ComSearch
          ref="searchRef"
          :searchData="formSearchs[i].datas"
          :searchForm="formSearchs[i].forms"
          :remark="i"
          :isLoading="tableLoading[i]"
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
          <el-col :span="12" class="flex"> </el-col>
          <el-col :span="12" class="flex_flex_end">
            <a
              style="color: #ec0d1f; margin-right: 30px"
              :href="`${apsurl}` + '/瑞能业务订单明细.pdf'"
              target="_blank"
              class="font_size_1"
              >【逻辑说明文档】</a
            >
            <a
              style="color: #0960bd; margin-right: 30px"
              :href="`${apsurl}` + '/业务订单明细导入模板.xlsx'"
              target="_blank"
              class="font_size_1"
              >业务订单明细导入模板</a
            >
            <!-- 下拉框 -->
            <el-select
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
              @click="updateColor(0)"
              >确定</el-button
            >
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
    </div>
    <div
      class="admin_content flex_grow"
      id="tableContainer"
      v-for="item in [0]"
      :key="item"
    >
      <ComSpreadTable
        ref="spreadsheetRef"
        :height="'100%'"
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
      />
    </div>
    <el-dialog title="添加计划" :visible.sync="newDataDialog" width="80%">
      <div v-for="item in [1]" :key="item">
        <ComSearch
          class="margin_bottom_10 dialog_search"
          ref="searchRef"
          :searchData="formSearchs[item].datas"
          :searchForm="formSearchs[item].forms"
          :remark="item"
          :isLoading="tableLoading[item]"
          :btnForm="btnForm"
          :signName="item"
          :Region="Region[item]"
          @btnClick="btnClick"
        />
        <ComSpreadTable2
          ref="spreadsheetRef"
          height="500px"
          :tableData="tableData[item]"
          :tableColumns="tableColumns[item]"
          :tableLoading="tableLoading[item]"
          :remark="item"
          :sysID="sysID[item]['ID']"
          :pagination="tablePagination[item]"
          @pageChange="pageChange"
          @pageSize="pageSize"
          @workbookInitialized="workbookInitialized"
          @selectChanged="selectChanged"
        />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="newDataDialog = false" size="small">取 消</el-button>
        <el-button type="primary" @click="sureAddNewData" size="small"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 导入文件 -->
    <div>
      <el-dialog title="导入" :visible.sync="dialogImport" width="50%">
        <el-upload
          action="https://jsonplaceholder.typicode.com/posts/"
          style="padding-top: 10px"
          class="upload-demo"
          drag
          :limit="1"
          :multiple="false"
          name="files"
          ref="upload"
          :on-change="handleChanged"
          :on-remove="handleRemove"
          :file-list="fileList"
          :auto-upload="false"
          accept=".xls, .xlsx"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            将文件拖到此处，或
            <em>点击上传</em>
          </div>
          <div class="el-upload__tip" slot="tip">
            只能上传xls、xslx文件且仅支持上传一个文件
          </div>
        </el-upload>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogImport = false" size="small"
            >取 消</el-button
          >
          <el-button size="small" type="primary" @click="sureImport"
            >确 定</el-button
          >
        </span>
      </el-dialog>
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
import ComSearch from '@/components/ComSearch/AdvancedSearch';
import ComSpreadTable from '@/components/ComSpreadTable';
import ComSpreadTable2 from '@/components/ComSpreadTable';
import { HeaderCheckBoxCellType } from '@/static/data.js';
import {
  GetHeader,
  GetSearchData,
  ExportData,
  GetSearch,
  SaveData,
  GetServerTime,
  GetOrgData,
  UpdateOrderBomPOTracker,
} from '@/api/Common';
import formatDates from '@/utils/formatDate';
import XLSX from 'xlsx';
export default {
  name: 'EKOrderDetails',
  components: {
    ComSearch,
    ComSpreadTable,
    ComSpreadTable2,
  },
  data() {
    return {
      apsurl: null,
      colorType: 0,
      colorValue: null,
      newDataDialog: false,
      height: '607px',
      selectedOption: [1],
      dialogSearchForm: {},
      colDialogVisible: false,
      colAdd: [],
      dialogImport: false,
      machineCycle: '',
      title: this.$route.meta.title, //表名
      adminLoading: false, //加载状态
      labelStatus1: 0,
      tagRemark: 0,
      btnForm: [], //拥有的按钮权限
      // 表头添加动态按钮
      formSearchs: [
        //不同标签页面的查询条件
        {
          datas: {
            // CreatedBy: this.CreatedBy
          }, //查询入参
          forms: [], // 页面显示的查询条件
          required: [], //获取必填项
        },
        {
          datas: {
            CreatedBy: this.$store.getters.userInfo.Account,
          }, //查询入参
          forms: [], // 页面显示的查询条件
          required: [], //获取必填项
        },
      ],
      tableData: [[], []], //表格渲染数据,sysID有几个就有几个数组
      tableColumns: [[], []], //表格表头列
      tableLoading: [false, false], //每个表加载
      isClear: [false, false],
      hasSelect: [false, false],
      Region: [5, 5],
      tablePagination: [
        //表分页参数
        { pageIndex: 1, pageSize: 2000, pageTotal: 0 },
        { pageIndex: 1, pageSize: 2000, pageTotal: 0 },
      ],
      sysID: [{ ID: 10108 }, { ID: 10108 }],
      colorStatus: [
        { label: '字体颜色', value: 0 },
        { label: '背景颜色', value: 1 },
      ],
      Status1: [
        {
          label: '未完成',
          value: { IsPoDetailFinish: 0 },
        },
        {
          label: '已完成',
          value: { IsPoDetailFinish: 1 },
        },
        { label: '全部', value: { IsPoDetailFinish: '' } },
      ],
      spread: [], //excel初始
      fileList: [],
      file: [],
      selectionData: [[]],
      sheetSelectRows: [],
      sheetSelectObj: { start: 0, end: 0, count: 0 },
      ImportParams: '',
      isEdit: true,
      RoleMapStatus: false,
      BatchDelete: false,
      CreatedBy: '',
    };
  },
  activated() {
    if (this.spread[this.labelStatus1]) {
      this.spread[this.labelStatus1].refresh();
    }
  },
  created() {
    this.apsurl = localStorage.getItem('apsurl');
    _this = this;
    _this.adminLoading = true;
    // 获取所有按钮
    this.btnForm = this.$route.meta.btns;
    this.judgeBtn(this.btnForm);
    this.getTableHeader();
    let RoleMapList = this.$store.getters.userInfo.RoleMap;
    if (RoleMapList.length) {
      RoleMapList.forEach((item) => {
        if (
          item.RoleID === 'R2305080001' ||
          item.RoleID === 'R2306050001' ||
          item.RoleID === 'R2309060001'
        ) {
          //业务经理
          this.RoleMapStatus = true;
          return;
        }
        if (item.RoleID === 'R2306050001') {
          //业务订单明细批量删除
          this.BatchDelete = true;
          return;
        }
      });
    }
    this.CreatedBy =
      this.RoleMapStatus === true ? '' : this.$store.getters.userInfo.Account;
  },
  mounted() {
    let tableContainer = document.getElementById('tableContainer'); // 通过 `<div>` 的 ID 获取元素
    // 创建一个 ResizeObserver 实例
    const resizeObserver = new ResizeObserver((entries) => {
      // 当元素的大小发生变化时，会触发此回调函数
      for (const entry of entries) {
        if (entry.target === tableContainer) {
          // 在这里执行你的操作，例如刷新 SpreadJS
          // 你可能需要访问 SpreadJS 实例来调用 refresh() 方法
          this.spread[this.labelStatus1].refresh();
        }
      }
    }); // 启动 ResizeObserver 监测 `<div>` 元素的大小变化
    resizeObserver.observe(tableContainer);
    // setTimeout(() => {
    //   this.setHeight();
    // }, 500);
  },
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
          // 获取颜色
          if (
            rowItem['Result'] !== '正常' &&
            rowItem['Result'] &&
            columnIndex < 5
          ) {
            cell.backColor('#FF0000');
          }
          if (rowItem['ISPOFinish'] === '是' && key === 'ReportQty') {
            cell.backColor('#92d050');
          }
          if (rowItem['ISOutStock'] === '出库正常' && key === 'OutDate') {
            cell.backColor('#92d050');
          }
          if (rowItem['ISOutStock'] === '出库异常' && key === 'OutDate') {
            cell.backColor('#ff0000');
          }
          if (rowItem['ISCheckWarm'] === 1 && key === 'CheckDate') {
            cell.backColor('#ffff00');
          }
          if (
            Object.prototype.toString.call(rowItem['FColors']) ===
            '[object Object]'
          ) {
            Object.keys(rowItem['FColors']).forEach((key) => {
              const columnIndex = this.tableColumns[0].findIndex(
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
              const columnIndex = this.tableColumns[0].findIndex(
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
      console.log(this.tableData[0]);
    },
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
    //获取当前选中行的值
    selectChanged(newValue, remarkTb) {
      // 在子组件计算属性发生变化时，更新父组件的计算属性
      this.selectionData[remarkTb] = newValue;
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
    // 跳转至属性配置
    toPageSetting(id) {
      this.$router.push({
        name: 'FieldInfo',
        params: { ID: id },
      });
    },
    // 获取表头
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
        this.adminLoading = false;
        this.changeStatus(
          {
            label: '未完成',
            value: { IsPoDetailFinish: 0 },
          },
          0,
        );
      } else {
        this.adminLoading = false;
        this.$message({
          message: msg,
          type: 'error',
          dangerouslyUseHTMLString: true,
        });
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
      form['CreatedBy'] = this.CreatedBy;
      let res = await GetSearchData(form);
      const { result, data, count, msg, Columns } = res.data;
      if (result) {
        this.$set(this.tableData, remarkTb, data);
        this.$set(this.tablePagination[remarkTb], 'pageTotal', count);
        // 查询时重新获取列渲染
        if (Columns.length) {
          this.tableColumns[remarkTb] = Columns[0];
        }
        this.$set(this.tableLoading, remarkTb, false);
        if (remarkTb === 0) {
          this.setData(remarkTb);
        }
      } else {
        this.$message({
          message: msg,
          type: 'error',
          dangerouslyUseHTMLString: true,
        });
      }
    },
    // excle表数据渲染
    async setData(remarkTb) {
      try {
        this.spread[remarkTb].suspendPaint();
        // 获取活动表单
        let sheet = this.spread[remarkTb].getActiveSheet();
        // 重置表单
        sheet.reset();
        //渲染数据源
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
        //改变字体颜色
        this.tableData[remarkTb].forEach((rowItem, rowIndex) => {
          this.tableColumns[remarkTb].forEach((column, columnIndex) => {
            const key = column.prop;

            // 获取当前单元格
            const cell = sheet.getCell(rowIndex, columnIndex);
            cell.foreColor('black');
            cell.backColor('white');
            if (column['isEdit']) {
              cell.locked(false).foreColor('#2a06ecd9');
            }
            if (
              rowItem['Result'] !== '正常' &&
              rowItem['Result'] &&
              columnIndex < 5
            ) {
              cell.backColor('#FF0000');
            }
            // 获取颜色
            if (rowItem['ISPOFinish'] === '是' && key === 'ReportQty') {
              cell.backColor('#92d050');
            }
            if (rowItem['ISOutStock'] === '出库正常' && key === 'OutDate') {
              cell.backColor('#92d050');
            }
            if (rowItem['ISOutStock'] === '出库异常' && key === 'OutDate') {
              cell.backColor('#ff0000');
            }
            if (rowItem['ISCheckWarm'] === 1 && key === 'CheckDate') {
              cell.backColor('#ffff00');
            }
            if (
              Object.prototype.toString.call(rowItem['FColors']) ===
              '[object Object]'
            ) {
              Object.keys(rowItem['FColors']).forEach((key) => {
                const columnIndex = this.tableColumns[0].findIndex(
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
                const columnIndex = this.tableColumns[0].findIndex(
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
        sheet.setDefaultStyle(
          defaultStyle,
          GC.Spread.Sheets.SheetArea.viewport,
        );

        defaultStyle.showEllipsis = true;
        // 冻结
        sheet.frozenColumnCount(this.tableColumns[remarkTb][1].FixCount);

        this.spread[remarkTb].options.tabStripVisible = false; //是否显示表单标签
        this.spread[remarkTb].options.scrollbarMaxAlign = true;
        // this.spread.options.scrollByPixel = true;

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
              let count = sheet.getRowCount(
                GC.Spread.Sheets.SheetArea.viewport,
              );

              let lineID = _this.sheetSelectRows[0][lineIDIndex];
              let isFind = false;
              let viewSort = 1;

              for (var i = 0; i < count; i++) {
                if (
                  isFind == false &&
                  sheet.getValue(i, lineIDIndex) == lineID
                ) {
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

        this.spread[remarkTb].bind(
          GCsheets.Events.EditStarting,
          function (e, args) {},
        );
        this.spread[remarkTb].bind(
          GCsheets.Events.EditEnded,
          function (e, args) {},
        );
        // 表格单击齐套率弹框事件
        this.spread[remarkTb].bind(
          GCsheets.Events.CellClick,
          function (e, args) {},
        );
        //脏数据清除
        sheet.bind(GC.Spread.Sheets.Events.RowChanged, function (e, info) {
          console.log(
            info.row +
              ',' +
              info.col +
              ',' +
              '由' +
              info.oldValue +
              '改变为' +
              info.newValue,
          );
        });
        this.spread[remarkTb].resumePaint();
        this.adminLoading = false;
        this.tableLoading[remarkTb] = false;
      } catch (error) {
        console.log('表格渲染的错误信息:', error);
      }
      setTimeout(() => {
        this.spread[remarkTb].refresh(); //重新定位宽高度
      });
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
    // 查询
    dataSearch(remarkTb) {
      this.tagRemark = remarkTb;
      this.tableData[remarkTb] = [];
      this.$set(this.tableLoading, remarkTb, true);
      this.tablePagination[remarkTb].pageIndex = 1;
      this.getTableData(this.formSearchs[remarkTb].datas, remarkTb);
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
    // 当前第几页
    pageChange(val, remarkTb) {
      this.$set(this.tablePagination[remarkTb], 'pageIndex', val);
      this.getTableData(this.formSearchs[remarkTb].datas, remarkTb);
    },
    // 页数
    pageSize(val, remarkTb) {
      this.$set(this.tablePagination[remarkTb], 'pageSize', val);
      this.getTableData(this.formSearchs[remarkTb].datas, remarkTb);
    },
    // 改变状态
    changeStatus(item, index) {
      this.labelStatus1 = index;
      this.formSearchs[0].datas['IsPoDetailFinish'] =
        item.value['IsPoDetailFinish'];
      this.dataSearch(0);
    },
    // 保存
    async dataSave(remarkTb, index, parms, newData) {
      // this.adminLoading = true;
      const sheet = this.spread[remarkTb]?.getActiveSheet();
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
    // 导入并分析模板
    dataImport(remarkTb, index, params) {
      this.dialogImport = true;
      this.fileList = [];
      this.file = [];
      // this.ImportParams = params.isDel;
    },
    // 确认导入
    sureImport() {
      if (this.fileList.length == 0) {
        this.$message.error('请先选择文件');
        return;
      } else if (this.fileList.length > 1) {
        this.$message.error('仅支持一个文件上传');
      } else {
        this.$confirm('确定要导入并分析吗？')
          .then((_) => {
            _this.importExcel(this.file);
          })
          .catch((_) => {});
      }
    },
    //导入解析excel
    importExcel(file) {
      this.adminLoading = true;
      this.dialogImport = false;
      const result = [];
      const reader = new FileReader(); //上传就解析文件
      var that = this;
      reader.onload = function (e) {
        const data = e.target.result;
        this.wb = XLSX.read(data, {
          type: 'binary',
          cellDates: true,
          dateNF: 'yyyy-MM-dd',
        });
        this.wb.SheetNames.forEach((sheetName) => {
          result.push({
            sheetName: sheetName,
            sheet: XLSX.utils.sheet_to_json(this.wb.Sheets[sheetName], {
              defval: null,
            }),
          });
        });
        that.dataSys(result); // 解析文件
      };
      reader.readAsBinaryString(file.raw);
    },
    isValidDate(date) {
      return date instanceof Date && !isNaN(date.getTime());
    },
    // 解析文件
    async dataSys(importData) {
      this.adminLoading = true;
      if (importData && importData.length > 0) {
        let DataList = [];
        let isDate = false;
        this.colAdd = [];
        let obj = {};
        let rowNo = 0; // excel行号
        let propName = '';
        let split = []; //存储需求到料日期过期信息
        let groupList = [];
        importData[0].sheet.forEach((m, y) => {
          for (let key in m) {
            if (this.tableColumns[this.tagRemark].length) {
              // 判断是否和配置里的取名一致，一致才可导入
              for (
                let i = 0;
                i < this.tableColumns[this.tagRemark].length;
                i++
              ) {
                let item = this.tableColumns[this.tagRemark][i];
                if (item.label === key) {
                  if (item.DataType === 'datetime') {
                    if (m[key] && !this.isValidDate(m[key])) {
                      //预防用户输入日期格式不正确的判断
                      propName = key;
                      rowNo = Number(m.__rowNum__) + 1;
                      // 异常提示
                      split.push(
                        `第${rowNo}行,【${propName}】格式存在错误，导入失败，请检查！`,
                      );
                    } else {
                      if (this.$moment(m[key]).format('YYYY-MM-DD HH:mm:ss')) {
                        let getDate = new Date(m[key]);
                        // // 注意的点：xlsx将excel中的时间内容解析后，会小一天xlsx会解析成 Mon Nov 02 2020 23:59:17 GMT+0800 小了43秒，所以转化为时间戳再加上43秒
                        var date = new Date(
                          getDate.setSeconds(getDate.getSeconds() + 43),
                        );
                        obj[item.prop] = m[key]
                          ? this.$moment(date).format('YYYY-MM-DD')
                          : '';
                      }
                    }
                    // 注意的点：xlsx将excel中的时间内容解析后，会小一天xlsx会解析成 Mon Nov 02 2020 23:59:17 GMT+0800 小了43秒，所以需要在moment转换后＋1天
                    // 判断需求到料日期是否大于今天
                    // if (
                    //   item.prop === "DeliveryDate" &&obj[item.prop]&&
                    //   obj[item.prop] < formatDates.formatTodayDate()
                    // ) {
                    //   propName = this.$moment(obj[item.prop]).format('YYYY-MM-DD')
                    //   rowNo = Number(m.__rowNum__) + 1;
                    //   // 异常提示
                    //   split.push(
                    //     `第${rowNo}行,【${propName}】过期，导入失败，请检查！`
                    //   );
                    // }
                  }
                  // else if (item.prop === "DemandQty") {
                  //   if (m[key] > 0) {
                  //     //导入欠料数大于0才导入
                  //     obj[item.prop] = m[key];
                  //   } else {
                  //     return;
                  //   }
                  // }
                  else {
                    obj[item.prop] = m[key];
                  }
                } else if (isNaN(key) && !isNaN(Date.parse(key))) {
                  //导入日期并且数大于0才导入
                  // 列为日期的格式
                  isDate = true;
                  if (Number(m[key]) > 0) {
                    // obj["DeliveryDate"] = this.$moment(key).format("YYYY-MM-DD");
                    // obj["DemandQty"] = m[key];
                    obj['dicID'] = _this.sysID[_this.tagRemark].ID;
                    obj['Account'] = _this.$store.getters.userInfo.Account;
                    obj['row'] = m.__rowNum__;
                    // 需要使用...obj 不然值回写有问题
                    DataList.push({ ...obj });
                    break;
                  }
                }
              }
            }
          }
          // 以下为固定入参
          if (!isDate) {
            obj['dicID'] = this.sysID[this.tagRemark].ID;
            obj['Account'] = this.$store.getters.userInfo.Account;
            obj['row'] = m.__rowNum__;
            obj['Status'] = 0;
            // 需要使用...obj 不然值回写有问题
            DataList.push({ ...obj });
          }
        });
        // 必填校验
        if (this.formSearchs[this.tagRemark].required.length) {
          // 动态检验必填项
          for (let i = 0; i < DataList.length; i++) {
            for (
              let x = 0;
              x < this.formSearchs[this.tagRemark].required.length;
              x++
            ) {
              if (
                DataList[i][
                  this.formSearchs[this.tagRemark].required[x]['prop']
                ] === undefined ||
                DataList[i][
                  this.formSearchs[this.tagRemark].required[x]['prop']
                ] === null ||
                DataList[i][
                  this.formSearchs[this.tagRemark].required[x]['prop']
                ] === ''
              ) {
                rowNo = Number(DataList[i]['row']) + 1;
                // 异常提示
                split.push(
                  `第${rowNo}行,【${
                    this.formSearchs[this.tagRemark].required[x]['label']
                  }】不能为空，导入失败，请填写`,
                );
                this.adminLoading = false;
              }
            }
          }
        }
        if (split.length) {
          //异常集合
          this.adminLoading = false;
          let txt = '';
          split.map((value) => {
            return (txt = `${txt}<p style="word-break: break-word;">${value}</p>`);
          });
          this.$alert(txt, {
            dangerouslyUseHTMLString: true,
            title: '导入异常信息!',
            customClass: 'message-width',
          });

          return;
        }
        // =1表示要删记录（删除并导入）
        // =0表示不删除（增量导入）
        if (DataList.length) {
          // console.log("DataList", DataList);
          let res = await GetSearch(DataList, '/APSAPI/OrderDetailImport');
          const { result, data, count, msg } = res.data;
          if (result) {
            this.adminLoading = false;
            // this.dataSearch(this.tagRemark);
            // 导入可能存在表头格式不一样，需要更新
            this.getTableHeader();
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
          this.adminLoading = false;
          this.$message.error('未接收到数据，请检查！');
        }
      }
    },
    handleChanged(file, fileList) {
      var ext = file.name.substring(file.name.lastIndexOf('.') + 1);
      const extension = ext === 'xlsx' || ext === 'xls';
      if (!extension) {
        this.$message.error('上传文件格式只能为xlsx/xls');
        // 取消时在文件列表中删除该文件
        this.$refs.upload.handleRemove(file);
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 50;
      if (!isLt2M) {
        this.$message.error('上传文件大小不能超过 50MB!');
        // 取消时在文件列表中删除该文件
        this.$refs.upload.handleRemove(file);
        return false;
      } else {
        this.file = file;
        this.fileList = fileList;
      }
    },
    handleRemove(file) {
      this.fileList.splice(
        this.fileList.findIndex((item) => item.url === file.url),
        1,
      );
    },
    // 分析
    async Analysis([remarkTb]) {
      // let form = {
      // SDate: _this.machineCycle.length ? _this.machineCycle[0] : "",
      // Edate: _this.machineCycle.length ? _this.machineCycle[1] : "",
      // };
      let sheet = this.spread[remarkTb].getActiveSheet();
      let newData = sheet.getDataSource();
      this.selectionData[this.tagRemark] = [];
      if (newData && newData.length != 0) {
        newData.forEach((x) => {
          if (x.isChecked) {
            this.selectionData[this.tagRemark].push(x);
          }
        });
      }
      if (this.selectionData[this.tagRemark].length == 0) {
        this.$message.error('请选择需要操作的数据！');
        return;
      }
      this.adminLoading = true;
      let res = await GetSearch(
        this.selectionData[this.tagRemark],
        '/APSAPI/CalculateBOMDemand',
      );
      const { result, data, count, msg } = res.data;
      try {
        if (result) {
          this.adminLoading = false;
          this.$message({
            message: msg,
            type: 'success',
            dangerouslyUseHTMLString: true,
          });
          this.dataSearch(this.tagRemark);
        } else {
          this.adminLoading = false;
          this.$message({
            message: msg,
            type: 'error',
            dangerouslyUseHTMLString: true,
          });
        }
      } catch (error) {
        if (error) {
          this.adminLoading = false;
        }
      }
    },
    //需求检查
    async MRPCheckData() {
      this.adminLoading = true;
      let res = await GetSearch('', '/APSAPI/MRPCheckData');
      const { result, data, count, msg } = res.data;
      try {
        if (result) {
          this.adminLoading = false;
          this.$message({
            message: msg,
            type: 'success',
            dangerouslyUseHTMLString: true,
          });
          this.dataSearch(this.tagRemark);
        } else {
          this.adminLoading = false;
          this.$message({
            message: msg,
            type: 'error',
            dangerouslyUseHTMLString: true,
          });
        }
      } catch (error) {
        if (error) {
          this.adminLoading = false;
        }
      }
    },
    //需求导入
    async MRPToOfficial() {
      if (this.selectionData[this.tagRemark].length == 0) {
        this.$message.error('请选择需要操作的数据！');
        return;
      }
      this.adminLoading = true;
      let res = await GetSearch(
        this.selectionData[this.tagRemark],
        '/APSAPI/MRPToOfficial',
      );
      const { result, data, count, msg } = res.data;
      try {
        if (result) {
          this.adminLoading = false;
          this.$message({
            message: msg,
            type: 'success',
            dangerouslyUseHTMLString: true,
          });
          this.dataSearch(this.tagRemark);
        } else {
          this.adminLoading = false;
          this.$message({
            message: msg,
            type: 'error',
            dangerouslyUseHTMLString: true,
          });
        }
      } catch (error) {
        if (error) {
          this.adminLoading = false;
        }
      }
    },
    //删除
    dataDel(remarkTb) {
      if (this.selectionData[remarkTb].length == 0) {
        this.$message.error('请选择需要删除的数据！');
        return;
      } else {
        if (!this.BatchDelete && this.CreatedBy) {
          if (this.selectionData[remarkTb].length >= 3) {
            this.$message.error('一次最多删除两行数据');
            return;
          }
        }

        this.$confirm('删除不可恢复，确定要删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info',
        }).then(async () => {
          this.adminLoading = true;
          this.selectionData[remarkTb].map((item) => {
            item['ElementDeleteFlag'] = 1;
          });
          let res = await SaveData(this.selectionData[remarkTb]);
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
        });
      }
    },
    // 添加计划
    addPlan() {
      this.dataSearch(1);
      this.newDataDialog = true;
    },
    // 确定添加这些排程进来
    async sureAddNewData() {
      // 不确定是否加进来就保存在数据库，怕其他按钮操作执行查询白添加了
      if (this.selectionData[7].length == 0) {
        this.$message.error('未选择数据！');
        this.newDataDialog = true;
      } else {
        this.selectionData[7].forEach((m) => {
          m.dicID = 10075;
          m['SalesOrderDetailPlanID'] = null;
          m['PlanQty'] = m['Qty'];
          m['DataSource'] = '手动加单';
        });
        _this.adminLoading = true;
        let res = await GetSearch(
          this.selectionData[7],
          `/APSAPI/SaveData10075`,
        );
        const { result, msg } = res.data;

        if (result) {
          this.adminLoading = false;
          this.dataSearch(0);
          this.selectionData[7] = [];
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
            duration: 8000,
          });
        }
        this.newDataDialog = false;
      }
    },
  },
};
</script>
<style lang="scss">
.message-width {
  width: 500px;
  height: 90%;
  .el-message-box__content {
    height: 93%;
    overflow-y: scroll;
  }
}
</style>
