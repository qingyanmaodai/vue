<!--菜单设置-->
<template>
  <div
    class="container flex_flex"
    v-loading="adminLoading"
  >
    <div class="admin_left">
      <div class="admin_left">
        <div>
          <div class="flex px-2 py-1.5 border-b-1 tree_Head">
            <span class="tree_text">车间信息</span>
            <div class="flex_flex_end flex-1">
              <el-input
                size="mini"
                clearable
                v-model="OrganizeName"
                placeholder="搜索"
                suffix-icon="el-icon-search"
                class="w2/3 cx_margin_right1"
                @input="
                  searchTree(
                    OrganizeName,
                    'treeData',
                    'treeListTmp',
                    'OrganizeName'
                  )
                "
              ></el-input>
              <el-dropdown
                @command="handleCommand"
                class="flex_inline"
              >
                <img src="../../../assets/svg/dot.svg" />
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="1">展开全部</el-dropdown-item>
                  <el-dropdown-item command="2">折叠全部</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
          <el-tree
            class="tree-line asideTree2"
            :indent="0"
            ref="asideTreeRef"
            node-key="OrganizeID"
            :default-expand-all="isOpen"
            :data="treeData"
            :props="treeProps"
            highlight-current
            :expand-on-click-node="true"
            @node-click="handleNodeClick"
          ></el-tree>
        </div>

        <div>
          <div class="flex px-2 py-1.5 border-b-1 tree_Head">
            <span class="tree_text">线别信息</span>
            <div class="flex_flex_end flex-1">
              <el-input
                size="mini"
                clearable
                v-model="LineName"
                placeholder="搜索"
                suffix-icon="el-icon-search"
                class="w2/3 cx_margin_right1"
                @input="
                  searchTree(
                    LineName,
                    'treeData2',
                    'treeListTmp2',
                    'OrganizeName'
                  )
                "
              ></el-input>
              <el-dropdown class="flex_inline">
                <img src="../../../assets/svg/dot.svg" />
                <el-dropdown-menu slot="dropdown"> </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
          <el-tree
            class="tree-line"
            :indent="0"
            ref="asideTreeRef_two"
            node-key="OrganizeID"
            default-expand-all
            :data="treeData2"
            :props="treeProps"
            style="height: 300px; overflow: auto"
            highlight-current
            :expand-on-click-node="false"
            @node-click="handleNodeClick2"
          ></el-tree>
        </div>
      </div>
    </div>
    <div class="admin_container">
      <div
        class="admin_head"
        ref="headRef"
      >
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
          <div class="ant-table-title">
            <el-row>
              <el-col :span="4"><span class="title">{{ title }}</span></el-col>
              <el-col
                :span="20"
                class="flex_flex_end"
              > </el-col>
            </el-row>
          </div>
          <div
            class="flex_column"
            :style="{ height: height }"
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
          <div class="flex_row_spaceBtn pagination">
            <div>
              <span
                @click="toPageSetting"
                class="primaryColor cursor"
              >SysID:{{sysID}}
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

    <el-dialog
      title="更改线别"
      :visible.sync="LineDialog"
      :close-on-click-modal="false"
      width="30%"
    >
      <span>
        <el-select
          value-key="LineID"
          v-model="selectLineValue"
        >
          <el-option
            v-for="(x,y) in lineOptions"
            :label="x.OrganizeName"
            :value="x"
            :key="y"
          >
          </el-option>
        </el-select>
      </span>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type=""
          @click="LineDialog = false"
          size="small"
        >取 消</el-button>
        <el-button
          type="primary"
          @click="sureChangeLineData"
          size="small"
        >确 定</el-button>
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
import { mapState } from "vuex";
GC.Spread.Common.CultureManager.culture("zh-cn");
import ComSearch from "@/components/ComSearch";
import ComReportTable from "@/components/ComReportTable";
import ComAsideTree from "@/components/ComAsideTree";
import { SaveMOPlanStep4 } from "@/api/PageTwoScheduling";
import {
  HighlightColumnItemsCellType,
  TopItemsCellType,
  HeaderCheckBoxCellType,
  SortHyperlinkCellType,
  HighlightRowItemsCellType,
} from "../../../static/data.js";
import {
  GetHeader,
  GetSearchData,
  ExportData,
  SaveData,
  GetOrgData,
  GetSearch,
} from "@/api/Common";
export default {
  name: "DayPlanV2",
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
      parmsBtn: [
        {
          ButtonCode: "save",
          BtnName: "保存",
          isLoading: false,
          Methods: "dataSaveDay",
          Type: "success",
          Icon: "",
          Size: "small",
        },
        {
          ButtonCode: "save",
          BtnName: "批量改线",
          isLoading: false,
          Methods: "dataChange",
          Type: "warning",
          Icon: "",
          Size: "small",
          Params: { dataName: "selectionData" },
        },
        {
          ButtonCode: "delete",
          BtnName: "删除",
          isLoading: false,
          Methods: "dataDel",
          Type: "danger",
          Icon: "",
          Size: "small",
          Params: { dataName: "selectionData" },
        },
      ],
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
      sysID: 6734,
      spread: null,
      adminLoading: false,
      checkBoxCellTypeLine: "",
      isOpen: true,
      selectionData: [[]],
      selectLineValue: null,
      LineDialog: false,
      lineOptions: [],
    };
  },
  watch: {},
  created() {
    _this = this;
    this.adminLoading = true;
    this.judgeBtn();
    this.getTableHeader();
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo,
    }),
  },
  mounted() {
    setTimeout(() => {
      this.setHeight();
    }, 300);
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
    // 删除
    async dataDel(remarkTb, index, parms) {
      let res = null;
      this.getSelectionData();
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
    // 批量改线
    dataChange() {
      this.getSelectionData();
      if (this.selectionData[0].length == 0) {
        this.$message.error("请选择需要改线的数据！");
      } else {
        this.LineDialog = true;
        this.selectLineValue = null;
      }
    },
    // 获取选中的数据
    getSelectionData() {
      let sheet = this.spread.getActiveSheet();
      let newData = sheet.getDataSource();
      this.selectionData[0] = [];
      if (newData && newData.length != 0) {
        newData.forEach((x) => {
          if (x.isChecked) {
            this.selectionData[0].push(x);
          }
        });
      }
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
        this.getOrgData();
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
    },
    // 渲染数据
    setData() {
      this.spread.suspendPaint();
      let sheet = this.spread.getActiveSheet();
      sheet.defaults.rowHeight = 23;
      sheet.defaults.colHeaderRowHeight = 23;
      let colHeader1 = [];
      let colInfos = [];
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
      });
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

      sheet.setDataSource(this.tableData[0]);
      sheet.bindColumns(colInfos);

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
         // cell.backColor("#c5ffc1");
        } else {
          //   var cell = sheet.getCell(
          //     -1,
          //     cellIndex,
          //     GC.Spread.Sheets.SheetArea.viewport
          //   );
          //   cell.foreColor("#");
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
        _this.computedNum(args.row, args.col, args.editingText);
        // for (var i = args.col + 1; i < _this.tableColumns[0].length; i++) {
        //   sheet.setArray(args.row, i, [2021]);
        // }
      });
      this.spread.resumePaint();
      this.adminLoading = false;
      this.tableLoading[0] = false;
    },
    // 自动计算数量
    computedNum(rowIndex, colIndex, val) {
      let currentRow = this.tableData[0][rowIndex];
      let currentlabel = this.tableColumns[0][colIndex].prop + "dy";
      if (!currentRow[currentlabel]) {
        return;
      }
      if (
        !currentRow[currentlabel].TotalHours ||
        parseInt(currentRow[currentlabel].TotalHours) <= 0
      ) {
        this.$message.error("该天休息，上班时间为0");
        return;
      }
      let sheet = this.spread.getActiveSheet();
      let Qty = parseInt(currentRow.OweQty);
      let Capacity = parseInt(currentRow.Capacity);
      let list = [];
      let editNum = 0;
      let remainNum = 0;
      // 填一个数量自动将之后的全清干净，前面的累计 prop2有值
      this.tableColumns[0].some((x, i) => {
        if (i <= colIndex) {
          debugger;
          list.push(currentRow[x.prop]);
          if (x.prop2 && i != colIndex && currentRow[x.prop]) {
            editNum = parseInt(editNum) + parseInt(currentRow[x.prop]);
          }
        } else {
          list.push("");
        }
      });
      remainNum = Qty - editNum;
      debugger;
      if (parseInt(val) > remainNum) {
        this.$message.error(
          "输入的数量不能大于剩余排产数，剩余排产数为：" + remainNum
        );
        list[colIndex] = "";
        for (var j = 0; j < this.tableColumns[0].length; j++) {
          sheet.setArray(rowIndex, j, [list[j]]);
        }
        return;
      } else {
        // 接着计算下面每一个空格该有的数
        for (var j = colIndex + 1; j < this.tableColumns[0].length; j++) {
          let label = this.tableColumns[0][j].prop + "dy";
          let obj = currentRow[label];
          remainNum = remainNum - parseInt(val);
          let maxNum =
            parseInt(Capacity) *
            parseInt(obj.TotalHours) *
            parseInt(obj.DayCapacity);
          // parseInt(obj.StandardPeoples)
          if (remainNum <= 0) {
            list[j] = null;
          } else {
            if (remainNum <= maxNum) {
              list[j] = remainNum;
              break;
            } else {
              list[j] = maxNum;
              remainNum -= maxNum;
            }
          }
        }
        for (var j = 0; j < this.tableColumns[0].length; j++) {
          sheet.setArray(rowIndex, j, [list[j]]);
        }
      }
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
      this.treeListTmp = [];
      this.treeData = [];
      let form = {
        OrganizeIDs: this.userInfo.CenterID,
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
          this.$set(
            this.formSearchs[0].datas,
            "WorkShopID",
            data[0].OrganizeID
          );
          this.getLineData(data[0].OrganizeID);
        } else {
          this.adminLoading = false;
          this.getTableData(this.formSearchs[0].datas, 0);
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
    async getLineData(OrganizeIDs) {
      this.lines = [];
      let res = await GetSearchData({
        dicID: 36,
        OrganizeTypeID: 6,
        OrganizeIDs: OrganizeIDs,
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
        this.lineOptions = data;
        this.lines = newData;
        this.checkBoxCellTypeLine = new GCsheets.CellTypes.ComboBox();
        this.checkBoxCellTypeLine.editorValueType(
          GC.Spread.Sheets.CellTypes.EditorValueType.value
        );
        this.checkBoxCellTypeLine.items(newData);
        this.checkBoxCellTypeLine.itemHeight(24);
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
      this.formSearchs[0].datas["WorkShopID"] = data.OrganizeID;
      this.dataSearch(0);
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
    // 保存日计划
    async daySave(submitData) {
      this.adminLoading = true;
      let res = await GetSearch(`/APS/API/SaveDayPlan`, submitData);
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
    // 保存日计划
    async dataSaveDay() {
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
    let res = await SaveMOPlanStep4(submitData);
      const { result, data, count, msg } = res.data;
      debugger;
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
    // 确认更改线别
    sureChangeLineData() {
      if (!this.selectLineValue) {
        this.$message.error("请选择要更改的线别！");
        return;
      }
      _this.selectionData[0].forEach((x) => {
        x.LineID = _this.selectLineValue.OrganizeID;
        x.LineID = _this.selectLineValue.OrganizeName;
      });
      this.$confirm("是否直接保存修改的线别？")
        .then(() => {
          _this.daySave(_this.selectionData[0]);
          _this.LineDialog = false;
        })
        .catch(() => {
          _this.LineDialog = false;
        });
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