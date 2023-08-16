<!--菜单设置-->
<template>
  <div class="container" v-loading="adminLoading">
    <div
      ref="content_up"
      :class="
        enlargeType ? 'list_content_up blockClass' : 'list_content_up noneClass'
      "
    >
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
          <div class="ant-table-title" ref="headRef_2">
            <el-row>
              <el-col :span="4"
                ><span class="title">{{ title }}</span></el-col
              >
              <el-col :span="20" class="flex_flex_end"> </el-col>
            </el-row>
          </div>
          <ComReportTable
            :rowKey="'RowNumber'"
            :height="'180px'"
            :tableData="tableData[0]"
            :tableHeader="tableColumns[0]"
            :tableLoading="tableLoading[0]"
            :remark="0"
            :sysID="sysID[0].ID"
            :isClear="isClear[0]"
            :pagination="tablePagination[0]"
            @pageChange="pageChange"
            @pageSize="pageSize"
            @sortChange="sortChange"
            @toPage="toPage"
            @handleRowClick="handleRowClick"
          />
        </div>
      </div>
    </div>
    <div ref="content_down" class="list_content_down">
      <div>
        <div class="admin_content">
          <div class="ant-table-title" style="height: 3rem">
            <el-row class="admin_head_2">
              <!-- <el-col :span="4"><span class="title">物料明细</span></el-col> -->
              <el-col :span="23">
                <ComSearch
                  ref="searchRef"
                  :searchData="formSearchs[1].datas"
                  :searchForm="formSearchs[1].forms"
                  :remark="1"
                  :isLoading="isLoading"
                  :btnForm="btnForm"
                  @btnClick="btnClick"
                />
              </el-col>
              <el-col :span="1" class="flex_flex_end">
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="expendCollText"
                  placement="top"
                >
                  <span class="right_icon">
                    <img
                      v-show="!expendColl"
                      src="../../../assets/svg/collapse.svg"
                      @click="systolic"
                      style="width: 1.4rem; height: 1.4rem"
                    />
                    <img
                      v-show="expendColl"
                      src="../../../assets/svg/expend.svg"
                      @click="systolic"
                      style="width: 1.4rem; height: 1.4rem"
                    />
                  </span>
                </el-tooltip>
              </el-col>
            </el-row>
          </div>
          <ComReportTable
            :rowKey="'RowNumber'"
            :height="height"
            :tableData="tableData[1]"
            :tableHeader="tableColumns[1]"
            :tableLoading="tableLoading[1]"
            :remark="1"
            :sysID="sysID[1].ID"
            :cellStyle="cellStyle0"
            :isClear="isClear[1]"
            @pageChange="pageChange"
            @pageSize="pageSize"
            :pagination="tablePagination[1]"
            @sortChange="sortChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ComSearch from "@/components/ComSearch";
import ComReportTable from "@/components/ComReportTable";
import { GetHeader, GetSearchData, ExportData } from "@/api/Common";
export default {
  name: "V2Report_8",
  components: {
    ComSearch,
    ComReportTable,
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
        {
          datas: {},
          forms: [],
        },
      ],
      btnForm: [],
      tableData: [[], []],
      tableColumns: [[], []],
      tableLoading: [false, false],
      isClear: [false, false],
      tablePagination: [
        { pageIndex: 1, pageSize: 50, pageTotal: 0 },
        { pageIndex: 1, pageSize: 2000, pageTotal: 0 },
      ],
      height: "180px",
      showPagination: true,
      tagRemark: 0,
      isLoading: false,
      adminLoading: false,
      parseForm: {},
      parseSearch: false,
      sysID: [{ ID: 7869 }, { ID: 7849 }],
      expendColl: false,
      expendCollText: "收缩",
      enlargeType: true,
    };
  },
  watch: {},
  created() {
    this.getTableHeader();
  },
  mounted() {
    setTimeout(() => {
      this.setHeight();
    }, 450);
  },
  methods: {
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
    // 收缩头部
    systolic() {
      this.enlargeType = !this.enlargeType;
      if (this.enlargeType) {
        this.height = this.rem + "px";
      } else {
        this.height = this.rem + 320 + "px";
      }
    },
    // 高度控制
    setHeight() {
      let headHeight =
        this.$refs.content_up.offsetHeight + this.$refs.content_up.offsetTop;
      let headRef_2 = this.$refs.headRef_2.offsetHeight;
      let rem =
        document.documentElement.offsetHeight - headHeight - headRef_2 - 70;
      this.rem = rem;
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
        if (this.parseSearch) {
          let obj = this.parseForm;
          for (var name in obj) {
            this.$set(this.formSearchs[0].datas, name, obj[name]);
          }
          this.$set(this.formSearchs[0].datas, "dicID", 6704);
          this.dataSearch(0);
        } else {
          this.getTableData(this.formSearchs[0].datas, 0);
        }
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
    // 跳转至备料明细表
    toPage(row) {
      let obj = {};
      // obj["PrepareDate"] = row.PrepareDate;
      // obj["InspectStatus"] = 0;
      // this.$router.push({
      //   name: "V2Report_4",
      //   params: {
      //     PrepareDate: JSON.stringify(obj),
      //   },
      // });

      this.formSearchs[1].datas["PrepareDate"] = [
        row.PrepareDate,
        row.PrepareDate,
      ];
      this.formSearchs[1].datas["InspectStatus"] = 0;
      this.dataSearch(1);
    },
    // 行内样式
    cellStyle({ row, column }) {
      if (column.property == "OrderNo") {
        if (row.InspectStatus == 2) {
          return {
            backgroundColor: "#ff7b7b",
          };
        } else {
          if (row.InspectStatus == 1) {
            return {
              backgroundColor: "#9fff9f",
            };
          }
        }
      }
    },
    // 单击行
    handleRowClick(row, remarkTb) {
      this.formSearchs[1].datas["LastDate"] = [row.LastDate, row.LastDate];
      this.dataSearch(1);
    },
  },
};
</script>
