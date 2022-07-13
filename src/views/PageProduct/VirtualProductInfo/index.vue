<!--产品信息-->
<template>
  <div
    class="container flex_flex"
    v-loading="adminLoading"
  >
    <div class="admin_left">
      <ComAsideTree
        ref="asideRef"
        :treeData="treeData"
        :title="'虚拟组件信息'"
        :treeHeight="treeHeight"
        :nodekey="'MaterialID'"
        :treeProps="treeProps"
        :isEdit="isEdit"
        @searchTree="searchTree"
        @handleCommand="handleCommand"
        @handleNodeClick="handleNodeClick"
      />
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
          :btnForm="btnForm[0]"
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
                <el-button
                  type="primary"
                  size="mini"
                  @click="openDrawer"
                >{{rightName}}</el-button>
                <el-divider direction="vertical"></el-divider>
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
            :rowKey="'RowNumber'"
            :height="height"
            :tableData="tableData[0]"
            :tableHeader="tableColumns[0]"
            :tableLoading="tableLoading[0]"
            :remark="0"
            :sysID="6730"
            :isClear="isClear[0]"
            :pagination="tablePagination[0]"
            @handleRowClick="handleRowClick"
            @pageChange="pageChange"
            @pageSize="pageSize"
            @sortChange="sortChange"
          />
        </div>
      </div>
    </div>

    <!--  -->
    <ComFormDialog
      ref="materialOrgRef"
      :title="dialogTilte"
      :dialogShow="dialogShow"
      :formData="formData"
      :formRules="formRules"
      :formController="formController"
      @dialogBtnClick="dialogBtnClick"
    />

    <el-dialog
      :title="title"
      :visible.sync="dialogShow2"
      width="90%"
    >
      <ComSearch
        class="margin_bottom_10"
        ref="searchRef"
        :searchData="formSearchs[1].datas"
        :searchForm="formSearchs[1].forms"
        :remark="1"
        @btnClick="btnClick"
      />
      <ComUmyTable
        :rowKey="'RowNumber'"
        :height="'600px'"
        :tableData="tableData[1]"
        :tableHeader="tableColumns[1]"
        :tableLoading="tableLoading[1]"
        :remark="1"
        :sysID="12"
        :hasSelect="true"
        :isClear="isClear[1]"
        :pagination="tablePagination[1]"
        @pageChange="pageChange"
        @pageSize="pageSize"
        @sortChange="sortChange"
        @selectfun="selectFun"
      />
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          @click="dialogShow2 = false"
          size="small"
        >取 消</el-button>
        <el-button
          type="primary"
          @click="saveConfig"
          size="small"
        >确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
