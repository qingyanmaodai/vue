<!--研发打样复期-->
<template>
  <div class="APSContainer flex_flex" v-loading="adminLoading">
    <el-container>
      <el-main style="padding: 0; margin: 0">
        <div class="admin_container_2" style="width: 100%">
          <div class="admin_head" ref="headRef">
            <ComSearch
              ref="searchRef"
              :searchData="formSearchs[0].datas"
              :searchForm="formSearchs[0].forms"
              :remark="0"
              :signName="labelStatus1"
              :btnForm="btnForm"
              @btnClick="btnClick"
            />
          </div>
          <div>
            <div class="admin_content">
              <div class="ant-table-title">
                <el-row>
                  <el-col :span="4">
                    <span class="title">
                      <i
                        class="el-icon-d-arrow-right"
                        v-show="!showAside"
                        @click="showAside = !showAside"
                      ></i
                      >{{ title }}</span
                    >
                  </el-col>
                  <el-col :span="20" class="flex_flex_end">
                    <el-date-picker
                      v-model="ReplyDate"
                      type="date"
                      size="small"
                      value-format="yyyy-MM-dd"
                      placeholder="日期选择"
                    >
                    </el-date-picker>
                    <el-divider direction="vertical"></el-divider>
                    <el-button
                      v-for="(ele, i) in parmsBtn2"
                      :key="ele.BtnName"
                      :type="ele.Type"
                      :size="ele.Size"
                      @click="btnClick(ele.Methods, ele.Params, i)"
                    >
                      {{ ele.BtnName }}
                    </el-button>
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
              <ComVxeTable
                ref="ComVxeTable"
                :rowKey="'RowNumber'"
                :height="height"
                :tableData="tableData[0]"
                :tableHeader="tableColumns[0]"
                :tableLoading="tableLoading[0]"
                :remark="0"
                :sysID="sysID[0].ID"
                :hasSelect="true"
                :isEdit="isEdit"
                :cellStyle="cellStyle"
                :tableRowClassName="tableRowClassName"
                :isClear="isClear[0]"
                :pagination="tablePagination[0]"
                @pageChange="pageChange"
                @pageSize="pageSize"
                @selectfun="selectFun"
                @toPage="toPage"
                @sortChange="sortChange"
                :keepSource="true"
              />
            </div>
          </div>
        </div>
      </el-main>
    </el-container>
    <el-dialog title="复期变更记录" :visible.sync="orderDialog" width="70%">
      <div class="APSContainer" style="background-color: #f0f2f5">
        <div class="admin_content">
          复期变更记录
          <ComReportTable
            :rowKey="'RowNumber'"
            :height="height1"
            :tableData="tableData[1]"
            :tableHeader="tableColumns[1]"
            :tableLoading="tableLoading[1]"
            :remark="1"
            :sysID="sysID[1].ID"
            :isClear="isClear[1]"
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
import XLSX from 'xlsx';
import ComSearch from '@/components/ComSearch';
import ComAsideTree from '@/components/ComAsideTree';
import ComVxeTable from '@/components/ComVxeTable';
import ComReportTable from '@/components/ComReportTable';
import {
  GetHeader,
  GetSearchData,
  ExportData,
  SaveData,
  GetServerTime,
  UpdateOrderBomPOTracker,
} from '@/api/Common';
import ComFormDialog from '@/components/ComFormDialog';
export default {
  name: 'DevelopProofingReply',
  components: {
    ComSearch,
    ComAsideTree,
    ComVxeTable,
    ComReportTable,
    ComFormDialog,
  },
  data() {
    return {
      height1: '500px',
      dialogShow: false,
      orderDialog: false,
      EditDisabled: false,
      height1: '360px',
      labelStatus1: 1,
      Status1: [
        { label: '全部未结案', value: '' },
        { label: '未复期', value: '未复期' },
        { label: '复期不满足', value: '已复期' },
        { label: '逾期未回', value: '已复期' },
        { label: '已结案', value: '已结案' },
        // { label: "全部", value: "" },
        // { label: "待复期", value: 0 },
        // { label: "复期超时", value: 5 },
        // { label: "三天内即将到期", value: 4 },
        // { label: "已复期", value: [1, 2, 3, 4, 5] },
        // { label: "复期异常", value: 2 },
        // { label: "复期变更", value: 3 },
      ],
      //////////////左侧树节点//////////////
      showAside: true,
      ReplyDate: '',
      treeProps: {
        label: 'SupplierNameCount',
        children: 'children',
      },
      treeData: [],
      treeListTmp: [],
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
      ],
      parmsBtn: [
        {
          ButtonCode: 'save',
          BtnName: '保存',
          Type: 'success',
          Ghost: true,
          Size: 'small',
          Methods: 'allSave',
          Icon: '',
        },
        {
          ButtonCode: 'noPass',
          BtnName: '结案',
          Type: 'danger',
          Ghost: true,
          Size: 'small',
          Methods: 'cancelSave',
          Icon: '',
          Params: { val: '已结案' },
          signName: ['NaN'],
        },
        {
          ButtonCode: 'noPass',
          BtnName: '取消结案',
          Type: 'primary',
          Ghost: true,
          Size: 'small',
          Methods: 'cancelSave',
          Icon: '',
          Params: { val: '未结案' },
          signName: ['NaN'],
        },
      ],
      parmsBtn2: [
        {
          ButtonCode: 'save',
          BtnName: '批量回复日期',
          Type: 'primary',
          Ghost: true,
          Size: 'small',
          Methods: 'changeDate',
          Icon: '',
          Params: { val: 0 },
        },
        // {
        //   ButtonCode: "save",
        //   BtnName: "批量二次回复日期",
        //   Type: "warning",
        //   Ghost: true,
        //   Size: "small",
        //   Methods: "changeDate",
        //   Icon: "",
        //   Params:{val:1}
        // },
        {
          ButtonCode: 'syncSave',
          BtnName: '同步更新采购员',
          Type: 'success',
          Ghost: true,
          Size: 'small',
          Methods: 'refreshPOTraker',
          Icon: '',
        },
      ],
      selectionData: [[], []],
      btnForm: [],
      tableData: [[], []],
      tableColumns: [[], []],
      tableLoading: [false, false],
      isClear: [false, false],
      tablePagination: [
        { pageIndex: 1, pageSize: 500, pageTotal: 0 },
        { pageIndex: 1, pageSize: 500, pageTotal: 0 },
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
      sysID: [{ ID: 9023 }, { ID: 9028 }],
      userInfo: {},
      IsPurchaseBoss: false,
      footerLabel: [''],
      RoleMapStatus: false,
      MaterialPeople: false,
    };
  },
  computed: {},
  created() {
    _this = this;
    this.getTableHeader();
    let RoleMapList = this.$store.getters.userInfo.RoleMap;
    if (RoleMapList.length) {
      RoleMapList.forEach((item) => {
        if (item.RoleID === 'R2106240002') {
          //采购主管
          this.RoleMapStatus = true;
          return;
        }
        if (item.RoleID === 'R2308010001') {
          //采购主管
          this.MaterialPeople = true;
          return;
        }
      });
    }
    this.judgeBtn();
  },
  mounted() {
    setTimeout(() => {
      this.setHeight();
    }, 500);
  },
  methods: {
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
    // 判断按钮权限
    judgeBtn() {
      let routeBtn = this.$route.meta.btns;
      let newBtn = [];
      let permission = false;
      let newBtn2 = [];
      if (routeBtn.length != 0) {
        routeBtn.forEach((x) => {
          if (x.ButtonCode == 'edit') {
            permission = true;
          }
          let newData = this.parmsBtn.filter((y) => {
            return x.ButtonCode == y.ButtonCode;
          });
          newData.forEach((item) => {
            if (item['BtnName'] === '结案' && this.RoleMapStatus) {
              item['signName'] = [0, 1, 2, 3];
            } else if (item['BtnName'] === '取消结案' && this.RoleMapStatus) {
              item['signName'] = [4];
            } else if (!this.RoleMapStatus) {
            }
          });
          if (newData.length != 0) {
            newBtn = newBtn.concat(newData);
          }
          let newData2 = this.parmsBtn2.filter((y) => {
            return x.ButtonCode == y.ButtonCode;
          });
          if (newData2.length != 0) {
            newBtn2 = newBtn2.concat(newData2);
          }
        });
      }
      this.$set(this, 'btnForm', newBtn);
      this.$set(this, 'isEdit', permission);
      this.$set(this, 'parmsBtn2', newBtn2);
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
    // 获取服务器时间
    async getServerDate(remarkTb, index) {
      let res = await GetServerTime();
      const { result, data, msg } = res.data;
      if (result) {
        let submitData = [];
        const $table = this.$refs.ComVxeTable.$refs.vxeTable;
        // 获取修改记录
        const updateRecords = $table.getUpdateRecords();
        if (updateRecords.length == 0) {
          this.$message.error('当前数据没做修改，请先修改再保存！');
          return;
        }
        updateRecords.forEach((x) => {
          submitData.push(x);
        });
        _this.generalSaveData(submitData, 0);
      } else {
      }
    },
    // 整表保存
    allSave(remarkTb, index) {
      this.getServerDate(remarkTb, index);
    },
    // 单击行
    handleRowClick(row, remarkTb) {
      this.delData[remarkTb] = [];
      this.delData[remarkTb].push(row);
    },
    // 通用直接保存
    async generalSaveData(newData, remarkTb, index) {
      if (newData.length == 0) {
        this.$message.error('没有提交保存的数据！');
        return;
      }
      this.adminLoading = true;
      let res = await SaveData(newData);
      const { result, data, count, msg } = res.data;
      if (result) {
        this.dataSearch(remarkTb);
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
    // 获取表头数据
    async getTableHeader() {
      let IDs = this.sysID;
      let res = await GetHeader(IDs);
      const { datas, forms, result, msg } = res.data;
      if (result) {
        // 获取每个表头
        datas.some((m, i) => {
          if (!this.MaterialPeople) {
            m = m.filter((item) => {
              return (
                item['prop'] !== 'MaterialStatus' && item['prop'] !== 'Reason'
              );
            });
          }
          m.forEach((n) => {
            // 进行验证
            this.verifyData(n);
            if (n.children && n.children.length != 0) {
              n.children.forEach((x) => {
                this.verifyData(x);
              });
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
        this.formSearchs[0].datas['CloseStatus'] = '未结案'; //未结案
        this.formSearchs[0].datas['ReplyStatus'] = '未复期';
        this.getTableData(this.formSearchs[0].datas, 0);
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
      let { result, data, count, msg } = res.data;
      if (result) {
        if (data.length != 0) {
          data.forEach((x) => {
            // if (!x.ReplyDate) {
            //   this.$set(x, "tag_1", 1);
            // }
            // if (!x.ReplyDateM2&&!x.ReplyDateM2) {
            //   this.$set(x, "tag_2", 1);
            // }
            this.tableColumns[0].forEach((item) => {
              if (!this.RoleMapStatus) {
                if (
                  item['prop'] === 'ReplyDate' ||
                  item['prop'] === 'ReplyDateM2'
                ) {
                  // item['component']['SuplierReplyDate'] = 'disabled1'
                  item['component']['ReplyDate'] = 'disabled2';
                  item['component']['ReplyDateM2'] = 'disabled3';
                }
                // if(item['prop'] ==='SuplierReplyDate'&&x.SuplierReplyDate){
                //   this.$set(x, "disabled1", true)
                //   if(!x.ReplyDate){
                //     this.$set(x, "disabled3", true)
                //   }
                // }else if(item['prop'] ==='SuplierReplyDate'&&!x.SuplierReplyDate){
                //   // this.$set(x, "disabled2", true)//采购只需要复期和二次复期
                //   // this.$set(x, "disabled3", true)//采购只需要复期和二次复期
                // }else
                if (item['prop'] === 'ReplyDate' && x.ReplyDate) {
                  // this.$set(x, "disabled1", true)//目前还没对接SRM供方复期先放开手动维护
                  this.$set(x, 'disabled2', true);
                } else if (item['prop'] === 'ReplyDateM2' && x.ReplyDateM2) {
                  // this.$set(x, "disabled1", true)//目前还没对接SRM供方复期先放开手动维护
                  this.$set(x, 'disabled2', true);
                  // this.$set(x, "disabled3", true)//最后一次修正一直可编辑不做限制，以为存在很多次修正，每次都找采购主管改比较麻烦
                } else if (item['prop'] === 'ReplyDateM2' && !x.ReplyDateM2) {
                  if (!x.ReplyDate) {
                    this.$set(x, 'disabled3', true);
                  }
                }
              }
              //如果超期并维护了原因禁用
              // if(item['prop'] ==='SuplierReplyDate'&&x.SuplierReplyDate){
              //   item['component']['ReplyDateM2'] = 'disabled4'
              //   this.$set(x, "disabled4", true)
              // }
            });
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
    // 批量复期
    changeDate(remarkTb, index, parms) {
      let val = parms.val;
      if (this.selectionData[0].length == 0) {
        this.$message.error('请选择需要批量填写日期的数据！');
      } else {
        this.selectionData[0].forEach((a) => {
          // 没禁用的才赋值
          if (!a.disabled2) {
            //复期
            a.ReplyDate = this.ReplyDate;
          }
          if (!a.disabled3) {
            //二次复期
            a.ReplyDateM2 = this.ReplyDate;
          }
        });
        // if (val == 0) {
        //   this.selectionData[0].forEach((a) => {
        //     // 没禁用的才赋值
        //     if (!a.disabled2) {
        //       a.ReplyDate = this.ReplyDate;
        //     }
        //   });
        // } else {
        //   this.selectionData[0].forEach((a) => {
        //     // 没禁用的才赋值
        //     if(!a.disabled3){
        //       a.ReplyDateM2 = this.ReplyDate;
        //     }

        //   });
        // }
      }
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
      if (column.property == 'IsOverdue' && row['IsOverdue'] == '未超期') {
        return {
          background: '#00b0f0',
        };
      } else if (
        (column.property == 'IsOverdue' && row['IsOverdue'] == '超期') ||
        (column.property == 'Analysis' &&
          (row['Analysis'] == '采购不足' || row['Analysis'] == '未下单')) ||
        (column.property == 'IsUrgency' && row['IsUrgency'] == '是')
      ) {
        return {
          background: '#ff0000',
        };
      } else if (column.property == 'Analysis' && row['Analysis'] == '采购足') {
        return {
          background: '#00b050',
        };
      }
    },
    // 改变状态
    changeStatus(x, index) {
      this.labelStatus1 = index;
      this.formSearchs[0].datas['ReplyStatus'] = '';
      this.formSearchs[0].datas['CloseStatus'] = '';
      this.formSearchs[0].datas['RemainreceiveQty'] = '';
      this.formSearchs[0].datas['IsOverTime'] = '';
      this.formSearchs[0].datas['IsNotReturn'] = '';
      if (this.labelStatus1 === 0) {
        this.formSearchs[0].datas['CloseStatus'] = '未结案'; //未结案
      } else if (this.labelStatus1 === 1) {
        this.formSearchs[0].datas['CloseStatus'] = '未结案'; //未结案
        this.formSearchs[0].datas['ReplyStatus'] = x.value;
      } else if (this.labelStatus1 === 2) {
        this.formSearchs[0].datas['CloseStatus'] = '未结案'; //复期不满足
        this.formSearchs[0].datas['ReplyStatus'] = x.value;
        this.formSearchs[0].datas['IsOverTime'] = 1;
      } else if (this.labelStatus1 === 3) {
        //逾期未回
        this.formSearchs[0].datas['CloseStatus'] = '未结案';
        this.formSearchs[0].datas['ReplyStatus'] = x.value;
        this.formSearchs[0].datas['RemainreceiveQty'] = 0;
        this.formSearchs[0].datas['IsNotReturn'] = 1;
      } else if (this.labelStatus1 === 4) {
        this.formSearchs[0].datas['CloseStatus'] = x.value; //已结案
      }
      this.dataSearch(0);
    },
    // 弹窗查询
    toPage(row, prop) {
      console.log(row, prop);
      if (prop == 'ChangeDetials' && row['ChangeDetials'] > 0) {
        this.formSearchs[1].datas['ProofingID'] = row.ProofingID;
        this.dataSearch(1);
        this.orderDialog = true;
      } else if (prop == 'ChangeDetials' && row['ChangeDetials'] <= 0) {
        this.$message.warning('请查看大于0的交期变更记录');
      }
    },
    // 同步采购员
    async refreshPOTraker() {
      this.adminLoading = true;
      let res = await UpdateOrderBomPOTracker();
      const { result, msg } = res.data;
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
    },
    // 取消
    async cancelSave(remarkTb, index, parms) {
      if (this.selectionData[remarkTb].length == 0) {
        this.$message.error('请选择需要操作的数据！');
        return;
      } else {
        this.$confirm(`确定${parms.val == '已结案' ? '结案' : '取消结案'}吗？`)
          .then(async (_) => {
            _this.selectionData[remarkTb].map((item) => {
              // 取消/取消结案修改状态
              item['CloseStatus'] = parms.val;
            });
            let newData = _this.selectionData[remarkTb];
            _this.generalSaveData(newData, remarkTb);
          })
          .catch((_) => {});
      }
    },
  },
};
</script>
