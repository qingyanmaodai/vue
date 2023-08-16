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
              <el-button type="primary" size="mini" @click="openDrawer"
                >新增组织</el-button
              >
              <el-divider direction="vertical"></el-divider>
              <el-tooltip
                class="item"
                effect="dark"
                content="刷新"
                placement="bottom"
              >
                <span class="right_icon">
                  <span
                    @click="refrshPage"
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
              <el-tooltip effect="dark" content="列设置" placement="bottom">
                <span class="right_icon">
                  <span
                    role="img"
                    aria-label="setting"
                    class="anticon anticon-setting icon_size"
                    ><svg
                      class=""
                      data-icon="setting"
                      width="1em"
                      height="1em"
                      fill="currentColor"
                      aria-hidden="true"
                      viewBox="64 64 896 896"
                      focusable="false"
                    >
                      <path
                        d="M924.8 625.7l-65.5-56c3.1-19 4.7-38.4 4.7-57.8s-1.6-38.8-4.7-57.8l65.5-56a32.03 32.03 0 009.3-35.2l-.9-2.6a443.74 443.74 0 00-79.7-137.9l-1.8-2.1a32.12 32.12 0 00-35.1-9.5l-81.3 28.9c-30-24.6-63.5-44-99.7-57.6l-15.7-85a32.05 32.05 0 00-25.8-25.7l-2.7-.5c-52.1-9.4-106.9-9.4-159 0l-2.7.5a32.05 32.05 0 00-25.8 25.7l-15.8 85.4a351.86 351.86 0 00-99 57.4l-81.9-29.1a32 32 0 00-35.1 9.5l-1.8 2.1a446.02 446.02 0 00-79.7 137.9l-.9 2.6c-4.5 12.5-.8 26.5 9.3 35.2l66.3 56.6c-3.1 18.8-4.6 38-4.6 57.1 0 19.2 1.5 38.4 4.6 57.1L99 625.5a32.03 32.03 0 00-9.3 35.2l.9 2.6c18.1 50.4 44.9 96.9 79.7 137.9l1.8 2.1a32.12 32.12 0 0035.1 9.5l81.9-29.1c29.8 24.5 63.1 43.9 99 57.4l15.8 85.4a32.05 32.05 0 0025.8 25.7l2.7.5a449.4 449.4 0 00159 0l2.7-.5a32.05 32.05 0 0025.8-25.7l15.7-85a350 350 0 0099.7-57.6l81.3 28.9a32 32 0 0035.1-9.5l1.8-2.1c34.8-41.1 61.6-87.5 79.7-137.9l.9-2.6c4.5-12.3.8-26.3-9.3-35zM788.3 465.9c2.5 15.1 3.8 30.6 3.8 46.1s-1.3 31-3.8 46.1l-6.6 40.1 74.7 63.9a370.03 370.03 0 01-42.6 73.6L721 702.8l-31.4 25.8c-23.9 19.6-50.5 35-79.3 45.8l-38.1 14.3-17.9 97a377.5 377.5 0 01-85 0l-17.9-97.2-37.8-14.5c-28.5-10.8-55-26.2-78.7-45.7l-31.4-25.9-93.4 33.2c-17-22.9-31.2-47.6-42.6-73.6l75.5-64.5-6.5-40c-2.4-14.9-3.7-30.3-3.7-45.5 0-15.3 1.2-30.6 3.7-45.5l6.5-40-75.5-64.5c11.3-26.1 25.6-50.7 42.6-73.6l93.4 33.2 31.4-25.9c23.7-19.5 50.2-34.9 78.7-45.7l37.9-14.3 17.9-97.2c28.1-3.2 56.8-3.2 85 0l17.9 97 38.1 14.3c28.7 10.8 55.4 26.2 79.3 45.8l31.4 25.8 92.8-32.9c17 22.9 31.2 47.6 42.6 73.6L781.8 426l6.5 39.9zM512 326c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm79.2 255.2A111.6 111.6 0 01512 614c-29.9 0-58-11.7-79.2-32.8A111.6 111.6 0 01400 502c0-29.9 11.7-58 32.8-79.2C454 401.6 482.1 390 512 390c29.9 0 58 11.6 79.2 32.8A111.6 111.6 0 01624 502c0 29.9-11.7 58-32.8 79.2z"
                      ></path></svg
                  ></span>
                </span>
              </el-tooltip>
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
          :sysID="3026"
          :expandAll="true"
          :isEdit="true"
          :isClear="isClear[0]"
          :pagination="tablePagination[0]"
          @handleRowClick="handleRowClick"
          @pageChange="pageChange"
          @pageSize="pageSize"
          @sortChange="sortChange"
        />
      </div>
    </div>

    <!-- 新增组织弹框 -->
    <ComFormDialog
      :title="'新增组织'"
      ref="orgRef"
      :dialogShow="dialogShow"
      :formData="formData"
      :formRules="formRules"
      :formController="formController"
      @selectHandleNodeClick="selectHandleNodeClick"
      @dialogBtnClick="dialogBtnClick"
    />
  </div>
