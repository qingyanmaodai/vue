<!--日计划-->
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
              <el-button
                type="warning"
                size="mini"
                @click="ResetSorting"
              >重置排序</el-button>
              <el-divider direction="vertical"></el-divider>
              <!-- <div :class="labelStatus1 == y ? 'statusActive cursor' : 'cursor'" v-for="(item, y) in Status1" :key="y">
                <span @click="changeStatus(item, y)">{{ item.OrganizeName }}</span>
                <el-divider direction="vertical"></el-divider>
              </div> -->
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
            <span @click="toPageSetting" class="primaryColor cursor">SysID:6734
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
      <!-- 点击齐套率弹框-->
      <DialogTable
        title="订单齐套分析"
        :tableDialog="colDialogVisible"
        :sysID="7916"
        width="80%"
        @closeDialog="colDialogVisible = false"
        :searchForm="dialogSearchForm"
        :isToolbar="false"
      ></DialogTable>
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
    HighlightColumnItemsCellType,
    TopItemsCellType,
    HeaderCheckBoxCellType,
    SortHyperlinkCellType,
    HighlightRowItemsCellType,
  } from "@/static/data.js";
  import {
    GetHeader,
    GetSearchData,
    ExportData,
    SaveData,
    GetSearch,
    GetOrgData,
  } from "@/api/Common";
  import {
    SaveMOPlanStep4
  } from "@/api/PageTwoScheduling";
  import DialogTable from "@/components/Dialog/dialogTable";
  export default {
    name: "PCB_daily_plan",
    components: {
      ComSearch,
      ComReportTable,
      ComAsideTree,
      DialogTable
    },
    data() {
      return {
        dialogSearchForm:{
        },
        colDialogVisible:false,
        labelStatus1: 0,
        Status1: [],
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
        parmsBtn: [{
            ButtonCode: "save",
            BtnName: "保存",
            isLoading: false,
            Methods: "dataSaveDay",
            Type: "success",
            Icon: "",
            Size: "small",
          },
             {
            ButtonCode: "save",
            BtnName: "退回",
            isLoading: false,
            Methods: "dataDel",
            Type: "danger",
            Icon: "",
            Size: "small",
            Params: {
              dataName: "selectionData"
            },
          },
                 {
            ButtonCode: "save",
            BtnName: "下推",
            isLoading: false,
            Methods: "setPlan",
            Type: "danger",
            Icon: "",
            Size: "small",
            Params: {
              dataName: "selectionData"
            },
          },
          // {
          //   ButtonCode: "save",
          //   BtnName: "重排",
          //   isLoading: false,
          //   Methods: "resetScheduling",
          //   Type: "danger",
          //   Icon: "",
          //   Size: "small",
          //   Params: {
          //     dataName: "resetScheduling"
          //   },
          // },
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
        sysID: 6734,
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
      this.getLabelLineData();
      this.adminLoading = true;
      this.judgeBtn();
      this.getTableHeader();

      // this.timeOut();
    },
    computed: {
      ...mapState({
        userInfo: (state) => state.user.userInfo,
      }),
    },
    beforeRouteEnter(to, form, next) {
    //this.formSearchs= JSON.parse(sessionStorage .setItem("dicIDForm"+this.ID));
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
      // timeOut() {
      //   if (this.time) {
      //     clearTimeout(this.time);
      //   }
      //   if (this.spread) {
      //     this.spread.refresh();
      //   }
      //   this.time = setTimeout(() => {
      //     //重新定位宽高度
      //     this.timeOut();
      //   }, 2000);
      // },
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
        console.log('routeBtn',this.$route)
        console.log('newBtn',newBtn)
        console.log('permission',permission)
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
            this.formSearchs[remarkTb].datas[name] = null;
          }
        }
      },
       async setPlan(remarkTb, index, params) {
      let arr = this.getSelectionData();
 
     
        if (this.selectionData[remarkTb].length == 0) {
          this.$message.error("请选择需要转入日计划的数据！");
        } else {
          let ProcessID = "";
          this.adminLoading = true;
          // if (remarkTb == 1) {
          //   ProcessID = "P202009092233201";
          // } else if (remarkTb == 3) {
          //   ProcessID = "P202009092233413";
          // }

          let errMsg = "";
          // let okCount = 0;
          let okCount = this.selectionData[remarkTb].length;
       
          if (errMsg != "") {
            this.$message({
              message: errMsg,
              type: "error",
              dangerouslyUseHTMLString: true,
            });
          }
          if (okCount > 0) {
            let res = await GetSearch(
              this.selectionData[remarkTb],
              "/APSAPI/MOPlanSaveToDayPlanV2?isPlan=2"
            );
            const { result, data, count, msg } = res.data;
            if (result) {
              this.adminLoading = false;
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
             this.adminLoading = false;
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
                obj["Status"] = -1;
                newData.push(obj);
              });
            }
          } else {
            this.tableData[remarkTb].forEach((y) => {
              let obj2 = y;
              obj2["Status"] = -1;
              newData.push(obj2);
            });
          }
          this.adminLoading = true;
          _this.dataSave(remarkTb, index, null, newData);
        })
        .catch((_) => {});
    },
      resetScheduling() {
        this.$confirm("确定要重新排全部数据吗？")
          .then(async (_) => {
            this.adminLoading = true;

            let sheet = this.spread.getActiveSheet();
            let submitData = sheet.getDataSource();
            submitData.forEach((m) => {
              m["isChecked"] = true;
            });
            if (submitData.length >= 0) {
              this.adminLoading = true;
              let res = await GetSearch(
                submitData,
                "/APSAPI/MOPlanSaveToDayPlan?isPlan=1"
              );
              const {
                result,
                data,
                count,
                msg
              } = res.data;
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
            } else {
              this.$message({
                message: "未有数据",
                type: "error",
                dangerouslyUseHTMLString: true,
              });
            }
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
        const {
          datas,
          forms,
          result,
          msg
        } = res.data;
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
        let IDs = [{
          ID: 6734
        }];
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
          this.getOrgData();
            this.formSearchs[0].datas["WorkOrderTypeID"] = "6033a552143a56";
           this.formSearchs.forEach(a=>{
            // a.datas["ProcessID"] = 'P202009092233201';
          })
          // this.dataSearch(0);
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
        form["dicID"] = 6734;
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
        let colHeader1 = [];
        let colInfos = [];
        this.tableColumns[0].forEach((x) => {
          if (x.prop == "LineID") {
            colInfos.push({
              name: x.prop,
              displayName: "线别",
              cellType: this.checkBoxCellTypeLine,
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

        //  colInfos.unshift(checkbox);
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

        sheet.frozenColumnCount(this.tableColumns[0][0].FixCount);

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
              console.log(_this.sheetSelectRows);

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
            //  console.log(options);
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

          _this.computedNum(args.row, args.col, args.editingText);
          // for (var i = args.col + 1; i < _this.tableColumns[0].length; i++) {
          //   sheet.setArray(args.row, i, [2021]);
          // }
        });
        // 粘贴事件
        this.spread.bind(GCsheets.Events.ClipboardPasted, function(s, e) {
            // 日期列才触发
            if(_this.tableColumns[_this.tagRemark][e.cellRange.col].prop.indexOf('-')>-1){
              // 正则分割剪切单元格的所有值
              let cellValList = e.pasteData.text.split(/\t|\r\n/)
              if(cellValList&&cellValList.length){
                // 获取剪切
                let rowIndex  = e.cellRange.rowCount
                let colIndex = e.cellRange.colCount
                let row = e.cellRange.row
                // 循环次数初始化
                let num = 0
                for(let r=0;r<rowIndex;r++){
                  let col = e.cellRange.col
                  for(let c=0;c<colIndex;c++){
                    // 自动计算数量
                    // /^[0-9]+.?[0-9]*$/ 验证字符串是否是数字
                    _this.computedNum(row, col, /^[0-9]+.?[0-9]*$/.test(cellValList[num])?parseInt(cellValList[num]):0);
                    // 复制的列累加
                    col ++
                    // 循环的次数累加
                    num ++
                  }
                  // 复制的函数累加
                  row ++
                }
              }
            }
          });

        // 表格单击齐套率弹框事件
      this.spread.bind(GCsheets.Events.CellClick, function (e, args) {
        if (_this.tableColumns[_this.tagRemark].length) {
          _this.tableColumns[_this.tagRemark].map((item, index) => {
            if (item.name === "FormRate" && args.col === index) {
              // 显示ERP供需平衡表
              _this.colDialogVisible = true;
              _this.dialogSearchForm.OrderNo =
                _this.tableData[_this.tagRemark][args.row].OrderNo;
              _this.dialogSearchForm.OweQty = 0;
            }
          });
        }
      });
      
        this.spread.resumePaint();
        this.adminLoading = false;
        this.tableLoading[0] = false;
        this.spread.refresh(); //重新定位宽高度
        this.spread.options.tabStripVisible = false;//是否显示表单标签
      },
      // 自动计算数量
      computedNum(rowIndex, colIndex, val) {
        let sheet = this.spread.getActiveSheet();
        let dataSource = sheet.getDataSource();
        if (val == null) {
          val = 0;
        }else if(val==0){//输入0不触发自动计算
          sheet.setValue(rowIndex, colIndex, "");
          return
        }
        let currentRow = dataSource[rowIndex];
        if (currentRow.ID == -1) {
          return false;
        }
        let currentlabel = this.tableColumns[0][colIndex].prop + "dy";
        if (!currentRow[currentlabel]) {
          //不是天日的数量
          currentlabel = this.tableColumns[0][colIndex].prop;
          if (currentlabel == "ViewSort") {
            val = currentRow[currentlabel];
            if (val) {
              let newRowindex = 1;
              let flag = false;
              let lineID = currentRow["LineID"];
              //循环上面
              for (var r = 0; r < dataSource.length - 1; r++) {
                let row = dataSource[r];
                let thisValue = newRowindex; //row[currentlabel];
                if (lineID != row["LineID"]) {
                  continue;
                }
                if (r < rowIndex) {
                  if (thisValue >= val && flag === false) {
                    newRowindex = val + 1;
                    flag = true;
                  }

                  thisValue = newRowindex;
                  newRowindex++;
                } else if (r > rowIndex) {
                  if (newRowindex == val) {
                    newRowindex++;
                  }

                  thisValue = newRowindex;
                  newRowindex++;
                } else {
                  thisValue = val;
                }
                sheet.setValue(r, colIndex, thisValue);
              }
            }
          } else {}

          return;
        }
        if (
          !currentRow[currentlabel].TotalHours ||
          parseInt(currentRow[currentlabel].TotalHours) <= 0
        ) {
          this.$message.error("该天休息，上班时间为0");
          sheet.setValue(rowIndex, colIndex, "");
          return;
        }

        let Qty = parseInt(currentRow.OweQty);
        let Capacity = parseInt(currentRow.Capacity);
        let list = [];
        let editNum = 0;
        let remainNum = 0;
        // 填一个数量自动将之后的全清干净，前面的累计 prop2有值
        this.tableColumns[0].some((x, i) => {
          if (i <= colIndex) {
            list.push(currentRow[x.prop]);
            if (x.prop2 && i != colIndex && currentRow[x.prop]) {
              editNum = parseInt(editNum) + parseInt(currentRow[x.prop]);
            }
          } else {
            list.push("");
          }
        });
        remainNum = Qty - editNum;

        if (parseInt(val) > remainNum) {
          this.$message.error(
            "输入的数量不能大于剩余排产数，剩余排产数为：" + remainNum
          );
          list[colIndex] = "";
          for (var j = 0; j < this.tableColumns[0].length; j++) {
            sheet.setArray(rowIndex, j, [list[j]]);
          }
          return;
        } else {
          // 接着计算下面每一个空格该有的数
          for (var j = colIndex + 1; j < this.tableColumns[0].length; j++) {
            let label = this.tableColumns[0][j].prop + "dy";
            let obj = currentRow[label];
            remainNum = remainNum - parseInt(val);
            let maxNum =
              parseInt(Capacity) *
              parseInt(obj.TotalHours) *
              parseInt(obj.DayCapacity);
            // parseInt(obj.StandardPeoples)
            if (remainNum <= 0) {
              list[j] = null;
            } else {
              if (remainNum <= maxNum) {
                list[j] = remainNum;
                break;
              } else {
                list[j] = maxNum;
                remainNum -= maxNum;
              }
            }
          }
          for (var j = 0; j < this.tableColumns[0].length; j++) {
            sheet.setArray(rowIndex, j, [list[j]]);
          }
        }
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
            ID: this.sysID
          },
        });
      },
      //////////////////////////////
      async getOrgData() {
        this.getLineData(this.userInfo.CenterID);
        return;
        this.treeListTmp = [];
        this.treeData = [];
        let form = {
          OrganizeIDs: this.userInfo.CenterID,
          OrganizeTypeID: 5,
          dicID: 3026,
          Status: 1,
        };
        let res = await GetSearchData(form);
        const {
          result,
          data,
          count,
          msg
        } = res.data;
        if (result) {
          this.treeData = JSON.parse(JSON.stringify(data));
          this.treeListTmp = this.treeData;
          if (data.length != 0) {
            this.$nextTick(function() {
              _this.$refs.asideTreeRef.setCurrentKey(data[0].OrganizeID);
            });
            this.$set(
              this.formSearchs[0].datas,
              "ControlID",
              data[0].ERPOrderCode
            );
            this.getLineData(this.userInfo.CenterID);
          }
        } else {
          this.adminLoading = false;
          this.$message({
            message: msg,
            type: "error",
            dangerouslyUseHTMLString: true,
          });
        }
      },
      // 获取线别数据
      async getLineData(OrganizeIDs) {
        this.lines = [];
        let res = await GetSearchData({
          dicID: 5144,
          OrganizeTypeID: 6,
          ParentID:3,
          // ProcessID:'P202009092233201',
          OrganizeIDs: OrganizeIDs,
        });
        const {
          data,
          forms,
          result,
          msg
        } = res.data;
        if (result) {
          let newData = [];
          this.treeData2 = data;
          this.treeListTmp2 = data;
          this.adminLoading = false;
          if (data.length != 0) {
            data.forEach((x) => {
              newData.push({
                text: x.OrganizeName,
                value: x.OrganizeID
              });
            });
          }
          this.lines = newData;
          this.checkBoxCellTypeLine = new GCsheets.CellTypes.ComboBox();
          this.checkBoxCellTypeLine.editorValueType(
            GC.Spread.Sheets.CellTypes.EditorValueType.value
          );
          this.checkBoxCellTypeLine.items(newData);
          this.checkBoxCellTypeLine.itemHeight(24);
          this.formSearchs[0].datas.ControlID = "202";
          this.getTableData(this.formSearchs[0].datas, 0);
        } else {
          this.adminLoading = false;
          this.$message({
            message: msg,
            type: "error",
            dangerouslyUseHTMLString: true,
          });
        }
      },
      searchTree(msg, dataName, dataName2, valueName) {
        this[dataName] = [];
        let treeListTmp = JSON.parse(JSON.stringify(this[dataName2]));
        let tmp = msg ?
          this.rebuildData(msg, treeListTmp, valueName) :
          JSON.parse(JSON.stringify(treeListTmp));
        this[dataName].push(...tmp);
      },
      rebuildData(value, arr, valueName) {
        if (!arr) {
          return [];
        }
        let newarr = [];
        if (Object.prototype.toString.call(arr) === "[object Array]") {
          arr.forEach((element) => {
            if (element[valueName].indexOf(value) > -1) {
              // const ab = this.rebuildData(value, element.children);
              const obj = {
                ...element,
                children: element.children,
              };
              newarr.push(obj);
            } else {
              if (element.children && element.children.length > 0) {
                const ab = this.rebuildData(value, element.children, valueName);
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
      // 单击出来组织人员
      handleNodeClick(data, node) {
        this.clickData = data;
        this.formSearchs[0].datas["ControlID"] = data.ERPOrderCode;
        //this.dataSearch(0);
        this.getLineData(data.OrganizeID);
      },
      // 单击出来线别
      handleNodeClick2(data, node) {
        this.$set(this.formSearchs[0].datas, "LineID", data.OrganizeID);
        this.dataSearch(0);
      },
      changeStatus(item, index) {
        this.labelStatus1 = index;
      },
      // 保存日计划
      async dataSaveDay() {
        let sheet = this.spread.getActiveSheet();
        let newData = sheet.getDirtyRows();
        let submitData = [];
        if (newData.length != 0) {
          newData.forEach((x) => {
            submitData.push(x.item);
          });
        }
        if (submitData.length == 0) {
          this.$message.error("没修改过任何数据！");
          return;
        }

        this.adminLoading = true;
        let res = await SaveMOPlanStep4(submitData);
        const {
          result,
          data,
          count,
          msg
        } = res.data;
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
      // 改变状态
      changeStatus(item, index) {
        this.labelStatus1 = index;
        this.formSearchs[0].datas["LineID"] = item.OrganizeID;
        this.dataSearch(0)
      },
      // 获取smt线的数据
      async getLabelLineData() {
        let newData = [{
          OrganizeName: '全部',
          OrganizeID: ''
        }, {
          OrganizeName: '未分线',
          OrganizeID: ''
        }]
        this.Status1 = [];
        let form = {};
        form["dicID"] = '5144';
        // form["ProcessID"] = 'P202009092233201';
        let res = await GetSearchData(form);
        const {
          result,
          data,
          count,
          msg
        } = res.data;
        if (result) {
          this.Status1 = newData.concat(data);
        } else {
          this.$message({
            message: msg,
            type: "error",
            dangerouslyUseHTMLString: true,
          });
        }
      },
       // 重置排序
       async ResetSorting(){
        let res = null
          this.$confirm("确定重置排序吗？")
          .then(async(_) => {
            res = await GetSearch(_this.tableData[this.tagRemark], "/APSAPI/ResetEKViewSort");
            const {
            datas,
            forms,
            result,
            msg
          } = res.data;
          if (result) {
            _this.$message({
              message: msg,
              type: "success",
              dangerouslyUseHTMLString: true,
            });
            _this.dataSearch(_this.tagRemark);
          } else {
            _this.$message({
              message: msg,
              type: "error",
              dangerouslyUseHTMLString: true,
            });
          }
          })
          .catch((_) => {});
      }
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
