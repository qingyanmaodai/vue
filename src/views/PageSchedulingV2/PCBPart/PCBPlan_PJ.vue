<!--备料任务指派-->
<template>
  <div class="container" v-loading="adminLoading">
    <div class="admin_head" ref="headRef">
      <!-- <div
        v-for="(item,i) in 5"
        :key="i"
        v-show="labelStatus1 == i"
      > -->
      <div>
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
    </div>
    <div>
      <div class="admin_content">
        <div class="ant-table-title">
          <el-row>
            <el-col :span="4"
              ><span class="title">{{ title }}</span></el-col
            >
            <el-col :span="20" class="flex_flex_end">
              <div v-show="labelStatus1 == 0">
                <el-date-picker
                  type="date"
                  size="small"
                  placeholder="选择开工日期"
                  v-model="StartDate"
                  value-format="yyyy-MM-dd"
                >
                </el-date-picker>
                <el-divider direction="vertical"></el-divider>
                <el-button type="primary" size="mini" @click="moreDate"
                  >批量填写日期</el-button
                >
                <el-divider direction="vertical"></el-divider>
              </div>
              <!-- <div v-show="labelStatus1 == 1">
                <span>选择机台/班组：</span>
                <el-select
                  clearable
                  filterable
                  size="mini"
                  v-model="ruleForm.LineIDs"
                  @change="setFooterLabel"
                  style="width:320px"
                >
                  <el-option
                    v-for="(item,i) in lines"
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
              </div> -->
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
        <div v-for="(item, i) in 5" :key="i" v-show="labelStatus1 == i"></div>
        <div class="flex_column" :style="{ height: height }">
          <div class="spreadContainer" v-loading="tableLoading[0]">
            <gc-spread-sheets
              class="sample-spreadsheets"
              @workbookInitialized="initSpread"
            >
              <gc-worksheet></gc-worksheet>
            </gc-spread-sheets>
          </div>
        </div>
        <div class="flex_row_spaceBtn pagination">
          <div>
            <span
              @click="toPageSetting(sysID[0].ID)"
              class="primaryColor cursor"
              >SysID:{{ sysID[0].ID }}
            </span>
          </div>
          <div class="flex">
            <el-pagination
              background
              @size-change="(val) => pageSize(val, 0)"
              :current-page="tablePagination[0].pageIndex"
              :page-sizes="[200, 500, 1000, 3000, 5000, 10000]"
              :page-size="tablePagination[0].pageSize"
              :total="tablePagination[0].pageTotal"
              @current-change="(val) => pageChange(val, 0)"
              layout="total, sizes, prev, pager, next,jumper"
            >
            </el-pagination>
          </div>
        </div>
      </div>
    </div>

    <el-dialog
      title="新增配件排程"
      :visible.sync="dialogPlan"
      width="80%"
      :close-on-click-modal="false"
    >
      <div>
        <ComSearch
          class="margin_bottom_10 dialog_search"
          ref="searchRef"
          :searchData="formSearchs[5].datas"
          :searchForm="formSearchs[5].forms"
          :remark="5"
          :isLoading="isLoading[5]"
          :btnForm="btnForm[5]"
          @btnClick="btnClick"
        />
        <ComVxeTable
          :rowKey="'RowNumber'"
          :height="'600px'"
          :tableData="tableData[5]"
          :tableHeader="tableColumns[5]"
          :tableLoading="tableLoading[5]"
          :remark="5"
          :hasSelect="hasSelect[5]"
          :sysID="sysID[5].ID"
          ref="plxTableFive"
          :isEdit="false"
          :isClear="isClear[5]"
          :pagination="tablePagination[5]"
          @pageChange="pageChange"
          @pageSize="pageSize"
          @sortChange="sortChange"
          @selectfun="selectFun"
        />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogPlan = false" size="small">取 消</el-button>
        <el-button type="primary" @click="sureAddNewData" size="small"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
