<!-- 手工预测 -->
<template>
  <div class="APSContainer" v-loading="adminLoading">
    <div class="admin_head" ref="headRef">
      <ComSearch
        ref="searchRef"
        :searchData="formSearchs[tagRemark].datas"
        :searchForm="formSearchs[tagRemark].forms"
        :remark="tagRemark"
        :isLoading="tableLoading[tagRemark]"
        :btnForm="btnForm"
        @btnClick="btnClick"
        :defaultShow="true"
        :signName="tabStatus"
      />
    </div>
    <div>
      <div class="admin_content">
        <div class="ant-table-title">
          <el-row>
            <el-col :span="4"
              ><span class="title">{{ title }}</span></el-col
            >
            <el-col :span="20" class="flex_flex_end">
              <div style="margin-right: 10px">
                <span>日期范围</span>
                <el-date-picker
                  v-model="machineCycle"
                  type="daterange"
                  size="small"
                  value-format="yyyy-MM-dd"
                  placeholder="请选择"
                  :clearable="false"
                  :editable="false"
                >
                </el-date-picker>
              </div>
              <div>
                <el-button
                  style="margin-right: 10px"
                  plain
                  v-for="(item, i) in parmsBtn2"
                  :key="i"
                  :type="item.Type ? item.Type : 'primary'"
                  :icon="item.Icon"
                  size="small"
                  @click="btnClick(item.Methods, item.Params, i)"
                >
                  {{ item.BtnName }}</el-button
                >
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
        </div>
        <div class="flex_row_spaceBtn">
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
              @size-change="(val) => pageSize(val, 0)"
              :current-page="tablePagination[tagRemark].pageIndex"
              :page-sizes="[200, 500, 1000, 2000, 3000, 5000, 10000]"
              :page-size="tablePagination[tagRemark].pageSize"
              :total="tablePagination[tagRemark].pageTotal"
              @current-change="(val) => pageChange(val, 0)"
              layout="total, sizes, prev, pager, next,jumper"
            >
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
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
    <!-- 点击行弹框-->
    <!-- <DialogTable
      title="送货预测需求明细"
      :tableDialog="colDialogVisible"
      :sysID="8999"
      width="80%"
      @closeDialog="colDialogVisible = false"
      :searchForm="dialogSearchForm"
      :isToolbar="false"
      :cellStyle="cellStyle"
    ></DialogTable> -->
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
import {
  GetHeader,
  GetSearchData,
  ExportData,
  SaveData,
  GetSearch,
} from "@/api/Common";
import { HeaderCheckBoxCellType } from "@/static/data.js";
import formatDates, {
  formatNextMonthDate,
  formatDate,
} from "@/utils/formatDate";
import XLSX from "xlsx";
// import DialogTable from "@/components/Dialog/dialogTable";
export default {
  name: "SchedulingPrediction",
  components: {
    ComSearch,
    // DialogTable,
  },
  data() {
    return {
      dialogSearchForm: {},
      colDialogVisible: false,
      colAdd: [],
      dialogImport: false,
      machineCycle: "",
      title: this.$route.meta.title, //表名
      height: "740px",
      adminLoading: false, //加载状态
      tabStatus: 0,
      tagRemark: 0,
      btnForm: [], //拥有的按钮权限
      parmsBtn: [
        {
          ButtonCode: "syncSave",
          BtnName: "同步预测",
          Type: "danger",
          Ghost: true,
          Size: "small",
          Methods: "syncSave",
          Icon: "",
          sort: 0,
        },
        // {
        //     ButtonCode: "import",
        //     BtnName: "1.删除并导入",
        //     Type: "danger",
        //     Ghost: true,
        //     Size: "small",
        //     Methods: "dataImport",
        //     Icon: "",
        //     sort:1,
        //     Params:{isDel:1}
        //   },
        {
          ButtonCode: "import",
          BtnName: "1.增量导入",
          Type: "primary",
          Ghost: true,
          Size: "small",
          Methods: "dataImport",
          Icon: "",
          sort: 1,
          Params: { isDel: 0 },
        },
        {
          ButtonCode: "sysData",
          BtnName: "2.抓单分析",
          Type: "primary",
          Ghost: true,
          Size: "small",
          Methods: "Analysis",
          Icon: "",
          sort: 2,
        },
        {
          ButtonCode: "to_weeks_plan",
          BtnName: "3.转入周计划",
          Type: "primary",
          Ghost: true,
          Size: "small",
          Methods: "toWeeksPlan",
          Icon: "",
          sort: 3,
        },

        {
          ButtonCode: "delete",
          BtnName: "删除",
          isLoading: false,
          Methods: "deleteRow",
          Type: "danger",
          Ghost: true,
          Icon: "",
          Size: "small",
          sort: 4,
        },
        {
          ButtonCode: "save",
          BtnName: "保存",
          Type: "success",
          Ghost: true,
          Size: "small",
          Methods: "dataSave",
          Icon: "",
          sort: 5,
        },
        {
          ButtonCode: "downLoadErpData",
          BtnName: "下载ERP数据",
          Type: "warning",
          Ghost: true,
          Size: "small",

          Methods: "downERP",
          Icon: "",
          sort: 6,
        },
      ],
      // 表头添加动态按钮
      parmsBtn2: [
        // {
        //   ButtonCode: "save",
        //   BtnName: "计算",
        //   Type: "primary",
        //   Ghost: true,
        //   Size: "small",
        //   Methods: "calculateSave",
        //   Icon: "",
        // },
      ],
      formSearchs: [
        //不同标签页面的查询条件
        {
          datas: {
            MFGOrganizeID: 1222, //恩平
            OrganizeID: 1222, // 恩平组织ID,可能是上面字段，可能下面字段
          }, //查询入参
          forms: [], // 页面显示的查询条件
          required: [], //获取必填项
        },
      ],
      tableData: [[]], //表格渲染数据,sysID有几个就有几个数组
      tableColumns: [[]], //表格表头列
      tableLoading: [false], //每个表加载
      isClear: [false],
      tablePagination: [
        //表分页参数
        { pageIndex: 1, pageSize: 2000, pageTotal: 0 },
      ],
      sysID: [{ ID: 9005 }],
      spread: null, //excel初始
      fileList: [],
      file: [],
      selectionData: [[]],
      ImportParams: "",
    };
  },
  activated() {
    if (this.spread) {
      this.spread.refresh();
    }
  },
  created() {
    _this = this;
    _this.adminLoading = true;
    _this.judgeBtn();
    _this.getTableHeader();
    // 计算周期默认时间：今天+1个月
    _this.machineCycle = [
      formatDates.formatTodayDate(),
      formatDates.formatOneMonthDate(),
    ];
  },
  mounted() {
    setTimeout(() => {
      this.setHeight();
    }, 350);
  },
  methods: {
    //初始化SpreadJS
    initSpread: function (spread) {
      this.spread = spread;
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
      let newHeight = rem + 33 + "px";
      this.$set(this, "height", newHeight);
    },
    // 跳转至属性配置
    toPageSetting(id) {
      this.$router.push({
        name: "FieldInfo",
        params: { ID: id },
      });
    },
    // 拥有什么按钮权限
    judgeBtn() {
      let routeBtn = this.$route.meta.btns;
      let newBtn = [];
      let btn2 = [];
      if (routeBtn.length != 0) {
        routeBtn.forEach((x) => {
          let newData = this.parmsBtn.filter((y) => {
            return x.ButtonCode == y.ButtonCode;
          });
          if (newData.length != 0) {
            newBtn = newBtn.concat(newData);
          }
          let newData2 = this.parmsBtn2.filter((y) => {
            return x.ButtonCode == y.ButtonCode;
          });
          if (newData2.length != 0) {
            btn2 = btn2.concat(newData2);
          }
        });
      }
      newBtn = _.sortBy(newBtn, ["sort"]);
      this.$set(this, "btnForm", newBtn);
      this.$set(this, "parmsBtn2", btn2);
    },
    // 获取表头
    async getTableHeader() {
      let IDs = this.sysID;
      let res = await GetHeader(IDs);
      const { datas, forms, result, msg } = res.data;
      if (result) {
        // 获取每个表头
        datas.some((m, i) => {
          this.$set(this.tableColumns, i, m);
          m.forEach((n, index) => {
            if (n.Required) {
              this.formSearchs[this.tagRemark].required.push(n);
            }
          });
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
          this.getTableData(this.formSearchs[z].datas, z);
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
    // 获取表格数据
    async getTableData(params, index) {
      this.$set(this.tableLoading, index, true);
      params["SDate"] = this.machineCycle.length ? this.machineCycle[0] : "";
      params["Edate"] = this.machineCycle.length ? this.machineCycle[1] : "";
      params["rows"] = this.tablePagination[index].pageSize;
      params["page"] = this.tablePagination[index].pageIndex;
      let res = await GetSearchData(params);
      const { result, data, count, msg, Columns } = res.data;
      if (result) {
        this.$set(this.tableData, index, data);
        this.$set(this.tablePagination[index], "pageTotal", count);
        // 查询时重新获取列渲染
        if (Columns.length) {
          this.tableColumns[index] = Columns[0];
        }
        this.setData();
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
      this.$set(this.tableLoading, index, false);
    },
    // excle表数据渲染
    async setData() {
      try {
        // 获取活动表单
        let sheet = this.spread.getActiveSheet();

        // sheet.visible(false)
        // 重置表单
        sheet.reset();
        // 渲染列
        let colInfos = [];
        this.tableColumns[this.tagRemark].forEach((x) => {
          colInfos.push({
            name: x.prop,
            displayName: x.label,
            size: parseInt(x.width),
          });
        });
        // 选框
        sheet.setCellType(
          0,
          0,
          new HeaderCheckBoxCellType(),
          GCsheets.SheetArea.colHeader
        );

        let checkbox = {
          name: "isChecked",
          displayName: "选择",
          cellType: new GC.Spread.Sheets.CellTypes.CheckBox(),
          size: 60,
        };
        for (var name in checkbox) {
          colInfos[0][name] = checkbox[name];
        }

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
          GC.Spread.Sheets.SheetArea.colHeader
        );
        colHeaderStyle.foreColor("000000d9");
        colHeaderStyle.backColor("#f3f3f3");
        colHeaderStyle.font(
          "12px basefontRegular, Roboto, Helvetica, Arial, sans-serif"
        );
        colHeaderStyle.hAlign(GC.Spread.Sheets.HorizontalAlign.left);
        colHeaderStyle.vAlign(GC.Spread.Sheets.HorizontalAlign.left);

        //设置数据渲染的单元格默认的样式
        var defaultStyle = new GC.Spread.Sheets.Style();
        defaultStyle.font =
          "12px basefontRegular, Roboto, Helvetica, Arial, sans-serif";
        defaultStyle.hAlign = GC.Spread.Sheets.HorizontalAlign.left;
        defaultStyle.vAlign = GC.Spread.Sheets.HorizontalAlign.left;
        sheet.setDefaultStyle(
          defaultStyle,
          GC.Spread.Sheets.SheetArea.viewport
        );
        defaultStyle.showEllipsis = true;

        // 表格单击齐套率弹框事件
        // this.spread.bind(GCsheets.Events.CellDoubleClick, function (e, args) {
        //   if (_this.tableColumns[_this.tagRemark].length) {
        //     _this.tableColumns[_this.tagRemark].map((item, index) => {
        //       if (args.col === index) {
        //         // 显示表
        //         _this.colDialogVisible = true;
        //         _this.dialogSearchForm.ItemCode =
        //           _this.tableData[_this.tagRemark][args.row].ItemCode;
        //         _this.dialogSearchForm.Account =
        //           _this.tableData[_this.tagRemark][args.row].Account;
        //       }
        //     });
        //   }
        // });

        // 冻结
        sheet.frozenColumnCount(this.tableColumns[0][1].FixCount);
        //渲染数据源
        sheet.setDataSource(this.tableData[this.tagRemark]);
        //渲染列
        sheet.bindColumns(colInfos); //此方法一定要放在setDataSource后面才能正确渲染列名
        this.spread.options.tabStripVisible = false; //是否显示表单标签
        // 设置行颜色，最终判断有错误整行底色红色
        this.tableData[this.tagRemark].forEach((row, index) => {
          if (row["DBResult"] && row["DBResult"].indexOf("错误") > -1) {
            sheet.getCell(index, -1).backColor("red");
          }
        });
        this.spread.resumePaint();
      } catch (error) {
        console.log("表格渲染的错误信息:", error);
      }
      this.spread.refresh(); //重新定位宽高度
      this.spread.options.tabStripVisible = false; //是否显示表单标签
    },
    // 单元格样式控制
    cellStyle({ row, column }) {
      //判断结果为“错误”时，分配剩余和计算结果单元格字体为红色
      if (row["DBResult"] && row["DBResult"] == "错误") {
        if (
          column.property === "Remark1" ||
          column.property === "AvailableQty"
        ) {
          return {
            color: "red",
          };
        }
      }
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
    // 当前第几页
    pageChange(val, remarkTb) {
      this.$set(this.tablePagination[remarkTb], "pageIndex", val);
      this.getTableData(this.formSearchs[remarkTb].datas, remarkTb);
    },
    // 页数
    pageSize(val, remarkTb) {
      this.$set(this.tablePagination[remarkTb], "pageSize", val);
      this.getTableData(this.formSearchs[remarkTb].datas, remarkTb);
    },
    async downERP() {
      this.adminLoading = true;
      let res = await GetSearch(null, "/APSAPI/GetErpData");

      const { result, data, count, msg } = res.data;

      if (result) {
        this.dataSearch(this.tagRemark);
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
    // 保存
    async dataSave(remarkTb) {
      let sheet = this.spread.getActiveSheet();
      let newData = sheet.getDirtyRows(); //获取修改过的数据
      let submitData = [];
      if (newData.length != 0) {
        newData.forEach((x) => {
          (x.item["SDate"] = this.machineCycle.length
            ? this.machineCycle[0]
            : ""),
            (x.item["Edate"] = this.machineCycle.length
              ? this.machineCycle[1]
              : ""),
            submitData.push(x.item);
        });
        this.adminLoading = true;
        // let res = await SaveData(submitData);
        let res = await GetSearch(submitData, "/APSAPI/SaveManualForecast"); //金羚此特殊接口，没使用通用保存
        const { datas, forms, result, msg } = res.data;
        if (result) {
          this.adminLoading = false;
          this.$message({
            message: msg,
            type: "success",
            dangerouslyUseHTMLString: true,
          });
          this.dataSearch(remarkTb);
        } else {
          this.adminLoading = false;
          this.$message({
            message: msg,
            type: "error",
            dangerouslyUseHTMLString: true,
          });
        }
      } else {
        this.$message.error("当前数据没做修改，请先修改再保存！");
      }
    },
    // 同步
    async syncSave() {
      this.adminLoading = true;
      let res = await GetSearch("", "/APSAPI/UpdateForecast");
      const { result, data, count, msg } = res.data;
      try {
        if (result) {
          this.adminLoading = false;
          this.$message({
            message: msg,
            type: "success",
            dangerouslyUseHTMLString: true,
          });
          this.dataSearch(this.tagRemark);
        } else {
          this.adminLoading = false;
          this.$message({
            message: msg,
            type: "error",
            dangerouslyUseHTMLString: true,
          });
        }
      } catch (error) {
        if (error) {
          this.adminLoading = false;
        }
      }
    },
    // 转入周计划
    async toWeeksPlan() {
      let sheet = this.spread.getActiveSheet();
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
        this.$message.error("请选择需要转入的数据！");
        return;
      }
      this.adminLoading = true;
      let res = await GetSearch(
        this.selectionData[this.tagRemark],
        "/APSAPI/ManualForecastToPlan"
      );
      const { result, data, count, msg } = res.data;
      try {
        if (result) {
          this.adminLoading = false;
          this.$message({
            message: msg,
            type: "success",
            dangerouslyUseHTMLString: true,
          });
          this.dataSearch(this.tagRemark);
        } else {
          this.adminLoading = false;
          this.$message({
            message: msg,
            type: "error",
            dangerouslyUseHTMLString: true,
          });
        }
      } catch (error) {
        if (error) {
          this.adminLoading = false;
        }
      }
    },
    // 计算
    async calculateSave() {
      let form = {
        SDate: _this.machineCycle.length ? _this.machineCycle[0] : "",
        Edate: _this.machineCycle.length ? _this.machineCycle[1] : "",
      };
      this.adminLoading = true;
      let res = await GetSearch(form, "/APSAPI/CalculateDeliveryData");
      const { result, data, count, msg } = res.data;
      try {
        if (result) {
          this.adminLoading = false;
          this.$message({
            message: msg,
            type: "success",
            dangerouslyUseHTMLString: true,
          });
          this.dataSearch(this.tagRemark);
        } else {
          this.adminLoading = false;
          this.$message({
            message: msg,
            type: "error",
            dangerouslyUseHTMLString: true,
          });
        }
      } catch (error) {
        if (error) {
          this.adminLoading = false;
        }
      }
    },
    // 导入并分析模板
    dataImport(remarkTb, index, params) {
      this.dialogImport = true;
      this.fileList = [];
      this.file = [];
      this.ImportParams = params.isDel;
    },
    // 确认导入
    sureImport() {
      if (this.fileList.length == 0) {
        this.$message.error("请先选择文件");
        return;
      } else if (this.fileList.length > 1) {
        this.$message.error("仅支持一个文件上传");
      } else {
        this.$confirm("确定要导入并分析吗？")
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
          type: "binary",
          cellDates: true,
          dateNF: "yyyy-MM-dd",
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
        let propName = "";
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
                  if (item.DataType === "datetime") {
                    if (m[key] && !this.isValidDate(m[key])) {
                      //预防用户输入日期格式不正确的判断
                      propName = key;
                      rowNo = Number(m.__rowNum__) + 1;
                      // 异常提示
                      split.push(
                        `第${rowNo}行,【${propName}】格式存在错误，导入失败，请检查！`
                      );
                    } else {
                      obj[item.prop] = m[key]
                        ? this.$moment(m[key])
                            .add(1, "days")
                            .format("YYYY-MM-DD")
                        : "";
                    }
                    // 注意的点：xlsx将excel中的时间内容解析后，会小一天xlsx会解析成 Mon Nov 02 2020 23:59:17 GMT+0800 小了43秒，所以需要在moment转换后＋1天
                    // 判断需求到料日期是否大于今天
                    if (
                      item.prop === "PlanDay" &&
                      obj[item.prop] &&
                      obj[item.prop] < formatDates.formatTodayDate()
                    ) {
                      propName = key;
                      rowNo = Number(m.__rowNum__) + 1;
                      // 异常提示
                      split.push(
                        `第${rowNo}行,【${propName}】过期，导入失败，请检查！`
                      );
                    }
                  } else if (item.prop === "PlanQty") {
                    if (m[key] > 0) {
                      //导入欠料数大于0才导入
                      obj[item.prop] = m[key];
                    } else {
                      return;
                    }
                  } else {
                    obj[item.prop] = m[key];
                  }
                } else if (isNaN(key) && !isNaN(Date.parse(key))) {
                  //导入日期并且数大于0才导入
                  // 列为日期的格式
                  isDate = true;
                  if (Number(m[key]) > 0) {
                    obj["PlanDay"] = this.$moment(key).format("YYYY-MM-DD");
                    obj["PlanQty"] = m[key];
                    obj["dicID"] = _this.sysID[_this.tagRemark].ID;
                    obj["Account"] = _this.$store.getters.userInfo.Account;
                    obj["row"] = m.__rowNum__;
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
            obj["dicID"] = this.sysID[this.tagRemark].ID;
            (obj["SDate"] = _this.machineCycle.length
              ? _this.machineCycle[0]
              : ""),
              (obj["Edate"] = _this.machineCycle.length
                ? _this.machineCycle[1]
                : ""),
              (obj["Account"] = this.$store.getters.userInfo.Account);
            obj["row"] = m.__rowNum__;
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
                  this.formSearchs[this.tagRemark].required[x]["prop"]
                ] === undefined ||
                DataList[i][
                  this.formSearchs[this.tagRemark].required[x]["prop"]
                ] === null ||
                DataList[i][
                  this.formSearchs[this.tagRemark].required[x]["prop"]
                ] === ""
              ) {
                rowNo = Number(DataList[i]["row"]) + 1;
                // 异常提示
                split.push(
                  `第${rowNo}行,【${
                    this.formSearchs[this.tagRemark].required[x]["label"]
                  }】不能为空，导入失败，请填写`
                );
                this.adminLoading = false;
              }
            }
          }
        }
        if (split.length) {
          //异常集合
          this.adminLoading = false;
          let txt = "";
          split.map((value) => {
            return (txt = `${txt}<p style="word-break: break-word;">${value}</p>`);
          });
          this.$alert(txt, {
            dangerouslyUseHTMLString: true,
            title: "导入异常信息!",
            customClass: "message-width",
          });

          return;
        }
        // =1表示要删记录（删除并导入）
        // =0表示不删除（增量导入）
        if (DataList.length) {
          let res = await GetSearch(
            DataList,
            "/APSAPI/ImportManualForecast?isDel=" + this.ImportParams
          );
          const { result, data, count, msg } = res.data;
          if (result) {
            this.adminLoading = false;
            // this.dataSearch(this.tagRemark);
            // 导入可能存在表头格式不一样，需要更新
            this.getTableHeader();
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
          this.adminLoading = false;
          this.$message.error("未接收到数据，请检查！");
        }
      }
    },
    handleChanged(file, fileList) {
      var ext = file.name.substring(file.name.lastIndexOf(".") + 1);
      const extension = ext === "xlsx" || ext === "xls";
      if (!extension) {
        this.$message.error("上传文件格式只能为xlsx/xls");
        // 取消时在文件列表中删除该文件
        this.$refs.upload.handleRemove(file);
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 50;
      if (!isLt2M) {
        this.$message.error("上传文件大小不能超过 50MB!");
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
        1
      );
    },
    // 分析
    async Analysis() {
      let form = {
        // StartDate:null,
        // EndDate: _this.machineCycle
        SDate: _this.machineCycle.length ? _this.machineCycle[0] : "",
        Edate: _this.machineCycle.length ? _this.machineCycle[1] : "",
      };
      this.adminLoading = true;
      let res = await GetSearch(form, "/APSAPI/AnalyseManualForecast");
      const { result, data, count, msg } = res.data;
      try {
        if (result) {
          this.adminLoading = false;
          this.$message({
            message: msg,
            type: "success",
            dangerouslyUseHTMLString: true,
          });
          this.dataSearch(this.tagRemark);
        } else {
          this.adminLoading = false;
          this.$message({
            message: msg,
            type: "error",
            dangerouslyUseHTMLString: true,
          });
        }
      } catch (error) {
        if (error) {
          this.adminLoading = false;
        }
      }
    },
    // 获取选中的数据
    getSelectionData() {
      let sheet = this.spread.getActiveSheet();
      let newData = sheet.getDataSource();
      this.selectionData[this.tagRemark] = [];
      if (newData && newData.length != 0) {
        newData.forEach((x) => {
          if (x.isChecked) {
            x.ElementDeleteFlag = 1; //删除标识
            this.selectionData[this.tagRemark].push(x);
          }
        });
      }
    },
    deleteRow() {
      this.getSelectionData();
      if (this.selectionData[this.tagRemark].length == 0) {
        this.$message.error("请选择需要删除的数据！");
        return;
      } else {
        this.$confirm("删除不可恢复，确定要删除吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "info",
        }).then(async () => {
          this.adminLoading = true;
          let res = await SaveData(this.selectionData[this.tagRemark]);
          const { result, data, count, msg } = res.data;
          if (result) {
            this.dataSearch(this.tagRemark);
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
        });
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
