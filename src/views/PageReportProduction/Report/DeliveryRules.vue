<!-- 易事特送货规则 -->
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
        :searchData="formSearchs[tagRemark].datas"
        :searchForm="formSearchs[tagRemark].forms"
        :remark="tagRemark"
        :isLoading="tableLoading[tagRemark]"
        :btnForm="btnForm"
        @btnClick="btnClick"
        :defaultShow="true"
        :signName="tagRemark"
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
            v-loading="tableLoading[tagRemark]"
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
              @click="toPageSetting(sysID[tagRemark].ID)"
              class="primaryColor cursor"
              >SysID:{{ sysID[tagRemark].ID }}
            </span>
          </div>
          <div class="flex">
              <el-pagination
                background
                @size-change="val=>pageSize(val,0)"
                :current-page="tablePagination[tagRemark].pageIndex"
                :page-sizes="[
                200,
                500,
                1000,
                2000,
                3000,
                5000,
                10000
                ]"
                :page-size="tablePagination[tagRemark].pageSize"
                :total="tablePagination[tagRemark].pageTotal"
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
import ComSearch from "@/components/ComSearch";
import {
  GetHeader,
  GetSearchData,
  ExportData,
  SaveData,
  GetSearch
} from "@/api/Common";
import { mapState } from "vuex";
import {
  HeaderCheckBoxCellType
}  from "@/static/data.js";
export default {
  name: "DeliveryRules",
  components: {
    ComSearch,
  },
  data() {
    return {
        depList:[],
        title:this.$route.meta.title,//表名
        height:'740px',
        adminLoading:false,//加载状态
        tagRemark:0,//当前表下标
        btnForm: [],//拥有的按钮权限
        parmsBtn: [
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
            ButtonCode: "save",
            BtnName: "新增",
            isLoading: false,
            Methods: "addRow",
            Type: "success",
            Icon: "",
            Size: "small",
            },
            {
            ButtonCode: "delete",
            BtnName: "删除",
            isLoading: false,
            Methods: "deleteRow",
            Type: "danger",
            Icon: "",
            Size: "small",
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
          { pageIndex: 1, pageSize: 2000, pageTotal: 0 },
        ],
        sysID:[{ID:8992}],
        spread: null,//excel初始
        checkBoxCellTypeRuleType: "",
        checkBoxCellTypeSuplier:'',
        sheetSelectObj: { start: 0, end: 0, count: 0 },
        headerList:[],
        selectionData:[[]],
        dataSourceDate:{},
    }
  },
  activated() {
    this.spread.refresh();
  },
  created() {
    _this = this;
    _this.judgeBtn();
    _this.getTableHeader()
    
  },
  mounted() {
    setTimeout(() => {
      this.setHeight();
    }, 350);
  },
  computed:{
    ...mapState({
      userInfo: (state) => state.user.userInfo,
    }),
  },
  methods:{
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
      let newHeight = rem  + "px";
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
      this.adminLoading = true;
      let IDs = this.sysID;
      let res = await GetHeader(IDs);
      const { datas, forms, result, msg } = res.data;
      if (result) {
        // 获取每个表头
        datas.some((m, i) => {
          this.$set(this.tableColumns, i, m);
          m.forEach((y) => {
            // 获取表头需要下拉配置的项
          if(y.ControlType == "combobox" && y.isEdit&&y.DataSourceID){
            this.dataSourceDate = {...this.dataSourceDate,...{[y.prop]:[]}}
          }
          })
        });
        // 获取查询的初始化字段 组件 按钮
        forms.some((x, z) => {
          this.$set(this.formSearchs[z].datas, "dicID", IDs[z].ID);
          x.forEach((y) => {
            if (y.prop && y.value) {
              this.$set(this.formSearchs[z].datas, [y.prop], y.value);
            } else {
              this.$set(this.formSearchs[z].datas, [y.prop], "")
            }
            // 通过表头对应获取数据源
            for(let obj in this.dataSourceDate){
              if(obj === y.prop){
                y.options.map(ele=>{
                  ele.text = ele.label
                })
                this.dataSourceDate = {...this.dataSourceDate,...{[obj]:y.options}}
              }
              
            }
          });
          this.$set(this.formSearchs[z], "forms", x);
          this.getTableData(this.formSearchs[z].datas, z);
        });
        this.adminLoading = false
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
    async getTableData(params,index){
      this.tagRemark = index;
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
        let cellIndex = 0
        let colInfos = []
        this.tableColumns[this.tagRemark].forEach((x) => {
          if(x.ControlType == "combobox" && x.isEdit){
            var cellType = new GC.Spread.Sheets.CellTypes.ComboBox();
            cellType.editorValueType(
              GC.Spread.Sheets.CellTypes.EditorValueType.value
            );
            cellType.items(this.dataSourceDate[x.prop]);
            cellType.editable(true)
             colInfos.push({
            name: x.prop,
            displayName: x.label,
            cellType: cellType,
            size: parseInt(x.width),
            });
          }else{
            colInfos.push({
            name: x.prop,
            displayName: x.label,
            size: parseInt(x.width),
            })
          }
        cellIndex++
      });
      // 列筛选
      // 参数2 开始列
      // 参数3 
      // 参数4 结束列
      var cellrange =new GC.Spread.Sheets.Range(-1, -1, -1, cellIndex);
      var hideRowFilter =new GC.Spread.Sheets.Filter.HideRowFilter(cellrange);
      sheet.rowFilter(hideRowFilter)
      
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
            size: 60,
        };
            for (var name in checkbox) {
            colInfos[0][name] = checkbox[name];
        }

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
                GC.Spread.Sheets.CopyToOptions.all
              );
           
              sheet.deleteRows(
                _this.sheetSelectObj.start + _this.sheetSelectRows.length,
                _this.sheetSelectObj.count
              );
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
              sheet.deleteRows(
                _this.sheetSelectObj.start,
                _this.sheetSelectObj.count
              );
              
            }
            let count = sheet.getRowCount(GC.Spread.Sheets.SheetArea.viewport);
 
            let lineID=_this.sheetSelectRows[0][lineIDIndex]
            let isFind=false;
            let viewSort=1;
   

            for(var i=0;i<count;i++ )
            {
 
              if(isFind==false&&sheet.getValue(i,lineIDIndex)==lineID)
              {
                  isFind=true;      
                
              }
             if(isFind&&sheet.getValue(i,lineIDIndex)!=lineID)
              {
               
                break;
              }
              if(isFind)
              {
                sheet.setValue(i,viewSortIndex,viewSort);
                viewSort++;
              }
            }
            sheet.resumePaint();
            return true;
          }
        },
      };
        this.spread.commandManager().register("insertRowsCopyStyle", insertRowsCopyStyle);
        //渲染数据源
        sheet.setDataSource(this.tableData[this.tagRemark]);
        //渲染列
        this.headerList = colInfos
        sheet.bindColumns(colInfos);//此方法一定要放在setDataSource后面才能正确渲染列名
        this.spread.refresh(); //重新定位宽高度
        //一定要放在渲染完后
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
      let sheet = this.spread.getActiveSheet();
      let newData = sheet.getDirtyRows();
      let submitData = [];
      if (newData.length != 0) {
        newData.forEach((x) => {
            if(x.item.SuplierCode&&x.item.RuleType){
                x.item['dicID'] = 8992
                submitData.push(x.item);
            }
        });
      }
      if (submitData.length == 0) {
        this.$message.error("没修改过任何数据或供应商代码和规格类型为空！");
        return;
      }
      this.adminLoading = true;
      let res = await SaveData(submitData);
      const { result, data, count, msg } = res.data;
      if (result) {
        this.dataSearch(this.tagRemark);
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
    // 行新增
    addRow () {
        let spread = this.spread;
        let sheet = spread.getActiveSheet();
        if (sheet) {
            let list =[
                {
                    // RowNumber:this.tableData[this.tagRemark].length?parseInt(this.tableData[this.tagRemark][this.tableData[this.tagRemark].length-1]['RowNumber'] +1):1,
                    rowNum :_.uniqueId('rowNum_')
                }
                ]
            this.tableData[this.tagRemark] = [...this.tableData[this.tagRemark],...list]
            this.setData()
        }
    },

    deleteRow () {
        this.getSelectionData()
        this.$nextTick(()=>{
          if(this.selectionData[this.tagRemark].length==0){
          this.$message.error("请选择需要删除的数据！");
          return;
        }else{
          this.$confirm("删除不可恢复，确定要删除吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "info",
        })
          .then(async() => {
            let sheet = this.spread.getActiveSheet();
            let newData = sheet.getDataSource();
            this.selectionData[this.tagRemark] = [];
            if (newData.length != 0) {
              newData.forEach((item,i) => {
                if (item.isChecked) {
                  // 
                  item.ElementDeleteFlag = 1
                  if(item.rowNum){
                    this.tableData[this.tagRemark] = _.filter(this.tableData[this.tagRemark],function(o){
                      if(o.rowNum!=item.rowNum){
                        return o
                      }
                    })
                    this.setData()
                    }else{
                    this.selectionData[this.tagRemark].push(item);
                  }
                  
                }
              });
              if(this.selectionData[this.tagRemark].length){
              this.adminLoading = true;
              let res = await SaveData(this.selectionData[this.tagRemark]);
              const { result, data, count, msg } = res.data;
              if (result) {
                this.dataSearch(this.tagRemark);
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
            }
          })
          .catch(() => {});
        }
        })
    },
    // 获取选中的数据
    getSelectionData() {
      let sheet = this.spread.getActiveSheet();
      let newData = sheet.getDataSource();
      this.selectionData[this.tagRemark] = [];
      if (newData.length != 0) {
        newData.forEach((x) => {
          if (x.isChecked) {
            this.selectionData[this.tagRemark].push(x);
          }
        });
      }
    },
    }
}
</script>