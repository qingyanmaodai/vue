<!--表格-->
<template>
  <div class="flex_column content_height APS">
    <div class="firstNode">
      <div class="leftCard APSContainer">
        <div class="admin_head_2" ref="headRef">
          <ComSearch
            ref="searchRef"
            :searchData="formSearchs[0].datas"
            :searchForm="formSearchs[0].forms"
            :remark="0"
            :isLoading="isLoading"
            :btnForm="btnForm"
            :signName="0"
            :Region="4"
            @btnClick="btnClick"
          />
        </div>
        <div v-for="item in [0]" :key="item" class="admin_content flex_grow">
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
            :footerContent="true"
          />
        </div>
      </div>
      <div class="rightCard">
        <div class="headCard">
          <div class="box bgColor1">
            <div class="textBox">
              <div class="textHead">
                <div class="title">{{ headCard[0]['title'] }}</div>
              </div>
              <div class="statusNum">
                {{ headCard[0]['Prop'] }}
              </div>
            </div>
          </div>
          <div class="box bgColor2">
            <div class="textBox">
              <div class="textHead">
                <div class="title">{{ headCard[1]['title'] }}</div>
              </div>
              <div class="statusNum">
                {{ headCard[1]['Prop'] }}
              </div>
            </div>
          </div>
          <div class="box bgColor3">
            <div class="textBox">
              <div class="textHead">
                <div class="title">{{ headCard[2]['title'] }}</div>
              </div>
              <div class="statusNum">{{ headCard[2]['Prop'] }}</div>
            </div>
          </div>
          <div class="box bgColor4">
            <div class="textBox">
              <div class="textHead">
                <div class="title">{{ headCard[3]['title'] }}</div>
              </div>
              <div class="statusNum">{{ headCard[3]['Prop'] }}</div>
            </div>
          </div>
        </div>
        <div class="secondCard">
          <div class="itemCard">
            <div class="echartHead">
              <div class="echartTitle">入库月统计</div>
            </div>
            <div class="echartBody" ref="chart1"></div>
          </div>
        </div>
        <div class="thirdCard">
          <div class="itemCard">
            <div class="echartHead">
              <div class="echartTitle">仓位分布</div>
            </div>
            <div class="echartBody" ref="chart2"></div>
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
  name: 'RNRawMaterialStorage',
  components: {
    ComSearch,
    ComVxeTable,
    ComReportTable,
  },
  data() {
    return {
      headCard: [
        {
          title: '需求总金额（万元）',
          Prop: '53,64',
          changeNum: '+4500',
          iconStatus: true,
        },
        {
          title: '入库总金额（万元）',
          Prop: '21,03',
          changeNum: '-4500',
          iconStatus: false,
        },
        {
          title: '在途总金额（万元）',
          Prop: '52,03',
          changeNum: '+4500',
          iconStatus: true,
        },
        {
          title: '差异金额（万元）',
          Prop: '-15.22',
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
    this.chart = [this.$refs.chart1, this.$refs.chart2];
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
            top: '0',
            data: ['计划数', '入库数'],
            itemWidth: fontSize(14),
            itemHeight: fontSize(14),
          },
          xAxis: {
            // name: "班级",
            triggerEvent: true,
            data: [
              '1月',
              '2月',
              '3月',
              '4月',
              '5月',
              '6月',
              '7月',
              '8月',
              '9月',
              '10月',
              '11月',
              '12月',
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
              },
              axisLabel: {
                interval: 0,
                show: true,
                textStyle: {
                  color: '#444444',
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
              silent: true,
              itemStyle: {
                normal: {
                  color: '#578FFB',
                },
              },
              data: [
                100, 225, 626, 162, 626, 2626, 515, 151, 54, 484, 518, 626,
              ],
            },
            {
              name: '入库数',
              type: 'bar',
              silent: true,
              itemStyle: {
                normal: {
                  color: '#23CF9C',
                },
              },
              data: [
                2626, 515, 151, 54, 484, 518, 626, 100, 225, 626, 162, 626,
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
            top: '0',
            left: 'center',
            orient: 'horizontal',
            // right: "0%",
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
              radius: ['30%', '60%'],
              color: [
                '#23CF9C',
                '#578FFB',
                '#6E40F2',
                '#FF61E6',
                '#E82074',
                '#FBA806',
              ],
              center: ['50%', '60%'],
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
    height: 100%;
    .leftCard {
      width: 65%;
      background: #fff;
      margin-right: 10px;
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    .rightCard {
      width: 35%;
      display: flex;
      flex-direction: column;
      .headCard {
        height: 30%;
        display: grid;
        grid-template-columns: repeat(2, 1fr); /* 创建两列，每列等分剩余空间 */
        grid-template-rows: repeat(2, 1fr); /* 创建两行，每行等分剩余空间 */
        gap: 10px; /* 可选的行和列之间的间距 */
        // display: flex;
        // justify-content: space-between;
        margin-bottom: 10px;
        .box {
          display: flex;
          // width: calc(25% - 16px);
          width: 100%;
          height: 100%;
          // border: 1px solid #d5d6ff;
          box-shadow: 1px 1px 10px rgba(122, 125, 255, 0.1);
          border-radius: 4px;
          margin-right: 10px;
          padding: 22px 10px 26px 10px;
          .textBox {
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .textHead {
              display: flex;
              justify-content: center;
              align-items: center;
              .title {
                font-weight: 400;
                font-size: 14px;
                color: #ffffff;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
            }
            .statusNum {
              font-family: Mplus 1p Bold;
              font-size: 32px;
              font-weight: 700;
              text-align: center;
              color: #ffffff;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
        }
        .box:last-child {
          margin-right: 0px;
        }
        .bgColor1 {
          background: rgba(99, 183, 97, 1);
        }
        .bgColor2 {
          background: rgba(245, 170, 57, 1);
        }
        .bgColor3 {
          background: rgba(64, 170, 246, 1);
        }
        .bgColor4 {
          background: rgba(244, 109, 79, 1);
        }
      }
      .secondCard {
        height: 30%;
        margin-bottom: 10px;
        .itemCard {
          height: 100%;
          border-radius: 4px;
          background: #ffffff;
          display: flex;
          flex-direction: column;
          width: 100%;
        }
      }
      .thirdCard {
        height: 40%;

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
    // height: 480px;
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
  .APSContainer {
    padding: 0;
  }
}
</style>
