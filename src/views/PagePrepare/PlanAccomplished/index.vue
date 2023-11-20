<!--物料点检-->
<template>
  <div
    class="APSContainer flex_column content_height bgWhite"
    v-loading="adminLoading"
  >
    <div class="admin_head_2" ref="headRef">
      <ComSearch
        ref="searchRef"
        :searchData="formSearchs[0].datas"
        :searchForm="formSearchs[0].forms"
        :searchMoreForm="formSearchs[0].formsAll"
        :remark="0"
        :isLoading="isLoading"
        :signName="0"
        :Region="Region[0]"
        :btnForm="btnForm"
        @btnClick="btnClick"
      />
    </div>
    <div class="ant-table-title pd-0-6 text-red">
      <el-row>
        <el-col :span="4"
          ><span class="title">{{ title }}</span></el-col
        >
        <el-col :span="20" class="flex_flex_end">
          <!-- 批量修改组件 -->
          <!-- <div v-for="i in [0]" :key="'Edit' + i" style="height: 100%">
                  <ComBatchEdit
                    :OrderNos="OrderNos[0]"
                    @changeProp="changeProp"
                    :OrderNo="DVBatch"
                    :remark="0"
                  />
                </div> -->
          <div v-for="(item, y) in Status1" :key="y">
            <span
              @click="changeStatus(item, y)"
              :class="labelStatus1 == y ? 'statusActive cursor' : 'cursor'"
              >{{ item.label }}</span
            >
            <el-divider direction="vertical"></el-divider></div
        ></el-col>
      </el-row>
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
        :cellStyle="cellStyle0"
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
    <!-- 弹框-->
    <!-- <DialogOptTable
      title="关联客户"
      :tableDialog="colDialogVisible2"
      :sysID="sysID[2]['ID']"
      :isEdit="isEdit[2]"
      :remark="2"
      :Region="Region[2]"
      width="80%"
      :hasSelect="hasSelect[2]"
      @closeDialog="colDialogVisible2 = false"
      @btnClickCall="btnClick"
      :searchForm="formSearchs[2]"
      :btnForm="btnForm"
      :isToolbar="false"
      :isConfirmBtn="true"
      :table-data="tableData[2]"
      :table-header="tableColumns[2]"
      :table-loading="tableLoading[2]"
      :table-pagination="tablePagination[2]"
      :isClear="isClear[2]"
      @confirmDialog="confirmDialog"
      @pageChangeCall="pageChange"
      @pageSizeCall="pageSize"
      @sortChangeCall="sortChange"
      @selectFunCall="selectFun"
    ></DialogOptTable> -->
  </div>
</template>

