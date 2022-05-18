<!--菜单设置-->
<template>
  <div
    class="container"
    v-loading="adminLoading"
  >
    <div
      class="admin_head"
      ref="headRef"
    >
      <ComSearch
        ref="searchRef"
        :searchData="formSearchs[0].datas"
        :searchForm="formSearchs[0].forms"
        :remark="0"
        :isLoading="isLoading[0]"
        :btnForm="btnForm"
        @btnClick="btnClick"
        :signName="0"
        :defaultShow="false"
      />
    </div>
    <div>
      <div class="admin_content">
        <div class="ant-table-title">
          <el-row>
            <el-col :span="4"><span class="title">{{ title }}</span></el-col>
            <el-col
              :span="20"
              class="flex_flex_end"
            >
            </el-col>
          </el-row>
        </div>
        <div
          class="flex_column"
          :style="{'height':height}"
        >
          <div
            class="spreadContainer"
            v-loading="tableLoading[0]"
          >
            <gc-spread-sheets
              class="sample-spreadsheets"
              @workbookInitialized="initSpread"
            >
              <gc-worksheet></gc-worksheet>
            </gc-spread-sheets>

          </div>
        </div>
      </div>
    </div>
    <el-dialog
      title="计件工资导入"
      :visible.sync="dialogImport"
      width="30%"
    >
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
        <div
          class="el-upload__tip"
          slot="tip"
        >
          只能上传xls、xslx文件且仅支持上传一个文件
        </div>
      </el-upload>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          @click="dialogImport = false"
          size="small"
        >取 消</el-button>
        <el-button
          size="small"
          type="primary"
          @click="sureImport"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
