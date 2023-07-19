<!--菜单设置-->
<template>
  <div class="container" v-loading="adminLoading">
    <div class="admin_head" ref="headRef">
      <ComSearch ref="searchRef" :searchData="formSearchs[0].datas" :searchForm="formSearchs[0].forms" :remark="0"
        :isLoading="isLoading" :btnForm="btnForm" @btnClick="btnClick" />
    </div>
    <div>
      <div class="admin_content">
        <div class="ant-table-title">
          <el-row>
            <el-col :span="4"><span class="title">{{ title }}</span></el-col>
            <el-col :span="20" class="flex_flex_end">
              <el-button type="primary" size="mini" @click="openDrawer(0)">新增模具</el-button>
              <el-divider direction="vertical"></el-divider>
              <el-button type="warning" size="mini" @click="openDrawer(1)">改模</el-button>
              <el-divider direction="vertical"></el-divider>
              <div :class="labelStatus1 == y ? 'statusActive cursor' : 'cursor'" v-for="(item, y) in Status1" :key="y">
                <span @click="changeStatus(item, y)">{{ item.label }}</span>
                <el-divider direction="vertical"></el-divider>
              </div>
            </el-col>
          </el-row>
        </div>
        <ComVxeTable :rowKey="'RowNumber'" :height="height" :tableData="tableData[0]" :tableHeader="tableColumns[0]"
          :tableLoading="tableLoading[0]" :remark="0" :hasSelect="true" :isMultiple="false" :sysID="sysID"
          :isEdit="true" :isClear="isClear[0]" :cellStyle="cellStyle" :pagination="tablePagination[0]"
          @handleRowClick="handleRowClick" @pageChange="pageChange" @pageSize="pageSize" @sortChange="sortChange"
          @selectfun="selectFun" />
      </div>
    </div>

    <!-- 新增用户弹框 -->
    <ComFormDialog ref="btnForm" :title="'新增模具'" :dialogShow="dialogShow" :formData="formData" :formRules="formRules"
      :formController="formController" @dialogBtnClick="dialogBtnClick" />
  </div>
</template>

