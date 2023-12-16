<!--装配总排期-->
<template>
  <div class="APSContainer" v-loading="adminLoading">
    <div class="admin_head" ref="headRef">
      <div ref="searchRef">
        <ComSearch
          v-for="(item3, o) in 6"
          :key="o"
          v-show="labelStatus1 == o"
          :searchData="formSearchs[o].datas"
          :searchForm="formSearchs[o].forms"
          :remark="o"
          :isLoading="isLoading"
          :btnForm="btnForm"
          :signName="labelStatus1"
          @btnClick="btnClick"
        />
      </div>
    </div>
    <div>
      <div class="admin_content">
        <div class="ant-table-title">
          <el-row>
            <el-col :span="2"
              ><span class="title">{{ title }}</span></el-col
            >
            <el-col :span="22" class="flex_flex_end">
              <el-button
                v-for="(item1, i1) in btnData"
                :key="'key' + i1"
                :type="item1.Type"
                v-show="item1.signName == labelStatus1"
                size="mini"
                @click="btnClick(item1.Methods, item1.Params, i1, 0)"
              >
                {{ item1.BtnName }}
              </el-button>
              <el-divider direction="vertical"></el-divider>
              <div v-for="(item2, y) in Status1" :key="y">
                <span @click="changeStatus(item2, y, 1)">{{
                  item2.label
                }}</span>
                <el-divider direction="vertical"></el-divider>
              </div>
            </el-col>
          </el-row>
        </div>
        <div v-for="(item3, o) in 6" :key="o" v-show="labelStatus1 == o">
          <ComVxeTable
            :rowKey="'RowNumber'"
            :height="height"
            :tableData="tableData[o]"
            :tableHeader="tableColumns[o]"
            :tableLoading="tableLoading[o]"
            :remark="o"
            :ref="'vxeTable' + `${o}`"
            :sysID="IDs[o].ID"
            :hasSelect="true"
            :isEdit="true"
            :isClear="isClear[o]"
            :pagination="tablePagination[o]"
            @delsalerow="delsalerow"
            @pageChange="pageChange"
            @pageSize="pageSize"
            @sortChange="sortChange"
            @selectfun="selectFun"
            @toPage="toPage"
            @computedqty="computedqty"
            @computedqty2="computedqty2"
          />
        </div>
      </div>
    </div>

    <el-dialog
      title="调单"
      :visible.sync="changeDialog"
      width="60%"
      :close-on-click-modal="false"
    >
      <div>
        <div class="flex margin_bottom_10">
          <span class="flex_shrink dialog_label">1.请填写目标行：</span>
          <el-input
            type="number"
            v-model="SN"
            size="small"
            style="width: 120px; margin: 0 20px 0 10px"
          ></el-input>
          <el-button size="small" type="primary" plain @click="SearchSN"
            >查 找</el-button
          >
        </div>
        <div class="margin_bottom_10">
          <vxe-table
            ref="vxeTable_1"
            border
            show-overflow
            highlight-current-row
            highlight-hover-row
            height="80px"
            size="mini"
            resizable
            auto-resize
          >
            <vxe-column
              v-for="(x, z) in dialogHeader[0]"
              :key="z"
              :resizable="true"
              :field="x.prop"
              :title="x.label"
              :min-width="x.width"
              :fixed="x.fix"
            >
            </vxe-column>
          </vxe-table>
        </div>
        <div class="flex_between margin_bottom_10">
          <span class="flex_shrink"
            >2.确认调整对象（{{ dialogData[1].length }}笔）：</span
          >
          <el-button type="warning" size="small" @click="addRow" plain
            >添加</el-button
          >
        </div>
        <div>
          <vxe-table
            ref="vxeTable_2"
            border
            show-overflow
            highlight-current-row
            highlight-hover-row
            height="300px"
            size="mini"
            resizable
            auto-resize
          >
            <vxe-column
              v-for="(x, z) in dialogHeader[1]"
              :key="z"
              :resizable="true"
              :field="x.prop"
              :title="x.label"
              :min-width="x.width"
              :fixed="x.fix"
            >
              <template slot-scope="scope">
                <span v-if="x.component">
                  <span v-if="x.component.type == 'select'">
                    <el-select
                      filterable
                      clearable
                      :multiple="x.component.multiple"
                      :disabled="scope.row['EditDisabled']"
                      value-key="label"
                      v-model="scope.row[x.prop]"
                      size="mini"
                    >
                      <el-option
                        v-for="x2 in scope.row[x.component.prop]"
                        :key="x2.value"
                        :label="x2.label"
                        :value="x2"
                      ></el-option>
                    </el-select>
                  </span>
                </span>
                <span
                  v-else
                  v-html="scope.row[x.propName ? x.propName : x.prop]"
                ></span>
              </template>
            </vxe-column>
            <vxe-column width="80px">
              <template slot-scope="scope">
                <el-button
                  plain
                  type="danger"
                  @click="delRow(scope.row, scope.$rowIndex)"
                  >删除</el-button
                >
              </template>
            </vxe-column>
          </vxe-table>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <span class="dialog_notive"
          >注意：以上订单行会调整到目标行下方，同时柜号也会更改，插入到两个不同柜号中间可以自行调整</span
        >
        <el-button @click="cancelChangeSort" size="small">取 消</el-button>
        <el-button type="primary" @click="sureChangeSort" size="small"
          >确 认 调 整</el-button
        >
      </span>
    </el-dialog>

    <el-dialog
      title="组柜"
      :visible.sync="switchDialog"
      width="16.8%"
      :close-on-click-modal="false"
    >
      <el-form>
        <el-form-item label="请选择柜号：">
          <el-select v-model="GroupCabineValue" filterable allow-create>
            <el-option
              v-for="(item4, i4) in GroupCabineOptions"
              :key="i4"
              :label="item4.GroupCabinet"
              :value="item4.GroupCabinet"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="温馨提示："
          ><span class="redFont"
            >不选择柜号可输入新柜号回车即可</span
          ></el-form-item
        >
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="switchDialog = false" size="small">取 消</el-button>
        <el-button type="primary" @click="sureGroupCabine" size="small"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 所有柜号 -->
    <el-dialog
      title="拆分数量"
      :visible.sync="numDialog"
      width="16.8%"
      :close-on-click-modal="false"
    >
      <el-form label-width="100px">
        <el-form-item label="计划总数：">
          {{ numForm.numTotal }}
        </el-form-item>
        <el-form-item label="拆分数量：">
          <el-input
            v-model="numForm.numValue"
            type="number"
            @input="isOut"
            placeholder="请输入拆分的数量"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="numDialog = false" size="small">取 消</el-button>
        <el-button type="primary" @click="sureSplitNum" size="small"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <el-dialog
      title="新增排程"
      :visible.sync="newDataDialog"
      width="80%"
      :close-on-click-modal="false"
    >
      <div>
        <ComSearch
          class="margin_bottom_10 dialog_search"
          ref="searchRef"
          :searchData="formSearchs[6].datas"
          :searchForm="formSearchs[6].forms"
          :remark="6"
          :isLoading="isLoading[6]"
          :btnForm="btnForm[6]"
          @btnClick="btnClick"
        />
        <ComVxeTable
          :rowKey="'RowNumber'"
          :height="'600px'"
          :tableData="tableData[6]"
          :tableHeader="tableColumns[6]"
          :tableLoading="tableLoading[6]"
          :remark="6"
          :hasSelect="true"
          :sysID="5646"
          ref="plxTableSix"
          :isEdit="false"
          :isClear="isClear[6]"
          :pagination="tablePagination[6]"
          @pageChange="pageChange"
          @pageSize="pageSize"
          @sortChange="sortChange"
          @selectfun="selectFun"
        />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="newDataDialog = false" size="small">取 消</el-button>
        <el-button type="primary" @click="sureAddNewData" size="small"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <el-dialog title="工单分析" :visible.sync="orderDialog" width="70%">
      <div class="APSContainer" style="background-color: #f0f2f5">
        <div class="admin_content">
          工单
          <ComReportTable
            :rowKey="'RowNumber'"
            :height="height1"
            :tableData="tableData[7]"
            :tableHeader="tableColumns[7]"
            :tableLoading="tableLoading[7]"
            :remark="7"
            :sysID="IDs[7].ID"
            :isClear="isClear[7]"
            :pagination="tablePagination[7]"
            @pageChange="pageChange"
            @pageSize="pageSize"
            @sortChange="sortChange"
          />
        </div>
      </div>
    </el-dialog>

    <el-dialog title="工单查询" :visible.sync="formatDialog" width="70%">
      <div>
        <ComSearch
          class="margin_bottom_10 dialog_search"
          ref="searchRef"
          :searchData="formSearchs[9].datas"
          :searchForm="formSearchs[9].forms"
          :remark="9"
          :isLoading="isLoading[9]"
          :btnForm="btnForm[9]"
          @btnClick="btnClick"
        />
      </div>
      <div class="APSContainer" style="background-color: #f0f2f5">
        <!-- <div class="admin_content">

          <ComReportTable
            :rowKey="'RowNumber'"
            :height="height1"
            :tableData="tableData[8]"
            :tableHeader="tableColumns[8]"
            :tableLoading="tableLoading[8]"
            :remark="8"
            :sysID="IDs[8].ID"
            :isClear="isClear[8]"
            :showFooter="true"
            @handleRowClick="handleRowClick2"
            :pagination="tablePagination[8]"
            @pageChange="pageChange"
            @pageSize="pageSize"
            @sortChange="sortChange"
          />
        </div> -->

        <div class="admin_content">
          <ComReportTable
            :rowKey="'RowNumber'"
            :height="height1"
            :tableData="tableData[9]"
            :tableHeader="tableColumns[9]"
            :tableLoading="tableLoading[9]"
            :remark="9"
            :sysID="IDs[9].ID"
            :isClear="isClear[9]"
            :showFooter="true"
            :pagination="tablePagination[9]"
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
import ComReportTable from '@/components/ComReportTable';
import {
  GetHeader,
  GetSearch,
  GetSearchData,
  ExportData,
  UpdateProcess,
  SaveData,
} from '@/api/Common';
import {
  SaveMOPlanStep4,
  SaveMOPlanStep2,
  OrderPlanMaterialForm,
} from '@/api/PageTwoScheduling';

