<!--设备与工装汇总-->
<template>
  <div
    class="container flex_column content_height"
    v-loading="adminLoading"
  >
    <div class="flex_column" style="width: 100%; height: 100%">
      <div class="admin_head" ref="headRef">
        <ComSearch
          ref="searchRef"
          :searchData="formSearchs[0].datas"
          :searchForm="formSearchs[0].forms"
          :remark="0"
          :isLoading="isLoading"
          :btnForm="btnForm"
          @btnClick="btnClick"
          :signName="0"
        />
      </div>
      <div class="ant-table-title" ref="headRef_2">
            <el-row>
              <el-col :span="4"><span class="title">{{ title }}</span></el-col>
              <!-- <el-col :span="20" class="flex_flex_end">
                <span>新增行数：</span>
                <el-input-number v-model.trim="addNum" :min="1" :max="100" :step="10" placeholder="请输入"
                  size="small"></el-input-number>
                <el-divider direction="vertical"></el-divider></el-col> -->
            </el-row>
          </div>
      <div v-for="item in [0]" :key="item" class="admin_content flex_grow">
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
          :hasSelect="true"
          :isEdit="isEdit[item]"
          :isClear="isClear[item]"
          :keepSource="true"
          :pagination="tablePagination[item]"
          @pageChange="pageChange"
          @pageSize="pageSize"
          @sortChange="sortChange"
          @selectfun="selectFun"
          @handleRowClick="handleRowClick"
        />
      </div>
    </div>
    <!-- 弹框-->
    <!-- <el-dialog
      :title="'计划调整'"
      :visible.sync="colDialogVisible2"
      width="70%"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      ><div
        style="
          height: 60vh;
          overflow-x: hidden;
          display: flex;
          flex-direction: column;
        "
      >
        <div class="ant-table-title">
          <el-row>
            <el-col :span="6"
              ><span class="title">销售订单：{{ SalesOrderNo }}</span></el-col
            >
            <el-col :span="6"
              ><span class="title">行项目：{{ SalesLineNum }} </span></el-col
            >
            <el-col :span="6"
              ><span class="title">交期：{{ SalesDeliveryDate }} </span></el-col
            >
            <el-col :span="6"
              ><span class="title">前置期： {{ FrontDate }} </span></el-col
            >
          </el-row>
        </div>
        <div v-for="item in [2]" :key="item" class="flex_grow">
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
            :hasSelect="true"
            :isEdit="isEdit[item]"
            :isClear="isClear[item]"
            :keepSource="true"
            :pagination="tablePagination[item]"
            @pageChange="pageChange"
            @pageSize="pageSize"
            @sortChange="sortChange"
            @selectfun="selectFun"
          />
        </div>
        <div style="height: 40px; margin-top: 6px">
          <el-row>
            <el-col :span="6">
              <div>
                原因:<el-select
                  clearable
                  filterable
                  size="small"
                  placeholder="请选择原因"
                  v-model="ChangeReason"
                >
                  <el-option
                    v-for="(item, i) in ChangeReasonArray"
                    :key="i"
                    :label="item.value"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
            </el-col>
            <el-col :span="6"
              ><span class="title">
                <div>
                  备注:
                  <el-input
                    size="small"
                    v-model="Extend1"
                    style="width: 160px"
                    placeholder="请输入备注"
                  ></el-input>
                </div> </span
            ></el-col>
          </el-row>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-checkbox v-model="IgnoreSunday" border style="margin-right: 10px"
          >忽略周日</el-checkbox
        >
        <el-button type="primary" @click="Reschedule()">重算排期</el-button>
        <el-button type="primary" @click="dataSave2()">确定</el-button>
        <el-button @click="colDialogVisible2 = false">取消</el-button>
      </span>
    </el-dialog> -->
    <!-- <DialogTable title="添加产品" :tableDialog="colDialogVisible2" :sysID="sysID[2]['ID']" width="80%" :hasSelect="true"
      @closeDialog="colDialogVisible2 = false" :searchForm="formSearchs[2]" :isToolbar="false" :isConfirmBtn="true"
      @confirmDialog="confirmDialog"></DialogTable> -->
    <!-- <DialogTable title="添加产品族" :tableDialog="colDialogVisible5" :sysID="sysID[5]['ID']" width="80%" :hasSelect="true"
      @closeDialog="colDialogVisible5 = false" :searchForm="formSearchs[5]" :isToolbar="false" :isConfirmBtn="true"
      @confirmDialog="confirmDialog"></DialogTable>
    <DialogTable title="添加TPM设备" :tableDialog="colDialogVisible6" :sysID="sysID[6]['ID']" width="80%" :hasSelect="true"
      @closeDialog="colDialogVisible6 = false" :searchForm="formSearchs[6]" :isToolbar="false" :isConfirmBtn="true"
      @confirmDialog="confirmDialog"></DialogTable> -->
  </div>