<script>
var _this;
import ComSearch from "@/components/ComSearch";
import ComVxeTable from "@/components/ComVxeTable";
import ComFormDialog from "@/components/ComFormDialog";
import { GetHeader, GetSearchData, ExportData, SaveData } from "@/api/Common";
export default {
  name: "MoldInfo",
  components: {
    ComSearch,
    ComVxeTable,
    ComFormDialog,
  },
  data() {
    return {
      adminLoading: false,
      ////////////////// Search /////////////////
      labelStatus1: 0,
      Status1: [
        { label: "全部", value: "" },
        { label: "启用", value: [2, 3] },
        { label: "制作中", value: 1 },
        { label: "改模", value: 2 },
        { label: "弃用", value: 0 },
      ],
      title: this.$route.meta.title,
      drawer: false,
      delData: [[]],
      formSearchs: [
        {
          datas: {},
          forms: [],
        },
      ],
      sysID: 110,
      btnForm: [
        {
          ButtonCode: "save",
          BtnName: "保存",
          isLoading: false,
          Methods: "dataSave",
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
          Size: "small",
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
      isLoading: false,
      //////////////新增弹框//////////////
      dialogShow: false,
      delTag: 0,
      formData: {
        OldMoldName: "",
        MoldName: "",
        MoldNO: "",
        MoldHole: "",
        Status: 1,
        dicID: 110,
      },
      formController: [
        {
          label: "旧模名称",
          prop: "OldMoldName",
          type: "input",
          disabled: true,
          IsShow: true,
        },
        { label: "模具名称", prop: "MoldName", type: "input" },
        { label: "模具编号", prop: "MoldNO", type: "input" },
        {
          label: "模穴数",
          prop: "MoldHole",
          type: "input",
          inputType: "number",
        },
        {
          label: "预计完成时间",
          prop: "ExpectDate",
          type: "date",
          IsShow: true,
        },
        {
          label: "状态",
          prop: "Status",
          type: "radioGroupLabel",
          IsShow: true,
          radioGroups: [
            { label: "启用", value: 1 },
            { label: "制作中", value: -1 }
          ],
        },
      ],
      selectionData: [[]],
      formRules: {
        MoldName: [
          { required: true, message: "模具名称为必填项", trigger: "blur" },
        ],
      },
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
  },
  mounted() {
    setTimeout(() => {
      this.setHeight();
    }, 450);
  },
  methods: {
    cellStyle({ row, column }) {
      if (column.property == "IsChangeName" && row.IsChangeName == "是") {
        return {
          background: "#ff7b7b",
        };
      }
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
    selectFun(data, remarkTb, row) {
      this.selectionData[remarkTb] = data;
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
          _this.$set(_this.btnForm[index], "isLoading", true);
          _this.dataSave(remarkTb, index, null, newData);
        })
        .catch((_) => { });
    },
    // 单击行
    handleRowClick(row, remarkTb) {
      this.delData[remarkTb] = [];
      this.delData[remarkTb].push(row);
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
      let IDs = [{ ID: this.sysID }];
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
    // 点击新增菜单或按钮
    openDrawer(tag) {
      if (tag == 1) {
        if (this.selectionData[0].length == 0) {
          this.$message.error("请单击选中需要改模的模具！");
          return;
        } else if (this.selectionData[0][0].IsChange) {
          this.$message.error("该模具正在生产中，不可更改弃用！");
          return;
        } else if (this.selectionData[0][0].Status == 0) {
          this.$message.error("该模具已在改模中！");
          return;
        }
        this.formController[0].IsShow = false;
        this.formController[4].IsShow = false;
        this.formController[5].IsShow = true;
        this.formData.OldMoldName = this.selectionData[0][0].MoldName;
      } else {
        this.formController[0].IsShow = true;
        this.formController[4].IsShow = true;
        this.formController[5].IsShow = false;
      }
      this.delTag = tag;
      this.dialogShow = true;
    },
    // 弹框确定添加
    async dialogBtnClick(val) {
      if (val) {
        if (this.delTag == 0) {
          //新增
          let res = await SaveData([this.formData]);
          const { result, data, count, msg } = res.data;
          if (result) {
            this.$message({
              message: msg,
              type: "success",
              dangerouslyUseHTMLString: true,
            });
            this.dataSearch(0);
            _this.$refs.btnForm.$refs.formData.resetFields();
          } else {
            this.$message({
              message: msg,
              type: "error",
              dangerouslyUseHTMLString: true,
            });
            _this.$refs.btnForm.$refs.formData.resetFields();
          }
          this.dialogShow = false;
        } else {
          // 改模
          let submitData = [];
          let obj = JSON.parse(JSON.stringify(this.selectionData[0][0]));
          obj["Status"] = 0;
          obj["Remark2"] = '改模中';
          submitData.push(obj);
          let obj2 = JSON.parse(JSON.stringify(this.formData));
          obj2["dieBeforeName"] = obj.MoldName;
          obj2["dieBeforeID"] = obj.MachineMouldID;
          obj2["Status"] = 0; //新模也不能使用
          let obj3 = {
            //旧模
            dicID: 7969,
            OperationStatus: 1,
            OperationTag: 1,// 被改模对象
            MachineMouldID: this.selectionData[0][0].MachineMouldID,
            ExpectDate: this.formData.ExpectDate,
            MouldMaintainID: ''
          };
          let obj4 = [
            {
              //新模
              dicID: 7969,
              OperationStatus: 1,
              OperationTag: 2, // 新模对象
              OperationMoldID: this.selectionData[0][0].MachineMouldID, //旧模id
              MachineMouldID: this.formData.MachineMouldID,
              ExpectDate: this.formData.ExpectDate,
              MouldMaintainID: ''
            },
          ];
          obj2["childrens"] = obj4;
          submitData.push(obj2);
          submitData.push(obj3);
          submitData.push(obj4);
          debugger
          this.generalSaveData(submitData, 0);
          this.dialogShow = false;
        }
      } else {
        _this.$refs.btnForm.$refs.formData.resetFields();
        _this.dialogShow = false;
      }
    },
    // 通用直接保存
    async generalSaveData(newData, remarkTb, index) {
      if (newData.length == 0) {
        this.$message.error("没有提交保存的数据！");
        return;
      }
      this.adminLoading = true;
      let res = await SaveData(newData);
      const { result, data, count, msg } = res.data;
      if (result) {
        this.dataSearch(remarkTb);
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
    changeStatus(x, index) {
      this.labelStatus1 = index;
      this.formSearchs[0].datas["StatusTag"] = x.value;
      this.dataSearch(0);
    },
  },
};
</script>