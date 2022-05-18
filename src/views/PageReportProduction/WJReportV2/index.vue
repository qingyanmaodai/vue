<!--不达成维护列表-->
<template>
  <div
    class="container"
    v-loading="adminLoading"
  >
    <div
      class="admin_head"
      ref="headRef"
    >
      <div
        v-for="(item,i) in 3"
        :key="i"
        v-show="labelStatus1 == i"
      >
        <ComSearch
          ref="searchRef"
          :searchData="formSearchs[i].datas"
          :searchForm="formSearchs[i].forms"
          :remark="i"
          :isMoreHeader="true"
          :isLoading="isLoading"
          :btnForm="btnForm"
          @btnClick="btnClick"
        />
      </div>
    </div>
    <div>
      <div class="admin_content">
        <!-- <div
          class="echart_up"
          ref="echart_up"
        >
          <div
            id="echart_one"
            class="echart"
          ></div>
        </div> -->
        <div class="ant-table-title">
          <el-row>
            <el-col :span="4"><span class="title">{{ Status1[labelStatus1].title }}</span></el-col>
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
          v-for="(item,i) in 3"
          :key="i"
          v-show="labelStatus1 == i"
        >
          <ComVxeTable
            :rowKey="'RowNumber'"
            :height="height"
            :tableData="tableData[i]"
            :tableHeader="tableColumns[i]"
            :tableLoading="tableLoading[i]"
            :remark="i"
            :sysID="sysID[i].ID"
            :cellStyle="cellStyle"
            :isSpanMethods="true"
            :isClear="isClear[i]"
            :pagination="tablePagination[i]"
            @pageChange="pageChange"
            @pageSize="pageSize"
            @sortChange="sortChange"
          />
        </div>

      </div>
    </div>

    <!-- 导出多级表头的虚拟表 -->
    <el-table
      ref="exportTableRef"
      v-show="false"
      :data="generalExportData"
      :row-key="'RowNumber'"
      height="500px"
    >
      <el-table-column
        v-for="(item, key) in generalExportHeader"
        :key="key"
        :prop="item.prop"
        :label="item.label"
      >
        <template v-if='item.children'>
          <el-table-column
            :prop="i.prop"
            :label="i.label"
            v-for='(i,k) in item.children'
            :key="k"
          >
          </el-table-column>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
