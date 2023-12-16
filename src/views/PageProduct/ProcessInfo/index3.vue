<template>
  <div class="APSContainer" v-loading="adminLoading">
    <div>
      <div class="admin_content">
        <div class="ant-table-title">
          <el-row>
            <el-col :span="4"
              ><span class="title">{{ title2 }}</span></el-col
            >
            <el-col :span="20" class="flex_flex_end">
              <span v-show="labelStatus2 == 1">
                <el-button type="primary" size="mini" @click="openProcess"
                  >新增工序</el-button
                >
                <el-divider direction="vertical"></el-divider>
                <el-button type="warning" size="mini">保存工艺工序</el-button>
              </span>
              <span v-show="labelStatus2 == 2">
                <el-radio
                  v-model="loseCategory"
                  :label="0"
                  @click.native.prevent="clickitem(1)"
                  >缺失工艺</el-radio
                >
                <el-divider direction="vertical"></el-divider>
                <el-button type="primary" size="mini">建立关联</el-button>
              </span>
              <span v-show="labelStatus2 == 3">
                <el-button type="primary" size="mini">保存</el-button>
              </span>
              <el-divider direction="vertical"></el-divider>
              <div v-for="(item, y) in Status2" :key="y">
                <span
                  @click="changeStatus2(item, y)"
                  :class="
                    labelStatus2 == y + 1 ? 'statusActive cursor' : 'cursor'
                  "
                  >{{ item.label }}</span
                >
                <el-divider direction="vertical"></el-divider>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>

    <div class="down_admin">
      <div class="admin_head" v-show="labelStatus2 == 1">
        <ComSearch
          ref="searchRef1"
          :searchData="formSearchs[1].datas"
          :searchForm="formSearchs[1].forms"
          :remark="1"
          :isLoading="isLoading[1]"
          :btnForm="btnForm[1]"
          @btnClick="btnClick"
        />
        <ComUmyTable
          :rowKey="'RowNumber'"
          :height="'280px'"
          :tableData="tableData[1]"
          :tableHeader="tableColumns[1]"
          :tableLoading="tableLoading[1]"
          :remark="1"
          :sysID="1186"
          :isClear="isClear[1]"
          :pagination="tablePagination[1]"
          @pageChange="pageChange"
          @pageSize="pageSize"
          @sortChange="sortChange"
        />
      </div>
      <div v-show="labelStatus2 == 2" class="admin_head">
        <ComUmyTable
          v-show="labelStatus2 == 2"
          :rowKey="'RowNumber'"
          :height="'280px'"
          :tableData="tableData[2]"
          :tableHeader="tableColumns[2]"
          :tableLoading="tableLoading[2]"
          :remark="2"
          :sysID="1180"
          :hasSelect="true"
          :isClear="isClear[2]"
          :pagination="tablePagination[2]"
          @selectfun="selectFun"
          @pageChange="pageChange"
          @pageSize="pageSize"
          @sortChange="sortChange"
        />
      </div>
      <div v-show="labelStatus2 == 3" class="admin_head">
        <ComUmyTable
          v-show="labelStatus2 == 3"
          :rowKey="'RowNumber'"
          :height="'280px'"
          :tableData="tableData[3]"
          :tableHeader="tableColumns[3]"
          :tableLoading="tableLoading[3]"
          :remark="3"
          :sysID="15"
          :isClear="isClear[3]"
          :pagination="tablePagination[3]"
          @pageChange="pageChange"
          @pageSize="pageSize"
          @sortChange="sortChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import ComSearch from '@/components/ComSearch';
