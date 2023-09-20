<!--入库处理-->
<template>
  <div class="APSContainer" v-loading="adminLoading">
    <div class="admin_head" ref="headRef">
      <ComSearch
        ref="searchRef"
        :searchData="formSearchs[0].datas"
        :searchForm="formSearchs[0].forms"
        :remark="0"
        :isLoading="isLoading"
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
              <el-button type="primary" size="mini" @click="openDrawer"
                >新增</el-button
              >
              <el-divider direction="vertical"></el-divider>
              <el-tooltip
                class="item"
                effect="dark"
                content="刷新"
                placement="bottom"
              >
                <span class="right_icon">
                  <span
                    @click="refrshPage"
                    role="img"
                    aria-label="redo"
                    class="anticon anticon-redo icon_size"
                    ><svg
                      class=""
                      data-icon="redo"
                      width="1em"
                      height="1em"
                      fill="currentColor"
                      aria-hidden="true"
                      viewBox="64 64 896 896"
                      focusable="false"
                    >
                      <path
                        d="M758.2 839.1C851.8 765.9 912 651.9 912 523.9 912 303 733.5 124.3 512.6 124 291.4 123.7 112 302.8 112 523.9c0 125.2 57.5 236.9 147.6 310.2 3.5 2.8 8.6 2.2 11.4-1.3l39.4-50.5c2.7-3.4 2.1-8.3-1.2-11.1-8.1-6.6-15.9-13.7-23.4-21.2a318.64 318.64 0 01-68.6-101.7C200.4 609 192 567.1 192 523.9s8.4-85.1 25.1-124.5c16.1-38.1 39.2-72.3 68.6-101.7 29.4-29.4 63.6-52.5 101.7-68.6C426.9 212.4 468.8 204 512 204s85.1 8.4 124.5 25.1c38.1 16.1 72.3 39.2 101.7 68.6 29.4 29.4 52.5 63.6 68.6 101.7 16.7 39.4 25.1 81.3 25.1 124.5s-8.4 85.1-25.1 124.5a318.64 318.64 0 01-68.6 101.7c-9.3 9.3-19.1 18-29.3 26L668.2 724a8 8 0 00-14.1 3l-39.6 162.2c-1.2 5 2.6 9.9 7.7 9.9l167 .8c6.7 0 10.5-7.7 6.3-12.9l-37.3-47.9z"
                      ></path></svg
                  ></span>
                </span>
              </el-tooltip>
              <el-divider direction="vertical"></el-divider>
              <el-tooltip effect="dark" content="列设置" placement="bottom">
                <span class="right_icon">
                  <span
                    role="img"
                    aria-label="setting"
                    class="anticon anticon-setting icon_size"
                    ><svg
                      class=""
                      data-icon="setting"
                      width="1em"
                      height="1em"
                      fill="currentColor"
                      aria-hidden="true"
                      viewBox="64 64 896 896"
                      focusable="false"
                    >
                      <path
                        d="M924.8 625.7l-65.5-56c3.1-19 4.7-38.4 4.7-57.8s-1.6-38.8-4.7-57.8l65.5-56a32.03 32.03 0 009.3-35.2l-.9-2.6a443.74 443.74 0 00-79.7-137.9l-1.8-2.1a32.12 32.12 0 00-35.1-9.5l-81.3 28.9c-30-24.6-63.5-44-99.7-57.6l-15.7-85a32.05 32.05 0 00-25.8-25.7l-2.7-.5c-52.1-9.4-106.9-9.4-159 0l-2.7.5a32.05 32.05 0 00-25.8 25.7l-15.8 85.4a351.86 351.86 0 00-99 57.4l-81.9-29.1a32 32 0 00-35.1 9.5l-1.8 2.1a446.02 446.02 0 00-79.7 137.9l-.9 2.6c-4.5 12.5-.8 26.5 9.3 35.2l66.3 56.6c-3.1 18.8-4.6 38-4.6 57.1 0 19.2 1.5 38.4 4.6 57.1L99 625.5a32.03 32.03 0 00-9.3 35.2l.9 2.6c18.1 50.4 44.9 96.9 79.7 137.9l1.8 2.1a32.12 32.12 0 0035.1 9.5l81.9-29.1c29.8 24.5 63.1 43.9 99 57.4l15.8 85.4a32.05 32.05 0 0025.8 25.7l2.7.5a449.4 449.4 0 00159 0l2.7-.5a32.05 32.05 0 0025.8-25.7l15.7-85a350 350 0 0099.7-57.6l81.3 28.9a32 32 0 0035.1-9.5l1.8-2.1c34.8-41.1 61.6-87.5 79.7-137.9l.9-2.6c4.5-12.3.8-26.3-9.3-35zM788.3 465.9c2.5 15.1 3.8 30.6 3.8 46.1s-1.3 31-3.8 46.1l-6.6 40.1 74.7 63.9a370.03 370.03 0 01-42.6 73.6L721 702.8l-31.4 25.8c-23.9 19.6-50.5 35-79.3 45.8l-38.1 14.3-17.9 97a377.5 377.5 0 01-85 0l-17.9-97.2-37.8-14.5c-28.5-10.8-55-26.2-78.7-45.7l-31.4-25.9-93.4 33.2c-17-22.9-31.2-47.6-42.6-73.6l75.5-64.5-6.5-40c-2.4-14.9-3.7-30.3-3.7-45.5 0-15.3 1.2-30.6 3.7-45.5l6.5-40-75.5-64.5c11.3-26.1 25.6-50.7 42.6-73.6l93.4 33.2 31.4-25.9c23.7-19.5 50.2-34.9 78.7-45.7l37.9-14.3 17.9-97.2c28.1-3.2 56.8-3.2 85 0l17.9 97 38.1 14.3c28.7 10.8 55.4 26.2 79.3 45.8l31.4 25.8 92.8-32.9c17 22.9 31.2 47.6 42.6 73.6L781.8 426l6.5 39.9zM512 326c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm79.2 255.2A111.6 111.6 0 01512 614c-29.9 0-58-11.7-79.2-32.8A111.6 111.6 0 01400 502c0-29.9 11.7-58 32.8-79.2C454 401.6 482.1 390 512 390c29.9 0 58 11.6 79.2 32.8A111.6 111.6 0 01624 502c0 29.9-11.7 58-32.8 79.2z"
                      ></path></svg
                  ></span>
                </span>
              </el-tooltip>
            </el-col>
          </el-row>
        </div>
        <ComVxeTable
          :rowKey="'RowNumber'"
          :height="height"
          :tableData="tableData[0]"
          :tableHeader="tableColumns[0]"
          :tableLoading="tableLoading[0]"
          :remark="0"
          :sysID="3006"
          :isEdit="true"
          :isClear="isClear[0]"
          :pagination="tablePagination[0]"
          @handleRowClick="handleRowClick"
          @pageChange="pageChange"
          @editRow="editRow"
          @pageSize="pageSize"
          @sortChange="sortChange"
        />
      </div>
    </div>
    <el-dialog
      class="newAddDialog"
      :visible.sync="dialogShow"
      :custom-class="customDialog"
      :modal-append-to-body="false"
      :modal="false"
    >
      <span slot="title" class="dialog-footer">
        <span>{{ dialogHeader }}</span>
        <i class="el-icon-zoom-in dialog_icon" @click="changeWidth" />
      </span>
      <el-container>
        <span class="content_head">入库单</span>
        <GeneralForm
          class="formStyle"
          ref="ruleForm0"
          :rule-form="ruleForm0"
          :form-controller="formController0"
          :rules="rules0"
          @editWarehouse="editWarehouse"
        ></GeneralForm>
        <div class="hr-line-dashed" />
        <el-main>
          <div class="content_main_head">
            <el-button @click="openGoodsDialog" size="small" class="orange_btn"
              >选择添加商品</el-button
            >

            <el-button @click="fillWarehouse" size="small" class="green_btn"
              >填充仓库</el-button
            >
          </div>
          <ComVxeTable
            ref="addPurchaseRequisition"
            :rowKey="'RowNumber'"
            :has-select="true"
            :height="tableHeight2"
            :tableData="tableData[1]"
            :tableHeader="tableColumns[1]"
            :tableLoading="tableLoading[1]"
            :remark="1"
            :sysID="1204"
            :isEdit="true"
            @lookStock="lookStock"
            @delRow="delRow"
            :isClear="isClear[1]"
            :showPagination="false"
            @selectfun="selectFun"
            @computedmoney="computedmoney"
          />
          <el-input
            type="textarea"
            placeholder="暂无备注信息"
            rows="2"
            v-model="ruleForm0.Remark1"
          />
          <span class="footer_span">制单人：{{ userInfo.Name }}</span>
        </el-main>
        <el-footer class="footer">
          <el-button size="small" @click="dialogShow = false">取消</el-button>

          <el-button
            size="small"
            type="primary"
            @click="submitData(0)"
            v-show="this.ruleForm0.OperationStatus != 2"
            >保存草稿</el-button
          >
          <el-button
            size="small"
            type="success"
            @click="submitData(2)"
            v-show="this.ruleForm0.OperationStatus == 0"
            >提交入库</el-button
          >
          <el-button
            class="green_btn"
            size="small"
            type=""
            v-show="editTag == 1"
            @click="printData"
            :loading="printLoading"
            >打印</el-button
          >
          <!-- <el-button
            class="green_btn"
            size="small"
            type=""
            v-show="editTag == 1"
            @click="GetPrintProgramCodes"
          >新版打印</el-button> -->
        </el-footer>
      </el-container>
      <GoodsDialog
        @addGoods="addGoods"
        :GoodsDialog="GoodsDialog"
        :appendToBody="true"
        @cancel="cancel"
        @toGoodsPage="toGoodsPage"
      ></GoodsDialog>
    </el-dialog>

    <div :class="showBox ? 'active_box dialog_box' : 'error_box dialog_box'">
      <div class="box_head flex_row_end">
        <i class="el-icon-close red" @click="showBox = false"></i>
      </div>
      <div class="box_content">
        <ComVxeTable
          :rowKey="'RowNumber'"
          :height="'730px'"
          :tableData="tableData[2]"
          :tableHeader="tableColumns[2]"
          :tableLoading="tableLoading[2]"
          :remark="2"
          :sysID="3012"
          :isClear="isClear[2]"
          :showPagination="false"
        />
      </div>
      <div class="box_footer"></div>
    </div>
    <lodop ref="lodop" />
  </div>
