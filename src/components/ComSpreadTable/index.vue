<template>
  <div>
    <!--  spreadJSform表单控件  -->

    <div class="flex_column" :style="{ height: height }">
      <div class="spreadContainer" v-loading="tableLoading">
        <gc-spread-sheets
          class="sample-spreadsheets"
          @workbookInitialized="initSpread"
        >
        </gc-spread-sheets>
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
      default: "600px"
    }
  },
  data() {
    return {
      FixCount: 0,
      tagRemark: 0,
      spread: null,
      shouldRender: null
    };
  },
  computed: {
    multipleSelection() {
      let CheckNum = this.tableData.filter(item => item.isChecked === true);
      return CheckNum;
    },
    dataToRender() {
      return this.tableData;
    },
    columnToRender() {
      return this.tableColumns;
    }
  },
  watch: {
    multipleSelection(newValue) {
      this.$emit("selectChanged", newValue, this.remark);
    },
    tableData() {
      if (this.shouldRender && this.spread) {
        this.renderHeaders();
        this.shouldRender = false;
      }
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
      this.spread = spread;
      this.$emit("workbookInitialized", spread);
    },
    // 选择一页显示多少数据
    pageSize(val) {
      this.$emit("pageSize", val, this.remark);
    },
    // 分页导航
    pageChange(val) {
      this.$emit("pageChange", val, this.remark);
    },
    bindComboBoxToCell(sheet, row, col, dataSourceName) {
      // 获取要绑定下拉菜单的单元格对象
      let cell = sheet.getCell(row, col);

      // 创建下拉菜单单元格类型，并设置其选项数据
      let comboBox = new GC.Spread.Sheets.CellTypes.ComboBox();
      comboBox.editorValueType(
        GC.Spread.Sheets.CellTypes.EditorValueType.value
      );
      comboBox.editable(true);
      // 获取下拉菜单的选项数据

      comboBox.items(dataSourceName);
      comboBox.itemHeight(24);

      // 将下拉菜单单元格类型绑定到指定的单元格中
      cell.cellType(comboBox);
    },
    //渲染表头
    renderHeaders() {
      if (this.tableColumns.length == 0 && this.tableData.length == 0) return;
      this.spread.suspendPaint();
      // 获取活动表单
      let sheet = this.spread.getActiveSheet();
      // 重置表单
      sheet.reset();
      // 渲染列
      this.tableColumns.forEach((x, y) => {
        x["name"] = x["prop"];
        x["displayName"] = x["label"];
        x["width"] = parseInt(x.width);
        if (x.prop === "isChecked") {
          // 选框
          sheet.setCellType(
            0,
            0,
            new HeaderCheckBoxCellType(),
            GCsheets.SheetArea.colHeader
          );
          x.cellType = new GC.Spread.Sheets.CellTypes.CheckBox();
        } else if (
          x.ControlType === "comboboxMultiple" ||
          x.ControlType === "combobox"
        ) {
          // colInfos.push({
          //   name: x.prop,
          //   displayName: x.label,
          //   cellType: "",
          //   size: parseInt(x.width)
          // });
          let newData = [];
          // let list = null;
          this.tableData.map((item, index) => {
            if (x.DataSourceID && x.DataSourceName) {
              newData = item[x.DataSourceName]; // 设置列表每行下拉菜单
              this.bindComboBoxToCell(sheet, index, y, newData);
            }
          });
        } else if (
          x.DataType == "datetime" ||
          x.DataType === "varchar" ||
          x.DataType === "nvarchar"
        ) {
          x.formatter = "@";
          // colInfos.push({
          //   name: x.prop,
          //   displayName: x.label,
          //   size: parseInt(x.width),
          //   formatter: "@" //字符串格式
          // });
        }

        //行，start,end
        if (x.isEdit) {
          sheet
            .getCell(-1, y)
            .locked(false)
            .foreColor("#2a06ecd9");
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
      // 列筛选
      // 参数2 开始列
      // 参数3
      // 参数4 结束列
      let cellrange = new GC.Spread.Sheets.Range(
        -1,
        -1,
        -1,
        this.tableColumns.length
      );
      let hideRowFilter = new GC.Spread.Sheets.Filter.HideRowFilter(cellrange);
      sheet.rowFilter(hideRowFilter);

      // 设置整个列头的背景色和前景色。
      /**
       * 参数1:表示行
       * 参数2:列，-1表示
       * 参数3:
       * 参数4:
       * 参数5:
       */
      let colHeaderStyle = sheet.getRange(
        0,
        -1,
        1,
        -1,
        GC.Spread.Sheets.SheetArea.colHeader
      );
      colHeaderStyle.foreColor("000000d9");
      colHeaderStyle.backColor("#f3f3f3");
      colHeaderStyle.font(
        "12px basefontRegular, Roboto, Helvetica, Arial, sans-serif"
      );
      colHeaderStyle.hAlign(GC.Spread.Sheets.HorizontalAlign.left);
      colHeaderStyle.vAlign(GC.Spread.Sheets.HorizontalAlign.left);

      //设置数据渲染的单元格默认的样式
      var defaultStyle = new GC.Spread.Sheets.Style();
      defaultStyle.font =
        "12px basefontRegular, Roboto, Helvetica, Arial, sans-serif";
      defaultStyle.hAlign = GC.Spread.Sheets.HorizontalAlign.left;
      defaultStyle.vAlign = GC.Spread.Sheets.HorizontalAlign.left;
      sheet.setDefaultStyle(defaultStyle, GC.Spread.Sheets.SheetArea.viewport);
      defaultStyle.showEllipsis = true;
      // 冻结
      sheet.frozenColumnCount(this.tableColumns[1].FixCount);
      //渲染数据源
      sheet.setDataSource(this.tableData);
      //渲染列
      sheet.bindColumns(this.tableColumns); //此方法一定要放在setDataSource后面才能正确渲染列名
      this.spread.options.tabStripVisible = false; //是否显示表单标签
      this.spread.options.scrollbarMaxAlign = true;
      this.spread.options.scrollByPixel = true;

      this.spread.resumePaint();
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
    }
  }
};
</script>
<style lang="scss" scoped></style>
