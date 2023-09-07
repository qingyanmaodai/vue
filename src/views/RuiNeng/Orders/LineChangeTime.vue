<!--生产订单 -->
<template>
  <div class="container">
    <div class="admin_head" ref="headRef">
      <div v-for="i in [0]" :key="i" v-show="labelStatus1 == i">
        <ComSearch
          ref="searchRef"
          :searchData="formSearchs[i].datas"
          :searchForm="formSearchs[i].forms"
          :remark="i"
          :isLoading="isLoading"
          :btnForm="btnForm"
          :signName="labelStatus1"
          :Region="Region[i]"
          @btnClick="btnClick"
        />
      </div>
    </div>
    <div>
      <div class="admin_content">
        <div class="ant-table-title">
          <el-row>
            <el-col :span="4"
              ><span class="title">{{ title }}</span></el-col
            >
            <el-col :span="20" class="flex_flex_end">
              <!-- <div
                
                v-for="(item, y) in Status1"
                :key="y"
              >
                <span @click="changeStatus(item, y)" :class="labelStatus1 == y ? 'statusActive cursor' : 'cursor'">{{ item.label }}</span>
                <el-divider direction="vertical"></el-divider>
              </div> -->
            </el-col>
          </el-row>
        </div>
        <div v-for="item in [0]" :key="item" v-show="labelStatus1 == item">
          <ComVxeTable
            ref="tableRef"
            :rowKey="'RowNumber'"
            :height="height"
            :tableData="tableData[0]"
            :tableHeader="tableColumns[0]"
            :tableLoading="tableLoading[0]"
            :remark="0"
            :sysID="10110"
            :hasSelect="true"
            :isEdit="isEdit"
            :isClear="isClear[0]"
            :keepSource="true"
            :pagination="tablePagination[0]"
            @configprocess="configprocess"
            @pageChange="pageChange"
            @pageSize="pageSize"
            @sortChange="sortChange"
            @selectfun="selectFun"
          />
        </div>
      </div>
    </div>

    <!-- 工艺配置 -->
    <el-dialog title="选择工艺" :visible.sync="processDialog" width="16.8%">
      <el-form label-width="110px">
        <el-form-item label="请选择工艺：">
          <el-select v-model="ProcessGroupID" clearable filterable>
            <el-option
              v-for="item in processGroupOptions"
              :key="item.ProcessGroupID"
              :label="item.ProcessGroupName"
              :value="item.ProcessGroupID"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="processDialog = false" size="small">取 消</el-button>
        <el-button type="primary" @click="sureProcess" size="small"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <el-dialog :title="'批量设置'" :visible.sync="Dialog" width="22%">
      <div class="flex_column" style="padding: 20px">
        <div class="flex_wrap" style="margin-bottom: 20px">
          <div>
            存储属性:
            <el-select
              clearable
              filterable
              size="small"
              placeholder="请选择存储属性"
              v-model="storageProperty"
              style="width: 120px; margin: 0 20px 0 10px"
            >
              <el-option
                v-for="(item, i) in storagePropertyItems"
                :key="i"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <el-button type="primary" size="mini" @click="changeDate(0)">
            批量应用
          </el-button>
        </div>
        <div class="flex_wrap" style="margin-bottom: 20px">
          <div>
            托盘数量:
            <el-input
              type="number"
              v-model="palletQuantity"
              size="small"
              style="width: 120px; margin: 0 20px 0 10px"
            ></el-input>
          </div>
          <el-button type="primary" size="mini" @click="changeDate(1)">
            批量应用
          </el-button>
        </div>
        <div class="flex_wrap" style="margin-bottom: 20px">
          <div>
            其他属性:
            <el-input
              type="number"
              v-model="otherProperty"
              size="small"
              style="width: 120px; margin: 0 20px 0 10px"
            ></el-input>
          </div>
          <el-button type="primary" size="mini" @click="changeDate(2)">
            批量应用
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ComSearch from "@/components/ComSearch";
import ComVxeTable from "@/components/ComVxeTable";
import {
  GetHeader,
  GetSearchData,
  ExportData,
  UpdateProcess,
  SaveData,
} from "@/api/Common";
import { OneStepReleaseByOrder } from "@/api/PageOrder";
export default {
  name: "LineChangeTime",
  components: {
    ComSearch,
    ComVxeTable,
  },
  data() {
    return {
      ////////////////// Search /////////////////
      title: this.$route.meta.title,
      drawer: false,
      Dialog: false,
      selectionData: [[]],
      formSearchs: [
        {
          datas: {},
          forms: [],
        },
      ],
      btnForm: [],
      parmsBtn: [
        {
          ButtonCode: "releasedOrder",
          BtnName: "下达",
          Type: "success",
          Ghost: true,
          Size: "small",
          Methods: "setOrder",
          Icon: "",
          isLoading: false,
          signName: 2,
        },
        {
          ButtonCode: "save",
          BtnName: "保存",
          Type: "primary",
          Ghost: true,
          Size: "small",
          Methods: "dataSave",
          Icon: "",
          isLoading: false,
          signName: "",
        },
      ],
      tableData: [[]],
      tableColumns: [[]],
      tableLoading: [false],
      isClear: [false],
      hasSelect: [false],
      Region: [6],
      tablePagination: [{ pageIndex: 1, pageSize: 200, pageTotal: 0 }],
      height: "707px",
      showPagination: true,
      tagRemark: 0,
      isLoading: false,
      labelStatus1: 0,
      ProcessGroupID: "",
      sysID: [{ ID: 5156 }],
      Status1: [
        { label: "全部", value: "" },
        { label: "已下达", value: [21, 22, 23, 24] },
        { label: "未下达", value: 26 },
        { label: "已完成", value: 25 },
      ],
      isSelect: false,
      isEdit: true,
      dialogCurrentRow: "",
      processGroupOptions: [],
      processDialog: false,
      storageProperty: null,
      palletQuantity: null,
      otherProperty: null,
      storagePropertyItems: [
        {
          title: "是",
          value: "是",
          label: "是",
          text: "是",
        },
        {
          title: "否",
          value: "否",
          label: "否",
          text: "否",
        },
      ],
    };
  },
  watch: {},
  created() {
    // 获取所有按钮
    this.btnForm = this.$route.meta.btns;
    this.judgeBtn(this.btnForm);
    this.getTableHeader();
  },
  mounted() {
    setTimeout(() => {
      this.setHeight();
    }, 450);
  },
  methods: {
    judgeBtn(routeBtn) {
      if (routeBtn && routeBtn.length > 0)
        routeBtn.some((item, index) => {
          if (item.ButtonCode == "save") {
            this.$set(this, "isEdit", true);
          }
        });
      this.$set(this, "btnForm", routeBtn);
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
      // this.formSearchs[remarkTb].datas["ProductionStatus"] = this.Status1[
      //   this.labelStatus1
      // ].value;
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
      console.log(this.tableData[0]);
      const $table = this.$refs.tableRef.$refs.vxeTable;
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
    // 下达
    // async setOrder(remarkTb, index) {
    //   let res = await OneStepReleaseByOrder(form);
    //   const { result, data, count, msg } = res.data;
    //   if (result) {
    //     this.dataSearch(0);
    //     this.$message({
    //       message: msg,
    //       type: "success",
    //       dangerouslyUseHTMLString: true,
    //     });
    //   } else {
    //     this.$message({
    //       message: msg,
    //       type: "error",
    //       dangerouslyUseHTMLString: true,
    //     });
    //   }
    // },
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
          m.some((n, index) => {
            if (index === 1) {
              this.tablePagination[i]["pageSize"] = n["pageSize"];
              this.hasSelect[i] = n["IsSelect"];
              this.Region[i] = n["Region"] ? n["Region"] : this.Region[i];
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
    ////////////////其他事件///////////////
    // 改变状态
    changeStatus(item, index) {
      this.labelStatus1 = index;
      this.formSearchs[0].datas["ProductionStatus"] = item.value;
      this.dataSearch(0);
    },
    // 配置工艺按钮
    async configprocess(row) {
      this.dialogCurrentRow = row;
      let res = await GetSearchData({ dicID: 1175 });
      const { result, data, count, msg } = res.data;
      if (result) {
        this.ProcessGroupID = row.ProcessGroupID;
        this.processGroupOptions = data;
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
      this.processDialog = true;
    },
    // 选择数据
    selectFun(data, remarkTb, row) {
      this.selectionData[remarkTb] = data;
    },
    // 确定当前工艺
    async sureProcess() {
      let obj = {};
      obj["materialID"] = this.dialogCurrentRow.MaterialID;
      obj["processGroupID"] = this.ProcessGroupID;
      let res = await UpdateProcess(obj);
      const { result, data, count, msg } = res.data;
      if (result) {
        this.dataSearch(0);
        this.processDialog = false;
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
    },
    // 批量设置
    batchSetting() {
      if (this.selectionData[0].length === 0) {
        this.$message.error("请选择要批量设置的数据！");
        return;
      }
      this.Dialog = true;
    },
    //批量应用
    async changeDate(val) {
      if (val === 0) {
        this.selectionData[0].map((item) => {
          item["Extend18"] = this.storageProperty;
          item["Extend18Text"] = this.storageProperty;
        });
        let res = await SaveData(this.selectionData[0]);
        this.storageProperty = null;
      } else if (val === 1) {
        this.selectionData[0].map((item) => {
          item["TrayOfQty"] = this.palletQuantity;
        });
        let res = await SaveData(this.selectionData[0]);
        this.palletQuantity = null;
      } else if (val === 2) {
        this.selectionData[0].map((item) => {
          item["Extend20"] = this.otherProperty;
        });
        let res = await SaveData(this.selectionData[0]);
        this.otherProperty = null;
      }
    },
  },
};
</script>
