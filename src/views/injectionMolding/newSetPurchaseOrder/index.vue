<!--入库处理-->
<template>
  <div
    class="container"
    v-loading="adminLoading"
  >
    <div
      class="admin_head"
      ref="headRef"
    >
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
            <el-col :span="4"><span class="title">{{ title }}</span></el-col>
            <el-col
              :span="20"
              class="flex_flex_end"
            >
              <el-button
                type="primary"
                size="mini"
                @click="openDrawer"
              >新增</el-button>
              <el-divider direction="vertical"></el-divider>
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
          :sysID="sysID[0].ID"
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
      <span
        slot="title"
        class="dialog-footer"
      >
        <span>{{ dialogHeader }}</span>
        <i
          class="el-icon-zoom-in dialog_icon"
          @click="changeWidth"
        />
      </span>
      <el-container>
        <span class="content_head">{{dialogHeader}}</span>
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
            <el-button
              @click="openGoodsDialog"
              size="small"
              class="orange_btn"
            >选择添加商品</el-button>
          </div>
          <ComVxeTable
            ref="addPurchaseRequisition"
            :rowKey="'RowNumber'"
            :height="tableHeight2"
            :tableData="tableData[1]"
            :tableHeader="tableColumns[1]"
            :tableLoading="tableLoading[1]"
            :remark="1"
            :sysID="sysID[1].ID"
            :isEdit="true"
            @delRow="delRow"
            :isClear="isClear[1]"
            :showPagination="false"
            @selectfun="selectFun"
          />
          <el-input
            type="textarea"
            placeholder="暂无备注信息"
            rows="2"
            v-model="ruleForm0.Remark1"
          />
          <span class="footer_span">制单人：{{userInfo.Name}}</span>
        </el-main>
        <el-footer class="footer">
          <el-button
            size="small"
            @click="dialogShow = false"
          >取消</el-button>
          <el-button
            size="small"
            type="success"
            @click="submitData"
          >提交</el-button>
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
export default {
  name: "newSetPurchaseOrder",
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
      dialogHeader: "新建订单",
      dialogShow: false,
      selectionData: [[], [], []],
      adminLoading: false,
      ruleForm0: {
        dicID: 7948,
        SalesOrderID: "",
        PODocNo: "",
        PurchaseDate: "",
      },
      suppliers: [],
      warehouses: [],
      formController0: [
        {
          label: "录入日期",
          prop: "PurchaseDate",
          component: {
            type: "date",
          },
          disabled: false,
        },
        {
          label: "采购单号",
          prop: "PODocNo",
          component: {
            type: "input",
          },
          disabled: false,
        },
        {
          label: "客户",
          prop: "CustomerID",
          component: {
            type: "select",
          },
          select: [],
          disabled: false,
        },
      ],
      rules0: {
        PurchaseDate: [
          { required: true, message: "下单日期必填！", trigger: "change" },
        ],
        PODocNo: [
          { required: true, message: "采购单号必填！", trigger: "blur" },
        ],
      },
      GoodsDialog: false,
      tableHeight2: document.documentElement.clientHeight - 520 + "px",
      ////////////////// Search /////////////////
      title: "采购列表",
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
        { pageIndex: 1, pageSize: 50, pageTotal: 0 },
      ],
      height: "707px",
      showPagination: true,
      tagRemark: 0,
      isLoading: false,
      templateData: [],
      sysID: [{ ID: 7948 }, { ID: 5100 }],
      currentRow: {},
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
    this.getTableHeader();
    this.getCustomer();
  },
  mounted() {
    setTimeout(() => {
      this.setHeight();
    }, 450);
  },
  methods: {
    // 获取供应商
    async getCustomer() {
      let res = await GetSearchData({ dicID: 32 });
      const { result, data, count, msg } = res.data;
      debugger;
      if (result) {
        if (data.length != 0) {
          data.forEach((x) => {
            x["label"] = x.CustomerName;
            x["value"] = x.CustomerID;
          });
        }
        this.formController0[2].select = data;
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
        this.formController0[4].select = data;
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
    // 编辑行
    async editRow(row) {
      this.editTag = 1;
      this.dialogShow = true;
      this.dialogHeader = "编辑订单";
      for (var name in row) {
        this.ruleForm0[name] = row[name];
      }
      // 查询子入货数据
      this.$set(this.tableData, 1, []);
      this.$set(this.tableLoading, 1, true);

      let res = await GetSearchData({
        dicID: 49,
        SalesOrderID: row.SalesOrderID,
      });
      const { result, data, count, msg } = res.data;
      if (result) {
        this.$set(this.tableData, 1, data);
        this.$set(this.tableLoading, 1, false);
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
      this.adminLoading = true;
      let res = "";
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
        _this.dialogShow = false;
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
      let IDs = this.sysID;
      let res = await GetHeader(IDs);
      const { datas, forms, result, msg } = res.data;
      if (result) {
        // 获取每个表头
        datas.some((m, i) => {
          m.forEach((n) => {
            // 进行验证
            this.verifyDta(n);
            if (n.childrens && n.children.length != 0) {
              n.childrens.forEach((x) => {
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
            {
              name: "删除",
              methods: "delRow",
              type: "danger",
              condition: (row) => {
                row.ProductionStatus == 21 || row.ProductionStatus == 26;
              },
            },
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
        if (remarkTb == 2) {
          _this.selectionData[2] = [];
          if (_this.currentRow.BomData.length != 0) {
            _this.tableData[2].forEach((a) => {
              let newIndex = _this.currentRow.BomData.findIndex(
                (b) => b.MaterialID == a.MaterialID
              );
              if (newIndex != -1) {
                for (var name in _this.currentRow.BomData[newIndex]) {
                  _this.$set(a, name, _this.currentRow.BomData[newIndex][name]);
                }
                _this.$set(a, "update", true);
                _this.$nextTick(() => {
                  _this.$refs.tableRef_3.$refs.vxeTable.setCheckboxRow(a, true);
                  _this.selectionData[2].push(a);
                });
              }
            });
          }
          // if (this.editTag == 0) {
          //   // 新配置配方

          // } else {
          //   // 编辑修改配方
          // }
        }
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
      this.ruleForm0["PurchaseDate"] =
        new Date().getFullYear() +
        "-" +
        (new Date().getMonth() + 1) +
        "-" +
        new Date().getDate();
      this.dialogShow = true;
      this.dialogHeader = "新增订单";
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
          this.dialogShow = false;
        } else {
          this.$message({
            message: msg,
            type: "error",
            dangerouslyUseHTMLString: true,
          });
          _this.$refs.btnForm.$refs.formData.resetFields();
        }
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
    },
    //添加商品
    addGoods(val) {
      let data = val.Selection;
      this.GoodsDialog = val.GoodsDialog;
      if (data != null) {
        data.forEach((m) => {
          m["update"] = true;
          m["BomData"] = [];
          m["RealyBOMData"] = [];
          this.tableData[1].push(m);
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
        if (row.SalesOrderDetailID != null) {
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
          let newData1 = [];
          let newData2 = [];
          let newData3 = [];
          let newData4 = []; // 保存配方的
          let form = _this.ruleForm0;
          let submitData = [];
          let flag = 0;
          if (_this.editTag == 0) {
            // 新增
            if (_this.tableData[1].length != 0) {
              _this.tableData[1].some((a) => {
                if (!a.POQty || parseFloat(a.POQty) <= 0) {
                  flag = 1;
                  return true;
                }
                let obj1 = JSON.parse(JSON.stringify(a));
                obj1["POQty"] = a.POQty;
                obj1["dicID"] = 5100;
                obj1["MaterialID"] = a.MaterialID;
                childrens.push(obj1);
              });
            }
          } else {
            // 编辑
            if (_this.tableData[1].length != 0) {
              _this.tableData[1].some((a) => {
                if (!a.POQty || parseFloat(a.POQty) <= 0) {
                  flag = 1;
                  return true;
                }
                if (!a.PODocID) {
                  let obj1 = JSON.parse(JSON.stringify(a));
                  obj1.ID = "";
                  obj1.dicID = 5100;
                  obj1["MaterialID"] = a.MaterialID;
                  obj1["POQty"] = a.POQty;
                  newData1.push(obj1);
                } else {
                  let obj2 = JSON.parse(JSON.stringify(a));
                  obj2.ID = a.ID;
                  obj2.dicID = 5100;
                  obj2.POQty = a.POQty;
                  newData3.push(obj2);
                }
              });
              newData2 = _this.templateData.filter(
                (c) => !_this.tableData[1].some((z) => c.ID == z.ID)
              ); //删除

              if (newData2.length != 0) {
                newData2.forEach((o) => {
                  o["ElementDeleteFlag"] = 1;
                });
              }

              childrens = newData1.concat(newData2);
            } else {
              _this.$message.error("没有需要提交的数据！");
              return;
            }
          }
          if (flag == 1) {
            _this.$message.error("含有未填数量的数据，请检查一下！");
          } else {
            form["dicID"] = _this.sysID[0].ID;
            form["childrens"] = childrens;
            submitData.push(form);
            submitData = submitData.concat(newData3);
            _this.dataSave(0, 0, 0, submitData);
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
        dicID: 49,
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
    // 添加配置
    addConfig() {
      let flag = 0;
      if (this.selectionData[2].length == 0) {
        this.$message.error("请选择要配置的数据！");
      } else {
        this.selectionData[2].some((a) => {
          if (!a.QPA || parseFloat(a.QPA) <= 0) {
            flag = 1;
            return true;
          }
        });
        if (flag == 1) {
          this.$message.error("选择的数据有未填写用量的！");
        } else {
          this.$set(this.currentRow, "BomData", this.selectionData[2]);
          this.$message.success("暂时添加，保存才有效！");
          this.showBox = false;
        }
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
      if (result) {
        this.$refs["lodop"].ProgramCodesTMP = data;
        this.$refs["lodop"].printPreview();
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
  height: 790px;
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

.container ::v-deep .el-dialog__wrapper {
  z-index: 55 !important;
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