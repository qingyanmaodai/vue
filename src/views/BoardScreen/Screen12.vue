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
        <div class="h-full w-30/100 flex flex-col gap-[10px]">
          <div class="h-70/100 w-full flex flex-col gap-[10px]">
            <div class="panel h-50/100 w-full">
              <div class="chartHead">
                <div class="panel-footer">
                  <h2>{{ result1[1]['label'] }}</h2>
                </div>
              </div>
              <div class="chartContent" ref="chart0"></div>
            </div>
            <div class="panel h-50/100 w-full">
              <div class="chartHead">
                <div class="panel-footer">
                  <h2>{{ result1[2]['label'] }}</h2>
                </div>
              </div>
              <div class="chartContent" ref="chart1"></div>
            </div>
          </div>

          <div class="panel h-30/100 w-full">
            <div class="chartHead">
              <div class="panel-footer">
                <h2>{{ result1[3]['label'] }}</h2>
                <div class="chartHeadEnd">
                  翻页倒计时{{ countdowns[3] }} 第{{
                    formSearchs[3].datas['page']
                  }}页 共{{ countTotal[3] }}页
                </div>
              </div>
            </div>
            <div
              class="chartContent flex flex-col"
              element-loading-background="#030a2c"
              v-loading="tableLoading[3]"
            >
              <div class="tableHead flex !px-[10px] text-white w-full">
                <div
                  v-for="(column, index) in tableColumns[3]"
                  :key="'tableHead' + index"
                  class="flex"
                  :class="
                    index < tableColumns[3].length - 1 ? 'pr-[10px]' : 'pr-0'
                  "
                  :style="getColumnStyle(tableColumns[3], column)"
                >
                  {{ column.label }}
                </div>
              </div>
              <!-- <VueSeamlessScroll
                :data="tableData[3]"
                class="warp"
                :class-option="{
                  singleHeight: fontSize(10),
                  waitTime: 2000,
                }"
              > -->
              <div class="warp">
                <ul class="px-[10px]">
                  <li
                    v-for="(item, index) in tableData[3]"
                    :key="'data' + index"
                    class="flex"
                    :style="getRowsHeight(3)"
                  >
                    <div
                      v-for="(column, colIndex) in tableColumns[3]"
                      :key="'column' + colIndex"
                      class="truncate"
                      :class="
                        colIndex < tableColumns[3].length - 1
                          ? 'pr-[10px]'
                          : 'pr-0'
                      "
                      :style="
                        getCellStyles(
                          tableData[3][index].BColors,
                          tableData[3][index].FColors,
                          column,
                          tableColumns[3],
                        )
                      "
                    >
                      {{ tableData[3][index][column.prop] }}
                    </div>
                  </li>
                </ul>
              </div>
              <!-- </VueSeamlessScroll> -->
            </div>
          </div>
        </div>
        <div class="h-full w-40/100 flex flex-col gap-[10px]">
          <div class="panel h-full w-full">
            <div class="chartHead">
              <div class="panel-footer">
                <h2>{{ result1[4]['label'] }}</h2>
                <div class="chartHeadEnd">
                  翻页倒计时{{ countdowns[4] }} 第{{
                    formSearchs[4].datas['page']
                  }}页 共{{ countTotal[4] }}页
                </div>
              </div>
            </div>
            <div
              class="chartContent flex flex-col"
              element-loading-background="#030a2c"
              v-loading="tableLoading[4]"
            >
              <div class="tableHead flex px-[10px] text-white w-full">
                <div
                  v-for="(column, index) in tableColumns[4]"
                  :key="'tableHead' + index"
                  class="flex"
                  :class="
                    index < tableColumns[4].length - 1 ? 'pr-[10px]' : 'pr-0'
                  "
                  :style="getColumnStyle(tableColumns[4], column)"
                >
                  {{ column.label }}
                </div>
              </div>

              <!-- <VueSeamlessScroll
                :data="tableData[4]"
                class="warp"
                :class-option="{
                  singleHeight: fontSize(30),
                  waitTime: 2000,
                }"
              > -->
              <div class="warp">
                <ul class="px-[10px]">
                  <li
                    v-for="(item, index) in tableData[4]"
                    :key="'data' + index"
                    class="flex"
                    :style="getRowsHeight(4)"
                  >
                    <div
                      v-for="(column, colIndex) in tableColumns[4]"
                      :key="'column' + colIndex"
                      class="truncate"
                      :class="
                        colIndex < tableColumns[4].length - 1
                          ? 'pr-[10px]'
                          : 'pr-0'
                      "
                      :style="
                        getCellStyles(
                          tableData[4][index].BColors,
                          tableData[4][index].FColors,
                          column,
                          tableColumns[4],
                        )
                      "
                    >
                      {{ tableData[4][index][column.prop] }}
                    </div>
                  </li>
                </ul>
              </div>
              <!-- </VueSeamlessScroll> -->
            </div>
          </div>
        </div>

        <div class="h-full w-30/100 flex flex-col gap-[10px]">
          <div class="panel h-30/100 w-full">
            <div class="chartHead">
              <div class="panel-footer">
                <h2>{{ result1[5]['label'] }}</h2>
              </div>
            </div>
            <div class="chartContent">
              <div class="h-full w-full flex justify-center">
                <div
                  class="w-40/100 h-full flex flex-col items-center justify-center mb-[5%]"
                >
                  <div
                    class="ScreenBaseNum truncate w-full text-center px-[10px]"
                  >
                    {{
                      tableData[5][0]['S1'] || tableData[5][0]['S1'] === 0
                        ? tableData[5][0]['S1'].toLocaleString()
                        : null
                    }}
                  </div>
                  <div
                    class="ScreenBaseTitle truncate w-full text-center px-[10px]"
                  >
                    {{ tableData[5][0]['Name1'] }}
                  </div>
                  <svg-icon icon-class="ScreenBase5" class="ScreenBase5" />
                </div>
                <div
                  class="w-40/100 h-full flex flex-col items-center justify-center ml-[5%]"
                >
                  <div
                    class="ScreenBaseNum truncate w-full text-center px-[10px]"
                  >
                    {{
                      tableData[6][0]['S1'] || tableData[6][0]['S1'] === 0
                        ? tableData[6][0]['S1'].toLocaleString()
                        : null
                    }}
                  </div>
                  <div
                    class="ScreenBaseTitle truncate w-full text-center px-[10px]"
                  >
                    {{ tableData[6][0]['Name1'] }}
                  </div>
                  <svg-icon icon-class="ScreenBase5" class="ScreenBase5" />
                </div>
              </div>
            </div>
          </div>
          <div class="panel h-30/100 w-full">
            <div class="chartHead">
              <div class="panel-footer">
                <h2>{{ result1[7]['label'] }}</h2>
              </div>
            </div>
            <div class="chartContent" ref="chart2"></div>
          </div>

          <div class="panel h-40/100 w-full">
            <div class="chartHead">
              <div class="panel-footer">
                <h2>{{ result1[8]['label'] }}</h2>
              </div>
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
import '@/flexible.js';
export default {
  name: 'Screen12',
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
    this.chart = [
      null,
      echarts.init(this.$refs.chart0),
      echarts.init(this.$refs.chart1),
      null,
      null,
      null,
      null,
      echarts.init(this.$refs.chart2),
      echarts.init(this.$refs.chart3),
    ];
    // 在窗口大小变化时，调用 resize 方法重新渲染图表
    this.handleWindowResizeDebounced = debounce(this.handleWindowResize, 200); //设置防抖
    window.addEventListener('resize', this.handleWindowResizeDebounced);
  },
  beforeDestroy() {
    // 在组件销毁时，移除 resize 事件监听器
    window.removeEventListener('resize', this.handleWindowResizeDebounced);
    this.handleWindowResizeDebounced.cancel();
    for (const remarkTb in this.refreshTimers) {
      if (this.refreshTimers.hasOwnProperty(remarkTb)) {
        this.stopRefreshTimer(remarkTb);
      }
    }
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
    // 获取表头数据
    async getTableHeader() {
      let rea = await GetSearchData(
        {
          dicID: 15222,
          rows: 0,
          page: 1,
        },
        '557842568941C6D97DBF4313086B3E2A',
      );
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
      let res = await GetHeader(this.sysID, '557842568941C6D97DBF4313086B3E2A');
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
    async getEcharts(remarkTb) {
      //获取屏幕宽度并计算比例
      function fontSize(res) {
        let clientWidth =
          window.innerWidth ||
          document.documentElement.clientWidth ||
          document.body.clientWidth;
        if (!clientWidth) return;
        return res * (clientWidth / 1920);
      }
      if (remarkTb === 1) {
        this.chartOptions[1] = {
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
            data: this.tableData[1].map((item) => item['Name1']),
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
              labelLayout: {
                hideOverlap: false, // 是否隐藏重叠标签
              },
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
              data: this.tableData[1].map((item) => ({
                value: item.S1,
                name: item.Name1,
              })),
            },
          ],
        };
      } else if (remarkTb === 2) {
        this.chartOptions[2] = {
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
                color: '#C9D2FA',
                fontSize: fontSize(14),
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
              data: this.tableData[2].map((item) => item['Name1']),
            },
          ],
          series: [
            {
              // name: '金额',
              type: 'bar',
              zlevel: 1,
              itemStyle: {
                borderRadius: 30,
                color: '#2F8FFF',
              },
              label: {
                show: true, // 显示标签
                position: 'right',
                fontSize: fontSize(16),
                color: '#fff',
                offset: [fontSize(10), 0],
              },
              barWidth: fontSize(16),
              data: this.tableData[2].map((item) => item['S1']),
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
        };
      } else if (remarkTb === 7) {
        this.chartOptions[7] = {
          grid: {
            containLabel: true,
            bottom: fontSize(0),
            top: fontSize(20),
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
            data: this.tableData[7].map((item) => item['Name1']),
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
              splitNumber: 0,
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
              // name: '折线图名称',
              type: 'line',
              // yAxisIndex: 1, // 与第二个 y 轴关联
              itemStyle: {
                color: '#2F8FFF', // 设置折线颜色为黄色
              },
              lineStyle: {
                width: fontSize(4),
              },
              label: {
                show: true, // 显示标签
                position: 'top', // 标签显示在柱状图的上方
                fontSize: fontSize(14),
                color: '#fff',
                formatter: function (params) {
                  // 在标签文本后添加百分号
                  // return params.value.toFixed(2)
                },
              },
              data: this.tableData[7].map((item) => item['S1']),
            },
          ],
        };
      } else if (remarkTb === 8) {
        this.chartOptions[8] = {
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
            indicator: this.tableData[8].map((item) => ({
              name: item.Name1,
              // min: 0,
              // max:
              //   this.tableData[8].reduce(
              //     (acc, innerItem) => acc + innerItem.S1,
              //     0,
              //   ) / this.tableData[8].length,
            })),
            center: ['50%', '50%'],
            radius: fontSize(100), // 调整雷达图的半径
            // [
            //   {
            //     name: '欠料',
            //     max: 100,
            //   },
            //   {
            //     name: '人员不够',
            //     max: 100,
            //   },
            //   {
            //     name: '机械故障',
            //     max: 100,
            //   },
            //   {
            //     name: '模具异常',
            //     max: 100,
            //   },
            //   {
            //     name: '来料不良',
            //     max: 100,
            //   },
            // ],
          },
          series: [
            {
              // name: '雷达图',
              type: 'radar',
              symbol: 'circle',
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
              label: {
                show: true, // 显示标签
                fontSize: fontSize(14),
                color: '#fff',
              },
              data: [
                {
                  value: this.tableData[8].map((item) => item['S1']),
                },
              ],
            },
          ],
        };
      }
      this.barData(this.chart[remarkTb], this.chartOptions[remarkTb]);
    },
    handleWindowResize() {
      // 调用 resize 方法重新渲染图表
      setTimeout(() => {
        this.chart.map((item, remarkTb) => {
          if (item) {
            this.getEcharts(remarkTb);
            item.resize();
          }
        });
      }, 100);
    },
    // 渲染echart图
    barData(item, option) {
      // echarts.dispose(id);
      item.setOption(option);
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
      let res = await GetSearchData(form, '557842568941C6D97DBF4313086B3E2A');
      const { result, data, count, msg, Columns } = res.data;
      if (result) {
        if (remarkTb === 3 && this.tableColumns[3].length === 0) {
          this.$set(this.tableColumns, remarkTb, Columns[0]);
          this.startRefreshTimer(3, count);
        }
        if (remarkTb === 4 && this.tableColumns[4].length === 0) {
          this.$set(this.tableColumns, remarkTb, Columns[0]);
          this.startRefreshTimer(4, count);
        }
        this.$set(this.tableData, remarkTb, data);
        this.$set(this.tablePagination[remarkTb], 'pageTotal', count);
        if (
          remarkTb === 1 ||
          remarkTb === 2 ||
          remarkTb === 7 ||
          remarkTb === 8
        ) {
          await this.getEcharts(remarkTb);
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
    font-family: 'Microsoft YaHei', sans-serif;
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
