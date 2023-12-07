<!--订单自动预排-->
<template>
  <div
    class="APSContainer flex_column content_height bgWhite"
    v-loading="adminLoading"
  >
    <div
      class="flex_column"
      style="width: 100%; height: 100%"
      v-show="active === 1"
    >
      <div class="flex justify-between" style="width: 100%">
        <div class="flex_grow flex">
          <div class="flex">
            <el-steps :active="active" finish-status="success" align-center>
              <el-step title="选择订单" @click.native="activeNum(1)"></el-step>
              <el-step title="方案运算" @click.native="activeNum(2)"></el-step>
              <el-step title="调整负荷" @click.native="activeNum(3)"></el-step>
              <el-step title="更新订单" @click.native="activeNum(4)"></el-step>
            </el-steps>
          </div>
          <!-- <el-button
            type="primary"
            size="small"
            @click="activeNum(-1)"
            v-show="active !== 1"
            >上一步</el-button
          ><el-button type="primary" size="small" @click="activeNum(1)"
            >下一步</el-button
          > -->
        </div>
        <div class="flex">
          <div v-for="(item, y) in Status1" :key="y">
            <span
              @click="changeStatus(item, y)"
              :class="
                labelStatus1 == item['index'] ? 'statusActive cursor' : 'cursor'
              "
              class="title1"
              >{{ item.label }}</span
            >
            <el-divider direction="vertical"></el-divider>
          </div>
        </div>
      </div>
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
      <div
        class="flex_column admin_content flex_grow"
        v-for="item in [0, 1]"
        :key="item"
        v-show="item === labelStatus1"
      >
        <ComSpreadTable
          :ref="`spreadsheetRef${item}`"
          :height="'100%'"
          :tableData="tableData[item]"
          :tableColumns="tableColumns[item]"
          :tableLoading="tableLoading[item]"
          :remark="item"
          :sysID="sysID[item]['ID']"
          :pagination="tablePagination[item]"
          @pageChange="pageChange"
          @pageSize="pageSize"
          @workbookInitialized="workbookInitialized"
          @selectfun="selectFun"
        />
      </div>
    </div>
    <div
      class="flex_column"
      style="width: 100%; height: 100%"
      v-show="active === 2"
    >
      <div class="flex justify-between" style="width: 100%">
        <div class="flex_grow flex">
          <div class="flex">
            <el-steps :active="active" finish-status="success" align-center>
              <el-step title="选择订单" @click.native="activeNum(1)"></el-step>
              <el-step title="方案运算" @click.native="activeNum(2)"></el-step>
              <el-step title="调整负荷" @click.native="activeNum(3)"></el-step>
              <el-step title="更新订单" @click.native="activeNum(4)"></el-step>
            </el-steps>
          </div>
          <!-- <el-button type="primary" size="small" @click="activeNum(-1)"
            >上一步</el-button
          ><el-button type="primary" size="small" @click="activeNum(1)"
            >下一步</el-button
          > -->
        </div>
        <div class="flex"></div>
      </div>

      <div
        v-for="i in [2]"
        :key="i + 'head'"
        class="admin_head_2"
        ref="headRef"
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
      <div class="flex justify-between" style="width: 100%">
        <div class="flex_grow flex"></div>
        <div class="flex">
          <div>
            选择方案:<el-select
              clearable
              filterable
              size="small"
              placeholder="请选择方案"
              v-model="ChangeReason[2]"
              @change="handleSelectChange(2)"
            >
              <el-option
                v-for="(item, i) in ChangeReasonArray[2]"
                :key="i"
                :label="item.title"
                :value="item.title"
              ></el-option>
            </el-select>
          </div>
        </div>
      </div>
      <div
        class="flex_column admin_content flex_grow"
        v-for="item in [2]"
        :key="item + 'spread'"
      >
        <ComSpreadTable
          :ref="`spreadsheetRef${item}`"
          :height="'100%'"
          :tableData="tableData[item]"
          :tableColumns="tableColumns[item]"
          :tableLoading="tableLoading[item]"
          :remark="item"
          :sysID="sysID[item]['ID']"
          :pagination="tablePagination[item]"
          @pageChange="pageChange"
          @pageSize="pageSize"
          @workbookInitialized="workbookInitialized"
          @selectfun="selectFun"
        />
      </div>
    </div>
    <div
      class="flex_column"
      style="width: 100%; height: 100%"
      v-show="active === 3"
    >
      <div class="flex justify-between" style="width: 100%">
        <div class="flex_grow flex">
          <div class="flex">
            <el-steps :active="active" finish-status="success" align-center>
              <el-step title="选择订单" @click.native="activeNum(1)"></el-step>
              <el-step title="方案运算" @click.native="activeNum(2)"></el-step>
              <el-step title="调整负荷" @click.native="activeNum(3)"></el-step>
              <el-step title="更新订单" @click.native="activeNum(4)"></el-step>
            </el-steps>
          </div>
          <!-- <el-button type="primary" size="small" @click="activeNum(-1)"
            >上一步</el-button
          ><el-button type="primary" size="small" @click="activeNum(1)"
            >下一步</el-button
          > -->
        </div>
        <div class="flex items-center">
          <div v-for="(item, y) in Status3" :key="y">
            <span
              @click="changeStatus3(item, item['index'])"
              :class="
                labelStatus3 == item['index'] ? 'statusActive cursor' : 'cursor'
              "
              class="title1"
              >{{ item.label }}</span
            >
            <el-divider direction="vertical"></el-divider>
          </div>
        </div>
      </div>
      <div
        v-for="i in [3, 4]"
        :key="i + 'head'"
        class="admin_head_2"
        ref="headRef"
        v-show="labelStatus3 === i"
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
        <div class="flex justify-between" style="width: 100%">
          <div class="flex_grow flex"></div>
          <div class="flex">
            <el-radio-group
              v-model="radioValue[i]"
              @change="radioChange"
              style="margin-right: 40px"
            >
              <el-radio
                v-for="(item, index) in parmsBtn[i]"
                :key="index"
                :label="item.value"
                :value="item.value"
                >{{ item.label }}</el-radio
              >
            </el-radio-group>
            <div>
              选择方案:<el-select
                clearable
                filterable
                size="small"
                placeholder="请选择方案"
                v-model="ChangeReason[i]"
                @change="handleSelectChange(i)"
              >
                <el-option
                  v-for="(item, i) in ChangeReasonArray[i]"
                  :key="i"
                  :label="item.title"
                  :value="item.title"
                ></el-option>
              </el-select>
            </div>
          </div>
        </div>
      </div>

      <div
        class="flex_column admin_content flex_grow"
        v-for="item in [3, 4]"
        :key="item"
        v-show="labelStatus3 === item"
      >
        <ComSpreadTable
          :ref="`spreadsheetRef${item}`"
          :height="'100%'"
          :tableData="tableData[item]"
          :tableColumns="tableColumns[item]"
          :tableLoading="tableLoading[item]"
          :remark="item"
          :sysID="sysID[item]['ID']"
          :pagination="tablePagination[item]"
          @pageChange="pageChange"
          @pageSize="pageSize"
          @workbookInitialized="workbookInitialized"
          @selectfun="selectFun"
        />
      </div>
    </div>
    <div
      class="flex_column"
      style="width: 100%; height: 100%"
      v-show="active === 4"
    >
      <div class="flex justify-between" style="width: 100%">
        <div class="flex_grow flex">
          <div class="flex">
            <el-steps :active="active" finish-status="success" align-center>
              <el-step title="选择订单" @click.native="activeNum(1)"></el-step>
              <el-step title="方案运算" @click.native="activeNum(2)"></el-step>
              <el-step title="调整负荷" @click.native="activeNum(3)"></el-step>
              <el-step title="更新订单" @click.native="activeNum(4)"></el-step>
            </el-steps>
          </div>
          <!-- <el-button type="primary" size="small" @click="activeNum(-1)"
            >上一步</el-button
          ><el-button
            type="primary"
            size="small"
            @click="activeNum(1)"
            v-show="active !== 4"
            >下一步</el-button
          > -->
        </div>
        <div class="flex"></div>
      </div>
      <div
        v-for="i in [5]"
        :key="i + 'head'"
        class="admin_head_2"
        ref="headRef"
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
        class="flex_column admin_content flex_grow"
        v-for="item in [5]"
        :key="item"
      >
        <ComSpreadTable
          :ref="`spreadsheetRef${item}`"
          :height="'100%'"
          :tableData="tableData[item]"
          :tableColumns="tableColumns[item]"
          :tableLoading="tableLoading[item]"
          :remark="item"
          :sysID="sysID[item]['ID']"
          :pagination="tablePagination[item]"
          @pageChange="pageChange"
          @pageSize="pageSize"
          @workbookInitialized="workbookInitialized"
          @selectfun="selectFun"
        />
      </div>
    </div>
    <!-- 弹框-->
    <el-dialog
      :title="'产线排班表'"
      :visible.sync="colDialogVisible0"
      width="90%"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      ><div
        style="
          height: 80vh;
          overflow-x: hidden;
          display: flex;
          flex-direction: column;
        "
      >
        <splitpanes class="default-theme">
          <pane :size="50" v-for="item in [6, 7]" :key="item">
            <div class="flex_column" style="width: 100%; height: 100%">
              <div class="admin_head_2" ref="headRef">
                <ComSearch
                  ref="searchRef"
                  :searchData="formSearchs[item].datas"
                  :searchForm="formSearchs[item].forms"
                  :remark="item"
                  :isLoading="isLoading"
                  :btnForm="btnForm"
                  :signName="item"
                  @btnClick="btnClick"
                />
              </div>
              <div class="flex_grow">
                <ComSpreadTable
                  :ref="`spreadsheetRef${item}`"
                  :height="'100%'"
                  :tableData="tableData[item]"
                  :tableColumns="tableColumns[item]"
                  :tableLoading="tableLoading[item]"
                  :remark="item"
                  :sysID="sysID[item]['ID']"
                  :pagination="tablePagination[item]"
                  @pageChange="pageChange"
                  @pageSize="pageSize"
                  @workbookInitialized="workbookInitialized"
                  @selectfun="selectFun"
                />
              </div>
            </div>
          </pane>
        </splitpanes>
      </div>
    </el-dialog>
    <!-- 弹框-->
    <el-dialog
      :title="'拆分订单'"
      class="colDialogVisible1"
      :visible.sync="colDialogVisible1"
      :width="'50%'"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
    >
      <!-- <div class="pd-0-6 h-50px flex">
        <div class="flex-1 w-1/3 p-4">销售订单: {{ OOrderNo }}</div>
        <div class="flex-1 w-1/3 p-4">产品编码: {{ OQty }}</div>
        <div class="flex-1 w-1/3 p-4">产品名称: {{ ONewQty }}</div>
      </div>
      <div class="pd-0-6 h-50px flex">
        <div class="flex-1 w-1/3 p-4">订单交期:{{ Capacity }}</div>
        <div class="flex-1 w-1/3 p-4">订单数量: {{ OOrderNo }}</div>
        <div class="flex-1 w-1/3 p-4">计划数: {{ OQty }}</div>
      </div> -->
      <!-- <div class="ant-table-title pd-0-6 h-50px">
        <el-row>
          <el-col :span="6" class="flex"> 销售订单: {{ OOrderNo }} </el-col>
          <el-col :span="6" class="flex"> 产品编码: {{ OQty }} </el-col>
          <el-col :span="6" class="flex"> 产品名称: {{ ONewQty }} </el-col>
          <el-col :span="6" class="flex"> 订单交期:{{ Capacity }}</el-col>
        </el-row>
      </div> -->
      <!-- <div class="ant-table-title pd-0-6 h-50px">
        <el-row>
          <el-col :span="6" class="flex"> 订单数量: {{ OOrderNo }} </el-col>
          <el-col :span="6" class="flex"> 计划数: {{ OQty }} </el-col>
        </el-row>
      </div> -->
      <!-- <div class="pd-0-6">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="拉体">
            <el-input
              size="small"
              v-model="formInline.user"
              placeholder="请输入拉体"
            ></el-input>
          </el-form-item>
          <el-form-item label="数量">
            <el-input
              size="small"
              v-model="formInline.user"
              placeholder="请输入数量"
            ></el-input>
          </el-form-item>
          <el-form-item label="计划开始时间">
            <el-date-picker
              size="small"
              v-model="ERPStartDate"
              type="date"
              placeholder="选择开始日期"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="计划结束时间">
            <el-date-picker
              size="small"
              v-model="ERPStartDate"
              type="date"
              placeholder="选择结束日期"
            >
            </el-date-picker>
          </el-form-item>
        </el-form>
      </div> -->
      <span slot="footer" class="dialog-footer">
        <!-- <div class="flex">
          <div>总数量:{{ totalQty }}</div>
        </div> -->
        <div>
          <el-button @click="colDialogVisible1 = false">取 消</el-button>
          <el-button type="primary" @click="confirmDialog(null, 3)"
            >确 定</el-button
          >
        </div>
      </span>
    </el-dialog>
  </div>
