<!--菜单设置-->
<template>
  <div
    class="container  flex_flex"
    v-loading="adminLoading"
  >
    <div class="admin_left">
      <div>
        <div class="flex px-2 py-1.5 border-b-1 tree_Head">
          <span class="tree_text">车间信息</span>
          <div class="flex_flex_end flex-1">
            <el-input
              size="mini"
              clearable
              v-model="OrganizeName"
              placeholder="搜索"
              suffix-icon="el-icon-search"
              class="w2/3 cx_margin_right1"
              @input="searchTree(OrganizeName,'treeData','treeListTmp','OrganizeName')"
            ></el-input>
            <el-dropdown
              @command="handleCommand"
              class="flex_inline"
            >
              <img src="../../../assets/svg/dot.svg" />
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="1">展开全部</el-dropdown-item>
                <el-dropdown-item command="2">折叠全部</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
        <el-tree
          class="tree-line asideTree"
          :indent="0"
          ref="asideTreeRef"
          node-key="OrganizeID"
          :default-expand-all="isOpen"
          :data="treeData"
          :props="treeProps"
          highlight-current
          :expand-on-click-node="true"
          @node-click="handleNodeClick"
        ></el-tree>
      </div>

      <div>
        <div class="flex px-2 py-1.5 border-b-1 tree_Head">
          <span class="tree_text">工序信息</span>
          <div class="flex_flex_end flex-1">
            <el-input
              size="mini"
              clearable
              v-model="ProcessName"
              placeholder="搜索"
              suffix-icon="el-icon-search"
              class="w2/3 cx_margin_right1"
              @input="searchTree(ProcessName,'treeData2','treeListTmp2','ProcessName')"
            ></el-input>
            <el-dropdown class="flex_inline">
              <img src="../../../assets/svg/dot.svg" />
              <el-dropdown-menu slot="dropdown">
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
        <el-tree
          class="tree-line"
          :indent="0"
          ref="asideTreeRef_two"
          node-key="ProcessID"
          default-expand-all
          :data="treeData2"
          :props="treeProps2"
          style="height:75px;overflow:auto"
          highlight-current
          :expand-on-click-node="false"
          @node-click="handleNodeClick2"
        ></el-tree>
      </div>

    </div>
    <div class="admin_container">
      <div
        class="admin_head"
        ref="headRef"
      >
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
              <el-col :span="4"><span class="title">{{ title }}</span></el-col>
              <el-col
                :span="20"
                class="flex_flex_end"
              >
                <el-input
                  type="text"
                  v-model="materialValue"
                  size="small"
                  clearable
                  style="width:160px"
                  placeholder="输入添加的产品"
                ></el-input>
                <el-divider direction="vertical"></el-divider>
                <el-button
                  type="primary"
                  size="mini"
                  @click="openDialog"
                >新增产品</el-button>

              </el-col>
            </el-row>
          </div>
          <ComUmyTable
            :rowKey="'RowNumber'"
            :height="height"
            :hasSelect="true"
            :tableData="tableData[0]"
            :tableHeader="tableColumns[0]"
            :tableLoading="tableLoading[0]"
            :remark="0"
            :sysID="6709"
            :isEdit="isEdit"
            :isEditDel="true"
            :condition="(row)=>{return row.IsAdd == true}"
            :isClear="isClear[0]"
            :pagination="tablePagination[0]"
            @selectfun="selectFun"
            @pageChange="pageChange"
            @pageSize="pageSize"
            @sortChange="sortChange"
            @editRow="editRow"
            @delRow="delRow"
          />
        </div>
      </div>
    </div>

    <el-dialog
      title="添加产品"
      :visible.sync="materialDialog"
      width="40%"
      :close-on-click-modal="false"
    >
      <span class="dialog_head">查出如下，请选择添加的产品，无工艺需绑定工艺！</span>

      <div class="dialog_content">
        <div
          class=""
          v-for="(item, index) in addData"
          :key="index"
        >
          <el-checkbox v-model="item.checked">{{item.MaterialName}}({{item.Extend15}}) <span class="blue">【工艺：{{item.ProcessGroupName}}]</span></el-checkbox>
        </div>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-select
          v-model="ProcessGroup"
          clearable
          filterable
          class="cx_margin_right1"
          value-key="ProcessGroupID"
        >
          <el-option
            v-for="(item,x) in categorys"
            :key="x"
            :label="item.ProcessGroupName"
            :value="item"
          >
          </el-option>
        </el-select>
        <el-button
          @click="configCategory"
          size="small"
          type="warning"
        >配置工艺</el-button>
        <el-button
          @click="materialDialog = false"
          size="small"
        >取 消</el-button>
        <el-button
          type="primary"
          size="small"
          @click="sureAdd"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
