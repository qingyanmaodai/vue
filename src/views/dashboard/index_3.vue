<template>
  <div class="page_home">
    <div class="head flex">
      <div
        class="card_box"
        v-for="(item, i) in boxData"
        :key="i"
        :style="{
          background: `url(${item.imgUrl})`,
          backgroundSize: '100% 100%',
        }"
      >
        <div class="head_label">
          {{ item.name }}
        </div>
        <div class="flex_around">
          <div class="head_left_icon">
            <img
              :src="item.icon"
              style="
                width: 60%;
                height: 60%;
                background-size: 100% 100%;
                margin: 20%;
              "
              alt=""
            />
          </div>
          <div class="head_center_label">
            <div>{{ item.name_1 }}：{{ item.num_1 }}</div>
            <div>{{ item.name_2 }}：{{ item.num_2 }}</div>
          </div>
          <div style="margin: auto 0">
            <i class="el-icon-arrow-right" style="font-size: 24px"></i>
          </div>
        </div>
      </div>
    </div>
    <div class="newContent flex_row">
      <div class="content_1">
        <div class="card content_1_left_up">
          <div class="span_text"><span>常用功能</span></div>
          <div class="flex_wrap">
            <div
              v-for="(x, y) in btnData"
              :key="y"
              @click="toPage(x.path)"
              class="btn_icon"
            >
              <img :src="x.imgUrl" alt="" />
              <span>{{ x.label }}</span>
            </div>
          </div>
        </div>
        <div id="echart_1" class="card content_1_left_down"></div>
      </div>
      <div class="content_2">
        <div class="card content_2_right_up">
          <div class="span_text"><span>异常提报提醒与代办</span></div>
          <div>
            <div
              class="newDot_label flex_row"
              v-for="(m, n) in rightData_1"
              :key="n"
            >
              <div class="newDot" :style="{ background: m.color }"></div>
              <div style="margin-left: 6px">{{ m.label }}</div>
              <div style="position: absolute; right: 0">{{ m.num }}</div>
            </div>
          </div>
        </div>
        <div class="card content_2_right_down">
          <div class="span_text" style="padding-bottom: 6px">
            <span>系统管理员</span>
          </div>
          <div class="flex_row" style="margin-bottom: 5px">
            <img :src="envelope" alt="" style="width: 15px; height: 15px" />
            <div class="block_span">第九制造群：xxx （1300000000）</div>
          </div>
          <div class="flex_row">
            <img :src="envelope" style="width: 15px; height: 15px" alt="" />
            <div class="block_span">系统开发管理部：XXX （1300000000）</div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer flex_row">
      <div class="card footer_div">
        <div class="footer_label"><span>计划完成统计</span></div>
        <div id="echart_2" class="echart"></div>
      </div>
      <div style="margin-left: 17px" class="card footer_div">
        <div class="footer_label"><span>出勤率统计</span></div>
        <div id="echart_3" class="echart"></div>
      </div>
    </div>
  </div>