<script>
var _this;
import { Splitpanes, Pane } from 'splitpanes';
import 'splitpanes/dist/splitpanes.css';
import ComSearch from '@/components/ComSearch/AdvancedSearch';
import ComVxeTable from '@/components/ComVxeTable';
import ComReportTable from '@/components/ComReportTable';
import DialogOptTable from '@/components/Dialog/dialogOptTable';
import ComFormDialog from '@/components/ComFormDialog';
import {
  GetHeader,
  GetSearchData,
  ExportData,
  SaveData,
  GetServerTime,
  GetSearch,
} from '@/api/Common';
export default {
  name: 'PlanAccomplished',
  components: {
    ComSearch,
    ComVxeTable,
    ComReportTable,
    Splitpanes,
    Pane,
    ComFormDialog,
    DialogOptTable,
  },
  data() {
    return {
      ////////////////// Search /////////////////
      selectionData: [[], [], [], []],
      title: this.$route.meta.title,
      includeFields: [[], [], [], []],
      formSearchs: [
        {
          datas: {},
          forms: [],
          required: [], //获取必填项
          formsAll: [],
        },
        {
          datas: {},
          forms: [],
          required: [], //获取必填项
          formsAll: [],
        },
        {
          datas: {
            // IsConfig: 0,
          },
          forms: [],
          required: [], //获取必填项
          formsAll: [],
        },
        {
          datas: {},
          forms: [],
          required: [], //获取必填项
          formsAll: [],
        },
      ],
      btnForm: [],
      tableData: [[], [], [], []],
      tableColumns: [[], [], [], []],
      tableLoading: [false, false, false, false],
      isClear: [false, false, false, false],
      tablePagination: [
        { pageIndex: 1, pageSize: 50, pageTotal: 0 },
        { pageIndex: 1, pageSize: 0, pageTotal: 0 },
        { pageIndex: 1, pageSize: 50, pageTotal: 0 },
        { pageIndex: 1, pageSize: 50, pageTotal: 0 },
      ],
      height: '707px',
      tagRemark: 0,
      isLoading: false,
      adminLoading: false,
      Status1: [
        { label: '待确认', value: '未开始' },
        { label: '已完成', value: '已完成' },
        { label: '全部', value: '' },
      ],
      Region: [6, 6, 6],
      labelStatus1: 0,
      sysID: [{ ID: 6723 }],
      isEdit: [false, false, false, false],
      userInfo: {},
      selectedIndex: '1',
      colDialogVisible2: false,
      colDialogVisible3: false,
      clickRow: null,
      linkTableData: [],
      hasSelect: [false, false, false, false],
      addNum: 1,
      DataSourceList: [{}, {}, {}, {}],
    };
  },
  watch: {},
  async created() {
    _this = this;
    this.adminLoading = true;
    this.userInfo = this.$store.getters.userInfo;
    await this.GetWorkshop();
    this.getTableHeader();
    // 获取所有按钮
    this.btnForm = this.$route.meta.btns;
    this.judgeBtn(this.btnForm);
  },
  mounted() {},
  methods: {
    //按钮权限
    judgeBtn(routeBtn) {
      if (routeBtn && routeBtn.length > 0)
        routeBtn.some((item, index) => {
          if (item.ButtonCode == 'save') {
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
    // 删除
    async dataDel(remarkTb, index, parms) {
      let newData = [];
      if (this.selectionData[remarkTb].length == 0) {
        this.$message.error('请单击需要操作的数据！');
        return;
      } else {
        newData = _.cloneDeep(
          this.selectionData[remarkTb].map((x) => {
            x['ElementDeleteFlag'] = 1;
            return x;
          }),
        );
        // }
      }
      console.log(newData, 'newData');
      this.$confirm('确定要删除的【' + newData.length + '】数据吗？')
        .then((_) => {
          _this.dataSave(remarkTb, index, null, newData);
        })
        .catch((_) => {});
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
        if (this.formSearchs[remarkTb].forms.length) {
          // 判断是否是页面显示的查询条件，是的字段才清空
          this.formSearchs[remarkTb].forms.forEach((element) => {
            if (element['prop'] === name) {
              this.formSearchs[remarkTb].datas[name] = null;
            }
          });
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
    //添加产品机台
    async confirmDialog(remarkTb) {
      let newData = [];
      if (remarkTb === 2) {
        [this.clickRow].forEach((item0) => {
          let addData = _.cloneDeep(
            this.selectionData[2].filter((item2) => {
              if (item2['SaleManIDs']) {
                let SaleManIDs = item2['SaleManIDs']?.split(',');
                return !SaleManIDs.some((OID) => OID == item0['Account']);
              } else {
                return true;
              }
            }),
          );
          addData.forEach((item) => {
            item['dicID'] = 10136;
            item['SaleMan'] = item0['Account'];
          });
          newData = newData.concat(addData);
        });
      }
      await this.dataSave(1, null, null, newData);
      this.colDialogVisible2 = false;
    },
    // 保存
    async dataSave(remarkTb, index, parms, newData) {
      this.adminLoading = true;
      const $table = this.$refs[`tableRef${remarkTb}`]?.[0].$refs.vxeTable;
      // 获取修改记录
      let changeRecords = [];
      if (newData) {
        changeRecords = newData;
      } else {
        if ($table) {
          const { insertRecords, updateRecords, removeRecords } =
            $table.getRecordset();
          changeRecords = insertRecords.concat(updateRecords, removeRecords);
        } else {
        }
      }
      if (changeRecords.length == 0) {
        this.$set(this, 'adminLoading', false);
        this.$message.error('当前数据没做修改，请先修改再保存！');
        return;
      }
      if (changeRecords.length > 0 && !newData) {
        if (this.formSearchs[remarkTb].required.length) {
          // 动态检验必填项
          changeRecords.map((item1, index1) => {
            this.formSearchs[remarkTb].required.map((item2, index2) => {
              let content = item1[item2['prop']];
              if (!content && (content !== 0) & (content !== false)) {
                this.$message.error(`${item2['label']}不能为空，请选择`);
                this.$set(this, 'adminLoading', false);
                throw new Error('报错了');
              }
            });
          });
        }
      }
      let res = await SaveData(changeRecords);
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
      let IDs = this.sysID;
      let res = await GetHeader(IDs);
      const { datas, forms, result, msg, formsAll } = res.data;
      if (result) {
        // 获取每个表头
        datas.some((m, i) => {
          m.forEach((n, index) => {
            // 进行验证
            this.verifyDta(n);
            if (n.children && n.children.length != 0) {
              n.children.forEach((x) => {
                this.verifyDta(x);
              });
            }
            //从列获取下拉数据源
            if (n.DataSourceID && n.ControlType === 'combobox') {
              this.DataSourceList[i] = {
                [n.DataSourceName]: n.items,
                ...this.DataSourceList[i],
              };
            }
            if (n.Required) {
              this.formSearchs[i].required.push(n);
            }
            if (index === 1) {
              this.tablePagination[i]['pageSize'] = n['pageSize'];
              this.hasSelect[i] = n['IsSelect'];
              this.Region[i] = n['Region'] ? n['Region'] : this.Region[i];
            }
          });
          this.$set(this.tableColumns, i, m);
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
          this.$set(this.formSearchs[z], 'formsAll', formsAll[z]);
        });
        this.changeStatus(this.Status1[this.labelStatus1], this.labelStatus1);
        // this.getTableData(this.formSearchs[0].datas, 0);
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
        this.$set(this.tableColumns, remarkTb, Columns[0]);
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
    // 选择数据
    selectFun(data, remarkTb, row) {
      this.selectionData[remarkTb] = data;
    },
    // 单击获取明细
    async handleRowClick(row, remarkTb) {
      // this.clickRow = row;
      // this.formSearchs[1].datas['SaleMan'] = row['Account'];
      // await this.dataSearch(this.selectedIndex);
    },
    handleClick(tab, event) {
      console.log(tab, event);
      this.selectedIndex = tab.name;
      this.dataSearch(this.selectedIndex);
    },
    addRow(remarkTb) {
      const $table = this.$refs[`tableRef${remarkTb}`]?.[0].$refs.vxeTable;
      if (!this.addNum) {
        this.$message.error('请输入需要添加的行数!');
        return;
      }
      // 下拉数据是需要获取数据源
      for (let x = 0; x < this.addNum; x++) {
        let obj = {
          dicID: this.sysID[remarkTb]['ID'],
          RowNumber: _.uniqueId(),
        };
        this.tableColumns[remarkTb].map((item) => {
          obj[item.prop] = null;
          obj['update'] = true;
          if (item.prop === 'Status') {
            obj[item.prop] = 1;
          }
          for (let key in this.DataSourceList[remarkTb]) {
            if (item.DataSourceName === key) {
              obj[key] = this.DataSourceList[remarkTb][key];
            }
          }
        });
        $table.insert(obj);
      }
    },
    // 行内样式
    cellStyle0({ row, column }) {
      let style = {}; // 创建一个空的样式对象
      const key = column.property;

      if (
        column.property == 'PlanQtyP' &&
        row['PlanQtyP'] &&
        parseFloat(row['PlanQtyP'].replace('%', '')) >= 100
      ) {
        style.backgroundColor = 'rgb(12, 241, 12)';
      }
      if (
        column.property == 'PlanQtyP' &&
        row['PlanQtyP'] &&
        parseFloat(row['PlanQtyP'].replace('%', '')) < 100
      ) {
        style.backgroundColor = 'rgb(255, 255, 62)';
      }
      if (!row['PlanDay']) {
        style.color = '#151515';
        style.backgroundColor = '#2dd8ff';
      }

      if (
        Object.prototype.toString.call(row['FColors']) === '[object Object]' &&
        key in row['FColors']
      ) {
        style.color = row['FColors'][key]; // 设置背景颜色
      }
      if (
        Object.prototype.toString.call(row['BColors']) === '[object Object]' &&
        key in row['BColors']
      ) {
        style.backgroundColor = row['BColors'][key]; // 设置背景颜色
      }
      return style; // 返回样式对象
    },
    //获取车间信息
    async GetWorkshop() {
      let res1 = await GetSearch(
        {
          dicID: 36,
          OrganizeTypeID: 5,
          Status: 1,
          rows: 0,
          // fields: 'Account,Name',
          // groupby: 'Account,Name',
          // sort: 'Account',
        },
        '/APSAPI/APSData',
      );
      const { result: result1, data: data1, msg: msg1 } = res1.data;
      if (result1) {
        this.Status1 = data1
          .map((item) => {
            return {
              label: item.OrganizeName,
              value: item.OrganizeID,
            };
          })
          .concat({
            label: '全部',
            value: '',
          });
        this.labelStatus1 = this.Status1.findIndex(
          (item) => item['value'] === this.userInfo.Account,
        );
        if (this.labelStatus1 === -1) {
          // 如果没有找到匹配项，将labelStatus1设置为最后一个选项的索引
          this.labelStatus1 = this.Status1.length - 1;
        }
      } else {
        this.$message({
          message: msg1,
          type: 'error',
          dangerouslyUseHTMLString: true,
        });
      }
    },
    changeStatus(item, index) {
      console.log(this.Status1, '1');
      this.labelStatus1 = index;
      this.formSearchs[0].datas['WorkShopIDs'] = item.value;
      this.dataSearch(0);
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-tabs__item {
  padding: 5px;
  /* 设置为0或调整合适的数值 */
}
::v-deep .el-dialog__header {
  background-color: #409eff !important;
}
::v-deep .el-dialog__title {
  color: #fff !important;
}
::v-deep .el-dialog__close {
  color: #fff !important;
}
</style>
