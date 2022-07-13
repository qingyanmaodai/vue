
<template>
  <div
    class="container flex_flex"
    v-loading="adminLoading"
  >
    <div class="admin_container_two">
      <div
        class="admin_head"
        ref="headRef"
      >
        <ComSearch
          ref="searchRef"
          :searchData="formSearchs[0].datas"
          :searchForm="formSearchs[0].forms"
          :remark="0"
          :btnForm="btnForm[0]"
          @btnClick="btnClick"
        />
      </div>
      <div>
        <div class="admin_content">
          <div class="ant-table-title">
            <el-row>
              <el-col :span="8"><span class="title">{{ title }}</span></el-col>
              <el-col
                :span="16"
                class="flex_flex_end"
              >
                <div
                  :class="labelStatus1 == y ? 'statusActive cursor' : 'cursor'"
                  v-for="(item, y) in Status1"
                  :key="y"
                >
                  <span @click="changeStatus(item, y, 1)">{{ item.label }}</span>
                  <el-divider direction="vertical"></el-divider>
                </div>
              </el-col>
            </el-row>
          </div>
          <ComUmyTable
            ref="orgRef"
            :rowKey="'RowNumber'"
            :height="height"
            :tableData="tableData[0]"
            :tableHeader="tableColumns[0]"
            :tableLoading="tableLoading[0]"
            :remark="0"
            :expandAll="true "
            :hasSelect="hasSelect"
            :sysID="3026"
            :isEdit="isEdit"
            :isClear="isClear[0]"
            :pagination="tablePagination[0]"
            @handleRowClick="handleRowClick"
            @lookBom="lookBom"
            @pageChange="pageChange"
            @pageSize="pageSize"
            @selectfun="selectFun"
            @sortChange="sortChange"
          />
        </div>
      </div>
    </div>
    <div class="admin_right_two">
      <div class="ant-table-title margin_lr5">
        <el-row>
          <el-col :span="6"><span class="title">可做工序</span></el-col>
          <el-col
            :span="18"
            class="flex_flex_end"
          >
            <el-button
              type="primary"
              size="mini"
              @click="sureConfig"
              :disabled="!isEdit"
            >保存关联工序</el-button>
            <el-divider direction="vertical"></el-divider>
            <el-button
              v-show="labelStatus1 == 1"
              type="danger"
              size="mini"
              @click="delConfig"
              :disabled="!isEdit"
            >删除关联工序</el-button>
          </el-col>
        </el-row>
      </div>
      <div :style="{'height':'300px','over-flow':'auto','border':'1px solid #D9D9D9','margin':'0 5px 0 5px','padding':'0 10px'}">
        <div
          v-for="(item,i) in childrens"
          :key="i"
        >
          <div class="flex_row_spaceBtn margin_lr5">
            <span>{{item.ProcessName}}</span>
            <i
              class="iconshanchu dangerIconBtn"
              @click="delProcess(item,i)"
            ></i>
          </div>
          <div class="margin_tb5 hr-line-dashed"></div>
        </div>
      </div>
      <div class="flex_row_center">
        <i
          class="icon07jiantouxiangshangfill icon_img"
          @click="addProcess"
        ></i>
      </div>
      <div class="ant-table-title margin_lr5">
        <el-row>
          <el-col :span="6"><span class="title">工序列表</span></el-col>
          <el-col
            :span="18"
            class="flex_flex_end"
          >
            <el-input
              v-model="formSearchs[1].datas.ProcessName"
              placeholder="工序名称"
              size="small"
              @keyup.enter.native="dataSearch(1)"
            >
            </el-input>
            <el-divider direction="vertical"></el-divider>
            <el-button
              type="primary"
              size="mini"
              @click="dataSearch(1)"
            >查询</el-button>
          </el-col>
        </el-row>
      </div>
      <ComUmyTable
        class="margin_lr5"
        :rowKey="'RowNumber'"
        :height="height2"
        :tableData="tableData[1]"
        :tableHeader="tableColumns[1]"
        :tableLoading="tableLoading[1]"
        :remark="1"
        :sysID="14"
        :hasSelect="true"
        :isClear="isClear[1]"
        :pagination="tablePagination[1]"
        @pageChange="pageChange"
        @pageSize="pageSize"
        @selectfun="selectFun"
        @sortChange="sortChange"
      />

    </div>

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
  GetOrgData,
} from "@/api/Common";
import ComFormDialog from "@/components/ComFormDialog";
import { mapState } from "vuex";
export default {
  name: "LineProcessInfo",
  components: {
    ComSearch,
    ComUmyTable,
    ComFormDialog,
  },
  data() {
    return {
      ////////////////// Search /////////////////
      ProcessName: "",
      adminLoading: false,
      labelStatus1: 0,
      hasSelect: false,
      Status1: [
        { label: "单个配置", value: 0 },
        { label: "多个配置", value: 1 },
      ],
      title: this.$route.meta.title,
      dialogShow: false,
      drawer: false,
      delData: [[]],
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
      parmsBtn: [
        [
          {
            ButtonCode: "save",
            BtnName: "保存",
            Type: "success",
            Ghost: true,
            Size: "small",
            Methods: "dataSave",
            Icon: "",
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
        [],
      ],
      btnForm: [[], []],
      tableData: [[], []],
      tableColumns: [[], []],
      tableLoading: [false, false],
      isClear: [false, false],
      tablePagination: [
        { pageIndex: 1, pageSize: 50, pageTotal: 0 },
        { pageIndex: 1, pageSize: 50, pageTotal: 0 },
      ],
      height: "707px",
      height2: "350px",
      showPagination: true,
      tagRemark: 0,
      isEdit: false,
      clickData: {},
      selectionData: [[], []],
      childrens: [],
      templateData: [],
    };
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo,
    }),
  },
  created() {
    _this = this;
    this.adminLoading = true;
    this.judgeBtn();
    this.getTableHeader();
  },
  mounted() {
    setTimeout(() => {
      this.setHeight();
    }, 600);
  },
  methods: {
    // 选择数据
    selectFun(data, remarkTb, row) {
      this.selectionData[remarkTb] = data;
    },
    // 判断按钮权限
    judgeBtn() {
      let routeBtn = this.$route.meta.btns;
      let permission = false;
      if (routeBtn.length != 0) {
        for (var i = 0; i < 2; i++) {
          let newBtn = [];
          routeBtn.forEach((x) => {
            if (x.ButtonCode == "edit") {
              permission = true;
            }
            let newData = this.parmsBtn[i].filter((y) => {
              return x.ButtonCode == y.ButtonCode;
            });
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
      let newHeight2 = 0;
      let rem =
        document.documentElement.clientHeight -
        headHeight -
        this.$store.getters.reduceHeight;
      let newHeight = rem + "px";
      if (this.$store.getters.reduceHeight == 138) {
        newHeight2 = rem - 308 + "px";
      } else {
        newHeight2 = rem - 305 + "px";
      }
      this.$set(this, "height", newHeight);
      this.$set(this, "height2", newHeight2);
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
    // 导出
    async dataExport(remarkTb) {
      this.isLoading[remarkTb] = true;
      let form = JSON.parse(JSON.stringify(this.formSearchs[remarkTb].datas));
      form["rows"] = 0;
      let res = await ExportData(form);
      this.isLoading[remarkTb] = false;
      this.$store.dispatch("user/exportData", res.data);
    },
    // 查询
    dataSearch(remarkTb) {
      this.tagRemark = remarkTb;
      this.tableData[remarkTb] = [];
      this.$set(this.isClear, remarkTb, true);
      this.$set(this.tableLoading, remarkTb, true);
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
    // 保存
    async dataSave(remarkTb, index) {
      let res = await SaveData(this.tableData[remarkTb]);
      const { datas, forms, result, msg } = res.data;
      if (result) {
        this.$message({
          message: msg,
          type: "success",
          dangerouslyUseHTMLString: true,
        });
        this.$set(this.btnForm[remarkTb][index], "isLoading", false);
        this.dataSearch(remarkTb);
      } else {
        this.$set(this.btnForm[remarkTb][index], "isLoading", false);
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
      if (this.labelStatus1 == 0) {
        this.getRowChildrens(row.OrganizeID, row.OrganizeTypeID);
      }
    },
    // 删除
    async dataDel(remarkTb, index, parms) {
      let res = null;
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
      this.$confirm("确定要删除的【" + newData.length + "】数据吗？")
        .then((_) => {
          _this.generalSaveData(newData, remarkTb, index);
        })
        .catch((_) => {});
    },
    // 通用直接保存
    async generalSaveData(newData, remarkTb) {
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
      let IDs = [{ ID: 3026 }, { ID: 14 }];
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
        this.adminLoading = false;
        this.formSearchs[0].datas["OrganizeID"] = this.userInfo.OrganizeID;
        this.formSearchs[0].datas["OrganizeIDs"] = this.userInfo.CenterID;
        this.getTableData(this.formSearchs[0].datas, 0);
        this.getTableData(this.formSearchs[1].datas, 1);
      }
    },
    // 验证数据
    verifyData(n) {
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
      if (remarkTb == 0) {
        let res = await GetOrgData(form);
        const { result, data, count, msg } = res.data;
        if (result) {
          if (data.length != 0) {
            // 递归渲染数据
            this.setChildrens(data);
          }
          this.$set(this.tableData, remarkTb, data);
          this.$set(this.tablePagination[remarkTb], "pageTotal", count);
          this.$set(this.tableLoading, remarkTb, false);
        } else {
          this.$message({
            message: msg,
            type: "error",
            dangerouslyUseHTMLString: true,
          });
          this.$set(this.tableLoading, remarkTb, false);
        }
      } else {
        let res = await GetSearchData(form);
        const { result, data, count, msg } = res.data;
        if (result) {
          this.$set(this.tableData, remarkTb, data);
          this.$set(this.tablePagination[remarkTb], "pageTotal", count);
          this.$set(this.tableLoading, remarkTb, false);
        } else {
          this.$message({
            message: msg,
            type: "error",
            dangerouslyUseHTMLString: true,
          });
          this.$set(this.tableLoading, remarkTb, false);
        }
      }
    },
    // 递归渲染子数据
    setChildrens(data) {
      data.forEach((x) => {
        if (x.PeoplesValue) {
          x.PeoplesValue = x.PeoplesValue.split(",");
        } else {
          x.PeoplesValue = [];
        }
        if (x.PeoplesID) {
          x.PeoplesID = x.PeoplesID.split(",");
        } else {
          x.PeoplesID = [];
        }
        this.$set(x, "ToList", x.PeoplesValue);
        if (x.ProcessIDs) {
          x.ProcessIDs = x.ProcessIDs.split(",");
        } else {
          x.ProcessIDs = [];
        }
        if (x.OrganizeProcessIDs) {
          x.OrganizeProcessIDs = x.OrganizeProcessIDs.split(",");
        } else {
          x.OrganizeProcessIDs = [];
        }
        if (x.children.length != 0) {
          this.setChildrens(x.children);
        }
      });
    },
    // 保存关联工序
    sureConfig() {
      let newData = [];
      debugger
      if (this.labelStatus1 == 0) {
        if (this.delData[0].length == 0) {
          this.$message.error("请单击需要关联的组织！");
        } else if (
          this.delData[0][0].OrganizeTypeID != 5 &&
          this.delData[0][0].OrganizeTypeID != 6
        ) {
          this.$message.error("请单击车间或者线别！");
        } else if (this.childrens.length == 0) {
          this.$message.error("请添加需要关联的工序！");
        } else {
          let row = this.delData[0][0];
          let submitData = [];
          if (row.OrganizeTypeID == 5) {
            let rowChildrens = row.children;
            if (rowChildrens.length == 0) {
              this.$message.error("该车间未配置拉线，无法关联工序！");
            } else {
              rowChildrens.forEach((x) => {
                submitData = this.childrens.filter(
                  (w) =>
                    !this.templateData.some((q) => q.ProcessID == w.ProcessID)
                );
                if (submitData.length != 0) {
                  submitData.forEach((y) => {
                    let obj = {};
                    obj = JSON.parse(JSON.stringify(x));
                    obj.dicID = 130;
                    obj["ProcessID"] = y.ProcessID;
                    newData.push(obj);
                  });
                }
              });
            }
          } else if (row.OrganizeTypeID == 6) {
            submitData = this.childrens.filter(
              (w) => !this.templateData.some((q) => q.ProcessID == w.ProcessID)
            );
            if (submitData.length != 0) {
              submitData.forEach((z) => {
                if (z.IsAdd) {
                  let obj2 = {};
                  obj2 = JSON.parse(JSON.stringify(row));
                  obj2.dicID = 130;
                  obj2["ProcessID"] = z.ProcessID;
                  obj2["OrganizeProcessID"] = "";
                  newData.push(obj2);
                }
              });
            }
          }
        }
      } else {
        if (this.selectionData[0].length == 0) {
          this.$message.error("请勾选需要配置的线别！");
        } else if (this.childrens.length == 0) {
          this.$message.error("请添加需要配置的工序！");
        } else {
          let checkData = this.selectionData[0].filter((q) => {
            return q.OrganizeTypeID == 6;
          });
          if (checkData.length != 0) {
            checkData.forEach((a) => {
              let Data1 = this.childrens.filter(
                (w) => !a.ProcessIDs.some((q) => q == w.ProcessID)
              ); //新增
              // let Data2 = a.ProcessIDs.filter(
              //   (c) => !this.childrens.some((z) => c == z.ProcessID)
              // ); //删除

              if (Data1.length != 0) {
                Data1.forEach((t) => {
                  let newRow = JSON.parse(JSON.stringify(a));
                  newRow["ProcessID"] = t.ProcessID;
                  newRow["dicID"] = 130;
                  newRow["OrganizeProcessID"] = "";
                  newData.push(newRow);
                });
              }
            });
          }
        }
      }
      if (newData.length != 0) {
        this.generalSaveData(newData, 0, 0);
        this.childrens = [];
      } else {
        this.$message.error("没有可保存的数据！");
      }
    },
    // 删除关联工序
    delConfig() {
      if (this.selectionData[0].length == 0) {
        this.$message.error("请选择需要删除工序的线别！");
      } else if (this.childrens.length == 0) {
        this.$message.error("请添加需要删除的工序！");
      } else {
        this.$confirm("确定要删除吗？")
          .then((_) => {
            let newData = [];
            let checkData = this.selectionData[0].filter((q) => {
              return q.OrganizeTypeID == 6;
            });
            if (checkData.length != 0) {
              checkData.forEach((a) => {
                let Data1 = a.ProcessIDs.filter((c) =>
                  this.childrens.some((z) => c == z.ProcessID)
                ); //删除
                if (Data1.length != 0) {
                  Data1.forEach((t) => {
                    let newRow = JSON.parse(JSON.stringify(a));
                    let newIndex = a.ProcessIDs.findIndex((s) => {
                      return s == t;
                    });
                    newRow["ProcessID"] = t.ProcessID;
                    newRow["dicID"] = 130;
                    newRow["ElementDeleteFlag"] = 1;
                    newRow["OrganizeProcessID"] =
                      a.OrganizeProcessIDs[newIndex];
                    newData.push(newRow);
                  });
                }
              });
            }
            if (newData.length != 0) {
              this.generalSaveData(newData, 0, 0);
              this.childrens = [];
            }
          })
          .catch((_) => {});
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
    // 查看bom
    lookBom(row, remarkTb) {
      this.dialogShow = true;
      this.getBomData(row.MaterialID);
    },
    // 获取BOM数据
    async getBomData(MaterialID) {
      let obj = { dicID: 1185, ParentID: MaterialID, rows: 0 };
      let res = await GetBOM(obj);
      const { result, data, count, msg } = res.data;
      if (result) {
        this.$set(this.tableData, 1, data);
        this.$set(this.tablePagination[1], "pageTotal", count);
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
    // 获取组织下的工序信息
    async getRowChildrens(OrganizeID, OrganizeTypeID) {
      this.childrens = [];
      let form = {};
      form["dicID"] = 5144;
      form["OrganizeIDs"] = OrganizeID;
      let res = await GetSearchData(form);
      const { result, data, count, msg } = res.data;
      if (result) {
        let newData = [];
        if (OrganizeTypeID == 6) {
          this.childrens = data;
          this.templateData = JSON.parse(JSON.stringify(data));
        } else {
          if (data.length != 0) {
            data.forEach((x) => {
              if (
                newData.findIndex((y) => {
                  return y.ProcessID == x.ProcessID;
                }) == -1
              ) {
                newData.push(x);
              }
            });
            this.childrens = newData;
            this.templateData = JSON.parse(JSON.stringify(newData));
          }
        }
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
    },
    // 添加数据上去
    addProcess() {
      if (this.selectionData[1].length != 0) {
        this.selectionData[1].forEach((x) => {
          if (
            this.childrens.findIndex((y) => {
              return y.ProcessID == x.ProcessID;
            }) == -1
          ) {
            let obj = JSON.parse(JSON.stringify(x));
            obj.IsAdd = true;
            this.childrens.push(obj);
          }
        });
      }
    },
    // 删除工序
    delProcess(item, index) {
      if (item.IsAdd) {
        this.childrens.splice(index, 1);
        return;
      } else if (
        this.delData[0][0].OrganizeTypeID != 5 &&
        this.delData[0][0].OrganizeTypeID != 6
      ) {
        this.$message.error("请单击选择车间或线别！");
      } else {
        this.$confirm("确定要删除这条数据吗？")
          .then((_) => {
            let row = this.delData[0][0];
            let newData = [];
            if (row.OrganizeTypeID == 5) {
              let childrens = row.children;
              if (childrens.length != 0) {
                childrens.forEach((a) => {
                  let newIndex = a.ProcessIDs.findIndex((s) => {
                    return s == item.ProcessID;
                  });
                  if (newIndex != -1) {
                    a.dicID = 130;
                    a["ElementDeleteFlag"] = 1;
                    a["ProcessID"] = item.ProcessID;
                    a["OrganizeProcessID"] = a.OrganizeProcessIDs[newIndex];
                    newData.push(a);
                  }
                });
              }
            } else if (row.OrganizeTypeID == 6) {
              item.dicID = 130;
              item["ElementDeleteFlag"] = 1;
              newData.push(item);
            }
            _this
              .returnResultData(newData)
              .then((res) => {
                const { result, msg } = res.data;
                if (result) {
                  _this.childrens = [];
                  _this.dataSearch(0);
                  _this.$message.success(msg);
                } else {
                  _this.$message.error(msg);
                }
              })
              .catch((error) => {
                _this.$message.error(error);
              });
          })
          .catch((_) => {});
      }
    },
    // 改变状态
    changeStatus(item, index) {
      this.labelStatus1 = index;
      this.$refs.orgRef.$refs.plxTable.clearSelection();
      this.childrens = [];
      if (index == 0) {
        this.hasSelect = false;
      } else {
        this.hasSelect = true;
      }
    },
  },
};
</script>