</template>
<script>
import home_1 from '@/assets/imgs/home_1.png';
import home_2 from '@/assets/imgs/home_2.png';
import home_3 from '@/assets/imgs/home_3.png';
import home_4 from '@/assets/imgs/home_4.png';
import envelope from '@/assets/imgs/envelope.png';
import home_icon_1 from '@/assets/svg/home_icon_1.svg';
import home_icon_2 from '@/assets/svg/home_icon_2.svg';
import home_icon_3 from '@/assets/svg/home_icon_3.svg';
import home_icon_4 from '@/assets/svg/home_icon_4.svg';
import icon_1 from '@/assets/svg/icon_1.svg';
import icon_2 from '@/assets/svg/icon_2.svg';
import icon_3 from '@/assets/svg/icon_3.svg';
import icon_4 from '@/assets/svg/icon_4.svg';
import icon_5 from '@/assets/svg/icon_5.svg';
import icon_6 from '@/assets/svg/icon_6.svg';
import icon_7 from '@/assets/svg/icon_7.svg';
import icon_8 from '@/assets/svg/icon_8.svg';
import icon_9 from '@/assets/svg/icon_9.svg';
import icon_10 from '@/assets/svg/icon_10.svg';
import * as echarts from 'echarts';
export default {
  name: 'dashboard',
  data() {
    return {
      envelope: envelope,
      boxData: [
        {
          name: '人员管理',
          name_1: '在职人数',
          name_2: '实到人数',
          imgUrl: home_1,
          icon: home_icon_1,
          num_1: 0,
          num_2: 0,
        },
        {
          name: '设备点检',
          name_1: '设备数量',
          name_2: '今日保障',
          imgUrl: home_2,
          icon: home_icon_2,
          num_1: 0,
          num_2: 0,
        },
        {
          name: '维修费用',
          name_1: '维修数量',
          name_2: '维修费用',
          imgUrl: home_3,
          icon: home_icon_3,
          num_1: 0,
          num_2: 0,
        },
        {
          name: '辅料发放',
          name_1: '发放数量',
          name_2: '库存数量',
          imgUrl: home_4,
          icon: home_icon_4,
          num_1: 0,
          num_2: 0,
        },
      ],
      btnData: [
        { label: '总装计划表', imgUrl: icon_1, path: 'ArrangeInfo' },
        { label: '计划变更查看', imgUrl: icon_2, path: '' },
        { label: '条码管理', imgUrl: icon_3, path: '' },
        { label: '台账维护', imgUrl: icon_4, path: '' },
        { label: '夹具管理', imgUrl: icon_5, path: '' },
        { label: '实时产量', imgUrl: icon_6, path: '' },
        { label: '异常提报', imgUrl: icon_7, path: '' },
        { label: 'E化漏扫', imgUrl: icon_8, path: '' },
        { label: '验货管理', imgUrl: icon_9, path: '' },
        { label: '考勤管理', imgUrl: icon_10, path: '' },
      ],
      rightData_1: [
        { label: '品质异常提醒', color: '#A764EE', num: 0 },
        { label: '缺料与计划', color: '#6B7CF8', num: 0 },
        { label: '异常审核', color: '#12AE85', num: 0 },
        { label: '员工考勤与分配', color: '#A764EE', num: 0 },
        { label: 'E化漏扫', color: '#6B7CF8', num: 0 },
        { label: '评分处理', color: '#12AE85', num: 0 },
        { label: '验货通知', color: '#A764EE', num: 0 },
      ],
      option_1: {
        color: ['#5187EC', '#69BCC5'],
        title: {
          text: '',
        },
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          data: ['', ''],
        },
        grid: {
          left: '3%',
          right: '3%',
          bottom: '3%',
          containLabel: true,
        },
        // toolbox: {
        //   feature: {
        //     saveAsImage: {},
        //   },
        // },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: [],
        },
        yAxis: {
          type: 'value',
          show: true,
          axisTick: {
            show: false,
          },
          axisLine: {
            //y轴
            show: false,
          },
        },
        series: [
          {
            name: '第一根折线',
            type: 'line',
            stack: 'Total',
            data: [],
          },
          {
            name: '第二根折线',
            type: 'line',
            stack: 'Total',
            data: [],
          },
        ],
      },
      option_3: {
        color: ['#5087EC', '#68BBC4', '#FF0000'],
        title: {
          text: '',
        },
        tooltip: {
          trigger: 'axis',
          formatter: function (params) {
            var result = params[0].name + '<br>';
            params.forEach(function (item, i) {
              result +=
                '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' +
                item.color.colorStops[i].color +
                '"></span>';
              result +=
                item.seriesName +
                ': ' +
                '<span class="growth">' +
                item.data +
                '</span><br>';
            });
            return result;
          },
        },
        legend: {
          data: ['在职人数', '出勤人数'],
        },
        offset: 20,
        grid: {
          left: '10%',
          right: '4%',
          bottom: '15%',
        },
        toolbox: {
          feature: {
            //saveAsImage: {}
          },
        },
        xAxis: {
          type: 'category',
          boundaryGap: true,
          axisLabel: {
            margin: 15,
            interval: 0,
            textStyle: {
              fontSize: 13,
            },
          },
          axisTick: {
            show: true,
          },
          axisLine: {
            show: true,
            symbol: ['none', 'none'],
            symbolOffset: 12,
            lineStyle: {},
          },
          data: [],
        },
        yAxis: {
          type: 'value',
          name: '',
          splitLine: { show: false },
          axisLine: {
            show: false,
            symbol: ['none', 'arrow'],
            symbolOffset: 12,
            lineStyle: {},
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            show: true,
            textStyle: {
              fontSize: 14,
            },
          },
        },
        series: [
          {
            name: '在职人数',
            type: 'bar',
            barWidth: 20,
            data: [],
            barGap: '0%',
            label: {
              show: true,
              // position: "top"
            },
            // itemStyle: {
            //   color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            //     { offset: 1, color: "#0386FF" },
            //     { offset: 0, color: "#7BF6F9" },
            //   ]),
            // },
          },
          {
            name: '出勤人数',
            type: 'bar',
            barWidth: 20,
            data: [],
            label: {
              show: true,
              color: function (val) {
                return '';
              },
            },
            // itemStyle: {
            //   color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            //     { offset: 0, color: "#FFD680" },
            //     { offset: 1, color: "#FF8368" },
            //   ])
            // },
          },
          {
            name: '出勤率',
            type: 'line',
            stack: 'Total',
            data: [],
          },
        ],
      },
      option_2: {
        backgroundColor: 'rgba(255,255,255,1)',
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            lineStyle: {
              color: '#15ecf4',
            },
          },
          backgroundColor: 'rgba(0,0,0,.8)',
          // extraCssText: 'box-shadow: 4px 4px 10px rgba(21, 250, 255,.6);',
          formatter: function (params) {
            var result = params[0].name + '<br>';
            params.forEach(function (item) {
              result +=
                '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' +
                item.color +
                '"></span>';
              result +=
                item.seriesName +
                ': ' +
                '<span class="growth">' +
                item.data +
                '</span><br>';
            });
            return result;
          },
        },
        legend: {
          data: ['计划总量', '完成总量'],
        },
        grid: {
          left: '10%',
          right: '4%',
          bottom: '15%',
        },
        xAxis: {
          axisLine: {
            show: true,
            lineStyle: {},
          },
          axisTick: {
            show: true,
          },
          axisLabel: {
            show: true,
            margin: 15,
            textStyle: {
              //改变刻度字体样式
              fontSize: '13',
            },
          },
          data: [],
        },
        yAxis: [
          {
            type: 'value',
            scale: true,
            name: '',
            nameTextStyle: {
              fontSize: 11,
            },
            max: null,
            min: 0,
            axisLine: {
              show: true,
              lineStyle: {},
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              show: false,
              lineStyle: {
                type: 'dashed',
                color: '#4b4d64',
              },
            },
            axisLabel: {
              formatter: '{value}',
              textStyle: {},
            },
          },
          {
            max: 100,
            show: false,
            splitNumber: 5,
            interval: 20,
            axisLine: {
              show: false,
              lineStyle: {
                color: '#fff',
              },
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              show: false,
              lineStyle: {
                type: 'dashed',
                color: '#4b4d64',
              },
            },
            axisLabel: {
              formatter: '{value}%',
              textStyle: {
                //改变刻度字体样式
                color: '#ffffff',
              },
            },
          },
        ],
        series: [
          {
            name: '计划总量',
            type: 'line',
            // smooth: true,
            // yAxisIndex: 1,
            symbol: 'circle',
            symbolSize: 4,
            stack: '产量',
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: 'rgba(255, 232,152, .9)',
                    },
                    {
                      offset: 0.8,
                      color: 'rgba(255, 212, 62,.1)',
                    },
                  ],
                  false,
                ),
                shadowColor: 'rgba(0, 0, 0, 0.1)',
                shadowBlur: 8,
              },
            },
            itemStyle: {
              normal: {
                color: '#FFD43E',
              },
            },
            label: {
              show: true,
              position: 'bottom',
              color: '#FFD43E',
              formatter: function (params) {
                if (params.name !== '') {
                  return params.value;
                } else {
                  return '';
                }
              },
            },
            data: [],
          },
          {
            name: '计划总量',
            type: 'lines',
            stack: '产量',
            coordinateSystem: 'cartesian2d',
            zlevel: 1,
            // yAxisIndex: 1,
            smooth: true,
            symbol: 'circle',
            // effect: {
            //     show: true,
            //     smooth: true,
            //     period: 2,
            //     symbolSize: 6
            // },
            lineStyle: {
              normal: {
                color: '#FFD43E',
                width: 0,
                opacity: 0,
                curveness: 0,
              },
            },
            data: [], // lowline
          },
          {
            name: '完成总量',
            type: 'line',
            // smooth: true,
            symbol: 'circle',
            stack: '产量',
            symbolSize: 8,
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: 'rgba(21, 250, 255,.9)',
                    },
                    {
                      offset: 0.8,
                      color: 'rgba(6, 8, 41,.1)',
                    },
                  ],
                  false,
                ),
                shadowColor: 'rgba(0, 0, 0, 0.1)',
                shadowBlur: 8,
              },
            },
            label: {
              show: true,
              position: 'top',
              color: '#15faff',
              formatter: function (params) {
                if (params.name !== '') {
                  return params.value;
                } else {
                  return '';
                }
              },
            },
            itemStyle: {
              normal: {
                color: '#15faff',
              },
            },
            data: [],
          },
          {
            name: '完成总量',
            type: 'lines',
            coordinateSystem: 'cartesian2d',
            zlevel: 1,
            stack: '产量',
            smooth: true,
            symbol: 'circle',
            effect: {
              show: true,
              smooth: true,
              period: 2,
              symbolSize: 6,
            },
            lineStyle: {
              normal: {
                color: '#15faff',
                width: 1,
                opacity: 0,
                curveness: 0,
              },
            },
            data: [], //lowline
          },
        ],
      },
    };
  },
  craeted() {},
  mounted() {
    this.getData_1();
    this.getData_2();
    this.getData_3();
  },
  methods: {
    // 路由跳转
    toPage(path) {
      this.$router.push({
        name: path,
      });
    },
    // 获取第一个图表数据
    getData_1() {
      let xAxis = ['1月', '2月', '3月', '4月', '5月', '6月', '7月'];
      let series_1 = [12, 345, 4656, 434, 232, 2345, 245];
      let series_2 = [100, 200, 300, 400, 500, 60, , 700];
      this.option_1.xAxis.data = xAxis;
      this.option_1.series[0].data = series_1;
      this.option_1.series[1].data = series_2;
      this.drawChart('echart_1', this.option_1);
    },
    getData_2() {
      let xAxis = ['1月', '2月', '3月', '4月', '5月', '6月', '7月'];
      let series_1 = [12, 345, 20, 434, 232, 2345, 245];
      let series_2 = [100, 200, 300, 400, 500, 60, 700];
      this.option_2.xAxis.data = xAxis;
      this.option_2.series[0].data = series_1;
      this.option_2.series[2].data = series_2;
      this.drawChart('echart_2', this.option_2);
    },
    getData_3() {
      let xAxis = ['1月', '2月', '3月', '4月', '5月', '6月', '7月'];
      let series_1 = [12, 345, 4656, 434, 232, 2345, 245];
      let series_2 = [100, 200, 300, 400, 500, 60, , 700];
      let series_3 = [80, 90, 40, 400, 23, 67, , 45];
      this.option_3.xAxis.data = xAxis;
      this.option_3.series[0].data = series_1;
      this.option_3.series[1].data = series_2;
      this.option_3.series[2].data = series_3;
      this.drawChart('echart_3', this.option_3);
    },
    // 画图表
    drawChart(id, option) {
      let myChart = echarts.init(document.getElementById(id));
      myChart.setOption(option, true);
      let chart = document.getElementById(id);
      echarts.init(chart).resize();
    },
  },
};
</script>
<style lang="scss" scoped>
.page_home {
  padding: 20px 0 0 20px;
  background: #f5f5f5 100%;
  font-weight: bold;
}
.head {
  color: #ffffff;
  font-weight: bold;
  margin-bottom: 12px;
  height: 161px;
  .head_label {
    font-size: 20px;
    padding: 8px 0;
    margin: 0 30px 9px 30px;
    // border-bottom: 2px solid #ffffff;
    // box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.4);
    border-bottom: 2px solid rgba(255, 255, 255, 0.5);
  }
  .head_left_icon {
    width: 90px;
    background: rgba(255, 255, 255, 0.2);
    height: 90px;
    border-radius: 50%;
    margin-right: 8px;
  }

  .head_center_label {
    font-size: 16px;
    margin: auto 0;
  }
}
.newContent {
  // margin-bottom: 12px;
}
.footer {
  height: 349px;
}

