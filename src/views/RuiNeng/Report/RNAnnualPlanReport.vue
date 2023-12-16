<!--表格-->
<template>
  <div class="flex_column content_height APS">
    <div class="firstNode">
      <div class="headCard">
        <div class="box">
          <div class="icon">
            <svg-icon icon-class="iconAnnualHead-0" class="iconAnnual" />
          </div>
          <div class="textBox">
            <div class="statusNum">
              {{ headCard[0]['Prop'] }}
            </div>
            <div class="textHead">
              <div class="title">{{ headCard[0]['title'] }}</div>
            </div>
          </div>
        </div>
        <div class="box">
          <div class="icon">
            <svg-icon icon-class="iconAnnualHead-1" class="iconAnnual" />
          </div>
          <div class="textBox">
            <div class="statusNum">
              {{ headCard[1]['Prop'] }}
            </div>
            <div class="textHead">
              <div class="title">{{ headCard[1]['title'] }}</div>
            </div>
          </div>
        </div>
        <div class="box">
          <div class="icon">
            <svg-icon icon-class="iconAnnualHead-2" class="iconAnnual" />
          </div>
          <div class="textBox">
            <div class="statusNum">{{ headCard[2]['Prop'] }}</div>
            <div class="textHead">
              <div class="title">{{ headCard[2]['title'] }}</div>
            </div>
          </div>
        </div>
        <div class="box">
          <div class="icon">
            <svg-icon icon-class="iconAnnualHead-3" class="iconAnnual" />
          </div>
          <div class="textBox">
            <div class="statusNum">{{ headCard[3]['Prop'] }}</div>
            <div class="textHead">
              <div class="title">{{ headCard[3]['title'] }}</div>
            </div>
          </div>
        </div>
        <div class="box">
          <div class="icon">
            <svg-icon icon-class="iconAnnualHead-4" class="iconAnnual" />
          </div>
          <div class="textBox">
            <div class="statusNum">{{ headCard[4]['Prop'] }}</div>
            <div class="textHead">
              <div class="title">{{ headCard[4]['title'] }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="middleCard">
        <div class="BFirstCard">
          <div class="itemCard">
            <div class="echartHead">
              <div class="echartTitle">计划达成趋势图</div>
            </div>
            <div class="echartBody" ref="chart0"></div>
          </div>
        </div>
        <div class="BSecondCard">
          <div class="itemCard">
            <div class="echartHead">
              <div class="echartTitle">计划概览</div>
            </div>
            <div class="echartBody" ref="chart1"></div>
          </div>
        </div>
        <div class="BSecondCard">
          <div class="itemCard">
            <div class="echartHead">
              <div class="echartTitle">计划按部门占比</div>
            </div>
            <div class="echartBody" ref="chart2"></div>
          </div>
        </div>
      </div>
      <div class="bottomCard">
        <div class="thirdCard">
          <div class="itemCard">
            <div class="echartHead">
              <div class="echartTitle">计划月度汇总统计</div>
            </div>
            <div class="echartBody" v-for="item in [0]" :key="item">
              <ComVxeTable
                :ref="`tableRef${item}`"
                :rowKey="'RowNumber'"
                height="100%"
                :isToolbar="false"
                :isEdit="isEdit[0]"
                :tableData="tableData[0]"
                :tableHeader="tableColumns[0]"
                :tableLoading="tableLoading[0]"
                :remark="0"
                :sysID="sysID[0]['ID']"
                :isClear="isClear[0]"
                :hasSelect="hasSelect[item]"
                :pagination="tablePagination[0]"
                @pageChange="pageChange"
                @handleRowClick="handleRowClick"
                @pageSize="pageSize"
                @sortChange="sortChange"
                @selectfun="selectFun"
                :keepSource="true"
                :footerContent="false"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
let _this;
import ComSearch from '@/components/ComSearch/AdvancedSearch';
import ComVxeTable from '@/components/ComVxeTable';
import ComReportTable from '@/components/ComReportTable';
import * as echarts from 'echarts';
import { debounce } from 'lodash';
import {
  GetHeader,
  GetSearchData,
  ExportData,
  SaveData,
  GetSearch,
} from '@/api/Common';
export default {
  name: 'RNAnnualPlanReport',
  components: {
    ComSearch,
    ComVxeTable,
    ComReportTable,
  },
  data() {
    return {
      headCard: [
        {
          title: '订单总数',
          Prop: '263,394',
          changeNum: '+4500',
          iconStatus: true,
        },
        {
          title: '生产工单数',
          Prop: '647,947',
          changeNum: '-4500',
          iconStatus: false,
        },
        {
          title: '超期订单数',
          Prop: '645',
          changeNum: '+4500',
          iconStatus: true,
        },
        {
          title: '未完工订单数',
          Prop: '1,093',
          changeNum: '+4500',
          iconStatus: true,
        },
        {
          title: '达成率',
          Prop: '97.56%',
          changeNum: '+4500',
          iconStatus: true,
        },
      ],
      ID: 9046,
      isEdit: false,
      isSelect: false,
      adminLoading: false,
      // height: "700px",
      newTag: -1,
      btnForm: [],
      tableData: [
        [
          { Prop: '53,64' },
          { Prop: '21,03' },
          { Prop: '52,03' },
          { Prop: '-15.22' },
        ],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [{ C1: '' }],
        [{ C1: '' }],
        [{ C1: '' }],
        [{ C1: '' }],
        [{ C1: '' }],
      ],
      tableColumns: [[], [], [], [], [], [], [], []],
      tableLoading: [false, false, false, false, false, false, false, false],
      isLoading: false,
      isClear: [false, false, false, false, false, false, false, false],
      hasSelect: [false, false, false, false, false, false, false, false],
      Region: [6, 6, 6, 6, 6, 6, 6, 6],
      tablePagination: [
        { pageIndex: 1, pageSize: 0, pageTotal: 0 },
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
            fields:
              "SUM(PlanQty) as S1,sum(HasQty) AS S2,FORMAT(PlanDay,'MM-dd') as PlanDay",
            groupby: "FORMAT(PlanDay,'MM-dd')",
            // sort: "PlanDay desc",
          },
          forms: [],
        },
        {
          datas: {
            fields: 'SUM(PlanQty) AS S1,WorkShopName',
            groupby: 'WorkShopName',
            // PlanDay: this.currentDate,
          },
          forms: [],
        },
      ],
      sysID: [{ ID: 7921 }, { ID: 5170 }, { ID: 5170 }],
      label: [{ label: null }, { label: null }, { label: null }],
      currentDate: '',
      //echart部分
      chart: [],
      chartOptions: [],
      handleWindowResizeDebounced: null,
      selected1Index: 0,
      selected2Index: 0,
    };
  },
  watch: {},
  created() {
    _this = this;
    let routeBtn = this.$route;
    // 获取所有按钮
    this.btnForm = this.$route.meta.btns;
    this.judgeBtn(this.btnForm);
    this.currentDate = this.$moment().format('YYYY-MM-DD');
    this.getTableHeader();
  },
  activated() {},
  async mounted() {
    // var style = window.getComputedStyle("echartBody");
    //初始化图表;
    this.chart = [this.$refs.chart0, this.$refs.chart1, this.$refs.chart2];
    // 在窗口大小变化时，调用 resize 方法重新渲染图表
    this.handleWindowResizeDebounced = debounce(this.handleWindowResize, 200); //设置防抖
    window.addEventListener('resize', this.handleWindowResizeDebounced);
  },
  methods: {
    //按钮权限
    judgeBtn(routeBtn) {
      if (routeBtn && routeBtn.length > 0)
        routeBtn.some((item, index) => {
          if (item.ButtonCode == 'save') {
            this.$set(this, 'isEdit', true);
          }
        });
      this.$set(this, 'btnForm', routeBtn);
    },
    // 渲染echart图
    barData(id, option) {
      // echarts.dispose(id);
      echarts.init(id).setOption(option);
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
          backgroundColor: '#fff',
          color: [
            '#009B4C',
            '#578FFB',
            '#6E40F2',
            '#FF61E6',
            '#8B5CFF',
            '#00CA69',
          ],
          // legend: {
          //   top: "0%",
          // },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow',
            },
          },
          grid: {
            left: fontSize(10),
            right: fontSize(10),
            bottom: fontSize(10),
            containLabel: true,
          },
          xAxis: [
            {
              type: 'category',
              boundaryGap: false,
              axisLabel: {
                formatter: '{value}日',
                textStyle: {
                  color: '#333',
                },
              },
              axisLine: {
                lineStyle: {
                  color: '#D9D9D9',
                },
              },
              data: [
                '1',
                '2',
                '3',
                '4',
                '5',
                '6',
                '7',
                '8',
                '9',
                '10',
                '11',
                '12',
              ],
            },
          ],
          yAxis: [
            {
              type: 'value',
              name: '单位:万',
              axisLabel: {
                textStyle: {
                  color: '#666',
                },
              },
              nameTextStyle: {
                color: '#666',
                fontSize: fontSize(12),
                lineHeight: fontSize(20),
              },
              splitLine: {
                lineStyle: {
                  type: 'dashed',
                  color: '#E9E9E9',
                },
              },
              axisLine: {
                show: false,
              },
              axisTick: {
                show: false,
              },
            },
          ],
          series: [
            {
              name: '电子车间',
              type: 'line',
              smooth: false,
              // showSymbol: false,/
              symbolSize: 0, //标记点
              zlevel: 3,
              lineStyle: {
                width: fontSize(4),
              },
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
                        color: '#23CF9C30',
                      },
                      {
                        offset: 1,
                        color: '#23CF9C10',
                      },
                    ],
                    false,
                  ),
                  shadowColor: '#23CF9C10',
                  shadowBlur: 10,
                },
              },
              data: [
                132, 219, 84, 298, 56, 214, 179, 45, 267, 93, 176, 309, 62, 198,
                127, 76, 241, 168, 114, 77, 212, 292, 97, 58, 173, 128, 203,
                244, 91, 138,
              ],
            },
          ],
        },
        {
          grid: {
            containLabel: true,
            left: fontSize(10),
            right: fontSize(10),
            bottom: fontSize(10),
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow',
            },
          },
          // legend: {
          //   top: "0",
          //   data: ["计划数", "入库数"],
          //   itemWidth: fontSize(14),
          //   itemHeight: fontSize(14),
          // },
          xAxis: {
            // name: "班级",
            triggerEvent: true,
            data: [
              '丝印组',
              '激光组',
              '宁波1线',
              '宁波2线',
              '宁波3线',
              '宁波4线',
              '宁波5线',
              '宁波6线',
              '宁波7线',
              '宁波8线',
            ],
            axisLabel: {
              interval: 0,
              show: true,
              textStyle: {
                color: '#000',
              },
            },
            axisLine: {
              lineStyle: {
                show: false,
                color: '#F3F3F3',
                width: 2,
              },
            },
          },
          yAxis: [
            {
              name: '单位:万',
              type: 'value',
              nameTextStyle: {
                color: '#444444',
                fontSize: fontSize(12),
                lineHeight: fontSize(20),
              },
              axisLabel: {
                interval: 0,
                show: true,
                textStyle: {
                  color: '#444444',
                },
                formatter: function (value) {
                  // 将数值除以10000并保留两位小数，然后加上 "万" 单位
                  return value / 10000 + '万';
                },
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
                  color: '#E9E9E9',
                },
              },
            },
          ],
          series: [
            {
              name: '计划数',
              type: 'bar',
              barWidth: fontSize(30),
              silent: true,
              itemStyle: {
                normal: {
                  color: '#009B4C',
                  label: {
                    show: false, // 显示标签
                    position: 'top', // 标签位置：在柱形的顶部
                    textStyle: {
                      color: 'black', // 标签文本颜色
                      fontSize: fontSize(12), // 标签文本字号
                    },
                    formatter: function (params) {
                      // 使用千位分隔符格式化标签文本
                      return params.value
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                    },
                  },
                },
              },
              data: [
                102210, 22515, 21125, 16251, 61226, 122626, 51255, 156661,
                52124, 48214,
              ],
            },
          ],
        },
        {
          backgroundColor: '#fff',
          // title: {
          //   text: "注册资金",
          //   subtext: "2016年",
          //   x: "center",
          //   y: "center",
          //   textStyle: {
          //     fontWeight: "normal",
          //     fontSize: 16
          //   }
          // },
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
            itemWidth: fontSize(10),
            itemHeight: fontSize(10),
            textStyle: {
              fontSize: fontSize(12),
            },
            itemStyle: {
              borderRadius: '50%', // 将图例项的形状设定为圆形
            },
            data: this.tableData[2].map((item) => item['WorkShopName']),
          },
          grid: {
            containLabel: true,
          },
          series: [
            {
              type: 'pie',
              // selectedMode: "single",
              radius: ['50%', '80%'],
              center: ['40%', '50%'],
              color: [
                '#009B4C',
                '#3E6EEA',
                '#47A7FF',
                '#4BDB84',
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
                normal: {
                  position: 'inner',
                  formatter: '{d}%',
                  show: true,
                  fontSize: fontSize(10),
                  lineHeight: 15,
                  formatter: function (params) {
                    // let percent = 0;
                    // let total = 0;
                    // for (var i = 0; i < this.tableData[2].length; i++) {
                    //   total += scaleData[i].value;
                    // }
                    // percent = ((params.value / total) * 100).toFixed(0);
                    if (params.name !== '') {
                      // return params.name + '\n' + params.data.data;
                      if (params.name.length > 4) {
                        return (
                          params.name.slice(
                            0,
                            Math.ceil(params.name.length / 2),
                          ) +
                          '\n' +
                          params.name.slice(Math.ceil(params.name.length / 2)) +
                          '\n' +
                          params.percent +
                          '%'
                        );
                      } else {
                        return params.name + params.percent + '%';
                      }
                    } else {
                      return '';
                    }
                  },
                },
                textStyle: {
                  color: '#fff',
                  fontSize: fontSize(12),
                },
              },
              labelLine: {
                normal: {
                  show: false,
                },
              },
              data: this.tableData[2].map((item) => {
                return {
                  value: item['S1'],
                  name: item['WorkShopName'],
                };
              }),
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
    handleConsumeBtnClick(index) {
      if (
        (index === 0 && this.selected1Index === 0) ||
        (index === 1 && this.selected1Index === 1)
      ) {
        // 如果用户已经选择了“预计消耗”按钮，那么不做任何操作
        return;
      } else {
        this.selected1Index = index;
        if (index === 0) {
          // 调用第一个方法
          // your code here
        } else {
          // 调用第二个方法
          // your code here
        }
      }
    },
    handleDayBtnClick(index) {
      if (
        (index === 0 && this.selected2Index === 0) ||
        (index === 1 && this.selected2Index === 1)
      ) {
        // 如果用户已经选择了“预计消耗”按钮，那么不做任何操作
        return;
      } else {
        this.selected2Index = index;
        if (index === 0) {
          // 调用第一个方法
          // your code here
        } else {
          // 调用第二个方法
          // your code here
        }
      }
    },
    // 高度控制
    setHeight() {
      let headHeight = this.$refs.headRef.offsetHeight;

      let rem =
        document.documentElement.clientHeight -
        headHeight -
        this.$store.getters.reduceHeight;
      let newHeight = rem + 'px';
      this.$set(this, 'height', newHeight);
    },
    // 第几页
    pageChange(val, remarkTb, filtertb) {
      this.$set(this.tablePagination[remarkTb], 'pageIndex', val);
      this.getTableData(this.formSearchs[remarkTb].datas, remarkTb);
    },
    // 页数
    pageSize(val, remarkTb, filtertb) {
      this.$set(this.tablePagination[remarkTb], 'pageSize', val);
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
        if (order === 'desc') {
          this.formSearchs[remarkTb].datas['sort'] = prop + ' DESC';
        } else {
          this.formSearchs[remarkTb].datas['sort'] = prop + ' ASC';
        }
      } else {
        this.formSearchs[remarkTb].datas['sort'] = null;
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
        if (name != 'dicID') {
          this.formSearchs[remarkTb].datas[name] = null;
        }
      }
    },
    // 导出
    async dataExport(remarkTb) {
      this.adminLoading = true;
      let form = JSON.parse(JSON.stringify(this.formSearchs[remarkTb].datas));
      form['rows'] = 0;
      let res = await ExportData(form);
      this.adminLoading = false;
      this.$store.dispatch('user/exportData', res.data);
    },
    selectFun(data, remarkTb, row) {
      this.$set(this.selectionData, remarkTb, data);
    },
    // 删除
    async dataDel(remarkTb, index, parms) {
      let res = null;
      let newData = [];
      if (this.selectionData[remarkTb].length == 0) {
        this.$message.error('请单击需要操作的数据！');
        return;
      } else {
        this.selectionData[remarkTb].forEach((x) => {
          let obj = x;
          obj['ElementDeleteFlag'] = 1;
          newData.push(obj);
        });
      }
      this.$confirm('确定要删除的【' + newData.length + '】数据吗？')
        .then((_) => {
          _this.dataSave(remarkTb, index, null, newData);
        })
        .catch((_) => {});
    },
    // 单击行
    handleRowClick(row, remarkTb) {
      this.delData[remarkTb] = [];
      this.delData[remarkTb].push(row);
    },
    // 保存
    async dataSave(remarkTb, index, parms, newData) {
      let res = null;
      this.adminLoading = true;
      if (newData && newData.length != 0) {
        res = await SaveData(newData);
      } else {
        res = await SaveData(this.tableData[remarkTb]);
      }
      const { datas, forms, result, msg } = res.data;
      if (result) {
        this.$message({
          message: msg,
          type: 'success',
          dangerouslyUseHTMLString: true,
        });
        this.dataSearch(remarkTb);
        this.$set(this, 'adminLoading', false);
      } else {
        this.$message({
          message: msg,
          type: 'error',
          dangerouslyUseHTMLString: true,
        });
        this.$set(this, 'adminLoading', false);
      }
    },
    // 获取表头数据
    async getTableHeader() {
      let res = await GetHeader(this.sysID);
      const { datas, forms, result, msg, formsAll } = res.data;
      if (result) {
        // 获取每个表头
        datas.some((m, i) => {
          m.some((n, index) => {
            // 进行验证
            this.verifyDta(n);
            if (n.children && n.children.length != 0) {
              n.children.forEach((x) => {
                this.verifyDta(x);
              });
            }
            if (index === 1) {
              this.tablePagination[i]['pageSize'] = n['pageSize'];
              this.hasSelect[i] = n['IsSelect'];
              this.Region[i] = n['Region'] ? n['Region'] : this.Region[i];
            }
          });
          // 获取查询的初始化字段 组件 按钮
          forms.some((x, z) => {
            this.$set(this.formSearchs[z].datas, 'dicID', this.sysID[z].ID);
            x.forEach((y) => {
              if (y.prop && y.value) {
                this.$set(this.formSearchs[z].datas, [y.prop], y.value);
              } else {
                this.$set(this.formSearchs[z].datas, [y.prop], '');
              }
            });
            this.$set(this.formSearchs[z], 'forms', x);
            this.$set(this.formSearchs[z], 'formsAll', formsAll[z]);
          });
          this.$set(this.tableColumns, i, m);
        });
        // 获取查询的初始化字段 组件 按钮
        await Promise.all(
          forms.map(async (x, z) => {
            this.$set(this.formSearchs[z].datas, 'dicID', this.sysID[z].ID);
            x.forEach((y) => {
              if (y.prop && y.value) {
                this.$set(this.formSearchs[z].datas, [y.prop], y.value);
              } else {
                this.$set(this.formSearchs[z].datas, [y.prop], '');
              }
            });
            await this.getTableData(this.formSearchs[z].datas, z);
          }),
        );
        this.adminLoading = false;
        await this.getEcharts();
      }
    },
    // 验证数据
    verifyDta(n) {
      for (let name in n) {
        if (
          (name == 'component' && n[name]) ||
          (name == 'button' && n[name]) ||
          (name == 'active' && n[name])
        ) {
          n[name] = eval('(' + n[name] + ')');
        }
      }
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
    // 刷新页面
    refrshPage() {
      this.$store.dispatch('tagsView/delCachedView', this.$route).then(() => {
        const { fullPath } = this.$route;
        this.$nextTick(() => {
          this.$router.replace({
            path: '/redirect' + fullPath,
          });
        });
      });
    },
    hexToRgba(hex, opacity) {
      let rgbaColor = '';
      let reg = /^#[\da-f]{6}$/i;
      if (reg.test(hex)) {
        rgbaColor = `rgba(${parseInt('0x' + hex.slice(1, 3))},${parseInt(
          '0x' + hex.slice(3, 5),
        )},${parseInt('0x' + hex.slice(5, 7))},${opacity})`;
      }
      return rgbaColor;
    },
    // 行内样式
    cellStyle7({ row, column }) {
      if (column.property == 'OweQty') {
        if (row['OweQty'] < 0) {
          return {
            color: 'red',
          };
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
.el-container {
}
.APS {
  padding: 10px;
  overflow: hidden;

  .firstNode {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    height: 100%;
    .headCard {
      height: 15%;
      display: grid;
      grid-template-columns: repeat(5, 1fr); /* 创建两列，每列等分剩余空间 */
      gap: 10px; /* 可选的行和列之间的间距 */
      margin-bottom: 10px;
      .box {
        display: flex;
        background: #fff;
        width: 100%;
        height: 100%;
        // border: 1px solid #d5d6ff;
        box-shadow: 1px 1px 10px rgba(122, 125, 255, 0.1);
        border-radius: 4px;

        .icon {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 40%;
          .iconAnnual {
            width: 64px;
            height: 64px;
          }
        }
        .textBox {
          width: 60%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 30px 0px 30px 0px;
          .textHead {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .title {
              font-family: PingFang SC;
              font-weight: 500;
              font-size: 14px;
              color: #787878;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .content {
              display: flex;
              align-items: center;
              img {
                width: 22px;
                height: 22px;
                margin-right: 10px;
              }
              .changeNum {
                font-weight: 400;
                font-size: 10px;
                color: #ff878a;
              }
              .loss {
                color: #a4ffbd;
              }
            }
          }
          .statusNum {
            // text-align: center;
            font-family: PingFang SC;
            font-size: 26px;
            font-weight: 500;
            color: #505050;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
    }
    .middleCard {
      width: 100%;
      height: 30%;
      margin-bottom: 10px;
      display: flex;
      .BFirstCard {
        width: 35%;
        margin-right: 10px;
        .itemCard {
          height: 100%;
          border-radius: 4px;
          background: #ffffff;
          display: flex;
          flex-direction: column;
          width: 100%;
        }
      }
      .BSecondCard {
        width: 35%;
        margin-right: 10px;
        .itemCard {
          height: 100%;
          border-radius: 4px;
          background: #ffffff;
          display: flex;
          flex-direction: column;
          width: 100%;
        }
      }
      .BThirdCard {
        width: 30%;
        .itemCard {
          height: 100%;
          border-radius: 4px;
          background: #ffffff;
          display: flex;
          flex-direction: column;
          width: 100%;
        }
      }
    }
    .bottomCard {
      width: 100%;
      height: 55%;
      display: flex;
      flex-direction: column;
      .thirdCard {
        height: 100%;
        width: 100%;
        .itemCard {
          height: 100%;
          border-radius: 4px;
          background: #ffffff;
          display: flex;
          flex-direction: column;
          width: 100%;
          .echartBody {
            height: calc(100% - 60px);
            overflow: auto;
            overflow: hidden;
          }
          .echartBody::-webkit-scrollbar {
            display: none;
          }
        }
      }
    }
  }

  .echartHead {
    padding: 0px 20px;
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .echartTitle {
      padding-left: 10px;
      position: relative;
      font-weight: 400;
      font-size: 14px;
      color: #333333;
      font-weight: bold;
    }
    .el-button {
      border-radius: 6px !important;
    }
    .select,
    .el-button:focus,
    .el-button:hover {
      color: #fff;
      border-color: #5c67fd;
      background-color: #5c67fd;
    }
  }
  .echartTitle::before {
    content: ''; /* 伪元素的内容为空 */
    position: absolute; /* 将伪元素设置为绝对定位 */
    top: 50%;
    left: 0; /* 将伪元素向左偏移 50% */
    transform: translateY(-50%) translateX(-50%); /* 通过 transform 属性向左平移自身宽度的一半 */
    display: inline-block; /* 将伪元素设置为行内块元素 */
    width: 4px;
    height: 20px;
    background: #8598ff;
    border-radius: 2px;
    margin-right: 10px;
  }
  .echartBody {
    flex-grow: 1;
    padding: 10px;
    width: 100%;
    // height: 100%;
  }
  .box:hover,
  .itemCard:hover,
  .itemCard1:hover {
    box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.2);
  }

  // .APSContainer {
  //   padding: 0;
  // }
}
</style>
