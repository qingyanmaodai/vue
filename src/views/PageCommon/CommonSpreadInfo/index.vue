<!--历史导入/已关闭工单/委外业务关联-->
<template>
  <div class="container flex_column content_height" v-loading="adminLoading">
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
    <div class="ant-table-title pd-0-6">
      <el-row>
        <el-col :span="4"
          ><span class="title">{{ title }}</span></el-col
        >
        <el-col :span="20" class="flex_flex_end">
          <!-- 新增行所需组件 -->
          <div v-if="addNum">
            <span>新增行数：</span>
            <el-input-number
              v-model.trim="addNum"
              :min="1"
              :max="100"
              :step="addStep"
              placeholder="请输入"
            ></el-input-number>
          </div>
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

    <div class="admin_content flex_grow" id="tableContainer">
      <ComSpreadTable
        ref="spreadsheetRef"
        :height="'100%'"
        :tableData="tableData[0]"
        :tableColumns="tableColumns[0]"
        :tableLoading="tableLoading[0]"
        :remark="0"
        :sysID="ID"
        :pagination="tablePagination[0]"
        @pageChange="pageChange"
        @pageSize="pageSize"
        @sortChange="sortChange"
        @workbookInitialized="workbookInitialized"
        @selectChanged="selectChanged"
      />
    </div>
  </div>