</template>

<script>
var _this;
import lodop from "@/components/Lodop/index";
import ComSearch from "@/components/ComSearch";
import ComVxeTable from "@/components/ComVxeTable";
import GoodsDialog from "@/components/Dialog/Goods";
import GeneralForm from "@/components/GeneralForm";
import {
  GetHeader,
  GetSearchData,
  ExportData,
  SaveData,
  printTemplateData,
  GetPrintProgramCodes,
} from "@/api/Common";
import { status } from "nprogress";
export default {
  name: "IsssuanceInfo",
  components: {
    ComSearch,
    ComVxeTable,
    GeneralForm,
    GoodsDialog,
    lodop,
  },
  data() {
    return {
      //////////////弹框数据///////////
      printLoading: false,
      editTag: 0,
      showBox: false,
      dialogHeader: "新建入库单",
      dialogShow: false,
      selectionData: [[], [], []],
      adminLoading: false,
      ruleForm0: {
        dicID: 3006,
        ReceiptID: "",
        Remark1: "",
        ReceiptDate:
          new Date().getFullYear() +
          "-" +
          (new Date().getMonth() + 1) +
          "-" +
          new Date().getDate(),
        SupplierID: "",
        DeliveryID: "",
      },
      suppliers: [],
      warehouses: [],
      formController0: [
        {
          label: "单号",
          prop: "ReceiptID",
          component: {
            type: "input",
          },
          disabled: false,
        },
        {
          label: "收货单号",
          prop: "DeliveryID",
          component: {
            type: "input",
          },
          disabled: true,
        },
        {
          label: "收货日期",
          prop: "ReceiptDate",
          component: {
            type: "date",
          },
          disabled: false,
        },
        {
          label: "供应商",
          prop: "SupplierID",
          component: {
            type: "select",
          },
          select: [],
          disabled: false,
        },
        // {
        //   label: "仓库",
        //   prop: "WarehouseID",
        //   component: {
        //     type: "select",
        //   },
        //   methods: "editWarehouse",
        //   select: [],
        //   disabled: false,
        // },
      ],
      rules0: {
        ReceiptDate: [
          { required: true, message: "送货日期必填！", trigger: "change" },
        ],
        SupplierID: [
          { required: true, message: "供应商必填！", trigger: "change" },
        ],
      },
      GoodsDialog: false,
      tableHeight2: document.documentElement.clientHeight - 520 + "px",
      ////////////////// Search /////////////////
      title: this.$route.meta.title,
      drawer: false,
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
        {
          datas: {},
          forms: [],
        },
      ],
      btnForm: [
        {
          ButtonCode: "save",
          BtnName: "保存",
          isLoading: false,
          Methods: "dataSave",
          Type: "success",
          Icon: "",
          Size: "small",
        },
        {
          ButtonCode: "delete",
          BtnName: "删除",
          isLoading: false,
          Methods: "dataDel",
          Type: "danger",
          Icon: "",
          Size: "small",
          Params: { dataName: "delData" },
        },
      ],
      customDialog: "oneStyle",
      tableData: [[], [], []],
      tableColumns: [[], [], []],
      tableLoading: [false, false, false],
      isClear: [false, false, false],
      tablePagination: [
        { pageIndex: 1, pageSize: 50, pageTotal: 0 },
        { pageIndex: 1, pageSize: 50, pageTotal: 0 },
        { pageIndex: 1, pageSize: 400, pageTotal: 0 },
      ],
      height: "707px",
      showPagination: true,
      tagRemark: 0,
      isLoading: false,
      templateData: [],
      Warehouses: [],
    };
  },
  watch: {
    $route: {
      handler: function (val, oldVal) {
        // this.$set(this,'btnForm',val.meta.btns);
      },
      // 深度观察监听
      deep: true,
    },
  },
  created() {
    _this = this;
    this.userInfo = this.$store.getters.userInfo;
    this.getSupplierData();
    this.getWarehouseData();
    this.getTableHeader();
  },
  mounted() {
    setTimeout(() => {
      this.setHeight();
    }, 450);
  },
  methods: {
    // 获取供应商
    async getSupplierData() {
      let res = await GetSearchData({ dicID: 1198 });
      const { result, data, count, msg } = res.data;
      if (result) {
        if (data.length != 0) {
          data.forEach((x) => {
            x["label"] = x.SupplierName;
            x["value"] = x.SupplierID;
          });
        }
        this.formController0[3].select = data;
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
    },
    // 获取仓库
    async getWarehouseData() {
      let res = await GetSearchData({ dicID: 80 });
      const { result, data, count, msg } = res.data;
      if (result) {
        if (data.length != 0) {
          data.forEach((x) => {
            x["label"] = x.WarehouseName;
            x["value"] = x.WarehouseID;
          });
        }
        this.Warehouses = data;
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
    },
    // 高度控制
    setHeight() {
      let headHeight = this.$refs.headRef.offsetHeight;

      let rem =
        document.documentElement.clientHeight -
        headHeight -
        this.$store.getters.reduceHeight;
      let newHeight = rem + "px";
      this.$set(this, "height", newHeight);
    },
    // 第几页
    pageChange(val, remarkTb, filtertb) {
      this.$set(this.tablePagination[remarkTb], "pageIndex", val);
      this.getTableData(this.formSearchs[remarkTb].datas, remarkTb);
    },
    // 页数
    pageSize(val, remarkTb, filtertb) {
      this.$set(this.tablePagination[remarkTb], "pageSize", val);
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
        if (order === "desc") {
          this.formSearchs[remarkTb].datas["sort"] = prop + " DESC";
        } else {
          this.formSearchs[remarkTb].datas["sort"] = prop + " ASC";
        }
      } else {
        this.formSearchs[remarkTb].datas["sort"] = null;
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
        if (name != "dicID") {
          this.formSearchs[remarkTb].datas[name] = null;
        }
      }
    },
    // 导出
    async dataExport(remarkTb) {
      this.adminLoading = true;
      let form = JSON.parse(JSON.stringify(this.formSearchs[remarkTb].datas));
      form["rows"] = 0;
      let res = await ExportData(form);
      this.adminLoading = false;
      this.$store.dispatch("user/exportData", res.data);
    },
    // 删除
    async dataDel(remarkTb, index, parms) {
      let res = null;
      let newData = [];
      if (parms && parms.dataName) {
        if (this[parms.dataName][remarkTb].length == 0) {
          this.$message.error("请单击需要操作的数据！");
          return;
        } else {
          this[parms.dataName][remarkTb].forEach((x) => {
            let obj = x;
            obj["ElementDeleteFlag"] = 1;
            newData.push(obj);
          });
        }
      } else {
        this.tableData[remarkTb].forEach((y) => {
          let obj2 = y;
          obj2["ElementDeleteFlag"] = 1;
          newData.push(obj2);
        });
      }
      this.$confirm("确定要删除的【" + newData.length + "】数据吗？")
        .then((_) => {
          _this.$set(_this.btnForm[index], "isLoading", true);
          _this.dataSave(remarkTb, index, null, newData);
        })
        .catch((_) => {});
    },
    // 单击行
    handleRowClick(row, remarkTb) {
      this.delData[remarkTb] = [];
      this.delData[remarkTb].push(row);
    },
    // 查看库存
    lookStock() {
      this.showBox = true;
      this.formSearchs[2].datas.MaterialID = row.MaterialID;
      this.dataSearch(2);
    },
    // 编辑行
    async editRow(row) {
      this.editTag = 1;
      this.dialogShow = true;
      for (var name in row) {
        this.ruleForm0[name] = row[name];
      }
      // 查询子入货数据
      this.$set(this.tableData, 1, []);
      let res = await GetSearchData({ dicID: 1204, ReceiptID: row.ReceiptID });
      const { result, data, count, msg } = res.data;
      if (result) {
        this.$set(this.tableData, 1, data);
        this.templateData = JSON.parse(JSON.stringify(data));
        this.$set(this.tablePagination[1], "pageTotal", count);
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
    },
    // 删除
    delRow(row, val, prop, index) {
      this.tableData[1].splice(index, 1);
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
          type: "success",
          dangerouslyUseHTMLString: true,
        });
        this.dataSearch(remarkTb);
      } else {
        this.adminLoading = false;
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
    },
    // 获取表头数据
    async getTableHeader() {
      let IDs = [{ ID: 3006 }, { ID: 1204 }, { ID: 3012 }];
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
          this.$set(this.formSearchs[z].datas, "dicID", IDs[z].ID);
          x.forEach((y) => {
            if (y.prop && y.value) {
              this.$set(this.formSearchs[z].datas, [y.prop], y.value);
            } else {
              this.$set(this.formSearchs[z].datas, [y.prop], "");
            }
          });
          this.$set(this.formSearchs[z], "forms", x);
        });
        let obj = {
          label: "操作",
          width: "120",
          prop: "Operation",
          button: [
            { name: "查看库存", methods: "lookStock", type: "primary" },
            { name: "删除", methods: "delRow", type: "danger" },
          ],
        };
        this.tableColumns[1].push(obj);
        this.getTableData(this.formSearchs[0].datas, 0);
      }
    },
    // 验证数据
    verifyDta(n) {
      for (let name in n) {
        if (
          (name == "component" && n[name]) ||
          (name == "button" && n[name]) ||
          (name == "active" && n[name])
        ) {
          n[name] = eval("(" + n[name] + ")");
        }
      }
    },
    // 获取表格数据
    async getTableData(form, remarkTb) {
      this.$set(this.tableLoading, remarkTb, true);
      form["rows"] = this.tablePagination[remarkTb].pageSize;
      form["page"] = this.tablePagination[remarkTb].pageIndex;
      let res = await GetSearchData(form);
      const { result, data, count, msg } = res.data;
      if (result) {
        this.$set(this.tableData, remarkTb, data);
        this.$set(this.tablePagination[remarkTb], "pageTotal", count);
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
      this.$set(this.tableLoading, remarkTb, false);
    },
    // 点击新增菜单或按钮
    openDrawer() {
      this.editTag = 0;
      this.$set(this.tableData, 1, []);
      for (let name in this.ruleForm0) {
        this.ruleForm0[name] = "";
      }
      this.ruleForm0["RowNumber"] = "12";
      this.ruleForm0["ReceiptDate"] =
        new Date().getFullYear() +
        "-" +
        (new Date().getMonth() + 1) +
        "-" +
        new Date().getDate();
      this.dialogShow = true;
    },
    // 弹框确定添加
    async dialogBtnClick(val) {
      if (val) {
        let res = await SaveData([this.formData]);
        const { result, data, count, msg } = res.data;
        if (result) {
          this.$message({
            message: msg,
            type: "success",
            dangerouslyUseHTMLString: true,
          });
          this.dataSearch(0);
          _this.$refs.btnForm.$refs.formData.resetFields();
        } else {
          this.$message({
            message: msg,
            type: "error",
            dangerouslyUseHTMLString: true,
          });
          _this.$refs.btnForm.$refs.formData.resetFields();
        }
        this.dialogShow = false;
      } else {
        _this.$refs.btnForm.$refs.formData.resetFields();
        _this.dialogShow = false;
      }
    },
    // 刷新页面
    refrshPage() {
      this.$store.dispatch("tagsView/delCachedView", this.$route).then(() => {
        const { fullPath } = this.$route;
        this.$nextTick(() => {
          this.$router.replace({
            path: "/redirect" + fullPath,
          });
        });
      });
    },
    //////////////////////弹框事件///////////
    // 通用放大弹框
    changeWidth() {
      if (this.customDialog === "oneStyle") {
        this.customDialog = "twoStyle";
      } else {
        this.customDialog = "oneStyle";
      }
    },
    //选择商品
    openGoodsDialog() {
      this.GoodsDialog = true;
    },
    // 为选中的数据填充仓库
    fillWarehouse() {
      if (this.ruleForm0.WarehouseID) {
        if (this.selectionData[1].length != 0) {
          this.selectionData[1].forEach((x) => {
            this.$set(x, "WarehouseID", this.ruleForm0.WarehouseID);
            this.$set(x, "WarehouseName", this.ruleForm0.WarehouseName);
          });
        } else {
          this.$message.error("请先勾选需要填充仓库的数据！");
        }
      } else {
        this.$message.error("请先选择仓库！");
      }
    },
    // 选择仓库
    editWarehouse(val) {
      let newIndex = this.warehouses.findIndex((x) => x.WarehouseID == val);
      this.ruleForm0.WarehouseName = this.warehouses[newIndex].label;
      this.tableData[2].forEach((m) => {
        m.WarehouseID = val;
      });
    },
    //添加商品
    addGoods(val) {
      let data = val.Selection;
      this.GoodsDialog = val.GoodsDialog;
      if (data != null) {
        data.forEach((m) => {
          m["update"] = true;
          m["ReceiptDetailID"] = "";
          m["所有仓库"] = this.Warehouses;
          this.tableData[1].push(m);
          // let newIndex = this.tableData[1].findIndex(
          //   (x) => x.MaterialID == m.MaterialID
          // );
          // if (newIndex == -1) {
          //   m["update"] = true;
          //   m["ReceiptDetailID"] = "";
          //   m["所有仓库"] = this.formController0[4].select;
          //   this.tableData[1].push(m);
          // }
        });
      }
    },
    //新增商品跳转至商品信息页面
    toGoodsPage() {
      this.$router.push({
        name: "ProductInfo",
      });
      this.GoodsDialog = false;
    },
    //取消商品
    cancel(val) {
      this.GoodsDialog = val;
    },
    // 删除新添加的商品
    deleteNewAdd(row, val, prop, index) {
      if (this.sign == 1) {
        if (row.RequisitionID != null) {
          let DelRequisitionProducts = JSON.parse(
            localStorage.getItem("DelRequisitionProducts")
          );
          DelRequisitionProducts.push(row);
          localStorage.setItem(
            "DelRequisitionProducts",
            JSON.stringify(DelRequisitionProducts)
          );
          this.newTableData.splice(index, 1);
        }
      } else {
        this.newTableData.splice(index, 1);
      }
    },
    // 选择数据
    selectFun(data, remarkTb, row) {
      this.selectionData[remarkTb] = data;
    },
    // 保存草稿
    saveDraft() {
      this.$refs.ruleForm0.$refs.ruleForm.validate((valid) => {
        if (valid) {
        } else {
          return false;
        }
      });
    },
    // 提交入库
    submitData(Status) {
      this.$refs.ruleForm0.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let childrens = [];
          let form = this.ruleForm0;
          let submitData = [];
          let flag = "";
          if (_this.editTag == 0) {
            childrens = this.tableData[1];
            if (childrens.length != 0) {
              childrens.forEach((x, y) => {
                x.dicID = 1204;

                if (parseInt(x.ReceiptQty) <= 0) {
                  flag += y + 1 + ",";
                }
                if (x.ReceiptQty) {
                } else {
                  flag += y + 1 + ",";
                }
              });
            }
          } else {
            if (_this.tableData[1].length != 0) {
              let newData1 = [];
              let newData2 = [];
              let newData3 = [];
              _this.tableData[1].forEach((x, y) => {
                if (!x.ReceiptDetailID) {
                  x.ReceiptID = this.ruleForm0.ReceiptID;

                  x.dicID = 1204;
                  newData1.push(x);
                } else {
                  newData1.push(x);
                }

                if (parseInt(x.ReceiptQty) <= 0) {
                  flag += y + 1 + ",";
                }
                if (x.ReceiptQty) {
                } else {
                  flag += y + 1 + ",";
                }
              });
              newData2 = _this.templateData.filter(
                (c) =>
                  !_this.tableData[1].some(
                    (z) => c.ReceiptDetailID == z.ReceiptDetailID
                  )
              ); //删除

              if (newData2.length != 0) {
                newData2.forEach((o) => {
                  o["ElementDeleteFlag"] = 1;
                });
              }

              childrens = newData1.concat(newData2);
            } else {
              // 有的数据全部删除
              if (_this.templateData.length == 0) {
                _this.$message.error("暂无可提交的数据！");
              } else {
                _this.templateData.forEach((g) => {
                  g["ElementDeleteFlag"] = 1;
                });
                childrens = childrens.concat(_this.templateData);
              }
            }
          }
          if (flag && Status == 2) {
            _this.$message.error("第" + flag.trimEnd(",") + "重量不能为空");
          } else {
            form["dicID"] = 3006;
            form["OperationStatus"] = Status;
            form["childrens"] = childrens;
            submitData.push(form);
            _this.dataSave(0, 0, 0, submitData);
            _this.dialogShow = false;
          }
        } else {
          return false;
        }
      });
    },
    // 打印
    async printData() {
      // let res = await SaveData([this.formData]);
      // const { result, data, count, msg } = res.data;
      // if (result) {
      //   this.$refs["lodop"].ProgramCodesTMP = Result;
      //   this.$refs["lodop"].printPreview();
      // } else {
      //   this.$message({
      //     message: msg,
      //     type: "error",
      //     dangerouslyUseHTMLString: true,
      //   });
      // }

      let obj = {
        row: 0,
        page: 1,
        form: this.ruleForm0,
        dicID: 1204,
        TemplateID: "P004",
        ReceiptID: this.ruleForm0.ReceiptID,
      };
      this.printLoading = true;
      let res = await printTemplateData(obj);
      let t = _this;
      const { js, msg, result } = res.data;
      if (result) {
        this.printLoading = false;
        this.$refs["lodop"].ProgramCodesTMP = js;
        this.$refs["lodop"].printPreview();
      } else {
        this.printLoading = false;
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
    },

    // 打印新模板
    async GetPrintProgramCodes() {
      let res = await GetPrintProgramCodes({
        ID: this.ruleForm0.ReceiptID,
        ProjectCode: "P001",
        TemplateCode: "T001",
      });
      const { data, result } = res.data;
      debugger;
      if (result) {
        this.$refs["lodop"].ProgramCodesTMP = data;
        this.$refs["lodop"].printPreview();
      }
    },
    // 维护单价自动计算金额
    computedmoney(row, val, prop, index) {
      if (row.Price && row.ReceiptQty) {
        let money = "";
        money = parseFloat(row.Price) * parseFloat(row.ReceiptQty);
        this.$set(row, "TotalPrice", money);
      } else {
        this.$set(row, "TotalPrice", "");
      }
    },
  },
};
</script>
<style lang="scss" scoped>
/* 表单弹框 */

