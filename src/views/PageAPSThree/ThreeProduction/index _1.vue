<!--报工第一步-->
<template>
  <div
    class="container flex_flex"
    v-loading="adminLoading"
  >
    <div class="admin_left">
      <div>
        <div class="flex px-2 py-1.5 border-b-1 tree_Head">
          <span class="tree_text">制造部信息</span>
        </div>
        <el-tree
          class="tree-line"
          :indent="0"
          ref="asideTree"
          node-key="OrganizeID"
          :data="treeData"
          :props="treeProps"
          :style="{ height: '' + treeHeight + '', overflow: 'auto' }"
          highlight-current
          :expand-on-click-node="false"
          @node-click="handleNodeClick"
        ></el-tree>
      </div>
    </div>
    <div class="admin_container">
      <div class="admin_content">
        <div
          class="admin_content_all"
          :style="{height:height,overflow:'auto'}"
        >
          <div class="flex_wrap">
            <el-button
              class="list_box"
              plain
              v-for="(item,i) in rightData"
              :type="currentRow.LineID == item.LineID?'primary':''"
              :key="i"
              @click="openDialog(item)"
            >
              {{item.LineName}} 计划产品（8） 待报工（8）
            </el-button>
          </div>

        </div>
      </div>
    </div>

    <el-dialog
      :title="title"
      :visible.sync="dialogShow"
      :close-on-click-modal="false"
      width="90%"
    >
      <div
        class="container"
        style="background-color: #f0f2f5;"
      >
        <div class="admin_content">
          <ComSearch
            ref="searchRef"
            :searchData="formSearchs[0].datas"
            :searchForm="formSearchs[0].forms"
            :remark="0"
            :btnForm="btnForm[0]"
            @btnClick="btnClick"
          />
          <el-row>
            <el-col>日期： 制造部门： 生产线： 负责人：</el-col>
          </el-row>
          <div class="flex">
            <div class="dialog_table_left">
              <ComVxeTable
                :rowKey="'RowNumber'"
                :height="'500px'"
                :tableData="tableData[0]"
                :tableHeader="tableColumns[0]"
                :tableLoading="tableLoading[0]"
                :remark="0"
                :sysID="sysID[0].ID"
                :isClear="isClear[0]"
                :pagination="tablePagination[0]"
                @pageChange="pageChange"
                @pageSize="pageSize"
                @sortChange="sortChange"
              />
            </div>
            <div class="dialog_table_right">
              <ComVxeTable
                :rowKey="'RowNumber'"
                :height="'500px'"
                :hasSelect="true"
                :tableData="tableData[1]"
                :tableHeader="tableColumns[1]"
                :tableLoading="tableLoading[1]"
                :remark="1"
                :sysID="sysID[1].ID"
                :isClear="isClear[1]"
                :pagination="tablePagination[1]"
                @pageChange="pageChange"
                @pageSize="pageSize"
                @selectf="selectFun"
                @sortChange="sortChange"
              />
            </div>
          </div>

        </div>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          @click="dialogShow = false"
          size="small"
        >取 消</el-button>
        <el-button
          type="primary"
          @click="dialogBtnClick"
          size="small"
        >提 交 报 工</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
