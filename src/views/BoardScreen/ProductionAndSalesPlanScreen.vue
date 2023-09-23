<template>
  <div id="Screen">
    <div class="el-header">
      <svg-icon icon-class="ScreenHeader1" class="ScreenHeader1"></svg-icon>
    </div>
    <!-- <div
      class="el-header"
      :style="{
        backgroundImage: `url(${headBg})`,
      }"
    >
      <div class="logo"></div>
      <h1>JG-APS物料采购看板</h1>
      <div class="showTime">{{ todayDate }}</div>
    </div> -->
    <div class="mainbox">
      <div class="row1">
        <div class="panel two line">
          <div class="chartHead">
            <div class="panel-footer"></div>
            <h2>出货计划</h2>
          </div>
          <div
            class="chart1 flex_colummn"
            element-loading-background="#060765"
          >
            <div class="tableHead"></div>
            <VueSeamlessScroll :data="tableData[0]" class="warp">
              <ul class="item">
                <li v-for="(item, index) in tableData[0]" :key="index">
                  <span class="title" v-text="item.AllUnIssuedQty"></span>
                  <span class="date" v-text="item.AllUnIssuedQty"></span>
                  <span class="date" v-text="item.AllUnIssuedQty"></span>
                  <span class="date" v-text="item.AllUnIssuedQty"></span>
                  <span class="date" v-text="item.AllUnIssuedQty"></span>
                  <span class="date" v-text="item.AllUnIssuedQty"></span>
                  <span class="date" v-text="item.AllUnIssuedQty"></span>
                  <span class="date" v-text="item.AllUnIssuedQty"></span>
                  <span class="date" v-text="item.AllUnIssuedQty"></span>
                  <span class="date" v-text="item.AllUnIssuedQty"></span>
                  <span class="date" v-text="item.AllUnIssuedQty"></span>
                  <span class="date" v-text="item.AllUnIssuedQty"></span>
                  <span class="date" v-text="item.AllUnIssuedQty"></span>
                  <span class="date" v-text="item.AllUnIssuedQty"></span>
                  <span class="date" v-text="item.AllUnIssuedQty"></span>
                </li>
              </ul>
            </VueSeamlessScroll>
          </div>
        </div>
        <div class="panel two pie">
          <div class="chartHead">
            <div class="panel-footer"></div>

            <h2>物料需求汇总</h2>
          </div>
          <div class="chart1" element-loading-background="#060765"></div>
        </div>
      </div>
      <div class="row2">
        <div class="panel three circle">
          <div class="chartHead">
            <div class="panel-footer"></div>

            <h2>本月出货趋势</h2>
          </div>
          <div class="chart2" ref="chart1"></div>
          <div class="panel-footer"></div>
        </div>
        <div class="panel three circle">
          <div class="chartHead">
            <div class="panel-footer"></div>

            <h2>本月出货部门占比</h2>
          </div>
          <div class="chart2" ref="chart2"></div>
        </div>
        <div class="panel three bar1">
          <div class="chartHead">
            <div class="panel-footer"></div>

            <h2>近一周计划达成趋势</h2>
          </div>
          <div
            class="chart2"
            v-loading="tableLoading[2]"
            element-loading-background="#060765"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
