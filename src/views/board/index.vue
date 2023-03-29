<template>
  <div id="app">
    <div class="el-header">
      <div class="logo"></div>
      <h1>JG-APS物料采购看板</h1>
      <div class="showTime">{{ todayDate }}</div>
    </div>
    <div class="mainbox">
      <div class="row1">
        <div class="panel two line">
          <div class="chartHead">
            <h2>待生产订单</h2>
          </div>
          <div
            class="chart1"
            v-loading="tableLoading[0]"
            element-loading-background="#060765"
          >
            <dv-scroll-board :config="config[0]" style="height: 100%" />
          </div>
          <div class="panel-footer"></div>
        </div>
        <div class="panel two pie">
          <div class="chartHead">
            <h2>物料需求汇总</h2>
          </div>
          <div
            class="chart1"
            v-loading="tableLoading[1]"
            element-loading-background="#060765"
          >
            <dv-scroll-board :config="config[1]" style="height: 100%" />
          </div>
          <div class="panel-footer"></div>
        </div>
      </div>
      <div class="row2">
        <div class="panel three circle">
          <div class="chartHead">
            <h2>物料需求车间</h2>
          </div>
          <div class="chart2" ref="chart1"></div>
          <div class="panel-footer"></div>
        </div>
        <div class="panel three circle">
          <div class="chartHead">
            <h2>缺料TOP6</h2>
          </div>
          <div class="chart2" ref="chart2"></div>
          <div class="panel-footer"></div>
        </div>
        <div class="panel three bar1">
          <div class="chartHead">
            <h2>采购申请概览</h2>
          </div>
          <div
            class="chart2"
            v-loading="tableLoading[2]"
            element-loading-background="#060765"
          >
            <dv-scroll-board :config="config[2]" style="height: 100%" />
          </div>
          <div class="panel-footer"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
