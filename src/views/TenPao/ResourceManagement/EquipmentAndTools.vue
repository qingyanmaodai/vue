<!--设备与工装汇总-->
<template>
  <div
    class="container flex_column"
    v-loading="adminLoading"
    style="height: calc(100vh - 80px)"
  >
    <splitpanes class="default-theme" horizontal>
      <pane :size="pane[0]">
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
              :hasSelect="true"
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
      <pane :size="pane[1]">
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
            />
          </div>
          <div class="admin_content">
            <div class="ant-table-title" ref="headRef_2">
              <el-row>
                <el-col :span="6"
                  ><el-tabs
                    v-model="selectedIndex"
                    @tab-click="handleClick"
                    :stretch="true"
                  >
                    <el-tab-pane label="关联产品配置" name="0"></el-tab-pane>
                    <el-tab-pane label="关联产品族" name="1"></el-tab-pane>
                    <el-tab-pane
                      label="TPM设备明细"
                      name="2"
                    ></el-tab-pane> </el-tabs
                ></el-col>
                <el-col :span="18" class="flex_flex_end">
                  <el-select
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
                  </el-button>
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
              :hasSelect="true"
              :cellStyle="cellStyle"
              :sysID="sysID[1].ID"
              :checCheckboxkMethod="checCheckboxkMethod"
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
import { Splitpanes, Pane } from "splitpanes";
import "splitpanes/dist/splitpanes.css";
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
  name: "ScheduleDetails",
  components: {
    ComSearch,
    ComVxeTable,
    ComReportTable,
    Splitpanes,
    Pane,
  },
  data() {
    return {
      ////////////////// Search /////////////////
      footerLabel: [""],
      expendColl: false,
      expendCollText: "收缩",
      selectionData: [[], []],
      title: this.$route.meta.title,
      height2: "240px",
      height3: "180px",
      includeFields: [["ProducedQty", "ConfirmQty"], [], []],
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
      // height: "707px",
      showPagination: true,
      tagRemark: 0,
      isLoading: false,
      adminLoading: false,
      parseForm: {},
      parseSearch: false,
      warehouseValue: "",
      OrderNo: "",
      OrderNoValue: "",
      OrderNos: [],
      Status1: [
        { label: "待确认", value: "未开始" },
        { label: "已完成", value: "已完成" },
        { label: "全部", value: "" },
      ],
      Status2: [
        { label: "全部", value: 0 },
        { label: "未点检", value: 1 },
        { label: "异常", value: 2 },
        { label: "已领未点", value: 3 },
      ],
      labelStatus1: 0,
      labelStatus2: 0,
      sysID: [{ ID: 126 }, { ID: 97 }, { ID: 10084 }, { ID: 6751 }],
      isEdit: false,
      enlargeType: true,
      rem: "",
      warehouses: [],
      userInfo: {},
      pane:[100,0]
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
    this.$common.judgeBtn(this, this.btnForm);
    // this.getWarehosueData();
  },
  mounted() {
    setTimeout(() => {
      this.setHeight();
    }, 600);
  },
  methods: {
    // 获取所有仓库
    // async getWarehosueData() {
    //   let form = {};
    //   form["dicID"] = 80;
    //   form["rows"] = 0;
    //   let res = await GetSearchData(form);
    //   const { result, data, count, msg } = res.data;
    //   if (result) {
    //     this.warehouses = data;
    //   } else {
    //     this.$message({
    //       message: msg,
    //       type: "error",
    //       dangerouslyUseHTMLString: true
    //     });
    //   }
    // },
    // 高度控制
    // setHeight() {
    //   let headHeight =
    //     this.$refs.content_up.offsetHeight + this.$refs.content_up.offsetTop;
    //   let headRef_2 = this.$refs.headRef_2.offsetHeight;
    //   let rem =
    //     document.documentElement.offsetHeight - headHeight - headRef_2 - 65;
    //   this.rem = rem;
    //   let newHeight = rem + "px";
    //   this.$set(this, "height", newHeight);
    // },
    // 高度控制
    setHeight() {
      let headHeight = this.$refs.headRef.offsetHeight;
      let rem =
        document.documentElement.clientHeight -
        headHeight -
        this.$store.getters.reduceHeight;
      let newHeight = rem + "px";
      let rem2 =
        document.documentElement.clientHeight -
        headHeight -
        this.$store.getters.reduceHeight;
      let newHeight2 = rem2 + "px";
      // this.$set(this, "height", newHeight);
      // this.$set(this, "height2", newHeight2);
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
      form["rows"] = 0;
      let res = await ExportData(form);
      this.adminLoading = false;
      this.$store.dispatch("user/exportData", res.data);
    },
    // 保存
    async dataSave(remarkTb, index, parms, newData) {
      // console.log(this.tableData[0]);
      const $table = this.$refs[`tableRef${remarkTb}`].$refs.vxeTable;
      // 获取修改记录
      let updateRecords = [];
      this.adminLoading = true;
      if ($table) {
        updateRecords = $table.getUpdateRecords();
      }
      if (updateRecords.length == 0) {
        this.$set(this, "adminLoading", false);
        this.$message.error("当前数据没做修改，请先修改再保存！");
        return;
      }
      let res = await SaveData(updateRecords);
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
          this.$set(this.OrderNos, i, m);

          this.OrderNos[i] = this.OrderNos[i]
            .filter((item) => item.isEdit)
            .map((item) => {
              return {
                value: item.prop,
                label: item.label,
              };
            });
          console.log(this.OrderNos, "this.OrderNo");
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
        // this.formSearchs[0].datas["PrepareStatus"] = 1;
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
      if (this.tableData[remarkTb].length === 0) {
        this.tablePagination[remarkTb]["pageSize"] =
          this.tableColumns[remarkTb][1]["pageSize"];
      }
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
        // if (remarkTb == 0) {
        //   let num2 = 0;
        //   let Rate = 0;
        //   if (data.length != 0) {
        //     data.forEach(x => {
        //       if (x.NoInspectStatusCount == 0) {
        //         num2++;
        //       }
        //     });
        //     if (count != 0) {
        //       Rate = ((num2 / count) * 100).toFixed(2);
        //     }
        //   }
        //   let StringValue =
        //     "当前查询结果【共" +
        //     `${count}` +
        //     "笔，已完成" +
        //     `${num2}` +
        //     "笔，达成率" +
        //     `${Rate}` +
        //     "%】";
        //   this.$set(this.footerLabel, 0, StringValue);
        // }
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
      if (!this.formSearchs[1].datas["SalesOrderDetailID"]) {
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
      this.pane = [60,40]
      this.formSearchs[1].datas["OrganizeID"] = row.OrganizeID;
      this.dataSearch(1);
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
    async setAttendance() {
      // 获取有超领的数据
      // let res = await GetServerTime();
      // const { result, data, msg } = res.data;
      // if (result) {
      //   this.realySubmitChildren(data);
      // } else {
      // }
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
    changeProp(index) {
      if (!this.OrderNo) {
        this.$message.error("请选择需要修改的值");
        return;
      }
      if (this.tableData[index].length === 0) {
        this.$message.error("当前表格无数据");
        return;
      }
      this.tableData[index].map((item) => {
        item[this.OrderNo] = this.OrderNoValue;
      });
    },
  },
};
</script>
