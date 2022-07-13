<!--组织信息-->
<template>
  <div
    class="container"
    v-loading="adminLoading"
  >
    <div
      class="admin_container"
      style="width:100%"
    >
      <div
        class="admin_head"
        ref="headRef"
      >
        <ComSearch
          v-show="labelStatus1 != 4"
          ref="searchRef"
          :searchData="formSearchs[0].datas"
          :searchForm="formSearchs[0].forms"
          :remark="0"
          :btnForm="btnForm"
          :signName="labelStatus1"
          @btnClick="btnClick"
        />
        <ComSearch
          v-show="labelStatus1 == 4"
          ref="searchRef"
          :searchData="formSearchs[1].datas"
          :searchForm="formSearchs[1].forms"
          :remark="1"
          :btnForm="btnForm"
          :signName="labelStatus1"
          @btnClick="btnClick"
        />
      </div>
      <div>
        <div class="admin_content">
          <div class="ant-table-title">
            <el-row>
              <el-col :span="4">
                <span class="title">{{ title }}</span>
              </el-col>
              <el-col
                :span="20"
                class="flex_flex_end"
              >
                <el-date-picker
                  v-model="ReplyDate"
                  type="date"
                  v-show="labelStatus1 != 4"
                  size="small"
                  value-format="yyyy-MM-dd"
                  placeholder="选择开始时间"
                >
                </el-date-picker>
                <el-divider direction="vertical"></el-divider>
                <el-button
                  type="primary"
                  size="mini"
                  v-show="labelStatus1 != 4"
                  @click="changeDate(0)"
                >
                  批量开始日期
                </el-button>
                <el-button
                  v-show="labelStatus1 == 1"
                  type="warning"
                  size="mini"
                  @click="insertList"
                >
                  进入分线列表
                </el-button>
                <el-button
                  v-show="labelStatus1 == 4"
                  type="primary"
                  size="mini"
                  @click="MOPlanStep1Calculation"
                >
                  1.匹配拉线
                </el-button>
                <el-divider direction="vertical"></el-divider>
                <el-button
                  v-show="labelStatus1 == 4"
                  type="warning"
                  size="mini"
                  @click="dataComputedDate"
                >
                  2.配套计算
                </el-button>
                <el-divider direction="vertical"></el-divider>
                <el-button
                  v-show="labelStatus1 == 4"
                  type="success"
                  size="mini"
                  @click="MOPlanSaveToDayPlan"
                >
                  3.更新计划
                </el-button>
                <el-divider direction="vertical"></el-divider>
                <div
                  :class="labelStatus1 == y ? 'statusActive cursor' : 'cursor'"
                  v-for="(item, y) in Status1"
                  :key="y"
                >
                  <span @click="changeStatus(item, y)">{{ item.label }}</span>
                  <el-divider direction="vertical"></el-divider>
                </div>
              </el-col>
            </el-row>
          </div>
          <ComVxeTable
            v-show="labelStatus1 != 4"
            :rowKey="'RowNumber'"
            :height="height"
            :tableData="tableData[0]"
            :tableHeader="tableColumns[0]"
            :tableLoading="tableLoading[0]"
            :remark="0"
            :sysID="sysID[0].ID"
            :hasSelect="true"
            :isEdit="isEdit"
            :showFooter="true"
            :includeFields="includeFields"
            :cellStyle="cellStyle"
         
            :isClear="isClear[0]"
            :showPagination="true"
            :pagination="tablePagination[0]"
            @pageChange="pageChange"
            @pageSize="pageSize"
            @selectfun="selectFun"
            @sortChange="sortChange"
          />

          <ComVxeTable
            ref="tableRefTwo"
            v-show="labelStatus1 == 4"
            :rowKey="'RowNumber'"
            :height="height"
            :hasSelect="true"
            :tableData="tableData[1]"
            :tableHeader="tableColumns[1]"
            :tableLoading="tableLoading[1]"
            :remark="1"
            :sysID="sysID[1].ID"
            :isEdit="isEdit"
            :showFooter="true"
            :includeFields="includeFields"
            :cellStyle="cellStyle"
            :tableRowClassName="tableRowClassName"
            :isClear="isClear[1]"
            :showPagination="true"
            :pagination="tablePagination[1]"
            @pageChange="pageChange"
            @pageSize="pageSize"
            @selectfun="selectFun"
                @changeline="changeline"
            @sortChange="sortChange"
          />
          <div style="color:red;font-weight:bold">{{this.resultMsg}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
var _this;
import XLSX from "xlsx";
import ComSearch from "@/components/ComSearch";
import ComAsideTree from "@/components/ComAsideTree";
import ComVxeTable from "@/components/ComVxeTable";
import {
  GetHeader,
  GetSearchData,
  ExportData,
  SaveData,
  GetSearch,
  GetOrgData,
} from "@/api/Common";
import ComFormDialog from "@/components/ComFormDialog";
import { MOPlanStep1, MOPlanStep1Calculation } from "@/api/wjApi";
import { mapState } from "vuex";
import { status } from "nprogress";
import {
  SaveMOPlanStep4,
  SaveMOPlanStep2,
  OrderPlanMaterialForm,
} from "@/api/PageTwoScheduling";
import { template } from "xe-utils";
export default {
  name: "index5",
  components: {
    ComSearch,
    ComAsideTree,
    ComVxeTable,
    ComFormDialog,
  },
  data() {
    return {
      includeFields: ["Qty"], // 包含合计的字段
      labelStatus1: 1,
      Status1: [
        { label: "全部", value: "" },
        { label: "待排产", value: 0 },
        { label: "已排产", value: 1 },
        { label: "暂停", value: 2 },
        { label: "分线列表", value: 4 },
      ],
      title: this.$route.meta.title,
      resultMsg:'',
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
      parmsBtn: [
        // {
        //   ButtonCode: "save",
        //   BtnName: "计算排期",
        //   Type: "primary",
        //   Ghost: true,
        //   Size: "small",
        //   signName: [0, 1, 2, 3],
        //   Methods: "computedScheduling",
        //   Icon: "",
        // },
        // {
        //   ButtonCode: "save",
        //   BtnName: "下发周计划",
        //   Type: "primary",
        //   Ghost: true,
        //   signName: [0, 1, 2, 3],
        //   Size: "small",
        //   Methods: "setWeekData",
        //   Icon: "",
        // },
        // {
        //   ButtonCode: "save",
        //   BtnName: "暂停",
        //   Type: "danger",
        //   Ghost: true,
        //   signName: [0, 1, 2, 3],
        //   Size: "small",
        //   Methods: "parseData",
        //   Icon: "",
        // },
            {
          ButtonCode: "save",
          BtnName: "保存",
          isLoading: false,
          Methods: "save",
          Type: "success",
          Icon: "",
             signName: [1, 4],
          Size: "small",
        },
        {
          ButtonCode: "save",
          BtnName: "退回",
          Type: "danger",
          Ghost: true,
          signName: 4,
          Size: "small",
          Methods: "backData",
          Icon: "",
        },
        // {
        //   ButtonCode: "save",
        //   BtnName: "返回",
        //   Type: "success",
        //   Ghost: true,
        //   Size: "small",
        //   signName: [0, 1, 2, 3],
        //   Methods: "reData",
        //   Icon: "",
        // },
      ],
      selectionData: [[], []],
      btnForm: [],
      tableData: [[], []],
      tableColumns: [[], []],
      tableLoading: [false, false],
      isClear: [false, false],
      tablePagination: [
        { pageIndex: 1, pageSize: 1000, pageTotal: 0 },
        { pageIndex: 1, pageSize: 1000, pageTotal: 0 },
      ],
      height: "707px",
      treeHeight: "765px",
      showPagination: true,
      tagRemark: 0,
      isEdit: false,
      clickData: {},
      isUpdate: true,
      adminLoading: false,
      dialogImport: false,
      fileList: [],
      file: [],
      sysID: [{ ID: 7950 }, { ID: 7952 }],
      userInfo: {},
      IsPurchaseBoss: false,
      ReplyDate: "",
           NoWorkHour:[]
      ,LineViewSort:[]
    };
  },
  computed: {},
  created() {
    _this = this;
    this.userInfo = this.$store.getters.userInfo;
    this.judgeBtn();
    this.getTableHeader();
  },
  mounted() {
    setTimeout(() => {
      this.setHeight();
    }, 500);
  },
  methods: {
    changenoworkhours(item, value, prop, index, a, b)
    {
      if(this.NoWorkHour.findIndex(m=>m.OrderID==item.OrderID)===-1)
      {
    
     this.NoWorkHour.push(item)
  
      }
    },
    changeline(item, value, prop, index, a, b) {
      item.拉线.forEach((m) => {
        if (item.LineID === m.OrganizeID) {
          let tmp=m;
          if(this.LineViewSort.findIndex(m2=>m2.OrganizeID===m.OrganizeID)==-1)
          {
            this.LineViewSort.push(tmp);
          }
          else 
          {
            tmp=this.LineViewSort[this.LineViewSort.findIndex(m2=>m2.OrganizeID===m.OrganizeID)];
          }
          item.ViewSort = tmp.ViewSort;
          tmp.ViewSort=tmp.ViewSort+1
       
        }
      });
    
    },
    searchTree(msg) {
      this.treeData = [];
      let treeListTmp = JSON.parse(JSON.stringify(this.treeListTmp));
      let tmp = msg
        ? this.rebuildData(msg, treeListTmp)
        : JSON.parse(JSON.stringify(treeListTmp));
      this.treeData.push(...tmp);
    },
    rebuildData(value, arr) {
      if (!arr) {
        return [];
      }
      let newarr = [];
      if (Object.prototype.toString.call(arr) === "[object Array]") {
        arr.forEach((element) => {
          if (element.SupplierName.indexOf(value) > -1) {
            // const ab = this.rebuildData(value, element.children);
            const obj = {
              ...element,
              children: element.children,
            };
            newarr.push(obj);
          } else {
            if (element.children && element.children.length > 0) {
              const ab = this.rebuildData(value, element.children);
              const obj = {
                ...element,
                children: ab,
              };
              if (ab && ab.length > 0) {
                newarr.push(obj);
              }
            }
          }
        });
      }
      return newarr;
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
    handleChanged(file, fileList) {
      var ext = file.name.substring(file.name.lastIndexOf(".") + 1);
      const extension = ext === "xlsx" || ext === "xls";
      if (!extension) {
        this.$message.error("上传文件格式只能为xlsx/xls");
        // 取消时在文件列表中删除该文件
        this.$refs.upload.handleRemove(file);
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 50;
      if (!isLt2M) {
        this.$message.error("上传文件大小不能超过 50MB!");
        // 取消时在文件列表中删除该文件
        this.$refs.upload.handleRemove(file);
        return false;
      } else {
        this.file = file;
        this.fileList = fileList;
      }
    },
    handleRemove(file) {
      this.fileList.splice(
        this.fileList.findIndex((item) => item.url === file.url),
        1
      );
    },
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
      this.treeHeight = document.documentElement.clientHeight - 150 + "px";
      let headHeight = this.$refs.headRef.offsetHeight;

      let rem =
        document.documentElement.clientHeight -
        headHeight -
        this.$store.getters.reduceHeight;
      let newHeight = rem + "px";
      this.$set(this, "height", newHeight);
    },
    // 编辑行
    editRow(row) {},
    // 删除行
    delRow(row) {},
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
      this.$set(this.isClear, remarkTb, true);
      this.$set(this.tableLoading, remarkTb, true);
            this.formSearchs[remarkTb].datas["ControlID"]=this.userInfo.WorkFlowInstanceID;
      this.tablePagination[remarkTb].pageIndex = 1;
      this.getTableData(this.formSearchs[remarkTb].datas, remarkTb);
      setTimeout(() => {
        this.$set(this.isClear, remarkTb, false);
      }, 500);
    },
    // 重置
    dataReset(remarkTb) {
      for (let name in this.formSearchs[remarkTb].datas) {
        if (name != "dicID") {
          this.formSearchs[remarkTb].datas[name] = null;
        }
      }
    },
    // 通用直接保存
    async generalSaveData(newData, remarkTb, index) {
      this.adminLoading = true;
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
            this.verifyData(n);
            if (n.childrens && n.children.length != 0) {
              n.childrens.forEach((x) => {
                this.verifyData(x);
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
       // this.formSearchs[0].datas["Extend11"] = "CRTD";
        this.formSearchs[0].datas["ProductionStatus"] = 26; //默认待排
        this.dataSearch(0);
      }
    },
    // 验证数据
    verifyData(n) {
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
      //form["ControlID"] = "205";
      let res = await GetSearchData(form);
      const { result, data, count, msg } = res.data;
      this.adminLoading = false;
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
    // 选择数据
    selectFun(data, remarkTb, row) {
      this.selectionData[remarkTb] = data;
    },
    // 批量开始日期
    changeDate() {
      if (this.selectionData[0].length == 0) {
        this.$message.error("请选择需要批量填写开始日期的数据！");
      } else {
        this.selectionData[0].forEach((a) => {
          a.StartDate = this.ReplyDate;
        });
      }
    },
    tableRowClassName({ row, rowIndex }) {
      let className = "";
      if (row.DbResult !='' &&row.DbResult!='计算成功') {
        className += "bgRedColor";
      }
      return className;
    },
    // 行内列样式
    cellStyle({ row, column }) {},
    // 改变状态
    changeStatus(x, index) {
      this.labelStatus1 = index;
      if (index == 4) {
        if (this.tableData[1].length == 0) {
          this.dataSearch(1);
        }
        return;
      }
      let s = [];
      this.formSearchs[0].datas["Extend11"] = "";
      if (index === 0) {
        s = [];
      } else if (index === 1) {
       // this.formSearchs[0].datas["Extend11"] = "CRTD";
        s = [26];
      } else if (index === 2) {
        s = [21, 22, 23];
      } else if (index === 3) {
        s = [24];
      }
      this.formSearchs[0].datas["ProductionStatus"] = s;
      this.dataSearch(0);
    },
    // 计算排期与匹配拉线
    async computedScheduling() {
      let resultTag = this.getSelectionData(1);
      if (resultTag) {
        this.$message.error("工艺是否不为空！");
        return;
      }
      let submitData = this.tableData[1]; //this.selectionData[0];
      submitData.forEach((m) => {
        m.ReplyDate = this.ReplyDate;
        m["isChecked"] = true;
      });
      this.adminLoading = true;
      let res = await GetSearch(submitData, "/APSAPI/SchedulingV3");
      const { result, data, count, msg } = res.data;
      if (result) {
        this.tableData[1] = data;
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
    getSelectionData(tag) {
      let newData = this.selectionData[tag];

      let resultTag = false;
      if (newData.length != 0) {
        if (tag == 0) {
          newData.forEach((x,y) => {
            x.isChecked = true;

            if (!x.ProcessGroupID) {
              resultTag = true;
               this.$message.error((y+1)+"工艺不能为空");
            } else {
            }
          });
        } else {
          newData.forEach((x) => {
            if (x.isChecked) {
            }
          });
        }
      }
      return resultTag;
    },
    // 下发周计划
    async setWeekData(index) {
      let resultTag = this.getSelectionData(0);
      if (resultTag) {
        this.$message.error("工艺不能为空");
        return;
      }
      let submitData = this.selectionData[0];
      if (submitData.length == 0) {
        this.$message.error("请选择需要下达的数据！");
        return;
      }
         
      submitData.forEach((m) => {
        m["MOSchedulingType"] = 3;
      });
      this.adminLoading = true;
      let res = await MOPlanStep1(submitData);
      const { result, data, count, msg } = res.data;
      if (result) {
        if (index == 1) {
          this.labelStatus1 = 4;
          this.dataSearch(1);
        } else {
          this.dataSearch(0);
        }
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
    // 暂停计划
    async parseData() {
      this.SetData(24);
    },
    async reData() {
      this.SetData(26);
    },
    // 退回
    backData() {
     if (this.selectionData[1].length == 0) {
        this.$message.error("请选择需要操作的数据！");
      } else {
        this.adminLoading = true;
        this.selectionData[1].forEach((a) => {
         a["ElementDeleteFlag"]=1;
        });
        this.dataSave(this.selectionData[1], 1);
      }
    },
       // 保存
    async save(remarkTb, index, parms, newData) {
          if(this.NoWorkHour.length>0&&remarkTb==0)
      {

        this.selectionData[remarkTb]=this.selectionData[remarkTb].concat(this.NoWorkHour);
        
      }
        if (this.selectionData[remarkTb].length == 0) {
        this.$message.error("请选择需要操作的数据！");
      } else {
     
       this.dataSave(this.selectionData[remarkTb],remarkTb);
      }
       
 
    },
    async dataSave(newData, remarkTb) {
      let res = await GetSearch(newData, "/APSAPI/SaveData");
      const { result, data, count, msg } = res.data;
      this.adminLoading = false;
      if (result) {
             this.$set(this.selectionData, remarkTb, []);
          this.NoWorkHour=[]
 
        this.dataSearch(remarkTb);
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
    },
    async SetData(status) {
      let submitData = this.selectionData[0];
      if (submitData.length == 0) {
        this.$message.error("请选择数据！");
        return;
      }
      submitData.forEach((m) => {
        m.ProductionStatus = status;
      });

      this.adminLoading = true;
      let res = await GetSearch(submitData, "/APSAPI/SaveData");
      const { result, data, count, msg } = res.data;
      this.adminLoading = false;
      if (result) {
        this.dataSearch(0);

        this.$message({
          message: msg,
          type: "success",
          dangerouslyUseHTMLString: true,
        });
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
    },
    // 进入分线列表
    insertList() {
      if (this.selectionData[0].length == 0) {
        this.$message.error("请选择要进入分线列表的数据！");
      } else {
   
        // 进入预排计划

        this.setWeekData(1);
      }
    },
    //正排倒排计算，匹配拉线
    async MOPlanStep1Calculation() {
      // if (this.selectionData[1].length == 0) {
      //   this.$message.error("请选择需要批量填写开始日期的数据！");
      //   return;
      // }
      let submitData = [];
      this.tableData[1].forEach((x) => {
        x["Type"] = 0;
        x["dicID"] = 7952;
        x["isChecked"] = true;
        submitData.push(x);
      });

      if (submitData.length == 0) {
        this.$message.error("请选择需要计算的数据！");
      } else {
        this.adminLoading = true;
        let res = await GetSearch(submitData, "/APSAPI/MOPlanStep1Calculation");
        const { data, forms, result, msg } = res.data;
        if (result) {
          this.$set(this.tableData, 1, data);
          // 清空选中的，把选中的数据重新绑定
          
          this.resultMsg=res.data.resultMsg

          let templateData = JSON.parse(JSON.stringify(this.selectionData[1]));
          this.$set(this.selectionData, 1, []);
          let newData = this.tableData[1].filter((a) =>
            templateData.some((b) => b.OrderID == a.OrderID)
          );
          if (newData.length != 0) {
            newData.forEach((c) => {
              this.$nextTick(() => {
                _this.$refs.tableRefTwo.$refs.vxeTable.setCheckboxRow(c, true);
                _this.selectionData[1].push(c);
              });
            });
          }
         // console.log(this.selectionData[1]);
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
      }
    },
    // 齐套计算
    async dataComputedDate() {
      // if (this.selectionData[1].length == 0) {
      //   this.$message.error("请选择需要批量填写开始日期的数据！");
      //   return;
      // }
      this.adminLoading = true;
      let res = await OrderPlanMaterialForm(this.tableData[1]);
      const { data, forms, result, msg } = res.data;
      if (result) {
        this.adminLoading = false;
        this.$set(this.tableData, 1, data);
        let templateData = JSON.parse(JSON.stringify(this.selectionData[1]));
        this.$set(this.selectionData, 1, []);
        // 清空选中的，把选中的数据重新绑定
        let newData = this.tableData[1].filter((a) =>
          templateData.some((b) => b.OrderID == a.OrderID)
        );
        if (newData.length != 0) {
          newData.forEach((c) => {
            this.$nextTick(() => {
              _this.$refs.tableRefTwo.$refs.vxeTable.setCheckboxRow(c, true);
              _this.selectionData[1].push(c);
            });
          });
        }
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
      // }
    },
    // 下达
    async MOPlanSaveToDayPlan() {
      if (this.selectionData[1].length == 0) {
        this.$message.error("请选择需要更新的计划！");
        return;
      }
      let submitData = this.selectionData[1]; //this.selectionData[1];这里有错误，如果取selection，获取到的是旧数据（没有匹配拉线前的）
      submitData.forEach((m) => {
        m["MOSchedulingType"] = 1;
        m["dicID"] = 7952;
      });
      this.adminLoading = true;
      let res = await GetSearch(submitData, "/APSAPI/MOPlanSaveToDayPlan");
      const { result, data, count, msg } = res.data;
      if (result) {
        this.dataSearch(1);
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
  },
};
</script>