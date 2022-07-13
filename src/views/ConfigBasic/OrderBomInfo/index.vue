
<template>
  <div
    class="container flex_flex"
    v-loading="adminLoading"
  >
    <div class="admin_left_two">
      <div>
        <div class="flex px-2 py-1.5 border-b-1 tree_Head">
          <div class="flex_flex_end flex-1">
            <el-input
              size="mini"
              clearable
              v-model="formSearchs[0].datas.OrderNo"
              placeholder="单号"
              suffix-icon="el-icon-search"
              class="cx_margin_right1"
              disabled
            ></el-input>
            <el-button
              type="primary"
              size="mini"
              @click="searchTree"
            >查询</el-button>
            <!-- <el-button
              type="warning"
              size="mini"
              @click="copyTree"
            >复制</el-button> -->
            <el-dropdown
              @command="handleCommand"
              class="flex_inline"
            >
              <img src="../../../assets/svg/dot.svg" />
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="1">展开全部</el-dropdown-item>
                <el-dropdown-item command="2">折叠全部</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
        <el-tree
          v-loading="treeLoading"
          class="tree-line"
          :indent="0"
          ref="asideTree"
          :node-key="'MaterialID'"
          :default-expand-all="isOpen"
          :data="treeData"
          :props="treeProps"
          :style="{ height: '' + treeHeight + '', overflow: 'auto' }"
          highlight-current
          :expand-on-click-node="false"
          @node-click="handleNodeClick"
        ></el-tree>
      </div>
    </div>
    <div class="admin_container_right">
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
          <ComVxeTable
            :rowKey="'RowNumber'"
            :height="height"
            :tableData="tableData[0]"
            :tableHeader="tableColumns[0]"
            :tableLoading="tableLoading[0]"
            :remark="0"
            :hasSelect="true"
            :sysID="5021"
            :isEdit="isEdit"
            :isClear="isClear[0]"
            :pagination="tablePagination[0]"
            @handleRowClick="handleRowClick"
            @pageChange="pageChange"
            @pageSize="pageSize"
            @selectfun="selectFun"
            @sortChange="sortChange"
          />
        </div>
      </div>
    </div>

    <el-dialog
      title="订单列表"
      :visible.sync="dialogShow"
      width="70%"
      class="dialogForm"
    >
      <ComSearch
        v-show="dialogShow"
        class="margin_bottom_10"
        ref="searchRef1"
        :searchData="formSearchs[1].datas"
        :searchForm="formSearchs[1].forms"
        :remark="1"
        :isLoading="isLoading[1]"
        :btnForm="btnForm[1]"
        @btnClick="btnClick"
      />
      <ComUmyTable
        ref="addTable"
        :rowKey="'RowNumber'"
        :height="'500px'"
        :tableData="tableData[1]"
        :tableHeader="tableColumns[1]"
        :tableLoading="tableLoading[1]"
        :remark="1"
        :isMultiple="false"
        :sysID="49"
        :isClear="isClear[1]"
        :hasSelect="true"
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
          @click="dialogShow = false"
          size="small"
        >取 消</el-button>
        <el-button
          v-show="tag == 0"
          size="small"
          type="primary"
          @click="searchBom(0)"
        >添加至树形</el-button>
        <el-button
          v-show="tag == 1"
          size="small"
          type="primary"
          @click="copyBOM(0)"
        >确定复制BOM</el-button>
      </span>

    </el-dialog>

    <el-dialog
      title="物料列表"
      :visible.sync="dialogShow2"
      width="70%"
    >
      <ComSearch
        class="margin_bottom_10"
        ref="searchRef2"
        :searchData="formSearchs[2].datas"
        :searchForm="formSearchs[2].forms"
        :remark="1"
        :isLoading="isLoading[2]"
        :btnForm="btnForm[2]"
        @btnClick="btnClick"
      />
      <ComUmyTable
        :rowKey="'RowNumber'"
        :height="'600px'"
        :tableData="tableData[2]"
        :tableHeader="tableColumns[2]"
        :tableLoading="tableLoading[2]"
        :remark="2"
        :sysID="6750"
        :isEdit="isEdit"
        :isClear="isClear[2]"
        :hasSelect="true"
        :pagination="tablePagination[2]"
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
          size="small"
          type="primary"
          @click="sureAdd"
        >确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="导入BOM模板"
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
import ComVxeTable from "@/components/ComVxeTable";
import ComUmyTable from "@/components/ComUmyTable";
import {
  GetHeader,
  GetSearchData,
  ExportData,
  SaveData,
  GetSearch,
  GetOrderBomData,
  ImportOrderBOM,
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
      title: this.$route.meta.title,
      tag: 0,
      //////////////左侧树节点//////////////
      fileList: [],
      file: [],
      dialogImport: false,
      adminLoading: false,
      Value: "",
      isOpen: true,
      treeHeight: "",
      treeData: [],
      treeProps: {
        label: "MaterialName",
        children: "children",
      },
      clickData: [],
      asideData: [],
      ////////////////// Search /////////////////
      dialogShow: false,
      dialogShow2: false,
      drawer: false,
      delData: [[]],
      isLoading: [false, false, false],
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
            ButtonCode: "save",
            BtnName: "新增",
            Type: "primary",
            Ghost: true,
            Size: "small",
            Methods: "dataAdd",
            Icon: "",
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
          },
          {
            ButtonCode: "save",
            BtnName: "导入",
            Type: "primary",
            Ghost: true,
            Size: "small",
            Methods: "dataImport",
            Params: "",
            Icon: "",
          },
        ],
        [],
        [],
      ],
      btnForm: [[], [], []],
      tableData: [[], [], []],
      tableColumns: [[], [], []],
      tableLoading: [false, false, false],
      isClear: [false, false, false],
      tablePagination: [
        { pageIndex: 1, pageSize: 100, pageTotal: 0 },
        { pageIndex: 1, pageSize: 100, pageTotal: 0 },
        { pageIndex: 1, pageSize: 100, pageTotal: 0 },
      ],
      height: "707px",
      treeHeight: "765px",
      showPagination: true,
      tagRemark: 0,
      isEdit: false,
      clickData: {},
      selectionData: [[], [], []],
      labelStatus1: 0,
      treeLoading: false,
    };
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo,
    }),
  },
  created() {
    _this = this;
    this.judgeBtn();
    this.getTableHeader();
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
      }, 400);
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
      this.adminLoading = true;
      if (this.tableData[remarkTb].length != 0) {
        this.tableData[remarkTb].forEach((x) => {
          x.OweQty = x.DemandQty;
        });
      }
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
      let IDs = [{ ID: 5021 }, { ID: 49 }, { ID: 6750 }];
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
        this.tableColumns[2] = this.tableColumns[2].filter((x) => {
          return x.prop != "Extend21";
        });
        // this.getTableData(this.formSearchs[0].datas, 0);
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
    // 获取BOM数据
    async getBomData(OrderID) {
      this.treeLoading = true;
      let obj = { dicID: 5021, OrderID: OrderID, rows: 0 };
      let res = await GetOrderBomData(obj);
      const { result, data, count, msg } = res.data;
      if (result) {
        this.treeData = data;
        this.$message({
          message: "读取BOM成功",
          type: "success",
          dangerouslyUseHTMLString: true,
        });
        this.$set(this.tableData, 0, []);
        this.treeLoading = false;
        if (data.length != 0) {
          this.$nextTick(function () {
            _this.$refs.asideTree.setCurrentKey(data[0].MaterialID);
          });
          this.formSearchs[0].datas["ParentID"] = data[0].OrderBOMID;
          this.asideData = data[0];
          this.getTableData(this.formSearchs[0].datas, 0);
        }
      } else {
        this.treeLoading = false;
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
    },
    // 新增
    dataAdd() {
      if (!this.formSearchs[0].datas.OrderID) {
        this.$message.error("请先查询对应的工单才能新增！");
        return;
      }
      this.dataSearch(2);
      this.dialogShow2 = true;
    },
    // 保存返回结果自己处理事件
    async returnResultData(newData) {
      let res = await SaveData(newData);
      return res;
    },
    // 确定添加
    sureAdd() {
      if (this.selectionData[2].length == 0) {
        this.$message.error("请选择需要添加的数据！");
      } else {
        this.adminLoading = true;
        let submitData = [];
        this.selectionData[2].forEach((x) => {
          let obj = JSON.parse(JSON.stringify(x));
          obj["ParentID"] = this.asideData.OrderBOMID;
          obj["OrderID"] = this.formSearchs[0].datas.OrderID;
          obj["dicID"] = 98;
          obj["OrderBOMID"] = "";
          obj["ProductionStatus"] = 21;
          submitData.push(obj);
        });
        this.returnResultData(submitData).then((res) => {
          const { result, msg } = res.data;
          if (result) {
            this.adminLoading = false;
            this.dataSearch(0);
            this.searchBom(this.formSearchs[0].datas.OrderID);

            this.dialogShow2 = false;
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
          this.sureLoading = false;
        });
      }
    },
    // 单击获取子件
    handleNodeClick(data, node) {
      this.asideData = data;
      this.formSearchs[0].datas["ParentID"] = data.OrderBOMID;
      this.dataSearch(0);
    },
    // 下拉选择事件
    handleCommand(val) {
      if (val == 1 && !this.isOpen) {
        this.isOpen = true;
        this.changeTreeNodeStatus(this.$refs.asideTree.store.root);
      } else if (val == 2 && this.isOpen) {
        // 改变每个节点的状态
        this.isOpen = false;
        this.changeTreeNodeStatus(this.$refs.asideTree.store.root);
      }
    },
    // 改变节点状态
    changeTreeNodeStatus(node) {
      node.expanded = this.isOpen;
      for (let i = 0; i < node.childNodes.length; i++) {
        // 改变节点的自身expanded状态
        node.childNodes[i].expanded = this.isOpen;
        // 遍历子节点
        if (node.childNodes[i].childNodes.length > 0) {
          this.changeTreeNodeStatus(node.childNodes[i]);
        }
      }
    },
    // 查找订单
    searchTree() {
      this.tag = 0;
      this.dialogShow = true;
      if (this.tableData[1].length == 0) {
        this.dataSearch(1);
      }
    },
    // 复制订单
    copyTree() {
      if (!this.formSearchs[0].datas.OrderID) {
        this.$message.error("请选择一个订单再复制BOM！");
        return;
      }
      this.tag = 1;
      this.dialogShow = true;
      this.dataSearch(1);
    },
    // 添加至树形列表
    searchBom(OrderID) {
      if (OrderID) {
        this.treeData = [];
        this.getBomData(OrderID);
      } else {
        if (this.selectionData[1].length == 0) {
          this.$message.error("请选择需要添加的单号！");
        } else {
          this.treeData = [];
          this.formSearchs[0].datas.OrderNo = this.selectionData[1][0].OrderNo;
          this.formSearchs[0].datas.OrderID = this.selectionData[1][0].OrderID;
          let row = this.selectionData[1][0];
          this.getBomData(row.OrderID);
          this.dialogShow = false;
        }
      }
    },
    // 复制BOM
    async copyBOM() {
      if (this.selectionData[1].length == 0) {
        this.$message.error("请选择单号进行BOM复制！");
      } else {
        let res = await GetOrderBomData();
        const { result, data, count, msg } = res.data;
        if (result) {
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
      }
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
        this.$confirm("确定要导入这个BOM模板吗？")
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
          obj["Extend1"] = m["图号"];
          obj["Extend2"] = m["部件/零件名称"];
          obj["Extend3"] = m["规格"];
          obj["Extend4"] = m["唯一识别码"];
          obj["Extend5"] = m["上级"];
          obj["Extend6"] = m["上级料号"];
          obj["Extend7"] = m["PO单"];
          obj["Extend8"] = m["物料编码"];
          obj["DemandQty"] = m["数量"];
          obj["dicID"] = 5007;
          DataList.push(obj);
        });
        let res = await ImportOrderBOM(DataList);
        const { result, data, count, msg } = res.data;
        if (result) {
          this.adminLoading = false;
          if (this.formSearchs[0].datas.OrderID) {
            this.searchBom(this.formSearchs[0].datas.OrderID);
          }
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
  },
};
</script>