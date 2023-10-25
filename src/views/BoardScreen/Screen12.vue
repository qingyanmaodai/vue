<template>
  <div id="Screen">
    <div class="el-header">
      <svg-icon icon-class="ScreenHeader1" class="ScreenHeader1" />
      <img class="logo" :src="logo" mode="heightFix" />
      <div class="textTitle">APS生产计划看板</div>
      <div class="showTime">{{ todayDate }}</div>
    </div>
    <div class="mainbox flex-grow overflow-hidden">
      <div class="h-full flex gap-[10px]">
        <div class="h-full w-30/100 flex flex-col gap-[10px]">
          <div class="h-70/100 w-full flex flex-col gap-[10px]">
            <div class="panel h-50/100 w-full">
              <div class="chartHead">
                <div class="panel-footer"></div>

                <h2>欠料分布</h2>
              </div>
              <div class="chartContent" ref="chart0"></div>
            </div>
            <div class="panel h-50/100 w-full">
              <div class="chartHead">
                <div class="panel-footer"></div>

                <h2>欠料排行榜</h2>
              </div>
              <div class="chartContent" ref="chart1"></div>
            </div>
          </div>

          <div class="panel h-30/100 w-full">
            <div class="chartHead">
              <div class="panel-footer"></div>
              <h2>欠料明细</h2>
            </div>
            <div
              class="chartContent flex flex-col"
              element-loading-background="#060765"
            >
              <div class="tableHead flex !px-[10px] text-white w-full">
                <div
                  v-for="(column, index) in tableColumns[0]"
                  :key="'tableHead' + index"
                  class="flex"
                  :class="
                    index < tableColumns[0].length - 1 ? 'mr-[10px]' : 'mr-0'
                  "
                  :style="getColumnStyle(tableColumns[0], column)"
                >
                  {{ column.label }}
                </div>
              </div>
              <VueSeamlessScroll
                :data="tableData[0]"
                class="warp"
                :class-option="{
                  step: 0,
                }"
              >
                <ul class="px-[10px]">
                  <li
                    v-for="(item, index) in tableData[0]"
                    :key="'data' + index"
                    class="flex"
                  >
                    <div
                      v-for="(column, colIndex) in tableColumns[0]"
                      :key="'column' + colIndex"
                      class="truncate"
                      :class="
                        colIndex < tableColumns[0].length - 1
                          ? 'mr-[10px]'
                          : 'mr-0'
                      "
                      :style="getColumnStyle(tableColumns[0], column)"
                    >
                      {{ tableData[0][index][column.prop] }}
                    </div>
                  </li>
                </ul>
              </VueSeamlessScroll>
            </div>
          </div>
        </div>
        <div class="h-full w-40/100 flex flex-col gap-[10px]">
          <div class="panel h-full w-full">
            <div class="chartHead">
              <div class="panel-footer"></div>
              <h2>出货计划</h2>
            </div>
            <div
              class="chartContent flex flex-col"
              element-loading-background="#060765"
            >
              <div class="tableHead flex px-[10px] text-white w-full">
                <div
                  v-for="(column, index) in tableColumns[0]"
                  :key="'tableHead' + index"
                  class="flex"
                  :class="
                    index < tableColumns[0].length - 1 ? 'mr-[10px]' : 'mr-0'
                  "
                  :style="getColumnStyle(tableColumns[0], column)"
                >
                  {{ column.label }}
                </div>
              </div>
              <VueSeamlessScroll
                :data="tableData[0]"
                class="warp"
                :class-option="{
                  step: 0.1,
                }"
              >
                <ul class="px-[10px]">
                  <li
                    v-for="(item, index) in tableData[0]"
                    :key="'data' + index"
                    class="flex"
                  >
                    <div
                      v-for="(column, colIndex) in tableColumns[0]"
                      :key="'column' + colIndex"
                      class="truncate"
                      :class="
                        colIndex < tableColumns[0].length - 1
                          ? '!mr-[10px]'
                          : '!mr-0'
                      "
                      :style="getColumnStyle(tableColumns[0], column)"
                    >
                      {{ tableData[0][index][column.prop] }}
                    </div>
                  </li>
                </ul>
              </VueSeamlessScroll>
            </div>
          </div>
        </div>

        <div class="h-full w-30/100 flex flex-col gap-[10px]">
          <div class="panel h-30/100 w-full">
            <div class="chartHead">
              <div class="panel-footer"></div>
              <h2>欠料统计</h2>
            </div>
            <div class="chartContent">
              <div class="h-full w-full flex justify-center">
                <div
                  class="w-40/100 h-full flex flex-col items-center justify-center mb-[5%]"
                >
                  <div class="ScreenBaseNum">64,945</div>
                  <div class="ScreenBaseTitle">欠料总数</div>
                  <svg-icon icon-class="ScreenBase5" class="ScreenBase5" />
                </div>
                <div
                  class="w-40/100 h-full flex flex-col items-center justify-center ml-[5%]"
                >
                  <div class="ScreenBaseNum">462</div>
                  <div class="ScreenBaseTitle">影响订单</div>
                  <svg-icon icon-class="ScreenBase5" class="ScreenBase5" />
                </div>
              </div>
            </div>
          </div>
          <div class="panel h-30/100 w-full">
            <div class="chartHead">
              <div class="panel-footer"></div>
              <h2>近一周欠料趋势图</h2>
            </div>
            <div class="chartContent" ref="chart2"></div>
          </div>

          <div class="panel h-40/100 w-full">
            <div class="chartHead">
              <div class="panel-footer"></div>

              <h2>欠料原因分析</h2>
            </div>
            <div class="chartContent" ref="chart3"></div>
          </div>
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
import { GetSearchData } from '@/api/Common';
import VueSeamlessScroll from 'vue-seamless-scroll';
import { GetHeader } from '@/api/Common';
import ComVxeTable from '@/components/ComVxeTable';
export default {
  name: 'Screen11',
  data() {
    return {
      chartHead: chartHead,
      logo: localStorage.getItem('apsurl') + '/images/ScreenLogo.png', //动态获取服务器对应的logo
      handleWindowResizeDebounced: null,
      tableLoading: [false, false, false], //每个表加载
      todayDate: '',
      chartData1: [],
      chartData2: [[], []],
      chartTotal1: 2562,
      sysID: [{ ID: 10103 }, { ID: 5610 }, { ID: 5610 }],
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
    ComVxeTable,
  },
  watch: {},
  created() {
    this.todayDate = this.showtime();
    _this = this;
  },
  async mounted() {
    //初始化图表;
    this.chart = [
      echarts.init(this.$refs.chart0),
      echarts.init(this.$refs.chart1),
      echarts.init(this.$refs.chart2),
      echarts.init(this.$refs.chart3),
    ];
    // 在窗口大小变化时，调用 resize 方法重新渲染图表
    this.handleWindowResizeDebounced = debounce(this.handleWindowResize, 200); //设置防抖
    window.addEventListener('resize', this.handleWindowResizeDebounced);
    await this.getTableHeader();
  },
  beforeDestroy() {
    // 在组件销毁时，移除 resize 事件监听器
    window.removeEventListener('resize', this.handleWindowResizeDebounced);
    this.handleWindowResizeDebounced.cancel();
  },
  methods: {
    getColumnStyle(columns, column) {
      const totalWidth = columns.reduce(
        (sum, col) => sum + parseFloat(col.width || 0),
        0,
      );
      if (column) {
        const percentage = (parseFloat(column.width) / totalWidth) * 100;
        return {
          width: `${percentage}%`,
        };
      } else {
        return columns.map((column) => {
          const percentage = (parseFloat(column.width) / totalWidth) * 100;
          return {
            width: `${percentage}%`,
          };
        });
      }
    },
    // 渲染echart图
    barData(item, option) {
      // echarts.dispose(id);
      item.setOption(option);
      // echarts.init(id).setOption(option);
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

        forms.map(async (x, z) => {
          this.$set(this.formSearchs[z].datas, 'dicID', this.sysID[z].ID);
          await this.getTableData(this.formSearchs[z].datas, z);
          await this.getEcharts();
        });
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
          tooltip: {
            trigger: 'item',
            formatter: '{b}:({d}%)',
          },
          legend: {
            top: 'center',
            // left: "center",
            orient: 'vertical',
            right: '10%',
            // bottom: "0",
            itemWidth: fontSize(16),
            itemHeight: fontSize(16),
            icon: 'circle',
            itemGap: fontSize(20),
            textStyle: {
              color: '#fff',
              fontSize: fontSize(18),
              padding: [0, 0, 0, fontSize(10)],
            },
            data: ['前加工', 'SMT', '注塑', '镭射'],
          },
          grid: {
            containLabel: true,
          },
          series: [
            {
              type: 'pie',
              selectedMode: 'single',
              radius: ['50%', '80%'],
              center: ['40%', '50%'],
              color: [
                '#8E35FF',
                '#FFB933',
                '#2CAA3F',
                '#1983FF',
                '#8BCE1D',
                '#D170FF',
                '#F46D4F',
                '#FA9A09',
                '#FF317B',
                '#444444',
                '#BDBDBD',
                '#D01505',
                '#D5D5D5',
                '#D70303',
              ],
              label: {
                position: 'inner',
                formatter: '{d}%',
                show: true,
                color: '#fff',
                textBorderColor: 'inherit',
                textBorderWidth: 1,
                fontSize: fontSize(16),
                formatter: function (params) {
                  if (params.name !== '') {
                    return params.percent + '%';
                  } else {
                    return '';
                  }
                },
              },
              labelLine: {
                show: false,
              },
              data: [
                { value: '36', name: '前加工' },
                { value: '48', name: 'SMT' },
                { value: '31', name: '注塑' },
                { value: '29', name: '镭射' },
              ],
            },
          ],
        },
        {
          grid: {
            containLabel: true,
            bottom: -fontSize(10),
            top: fontSize(10),
            left: fontSize(10),
            right: fontSize(10),
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'none',
            },
            // formatter: function (params) {
            //   return (
            //     params[0].name +
            //     '<br/>' +
            //     "<span style='display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:rgba(36,207,233,0.9)'></span>" +
            //     params[0].seriesName +
            //     ' : ' +
            //     Number(
            //       (params[0].value.toFixed(4) / 10000).toFixed(2),
            //     ).toLocaleString() +
            //     ' 万元<br/>'
            //   );
            // },
          },
          xAxis: {
            show: false,
            type: 'value',
          },
          yAxis: [
            {
              type: 'category',
              // inverse: true,
              axisLabel: {
                show: true,
                textStyle: {
                  color: '#C9D2FA',
                  fontSize: fontSize(16),
                },
              },
              splitLine: {
                show: false,
              },
              axisTick: {
                show: false,
              },
              axisLine: {
                show: false,
              },
              data: ['物料异常', '欠员', '工艺缺失', '欠料', '机械故障'],
            },
            // {
            //   type: 'category',
            //   inverse: true,
            //   axisTick: 'none',
            //   axisLine: 'none',
            //   show: true,
            //   axisLabel: {
            //     textStyle: {
            //       color: '#ffffff',
            //       fontSize: fontSize(12),
            //     },
            //     // formatter: function (value) {
            //     //   if (value >= 10000) {
            //     //     return (value / 10000).toLocaleString() + '万';
            //     //   } else {
            //     //     return value.toLocaleString();
            //     //   }
            //     // },
            //   },
            //   data: [45, 26, 14, 12, 5],
            // },
          ],
          series: [
            {
              name: '金额',
              type: 'bar',
              zlevel: 1,
              itemStyle: {
                normal: {
                  barBorderRadius: 30,
                  color: '#2F8FFF',
                },
              },
              label: {
                show: true, // 显示标签
                position: 'right',
                fontSize: fontSize(16),
                color: '#fff',
                offset: [fontSize(10), 0],
              },
              barWidth: fontSize(16),
              data: [45, 26, 14, 12, 5],
            },
            // {
            //   name: '背景',
            //   type: 'bar',
            //   barWidth: 20,
            //   barGap: '-100%',
            //   data: [50000000, 50000000, 50000000, 50000000, 1],
            //   itemStyle: {
            //     normal: {
            //       color: 'rgba(24,31,68,1)',
            //       barBorderRadius: 30,
            //     },
            //   },
            // },
          ],
        },
        {
          grid: {
            containLabel: true,
            bottom: fontSize(10),
            top: fontSize(10),
            left: fontSize(10),
            right: fontSize(10),
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow',
            },
          },
          // legend: {
          //   top: fontSize(10),
          //   right: fontSize(10),
          //   data: ['负荷情况'],
          //   itemWidth: fontSize(18),
          //   itemHeight: fontSize(18),
          //   itemGap: fontSize(30),
          //   textStyle: {
          //     fontSize: fontSize(18),
          //     color: '#C9D2FA',
          //     padding: [0, 0, 0, fontSize(10)],
          //   },
          // },
          xAxis: {
            // name: "班级",
            triggerEvent: true,
            data: ['6日', '7日', '8日', '9日', '10日', '11日', '12日'],
            axisLabel: {
              interval: 0,
              show: true,
              fontSize: fontSize(18),
              color: '#C9D2FA',
            },
            axisLine: {
              show: false,
              lineStyle: {
                show: false,
                color: '#F3F3F3',
                width: 2,
              },
            },

            axisTick: {
              show: false,
            },
          },
          yAxis: [
            {
              // name: '单位:万',
              // type: 'value',
              // nameTextStyle: {
              //   color: '#444444',
              // },
              splitNumber: 2,
              axisLabel: {
                show: true,
                fontSize: fontSize(18),
                color: '#C9D2FA',
                // formatter: function (value) {
                //   // 在标签后面添加百分号
                //   return value + '%';
                // },
              },
              axisLine: {
                show: false,
              },
              axisTick: {
                show: false,
              },
              splitLine: {
                lineStyle: {
                  type: 'dashed',
                  color: '#3E4A82',
                },
              },
            },
          ],
          series: [
            {
              name: '折线图名称',
              type: 'line',
              // yAxisIndex: 1, // 与第二个 y 轴关联
              itemStyle: {
                color: '#2F8FFF', // 设置折线颜色为黄色
              },
              lineStyle: {
                width: fontSize(4),
              },
              data: [100, 80, 120, 60, 90, 70, 70], // 折线图的数据
            },
          ],
        },
        {
          // title: {
          //   text: "雷达图",
          //   top: 10,
          //   left: "center",
          //   textStyle: {
          //     fontSize: 18,
          //     fontWeight: 400,
          //   },
          // },
          textStyle: {
            // 全局字体样式
            color: '#C9D2FA',
            fontSize: fontSize(14),
          },
          // legend: {
          //   bottom: 0,
          //   left: "center",
          //   itemBorderRadius: 8,
          //   data: [
          //     "Chars Bosh",
          //   ],
          // },
          tooltip: {
            // 提示框组件
            trigger: 'item', // 触发类型 可选为：'axis' | 'item' | 'none'
            axisPointer: {
              // 坐标轴指示器，坐标轴触发有效
              type: 'line', // 默认为直线，可选为：'line' | 'shadow'
              shadowStyle: {
                color: 'rgba(204, 214, 235, 0.247059)',
              },
            },
          },
          radar: {
            // shape: 'circle',
            splitNumber: 3,
            grid: {
              left: fontSize(10),
              right: fontSize(10),
              bottom: fontSize(10),
              containLabel: true,
            },
            splitArea: {
              show: false,
            },
            splitLine: {
              lineStyle: {
                color: ['#254678'],
              },
            },
            axisLine: {
              lineStyle: {
                color: '#254678',
              },
            },
            indicator: [
              {
                name: '欠料',
                max: 100,
              },
              {
                name: '人员不够',
                max: 100,
              },
              {
                name: '机械故障',
                max: 100,
              },
              {
                name: '模具异常',
                max: 100,
              },
              {
                name: '来料不良',
                max: 100,
              },
            ],
          },
          series: [
            {
              name: '雷达图',
              type: 'radar',
              symbol: 'none',
              areaStyle: {
                color: '#31C2FF', // 调色盘颜色列表。
                opacity: 0.4,
              },
              itemStyle: {
                lineStyle: {
                  width: 2,
                },
              },
              emphasis: {
                areaStyle: {
                  opacity: 0.8,
                },
              },
              data: [
                {
                  value: [50, 46, 80, 30, 60],
                },
              ],
            },
          ],
        },
      ];
      this.chart.map((item, index) => {
        this.barData(item, this.chartOptions[index]);
      });
    },
    handleWindowResize() {
      // 调用 resize 方法重新渲染图表
      setTimeout(() => {
        this.chart.map((item) => {
          item.resize();
        });
      }, 100);
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
  display: flex;
  flex-direction: column;
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
    position: absolute;
  }
  .logo {
    position: absolute;
    height: 50px;
    left: 80px;
    top: 10px;
    // background: url(./FSZM.png) no-repeat;
    background-size: 100% 100%;
  }
  .textTitle {
    position: relative;
    font-family: PingFang SC;
    font-size: 36px;
    font-weight: 600;
    line-height: 87px;
    letter-spacing: 0em;
    text-align: center;
    box-shadow: 0px 0px 10px 0px rgba(16, 94, 217, 1);
    color: rgba(221, 234, 255, 1);
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
  padding: 10px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .ScreenBaseNum {
    color: #fff;
    font-family: Revalia;
    font-size: 36px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
  .ScreenBaseTitle {
    color: #c9d2fa;
    text-align: center;
    font-family: PingFang SC;
    font-size: 18px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    align-self: center; /* 第二个元素在中线位置 */
    margin-top: 5%;
    margin-bottom: 2%;
    // position: absolute;
  }
}
.panel {
  position: relative;
  border: 1px solid rgba(76, 130, 194, 1);
  box-shadow: 0px 7px 15px 0px rgba(32, 69, 143, 1) inset;
  background: linear-gradient(0deg, #030a2c, #030a2c),
    linear-gradient(0deg, #4c82c2, #4c82c2);
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
  .chartContent {
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
          height: 50px;
          line-height: 50px;
          font-size: 18px;
        }
        li:nth-child(even) {
          background-color: #0f1740;
        }
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
.upper-right-element {
  border: 1px solid rgba(76, 130, 194, 1);
  background: linear-gradient(0deg, #030a2c, #030a2c),
    linear-gradient(0deg, #4c82c2, #4c82c2);
}
.flex-container div::before,
.flex-container div::after {
  content: '';
  flex: 0.15;
}
.ScreenBase2 {
  width: 125px;
  height: 84px;
}
.ScreenBase5 {
  width: 158px;
  height: 62px;
}
</style>