var _this;
import XLSX from "xlsx";
import echarts from "echarts";
import FileSaver from "file-saver";
import ComSearch from "@/components/ComSearch";
import ComVxeTable from "@/components/ComVxeTable";
import { GetHeader, GetSearchData, ExportData } from "@/api/Common";
import formatDate from "@/utils/formatDate";
export default {
  name: "WJReportV2",
  components: {
    ComSearch,
    ComVxeTable,
  },
  data() {
    return {
      ////////////////// Search /////////////////
      // 多级表头
      generalExportData: [],
      generalExportHeader: [],
      title: "报废汇总列表",
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
      sysID: [{ ID: 7835 }, { ID: 7836 }, { ID: 7834 }],
      btnForm: [],
      tableData: [[], [], [], []],
      tableColumns: [[], [], [], []],
      tableLoading: [false, false, false, false],
      isClear: [false, false, false, false],
      tablePagination: [
        { pageIndex: 1, pageSize: 200, pageTotal: 0 },
        { pageIndex: 1, pageSize: 200, pageTotal: 0 },
        { pageIndex: 1, pageSize: 200, pageTotal: 0 },
        { pageIndex: 1, pageSize: 200, pageTotal: 0 },
      ],
      height: "707px",
      labelStatus1: 0,
      Status1: [
        { label: "报废汇总", value: 0, title: "报废汇总列表" },
        { label: "报废明细", value: 1, title: "报废明细列表" },
        { label: "报废原因明细", value: 2, title: "报废原因明细列表" },
      ],
      showPagination: true,
      tagRemark: 0,
      isLoading: false,
      adminLoading: false,
      echart_one: {
        title: {
          text: "",
        },
        tooltip: {
          trigger: "axis",
          formatter: function (params) {
            var result = params[0].name + "<br>";
            params.forEach(function (item, i) {
              result +=
                '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' +
                item.color.colorStops[i].color +
                '"></span>';
              result +=
                item.seriesName +
                ": " +
                '<span class="growth">' +
                item.data +
                "</span><br>";
            });
            return result;
          },
        },
        legend: [
          {
            data: ["报废数"],
            textStyle: {
              fontSize: 12,
              color: "#151515",
              fontWeight: "900",
            },
            top: "0%",
            align: "right",
            right: "15%",
          },
        ],
        offset: 20,
        grid: {
          left: "2%",
          right: "2%",
          top: "25%",
          bottom: "12%",
        },
        toolbox: {
          feature: {
            //saveAsImage: {}
          },
        },
        xAxis: {
          type: "category",
          boundaryGap: true,
          axisLabel: {
            margin: 15,
            interval: 0,
            textStyle: {
              color: "#151515",
              fontSize: 13,
            },
          },
          axisTick: {
            show: true,
          },
          axisLine: {
            show: true,
            symbol: ["none", "none"],
            symbolOffset: 12,
            lineStyle: {
              color: "#151515",
            },
          },
          data: [],
        },
        yAxis: {
          type: "value",
          name: "",
          splitLine: { show: false },
          axisLine: {
            show: false,
            symbol: ["none", "arrow"],
            symbolOffset: 12,
            lineStyle: {
              color: "#151515",
            },
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            show: false,
            textStyle: {
              color: "#151515",
              fontSize: 14,
            },
          },
        },
        series: [
          {
            name: "报废数",
            type: "bar",
            barWidth: 20,
            data: [],
            barGap: "40%",
            label: {
              show: true,
              position: "top",
              color: "#151515",
            },
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 1, color: "#0386FF" },
                { offset: 0, color: "#7BF6F9" },
              ]),
            },
            // emphasis: {
            //     itemStyle: {
            //         color: new echarts.graphic.LinearGradient(
            //             0, 0, 0, 1,
            //             [
            //                 { offset: 0, color: '#2378f7' },
            //                 { offset: 0.7, color: '#2378f7' },
            //                 { offset: 1, color: '#83bff6' }
            //             ]
            //         )
            //     }
            // },
          },
          {
            name: "报废数",
            type: "bar",
            barWidth: 20,
            data: [],
            label: {
              show: true,
              position: "top",
              color: "#151515",
            },
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "#FFD680" },
                { offset: 1, color: "#FF8368" },
              ]),
            },
          },
        ],
      },
      // 立体图
      left3DColors: [],
      right3DColors: [],
    };
  },
  watch: {},
  created() {
    _this = this;
    // this.echartStyle();
    this.getTableHeader();
  },
  mounted() {
    setTimeout(() => {
      this.setHeight();
    }, 450);
  },
  methods: {
    drawChart(id, option) {
      let myChart = echarts.init(document.getElementById(id));
      myChart.setOption(option, true);
      let chart = document.getElementById(id);
      echarts.init(chart).resize();
    },
    // 图表的各个样式
    echartStyle() {
      this.left3DColors = [];
      this.right3DColors = [];
      for (let i = 0; i < 20; i++) {
        this.left3DColors.push({
          type: "linear",
          x: 0,
          x2: 1,
          y: 0,
          y2: 0,
          colorStops: [
            {
              offset: 0,
              color: "#88b8FF", // 最左边
            },
            {
              offset: 0.5,
              color: "#8DC2FF", // 左边的右边 颜色
            },
            {
              offset: 0.5,
              color: "#4C71D1", // 右边的左边 颜色
            },
            {
              offset: 1,
              color: "#4C71D1",
            },
          ],
        });
        this.right3DColors.push({
          type: "linear",
          x: 0,
          x2: 1,
          y: 0,
          y2: 0,
          colorStops: [
            {
              offset: 0,
              color: "#4FFFC0",
            },
            {
              offset: 0.5,
              color: "#39F2B0",
            },
            {
              offset: 0.5,
              color: "#2DE0A0",
            },
            {
              offset: 1,
              color: "#2DE0A0",
            },
          ],
        });
      }
    },
    // 高度控制
    setHeight() {
      let headHeight = this.$refs.headRef.offsetHeight;
      // let echartHeight = this.$refs.echart_up.offsetHeight;
      let echartHeight = 0;
      let rem =
        document.documentElement.clientHeight -
        echartHeight -
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
    // 导出多级表头
    async exportmoreExcel(remarkTb) {
      this.adminLoading = true;
      this.$message.info("数据如若过多可能会加载很慢，请耐心等待！");
      this.generalExportHeader = this.tableColumns[remarkTb];
      let newForm = JSON.parse(
        JSON.stringify(this.formSearchs[remarkTb].datas)
      );
      newForm.rows = 0;
      let res = await GetSearchData(newForm);
      const { result, data, count, msg } = res.data;
      if (result) {
        _this.generalExportData = data;
        _this.$nextTick(() => {
          let $e = _this.$refs.exportTableRef.$el;
          var fix = $e.querySelector(".el-table__fixed");
          let wb;
          if (fix) {
            wb = XLSX.utils.table_to_book(
              //导出表格类名
              $e.removeChild(fix)
            );
            $e.appendChild(fix);
          } else {
            wb = XLSX.utils.table_to_book($e, { raw: true });
          }
          // _this[searchData](form)
          _this.exportMoreData(wb, "汇总表");
        });
      } else {
        _this.$message.error(msg);
        _this.isLoading = false;
      }
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
      let IDs = this.sysID;
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
    // 补0
    zero(num) {
      if (Number(num) < 10) {
        return "0" + num;
      } else {
        return num;
      }
    },
    // 获取图表数据
    async getEchartData(remarkTb) {
      let form = {};
      form["rows"] = 0;
      if (this.formSearchs[remarkTb].datas["PlanDay"]) {
        form["PlanDay"] = this.formSearchs[remarkTb].datas["PlanDay"];
      } else {
        form["PlanDay"] =
          new Date().getFullYear() + "-" + this.zero(new Date().getMonth() + 1);
      }
      form["dicID"] = 7847;
      let manNumber = [];
      let womanNumber = [];
      let xData = [];
      let res = await GetSearchData(form);
      const { result, data, count, msg } = res.data;
      if (result) {
        _this.$set(_this.echart_one.xAxis, "data", []);
        _this.echart_one.series.forEach((o) => {
          o.data = [];
        });
        if (data.length != 0) {
          data.forEach((x) => {
            xData.push(x.LineName);
            manNumber.push(x.BadQty);
            // womanNumber.push(x.BadQty);
          });
          _this.$set(_this.echart_one.xAxis, "data", xData);
          _this.$set(_this.echart_one.series[0], "data", manNumber);
          // _this.$set(_this.echart_one.series[1], "data", womanNumber);

          _this.drawChart("echart_one", _this.echart_one);
        }
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
      // if (this.labelStatus1 == 0) {
      //   this.getEchartData(remarkTb);
      // }
      this.$set(this.tableColumns, remarkTb, []);
      this.$set(this.tableLoading, remarkTb, true);
      form["rows"] = this.tablePagination[remarkTb].pageSize;
      form["page"] = this.tablePagination[remarkTb].pageIndex;
      let res = await GetSearchData(form);
      const { result, data, count, msg, Columns } = res.data;
      if (result) {
        _this.$set(_this.tableColumns, remarkTb, Columns[0]);
        this.$nextTick(() => {
          _this.$set(_this.tableData, remarkTb, data);
        });
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
    // 列样式
    cellStyle({ row, column, columnIndex }) {
      if (
        parseFloat(column.property.substring(column.property.length - 1)) >=
          0 &&
        row[column.property] > 0
      ) {
        return {
          color: "red",
          fontWeight: "bold",
        };
      }
    },
    // 改变状态
    changeStatus(item, index) {
      this.labelStatus1 = index;
      if (this.tableData[index].length == 0) {
        this.dataSearch(index);
      }
    },
  },
};
</script>