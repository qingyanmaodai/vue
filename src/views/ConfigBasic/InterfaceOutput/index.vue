<!--接口表-->
<template>
  <div class="APSContainer" v-loading="adminLoading">
    <div class="admin_head" ref="headRef">
      <ComSearch
        ref="searchRef"
        :searchData="formSearchs[0].datas"
        :searchForm="formSearchs[0].forms"
        :remark="0"
        :isLoading="isLoading"
        :btnForm="btnForm"
        @btnClick="btnClick"
      />
    </div>
    <div>
      <div class="admin_content">
        <div class="ant-table-title">
          <el-row>
            <el-col :span="4"
              ><span class="title">{{ title }}</span></el-col
            >
            <el-col :span="20" class="flex_flex_end">
              <el-button
                type="primary"
                size="mini"
                @click="addRow(0)"
                v-show="isAdd"
                >新增</el-button
              >
              <el-divider direction="vertical"></el-divider>
              <el-tooltip
                class="item"
                effect="dark"
                content="刷新"
                placement="bottom"
              >
                <span class="right_icon">
                  <span
                    @click="refrshPage"
                    role="img"
                    aria-label="redo"
                    class="anticon anticon-redo icon_size"
                    ><svg
                      class=""
                      data-icon="redo"
                      width="1em"
                      height="1em"
                      fill="currentColor"
                      aria-hidden="true"
                      viewBox="64 64 896 896"
                      focusable="false"
                    >
                      <path
                        d="M758.2 839.1C851.8 765.9 912 651.9 912 523.9 912 303 733.5 124.3 512.6 124 291.4 123.7 112 302.8 112 523.9c0 125.2 57.5 236.9 147.6 310.2 3.5 2.8 8.6 2.2 11.4-1.3l39.4-50.5c2.7-3.4 2.1-8.3-1.2-11.1-8.1-6.6-15.9-13.7-23.4-21.2a318.64 318.64 0 01-68.6-101.7C200.4 609 192 567.1 192 523.9s8.4-85.1 25.1-124.5c16.1-38.1 39.2-72.3 68.6-101.7 29.4-29.4 63.6-52.5 101.7-68.6C426.9 212.4 468.8 204 512 204s85.1 8.4 124.5 25.1c38.1 16.1 72.3 39.2 101.7 68.6 29.4 29.4 52.5 63.6 68.6 101.7 16.7 39.4 25.1 81.3 25.1 124.5s-8.4 85.1-25.1 124.5a318.64 318.64 0 01-68.6 101.7c-9.3 9.3-19.1 18-29.3 26L668.2 724a8 8 0 00-14.1 3l-39.6 162.2c-1.2 5 2.6 9.9 7.7 9.9l167 .8c6.7 0 10.5-7.7 6.3-12.9l-37.3-47.9z"
                      ></path></svg
                  ></span>
                </span>
              </el-tooltip>
              <el-divider direction="vertical"></el-divider>
              <el-tooltip effect="dark" content="列设置" placement="bottom">
                <span class="right_icon">
                  <span
                    role="img"
                    aria-label="setting"
                    class="anticon anticon-setting icon_size"
                    ><svg
                      class=""
                      data-icon="setting"
                      width="1em"
                      height="1em"
                      fill="currentColor"
                      aria-hidden="true"
                      viewBox="64 64 896 896"
                      focusable="false"
                    >
                      <path
                        d="M924.8 625.7l-65.5-56c3.1-19 4.7-38.4 4.7-57.8s-1.6-38.8-4.7-57.8l65.5-56a32.03 32.03 0 009.3-35.2l-.9-2.6a443.74 443.74 0 00-79.7-137.9l-1.8-2.1a32.12 32.12 0 00-35.1-9.5l-81.3 28.9c-30-24.6-63.5-44-99.7-57.6l-15.7-85a32.05 32.05 0 00-25.8-25.7l-2.7-.5c-52.1-9.4-106.9-9.4-159 0l-2.7.5a32.05 32.05 0 00-25.8 25.7l-15.8 85.4a351.86 351.86 0 00-99 57.4l-81.9-29.1a32 32 0 00-35.1 9.5l-1.8 2.1a446.02 446.02 0 00-79.7 137.9l-.9 2.6c-4.5 12.5-.8 26.5 9.3 35.2l66.3 56.6c-3.1 18.8-4.6 38-4.6 57.1 0 19.2 1.5 38.4 4.6 57.1L99 625.5a32.03 32.03 0 00-9.3 35.2l.9 2.6c18.1 50.4 44.9 96.9 79.7 137.9l1.8 2.1a32.12 32.12 0 0035.1 9.5l81.9-29.1c29.8 24.5 63.1 43.9 99 57.4l15.8 85.4a32.05 32.05 0 0025.8 25.7l2.7.5a449.4 449.4 0 00159 0l2.7-.5a32.05 32.05 0 0025.8-25.7l15.7-85a350 350 0 0099.7-57.6l81.3 28.9a32 32 0 0035.1-9.5l1.8-2.1c34.8-41.1 61.6-87.5 79.7-137.9l.9-2.6c4.5-12.3.8-26.3-9.3-35zM788.3 465.9c2.5 15.1 3.8 30.6 3.8 46.1s-1.3 31-3.8 46.1l-6.6 40.1 74.7 63.9a370.03 370.03 0 01-42.6 73.6L721 702.8l-31.4 25.8c-23.9 19.6-50.5 35-79.3 45.8l-38.1 14.3-17.9 97a377.5 377.5 0 01-85 0l-17.9-97.2-37.8-14.5c-28.5-10.8-55-26.2-78.7-45.7l-31.4-25.9-93.4 33.2c-17-22.9-31.2-47.6-42.6-73.6l75.5-64.5-6.5-40c-2.4-14.9-3.7-30.3-3.7-45.5 0-15.3 1.2-30.6 3.7-45.5l6.5-40-75.5-64.5c11.3-26.1 25.6-50.7 42.6-73.6l93.4 33.2 31.4-25.9c23.7-19.5 50.2-34.9 78.7-45.7l37.9-14.3 17.9-97.2c28.1-3.2 56.8-3.2 85 0l17.9 97 38.1 14.3c28.7 10.8 55.4 26.2 79.3 45.8l31.4 25.8 92.8-32.9c17 22.9 31.2 47.6 42.6 73.6L781.8 426l6.5 39.9zM512 326c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm79.2 255.2A111.6 111.6 0 01512 614c-29.9 0-58-11.7-79.2-32.8A111.6 111.6 0 01400 502c0-29.9 11.7-58 32.8-79.2C454 401.6 482.1 390 512 390c29.9 0 58 11.6 79.2 32.8A111.6 111.6 0 01624 502c0 29.9-11.7 58-32.8 79.2z"
                      ></path></svg
                  ></span>
                </span>
              </el-tooltip>
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
          :isEdit="isEdit"
          :isClear="isClear[0]"
          :pagination="tablePagination[0]"
          @pageChange="pageChange"
          @pageSize="pageSize"
          @sortChange="sortChange"
          @outputField="outputField"
          @selectfun="selectFun"
          @handleRowClick="handleRowClick"
          :keepSource="true"
          :hasSelect="true"
        />
      </div>

      <!-- 输出字段表 -->
      <el-dialog
        :visible.sync="colDialogVisible1"
        width="80%"
        @closeDialog="colDialogVisible1 = false"
        :close-on-click-modal="false"
      >
        <div>
          <div class="admin_head" ref="headRef">
            <ComSearch
              ref="searchRef"
              :searchData="formSearchs[1].datas"
              :searchForm="formSearchs[1].forms"
              :remark="1"
              :isLoading="isLoading"
              :btnForm="btnForm"
              @btnClick="btnClick"
            />
          </div>
          <div>
            <div class="admin_content">
              <div class="ant-table-title">
                <el-row>
                  <el-col :span="4"
                    ><span class="title">输出字段表</span></el-col
                  >
                  <el-col :span="20" class="flex_flex_end">
                    <el-button
                      type="primary"
                      size="mini"
                      @click="addRow(1)"
                      v-show="isAdd"
                      >新增</el-button
                    >
                    <el-divider direction="vertical"></el-divider>
                  </el-col>
                </el-row>
              </div>
              <ComVxeTable
                ref="ComVxeTable"
                :rowKey="'RowNumber'"
                height="650px"
                :tableData="tableData[1]"
                :tableHeader="tableColumns[1]"
                :tableLoading="tableLoading[1]"
                :remark="1"
                :sysID="sysID[1].ID"
                :isEdit="isEdit"
                :isClear="isClear[1]"
                :pagination="tablePagination[1]"
                @pageChange="pageChange"
                @pageSize="pageSize"
                @sortChange="sortChange"
                @toPageSetting="colDialogVisible1 = false"
                :hasSelect="true"
                @selectfun="selectFun"
                @outputField="outputField"
              />
            </div>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="colDialogVisible1 = false">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