.flex_row {
  display: -webkit-flex;
}
.flex_around {
  display: flex;
  justify-content: space-around;
  justify-items: center;
}
.flex_wrap {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}
.btn_icon {
  width: calc((100% - 24px) / 5);
  margin-bottom: 15px;
  padding-left: 70px;
  display: flex;
  cursor: pointer;
  /* line-height: 30px; */
  line-height: 30px;
  justify-content: flex-start;
  justify-items: center;
  span {
    display: inline-block;
    margin-left: 12px;
  }
}
.card {
  border-radius: 10px;
  padding: 0 12px;
  background: #ffffff;
  box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.4);
}
.card_box {
  width: calc((100% - 3.428571rem) / 4);
  height: 100%;
}
.card_box:nth-child(1),
.card_box:nth-child(2),
.card_box:nth-child(3) {
  margin-right: 16px;
}
.content_1 {
  width: calc(100% - 316px);
  margin-right: 16px;
  margin-bottom: 17px;

  .content_1_left_up {
    width: 100%;
    height: 138px;
    margin-bottom: 17px;
  }
  .content_1_left_down {
    width: 100%;
    height: 201px;
  }
}
.content_2 {
  width: 300px;
  .content_2_right_up {
    width: 100%;
    height: 243px;
    margin-bottom: 17px;
    .newDot_label:last-child {
      border-bottom: none !important;
    }
    .newDot_label {
      padding: 3px 0 2px 0;
      position: relative;
      font-size: 14px;
      border-bottom: 1px solid rgba(183, 183, 183, 30);
    }
    .newDot {
      width: 12px;
      margin: auto 0;
      height: 12px;
      border-radius: 50%;
    }
  }
  .content_2_right_down {
    font-size: 14px;
    width: 100%;
    height: 96px;
    .block_span {
      margin: -3px 0 0 5px;
    }
  }
}
.footer_div {
  width: calc((100% - 17px) / 2);
  height: 280px;
}
.span_text {
  font-size: 18px;
  padding: 8px 0 12px 0;
}
.footer_label {
  font-size: 20px;
  font-size: 1.428571rem;
  margin: 5px 0;
  text-align: center;
  color: #000000;
}
.echart {
  height: calc(100% - 50px);
}
</style>
