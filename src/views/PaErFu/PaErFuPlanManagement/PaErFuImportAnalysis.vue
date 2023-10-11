<!-- 激光月计划 -->
<template>
  <div
    class="APSContainer flex_column content_height bgWhite"
    v-loading="adminLoading"
  >
    <div class="admin_head" ref="headRef">
      <div v-for="i in [0]" :key="i + 'head'" v-show="labelStatus1 === i">
        <ComSearch
          ref="searchRef"
          :searchData="formSearchs[0].datas"
          :searchForm="formSearchs[0].forms"
          :remark="0"
          :isLoading="isLoading"
          :btnForm="btnForm"
          :signName="0"
          :Region="Region[0]"
          @btnClick="btnClick"
        />
      </div>
    </div>
    <div class="admin_content pd-0-6">
      <div class="ant-table-title">
        <el-row>
          <el-col :span="8"
            ><span class="title">{{ title }}</span>
          </el-col>
          <el-col :span="16" class="flex_flex_end">
            <div style="margin-right: 10px">
              <span>截止日期</span>
              <el-date-picker
                v-model="machineCycle"
                type="date"
                size="small"
                value-format="yyyy-MM-dd"
                placeholder="请选择"
              >
              </el-date-picker>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div
      class="admin_content flex_grow"
      id="tableContainer"
      v-for="item in [0]"
      :key="item"
    >
      <ComSpreadTable
        ref="spreadsheetRef"
        :height="'100%'"
        :tableData="tableData[item]"
        :tableColumns="tableColumns[item]"
        :tableLoading="tableLoading[item]"
        :remark="item"
        :sysID="sysID[item]['ID']"
        :pagination="tablePagination[item]"
        @pageChange="pageChange"
        @pageSize="pageSize"
        @workbookInitialized="workbookInitialized"
        @selectChanged="selectChanged"
      />
    </div>
    <!-- 导入文件 -->
    <div>
      <el-dialog title="导入" :visible.sync="dialogImport" width="50%">
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
          <div class="el-upload__tip" slot="tip">
            只能上传xls、xslx文件且仅支持上传一个文件
          </div>
        </el-upload>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogImport = false" size="small"
            >取 消</el-button
          >
          <el-button size="small" type="primary" @click="sureImport"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
