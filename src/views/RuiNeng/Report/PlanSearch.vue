<!--组装日计划-->
<template>
  <div class="APSContainer flex_flex content_height" v-loading="adminLoading">
    <div
      class="flex_column"
      v-if="showAside"
      style="width: 160px; border: 1px solid #b9b9b9"
    >
      <div
        class="admin_left_2 border-b-1 flex_column"
        style="height: 50%; width: 100%"
      >
        <div class="flex px-2 py-1.5 border-b-1 tree_Head">
          <span class="tree_text">车间</span>
          <div class="flex_flex_end flex-1">
            <el-input
              size="mini"
              clearable
              v-model="OrganizeName"
              placeholder="搜索"
              suffix-icon="el-icon-search"
              class="w2/3 cx_margin_right1"
              @input="
                searchTree(
                  OrganizeName,
                  'treeData',
                  'treeListTmp',
                  'OrganizeName',
                )
              "
            ></el-input>
            <!-- <el-dropdown @command="handleCommand" class="flex_inline">
              <img src="../../../assets/svg/dot.svg" />
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="1">展开全部</el-dropdown-item>
                <el-dropdown-item command="2">折叠全部</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown> -->
          </div>
        </div>
        <el-tree
          class="tree-line flex_grow"
          :indent="0"
          ref="asideTree"
          node-key="OrganizeID"
          style="overflow: auto"
          :data="treeData"
          :props="treeProps"
          highlight-current
          :expand-on-click-node="false"
          @node-click="handleNodeClick"
        ></el-tree>
      </div>
      <div
        class="admin_left_2 border-b-1 flex_column"
        style="height: 50%; width: 100%"
      >
        <div class="flex px-2 py-1.5 border-b-1 tree_Head">
          <span class="tree_text">线别</span>
          <div class="flex_flex_end flex-1">
            <el-input
              size="mini"
              clearable
              v-model="LineName"
              placeholder="搜索"
              suffix-icon="el-icon-search"
              class="w2/3 cx_margin_right1"
              @input="
                searchTree(
                  LineName,
                  'treeData1',
                  'treeListTmp1',
                  'OrganizeName',
                )
              "
            ></el-input>
            <!-- <el-dropdown @command="handleCommand" class="flex_inline">
              <img src="../../../assets/svg/dot.svg" />
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="1">展开全部</el-dropdown-item>
                <el-dropdown-item command="2">折叠全部</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown> -->
          </div>
        </div>
        <el-tree
          class="tree-line flex_grow"
          :indent="0"
          ref="asideTree1"
          node-key="OrganizeID"
          style="overflow: auto"
          :data="treeData1"
          :props="treeProps"
          highlight-current
          :expand-on-click-node="false"
          @node-click="handleNodeClick1"
        ></el-tree>
      </div>
    </div>
    <div class="admin_container_2 flex_column" style="flex-grow: 0">
      <div class="admin_head" ref="headRef">
        <div
          v-for="i in [0, 1, 2, 3]"
          :key="i"
          v-show="Number(selectedIndex) === i"
        >
          <ComSearch
            ref="searchRef"
            :searchData="formSearchs[i].datas"
            :searchForm="formSearchs[i].forms"
            :remark="i"
            :isLoading="isLoading"
            :btnForm="btnForm"
            :signName="labelStatus1"
            :Region="Region[i]"
            @btnClick="btnClick"
          />
        </div>
      </div>
      <div class="admin_content flex_column flex_grow">
        <div class="ant-table-title">
          <el-row>
            <el-col :span="12" class="flex">
              <el-tabs
                v-model="selectedIndex"
                @tab-click="handleClick"
                :stretch="true"
              >
                <el-tab-pane label="生产任务清单" name="0"></el-tab-pane>
                <el-tab-pane label="滚动周计划" name="1"></el-tab-pane>
                <el-tab-pane label="滚动日计划" name="2"></el-tab-pane>
              </el-tabs>
              <!-- <i class="el-icon-d-arrow-left" v-show="showAside" @click="showAside = !showAside"></i>
                <i class="el-icon-d-arrow-right" v-show="!showAside" @click="showAside = !showAside"></i>
                <span class="title">{{ title }}</span> -->
            </el-col>
            <el-col :span="12" class="flex_flex_end"> </el-col>
          </el-row>
        </div>
        <div
          class="flex_column flex_grow"
          v-for="item in [0, 1, 2]"
          :key="item"
          v-show="Number(selectedIndex) === item"
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
            @selectfun="selectFun"
          />
        </div>
      </div>
    </div>
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
import XLSX from 'xlsx';
import ComSearch from '@/components/ComSearch/AdvancedSearch';
import ComAsideTree from '@/components/ComAsideTree';
import ComVxeTable from '@/components/ComVxeTable';
import ComReportTable from '@/components/ComReportTable';
import ComSpreadTable from '@/components/ComSpreadTable';
import { HeaderCheckBoxCellType } from '@/static/data.js';
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
import ComFormDialog from '@/components/ComFormDialog';
export default {
  name: 'PlanSearch',
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
      PODeliveryDate: '',
      selectedIndex: '0',
      CurrentSendQty: '',
      isLoading: false,
      footerLabel: [''],
      dialogShow: false,
      EditDisabled: false,
      height1: '360px',
      labelStatus1: 0,
      Status1: [
        { label: '全部', value: '' },
        { label: '未复期', value: '未复期' },
        { label: '复期不满足', value: '复期不满足' },
        { label: '逾期未交', value: '逾期未交' },
      ],
      //////////////左侧树节点//////////////
      showAside: true,
      ReplyDate: '',
      treeProps: {
        label: 'OrganizeName',
        children: 'children',
      },
      treeProps1: {
        label: 'SumCount',
        children: 'children',
      },
      treeData: [],
      treeData1: [],
      treeListTmp: [],
      treeListTmp1: [],
      ////////////////// Search /////////////////
      title: this.$route.meta.title,
      formSearchs: [
        {
          datas: {},
          forms: [],
        },
        {
          datas: {
            PlanWeeks: 12,
          },
          forms: [],
        },
        {
          datas: {
            PlanDays: 50,
          },
          forms: [],
        },
        {
          datas: {},
          forms: [],
        },
      ],
      selectionData: [[], [], [], []],
      btnForm: [],
      tableData: [[], [], [], []],
      tableColumns: [[], [], [], []],
      tableLoading: [false, false, false, false],
      isClear: [false, false, false, false],
      hasSelect: [false, false, false, false],
      Region: [5, 5, 5, 5],
      tablePagination: [
        { pageIndex: 1, pageSize: 1000, pageTotal: 0 },
        { pageIndex: 1, pageSize: 1000, pageTotal: 0 },
        { pageIndex: 1, pageSize: 1000, pageTotal: 0 },
        { pageIndex: 1, pageSize: 1000, pageTotal: 0 },
      ],
      height: '707px',
      treeHeight: '765px',
      tagRemark: 0,
      isEdit: false,
      clickData: [{}, {}],
      LineName: '',
      OrganizeName: '',
      isUpdate: true,
      adminLoading: false,
      dialogImport: false,
      fileList: [],
      file: [],
      sysID: [{ ID: 7833 }, { ID: 7915 }, { ID: 7910 }],
      sheetSelectRows: [],
      sheetSelectObj: { start: 0, end: 0, count: 0 },
      userInfo: {},
      spread: [],
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
  mounted() {},
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
    workbookInitialized: function (workbook, remarkTb) {
      this.spread[remarkTb] = workbook;
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
    // 获取供应商数据
    async getSupplierData() {
      this.treeData = [];
      this.treeListTmp = [];
      let form = {
        dicID: 5143,
      };
      let res = await GetSearchData(form);
      const { result, data, count, msg } = res.data;
      if (result) {
        this.treeData = JSON.parse(JSON.stringify(data));
        this.treeData.unshift({
          OrganizeID: -1,
          OrganizeName: '全部',
        });
        this.treeListTmp = this.treeData;
        // this.getTableData(
        //   this.formSearchs[this.selectedIndex].datas,
        //   Number(this.selectedIndex)
        // );
        if (this.treeData.length != 0) {
          this.$nextTick(function () {
            _this.$refs.asideTree.setCurrentKey(this.treeData[0].OrganizeID);
          });
          this.handleNodeClick(this.treeData[0]);
        }
      } else {
        this.$message({
          message: msg,
          type: 'error',
          dangerouslyUseHTMLString: true,
        });
      }
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
    // 查询
    async dataSearch(remarkTb) {
      this.tagRemark = remarkTb;
      this.tableData[remarkTb] = [];
      this.$set(this.isClear, remarkTb, true);
      this.$set(this.tableLoading, remarkTb, true);
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
    // 保存
    async dataSave(remarkTb, index, parms, newData) {
      this.adminLoading = true;
      const sheet = this.spread[remarkTb]?.getActiveSheet();

      const $table = this.$refs[`tableRef${remarkTb}`]?.[0].$refs.vxeTable;
      if (sheet && sheet.isEditing()) {
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
      let res = await SaveData(updateRecords);
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
    // 删除
    async dataDel(remarkTb, index, parms) {
      let newData = [];
      if (this.selectionData[remarkTb].length == 0) {
        this.$message.error('请单击需要操作的数据！');
        return;
      } else {
        newData = _.cloneDeep(
          this.selectionData[remarkTb].map((obj) => {
            obj['ElementDeleteFlag'] = 1;
            return obj;
          }),
        );
      }
      this.$confirm('确定要删除的【' + newData.length + '】数据吗？')
        .then((_) => {
          _this.dataSave(remarkTb, index, null, newData);
        })
        .catch((_) => {});
    },
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
        // 获取每个表头
        datas.some((m, i) => {
          m.forEach((n, index) => {
            if (index === 1) {
              this.tablePagination[i]['pageSize'] = n['pageSize'];
              this.hasSelect[i] = n['IsSelect'];
              this.Region[i] = n['Region'] ? n['Region'] : this.Region[i];
            }
          });
          this.$set(this.tableColumns, i, m);
          // this.$set(
          //   this.formSearchs[i]['datas'],
          //   'Accounts',
          //   this.userInfo.Account,
          // );
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
        this.getSupplierData();
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
      const { result, data, count, msg, Columns } = res.data;
      if (result) {
        // 获取每个表头
        Columns.some((m, i) => {
          m.forEach((n, index) => {
            this.$set(this.tableColumns, remarkTb, m);
          });
        });
        this.$set(this.tableData, remarkTb, data);
        this.$set(this.tablePagination[remarkTb], 'pageTotal', count);
        this.setData(remarkTb);
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
      //sheet获取
      this.spread[remarkTb].suspendPaint();
      let sheet = this.spread[remarkTb].getActiveSheet();
      // 重置表单
      sheet.reset();
      sheet.options.allowCellOverflow = true;
      sheet.defaults.rowHeight = 23;
      sheet.defaults.colWidth = 100;
      sheet.defaults.colHeaderRowHeight = 23;
      sheet.defaults.rowHeaderColWidth = 60;
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
        if (x.isEdit) {
          sheet.getCell(-1, y).locked(false).foreColor('#2a06ecd9');
        }
      });
      //渲染列
      sheet.bindColumns(this.tableColumns[remarkTb]); //此方法一定要放在setDataSource后面才能正确渲染列名

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
      // defaultStyle.wordWrap = true;
      sheet.setDefaultStyle(defaultStyle, GC.Spread.Sheets.SheetArea.viewport);
      // 冻结第一列
      if (this.tableColumns[remarkTb][0]['FixCount']) {
        // 冻结
        sheet.frozenColumnCount(this.tableColumns[remarkTb][0].FixCount);
      }

      this.spread[remarkTb].options.tabStripVisible = false; //是否显示表单标签
      //改变字体颜色
      this.tableData[remarkTb].forEach((rowItem, rowIndex) => {
        // sheet.autoFitRow(rowIndex);
        this.tableColumns[remarkTb].forEach((columnItem, columnIndex) => {
          // 获取当前单元格
          const cell = sheet.getCell(rowIndex, columnIndex);
          cell.foreColor('black');
          cell.backColor('white');
          if (columnItem['isEdit']) {
            cell.locked(false).foreColor('#2a06ecd9');
          }
          if (
            rowItem['ScheduledQty'] &&
            rowItem['Qty'] &&
            columnItem['prop'] === 'CurPlanQty' &&
            Number(rowItem['ScheduledQty']) === Number(rowItem['Qty'])
          ) {
            cell.locked(true).foreColor('black');
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
      sheet.options.isProtected = true;
      sheet.options.protectionOptions.allowResizeColumns = true;
      sheet.options.protectionOptions.allowResizeRows = true;

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
                GC.Spread.Sheets.CopyToOptions.style,
              );
              sheet.setArray(options.activeRow, 0, _this.sheetSelectRows);
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
              sheet.setArray(options.activeRow, 0, _this.sheetSelectRows);
              sheet.deleteRows(
                _this.sheetSelectObj.start,
                _this.sheetSelectObj.count,
              );
            }
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
          if (item && item.name === 'gc.spread.rowHeaderinsertCutCells') {
            item.command = 'insertRowsCopyStyle';
          }
        });
      };
      var contextMenu = new MyContextMenu();
      this.spread[remarkTb].contextMenu = contextMenu;
      // 剪贴板事件绑定
      sheet.bind(
        GC.Spread.Sheets.Events.ClipboardChanged,
        function (sender, args) {
          let s = sheet.getSelections()[0];
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

      //表格编辑事件
      this.spread[remarkTb].bind(
        GCsheets.Events.EditStarting,
        function (e, args) {},
      );
      this.spread[remarkTb].bind(
        GCsheets.Events.EditEnded,
        function (e, args) {},
      );
      this.spread[remarkTb].resumePaint();
      this.adminLoading = false;
      this.tableLoading[remarkTb] = false;
      setTimeout(() => {
        this.spread[remarkTb].refresh(); //重新定位宽高度
      });
    },
    // 单击线体
    async handleNodeClick(data, node) {
      this.clickData[0] = data;
      this.formSearchs[this.selectedIndex].datas['WorkShopID'] =
        data.OrganizeID === -1 ? '' : data.OrganizeID;
      this.formSearchs[this.selectedIndex].datas['LineID'] = '';
      await this.getLineData(data.OrganizeID === -1 ? '' : data.OrganizeID);
      //假如点击车间没有线别，则直接查询车间
      if (this.treeData1.length != 0) {
        this.$nextTick(function () {
          _this.$refs.asideTree1.setCurrentKey(this.treeData1[0].OrganizeID);
        });
        await this.handleNodeClick1(this.treeData1[0]);
      } else {
        await this.dataSearch(this.selectedIndex);
      }
    },
    // 获取线别数据
    async getLineData(OrganizeIDs) {
      let res = await GetSearchData({
        dicID: 36,
        OrganizeTypeID: 6,
        OrganizeIDs: OrganizeIDs,
        Status: 1,
      });
      const { data, forms, result, msg } = res.data;
      if (result) {
        this.treeListTmp1 = data;
        this.treeData1 = JSON.parse(JSON.stringify(data));
        this.treeData1.unshift({
          OrganizeID: -1,
          OrganizeName: '全部',
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
    // 单击线体
    async handleNodeClick1(data, node) {
      this.clickData[1] = data;
      this.$set(
        this.formSearchs[this.selectedIndex].datas,
        'LineID',
        data.OrganizeID === -1 ? '' : data.OrganizeID,
      );
      this.dataSearch(this.selectedIndex);
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
    handleClick(tab, event) {
      console.log(tab, event);
      this.formSearchs[this.selectedIndex].datas['WorkShopID'] =
        this.clickData[0]?.OrganizeID === -1
          ? ''
          : this.clickData[0].OrganizeID;
      this.formSearchs[this.selectedIndex].datas['LineID'] =
        this.clickData[1]?.OrganizeID === -1
          ? ''
          : this.clickData[1].OrganizeID;
      this.selectedIndex = tab.name;
      this.dataSearch(this.selectedIndex);
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-tabs__item {
  padding: 5px !important;
  /* 设置为0或调整合适的数值 */
}
</style>
