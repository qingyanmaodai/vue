<!--销售计划-->
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
        :signName="labelStatus1"
        :isLoading="isLoading"
        :btnForm="btnForm"
        @btnClick="btnClick"
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
        <div
          class="flex_column"
          :style="{'height':height}"
        >
          <div class="spreadContainer"
            v-loading="tableLoading[labelStatus1===1?1:0]"
          >
            <gc-spread-sheets
              class="sample-spreadsheets"
              id="spreadsheets"
              @workbookInitialized="initSpread"
            >
              <gc-worksheet :colCount=49></gc-worksheet>
            </gc-spread-sheets>
          </div>
          <div class="flex_row_spaceBtn pagination">
            <div>
              <span
                  @click="toPageSetting(sysID[labelStatus1===1?1:0].ID)"
                  class="primaryColor cursor"
                  >SysID:{{ sysID[labelStatus1===1?1:0].ID }}
                </span>
            </div>
            <div class="flex">
              <el-pagination
                background
                @size-change="val=>pageSize(val,0)"
                :current-page="tablePagination[labelStatus1===1?1:0].pageIndex"
                :page-sizes="[
                200,
                500,
                1000,
                2000,
                3000,
                5000,
                10000

              ]"
                :page-size="tablePagination[labelStatus1===1?1:0].pageSize"
                :total="tablePagination[labelStatus1===1?1:0].pageTotal"
                @current-change="val=>pageChange(val,0)"
                layout="total, sizes, prev, pager, next,jumper"
              >
              </el-pagination>
            </div>
        </div>
        </div>
        
       
      </div>
    </div>
  </div>
</template>

