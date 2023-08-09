<!-- 通用表格头部查询 -->
<template>
  <div class="ces-search">
    <el-form
      ref="searchData"
      :model="searchData"
      size="small"
      inline
      label-width=""
      label-position="left"
      @submit.native.prevent
      class="flex_between"
    >
      <div class="flex" style="flex-wrap: wrap;">
        <div v-for="(x, y) in searchForm" :key="y" class="FormDiv">
          <el-form-item :label="x.label" :name="x.prop">
            <el-input
              v-if="x.type === null"
              v-model="searchData[x.prop]"
              size="small"
              type="number"
              @keyup.enter.native="btnClick('dataSearch')"
            ></el-input>
            <!-- 输入框 -->
            <el-input
              v-if="x.type === 'Input'"
              v-model="searchData[x.prop]"
              size="small"
              type="text"
              @keyup.enter.native="btnClick('dataSearch')"
            ></el-input>
            <!-- 下拉框 -->
            <el-select
              v-if="x.type === 'Select'"
              v-model="searchData[x.prop]"
              filterable
              :multiple="x.multiple"
              size="small"
              clearable
              style="width: 100%"
            >
              <el-option
                v-for="op in x.options"
                :label="op.label"
                :value="op.value"
                :key="op.value"
              ></el-option>
            </el-select>
            <!-- 日期 -->
            <el-date-picker
              style="width: 100%"
              v-if="x.type === 'Daterange'"
              v-model="searchData[x.prop]"
              format="MM-dd"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
            <el-date-picker
              v-if="x.type === 'Date'"
              v-model="searchData[x.prop]"
            ></el-date-picker>
            <!-- 日期时间 -->
            <el-date-picker
              v-if="x.type === 'DateTime'"
              type="datetime"
              v-model="searchData[x.prop]"
              :disabled="x.disable && x.disable(searchData[x.prop])"
            ></el-date-picker>
            <el-date-picker
              v-if="x.type === 'month'"
              v-model="searchData[x.prop]"
              value-format="yyyy-MM"
              type="month"
            >
            </el-date-picker>
            <!-- 月份范围 -->
            <el-date-picker
              v-if="x.type === 'monthrange'"
              v-model="searchData[x.prop]"
              type="monthrange"
              range-separator="至"
              start-placeholder="开始月份"
              end-placeholder="结束月份"
            >
            </el-date-picker>
            <!-- 年份 -->
            <el-date-picker
              v-if="x.type === 'year'"
              v-model="searchData[x.prop]"
              type="year"
              placeholder="选择年"
            >
            </el-date-picker>
          </el-form-item>
        </div>
      </div>
      <div class="text_right1">
        <el-button
          type="primary"
          size="small"
          @click="btnClick('dataSearch')"
          v-if="defaultShow"
          >查询</el-button
        >
        <el-button
          type="primary"
          size="small"
          @click="OpenMoreSearch()"
          v-if="defaultShow"
          >高级查询</el-button
        >
        <el-button
          type="info"
          size="small"
          @click="btnClick('dataReset')"
          v-if="defaultShow"
          >重置</el-button
        >
        <el-button
          v-if="defaultShow && exportList.length == 0"
          type="warning"
          size="small"
          @click="btnClick('dataExport')"
          >导出</el-button
        >

        <el-dropdown
          size="small"
          split-button
          type="primary"
          @command="handleCommand"
          v-else-if="defaultShow && exportList.length > 0"
        >
          导出
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-for="(a, x) in exportList"
              :key="x"
              :command="x"
              >{{ a.label }}</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
        <el-button
          v-for="(item, i) in btnForm"
          :key="i"
          :type="item.Type ? item.Type : 'primary'"
          :icon="item.Icon"
          size="small"
          @click="btnClick(item.Methods, item.Params, i)"
          v-show="
            Array.prototype.isPrototypeOf(item.signName) &&
            item.signName.includes(signName)
              ? true
              : item.signName || item.signName == 0
              ? item.signName == signName
              : true
          "
        >
          {{ item.BtnName }}</el-button
        >
        <!-- <el-button
              v-show="isSpread"
              type="text"
              @click="openSearch"
              size="small"
            >
              <span>{{ text }}</span>
              <span
                :class="
                  tagRemark == 0
                    ? 'search_up cx_margin_left1'
                    : 'search_down cx_margin_left1'
                "
              >
                <img src="../../assets/svg/updown.svg" />
              </span>
            </el-button> -->
      </div>
    </el-form>
    <el-dialog
      :title="'高级查询'"
      :visible.sync="colDialogVisible2"
      width="50%"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      ><div class="diaBody">
        <div>
          <el-form
            ref="searchData"
            :model="searchData"
            class="Seach"
            size="small"
            inline
            label-width=""
            label-position="left"
            @submit.native.prevent
          >
            <div
              v-for="(x, y) in searchData['QueryParams']"
              :key="y"
              class="flex_row_center"
            >
              <el-select
                class="innerDiv"
                v-model="x['prop']"
                filterable
                size="small"
                clearable
                @change="handleChange($event, y)"
              >
                <el-option
                  v-for="x in searchForm"
                  :label="x.label"
                  :value="x['prop']"
                  :key="x['prop']"
                ></el-option>
              </el-select>
              <el-select
                class="innerDiv"
                v-model="x['queryTypeValue']"
                filterable
                size="small"
                clearable
              >
                <el-option
                  v-for="x1 in x['queryType']"
                  :label="x1.label"
                  :value="x1['value']"
                  :key="x1['value']"
                ></el-option>
              </el-select>
              <el-form-item :name="x.prop" class="dialogContent">
                <el-input
                  class="full-width"
                  v-if="x.type === null"
                  v-model="x[x.prop]"
                  size="small"
                  type="number"
                  @keyup.enter.native="btnClick('dataSearch')"
                ></el-input>
                <!-- 输入框 -->
                <el-input
                  class="full-width"
                  v-if="x.type === 'Input'"
                  v-model="x[x.prop]"
                  size="small"
                  type="text"
                  @keyup.enter.native="btnClick('dataSearch')"
                ></el-input>
                <!-- 下拉框 -->
                <el-select
                  class="full-width"
                  v-if="x.type === 'Select'"
                  filterable
                  :multiple="x.multiple"
                  v-model="x[x.prop]"
                  size="small"
                  clearable
                  style="width: 100%"
                >
                  <el-option
                    v-for="op in x.options"
                    :label="op.label"
                    :value="op.value"
                    :key="op.value"
                  ></el-option>
                </el-select>
                <!-- 日期 -->
                <el-date-picker
                  class="full-width"
                  style="width: 100%"
                  v-if="x.type === 'Daterange'"
                  v-model="x[x.prop]"
                  format="MM-dd"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                >
                </el-date-picker>
                <el-date-picker
                  class="full-width"
                  v-if="x.type === 'Date'"
                  v-model="x[x.prop]"
                ></el-date-picker>
                <!-- 日期时间 -->
                <el-date-picker
                  class="full-width"
                  v-if="x.type === 'DateTime'"
                  type="datetime"
                  v-model="x[x.prop]"
                  :disabled="x.disable && x.disable(x[x.prop])"
                ></el-date-picker>
                <el-date-picker
                  class="full-width"
                  v-if="x.type === 'month'"
                  v-model="x[x.prop]"
                  value-format="yyyy-MM"
                  type="month"
                >
                </el-date-picker>
                <!-- 月份范围 -->
                <el-date-picker
                  class="full-width"
                  v-if="x.type === 'monthrange'"
                  v-model="x[x.prop]"
                  type="monthrange"
                  range-separator="至"
                  start-placeholder="开始月份"
                  end-placeholder="结束月份"
                >
                </el-date-picker>
                <!-- 年份 -->
                <el-date-picker
                  class="full-width"
                  v-if="x.type === 'year'"
                  v-model="x[x.prop]"
                  type="year"
                  placeholder="选择年"
                >
                </el-date-picker>
              </el-form-item>
              <i class="el-icon-plus innerDiv" @click="addSearch"></i>
              <i
                class="el-icon-delete innerDiv"
                v-show="searchData['QueryParams'].length > 1"
                :disabled="searchData['QueryParams'].length === 1"
                @click="removeSearch(y)"
              ></i>
            </div>
          </el-form>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="btnClick('dataSearch')"
          >查询</el-button
        >
        <el-button type="info" @click="resetEvent()">重置</el-button>
        <el-button @click="colDialogVisible2 = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    // 多个下拉导出
    exportList: {
      type: Array,
      required: false,
      default: function () {
        return [];
      },
    },
    isMoreHeader: {
      type: Boolean,
      default: false,
    },
    signName: {
      type: Number,
      required: false,
    },
    defaultShow: {
      type: Boolean,
      default: true,
    },
    // 表格的下标
    remark: {
      type: Number,
      required: false,
    },
    searchForm: {
      type: Array,
      default: function () {
        return [];
      },
    },
    btnForm: {
      type: Array,
      default: function () {
        return [];
      },
    },
    searchData: {
      type: Object,
      default: function () {
        return {
          QueryParams: [],
        };
      },
    },
    isLoading: {
      type: Boolean,
      required: false,
    },
  },
  data() {
    return {
      size: "small",
      circle: 0,
      tag: 0,
      col: 0,
      isSpread: false,
      tagRemark: 0,
      text: "展开",
      row: 0,
      colDialogVisible2: false,
      selectValue1: null,
      selectValue2: null,
      form: [
        {
          type: null,
          label: null,
          width: null,
          prop: null,
          placeholder: null,
          methods: null,
          options: null,
          dicID: null,
          icon: null,
          multiple: null,
          value: null,
          queryType: null,
          queryTypeValue: null,
        },
      ],
      obj: {
        type: null,
        label: null,
        width: null,
        prop: null,
        placeholder: null,
        methods: null,
        options: null,
        dicID: null,
        icon: null,
        multiple: null,
        value: null,
        queryType: null,
        queryTypeValue: null,
      },
    };
  },
  created() {},
  mounted() {},
  watch: {
    searchForm: {
      handler: function (val, oldVal) {
        console.log("searchForm", this.searchForm);
        this.row = this.searchForm.length <= 6 ? 0 : 1;
        this.circle = Math.ceil(this.searchForm.length / 6); // 有几行
        this.tag = this.searchForm.length % 7;
        this.col = 24 - 3 * this.tag;
        if (this.searchForm.length == 7 || this.circle >= 2) {
          this.isSpread = true;
          this.tagRemark = 0;
        }
        // 检查并赋值给 searchData["QueryParams"]
        // if (this.searchData["QueryParams"] && val.length > 0) {
        this.$set(this.searchData, "QueryParams", []);
        this.$set(this.searchData["QueryParams"], 0, {
          type: null,
          label: null,
          width: null,
          prop: null,
          placeholder: null,
          methods: null,
          options: null,
          dicID: null,
          icon: null,
          multiple: null,
          value: null,
          queryType: null,
          queryTypeValue: null,
        });
        // }
      },
      // 深度观察监听
      immediate: true,
      deep: true,
    },
    // searchData: {
    //   handler: function (val, oldVal) {
    //     //给searchData赋值，由于父组件没有传过来
    //     // this.$nextTick(() => {
    //     if (!this.searchData["QueryParams"]) {
    //       this.$set(this.searchData, "QueryParams", this.searchForm);
    //     }
    //     // });
    //   },
    //   // 深度观察监听
    //   immediate: true,
    //   deep: true,
    // },
    isLoading: {
      handler: function (val, oldVal) {
        this.isLoading = val;
      },
      // 深度观察监听
      deep: true,
    },
  },
  methods: {
    // 展开或收缩
    // openSearch() {
    //   let val = 0;
    //   if (this.text == "展开") {
    //     this.text = "收缩";
    //     val = 1;
    //   } else {
    //     this.text = "展开";
    //   }
    //   this.tagRemark = val;
    // },
    // 按钮事件
    btnClick(methods, params, index) {
      if (methods == "dataExport" && this.isMoreHeader) {
        this.$emit("btnClick", "exportmoreExcel", params, index, this.remark);
        return;
      }
      this.$emit("btnClick", methods, params, index, this.remark);
    },
    // 多个导出
    handleCommand(index) {
      let remarkTb = this.exportList[index].value;
      this.$emit("btnClick", "dataExport", "", 0, remarkTb);
    },
    handleChange(value, y) {
      let objIndex = this.searchForm.findIndex((item) => {
        return item["prop"] === value;
      });

      if (objIndex) {
        // this.form[y]["queryType"] = this.searchForm[objIndex]["queryType"];
        // this.searchForm[objIndex][] = this.form[y]["value"];
        // this.$set(this.searchData);
        this.$set(
          this.searchData["QueryParams"],
          y,
          JSON.parse(JSON.stringify(this.searchForm[objIndex]))
        );
        this.searchForm[objIndex]["queryTypeValue"] = "0";
        // if (this.searchData.hasOwnProperty(value)) {
        //   this.searchData["QueryParams"][y][value] = this.searchData[value];
        // }
      }
    },
    addSearch() {
      this.searchData["QueryParams"].push(JSON.parse(JSON.stringify(this.obj)));
    },
    //单行条件移除
    removeSearch(y) {
      this.searchData["QueryParams"].splice(y, 1);
    },
    resetEvent() {
      this.form = JSON.parse(
        JSON.stringify([
          {
            type: null,
            label: null,
            width: null,
            prop: null,
            placeholder: null,
            methods: null,
            options: null,
            dicID: null,
            icon: null,
            multiple: null,
            value: null,
          },
        ])
      );
    },
    OpenMoreSearch() {
      this.colDialogVisible2 = true;
    },
  },
};
</script>
<style lang="scss" scoped>
.el-select__input {
  vertical-align: baseline;
}
.diaBody {
  padding: 20px;
  height: 60vh;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.dialogContent {
  width: 200px;
}
::v-deep .el-icon-plus,
.el-icon-delete {
  cursor: pointer !important;
  font-size: 24px;
}

.innerDiv {
  margin-right: 10px !important; /* 添加右侧间隔 */
}
.innerDiv:last-child {
  margin-right: 0 !important; /* 最后一个元素去除右侧间隔 */
}
// .full-width {
//   width: 100% !important;
// }

::v-deep .el-form-item__content {
  width: 100% !important;
  margin-right: 10px !important;
}
.FormDiv{
  width:200px
}
</style>