var _this;
import { mapState } from "vuex";
import ComSearch from "@/components/ComSearch";
import ComUmyTable from "@/components/ComUmyTable";
import formatDate from "@/utils/formatDate";
import {
  GetHeader,
  GetHeaderTwo,
  GetSearchData,
  ExportData,
  SaveData,
  GetOrgData,
  UpdateProcess,
} from "@/api/Common";
import {
  AddProcessPartMaterialDay,
  SearchMaterialByLine,
} from "@/api/PagePack";
export default {
  name: "PackDayPlan",
  components: {
    ComSearch,
    ComUmyTable,
  },
  data() {
    return {
      ////////////////// Search /////////////////
      adminLoading: false,
      materialValue: "",
      ProcessGroup: "",
      addSelection: [],
      categorys: [],
      addData: [],
      materialDialog: false,
      OrganizeName: "",
      ProcessName: "",
      treeData: [],
      treeListTmp: [],
      treeData2: [],
      treeListTmp2: [],
      treeProps: {
        label: "OrganizeName",
        children: "children",
      },
      treeProps2: {
        label: "ProcessName",
        children: "children",
      },
      isOpen: true,
      title: this.$route.meta.title,
      drawer: false,
      formSearchs: [
        {
          datas: {},
          forms: [],
        },
      ],
      btnForm: [],
      parmsBtn: [
        {
          ButtonCode: "delete",
          BtnName: "删除",
          isLoading: false,
          Methods: "dataDel",
          Type: "danger",
          Icon: "",
          Size: "small",
          Params: { dataName: "selectionData" },
        },
        {
          ButtonCode: "save",
          BtnName: "保存",
          isLoading: false,
          Methods: "dataSave",
          Type: "success",
          Icon: "",
          Size: "small",
          Params: "",
        },
      ],
      tableData: [[]],
      tableColumns: [[]],
      tableLoading: [false],
      isClear: [false],
      tablePagination: [{ pageIndex: 1, pageSize: 50, pageTotal: 0 }],
      selectionData: [[]],
      height: "707px",
      showPagination: true,
      tagRemark: 0,
      isLoading: false,
      isSelect: false,
      isEdit: false,
      childrenLines: [],
      asideType: "分厂",
      lineProcessData: [],
      toDay:[],
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
  computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo,
    }),
  },
  created() {
    _this = this;
    this.adminLoading = true;
    this.toDay = [formatDate.formatTodayDate(),formatDate.formatTodayDate()];
    // 获取用户信息
    this.getAllProcessData();
    this.judgeBtn();
    this.getTableHeader();
    this.getCategorys();
    // this.getOrganizeData();
  },
  mounted() {
    setTimeout(() => {
      this.setHeight();
    }, 450);
    // this.formSearchs[0].datas["MFGOrganizeID"] = this.userInfo.CenterID;
    // this.getWorkShopData();
    // this.getProcessData();
  },
  methods: {
    searchTree(msg, dataName, dataName2, valueName) {
      this[dataName] = [];
      let treeListTmp = JSON.parse(JSON.stringify(this[dataName2]));
      let tmp = msg
        ? this.rebuildData(msg, treeListTmp, valueName)
        : JSON.parse(JSON.stringify(treeListTmp));
      this[dataName].push(...tmp);
    },
    rebuildData(value, arr, valueName) {
      if (!arr) {
        return [];
      }
      let newarr = [];
      if (Object.prototype.toString.call(arr) === "[object Array]") {
        arr.forEach((element) => {
          if (element[valueName].indexOf(value) > -1) {
            // const ab = this.rebuildData(value, element.children);
            const obj = {
              ...element,
              children: element.children,
            };
            newarr.push(obj);
          } else {
            if (element.children && element.children.length > 0) {
              const ab = this.rebuildData(value, element.children, valueName);
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
    // 选择数据
    selectFun(data, remarkTb, row) {
      this.selectionData[remarkTb] = data;
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
    // 编辑
    editRow(row, index, remarkTb) {
      this.$set(row, "update", true);
    },
    // 删除
    delRow(row, index, remarkTb) {
      this.tableData[remarkTb].splice(index, 1);
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
    // 特殊接口保存
    async specialSave(remarkTb, index) {
      let res = null;
      this.adminLoading = true;

      res = await SaveProcessPartMaterialDay(this.tableData[remarkTb]);
      const { result, data, count, msg } = res.data;
      if (result) {
        this.dataSearch(0);
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
    // 保存
    async dataSave(remarkTb, index, parms) {
      let res = null;
      let newData = [];
      if (parms && parms.dataName) {
        if (this[parms.dataName][remarkTb].length == 0) {
          this.$message.error("请勾选需要操作的数据！");
          return;
        } else {
          newData = this[parms.dataName][remarkTb];
        }
      } else {
        newData = this.tableData[remarkTb];
      }
      let addData = [];
      let oldData = [];
      newData.forEach((a) => {
        if (!a.PlanQty) {
          this.$message.error(a.MaterialName + "需双击行填写计划数量！");
          return;
        }
        if (a.SalesPlanProcessMaterialDayID) {
          oldData.push(a);
        } else {
          addData.push(a);
        }
      });
      if (oldData.length != 0) {
        this.generalSaveData(oldData, remarkTb, index);
      }
      if (addData.length != 0) {
        this.adminLoading = true;
        res = await AddProcessPartMaterialDay(addData);
        const { result, data, count, msg } = res.data;
        if (result) {
          this.$message({
            message: msg,
            type: "success",
            dangerouslyUseHTMLString: true,
          });
          this.dataSearch(0);
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
    // 删除
    async dataDel(remarkTb, index, parms) {
      let newData = [];
      if (parms && parms.dataName) {
        if (this[parms.dataName][remarkTb].length == 0) {
          this.$message.error("请勾选需要操作的数据！");
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
      this.$confirm(
        "此操作将删除未报工的车间计划,如果已经报工则无法删除, 确定要删除的【" +
          newData.length +
          "】数据吗？"
      )
        .then((_) => {
          _this.generalSaveData(newData, remarkTb, index);
        })
        .catch((_) => {
          _this.$set(_this.btnForm[index], "isLoading", false);
        });
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
    // 获取表头数据
    async getTableHeader() {
      let IDs = [{ ID: 6709 }];
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
        this.formSearchs[0].datas["PlanDay"] = this.toDay;
        this.getOrganizeData();
        // this.getTableData(this.formSearchs[0].datas, 0);
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
        this.adminLoading = false;
      }

      // this.getAutoHeader(IDs);
    },
    // 获取动态日期表头
    async getAutoHeader(IDs) {
      let resTwo = await GetHeaderTwo(IDs);
      const { datas, result, msg } = resTwo.data;
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
        console.log(data)
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
    //////////////////////////////左侧查询事件//////////////
    // 单击树
    handleNodeClick(data, node) {
      if (data.OrganizeTypeID == 2) {
        this.formSearchs[0].datas["MFGOrganizeID"] = data.OrganizeTypeID;
        this.formSearchs[0].datas["WorkShopID"] = "";
        this.formSearchs[0].datas["WorkShopName"] = "";
        this.formSearchs[0].datas["LineID"] = "";
        this.formSearchs[0].datas["LineName"] = "";
        this.treeData2 = [];
        this.asideType = "分厂";
      }
      if (data.OrganizeTypeID == 5) {
        this.formSearchs[0].datas["WorkShopID"] = data.OrganizeID;
        this.formSearchs[0].datas["WorkShopName"] = data.OrganizeName;
        this.formSearchs[0].datas["MFGOrganizeID"] = "";
        this.formSearchs[0].datas["LineID"] = "";
        this.formSearchs[0].datas["LineName"] = "";
        this.childrenLines = data.children;
        let lines = [];
        if (data.children.length != 0) {
          data.children.forEach((a) => {
            lines.push(a.OrganizeID);
          });
        }
        // 获取线下面的工序
        this.getProcessData(lines);
        this.treeData2 = [];
        this.asideType = "车间";
      } else if (data.OrganizeTypeID == 6) {
        this.formSearchs[0].datas["LineID"] = data.OrganizeID;
        this.formSearchs[0].datas["LineName"] = data.OrganizeName;
        this.formSearchs[0].datas["MFGOrganizeID"] = "";
        this.formSearchs[0].datas["WorkShopID"] = "";
        this.formSearchs[0].datas["WorkShopName"] = "";
        this.childrenLines = [];
        this.asideType = "线";
        // 获取线下面的工序
        this.getProcessData(data.OrganizeID);
      }
      // this.dataSearch(0);
    },
    // 单击树
    handleNodeClick2(data, node) {
      this.formSearchs[0].datas["ProcessID"] = data.ProcessID;
      this.formSearchs[0].datas["ProcessName"] = data.ProcessName;
      this.dataSearch(0);
    },
    // 下拉选择事件
    handleCommand(val) {
      if (val == 1 && !this.isOpen) {
        this.isOpen = true;
        this.changeTreeNodeStatus(this.$refs.asideTreeRef.store.root);
      } else if (val == 2 && this.isOpen) {
        // 改变每个节点的状态
        this.isOpen = false;
        this.changeTreeNodeStatus(this.$refs.asideTreeRef.store.root);
      }
    },
    // 改变节点状态
    changeTreeNodeStatus(node) {
      node.expanded = this.isOpen;
      for (let i = 0; i < node.childNodes.length; i++) {
        // 改变节点的自身expanded状态
        node.childNodes[i].expanded = this.isOpen;
        // 遍历子节点
        if (node.childNodes[i].childNodes.length > 0) {
          this.changeTreeNodeStatus(node.childNodes[i]);
        }
      }
    },
    // 获取车间
    async getWorkShopData() {
      let form = {
        dicID: 36,
        OrganizeIDs: this.userInfo.CenterID,
        OrganizeTypeID: 2,
      };
      let res = await GetSearchData(form);
      const { result, data, count, msg } = res.data;
      if (result) {
        let OrganizeID = [];
        data.forEach((x) => {
          OrganizeID.push(x.OrganizeID);
        });
        this.getOrganizeData(OrganizeID);
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
    },
    async getOrganizeData() {
      this.treeListTmp = [];
      this.treeData = [];
      let form = {
        OrganizeIDs: this.userInfo.CenterID,
        OrganizeID: this.userInfo.OrganizeID,
        dicID: 3026,
        Status: 1,
      };
      let res = await GetOrgData(form);
      const { result, data, count, msg } = res.data;
      if (result) {
        this.treeData = data;
        this.treeListTmp = data;
        if (data.length != 0) {
          this.$nextTick(function () {
            _this.$refs.asideTreeRef.setCurrentKey(data[0].OrganizeID);
          });
          this.formSearchs[0].datas["WorkShopID"] = data[0].OrganizeID;
          this.formSearchs[0].datas["WorkShopName"] = data[0].OrganizeName;
        }
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
    },
    // 获取所有的线配工序方便判断
    async getAllProcessData() {
      let form = { dicID: 5144 };
      let res = await GetSearchData(form);
      const { result, data, count, msg } = res.data;
      if (result) {
        this.lineProcessData = data;
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
    },
    // 获取工序
    async getProcessData(LineID) {
      this.treeData2 = [];
      this.treeListTmp2 = [];
      let form = { dicID: 5144, OrganizeID: LineID };
      let res = await GetSearchData(form);
      const { result, data, count, msg } = res.data;
      if (result) {
        if (data.length != 0) {
          data.forEach((a) => {
            if (
              _this.treeData2.findIndex((y) => {
                return y.ProcessID == a.ProcessID;
              }) == -1
            ) {
              _this.treeData2.push(a);
            }
          });
          _this.treeListTmp2 = this.treeData2;
          this.$nextTick(function () {
            _this.$refs.asideTreeRef_two.setCurrentKey(data[0].ProcessID);
          });
          this.formSearchs[0].datas["ProcessID"] = data[0].ProcessID;
          this.formSearchs[0].datas["ProcessName"] = data[0].ProcessName;
          this.getTableData(this.formSearchs[0].datas, 0);
        }
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
    },
    // 新增产品
    async openDialog() {
      if (this.materialValue) {
        if (!this.formSearchs[0].datas.LineID) {
          this.$message.error("请在左侧选择线别才可添加！");
          return;
        }
        if (!this.formSearchs[0].datas.ProcessID) {
          this.$message.error("请在左侧选择工序才可添加！");
          return;
        }
        this.addData = [];
        let form = {
          MaterialName: this.materialValue,
          ProcessID: this.formSearchs[0].datas.ProcessID,
        };
        let res = await SearchMaterialByLine(form);
        const { result, data, count, msg } = res.data;
        if (result) {
          if (data.length == 0) {
            this.$message.info("未查询到该产品");
          } else if (data.length != 1) {
            this.materialDialog = true;
            let newData = [];
            data.forEach((x) => {
              this.addObj(x, "addData");
            });
            let MFGOrganizeID = this.userInfo.CenterID;
            let data1 = this.addData.filter((x) => {
              return x.MFGOrganizeID == MFGOrganizeID;
            });
            newData = newData.concat(data1);
            let data2 = this.addData.filter((x) => {
              return x.MFGOrganizeID != MFGOrganizeID;
            });
            newData = newData.concat(data2);
            this.addData = [];
            this.$set(this, "addData", newData);
          } else {
            this.addObj(res.data.data[0], "tableData");
            this.tableData[0].unshift(data[0]);
          }
        } else {
          this.$message({
            message: msg,
            type: "error",
            dangerouslyUseHTMLString: true,
          });
        }
      } else {
        this.$message.error("请填写需要添加的产品！");
      }
    },
    // 添加数据
    addObj(x, name) {
      let obj = x;
      obj["PlanQty"] = null;
      obj["SalesPlanProcessMaterialDayID"] = null;
      obj["Reamrk2"] = "";
      obj["IsAdd"] = true;
      obj["dicID"] = 6709;
      obj["LineID"] = this.formSearchs[0].datas.LineID;
      obj["LineName"] = this.formSearchs[0].datas.LineName;
      obj["WorkShopID"] = this.formSearchs[0].WorkShopID;
      obj["WorkShopName"] = this.formSearchs[0].WorkShopName;
      obj["PlanDay"] = formatDate.formatTodayDate();
      // if (!this.formSearchs[0].datas.PlanDay[0]) {
      //   obj["PlanDay"] = formatDate.formatTodayDate();
      // } else {
      //   obj["PlanDay"] = this.formSearchs[0].datas.PlanDay[0];
      // }
      obj["ProcessID"] = this.formSearchs[0].datas.ProcessID;
      obj["ProcessName"] = this.formSearchs[0].datas.ProcessName;
      obj["checked"] = false;
      obj["APPOrPC"] = "PC";
      obj["update"] = true;
      this[name].push(obj);
    },
    // 配置工艺
    configCategory() {
      if (this.ProcessGroup.ProcessGroupID) {
        this.getSelectionData();
        if (this.addSelection != 0) {
          this.addSelection.forEach((x) => {
            x["processGroupID"] = this.ProcessGroup.ProcessGroupID;
            x["ProcessGroupName"] = this.ProcessGroup.ProcessGroupName;
            x["materialID"] = x.MaterialID;
            this.submitCategory(x);
          });
        } else {
          this.$message.error("请勾选要配置工艺的产品！");
        }
      } else {
        this.$message.error("请选择配置的工序！");
      }
    },
    // 提交配置工艺
    async submitCategory(row) {
      let res = await UpdateProcess(row);
      const { result, data, count, msg } = res.data;
      if (result) {
        this.$set(row, "ProcessCount", 1);
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
    // 获取选中的数据
    getSelectionData() {
      this.addSelection = [];
      this.addData.forEach((x) => {
        if (x.checked) {
          this.addSelection.push(x);
        }
      });
    },
    // 获取工艺
    async getCategorys() {
      let res = await GetSearchData({ dicID: 1175 });
      const { result, data, count, msg } = res.data;
      if (result) {
        this.categorys = data;
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
    },
    // 确认添加
    sureAdd() {
      this.addData.some((x, i) => {
        if (x.checked) {
          if (x.ProcessCount == 1) {
            let obj = JSON.parse(JSON.stringify(x));
            this.tableData[0].unshift(obj);

            // if (this.asideType == "车间") {
            //   if (this.childrenLines.length == 0) {
            //     this.$message.error("该车间下无对应的线别，无法添加计划！");
            //     return true;
            //   } else {
            //     this.childrenLines.forEach((a) => {
            //       let obj = JSON.parse(JSON.stringify(x));
            //       obj["LineID"] = a.OrganizeID;
            //       obj["LineName"] = a.OrganizeName;
            //       this.tableData[0].unshift(obj);
            //     });
            //   }
            // }
          } else {
            this.$message.error(x.MaterialName + "暂未配置工艺");
          }
        } else {
        }
      });
      this.materialDialog = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.dialog_head {
  margin: 10px;
  color: #409eff;
}
.dialog_content {
  height: 400px;
  padding: 10px;
  overflow: auto;
  div {
    margin: 8px 0;
  }
  span {
    color: #409eff;
  }
}
</style>