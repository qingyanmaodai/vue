<!-- 日计划查询 -->
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
        @btnClick="btnClick"
      />
    </div>
    <div>
      <div class="admin_content">
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
            <span @click="toPageSetting" class="primaryColor cursor"
              >SysID:{{ sysID }}
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
import { mapState } from "vuex";
import ComSearch from "@/components/ComSearch";
import ComReportTable from "@/components/ComReportTable";
import ComAsideTree from "@/components/ComAsideTree";
import {
  GetHeader,
  GetSearchData,
  ExportData,
} from "@/api/Common";
export default {
  name: "DailyPlanquery",
  components: {
    ComSearch,
    ComReportTable,
    ComAsideTree,
  },
  data() {
    return {
      //////////////左侧树节点//////////////
      LineName: "",
      OrganizeName: "",
      clickData: {},
      treeProps: {
        label: "OrganizeName",
        children: "children",
      },
      treeListTmp: [],
      treeListTmp2: [],
      treeData: [],
      treeData2: [],
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
      ],
      btnForm: [],
      parmsBtn: [],
      tableData: [[]],
      tableColumns: [[]],
      tableLoading: [false],
      isClear: [false],
      tablePagination: [{ pageIndex: 1, pageSize: 3000, pageTotal: 0 }],
      height: "707px",
      treeHeight: "765px",
      showPagination: true,
      tagRemark: 0,
      isLoading: false,
      isEdit: false,
      sysID: 7945,
      spread: null,
      adminLoading: false,
      checkBoxCellTypeLine: "",
      isOpen: true,
      selectionData: [[]],
      NoWorkHour: [],
      LineViewSort: [],
      spread: null,
      sheetSelectRows: [],
      sheetSelectObj: { start: 0, end: 0, count: 0 },
    };
  },
  created() {
    _this = this;
    this.adminLoading = true;
    let routeBtn = this.$route;
    console.log('routeBtn.meta',routeBtn.meta)
    this.sysID = parseInt(routeBtn.meta.dicID);
    this.judgeBtn();
    this.getTableHeader();
  },
  activated() {
    if (this.spread) {
      this.spread.refresh();
    }
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo,
    }),
  },
  mounted() {},
  //离开的时候保存当前
  beforeRouteLeave(to, form, next) {
 
 let dicForm = {
   dicData: this.formSearchs[0].datas,
   dicForm: this.formSearchs[0].forms,
     tablePagination:this.tablePagination
 };
 sessionStorage.setItem("dicIDForm" + this.sysID, JSON.stringify(dicForm));
 let dicIDData = {
   dicID: this.sysID,
   tableColumns: this.tableColumns[0],
   tableData: this.tableData[0],
 
 };
 sessionStorage.setItem("dicIDData" + this.sysID, JSON.stringify(dicIDData));
 next();
},

beforeRouteEnter(to, form, next) {
 next();
},
 
