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
      <div class="admin_content">
        <div
          class="echart_up"
          ref="echart_up"
        >
          <div
            id="echart_one"
            class="echart"
          ></div>
        </div>
        <div class="ant-table-title">
          <el-row>
            <el-col :span="4"><span class="title">{{ title }}</span></el-col>
            <el-col
              :span="20"
              class="flex_flex_end"
            >
              <el-divider direction="vertical"></el-divider>
              <el-tooltip
                class="item"
                effect="dark"
                content="刷新"
                placement="bottom"
              >
                <span class="right_icon">
                  <span
                    @click="refrshPage"
                    role="img"
                    aria-label="redo"
                    class="anticon anticon-redo icon_size"
                  ><svg
                      class=""
                      data-icon="redo"
                      width="1em"
                      height="1em"
                      fill="currentColor"
                      aria-hidden="true"
                      viewBox="64 64 896 896"
                      focusable="false"
                    >
                      <path d="M758.2 839.1C851.8 765.9 912 651.9 912 523.9 912 303 733.5 124.3 512.6 124 291.4 123.7 112 302.8 112 523.9c0 125.2 57.5 236.9 147.6 310.2 3.5 2.8 8.6 2.2 11.4-1.3l39.4-50.5c2.7-3.4 2.1-8.3-1.2-11.1-8.1-6.6-15.9-13.7-23.4-21.2a318.64 318.64 0 01-68.6-101.7C200.4 609 192 567.1 192 523.9s8.4-85.1 25.1-124.5c16.1-38.1 39.2-72.3 68.6-101.7 29.4-29.4 63.6-52.5 101.7-68.6C426.9 212.4 468.8 204 512 204s85.1 8.4 124.5 25.1c38.1 16.1 72.3 39.2 101.7 68.6 29.4 29.4 52.5 63.6 68.6 101.7 16.7 39.4 25.1 81.3 25.1 124.5s-8.4 85.1-25.1 124.5a318.64 318.64 0 01-68.6 101.7c-9.3 9.3-19.1 18-29.3 26L668.2 724a8 8 0 00-14.1 3l-39.6 162.2c-1.2 5 2.6 9.9 7.7 9.9l167 .8c6.7 0 10.5-7.7 6.3-12.9l-37.3-47.9z"></path>
                    </svg></span>
                </span>
              </el-tooltip>
              <el-divider direction="vertical"></el-divider>
              <el-tooltip
                effect="dark"
                content="列设置"
                placement="bottom"
              >
                <span class="right_icon">
                  <span
                    role="img"
                    aria-label="setting"
                    class="anticon anticon-setting icon_size"
                  ><svg
                      class=""
                      data-icon="setting"
                      width="1em"
                      height="1em"
                      fill="currentColor"
                      aria-hidden="true"
                      viewBox="64 64 896 896"
                      focusable="false"
                    >
                      <path d="M924.8 625.7l-65.5-56c3.1-19 4.7-38.4 4.7-57.8s-1.6-38.8-4.7-57.8l65.5-56a32.03 32.03 0 009.3-35.2l-.9-2.6a443.74 443.74 0 00-79.7-137.9l-1.8-2.1a32.12 32.12 0 00-35.1-9.5l-81.3 28.9c-30-24.6-63.5-44-99.7-57.6l-15.7-85a32.05 32.05 0 00-25.8-25.7l-2.7-.5c-52.1-9.4-106.9-9.4-159 0l-2.7.5a32.05 32.05 0 00-25.8 25.7l-15.8 85.4a351.86 351.86 0 00-99 57.4l-81.9-29.1a32 32 0 00-35.1 9.5l-1.8 2.1a446.02 446.02 0 00-79.7 137.9l-.9 2.6c-4.5 12.5-.8 26.5 9.3 35.2l66.3 56.6c-3.1 18.8-4.6 38-4.6 57.1 0 19.2 1.5 38.4 4.6 57.1L99 625.5a32.03 32.03 0 00-9.3 35.2l.9 2.6c18.1 50.4 44.9 96.9 79.7 137.9l1.8 2.1a32.12 32.12 0 0035.1 9.5l81.9-29.1c29.8 24.5 63.1 43.9 99 57.4l15.8 85.4a32.05 32.05 0 0025.8 25.7l2.7.5a449.4 449.4 0 00159 0l2.7-.5a32.05 32.05 0 0025.8-25.7l15.7-85a350 350 0 0099.7-57.6l81.3 28.9a32 32 0 0035.1-9.5l1.8-2.1c34.8-41.1 61.6-87.5 79.7-137.9l.9-2.6c4.5-12.3.8-26.3-9.3-35zM788.3 465.9c2.5 15.1 3.8 30.6 3.8 46.1s-1.3 31-3.8 46.1l-6.6 40.1 74.7 63.9a370.03 370.03 0 01-42.6 73.6L721 702.8l-31.4 25.8c-23.9 19.6-50.5 35-79.3 45.8l-38.1 14.3-17.9 97a377.5 377.5 0 01-85 0l-17.9-97.2-37.8-14.5c-28.5-10.8-55-26.2-78.7-45.7l-31.4-25.9-93.4 33.2c-17-22.9-31.2-47.6-42.6-73.6l75.5-64.5-6.5-40c-2.4-14.9-3.7-30.3-3.7-45.5 0-15.3 1.2-30.6 3.7-45.5l6.5-40-75.5-64.5c11.3-26.1 25.6-50.7 42.6-73.6l93.4 33.2 31.4-25.9c23.7-19.5 50.2-34.9 78.7-45.7l37.9-14.3 17.9-97.2c28.1-3.2 56.8-3.2 85 0l17.9 97 38.1 14.3c28.7 10.8 55.4 26.2 79.3 45.8l31.4 25.8 92.8-32.9c17 22.9 31.2 47.6 42.6 73.6L781.8 426l6.5 39.9zM512 326c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm79.2 255.2A111.6 111.6 0 01512 614c-29.9 0-58-11.7-79.2-32.8A111.6 111.6 0 01400 502c0-29.9 11.7-58 32.8-79.2C454 401.6 482.1 390 512 390c29.9 0 58 11.6 79.2 32.8A111.6 111.6 0 01624 502c0 29.9-11.7 58-32.8 79.2z"></path>
                    </svg></span>
                </span>
              </el-tooltip>
            </el-col>
          </el-row>
        </div>
        <ComVxeTable
          :rowKey="'RowNumber'"
          :height="height"
          :tableData="tableData[0]"
          :tableHeader="tableColumns[0]"
          :tableLoading="tableLoading[0]"
          :remark="0"
          :sysID="7777"
          :isSpanMethods="true"
          :isClear="isClear[0]"
          :cellStyle="cellStyle"
          :pagination="tablePagination[0]"
          @pageChange="pageChange"
          @pageSize="pageSize"
          @sortChange="sortChange"
        />
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
  name: "OrgReport",
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
      title: "不达成维护列表",
      drawer: false,
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
            data: ["目标值"],
            textStyle: {
              fontSize: 12,
              color: "#151515",
              fontWeight: "900",
            },
            top: "0%",
            align: "right",
            right: "15%",
          },
          {
            data: ["实际值"],
            textStyle: {
              fontSize: 12,
              color: "#151515",
              fontWeight: "900",
            },
            align: "right",
            top: "7%",
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
            name: "目标值",
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
            name: "实际值",
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
      let echartHeight = this.$refs.echart_up.offsetHeight;
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
      let IDs = [{ ID: 7777 }];
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
        this.formSearchs[0].datas["IsReceive"] = 1;
        this.getTableData(this.formSearchs[0].datas, 0);
      }
    },
    // 获取图表数据
    async getEchartData() {
      let form = {};
      form["rows"] = 0;
      form["IsReceive"] = 1;
      if (this.formSearchs[0].datas["PlanDay"]) {
        form["PlanDay"] = this.formSearchs[0].datas["PlanDay"];
      } else {
        form["PlanDay"] = formatDate.formatOldDate();
      }
      form["dicID"] = 7777;
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
            manNumber.push(x.NoReceiveNum);
            womanNumber.push(x.NoDefendNum);
          });
          _this.$set(_this.echart_one.xAxis, "data", xData);
          _this.$set(_this.echart_one.series[0], "data", manNumber);
          _this.$set(_this.echart_one.series[1], "data", womanNumber);

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
      this.getEchartData();
      this.$set(this.tableLoading, remarkTb, true);
      form["rows"] = this.tablePagination[remarkTb].pageSize;
      form["page"] = this.tablePagination[remarkTb].pageIndex;
      let res = await GetSearchData(form);
      const { result, data, count, msg } = res.data;
      if (result) {
        if (data.length != 0) {
          data.forEach((x) => {
            if (x.MFGOrganizeID == -1) {
              this.$set(x, "summary", true);
            }
          });
        }
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
    // 列样式
    cellStyle({ row, column }) {
      if (column.property == "NoDefendNum") {
        return {
          color: "red",
          fontWeight:'bold'
        };
      }
      if (column.property == "DefendRate") {
        if (
          parseFloat(row.DefendRate.substring(0, row.DefendRate.length - 1)) <
          95
        ) {
          return {
            background: "#fb8d8d",
          };
        } else {
          return {
            background: "#aeffae",
          };
        }
      }
    },
  },
};
</script>