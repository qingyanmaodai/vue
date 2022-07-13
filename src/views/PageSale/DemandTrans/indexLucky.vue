<!--菜单设置-->
<template>
  <div class="container" v-loading="adminLoading">
    <div
      class="admin_head"
      ref="headRef"
    >
      <ComSearch
        ref="searchRef"
        :searchData="formSearchs[0].datas"
        :searchForm="formSearchs[0].forms"
        :remark="0"
        :isLoading="isLoading[0]"
        :btnForm="btnForm"
        @btnClick="btnClick"
        :signName="0"
        :defaultShow="false"
        v-show="labelStatus1 == 0"
      />
      <ComSearch
        ref="searchRef"
        :searchData="formSearchs[1].datas"
        :searchForm="formSearchs[1].forms"
        :remark="1"
        :isLoading="isLoading[1]"
        :btnForm="btnForm"
        @btnClick="btnClick"
        :signName="1"
        v-show="labelStatus1 == 1"
      />
      <ComSearch
        ref="searchRef"
        :searchData="formSearchs[2].datas"
        :searchForm="formSearchs[2].forms"
        :remark="2"
        :isLoading="isLoading[2]"
        :btnForm="btnForm"
        @btnClick="btnClick"
        :signName="2"
        v-show="labelStatus1 == 2"
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
        <div
          id="specialSheet"
          :style="{ height: height2, width: '100%' }"
          v-show="labelStatus1 == 0"
        ></div>
        <ComUmyTable
          :rowKey="'RowNumber'"
          :height="height"
          :tableData="tableData[1]"
          :tableHeader="tableColumns[1]"
          :tableLoading="tableLoading[1]"
          :remark="1"
          :sysID="6699"
          :hasSelect="isSelect"
          :isClear="isClear[1]"
          :pagination="tablePagination[1]"
          @pageChange="pageChange"
          @pageSize="pageSize"
          @sortChange="sortChange"
          v-show="labelStatus1 == 1"
        />
        <ComUmyTable
          :rowKey="'RowNumber'"
          :height="height"
          :tableData="tableData[2]"
          :tableHeader="tableColumns[2]"
          :tableLoading="tableLoading[2]"
          :remark="2"
          :sysID="6700"
          :hasSelect="isSelect"
          :isClear="isClear[2]"
          :pagination="tablePagination[2]"
          @pageChange="pageChange"
          @pageSize="pageSize"
          @sortChange="sortChange"
          v-show="labelStatus1 == 2"
        />
      </div>
    </div>
  </div>
