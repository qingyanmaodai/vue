<!--菜单权限-->
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
            <el-col :span="4">
              <span class="title">{{ title }}</span>
            </el-col>
            <el-col
              :span="20"
              class="flex_flex_end"
            >
              <el-button
                type="primary"
                size="mini"
                @click="openDrawer(1)"
              >新增菜单</el-button>
              <el-divider direction="vertical"></el-divider>
              <el-button
                type="warning"
                size="mini"
                @click="openDrawer(2)"
              >修改菜单/配置按钮</el-button>
              <el-divider direction="vertical"></el-divider>
              <el-tooltip
                class="item"
                effect="dark"
                content="刷新"
                placement="bottom"
              >
                <span
                  class="right_icon"
                  @click="refrshPage"
                >
                  <span
                    role="img"
                    aria-label="redo"
                    class="anticon anticon-redo icon_size"
                  ><svg
                      class=""
                      data-icon="redo"
                      width="1em"
                      height="1em"
                      fill="currentColor"
                      aria-hidden="true"
                      viewBox="64 64 896 896"
                      focusable="false"
                    >
                      <path d="M758.2 839.1C851.8 765.9 912 651.9 912 523.9 912 303 733.5 124.3 512.6 124 291.4 123.7 112 302.8 112 523.9c0 125.2 57.5 236.9 147.6 310.2 3.5 2.8 8.6 2.2 11.4-1.3l39.4-50.5c2.7-3.4 2.1-8.3-1.2-11.1-8.1-6.6-15.9-13.7-23.4-21.2a318.64 318.64 0 01-68.6-101.7C200.4 609 192 567.1 192 523.9s8.4-85.1 25.1-124.5c16.1-38.1 39.2-72.3 68.6-101.7 29.4-29.4 63.6-52.5 101.7-68.6C426.9 212.4 468.8 204 512 204s85.1 8.4 124.5 25.1c38.1 16.1 72.3 39.2 101.7 68.6 29.4 29.4 52.5 63.6 68.6 101.7 16.7 39.4 25.1 81.3 25.1 124.5s-8.4 85.1-25.1 124.5a318.64 318.64 0 01-68.6 101.7c-9.3 9.3-19.1 18-29.3 26L668.2 724a8 8 0 00-14.1 3l-39.6 162.2c-1.2 5 2.6 9.9 7.7 9.9l167 .8c6.7 0 10.5-7.7 6.3-12.9l-37.3-47.9z"></path>
                    </svg></span>
                </span>
              </el-tooltip>
              <el-divider direction="vertical"></el-divider>
            </el-col>
          </el-row>
        </div>
        <ComUmyTable
          :rowKey="'RowNumber'"
          :height="height"
          :tableData="tableData[0]"
          :tableHeader="tableColumns[0]"
          :tableLoading="tableLoading[0]"
          :isEdit="true"
          :remark="0"
          :sysID="1"
          :isClear="isClear[0]"
          :pagination="tablePagination[0]"
          @handleRowClick="handleRowClick"
          @pageChange="pageChange"
          @pageSize="pageSize"
          @sortChange="sortChange"
        />
      </div>
    </div>

    <el-drawer
      :title="drawerTitle"
      :visible.sync="drawer"
      direction="rtl"
    >
      <div class="drawer_body">
        <el-form label-width="90px">
          <el-row>
            <el-col :span="24">
              <el-form-item
                :label="`${dialogTitle}`+'类型'"
                prop=""
              >
                <el-radio-group
                  v-model="Type"
                  size="small"
                >
                  <el-radio-button label="菜单"></el-radio-button>
                  <el-radio-button
                    label="按钮"
                    v-show="tagRremark == 2"
                  ></el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-form
          v-show="Type == '菜单'"
          :model="menuForm"
          :rules="menuRules"
          ref="menuForm"
          label-width="90px"
          class="demo-ruleForm"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="上级菜单"
                prop="ParentMenuName"
              >
                <el-select
                  ref="formRef"
                  v-model="menuForm.ParentMenuName"
                  :clearable="true"
                  @change="clearData"
                >
                  <el-option
                    :value="menuForm.ParentCode"
                    :label="menuForm.ParentMenuName"
                  >
                    <el-tree
                      ref="selectTree"
                      :props="treeProps"
                      :data="treeData"
                      :expand-on-click-node="false"
                      @node-click="selectHandleNodeClick"
                    ></el-tree>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="菜单名称"
                prop="MenuName"
              >
                <el-input
                  v-model="menuForm.MenuName"
                  type="text"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="路由地址"
                prop="Url"
              >
                <el-input
                  v-model="menuForm.Url"
                  type="text"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="图标"
                prop="Ico"
              >
                <el-input
                  v-model="menuForm.Ico"
                  type="text"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="组件"
                prop="Component"
              >
                <el-input
                  v-model="menuForm.Component"
                  type="text"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="组件名称"
                prop="Name"
              >
                <el-input
                  v-model="menuForm.Name"
                  type="text"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="是否启用"
                prop="IsEnable"
              >
                <el-radio-group
                  v-model="menuForm.IsEnable"
                  size="small"
                >
                  <el-radio :label="1">启用</el-radio>
                  <el-radio :label="0">禁用</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="排序"
                prop="ViewSort"
              >
                <el-input
                  v-model="menuForm.ViewSort"
                  type="number"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="是否隐藏"
                prop="Hidden"
              >
                <el-switch
                  v-model="menuForm.Hidden"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                >
                </el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="不缓存"
                prop="keepAlive"
              >
                <el-switch
                  v-model="menuForm.keepAlive"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                >
                </el-switch>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div v-show="Type == '按钮'">
          <div class="flex_row_spaceBtn px-7-20 border-b-1">
            <span class="px_16">按钮分配</span>
            <el-dropdown @command="handleCommand">
              <img src="../../../assets/svg/dot.svg" />
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="1">选择全部</el-dropdown-item>
                <el-dropdown-item command="2">取消全部</el-dropdown-item>
                <el-dropdown-item
                  command="3"
                  divided
                >展开全部</el-dropdown-item>
                <el-dropdown-item command="4">折叠全部</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div class="btnTree">
            <el-tree
              :data="btnData"
              show-checkbox
              :default-expand-all="isOpen"
              :default-checked-keys="checkdBtnCodes"
              :node-key="'ButtonID'"
              ref="btnTree"
              highlight-current
              :props="btnProps"
            >
            </el-tree>
          </div>
        </div>
      </div>
      <div class="drawer_footer">
        <el-button
          plain
          size="small"
          @click="drawer = false"
        >取消</el-button>
        <el-button
          type="primary"
          size="small"
          @click="sureAdd"
          :loading="sureLoading"
        >确认</el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script>
