<!--菜单设置-->
<template>
  <div class="container" v-loading="adminLoading">
    <div ref="content_up" class="list_content_up">
      <div class="admin_head_2" ref="headRef">
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
              <el-col :span="4"
                ><span class="title">{{ title }}</span></el-col
              >
              <el-col :span="20" class="flex_flex_end">
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
          <ComVxeTable
            :rowKey="'RowNumber'"
            :height="'300px'"
            :tableData="tableData[0]"
            :tableHeader="tableColumns[0]"
            :tableLoading="tableLoading[0]"
            :remark="0"
            :sysID="sysID[0].ID"
            :isClear="isClear[0]"
            :pagination="tablePagination[0]"
            @pageChange="pageChange"
            @handleRowClick="handleRowClick"
            @pageSize="pageSize"
            @sortChange="sortChange"
          />
        </div>
      </div>
    </div>

    <div ref="content_down" class="list_content_down">
      <div class="admin_head_2" ref="headRef_2">
        <ComSearch
          ref="searchRef2"
          :searchData="formSearchs[1].datas"
          :searchForm="formSearchs[1].forms"
          :remark="1"
          :isLoading="isLoading"
          :btnForm="btnForm2"
          @btnClick="btnClick"
        />
      </div>
      <div>
        <div class="admin_content">
          <ComVxeTable
            :rowKey="'RowNumber'"
            :height="height"
            :tableData="tableData[1]"
            :tableHeader="tableColumns[1]"
            :tableLoading="tableLoading[1]"
            :remark="1"
            :sysID="sysID[1].ID"
            :isClear="isClear[1]"
            :pagination="tablePagination[1]"
            @pageChange="pageChange"
            @pageSize="pageSize"
            @sortChange="sortChange"
            @toPage="usingSearch"
          />
        </div>
      </div>
    </div>

    <el-dialog title="料品可用量查询" :visible.sync="dialogShow" width="50%">
      <div class="container" style="background-color: #f0f2f5">
        <div class="admin_content">
          库存列表
          <ComReportTable
            :rowKey="'RowNumber'"
            :height="height3"
            :tableData="tableData[2]"
            :tableHeader="tableColumns[2]"
            :tableLoading="tableLoading[2]"
            :remark="2"
            :showFooter="true"
            :includeFields="includeFields[0]"
            :sysID="sysID[2].ID"
            :isClear="isClear[2]"
            :pagination="tablePagination[2]"
            @pageChange="pageChange"
            @pageSize="pageSize"
            @sortChange="sortChange"
          />
        </div>
        <div class="admin_content">
          采购单
          <ComReportTable
            :rowKey="'RowNumber'"
            :height="height3"
            :tableData="tableData[3]"
            :tableHeader="tableColumns[3]"
            :tableLoading="tableLoading[3]"
            :remark="3"
            :sysID="sysID[3].ID"
            :isClear="isClear[3]"
            :showFooter="true"
            :includeFields="includeFields[1]"
            :pagination="tablePagination[3]"
            @pageChange="pageChange"
            @pageSize="pageSize"
            @sortChange="sortChange"
          />
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ComSearch from "@/components/ComSearch";
import ComVxeTable from "@/components/ComVxeTable";
import ComReportTable from "@/components/ComReportTable";
import { GetHeader, GetSearchData, ExportData } from "@/api/Common";
export default {
  name: "ReadyMaterialTrace",
  components: {
    ComSearch,
    ComVxeTable,
    ComReportTable,
  },
  data() {
    return {
      ////////////////// Search /////////////////
      title: this.$route.meta.title,
      dialogShow: false,
      height2: "240px",
      height3: "180px",
      includeFields: [["ProducedQty", "ConfirmQty"], [], []],
      drawer: false,
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
      ],
      parmsBtn: [],
      parmsBtn2: [
        {
          ButtonCode: "save",
          BtnName: "保存",
          Type: "success",
          Ghost: true,
          Size: "small",
          Methods: "dataSave",
          Icon: "",
        },
      ],
      btnForm: [],
      btnForm2: [],
      tableData: [[], [], [], []],
      tableColumns: [[], [], [], []],
      tableLoading: [false, false, false, false],
      isClear: [false, false, false, false],
      tablePagination: [
        { pageIndex: 1, pageSize: 50, pageTotal: 0 },
        { pageIndex: 1, pageSize: 50, pageTotal: 0 },
        { pageIndex: 1, pageSize: 50, pageTotal: 0 },
        { pageIndex: 1, pageSize: 50, pageTotal: 0 },
      ],
      height: "707px",
      showPagination: true,
      tagRemark: 0,
      isLoading: false,
      adminLoading: false,
      parseForm: {},
      Status1: [
        { label: "全部订单", value: 0 },
        { label: "齐套订单", value: 1 },
        { label: "欠料订单", value: 2 },
      ],
      labelStatus1: 0,
      sysID: [{ ID: 7791 }, { ID: 7803 }, { ID: 76 }, { ID: 6751 }],
      isEdit: false,
    };
  },
  watch: {},
  created() {
    this.adminLoading = true;
    this.getTableHeader();
    // 获取所有按钮
    this.judgeBtn();
  },
  mounted() {
    setTimeout(() => {
      this.setHeight();
    }, 450);
  },
  methods: {
    //判断按钮权限
    judgeBtn() {
      let routeBtn = this.$route.meta.btns;
      let newBtn = [];
      let newBtn2 = [];
      let permission = false;
      if (routeBtn.length != 0) {
        routeBtn.forEach((x) => {
          if (x.ButtonCode == "edit") {
            permission = true;
          }
          let newData = this.parmsBtn.filter((y) => {
            return x.ButtonCode == y.ButtonCode;
          });
          let newData2 = this.parmsBtn2.filter((y) => {
            return x.ButtonCode == y.ButtonCode;
          });
          if (newData.length != 0) {
            newBtn = newBtn.concat(newData);
          }
          if (newData2.length != 0) {
            newBtn2 = newBtn2.concat(newData2);
          }
        });
      }
      this.$set(this, "btnForm", newBtn);
      this.$set(this, "btnForm2", newBtn2);
      this.$set(this, "isEdit", permission);
    },
    // 高度控制
    setHeight() {
      let headHeight =
        this.$refs.content_up.offsetHeight + this.$refs.content_up.offsetTop;
      let headRef_2 = this.$refs.headRef_2.offsetHeight;
      let rem =
        document.documentElement.offsetHeight - headHeight - headRef_2 - 65;
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
    // 保存
    dataSave(remarkTb) {},
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
        this.formSearchs[0].datas["IsSetPrepare"] = ["已生成", "部分生成"];
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
      form["rows"] = this.tablePagination[remarkTb].pageSize;
      form["page"] = this.tablePagination[remarkTb].pageIndex;
      let res = await GetSearchData(form);
      const { result, data, count, msg } = res.data;
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
    // 改变状态
    changeStatus(item, index) {
      this.labelStatus1 = index;
      if (index == 0) {
        this.formSearchs[0].datas["PrepareType"] = "";
      } else if (index == 1) {
        this.formSearchs[0].datas["PrepareType"] = "齐套";
      } else {
        this.formSearchs[0].datas["PrepareType"] = "欠料";
      }
      this.dataSearch(0);
      this.$set(this.tableData, 1, []);
    },
    // 单击获取明细
    handleRowClick(row, remarkTb) {
      this.formSearchs[1].datas["SalesOrderDetailID"] = row.SalesOrderDetailID;
      // this.formSearchs[1].datas["OrderID"] = row.OrderID;
      this.dataSearch(1);
    },
    // 可用量查询
    usingSearch(row, prop) {
      this.formSearchs[2].datas["MaterialID"] = row.MaterialID;
      this.formSearchs[3].datas["MaterialID"] = row.MaterialID;
      this.dataSearch(2);
      this.dataSearch(3);
      this.dialogShow = true;
    },
  },
};
</script>
