<!--菜单设置-->
<template>
  <div class="container" v-loading="adminLoading">
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
              <div v-for="(item, y) in Status1" :key="y">
                <span
                  @click="changeStatus(item, y)"
                  :class="labelStatus1 == y ? 'statusActive cursor' : 'cursor'"
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
          :tableData="tableData[0]"
          :tableHeader="tableColumns[0]"
          :tableLoading="tableLoading[0]"
          :remark="0"
          :sysID="sysID[0].ID"
          :isEdit="isEdit"
          :isClear="isClear[0]"
          :pagination="tablePagination[0]"
          @handleRowClick="handleRowClick"
          @pageChange="pageChange"
          @pageSize="pageSize"
          @sortChange="sortChange"
          @lookData="lookData"
          @delRow="delRow"
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
        <span>不良产品明细</span>
        <i class="el-icon-zoom-in dialog_icon" @click="changeWidth" />
      </span>
      <el-container>
        <div
          ref="printTest"
          id="printTest"
          class="flex_column"
          style="padding: 10px"
        >
          <div>
            <span class="content_head">明细列表</span>
            <div class="hr-line-dashed margin_bottom_10" />
            <GeneralForm
              class="formStyle"
              ref="ruleForm0"
              :rule-form="ruleForm0"
              :form-controller="formController0"
            ></GeneralForm>
          </div>
          <div class="content_main_head" v-show="AbnormalStatus == 1">
            <el-button
              @click="addType('报废')"
              size="small"
              type="danger"
              class=""
              plain
              >报废</el-button
            >
            <el-button
              @click="addType('返工')"
              plain
              size="small"
              type="danger"
              class="margin_left_10"
              >返工</el-button
            >
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
            :isEdit="isEdit2"
            :hasSelect="hasSelect"
            :isClear="isClear[1]"
            :showPagination="false"
            @selectfun="selectFun"
          />
          <el-input
            type="textarea"
            placeholder="审批意见"
            v-model="currentRow.AduitRemark"
            rows="2"
            v-show="currentRow.AbnormalStatus != 5"
          />
          <span
            v-show="currentRow.AbnormalStatus == 5"
            v-html="
              currentRow.AduitRemark
                ? currentRow.AduitRemark.replace(/\n/g, '<br/>')
                : ''
            "
          ></span>
          <!-- <el-input
            type="textarea"
            placeholder="审批意见"
            v-show="currentRow.AbnormalStatus != 0 && currentRow.AbnormalStatus != 1"
            v-model="currentRow.Extend2"
            rows="2"
          />
          <el-input
            type="textarea"
            placeholder="审批意见"
            v-show="currentRow.AbnormalStatus == 3 || currentRow.AbnormalStatus == 4"
            v-model="currentRow.Extend3"
            rows="2"
          /> -->
          <!-- <span class="footer_span">审批人：{{currentRow.ModifiedByName}}</span> -->
        </div>
        <el-footer class="footer" style="height: 50px; line-height: 50px">
          <el-button size="small" @click="dialogShow = false">取消</el-button>
          <el-button
            size="small"
            type="danger"
            @click="backData"
            v-show="sureAduit"
            >退回</el-button
          >
          <el-button
            size="small"
            type="success"
            @click="aduitData"
            v-show="sureAduit"
            >审批</el-button
          >
          <el-button
            v-show="currentRow.AbnormalStatus == 5"
            class="green_btn"
            size="small"
            @click="printData"
            >打印</el-button
          >
        </el-footer>
      </el-container>
    </el-dialog>
  </div>
</template>

