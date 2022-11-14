<!--恩平总装预测需求-->
<template>
    <div class="container" v-loading="adminLoading">
      <div class="admin_head" ref="headRef">
        <ComSearch ref="searchRef" :searchData="formSearchs[0].datas" :searchForm="formSearchs[0].forms" :remark="0"
          :isLoading="isLoading" :btnForm="btnForm" @btnClick="btnClick" />
      </div>
      <div>
        <div class="admin_content">
          <div class="ant-table-title">
            <el-row>
              <el-col :span="4"><span class="title">{{ title }}</span></el-col>
              <el-col :span="20" class="flex_flex_end">
                <div style="margin-right: 10px">
                  <!-- <span>日期范围</span>
                  <el-date-picker
                    v-model="machineCycle"
                    type="daterange"
                    size="small"
                    value-format="yyyy-MM-dd"
                    placeholder="请选择"
                    :clearable="false"
                    :editable="false"
                  >
                  </el-date-picker> -->
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="flex_column" :style="{ height: height }">
            <div class="spreadContainer" v-loading="tableLoading[0]">
              <gc-spread-sheets class="sample-spreadsheets" @workbookInitialized="initSpread">
                <gc-worksheet></gc-worksheet>
              </gc-spread-sheets>
            </div>
          </div>
          <div class="flex_row_spaceBtn pagination">
            <div>
              <span @click="toPageSetting" class="primaryColor cursor">SysID:{{sysID[0].ID}}
              </span>
            </div>
            <div class="flex">
              <el-pagination background @size-change="(val) => pageSize(val, 0)"
                :current-page="tablePagination[0].pageIndex" :page-sizes="[200, 500, 1000, 3000, 5000, 10000]"
                :page-size="tablePagination[0].pageSize" :total="tablePagination[0].pageTotal"
                @current-change="(val) => pageChange(val, 0)" layout="total, sizes, prev, pager, next,jumper">
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
    import {
      mapState
    } from "vuex";
    GC.Spread.Common.CultureManager.culture("zh-cn");
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
    import {
      SaveMOPlanStep4
    } from "@/api/PageTwoScheduling";
    import formatDates from "@/utils/formatDate";
    export default {
      name: "EPInjectionMolReq",
      components: {
        ComSearch,
        ComReportTable,
        ComAsideTree,
      },
      data() {
        return {
          machineCycle:[],
          labelStatus1: 0,
          Status1: [],
          //////////////左侧树节点//////////////
          LineName: "",
          OrganizeName: "",
          clickData: {},
          AutoDays2: 30,
          treeProps: {
            label: "OrganizeName",
            children: "children",
          },
          treeListTmp: [],
          treeListTmp2: [],
          treeData: [],
          treeData2: [],
          autoGenerateColumns: true,
          ////////////////// Search /////////////////
          title: this.$route.meta.title,
          drawer: false,
          delData: [
            []
          ],
          formSearchs: [{
            datas: {},
            forms: [],
          }, ],
          btnForm: [],
          parmsBtn: [
            {
              ButtonCode: "to_weeks_plan",
              BtnName: "转入周计划",
              Type: "primary",
              Ghost: true,
              Size: "small",
              Methods: "toWeeksPlan",
              Icon: "",
              sort:1,
            },
            {
              ButtonCode: "downLoadErpData",
              BtnName: "下载ERP数据",
              Type: "warning",
              Ghost: true,
              Size: "small",
              Methods: "downERP",
              Icon: "",
              sort:2,
            },
          ],
          tableData: [
            []
          ],
          tableColumns: [
            []
          ],
          tableLoading: [false],
          isClear: [false],
          tablePagination: [{
            pageIndex: 1,
            pageSize: 10000,
            pageTotal: 0
          }],
          height: "707px",
          treeHeight: "765px",
          showPagination: true,
          tagRemark: 0,
          isLoading: false,
          isEdit: false,
          sysID: [{ID:9008}],
          spread: null,
          adminLoading: false,
          checkBoxCellTypeLine: "",
          isOpen: true,
          time: null,
          selectionData: [
            []
          ],
          NoWorkHour: [],
        LineViewSort: [],
        spread: null,
        sheetSelectRows: [],
        sheetSelectObj: { start: 0, end: 0, count: 0 },
        };
      },
      beforeRouteLeave(to, form, next) {
        clearInterval(this.time);
        next();
      },
      watch: {},
      created() {
        _this = this;
        this.adminLoading = true;
        this.judgeBtn();
        this.getTableHeader();
        // 计算周期默认时间：今天~1.5月
        // _this.machineCycle = [
        //   formatDates.formatTodayDate(),
        //   formatDates.formatOneMonthDate(),
        // ];
      },
      computed: {
        ...mapState({
          userInfo: (state) => state.user.userInfo,
        }),
      },
      beforeRouteEnter(to, form, next) {
          next();
      },
      activated() {
        if(this.spread)
        {
            this.spread.refresh();
        }
      },
      mounted() {
        setTimeout(() => {
          this.setHeight();
        }, 300);
      },
      methods: {
        initSpread: function(spread) {
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
          newBtn = _.sortBy(newBtn,['sort'])
          this.$set(this, "btnForm", newBtn);
          this.$set(this, "isEdit", permission);
        },
        // 高度控制
        setHeight() {
          this.treeHeight = document.documentElement.clientHeight - 150 + "px";
          let headHeight = this.$refs.headRef.offsetHeight;
          let newHeight = "";
          let rem =
            document.documentElement.clientHeight -
            headHeight -
            this.$store.getters.reduceHeight;
          if (this.$store.getters.reduceHeight == 138) {
            newHeight = rem + "px";
          } else {
            newHeight = rem + "px";
          }
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
        // 获取表头数据
        async getTableHeader() {
          let IDs = this.sysID
          let res = await GetHeader(IDs);
          const {
            datas,
            forms,
            result,
            msg
          } = res.data;
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
            this.adminLoading = false
          }else{
            this.adminLoading = false
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
          let res = await GetSearchData(form);
  
          const {
            result,
            data,
            count,
            msg
          } = res.data;
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
          // 重置表单
          sheet.reset();
          let colHeader1 = [];
          let colInfos = [];
          let newData = [];
          let list = []
          this.tableColumns[0].forEach((x,i) => {
            if (x.ControlType==='comboboxMultiple'||x.ControlType==='combobox') {
              let ComboBox = null
              ComboBox= new GCsheets.CellTypes.ComboBox();
              ComboBox.editorValueType(
                GC.Spread.Sheets.CellTypes.EditorValueType.value
              );
              ComboBox.items(x.items);
              ComboBox.itemHeight(24);
              colInfos.push({
                name: x.prop,
                displayName:x.label,
                cellType:ComboBox,
                size: parseInt(x.width),
              });
            } else {
              colInfos.push({
                name: x.prop,
                displayName: x.label,
                size: parseInt(x.width),
              });
            }
            colHeader1.push(x.label);
          });
          sheet.setRowCount(1, GC.Spread.Sheets.SheetArea.colHeader);
          colHeader1.forEach(function(value, index) {
            sheet.setValue(0, index, value, GC.Spread.Sheets.SheetArea.colHeader);
          });
          sheet.setCellType(
            0,
            0,
            new HeaderCheckBoxCellType(),
            GCsheets.SheetArea.colHeader
          );
  
          // 选框
          let checkbox = {
            name: "isChecked",
            displayName: "isChecked",
            cellType: new GC.Spread.Sheets.CellTypes.CheckBox(),
            size: 60,
          };
          for (var name in checkbox) {
            colInfos[0][name] = checkbox[name];
          }
          var row = sheet.getRange(
            0,
            -1,
            1,
            -1,
            GC.Spread.Sheets.SheetArea.colHeader
          );
          row.backColor("#f3f3f3");
          row.foreColor("#000000d9");
          row.font("12px basefontRegular, Roboto, Helvetica, Arial, sans-serif");
          var defaultStyle = new GC.Spread.Sheets.Style();
          defaultStyle.font =
            "12px basefontRegular, Roboto, Helvetica, Arial, sans-serif";
          defaultStyle.hAlign = GC.Spread.Sheets.HorizontalAlign.left;
          defaultStyle.vAlign = GC.Spread.Sheets.HorizontalAlign.center;
          defaultStyle.borderLeft = new GC.Spread.Sheets.LineBorder(
            "1px solid #CCCCCC",
            GC.Spread.Sheets.LineStyle.min
          );
          defaultStyle.borderTop = new GC.Spread.Sheets.LineBorder(
            "1px solid #CCCCCC",
            GC.Spread.Sheets.LineStyle.min
          );
          defaultStyle.borderRight = new GC.Spread.Sheets.LineBorder(
            "1px solid transparent",
            GC.Spread.Sheets.LineStyle.min
          );
          defaultStyle.borderBottom = new GC.Spread.Sheets.LineBorder(
            "1px solid transparent",
            GC.Spread.Sheets.LineStyle.min
          );
          sheet.setDefaultStyle(defaultStyle, GC.Spread.Sheets.SheetArea.viewport);
          // 冻结第一列
  
          sheet.frozenColumnCount(this.tableColumns[this.tagRemark][1].FixCount);
  
          sheet.setDataSource(this.tableData[0]);
          sheet.bindColumns(colInfos);
  
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
            //行，start,end
            if (m.isEdit) {
              sheet.getRange(-1, cellIndex, 1, 1).locked(false);
              var cell = sheet.getCell(
                -1,
                cellIndex,
                GC.Spread.Sheets.SheetArea.viewport
              );
              cell.foreColor("#2a06ecd9");
            } else {
              // var cell = sheet.getCell(
              //   -1,
              //   cellIndex,
              //   GC.Spread.Sheets.SheetArea.viewport
              // );
              // cell.foreColor("gray");
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
  
          // 行样式
          this.tableData[0].forEach((row, index) => {
            var rowSheet = sheet.getRange(
              index,
              0,
              1,
              cellIndex,
              GC.Spread.Sheets.SheetArea.viewport
            );
            // 设置背景色
            if(row['DBResult']!='正确'){
              rowSheet.backColor("red");
            }
          })
    
  
  
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
  
        //修改剪切,已经不用
        var insertRowsCut = {
          canUndo: true,
          name: "insertRowsCut",
          execute: function (context, options, isUndo) {
            var Commands = GC.Spread.Sheets.Commands;
            if (isUndo) {
              Commands.undoTransaction(context, options);
              return true;
            } else {
              context.commandManager().execute(options);
              this.sheetSelectRows = sheet.getArray(
                options.selections[0].row,
                0,
                options.selections[0].rowCount,
                sheet.getColumnCount()
              );
              this.sheetSelectObj.start = options.selections[0].row;
  
              this.sheetSelectObj.count = options.selections[0].rowCount;
              return true;
            }
          },
        };
  
        this.spread
          .commandManager()
          .register("insertRowsCopyStyle", insertRowsCopyStyle);
        //修改剪切
        this.spread.commandManager().register("insertRowsCut", insertRowsCut);
  
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
            const {
              sheet,
              row,
              col
            } = args;
            const cellType = sheet.getCellType(row, col);
            if (cellType instanceof GCsheets.CellTypes.Button) {}
            if (cellType instanceof GCsheets.CellTypes.CheckBox) {}
            if (cellType instanceof GCsheets.CellTypes.HyperLink) {}
          });
          //表格编辑事件
  
          this.spread.bind(GCsheets.Events.EditStarting, function(e, args) {});
          this.spread.bind(GCsheets.Events.EditEnded, function(e, args) {
            // 自动计算数量
  
            // _this.computedNum(args.row, args.col, args.editingText);
            // for (var i = args.col + 1; i < _this.tableColumns[0].length; i++) {
            //   sheet.setArray(args.row, i, [2021]);
            // }
          });
          sheet.options.isProtected = true;
          sheet.options.protectionOptions.allowResizeColumns = true;
          sheet.options.protectionOptions.allowInsertRows = true;
          sheet.options.protectionOptions.allowDeleteRows = true;
          sheet.options.protectionOptions.allowSelectLockedCells = true;
          sheet.options.protectionOptions.allowSelectUnlockedCells = true;
          sheet.options.protectionOptions.allowDeleteRows = true;
          sheet.options.protectionOptions.allowDeleteColumns = true;
          sheet.options.protectionOptions.allowInsertRows = true;
          sheet.options.protectionOptions.allowInsertColumns = true;
          sheet.options.protectionOptions.allowDargInsertRows = true;
          sheet.options.protectionOptions.allowDragInsertColumns = true;
          sheet.options.protectionOptions.allowSort = true
          sheet.options.protectionOptions.allowFilter = true
          sheet.options.allowUserDragDrop = true;
          this.spread.resumePaint();
          this.adminLoading = false;
          this.tableLoading[0] = false;
          this.spread.refresh()
          this.spread.options.tabStripVisible = false;//是否显示表单标签
        },
        // 刷新页面
        refrshPage() {
          this.$store.dispatch("tagsView/delCachedView", this.$route).then(() => {
            const {
              fullPath
            } = this.$route;
            this.$nextTick(() => {
              this.$router.replace({
                path: "/redirect" + fullPath,
              });
            });
          });
        },
        // 跳转至页面配置
        toPageSetting() {
          this.$router.push({
            name: "FieldInfo",
            params: {
              ID: this.sysID[this.tagRemark].ID
            },
          });
        },
        // 转入周计划
        async toWeeksPlan() {
          let sheet = this.spread.getActiveSheet();
          let newData = sheet.getDataSource();
          this.selectionData[this.tagRemark] = [];
          if (newData && newData.length != 0) {
            newData.forEach((x) => {
              if (x.isChecked) {
                this.selectionData[this.tagRemark].push(x);
              }
            });
          } 
          if(this.selectionData[this.tagRemark].length==0) {
            this.$message.error("请选择需要转入的数据！");
            return;
          }
          this.adminLoading = true;
          let res = await GetSearch(this.selectionData[this.tagRemark],"/APSAPI/ManualForecastToPlanForOrder");
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
        async downERP() {
          this.adminLoading = true;
          let res = await GetSearch(null, "/APSAPI/GetErpData");

          const { result, data, count, msg } = res.data;

          if (result) {
            this.dataSearch(this.tagRemark);
            this.$message({
              message: msg,
              type: "success",
              dangerouslyUseHTMLString: true,
            });
          } else {
            this.$message({
              message: msg,
              type: "error",
              dangerouslyUseHTMLString: true,
            });
          }
          this.adminLoading = false;
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
  