<!--物料点检-->
<template>
  <div
    class="APSContainer flex_column content_height bgWhite"
    v-loading="adminLoading"
  >
    <div class="flex_column fullScreen">
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
        />
      </div>
      <div class="ant-table-title pd-0-6" ref="headRef_2">
        <el-row>
          <el-col :span="4"
            ><span class="title">{{ title }}</span></el-col
          >
          <el-col :span="20" class="flex_flex_end">
            <el-radio-group v-model="radioValue0" @change="radioChange">
              <el-radio
                v-for="(item, index) in parmsBtn2"
                :key="index"
                :label="item.value"
                :value="item.value"
                >{{ item.label }}</el-radio
              >
            </el-radio-group>
            <!-- <div
                  
                  v-for="(item, y) in Status1"
                :key="y"
                >
                  <span @click="changeStatus(item, y)" :class="labelStatus1 == y ? 'statusActive cursor' : 'cursor'">{{ item.label }}</span>
                  <el-divider direction="vertical"></el-divider>
                </div> -->
          </el-col>
        </el-row>
      </div>
      <div v-for="item in [0]" :key="item" class="admin_content flex_grow">
        <ComVxeTable
          ref="tableRef"
          :rowKey="'RowNumber'"
          height="100%"
          :isToolbar="false"
          :isEdit="isEdit[0]"
          :tableData="tableData[0]"
          :tableHeader="tableColumns[0]"
          :tableLoading="tableLoading[0]"
          :remark="0"
          :hasSelect="hasSelect[0]"
          :cellStyle="cellStyle"
          :sysID="sysID[0]['ID']"
          :isClear="isClear[0]"
          :pagination="tablePagination[0]"
          @pageChange="pageChange"
          @handleRowClick="handleRowClick"
          @handleRowdbClick="handleRowdbClick"
          @pageSize="pageSize"
          @sortChange="sortChange"
          @toPage="toPage"
          :keepSource="true"
          :scrollEnable="false"
          :footerContent="true"
        />
      </div>
    </div>
    <!-- 弹框-->
    <el-dialog
      :title="'查看计划'"
      :visible.sync="colDialogVisible2"
      width="80%"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      :modal-append-to-body="false"
      ><div
        class="flex_grow"
        style="overflow-x: hidden; display: flex; flex-direction: column"
      >
        <div class="ant-table-title pd-0-6" ref="headRef_2">
          <el-row>
            <el-col :span="12">
              <el-radio-group
                v-model="radioValue1"
                size="small"
                @change="handleRadioChange"
              >
                <el-radio-button :label="1">生产排程</el-radio-button>
                <el-radio-button :label="2">排班设置</el-radio-button>
              </el-radio-group></el-col
            >
            <el-col :span="12" class="flex_flex_end"> </el-col>
          </el-row>
        </div>
        <div
          v-for="i in [1, 3, 4]"
          :key="i + 'head'"
          class="admin_head_2 w-full"
          ref="headRef"
          v-show="radioValue1 === 1 && Number(selectedIndex) === i"
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
        <div
          v-for="i in [2]"
          :key="i + 'head'"
          class="admin_head_2 w-full"
          ref="headRef"
          v-show="radioValue1 === 2"
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

        <div class="ant-table-title">
          <el-row>
            <el-col :span="12" class="flex">
              <el-tabs
                v-model="selectedIndex"
                @tab-click="handleClick"
                :stretch="true"
                v-show="radioValue1 === 1"
              >
                <el-tab-pane label="生产任务清单" name="1"></el-tab-pane>
                <el-tab-pane label="滚动周计划" name="3"></el-tab-pane>
                <el-tab-pane label="滚动日计划" name="4"></el-tab-pane>
              </el-tabs>
            </el-col>
            <el-col :span="12" class="flex_flex_end">
              <div
                v-for="i in [1]"
                :key="'Edit' + i"
                style="height: 100%"
                v-show="radioValue1 === 1"
              >
                <ComBatchEdit
                  :OrderNos="OrderNos[i]"
                  @changeProp="changeProp"
                  :OrderNo="''"
                  :remark="i"
                />
              </div>
              <div
                v-for="i in [2]"
                :key="'Edit' + i"
                style="height: 100%"
                v-show="radioValue1 === 2"
              >
                <ComBatchEdit
                  :OrderNos="OrderNos[i]"
                  @changeProp="changeProp"
                  :OrderNo="''"
                  :remark="i"
                />
              </div>
            </el-col>
          </el-row>
        </div>
        <div
          v-for="item in [1, 3, 4]"
          :key="item"
          class="flex_grow w-full"
          v-show="radioValue1 === 1 && Number(selectedIndex) === item"
        >
          <ComVxeTable
            :ref="`tableRef${item}`"
            :rowKey="'RowNumber'"
            height="100%"
            :tableData="tableData[item]"
            :tableHeader="tableColumns[item]"
            :tableLoading="tableLoading[item]"
            :isToolbar="false"
            :remark="item"
            :sysID="sysID[item]['ID']"
            :hasSelect="hasSelect[item]"
            :isEdit="isEdit[item]"
            :isClear="isClear[item]"
            :keepSource="true"
            :pagination="tablePagination[item]"
            @pageChange="pageChange"
            @pageSize="pageSize"
            @sortChange="sortChange"
            @selectfun="selectFun"
            @handleRowClick="handleRowClick"
            :cellStyle="cellStyle"
          />
        </div>
        <div
          v-for="item in [2]"
          :key="item"
          class="flex_grow w-full"
          v-show="radioValue1 === 2"
        >
          <ComVxeTable
            :ref="`tableRef${item}`"
            :rowKey="'RowNumber'"
            height="100%"
            :tableData="tableData[item]"
            :tableHeader="tableColumns[item]"
            :tableLoading="tableLoading[item]"
            :isToolbar="false"
            :remark="item"
            :sysID="sysID[item]['ID']"
            :hasSelect="hasSelect[item]"
            :isEdit="isEdit[item]"
            :isClear="isClear[item]"
            :keepSource="true"
            :pagination="tablePagination[item]"
            @pageChange="pageChange"
            @pageSize="pageSize"
            @sortChange="sortChange"
            @selectfun="selectFun"
            @handleRowClick="handleRowClick"
            :cellStyle="cellStyle"
          />
        </div>
      </div>
    </el-dialog>
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
import DialogTable from '@/components/Dialog/dialogTable';
import {
  GetHeader,
  GetSearchData,
  ExportData,
  SaveData,
  GetServerTime,
} from '@/api/Common';
export default {
  name: 'TBResourceLoadAnalysis',
  components: {
    ComSearch,
    ComVxeTable,
    ComReportTable,
    Splitpanes,
    Pane,
    DialogTable,
    ComBatchEdit,
  },
  data() {
    return {
      ////////////////// Search /////////////////
      selectionData: [[], [], [], [], []],
      title: this.$route.meta.title,
      includeFields: [[], [], [], [], []],
      hasSelect: [false, false, false, false, false],
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
        {
          datas: {},
          forms: [],
        },
      ],
      btnForm: [],
      OrderNo: '',
      OrderNoValue: '',
      OrderNos: [[], [], [], [], []],
      tableData: [[], [], [], [], []],
      tableColumns: [[], [], [], [], []],
      tableLoading: [false, false, false, false, false],
      isClear: [false, false, false, false, false],
      tablePagination: [
        { pageIndex: 1, pageSize: 50, pageTotal: 0 },
        { pageIndex: 1, pageSize: 0, pageTotal: 0 },
        { pageIndex: 1, pageSize: 50, pageTotal: 0 },
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
      labelStatus1: 0,
      sysID: [
        { ID: 14199 },
        { ID: 7833 },
        { ID: 97 },
        { ID: 7915 },
        { ID: 7910 },
      ],
      isEdit: [false, false, false, false, false],
      userInfo: {},
      selectedIndex: '4',
      Region: [6, 6, 6, 6, 6],
      colDialogVisible2: false,
      colDialogVisible4: false,
      clickRow: null,
      radioValue0: 1,
      radioValue1: 1,
      parmsBtn2: [
        { label: '显示工时', value: 1 },
        { label: '显示负荷', value: 2 },
        { label: '显示数量', value: 3 },
      ],
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
    //添加产品机台
    confirmDialog(data) {
      if (Number(this.selectedIndex) === 1) {
        console.log(this.formSearchs[1]['MachineMouldID'], '1');
        data.map((item) => {
          item['MachineMouldID'] =
            this.formSearchs[1]['datas']['MachineMouldID'];
          item['dicID'] = 110;
        });
        this.dataSave(1, null, null, data);
      } else if (Number(this.selectedIndex) === 2) {
        data.map((item) => {
          item['MachineMouldID'] =
            this.formSearchs[2]['datas']['MachineMouldID'];
          item['dicID'] = 112;
        });
        this.dataSave(2, null, null, data);
      }
      this.colDialogVisible3 = false;
      this.colDialogVisible4 = false;
    },
    // 保存
    async dataSave(remarkTb, index, parms, newData) {
      this.adminLoading = true;
      // const sheet = this.spread[remarkTb]?.getActiveSheet();

      const $table = this.$refs[`tableRef${remarkTb}`]?.[0].$refs.vxeTable;
      // if (sheet && sheet.isEditing()) {
      //   sheet.endEdit();
      // }
      // 获取修改记录
      let changeRecords = [];
      if (newData) {
        changeRecords = newData;
      } else {
        if ($table) {
          changeRecords = $table.getUpdateRecords();
        } else {
          let DirtyRows = sheet.getDirtyRows().map((row) => row.item); //获取修改过的数据
          let InsertRows = sheet.getInsertRows().map((row) => row.item); //获取插入过的数据
          let DeletedRows = sheet.getDeletedRows().map((row) => row.item);
          DeletedRows.forEach((item) => {
            item['ElementDeleteFlag'] = 1;
          }); //获取被删除的数据
          changeRecords = [...DirtyRows, ...InsertRows, ...DeletedRows];
        }
      }

      if (changeRecords.length == 0) {
        this.$set(this, 'adminLoading', false);
        this.$message.error('当前数据没做修改，请先修改再保存！');
        return;
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
      const { datas, forms, result, msg } = res.data;
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

        // this.formSearchs[0].datas["IsCompleteInspect"] = 0;
        this.formSearchs[0].datas['viewType'] = 1;
        this.getTableData(this.formSearchs[0].datas, 0);
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
    // 单击获取明细
    handleRowClick(row, remarkTb) {
      this.clickRow = row;
      // this.dataSearch(this.selectedIndex);
    },
    //双击事件
    async handleRowdbClick(row, remarkTb) {
      //获取原因数据源
      this.colDialogVisible2 = true;
    },
    AddEvent(index) {
      if (!this.clickRow) {
        this.$message.error('请点击需要绑定的数据！');
        return;
      }
      if (index === 1) {
        this.colDialogVisible3 = true;
        // this.formSearchs[3]["MachineTypeID"] = "M20230614001";
      }
      if (index === 2) {
        this.colDialogVisible4 = true;
      }
    },
    //获取当前选中行的值
    selectFun(data, remarkTb, row) {
      this.$set(this.selectionData, remarkTb, data);
    },
    radioChange(val) {
      this.formSearchs[0].datas['viewType'] = val;
      this.dataSearch(0);
    },
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
    handleClick(tab, event) {
      console.log(tab, event);
      this.selectedIndex = tab.name;
      this.dataSearch(this.selectedIndex);
    },
    // 打开工单分析
    async toPage(row, prop) {
      this.radioValue1 = 1;
      this.selectedIndex = '4';
      if (prop == 'OrganizeName') {
        const organizeName = row.OrganizeName;
        for (let i = 1; i <= 4; i++) {
          this.dataReset(i);
          if (i !== 2) {
            this.formSearchs[i].datas['DefaultLineName'] = organizeName;
          }
        }
        this.colDialogVisible2 = true;
        await this.dataSearch(4);
      }
    },
    handleRadioChange(val) {
      this.dataSearch(val);
    },
    // 行内样式
    cellStyle({ row, column }) {
      let style = {}; // 创建一个空的样式对象
      const key = column.property;
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
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-tabs__item {
  padding: 5px;
  /* 设置为0或调整合适的数值 */
}
::v-deep .el-dialog {
  margin-top: 10vh !important;
  height: 80vh !important;
  display: flex;
  flex-direction: column;
}
::v-deep .el-dialog__header {
  background-color: #409eff !important;
}
::v-deep .el-dialog__body {
  flex-grow: 1;
  overflow: hidden;
  display: flex;
}
::v-deep .el-dialog__close {
  color: #fff !important;
}
</style>
