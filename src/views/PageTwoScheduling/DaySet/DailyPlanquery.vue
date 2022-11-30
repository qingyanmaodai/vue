<!-- 日计划查询 -->
<template>
  <div class="container" v-loading="adminLoading">
    <div class="admin_head" ref="headRef">
      <ComSearch
        v-for="(item,i) in Status1"
        :key="i"
        v-show="labelStatus1 == i"
        ref="searchRef"
        :searchData="formSearchs[i].datas"
        :searchForm="formSearchs[i].forms"
        :remark="i"
        :isLoading="isLoading"
        :signName="labelStatus1"
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
        <div class="flex_row_spaceBtn pagination">
          <div>
            <span @click="toPageSetting(sysID[tagRemark].ID)" class="primaryColor cursor"
              >SysID:{{ sysID[tagRemark].ID }}
            </span>
          </div>
          <div class="flex">
            <el-pagination
              background
              @size-change="(val) => pageSize(val, 0)"
              :current-page="tablePagination[tagRemark].pageIndex"
              :page-sizes="[200, 500, 1000, 3000, 5000, 10000]"
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

    <!-- 弹框-->
    <DialogTable title="全局欠料" :tableDialog="colDialogVisible" :sysID="5165" width="80%" @closeDialog="colDialogVisible =false" :searchForm="dialogSearchForm" :isToolbar="false"></DialogTable>
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
import {
  GetHeader,
  GetSearchData,
  ExportData,
} from "@/api/Common";
import DialogTable from "@/components/Dialog/dialogTable";
export default {
  name: "DailyPlanquery",
  components: {
    ComSearch,
    DialogTable
  },
  data() {
    return {
      dialogSearchForm:{
        OrderID:'',
      },
      colDialogVisible:false,
      labelStatus1:0,
      Status1: [
        { label: "一部插件", value: 0 },
        { label: "一部SMT", value: 1 },
        { label: "二部", value: 2 },
        { label: "三部", value: 3 },
        { label: "四部", value: 4 },
        { label: "五部", value: 5 },
        { label: "七部", value: 6 },
      ],
      ////////////////// Search /////////////////
      title: this.$route.meta.title,
      formSearchs: [
        {
          datas: {DIsVisibleApp:1},
          forms: [],
        },
        {
          datas: {DIsVisibleApp:1},
          forms: [],
        },
        {
          datas: {DIsVisibleApp:1},
          forms: [],
        },
        {
          datas: {DIsVisibleApp:1},
          forms: [],
        },
        {
          datas: {DIsVisibleApp:1},
          forms: [],
        },
        {
          datas: {DIsVisibleApp:1},
          forms: [],
        },
        {
          datas: {DIsVisibleApp:1},
          forms: [],
        },
      ],
      btnForm: [],
      parmsBtn: [],
      tableData: [[],[],[],[],[],[],[],],
      tableColumns: [[],[],[],[],[],[],[]],
      tableLoading: [false,false,false,false,false,false,false],
      isClear: [false,false,false,false,false,false,false],
      tablePagination: [
        { pageIndex: 1, pageSize: 3000, pageTotal: 0 },
        { pageIndex: 1, pageSize: 3000, pageTotal: 0 },
        { pageIndex: 1, pageSize: 3000, pageTotal: 0 },
        { pageIndex: 1, pageSize: 3000, pageTotal: 0 },
        { pageIndex: 1, pageSize: 3000, pageTotal: 0 },
        { pageIndex: 1, pageSize: 3000, pageTotal: 0 },
        { pageIndex: 1, pageSize: 3000, pageTotal: 0 }
      ],
      height: "707px",
      tagRemark: 0,
      isLoading: false,
      isEdit: false,
      sysID: [{ ID: 7945 }, { ID: 7946 }, { ID: 7956 }, { ID: 7957 }, { ID: 6734 }, { ID: 7955 }, { ID: 7954 }],
      spread: null,
      adminLoading: false,
      checkBoxCellTypeLine: "",
      selectionData: [[],[],[],[],[],[],[]],
    };
  },
  created() {
    _this = this;
    this.adminLoading = true;
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
      let IDs = this.sysID;
      let res = await GetHeader(IDs);
      const { datas, forms, result, msg } = res.data;
      if (result) {
        // 获取每个表头
        datas.some((m, i) => {
          // 因为此表ID跟日计划ID一致，需要额外做显示隐藏列，现通过APP可见参数“IsVisibleApp”控制，过滤掉没选择APP可见的
          m.forEach((x,y)=>{
            //特殊处理，因为这个页面用的是各部的日计划ID，但此页面需要隐藏一些列时再通过“IsVisibleApp”过滤，配置表中没有类似日期的会x.IsVisibleApp==null，所以需要默认显示
            if(x.IsVisibleApp==null||x.IsVisibleApp){
              this.$set(this.tableColumns[i], y, x);
            }
          })
          
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
        this.getTableData(this.formSearchs[this.tagRemark].datas, this.tagRemark);
        // this.getLineData(this.userInfo.WorkFlowInstanceID);
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
      // form["ControlID"] = this.userInfo.WorkFlowInstanceID;
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
      sheet.reset();
      let colInfos = [];
      this.tableColumns[this.tagRemark] = this.tableColumns[this.tagRemark].filter(x=>{
        return x.prop!='isChecked'
      })
      this.tableColumns[this.tagRemark].forEach((x,colIndex) => {
        if (x.prop == "LineID") {
          let checkBoxCellTypeLine = new GCsheets.CellTypes.ComboBox();
        checkBoxCellTypeLine.editorValueType(
          GC.Spread.Sheets.CellTypes.EditorValueType.value
        );
        checkBoxCellTypeLine.items(x.items);
        checkBoxCellTypeLine.itemHeight(24);
          colInfos.push({
            name: x.prop,
            displayName: "线别",
            cellType: checkBoxCellTypeLine,
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
      
      this.tableColumns[this.tagRemark].forEach((m,colIndex) => {
        // 参数1，row
        // 参数3，col
        // 参数2，rowCount
        // 参数4，colCount
        // 自动向上合并相同文本内容
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
      if(this.tableColumns[this.tagRemark].length){
        sheet.frozenColumnCount(this.tableColumns[this.tagRemark][1].FixCount);
      }
    // debugger
    this.tableData[this.tagRemark].forEach((row, index) => {
      let cellIndex = 0;
        this.tableColumns[0].forEach((m) => {
          //行，start,end
          if (m.DataType == "bit" && m.isEdit) {
            var cellType = new GC.Spread.Sheets.CellTypes.CheckBox();
            cellType.caption("");
            cellType.textTrue("");
            cellType.textFalse("");
            cellType.textIndeterminate("");
            cellType.textAlign(
              GC.Spread.Sheets.CellTypes.CheckBoxTextAlign.center
            );
            cellType.isThreeState(false);
            sheet.getCell(index, cellIndex).cellType(cellType);
          }
          cellIndex++;
        });
      });

      // 表格单击单元格弹框事件
      this.spread.bind(GCsheets.Events.CellClick, function (e, args) {
          if(_this.tableColumns[_this.tagRemark].length){
            _this.tableColumns[_this.tagRemark].map((item,index)=>{
              if(item.name ==="Q1"&&args.col===index){
                // 显示ERP供需平衡表
                _this.colDialogVisible =true
                _this.dialogSearchForm.OrderID = _this.tableData[_this.tagRemark][args.row].OrderID
                _this.dialogSearchForm.UnIssuedQty = 0 
              }
            })
          }
      });

      sheet.setDataSource(this.tableData[this.tagRemark]);
      sheet.bindColumns(colInfos);
      this.spread.options.tabStripVisible = false; //是否显示表单标签
      this.spread.refresh(); //重新定位宽高度
      
      this.spread.resumePaint();
      this.adminLoading = false;
      this.tableLoading[this.tagRemark] = false;
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
    toPageSetting(ID) {
      this.$router.push({
        name: "FieldInfo",
        params: { ID: ID },
      });
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
        
      } else {
        this.adminLoading = false;
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
    },
    changeStatus(item, index) {
      this.labelStatus1 = index;
      this.dataSearch(index)
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