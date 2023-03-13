<!--BOM清单-->
<template>
  <div
    class="container flex_flex"
    v-loading="adminLoading"
  >
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
        :pageSizes="[10,20,30]"
        :expand="false"
      />
    </div>
    <div class="admin_container">
      <div class="admin_head_3" ref="headRef">
        <div style="text-align: right;;">
          <el-button
            plain
            v-for="(item, i) in parmsBtn2"
            :key="i"
            :type="item.Type ? item.Type : 'primary'"
            :icon="item.Icon"
            size="small"
            @click="btnClick(item.Methods, item.Params, i,0)"
            v-show="Array.prototype.isPrototypeOf(item.signName) && item.signName.includes(signName)?true:item.signName || item.signName == 0 ? item.signName == signName: true"
          >
            {{ item.BtnName }}
          </el-button>
          
        </div>
        <ComForm
          class="formStyle"
          ref="ruleForm0"
          :formData="formData"
          :formController="formController"
          :formRules="formRules"
        ></ComForm>
      </div>
      <div
        class="admin_head_4"
      >
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
              <el-col :span="4"><span class="title">{{ title }}</span></el-col>
              <el-col
                :span="20"
                class="flex_flex_end"
              >
              <!-- <div v-if="childAddEdit">
                <span>新增行数：</span>
                  <el-input-number v-model.trim="addNum" :min="1" :max="100" :step="10" placeholder="请输入"></el-input-number>
              </div> -->
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
                        <path d="M758.2 839.1C851.8 765.9 912 651.9 912 523.9 912 303 733.5 124.3 512.6 124 291.4 123.7 112 302.8 112 523.9c0 125.2 57.5 236.9 147.6 310.2 3.5 2.8 8.6 2.2 11.4-1.3l39.4-50.5c2.7-3.4 2.1-8.3-1.2-11.1-8.1-6.6-15.9-13.7-23.4-21.2a318.64 318.64 0 01-68.6-101.7C200.4 609 192 567.1 192 523.9s8.4-85.1 25.1-124.5c16.1-38.1 39.2-72.3 68.6-101.7 29.4-29.4 63.6-52.5 101.7-68.6C426.9 212.4 468.8 204 512 204s85.1 8.4 124.5 25.1c38.1 16.1 72.3 39.2 101.7 68.6 29.4 29.4 52.5 63.6 68.6 101.7 16.7 39.4 25.1 81.3 25.1 124.5s-8.4 85.1-25.1 124.5a318.64 318.64 0 01-68.6 101.7c-9.3 9.3-19.1 18-29.3 26L668.2 724a8 8 0 00-14.1 3l-39.6 162.2c-1.2 5 2.6 9.9 7.7 9.9l167 .8c6.7 0 10.5-7.7 6.3-12.9l-37.3-47.9z"></path>
                      </svg></span>
                  </span>
                </el-tooltip>
                <el-divider direction="vertical"></el-divider>
                <el-tooltip
                  effect="dark"
                  content="列设置"
                  placement="bottom"
                >
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
                        <path d="M924.8 625.7l-65.5-56c3.1-19 4.7-38.4 4.7-57.8s-1.6-38.8-4.7-57.8l65.5-56a32.03 32.03 0 009.3-35.2l-.9-2.6a443.74 443.74 0 00-79.7-137.9l-1.8-2.1a32.12 32.12 0 00-35.1-9.5l-81.3 28.9c-30-24.6-63.5-44-99.7-57.6l-15.7-85a32.05 32.05 0 00-25.8-25.7l-2.7-.5c-52.1-9.4-106.9-9.4-159 0l-2.7.5a32.05 32.05 0 00-25.8 25.7l-15.8 85.4a351.86 351.86 0 00-99 57.4l-81.9-29.1a32 32 0 00-35.1 9.5l-1.8 2.1a446.02 446.02 0 00-79.7 137.9l-.9 2.6c-4.5 12.5-.8 26.5 9.3 35.2l66.3 56.6c-3.1 18.8-4.6 38-4.6 57.1 0 19.2 1.5 38.4 4.6 57.1L99 625.5a32.03 32.03 0 00-9.3 35.2l.9 2.6c18.1 50.4 44.9 96.9 79.7 137.9l1.8 2.1a32.12 32.12 0 0035.1 9.5l81.9-29.1c29.8 24.5 63.1 43.9 99 57.4l15.8 85.4a32.05 32.05 0 0025.8 25.7l2.7.5a449.4 449.4 0 00159 0l2.7-.5a32.05 32.05 0 0025.8-25.7l15.7-85a350 350 0 0099.7-57.6l81.3 28.9a32 32 0 0035.1-9.5l1.8-2.1c34.8-41.1 61.6-87.5 79.7-137.9l.9-2.6c4.5-12.3.8-26.3-9.3-35zM788.3 465.9c2.5 15.1 3.8 30.6 3.8 46.1s-1.3 31-3.8 46.1l-6.6 40.1 74.7 63.9a370.03 370.03 0 01-42.6 73.6L721 702.8l-31.4 25.8c-23.9 19.6-50.5 35-79.3 45.8l-38.1 14.3-17.9 97a377.5 377.5 0 01-85 0l-17.9-97.2-37.8-14.5c-28.5-10.8-55-26.2-78.7-45.7l-31.4-25.9-93.4 33.2c-17-22.9-31.2-47.6-42.6-73.6l75.5-64.5-6.5-40c-2.4-14.9-3.7-30.3-3.7-45.5 0-15.3 1.2-30.6 3.7-45.5l6.5-40-75.5-64.5c11.3-26.1 25.6-50.7 42.6-73.6l93.4 33.2 31.4-25.9c23.7-19.5 50.2-34.9 78.7-45.7l37.9-14.3 17.9-97.2c28.1-3.2 56.8-3.2 85 0l17.9 97 38.1 14.3c28.7 10.8 55.4 26.2 79.3 45.8l31.4 25.8 92.8-32.9c17 22.9 31.2 47.6 42.6 73.6L781.8 426l6.5 39.9zM512 326c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm79.2 255.2A111.6 111.6 0 01512 614c-29.9 0-58-11.7-79.2-32.8A111.6 111.6 0 01400 502c0-29.9 11.7-58 32.8-79.2C454 401.6 482.1 390 512 390c29.9 0 58 11.6 79.2 32.8A111.6 111.6 0 01624 502c0 29.9-11.7 58-32.8 79.2z"></path>
                      </svg></span>
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
            @handleRowClick="handleRowClick"
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
      :formController="formControllerParent"
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
      @selectHandleNodeClick="selectHandleNodeClick"
      @dialogBtnClick="childConfirm"
    />

    <!-- 批量修改 -->
    <!-- <ComFormDialog
      ref="orgRef2"
      :title="updateTitle"
      :dialogShow="dialogShow2"
      :formData="formData2"
      :formController="formController2"
      @selectHandleNodeClick="selectHandleNodeClick2"
      @dialogBtnClick="dialogBtnClick2"
    /> -->

    <el-dialog
      title="导入模板"
      :visible.sync="dialogImport"
      width="30%"
    >
      <el-upload
        action="https://jsonplaceholder.typicode.com/posts/"
        style="padding-top: 10px"
        class="upload-demo"
        drag
        :limit="1"
        :multiple="false"
        name="files"
        ref="upload"
        :on-change="handleChanged"
        :on-remove="handleRemove"
        :file-list="fileList"
        :auto-upload="false"
        accept=".xls, .xlsx"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div
          class="el-upload__tip"
          slot="tip"
        >
          只能上传xls、xslx文件且仅支持上传一个文件
        </div>
      </el-upload>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          @click="dialogImport = false"
          size="small"
        >取 消</el-button>
        <el-button
          size="small"
          type="primary"
          @click="sureImport"
        >确 定</el-button>
      </span>
    </el-dialog>
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
import { mapState } from "vuex";
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
      
      ChildTitle:'子件信息',
      treeProps: {
        label: "Code",
        children: "children",
      },
      keyWords:'',
      ///////////////新增弹框//////////////
      addParentTitle:'新增父件',
      addChildTitle:'新增子件',
      updateTitle:'批量修改',
      dialogShowParent: false,
      dialogShowChild: false,
      dialogShow2:false,
      formData: {
        // ParentID:0,
        Denominator:null,
        ParentUnit:null,
        ItemClass:null,
        LineNum:null,
        Remark1:null,
        Status: 0,
        ParentCode:null,
        ParentMaterialName:null,
      },
      formDataParent: {
        // ParentID:0,
        Denominator:null,
        ParentUnit:null,
        ItemClass:null,
        LineNum:null,
        Remark1:null,
        Status: 0,
        ParentCode:null,
        ParentMaterialName:null,
      },
      formDataChild: {
        Code:null,
        MaterialName:null,
        Molecule:null,
        Unit:null,
        Scrappage:null,
        Remark1:null,
        Status: 0,
      },
      UserTypes: [],
      PositionIDs: [],
      treeData: [],
      treeListTmp: [],
      formController: [

        { label: "父件物料号", prop: "ParentCode", type: "input" },
        { label: "父件描述", prop: "ParentMaterialName", type: "textarea" },
        {
          label: "基本数量",
          prop: "Denominator",
          type: "input",
          inputType: "number",
        },
        { label: "单位", prop: "ParentUnit", type: "input" },
        { label: "项目类别", prop: "ItemClass", type: "input" },
        { label: "项目", prop: "LineNum", type: "input" },
        // { label: "备注", prop: "Remark1", type: "textarea" },
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
        ParentCode: [{ required: true, message: "必填项", trigger: "blur" }],
        ParentMaterialName: [{ required: true, message: "必填项", trigger: "blur" }],
        Denominator: [{ required: true, message: "必填项", trigger: "blur" }],
        ParentUnit: [ { required: true, message: "必填项", trigger: "blur" }],
        // ItemClass: [{ required: true, message: "必填项", trigger: "blur" }],
        // LineNum: [{ required: true, message: "必填项", trigger: "blur" }]
      },
      formControllerParent: [
        { label: "父件物料号", prop: "ParentCode", type: "input" },
        { label: "父件描述", prop: "ParentMaterialName", type: "textarea" },
        {
          label: "基本数量",
          prop: "Denominator",
          type: "input",
          inputType: "number",
        },
        { label: "单位", prop: "ParentUnit", type: "input" },
        { label: "项目类别", prop: "ItemClass", type: "input" },
        { label: "项目", prop: "LineNum", type: "input" },
        // { label: "备注", prop: "Remark1", type: "textarea" },
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
      formRulesParent: {
        ParentCode: [{ required: true, message: "必填项", trigger: "blur" }],
        ParentMaterialName: [{ required: true, message: "必填项", trigger: "blur" }],
        Denominator: [{ required: true, message: "必填项", trigger: "blur" }],
        ParentUnit: [ { required: true, message: "必填项", trigger: "blur" }],
        // ItemClass: [{ required: true, message: "必填项", trigger: "blur" }],
        // LineNum: [{ required: true, message: "必填项", trigger: "blur" }]
      },
      formControllerChild: [
      { label: "父件物料号", prop: "ParentCode",type: "input",disabled:true  },
      { label: "子件物料号", prop: "Code", type: "input" },
        { label: "子件描述", prop: "MaterialName", type: "textarea" },
        {
          label: "子件数量",
          prop: "Molecule",
          type: "input",
          inputType: "number",
        },
        { label: "单位", prop: "Unit", type: "input" },
        { label: "报废率", prop: "Scrappage", type: "input" },
        { label: "备注", prop: "Remark1", type: "textarea" },
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
      formRulesChild: {
        Code: [{ required: true, message: "必填项", trigger: "blur" }],
        MaterialName: [{ required: true, message: "必填项", trigger: "blur" }],
        Molecule: [{ required: true, message: "必填项", trigger: "blur" }],
        Unit: [ { required: true, message: "必填项", trigger: "blur" }],
        Scrappage: [{ required: true, message: "必填项", trigger: "blur" }],
      },
      ////////////////// Search /////////////////
      title: this.$route.meta.title,
      // drawerTitle: "新增人员",
      drawer: false,
      delData: [[],[]],
      formSearchs: [
        {
          datas: {},
          forms: [],
          required:[],//获取必填项
        },
        {
          datas: {},
          forms: [],
          required:[],//获取必填项
        },
      ],
      parmsBtn: [
        {
          ButtonCode: "import",
          BtnName: "导入",
          Type: "primary",
          Ghost: true,
          Size: "small",
          Methods: "dataImport",
          Params: "",
          Icon: "",
          sort:1,
        },
        {
          ButtonCode: "addChildBom",
          BtnName: "",
          Type: "primary",
          Ghost: true,
          Size: "small",
          Methods: "addChildBom",
          Icon: "",
          sort:2,
        },
        {
          ButtonCode: "save",
          BtnName: "保存",
          Type: "success",
          Ghost: true,
          Size: "small",
          Methods: "dataSave",
          Icon: "",
          sort:3,
          Params: { dataName: "saveData" },
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
          sort:4,
        },
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
          sort:1,
        },
        {
          ButtonCode: "save",
          BtnName: "保存",
          Type: "success",
          Ghost: true,
          Size: "small",
          Methods: "dataSave",
          Icon: "",
          sort:2,
          Params: { dataName: "saveData" },
        },
        {
          ButtonCode: "delete",
          BtnName: "删除",
          Type: "danger",
          Ghost: true,
          Size: "small",
          Methods: "dataDel",
          Params: { },
          Icon: "",
          sort:3,
        },
      ],
      saveData: [[],[]],
      selectionData: [[],[]],
      btnForm: [],
      tableData: [[],[]],
      tableColumns: [[],[]],
      tableLoading: [false,false],
      isClear: [false,false],
      tablePagination: [
        { pageIndex: 1, pageSize: 10, pageTotal: 0 },
        { pageIndex: 1, pageSize: 10, pageTotal: 0 },
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
      sysID:[ {ID:1185}, {ID:1185},],
      addNum:1,//新增行数
      childAddEdit:false,//新增状态
      DataSourceList:{},//数据源
      DataSourceIds:[],//数据源ID
      keyWords:'',
    };
  },
  computed: {
    // ...mapState({
    //   userInfo: (state) => state.user.userInfo,
    // }),
  },
  created() {
    _this = this;
    this.judgeBtn();
    this.getTableHeader();
  },
  mounted() {
    setTimeout(() => {
      this.setHeight();
      // this.getOrgData();
    }, 500);
  },
  methods: {
    async getUserType() {
      let res = await GetSearchData({ dicID: 43, StatusType: "人员属性" });
      const { result, data, count, msg } = res.data;
      if (result) {
        if (data.length != 0) {
          let newData = [];
          data.forEach((x) => {
            let obj = {};
            obj["label"] = x.StatusName;
            obj["value"] = x.StatusID;
            newData.push(obj);
          });
          this.$set(this.formController[6], "select", newData);
        }
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
    },
    async getPosition() {
      let res = await GetSearchData({ dicID: 39, Status: 1 });
      const { result, data, count, msg } = res.data;
      if (result) {
        if (data.length != 0) {
          let newData = [];
          data.forEach((x) => {
            let obj = {};
            obj["label"] = x.PositionName;
            obj["value"] = x.PositionID;
            newData.push(obj);
          });
          this.$set(this.formController[7], "select", newData);
        }
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
    },
    //输入框改变查询的值
    async searchTree(msg) {
      this.keyWords = msg
    },
    // 回车获取值
    searchTreeEnter(msg) {
      // 树结构查询接口,需要传入BOM编码
      console.log('msg',msg)
      this.getBomTree(0,msg)
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
    // 导出
    async dataExport(remarkTb) {
      this.adminLoading = true;
      let form = JSON.parse(JSON.stringify(this.formSearchs[remarkTb].datas));
      form["rows"] = 0;
      let res = await ExportData(form);
      this.adminLoading = false;
      this.$store.dispatch("user/exportData", res.data);
    },
    // 导入模板
    dataImport() {
      this.dialogImport = true;
      this.fileList = [];
      this.file = [];
    },
    // 确认导入
    sureImport() {
      if (this.fileList.length == 0) {
        this.$message.error("请先选择文件");
        return;
      } else if (this.fileList.length > 1) {
        this.$message.error("仅支持一个文件上传");
      } else {
        this.$confirm("确定要导入人员模板吗？")
          .then((_) => {
            _this.importExcel(this.file);
          })
          .catch((_) => {});
      }
    },
    importExcel(file) {
      this.adminLoading = true;
      this.dialogImport = false;
      const result = [];
      const reader = new FileReader(); //就这啊点上传就解析文件
      var that = this;
      reader.onload = function (e) {
        const data = e.target.result;
        this.wb = XLSX.read(data, {
          type: "binary",
        });
        this.wb.SheetNames.forEach((sheetName) => {
          result.push({
            sheetName: sheetName,
            sheet: XLSX.utils.sheet_to_json(this.wb.Sheets[sheetName]),
          });
        });
        that.dataSys(result); // 解析文件
      };
      reader.readAsBinaryString(file.raw);
    },
    // 解析文件
    async dataSys(importData) {
      if (importData && importData.length > 0) {
        let DataList = [];
        importData[0].sheet.forEach((m) => {
          var obj = {};
          obj["Name"] = m["姓名"];
          obj["Account"] = m["账号"];
          obj["Pwd"] = m["密码"];
          obj["OrganizeID"] = m["组织"];
          obj["Sex"] = m["性别"];
          obj["EntryDate"] = m["入职日期"];
          // obj["dicID"] = 3007;
          DataList.push(obj);
        });
        let res = await SaveData(DataList);
        const { result, data, count, msg } = res.data;
        if (result) {
          this.adminLoading = false;
          this.dataSearch(0);
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
      }
    },
    handleChanged(file, fileList) {
      var ext = file.name.substring(file.name.lastIndexOf(".") + 1);
      const extension = ext === "xlsx" || ext === "xls";
      if (!extension) {
        this.$message.error("上传文件格式只能为xlsx/xls");
        // 取消时在文件列表中删除该文件
        this.$refs.upload.handleRemove(file);
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 50;
      if (!isLt2M) {
        this.$message.error("上传文件大小不能超过 50MB!");
        // 取消时在文件列表中删除该文件
        this.$refs.upload.handleRemove(file);
        return false;
      } else {
        this.file = file;
        this.fileList = fileList;
      }
    },
    handleRemove(file) {
      this.fileList.splice(
        this.fileList.findIndex((item) => item.url === file.url),
        1
      );
    },
    // 获取组织
    async getOrgData() {
      this.treeData = [];
      this.treeListTmp = [];
      let form = {
        dicID: 3026,
        OrganizeIDs: this.userInfo.CenterID,
        OrganizeID: this.userInfo.OrganizeID,
        Status: 1,
      };
      let res = await GetOrgData(form);
      const { result, data, count, msg } = res.data;
      if (result) {
        this.treeData = JSON.parse(JSON.stringify(data));
        this.formController[3].treeData = data;
        this.treeData.unshift({ OrganizeID: -1, OrganizeName: "未配组织人员" });
        this.treeListTmp = this.treeData;
        if (data.length != 0) {
          this.$nextTick(function () {
            if (_this.$$refs) {
              _this.$refs.asideRef.$refs.asideTree.setCurrentKey(
                data[0].OrganizeID
              );
            }
          });
          this.formSearchs[0].datas["OrganizeIDs"] = data[0].OrganizeID;
          this.formSearchs[0].datas["dicID"] = 3007;
          this.getTableData(this.formSearchs[0].datas, 0);
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
      let newBtn2 = [];
      let permission = false;
      if (routeBtn.length != 0) {
        routeBtn.forEach((x) => {
          if (x.ButtonCode == "edit") {
            permission = true;
          }
          let newData = this.parmsBtn.filter((y) => {
            // 是否有增行权限
            if(x.ButtonCode == y.ButtonCode&&x.ButtonCode==='addChildBom'){
              this.$set(this, "childAddEdit", true);
            }
            // 如果页面定义了取页面的，否则取按钮权限配置中的
            if (x.ButtonCode == y.ButtonCode) {
              y.BtnName = y.BtnName||x.ButtonName;
              y.Methods = y.Methods||x.OnClick;
              y.Type = y.Type || x.ButtonType;
              return y;
            }
            
          });
          if (newData.length != 0) {
            newBtn = newBtn.concat(newData);
          }

          let newData2 = this.parmsBtn2.filter((y) => {
            // 如果页面定义了取页面的，否则取按钮权限配置中的
            if (x.ButtonCode == y.ButtonCode) {
              y.BtnName = y.BtnName||x.ButtonName;
              y.Methods = y.Methods||x.OnClick;
              y.Type = y.Type || x.ButtonType;
              return y;
            }
          });
          if (newData2.length != 0) {
            newBtn2 = newBtn2.concat(newData2);
          }
        });
      }
      newBtn = _.sortBy(newBtn,['sort'])
      newBtn2 = _.sortBy(newBtn2,['sort'])
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
      let newHeight = rem - 40+"px";
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
    // 单击行
    handleRowClick(row, remarkTb) {
      this.delData[remarkTb] = [];
      this.delData[remarkTb].push(row);
    },
    // 增行
    async  addRow(remarkTb){
        if(!this.addNum){
            this.$message.error('请输入需要添加的行数!')
            return
        }
        // 下拉数据是需要获取数据源
        for(let x=0;x<this.addNum;x++){
          let obj ={
            dicID: this.sysID[remarkTb].ID,
            rowNum: _.uniqueId("rowNum_")
          }
        this.tableColumns[remarkTb].map((item)=>{
            obj[item.prop] = null
            if(item.prop==='Status'){
               obj[item.prop]  = 0
            }
            for(let key in this.DataSourceList){
                if(item.DataSourceName ===key){
                
                    obj[key] = this.DataSourceList[key]
                }
            }
        })
        
        console.log('this.DataSourceList',this.DataSourceList)
        
        this.tableData[remarkTb].unshift(obj)
        // obj加入行, 表示加入行的row对象，第2各个数为空则插入第一行，为-1插入最后一行
        let row = 0
        let newRow  = await  this.$refs.ComUmyTable.$refs.plxTable.insertRow(obj)
        console.log('row',row)
        // 激活单元格编辑
        this.$nextTick(()=>{
            this.$refs.ComUmyTable.$refs.plxTable.setActiveRow(newRow)
        })
        
        }
            
        
        console.log('this.tableData[remarkTb]',this.tableData[remarkTb])
    },
    // 删除
    async dataDel(remarkTb, index, parms) {
      let res = null;
      let newData = [];
      if (parms && parms.dataName) {
        if (this[parms.dataName][remarkTb].length == 0) {
          this.$message.error("请选择需要操作的数据！");
          return
        } else {
          this[parms.dataName][remarkTb].forEach((x) => {
            let obj = x;
            obj["ElementDeleteFlag"] = 1;
            obj["dicID"] = this.sysID[remarkTb].ID;
            newData.push(obj);
          });
        }
      }else if(remarkTb==0){//删除父级
        let obj = this.formData
        obj["ElementDeleteFlag"] = 1;
        obj["dicID"] = this.sysID[remarkTb].ID;
        newData = [obj]
      }
      this.$confirm("确定要删除的【" + newData.length + "】数据吗？")
        .then((_) => {
          _this.generalSaveData(newData, remarkTb, index);
        })
        .catch((_) => {});
    },
    // 通用直接保存
    async generalSaveData(newData, remarkTb, index) {
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
            if (n.childrens && n.children.length != 0) {
              n.childrens.forEach((x) => {
                this.verifyData(x);
              });
            }
            //获取下拉数据源
            if(n.DataSourceID&&n.ControlType==='combobox'){
                this.DataSourceList = {[n.DataSourceName]:[],...this.DataSourceList}
                if(!this.DataSourceIds.includes(n.DataSourceID)){
                  this.DataSourceIds.push(n.DataSourceID)
                }
            }
            if(n.Required){
                this.formSearchs[this.tagRemark].required.push(n)
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
        // 获取左侧树结构
        this.getBomTree(0)
        // this.tagRemark = 1
        // await this.getTableData(this.formSearchs[this.tagRemark].datas, this.tagRemark);
        // 获取下拉的数据源
        // this.$nextTick(()=>{
        //     // 有数据时直接取行数据源
        //     if(this.tableData[this.tagRemark].length){
        //         for(let key in this.tableData[this.tagRemark][0]){
        //             for(let obj in this.DataSourceList){
        //             if(obj === key){
        //                 this.DataSourceList[obj] = this.tableData[this.tagRemark][0][key]
        //             }
        //         }
        //         }
        //     }else{
        //       let ids = this.DataSourceIds.join(',') ||''
        //       this.getDataSource(ids)
        //     }
        // })
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
      // let res = await GetSearchData(form);
      let res = await GetSearch(form,'/APSAPI/GetBomData')
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
    // 点击新增用户
    openDrawer() {
      for (var name in this.formData) {
        this.formData[name] = "";
        // this.formData["dicID"] = 3007;
      }
      if (this.clickData && this.clickData.OrganizeID != -1) {
        this.$set(this.formData, "OrganizeID", this.clickData.OrganizeID);
        this.$set(this.formData, "OrganizeName", this.clickData.OrganizeName);
      }
      this.dialogShow = true;
    },
    // 点击批量修改数据
    openDrawer2() {
      for (var name in this.formData2) {
        this.formData2[name] = "";
        // this.formData2["dicID"] = 3007;
      }
      this.dialogShow2 = true;
    },
    // 弹框确定添加
    dialogBtnClick(val) {
      this.dialogShow = false;
      if (val) {
        let newData = [];
        newData.push(this.formData);
        this.generalSaveData(newData, 0, 0);
      } else {
        for (let name in this.formData) {
          this.formData[name] = "";
        }
      }
    },
    // 弹框确定批量修改
    dialogBtnClick2(val) {
      if (val) {
        if (this.selectionData[0].length == 0) {
          this.$refs.error("请选择数据进行批量修改！");
          return;
        }
        this.selectionData[0].forEach((x) => {
          for (var name in this.formData2) {
            if (this.formData2[name]) {
              x[name] = this.formData2[name];
            }
          }
        });
        this.generalSaveData(this.selectionData[0], 0, 0);
        this.dialogShow2 = false;
      } else {
        for (let name in this.formData) {
          this.formData[name] = "";
        }
        this.dialogShow2 = false;
      }
    },
    // 单击出来组织人员
    handleNodeClick(data, node) {
      console.log('data',data)
      console.log('node',node)
      this.clickData = data;
      this.formData = data
      this.formSearchs[1].datas['BOMMasterID'] =  data&&data.BOMMasterID
      // 通过父级ID查询下级子件
      // this.formSearchs[1].datas['ParentID'] = data.BOMMasterID
      let dataList = this.dataSearch(1)
      console.log('dataList',dataList)
      // if (data.OrganizeID == "-1") {
      //   this.$set(this.formSearchs[0].datas, "OrganizeID", data.OrganizeID);
      //   this.$set(this.formSearchs[0].datas, "OrganizeIDs", "");
      // } else {
      //   this.$set(this.formSearchs[0].datas, "OrganizeID", "");
      //   this.$set(this.formSearchs[0].datas, "OrganizeIDs", data.OrganizeID);
      // }
      // this.dataSearch(0);
      // this.getBomTree(0,this.keyWords)
    },
    // 选择菜单树形
    selectHandleNodeClick(data, node) {
      this.formData.OrganizeName = data.OrganizeName;
      this.formData.OrganizeID = data.OrganizeID;
      this.$refs.orgRef.$refs.formTreeRef[0].blur();
    },
    // 选择菜单树形
    selectHandleNodeClick2(data, node) {
      this.formData2.OrganizeName = data.OrganizeName;
      this.formData2.OrganizeID = data.OrganizeID;
      this.$refs.orgRef2.$refs.formTreeRef[0].blur();
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
    // 选择数据
    selectFun(data, remarkTb, row) {
      this.selectionData[remarkTb] = data;
    },
    // 重置校验
    resetForm(formName) {
      console.log('this.$refs',this.$refs)
        this.$refs[formName].$refs['formData'].resetFields();
    },
    // 新增父件
    addParentBom(){
      this.dialogShowParent = true
      this.formDataParent['dicID'] = this.sysID[this.tagRemark].ID
      console.log('this.formDataParent',this.formDataParent)
      this.$nextTick(()=>{
        this.resetForm('refParent')
      })
    },
    // 父件确认添加
    parentConfirm(val){
      if(val){
        this.$refs['refParent'].$refs['formData'].validate((valid) => {
          if (valid) {
            this.addDataSave([this.formDataParent],0)
            this.dialogShowParent = false
          }
        });
      }else{
        this.dialogShowParent = false
      }
    },
    // 新增子件
    addChildBom(){
      // 对接好添加这个判断
      if(!this.formData.MaterialBomID){
        this.$message.error("未关联到父件，请检查！");
        return
      }
      if(this.formData&&this.formData.MaterialBomID){
        this.formDataChild['dicID'] = this.sysID[this.tagRemark].ID
        this.formDataChild['ParentCode'] = this.formData['Code']
      }
      this.dialogShowChild = true
      this.$nextTick(()=>{
        this.resetForm('refChild')
      })
    },
    // 子件确认添加
    childConfirm(val){
      if(val){
        this.$refs['refChild'].$refs['formData'].validate((valid) => {
          if (valid) {
            this.addDataSave([this.formDataChild],1)
            this.dialogShowChild = false
          } 
        });
      }else{
        this.dialogShowChild = false
      }
    },
    // 新增保存
    async addDataSave(newData, remarkTb) {
      console.log('remarkTb',remarkTb)
      console.log('newData',newData)
      this.adminLoading = true;
      let res = await SaveData(newData);
      const { result, data, count, msg } = res.data;
      if (result) {
        this.formData = this.formDataParent
        this.getBomTree(0,this.keyWords)
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
    // 直接保存
    async dataSave(remarkTb, index, params) {
      let submitData = []
      if(remarkTb==0){
        this.$refs['ruleForm0'].$refs['formData'].validate((valid) => {
          if (valid) {
            this.formData['dicID'] = this.sysID[this.tagRemark].ID
            submitData = [this.formData]
          } else {
            console.log('error submit!!');
            return false;
          }
        });
        
      }else if(remarkTb==1){
        if(this.tableData[remarkTb].length){
          if(this.formSearchs[remarkTb].required.length){
              // 动态检验必填项
              for(let i=0;i<this.tableData[remarkTb].length;i++){
                  for(let x=0;x<this.formSearchs[remarkTb].required.length;x++){
                      // console.log('this.formSearchs[remarkTb].required',this.formSearchs[remarkTb].required)
                      if(!this.tableData[remarkTb][i][this.formSearchs[remarkTb].required[x]['prop']]){
                      this.$message.error(`${this.formSearchs[remarkTb].required[x]['label']}不能为空，请选择`)
                      return
                  }
              }
          }
          }
        }else{
          return
        }
        const $table = this.$refs.ComUmyTable.$refs.plxTable
        // 获取修改记录
        let updateRecords =$table.getUpdateRecords()
        // 新增的行
        let insertRecords = $table.getInsertRecords()
        if(updateRecords){
          submitData = [...updateRecords,...insertRecords]
        }
        console.log('remarkTb',remarkTb)
        console.log('insertRecords',insertRecords)
        console.log('submitData1',submitData)
        if(submitData.length==0){
          this.$message.error("当前数据没做修改，请先修改再保存！");
          return
        }
      }

      console.log('index',index)
      console.log('remarkTb',remarkTb)
      console.log('params',submitData)
      this.adminLoading = true;
      let res = await SaveData(submitData);
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
    // 获取数据源
    async getDataSource(Props) {
    let form = {}
      form["DataSourceID"] = Props;
      let res = await GetSearch(form, "/APSAPI/GetDataSource");
      const { result, data, count, msg } = res.data;
      if (result) {
        console.log('data',data)
        if(data){
          for(let key in data){
            for(let obj in this.DataSourceList){
                if(obj === key){
                    this.DataSourceList[obj] = data[key]
                }
            }
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
    // 树结构查询
    async getBomTree(remarkTb,keyWords){
      let form = this.formSearchs[remarkTb].datas
      form['Code'] =  keyWords
      form["rows"] = this.tablePagination[remarkTb].pageSize;
      form["page"] = this.tablePagination[remarkTb].pageIndex;
      console.log('form',form)
      this.$set(this.tableLoading, remarkTb, true);
      let res = await GetSearch(form,'/APSAPI/GetBomData');
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
    }
  },
};
</script>