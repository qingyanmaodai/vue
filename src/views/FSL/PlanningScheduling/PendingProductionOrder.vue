<!-- 待生产订单BOM -->
<template>
    <div class="container" v-loading="adminLoading">
      <div class="admin_head" ref="headRef">
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
      <div>
        <div class="admin_content">
          <div class="ant-table-title">
          <el-row>
            <el-col :span="4"
              ><span class="title">{{ title }}</span></el-col
            >
            <el-col :span="20" class="flex_flex_end">
            </el-col>
          </el-row>
        </div>
          <div class="flex_column" :style="{ height: height }">
            <div class="spreadContainer" v-loading="tableLoading[0]">
              <gc-spread-sheets
                class="sample-spreadsheets"
                @workbookInitialized="initSpread"
              >
                <gc-worksheet></gc-worksheet>
              </gc-spread-sheets>
            </div>
          </div>
          <div class="flex_row_spaceBtn pagination">
            <div>
              <span @click="toPageSetting(sysID[tagRemark].ID)" class="primaryColor cursor"
                >SysID:{{sysID[tagRemark].ID}}
              </span>
            </div>
            <div class="flex">
              <el-pagination
                background
                @size-change="(val) => pageSize(val, 0)"
                :current-page="tablePagination[0].pageIndex"
                :page-sizes="[200, 500, 1000, 3000, 5000, 10000]"
                :page-size="tablePagination[0].pageSize"
                :total="tablePagination[0].pageTotal"
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
  import { mapState } from "vuex";
  import ComSearch from "@/components/ComSearch";
  import ComReportTable from "@/components/ComReportTable";
  import ComAsideTree from "@/components/ComAsideTree";
  import {
    HeaderCheckBoxCellType,
  } from "@/static/data.js";
  import {
    GetHeader,
    GetSearchData,
    ExportData,
    SaveData,
    GetSearch,
  } from "@/api/Common";
  import { SaveMOPlanStep4 } from "@/api/PageTwoScheduling";
  import formatDates from "@/utils/formatDate";
  export default {
    name: "PendingProductionOrder",
    components: {
      ComSearch,
      ComReportTable,
      ComAsideTree,
    },
    data() {
      return {
        dialogSearchForm:{
          OrderID:'',
        },
        colDialogVisible:false,
        //////////////左侧树节点//////////////
        LineName: "",
        OrganizeName: "",
        clickData: {},
        treeProps: {
          label: "OrganizeName",
          children: "children",
        },
        treeListTmp: [],
        treeListTmp2: [],
        treeData: [],
        treeData2: [],
        autoGenerateColumns: true,
        spread: null,
        ////////////////// Search /////////////////
        title: this.$route.meta.title,
        drawer: false,
        delData: [[]],
        formSearchs: [
          {
            datas: {},
            forms: [],
          },
        ],
        btnForm: [],
        parmsBtn: [
        {
            ButtonCode: "save",
            BtnName: "保存",
            isLoading: false,
            Methods: "dataSaveAll",
            Type: "success",
            Icon: "",
            Size: "small",
          },
          {
            ButtonCode: "generate",
            BtnName: "生成采购申请单",
            isLoading: false,
            Methods: "updatePurReq",
            Type: "primary",
            Icon: "",
            Size: "small",
            Params: { },
          },
        ],
        tableData: [[]],
        tableColumns: [[]],
        tableLoading: [false],
        isClear: [false],
        tablePagination: [{ pageIndex: 1, pageSize: 3000, pageTotal: 0 }],
        height: "740px",
        treeHeight: "765px",
        showPagination: true,
        tagRemark: 0,
        isLoading: false,
        isEdit: false,
        sysID:[{ID:9037}] ,
        spread: null,
        adminLoading: false,
        checkBoxCellTypeLine: "",
        isOpen: true,
        selectionData: [[]],
            NoWorkHour: [],
        LineViewSort: [],
        spread: null,
        sheetSelectRows: [],
        sheetSelectObj: { start: 0, end: 0, count: 0 },
      };
    },
    watch: {},
    created() {
      _this = this;
      this.adminLoading = true;
      this.judgeBtn();
      this.getTableHeader();
    },
      activated()
    {
      if(this.spread)
      {
        this.spread.refresh();
      }
  
    },
    computed: {
      ...mapState({
        userInfo: (state) => state.user.userInfo,
      }),
    },
    mounted() {
      this.keyDown();
    },
    methods: {
      // 监听键盘
      keyDown() {
        document.onkeydown = (e) => {
          //事件对象兼容
          let e1 =
            e || event || window.event || arguments.callee.caller.arguments[0];
          if (e.ctrlKey && e.keyCode == 83) {
            e.preventDefault();
            e.returnValue = false;
  
            this.dataSaveDay();
            return false;
          }
        };
      },
      initSpread: function (spread) {
        this.spread = spread;
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
      async updatePurReq(remarkTb, index, parms) {
        let sheet = this.spread.getActiveSheet();
        let newData = sheet.getDataSource();
        this.selectionData[remarkTb] = [];
        if (newData && newData.length != 0) {
          newData.forEach((x) => {
            if (x.isChecked) {
              this.selectionData[remarkTb].push(x);
            }
          });
        } 
        if(this.selectionData[remarkTb].length==0) {
          this.$message.error("请选择需要操作的数据！");
          return;
        }
        this.adminLoading = true;
        console.log('this.selectionData[remarkTb]',this.selectionData[remarkTb])
        return //接口可以删除
        let res = await GetSearch(this.selectionData[remarkTb], "/APSAPI/CalculateBOMDemand");
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
      // 删除
      async dataDel(remarkTb, index, parms) {
        let res = null;
        this.getSelectionData();
        let newData = [];
  
        this.$confirm(
          "确定要退回的【" +
            this[parms.dataName][remarkTb].length +
            "】数据吗，如果已经报工则无法退回？"
        )
          .then((_) => {
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
            this.adminLoading = true;
            _this.dataSave(remarkTb, index, null, newData);
          })
          .catch((_) => {});
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
      // 单击行
      handleRowClick(row, remarkTb) {
        this.delData[remarkTb] = [];
        this.delData[remarkTb].push(row);
      },
      // 保存
      async dataSave(remarkTb, index, parms, newData) {
        let res = null;
  
        if (newData && newData.length != 0) {
          res = await SaveData(newData);
        } else {
          res = await SaveData(this.tableData[remarkTb]);
        }
        const { datas, forms, result, msg } = res.data;
        if (result) {
          this.$message({
            message: msg,
            type: "success",
            dangerouslyUseHTMLString: true,
          });
          this.dataSearch(remarkTb);
        } else {
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
         form["ControlID"]=this.userInfo.WorkFlowInstanceID;
        let res = await GetSearchData(form);
  
        const { result, data, count, msg } = res.data;
        if (result) {
          this.$set(this.tableData, remarkTb, data);
          this.setData();
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
      // 渲染数据
      setData() {
        this.spread.suspendPaint();
        let sheet = this.spread.getActiveSheet();
        sheet.options.allowCellOverflow = true;
        sheet.defaults.rowHeight = 23;
        sheet.defaults.colWidth = 100;
        sheet.defaults.colHeaderRowHeight = 23;
        sheet.defaults.rowHeaderColWidth = 60;
        sheet.reset()
        let colHeader1 = [];
        let colInfos = [];
        let cellIndex2 = 0;
        this.tableColumns[0].forEach((x) => {
          if (x.ControlType==='comboboxMultiple'||x.ControlType==='combobox') {
            colInfos.push({
                name: x.prop,
                displayName:x.label,
                cellType:'',
                size: parseInt(x.width),
            });
            let newData = [];
            let list = null;
            this.tableData[this.tagRemark].map((item,index)=>{
              if(x.DataSourceID&&x.DataSourceName){
                newData = item[x.DataSourceName]
                 // 设置列表每行下拉菜单
                list = new GCsheets.CellTypes.ComboBox();
                list.editorValueType(GC.Spread.Sheets.CellTypes.EditorValueType.value);
                list.editable(true);
                list.items(newData);
                list.itemHeight(24);
                sheet.getCell(index, cellIndex2, GCsheets.SheetArea.viewport).cellType(list)
              }  
            })
          }else if(x.DataType=='datetime'||x.DataType==='varchar'||x.DataType==='nvarchar'){
            colInfos.push({
              name: x.prop,
              displayName: x.label,
              size: parseInt(x.width),
              formatter: '@'//字符串格式
            });
          }else {
            colInfos.push({
              name: x.prop,
              displayName: x.label,
              size: parseInt(x.width),
            });
          }
          colHeader1.push(x.label);
          cellIndex2++;
        });
        sheet.setRowCount(1, GC.Spread.Sheets.SheetArea.colHeader);
        colHeader1.forEach(function (value, index) {
          sheet.setValue(0, index, value, GC.Spread.Sheets.SheetArea.colHeader);
        });
        if (colInfos.length && colInfos[0].name === "isChecked") {
          sheet.setCellType(
            0,
            0,
            new HeaderCheckBoxCellType(),
            GCsheets.SheetArea.colHeader
          );
    
          // 选框
          let checkbox = {
            name: "isChecked",
            displayName: "选择",
            cellType: new GC.Spread.Sheets.CellTypes.CheckBox(),
            size: 60,
          };
          for (var name in checkbox) {
            colInfos[0][name] = checkbox[name];
          }
        }
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
  
        sheet.frozenColumnCount(this.tableColumns[0][0].FixCount);
  
        sheet.setDataSource(this.tableData[0]);
        sheet.bindColumns(colInfos);
        this.spread.options.tabStripVisible = false;//是否显示表单标签
  
        let colindex = 0;
        for (let m of colInfos) {
          if (m.name == "Capacity") {
            var rowSheet = sheet.getRange(
              -1,
              colindex,
              1,
              1,
              GC.Spread.Sheets.SheetArea.viewport
            );
            rowSheet.hAlign(GC.Spread.Sheets.HorizontalAlign.center);
            rowSheet.foreColor("red");
            break;
          }
          
          colindex++;
        }
  
        this.tableData[0].forEach((row, index) => {
          var rowSheet = sheet.getRange(
            index,
            0,
            1,
            colindex,
            GC.Spread.Sheets.SheetArea.viewport
          );
          var rowSheet2 = sheet.getRange(
            index,
            colindex,
            1,
            colInfos.length - colindex,
            GC.Spread.Sheets.SheetArea.viewport
          );
          var rowSheet3 = ''
          var rowSheet4 = ''
          var rowSheet5 = ''
          
          if (row["Code"] == null) {
            rowSheet.backColor("#A0CFFF");
            rowSheet.foreColor("balck");
            rowSheet2.backColor("#A0CFFF");
            rowSheet2.foreColor("balck");
          } else if (row["MFGOrganizeID"] === 162) {
            // row.backColor();
            rowSheet.backColor("#FFFF00");
            rowSheet.foreColor("black");
            rowSheet2.backColor("#FFFF00");
          } else {
            // row.backColor();
            // rowSheet.foreColor("black");
            // rowSheet.backColor("");
            // rowSheet.foreColor("black");
            // rowSheet2.backColor("");
          }
          if(_this.tableColumns[this.tagRemark].length){
            for(let i=0;i<_this.tableColumns[this.tagRemark].length;i++){
              let item = _this.tableColumns[this.tagRemark][i]
               // 发料率小于100整行字体红色
              if(item.name ==="Q1"&&row["Q1"]&&row["Q1"]!="100.00%"){
                  rowSheet3 = sheet.getCell(
                  index,//行
                  i,//列
                  GC.Spread.Sheets.SheetArea.viewport
                );
                rowSheet3.foreColor("red");
              }
              if(item.name ==="Code"&&row['WorkOrderTypeID']==='ZP02'){
                rowSheet4 = sheet.getCell(
                  index,//行
                  i,//列
                  GC.Spread.Sheets.SheetArea.viewport
                );
                rowSheet4.foreColor("blue");
              }
              // 需求上线日期小于等于今天，字体红色
              if(item.name ==="APSDemandDate"&&row["APSDemandDate"]&&row["APSDemandDate"]<=formatDates.formatTodayDate()){
                rowSheet5 = sheet.getCell(
                  index,//行
                  i,//列
                  GC.Spread.Sheets.SheetArea.viewport
                );
                rowSheet5.foreColor("red");
              }
            }
          }
          let cellIndex = 0;
          this.tableColumns[0].forEach((m) => {
            //行，start,end
            if (m.DataType == "bit" && m.isEdit) {
              var cellType = new GC.Spread.Sheets.CellTypes.CheckBox();
              cellType.caption("");
              cellType.textTrue("");
              cellType.textFalse("");
              cellType.textIndeterminate("");
              cellType.textAlign(
                GC.Spread.Sheets.CellTypes.CheckBoxTextAlign.center
              );
              cellType.isThreeState(false);
              sheet.getCell(index, cellIndex).cellType(cellType);
            }
            cellIndex++;
          });
        });
        
  
        let cellIndex = 0;
        let viewSortIndex=0;//排序的索引
        let lineIDIndex=0
        this.tableColumns[0].forEach((m) => {
          //行，start,end
          if(m.prop=="ViewSort")
          {
            viewSortIndex=cellIndex;
          }
          if(m.prop=="LineID")
          {
            lineIDIndex=cellIndex;
          }
          if (m.isEdit) {
            sheet.getRange(-1, cellIndex, 1, 1).locked(false);
            var cell = sheet.getCell(
              -1,
              cellIndex,
              GC.Spread.Sheets.SheetArea.viewport
            );
            cell.foreColor("#2a06ecd9");
          }else {
            var cell = sheet.getCell(
              -1,
              cellIndex,
              GC.Spread.Sheets.SheetArea.viewport
            );
            cell.foreColor("black");
          }
          
  
          cellIndex++;
        });
        // 列筛选
        // 参数2 开始列
        // 参数3 
        // 参数4 结束列
        var cellrange =new GC.Spread.Sheets.Range(-1, -1, -1, cellIndex);
        
        var hideRowFilter =new GC.Spread.Sheets.Filter.HideRowFilter(cellrange);
        sheet.rowFilter(hideRowFilter)
  
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
              // console.log(_this.sheetSelectRows);
  
              // console.log(_this.sheetSelectObj.start+_this.sheetSelectRows.length)
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
             
            //   sheet.setArray(options.activeRow, 0, _this.sheetSelectRows);
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
              //  sheet.setArray(options.activeRow, 0, _this.sheetSelectRows);
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
        
              // Commands.startTransaction(context, options);
  
              // sheet.suspendPaint();
  
              // var beforeRowCount = 0;
  
              //  sheet.suspendPaint();
  
              // Commands.endTransaction(context, options);
              sheet.resumePaint();
  
              return true;
            }
          },
        };
  
  
  
        this.spread
          .commandManager()
          .register("insertRowsCopyStyle", insertRowsCopyStyle);
    
  
        function MyContextMenu() {}
        MyContextMenu.prototype = new GC.Spread.Sheets.ContextMenu.ContextMenu(
          this.spread
        );
        MyContextMenu.prototype.onOpenMenu = function (
          menuData,
          itemsDataForShown,
          hitInfo,
          spread
        ) {
          itemsDataForShown.forEach(function (item, index) {
            // console.log(item);
            if (item && item.name === "gc.spread.rowHeaderinsertCutCells") {
              item.command = "insertRowsCopyStyle";
            }
            //  else if (item && item.name === "gc.spread.cut") {
  
            //     item.command = "insertRowsCut";
            //   }
          });
        };
        var contextMenu = new MyContextMenu();
        this.spread.contextMenu = contextMenu;
        // 剪贴板事件绑定
        sheet.bind(
          GC.Spread.Sheets.Events.ClipboardChanged,
          function (sender, args) {
            let s = sheet.getSelections()[0];
            console.log(sheet.getDataItem(s.row));
            _this.sheetSelectRows = sheet.getArray(
              s.row,
              0,
              s.rowCount,
              _this.tableColumns[0].length
            );
            _this.sheetSelectObj.start = s.row;
  
            _this.sheetSelectObj.count = s.rowCount;
          }
        );
  
  
  
  
  
  
  
  
  
  
  
        /////////////////表格事件/////////////
        this.spread.bind(GCsheets.Events.ButtonClicked, (e, args) => {
          
          const { sheet, row, col } = args;
          const cellType = sheet.getCellType(row, col);
          if (cellType instanceof GCsheets.CellTypes.Button) {
          }
          if (cellType instanceof GCsheets.CellTypes.CheckBox) {
          }
          if (cellType instanceof GCsheets.CellTypes.HyperLink) {
          }
        });
        //表格编辑事件
  
        this.spread.bind(GCsheets.Events.EditStarting, function (e, args) {
          console.log('argse',e)
          console.log('args',args)
        });
        this.spread.bind(GCsheets.Events.EditEnded, function (e, args) {
        });
  
        this.spread.resumePaint();
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
        sheet.options.protectionOptions.allowSort = true
        sheet.options.protectionOptions.allowFilter = true
        sheet.options.allowUserDragDrop = true;
        this.adminLoading = false;
        this.tableLoading[0] = false;
        this.spread.refresh(); //重新定位宽高度
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
      // 跳转至页面配置
      toPageSetting(id) {
        this.$router.push({
          name: "FieldInfo",
          params: { ID: id },
        });
      },
      // 保存
      async dataSaveAll(remarkTb) {
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
      // 保存日计划
      async dataSaveDay() {
        let sheet = this.spread.getActiveSheet();
        if (sheet.isEditing()) {
          sheet.endEdit();
        }
         
       let submitData =[]
        let newData =sheet.getDirtyRows();
        if (newData.length != 0) {
          newData.forEach((x) => {
            submitData.push(x.item);
          });
        }
       
           newData =sheet.getInsertRows();
            if (newData.length != 0) {
          newData.forEach((x) => {
            // x.item["dicID"]=this.sysID;
            submitData.push(x.item);
          });
        }
        if (submitData.length == 0) {
          this.$message.error("没修改过任何数据！");
          return;
        }
  
        this.adminLoading = true;
        let res = await SaveMOPlanStep4(submitData);
        const { result, data, count, msg } = res.data;
        if (result) {
          this.dataSearch(0);
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
    },
  };
  </script>
  <style lang="scss" scoped>
  .spreadContainer {
    position: relative;
    overflow: hidden;
    height: 100%;
    flex: 1;
    border: 1px solid #ababab;
  }
  
  .sample-spreadsheets {
    width: 100%;
    height: 100%;
  }
  </style>