<!--组装日计划-->
<template>
  <div class="APSContainer flex_flex" v-loading="adminLoading">
    <el-container>
      <el-aside v-show="showAside" style="width: auto">
        <div class="admin_left_2" style="overflow: hidden">
          <div>
            <div class="flex px-2 py-1.5 border-b-1 tree_Head">
              <span class="tree_text">线别</span>
            </div>
            <el-tree
              class="tree-line"
              :indent="0"
              ref="asideTree"
              node-key="LineID"
              :data="treeData"
              :props="treeProps"
              :style="{ height: treeHeight + '', overflow: 'auto' }"
              highlight-current
              :expand-on-click-node="false"
              @node-click="handleNodeClick"
            ></el-tree>
          </div>
        </div>
      </el-aside>
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
                    <!-- <el-divider direction="vertical"></el-divider>
                    <div class="flex">
                      复期:
                      <el-date-picker
                        v-model="PODeliveryDate"
                        type="date"
                        size="small"
                        value-format="yyyy-MM-dd"
                        style="flex: 1;"
                        placeholder="请输入复期"
                      >
                      </el-date-picker>
                    </div>
                    <el-divider direction="vertical"></el-divider>
                    <el-button
                      type="primary"
                      size="mini"
                      @click="changeDate(0)"
                    >
                      批量指定日期
                    </el-button>
                    <el-divider direction="vertical"></el-divider> -->
                    <!-- <div
                      
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
              <div
                class="flex_column"
                v-for="item in [0]"
                :key="item"
                v-show="true"
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
                <!-- <ComVxeTable
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
                /> -->
              </div>
            </div>
          </div>
        </div>
      </el-main>
    </el-container>
    <el-dialog title="料品可用量查询" :visible.sync="dialogShow" width="50%">
      <div class="APSContainer" style="background-color: #f0f2f5">
        <div class="admin_content">
          采购单
          <ComReportTable
            :rowKey="'RowNumber'"
            :height="height1"
            :tableData="tableData[1]"
            :tableHeader="tableColumns[1]"
            :tableLoading="tableLoading[1]"
            :remark="1"
            :sysID="sysID[1].ID"
            :isClear="isClear[1]"
            :showFooter="true"
            :pagination="tablePagination[1]"
            @pageChange="pageChange"
            @pageSize="pageSize"
            @sortChange="sortChange"
          />
        </div>
      </div>
    </el-dialog>
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
  name: 'DIPDayPlan',
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
      CurrentSendQty: '',
      isLoading: false,
      hasSelect: [true, true, true, true, true],
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
        label: 'SumCount',
        children: 'children',
      },
      treeData: [],
      treeListTmp: [],
      ////////////////// Search /////////////////
      title: this.$route.meta.title,
      delData: [[]],
      formSearchs: [
        {
          datas: {
            PlanDay:
              new Date().getFullYear().toString() +
              '-' +
              (new Date().getMonth() + 1).toString() +
              '-' +
              new Date().getDate().toString(),
            ProcessGroupName: 'DIP',
          },
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
      hasSelect: [false, false, false, false, false],
      Region: [6, 6, 6, 6, 6],
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
        { ID: 10114 },
        { ID: 9053 },
        { ID: 10089 },
        { ID: 90531 },
        { ID: 9053 },
      ],
      userInfo: {},
      spread: [],
      sheetSelectRows: [],
      sheetSelectObj: { start: 0, end: 0, count: 0 },
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
    workbookInitialized: function (workbook, remarkTb) {
      this.spread[remarkTb] = workbook;
    },
    //获取当前选中行的值
    selectFun(data, remarkTb, row) {
      this.$set(this.selectionData, remarkTb, data);
    },
    searchTree(msg) {
      this.treeData = [];
      let treeListTmp = JSON.parse(JSON.stringify(this.treeListTmp));
      let tmp = msg
        ? this.rebuildData(msg, treeListTmp)
        : JSON.parse(JSON.stringify(treeListTmp));
      this.treeData.push(...tmp);
    },
    rebuildData(value, arr) {
      if (!arr) {
        return [];
      }
      let newarr = [];
      if (Object.prototype.toString.call(arr) === '[object Array]') {
        arr.forEach((element) => {
          if (element.SupplierName.indexOf(value) > -1) {
            // const ab = this.rebuildData(value, element.children);
            const obj = {
              ...element,
              children: element.children,
            };
            newarr.push(obj);
          } else {
            if (element.children && element.children.length > 0) {
              const ab = this.rebuildData(value, element.children);
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
        dicID: 10125,
        ProcessGroupName: 'DIP',
        // OrganizeTypeID: 6
      };
      let res = await GetSearchData(form);
      const { result, data, count, msg } = res.data;
      if (result) {
        // let newTree = [];
        if (data.length != 0) {
          // let supplierMap = new Map();
          data.forEach((a) => {
            // let currentSum = supplierMap.get(a.LineName) || 0;
            // currentSum += a.Counts;
            // supplierMap.set(a.LineName, currentSum);
            a['SumCount'] = `${a.LineName}(${a.Counts})`;
          });
          // newTree = Array.from(supplierMap.entries()).map(([LineName, sum]) => {
          //   const foundItem = data.find((a) => a.LineName === LineName);
          //   return {
          //     ...foundItem,
          //     SumCount: `${foundItem.LineName}(${sum})`,
          //   };
          // });
        }
        // console.log(newTree, "newTree");
        this.treeData = JSON.parse(JSON.stringify(data));
        // this.treeData.unshift({
        //   SupplierID: -1,
        //   SupplierName: "",
        //   SupplierNameCount: "全部" + "(" + num + ")",
        // });
        this.treeListTmp = this.treeData;
        this.getTableData(
          this.formSearchs[this.labelStatus1].datas,
          this.labelStatus1,
        );
        if (data.length != 0) {
          this.$nextTick(function () {
            _this.$refs.asideTree.setCurrentKey(0);
          });
        }
      } else {
        this.$message({
          message: msg,
          type: 'error',
          dangerouslyUseHTMLString: true,
        });
      }
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
    // 编辑行
    editRow(row) {},
    // 删除行
    delRow(row) {},
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
    // 全部下达
    async releaseOrders(remarkTb, index) {
      let submitData = [];
      if (this.selectionData[remarkTb].length == 0) {
        this.$message.error('请选择需要提交的数据！');
        return;
      } else {
        if (
          !this.selectionData[remarkTb].every(
            (obj) =>
              obj.hasOwnProperty('PlanDeliveryDate') && obj.PlanDeliveryDate,
          )
        ) {
          // 显示错误消息
          this.$message.error('有订单没有填写计划交期!');
          return;
        }
        let res = await GetSearch(
          this.selectionData[remarkTb],
          '/APSAPI/OrderTaskDownload',
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
    //批量设置日期
    async changeDate(val) {
      if (val == 0) {
        if (this.selectionData[0].length === 0) {
          this.$message.error('请选择需要提交的数据！');
          return;
        }
        if (!this.PODeliveryDate) {
          this.$message.error('请填写复期时间');
          return;
        }
        this.selectionData[0].map((item) => {
          this.$set(item, 'PODeliveryDate', this.PODeliveryDate);
        });
        // let res = await GetSearch(
        //   this.selectionData[1],
        //   "/APSAPI/OrderTaskDownload"
        // );
        // const { datas, forms, result, msg } = res.data;
        // if (result) {
        //   this.$message({
        //     message: msg,
        //     type: "success",
        //     dangerouslyUseHTMLString: true
        //   });
        //   this.dataSearch(1);
        //   this.$set(this, "adminLoading", false);
        // } else {
        //   this.$message({
        //     message: msg,
        //     type: "error",
        //     dangerouslyUseHTMLString: true
        //   });
        //   this.$set(this, "adminLoading", false);
        // }
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
        // 获取每个表头
        datas.some((m, i) => {
          this.$set(this.tableColumns, i, m);
          m.some((n, index) => {
            if (index === 1) {
              this.tablePagination[i]['pageSize'] = n['pageSize'];
              this.hasSelect[i] = n['IsSelect'];
              this.Region[i] = n['Region'] ? n['Region'] : this.Region[i];
            }
          });
        });
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
        // this.formSearchs[0].datas["Account"] = [this.userInfo.Account, null];
        // this.getTableData(this.formSearchs[0].datas, 0);
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
      const { result, data, count, msg } = res.data;
      if (result) {
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
            rowItem['IsDelay'] &&
            rowItem['IsDelay'] === 1 &&
            columnItem['name'] === 'OrderNo'
          ) {
            cell.backColor('#FF0000');
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
    // 单击线体
    handleNodeClick(data, node) {
      this.$set(
        this.formSearchs[this.labelStatus1].datas,
        'LineID',
        data.LineName == '所有' ? '' : data.LineID,
      );
      this.dataSearch(this.labelStatus1);
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
      // if (
      //   this.selectionData[remarkTb].length === 1 &&
      //   this.labelStatus1 === 1
      // ) {
      //   const {
      //     OrderNo,
      //     Code,
      //     OProductionQty,
      //     SentQty,
      //     UnSentQty
      //   } = this.selectionData[remarkTb][0];
      //   let StringValue = `当前选定计划订单 ${OrderNo} 产品编码 ${Code} 生产数量 ${OProductionQty} 已下达数量 ${SentQty} 可下达数量 ${UnSentQty}`;
      //   this.$set(this.footerLabel, 1, StringValue);
      //   this.$set(
      //     this.selectionData[remarkTb][0],
      //     "DownDeilveryDate",
      //     this.selectionData[remarkTb][0]["PlanDeliveryDate"]
      //   );
      // } else {
      //   this.$set(this.footerLabel, remarkTb, "");
      // }
    },
    tableRowClassName({ row, rowIndex }) {
      // let className = "";
      // if (row["JudgeResult"] == "交期冲突") {
      //   className += "bgRedColor";
      // }
      // return className;
    },
    // 行内列样式
    cellStyle({ row, column }) {
      if (column.property == 'PODeliveryDate' || column.property == 'Remark') {
        return {
          background: '#00b0f0',
        };
      } else if (column.property == 'ArriveQty') {
        return {
          color: '#00b0f0',
        };
      } else if (column.property == 'UnaccountedQty') {
        return {
          color: '#ff0000',
        };
      }
      // else if (
      //   column.property == "JudgeResult" &&
      //   row["JudgeResult"] == "交期冲突"
      // ) {
      //   return {
      //     background: "red",
      //   };
      // }
      else if (
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
      this.formSearchs[0].datas['ReplyStatus'] = item.value;
      // if (this.tableData[index].length == 0) {
      this.dataSearch(0);
      // }
    },
    // 改变状态
    // changeStatus(x, index) {
    //   this.labelStatus1 = index;
    //   this.formSearchs[0].datas["IsClose"] = x.value;
    //   if (x.label === "生产任务单") {
    //     this.dataSearch(1);
    //   } else {
    //     this.dataSearch(0);
    //   }
    // },
    // 可用量查询
    // usingSearch(row, prop) {
    //   this.formSearchs[1].datas["MaterialID"] = row.MaterialID;
    //   // this.formSearchs[1].datas["Remark1"] = "送货";
    //   this.dataSearch(1);
    //   this.dialogShow = true;
    // }
  },
};
</script>
