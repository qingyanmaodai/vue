<!-- EXCEL表格公共导入 -->
<template>
  <div class="container" v-loading="adminLoading">
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
              <span>新增行数：</span>
              <el-input-number
                v-model.trim="addNum"
                :min="1"
                :max="100"
                :step="10"
                placeholder="请输入"
              ></el-input-number>
              <el-divider direction="vertical"></el-divider>
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
  </div>
</template>
<script>
var _this;
let rand = Math.random();
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
export default {
  name: "ExcelComImport",
  components: {
    ComSearch,
  },
  data() {
    return {
      addNum: 1,
      colAdd: [],
      dialogImport: false,
      machineCycle: "",
      title: this.$route.meta.title, //表名
      height: "740px",
      adminLoading: false, //加载状态
      tabStatus: 0,
      tagRemark: 0,
      btnForm: [], //拥有的按钮权限
      parmsBtn: [],
      formSearchs: [
        //不同标签页面的查询条件
        {
          datas: {}, //查询入参
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
      sysID: [{ ID: 8997 }],
      spread: null, //excel初始
      fileList: [],
      file: [],
      selectionData: [[]],
      headerList: [],
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
    let route = this.$route;
    this.sysID[this.tagRemark].ID = parseInt(route.meta.dicID);
    _this.judgeBtn();
    _this.getTableHeader();
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
      if (methods) {
        try {
          if (parms) {
            // 下标 要用的数据 标题 ref
            this[methods](remarkTb, index, parms);
          } else {
            this[methods](remarkTb, index);
          }
        } catch (error) {
          this.$message({
            message: "配置的事件找不到或错误，请检查！",
            type: "error",
            dangerouslyUseHTMLString: true,
          });
        }
      } else {
        this.$message({
          message: "此按钮没配置事件，请检查！",
          type: "error",
          dangerouslyUseHTMLString: true,
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
      let newHeight = rem + "px";
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
      let btnsList = [];
      if (routeBtn.length != 0) {
        routeBtn.forEach((x) => {
          // 动态获取按钮，只适用页面单标签使用
          btnsList.push({
            ButtonCode: x.ButtonCode,
            BtnName: x.ButtonName,
            isLoading: false,
            Methods: x.OnClick,
            Type: x.ButtonType,
            Icon: x.Icon,
          });
        });
      }
      this.$set(this, "btnForm", btnsList);
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
      params["rows"] = this.tablePagination[index].pageSize;
      params["page"] = this.tablePagination[index].pageIndex;
      let res = await GetSearchData(params);
      const { result, data, count, msg } = res.data;
      if (result) {
        this.$set(this.tableData, index, data);
        this.$set(this.tablePagination[index], "pageTotal", count);
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
        this.tableColumns[this.tagRemark].forEach((x, index) => {
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
        colHeaderStyle.hAlign(GC.Spread.Sheets.HorizontalAlign.center);
        colHeaderStyle.vAlign(GC.Spread.Sheets.HorizontalAlign.center);

        //设置数据渲染的单元格默认的样式
        var defaultStyle = new GC.Spread.Sheets.Style();
        defaultStyle.font =
          "12px basefontRegular, Roboto, Helvetica, Arial, sans-serif";
        defaultStyle.hAlign = GC.Spread.Sheets.HorizontalAlign.center;
        defaultStyle.vAlign = GC.Spread.Sheets.HorizontalAlign.center;
        sheet.setDefaultStyle(
          defaultStyle,
          GC.Spread.Sheets.SheetArea.viewport
        );

        // 冻结
        sheet.frozenColumnCount(this.tableColumns[0][1].FixCount);
        //渲染数据源
        sheet.setDataSource(this.tableData[this.tagRemark]);
        //渲染列
        this.headerList = colInfos;
        sheet.bindColumns(colInfos); //此方法一定要放在setDataSource后面才能正确渲染列名
        this.spread.options.tabStripVisible = false; //是否显示表单标签
        // 动态启用单元格列编辑
        this.tableColumns[this.tagRemark].forEach((m, index) => {
          //行，start,end
          if (m.isEdit) {
            sheet.getRange(-1, index, 1, 1).locked(false);
            var cell = sheet.getCell(
              -1,
              index,
              GC.Spread.Sheets.SheetArea.viewport
            );
            cell.foreColor("#2a06ecd9");
          }
        });
        // 锁定表格
        sheet.options.isProtected = true;
        this.spread.resumePaint();
      } catch (error) {
        console.log("表格渲染的错误信息:", error);
      }
      this.spread.refresh(); //重新定位宽高度
      this.spread.options.tabStripVisible = false; //是否显示表单标签
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
    // 保存
    async dataSave(remarkTb) {
      let sheet = this.spread.getActiveSheet();
      let newData = sheet.getDirtyRows(); //获取修改过的数据
      let submitData = [];
      if (newData.length != 0) {
        newData.forEach((x) => {
          submitData.push(x.item);
        });
        this.adminLoading = true;
        let res = await SaveData(submitData);
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
    // 导入并分析模板
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

        let errorDate = false;
        let rowNo = 0; // excel行号
        let propName = "";
        importData[0].sheet.forEach((m, y) => {
          let obj = {};
          obj["dicID"] = this.sysID[this.tagRemark].ID;
          for (let key in m) {
            // 判断是否和配置里的取名一致，一致才可导入
            for (let i = 0; i < this.tableColumns[this.tagRemark].length; i++) {
              let item = this.tableColumns[this.tagRemark][i];
              if (item.label === key) {
                if (item.DataType === "datetime") {
                  // 字段日期类型的判断
                  if (m[key] && !this.isValidDate(m[key])) {
                    //预防用户输入日期格式不正确的判断
                    errorDate = true;
                    propName = key;
                    rowNo = Number(m.__rowNum__) + 1;
                  } else {
                    obj[item.prop] = m[key]
                      ? this.$moment(m[key]).add(1, "days").format("YYYY-MM-DD")
                      : "";
                    // 注意的点：xlsx将excel中的时间内容解析后，会小一天xlsx会解析成 Mon Nov 02 2020 23:59:17 GMT+0800 小了43秒，所以需要在moment转换后＋1天
                  }
                } else if (item.DataType === "int") {
                  obj[item.prop] = parseInt(m[key]);
                } else {
                  obj[item.prop] = m[key];
                }
              } else if (isNaN(key) && !isNaN(Date.parse(key))) {
                // 列为日期的格式
                isDate = true;
                obj[key] = m[key];
              }
            }
          }
          DataList.push({ ...obj });
        });
        if (errorDate) {
          this.adminLoading = false;
          this.$message.error(
            `第${rowNo}行,【${propName}】格式存在错误，请检查！`
          );
          return;
        }
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
                this.$message.error(
                  `第${rowNo}行,【${
                    this.formSearchs[this.tagRemark].required[x]["label"]
                  }】不能为空，请填写`
                );
                this.adminLoading = false;
                return;
              }
            }
          }
        }

        let res = await SaveData(DataList);
        const { result, data, count, msg } = res.data;
        if (result) {
          this.adminLoading = false;
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
    // 获取选中的数据
    getSelectionData() {
      let sheet = this.spread.getActiveSheet();
      let newData = sheet.getDataSource();
      this.selectionData[this.tagRemark] = [];
      if (newData.length != 0) {
        newData.forEach((x) => {
          if (x.isChecked) {
            x.ElementDeleteFlag = 1; //删除标识
            this.selectionData[this.tagRemark].push(x);
          }
        });
      }
    },
    //批量删除
    dataDelete() {
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
          let sheet = this.spread.getActiveSheet();
          let newData = sheet.getDataSource();
          this.selectionData[this.tagRemark] = [];
          let isHasID = false;
          if (newData.length != 0) {
            newData.forEach((item, i) => {
              if (item.isChecked) {
                item.ElementDeleteFlag = 1;
                if (item.rowNum) {
                  //添加没保存的独立删除
                  this.tableData[this.tagRemark] = _.filter(
                    this.tableData[this.tagRemark],
                    function (o) {
                      if (o.rowNum != item.rowNum) {
                        return o;
                      }
                    }
                  );
                  // this.setData();
                  //渲染数据源
                  sheet.setDataSource(this.tableData[this.tagRemark]);
                  //渲染列
                  sheet.bindColumns(this.headerList);
                  this.spread.options.tabStripVisible = false; //是否显示表单标签
                } else {
                  //接口返回的数据删除需要调接口删除
                  isHasID = true;
                  this.selectionData[this.tagRemark].push(item);
                }
              }
            });
            if (this.selectionData[this.tagRemark].length && isHasID) {
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
            }
          }
        });
      }
    },
    // 行新增
    addRow() {
      if (!this.addNum) {
        this.$message.error("请输入需要添加的行数!");
        return;
      }

      let spread = this.spread;
      let sheet = spread.getActiveSheet();
      if (sheet) {
        this.adminLoading = true;
        for (let x = 0; x < this.addNum; x++) {
          let list = [
            {
              rowNum: _.uniqueId("rowNum_"), //随机生成数
            },
          ];
          this.tableData[this.tagRemark] = [
            ...list,
            ...this.tableData[this.tagRemark],
          ];
        }

        // this.setData();
        //渲染数据源
        sheet.setDataSource(this.tableData[this.tagRemark]);
        //渲染列
        sheet.bindColumns(this.headerList);
        this.spread.options.tabStripVisible = false; //是否显示表单标签
        this.adminLoading = false;
      }
    },
  },
};
</script>