watch: {
 $route: {
   handler: function (val, oldVal) {
    console.log('val.query',val.query)
    //  this.sysID = parseInt(val.query.dicID);
   },
   // 深度观察监听
   deep: true,
 },
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
      let IDs = [{ ID: this.sysID }];
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
        });
        console.log("gettable");
        this.getOrgData();
        // this.dataSearch(0);
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
      form["dicID"] = this.sysID;
      form["ControlID"] = this.userInfo.WorkFlowInstanceID;
      let res = await GetSearchData(form);

      const { result, data, count, msg } = res.data;
      if (result) {
        this.$set(this.tableData, remarkTb, data);
        this.setData();
        this.$set(this.tablePagination[remarkTb], "pageTotal", count);
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
      this.$set(this.tableLoading, remarkTb, false);
      this.adminLoading = false;
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
      let colInfos = [];
      this.tableColumns[0] = this.tableColumns[0].filter(x=>{
        return x.prop!='isChecked'
      })
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
      });
      sheet.setRowCount(1, GC.Spread.Sheets.SheetArea.colHeader);
      // 参数1，row
      // 参数3，col
      // 参数2，rowCount
      // 参数4，colCount
      // 自动向上合并相同文本内容
      this.tableColumns[0].forEach((m,colIndex) => {
        if(m.prop === "LineID"){
            let range = new GC.Spread.Sheets.Range(-1, colIndex, -1,1 );
            sheet.autoMerge(range, GC.Spread.Sheets.AutoMerge.AutoMergeDirection.column);
        }else if(m.prop === "LineName"){
            let range = new GC.Spread.Sheets.Range(-1, colIndex, -1,1 );
            sheet.autoMerge(range, GC.Spread.Sheets.AutoMerge.AutoMergeDirection.column);
        }
      })

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

      sheet.frozenColumnCount(this.tableColumns[0][0].FixCount);

      sheet.setDataSource(this.tableData[0]);
      sheet.bindColumns(colInfos);
      this.spread.options.tabStripVisible = false; //是否显示表单标签
      
      this.spread.resumePaint();
      this.adminLoading = false;
      this.tableLoading[0] = false;
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
        params: { ID: this.sysID },
      });
    },
    //////////////////////////////
    async getOrgData() {
      this.getLineData(this.userInfo.WorkFlowInstanceID);
      return;
      this.treeListTmp = [];
      this.treeData = [];
      let form = {
        ERPOrderCode: this.userInfo.WorkFlowInstanceID,
        OrganizeTypeID: 5,
        dicID: 3026,
        Status: 1,
      };
      let res = await GetSearchData(form);
      const { result, data, count, msg } = res.data;
      if (result) {
        this.treeData = JSON.parse(JSON.stringify(data));
        this.treeListTmp = this.treeData;
        if (data.length != 0) {
          this.$nextTick(function () {
            _this.$refs.asideTreeRef.setCurrentKey(data[0].OrganizeID);
          });
          // this.$set(
          //   this.formSearchs[0].datas,
          //   "ControlID",
          //   data[0].ERPOrderCode
          // );
          this.getLineData(this.userInfo.WorkFlowInstanceID);
        }
      } else {
        this.adminLoading = false;
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
    },
    // 获取线别数据
    async getLineData(ERPOrderCode) {
      this.lines = [];
      let res = await GetSearchData({
        dicID: 36,
        OrganizeTypeID: 6,
        ERPOrderCode: ERPOrderCode,
      });
      const { data, forms, result, msg } = res.data;
      if (result) {
        let newData = [];
        this.treeData2 = data;
        this.treeListTmp2 = data;
        this.adminLoading = false;
        if (data.length != 0) {
          data.forEach((x) => {
            newData.push({ text: x.OrganizeName, value: x.OrganizeID });
          });
        }
        this.lines = newData;
        this.checkBoxCellTypeLine = new GCsheets.CellTypes.ComboBox();
        this.checkBoxCellTypeLine.editorValueType(
          GC.Spread.Sheets.CellTypes.EditorValueType.value
        );
        this.checkBoxCellTypeLine.items(newData);
        this.checkBoxCellTypeLine.itemHeight(24);
        //this.formSearchs[0].datas.ControlID="201";
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
    searchTree(msg, dataName, dataName2, valueName) {
      this[dataName] = [];
      let treeListTmp = JSON.parse(JSON.stringify(this[dataName2]));
      let tmp = msg
        ? this.rebuildData(msg, treeListTmp, valueName)
        : JSON.parse(JSON.stringify(treeListTmp));
      this[dataName].push(...tmp);
    },
    rebuildData(value, arr, valueName) {
      if (!arr) {
        return [];
      }
      let newarr = [];
      if (Object.prototype.toString.call(arr) === "[object Array]") {
        arr.forEach((element) => {
          if (element[valueName].indexOf(value) > -1) {
            // const ab = this.rebuildData(value, element.children);
            const obj = {
              ...element,
              children: element.children,
            };
            newarr.push(obj);
          } else {
            if (element.children && element.children.length > 0) {
              const ab = this.rebuildData(value, element.children, valueName);
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
    // 单击出来组织人员
    handleNodeClick(data, node) {
      this.clickData = data;
      // this.formSearchs[0].datas["ControlID"] = data.ERPOrderCode;
      //this.dataSearch(0);
      this.getLineData(data.OrganizeID);
    },
    // 单击出来线别
    handleNodeClick2(data, node) {
      this.$set(this.formSearchs[0].datas, "LineID", data.OrganizeID);
      this.dataSearch(0);
    },
    changeStatus(item, index) {
      this.labelStatus1 = index;
    },
    // 下拉选择事件
    handleCommand(val) {
      if (val == 1 && !this.isOpen) {
        this.isOpen = true;
        this.changeTreeNodeStatus(this.$refs.asideTreeRef.store.root);
      } else if (val == 2 && this.isOpen) {
        // 改变每个节点的状态
        this.isOpen = false;
        this.changeTreeNodeStatus(this.$refs.asideTreeRef.store.root);
      }
    },
    // 改变节点状态
    changeTreeNodeStatus(node) {
      node.expanded = this.isOpen;
      for (let i = 0; i < node.childNodes.length; i++) {
        // 改变节点的自身expanded状态
        node.childNodes[i].expanded = this.isOpen;
        // 遍历子节点
        if (node.childNodes[i].childNodes.length > 0) {
          this.changeTreeNodeStatus(node.childNodes[i]);
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
  flex: 1;
  border: 1px solid #ababab;
}

.sample-spreadsheets {
  width: 100%;
  height: 100%;
}
</style>