<!--物料点检-->
<template>
  <div
    class="APSContainer flex_column content_height gray"
    v-loading="adminLoading"
  >
    <div class="flex_column" style="width: 100%; height: 100%">
      <div
        v-for="i in [2]"
        :key="i + 'head'"
        class="admin_head_2 mb-[8px]"
        ref="headRef"
      >
        <ComSearch
          ref="searchRef"
          :searchData="formSearchs[i].datas"
          :searchForm="formSearchs[i].forms"
          :searchMoreForm="formSearchs[i].formsAll"
          :remark="i"
          :isLoading="isLoading"
          :signName="i"
          :Region="Region[i]"
          :btnForm="btnForm"
          @btnClick="btnClick"
        />
      </div>

      <div class="flex_grow gray flex0">
        <div class="flex0 w-60/100 flex-col mr-[10px]">
          <div class="itemCard">
            <div class="echartHead truncate w-full">
              <div class="echartTitle">车间当天点检概览</div>
              <div class="flex">
                <div v-for="(item, y) in Status1" :key="y">
                  <span
                    @click="changeStatus(item, y)"
                    :class="
                      labelStatus1 == item['index']
                        ? 'statusActive cursor'
                        : 'cursor'
                    "
                    >{{ item.label }}</span
                  >
                  <el-divider
                    v-if="y !== Status1.length - 1"
                    direction="vertical"
                  ></el-divider>
                </div>
              </div>
            </div>
            <div
              class="flex justify-between w-full px-[10px] truncate"
              style="height: 50px; background: #e9f3ff"
            >
              <div class="flex">
                <div
                  v-for="(item, index) in ItemArray"
                  :key="index"
                  class="flex truncate"
                >
                  <div
                    class="mr-[10px]"
                    style="color: #6a6a6a; font-size: 16px"
                  >
                    {{ item['key'] }}
                  </div>
                  <div
                    class="mr-[20px]"
                    style="color: #000; font-size: 16px; font-weight: 600"
                  >
                    {{ item['value'] }}
                  </div>
                </div>
              </div>
              <div class="flexProgress truncate">
                <el-progress
                  :percentage="percentage"
                  :color="customColors"
                  :format="
                    (percentage) => {
                      return '进度: ' + `${percentage}%`;
                    }
                  "
                ></el-progress>
              </div>
            </div>
            <div
              v-for="item in [2]"
              :key="item"
              class="admin_content flex_grow"
              style="padding: 10px"
            >
              <ComVxeTable
                :ref="`tableRef${item}`"
                :rowKey="'RowNumber'"
                height="100%"
                :tableData="tableData[item]"
                :tableHeader="tableColumns[item]"
                :tableLoading="tableLoading[item]"
                :isToolbar="false"
                :remark="item"
                :sysID="sysID[item]['ID']"
                :hasSelect="hasSelect[item]"
                :isEdit="isEdit[item]"
                :isClear="isClear[item]"
                :keepSource="true"
                :pagination="tablePagination[item]"
                @pageChange="pageChange"
                @pageSize="pageSize"
                @sortChange="sortChange"
                @selectfun="selectFun"
                @handleRowClick="handleRowClick"
              />
            </div>
          </div>
        </div>
        <div class="flex flex-col w-40/100">
          <div class="h-50/100 mb-[10px] w-full">
            <div class="itemCard">
              <div class="echartHead truncate">
                <div class="echartTitle">车间当天点检概览</div>
              </div>
              <div class="echartBody" ref="chart0"></div>
            </div>
          </div>
          <div class="h-50/100 w-full">
            <div class="itemCard">
              <div class="echartHead truncate">
                <div class="echartTitle">异常原因占比</div>
              </div>
              <div class="echartBody" ref="chart1"></div>
            </div>
          </div>
        </div>
      </div>
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
import { Splitpanes, Pane } from 'splitpanes';
import 'splitpanes/dist/splitpanes.css';
import ComSearch from '@/components/ComSearch/AdvancedSearch';
import ComVxeTable from '@/components/ComVxeTable';
import ComReportTable from '@/components/ComReportTable';
import ComBatchEdit from '@/components/ComBatchEdit';
import XLSX from 'xlsx';
import * as echarts from 'echarts';
import {
  GetHeader,
  GetSearchData,
  ExportData,
  SaveData,
  GetServerTime,
} from '@/api/Common';
export default {
  name: 'PrenatalCheckGuidePage',
  components: {
    ComSearch,
    ComVxeTable,
    ComReportTable,
    Splitpanes,
    Pane,
    ComBatchEdit,
  },
  data() {
    return {
      ////////////////// Search /////////////////
      ItemArray: [
        { key: '总任务', value: '57' },
        { key: '点检OK', value: '30' },
        { key: '点检异常', value: '3' },
        { key: '未点', value: '24' },
      ],
      percentage: 20,
      customColors: [
        { color: '#f56c6c', percentage: 20 },
        { color: '#e6a23c', percentage: 40 },
        { color: '​#ffff00', percentage: 60 },
        { color: '#1989fa', percentage: 80 },
        { color: '#5cb87a', percentage: 100 },
      ],
      selectionData: [[], [], [], [], []],
      title: this.$route.meta.title,
      includeFields: [[], [], [], [], []],
      hasSelect: [false, false, false, false, false],
      selectedIndex: '0',
      formSearchs: [
        {
          datas: {},
          forms: [],
          required: [], //获取必填项
        },
        {
          datas: {},
          forms: [],
          required: [], //获取必填项
        },
        {
          datas: {},
          forms: [],
          required: [], //获取必填项
        },
        {
          datas: {},
          forms: [],
          required: [], //获取必填项
        },
        {
          datas: {},
          forms: [],
          required: [], //获取必填项
        },
      ],
      btnForm: [],
      OrderNo: '',
      OrderNoValue: '',
      OrderNos: [[], [], [], [], []],
      tableData: [
        [
          { S1: 30, S2: 70, S3: 100, Name1: '一车间' },
          { S1: 0, S2: 49, S3: 121, Name1: '二车间' },
          { S1: 0, S2: 65, S3: 75, Name1: '五车间' },
          { S1: 0, S2: 160, S3: 20, Name1: '七车间' },
          { S1: 20, S2: 25, S3: 56, Name1: '电池阀车间' },
          { S1: 5, S2: 95, S3: 20, Name1: '风机车间' },
          { S1: 0, S2: 70, S3: 75, Name1: '电控车间' },
          { S1: 0, S2: 44, S3: 56, Name1: '比例阀车间' },
        ],
        [
          { S1: 38.4, Name1: '设备' },
          { S1: 19.4, Name1: '工具' },
          { S1: 29.4, Name1: '文件' },
          { S1: 32.4, Name1: '程序' },
          { S1: 18.2, Name1: '人员' },
        ],
        [],
        [],
        [],
      ],
      tableColumns: [[], [], [], [], []],
      tableLoading: [false, false, false, false, false],
      isClear: [false, false, false, false, false],
      tablePagination: [
        { pageIndex: 1, pageSize: 50, pageTotal: 0 },
        { pageIndex: 1, pageSize: 0, pageTotal: 0 },
        { pageIndex: 1, pageSize: 50, pageTotal: 0 },
        { pageIndex: 1, pageSize: 50, pageTotal: 0 },
        { pageIndex: 1, pageSize: 50, pageTotal: 0 },
      ],
      tagRemark: 0,
      isLoading: false,
      adminLoading: false,
      chart: [],
      chartOptions: [],
      Status1: [
        { label: '一车间', value: '未开始', index: 0 },
        { label: '二车间', value: '已完成', index: 1 },
        { label: '三车间', value: '', index: 2 },
      ],
      labelStatus1: 0,
      sysID: [{ ID: 15 }, { ID: 15 }, { ID: 15 }, { ID: 15 }, { ID: 15 }],
      isEdit: [false, false, false, false, false],
      userInfo: {},
      selectedIndex: '1',
      Region: [6, 6, 6, 6, 6],
      clickRow: null,
      dialogImport: false,
      fileList: [],
      file: [],
    };
  },
  watch: {},
  created() {
    _this = this;
    this.userInfo = this.$store.getters.userInfo;
    // 获取所有按钮
    this.btnForm = this.$route.meta.btns;
    this.judgeBtn(this.btnForm);
  },
  mounted() {
    this.chart = [
      echarts.init(this.$refs.chart0),
      echarts.init(this.$refs.chart1),
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ];
    this.adminLoading = true;
    this.getTableHeader();
    window.addEventListener('resize', this.handleWindowResize);
  },
  methods: {
    //按钮权限
    judgeBtn(routeBtn) {
      if (routeBtn && routeBtn.length > 0)
        routeBtn.some((item, index) => {
          if (item.ButtonCode == 'save') {
            if (!item['signName'] || item['signName'].length === 0) {
              this.isEdit.fill(true);
            } else if (item['signName'] && item['signName'].length > 0) {
              item['signName'].map((item) => {
                this.$set(this.isEdit, item, true);
              });
            }
          }
        });
      this.$set(this, 'btnForm', routeBtn);
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
    // 保存
    async dataSave(remarkTb, index, parms, newData) {
      this.adminLoading = true;
      // const sheet = this.spread[remarkTb]?.getActiveSheet();

      const $table = this.$refs[`tableRef${remarkTb}`]?.[0].$refs.vxeTable;
      // if (sheet && sheet.isEditing()) {
      //   sheet.endEdit();
      // }
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
          m.forEach((n, index) => {
            // 进行验证
            this.verifyDta(n);
            if (n.children && n.children.length != 0) {
              n.children.forEach((x) => {
                this.verifyDta(x);
              });
            }
            if (index === 1) {
              this.tablePagination[i]['pageSize'] = n['pageSize'];
              this.hasSelect[i] = n['IsSelect'];
              this.Region[i] = n['Region'] ? n['Region'] : this.Region[i];
            }
            if (n.Required) {
              this.formSearchs[i].required.push(n);
            }
          });
          this.$set(this.tableColumns, i, m);
          this.$set(
            this.OrderNos,
            i,
            m.filter((item) => item['isEdit'] === true),
          );
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
        this.getTableData(this.formSearchs[2].datas, 2);
        this.adminLoading = false;
      }
    },
    // 验证数据
    verifyDta(n) {
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
        Columns.some((m, i) => {
          m.forEach((n, index) => {
            // 进行验证
            this.verifyDta(n);
            if (n.childrens && n.children.length != 0) {
              n.childrens.forEach((x) => {
                this.verifyDta(x);
              });
            }
            this.$set(this.tableColumns, remarkTb, m);
          });
        });
        this.$set(this.tableData, remarkTb, data);
        this.$set(this.tablePagination[remarkTb], 'pageTotal', count);
        // if (remarkTb === 0 || remarkTb === 1) {
        await this.getEcharts(0);
        await this.getEcharts(1);
        // }
      } else {
        this.$message({
          message: msg,
          type: 'error',
          dangerouslyUseHTMLString: true,
        });
      }
      this.$set(this.tableLoading, remarkTb, false);
    },
    // 删除
    async dataDel(remarkTb, index, parms) {
      let newData = [];
      if (this.selectionData[remarkTb].length == 0) {
        this.$message.error('请选择需要操作的数据！');
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
    // 单击获取明细
    handleRowClick(row, remarkTb) {
      this.clickRow = row;
    },
    //双击事件
    async handleRowdbClick(row, remarkTb) {
      //获取原因数据源
    },
    changeProp(remarkTb, OrderNo, OrderNoValue) {
      if (!OrderNo) {
        this.$message.error('请选择需要修改的值');
        return;
      }
      if (this.tableData[remarkTb].length === 0) {
        this.$message.error('当前表格无数据');
        return;
      }
      if (this.selectionData[remarkTb].length === 0) {
        this.$message.error('请选择需要批量修改的行');
        return;
      }
      this.tableData[remarkTb].forEach((rowItem, rowIndex) => {
        if (rowItem['isChecked'] === true) {
          rowItem[OrderNo] = OrderNoValue;
        }
      });
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
        importData[0].sheet.forEach((m, y) => {
          for (let key in m) {
            if (this.tableColumns[this.labelStatus1].length) {
              // 判断是否和配置里的取名一致，一致才可导入
              for (
                let i = 0;
                i < this.tableColumns[this.labelStatus1].length;
                i++
              ) {
                let item = this.tableColumns[this.labelStatus1][i];
                if (item.label === key) {
                  if (item.DataType === 'datetime') {
                    if (m[key] && !this.isValidDate(m[key])) {
                      //预防用户输入日期格式不正确的判断
                      propName = key;
                      rowNo = Number(m.__rowNum__) + 1;
                      // 异常提示
                      split.push(
                        `第${rowNo}行,【${propName}】格式存在错误，导入失败，请检查！`,
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
                    // 注意的点：xlsx将excel中的时间内容解析后，会小一天xlsx会解析成 Mon Nov 02 2020 23:59:17 GMT+0800 小了43秒，所以需要在moment转换后＋1天
                    // 判断需求到料日期是否大于今天
                    // if (
                    //   item.prop === "DeliveryDate" &&obj[item.prop]&&
                    //   obj[item.prop] < formatDates.formatTodayDate()
                    // ) {
                    //   propName = this.$moment(obj[item.prop]).format('YYYY-MM-DD')
                    //   rowNo = Number(m.__rowNum__) + 1;
                    //   // 异常提示
                    //   split.push(
                    //     `第${rowNo}行,【${propName}】过期，导入失败，请检查！`
                    //   );
                    // }
                  }
                  // else if (item.prop === "DemandQty") {
                  //   if (m[key] > 0) {
                  //     //导入欠料数大于0才导入
                  //     obj[item.prop] = m[key];
                  //   } else {
                  //     return;
                  //   }
                  // }
                  else {
                    obj[item.prop] = m[key];
                  }
                } else if (isNaN(key) && !isNaN(Date.parse(key))) {
                  //导入日期并且数大于0才导入
                  // 列为日期的格式
                  isDate = true;
                  if (Number(m[key]) > 0) {
                    // obj["DeliveryDate"] = this.$moment(key).format("YYYY-MM-DD");
                    // obj["DemandQty"] = m[key];
                    obj['dicID'] = 7928;
                    obj['Account'] = _this.$store.getters.userInfo.Account;
                    obj['row'] = m.__rowNum__;
                    // 需要使用...obj 不然值回写有问题
                    DataList.push({ ...obj });
                    break;
                  }
                }
              }
            }
          }
          // 以下为固定入参
          if (!isDate) {
            obj['dicID'] = 7928;
            obj['Account'] = this.$store.getters.userInfo.Account;
            obj['row'] = m.__rowNum__;
            obj['Status'] = 0;
            // 需要使用...obj 不然值回写有问题
            DataList.push({ ...obj });
          }
        });
        // 必填校验
        if (this.formSearchs[this.labelStatus1].required.length) {
          // 动态检验必填项
          for (let i = 0; i < DataList.length; i++) {
            for (
              let x = 0;
              x < this.formSearchs[this.labelStatus1].required.length;
              x++
            ) {
              if (
                DataList[i][
                  this.formSearchs[this.labelStatus1].required[x]['prop']
                ] === undefined ||
                DataList[i][
                  this.formSearchs[this.labelStatus1].required[x]['prop']
                ] === null ||
                DataList[i][
                  this.formSearchs[this.labelStatus1].required[x]['prop']
                ] === ''
              ) {
                rowNo = Number(DataList[i]['row']) + 1;
                // 异常提示
                split.push(
                  `第${rowNo}行,【${
                    this.formSearchs[this.labelStatus1].required[x]['label']
                  }】不能为空，导入失败，请填写`,
                );
                this.adminLoading = false;
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
        // =1表示要删记录（删除并导入）
        // =0表示不删除（增量导入）
        if (DataList.length) {
          console.log('DataList', DataList);
          let res = await SaveData(DataList);
          const { result, data, count, msg } = res.data;
          if (result) {
            this.adminLoading = false;
            // this.dataSearch(this.labelStatus1);
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
    async getEcharts(remarkTb) {
      //获取屏幕宽度并计算比例
      function fontSize(res) {
        let clientWidth =
          window.innerWidth ||
          document.documentElement.clientWidth ||
          document.body.clientWidth;
        if (!clientWidth) return;
        return res * (clientWidth / 1920);
      }
      if (remarkTb === 0) {
        this.chartOptions[0] = {
          grid: {
            containLabel: true,
            bottom: -fontSize(30),
            left: fontSize(10),
            right: fontSize(10),
            top: fontSize(50),
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow',
            },
          },
          legend: {
            top: '0',
            right: '0',
            data: ['异常', '已点检', '未点检'],
            itemWidth: fontSize(14),
            itemHeight: fontSize(14),
            itemGap: fontSize(30),
            textStyle: {
              fontSize: fontSize(16),
              padding: [0, 0, 0, fontSize(10)],
            },
          },
          xAxis: {
            // name: "班级",
            triggerEvent: true,
            data: this.tableData[0].map((item) => item['Name1']),
            axisLabel: {
              interval: 0,
              show: true,
              color: '#000',
              fontSize: fontSize(16),
              rotate: 30, // 设置旋转角度为30度
              align: 'center',
              margin: fontSize(30),
              // verticalAlign: 'top',
            },
            axisLine: {
              lineStyle: {
                show: false,
                color: '#F3F3F3',
                width: 2,
              },
            },
          },
          yAxis: [
            {
              name: '单位:万',
              type: 'value',
              nameTextStyle: {
                color: '#444444',
                fontSize: fontSize(16),
              },
              axisLabel: {
                interval: 0,
                show: true,
                color: '#444444',
                fontSize: fontSize(12),
              },
              axisLine: {
                show: false,
                // lineStyle: {
                //   color: "#F3F3F3",
                //   width: 2
                // }
              },
              axisTick: {
                show: false,
              },
              splitLine: {
                lineStyle: {
                  type: 'dashed',
                  color: '#E9E9E9',
                },
              },
            },
          ],
          series: [
            {
              name: '未点检',
              type: 'bar',
              stack: '总量',
              silent: true,
              barWidth: fontSize(30),
              itemStyle: {
                color: '#0A9FF3',
              },
              data: this.tableData[0].map((item) => item['S3']),
              label: {
                show: true, // 显示标签
                position: 'inside', // 标签显示在柱状图的上方
                fontSize: fontSize(10),
                color: '#fff',
                formatter: function (params) {
                  // 在标签文本后添加百分号
                  return params.value ? params.value : '';
                },
              },
            },

            {
              name: '已点检',
              type: 'bar',
              stack: '总量',
              silent: true,
              barWidth: fontSize(30),
              itemStyle: {
                color: '#53CBFF',
              },
              data: this.tableData[0].map((item) => item['S2']),
              label: {
                show: true, // 显示标签
                position: 'inside', // 标签显示在柱状图的上方
                fontSize: fontSize(10),
                color: '#fff',
                formatter: function (params) {
                  // 在标签文本后添加百分号
                  return params.value ? params.value : '';
                },
              },
            },

            {
              name: '异常',
              type: 'bar',
              stack: '总量',
              silent: true,
              barWidth: fontSize(30),
              itemStyle: {
                color: '#FF9519',
              },
              data: this.tableData[0].map((item) => item['S1']),
              label: {
                show: true, // 显示标签
                position: 'inside', // 标签显示在柱状图的上方
                fontSize: fontSize(10),
                color: '#fff',
                formatter: function (params) {
                  // 在标签文本后添加百分号
                  return params.value ? params.value : '';
                },
              },
            },
          ],
        };
      } else if (remarkTb === 1) {
        this.chartOptions[1] = {
          // title: {
          //   text: "注册资金",
          //   subtext: "2016年",
          //   x: "center",
          //   y: "center",
          //   textStyle: {
          //     fontWeight: "normal",
          //     fontSize: 16
          //   }
          // },
          tooltip: {
            trigger: 'item',
            formatter: '{b}:({d}%)',
          },
          legend: {
            // top: '0',
            left: 'center',
            orient: 'horizontal',
            // right: "0%",
            bottom: '0',
            itemWidth: fontSize(14),
            itemHeight: fontSize(14),
            textStyle: {
              fontSize: fontSize(14),
            },
            itemStyle: {
              borderRadius: '50%', // 将图例项的形状设定为圆形
            },
            data: this.tableData[1].map((item) => item['Name1']),
          },
          grid: {
            containLabel: true,
          },
          series: [
            {
              type: 'pie',
              selectedMode: 'single',
              radius: ['40%', '80%'],
              color: [
                '#21A863',
                '#6DD93A',
                '#FF9519',
                '#F63F33',
                '#0A9FF3',
                '#6E40F2',
                '#FF61E6',
                '#E82074',
                '#FBA806',
              ],
              center: ['50%', '40%'],
              label: {
                position: 'inner',
                formatter: '{d}%',
                show: true,
                color: '#fff',
                textBorderColor: 'inherit',
                textBorderWidth: 1,
                fontSize: fontSize(16),
                formatter: function (params) {
                  // let percent = 0;
                  // let total = 0;
                  // for (var i = 0; i < this.tableData[2].length; i++) {
                  //   total += scaleData[i].value;
                  // }
                  // percent = ((params.value / total) * 100).toFixed(0);
                  if (params.name !== '') {
                    // return params.name + '\n' + params.data.data;
                    {
                      return params.percent + '%';
                    }
                  } else {
                    return '';
                  }
                },
              },
              labelLine: {
                show: false,
              },
              data: this.tableData[1].map((item) => {
                return {
                  value: item['S1'],
                  name: item['Name1'],
                };
              }),
            },
          ],
        };
      }
      this.barData(this.chart[remarkTb], this.chartOptions[remarkTb]);
    },
    // 渲染echart图
    barData(item, option) {
      // echarts.dispose(id);
      item.setOption(option);
    },
    handleWindowResize() {
      // 调用 resize 方法重新渲染图表
      setTimeout(() => {
        this.chart.map((item, remarkTb) => {
          if (item) {
            this.getEcharts(remarkTb);
            item.resize();
          }
        });
      }, 100);
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-tabs__item {
  padding: 5px;
  /* 设置为0或调整合适的数值 */
}
::v-deep .el-dialog__header {
  background-color: #409eff !important;
}
::v-deep .el-dialog__title {
  color: #fff !important;
}
::v-deep .el-dialog__close {
  color: #fff !important;
}
.itemCard {
  height: 100%;
  border-radius: 4px;
  background: #ffffff;
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-right: 0px !important;
}
.flexProgress {
  width: 350px;
}
.flexProgress .el-progress--line {
  white-space: nowrap;
  width: 300px;
  ::v-deep .el-progress-bar__outer {
    height: 16px !important;
  }
}
.echartHead {
  padding: 0px 10px;
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .echartTitle {
    position: relative;
    font-weight: 400;
    font-size: 14px;
    color: #333333;
    font-weight: bold;
    // white-space: nowrap;
    // overflow: hidden;
    // text-overflow: ellipsis;
  }
}
.echartBody {
  // height: 480px;
  flex-grow: 1;
  overflow: hidden;
  padding: 10px;
  width: 100%;
  // height: 100%;
}
</style>
