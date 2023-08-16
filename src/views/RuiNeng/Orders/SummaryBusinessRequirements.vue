<!--生产订单 -->
<template>
  <div class="container">
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
              <!-- <div
                :class="labelStatus1 == y ? 'statusActive cursor' : 'cursor'"
                v-for="(item, y) in Status1"
                :key="y"
              >
                <span @click="changeStatus(item, y, 1)">{{ item.label }}</span>
                <el-divider direction="vertical"></el-divider>
              </div> -->
            </el-col>
          </el-row>
        </div>
        <div v-for="item in [0]" :key="item" v-show="labelStatus1 == item">
          <ComVxeTable
            ref="tableRef"
            :rowKey="'RowNumber'"
            :height="height"
            :tableData="tableData[0]"
            :tableHeader="tableColumns[0]"
            :tableLoading="tableLoading[0]"
            :remark="0"
            :sysID="sysID[0]['ID']"
            :hasSelect="false"
            :isEdit="false"
            :isClear="isClear[0]"
            :keepSource="true"
            :showPagination="false"
            :IsIndex="true"
            :pagination="tablePagination[0]"
            @pageChange="pageChange"
            @pageSize="pageSize"
            @sortChange="sortChange"
            @selectfun="selectFun"
            :showFooter="true"
            :includeFields="[
              'Qty',
              'ReportQty',
              'OutStockQty',
              'OutStockQtyDiff',
              'UnfinishQty',
            ]"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ComSearch from "@/components/ComSearch";
import ComVxeTable from "@/components/ComVxeTable";
import {
  GetHeader,
  GetSearchData,
  ExportData,
  UpdateProcess,
  SaveData,
} from "@/api/Common";
import { OneStepReleaseByOrder } from "@/api/PageOrder";
export default {
  name: "SummaryBusinessRequirements",
  components: {
    ComSearch,
    ComVxeTable,
  },
  data() {
    return {
      ////////////////// Search /////////////////
      title: this.$route.meta.title,
      drawer: false,
      selectionData: [[]],
      formSearchs: [
        {
          datas: {
            fields:
              "ProductType,Model,sum(Qty) as Qty,sum(ReportQty) as ReportQty,SUM(OutStockQty) AS OutStockQty,sum(OutStockQtyDiff) as OutStockQtyDiff,sum(UnfinishQty) as UnfinishQty ",
            groupby: "ProductType,Model",
            sort: "ProductType DESC",
          },
          forms: [],
        },
      ],
      btnForm: [],
      tableData: [[]],
      tableColumns: [[]],
      tableLoading: [false],
      isClear: [false],
      tablePagination: [{ pageIndex: 1, pageSize: 0, pageTotal: 0 }],
      height: "707px",
      showPagination: true,
      tagRemark: 0,
      isLoading: false,
      labelStatus1: 0,
      sysID: [{ ID: 10129 }],
      Status1: [{ label: "全部", value: "" }],
      isSelect: false,
      isEdit: true,
    };
  },
  watch: {},
  created() {
    // 获取所有按钮
    this.btnForm = this.$route.meta.btns;
    this.judgeBtn(this.btnForm);
    this.getTableHeader();
  },
  mounted() {
    setTimeout(() => {
      this.setHeight();
    }, 450);
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
        console.log(this.formSearchs[remarkTb].datas, name);

        if (name != "dicID") {
          this.formSearchs[remarkTb].datas[name] = null;
        }
        console.log(this.formSearchs[remarkTb].datas, name);
      }
      // this.formSearchs[remarkTb].datas["ProductionStatus"] = this.Status1[
      //   this.labelStatus1
      // ].value;
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
    // 保存
    async dataSave(remarkTb, index, parms, newData) {
      console.log(this.tableData[0]);
      const $table = this.$refs.tableRef.$refs.vxeTable;
      // 获取修改记录
      let updateRecords = [];
      this.adminLoading = true;
      if ($table) {
        updateRecords = $table.getUpdateRecords();
      }
      if (updateRecords.length == 0) {
        this.$set(this, "adminLoading", false);
        this.$message.error("当前数据没做修改，请先修改再保存！");
        return;
      }
      let res = await SaveData(updateRecords);
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
            this.verifyDta(n);
            if (n.children && n.children.length != 0) {
              n.children.forEach((x) => {
                this.verifyDta(x);
              });
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
        });
        // if (this.tableData[0].length === 0) {
        //   this.tablePagination[0]["pageSize"] = datas[0][1]["pageSize"];
        // }
        this.getTableData(this.formSearchs[0].datas, 0);
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
      this.$set(this.tableColumns, remarkTb, [
        {
          label: "品类",
          prop: "ProductType",
          width: 30,
        },
        {
          label: "内部型号",
          prop: "Model",
          width: 150,
        },
        {
          label: "数量",
          prop: "Qty",
          width: 80,
        },
        {
          label: "汇报数",
          prop: "ReportQty",
          width: 80,
        },
        {
          label: "出库数",
          prop: "OutStockQty",
          width: 80,
        },
        {
          label: "库存数",
          prop: "OutStockQtyDiff",
          width: 80,
        },
        {
          label: "未完成",
          prop: "UnfinishQty",
          width: 80,
        },
      ]);
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
    ////////////////其他事件///////////////
    // 改变状态
    changeStatus(item, index) {
      this.labelStatus1 = index;
      this.formSearchs[0].datas["ProductionStatus"] = item.value;
      this.dataSearch(0);
    },
    // 选择数据
    selectFun(data, remarkTb, row) {
      this.selectionData[remarkTb] = data;
    },
  },
};
</script>
