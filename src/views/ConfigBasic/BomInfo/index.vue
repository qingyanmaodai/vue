<!--BOM清单-->
<template>
  <div class="container flex_flex" v-loading="adminLoading">
    <div class="admin_left el-pagination-tree">
      <ComAsideTree
        ref="asideRef"
        :treeData="tableData[0]"
        :title="title"
        :treeHeight="treeHeight"
        :nodekey="'MaterialBomID'"
        :treeProps="treeProps"
        :pagination="tablePagination[0]"
        :remark="0"
        :showPagination="true"
        @searchTree="searchTree"
        @searchTreeEnter="searchTreeEnter"
        @handleNodeClick="handleNodeClick"
        @pageChange="pageChange"
        @pageSize="pageSize"
        :pagerCount="5"
        :expand="false"
        expandOnClickNode
        classNameInput="searchInput"
        placeholder="按回车键查询"
        :loading="tableLoading[0]"
      />
    </div>
    <div class="admin_container_right">
      <div class="admin_head_3" ref="headRef">
        <div style="text-align: right;;">
          <el-button
            plain
            v-for="(item, i) in parmsBtn2"
            :key="i"
            :type="item.Type ? item.Type : 'primary'"
            :icon="item.Icon"
            size="small"
            @click="btnClick(item.Methods, item.Params, i, 0)"
            v-show="
              Array.prototype.isPrototypeOf(item.signName) &&
              item.signName.includes(signName)
                ? true
                : item.signName || item.signName == 0
                ? item.signName == signName
                : true
            "
          >
            {{ item.BtnName }}
          </el-button>
        </div>
        <ComForm
          class="formStyle"
          ref="ruleForm0"
          :formData="formData"
          :formController="formControllerParent"
          :formRules="formRules"
        ></ComForm>
      </div>
      <div class="admin_head_4">
        <ComSearch
          ref="searchRef"
          :searchData="formSearchs[1].datas"
          :searchForm="formSearchs[1].forms"
          :remark="1"
          :btnForm="btnForm"
          @btnClick="btnClick"
        />
        <div class="admin_content">
          <div class="ant-table-title">
            <el-row>
              <el-col :span="4"
                ><span class="title">{{ title }}</span></el-col
              >
              <el-col :span="20" class="flex_flex_end">
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
            ref="ComUmyTable"
            :rowKey="'RowNumber'"
            :height="height"
            :tableData="tableData[1]"
            :tableHeader="tableColumns[1]"
            :tableLoading="tableLoading[1]"
            :remark="1"
            :sysID="sysID[1].ID"
            :hasSelect="true"
            :isEdit="isEdit"
            :isClear="isClear[1]"
            :pagination="tablePagination[1]"
            @pageChange="pageChange"
            @pageSize="pageSize"
            @selectfun="selectFun"
            @sortChange="sortChange"
            :keepSource="true"
            :showPagination="false"
          />
        </div>
      </div>
    </div>

    <!-- 新增父件弹框 -->
    <ComFormDialog
      ref="refParent"
      :title="addParentTitle"
      :dialogShow="dialogShowParent"
      :formData="formDataParent"
      :formRules="formRulesParent"
      :formController="formController"
      @dialogBtnClick="parentConfirm"
    />
    <!-- 新增子件弹框 -->
    <ComFormDialog
      ref="refChild"
      :title="addChildTitle"
      :dialogShow="dialogShowChild"
      :formData="formDataChild"
      :formRules="formRulesChild"
      :formController="formControllerChild"
      @dialogBtnClick="childConfirm"
    />
  </div>
</template>

