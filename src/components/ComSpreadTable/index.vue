<template>
  <!--  spreadJSform表单控件  -->

  <div class="flex_column" style="height: 100%">
    <div class="flex_grow flex0 flex-col" v-loading="tableLoading">
      <gc-spread-sheets
        class="sample-spreadsheets"
        ref="gcSpreadSheets"
        :hostStyle="{ height: height }"
      >
      </gc-spread-sheets>
    </div>
    <div class="statusBar"></div>
    <div class="flex_row_spaceBtn pagination flex_shrink" v-show="spaceBtnShow">
      <div v-show="sysID > 0" class="flex truncate">
        <span @click="toPageSetting" class="primaryColor cursor"
          >SysID:{{ sysID }}
        </span>
        <el-popover
          placement="top"
          trigger="manual"
          v-model="PromptVisible"
          v-show="Prompt"
        >
          <div style="color: red; font-weight: bold" v-html="Prompt"></div>
          <el-button
            class="margin_r5"
            size="mini"
            slot="reference"
            type="info"
            icon="el-icon-info"
            circle
            @click="PromptVisible = !PromptVisible"
          ></el-button>
        </el-popover>
      </div>
      <div class="flex">
        <div class="footer_label" v-show="multipleSelection.length != 0">
          已选[<span style="color: red; font-weight: bold">{{
            multipleSelection.length
          }}</span
          >]
        </div>
        <el-pagination
          background
          @size-change="pageSize"
          :current-page="pagination.pageIndex"
          :page-sizes="[20, 100, 200, 500, 1000, 2000, 3000, 5000, 10000]"
          :page-size="pagination.pageSize"
          :total="pagination.pageTotal"
          @current-change="pageChange"
          layout="total, sizes, prev, pager, next,jumper"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import '@grapecity/spread-sheets-vue';
import GC from '@grapecity/spread-sheets';
const GCsheets = GC.Spread.Sheets;
GC.Spread.Common.CultureManager.culture('zh-cn');
import '@grapecity/spread-sheets/styles/gc.spread.sheets.excel2013white.css';
import { GetSearchData } from '@/api/Common';
import { HeaderCheckBoxCellType } from '@/static/data.js';

export default {
  components: {},
  props: {
    // 系统id
    sysID: {
      type: Number,
      default: 0,
    },
    // 表格的下标
    remark: {
      type: Number,
      required: false,
    },
    tableData: {
      type: Array,
      default: function () {
        return [];
      },
    },
    tableColumns: {
      type: Array,
      default: function () {
        return [];
      },
    },
    tableLoading: {
      type: Boolean,
      default: false,
    },
    //单击是否可编辑
    isEdit: {
      type: Boolean,
      default: false,
    },
    spaceBtnShow: {
      type: Boolean,
      default: true,
    },
    pagination: {
      type: Object,
      default() {
        return {
          pageIndex: 0,
          pageSize: 500,
          pageTotal: 0,
        };
      },
    },
    height: {
      type: String,
      default: '600px',
    },
  },
  data() {
    return {
      spread: null,
      Prompt: null,
      PromptVisible: false,
    };
  },
  computed: {
    multipleSelection() {
      let CheckNum = this.tableData.filter(
        (item) => item['isChecked'] === true,
      );
      return CheckNum;
    },
  },
  watch: {
    multipleSelection: {
      handler(newValue) {
        this.$emit('selectfun', newValue, this.remark);
      },
      deep: true, // 启用深度监听
    },
  },
  mounted() {
    this.initSpread();
  },
  created() {
    this.getFooterRemark();
  },
  methods: {
    // 跳转至页面配置
    toPageSetting() {
      if (this.sysID == 35) {
        this.$emit('oneselftSysID', 35);
      } else {
        this.$router.push({
          name: 'FieldInfo',
          params: { ID: this.sysID },
        });
      }
      // 解决其他页面弹框状态下跳转到配置表弹框不关闭的bug
      // this.$emit("toPageSetting");
    },
    // 初始化SpreadJS
    initSpread: function () {
      this.spread = this.$refs.gcSpreadSheets.spread;
      this.$emit('workbookInitialized', this.spread, this.remark);
      this.initStatusBar();
    },
    initStatusBar() {
      let statusBarDOM = this.$el.querySelector('.statusBar');
      let statusBar = new GC.Spread.Sheets.StatusBar.StatusBar(statusBarDOM);
      statusBar.bind(this.spread);
    },
    // 选择一页显示多少数据
    pageSize(val) {
      this.$emit('pageSize', val, this.remark);
    },
    // 分页导航
    pageChange(val) {
      this.$emit('pageChange', val, this.remark);
    },
    async getFooterRemark() {
      let form = {};
      form['dicID'] = 33;
      form['page'] = 1;
      form['rows'] = 0;
      form['DictionaryID'] = this.sysID;
      let res = await GetSearchData(form);
      const { result, data, count, msg } = res.data;
      if (result) {
        if (data.length && data[0].Remark1) {
          this.Prompt = data[0].Remark1;
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.APSContainer {
  display: flex;
  flex-direction: column;
  // height: 100%;
}
.flex_grow {
  flex-grow: 1;
  overflow: hidden;
  border: 1px solid #ababab;
}
</style>
