<!--菜单设置-->
<template>
  <div
    class="container"
    v-loading="adminLoading"
  >
    <div
      class="admin_head"
      ref="headRef"
    >
      <ComSearch
        v-for="(item,i) in Status1"
        :key="i"
        v-show="labelStatus1 == i"
        ref="searchRef"
        :searchData="formSearchs[i].datas"
        :searchForm="formSearchs[i].forms"
        :remark="i"
        :isLoading="isLoading"
        :signName="labelStatus1"
        :btnForm="btnForm"
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
          v-for="(item,i) in Status1"
          :key="i"
          v-show="labelStatus1 == i"
          :rowKey="'RowNumber'"
          :height="height"
          :tableData="tableData[i]"
          :tableHeader="tableColumns[i]"
          :tableLoading="tableLoading[i]"
          :remark="i"
          :sysID="sysID[i].ID"
          :isEdit="isEdit"
          :isClear="isClear[i]"
          :pagination="tablePagination[i]"
          @pageChange="pageChange"
          @pageSize="pageSize"
          @sortChange="sortChange"
          @handleRowClick="handleRowClick"
        />
      </div>
    </div>

    <el-dialog
      title="导入工序产能"
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
import {
  GetHeader,
  GetSearchData,
  ExportData,
  SaveData,
  SysCapacity,
  UpdateImportCapaticy,
} from "@/api/Common";
export default {
  name: "ImportCapaticy",
  components: {
    ComSearch,
    ComVxeTable,
  },
  data() {
    return {
      labelStatus1: 0,
      Status1: [
        { label: "临时表", value: 0 },
        { label: "正式表", value: 1 },
      ],
      dialogImport: false,
      adminLoading: false,
      sysID: [{ ID: 7928 }, { ID: 15 }],
      ////////////////// Search /////////////////
      title: "产能配置",
      drawer: false,
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
      btnForm: [],
      delData: [[], []],
      parmsBtn: [
        {
          BtnName: "导入",
          ButtonCode: "import",
          Type: "primary",
          Ghost: true,
          Size: "small",
          Methods: "dataImport",
          Icon: "",
          signName: 0,
        },
        {
          ButtonCode: "import",
          BtnName: "更新",
          Type: "success",
          Ghost: true,
          Size: "small",
          Methods: "refreshData",
          Icon: "",
          signName: 0,
        },
        {
          ButtonCode: "save",
          BtnName: "保存",
          Type: "success",
          Ghost: true,
          Size: "small",
          Methods: "dataSave",
          Icon: "",
          signName: 1,
        },
        {
          ButtonCode: "delete",
          BtnName: "删除",
          Type: "danger",
          Ghost: true,
          Size: "small",
          Methods: "dataDel",
          Params: { dataName: "delData" },
          signName: 1,
          Icon: "",
        },
      ],
      tableData: [[], []],
      tableColumns: [[], []],
      tableLoading: [false, false],
      isClear: [false, false],
      tablePagination: [
        { pageIndex: 1, pageSize: 100, pageTotal: 0 },
        { pageIndex: 1, pageSize: 100, pageTotal: 0 },
      ],
      height: "707px",
      showPagination: true,
      tagRemark: 0,
      isLoading: false,
      isEdit: true,
      isUpdate: true,
      fileList: [],
      file: [],
    };
  },
  watch: {},
  created() {
    _this = this;
    this.judgeBtn();
    this.getTableHeader();
  },
  mounted() {
    setTimeout(() => {
      this.setHeight();
    }, 350);
  },
  methods: {
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
    // 修改自身id的字段属性
    oneselftSysID(val) {
      this.DictionaryID = val;
      this.formSearchs[0].datas["dicID"] = 35;
      this.$set(this.formSearchs[0].datas, "DictionaryID", val);
      this.dataSearch(0);
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
    // 保存
    async dataSave(remarkTb, index) {
      let submitData = [];
      if (this.isUpdate && this.tableData[remarkTb].length != 0) {
        this.tableData[remarkTb].forEach((x) => {
          if (x.update) {
            submitData.push(x);
          }
        });
      } else {
        submitData = this.tableData[remarkTb];
      }
      this.adminLoading = true;
      let res = await SaveData(submitData);
      const { datas, forms, result, msg } = res.data;
      if (result) {
        this.$message({
          message: msg,
          type: "success",
          dangerouslyUseHTMLString: true,
        });
        this.adminLoading = false;
        this.dataSearch(remarkTb);
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
        this.adminLoading = false;
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
            if (n.childrens && n.children.length != 0) {
              n.childrens.forEach((x) => {
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
        this.$set(this.formSearchs[0].datas, "DictionaryID", this.DictionaryID);
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
      let newForm = JSON.parse(JSON.stringify(form));
      if (!newForm.DictionaryID) {
        newForm.DictionaryID = this.DictionaryID;
        this.formSearchs[0].DictionaryID = this.DictionaryID;
      }
      let res = await GetSearchData(newForm);
      const { result, data, count, msg } = res.data;
      if (result) {
        this.$set(this.tableData, remarkTb, data);
        this.$set(this.tablePagination[remarkTb], "pageTotal", count);
        this.$set(this.tableLoading, remarkTb, false);
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
        this.$set(this.tableLoading, remarkTb, false);
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
    // 单击行
    handleRowClick(row, remarkTb) {
      this.delData[remarkTb] = [];
      this.delData[remarkTb].push(row);
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
        this.$confirm("确定要导入工序产能吗？")
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
          debugger;
          obj["Remark1"] = m["料号"];
          obj["ProcessID"] = m["工序"];
          obj["Capacity"] = m["时产能"];
          obj["StandardPeoples"] = m["标准人力"];
          obj["Efficiency"] = m["效率"];
          obj["dicID"] = this.sysID[0].ID;
          DataList.push(obj);
        });
        let res = await SysCapacity(DataList);
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
    changeStatus(x, index) {
      this.labelStatus1 = index;
      if (index == 1 && this.tableData[1].length == 0) {
        this.dataSearch(1);
      }
    },
    // 更新产能
    async dataUpdate() {
      this.adminLoading = true;
      let res = await SaveData(this.tableData[0]);
      const { datas, forms, result, msg } = res.data;
      if (result) {
        this.refreshData();
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
       this.adminLoading = false;
    },
    // 更新
    async refreshData() {
      let res = await UpdateImportCapaticy(this.tableData[0]);
      const { datas, forms, result, msg } = res.data;
      if (result) {
        this.adminLoading = false;
        this.$message({
          message: msg,
          type: "success",
          dangerouslyUseHTMLString: true,
        });
        this.labelStatus1 = 1;
        this.dataSearch(1);
        this.$set(this.tableData, 0, []);
      } else {
        this.adminLoading = false;
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
    },
  },
};
</script>