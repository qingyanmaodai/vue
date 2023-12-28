<!-- 通用表格头部改良版查询 -->
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
      <template>
        <div class="flex_row_spaceBtn">
          <div class="flex" style="flex-wrap: wrap">
            <div
              class="form_col FormDiv"
              v-for="(x, y) in searchForm.slice(0, Region)"
              :key="y"
            >
              <el-form-item :label="x.label" :name="x.prop">
                <el-input
                  v-if="!x.type"
                  v-model="searchData[x.prop]"
                  size="small"
                  @keyup.enter.native="btnClick('dataSearch')"
                  @paste.native="pasteDescription($event, x.prop)"
                ></el-input>
                <!-- 输入框 -->
                <el-input
                  v-if="x.type === 'Input'"
                  v-model="searchData[x.prop]"
                  size="small"
                  type="text"
                  @keyup.enter.native="btnClick('dataSearch')"
                  @paste.native="pasteDescription($event, x.prop)"
                ></el-input>
                <!-- el-popover -->
                <el-popover
                  v-model="popoverVisible[x.prop]"
                  placement="bottom"
                  trigger="manual"
                  width="280"
                  ><div style="height: 200px; overflow-y: auto">
                    <div class="flex justify-between propBtnNode">
                      <div class="flex">
                        <el-button
                          class="propButton"
                          type="danger"
                          size="mini"
                          icon="el-icon-close"
                          @click="closePropTable(x.prop)"
                        ></el-button>
                      </div>
                      <div class="flex items-center">
                        <el-button
                          class="propButton"
                          type="primary"
                          size="mini"
                          icon="el-icon-plus"
                          @click="addPropRow(x.prop)"
                        ></el-button>
                        <el-button
                          class="propButton"
                          type="primary"
                          size="mini"
                          icon="el-icon-check"
                          @click="confirmPropTable(x.prop)"
                        ></el-button>
                      </div>
                    </div>
                    <el-table
                      :data="filterPropData(x.prop)"
                      style="width: 100%"
                    >
                      <el-table-column
                        :prop="x.prop"
                        :label="x.label"
                        :editable="true"
                        ><template slot="header" slot-scope="scope">
                          <el-input
                            v-model="currentPropValue[x.prop]"
                            size="mini"
                            placeholder="搜索"
                          /> </template
                        ><template slot-scope="scope">
                          <el-input
                            v-model="scope.row"
                            @input="
                              updatePropRow(scope.row, scope.$index, x.prop)
                            "
                          >
                          </el-input> </template
                      ></el-table-column>
                      <el-table-column width="60" label="操作">
                        <template slot-scope="scope">
                          <el-button
                            @click="removePropRow(x.prop, scope.$index)"
                            type="danger"
                            size="mini"
                            icon="el-icon-delete"
                          ></el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </el-popover>
                <!-- 下拉框 -->
                <el-select
                  v-if="x.type === 'Select'"
                  v-model="searchData[x.prop]"
                  filterable
                  :multiple="x.multiple"
                  collapse-tags
                  size="small"
                  clearable
                  style="width: 100%"
                >
                  <el-option
                    v-for="(op, index) in x.options"
                    :label="op.label"
                    :value="op.value"
                    :key="index"
                  ></el-option>
                </el-select>
                <!-- 日期 -->
                <el-date-picker
                  :style="{ width: 240 + 'px' }"
                  v-if="x.type === 'Daterange'"
                  v-model="searchData[x.prop]"
                  format="yyyy-MM-dd"
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
          <div class="text_right">
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
              v-if="defaultMoreShow"
              >高级查询</el-button
            >
            <el-button
              type="info"
              size="small"
              @click="btnClick('dataReset')"
              v-if="defaultResetShow"
              >重置</el-button
            >
            <el-button
              v-if="defaultExportShow && exportList.length == 0"
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
              v-else-if="defaultExportShow && exportList.length > 0"
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
            <el-button
              v-show="isSpread"
              type="text"
              @click="openSearch"
              size="small"
            >
              <span>{{ changeText }}</span>
              <span
                :class="
                  !collapsiable
                    ? 'search_up cx_margin_left1'
                    : 'search_down cx_margin_left1'
                "
              >
                <img src="../../assets/svg/updown.svg" />
              </span>
            </el-button>
          </div>
        </div>
        <div class="flex" v-show="collapsiable" style="flex-wrap: wrap">
          <div
            class="form_col FormDiv"
            v-for="(x, y) in searchForm.slice(Region, searchForm.length)"
            :key="y"
          >
            <el-form-item :label="x.label" :name="x.prop">
              <el-input
                v-if="x.type === null"
                v-model="searchData[x.prop]"
                size="small"
                type="number"
                @keyup.enter.native="btnClick('dataSearch')"
                @paste.native="pasteDescription($event, x.prop)"
              ></el-input>
              <!-- 输入框 -->
              <el-input
                v-if="x.type === 'Input'"
                v-model="searchData[x.prop]"
                size="small"
                type="text"
                @keyup.enter.native="btnClick('dataSearch')"
                @paste.native="pasteDescription($event, x.prop)"
              ></el-input>
              <!-- el-popover -->
              <el-popover
                v-model="popoverVisible[x.prop]"
                placement="bottom"
                trigger="manual"
                width="280"
                ><div style="height: 200px; overflow-y: auto">
                  <div class="flex justify-between propBtnNode">
                    <div class="flex">
                      <el-button
                        class="propButton"
                        type="danger"
                        size="mini"
                        icon="el-icon-close"
                        @click="closePropTable(x.prop)"
                      ></el-button>
                    </div>
                    <div class="flex items-center">
                      <el-button
                        class="propButton"
                        type="primary"
                        size="mini"
                        icon="el-icon-plus"
                        @click="addPropRow(x.prop)"
                      ></el-button>
                      <el-button
                        class="propButton"
                        type="primary"
                        size="mini"
                        icon="el-icon-check"
                        @click="confirmPropTable(x.prop)"
                      ></el-button>
                    </div>
                  </div>
                  <el-table :data="filterPropData(x.prop)" style="width: 100%">
                    <el-table-column
                      :prop="x.prop"
                      :label="x.label"
                      :editable="true"
                      ><template slot="header" slot-scope="scope">
                        <el-input
                          v-model="currentPropValue[x.prop]"
                          size="mini"
                          placeholder="搜索"
                        /> </template
                      ><template slot-scope="scope">
                        <el-input
                          v-model="scope.row"
                          @input="
                            updatePropRow(scope.row, scope.$index, x.prop)
                          "
                        >
                        </el-input> </template
                    ></el-table-column>
                    <el-table-column width="60" label="操作">
                      <template slot-scope="scope">
                        <el-button
                          @click="removePropRow(x.prop, scope.$index)"
                          type="danger"
                          size="mini"
                          icon="el-icon-delete"
                        ></el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </el-popover>
              <!-- 下拉框 -->
              <el-select
                v-if="x.type === 'Select'"
                filterable
                :multiple="x.multiple"
                collapse-tags
                v-model="searchData[x.prop]"
                size="small"
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="(op, index) in x.options"
                  :label="op.label"
                  :value="op.value"
                  :key="index"
                ></el-option>
              </el-select>
              <!-- 日期 -->
              <el-date-picker
                style="width: 100%"
                v-if="x.type === 'Daterange'"
                v-model="searchData[x.prop]"
                format="yyyy-MM-dd"
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
      </template>
    </el-form>

    <el-dialog
      :title="'高级查询'"
      :visible.sync="colDialogVisible2"
      width="30%"
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
                  v-for="(x, y) in searchMoreForm"
                  :label="x.label"
                  :value="x['prop']"
                  :key="y"
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
                  v-for="(x1, y1) in x['queryType']"
                  :label="x1.label"
                  :value="x1['value']"
                  :key="y1"
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
                  collapse-tags
                  v-model="x[x.prop]"
                  size="small"
                  clearable
                  style="width: 100%"
                >
                  <el-option
                    v-for="(op, index) in x.options"
                    :label="op.label"
                    :value="op.value"
                    :key="index"
                  ></el-option>
                </el-select>
                <!-- 日期 -->
                <el-date-picker
                  class="full-width"
                  style="width: 100%"
                  v-if="x.type === 'Daterange'"
                  v-model="x[x.prop]"
                  format="yyyy-MM-dd"
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
    // 最大展示数，默认3个，超过则隐藏，为0时不限制
    Region: {
      type: Number,
      default: 6,
    },

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
    //默认显示查询按钮
    defaultShow: {
      type: Boolean,
      default: true,
    },
    //默认关闭高级查询按钮
    defaultMoreShow: {
      type: Boolean,
      default: false,
    },
    //默认显示重置按钮
    defaultResetShow: {
      type: Boolean,
      default: true,
    },
    //默认显示导出按钮
    defaultExportShow: {
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
    searchMoreForm: {
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
      propTableData: {},
      popoverVisible: {},
      currentPropValue: {},
      size: 'small',
      circle: 0,
      tag: 0,
      col: 0,
      isSpread: false,
      tagRemark: 0,
      text: '展开',
      row: 0,
      colDialogVisible2: false,
      collapsiable: false,
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
        if (this.searchForm.length > this.Region) {
          this.isSpread = true;
        }
        this.searchForm.map((item) => {
          this.$set(this.popoverVisible, item.prop, false);
          this.$set(this.currentPropValue, item.prop, '');
          this.$set(this.propTableData, item.prop, []);
        });

        // 检查并赋值给 searchData["QueryParams"]
        this.$set(this.searchData, 'QueryParams', []);
        this.$set(this.searchData['QueryParams'], 0, {
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
    isLoading: {
      handler: function (val, oldVal) {
        this.isLoading = val;
      },
      // 深度观察监听
      deep: true,
    },
  },
  computed: {
    changeText() {
      return this.collapsiable ? '收起' : '展开';
    },
  },
  methods: {
    // 展开或收缩
    openSearch() {
      // this.minShowCtrol();
      this.collapsiable = !this.collapsiable;
      // let val = 0;
      // if (this.text == "展开") {
      //   this.text = "收缩";
      //   val = 1;
      // } else {
      //   this.text = "展开";
      // }
      // this.tagRemark = val;
    },
    // 按钮事件
    btnClick(methods, params, index) {
      if (methods == 'dataExport' && this.isMoreHeader) {
        this.$emit('btnClick', 'exportmoreExcel', params, index, this.remark);
        return;
      }
      this.$emit('btnClick', methods, params, index, this.remark);
    },
    // 多个导出
    handleCommand(index) {
      let remarkTb = this.exportList[index].value;
      this.$emit('btnClick', 'dataExport', '', 0, remarkTb);
    },
    handleChange(value, y) {
      let objIndex = this.searchMoreForm.findIndex((item) => {
        return item['prop'] === value;
      });
      console.log(value, objIndex, 'objIndex');

      if (objIndex !== -1) {
        // this.form[y]["queryType"] = this.searchMoreForm[objIndex]["queryType"];
        // this.searchMoreForm[objIndex][] = this.form[y]["value"];
        // this.$set(this.searchData);
        this.$set(
          this.searchData['QueryParams'],
          y,
          JSON.parse(JSON.stringify(this.searchMoreForm[objIndex])),
        );
        this.searchMoreForm[objIndex]['queryTypeValue'] = '0';
        console.log(
          this.searchData['QueryParams'],
          'this.searchData["QueryParams"]',
        );
        // if (this.searchData.hasOwnProperty(value)) {
        //   this.searchData["QueryParams"][y][value] = this.searchData[value];
        // }
      }
    },
    addSearch() {
      this.searchData['QueryParams'].push(JSON.parse(JSON.stringify(this.obj)));
    },
    //单行条件移除
    removeSearch(y) {
      this.searchData['QueryParams'].splice(y, 1);
    },
    resetEvent() {
      this.searchData['QueryParams'] = JSON.parse(
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
        ]),
      );
    },
    OpenMoreSearch() {
      this.colDialogVisible2 = true;
    },
    addPropRow(prop) {
      this.propTableData[prop].unshift('');
    },
    filterPropData(prop) {
      const searchData = this.currentPropValue[prop].toLowerCase(); // 转换为小写，方便匹配
      return this.propTableData[prop].filter((item) =>
        item.toLowerCase().includes(searchData),
      );
    },
    removePropRow(prop, index) {
      // 判断索引是否有效
      if (index >= 0 && index < this.propTableData[prop].length) {
        // 使用数组的 splice 方法删除指定索引的元素
        this.propTableData[prop].splice(index, 1);
      }
    },
    updatePropRow(row, index, prop) {
      this.$set(this.propTableData[prop], index, row);
    },
    confirmPropTable(prop) {
      this.searchData[prop] = this.propTableData[prop];
      this.popoverVisible[prop] = false;
    },
    closePropTable(prop) {
      this.popoverVisible[prop] = false;
    },
    pasteDescription(event, prop) {
      let copiedString = event.clipboardData.getData('text/plain');
      // 检查是否包含换行符
      if (copiedString.trim().includes('\n')) {
        this.popoverVisible[prop] = true;
        // 包含换行符，执行相应操作
        const lines = copiedString
          .trim()
          .split('\n')
          .map((line) => line.trim());

        this.propTableData[prop] = lines;
      } else {
        // 不包含换行符，执行其他操作
        console.log('不包含换行符的处理逻辑');
      }
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

.innerDiv {
  margin-right: 10px !important; /* 添加右侧间隔 */
}
.innerDiv:last-child {
  margin-right: 0 !important; /* 最后一个元素去除右侧间隔 */
}
// .full-width {
//   width: 100% !important;
// }

.ces-search ::v-deep .el-form-item__content {
  // width: 100% !important;
  margin-right: 10px !important;
  // .el-date-editor {
  //   width: 250px !important;
  // }
  .el-input {
    width: 150px !important;
  }
}
::v-deep .propBtnNode {
  padding: 0 10px;
  .propButton {
    border-radius: 50% !important;
    padding: 4px !important;
    font-size: 6px !important;
  }
}

// .FormDiv {
//   width: 220px;
// }
</style>