var _this;
import XLSX from "xlsx";
const GCsheets = GC.Spread.Sheets;
import "@grapecity/spread-sheets-vue";
import GC from "@grapecity/spread-sheets";
import "@grapecity/spread-sheets/styles/gc.spread.sheets.excel2013white.css";
import "@grapecity/spread-sheets/js/zh.js";
GC.Spread.Common.CultureManager.culture("zh-cn");
import ComSearch from "@/components/ComSearch";
import ComUmyTable from "@/components/ComUmyTable";
import { GetSearch } from "@/api/Common";
import {
  GetHeader,
  GetHeaderTwo,
  GetSearchData,
  ExportData,
} from "@/api/Common";
export default {
  name: "DemandTrans",
  components: {
    ComSearch,
    ComUmyTable,
  },
  data() {
    return {
      dialogImport: false,
      file: [],
      fileList: [],
      ////////////////// Search /////////////////
      adminLoading: false,
      title: "计件导入列表",
      spread: null,
      drawer: false,
      isLoading: [false],
      formSearchs: [
        {
          datas: {},
          forms: [],
        },
      ],
      btnForm: [],
      parmsBtn: [
        {
          ButtonCode: "save",
          BtnName: "第一步：导入",
          Type: "warning",
          Ghost: true,
          Size: "small",
          Methods: "dataImport",
          Icon: "",
          isLoading: false,
          signName: 0,
        },
        {
          ButtonCode: "save",
          BtnName: "第二步：增量保存",
          Type: "primary",
          Ghost: true,
          Size: "small",
          Methods: "analySis",
          Icon: "",
          isLoading: false,
          signName: 0,
        },
        {
          ButtonCode: "save",
          BtnName: "第二步：覆盖保存（刪除大于等于第一行日期后的数据）",
          Type: "success",
          Ghost: true,
          Size: "small",
          Methods: "updateSis",
          Icon: "",
          isLoading: false,
          signName: 0,
        },
        {
          ButtonCode: "save",
          BtnName: "解析",
          Type: "primary",
          Ghost: true,
          Size: "small",
          Methods: "checkSys",
          Icon: "",
          isLoading: false,
          signName: 0,
        },
      ],
      tableData: [[]],
      tableColumns: [[]],
      tableLoading: [false],
      isClear: [false],
      tablePagination: [{ pageIndex: 1, pageSize: 0, pageTotal: 0 }],
      height: "740px",
      height2: "735px",
      showPagination: true,
      tagRemark: 0,
      isLoading: false,
      isSelect: false,
      isEdit: false,
    };
  },
  watch: {
    $route: {
      handler: function (val, oldVal) {
        // this.$set(this,'btnForm',val.meta.btns);
      },
      // 深度观察监听
      deep: true,
    },
  },
  created() {
    _this = this;
    this.adminLoading = true;
    this.judgeBtn();
    this.getTableHeader();
  },
  mounted() {
    setTimeout(() => {
      this.setHeight();
    }, 350);
  },
  methods: {
    // 导入模板
    dataImport() {
      this.dialogImport = true;
      this.fileList = [];
      this.file = [];
    },
    // 确认导入
    sureImport() {
      if (this.fileList.length == 0) {
        this.$message.error("请先选择文件");
        return;
      } else if (this.fileList.length > 1) {
        this.$message.error("仅支持一个文件上传");
      } else {
        _this.importExcel(this.file);
      }
    },
    importExcel(file) {
      this.adminLoading = true;
      this.dialogImport = false;
      const result = [];
      const reader = new FileReader(); //就这啊点上传就解析文件
      var that = this;
      reader.onload = function (e) {
        const data = e.target.result;
        this.wb = XLSX.read(data, {
          type: "binary",
        });
        this.wb.SheetNames.forEach((sheetName) => {
          result.push({
            sheetName: sheetName,
            sheet: XLSX.utils.sheet_to_json(this.wb.Sheets[sheetName]),
          });
        });
        that.dataSys(result); // 解析文件
      };
      reader.readAsBinaryString(file.raw);
    },
    // 解析文件
    async dataSys(importData) {
      if (importData && importData.length > 0) {
        let DataList = [];
        importData[0].sheet.forEach((m) => {
          var obj = {};
          obj["DDate"] = m["日期"];
          obj["Account"] = m["账号"];
          obj["Name"] = m["姓名"];
          obj["ProcessCode"] = m["代码"];
          obj["ProcessName"] = m["工序"];
          obj["Qty"] = m["生产数量"];
          obj["Price"] = m["计件单价"];
          obj["PieceworkFee"] = m["计件工资"];
          obj["DemandQty"] = m["计时"];
          obj["AvglWages"] = m["计时单价"];
          obj["ProductionFee"] = m["计时工资"];
          obj["AntherFee"] = m["车间补贴"];
          obj["TotalWages"] = m["合计工资"];
          obj["Extend1"] = m["备注"];
          obj["dicID"] = 6743;
          DataList.push(obj);
        });
        this.$set(this.tableData, 0, DataList);
        let sheet = this.spread.getActiveSheet();

        sheet.setDataSource(this.tableData[0]);
        sheet.setFormatter(-1, 0, "yyyy-mm-dd");
        this.adminLoading = false;
      }
    },
    handleChanged(file, fileList) {
      // var ext = file.name.substring(file.name.lastIndexOf(".") + 1);
      // const extension = ext === "xlsx" || ext === "xls";
      // if (!extension) {
      //   this.$message.error("上传文件格式只能为xlsx/xls");
      //   // 取消时在文件列表中删除该文件
      //   this.$refs.upload.handleRemove(file);
      //   return false;
      // }
      // const isLt2M = file.size / 1024 / 1024 < 50;
      // if (!isLt2M) {
      //   this.$message.error("上传文件大小不能超过 50MB!");
      //   // 取消时在文件列表中删除该文件
      //   this.$refs.upload.handleRemove(file);
      //   return false;
      // } else {
      this.file = file;
      this.fileList = fileList;
      // }
    },
    handleRemove(file) {
      this.fileList.splice(
        this.fileList.findIndex((item) => item.url === file.url),
        1
      );
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
      let newHeight = rem + 33 + "px";
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
          this.formSearchs[remarkTb].datas[name] = null;
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
      let IDs = [{ ID: 6743 }];
      let res = await GetHeader(IDs);
      const { datas, forms, result, msg } = res.data;
      if (result) {
        // 获取每个表头
        datas.some((m, i) => {
          m.forEach((n) => {
            // 进行验证
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
        this.setData();
      } else {
        this.adminLoading = false;
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
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
      if (result) {
        if (remarkTb == 0) {
          this.setSpreadSheet(data);
        } else {
          this.$set(this.tableData, remarkTb, data);
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
    ////////////////其他事件///////////////

    // 增量保存
    async analySis(remarkTb, index) {
      // 传url保存
      this.saveData("/APSAPI/SaveDayWages?t=0");
    },
    // 覆盖保存
    updateSis() {
      this.saveData("/APSAPI/SaveDayWages?t=1");
    },
    // 保存数据
    async saveData(url) {
      this.adminLoading = true;
      let submitData = [];
      let sheet = this.spread.getActiveSheet();
      var dirtyRows = sheet.getDataSource();
      dirtyRows.forEach((m) => {
        if (m.Account) {
          m["dicID"] = 6743;
          submitData.push(m);
        }
      });
      let res = await GetSearch(submitData, url);
      const { data, result, msg } = res.data;
      if (result) {
        this.$message({
          message: msg,
          type: "success",
          dangerouslyUseHTMLString: true,
        });
        this.adminLoading = false;
        let colInfos = [];
        this.tableColumns[0].forEach((x) => {
          colInfos.push({
            name: x.prop,
            displayName: x.label,
            size: parseInt(x.width),
          });
        });
        this.tableData[0] = [];
        for (var i = 0; i < 4000; i++) {
          let obj = {};
          colInfos.forEach((m) => {
            obj[m.name] = "";
          });
          this.tableData[0].push(obj);
        }
        sheet.setDataSource(this.tableData[0]);
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
        this.adminLoading = false;
      }
    },
    initSpread: function (spread) {
      this.spread = spread;
    },
    // 渲染数据
    setData() {
      this.spread.suspendPaint();
      let sheet = this.spread.getActiveSheet();
      sheet.options.allowCellOverflow = true;
      sheet.defaults.rowHeight = 23;
      sheet.defaults.colWidth = 100;
      sheet.defaults.colHeaderRowHeight = 23;
      sheet.defaults.rowHeaderColWidth = 100;
      let colHeader1 = [];
      let colInfos = [];
      this.tableColumns[0].forEach((x) => {
        colInfos.push({
          name: x.prop,
          displayName: x.label,
          size: parseInt(x.width),
        });
        colHeader1.push(x.label);
      });
      sheet.setRowCount(1, GC.Spread.Sheets.SheetArea.colHeader);
      colHeader1.forEach(function (value, index) {
        sheet.setValue(0, index, value, GC.Spread.Sheets.SheetArea.colHeader);
      });

      for (var i = 0; i < 4000; i++) {
        let obj = {};
        colInfos.forEach((m) => {
          obj[m.name] = "";
        });
        this.tableData[0].push(obj);
      }
      sheet.setDataSource(this.tableData[0]);

      sheet.bindColumns(colInfos);

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

      defaultStyle.hAlign = GC.Spread.Sheets.HorizontalAlign.center;
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
      this.spread.bind(GCsheets.Events.EditEnded, function (e, args) {});
      this.spread.resumePaint();
      this.adminLoading = false;
      this.tableLoading[0] = false;
    },
    // 解析
    async checkSys() {
      this.adminLoading = true;

      let submitData = [];
      let sheet = this.spread.getActiveSheet();
      var dirtyRows = sheet.getDataSource();
      dirtyRows.forEach((m) => {
        if (m.Account) {
          m["dicID"] = 6743;
          submitData.push(m);
        }
      });

      let res = await GetSearch(submitData, "/APSAPI/CheckDayWages");
      const { data, result, msg } = res.data;
      if (result) {
        this.$message({
          message: msg,
          type: "success",
          dangerouslyUseHTMLString: true,
        });
        this.adminLoading = false;
        sheet.setDataSource(data);
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
        this.adminLoading = false;
      }
    },
  },
};
</script>