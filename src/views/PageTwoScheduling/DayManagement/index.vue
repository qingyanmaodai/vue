<!--组织信息-->
<template>
  <div class="container" v-loading="adminLoading">
    <div class="admin_container" style="width: 100%">
      <div class="admin_head" ref="headRef">
        <ComSearch
          ref="searchRef"
          :searchData="formSearchs[0].datas"
          :searchForm="formSearchs[0].forms"
          :remark="0"
          :btnForm="btnForm"
          @btnClick="btnClick"
        />
      </div>
      <div>
        <div class="admin_content">
          <div class="ant-table-title">
            <el-row>
              <el-col :span="2">
                <span class="title">{{ title }}</span>
              </el-col>
              <el-col :span="22" class="flex_flex_end">
                <div
                  :class="labelStatus1 == y ? 'statusActive cursor' : 'cursor'"
                  v-for="(item, y) in Status1"
                  :key="y"
                >
                  <span @click="changeStatus(item, y)">{{ item.label }}</span>
                  <el-divider direction="vertical"></el-divider>
                </div>
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
            :hasSelect="true"
            :isEdit="isEdit"
            :showFooter="true"
            :includeFields="includeFields"
            :cellStyle="cellStyle"
            :tableRowClassName="tableRowClassName"
            :isClear="isClear[0]"
            :showPagination="false"
            :pagination="tablePagination[0]"
            @pageChange="pageChange"
            @pageSize="pageSize"
            @selectfun="selectFun"
            @sortChange="sortChange"
          />
        </div>
      </div>
    </div>
    <el-dialog
      title="改线"
      :visible.sync="lineDialog"
      width="30%"
      :close-on-click-modal="false"
    >
      <div>
        <el-select
          v-model="LineValue"
          clearable
          filterable
          placeholder="选择线别"
        >
          <el-option
            v-for="(item, i) in Status1"
            :key="i"
            :label="item.OrganizeName"
            :value="item.OrganizeID"
          ></el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="lineDialog = false" size="small">取 消</el-button>
        <el-button type="primary" @click="sureLine" size="small"
          >确 认 改 线</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      title="调单"
      :visible.sync="sortDialog"
      width="60%"
      :close-on-click-modal="false"
    >
      <div>
        <div class="flex margin_bottom_10">
          <span class="flex_shrink dialog_label">1.请填写目标行：</span>
          <el-input
            type="number"
            v-model="SN"
            size="small"
            style="width: 120px; margin: 0 20px 0 10px"
          ></el-input>
          <el-button size="small" type="primary" plain @click="SearchSN"
            >查 找</el-button
          >
        </div>
        <div class="margin_bottom_10">
          <vxe-table
            ref="vxeTable_1"
            border
            show-overflow
            highlight-current-row
            highlight-hover-row
            height="80px"
            size="mini"
            resizable
            auto-resize
          >
            <vxe-column
              v-for="(x, z) in dialogHeader[0]"
              :key="z"
              :resizable="true"
              :field="x.prop"
              :title="x.label"
              :min-width="x.width"
              :fixed="x.fix"
            >
            </vxe-column>
          </vxe-table>
        </div>
        <div class="flex_between margin_bottom_10">
          <span class="flex_shrink"
            >2.确认调整对象（{{ dialogData[1].length }}笔）：</span
          >
          <el-button type="warning" size="small" @click="addRow" plain
            >添加</el-button
          >
        </div>
        <div>
          <vxe-table
            ref="vxeTable_2"
            border
            show-overflow
            highlight-current-row
            highlight-hover-row
            height="300px"
            size="mini"
            resizable
            auto-resize
          >
            <vxe-column
              v-for="(x, z) in dialogHeader[1]"
              :key="z"
              :resizable="true"
              :field="x.prop"
              :title="x.label"
              :min-width="x.width"
              :fixed="x.fix"
            >
              <template slot-scope="scope">
                <span v-if="x.component">
                  <span v-if="x.component.type == 'select'">
                    <el-select
                      filterable
                      clearable
                      :multiple="x.component.multiple"
                      :disabled="scope.row['EditDisabled']"
                      value-key="label"
                      v-model="scope.row[x.prop]"
                      size="mini"
                    >
                      <el-option
                        v-for="x2 in scope.row[x.component.prop]"
                        :key="x2.value"
                        :label="x2.label"
                        :value="x2"
                      ></el-option>
                    </el-select>
                  </span>
                </span>
                <span
                  v-else
                  v-html="scope.row[x.propName ? x.propName : x.prop]"
                ></span>
              </template>
            </vxe-column>
            <vxe-column width="80px">
              <template slot-scope="scope">
                <el-button
                  plain
                  type="danger"
                  @click="delRow(scope.row, scope.$rowIndex)"
                  >删除</el-button
                >
              </template>
            </vxe-column>
          </vxe-table>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <span class="dialog_notive"
          >注意：以上订单行会调整到目标行下方，同时柜号也会更改，插入到两个不同柜号中间可以自行调整</span
        >
        <el-button @click="cancelChangeSort" size="small">取 消</el-button>
        <el-button type="primary" @click="sureChangeSort" size="small"
          >确 认 调 整</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