var _this;
import ComSearch from "@/components/ComSearch";
import ComAsideTree from "@/components/ComAsideTree";
import ComVxeTable from "@/components/ComVxeTable";
import { GetHeader, GetSearchData, ExportData, SaveData } from "@/api/Common";
import ComFormDialog from "@/components/ComFormDialog";
import { mapState } from "vuex";
export default {
  name: "ThreeProduction",
  components: {
    ComSearch,
    ComAsideTree,
    ComVxeTable,
    ComFormDialog,
  },
  data() {
    return {
      rightData: [],
      currentRow: { WorkShopName: "", LineName: "", Approvals: "", LineID: 8 },
      sysID: [{ ID: 7784 }, { ID: 86 }],
      //////////////左侧树节点//////////////
      treeData: [],
      treeProps: {
        label: "OrganizeName",
        children: "children",
      },
      selectionData: [[], []],
      ///////////////新增弹框//////////////
      dialogShow: false,
      ////////////////// Search /////////////////
      title: this.$route.meta.title,
      delData: [[]],
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
      parmsBtn: [],
      btnForm: [],
      tableData: [[], []],
      tableColumns: [[], []],
      tableLoading: [false, false],
      isClear: [false, false],
      tablePagination: [
        { pageIndex: 1, pageSize: 500, pageTotal: 0 },
        { pageIndex: 1, pageSize: 0, pageTotal: 0 },
      ],
      height: "707px",
      treeHeight: "765px",
      showPagination: true,
      tagRemark: 0,
      isEdit: false,
      clickData: {},
      remark: 1,
      adminLoading: false,
      submitForm: "",
      standWorkTime: {},
      allLevelTwoProcessData: [],
      LevelTwoProcessData: [],
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
    this.getLineLevelProcessData();
    this.getTableHeader();
    for (var i = 0; i < 10; i++) {
      this.rightData.push({});
    }
  },
  mounted() {
    this.getWorkShopData();
    setTimeout(() => {
      this.setHeight();
    }, 500);
  },
  methods: {
    searchTree(msg) {
      this.treeData = [];
      let treeListTmp = JSON.parse(JSON.stringify(this.treeListTmp));
      let tmp = msg
        ? this.rebuildData(msg, treeListTmp)
        : JSON.parse(JSON.stringify(treeListTmp));
      this.treeData.push(...tmp);
    },
    rebuildData(value, arr) {
      if (!arr) {
        return [];
      }
      let newarr = [];
      if (Object.prototype.toString.call(arr) === "[object Array]") {
        arr.forEach((element) => {
          if (element.OrganizeName.indexOf(value) > -1) {
            // const ab = this.rebuildData(value, element.children);
            const obj = {
              ...element,
              children: element.children,
            };
            newarr.push(obj);
          } else {
            if (element.children && element.children.length > 0) {
              const ab = this.rebuildData(value, element.children);
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
    // 获取车间
    async getWorkShopData() {
      this.treeData = [];
      this.treeListTmp = [];
      let form = {
        dicID: 36,
        OrganizeTypeID: 5,
        Status: 1,
      };
      let res = await GetSearchData(form);
      const { result, data, count, msg } = res.data;
      if (result) {
        this.treeData = data;
        this.treeListTmp = data;
        if (data.length != 0) {
          this.$nextTick(function () {
            if (Object.values(_this.$refs).length != 0) {
              _this.$refs.asideTree.setCurrentKey(data[0].OrganizeID);
              _this.getLineList(data[0].OrganizeID);
            }
          });
        }
      } else {
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
          console.log(newData);
          if (newData.length != 0) {
            newBtn = newBtn.concat(newData);
          }
        });
      }
      this.$set(this.btnForm, 0, newBtn);
      this.$set(this, "isEdit", permission);
    },
    // 高度控制
    setHeight() {
      this.treeHeight = document.documentElement.clientHeight - 150 + "px";
      let rem = document.documentElement.clientHeight - 110;
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

        this.dataSearch(remarkTb);
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
      this.submitForm = row;
    },
    // 获取线列表
    async getLineList(val) {
      this.rightData = [];
      let form = {
        dicID: 7782,
        WorkShopID: val,
      };
      let res = await GetSearchData(form);
      const { result, data, count, msg } = res.data;
      if (result) {
        this.rightData = data;
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
    },
    // 删除
    async dataDel(remarkTb, index, parms) {
      let res = null;
      let newData = [];
      if (parms && parms.dataName) {
        if (this[parms.dataName][remarkTb].length == 0) {
          this.$message.error("请单击需要操作的数据！");
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
    async generalSaveData(newData, remarkTb, index, tag) {
      this.adminLoading = true;
      let res = await SaveData(newData);
      const { result, data, count, msg } = res.data;
      if (result) {
        this.dataSearch(remarkTb);
        if (remarkTb == 1) {
          // 提报成功，清空右侧人员数据重新给默认值
          this.clearData();
        }
        this.$message({
          message: msg,
          type: "success",
          dangerouslyUseHTMLString: true,
        });
        this.adminLoading = false;

        if (tag) {
          this.getWorkShopData();
        }
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
      let IDs = this.sysID;
      let res = await GetHeader(IDs);
      const { datas, forms, result, msg } = res.data;
      if (result) {
        // 获取每个表头
        datas.some((m, i) => {
          m.forEach((n) => {
            // 进行验证
            this.verifyData(n);
            if (n.children && n.children.length != 0) {
              n.children.forEach((x) => {
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
      } else {
        this.adminLoading = false;
      }
    },
    // 验证数据
    verifyData(n) {
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
        if (remarkTb == 1) {
          // 是人员就先把标准时间填进去
          if (data.length != 0) {
            data.forEach((a) => {
              a["StartTime"] = this.standWorkTime.StartTime;
              a["EndTime"] = this.standWorkTime.EndTime;
              a["TotalHour"] = this.standWorkTime.TotalHour;
              a["LevelTwoProcessData"] = this.LevelTwoProcessData;
            });
          }
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
    // 选择数据
    selectFun(data, remarkTb, row) {
      this.selectionData[remarkTb] = data;
    },
    // 获取日计划
    openDialog(item) {
      this.currentRow = item;
      this.dialogShow = true;
      // 获取日计划
      this.formSearchs[0].datas["LineID"] = this.currentRow.LineID;
      this.dataSearch(0);
      // 获取对应线别的人员
      // 提取线别对应的二级工序
      this.LevelTwoProcessData = this.allLevelTwoProcessData.filter(
        (a) => a.LineID == this.currentRow.LineID
      );
      this.formSearchs[1].datas["OrganizeID"] = this.currentRow.LineID;
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
        this.dataSearch(1);
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
    },
    // 弹框确定提报
    dialogBtnClick(val) {
      if (
        Object.values(this.submitForm).length == 0 ||
        !this.submitForm.ProducedQty ||
        parseFloat(this.submitForm.ProducedQty <= 0)
      ) {
        this.$message.error("请单击选中需要提报的产品并填写报工数！");
      } else {
        // 判断提报的数量不能大于总钱数
        if (
          parseFloat(this.submitForm.ProducedQty) >
          parseFloat(this.submitForm.TotalOweQty)
        ) {
          this.$message.error("提报的数量大于总欠数！");
          return;
        }
        if (this.selectionData[1].length == 0) {
          this.$message.error("请勾选提报的生产人员！");
        } else {
          let flag = 0;
          this.selectionData[1].some((a) => {
            if (!a.TotalHour) {
              flag = 1;
              return true;
            }
          });
          if (flag == 0) {
            let submitData = [];
            this.submitForm.dicID = 5586;
            let childrens = [];
            this.selectionData[1].forEach((c) => {
              let LevelTwoProcessName = "";
              if (c.LevelTwoProcessID.length != 0) {
                // 得到这些二级工序id的工序名称
                let filterLevelTwoProcessData = this.LevelTwoProcessData.filter(
                  (q) =>
                    !c.LevelTwoProcessID.some((w) => w == q.LevelTwoProcessID)
                );
                LevelTwoProcessName = filterLevelTwoProcessData
                  .map((x) => {
                    return x.LevelTwoProcessName;
                  })
                  .join(",");
              }
              let obj = {}; // 121的提报生产人员的ID 缺少 StartTime，EndTime字段
              obj["dicID"] = 6710;
              obj["Account"] = c.Account;
              obj["TotalHours"] = c.TotalHour;
              obj["StartTime"] = c.StartTime;
              obj["EndTime"] = c.EndTime;
              obj["Remark2"] = LevelTwoProcessName;
              childrens.push(obj);
            });
            this.submitForm["childrens"] = childrens;
            submitData.push(this.submitForm);
            this.generalSaveData(submitData, 1);
          } else {
            this.$message.error("开始时间与结束时间为必填项！");
          }
        }
      }
      this.dialogShow = false;
    },
    // 清空人员默认值
    clearData() {
      if (this.tableData[1].length != 0) {
        this.tableData[1].forEach((a) => {
          this.$set(a, "StartTime", this.standWorkTime.StartTime);
          this.$set(a, "EndTime", this.standWorkTime.EndTime);
          if (this.LevelTwoProcessData.length == 1) {
            this.$set(a, "LevelTwoProcessID", [
              this.LevelTwoProcessData[0].LevelTwoProcessID,
            ]);
          } else {
            this.$set(a, "LevelTwoProcessID", []);
          }
        });
      }
    },
    // 单击出来产品人员
    handleNodeClick(data, node) {
      this.getLineList(data.OrganizeID);
    },
  },
};
</script>