<!--产品关联模具-->
<template>
  <div
    class="container"
    v-loading="adminLoading"
  >
    <div
      class="admin_head"
      ref="headRef"
    >
      <div>
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
              <div>
                <el-radio
                  v-model="losePrepareDate"
                  :label="0"
                  @click.native.prevent="clickitem(1)"
                >未配置模具</el-radio>
                <el-divider direction="vertical"></el-divider>
                <el-select
                  clearable
                  size="mini"
                  filterable
                  v-model="MachineMouldID"
                >
                  <el-option
                    v-for="(item,i) in molds"
                    :key="i"
                    :label="item.MoldName"
                    :value="item.MachineMouldID"
                  >
                  </el-option>
                </el-select>
                <el-divider direction="vertical"></el-divider>
                <el-button
                  type="primary"
                  size="mini"
                  @click="changeMold"
                >
                  配置模具
                </el-button>
                <el-divider direction="vertical"></el-divider>
              </div>
            </el-col>
          </el-row>
        </div>
        <div>
          <ComVxeTable
            :rowKey="'RowNumber'"
            :height="height"
            :tableData="tableData[0]"
            :tableHeader="tableColumns[0]"
            :tableLoading="tableLoading[0]"
            :isEdit="isEdit"
            :hasSelect="hasSelect[0]"
            :remark="0"
            :cellStyle="cellStyle0"
            :checCheckboxkMethod="checCheckboxkMethod"
            :sysID="sysID[0].ID"
            :isClear="isClear[0]"
            :pagination="tablePagination[0]"
            @pageChange="pageChange"
            @pageSize="pageSize"
            @selectfun="selectFun"
            @sortChange="sortChange"
          />
        </div>
      </div>
    </div>

    <el-dialog
      title="提示"
      :visible.sync="showDialog"
      width="30%"
    >
      <span>您选中的数据存在已配置模具的产品</span>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          @click="showDialog = false"
          size="small"
        >取 消</el-button>
        <!-- <el-button
          @click="btnClick_1"
          size="small"
          type="danger"
        >作废旧的并添加</el-button> -->
        <el-button
          type="primary"
          size="small"
          @click="btnClick_2"
        >直接替换</el-button>
      </span>
    </el-dialog>

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
  name: "ProductMold",
  components: {
    ComSearch,
    ComVxeTable,
  },
  data() {
    return {
      ////////////////// Search /////////////////
      showDialog: false,
      hasSelect: [true, true, true, false],
      sysID: [{ ID: 3066 }],
      title: "产品关联模具表",
      adminLoading: false,
      checkdBtnCodes: [],
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
      btnForm: [],
      parmsBtn: [],
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
      MachineMouldID: "",
      molds: [],
    };
  },
  watch: {},
  created() {
    _this = this;
    this.adminLoading = true;
    this.getTableHeader();
    // 获取所有按钮
    this.getMoldData();
    this.judgeBtn();
  },
  mounted() {
    setTimeout(() => {
      this.setHeight();
    }, 450);
  },
  methods: {
    // 获取所有有效的模具
    async getMoldData() {
      let form = { dicID: 108, rows: 0, Status: 1 };
      let res = await GetSearchData(form);
      const { result, data, count, msg } = res.data;
      if (result) {
        this.molds = data;
      } else {
        this.adminLoading = false;
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
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
      if (data.length != 0) {
        data.forEach((x) => {
          if (x.MachineMouldIDs) {
            this.$set(x, "ToList", x.MachineMouldIDs.split(","));
          } else {
            this.$set(x, "ToList", []);
          }
          if (x.MachineMouldMaterials) {
            this.$set(x, "ToList_2", x.MachineMouldMaterials.split(","));
          } else {
            this.$set(x, "ToList_2", []);
          }
        });
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
    // 配置模具
    changeMold() {
      if (!this.MachineMouldID) {
        this.$message.error("请先选择配置的模具！");
        return;
      }
      if (this.selectionData[0].length == 0) {
        this.$message.error("请选择需要配置模具的数据！");
      } else {
        let submitData = [];
        let flag = 0;
        this.selectionData[0].forEach((a) => {
          let obj = JSON.parse(JSON.stringify(a));
          if (a.MoldNames) {
            flag = 1;
          }
        });
        if (flag == 1) {
          this.showDialog = true;
        } else {
          this.selectionData[0].forEach((a) => {
            let obj = JSON.parse(JSON.stringify(a));
            a["dicID"] = 111;
            a["MachineMouldID"] = this.MachineMouldID;
            submitData.push(a);
          });
          this.generalSaveData(submitData, 0);
        }
      }
    },
    // 作废之前的并添加新的
    btnClick_1() {
      let filterData = this.selectionData[0].filter((a) => a.MoldNames);
      let newData = [];
      filterData.forEach((a) => {
        let ToList = JSON.parse(JSON.stringify(a.ToList));
        ToList.forEach((b) => {
          let obj1 = {};
          obj1["dicID"] = 108;
          obj1["MachineMouldID"] = b;
          obj1["Status"] = 0;
          newData.push(obj1);
        });
      });
      this.selectionData[0].forEach((a) => {
        let obj = JSON.parse(JSON.stringify(a));
        let obj2 = JSON.parse(JSON.stringify(a));
        obj["dicID"] = 111;
        obj2["dicID"] = 12;
        obj2["ChangeOldMold"] = obj2.MoldNames;
        obj["MachineMouldID"] = this.MachineMouldID;
        newData.push(obj);
        newData.push(obj2);
      });
      this.generalSaveData(newData, 0);
      this.showDialog = false;
    },
    // 直接覆盖
    btnClick_2() {
      // 删除旧的，添加新的
      let filterData = this.selectionData[0].filter((a) => a.MoldNames);
      let newData = [];
      filterData.forEach((a) => {
        let ToList_2 = JSON.parse(JSON.stringify(a.ToList_2));
        ToList_2.forEach((b) => {
          let obj1 = {};
          obj1["dicID"] = 111;
          obj1["MachineMouldMaterial"] = b;
          obj1["ElementDeleteFlag"] = 1;
          newData.push(obj1);
        });
      });
      this.selectionData[0].forEach((a) => {
        let obj = JSON.parse(JSON.stringify(a));
        let obj2 = JSON.parse(JSON.stringify(a));
        obj2["ChangeOldMold"] = obj2.MoldNames;
        obj["dicID"] = 111;
        obj2["dicID"] = 12;
        obj["MachineMouldID"] = this.MachineMouldID;
        newData.push(obj);
        newData.push(obj2);
      });
      this.generalSaveData(newData, 0);
      this.showDialog = false;
    },
    // 是否只显示没有配置模具的
    clickitem(val) {
      val == this.losePrepareDate
        ? (this.losePrepareDate = 0)
        : (this.losePrepareDate = 1);
      if (this.losePrepareDate == 0) {
        this.formSearchs[0].datas["MoldNames"] = "null";
      } else {
        this.formSearchs[0].datas["MoldNames"] = "";
      }
      this.dataSearch(0);
    },
    // 禁用正在生产的产品，不可更改绑定模具信息
    checCheckboxkMethod({row}) {
      if (row["IsChange"]) {
        return false;
      } else {
        return true;
      }
    },
  },
};
</script>