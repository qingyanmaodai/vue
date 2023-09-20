<!--DIP主计划-->
<template>
  <div class="container flex_flex" v-loading="adminLoading">
    <el-container>
      <el-main style="padding: 0; margin: 0">
        <div class="admin_container_2" style="width: 100%">
          <div class="admin_head" ref="headRef">
            <div v-for="i in [0, 3, 5]" :key="i" v-show="labelStatus2 === i">
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
          <div>
            <div class="admin_content">
              <div class="ant-table-title">
                <el-row>
                  <el-col :span="4">
                    <i
                      class="el-icon-d-arrow-left"
                      v-show="showAside"
                      @click="showAside = !showAside"
                    ></i>
                    <i
                      class="el-icon-d-arrow-right"
                      v-show="!showAside"
                      @click="showAside = !showAside"
                    ></i>
                    <span class="title">{{ title }}</span>
                  </el-col>
                  <el-col :span="20" class="flex_flex_end">
                    <!-- <el-divider direction="vertical"></el-divider>

                    <el-button
                      type="primary"
                      size="mini"
                      @click="changeDate(0)"
                    >
                      复制
                    </el-button> -->
                    <!-- <el-divider direction="vertical"></el-divider>
                    <el-button
                      type="primary"
                      size="mini"
                      @click="changeEvent(0)"
                    >
                      拆分订单
                    </el-button> -->
                    <el-divider direction="vertical"></el-divider>
                    <div v-for="(item, y) in Status1" :key="y">
                      <span
                        @click="changeStatus(item, y)"
                        :class="
                          labelStatus1 == y ? 'statusActive cursor' : 'cursor'
                        "
                        >{{ item.label }}</span
                      >
                      <el-divider direction="vertical"></el-divider>
                    </div>
                  </el-col>
                </el-row>
              </div>
              <div
                class="flex_column"
                v-for="item in [0, 3, 5]"
                :key="item"
                v-show="item === labelStatus2"
              >
                <ComSpreadTable
                  ref="`spreadsheetRef${remarkTb}`"
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
                  @selectChanged="selectChanged"
                />
              </div>
            </div>
          </div>
        </div>
      </el-main>
    </el-container>
    <el-dialog :title="'拆分订单'" :visible.sync="Dialog" width="50%">
      <div class="ant-table-title">
        <el-row>
          <el-col :span="4"
            ><span class="title">拆分编辑完请保存 </span></el-col
          >
          <el-col :span="24" class="flex_flex_end"
            ><el-divider direction="vertical"></el-divider>
            <el-button type="primary" size="mini" @click="changeEvent(1)">
              确定拆分
            </el-button>
          </el-col>
        </el-row>
      </div>
      <div v-for="item in [6]" :key="item">
        <ComSpreadTable2
          ref="spreadsheetRef"
          height="600px"
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
          :spaceBtnShow="false"
        />
      </div>
    </el-dialog>
    <!-- <el-dialog title="新增排程" :visible.sync="newDataDialog" width="80%">
      <div v-for="item in [7]" :key="item">
        <ComSearch
          class="margin_bottom_10 dialog_search"
          ref="searchRef"
          :searchData="formSearchs[item].datas"
          :searchForm="formSearchs[item].forms"
          :remark="item"
          :isLoading="isLoading[item]"
          :btnForm="btnForm"
          :signName="i"
          :Region="Region[i]"
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
    </el-dialog> -->
    <!-- 导入文件 -->
    <!-- <div>
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
    </div> -->
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
import ComSpreadTable from "@/components/ComSpreadTable";
import XLSX from "xlsx";
import ComSearch from "@/components/ComSearch";
import ComAsideTree from "@/components/ComAsideTree";
import ComVxeTable from "@/components/ComVxeTable";
import ComReportTable from "@/components/ComReportTable";
import ComSpreadTable2 from "@/components/ComSpreadTable";
import {
  GetHeader,
  GetSearchData,
  ExportData,
  GetSearch,
  SaveData,
  GetServerTime,
  GetOrgData,
  UpdateOrderBomPOTracker,
} from "@/api/Common";
import { HeaderCheckBoxCellType } from "@/static/data.js";
import ComFormDialog from "@/components/ComFormDialog";
export default {
  name: "SMTMasterPlan",
  components: {
    ComSearch,
    ComAsideTree,
    ComVxeTable,
    ComReportTable,
    ComFormDialog,
    ComSpreadTable,
    ComSpreadTable2,
  },
  data() {
    return {
      Days: 50,
      newDataDialog: false,
      Dialog: false,
      Columns: [[]],
      isLoading: false,
      hasSelect: [true, true, true, true, true],
      footerLabel: [""],
      dialogShow: false,
      height1: "360px",
      labelStatus1: 0,
      labelStatus2: 0,
      Status1: [
        { label: "分配数量", value: -1 },
        { label: "数量+时间+线体", value: 0 },
        // { label: "数量+时间+线体+托盘", value: "" },
        // { label: "综合分析", value: "" },
        // { label: "全部", value: 1 },
        // { label: "业务订单分析", value: 1 },
      ],
      //////////////左侧树节点//////////////
      showAside: true,
      ReplyDate: "",
      ////////////////// Search /////////////////
      title: this.$route.meta.title,
      delData: [[]],
      spread: [[], [], [], [], [], [], [], []],
      formSearchs: [
        {
          datas: {
            ProcessID: "P2303210003",
          },
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
        {
          datas: { IsToMainPlan: "未排", ProcessGroupName: "SMT" },
          forms: [],
        },
      ],
      selectionData: [[], [], [], [], [], [], [], []],
      btnForm: [],
      tableData: [[], [], [], [], [], [], [], []],
      tableColumns: [[], [], [], [], [], [], [], []],
      tableLoading: [false, false, false, false, false, false, false, false],
      isClear: [false, false, false, false, false, false, false, false],
      hasSelect: [false, false, false, false, false, false, false, false],
      Region: [5, 5, 5, 5, 5, 5, 5, 5],
      tablePagination: [
        { pageIndex: 1, pageSize: 1000, pageTotal: 0 },
        { pageIndex: 1, pageSize: 1000, pageTotal: 0 },
        { pageIndex: 1, pageSize: 1000, pageTotal: 0 },
        { pageIndex: 1, pageSize: 1000, pageTotal: 0 },
        { pageIndex: 1, pageSize: 1000, pageTotal: 0 },
        { pageIndex: 1, pageSize: 1000, pageTotal: 0 },
        { pageIndex: 1, pageSize: 1000, pageTotal: 0 },
        { pageIndex: 1, pageSize: 1000, pageTotal: 0 },
      ],
      height: "707px",
      treeHeight: "765px",
      showPagination: true,
      tagRemark: 0,
      isEdit: false,
      clickData: {},
      isUpdate: true,
      adminLoading: false,
      dialogImport: false,
      fileList: [],
      file: [],
      sysID: [
        { ID: 12191 },
        { ID: 12191 },
        { ID: 12191 },
        { ID: 5615 },
        { ID: 12191 },
        { ID: 10109 },
        { ID: 10109 },
        { ID: 10124 },
      ],
      userInfo: {},
    };
  },
  computed: {},
  created() {
    _this = this;
    this.adminLoading = true;
    this.userInfo = this.$store.getters.userInfo;
    // 获取所有按钮
    this.btnForm = this.$route.meta.btns;
    this.judgeBtn(this.btnForm);
    this.getTableHeader();
  },
  mounted() {
    setTimeout(() => {
      this.setHeight();
    }, 500);
  },
  methods: {
    judgeBtn(routeBtn) {
      if (routeBtn && routeBtn.length > 0)
        routeBtn.some((item, index) => {
          if (item.ButtonCode == "save") {
            this.$set(this, "isEdit", true);
          }
        });
      this.$set(this, "btnForm", routeBtn);
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
    // 导出
    async dataExport(remarkTb) {
      this.adminLoading = true;
      let form = JSON.parse(JSON.stringify(this.formSearchs[remarkTb].datas));
      form["rows"] = 0;
      let res = await ExportData(form);
      this.adminLoading = false;
      this.$store.dispatch("user/exportData", res.data);
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
    // 高度控制
    setHeight() {
      this.treeHeight = document.documentElement.clientHeight - 150 + "px";
      let headHeight = this.$refs.headRef.offsetHeight;

      let rem =
        document.documentElement.clientHeight -
        headHeight -
        this.$store.getters.reduceHeight;
      let newHeight = rem + "px";
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
      this.$set(this.isClear, remarkTb, true);
      this.$set(this.tableLoading, remarkTb, true);
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
    // 保存
    async dataSave(remarkTb, index, parms, newData) {
      this.adminLoading = true;
      const sheet = this.spread[remarkTb]?.getActiveSheet();
      const $table = this.$refs[`tableRef${remarkTb}`]?.[0].$refs.vxeTable;

      // 获取修改记录
      let updateRecords = [];
      if (newData) {
        updateRecords = newData;
      } else {
        if ($table) {
          updateRecords = $table.getUpdateRecords();
        } else {
          let DirtyRows = sheet.getDirtyRows().map((row) => row.item); //获取修改过的数据
          let InsertRows = sheet.getInsertRows().map((row) => row.item); //获取插入过的数据
          // let DeletedRows = sheet.getDeletedRows().map(row => row.item);
          // DeletedRows.forEach(item => {
          //   item["ElementDeleteFlag"] = 1;
          // }); //获取被删除的数据
          updateRecords = [...DirtyRows, ...InsertRows];
        }
      }

      if (updateRecords.length == 0) {
        this.$set(this, "adminLoading", false);
        this.$message.error("当前数据没做修改，请先修改再保存！");
        return;
      }
      let res = await GetSearch(updateRecords, "/APSAPI/SaveData10130");
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
    // 删除
    async dataDel(remarkTb, index, parms) {
      let res = null;
      let newData = [];
      if (this.selectionData[remarkTb].length == 0) {
        this.$message.error("请单击需要操作的数据！");
        return;
      } else {
        this.selectionData[remarkTb].forEach((x) => {
          let obj = x;
          obj["ElementDeleteFlag"] = 1;
          newData.push(obj);
        });
      }
      this.$confirm("确定要删除的【" + newData.length + "】数据吗？")
        .then((_) => {
          _this.dataSave(remarkTb, index, null, newData);
        })
        .catch((_) => {});
    },
    // 通用直接保存
    // async generalSaveData(newData, remarkTb, index) {
    //   if (newData.length == 0) {
    //     this.$message.error("没有提交保存的数据！");
    //     return;
    //   }
    //   this.adminLoading = true;
    //   let res = await SaveData(newData);
    //   const { result, data, count, msg } = res.data;
    //   if (result) {
    //     this.dataSearch(remarkTb);
    //     this.adminLoading = false;
    //     this.$message({
    //       message: msg,
    //       type: "success",
    //       dangerouslyUseHTMLString: true
    //     });
    //   } else {
    //     this.adminLoading = false;
    //     this.$message({
    //       message: msg,
    //       type: "error",
    //       dangerouslyUseHTMLString: true
    //     });
    //   }
    // },
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
        this.adminLoading = false;
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
      let res = await GetSearchData(form);
      let { result, data, count, msg, Columns } = res.data;
      if (result) {
        this.$set(this.Columns, remarkTb, Columns[0]);
        this.$set(this.tableColumns, remarkTb, Columns[0]);
        this.$set(this.tableData, remarkTb, data);
        this.$set(this.tablePagination[remarkTb], "pageTotal", count);
        this.setData(remarkTb);
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
      this.$set(this.tableLoading, remarkTb, false);
      if (this.labelStatus1 !== 3 && this.labelStatus1 !== 5) {
        this.changeStatus(null, this.labelStatus1);
      }
    },
    // excle表数据渲染
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
      console.log(this.checkBoxCellTypeLine);
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
        } else if (x.prop === "LineID") {
          let newData = [];
          let list = null;
          this.tableData[remarkTb].map((item, index) => {
            if (item["Lines"]) {
              newData = item["Lines"];
              if (newData.length !== 0 && newData) {
                list = new GCsheets.CellTypes.ComboBox();
                list.editorValueType(
                  GC.Spread.Sheets.CellTypes.EditorValueType.value
                );
                list.editable(true);
                list.items(newData);
                list.itemHeight(24);
                sheet
                  .getCell(index, y, GCsheets.SheetArea.viewport)
                  .cellType(list);
              }
            } else {
              item["LineID"] = null;
            }
          });
        } else if (
          x.ControlType === "comboboxMultiple" ||
          x.ControlType === "combobox"
        ) {
          let newData = [];
          // let list = null;
          this.tableData[remarkTb].map((item, index) => {
            if (x.DataSourceID && x.DataSourceName) {
              newData = item[x.DataSourceName]; // 设置列表每行下拉菜单
              this.bindComboBoxToCell(sheet, index, y, newData);
            }
          });
        } else if (
          x.DataType == "datetime" ||
          x.DataType === "varchar" ||
          x.DataType === "nvarchar"
        ) {
          x.formatter = "@";
        }

        //行，start,end
        if (x.isEdit) {
          sheet.getCell(-1, y).locked(false).foreColor("#2a06ecd9");
        }
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
          if (rowItem["Code"] == null) {
            cell.backColor("#A0CFFF");
            cell.foreColor("black");
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
        function (e, args) {}
      );
      this.spread[remarkTb].bind(GCsheets.Events.EditEnded, function (e, args) {
        // 自动计算数量

        _this.computedNum(args.row, args.col, args.editingText);
        // for (var i = args.col + 1; i < _this.tableColumns[0].length; i++) {
        //   sheet.setArray(args.row, i, [2021]);
        // }
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
        var arr = sheet.getDirtyRows();
        var arr2 = sheet.getInsertRows();
        console.log(arr, arr2);
        // sheet.clearPendingChanges();
      });
      this.spread[remarkTb].resumePaint();
      this.adminLoading = false;
      this.tableLoading[remarkTb] = false;
      this.spread[remarkTb].refresh(); //重新定位宽高度
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
    // 选择数据
    selectFun(data, remarkTb, row) {
      this.selectionData[remarkTb] = data;
    },
    // 改变状态
    changeStatus(item, index) {
      this.labelStatus1 = index;
      let changeColumns = [[]];
      if (index === 0) {
        changeColumns[0] = this.Columns[0].filter(
          (item) =>
            item["label"] !== "预计生产日期" &&
            item["label"] !== "线体" &&
            item["label"] !== "标准人员" &&
            item["label"] !== "每托数量" &&
            item["label"] !== "托板数"
        );
        this.$set(this.tableColumns, 0, changeColumns[0]);
        this.labelStatus2 = 0;
        this.setData(0);
      } else if (index === 1) {
        changeColumns[0] = this.Columns[0].filter(
          (item) =>
            item["label"] !== "标准人员" &&
            item["label"] !== "每托数量" &&
            item["label"] !== "托板数"
        );
        this.$set(this.tableColumns, 0, changeColumns[0]);
        this.labelStatus2 = 0;
        this.setData(0);
      } else if (index === 2) {
        changeColumns[0] = this.Columns[0].filter(
          (item) => item["label"] !== "标准人员"
        );
        this.$set(this.tableColumns, 0, changeColumns[0]);
        this.labelStatus2 = 0;
        this.setData(0);
      } else if (index === 3) {
        this.labelStatus2 = 3;
        this.dataSearch(3);
      } else if (index === 4) {
        changeColumns[0] = this.Columns[0];
        this.$set(this.tableColumns, 0, changeColumns[0]);
        this.labelStatus2 = 0;
        this.setData(0);
      } else if (index === 5) {
        this.labelStatus2 = 5;
        this.dataSearch(5);
      }
    },
    // 拆单
    // splitOrder(remarkTb) {
    //   if (this.selectionData[remarkTb].length === 0) {
    //     this.$message.error("请选择需要拆单的数据！");
    //     return;
    //   }
    //   this.Dialog = true;
    //   let targetArray = JSON.parse(
    //     JSON.stringify(this.selectionData[remarkTb])
    //   );
    //   let targetColumns = JSON.parse(
    //     JSON.stringify(this.tableColumns[remarkTb])
    //   );

    //   targetColumns = targetColumns.filter(
    //     (item) =>
    //       item.label == "生产订单" ||
    //       item.label == "分配数" ||
    //       item.label == "计划数"
    //   );
    //   targetColumns.push({
    //     label: "拆单数量",
    //     prop: "SQty",
    //   });
    //   targetColumns.map((item) => {
    //     item["width"] = 250;
    //     if (item.label === "拆单数量") {
    //       item["isEdit"] = true;
    //     } else {
    //       item["isEdit"] = false;
    //     }
    //   });
    //   this.$set(this.tableColumns, 6, targetColumns);
    //   this.$nextTick(() => {
    //     this.$set(this.tableData, 6, targetArray);
    //     this.setData(6);
    //   });
    // },
    // // 拆单
    // async changeEvent(val) {
    //   if (val === 1) {
    //     const errorNum1 = this.selectionData[6].findIndex(
    //       (item) => !item["SQty"]
    //     );
    //     if (errorNum1 !== -1) {
    //       this.$message.error(`第${errorNum1 + 1}行数据的拆分数量没有填写`);
    //       return;
    //     }

    //     const errorNum2 = this.selectionData[6].findIndex((item) => {
    //       return item["SQty"] > item["PlanQty"];
    //     });
    //     if (errorNum2 !== -1) {
    //       this.$message.error(`第${errorNum2 + 1}行数据的拆分数量超出可填范围`);
    //       return;
    //     }
    //     this.Dialog = false;
    //     let sheet = this.spread[this.labelStatus2].getActiveSheet();
    //     const changedIndices = [];
    //     this.tableData[this.labelStatus2].forEach((element, index) => {
    //       if (element["isChecked"]) {
    //         changedIndices.push(index);
    //       }
    //     });
    //     //每增加一行，需要插入新的一行，后面一行比前面一行多1
    //     const arr = changedIndices.map((num, index) => num + index);
    //     //处理脏数据
    //     arr.forEach((item) => {
    //       this.copyRowFormat(item, sheet);
    //       console.log(item, "item");
    //     });

    //     this.$nextTick(() => {
    //       sheet.setDataSource(sheet.getDataSource()); // 更新数据源
    //       sheet.repaint();
    //     });
    //     await this.dataSave(this.labelStatus2);
    //   }
    // },
    // //在该行数据下面增加新的一行
    // copyRowFormat(rowNumber, sheet) {
    //   sheet.addRows(rowNumber + 1, 1);
    //   sheet.copyTo(
    //     rowNumber,
    //     -1,
    //     rowNumber + 1,
    //     -1,
    //     1,
    //     -1,
    //     GC.Spread.Sheets.CopyToOptions.all
    //   );
    //   let newRowIndex = rowNumber + 1;
    //   let oldData = sheet.getDataSource()[rowNumber]; // 获取数据源中旧行的值
    //   // newData = JSON.parse(JSON.stringify(oldData));
    //   this.tableData[this.labelStatus2][newRowIndex] = JSON.parse(
    //     JSON.stringify(oldData)
    //   );
    //   let newData = this.tableData[this.labelStatus2][newRowIndex]; // 获取数据源中新行的值
    //   let SQtyObj = this.selectionData[6].find(
    //     (item) => item["RowNumber"] === oldData["RowNumber"]
    //   );
    //   //去掉dy前面的值
    //   const objKeys = Object.keys(newData);
    //   objKeys.forEach((key) => {
    //     if (key.endsWith("dy")) {
    //       newData[key.replace(/dy$/, "")] = null;
    //     }
    //   });
    //   oldData["PlanQty"] = oldData["PlanQty"] - SQtyObj["SQty"];
    //   newData["SourceElectronicMainPlanID"] = oldData["ElectronicMainPlanID"]; // 将 SourceDetailPlanID 值设置为 null
    //   newData["ElectronicMainPlanID"] = null; // 将 SalesOrderDetailPlanID 值设置为 null
    //   newData["PlanQty"] = SQtyObj["SQty"];
    //   newData["DataSource"] = "拆单";
    // },
    // 新增排程
    // addSchedule() {
    //   this.dataSearch(7);
    //   this.newDataDialog = true;
    // },
    // 确定添加这些排程进来
    // async sureAddNewData() {
    //   // 不确定是否加进来就保存在数据库，怕其他按钮操作执行查询白添加了
    //   if (this.selectionData[7].length == 0) {
    //     this.$message.error("未选择数据！");
    //     this.newDataDialog = true;
    //   } else {
    //     this.selectionData[7].forEach((m) => {
    //       m.dicID = 10130;
    //       m["ElectronicMainPlanID"] = null;
    //       m["PlanQty"] = m["Qty"];
    //       m["DataSource"] = "手工";
    //     });
    //     _this.adminLoading = true;
    //     let res = await GetSearch(
    //       this.selectionData[7],
    //       `/APSAPI/SaveData10130`
    //     );
    //     const { result, msg } = res.data;

    //     if (result) {
    //       this.adminLoading = false;
    //       this.dataSearch(0);
    //       this.selectionData[7] = [];
    //       this.$message({
    //         message: msg,
    //         type: "success",
    //         dangerouslyUseHTMLString: true,
    //       });
    //     } else {
    //       this.adminLoading = false;
    //       this.$message({
    //         message: msg,
    //         type: "error",
    //         dangerouslyUseHTMLString: true,
    //         duration: 8000,
    //       });
    //     }
    //     this.newDataDialog = false;
    //   }
    // },
  },
};
</script>
