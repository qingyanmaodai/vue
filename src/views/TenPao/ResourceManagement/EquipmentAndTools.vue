<!--设备与工装汇总-->
<template>
  <div class="APSContainer flex_column content_height" v-loading="adminLoading">
    <splitpanes class="default-theme" horizontal>
      <pane :size="60">
        <div class="flex_column" style="width: 100%; height: 100%">
          <div class="admin_head" ref="headRef">
            <ComSearch
              ref="searchRef"
              :searchData="formSearchs[0].datas"
              :searchForm="formSearchs[0].forms"
              :remark="0"
              :isLoading="isLoading"
              :btnForm="btnForm"
              @btnClick="btnClick"
              :signName="0"
            />
          </div>
          <!-- <div class="ant-table-title" ref="headRef_2">
            <el-row>
              <el-col :span="4"><span class="title">{{ title }}</span></el-col>
              <el-col :span="20" class="flex_flex_end">
                <span>新增行数：</span>
                <el-input-number v-model.trim="addNum" :min="1" :max="100" :step="10" placeholder="请输入"
                  size="small"></el-input-number>
                <el-divider direction="vertical"></el-divider></el-col>
            </el-row>
          </div> -->
          <div v-for="item in [0]" :key="item" class="admin_content flex_grow">
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
              :hasSelect="true"
              :isEdit="isEdit[item]"
              :isClear="isClear[item]"
              :keepSource="true"
              :pagination="tablePagination[item]"
              @pageChange="pageChange"
              @pageSize="pageSize"
              @sortChange="sortChange"
              @selectfun="selectFun"
              @handleRowClick="handleRowClick"
              :footerContent="false"
            />
          </div>
        </div>
      </pane>
      <pane :size="40">
        <div class="flex_column" style="width: 100%; height: 100%">
          <!-- <div class="admin_head" ref="headRef" v-for="item in [1, 2, 3]" :key="item + 'head'"
            v-show="Number(selectedIndex) === item">
            <ComSearch ref="searchRef" :searchData="formSearchs[item].datas" :searchForm="formSearchs[item].forms"
              :remark="item" :isLoading="isLoading" :btnForm="btnForm" @btnClick="btnClick" :signName="item" />
          </div> -->
          <div
            class="ant-table-title bgWhite pd-0-6 flex_row_spaceBtn"
            ref="headRef_2"
          >
            <div>
              <el-tabs
                v-model="selectedIndex"
                @tab-click="handleClick"
                :stretch="true"
              >
                <el-tab-pane label="关联产品配置" name="1"></el-tab-pane>
                <el-tab-pane label="关联产品族" name="2"></el-tab-pane>
                <el-tab-pane label="TPM设备明细" name="3"></el-tab-pane>
              </el-tabs>
            </div>
            <div class="flex_flex_end">
              <el-divider direction="vertical"></el-divider>
              <el-button
                type="primary"
                size="mini"
                @click="AddEvent(1)"
                v-show="selectedIndex === '1'"
              >
                添加产品
              </el-button>
              <el-button
                type="primary"
                size="mini"
                @click="AddEvent(2)"
                v-show="selectedIndex === '2'"
              >
                添加产品族
              </el-button>
              <el-button
                type="primary"
                size="mini"
                @click="AddEvent(3)"
                v-show="selectedIndex === '3'"
              >
                添加TPM设备
              </el-button>
            </div>
          </div>
          <div
            v-for="item in [1, 2, 3]"
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
              :hasSelect="true"
              :isEdit="isEdit[item]"
              :isClear="isClear[item]"
              :keepSource="true"
              :pagination="tablePagination[item]"
              @pageChange="pageChange"
              @pageSize="pageSize"
              @sortChange="sortChange"
              @selectfun="selectFun"
              :footerContent="false"
            />
          </div>
        </div>
      </pane>
    </splitpanes>
    <!-- 弹框-->
    <DialogTable
      title="添加产品"
      :tableDialog="colDialogVisible4"
      :sysID="sysID[4]['ID']"
      width="80%"
      :hasSelect="true"
      @closeDialog="colDialogVisible4 = false"
      :searchForm="formSearchs[4]"
      :isToolbar="false"
      :isConfirmBtn="true"
      @confirmDialog="confirmDialog"
    ></DialogTable>
    <DialogTable
      title="添加产品族"
      :tableDialog="colDialogVisible5"
      :sysID="sysID[5]['ID']"
      width="80%"
      :hasSelect="true"
      @closeDialog="colDialogVisible5 = false"
      :searchForm="formSearchs[5]"
      :isToolbar="false"
      :isConfirmBtn="true"
      @confirmDialog="confirmDialog"
    ></DialogTable>
    <DialogTable
      title="添加TPM设备"
      :tableDialog="colDialogVisible6"
      :sysID="sysID[6]['ID']"
      width="80%"
      :hasSelect="true"
      @closeDialog="colDialogVisible6 = false"
      :searchForm="formSearchs[6]"
      :isToolbar="false"
      :isConfirmBtn="true"
      @confirmDialog="confirmDialog"
    ></DialogTable>
  </div>
