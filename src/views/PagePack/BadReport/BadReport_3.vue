<!--采购复期统计列表-->
<template>
  <div class="APSContainer" v-loading="adminLoading">
    <div class="admin_head" ref="headRef">
      <ComSearch
        ref="searchRef"
        :searchData="formSearchs[0].datas"
        :searchForm="formSearchs[0].forms"
        :remark="0"
        :isMoreHeader="true"
        :isLoading="isLoading"
        :btnForm="btnForm"
        @btnClick="btnClick"
      />
    </div>
    <div>
      <div class="admin_content">
        <div class="echart_up" ref="echart_up">
          <div id="echart_one" class="echart"></div>
        </div>
        <div class="ant-table-title">
          <el-row>
            <el-col :span="4"
              ><span class="title">{{ title }}</span></el-col
            >
            <el-col :span="20" class="flex_flex_end"> </el-col>
          </el-row>
        </div>
        <ComUmyTable
          :rowKey="'RowNumber'"
          :height="height"
          :tableData="tableData[0]"
          :tableHeader="tableColumns[0]"
          :tableLoading="tableLoading[0]"
          :remark="0"
          :sysID="sysID[0].ID"
          :isSpanMethods="true"
          :isClear="isClear[0]"
          :pagination="tablePagination[0]"
          :showPagination="false"
          @pageChange="pageChange"
          @pageSize="pageSize"
          @sortChange="sortChange"
        />
      </div>
    </div>

    <!-- 导出多级表头的虚拟表 -->
    <el-table
      ref="exportTableRef"
      v-show="false"
      :data="generalExportData"
      :row-key="'RowNumber'"
      height="500px"
    >
      <el-table-column
        v-for="(item, key) in generalExportHeader"
        :key="key"
        :prop="item.prop"
        :label="item.label"
      >
        <template v-if="item.children">
          <el-table-column
            :prop="i.prop"
            :label="i.label"
            v-for="(i, k) in item.children"
            :key="k"
          >
          </el-table-column>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