.newAddDialog ::v-deep .el-dialog__headerbtn .el-dialog__close {
  color: #606266;
}
.newAddDialog ::v-deep .el-dialog__header {
  background: #f8f8f8 !important;
}

.newAddDialog ::v-deep .el-dialog__body {
  background: #f3f3f4;
  padding: 10px 10px;
  z-index: 3;
}

.newAddDialog ::v-deep .el-container {
  height: 780px;
  overflow: auto;
  background: #fff;
}

.newAddDialog {
  .dialog_icon {
    float: right;
    margin-right: 30px;
    margin-top: 4px;
    cursor: pointer;
  }

  .content_head {
    display: block;
    text-align: center;
    height: 40px;
    width: 100%;
    font-size: 24px;
    color: black;
    margin-top: 5px;
  }

  ::v-deep .el-main {
    padding: 0 20px;
  }

  .content_main_head {
    clear: both;
    width: 100%;
    height: 40px;
    line-height: 40px;
  }

  .footer_span {
    height: 40px;
    display: block;
    padding-top: 10px;
  }

  .footer {
    background: #f5f5f5;
    line-height: 70px;
    text-align: right;
  }
}

.APSContainer ::v-deep .el-dialog__wrapper {
  z-index: 80 !important;
}

.hr-line-dashed {
  border-top: 1px dashed #e7eaec;
  color: #ffffff;
  background-color: #ffffff;
  height: 1px;
}

.orange_btn {
  background: #f7a54a;
  border: 1px solid #f7a54a;
  color: #fff;
}

.green_btn {
  background: #21b9bb;
  border: 1px solid #21b9bb;
  margin-left: 10px;
  color: #fff;
}
.formStyle {
  ::v-deep .el-form-item {
    width: 24%;
    float: left;
    display: flex;
    align-items: center;
  }
}
</style>
