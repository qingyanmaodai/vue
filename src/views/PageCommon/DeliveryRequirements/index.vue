<!-- 送货计划 -->
<template>
  <div class="APSContainer" v-loading="adminLoading">
    <div class="admin_head" ref="headRef">
      <ComSearch
        ref="searchRef"
        :searchData="formSearchs[tagRemark].datas"
        :searchForm="formSearchs[tagRemark].forms"
        :remark="tagRemark"
        :isLoading="tableLoading[tagRemark]"
        :btnForm="btnForm"
        @btnClick="btnClick"
        :defaultShow="true"
        :signName="tabStatus"
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
              <div style="margin-right: 10px">
                <span>计算截止日期：</span>
                <el-date-picker
                  v-model="machineCycle"
                  type="date"
                  size="small"
                  value-format="yyyy-MM-dd"
                  placeholder="请选择"
                >
                </el-date-picker>
              </div>
              <div>
                <el-button
                  style="margin-right: 10px"
                  plain
                  v-for="(item, i) in parmsBtn2"
                  :key="i"
                  :type="item.Type ? item.Type : 'primary'"
                  :icon="item.Icon"
                  size="small"
                  @click="btnClick(item.Methods, item.Params, i)"
                >
                  {{ item.BtnName }}</el-button
                >
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="flex_column" :style="{ height: height }">
          <div class="spreadContainer" v-loading="tableLoading[tagRemark]">
            <gc-spread-sheets
              class="sample-spreadsheets"
              @workbookInitialized="initSpread"
            >
              <gc-worksheet></gc-worksheet>
            </gc-spread-sheets>
          </div>
        </div>
        <div class="flex_row_spaceBtn">
          <div>
            <span
              @click="toPageSetting(sysID[tagRemark].ID)"
              class="primaryColor cursor"
              >SysID:{{ sysID[tagRemark].ID }}
            </span>
          </div>
          <div class="flex">
            <el-pagination
              background
              @size-change="(val) => pageSize(val, 0)"
              :current-page="tablePagination[tagRemark].pageIndex"
              :page-sizes="[200, 500, 1000, 2000, 3000, 5000, 10000]"
              :page-size="tablePagination[tagRemark].pageSize"
              :total="tablePagination[tagRemark].pageTotal"
              @current-change="(val) => pageChange(val, 0)"
              layout="total, sizes, prev, pager, next,jumper"
            >
            </el-pagination>
          </div>
        </div>
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
import ComSearch from "@/components/ComSearch";
import {
  GetHeader,
  GetSearchData,
  ExportData,
  SaveData,
  GetSearch,
} from "@/api/Common";
import formatDate, { formatNextMonthDate } from "@/utils/formatDate";
import { HeaderCheckBoxCellType } from "@/static/data.js";
export default {
  name: "DeliveryRequirements",
  components: {
    ComSearch,
  },
  data() {
    return {
      machineCycle: "",
      title: this.$route.meta.title, //表名
      height: "740px",
      adminLoading: false, //加载状态
      tabStatus: 0,
      tagRemark: 0,
      btnForm: [], //拥有的按钮权限
      parmsBtn: [
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
          BtnName: "同步SRM",
          Type: "danger",
          Ghost: true,
          Size: "small",
          Methods: "syncSave",
          Icon: "",
        },
        {
          ButtonCode: "delete",
          BtnName: "删除",
          isLoading: false,
          Methods: "dataDel",
          Type: "danger",
          Icon: "",
          Size: "small",
        },
      ],
      // 表头添加动态按钮
      parmsBtn2: [
        {
          ButtonCode: "save",
          BtnName: "计算",
          Type: "primary",
          Ghost: true,
          Size: "small",
          Methods: "calculateSave",
          Icon: "",
        },
      ],
      formSearchs: [
        //不同标签页面的查询条件
        {
          datas: {}, //查询入参
          forms: [], // 页面显示的查询条件
        },
      ],
      tableData: [[]], //表格渲染数据,sysID有几个就有几个数组
      tableColumns: [[]], //表格表头列
      tableLoading: [false], //每个表加载
      isClear: [false],
      tablePagination: [
        //表分页参数
        { pageIndex: 1, pageSize: 2000, pageTotal: 0 },
      ],
      sysID: [{ ID: 8993 }],
      spread: null, //excel初始
      selectionData: [[]],
      filterParams: {
        col: -1,
      },
    };
  },
  activated() {
    if (this.spread) {
      this.spread.refresh();
    }
  },
  created() {
    _this = this;
    _this.adminLoading = true;
    _this.judgeBtn();
    _this.getTableHeader();
    // 计算周期默认时间：今天~1.5月
    //_this.machineCycle = [formatDate.formatTodayDate(),formatNextMonthDate()]
    console.log("roles", this.$store.getters.roles);
    // 判断登录接口缓存的当前登录账号的所拥有的角色，如果有R2103250001则作为Account登录账号的查询条件
    if (_this.$store.getters.roles.length) {
      _this.$store.getters.roles.forEach((item) => {
        if (item.RoleID === "R2103250001") {
          _this.formSearchs[_this.tagRemark].datas["Account"] = item.Account;
        }
      });
    }
  },
  mounted() {
    setTimeout(() => {
      this.setHeight();
    }, 350);
  },
  methods: {
    //初始化SpreadJS
    initSpread: function (spread) {
      this.spread = spread;
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
    // 高度控制
    setHeight() {
      let headHeight = this.$refs.headRef.offsetHeight;
      let rem =
        document.documentElement.clientHeight -
        headHeight -
        this.$store.getters.reduceHeight;
      let newHeight = rem + 33 + "px";
      this.$set(this, "height", newHeight);
    },
    // 跳转至属性配置
    toPageSetting(id) {
      this.$router.push({
        name: "FieldInfo",
        params: { ID: id },
      });
    },
    // 拥有什么按钮权限
    judgeBtn() {
      let routeBtn = this.$route.meta.btns;
      let newBtn = [];
      let btn2 = [];
      if (routeBtn.length != 0) {
        routeBtn.forEach((x) => {
          let newData = this.parmsBtn.filter((y) => {
            return x.ButtonCode == y.ButtonCode;
          });
          if (newData.length != 0) {
            newBtn = newBtn.concat(newData);
          }
          let newData2 = this.parmsBtn2.filter((y) => {
            return x.ButtonCode == y.ButtonCode;
          });
          if (newData2.length != 0) {
            btn2 = btn2.concat(newData2);
          }
        });
      }
      console.log("parmsBtn2", this.parmsBtn2);
      this.$set(this, "btnForm", newBtn);
      this.$set(this, "parmsBtn2", btn2);
    },
    // 获取表头
    async getTableHeader() {
      let IDs = this.sysID;
      let res = await GetHeader(IDs);
      const { datas, forms, result, msg } = res.data;
      if (result) {
        // 获取每个表头
        datas.some((m, i) => {
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
          this.getTableData(this.formSearchs[z].datas, z);
        });
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
    async getTableData(params, index) {
      this.$set(this.tableLoading, index, true);
      params["rows"] = this.tablePagination[index].pageSize;
      params["page"] = this.tablePagination[index].pageIndex;
      let res = await GetSearchData(params);
      const { result, data, count, msg } = res.data;
      if (result) {
        this.$set(this.tableData, index, data);
        this.$set(this.tablePagination[index], "pageTotal", count);
        this.setData();
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
      this.$set(this.tableLoading, index, false);
    },
    // excle表数据渲染
    async setData() {
      try {
        // 获取活动表单
        let sheet = this.spread.getActiveSheet();
        // 重置表单
        sheet.reset();
        // 渲染列
        let colInfos = [];
        let cellIndex = 0;
        this.tableColumns[this.tagRemark].forEach((x) => {
          colInfos.push({
            name: x.prop,
            displayName: x.label,
            size: parseInt(x.width),
          });
          cellIndex++;
        });
        // 列筛选
        // 参数2 开始列
        // 参数3
        // 参数4 结束列
        var cellrange = new GC.Spread.Sheets.Range(-1, -1, -1, cellIndex);
        var hideRowFilter = new GC.Spread.Sheets.Filter.HideRowFilter(
          cellrange
        );
        sheet.rowFilter(hideRowFilter);
        if (colInfos.length && colInfos[0].name === "isChecked") {
          // 选框
          sheet.setCellType(
            0,
            0,
            new HeaderCheckBoxCellType(),
            GCsheets.SheetArea.colHeader
          );
          let checkbox = {
            name: "isChecked",
            displayName: "选择",
            cellType: new GC.Spread.Sheets.CellTypes.CheckBox(),
            size: 80,
          };
          for (var name in checkbox) {
            colInfos[0][name] = checkbox[name];
          }
        }

        // 设置整个列头的背景色和前景色。
        /**
         * 参数1:表示行
         * 参数2:列，-1表示
         * 参数3:
         * 参数4:
         * 参数5:
         */
        let colHeaderStyle = sheet.getRange(
          0,
          -1,
          1,
          -1,
          GC.Spread.Sheets.SheetArea.colHeader
        );
        colHeaderStyle.foreColor("000000d9");
        colHeaderStyle.backColor("#f3f3f3");
        colHeaderStyle.font(
          "12px basefontRegular, Roboto, Helvetica, Arial, sans-serif"
        );
        colHeaderStyle.hAlign(GC.Spread.Sheets.HorizontalAlign.left);
        colHeaderStyle.vAlign(GC.Spread.Sheets.HorizontalAlign.left);

        //设置数据渲染的单元格默认的样式
        var defaultStyle = new GC.Spread.Sheets.Style();
        defaultStyle.font =
          "12px basefontRegular, Roboto, Helvetica, Arial, sans-serif";
        defaultStyle.hAlign = GC.Spread.Sheets.HorizontalAlign.left;
        defaultStyle.vAlign = GC.Spread.Sheets.HorizontalAlign.left;
        sheet.setDefaultStyle(
          defaultStyle,
          GC.Spread.Sheets.SheetArea.viewport
        );

        // 冻结列
        sheet.frozenColumnCount(this.tableColumns[0][1].FixCount);
        //渲染数据源
        sheet.setDataSource(this.tableData[this.tagRemark]);
        //渲染列
        sheet.bindColumns(colInfos); //此方法一定要放在setDataSource后面才能正确渲染列名
        this.spread.options.tabStripVisible = false; //是否显示表单标签
        // 事件
        let self = this;
        // 当前有排序规则进行排序
        if (self.filterParams && self.filterParams.col > -1) {
          // 参数1
          // 参数2
          // 参数3--排序行数
          // 参数4--排序列数量
          sheet.sortRange(-1, -1, -1, -1, true, [
            {
              index: self.filterParams.col,
              ascending: self.filterParams.ascending,
            },
          ]);
        }
        // 排序事件
        sheet.bind(GC.Spread.Sheets.Events.RangeSorting, function (e, info) {
          self.filterParams = info;
        });
      } catch (error) {
        console.log("表格渲染的错误信息:", error);
      }
      this.spread.refresh(); //重新定位宽高度
    },
    // 查询
    dataSearch(remarkTb) {
      this.tagRemark = remarkTb;
      this.tableData[remarkTb] = [];
      this.$set(this.tableLoading, remarkTb, true);
      this.tablePagination[remarkTb].pageIndex = 1;
      this.getTableData(this.formSearchs[remarkTb].datas, remarkTb);
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
    // 导出
    async dataExport(remarkTb) {
      this.adminLoading = true;
      let form = JSON.parse(JSON.stringify(this.formSearchs[remarkTb].datas));
      form["rows"] = 0;
      let res = await ExportData(form);
      this.adminLoading = false;
      this.$store.dispatch("user/exportData", res.data);
    },
    // 当前第几页
    pageChange(val, remarkTb) {
      this.$set(this.tablePagination[remarkTb], "pageIndex", val);
      this.getTableData(this.formSearchs[remarkTb].datas, remarkTb);
    },
    // 页数
    pageSize(val, remarkTb) {
      this.$set(this.tablePagination[remarkTb], "pageSize", val);
      this.getTableData(this.formSearchs[remarkTb].datas, remarkTb);
    },
    // 保存
    async dataSave(remarkTb) {
      let sheet = this.spread.getActiveSheet();
      let newData = sheet.getDirtyRows(); //获取修改过的数据
      let submitData = [];
      if (newData.length != 0) {
        newData.forEach((x) => {
          submitData.push(x.item);
        });
        this.adminLoading = true;
        let res = await SaveData(submitData);
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
      } else {
        this.$message.error("当前数据没做修改，请先修改再保存！");
      }
    },
    // 同步
    async syncSave() {
      this.adminLoading = true;
      let res = await GetSearch("", "/APSAPI/PushDeliveryData");
      const { result, data, count, msg } = res.data;
      try {
        if (result) {
          this.adminLoading = false;
          this.$message({
            message: msg,
            type: "success",
            dangerouslyUseHTMLString: true,
          });
          this.dataSearch(this.tagRemark);
        } else {
          this.adminLoading = false;
          this.$message({
            message: msg,
            type: "error",
            dangerouslyUseHTMLString: true,
          });
        }
      } catch (error) {
        if (error) {
          this.adminLoading = false;
        }
      }
    },
    // 计算
    async calculateSave() {
      let form = {
        StartDate: null,
        EndDate: _this.machineCycle,
      };
      this.adminLoading = true;
      let res = await GetSearch(form, "/APSAPI/CalculateDeliveryData");
      const { result, data, count, msg } = res.data;
      try {
        if (result) {
          this.adminLoading = false;
          this.$message({
            message: msg,
            type: "success",
            dangerouslyUseHTMLString: true,
          });
          this.dataSearch(this.tagRemark);
        } else {
          this.adminLoading = false;
          this.$message({
            message: msg,
            type: "error",
            dangerouslyUseHTMLString: true,
          });
        }
      } catch (error) {
        if (error) {
          this.adminLoading = false;
        }
      }
    },
    // 获取选中的数据
    getSelectionData() {
      let sheet = this.spread.getActiveSheet();
      let newData = sheet.getDataSource();
      this.selectionData[0] = [];
      if (newData.length != 0) {
        newData.forEach((x) => {
          if (x.isChecked) {
            this.selectionData[0].push(x);
          }
        });
      }
    },
    // 删除
    async dataDel(remarkTb, index, parms) {
      let newData = [];
      this.getSelectionData();
      if (this.selectionData[0].length == 0) {
        this.$message.error("请选择需要删除的数据！");
        return;
      } else if (this.selectionData[0].length) {
        this.selectionData[0].forEach((y) => {
          let obj = y;
          obj["ElementDeleteFlag"] = 1;
          newData.push(obj);
        });
        this.$confirm("确定要删除的【" + newData.length + "】数据吗？")
          .then((_) => {
            _this.dataSave(remarkTb, index, null, newData);
          })
          .catch((_) => {});
      }
    },
  },
};
</script>
