<!-- 配件订单列表 -->
<template>
  <div
    class="container flex_column content_height bgWhite"
    v-loading="adminLoading"
  >
    <div class="admin_head" ref="headRef">
      <div v-for="i in [0]" :key="i" v-show="labelStatus1 === i">
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
    <div class="ant-table-title pd-0-6">
      <el-row>
        <el-col :span="8"
          ><span class="title">{{ title }}</span>
        </el-col>
      </el-row>
    </div>
    <div class="admin_content flex_grow">
      <div
        class="flex_column"
        style="height: 100%"
        v-for="item in [0]"
        :key="item"
        v-show="labelStatus1 === item"
      >
        <ComSpreadTable
          ref="spreadsheetRef"
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
          @selectChanged="selectChanged"
        />
      </div>
    </div>
    <!-- 弹框-->
    <el-dialog
      :title="'计划调整'"
      :visible.sync="colDialogVisible1"
      width="50%"
      :modal-append-to-body="false"
    >
      <div class="custom-dialog" :style="dialogStyle">
        <div class="ant-table-title pd-0-6">
          您选择的配件任务单即将生成，请选择这批配件单的出货方式。
        </div>
        <div class="ant-table-title pd-0-6">
          <el-row>
            <el-radio v-model="radio" label="1">跟单出</el-radio>
            <el-radio v-model="radio" label="2">单独出</el-radio>
          </el-row>
        </div>
        <div
          v-for="item in [1]"
          :key="item"
          class="admin_content flex_grow"
          :class="{ hidden: radio !== '1' }"
        >
          <ComVxeTable
            :ref="`tableRef${item}`"
            :rowKey="'RowNumber'"
            height="100%"
            :isToolbar="false"
            :isEdit="isEdit[item]"
            :tableData="tableData[item]"
            :tableHeader="tableColumns[item]"
            :tableLoading="tableLoading[item]"
            :remark="item"
            :sysID="sysID[item]['ID']"
            :isClear="isClear[item]"
            :hasSelect="hasSelect[item]"
            :pagination="tablePagination[item]"
            @pageChange="pageChange"
            @handleRowClick="handleRowClick"
            @pageSize="pageSize"
            @sortChange="sortChange"
            @selectfun="selectFun"
            :keepSource="true"
            :footerContent="true"
          />
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="colDialogVisible1 = false">取 消</el-button>
        <el-button
          type="primary"
          @click="confirmDialog(1)"
          :loading="isConfirmLoading"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 弹框-->
    <!-- <DialogOptTable
      title="指定业务员"
      :tableDialog="colDialogVisible2"
      :sysID="sysID[2]['ID']"
      :isEdit="isEdit[2]"
      :remark="2"
      :Region="Region[2]"
      width="50%"
      :hasSelect="hasSelect[2]"
      @closeDialog="colDialogVisible2 = false"
      @btnClickCall="btnClick"
      :searchForm="formSearchs[2]"
      :btnForm="btnForm"
      :isToolbar="false"
      :isConfirmBtn="true"
      :table-data="tableData[2]"
      :table-header="tableColumns[2]"
      :table-loading="tableLoading[2]"
      :table-pagination="tablePagination[2]"
      :isClear="isClear[2]"
      @confirmDialog="confirmDialog"
      @pageChangeCall="pageChange"
      @pageSizeCall="pageSize"
      @sortChangeCall="sortChange"
      @selectFunCall="selectFun"
    ></DialogOptTable> -->
  </div>
</template>