</template>
<script>
import LuckyExcel from "luckyexcel";
import ComSearch from "@/components/ComSearch";
import ComUmyTable from "@/components/ComUmyTable";
import {
  GetHeader,
  GetHeaderTwo,
  GetSearchData,
  ExportData,
} from "@/api/Common";
import { SysData, SaveSalesPlanDay } from "@/api/PageSale";
export default {
  name: "DemandTrans",
  components: {
    ComSearch,
    ComUmyTable,
  },
  data() {
    return {
      ////////////////// Search /////////////////
      title: this.$route.meta.title,
      drawer: false,
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
      btnForm: [],
      parmsBtn: [
        {
          ButtonCode: "save",
          BtnName: "解析",
          Type: "primary",
          Ghost: true,
          Size: "small",
          Methods: "analySis",
          Icon: "",
          isLoading: false,
          signName: 0,
        },
        {
          ButtonCode: "save",
          BtnName: "处理",
          Type: "success",
          Ghost: true,
          Size: "small",
          Methods: "dataSave",
          Icon: "",
          isLoading: false,
          signName: 0,
        },
      ],
      tableData: [[], [], []],
      tableColumns: [[], [], []],
      tableLoading: [false, false, false],
      isClear: [false, false, false],
      tablePagination: [
        { pageIndex: 1, pageSize: 0, pageTotal: 0 },
        { pageIndex: 1, pageSize: 50, pageTotal: 0 },
        { pageIndex: 1, pageSize: 50, pageTotal: 0 },
      ],
      height: "707px",
      height2: "735px",
      showPagination: true,
      tagRemark: 0,
      isLoading: false,
      labelStatus1: 0,
      Status1: [
        { label: "导入数据", value: 0 },
        { label: "导入记录", value: 1 },
        { label: "异常数据", value: 2 },
      ],
      isSelect: false,
      isEdit: false,
      adminLoading:false
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
    this.judgeBtn();
    this.getTableHeader();
    // this.getHeaderTwo();
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
             if(newData.length != 0){
              newBtn = newBtn.concat(newData);
            }
        });
      }
      this.$set(this, "btnForm", newBtn);
      this.$set(this, "isEdit", permission);
    },
    // 高度控制
    setHeight() {
      let headHeight = this.$refs.headRef.offsetHeight;
      
      let rem =
        document.documentElement.clientHeight - headHeight - 
 this.$store.getters.reduceHeight;
      let newHeight = rem + "px";
      let newHeight2 = rem + 29 + "px";
      this.$set(this, "height", newHeight);
      this.$set(this, "height2", newHeight2);
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
      this.$set(this.tableLoading,remarkTb,true);
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
    //处理
    async dataSave(remarkTb, index) {
      
      let newData = luckysheet.getAllSheets();
      let realData = newData[0].data;
      if (realData.length == 0 || realData.length == 1) {
        this.$message.error("没有需要更新的数据!");
        return;
      } else {
        let setData = this.getLuckySheetData(realData); // 给0是为了判断是保存，每个数据都加上dicID
        let res = await SaveSalesPlanDay(setData);
        const { result, data, count, msg } = res.data;
        if (result) {
          
          this.dataSearch(0);
          this.$message({
            dangerouslyUseHTMLString: true,
            message: msg,
            type: "success",
          });
        } else {
          
          this.$message({
            dangerouslyUseHTMLString: true,
            message: msg,
            type: "error",
          });
        }
      }
    },
    // 获取表头数据
    async getTableHeader() {
      // 6679
      let IDs = [{ ID: 5156 }, { ID: 6699 }, { ID: 6670 }];
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
        this.getTableData(this.formSearchs[0].datas, 0);
      } else {
        this.$message({
                message: msg,
                type: "error",
                dangerouslyUseHTMLString: true,
              });
      }
    },
    // 获取导入的表头
    async getHeaderTwo() {
      let IDs = [{ ID: 6679 }];
      let res = await GetHeaderTwo(IDs);
      const { datas, forms, result, msg } = res.data;
      if (result) {
        jspreadsheetColumns[0] = datas[0];
      } else {
        this.$message({
                message: msg,
                type: "error",
                dangerouslyUseHTMLString: true,
              });
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
      this.$set(this.tableLoading,remarkTb,true);
      form["rows"] = this.tablePagination[remarkTb].pageSize;
      form["page"] = this.tablePagination[remarkTb].pageIndex;
      let res = await GetSearchData(form);
      const { result, data, count, msg } = res.data;
      if (result) {
        if (remarkTb == 0) {
          this.setLucklySheet(res.data);
        } else {
          this.$set(this.tableData, remarkTb, data);
          this.$set(this.tablePagination[remarkTb], "pageTotal", count);
        }
      } else {
        this.$message({
                message: msg,
                type: "error",
                dangerouslyUseHTMLString: true,
              });
      }
      this.$set(this.tableLoading,remarkTb,false);
    },
    setLucklySheet(res) {
      var lang = "zh";
      var options = null;
      options = {
        container: "specialSheet",
        lang: lang,
        forceCalculation: false,
        plugins: ["chart"],
        showinfobar: false,
        showtoolbar: false,
        showtoolbarConfig: false,
        functionButton: false,
        data: res.luckysheet.data,
        // fontList: [
        //   {
        //     fontName: "HanaleiFill",
        //     url: "./assets/iconfont/HanaleiFill-Regular.ttf",
        //   },
        //   {
        //     fontName: "Anton",
        //     url: "./assets/iconfont/Anton-Regular.ttf",
        //   },
        //   {
        //     fontName: "Pacifico",
        //     url: "./assets/iconfont/Pacifico-Regular.ttf",
        //   },
        // ]
      };
      this.$nextTick(() => {
        luckysheet.create(options);
      });
    },
    // 获取转换的json数据
    getLuckySheetData(realData, tag) {
      let setData = [];
      this.tableColumns[0].forEach((x) => {
        let newIndex = -1;
        for (var a2 in realData[0]) {
          var a = realData[0][a2];
          if (a && a.hasOwnProperty("v") && x.label.trim() == a.v) {
            newIndex = a2;
          }
        }
        x["newTag"] = newIndex;
      });
      realData.some((y, i) => {
        if (i != 0 && y[0]) {
          var obj = {};
          this.tableColumns[0].some((x, z) => {
            let newRemark = x.newTag;
            if (y[newRemark] && y[newRemark].hasOwnProperty("v")) {
              obj[x.prop] = y[newRemark].v;
              obj["dicID"] = 5156;
              obj["SN"] = i;
            }
          });
          setData.push(obj);
        }
      });
      return setData;
    },
    ////////////////其他事件///////////////
    // 改变状态
    changeStatus(item, index) {
      this.labelStatus1 = index;
      if (this.tableData[index].length == 0) {
        this.dataSearch(index);
      }
    },
    // 解析
    async analySis(remarkTb, index) {
      
      let setData = this.getLuckySheetData(realData); // 给0是为了判断是保存，每个数据都加上dicID
      let res = await SysData(setData);
      const { data, result, msg } = res.data;
      if (result) {
        
        this.$message({
                message: msg,
                type: "success",
                dangerouslyUseHTMLString: true,
              });
        jspreadsheettable[0].setData(data);
      } else {
        
        this.$message({
                message: msg,
                type: "error",
                dangerouslyUseHTMLString: true,
              });
      }
    },

    ////////////////////////////////lucklysheet事件/////////////////////
    uploadExcel(evt) {
      const files = evt.target.files;
      if (files == null || files.length == 0) {
        alert("No files wait for import");
        return;
      }

      let name = files[0].name;
      let suffixArr = name.split("."),
        suffix = suffixArr[suffixArr.length - 1];
      if (suffix != "xlsx") {
        alert("Currently only supports the import of xlsx files");
        return;
      }
      LuckyExcel.transformExcelToLucky(
        files[0],
        function (exportJson, luckysheetfile) {
          if (exportJson.sheets == null || exportJson.sheets.length == 0) {
            alert(
              "Failed to read the content of the excel file, currently does not support xls files!"
            );
            return;
          }
          window.luckysheet.destroy();

          window.luckysheet.create({
            container: "luckysheet", //luckysheet is the container id
            showinfobar: false,
            data: exportJson.sheets,
            title: exportJson.info.name,
            userInfo: exportJson.info.name.creator,
          });
        }
      );
    },
    selectExcel(evt) {
      const value = this.selected;
      const name = evt.target.options[evt.target.selectedIndex].innerText;

      if (value == "") {
        return;
      }
      this.isMaskShow = true;

      LuckyExcel.transformExcelToLuckyByUrl(
        value,
        name,
        (exportJson, luckysheetfile) => {
          if (exportJson.sheets == null || exportJson.sheets.length == 0) {
            alert(
              "Failed to read the content of the excel file, currently does not support xls files!"
            );
            return;
          }

          this.isMaskShow = false;
          window.luckysheet.destroy();

          window.luckysheet.create({
            container: "luckysheet", //luckysheet is the container id
            showinfobar: false,
            data: exportJson.sheets,
            title: exportJson.info.name,
            userInfo: exportJson.info.name.creator,
          });
        }
      );
    },
    downloadExcel() {
      const value = this.selected;

      if (value.length == 0) {
        alert("Please select a demo file");
        return;
      }

      var elemIF = document.getElementById("Lucky-download-frame");
      if (elemIF == null) {
        elemIF = document.createElement("iframe");
        elemIF.style.display = "none";
        elemIF.id = "Lucky-download-frame";
        document.body.appendChild(elemIF);
      }
      elemIF.src = value;
    },
  },
};
</script>