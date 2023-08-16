<template>
  <div class="container" v-loading="adminLoading">
    <div class="up_admin" ref="up_admin">
      <div class="admin_head" ref="headRef">
        <ComSearch
          ref="searchRef"
          :searchData="formSearchs[0].datas"
          :searchForm="formSearchs[0].forms"
          :remark="0"
          :isLoading="isLoading[0]"
          :btnForm="btnForm[0]"
          @btnClick="btnClick"
        />
      </div>
      <div>
        <div class="admin_content">
          <div class="ant-table-title" ref="ant1">
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
          <ComUmyTable
            :rowKey="'RowNumber'"
            :height="height1"
            :tableData="tableData[0]"
            :tableHeader="tableColumns[0]"
            :tableLoading="tableLoading[0]"
            :remark="0"
            :sysID="1180"
            :isEdit="isEdit"
            :hasSelect="true"
            :isClear="isClear[0]"
            :pagination="tablePagination[0]"
            @pageChange="pageChange"
            @pageSize="pageSize"
            @sortChange="sortChange"
            @selectfun="selectFun"
          />
        </div>
      </div>
    </div>

    <div class="down_admin">
      <div class="admin_head" ref="headRef2">
        <ComSearch
          v-show="labelStatus2 == 1"
          ref="searchRef"
          :searchData="formSearchs[1].datas"
          :searchForm="formSearchs[1].forms"
          :remark="1"
          :isLoading="isLoading[1]"
          :btnForm="btnForm[1]"
          @btnClick="btnClick"
        />
        <ComSearch
          v-show="labelStatus2 == 2"
          ref="searchRef"
          :searchData="formSearchs[2].datas"
          :searchForm="formSearchs[2].forms"
          :remark="2"
          :isLoading="isLoading[2]"
          :btnForm="btnForm[2]"
          @btnClick="btnClick"
        />
        <ComSearch
          v-show="labelStatus2 == 3"
          ref="searchRef"
          :searchData="formSearchs[3].datas"
          :searchForm="formSearchs[3].forms"
          :remark="3"
          :isLoading="isLoading[3]"
          :btnForm="btnForm[3]"
          @btnClick="btnClick"
        />
      </div>
      <div>
        <div class="admin_content">
          <div class="ant-table-title" ref="ant2">
            <el-row>
              <el-col :span="4"
                ><span class="title">{{ title2 }}</span></el-col
              >
              <el-col :span="20" class="flex_flex_end">
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
              </el-col>
            </el-row>
          </div>
          <ComUmyTable
            v-show="labelStatus2 == 1"
            :rowKey="'RowNumber'"
            :height="height2"
            :tableData="tableData[1]"
            :tableHeader="tableColumns[1]"
            :tableLoading="tableLoading[1]"
            :remark="1"
            :sysID="1175"
            :isEdit="isEdit"
            :isClear="isClear[1]"
            :pagination="tablePagination[1]"
            @handleRowClick="handleRowClick"
            @pageChange="pageChange"
            @pageSize="pageSize"
            @sortChange="sortChange"
          />
          <ComUmyTable
            v-show="labelStatus2 == 2"
            :rowKey="'RowNumber'"
            :height="height2"
            :tableData="tableData[2]"
            :tableHeader="tableColumns[2]"
            :tableLoading="tableLoading[2]"
            :remark="2"
            :isEdit="isEdit"
            :sysID="14"
            :isClear="isClear[2]"
            :pagination="tablePagination[2]"
            @handleRowClick="handleRowClick"
            @pageChange="pageChange"
            @pageSize="pageSize"
            @sortChange="sortChange"
          />
          <ComUmyTable
            v-show="labelStatus2 == 3"
            :rowKey="'RowNumber'"
            :height="height2"
            :tableData="tableData[3]"
            :tableHeader="tableColumns[3]"
            :tableLoading="tableLoading[3]"
            :remark="3"
            :isEdit="isEdit"
            :sysID="15"
            :isClear="isClear[3]"
            :pagination="tablePagination[3]"
            @pageChange="pageChange"
            @pageSize="pageSize"
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
import ComUmyTable from "@/components/ComUmyTable";
import {
  GetHeader,
  GetHeaderTwo,
  GetSearchData,
  ExportData,
  SaveData,
  UpdateProcess,
  GetSearch,
} from "@/api/Common";
import { SaveSalesPlan } from "@/api/PageSale";
export default {
  name: "CategoryInfo",
  components: {
    ComSearch,
    ComUmyTable,
  },
  data() {
    return {
      ////////////////// Search /////////////////
      delData: [[], [], [], []],
      title: this.$route.meta.title,
      title2: "工艺列表",
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
      btnForm: [[], [], [], []],
      parmsBtn: [
        [],
        [
          {
            ButtonCode: "save",
            BtnName: "建立关联",
            Type: "success",
            Ghost: true,
            Size: "small",
            Methods: "setContact",
            Icon: "",
            Params: {},
          },
          {
            ButtonCode: "save",
            BtnName: "保存",
            Type: "success",
            Ghost: true,
            Size: "small",
            Methods: "dataSave",
            Icon: "",
            Params: {},
          },
          {
            ButtonCode: "delete",
            BtnName: "删除",
            Type: "danger",
            Ghost: true,
            Size: "small",
            Methods: "dataDel",
            Params: { dataName: "delData" },
            Icon: "",
          },
        ],
        [
          {
            ButtonCode: "save",
            BtnName: "保存",
            Type: "success",
            Ghost: true,
            Size: "small",
            Methods: "dataSave",
            Icon: "",
            Params: {},
          },
          {
            ButtonCode: "delete",
            BtnName: "删除",
            Type: "danger",
            Ghost: true,
            Size: "small",
            Methods: "dataDel",
            Params: { dataName: "delData" },
            Icon: "",
          },
        ],
        [
          {
            ButtonCode: "save",
            BtnName: "保存",
            Type: "success",
            Ghost: true,
            Size: "small",
            Methods: "dataSave",
            Icon: "",
            Params: {},
          },
        ],
      ],
      selectionData: [[]],
      scrollTop: 0,
      tableData: [[], [], [], []],
      tableColumns: [[], [], [], []],
      tableLoading: [false, false, false, false],
      isClear: [false, false, false, false],
      tablePagination: [
        { pageIndex: 1, pageSize: 50, pageTotal: 0 },
        { pageIndex: 1, pageSize: 50, pageTotal: 0 },
        { pageIndex: 1, pageSize: 50, pageTotal: 0 },
        { pageIndex: 1, pageSize: 50, pageTotal: 0 },
      ],
      height1: "200px",
      height2: "200px",
      showPagination: true,
      tagRemark: 0,
      isLoading: [false, false, false, false],
      isEdit: false,
      Status1: [
        { label: "全部", value: "" },
        { label: "工艺缺失", value: "" },
        { label: "产能缺失", value: "" },
      ],
      Status2: [
        { label: "工艺", value: 1, title: "工艺列表" },
        { label: "工序", value: 2, title: "工序列表" },
        { label: "产能", value: 3, title: "产能列表" },
      ],
      labelStatus1: 0,
      labelStatus2: 1,
      adminLoading: false,
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
    this.adminLoading = true;
    this.judgeBtn();
    this.getTableHeader();
  },
  mounted() {
    setTimeout(() => {
      _this.setHeight();
    }, 600);
  },
  methods: {
    // 判断按钮权限
    judgeBtn() {
      let routeBtn = this.$route.meta.btns;
      let permission = false;
      if (routeBtn.length != 0) {
        for (var i = 0; i < 4; i++) {
          let newBtn = [];
          let newData = [];
          routeBtn.forEach((x) => {
            if (x.ButtonCode == "edit") {
              permission = true;
            }
            if (this.parmsBtn[i].length != 0) {
              newData = this.parmsBtn[i].filter((y) => {
                return x.ButtonCode == y.ButtonCode;
              });
            }
            if (newData.length != 0) {
              newBtn = newBtn.concat(newData);
            }
          });
          this.$set(this.btnForm, i, newBtn);
        }
      }
      this.$set(this, "isEdit", permission);
    },
    // 高度控制
    setHeight() {
      let headHeight = this.$refs.headRef.offsetHeight;
      let headHeight2 = this.$refs.headRef2.offsetHeight;
      let headHeight3 = this.$refs.ant1.offsetHeight;
      let headHeight4 = this.$refs.ant2.offsetHeight;
      let rem =
        document.documentElement.clientHeight -
        headHeight -
        headHeight2 -
        this.$store.getters.reduceHeight -
        headHeight3 -
        headHeight4;
      let newHeight1 = Math.floor(rem / 2) - 10 + "px";
      let newHeight2 = Math.floor(rem / 2) - 20 + "px";
      this.$set(this, "height1", newHeight1);
      this.$set(this, "height2", newHeight2);
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
    // 滚动
    scroll({ scrollTop, scrollLeft }) {
      this.scrollTop = scrollTop;
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
    // 选择数据
    selectFun(data, remarkTb, row) {
      this.selectionData[remarkTb] = data;
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
      this.isLoading[remarkTb] = true;
      let form = JSON.parse(JSON.stringify(this.formSearchs[remarkTb].datas));
      form["rows"] = 0;
      let res = await ExportData(form);
      this.isLoading[remarkTb] = false;
      this.$store.dispatch("user/exportData", res.data);
    },
    // 保存
    async dataSave(remarkTb, index, parms) {
      let newData = [];
      if (parms && parms.dataName) {
        if (this.selectionData[remarkTb].length == 0) {
          this.$message.error("请选择需要操作的数据！");
          return;
        } else {
          newData = this.selectionData[remarkTb];
        }
      } else {
        newData = this.tableData[remarkTb];
      }
      this.adminLoading = true;
      let res = await SaveData(newData);
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
      let IDs = [{ ID: 1180 }, { ID: 1175 }, { ID: 14 }, { ID: 15 }];
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
        this.adminLoading = false;
        this.getTableData(this.formSearchs[0].datas, 0);
        this.getTableData(this.formSearchs[1].datas, 1);
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
      // this.getAutoHeader(IDs);
    },
    // 获取动态日期表头
    async getAutoHeader(IDs) {
      let resTwo = await GetHeaderTwo(IDs);
      const { datas, dresult, msg } = resTwo.data;
      if (dresult) {
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
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
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
        if (Columns && Columns.length != 0) {
          Columns[0].some((n, i) => {
            this.verifyDta(n);
          });
          this.$set(this.tableColumns, remarkTb, Columns[0]);
        }
        this.$set(this.tableData, remarkTb, data);
        // this.$refs.plxTable.reloadData(data);
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
    // 改变状态
    changeStatus(item, index) {
      this.labelStatus1 = index;
      if (index == 1) {
        this.formSearchs[0].datas["ProcessCount"] = 0;
        this.formSearchs[0].datas["CapacityCount"] = "";
      } else if (index == 2) {
        this.formSearchs[0].datas["CapacityCount"] = 0;
        this.formSearchs[0].datas["ProcessCount"] = "";
      } else {
        this.formSearchs[0].datas["ProcessCount"] = "";
        this.formSearchs[0].datas["CapacityCount"] = "";
      }
      this.dataSearch(0);
    },
    // 改变状态
    changeStatus2(item, index) {
      this.labelStatus2 = item.value;
      this.title2 = item.title;
      if (this.tableData[item.value].length == 0) {
        this.dataSearch(item.value);
      }
    },
    // 产品与工艺关联
    setContact(remarkTb, index) {
      if (this.selectionData[0].length == 0) {
        this.$message.error("请勾选产品！");
      } else if (this.delData[1].length == 0) {
        this.$message.error("请单击选择工艺！");
      } else {
        let objs = [];
        this.selectionData[0].some((x, i) => {
          let obj = {
            materialID: x.MaterialID,
            processGroupID: this.delData[1][0].ProcessGroupID,
          };
          objs.push(obj);
        });
        this.submitData(objs);
      }
    },
    // 提交配置的工艺
    async submitData(obj) {
      this.adminLoading = true;

      let res = await GetSearch(obj, "/APSAPI/UpdateProcessV2");
      const { result, data, count, msg } = res.data;
      this.adminLoading = false;
      if (result) {
        this.dataSearch(0);
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
    },
    // 单击行
    handleRowClick(row, remarkTb) {
      this.delData[remarkTb] = [];
      this.delData[remarkTb].push(row);
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
            obj["dicID"] = 1;
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
          _this.dataSave(remarkTb, index, null, newData);
        })
        .catch((_) => {});
    },
    // 通用直接保存
    async generalSaveData(newData, remarkTb, index) {
      this.adminLoading = true;
      let res = await SaveData(newData);
      const { result, data, count, msg } = res.data;
      if (result) {
        this.dataSearch(remarkTb);
        this.$message({
          message: msg,
          type: "success",
          dangerouslyUseHTMLString: true,
        });

        this.adminLoading = false;
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });

        this.adminLoading = false;
      }
    },
    // 保存返回结果自己处理事件
    async returnResultData(newData) {
      let res = await SaveData(newData);
      return res;
    },
  },
};
</script>