var _this;
import * as echarts from 'echarts';
import { debounce } from 'lodash';
import chartHead from '@/assets/imgs/chartHead.png';
import logo from '../../../public/images/logo.png';
import { GetSearchData } from '@/api/Common';
import VueSeamlessScroll from 'vue-seamless-scroll';
import { GetHeader } from '@/api/Common';
export default {
  name: 'ProductionAndSalesPlanScreen',
  data() {
    return {
      chartHead: chartHead,
      logo: logo,
      handleWindowResizeDebounced: null,
      tableLoading: [false, false, false], //每个表加载
      todayDate: '',
      chartData1: [],
      chartData2: [[], []],
      chartTotal1: 2562,
      sysID: [{ ID: 5610 }, { ID: 5610 }, { ID: 5610 }],
      chart: [],
      chartOptions: [],
      tableColumns: [[], [], []],
      tableData: [[], [], []],

      tablePagination: [
        { pageIndex: 1, pageSize: 100, pageTotal: 0 },
        { pageIndex: 1, pageSize: 15, pageTotal: 0 },
        { pageIndex: 1, pageSize: 15, pageTotal: 0 },
        { pageIndex: 1, pageSize: 100, pageTotal: 0 },
        { pageIndex: 1, pageSize: 100, pageTotal: 0 },
        { pageIndex: 1, pageSize: 100, pageTotal: 0 },
        { pageIndex: 1, pageSize: 0, pageTotal: 0 },
        { pageIndex: 1, pageSize: 0, pageTotal: 0 },
        { pageIndex: 1, pageSize: 0, pageTotal: 0 },
        { pageIndex: 1, pageSize: 0, pageTotal: 0 },
        { pageIndex: 1, pageSize: 0, pageTotal: 0 },
        { pageIndex: 1, pageSize: 0, pageTotal: 0 },
        { pageIndex: 1, pageSize: 0, pageTotal: 0 },
      ],
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
    };
  },
  components: {
    VueSeamlessScroll,
  },
  watch: {},
  created() {
    this.todayDate = this.showtime();
    _this = this;
    this.getTableHeader();
  },
  async mounted() {
    //初始化图表;
    this.chart = [
      this.$refs.chart1,
      this.$refs.chart2,
      this.$refs.chart3,
      this.$refs.chart4,
      this.$refs.chart5,
    ];
    // 在窗口大小变化时，调用 resize 方法重新渲染图表
    this.handleWindowResizeDebounced = debounce(this.handleWindowResize, 200); //设置防抖
    window.addEventListener('resize', this.handleWindowResizeDebounced);
  },
  beforeDestroy() {
    // 在组件销毁时，移除 resize 事件监听器
    window.removeEventListener('resize', this.handleWindowResizeDebounced);
    this.handleWindowResizeDebounced.cancel();
  },
  methods: {
    // 渲染echart图
    barData(id, option) {
      // echarts.dispose(id);
      echarts.init(id).setOption(option);
    },

    // 获取表头数据
    async getTableHeader() {
      let res = await GetHeader(this.sysID);
      const { datas, forms, result, msg } = res.data;

      if (result) {
        // 获取每个表头
        datas.some((m, i) => {
          m.some((n, index) => {});
          this.$set(this.tableColumns, i, m);
        });
        // 获取查询的初始化字段 组件 按钮

        await Promise.all(
          forms.map(async (x, z) => {
            this.$set(this.formSearchs[z].datas, 'dicID', this.sysID[z].ID);
            await this.getTableData(this.formSearchs[z].datas, z);
          }),
        );
        this.adminLoading = false;
        // await this.getEcharts();
      }
    },
    async getEcharts() {
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
          color: ['#00FFFF', '#0085FF', '#BC4EFF', '#FF35A2', '#1EAF72'],
          legend: {
            itemGap: fontSize(20),
            orient: 'vertical',
            left: '50%',
            top: 'center',
            icon: 'circle',
            itemWidth: fontSize(14),
            itemHeight: fontSize(14),
            itemStyle: {},
            textStyle: {
              color: '#fff',
              padding: [0, 0, 0, 12],
            },
            formatter: function (name) {
              let prefect;
              _this.chartData1.map((item) => {
                if (item.name == name) {
                  prefect =
                    ((item.value / _this.chartTotal1) * 100).toFixed(2) + '%';
                }
              });
              return name + '      ' + prefect;
            },
          },
          grid: {
            left: '10%',
            containLabel: true,
          },
          series: [
            {
              name: '数据来源',
              type: 'pie',
              radius: ['65%', '80%'],
              center: ['25%', '50%'],
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
                position: 'center',
                color: '#fff',
                formatter: '总数量' + '\n\n' + this.chartTotal1,
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
            left: '2%',
            right: '2%',
            bottom: '5%',
            top: '10%',
            containLabel: true, //是否包含刻度标签
          },
          // 图表数据
          xAxis: {
            type: 'category',
            data: this.chartData2[0],
            axisLine: {
              lineStyle: {
                color: '#75A1F4',
              },
            },
            axisLabel: {
              interval: 0,
              margin: 15,
              color: '#BEE0FF',
              fontSize: fontSize(14),
              formatter: function (value) {
                if (value.length > 6) {
                  return value.substring(0, 6) + '...'; // 只显示前6个字符
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
            type: 'value',
            splitNumber: 4, // 刻度数量为 4
            inverse: true,
            splitLine: {
              lineStyle: {
                color: '#4B4CCE',
                type: 'dashed',
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
                color: '#75A1F4',
              },
            },
          },
          series: [
            {
              data: this.chartData2[1],
              type: 'bar',
              itemStyle: {
                color: '#00FFFF',
              },
              barWidth: '30%',
              label: {
                show: true,
                position: 'top',
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
        '星期日',
        '星期一',
        '星期二',
        '星期三',
        '星期四',
        '星期五',
        '星期六',
      ];
      const weekDayName = weekDayNames[weekDay]; // 获取星期几的名称
      return `${year}年${month}月${day}日 ${weekDayName}`;
    },
    // 获取表格数据
    // 获取表格数据
    async getTableData(form, remarkTb) {
      this.$set(this.tableLoading, remarkTb, true);
      form['rows'] = this.tablePagination[remarkTb].pageSize;
      form['page'] = this.tablePagination[remarkTb].pageIndex;
      let res = await GetSearchData(form);
      const { result, data, count, msg, Columns } = res.data;
      if (result) {
        this.$set(this.tableData, remarkTb, data);
        this.$set(this.tablePagination[remarkTb], 'pageTotal', count);
      } else {
        this.$message({
          message: msg,
          type: 'error',
          dangerouslyUseHTMLString: true,
        });
      }

      this.$set(this.tableLoading, remarkTb, false);
    },
    async getEchartsData1() {
      let res = await GetSearchData(
        {
          dicID: 9037,
          groupby: 'Dept',
          fields: 'SUM(DemandQty) as DemandQty,Dept',
          sort: 'DemandQty desc',
        },
        '6E8BF76C6BA5B0D8',
      );
      const { result, data, msg } = res.data;
      if (result) {
        this.chartTotal1 = data.reduce(
          (accumulator, current) => accumulator + current.DemandQty,
          0,
        );
        this.chartData1 = data.map((item) => ({
          value: item.DemandQty,
          name: item.Dept,
        }));
        console.log(this.chartData1, 'this.chartData2[0]');
      } else {
        this.$message({
          message: msg,
          type: 'error',
          dangerouslyUseHTMLString: true,
        });
      }
    },
    async getEchartsData2() {
      let res = await GetSearchData(
        {
          dicID: 9062,
          sort: 'OweQty',
          page: 1,
          rows: 6,
        },
        '6E8BF76C6BA5B0D8',
      );
      const { result, data, msg } = res.data;
      if (result) {
        this.chartData2[0] = data.map(
          (item) => item.MaterialName.split(' ')[0],
        );
        this.chartData2[1] = data.map((item) => item.OweQty);
      } else {
        this.$message({
          message: msg,
          type: 'error',
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

#Screen {
  font-family: Arial, Helvetica, sans-serif;
  margin: 0;
  padding: 0;
  /*  背景图定位 / 背景图尺寸  cover 完全铺满容器  contain 完整显示在容器内 */
  // background: url(../images/bg.jpg) no-repeat #000;
  background-color: #000;
  background-size: cover;
  width: 100vw;
  height: 100vh;
}
.el-header {
  position: relative;
  height: 87px;
  width: 100%;
  // background: url(headBg) no-repeat top center;
  // background-size: 100% 100%;
  .ScreenHeader1 {
    width: 100%;
    height: 100%;
  }
  .logo {
    position: absolute;
    height: 29px;
    width: 131px;
    left: 104px;
    top: 20px;
    // background: url(./FSZM.png) no-repeat;
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
  height: calc(100% - 87px);
  // min-width: 1024px;
  // max-width: 1920px;
  padding: 10px;
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
  border: 1px solid rgba(76, 130, 194, 1);
  box-shadow: 0px 7px 15px 0px rgba(32, 69, 143, 1) inset;
  background: linear-gradient(0deg, #030a2c, #030a2c),
    linear-gradient(0deg, #4c82c2, #4c82c2);
  margin-bottom: 10px;
  clip-path: polygon(
    100% 0%,
    100% calc(100% - 10px),
    calc(100% - 10px) 100%,
    10px 100%,
    0 calc(100% - 10px),
    0 0
  );

  .chartHead {
    width: 100%;
    background: linear-gradient(
      90deg,
      rgba(11, 22, 80, 0.22) -0.44%,
      rgba(34, 49, 129, 0.43) 49.71%,
      rgba(16, 27, 86, 0.28) 100.44%
    );
    .panel-footer {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      &::before {
        position: absolute;
        left: 0;
        content: '';
        width: 10px;
        height: 48px;
        border-left: 4px solid rgba(87, 235, 255, 1);
      }
    }
    // background: url(../../assets/imgs/chartHead.png) no-repeat;
    height: 48px;
    background-size: 100% 100%;
  }
  h2 {
    font-family: PingFang SC;
    padding-left: 25px;
    font-size: 20px;
    font-weight: 500;
    line-height: 48px;
    letter-spacing: 0em;
    text-align: left;
    color: rgba(0, 178, 255, 1);
  }
  .chart1 {
    .tableHead {
      height: 50px;
      background: rgba(53, 64, 117, 1);
    }
    padding: 9px 12px;
    height: calc(100% - 48px);
    .warp {
      width: 100%;
      height: 100%;
      color: #fff;
      overflow: hidden;
      ul {
        list-style: none;
        padding: 0;
        margin: 0 auto;
        li,
        a {
          display: block;
          height: 50px;
          line-height: 50px;
          display: grid;
          font-size: 18px;
          gap: 10px; /* 元素之间的间隔为10px */
          grid-auto-flow: column; /* 水平排列元素 */
        }
      }
    }
  }
  .chart2 {
    padding: 9px 12px;
    overflow: hidden;
    height: calc(100% - 48px);
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
.panel::before {
  content: '';
  position: absolute;
  left: -12px;
  bottom: 0; /* 与 clip-path 的剪切区域匹配 */
  // left: 10px; /* 与 clip-path 的剪切区域匹配 */
  border: 1px solid rgba(76, 130, 194, 1);
  width: 40px;
  box-shadow: 0px 7px 15px 0px rgba(32, 69, 143, 1) inset;
  transform: rotate(45deg);
}
.panel::after {
  content: '';
  position: absolute;
  right: -12px;
  bottom: 0; /* 与 clip-path 的剪切区域匹配 */
  border: 1px solid rgba(76, 130, 194, 1);
  width: 40px;
  box-shadow: 0px 7px 15px 0px rgba(32, 69, 143, 1) inset;
  transform: rotate(315deg);
}
</style>
