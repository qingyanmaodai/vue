<!--物料点检-->
<template>
  <div class="APSContainer flex_column content_height" v-loading="adminLoading">
    <splitpanes class="default-theme" horizontal>
      <pane size="50">
        <div class="flex_column bgWhite" style="width: 100%; height: 100%">
          <div class="admin_head_2" ref="headRef">
            <ComSearch
              ref="searchRef"
              :searchData="formSearchs[0].datas"
              :searchForm="formSearchs[0].forms"
              :remark="0"
              :isLoading="isLoading"
              :btnForm="btnForm"
              @btnClick="btnClick"
              :signName="labelStatus1"
              :Region="Region[0]"
            />
          </div>
          <div class="admin_content">
            <div class="ant-table-title" ref="headRef_2">
              <el-row>
                <el-col :span="4"
                  ><span class="title">{{ title }}</span></el-col
                >
                <el-col :span="20" class="flex_flex_end"> </el-col>
              </el-row>
            </div>
          </div>
          <div class="admin_content" style="flex-grow: 1; overflow: hidden">
            <ComVxeTable
              ref="tableRef0"
              :rowKey="'RowNumber'"
              height="100%"
              :isToolbar="false"
              :hasSelect="hasSelect[0]"
              :isEdit="true"
              :tableData="tableData[0]"
              :tableHeader="tableColumns[0]"
              :tableLoading="tableLoading[0]"
              :remark="0"
              :cellStyle="cellStyle0"
              :sysID="sysID[0].ID"
              :footerLabel="footerLabel[0]"
              :isClear="isClear[0]"
              :pagination="tablePagination[0]"
              @pageChange="pageChange"
              @handleRowClick="handleRowClick"
              @pageSize="pageSize"
              @sortChange="sortChange"
              :keepSource="true"
            />
          </div>
        </div>
      </pane>
      <pane size="50">
        <div class="flex_column bgWhite" style="width: 100%; height: 100%">
          <div class="admin_head_2" ref="headRef">
            <ComSearch
              ref="searchRef"
              :searchData="formSearchs[1].datas"
              :searchForm="formSearchs[1].forms"
              :remark="1"
              :isLoading="isLoading"
              :btnForm="btnForm"
              @btnClick="btnClick"
              :signName="labelStatus1"
              :Region="Region[1]"
            />
          </div>
          <div class="admin_content">
            <div class="ant-table-title" ref="headRef_2">
              <el-row>
                <el-col :span="4"
                  ><span class="title">各科室每天开拉情况</span></el-col
                >
                <el-col :span="20" class="flex_flex_end">
                  <!-- <el-select
                    clearable
                    filterable
                    size="small"
                    placeholder="请选择修改值"
                    v-model="OrderNo"
                  >
                    <el-option
                      v-for="(item, i) in OrderNos[1]"
                      :key="i"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                  <el-divider direction="vertical"></el-divider>
                  <el-input
                    size="small"
                    v-model="OrderNoValue"
                    style="width: 160px"
                    placeholder="请输入"
                    @keyup.enter.native="changeProp(1)"
                  ></el-input>
                  <el-divider direction="vertical"></el-divider>
                  <el-button type="primary" size="mini" @click="changeProp(1)">
                    批量修改
                  </el-button> -->

                  <div v-for="i in [1]" :key="'Edit' + i" style="height: 100%">
                    <ComBatchEdit
                      :OrderNos="OrderNos[1]"
                      @changeProp="changeProp"
                      :OrderNo="'Peoples'"
                      :remark="1"
                    />
                  </div>

                  <el-divider direction="vertical"></el-divider>
                </el-col>
              </el-row>
            </div>
          </div>
          <div class="admin_content" style="flex-grow: 1; overflow: hidden">
            <ComVxeTable
              :rowKey="'RowNumber'"
              :isToolbar="false"
              height="100%"
              :isEdit="true"
              :tableData="tableData[1]"
              ref="tableRef1"
              :tableHeader="tableColumns[1]"
              :tableLoading="tableLoading[1]"
              :remark="1"
              :hasSelect="hasSelect[1]"
              :cellStyle="cellStyle"
              :sysID="sysID[1].ID"
              :isClear="isClear[1]"
              @pageChange="pageChange"
              @pageSize="pageSize"
              :pagination="tablePagination[1]"
              @sortChange="sortChange"
              @selectfun="selectFun"
              :keepSource="true"
            />
          </div>
        </div>
      </pane>
    </splitpanes>
  </div>