<script>
var _this;
import "@grapecity/spread-sheets-vue";
import GC from "@grapecity/spread-sheets";
import "@grapecity/spread-sheets/styles/gc.spread.sheets.excel2013white.css";
import "@grapecity/spread-sheets/js/zh.js";
GC.Spread.Common.CultureManager.culture("zh-cn");
const GCsheets = GC.Spread.Sheets;
import { HeaderCheckBoxCellType } from "@/static/data.js";
import ComSearch from "@/components/ComSearch";
import ComAsideTree from "@/components/ComAsideTree";
import ComReportTable from "@/components/ComReportTable";
import {
  GetHeader,
  GetSearch,
  GetSearchData,
  ExportData,
  SaveData,
  GetOrgData,
} from "@/api/Common";
export default {
  name: "EditSalePlan",
  components: {
    ComSearch,
    ComReportTable,
    ComAsideTree,
  },
  data() {
    return {
      autoGenerateColumns: true,
      spread: null,
      ////////////////// Search /////////////////
      title: "订单列表",
      Status1: [
        { label: "全部", value: "" },
        { label: "PCB备料", value: 1 },
        { label: "待转入备料", value: "是" },
        { label: "已转入备料", value: "是" },
        { label: "未匹配MO", value: "否" },
      ],
      labelStatus1: 0,
      drawer: false,
      delData: [[],[]],
      formSearchs: [
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
          BtnName: "保存",
          isLoading: false,
          Methods: "dataSave",
          Type: "success",
          Icon: "",
          Size: "small",
        },
        {
          ButtonCode: "save",
          BtnName: "生成备料任务",
          isLoading: false,
          Methods: "readyTask",
          Type: "primary",
          Icon: "",
          signName: 1,
          Size: "small",
          Params: "1",
        },
         {
          ButtonCode: "save",
          BtnName: "生成备料任务",
          isLoading: false,
          Methods: "readyTask",
          Type: "primary",
          Icon: "",
          signName: 2,
          Size: "small",
          Params: "0",
        },
        // {
        //   ButtonCode: "delete",
        //   BtnName: "删除",
        //   isLoading: false,
        //   Methods: "dataDel",
        //   Type: "danger",
        //   Icon: "",
        //   Size: "small",
        //   Params: { dataName: "delData" },
        // },
      ],
      tableData: [[],[]],
      tableColumns: [[],[]],
      tableLoading: [false,false],
      isClear: [false,false],
      tablePagination: [
        { pageIndex: 1, pageSize: 2000, pageTotal: 0 },
        { pageIndex: 1, pageSize: 2000, pageTotal: 0 },
      ],
      height: "707px",
      treeHeight: "765px",
      showPagination: true,
      tagRemark: 0,
      isLoading: false,
      isEdit: false,
      sysID: [
        {ID:6676},
        {ID:5150}
      ],
      spread: null,
      adminLoading: false,
      categorys: [],
      lines: [],
      checkBoxCellTypeLine: null,
      tag: 0,
      selectionData: [],
    };
  },
  watch: {},
  created() {
    _this = this;
    this.adminLoading = true;
    this.judgeBtn();
    this.getTableHeader();
  },
  mounted() {
    setTimeout(() => {
      this.setHeight();
    }, 450);
  },
  methods: {
    initSpread: function (spread) {
      this.spread = spread;
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
    dataSearch(remarkTb) {
      // let sheet = this.spread.getActiveSheet();
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
    // 删除
    async dataDel(remarkTb, index, parms) {
      let res = null;
      let newData = [];
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
      this.$confirm("确定要删除的【" + newData.length + "】数据吗？")
        .then((_) => {
          _this.dataSave(remarkTb, index, null, newData);
        })
        .catch((_) => {});
    },
    // 单击行
    handleRowClick(row, remarkTb) {
      this.delData[remarkTb] = [];
      this.delData[remarkTb].push(row);
    },
    // 保存
    async dataSave(remarkTb, index) {
      let sheet = this.spread.getActiveSheet();
      let newData = sheet.getDirtyRows();
      let submitData = [];
      if (newData.length != 0) {
        for (var i = 0; i < newData.length; i++) {
          if (newData[i].item.RowNumber > 0) {
            submitData[i] = newData[i].item;
            // submitData[i].SN = newData[i].row;
          }
        }
      }
      this.adminLoading = true;
      let res = await SaveData(submitData);
      const { datas, forms, result, msg } = res.data;
      if (result) {
        this.$message({
          message: msg,
          type: "success",
          dangerouslyUseHTMLString: true,
        });
        this.adminLoading = false;
        this.dataSearch(remarkTb);
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
        this.adminLoading = false;
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
          this.getTableData(this.formSearchs[0].datas, 0);
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
      form["dicID"] = this.sysID[remarkTb].ID;
      let res = await GetSearchData(form);
      const { result, data, count, msg } = res.data;
      if (result) {
        this.$set(this.tableData, remarkTb, data);
        // if (data.length != 0) {
        //   data.forEach((x) => {
        //     delete x.isChecked;
        //   });
        // }
        this.setData();
        this.$set(this.tablePagination[remarkTb], "pageTotal", count);
      } else {
        this.adminLoading = false;
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
      this.$set(this.tableLoading, remarkTb, false);
    },
    // 渲染数据
    setData() {
      let sheet = this.spread.getActiveSheet();
      sheet.defaults.rowHeight = 23;
      sheet.defaults.colHeaderRowHeight = 23;
      let colInfos = [];
      let colHeader1 = [];
      if (this.labelStatus1 == 1||this.labelStatus1 == 2) {
        colHeader1.push("");
        // 选框
        let checkbox = {
          name: "isChecked",
          displayName: "isChecked",
          cellType: new GC.Spread.Sheets.CellTypes.CheckBox(),
          size: 60,
        };
        colInfos.unshift(checkbox);
        sheet.setCellType(
          0,
          0,
          new HeaderCheckBoxCellType(),
          GCsheets.SheetArea.colHeader
        );
      } else {
        // colHeader1.push("");
        
        // let checkbox = {
        //   name: this.tableData[0].prop,
        //   displayName: this.tableData[0].label,
        //   cellType: new GC.Spread.Sheets.CellTypes.Text(),
        //   size: 60,
        // };
        // colInfos.unshift(checkbox);
        // 解决其他表格复选框带入其他标签问题
        sheet.setCellType(
          0,
          0,
          '',
          GCsheets.SheetArea.colHeader
        );
      }
      let cellIndex = 0;
      this.tableColumns[0].forEach((x, i) => {
        if (i == 0) {
          colInfos.push({
            name: x.prop,
            displayName: x.label,
            cellType: new GC.Spread.Sheets.CellTypes.Text(),
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
      });
      
      sheet.setRowCount(1, GC.Spread.Sheets.SheetArea.colHeader);
      colHeader1.forEach(function (value, index) {
        
        sheet.setValue(0, index, value, GC.Spread.Sheets.SheetArea.colHeader);
      });

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
      //设置默认样式。
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

      // 冻结第一列
      sheet.frozenColumnCount(5);
      sheet.setDataSource(this.tableData[this.tagRemark]);
      sheet.bindColumns(colInfos);
      /////////////////表格事件/////////////
      this.spread.bind(GCsheets.Events.ButtonClicked, (e, args) => {
        const { sheet, row, col } = args;
        const cellType = sheet.getCellType(row, col);
        // if (cellType instanceof GCsheets.CellTypes.Button) {
        // }
        // if (cellType instanceof GCsheets.CellTypes.CheckBox) {
        // }
        // if (cellType instanceof GCsheets.CellTypes.HyperLink) {
        // }
      });
      //表格编辑事件
      this.spread.bind(GCsheets.Events.EditStarting, function (e, args) {});
      this.spread.bind(GCsheets.Events.EditEnded, function (e, args) {});
      this.spread.resumePaint();
      this.adminLoading = false;
      this.tableLoading[this.tagRemark] = false;
      this.spread.repaint();
      
      // this.spread.suspendPaint();
      // this.spread.isPaintSuspended(false);
    },
    // 跳转至页面配置
    toPageSetting(id) {
      this.$router.push({
        name: "FieldInfo",
        params: { ID: id },
      });
    },
    // 改变状态
    changeStatus(x, index) {
      this.labelStatus1 = index;
      this.formSearchs[0].datas["HasMo"] = x.value;
      if (index == 0) {
        this.formSearchs[0].datas["IsSetPrepare"] = "";
      } else if (index == 1) {
        this.formSearchs[1].datas["ProductionStatus"] = [21, 22, 23, 24, 26]
        this.formSearchs[1].datas["FirstPlanID"] = 0
        this.dataSearch(1);
        return
      } else if (index == 2) {
        this.formSearchs[0].datas["IsSetPrepare"] = ["未生成", "部分生成"];
        
      }else if(index == 3){
        this.formSearchs[0].datas["IsSetPrepare"] = ["已生成", "部分生成"];
      } else {
        this.formSearchs[0].datas["IsSetPrepare"] = "";
      }
      this.dataSearch(0);
    },
    // 备料任务
    async readyTask(remarkTb, index, MOSchedulingType) {
      let sheet = this.spread.getActiveSheet();
      let data = sheet.getDataSource();
      let submitData = [];
      let newSubmitData = [];
      if (data.length != 0) {
        data.forEach((x) => {
          if (x.isChecked) {
            submitData.push(x);
          }
        });
        // if (submitData.length != 0) {
        //   submitData.forEach((x) => {
        //     let mo = x.MOS.split(",");
        //     if (mo.length == 1) {
        //       let obj = JSON.parse(JSON.stringify(x));
        //       obj["OrderNo"] = mo[0];
        //       newSubmitData.push(obj);
        //     } else {
        //       mo.forEach((y) => {
        //         let obj = JSON.parse(JSON.stringify(x));
        //         obj["OrderNo"] = y;
        //         newSubmitData.push(obj);
        //       });
        //     }
        //   });
        // }
        if (submitData.length != 0) {
          this.adminLoading = true;
          let res = await GetSearch(submitData, "/APSAPI/SetPreParePlan");
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
        }else{
          this.$message.error("请选择需要操作的数据！");
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.spreadContainer {
  position: relative;
  overflow: hidden;
  height: 100%;
  border: 1px solid #ababab !important;
  flex: 1;
}

.sample-spreadsheets {
  width: 100%;
  height: 100%;
}
</style>