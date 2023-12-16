<!--采购回复-->
<template>
  <div class="APSContainer flex_flex" v-loading="adminLoading">
    <el-container>
      <el-main style="padding: 0; margin: 0">
        <div class="admin_container_2" style="width: 100%">
          <div class="admin_head" ref="headRef">
            <div v-for="i in [0]" :key="i" v-show="true">
              <ComSearch
                ref="searchRef"
                :searchData="formSearchs[i].datas"
                :searchForm="formSearchs[i].forms"
                :remark="i"
                :isLoading="isLoading"
                :btnForm="btnForm"
                :signName="labelStatus1"
                @btnClick="btnClick"
              />
            </div>
          </div>
          <div>
            <div class="admin_content">
              <div class="ant-table-title">
                <el-row>
                  <el-col :span="4">
                    <i
                      class="el-icon-d-arrow-left"
                      v-show="showAside"
                      @click="showAside = !showAside"
                    ></i>
                    <i
                      class="el-icon-d-arrow-right"
                      v-show="!showAside"
                      @click="showAside = !showAside"
                    ></i>
                    <span class="title">{{ title }}</span>
                  </el-col>
                  <el-col :span="20" class="flex_flex_end">
                    <!-- <el-divider direction="vertical"></el-divider>
                    <div
                      
                      v-for="(item, y) in Status1"
                      :key="y"
                    >
                      <span @click="changeStatus(item, y)" :class="labelStatus1 == y ? 'statusActive cursor' : 'cursor'">{{
                        item.label
                      }}</span>
                      <el-divider direction="vertical"></el-divider>
                    </div> -->
                  </el-col>
                </el-row>
              </div>
              <!-- <div
                class="flex_column"
                :style="{ height: height }"
                v-show="labelStatus1 == 1"
              >
                <ComSpreadTable
                  ref="spreadsheetRef"
                  :height="height"
                  :tableData="tableData[1]"
                  :tableColumns="tableColumns[1]"
                  :tableLoading="tableLoading[1]"
                  :remark="1"
                  :sysID="sysID[1]['ID']"
                  :pagination="tablePagination[1]"
                  @pageChange="pageChange"
                  @pageSize="pageSize"
                  @workbookInitialized="workbookInitialized"
                  @selectfun="selectFun"
                />
              </div> -->
              <div
                class="flex_column"
                v-for="item in [0]"
                :key="item"
                v-if="true"
              >
                <ComVxeTable
                  :rowKey="'RowNumber'"
                  :ref="`tableRef${item}`"
                  :height="height"
                  :tableData="tableData[item]"
                  :tableHeader="tableColumns[item]"
                  :tableLoading="tableLoading[item]"
                  :isEdit="isEdit"
                  :hasSelect="hasSelect[item]"
                  :remark="item"
                  :cellStyle="cellStyle"
                  :sysID="sysID[item].ID"
                  :isClear="isClear[item]"
                  :footerLabel="footerLabel[item]"
                  :pagination="tablePagination[item]"
                  @pageChange="pageChange"
                  @pageSize="pageSize"
                  @selectfun="selectFun"
                  @sortChange="sortChange"
                  :keepSource="true"
                />
                <!-- <ComSpreadTable
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
                /> -->
              </div>
            </div>
          </div>
        </div>
      </el-main>
    </el-container>
    <!-- 导入文件 -->
    <!-- <div>
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
    </div> -->
  </div>
</template>