var _this;
const GCsheets = GC.Spread.Sheets;
import "@grapecity/spread-sheets-vue";
import GC from "@grapecity/spread-sheets";
import "@grapecity/spread-sheets/styles/gc.spread.sheets.excel2013white.css";
import "@grapecity/spread-sheets/js/zh.js";
import ComSearch from "@/components/ComSearch";
import ComVxeTable from "@/components/ComVxeTable";
import  "@/styles/excel.scss";
import {
  HighlightColumnItemsCellType,
  TopItemsCellType,
  HeaderCheckBoxCellType,
  SortHyperlinkCellType,
  HighlightRowItemsCellType,
} from "@/static/data.js";
import {
  GetHeader,
  GetSearchData,
  ExportData,
  SaveData,
  GetSearch,
} from "@/api/Common";
export default {
  name: "PCBPlan_PJ",
  components: {
    ComSearch,
    ComVxeTable,
  },
  data() {
    return {
      ////////////////// Search /////////////////
      StartDate: "",
      dialogPlan: false,
      footerLabel: ["", "", "", "", ""],
      hasSelect: [true, true, false, false, false, true],
      sysID: [
        { ID: 5150 },
        { ID: 5150 },
        { ID: 5150 },
        { ID: 5150 },
        { ID: 5150 },
        { ID: 49 },
      ],
      Status1: [
        { label: "总排期", value: 0 },
        { label: "已完成待出货", value: 1 },
        { label: "已出货", value: 2 },
      ],
      title: "",
      labelStatus1: 0,
      PrepareDate: "",
      adminLoading: false,
      checkdBtnCodes: [],
      drawer: false,
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
      parmsBtn: [
        {
          ButtonCode: "save",
          BtnName: "添加排程",
          Type: "warning",
          Ghost: true,
          Size: "small",
          signName: 0,
          Methods: "addPlan",
          Icon: "",
        },
        {
          ButtonCode: "save",
          BtnName: "转入日计划",
          Type: "primary",
          Ghost: true,
          Size: "small",
          signName: 0,
          Methods: "setPlan",
          Params: { ProcessID: "" },
          Icon: "",
        },
        {
          ButtonCode: "save",
          BtnName: "保存",
          Type: "success",
          Ghost: true,
          Size: "small",
          signName: 0,
          Methods: "save",
          Icon: "",
        },
        {
          ButtonCode: "save",
          BtnName: "退回",
          isLoading: false,
          Methods: "dataDel",
          Type: "danger",
          Icon: "",
          Size: "small",
          Params: {
            dataName: "selectionData",
          },
        },
      ],
      tableData: [[], [], [], [], [], []],
      delData: [[], [], [], [], [], []],
      tableColumns: [[], [], [], [], []],
      tableLoading: [false, false, false, false, false, false],
      isClear: [false, false, false, false, false, false],
      tablePagination: [
        { pageIndex: 1, pageSize: 10000, pageTotal: 0 },
        { pageIndex: 1, pageSize: 100, pageTotal: 0 },
        { pageIndex: 1, pageSize: 100, pageTotal: 0 },
        { pageIndex: 1, pageSize: 100, pageTotal: 0 },
        { pageIndex: 1, pageSize: 100, pageTotal: 0 },
        { pageIndex: 1, pageSize: 100, pageTotal: 0 },
      ],
      height: "707px",
      showPagination: true,
      tagRemark: 0,
      isLoading: false,
      initialBtnData: [],
      tagRremark: 1,
      selectionData: [[], [], [], [], [], []],
      isEdit: false,
      losePrepareDate: 1,
      losePrepareDate2: 1,
      ruleForm: {
        LineIDs: [],
        ProducedDate: "",
      },
      lines: [],
    };
  },
  watch: {},
  created() {
    _this = this;
    this.adminLoading = true;
    this.getLine();
    this.getTableHeader();
    // 获取所有按钮
    this.judgeBtn();
  },
    activated() {
    this.spread.refresh();
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
          ID: id,
        },
      });
    },
    // 删除
    async dataDel(remarkTb, index, parms) {
      let res = null;
      this.getSelectionData();
      let newData = [];

      this.$confirm(
        "确定要退回的【" +
          this[parms.dataName][remarkTb].length +
          "】数据吗，如果已经报工则无法退回？"
      )
        .then((_) => {
          if (parms && parms.dataName) {
            if (this[parms.dataName][remarkTb].length == 0) {
              this.$message.error("请单击需要操作的数据！");
              return;
            } else {
              this[parms.dataName][remarkTb].forEach((x) => {
                let obj = x;
                obj["ElementDeleteFlag"] = 1;
                newData.push(obj);
              });
            }
          } else {
            this.tableData[remarkTb].forEach((y) => {
              let obj2 = y;
              obj2["ElementDeleteFlag"] = 1;
              newData.push(obj2);
            });
          }
          this.adminLoading = true;
          _this.dataSave(newData, remarkTb);
        })
        .catch((_) => {});
    },
    timeOut() {
      if (this.time) {
        clearTimeout(this.time);
      }
      if (this.spread) {
        this.spread.refresh();
      }
      this.time = setTimeout(() => {
        //重新定位宽高度
        this.timeOut();
      }, 2000);
    },
    initSpread: function (spread) {
      this.spread = spread;
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
    // 渲染数据
    setData() {
      this.spread.suspendPaint();
      let sheet = this.spread.getActiveSheet();
      sheet.options.allowCellOverflow = true;
      sheet.defaults.rowHeight = 23;
      sheet.defaults.colWidth = 100;
      sheet.defaults.colHeaderRowHeight = 23;
      sheet.defaults.rowHeaderColWidth = 60;
      let colHeader1 = [];
      let colInfos = [];
      let colIndex = 0

      this.tableColumns[0].forEach((x) => {
        if (x.prop == "LineID") {
          colInfos.push({
            name: x.prop,
            displayName: "线别",
            cellType: this.checkBoxCellTypeLine,
            size: parseInt(x.width),
          });
        } else {
          colInfos.push({
            name: x.prop,
            displayName: x.label,
            size: parseInt(x.width),
          });
        }
        colHeader1.push(x.label);
        colIndex ++
      });
      
      // 列筛选
      // 参数2 开始列
      // 参数3 
      // 参数4 结束列
      var cellrange =new GC.Spread.Sheets.Range(-1, 1, -1, colIndex);
      var hideRowFilter =new GC.Spread.Sheets.Filter.HideRowFilter(cellrange);
      sheet.rowFilter(hideRowFilter);

      sheet.setRowCount(1, GC.Spread.Sheets.SheetArea.colHeader);
      colHeader1.forEach(function (value, index) {
        sheet.setValue(0, index, value, GC.Spread.Sheets.SheetArea.colHeader);
      });
      sheet.setCellType(
        0,
        0,
        new HeaderCheckBoxCellType(),
        GCsheets.SheetArea.colHeader
      );

      // 选框
      let checkbox = {
        name: "isChecked",
        displayName: "isChecked",
        cellType: new GC.Spread.Sheets.CellTypes.CheckBox(),
        size: 60,
      };
      for (var name in checkbox) {
        colInfos[0][name] = checkbox[name];
      }

      //  colInfos.unshift(checkbox);

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
      sheet.setDefaultStyle(defaultStyle, GC.Spread.Sheets.SheetArea.viewport);
      // 冻结第一列

      sheet.frozenColumnCount(this.tableColumns[0][0].FixCount);

      sheet.setDataSource(this.tableData[0]);
      sheet.bindColumns(colInfos);



            this.tableData[0].forEach((row, index) => {
        var rowSheet = sheet.getRange(
          index,
          0,
          1,
          4,
          GC.Spread.Sheets.SheetArea.viewport
        );
         
        if (row["SchedulingStatus"] =='已排产') {
          if(row["ProducedQty"])
          {
            rowSheet.backColor("#6b52f2");
          }
          else{
          rowSheet.backColor("#f2d852");
          }

        }});

      let cellIndex = 0;
      this.tableColumns[0].forEach((m) => {
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

      this.spread.bind(GCsheets.Events.EditStarting, function (e, args) {});
      this.spread.bind(GCsheets.Events.EditEnded, function (e, args) {
        // 自动计算数量
        // for (var i = args.col + 1; i < _this.tableColumns[0].length; i++) {
        //   sheet.setArray(args.row, i, [2021]);
        // }
      });
      this.spread.resumePaint();
      this.adminLoading = false;
      this.tableLoading[0] = false;
    },
    // 判断按钮权限
    judgeBtn() {
      let routeBtn = this.$route.meta.btns;
      let newBtn = [];
      let permission = false;

      if (routeBtn.length != 0) {
        routeBtn.forEach((x) => {
          if (x.ButtonCode == "edit") {
            permission = true;
          }
          let newData = this.parmsBtn.filter((y) => {
            return x.ButtonCode == y.ButtonCode;
          });
          if (newData.length != 0) {
            newBtn = newBtn.concat(newData);
          }
        });
      }
      this.$set(this, "btnForm", newBtn);
      this.$set(this, "isEdit", permission);
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
          if(this.formSearchs[remarkTb].forms.length){
            // 判断是否是页面显示的查询条件，是的字段才清空
            this.formSearchs[remarkTb].forms.forEach((element)=>{
              if(element.prop===name){
                this.formSearchs[remarkTb].datas[name] = null;
              }
            })
          }
        }
      }
    },
    // 行内样式
    cellStyle0({ row, column }) {
      if (column.property == "IsCompleteInspect") {
        if (row.IsCompleteInspect == "未开始") {
          return {
            backgroundColor: "#ff7b7b",
          };
        } else if (row.IsCompleteInspect == "进行中") {
          return {
            backgroundColor: "#fdfd8f",
          };
        } else if (row.IsCompleteInspect == "已完成") {
          return {
            backgroundColor: "#9fff9f",
          };
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
    // 通用直接保存
    async generalSaveData(newData, remarkTb, index) {
      let res = await SaveData(newData);
      const { result, data, count, msg } = res.data;
      if (result) {
        this.dataSearch(remarkTb);
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
            if (n.prop == "MenuCode" || n.prop == "MenuName") {
              this.$set(n, "treeNode", true);
            }
            this.verifyDta(n);
            if (n.childrens && n.children.length != 0) {
              n.childrens.forEach((x) => {
                this.verifyDta(x);
              });
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
        this.formSearchs[5].datas["CompletionDate"] = "null";
        this.formSearchs[5].datas["WorkOrderTypeName"] = "配件";
        this.formSearchs[5].datas["FirstPlanID"] = "0";

        // this.formSearchs[1].datas["sort"] = "PrepareStatus asc";
        this.changeStatus(null, 0);

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
      this.$set(this.tableLoading, remarkTb, false);
      if (result) {
        this.$set(this.tableData, remarkTb, data);
        this.$set(this.tablePagination[remarkTb], "pageTotal", count);
        if (remarkTb == 0) {
          this.setData();
        }
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
    },
    // 选择数据
    selectFun(data, remarkTb, row) {
      this.selectionData[remarkTb] = data;
    },
    // 改变状态
    changeStatus(x, index) {
      this.labelStatus1 = index;
      this.formSearchs[0].datas["SchedulingStatus"] = "";
      this.formSearchs[0].datas["StockStatus"] = "";
      this.formSearchs[0].datas["ProductionStatus"] = "";
      this.formSearchs[0].datas["FirstPlanID"] = "";

      switch (index) {
        case 0: //总排期
          this.formSearchs[0].datas["ProductionStatus"] = [21, 22, 23, 24, 26];
          this.formSearchs[0].datas["FirstPlanID"] = 0;
          break;
        case 1: //已完成待出货
         // this.formSearchs[0].datas["StockStatus"] = "待出货";
          this.formSearchs[0].datas["ProductionStatus"] = 25;
          break;
        case 2:
          this.formSearchs[0].datas["StockStatus"] = "已出货";
          break;
      }
      this.dataSearch(0);
    },
    // 控制选框是否能手动勾选
    checCheckboxkMethod({ row }) {},
    // 批量填写开工日期
    moreDate() {
      if (!this.StartDate) {
        this.$message.error("请选择开工日期！");
      } else if (this.selectionData[0].length == 0) {
        this.$message.error("请选择需要批量填写日期的数据！");
      } else {
        this.selectionData[0].forEach((a) => {
          a.StartDate = this.StartDate;
        });
      }
    },
    // 添加排程
    addPlan(remarkTb) {
      this.dialogPlan = true;
      this.dataSearch(5);
    },
    // 确定添加
    async sureAddNewData() {
      if (this.selectionData[5].length == 0) {
        this.$message.error("请选择需要添加的排程！");
      } else {
        // let newData = this.selectionData[5].concat(this.tableData[0]);
        let saveData = [];
        this.selectionData[5].forEach((m) => {
          let obj = {
            dicID: 5149,
            OrderID: m.OrderID,
            MaterialID: m.MaterialID,
            HasQty: 0,
            AwaitQty: m.Qty,
            PlanQty: m.Qty,
            ProductionStatus: 26,
            Status: 0,
          };
          saveData.push(obj);
        });
        let res = await GetSearch(saveData, "/APSAPI/SaveData");
        const { result, data, count, msg } = res.data;
        this.dialogPlan = false;
        if (result) {
          this.adminLoading = false;
          this.dataSearch(0);
        } else {
          this.adminLoading = false;
          this.$message({
            message: msg,
            type: "error",
            dangerouslyUseHTMLString: true,
          });
        }

        this.dialogPlan = false;
      }
    },
    backData() {
      this.getSelectionData();
      if (this.selectionData[0].length == 0) {
        this.$message.error("请选择需要操作的数据！");
      } else {
        this.adminLoading = true;
        this.selectionData[0].forEach((a) => {
          a["ElementDeleteFlag"] = 1;
        });
        this.dataSave(this.selectionData[0], 0);
      }
    },
    async dataSave(newData, remarkTb) {
      this.adminLoading = true;
      let res = await GetSearch(newData, "/APSAPI/SaveData");
      const { result, data, count, msg } = res.data;
      this.adminLoading = false;
      if (result) {
        this.dataSearch(remarkTb);
        this.$message({
          message: msg,
          type: "success",
          dangerouslyUseHTMLString: true,
        });
        this.adminLoading = false;
      } else {
        this.adminLoading = false;
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
    },
    // 保存
    async save(remarkTb, index) {
      let sheet = this.spread.getActiveSheet();
      let newData = sheet.getDirtyRows();
      let submitData = [];
      if (newData.length != 0) {
        newData.forEach((x) => {
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
          dangerouslyUseHTMLString: true,
        });
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
      this.adminLoading = false;
    },
    // 转入日计划
    async setPlan(remarkTb, index, ProcessID) {
      if (this.ruleForm.LineIDs.length == 0 && false) {
        this.$message.error("请选择生产线再转入日计划！");
      } else {
        this.getSelectionData();
        let newData = [];
        if (this.selectionData[remarkTb].length == 0) {
          this.$message.error("请选择需要转入日计划的数据！");
        } else {
          this.adminLoading = true;
          this.selectionData[remarkTb].forEach((d) => {
            d["LineID"] = this.ruleForm.LineIDs;
            // d["ProducedDate"] = this.ruleForm.ProducedDate;
            //d["ProcessID"] = ProcessID.ProcessID;
          });
          let res = await GetSearch(
            this.selectionData[remarkTb],
            "/APSAPI/MOPlanSaveToDayPlanV2?isPlan=1"
          );
          const { result, data, count, msg } = res.data;
          if (result) {
            this.adminLoading = false;
            this.dataSearch(0);
          } else {
            this.adminLoading = false;
            this.$message({
              message: msg,
              type: "error",
              dangerouslyUseHTMLString: true,
            });
          }
        }
      }
    },
    // 选线获取剩余工时
    setFooterLabel(val) {
      let LineIDs = this.lines.filter((a) =>
        this.ruleForm.LineIDs.some((b) => b == a.LineID)
      );
      let LineName = LineIDs.map((c) => c.LineName).join(",");
      //查询线别剩余工时
      let StrValue = `提示：当前所选${LineName}线，在${this.ruleForm.ProducedDate}共有350个小时，已占用250小时，剩余100小时【已选4项，预计占用50小时，剩余50小时】`;
      this.$set(this.footerLabel, 0, StrValue);
    },
    // 获取线别
    async getLine() {
      let form = {};
      form["rows"] = 0;
      form["dicID"] = 36;
      form["Status"] = 1;
      form["OrganizeTypeID"] = 6;
      let res = await GetSearchData(form);
      const { result, data, count, msg } = res.data;
      if (result) {
        if (data.length != 0) {
          data.forEach((a) => {
            a["LineID"] = a.OrganizeID;
            a["LineName"] = a.OrganizeName;
          });
        }
        this.lines = data;
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
    },
  },
};
</script>
