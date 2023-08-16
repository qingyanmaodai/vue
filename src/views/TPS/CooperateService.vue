<!--菜单设置-->
<template>
  <div class="container" v-loading="adminLoading">
    <div class="up_admin" ref="up_admin">
      <div class="admin_head_2" ref="headRef">
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
      <div class="admin_content">
        <div class="ant-table-title">
          <el-row>
            <el-col :span="4"
              ><span class="title">{{ title }}</span></el-col
            >
            <el-col :span="20" class="flex_flex_end">
              <el-button type="primary" size="mini" @click="openDrawer(0)"
                >新增月嫂档案记录</el-button
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
          :height="'200px'"
          :tableData="tableData[0]"
          :tableHeader="tableColumns[0]"
          :tableLoading="tableLoading[0]"
          :remark="0"
          :sysID="sysID[0].ID"
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
    <div class="down_admin" ref="down_admin">
      <div>
        <div class="admin_head_2" ref="headRef">
          <ComSearch
            v-show="labelStatus2 === 0"
            ref="searchRef"
            :searchData="formSearchs[1].datas"
            :searchForm="formSearchs[1].forms"
            :remark="1"
            :isLoading="isLoading"
            :btnForm="btnForm"
            @btnClick="btnClick"
          />
          <ComSearch
            v-show="labelStatus2 === 1"
            ref="searchRef"
            :searchData="formSearchs[2].datas"
            :searchForm="formSearchs[2].forms"
            :remark="2"
            :isLoading="isLoading"
            :btnForm="btnForm"
            @btnClick="btnClick"
          />
          <ComSearch
            v-show="labelStatus2 === 2"
            ref="searchRef"
            :searchData="formSearchs[3].datas"
            :searchForm="formSearchs[3].forms"
            :remark="3"
            :isLoading="isLoading"
            :btnForm="btnForm"
            @btnClick="btnClick"
          />
        </div>
        <div class="admin_content">
          <div class="ant-table-title">
            <el-row>
              <el-col :span="20" class="flex_flex_start">
                <div v-for="(item, y) in Status2" :key="y">
                  <span
                    @click="changeStatus2(item, y)"
                    :class="
                      labelStatus2 == y ? 'statusActive cursor' : 'cursor'
                    "
                    >{{ item.label }}</span
                  >
                  <el-divider direction="vertical"></el-divider>
                </div>
              </el-col>
              <!-- <el-col :span="4"><span class="title">{{ title }}</span></el-col> -->
              <el-col :span="20" class="flex_flex_end">
                <el-button
                  v-show="labelStatus2 == 0"
                  type="primary"
                  size="mini"
                  @click="openDrawer(1)"
                  >新增能力标签</el-button
                >
                <el-button
                  v-show="labelStatus2 == 1"
                  type="primary"
                  size="mini"
                  @click="openDrawer(2)"
                  >新增持有证书</el-button
                >
                <el-button
                  v-show="labelStatus2 == 2"
                  type="primary"
                  size="mini"
                  @click="openDrawer(3)"
                  >新增接单情况</el-button
                >
              </el-col>
            </el-row>
          </div>
          <ComUmyTable
            v-show="labelStatus2 === 0"
            :rowKey="'RowNumber'"
            :height="height"
            :tableData="tableData[1]"
            :tableHeader="tableColumns[1]"
            :tableLoading="tableLoading[1]"
            :remark="1"
            :sysID="sysID[1].ID"
            :isClear="isClear[1]"
            :pagination="tablePagination[1]"
            @handleRowClick="handleRowClick"
            @pageChange="pageChange"
            @pageSize="pageSize"
            @sortChange="sortChange"
          />
          <ComUmyTable
            v-show="labelStatus2 === 1"
            :rowKey="'RowNumber'"
            :height="height"
            :tableData="tableData[2]"
            :tableHeader="tableColumns[2]"
            :tableLoading="tableLoading[2]"
            :remark="2"
            :sysID="sysID[2].ID"
            :isClear="isClear[2]"
            :pagination="tablePagination[2]"
            @handleRowClick="handleRowClick"
            @pageChange="pageChange"
            @pageSize="pageSize"
            @sortChange="sortChange"
          />
          <ComUmyTable
            v-show="labelStatus2 == 2"
            :rowKey="'RowNumber'"
            :height="height"
            :tableData="tableData[3]"
            :tableHeader="tableColumns[3]"
            :tableLoading="tableLoading[3]"
            :remark="3"
            :sysID="sysID[3].ID"
            :isClear="isClear[3]"
            :pagination="tablePagination[3]"
            @handleRowClick="handleRowClick"
            @pageChange="pageChange"
            @pageSize="pageSize"
            @sortChange="sortChange"
          />
        </div>
      </div>
    </div>
    <!-- 新增用户弹框 -->
    <ComFormDialog
      ref="sourceForm"
      :title="'新增月嫂档案'"
      :dialogShow="dialogShow"
      :remark="0"
      :formData="formData"
      :formRules="formRules"
      :formController="formController"
      @dialogBtnClick="dialogBtnClick"
    />
    <ComFormDialog
      ref="sourceForm"
      :title="'新增能力标签'"
      :dialogShow="dialogShow1"
      :remark="1"
      :formData="formData"
      :formRules="formRules"
      :formController="formController1"
      @dialogBtnClick="dialogBtnClick"
    />
    <ComFormDialog
      ref="sourceForm"
      :title="'新增持有证书'"
      :dialogShow="dialogShow2"
      :remark="2"
      :formData="formData"
      :formRules="formRules"
      :formController="formController2"
      @dialogBtnClick="dialogBtnClick"
    />
    <ComFormDialog
      ref="sourceForm"
      :title="'新增接单情况'"
      :dialogShow="dialogShow3"
      :remark="3"
      :formData="formData"
      :formRules="formRules"
      :formController="formController3"
      @dialogBtnClick="dialogBtnClick"
    />
    <el-dialog title="数据导入" :visible.sync="dialogImport" width="30%">
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
        <div class="el-upload__tip" slot="tip">
          只能上传xls、xslx文件且仅支持上传一个文件
        </div>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogImport = false" size="small">取 消</el-button>
        <el-button size="small" type="primary" @click="sureImport"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