var _this;
const GCsheets = GC.Spread.Sheets;
import '@grapecity/spread-sheets-vue';
import XLSX from 'xlsx';
import GC from '@grapecity/spread-sheets';
import '@grapecity/spread-sheets/styles/gc.spread.sheets.excel2013white.css';
import '@grapecity/spread-sheets/js/zh.js';
import { mapState } from 'vuex';
GC.Spread.Common.CultureManager.culture('zh-cn');
import ComSearch from '@/components/ComSearch/AdvancedSearch';
import ComReportTable from '@/components/ComReportTable';
import ComAsideTree from '@/components/ComAsideTree';
import ComSpreadTable from '@/components/ComSpreadTable';
import ComVxeTable from '@/components/ComVxeTable';
import { HeaderCheckBoxCellType } from '@/static/data.js';
import {
  GetHeader,
  GetSearchData,
  ExportData,
  SaveData,
  GetSearch,
} from '@/api/Common';
import formatDates, {
  formatNextMonthDate,
  formatDate,
} from '@/utils/formatDate';
import { SaveMOPlanStep4 } from '@/api/PageTwoScheduling';
import DialogTable from '@/components/Dialog/dialogTable';
import DialogOptTable from '@/components/Dialog/dialogOptTable';
export default {
  name: 'PaErFuImportAnalysis',
  components: {
    ComSearch,
    ComReportTable,
    ComAsideTree,
    DialogOptTable,
    ComVxeTable,
    ComSpreadTable,
  },
  data() {
    return {
      dialogImport: false,
      labelStatus1: 0,
      spread: [[], []],
      machineCycle: '',
      dialogSearchForm: {
        OrderID: '',
      },
      ////////////////// Search /////////////////
      title: this.$route.meta.title,
      title2: null,
      drawer: false,
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
      tableData: [[], [], [], []],
      tableColumns: [[], [], [], []],
      tableLoading: [false, false, false, false],
      isClear: [false, false, false, false],
      hasSelect: [false, false, false, false],
      tablePagination: [
        { pageIndex: 1, pageSize: 3000, pageTotal: 0 },
        { pageIndex: 1, pageSize: 3000, pageTotal: 0 },
        { pageIndex: 1, pageSize: 3000, pageTotal: 0 },
        { pageIndex: 1, pageSize: 0, pageTotal: 0 },
      ],
      height: '707px',
      treeHeight: '765px',
      showPagination: true,
      tagRemark: 0,
      isLoading: false,
      sysID: [{ ID: 8994 }],
      fileList: [],
      adminLoading: false,
      checkBoxCellTypeLine: '',
      isOpen: true,
      selectionData: [[], []],
      NoWorkHour: [],
      LineViewSort: [],
      sheetSelectRows: [],
      sheetSelectObj: { start: 0, end: 0, count: 0 },
      isEdit: [false, false, false],
      colDialogVisible1: false,
      colDialogVisible2: false,
      Status1: [
        { label: '未完成', value: 0, index: 0 },
        { label: '已完成', value: 1, index: 3 },
        { label: '全部', value: '', index: 4 },
        { label: '预测单', value: 2, index: 5 },
      ],
      Region: [5, 6, 6],
      RoleMapStatus: false,
      SalesOrderNo: null,
      Customer: null,
      linkTableData: [],
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
    let tableContainer = document.getElementById('tableContainer'); // 通过 `<div>` 的 ID 获取元素
    // 创建一个 ResizeObserver 实例
    const resizeObserver = new ResizeObserver((entries) => {
      // 当元素的大小发生变化时，会触发此回调函数
      for (const entry of entries) {
        if (entry.target === tableContainer) {
          // 在这里执行你的操作，例如刷新 SpreadJS
          // 你可能需要访问 SpreadJS 实例来调用 refresh() 方法
          this.spread[0].refresh();
        }
      }
    }); // 启动 ResizeObserver 监测 `<div>` 元素的大小变化
    resizeObserver.observe(tableContainer);
    this.keyDown();
  },
  methods: {
    // 更新表格高度的函数
    updateTableHeight() {},
    //按钮权限
    judgeBtn(routeBtn) {
      console.log(routeBtn, 'routeBtn');
      if (routeBtn && routeBtn.length > 0)
        routeBtn.some((item, index) => {
          if (item.ButtonCode == 'save') {
            //假如signName为空，则所有表都显示保存按钮而且全部可编辑，假如不为空，则控制哪个表才可以编辑
            if (!item['signName'] || item['signName'].length === 0) {
              this.isEdit.fill(true);
            } else if (item['signName'] && item['signName'].length > 0) {
              item['signName'].map((item) => {
                this.$set(this.isEdit, item, true);
              });
            }
          }
        });
      routeBtn = routeBtn.filter((item) => {
        if (item.ButtonCode === 'DesignatedPerson') {
          return this.userInfo.RoleMap.some(
            (role) =>
              role.RoleID === 'R2309040001' || role.RoleID === 'E01Admin',
          );
        }
        return true;
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

          this.dataSave(0);
          return false;
        }
      };
    },
    //获取子组件实例
    workbookInitialized: function (workbook, remarkTb) {
      this.spread[remarkTb] = workbook;
    },
    //获取当前选中行的值
    selectChanged(newValue, remarkTb) {
      // 在子组件计算属性发生变化时，更新父组件的计算属性
      this.selectionData[remarkTb] = newValue;
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
    async dataSearch(remarkTb) {
      this.tagRemark = remarkTb;
      this.tableData[remarkTb] = [];
      this.$set(this.tableLoading, remarkTb, true);
      this.$set(this.isClear, remarkTb, true);
      this.tablePagination[remarkTb].pageIndex = 1;
      await this.getTableData(this.formSearchs[remarkTb].datas, remarkTb);
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
    // 删除
    async dataDel(remarkTb, index, parms) {
      let res = null;
      let newData = [];
      if (this.selectionData[remarkTb].length == 0) {
        this.$message.error('请单击需要操作的数据！');
        return;
      } else {
        if (remarkTb === 0) {
          newData = _.cloneDeep(
            this.selectionData[remarkTb]
              .filter((x) => x['DataSource'] !== '业务') // 过滤条件，不包括 "DataSource" 为 "业务" 的对象
              .map((x) => {
                x['ElementDeleteFlag'] = 1;
                return x;
              }),
          );

          if (newData.length === 0) {
            this.$message.error('无数据可以删除或无法删除该数据');
            return;
          }
        } else {
          newData = _.cloneDeep(
            this.selectionData[remarkTb].map((x) => {
              x['ElementDeleteFlag'] = 1;
              return x;
            }),
          );
        }
      }
      this.$confirm('确定要删除的【' + newData.length + '】数据吗？')
        .then((_) => {
          _this.dataSave(remarkTb, index, null, newData);
        })
        .catch((_) => {});
    },
    // 拆单
    splitOrder(remarkTb) {
      if (this.selectionData[remarkTb].length === 0) {
        this.$message.error('请选择需要拆单的数据！');
        return;
      }
      this.colDialogVisible1 = true;
      let targetArray = JSON.parse(
        JSON.stringify(this.selectionData[remarkTb]),
      );

      this.tableColumns[1] = this.tableColumns[1].filter(
        (item) => item.prop == 'PlanQty',
      );
      this.tableColumns[1].push({
        label: '拆单数',
        prop: 'SQty',
      });
      this.tableColumns[1].forEach((item) => {
        item['width'] = 250;
        if (item.label === '拆单数') {
          item['isEdit'] = true;
        } else {
          item['isEdit'] = false;
        }
      });
      this.$nextTick(() => {
        this.$set(this.tableData, 1, targetArray);
        this.setData(1);
      });
    },
    // 拆单
    async changeEvent(val) {
      if (val === 1) {
        const errorNum1 = this.selectionData[1].findIndex(
          (item) => !item['SQty'],
        );
        if (errorNum1 !== -1) {
          this.$message.error(`第${errorNum1 + 1}行数据的拆分数量没有填写`);
          return;
        }

        const errorNum2 = this.selectionData[1].findIndex((item) => {
          return item['SQty'] > item['PlanQty'];
        });
        if (errorNum2 !== -1) {
          this.$message.error(`第${errorNum2 + 1}行数据的拆分数量超出可填范围`);
          return;
        }
        this.colDialogVisible1 = false;
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
          sheet.repaint();
        });
        await this.dataSave(0);
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
      this.tableData[0][newRowIndex] = JSON.parse(JSON.stringify(oldData));
      let newData = this.tableData[0][newRowIndex]; // 获取数据源中新行的值
      let SQtyObj = this.selectionData[1].find(
        (item) => item['RowNumber'] === oldData['RowNumber'],
      );
      //去掉dy前面的值
      // const objKeys = Object.keys(newData);
      // objKeys.forEach((key) => {
      //   if (key.endsWith("dy")) {
      //     newData[key.replace(/dy$/, "")] = null;
      //   }
      // });
      oldData['PlanQty'] = oldData['PlanQty'] - SQtyObj['SQty'];
      newData['SourceID'] = oldData['ID']; // 将 SourceDetailPlanID 值设置为 null
      newData['ID'] = null; // 将 SalesOrderDetailPlanID 值设置为 null
      newData['PlanQty'] = SQtyObj['SQty'];
      newData['DataSource'] = '拆单';
    },
    resetScheduling() {
      this.$confirm('确定要重新排全部数据吗？')
        .then(async (_) => {
          this.adminLoading = true;

          let sheet = this.spread[0].getActiveSheet();
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
      // this.adminLoading = true;
      const sheet = this.spread[remarkTb]?.getActiveSheet();

      const $table = this.$refs[`tableRef${remarkTb}`]?.[0].$refs.vxeTable;
      if (sheet && sheet.isEditing()) {
        sheet.endEdit();
      }
      // 获取修改记录
      let changeRecords = [];
      if (newData) {
        changeRecords = newData;
      } else {
        if ($table) {
          changeRecords = $table.getUpdateRecords();
        } else {
          let DirtyRows = sheet.getDirtyRows().map((row) => row.item); //获取修改过的数据
          let InsertRows = sheet.getInsertRows().map((row) => row.item); //获取插入过的数据
          let DeletedRows = sheet.getDeletedRows().map((row) => row.item);
          DeletedRows.forEach((item) => {
            item['ElementDeleteFlag'] = 1;
          }); //获取被删除的数据
          console.log(DirtyRows, InsertRows, DeletedRows);
          changeRecords = [...DirtyRows, ...InsertRows, ...DeletedRows];
        }
      }
      if (changeRecords.length == 0) {
        this.$set(this, 'adminLoading', false);
        this.$message.error('当前数据没做修改，请先修改再保存！');
        return;
      }
      let res = await SaveData(changeRecords);
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
        await this.changeStatus({ label: '未完成', value: 0, index: 0 }, 0);
        this.adminLoading = false;
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
      let res = await GetSearchData(form);

      const { result, data, count, msg, Columns } = res.data;
      if (result) {
        // 获取每个表头
        Columns.some((m, i) => {
          this.$set(this.tableColumns, i, m);
        });
        this.linkTableData = [];
        if (remarkTb === 2) {
          data.forEach((item1) => {
            // 使用find方法在第二个数组中查找匹配的SaleMan
            const matching = this.tableData[3].find(
              (item2) => item2.SaleMan === item1.Account,
            );
            // 如果找到匹配的SaleMan，将isChecked设置为true
            if (matching) {
              item1.isChecked = true;
              this.linkTableData.push(matching);
            }
          });
        }

        this.$set(this.tableData, remarkTb, data);

        if (remarkTb === 0 || remarkTb === 1) {
          this.setData(remarkTb);
        }

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
        } else if (
          x.ControlType === 'comboboxMultiple' ||
          x.ControlType === 'combobox'
        ) {
          this.tableData[remarkTb].map((item, index) => {
            if (x.DataSourceID && x.DataSourceName) {
              let newData = item[x.DataSourceName]; // 设置列表每行下拉菜单
              // 获取要绑定下拉菜单的单元格对象
              let cell = sheet.getCell(index, y);
              // 创建下拉菜单单元格类型，并设置其选项数据
              let comboBox = new GC.Spread.Sheets.CellTypes.ComboBox();
              comboBox.editorValueType(
                GC.Spread.Sheets.CellTypes.EditorValueType.value,
              );
              comboBox.editable(true);
              // 获取下拉菜单的选项数据
              comboBox.items(newData);
              comboBox.itemHeight(24);
              // 将下拉菜单单元格类型绑定到指定的单元格中
              cell.cellType(comboBox);
            }
          });
        } else if (x.ControlType === 'checkbox') {
          let cellType = new GC.Spread.Sheets.CellTypes.CheckBox();
          cellType.caption('');
          cellType.textTrue('');
          cellType.textFalse('');
          cellType.textIndeterminate('');
          cellType.textAlign(
            GC.Spread.Sheets.CellTypes.CheckBoxTextAlign.center,
          );
          cellType.isThreeState(false);
          sheet.getCell(-1, y).cellType(cellType);
        } else if (
          x.DataType == 'datetime' ||
          x.DataType === 'varchar' ||
          x.DataType === 'nvarchar'
        ) {
          x.formatter = '@';
        }

        //行，start,end
        // if (x.isEdit) {
        //   sheet.getCell(-1, y).locked(false).foreColor("#2a06ecd9");
        // }
      });
      //渲染列
      sheet.bindColumns(this.tableColumns[remarkTb]); //此方法一定要放在setDataSource后面才能正确渲染列名
      sheet.setRowCount(1, GC.Spread.Sheets.SheetArea.colHeader);
      colHeader1.forEach(function (value, index) {
        sheet.setValue(0, index, value, GC.Spread.Sheets.SheetArea.colHeader);
      });

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
        GC.Spread.Sheets.SheetArea.colHeader,
      );
      colHeaderStyle.foreColor('000000d9');
      colHeaderStyle.backColor('#f3f3f3');
      colHeaderStyle.font(
        '12px basefontRegular, Roboto, Helvetica, Arial, sans-serif',
      );
      colHeaderStyle.hAlign(GC.Spread.Sheets.HorizontalAlign.left);
      colHeaderStyle.vAlign(GC.Spread.Sheets.HorizontalAlign.left);

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

          if (
            Object.prototype.toString.call(rowItem['FColors']) ===
            '[object Object]'
          ) {
            Object.keys(rowItem['FColors']).forEach((key) => {
              const columnIndex = this.tableColumns[0].findIndex(
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
              const columnIndex = this.tableColumns[0].findIndex(
                (columnItem) => columnItem.prop === key,
              );
              if (columnIndex !== -1) {
                // 这里使用 rowIndex 和 columnIndex 获取单元格
                const cell = sheet.getCell(rowIndex, columnIndex);
                cell.backColor(rowItem['BColors'][key]);
              }
            });
          }
          // 设置行颜色，最终判断有错误整行底色红色
          if (rowItem['Remark1'] && rowItem['Remark1'].indexOf('错误') > -1) {
            sheet.getCell(index, -1).backColor('red');
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
      //绑定表格事件前，需清除之前的绑定事件
      this.spread[remarkTb].unbindAll();
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
        // _this.computedNum(args.row, args.col, args.editingText);
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
      });
      this.spread[remarkTb].resumePaint();
      this.adminLoading = false;
      this.tableLoading[remarkTb] = false;
      setTimeout(() => {
        this.spread[remarkTb].refresh(); //重新定位宽高度
      });
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
      let sheet = this.spread[0].getActiveSheet();
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
        sheet.setDataSource(this.tableData[0]);
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
    // 选择数据
    selectFun(data, remarkTb, row) {
      this.selectionData[remarkTb] = data;
    },
    //指定人员
    async DesignatedPerson(remarkTb) {
      if (this.selectionData[remarkTb].length !== 1) {
        this.$message.error('请选择需要操作的数据且仅为一条！');
        return;
      }
      this.SalesOrderNo = this.selectionData[remarkTb][0]['SalesOrderNo'];
      this.Customer = this.selectionData[remarkTb][0]['Customer'];
      this.colDialogVisible2 = true;
      this.formSearchs[3].datas.SalesOrderDetailID =
        this.selectionData[remarkTb][0]['SalesOrderDetailID'];
      await this.dataSearch(3);
      await this.dataSearch(2);
    },
    //添加产品机台
    async Reschedule(remarkTb) {
      if (remarkTb === 2) {
        let newData = [];
        //添加
        let addData1 = this.selectionData[2].filter(
          (item0) =>
            !this.linkTableData.some((item3) => {
              return item3['SaleMan'] === item0['Account'];
            }),
        );
        addData1.forEach((item) => {
          item['dicID'] = 10127;
          item['SalesOrderDetailID'] =
            this.selectionData[0][0]['SalesOrderDetailID'];
          item['SaleMan'] = item['Account'];
        });
        newData = newData.concat(addData1);

        //删除
        let addData2 = this.linkTableData.filter(
          (item0) =>
            !this.selectionData[2].some((item3) => {
              return item3['Account'] === item0['SaleMan'];
            }),
        );

        addData2.forEach((item) => {
          item['dicID'] = 10127;
          item['ElementDeleteFlag'] = 1;
        });

        newData = newData.concat(addData2);
        await this.dataSave(2, null, null, newData);
        this.colDialogVisible2 = false;
      }
    },
    // 改变状态
    async changeStatus(item, index) {
      let RoleMapList = this.$store.getters.userInfo.RoleMap;
      if (RoleMapList.length) {
        RoleMapList.forEach((item) => {
          if (item.RoleID === 'R2309040001' || item.RoleID === 'E01Admin') {
            //业务经理
            this.RoleMapStatus = true;
            return;
          }
        });
      }
      this.formSearchs[0].datas['SaleMan'] = null;
      if (this.RoleMapStatus !== true && index !== 3) {
        this.$set(
          this.formSearchs[0]['datas'],
          'SaleMan',
          this.userInfo.Account,
        );
      }
      this.labelStatus1 = item['index'];
      this.formSearchs[0].datas['IsFinish'] = item.value;
      await this.dataSearch(0);
    },
    // 导入并分析模板
    dataImport() {
      this.dialogImport = true;
      this.fileList = [];
      this.file = [];
    },
    // 确认导入
    sureImport() {
      if (this.fileList.length == 0) {
        this.$message.error('请先选择文件');
        return;
      } else if (this.fileList.length > 1) {
        this.$message.error('仅支持一个文件上传');
      } else {
        this.$confirm('确定要导入并分析吗？')
          .then((_) => {
            _this.importExcel(this.file);
          })
          .catch((_) => {});
      }
    },
    //导入解析excel
    importExcel(file) {
      this.adminLoading = true;
      this.dialogImport = false;
      const result = [];
      const reader = new FileReader(); //上传就解析文件
      var that = this;
      reader.onload = function (e) {
        const data = e.target.result;
        this.wb = XLSX.read(data, {
          type: 'binary',
          cellDates: true,
          dateNF: 'yyyy-MM-dd',
        });
        this.wb.SheetNames.forEach((sheetName) => {
          result.push({
            sheetName: sheetName,
            sheet: XLSX.utils.sheet_to_json(this.wb.Sheets[sheetName], {
              defval: null,
            }),
          });
        });
        that.dataSys(result); // 解析文件
      };
      reader.readAsBinaryString(file.raw);
    },
    isValidDate(date) {
      return date instanceof Date && !isNaN(date.getTime());
    },
    // 解析文件
    async dataSys(importData) {
      this.adminLoading = true;
      if (importData && importData.length > 0) {
        let DataList = [];
        let isDate = false;
        this.colAdd = [];
        let obj = {};
        let rowNo = 0; // excel行号
        let propName = '';
        let split = []; //存储需求到料日期过期信息
        let groupList = [];
        let rowNoOweQty = true;
        let firstDate = 0;
        importData[0].sheet.forEach((m, y) => {
          rowNoOweQty = true;
          firstDate = 0;
          for (let key in m) {
            // 判断是否和配置里的取名一致，一致才可导入
            for (let i = 0; i < this.tableColumns[this.tagRemark].length; i++) {
              let item = this.tableColumns[this.tagRemark][i];
              if (item.label === key) {
                if (item.DataType === 'datetime') {
                  if (m[key] && !this.isValidDate(m[key])) {
                    //预防用户输入日期格式不正确的判断
                    propName = key;
                    rowNo = Number(m.__rowNum__) + 1;
                    // 异常提示
                    split.push(
                      `第${rowNo}行,【${propName}】【${m[key]}】格式存在错误，导入失败，请检查！`,
                    );
                  } else {
                    if (this.$moment(m[key]).format('YYYY-MM-DD HH:mm:ss')) {
                      let getDate = new Date(m[key]);
                      // // 注意的点：xlsx将excel中的时间内容解析后，会小一天xlsx会解析成 Mon Nov 02 2020 23:59:17 GMT+0800 小了43秒，所以转化为时间戳再加上43秒
                      var date = new Date(
                        getDate.setSeconds(getDate.getSeconds() + 43),
                      );
                      obj[item.prop] = m[key]
                        ? this.$moment(date).format('YYYY-MM-DD')
                        : '';
                    }
                  }

                  // 判断需求到料日期是否大于今天
                  if (
                    item.prop === 'DemandToDay' &&
                    obj[item.prop] &&
                    obj[item.prop] < formatDates.formatTodayDate()
                  ) {
                    propName = this.$moment(obj[item.prop]).format(
                      'YYYY-MM-DD',
                    );
                    rowNo = Number(m.__rowNum__) + 1;
                    // 异常提示
                    split.push(
                      `第${rowNo}行,【${propName}】过期，导入失败，请检查！`,
                    );
                  }
                } else if (item.prop === 'OweQty') {
                  if (m[key] > 0) {
                    //导入欠料数大于0才导入
                    obj[item.prop] = m[key];
                  } else {
                    return;
                  }
                } else {
                  obj[item.prop] = m[key];
                }
              } else if (isNaN(key) && !isNaN(Date.parse(key))) {
                // 列为日期的格式
                isDate = true;

                if (Number(m[key]) > 0) {
                  //导入日期并且欠料数大于0才导入
                  rowNoOweQty = false; //行存在欠料的判断
                  // 判断需求到料日期是否大于今天
                  if (formatDate(key) < formatDates.formatTodayDate()) {
                    propName = formatDate(key);
                    rowNo = Number(m.__rowNum__) + 1;
                    // 异常提示
                    split.push(
                      `第${rowNo}行,【${propName}】过期，导入失败，请检查！`,
                    );
                  }
                  obj['DemandToDay'] = this.$moment(key).format('YYYY-MM-DD');
                  obj['OweQty'] = m[key];
                  obj['dicID'] = _this.sysID[_this.tagRemark].ID;
                  obj['Account'] = _this.$store.getters.userInfo.Account;
                  obj['row'] = m.__rowNum__;
                  if (obj['ResourceNO'] && obj['LineNum'] && obj['ItemCode']) {
                    obj['groupName'] =
                      obj['ResourceNO'] +
                      '' +
                      obj['LineNum'] +
                      '' +
                      obj['ItemCode'];
                    obj['Sum'] = 0;
                  }
                  // 需要使用...obj 不然值回写有问题
                  if (isDate) {
                    DataList.push({ ...obj });
                    break;
                  }
                }
                // 行欠料都空取第一个日期插入一条数据，给后端用于异常提示
                firstDate++;
                if (firstDate === 1) {
                  obj['DemandToDay'] = formatDate(key);
                }
              }
            }
          }

          // 以下为固定入参
          if (!isDate) {
            obj['dicID'] = this.sysID[this.tagRemark].ID;
            obj['EndDate'] = _this.machineCycle;
            obj['Account'] = this.$store.getters.userInfo.Account;
            obj['row'] = m.__rowNum__;
            if (obj['ResourceNO'] && obj['LineNum'] && obj['ItemCode']) {
              obj['groupName'] =
                obj['ResourceNO'] + '' + obj['LineNum'] + '' + obj['ItemCode'];
              obj['Sum'] = 0;
            }
            // 需要使用...obj 不然值回写有问题
            DataList.push({ ...obj });
          }
          // 日期为列时，行欠料都空插入一条记录
          if (isDate && rowNoOweQty) {
            obj['OweQty'] = 0;
            obj['dicID'] = _this.sysID[_this.tagRemark].ID;
            obj['Account'] = _this.$store.getters.userInfo.Account;
            obj['row'] = m.__rowNum__;
            if (obj['ResourceNO'] && obj['LineNum'] && obj['ItemCode']) {
              obj['groupName'] =
                obj['ResourceNO'] + '' + obj['LineNum'] + '' + obj['ItemCode'];
              obj['Sum'] = 0;
            }
            DataList.push({ ...obj });
          }
        });
        // 过滤掉组合出来空的数据
        let list = _.filter(DataList, (params) => {
          if (params.groupName) {
            return params;
          }
        });
        groupList = _.groupBy(list, 'groupName');
        //  组合后的数据数量对比资源可用量
        for (let key in groupList) {
          if (groupList[key].length) {
            let total = 0;
            let AvailableQty = 0;
            groupList[key].map((element, x) => {
              total += element.OweQty;
              AvailableQty = element.AvailableQty || 0;
              if (total > AvailableQty) {
                //同个资源单号+行号+物料编码的欠料数>可用资源抛出异常
                // 异常提示
                split.push(
                  `第${Number(element.row) + 1}行,物料【${
                    element.ItemCode
                  }】欠数超量，导入失败，请检查！`,
                );
              }
            });
          }
        }
        // 必填校验
        if (this.formSearchs[this.tagRemark].required.length) {
          // 动态检验必填项
          for (let i = 0; i < DataList.length; i++) {
            for (
              let x = 0;
              x < this.formSearchs[this.tagRemark].required.length;
              x++
            ) {
              if (
                DataList[i][
                  this.formSearchs[this.tagRemark].required[x]['prop']
                ] === undefined ||
                DataList[i][
                  this.formSearchs[this.tagRemark].required[x]['prop']
                ] === null ||
                DataList[i][
                  this.formSearchs[this.tagRemark].required[x]['prop']
                ] === ''
              ) {
                this.adminLoading = false;
                rowNo = Number(DataList[i]['row']) + 1;
                // 异常提示
                split.push(
                  `第${rowNo}行,【${
                    this.formSearchs[this.tagRemark].required[x]['label']
                  }】不能为空，导入失败，请填写`,
                );
              }
            }
          }
        }
        if (split.length) {
          //异常集合
          this.adminLoading = false;
          let txt = '';
          split.map((value) => {
            return (txt = `${txt}<p style="word-break: break-word;">${value}</p>`);
          });
          this.$alert(txt, {
            dangerouslyUseHTMLString: true,
            title: '导入异常信息!',
            customClass: 'message-width',
          });

          return;
        }
        console.log('DataList', DataList);
        if (DataList.length) {
          let res = await GetSearch(DataList, '/APSAPI/ImportDeliveryData');
          const { result, data, count, msg } = res.data;
          if (result) {
            this.adminLoading = false;
            // this.dataSearch(this.tagRemark);
            // 导入可能存在表头格式不一样，需要更新
            this.getTableHeader();
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
          this.adminLoading = false;
          this.$message.error('未接收到数据，请检查！');
        }
      }
    },
    handleChanged(file, fileList) {
      var ext = file.name.substring(file.name.lastIndexOf('.') + 1);
      const extension = ext === 'xlsx' || ext === 'xls';
      if (!extension) {
        this.$message.error('上传文件格式只能为xlsx/xls');
        // 取消时在文件列表中删除该文件
        this.$refs.upload.handleRemove(file);
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 50;
      if (!isLt2M) {
        this.$message.error('上传文件大小不能超过 50MB!');
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
        1,
      );
    },
    // 分析
    async Analysis() {
      let form = {
        StartDate: null,
        EndDate: _this.machineCycle,
      };
      this.adminLoading = true;
      let res = await GetSearch(form, '/APSAPI/AnalyseDeliveryData');
      const { result, data, count, msg } = res.data;
      try {
        if (result) {
          this.adminLoading = false;
          this.$message({
            message: msg,
            type: 'success',
            dangerouslyUseHTMLString: true,
          });
          this.dataSearch(this.tagRemark);
        } else {
          this.adminLoading = false;
          this.$message({
            message: msg,
            type: 'error',
            dangerouslyUseHTMLString: true,
          });
        }
      } catch (error) {
        if (error) {
          this.adminLoading = false;
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped></style>
