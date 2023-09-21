<!--菜单设置-->
<template>
  <div class="APSContainer" v-loading="adminLoading">
    <div class="admin_head" ref="headRef">
      <ComSearch
        ref="searchRef"
        :searchData="formSearchs[0].datas"
        :searchForm="formSearchs[0].forms"
        :remark="0"
        :isLoading="isLoading[0]"
        :btnForm="btnForm"
        @btnClick="btnClick"
        v-show="labelStatus1 == 0"
      />
      <ComSearch
        ref="searchRef"
        :searchData="formSearchs[1].datas"
        :searchForm="formSearchs[1].forms"
        :remark="1"
        :isLoading="isLoading[1]"
        :btnForm="btnForm"
        @btnClick="btnClick"
        v-show="labelStatus1 == 1"
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

        <div class="flex_end">
          <div class="content_left">
            <div class="text">分配任务列表</div>
            <div class="flex_between content_text">
              <el-select
                size="mini"
                v-model="materialType"
                placeholder="搜索品类"
                filterable
                @change="screenData"
              >
                <el-option
                  v-for="(x, y) in Extend9s"
                  :key="y"
                  :label="x.Extend9"
                  :value="x.Extend9"
                ></el-option>
              </el-select>
              <el-button
                type="warning"
                @click="clearLeftData"
                size="mini"
                class="marginRightLeft"
              >
                清空
              </el-button>
              <el-button type="primary" @click="openMaterialDialog" size="mini">
                抓取数据
              </el-button>
            </div>
            <div>
              <ComUmyTable
                :tableData="leftData"
                :tableHeader="leftColumn"
                :hasSelect="true"
                :showPagination="false"
                :height="height2"
                ref="contentLeftRef"
                @selectfun="selectFunContentLeft"
                :rowKey="'RowNumber'"
              />
            </div>
            <div class="flex_right marginSmallTop">
              <el-button type="warning" size="small" @click="autoScheduling">
                自动分配
              </el-button>
            </div>
            <div class="flex_between marginSmallTop">
              <el-select
                size="mini"
                v-model="selectLineName"
                placeholder="手动分配请选择班组"
                filterable
                value-key="LineID"
              >
                <el-option
                  v-for="(x, y) in lineOptions"
                  :key="y"
                  :label="x.LineName"
                  :value="x"
                ></el-option>
              </el-select>
              <el-button type="primary" size="small" @click="handleScheduling">
                手动分配
              </el-button>
            </div>
          </div>
          <div class="content_right">
            <ComUmyTable
              :rowKey="'RowNumber'"
              :height="height"
              :tableData="tableData[0]"
              :tableHeader="tableColumns[0]"
              :tableLoading="tableLoading[0]"
              :remark="0"
              :sysID="6715"
              :showPagination="false"
              :isClear="isClear[0]"
              :pagination="tablePagination[0]"
              @pageChange="pageChange"
              @pageSize="pageSize"
              @sortChange="sortChange"
              v-show="labelStatus1 == 0"
            />
          </div>
        </div>

        <!-- <ComUmyTable
          :rowKey="'RowNumber'"
          :height="height"
          :tableData="tableData[1]"
          :tableHeader="tableColumns[1]"
          :tableLoading="tableLoading[1]"
          :remark="1"
          :sysID="6715"
          :showPagination="false"
          :isClear="isClear[1]"
          :pagination="tablePagination[1]"
          @pageChange="pageChange"
          @pageSize="pageSize"
          @sortChange="sortChange"
          v-show="labelStatus1 == 1"
        /> -->
      </div>
    </div>

    <el-dialog title="抓取数据" :visible.sync="materialDialog" width="90%">
      <el-container>
        <el-aside width="300px">
          <ComUmyTable
            :tableData="dialogLeftData"
            :tableHeader="dialogLeftColumn"
            :hasSelect="true"
            ref="dialogLeftRef"
            :pagination="dialogLeftPagination"
            :showPagination="false"
            :height="'500px'"
            :rowKey="'RowNumber'"
            @selectfun="selectFunLeft"
          />
          <div class="fill marginTop">
            <el-button
              type="primary"
              @click="getRightData"
              size="small"
              :loading="btnLoading[0]"
            >
              开始抓取
            </el-button>
          </div>
        </el-aside>
        <el-main class="mainStyle">
          <ComUmyTable
            :tableData="dialogRightData"
            :tableHeader="dialogRightColumn"
            :hasSelect="true"
            ref="dialogRightRef"
            :pagination="dialogRightPagination"
            :showPagination="false"
            :height="'500px'"
            @selectfun="selectFunRight"
            :rowKey="'RowNumber'"
          />
          <div class="fill marginRightTop">
            <el-button type="warning" @click="addRowData" size="small">
              添加数据
            </el-button>
          </div>
        </el-main>
      </el-container>
      <span slot="footer" class="dialog-footer">
        <el-button @click="materialDialog = false" size="small"
          >取 消</el-button
        >
        <el-button type="warning" @click="addNoClose" size="small"
          >添加不关闭</el-button
        >
        <el-button type="primary" @click="addAndClose" size="small"
          >添加并关闭</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import ComSearch from "@/components/ComSearch";