</template>
<script>
var _this;
const GCsheets = GC.Spread.Sheets;
import "@grapecity/spread-sheets-vue";
import GC from "@grapecity/spread-sheets";
import "@grapecity/spread-sheets/styles/gc.spread.sheets.excel2013white.css";
import "@grapecity/spread-sheets/js/zh.js";
GC.Spread.Common.CultureManager.culture("zh-cn");
let rand = Math.random();
import ComSearch from "@/components/ComSearch";
import ComSpreadTable from "@/components/ComSpreadTable";
import ComFormDialog from "@/components/ComFormDialog";
import { HeaderCheckBoxCellType } from "@/static/data.js";
import {
  GetHeader,
  GetSearchData,
  ExportData,
  SaveData,
  GetSearch,
} from "@/api/Common";
export default {
  name: "CommonSpreadInfo",
  components: {
    ComSearch,
    ComSpreadTable,
    ComFormDialog,
  },
  data() {
    return {
      ////////////////// Search /////////////////
      spread: [],
      adminLoading: false,
      title: this.$route.meta.title,
      delData: [[]],
      formSearchs: [
        {
          datas: {},
          forms: [],
          required: [], //获取必填项
        },
      ],
      headHeight: 0,
      btnForm: [],
      tableData: [[]],
      tableColumns: [[]],
      tableLoading: [false],
      isClear: [false],
      tablePagination: [{ pageIndex: 1, pageSize: 200, pageTotal: 0 }],
      tagRemark: 0,
      isLoading: false,
      ID: 0,
      newTag: -1,
      selectionData: [[]],
      isEdit: false,
      DataSourceList: [{}],
      hasSelect: [false],
      addNum: 1,
      addStep: null,
      scrollEnable: true,
      dataColumns: false,
    };
  },

  // watch: {
  //   $route: {
  //     handler: function (val, oldVal) {
  //       this.ID = parseInt(val.query.dicID);
  //     },
  //     // 深度观察监听
  //     deep: true,
  //   },
  // },
  computed: {
    height() {
      let rem =
        document.documentElement.clientHeight -
        this.headHeight -
        this.$store.getters.reduceHeight;
      let newHeight = rem + "px";
      return newHeight;
    },
  },

  created() {
    _this = this;
    let routeBtn = this.$route;
    const params = new URLSearchParams(this.$route.meta.TargetFor);
    this.addNum = params.get("addNum");
    this.addStep = Number(params.get("addStep"));
    // 获取所有按钮
    this.btnForm = this.$route.meta.btns;
    this.judgeBtn(this.btnForm);
    this.ID = parseInt(routeBtn.meta.dicID);
    const variableMappings = {
      addNum: (value) => Number(value),
      addStep: (value) => Number(value),
      scrollEnable: (value) => JSON.parse(value),
      dataColumns: (value) => JSON.parse(value),
    };
    Object.keys(variableMappings).forEach((key) => {
      const value = params.get(key);
      if (value !== null) {
        this[key] =
          typeof variableMappings[key] === "function"
            ? variableMappings[key](value)
            : value;
      }
    });
    this.getTableHeader();
  },
  mounted() {
    let tableContainer = document.getElementById("tableContainer"); // 通过 `<div>` 的 ID 获取元素
    // 创建一个 ResizeObserver 实例
    const resizeObserver = new ResizeObserver((entries) => {
      // 当元素的大小发生变化时，会触发此回调函数
      for (const entry of entries) {
        if (entry.target === tableContainer) {
          // 在这里执行你的操作，例如刷新 SpreadJS
          // 你可能需要访问 SpreadJS 实例来调用 refresh() 方法
          this.spread[this.labelStatus1].refresh();
        }
      }
    }); // 启动 ResizeObserver 监测 `<div>` 元素的大小变化
    resizeObserver.observe(tableContainer);
    setTimeout(() => {
      this.setHeight();
    });
  },
  methods: {
    judgeBtn(routeBtn) {
      if (routeBtn && routeBtn.length > 0)
        routeBtn.some((item, index) => {
          if (item.ButtonCode == "save") {
            this.$set(this, "isEdit", true);
          }
        });
      this.$set(this, "btnForm", routeBtn);
    },
    //获取子组件实例
    workbookInitialized: function (workbook, remarkTb) {
      this.spread[remarkTb] = workbook;
    },
    //获取当前选中行的值
    selectChanged(newValue, remarkTb) {
      // 在子组件计算属性发生变化时，更新父组件的计算属性
      this.selectionData[remarkTb] = newValue;
    },
    // 高度控制
    setHeight() {
      this.headHeight = this.$refs.headRef.offsetHeight;
      // let rem =
      //   document.documentElement.clientHeight -
      //   headHeight -
      //   this.$store.getters.reduceHeight;
      // let newHeight = rem + "px";
      // this.$set(this, "height", newHeight);
    },
    // 第几页
    pageChange(val, remarkTb, filtertb) {
      this.$set(this.tablePagination[remarkTb], "pageIndex", val);
      this.getTableData(this.formSearchs[remarkTb].datas, remarkTb);
    },
    // 页数
    pageSize(val, remarkTb, filtertb) {
      this.$set(this.tablePagination[remarkTb], "pageSize", val);
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
        if (order === "desc") {
          this.formSearchs[remarkTb].datas["sort"] = prop + " DESC";
        } else {
          this.formSearchs[remarkTb].datas["sort"] = prop + " ASC";
        }
      } else {
        this.formSearchs[remarkTb].datas["sort"] = null;
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
      this.tablePagination[remarkTb].pageIndex = 1;
      this.getTableData(this.formSearchs[remarkTb].datas, remarkTb);
    },
    // 重置
    dataReset(remarkTb) {
      for (let name in this.formSearchs[remarkTb].datas) {
        if (name != "dicID") {
          this.formSearchs[remarkTb].datas[name] = null;
        }
      }
    },
    // 导出
    async dataExport(remarkTb) {
      this.adminLoading = true;
      let form = JSON.parse(JSON.stringify(this.formSearchs[remarkTb].datas));
      form["rows"] = 0;
      let res = await ExportData(form);
      this.adminLoading = false;
      this.$store.dispatch("user/exportData", res.data);
    },
    // 删除
    async dataDel(remarkTb, index, parms) {
      let res = null;
      let newData = [];
      if (this.selectionData[remarkTb].length == 0) {
        this.$message.error("请单击需要操作的数据！");
        return;
      } else {
        this.selectionData[remarkTb].forEach((x) => {
          let obj = x;
          obj["ElementDeleteFlag"] = 1;
          newData.push(obj);
        });
      }
      this.$confirm("确定要删除的【" + newData.length + "】数据吗？")
        .then((_) => {
          _this.dataSave(remarkTb, index, null, newData);
        })
        .catch((_) => {});
    },
    // 保存
    async dataSave(remarkTb, index, parms, newData) {
      console.log(remarkTb, index, parms, "parms");
      this.adminLoading = true;
      const sheet = this.spread[remarkTb]?.getActiveSheet();
      if (sheet.isEditing()) {
        sheet.endEdit();
      }
      // 获取修改记录
      let changeRecords = [];
      if (newData) {
        changeRecords = newData;
      } else {
        let DirtyRows = sheet.getDirtyRows().map((row) => row.item); //获取修改过的数据
        let InsertRows = sheet.getInsertRows().map((row) => row.item); //获取插入过的数据
        let DeletedRows = sheet.getDeletedRows().map((row) => row.item); //获取被删除的数据
        changeRecords = [...DirtyRows, ...InsertRows, ...DeletedRows];
        console.log(DirtyRows, InsertRows, DeletedRows, "changeRecords");
      }

      if (changeRecords.length == 0) {
        this.$set(this, "adminLoading", false);
        this.$message.error("当前数据没做修改，请先修改再保存！");
        return;
      }
      if (this.formSearchs[remarkTb].required.length) {
        // 动态检验必填项
        changeRecords.map((item1, index1) => {
          this.formSearchs[remarkTb].required.map((item2, index2) => {
            let content = item1[item2["prop"]];
            if (!content && (content !== 0) & (content !== false)) {
              this.$message.error(`${item2["label"]}不能为空，请选择`);
              this.$set(this, "adminLoading", false);
              throw new Error("报错了");
            }
          });
        });
      }
      let res = await SaveData(changeRecords);
      const { datas, forms, result, msg } = res.data;
      if (result) {
        this.$message({
          message: msg,
          type: "success",
          dangerouslyUseHTMLString: true,
        });
        this.dataSearch(remarkTb);
        this.$set(this, "adminLoading", false);
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
        this.$set(this, "adminLoading", false);
      }
    },
    // 获取表头数据
    async getTableHeader() {
      let IDs = [{ ID: this.ID }];
      let res = await GetHeader(IDs);
      const { datas, forms, result, msg } = res.data;
      if (result) {
        // 获取每个表头
        datas.some((m, i) => {
          m.some((n, index) => {
            // this.isSelect = n.IsSelect;
            if (n.prop == "Operation" || n.label == "操作") {
              this.newTag = index;
              return true;
            }
            //从列获取下拉数据源
            if (n.DataSourceID && n.ControlType === "combobox") {
              this.DataSourceList[i] = {
                [n.DataSourceName]: n.items,
                ...this.DataSourceList[i],
              };
            }
            if (n.Required) {
              this.formSearchs[this.tagRemark].required.push(n);
            }
            // 进行验证
            // this.verifyDta(n);
            // if (n.children && n.children.length != 0) {
            //   n.children.forEach((x) => {
            //     this.verifyDta(x);
            //   });
            // }
            if (index === 1) {
              this.tablePagination[i]["pageSize"] = n["pageSize"];
              this.hasSelect[i] = n["IsSelect"];
            }
          });
          this.$set(this.tableColumns, i, m);
        });
        // 获取查询的初始化字段 组件 按钮
        forms.some((x, z) => {
          this.$set(this.formSearchs[z].datas, "dicID", IDs[z].ID);
          x.forEach((y) => {
            if (y.prop && y.value) {
              this.$set(this.formSearchs[z].datas, [y.prop], y.value);
            } else {
              this.$set(this.formSearchs[z].datas, [y.prop], "");
            }
          });
          this.$set(this.formSearchs[z], "forms", x);
        });
        this.adminLoading = false;
        if (this.newTag != -1) {
          this.tableColumns.splice(this.newTag, 1);
        }
        this.formSearchs[0].datas["dicID"] = this.ID;
        this.getTableData(this.formSearchs[0].datas, 0);
      }
    },
    // 验证数据
    // verifyDta(n) {
    //   for (let name in n) {
    //     if (
    //       (name == "component" && n[name]) ||
    //       (name == "button" && n[name]) ||
    //       (name == "active" && n[name])
    //     ) {
    //       n[name] = eval("(" + n[name] + ")");
    //     }
    //   }
    // },
    // 获取表格数据
    async getTableData(form, remarkTb) {
      this.$set(this.tableLoading, remarkTb, true);
      form["rows"] = this.tablePagination[remarkTb].pageSize;
      form["page"] = this.tablePagination[remarkTb].pageIndex;
      let res = await GetSearchData(form);
      const { result, data, count, msg, Columns } = res.data;
      if (result) {
        if (this.dataColumns) {
          this.$set(this.tableColumns, remarkTb, Columns[0]);
        }
        this.$set(this.tableData, remarkTb, data);
        this.setData(remarkTb);
        this.$set(this.tablePagination[remarkTb], "pageTotal", count);
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
      this.$set(this.tableLoading, remarkTb, false);
    },
    // 刷新页面
    refrshPage() {
      this.$store.dispatch("tagsView/delCachedView", this.$route).then(() => {
        const { fullPath } = this.$route;
        this.$nextTick(() => {
          this.$router.replace({
            path: "/redirect" + fullPath,
          });
        });
      });
    },
    // 增行
    addRow(remarkTb) {
      // 获取修改记录s
      const sheet = this.spread[remarkTb].getActiveSheet();
      if (!this.addNum) {
        this.$message.error("请输入需要添加的行数!");
        return;
      }
      // 下拉数据是需要获取数据源
      for (let x = 0; x < this.addNum; x++) {
        let obj = {
          dicID: this.ID,
          RowNumber: _.uniqueId(),
        };
        this.tableColumns[remarkTb].map((item) => {
          obj[item.prop] = null;
          if (item.prop === "Status") {
            obj[item.prop] = 1;
          }
          console.log(this.DataSourceList, "this.DataSourceList");
          for (let key in this.DataSourceList[remarkTb]) {
            if (item.DataSourceName === key) {
              obj[key] = this.DataSourceList[remarkTb][key];
            }
          }
        });
        // this.tableData[remarkTb].unshift(obj);
        sheet.addRows(0, 1, GC.Spread.Sheets.SheetArea.viewport);
        this.$set(sheet.getDataSource(), "0", obj);
      }
      // 渲染列
      this.spread[remarkTb].suspendPaint();
      this.tableColumns[remarkTb].forEach((x, y) => {
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
          sheet.getDataSource().map((item, index) => {
            if (x.DataSourceID && x.DataSourceName) {
              let newData = x["items"]; // 设置列表每行下拉菜单
              // 获取要绑定下拉菜单的单元格对象
              let cell = sheet.getCell(index, y);
              // 创建下拉菜单单元格类型，并设置其选项数据
              let comboBox = new GC.Spread.Sheets.CellTypes.ComboBox();
              comboBox.editorValueType(
                GC.Spread.Sheets.CellTypes.EditorValueType.value
              );
              comboBox.editable(true);
              // 获取下拉菜单的选项数据
              comboBox.items(newData);
              comboBox.itemHeight(24);
              // 将下拉菜单单元格类型绑定到指定的单元格中
              cell.cellType(comboBox);
            }
          });
        } else if (x.ControlType === "checkbox") {
          let cellType = new GC.Spread.Sheets.CellTypes.CheckBox();
          cellType.caption("");
          cellType.textTrue("");
          cellType.textFalse("");
          cellType.textIndeterminate("");
          cellType.textAlign(
            GC.Spread.Sheets.CellTypes.CheckBoxTextAlign.center
          );
          cellType.isThreeState(false);
          sheet.getCell(-1, y).cellType(cellType);
        } else if (
          x.DataType == "datetime" ||
          x.DataType === "varchar" ||
          x.DataType === "nvarchar"
        ) {
          x.formatter = "@";
        }

        //行，start,end
        if (x.isEdit) {
          sheet.getCell(-1, y).locked(false).foreColor("#2a06ecd9");
        }
      });
      this.spread[remarkTb].resumePaint();
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
      sheet.setDataSource(this.tableData[remarkTb]);
      // 渲染列
      this.tableColumns[remarkTb].forEach((x, y) => {
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
          this.tableData[remarkTb].map((item, index) => {
            if (x.DataSourceID && x.DataSourceName) {
              let newData = item[x.DataSourceName]; // 设置列表每行下拉菜单
              // 获取要绑定下拉菜单的单元格对象
              let cell = sheet.getCell(index, y);
              // 创建下拉菜单单元格类型，并设置其选项数据
              let comboBox = new GC.Spread.Sheets.CellTypes.ComboBox();
              comboBox.editorValueType(
                GC.Spread.Sheets.CellTypes.EditorValueType.value
              );
              comboBox.editable(true);
              // 获取下拉菜单的选项数据
              comboBox.items(newData);
              comboBox.itemHeight(24);
              // 将下拉菜单单元格类型绑定到指定的单元格中
              cell.cellType(comboBox);
            }
          });
        } else if (x.ControlType === "checkbox") {
          let cellType = new GC.Spread.Sheets.CellTypes.CheckBox();
          cellType.caption("");
          cellType.textTrue("");
          cellType.textFalse("");
          cellType.textIndeterminate("");
          cellType.textAlign(
            GC.Spread.Sheets.CellTypes.CheckBoxTextAlign.center
          );
          cellType.isThreeState(false);
          sheet.getCell(-1, y).cellType(cellType);
        } else if (
          x.DataType == "datetime" ||
          x.DataType === "varchar" ||
          x.DataType === "nvarchar"
        ) {
          x.formatter = "@";
        }

        //行，start,end
        if (x.isEdit) {
          sheet.getCell(-1, y).locked(false).foreColor("#2a06ecd9");
        }
      });
      //渲染列
      sheet.bindColumns(this.tableColumns[remarkTb]); //此方法一定要放在setDataSource后面才能正确渲染列名
      sheet.setRowCount(1, GC.Spread.Sheets.SheetArea.colHeader);
      colHeader1.forEach(function (value, index) {
        sheet.setValue(0, index, value, GC.Spread.Sheets.SheetArea.colHeader);
      });

      var defaultStyle = new GC.Spread.Sheets.Style();
      defaultStyle.font =
        "12px basefontRegular, Roboto, Helvetica, Arial, sans-serif";
      defaultStyle.hAlign = GC.Spread.Sheets.HorizontalAlign.left;
      defaultStyle.vAlign = GC.Spread.Sheets.HorizontalAlign.center;
      defaultStyle.borderLeft = new GC.Spread.Sheets.LineBorder(
        "gray",
        GC.Spread.Sheets.LineStyle.thin
      );
      defaultStyle.borderTop = new GC.Spread.Sheets.LineBorder(
        "gray",
        GC.Spread.Sheets.LineStyle.thin
      );
      defaultStyle.borderRight = new GC.Spread.Sheets.LineBorder(
        "gray",
        GC.Spread.Sheets.LineStyle.thin
      );
      defaultStyle.borderBottom = new GC.Spread.Sheets.LineBorder(
        "gray",
        GC.Spread.Sheets.LineStyle.thin
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
        this.tableColumns[remarkTb].length
      );
      let hideRowFilter = new GC.Spread.Sheets.Filter.HideRowFilter(cellrange);
      sheet.rowFilter(hideRowFilter);

      // sheet.bindColumns(colInfos);
      this.spread[remarkTb].options.tabStripVisible = false; //是否显示表单标签

      //改变字体颜色
      this.tableData[remarkTb].forEach((row, rowIndex) => {
        this.tableColumns[remarkTb].forEach((column, columnIndex) => {
          // 获取当前单元格
          const cell = sheet.getCell(rowIndex, columnIndex);
        });
      });

      let cellIndex = 0;
      let viewSortIndex = 0; //排序的索引
      let lineIDIndex = 0;
      this.tableColumns[remarkTb].forEach((m) => {
        //行，start,end
        if (m.prop == "ViewSort") {
          viewSortIndex = cellIndex;
        }
        if (m.prop == "LineID") {
          lineIDIndex = cellIndex;
        }
        //行，start,end

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

      // var insertRowsCopyStyle = {
      //   canUndo: true,
      //   name: "insertRowsCopyStyle",
      //   execute: function (context, options, isUndo) {
      //     var Commands = GC.Spread.Sheets.Commands;
      //     if (isUndo) {
      //       Commands.undoTransaction(context, options);
      //       return true;
      //     } else {
      //       sheet.suspendPaint();
      //       sheet.addRows(options.activeRow, _this.sheetSelectRows.length);
      //       //  sheet.setArray(options.activeRow, 0,_this.sheetSelectRows);
      //       // console.log(_this.sheetSelectRows);

      //       // console.log(_this.sheetSelectObj.start+_this.sheetSelectRows.length)
      //       //删除旧行
      //       if (_this.sheetSelectObj.start > options.activeRow) {
      //         //说明从下面插入上面
      //         sheet.copyTo(
      //           _this.sheetSelectObj.start + _this.sheetSelectRows.length,
      //           0,
      //           options.activeRow,
      //           0,
      //           _this.sheetSelectRows.length,
      //           sheet.getColumnCount(),
      //           GC.Spread.Sheets.CopyToOptions.all
      //         );

      //         //   sheet.setArray(options.activeRow, 0, _this.sheetSelectRows);
      //         sheet.deleteRows(
      //           _this.sheetSelectObj.start + _this.sheetSelectRows.length,
      //           _this.sheetSelectObj.count
      //         );
      //         // sheet.removeRow(_this.sheetSelectObj.start+ _this.sheetSelectRows.length)
      //       } else {
      //         //从上面往下面插入
      //         sheet.copyTo(
      //           _this.sheetSelectObj.start,
      //           0,
      //           options.activeRow,
      //           0,
      //           _this.sheetSelectRows.length,
      //           sheet.getColumnCount(),
      //           GC.Spread.Sheets.CopyToOptions.all
      //         );
      //         //  sheet.setArray(options.activeRow, 0, _this.sheetSelectRows);
      //         sheet.deleteRows(
      //           _this.sheetSelectObj.start,
      //           _this.sheetSelectObj.count
      //         );
      //       }
      //       let count = sheet.getRowCount(GC.Spread.Sheets.SheetArea.viewport);

      //       let lineID = _this.sheetSelectRows[0][lineIDIndex];
      //       let isFind = false;
      //       let viewSort = 1;

      //       for (var i = 0; i < count; i++) {
      //         if (isFind == false && sheet.getValue(i, lineIDIndex) == lineID) {
      //           isFind = true;
      //         }
      //         if (isFind && sheet.getValue(i, lineIDIndex) != lineID) {
      //           break;
      //         }
      //         if (isFind) {
      //           sheet.setValue(i, viewSortIndex, viewSort);
      //           viewSort++;
      //         }
      //       }
      //       sheet.resumePaint();

      //       return true;
      //     }
      //   },
      // };

      // this.spread[remarkTb]
      //   .commandManager()
      //   .register("insertRowsCopyStyle", insertRowsCopyStyle);

      // function MyContextMenu() {}
      // MyContextMenu.prototype = new GC.Spread.Sheets.ContextMenu.ContextMenu(
      //   this.spread[remarkTb]
      // );
      // MyContextMenu.prototype.onOpenMenu = function (
      //   menuData,
      //   itemsDataForShown,
      //   hitInfo,
      //   spread
      // ) {
      //   itemsDataForShown.forEach(function (item, index) {
      //     // console.log(item);
      //     if (item && item.name === "gc.spread.rowHeaderinsertCutCells") {
      //       item.command = "insertRowsCopyStyle";
      //     }
      //     //  else if (item && item.name === "gc.spread.cut") {

      //     //     item.command = "insertRowsCut";
      //     //   }
      //   });
      // };
      // var contextMenu = new MyContextMenu();
      // this.spread[remarkTb].contextMenu = contextMenu;
      // // 剪贴板事件绑定
      // sheet.bind(
      //   GC.Spread.Sheets.Events.ClipboardChanged,
      //   function (sender, args) {
      //     let s = sheet.getSelections()[0];
      //     console.log(sheet.getDataItem(s.row));
      //     _this.sheetSelectRows = sheet.getArray(
      //       s.row,
      //       0,
      //       s.rowCount,
      //       _this.tableColumns[remarkTb].length
      //     );
      //     _this.sheetSelectObj.start = s.row;

      //     _this.sheetSelectObj.count = s.rowCount;
      //   }
      // );

      /////////////////表格事件/////////////
      // this.spread[remarkTb].bind(GCsheets.Events.ButtonClicked, (e, args) => {
      //   const { sheet, row, col } = args;
      //   const cellType = sheet.getCellType(row, col);
      //   if (cellType instanceof GCsheets.CellTypes.Button) {
      //   }
      //   if (cellType instanceof GCsheets.CellTypes.CheckBox) {
      //   }
      //   if (cellType instanceof GCsheets.CellTypes.HyperLink) {
      //   }
      // });
      // //表格编辑事件

      // this.spread[remarkTb].bind(
      //   GCsheets.Events.EditStarting,
      //   function (e, args) {}
      // );
      // this.spread[remarkTb].bind(GCsheets.Events.EditEnded, function (e, args) {
      //   // 自动计算数量
      // });
      // // 表格单击齐套率弹框事件
      // this.spread[remarkTb].bind(
      //   GCsheets.Events.CellClick,
      //   function (e, args) {}
      // );
      // //脏数据清除
      // sheet.bind(GC.Spread.Sheets.Events.RowChanged, function (e, info) {
      //   console.log(
      //     info.row +
      //       "," +
      //       info.col +
      //       "," +
      //       "由" +
      //       info.oldValue +
      //       "改变为" +
      //       info.newValue
      //   );
      //   var arr = sheet.getDirtyRows();
      //   var arr2 = sheet.getInsertRows();
      //   console.log(arr, arr2);
      //   // sheet.clearPendingChanges();
      // });
      this.spread[remarkTb].resumePaint();
      this.adminLoading = false;
      this.tableLoading[remarkTb] = false;
      setTimeout(() => {
        this.spread[remarkTb].refresh(); //重新定位宽高度
      });
    },
  },
};
</script>