var _this;
import ComSearch from "@/components/ComSearch";
import ComUmyTable from "@/components/ComUmyTable";
import {
  GetHeader,
  GetSearchData,
  ExportData,
  SaveData,
  GetMenus,
} from "@/api/Common";
export default {
  name: "MenuInfo",
  components: {
    ComSearch,
    ComUmyTable,
  },
  data() {
    return {
      ////////////////// Search /////////////////
      adminLoading: false,
      title: this.$route.meta.title,
      drawerTitle: "新增菜单/按钮",
      dialogTitle: "",
      checkdBtnCodes: [],
      drawer: false,
      formSearchs: [
        {
          datas: {},
          forms: [],
        },
      ],
      btnForm: [
        {
          BtnName: "保存",
          Type: "success",
          Ghost: true,
          Size: "small",
          Methods: "dataTreeSave",
          Icon: "",
        },
        {
          BtnName: "删除",
          Type: "danger",
          Ghost: true,
          Size: "small",
          Methods: "dataDel",
          Icon: "",
          Params: { dataName: "delData" },
        },
      ],
      tableData: [[]],
      delData: [[]],
      tableColumns: [[]],
      tableLoading: [false],
      isClear: [false],
      tablePagination: [{ pageIndex: 1, pageSize: 50, pageTotal: 0 }],
      height: "707px",
      showPagination: true,
      tagRemark: 0,
      /* 弹框数据 */
      Type: "菜单",
      sureLoading: false,
      menuForm: {
        dicID: 1,
        MenuName: "",
        MenuCode: "",
        ParentCode: "",
        ParentMenuName: "",
        Url: "",
        Component: "",
        Name: "",
        Hidden: false,
        IsEnable: 1,
        keepAlive: false,
        ViewSort: 1,
        Ico: "",
        Status: 1,
      },
      menuRules: {
        MenuName: [
          { required: true, message: "请输入菜单名称", trigger: "blur" },
        ],
        Url: [{ required: true, message: "请输入路由地址", trigger: "blur" }],
        ViewSort: [{ required: true, message: "请输入排序", trigger: "blur" }],
      },
      treeProps: { label: "MenuName", children: "children" },
      treeData: [],
      btnData: [],
      isOpen: false,
      btnProps: {
        children: "children",
        label: "ButtonName",
      },
      isLoading: false,
      initialBtnData: [],
      tagRremark: 1,
    };
  },
  watch: {},
  created() {
    _this = this;
    this.adminLoading = true;
    this.getTableHeader();
    // 获取所有按钮
    this.getAllBtn();
    // 获取所有菜单
    this.getAllMenu();
  },
  mounted() {
    setTimeout(() => {
      this.setHeight();
    }, 450);
  },
  methods: {
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
    // 导出
    async dataExport(remarkTb) {
      this.adminLoading = true;
      let form = JSON.parse(JSON.stringify(this.formSearchs[remarkTb].datas));
      form["rows"] = 0;
      let res = await ExportData(form);
      this.adminLoading = false;
      this.$store.dispatch("user/exportData", res.data);
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
    // 保存
    async dataSave(remarkTb, index, parms, newData) {
      let res = null;
      if (newData && newData.length != 0) {
        res = await SaveData(newData);
      } else {
        res = await SaveData(this.tableData[remarkTb]);
      }
      const { datas, forms, result, msg } = res.data;
      if (result) {
        this.$message({
          message: msg,
          type: "success",
          dangerouslyUseHTMLString: true,
        });
        this.getAllMenu();
        this.dataSearch(remarkTb);
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
    },
    // 树形数据的保存
    dataTreeSave(remarkTb, index, parms, newData) {
      if (this.tableData[remarkTb].length != 0) {
        let submitData = [];
        this.tableData[remarkTb].forEach((x) => {
          if (x.update) {
            x["dicID"] = 1;
            submitData.push(x);
          }
          if (x.children && x.children.length != 0) {
            this.getChildrensData(x, submitData);
          }
        });
        if (submitData.length != 0) {
          this.generalSaveData(submitData, 0, index);
        } else {
          this.$message.error("没有可保存的数据");
        }
      } else {
        this.$message.error("没有可保存的数据");
      }
    },
    // 递归获取子数据
    getChildrensData(row, submitData) {
      submitData.concat(row.children);
      row.children.forEach((x) => {
        if (x.update) {
          x["dicID"] = 1;
          submitData.push(x);
        }
        if (x.children && x.children.length != 0) {
          this.getChildrensData(x, submitData);
        }
      });
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
      let res = await SaveData(newData);
      const { result, data, count, msg } = res.data;
      if (result) {
        this.dataSearch(remarkTb);
        this.getAllMenu();
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
    // 保存返回结果自己处理事件
    async returnResultData(newData) {
      let res = await SaveData(newData);
      return res;
    },
    // 获取表头数据
    async getTableHeader() {
      let IDs = [{ ID: 1 }];
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
      let res = await GetMenus(form);
      const { result, data, count, msg } = res.data;
      this.$set(this.tableLoading, remarkTb, false);
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
    resetForm() {
      return {
        dicID: 1,
        MenuName: "",
        MenuCode: "",
        ParentCode: "",
        ParentMenuName: "",
        Url: "",
        Component: "",
        Name: "",
        Hidden: false,
        IsEnable: 1,
        keepAlive: true,
        ViewSort: 1,
        Ico: "",
        Status: 1,
      };
    },
    // 点击新增菜单或按钮
    async openDrawer(val) {
      this.tagRremark = val;
      if (val == 1) {
        this.drawer = true;
        this.drawerTitle = "新增菜单";
        this.dialogTitle = "新增";
        for (var name in this.menuForm) {
          this.menuForm[name] = "";
        }
        let query = this.resetForm();
        for (name in query) {
          this.menuForm[name] = query[name];
        }

        if (this.delData[0].length != 0) {
          let row = this.delData[0][0];
          this.menuForm.ParentMenuName = row.MenuName;
          this.menuForm.MenuCode = "";
          this.menuForm.ParentCode = row.MenuCode;
        }
      } else {
        if (this.delData[0].length != 0) {
          this.drawerTitle = "修改菜单/按钮";
          this.dialogTitle = "修改";
          let row = this.delData[0][0];
          this.drawer = true;
          for (let name in row) {
            this.menuForm[name] = row[name];
          }
          if (!row.ParentCode) {
            this.menuForm.ParentMenuName = "";
          } else {
            let res = await GetSearchData({
              MenuCode: row.ParentCode,
              dicID: 1,
              IsEnable: 1,
              rows: 0,
            });
            const { result, data, count, msg } = res.data;
            if (result) {
              this.menuForm.ParentMenuName = data[0].MenuName;
            } else {
              this.$message({
                message: msg,
                type: "error",
                dangerouslyUseHTMLString: true,
              });
            }
          }
          // 获取这个菜单下的按钮
          this.getMenuBtn(row.MenuCode);
        } else {
          this.$message.error("请单击需要修改的菜单！");
        }
      }
    },
    // 弹框确定添加
    sureAdd() {
      if (this.Type == "按钮") {
        this.sureLoading = true;
        let btns = _this.$refs.btnTree.getCheckedNodes();
        btns = btns.concat(_this.$refs.btnTree.getHalfCheckedNodes());
        if (this.delData[0].length == 0) {
          this.$message.error("请单击需要配置按钮的菜单！");
        } else {
          let newData = btns.filter(
            (x) => !this.initialBtnData.some((y) => y.ButtonID == x.ButtonID)
          ); //新增
          let newData2 = this.initialBtnData.filter(
            (c) => !btns.some((z) => c.ButtonID == z.ButtonID)
          ); //删除
          let submitData = [];
          if (newData.length != 0) {
            newData.forEach((a) => {
              a["MenuCode"] = this.delData[0][0].MenuCode;
              a["ButtonMenuMapID"] = -1;
              a["dicID"] = 30;
              submitData.push(a);
            });
          }
          if (newData2.length != 0) {
            newData2.forEach((b) => {
              b["dicID"] = 30;
              b["ElementDeleteFlag"] = 1;
              submitData.push(b);
            });
          }
          this.returnResultData(submitData).then((res) => {
            const { result, msg } = res.data;
            if (result) {
              this.getMenuBtn(this.delData[0][0].MenuCode);
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
            this.sureLoading = false;
          });
        }
      } else {
        this.$refs.menuForm.validate((valid) => {
          if (valid) {
            this.sureLoading = true;
            this.returnResultData([this.menuForm]).then((res) => {
              const { result, msg } = res.data;
              if (result) {
                this.dataSearch(0);
                this.drawer = false;
                _this.$refs.menuForm.resetFields();
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
              this.sureLoading = false;
            });
          }
        });
      }
    },
    // 选择菜单树形
    selectHandleNodeClick(data, node) {
      this.menuForm.ParentMenuName = data.MenuName;
      this.menuForm.ParentCode = data.MenuCode;
      this.$refs.formRef.blur();
    },
    // 下拉选择事件
    handleCommand(val) {
      if (val == 1) {
      } else if (val == 2) {
      } else if (val == 3 || val == 4) {
        this.isOpen = !this.isOpen;
        this.changeTreeNodeStatus(this.$refs.btnTree.store.root);
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
    // 获取所有按钮
    async getAllBtn() {
      let res = await GetSearchData({ dicID: 28, rows: 0 });
      const { result, data, count, msg } = res.data;
      if (result) {
        this.btnData = data;
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
    },
    // 获取所有菜单
    async getAllMenu() {
      let res = await GetMenus({
        dicID: 1,
        MenuCode: null,
        MenuName: "",
        IsEnable: 1,
      });
      const { result, data, count, msg } = res.data;
      if (result) {
        console.log(data);
        this.treeData = data;
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
    },
    // 获取菜单下的按钮
    async getMenuBtn(MenuCode) {
      let res = await GetSearchData({ dicID: 30, MenuCode: MenuCode, rows: 0 });
      const { result, data, count, msg } = res.data;
      if (result) {
        this.$set(this, "checkdBtnCodes", []);
        this.$refs.btnTree.setCheckedKeys([]);
        this.initialBtnData = data;
        data.forEach((x) => {
          this.checkdBtnCodes.push(x.ButtonID);
        });
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
    },
    // 清除上级角色
    clearData(val) {
      if (!val) {
        this.menuForm.ParentCode = null;
      }
    },
  },
};
</script>