<script>
var _this;
import printJS from "print-js";
import html2canvas from "html2canvas";
import ComSearch from "@/components/ComSearch";
import ComVxeTable from "@/components/ComVxeTable";
import ComFormDialog from "@/components/ComFormDialog";
import GeneralForm from "@/components/GeneralForm";
import { GetHeader, GetSearchData, ExportData, SaveData } from "@/api/Common";
import { Row } from "element-ui";
export default {
  name: "BadAduit",
  components: {
    ComSearch,
    ComVxeTable,
    ComFormDialog,
    GeneralForm,
  },
  data() {
    return {
      hasSelect: false,
      sureAduit: false,
      dialogShow: false,
      adminLoading: false,
      isEdit: false,
      isEdit2: false,
      labelStatus1: 2,
      Status1: [
        { label: "全部", value: "" },
        { label: "草稿", value: 0 },
        { label: "待审", value: [1, 2, 3] },
        { label: "仓审", value: 5 },
        { label: "结案", value: 5 },
      ],
      sysID: [{ ID: 7810 }, { ID: 7816 }],
      currentRow: { AbnormalStatus: 4 },
      tableHeight2: "400px",
      customDialog: "oneStyle",
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
      ],
      // [{name:'审批',methods:'aduitData',color:'#409EFF',condition:(row)=>{return row.AbnormalStatus != 4}},{name:'退回',methods:'backData',color:'#F56C6C'}]
      btnForm: [],
      tableData: [[], []],
      tableColumns: [[], []],
      tableLoading: [false, false],
      isClear: [false, false],
      tablePagination: [
        { pageIndex: 1, pageSize: 50, pageTotal: 0 },
        { pageIndex: 1, pageSize: 0, pageTotal: 0 },
      ],
      height: "707px",
      showPagination: true,
      tagRemark: 0,
      isLoading: false,
      //////////////新增弹框//////////////
      ruleForm0: {
        BadDate: "",
        AbnormalNo: "",
        WorkShopName: "",
        LineName: "",
        ProductNum: 0,
        TinyProcessNum: 0,
      },
      formController0: [
        {
          label: "提报日期",
          prop: "BadDate",
          component: {
            type: "date",
          },
          disabled: true,
        },
        {
          label: "车间",
          prop: "WorkShopName",
          component: {
            type: "input",
          },
          disabled: true,
        },
        {
          label: "线别",
          prop: "LineName",
          component: {
            type: "input",
          },
          disabled: true,
        },
        {
          label: "单据",
          prop: "AbnormalNo",
          component: {
            type: "input",
          },
          disabled: true,
        },
        {
          label: "产品个数",
          prop: "ProductNum",
          component: {
            type: "input",
          },
          disabled: true,
        },
        {
          label: "工序个数",
          prop: "TinyProcessNum",
          component: {
            type: "input",
          },
          disabled: true,
        },
      ],
      userInfo: {},
      AduitStatus: [],
      selectionData: [[], []],
      AbnormalStatus: 0,
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
    // 获取所有按钮
    this.userInfo = this.$store.getters.userInfo;
    let RoleMap = this.userInfo.RoleMap;
    this.AduitStatus = [];
    if (RoleMap.length != 0) {
      RoleMap.forEach((a) => {
        if (a.RoleID == "R2111030001") {
          this.AduitStatus.push(1);
        } else if (a.RoleID == "R2111030002") {
          this.AduitStatus.push(2);
        } else if (a.RoleID == "R2111030003") {
          this.AduitStatus.push(3);
        }
      });
    }
    this.judgeBtn();
    this.getTableHeader();
  },
  mounted() {
    setTimeout(() => {
      this.setHeight();
    }, 450);
  },
  methods: {
    currentDate() {
      let newDate = new Date();
      // let newDate = date.setMonth(date.getMonth() - 1);
      // newDate = new Date(newDate);
      let year = newDate.getFullYear();
      let month = this.zero(newDate.getMonth() + 1);
      let day = this.zero(newDate.getDate());
      let hour = this.zero(newDate.getHours());
      let seconds = this.zero(newDate.getSeconds());
      let minutes = this.zero(newDate.getMinutes());
      return (
        year +
        "-" +
        month +
        "-" +
        day +
        " " +
        hour +
        ":" +
        seconds +
        ":" +
        minutes
      );
    },
    zero(num) {
      if (Number(num) < 10) {
        return "0" + num;
      } else {
        return num;
      }
    },
    //判断按钮权限
    judgeBtn() {
      let routeBtn = this.$route.meta.btns;
      let newBtn = [];
      let permission = false;
      if (routeBtn.length != 0) {
        routeBtn.forEach((x) => {
          if (x.ButtonCode == "edit") {
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
      //   let rem2 = document.documentElement.clientHeight - 400 + 'px';
      this.$set(this, "height", newHeight);
      //   this.$set(this, "tableHeight2", rem2);
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
        this.formSearchs[0].datas["AbnormalStatus"] = this.AduitStatus;
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
        if (this.currentRow.AbnormalStatus == 1) {
          if (data.length != 0) {
            data.forEach((x) => {
              x.Extend4 = "返工";
            });
          }
        }
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
    // 通用放大弹框
    changeWidth() {
      if (this.customDialog === "oneStyle") {
        this.customDialog = "twoStyle";
      } else {
        this.customDialog = "oneStyle";
      }
    },
    // 改变状态
    changeStatus(item, index) {
      this.labelStatus1 = index;
      this.formSearchs[0].datas["AbnormalStatus"] = item.value;
      if (index == 2) {
        // 待审需要判断登入进来的角色
        this.formSearchs[0].datas["AbnormalStatus"] = this.AduitStatus;
      }
      this.dataSearch(0);
    },
    // 删除
    delRow(row) {
      this.$confirm("确定删除吗？").then((_) => {
        row["ElementDeleteFlag"] = 1;
        let newData = [];
        newData.push(row);
        _this.generalSaveData(newData, 0);
      });
    },
    // 点击查看明细
    lookData(row) {
      this.currentRow = row;
      this.AbnormalStatus = row.AbnormalStatus;
      if (this.AbnormalStatus == 1) {
        this.hasSelect = true;
        this.isEdit2 = true;
      } else {
        this.hasSelect = false;
        this.isEdit2 = false;
      }
      for (var name in row) {
        this.$set(this.ruleForm0, name, row[name]);
      }
      if (row.AduitPeoplesAccount) {
        let AduitPeoplesAccount = row.AduitPeoplesAccount.split(",");
        if (
          AduitPeoplesAccount.findIndex((a) => a == _this.userInfo.Account) !=
          -1
        ) {
          this.sureAduit = true;
        }
      } else {
        this.sureAduit = false;
      }
      this.formSearchs[1].datas["AbnormalNoID"] = row.AbnormalNoID;
      this.dialogShow = true;
      let StringValue = "";
      if (row.AbnormalStatus == 4 || row.AbnormalStatus == 5) {
        StringValue =
          "工艺审批意见：" +
          row.Extend1 +
          ";  " +
          "\n" +
          "巡检审批意见：" +
          row.Extend2 +
          ";  " +
          "\n" +
          "经理审批意见：" +
          ";" +
          row.Extend3 +
          ";" +
          "\n" +
          "仓管审批意见：" +
          row.Extend5 +
          ";";
      } else if (row.AbnormalStatus == 3) {
        StringValue =
          "工艺审批意见：" +
          row.Extend1 +
          ";  " +
          "巡检审批意见：" +
          row.Extend2 +
          ";  ";
      } else if (row.AbnormalStatus == 2) {
        StringValue = "工艺审批意见：" + row.Extend1 + ";  ";
      }
      this.$set(row, "AduitRemark", StringValue);
      this.dataSearch(1);
    },
    // 审批数据
    aduitData() {
      if (this.AbnormalStatus == 1) {
        let flag = 0;
        this.tableData[1].forEach((a) => {
          if (!a.Extend4) {
            flag = 1;
          }
        });
        if (flag == 1) {
          this.$message.error(
            "存在类型为空的数据，请先选择是报废还是返工产品！"
          );
          return;
        }
      }

      this.$confirm("确定审批吗？")
        .then((_) => {
          let newData = [];
          if (_this.AbnormalStatus == 3) {
            let flag_2 = 0;
            _this.tableData[1].some((m, i) => {
              if (m.Extend4 == "报废") {
                flag_2 = 1; //存在报废就需要仓库审 仓库审状态是4 直接结案是5
                return true;
              }
            });
            if (flag_2 == 0) {
              _this.currentRow.AduitRemark = _this.currentRow.AduitRemark
                ? _this.currentRow.AduitRemark
                : "无";
              _this.currentRow.AbnormalStatus =
                parseInt(_this.AbnormalStatus) + 2;
            } else {
              _this.currentRow.AbnormalStatus =
                parseInt(_this.AbnormalStatus) + 1;
            }
          } else {
            _this.currentRow.AbnormalStatus =
              parseInt(_this.AbnormalStatus) + 1;
          }
          if (_this.AbnormalStatus == 1) {
            _this.currentRow.Extend1 =
              _this.currentRow.AduitRemark +
              ", 审批人：" +
              _this.userInfo.Name +
              "，审批时间：" +
              _this.currentDate();
          } else if (_this.AbnormalStatus == 2) {
            _this.currentRow.Extend2 =
              _this.currentRow.AduitRemark +
              " 审批人：" +
              _this.userInfo.Name +
              "，审批时间：" +
              _this.currentDate();
          } else if (_this.AbnormalStatus == 3) {
            _this.currentRow.Extend3 =
              _this.currentRow.AduitRemark +
              " 审批人：" +
              _this.userInfo.Name +
              "，审批时间：" +
              _this.currentDate();
          } else if (_this.AbnormalStatus == 4) {
            _this.currentRow.AduitRemark =
              _this.currentRow.Extend5 +
              " 审批人：" +
              _this.userInfo.Name +
              "，审批时间：" +
              _this.currentDate();
          }
          newData.push(_this.currentRow);
          if (_this.AbnormalStatus == 1) {
            _this.tableData[1].forEach((x) => {
              let obj = {};
              obj["AbnormalNoDetailsID"] = x.AbnormalNoDetailsID;
              obj["dicID"] = 7781;
              obj["Extend4"] = x.Extend4;
              newData.push(obj);
            });
          }
          _this.generalSaveData(newData, 0);
          _this.dialogShow = false;
        })
        .catch((_) => {});
    },
    // 退回数据
    backData() {
      this.$confirm("确定退回吗？")
        .then((_) => {
          let newData = [];
          _this.currentRow.AbnormalStatus = 0;
          newData.push(_this.currentRow);
          _this.generalSaveData(newData, 0);
          _this.dialogShow = false;
        })
        .catch((_) => {});
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
    // 添加报废
    addType(val) {
      this.selectionData[1].forEach((x) => {
        this.$set(x, "Extend4", val);
      });
    },
    // 选择数据
    selectFun(data, remarkTb, row) {
      this.selectionData[remarkTb] = data;
    },
    // 打印
    printData() {
      // var sprnhtml = $("#printTest").html(); //获取区域内容
      // var selfhtml = $("body").html(); //获取当前页的html
      // $("body").html(sprnhtml);
      // window.print();
      // $("body").html(selfhtml);

      let newContent = document.getElementById("printTest").innerHTML;
      let oldContent = document.body.innerHTML;
      document.body.innerHTML = newContent;
      window.print();
      window.location.reload();
      document.body.innerHTML = oldContent;
      /*--  我是根据打印按钮触发下面的事件  ---- */
      // html2canvas(document.getElementById("printTest")).then(function (canvas) {
      //   var imgageData = canvas.toDataURL("image/png"); //把canvas转为base64图片
      //   // console.log(imgageData)
      //   print(imgageData, "image");
      // });

      //   const printContent = this.$refs.printTest; // 获取dom 宽度 高度
      //   const width = printContent.clientWidth;
      //   const height = printContent.clientHeight; // 创建一个canvas节点
      //   const canvas = document.createElement("canvas");
      //   const scale = 5; // 定义任意放大倍数，支持小数；越大，图片清晰度越高，生成图片越慢。
      //   canvas.width = width * scale; // 定义canvas 宽度 * 缩放
      //   canvas.height = height * scale; // 定义canvas高度 *缩放
      //   canvas.style.width = width * scale + "px";
      //   canvas.style.height = height * scale + "px";
      // //  canvas.style.fontSize = '24px';
      //   canvas.getContext("2d").scale(scale, scale); // 获取context,设置scale
      //   const scrollTop =
      //     document.documentElement.scrollTop || document.body.scrollTop; // 获取滚动轴滚动的长度
      //   const scrollLeft =
      //     document.documentElement.scrollLeft || document.body.scrollLeft; // 获取水平滚动轴的长度
      //   html2canvas(printContent, {
      //     canvas,
      //     backgroundColor: null,
      //     useCORS: true,
      //     windowHeight: document.body.scrollHeight,
      //     scrollX: -scrollLeft, // 解决水平偏移问题，防止打印的内容不全
      //     scrollY: -scrollTop,
      //   })
      //     .then((canvas) => {
      //       const url = canvas.toDataURL("image/png"); //打印方法
      //       printJS({
      //         printable: url,
      //         type: "image",
      //         documentTitle: "", // 标题
      //         style: "@page{size:auto;margin: 0cm 1cm 0cm 1cm;}", // 去除页眉页脚
      //       });
      //     })
      //     .catch((err) => {
      //       console.error(err);
      //     });
    },
  },
};
</script>
<style lang="scss" scoped>
.formStyle ::v-deep .el-form {
  display: flex;
  flex-wrap: wrap;
}
.formStyle ::v-deep .el-form-item {
  width: 24% !important;
  // float: left !important;
  display: flex !important;
  align-items: center !important;
}
</style>