var _this;
import XLSX from "xlsx";
import ComSearch from "@/components/ComSearch";
import ComAsideTree from "@/components/ComAsideTree";
import ComVxeTable from "@/components/ComVxeTable";
import {
  GetHeader,
  GetSearchData,
  ExportData,
  SaveData,
  GetOrgData,
} from "@/api/Common";
import ComFormDialog from "@/components/ComFormDialog";
import { mapState } from "vuex";
export default {
  name: "DayManagement",
  components: {
    ComSearch,
    ComAsideTree,
    ComVxeTable,
    ComFormDialog,
  },
  data() {
    return {
      LineValue: "",
      SN: "",
      lineDialog: false,
      sortDialog: false,
      includeFields: [], // 包含合计的字段
      labelStatus1: 0,
      Status1: [],
      title: this.$route.meta.title,
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
          BtnName: "选线",
          Type: "primary",
          Ghost: true,
          Size: "small",
          Methods: "lineData",
          Icon: "",
        },
        {
          ButtonCode: "save",
          BtnName: "调序",
          Type: "primary",
          Ghost: true,
          Size: "small",
          Methods: "sortData",
          Icon: "",
        },
        {
          ButtonCode: "save",
          BtnName: "暂停",
          Type: "danger",
          Ghost: true,
          Size: "small",
          Methods: "parseData",
          Icon: "",
        },
        {
          ButtonCode: "save",
          BtnName: "保存",
          Type: "success",
          Ghost: true,
          Size: "small",
          Methods: "saveData",
          Icon: "",
        },
      ],
      selectionData: [[], []],
      btnForm: [],
      tableData: [[], []],
      tableColumns: [[], []],
      tableLoading: [false, false],
      isClear: [false, false],
      tablePagination: [{ pageIndex: 1, pageSize: 0, pageTotal: 0 }],
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
      sysID: [{ ID: 42 }],
      userInfo: {},
      dialogData: [[], []],
      dialogHeader: [
        [
          {
            label: "行号",
            prop: "SN",
            width: "80px",
          },
          {
            label: "SAP订单号",
            prop: "GroupCabinet",
            width: "120px",
          },
          {
            label: "SAP代码",
            prop: "SaleTo",
            width: "120px",
          },
          {
            label: "规格型号",
            prop: "SalesOrderNo",
            width: "150px",
          },
          {
            label: "批量",
            prop: "MaterialName",
            width: "80px",
          },
        ],
        [
          {
            label: "当前行",
            prop: "SN",
            width: "80px",
          },
          {
            label: "目标行",
            prop: "SN2",
            width: "80px",
          },
          {
            label: "SAP订单号",
            prop: "GroupCabinet",
            width: "120px",
          },
          {
            label: "SAP代码",
            prop: "SaleTo",
            width: "120px",
          },
          {
            label: "规格型号",
            prop: "SalesOrderNo",
            width: "150px",
          },
          {
            label: "批量",
            prop: "MaterialName",
            width: "80px",
          },
        ],
      ],
      startNum: 0,
    };
  },
  computed: {},
  created() {
    _this = this;
    this.userInfo = this.$store.getters.userInfo;
    this.judgeBtn();
    this.getTableHeader();
    this.getLinesData();
  },
  mounted() {
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
          if (element.SupplierName.indexOf(value) > -1) {
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
      this.$set(this, "btnForm", newBtn);
      this.$set(this, "isEdit", permission);
    },
    // 高度控制
    setHeight() {
      this.treeHeight = document.documentElement.clientHeight - 150 + "px";
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
            if (n.children && n.children.length != 0) {
              n.children.forEach((x) => {
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
        this.dataSearch(0);
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
    // 获取标签页的线别
    async getLinesData() {
      let form = {};
      form["rows"] = 0;
      form["dicID"] = 36;
      form["OrganizeTypeID"] = 6;
      form["OrganizeIDs"] = this.userInfo.CenterID;
      let res = await GetSearchData(form);
      const { result, data, count, msg } = res.data;
      this.adminLoading = false;
      if (result) {
        if (data.length != 0) {
          data.forEach((a) => {
            this.$set(a, "label", a.OrganizeName);
            this.$set(a, "value", a.OrganizeID);
          });
        }
        this.Status1 = data;
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
    // 选择数据
    selectFun(data, remarkTb, row) {
      this.selectionData[remarkTb] = data;
    },
    tableRowClassName({ row, rowIndex }) {},
    // 行内列样式
    cellStyle({ row, column }) {},
    // 改变状态
    changeStatus(x, index) {
      this.labelStatus1 = index;
      this.formSearchs[0].datas["IsReplyStatusOther"] = x.value;
      this.dataSearch(0);
    },
    // 选线
    lineData() {
      if (this.selectionData[0].length == 0) {
        this.$message.error("请选择需要改线的数据！");
        return;
      }
      this.lineDialog = true;
    },
    // 确定选线
    sureLine() {
      this.selectionData[0].forEach((a) => {
        this.$set(a, "LineID", this.LineValue);
      });
      this.lineDialog = false;
    },
    // 调序
    sortData() {
      this.sortDialog = true;
      // 打开就把选中的数据放进需要调整的行
      if (this.selectionData[0].length != 0) {
        if (this.dialogData[1].length == 0) {
          this.$set(this.dialogData, 1, this.selectionData[0]);
        } else {
          this.selectionData[0].forEach((y) => {
            let newIndex = -1;
            newIndex = this.dialogData[1].findIndex(
              (x) => x.SalesOrderDetailID == y.SalesOrderDetailID
            );
            if (newIndex == -1) {
              this.dialogData[1].push(y);
            }
          });
        }
      }
      this.SearchSN();
    },
    // 查找目标行
    SearchSN() {
      if (!this.SN) {
        // this.$message.error("请输入目标行！");
      } else {
        let newRow = this.tableData[0].filter((x) => {
          return x.SN == this.SN;
        });
        this.$set(this.dialogData, 0, []);
        this.$set(this.dialogData, 0, newRow);
        if (this.dialogData[1].length != 0) {
          this.dialogData[1].forEach((x) => {
            x.SN2 = this.SN;
            x["GroupCabinets"] = prop;
            this.$set(x, "EditDisabled", EditDisabled);
            x.NewGroupCabinet = NewGroupCabinet;
          });
        } else {
          this.$message.error("暂未找到该目标行，请确认当前页是否有这行数据！");
        }
      }
      this.$nextTick(() => {
        _this.$refs.vxeTable_1.reloadData(this.dialogData[0]);
        _this.$refs.vxeTable_2.reloadData(this.dialogData[1]);
      });
    },
    // 添加
    addRow() {
      this.sortDialog = false;
    },
    // 删除行
    delRow(row, index) {
      this.dialogData[1].splice(index, 1);
    },
    // 确定调整顺序
    sureChangeSort() {
      if (this.dialogData[0].length == 0) {
        this.$message.error("请填写目标行再调整！");
      } else if (this.dialogData[1].length == 0) {
        this.$message.error("请选择需要调整的数据！");
      } else {
        let newData = JSON.parse(JSON.stringify(this.dialogData[1]));
        // 先删除有的，在push新的
        let newTableData = this.tableData[0].filter(
          (x) => !newData.some((y) => y.SN == x.SN)
        );
        let newIndex = newTableData.findIndex((z) => z.SN == this.SN);
        // 把arr2 变成一个适合splice的数组（包含splice前2个参数的数组）
        newData.unshift(newIndex + 1, 0);
        Array.prototype.splice.apply(newTableData, newData);
        let startNum = this.startNum;
        newTableData.forEach((z) => {
          this.$set(z, "SN", startNum);
          startNum++;
        });
        this.$set(this.tableData, 0, []);
        this.$set(this.tableData, 0, newTableData);
        this.sortDialog = false;
      }
    },
    // 暂停计划
    parseData() {},
    // 更新计划
    SaveData() {},
    cancelChangeSort() {
      // this.SN = '';
      // this.$set(this.dialogData,0,[]);
      // this.$set(this.dialogData,1,[]);
      this.sortDialog = false;
    },
  },
};
</script>