</template>

<script>
var _this;
const GCsheets = GC.Spread.Sheets;
import '@grapecity/spread-sheets-vue';
import GC from '@grapecity/spread-sheets';
import '@grapecity/spread-sheets/styles/gc.spread.sheets.excel2013white.css';
import '@grapecity/spread-sheets/js/zh.js';
GC.Spread.Common.CultureManager.culture('zh-cn');
import { HeaderCheckBoxCellType } from '@/static/data.js';
import { Splitpanes, Pane } from 'splitpanes';
import 'splitpanes/dist/splitpanes.css';
import ComSearch from '@/components/ComSearch/AdvancedSearch';
import ComVxeTable from '@/components/ComVxeTable';
import ComSpreadTable from '@/components/ComSpreadTable';
import ComReportTable from '@/components/ComReportTable';
import ComBatchEdit from '@/components/ComBatchEdit';
import DialogTable from '@/components/Dialog/dialogTable';
import {
  GetHeader,
  GetSearchData,
  ExportData,
  SaveData,
  GetSearch,
  GetServerTime,
} from '@/api/Common';
export default {
  name: 'TBAutomaticOrderScheduling',
  components: {
    ComSearch,
    ComVxeTable,
    ComSpreadTable,
    ComReportTable,
    Splitpanes,
    Pane,
    DialogTable,
    ComBatchEdit,
  },
  data() {
    return {
      ////////////////// Search /////////////////
      spread: [[], [], [], [], [], [], [], []],
      selectionData: [[], [], [], [], [], [], [], []],
      title: this.$route.meta.title,
      includeFields: [[], [], [], [], [], [], [], []],
      hasSelect: [false, false, false, false, false, false],
      selectedIndex: '0',
      active: 1,
      ChangeReasonArray: [],
      ChangeReason: [null],
      formSearchs: [
        {
          datas: {
            IsSchdeuling: 0,
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
      formInline: {
        user: '',
        region: '',
      },
      btnForm: [],
      OrderNo: '',
      OrderNoValue: '',
      OrderNos: [[], [], [], [], [], [], [], []],
      tableData: [[], [], [], [], [], [], [], []],
      tableColumns: [[], [], [], [], [], [], [], []],
      tableLoading: [false, false, false, false, false, false, false, false],
      isClear: [false, false, false, false, false, false, false, false, false],
      tablePagination: [
        { pageIndex: 1, pageSize: 50, pageTotal: 0 },
        { pageIndex: 1, pageSize: 0, pageTotal: 0 },
        { pageIndex: 1, pageSize: 50, pageTotal: 0 },
        { pageIndex: 1, pageSize: 50, pageTotal: 0 },
        { pageIndex: 1, pageSize: 50, pageTotal: 0 },
        { pageIndex: 1, pageSize: 50, pageTotal: 0 },
        { pageIndex: 1, pageSize: 50, pageTotal: 0 },
        { pageIndex: 1, pageSize: 50, pageTotal: 0 },
      ],
      sheetSelectRows: [],
      sheetSelectObj: { start: 0, end: 0, count: 0 },
      height: '707px',
      tagRemark: 0,
      isLoading: false,
      adminLoading: false,
      Status1: [
        { label: '订单列表', value: '未开始', index: 0 },
        { label: '已选订单', value: '已完成', index: 1 },
      ],
      Status3: [
        { label: '销售订单', value: '未开始', index: 3 },
        { label: '生产订单', value: '已完成', index: 4 },
      ],
      labelStatus1: 0,
      labelStatus3: 3,
      sysID: [
        { ID: 15216 },
        { ID: 15215 },
        { ID: 15215 },
        { ID: 16230 },
        { ID: 49 },
        { ID: 15215 },
        { ID: 16231 },
        { ID: 97 },
      ],
      isEdit: [false, false, false, false, false, false],
      userInfo: {},
      Region: [6, 6, 6, 6, 6, 6, 6, 6, 6],
      colDialogVisible0: false,
      colDialogVisible1: false,
      colDialogVisible2: false,
      colDialogVisible4: false,
      clickRow: null,
      radioValue: [null, null, null, 0, 0],
      parmsBtn: {
        3: [
          { label: '显示工时', value: 0 },
          { label: '显示负荷', value: 1 },
        ],
        4: [
          { label: '显示工时', value: 0 },
          { label: '显示负荷', value: 1 },
        ],
      },
    };
  },
  computed: {},
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
  async mounted() {
    let res = await GetSearch(
      { DataSourceID: 'P2312060002' },
      '/APSAPI/GetDataSource',
    );
    const { result, data, count, msg } = res.data;
    if (result) {
      this.ChangeReasonArray[2] = data;
      this.ChangeReasonArray[3] = data;
      this.ChangeReasonArray[4] = data;
    } else {
      this.$message({
        message: msg,
        type: 'error',
        dangerouslyUseHTMLString: true,
      });
    }
  },
  methods: {
    //获取子组件实例
    workbookInitialized: function (workbook, remarkTb) {
      this.spread[remarkTb] = workbook;
    },
    //获取当前选中行的值
    selectFun(data, remarkTb, row) {
      this.selectionData[remarkTb] = data;
    },
    startObserving(remarkTb) {
      const tableElement = this.$refs[`spreadsheetRef${remarkTb}`]?.[0].$el;
      if (tableElement) {
        this[`resizeObserver${remarkTb}`] = new ResizeObserver((entries) => {
          // for (const entry of entries) {
          this.spread[remarkTb].refresh();
          // }
        });
        this[`resizeObserver${remarkTb}`].observe(tableElement);
      }
      // if (this.resizeObserver) {
      //   this.resizeObserver.disconnect();
      // }
    },
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
    // 渲染数据
    async setData(remarkTb) {
      this.spread[remarkTb].suspendPaint();
      let sheet = this.spread[remarkTb].getActiveSheet();
      sheet.reset();
      sheet.options.allowCellOverflow = true;
      sheet.defaults.rowHeight = 23;
      sheet.defaults.colWidth = 100;
      sheet.defaults.colHeaderRowHeight = 23;
      sheet.defaults.rowHeaderColWidth = 60;
      let colHeader1 = [];
      // let colInfos = [];
      sheet.setDataSource(this.tableData[remarkTb]);

      // 渲染列
      this.tableColumns[remarkTb].forEach((x, y) => {
        x['name'] = x['prop'];
        x['displayName'] = x['label'];
        x['width'] = parseInt(x.width);
        if (x.prop === 'isChecked') {
          // 选框
          sheet.setCellType(
            0,
            0,
            new HeaderCheckBoxCellType(),
            GCsheets.SheetArea.colHeader,
          );
          x.cellType = new GC.Spread.Sheets.CellTypes.CheckBox();
        } else if (
          x.ControlType === 'comboboxMultiple' ||
          x.ControlType === 'combobox'
        ) {
          this.tableData[remarkTb].map((item, index) => {
            if (x.DataSourceID && x.DataSourceName) {
              let newData = item[x.DataSourceName]; // 设置列表每行下拉菜单
              // 获取要绑定下拉菜单的单元格对象
              let cell = sheet.getCell(index, y);
              // 创建下拉菜单单元格类型，并设置其选项数据
              let comboBox = new GC.Spread.Sheets.CellTypes.ComboBox();
              comboBox.editorValueType(
                GC.Spread.Sheets.CellTypes.EditorValueType.value,
              );
              comboBox.editable(true);
              // 获取下拉菜单的选项数据
              comboBox.items(newData);
              comboBox.itemHeight(24);
              // 将下拉菜单单元格类型绑定到指定的单元格中
              cell.cellType(comboBox);
            }
          });
        } else if (x.ControlType === 'checkbox') {
          let cellType = new GC.Spread.Sheets.CellTypes.CheckBox();
          cellType.caption('');
          cellType.textTrue('');
          cellType.textFalse('');
          cellType.textIndeterminate('');
          cellType.textAlign(
            GC.Spread.Sheets.CellTypes.CheckBoxTextAlign.center,
          );
          cellType.isThreeState(false);
          sheet.getCell(-1, y).cellType(cellType);
        } else if (
          x.DataType == 'datetime' ||
          x.DataType === 'varchar' ||
          x.DataType === 'nvarchar'
        ) {
          x.formatter = '@';
        }
      });
      //渲染列
      sheet.bindColumns(this.tableColumns[remarkTb]); //此方法一定要放在setDataSource后面才能正确渲染列名
      sheet.setRowCount(1, GC.Spread.Sheets.SheetArea.colHeader);
      colHeader1.forEach(function (value, index) {
        sheet.setValue(0, index, value, GC.Spread.Sheets.SheetArea.colHeader);
      });

      var defaultStyle = new GC.Spread.Sheets.Style();
      defaultStyle.font =
        '12px basefontRegular, Roboto, Helvetica, Arial, sans-serif';
      defaultStyle.hAlign = GC.Spread.Sheets.HorizontalAlign.left;
      defaultStyle.vAlign = GC.Spread.Sheets.HorizontalAlign.center;
      defaultStyle.borderLeft = new GC.Spread.Sheets.LineBorder(
        'gray',
        GC.Spread.Sheets.LineStyle.thin,
      );
      defaultStyle.borderTop = new GC.Spread.Sheets.LineBorder(
        'gray',
        GC.Spread.Sheets.LineStyle.thin,
      );
      defaultStyle.borderRight = new GC.Spread.Sheets.LineBorder(
        'gray',
        GC.Spread.Sheets.LineStyle.thin,
      );
      defaultStyle.borderBottom = new GC.Spread.Sheets.LineBorder(
        'gray',
        GC.Spread.Sheets.LineStyle.thin,
      );
      defaultStyle.showEllipsis = true;
      sheet.setDefaultStyle(defaultStyle, GC.Spread.Sheets.SheetArea.viewport);

      // 冻结第一列
      if (this.tableColumns[remarkTb][0]['FixCount']) {
        // 冻结
        sheet.frozenColumnCount(this.tableColumns[remarkTb][0].FixCount);
      }

      // 列筛选
      // 参数2 开始列
      // 参数3
      // 参数4 结束列
      let cellrange = new GC.Spread.Sheets.Range(
        -1,
        -1,
        -1,
        this.tableColumns[remarkTb].length,
      );
      let hideRowFilter = new GC.Spread.Sheets.Filter.HideRowFilter(cellrange);
      sheet.rowFilter(hideRowFilter);

      // sheet.bindColumns(colInfos);
      this.spread[remarkTb].options.tabStripVisible = false; //是否显示表单标签

      //改变字体颜色
      this.tableData[remarkTb].forEach((rowItem, rowIndex) => {
        this.tableColumns[remarkTb].forEach((column, columnIndex) => {
          // 获取当前单元格
          const cell = sheet.getCell(rowIndex, columnIndex);
          cell.foreColor('black');
          cell.backColor('white');
          if (column['isEdit']) {
            cell.locked(false).foreColor('#2a06ecd9');
          }
          if (
            Object.prototype.toString.call(rowItem['FColors']) ===
            '[object Object]'
          ) {
            Object.keys(rowItem['FColors']).forEach((key) => {
              const columnIndex = this.tableColumns[remarkTb].findIndex(
                (column) => column.prop === key,
              );
              if (columnIndex !== -1) {
                // 这里使用 rowIndex 和 columnIndex 获取单元格
                const cell = sheet.getCell(rowIndex, columnIndex);
                cell.foreColor(rowItem['FColors'][key]);
              }
            });
          }
          if (
            Object.prototype.toString.call(rowItem['BColors']) ===
            '[object Object]'
          ) {
            Object.keys(rowItem['BColors']).forEach((key) => {
              const columnIndex = this.tableColumns[remarkTb].findIndex(
                (column) => column.prop === key,
              );
              if (columnIndex !== -1) {
                // 这里使用 rowIndex 和 columnIndex 获取单元格
                const cell = sheet.getCell(rowIndex, columnIndex);
                cell.backColor(rowItem['BColors'][key]);
              }
            });
          }
        });
      });

      let cellIndex = 0;
      let viewSortIndex = 0; //排序的索引
      let lineIDIndex = 0;
      this.tableColumns[remarkTb].forEach((m) => {
        //行，start,end
        if (m.prop == 'ViewSort') {
          viewSortIndex = cellIndex;
        }
        if (m.prop == 'LineID') {
          lineIDIndex = cellIndex;
        }
        //行，start,end
        if (m.isEdit) {
          sheet.getRange(-1, cellIndex, 1, 1).locked(false);
          var cell = sheet.getCell(
            -1,
            cellIndex,
            GC.Spread.Sheets.SheetArea.viewport,
          );
          //cell.foreColor("#2a06ecd9");
        } else {
          var cell = sheet.getCell(
            -1,
            cellIndex,
            GC.Spread.Sheets.SheetArea.viewport,
          );
          // cell.foreColor("gray");
        }

        cellIndex++;
      });
      sheet.options.protectionOptions.allowResizeColumns = true;
      sheet.options.isProtected = true;
      sheet.options.protectionOptions.allowResizeColumns = true;
      sheet.options.protectionOptions.allowInsertRows = true;
      sheet.options.protectionOptions.allowDeleteRows = true;
      sheet.options.protectionOptions.allowSelectLockedCells = true;
      sheet.options.protectionOptions.allowSelectUnlockedCells = true;
      sheet.options.protectionOptions.allowDeleteColumns = true;
      sheet.options.protectionOptions.allowInsertColumns = true;
      sheet.options.protectionOptions.allowDargInsertRows = true;
      sheet.options.protectionOptions.allowDragInsertColumns = true;
      sheet.options.protectionOptions.allowSort = true;
      sheet.options.protectionOptions.allowFilter = true;
      sheet.options.allowUserDragDrop = true;

      var insertRowsCopyStyle = {
        canUndo: true,
        name: 'insertRowsCopyStyle',
        execute: function (context, options, isUndo) {
          var Commands = GC.Spread.Sheets.Commands;
          if (isUndo) {
            Commands.undoTransaction(context, options);
            return true;
          } else {
            sheet.suspendPaint();
            sheet.addRows(options.activeRow, _this.sheetSelectRows.length);
            //  sheet.setArray(options.activeRow, 0,_this.sheetSelectRows);
            // console.log(_this.sheetSelectRows);

            // console.log(_this.sheetSelectObj.start+_this.sheetSelectRows.length)
            //删除旧行
            if (_this.sheetSelectObj.start > options.activeRow) {
              //说明从下面插入上面
              sheet.copyTo(
                _this.sheetSelectObj.start + _this.sheetSelectRows.length,
                0,
                options.activeRow,
                0,
                _this.sheetSelectRows.length,
                sheet.getColumnCount(),
                GC.Spread.Sheets.CopyToOptions.all,
              );

              //   sheet.setArray(options.activeRow, 0, _this.sheetSelectRows);
              sheet.deleteRows(
                _this.sheetSelectObj.start + _this.sheetSelectRows.length,
                _this.sheetSelectObj.count,
              );
              // sheet.removeRow(_this.sheetSelectObj.start+ _this.sheetSelectRows.length)
            } else {
              //从上面往下面插入
              sheet.copyTo(
                _this.sheetSelectObj.start,
                0,
                options.activeRow,
                0,
                _this.sheetSelectRows.length,
                sheet.getColumnCount(),
                GC.Spread.Sheets.CopyToOptions.all,
              );
              //  sheet.setArray(options.activeRow, 0, _this.sheetSelectRows);
              sheet.deleteRows(
                _this.sheetSelectObj.start,
                _this.sheetSelectObj.count,
              );
            }
            let count = sheet.getRowCount(GC.Spread.Sheets.SheetArea.viewport);

            let lineID = _this.sheetSelectRows[0][lineIDIndex];
            let isFind = false;
            let viewSort = 1;

            for (var i = 0; i < count; i++) {
              if (isFind == false && sheet.getValue(i, lineIDIndex) == lineID) {
                isFind = true;
              }
              if (isFind && sheet.getValue(i, lineIDIndex) != lineID) {
                break;
              }
              if (isFind) {
                sheet.setValue(i, viewSortIndex, viewSort);
                viewSort++;
              }
            }

            // Commands.startTransaction(context, options);

            // sheet.suspendPaint();

            // var beforeRowCount = 0;

            //  sheet.suspendPaint();

            // Commands.endTransaction(context, options);
            sheet.resumePaint();

            return true;
          }
        },
      };

      this.spread[remarkTb]
        .commandManager()
        .register('insertRowsCopyStyle', insertRowsCopyStyle);

      function MyContextMenu() {}
      MyContextMenu.prototype = new GC.Spread.Sheets.ContextMenu.ContextMenu(
        this.spread[remarkTb],
      );
      MyContextMenu.prototype.onOpenMenu = function (
        menuData,
        itemsDataForShown,
        hitInfo,
        spread,
      ) {
        itemsDataForShown.forEach(function (item, index) {
          // console.log(item);
          if (item && item.name === 'gc.spread.rowHeaderinsertCutCells') {
            item.command = 'insertRowsCopyStyle';
          }
          //  else if (item && item.name === "gc.spread.cut") {

          //     item.command = "insertRowsCut";
          //   }
        });
      };
      var contextMenu = new MyContextMenu();
      this.spread[remarkTb].contextMenu = contextMenu;
      // 剪贴板事件绑定
      sheet.bind(
        GC.Spread.Sheets.Events.ClipboardChanged,
        function (sender, args) {
          let s = sheet.getSelections()[0];
          console.log(sheet.getDataItem(s.row));
          _this.sheetSelectRows = sheet.getArray(
            s.row,
            0,
            s.rowCount,
            _this.tableColumns[remarkTb].length,
          );
          _this.sheetSelectObj.start = s.row;

          _this.sheetSelectObj.count = s.rowCount;
        },
      );

      /////////////////表格事件/////////////
      //绑定表格事件前，需清除之前的绑定事件
      this.spread[remarkTb].unbindAll();
      this.spread[remarkTb].bind(GCsheets.Events.ButtonClicked, (e, args) => {
        const { sheet, row, col } = args;
        const cellType = sheet.getCellType(row, col);
        if (cellType instanceof GCsheets.CellTypes.Button) {
        }
        if (cellType instanceof GCsheets.CellTypes.CheckBox) {
        }
        if (cellType instanceof GCsheets.CellTypes.HyperLink) {
        }
      });
      //表格编辑事件

      this.spread[remarkTb].bind(
        GCsheets.Events.EditStarting,
        function (e, args) {},
      );
      this.spread[remarkTb].bind(GCsheets.Events.EditEnded, function (e, args) {
        // 自动计算数量
      });
      // 表格单击齐套率弹框事件
      this.spread[remarkTb].bind(GCsheets.Events.CellClick, function (e, args) {
        if (_this.selectingRow === -1 || args['row'] !== _this.selectingRow) {
          // if (_this.tableColumns[remarkTb].length) {
          //   _this.tableColumns[remarkTb].map((item, index) => {
          if (remarkTb === 3) {
            _this.formSearchs[3].datas['OrganizeID'] =
              _this.tableData[remarkTb][args.row].OrganizeID || 'N/A';
            _this.colDialogVisible0 = true;
            _this.dataSearch(6);
            _this.dataSearch(7);
          }
          //   });
          // }
          _this.selectingRow = args.row;
        }
      });
      //脏数据清除
      sheet.bind(GC.Spread.Sheets.Events.RowChanged, function (e, info) {});
      this.spread[remarkTb].resumePaint();
      this.adminLoading = false;
      this.tableLoading[remarkTb] = false;
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
        this.spread[remarkTb].refresh(); //重新定位宽高度
      }, 0);
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
        await this.dataSearch(remarkTb);
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
          this.startObserving(i);
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
            //进行验证;
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
        this.setData(remarkTb);
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
    // 选择数据
    selectFun(data, remarkTb, row) {
      this.selectionData[remarkTb] = data;
    },
    // 单击获取明细
    handleRowClick(row, remarkTb) {
      this.clickRow = row;
      if (remarkTb === 3) {
        this.formSearchs[6].datas['OrganizeID'] = row.OrganizeID;
        this.formSearchs[7].datas['OrganizeID'] = row.OrganizeID;
        this.dataSearch(6);
        this.dataSearch(7);
        this.colDialogVisible0 = true;
      }
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
    },
    //获取当前选中行的值
    selectFun(data, remarkTb, row) {
      this.selectionData[remarkTb] = data;
    },
    radioChange(val) {
      this.dataSearch(this.labelStatus3);
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
      this.formSearchs[this.selectedIndex].datas['WorkShopID'] =
        this.clickData[0]?.OrganizeID;
      this.formSearchs[this.selectedIndex].datas['LineID'] =
        this.clickData[1]?.OrganizeID;
      this.selectedIndex = tab.name;
      this.dataSearch(this.selectedIndex);
    },
    async JoinRehearsalEvent(remarkTb, index, parms) {
      if (this.selectionData[remarkTb].length === 0) {
        this.$message.error('请选择需要操作的行');
        return;
      }
      if (remarkTb === 0) {
        this.labelStatus1 = 1;
        let newData = _.cloneDeep(this.selectionData[0]);
        newData.forEach((item) => {
          item['dicID'] = 15215;
        });
        this.dataSave(1, null, null, newData);
        // this.$set(this.tableData, 1, _.cloneDeep(this.selectionData[0]));
        // this.$set(this.tablePagination[1], 'pageTotal', count);
        await this.dataSearch(1);
      }
    },
    // 改变状态
    changeStatus(item, index) {
      this.labelStatus1 = index;
      this.setData(this.labelStatus1);
      this.dataSearch(this.labelStatus1);
    },
    changeStatus3(item, index) {
      this.labelStatus3 = index;
      this.dataSearch(this.labelStatus3);
    },
    handleSelectChange(remarkTb) {
      this.formSearchs[remarkTb].datas['ChangeReason'] = this.ChangeReason;
    },
    activeNum(stepNumber) {
      console.log('点击步骤', stepNumber);
      this.active = stepNumber;
      //   if (stepNumber === -1) {
      //     if (this.active === 1) {
      //       return;
      //     } else {
      //       this.active = this.active + stepNumber;
      //     }
      //   } else {
      //     if (this.active === 4) {
      //       return;
      //     } else {
      //       this.active = this.active + stepNumber;
      //     }
      //   }
      if (this.active === 1) {
        if (this.tableData[this.labelStatus1].length === 0) {
          this.dataSearch(this.labelStatus1);
        } else {
          this.setData(this.labelStatus1);
        }
      }
      if (this.active === 2) {
        this.dataSearch(2);
      }
      if (this.active === 3) {
        if (this.tableData[this.labelStatus3].length === 0) {
          this.dataSearch(this.labelStatus3);
        } else {
          this.setData(this.labelStatus3);
        }
      }
      if (this.active === 4) {
        this.dataSearch(5);
      }
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
::v-deep .colDialogVisible1 {
  .el-form-item {
    margin-bottom: 10px;
  }
}
.title1 {
  font-size: 20px;
}
::v-deep .el-steps {
  min-width: 800px;
  display: flex;
}
</style>
