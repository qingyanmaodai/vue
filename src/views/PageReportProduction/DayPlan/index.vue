<!--组织汇总-->
<style type="text/css">

table {
    border-collapse: collapse;
    border-spacing: 0;
}
 
td,th {
    padding: 0;
}
 
.pure-table {
    border-collapse: collapse;
    border-spacing: 0;
    empty-cells: show;
    border: 1px solid #cbcbcb;
}
 
.pure-table caption {
    color: #000;
    font: italic 85%/1 arial,sans-serif;
    padding: 1em 0;
    text-align: center;
}
 
.pure-table td,.pure-table th {
    border-left: 2px solid #cbcbcb;
    border-width: 0 0 0 1px;
    font-size: inherit;
    margin: 0;
    overflow: visible;
    padding: 3px 15px
}
 
.pure-table thead {
    background-color: #e0e0e0;
    color: #000;
    text-align: left;
    vertical-align: bottom;
}
 
.pure-table td {
    background-color: transparent;
    height: 18px;
}
 
.pure-table-bordered td {
    border-bottom: 1px solid #cbcbcb;
}
 
.pure-table-bordered tbody>tr:last-child>td {
    border-bottom-width: 0;
}
</style>
<template>
  <div class="container"     v-loading="adminLoading">
    <div
      class="admin_head"
      ref="headRef"
    >
      <ComSearch
        ref="searchRef"
        :searchData="formSearchs[0].datas"
        :searchForm="formSearchs[0].forms"
        :remark="0"
        :isMoreHeader="true"
        :isLoading="isLoading"
        :btnForm="btnForm"
        @btnClick="btnClick"
      />
    </div>
    <div>
      <div class="admin_content" v-html="content">
      </div>
    </div>

    <!-- 导出多级表头的虚拟表 -->
    

  </div>
</template>

<script>
var _this;
import XLSX from "xlsx";
import FileSaver from "file-saver";
import ComSearch from "@/components/ComSearch";
import ComSpanTable from "@/components/ComSpanTable";
import { GetHeader, GetSearchData, ExportData,GetSearch } from "@/api/Common";
export default {
  name: "DayPlan",
  components: {
    ComSearch,
    ComSpanTable,
  },
  data() {
    return {
      ////////////////// Search /////////////////
      // 多级表头
      generalExportData: [],
      generalExportHeader: [],
      title: "日计划达成列表",
      drawer: false,
      content:'数据加载中',
      formSearchs: [
        {
          datas: {},
          forms: [],
        },
      ],
      btnForm: [],
      tableData: [[]],
      tableColumns: [[]],
      tableLoading: [false],
      isClear: [false],
      tablePagination: [{ pageIndex: 1, pageSize: 200, pageTotal: 0 }],
      height: "707px",
      showPagination: true,
      tagRemark: 0,
      isLoading: false,
      adminLoading:false
    };
  },
  watch: {},
  created() {
    _this = this;
    this.getTableHeader();
  },
  mounted() {
    setTimeout(() => {
      this.setHeight();
    }, 450);
  },
  methods: {
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
      debugger;
      let form = JSON.parse(JSON.stringify(this.formSearchs[remarkTb].datas));
      form["rows"] = 0;
      debugger;
      let res = await ExportData(form);
      this.adminLoading = false;
     this.$store.dispatch("user/exportData", res.data);
    },
    // 导出多级表头
    async exportmoreExcel(remarkTb) {
   this.adminLoading = true;
      debugger;
      let form = JSON.parse(JSON.stringify(this.formSearchs[remarkTb].datas));
      form["rows"] = 0;
      debugger;
      let res = await ExportData(form);
      this.adminLoading = false;
     this.$store.dispatch("user/exportData", res.data);
    },
    // 导出多级表头
    exportMoreData(wb, title) {
      /* 获取二进制字符串作为输出 */
      var wbout = XLSX.write(wb, {
        bookType: "xlsx",
        bookSST: true,
        type: "array",
      });
      try {
        FileSaver.saveAs(
          //Blob 对象表示一个不可变、原始数据的类文件对象。
          //Blob 表示的不一定是JavaScript原生格式的数据。
          //File 接口基于Blob，继承了 blob 的功能并将其扩展使其支持用户系统上的文件。
          //返回一个新创建的 Blob 对象，其内容由参数中给定的数组串联组成。
          new Blob([wbout], { type: "application/octet-stream" }),
          //设置导出文件名称
          `${title}.xlsx`
        );
      } catch (e) {
        if (typeof console !== "undefined") this.$message.error(e);
      }
      this.adminLoading = false;
      return wbout;
    },
    // 保存
    dataSave(remarkTb) {},
    // 获取表头数据
    async getTableHeader() {
      let IDs = [{ ID: 6723 }];
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
      form["rows"] = 0;
      form["page"] = this.tablePagination[remarkTb].pageIndex;
      let res = await GetSearch(form,'/APSAPI/GetDayPlanReport');
      const { result, data, count, msg,content } = res.data;
      if (result) {
 
        this.content=content;
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
  },
};
</script>