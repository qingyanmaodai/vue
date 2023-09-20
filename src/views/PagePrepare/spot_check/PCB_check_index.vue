<!--PCB点检-->
<template>
  <div class="APSContainer" v-loading="adminLoading">
    <div
      ref="content_up"
      :class="
        enlargeType ? 'list_content_up blockClass' : 'list_content_up noneClass'
      "
    >
      <div class="admin_head_2" ref="headRef">
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
          <div class="ant-table-title" ref="headRef_2">
            <el-row>
              <el-col :span="4"
                ><span class="title">{{ title }}</span></el-col
              >
              <el-col :span="20" class="flex_flex_end">
                <div v-for="(item, y) in Status1" :key="y">
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
            :height="'180px'"
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
          />
        </div>
      </div>
    </div>

    <div ref="content_down" class="list_content_down">
      <div>
        <div class="admin_content">
          <div class="ant-table-title">
            <el-row>
              <!-- <el-col :span="1"><span class="title">物料明细</span></el-col> -->
              <el-col :span="24" class="flex_flex_end">
                <span>料号：</span>
                <el-input
                  size="small"
                  v-model="formSearchs[1].datas['Code']"
                  style="width: 140px"
                  @keyup.enter.native="dataSearch(1)"
                ></el-input>
                <el-divider direction="vertical"></el-divider>
                <span>名称：</span>
                <el-input
                  size="small"
                  style="width: 140px"
                  @keyup.enter.native="dataSearch(1)"
                  v-model="formSearchs[1].datas['MaterialName']"
                ></el-input>

                <el-divider direction="vertical"></el-divider>

                <span>规格：</span>
                <el-input
                  size="small"
                  style="width: 140px"
                  v-model="formSearchs[1].datas['Spec']"
                  @keyup.enter.native="dataSearch(1)"
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
                <!-- <el-button
                  type="danger"
                  size="small"
                  @click="clearShort"
                >清空超领</el-button>
                <el-divider direction="vertical"></el-divider> -->
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
                      labelStatus2 == y ? 'statusActive cursor' : 'cursor'
                    "
                    >{{ item.label }}</span
                  >
                  <el-divider direction="vertical"></el-divider>
                </div>
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="expendCollText"
                  placement="top"
                >
                  <span class="right_icon">
                    <img
                      v-show="!expendColl"
                      src="../../../assets/svg/collapse.svg"
                      @click="systolic"
                      style="width: 1.4rem; height: 1.4rem"
                    />
                    <img
                      v-show="expendColl"
                      src="../../../assets/svg/expend.svg"
                      @click="systolic"
                      style="width: 1.4rem; height: 1.4rem"
                    />
                  </span>
                </el-tooltip>
              </el-col>
            </el-row>
          </div>
          <ComVxeTable
            :rowKey="'RowNumber'"
            :height="height"
            :tableData="tableData[1]"
            :tableHeader="tableColumns[1]"
            :tableLoading="tableLoading[1]"
            :remark="1"
            :hasSelect="true"
            :cellStyle="cellStyle"
            :sysID="sysID[1].ID"
            :checCheckboxkMethod="checCheckboxkMethod"
            :isClear="isClear[1]"
            :showPagination="false"
            @pageChange="pageChange"
            @pageSize="pageSize"
            :pagination="tablePagination[1]"
            @sortChange="sortChange"
            @toPage="usingSearch"
            @selectfun="selectFun"
          />
        </div>
      </div>
    </div>

    <el-dialog title="料品可用量查询" :visible.sync="dialogShow" width="50%">
      <div class="APSContainer" style="background-color: #f0f2f5">
        <div class="admin_content">
          库存列表
          <ComReportTable
            :rowKey="'RowNumber'"
            :height="height3"
            :tableData="tableData[2]"
            :tableHeader="tableColumns[2]"
            :tableLoading="tableLoading[2]"
            :remark="2"
            :showFooter="true"
            :includeFields="includeFields[0]"
            :sysID="sysID[2].ID"
            :isClear="isClear[2]"
            :pagination="tablePagination[2]"
            @pageChange="pageChange"
            @pageSize="pageSize"
            @sortChange="sortChange"
          />
        </div>
        <div class="admin_content">
          采购单
          <ComReportTable
            :rowKey="'RowNumber'"
            :height="height3"
            :tableData="tableData[3]"
            :tableHeader="tableColumns[3]"
            :tableLoading="tableLoading[3]"
            :remark="3"
            :sysID="sysID[3].ID"
            :isClear="isClear[3]"
            :showFooter="true"
            :includeFields="includeFields[1]"
            :pagination="tablePagination[3]"
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
import ComSearch from "@/components/ComSearch";
import ComVxeTable from "@/components/ComVxeTable";
import ComReportTable from "@/components/ComReportTable";
import {
  GetHeader,
  GetSearchData,
  ExportData,
  SaveData,
  GetServerTime,
} from "@/api/Common";
export default {
  name: "PCB_check_index",
  components: {
    ComSearch,
    ComVxeTable,
    ComReportTable,
  },
  data() {
    return {
      ////////////////// Search /////////////////
      footerLabel: [""],
      expendColl: false,
      expendCollText: "收缩",
      selectionData: [[], []],
      title: this.$route.meta.title,
      dialogShow: false,
      height2: "240px",
      height3: "180px",
      includeFields: [["ProducedQty", "ConfirmQty"], [], []],
      drawer: false,
      formSearchs: [
        {
          datas: {
            WorkOrderTypeID: "6033a552143a56",
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
      ],
      parmsBtn: [],
      parmsBtn2: [
        {
          ButtonCode: "save",
          BtnName: "保存",
          Type: "success",
          Ghost: true,
          Size: "small",
          Methods: "dataSave",
          Icon: "",
        },
      ],
      btnForm: [],
      btnForm2: [],
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
      height: "707px",
      showPagination: true,
      tagRemark: 0,
      isLoading: false,
      adminLoading: false,
      parseForm: {},
      parseSearch: false,
      warehouseValue: "",
      OrderNo: "",
      OrderNos: [],
      Status1: [
        { label: "全部订单", value: "" },
        { label: "未开始", value: "未开始" },
        { label: "进行中", value: "进行中" },
        { label: "已完成", value: "已完成" },
      ],
      Status2: [
        { label: "全部", value: 0 },
        { label: "未点检", value: 1 },
        { label: "异常", value: 2 },
        { label: "已领未点", value: 3 },
      ],
      labelStatus1: 0,
      labelStatus2: 0,
      sysID: [{ ID: 7975 }, { ID: 7976 }, { ID: 76 }, { ID: 6751 }],
      isEdit: false,
      enlargeType: true,
      rem: "",
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
    this.judgeBtn();
    this.getWarehosueData();
  },
  mounted() {
    setTimeout(() => {
      this.setHeight();
    }, 600);
  },
  methods: {
    // 获取所有仓库
    async getWarehosueData() {
      let form = {};
      form["dicID"] = 80;
      form["rows"] = 0;
      let res = await GetSearchData(form);
      const { result, data, count, msg } = res.data;
      if (result) {
        this.warehouses = data;
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
    },
    //判断按钮权限
    judgeBtn() {
      let routeBtn = this.$route.meta.btns;
      let newBtn = [];
      let newBtn2 = [];
      let permission = false;
      if (routeBtn.length != 0) {
        routeBtn.forEach((x) => {
          if (x.ButtonCode == "edit") {
            permission = true;
          }
          let newData = this.parmsBtn.filter((y) => {
            return x.ButtonCode == y.ButtonCode;
          });
          let newData2 = this.parmsBtn2.filter((y) => {
            return x.ButtonCode == y.ButtonCode;
          });
          if (newData.length != 0) {
            newBtn = newBtn.concat(newData);
          }
          if (newData2.length != 0) {
            newBtn2 = newBtn2.concat(newData2);
          }
        });
      }
      this.$set(this, "btnForm", newBtn);
      this.$set(this, "btnForm2", newBtn2);
      this.$set(this, "isEdit", permission);
    },
    // 高度控制
    setHeight() {
      let headHeight =
        this.$refs.content_up.offsetHeight + this.$refs.content_up.offsetTop;
      let headRef_2 = this.$refs.headRef_2.offsetHeight;
      let rem =
        document.documentElement.offsetHeight - headHeight - headRef_2 - 65;
      this.rem = rem;
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

        // this.formSearchs[0].datas["IsCompleteInspect"] = 0;
        this.formSearchs[0].datas["PrepareStatus"] = 1;
        this.getTableData(this.formSearchs[0].datas, 0);
        this.adminLoading = false;
      }
    },
    // 验证数据
    verifyDta(n) {
      // if (n.prop == "ShortQty") {
      //   return;
      // }
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
        if (remarkTb == 1) {
          if (data.length != 0) {
            data.forEach((a) => {
              this.$set(a, "update", false);
            });
          }
        }
        this.$set(this.tableData, remarkTb, data);
        this.$set(this.tablePagination[remarkTb], "pageTotal", count);
        if (remarkTb == 0) {
          let num2 = 0;
          let Rate = 0;
          if (data.length != 0) {
            data.forEach((x) => {
              if (x.NoInspectStatusCount == 0) {
                num2++;
              }
            });
            if (count != 0) {
              Rate = ((num2 / count) * 100).toFixed(2);
            }
          }
          let StringValue =
            "当前查询结果【共" +
            `${count}` +
            "笔，已完成" +
            `${num2}` +
            "笔，达成率" +
            `${Rate}` +
            "%】";
          this.$set(this.footerLabel, 0, StringValue);
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
    // 改变状态
    changeStatus(item, index) {
      this.labelStatus1 = index;
      this.formSearchs[0].datas["IsCompleteInspect"] = item.value;
      this.$set(this.tableData, 1, []);
      this.dataSearch(0);
    },
    // 改变状态
    changeStatus2(item, index) {
      if (!this.formSearchs[1].datas["OrderID"]) {
        this.$message.error("请单击上方行数据再查询！");
        return;
      }
      this.labelStatus2 = index;
      this.formSearchs[1].datas.PrepareType = "";
      this.formSearchs[1].datas.InspectStatus = "";
      this.formSearchs[1].datas.UnIssuedQty = "";
      if (index == 1) {
        this.formSearchs[1].datas.InspectStatus = 0;
      } else if (index == 2) {
        this.formSearchs[1].datas.InspectStatus = 2;
      } else if (index == 3) {
        this.formSearchs[1].datas.UnIssuedQty = "0";
        this.formSearchs[1].datas.InspectStatus = 0;
      }
      this.$set(this.tableData, 1, []);
      this.dataSearch(1);
    },
    // 选择数据
    selectFun(data, remarkTb, row) {
      this.selectionData[remarkTb] = data;
    },
    // 单击获取明细
    handleRowClick(row, remarkTb) {
      this.formSearchs[1].datas["OrderID"] = row.OrderID;
      // this.formSearchs[1].datas["SalesOrderDetailID"] = row.OrderID;
      this.OrderNos = [];
      if (row.MOS) {
        let OrderNos = row.MOS.split(",");
        OrderNos.forEach((x) => {
          this.OrderNos.push({ OrderNo: x });
        });
      }
      this.dataSearch(1);
    },
    // 可用量查询
    usingSearch(row, prop) {
      this.formSearchs[2].datas["MaterialID"] = row.MaterialID;
      this.formSearchs[3].datas["MaterialID"] = row.MaterialID;
      this.dataSearch(2);
      this.dataSearch(3);
      this.dialogShow = true;
    },
    // 清空超领
    clearShort() {
      if (this.selectionData[1].length == 0) {
        this.$message.error("请勾选需要清空的数据！");
      } else {
        this.$confirm("确定清空选中的吗，会直接保存哟？")
          .then(() => {
            let newData = [];
            _this.selectionData[1].forEach((x) => {
              x.ShortQty = null;
              if (parseInt(x.UnIssuedQty) == 0) {
                x.InspectStatus = 1;
                if (parseInt(x.OweQty) == 0) {
                  x.PrepareType = "齐套";
                } else {
                  x.PrepareType = "欠料";
                }
              } else {
                x.InspectStatus = 2;
                x.PrepareType = "异常";
              }
              newData.push(x);
            });
            _this.generalSaveData(newData, 1);
          })
          .catch(() => {});
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
          type: "success",
          dangerouslyUseHTMLString: true,
        });
      } else {
        _this.adminLoading = false;
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
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
    realySubmitChildren(InspectDate) {
      let submitData = [];
      // if (this.tableData[1].length != 0) {
      //   this.tableData[1].forEach((x) => {
      //     if (!x.Disabled && parseInt(x.ShortQty) > 0) {
      //       x.PrepareType = "超领";
      //       x.InspectStatus = 2;
      //       x.InspectDate = InspectDate;
      //       x.InspectUser = this.userInfo.Name;
      //       submitData.push(x);
      //     }
      //   });
      // }
      if (this.selectionData[1].length != 0) {
        this.selectionData[1].forEach((y) => {
          // if (parseInt(y.UnIssuedQty) != 0) {
          //   y.InspectStatus = 2;
          //   y.PrepareType = "异常";
          // } else if (y.ShortQty && parseInt(y.ShortQty) > 0) {
          //   y.InspectStatus = 2;
          //   y.PrepareType = "超领";
          // } else if (!y.ShortQty || parseFloat(y.ShortQty) <= 0) {
          //   y.InspectStatus = 1;
          // }
          if (y.ShortQty && parseInt(y.ShortQty) > 0) {
            y.InspectStatus = 2;
            y.PrepareType = "超领";
          } else if (parseInt(y.UnIssuedQty) != 0) {
            y.InspectStatus = 2;
            y.PrepareType = "异常";
          } else {
            y.InspectStatus = 1;
          }
          y.InspectDate = InspectDate;
          y.InspectUser = this.userInfo.Name;
        });
      }
      submitData = submitData.concat(this.selectionData[1]);
      this.generalSaveData(submitData, 1);
    },
    // 控制选框是否能手动勾选
    checCheckboxkMethod({ row }) {
      if (row.ShortQty == 0 && row.InspectStatus == 2) {
        this.$set(row, "Disabled", true);
        return false;
      } else {
        return true;
      }
    },
    // 行内样式
    cellStyle0({ row, column }) {
      if (column.property == "IsCompleteInspect") {
        if (row.IsCompleteInspect == "未开始") {
          return {
            backgroundColor: "#ff7b7b",
          };
        } else if (row.IsCompleteInspect == "进行中") {
          return {
            backgroundColor: "#fdfd8f",
          };
        } else if (row.IsCompleteInspect == "已完成") {
          return {
            backgroundColor: "#9fff9f",
          };
        }
      }
    },
    // 行内样式
    cellStyle({ row, column }) {
      if (column.property == "OrderNo") {
        if (row.InspectStatus == 2) {
          return {
            backgroundColor: "#ff7b7b",
          };
        } else {
          if (row.InspectStatus == 1) {
            return {
              backgroundColor: "#9fff9f",
            };
          }
        }
      }
    },
    // 收缩头部
    systolic() {
      this.enlargeType = !this.enlargeType;
      if (this.enlargeType) {
        this.height = this.rem + "px";
      } else {
        this.height = this.rem + 320 + "px";
      }
    },
    // 选择仓库
    selectWarehouse(val) {
      this.formSearchs[1].datas["WarehouseID"] = val;
      this.dataSearch(1);
    },
    // 选择工单
    selectOrderNo(val) {
      this.formSearchs[1].datas["OrderNo"] = val;
      this.dataSearch(1);
    },
  },
};
</script>
