<!--物料点检-->
<template>
  <div
    class="APSContainer flex_column content_height bgWhite"
    v-loading="adminLoading"
  >
    <splitpanes class="default-theme">
      <pane :size="65">
        <div class="flex_column fullScreen">
          <div class="admin_head_2" ref="headRef">
            <ComSearch
              ref="searchRef"
              :searchData="formSearchs[0].datas"
              :searchForm="formSearchs[0].forms"
              :searchMoreForm="formSearchs[0].formsAll"
              :remark="0"
              :isLoading="isLoading"
              :signName="0"
              :Region="1"
              :btnForm="btnForm"
              @btnClick="btnClick"
            />
          </div>
          <!-- <div class="ant-table-title" ref="headRef_2">
            <el-row>
              <el-col :span="4"><span class="title">{{ title }}</span></el-col>
              <el-col :span="20" class="flex_flex_end">
                <div
                  
                  v-for="(item, y) in Status1"
                :key="y"
                >
                  <span @click="changeStatus(item, y)" :class="labelStatus1 == y ? 'statusActive cursor' : 'cursor'">{{ item.label }}</span>
                  <el-divider direction="vertical"></el-divider>
                </div>
              </el-col>
            </el-row>
          </div> -->
          <div v-for="item in [0]" :key="item" class="admin_content flex_grow">
            <ComVxeTable
              :ref="`tableRef${item}`"
              :rowKey="'RowNumber'"
              height="100%"
              :isToolbar="false"
              :isEdit="isEdit[0]"
              :tableData="tableData[0]"
              :tableHeader="tableColumns[0]"
              :tableLoading="tableLoading[0]"
              :remark="0"
              :cellStyle="cellStyle0"
              :sysID="sysID[0]['ID']"
              :isClear="isClear[0]"
              :hasSelect="hasSelect[item]"
              :pagination="tablePagination[0]"
              @pageChange="pageChange"
              @handleRowClick="handleRowClick"
              @pageSize="pageSize"
              @sortChange="sortChange"
              @selectfun="selectFun"
              :keepSource="true"
              :footerContent="true"
            />
          </div>
        </div>
      </pane>
      <pane :size="35">
        <div class="flex_column fullScreen">
          <div class="admin_head" ref="headRef">
            <div
              v-for="i in [1]"
              :key="'head' + i"
              v-show="Number(selectedIndex) === i"
            >
              <ComSearch
                ref="searchRef"
                :searchData="formSearchs[i].datas"
                :searchForm="formSearchs[i].forms"
                :searchMoreForm="formSearchs[i].formsAll"
                :remark="i"
                :signName="i"
                :Region="Region[i]"
                :isLoading="isLoading"
                :btnForm="btnForm"
                @btnClick="btnClick"
              />
            </div>
          </div>
          <!-- <div
            class="ant-table-title pd-0-6 flex_row_spaceBtn"
            ref="headRef_2"
          >
            <div>
              <el-tabs
                v-model="selectedIndex"
                @tab-click="handleClick"
                :stretch="true"
              >
                <el-tab-pane label="机台" name="1"></el-tab-pane>
                <el-tab-pane label="产品" name="2"></el-tab-pane
              ></el-tabs>
            </div>
            <div class="flex_flex_end">
              <el-divider direction="vertical"></el-divider>
              <el-button
                type="primary"
                size="mini"
                @click="AddEvent(1)"
                v-show="selectedIndex === '1'"
              >
                添加机台
              </el-button>
              <el-button
                type="primary"
                size="mini"
                @click="AddEvent(2)"
                v-show="selectedIndex === '2'"
              >
                添加产品
              </el-button>
            </div>
          </div> -->
          <div
            v-for="item in [1]"
            :key="item"
            v-show="Number(selectedIndex) === item"
            class="admin_content flex_grow"
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
              :footerContent="true"
            />
          </div>
        </div>
      </pane>
    </splitpanes>
    <!-- 弹框-->
    <DialogOptTable
      title="关联客户"
      :tableDialog="colDialogVisible2"
      :sysID="sysID[2]['ID']"
      :isEdit="isEdit[2]"
      :remark="2"
      :Region="Region[2]"
      width="80%"
      :hasSelect="hasSelect[2]"
      @closeDialog="colDialogVisible2 = false"
      @btnClickCall="btnClick"
      :searchForm="formSearchs[2]"
      :btnForm="btnForm"
      :isToolbar="false"
      :isConfirmBtn="true"
      :table-data="tableData[2]"
      :table-header="tableColumns[2]"
      :table-loading="tableLoading[2]"
      :table-pagination="tablePagination[2]"
      :isClear="isClear[2]"
      @confirmDialog="confirmDialog"
      @pageChangeCall="pageChange"
      @pageSizeCall="pageSize"
      @sortChangeCall="sortChange"
      @selectFunCall="selectFun"
    ></DialogOptTable>
    <!-- 弹框-->
    <!-- <DialogOptTable
      title="关联产品"
      :tableDialog="colDialogVisible3"
      :sysID="sysID[3]['ID']"
      :isEdit="isEdit[3]"
      :remark="3"
      width="80%"
      :hasSelect="hasSelect[3]"
      @closeDialog="colDialogVisible3 = false"
      @btnClickCall="btnClick"
      :searchForm="formSearchs[3]"
      :btnForm="btnForm"
      :isToolbar="false"
      :isConfirmBtn="true"
      :table-data="tableData[3]"
      :table-header="tableColumns[3]"
      :table-loading="tableLoading[3]"
      :table-pagination="tablePagination[3]"
      :isClear="isClear[3]"
      @confirmDialog="confirmDialog"
      @pageChangeCall="pageChange"
      @pageSizeCall="pageSize"
      @sortChangeCall="sortChange"
      @selectFunCall="selectFun"
    ></DialogOptTable> -->

    <ComFormDialog
      ref="processForm"
      :title="'复制'"
      :dialogShow="processDialog1"
      :formData="formData1"
      :formRules="formRules1"
      :formController="formController1"
      @dialogBtnClick="dialogBtnClick1"
    />
  </div>
