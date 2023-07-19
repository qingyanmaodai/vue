<!--串线计划-->
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
                <span @click="changeStatus(item, y, 1)">{{ item.label }}</span>
                <el-divider direction="vertical"></el-divider>
              </div>
            </el-col>
          </el-row>
        </div>
        <div
          id="spreadSheet"
          v-loading="tableLoading[0]"
          class="fill_width"
        ></div>
        <div class="flex_row_spaceBtn pagination">
          <div>
            <span
              @click="toPageSetting"
              class="primaryColor cursor"
            >SysID:6739
            </span>
          </div>
          <el-pagination
            class="flex_right"
            @size-change="(val)=>pageSize(val,0)"
            @current-change="(val)=>pageChange(val,0)"
            :current-page="tablePagination[0].pageIndex"
            :page-sizes="[100,300,500,800,1000,2000,3000,4000]"
            :page-size="tablePagination[0].pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="tablePagination[0].pageTotal"
          >
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 表身
var jspreadsheetdata = [];
// 表头
var jspreadsheetColumns = [];
// 选中的数组
var jspreadsheettable = [];
//sheet选中
function checkSheetAll(chk, index) {
  var rows = jspreadsheettable[index].getData();
  var selected = [];
  for (var obj in rows) {
    selected.push(chk.checked ? "true" : "false");
  }
  jspreadsheettable[index].setColumnData([1], selected);
}
import ComSearch from "@/components/ComSearch";
import ComUmyTable from "@/components/ComUmyTable";
import {
  GetHeader,
  GetHeaderTwo,
  GetSearchData,
  ExportData,
  SaveData,
} from "@/api/Common";
import { UpdateSale, SalesPlanProcessMaterialDay } from "@/api/PagePack";
export default {
  name: "PackDayPlan",
  components: {
    ComSearch,
    ComUmyTable,
  },
  data() {
    return {
      ////////////////// Search /////////////////
      adminLoading: false,
      title: this.$route.meta.title,
      drawer: false,
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
          BtnName: "从销售更新",
          Type: "primary",
          Ghost: true,
          Size: "small",
          Methods: "OneStepRelease",
          Icon: "",
          Params: "",
        },
        {
          ButtonCode: "save",
          BtnName: "保存",
          Type: "success",
          Ghost: true,
          Size: "small",
          Methods: "specialSave",
          Icon: "",
          Params: "",
        },
      ],
      tableData: [[]],
      tableColumns: [[]],
      tableLoading: [false],
      isClear: [false],
      tablePagination: [{ pageIndex: 1, pageSize: 500, pageTotal: 0 }],
      height: "702px",
      showPagination: true,
      tagRemark: 0,
      isLoading: false,
      labelStatus1: 0,
      Status1: [{ label: "全部", value: "" }],
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
    this.adminLoading = true;
    this.judgeBtn();
    this.getTableHeader();
    this.getOrganizeData();
  },
  mounted() {
    setTimeout(() => {
      this.setHeight();
    }, 450);
  },
  methods: {
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
        document.documentElement.clientHeight - headHeight - this.$store.getters.reduceHeight;
      let newHeight = rem - 5 + "px";
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
    // 特殊接口保存
    async specialSave(remarkTb, index) {
      let res = null;
      this.adminLoading = true;
      
      res = await SalesPlanProcessMaterialDay(jspreadsheettable[0].getJson());
      const { result, data, count, msg } = res.data;
      this.dataSearch(0);
      if (result) {
        this.$message({
                message: msg,
                type: "success",
                dangerouslyUseHTMLString: true,
              });
        
        this.adminLoading = false;
      } else {
        this.$message({
                message: msg,
                type: "error",
                dangerouslyUseHTMLString: true,
              });
        
        this.adminLoading = false;
      }
    },
    // 保存
    async dataSave(remarkTb, index) {
      this.adminLoading = true;
      
      let res = await SaveData(this.tableData[remarkTb]);
      const { result, data, count, msg } = res.data;
      if (result) {
        this.dataSearch(0);
        this.$message({
                message: msg,
                type: "success",
                dangerouslyUseHTMLString: true,
              });
        
        this.adminLoading = false;
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
      let IDs = [{ ID: 6739 }];
      let res = await GetHeader(IDs);
      const { datas, forms, result, msg } = res.data;
      if (result) {
        // 获取每个表头
        datas.some((m, i) => {
          m.forEach((n) => {
            // 进行验证
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
      } else {
        this.$message({
                message: msg,
                type: "error",
                dangerouslyUseHTMLString: true,
              });
        this.adminLoading = false;
      }

      this.getAutoHeader(IDs);
    },
    // 获取动态日期表头
    async getAutoHeader(IDs) {
      let resTwo = await GetHeaderTwo(IDs);
      const { datas, result, msg } = resTwo.data;
      if (result) {
        jspreadsheetColumns[0] = datas[0];
      } else {
        this.$message({
                message: msg,
                type: "error",
                dangerouslyUseHTMLString: true,
              });
      }
    },
    // 验证数据
    verifyDta(n) {
      if (n.prop == "WorkShopID") {
        this.$set(n, "propName", "WorkShopName");
      }
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
      form["excelIndex"] = 9;
      let res = await GetSearchData(form);
      const { result, data, count, msg } = res.data;
      if (result) {
        jspreadsheetdata[0] = data;
        if (res.data.ExcelColumns && res.data.ExcelColumns.length > 0) {
          jspreadsheetColumns[0] = res.data.ExcelColumns[0];
        }
        document.getElementById("spreadSheet").innerHTML = "";
        jspreadsheettable[0] = jspreadsheet(
          document.getElementById("spreadSheet"),
          {
            data: jspreadsheetdata[0],
            columns: jspreadsheetColumns[0],
            minDimensions: [10, 30],
            freezeColumns: 6,
            tableOverflow: true,
            tableWidth: "100%",
            tableHeight: this.height,
          }
        );
        this.tablePagination[remarkTb].pageTotal = count;
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
    // 改变状态
    changeStatus(item, index) {
      this.labelStatus1 = index;
      this.formSearchs[0].datas["MFGOrganizeID"] = item.value;
      this.dataSearch(0);
    },
    // 从销售更新
    async OneStepRelease(remarkTb, index) {
      this.adminLoading = true;
      this.btnForm[index].isLoading = true;
      let res = await UpdateSale();
      const { result, data, count, msg } = res.data;
      if (result) {
        this.dataSearch(remarkTb);
        this.btnForm[index].isLoading = false;
        this.$message({
                message: msg,
                type: "success",
                dangerouslyUseHTMLString: true,
              });
        this.adminLoading = false;
      } else {
        this.$message({
                message: msg,
                type: "error",
                dangerouslyUseHTMLString: true,
              });
        this.btnForm[index].isLoading = false;
        this.adminLoading = false;
      }
    },

    // 获取分厂数据
    async getOrganizeData() {
      let obj = { dicID: 36, OrganizeTypeID: 2 };
      let res = await GetSearchData(obj);
      const { result, data, count, msg } = res.data;
      if (result) {
        data.forEach((x) => {
          this.Status1.push({
            label: x.OrganizeName,
            value: x.OrganizeID,
          });
        });
      } else {
        this.$message({
                message: msg,
                type: "error",
                dangerouslyUseHTMLString: true,
              });
      }
    },
    // 选择车间
    changeWorkShop(row, prop, val, index) {
      this.$set(row, "WorkShopID", val.WorkShopID);
      this.$set(row, "WorkShopName", val.WorkShopName);
    },
    // 跳转至页面配置
    toPageSetting() {
      this.$router.push({
        name: "FieldInfo",
        params: { ID: 6739 },
      });
    },
  },
};
</script>