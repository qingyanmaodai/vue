<!--导入销售计划-->
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
      title="销售导入"
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
import {
  GetHeader,
  GetSearch,
  GetHeaderTwo,
  GetSearchData,
  ExportData,
  SaveData,
} from "@/api/Common";
import { SalesPlanProcessMaterialDay } from "@/api/PagePack";
export default {
  name: "ImportPack",
  components: {
    ComSearch,
  },
  data() {
    return {
      dialogImport: false,
      file: [],
      fileList: [],
      ////////////////// Search /////////////////
      adminLoading: false,
      title: this.$route.meta.title,
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
          BtnName: "查询",
          Type: "primary",
          Ghost: true,
          Size: "small",
          Methods: "dataSearch",
          Icon: "",
          isLoading: false,
          signName: 0,
          Params: "0",
        },
        {
          ButtonCode: "save",
          BtnName: "第一步：解析",
          Type: "primary",
          Ghost: true,
          Size: "small",
          Methods: "checkSys",
          Icon: "",
          isLoading: false,
          signName: 0,
          Params: "0",
        },
        {
          ButtonCode: "save",
          BtnName: "第二步：导入",
          Type: "success",
          Ghost: true,
          Size: "small",
          Methods: "dataSave",
          Icon: "",
          isLoading: false,
          signName: 0,
          Params: "1",
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
    initSpread: function (spread) {
      this.spread = spread;
    },
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
      let date = new Date().getTime();
      let date1 = new Date(this.formSearchs[0].datas.AutoDays[0]).getTime();
      if (date1 < date) {
        this.$message.error("开始日期只能是今天之后！");
        return;
      }
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
      let IDs = [{ ID: 7812 }];
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
      const { result, data, count, Columns, msg } = res.data;
      if (result) {
        this.$set(this.tableColumns, remarkTb, Columns[0]);
        this.$set(this.tableData, remarkTb, data);
        this.setData(data);
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
    // 渲染数据
    setData() {
      this.spread.suspendPaint();
      let sheet = this.spread.getActiveSheet();
      sheet.options.allowCellOverflow = true;
      sheet.defaults.rowHeight = 23;
      sheet.defaults.colHeaderRowHeight = 23;
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

      for (var i = 0; i < 1000; i++) {
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
    async checkSys(a, b, type) {
      this.$confirm("确定要解析吗，解析之后会将结果返回再确定是否导入！")
        .then(async (_) => {
          this.adminLoading = true;
          let submitData = [];
          let sheet = this.spread.getActiveSheet();
          var dirtyRows = sheet.getDataSource();
          var dirtyItems = [];
          for (var i = 0; i < dirtyRows.length; i++) {
            let obj = dirtyRows[i];
            if (dirtyRows[i].Code) {
              obj.dicID = 7806;
              obj.RowNumber = i + 1;
            } else {
              obj.RowNumber = null;
            }
            dirtyItems.push(obj);
          }
          let res = await GetSearch(dirtyItems, "/APSAPI/CheckHWPlan");
          const { data, result, msg, listErrorRows } = res.data;
          if (result) {
            this.$message({
              message: msg,
              type: "success",
              dangerouslyUseHTMLString: true,
            });
            sheet.setDataSource(data);
            if (data.length != 0) {
              data.forEach((m,i) => {
                //改变颜色，行，列，-1为全部
                sheet.getCell(i, -1).backColor("");
              });
            }
            this.adminLoading = false;
            // sheet.clearPendingChanges();
          } else {
            if (data) {
              sheet.setDataSource(data);

              if (listErrorRows.length != 0) {
                listErrorRows.forEach((m) => {
                  //改变颜色，行，列，-1为全部
                  sheet.getCell(m, -1).backColor("red");
                });
              }
            }
            this.$message({
              message: msg,
              type: "error",
              dangerouslyUseHTMLString: true,
            });
            this.adminLoading = false;
          }
        })
        .catch(() => {});
    },
    // 保存
    async dataSave(remarkTb, index, parms, newData) {
      this.$confirm("确定要导入吗，解析错误的不会导入进去哦！")
        .then(async (_) => {
          _this.adminLoading = true;
          let res = null;
          let sheet = _this.spread.getActiveSheet();
          var dirtyRows = sheet.getDataSource();
          var dirtyItems = [];
          for (let i = 0; i < dirtyRows.length; i++) {
            let obj = JSON.parse(JSON.stringify(dirtyRows[i]));
            if (dirtyRows[i].Code) {
              obj.dicID = 7806;
              obj["MaterialName"] = dirtyRows[i].Code;
              obj["ProcessID"] = "P202106171344021";
              obj["RowNumber"] = i;
              obj["PlanQty"] = dirtyRows[i].AllPlanQty;
              obj["MaterialID"] = "";
              obj["LineID"] = "";
              obj["SalesPlanProcessMaterialDayID"] = "0";
              dirtyItems.push(obj);
            }
          }
          if (dirtyItems && dirtyItems.length != 0) {
            res = await SalesPlanProcessMaterialDay(dirtyItems);
          }
          const { datas, forms, result, msg } = res.data;
          if (result) {
            _this.adminLoading = false;
            _this.$message({
              message: msg,
              type: "success",
              dangerouslyUseHTMLString: true,
            });
            _this.dataSearch(remarkTb);
          } else {
            _this.adminLoading = false;
            _this.$message({
              message: msg,
              type: "error",
              dangerouslyUseHTMLString: true,
            });
          }
        })
        .catch(() => {});
    },
  },
};
</script>