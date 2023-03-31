<!--待排订单管理-->
<template>
  <div class="container" v-loading="adminLoading">
    <div class="admin_head" ref="headRef">
      <ComSearch
        ref="searchRef"
        :searchData="formSearchs[0].datas"
        :searchForm="formSearchs[0].forms"
        :remark="0"
        :isLoading="isLoading"
        :btnForm="btnForm"
        :signName="labelStatus1"
        @btnClick="btnClick"
      />
    </div>
    <div>
      <div class="admin_content">
        <div class="ant-table-title">
          <el-row>
            <el-col :span="4">
              <span class="title">{{ title }}</span>
            </el-col>
            <el-col :span="20" class="flex_flex_end">
              <div
                :class="labelStatus1 == y ? 'statusActive cursor' : 'cursor'"
                v-for="(item, y) in Status1"
                :key="y"
              >
                <span @click="changeStatus(item, y)">{{ item.label }}</span>
                <el-divider direction="vertical"></el-divider>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="flex_column" :style="{ height: height }">
          <div class="spreadContainer" v-loading="tableLoading[tagRemark]">
            <gc-spread-sheets
              class="sample-spreadsheets"
              @workbookInitialized="initSpread"
            >
              <gc-worksheet></gc-worksheet>
            </gc-spread-sheets>
          </div>
          <div class="flex_row_spaceBtn pagination">
            <div>
              <span
                @click="toPageSetting(sysID[tagRemark].ID)"
                class="primaryColor cursor"
                >SysID:{{ sysID[tagRemark].ID }}
              </span>
            </div>
            <div class="flex">
              <el-pagination
                background
                @size-change="val => pageSize(val, 0)"
                :current-page="tablePagination[tagRemark].pageIndex"
                :page-sizes="[200, 500, 1000, 3000, 5000, 10000]"
                :page-size="tablePagination[tagRemark].pageSize"
                :total="tablePagination[0].pageTotal"
                @current-change="val => pageChange(val, 0)"
                layout="total, sizes, prev, pager, next,jumper"
              >
              </el-pagination>
            </div>
          </div>
        </div>
      </div>

      <!-- 点击齐套率弹框-->
      <DialogTable
        title="订单齐套分析"
        :tableDialog="colDialogVisible"
        :sysID="5165"
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
import "@grapecity/spread-sheets-vue";
import GC from "@grapecity/spread-sheets";
import "@grapecity/spread-sheets/styles/gc.spread.sheets.excel2013white.css";
import "@grapecity/spread-sheets/js/zh.js";
GC.Spread.Common.CultureManager.culture("zh-cn");
import ComSearch from "@/components/ComSearch";
import ComVxeTable from "@/components/ComVxeTable";
import { HeaderCheckBoxCellType } from "@/static/data.js";
import {
  GetHeader,
  GetSearchData,
  ExportData,
  SaveData,
  GetSearch
} from "@/api/Common";
import DialogTable from "@/components/Dialog/dialogTable";
export default {
  name: "BacklogOrderManagement",
  components: {
    ComSearch,
    ComVxeTable,
    DialogTable
  },
  data() {
    return {
      ////////////////// Search /////////////////
      dialogSearchForm: {
        OrderID: ""
      },
      colDialogVisible: false,
      footerLabel: ["", ""],
      sysID: [
        { ID: 9053 }
        // { ID: 9042 },
      ],
      Status1: [
        { label: "全部", value: "" },
        { label: "已分配", value: 21 },
        { label: "未分配", value: 26 },
        { label: "已完成", value: 25 }
      ],
      title: this.$route.meta.title,
      labelStatus1: 2,
      PrepareDate: "",
      adminLoading: false,
      checkdBtnCodes: [],
      drawer: false,
      height: "707px",
      formSearchs: [
        {
          datas: {
            ProductionStatus: 26,
            ProductionAccounts: this.$store.getters.userInfo.Account,
            sort: "OrderDate ASC"
          },
          forms: []
        },
        {
          datas: {},
          forms: []
        }
      ],
      btnForm: [],
      tableData: [[], []],
      delData: [[], []],
      tableColumns: [[], []],
      tableLoading: [false, false],
      isClear: [false, false],
      tablePagination: [
        { pageIndex: 1, pageSize: 1000, pageTotal: 0 },
        { pageIndex: 1, pageSize: 1000, pageTotal: 0 }
      ],
      height: "707px",
      showPagination: true,
      tagRemark: 0,
      isLoading: false,
      initialBtnData: [],
      selectionData: [[], []],
      hasSelect: [true],
      isEdit: false,
      losePrepareDate: 1,
      losePrepareDate2: 1,
      ruleForm: {
        LineIDs: [],
        ProducedDate: ""
      },
      lines: [],
      checkBoxCellTypeLine: ""
    };
  },
  watch: {},
  created() {
    _this = this;
    this.adminLoading = true;
    this.getTableHeader();
    // 获取所有按钮
    this.btnForm = this.$route.meta.btns;
    this.$common.judgeBtn(this, this.btnForm);
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
    // 跳转至页面配置
    toPageSetting(id) {
      this.$router.push({
        name: "FieldInfo",
        params: {
          ID: id
        }
      });
    },
    initSpread: function(spread) {
      this.spread = spread;
    },

    setData() {
      this.spread.suspendPaint();
      let sheet = this.spread.getActiveSheet();
      sheet.reset(); //重置表单
      sheet.options.allowCellOverflow = true;
      sheet.defaults.rowHeight = 23;
      sheet.defaults.colWidth = 100;
      sheet.defaults.colHeaderRowHeight = 23;
      sheet.defaults.rowHeaderColWidth = 60;
      let colHeader1 = [];
      let colInfos = [];
      let colIndex = 0;
      this.tableColumns[this.tagRemark].forEach(x => {
        if (
          x.ControlType === "comboboxMultiple" ||
          x.ControlType === "combobox"
        ) {
          let combobox = null;
          combobox = new GCsheets.CellTypes.ComboBox();
          combobox.editorValueType(
            GC.Spread.Sheets.CellTypes.EditorValueType.value
          );
          combobox.items(x.items);
          combobox.itemHeight(24);

          colInfos.push({
            name: x.prop,
            displayName: x.label,
            cellType: combobox,
            size: parseInt(x.width)
          });
        } else if (
          x.DataType == "datetime" ||
          x.DataType === "varchar" ||
          x.DataType === "nvarchar"
        ) {
          colInfos.push({
            name: x.prop,
            displayName: x.label,
            size: parseInt(x.width),
            formatter: "@" //字符串格式
          });
        } else {
          colInfos.push({
            name: x.prop,
            displayName: x.label,
            size: parseInt(x.width)
          });
        }
        colHeader1.push(x.label);
        cellIndex++;
      });
      sheet.setRowCount(1, GC.Spread.Sheets.SheetArea.colHeader);
      colHeader1.forEach(function(value, index) {
        sheet.setValue(0, index, value, GC.Spread.Sheets.SheetArea.colHeader);
      });
      if (colInfos.length && colInfos[0].name === "isChecked") {
        sheet.setCellType(
          0,
          0,
          new HeaderCheckBoxCellType(),
          GCsheets.SheetArea.colHeader
        );
        // 选框
        let checkbox = {
          name: "isChecked",
          displayName: "选择",
          cellType: new GC.Spread.Sheets.CellTypes.CheckBox(),
          size: 60
        };
        for (var name in checkbox) {
          colInfos[0][name] = checkbox[name];
        }
      }
      // 列筛选
      // 参数2 开始列
      // 参数3
      // 参数4 结束列
      var cellrange = new GC.Spread.Sheets.Range(-1, -1, -1, colIndex);

      var hideRowFilter = new GC.Spread.Sheets.Filter.HideRowFilter(cellrange);
      sheet.rowFilter(hideRowFilter);
      var row = sheet.getRange(
        0,
        -1,
        1,
        -1,
        GC.Spread.Sheets.SheetArea.colHeader
      );
      row.backColor("#f3f3f3");
      row.foreColor("#000000d9");
      row.font("12px basefontRegular, Roboto, Helvetica, Arial, sans-serif");
      var defaultStyle = new GC.Spread.Sheets.Style();
      defaultStyle.font =
        "12px basefontRegular, Roboto, Helvetica, Arial, sans-serif";
      defaultStyle.hAlign = GC.Spread.Sheets.HorizontalAlign.left;
      defaultStyle.vAlign = GC.Spread.Sheets.HorizontalAlign.center;
      defaultStyle.borderLeft = new GC.Spread.Sheets.LineBorder(
        "1px solid #CCCCCC",
        GC.Spread.Sheets.LineStyle.min
      );
      defaultStyle.borderTop = new GC.Spread.Sheets.LineBorder(
        "1px solid #CCCCCC",
        GC.Spread.Sheets.LineStyle.min
      );
      defaultStyle.borderRight = new GC.Spread.Sheets.LineBorder(
        "1px solid transparent",
        GC.Spread.Sheets.LineStyle.min
      );
      defaultStyle.borderBottom = new GC.Spread.Sheets.LineBorder(
        "1px solid transparent",
        GC.Spread.Sheets.LineStyle.min
      );
      defaultStyle.showEllipsis = true;
      sheet.setDefaultStyle(defaultStyle, GC.Spread.Sheets.SheetArea.viewport);
      sheet.frozenColumnCount(this.tableColumns[this.tagRemark][1].FixCount);

      sheet.setDataSource(this.tableData[this.tagRemark]);
      sheet.bindColumns(colInfos);

      let cellIndex = 0;

      this.tableColumns[this.tagRemark].forEach(m => {
        //行，start,end
        if (m.isEdit) {
          sheet.getRange(-1, cellIndex, 1, 1).locked(false);
          var cell = sheet.getCell(
            -1,
            cellIndex,
            GC.Spread.Sheets.SheetArea.viewport
          );
          cell.foreColor("#2a06ecd9");
        } else {
          // var cell = sheet.getCell(
          //   -1,
          //   cellIndex,
          //   GC.Spread.Sheets.SheetArea.viewport
          // );
          // cell.foreColor("gray");
        }

        cellIndex++;
      });

      // 列筛选
      // 参数2 开始列
      // 参数3
      // 参数4 结束列
      var cellrange = new GC.Spread.Sheets.Range(-1, -1, -1, cellIndex);
      var hideRowFilter = new GC.Spread.Sheets.Filter.HideRowFilter(cellrange);
      sheet.rowFilter(hideRowFilter);

      var colindexs = [1, 2, 3, 4, 5];
      this.tableData[this.tagRemark].forEach((row, index) => {
        let cellIndex = 0;
        this.tableColumns[this.tagRemark].forEach((m, num) => {
          //行，start,end
          if (
            (m.DataType == "bit" || m.ControlType == "checkbox") &&
            m.isEdit
          ) {
            var cellType = new GC.Spread.Sheets.CellTypes.CheckBox();
            cellType.caption("");
            cellType.textTrue("");
            cellType.textFalse("");
            cellType.textIndeterminate("");
            cellType.textAlign(
              GC.Spread.Sheets.CellTypes.CheckBoxTextAlign.center
            );
            cellType.isThreeState(false);
            sheet.getCell(index, cellIndex).cellType(cellType);
          }
          cellIndex++;

          var rowSheet = sheet.getRange(
            index,
            num,
            1,
            1,
            GC.Spread.Sheets.SheetArea.viewport
          );

          rowSheet = sheet.getRange(
            index,
            num,
            1,
            1,
            GC.Spread.Sheets.SheetArea.viewport
          );
          let rowSheet3 = null;
          if (row["MaterialSet"] == "100.00%" && m.name === "MaterialSet") {
            //齐套时背景色为绿色
            rowSheet3 = sheet.getCell(
              index, //行
              num, //列
              GC.Spread.Sheets.SheetArea.viewport
            );
            rowSheet3.backColor("#67c23a");
          }
          // 齐套率字体蓝色
          if (m.name === "MaterialSet") {
            rowSheet3 = sheet.getCell(
              -1, //行
              num, //列
              GC.Spread.Sheets.SheetArea.viewport
            );
            rowSheet3.foreColor("#2a06ecd9");
          }
        });
      });
      /////////////////表格事件/////////////
      this.spread.bind(GCsheets.Events.ButtonClicked, (e, args) => {
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

      this.spread.bind(GCsheets.Events.EditStarting, function(e, args) {});
      this.spread.bind(GCsheets.Events.EditEnded, function(e, args) {
        // 自动计算数量
      });

      // 表格单击齐套率弹框事件
      this.spread.bind(GCsheets.Events.CellClick, function(e, args) {
        if (_this.tableColumns[_this.tagRemark].length) {
          _this.tableColumns[_this.tagRemark].map((item, index) => {
            if (item.name === "MaterialSet" && args.col === index) {
              // 显示ERP供需平衡表
              _this.colDialogVisible = true;
              _this.dialogSearchForm.OrderID =
                _this.tableData[_this.tagRemark][args.row].OrderID;
              _this.dialogSearchForm.OweQty = 0;
            }
          });
        }
      });
      sheet.options.isProtected = true;
      sheet.options.protectionOptions.allowResizeColumns = true;
      sheet.options.protectionOptions.allowInsertRows = true;
      sheet.options.protectionOptions.allowDeleteRows = true;
      sheet.options.protectionOptions.allowSelectLockedCells = true;
      sheet.options.protectionOptions.allowSelectUnlockedCells = true;
      sheet.options.protectionOptions.allowDeleteRows = true;
      sheet.options.protectionOptions.allowDeleteColumns = true;
      sheet.options.protectionOptions.allowInsertRows = true;
      sheet.options.protectionOptions.allowInsertColumns = true;
      sheet.options.protectionOptions.allowDargInsertRows = true;
      sheet.options.protectionOptions.allowDragInsertColumns = true;
      sheet.options.protectionOptions.allowSort = true;
      sheet.options.protectionOptions.allowFilter = true;
      sheet.options.allowUserDragDrop = true;

      this.spread.resumePaint();
      this.adminLoading = false;
      this.tableLoading[this.tagRemark] = false;
      sheet.options.protectionOptions.allowResizeColumns = true; //禁用改变行高
      // sheet.options.isProtected = true; //锁定表格 //锁定表格筛选不能用，注释
      this.spread.options.tabStripVisible = false; //是否显示表单标签
      this.spread.refresh();
    },
    // 高度控制
    setHeight() {
      let headHeight = this.$refs.headRef.offsetHeight;

      let rem =
        document.documentElement.clientHeight -
        headHeight -
        this.$store.getters.reduceHeight;
      let newHeight = rem + "px";
      this.$set(this, "height", newHeight);
    },
    // 编辑行
    editRow(row) {
      this.$set(row, "update", true);
    },
    // 删除行
    delRow(row) {
      this.$confirm("确定要删除该菜单嘛？")
        .then(_ => {})
        .catch(_ => {});
    },
    // 单击行
    handleRowClick(row, remarkTb) {
      this.delData[remarkTb] = [];
      this.delData[remarkTb].push(row);
    },
    // 第几页
    pageChange(val, remarkTb, filtertb) {
      this.$set(this.tablePagination[remarkTb], "pageIndex", val);
      this.getTableData(this.formSearchs[remarkTb].datas, remarkTb);
    },
    // 页数
    pageSize(val, remarkTb, filtertb) {
      this.$set(this.tablePagination[remarkTb], "pageSize", val);
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
        if (order === "desc") {
          this.formSearchs[remarkTb].datas["sort"] = prop + " DESC";
        } else {
          this.formSearchs[remarkTb].datas["sort"] = prop + " ASC";
        }
      } else {
        this.formSearchs[remarkTb].datas["sort"] = null;
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
        if (name != "dicID") {
          if (this.formSearchs[remarkTb].forms.length) {
            // 判断是否是页面显示的查询条件，是的字段才清空
            this.formSearchs[remarkTb].forms.forEach(element => {
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
      form["rows"] = 0;
      let res = await ExportData(form);
      this.adminLoading = false;
      this.$store.dispatch("user/exportData", res.data);
    },
    // 获取表头数据
    async getTableHeader() {
      let IDs = this.sysID;
      let res = await GetHeader(IDs);
      const { datas, forms, result, msg } = res.data;
      if (result) {
        // 获取每个表头
        datas.some((m, i) => {
          m.forEach(n => {
            // 进行验证
            if (n.prop == "MenuCode" || n.prop == "MenuName") {
              this.$set(n, "treeNode", true);
            }
            this.verifyDta(n);
            if (n.childrens && n.children.length != 0) {
              n.childrens.forEach(x => {
                this.verifyDta(x);
              });
            }
          });
          this.$set(this.tableColumns, i, m);
        });
        // 获取查询的初始化字段 组件 按钮
        forms.some((x, z) => {
          this.$set(this.formSearchs[z].datas, "dicID", IDs[z].ID);
          x.forEach(y => {
            if (y.prop && y.value) {
              this.$set(this.formSearchs[z].datas, [y.prop], y.value);
            } else {
              this.$set(this.formSearchs[z].datas, [y.prop], "");
            }
          });
          this.$set(this.formSearchs[z], "forms", x);
        });
        this.getTableData(this.formSearchs[0].datas, 0);

        this.adminLoading = false;
      }
    },
    // 验证数据
    verifyDta(n) {
      for (let name in n) {
        if (
          (name == "component" && n[name]) ||
          (name == "button" && n[name]) ||
          (name == "active" && n[name])
        ) {
          n[name] = eval("(" + n[name] + ")");
        }
      }
    },
    // 获取表格数据
    async getTableData(form, remarkTb) {
      this.$set(this.tableLoading, remarkTb, true);
      form["rows"] = this.tablePagination[remarkTb].pageSize;
      form["page"] = this.tablePagination[remarkTb].pageIndex;
      let res = await GetSearchData(form);
      const { result, data, count, msg } = res.data;
      if (remarkTb == 0) {
        this.tableColumns[remarkTb] = res.data.Columns[0];
      }
      this.$set(this.tableLoading, remarkTb, false);
      if (result) {
        this.$set(this.tableData, remarkTb, data);
        if (remarkTb == 0) {
          this.setData();
        }
        this.$set(this.tablePagination[remarkTb], "pageTotal", count);
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true
        });
      }
    },
    // 选择数据
    selectFun(data, remarkTb, row) {
      this.selectionData[remarkTb] = data;
    },
    // 改变状态
    changeStatus(item, index) {
      this.labelStatus1 = index;
      this.formSearchs[0].datas["ProductionStatus"] = item.value;
      this.formSearchs[0].datas[
        "ProductionAccounts"
      ] = this.$store.getters.userInfo.Account; //登录账号
      if (index === 0) {
        this.formSearchs[0].datas["ProductionAccounts"] = null;
      } else {
        this.formSearchs[0].datas[
          "ProductionAccounts"
        ] = this.$store.getters.userInfo.Account; //登录账号
      }
      this.dataSearch(0);
    },
    // 保存
    async dataSave() {
      let sheet = this.spread.getActiveSheet();
      let newData = sheet.getDirtyRows();
      let submitData = [];
      if (newData.length != 0) {
        newData.forEach(x => {
          submitData.push(x.item);
        });
      }
      if (submitData.length == 0) {
        this.$message.error("没修改过任何数据！");
        return;
      }
      this.adminLoading = true;
      let res = await SaveData(submitData);

      const { result, data, count, msg } = res.data;

      if (result) {
        this.dataSearch(0);
        this.$message({
          message: msg,
          type: "success",
          dangerouslyUseHTMLString: true
        });
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true
        });
      }
      this.adminLoading = false;
    },
    // 转入主计划
    async releaseOrders() {
      let sheet = this.spread.getActiveSheet();
      let newData = sheet.getDataSource();
      this.selectionData[this.tagRemark] = [];
      if (newData && newData.length != 0) {
        newData.forEach(x => {
          if (x.isChecked) {
            x["dicID"] = 9053; //下达到主计划表
            x["ProductionStatus"] = 21;
            this.selectionData[this.tagRemark].push(x);
          }
        });
      }
      if (this.selectionData[this.tagRemark].length == 0) {
        this.$message.error("请选择需要转入的数据！");
        return;
      }
      this.adminLoading = true;
      let res = await SaveData(this.selectionData[this.tagRemark]);
      const { result, data, count, msg } = res.data;
      try {
        if (result) {
          this.adminLoading = false;
          this.$message({
            message: msg,
            type: "success",
            dangerouslyUseHTMLString: true
          });
          this.dataSearch(this.tagRemark);
        } else {
          this.adminLoading = false;
          this.$message({
            message: msg,
            type: "error",
            dangerouslyUseHTMLString: true
          });
        }
      } catch (error) {
        if (error) {
          this.adminLoading = false;
        }
      }
    }
  }
};
</script>
