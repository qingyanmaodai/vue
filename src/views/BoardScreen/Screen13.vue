<template>
  <div id="Screen">
    <div class="el-header">
      <svg-icon icon-class="ScreenHeader1" class="ScreenHeader1" />
      <img class="logo" :src="logo" mode="heightFix" />
      <div class="textTitle">{{ result1[0]['label'] }}</div>
      <div class="showTime">{{ todayDate }}</div>
    </div>
    <div class="mainbox flex-grow overflow-hidden">
      <div class="h-full flex gap-[10px]">
        <div class="h-full w-70/100 flex flex-col gap-[10px]">
          <div class="panel h-full w-full">
            <div class="chartHead">
              <div class="panel-footer">
                <h2>{{ result1[1]['label'] }}</h2>
                <div class="chartHeadEnd">
                  翻页倒计时{{ countdowns[1] }} 第{{
                    formSearchs[1].datas['page']
                  }}页 共{{ countTotal[1] }}页
                </div>
              </div>
            </div>
            <div
              class="chartContent flex flex-col"
              element-loading-background="#030a2c"
              v-loading="tableLoading[1]"
            >
              <div class="tableHead flex px-[10px] text-white w-full">
                <div
                  v-for="(column, index) in tableColumns[1]"
                  :key="'tableHead' + index"
                  class="flex"
                  :class="
                    index < tableColumns[1].length - 1 ? 'pr-[10px]' : 'pr-0'
                  "
                  :style="getColumnStyle(tableColumns[1], column)"
                >
                  {{ column.label }}
                </div>
              </div>
              <!-- <VueSeamlessScroll
                :data="tableData[1]"
                class="warp"
                :class-option="{
                  singleHeight: fontSize(30),
                  waitTime: 2000,
                }"
              > -->
              <div class="warp">
                <ul class="px-[10px]">
                  <li
                    v-for="(item, index) in tableData[1]"
                    :key="'data' + index"
                    class="flex"
                    :style="getRowsHeight(1)"
                  >
                    <div
                      v-for="(column, colIndex) in tableColumns[1]"
                      :key="'column' + colIndex"
                      class="truncate"
                      :class="
                        colIndex < tableColumns[1].length - 1
                          ? 'pr-[10px]'
                          : 'pr-0'
                      "
                      :style="
                        getCellStyles(
                          tableData[1][index].BColors,
                          tableData[1][index].FColors,
                          column,
                          tableColumns[1],
                        )
                      "
                    >
                      {{ tableData[1][index][column.prop] }}
                    </div>
                  </li>
                </ul>
              </div>
              <!-- </VueSeamlessScroll> -->
            </div>
          </div>
        </div>
        <div class="h-full w-30/100 flex flex-col gap-[10px]">
          <div class="h-full w-full flex flex-col gap-[10px]">
            <div class="panel h-30/100 w-full">
              <div class="chartHead">
                <div class="panel-footer">
                  <h2>{{ result1[2]['label'] }}</h2>
                </div>
              </div>
              <div class="chartContent" ref="chart0"></div>
            </div>
            <div class="panel h-30/100 w-full">
              <div class="chartHead">
                <div class="panel-footer">
                  <h2>{{ result1[3]['label'] }}</h2>
                </div>
              </div>
              <div class="chartContent" ref="chart1"></div>
            </div>

            <div class="panel h-40/100 w-full">
              <div class="chartHead">
                <div class="panel-footer">
                  <h2>{{ result1[4]['label'] }}</h2>
                </div>
              </div>
              <div class="chartContent" ref="chart2"></div>
            </div>
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
import '@/flexible.js';
export default {
  name: 'Screen13',
  data() {
    return {
      chartHead: chartHead,
      logo: localStorage.getItem('apsurl') + '/images/ScreenLogo.png', //动态获取服务器对应的logo
      handleWindowResizeDebounced: null,
      todayDate: '',
      chart: [],
      chartOptions: [],
      countdowns: [],
      countTotal: [],
      refreshTimers: [],
      tableColumns: [[], [], [], [], [], [], [], [], [], [], []],
      tableData: [
        [],
        [{ S1: '', Name1: '' }],
        [{ S1: '' }],
        [{ S1: '' }],
        [{ S1: '', Name1: '' }],
        [{ S1: '', Name1: '' }],
        [{ S1: '', Name1: '' }],
        [{ S1: '', Name1: '' }],
        [{ S1: '', Name1: '' }],
        [],
        [],
      ],
      tableLoading: [
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
      ],
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
      ],
      formSearchs: [
        {
          datas: {},
          forms: [],
        },
        {
          datas: {
            // page: 5
          },
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
        {
          datas: {},
          forms: [],
        },
        {
          datas: {},
          forms: [],
        },
      ],
      result1: [
        {
          label: null,
          fields: null,
          groupby: null,
          sort: null,
          DataFilter: null,
        },
        {
          label: null,
          fields: null,
          groupby: null,
          sort: null,
          DataFilter: null,
        },
        {
          label: null,
          fields: null,
          groupby: null,
          sort: null,
          DataFilter: null,
        },
        {
          label: null,
          fields: null,
          groupby: null,
          sort: null,
          DataFilter: null,
        },
        {
          label: null,
          fields: null,
          groupby: null,
          sort: null,
          DataFilter: null,
        },
        {
          label: null,
          fields: null,
          groupby: null,
          sort: null,
          DataFilter: null,
        },
        {
          label: null,
          fields: null,
          groupby: null,
          sort: null,
          DataFilter: null,
        },
        {
          label: null,
          fields: null,
          groupby: null,
          sort: null,
          DataFilter: null,
        },
        {
          label: null,
          fields: null,
          groupby: null,
          sort: null,
          DataFilter: null,
        },
        {
          label: null,
          fields: null,
          groupby: null,
          sort: null,
          DataFilter: null,
        },
        {
          label: null,
          fields: null,
          groupby: null,
          sort: null,
          DataFilter: null,
        },
      ],
      sysID: [
        { ID: 7917 },
        { ID: 5170 },
        { ID: 5170 },
        { ID: 5170 },
        { ID: 7918 },
        { ID: 7919 },
        { ID: 5170 },
        { ID: 5170 },
        { ID: 5170 },
        { ID: 5170 },
        { ID: 5170 },
      ],
      series2: [],
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
    this.getTableHeader();
  },
  async mounted() {
    //初始化图表;
    this.chart = [this.$refs.chart0, this.$refs.chart1, this.$refs.chart2];
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
    getCellStyles(BColor, FColor, column, columns) {
      const cellStyles = {};
      // Check if BColor is defined for the current column
      if (BColor && BColor[column.prop]) {
        cellStyles.backgroundColor = BColor[column.prop];
      }
      if (FColor && FColor[column.prop]) {
        cellStyles.color = FColor[column.prop];
      }

      const columnStyles = this.getColumnStyle(columns, column);
      Object.assign(cellStyles, columnStyles);

      return cellStyles;
    },
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
    getRowsHeight(remarkTb) {
      if (this.formSearchs[remarkTb].datas['rows']) {
        return {
          height: `${100 / this.formSearchs[remarkTb].datas['rows']}%`,
        };
      } else {
        return {
          height: `5%`,
        };
      }
    },
    // 渲染echart图
    barData(id, option) {
      // echarts.dispose(id);
      echarts.init(id).setOption(option);
    },

    // 获取表头数据
    async getTableHeader() {
      let rea = await GetSearchData({
        dicID: 15221,
        rows: 0,
        page: 1,
      });
      const { data: data1, result: result1, msg: msg1 } = rea.data;
      if (result1) {
        this.sysID = data1.map((item) => {
          return {
            ID: item.sysID,
          };
        });
        this.result1 = data1.map((item) => {
          return {
            label: item.label,
            fields: item.fields,
            groupby: item.groupby,
            sort: item.sort,
            DataFilter: item.DataFilter,
            rows: item.erows,
          };
        });
      }
      let res = await GetHeader(this.sysID);
      const { datas, forms, result, msg } = res.data;

      if (result) {
        // 获取查询的初始化字段 组件 按钮
        forms.map(async (x, z) => {
          this.$set(this.formSearchs[z].datas, 'dicID', this.sysID[z].ID);
          if (this.result1[z].fields) {
            this.$set(
              this.formSearchs[z].datas,
              'fields',
              this.result1[z].fields,
            );
          }
          if (this.result1[z].groupby) {
            this.$set(
              this.formSearchs[z].datas,
              'groupby',
              this.result1[z].groupby,
            );
          }
          if (this.result1[z].sort) {
            this.$set(this.formSearchs[z].datas, 'sort', this.result1[z].sort);
          }
          if (this.result1[z].DataFilter) {
            this.$set(
              this.formSearchs[z].datas,
              'DataFilter',
              this.result1[z].DataFilter,
            );
          }
          if (this.result1[z].rows) {
            this.$set(this.formSearchs[z].datas, 'rows', this.result1[z].rows);
          }
          if (z !== 0) {
            await this.getTableData(this.formSearchs[z].datas, z);
            await this.getEcharts();
          }
        });
      }
    },
    fontSize(res) {
      let clientWidth =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth;
      if (!clientWidth) return;
      return res * (clientWidth / 1920);
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
          grid: {
            containLabel: true,
            bottom: fontSize(10),
            top: fontSize(40),
            left: fontSize(10),
            right: fontSize(10),
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow',
            },
          },
          legend: {
            top: fontSize(0),
            right: fontSize(10),
            data: [...new Set(this.tableData[2].map((item) => item.Name1))],
            // itemWidth: fontSize(10),
            // itemHeight: fontSize(10),
            itemGap: fontSize(10),
            textStyle: {
              fontSize: fontSize(18),
              color: '#C9D2FA',
              // padding: [0, 0, 0, fontSize(10)],
            },
          },
          xAxis: {
            // name: "班级",
            triggerEvent: true,
            data: [...new Set(this.tableData[2].map((item) => item.Name2))],
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
                formatter: function (value) {
                  // 在标签后面添加百分号
                  return value + '%';
                },
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
          series: this.series2,
        },
        {
          tooltip: {
            trigger: 'item',
            formatter: '{b}:({d}%)',
          },
          legend: {
            top: 'center',
            // left: "center",
            orient: 'vertical',
            right: fontSize(20),
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
            data: this.tableData[3].map((item) => item['Name1']),
          },
          grid: {
            containLabel: true,
          },
          series: [
            {
              type: 'pie',
              selectedMode: 'single',
              radius: [fontSize(50), fontSize(80)],
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
                position: 'outside',
                show: true,
                color: '#fff',
                textBorderColor: 'inherit',
                textBorderWidth: fontSize(1),
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
                show: true,
                length2: 0,
                length: fontSize(10),
              },
              data: this.tableData[3].map((item) => ({
                value: item.S1,
                name: item.Name1,
              })),
            },
          ],
        },
        {
          grid: {
            containLabel: true,
            bottom: -fontSize(10),
            top: fontSize(10),
            left: fontSize(10),
            right: fontSize(80),
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
              inverse: true,
              axisLabel: {
                show: true,
                textStyle: {
                  color: '#C9D2FA',
                  fontSize: fontSize(14),
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
              data: this.tableData[4].map((item) => item['Name1']),
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
              // name: '金额',
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
                formatter: function (params) {
                  // 在标签文本后添加百分号
                  return (params.value * 100).toFixed(2) + '%';
                },
              },
              barWidth: fontSize(16),
              data: this.tableData[4].map((item) => item['S1']),
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
    async startRefreshTimer(remarkTb, count) {
      // 先清除之前的定时器
      this.stopRefreshTimer(remarkTb);

      // 设置定时器，每十秒刷新一次数据
      this.$set(
        this.refreshTimers,
        remarkTb,
        setInterval(async () => {
          if (_this.countdowns[remarkTb] > 0) {
            _this.$set(
              _this.countdowns,
              remarkTb,
              _this.countdowns[remarkTb] - 1,
            );
          } else {
            _this.$set(_this.countdowns, remarkTb, 10); // 重新开始倒计时

            const form = _this.formSearchs[remarkTb].datas;
            form.page =
              form.page < Math.ceil(count / form.rows) ? form.page + 1 : 1;
            _this.countTotal[remarkTb] = Math.ceil(count / form.rows);

            // _this.$set(_this.tableLoading, remarkTb, true);
            await _this.getTableData(
              _this.formSearchs[remarkTb].datas,
              remarkTb,
            );
            // _this.$set(_this.tableLoading, remarkTb, false);
          }
        }, 1000),
      );
    },
    stopRefreshTimer(remarkTb) {
      // 清除指定 remarkTb 的定时器
      if (this.refreshTimers[remarkTb]) {
        clearInterval(this.refreshTimers[remarkTb]);
        this.refreshTimers[remarkTb] = null;
      }
    },
    // 获取表格数据
    async getTableData(form, remarkTb) {
      this.$set(this.tableLoading, remarkTb, true);
      let res = await GetSearchData(form);
      const { result, data, count, msg, Columns } = res.data;
      if (result) {
        // 获取每个表头
        if (remarkTb === 1 && this.tableColumns[1].length === 0) {
          this.$set(this.tableColumns, remarkTb, Columns[0]);
          this.startRefreshTimer(1, count);
        }
        if (remarkTb === 2) {
          const uniqueName1Values = [
            ...new Set(data.map((item) => item.Name1)),
          ];
          let color = ['#8E35FF', '#FFB933', '#44C558', '#2F8FFF'];
          // 构建 series 和 x 轴数据
          this.series2 = uniqueName1Values.map((name1, index) => {
            return {
              name: name1,
              type: 'line',
              symbol: 'circle',
              symbolSize: this.fontSize(6),
              itemStyle: {
                color: color[index],
              },
              lineStyle: {
                width: this.fontSize(4),
              },
              data: data
                .filter((item) => item.Name1 === name1)
                .map((item) => item.S1),
            };
          });
        }
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
      display: flex;
      justify-content: space-between;
      h2 {
        position: relative;
        font-family: PingFang SC;
        padding-left: 25px;
        font-size: 20px;
        font-weight: 500;
        line-height: 48px;
        letter-spacing: 0em;
        text-align: left;
        color: rgba(0, 178, 255, 1);
      }
      .chartHeadEnd {
        position: relative;
        color: #fff;
        display: flex;
        align-items: center;
        padding-right: 20px;
      }
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
  .chartContent {
    .tableHead {
      height: 50px;
      background: #354075;
      font-size: 18px;
    }
    padding: 9px 12px;
    height: calc(100% - 48px);
    .warp {
      width: 100%;
      height: 100%;
      color: #fff;
      overflow: hidden;
      ul {
        height: 100%;
        list-style: none;
        padding: 0;
        margin: 0 auto;
        li,
        a {
          height: 50px;
          line-height: 50px;
          font-size: 16px;
          border-bottom: 1px solid #ffffff50;
        }
        li:nth-child(even) {
          // background-color: #0f1740;
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
