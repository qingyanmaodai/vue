<template>
  <div class="APSContainer" style="background: #f3f3f4">
    <el-container class="home">
      <el-main>
        <div class="home_1">
          <el-card v-for="(item, index) in head" :key="index" class="box-card">
            <el-image :src="item.img" style="margin: 0 10% 0 5%" />
            <div
              style="
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
              "
            >
              <div>
                <span class="head">{{ item.label }}</span>
              </div>
              <div class="span">{{ item.number }}</div>
            </div>
          </el-card>
        </div>
        <div class="home_2">
          <div class="home_3">
            <span class="home_4">常用功能</span>
            <i class="el-icon-edit" style="float: right" />
          </div>
          <div class="bodyContent">
            <div v-for="(item, index) in head2" :key="index" class="box-card2">
              <i
                :style="{
                  backgroundImage: 'url(' + item.img + ')',
                  display: 'block',
                  float: 'left',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'cover',
                  width: '36px',
                  height: '36px',
                }"
              />
              <span
                @click="toPage(item.path, item.isUsing)"
                style="margin: 10px 15px"
                >{{ item.label }}</span
              >
            </div>
          </div>
        </div>
        <div class="home_5">
          <div class="home_6">
            <div class="home_7">
              <span class="home_8">计划详情</span>
              <i
                :style="{
                  backgroundImage: 'url(' + img9 + ')',
                  float: 'left',
                  width: '19px',
                  height: '19px',
                  marginTop: '3px',
                  marginLeft: '5px',
                }"
              />
            </div>
            <div class="home_9">
              <span class="home_10">今日计划</span>
              <span class="home_11"></span>
            </div>
            <div class="home_12">
              <div style="float: left; width: 50%; text-align: center">
                <el-image class="home_13" :src="img9" />
              </div>
              <div class="home_14">
                <div class="balance">
                  <i class="home_dot" style="background: #ed5565" />
                  <span>计划总产品数</span>
                  <span style="float: right">{{ pieForm.Q0 }}个</span>
                </div>
                <div class="balance">
                  <i class="home_dot" style="background: #5050d6" />
                  <span>已报工产品数</span>
                  <span style="float: right">{{ pieForm.Q3 }}个</span>
                </div>
                <div class="balance">
                  <i class="home_dot" style="background: #ba55d3" />
                  <span>未报工产品数</span>
                  <span style="float: right">{{ pieForm.Q4 }}个</span>
                </div>
                <div class="balance">
                  <i class="home_dot" style="background: #1ab394" />
                  <span>今日达成</span>
                  <span style="float: right">{{ pieForm.P1 }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="home_15">
            <div class="home_21">
              <!-- <span class="home_22">生产统计</span> -->
              <span class="home_22">生产达成趋势</span>
              <el-button
                class="trend"
                size="mini"
                :class="{ default: show == 2 }"
                style="border-right: 1px solid #8f8f8f"
                @click="queryLastMonth"
                >上月</el-button
              >
              <el-button
                size="mini"
                class="trend"
                :class="{ default: show == 1 }"
                style="border-right: 1px solid #8f8f8f"
                @click="queryMonth"
                >本月</el-button
              >
            </div>
            <div id="lineChart2" class="home_18 echartOne" />
          </div>
        </div>

        <div class="home_19">
          <div class="home_20">
            <div class="home_21">
              <!-- <span class="home_22">今日工序达成占比</span> -->
              <span class="home_22">订单齐套率</span>
            </div>
            <div class="home_23">
              <div id="lineChart" class="home_24 echartOne" />
            </div>
          </div>
          <div class="home_25">
            <div class="home_21">
              <span class="home_22">送货需求计划</span>
              <!-- <span class="home_22">出货达成</span> -->
              <el-button
                class="trend"
                size="mini"
                :class="{ default: show == 2 }"
                style="border-right: 1px solid #8f8f8f"
                @click="queryLastMonth"
                >上月</el-button
              >
              <el-button
                size="mini"
                class="trend"
                :class="{ default: show == 1 }"
                style="border-right: 1px solid #8f8f8f"
                @click="queryMonth"
                >本月</el-button
              >
            </div>
            <div id="lineChart3" class="home_26 echartOne" />
          </div>
        </div>
      </el-main>
      <el-aside class="home_27" width="300px">
        <div class="home_28">
          <span class="home_right_2">代办事项</span>
          <div
            class="asideOne"
            @click="toPage('CategoryInfo', dotPage[0].isUsing)"
          >
            <i class="home_dot" style="background: #ed5565; margin: 4px 8px" />
            <span>产品缺失工艺</span>
            <span class="asideRight">{{ dotOne }}</span>
          </div>
          <div
            class="asideOne"
            @click="toPage('ProcessInfo', dotPage[1].isUsing)"
          >
            <i class="home_dot" style="background: #1ab394; margin: 4px 8px" />
            <span>工艺缺失</span>
            <span class="asideRight">{{ dotTwo }}</span>
          </div>
          <div
            class="asideOne"
            @click="toPage('CapaticyInfo', dotPage[2].isUsing)"
          >
            <i class="home_dot" style="background: #5050d6; margin: 4px 8px" />
            <span>产能缺失</span>
            <span class="asideRight">{{ dotThree }}</span>
          </div>
          <div
            class="asideOne"
            @click="toPage('ArrangeInfo', dotPage[3].isUsing)"
          >
            <i class="home_dot" style="background: #f859d5; margin: 4px 8px" />
            <span>排班未配置</span>
            <span class="asideRight">{{ dotFour }}</span>
          </div>
          <div class="asideOne" style="border-bottom: none">
            <i class="home_dot" style="background: #f8ac59; margin: 4px 8px" />
            <span>库存预警</span>
            <span class="asideRight">{{ dotFive }}</span>
          </div>
        </div>
        <div class="home_right_1">
          <span class="home_right_2">系统负责人</span>
          <div class="home_right_3">
            <span></span>
          </div>
        </div>
        <div class="home_right_1">
          <!-- <span class="home_right_2">联系电话</span> -->
          <span class="home_right_2">欠料到货状态</span>
          <div class="home_right_3">
            <span></span>
          </div>
        </div>
        <div class="home_right_4">
          <span />
          <div class="home_right_5">
            <span />
          </div>
        </div>
      </el-aside>
    </el-container>
  </div>
</template>

<script>
import { GetSearchData } from '@/api/Common';
import { wjBoardData_1 } from '@/api/Report';
import * as echarts from 'echarts';
import { mapState } from 'vuex';
export default {
  name: 'EastIndex',
  data() {
    return {
      pieForm: {
        Q1: 0,
        Q2: 0,
        Q3: 0,
        Q4: 0,
        P1: '0%',
      },
      img9: require('@/assets/imgs/img9.png'),
      head: [
        {
          label: '今日总计划数',
          img: require('@/assets/imgs/img10.png'),
          number: '0',
        },
        {
          label: '今日总报工数',
          img: require('@/assets/imgs/img11.png'),
          number: '0',
        },
        {
          label: '今日总确认数',
          img: require('@/assets/imgs/img12.png'),
          number: '0',
        },
        {
          label: '今日总达成率',
          img: require('@/assets/imgs/img13.png'),
          number: '0',
        },
      ],
      head2: [
        {
          label: '需求转换',
          img: require('@/assets/imgs/img1.png'),
          path: 'DemandTrans',
          isUsing: false,
        },
        {
          label: '销售计划',
          img: require('@/assets/imgs/img2.png'),
          path: 'SaleScheduling',
          isUsing: false,
        },
        {
          label: '包装计划',
          img: require('@/assets/imgs/img3.png'),
          path: 'PackPlan',
          isUsing: false,
        },
        {
          label: '当日计划',
          img: require('@/assets/imgs/img4.png'),
          path: 'PackDayPlan',
          isUsing: false,
        },
        {
          label: '欠料追踪',
          img: require('@/assets/imgs/img5.png'),
          path: 'OweInfo',
          isUsing: false,
        },
        {
          label: '排班配置',
          img: require('@/assets/imgs/img6.png'),
          path: 'ArrangeInfo',
          isUsing: false,
        },
        {
          label: '工艺配置',
          img: require('@/assets/imgs/img7.png'),
          path: 'CategoryInfo',
          isUsing: false,
        },
        {
          label: '产能配置',
          img: require('@/assets/imgs/img8.png'),
          path: 'CapaticyInfo',
          isUsing: false,
        },
      ],
      dotOne: 0,
      dotTwo: 0,
      dotThree: 0,
      dotOne: 0,
      dotFour: 0,
      dotFive: 0,
      show: 1,
      toDay: '',
      option1: {
        color: [
          '#23d4c9',
          '#7fe20d',
          '#1cadf0',
          '#4d72d9',
          '#e22bca',
          '#dcf117',
          '#ac17f1',
        ],
        backgroundColor: '#fff',
        grid: {
          left: 10,
          right: 40,
          top: 0,
          bottom: 0,
          containLabel: true,
        },
        calculable: true,
        series: [
          {
            name: '',
            type: 'pie',
            radius: [10, 70],
            center: ['50%', '50%'],
            roseType: 'area',
            itemStyle: {
              normal: {
                fontSize: 14,
              },
            },
            data: [{ name: '包装', value: 100 }],
          },
        ],
      },
      option2: {
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          x: '35%',
          y: '0%',
          data: ['计划数', '完成数', '达成率（%）'],
          textStyle: {
            fontSize: 11,
          },
          itemWidth: 10,
          itemHeight: 10,
        },
        calculable: true,
        xAxis: [
          {
            type: 'category',
            data: [],
            axisLabel: {
              interval: 0,
              textStyle: {
                fontSize: 11,
              },
            },
            interval: 4,
            axisTick: {
              //y轴刻度线
              show: true,
            },
            axisLine: {
              //y轴
              show: true,
            },
          },
        ],
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
            boundaryGap: [0.2, 0.2],
            axisTick: {
              //y轴刻度线
              show: true,
            },
            axisLine: {
              //y轴
              show: true,
            },
            axisLabel: {
              textStyle: {
                fontSize: 11,
                // opacity: 0.1,
              },
            },
            splitLine: {
              //决定是否显示坐标中网格
              show: true,
              lineStyle: {
                opacity: 0.2,
              },
            },
          },
          {
            type: 'value',
            name: '',
            nameTextStyle: {
              fontSize: 11,
            },
            min: 0,
            max: 100,
            interval: 5,
            splitLine: { show: false },
            axisTick: {
              //y轴刻度线
              show: false,
            },
            axisLine: {
              //y轴
              show: false,
            },
            axisLabel: {
              formatter: '{value} %',
              textStyle: {
                color: 'rgba(255,255,255,.8)',
                fontSize: 11,
                // opacity: 0.1,
              },
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: ['#fff'],
                opacity: 0.2,
              },
            },
          },
        ],
        animationEasing: 'cubicOut',
        series: [
          {
            name: '计划数',
            type: 'bar',
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#b266ff' },
                  { offset: 1, color: '#121b87' },
                ]),
              },
            },
            data: [],
          },
          {
            name: '确认数',
            type: 'bar',
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#00f0ff' },
                  { offset: 1, color: '#032a72' },
                ]),
              },
            },
            data: [],
          },
          {
            name: '达成率（%）',
            type: 'line',
            yAxisIndex: 1,
            smooth: false,
            symbolSize: 5,
            lineStyle: { normal: { width: 2 } },
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
                      color: 'rgba(230, 48, 123, 0.8)',
                    },
                    {
                      offset: 0.8,
                      color: 'rgba(230, 48, 123, 0)',
                    },
                  ],
                  false,
                ),
                shadowColor: 'rgba(0, 0, 0, 0.1)',
                shadowBlur: 10,
              },
            },
            itemStyle: { normal: { color: '#DA2F78' } },
            data: [],
          },
        ],
      },
      dotPage: [
        { path: 'CategoryInfo', isUsing: false },
        { path: 'ProcessInfo', isUsing: false },
        { path: 'CapaticyInfo', isUsing: false },
        { path: 'ArrangeInfo', isUsing: false },
        { path: '', isUsing: false },
      ],
    };
  },
  created() {
    let d = new Date();
    this.toDay = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
    this.getEchartOneData();
    this.getEchartTwoData();
    this.judgePage();
    this.getDataOne();
    this.getDataTwo();
    this.getDataThree();
    this.getDataFour();
  },
  mounted() {
    this.drawLine();
    // this.getWjBoardData_1();
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo,
      menus: (state) => state.user.menus,
    }),
  },
  methods: {
    // 判断是否有菜单权限
    judgePage() {
      this.head2.forEach((x) => {
        if (
          this.menus.findIndex((y) => {
            return y.Name == x.path;
          }) != -1
        ) {
          x.isUsing = true;
        }
      });

      this.dotPage.forEach((a) => {
        if (
          this.menus.findIndex((s) => {
            return s.Name == a.path;
          }) != -1
        ) {
          a.isUsing = true;
        }
      });
    },
    // 跳转地址
    toPage(val, tag, url) {
      if (tag) {
        this.$router.push({
          name: val,
        });
      } else {
        this.$message.error('您暂未开通此页面的权限！');
      }
    },
    async getDataOne() {
      let form = {};
      form['dicID'] = 6721;
      form['PlanDay'] = [this.toDay, this.toDay];
      form['OrganizeIDs'] = this.userInfo.CenterID;
      let res = await GetSearchData(form);
      const { result, data, count, msg } = res.data;
      if (result) {
        if (data.length != 0) {
          this.pieForm = data[0];
          this.pieForm.Q0 = this.pieForm.Q3 + this.pieForm.Q4;
        }
      } else {
        this.$message({
          message: msg,
          type: 'error',
          dangerouslyUseHTMLString: true,
        });
      }
    },
    async getDataTwo() {
      let form = {};
      form['dicID'] = 1177;
      this.dotOne = 0;
      let res = await GetSearchData(form);
      const { result, data, count, msg } = res.data;
      if (result) {
        if (data.length != 0) {
          data.forEach((x) => {
            if (!x.ProcessGroupName) {
              this.dotOne++;
            }
          });
        }
      } else {
        this.$message({
          message: msg,
          type: 'error',
          dangerouslyUseHTMLString: true,
        });
      }
    },
    async getDataThree() {
      let form = {};
      form['dicID'] = 1182;
      this.dotTwo = 0;
      let res = await GetSearchData(form);
      const { result, data, count, msg } = res.data;
      if (result) {
        if (data.length != 0) {
          data.forEach((x) => {
            if (!x.ProcessName) {
              this.dotTwo++;
            }
          });
        }
      } else {
        this.$message({
          message: msg,
          type: 'error',
          dangerouslyUseHTMLString: true,
        });
      }
    },
    async getDataFour() {
      let form = {};
      form['dicID'] = 5126;
      this.dotThree = 0;
      let res = await GetSearchData(form);
      const { result, data, count, msg } = res.data;
      if (result) {
        if (data.length != 0) {
          data.forEach((x) => {
            if (!x.Capacity) {
              this.dotThree++;
            }
          });
        }
      } else {
        this.$message({
          message: msg,
          type: 'error',
          dangerouslyUseHTMLString: true,
        });
      }
    },
    // 获取数据
    async getWjBoardData_1() {
      let form = {};
      form['MFGOrganizeID'] = this.userInfo.CenterID;
      let res = await wjBoardData_1(form);
      const { result, data, count, msg } = res.data;
      if (result) {
        if (data.Table1.length != 0) {
          this.head[0].number = data.Table1[0].PlanQty;
          this.head[1].number = data.Table1[0].ProducedQty;
          this.head[2].number = data.Table1[0].ConfirmQty;
          if (data.Table1[0].ConfirmQty == 0) {
            this.head[3].number = '0%';
          } else {
            this.head[3].number =
              (
                (data.Table1[0].ConfirmQty / data.Table1[0].PlanQty) *
                100
              ).toFixed(2) + '%';
          }
        }
      } else {
        this.$message({
          message: msg,
          type: 'error',
          dangerouslyUseHTMLString: true,
        });
      }
    },
    // 获取本月计划与达成
    async getEchartOneData() {
      let d = new Date();
      let startMonth = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + '01';
      let form = {};
      form['PlanDay'] = [startMonth, this.toDay];
      form['fields'] =
        'isNull(sum(PlanQty),0) as PlanQty,isNull(sum(ConfirmQty),0) as ConfirmQty, cast(isNull(sum(ConfirmQty),0)/isNull(sum(PlanQty),0)*100 as decimal(18,2)) as PlanQtyP,PlanDay';
      form['groupby'] = 'PlanDay';
      form['dicID'] = 6720;
      let res = await GetSearchData(form);
      const { result, data, count, msg } = res.data;
      if (result) {
        var PlanQty = [];
        var ConfirmQty = [];
        var PlanQtyP = [];
        var PlanDay = [];
        if (data.length != 0) {
          for (var i = 0; i < data.length; i++) {
            if (data[i].PlanDay) {
              data[i].PlanDay = data[i].PlanDay.substring(5, 10);
            }
            PlanDay.push(data[i].PlanDay);
            PlanQty.push(data[i].PlanQty);
            ConfirmQty.push(data[i].ConfirmQty);
            PlanQtyP.push(data[i].PlanQtyP);
          }
          this.option2.xAxis[0].data = PlanDay;
          this.option2.series[0].data = PlanQty;
          this.option2.series[1].data = ConfirmQty;
          this.option2.series[2].data = PlanQtyP;
          this.drawChart('lineChart2', this.option2);
        }
      } else {
        this.$message({
          message: msg,
          type: 'error',
          dangerouslyUseHTMLString: true,
        });
      }
    },
    // 获取今日工序占比
    async getEchartTwoData() {
      let form = {};
      form['fields'] =
        ' ProcessName as name,isNull(sum(PlanQty),0)  as PlanQty, isNull(sum(ConfirmQty),0) as value ';
      form['PlanDay'] = [this.toDay, this.toDay];
      form['groupby'] = ' ProcessName';
      form['dicID'] = 6720;
      let res = await GetSearchData(form);
      const { result, data, count, msg } = res.data;
      if (result) {
        if (data.length != 0) {
          this.option1.series[0].data = data;
        }
        this.drawChart('lineChart', this.option1);
      } else {
        this.$message({
          message: msg,
          type: 'error',
          dangerouslyUseHTMLString: true,
        });
      }
    },
    drawChart(id, option) {
      let myChart = echarts.init(document.getElementById(id));
      myChart.setOption(option, true);
      let chart = document.getElementById(id);
      echarts.init(chart).resize();
    },
    // 查询生产统计本月
    queryMonth: function () {
      this.show = 1;
    },
    // 查询生产统计上月
    queryLastMonth: function () {
      this.show = 2;
    },
    // 查询生产统计本年
    queryYear: function () {
      this.show = 3;
    },
    drawLine() {
      var echarts = require('echarts');
      const myCharts3 = echarts.init(document.getElementById('lineChart3'));
      var option3 = {
        legend: {
          data: ['已达成', '未达成'],
        },
        calculable: true,
        xAxis: [
          {
            type: 'category',
            data: [
              '1日',
              '4日',
              '7日',
              '11日',
              '15日',
              '19日',
              '23日',
              '27日',
              '30日',
            ],
          },
        ],
        yAxis: [
          {
            type: 'value',
          },
        ],
        series: [
          {
            name: '已达成',
            type: 'bar',
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#eb1de0' },
                  { offset: 1, color: '#770371' },
                ]),
              },
            },
            data: [
              30000, 43000, 38670, 12320, 22560, 37670, 41356, 51622, 25260,
            ],
            markPoint: {
              data: [
                { type: 'max', name: '最大值' },
                { type: 'min', name: '最小值' },
              ],
            },
            markLine: {
              data: [{ type: 'average', name: '平均值' }],
            },
          },
          {
            name: '未达成',
            type: 'bar',
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#87cefc' },
                  { offset: 1, color: '#045f9c' },
                ]),
              },
            },
            data: [12800, 9900, 11900, 8640, 6287, 5707, 11756, 7822, 14870],
            markPoint: {
              data: [
                { name: '月最高', value: 6400, xAxis: 10, yAxis: 6400 },
                { name: '月最低', value: 1260, xAxis: 10, yAxis: 6400 },
              ],
            },
            markLine: {
              data: [{ type: 'average', name: '平均值' }],
            },
          },
        ],
      };
      myCharts3.setOption(option3);
    },
  },
};
</script>
<style scoped>
.home_1 {
  height: 111px;
  display: flex;
  justify-content: space-between;
}
.home_2 {
  width: 99%;
  height: 160px;
  margin: 10px 0 10px 0;
  background: #fff;
  border-radius: 5px;
  color: rgb(51, 51, 51);
}
.home_3 {
  height: 40px;
  padding: 14px 14px 0 14px;
}
.home_4 {
  float: left;
  font-size: 16px;
  font-weight: bold;
}
.home_5 {
  width: 99%;
  height: 260px;
}
.home_6 {
  width: 49%;
  float: left;
  margin-right: 1%;
  background: #fff;
  height: 260px;
}
.home_7 {
  height: 40px;
  padding: 15px 15px 15px 15px;
}
.home_8 {
  float: left;
  font-size: 16px;
  color: rgb(51, 51, 51);
  font-weight: bold;
}
.home_9 {
  color: #676a6c;
  width: 96%;
  background: #f4f7fe;
  height: 30px;
  margin: 10px 2%;
  padding: 5px 10px 0 30px;
  font-size: 15px;
  font-weight: bold;
}
.home_10 {
  font-size: 16px;
  font-weight: bold;
  float: left;
}
.home_11 {
  font-size: 16px;
  font-weight: bold;
  float: right;
}
.home_12 {
  color: #676a6c;
  width: 96%;
  height: 170px;
  margin: 0 2%;
  padding: 0 10px 0 10px;
  float: left;
  font-size: 14px;
  font-weight: 600;
}
.home_13 {
  width: 156px;
  height: 156px;
}
.home_14 {
  height: 120px;
  float: right;
  width: 48%;
  margin-left: 8px;
  padding: 15px 0;
}
.home_15 {
  width: 50%;
  height: 260px;
  float: left;
  background: #fff;
}
.home_18 {
  width: 100%;
  height: 220px;
}
.home_19 {
  width: 99%;
  height: 260px;
  margin: 10px 0;
}
.home_20 {
  width: 49%;
  float: left;
  margin-right: 1%;
  background: #fff;
  height: 260px;
}
.home_21 {
  height: 40px;
  padding: 15px 15px 15px 15px;
}
.home_22 {
  float: left;
  font-size: 16px;
  color: rgb(51, 51, 51);
  font-weight: bold;
}
.home_23 {
  height: 210px;
  padding: 7px 0;
  width: 100%;
}
.home_24 {
  width: 100%;
  height: 210px;
}
.home_25 {
  width: 50%;
  height: 260px;
  float: left;
  background: #fff;
}
.home_26 {
  width: 100%;
  height: 220px;
}
.home_28 {
  width: 100%;
  height: 280px;
  border-radius: 5px;
  padding: 10px 10px;
  background: #fff;
}
.home_right_1 {
  width: 100%;
  height: 125px;
  border-radius: 5px;
  margin: 10px 0;
  padding: 10px 10px;
  background: #fff;
}
.home_right_2 {
  margin: 5px 10px;
  font-size: 16px;
  font-weight: bold;
}
.home_right_3 {
  padding: 20px 10px;
  font-size: 14px;
  color: rgb(153, 153, 153);
}
.home_right_4 {
  width: 100%;
  height: 260px;
  border-radius: 5px;
  margin: 10px 0;
  padding: 0 10px;
  background: #fff;
}
.home_right_5 {
  padding: 0 10px;
  font-size: 14px;
  color: rgb(153, 153, 153);
}

