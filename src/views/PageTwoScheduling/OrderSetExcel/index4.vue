<!--菜单设置-->
<template>
  <div class="container" v-loading="adminLoading">
    <div class="admin_head" ref="headRef">
      <div>
        <ComSearch
          ref="searchRef"
          :searchData="formSearchs[0].datas"
          :searchForm="formSearchs[0].forms"
          :remark="0"
          :isLoading="isLoading"
          :btnForm="btnForm"
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
        <div>
          <ComVxeTable
            :rowKey="'RowNumber'"
            :height="height"
            :tableData="tableData[0]"
            :tableHeader="tableColumns[0]"
            :tableLoading="tableLoading[0]"
            :remark="0"
            :hasSelect="true"
            :sysID="sysID[0].ID"
            :isEdit="isEdit"
            :isClear="isClear[0]"
            :showPagination="false"
            :pagination="tablePagination[0]"
            @pageChange="pageChange"
            @pageSize="pageSize"
            @sortChange="sortChange"
            @selectfun="selectFun"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
var _this;
// import "@grapecity/spread-sheets-vue";
// import GC from "@grapecity/spread-sheets";
// import "@grapecity/spread-sheets/styles/gc.spread.sheets.excel2013white.css";
// import "@grapecity/spread-sheets/js/zh.js";
// GC.Spread.Common.CultureManager.culture("zh-cn");
// import {
//   HeaderCheckBoxCellType
// } from "@/static/data.js";
// const GCsheets = GC.Spread.Sheets;
import ComSearch from "@/components/ComSearch";
import ComAsideTree from "@/components/ComAsideTree";
import ComVxeTable from "@/components/ComVxeTable";
import {
  GetHeader,
  GetSearchData,
  ExportData,
  SaveData,
  GetOrgData,
} from "@/api/Common";
import { MOPlanStep1, MOPlanStep1Calculation } from "@/api/wjApi";
export default {
  name: "index4",
  components: {
    ComSearch,
    ComVxeTable,
    ComAsideTree,
  },
  data() {
    return {
      labelStatus1: 0,
      Status1: [
        { label: "全部", value: 0 },
        { label: "未分线", value: 1 },
        { label: "已分线", value: 1 },
        { label: "不齐套", value: 1 },
        { label: "齐套", value: 1 },
        { label: "已下达", value: 1 },
      ],
      sysID: [{ ID: 6736 }, { ID: 6735 }],
      //////////////左侧树节点//////////////
      clickData: {},
      treeProps: {
        label: "OrganizeName",
        children: "children",
      },
      treeListTmp: [],
      treeData: [],
      autoGenerateColumns: true,
      spread: null,
      ////////////////// Search /////////////////
      title: this.$route.meta.title,
      drawer: false,
      delData: [[]],
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
          BtnName: "下达至预排",
          isLoading: false,
          Methods: "setOrderToDay",
          Type: "success",
          Icon: "",
          Size: "small",
          Params: "3",
        },
        {
          ButtonCode: "save",
          BtnName: "下达至分配拉线",
          isLoading: false,
          Methods: "setOrderToDay",
          Type: "success",
          Icon: "",
          Size: "small",
          Params: "2",
        },
        {
          ButtonCode: "save",
          BtnName: "下达至日计划",
          isLoading: false,
          Methods: "setOrderToDay",
          Type: "success",
          Icon: "",
          Size: "small",
          Params: "1",
        },

        {
          ButtonCode: "save",
          BtnName: "匹配产线",
          isLoading: false,
          Methods: "autoLine",
          Type: "primary",
          Icon: "",
          Size: "small",
        },
        {
          ButtonCode: "save",
          BtnName: "配套计算",
          isLoading: false,
          Methods: "autoComputed",
          Type: "warning",
          Icon: "",
          Size: "small",
        },
        {
          ButtonCode: "save",
          BtnName: "更新计划",
          isLoading: false,
          Methods: "autoDayPlan",
          Type: "success",
          Icon: "",
          Size: "small",
        },
        {
          ButtonCode: "save",
          BtnName: "退回",
          isLoading: false,
          Methods: "autoBack",
          Type: "danger",
          Icon: "",
          Size: "small",
        },
        /*
        /*
         {

          ButtonCode: "save",
          BtnName: "下达至周计划",
          isLoading: false,
          Methods: "setOrderToDay",
          Type: "success",
          Icon: "",
          Size: "small",
          Params: "0",
        },
*/
        // {
        //   ButtonCode: "save",
        //   BtnName: "计算完工期",
        //   isLoading: false,
        //   Methods: "computedOrderToDay",
        //   Type: "primary",
        //   Icon: "",
        //   Size: "small",
        // },
      ],
      // parmsBtn: [
      //   {
      //     ButtonCode: "save",
      //     BtnName: "保存",
      //     isLoading: false,
      //     Methods: "dataSave",
      //     Type: "success",
      //     Icon: "",
      //     Size: "small",
      //   },
      //   {
      //     ButtonCode: "delete",
      //     BtnName: "删除",
      //     isLoading: false,
      //     Methods: "dataDel",
      //     Type: "danger",
      //     Icon: "",
      //     Size: "small",
      //     Params: { dataName: "delData" },
      //   },
      // ],
      tableData: [[], []],
      tableColumns: [[], []],
      tableLoading: [false, false],
      isClear: [false, false],
      tablePagination: [
        { pageIndex: 1, pageSize: 0, pageTotal: 0 },
        { pageIndex: 1, pageSize: 500, pageTotal: 0 },
      ],
      height: "707px",
      treeHeight: "765px",
      showPagination: true,
      tagRemark: 0,
      isLoading: false,
      isEdit: false,
      spread: null,
      adminLoading: false,
      categorys: [],
      lines: [],
      checkBoxCellTypeCategory: null,
      checkBoxCellTypeLine: null,
      tag: 0,
      selectionData: [[], []],
      userInfo: {},
    };
  },
  watch: {},
  created() {
    _this = this;
    this.adminLoading = true;
    this.userInfo = this.$store.getters.userInfo;
    this.judgeBtn();

    this.getTableHeader();
  },
  mounted() {
    setTimeout(() => {
      this.setHeight();
    }, 300);
  },
  methods: {
    changenoworkhours(item, value, prop, index, a, b) {
      if (this.NoWorkHour.findIndex((m) => m.OrderID == item.OrderID) === -1) {
        this.NoWorkHour.push(item);
      }
    },
    changeline(item, value, prop, index, a, b) {
      item.拉线.forEach((m) => {
        if (item.LineID === m.OrganizeID) {
          let tmp = m;
          if (
            this.LineViewSort.findIndex(
              (m2) => m2.OrganizeID === m.OrganizeID
            ) == -1
          ) {
            this.LineViewSort.push(tmp);
          } else {
            tmp =
              this.LineViewSort[
                this.LineViewSort.findIndex(
                  (m2) => m2.OrganizeID === m.OrganizeID
                )
              ];
          }
          item.ViewSort = tmp.ViewSort;
          tmp.ViewSort = tmp.ViewSort + 1;
        }
      });
    },
    // 获取工艺数据
    async getCategoryData() {
      let res = await GetSearchData({ dicID: 1175 });
      const { data, forms, result, msg } = res.data;
      if (result) {
        let newData = [];
        if (data.length != 0) {
          data.forEach((x) => {
            newData.push({ text: x.ProcessGroupName, value: x.ProcessGroupID });
          });
        }
        this.categorys = newData;
        this.checkBoxCellTypeCategory = new GCsheets.CellTypes.ComboBox();
        this.checkBoxCellTypeCategory.items(this.categorys);
        this.checkBoxCellTypeCategory.editorValueType(
          GC.Spread.Sheets.CellTypes.EditorValueType.value
        );
        this.checkBoxCellTypeCategory.itemHeight(24);
        this.getOrgData();
      } else {
        this.adminLoading = false;
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
    },
    async getLineData() {
      this.lines = [];
      // this.getCategoryData();
      let res = await GetSearchData({
        dicID: 36,
        OrganizeTypeID: 6,
        OrganizeIDs: this.userInfo.OrganizeID,
        Status: 1,
      });
      const { data, forms, result, msg } = res.data;

      if (result) {
        let newData = [];
        if (data.length != 0) {
          data.forEach((x) => {
            newData.push({
              text: x.OrganizeName,
              value: x.OrganizeID,
              LineID: x.OrganizeID,
            });
          });
        }
        this.lines = newData;
        this.checkBoxCellTypeLine = new GCsheets.CellTypes.ComboBox();
        this.checkBoxCellTypeLine.items(newData);
        this.checkBoxCellTypeLine.itemHeight(24);
        this.checkBoxCellTypeLine.editorValueType(
          GC.Spread.Sheets.CellTypes.EditorValueType.value
        );
        this.getTableData(this.formSearchs[0].datas, 0);
      } else {
        this.adminLoading = false;
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
    },
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
      // this.getTableData(this.formSearchs[remarkTb].datas, remarkTb);
      // return;
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
    async dataSave(remarkTb, index, parms, newData) {
      let res = null;

      if (newData && newData.length != 0) {
        res = await SaveData(newData);
      } else {
        res = await SaveData(this.tableData[remarkTb]);
      }
      const { datas, forms, result, msg } = res.data;
      if (result) {
        this.$message({
          message: msg,
          type: "success",
          dangerouslyUseHTMLString: true,
        });
        this.dataSearch(remarkTb);
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
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
          //  this.formSearchs[0].datas["ControlID"] = "202";
          this.dataSearch(0);
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
      let res = await GetSearchData(form);
      const { result, data, count, msg } = res.data;
      this.adminLoading = false;
      if (result) {
        this.$set(this.tableData, remarkTb, data);
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
    setData() {
      this.spread.suspendPaint();
      let sheet = this.spread.getActiveSheet();
      sheet.options.allowCellOverflow = true;
      sheet.defaults.rowHeight = 23;
      sheet.defaults.colHeaderRowHeight = 23;
      let colHeader1 = [""];
      let colInfos = [];

      this.tableColumns[0].forEach((x) => {
        if (x.prop == "ProcessGroupID") {
          colInfos.push({
            name: x.prop,
            displayName: "工艺",
            cellType: this.checkBoxCellTypeCategory,
          });
        } else if (x.prop == "LineID") {
          colInfos.push({
            name: x.prop,
            displayName: "线别",
            cellType: this.checkBoxCellTypeLine,
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

      // 选框
      let checkbox = {
        name: "isChecked",
        displayName: "isChecked",
        cellType: new GC.Spread.Sheets.CellTypes.CheckBox(),
        size: 60,
      };
      colInfos.unshift(checkbox);

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

      // var defaultStyle = new GC.Spread.Sheets.Style();
      // defaultStyle.name = "style1";
      // defaultStyle.foreColor = "#151515";
      // defaultStyle.font = "10.5px sans-serif";
      // defaultStyle.hAlign = GC.Spread.Sheets.HorizontalAlign.center;
      // defaultStyle.borderLeft = new GC.Spread.Sheets.LineBorder(
      //   "1px solid #ccc",
      //   GC.Spread.Sheets.LineStyle.small
      // );
      // defaultStyle.borderTop = new GC.Spread.Sheets.LineBorder(
      //   "1px solid #ccc",
      //   GC.Spread.Sheets.LineStyle.small
      // );
      // defaultStyle.borderRight = new GC.Spread.Sheets.LineBorder(
      //   "1px solid transparent",
      //   GC.Spread.Sheets.LineStyle.small
      // );
      // defaultStyle.borderBottom = new GC.Spread.Sheets.LineBorder(
      //   "1px solid transparent",
      //   GC.Spread.Sheets.LineStyle.small
      // );
      // sheet.setDefaultStyle(defaultStyle, GC.Spread.Sheets.SheetArea.viewport);
      // for (var i = 0; i < this.tableData[0].length; i++) {
      //   for (var j = 0; j < this.tableColumns[0].length; j++) {
      //     sheet.getCell.FontStyle('italic bold 10.5px Georgia');
      //     sheet.setStyle(
      //       i,
      //       j,
      //       sheet.getNamedStyle("style1"),
      //       GC.Spread.Sheets.SheetArea.viewport
      //     );
      //   }
      // }

      // sheet.setRowCount(5, GC.Spread.Sheets.SheetArea.viewport);
      // sheet.setColumnCount(5, GC.Spread.Sheets.SheetArea.viewport);
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
      defaultStyle.showEllipsis = true;
      sheet.setDefaultStyle(defaultStyle, GC.Spread.Sheets.SheetArea.viewport);

      // 冻结第一列
      sheet.frozenColumnCount(1);
      sheet.setDataSource(this.tableData[0]);
      sheet.bindColumns(colInfos);
      this.spread.options.tabStripVisible = false; //是否显示表单标签
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
      this.tableLoading[0] = false;
      // this.spread.isPaintSuspended(false);
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
    // 跳转至页面配置
    toPageSetting() {
      this.$router.push({
        name: "FieldInfo",
        params: { ID: this.sysID[0].ID },
      });
    },
    searchTree(msg) {
      this.treeData = [];
      let treeListTmp = JSON.parse(JSON.stringify(this.treeListTmp));
      let tmp = msg
        ? this.rebuildData(msg, treeListTmp)
        : JSON.parse(JSON.stringify(treeListTmp));
      this.treeData.push(...tmp);
    },
    rebuildData(value, arr) {
      if (!arr) {
        return [];
      }
      let newarr = [];
      if (Object.prototype.toString.call(arr) === "[object Array]") {
        arr.forEach((element) => {
          if (element.OrganizeName.indexOf(value) > -1) {
            // const ab = this.rebuildData(value, element.children);
            const obj = {
              ...element,
              children: element.children,
            };
            newarr.push(obj);
          } else {
            if (element.children && element.children.length > 0) {
              const ab = this.rebuildData(value, element.children);
              const obj = {
                ...element,
                children: ab,
              };
              if (ab && ab.length > 0) {
                newarr.push(obj);
              }
            }
          }
        });
      }
      return newarr;
    },
    // 下达
    async setOrderToDay(remarkTb, index, MOSchedulingType) {
      let resultTag = this.getSelectionData(0);
      if (resultTag) {
        this.$message.error("工艺不能为空");
        return;
      }
      let submitData = this.selectionData[0];
      if (submitData.length == 0) {
        this.$message.error("请选择需要下达的数据！");
        return;
      }
      submitData.forEach((m) => {
        m["MOSchedulingType"] = MOSchedulingType;
      });
      this.adminLoading = true;
      let res = await MOPlanStep1(submitData);
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
    },
    // 计算完工期
    async computedOrderToDay() {
      if (this.selectionData[0].length == 0) {
        this.$message.error("请选择数据再计算完工期！");
        return;
      }
      this.adminLoading = true;
      let res = await MOPlanStep1Calculation(this.selectionData[0]);
      const { result, data, count, msg } = res.data;
      if (result) {
        let sheet = this.spread.getActiveSheet();
        this.adminLoading = false;
        if (data.length != 0) {
          data.forEach((a) => {
            let newIndex = -1;
            newIndex = this.tableData[0].findIndex(
              (x) => x.RowNumber == a.RowNumber
            );
            if (newIndex != -1) {
              for (let name in this.tableData[0][newIndex]) {
                this.$set(this.tableData[0][newIndex], name, a[name]);
              }
            }
          });
        }
        // if (data.length != 0) {
        //   data.some((x, i) => {
        //     for (var j = 0; j < this.tableColumns[0].length; j++) {
        //       let value = "";
        //       if (j == 0) {
        //         value = true;
        //         sheet.setArray(i.RowNumber, 0, [value]);
        //       } else {
        //         let prop = this.tableColumns[0][j].prop;
        //         value = x.prop;
        //         sheet.setArray(i.RowNumber, j, [value]);
        //       }
        //     }
        //   });
        // }

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
    // 获取选中的数据
    getSelectionData(tag) {
      let resultTag = false;
      if (this.selectionData[0].length != 0) {
        if (tag == 0) {
          this.selectionData[0].forEach((x) => {
            if (x.isChecked) {
              //不判断
              if (!x.ProcessGroupID) {
                resultTag = true;
              }
            }
          });
        } else {
        }
      } else {
        this.$message.error("请选择需要操作的数据！");
      }
      return resultTag;
    },
    // // 获取选中的数据
    // getSelectionData(tag) {
    //   let resultTag = false;
    //   let sheet = this.spread.getActiveSheet();
    //   let newData = sheet.getDataSource();
    //   this.selectionData[0] = [];
    //   if (newData.length != 0) {
    //     if (tag == 0) {
    //       newData.forEach((x) => {
    //         if (x.isChecked) {
    //           //不判断
    //           if (!x.ProcessGroupID) {
    //             resultTag = true;
    //           } else {
    //             this.selectionData[0].push(x);
    //           }
    //         }
    //       });
    //     } else {
    //       newData.forEach((x) => {
    //         if (x.isChecked) {
    //           this.selectionData[0].push(x);
    //         }
    //       });
    //     }
    //   }
    //   return resultTag;
    // },
    // 切换状态
    changeStatus(x, index) {
      this.labelStatus1 = index;
      this.dataSearch(0);
    },
    // 选择数据
    selectFun(data, remarkTb, row) {
      this.selectionData[remarkTb] = data;
    },
    // 匹配线
    autoLine() {},
    // 计算排期
    autoComputed() {},
    // 更新计划
    autoDayPlan() {},
    // 退回
    autoBack() {},
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