var _this;
import ComSearch from "@/components/ComSearch";
import ComUmyTable from "@/components/ComUmyTable";
import ComFormDialog from "@/components/ComFormDialog";
import { GetHeader, GetSearchData, ExportData, SaveData } from "@/api/Common";
export default {
  name: "DataInfo",
  components: {
    ComSearch,
    ComUmyTable,
    ComFormDialog,
  },
  data() {
    return {
      adminLoading: false,
      ////////////////// Search /////////////////
      sysID: [{ ID: 10269 }, { ID: 10270 }, { ID: 10271 }, { ID: 10272 }],
      title: this.$route.meta.title,
      Status2: [
        { label: "能力标签", value: 0 },
        { label: "持有证书", value: 1 },
        { label: "接单情况", value: 2 },
      ],
      exportList: [
        { label: "月嫂档案", value: 0 },
        { label: "能力标签", value: 1 },
        { label: "培训考核结果", value: 2 },
        { label: "持有证书", value: 3 },
        { label: "其他", value: 4 },
        { label: "体检情况", value: 5 },
        { label: "累计上单情况", value: 6 },
      ],
      labelStatus2: 0,
      importStatus: -1,
      drawer: false,
      delData: [[]],
      updateData: [[]],
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
        {
          datas: {},
          forms: [],
        },
      ],
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
        {
          ButtonCode: "update",
          BtnName: "修改",
          isLoading: false,
          Methods: "dataUpdate",
          Type: "success",
          Icon: "",
          Size: "small",
          Params: { dataName: "updateData" },
        },
        {
          ButtonCode: "import",
          BtnName: "导入",
          isLoading: false,
          Methods: "dataImport",
          Type: "primary",
          Icon: "",
          Size: "small",
        },
      ],
      tableData: [[], [], [], []],
      tableColumns: [[], [], [], []],
      tableLoading: [false, false, false, false],
      isClear: [false, false, false, false],
      tablePagination: [
        { pageIndex: 1, pageSize: 50, pageTotal: 0 },
        { pageIndex: 1, pageSize: 50, pageTotal: 0 },
        { pageIndex: 1, pageSize: 50, pageTotal: 0 },
        { pageIndex: 1, pageSize: 50, pageTotal: 0 },
      ],
      height: "707px",
      showPagination: true,
      tagRemark: 0,
      isLoading: false,
      dialogImport: false,
      fileList: [],
      file: [],
      //////////////新增弹框//////////////
      // dialogShow: false,
      // dialogShow1: false,
      dialogShow: false,
      dialogShow1: false,
      dialogShow2: false,
      dialogShow3: false,
      // formData: {
      //   DataSouceName: "",
      //   USQL: "",
      //   DataText: "",
      //   DataValue: "",
      //   Status: 1,
      //   dicID: 10257,
      // },
      // formData: [{dicID:10257},{dicID:10258},{dicID:10259},{dicID:10260},{dicID:10261},{dicID:10262},{dicID:10263}],
      formData: { dicID: 10269 },
      formController: [
        { label: "姓名", prop: "Name", type: "input" },
        { label: "等级", prop: "Level", type: "input" },
        { label: "薪资", prop: "Salary", type: "input" },
        { label: "备注", prop: "Remark", type: "input" },
        { label: "年龄", prop: "Age", type: "input" },
        { label: "联系方式", prop: "ContactInformation", type: "input" },
        { label: "支行", prop: "DepositBank", type: "input" },
        { label: "银行卡号", prop: "BankCardNo", type: "input" },
        { label: "合作日期", prop: "CooperateDate", type: "date" },
        { label: "招生老师", prop: "EnrollmentTeacher", type: "input" },
        { label: "渠道", prop: "Channel", type: "input" },
        { label: "属相", prop: "Zodiac", type: "input" },
        { label: "身份证号码", prop: "IDCard", type: "input" },
        { label: "身份证有限期", prop: "IDCardLimited", type: "input" },
        { label: "籍贯", prop: "NativePlace", type: "input" },
        { label: "学历", prop: "Education", type: "input" },
        { label: "民族", prop: "Nation", type: "input" },
        { label: "紧急联系人", prop: "EmergencyContact", type: "input" },
        {
          label: "紧急联系人电话",
          prop: "EmergencyContactPhone",
          type: "input",
        },
        { label: "关系", prop: "Relation", type: "input" },
        // {
        //   label: "状态",
        //   prop: "Status",
        //   type: "radioGroupLabel",
        //   radioGroups: [
        //     { label: "启用", value: 1 },
        //     { label: "禁用", value: 0 },
        //   ],
        // },
      ],
      formController1: [
        { label: "身份证号码", prop: "IDCard", type: "input" },
        { label: "类型", prop: "Type", type: "input" },
        {
          label: "合格",
          prop: "Qualified",
          type: "radioGroupLabel",
          radioGroups: [
            { label: "是", value: "√" },
            { label: "否", value: "×" },
          ],
        },
        { label: "有效期", prop: "EffectiveDate", type: "date" },
        { label: "备注", prop: "Remark", type: "input" },
      ],
      formController2: [
        { label: "身份证号码", prop: "IDCard", type: "input" },
        { label: "证书", prop: "Certificate", type: "input" },
        {
          label: "具备",
          prop: "Have",
          type: "radioGroupLabel",
          radioGroups: [
            { label: "是", value: "√" },
            { label: "否", value: "×" },
          ],
        },
        { label: "发证机关", prop: "IssueAuthority", type: "input" },
        { label: "发证日期", prop: "IssueDate", type: "date" },
        { label: "有效期", prop: "ValidityTerm", type: "input" },
        { label: "证件编号", prop: "CertificateNo", type: "input" },
      ],
      formController3: [
        { label: "身份证号码", prop: "IDCard", type: "input" },
        { label: "年份", prop: "Year", type: "input" },
        { label: "接单", prop: "OrderReceive", type: "input" },
        { label: "完成", prop: "OrderSituation", type: "input" },
      ],
      formRules: {
        // DataSouceName: [
        //   { required: true, message: "数据源名称为必填项", trigger: "blur" },
        // ],
        // USQL: [{ required: true, message: "查询SQL为必填项", trigger: "blur" }],
      },
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
      let headHeight = this.$refs.up_admin.offsetHeight;
      let headHeight2 = this.$refs.up_admin.offsetTop;
      this.rem =
        document.documentElement.clientHeight -
        headHeight -
        headHeight2 -
        this.$store.getters.reduceHeight2;
      let newHeight = this.rem + "px";
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
      const blob = new Blob([res.data], {
        type: "application/vnd.ms-excel;",
      });
      // 生成文件路径
      if (window.navigator.msSaveOrOpenBlob) {
        navigator.msSaveBlob(blob, "数据表");
      } else {
        var a = document.createElement("a");
        var url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = "数据表";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
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
      // let IDs = [{ ID: 10257 }];
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
    openDrawer(remarkTb) {
      this.formData = {};
      if (remarkTb != 0) {
        this.formData.IDCard = this.formSearchs[remarkTb].datas.IDCard;
      }
      // this.dialogShow[this.labelStatus2+1]=true;
      if (remarkTb == 0) {
        this.dialogShow = true;
      } else if (remarkTb == 1) {
        this.dialogShow1 = true;
      } else if (remarkTb == 2) {
        this.dialogShow2 = true;
      } else if (remarkTb == 3) {
        this.dialogShow3 = true;
      }
    },
    // 弹框确定添加
    async dialogBtnClick(val, remarkTb) {
      this.formData.dicID = this.sysID[remarkTb].ID;
      if (val) {
        let res = await SaveData([this.formData]);
        const { result, data, count, msg } = res.data;
        if (result) {
          this.$message({
            message: msg,
            type: "success",
            dangerouslyUseHTMLString: true,
          });
          this.$nextTick(() => {
            _this.$refs.sourceForm.$refs.formData.resetFields();
          });
          // _this.$refs.sourceForm.$refs.formData.resetFields();
          // this.dialogShow[this.labelStatus2+1]= false;
          this.dialogShow = false;
          this.dialogShow1 = false;
          this.dialogShow2 = false;
          this.dialogShow3 = false;
          this.dataSearch(remarkTb);
        } else {
          this.$message({
            message: msg,
            type: "error",
            dangerouslyUseHTMLString: true,
          });
          // this.dialogShow[this.labelStatus2+1] = false;
          this.dialogShow = false;
          this.dialogShow1 = false;
          this.dialogShow2 = false;
          this.dialogShow3 = false;
        }
      } else {
        this.$nextTick(() => {
          _this.$refs.sourceForm.$refs.formData.resetFields();
        });
        //  _this.$refs.sourceForm.$refs.formData.resetFields();
        // _this.dialogShow[this.labelStatus2+1] = false;
        this.dialogShow = false;
        this.dialogShow1 = false;
        this.dialogShow2 = false;
        this.dialogShow3 = false;
        this.dataSearch(remarkTb);
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
    // 修改
    async dataUpdate(remarkTb, index, parms) {
      let res = null;
      let newData = [];
      if (parms && parms.dataName) {
        if (this[parms.dataName][remarkTb].length == 0) {
          this.$message.error("请单击需要修改的数据！");
          return;
        } else {
          this[parms.dataName][remarkTb].forEach((x) => {
            let obj = x;
            obj["dicID"] = this.sysID[remarkTb].ID;
            obj["update"] = true;
            newData.push(obj);
          });
        }
      } else {
        this.tableData[remarkTb].forEach((y) => {
          let obj2 = y;
          obj2["dicID"] = this.sysID[remarkTb].ID;
          obj2["update"] = true;
          newData.push(obj2);
        });
      }
      this.formData = {};
      this.formData = newData[0];
      if (remarkTb == 0) {
        this.dialogShow = true;
      } else if (remarkTb == 1) {
        this.dialogShow1 = true;
      } else if (remarkTb == 2) {
        this.dialogShow2 = true;
      } else if (remarkTb == 3) {
        this.dialogShow3 = true;
      }
    },
    // 单击行
    // handleRowClick(row, remarkTb) {
    //   this.delData[remarkTb] = [];
    //   this.delData[remarkTb].push(row);
    // },
    // 单击获取明细
    handleRowClick(row, remarkTb) {
      this.delData[remarkTb] = [];
      this.delData[remarkTb].push(row);

      this.updateData[remarkTb] = [];
      this.updateData[remarkTb].push(row);

      if (remarkTb == 0) {
        this.$set(this.formSearchs[1].datas, "dicID", this.sysID[1].ID);
        this.$set(this.formSearchs[1].datas, "IDCard", row.IDCard);
        this.getTableData(this.formSearchs[1].datas, remarkTb + 1);

        this.$set(this.formSearchs[2].datas, "dicID", this.sysID[2].ID);
        this.$set(this.formSearchs[2].datas, "IDCard", row.IDCard);
        this.getTableData(this.formSearchs[2].datas, remarkTb + 2);

        this.$set(this.formSearchs[3].datas, "dicID", this.sysID[3].ID);
        this.$set(this.formSearchs[3].datas, "IDCard", row.IDCard);
        this.getTableData(this.formSearchs[3].datas, remarkTb + 3);
      }
    },
    // 改变明细状态
    changeStatus2(item, y) {
      this.labelStatus2 = y;
      this.importStatus = y;
    },
    // 导入的相关事件
    // 导入模板
    dataImport() {
      this.dialogImport = true;
      this.fileList = [];
      this.file = [];
    },
    // 确认导入
    sureImport() {
      var remarkTb = this.importStatus;
      if (this.fileList.length == 0) {
        this.$message.error("请先选择文件");
        return;
      } else if (this.fileList.length > 1) {
        this.$message.error("仅支持一个文件上传");
      } else {
        this.$confirm("确定要导入数据吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "info",
        })
          .then(() => {
            this.importExcel(this.file, remarkTb);
          })
          .catch(() => {});
      }
    },
    importExcel(file, remarkTb) {
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
        that.dataSys(result, remarkTb); // 解析文件
      };
      reader.readAsBinaryString(file.raw);
    },
    // 解析文件 根据导入的模板 对应数据库字段 key:value
    async dataSys(importData, remarkTb) {
      if (importData && importData.length > 0) {
        let DataList = [];
        importData[0].sheet.forEach((m) => {
          var obj = {};
          if (remarkTb == -1) {
            obj["Name"] = m["姓名"];
            obj["Level"] = m["等级"];
            obj["Salary"] = m["薪资"];
            obj["Remark"] = m["备注"];
            obj["Age"] = m["年龄"];
            obj["ContactInformation"] = m["联系方式"];
            obj["DepositBank"] = m["支行"];
            obj["BankCardNo"] = m["银行卡号"];
            obj["CooperateDate"] = m["合作日期"];
            obj["EnrollmentTeacher"] = m["招生老师"];
            obj["Channel"] = m["渠道"];
            obj["Zodiac"] = m["属相"];
            obj["IDCard"] = m["身份证号码"];
            obj["IDCardLimited"] = m["身份证有限期"];
            obj["NativePlace"] = m["籍贯"];
            obj["Education"] = m["学历"];
            obj["Nation"] = m["民族"];
            obj["EmergencyContact"] = m["紧急联系人"];
            obj["EmergencyContactPhone"] = m["紧急联系人电话"];
            obj["Relation"] = m["关系"];
            obj["dicID"] = this.sysID[remarkTb + 1].ID;
          } else if (remarkTb == 0) {
            obj["IDCard"] = m["身份证号码"];
            obj["Type"] = m["类型"];
            obj["Qualified"] = m["合格"];
            obj["EffectiveDate"] = m["有效期"];
            obj["Remark"] = m["备注"];
            obj["dicID"] = this.sysID[remarkTb + 1].ID;
          } else if (remarkTb == 1) {
            obj["IDCard"] = m["身份证号码"];
            obj["Certificate"] = m["证书"];
            obj["Have"] = m["具备"];
            obj["IssueAuthority"] = m["发证机关"];
            obj["IssueDate"] = m["发证日期"];
            obj["ValidityTerm"] = m["有效期"];
            obj["CertificateNo"] = m["证件编号"];
            obj["dicID"] = this.sysID[remarkTb + 1].ID;
          } else if (remarkTb == 2) {
            obj["IDCard"] = m["身份证号码"];
            obj["Year"] = m["年份"];
            obj["OrderReceive"] = m["接单"];
            obj["OrderSituation"] = m["完成"];
            obj["dicID"] = this.sysID[remarkTb + 1].ID;
          }
          DataList.push(obj);
        });
        // 保存导入的数据
        let res = await SaveData(DataList);
        const { result, data, count, msg } = res.data;
        if (result) {
          this.adminLoading = false;
          this.dataSearch(remarkTb + 1);
          this.$message({
            message: msg,
            type: "success",
            dangerouslyUseHTMLString: true,
          });
          this.getTableData(this.formSearchs[remarkTb + 1].datas, remarkTb + 1);
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
  },
};
</script>