import ComSearch1 from '@/components/ComSearch';
import ComSearch2 from '@/components/ComSearch';
import ComSearch3 from '@/components/ComSearch';
import ComUmyTable from '@/components/ComUmyTable';
import { GetHeader, GetSearchData, ExportData, SaveData } from '@/api/Common';
export default {
  name: 'ProcessInfo',
  components: {
    ComSearch,
    ComSearch1,
    ComSearch2,
    ComSearch3,
    ComUmyTable,
  },
  data() {
    return {
      ////////////////// Search /////////////////
      activeName: 'first',
      loseCategory: 1,
      categoryDialog: false,
      processDialog: false,
      adminLoading: false,
      title: this.$route.meta.title,
      title2: '工序列表',
      drawer: false,
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
      btnForm: [[], [], [], []],
      parmsBtn: [
        [],
        [
          {
            ButtonCode: 'save',
            BtnName: '建立关联',
            Type: 'success',
            Ghost: true,
            Size: 'small',
            Methods: 'specialSave',
            Icon: '',
            Params: {},
          },
        ],
        [
          {
            ButtonCode: 'save',
            BtnName: '保存',
            Type: 'success',
            Ghost: true,
            Size: 'small',
            Methods: 'dataSave',
            Icon: '',
            Params: {},
          },
        ],
        [
          {
            ButtonCode: 'save',
            BtnName: '保存',
            Type: 'success',
            Ghost: true,
            Size: 'small',
            Methods: 'dataSave',
            Icon: '',
            Params: {},
          },
        ],
      ],
      selectionData: [[], [], [], [], []],
      scrollTop: 0,
      tableData: [[], [], [], [], []],
      tableColumns: [[], [], [], [], []],
      tableLoading: [false, false, false, false],
      isClear: [false, false, false, false],
      tablePagination: [
        { pageIndex: 1, pageSize: 50, pageTotal: 0 },
        { pageIndex: 1, pageSize: 50, pageTotal: 0 },
        { pageIndex: 1, pageSize: 50, pageTotal: 0 },
        { pageIndex: 1, pageSize: 50, pageTotal: 0 },
        { pageIndex: 1, pageSize: 50, pageTotal: 0 },
      ],
      height: '400px',
      showPagination: true,
      tagRemark: 0,
      isLoading: [false, false, false, false, false],
      isEdit: false,
      Status1: [
        { label: '全部', value: '' },
        { label: '未配工序', value: '' },
      ],
      Status2: [
        { label: '配置工序', value: 1, title: '工序列表' },
        { label: '关联产品', value: 2, title: '产品列表' },
        { label: '工序产能', value: 3, title: '工序产能列表' },
      ],
      labelStatus1: 0,
      labelStatus2: 1,
      currentRow: '',
    };
  },
  watch: {},
  created() {
    this.adminLoading = true;
    this.judgeBtn();
    this.getTableHeader();
  },
  mounted() {
    setTimeout(() => {
      //   this.setHeight();
    }, 600);
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

      let rem = (document.documentElement.clientHeight - headHeight - 100) / 2;
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
    // 滚动
    scroll({ scrollTop, scrollLeft }) {
      this.scrollTop = scrollTop;
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
    // 选择数据
    selectFun(data, remarkTb, row) {
      this.$set(this.selectionData, remarkTb, data);
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
    // 特殊接口保存
    async specialSave(remarkTb, index) {
      let res = null;

      res = await SaveSalesPlan(this.tableData[remarkTb]);
      const { result, data, count, msg } = res.data;
      this.dataSearch(0);
      if (result) {
        this.$message({
          message: msg,
          type: 'success',
          dangerouslyUseHTMLString: true,
        });
      } else {
        this.$message({
          message: msg,
          type: 'error',
          dangerouslyUseHTMLString: true,
        });
      }
    },
    // 保存
    async dataSave(remarkTb, index, parms) {
      let newData = [];
      if (parms && parms.dataName) {
        if (this.selectionData[remarkTb].length == 0) {
          this.$message.error('请选择需要操作的数据！');
          return;
        } else {
          newData = this.selectionData[remarkTb];
        }
      } else {
        newData = this.tableData[remarkTb];
      }
      this.btnForm[index].isLoading = true;
      let res = await SaveData(newData);
      const { datas, forms, result, msg } = res.data;
      if (result) {
        this.btnForm[index].isLoading = false;
        this.$message({
          message: msg,
          type: 'success',
          dangerouslyUseHTMLString: true,
        });
        this.dataSearch(remarkTb);
      } else {
        this.btnForm[index].isLoading = false;
        this.$message({
          message: msg,
          type: 'error',
          dangerouslyUseHTMLString: true,
        });
      }
    },
    // 获取表头数据
    async getTableHeader() {
      let IDs = [
        { ID: 1177 },
        { ID: 1186 },
        { ID: 1180 },
        { ID: 15 },
        { ID: 14 },
      ];
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
          });
          this.$set(this.tableColumns, i, m);
        });
        // 获取查询的初始化字段 组件 按钮
        forms.some((x, z) => {
          this.$set(this.formSearchs[z].datas, 'dicID', IDs[z].ID);
          // 判断查询的长度
          x.forEach((y) => {
            if (y.prop && y.value) {
              this.$set(this.formSearchs[z].datas, [y.prop], y.value);
            } else {
              this.$set(this.formSearchs[z].datas, [y.prop], '');
            }
          });
          this.$set(this.formSearchs[z], 'forms', x);
          console.log(this.formSearchs[0].forms);
        });
        this.adminLoading = false;
        this.getTableData(this.formSearchs[0].datas, 0);
        this.getTableData(this.formSearchs[4].datas, 4);
      } else {
        this.$message({
          message: msg,
          type: 'error',
          dangerouslyUseHTMLString: true,
        });
      }
      // this.getAutoHeader(IDs);
    },
    // 获取动态日期表头
    async getAutoHeader(IDs) {
      let resTwo = await GetHeaderTwo(IDs);
      const { datas, dresult, msg } = resTwo.data;
      if (dresult) {
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
          });
          this.$set(this.tableColumns, i, m);
        });
      } else {
        this.$message({
          message: msg,
          type: 'error',
          dangerouslyUseHTMLString: true,
        });
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
    // 改变状态
    changeStatus(item, index) {
      this.labelStatus1 = index;
      if (index == 0) {
        this.formSearchs[0].datas['ProcessCount'] = '';
      } else {
        this.formSearchs[0].datas['ProcessCount'] = 0;
      }
      this.dataSearch(0);
    },
    // 改变状态
    changeStatus2(item, index) {
      this.labelStatus2 = item.value;
      this.title2 = item.title;
      if (this.tableData[item.value].length == 0) {
        this.dataSearch(item.value);
      }
    },
    // 单击获取工艺
    handleRowClick(row, remarkTb) {
      this.currentRow = row;
      this.formSearchs[1].datas['ProcessGroupID'] = row.ProcessGroupID;
      this.dataSearch(1);
    },
    // 新增工艺
    openCategory() {
      this.categoryDialog = true;
    },
    openProcess() {
      this.processDialog = true;
    },
    // 切换缺失工艺
    clickitem(val) {
      val == this.loseCategory
        ? (this.loseCategory = 0)
        : (this.loseCategory = 1);
      if (this.loseCategory == 0) {
        this.formSearchs[2].datas['ProcessCount'] = 0;
      } else {
        this.formSearchs[2].datas['ProcessCount'] = '';
      }
      this.dataSearch(2);
    },
  },
};
</script>
