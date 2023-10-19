<!--表格-->
<template>
  <el-container>
    <el-main>
      <div class="firstNode">
        <div class="rightCard">
          <div class="secondCard">
            <div class="itemCard">
              <!-- <div class="echartHead">
                <div class="echartTitle">计划配套趋势</div>
              </div> -->
              <div class="echartBody" ref="chart1"></div>
            </div>
          </div>
        </div>
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
              :Region="Region[0]"
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
              :scrollEnable="false"
              :EnableColumnFiltering="false"
            />
          </div>
        </div>
      </div>
    </el-main>
  </el-container>
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
  name: 'TBSummaryCompletePlan',
  components: {
    ComSearch,
    ComVxeTable,
    ComReportTable,
  },
  data() {
    return {
      isEdit: [false],
      adminLoading: false,
      btnForm: [],
      tableData: [[], []],
      chartData: [],
      tableColumns: [[], []],
      tableLoading: [false, false],
      isLoading: false,
      isClear: [false, false],
      hasSelect: [false, false],
      Region: [6, 6],
      tablePagination: [
        { pageIndex: 1, pageSize: 0, pageTotal: 0 },
        { pageIndex: 1, pageSize: 15, pageTotal: 0 },
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
      ],
      sysID: [{ ID: 14200 }],
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
  },
  activated() {},
  async mounted() {
    //初始化图表;
    this.chart = [echarts.init(this.$refs.chart1)];
    // 在窗口大小变化时，调用 resize 方法重新渲染图表
    this.handleWindowResizeDebounced = debounce(this.handleWindowResize, 200); //设置防抖
    window.addEventListener('resize', this.handleWindowResizeDebounced);
    await this.getTableHeader();
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
    barData(item, option) {
      item.setOption(option);
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
          title: {
            text: '排产订单齐套率趋势',
            textStyle: {
              align: 'center',
              color: '#000',
              fontSize: fontSize(16),
            },
            top: '0',
            left: 'center',
          },
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
            right: 0,
            data: ['计划任务', '配套任务', '计划齐套趋势'],
            itemWidth: fontSize(14),
            itemHeight: fontSize(14),
            itemGap: fontSize(10),
          },
          xAxis: {
            // name: "班级",
            triggerEvent: true,
            data: this.chartData.map((item) => item['prop']),
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
              name: '百分比',
              type: 'value',
              nameTextStyle: {
                color: '#444444',
              },
              axisLabel: {
                interval: 0,
                show: true,
                formatter: '{value}%',
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
            // {
            //   name: '计划任务',
            //   type: 'bar',
            //   barWidth: fontSize(15),
            //   silent: true,
            //   itemStyle: {
            //     normal: {
            //       color: '#009B4C',
            //     },
            //   },
            //   data: [
            //     100, 25, 6, 6, 66, 26, 55, 51, 54, 44, 58, 66, 15, 96, 87, 26,
            //     84, 86, 64, 56,
            //   ],
            // },
            // {
            //   name: '配套任务',
            //   type: 'bar',
            //   barWidth: fontSize(15),
            //   silent: true,
            //   itemStyle: {
            //     normal: {
            //       color: '#40AAF6',
            //     },
            //   },
            //   data: [
            //     84, 86, 64, 56, 51, 54, 44, 58, 66, 25, 6, 6, 66, 26, 34, 98,
            //     75, 52, 25, 63,
            //   ],
            // },
            {
              name: '计划齐套趋势',
              type: 'line',
              silent: true,
              itemStyle: {
                normal: {
                  color: '#FA9A09',
                },
              },
              data: [
                84, 86, 64, 56, 51, 54, 44, 58, 66, 25, 6, 6, 66, 26, 34, 98,
                75, 52, 25, 63,
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
      this.selectionData[remarkTb] = data;
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
            await this.getEcharts();
          }),
        );
        this.adminLoading = false;
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
        Columns.some((m, i) => {
          m.forEach((n, index) => {
            // 进行验证
            this.verifyDta(n);
            if (n.childrens && n.children.length != 0) {
              n.childrens.forEach((x) => {
                this.verifyDta(x);
              });
            }
            this.$set(this.tableColumns, remarkTb, m);
          });
        });
        this.$set(this.tableData, remarkTb, data);
        if (this.chartData.length === 0) {
          this.$set(
            this,
            'chartData',
            Columns[0].filter((item) => {
              return item['prop2'];
            }),
          );
        }
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
  },
};
</script>
<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
.el-container {
}
.el-main {
  padding: 10px;
  height: calc(100vh - 80px);
  overflow: hidden;

  .firstNode {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;

    .rightCard {
      width: 100%;
      height: 30%;
      display: flex;
      margin-bottom: 10px;
      .secondCard {
        width: 100%;
        height: 100%;
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
    .leftCard {
      width: 100%;
      height: 70%;
      background: #fff;
      margin-right: 10px;
      display: flex;
      flex-direction: column;
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
.Documentation {
  height: 80px;
  width: 80px;
}
</style>
