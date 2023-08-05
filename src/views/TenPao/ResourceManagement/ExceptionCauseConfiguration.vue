<!--组装日计划-->
<template>
  <div class="container flex_flex content_height" v-loading="adminLoading">
    <div class="flex_column aside" v-if="showAside">
      <div
        class="admin_left_2 border-b-1 flex_column"
        style="height: 100%; width: 100%"
      >
        <div class="flex px-2 py-1.5 border-b-1 tree_Head">
          <span class="tree_text">异常分类</span>
          <div class="flex_flex_end flex-1">
            <el-input
              size="mini"
              clearable
              v-model="OrganizeName"
              placeholder="搜索"
              suffix-icon="el-icon-search"
              class="w2/3 cx_margin_right1"
            ></el-input>
            <!-- <el-dropdown @command="handleCommand" class="flex_inline">
              <img src="../../../assets/svg/dot.svg" />
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="1">展开全部</el-dropdown-item>
                <el-dropdown-item command="2">折叠全部</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown> -->
          </div>
        </div>
        <el-tree
          class="tree-line flex_grow"
          :indent="0"
          ref="asideTree"
          node-key="AbnormalType"
          style="overflow: auto"
          :data="treeData"
          :props="treeProps"
          highlight-current
          :expand-on-click-node="false"
          @node-click="handleNodeClick"
          :filter-node-method="filterNode"
        ></el-tree>
      </div>
    </div>
    <div class="admin_container_2 flex_column" style="flex-grow: 0">
      <div class="admin_head" ref="headRef">
        <div
          v-for="i in [0, 1, 2, 3]"
          :key="i"
          v-show="Number(selectedIndex) === i"
        >
          <ComSearch
            ref="searchRef"
            :searchData="formSearchs[i].datas"
            :searchForm="formSearchs[i].forms"
            :remark="i"
            :isLoading="isLoading"
            :btnForm="btnForm"
            :signName="labelStatus1"
            @btnClick="btnClick"
          />
        </div>
      </div>
      <div class="ant-table-title pd-6-6-0">
        <el-row>
          <el-col :span="4"
            ><span class="title">{{ title }}</span></el-col
          >
          <el-col :span="20" class="flex_flex_end">
            <!-- 新增行所需组件 -->
            <div>
              <span>新增行数：</span>
              <el-input-number
                v-model.trim="addNum"
                :min="1"
                :max="100"
                :step="10"
                placeholder="请输入"
              ></el-input-number>
            </div>
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
      <div
        class="admin_content flex_grow"
        v-for="item in [0, 1, 2, 3]"
        :key="item"
        v-show="Number(selectedIndex) === item"
      >
        <ComVxeTable
          :ref="`tableRef${item}`"
          :rowKey="'RowNumber'"
          height="100%"
          :tableData="tableData[item]"
          :tableHeader="tableColumns[item]"
          :tableLoading="tableLoading[item]"
          :remark="item"
          :sysID="sysID[item]['ID']"
          :hasSelect="hasSelect[item]"
          :isEdit="isEdit[item]"
          :isClear="isClear[item]"
          :keepSource="true"
          :pagination="tablePagination[item]"
          @pageChange="pageChange"
          @pageSize="pageSize"
          @sortChange="sortChange"
          @selectfun="selectFun"
        />
      </div>
    </div>
  </div>
</template>