var _this;
import ComSearch from '@/components/ComSearch';
import ComVxeTable from '@/components/ComVxeTable';
import { GetHeader, GetSearchData, ExportData, SaveData } from '@/api/Common';
import DialogTable from '@/components/Dialog/dialogTable';
export default {
  name: 'InterfaceOutput',
  components: {
    ComSearch,
    ComVxeTable,
    DialogTable,
  },
  data() {
    return {
      // 接口输出字段表
      colDialogVisible1: false,
      adminLoading: false,
      ////////////////// Search /////////////////
      title: this.$route.meta.title,
      drawer: false,
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
      ],
      btnForm: [],
      parmsBtn: [
        {
          ButtonCode: 'save',
          BtnName: '保存',
          isLoading: false,
          Methods: 'dataSave',
          Type: 'success',
          Icon: '',
          Size: 'small',
        },
        {
          ButtonCode: 'delete',
          BtnName: '删除',
          isLoading: false,
          Methods: 'dataDel',
          Type: 'danger',
          Icon: '',
          Size: 'small',
          Params: {},
        },
      ],
      tableData: [[], []],
      tableColumns: [[], []],
      tableLoading: [false, false],
      isClear: [false],
      tablePagination: [
        { pageIndex: 1, pageSize: 50, pageTotal: 0 },
        { pageIndex: 1, pageSize: 50, pageTotal: 0 },
      ],
      height: '707px',
      showPagination: true,
      tagRemark: 0,
      isLoading: false,
      isEdit: true,
      isUpdate: true,
      isAdd: false,
      sysID: [{ ID: 9032 }, { ID: 9033 }],
      selectionData: [[], [], [], []],
      delData: [[], []],
    };
  },
  watch: {},
  created() {
    _this = this;
    this.judgeBtn();
    this.getTableHeader();
  },
  mounted() {
    setTimeout(() => {
      this.setHeight();
    }, 350);
  },
  methods: {
    // 判断按钮权限
    judgeBtn() {
      let routeBtn = this.$route.meta.btns;
      let newBtn = [];
      let permission = false;
      if (routeBtn.length != 0) {
        routeBtn.forEach((x) => {
          if (x.ButtonCode == 'edit') {
            permission = true;
          }
          if (x.ButtonCode == 'add') {
            this.$set(this, 'isAdd', true);
          }
          let newData = this.parmsBtn.filter((y) => {
            return x.ButtonCode == y.ButtonCode;
          });
          if (newData.length != 0) {
            newBtn = newBtn.concat(newData);
          }
        });
      }
      this.$set(this, 'btnForm', newBtn);
      this.$set(this, 'isEdit', permission);
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
          this.formSearchs[remarkTb].datas[name] = null;
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
    // 获取表头数据
    async getTableHeader() {
      let IDs = this.sysID;
      let res = await GetHeader(IDs);
      const { datas, forms, result, msg } = res.data;
      if (result) {
        // 获取每个表头
        datas.some((m, i) => {
          m.forEach((n) => {
            // 进行验证
            this.verifyDta(n);
            if (n.children && n.children.length != 0) {
              n.children.forEach((x) => {
                this.verifyDta(x);
              });
            }
            if (n.Required && n.isEdit) {
              //必填项
              this.formSearchs[i].required.push(n);
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
        this.$set(this.formSearchs[0].datas, 'DictionaryID', this.DictionaryID);
        await this.getTableData(this.formSearchs[0].datas, 0);
      }
    },
    // 验证数据
    verifyDta(n) {
      console.log('n[name]', n);
      for (let name in n) {
        if (
          (name == 'component' && n[name]) ||
          (name == 'button' && n[name]) ||
          (name == 'active' && n[name])
        ) {
          console.log('n[name]', n[name]);
          n[name] = eval('(' + n[name] + ')');
        }
      }
    },
    // 获取表格数据
    async getTableData(form, remarkTb) {
      this.$set(this.tableLoading, remarkTb, true);
      form['rows'] = this.tablePagination[remarkTb].pageSize;
      form['page'] = this.tablePagination[remarkTb].pageIndex;
      let newForm = JSON.parse(JSON.stringify(form));
      if (!newForm.DictionaryID) {
        newForm.DictionaryID = this.DictionaryID;
        this.formSearchs[0].DictionaryID = this.DictionaryID;
      }
      let res = await GetSearchData(newForm);
      const { result, data, count, msg } = res.data;
      if (result) {
        this.$set(this.tableData, remarkTb, data);
        this.$set(this.tablePagination[remarkTb], 'pageTotal', count);
        this.$set(this.tableLoading, remarkTb, false);
      } else {
        this.$message({
          message: msg,
          type: 'error',
          dangerouslyUseHTMLString: true,
        });
        this.$set(this.tableLoading, remarkTb, false);
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
    selectFun(data, remarkTb, row) {
      this.$set(this.selectionData, remarkTb, data);
    },
    // 删除
    async dataDel(remarkTb, index, parms) {
      let res = null;
      let newData = [];
      if (parms && parms.dataName) {
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
      } else {
        this.tableData[remarkTb].forEach((y) => {
          let obj2 = y;
          obj2['ElementDeleteFlag'] = 1;
          newData.push(obj2);
        });
      }
      this.$confirm('确定要删除的【' + newData.length + '】数据吗？')
        .then((_) => {
          _this.dataSave(remarkTb, index, null, newData);
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
      let res = null;
      this.adminLoading = true;
      if (newData && newData.length != 0) {
        res = await SaveData(newData);
      } else {
        // 必填校验
        if (this.formSearchs[remarkTb].required.length) {
          // 动态检验必填项
          for (let i = 0; i < this.tableData[remarkTb].length; i++) {
            for (
              let x = 0;
              x < this.formSearchs[remarkTb].required.length;
              x++
            ) {
              if (
                this.tableData[remarkTb][i][
                  this.formSearchs[remarkTb].required[x]['prop']
                ] === undefined ||
                this.tableData[remarkTb][i][
                  this.formSearchs[remarkTb].required[x]['prop']
                ] === null ||
                this.tableData[remarkTb][i][
                  this.formSearchs[remarkTb].required[x]['prop']
                ] === ''
              ) {
                this.$message.error(
                  `【${this.formSearchs[remarkTb].required[x]['label']}】不能为空，请填写`,
                );
                this.adminLoading = false;
                return;
              }
            }
          }
        }

        res = await SaveData(this.tableData[remarkTb]);
      }
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
    // 新增
    addRow(remarkTb) {
      let obj = { ...this.formSearchs[remarkTb].datas };
      obj['dicID'] = this.sysID[remarkTb].ID;
      obj['update'] = true;
      // 先找表头有没有字段是下拉的性质 ,把数据源名称找出来
      let Props = [];
      this.tableColumns[remarkTb].forEach((a) => {
        if (a.ControlType == 'combobox') {
          if (a.DataSourceID) {
            Props.push(a.DataSourceID);
          }
        }
      });
      // 拿到数据源去查找数据
      if ((Props, length != 0)) {
        // this.getDataSource(Props)
      }

      this.tableColumns[remarkTb].forEach((x) => {
        obj[x.prop] = '';
      });
      this.tableData[remarkTb].unshift(obj);
    },
    outputField(row) {
      if (row.EID) {
        this.colDialogVisible1 = true;
        this.formSearchs[1].datas.EID = row.EID;
        this.dataSearch(1);
      } else {
        this.$message.error('请先保存数据，再操作！');
        return;
      }
    },
    // 保存更新的内容
    // async dataSaveUpdate(remarkTb, index){
    //   console.log('remarkTb',remarkTb)
    //   const $table = this.$refs.ComVxeTable.$refs.vxeTable
    //   // 获取修改记录
    //   const updateRecords = $table.getUpdateRecords()
    //   if(updateRecords.length==0){
    //     this.$message.error("当前数据没做修改，请先修改再保存！");
    //     return
    //   }
    //   this.adminLoading = true;
    //   let res = await SaveData(updateRecords);
    //   const { datas, forms, result, msg } = res.data;
    //   if (result) {
    //       this.$message({
    //       message: msg,
    //       type: "success",
    //       dangerouslyUseHTMLString: true,
    //       });
    //       this.dataSearch(remarkTb);
    //       this.adminLoading = false;
    //   } else {
    //       this.$message({
    //       message: msg,
    //       type: "error",
    //       dangerouslyUseHTMLString: true,
    //       });
    //       this.adminLoading = false;
    //   }
    // }
  },
};
</script>
