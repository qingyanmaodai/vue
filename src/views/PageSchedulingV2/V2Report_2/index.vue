<!--欠料追踪表-->
<template>
  <div class="APSContainer" v-loading="adminLoading">
    <div class="admin_head" ref="headRef">
      <ComSearch
        ref="searchRef"
        :searchData="formSearchs[0].datas"
        :searchForm="formSearchs[0].forms"
        :remark="0"
        :isLoading="isLoading"
        :btnForm="btnForm[0]"
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
              <el-button type="primary" size="mini" @click="setClearTag(0)"
                >标记退补</el-button
              >
              <el-button type="danger" size="mini" @click="setClearTag(1)"
                >清除退补</el-button
              >
              <el-divider direction="vertical"></el-divider>
              <div v-for="(item, y) in Status3" :key="y">
                <span
                  @click="changeStatus3(item, y)"
                  :class="labelStatus3 == y ? 'statusActive cursor' : 'cursor'"
                  >{{ item.label }}</span
                >
                <el-divider direction="vertical"></el-divider>
              </div>
            </el-col>
          </el-row>
        </div>
        <ComVxeTable
          :rowKey="'RowNumber'"
          :height="height"
          :IsIndex="false"
          :tableData="tableData[0]"
          :tableHeader="tableColumns[0]"
          :tableLoading="tableLoading[0]"
          :remark="0"
          :sysID="sysID[0].ID"
          :cellStyle="cellStyle"
          :isClear="isClear[0]"
          :hasSelect="true"
          :showFooter="true"
          :showPagination="false"
          :includeFields="includeFields"
          :pagination="tablePagination[0]"
          @pageChange="pageChange"
          @pageSize="pageSize"
          @sortChange="sortChange"
          @selectfun="selectFun"
        />
      </div>
    </div>

    <el-dialog title="维护超领" :visible.sync="editDialog" width="98%">
      <el-tabs tab-position="left" v-model="activeTab" style="height: auto">
        <el-tab-pane label="汇总" name="first">
          <div class="admin_head" ref="headRef">
            <ComSearch
              ref="searchRef"
              :searchData="formSearchs[1].datas"
              :searchForm="formSearchs[1].forms"
              :remark="1"
              :isLoading="isLoading"
              :btnForm="btnForm[1]"
              @btnClick="btnClick"
            />
          </div>
          <div class="admin_content">
            <div class="ant-table-title" ref="headRef_2">
              <el-row>
                <el-col :span="4"
                  ><span class="title">备料追踪列表</span></el-col
                >
                <el-col :span="20" class="flex_flex_end">
                  <div
                    :class="
                      labelStatus1 == y ? 'statusActive cursor' : 'cursor'
                    "
                    v-for="(item, y) in Status1"
                    :key="y"
                  >
                    <span
                      @click="changeStatus(item, y)"
                      :class="
                        labelStatus1 == y ? 'statusActive cursor' : 'cursor'
                      "
                      >{{ item.label }}</span
                    >
                    <el-divider direction="vertical"></el-divider>
                  </div>
                </el-col>
              </el-row>
            </div>
            <ComVxeTable
              :rowKey="'RowNumber'"
              :height="'460px'"
              :tableData="tableData[1]"
              :tableHeader="tableColumns[1]"
              :tableLoading="tableLoading[1]"
              :remark="1"
              :cellStyle="cellStyle0"
              :sysID="sysID[0].ID"
              :footerLabel="footerLabel[1]"
              :isClear="isClear[1]"
              :pagination="tablePagination[1]"
              @pageChange="pageChange"
              @handleRowClick="handleRowClick"
              @pageSize="pageSize"
              @sortChange="sortChange"
            />
          </div>
        </el-tab-pane>
        <el-tab-pane label="明细" name="second">
          <div class="admin_content">
            <div class="ant-table-title">
              <el-row>
                <!-- <el-col :span="1"><span class="title">物料明细</span></el-col> -->
                <el-col :span="24" class="flex_flex_end">
                  <span>料号：</span>
                  <el-input
                    size="small"
                    v-model="formSearchs[2].datas['Code']"
                    style="width: 140px"
                    @keyup.enter.native="dataSearch(2)"
                  ></el-input>
                  <el-divider direction="vertical"></el-divider>
                  <span>名称：</span>
                  <el-input
                    size="small"
                    style="width: 140px"
                    @keyup.enter.native="dataSearch(2)"
                    v-model="formSearchs[2].datas['MaterialName']"
                  ></el-input>

                  <el-divider direction="vertical"></el-divider>

                  <span>规格：</span>
                  <el-input
                    size="small"
                    style="width: 140px"
                    v-model="formSearchs[2].datas['Spec']"
                    @keyup.enter.native="dataSearch(2)"
                  ></el-input>

                  <el-divider direction="vertical"></el-divider>
                  <el-select
                    clearable
                    filterable
                    size="small"
                    placeholder="选择工单"
                    v-model="OrderNo"
                    @change="selectOrderNo"
                  >
                    <el-option
                      v-for="(item, i) in OrderNos"
                      :key="i"
                      :label="item.OrderNo"
                      :value="item.OrderNo"
                    ></el-option>
                  </el-select>
                  <el-divider direction="vertical"></el-divider>
                  <el-select
                    clearable
                    filterable
                    size="small"
                    placeholder="选择仓库"
                    style="width: 100px"
                    v-model="warehouseValue"
                    @change="selectWarehouse"
                  >
                    <el-option
                      v-for="(item, i) in warehouses"
                      :key="i"
                      :label="item.WarehouseName"
                      :value="item.WarehouseID"
                    ></el-option>
                  </el-select>
                  <el-divider direction="vertical"></el-divider>
                  <el-button type="danger" size="small" @click="clearShort"
                    >清空超领</el-button
                  >
                  <el-divider direction="vertical"></el-divider>
                  <el-button type="success" size="small" @click="submitChildren"
                    >提交</el-button
                  >
                  <el-divider direction="vertical"></el-divider>
                  <el-button type="warning" size="small" @click="dataExport(1)"
                    >导出</el-button
                  >
                  <el-divider direction="vertical"></el-divider>
                  <div v-for="(item, y) in Status2" :key="y">
                    <span
                      @click="changeStatus2(item, y)"
                      :class="
                        labelStatus2 == y + 1 ? 'statusActive cursor' : 'cursor'
                      "
                      >{{ item.label }}</span
                    >
                    <el-divider direction="vertical"></el-divider>
                  </div>
                </el-col>
              </el-row>
            </div>
            <ComVxeTable
              :rowKey="'RowNumber'"
              :height="'460px'"
              :tableData="tableData[2]"
              :tableHeader="tableColumns[2]"
              :tableLoading="tableLoading[2]"
              :remark="2"
              :hasSelect="true"
              :cellStyle="cellStyle"
              :sysID="sysID[2].ID"
              :checCheckboxkMethod="checCheckboxkMethod"
              :isClear="isClear[2]"
              :showPagination="false"
              @pageChange="pageChange"
              @pageSize="pageSize"
              :pagination="tablePagination[2]"
              @sortChange="sortChange"
              @toPage="usingSearch"
              @selectfun="selectFun"
            />
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

    <el-dialog title="料品可用量查询" :visible.sync="dialogShow" width="50%">
      <div class="APSContainer" style="background-color: #f0f2f5">
        <div class="admin_content">
          库存列表
          <ComVxeTable
            :rowKey="'RowNumber'"
            :height="height3"
            :tableData="tableData[3]"
            :tableHeader="tableColumns[3]"
            :tableLoading="tableLoading[3]"
            :remark="3"
            :showFooter="true"
            :includeFields="includeFields[0]"
            :sysID="sysID[3].ID"
            :isClear="isClear[3]"
            :pagination="tablePagination[3]"
            @pageChange="pageChange"
            @pageSize="pageSize"
            @sortChange="sortChange"
          />
        </div>
        <div class="admin_content">
          采购单
          <ComVxeTable
            :rowKey="'RowNumber'"
            :height="height3"
            :tableData="tableData[4]"
            :tableHeader="tableColumns[4]"
            :tableLoading="tableLoading[4]"
            :remark="4"
            :sysID="sysID[4].ID"
            :isClear="isClear[4]"
            :showFooter="true"
            :includeFields="includeFields[1]"
            :pagination="tablePagination[4]"
            @pageChange="pageChange"
            @pageSize="pageSize"
            @sortChange="sortChange"
          />
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
var _this;
import ComSearch from '@/components/ComSearch';
import ComVxeTable from '@/components/ComVxeTable';
import {
  GetHeader,
  GetSearchData,
  ExportData,
  SaveData,
  GetServerTime,
} from '@/api/Common';
export default {
  name: 'V2Report_2',
  components: {
    ComSearch,
    ComVxeTable,
  },
  data() {
    return {
      activeTab: 'first',
      dialogShow: false,
      height3: '180px',
      warehouses: [],
      footerLabel: [''],
      active: 0,
      editDialog: false,
      includeFields: [['ProducedQty', 'ConfirmQty'], [], []],
      warehouseValue: '',
      OrderNo: '',
      OrderNos: [],
      Status1: [
        { label: '全部订单', value: '' },
        { label: '未开始', value: '未开始' },
        { label: '进行中', value: '进行中' },
        { label: '已完成', value: '已完成' },
      ],
      Status2: [
        { label: '已点检', value: [1, 2] },
        { label: '异常', value: 2 },
      ],
      labelStatus1: 0,
      labelStatus2: 0,
      ////////////////// Search /////////////////
      includeFields: ['DemandQty', 'RealOweQty', 'ShortQty', 'UnIssuedQty'],
      title: this.$route.meta.title,
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
        {
          datas: {},
          forms: [],
        },
      ],
      btnForm: [[], []],
      tableData: [[], [], [], [], []],
      tableColumns: [[], [], [], [], []],
      tableLoading: [false, false, false, false, false],
      isClear: [false, false, false, false, false],
      tablePagination: [
        { pageIndex: 1, pageSize: 0, pageTotal: 0 },
        { pageIndex: 1, pageSize: 200, pageTotal: 0 },
        { pageIndex: 1, pageSize: 0, pageTotal: 0 },
        { pageIndex: 1, pageSize: 0, pageTotal: 0 },
        { pageIndex: 1, pageSize: 0, pageTotal: 0 },
      ],
      height: '707px',
      showPagination: true,
      tagRemark: 0,
      isLoading: false,
      adminLoading: false,
      parseForm: {},
      parseSearch: false,
      parmsBtn: [
        {
          ButtonCode: 'save',
          BtnName: '维护超领',
          isLoading: false,
          Methods: 'defendQty',
          Type: 'primary',
          Icon: '',
          Size: 'small',
          Params: '0',
        },
      ],
      sysID: [
        { ID: 7849 },
        { ID: 7791 },
        { ID: 7792 },
        { ID: 76 },
        { ID: 6751 },
      ],
      selectionData: [[], [], [], [], []],
      Status3: [
        { label: '全部', value: '' },
        { label: '复期超时', value: 1 },
        { label: '3天内即将到期', value: 3 },
        { label: '复期未复', value: 0 },
        { label: '复期不满足需求', value: 2 },
      ],
      labelStatus3: 0,
      selectionData: [[]],
    };
  },
  watch: {},
  created() {
    _this = this;
    this.judgeBtn();
    this.getTableHeader();
    this.getWarehosueData();
  },
  mounted() {
    setTimeout(() => {
      this.setHeight();
    }, 450);
  },
  methods: {
    async getWarehosueData() {
      let form = {};
      form['dicID'] = 80;
      form['rows'] = 0;
      let res = await GetSearchData(form);
      const { result, data, count, msg } = res.data;
      if (result) {
        this.warehouses = data;
      } else {
        this.$message({
          message: msg,
          type: 'error',
          dangerouslyUseHTMLString: true,
        });
      }
    },
    // 判断按钮权限
    judgeBtn() {
      let routeBtn = this.$route.meta.btns;
      let newBtn = [];
      let permission = false;
      if (routeBtn.length != 0) {
        routeBtn.forEach((x) => {
          let newData = this.parmsBtn.filter((y) => {
            return x.ButtonCode == y.ButtonCode;
          });
          if (newData.length != 0) {
            newBtn = newBtn.concat(newData);
          }
        });
      }
      this.$set(this.btnForm, 0, newBtn);
    },
    // 行内样式
    cellStyle0({ row, column }) {
      if (column.property == 'IsCompleteInspect') {
        if (row.IsCompleteInspect == '未开始') {
          return {
            backgroundColor: '#ff7b7b',
          };
        } else if (row.IsCompleteInspect == '进行中') {
          return {
            backgroundColor: '#fdfd8f',
          };
        } else if (row.IsCompleteInspect == '已完成') {
          return {
            backgroundColor: '#9fff9f',
          };
        }
      }
    },
    cellStyle({ row, column }) {
      if (column.property == 'RealOweQty') {
        return {
          background: '#f98686',
        };
      }

      if (column.property == 'Extend2') {
        if (row['Extend2'] == '是') {
          return {
            background: '#f98686',
          };
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
    dataSave(remarkTb) {},
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
        });
        this.formSearchs[2].datas['InspectStatus'] = [1, 2];
        this.getTableData(this.formSearchs[0].datas, 0);
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
    // 维护超领
    defendQty() {
      this.dataSearch(1);
      this.editDialog = true;
    },
    // 可用量查询
    usingSearch(row, prop) {
      this.formSearchs[3].datas['MaterialID'] = row.MaterialID;
      this.formSearchs[4].datas['MaterialID'] = row.MaterialID;
      this.dataSearch(3);
      this.dataSearch(4);
      this.dialogShow = true;
    },
    // 单击获取明细
    handleRowClick(row, remarkTb) {
      this.formSearchs[2].datas['SalesOrderDetailID'] = row.SalesOrderDetailID;
      this.OrderNos = [];
      if (row.MOS) {
        let OrderNos = row.MOS.split(',');
        OrderNos.forEach((x) => {
          this.OrderNos.push({ OrderNo: x });
        });
      }
      this.dataSearch(2);
      this.activeTab = 'second';
    },
    // 控制选框是否能手动勾选
    checCheckboxkMethod({ row }) {
      if (
        (row.ShortQty == 0 && row.InspectStatus == 2) ||
        row.InspectStatus == 1
      ) {
        this.$set(row, 'Disabled', true);
        return false;
      } else {
        return true;
      }
    },
    // 选择仓库
    selectWarehouse(val) {
      this.formSearchs[2].datas['WarehouseID'] = val;
      this.dataSearch(2);
    },
    // 选择工单
    selectOrderNo(val) {
      this.formSearchs[2].datas['OrderNo'] = val;
      this.dataSearch(2);
    },
    // 改变状态
    changeStatus(item, index) {
      this.labelStatus1 = index;
      this.formSearchs[1].datas['IsCompleteInspect'] = item.value;
      this.$set(this.tableData, 2, []);
      this.dataSearch(1);
    },
    // 改变状态
    changeStatus3(item, index) {
      this.labelStatus3 = index;
      this.formSearchs[0].datas['OweTag'] = item.value;
      this.dataSearch(0);
    },
    // 改变状态
    changeStatus2(item, index) {
      if (!this.formSearchs[2].datas['SalesOrderDetailID']) {
        this.$message.error('请先在汇总单击选择单号！');
        return;
      }
      this.labelStatus2 = index;
      this.formSearchs[2].datas.PrepareType = '';
      this.formSearchs[2].datas.InspectStatus = '';
      this.formSearchs[2].datas.UnIssuedQty = '';
      if (index == 0) {
        this.formSearchs[2].datas.InspectStatus = item.value;
      } else if (index == 1) {
        this.formSearchs[2].datas.InspectStatus = 2;
      }
      this.$set(this.tableData, 2, []);
      this.dataSearch(2);
    },
    // 清空超领
    clearShort() {
      if (this.selectionData[2].length == 0) {
        this.$message.error('请勾选需要清空的数据！');
      } else {
        this.$confirm('确定清空选中的吗，会直接保存哟？')
          .then(() => {
            let newData = [];
            _this.selectionData[2].forEach((x) => {
              x.ShortQty = null;
              if (parseInt(x.UnIssuedQty) == 0) {
                x.InspectStatus = 1;
                if (parseInt(x.OweQty) == 0) {
                  x.PrepareType = '齐套';
                } else {
                  x.PrepareType = '欠料';
                }
              } else {
                x.InspectStatus = 2;
                x.PrepareType = '异常';
              }
              newData.push(x);
            });
            _this.generalSaveData(newData, 2);
          })
          .catch(() => {});
      }
    },
    // 提交点检
    async submitChildren() {
      // 获取有超领的数据
      let res = await GetServerTime();
      const { result, data, msg } = res.data;
      if (result) {
        this.realySubmitChildren(data);
      } else {
      }
    },
    // 只能勾选清空超领
    realySubmitChildren(InspectDate) {
      let submitData = [];
      if (this.tableData[2].length != 0) {
        this.tableData[2].forEach((x) => {
          if (parseInt(x.ShortQty) > 0) {
            x.PrepareType = '超领';
            x.InspectStatus = 2;
            submitData.push(x);
          }
        });
      }
      this.generalSaveData(submitData, 2);
    },
    // 通用保存数据
    async generalSaveData(data, remarkTb) {
      this.adminLoading = true;
      let res = await SaveData(data);
      const { result, msg } = res.data;
      if (result) {
        _this.dataSearch(remarkTb);
        _this.adminLoading = false;
        this.$message({
          message: msg,
          type: 'success',
          dangerouslyUseHTMLString: true,
        });
      } else {
        _this.adminLoading = false;
        this.$message({
          message: msg,
          type: 'error',
          dangerouslyUseHTMLString: true,
        });
      }
    },
    // 标记与清除退补
    setClearTag(val) {
      if (this.selectionData[0].length == 0) {
        this.$message.error('请选择需要操作的数据！');
      } else {
        let submitData = [];
        this.adminLoading = true;
        if (val == 0) {
          // 添加退补备注
          this.selectionData[0].forEach((a) => {
            if (!a.Extend2) {
              let MaterialFormID = a.MaterialFormID.split(',');
              MaterialFormID.forEach((b, i) => {
                let obj = {};
                obj['MaterialFormID'] = b;
                obj['Extend2'] = '是';
                obj['dicID'] = a.dicID;
                submitData.push(obj);
              });
            }
          });
        } else {
          // 清除退补备注
          this.selectionData[0].forEach((a) => {
            if (a.Extend2) {
              let MaterialFormID = a.MaterialFormID.split(',');
              MaterialFormID.forEach((b, i) => {
                let obj = {};
                obj['MaterialFormID'] = b;
                obj['Extend2'] = null;
                obj['dicID'] = a.dicID;
                submitData.push(obj);
              });
            }
          });
        }
        this.generalSaveData(submitData, 0);
      }
    },
    // 选择数据
    selectFun(data, remarkTb, row) {
      this.$set(this.selectionData, remarkTb, data);
    },
  },
};
</script>
