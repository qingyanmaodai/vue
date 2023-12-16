<!--研发重复打样统计分析报表-->
<template>
  <div class="APSContainer flex_flex" v-loading="adminLoading">
    <el-container>
      <el-main style="padding: 0; margin: 0">
        <div class="admin_container_2" style="width: 100%">
          <div class="admin_head" ref="headRef">
            <ComSearch
              ref="searchRef"
              :searchData="formSearchs[0].datas"
              :searchForm="formSearchs[0].forms"
              :remark="0"
              :btnForm="btnForm"
              @btnClick="btnClick"
            />
          </div>
          <div>
            <div class="admin_content">
              <div class="ant-table-title">
                <el-row>
                  <el-col :span="4"
                    ><span class="title">{{ title }}</span></el-col
                  >
                  <el-col :span="20" class="flex_flex_end">
                    <el-radio-group v-model="radioValue" @change="radioChange">
                      <el-radio
                        v-for="(item, index) in parmsBtn2"
                        :key="index"
                        :label="item.value"
                        :value="item.value"
                        >{{ item.label }}</el-radio
                      >
                    </el-radio-group>
                  </el-col>
                </el-row>
              </div>
              <div>
                <el-row>
                  <el-col :span="list.length ? 12 : 24">
                    <ComVxeTable
                      :rowKey="'RowNumber'"
                      :height="height"
                      :tableData="tableData[0]"
                      :tableHeader="tableColumns[0]"
                      :tableLoading="tableLoading[0]"
                      :remark="0"
                      :sysID="sysID[0].ID"
                      :isEdit="isEdit"
                      :isClear="isClear[0]"
                      :pagination="tablePagination[0]"
                      @pageChange="pageChange"
                      @pageSize="pageSize"
                      @selectfun="selectFun"
                      @toPage="usingSearch"
                      @sortChange="sortChange"
                    />
                  </el-col>
                  <el-col :span="12" v-show="list.length">
                    <div
                      v-if="radioValue === 0"
                      id="NumberOption"
                      style="width: 100% !important"
                      :style="{ height: height }"
                    ></div>
                    <div
                      v-else
                      id="ProportionOption"
                      style="width: 100% !important"
                      :style="{ height: height }"
                    ></div>
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
var _this;
import XLSX from 'xlsx';
import ComSearch from '@/components/ComSearch';
import ComAsideTree from '@/components/ComAsideTree';
import ComVxeTable from '@/components/ComVxeTable';
import ComReportTable from '@/components/ComReportTable';
import { GetHeader, GetSearchData, ExportData, GetSearch } from '@/api/Common';
import ComFormDialog from '@/components/ComFormDialog';
import * as echarts from 'echarts';
export default {
  name: 'DevSampleAnalysisReport',
  components: {
    ComSearch,
    ComAsideTree,
    ComVxeTable,
    ComReportTable,
    ComFormDialog,
  },
  data() {
    return {
      parmsBtn2: [
        { label: '显示次数', value: 0 },
        { label: '显示占比', value: 1 },
      ],
      radioValue: 0,
      list: [],
      ProportionOption: {
        title: {
          text: '重复打样分析表',
          left: 'center',
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b}:{c} ({d}%)',
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          textStyle: {
            fontSize: this.computedFontSize(12),
          },
          itemHeight: this.computedFontSize(14),
          itemWidth: this.computedFontSize(14),
        },
        series: [
          {
            color: [],
            name: '',
            type: 'pie',
            radius: '50%',
            center: ['50%', '50%'],
            data: [],
            minAngle: 5,
            label: {
              formatter: '{b}:{c} ({d}%)',
              textStyle: {
                margin: 40,
                fontSize: this.computedFontSize(14),
              },
            },
            avoidLabelOverlap: true,
          },
        ],
      },
      NumberOption: {
        tooltip: {
          trigger: 'item',
        },
        title: {
          text: '重复打样分析图',
          left: 'center',
        },
        grid: {
          top: '6%',
          left: '10%',
          right: '5%',
          bottom: '5%',
        },
        color: '#0960bd',
        xAxis: {
          type: 'log',
        },
        yAxis: {
          type: 'category',
          data: [],
          axisLabel: {
            interval: 0,
            fontSize: this.computedFontSize(14),
          },
        },
        series: [
          {
            data: [],
            type: 'bar',
            barMaxWidth: '100', //设置每根柱条最大宽度为50
            //显示数值
            itemStyle: {
              normal: {
                label: {
                  show: true, //开启显示
                  position: 'right', //在上方显示
                  textStyle: {
                    //数值样式
                    color: 'black',
                    fontSize: this.computedFontSize(14),
                  },
                },
              },
            },
          },
        ],
      },
      dialogShow: false,
      EditDisabled: false,
      height1: '360px',
      labelStatus1: 0,
      //////////////左侧树节点//////////////
      showAside: true,
      ReplyDate: '',
      treeProps: {
        label: 'SupplierNameCount',
        children: 'children',
      },
      treeData: [],
      treeListTmp: [],
      ////////////////// Search /////////////////
      title: this.$route.meta.title,
      delData: [[]],
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
      parmsBtn: [],
      selectionData: [[], []],
      btnForm: [],
      tableData: [[], []],
      tableColumns: [[], []],
      tableLoading: [false, false],
      isClear: [false, false],
      tablePagination: [
        { pageIndex: 1, pageSize: 500, pageTotal: 0 },
        { pageIndex: 1, pageSize: 500, pageTotal: 0 },
      ],
      height: '707px',
      treeHeight: '765px',
      showPagination: true,
      tagRemark: 0,
      isEdit: false,
      clickData: {},
      isUpdate: true,
      adminLoading: false,
      dialogImport: false,
      fileList: [],
      file: [],
      sysID: [{ ID: 9024 }],
      userInfo: {},
      IsPurchaseBoss: false,
      footerLabel: [''],
    };
  },
  computed: {},
  created() {
    _this = this;
    this.getTableHeader();
    this.judgeBtn();
  },
  mounted() {
    setTimeout(() => {
      this.setHeight();
    }, 500);
  },
  methods: {
    computedFontSize(res) {
      let clientWidth =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth;
      if (!clientWidth) return;
      let fontSize = clientWidth / 1920;
      return res * fontSize;
    },
    radioChange(val) {
      this.getChartData(this.formSearchs[0].datas, 0);
    },
    // 研发重复打样图表
    drawChart(id, option) {
      let myChart = echarts.init(document.getElementById(id));
      myChart.clear();
      myChart.setOption(option, true);
      let chart = document.getElementById(id);
      echarts.init(chart).resize();
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
    handleChanged(file, fileList) {
      var ext = file.name.substring(file.name.lastIndexOf('.') + 1);
      const extension = ext === 'xlsx' || ext === 'xls';
      if (!extension) {
        this.$message.error('上传文件格式只能为xlsx/xls');
        // 取消时在文件列表中删除该文件
        this.$refs.upload.handleRemove(file);
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 50;
      if (!isLt2M) {
        this.$message.error('上传文件大小不能超过 50MB!');
        // 取消时在文件列表中删除该文件
        this.$refs.upload.handleRemove(file);
        return false;
      } else {
        this.file = file;
        this.fileList = fileList;
      }
    },
    handleRemove(file) {
      this.fileList.splice(
        this.fileList.findIndex((item) => item.url === file.url),
        1,
      );
    },
    // 判断按钮权限
    judgeBtn() {
      let routeBtn = this.$route.meta.btns;
      let newBtn = [];
      let permission = false;
      if (routeBtn.length != 0) {
        routeBtn.forEach((x) => {
          if (x.ButtonCode == 'edit') {
            permission = true;
          }
          let newData = this.parmsBtn.filter((y) => {
            return x.ButtonCode == y.ButtonCode;
          });
          if (newData.length != 0) {
            newBtn = newBtn.concat(newData);
          }
        });
      }
      this.$set(this, 'btnForm', newBtn);
      this.$set(this, 'isEdit', permission);
    },
    // 高度控制
    setHeight() {
      this.treeHeight = document.documentElement.clientHeight - 150 + 'px';
      let headHeight = this.$refs.headRef.offsetHeight;
      let rem =
        document.documentElement.clientHeight -
        headHeight -
        this.$store.getters.reduceHeight;
      let newHeight = rem + 'px';
      this.$set(this, 'height', newHeight);
    },
    // 编辑行
    editRow(row) {},
    // 删除行
    delRow(row) {},
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
      this.$set(this.isClear, remarkTb, true);
      this.$set(this.tableLoading, remarkTb, true);
      this.tablePagination[remarkTb].pageIndex = 1;
      this.getTableData(this.formSearchs[remarkTb].datas, remarkTb);
      this.getChartData(this.formSearchs[remarkTb].datas, remarkTb);
      setTimeout(() => {
        this.$set(this.isClear, remarkTb, false);
      });
    },
    // 重置
    dataReset(remarkTb) {
      for (let name in this.formSearchs[remarkTb].datas) {
        if (name != 'dicID') {
          if (this.formSearchs[remarkTb].forms.length) {
            // 判断是否是页面显示的查询条件，是的字段才清空
            this.formSearchs[remarkTb].forms.forEach((element) => {
              if (element.prop === name) {
                this.formSearchs[remarkTb].datas[name] = null;
              }
            });
          }
        }
      }
    },
    // 获取表头数据
    async getTableHeader() {
      let IDs = this.sysID;
      let res = await GetHeader(IDs);
      const { datas, forms, result, msg } = res.data;
      //因为打样明细用的同个ID，但页面表头展示方式不一致，所以打样分析表表头写死。
      let newList = [
        {
          ControlType: 'textbox',
          displayName: '成品料号机型',
          label: '成品料号机型',
          name: 'ProductName',
          prop: 'ProductName',
          width: '80',
          size: 80,
          sortable: 'custom',
        },
        {
          ControlType: 'textbox',
          displayName: '纯编码',
          label: '纯编码',
          name: 'CodeNumber',
          prop: 'CodeNumber',
          width: '80',
          size: 80,
          sortable: 'custom',
        },
        {
          ControlType: 'textbox',
          displayName: '申请人',
          label: '申请人',
          name: 'ApplicatName',
          prop: 'ApplicatName',
          width: '60',
          size: 60,
          sortable: 'custom',
        },
        {
          ControlType: 'textbox',
          displayName: '重复打样总数',
          label: '重复打样总数',
          name: 'ProofingCount',
          prop: 'ProofingCount',
          width: '100',
          size: 100,
          sortable: 'custom',
        },
        {
          ControlType: 'textbox',
          displayName: '打样次数',
          label: '打样次数',
          name: 'ProofingCountByPeople',
          prop: 'ProofingCountByPeople',
          width: '100',
          size: 100,
          sortable: 'custom',
        },
      ];
      if (result) {
        // 获取每个表头
        datas.some((m, i) => {
          m.forEach((n) => {
            // 进行验证
            this.verifyData(n);
            if (n.children && n.children.length != 0) {
              n.children.forEach((x) => {
                this.verifyData(x);
              });
            }
            newList.forEach((item) => {
              if (item.prop === n.prop) {
                //列标题保持一致
                item.displayName = n.displayName;
                item.label = n.label;
              }
            });
          });
          this.$set(this.tableColumns, i, newList);
        });
        // 获取查询的初始化字段 组件 按钮
        let formList = []; //因为和明细共用9024表，查询条件列无展示和影响右边图形，所以只取所需。
        forms.some((x, z) => {
          this.$set(this.formSearchs[z].datas, 'dicID', IDs[z].ID);
          x.forEach((y) => {
            if (y.prop && y.value) {
              this.$set(this.formSearchs[z].datas, [y.prop], y.value);
            } else {
              this.$set(this.formSearchs[z].datas, [y.prop], '');
            }
            if (y.prop === 'ApplicatName') {
              formList.push(y);
            }
          });
          this.$set(this.formSearchs[z], 'forms', formList);
        });
        this.getTableData(this.formSearchs[0].datas, 0);
        this.$nextTick(() => {
          this.getChartData(this.formSearchs[0].datas, 0);
        });
      }
    },
    // 验证数据
    verifyData(n) {
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
      // let
      this.$set(this.tableLoading, remarkTb, true);
      form['rows'] = this.tablePagination[remarkTb].pageSize;
      form['page'] = this.tablePagination[remarkTb].pageIndex;
      form['sort'] = 'ApplicatBy desc'; //ApplicatBy
      form['groupby'] = 'ProductName,CodeNumber,ApplicatBy,ApplicatName';
      form['fields'] =
        'ProductName,CodeNumber,ApplicatBy,ApplicatName,max(ProofingCount) as ProofingCount,max(ProofingCountByPeople) as ProofingCountByPeople';
      form['dicID'] = form['dicID'];
      let res = await GetSearchData(form);
      const { result, data, count, msg } = res.data;
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
    // 获取图表数据
    async getChartData(form, remarkTb) {
      let forms = {};
      this.$set(this.tableLoading, remarkTb, true);
      forms['rows'] = 0;
      forms['page'] = this.tablePagination[remarkTb].pageIndex;
      // forms["sort"] = 'ApplicatBy desc';//ApplicatBy
      // forms["fields"] = 'ApplicatBy,ApplicatName,sum(ProofingCount) as ProofingCount';
      // forms["groupby"] = 'ApplicatBy,ApplicatName';
      forms['ApplicatName'] = form['ApplicatName'];
      forms['dicID'] = form['dicID'];
      let res = await GetSearch(forms, '/APSAPI/DevSampleAnalysis');
      const { result, data, count, msg } = res.data;
      if (result) {
        if (this.radioValue === 0) {
          let xList = [];
          let yList = [];
          this.list = data;
          data.forEach((item) => {
            xList.push(item.ProofingCount || null); //因为差距大数值过小基本看不见，设置值为null并结合type: 'log',可解决此问题
            yList.push(item.ProofingCountByPeople || '无');
          });
          this.NumberOption.yAxis.data = yList;
          this.NumberOption.series[0].data = xList;
          this.$nextTick(() => {
            this.drawChart('NumberOption', this.NumberOption);
          });
        } else {
          let list = [];
          data.forEach((item) => {
            list.push({
              value: item.ProofingCount || null,
              name: item.ProofingCountByPeople || '无',
            });
          });
          this.ProportionOption.series[0].data = list;
          this.$nextTick(() => {
            this.drawChart('ProportionOption', this.ProportionOption);
          });
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
    // 选择数据
    selectFun(data, remarkTb, row) {
      this.$set(this.selectionData, remarkTb, data);
    },
    // 可用量查询
    usingSearch(row, prop) {
      this.formSearchs[1].datas['MaterialID'] = row.MaterialID;
      this.formSearchs[1].datas['Remark1'] = '送货';
      this.dataSearch(1);
      this.dialogShow = true;
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .admin_content .toolbar .vxe-tools--operate {
  position: absolute;
  left: 10rem;
  top: -3rem;
}
</style>
