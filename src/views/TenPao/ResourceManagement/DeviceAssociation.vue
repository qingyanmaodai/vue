<!--物料点检-->
<template>
  <div
    class="APSContainer flex_column content_height bgWhite"
    v-loading="adminLoading"
  >
    <splitpanes class="default-theme">
      <pane :size="70">
        <div class="flex_column fullScreen">
          <div class="admin_head_2" ref="headRef">
            <ComSearch
              ref="searchRef"
              :searchData="formSearchs[0].datas"
              :searchForm="formSearchs[0].forms"
              :remark="0"
              :isLoading="isLoading"
              :btnForm="btnForm"
              @btnClick="btnClick"
              :Region="Region[0]"
              :signName="labelStatus1"
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
              ref="tableRef"
              :rowKey="'RowNumber'"
              height="100%"
              :isToolbar="false"
              :isEdit="isEdit[0]"
              :tableData="tableData[0]"
              :tableHeader="tableColumns[0]"
              :tableLoading="tableLoading[0]"
              :remark="0"
              :hasSelect="hasSelect[0]"
              :sysID="sysID[0]['ID']"
              :isClear="isClear[0]"
              :pagination="tablePagination[0]"
              @pageChange="pageChange"
              @handleRowClick="handleRowClick"
              @pageSize="pageSize"
              @sortChange="sortChange"
              :keepSource="true"
              :footerContent="true"
            />
          </div>
        </div>
      </pane>
      <pane :size="30">
        <div class="flex_column fullScreen">
          <!-- <div class="admin_head_2" ref="headRef">
            <ComSearch ref="searchRef" :searchData="formSearchs[1].datas" :searchForm="formSearchs[1].forms" :remark="1"
              :isLoading="isLoading" :btnForm="btnForm" @btnClick="btnClick" :signName="labelStatus1" />
          </div> -->
          <div class="ant-table-title pd-0-6 flex_row_spaceBtn" ref="headRef_2">
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
              <el-divider direction="vertical"></el-divider>
              <el-button
                type="danger"
                size="mini"
                @click="dataDel(Number(selectedIndex))"
              >
                移除
              </el-button>
            </div>
          </div>
          <div
            v-for="item in [1, 2]"
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
      title="添加机台"
      ref="DialogOptTable3"
      :tableDialog="colDialogVisible3"
      :sysID="sysID[3]['ID']"
      :isEdit="isEdit[3]"
      :remark="3"
      width="70%"
      :hasSelect="true"
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
      :Region="Region[3]"
      @confirmDialog="confirmDialog"
      @pageChangeCall="pageChange"
      @pageSizeCall="pageSize"
      @sortChangeCall="sortChange"
      @selectFunCall="selectFun"
    ></DialogOptTable>
    <DialogOptTable
      title="添加产品"
      ref="DialogOptTable4"
      :tableDialog="colDialogVisible4"
      :sysID="sysID[4]['ID']"
      :isEdit="isEdit[4]"
      :remark="4"
      width="70%"
      :hasSelect="true"
      @closeDialog="colDialogVisible4 = false"
      @btnClickCall="btnClick"
      :searchForm="formSearchs[4]"
      :btnForm="btnForm"
      :isToolbar="false"
      :isConfirmBtn="true"
      :table-data="tableData[4]"
      :table-header="tableColumns[4]"
      :table-loading="tableLoading[4]"
      :table-pagination="tablePagination[4]"
      :isClear="isClear[4]"
      :Region="Region[4]"
      @confirmDialog="confirmDialog"
      @pageChangeCall="pageChange"
      @pageSizeCall="pageSize"
      @sortChangeCall="sortChange"
      @selectFunCall="selectFun"
    ></DialogOptTable>
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
import {
  GetHeader,
  GetSearchData,
  ExportData,
  SaveData,
  GetServerTime,
} from '@/api/Common';
export default {
  name: 'DeviceAssociation',
  components: {
    ComSearch,
    ComVxeTable,
    ComReportTable,
    Splitpanes,
    Pane,
    DialogOptTable,
  },
  data() {
    return {
      ////////////////// Search /////////////////
      selectionData: [[], [], [], [], [], [], []],
      title: this.$route.meta.title,
      includeFields: [[], [], [], [], [], [], []],
      hasSelect: [false, false, false, false, false],
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
      btnForm: [],
      tableData: [[], [], [], [], []],
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
      height: '707px',
      tagRemark: 0,
      isLoading: false,
      adminLoading: false,
      Status1: [
        { label: '待确认', value: '未开始' },
        { label: '已完成', value: '已完成' },
        { label: '全部', value: '' },
      ],
      labelStatus1: 0,
      sysID: [{ ID: 108 }, { ID: 110 }, { ID: 112 }, { ID: 90 }, { ID: 1180 }],
      Region: [5, 6, 6, 6, 6, 6],
      isEdit: false,
      userInfo: {},
      selectedIndex: '1',
      colDialogVisible3: false,
      colDialogVisible4: false,
      clickRow: null,
      linkTableData: [],
      linkTableData2: [],
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
    //添加产品机台
    async confirmDialog(remarkTb) {
      if (Number(this.selectedIndex) === 1) {
        const $table =
          this.$refs[`DialogOptTable3`]?.$refs.vxeTable.$refs.vxeTable;
        if ($table) {
          this.selectionData[remarkTb] = $table.getCheckboxRecords();
        }
        let newData = [];
        //添加
        let addData1 = this.selectionData[3].filter(
          (item0) =>
            !this.linkTableData.some((item3) => {
              return item3['MachineID'] === item0['MachineID'];
            }),
        );
        addData1.forEach((item) => {
          item['dicID'] = 110;
          item['MachineMouldID'] =
            this.formSearchs[1]['datas']['MachineMouldID'];
        });
        newData = newData.concat(addData1);
        //删除
        let addData2 = this.linkTableData.filter(
          (item0) =>
            !this.selectionData[3].some((item3) => {
              return item3['MachineID'] === item0['MachineID'];
            }),
        );
        addData2.forEach((item) => {
          item['dicID'] = 110;
          item['ElementDeleteFlag'] = 1;
        });

        newData = newData.concat(addData2);
        this.dataSave(1, null, null, newData);
        this.colDialogVisible3 = false;
      } else if (Number(this.selectedIndex) === 2) {
        const $table =
          this.$refs[`DialogOptTable4`]?.$refs.vxeTable.$refs.vxeTable;
        if ($table) {
          this.selectionData[remarkTb] = $table.getCheckboxRecords();
        }
        let newData = [];
        //添加
        let addData1 = this.selectionData[4].filter(
          (item0) =>
            !this.linkTableData.some((item3) => {
              return item3['Code'] === item0['Code'];
            }),
        );
        addData1.forEach((item) => {
          item['dicID'] = 112;
          item['MachineMouldID'] =
            this.formSearchs[2]['datas']['MachineMouldID'];
        });
        newData = newData.concat(addData1);
        //删除
        let addData2 = this.linkTableData.filter(
          (item0) =>
            !this.selectionData[4].some((item3) => {
              return item3['Code'] === item0['Code'];
            }),
        );
        addData2.forEach((item) => {
          item['dicID'] = 112;
          item['ElementDeleteFlag'] = 1;
        });

        newData = newData.concat(addData2);
        this.dataSave(2, null, null, newData);
        this.colDialogVisible4 = false;
      }
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

        // this.formSearchs[0].datas["IsCompleteInspect"] = 0;
        this.formSearchs[0].datas['PrepareStatus'] = 1;
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
        this.linkTableData = [];
        if (remarkTb === 3) {
          data.forEach((item1) => {
            // 使用find方法在第二个数组中查找匹配的SaleMan
            const matching = this.linkTableData2.find(
              (item2) => item2.MachineID === item1.MachineID,
            );
            if (matching) {
              item1.isChecked = true;
              this.linkTableData.push(matching);
            }
          });
        } else if (remarkTb === 4) {
          data.forEach((item1) => {
            // 使用find方法在第二个数组中查找匹配的SaleMan
            const matching = this.linkTableData2.find(
              (item2) => item2.Code === item1.Code,
            );
            if (matching) {
              item1.isChecked = true;
              this.linkTableData.push(matching);
            }
          });
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
    // 单击获取明细
    handleRowClick(row, remarkTb) {
      this.clickRow = row;
      this.formSearchs[1].datas['MachineMouldID'] = row.MachineMouldID;
      this.formSearchs[2].datas['MachineMouldID'] = row.MachineMouldID;
      this.dataSearch(this.selectedIndex);
    },
    handleClick(tab, event) {
      console.log(tab, event);
      this.selectedIndex = tab.name;
      this.dataSearch(this.selectedIndex);
    },
    async AddEvent(index) {
      if (!this.clickRow) {
        this.$message.error('请点击需要绑定的数据！');
        return;
      }
      if (index === 1) {
        let form = {
          dicID: 110,
          rows: 0,
          MachineMouldID: this.formSearchs[1].datas['MachineMouldID'],
        };
        let res = await GetSearchData(form);
        const { result, data, count, msg, Columns } = res.data;
        if (result) {
          this.$set(this, 'linkTableData2', data);
        } else {
          this.$message({
            message: msg,
            type: 'error',
            dangerouslyUseHTMLString: true,
          });
        }
        this.colDialogVisible3 = true;
        this.dataReset(3);
        await this.dataSearch(3);
      }
      if (index === 2) {
        let form = {
          dicID: 112,
          rows: 0,
          MachineMouldID: this.formSearchs[2].datas['MachineMouldID'],
        };
        let res = await GetSearchData(form);
        const { result, data, count, msg, Columns } = res.data;
        if (result) {
          this.$set(this, 'linkTableData2', data);
        } else {
          this.$message({
            message: msg,
            type: 'error',
            dangerouslyUseHTMLString: true,
          });
        }
        this.colDialogVisible4 = true;
        this.dataReset(4);
        await this.dataSearch(4);
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