import ComUmyTable from "@/components/ComUmyTable";
import { GetHeader, GetSearchData, ExportData, SaveData } from "@/api/Common";
import { WJDayPlan, WJToDayPlan } from "@/api/PagePack";
export default {
  name: "PackDayScheduling",
  components: {
    ComSearch,
    ComUmyTable,
  },
  data() {
    return {
      ////////////////// Search /////////////////
      adminLoading: false,
      title: this.$route.meta.title,
      drawer: false,
      isLoading: [false, false],
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
      btnForm: [],
      parmsBtn: [
        {
          ButtonCode: "save",
          BtnName: "保存",
          Type: "primary",
          Ghost: true,
          Size: "small",
          Methods: "dataSave",
          Icon: "",
          isLoading: false,
        },
        {
          ButtonCode: "save",
          BtnName: "发布",
          Type: "success",
          Ghost: true,
          Size: "small",
          Methods: "submitDayPlanData",
          Icon: "",
          isLoading: false,
        },
      ],
      tableData: [[], []],
      tableColumns: [[], []],
      tableLoading: [false, false],
      isClear: [false, false],
      tablePagination: [
        { pageIndex: 1, pageSize: 50, pageTotal: 0 },
        { pageIndex: 1, pageSize: 50, pageTotal: 0 },
      ],
      height: "707px",
      height2: "400px",
      tagRemark: 0,
      isLoading: false,
      labelStatus1: 0,
      Status1: [],
      lineOptions: [],
      btnLoading: [false, false],
      Extend9s: [],
      materialDialog: false,
      leftData: [],
      leftColumn: [
        { label: "欠料日期", prop: "OweDay" },
        { label: "产品", prop: "MaterialName" },
        { label: "数量", prop: "DistributionQty" },
      ],
      selectLineName: {
        LineID: "",
        LineName: "",
      },
      materialType: "",
      screenAllData: [],
      dialogLeftData: [],
      dialogRightData: [],
      dialogLeftPagination: {
        pageTotal: 0,
      },
      dialogRightPagination: {
        pageTotal: 0,
      },
      leftDialogSelection: [],
      rightDialogSelection: [],
      contentLeftSelection: [],
      dialogLeftColumn: [
        { label: "品类", prop: "Extend9" },
        {
          label: "数量",
          prop: "Qty",
          component: { type: "input", inputType: "number" },
        },
      ],
      dialogRightColumn: [
        { label: "品类", prop: "Extend9" },
        { label: "产品", prop: "MaterialName" },
        { label: "库存", prop: "StockQty" },
        { label: "WIP", prop: "WIP" },
        { label: "欠料日期", prop: "OweDay" },
        { label: "欠数", prop: "OweQty" },
        { label: "总数量", prop: "TotalPlanQty" },
        {
          label: "分配数量",
          prop: "DistributionQty",
          isEdit: true,
          component: { type: "input", inputType: "number" },
        },
      ],
      tagBtn: 0,
      userInfo: {},
      isEdit: false,
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
    this.adminLoading = true;
    this.userInfo = JSON.parse(localStorage.getItem("userInfo"));
    this.judgeBtn();
    this.getMaterialType();
    this.getOrganizeData();
    this.getAllLines();
  },
  mounted() {
    setTimeout(() => {
      this.setHeight();
    }, 600);
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
      let newHeight2 = 0;
      let newHeight = rem + "px";
      if (this.$store.getters.reduceHeight == 138) {
        newHeight2 = rem - 240 + "px";
      } else {
        newHeight2 = rem - 135 + "px";
      }
      this.$set(this, "height", newHeight);
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
    // 获取表头数据
    async getTableHeader() {
      let IDs = [{ ID: 6715 }, { ID: 6715 }];
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
        this.$set(
          this.formSearchs[0].datas,
          "MFGOrganizeID",
          this.Status1[0].value
        );
        this.getTableData(this.formSearchs[0].datas, 0);
      } else {
        this.adminLoading = false;
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
    // 获取分厂数据
    async getOrganizeData() {
      let obj = { dicID: 36, OrganizeTypeID: 2 };
      let res = await GetSearchData(obj);
      const { result, data, count, msg } = res.data;
      if (result) {
        data.forEach((x) => {
          this.Status1.push({
            label: x.OrganizeName,
            value: x.OrganizeID,
          });
        });
        this.getTableHeader();
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
    },
    // 改变状态
    changeStatus(item, index) {
      this.labelStatus1 = index;
    },
    //////////////////////////日计划部分事件/////////////////////////
    // 获取所有线别
    async getAllLines() {
      let obj = {
        dicID: 36,
        OrganizeTypeID: 6,
        OrganizeIDs: this.userInfo.MFGOrganizeID,
      };
      let res = await GetSearchData(obj);
      const { result, data, count, msg } = res.data;
      if (result) {
        data.forEach((x) => {
          this.lineOptions.push({
            LineName: x.OrganizeName,
            LineID: x.OrganizeID,
          });
        });
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
    },
    //打开抓取弹框
    openMaterialDialog() {
      this.materialDialog = true;
    },
    // 清空分配任务
    clearLeftData() {
      this.$confirm("是否清空分配任务列表！")
        .then(() => {
          this.leftData = [];
          this.tagBtn = 0;
          this.dialogRightData = [];
        })
        .catch(() => {});
    },
    // 获取品类
    async getMaterialType() {
      let obj = { dicID: 6682, MFGOrganizeID: this.userInfo.MFGOrganizeID };
      let res = await GetSearchData(obj);
      const { result, data, count, msg } = res.data;
      if (result) {
        data.forEach((x) => {
          let obj = {};
          obj = x;
          this.$set(obj, "update", true);
          this.$set(obj, "Qty", null);
          this.dialogLeftData.push(obj);
        });
        this.dialogLeftPagination.pageTotal = count;
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
    },
    // 选中需要抓取的品类
    selectFunLeft(data, remarkTb, row) {
      if (data.length == 0) {
        this.$refs.dialogLeftRef.$refs.plxTable.clearSelection();
      }
      this.leftDialogSelection = data;
    },
    // 选中需要的添加的品类
    selectFunRight(data, remarkTb, row) {
      if (data.length == 0) {
        this.$refs.dialogRightRef.$refs.plxTable.clearSelection();
      }
      this.rightDialogSelection = data;
    },
    // 开始抓取
    async getRightData() {
      this.tagBtn++;
      this.dialogRightData = [];
      let flag = 0;
      if (this.leftDialogSelection.length != 0) {
        this.leftDialogSelection.forEach((x) => {
          if (!x.Qty) {
            flag = 1;
            return;
          }
        });
        if (flag == 0) {
          this.btnLoading[0] = true;
          let res = await WJDayPlan(this.leftDialogSelection);
          const { result, data, count, msg } = res.data;
          if (result) {
            if (data.length == 0) {
              this.$message.warning("暂未查询到符合要求的数据！");
            } else {
              data.forEach((x) => {
                this.$set(x, "update", true);
              });
              this.dialogRightData = data;
              this.dialogRightPagination.pageTotal = count;
              this.btnLoading[0] = false;
            }
          } else {
            this.$message({
              message: msg,
              type: "error",
              dangerouslyUseHTMLString: true,
            });
            this.btnLoading[0] = false;
          }
        } else {
          this.$message.error("请将选择的数据填上数量！");
        }
      } else {
        this.$message.error("请勾选需要抓取的数据！");
      }
    },
    // 手工添加数据 是手工加一个字段 IsAdd
    addRowData() {
      this.dialogRightData.unshift({
        Extend9: "",
        MaterialName: "",
        DistributionQty: "",
        OweQty: "",
        TotalPlanQty: "",
        StockQty: "",
        WIP: "",
        IsAdd: true,
      });
    },
    // 分配任务中选择手动分配或自动分配的数据
    selectFunContentLeft(data, remarkTb, row) {
      if (data.length == 0) {
        this.$refs.contentLeftRef.$refs.plxTable.clearSelection();
      }
      this.contentLeftSelection = data;
    },
    // 自动分配
    autoScheduling() {
      if (this.contentLeftSelection.length == 0) {
        this.$message.error("请勾选需要自动分配的数据！");
      } else {
        this.contentLeftSelection.forEach((x) => {
          if (x.LineID) {
            this.tableData[0].push(x);
            // 已分配添加一个字段代码 BgOrange
            let tagIndex = this.leftData.findIndex((a) => {
              return a.MaterialName == x.MaterialName && a.Extend9 == x.Extend9;
            });
            this.$set(this.leftData[tagIndex], "BgOrange", true);
          }
        });
        this.$refs.contentLeftRef.$refs.plxTable.clearSelection();
      }
    },
    // 手动分配
    handleScheduling() {
      if (this.contentLeftSelection.length == 0) {
        this.$message.error("请勾选需要自动分配的数据！");
      } else {
        if (this.selectLineName.LineID) {
          this.contentLeftSelection.forEach((x) => {
            this.tableData[0].push(x);
            x.LineID = this.selectLineName.LineID;
            x.LineName = this.selectLineName.LineName;
            let tagIndex = this.leftData.findIndex((a) => {
              return a.MaterialName == x.MaterialName && a.Extend9 == x.Extend9;
            });
            this.$set(this.leftData[tagIndex], "BgOrange", true);
          });
          this.$set(this.tableData, 0, this.tableData[0]);
          this.$refs.contentLeftRef.$refs.plxTable.clearSelection();
        } else {
          this.$message.warning("请选择班组！");
        }
      }
    },
    // 添加不关闭
    addNoClose() {
      if (this.rightDialogSelection.length == 0) {
        this.$message.error("请勾选需要的数据！");
      } else {
        // 判断语句
        this.judegData(true);
        // 重新赋值一遍可查品类
        this.getExtend9Data();
      }
    },
    // 添加并关闭
    addAndClose() {
      if (this.rightDialogSelection.length == 0) {
        this.$message.error("请勾选需要的数据！");
        this.materialDialog = true;
      } else {
        // 判断语句
        this.judegData(false);
        // 重新赋值一遍可查品类
        this.getExtend9Data();
      }
    },
    // 判断计算多次并选择
    judegData(val) {
      let templateData = JSON.parse(JSON.stringify(this.rightDialogSelection));
      let flag = 0;
      templateData.some((x) => {
        if (!x.DistributionQty) {
          flag = 1;
          this.$message.error(
            "" + x.MaterialName + "没有填写分配数，请填写完整！"
          );
          return;
        }
        let newIndex = this.dialogRightData.findIndex(
          (i) => i.Extend9 == x.Extend9 && i.MaterialName == x.MaterialName
        );
        this.dialogRightData.splice(newIndex, 1);
        if (this.tagBtn > 1) {
          this.tagBtn = 0;
          // 清掉左侧同一品类的
          this.leftData = this.leftData.filter((i) => {
            return x.Extend9 != i.Extend9;
          });
          // 将右侧已分配过的数据也清掉
          this.tableData[0] = this.tableData[0].filter((i) => {
            return (
              x.Extend9 != i.Extend9 || (x.hasOwnProperty("IsAdd") && x.IsAdd)
            );
          });
        }
      });

      if (flag == 0) {
        this.$refs.contentLeftRef.$refs.plxTable.clearSelection();
        this.$refs.dialogRightRef.$refs.plxTable.clearSelection();
        // 继续将选中的与剩下的链接
        let newData = this.leftData.concat(templateData);
        this.$set(this, "leftData", newData);
        this.materialType = "";
        this.screenAllData = this.leftData;
        this.materialDialog = val;
      }
    },
    // 重新赋值一遍可查品类
    getExtend9Data() {
      this.Extend9s = [{ Extend9: "全部" }];
      let newData = [];
      this.leftData.forEach((x) => {
        let newIndex = newData.findIndex((i) => {
          return i.Extend9 == x.Extend9;
        });
        if (newIndex == -1) {
          newData.push({ Extend9: x.Extend9 });
        }
      });
      this.Extend9s = this.Extend9s.concat(newData);
    },
    // 筛选左边所有品类
    screenData(val) {
      this.$refs.contentLeftRef.$refs.plxTable.clearSelection();
      if (val != "全部") {
        this.leftData = this.screenAllData.filter((i) => {
          return i.Extend9 == val;
        });
      } else {
        this.leftData = this.screenAllData;
      }
    },
    // 保存日计划数据
    async dataSave(remarkTb, index) {
      this.adminLoading = true;
      if (this.tableData[remarkTb].length == 0) {
        this.$message.error("没有可保存的数据！");
      } else {
        this.isUpdating = true;
        this.tableData[remarkTb].forEach((m) => {
          m.dicID = 6715;
        });
        let res = SaveData(this.tableData[remarkTb]);
        const { data, msg, result } = res.data;
        if (result) {
          this.dataSearch(remarkTb);
          this.$message.success(msg);
          this.adminLoading = false;
        } else {
          this.$message({
            message: msg,
            type: "error",
            dangerouslyUseHTMLString: true,
          });
          this.adminLoading = false;
        }
      }
    },
    // 发布日计划数据
    async submitDayPlanData(remarkTb) {
      this.adminLoading = true;
      if (this.tableData[remarkTb].length == 0) {
        this.$message.error("没有可发布的数据！");
      } else {
        let res = WJToDayPlan(this.tableData[remarkTb]);
        const { data, msg, result } = res.data;
        if (result) {
          this.dataSearch(remarkTb);
          this.$message.success(msg);
          this.adminLoading = false;
        } else {
          this.$message({
            message: msg,
            type: "error",
            dangerouslyUseHTMLString: true,
          });
          this.adminLoading = false;
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.content_left {
  width: 300px;
  height: 100%;

  .text {
    height: 30px;
    text-align: center;
    line-height: 30px;
    background: #afcbff;
    font-weight: bold;
  }

  .content_text {
    margin: 5px 5px 5px 0;
    height: 28px;
  }
}

.content_right {
  width: calc(100% - 300px);
  height: 100%;
}
.marginRightLeft {
  margin: 0 10px;
}
.marginSmallTop {
  margin: 4px 5px 4px 0;
  height: 28px;
}
.mainStyle {
  padding: 0 10px !important;
}
</style>
