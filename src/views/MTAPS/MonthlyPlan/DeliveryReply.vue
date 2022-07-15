<!-- 交期回复 -->
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
        ref="searchRef"
        :searchData="formSearchs[currentIndex].datas"
        :searchForm="formSearchs[currentIndex].forms"
        :remark="currentIndex"
        :isLoading="tableLoading[currentIndex]"
        :btnForm="btnForm"
        @btnClick="btnClick"
        :defaultShow="true"
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
            </el-col>
          </el-row>
        </div>
        <div
          class="flex_column"
          :style="{'height':height}"
        >
          <div
            class="spreadContainer"
            v-loading="tableLoading[currentIndex]"
          >
            <gc-spread-sheets
              class="sample-spreadsheets"
              @workbookInitialized="initSpread"
            >
              <gc-worksheet></gc-worksheet>
            </gc-spread-sheets>

          </div>
        </div>
        <div  class="flex_row_spaceBtn">
          <div>
            <span
              @click="toPageSetting(sysID[currentIndex].ID)"
              class="primaryColor cursor"
              >SysID:{{ sysID[currentIndex].ID }}
            </span>
          </div>
          <div class="flex">
              <el-pagination
                background
                @size-change="val=>pageSize(val,0)"
                :current-page="tablePagination[currentIndex].pageIndex"
                :page-sizes="[
                200,
                500,
                1000,
                2000,
                3000,
                5000,
                10000
                ]"
                :page-size="tablePagination[currentIndex].pageSize"
                :total="tablePagination[currentIndex].pageTotal"
                @current-change="val=>pageChange(val,0)"
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
import { HeaderCheckBoxCellType } from "@/static/data.js";
import ComSearch from "@/components/ComSearch";
import {
  GetHeader,
  GetSearchData,
  GetSearch,
  ExportData,
} from "@/api/Common";
export default {
  name: "DeliveryReply",
  components: {
    ComSearch,
  },
  data() {
    return {
        title:this.$route.meta.title,//表名
        height:'740px',
        adminLoading:false,//加载状态
        currentIndex:0,//当前表下标
        tabStatus:0,
        btnForm: [],//拥有的按钮权限
        parmsBtn: [
          {
            BtnName: "保存",
            ButtonCode: "save",
            Type: "success",
            Ghost: true,
            Size: "small",
            Methods: "dataSave",
            Icon: "",
           },
        ],
        formSearchs:[//不同标签页面的查询条件
          {
            datas: {},//查询入参
            forms: [],// 页面显示的查询条件
          }
        ],
        tableData: [[]],//表格渲染数据,sysID有几个就有几个数组
        tableColumns: [[]],//表格表头列
        tableLoading:[false],//每个表加载
        isClear: [false],
        tablePagination: [//表分页参数
          { pageIndex: 1, pageSize: 1000, pageTotal: 0 },
        ],
        sysID:[{ID:6734}],
        tagRemark: 0,
        spread: null,//excel初始
    }
  },
  created() {
    _this = this;
    _this.judgeBtn();
    _this.getTableHeader()
  },
  activated() {
    this.spread.refresh();
  },
  mounted() {
    setTimeout(() => {
      this.setHeight();
    }, 350);
  },
  methods:{
    //初始化SpreadJS
    initSpread: function (spread) {
      console.log('spread',spread)
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
      console.log('routeBtn',routeBtn)
      let newBtn = [];
      if (routeBtn.length != 0) {
        routeBtn.forEach((x) => {
          let newData = this.parmsBtn.filter((y) => {
            return x.ButtonCode == y.ButtonCode;
          });
          if (newData.length != 0) {
            newBtn = newBtn.concat(newData);
          }
        });
      }
      this.$set(this, "btnForm", newBtn);
    },
    // 获取表头
    async getTableHeader() {
      let IDs = this.sysID;
      let res = await GetHeader(IDs);
      const { datas, forms, result, msg } = res.data;
      if (result) {
        // 获取每个表头
        console.log('datas',datas)
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
      } else {
        // this.adminLoading = false;
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
    },
    // 获取表格数据
    async getTableData(params,index){
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
      console.log('this.tableData',this.tableData)
    },
    // excle表数据渲染
    async setData() {
      try {
        // 获取活动表单
        let sheet = this.spread.getActiveSheet();
        // console.log('sheet0',sheet.getSheet(0))
        // 重置表单
        sheet.reset();
        // 渲染列
        let colInfos = []
        let colIndex = 0
        this.tableColumns[this.currentIndex].forEach((x,index) => {
          colInfos.push({
            name: x.prop,
            displayName: x.label,
            size: parseInt(x.width),
          });
          colIndex++
      });
      
        // 设置整个列头的背景色和前景色。
        /**
         * 参数1:表示行
         * 参数2:列，-1表示
         * 参数3:
         * 参数4:
         * 参数5:
         */
        let colHeaderStyle = sheet.getRange(0, -1, 1, -1, GC.Spread.Sheets.SheetArea.colHeader);
        colHeaderStyle.foreColor('000000d9')
        colHeaderStyle.backColor("#f3f3f3")
        colHeaderStyle.font("12px basefontRegular, Roboto, Helvetica, Arial, sans-serif")
        colHeaderStyle.hAlign(GC.Spread.Sheets.HorizontalAlign.center)
        colHeaderStyle.vAlign(GC.Spread.Sheets.HorizontalAlign.center)
        
        //设置数据渲染的单元格默认的样式
        var defaultStyle = new GC.Spread.Sheets.Style();
        defaultStyle.font = "12px basefontRegular, Roboto, Helvetica, Arial, sans-serif";
        defaultStyle.hAlign = GC.Spread.Sheets.HorizontalAlign.center;
        defaultStyle.vAlign = GC.Spread.Sheets.HorizontalAlign.center;
        sheet.setDefaultStyle(defaultStyle, GC.Spread.Sheets.SheetArea.viewport);
        
        sheet.setDataSource(this.tableData[this.currentIndex]);
        //渲染列
        sheet.bindColumns(colInfos);//此方法一定要放在setDataSource后面才能正确渲染列名
        this.spread.refresh(); //重新定位宽高度
      } catch (error) {
        console.log('表格渲染的错误信息:',error)
      }
      
    },
    // 查询
    dataSearch(remarkTb) {
      this.tagRemark = remarkTb
      this.tableData[remarkTb] = [];
      this.$set(this.tableLoading, remarkTb, true);
      this.tablePagination[remarkTb].pageIndex = 1;
      this.getTableData(this.formSearchs[remarkTb].datas, remarkTb);
    },
    // 重置
    dataReset(remarkTb) {
      for (let name in this.formSearchs[remarkTb].datas) {
        if (name != "dicID") {
          if(this.formSearchs[remarkTb].forms.length){
            // 判断是否是页面显示的查询条件，是的字段才清空
            this.formSearchs[remarkTb].forms.forEach((element)=>{
              if(element.prop===name){
                this.formSearchs[remarkTb].datas[name] = null;
              }
            })
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
    async dataSave(){
      if(this.tableData[this.tagRemark].length){

      }else{
          this.$message.error("当前表数据为空，请添加再保存！")
      }
    },
  }
}
</script>