<script>
var _this;
const GCsheets = GC.Spread.Sheets;
import "@grapecity/spread-sheets-vue";
import GC from "@grapecity/spread-sheets";
import "@grapecity/spread-sheets/styles/gc.spread.sheets.excel2013white.css";
import "@grapecity/spread-sheets/js/zh.js";
GC.Spread.Common.CultureManager.culture("zh-cn");
import XLSX from "xlsx";
import ComSearch from "@/components/ComSearch";
import ComAsideTree from "@/components/ComAsideTree";
import ComVxeTable from "@/components/ComVxeTable";
import ComReportTable from "@/components/ComReportTable";
import ComSpreadTable from "@/components/ComSpreadTable";
import { HeaderCheckBoxCellType } from "@/static/data.js";
import {
  GetHeader,
  GetSearchData,
  ExportData,
  GetSearch,
  SaveData,
  GetServerTime,
  GetOrgData,
} from "@/api/Common";
import ComFormDialog from "@/components/ComFormDialog";
export default {
  name: "ExceptionCauseConfiguration",
  components: {
    ComSearch,
    ComAsideTree,
    ComVxeTable,
    ComReportTable,
    ComFormDialog,
    ComSpreadTable,
  },
  data() {
    return {
      PODeliveryDate: "",
      selectedIndex: "0",
      isLoading: false,
      hasSelect: [true, true, true, true],
      footerLabel: [""],
      height1: "360px",
      labelStatus1: 0,
      Status1: [
        { label: "全部", value: "" },
        { label: "未复期", value: "未复期" },
        { label: "复期不满足", value: "复期不满足" },
        { label: "逾期未交", value: "逾期未交" },
      ],
      //////////////左侧树节点//////////////
      showAside: true,
      ReplyDate: "",
      treeProps: {
        label: "SumCount",
        children: "children",
      },
      treeData: [],
      treeData1: [],
      treeListTmp: [],
      ////////////////// Search /////////////////
      title: this.$route.meta.title,
      delData: [[]],
      formSearchs: [
        {
          datas: {},
          forms: [],
          required: [], //获取必填项
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
      selectionData: [[], [], [], []],
      btnForm: [],
      tableData: [[], [], [], []],
      tableColumns: [[], [], [], []],
      tableLoading: [false, false, false, false],
      isClear: [false, false, false, false],
      tablePagination: [
        { pageIndex: 1, pageSize: 1000, pageTotal: 0 },
        { pageIndex: 1, pageSize: 1000, pageTotal: 0 },
        { pageIndex: 1, pageSize: 1000, pageTotal: 0 },
        { pageIndex: 1, pageSize: 1000, pageTotal: 0 },
      ],
      tagRemark: 0,
      isEdit: false,
      clickData: [{}, {}],
      LineName: "",
      OrganizeName: "",
      adminLoading: false,
      dialogImport: false,
      fileList: [],
      file: [],
      sysID: [{ ID: 7770 }, { ID: 7908 }, { ID: 7915 }, { ID: 7910 }],
      userInfo: {},
      spread: [],
      addNum: 1,
      DataSourceList: [{}],
    };
  },
  computed: {},
  created() {
    _this = this;
    this.userInfo = this.$store.getters.userInfo;
    // 获取所有按钮
    this.btnForm = this.$route.meta.btns;
    this.judgeBtn(this.btnForm);
    this.getTableHeader();
  },
  watch: {
    OrganizeName(val) {
      this.$refs.asideTree.filter(val);
    },
  },

  mounted() {
    setTimeout(() => {
      this.setHeight();
    }, 500);
  },
  methods: {
    judgeBtn(routeBtn) {
      if (routeBtn && routeBtn.length > 0)
        routeBtn.some((item, index) => {
          if (item.ButtonCode == "save") {
            this.$set(this, "isEdit", true);
          }
        });
      this.$set(this, "btnForm", routeBtn);
    },
    //获取子组件实例
    // workbookInitialized: function (workbook, remarkTb) {
    //   this.spread[remarkTb] = workbook;
    // },
    // //获取当前选中行的值
    // selectChanged(newValue, remarkTb) {
    //   // 在子组件计算属性发生变化时，更新父组件的计算属性
    //   this.selectionData[remarkTb] = newValue;
    // },
    searchTree(msg) {
      this.treeData = [];
      let treeListTmp = JSON.parse(JSON.stringify(this.treeListTmp));
      let tmp = msg
        ? this.rebuildData(msg, treeListTmp)
        : JSON.parse(JSON.stringify(treeListTmp));
      this.treeData.push(...tmp);
    },
    // rebuildData(value, arr) {
    //   if (!arr) {
    //     return [];
    //   }
    //   let newarr = [];
    //   if (Object.prototype.toString.call(arr) === "[object Array]") {
    //     arr.forEach((element) => {
    //       if (element.SupplierName.indexOf(value) > -1) {
    //         // const ab = this.rebuildData(value, element.children);
    //         const obj = {
    //           ...element,
    //           children: element.children,
    //         };
    //         newarr.push(obj);
    //       } else {
    //         if (element.children && element.children.length > 0) {
    //           const ab = this.rebuildData(value, element.children);
    //           const obj = {
    //             ...element,
    //             children: ab,
    //           };
    //           if (ab && ab.length > 0) {
    //             newarr.push(obj);
    //           }
    //         }
    //       }
    //     });
    //   }
    //   return newarr;
    // },
    // 导出
    async dataExport(remarkTb) {
      this.adminLoading = true;
      let form = JSON.parse(JSON.stringify(this.formSearchs[remarkTb].datas));
      form["rows"] = 0;
      let res = await ExportData(form);
      this.adminLoading = false;
      this.$store.dispatch("user/exportData", res.data);
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
    // 获取供应商数据
    async getSupplierData() {
      this.treeData = [];
      this.treeListTmp = [];
      let form = {
        dicID: 7911,
      };
      let res = await GetSearchData(form);
      const { result, data, count, msg } = res.data;
      if (result) {
        if (data.length != 0) {
          data.forEach((a) => {
            a["SumCount"] = `${a.AbnormalType}(${a.Cnts})`;
          });
        }
        this.treeData = JSON.parse(JSON.stringify(data));
        // this.treeData.unshift({
        //   OrganizeID: -1,
        //   OrganizeName: "全部",
        // });
        console.log(this.treeData, "this.treeData");
        this.treeListTmp = this.treeData;
        // this.getTableData(
        //   this.formSearchs[this.selectedIndex].datas,
        //   Number(this.selectedIndex)
        // );
        if (data.length != 0) {
          this.$nextTick(function () {
            _this.$refs.asideTree.setCurrentKey(data[0].AbnormalType);
          });
          this.handleNodeClick(data[0]);
        }
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
    },
    // 高度控制
    setHeight() {
      // this.treeHeight = document.documentElement.clientHeight - 150 + "px";
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
    // 下拉选择事件
    handleCommand(val) {
      if (val == 1 && !this.isOpen) {
        this.isOpen = true;
        this.changeTreeNodeStatus(this.$refs.asideTreeRef.store.root);
      } else if (val == 2 && this.isOpen) {
        // 改变每个节点的状态
        this.isOpen = false;
        this.changeTreeNodeStatus(this.$refs.asideTreeRef.store.root);
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
    // 增行
    addRow(remarkTb) {
      // 获取修改记录
      const $table = this.$refs[`tableRef${remarkTb}`]?.[0].$refs.vxeTable;
      if (!this.addNum) {
        this.$message.error("请输入需要添加的行数!");
        return;
      }
      // 下拉数据是需要获取数据源
      for (let x = 0; x < this.addNum; x++) {
        let obj = {
          dicID: this.sysID[remarkTb]["ID"],
          RowNumber: _.uniqueId(),
        };
        this.tableColumns[remarkTb].map((item) => {
          obj[item.prop] = null;
          obj["update"] = true;
          if (item.prop === "Status") {
            obj[item.prop] = 1;
          }
          console.log(this.DataSourceList, "this.DataSourceList");
          for (let key in this.DataSourceList[remarkTb]) {
            if (item.DataSourceName === key) {
              obj[key] = this.DataSourceList[remarkTb][key];
            }
          }
        });

        console.log("this.addNum", this.addNum);
        $table.insert(obj);

        // this.tableData[remarkTb].unshift(obj);
      }

      console.log("this.tableData[remarkTb]", this.tableData[remarkTb]);
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
    async dataSave(remarkTb, index, parms, newData) {
      this.adminLoading = true;
      const $table = this.$refs[`tableRef${remarkTb}`]?.[0].$refs.vxeTable;
      // 获取修改记录
      let changeRecords = [];
      if (newData) {
        changeRecords = newData;
      } else {
        if ($table) {
          const { insertRecords, updateRecords, removeRecords } =
            $table.getRecordset();
          changeRecords = insertRecords.concat(updateRecords, removeRecords);
        } else {
        }
      }
      if (changeRecords.length == 0) {
        this.$set(this, "adminLoading", false);
        this.$message.error("当前数据没做修改，请先修改再保存！");
        return;
      }
      if (changeRecords.length > 0) {
        if (this.formSearchs[remarkTb].required.length) {
          // 动态检验必填项
          changeRecords.map((item1, index1) => {
            this.formSearchs[remarkTb].required.map((item2, index2) => {
              let content = item1[item2["prop"]];
              if (!content && (content !== 0) & (content !== false)) {
                this.$message.error(`${item2["label"]}不能为空，请选择`);
                this.$set(this, "adminLoading", false);
                throw new Error("报错了");
              }
            });
          });
        }
      }
      let res = await SaveData(changeRecords);
      const { datas, forms, result, msg } = res.data;
      if (result) {
        this.$message({
          message: msg,
          type: "success",
          dangerouslyUseHTMLString: true,
        });
        this.dataSearch(remarkTb);
        this.$set(this, "adminLoading", false);
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
        this.$set(this, "adminLoading", false);
      }
    },
    // 全部下达
    async releaseOrders(remarkTb, index) {
      let submitData = [];
      if (this.selectionData[remarkTb].length == 0) {
        this.$message.error("请选择需要提交的数据！");
        return;
      } else {
        if (
          !this.selectionData[remarkTb].every(
            (obj) =>
              obj.hasOwnProperty("PlanDeliveryDate") && obj.PlanDeliveryDate
          )
        ) {
          // 显示错误消息
          this.$message.error("有订单没有填写计划交期!");
          return;
        }
        let res = await GetSearch(
          this.selectionData[remarkTb],
          "/APSAPI/OrderTaskDownload"
        );
        const { datas, forms, result, msg } = res.data;
        if (result) {
          this.$message({
            message: msg,
            type: "success",
            dangerouslyUseHTMLString: true,
          });
          this.dataSearch(remarkTb);
          this.$set(this, "adminLoading", false);
        } else {
          this.$message({
            message: msg,
            type: "error",
            dangerouslyUseHTMLString: true,
          });
          this.$set(this, "adminLoading", false);
        }
      }
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.AbnormalType.indexOf(value) !== -1;
    },
    //批量设置日期
    async changeDate(val) {
      if (val == 0) {
        if (this.selectionData[0].length === 0) {
          this.$message.error("请选择需要提交的数据！");
          return;
        }
        if (!this.PODeliveryDate) {
          this.$message.error("请填写复期时间");
          return;
        }
        this.selectionData[0].map((item) => {
          this.$set(item, "PODeliveryDate", this.PODeliveryDate);
        });
        // let res = await GetSearch(
        //   this.selectionData[1],
        //   "/APSAPI/OrderTaskDownload"
        // );
        // const { datas, forms, result, msg } = res.data;
        // if (result) {
        //   this.$message({
        //     message: msg,
        //     type: "success",
        //     dangerouslyUseHTMLString: true
        //   });
        //   this.dataSearch(1);
        //   this.$set(this, "adminLoading", false);
        // } else {
        //   this.$message({
        //     message: msg,
        //     type: "error",
        //     dangerouslyUseHTMLString: true
        //   });
        //   this.$set(this, "adminLoading", false);
        // }
      }
    },
    // 删除
    async dataDel(remarkTb, index, parms) {
      let res = null;
      let newData = [];
      if (this.selectionData[remarkTb].length == 0) {
        this.$message.error("请单击需要操作的数据！");
        return;
      } else {
        this.selectionData[remarkTb].forEach((x) => {
          let obj = x;
          obj["ElementDeleteFlag"] = 1;
          newData.push(obj);
        });
      }
      this.$confirm("确定要删除的【" + newData.length + "】数据吗？")
        .then((_) => {
          _this.dataSave(remarkTb, index, null, newData);
        })
        .catch((_) => {});
    },
    // 通用直接保存
    // async generalSaveData(newData, remarkTb, index) {
    //   if (newData.length == 0) {
    //     this.$message.error("没有提交保存的数据！");
    //     return;
    //   }
    //   this.adminLoading = true;
    //   let res = await SaveData(newData);
    //   const { result, data, count, msg } = res.data;
    //   if (result) {
    //     this.dataSearch(remarkTb);
    //     this.adminLoading = false;
    //     this.$message({
    //       message: msg,
    //       type: "success",
    //       dangerouslyUseHTMLString: true
    //     });
    //   } else {
    //     this.adminLoading = false;
    //     this.$message({
    //       message: msg,
    //       type: "error",
    //       dangerouslyUseHTMLString: true
    //     });
    //   }
    // },
    // 获取表头数据
    async getTableHeader() {
      let IDs = this.sysID;
      let res = await GetHeader(IDs);
      const { datas, forms, result, msg } = res.data;
      if (result) {
        // 获取每个表头
        datas.some((m, i) => {
          m.forEach((n, index) => {
            if (n.prop == "Operation" || n.label == "操作") {
              this.newTag = index;
              return true;
            }
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
            }

            //从列获取下拉数据源
            if (n.DataSourceID && n.ControlType === "combobox") {
              this.DataSourceList[i] = {
                [n.DataSourceName]: n.items,
                ...this.DataSourceList[i],
              };
            }
            if (n.Required) {
              this.formSearchs[i].required.push(n);
            }
          });
          this.$set(this.tableColumns, i, m);
          this.$set(
            this.formSearchs[i]["datas"],
            "Accounts",
            this.userInfo.Account
          );
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
        this.getSupplierData();
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
      const { result, data, count, msg, Columns } = res.data;
      if (result) {
        // 获取每个表头
        Columns.some((m, i) => {
          m.forEach((n, index) => {
            this.$set(this.tableColumns, remarkTb, m);
          });
        });
        this.$set(this.tableData, remarkTb, data);
        this.$set(this.tablePagination[remarkTb], "pageTotal", count);
        // this.setData(remarkTb);
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
      this.$set(this.tableLoading, remarkTb, false);
    },
    // 渲染数据
    setData(remarkTb) {
      //sheet获取
      this.spread[remarkTb].suspendPaint();
      let sheet = this.spread[remarkTb].getActiveSheet();
      // 重置表单
      sheet.reset();
      sheet.options.allowCellOverflow = true;
      sheet.defaults.rowHeight = 23;
      sheet.defaults.colWidth = 100;
      sheet.defaults.colHeaderRowHeight = 23;
      sheet.defaults.rowHeaderColWidth = 60;
      sheet.setDataSource(this.tableData[remarkTb]);

      // 渲染列
      this.tableColumns[remarkTb].forEach((x, y) => {
        x["name"] = x["prop"];
        x["displayName"] = x["label"];
        x["width"] = parseInt(x.width);
        if (x.prop === "isChecked") {
          // 选框
          sheet.setCellType(
            0,
            0,
            new HeaderCheckBoxCellType(),
            GCsheets.SheetArea.colHeader
          );
          x.cellType = new GC.Spread.Sheets.CellTypes.CheckBox();
        } else if (
          x.ControlType === "comboboxMultiple" ||
          x.ControlType === "combobox"
        ) {
          this.tableData[remarkTb].map((item, index) => {
            if (x.DataSourceID && x.DataSourceName) {
              let newData = item[x.DataSourceName]; // 设置列表每行下拉菜单
              // 获取要绑定下拉菜单的单元格对象
              let cell = sheet.getCell(index, y);
              // 创建下拉菜单单元格类型，并设置其选项数据
              let comboBox = new GC.Spread.Sheets.CellTypes.ComboBox();
              comboBox.editorValueType(
                GC.Spread.Sheets.CellTypes.EditorValueType.value
              );
              comboBox.editable(true);
              // 获取下拉菜单的选项数据
              comboBox.items(newData);
              comboBox.itemHeight(24);
              // 将下拉菜单单元格类型绑定到指定的单元格中
              cell.cellType(comboBox);
            }
          });
        } else if (x.ControlType === "checkbox") {
          let cellType = new GC.Spread.Sheets.CellTypes.CheckBox();
          cellType.caption("");
          cellType.textTrue("");
          cellType.textFalse("");
          cellType.textIndeterminate("");
          cellType.textAlign(
            GC.Spread.Sheets.CellTypes.CheckBoxTextAlign.center
          );
          cellType.isThreeState(false);
          sheet.getCell(-1, y).cellType(cellType);
        } else if (
          x.DataType == "datetime" ||
          x.DataType === "varchar" ||
          x.DataType === "nvarchar"
        ) {
          x.formatter = "@";
        }

        //行，start,end
        if (x.isEdit) {
          sheet.getCell(-1, y).locked(false).foreColor("#2a06ecd9");
        }
      });
      //渲染列
      sheet.bindColumns(this.tableColumns[remarkTb]); //此方法一定要放在setDataSource后面才能正确渲染列名

      // 列筛选
      // 参数2 开始列
      // 参数3
      // 参数4 结束列
      let cellrange = new GC.Spread.Sheets.Range(
        -1,
        -1,
        -1,
        this.tableColumns[remarkTb].length
      );
      let hideRowFilter = new GC.Spread.Sheets.Filter.HideRowFilter(cellrange);
      sheet.rowFilter(hideRowFilter);

      var defaultStyle = new GC.Spread.Sheets.Style();
      defaultStyle.font =
        "12px basefontRegular, Roboto, Helvetica, Arial, sans-serif";
      defaultStyle.hAlign = GC.Spread.Sheets.HorizontalAlign.left;
      defaultStyle.vAlign = GC.Spread.Sheets.HorizontalAlign.center;
      defaultStyle.borderLeft = new GC.Spread.Sheets.LineBorder(
        "gray",
        GC.Spread.Sheets.LineStyle.thin
      );
      defaultStyle.borderTop = new GC.Spread.Sheets.LineBorder(
        "gray",
        GC.Spread.Sheets.LineStyle.thin
      );
      defaultStyle.borderRight = new GC.Spread.Sheets.LineBorder(
        "gray",
        GC.Spread.Sheets.LineStyle.thin
      );
      defaultStyle.borderBottom = new GC.Spread.Sheets.LineBorder(
        "gray",
        GC.Spread.Sheets.LineStyle.thin
      );

      defaultStyle.showEllipsis = true;
      sheet.setDefaultStyle(defaultStyle, GC.Spread.Sheets.SheetArea.viewport);

      // 冻结第一列
      if (this.tableColumns[remarkTb][0]["FixCount"]) {
        // 冻结
        sheet.frozenColumnCount(this.tableColumns[remarkTb][0].FixCount);
      }

      this.spread[remarkTb].options.tabStripVisible = false; //是否显示表单标签
      //改变字体颜色
      this.tableData[remarkTb].forEach((row, rowIndex) => {
        this.tableColumns[remarkTb].forEach((column, columnIndex) => {
          const key = column.prop;

          // // 获取当前单元格
          // const cell = sheet.getCell(rowIndex, columnIndex);
          // if (row["IsToMainPlan"] && row["IsToMainPlan"] === "已排") {
          //   cell.locked(true);
          // }
          // if (row["Result"] !== "正常" && row["Result"] && columnIndex < 5) {
          // }
        });
      });

      sheet.options.isProtected = true;
      sheet.options.protectionOptions.allowResizeColumns = true;
      sheet.options.protectionOptions.allowInsertRows = true;
      sheet.options.protectionOptions.allowDeleteRows = true;
      sheet.options.protectionOptions.allowSelectLockedCells = true;
      sheet.options.protectionOptions.allowSelectUnlockedCells = true;
      sheet.options.protectionOptions.allowDeleteColumns = true;
      sheet.options.protectionOptions.allowInsertColumns = true;
      sheet.options.protectionOptions.allowDargInsertRows = true;
      sheet.options.protectionOptions.allowDragInsertColumns = true;
      sheet.options.protectionOptions.allowSort = true;
      sheet.options.protectionOptions.allowFilter = true;
      sheet.options.allowUserDragDrop = true;
      /////////////////表格事件/////////////
      //绑定表格事件前，需清除之前的绑定事件
      this.spread[remarkTb].unbindAll();
      this.spread[remarkTb].bind(GCsheets.Events.ButtonClicked, (e, args) => {
        const { sheet, row, col } = args;
        const cellType = sheet.getCellType(row, col);
        if (cellType instanceof GCsheets.CellTypes.Button) {
        }
        if (cellType instanceof GCsheets.CellTypes.CheckBox) {
        }
        if (cellType instanceof GCsheets.CellTypes.HyperLink) {
        }
      });

      var insertRowsCopyStyle = {
        canUndo: true,
        name: "insertRowsCopyStyle",
        execute: function (context, options, isUndo) {
          var Commands = GC.Spread.Sheets.Commands;
          if (isUndo) {
            Commands.undoTransaction(context, options);
            return true;
          } else {
            sheet.suspendPaint();
            sheet.addRows(options.activeRow, _this.sheetSelectRows.length);
            //  sheet.setArray(options.activeRow, 0,_this.sheetSelectRows);
            //删除旧行
            if (_this.sheetSelectObj.start > options.activeRow) {
              //说明从下面插入上面
              sheet.copyTo(
                _this.sheetSelectObj.start + _this.sheetSelectRows.length,
                0,
                options.activeRow,
                0,
                _this.sheetSelectRows.length,
                sheet.getColumnCount(),
                GC.Spread.Sheets.CopyToOptions.style
              );
              sheet.setArray(options.activeRow, 0, _this.sheetSelectRows);
              sheet.deleteRows(
                _this.sheetSelectObj.start + _this.sheetSelectRows.length,
                _this.sheetSelectObj.count
              );
              // sheet.removeRow(_this.sheetSelectObj.start+ _this.sheetSelectRows.length)
            } else {
              //从上面往下面插入
              sheet.copyTo(
                _this.sheetSelectObj.start,
                0,
                options.activeRow,
                0,
                _this.sheetSelectRows.length,
                sheet.getColumnCount(),
                GC.Spread.Sheets.CopyToOptions.all
              );
              sheet.setArray(options.activeRow, 0, _this.sheetSelectRows);
              sheet.deleteRows(
                _this.sheetSelectObj.start,
                _this.sheetSelectObj.count
              );
            }
            sheet.resumePaint();

            return true;
          }
        },
      };

      this.spread[remarkTb]
        .commandManager()
        .register("insertRowsCopyStyle", insertRowsCopyStyle);

      function MyContextMenu() {}
      MyContextMenu.prototype = new GC.Spread.Sheets.ContextMenu.ContextMenu(
        this.spread[remarkTb]
      );
      MyContextMenu.prototype.onOpenMenu = function (
        menuData,
        itemsDataForShown,
        hitInfo,
        spread
      ) {
        itemsDataForShown.forEach(function (item, index) {
          if (item && item.name === "gc.spread.rowHeaderinsertCutCells") {
            item.command = "insertRowsCopyStyle";
          }
        });
      };
      var contextMenu = new MyContextMenu();
      this.spread[remarkTb].contextMenu = contextMenu;
      // 剪贴板事件绑定
      sheet.bind(
        GC.Spread.Sheets.Events.ClipboardChanged,
        function (sender, args) {
          let s = sheet.getSelections()[0];
          _this.sheetSelectRows = sheet.getArray(
            s.row,
            0,
            s.rowCount,
            _this.tableColumns[remarkTb].length
          );
          _this.sheetSelectObj.start = s.row;

          _this.sheetSelectObj.count = s.rowCount;
        }
      );

      //表格编辑事件
      this.spread[remarkTb].bind(
        GCsheets.Events.EditStarting,
        function (e, args) {}
      );
      this.spread[remarkTb].bind(
        GCsheets.Events.EditEnded,
        function (e, args) {}
      );
      this.spread[remarkTb].resumePaint();
      this.adminLoading = false;
      this.tableLoading[remarkTb] = false;
      setTimeout(() => {
        this.spread[remarkTb].refresh(); //重新定位宽高度
      });
    },
    // 单击线体
    handleNodeClick(data, node) {
      this.clickData[0] = data;
      this.formSearchs[this.selectedIndex].datas["AbnormalType"] =
        data.AbnormalType === "全部" ? "" : data.AbnormalType;
      this.dataSearch(this.selectedIndex);
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
      // if (
      //   this.selectionData[remarkTb].length === 1 &&
      //   this.labelStatus1 === 1
      // ) {
      //   const {
      //     OrderNo,
      //     Code,
      //     OProductionQty,
      //     SentQty,
      //     UnSentQty
      //   } = this.selectionData[remarkTb][0];
      //   let StringValue = `当前选定计划订单 ${OrderNo} 产品编码 ${Code} 生产数量 ${OProductionQty} 已下达数量 ${SentQty} 可下达数量 ${UnSentQty}`;
      //   this.$set(this.footerLabel, 1, StringValue);
      //   this.$set(
      //     this.selectionData[remarkTb][0],
      //     "DownDeilveryDate",
      //     this.selectionData[remarkTb][0]["PlanDeliveryDate"]
      //   );
      // } else {
      //   this.$set(this.footerLabel, remarkTb, "");
      // }
    },
    tableRowClassName({ row, rowIndex }) {
      // let className = "";
      // if (row["JudgeResult"] == "交期冲突") {
      //   className += "bgRedColor";
      // }
      // return className;
    },
    // 行内列样式
    cellStyle({ row, column }) {
      if (column.property == "PODeliveryDate" || column.property == "Remark") {
        return {
          background: "#00b0f0",
        };
      } else if (column.property == "ArriveQty") {
        return {
          color: "#00b0f0",
        };
      } else if (column.property == "UnaccountedQty") {
        return {
          color: "#ff0000",
        };
      }
      // else if (
      //   column.property == "JudgeResult" &&
      //   row["JudgeResult"] == "交期冲突"
      // ) {
      //   return {
      //     background: "red",
      //   };
      // }
      else if (
        (column.property == "JudgeResult" && row["JudgeResult"] == "满足") ||
        (column.property == "IsReplyStatusName" &&
          row["IsReplyStatusName"] == "是")
      ) {
        return {
          background: "#9fff9f",
        };
      }

      if (column.property == "OnloadQty") {
        return {
          color: "blue",
        };
      }
      if (column.property == "RealOweQty") {
        return {
          color: "red",
        };
      }
      if (
        column.property == "ReplyQty" &&
        parseFloat(row.ReplyQty) < parseFloat(row.RealOweQty)
      ) {
        return {
          background: "#ff7b7b",
        };
      }

      if (row.ReplyDate && !row.SecondReplyDate) {
        if (
          column.property == "ReplyDate" &&
          new Date(row.ReplyDate).getTime() > new Date(row.LastDate).getTime()
        ) {
          return {
            background: "#ff7b7b",
          };
        }
      }

      if (row.SecondReplyDate) {
        if (
          column.property == "SecondReplyDate" &&
          new Date(row.SecondReplyDate).getTime() >
            new Date(row.LastDate).getTime()
        ) {
          return {
            background: "#ff7b7b",
          };
        }
      }

      if (column.property == "OncheckQty") {
        if (
          parseFloat(row.OncheckQty) >=
          parseFloat(row.StockQtyAllocationPrepare)
        ) {
          return {
            background: "#9fff9f",
          };
        }
      }
    },
    // 改变状态
    changeStatus(item, index) {
      this.labelStatus1 = index;
      this.formSearchs[0].datas["ReplyStatus"] = item.value;
      // if (this.tableData[index].length == 0) {
      this.dataSearch(0);
      // }
    },
    handleClick(tab, event) {
      console.log(tab, event);
      this.formSearchs[this.selectedIndex].datas["WorkShopID"] =
        this.clickData[0]?.OrganizeID;
      this.formSearchs[this.selectedIndex].datas["LineID"] =
        this.clickData[1]?.OrganizeID;
      this.selectedIndex = tab.name;
      this.dataSearch(this.selectedIndex);
    },
    // 改变状态
    // changeStatus(x, index) {
    //   this.labelStatus1 = index;
    //   this.formSearchs[0].datas["IsClose"] = x.value;
    //   if (x.label === "生产任务单") {
    //     this.dataSearch(1);
    //   } else {
    //     this.dataSearch(0);
    //   }
    // },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-tabs__item {
  padding: 5px !important;
  /* 设置为0或调整合适的数值 */
}
.aside {
  width: 160px;
  border: 1px solid #b9b9b9;
}
</style>