export default {
  name: 'SaleScheduling',
  components: {
    ComSearch,
    ComVxeTable,
    ComReportTable,
  },
  data() {
    return {
      height1: '500px',
      orderDialog: false,
      SN: null,
      searchTag: 0,
      GroupCabineValue: '',
      GroupCabineOptions: [],
      numDialog: false,
      numForm: {
        numTotal: '',
        numValue: '',
      },
      newDataDialog: false,

      ////////////////// Search /////////////////
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
      selectionData: [[], [], [], [], [], [], [], [], [], []],
      parmsBtn: [
        {
          ButtonCode: 'computedmating',
          BtnName: '配套计算',
          isLoading: false,
          Methods: 'dataComputedDate',
          Type: 'warning',
          Icon: '',
          Size: 'small',
          signName: 0,
          Params: { dataName: 'selectionDate' },
        },
        {
          ButtonCode: 'save',
          BtnName: '调单',
          isLoading: false,
          Methods: 'changeOrder',
          Type: 'primary',
          Icon: '',
          Size: 'small',
          signName: 0,
          Params: { dataName: 'selectionData' },
        },
        {
          ButtonCode: 'save',
          BtnName: '调柜',
          isLoading: false,
          Methods: 'groupcabine',
          Type: 'primary',
          Icon: '',
          Size: 'small',
          signName: 0,
          Params: { dataName: 'selectionData' },
        },

        {
          ButtonCode: 'save',
          BtnName: '拆单',
          isLoading: false,
          Methods: 'splitRow',
          Type: 'warning',
          Icon: '',
          Size: 'small',
          signName: 0,
          Params: { dataName: 'selectionData' },
        },
        {
          ButtonCode: 'save',
          BtnName: '新增排程',
          isLoading: false,
          Methods: 'addNewData',
          Type: 'primary',
          Icon: '',
          Size: 'small',
          signName: 0,
          Params: { dataName: 'selectionData' },
        },
        {
          ButtonCode: 'save',
          BtnName: '待出货区',
          isLoading: false,
          Methods: 'setNoOut',
          Type: 'warning',
          Icon: '',
          Size: 'small',
          signName: 0,
          Params: { dataName: 'selectionData' },
        },
        {
          ButtonCode: 'save',
          BtnName: '已出货区',
          isLoading: false,
          Methods: 'setHasOut',
          Type: 'warning',
          Icon: '',
          Size: 'small',
          signName: 0,
          Params: { dataName: 'selectionData' },
        },
        {
          ButtonCode: 'save',
          BtnName: '取消/暂停',
          isLoading: false,
          Methods: 'parseData',
          Type: 'danger',
          Icon: '',
          Size: 'small',
          signName: 0,
          Params: { dataName: 'selectionData' },
        },
        // {
        //   ButtonCode: "save",
        //   BtnName: "出货计划",
        //   isLoading: false,
        //   Methods: "setGoodPlan",
        //   Type: "primary",
        //   Icon: "",
        //   Size: "small",
        //   signName: 0,
        //   Params: { dataName: "selectionData" },
        // },
        {
          ButtonCode: 'save',
          BtnName: '匹配MO',
          isLoading: false,
          Methods: 'formalMo',
          Type: 'primary',
          Icon: '',
          Size: 'small',
          signName: 0,
          Params: { dataName: 'selectionData' },
        },
        {
          ButtonCode: 'save',
          BtnName: '保存',
          isLoading: false,
          Methods: 'dataSave',
          Type: 'primary',
          Icon: '',
          Size: 'small',
          signName: '',
          Params: { dataName: 'tableData' },
        },
        {
          ButtonCode: 'save',
          BtnName: '匹配MO并下达',
          isLoading: false,
          Methods: 'APSToMOplanMatchToMo',
          Type: 'success',
          Icon: '',
          Size: 'small',
          signName: 0,
          Params: { dataName: 'selectionData' },
        },
        {
          ButtonCode: 'save',
          BtnName: '待出货区',
          isLoading: false,
          Methods: 'setNoOut',
          Type: 'primary',
          Icon: '',
          Size: 'small',
          signName: 1,
          Params: { dataName: 'selectionData' },
        },
        {
          ButtonCode: 'save',
          BtnName: '已出货区',
          isLoading: false,
          Methods: 'setHasOut',
          Type: 'primary',
          Icon: '',
          Size: 'small',
          signName: 1,
          Params: { dataName: 'selectionData' },
        },
        {
          ButtonCode: 'save',
          BtnName: '取消/暂停',
          isLoading: false,
          Methods: 'parseData',
          Type: 'danger',
          Icon: '',
          Size: 'small',
          signName: 1,
          Params: { dataName: 'selectionData' },
        },
        {
          ButtonCode: 'save',
          BtnName: '下到排期表',
          isLoading: false,
          Methods: 'setScheduling',
          Type: 'success',
          Icon: '',
          Size: 'small',
          signName: 1,
          Params: { dataName: 'selectionData' },
        },
        {
          ButtonCode: 'save',
          BtnName: '转入已出货区',
          isLoading: false,
          Methods: 'setHasOut',
          Type: 'primary',
          Icon: '',
          Size: 'small',
          signName: 2,
          Params: { dataName: 'selectionData' },
        },
        {
          ButtonCode: 'save',
          BtnName: '取消/暂停',
          isLoading: false,
          Methods: 'parseData',
          Type: 'danger',
          Icon: '',
          Size: 'small',
          signName: 2,
          Params: { dataName: 'selectionData' },
        },
        {
          ButtonCode: 'save',
          BtnName: '退回排期表',
          isLoading: false,
          Methods: 'backScheduling',
          Type: 'danger',
          Icon: '',
          Size: 'small',
          signName: 2,
          Params: { dataName: 'selectionData' },
        },
        {
          ButtonCode: 'save',
          BtnName: '退回排期表',
          isLoading: false,
          Methods: 'backScheduling',
          Type: 'danger',
          Icon: '',
          Size: 'small',
          signName: 3,
          Params: { dataName: 'selectionData' },
        },
        {
          ButtonCode: 'save',
          BtnName: '退回排期表',
          isLoading: false,
          Methods: 'backScheduling',
          Type: 'danger',
          Icon: '',
          Size: 'small',
          signName: 4,
          Params: { dataName: 'selectionData' },
        },
      ],
      tableData: [[], [], [], [], [], [], [], [], [], []],
      tableColumns: [[], [], [], [], [], [], [], [], [], []],
      tableLoading: [
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
      ],
      isClear: [
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
      ],
      tablePagination: [
        { pageIndex: 1, pageSize: 200, pageTotal: 0 },
        { pageIndex: 1, pageSize: 200, pageTotal: 0 },
        { pageIndex: 1, pageSize: 200, pageTotal: 0 },
        { pageIndex: 1, pageSize: 200, pageTotal: 0 },
        { pageIndex: 1, pageSize: 200, pageTotal: 0 },
        { pageIndex: 1, pageSize: 200, pageTotal: 0 },
        { pageIndex: 1, pageSize: 200, pageTotal: 0 },
        { pageIndex: 1, pageSize: 200, pageTotal: 0 },
        { pageIndex: 1, pageSize: 200, pageTotal: 0 },
        { pageIndex: 1, pageSize: 500, pageTotal: 0 },
      ],
      height: '707px',
      showPagination: true,
      tagRemark: 0,
      isLoading: false,
      labelStatus1: 0,
      ProcessGroupID: '',
      Status1: [
        { label: '总排程表', value: [21, 22, 23, 26, 24] },
        { label: '未下达', value: 26 },
        { label: '待出货区', value: 10 },
        { label: '已出货区', value: 12 },
        { label: '异常变更', value: '' },
        { label: '计划变更', value: '' },
      ],
      isSelect: true,
      isEdit: false,
      btnData: [],
      adminLoading: false,
      switchDialog: false,
      IDs: [
        { ID: 6676 },
        { ID: 6676 },
        { ID: 6676 },
        { ID: 6676 },
        { ID: 5170 },
        { ID: 5170 },
        { ID: 5646 },
        { ID: 7870 },
        { ID: 7917 },
        { ID: 7916 },
      ],
      changeDialog: false,
      dialogData: [[], []],
      dialogHeader: [
        [
          {
            label: '行号',
            prop: 'SN',
            width: '80px',
          },
          {
            label: '柜号',
            prop: 'GroupCabinet',
            width: '80px',
          },
          {
            label: '销往',
            prop: 'SaleTo',
            width: '120px',
          },
          {
            label: '单号',
            prop: 'SalesOrderNo',
            width: '100px',
          },
          {
            label: '机型',
            prop: 'MaterialName',
            width: '120px',
          },
          {
            label: '数量',
            prop: 'Qty',
            width: '80px',
          },
        ],
        [
          {
            label: '当前行',
            prop: 'SN',
            width: '80px',
          },
          {
            label: '目标行',
            prop: 'SN2',
            width: '80px',
          },
          {
            label: '柜号',
            prop: 'GroupCabinet',
            width: '80px',
          },
          {
            label: '新柜号',
            prop: 'NewGroupCabinet',
            width: '80px',
            component: {
              prop: 'GroupCabinets',
              type: 'select',
              disabled: 'EditDisabled',
            },
          },
          {
            label: '销往',
            prop: 'SaleTo',
            width: '120px',
          },
          {
            label: '单号',
            prop: 'SalesOrderNo',
            width: '80px',
          },
          {
            label: '机型',
            prop: 'MaterialName',
            width: '150px',
          },
          {
            label: '数量',
            prop: 'Qty',
            width: '80px',
          },
        ],
      ],
      startNum: 0,
      formatDialog: false,
    };
  },
  watch: {
    // dialogData: {
    //   handler(val, oldVal) {
    //     debugger;
    //     if (this.dialogData[0]) {
    //       this.$refs.vxeTable_1.reloadData(this.dialogData[0]);
    //     }
    //     if (this.dialogData[1]) {
    //       this.$refs.vxeTable_2.reloadData(this.dialogData[1]);
    //     }
    //   },
    //   deep: true,
    //   immediate: true,
    // },
    // "fireValue": {
    //   handler(val, oldVal) {
    //     this.$set(this.dialogHeader[1][3].component,'disabled',val);
    //   },
    //   deep: true,
    // },
  },
  computed: {
    // fireValue: function () {
    //   //监听下拉框
    //   return this.dialogHeader[1][3].component.disabled;
    // },
  },
  created() {
    _this = this;
    this.judgeBtn();
    // 获取柜号
    this.getGroupCabinetList();
    this.getTableHeader();
  },
  mounted() {
    setTimeout(() => {
      this.setHeight();
    }, 450);
  },
  methods: {
    // 计算生产材积
    computedqty(row, val, prop, index) {
      let total = '';
      total = (
        (parseFloat(row.TotalVolume) / parseFloat(row.OweStockOutQty)) *
        val
      ).toFixed(2);
      this.$set(row, 'Extend3', total);
    },
    // 计算包装材积
    computedqty2(row, val, prop, index) {
      let total = '';
      total = (
        (parseFloat(row.TotalVolume) / parseFloat(row.OweStockOutQty)) *
        val
      ).toFixed(2);
      this.$set(row, 'Extend4', total);
    },
    // 判断按钮权限
    async dataComputedDate() {
      let newData = [];
      // let submitData = [];
      // if (newData.length != 0) {
      //   newData.forEach((x) => {
      //     if (x.isChecked) {
      //       submitData.push(x);
      //     }
      //   });
      // }
      // if (submitData.length == 0) {
      //   this.$message.error("请选择需要下达的数据！");
      // } else {
      this.adminLoading = true;
      let res = await OrderPlanMaterialForm(newData);
      const { data, forms, result, msg } = res.data;
      if (result) {
        this.dataSearch(0);
        this.adminLoading = false;
        this.$message({
          message: msg,
          type: 'success',
          dangerouslyUseHTMLString: true,
        });
      } else {
        this.adminLoading = false;
        this.$message({
          message: msg,
          type: 'error',
          dangerouslyUseHTMLString: true,
        });
      }
      // }
    },
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
      this.$set(this, 'btnData', newBtn);
      this.$set(this, 'isEdit', permission);
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
      this.formSearchs[remarkTb].datas['ProductionStatus'] =
        this.Status1[this.labelStatus1].value;
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
      let res = null;
      this.adminLoading = true;
      if (newData && newData.length != 0) {
        res = await SaveData(newData);
      } else {
        res = await SaveData(this.tableData[remarkTb]);
      }
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
      let res = await GetHeader(this.IDs);
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
          this.$set(this.formSearchs[z].datas, 'dicID', this.IDs[z].ID);
          x.forEach((y) => {
            if (y.prop && y.value) {
              this.$set(this.formSearchs[z].datas, [y.prop], y.value);
            } else {
              this.$set(this.formSearchs[z].datas, [y.prop], '');
            }
          });
          this.$set(this.formSearchs[z], 'forms', x);
        });
        this.formSearchs[0].datas['ProductionStatus'] = [21, 22, 23, 26, 24];
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
        if (data.length != 0) {
          this.startNum = data[0].SN;
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
    ////////////////其他事件///////////////
    // 改变状态
    changeStatus(item, index) {
      this.labelStatus1 = index;
      this.formSearchs[index].datas['ProductionStatus'] = item.value;
      this.dataSearch(index);
    },
    // 选择数据
    selectFun(data, remarkTb, row) {
      this.$set(this.selectionData, remarkTb, data);
    },
    // 获取柜号
    async getGroupCabinetList() {
      let res = await GetSearchData({ dicID: 5650 });
      const { result, data, count, msg } = res.data;
      if (result) {
        _this.GroupCabineOptions = data;
      } else {
        this.$message({
          message: msg,
          type: 'error',
          dangerouslyUseHTMLString: true,
        });
      }
    },
    // 组柜
    groupcabine(remarkTb, data, title, ref) {
      this.searchTag = remarkTb;
      if (this.selectionData[remarkTb].length == 0) {
        this.$message.error('请选择需要调柜的数据！');
      } else {
        this.GroupCabineValue = '';
        this.switchDialog = true;
      }
    },
    // 调单
    changeOrder() {
      this.changeDialog = true;
      // 打开就把选中的数据放进需要调整的行
      if (this.selectionData[0].length != 0) {
        if (this.dialogData[1].length == 0) {
          this.$set(this.dialogData, 1, this.selectionData[0]);
          this.dialogData[1].forEach((a) => {
            a['update'] = true;
            this.$set(a, 'EditDisabled', false);
          });
        } else {
          this.selectionData[0].forEach((y) => {
            let newIndex = -1;
            newIndex = this.dialogData[1].findIndex(
              (x) => x.SalesOrderDetailID == y.SalesOrderDetailID,
            );
            if (newIndex == -1) {
              y['update'] = true;
              this.$set(y, 'EditDisabled', false);
              this.dialogData[1].push(y);
            }
          });
        }
      }
      this.SearchSN();
    },
    // 确认这个柜号
    sureGroupCabine() {
      if (this.GroupCabineValue) {
        this.selectionData[this.searchTag].forEach((x) => {
          this.$set(x, 'GroupCabinet', this.GroupCabineValue);
        });
        // 保存数据
        this.generalSaveData(
          this.selectionData[this.searchTag],
          this.searchTag,
        );
        this.switchDialog = false;
        this.$refs.vxeTable0[0].$refs.vxeTable.clearCheckboxRow();
      } else {
        this.$message.error('请选择柜号或者手动输入新柜号！');
      }
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
    // 拆单
    splitRow(remarkTb) {
      this.numForm.numValue = null;
      this.searchTag = remarkTb;
      if (this.selectionData[remarkTb].length == 0) {
        this.$message.error('请选择需要拆单的数据！');
      } else if (this.selectionData[remarkTb].length > 1) {
        this.$message.error('仅能选择一条数据进行拆单！');
      } else {
        this.numForm.numTotal = this.selectionData[remarkTb][0].PlanQty;
        this.numDialog = true;
      }
    },
    // 删除新拆的单
    delsalerow(row, val, prop, index, remarkTb) {
      let newData = [];
      let obj = this.tableData[remarkTb][index];
      obj['ElementDeleteFlag'] = 1;
      newData.push(obj);
      this.$confirm('确定要删除数据吗？如果新拆单还没保存则无效')
        .then((_) => {
          debugger;
          _this.dataSave(remarkTb, index, null, newData);
        })
        .catch((_) => {});
    },
    // 确定拆单
    sureSplitNum() {
      let newNum =
        parseFloat(this.numForm.numTotal) - parseFloat(this.numForm.numValue);
      this.$set(this.selectionData[this.searchTag][0], 'PlanQty', newNum);
      let obj = JSON.parse(
        JSON.stringify(this.selectionData[this.searchTag][0]),
      );
      obj['SalesPlanID'] = '';
      obj['IsVirtualRow'] = true;
      obj['PlanQty'] = this.numForm.numValue;
      this.tableData[this.searchTag].unshift(obj);
      this.numDialog = false;
      this.$set(this.isClear, 0, true);
      this.$refs.vxeTable0[0].$refs.vxeTable.clearCheckboxRow();
      setTimeout(() => {
        this.$set(this.isClear, 0, false);
      }, 1000);
    },
    // 拆单的数量不能大于计划数
    isOut(val) {
      if (val > parseFloat(this.numForm.numTotal)) {
        this.$message.error('拆单的数量不能大于总计划数！');
        this.numForm.numValue = 0;
      }
    },
    // 加入待出货区
    setNoOut() {
      if (this.selectionData[this.labelStatus1].length == 0) {
        this.$message.error('请选择加入待出货区的数据！');
      } else {
        this.$confirm('是否将数据加入待出货?')
          .then(() => {
            _this.selectionData[this.labelStatus1].forEach((x) => {
              x.ProductionStatus = 10; // 待发货状态
            });
            _this.generalSaveData(
              _this.selectionData[this.labelStatus1],
              this.labelStatus1,
            );
          })
          .catch(() => {});
      }
    },
    // 加入已出货区
    setHasOut() {
      if (this.selectionData[this.labelStatus1].length == 0) {
        this.$message.error('请选择加入已出货区的数据！');
      } else {
        this.$confirm('是否将数据加入已出货区！')
          .then(() => {
            _this.selectionData[this.labelStatus1].forEach((x) => {
              x.ProductionStatus = 12; // 已发货状态
            });
            _this.generalSaveData(
              _this.selectionData[this.labelStatus1],
              this.labelStatus1,
            );
          })
          .catch(() => {});
      }
    },
    // 取消或暂停
    parseData() {
      if (this.selectionData[this.labelStatus1].length == 0) {
        this.$message.error('请选择取消或暂停的数据！');
      } else {
        this.$confirm('是否取消或暂停该数据？')
          .then(() => {
            _this.selectionData[this.labelStatus1].forEach((x) => {
              if (x.ProductionStatus != 24) {
                x.ProductionStatus = 24; // 非暂停
              } else {
                x.ProductionStatus = 26; // 取消暂停
              }
            });
            _this.generalSaveData(
              _this.selectionData[this.labelStatus1],
              remarkTb,
            );
          })
          .catch(() => {});
      }
    },
    // 下到排期区
    setScheduling() {
      if (this.selectionData[this.labelStatus1].length == 0) {
        this.$message.error('请选择下排的数据！');
      } else {
        this.$confirm('是否下排数据？')
          .then(async () => {
            _this.adminLoading = true;
            let res = await GetSearch(
              this.selectionData[this.labelStatus1],
              `/APSAPI/APSTOMOplan`,
            );
            const { result, msg } = res.data;
            if (result) {
              this.adminLoading = false;
              this.dataSearch(this.labelStatus1);
              this.$message({
                message: msg,
                type: 'success',
                dangerouslyUseHTMLString: true,
              });
            } else {
              this.adminLoading = false;
              this.$message({
                message: msg,
                type: 'error',
                dangerouslyUseHTMLString: true,
                duration: 8000,
              });
            }
          })
          .catch(() => {});
      }
    },
    // 退回待调区
    backStart() {},
    // 退回排期区
    backScheduling() {
      if (this.selectionData[this.labelStatus1].length == 0) {
        this.$message.error('请选择退回的数据！');
      } else {
        this.$confirm('是否退回数据？')
          .then(() => {
            _this.selectionData[this.labelStatus1].forEach((x) => {
              x.ProductionStatus = 23; // 暂停状态
            });
            _this.generalSaveData(
              _this.selectionData[this.labelStatus1],
              this.labelStatus1,
            );
            _this.dataSearch(this.labelStatus1);
          })
          .catch(() => {});
      }
    },
    // 新增排程
    addNewData() {
      this.dataSearch(6);
      this.newDataDialog = true;
    },
    // 确定添加这些排程进来
    async sureAddNewData() {
      // 不确定是否加进来就保存在数据库，怕其他按钮操作执行查询白添加了
      if (this.selectionData[6].length == 0) {
        this.$message.error('未选择数据！');
        this.newDataDialog = true;
      } else {
        this.selectionData[6].forEach((m) => {
          m.ProductionStatus = 26;
        });
        _this.adminLoading = true;
        let res = await GetSearch(
          this.selectionData[6],
          `/APSAPI/APSTOSalesPlan`,
        );
        const { result, msg } = res.data;
        if (result) {
          this.adminLoading = false;
          this.dataSearch(0);
          _this.$refs.plxTableSix.$refs.vxeTable.clearCheckboxRow();
          this.$message({
            message: msg,
            type: 'success',
            dangerouslyUseHTMLString: true,
          });
        } else {
          this.adminLoading = false;
          this.$message({
            message: msg,
            type: 'error',
            dangerouslyUseHTMLString: true,
            duration: 8000,
          });
        }
        this.newDataDialog = false;
      }
    },
    // 出货计划
    setGoodPlan(remarkTb) {},
    // 匹配MO
    async formalMo() {
      this.adminLoading = true;
      // 表格数据全部返回匹配结果
      let res = await GetSearch(
        this.tableData[this.labelStatus1],
        `/APSAPI/APSToMOplanMatch`,
      );
      const { result, msg } = res.data;
      if (result) {
        this.adminLoading = false;
        this.dataSearch(this.labelStatus1);
        this.$message({
          message: msg,
          type: 'success',
          dangerouslyUseHTMLString: true,
        });
      } else {
        this.adminLoading = false;
        this.$message({
          message: msg,
          type: 'error',
          dangerouslyUseHTMLString: true,
          duration: 8000,
        });
      }
    },
    // 匹配MO并下达
    APSToMOplanMatchToMo() {
      // 表格数据全部返回匹配结果
      this.$confirm('这是对全部数据进行操作，是否自动匹配并自动下达?')
        .then(async () => {
          _this.adminLoading = true;
          let res = await GetSearch(
            _this.tableData[this.labelStatus1],
            `/APSAPI/APSToMOplanMatchToMo`,
          );
          const { result, msg } = res.data;
          if (result) {
            _this.adminLoading = false;
            _this.dataSearch(this.labelStatus1);
            _this.$message({
              message: msg,
              type: 'success',
              dangerouslyUseHTMLString: true,
            });
          } else {
            _this.adminLoading = false;
            _this.$message({
              message: msg,
              type: 'error',
              dangerouslyUseHTMLString: true,
              duration: 8000,
            });
          }
        })
        .catch(() => {});
    },
    // 查找目标行
    SearchSN() {
      if (!this.SN) {
        // this.$message.error("请输入目标行！");
      } else {
        let newRow = this.tableData[0].filter((x) => {
          return x.SN == this.SN;
        });
        this.$set(this.dialogData, 0, []);
        if (newRow.length != 0) {
          let NewGroupCabinet = '';
          // 获取当前柜号的下一行是否是同一柜号;
          let prop = [];
          let EditDisabled = false;
          if (this.SN == this.tableData[0].length) {
            EditDisabled = true;
            NewGroupCabinet = newRow[0].GroupCabinet;
          } else {
            let NextGroupCabinet =
              this.tableData[0][parseInt(this.SN)].GroupCabinet;
            if (newRow[0].GroupCabinet == NextGroupCabinet) {
              EditDisabled = true;
              NewGroupCabinet = newRow[0].GroupCabinet;
            } else {
              NewGroupCabinet = newRow[0].GroupCabinet;
              prop.push({ label: NewGroupCabinet, value: NewGroupCabinet });
              prop.push({ label: NextGroupCabinet, value: NextGroupCabinet });
              EditDisabled = false;
            }
          }
          this.$set(this.dialogData, 0, newRow);
          if (this.dialogData[1].length != 0) {
            this.dialogData[1].forEach((x) => {
              x.SN2 = this.SN;
              x['GroupCabinets'] = prop;
              this.$set(x, 'EditDisabled', EditDisabled);
              x.NewGroupCabinet = NewGroupCabinet;
            });
          }
        } else {
          this.$message.error('暂未找到该目标行，请确认当前页是否有这行数据！');
        }
      }
      this.$nextTick(() => {
        _this.$refs.vxeTable_1.reloadData(this.dialogData[0]);
        _this.$refs.vxeTable_2.reloadData(this.dialogData[1]);
      });
    },
    // 添加
    addRow() {
      this.changeDialog = false;
    },
    // 删除行
    delRow(row, index) {
      this.dialogData[1].splice(index, 1);
    },
    // 确定调整顺序
    sureChangeSort() {
      if (this.dialogData[0].length == 0) {
        this.$message.error('请填写目标行再调整！');
      } else if (this.dialogData[1].length == 0) {
        this.$message.error('请选择需要调整的数据！');
      } else {
        let newData = JSON.parse(JSON.stringify(this.dialogData[1]));
        // 先删除有的，在push新的
        let newTableData = this.tableData[0].filter(
          (x) => !newData.some((y) => y.SN == x.SN),
        );
        let newIndex = newTableData.findIndex((z) => z.SN == this.SN);
        // 把arr2 变成一个适合splice的数组（包含splice前2个参数的数组）
        newData.unshift(newIndex + 1, 0);
        Array.prototype.splice.apply(newTableData, newData);
        let startNum = this.startNum;
        newTableData.forEach((z) => {
          this.$set(z, 'SN', startNum);
          this.$set(z, 'GroupCabinet', z.NewGroupCabinet);
          startNum++;
        });
        this.$set(this.tableData, 0, []);
        this.$set(this.tableData, 0, newTableData);
        this.changeDialog = false;
      }
    },
    cancelChangeSort() {
      // this.SN = '';
      // this.$set(this.dialogData,0,[]);
      // this.$set(this.dialogData,1,[]);
      this.changeDialog = false;
    },
    // 打开工单分析
    toPage(row, prop) {
      if (prop == 'OrderJudgeSys') {
        this.formSearchs[7].datas['SalesOrderDetailID'] =
          row.SalesOrderDetailID;
        this.dataSearch(7);
        this.orderDialog = true;
      } else if (prop == 'FormP') {
        // this.formSearchs[8].datas["SalesOrderDetailID"] =
        //   row.SalesOrderDetailID;
        // this.dataSearch(8);
        this.formSearchs[9].datas['OweQty'] = 0;
        // this.formSearchs[9].datas["SalesOrderDetailID"] = row.SalesOrderDetailID;
        let MOSList = [];
        MOSList = row.MOS ? row.MOS.split(',') : [];
        this.formSearchs[9].datas['OrderNo'] = MOSList;

        console.log('MOSList', MOSList);
        // this.formSearchs[9].datas["OrderID"] = row.OrderID; 接口没返回此字段，会查出所有工单的数据，所有注释代码
        this.dataSearch(9);
        this.formatDialog = true;
      }
    },
    // 单击出来明细
    handleRowClick2(row, remarkTb) {
      this.formSearchs[9].datas['OrderID'] = row.OrderID;
      this.dataSearch(9);
    },
  },
};
</script>