</template>

<script>
var _this;
import { mapState } from "vuex";
import ComSearch from "@/components/ComSearch";
import ComUmyTable from "@/components/ComUmyTable";
import ComFormDialog from "@/components/ComFormDialog";
import {
  GetHeader,
  GetSearchData,
  ExportData,
  SaveData,
  GetOrgData,
} from "@/api/Common";
export default {
  name: "OrganizeInfo",
  components: {
    ComSearch,
    ComUmyTable,
    ComFormDialog,
  },
  data() {
    return {
      ////////////////// Search /////////////////
      title: this.$route.meta.title,
      drawer: false,
      formSearchs: [
        {
          datas: {},
          forms: [],
        },
      ],
      btnForm: [
        // {
        //   ButtonCode: "save",
        //   BtnName: "保存",
        //   isLoading: false,
        //   Methods: "dataTreeSave",
        //   Type: "success",
        //   Icon: "",
        //   Size: "small",
        // },
        // {
        //   ButtonCode: "delete",
        //   BtnName: "删除",
        //   isLoading: false,
        //   Methods: "dataDel",
        //   Type: "danger",
        //   Icon: "",
        //   Params: { dataName: "delData" },
        //   Size: "small",
        // },
      ],
      parmsBtn: [
        {
          ButtonCode: "save",
          BtnName: "保存",
          isLoading: false,
          Methods: "dataTreeSave",
          Type: "success",
          Icon: "",
          Size: "small",
        },
        {
          ButtonCode: "delete",
          BtnName: "删除",
          isLoading: false,
          Methods: "dataDel",
          Type: "danger",
          Icon: "",
          Params: { dataName: "delData" },
          Size: "small",
        },
      ],
      tableData: [[]],
      tableColumns: [[]],
      tableLoading: [false],
      isClear: [false],
      delData: [[]],
      tablePagination: [{ pageIndex: 1, pageSize: 50, pageTotal: 0 }],
      height: "707px",
      showPagination: true,
      tagRemark: 0,
      isLoading: false,
      //////////////新增弹框//////////////
      dialogShow: false,
      formData: {
        OrganizeName: "",
        OrganizeID: -1,
        ParentName: "",
        ParentID: null,
        TotalPeoples: null,
        dicID: 36,
        Status: 1,
      },
      formController: [
        { label: "组织名称", prop: "OrganizeName", type: "input" },
        {
          label: "上级组织",
          prop: "ParentName",
          type: "selectTree",
          treeData: [],
          methods: "selectHandleNodeClick",
          treeProps: { label: "OrganizeName", children: "children" },
        },
        {
          label: "组织人数",
          prop: "TotalPeoples",
          type: "input",
          inputType: "number",
        },
        {
          label: "状态",
          prop: "Status",
          type: "radioGroupLabel",
          radioGroups: [
            { label: "启用", value: 1 },
            { label: "禁用", value: 0 },
          ],
        },
      ],
      formRules: {
        OrganizeName: [
          { required: true, message: "组织名称为必填项", trigger: "blur" },
        ],
      },
      adminLoading: false,
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
  computed: {
    ...mapState({
      treeData: (state) => state.user.orgTreeData,
    }),
  },
  created() {
    _this = this;
    this.judgeBtn();
    this.getTableHeader();
  },
  mounted() {
    setTimeout(() => {
      this.setHeight();
      this.formController[1].treeData = this.treeData;
    }, 350);
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
      debugger;
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
    // 单击行
    handleRowClick(row, remarkTb) {
      this.delData[remarkTb] = [];
      this.delData[remarkTb].push(row);
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
          // 保存负责人
          let newData = [];
          let childrens = [];
          submitData.some((x, o) => {
            // 能提报的人转成用逗号隔开保存
            if (x.Extend2.length != 0) {
              x.Extend2 = x.Extend2.join(",");
            } else {
              x.Extend2 = "";
            }
            let obj = JSON.parse(JSON.stringify(x));
            if (!obj.PeoplesValue) {
              if (obj.ToList.length != 0) {
                // 全删
                obj.ToList.forEach((y, j) => {
                  let row = {};
                  row["Account"] = y;
                  row["OrganizeID"] = x.OrganizeID;
                  row["ElementDeleteFlag"] = 1;
                  row["dicID"] = 6724;
                  row["ID"] = obj.PeoplesID[j];
                  childrens.push(row);
                });
              } else {
                return true;
              }
            } else {
              if (obj.ToList.length == 0) {
                // 全增
                obj.PeoplesValue.forEach((y) => {
                  let row = {};
                  row["Account"] = y;
                  row["OrganizeID"] = x.OrganizeID;
                  row["dicID"] = 6724;
                  childrens.push(row);
                });
              } else {
                let Data1 = obj.PeoplesValue.filter(
                  (w) => !obj.ToList.some((q) => q == w)
                ); //新增
                let Data2 = obj.ToList.filter(
                  (c) => !obj.PeoplesValue.some((z) => c == z)
                ); //删除
                if (Data1.length != 0) {
                  Data1.forEach((a) => {
                    let row1 = {};
                    row1["Account"] = a;
                    row1["OrganizeID"] = x.OrganizeID;
                    row1["dicID"] = 6724;
                    childrens.push(row1);
                  });
                }
                if (Data2.length != 0) {
                  Data2.forEach((b) => {
                    let newIndex = obj.ToList.findIndex((w) => {
                      return w == b;
                    });
                    let row2 = {};
                    row2["Account"] = b;
                    row2["OrganizeID"] = x.OrganizeID;
                    row2["ElementDeleteFlag"] = 1;
                    row2["ID"] = obj.PeoplesID[newIndex];
                    row2["dicID"] = 6724;
                    childrens.push(row2);
                  });
                }
              }
            }

            // 判断不良审批的负责人
            if (!obj.PeoplesBadValue) {
              if (obj.ToList_2.length != 0) {
                // 全删
                obj.ToList_2.forEach((y, j) => {
                  let row = {};
                  row["Account"] = y;
                  row["OrganizeID"] = x.OrganizeID;
                  row["ElementDeleteFlag"] = 1;
                  row["dicID"] = 7899;
                  row["ID"] = obj.BadPeoplesID[j];
                  childrens.push(row);
                });
              } else {
                return true;
              }
            } else {
              if (obj.ToList_2.length == 0) {
                // 全增
                obj.PeoplesBadValue.forEach((y) => {
                  let row = {};
                  row["Account"] = y;
                  row["OrganizeID"] = x.OrganizeID;
                  row["dicID"] = 7899;
                  childrens.push(row);
                });
              } else {
                let Data1 = obj.PeoplesBadValue.filter(
                  (w) => !obj.ToList_2.some((q) => q == w)
                ); //新增
                let Data2 = obj.ToList_2.filter(
                  (c) => !obj.PeoplesBadValue.some((z) => c == z)
                ); //删除
                if (Data1.length != 0) {
                  Data1.forEach((a) => {
                    let row1 = {};
                    row1["Account"] = a;
                    row1["OrganizeID"] = x.OrganizeID;
                    row1["dicID"] = 7899;
                    childrens.push(row1);
                  });
                }
                if (Data2.length != 0) {
                  Data2.forEach((b) => {
                    let newIndex = obj.ToList_2.findIndex((w) => {
                      return w == b;
                    });
                    let row2 = {};
                    row2["Account"] = b;
                    row2["OrganizeID"] = x.OrganizeID;
                    row2["ElementDeleteFlag"] = 1;
                    row2["ID"] = obj.BadPeoplesID[newIndex];
                    row2["dicID"] = 7899;
                    childrens.push(row2);
                  });
                }
              }
            }
          });
          if (childrens.length != 0) {
            submitData = submitData.concat(childrens);
          }
          this.generalSaveData(submitData, 0, index);
        } else {
          this.$message.error("没有可保存的数据");
        }
      } else {
        this.$message.error("没有可保存的数据");
      }
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
            obj["dicID"] = 36;
            newData.push(obj);
          });
        }
      } else {
        this.tableData[remarkTb].forEach((y) => {
          let obj2 = y;
          obj2["ElementDeleteFlag"] = 1;
          obj2["dicID"] = 36;
          newData.push(obj2);
        });
      }
      this.$confirm("确定要删除的【" + newData.length + "】数据吗？")
        .then((_) => {
          _this.dataSave(remarkTb, index, null, newData);
        })
        .catch((_) => {});
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
        this.$message({
          message: msg,
          type: "success",
          dangerouslyUseHTMLString: true,
        });
        this.dataSearch(remarkTb);
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
    // 获取表头数据
    async getTableHeader() {
      let IDs = [{ ID: 3026 }];
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
        this.getTableData(this.formSearchs[0].datas, 0);
      }
    },
    // 验证数据
    verifyDta(n) {
      if (n.prop == "PeoplesValue") {
        this.$set(n, "propName", "PeoplesStr");
      }
      if (n.prop == "ParentID") {
        this.$set(n, "propName", "ParentName");
      }
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
      let res = await GetOrgData(form);
      const { result, data, count, msg } = res.data;
      if (result) {
        if (data.length != 0) {
          // 递归渲染数据
          this.setChildrens(data);
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
    // 递归渲染子数据
    setChildrens(data) {
      data.forEach((x) => {
        if (x.PeoplesValue) {
          x.PeoplesValue = x.PeoplesValue.split(",");
        } else {
          x.PeoplesValue = [];
        }
        if (x.PeoplesBadValue) {
          x.PeoplesBadValue = x.PeoplesBadValue.split(",");
        } else {
          x.PeoplesBadValue = [];
        }
        if (x.PeoplesID) {
          x.PeoplesID = x.PeoplesID.split(",");
        } else {
          x.PeoplesID = [];
        }
        if (x.BadPeoplesID) {
          x.BadPeoplesID = x.BadPeoplesID.split(",");
        } else {
          x.BadPeoplesID = [];
        }
        if (x.Extend2) {
          this.$set(x, "ChangePlanStr", JSON.parse(JSON.stringify(x.Extend2)));
          x.Extend2 = x.Extend2.split(",");
        } else {
          this.$set(x, "ChangePlanStr", "");
          x.Extend2 = [];
        }
        this.$set(x, "ToList", x.PeoplesValue);
        this.$set(x, "ToList_2", x.PeoplesBadValue);
        if (x.children.length != 0) {
          this.setChildrens(x.children);
        }
      });
    },
    // 点击新增菜单或按钮
    openDrawer() {
      if (this.delData[0].length != 0) {
        this.formData.ParentName = this.delData[0][0].OrganizeName;
        this.formData.ParentID = this.delData[0][0].OrganizeID;
      }
      this.dialogShow = true;
    },
    // 选择菜单树形
    selectHandleNodeClick(data, node) {
      this.formData.ParentName = data.OrganizeName;
      this.formData.ParentID = data.OrganizeID;
      this.$refs.orgRef.$refs.formTreeRef[0].blur();
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
        } else {
          this.$message({
            message: msg,
            type: "error",
            dangerouslyUseHTMLString: true,
          });
        }
        this.dialogShow = false;
      } else {
        _this.$refs.orgRef.$refs.formData.resetFields();
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
  },
};
</script>