</template>

<script>
var _this;
import { Splitpanes, Pane } from 'splitpanes';
import 'splitpanes/dist/splitpanes.css';
import ComSearch from '@/components/ComSearch/AdvancedSearch';
import ComVxeTable from '@/components/ComVxeTable';
import ComReportTable from '@/components/ComReportTable';
import ComBatchEdit from '@/components/ComBatchEdit';
import {
  GetHeader,
  GetSearchData,
  ExportData,
  SaveData,
  GetServerTime,
} from '@/api/Common';
export default {
  name: 'ScheduleDetails',
  components: {
    ComSearch,
    ComVxeTable,
    ComReportTable,
    ComBatchEdit,
    Splitpanes,
    Pane,
  },
  data() {
    return {
      ////////////////// Search /////////////////
      footerLabel: [''],
      expendColl: false,
      expendCollText: '收缩',
      selectionData: [[], []],
      title: this.$route.meta.title,
      height2: '240px',
      height3: '180px',
      includeFields: [['ProducedQty', 'ConfirmQty'], [], []],
      drawer: false,
      formSearchs: [
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
      parmsBtn: [],
      parmsBtn2: [
        {
          ButtonCode: 'save',
          BtnName: '保存',
          Type: 'success',
          Ghost: true,
          Size: 'small',
          Methods: 'dataSave',
          Icon: '',
        },
      ],
      btnForm: [],
      btnForm2: [],
      tableData: [[], [], [], []],
      tableColumns: [[], [], [], []],
      tableLoading: [false, false, false, false],
      isClear: [false, false, false, false],
      hasSelect: [false, false, false, false],
      Region: [6, 6, 6, 6],
      tablePagination: [
        { pageIndex: 1, pageSize: 50, pageTotal: 0 },
        { pageIndex: 1, pageSize: 0, pageTotal: 0 },
        { pageIndex: 1, pageSize: 50, pageTotal: 0 },
        { pageIndex: 1, pageSize: 50, pageTotal: 0 },
      ],
      // height: "707px",
      showPagination: true,
      tagRemark: 0,
      isLoading: false,
      adminLoading: false,
      parseForm: {},
      parseSearch: false,
      warehouseValue: '',
      OrderNo: '',
      OrderNoValue: '',
      OrderNos: [[], []],
      Status1: [
        { label: '待确认', value: '未开始' },
        { label: '已完成', value: '已完成' },
        { label: '全部', value: '' },
      ],
      Status2: [
        { label: '全部', value: 0 },
        { label: '未点检', value: 1 },
        { label: '异常', value: 2 },
        { label: '已领未点', value: 3 },
      ],
      labelStatus1: 0,
      labelStatus2: 0,
      sysID: [{ ID: 126 }, { ID: 97 }, { ID: 10084 }, { ID: 6751 }],
      isEdit: false,
      enlargeType: true,
      rem: '',
      warehouses: [],
      userInfo: {},
    };
  },
  watch: {},
  created() {
    _this = this;
    this.adminLoading = true;
    this.userInfo = this.$store.getters.userInfo;
    this.getTableHeader();
    // 获取所有按钮
    this.btnForm = this.$route.meta.btns;
    this.judgeBtn(this.btnForm);
    // this.getWarehosueData();
  },
  mounted() {
    setTimeout(() => {
      this.setHeight();
    }, 600);
  },
  methods: {
    judgeBtn(routeBtn) {
      if (routeBtn && routeBtn.length > 0)
        routeBtn.some((item, index) => {
          if (item.ButtonCode == 'save') {
            this.$set(this, 'isEdit', true);
          }
        });
      this.$set(this, 'btnForm', routeBtn);
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
    async dataSearch(remarkTb) {
      this.tagRemark = remarkTb;
      this.tableData[remarkTb] = [];
      this.$set(this.tableLoading, remarkTb, true);
      this.$set(this.isClear, remarkTb, true);
      this.tablePagination[remarkTb].pageIndex = 1;
      await this.getTableData(this.formSearchs[remarkTb].datas, remarkTb);
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
    // 导出
    async dataExport(remarkTb) {
      this.adminLoading = true;
      let form = JSON.parse(JSON.stringify(this.formSearchs[remarkTb].datas));
      form['rows'] = 0;
      let res = await ExportData(form);
      this.adminLoading = false;
      this.$store.dispatch('user/exportData', res.data);
    },
    // 保存
    async dataSave(remarkTb, index, parms, newData) {
      const $table = this.$refs[`tableRef${remarkTb}`].$refs.vxeTable;
      // 获取修改记录
      let updateRecords = [];
      this.adminLoading = true;
      if ($table) {
        updateRecords = $table.getUpdateRecords();
      }
      if (updateRecords.length == 0) {
        this.$set(this, 'adminLoading', false);
        this.$message.error('当前数据没做修改，请先修改再保存！');
        return;
      }
      let res = await SaveData(updateRecords);
      const { datas, forms, result, msg } = res.data;
      if (result) {
        this.adminLoading = false;
        this.$message({
          message: msg,
          type: 'success',
          dangerouslyUseHTMLString: true,
        });
        this.dataSearch(remarkTb);
      } else {
        this.adminLoading = false;
        this.$message({
          message: msg,
          type: 'error',
          dangerouslyUseHTMLString: true,
        });
      }
    },
    // 获取表头数据
    async getTableHeader() {
      let IDs = this.sysID;
      let res = await GetHeader(IDs);
      const { datas, forms, result, msg } = res.data;
      if (result) {
        // 获取每个表头
        datas.some((m, i) => {
          m.forEach((n) => {
            // 进行验证
            this.verifyDta(n);
            if (n.children && n.children.length != 0) {
              n.children.forEach((x) => {
                this.verifyDta(x);
              });
            }
          });
          m.some((n, index) => {
            if (index === 1) {
              this.tablePagination[i]['pageSize'] = n['pageSize'];
              this.hasSelect[i] = n['IsSelect'];
              this.Region[i] = n['Region'] ? n['Region'] : this.Region[i];
            }
          });
          this.$set(this.tableColumns, i, m);
          this.$set(
            this.OrderNos,
            i,
            m.filter((item) => item['isEdit'] === true),
          );
        });
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
        await this.getTableData(this.formSearchs[0].datas, 0);
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
    // 改变状态
    changeStatus(item, index) {
      this.labelStatus1 = index;
      this.formSearchs[0].datas['IsCompleteInspect'] = item.value;
      this.$set(this.tableData, 1, []);
      this.dataSearch(0);
    },
    // 选择数据
    selectFun(data, remarkTb, row) {
      this.selectionData[remarkTb] = data;
    },
    // 单击获取明细
    handleRowClick(row, remarkTb) {
      this.formSearchs[1].datas['OrganizeID'] = row.OrganizeID;
      this.formSearchs[1].datas['WorkingDate'] = [
        this.$moment(row['YearMonth']).startOf('month').format('YYYY-MM-DD'),
        this.$moment(row['YearMonth']).endOf('month').format('YYYY-MM-DD'),
      ];
      this.dataSearch(1);
    },
    // 行内样式
    cellStyle0({ row, column }) {},
    // 行内样式
    cellStyle({ row, column }) {},
    changeProp(remarkTb, OrderNo, OrderNoValue) {
      if (!OrderNo) {
        this.$message.error('请选择需要修改的值');
        return;
      }
      if (this.tableData[remarkTb].length === 0) {
        this.$message.error('当前表格无数据');
        return;
      }
      if (this.selectionData[remarkTb].length === 0) {
        this.$message.error('请选择需要批量修改的行');
        return;
      }
      this.tableData[remarkTb].forEach((rowItem, rowIndex) => {
        if (rowItem['isChecked'] === true) {
          rowItem[OrderNo] = OrderNoValue;
        }
      });
    },
  },
};
</script>
