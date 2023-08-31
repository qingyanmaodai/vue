<!-- 产品库 -->
<template>
  <div class="container flex_flex" v-loading="adminLoading">
    <div class="admin_container_right">
      <div class="admin_head" ref="headRef">
        <ComSearch
          ref="searchRef"
          :searchData="formSearchs[0].datas"
          :searchForm="formSearchs[0].forms"
          :remark="0"
          :btnForm="btnForm[0]"
          :Region="Region[0]"
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
                <el-radio
                  v-model="loseCategory"
                  :label="0"
                  @click.native.prevent="clickitem(1)"
                  >缺失工艺</el-radio
                >
                <el-divider direction="vertical"></el-divider>
                <el-select
                  v-model="ProcessGroupID"
                  clearable
                  filterable
                  size="small"
                >
                  <el-option
                    v-for="(x, y) in categorys"
                    :key="y"
                    :label="x.ProcessGroupName"
                    :value="x.ProcessGroupID"
                  ></el-option>
                </el-select>
                <el-divider direction="vertical"></el-divider>
                <el-button type="primary" size="mini" @click="configCategory"
                  >配置工艺</el-button
                >
                <el-divider direction="vertical"></el-divider>
                <el-button type="warning" size="mini" @click="openDialog"
                  >新增</el-button
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
          <ComVxeTable
            :rowKey="'RowNumber'"
            :height="height"
            :tableData="tableData[0]"
            :tableHeader="tableColumns[0]"
            :tableLoading="tableLoading[0]"
            :remark="0"
            :hasSelect="true"
            :sysID="1180"
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
    <div class="admin_right">
      <div class="flex px-2 py-1.5 border-b-1 tree_Head">
        <!-- <span class="tree_text">{{ title2 }}</span> -->
        <el-button
          class="margin_left5"
          v-show="labelStatus1 == 0"
          type="primary"
          size="mini"
          :disabled="!isEdit"
          @click="sureConfig"
          >确定配置</el-button
        >

        <div v-show="labelStatus1 == 1">
          <el-button
            class="margin_left5"
            type="primary"
            size="mini"
            :disabled="!isEdit"
            @click="sureConfigHost"
            >确定主线</el-button
          >
          <el-button
            class="margin_left5"
            type="warning"
            size="mini"
            :disabled="!isEdit"
            @click="sureConfigVice"
            >确定辅线</el-button
          >
        </div>
        <div class="flex_flex_end flex-1">
          <div v-for="(item, y) in Status1" :key="y">
            <span
              @click="changeStatus(item, y)"
              :class="labelStatus1 == y ? 'statusActive cursor' : 'cursor'"
              >{{ item.label }}</span
            >
            <el-divider direction="vertical"></el-divider>
          </div>
        </div>
      </div>
      <div v-show="labelStatus1 == 0">
        <!-- <div class="flex_row_spaceRound margin_lr10">
         
        </div> -->
        <div :style="{ height: treeHeight, overflow: 'auto' }">
          <el-radio-group v-model="MaterialType">
            <div v-for="(item, y) in materialTypes" :key="y" class="radio_div">
              <el-radio :label="item.label">{{ item.label }}</el-radio>
            </div>
          </el-radio-group>
        </div>
      </div>

      <div v-show="labelStatus1 == 1">
        <div class="margin_lr10 margin_top5 notice">
          注意：配置主线仅能选择一条生产线
        </div>
        <el-tree
          class="tree-line"
          :indent="0"
          ref="rightTreeRef"
          node-key="OrganizeID"
          default-expand-all
          :data="treeData"
          :props="treeProps"
          show-checkbox
          :style="{ height: treeHeight, overflow: 'auto' }"
          highlight-current
          :expand-on-click-node="true"
        ></el-tree>

        <!-- <ComCheckboxTree
          ref="asideRef"
          :treeHeight="treeHeight"
          :treeData="treeData"
          :title="'车间级信息'"
          :nodekey="'OrganizeID'"
          :treeProps="treeProps"
          @handleNodeClick="handleNodeClick"
        /> -->
      </div>
    </div>

    <el-dialog title="BOM列表" :visible.sync="dialogShow" width="90%">
      <ComSearch
        class="margin_bottom_10"
        ref="searchRef"
        :searchData="formSearchs[1].datas"
        :searchForm="formSearchs[1].forms"
        :remark="1"
        :isLoading="isLoading[1]"
        :btnForm="btnForm[1]"
        :Region="Region[1]"
        @btnClick="btnClick"
      />
      <ComUmyTable
        :rowKey="'RowNumber'"
        :height="'600px'"
        :tableData="tableData[1]"
        :tableHeader="tableColumns[1]"
        :tableLoading="tableLoading[1]"
        :remark="1"
        :sysID="1185"
        :showPagination="false"
        :isEdit="isEdit"
        :isClear="isClear[1]"
        :pagination="tablePagination[1]"
        @pageChange="pageChange"
        @pageSize="pageSize"
        @sortChange="sortChange"
      />
    </el-dialog>

    <!-- 新增产品弹框 -->
    <ComFormDialog
      ref="productForm"
      :title="'新增产品'"
      :dialogShow="productDialog"
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
import ComVxeTable from "@/components/ComVxeTable";
import ComUmyTable from "@/components/ComUmyTable";
import {
  GetHeader,
  GetSearchData,
  ExportData,
  SaveData,
  GetOrgData,
  UpdateProcess,
} from "@/api/Common";
import ComFormDialog from "@/components/ComFormDialog";
import ComCheckboxTree from "@/components/ComCheckboxTree";
import { mapState } from "vuex";
export default {
  name: "ProductInfo",
  components: {
    ComSearch,
    ComVxeTable,
    ComFormDialog,
    ComUmyTable,
    ComCheckboxTree,
  },
  data() {
    return {
      productDialog: false,
      formData: {
        MaterialID: "",
        MaterialName: "",
        MaterialType: "",
        Model: "",
        Code: "",
        CustomerCode: "",
        Trademark: "",
        Extend1: "",
        Status: 1,
        dicID: 12,
        Extend2: "",
        Extend1: "",
        Weight: "",
        Unit: "",
        Extend4: "",
      },
      formController: [
        {
          label: "类型",
          prop: "Extend2",
          type: "input",
        },
        {
          label: "客户",
          prop: "Extend1",
          type: "input",
        },
        { label: "料号", prop: "Code", type: "input" },
        {
          label: "名称",
          prop: "MaterialName",
          type: "input",
        },
        {
          label: "类型",
          prop: "MaterialType",
          type: "select",
          select: [
            { label: "成品", value: "成品" },
            { label: "组件", value: "组件" },
            { label: "零件", value: "零件" },
            { label: "半成品", value: "半成品" },
            { label: "原材料", value: "原材料" },
          ],
        },
        { label: "单重g", prop: "Weight", type: "input" },
        { label: "材质", prop: "Extend4", type: "input" },
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
        MaterialType: [
          { required: true, message: "料品类型未必填项", trigger: "change" },
        ],
        MaterialName: [
          { required: true, message: "名称为必填项", trigger: "blur" },
        ],
        Code: [{ required: true, message: "料号为必填项", trigger: "blur" }],
      },
      //////////////左侧树节点//////////////
      adminLoading: false,
      treeData: [],
      treeProps: {
        label: "OrganizeName",
        children: "children",
      },
      clickData: [],
      ////////////////// Search /////////////////
      loseCategory: 1,
      ProcessGroupID: "",
      dialogShow: false,
      categorys: [],
      title: this.$route.meta.title,
      title2: "配置类型",
      MaterialType: "",
      materialTypes: [
        { label: "成品" },
        { label: "半成品" },
        { label: "原材料" },
        { label: "整机" },
      ],
      drawer: false,
      delData: [[]],
      isLoading: [false, false],
      hasSelect: [false, false],
      Region: [6, 6],
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
        [
          {
            ButtonCode: "save",
            BtnName: "保存",
            Type: "success",
            Ghost: true,
            Size: "small",
            Methods: "dataTreeSave",
            Icon: "",
          },
        ],
      ],
      btnForm: [[], []],
      tableData: [[], []],
      tableColumns: [[], []],
      tableLoading: [false, false],
      isClear: [false, false],
      tablePagination: [
        { pageIndex: 1, pageSize: 30, pageTotal: 0 },
        { pageIndex: 1, pageSize: 50, pageTotal: 0 },
      ],
      height: "707px",
      treeHeight: "765px",
      showPagination: true,
      tagRemark: 0,
      isEdit: false,
      clickData: {},
      selectionData: [[], []],
      Status1: [
        { label: "类型配置", title: "配置类型" },
        { label: "产线配置", title: "配置拉线" },
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
    this.getCategoryData();
    this.judgeBtn();
    this.getTableHeader();
    this.getOrgData();
  },
  mounted() {
    setTimeout(() => {
      this.setHeight();
    }, 450);
  },
  methods: {
    // 获取线别组织
    async getOrgData() {
      this.treeData = [];
      let form = {
        dicID: 3026,
        OrganizeID: this.userInfo.OrganizeID,
        Status: 1,
        OrganizeIDs: this.userInfo.CenterID,
      };
      let res = await GetOrgData(form);
      const { result, data, count, msg } = res.data;
      if (result) {
        this.treeData = data;
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
    },
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
          let newData = [];
          routeBtn.forEach((x) => {
            if (x.ButtonCode == "edit") {
              permission = true;
            }
            if (this.parmsBtn[i].length != 0) {
              newData = this.parmsBtn[i].filter((y) => {
                return x.ButtonCode == y.ButtonCode;
              });
            }
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
      this.treeHeight = document.documentElement.clientHeight - 180 + "px";
      let headHeight = this.$refs.headRef.offsetHeight;

      let rem =
        document.documentElement.clientHeight -
        headHeight -
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
    // 导出
    async dataExport(remarkTb) {
      this.adminLoading = true;
      let form = JSON.parse(JSON.stringify(this.formSearchs[remarkTb].datas));
      form["rows"] = 0;
      let res = await ExportData(form);
      this.isLoading[remarkTb] = false;
      this.adminLoading = false;
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
      }, 300);
    },
    // 重置
    dataReset(remarkTb) {
      for (let name in this.formSearchs[remarkTb].datas) {
        if (name != "dicID") {
          if (this.formSearchs[remarkTb].forms.length) {
            // 判断是否是页面显示的查询条件，是的字段才清空
            this.formSearchs[remarkTb].forms.forEach((element) => {
              if (element.prop === name) {
                this.formSearchs[remarkTb].datas[name] = null;
              }
            });
          }
        }
      }
    },
    // 保存
    async dataSave(remarkTb, index) {
      this.adminLoading = true;

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
        this.adminLoading = false;
      } else {
        this.$set(this.btnForm[remarkTb][index], "isLoading", false);
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
        this.adminLoading = false;
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
        this.$set(this.btnForm[remarkTb][index], "isLoading", false);
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
        this.adminLoading = false;
        this.$set(this.btnForm[remarkTb][index], "isLoading", false);
      }
    },
    // 获取表头数据
    async getTableHeader() {
      let IDs = [{ ID: 1180 }, { ID: 1185 }];
      let res = await GetHeader(IDs);
      const { datas, forms, result, msg } = res.data;
      if (result) {
        // 获取每个表头
        datas.some((m, i) => {
          m.forEach((n, index) => {
            // 进行验证
            this.verifyData(n);
            if (n.children && n.children.length != 0) {
              n.children.forEach((x) => {
                this.verifyData(x);
              });
            }
            if (index === 1) {
              this.tablePagination[i]["pageSize"] = n["pageSize"];
              this.hasSelect[i] = n["IsSelect"];
              this.Region[i] = n["Region"] ? n["Region"] : this.Region[i];
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
    // 确定配置
    sureConfig() {
      if (this.selectionData[0].length == 0) {
        this.$message.error("请选择要配置类型的产品！");
      } else if (!this.MaterialType) {
        this.$message.error("请选择料品类型！");
      } else {
        this.selectionData[0].forEach((x) => {
          x.MaterialType = this.MaterialType;
        });
        this.generalSaveData(this.selectionData[0], 0);
      }
    },
    // 切换缺失工艺
    clickitem(val) {
      val == this.loseCategory
        ? (this.loseCategory = 0)
        : (this.loseCategory = 1);
      if (this.loseCategory == 0) {
        this.formSearchs[0].datas["ProcessCount"] = 0;
      } else {
        this.formSearchs[0].datas["ProcessCount"] = "";
      }
      this.dataSearch(0);
    },
    // 获取工艺
    async getCategoryData() {
      let res = await GetSearchData({ dicID: 1175 });
      const { result, data, count, msg } = res.data;
      if (result) {
        this.categorys = data;
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
    },
    // 配置工艺
    configCategory() {
      if (!this.ProcessGroupID) {
        this.$message.error("请选择要配置的工艺！");
      } else {
        if (this.selectionData[0].length == 0) {
          this.$message.error("请选择要配置工艺的产品！");
        } else {
          this.selectionData[0].some((x, i) => {
            let obj = {
              materialID: x.MaterialID,
              processGroupID: this.ProcessGroupID,
            };
            this.submitData(obj, i);
          });
        }
      }
    },
    // 提交配置的工艺
    async submitData(obj, i) {
      let res = await UpdateProcess(obj);
      const { result, data, count, msg } = res.data;
      if (result) {
        if (i == this.selectionData[0].length - 1) {
          this.$message({
            message: msg,
            type: "success",
            dangerouslyUseHTMLString: true,
          });
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
    // 切换产线配置
    changeStatus(item, index) {
      this.title2 = item.title;
      this.labelStatus1 = index;
    },
    // 选中产线判断多选单选
    judgeNum(data, node) {
      this.clickData = data;
    },
    // 确定主线
    sureConfigHost() {
      let lines = this.$refs.rightTreeRef.getCheckedNodes().filter((x) => {
        return x.OrganizeTypeID == 6;
      });
      if (lines.length == 0) {
        this.$message.error("请勾选右侧的线别！");
      } else if (lines.length > 1) {
        this.$message.error("主线仅能选择一条生产线，请检查一下！");
      } else if (this.selectionData[0].length == 0) {
        this.$message.error("请勾选左侧需要配置的产品！");
      } else {
        this.selectionData[0].forEach((x) => {
          let childrens = lines;
          childrens[0]["MaterialID"] = x.MaterialID;
          childrens[0]["Type"] = "主";
          childrens[0]["ProcessID"] = "P202106171344021";
          childrens[0]["dicID"] = 124;
          this.$set(x, "childrens", childrens);
        });
        console.log(this.selectionData[0]);
        this.generalSaveData(this.selectionData[0], 0);
      }
    },
    // 确定辅线
    sureConfigVice() {
      let lines = this.$refs.rightTreeRef.getCheckedNodes().filter((x) => {
        return x.OrganizeTypeID == 6;
      });
      if (lines.length == 0) {
        this.$message.error("请勾选右侧的线别！");
      } else if (this.selectionData[0].length == 0) {
        this.$message.error("请勾选左侧需要配置的产品！");
      } else {
        this.selectionData[0].forEach((x) => {
          let childrens = lines;
          childrens.forEach((y) => {
            y["MaterialID"] = x.MaterialID;
            y["Type"] = "辅";
            y["ProcessID"] = "P202106171344021";
            y["dicID"] = 124;
          });
          this.$set(x, "childrens", childrens);
        });
        this.generalSaveData(this.selectionData[0], 0);
      }
    },
    // 打开新增弹框
    openDialog() {
      this.productDialog = true;
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
          _this.$refs.productForm.$refs.formData.resetFields();
        } else {
          this.$message({
            message: msg,
            type: "error",
            dangerouslyUseHTMLString: true,
          });
          _this.$refs.productForm.$refs.formData.resetFields();
        }
        this.productDialog = false;
      } else {
        _this.$refs.productForm.$refs.formData.resetFields();
        _this.productDialog = false;
      }
    },
  },
};
</script>
