<!--配件备料-->
<template>
  <div
    class="container"
    v-loading="adminLoading"
  >
    <div
      class="admin_head"
      ref="headRef"
    >
      <div
        v-for="(item,i) in 4"
        :key="i"
        v-show="labelStatus1 == i"
      >
        <ComSearch
          ref="searchRef"
          :searchData="formSearchs[i].datas"
          :searchForm="formSearchs[i].forms"
          :remark="i"
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
            <el-col :span="4"><span class="title">{{title}}</span></el-col>
            <el-col
              :span="20"
              class="flex_flex_end"
            >
              <div v-show="labelStatus1 == 0">
                <el-radio
                  v-model="losePrepareDate"
                  :label="0"
                  @click.native.prevent="clickitem(1)"
                >无备料日期</el-radio>
                <el-divider direction="vertical"></el-divider>
                <el-date-picker
                  v-model="PrepareDate"
                  type="date"
                  size="small"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期"
                >
                </el-date-picker>
                <el-divider direction="vertical"></el-divider>
                <el-button
                  type="primary"
                  size="mini"
                  @click="changeDate"
                  v-show="isEdit"
                >
                  指定备料日期
                </el-button>
                <el-divider direction="vertical"></el-divider>
              </div>
              <div v-show="labelStatus1 == 0">
                <el-radio
                  v-model="losePrepareDate2"
                  :label="0"
                  @click.native.prevent="clickitem2(1)"
                >未免检</el-radio>
                <el-divider direction="vertical"></el-divider>
              </div>
              <!-- <div
                :class="labelStatus1 == y ? 'statusActive cursor' : 'cursor'"
                v-for="(item, y) in Status1"
                :key="y"
              >
                <span @click="changeStatus(item, y)">{{ item.label }}</span>
                <el-divider direction="vertical"></el-divider>
              </div> -->
            </el-col>
          </el-row>
        </div>
        <div
          v-for="(item,i) in 4"
          :key="i"
          v-show="labelStatus1 == i"
        >
          <ComVxeTable
            :rowKey="'RowNumber'"
            :height="height"
            :tableData="tableData[i]"
            :tableHeader="tableColumns[i]"
            :tableLoading="tableLoading[i]"
            :isEdit="isEdit"
            :hasSelect="hasSelect[i]"
            :remark="i"
            :cellStyle="cellStyle0"
            :sysID="sysID[i].ID"
            :isClear="isClear[i]"
            :footerLabel="footerLabel[i]"
            :pagination="tablePagination[i]"
            @pageChange="pageChange"
            @pageSize="pageSize"
            @selectfun="selectFun"
            @sortChange="sortChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