</template>

<script>
var _this;
import { Splitpanes, Pane } from 'splitpanes';
import 'splitpanes/dist/splitpanes.css';
import ComSearch from '@/components/ComSearch/AdvancedSearch';
import ComVxeTable from '@/components/ComVxeTable';
import ComReportTable from '@/components/ComReportTable';
import DialogOptTable from '@/components/Dialog/dialogOptTable';
import ComFormDialog from '@/components/ComFormDialog';
import {
  GetHeader,
  GetSearchData,
  ExportData,
  SaveData,
  GetServerTime,
  GetSearch,
} from '@/api/Common';
export default {
  name: 'EKBusinessAuthorizationManagement',
  components: {
    ComSearch,
    ComVxeTable,
    ComReportTable,
    Splitpanes,
    Pane,
    ComFormDialog,
    DialogOptTable,
  },
  data() {
    return {
      ////////////////// Search /////////////////
      selectionData: [[], [], [], []],
      processDialog1: false,
      title: this.$route.meta.title,
      includeFields: [[], [], [], []],
      formData1: {
        ProcessName: '',
        ProcessID: '',
        SchedulingType: '',
        IsScheduling: true,
        IsAcquisition: true,
        Status: 1,
        dicID: 1182,
      },
      formRules1: {
        SchedulingType: [
          { required: true, message: '排产方式为必填项', trigger: 'change' },
        ],
      },
      formController1: [
        {
          label: '用户',
          prop: 'SchedulingType',
          type: 'select',
          select: [],
        },
      ],
      formSearchs: [
        {
          datas: {},
          forms: [],
          required: [], //获取必填项
          formsAll: [],
        },
        {
          datas: {},
          forms: [],
          required: [], //获取必填项
          formsAll: [],
        },
        {
          datas: {
            // IsConfig: 0,
          },
          forms: [],
          required: [], //获取必填项
          formsAll: [],
        },
        {
          datas: {},
          forms: [],
          required: [], //获取必填项
          formsAll: [],
        },
      ],
      btnForm: [],
      tableData: [[], [], [], []],
      tableColumns: [[], [], [], []],
      tableLoading: [false, false, false, false],
      isClear: [false, false, false, false],
      tablePagination: [
        { pageIndex: 1, pageSize: 50, pageTotal: 0 },
        { pageIndex: 1, pageSize: 0, pageTotal: 0 },
        { pageIndex: 1, pageSize: 50, pageTotal: 0 },
        { pageIndex: 1, pageSize: 50, pageTotal: 0 },
      ],
      height: '707px',
      tagRemark: 0,
      isLoading: false,
      adminLoading: false,
      Status1: [
        { label: '待确认', value: '未开始' },
        { label: '已完成', value: '已完成' },
        { label: '全部', value: '' },
      ],
      Region: [1, 2, 2],
      labelStatus1: 0,
      sysID: [{ ID: 7833 }, { ID: 10136 }, { ID: 7848 }],
      isEdit: [false, false, false, false],
      userInfo: {},
      selectedIndex: '1',
      colDialogVisible2: false,
      colDialogVisible3: false,
      clickRow: null,
      linkTableData: [],
      hasSelect: [false, false, false, false],
      addNum: 1,
      DataSourceList: [{}, {}, {}, {}],
    };
  },
  watch: {},
  created() {
    _this = this;
    this.adminLoading = true;
    this.userInfo = this.$store.getters.userInfo;
    this.getTableHeader();
    // 获取所有按钮
    this.btnForm = this.$route.meta.btns;
    this.judgeBtn(this.btnForm);
  },
  mounted() {
    // setTimeout(() => {
    //   this.setHeight();
    // }, 600);
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
    // 高度控制
    setHeight() {
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
    // 删除
    async dataDel(remarkTb, index, parms) {
      let newData = [];
      if (this.selectionData[remarkTb].length == 0) {
        this.$message.error('请单击需要操作的数据！');
        return;
      } else {
        // if (remarkTb === 1) {
        //   newData = _.cloneDeep(
        //     this.selectionData[remarkTb].map((x) => {
        //       x["SaleMan"] = "";
        //       return x;
        //     })
        //   );
        // } else {
        newData = _.cloneDeep(
          this.selectionData[remarkTb].map((x) => {
            x['ElementDeleteFlag'] = 1;
            return x;
          }),
        );
        // }
      }
      console.log(newData, 'newData');
      this.$confirm('确定要删除的【' + newData.length + '】数据吗？')
        .then((_) => {
          _this.dataSave(remarkTb, index, null, newData);
        })
        .catch((_) => {});
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
        if (this.formSearchs[remarkTb].forms.length) {
          // 判断是否是页面显示的查询条件，是的字段才清空
          this.formSearchs[remarkTb].forms.forEach((element) => {
            if (element['prop'] === name) {
              this.formSearchs[remarkTb].datas[name] = null;
            }
          });
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
    //添加产品机台
    async confirmDialog(remarkTb) {
      let newData = [];
      if (remarkTb === 2) {
        [this.clickRow].forEach((item0) => {
          let addData = _.cloneDeep(
            this.selectionData[2].filter((item2) => {
              if (item2['SaleManIDs']) {
                let SaleManIDs = item2['SaleManIDs']?.split(',');
                return !SaleManIDs.some((OID) => OID == item0['Account']);
              } else {
                return true;
              }
            }),
          );
          addData.forEach((item) => {
            item['dicID'] = 10136;
            item['SaleMan'] = item0['Account'];
          });
          newData = newData.concat(addData);
        });
      }
      await this.dataSave(1, null, null, newData);
      this.colDialogVisible2 = false;
    },
    // 保存
    async dataSave(remarkTb, index, parms, newData) {
      this.adminLoading = true;
      const $table = this.$refs[`tableRef${remarkTb}`]?.[0].$refs.vxeTable;
      // 获取修改记录
      let changeRecords = [];
      if (newData) {
        changeRecords = newData;
      } else {
        if ($table) {
          const { insertRecords, updateRecords, removeRecords } =
            $table.getRecordset();
          changeRecords = insertRecords.concat(updateRecords, removeRecords);
        } else {
        }
      }
      if (changeRecords.length == 0) {
        this.$set(this, 'adminLoading', false);
        this.$message.error('当前数据没做修改，请先修改再保存！');
        return;
      }
      if (changeRecords.length > 0 && !newData) {
        if (this.formSearchs[remarkTb].required.length) {
          // 动态检验必填项
          changeRecords.map((item1, index1) => {
            this.formSearchs[remarkTb].required.map((item2, index2) => {
              let content = item1[item2['prop']];
              if (!content && (content !== 0) & (content !== false)) {
                this.$message.error(`${item2['label']}不能为空，请选择`);
                this.$set(this, 'adminLoading', false);
                throw new Error('报错了');
              }
            });
          });
        }
      }
      let res = await SaveData(changeRecords);
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
      const { datas, forms, result, msg, formsAll } = res.data;
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
            //从列获取下拉数据源
            if (n.DataSourceID && n.ControlType === 'combobox') {
              this.DataSourceList[i] = {
                [n.DataSourceName]: n.items,
                ...this.DataSourceList[i],
              };
            }
            if (n.Required) {
              this.formSearchs[i].required.push(n);
            }
            if (index === 1) {
              this.tablePagination[i]['pageSize'] = n['pageSize'];
              this.hasSelect[i] = n['IsSelect'];
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
          this.$set(this.formSearchs[z], 'formsAll', formsAll[z]);
        });

        this.getTableData(this.formSearchs[0].datas, 0);
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
      const { result, data, count, msg } = res.data;
      if (result) {
        // if (remarkTb === 2) {
        //   data
        //     .filter((item2) => {
        //       return (
        //         item2["MaterialTypeID"] === this.clickRow["MaterialTypeID"]
        //       );
        //     })
        //     .forEach((item2) => {
        //       item2["isChecked"] = true;
        //     });
        //   this.linkTableData = data.filter((item) => {
        //     return item["isChecked"];
        //   });
        // }
        if (remarkTb === 0) {
          debugger;
          this.$set(this.tableData, 1, []);
        }
        this.$set(this.tableData, remarkTb, data);
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
    async handleRowClick(row, remarkTb) {
      this.clickRow = row;
      this.formSearchs[1].datas['SaleMan'] = row['Account'];
      await this.dataSearch(this.selectedIndex);
    },
    handleClick(tab, event) {
      console.log(tab, event);
      this.selectedIndex = tab.name;
      this.dataSearch(this.selectedIndex);
    },
    addRow(remarkTb) {
      const $table = this.$refs[`tableRef${remarkTb}`]?.[0].$refs.vxeTable;
      if (!this.addNum) {
        this.$message.error('请输入需要添加的行数!');
        return;
      }
      // 下拉数据是需要获取数据源
      for (let x = 0; x < this.addNum; x++) {
        let obj = {
          dicID: this.sysID[remarkTb]['ID'],
          RowNumber: _.uniqueId(),
        };
        this.tableColumns[remarkTb].map((item) => {
          obj[item.prop] = null;
          obj['update'] = true;
          if (item.prop === 'Status') {
            obj[item.prop] = 1;
          }
          for (let key in this.DataSourceList[remarkTb]) {
            if (item.DataSourceName === key) {
              obj[key] = this.DataSourceList[remarkTb][key];
            }
          }
        });
        $table.insert(obj);
      }
    },
    LinkData(remarkTb) {
      if (remarkTb == 1) {
        if (!this.clickRow) {
          this.$message.error('请点击需要绑定的数据！');
          return;
        }
        this.colDialogVisible2 = true;
        this.dataSearch(2);
      }
    },
    async Copy(remarkTb) {
      if (remarkTb == 0) {
        if (!this.clickRow) {
          this.$message.error('请点击需要复制的数据！');
          return;
        }
        let res = await GetSearchData({
          datas: {},
          forms: [],
          required: [], //获取必填项
          formsAll: [],
          pageIndex: 1,
          pageSize: 0,
          dicID: 7833,
        });
        const { result, data, count, msg } = res.data;
        if (result) {
          this.formController1[0]['select'] = data.map((item) => ({
            label: item.Name,
            value: item.Account,
          }));
          this.processDialog1 = true;
        }

        return;
        this.colDialogVisible2 = true;
        this.dataSearch(2);
      }
    },
    AddEvent(index) {
      if (!this.clickRow) {
        this.$message.error('请点击需要绑定的数据！');
        return;
      }
      if (index === 1) {
        this.colDialogVisible2 = true;
      }
      if (index === 2) {
        this.colDialogVisible4 = true;
      }
    },
    // 行内样式
    cellStyle0({ row, column }) {
      if (column.property == 'IsCompleteInspect') {
        if (row.IsCompleteInspect == '未开始') {
          return {
            backgroundColor: '#ff7b7b',
          };
        } else if (row.IsCompleteInspect == '进行中') {
          return {
            backgroundColor: '#fdfd8f',
          };
        } else if (row.IsCompleteInspect == '已完成') {
          return {
            backgroundColor: '#9fff9f',
          };
        }
      }
    },
    // 工序弹框确定添加
    async dialogBtnClick1(val) {
      if (val) {
        // if (this.formData1["SchedulingType"] === this.clickRow["Account"]) {
        //   this.$message.error("请选择不同的用户！");
        // }
        let res = await GetSearchData({
          ...this.formSearchs[1]['datas'],
          pageIndex: 1,
          pageSize: 0,
        });
        const { result, data, count, msg } = res.data;
        let newData = [];
        if (result) {
          newData = _.cloneDeep(
            data.map((item) => {
              item['SaleMan'] = this.formData1['SchedulingType'];
              return item;
            }),
          );
        }
        console.log(newData, 'newData');
        await this.dataSave(1, null, null, newData);
        this.processDialog1 = false;
        // let res = await SaveData([this.formData1]);
        // const { result, data, count, msg } = res.data;
        // if (result) {
        //   this.$message({
        //     message: msg,
        //     type: "success",
        //     dangerouslyUseHTMLString: true,
        //   });
        //   this.dataSearch(2);
        // } else {
        //   this.$message({
        //     message: msg,
        //     type: "error",
        //     dangerouslyUseHTMLString: true,
        //   });
        // }
      } else {
        _this.$refs.processForm.$refs.formData.resetFields();
        _this.processDialog1 = false;
      }
    },
    // 行内样式
    cellStyle({ row, column }) {
      if (column.property == 'OrderNo') {
        if (row.InspectStatus == 2) {
          return {
            backgroundColor: '#ff7b7b',
          };
        } else {
          if (row.InspectStatus == 1) {
            return {
              backgroundColor: '#9fff9f',
            };
          }
        }
      }
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
</style>
