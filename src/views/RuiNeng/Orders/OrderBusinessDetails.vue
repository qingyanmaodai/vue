<!--订单明细-->
<template>
  <div class="container" v-loading="adminLoading">
    <div class="admin_head" ref="headRef">
      <div v-for="i in [0]" :key="i" v-show="labelStatus1 == i">
        <ComSearch
          ref="searchRef"
          :searchData="formSearchs[i].datas"
          :searchForm="formSearchs[i].forms"
          :remark="i"
          :isLoading="isLoading"
          :btnForm="btnForm"
          :signName="labelStatus1"
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
              <span @click="aaaaaaaaaaaa(labelStatus1)">aaaa</span>
              <!-- <div>
                <span>选择机台/班组：</span>
                <el-select
                  clearable
                  filterable
                  size="mini"
                  v-model="ruleForm.LineIDs"
                  @change="setFooterLabel"
                  style="width: 320px"
                >
                  <el-option
                    v-for="(item, i) in lines"
                    :key="i"
                    :label="item.LineName"
                    :value="item.LineID"
                  >
                  </el-option>
                </el-select>
                <span>生产时段：</span>
                <el-date-picker
                  v-model="ruleForm.ProducedDate"
                  type="date"
                  size="mini"
                  placeholder="选择生产时段"
                >
                </el-date-picker>
                <el-divider direction="vertical"></el-divider>
              </div> -->
              <!-- <div
                
                v-for="(item, y) in Status1"
                :key="y"
              >
                <span @click="changeStatus(item, y)" :class="labelStatus1 == y ? 'statusActive cursor' : 'cursor'">{{ item.label }}</span>
                <el-divider direction="vertical"></el-divider>
              </div> -->
            </el-col>
          </el-row>
        </div>
        <div
          class="flex_column"
          v-for="item in [0]"
          :key="item"
          v-show="labelStatus1 == item"
        ></div>
      </div>

      <!-- 点击齐套率弹框-->
      <DialogTable
        title="订单齐套分析"
        :tableDialog="colDialogVisible"
        :sysID="7916"
        width="80%"
        @closeDialog="colDialogVisible = false"
        :searchForm="dialogSearchForm"
        :isToolbar="false"
      ></DialogTable>
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
import ComSearch from "@/components/ComSearch";
import ComVxeTable from "@/components/ComVxeTable";
// import ComSpreadTable from "@/components/ComSpreadTable";
import { HeaderCheckBoxCellType } from "@/static/data.js";
import {
  GetHeader,
  GetSearchData,
  ExportData,
  SaveData,
  GetSearch,
} from "@/api/Common";
import DialogTable from "@/components/Dialog/dialogTable";
export default {
  name: "OrderBusinessDetails",
  components: {
    ComSearch,
    ComVxeTable,
    DialogTable,
  },
  data() {
    return {
      dialogSearchForm: {},
      colDialogVisible: false,
      ////////////////// Search /////////////////
      footerLabel: ["", "", "", "", "", "", ""],
      sysID: [
        { ID: 7961 },
        { ID: 5615 },
        { ID: 5156 },
        { ID: 5156 },
        { ID: 5156 },
        { ID: 5156 },
        { ID: 5156 },
      ],
      // Status1: [
      //   { label: "待维护PO", value: 0 },
      //   { label: "暂停挂起", value: 1 },
      //   { label: "已完成", value: 3 },
      //   { label: "排产中", value: 4 },
      //   { label: "全部", value: 5 }
      // ],
      hotSettings: [{}],
      title: this.$route.meta.title,
      labelStatus1: 0,
      PrepareDate: "",
      adminLoading: false,
      checkdBtnCodes: [],
      drawer: false,
      height: "707px",
      formSearchs: [
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
          datas: {},
          forms: [],
        },
      ],
      btnForm: [],
      hotTable: [[], [], [], [], []],
      tableData: [[], [], [], [], [], [], []],
      delData: [[], [], [], [], [], [], []],
      tableColumns: [[], [], [], [], [], [], []],
      tableLoading: [false, false, false, false, false, false],
      isClear: [false, false, false, false, false, false],
      tablePagination: [
        { pageIndex: 1, pageSize: 500, pageTotal: 0 },
        { pageIndex: 1, pageSize: 0, pageTotal: 0 },
        { pageIndex: 1, pageSize: 100, pageTotal: 0 },
        { pageIndex: 1, pageSize: 3000, pageTotal: 0 },
        { pageIndex: 1, pageSize: 3000, pageTotal: 0 },
        { pageIndex: 1, pageSize: 100, pageTotal: 0 },
        { pageIndex: 1, pageSize: 100, pageTotal: 0 },
      ],
      height: "707px",
      showPagination: true,
      tagRemark: 0,
      isLoading: false,
      initialBtnData: [],
      tagRremark: 1,
      selectionData: [[], [], [], [], [], [], []],
      hasSelect: [true, true, false, true, false, false],
      isEdit: false,
      losePrepareDate: 1,
      losePrepareDate2: 1,
      ruleForm: {
        LineIDs: [],
        ProducedDate: "",
      },
      lines: [],
    };
  },
  watch: {},
  created() {
    _this = this;
    // this.adminLoading = true;
    // this.getLine();
    this.getTableHeader();
    // 获取所有按钮
    this.judgeBtn();
  },
  // activated() {
  //   if (this.spread) {
  //     this.spread.refresh();
  //   }
  // },
  mounted() {
    setTimeout(() => {
      this.setHeight();
    }, 450);
  },
  methods: {
    //获取子组件实例
    workbookInitialized: function (workbook, remarkTb, settings) {
      console.log(workbook, "workbook");
      this.hotTable[remarkTb] = workbook;
      this.hotSettings[remarkTb] = settings;
    },
    //获取当前选中行的值
    selectChanged(newValue, remarkTb) {
      // 在子组件计算属性发生变化时，更新父组件的计算属性
      this.selectionData[remarkTb] = newValue;
    },
    backData() {
      this.getSelectionData();
      if (this.selectionData[1].length == 0) {
        this.$message.error("请选择需要操作的数据！");
      } else {
        this.$confirm("确定退回吗？")
          .then(() => {
            // 确定
            this.adminLoading = true;
            this.selectionData[1].forEach((a) => {
              a["ElementDeleteFlag"] = 1;
            });
            this.dataSave(this.selectionData[1], 0);
          })
          .catch(() => {
            // 取消
          });
      }
    },
    // 跳转至页面配置
    toPageSetting(id) {
      this.$router.push({
        name: "FieldInfo",
        params: {
          ID: id,
        },
      });
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
    initSpread: function (spread) {
      this.spread = spread;
    },
    // bindComboBoxToCell(sheet, row, col, dataSourceName) {
    //   // 获取要绑定下拉菜单的单元格对象
    //   let cell = sheet.getCell(row, col);

    //   // 创建下拉菜单单元格类型，并设置其选项数据
    //   let comboBox = new GC.Spread.Sheets.CellTypes.ComboBox();
    //   comboBox.editorValueType(
    //     GC.Spread.Sheets.CellTypes.EditorValueType.value
    //   );
    //   comboBox.editable(true);
    //   // 获取下拉菜单的选项数据

    //   comboBox.items(dataSourceName);
    //   comboBox.itemHeight(24);

    //   // 将下拉菜单单元格类型绑定到指定的单元格中
    //   cell.cellType(comboBox);
    // },
    applyStyles(td, styles) {
      Object.entries(styles).forEach(([style, value]) => {
        td.style[style] = value;
      });
    },
    async ToPlan() {
      //转入月计划

      if (this.selectionData[0].length == 0) {
        this.$message({
          message: "请选择要操作的数据",
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      } else {
        this.adminLoading = true;
        let res = await GetSearch(
          this.selectionData[0],
          "/APSAPI/InsertIntoPCBByOrderID"
        );
        const { result, data, count, msg } = res.data;
        if (result) {
          this.adminLoading = false;
          this.dataSearch(0);
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
    getSelectionData() {
      let sheet = this.spread.getActiveSheet();
      let newData = sheet.getDataSource();
      this.selectionData[1] = [];
      if (newData.length != 0) {
        newData.forEach((x) => {
          if (x.isChecked) {
            this.selectionData[1].push(x);
          }
        });
      }
    },
    customDropdownRenderer(
      instance,
      td,
      row,
      col,
      prop,
      value,
      cellProperties
    ) {
      var source = cellProperties.editorOptions.data;
      console.log(source, "source");
      var label = "";

      // 根据当前的value查找对应的label
      for (var i = 0; i < source.length; i++) {
        if (source[i].value === value) {
          label = source[i].label;
          break;
        }
      }

      // 渲染显示label
      td.innerText = label;
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
    // 编辑行
    editRow(row) {
      this.$set(row, "update", true);
    },
    // 删除行
    delRow(row) {
      this.$confirm("确定要删除该菜单嘛？")
        .then((_) => {})
        .catch((_) => {});
    },
    // 单击行
    handleRowClick(row, remarkTb) {
      this.delData[remarkTb] = [];
      this.delData[remarkTb].push(row);
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
    // 行内样式
    cellStyle0({ row, column }) {
      if (column.property == "IsCompleteInspect") {
        if (row.IsCompleteInspect == "未开始") {
          return {
            backgroundColor: "#ff7b7b",
          };
        } else if (row.IsCompleteInspect == "进行中") {
          return {
            backgroundColor: "#fdfd8f",
          };
        } else if (row.IsCompleteInspect == "已完成") {
          return {
            backgroundColor: "#9fff9f",
          };
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
    // 保存返回结果自己处理事件
    async returnResultData(newData) {
      let res = await SaveData(newData);
      return res;
    },
    // 获取表头数据
    async getTableHeader() {
      let IDs = this.sysID;
      let res = await GetHeader(IDs);
      const { datas, forms, result, msg } = res.data;
      if (result) {
        // 获取每个表头
        datas.some((m, i) => {
          m.forEach((n) => {
            // 进行验证
            if (n.prop == "MenuCode" || n.prop == "MenuName") {
              this.$set(n, "treeNode", true);
            }
            this.verifyDta(n);
            if (n.children && n.children.length != 0) {
              n.children.forEach((x) => {
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
        this.getTableData(this.formSearchs[0].datas, 0);

        this.adminLoading = false;
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
      if (this.tableData[remarkTb].length === 0) {
        this.tablePagination[remarkTb]["pageSize"] =
          this.tableColumns[remarkTb][1]["pageSize"];
      }
      form["rows"] = this.tablePagination[remarkTb].pageSize;
      form["page"] = this.tablePagination[remarkTb].pageIndex;
      let res = await GetSearchData(form);
      const { result, data, count, msg } = res.data;
      this.$set(this.tableLoading, remarkTb, false);
      if (result) {
        // if(data.length != 0){
        //   data.forEach(a=>{
        //     a.ViewSort = a.RowNumber
        //   })
        // } // 只能强行给1-最后用来行号测试，不确定后台数据怎么存，一开始这些数据就不是从1开始排序

        this.$set(this.tableData, remarkTb, data);
        this.setData(remarkTb);
        this.$set(this.tablePagination[remarkTb], "pageTotal", count);
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
    },
    // 填写行号自动排好序
    editSort(row, val, prop, index) {
      if (this.labelStatus1 != 0) {
        return;
      }
      let newData = [];
      let newData_1 = [];
      let newData_2 = [];
      let newData_3 = [];
      let newData_4 = [];
      if (val < row.RowNumber) {
        // 改成比之前更小的行号 row.RowNumber为目标行数
        newData_1 = this.tableData[1].filter(
          (a) => parseInt(a.ViewSort) < parseInt(val)
        ); //把最终行号的前面的数取出来
        newData_2 = this.tableData[1].filter((b) => {
          return (
            parseInt(b.RowNumber) >= parseInt(val) &&
            parseInt(b.RowNumber) != parseInt(row.RowNumber)
          );
        }); //把前面的数过滤掉且过滤掉自身
        newData_3 = [row];
        newData = newData_1.concat(newData_3).concat(newData_2);
      } else {
        // 改成比原来大的数
        newData_1 = this.tableData[1].filter(
          (a) => parseInt(a.ViewSort) < parseInt(row.RowNumber)
        ); //把最终行号的前面的数取出来
        newData_2 = this.tableData[1].filter((b) => {
          return (
            parseInt(b.RowNumber) > parseInt(row.RowNumber) &&
            parseInt(b.RowNumber) <= parseInt(val)
          );
        }); //把介于两数之间，大于原来的数，小于目标数的数拿出来
        newData_3 = [row];
        newData_4 = this.tableData[1].filter((b) => {
          return parseInt(b.RowNumber) > parseInt(val);
        });
        newData = newData_1
          .concat(newData_2)
          .concat(newData_3)
          .concat(newData_4);
      }

      let realyData = JSON.parse(JSON.stringify(newData));
      realyData.forEach((c, i) => {
        c.ViewSort = i + 1;
        c.RowNumber = i + 1;
      });
      this.$set(this.tableData, 0, realyData);
    },
    // 选择数据
    selectFun(data, remarkTb, row) {
      this.selectionData[remarkTb] = data;
    },
    // 改变状态
    changeStatus(x, index) {
      this.labelStatus1 = index;
      this.dataSearch(index);
    },

    // 同步装配排程
    async refreshPlan(row, prop, val, index) {
      this.adminLoading = true;
      let res = await GetSearch("", "/APSAPI/InsertIntoPCB");
      const { result, data, count, msg } = res.data;
      if (result) {
        this.adminLoading = false;
        this.dataSearch(0);
      } else {
        this.adminLoading = false;
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
    },

    // 保存排序
    async saveSort() {
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
      let res = await SaveData(submitData);

      const { result, data, count, msg } = res.data;

      if (result) {
        this.dataSearch(1);
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
    // 清空排期
    clearPlan(remarkTb) {
      if (this.selectionData[remarkTb].length != 0) {
        this.selectionData[remarkTb].forEach((a) => {
          a.StartDate = "";
        });
      }
    },
    // 计算PCB排程
    async computedPlan(remarkTb) {
      this.getSelectionData();
      this.adminLoading = true;
      this.selectionData[1].forEach((m) => {
        m["isChecked"] = true;
      });
      let res = await GetSearch(
        this.selectionData[1],
        "/APSAPI/MOPlanStep1CalculationV2"
      );
      const { result, data, count, msg } = res.data;

      if (result) {
        this.adminLoading = false;
        this.$set(this.tableData, 1, data);
        // 重新勾选上
        this.selectionData[1] = [];
        this.dataSearch(1);
        // let refName = "tableRef" + remarkTb;
        // data.forEach((b) => {
        //   this.$nextTick(() => {
        //     this.$refs[refName][1].$refs.vxeTable.setCheckboxRow(b, true);
        //   });
        //   this.selectionData[remarkTb].push(b);
        // });
      } else {
        this.adminLoading = false;
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
    },

    // 保存
    async dataSave(data1, index) {
      this.adminLoading = true;

      let res = await SaveData(data1);
      const { result, data, count, msg } = res.data;

      if (result) {
        this.dataSearch(1);
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
    // 转入日计划
    async setPlan(remarkTb, index, params) {
      let arr = this.getSelectionData();
      if (this.ruleForm.LineIDs.length == 0 && false) {
      } else {
        if (this.selectionData[remarkTb].length == 0) {
          this.$message.error("请选择需要转入日计划的数据！");
        } else {
          let ProcessID = "";
          this.adminLoading = true;
          // if (remarkTb == 1) {
          //   ProcessID = "P202009092233201";
          // } else if (remarkTb == 3) {
          //   ProcessID = "P202009092233413";
          // }

          let errMsg = "";
          // let okCount = 0;
          let okCount = this.selectionData[remarkTb].length;
          this.selectionData[remarkTb].forEach((d) => {
            let isOk = true;
            //判断是否转入
            // if (
            //   params.ProcessID == "P202009092233201" &&
            //   d["IsToPlanDay1"] != "否"
            // ) {
            //   isOk = false;
            // } else if (
            //   params.ProcessID == "P202009092233413" &&
            //   d["IsToPlanDay2"] != "否"
            // ) {
            //   isOk = false;
            // }

            if (isOk) {
              d["LineIDs"] = this.ruleForm.LineIDs;
              d["ProducedDate"] = this.ruleForm.ProducedDate;
              d["ProcessID"] = params.ProcessID;
              d["LineID"] = null;
              okCount++;
            } else {
              errMsg += d["OrderNo"] + "已转入或者无此工序";
            }
          });
          if (errMsg != "") {
            this.$message({
              message: errMsg,
              type: "error",
              dangerouslyUseHTMLString: true,
            });
          }
          if (okCount > 0) {
            let res = await GetSearch(
              this.selectionData[remarkTb],
              "/APSAPI/MOPlanSaveToDayPlanV2?isPlan=1"
            );
            const { result, data, count, msg } = res.data;
            if (result) {
              this.adminLoading = false;
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
            this.adminLoading = false;
          }
        }
      }
    },
    // 选线获取剩余工时
    setFooterLabel(val) {
      let LineIDs = this.lines.filter((a) =>
        this.ruleForm.LineIDs.some((b) => b == a.LineID)
      );
      let LineName = LineIDs.map((c) => c.LineName).join(",");
      //查询线别剩余工时
      let StrValue = `提示：当前所选${LineName}线，在${this.ruleForm.ProducedDate}共有350个小时，已占用250小时，剩余100小时【已选4项，预计占用50小时，剩余50小时】`;
      this.$set(this.footerLabel, 0, StrValue);
    },
    // 获取线别
    async getLine() {
      let form = {};
      form["rows"] = 0;
      form["dicID"] = 36;
      form["Status"] = 1;
      form["OrganizeTypeID"] = 6;
      let res = await GetSearchData(form);
      const { result, data, count, msg } = res.data;
      if (result) {
        if (data.length != 0) {
          data.forEach((a) => {
            a["LineID"] = a.OrganizeID;
            a["LineName"] = a.OrganizeName;
          });
        }
        this.lines = data;
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
    },
    // 备料任务
    async readyTask(remarkTb, index, MOSchedulingType) {
      let submitData = this.selectionData[remarkTb];
      if (submitData.length != 0) {
        this.adminLoading = true;
        let url = "/APSAPI/SetPreParePlanV2";
        let res = await GetSearch(submitData, url);
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
      } else {
        this.$message.error("请选择需要操作的数据！");
      }
    },
  },
};
</script>