<script>
var _this;
const GCsheets = GC.Spread.Sheets;
import "@grapecity/spread-sheets-vue";
import GC from "@grapecity/spread-sheets";
import "@grapecity/spread-sheets/styles/gc.spread.sheets.excel2013white.css";
import "@grapecity/spread-sheets/js/zh.js";
import { mapState } from "vuex";
GC.Spread.Common.CultureManager.culture("zh-cn");
import ComSearch from "@/components/ComSearch";
import ComSpreadTable from "@/components/ComSpreadTable";
import ComVxeTable from "@/components/ComVxeTable";
import { HeaderCheckBoxCellType } from "@/static/data.js";
import {
  GetHeader,
  GetSearchData,
  ExportData,
  SaveData,
  GetSearch,
} from "@/api/Common";
// import DialogTable from "@/components/Dialog/dialogTable";
// import DialogOptTable from "@/components/Dialog/dialogOptTable";
export default {
  name: "EKAccessoriesOrderList",
  components: {
    ComSearch,
    ComVxeTable,
    ComSpreadTable,
  },
  data() {
    return {
      labelStatus1: 0,
      oldval: null,
      spread: [[], []],
      dialogSearchForm: {
        OrderID: "",
      },
      ////////////////// Search /////////////////
      title: this.$route.meta.title,
      title2: null,
      drawer: false,
      delData: [[]],
      radio: "1",
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
      ],
      btnForm: [],
      tableData: [[], [], []],
      tableColumns: [[], [], []],
      tableLoading: [false, false, false],
      isClear: [false, false, false],
      hasSelect: [false, false, false],
      tablePagination: [
        { pageIndex: 1, pageSize: 3000, pageTotal: 0 },
        { pageIndex: 1, pageSize: 3000, pageTotal: 0 },
        { pageIndex: 1, pageSize: 3000, pageTotal: 0 },
      ],
      height: "707px",
      treeHeight: "765px",
      showPagination: true,
      tagRemark: 0,
      isLoading: false,
      sysID: [{ ID: 11181 }, { ID: 10117 }],
      adminLoading: false,
      checkBoxCellTypeLine: "",
      isOpen: true,
      selectionData: [[], []],
      NoWorkHour: [],
      LineViewSort: [],
      sheetSelectRows: [],
      sheetSelectObj: { start: 0, end: 0, count: 0 },
      isEdit: [false, false, false],
      colDialogVisible1: false,
      colDialogVisible2: false,
      isConfirmLoading: false,
      Region: [6, 6, 6],
    };
  },
  watch: {},
  created() {
    _this = this;
    this.adminLoading = true;
    // 获取所有按钮
    this.btnForm = this.$route.meta.btns;
    this.judgeBtn(this.btnForm);
    this.getTableHeader();
  },
  // activated() {
  //   if (this.spread) {
  //     this.spread.refresh();
  //   }
  // },
  computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo,
    }),
    dialogStyle() {
      // 根据条件设置弹窗高度
      return {
        height: this.radio === "1" ? "70vh" : "auto",
      };
    },
  },
  mounted() {
    this.keyDown();
  },
  methods: {
    //按钮权限
    judgeBtn(routeBtn) {
      console.log(routeBtn, "routeBtn");
      if (routeBtn && routeBtn.length > 0)
        routeBtn.some((item, index) => {
          if (item.ButtonCode == "save") {
            //假如signName为空，则所有表都显示保存按钮而且全部可编辑，假如不为空，则控制哪个表才可以编辑
            if (!item["signName"] || item["signName"].length === 0) {
              this.isEdit.fill(true);
            } else if (item["signName"] && item["signName"].length > 0) {
              item["signName"].map((item) => {
                this.$set(this.isEdit, item, true);
              });
            }
          }
        });
      this.$set(this, "btnForm", routeBtn);
    },
    // 监听键盘
    keyDown() {
      document.onkeydown = (e) => {
        //事件对象兼容
        let e1 =
          e || event || window.event || arguments.callee.caller.arguments[0];

        if (e.ctrlKey && e.keyCode == 83) {
          e.preventDefault();
          e.returnValue = false;

          this.dataSave(this.labelStatus1);
          return false;
        }
      };
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
    // 高度控制
    setHeight() {
      this.treeHeight = document.documentElement.clientHeight - 150 + "px";
      let headHeight = this.$refs.headRef.offsetHeight;
      let newHeight = "";
      let rem =
        document.documentElement.clientHeight -
        headHeight -
        this.$store.getters.reduceHeight;
      if (this.$store.getters.reduceHeight == 138) {
        newHeight = rem + "px";
      } else {
        newHeight = rem + "px";
      }
      this.$set(this, "height", newHeight);
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
        if (name != "dicID") {
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
      form["rows"] = 0;
      let res = await ExportData(form);
      this.adminLoading = false;
      this.$store.dispatch("user/exportData", res.data);
    },
    // 获取选中的数据
    getSelectionData() {
      let sheet = this.spread.getActiveSheet();
      let newData = sheet.getDataSource();
      this.selectionData[0] = [];
      if (newData.length != 0) {
        newData.forEach((x) => {
          if (x.isChecked) {
            this.selectionData[0].push(x);
          }
        });
      }
    },
    // 删除
    async dataDel(remarkTb, index, parms) {
      let res = null;
      let newData = [];
      if (this.selectionData[remarkTb].length == 0) {
        this.$message.error("请单击需要操作的数据！");
        return;
      } else {
        if (remarkTb === 0) {
          newData = _.cloneDeep(
            this.selectionData[remarkTb]
              .filter((x) => x["DataSource"] !== "业务") // 过滤条件，不包括 "DataSource" 为 "业务" 的对象
              .map((x) => {
                x["ElementDeleteFlag"] = 1;
                return x;
              })
          );

          if (newData.length === 0) {
            this.$message.error("无数据可以删除或无法删除该数据");
            return;
          }
        } else {
          newData = _.cloneDeep(
            this.selectionData[remarkTb].map((x) => {
              x["ElementDeleteFlag"] = 1;
              return x;
            })
          );
        }
      }
      this.$confirm("确定要删除的【" + newData.length + "】数据吗？")
        .then((_) => {
          _this.dataSave(remarkTb, index, null, newData);
        })
        .catch((_) => {});
    },
    resetScheduling() {
      this.$confirm("确定要重新排全部数据吗？")
        .then(async (_) => {
          this.adminLoading = true;

          let sheet = this.spread[this.labelStatus1].getActiveSheet();
          let submitData = sheet.getDataSource();
          submitData.forEach((m) => {
            m["isChecked"] = true;
          });
          if (submitData.length >= 0) {
            this.adminLoading = true;
            let res = await GetSearch(
              submitData,
              "/APSAPI/MOPlanSaveToDayPlan?isPlan=1"
            );
            const { result, data, count, msg } = res.data;
            if (result) {
              this.dataSearch(0);
              this.adminLoading = false;
              this.$message({
                message: msg,
                type: "success",
                dangerouslyUseHTMLString: true,
              });
            } else {
              this.adminLoading = false;
              this.$message({
                message: msg,
                type: "error",
                dangerouslyUseHTMLString: true,
              });
            }
          } else {
            this.$message({
              message: "未有数据",
              type: "error",
              dangerouslyUseHTMLString: true,
            });
          }
        })
        .catch((_) => {});
    },
    // 单击行
    handleRowClick(row, remarkTb) {
      this.delData[remarkTb] = [];
      this.delData[remarkTb].push(row);
    },
    // 保存
    async dataSave(remarkTb, index, parms, newData) {
      // this.adminLoading = true;
      const sheet = this.spread[remarkTb]?.getActiveSheet();

      const $table = this.$refs[`tableRef${remarkTb}`]?.[0].$refs.vxeTable;
      if (sheet.isEditing()) {
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
            item["ElementDeleteFlag"] = 1;
          }); //获取被删除的数据
          console.log(DirtyRows, InsertRows, DeletedRows);
          changeRecords = [...DirtyRows, ...InsertRows, ...DeletedRows];
        }
      }
      if (changeRecords.length == 0) {
        this.$set(this, "adminLoading", false);
        this.$message.error("当前数据没做修改，请先修改再保存！");
        return;
      }
      let res = await SaveData(changeRecords);
      const { datas, forms, result, msg } = res.data;
      if (result) {
        this.$message({
          message: msg,
          type: "success",
          dangerouslyUseHTMLString: true,
        });
        this.dataSearch(remarkTb);
        this.$set(this, "adminLoading", false);
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
        this.$set(this, "adminLoading", false);
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
          // m.forEach((n) => {
          //   // 进行验证
          //   this.verifyData(n);
          //   if (n.children && n.children.length != 0) {
          //     n.children.forEach((x) => {
          //       this.verifyData(x);
          //     });
          //   }
          // });
          m.some((n, index) => {
            if (index === 1) {
              this.tablePagination[i]["pageSize"] = n["pageSize"];
              this.hasSelect[i] = n["IsSelect"];
              this.Region[i] = n["Region"] ? n["Region"] : this.Region[i];
            }
          });
          this.$set(this.tableColumns, i, m);
        });
        // 获取查询的初始化字段 组件 按钮
        forms.some((x, z) => {
          this.$set(this.formSearchs[z].datas, "dicID", IDs[z].ID);
          x.forEach((y) => {
            if (y.prop && y.value) {
              this.$set(this.formSearchs[z].datas, [y.prop], y.value);
            } else {
              this.$set(this.formSearchs[z].datas, [y.prop], "");
            }
          });
          this.$set(this.formSearchs[z], "forms", x);
        });

        await this.dataSearch(0);
      }
    },
    // 验证数据
    verifyData(n) {
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
      form["dicID"] = this.sysID[remarkTb]["ID"];
      let res = await GetSearchData(form);

      const { result, data, count, msg, Columns } = res.data;
      if (result) {
        // 获取每个表头
        // Columns.some((m, i) => {
        //   this.$set(this.tableColumns, i, m);
        // });

        this.$set(this.tableData, remarkTb, data);
        if (remarkTb === 0) {
          this.setData(remarkTb);
        }
        this.$set(this.tablePagination[remarkTb], "pageTotal", count);
      } else {
        this.$message({
          message: msg,
          type: "error",
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
        x["name"] = x["prop"];
        x["displayName"] = x["label"];
        x["width"] = parseInt(x.width);
        if (x.prop === "isChecked") {
          // 选框
          sheet.setCellType(
            0,
            0,
            new HeaderCheckBoxCellType(),
            GCsheets.SheetArea.colHeader
          );
          x.cellType = new GC.Spread.Sheets.CellTypes.CheckBox();
        } else if (
          x.ControlType === "comboboxMultiple" ||
          x.ControlType === "combobox"
        ) {
          this.tableData[remarkTb].map((item, index) => {
            if (x.DataSourceID && x.DataSourceName) {
              let newData = item[x.DataSourceName]; // 设置列表每行下拉菜单
              // 获取要绑定下拉菜单的单元格对象
              let cell = sheet.getCell(index, y);
              // 创建下拉菜单单元格类型，并设置其选项数据
              let comboBox = new GC.Spread.Sheets.CellTypes.ComboBox();
              comboBox.editorValueType(
                GC.Spread.Sheets.CellTypes.EditorValueType.value
              );
              comboBox.editable(true);
              // 获取下拉菜单的选项数据
              comboBox.items(newData);
              comboBox.itemHeight(24);
              // 将下拉菜单单元格类型绑定到指定的单元格中
              cell.cellType(comboBox);
            }
          });
        } else if (x.ControlType === "checkbox") {
          let cellType = new GC.Spread.Sheets.CellTypes.CheckBox();
          cellType.caption("");
          cellType.textTrue("");
          cellType.textFalse("");
          cellType.textIndeterminate("");
          cellType.textAlign(
            GC.Spread.Sheets.CellTypes.CheckBoxTextAlign.center
          );
          cellType.isThreeState(false);
          sheet.getCell(-1, y).cellType(cellType);
        } else if (
          x.DataType == "datetime" ||
          x.DataType === "varchar" ||
          x.DataType === "nvarchar"
        ) {
          x.formatter = "@";
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

      var defaultStyle = new GC.Spread.Sheets.Style();
      defaultStyle.font =
        "12px basefontRegular, Roboto, Helvetica, Arial, sans-serif";
      defaultStyle.hAlign = GC.Spread.Sheets.HorizontalAlign.left;
      defaultStyle.vAlign = GC.Spread.Sheets.HorizontalAlign.center;
      defaultStyle.borderLeft = new GC.Spread.Sheets.LineBorder(
        "gray",
        GC.Spread.Sheets.LineStyle.thin
      );
      defaultStyle.borderTop = new GC.Spread.Sheets.LineBorder(
        "gray",
        GC.Spread.Sheets.LineStyle.thin
      );
      defaultStyle.borderRight = new GC.Spread.Sheets.LineBorder(
        "gray",
        GC.Spread.Sheets.LineStyle.thin
      );
      defaultStyle.borderBottom = new GC.Spread.Sheets.LineBorder(
        "gray",
        GC.Spread.Sheets.LineStyle.thin
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
        this.tableColumns[remarkTb].length
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
          cell.foreColor("black");
          cell.backColor("white");
          if (columnItem["isEdit"]) {
            cell.locked(false).foreColor("#2a06ecd9");
          }
          if (
            rowItem["PlanQty"] &&
            rowItem["Qty"] &&
            columnItem["prop"] === "CurPlanQty" &&
            rowItem["PlanQty"] === rowItem["Qty"]
          ) {
            cell.locked(true).foreColor("black");
          }
          if (
            Object.prototype.toString.call(rowItem["FColors"]) ===
            "[object Object]"
          ) {
            Object.keys(rowItem["FColors"]).forEach((key) => {
              const columnIndex = this.tableColumns[0].findIndex(
                (columnItem) => columnItem.prop === key
              );
              if (columnIndex !== -1) {
                // 这里使用 rowIndex 和 columnIndex 获取单元格
                const cell = sheet.getCell(rowIndex, columnIndex);
                cell.foreColor(rowItem["FColors"][key]);
              }
            });
          }
          if (
            Object.prototype.toString.call(rowItem["BColors"]) ===
            "[object Object]"
          ) {
            Object.keys(rowItem["BColors"]).forEach((key) => {
              const columnIndex = this.tableColumns[0].findIndex(
                (columnItem) => columnItem.prop === key
              );
              if (columnIndex !== -1) {
                // 这里使用 rowIndex 和 columnIndex 获取单元格
                const cell = sheet.getCell(rowIndex, columnIndex);
                cell.backColor(rowItem["BColors"][key]);
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
        if (m.prop == "ViewSort") {
          viewSortIndex = cellIndex;
        }
        if (m.prop == "LineID") {
          lineIDIndex = cellIndex;
        }
        //行，start,end
        if (m.isEdit) {
          sheet.getRange(-1, cellIndex, 1, 1).locked(false);
          var cell = sheet.getCell(
            -1,
            cellIndex,
            GC.Spread.Sheets.SheetArea.viewport
          );
          //cell.foreColor("#2a06ecd9");
        } else {
          var cell = sheet.getCell(
            -1,
            cellIndex,
            GC.Spread.Sheets.SheetArea.viewport
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
        name: "insertRowsCopyStyle",
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
                GC.Spread.Sheets.CopyToOptions.all
              );

              //   sheet.setArray(options.activeRow, 0, _this.sheetSelectRows);
              sheet.deleteRows(
                _this.sheetSelectObj.start + _this.sheetSelectRows.length,
                _this.sheetSelectObj.count
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
                GC.Spread.Sheets.CopyToOptions.all
              );
              //  sheet.setArray(options.activeRow, 0, _this.sheetSelectRows);
              sheet.deleteRows(
                _this.sheetSelectObj.start,
                _this.sheetSelectObj.count
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
        .register("insertRowsCopyStyle", insertRowsCopyStyle);

      function MyContextMenu() {}
      MyContextMenu.prototype = new GC.Spread.Sheets.ContextMenu.ContextMenu(
        this.spread[remarkTb]
      );
      MyContextMenu.prototype.onOpenMenu = function (
        menuData,
        itemsDataForShown,
        hitInfo,
        spread
      ) {
        itemsDataForShown.forEach(function (item, index) {
          // console.log(item);
          if (item && item.name === "gc.spread.rowHeaderinsertCutCells") {
            item.command = "insertRowsCopyStyle";
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
            _this.tableColumns[remarkTb].length
          );
          _this.sheetSelectObj.start = s.row;

          _this.sheetSelectObj.count = s.rowCount;
        }
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
        function (e, args) {
          // 自动计算数量
          let currentRow = _this.tableData[remarkTb][args.row];
          let currentProp = _this.tableColumns[remarkTb][args.col]["prop"];
          _this.oldval = parseInt(currentRow[currentProp]);
        }
      );
      this.spread[remarkTb].bind(GCsheets.Events.EditEnded, function (e, args) {
        // 自动计算数量
        _this.computedNum(args.row, args.col, args.editingText, _this.oldval);
      });
      // 表格单击齐套率弹框事件
      this.spread[remarkTb].bind(GCsheets.Events.CellClick, function (e, args) {
        if (_this.tableColumns[remarkTb].length) {
          _this.tableColumns[remarkTb].map((item, index) => {
            if (item["prop"].indexOf("FormRate") !== -1 && args.col === index) {
              console.log("OrderID", _this.tableData[remarkTb]);
              // 显示ERP供需平衡表
              _this.colDialogVisible = true;
              _this.dialogSearchForm.OrderID =
                _this.tableData[remarkTb][args.row].OrderID;
              _this.dialogSearchForm.OweQty = 0;
              if (item["prop"] === "FormRate") {
                _this.dialogSearchForm.DemandDate =
                  _this.tableData[remarkTb][args.row]["D0"];
              } else if (item["prop"] === "FormRate1") {
                _this.dialogSearchForm.DemandDate =
                  _this.tableData[remarkTb][args.row]["D1"];
              } else if (item["prop"] === "FormRate2") {
                _this.dialogSearchForm.DemandDate =
                  _this.tableData[remarkTb][args.row]["D2"];
              }
            }
          });
        }
      });
      //脏数据清除
      sheet.bind(GC.Spread.Sheets.Events.RowChanged, function (e, info) {
        console.log(
          info.row +
            "," +
            info.col +
            "," +
            "由" +
            info.oldValue +
            "改变为" +
            info.newValue
        );
      });
      this.spread[remarkTb].resumePaint();
      this.adminLoading = false;
      this.tableLoading[remarkTb] = false;
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
        GC.Spread.Sheets.CellTypes.EditorValueType.value
      );
      comboBox.editable(true);
      // 获取下拉菜单的选项数据

      comboBox.items(dataSourceName);
      comboBox.itemHeight(24);

      // 将下拉菜单单元格类型绑定到指定的单元格中
      cell.cellType(comboBox);
    },
    // 自动计算数量
    computedNum(rowIndex, colIndex, val, oldval) {
      let sheet = this.spread[0].getActiveSheet();
      if (this.tableColumns[0][colIndex]["prop"] == "CurPlanQty") {
        let currentRow = sheet.getDataItem(rowIndex);
        let currentProp = this.tableColumns[0][colIndex].prop;
        if (!Number.isFinite(Number(val)) || Number.isFinite(Number(val)) < 0) {
          sheet.setValue(rowIndex, colIndex, oldval);
          this.$message.error("输入的值是负数或者不是数字类型");
          return;
        }
        oldval = oldval ? oldval : 0; //旧数据如果不存在把null变成0
        if (Number(val) > Number(currentRow["RemainQty"])) {
          sheet.setValue(rowIndex, colIndex, oldval);
          this.$message.error("已超出剩余可用数量");
          return;
        }
      }
    },
    // 刷新页面
    refrshPage() {
      this.$store.dispatch("tagsView/delCachedView", this.$route).then(() => {
        const { fullPath } = this.$route;
        this.$nextTick(() => {
          this.$router.replace({
            path: "/redirect" + fullPath,
          });
        });
      });
    },
    changeStatus(item, index) {
      this.labelStatus1 = index;
    },
    // 选择数据
    selectFun(data, remarkTb, row) {
      this.selectionData[remarkTb] = data;
    },
    //指定人员
    async DesignatedPerson(remarkTb) {
      if (this.selectionData[remarkTb].length == 0) {
        this.$message.error("请选择需要操作的数据！");
        return;
      }
      this.colDialogVisible2 = true;
      this.dataSearch(2);
    },
    //添加产品机台
    async confirmDialog(remarkTb) {
      if (remarkTb === 1) {
        let newData;
        if (this.radio == "1") {
          if (this.selectionData[remarkTb].length !== 1) {
            this.$message.error("请选择单条数据进行计划调整");
            return;
          }
          newData = _.cloneDeep(
            this.selectionData[0].map((item) => {
              item["SourceID"] = this.selectionData[1][0]["ID"];
              item["PlanQty"] = item["CurPlanQty"];
              item["dicID"] = 11184;
              item["OutType"] = "跟单出";
              return item;
            })
          );
        } else {
          newData = _.cloneDeep(
            this.selectionData[0].map((item) => {
              item["PlanQty"] = item["CurPlanQty"];
              item["dicID"] = 11184;
              item["OutType"] = "单独出";
              return item;
            })
          );
        }
        this.isConfirmLoading = true;

        await this.dataSave(0, null, null, newData);
        this.isConfirmLoading = false;
        this.colDialogVisible1 = false;
      }
    },
    //提交
    async SubmitEvent(remarkTb) {
      if (this.selectionData[0].length === 0) {
        this.$message.error("请选择需要操作的数据！");
        return;
      }
      const sheet = this.spread[0]?.getActiveSheet();
      if (sheet && sheet.isEditing()) {
        sheet.endEdit();
      }
      let errorNum = -1;
      errorNum = this.selectionData[0].findIndex((item0) => {
        return (
          Number(item0["OutStockQty"]) === Number(item0["Qty"]) ||
          !item0["CurPlanQty"]
        );
      });

      if (errorNum !== -1) {
        this.$message.error(`第${errorNum + 1}行数据不满足提交条件`);
        return;
      }
      this.colDialogVisible1 = true;

      await this.dataSearch(1);
    },
  },
};
</script>
<style lang="scss" scoped>
.spreadContainer {
  position: relative;
  overflow: hidden;
  height: 100%;
  flex: 1;
  border: 1px solid #ababab;
}

.sample-spreadsheets {
  width: 100%;
  height: 100%;
}

.custom-dialog {
  overflow: auto;
  display: flex;
  flex-direction: column;
}
.hidden {
  display: none;
}
</style>