var _this;
import ComSearch from "@/components/ComSearch";
import ComAsideTree from "@/components/ComAsideTree";
import ComUmyTable from "@/components/ComUmyTable";
import { GetHeader, GetSearchData, ExportData, SaveData } from "@/api/Common";
import ComFormDialog from "@/components/ComFormDialog";
import { mapState } from "vuex";
export default {
  name: "VirtualProductInfo",
  components: {
    ComSearch,
    ComAsideTree,
    ComUmyTable,
    ComFormDialog,
  },
  data() {
    return {
      //////////////左侧树节点//////////////
      treeProps: {
        label: "MaterialName",
        children: "children",
      },
      selectionData: [[], []],
      ///////////////新增弹框//////////////
      dialogTilte: "新增",
      dialogShow: false,
      dialogShow2: false,
      formData: {
        Code: "",
        MaterialName: "",
        Spec: "",
        MaterialID: "",
        Extend18: "APS虚拟组件",
        dicID: 12,
      },
      treeData: [],
      treeListTmp: [],
      formController: [
        {
          label: "编码",
          prop: "Code",
          type: "input",
          disabled: false,
          placholder: "自动生成",
        },
        { label: "产品名称", prop: "MaterialName", type: "input" },
        { label: "规格", prop: "Spec", type: "input" },
      ],
      formRules: {
        Code: [
          { required: true, message: "产品编码为必填项", trigger: "blur" },
        ],
        MaterialName: [
          { required: true, message: "产品名称为必填项", trigger: "blur" },
        ],
      },
      ////////////////// Search /////////////////
      title: this.$route.meta.title,
      rightName: "配置半成品",
      drawer: false,
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
      parmsBtn: [
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
      btnForm: [[], []],
      tableData: [[], []],
      tableColumns: [[], []],
      tableLoading: [false, false],
      isClear: [false, false],
      tablePagination: [
        { pageIndex: 1, pageSize: 30, pageTotal: 0 },
        { pageIndex: 1, pageSize: 100, pageTotal: 0 },
      ],
      height: "707px",
      treeHeight: "765px",
      showPagination: true,
      tagRemark: 0,
      isEdit: false,
      clickData: {},
      remark: 1,
      adminLoading: false,
      Status1: [
        { label: "关联的半成品", value: 1, title: "半成品列表",name:'半成品',rightName:'配置半成品',MaterialType:'半成品'},
        { label: "关联的成品", value: 3, title: "成品列表",name:'成品',rightName:'配置成品',MaterialType:'成品' },
      ],
      labelStatus1: 0,
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
    this.getMaterialData();
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
          if (element.MaterialName.indexOf(value) > -1) {
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
    // 获取产品
    async getMaterialData() {
      this.treeData = [];
      this.treeListTmp = [];
      let form = {
        dicID: 12,
        Extend18: "APS虚拟组件",
      };
      let res = await GetSearchData(form);
      const { result, data, count, msg } = res.data;
      if (result) {
        this.treeData = data;
        this.treeListTmp = data;
        if (data.length != 0) {
          this.$nextTick(function () {
            _this.$refs.asideRef.$refs.asideTree.setCurrentKey(
              data[0].MaterialID
            );
            _this.clickData = data[0];
          });
          this.formSearchs[0].datas["ParantMaterialID"] = data[0].MaterialID;
          this.formSearchs[0].datas["dicID"] = 6730;
          this.formSearchs[0].datas["MaterialType"] = '半成品';
          this.formSearchs[1].datas["MaterialType"] = '半成品';
          this.formSearchs[0].datas["Extend18"] = 'null';
          this.dataSearch(0);
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
          if (newData.length != 0) {
            newBtn = newBtn.concat(newData);
          }
        });
      }
      this.$set(this.btnForm, 0, newBtn);
      this.$set(this, "isEdit", permission);
      // if (this.isEdit) {
      //   this.btnForm[1].push({
      //     ButtonCode: "save",
      //     BtnName: "保存",
      //     Type: "success",
      //     Ghost: true,
      //     Size: "small",
      //     Methods: "saveConfig",
      //     Icon: "",
      //   });
      // }
    },
    // 高度控制
    setHeight() {
      this.treeHeight = document.documentElement.clientHeight - 150 + "px";
      let headHeight = this.$refs.headRef.offsetHeight;
      
      let rem =
        document.documentElement.clientHeight - headHeight - 
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
        this.$message({
                message: msg,
                type: "success",
                dangerouslyUseHTMLString: true,
              });
        this.adminLoading = false;
        
        if (tag) {
          this.getMaterialData();
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
      let IDs = [{ ID: 6730 }, { ID: 12 }];
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
        this.tableColumns[1].splice(this.tableColumns[1].length - 1, 1);
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
      console.log(form)
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
    // 选择数据
    selectFun(data, remarkTb, row) {
      this.selectionData[remarkTb] = data;
    },
    // 配置虚拟组件产品
    openDrawer() {
      if (this.clickData) {
        this.dialogShow2 = true;
        this.dataSearch(1);
      } else {
        this.$message.error("请单击左侧需要配置的组件！");
      }
    },
    // 弹框确定添加
    dialogBtnClick(val) {
      this.dialogShow = false;
      if (val) {
        if (this.remark == 1) {
          this.formData.MaterialID = "";
        }
        let newData = [];
        newData.push(this.formData);
        this.generalSaveData(newData, 0, 0, 1);
        this.getMaterialData();
      } else {
        for (let name in this.formData) {
          this.formData[name] = "";
        }
      }
    },
    // 单击出来产品人员
    handleNodeClick(data, node) {
      this.clickData = data;
      this.$set(this.formSearchs[0].datas, "MaterialIDs", data.MaterialID);
      this.dataSearch(0);
    },
    // 选择菜单树形
    selectHandleNodeClick(data, node) {
      this.formData.MaterialName = data.MaterialName;
      this.formData.MaterialID = data.MaterialID;
      this.$refs.materialOrgRef.$refs.formTreeRef[0].blur();
    },
    // 接收下拉
    handleCommand(val) {
      this.remark = val;
      if (val == 1) {
        this.dialogTilte = "新增";
        this.dialogShow = true;
        this.$nextTick(() => {
          _this.$refs.materialOrgRef.$refs.formData.resetFields();
        });
      } else if (val == 2) {
        if (this.clickData) {
          this.dialogTilte = "修改";
          this.dialogShow = true;
          for (var name in this.clickData) {
            this.formData[name] = this.clickData[name];
          }
        } else {
          this.$message.error("请单击左侧的组件");
        }
      } else {
        if (this.clickData) {
          this.$confirm("确定要删除数据吗？")
            .then((_) => {
              _this.clickData["ElementDeleteFlag"] = 1;
              let newData = [];
              newData.push(_this.clickData);
              _this.generalSaveData(newData, 0, 0);
            })
            .catch((_) => {});
        } else {
          this.$message.error("请单击左侧的组件");
        }
      }
    },
    // 保存配置
    saveConfig() {
      if (this.selectionData[1].length == 0) {
        this.$message.error("请选择需要配置的产品！");
      } else {
        let childrens = this.selectionData[1];
        childrens.forEach((x) => {
          x["ParantMaterialID"] = this.clickData.MaterialID;
          x["dicID"] = 6728;
        });
        let obj = JSON.parse(JSON.stringify(this.clickData));
        obj["childrens"] = childrens;
        let newData = [];
        newData.push(obj);
        this.generalSaveData(newData, 0, 0);
        this.dialogShow2 = false;
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
    // 改变状态
    changeStatus(item, index) {
      this.labelStatus1 = index;
      this.rightName = item.rightName;
      this.title = item.title;
      this.formSearchs.forEach((x) => {
        this.$set(x.datas, "MaterialType", item.MaterialType);
      });
      this.dataSearch(0);
    },
  },
};
</script>