var _this;
import * as echarts from "echarts";
import { debounce } from "lodash";
import { GetSearchData } from "@/api/Common";
export default {
  name: "Board",
  data() {
    return {
      handleWindowResizeDebounced: null,
      tableLoading: [false, false, false], //每个表加载
      formSearchs: [
        //不同标签页面的查询条件
        {
          datas: {
            sort: "CreatedOn desc",
            dicID: 9036,
            IsClose: "否",
            Status: 1,
            page: 1,
            row: 1000,
          }, //查询入参
        },
        {
          datas: {
            dicID: 9062,
            page: 1,
            rows: 1000,
          }, //查询入参
        },
        {
          datas: { dicID: 7898, page: 1, rows: 1000 },
        },
      ],
      todayDate: "",
      config: [
        {
          header: [],
          data: [],
          columnWidth: [],
          oddRowBGC: "#12137900",
          evenRowBGC: "#121379",
          rowNum: 10,
          waitTime: 5000,
          carousel: "page",
        },
        {
          header: [],
          data: [],
          columnWidth: [],
          oddRowBGC: "#12137900",
          evenRowBGC: "#121379",
          rowNum: 10,
        },
        {
          header: [],
          data: [],
          columnWidth: [],
          oddRowBGC: "#12137900",
          evenRowBGC: "#121379",
          rowNum: 3,
        },
      ],
      chartData1: [],
      chartData2: [[], []],
      chartTotal1: 2562,
      chart: [],
      chartOptions: [],
    };
  },
  components: {},
  watch: {},
  created() {
    this.todayDate = this.showtime();
    _this = this;
  },
  async mounted() {
    //表格接口调用
    this.formSearchs.map(async (item, index) => {
      this.getTableData(item.datas, index);
    });
    await this.getEchartsData1();
    await this.getEchartsData2();
    //初始化图表;
    this.chart = [this.$refs.chart1, this.$refs.chart2];
    await this.getEcharts();
    // 在窗口大小变化时，调用 resize 方法重新渲染图表
    this.handleWindowResizeDebounced = debounce(this.handleWindowResize, 200); //设置防抖
    window.addEventListener("resize", this.handleWindowResizeDebounced);
  },
  beforeDestroy() {
    // 在组件销毁时，移除 resize 事件监听器
    window.removeEventListener("resize", this.handleWindowResizeDebounced);
    this.handleWindowResizeDebounced.cancel();
  },
  methods: {
    // 渲染echart图
    barData(id, option) {
      // echarts.dispose(id);
      echarts.init(id).setOption(option);
    },
    getEcharts() {
      //获取屏幕宽度并计算比例
      function fontSize(res) {
        let clientWidth =
          window.innerWidth ||
          document.documentElement.clientWidth ||
          document.body.clientWidth;
        if (!clientWidth) return;
        return res * (clientWidth / 1920);
      }
      this.chartOptions = [
        {
          textStyle: {
            fontSize: fontSize(14),
          },
          color: ["#00FFFF", "#0085FF", "#BC4EFF", "#FF35A2", "#1EAF72"],
          legend: {
            itemGap: fontSize(20),
            orient: "vertical",
            left: "50%",
            top: "center",
            icon: "circle",
            itemWidth: fontSize(14),
            itemHeight: fontSize(14),
            itemStyle: {},
            textStyle: {
              color: "#fff",
              padding: [0, 0, 0, 12],
            },
            formatter: function (name) {
              let prefect;
              _this.chartData1.map((item) => {
                if (item.name == name) {
                  prefect =
                    ((item.value / _this.chartTotal1) * 100).toFixed(2) + "%";
                }
              });
              return name + "      " + prefect;
            },
          },
          grid: {
            left: "10%",
            containLabel: true,
          },
          series: [
            {
              name: "数据来源",
              type: "pie",
              radius: ["65%", "80%"],
              center: ["25%", "50%"],
              avoidLabelOverlap: false,
              labelLine: {
                show: false,
              },
              data: this.chartData1,
              itemStyle: {
                labelLine: {
                  show: false,
                },
                // color: function (params) {
                //自定义颜色
                // return params.data.color;
                // },
              },
              label: {
                //饼图中间文字设置
                fontSize: fontSize(18),
                show: true,
                position: "center",
                color: "#fff",
                formatter: "总数量" + "\n\n" + this.chartTotal1,
              },
              emphasis: {
                label: {
                  show: true,
                  // fontSize: "14",
                  // fontWeight: "bold",
                },
              },
            },
          ],
        },
        {
          textStyle: {
            fontSize: fontSize(14),
          },
          grid: {
            left: "2%",
            right: "2%",
            bottom: "5%",
            top: "10%",
            containLabel: true, //是否包含刻度标签
          },
          // 图表数据
          xAxis: {
            type: "category",
            data: this.chartData2[0],
            axisLine: {
              lineStyle: {
                color: "#75A1F4",
              },
            },
            axisLabel: {
              interval: 0,
              margin: 15,
              color: "#BEE0FF",
              fontSize: fontSize(14),
              formatter: function (value) {
                if (value.length > 6) {
                  return value.substring(0, 6) + "..."; // 只显示前6个字符
                } else {
                  return value;
                }
              },
            },
            axisTick: {
              show: false,
            },
          },
          yAxis: {
            type: "value",
            splitNumber: 4, // 刻度数量为 4
            inverse: true,
            splitLine: {
              lineStyle: {
                color: "#4B4CCE",
                type: "dashed",
              },
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              fontSize: fontSize(14),
            },
            axisLine: {
              show: false,

              lineStyle: {
                color: "#75A1F4",
              },
            },
          },
          series: [
            {
              data: this.chartData2[1],
              type: "bar",
              itemStyle: {
                color: "#00FFFF",
              },
              barWidth: "30%",
              label: {
                show: true,
                position: "top",
              },
            },
          ],
        },
      ];
      this.chart.map((item, index) => {
        this.barData(item, this.chartOptions[index]);
      });
      // 调用 resize 方法重新渲染图表
      setTimeout(() => {
        this.chart.map((item) => {
          echarts.init(item).resize();
        });
      }, 100);
    },
    handleWindowResize() {
      this.getEcharts();
    },
    showtime() {
      const now = new Date();
      const year = now.getFullYear(); // 获取当前年份
      const month = now.getMonth() + 1; // 获取当前月份，注意月份从 0 开始，所以要加 1
      const day = now.getDate(); // 获取当前日期
      const weekDay = now.getDay(); // 获取当前星期几，0 表示星期天，1 表示星期一，以此类推
      const weekDayNames = [
        "星期日",
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六",
      ];
      const weekDayName = weekDayNames[weekDay]; // 获取星期几的名称
      return `${year}年${month}月${day}日 ${weekDayName}`;
    },
    // 获取表格数据
    async getTableData(params, index) {
      this.$set(this.tableLoading, index, true);
      let res = await GetSearchData(params);
      const { result, data, count, msg, AppColumns } = res.data;
      if (result) {
        //对数据进行处理
        const propValues = data.reduce((acc, obj) => {
          const values = [];
          AppColumns.forEach((propObj) => {
            if (obj[propObj.prop]) {
              values.push(obj[propObj.prop]);
            } else {
              values.push("");
            }
          });
          if (values.length > 0) {
            acc.push(values);
          }
          return acc;
        }, []);
        this.$set(this.config[index], "data", propValues);
        //设置宽度
        this.$set(
          this.config[index],
          "columnWidth",
          AppColumns.map((item) => Number(item.appWidth))
        );
        // 查询时重新获取列渲染
        if (AppColumns.length) {
          this.$set(
            this.config[index],
            "header",
            AppColumns.map((item) => item.label)
          );
        }
        this.config[index] = { ...this.config[index] };
        console.log(this.config, "this.config");
        this.$set(this.tableLoading, index, false);
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
    },
    async getEchartsData1() {
      let res = await GetSearchData({
        dicID: 9037,
        groupby: "Dept",
        fields: "SUM(DemandQty) as DemandQty,Dept",
        sort: "Dept",
      });
      const { result, data, msg } = res.data;
      if (result) {
        this.chartTotal1 = data.reduce(
          (accumulator, current) => accumulator + current.DemandQty,
          0
        );
        this.chartData1 = data.map((item) => ({
          value: item.DemandQty,
          name: item.Dept,
        }));
        console.log(this.chartData1, "this.chartData2[0]");
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
    },
    async getEchartsData2() {
      let res = await GetSearchData({
        dicID: 9062,
        sort: "OweQty",
        page: 1,
        rows: 6,
      });
      const { result, data, msg } = res.data;
      if (result) {
        this.chartData2[0] = data.map(
          (item) => item.MaterialName.split(" ")[0]
        );
        this.chartData2[1] = data.map((item) => item.OweQty);
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box !important;
}

// html {
//   width: 100%;
//   height: 100%;
// }
#app {
  font-family: Arial, Helvetica, sans-serif;
  margin: 0;
  padding: 0;
  /*  背景图定位 / 背景图尺寸  cover 完全铺满容器  contain 完整显示在容器内 */
  // background: url(../images/bg.jpg) no-repeat #000;
  background-color: #060765;
  background-size: cover;
  width: 100%;
  height: 100%;
}
.el-header {
  position: relative;
  height: 90px;
  background: url(./headBg.png) no-repeat top center;
  background-size: 100% 100%;
  .logo {
    position: absolute;
    height: 29px;
    width: 131px;
    left: 104px;
    top: 20px;
    background: url(./FSZM.png) no-repeat;
    background-size: 100% 100%;
  }
  h1 {
    font-size: 38px;
    color: #fff;
    text-align: center;
    height: 90px;
    font-weight: 600;
    line-height: 90px;
  }
  .showTime {
    position: absolute;
    height: 28px;
    right: 87px;
    top: 20px;
    color: #89bfff;
    font-weight: 400;
    line-height: 28px;
  }
}
.mainbox {
  width: 100%;
  height: calc(100% - 90px);
  // min-width: 1024px;
  // max-width: 1920px;
  padding: 0 20px 20px 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .row1 {
    width: 100%;
    display: flex;
    justify-content: space-between;
    height: 64%;
  }
  .row2 {
    width: 100%;
    overflow: hidden;
    display: flex;
    justify-content: space-between;
    height: 34%;
  }
}
.panel {
  position: relative;
  &.two {
    width: 49.5%;
    height: 100%;
  }
  &.three {
    width: 32.5%;
    height: 100%;
  }
  border: 1px solid rgba(73, 109, 204, 0.7);
  background: radial-gradient(
      58.45% 153.7% at 7.24% 1.57%,
      rgba(16, 17, 131, 0.7) 0%,
      rgba(6, 7, 101, 0.7) 100%
    )
    /* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */;
  box-shadow: inset 0px 0px 10px #455ac7;
  margin-bottom: 10px;
  .panel-footer {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    &::before {
      position: absolute;
      bottom: 0;
      left: 0;
      content: "";
      width: 10px;
      height: 10px;
      border-bottom: 2px solid #67d1ff;
      border-left: 2px solid #67d1ff;
    }
    &::after {
      position: absolute;
      bottom: 0;
      right: 0;
      content: "";
      width: 10px;
      height: 10px;
      border-bottom: 2px solid #67d1ff;
      border-right: 2px solid #67d1ff;
    }
  }
  .chartHead {
    width: 100%;
    background: url(./chartHead.png) no-repeat;
    height: 55px;
    background-size: 100% 100%;
  }
  h2 {
    height: 55px;
    line-height: 55px;
    padding-left: 25px;
    color: #fff;
    font-size: 22px;
    font-weight: 400;
  }
  .chart1 {
    padding: 9px 12px;
    height: calc(100% - 55px);
  }
  .chart2 {
    padding: 9px 12px;
    overflow: hidden;
    height: calc(100% - 55px);
  }
  ::v-deep.dv-scroll-board {
    overflow: hidden;
    font-size: 18px;
    .header {
      background-color: rgba(0, 255, 255, 0.2) !important;
      border-bottom: 2px solid #00ffff;
      color: #00ffff;
      font-weight: 400;
      height: 50px;
      .header-item {
        height: 50px !important;
        line-height: 50px !important;
      }
    }
    .rows {
      .row-item {
        height: 50px !important;
        line-height: 50px !important;
        color: #bee0ff;
      }
    }
  }
}
</style>
