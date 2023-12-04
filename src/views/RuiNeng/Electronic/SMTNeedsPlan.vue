<!-- 激光月计划 -->
<template>
  <div class="APSContainer" v-loading="adminLoading">
    <div class="admin_head" ref="headRef">
      <div v-for="i in [0]" :key="i" v-show="labelStatus1 === i">
        <ComSearch
          ref="searchRef"
          :searchData="formSearchs[i].datas"
          :searchForm="formSearchs[i].forms"
          :remark="i"
          :isLoading="isLoading"
          :btnForm="btnForm"
          :signName="i"
          :Region="Region[i]"
          @btnClick="btnClick"
        />
      </div>
    </div>
    <div>
      <div class="admin_content">
        <div class="ant-table-title">
          <el-row>
            <el-col :span="8"
              ><span class="title">{{ title }}</span>
              <!-- <span class="title" style="margin-left: 20px">{{ title2 }}</span> -->
            </el-col>
            <!-- <el-col :span="16" class="flex_flex_end"
              ><el-divider direction="vertical"></el-divider>
              <el-button type="primary" size="mini" @click="changeEvent(0)">
                拆分订单
              </el-button>
            </el-col> -->
          </el-row>
        </div>
        <div
          class="flex_column"
          v-for="item in [0]"
          :key="item"
          v-show="labelStatus1 === item"
        >
          <ComSpreadTable
            ref="spreadsheetRef"
            :height="height"
            :tableData="tableData[item]"
            :tableColumns="tableColumns[item]"
            :tableLoading="tableLoading[item]"
            :remark="item"
            :sysID="sysID[item]['ID']"
            :pagination="tablePagination[item]"
            @pageChange="pageChange"
            @pageSize="pageSize"
            @workbookInitialized="workbookInitialized"
            @selectfun="selectFun"
          />
        </div>
      </div>
    </div>
    <!-- <el-dialog :title="'拆分订单'" :visible.sync="Dialog" width="70%">
      <div class="ant-table-title">
        <el-row>
          <el-col :span="4"
            ><span class="title">拆分编辑完请保存 </span></el-col
          >
          <el-col :span="24" class="flex_flex_end"
            ><el-divider direction="vertical"></el-divider>
            <el-button type="primary" size="mini" @click="changeEvent(1)">
              确定拆分
            </el-button>
          </el-col>
        </el-row>
      </div>
      <div v-for="item in [1]" :key="item">
        <ComSpreadTable2
          ref="spreadsheetRef"
          :height="height"
          :tableData="tableData[item]"
          :tableColumns="tableColumns[item]"
          :tableLoading="tableLoading[item]"
          :remark="item"
          :sysID="sysID[item]['ID']"
          :pagination="tablePagination[item]"
          @pageChange="pageChange"
          @pageSize="pageSize"
          @workbookInitialized="workbookInitialized"
          @selectfun="selectFun"
          :spaceBtnShow="false"
        />
      </div>
    </el-dialog> -->
    <!-- 弹框-->
    <!-- <DialogTable
      title="全局欠料"
      :tableDialog="colDialogVisible"
      :sysID="5165"
      width="80%"
      @closeDialog="colDialogVisible = false"
      :searchForm="dialogSearchForm"
      :isToolbar="false"
    ></DialogTable> -->
  </div>
</template>

