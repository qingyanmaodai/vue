<!--菜单设置-->
<template>
  <div class="container"  v-loading="adminLoading">
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
          </el-row>
        </div>
        <ComVxeTable
          :rowKey="'RowNumber'"
          :height="height"
          :tableData="tableData[0]"
          :tableHeader="tableColumns[0]"
          :tableLoading="tableLoading[0]"
          :remark="0"
          :isEdit="isEdit"
          :sysID="7806"
          :isClear="isClear[0]"
          :pagination="tablePagination[0]"
          @pageChange="pageChange"
          @pageSize="pageSize"
          @sortChange="sortChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import ComSearch from "@/components/ComSearch";
import ComVxeTable from "@/components/ComVxeTable";
import {
  GetHeader,
  GetHeaderTwo,
  GetSearchData,
  ExportData,
  SaveData,
} from "@/api/Common";
import { SaveSalesPlan } from "@/api/PageSale";
export default {
  name: "SaleScheduling",
  components: {
    ComSearch,
    ComVxeTable,
  },
  data() {
    return {
      ////////////////// Search /////////////////
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
          BtnName: "保存",
          Type: "success",
          Ghost: true,
          Size: "small",
          Methods: "specialSave",
          Icon: "",
          Params: {},
        },
      ],
      scrollTop: 0,
      tableData: [[]],
      tableColumns: [[]],
      tableLoading: [false],
      isClear: [false],
      tablePagination: [{ pageIndex: 1, pageSize: 100, pageTotal: 0 }],
      height: "707px",
      showPagination: true,
      tagRemark: 0,
      isLoading: false,
      isEdit: false,
      adminLoading:false,
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
        document.documentElement.clientHeight - headHeight - 
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
    // 滚动
    scroll({ scrollTop, scrollLeft }) {
      this.scrollTop = scrollTop;
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
      }, 200);
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
      
      res = await SaveSalesPlan(this.tableData[remarkTb]);
      const { result, data, count, msg } = res.data;
      this.dataSearch(0);
      if (result) {
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
    },
    // 保存
    async dataSave(remarkTb, index, parms) {
      let newData = [];
      if (parms && parms.dataName) {
        if (this.selectionData[remarkTb].length == 0) {
          this.$message.error("请选择需要操作的数据！");
          return;
        } else {
          newData = this.selectionData[remarkTb];
        }
      } else {
        newData = this.tableData[remarkTb];
      }
      this.adminLoading = true;
      this.btnForm[index].isLoading = true;
      let res = await SaveData(newData);
      const { datas, forms, result, msg } = res.data;
      if (result) {
        this.btnForm[index].isLoading = false;
        this.$message({
                message: msg,
                type: "success",
                dangerouslyUseHTMLString: true,
              });
        this.dataSearch(remarkTb);
        this.adminLoading = false;
      } else {
        this.btnForm[index].isLoading = false;
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
      let IDs = [{ ID: 7806 }];
      let res = await GetHeader(IDs);
      const { datas, forms, result, msg } = res.data;
      if (result) {
        // 获取每个表头
        datas.some((m, i) => {
          m.forEach((n) => {
            // 进行验证
            this.verifyDta(n);
            if (n.childrens && n.children.length != 0) {
              n.childrens.forEach((x) => {
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
        this.adminLoading = false;
        this.getTableData(this.formSearchs[0].datas, 0);
      } else {
        this.adminLoading = false;
        this.$message({
                message: msg,
                type: "error",
                dangerouslyUseHTMLString: true,
              });
      }
      // this.getAutoHeader(IDs);
    },
    // 获取动态日期表头
    async getAutoHeader(IDs) {
      let resTwo = await GetHeaderTwo(IDs);
      const { datas, dresult, msg } = resTwo.data;
      if (dresult) {
        // 获取每个表头
        datas.some((m, i) => {
          m.forEach((n) => {
            // 进行验证
            this.verifyDta(n);
            if (n.childrens && n.children.length != 0) {
              n.childrens.forEach((x) => {
                this.verifyDta(x);
              });
            }
          });
          this.$set(this.tableColumns, i, m);
        });
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
      const { result, data, count, msg, Columns } = res.data;
      if (result) {
        if (Columns && Columns.length != 0) {
          Columns[0].some((n, i) => {
            this.verifyDta(n);
          });
          this.$set(this.tableColumns, remarkTb, Columns[0]);
        }
        this.$set(this.tableData, remarkTb, data);
        // this.$refs.plxTable.reloadData(data);
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
  },
};
</script>