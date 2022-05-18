<!--菜单设置-->
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
        v-for="(item,i) in Status1"
        :key="i"
        v-show="labelStatus1 == i"
        ref="searchRef"
        :searchData="formSearchs[i].datas"
        :searchForm="formSearchs[i].forms"
        :remark="i"
        :isLoading="isLoading"
        :btnForm="btnForm"
        @btnClick="btnClick"
      />
    </div>
    <div>
      <div class="admin_content">
        <div
          class="ant-table-title"
          v-show="labelStatus1 != 3 || expendColl2"
        >
          <el-row>
            <el-col :span="8"><span
                class="title"
                v-show="labelStatus1 == 3"
                v-html=" '日期：2021-02-18 &nbsp;&nbsp; 生产线：A2 &nbsp;&nbsp; 负责人：张川 ' "
              > </span></el-col>
            <el-col
              :span="16"
              class="flex_flex_end"
            >

              <div
                :class="labelStatus1 == item.value ? 'statusActive cursor' : 'cursor'"
                v-for="(item, y) in Status1"
                :key="y"
              >
                <span @click="changeStatus(item, y)">{{ item.label }}</span>
                <el-divider direction="vertical"></el-divider>
              </div>
              <el-tooltip
                class="item"
                effect="dark"
                :content="expendCollText"
                placement="top"
              >
                <span
                  class="right_icon"
                  v-show="labelStatus1 == 3"
                >
                  <img
                    v-show="!expendColl"
                    src="../../../assets/svg/collapse.svg"
                    @click="systolic"
                    style="width:1.4rem;height:1.4rem"
                  />
                  <img
                    v-show="expendColl"
                    src="../../../assets/svg/expend.svg"
                    @click="systolic"
                    style="width:1.4rem;height:1.4rem"
                  />
                </span>
              </el-tooltip>
            </el-col>
          </el-row>
        </div>
        <div
          v-for="(x,y) in 3"
          :key="y"
          v-show="labelStatus1 == y"
        >
          <ComVxeTable
            :rowKey="'RowNumber'"
            :height="height"
            :tableData="tableData[y]"
            :tableHeader="tableColumns[y]"
            :tableLoading="tableLoading[y]"
            :remark="y"
            :sysID="sysID[y].ID"
            :isClear="isClear[y]"
            :pagination="tablePagination[y]"
            @pageChange="pageChange"
            @setProduction="setProduction"
            @pageSize="pageSize"
            @sortChange="sortChange"
          />
        </div>
        <div v-show="labelStatus1 == 3">
          <ComVxeTable
            v-show="expendColl2"
            :rowKey="'RowNumber'"
            :height="height1"
            :tableData="tableData[3]"
            :tableHeader="tableColumns[3]"
            :tableLoading="tableLoading[3]"
            :remark="3"
            :sysID="sysID[3].ID"
            :isClear="isClear[3]"
            :pagination="tablePagination[3]"
            @pageChange="pageChange"
            @pageSize="pageSize"
            @sortChange="sortChange"
          />
          <div v-show="expendColl">
            <el-row>
              <el-col :span="4"><span class="title"></span></el-col>
              <el-col
                :span="20"
                class="flex_flex_end"
              >
                <div class="redColorText">添加人员</div>
                <el-divider direction="vertical"></el-divider>
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="expendCollText2"
                  placement="top"
                >
                  <span
                    class="right_icon"
                    v-show="labelStatus1 == 3"
                  >
                    <img
                      v-show="!expendColl2"
                      src="../../../assets/svg/collapse.svg"
                      @click="systolic2"
                      style="width:1.4rem;height:1.4rem"
                    />
                    <img
                      v-show="expendColl2"
                      src="../../../assets/svg/expend.svg"
                      @click="systolic2"
                      style="width:1.4rem;height:1.4rem"
                    />
                  </span>
                </el-tooltip>
              </el-col>
            </el-row>
            <ComVxeTable
              :rowKey="'RowNumber'"
              :height="height2"
              :tableData="tableData[4]"
              :tableHeader="tableColumns[4]"
              :tableLoading="tableLoading[4]"
              :remark="4"
              :showPagination="false"
              :sysID="sysID[4].ID"
              :isClear="isClear[4]"
              :pagination="tablePagination[4]"
              @pageChange="pageChange"
              @pageSize="pageSize"
              @sortChange="sortChange"
            />
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
import ComSearch from "@/components/ComSearch";
import ComVxeTable from "@/components/ComVxeTable";
import ComReportTable from "@/components/ComReportTable";
import { GetHeader, GetSearchData, ExportData } from "@/api/Common";
import { Row } from "element-ui";
export default {
  name: "ThreeProduction",
  components: {
    ComSearch,
    ComVxeTable,
    ComReportTable,
  },
  data() {
    return {
      ////////////////// Search /////////////////
      dialogShow: false,
      dialogShow2: false,
      expendCollText: "全屏",
      expendColl: true,
      expendColl2: true,
      expendCollText2: "全屏",
      title: "",
      height1: "300px",
      height2: "300px",
      height3: "300px",
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
        {
          datas: {},
          forms: [],
        },
      ],
      btnForm: [],
      parmsBtn: [
        {
          ButtonCode: "save",
          BtnName: "提交",
          Type: "success",
          Ghost: true,
          signName:3,
          Size: "small",
          Methods: "submitData",
          Icon: "",
        },
      ],
      tableData: [[], [], [], [], []],
      tableColumns: [[], [], [], [], []],
      tableLoading: [false, false, false, false, false],
      isClear: [false, false, false, false, false],
      tablePagination: [
        { pageIndex: 1, pageSize: 200, pageTotal: 0 },
        { pageIndex: 1, pageSize: 200, pageTotal: 0 },
        { pageIndex: 1, pageSize: 200, pageTotal: 0 },
        { pageIndex: 1, pageSize: 200, pageTotal: 0 },
        { pageIndex: 1, pageSize: 0, pageTotal: 0 },
      ],
      height: "707px",
      showPagination: true,
      tagRemark: 0,
      isLoading: false,
      adminLoading: false,
      parseForm: {},
      parseSearch: false,
      Status1: [
        { label: "当日报工", value: 0 },
        { label: "报工提报", value: 3 },
        { label: "历史报工", value: 1 },
        { label: "报工明细", value: 2 },
      ],
      labelStatus1: 0,
      sysID: [{ ID: 1 }, { ID: 2 }, { ID: 3 }, { ID: 7784 }, { ID: 86 }],
      allLevelTwoProcessData: [],
      LevelTwoProcessData: [],
      standWorkTime: {},
      isEdit:false
    };
  },
  watch: {},
  created() {
    this.judgeBtn();
    this.adminLoading = true;
    this.getTableHeader();
    this.getLineLevelProcessData();
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
      let height2 = rem - 361 + "px";
      let height3 = rem - 362 + "px";
      this.$set(this, "height2", height2);
      this.$set(this, "height3", height3);
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
        this.adminLoading = false;
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
      this.labelStatus1 = item.value;
      if (item.value != 3 && this.tableData[item.value].length == 0) {
        this.dataSearch(item.value);
      }
    },
    // 展开与收缩
    systolic() {
      this.expendColl = !this.expendColl;
      if (!this.expendColl) {
        this.expendCollText = "收缩";
        this.height1 = this.height;
      } else {
        this.expendCollText = "全屏";
        this.height1 = "299px";
      }
    },
    // 展开与收缩
    systolic2() {
      this.expendColl2 = !this.expendColl2;
      if (!this.expendColl2) {
        this.expendCollText2 = "收缩";
        this.height2 = this.height;
      } else {
        this.expendCollText = "全屏";
        this.height2 = this.height3;
      }
    },
    // 单击报工
    setProduction(row) {
      this.$set(this.tableData, 3, []);
      this.formSearchs[3].datas["LineID"] = row.LineID;
      this.dataSearch(3);
      this.labelStatus1 = 3;
      // 获取对应线别的人员
      // 提取线别对应的二级工序
      this.LevelTwoProcessData = this.allLevelTwoProcessData.filter(
        (a) => a.LineID == this.currentRow.LineID
      );
      this.formSearchs[4].datas["OrganizeID"] = row.LineID;
      // 默认读取排产时间再查询人员数据
      this.searchWorkTimeData();
    },
    // 获取所有线别对应的二级工序
    async getLineLevelProcessData() {
      let form = {};
      form["rows"] = 0;
      form["dicID"] = 7848;
      let res = await GetSearchData(form);
      const { result, data, count, msg } = res.data;
      if (result) {
        this.allLevelTwoProcessData = data;
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
    },
    // 获取默认排班开始时间结束时间
    async searchWorkTimeData() {
      let form = {};
      form["rows"] = 1;
      form["page"] = 1;
      form["dicID"] = 3056;
      let res = await GetSearchData(form);
      const { result, data, count, msg } = res.data;
      if (result) {
        this.standWorkTime = data[0];
        this.dataSearch(4);
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
    },
    // 提交
    submitData() {},
  },
};
</script>