<script>
var _this;
const GCsheets = GC.Spread.Sheets;
import '@grapecity/spread-sheets-vue';
import GC from '@grapecity/spread-sheets';
import '@grapecity/spread-sheets/styles/gc.spread.sheets.excel2013white.css';
import '@grapecity/spread-sheets/js/zh.js';
GC.Spread.Common.CultureManager.culture('zh-cn');
import ComSpreadTable from '@/components/ComSpreadTable';
import XLSX from 'xlsx';
import ComSearch from '@/components/ComSearch';
import ComAsideTree from '@/components/ComAsideTree';
import ComVxeTable from '@/components/ComVxeTable';
import ComReportTable from '@/components/ComReportTable';
import {
  GetHeader,
  GetSearchData,
  ExportData,
  GetSearch,
  SaveData,
  GetServerTime,
  GetOrgData,
  UpdateOrderBomPOTracker,
} from '@/api/Common';
import { HeaderCheckBoxCellType } from '@/static/data.js';
import ComFormDialog from '@/components/ComFormDialog';
export default {
  name: 'PurchasingReplyHistory',
  components: {
    ComSearch,
    ComAsideTree,
    ComVxeTable,
    ComReportTable,
    ComFormDialog,
    ComSpreadTable,
  },
  data() {
    return {
      isLoading: false,
      hasSelect: [true, true, true, true, true],
      footerLabel: [''],
      dialogShow: false,
      height1: '360px',
      labelStatus1: 0,
      Status1: [
        { label: '分配数量', value: -1 },
        { label: '数量+时间+线体', value: 0 },
        { label: '数量+时间+线体+托盘', value: '' },
        { label: '综合分析', value: '' },
        { label: '全部', value: 1 },
      ],
      //////////////左侧树节点//////////////
      showAside: true,
      ReplyDate: '',
      ////////////////// Search /////////////////
      title: this.$route.meta.title,
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
        {
          datas: {},
          forms: [],
        },
      ],
      selectionData: [[], [], [], [], []],
      btnForm: [],
      tableData: [[], [], [], [], []],
      tableColumns: [[], [], [], [], []],
      tableLoading: [false, false, false, false, false],
      isClear: [false, false, false, false, false],
      tablePagination: [
        { pageIndex: 1, pageSize: 1000, pageTotal: 0 },
        { pageIndex: 1, pageSize: 1000, pageTotal: 0 },
        { pageIndex: 1, pageSize: 1000, pageTotal: 0 },
        { pageIndex: 1, pageSize: 1000, pageTotal: 0 },
        { pageIndex: 1, pageSize: 1000, pageTotal: 0 },
      ],
      height: '707px',
      treeHeight: '765px',
      showPagination: true,
      tagRemark: 0,
      isEdit: false,
      clickData: {},
      isUpdate: true,
      adminLoading: false,
      dialogImport: false,
      fileList: [],
      file: [],
      sysID: [
        { ID: 10088 },
        { ID: 10075 },
        { ID: 10075 },
        { ID: 10075 },
        { ID: 10075 },
      ],
      userInfo: {},
    };
  },
  computed: {},
  created() {
    _this = this;
    this.userInfo = this.$store.getters.userInfo;
    // 获取所有按钮
    this.btnForm = this.$route.meta.btns;
    this.judgeBtn(this.btnForm);
    this.getTableHeader();
  },
  mounted() {
    setTimeout(() => {
      this.setHeight();
    }, 500);
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
    //获取子组件实例
    workbookInitialized: function (workbook) {
      this.spread = workbook;
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
    // 高度控制
    setHeight() {
      this.treeHeight = document.documentElement.clientHeight - 150 + 'px';
      let headHeight = this.$refs.headRef.offsetHeight;

      let rem =
        document.documentElement.clientHeight -
        headHeight -
        this.$store.getters.reduceHeight;
      let newHeight = rem + 'px';
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
      this.$set(this.isClear, remarkTb, true);
      this.$set(this.tableLoading, remarkTb, true);
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
    // 保存
    async dataSave(remarkTb) {
      this.adminLoading = true;
      const $table = this.$refs[`tableRef${remarkTb}`][0].$refs.vxeTable;
      // 获取修改记录
      let updateRecords;
      if (newData) {
        updateRecords = newData;
      } else {
        updateRecords = $table.getUpdateRecords();
      }
      if (updateRecords.length == 0) {
        this.$set(this, 'adminLoading', false);
        this.$message.error('当前数据没做修改，请先修改再保存！');
        return;
      }
      let res = await SaveData(updateRecords);
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
    // 从月计划更新
    async monthUpdata(remarkTb, index) {
      if (this.selectionData[remarkTb].length == 0) {
        this.$message.error('请选择需要提交的数据！');
        return;
      } else {
        let res = await GetSearch(
          this.selectionData[remarkTb],
          '/APSAPI/SaveData10075FromMonth',
        );
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
      }
    },
    // 删除
    // async dataDel(remarkTb, index, parms) {
    //   let res = null;
    //   let newData = [];
    //   if (parms && parms.dataName) {
    //     if (this[parms.dataName][remarkTb].length == 0) {
    //       this.$message.error("请单击需要操作的数据！");
    //     } else {
    //       this[parms.dataName][remarkTb].forEach(x => {
    //         let obj = x;
    //         obj["ElementDeleteFlag"] = 1;
    //         newData.push(obj);
    //       });
    //     }
    //   } else {
    //     this.tableData[remarkTb].forEach(y => {
    //       let obj2 = y;
    //       obj2["ElementDeleteFlag"] = 1;
    //       newData.push(obj2);
    //     });
    //   }
    //   this.$confirm("确定要删除的【" + newData.length + "】数据吗？")
    //     .then(_ => {
    //       _this.generalSaveData(newData, remarkTb, index);
    //     })
    //     .catch(_ => {});
    // },
    // 通用直接保存
    // async generalSaveData(newData, remarkTb, index) {
    //   if (newData.length == 0) {
    //     this.$message.error("没有提交保存的数据！");
    //     return;
    //   }
    //   this.adminLoading = true;
    //   let res = await SaveData(newData);
    //   const { result, data, count, msg } = res.data;
    //   if (result) {
    //     this.dataSearch(remarkTb);
    //     this.adminLoading = false;
    //     this.$message({
    //       message: msg,
    //       type: "success",
    //       dangerouslyUseHTMLString: true
    //     });
    //   } else {
    //     this.adminLoading = false;
    //     this.$message({
    //       message: msg,
    //       type: "error",
    //       dangerouslyUseHTMLString: true
    //     });
    //   }
    // },
    // 获取表头数据
    async getTableHeader() {
      let IDs = this.sysID;
      let res = await GetHeader(IDs);
      const { datas, forms, result, msg } = res.data;
      if (result) {
        // 获取查询的初始化字段 组件 按钮
        forms.some((x, z) => {
          this.$set(this.formSearchs[z].datas, 'dicID', IDs[z].ID);
          if (z !== 0) {
            this.$set(
              this.formSearchs[z].datas,
              'Account',
              this.userInfo.Account,
            );
          }
          x.forEach((y) => {
            if (y.prop && y.value) {
              this.$set(this.formSearchs[z].datas, [y.prop], y.value);
            } else {
              this.$set(this.formSearchs[z].datas, [y.prop], '');
            }
          });
          this.$set(this.formSearchs[z], 'forms', x);
        });
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
      let res = await GetSearchData(form);
      let { result, data, count, msg, Columns } = res.data;
      if (result) {
        Columns.some((m, i) => {
          m.forEach((n) => {
            // 进行验证
            this.verifyData(n);
            if (n.children && n.children.length != 0) {
              n.children.forEach((x) => {
                this.verifyData(x);
              });
            }
          });
        });
        this.$set(this.tableColumns, remarkTb, Columns[0]);
        this.$set(this.tableData, remarkTb, data);
        // this.setData();
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
    // excle表数据渲染
    async setData() {
      try {
        console.log(this.tagRemark, '1');
        this.spread.suspendPaint();
        // 获取活动表单
        let sheet = this.spread.getActiveSheet();
        // 重置表单
        sheet.reset();
        // 渲染列
        this.tableColumns[this.tagRemark].forEach((x, y) => {
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
            // colInfos.push({
            //   name: x.prop,
            //   displayName: x.label,
            //   cellType: "",
            //   size: parseInt(x.width)
            // });
            let newData = [];
            // let list = null;
            this.tableData[this.tagRemark].map((item, index) => {
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
        //改变字体颜色
        this.tableData[this.tagRemark].forEach((row, rowIndex) => {
          this.tableColumns[this.tagRemark].forEach((column, columnIndex) => {
            const key = column.prop;

            // 获取当前单元格
            const cell = sheet.getCell(rowIndex, columnIndex);

            // 获取颜色
            if (row && row.colorMapping && row.colorMapping[key]) {
              const color = row.colorMapping[key];
              cell.style({
                backColor: color,
                foreColor: '#FFFFFF',
              });
              // 其他代码
            }
            // const color = row.colorMapping[key];

            // 如果该属性有颜色信息，则设置单元格样式
            // if (color) {
            //   // const style = new GC.Spread.Sheets.Style();
            //   cell.backColor(color);
            //   cell.foreColor("#FFFFFF"); // 假设背景色为 color 的单元格的字体颜色为白色
            // }
          });
        });

        // 列筛选
        // 参数2 开始列
        // 参数3
        // 参数4 结束列
        let cellrange = new GC.Spread.Sheets.Range(
          -1,
          -1,
          -1,
          this.tableColumns[this.tagRemark].length,
        );
        let hideRowFilter = new GC.Spread.Sheets.Filter.HideRowFilter(
          cellrange,
        );
        sheet.rowFilter(hideRowFilter);

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

        //设置数据渲染的单元格默认的样式
        var defaultStyle = new GC.Spread.Sheets.Style();
        defaultStyle.font =
          '12px basefontRegular, Roboto, Helvetica, Arial, sans-serif';
        defaultStyle.hAlign = GC.Spread.Sheets.HorizontalAlign.left;
        defaultStyle.vAlign = GC.Spread.Sheets.HorizontalAlign.left;
        sheet.setDefaultStyle(
          defaultStyle,
          GC.Spread.Sheets.SheetArea.viewport,
        );
        defaultStyle.showEllipsis = true;
        // 冻结
        sheet.frozenColumnCount(this.tableColumns[this.tagRemark][1].FixCount);
        //渲染数据源
        sheet.setDataSource(this.tableData[this.tagRemark]);
        //渲染列
        sheet.bindColumns(this.tableColumns[this.tagRemark]); //此方法一定要放在setDataSource后面才能正确渲染列名
        this.spread.options.tabStripVisible = false; //是否显示表单标签
        this.spread.options.scrollbarMaxAlign = true;
        // this.spread.options.scrollByPixel = true;

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
        sheet.options.protectionOptions.allowSort = true;
        sheet.options.protectionOptions.allowFilter = true;
        sheet.options.allowUserDragDrop = true;
      } catch (error) {
        console.log('表格渲染的错误信息:', error);
      }
      this.spread.refresh(); //重新定位宽高度
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
      this.$set(this.selectionData, remarkTb, data);
    },
    // 行内列样式
    cellStyle({ row, column }) {
      if (
        column.property == 'JudgeResult' &&
        row['JudgeResult'] == '缺采购单'
      ) {
        return {
          background: '#ff7b7b',
        };
      } else if (
        column.property == 'JudgeResult' &&
        row['JudgeResult'] == '在途不足'
      ) {
        return {
          background: '#ffced6',
        };
      } else if (
        column.property == 'JudgeResult' &&
        row['JudgeResult'] == '待复期'
      ) {
        return {
          background: '#fdfd8f',
        };
      } else if (
        (column.property == 'JudgeResult' && row['JudgeResult'] == '满足') ||
        (column.property == 'IsReplyStatusName' &&
          row['IsReplyStatusName'] == '是')
      ) {
        return {
          background: '#9fff9f',
        };
      }

      if (column.property == 'OnloadQty') {
        return {
          color: 'blue',
        };
      }
      if (column.property == 'RealOweQty') {
        return {
          color: 'red',
        };
      }
      if (
        column.property == 'ReplyQty' &&
        parseFloat(row.ReplyQty) < parseFloat(row.RealOweQty)
      ) {
        return {
          background: '#ff7b7b',
        };
      }

      if (row.ReplyDate && !row.SecondReplyDate) {
        if (
          column.property == 'ReplyDate' &&
          new Date(row.ReplyDate).getTime() > new Date(row.LastDate).getTime()
        ) {
          return {
            background: '#ff7b7b',
          };
        }
      }

      if (row.SecondReplyDate) {
        if (
          column.property == 'SecondReplyDate' &&
          new Date(row.SecondReplyDate).getTime() >
            new Date(row.LastDate).getTime()
        ) {
          return {
            background: '#ff7b7b',
          };
        }
      }

      if (column.property == 'OncheckQty') {
        if (
          parseFloat(row.OncheckQty) >=
          parseFloat(row.StockQtyAllocationPrepare)
        ) {
          return {
            background: '#9fff9f',
          };
        }
      }
    },
    // 改变状态
    changeStatus(item, index) {
      this.labelStatus1 = index;
      this.dataSearch(index);
    },
  },
};
</script>
