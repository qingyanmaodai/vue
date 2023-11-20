<!--订单完成情况-->
<template>
  <div class="APSContainer flex_column content_height" v-loading="adminLoading">
    <splitpanes class="default-theme" horizontal>
      <pane size="100">
        <div class="flex_column bgWhite" style="width: 100%; height: 100%">
          <div
            v-for="i in [0, 1]"
            :key="i + 'head'"
            class="admin_head_2"
            ref="headRef"
            v-show="labelStatus1 === i"
          >
            <ComSearch
              ref="searchRef"
              :searchData="formSearchs[i].datas"
              :searchForm="formSearchs[i].forms"
              :searchMoreForm="formSearchs[i].formsAll"
              :remark="i"
              :isLoading="isLoading"
              :signName="i"
              :Region="Region[i]"
              :btnForm="btnForm"
              @btnClick="btnClick"
            />
          </div>
          <div class="ant-table-title pd-0-6" ref="headRef_2">
            <el-row>
              <el-col :span="4"
                ><span class="title">{{ title }}</span></el-col
              >
              <el-col :span="20" class="flex_flex_end">
                <div v-for="(item, y) in Status1" :key="y">
                  <span
                    @click="changeStatus(item, item['index'])"
                    :class="
                      labelStatus1 == y ? 'statusActive cursor' : 'cursor'
                    "
                    >{{ item.label }}</span
                  >
                  <el-divider direction="vertical"></el-divider></div
              ></el-col>
            </el-row>
          </div>
          <div
            v-for="item in [0, 1]"
            :key="item"
            class="admin_content flex_grow"
            v-show="labelStatus1 === item"
          >
            <ComVxeTable
              :ref="`tableRef${item}`"
              :rowKey="'RowNumber'"
              height="100%"
              :isToolbar="false"
              :isEdit="isEdit[item]"
              :tableData="tableData[item]"
              :tableHeader="tableColumns[item]"
              :tableLoading="tableLoading[item]"
              :remark="item"
              :cellStyle="cellStyle0"
              :sysID="sysID[item]['ID']"
              :isClear="isClear[item]"
              :hasSelect="hasSelect[item]"
              :pagination="tablePagination[item]"
              @pageChange="pageChange"
              @handleRowClick="handleRowClick"
              @pageSize="pageSize"
              @sortChange="sortChange"
              @selectfun="selectFun"
              :keepSource="true"
              :scrollEnable="false"
            />
          </div>
        </div>
      </pane>
    </splitpanes>
    <!-- 新增用户弹框 -->
    <ComFormDialog
      ref="btnForm"
      :title="'插入计划表'"
      :dialogShow="dialogShow"
      :formData="formData"
      :formRules="formRules"
      :formController="formController"
      @dialogBtnClick="dialogBtnClick"
    />
  </div>
</template>

<script>
var _this;
import { Splitpanes, Pane } from 'splitpanes';
import 'splitpanes/dist/splitpanes.css';
import ComSearch from '@/components/ComSearch/AdvancedSearch';
import ComFormDialog from '@/components/ComFormDialog';
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
  name: 'OrderCompletionStatus',
  components: {
    ComSearch,
    ComVxeTable,
    ComReportTable,
    ComBatchEdit,
    Splitpanes,
    Pane,
    ComFormDialog,
  },
  data() {
    return {
      ////////////////// Search /////////////////
      footerLabel: [''],
      expendColl: false,
      machineCycle: '',
      expendCollText: '收缩',
      selectionData: [[], []],
      title: this.$route.meta.title,
      height2: '240px',
      height3: '180px',
      includeFields: [['ProducedQty', 'ConfirmQty'], [], []],
      drawer: false,
      formSearchs: [
        {
          datas: {
            SaleType: 'OUTSale',
          },
          forms: [],
        },
        {
          datas: {
            SaleType: 'INSale',
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
      ],
      //////////////新增弹框//////////////
      dialogShow: false,
      formData: {
        InsertDate: '',
        ProductionOrganization: '',
        Sequence: '',
        type: [],
      },
      formController: [
        { label: '插入日期', prop: 'InsertDate', type: 'date' },
        { label: '生产组织', prop: 'ProductionOrganization', type: 'input' },
        { label: '顺序', prop: 'Sequence', type: 'input' },
        {
          label: '活动性质',
          prop: 'type',
          type: 'checkboxGroup',
          checkbox: [
            {
              label: '忽略工时',
              prop: 'IgnoreWorkingHours',
              // type: 'checkbox',
            },
            {
              label: '多笔落产一起重排',
              prop: 'MultipleOrdersRescheduledTogether',
              // type: 'checkbox',
            },
          ],
        },
      ],
      formRules: {
        // ButtonName: [
        //   { required: true, message: '按钮名称为必填项', trigger: 'blur' },
        // ],
        // ButtonCode: [
        //   { required: true, message: '按钮编码为必填项', trigger: 'blur' },
        // ],
      },
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
        { label: '外销产品', value: 'OUTSale', index: 0 },
        { label: '内销产品', value: 'INSale', index: 1 },
      ],
      labelStatus1: 0,
      labelStatus2: 0,
      sysID: [{ ID: 12188 }, { ID: 12188 }],
      isEdit: [false, false, false, false, false],
      colDialogVisible1: false,
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
  },
  mounted() {},
  methods: {
    judgeBtn(routeBtn) {
      console.log(routeBtn, 'routeBtn');
      if (routeBtn && routeBtn.length > 0)
        routeBtn.some((item, index) => {
          if (item.ButtonCode == 'save') {
            //假如signName为空，则所有表都显示保存按钮而且全部可编辑，假如不为空，则控制哪个表才可以编辑
            if (!item['signName'] || item['signName'].length === 0) {
              this.isEdit.fill(true);
            } else if (item['signName'] && item['signName'].length > 0) {
              item['signName'].map((item) => {
                this.$set(this.isEdit, item, true);
              });
            }
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
      this.formSearchs[this.labelStatus1].datas['SaleType'] = item.value;
      this.dataSearch(this.labelStatus1);
    },
    changeStatus2(item, index) {
      this.labelStatus2 = index;
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
    HangEvent() {
      this.colDialogVisible1 = true;
    },
    InsertSchedule() {
      this.dialogShow = true;
    },
    // 工艺弹框确定添加
    async dialogBtnClick(val) {
      if (val) {
        console.log(val, 'val');
        // let res = await SaveData([this.formData]);
        // const { result, data, count, msg } = res.data;
        // if (result) {
        //   this.$message({
        //     message: msg,
        //     type: 'success',
        //     dangerouslyUseHTMLString: true,
        //   });
        //   this.dataSearch(0);
        // } else {
        //   this.$message({
        //     message: msg,
        //     type: 'error',
        //     dangerouslyUseHTMLString: true,
        //   });
        // }
        this.dialogShow = false;
      } else {
        _this.$refs.btnForm.$refs.formData.resetFields();
        _this.dialogShow = false;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.boxItem {
  height: 40px;
  width: 120px;
  border: 1px solid #999; /* 使用灰色边框，#999 是灰色的十六进制颜色代码 */
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  &.active {
    background-color: #409eff;
    color: #fff;
    border: 1px solid #409eff;
  }
}
.boxContent {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}
::v-deep .el-dialog__body {
  // height: 70vh !important;
  padding: 30px !important;
  overflow: auto;
  display: flex;
  flex-direction: column;
}
.el-dialog-button {
  width: 100px;
  border-radius: 5px !important;
}
</style>
