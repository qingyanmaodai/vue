<!--菜单设置-->
<template>
  <div class="APSContainer" v-loading="adminLoading">
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
                >新增二级工序</el-button
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
          :sysID="sysID"
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

    <!-- 新增用户弹框 -->
    <ComFormDialog
      ref="btnForm"
      :title="'新增二级工序'"
      :dialogShow="dialogShow"
      :formData="formData"
      :formRules="formRules"
      :formController="formController"
      @dialogBtnClick="dialogBtnClick"
    />
  </div>
</template>

<script>
var _this;
import ComSearch from "@/components/ComSearch";
import ComUmyTable from "@/components/ComUmyTable";
import ComFormDialog from "@/components/ComFormDialog";
import { GetHeader, GetSearchData, ExportData, SaveData } from "@/api/Common";
export default {
  name: "TinyProcessInfo",
  components: {
    ComSearch,
    ComUmyTable,
    ComFormDialog,
  },
  data() {
    return {
      adminLoading: false,
      ////////////////// Search /////////////////
      title: this.$route.meta.title,
      drawer: false,
      delData: [[]],
      formSearchs: [
        {
          datas: {},
          forms: [],
        },
      ],
      sysID: 7774,
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
      formData: {
        TinyProcessName: "",
        Status: 1,
        dicID: 7774,
      },
      formController: [
        { label: "工序名称", prop: "TinyProcessName", type: "input" },
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
        TinyProcessName: [
          { required: true, message: "工序名称为必填项", trigger: "blur" },
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
        .catch((_) => {});
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
    openDrawer() {
      this.dialogShow = true;
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
        _this.$refs.btnForm.$refs.formData.resetFields();
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
