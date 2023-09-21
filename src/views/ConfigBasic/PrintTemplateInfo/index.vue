<!--打印模板配置-->
<template>
  <div class="APSContainer" v-loading="adminLoading">
    <div class="admin_head" ref="headRef">
      <ComSearch
        ref="searchRef"
        :searchData="formSearchs[0].datas"
        :searchForm="formSearchs[0].forms"
        :remark="0"
        :isLoading="isLoading"
        :printForm="printForm"
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
                >新增模板</el-button
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
            </el-col>
          </el-row>
        </div>
        <ComVxeTable
          :rowKey="'RowNumber'"
          :height="height"
          :tableData="tableData[0]"
          :tableHeader="tableColumns[0]"
          :tableLoading="tableLoading[0]"
          :remark="0"
          :sysID="sysID[0].ID"
          :isEdit="true"
          :isClear="isClear[0]"
          :pagination="tablePagination[0]"
          @handleRowClick="handleRowClick"
          @editRow="editRow"
          @addRow="addRow"
          @pageChange="pageChange"
          @pageSize="pageSize"
          @sortChange="sortChange"
        />
      </div>
    </div>

    <!-- 新增用户弹框 -->
    <ComFormDialog
      ref="printForm"
      :title="'新增模板'"
      :dialogShow="dialogShow"
      :formData="formData"
      :formRules="formRules"
      :modal-append-to-body="false"
      :formController="formController"
      @dialogBtnClick="dialogBtnClick"
    />

    <!-- 编辑模板 -->
    <el-dialog
      class="newAddDialog"
      :visible.sync="dialogShow2"
      custom-class="oneStyle"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      :modal="false"
    >
      <span slot="title" class="dialog-footer">
        <span>配置打印模板</span>
      </span>
      <el-container>
        <span class="content_head">{{ editForm.ProjectName }}</span>
        <div class="hr-line-dashed" />
        <el-main>
          <div class="content_main_head flex_row_end">
            <template v-if="flag == 0">
              <span>模板名称：</span>
              <el-input
                type="text"
                style="width: 160px; margin: 0 10px"
                v-model="editForm.TemplateName"
                placeholder="输入具体模板名称"
                size="small"
              ></el-input>
            </template>
            <template v-if="flag == 1">
              <span>模板：</span>
              <el-select
                style="width: 160px; margin: 0 10px"
                v-model="editForm.TemplateName"
                placeholder="请选择具体模板名称"
                size="small"
                value-key="TemplateID"
                @change="changeTemplateCode"
              >
                <el-option
                  :label="item.TemplateName"
                  :value="item"
                  v-for="item in options"
                  :key="item.TemplateID"
                ></el-option>
              </el-select>
            </template>
            <!-- <template v-if="flag == 0">
              <span>对象字典：</span>
              <el-input
                v-model="ObjectID"
                type="number"
                style="width:160px;margin:0 10px"
                placeholder="对象字典"
                @change="getFieledsData"
                size="small"
              ></el-input>
            </template> -->
            <lodopdemo
              class="margin_auto_0"
              :template="editForm"
              :design="{ name: '编辑模板', style: {} }"
              :print="{ name: '打印', style: {} }"
              :setup="{ name: '打印维护', style: {} }"
              :code="{ name: '生成代码', style: {} }"
              @ProgramCodesChanged="ProgramCodesChanged"
            />
          </div>
          <div class="flex0 fill_width">
            <div class="width_50">
              <el-button plain type="primary" size="mini" @click="addTableRow"
                >添加一行</el-button
              >
              <ComVxeTable
                ref="printTable"
                :rowKey="'RowNumber'"
                :height="'180px'"
                :tableData="tableData[1]"
                :tableHeader="tableColumns[1]"
                :tableLoading="tableLoading[1]"
                :remark="1"
                :sysID="sysID[1].ID"
                :isEdit="true"
                :isClear="isClear[1]"
                @delRow="delRow"
                :showPagination="false"
                @keyupEnter="searchFields"
              />
              <ComVxeTable
                ref="printTable"
                :rowKey="'RowNumber'"
                :height="tableHeight3"
                :tableData="tableData[2]"
                :tableHeader="tableColumns[2]"
                :tableLoading="tableLoading[2]"
                :remark="2"
                :sysID="sysID[2].ID"
                :isEdit="true"
                @delRow2="delRow2"
                :isClear="isClear[2]"
                :showPagination="false"
              />
            </div>
            <div class="width_50">
              <el-input
                type="textarea"
                placeholder="程序代码"
                :style="{ height: tableHeight2, margin: '27px 0 0 10px' }"
                v-model="editForm.ProgramCodes"
              >
              </el-input>
            </div>
          </div>
        </el-main>
        <el-footer class="footer">
          <el-button size="small" @click="dialogShow2 = false">取消</el-button>
          <el-button size="small" type="primary" @click="submitData"
            >保存</el-button
          >
        </el-footer>
      </el-container>
    </el-dialog>
  </div>
