<template>
  <div>
    <!--  spreadJSform表单控件  -->
    <div class="flex_column" :style="{ height: height }">
      <div class="spreadContainer" v-loading="tableLoading">
        <gc-spread-sheets
          class="sample-spreadsheets"
          :tabStripVisible="false"
          @workbookInitialized="initSpread"
        >
          <gc-worksheet
            :dataSource="tableData"
            :frozenColumnCount="FixCount"
            :isProtected="true"
          >
            <gc-column
              v-for="(column, index) in tableColumns"
              :key="index"
              :width="column.width"
              :dataField="column.prop"
              :headerText="column.label"
              :cellType="column.CellTypes"
            ></gc-column
          ></gc-worksheet>
        </gc-spread-sheets>
        <div ref="spreadsheet"></div>
      </div>
    </div>
    <div class="flex_row_spaceBtn pagination">
      <div v-show="sysID > 0">
        <span @click="toPageSetting" class="primaryColor cursor"
          >SysID:{{ sysID }}
        </span>
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
          :page-sizes="[200, 500, 1000, 2000, 3000, 5000, 10000]"
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
import "@grapecity/spread-sheets-vue";
import GC from "@grapecity/spread-sheets";
const GCsheets = GC.Spread.Sheets;
GC.Spread.Common.CultureManager.culture("zh-cn");
import "@grapecity/spread-sheets/styles/gc.spread.sheets.excel2013white.css";
import { HeaderCheckBoxCellType } from "../../static/data.js";

export default {
  components: {},
  props: {
    // 系统id
    sysID: {
      type: Number,
      default: 0
    },
    // 表格的下标
    remark: {
      type: Number,
      required: false
    },
    tableData: {
      type: Array,
      default: function() {
        return [];
      }
    },
    tableColumns: {
      type: Array,
      default: function() {
        return [];
      }
    },
    tableLoading: {
      type: Boolean,
      default: false
    },
    //单击是否可编辑
    isEdit: {
      type: Boolean,
      default: false
    },
    pagination: {
      type: Object,
      default() {
        return {
          pageIndex: 0,
          pageSize: 500,
          pageTotal: 0
        };
      }
    },
    height: {
      type: String,
      required: false,
      default: "600px"
    }
  },
  data() {
    return {
      FixCount: 0,
      tagRemark: 0
    };
  },
  computed: {
    multipleSelection() {
      let CheckNum = this.tableData.filter(item => item.isChecked === true);
      return CheckNum;
    }
  },
  watch: {
    tableColumns: {
      handler(newValue, oldValue) {
        console.log(newValue, "tableColumns");
      },
      deep: true
    },
    tableData: {
      handler(newValue, oldValue) {
        console.log(newValue, "tableData");
      },
      deep: true
    }
  },
  mounted() {},
  created() {},
  methods: {
    // 跳转至页面配置
    toPageSetting() {
      if (this.sysID == 35) {
        this.$emit("oneselftSysID", 35);
      } else {
        this.$router.push({
          name: "FieldInfo",
          params: { ID: this.sysID }
        });
      }
      // 解决其他页面弹框状态下跳转到配置表弹框不关闭的bug
      // this.$emit("toPageSetting");
    },
    // 初始化SpreadJS
    initSpread: function(spread) {
      // let workbook = spread;
      this.$emit("workbookInitialized", spread);
    },
    // 选择一页显示多少数据
    pageSize(val) {
      this.$emit("pageSize", val, this.remark);
    },
    // 分页导航
    pageChange(val) {
      this.$emit("pageChange", val, this.remark);
    }
  }
};
</script>
<style lang="scss" scoped></style>
