<!--菜单设置-->
<template>
  <div class="container" v-loading="adminLoading">
    <div class="admin_head" ref="headRef">
      <ComSearch
        ref="searchRef"
        :searchData="formSearchs[0].datas"
        :searchForm="formSearchs[0].forms"
        :remark="0"
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
              <el-button type="primary" size="mini" @click="openDrawer(true)"
                >新增角色</el-button
              >
              <el-divider direction="vertical"></el-divider>
              <el-button type="warning" size="mini" @click="openDrawer(false)"
                >用户/菜单/按钮配置</el-button
              >
              <!-- <el-radio-group
                v-model="operationType"
                size="small"
                @click="openDrawer"
              >
                <el-radio-button label="新增角色"></el-radio-button>
                <el-radio-button label="菜单/按钮配置"></el-radio-button>
              </el-radio-group> -->

              <el-divider direction="vertical"></el-divider>
              <el-tooltip
                class="item"
                effect="dark"
                content="刷新"
                placement="bottom"
              >
                <span class="right_icon" @click="refrshPage">
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
                      <path
                        d="M758.2 839.1C851.8 765.9 912 651.9 912 523.9 912 303 733.5 124.3 512.6 124 291.4 123.7 112 302.8 112 523.9c0 125.2 57.5 236.9 147.6 310.2 3.5 2.8 8.6 2.2 11.4-1.3l39.4-50.5c2.7-3.4 2.1-8.3-1.2-11.1-8.1-6.6-15.9-13.7-23.4-21.2a318.64 318.64 0 01-68.6-101.7C200.4 609 192 567.1 192 523.9s8.4-85.1 25.1-124.5c16.1-38.1 39.2-72.3 68.6-101.7 29.4-29.4 63.6-52.5 101.7-68.6C426.9 212.4 468.8 204 512 204s85.1 8.4 124.5 25.1c38.1 16.1 72.3 39.2 101.7 68.6 29.4 29.4 52.5 63.6 68.6 101.7 16.7 39.4 25.1 81.3 25.1 124.5s-8.4 85.1-25.1 124.5a318.64 318.64 0 01-68.6 101.7c-9.3 9.3-19.1 18-29.3 26L668.2 724a8 8 0 00-14.1 3l-39.6 162.2c-1.2 5 2.6 9.9 7.7 9.9l167 .8c6.7 0 10.5-7.7 6.3-12.9l-37.3-47.9z"
                      ></path></svg
                  ></span>
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
          :remark="0"
          :sysID="40"
          :isEdit="true"
          :isClear="isClear[0]"
          :pagination="tablePagination[0]"
          @handleRowClick="handleRowClick"
          @pageChange="pageChange"
          @pageSize="pageSize"
          @sortChange="sortChange"
          @editRow="editRow"
          @delRow="delRow"
        />
      </div>
    </div>

    <el-drawer :title="drawerTitle" :visible.sync="drawer" direction="rtl">
      <div class="drawer_body">
        <el-form
          :model="roleForm"
          :rules="roleRules"
          ref="roleForm"
          label-width="90px"
          class="demo-ruleForm"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item label="上级角色" prop="ParentRoleName">
                <el-select
                  size="small"
                  ref="formRef"
                  v-model="roleForm.ParentRoleName"
                  :clearable="true"
                  @change="clearData"
                >
                  <el-option
                    :value="roleForm.ParentID"
                    :label="roleForm.ParentRoleName"
                  >
                    <el-tree
                      ref="selectTree"
                      :props="roleProps"
                      :data="roleData"
                      :expand-on-click-node="false"
                      default-expand-all
                      @node-click="selectHandleNodeClick"
                    ></el-tree>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="角色名称" prop="RoleName">
                <el-input
                  v-model="roleForm.RoleName"
                  type="text"
                  size="small"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="状态" prop="Status">
                <el-radio-group v-model="roleForm.Status" size="small">
                  <el-radio :label="1">启用</el-radio>
                  <el-radio :label="0">禁用</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <el-form label-width="90px" v-show="!operationStatus">
          <el-row>
            <el-col :span="24">
              <el-form-item label="修改类型" prop="">
                <el-radio-group
                  v-model="editType"
                  size="small"
                  @change="getDialogData"
                >
                  <el-radio-button label="用户"></el-radio-button>
                  <el-radio-button label="菜单"></el-radio-button>
                  <el-radio-button label="按钮"></el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <div v-show="!operationStatus && editType == '用户'">
          <div class="flex_row_spaceBtn px-7-20 border-b-1">
            <span class="px_16">用户分配</span>
            <div>
              <el-autocomplete
                class="iconBtn"
                size="small"
                placeholder="输入账号或姓名"
                v-model="userValue.Name"
                clearabled
                :fetch-suggestions="fetchsuggertions"
                @select="(item) => getRemote(item)"
              >
                <template slot-scope="{ item }">
                  <div style="border-bottom: 1px dashed #8c8e8e">
                    {{ item.Account }} - {{ item.Name }}
                  </div>
                </template>
              </el-autocomplete>
              <i class="el-icon-search iconBtn" @click="searchRoleUser"></i>
              <i class="el-icon-plus iconBtn" @click="addRoleUser"></i>
              <el-dropdown @command="handleCommand0">
                <img src="../../../assets/svg/dot.svg" />
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="1">删除全部</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
          <div class="menuTree" v-loading="dialogLoading[0]">
            <div
              v-for="o in userData"
              :key="o.Account"
              class="text item flex_row_spaceBtn standStyle px-7-20"
            >
              <span>{{ o.Account }} - {{ o.Name }}</span>
              <el-button
                type="danger"
                icon="el-icon-delete"
                circle
                size="mini"
                @click="delRoleUser(o)"
              ></el-button>
            </div>
          </div>
        </div>

        <div v-show="!operationStatus && editType == '菜单'">
          <div class="flex_row_spaceBtn px-7-20 border-b-1">
            <span class="px_16">菜单分配</span>
            <el-dropdown @command="handleCommand">
              <img src="../../../assets/svg/dot.svg" />
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="1">刷新</el-dropdown-item>
                <!-- <el-dropdown-item command="2">取消全部</el-dropdown-item> -->
                <el-dropdown-item command="2" divided
                  >展开全部</el-dropdown-item
                >
                <el-dropdown-item command="3">折叠全部</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div class="menuTree">
            <el-tree
              v-loading="dialogLoading[1]"
              :data="menuData"
              show-checkbox
              :default-expand-all="isOpen"
              :default-checked-keys="checkdBtnCodes"
              :node-key="'MenuCode'"
              ref="roleMenuTree"
              highlight-current
              :props="menuProps"
              :check-strictly="true"
            >
            </el-tree>
          </div>
        </div>

        <div v-show="!operationStatus && editType == '按钮'">
          <div class="flex_row_spaceBtn px-7-20 border-b-1">
            <span class="px_16">按钮分配</span>
            <el-dropdown @command="handleCommand2">
              <img src="../../../assets/svg/dot.svg" />
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="1">刷新</el-dropdown-item>
                <!-- <el-dropdown-item command="2">取消全部</el-dropdown-item> -->
                <el-dropdown-item command="2" divided
                  >展开全部</el-dropdown-item
                >
                <el-dropdown-item command="3">折叠全部</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div class="menuTree">
            <el-tree
              v-loading="dialogLoading[2]"
              :data="menuBtnData"
              show-checkbox
              :default-expand-all="isOpen2"
              :default-checked-keys="checkdBtnCodes2"
              :node-key="'ButtonMenuMapID'"
              ref="menuBtnTree"
              highlight-current
              :props="menuBtnProps"
            >
            </el-tree>
          </div>
        </div>
      </div>
      <div class="drawer_footer">
        <el-button plain size="small" @click="drawer = false">取消</el-button>
        <el-button
          type="primary"
          size="small"
          @click="sureAdd"
          :loading="sureLoading"
          >确认</el-button
        >
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
  GetRoles,
  SaveData,
  ExportData,
  GetFuzzySearchData,
  GetMenus,
  GetMenuRoleBtn,
} from "@/api/Common";
export default {
  name: "RoleInfo",
  components: {
    ComSearch,
    ComUmyTable,
  },
  data() {
    return {
      adminLoading: false,
      ////////////////// Search /////////////////
      sureLoading: false,
      title: this.$route.meta.title,
      drawerTitle: "新增角色",
      delData: [[]],
      operationStatus: true,
      editType: "用户",
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
      tableColumns: [[]],
      tableLoading: [false],
      isClear: [false],
      tablePagination: [{ pageIndex: 1, pageSize: 50, pageTotal: 0 }],
      height: "707px",
      showPagination: true,
      tagRemark: 0,
      /* 弹框数据 */
      operationType: "新增角色",
      Type: "目录",
      roleForm: {
        RoleName: "",
        RoleID: "",
        ParentID: "",
        ParentRoleName: "",
        Status: 1,
        dicID: 40,
      },
      roleRules: {
        RoleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
        ],
      },
      roleProps: { label: "RoleName", children: "children" },
      roleData: [],
      menuData: [],
      menuBtnData: [],
      checkdBtnCodes: [],
      checkdBtnCodes2: [],
      initialBtnData: [],
      initialBtnData2: [],
      isOpen: true,
      isOpen2: true,
      menuProps: {
        children: "children",
        label: "MenuName",
      },
      menuBtnProps: {
        children: "children",
        label: "MenuName",
      },
      orgForm: {},
      orgData: [],
      orgProps: {
        children: "children",
        label: "OrganizeName",
      },
      userValue: {
        Account: "",
        Name: "",
        OrganizeName: "",
        OrganizeID: "",
        dicID: 41,
        RoleID: "",
        ID: null,
      },
      userData: [],
      dialogLoading: [false, false, false],
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
    this.getTableHeader();
    // 获取菜单
    // this.getAllMenu();
    // 获取角色
    this.getAllRole();
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
    // 树形数据的保存
    dataTreeSave(remarkTb, index, parms, newData) {
      if (this.tableData[remarkTb].length != 0) {
        let submitData = [];
        this.tableData[remarkTb].forEach((x) => {
          if (x.update) {
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
          submitData.push(x);
        }
        if (x.children && x.children.length != 0) {
          this.getChildrensData(x, submitData);
        }
      });
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
      let IDs = [{ ID: 40 }];
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
          _this.dataSave(remarkTb, index, null, newData);
        })
        .catch((_) => {});
    },
    // 获取表格数据
    async getTableData(form, remarkTb) {
      this.$set(this.tableLoading, remarkTb, true);
      form["rows"] = this.tablePagination[remarkTb].pageSize;
      form["page"] = this.tablePagination[remarkTb].pageIndex;
      let res = await GetRoles(form);
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
    // 单击行
    handleRowClick(row, remarkTb) {
      this.delData[remarkTb] = [];
      this.delData[remarkTb].push(row);
    },
    // 点击新增菜单或按钮
    async openDrawer(val) {
      for (var name in this.roleForm) {
        this.roleForm[name] = "";
      }
      this.roleForm.dicID = 40;
      this.drawer = true;
      this.roleForm.Status = 1;
      this.operationStatus = val;
      if (val) {
        this.drawerTitle = "新增角色";
        if (this.delData[0].length != 0) {
          this.roleForm.ParentID = this.delData[0][0].RoleID;
          this.roleForm.ParentRoleName = this.delData[0][0].RoleName;
        }
      } else {
        if (this.delData[0].length == 0) {
          this.$message.error("请单击角色列表选择需要配置的角色！");
          return;
        }
        this.editType = "用户";
        this.drawerTitle = "菜单/按钮配置";
        this.$set(this.dialogLoading, 0, true);
        for (let name in this.roleForm) {
          this.roleForm[name] = this.delData[0][0][name];
        }
        let row = this.delData[0][0];
        if (!row.ParentID) {
          this.roleForm.ParentRoleName = "";
        } else {
          let res = await GetSearchData({
            RoleID: row.ParentID,
            dicID: 40,
            rows: 0,
          });
          const { result, data, count, msg } = res.data;
          if (result) {
            this.roleForm.ParentRoleName = data[0].RoleName;
          } else {
            this.$message({
              message: msg,
              type: "error",
              dangerouslyUseHTMLString: true,
            });
          }
        }
        // 获取角色用户
        this.getRoleUser(this.delData[0][0].RoleID, null);
        this.drawer = true;
      }
    },
    // 清除上级角色
    clearData(val) {
      if (!val) {
        this.roleForm.ParentID = null;
      }
    },
    // 弹框确定添加
    sureAdd() {
      if (this.operationStatus) {
        // 新增
        this.$refs.roleForm.validate((valid) => {
          if (valid) {
            let newData = [this.roleForm];
            this.returnResultData(newData).then((res) => {
              const { result, msg } = res.data;
              if (result) {
                this.$refs.roleForm.resetFields();
                this.dataSearch(0);
                this.getAllRole();
                this.$message({
                  message: msg,
                  type: "success",
                  dangerouslyUseHTMLString: true,
                });
                this.drawer = false;
              } else {
                this.$message({
                  message: msg,
                  type: "error",
                  dangerouslyUseHTMLString: true,
                });
                this.drawer = false;
              }
            });
          }
        });
      } else {
        if (this.editType == "菜单") {
          this.sureLoading = true;
          let menus = _this.$refs.roleMenuTree.getCheckedNodes();
          let menus2 = _this.$refs.roleMenuTree.getHalfCheckedNodes();
          if (menus2.length != 0) {
            menus2.forEach((x) => {
              x.TempKey = 1;
            });
          }
          let submitData = [];
          menus = menus.concat(menus2);
          let newData = menus.filter(
            (x) => !this.initialBtnData.some((y) => y.MenuCode == x.MenuCode)
          ); //新增

          let newData3 = this.initialBtnData.filter((r) =>
            menus2.some((t) => r.MenuCode == t.MenuCode)
          ); // 本来有的值但是变成半选状态需要更新
          if (newData3.length != 0) {
            newData3.forEach((p) => {
              p["dicID"] = 42;
              p["TempKey"] = 1;
              submitData.push(p);
            });
          }
          let newData2 = this.initialBtnData.filter(
            (c) => !menus.some((z) => c.MenuCode == z.MenuCode)
          ); //删除
          if (newData.length != 0) {
            newData.forEach((a) => {
              // let obj = {};
              // obj["MenuCode"] = a;
              a["RoleID"] = this.delData[0][0].RoleID;
              a["ID"] = -1;
              a["dicID"] = 42;
              submitData.push(a);
            });
          }
          if (newData2.length != 0) {
            newData2.forEach((b) => {
              b["dicID"] = 42;
              b["ElementDeleteFlag"] = 1;
              submitData.push(b);
            });
          }
          this.returnResultData(submitData).then((res) => {
            const { result, msg } = res.data;
            if (result) {
              this.getRoleMenu(this.delData[0][0].RoleID);
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
        } else if (this.editType == "按钮") {
          this.sureLoading = true;
          let btns = _this.$refs.menuBtnTree.getCheckedNodes();
          let btns2 = _this.$refs.menuBtnTree.getHalfCheckedNodes();
          if (btns2.length != 0) {
            btns2.forEach((x) => {
              x.TempKey = 1;
            });
          }
          btns = btns.concat(btns2);
          let submitData = [];
          let newData = btns.filter(
            (x) =>
              !this.initialBtnData2.some(
                (y) => y.ButtonMenuMapID == x.ButtonMenuMapID
              )
          ); //新增
          let newData3 = this.initialBtnData.filter((r) =>
            btns2.some((t) => r.ButtonMenuMapID == t.ButtonMenuMapID)
          ); // 本来有的值但是变成半选状态需要更新
          if (newData3.length != 0) {
            newData3.forEach((p) => {
              p["dicID"] = 42;
              p["TempKey"] = 1;
              submitData.push(p);
            });
          }
          let newData2 = this.initialBtnData2.filter(
            (c) => !btns.some((z) => c.ButtonMenuMapID == z.ButtonMenuMapID)
          ); //删除
          if (newData.length != 0) {
            newData.forEach((a) => {
              a["RoleID"] = this.delData[0][0].RoleID;
              a["ID"] = -1;
              a["dicID"] = 31;
              submitData.push(a);
            });
          }
          if (newData2.length != 0) {
            newData2.forEach((b) => {
              b["dicID"] = 31;
              b["ElementDeleteFlag"] = 1;
              submitData.push(b);
            });
          }
          this.returnResultData(submitData).then((res) => {
            const { result, msg } = res.data;
            if (result) {
              this.getRoleMenu(this.delData[0][0].RoleID);
              this.$refs.roleForm.resetFields();
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
      }
    },
    // 保存返回结果自己处理事件
    async returnResultData(newData) {
      let res = await SaveData(newData);
      return res;
    },
    // 通用直接保存
    async generalSaveData(newData, remarkTb, index) {
      this.adminLoading = true;
      let res = await SaveData(newData);
      const { result, data, count, msg } = res.data;
      if (result) {
        this.dataSearch(remarkTb);
        this.getAllRole();
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
    // 选择角色树形
    selectHandleNodeClick(data, node) {
      this.roleForm.ParentRoleName = data.RoleName;
      this.roleForm.ParentID = data.RoleID;
      this.$refs.formRef.blur();
    },
    // 选择组织树形
    selectHandleNodeClick2(data, node) {
      this.roleForm.OrganizeName = data.OrganizeName;
      this.menuForm.OrganizeID = data.OrganizeID;
      this.$refs.formRef_two.blur();
    },
    handleCommand0(val) {
      this.$confirm("确定要删除所有用户数据吗？")
        .then((_) => {
          _this.userData.forEach((x) => {
            x["ElementDeleteFlag"] = 1;
            x["dicID"] = 41;
          });
          _this.returnResultData(_this.userData).then((res) => {
            const { result, msg } = res.data;
            if (result) {
              _this.getRoleUser(_this.delData[0][0].RoleID, null);
            } else {
              _this.$message.error(msg);
            }
          });
        })
        .catch((_) => {});
    },
    // 下拉选择事件
    handleCommand(val) {
      if (val == 1) {
        this.getRoleMenu(this.delData[0][0].RoleID);
      } else if (val == 2) {
        this.isOpen = true;
        this.changeTreeNodeStatus(
          this.$refs.roleMenuTree.store.root,
          this.isOpen
        );
      } else if (val == 3) {
        this.isOpen = false;
        this.changeTreeNodeStatus(
          this.$refs.roleMenuTree.store.root,
          this.isOpen
        );
      }
    },
    // 下拉选择事件
    handleCommand2(val) {
      if (val == 1) {
        this.GetMenuRoleBtn(this.delData[0][0].RoleID);
      } else if (val == 2) {
        this.isOpen2 = true;
        this.changeTreeNodeStatus(
          this.$refs.menuBtnTree.store.root,
          this.isOpen2
        );
      } else if (val == 3) {
        this.isOpen2 = false;
        this.changeTreeNodeStatus(
          this.$refs.menuBtnTree.store.root,
          this.isOpen2
        );
      }
    },
    // 改变节点状态
    changeTreeNodeStatus(node, isOpen) {
      node.expanded = isOpen;
      for (let i = 0; i < node.childNodes.length; i++) {
        // 改变节点的自身expanded状态
        node.childNodes[i].expanded = this.isOpen;
        // 遍历子节点
        if (node.childNodes[i].childNodes.length > 0) {
          this.changeTreeNodeStatus(node.childNodes[i]);
        }
      }
    },
    // 获取所有菜单
    async getAllMenu() {
      this.$set(this.dialogLoading, 1, true);
      let res = await GetMenus({
        dicID: 1,
        MenuCode: null,
        MenuName: "",
        IsEnable: 1,
      });
      const { result, data, count, msg } = res.data;
      if (result) {
        this.menuData = data;
        this.getRoleMenu(this.delData[0][0].RoleID);
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
    },
    // 获取所有角色
    async getAllRole() {
      let res = await GetRoles({ dicID: 40, RoleID: null, RoleName: "" });
      const { result, data, count, msg } = res.data;
      if (result) {
        this.roleData = data;
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
    },
    // 获取角色下所有菜单按钮
    async GetMenuRoleBtn(RoleID) {
      console.log(RoleID);
      this.menuBtnData = [];
      this.$set(this.dialogLoading, 2, true);
      let res = await GetMenuRoleBtn({
        dicID: 48,
        RoleID: RoleID,
        ParentCode: "null",
      });
      const { result, data, count, msg } = res.data;
      if (result) {
        this.menuBtnData = data;
        this.getRoleMenuBtn(RoleID);
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
    },
    // 获取已经配置了的角色菜单按钮
    async getRoleMenuBtn(RoleID) {
      let res = await GetSearchData({ dicID: 63, RoleID: RoleID, rows: 0 });
      const { result, data, count, msg } = res.data;
      if (result) {
        _this.$set(this.dialogLoading, 2, false);
        this.$set(this, "checkdBtnCodes2", []);
        this.$refs.menuBtnTree.setCheckedKeys([]);

        // if (this.checkdBtnCodes2.length != 0) {
        //   _this.$refs.menuBtnTree.setCheckedKeys([]);
        //   _this.$set(_this, "checkdBtnCodes2", []);
        // }
        _this.initialBtnData2 = data;
        if (data.length != 0) {
          data.forEach((x) => {
            if (x.TempKey != 1) {
              _this.checkdBtnCodes2.push(x.ButtonMenuMapID);
            }
          });
        }
      } else {
        _this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
        _this.$set(_this.dialogLoading, 2, false);
      }
    },
    // 获取角色用户
    async getRoleUser(RoleID, Account) {
      let res = await GetSearchData({
        dicID: 47,
        RoleID: RoleID,
        Account: Account,
      });
      const { result, data, count, msg } = res.data;
      if (result) {
        this.$set(this.dialogLoading, 0, false);
        this.userData = [];
        setTimeout(() => {
          this.$nextTick(() => {
            _this.$set(_this, "userData", data);
          });
        }, 1500);
      } else {
        this.$set(this.dialogLoading, 0, false);
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
    },
    // 获取角色下的菜单
    async getRoleMenu(RoleID) {
      this.$set(this.dialogLoading, 1, true);
      let res = await GetSearchData({ dicID: 42, RoleID: RoleID, rows: 0 });
      const { result, data, count, msg } = res.data;
      if (result) {
        this.$set(this, "checkdBtnCodes", []);
        this.$refs.roleMenuTree.setCheckedKeys([]);
        this.initialBtnData = data;
        data.forEach((x) => {
          if (x.TempKey != 1) {
            this.checkdBtnCodes.push(x.MenuCode);
          }
        });
        this.$set(this.dialogLoading, 1, false);
      } else {
        this.$set(this.dialogLoading, 1, false);
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
    },
    getDialogData(val, index) {
      if (val == "菜单") {
        // 获取角色下的菜单
        this.getAllMenu();
      } else if (val == "按钮") {
        // 获取角色下菜单下的按钮
        this.GetMenuRoleBtn(this.delData[0][0].RoleID);
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
    // 远程搜索账号跟姓名
    async fetchsuggertions(val, cb) {
      if (val) {
        let res = await GetFuzzySearchData({
          dicID: 25,
          Account: val,
          Name: val,
        });
        const { result, data, count, msg } = res.data;
        if (result) {
          cb(data);
        } else {
          this.$message({
            message: msg,
            type: "error",
            dangerouslyUseHTMLString: true,
          });
        }
      }
    },
    // 选中账号
    getRemote(item) {
      this.userValue.Account = item.Account;
      this.userValue.Name = item.Name;
      this.userValue.OrganizeID = item.OrganizeID;
      this.userValue.OrganizeName = item.OrganizeName;
    },
    // 添加
    addRoleUser() {
      if (this.userValue.Name && this.userValue.Account) {
        let newData = [];
        this.userValue.RoleID = this.delData[0][0].RoleID;
        newData.push(this.userValue);
        _this.returnResultData(newData).then((res) => {
          const { result, msg } = res.data;
          if (result) {
            _this.getRoleUser(_this.delData[0][0].RoleID, null);
            _this.GetMenuRoleBtn(_this.delData[0][0].RoleID);
            _this.$message.success(msg);
            _this.userValue.Account = "";
            _this.userValue.Name = "";
            _this.userValue.OrganizeID = "";
            _this.userValue.OrganizeName = "";
          } else {
            _this.$message.error(msg);
          }
        });
      } else {
        this.$message.error("请输入有效的账户信息！");
      }
    },
    // 查询用户
    searchRoleUser() {
      this.getRoleUser(this.delData[0][0].RoleID, this.userValue.Account);
    },
    // 删除用户
    delRoleUser(item) {
      this.$confirm("确定要删除该用户吗？")
        .then((_) => {
          item["ElementDeleteFlag"] = 1;
          item["dicID"] = 41;
          let newData = [];
          newData.push(item);
          _this.returnResultData(newData).then((res) => {
            const { result, msg } = res.data;
            if (result) {
              _this.getRoleUser(_this.delData[0][0].RoleID, null);
              _this.$message.success(msg);
            } else {
              _this.$message.error(msg);
            }
          });
        })
        .catch((_) => {});
    },
  },
};
</script>