</template>

<script>
var _this;
import { Splitpanes, Pane } from "splitpanes";
import "splitpanes/dist/splitpanes.css";
import ComSearch from "@/components/ComSearch";
import ComVxeTable from "@/components/ComVxeTable";
import ComReportTable from "@/components/ComReportTable";
import DialogTable from "@/components/Dialog/dialogTable";
import {
  GetHeader,
  GetSearchData,
  ExportData,
  SaveData,
  GetServerTime,
  GetSearch,
} from "@/api/Common";
export default {
  name: "QuotaAbnormalAnalysis",
  components: {
    ComSearch,
    ComVxeTable,
    ComReportTable,
    Splitpanes,
    Pane,
    DialogTable,
  },
  data() {
    return {
      ////////////////// Search /////////////////
      footerLabel: [""],
      selectionData: [[], []],
      title: this.$route.meta.title,
      includeFields: [[], [], []],
      formSearchs: [
        {
          datas: {},
          forms: [],
          required: [], //获取必填项
        },
        {
          datas: {},
          forms: [],
        },
      ],
      btnForm: [],
      tableData: [[], []],
      tableColumns: [[], []],
      tableLoading: [false, false],
      isClear: [false, false],
      tablePagination: [
        { pageIndex: 1, pageSize: 20, pageTotal: 0 },
        { pageIndex: 1, pageSize: 20, pageTotal: 0 },
      ],
      tagRemark: 0,
      isLoading: false,
      adminLoading: false,
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
      sysID: [
        { ID: 11150 },
        { ID: 11149 },
      ],
      isEdit: [false, false],
      userInfo: {},
      selectedIndex: "1",
      colDialogVisible2: false,
      colDialogVisible5: false,
      colDialogVisible6: false,
      addNum: 1,
      DataSourceList: [{}],
      ChangeReason: null,
      ChangeReasonArray: [],
      Extend1: null,
      SalesOrderNo: null,
      SalesLineNum: null,
      SalesDeliveryDate: null,
      FrontDate: null,
      IgnoreSunday: false,
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
          if (item.ButtonCode == "save") {
            if (!item["signName"] || item["signName"].length === 0) {
              this.isEdit.fill(true);
            } else if (item["signName"] && item["signName"].length > 0) {
              item["signName"].map((item) => {
                this.$set(this.isEdit, item, true);
              });
            }
          }
        });
      this.$set(this, "btnForm", routeBtn);
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
        this[methods](remarkTb);
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
      this.adminLoading = true;
      // const sheet = this.spread[remarkTb]?.getActiveSheet();
      const $table = this.$refs[`tableRef${remarkTb}`]?.[0].$refs.vxeTable;
      // if (sheet && sheet.isEditing()) {
      //   sheet.endEdit();
      // }
      // 获取修改记录
      let updateRecords = [];
      if (newData) {
        updateRecords = newData;
      } else {
        if ($table) {
          updateRecords = $table.getUpdateRecords();
        } else {
          // let DirtyRows = sheet.getDirtyRows().map((row) => row.item); //获取修改过的数据
          // let InsertRows = sheet.getInsertRows().map((row) => row.item); //获取插入过的数据
          // let DeletedRows = sheet.getDeletedRows().map((row) => row.item);
          // DeletedRows.forEach((item) => {
          //   item["ElementDeleteFlag"] = 1;
          // }); //获取被删除的数据
          // updateRecords = [...DirtyRows, ...InsertRows, ...DeletedRows];
        }
      }
      console.log(updateRecords, "updateRecords", this.$refs);
      if (updateRecords.length == 0) {
        this.$set(this, "adminLoading", false);
        this.$message.error("当前数据没做修改，请先修改再保存！");
        return;
      }
      console.log(updateRecords, "updateRecords.length");
      if (updateRecords.length > 0 && remarkTb === 0) {
        if (this.formSearchs[remarkTb].required.length) {
          // 动态检验必填项
          updateRecords.map((item1, index1) => {
            this.formSearchs[remarkTb].required.map((item2, index2) => {
              let content = item1[item2["prop"]];
              if (!content && (content !== 0) & (content !== false)) {
                this.$message.error(`${item2["label"]}不能为空，请选择`);
                this.$set(this, "adminLoading", false);
                return;
              }
            });
          });
          // for (let i = 0; i < updateRecords.length; i++) {
          //   for (
          //     let x = 0;
          //     x < this.formSearchs[remarkTb].required.length;
          //     x++
          //   ) {
          //     let content =
          //       updateRecords[i][
          //       this.formSearchs[remarkTb].required[x]["prop"]
          //       ];
          //     if (!content && (content !== 0) & (content !== false)) {
          //       this.$message.error(
          //         `${this.formSearchs[remarkTb].required[x]["label"]}不能为空，请选择`
          //       );
          //       this.$set(this, "adminLoading", false);
          //       return;
          //     }
          //   }
          // }
        }
      }
      let res;

      res = await SaveData(updateRecords);

      const { datas, forms, result, msg } = res.data;
      if (result) {
        this.$message({
          message: msg,
          type: "success",
          dangerouslyUseHTMLString: true,
        });
        this.dataSearch(remarkTb);
        this.$set(this, "adminLoading", false);
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
        this.$set(this, "adminLoading", false);
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
            if (n.childrens && n.children.length != 0) {
              n.childrens.forEach((x) => {
                this.verifyDta(x);
              });
            }
            //从列获取下拉数据源
            if (n.DataSourceID && n.ControlType === "combobox" && i === 0) {
              this.DataSourceList[i] = {
                [n.DataSourceName]: n.items,
                ...this.DataSourceList[i],
              };
            }
            if (n.Required && i === 0) {
              this.formSearchs[this.tagRemark].required.push(n);
            }
            if (index === 1) {
              this.tablePagination[i]["pageSize"] = n["pageSize"];
            }
          });
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
          this.$set(
            this.formSearchs[z].datas,
            "Accounts",
            this.userInfo.Account
          );
          if (z === 0) {
            x = [
              {
                type: "Daterange",
                label: "日期",
                width: null,
                prop: "Days",
                placeholder: "请输入日期",
                methods: null,
                options: null,
                dicID: "11150",
                icon: null,
                multiple: false,
                value: [
                  this.$moment().format("YYYY-MM-DD"),
                  this.$moment().add(30, "days").format("YYYY-MM-DD"),
                ],
              },
            ].concat(x);
          } else if (z === 1) {
            x = [
              {
                type: "Daterange",
                label: "日期",
                width: null,
                prop: "Days",
                placeholder: "请输入日期",
                methods: null,
                options: null,
                dicID: "11149",
                icon: null,
                multiple: false,
                value: [
                  this.$moment().format("YYYY-MM-DD"),
                  this.$moment().add(30, "days").format("YYYY-MM-DD"),
                ],
              },
            ].concat(x);
          }
          x.forEach((y, n) => {
            if (y.prop && y.value) {
              this.$set(this.formSearchs[z].datas, [y.prop], y.value);
            } else {
              this.$set(this.formSearchs[z].datas, [y.prop], "");
            }
          });
          this.$set(this.formSearchs[z], "forms", x);
        });
        this.getTableData(this.formSearchs[0].datas, 0);
        this.adminLoading = false;
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
      const { result, data, count, msg, Columns } = res.data;
      if (result) {
        // 获取每个表头
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
      this.formSearchs[1].datas["CustomerID"] = row.CustomerID;
      this.dataSearch(this.selectedIndex);
    },
    handleClick(tab, event) {
      console.log(tab, event);
      this.selectedIndex = tab.name;
      this.dataSearch(this.selectedIndex);
    },
    AddEvent(index) {
      if (index === 1) {
        this.colDialogVisible2 = true;
        this.formSearchs[3]["MachineTypeID"] = "M20230614001";
      }
      if (index === 2) {
        this.colDialogVisible5 = true;
      }
      if (index === 3) {
        this.colDialogVisible6 = true;
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
    // 增行
    addRow(remarkTb) {
      if (!this.addNum) {
        this.$message.error("请输入需要添加的行数!");
        return;
      }
      // 下拉数据是需要获取数据源
      for (let x = 0; x < this.addNum; x++) {
        let obj = {
          dicID: this.sysID[remarkTb].ID,
          rowNum: _.uniqueId("rowNum_"),
        };
        this.tableColumns[remarkTb].map((item) => {
          obj[item.prop] = null;
          obj["update"] = true;
          if (item.prop === "Status") {
            obj[item.prop] = 1;
          }
          if (item.prop === "RowNumber") {
            obj["RowNumber"] = _.uniqueId();
          }
          for (let key in this.DataSourceList[remarkTb]) {
            if (item.DataSourceName === key) {
              obj[key] = this.DataSourceList[remarkTb][key];
            }
          }
        });

        console.log("this.addNum", this.addNum);

        this.tableData[remarkTb].unshift(obj);
      }

      console.log("this.tableData[remarkTb]", this.tableData[remarkTb]);
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
    //添加产品机台
    confirmDialog(data) {
      let tagNumber = Number(this.selectedIndex);
      data.map((item) => {
        item["RAMID"] = this.formSearchs[tagNumber]["datas"]["RAMID"];
        item["dicID"] = this.sysID[tagNumber]["ID"];
      });
      this.colDialogVisible2 = false;
      this.colDialogVisible5 = false;
      this.colDialogVisible6 = false;
      this.dataSave(tagNumber, null, null, data);
    },
    // 删除
    async dataDel(remarkTb, index, parms) {
      let res = null;
      let newData = [];
      if (this.selectionData[remarkTb].length == 0) {
        this.$message.error("请选择需要操作的数据！");
        return;
      } else {
        this.selectionData[remarkTb].forEach((x) => {
          let obj = x;
          obj["ElementDeleteFlag"] = 1;
          newData.push(obj);
        });
      }
      this.$confirm("确定要删除的【" + newData.length + "】数据吗？")
        .then((_) => {
          _this.dataSave(remarkTb, index, null, newData);
        })
        .catch((_) => {});
    },
    async dataSave2(remarkTb, index, parms) {
      if (this.selectionData[2].length == 0) {
        this.$message.error("请选择需要操作的数据！");
        return;
      }
      let updateRecords = JSON.parse(JSON.stringify(this.selectionData[2]));
      updateRecords.forEach((item) => {
        console.log(item, "item");
        item["ChangeReason"] = this.ChangeReason;
        item["Status"] = 0;
        item["Extend1"] = this.Extend1;
        item["dicID"] = 5644;
      });
      let res = await SaveData(updateRecords);
      const { datas, forms, result, msg } = res.data;
      if (result) {
        this.$message({
          message: msg,
          type: "success",
          dangerouslyUseHTMLString: true,
        });
        this.colDialogVisible2 = false;
        // this.dataSearch(remarkTb);
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
    },
    //双击事件
    async handleRowdbClick(row, remarkTb) {
      if (remarkTb === 1) {
        let res = await GetSearch(
          { DataSourceID: "D2307210001" },
          "/APSAPI/GetDataSource"
        );
        const { result, data, count, msg } = res.data;
        if (result) {
          this.ChangeReasonArray = data;
        } else {
          this.$message({
            message: msg,
            type: "error",
            dangerouslyUseHTMLString: true,
          });
        }

        this.colDialogVisible2 = true;
        this.formSearchs[2].datas["OrderID"] = "";
        this.formSearchs[2].datas["SalesOrderDetailID"] = "";
        if (!row.SalesOrderDetailID) {
          this.formSearchs[2].datas["OrderID"] = row.OrderID;
        } else {
          this.formSearchs[2].datas["SalesOrderDetailID"] =
            row.SalesOrderDetailID;
        }
        this.formSearchs[2].datas["LineNum"] = row.LineNum;
        await this.dataSearch(2);
        if (this.tableData[2] && this.tableData[2][0]) {
          let row = this.tableData[2][0];
          this.SalesLineNum = row["SalesLineNum"];
          this.SalesDeliveryDate = row["SalesDeliveryDate"];
          this.FrontDate = row["FrontDate"];
          this.SalesOrderNo = row["SalesOrderNo"];
        }
      }
    },
    //重算
    async Reschedule() {
      if (this.selectionData[2].length == 0) {
        this.$message.error("请选择需要操作的数据！");
        return;
      }
      this.selectionData[2].forEach((item) => {
        item["IgnoreSunday"] = this.IgnoreSunday;
      });
      let res = await GetSearch(
        this.selectionData[2],
        "/APSAPI/CalculationStartDate"
      );
      const { data, result, msg } = res.data;
      if (result) {
        this.$message({
          message: msg,
          type: "success",
          dangerouslyUseHTMLString: true,
        });
        // if (data) {
        //   this.tableData[2] = [];
        //   this.$set(this.tableData, 2, data);
        // }
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
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
