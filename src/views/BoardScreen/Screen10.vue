<template>
  <div id="Screen">
    <div class="el-header">
      <svg-icon icon-class="ScreenHeader1" class="ScreenHeader1" />
      <img class="logo" :src="result1[0]['groupby']" mode="heightFix" />
      <div class="textTitle">{{ result1[0]['label'] }}</div>
      <div class="showTime">{{ todayDate }}</div>
    </div>
    <div class="mainbox flex-grow overflow-hidden">
      <div class="h-full flex gap-[10px]">
        <div class="panel h-full w-65/100">
          <div class="chartHead">
            <div class="panel-footer"></div>
            <h2>{{ result1[1]['label'] }}</h2>
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
                  index < tableColumns[1].length - 1 ? 'mr-[10px]' : 'mr-0'
                "
                :style="getColumnStyle(tableColumns[1], column)"
              >
                {{ column.label }}
              </div>
            </div>
            <VueSeamlessScroll
              ref="seamlessScroll"
              @ScrollEnd="ScrollEnd"
              :data="tableData[1]"
              class="warp"
              :class-option="{
                singleHeight: 30,
                waitTime: 2000,
              }"
            >
              <div class="warp">
                <!-- <ComScreenTable
                :rowKey="'RowNumber'"
                ref="ComScreenTable"
                height="100%"
                :tableData="tableData[1]"
                :tableHeader="tableColumns[1]"
                :remark="1"
                :sysID="sysID[1]"
                :isEdit="false"
                :hasSelect="false"
                :pagination="tablePagination[1]"
                :keepSource="true"
                :footerContent="false"
              /> -->

                <ul class="px-[10px]">
                  <li
                    v-for="(item, index) in tableData[1]"
                    :key="'data' + index"
                    class="flex"
                    :style="getColumnRows(1)"
                  >
                    <div
                      v-for="(column, colIndex) in tableColumns[1]"
                      :key="'column' + colIndex"
                      class="h-full flex items-center"
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
                      <div class="w-full truncate">
                        {{ tableData[1][index][column.prop] }}
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </VueSeamlessScroll>
          </div>
        </div>
        <div class="h-full w-35/100 flex flex-col">
          <div class="mb-[10px] h-25/100 w-full flex">
            <div class="h-full w-1/2 mr-[10px] relative">
              <svg-icon
                icon-class="ScreenBase1"
                class="ScreenBase1 h-full w-full absolute"
              />
              <div
                class="h-full w-full flex flex-col items-center justify-between relative"
              >
                <div
                  class="ScreenBaseNum absolute"
                  style="top: 20%; height: 30%"
                >
                  {{ tableData[2][0]['S1'] }}
                </div>
                <div
                  class="ScreenBaseTitle absolute"
                  style="bottom: 30%; height: 20%"
                >
                  {{ result1[2]['label'] }}
                </div>
              </div>
            </div>
            <div class="h-full w-1/2 relative">
              <svg-icon icon-class="ScreenBase1" class="ScreenBase1" />
              <div
                class="h-full w-full flex flex-col items-center justify-between relative"
              >
                <div
                  class="ScreenBaseNum absolute"
                  style="top: 20%; height: 30%"
                >
                  {{ tableData[3][0]['S1'] }}
                </div>
                <div
                  class="ScreenBaseTitle absolute"
                  style="bottom: 30%; height: 20%"
                >
                  {{ result1[3]['label'] }}
                </div>
              </div>
            </div>
          </div>
          <div class="panel h-45/100 w-full mb-[10px]">
            <div class="chartHead">
              <div class="panel-footer"></div>

              <h2>{{ result1[4]['label'] }}</h2>
            </div>
            <div class="chartContent" ref="chart1"></div>
            <div class="panel-footer"></div>
          </div>
          <div class="panel h-30/100 w-full" style="height: 30%">
            <div class="chartHead">
              <div class="panel-footer"></div>

              <h2>{{ result1[5]['label'] }}</h2>
            </div>
            <div class="chartContent" ref="chart2"></div>
            <div class="panel-footer"></div>
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
import ComScreenTable from '@/components/ComScreenTable';
import '@/flexible.js';
export default {
  name: 'Screen10',
  data() {
    return {
      chartHead: chartHead,
      logo: localStorage.getItem('apsurl') + '/images/ScreenLogo.png', //动态获取服务器对应的logo
      handleWindowResizeDebounced: null,
      todayDate: '',
      chartData1: [],
      chartData2: [[], []],
      chartTotal1: 2562,
      chart: [],
      chartOptions: [],
      tableColumns: [[], [], [], [], [], [], [], [], [], []],
      tableData: [
        [],
        [],
        [{ S1: '' }],
        [{ S1: '' }],
        [],
        [],
        [{ S1: '', Name1: '' }],
        [{ S1: '', Name1: '' }],
        [{ S1: '', Name1: '' }],
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
      ],
    };
  },
  components: {
    VueSeamlessScroll,
    ComScreenTable,
  },
  watch: {},
  created() {
    this.todayDate = this.showtime();
    _this = this;
    this.getTableHeader();
  },
  async mounted() {
    //初始化图表;
    this.chart = [this.$refs.chart1, this.$refs.chart2];
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
    async ScrollEnd() {
      // const scrollContainer = this.$refs.seamlessScroll.$el;
      // // Check if the scroll position is at the bottom
      // const isAtBottom =
      //   scrollContainer.scrollTop + scrollContainer.clientHeight ===
      //   scrollContainer.scrollHeight;
      // if (isAtBottom) {
      //   console.log('Scrolled to the bottom!');
      //   await this.getTableData(this.formSearchs[1].datas, 1);
      //   // Your logic for when the scroll reaches the bottom
      // }
      // console.log('ScrollEnd');
    },
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
        (sum, col) => sum + parseFloat(col.appWidth || 0),
        0,
      );
      if (column) {
        const percentage = (parseFloat(column.appWidth) / totalWidth) * 100;
        return {
          width: `${percentage}%`,
        };
      } else {
        return columns.map((column) => {
          const percentage = (parseFloat(column.appWidth) / totalWidth) * 100;
          return {
            width: `${percentage}%`,
          };
        });
      }
    },
    getColumnRows(remarkTb) {
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
        dicID: 15224,
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
        // 获取每个表头
        datas.some((m, i) => {
          m.some((n, j) => {
            // 进行验证
            // this.verifyDta(n);
            // if (n.children && n.children.length != 0) {
            //   n.children.forEach((x) => {
            //     this.verifyDta(x);
            //   });
            // }
            // if (j === 1 && ) {
            //   this.tablePagination[i]["pageSize"] = n["pageSize"];
            // }
          });
        });
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
          if (
            z === 1 ||
            z === 2 ||
            z === 3 ||
            z === 4 ||
            z === 6 ||
            z === 7 ||
            z === 8
          ) {
            await this.getTableData(this.formSearchs[z].datas, z);
            await this.getEcharts();
          }
        });
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
          grid: {
            containLabel: true,
            bottom: 0,
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
            top: fontSize(10),
            right: fontSize(10),
            data: ['计划出货', '实际出货'],
            itemWidth: fontSize(18),
            itemHeight: fontSize(18),
            itemGap: fontSize(30),
            textStyle: {
              fontSize: fontSize(18),
              color: '#C9D2FA',
              padding: [0, 0, 0, fontSize(10)],
            },
          },
          xAxis: {
            // name: "班级",
            triggerEvent: true,
            data: this.tableData[4].map((item) => item['Name1']),
            axisLabel: {
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
              axisLabel: {
                interval: 0,
                show: true,
                fontSize: fontSize(18),
                color: '#C9D2FA',
              },
              axisLine: {
                show: false,
                // lineStyle: {
                //   color: "#F3F3F3",
                //   width: 2
                // }
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
              name: '计划出货',
              type: 'bar',
              silent: true,
              itemStyle: {
                normal: {
                  color: '#2F8FFF',
                },
              },
              data: this.tableData[4].map((item) => item['S1']),

              label: {
                show: true,
                color: '#2F8FFF',
                position: 'top', // 显示位置，可选值有 'top', 'bottom', 'inside', 'outside'
                formatter: '{c}', // 标签内容格式器，这里表示显示数据值
              },
            },
            {
              name: '实际出货',
              type: 'bar',
              silent: true,
              itemStyle: {
                normal: {
                  color: '#47B558',
                },
              },
              data: this.tableData[4].map((item) => item['S2']),
              label: {
                show: true,
                color: '#47B558',
                position: 'top', // 显示位置，可选值有 'top', 'bottom', 'inside', 'outside'
                formatter: '{c}', // 标签内容格式器，这里表示显示数据值
              },
            },
          ],
        },
        {
          backgroundColor: '#0E1327',
          tooltip: {
            formatter: '{a} <br/>{b} : {c}%',
          },
          series: [
            {
              type: 'gauge',
              radius: '60%',
              center: ['20%', '40%'],
              startAngle: '225',
              endAngle: '-45',
              pointer: {
                show: true,
                length: '60%',
                width: fontSize(4),
                itemStyle: {
                  color: '#2F8FFF',
                },
              },
              anchor: {
                show: true,
                showAbove: true,
                size: fontSize(4),
                itemStyle: {
                  color: '#030A2C',
                },
              },
              detail: {
                formatter: (params) => {
                  return `${params.toFixed(2)}%`;
                },
                fontSize: fontSize(24),
                color: '#fff',
                offsetCenter: [0, '110%'],
              },
              data: [
                {
                  value: this.tableData[6][0]['S1'],
                  name: this.tableData[6][0]['Name1'],
                  title: {
                    offsetCenter: ['0%', '150%'],
                    fontSize: fontSize(18),
                    color: '#C9D2FA',
                    show: true,
                  },
                },
              ],
              title: {
                show: false,
              },
              axisLine: {
                show: true,
                lineStyle: {
                  color: [
                    [1 / 2, '#2F8FFF'],
                    [1, '#566093'],
                  ],
                  width: fontSize(10),
                  // shadowBlur: 15,
                  // shadowColor: '#B0C4DE',
                  shadowOffsetX: 0,
                  shadowOffsetY: 0,
                  opacity: 1,
                },
              },
              axisLabel: {
                show: false,
              }, //刻度标签。
              axisTick: {
                splitNumber: 3,
                distance: fontSize(4),
                show: true,
                lineStyle: {
                  color: '#566093',
                  width: fontSize(2),
                },
                length: fontSize(2),
              }, //刻度样式
              splitLine: {
                show: true,
                distance: fontSize(4),
                lineStyle: {
                  color: '#566093',
                  width: fontSize(2),
                },
                length: fontSize(4),
              }, //分隔线样式
              animationDuration: 4000,
            },
            {
              type: 'gauge',
              radius: '60%',
              center: ['50%', '40%'],
              startAngle: '225',
              endAngle: '-45',
              pointer: {
                show: true,
                length: '60%',
                width: fontSize(4),
                itemStyle: {
                  color: '#4ACBAC',
                },
              },
              anchor: {
                show: true,
                showAbove: true,
                size: fontSize(4),
                itemStyle: {
                  color: '#030A2C',
                },
              },
              detail: {
                formatter: (params) => {
                  return `${params.toFixed(2)}%`;
                },
                fontSize: fontSize(24),
                color: '#fff',
                offsetCenter: [0, '110%'],
              },
              data: [
                {
                  value: this.tableData[7][0]['S1'],
                  name: this.tableData[7][0]['Name1'],
                  title: {
                    offsetCenter: ['0%', '150%'],
                    fontSize: fontSize(18),
                    color: '#C9D2FA',
                    show: true,
                  },
                },
              ],
              title: {
                show: false,
              },
              axisLine: {
                show: true,
                lineStyle: {
                  color: [
                    [1 / 2, '#4ACBAC'],
                    [1, '#566093'],
                  ],
                  width: fontSize(10),
                  // shadowBlur: 15,
                  // shadowColor: '#B0C4DE',
                  shadowOffsetX: 0,
                  shadowOffsetY: 0,
                  opacity: 1,
                },
              },
              axisLabel: {
                show: false,
              }, //刻度标签。
              axisTick: {
                splitNumber: 3,
                distance: fontSize(4),
                show: true,
                lineStyle: {
                  color: '#566093',
                  width: fontSize(2),
                },
                length: fontSize(2),
              }, //刻度样式
              splitLine: {
                show: true,
                distance: fontSize(4),
                lineStyle: {
                  color: '#566093',
                  width: fontSize(2),
                },
                length: fontSize(4),
              }, //分隔线样式
              animationDuration: 4000,
            },
            {
              type: 'gauge',
              radius: '60%',
              center: ['80%', '40%'],
              startAngle: '225',
              endAngle: '-45',
              pointer: {
                show: true,
                length: '60%',
                width: fontSize(4),
                itemStyle: {
                  color: '#BC53EE',
                },
              },
              anchor: {
                show: true,
                showAbove: true,
                size: fontSize(4),
                itemStyle: {
                  color: '#030A2C',
                },
              },
              detail: {
                formatter: (params) => {
                  return `${params.toFixed(2)}%`;
                },
                fontSize: fontSize(24),
                color: '#fff',
                offsetCenter: [0, '110%'],
              },
              data: [
                {
                  value: this.tableData[8][0]['S1'],
                  name: this.tableData[8][0]['Name1'],
                  title: {
                    offsetCenter: ['0%', '150%'],
                    fontSize: fontSize(18),
                    color: '#C9D2FA',
                    show: true,
                  },
                },
              ],
              title: {
                show: false,
              },
              axisLine: {
                show: true,
                lineStyle: {
                  color: [
                    [1 / 2, '#BC53EE'],
                    [1, '#566093'],
                  ],
                  width: fontSize(10),
                  // shadowBlur: 15,
                  // shadowColor: '#B0C4DE',
                  shadowOffsetX: 0,
                  shadowOffsetY: 0,
                  opacity: 1,
                },
              },
              axisLabel: {
                show: false,
              }, //刻度标签。
              axisTick: {
                splitNumber: 3,
                distance: fontSize(4),
                show: true,
                lineStyle: {
                  color: '#566093',
                  width: fontSize(2),
                },
                length: fontSize(2),
              }, //刻度样式
              splitLine: {
                show: true,
                distance: fontSize(4),
                lineStyle: {
                  color: '#566093',
                  width: fontSize(2),
                },
                length: fontSize(4),
              }, //分隔线样式
              animationDuration: 4000,
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
    async startRefreshTimer(remarkTb, count) {
      // 先清除之前的定时器
      this.stopRefreshTimer();
      // 设置定时器，每十秒刷新一次数据
      this.refreshTimer = setInterval(async () => {
        const form = this.formSearchs[remarkTb].datas;
        // 如果当前页小于总页数，则继续增加页数；否则重新从第一页开始
        form.page =
          form.page < Math.ceil(count / form.rows) ? form.page + 1 : 1;
        // 调用 getTableData 方法
        this.$set(_this.tableLoading, remarkTb, true);
        await this.getTableData(this.formSearchs[remarkTb].datas, remarkTb);
        this.$set(_this.tableLoading, remarkTb, false);
      }, 10000); // 10000 毫秒等于十秒
    },
    stopRefreshTimer() {
      // 清除定时器
      clearInterval(this.refreshTimer);
    },
    // 获取表格数据
    async getTableData(form, remarkTb) {
      this.$set(this.tableLoading, remarkTb, true);
      // form['rows'] = this.tablePagination[remarkTb].pageSize;
      // form['page'] = this.tablePagination[remarkTb].pageIndex;
      let res = await GetSearchData(form);
      const { result, data, count, msg, Columns, AppColumns } = res.data;
      if (result) {
        // 获取每个表头
        if (remarkTb === 1 && this.tableColumns[1].length === 0) {
          this.$set(this.tableColumns, remarkTb, AppColumns);
          // this.startRefreshTimer(1, count);
        }
        // else {
        //   Columns.some((m, i) => {
        //     m.forEach((n, index) => {
        //       // 进行验证
        //     });
        //     this.$set(this.tableColumns, remarkTb, m);
        //   });
        // }
        this.$set(this.tableData, remarkTb, data);
        this.$set(this.tablePagination[remarkTb], 'pageTotal', count);
        if (remarkTb === 1) {
          this.tableData[1][this.tableData[1].length - 1][
            this.tableColumns[1]['0']['prop']
          ] = '合计';
        }
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
    color: #8aceff;
    text-align: center;
    font-family: PingFang SC;
    font-size: 18px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    align-self: center; /* 第二个元素在中线位置 */
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
          font-size: 17px;
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
.ScreenBase1 {
  width: 100%;
  height: 100%;
  position: absolute;
}
::v-deep .vxe-header--row {
  background-color: #354075 !important;
  height: 50px !important;
}
::v-deep .vxe-cell--title {
  font-size: 18px;
  color: #fff !important;
}
::v-deep .vxe-table .vxe-table--body-wrapper,
.vxe-table .vxe-table--footer-wrapper {
  background-color: #030a2c;
}
/*调整表格文字及位置*/
::v-deep .vxe-table .vxe-body--column,
.vxe-table .vxe-footer--column,
.vxe-table .vxe-header--column {
  // position: relative;
  // line-height: 24px;
  // text-align: center;
  color: #ffffff;
  font-size: 18px;
}
</style>