var _this;
import ComSearch from "@/components/ComSearch";
import ComVxeTable from "@/components/ComVxeTable";
import {
  GetHeader,
  GetSearchData,
  ExportData,
  SaveData,
  GetSearch,
} from "@/api/Common";
export default {
  name: "PCBMaterial_index",
  components: {
    ComSearch,
    ComVxeTable,
  },
  data() {
    return {
      ////////////////// Search /////////////////
      footerLabel: ["", "", "", ""],
      hasSelect: [true, true, true, false],
      sysID: [{ ID: 7974 }, { ID: 7794 }, { ID: 7795 }, { ID: 7803 }],
      Status1: [
        { label: "备料清单", value: "" },
        { label: "备料计划", value: "" },
        { label: "任务管理", value: 1 },
        { label: "异常明细", value: 2 },
      ],
      title: "备料计划",
      labelStatus1: 0,
      PrepareDate: "",
      adminLoading: false,
      checkdBtnCodes: [],
      drawer: false,
      formSearchs: [
        {
          datas: {WorkOrderTypeID:['604ed9c8fbbad5','6033a5371438ef']},
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
      parmsBtn: [
        // {
        //   ButtonCode: "save",
        //   BtnName: "计算齐套",
        //   Type: "primary",
        //   Ghost: true,
        //   Size: "small",
        //   signName: 0,
        //   Methods: "computedForm",
        //   Icon: "",
        // },
        {
          ButtonCode: "save",
          BtnName: "下发",
          Type: "success",
          Ghost: true,
          Size: "small",
          signName: 0,
          Methods: "setOut",
          Icon: "",
        },
        {
          ButtonCode: "save",
          BtnName: "退回",
          Type: "danger",
          Ghost: true,
          signName: 0,
          Size: "small",
          Methods: "backOut",
          Icon: "",
        },
        // {
        //   ButtonCode: "save",
        //   BtnName: "保存",
        //   Type: "success",
        //   Ghost: true,
        //   Size: "small",
        //   signName: 2,
        //   Methods: "saveTable",
        //   Icon: "",
        // },
        // {
        //   ButtonCode: "save",
        //   BtnName: "暂停",
        //   Type: "danger",
        //   Ghost: true,
        //   Size: "small",
        //   signName: 2,
        //   Methods: "parseData",
        //   Icon: "",
        // },
        // {
        //   ButtonCode: "save",
        //   BtnName: "退回",
        //   Type: "danger",
        //   Ghost: true,
        //   signName: 2,
        //   Size: "small",
        //   Methods: "backOut",
        //   Icon: "",
        // },
        {
          ButtonCode: "save",
          BtnName: "免检",
          Type: "success",
          Ghost: true,
          signName: 0,
          Size: "small",
          Methods: "passData",
          Icon: "",
        },
      ],
      tableData: [[], [], [], []],
      delData: [[], [], [], []],
      tableColumns: [[], [], [], []],
      tableLoading: [false, false, false, false],
      isClear: [false, false, false, false],
      tablePagination: [
        { pageIndex: 1, pageSize: 2000, pageTotal: 0 },
        { pageIndex: 1, pageSize: 2000, pageTotal: 0 },
        { pageIndex: 1, pageSize: 2000, pageTotal: 0 },
        { pageIndex: 1, pageSize: 2000, pageTotal: 0 },
      ],
      height: "707px",
      showPagination: true,
      tagRemark: 0,
      isLoading: false,
      initialBtnData: [],
      tagRremark: 1,
      selectionData: [[], [], [], []],
      isEdit: false,
      losePrepareDate: 1,
      losePrepareDate2: 1,
    };
  },
  watch: {},
  created() {
    _this = this;
    this.adminLoading = true;
    this.getTableHeader();
    // 获取所有按钮
    this.judgeBtn();
  },
  mounted() {
    setTimeout(() => {
      this.setHeight();
    }, 450);
  },
  methods: {
    // 判断按钮权限
    judgeBtn() {
      let routeBtn = this.$route.meta.btns;
      let newBtn = [];
      let permission = false;
      if (routeBtn.length != 0) {
        routeBtn.forEach((x) => {
          if (x.ButtonCode == "edit") {
            permission = true;
          }
          if (x.ButtonCode == "save") {
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
      this.$set(this, "btnForm", newBtn);
      this.$set(this, "isEdit", permission);
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
    // 编辑行
    editRow(row) {
      this.$set(row, "update", true);
    },
    // 删除行
    delRow(row) {
      this.$confirm("确定要删除该菜单嘛？")
        .then((_) => {})
        .catch((_) => {});
    },
    // 单击行
    handleRowClick(row, remarkTb) {
      this.delData[remarkTb] = [];
      this.delData[remarkTb].push(row);
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
        this.$set(this.selectionData, remarkTb, []);
      });
    },
    // 重置
    dataReset(remarkTb) {
      for (let name in this.formSearchs[remarkTb].datas) {
        if (name != "dicID") {
          if(this.formSearchs[remarkTb].forms.length){
            // 判断是否是页面显示的查询条件，是的字段才清空
            this.formSearchs[remarkTb].forms.forEach((element)=>{
              if(element.prop===name){
                this.formSearchs[remarkTb].datas[name] = null;
              }
            })
          }
        }
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
    // 导出
    async dataExport(remarkTb) {
      this.adminLoading = true;
      let form = JSON.parse(JSON.stringify(this.formSearchs[remarkTb].datas));
      form["rows"] = 0;
      let res = await ExportData(form);
      this.adminLoading = false;
      this.$store.dispatch("user/exportData", res.data);
    },
    // 通用直接保存
    async generalSaveData(newData, remarkTb, index) {
      let res = await SaveData(newData);
      const { result, data, count, msg } = res.data;
      if (result) {
        this.dataSearch(remarkTb);
        this.adminLoading = false;
        this.$message({
          message: msg,
          type: "success",
          dangerouslyUseHTMLString: true,
        });
      } else {
        this.adminLoading = false;
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
    },
    // 保存返回结果自己处理事件
    async returnResultData(newData) {
      let res = await SaveData(newData);
      return res;
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
            if (n.prop == "MenuCode" || n.prop == "MenuName") {
              this.$set(n, "treeNode", true);
            }
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
        // this.formSearchs[1].datas["PrepareStatus"] = "";
        // this.formSearchs[1].datas["sort"] = "PrepareStatus asc";
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
      const { result, data, count, msg } = res.data;
      this.$set(this.tableLoading, remarkTb, false);
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
    },
    // 选择数据
    selectFun(data, remarkTb, row) {
      this.selectionData[remarkTb] = data;
    },
    // 指定备料日期
    changeDate() {
      if (this.selectionData[0].length == 0) {
        this.$message.error("请勾选数据再指定备料日期！");
      } else {
        if (!this.PrepareDate) {
          this.$message.error("请选择备料日期！");
        } else {
          this.selectionData[0].forEach((x) => {
            x.PrepareDate = this.PrepareDate;
          });
          // this.generalSaveData(this.selectionData[0], 0);
        }
      }
    },
    // 计算齐套
    async computedForm(remarkTb) {
      this.adminLoading = true;
      let res = await GetSearch(
        this.tableData[0],
        "/APSAPI/MaterialFormForPrepare"
      );
      const { result, data, count, msg } = res.data;
      if (result) {
        // 将返回的数据重新赋值配套率
        this.dataSearch(0);
        this.$message({
          message: msg,
          type: "success",
          dangerouslyUseHTMLString: true,
        });
        this.adminLoading = false;
      } else {
        this.adminLoading = false;
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }

      // let selectionData = this.selectionData[remarkTb];
      // if (selectionData.length == 0) {
      //   this.$message.error("请勾选需要计算齐套的数据！");
      // } else {
      //   let flag = 0;
      //   selectionData.forEach((x) => {
      //     if (!x.PrepareDate) {
      //       flag = 1;
      //     }
      //   });
      //   if (flag == 1) {
      //     this.$message.error(
      //       "勾选的数据含有未指定备料日期，请检查一下！未指定备料日期不参与计算"
      //     );
      //   } else {
      //     return;

      //   }
      // }
    },
    // 下发
    setOut(remarkTb) {
      if (this.selectionData[remarkTb].length == 0) {
        this.$message.error("请选择数据！");
        return
      }
      let submitData = this.selectionData[remarkTb];
      let flag = 0;
      if (submitData.length != 0) {
        submitData.forEach((x) => {
          x.SalesPrepareStatus = 1;
          if (!x.PrepareDate) {
            flag = 1;
          }
        });
      }
      if (flag == 1) {
        this.$message.error("请检查是否指派了备料日期，有备料日期才能下发！");
      } else {
        this.adminLoading = true;
        this.generalSaveData(submitData, remarkTb);
      }
    },
    // // 下发
    // setOut(remarkTb) {
    //   let submitData = this.selectionData[remarkTb];
    //   let flag = 0;
    //   if (submitData.length != 0) {
    //     submitData.forEach((x) => {
    //       let Rate = 0; //计算了齐套才能下发
    //       if (x.FormRate) {
    //         Rate = parseFloat(x.FormRate.substring(0, x.FormRate.length - 1));
    //       }
    //       if (!x.PrepareDate) {
    //         flag = 1;
    //       }
    //       x.PrepareStatus = 1; // 下发   0-代发  2-异常
    //     });
    //   }
    //   if (flag == 1) {
    //     this.$message.error("请检查是否指派了备料日期，有备料日期才能下发！");
    //   } else {
    //     this.adminLoading = true;
    //     this.generalSaveData(submitData, remarkTb);
    //   }
    // },
    // 退回
    backOut(remarkTb) {
      if (this.selectionData[remarkTb].length == 0) {
        this.$message.error("请选择数据！");
        return
      }
      this.$confirm("确定要退回吗？")
        .then((_) => {
          let submitData = _this.selectionData[remarkTb];
          if (remarkTb == 0) {
            // 退回总排程
            _this.backFirstData(submitData);
          } else {
            // 退回待发状态
            if (submitData.length != 0) {
              submitData.forEach((x) => {
                x.PrepareStatus = 0; // 下发   0-代发  2-异常 3-暂停
              });
            }
            _this.adminLoading = true;
            _this.generalSaveData(submitData, remarkTb);
          }
        })
        .catch((_) => {});
    },
    // 退回总排程
    async backFirstData(submitData) {
      _this.adminLoading = true;
      let res = await GetSearch(submitData, "/APSAPI/BackSalePlanV2");
      const { result, data, count, msg } = res.data;
      if (result) {
        _this.dataSearch(this.tagRemark);
        _this.$message({
          message: msg,
          type: "success",
          dangerouslyUseHTMLString: true,
        });
        _this.adminLoading = false;
      } else {
        _this.adminLoading = false;
        _this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
    },
    // 暂停
    parseData(remarkTb) {
      let submitData = this.selectionData[remarkTb];
      if (submitData.length != 0) {
        submitData.forEach((x) => {
          x.PrepareStatus = 3; // 下发   0-代发  2-异常
        });
      }
      this.adminLoading = true;
      this.generalSaveData(submitData, remarkTb);
    },
    // 改变状态
    changeStatus(x, index) {
      this.labelStatus1 = index;
      if (index == 0) {
        this.formSearchs[0].datas["IsSetPrepare"] = ["已生成", "部分生成"];
        if (this.tableData[0].length == 0) {
          this.dataSearch(0);
        }
        return;
      }
      this.formSearchs[index].datas["PrepareStatus"] = x.value;
      if (index == 3) {
        this.formSearchs[index].datas["PrepareType"] = ["异常", "超领"];
      }
      if (this.tableData[index].length == 0) {
        this.dataSearch(index);
      }
    },
    // 控制选框是否能手动勾选
    checCheckboxkMethod({ row }) {
      if (this.labelStatus1 == 0 && row.PrepareStatus != 0) {
        return false;
      } else {
        return true;
      }
    },
    // 是否只显示没有指派日期的
    clickitem(val) {
      val == this.losePrepareDate
        ? (this.losePrepareDate = 0)
        : (this.losePrepareDate = 1);
      if (this.losePrepareDate == 0) {
        this.formSearchs[0].datas["IsHasPrepareDate"] = 1;
      } else {
        this.formSearchs[0].datas["IsHasPrepareDate"] = "";
      }
      this.dataSearch(0);
    },
    // 是否只显示没有免检的订单
    clickitem2(val) {
      console.log('val',val)
      val == this.losePrepareDate2
        ? (this.losePrepareDate2 = 0)
        : (this.losePrepareDate2 = 1);
      if (this.losePrepareDate2 == 0) {
        this.formSearchs[0].datas["Extend14"] = "null";
      } else {
        this.formSearchs[0].datas["Extend14"] = "";
      }
      this.dataSearch(0);
    },
    // 订单免检
    passData() {
      if (this.selectionData[this.tagRemark].length == 0) {
        this.$message.error("请选择需要免检的订单！");
      } else {
        this.adminLoading = true;
        let submitData = [];
        this.selectionData[this.tagRemark].forEach((a) => {
          submitData.push({ dicID: 100, Extend14: "免检", OrderID: a.OrderID });
        });
        this.generalSaveData(submitData, this.tagRemark);
      }
    },
  },
};
</script>