<!-- 通用表格头部查询 -->
<template>
  <div class="ces-search">
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
      <template v-if="row == 0">
        <el-row>
          <el-col
            :span="3"
            v-for="(x, y) in searchForm"
            :key="y"
            class="form_col"
          >
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
              >
                <el-option
                  v-for="op in x.options"
                  :label="op.label"
                  :value="op.value"
                  :key="op.value"
                ></el-option>
              </el-select>
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
              <!-- 日期 -->
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
          </el-col>
          <el-col :span="col" class="text_right">
            <el-button
              plain
              type="primary"
              size="small"
              @click="btnClick('dataSearch')"
              v-if="defaultShow"
              >查询</el-button
            >
            <el-button
              plain
              type="info"
              size="small"
              @click="btnClick('dataReset')"
              v-if="defaultShow"
              >重置</el-button
            >
            <el-button
              v-if="defaultShow && exportList.length == 0"
              plain
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
              plain
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
            <el-button
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
            </el-button>
          </el-col>
        </el-row>
      </template>
      <template v-else>
        <el-row>
          <el-col
            class="form_col"
            :span="3"
            v-for="(x, y) in searchForm.slice(0, 6)"
            :key="y"
          >
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
          </el-col>
          <el-col :span="6" class="text_right">
            <el-button
              plain
              type="primary"
              size="small"
              @click="btnClick('dataSearch')"
              v-if="defaultShow"
              >查询</el-button
            >
            <el-button
              plain
              type="info"
              size="small"
              @click="btnClick('dataReset')"
              v-if="defaultShow"
              >重置</el-button
            >
            <el-button
              v-if="defaultShow && exportList.length == 0"
              plain
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
              plain
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
            <el-button
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
            </el-button>
          </el-col>
        </el-row>
        <el-row v-for="(a, i) in circle - 1" :key="i" v-show="tagRemark == 1">
          <el-col
            class="form_col"
            :span="3"
            v-for="(x, y) in searchForm.slice(i * 7 + 6, (i + 1) * 7 + 6)"
            :key="y"
          >
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
                filterable
                :multiple="x.multiple"
                v-model="searchData[x.prop]"
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
          </el-col>
        </el-row>
      </template>
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
        return {};
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
        console.log(this.col,'this.col',this.circle);
        if (this.searchForm.length == 7 || this.circle >= 2) {
          this.isSpread = true;
          this.tagRemark = 0;
        }
      },
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
    openSearch() {
      let val = 0;
      if (this.text == "展开") {
        this.text = "收缩";
        val = 1;
      } else {
        this.text = "展开";
      }
      this.tagRemark = val;
    },
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
</style>