<script>
var _this;
const GCsheets = GC.Spread.Sheets;
import '@grapecity/spread-sheets-vue';
import GC from '@grapecity/spread-sheets';
import '@grapecity/spread-sheets/styles/gc.spread.sheets.excel2013white.css';
import '@grapecity/spread-sheets/js/zh.js';
import { mapState } from 'vuex';
GC.Spread.Common.CultureManager.culture('zh-cn');
import ComSearch from '@/components/ComSearch/AdvancedSearch';
import ComReportTable from '@/components/ComReportTable';
import ComAsideTree from '@/components/ComAsideTree';
import ComSpreadTable from '@/components/ComSpreadTable';
import ComSpreadTable2 from '@/components/ComSpreadTable';
import ComVxeTable from '@/components/ComVxeTable';
import { HeaderCheckBoxCellType } from '@/static/data.js';
import {
  GetHeader,
  GetSearchData,
  ExportData,
  SaveData,
  GetSearch,
  GetOrgData,
} from '@/api/Common';
import { SaveMOPlanStep4 } from '@/api/PageTwoScheduling';
import DialogTable from '@/components/Dialog/dialogTable';
export default {
  name: 'SMTNeedsPlan',
  components: {
    ComSearch,
    ComReportTable,
    ComAsideTree,
    DialogTable,
    ComVxeTable,
    ComSpreadTable,
    ComSpreadTable2,
  },
  data() {
    return {
      Dialog: false,
      labelStatus1: 0,
      spread: [[], [], [], [], []],
      dialogSearchForm: {
        OrderID: '',
      },
      colDialogVisible: false,
      //////////////左侧树节点//////////////
      LineName: '',
      OrganizeName: '',
      clickData: {},
      treeProps: {
        label: 'OrganizeName',
        children: 'children',
      },
      treeListTmp: [],
      treeListTmp2: [],
      treeData: [],
      treeData2: [],
      autoGenerateColumns: true,
      ////////////////// Search /////////////////
      title: this.$route.meta.title,
      title2: null,
      drawer: false,
      delData: [[]],
      formSearchs: [
        {
          datas: {
            ProcessGroupName: ['SMT', 'AI'],
          },
          forms: [],
        },
        {
          datas: {},
          forms: [],
        },
      ],
      btnForm: [],
      tableData: [[], []],
      tableColumns: [[], []],
      tableLoading: [false],
      isClear: [false, false],
      hasSelect: [false, false],
      Region: [6, 6],
      tablePagination: [
        { pageIndex: 1, pageSize: 3000, pageTotal: 0 },
        { pageIndex: 1, pageSize: 3000, pageTotal: 0 },
      ],
      height: '707px',
      treeHeight: '765px',
      showPagination: true,
      tagRemark: 0,
      isLoading: false,
      sysID: [{ ID: 11182 }],
      adminLoading: false,
      checkBoxCellTypeLine: '',
      isOpen: true,
      selectionData: [[], []],
      NoWorkHour: [],
      LineViewSort: [],
      sheetSelectRows: [],
      sheetSelectObj: { start: 0, end: 0, count: 0 },
      isEdit: false,
    };
  },
  watch: {},
  created() {
    _this = this;
    this.adminLoading = true;
    // 获取所有按钮
    this.btnForm = this.$route.meta.btns;
    this.judgeBtn(this.btnForm);
    this.getTableHeader();
  },
  // activated() {
  //   if (this.spread) {
  //     this.spread.refresh();
  //   }
  // },
  computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo,
    }),
  },
  mounted() {
    setTimeout(() => {
      this.setHeight();
    }, 300);
    this.keyDown();
  },
  methods: {
    judgeBtn(routeBtn) {
      if (routeBtn && routeBtn.length > 0)
        routeBtn.some((item, index) => {
          if (item.ButtonCode == 'save') {
            this.$set(this, 'isEdit', true);
          }
        });
      this.$set(this, 'btnForm', routeBtn);
    },
    // 监听键盘
    keyDown() {
      document.onkeydown = (e) => {
        //事件对象兼容
        let e1 =
          e || event || window.event || arguments.callee.caller.arguments[0];

        if (e.ctrlKey && e.keyCode == 83) {
          e.preventDefault();
          e.returnValue = false;

          this.dataSave(this.labelStatus1);
          return false;
        }
      };
    },
    //获取子组件实例
    workbookInitialized: function (workbook, remarkTb) {
      this.spread[remarkTb] = workbook;
    },
    //获取当前选中行的值
    selectFun(data, remarkTb, row) {
      this.selectionData[remarkTb] = data;
    },
    // 高度控制
    setHeight() {
      this.treeHeight = document.documentElement.clientHeight - 150 + 'px';
      let headHeight = this.$refs.headRef.offsetHeight;
      let newHeight = '';
      let rem =
        document.documentElement.clientHeight -
        headHeight -
        this.$store.getters.reduceHeight;
      if (this.$store.getters.reduceHeight == 138) {
        newHeight = rem + 'px';
      } else {
        newHeight = rem + 'px';
      }
      this.$set(this, 'height', newHeight);
    },
    // 第几页
    pageChange(val, remarkTb, filtertb) {
      this.$set(this.tablePagination[remarkTb], 'pageIndex', val);
      this.getTableData(this.formSearchs[remarkTb].datas, remarkTb);
    },
    // 页数
    pageSize(val, remarkTb, filtertb) {
      this.$set(this.tablePagination[remarkTb], 'pageSize', val);
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
        if (order === 'desc') {
          this.formSearchs[remarkTb].datas['sort'] = prop + ' DESC';
        } else {
          this.formSearchs[remarkTb].datas['sort'] = prop + ' ASC';
        }
      } else {
        this.formSearchs[remarkTb].datas['sort'] = null;
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
        if (name != 'dicID') {
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
      form['rows'] = 0;
      let res = await ExportData(form);
      this.adminLoading = false;
      this.$store.dispatch('user/exportData', res.data);
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
    // 退回
    async dataDel(remarkTb, index, parms) {
      if (this.selectionData[remarkTb].length == 0) {
        this.$message.error('请选择需要操作的数据！');
        return;
      }
      this.$confirm(
        '确定要退回的【' +
          this.selectionData[remarkTb].length +
          '】数据吗，如果已经报工则无法退回？',
      )
        .then((_) => {
          this.selectionData[remarkTb].forEach((x) => {
            x['ElementDeleteFlag'] = 1;
          });
          this.adminLoading = true;
          _this.dataSave(remarkTb, index, null, this.selectionData[remarkTb]);
        })
        .catch((_) => {});
    },
    updateSAP(remarkTb, index, parms) {
      let res = null;
      this.getSelectionData();
      let newData = [];
      if (parms && parms.dataName) {
        if (this[parms.dataName][remarkTb].length == 0) {
          this.$message.error('请单击需要操作的数据！');
          return;
        } else {
          this[parms.dataName][remarkTb].forEach((x) => {
            let obj = x;

            newData.push(obj);
          });
        }
      } else {
        this.tableData[remarkTb].forEach((y) => {
          let obj2 = y;

          newData.push(obj2);
        });
      }
      this.$confirm(
        '确定要同步的【' +
          newData.length +
          '】数据吗，如果已经同步过则无法再次同步',
      )
        .then(async (_) => {
          this.adminLoading = true;

          let res = await GetSearch(newData, '/APSAPI/UpdateERPInfo');
          const { result, data, count, msg } = res.data;

          if (result) {
            this.adminLoading = false;
            this.$message({
              message: msg,
              type: 'success',
              dangerouslyUseHTMLString: true,
            });
          } else {
            this.adminLoading = false;
            this.$message({
              message: msg,
              type: 'error',
              dangerouslyUseHTMLString: true,
            });
          }
        })
        .catch((_) => {});
    },
    resetScheduling() {
      this.$confirm('确定要重新排全部数据吗？')
        .then(async (_) => {
          this.adminLoading = true;

          let sheet = this.spread[this.labelStatus1].getActiveSheet();
          let submitData = sheet.getDataSource();
          submitData.forEach((m) => {
            m['isChecked'] = true;
          });
          if (submitData.length >= 0) {
            this.adminLoading = true;
            let res = await GetSearch(
              submitData,
              '/APSAPI/MOPlanSaveToDayPlan?isPlan=1',
            );
            const { result, data, count, msg } = res.data;
            if (result) {
              this.dataSearch(0);
              this.adminLoading = false;
              this.$message({
                message: msg,
                type: 'success',
                dangerouslyUseHTMLString: true,
              });
            } else {
              this.adminLoading = false;
              this.$message({
                message: msg,
                type: 'error',
                dangerouslyUseHTMLString: true,
              });
            }
          } else {
            this.$message({
              message: '未有数据',
              type: 'error',
              dangerouslyUseHTMLString: true,
            });
          }
        })
        .catch((_) => {});
    },
    // 单击行
    handleRowClick(row, remarkTb) {
      this.delData[remarkTb] = [];
      this.delData[remarkTb].push(row);
    },
    // 保存
    async dataSave(remarkTb, index, parms, newData) {
      this.adminLoading = true;
      const sheet = this.spread[remarkTb]?.getActiveSheet();

      const $table = this.$refs[`tableRef${remarkTb}`]?.[0].$refs.vxeTable;
      if (sheet.isEditing()) {
        sheet.endEdit();
      }
      // 获取修改记录
      let updateRecords = [];
      if (newData) {
        updateRecords = newData;
      } else {
        if ($table) {
          updateRecords = $table.getUpdateRecords();
        } else {
          let DirtyRows = sheet.getDirtyRows().map((row) => row.item); //获取修改过的数据
          let InsertRows = sheet.getInsertRows().map((row) => row.item); //获取插入过的数据
          let DeletedRows = sheet.getDeletedRows().map((row) => row.item);
          DeletedRows.forEach((item) => {
            item['ElementDeleteFlag'] = 1;
          }); //获取被删除的数据
          updateRecords = [...DirtyRows, ...InsertRows, ...DeletedRows];
        }
      }

      if (updateRecords.length == 0) {
        this.$set(this, 'adminLoading', false);
        this.$message.error('当前数据没做修改，请先修改再保存！');
        return;
      }
      let res = await SaveMOPlanStep4(updateRecords);
      // let res = await GetSearch(updateRecords, "/APSAPI/SaveData10093");
      const { datas, forms, result, msg } = res.data;
      if (result) {
        this.$message({
          message: msg,
          type: 'success',
          dangerouslyUseHTMLString: true,
        });
        this.dataSearch(remarkTb);
        this.$set(this, 'adminLoading', false);
      } else {
        this.$message({
          message: msg,
          type: 'error',
          dangerouslyUseHTMLString: true,
        });
        this.$set(this, 'adminLoading', false);
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
          // m.forEach((n) => {
          //   // 进行验证
          //   this.verifyData(n);
          //   if (n.children && n.children.length != 0) {
          //     n.children.forEach((x) => {
          //       this.verifyData(x);
          //     });
          //   }
          // });
          m.some((n, index) => {
            if (index === 1) {
              this.tablePagination[i]['pageSize'] = n['pageSize'];
              this.hasSelect[i] = n['IsSelect'];
              this.Region[i] = n['Region'] ? n['Region'] : this.Region[i];
            }
          });
          this.$set(this.tableColumns, i, m);
        });
        // 获取查询的初始化字段 组件 按钮
        forms.some((x, z) => {
          this.$set(this.formSearchs[z].datas, 'dicID', IDs[z].ID);
          x.forEach((y) => {
            if (y.prop && y.value) {
              this.$set(this.formSearchs[z].datas, [y.prop], y.value);
            } else {
              this.$set(this.formSearchs[z].datas, [y.prop], '');
            }
          });
          this.$set(this.formSearchs[z], 'forms', x);
        });
        //给月计划赋值当月订单总数
        // let res = await GetSearchData({
        //   dicID: 5170,
        //   fields: "SUM(PlanQty) As PlanQty",
        //   ProcessGroupName: "激光",
        //   CompletionStatus: 0,
        //   PlanDay: [
        //     this.$moment().startOf("month").format("YYYY-MM-DD"),
        //     this.$moment().endOf("month").format("YYYY-MM-DD"),
        //   ],
        // });
        // const {
        //   data: [{ PlanQty }],
        // } = res.data;
        // this.title2 = `${this.$moment().format("YYYY年M月")} 订单总数：${
        //   PlanQty ? PlanQty : ""
        // }`;
        this.dataSearch(0);
      }
    },
    // 验证数据
    verifyData(n) {
      for (let name in n) {
        if (
          (name == 'component' && n[name]) ||
          (name == 'button' && n[name]) ||
          (name == 'active' && n[name])
        ) {
          n[name] = eval('(' + n[name] + ')');
        }
      }
    },
    // 获取表格数据
    async getTableData(form, remarkTb) {
      this.$set(this.tableLoading, remarkTb, true);
      form['rows'] = this.tablePagination[remarkTb].pageSize;
      form['page'] = this.tablePagination[remarkTb].pageIndex;
      form['dicID'] = this.sysID[remarkTb]['ID'];
      form['ControlID'] = this.userInfo.WorkFlowInstanceID;
      let res = await GetSearchData(form);

      const { result, data, count, msg, Columns } = res.data;
      if (result) {
        // 获取每个表头
        Columns.some((m, i) => {
          this.$set(this.tableColumns, i, m);
        });
        this.$set(this.tableData, remarkTb, data);
        this.setData(remarkTb);
        this.$set(this.tablePagination[remarkTb], 'pageTotal', count);
      } else {
        this.$message({
          message: msg,
          type: 'error',
          dangerouslyUseHTMLString: true,
        });
      }
      this.$set(this.tableLoading, remarkTb, false);
    },
    // 渲染数据
    setData(remarkTb) {
      this.spread[remarkTb].suspendPaint();
      let sheet = this.spread[remarkTb].getActiveSheet();
      sheet.options.allowCellOverflow = true;
      sheet.defaults.rowHeight = 23;
      sheet.defaults.colWidth = 100;
      sheet.defaults.colHeaderRowHeight = 23;
      sheet.defaults.rowHeaderColWidth = 60;
      let colHeader1 = [];
      // let colInfos = [];
      console.log(this.checkBoxCellTypeLine);
      sheet.setDataSource(this.tableData[remarkTb]);

      // 渲染列
      this.tableColumns[remarkTb].forEach((x, y) => {
        x['name'] = x['prop'];
        x['displayName'] = x['label'];
        x['width'] = parseInt(x.width);
        if (x.prop === 'isChecked') {
          // 选框
          sheet.setCellType(
            0,
            0,
            new HeaderCheckBoxCellType(),
            GCsheets.SheetArea.colHeader,
          );
          x.cellType = new GC.Spread.Sheets.CellTypes.CheckBox();
        } else if (x.prop === 'LineID') {
          let newData = [];
          let list = null;
          this.tableData[remarkTb].map((item, index) => {
            if (item['Lines']) {
              newData = item['Lines'];
              if (newData.length !== 0 && newData) {
                list = new GCsheets.CellTypes.ComboBox();
                list.editorValueType(
                  GC.Spread.Sheets.CellTypes.EditorValueType.value,
                );
                list.editable(true);
                list.items(newData);
                list.itemHeight(24);
                sheet
                  .getCell(index, y, GCsheets.SheetArea.viewport)
                  .cellType(list);
              }
            } else {
              item['LineID'] = null;
            }
          });
          // colInfos.push({
          //   name: x.prop,
          //   displayName: x.label,
          //   cellType: "",
          //   size: parseInt(x.width)
          // });
        } else if (
          x.ControlType === 'comboboxMultiple' ||
          x.ControlType === 'combobox'
        ) {
          // colInfos.push({
          //   name: x.prop,
          //   displayName: x.label,
          //   cellType: "",
          //   size: parseInt(x.width)
          // });
          let newData = [];
          // let list = null;
          this.tableData[remarkTb].map((item, index) => {
            if (x.DataSourceID && x.DataSourceName) {
              newData = item[x.DataSourceName]; // 设置列表每行下拉菜单
              this.bindComboBoxToCell(sheet, index, y, newData);
            }
          });
        } else if (
          x.DataType == 'datetime' ||
          x.DataType === 'varchar' ||
          x.DataType === 'nvarchar'
        ) {
          x.formatter = '@';
          // colInfos.push({
          //   name: x.prop,
          //   displayName: x.label,
          //   size: parseInt(x.width),
          //   formatter: "@" //字符串格式
          // });
        }

        //行，start,end
        if (x.isEdit) {
          sheet.getCell(-1, y).locked(false).foreColor('#2a06ecd9');
          // sheet.getRange(-1, cellIndex, 1, 1).locked(false);
          // let cell = sheet.getCell(
          //   -1,
          //   cellIndex,
          //   GC.Spread.Sheets.SheetArea.viewport
          // );
          // cell.foreColor("#2a06ecd9");
        }
        // cellIndex++;
      });
      //渲染列
      sheet.bindColumns(this.tableColumns[remarkTb]); //此方法一定要放在setDataSource后面才能正确渲染列名
      sheet.setRowCount(1, GC.Spread.Sheets.SheetArea.colHeader);
      colHeader1.forEach(function (value, index) {
        sheet.setValue(0, index, value, GC.Spread.Sheets.SheetArea.colHeader);
      });

      var defaultStyle = new GC.Spread.Sheets.Style();
      defaultStyle.font =
        '12px basefontRegular, Roboto, Helvetica, Arial, sans-serif';
      defaultStyle.hAlign = GC.Spread.Sheets.HorizontalAlign.left;
      defaultStyle.vAlign = GC.Spread.Sheets.HorizontalAlign.center;
      defaultStyle.borderLeft = new GC.Spread.Sheets.LineBorder(
        'gray',
        GC.Spread.Sheets.LineStyle.thin,
      );
      defaultStyle.borderTop = new GC.Spread.Sheets.LineBorder(
        'gray',
        GC.Spread.Sheets.LineStyle.thin,
      );
      defaultStyle.borderRight = new GC.Spread.Sheets.LineBorder(
        'gray',
        GC.Spread.Sheets.LineStyle.thin,
      );
      defaultStyle.borderBottom = new GC.Spread.Sheets.LineBorder(
        'gray',
        GC.Spread.Sheets.LineStyle.thin,
      );
      defaultStyle.showEllipsis = true;
      sheet.setDefaultStyle(defaultStyle, GC.Spread.Sheets.SheetArea.viewport);

      // 冻结第一列

      sheet.frozenColumnCount(this.tableColumns[remarkTb][0].FixCount);

      // 列筛选
      // 参数2 开始列
      // 参数3
      // 参数4 结束列
      let cellrange = new GC.Spread.Sheets.Range(
        -1,
        -1,
        -1,
        this.tableColumns[remarkTb].length,
      );
      let hideRowFilter = new GC.Spread.Sheets.Filter.HideRowFilter(cellrange);
      sheet.rowFilter(hideRowFilter);

      // sheet.bindColumns(colInfos);
      this.spread[remarkTb].options.tabStripVisible = false; //是否显示表单标签

      //改变字体颜色
      this.tableData[remarkTb].forEach((rowItem, rowIndex) => {
        this.tableColumns[remarkTb].forEach((columnItem, columnIndex) => {
          // 获取当前单元格
          const cell = sheet.getCell(rowIndex, columnIndex);
          cell.foreColor('black');
          cell.backColor('white');
          if (columnItem['isEdit']) {
            cell.locked(false).foreColor('#2a06ecd9');
          }
          if (rowItem['Code'] == null) {
            cell.backColor('#A0CFFF');
            cell.foreColor('black');
          } else if (rowItem['MFGOrganizeID'] === 162) {
            cell.backColor('#FFFF00');
            cell.foreColor('black');
          }
          if (rowItem['Capacity'] && columnItem['name'] === 'Capacity') {
            cell.foreColor('red');
          }
          if (
            Object.prototype.toString.call(rowItem['FColors']) ===
            '[object Object]'
          ) {
            Object.keys(rowItem['FColors']).forEach((key) => {
              const columnIndex = this.tableColumns[remarkTb].findIndex(
                (columnItem) => columnItem.prop === key,
              );
              if (columnIndex !== -1) {
                // 这里使用 rowIndex 和 columnIndex 获取单元格
                const cell = sheet.getCell(rowIndex, columnIndex);
                cell.foreColor(rowItem['FColors'][key]);
              }
            });
          }
          if (
            Object.prototype.toString.call(rowItem['BColors']) ===
            '[object Object]'
          ) {
            Object.keys(rowItem['BColors']).forEach((key) => {
              const columnIndex = this.tableColumns[remarkTb].findIndex(
                (columnItem) => columnItem.prop === key,
              );
              if (columnIndex !== -1) {
                // 这里使用 rowIndex 和 columnIndex 获取单元格
                const cell = sheet.getCell(rowIndex, columnIndex);
                cell.backColor(rowItem['BColors'][key]);
              }
            });
          }
        });
      });

      let cellIndex = 0;
      let viewSortIndex = 0; //排序的索引
      let lineIDIndex = 0;
      this.tableColumns[remarkTb].forEach((m) => {
        //行，start,end
        if (m.prop == 'ViewSort') {
          viewSortIndex = cellIndex;
        }
        if (m.prop == 'LineID') {
          lineIDIndex = cellIndex;
        }
        //行，start,end
        if (m.isEdit) {
          sheet.getRange(-1, cellIndex, 1, 1).locked(false);
          var cell = sheet.getCell(
            -1,
            cellIndex,
            GC.Spread.Sheets.SheetArea.viewport,
          );
          //cell.foreColor("#2a06ecd9");
        } else {
          var cell = sheet.getCell(
            -1,
            cellIndex,
            GC.Spread.Sheets.SheetArea.viewport,
          );
          // cell.foreColor("gray");
        }

        cellIndex++;
      });
      sheet.options.protectionOptions.allowResizeColumns = true;
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

      var insertRowsCopyStyle = {
        canUndo: true,
        name: 'insertRowsCopyStyle',
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
                GC.Spread.Sheets.CopyToOptions.all,
              );

              //   sheet.setArray(options.activeRow, 0, _this.sheetSelectRows);
              sheet.deleteRows(
                _this.sheetSelectObj.start + _this.sheetSelectRows.length,
                _this.sheetSelectObj.count,
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
                GC.Spread.Sheets.CopyToOptions.all,
              );
              //  sheet.setArray(options.activeRow, 0, _this.sheetSelectRows);
              sheet.deleteRows(
                _this.sheetSelectObj.start,
                _this.sheetSelectObj.count,
              );
            }
            let count = sheet.getRowCount(GC.Spread.Sheets.SheetArea.viewport);

            let lineID = _this.sheetSelectRows[0][lineIDIndex];
            let isFind = false;
            let viewSort = 1;

            for (var i = 0; i < count; i++) {
              if (isFind == false && sheet.getValue(i, lineIDIndex) == lineID) {
                isFind = true;
              }
              if (isFind && sheet.getValue(i, lineIDIndex) != lineID) {
                break;
              }
              if (isFind) {
                sheet.setValue(i, viewSortIndex, viewSort);
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

      this.spread[remarkTb]
        .commandManager()
        .register('insertRowsCopyStyle', insertRowsCopyStyle);

      function MyContextMenu() {}
      MyContextMenu.prototype = new GC.Spread.Sheets.ContextMenu.ContextMenu(
        this.spread[remarkTb],
      );
      MyContextMenu.prototype.onOpenMenu = function (
        menuData,
        itemsDataForShown,
        hitInfo,
        spread,
      ) {
        itemsDataForShown.forEach(function (item, index) {
          // console.log(item);
          if (item && item.name === 'gc.spread.rowHeaderinsertCutCells') {
            item.command = 'insertRowsCopyStyle';
          }
          //  else if (item && item.name === "gc.spread.cut") {

          //     item.command = "insertRowsCut";
          //   }
        });
      };
      var contextMenu = new MyContextMenu();
      this.spread[remarkTb].contextMenu = contextMenu;
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
            _this.tableColumns[remarkTb].length,
          );
          _this.sheetSelectObj.start = s.row;

          _this.sheetSelectObj.count = s.rowCount;
        },
      );

      /////////////////表格事件/////////////
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
      //表格编辑事件

      this.spread[remarkTb].bind(
        GCsheets.Events.EditStarting,
        function (e, args) {},
      );
      this.spread[remarkTb].bind(GCsheets.Events.EditEnded, function (e, args) {
        // 自动计算数量

        _this.computedNum(args.row, args.col, args.editingText);
        // for (var i = args.col + 1; i < _this.tableColumns[0].length; i++) {
        //   sheet.setArray(args.row, i, [2021]);
        // }
      });
      // 表格单击齐套率弹框事件
      this.spread[remarkTb].bind(GCsheets.Events.CellClick, function (e, args) {
        if (_this.tableColumns[remarkTb].length) {
          _this.tableColumns[remarkTb].map((item, index) => {
            if (item['prop'].indexOf('FormRate') !== -1 && args.col === index) {
              console.log('OrderID', _this.tableData[remarkTb]);
              // 显示ERP供需平衡表
              _this.colDialogVisible = true;
              _this.dialogSearchForm.OrderID =
                _this.tableData[remarkTb][args.row].OrderID;
              _this.dialogSearchForm.OweQty = 0;
              if (item['prop'] === 'FormRate') {
                _this.dialogSearchForm.DemandDate =
                  _this.tableData[remarkTb][args.row]['D0'];
              } else if (item['prop'] === 'FormRate1') {
                _this.dialogSearchForm.DemandDate =
                  _this.tableData[remarkTb][args.row]['D1'];
              } else if (item['prop'] === 'FormRate2') {
                _this.dialogSearchForm.DemandDate =
                  _this.tableData[remarkTb][args.row]['D2'];
              }
            }
          });
        }
      });
      //脏数据清除
      sheet.bind(GC.Spread.Sheets.Events.RowChanged, function (e, info) {
        console.log(
          info.row +
            ',' +
            info.col +
            ',' +
            '由' +
            info.oldValue +
            '改变为' +
            info.newValue,
        );
        var arr = sheet.getDirtyRows();
        var arr2 = sheet.getInsertRows();
        console.log(arr, arr2);
        // sheet.clearPendingChanges();
      });
      this.spread[remarkTb].resumePaint();
      this.adminLoading = false;
      this.tableLoading[remarkTb] = false;
      this.spread[remarkTb].refresh(); //重新定位宽高度
    },
    bindComboBoxToCell(sheet, row, col, dataSourceName) {
      // 获取要绑定下拉菜单的单元格对象
      let cell = sheet.getCell(row, col);

      // 创建下拉菜单单元格类型，并设置其选项数据
      let comboBox = new GC.Spread.Sheets.CellTypes.ComboBox();
      comboBox.editorValueType(
        GC.Spread.Sheets.CellTypes.EditorValueType.value,
      );
      comboBox.editable(true);
      // 获取下拉菜单的选项数据

      comboBox.items(dataSourceName);
      comboBox.itemHeight(24);

      // 将下拉菜单单元格类型绑定到指定的单元格中
      cell.cellType(comboBox);
    },
    // 自动计算数量
    computedNum(rowIndex, colIndex, val) {
      let sheet = this.spread[this.labelStatus1].getActiveSheet();
      let dataSource = sheet.getDataSource();
      if (val == null) {
        val = 0;
      } else if (val == 0) {
        //输入0不触发自动计算
        return;
      }
      let currentRow = dataSource[rowIndex];
      if (currentRow.ID == -1) {
        return false;
      }
      let currentlabel = this.tableColumns[0][colIndex].prop + 'dy';
      if (!currentRow[currentlabel]) {
        //不是天日的数量
        currentlabel = this.tableColumns[0][colIndex].prop;
        // if (currentlabel == "ViewSort") {
        //   val = currentRow[currentlabel];
        //   if (val) {
        //     let newRowindex = 1;
        //     let flag = false;
        //     let lineID = currentRow["LineID"];
        //     //循环上面
        //     for (var r = 0; r < dataSource.length - 1; r++) {
        //       let row = dataSource[r];
        //       if (lineID != row["LineID"]) {
        //         continue;
        //       }
        //       let thisValue = newRowindex; //row[currentlabel];
        //       if (row["Code"] == null || row["Code"] == "") {
        //         break;
        //       }
        //       if (r < rowIndex) {
        //         //当前循环的在当前操作行的上面
        //         if (thisValue >= val && flag === false) {
        //           newRowindex = val + 1;
        //           flag = true;
        //         }

        //         thisValue = newRowindex;
        //         newRowindex++;
        //       } else if (r > rowIndex) {
        //         //当前循环的在当前操作行的下面
        //         if (newRowindex == val) {
        //           newRowindex++;
        //         }

        //         thisValue = newRowindex;
        //         newRowindex++;
        //       } else {
        //         thisValue = val;
        //       }
        //       sheet.setValue(r, colIndex, thisValue);
        //     }
        //   }
        // } else {
        // }
        sheet.setDataSource(this.tableData[this.labelStatus1]);
        return;
      }
      if (
        !currentRow[currentlabel].TotalHours ||
        parseInt(currentRow[currentlabel].TotalHours) <= 0
      ) {
        this.$message.error('该天休息，上班时间为0');

        sheet.setValue(rowIndex, colIndex, '');

        return;
      }

      let Qty = parseInt(currentRow.OweQty);
      let Capacity = parseInt(currentRow.Capacity);
      if (!Capacity) {
        this.$message.error('该单据没有产能');
        return;
      }
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
          if (x.prop2 && i != colIndex && currentRow[x.prop]) {
            list.push('');
          } else {
            list.push(currentRow[x.prop]);
          }
        }
      });
      remainNum = Qty - editNum;

      if (parseInt(val) > remainNum) {
        this.$message.error(
          '输入的数量不能大于剩余排产数，剩余排产数为：' + remainNum,
        );
        list[colIndex] = '';
        for (var j = 0; j < this.tableColumns[0].length; j++) {
          sheet.setArray(rowIndex, j, [list[j]]);
        }
        return;
      } else {
        // 接着计算下面每一个空格该有的数
        for (var j = colIndex + 1; j < this.tableColumns[0].length; j++) {
          if (this.tableColumns[0][j]['prop2']) {
            let label = this.tableColumns[0][j].prop + 'dy';
            let obj = currentRow[label];
            remainNum = remainNum - parseInt(val);
            let maxNum =
              (Capacity * obj.TotalHours * obj.DayCapacity) /
              currentRow.StandardPeoples;
            maxNum = parseInt(maxNum);
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
        }
        for (var j = 0; j < this.tableColumns[0].length; j++) {
          sheet.setArray(rowIndex, j, [list[j]]);
        }
      }
    },
    // 刷新页面
    refrshPage() {
      this.$store.dispatch('tagsView/delCachedView', this.$route).then(() => {
        const { fullPath } = this.$route;
        this.$nextTick(() => {
          this.$router.replace({
            path: '/redirect' + fullPath,
          });
        });
      });
    },
    //////////////////////////////
    async getOrgData() {
      this.getLineData(this.userInfo.WorkFlowInstanceID);
      return;
    },
    // 获取线别数据
    async getLineData(ERPOrderCode) {
      this.lines = [];
      let res = await GetSearchData({
        dicID: 36,
        OrganizeTypeID: 6,
        ERPOrderCode: ERPOrderCode,
      });
      const { data, forms, result, msg } = res.data;
      if (result) {
        let newData = [];
        this.treeData2 = data;
        this.treeListTmp2 = data;
        this.adminLoading = false;
        if (data.length != 0) {
          data.forEach((x) => {
            newData.push({ text: x.OrganizeName, value: x.OrganizeID });
          });
        }
        this.lines = newData;
        this.checkBoxCellTypeLine = new GCsheets.CellTypes.ComboBox();
        this.checkBoxCellTypeLine.editorValueType(
          GC.Spread.Sheets.CellTypes.EditorValueType.value,
        );
        this.checkBoxCellTypeLine.items(newData);
        this.checkBoxCellTypeLine.itemHeight(24);
        // this.formSearchs[0].datas.ControlID="202";
        this.getTableData(this.formSearchs[0].datas, 0);
      } else {
        this.adminLoading = false;
        this.$message({
          message: msg,
          type: 'error',
          dangerouslyUseHTMLString: true,
        });
      }
    },
    searchTree(msg, dataName, dataName2, valueName) {
      this[dataName] = [];
      let treeListTmp = JSON.parse(JSON.stringify(this[dataName2]));
      let tmp = msg
        ? this.rebuildData(msg, treeListTmp, valueName)
        : JSON.parse(JSON.stringify(treeListTmp));
      this[dataName].push(...tmp);
    },
    rebuildData(value, arr, valueName) {
      if (!arr) {
        return [];
      }
      let newarr = [];
      if (Object.prototype.toString.call(arr) === '[object Array]') {
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
      // this.formSearchs[0].datas["ControlID"] = data.ERPOrderCode;
      //this.dataSearch(0);
      this.getLineData(data.OrganizeID);
    },
    // 单击出来线别
    handleNodeClick2(data, node) {
      this.$set(this.formSearchs[0].datas, 'LineID', data.OrganizeID);
      this.dataSearch(0);
    },
    changeStatus(item, index) {
      this.labelStatus1 = index;
    },
    // 选择数据
    selectFun(data, remarkTb, row) {
      this.selectionData[remarkTb] = data;
    },
    // 保存日计划
    async dataSaveDay() {
      let sheet = this.spread[this.labelStatus1].getActiveSheet();
      if (sheet.isEditing()) {
        sheet.endEdit();
      }
      let newData = sheet.getDirtyRows();
      let submitData = [];
      if (newData.length != 0) {
        newData.forEach((x) => {
          submitData.push(x.item);
        });
      }
      newData = sheet.getInsertRows();
      if (newData.length != 0) {
        newData.forEach((x) => {
          x.item['dicID'] = this.sysID[this.labelStatus1]['ID'];
          submitData.push(x.item);
        });
      }
      if (submitData.length == 0) {
        this.$message.error('没修改过任何数据！');
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
          type: 'success',
          dangerouslyUseHTMLString: true,
        });
      } else {
        this.adminLoading = false;
        this.$message({
          message: msg,
          type: 'error',
          dangerouslyUseHTMLString: true,
        });
      }
    },
    async suspend(remarkTb, index, parms) {
      let res = null;
      this.getSelectionData();
      let newData = [];

      this.$confirm(
        '确定要暂停【' + this[parms.dataName][remarkTb].length + '】数据吗？',
      )
        .then((_) => {
          if (parms && parms.dataName) {
            if (this[parms.dataName][remarkTb].length == 0) {
              this.$message.error('请选择需要操作的数据！');
              return;
            } else {
              this[parms.dataName][remarkTb].forEach((x) => {
                let obj = x;
                obj['ProductionStatus'] = 24;
                newData.push(obj);
              });
            }
          } else {
            this.tableData[remarkTb].forEach((y) => {
              let obj2 = y;
              obj['ProductionStatus'] = 24;
              newData.push(obj2);
            });
          }
          this.adminLoading = true;
          _this.dataSave(remarkTb, index, null, newData);
        })
        .catch((_) => {});
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
    //在该行数据下面增加新的一行
    copyRowFormat(rowNumber, sheet) {
      sheet.addRows(rowNumber + 1, 1);
      sheet.copyTo(
        rowNumber,
        -1,
        rowNumber + 1,
        -1,
        1,
        -1,
        GC.Spread.Sheets.CopyToOptions.all,
      );
      let newRowIndex = rowNumber + 1;
      let oldData = sheet.getDataSource()[rowNumber]; // 获取数据源中旧行的值
      // newData = JSON.parse(JSON.stringify(oldData));
      this.tableData[0][newRowIndex] = JSON.parse(JSON.stringify(oldData));
      let newData = this.tableData[0][newRowIndex]; // 获取数据源中新行的值
      let SQtyObj = this.selectionData[1].find(
        (item) => item['RowNumber'] === oldData['RowNumber'],
      );
      //去掉dy前面的值
      const objKeys = Object.keys(newData);
      objKeys.forEach((key) => {
        if (key.endsWith('dy')) {
          newData[key.replace(/dy$/, '')] = null;
        }
      });
      oldData['PlanQty'] = oldData['PlanQty'] - SQtyObj['SQty'];
      newData['ProcessPlanID'] = 0; // 将 ProcessPlanID 值设置为 0
      newData['LineID'] = null;
      newData['PlanQty'] = SQtyObj['SQty'];
      newData['HasQty'] = null;
      this.$nextTick(() => {
        sheet.setDataSource(sheet.getDataSource()); // 更新数据源
        sheet.repaint();
      });
    },
    // 复制
    async changeEvent(val) {
      if (val == 0) {
        if (this.selectionData[0].length === 0) {
          this.$message.error('请选择需要拆单的数据！');
          return;
        }
        this.Dialog = true;
        let targetArray = JSON.parse(JSON.stringify(this.selectionData[0]));
        let targetColumns = JSON.parse(JSON.stringify(this.tableColumns[0]));

        targetColumns = targetColumns.filter(
          (item) =>
            item.label == '生产订单' ||
            item.label == '数量' ||
            item.label == '计划数',
        );
        targetColumns.push({
          label: '拆单数量',
          prop: 'SQty',
        });
        targetColumns.map((item) => {
          item['width'] = 250;
          if (item.label === '拆单数量') {
            item['isEdit'] = true;
          } else {
            item['isEdit'] = false;
          }
        });
        this.$set(this.tableColumns, 1, targetColumns);
        this.$nextTick(() => {
          this.$set(this.tableData, 1, targetArray);
          this.setData(1);
        });
      } else if (val === 1) {
        const errorNum1 = this.selectionData[1].findIndex(
          (item) => !item['SQty'],
        );
        if (errorNum1 !== -1) {
          this.$message.error(`第${errorNum1 + 1}行数据的拆分数量没有填写`);
          return;
        }

        const errorNum2 = this.selectionData[1].findIndex((item) => {
          return item['SQty'] > item['Qty'];
        });
        if (errorNum2 !== -1) {
          this.$message.error(`第${errorNum2 + 1}行数据的拆分数量超出可填范围`);
          return;
        }
        this.Dialog = false;
        let sheet = this.spread[0].getActiveSheet();
        const changedIndices = [];
        this.tableData[0].forEach((element, index) => {
          if (element['isChecked']) {
            changedIndices.push(index);
          }
        });
        //每增加一行，需要插入新的一行，后面一行比前面一行多1
        const arr = changedIndices.map((num, index) => num + index);
        //处理脏数据
        arr.forEach((item) => {
          this.copyRowFormat(item, sheet);
          console.log(item, 'item');
        });
        this.$nextTick(() => {
          sheet.setDataSource(sheet.getDataSource()); // 更新数据源
          sheet.repaint();
        });
        await this.dataSave(this.labelStatus1);
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