var _this;
import XLSX from 'xlsx';
import * as echarts from 'echarts';
import FileSaver from 'file-saver';
import ComSearch from '@/components/ComSearch';
import ComVxeTable from '@/components/ComVxeTable';
import ComUmyTable from '@/components/ComUmyTable';
import { GetHeader, GetSearchData, ExportData, GetSearch } from '@/api/Common';
import formatDate from '@/utils/formatDate';
import { parse } from 'path-to-regexp';
export default {
  name: 'BadReport_3',
  components: {
    ComSearch,
    ComVxeTable,
    ComUmyTable,
  },
  data() {
    return {
      ////////////////// Search /////////////////
      // 多级表头
      generalExportData: [],
      generalExportHeader: [],
      title: this.$route.meta.title,
      drawer: false,
      formSearchs: [
        {
          datas: {},
          forms: [],
        },
      ],
      btnForm: [],
      tableData: [[]],
      tableColumns: [[]],
      tableLoading: [false],
      isClear: [false],
      tablePagination: [{ pageIndex: 1, pageSize: 0, pageTotal: 0 }],
      height: '707px',
      showPagination: true,
      tagRemark: 0,
      isLoading: false,
      adminLoading: false,
      echart_one: {
        title: {
          text: '',
        },
        color: ['#ffba55', '#56ca95', '#6096e6'],
        tooltip: {
          trigger: 'axis',
          formatter: function (params) {
            var result = params[0].name + '<br>';
            params.forEach(function (item, i) {
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
        legend: [
          {
            data: ['报废数'],
            textStyle: {
              fontSize: 12,
              color: '#151515',
              fontWeight: '900',
            },
            top: '0%',
            align: 'right',
            right: '12%',
          },
          {
            data: ['累计占比'],
            textStyle: {
              fontSize: 12,
              color: '#151515',
              fontWeight: '900',
            },
            align: 'right',
            top: '0%',
            right: '7%',
          },
          // {
          //   data: ["今日复期"],
          //   textStyle: {
          //     fontSize: 12,
          //     color: "#151515",
          //     fontWeight: "900",
          //   },
          //   align: "right",
          //   top: "0%",
          //   right: "2%",
          // },
        ],
        offset: 20,
        grid: {
          left: '2%',
          right: '2%',
          top: '25%',
          bottom: '12%',
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
              color: '#151515',
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
            lineStyle: {
              color: '#151515',
            },
          },
          data: [],
        },
        yAxis: {
          max: 100,
          type: 'value',
          name: '',
          splitLine: { show: false },
          axisLine: {
            show: false,
            symbol: ['none', 'arrow'],
            symbolOffset: 12,
            lineStyle: {
              color: '#151515',
            },
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            show: false,
            formatter: '{value}%',
            textStyle: {
              color: '#151515',
              fontSize: 14,
            },
          },
        },
        series: [
          {
            name: '报废数',
            type: 'bar',
            barWidth: 20,
            data: [],
            barGap: '40%',
            label: {
              show: true,
              position: 'top',
              color: '#151515',
              formatter: function (params) {
                if (params.name !== '') {
                  return params.value;
                } else {
                  return '';
                }
              },
            },
          },
          {
            name: '累计占比',
            type: 'line',
            barWidth: 20,
            data: [],
            label: {
              show: true,
              position: 'top',
              color: '#FF2E00',
              formatter: function (params) {
                if (params.name !== '') {
                  return params.value + '%';
                } else {
                  return '';
                }
              },
            },
          },
          // {
          //   name: "今日复期",
          //   type: "bar",
          //   barWidth: 20,
          //   data: [],
          //   label: {
          //     show: true,
          //     position: "top",
          //     color: "#151515",
          //   },
          // },
        ],
      },
      // 立体图
      left3DColors: [],
      right3DColors: [],
      sysID: [{ ID: 7814 }],
    };
  },
  watch: {},
  created() {
    _this = this;
    // this.echartStyle();
    this.getTableHeader();
  },
  mounted() {
    setTimeout(() => {
      this.setHeight();
    }, 450);
  },
  methods: {
    drawChart(id, option) {
      let myChart = echarts.init(document.getElementById(id));
      myChart.setOption(option, true);
      let chart = document.getElementById(id);
      echarts.init(chart).resize();
    },
    // 图表的各个样式
    echartStyle() {
      this.left3DColors = [];
      this.right3DColors = [];
      for (let i = 0; i < 20; i++) {
        this.left3DColors.push({
          type: 'linear',
          x: 0,
          x2: 1,
          y: 0,
          y2: 0,
          colorStops: [
            {
              offset: 0,
              color: '#88b8FF', // 最左边
            },
            {
              offset: 0.5,
              color: '#8DC2FF', // 左边的右边 颜色
            },
            {
              offset: 0.5,
              color: '#4C71D1', // 右边的左边 颜色
            },
            {
              offset: 1,
              color: '#4C71D1',
            },
          ],
        });
        this.right3DColors.push({
          type: 'linear',
          x: 0,
          x2: 1,
          y: 0,
          y2: 0,
          colorStops: [
            {
              offset: 0,
              color: '#4FFFC0',
            },
            {
              offset: 0.5,
              color: '#39F2B0',
            },
            {
              offset: 0.5,
              color: '#2DE0A0',
            },
            {
              offset: 1,
              color: '#2DE0A0',
            },
          ],
        });
      }
    },
    // 高度控制
    setHeight() {
      let headHeight = this.$refs.headRef.offsetHeight;
      let echartHeight = this.$refs.echart_up.offsetHeight;
      let rem =
        document.documentElement.clientHeight -
        echartHeight -
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
    // 导出多级表头
    async exportmoreExcel(remarkTb) {
      this.adminLoading = true;
      this.$message.info('数据如若过多可能会加载很慢，请耐心等待！');
      this.generalExportHeader = this.tableColumns[remarkTb];
      let newForm = JSON.parse(
        JSON.stringify(this.formSearchs[remarkTb].datas),
      );
      newForm.rows = 0;
      let res = await GetSearchData(newForm);
      const { result, data, count, msg } = res.data;
      if (result) {
        _this.generalExportData = data;
        _this.$nextTick(() => {
          let $e = _this.$refs.exportTableRef.$el;
          var fix = $e.querySelector('.el-table__fixed');
          let wb;
          if (fix) {
            wb = XLSX.utils.table_to_book(
              //导出表格类名
              $e.removeChild(fix),
            );
            $e.appendChild(fix);
          } else {
            wb = XLSX.utils.table_to_book($e, { raw: true });
          }
          // _this[searchData](form)
          _this.exportMoreData(wb, '汇总表');
        });
      } else {
        _this.$message.error(msg);
        _this.isLoading = false;
      }
    },
    // 导出多级表头
    exportMoreData(wb, title) {
      /* 获取二进制字符串作为输出 */
      var wbout = XLSX.write(wb, {
        bookType: 'xlsx',
        bookSST: true,
        type: 'array',
      });
      try {
        FileSaver.saveAs(
          //Blob 对象表示一个不可变、原始数据的类文件对象。
          //Blob 表示的不一定是JavaScript原生格式的数据。
          //File 接口基于Blob，继承了 blob 的功能并将其扩展使其支持用户系统上的文件。
          //返回一个新创建的 Blob 对象，其内容由参数中给定的数组串联组成。
          new Blob([wbout], { type: 'application/octet-stream' }),
          //设置导出文件名称
          `${title}.xlsx`,
        );
      } catch (e) {
        if (typeof console !== 'undefined') this.$message.error(e);
      }
      this.adminLoading = false;
      return wbout;
    },
    // 保存
    dataSave(remarkTb) {},
    // 获取表头数据
    async getTableHeader() {
      let IDs = this.sysID;
      let res = await GetHeader(IDs);
      const { datas, forms, result, msg } = res.data;
      if (result) {
        // 获取每个表头
        // datas.some((m, i) => {
        //   m.forEach((n) => {
        //     // 进行验证
        //     this.verifyDta(n);
        //     if (n.children && n.children.length != 0) {
        //       n.children.forEach((x) => {
        //         this.verifyDta(x);
        //       });
        //     }
        //   });
        //   this.$set(this.tableColumns, i, m);
        // });
        // 获取查询的初始化字段 组件 按钮
        forms.some((x, z) => {
          this.$set(this.formSearchs[z].datas, 'dicID', IDs[z].ID);
          x.forEach((y) => {
            if (y.prop && y.value) {
              this.$set(this.formSearchs[z].datas, [y.prop], y.value);
            } else {
              this.$set(this.formSearchs[z].datas, [y.prop], '');
            }
          });
          this.$set(this.formSearchs[z], 'forms', x);
        });
        this.formSearchs[0].datas['PlanYear'] = new Date().getFullYear();
        this.formSearchs[0].datas['MFGOrganizeName'] = '一分厂';
        this.getTableData(this.formSearchs[0].datas, 0);
      }
    },
    // 获取图表数据
    async getEchartData(xAxis, data1, data2) {
      _this.$set(_this.echart_one.xAxis, 'data', []);
      _this.echart_one.series.forEach((o) => {
        o.data = [];
      });

      _this.$set(_this.echart_one.xAxis, 'data', xAxis);
      _this.$set(_this.echart_one.series[0], 'data', data1);
      _this.$set(_this.echart_one.series[1], 'data', data2);
      _this.drawChart('echart_one', _this.echart_one);
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
      form['fields'] =
        'WorkShopID,WorkShopName,sum(BadQty) as BadQty,sum(ConfirmQty) as ConfirmQty, cast(sum(BadQty)/sum(ConfirmQty) as decimal(18,4)) AS BadRate';
      form['groupby'] = 'WorkShopID,WorkShopName';
      form['sort'] = 'BadQty desc';
      let res = await GetSearch(form, '/APSAPI/GetBadReport3');
      console.log(res.data);
      const { result, data, count, msg } = res.data;
      if (result) {
        let columns = [{ label: '车间', prop: 'Tag', width: '80px' }];

        let datas = [];
        datas = [
          { Tag: '生产数', 黑管: 100000 },
          { Tag: '报废数' },
          { Tag: '报废率' },
          { Tag: '占比' },
          { Tag: '累计占比' },
        ];
        let newData_1 = [];
        let xAxis = [];
        let newData_2 = [];
        let newData_3 = [];
        let newData_4 = [];
        let Total_1 = 0;
        let Total_2 = 0;
        let Total_3 = 0;
        let Total_4 = 0;
        if (data.length != 0) {
          let totalNumber = data
            .map((q) => q.BadQty)
            .reduce((list, item) => {
              list += item;
              return list;
            });

          data.forEach((a, index) => {
            xAxis.push(a.WorkShopName);
            Total_1 += parseFloat(a.ConfirmQty);
            Total_2 += parseFloat(a.BadQty);
            newData_1.push(a.BadQty);
            columns.push({
              label: a.WorkShopName,
              prop: a.WorkShopName,
              width: '80px',
            });
            let TotalRate = (
              (parseFloat(a.BadQty) / totalNumber) *
              100
            ).toFixed(2);
            Total_3 += parseFloat(TotalRate);
            newData_2.push(Total_3.toFixed(2));

            this.$set(datas[0], a.WorkShopName, a.ConfirmQty + '');
            this.$set(datas[1], a.WorkShopName, a.BadQty + '');
            this.$set(
              datas[2],
              a.WorkShopName,
              (a.BadRate * 100).toFixed(2) + '%',
            );
            _this.$set(datas[3], a.WorkShopName, TotalRate + '%');
            _this.$set(datas[4], a.WorkShopName, Total_3.toFixed(2) + '%');
          });

          this.$set(this.tableColumns, 0, columns);

          this.$set(this.tableData, 0, datas);
        }

        if (data.length != 0) {
        }
        _this.getEchartData(xAxis, newData_1, newData_2);
        // let ConfirmQtyAvg = 0;
        // let QualifiedQtyAvg = 0;
        // let BadAvg = 0;
        // if (this.formSearchs[0].PlanYear == new Date().getFullYear()) {
        //   let newMonth = new Date().getMonth() + 1;
        //   ConfirmQtyAvg = (Total_1 / newMonth).toFixed(2);
        //   QualifiedQtyAvg = (Total_3 / newMonth).toFixed(2);
        //   BadAvg = (Total_2 / newMonth).toFixed(2);
        // } else {
        //   ConfirmQtyAvg = (Total_1 / 12).toFixed(2);
        //   QualifiedQtyAvg = (Total_3 / 12).toFixed(2);
        //   BadAvg = (Total_2 / 12).toFixed(2);
        // }
        // let TotalAvg = ((Total_2 / Total_1) * 100).toFixed(2) + "%";
        // _this.$set(_this.tableData[0][0], "Month_avg", ConfirmQtyAvg);
        // _this.$set(_this.tableData[0][1], "Month_avg", QualifiedQtyAvg);
        // _this.$set(_this.tableData[0][2], "Month_avg", BadAvg);
        // _this.$set(_this.tableData[0][3], "Month_avg", TotalAvg);
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
    // 列样式
    cellStyle({ row, column }) {
      if (column.property == 'Count_1') {
        return {
          background: '#fb8d8d',
        };
      }
      if (column.property == 'Count_Rate') {
        if (
          parseFloat(row.Count_Rate.substring(0, row.Count_Rate.length - 1)) ==
          0
        ) {
          return {
            background: '#fb8d8d',
          };
        } else if (
          parseFloat(row.Count_Rate.substring(0, row.Count_Rate.length - 1)) <
          100
        ) {
          return {
            background: '#fdfd8f',
          };
        } else {
          return {
            background: '#aeffae',
          };
        }
      }
    },
  },
};
</script>