.APSContainer {
  margin: 10px 10px 0 10px;
  overflow: auto;
}
.home /deep/ .box-card {
  display: flex;
  height: 100%;
  /*  float: left; */
  width: 24%;
  margin-right: 1%;
  /*padding-top: 15px; */
}
.home /deep/ .box-card2 {
  height: 58px;
  width: 25%;
  /* float: left; */
  cursor: pointer;
  padding-left: 40px;
  display: flex;
  justify-items: center;
}
.home /deep/ .el-card__body {
  width: 100%;
  display: flex;
}
.bodyContent {
  display: flex;
  flex-wrap: wrap;
}
.bodyContent a {
  width: 100%;
  height: 58px;
  cursor: pointer;
  align-items: center;
  display: flex;
}

.asideRight {
  font-family: impact;
  font-weight: bold;
  font-size: 16px;
  color: #676a6c;
  float: right;
}
.box-card .head {
  background: #fff;
  border-radius: 5px;
  color: #999;
}
.box-card /deep/ .el-image {
  width: 50px;
  height: 50px;
}
.balance {
  height: 30px;
}
.bodyContent .el-image {
  width: 36px;
  height: 36px;
  margin-top: 15px;
}
.box-card .span {
  font-family: impact;
  font-weight: bold;
  /* clear: both; */
  font-size: 30px;
  /* text-align: center; */
  color: #676a6c;
}
.home /deep/ .el-main {
  padding: 0;
}
.default {
  color: #0a7dfa !important;
}
.home_dot {
  float: inherit;
  max-width: 12px;
  min-width: 12px;
  max-height: 12px;
  min-height: 12px;
  border-radius: 50%;
  margin: 5px 8px;
  float: left;
  display: block;
  margin-left: 5px;
}
.trend {
  float: right;
  width: 50px;
  background: #fff;
  color: #8f8f8f;
  border: hidden;
  cursor: pointer;
  border-radius: 0%;
  margin-top: -5px;
}
.home /deep/ .el-aside {
  padding: 0;
}
.asideOne {
  height: 45px;
  padding: 15px 5px;
  font-size: 14px;
  position: relative;
  cursor: pointer;
  color: rgb(153, 153, 153);
  font-family: MicrosoftYaHei;
  border-bottom: 1px solid #f5f5f5;
}
.el-button + .el-button,
.el-checkbox.is-bordered + .el-checkbox.is-bordered {
  margin-left: 0 !important;
}

.echartOne canvas,
.echartOne div {
  width: 100% !important;
  height: 100% !important;
}
</style>