</template>

<script>
var _this;
import ComSearch from "@/components/ComSearch";
import ComVxeTable from "@/components/ComVxeTable";
import lodopdemo from "@/components/Lodop/index";
import ComFormDialog from "@/components/ComFormDialog";
import { GetHeader, GetSearchData, ExportData, SaveData } from "@/api/Common";
export default {
  name: "PrintInfo",
  components: {
    ComSearch,
    ComVxeTable,
    ComFormDialog,
    lodopdemo,
  },
  data() {
    return {
      sysID: [{ ID: 7855 }, { ID: 7858 }, { ID: 7857 }],
      adminLoading: false,
      flag: 0,
      ObjectID: null,
      editForm: {
        ProjectID: "",
        ProjectCode: "",
        ProgramCodes: "",
        ProjectName: "",
        DefaultTemplateID: "",
        Remark: "",
        dicID: 7856,
        Status: 1,
        Enable: 1,
        PageTop: 2,
        PageLeft: 0,
        Width: "200mm",
        Height: "200mm",
      },
      ////////////////// Search /////////////////
      title: this.$route.meta.title,
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
        {
          datas: {},
          forms: [],
        },
      ],
      printForm: [
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
      tableData: [[], [], []],
      tableColumns: [[], [{ label: "参数", prop: "ParameterName" }], []],
      tableLoading: [false, false, false],
      isClear: [false, false, false],
      tablePagination: [
        { pageIndex: 1, pageSize: 50, pageTotal: 0 },
        { pageIndex: 1, pageSize: 0, pageTotal: 0 },
        { pageIndex: 1, pageSize: 0, pageTotal: 0 },
      ],
      height: "707px",
      showPagination: true,
      tagRemark: 0,
      isLoading: false,
      //////////////新增弹框//////////////
      dialogShow: false,
      dialogShow2: false,
      formData: {
        Name: "",
        PrinterType: 0,
        PageSize: 1,
        Status: 1,
        dicID: 7855,
      },
      formController: [
        { label: "模板编码", prop: "ProjectCode", type: "input" },
        { label: "模板名称", prop: "ProjectName", type: "input" },
        {
          label: "备注",
          prop: "Remark",
          type: "input",
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
        Name: [
          { required: true, message: "模板名称为必填项", trigger: "blur" },
        ],
      },
      tableHeight2: document.documentElement.clientHeight - 365 + "px",
      tableHeight3: document.documentElement.clientHeight - 580 + "px",
      options: [],
      temporaryData: [[], []],
    };
  },
  watch: {},
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
          _this.$set(_this.printForm[index], "isLoading", true);
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
      let IDs = this.sysID;
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
        let obj = {
          label: "操作",
          width: "80",
          prop: "Operation",
          button: [
            { name: "添加", methods: "addRow", type: "primary" },
            { name: "编辑", methods: "editRow", type: "warning" },
          ],
        };
        let obj2 = {
          label: "操作",
          width: "80",
          prop: "Operation",
          button: [{ name: "删除", methods: "delRow", type: "primary" }],
        };
        let obj3 = {
          label: "操作",
          width: "80",
          prop: "Operation",
          button: [{ name: "删除", methods: "delRow2", type: "primary" }],
        };
        this.tableColumns[0].push(obj);
        this.tableColumns[1].push(obj2);
        this.tableColumns[2].push(obj3);
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
    // 获取模板数据
    async getTemplateData() {
      // 获取对应的模板下拉数据
      let form = {};
      this.options = [];
      form["dicID"] = 7856;
      form["ProjectID"] = this.editForm.ProjectID;
      let res = await GetSearchData(form);
      const { result, data, count, msg } = res.data;
      if (result) {
        this.options = data;
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
          _this.$refs.printForm.$refs.formData.resetFields();
        } else {
          this.$message({
            message: msg,
            type: "error",
            dangerouslyUseHTMLString: true,
          });
          _this.$refs.printForm.$refs.formData.resetFields();
        }
        this.dialogShow = false;
      } else {
        _this.$refs.printForm.$refs.formData.resetFields();
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
    // 添加模板
    addRow(row) {
      for (var name in row) {
        this.editForm[name] = row[name];
      }
      this.dialogShow2 = true;
      this.flag = 0;
    },
    // 编辑
    editRow(row) {
      this.flag = 1;
      this.adminLoading = true;
      for (var name in row) {
        this.$set(this.editForm, name, row[name]);
      }
      this.editForm.ProgramCodes = "";
      this.editForm.TemplateID = "";
      this.editForm.TemplateName = "";
      this.$set(this.tableData, 1, []);
      this.$set(this.tableData, 2, []);
      this.$set(this.temporaryData, 0, []);
      this.$set(this.temporaryData, 1, []);
      this.getTemplateData();
      this.dialogShow2 = true;
    },
    // 保存编辑的模板
    async submitData() {
      if (
        this.tableData[1].length == 0 ||
        this.tableData[2].length == 0 ||
        !this.editForm.ProgramCodes ||
        !this.editForm.TemplateName
      ) {
        this.$message.error("模板名称、程序代码、实体标识必填！");
        return;
      }
      let submitData = [];
      if (this.flag == 0) {
        // 第一层主表的 -具体模板
        let childrens = this.tableData[1];
        childrens = childrens.concat(this.tableData[2]);
        this.$set(this.editForm, "childrens", childrens);
        this.$set(this.editForm, "dicID", 7856);
        submitData.push(this.editForm);
      } else {
        //1 第一层
        let childrens = [];
        this.tableData[1].forEach((a) => {
          if (a.IsAdd) {
            let obj1 = JSON.parse(JSON.stringify(a));
            childrens.push(a);
          }
        });
        // 删除
        let newData1 = this.temporaryData[0].filter(
          (x) => !this.tableData[1].some((y) => y.ID == x.ID)
        );
        if (newData1.length != 0) {
          newData1.forEach((b) => {
            b["ElementDeleteFlag"] = 1;
            childrens.push(b);
          });
        }
        this.tableData[1].forEach((c) => {
          // if (c.IsAdd && c.Identification) {
          let obj1 = JSON.parse(JSON.stringify(c));
          childrens.push(c);
          // }
        });
        // 删除
        let newData2 = this.temporaryData[1].filter(
          (x) => !this.tableData[2].some((y) => y.ID == x.ID)
        );
        if (newData2.length != 0) {
          newData2.forEach((d) => {
            d["ElementDeleteFlag"] = 1;
            childrens.push(d);
          });
        }
        this.tableData[2].forEach((e) => {
          // if (e.IsAdd && e.Identification) {
          let obj1 = JSON.parse(JSON.stringify(e));
          obj1["ID"] = "";
          childrens.push(e);
          // }
        });
        this.$set(this.editForm, "childrens", childrens);
        this.$set(this.editForm, "dicID", 7856);
        this.editForm.TemplateName = this.editForm.TemplateName.TemplateName;
        submitData.push(this.editForm);
      }
      let res = null;
      console.log(submitData);
      this.adminLoading = true;
      res = await SaveData(submitData);
      const { datas, forms, result, msg } = res.data;
      if (result) {
        this.adminLoading = false;
        this.dialogShow = false;
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
    // 设置为默认
    defaultData() {},
    //生成代码
    ProgramCodesChanged(val) {
      _this.editForm.ProgramCodes = val;
    },
    //变更下拉选项
    changeTemplateCode() {
      this.editForm.TemplateID = this.editForm.TemplateName.TemplateID;
      this.editForm.ProgramCodes = JSON.parse(
        JSON.stringify(this.editForm.TemplateName.ProgramCodes)
      );
      // 获取对象跟关联的实体数据
      this.getPrintTemplates(parseInt(this.editForm.TemplateID));
      this.getPrintTemplates2(parseInt(this.editForm.TemplateID));
    },
    //获取打印模板
    async getPrintTemplates(ID) {
      this.$set(this.temporaryData, 1, []);
      let res = await GetSearchData({ TemplateID: ID, dicID: 7857 });
      const { result, data, count, msg } = res.data;
      if (result) {
        this.$set(this.tableData, 2, data);
        this.$set(this.temporaryData, 1, JSON.parse(JSON.stringify(data)));
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
      // const { Result, code } = await GetPrintTemplates({
      //   IsAll: true,
      //   ID,
      // });
      // if (code == 20000) {
      //   this.editForm = Result.Form.Data;
      //   this.PrintTemplateEntitys = Result.Form.Detail.PrintTemplateEntitys;
      //   this.PrintTemplateDatas = Result.Form.Detail.PrintTemplateDatas;
      // }
    },
    async getPrintTemplates2(ID) {
      this.$set(this.temporaryData, 0, []);
      let res = await GetSearchData({ TemplateID: ID, dicID: 7858 });
      const { result, data, count, msg } = res.data;
      if (result) {
        this.$set(this.tableData, 1, data);
        this.$set(this.temporaryData, 0, JSON.parse(JSON.stringify(data)));
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
    },
    // 获取字典的所有对象
    async searchFields(row, value, prop, index) {
      let form = {};
      form["rows"] = 0;
      form["dicID"] = 35;
      form["DictionaryID"] = parseInt(value);
      if (!value) {
        let newData = this.tableData[2].filter((o) => {
          return o.DictionaryID != parseInt(value);
        });
        this.$set(this.tableData, 2, newData);
        return;
      }
      let newData = [];
      let res = await GetSearchData(form);
      const { result, data, count, msg } = res.data;
      if (result) {
        if (data.length != 0) {
          data.forEach((x) => {
            let newIndex = -1;
            newIndex = this.tableData[2].findIndex(
              (o) => o.ParameterName == x.ParameterName
            );
            if (newIndex == -1) {
              newData.push({
                Identification: x.ParameterName,
                Instance: x.ParameterName,
                DictionaryID: x.DictionaryID,
                dicID: 7857,
                IsAdd: true,
              });
            } else {
              let num = this.tableData[1].length;
              newData.push({
                Identification: x.ParameterName + num,
                Instance: x.ParameterName + num,
                DictionaryID: x.DictionaryID,
                dicID: 7857,
                IsAdd: true,
              });
            }
          });
        }
        this.$set(this.tableData, 2, newData);
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
    },
    // 获取字典的所有对象
    // async getFieledsData(val) {
    //   let form = {};
    //   form["rows"] = 0;
    //   form["dicID"] = 35;
    //   form["DictionaryID"] = val;
    //   if (!val) {
    //     return;
    //   }
    //   this.tableData[1] = [];
    //   let newData = [];
    //   let res = await GetSearchData(form);
    //   const { result, data, count, msg } = res.data;
    //   if (result) {
    //     if (data.length != 0) {
    //       data.forEach((x) => {
    //         newData.push({
    //           Identification: x.ParameterName,
    //           Instance: x.ParameterName,
    //           dicID: 7857,
    //           TemplateID: "",
    //         });
    //       });
    //     }
    //     this.$set(this.tableData, 2, newData);
    //   } else {
    //     this.$message({
    //       message: msg,
    //       type: "error",
    //       dangerouslyUseHTMLString: true,
    //     });
    //   }
    // },
    // 给实体添加一行
    addTableRow() {
      this.tableData[1].push({
        dicID: 7858,
        update: true,
        IsAdd: true,
      });
    },
    // 删除行
    delRow(row, val, prop, index) {
      debugger;
      this.tableData[1].splice(index, 1);
    },
    // 删除行
    delRow2(row, val, prop, index) {
      this.tableData[2].splice(index, 1);
    },
  },
};
</script>