<script>
var _this;
import XLSX from "xlsx";
import ComSearch from "@/components/ComSearch";
import ComAsideTree from "@/components/ComAsideTree";
import ComUmyTable from "@/components/ComUmyTable";
import {
  GetHeader,
  GetSearchData,
  ExportData,
  SaveData,
  GetOrgData,
  GetSearch
} from "@/api/Common";
import ComFormDialog from "@/components/ComFormDialog";
import ComForm from "@/components/ComForm";
export default {
  name: "BomInfo",
  components: {
    ComSearch,
    ComAsideTree,
    ComUmyTable,
    ComFormDialog,
    ComForm
  },
  data() {
    return {
      //////////////左侧树节点//////////////

      ChildTitle: "子件信息",
      treeProps: {
        label: "label",
        children: "children"
      },
      keyWords: "",
      ///////////////新增弹框//////////////
      addParentTitle: "新增父件",
      addChildTitle: "新增子件",
      updateTitle: "批量修改",
      dialogShowParent: false,
      dialogShowChild: false,
      dialogShow2: false,
      formDataParent: {
        // BOMMasterID:0,
        ParentID: 0,
        Denominator: null,
        ParentUnit: null,
        ItemClass: null,
        LineNum: null,
        Remark1: null,
        Status: 0,
        ParentCode: null,
        ParentMaterialName: null,
        Code: null,
        MaterialName: null,
        Unit: null,
        Scrappage: 0,
        Molecule: null
      },
      formData: {
        ParentID: 0,
        Denominator: null,
        ParentUnit: null,
        ItemClass: null,
        LineNum: null,
        Remark1: null,
        Status: 0,
        ParentCode: null,
        ParentMaterialName: null,
        Code: null,
        MaterialName: null,
        Unit: null,
        Scrappage: 0,
        Molecule: null
      },
      formDataChild: {
        Code: null,
        MaterialName: null,
        Molecule: null,
        Unit: null,
        Scrappage: null,
        Remark1: null,
        Status: 0,
        ParentCode: null
      },
      UserTypes: [],
      PositionIDs: [],
      treeData: [],
      treeListTmp: [],
      formData2: {
        Status: 0
      },
      formController2: [
        {
          label: "状态",
          prop: "Status",
          type: "radioGroupLabel",
          radioGroups: [
            { label: "禁用", value: 0 },
            { label: "启用", value: 1 }
          ]
        }
      ],
      formControllerParent: [
        { label: "父件物料号", prop: "Code", type: "input", colSpan: 8 },
        {
          label: "父件描述",
          prop: "MaterialName",
          type: "textarea",
          colSpan: 12
        },
        {
          label: "数量",
          prop: "Molecule",
          type: "input",
          inputType: "number",
          colSpan: 4
        },
        { label: "单位", prop: "Unit", type: "input", colSpan: 4 },
        { label: "项目类别", prop: "ItemClass", type: "input", colSpan: 4 },
        {
          label: "项目",
          prop: "LineNum",
          type: "input",
          inputType: "number",
          colSpan: 4
        },
        {
          label: "状态",
          prop: "Status",
          type: "radioGroupLabel",
          radioGroups: [
            { label: "启用", value: 1 },
            { label: "禁用", value: 0 }
          ],
          colSpan: 6
        }
      ],
      formRulesParent: {
        Code: [{ required: true, message: "必填项", trigger: "blur" }],
        MaterialName: [{ required: true, message: "必填项", trigger: "blur" }],
        Molecule: [{ required: true, message: "必填项", trigger: "blur" }],
        Unit: [{ required: true, message: "必填项", trigger: "blur" }]
      },
      formController: [
        { label: "父件物料号", prop: "Code", type: "input" },
        { label: "父件描述", prop: "MaterialName", type: "textarea" },
        {
          label: "数量",
          prop: "Molecule",
          type: "input",
          inputType: "number"
        },
        { label: "单位", prop: "Unit", type: "input" },
        { label: "项目类别", prop: "ItemClass", type: "input" },
        { label: "项目", prop: "LineNum", type: "input", inputType: "number" },
        {
          label: "状态",
          prop: "Status",
          type: "radioGroupLabel",
          radioGroups: [
            { label: "启用", value: 1 },
            { label: "禁用", value: 0 }
          ]
        }
      ],
      formRules: {
        Code: [{ required: true, message: "必填项", trigger: "blur" }],
        MaterialName: [{ required: true, message: "必填项", trigger: "blur" }],
        Molecule: [{ required: true, message: "必填项", trigger: "blur" }],
        Unit: [{ required: true, message: "必填项", trigger: "blur" }]
      },
      formControllerChild: [
        {
          label: "父件物料号",
          prop: "ParentCode",
          type: "input",
          disabled: true
        },
        { label: "子件物料号", prop: "Code", type: "input" },
        { label: "子件描述", prop: "MaterialName", type: "textarea" },
        {
          label: "数量",
          prop: "Molecule",
          type: "input",
          inputType: "number"
        },
        { label: "单位", prop: "Unit", type: "input" },
        { label: "报废率", prop: "Scrappage", type: "input" },
        // { label: "备注", prop: "Remark1", type: "textarea" },
        {
          label: "状态",
          prop: "Status",
          type: "radioGroupLabel",
          radioGroups: [
            { label: "启用", value: 1 },
            { label: "禁用", value: 0 }
          ]
        }
      ],
      formRulesChild: {
        MaterialName: [{ required: true, message: "必填项", trigger: "blur" }],
        Molecule: [{ required: true, message: "必填项", trigger: "blur" }],
        Unit: [{ required: true, message: "必填项", trigger: "blur" }],
        Scrappage: [{ required: true, message: "必填项", trigger: "blur" }]
      },
      ////////////////// Search /////////////////
      title: this.$route.meta.title,
      drawer: false,
      delData: [[], []],
      formSearchs: [
        {
          datas: {},
          forms: [],
          required: [] //获取必填项
        },
        {
          datas: {},
          forms: [],
          required: [] //获取必填项
        }
      ],
      parmsBtn: [
        {
          ButtonCode: "addChildBom",
          BtnName: "",
          Type: "primary",
          Ghost: true,
          Size: "small",
          Methods: "addChildBom",
          Icon: "",
          sort: 2
        },
        {
          ButtonCode: "save",
          BtnName: "保存",
          Type: "success",
          Ghost: true,
          Size: "small",
          Methods: "dataSave",
          Icon: "",
          sort: 3,
          Params: { dataName: "saveData" }
        },
        {
          ButtonCode: "delete",
          BtnName: "删除",
          Type: "danger",
          Ghost: true,
          Size: "small",
          Methods: "dataDel",
          Params: { dataName: "selectionData" },
          Icon: "",
          sort: 4
        },
        {
          ButtonCode: "update",
          BtnName: "锁定",
          Type: "warning",
          Ghost: true,
          Size: "small",
          Methods: "lockSave",
          Icon: "",
          sort: 5,
          Params: {}
        }
      ],
      parmsBtn2: [
        {
          ButtonCode: "addParentBom",
          BtnName: "",
          Type: "primary",
          Ghost: true,
          Size: "small",
          Methods: "addParentBom",
          Icon: "",
          sort: 1
        },
        {
          ButtonCode: "save",
          BtnName: "保存",
          Type: "success",
          Ghost: true,
          Size: "small",
          Methods: "dataSave",
          Icon: "",
          sort: 2,
          Params: { dataName: "saveData" }
        },
        {
          ButtonCode: "delete",
          BtnName: "删除",
          Type: "danger",
          Ghost: true,
          Size: "small",
          Methods: "dataDel",
          Params: {},
          Icon: "",
          sort: 3
        }
      ],
      saveData: [[], []],
      selectionData: [[], []],
      btnForm: [],
      tableData: [[], []],
      tableColumns: [[], []],
      tableLoading: [false, false],
      isClear: [false, false],
      tablePagination: [
        { pageIndex: 1, pageSize: 50, pageTotal: 0 },
        { pageIndex: 1, pageSize: 0, pageTotal: 0 }
      ],
      height: "707px",
      treeHeight: "765px",
      showPagination: true,
      tagRemark: 0,
      isEdit: false,
      clickData: {},
      isUpdate: true,
      adminLoading: false,
      dialogImport: false,
      fileList: [],
      file: [],
      sysID: [{ ID: 1185 }, { ID: 1185 }],
      addNum: 1, //新增行数
      childAddEdit: false, //新增状态
      DataSourceList: {}, //数据源
      DataSourceIds: [], //数据源ID
      keyWords: ""
    };
  },
  computed: {},
  created() {
    _this = this;
    this.judgeBtn();
    this.getTableHeader();
  },
  mounted() {
    setTimeout(() => {
      this.setHeight();
    }, 500);
  },
  methods: {
    //输入框改变查询的值
    async searchTree(msg) {
      this.keyWords = msg;
    },
    // 回车获取值
    searchTreeEnter(msg) {
      // 树结构查询接口,需要传入BOM编码
      // this.getBomTree(0,msg)
      this.dataSearch(0);
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
    // 判断按钮权限
    judgeBtn() {
      let routeBtn = this.$route.meta.btns;
      let newBtn = [];
      let newBtn2 = [];
      let permission = false;
      if (routeBtn.length != 0) {
        routeBtn.forEach(x => {
          if (x.ButtonCode == "edit") {
            permission = true;
          }
          let newData = this.parmsBtn.filter(y => {
            // 如果页面定义了取页面的，否则取按钮权限配置中的
            if (x.ButtonCode == y.ButtonCode) {
              y.BtnName = y.BtnName || x.ButtonName;
              y.Methods = y.Methods || x.OnClick;
              y.Type = y.Type || x.ButtonType;
              return y;
            }
          });
          if (newData.length != 0) {
            newBtn = newBtn.concat(newData);
          }

          let newData2 = this.parmsBtn2.filter(y => {
            // 如果页面定义了取页面的，否则取按钮权限配置中的
            if (x.ButtonCode == y.ButtonCode) {
              y.BtnName = y.BtnName || x.ButtonName;
              y.Methods = y.Methods || x.OnClick;
              y.Type = y.Type || x.ButtonType;
              return y;
            }
          });
          if (newData2.length != 0) {
            newBtn2 = newBtn2.concat(newData2);
          }
        });
      }
      newBtn = _.sortBy(newBtn, ["sort"]);
      newBtn2 = _.sortBy(newBtn2, ["sort"]);
      this.$set(this, "btnForm", newBtn);
      this.$set(this, "isEdit", permission);
      this.$set(this, "parmsBtn2", newBtn2);
    },
    // 高度控制
    setHeight() {
      this.treeHeight = document.documentElement.clientHeight - 250 + "px";
      let headHeight = this.$refs.headRef.offsetHeight;
      let rem =
        document.documentElement.clientHeight -
        headHeight -
        this.$store.getters.reduceHeight;
      let newHeight = rem - 40 + "px";
      this.$set(this, "height", newHeight);
    },
    // 编辑行
    editRow(row) {},
    // 删除行
    delRow(row) {},
    // 第几页
    pageChange(val, remarkTb, filtertb) {
      this.$set(this.tablePagination[remarkTb], "pageIndex", val);
      // this.getBomTree(remarkTb,this.keyWords)
      this.getTableData(this.formSearchs[remarkTb].datas, remarkTb);
    },
    // 页数
    pageSize(val, remarkTb, filtertb) {
      this.$set(this.tablePagination[remarkTb], "pageSize", val);
      // this.getBomTree(remarkTb,this.keyWords)
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
          if (this.formSearchs[remarkTb].forms.length) {
            // 判断是否是页面显示的查询条件，是的字段才清空
            this.formSearchs[remarkTb].forms.forEach(element => {
              if (element.prop === name) {
                this.formSearchs[remarkTb].datas[name] = null;
              }
            });
          }
        }
      }
    },
    // 删除
    async dataDel(remarkTb, index, parms) {
      let res = null;
      let newData = [];
      if (parms && parms.dataName) {
        if (this[parms.dataName][remarkTb].length == 0) {
          this.$message.error("请选择需要操作的数据！");
          return;
        } else {
          this[parms.dataName][remarkTb].forEach(x => {
            let obj = x;
            obj["ElementDeleteFlag"] = 1;
            obj["dicID"] = this.sysID[remarkTb].ID;
            newData.push(obj);
          });
        }
      } else if (remarkTb == 0) {
        //删除父级
        if (this.formData && !this.formData.MaterialID) {
          return;
        }
        let obj = this.formData;
        obj["ElementDeleteFlag"] = 1;
        obj["dicID"] = this.sysID[remarkTb].ID;
        newData = [obj];
      }
      this.$confirm("确定要删除的【" + newData.length + "】数据吗？")
        .then(_ => {
          _this.generalSaveData(newData, remarkTb, index);
        })
        .catch(_ => {});
    },
    // 通用直接保存
    async generalSaveData(newData, remarkTb, index) {
      this.adminLoading = true;
      let res = await SaveData(newData);
      const { result, data, count, msg } = res.data;
      if (result) {
        this.dataSearch(0);
        // this.getBomTree(0,this.keyWords)
        this.dataSearch(remarkTb);
        this.adminLoading = false;
        this.$message({
          message: msg,
          type: "success",
          dangerouslyUseHTMLString: true
        });
      } else {
        this.adminLoading = false;
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true
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
          m.forEach(n => {
            // 进行验证
            this.verifyData(n);
            if (n.childrens && n.children.length != 0) {
              n.childrens.forEach(x => {
                this.verifyData(x);
              });
            }
            //获取下拉数据源
            if (n.DataSourceID && n.ControlType === "combobox") {
              this.DataSourceList = {
                [n.DataSourceName]: [],
                ...this.DataSourceList
              };
              if (!this.DataSourceIds.includes(n.DataSourceID)) {
                this.DataSourceIds.push(n.DataSourceID);
              }
            }
            if (n.Required) {
              this.formSearchs[i].required.push(n);
            }
          });
          this.$set(this.tableColumns, i, m);
        });
        // 获取查询的初始化字段 组件 按钮
        forms.some((x, z) => {
          this.$set(this.formSearchs[z].datas, "dicID", IDs[z].ID);
          x.forEach(y => {
            if (y.prop && y.value) {
              this.$set(this.formSearchs[z].datas, [y.prop], y.value);
            } else {
              this.$set(this.formSearchs[z].datas, [y.prop], "");
            }
          });
          this.$set(this.formSearchs[z], "forms", x);
        });
        // 获取左侧树结构
        // this.getBomTree(0)
        this.getTableData(this.formSearchs[0].datas, 0);
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
    //递归
    handleTree(data) {
      return data.filter((item, index) => {
        let name = "";
        if (item.MaterialName && item.MaterialName.length > 12) {
          name = item.MaterialName.slice(0, 12) + "...";
        }

        item.label = `${name}[${item.Code || "空"}]`;
        if (item.children && item.children.length > 0) {
          item.children = this.handleTree(item.children);
        }
        return true;
      });
    },
    // 获取表格数据
    async getTableData(form, remarkTb) {
      this.$set(this.tableLoading, remarkTb, true);
      form["rows"] = this.tablePagination[remarkTb].pageSize;
      form["page"] = this.tablePagination[remarkTb].pageIndex;
      let res = "";
      if (remarkTb === 0) {
        //左侧树结构
        form["Code"] = this.keyWords;
        res = await GetSearch(form, "/APSAPI/GetBomData");
        res.data.data = this.handleTree(res.data.data);
      } else {
        //右边表格
        res = await GetSearchData(form);
      }
      const { result, data, count, msg } = res.data;
      if (result) {
        this.$set(this.tableData, remarkTb, data);
        this.$set(this.tablePagination[remarkTb], "pageTotal", count);
        this.$set(this.tableLoading, remarkTb, false);
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true
        });
      }
      this.$set(this.tableLoading, remarkTb, false);
    },
    // 单击节点查看父件和子件
    handleNodeClick(data, node) {
      let self = this;
      self.resetForm("ruleForm0");
      self.formData = _.cloneDeep(data); //这需要克隆，resetForm重置会影响
      // if(!this.formData.ParentID){

      // }
      // 通过父级ID查询下级子件
      self.formSearchs[1].datas["ParentID"] = "";
      self.formSearchs[1].datas["MaterialID"] = "";
      self.formSearchs[1].datas["MasterCode"] = "";
      if (data && data.children.length) {
        if (data.ParentID === 0) {
          self.formSearchs[1].datas["ParentID"] = data && data.BOMMasterID;
        } else {
          self.formSearchs[1].datas["MasterCode"] =
            data && data.children[0].MasterCode;
          self.formSearchs[1].datas["ParentID"] =
            data && data.children[0].ParentID;
        }
      } else {
        self.formSearchs[1].datas["MasterCode"] = data && data.MasterCode;
        self.formSearchs[1].datas["ParentID"] = data && data.ParentID;
        self.formSearchs[1].datas["MaterialID"] =
          data && data.MaterialID ? data.MaterialID : data.BOMMasterID;
      }
      self.dataSearch(1);
    },
    // 刷新页面
    refrshPage() {
      this.$store.dispatch("tagsView/delCachedView", this.$route).then(() => {
        const { fullPath } = this.$route;
        this.$nextTick(() => {
          this.$router.replace({
            path: "/redirect" + fullPath
          });
        });
      });
    },
    // 选择数据
    selectFun(data, remarkTb, row) {
      this.selectionData[remarkTb] = data;
    },
    // 重置校验
    resetForm(formName) {
      this.$refs[formName].$refs["formData"].resetFields();
    },
    // 新增父件
    addParentBom() {
      this.dialogShowParent = true;
      this.formDataParent["dicID"] = this.sysID[this.tagRemark].ID;
      this.$nextTick(() => {
        this.resetForm("refParent");
      });
    },
    // 父件确认添加
    parentConfirm(val) {
      if (val) {
        this.$refs["refParent"].$refs["formData"].validate(valid => {
          if (valid) {
            //因为后端用这些字段保存才能更新Code,因此要同步改
            this.formDataParent.ParentCode = this.formDataParent.Code;
            this.formDataParent.ParentMaterialName = this.formDataParent.MaterialName;
            this.formDataParent.ParentUnit = this.formDataParent.Unit;
            this.formDataParent.Denominator = this.formDataParent.Molecule;

            this.addDataSave([this.formDataParent], 0);
            this.dialogShowParent = false;
          }
        });
      } else {
        this.dialogShowParent = false;
      }
    },
    // 新增子件
    addChildBom() {
      // 对接好添加这个判断
      let self = this;

      if (!self.formData.MaterialBomID) {
        self.$message.error("未选择关联到父件，请检查！");
        return;
      }
      self.dialogShowChild = true;
      this.$nextTick(() => {
        self.resetForm("refChild");
        if (self.formData && self.formData.MaterialBomID) {
          self.formDataChild["dicID"] = self.sysID[self.tagRemark].ID;
          self.formDataChild["ParentCode"] = self.formData["Code"];
          self.formDataChild["BOMMasterID"] = self.formData["MaterialID"]; //父件ID
          self.formDataChild["ParentID"] = self.formData["MaterialID"]; //父件主键
        }
      });
    },
    // 子件确认添加
    childConfirm(val) {
      if (val) {
        this.$refs["refChild"].$refs["formData"].validate(valid => {
          if (valid) {
            this.addDataSave([this.formDataChild], 1);
            this.dialogShowChild = false;
          }
        });
      } else {
        this.dialogShowChild = false;
      }
    },

    // 批量锁定/取消锁定弹框
    openDrawer(remarkTb, index, params) {
      if (!this.selectionData[remarkTb].length) {
        this.$message.error("请选择需要操作的数据！");
        return;
      }
      this.dialogShow2 = true;
    },
    // 确认批量锁定/取消锁定
    dialogBtnClick2(val) {
      if (val) {
        let newData = [];
        this.selectionData[this.tagRemark].forEach(item => {
          item.Status = 0;
          newData.push(item);
        });
        this.addDataSave(newData, 1, "update");
        this.dialogShow2 = false;
      } else {
        this.dialogShow2 = false;
      }
    },
    lockSave(remarkTb) {
      if (!this.selectionData[remarkTb].length) {
        this.$message.error("请选择需要操作的数据！");
        return;
      }
      let newData = [];
      this.selectionData[remarkTb].forEach(item => {
        let obj = _.cloneDeep(item);
        obj.Status = 0;
        newData.push(obj);
      });
      this.$confirm("确定要锁定的【" + newData.length + "】数据吗？")
        .then(() => {
          this.addDataSave(newData, 1, "update");
        })
        .catch(_ => {});
    },
    // 新增保存
    async addDataSave(newData, remarkTb, status) {
      this.adminLoading = true;
      let res = await SaveData(newData);
      const { result, data, count, msg } = res.data;
      if (result) {
        if (status != "update") {
          this.dataSearch(0);
          // this.getBomTree(0,this.keyWords)
        }
        if (remarkTb == 1) {
          this.dataSearch(1);
        }
        this.adminLoading = false;
        this.$message({
          message: msg,
          type: "success",
          dangerouslyUseHTMLString: true
        });
      } else {
        this.adminLoading = false;
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true
        });
      }
    },
    // 直接保存
    async dataSave(remarkTb, index, params) {
      let submitData = [];
      let isPass = true;
      if (remarkTb == 0) {
        this.$refs["ruleForm0"].$refs["formData"].validate(valid => {
          if (valid) {
            //因为后端用这些字段保存才能更新Code,因此要同步改
            this.formData.ParentCode = this.formData.Code;
            this.formData.ParentMaterialName = this.formData.MaterialName;
            this.formData.ParentUnit = this.formData.Unit;
            this.formData.Denominator = this.formData.Molecule;
            // this.formData.BOMMasterID = this.formData.ParentID
            this.formData["dicID"] = this.sysID[this.tagRemark].ID;
            submitData = [this.formData];
          } else {
            isPass = false;
          }
        });
        // 校验不通过
        if (!isPass) {
          return;
        }
      } else if (remarkTb == 1) {
        if (this.tableData[remarkTb].length) {
          if (this.formSearchs[remarkTb].required.length) {
            // 动态检验必填项
            for (let i = 0; i < this.tableData[remarkTb].length; i++) {
              for (
                let x = 0;
                x < this.formSearchs[remarkTb].required.length;
                x++
              ) {
                if (
                  !this.tableData[remarkTb][i][
                    this.formSearchs[remarkTb].required[x]["prop"]
                  ] &&
                  String(
                    this.tableData[remarkTb][i][
                      this.formSearchs[remarkTb].required[x]["prop"]
                    ]
                  ) !== "0"
                ) {
                  this.$message.error(
                    `${this.formSearchs[remarkTb].required[x]["label"]}不能为空，请填写`
                  );
                  return;
                }
              }
            }
          }
        }
        const $table = this.$refs.ComUmyTable.$refs.plxTable;
        // 获取修改记录
        let updateRecords = $table.getUpdateRecords();
        if (updateRecords.length) {
          submitData = updateRecords;
        }
      }
      if (submitData.length == 0) {
        this.$message.error("当前数据没做修改，请先修改再保存！");
        return;
      }
      this.adminLoading = true;
      let res = await SaveData(submitData);
      const { result, data, count, msg } = res.data;
      if (result) {
        if (remarkTb == 0) {
          // this.getBomTree(0,this.keyWords)
          this.dataSearch(remarkTb);
        } else {
          this.dataSearch(0);
          // this.getBomTree(0,this.keyWords)
          this.dataSearch(remarkTb);
        }

        this.adminLoading = false;
        this.$message({
          message: msg,
          type: "success",
          dangerouslyUseHTMLString: true
        });
      } else {
        this.adminLoading = false;
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true
        });
      }
    },
    // 获取数据源
    async getDataSource(Props) {
      let form = {};
      form["DataSourceID"] = Props;
      let res = await GetSearch(form, "/APSAPI/GetDataSource");
      const { result, data, count, msg } = res.data;
      if (result) {
        if (data) {
          for (let key in data) {
            for (let obj in this.DataSourceList) {
              if (obj === key) {
                this.DataSourceList[obj] = data[key];
              }
            }
          }
        }
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true
        });
      }
    },
    // 树结构查询
    async getBomTree(remarkTb, keyWords) {
      this.$set(this.tableLoading, remarkTb, true);
      let form = this.formSearchs[remarkTb].datas;
      form["Code"] = keyWords;
      form["rows"] = this.tablePagination[remarkTb].pageSize;
      form["page"] = this.tablePagination[remarkTb].pageIndex;
      this.$set(this.tableLoading, remarkTb, true);
      let res = await GetSearch(form, "/APSAPI/GetBomData");
      const { result, data, count, msg } = res.data;
      if (result) {
        this.$set(this.tableData, remarkTb, data);
        this.$set(this.tablePagination[remarkTb], "pageTotal", count);
        this.$set(this.tableLoading, remarkTb, false);
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true
        });
      }
      this.$set(this.tableLoading, remarkTb, false);
    }
  }
};
</script>
<style lang="scss" scoped>
::v-deep .admin_left {
  width: 350px;
}
::v-deep.el-pagination-tree .searchInput > .w2\/3 {
  width: 100% !important;
}
</style>
