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
      <div class="flex" style="flex-wrap: wrap">
        <div v-for="(x, y) in searchForm.slice(0, 6)" :key="y" class="FormDiv">
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
        // console.log("searchForm", this.searchForm);
        // console.log("searchMoreForm", this.searchMoreForm);

        // 检查并赋值给 searchData["QueryParams"]
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
      },
      // 深度观察监听
      immediate: true,
      deep: true,
    },
    searchData: {
      handler: function (val, oldVal) {},
      // 深度观察监听
      immediate: true,
      deep: true,
    },
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
.FormDiv {
  width: 200px;
}
</style>