</template>

<script>
var _this;
import { Splitpanes, Pane } from 'splitpanes';
import 'splitpanes/dist/splitpanes.css';
import ComSearch from '@/components/ComSearch';
import ComVxeTable from '@/components/ComVxeTable';
import ComReportTable from '@/components/ComReportTable';
import DialogTable from '@/components/Dialog/dialogTable';
import {
  GetHeader,
  GetSearchData,
  ExportData,
  SaveData,
  GetServerTime,
} from '@/api/Common';
export default {
  name: 'EquipmentAndTools',
  components: {
    ComSearch,
    ComVxeTable,
    ComReportTable,
    Splitpanes,
    Pane,
    DialogTable,
  },
  data() {
    return {
      ////////////////// Search /////////////////
      footerLabel: [''],
      selectionData: [[], [], [], [], [], [], []],
      title: this.$route.meta.title,
      includeFields: [[], [], []],
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
      tableData: [[], [], [], [], [], [], []],
      tableColumns: [[], [], [], [], [], [], []],
      tableLoading: [false, false, false, false, false, false, false],
      isClear: [false, false, false, false, false, false, false],
      isEdit: [false, false, false, false, false, false, false],
      tablePagination: [
        { pageIndex: 1, pageSize: 20, pageTotal: 0 },
        { pageIndex: 1, pageSize: 20, pageTotal: 0 },
        { pageIndex: 1, pageSize: 20, pageTotal: 0 },
        { pageIndex: 1, pageSize: 20, pageTotal: 0 },
        { pageIndex: 1, pageSize: 20, pageTotal: 0 },
        { pageIndex: 1, pageSize: 20, pageTotal: 0 },
        { pageIndex: 1, pageSize: 20, pageTotal: 0 },
      ],
      tagRemark: 0,
      isLoading: false,
      adminLoading: false,
      OrderNo: '',
      OrderNoValue: '',
      OrderNos: [],
      labelStatus1: 0,
      labelStatus2: 0,
      sysID: [
        { ID: 11147 },
        { ID: 11146 },
        { ID: 11145 },
        { ID: 11148 },
        { ID: 1180 },
        { ID: 11142 },
        { ID: 133 },
      ],
      userInfo: {},
      selectedIndex: '1',
      colDialogVisible4: false,
      colDialogVisible5: false,
      colDialogVisible6: false,
      addNum: 1,
      DataSourceList: [{}],
      clickRow: null,
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
  mounted() {},
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
        this[methods](remarkTb);
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
      let updateRecords = [];
      if (newData) {
        updateRecords = newData;
      } else {
        if ($table) {
          updateRecords = $table.getUpdateRecords();
        } else {
          // let DirtyRows = sheet.getDirtyRows().map((row) => row.item); //获取修改过的数据
          // let InsertRows = sheet.getInsertRows().map((row) => row.item); //获取插入过的数据
          // let DeletedRows = sheet.getDeletedRows().map((row) => row.item);
          // DeletedRows.forEach((item) => {
          //   item["ElementDeleteFlag"] = 1;
          // }); //获取被删除的数据
          // updateRecords = [...DirtyRows, ...InsertRows, ...DeletedRows];
        }
      }
      console.log(updateRecords, 'updateRecords', this.$refs);
      if (updateRecords.length == 0) {
        this.$set(this, 'adminLoading', false);
        this.$message.error('当前数据没做修改，请先修改再保存！');
        return;
      }
      console.log(updateRecords, 'updateRecords.length');
      if (updateRecords.length > 0 && remarkTb === 0) {
        if (this.formSearchs[remarkTb].required.length) {
          // 动态检验必填项
          updateRecords.map((item1, index1) => {
            this.formSearchs[remarkTb].required.map((item2, index2) => {
              let content = item1[item2['prop']];
              if (!content && (content !== 0) & (content !== false)) {
                this.$message.error(`${item2['label']}不能为空，请选择`);
                this.$set(this, 'adminLoading', false);
                return;
              }
            });
          });
          // for (let i = 0; i < updateRecords.length; i++) {
          //   for (
          //     let x = 0;
          //     x < this.formSearchs[remarkTb].required.length;
          //     x++
          //   ) {
          //     let content =
          //       updateRecords[i][
          //       this.formSearchs[remarkTb].required[x]["prop"]
          //       ];
          //     if (!content && (content !== 0) & (content !== false)) {
          //       this.$message.error(
          //         `${this.formSearchs[remarkTb].required[x]["label"]}不能为空，请选择`
          //       );
          //       this.$set(this, "adminLoading", false);
          //       return;
          //     }
          //   }
          // }
        }
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
            //从列获取下拉数据源
            if (n.DataSourceID && n.ControlType === 'combobox' && i === 0) {
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
            }
          });
          this.$set(this.tableColumns, i, m);
          this.$set(this.OrderNos, i, m);

          this.OrderNos[i] = this.OrderNos[i]
            .filter((item) => item.isEdit)
            .map((item) => {
              return {
                value: item.prop,
                label: item.label,
              };
            });
          console.log(this.OrderNos, 'this.OrderNo');
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

        // this.formSearchs[0].datas["IsCompleteInspect"] = 0;
        // this.formSearchs[0].datas["PrepareStatus"] = 1;
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
        if (remarkTb == 1) {
          if (data.length != 0) {
            data.forEach((a) => {
              this.$set(a, 'update', false);
            });
          }
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
    // 改变状态
    changeStatus(item, index) {
      this.labelStatus1 = index;
      this.formSearchs[0].datas['IsCompleteInspect'] = item.value;
      this.$set(this.tableData, 1, []);
      this.dataSearch(0);
    },
    // 改变状态
    changeStatus2(item, index) {
      if (!this.formSearchs[1].datas['SalesOrderDetailID']) {
        this.$message.error('请单击上方行数据再查询！');
        return;
      }
      this.labelStatus2 = index;
      this.formSearchs[1].datas.PrepareType = '';
      this.formSearchs[1].datas.InspectStatus = '';
      this.formSearchs[1].datas.UnIssuedQty = '';
      if (index == 1) {
        this.formSearchs[1].datas.InspectStatus = 0;
      } else if (index == 2) {
        this.formSearchs[1].datas.InspectStatus = 2;
      } else if (index == 3) {
        this.formSearchs[1].datas.UnIssuedQty = '0';
        this.formSearchs[1].datas.InspectStatus = 0;
      }
      this.$set(this.tableData, 1, []);
      this.dataSearch(1);
    },
    // 选择数据
    selectFun(data, remarkTb, row) {
      this.$set(this.selectionData, remarkTb, data);
    },
    // 单击获取明细
    handleRowClick(row, remarkTb) {
      this.clickRow = row;
      this.formSearchs[1].datas['RAMID'] = row.RAMID;
      this.formSearchs[2].datas['RAMID'] = row.RAMID;
      this.formSearchs[3].datas['RAMID'] = row.RAMID;
      this.dataSearch(this.selectedIndex);
    },
    handleClick(tab, event) {
      console.log(tab, event);
      this.selectedIndex = tab.name;
      this.dataSearch(this.selectedIndex);
    },
    AddEvent(index) {
      if (!this.clickRow) {
        this.$message.error('请点击需要绑定的数据！');
        return;
      }
      if (index === 1) {
        this.colDialogVisible4 = true;
        this.formSearchs[3]['MachineTypeID'] = 'M20230614001';
      }
      if (index === 2) {
        this.colDialogVisible5 = true;
      }
      if (index === 3) {
        this.colDialogVisible6 = true;
      }
    },
    // 增行
    addRow(remarkTb) {
      if (!this.addNum) {
        this.$message.error('请输入需要添加的行数!');
        return;
      }
      // 下拉数据是需要获取数据源
      for (let x = 0; x < this.addNum; x++) {
        let obj = {
          dicID: this.sysID[remarkTb].ID,
          rowNum: _.uniqueId('rowNum_'),
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

        console.log('this.addNum', this.addNum);

        this.tableData[remarkTb].unshift(obj);
      }

      console.log('this.tableData[remarkTb]', this.tableData[remarkTb]);
    },
    //添加产品机台
    confirmDialog(data) {
      let tagNumber = Number(this.selectedIndex);
      data.map((item) => {
        item['RAMID'] = this.formSearchs[tagNumber]['datas']['RAMID'];
        item['dicID'] = this.sysID[tagNumber]['ID'];
      });
      this.colDialogVisible4 = false;
      this.colDialogVisible5 = false;
      this.colDialogVisible6 = false;
      this.dataSave(tagNumber, null, null, data);
    },
    // 删除
    async dataDel(remarkTb, index, parms) {
      let res = null;
      let newData = [];
      if (this.selectionData[remarkTb].length == 0) {
        this.$message.error('请单击需要操作的数据！');
        return;
      } else {
        this.selectionData[remarkTb].forEach((x) => {
          let obj = x;
          obj['ElementDeleteFlag'] = 1;
          newData.push(obj);
        });
      }
      this.$confirm('确定要删除的【' + newData.length + '】数据吗？')
        .then((_) => {
          _this.dataSave(remarkTb, index, null, newData);
        })
        .catch((_) => {});
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
