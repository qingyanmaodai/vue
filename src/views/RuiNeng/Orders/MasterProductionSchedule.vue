<!--采购回复-->
<template>
  <div class="APSContainer flex_flex" v-loading="adminLoading">
    <el-container>
      <el-main style="padding: 0; margin: 0">
        <div class="admin_container_2" style="width: 100%">
          <div class="admin_head" ref="headRef">
            <div v-for="i in [0, 3, 5]" :key="i" v-show="labelStatus2 === i">
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
                    <!-- <el-input-number v-model="Days" type="number" v-show="labelStatus1 != 3 || labelStatus1 != 5"
                      size="small" placeholder="请选择周期">
                    </el-input-number>
                    <el-divider direction="vertical"></el-divider>
                    <el-button type="warning" size="mini" v-show="labelStatus1 != 3 || labelStatus1 != 5"
                      @click="transferMonthlyPlan">
                      转入月计划
                    </el-button> -->
                    <!-- <el-divider direction="vertical"></el-divider>

                    <el-button
                      type="primary"
                      size="mini"
                      @click="changeDate(0)"
                    >
                      复制
                    </el-button> -->
                    <!-- <el-divider direction="vertical"></el-divider>
                    <el-button
                      type="primary"
                      size="mini"
                      @click="changeEvent(0)"
                    >
                      拆分订单
                    </el-button> -->
                    <el-divider direction="vertical"></el-divider>
                    <div v-for="(item, y) in Status1" :key="y">
                      <span
                        @click="changeStatus(item, y)"
                        :class="
                          labelStatus1 == y ? 'statusActive cursor' : 'cursor'
                        "
                        >{{ item.label }}</span
                      >
                      <el-divider direction="vertical"></el-divider>
                    </div>
                  </el-col>
                </el-row>
              </div>
              <div
                class="flex_column"
                v-for="item in [0, 3, 5]"
                :key="item"
                v-show="item === labelStatus2"
              >
                <ComSpreadTable
                  ref="`spreadsheetRef${remarkTb}`"
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
                  @selectChanged="selectChanged"
                />
              </div>
            </div>
          </div>
        </div>
      </el-main>
    </el-container>
    <el-dialog :title="'拆分订单'" :visible.sync="Dialog" width="50%">
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
      <div v-for="item in [6]" :key="item">
        <ComSpreadTable2
          ref="spreadsheetRef"
          height="600px"
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
          :spaceBtnShow="false"
        />
      </div>
    </el-dialog>
    <el-dialog title="新增排程" :visible.sync="newDataDialog" width="80%">
      <div v-for="item in [7]" :key="item">
        <ComSearch
          class="margin_bottom_10 dialog_search"
          ref="searchRef"
          :searchData="formSearchs[item].datas"
          :searchForm="formSearchs[item].forms"
          :remark="item"
          :isLoading="isLoading[item]"
          :btnForm="btnForm"
          @btnClick="btnClick"
        />
        <ComSpreadTable2
          ref="spreadsheetRef"
          height="500px"
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
      <span slot="footer" class="dialog-footer">
        <el-button @click="newDataDialog = false" size="small">取 消</el-button>
        <el-button type="primary" @click="sureAddNewData" size="small"
          >确 定</el-button
        >
      </span>
    </el-dialog>
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
import ComSearch from '@/components/ComSearch/AdvancedSearch';
import ComAsideTree from '@/components/ComAsideTree';
import ComVxeTable from '@/components/ComVxeTable';
import ComReportTable from '@/components/ComReportTable';
import ComSpreadTable2 from '@/components/ComSpreadTable';
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
  name: 'MasterProductionSchedule',
  components: {
    ComSearch,
    ComAsideTree,
    ComVxeTable,
    ComReportTable,
    ComFormDialog,
    ComSpreadTable,
    ComSpreadTable2,
  },
  data() {
    return {
      Days: 50,
      newDataDialog: false,
      Dialog: false,
      Columns: [[]],
      isLoading: false,
      hasSelect: [true, true, true, true, true],
      footerLabel: [''],
      dialogShow: false,
      height1: '360px',
      labelStatus1: 0,
      labelStatus2: 0,
      Status1: [
        { label: '分配数量', value: -1 },
        { label: '数量+时间+线体', value: 0 },
        { label: '数量+时间+线体+托盘', value: '' },
        { label: '综合分析', value: '' },
        { label: '全部', value: 1 },
        // { label: "业务订单分析", value: 1 },
      ],
      //////////////左侧树节点//////////////
      showAside: true,
      ReplyDate: '',
      ////////////////// Search /////////////////
      title: this.$route.meta.title,
      delData: [[]],
      spread: [[], [], [], [], [], [], [], []],
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
        {
          datas: {},
          forms: [],
        },
        {
          datas: {},
          forms: [],
        },
        {
          datas: { IsToMainPlan: '未排' },
          forms: [],
        },
      ],
      selectionData: [[], [], [], [], [], [], [], []],
      btnForm: [],
      tableData: [[], [], [], [], [], [], [], []],
      tableColumns: [[], [], [], [], [], [], [], []],
      tableLoading: [false, false, false, false, false, false, false, false],
      isClear: [false, false, false, false, false, false, false, false],
      Region: [5, 5, 5, 5, 5, 5, 5, 5],
      tablePagination: [
        { pageIndex: 1, pageSize: 1000, pageTotal: 0 },
        { pageIndex: 1, pageSize: 1000, pageTotal: 0 },
        { pageIndex: 1, pageSize: 1000, pageTotal: 0 },
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
        { ID: 10075 },
        { ID: 10075 },
        { ID: 10075 },
        { ID: 10136 },
        { ID: 10075 },
        { ID: 10109 },
        { ID: 10109 },
        { ID: 5646 },
      ],
      sheetSelectRows: [],
      sheetSelectObj: { start: 0, end: 0, count: 0 },
      userInfo: {},
      oldval: null,
    };
  },
  computed: {},
  created() {
    _this = this;
    this.adminLoading = true;
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
    workbookInitialized: function (workbook, remarkTb) {
      this.spread[remarkTb] = workbook;
    },
    //获取当前选中行的值
    selectChanged(newValue, remarkTb) {
      // 在子组件计算属性发生变化时，更新父组件的计算属性
      this.selectionData[remarkTb] = newValue;
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
    // 复制
    // async changeDate(val) {
    //   let sheet = this.spread.getActiveSheet();
    //   if (val == 0) {
    //     if (this.selectionData[0].length === 0) {
    //       this.$message.error("请选择需要复制的数据的数据！");
    //       return;
    //     }
    //     this.tableData[0] = this.tableData[0].flatMap(obj => {
    //       if (obj.isChecked) {
    //         return [obj, { ...obj, LineID: "", SalesOrderDetailPlanID: null }];
    //       } else {
    //         return [obj];
    //       }
    //     });
    //     // .sort((a, b) => a.SalesOrderDetailPlanID - b.SalesOrderDetailPlanID);
    //     this.setData();
    //     console.log(this.tableData[0],'this.tableData[0]');
    //     // sheet.setDataSource(this.tableData[0]);
    //     // let res = await GetSearch(
    //     //   this.selectionData[1],
    //     //   "/APSAPI/OrderTaskDownload"
    //     // );
    //     // const { datas, forms, result, msg } = res.data;
    //     // if (result) {
    //     //   this.$message({
    //     //     message: msg,
    //     //     type: "success",
    //     //     dangerouslyUseHTMLString: true
    //     //   });
    //     //   this.dataSearch(1);
    //     //   this.$set(this, "adminLoading", false);
    //     // } else {
    //     //   this.$message({
    //     //     message: msg,
    //     //     type: "error",
    //     //     dangerouslyUseHTMLString: true
    //     //   });
    //     //   this.$set(this, "adminLoading", false);
    //     // }
    //   }
    // },
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
          // let DeletedRows = sheet.getDeletedRows().map(row => row.item);
          // DeletedRows.forEach(item => {
          //   item["ElementDeleteFlag"] = 1;
          // }); //获取被删除的数据
          updateRecords = [...DirtyRows, ...InsertRows];
        }
      }

      if (updateRecords.length == 0) {
        this.$set(this, 'adminLoading', false);
        this.$message.error('当前数据没做修改，请先修改再保存！');
        return;
      }
      let res = await GetSearch(updateRecords, '/APSAPI/SaveData10075');
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
        this.adminLoading = true;
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
    // 从业务订单更新
    async updateBusinessOrder(remarkTb, index) {
      // if (this.selectionData[remarkTb].length == 0) {
      //   this.$message.error("请选择需要提交的数据！");
      //   return;
      // } else {
      this.adminLoading = true;
      let res = await GetSearch('', '/APSAPI/FromOrderDetail');
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
      // }
    },
    // 转入月计划
    async transferMonthlyPlan(remarkTb, index) {
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth() + 1; // 月份从0开始，需要加1
      const day = today.getDate();
      const date2 = new Date(today);
      date2.setDate(date2.getDate() + this.Days);
      const year2 = date2.getFullYear();
      const month2 = date2.getMonth() + 1; // 月份从0开始，需要加1
      const day2 = date2.getDate();
      this.$confirm(
        `当前日期<span style="color: #2f8acb;">${year}-${month}-${day}</span>,转单范围为<span style="color: red;">+${
          this.Days
        }天</span>，即<span style="color: red;">${year2}-${month2}-${day2}</span>，确认将会把主计划<span style="color: red;">${
          month === month2 ? month + '月' : month + '月~' + month2 + '月'
        }</span>的排产数据转入整机月计划中，请确认是否转入`,
        '转月计划提醒',
        {
          dangerouslyUseHTMLString: true,
        },
      )
        .then(async () => {
          this.adminLoading = true;
          let res = await GetSearch(
            {
              Days: this.Days,
            },
            '/APSAPI/TOProcessPlanFromSalesOrder',
          );
          const { datas, forms, result, msg } = res.data;
          console.log(result, 'result');
          if (result) {
            this.adminLoading = false;
            this.$message({
              message: msg,
              type: 'success',
              dangerouslyUseHTMLString: true,
            });
            this.dataSearch(remarkTb);
          } else {
            this.adminLoading = false;
            this.$message({
              message: msg,
              type: 'error',
              dangerouslyUseHTMLString: true,
            });
          }
        })
        .catch(() => {
          // 取消
        });
    },
    // 删除
    async dataDel(remarkTb, index, parms) {
      if (this.selectionData[remarkTb].length == 0) {
        this.$message.error('请选择需要操作的数据！');
        return;
      }
      const errorNum1 = this.selectionData[remarkTb].findIndex(
        (item) => item['DataSource'] === '业务',
      );
      if (errorNum1 !== -1) {
        this.$message.error(`操作的数据中含有业务订单`);
        return;
      }
      this.$confirm(
        '确定要删除的【' + this.selectionData[remarkTb].length + '】数据吗',
      )
        .then((_) => {
          this.selectionData[remarkTb].forEach((x) => {
            if (x['DataSource'] === '手工' || x['DataSource'] === '拆单') {
              x['ElementDeleteFlag'] = 1;
            }
          });
          this.adminLoading = true;
          _this.dataSave(remarkTb, index, null, this.selectionData[remarkTb]);
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
          m.some((n, index) => {
            if (index === 1) {
              this.tablePagination[i]['pageSize'] = n['pageSize'];
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
        await this.dataSearch(0);
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
      let res = await GetSearchData(form);
      let { result, data, count, msg, Columns } = res.data;
      if (result) {
        this.$set(this.Columns, remarkTb, Columns[0]);
        this.$set(this.tableColumns, remarkTb, Columns[0]);
        this.$set(this.tableData, remarkTb, data);
        this.$set(this.tablePagination[remarkTb], 'pageTotal', count);
        if (
          this.labelStatus1 === 3 ||
          this.labelStatus1 === 5 ||
          remarkTb === 7
        ) {
          this.setData(remarkTb);
        }
      } else {
        this.$message({
          message: msg,
          type: 'error',
          dangerouslyUseHTMLString: true,
        });
      }
      this.$set(this.tableLoading, remarkTb, false);
      if (this.labelStatus1 !== 3 && this.labelStatus1 !== 5) {
        this.changeStatus(null, this.labelStatus1);
      }
    },
    // excle表数据渲染
    // setData(remarkTb) {
    //   try {
    //     console.log(this.spread, "this.spread");
    //     this.spread[remarkTb].suspendPaint();
    //     // 获取活动表单
    //     let sheet = this.spread[remarkTb].getActiveSheet();
    //     // 重置表单
    //     sheet.reset();
    //     //渲染数据源
    //     sheet.setDataSource(this.tableData[remarkTb]);
    //     // 渲染列
    //     this.tableColumns[remarkTb].forEach((x, y) => {
    //       x["name"] = x["prop"];
    //       x["displayName"] = x["label"];
    //       x["width"] = parseInt(x.width);
    //       if (x.prop === "isChecked") {
    //         // 选框
    //         sheet.setCellType(
    //           0,
    //           0,
    //           new HeaderCheckBoxCellType(),
    //           GCsheets.SheetArea.colHeader
    //         );
    //         x.cellType = new GC.Spread.Sheets.CellTypes.CheckBox();
    //       } else if (
    //         x.ControlType === "comboboxMultiple" ||
    //         x.ControlType === "combobox"
    //       ) {
    //         // colInfos.push({
    //         //   name: x.prop,
    //         //   displayName: x.label,
    //         //   cellType: "",
    //         //   size: parseInt(x.width)
    //         // });
    //         let newData = [];
    //         // let list = null;
    //         this.tableData[remarkTb].map((item, index) => {
    //           if (x.DataSourceID && x.DataSourceName) {
    //             newData = item[x.DataSourceName]; // 设置列表每行下拉菜单
    //             this.bindComboBoxToCell(sheet, index, y, newData);
    //           }
    //         });
    //       } else if (
    //         x.DataType == "datetime" ||
    //         x.DataType === "varchar" ||
    //         x.DataType === "nvarchar"
    //       ) {
    //         x.formatter = "@";
    //         // colInfos.push({
    //         //   name: x.prop,
    //         //   displayName: x.label,
    //         //   size: parseInt(x.width),
    //         //   formatter: "@" //字符串格式
    //         // });
    //       }

    //       //行，start,end
    //       if (x.isEdit) {
    //         sheet.getCell(-1, y).locked(false).foreColor("#2a06ecd9");
    //         // sheet.getRange(-1, cellIndex, 1, 1).locked(false);
    //         // let cell = sheet.getCell(
    //         //   -1,
    //         //   cellIndex,
    //         //   GC.Spread.Sheets.SheetArea.viewport
    //         // );
    //         // cell.foreColor("#2a06ecd9");
    //       }
    //       // cellIndex++;
    //     });
    //     //渲染列
    //     sheet.bindColumns(this.tableColumns[remarkTb]); //此方法一定要放在setDataSource后面才能正确渲染列名
    //     //改变字体颜色
    //     this.tableData[remarkTb].forEach((row, rowIndex) => {
    //       this.tableColumns[remarkTb].forEach((column, columnIndex) => {
    //         const key = column.prop;

    //         // 获取当前单元格
    //         const cell = sheet.getCell(rowIndex, columnIndex);

    //         // 获取颜色
    //         // if (row && row.colorMapping && row.colorMapping[key]) {
    //         //   const color = row.colorMapping[key];
    //         //   cell.style({
    //         //     backColor: color,
    //         //     foreColor: "#FFFFFF"
    //         //   });
    //         //   // 其他代码
    //         // }
    //         if (row["IsToMainPlan"] && row["IsToMainPlan"] === "已排") {
    //           cell.locked(true);
    //           // sheet.setCellType(rowIndex, columnIndex, "");
    //         }
    //         if (row["Result"] !== "正常" && row["Result"] && columnIndex < 5) {
    //           cell.backColor("#FF0000");
    //           // cell.style({
    //           //   foreColor: "#FF0000"
    //           // });
    //         }
    //         // const color = row.colorMapping[key];

    //         // 如果该属性有颜色信息，则设置单元格样式
    //         // if (color) {
    //         //   // const style = new GC.Spread.Sheets.Style();
    //         //   cell.backColor(color);
    //         //   cell.foreColor("#FFFFFF"); // 假设背景色为 color 的单元格的字体颜色为白色
    //         // }
    //       });
    //     });

    //     // 列筛选
    //     // 参数2 开始列
    //     // 参数3
    //     // 参数4 结束列
    //     let cellrange = new GC.Spread.Sheets.Range(
    //       -1,
    //       -1,
    //       -1,
    //       this.tableColumns[remarkTb].length
    //     );
    //     let hideRowFilter = new GC.Spread.Sheets.Filter.HideRowFilter(
    //       cellrange
    //     );
    //     sheet.rowFilter(hideRowFilter);

    //     // 设置整个列头的背景色和前景色。
    //     /**
    //      * 参数1:表示行
    //      * 参数2:列，-1表示
    //      * 参数3:
    //      * 参数4:
    //      * 参数5:
    //      */
    //     let colHeaderStyle = sheet.getRange(
    //       0,
    //       -1,
    //       1,
    //       -1,
    //       GC.Spread.Sheets.SheetArea.colHeader
    //     );
    //     colHeaderStyle.foreColor("000000d9");
    //     colHeaderStyle.backColor("#f3f3f3");
    //     colHeaderStyle.font(
    //       "12px basefontRegular, Roboto, Helvetica, Arial, sans-serif"
    //     );
    //     colHeaderStyle.hAlign(GC.Spread.Sheets.HorizontalAlign.left);
    //     colHeaderStyle.vAlign(GC.Spread.Sheets.HorizontalAlign.left);

    //     //设置数据渲染的单元格默认的样式
    //     var defaultStyle = new GC.Spread.Sheets.Style();
    //     defaultStyle.font =
    //       "12px basefontRegular, Roboto, Helvetica, Arial, sans-serif";
    //     defaultStyle.hAlign = GC.Spread.Sheets.HorizontalAlign.left;
    //     defaultStyle.vAlign = GC.Spread.Sheets.HorizontalAlign.left;
    //     sheet.setDefaultStyle(
    //       defaultStyle,
    //       GC.Spread.Sheets.SheetArea.viewport
    //     );
    //     defaultStyle.showEllipsis = true;
    //     if (this.tableColumns[remarkTb][0]["FixCount"]) {
    //       // 冻结
    //       sheet.frozenColumnCount(this.tableColumns[remarkTb][0].FixCount);
    //     }

    //     this.spread[remarkTb].options.tabStripVisible = false; //是否显示表单标签
    //     // this.spread[remarkTb].options.scrollbarMaxAlign = true;
    //     // this.spread[remarkTb].options.scrollByPixel = true;

    //     this.spread[remarkTb].resumePaint();
    //     sheet.options.isProtected = true;
    //     sheet.options.protectionOptions.allowResizeColumns = true;
    //     sheet.options.protectionOptions.allowInsertRows = true;
    //     sheet.options.protectionOptions.allowDeleteRows = true;
    //     sheet.options.protectionOptions.allowSelectLockedCells = true;
    //     sheet.options.protectionOptions.allowSelectUnlockedCells = true;
    //     sheet.options.protectionOptions.allowDeleteColumns = true;
    //     sheet.options.protectionOptions.allowInsertColumns = true;
    //     sheet.options.protectionOptions.allowDargInsertRows = true;
    //     sheet.options.protectionOptions.allowDragInsertColumns = true;
    //     sheet.options.protectionOptions.allowSort = true;
    //     sheet.options.protectionOptions.allowFilter = true;
    //     sheet.options.allowUserDragDrop = true;
    //   } catch (error) {
    //     console.log("表格渲染的错误信息:", error);
    //   }
    //   // this.spread[remarkTb].refresh(); //重新定位宽高度
    // },
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
      sheet.setDefaultStyle(defaultStyle, GC.Spread.Sheets.SheetArea.viewport);

      // 冻结第一列
      if (this.tableColumns[remarkTb][0]['FixCount']) {
        // 冻结
        sheet.frozenColumnCount(this.tableColumns[remarkTb][0].FixCount);
      }

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
          if (!rowItem['MOQty']) {
            cell.backColor('#FFFF00');
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
        });
      });

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
      /////////////////表格事件/////////////
      //绑定表格事件前，需清除之前的绑定事件
      this.spread[remarkTb].unbindAll();
      //表格编辑事件
      this.spread[remarkTb].bind(
        GCsheets.Events.EditStarting,
        function (e, args) {
          // 自动计算数量
          let currentRow = _this.tableData[remarkTb][args.row];
          let currentProp = _this.tableColumns[remarkTb][args.col]['prop'];
          _this.oldval = parseInt(currentRow[currentProp]);
        },
      );
      this.spread[remarkTb].bind(GCsheets.Events.EditEnded, function (e, args) {
        _this.computedNum(args.row, args.col, args.editingText, _this.oldval);
      });
      this.spread[remarkTb].resumePaint();
      this.adminLoading = false;
      this.tableLoading[remarkTb] = false;
      setTimeout(() => {
        this.spread[remarkTb].refresh(); //重新定位宽高度
      }, 0);
    },
    // 自动计算数量
    computedNum(rowIndex, colIndex, val, oldval) {
      if (!this.tableColumns[0][colIndex].prop2) {
        return;
      }
      let sheet = this.spread[this.labelStatus2].getActiveSheet();
      let dataSource = sheet.getDataSource();
      let currentRow = dataSource[rowIndex];
      let currentProp = this.tableColumns[this.labelStatus2][colIndex].prop;
      let propList = [];
      propList = this.tableColumns[this.labelStatus2]
        .map((x) => (x.prop2 ? x.prop : null))
        .filter((x) => x !== null);
      // let allVal = 0
      let { PlanQty } = currentRow;
      // propList.map((prop) => {
      //   if (currentRow[prop]) {
      //     allVal += parseInt(currentRow[prop])
      //   }
      // })
      console.log(Number.isFinite(val), val, 'PlanQty');

      if (!Number.isFinite(Number(val)) || Number.isFinite(Number(val)) < 0) {
        sheet.setValue(rowIndex, colIndex, oldval);
        this.$message.error('输入的值是负数或者不是数字类型');
        return;
      }
      oldval = oldval ? oldval : 0; //旧数据如果不存在把null变成0
      let changeIndex = propList.findIndex((item) => currentProp === item);
      let changeVal = parseInt(val) - oldval;
      if (!currentRow[propList[changeIndex + 1]]) {
        currentRow[propList[changeIndex + 1]] = 0;
      }
      currentRow[propList[changeIndex + 1]] =
        currentRow[propList[changeIndex + 1]] - changeVal <= 0
          ? 0
          : parseInt(currentRow[propList[changeIndex + 1]]) - changeVal;
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
      let changeColumns = [[]];
      if (index === 0) {
        changeColumns[0] = this.Columns[0].filter(
          (item) =>
            item['label'] !== '预计生产日期' &&
            item['label'] !== '线体' &&
            item['label'] !== '标准人员' &&
            item['label'] !== '每托数量' &&
            item['label'] !== '托板数',
        );
        this.$set(this.tableColumns, 0, changeColumns[0]);
        this.labelStatus2 = 0;
        this.setData(0);
      } else if (index === 1) {
        changeColumns[0] = this.Columns[0].filter(
          (item) =>
            item['label'] !== '标准人员' &&
            item['label'] !== '每托数量' &&
            item['label'] !== '托板数',
        );
        this.$set(this.tableColumns, 0, changeColumns[0]);
        this.labelStatus2 = 0;
        this.setData(0);
      } else if (index === 2) {
        changeColumns[0] = this.Columns[0].filter(
          (item) => item['label'] !== '标准人员',
        );
        this.$set(this.tableColumns, 0, changeColumns[0]);
        this.labelStatus2 = 0;
        this.setData(0);
      } else if (index === 3) {
        this.labelStatus2 = 3;
        this.dataSearch(3);
      } else if (index === 4) {
        changeColumns[0] = this.Columns[0];
        this.$set(this.tableColumns, 0, changeColumns[0]);
        this.labelStatus2 = 0;
        this.setData(0);
      } else if (index === 5) {
        this.labelStatus2 = 5;
        this.dataSearch(5);
      }
    },
    // 拆单
    splitOrder(remarkTb) {
      if (this.selectionData[remarkTb].length === 0) {
        this.$message.error('请选择需要拆单的数据！');
        return;
      }
      this.Dialog = true;
      let targetArray = JSON.parse(
        JSON.stringify(this.selectionData[remarkTb]),
      );
      let targetColumns = JSON.parse(
        JSON.stringify(this.tableColumns[remarkTb]),
      );

      targetColumns = targetColumns.filter(
        (item) =>
          item.label == '生产订单' ||
          item.label == '分配数' ||
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
      this.$set(this.tableColumns, 6, targetColumns);
      this.$nextTick(() => {
        this.$set(this.tableData, 6, targetArray);
        this.setData(6);
      });
    },
    // 拆单
    async changeEvent(val) {
      if (val === 1) {
        const errorNum1 = this.selectionData[6].findIndex(
          (item) => !item['SQty'],
        );
        if (errorNum1 !== -1) {
          this.$message.error(`第${errorNum1 + 1}行数据的拆分数量没有填写`);
          return;
        }

        const errorNum2 = this.selectionData[6].findIndex((item) => {
          return item['SQty'] > item['PlanQty'];
        });
        if (errorNum2 !== -1) {
          this.$message.error(`第${errorNum2 + 1}行数据的拆分数量超出可填范围`);
          return;
        }
        this.Dialog = false;
        let sheet = this.spread[this.labelStatus2].getActiveSheet();
        const changedIndices = [];
        this.tableData[this.labelStatus2].forEach((element, index) => {
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
        await this.dataSave(this.labelStatus2);
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
      this.tableData[this.labelStatus2][newRowIndex] = JSON.parse(
        JSON.stringify(oldData),
      );
      let newData = this.tableData[this.labelStatus2][newRowIndex]; // 获取数据源中新行的值
      let SQtyObj = this.selectionData[6].find(
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
      newData['SourceDetailPlanID'] = oldData['SalesOrderDetailPlanID']; // 将 SourceDetailPlanID 值设置为 null
      newData['SalesOrderDetailPlanID'] = null; // 将 SalesOrderDetailPlanID 值设置为 null
      newData['PlanQty'] = SQtyObj['SQty'];
      newData['DataSource'] = '拆单';
    },
    // 新增排程
    addSchedule() {
      this.dataSearch(7);
      this.newDataDialog = true;
    },
    // 确定添加这些排程进来
    async sureAddNewData() {
      // 不确定是否加进来就保存在数据库，怕其他按钮操作执行查询白添加了
      if (this.selectionData[7].length == 0) {
        this.$message.error('未选择数据！');
        this.newDataDialog = true;
      } else {
        this.selectionData[7].forEach((m) => {
          m.dicID = 10075;
          m['SalesOrderDetailPlanID'] = null;
          m['PlanQty'] = m['Qty'];
          m['DataSource'] = '手工';
        });
        _this.adminLoading = true;
        let res = await GetSearch(
          this.selectionData[7],
          `/APSAPI/SaveData10075`,
        );
        const { result, msg } = res.data;

        if (result) {
          this.adminLoading = false;
          this.dataSearch(0);
          this.selectionData[7] = [];
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
            duration: 8000,
          });
        }
        this.newDataDialog = false;
      }
    },
  },
};
</script>
