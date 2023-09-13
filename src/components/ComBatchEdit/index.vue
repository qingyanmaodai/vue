<template>
  <el-form :inline="true" style="height: 100%">
    <el-form-item class="FormDiv">
      <el-select
        clearable
        filterable
        size="small"
        placeholder="请选择修改值"
        v-model="OrderNo"
        @change="handleChange($event)"
      >
        <el-option
          v-for="(item, i) in OrderNos"
          :key="i"
          :label="item.label"
          :value="item.prop"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item class="FormDiv">
      <!-- 输入框 -->
      <el-input
        v-if="OrderNoObj.ControlType === 'textbox' || !OrderNoObj.ControlType"
        v-model="OrderNoValue"
        size="small"
        type="text"
      ></el-input>
      <el-input
        v-if="OrderNoObj.ControlType === 'numberbox'"
        v-model="OrderNoValue"
        size="small"
        type="number"
      ></el-input>
      <!-- 下拉框 -->
      <el-select
        v-if="OrderNoObj.ControlType === 'combobox'"
        v-model="OrderNoValue"
        filterable
        :multiple="OrderNoObj.multiple"
        size="small"
        clearable
        style="width: 100%"
      >
        <el-option
          v-for="(op, index) in OrderNoObj.items"
          :label="op.label"
          :value="op.value"
          :key="index"
        ></el-option>
      </el-select>
      <!-- 日期 -->
      <el-date-picker
        style="width: 100%"
        v-if="OrderNoObj.ControlType === 'Daterange'"
        v-model="OrderNoValue"
        format="MM-dd"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        size="small"
      >
      </el-date-picker>
      <el-date-picker
        v-if="OrderNoObj.ControlType === 'datebox'"
        v-model="OrderNoValue"
        size="small"
      ></el-date-picker>
      <!-- 日期时间 -->
      <el-date-picker
        v-if="OrderNoObj.ControlType === 'DateTime'"
        type="datetime"
        v-model="OrderNoValue"
        :disabled="OrderNoObj.disable"
        size="small"
      ></el-date-picker>
      <el-date-picker
        v-if="OrderNoObj.ControlType === 'month'"
        v-model="OrderNoValue"
        value-format="yyyy-MM"
        type="month"
        size="small"
      >
      </el-date-picker>
      <!-- 月份范围 -->
      <el-date-picker
        v-if="OrderNoObj.ControlType === 'monthrange'"
        v-model="OrderNoValue"
        type="monthrange"
        range-separator="至"
        start-placeholder="开始月份"
        end-placeholder="结束月份"
        size="small"
      >
      </el-date-picker>
      <!-- 年份 -->
      <el-date-picker
        v-if="OrderNoObj.ControlType === 'year'"
        v-model="OrderNoValue"
        type="year"
        placeholder="选择年"
        size="small"
      >
      </el-date-picker>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="small" @click="changeProp()">
        批量修改
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  props: {
    OrderNos: {
      type: Array,
      default: function () {
        return [];
      },
    },
    remark: {
      type: Number,
      default: 0,
    },
    OrderNo: { default: null },
  },
  data() {
    return {
      OrderNoObj: { ControlType: "textbox" },
      OrderNoValue: "",
    };
  },
  created() {},
  mounted() {},
  watch: {
    OrderNos: {
      handler: function (val, oldVal) {
        if (val) {
          this.$nextTick(() => {
            this.handleChange(this.OrderNo);
          });
        }
      },
      // 深度观察监听
      deep: true,
    },
    // isLoading: {
    //   handler: function (val, oldVal) {
    //     this.isLoading = val;
    //   },
    //   // 深度观察监听
    //   deep: true,
    // },
  },
  computed: {},
  methods: {
    changeProp() {
      this.$emit("changeProp", this.remark, this.OrderNo, this.OrderNoValue);
    },
    handleChange(value) {
      this.OrderNoObj = this.OrderNos.find((item) => {
        return item["prop"] === value;
      });
      if (!this.OrderNoObj) {
        this.OrderNoObj = { ControlType: "textbox" };
      }
      this.OrderNoValue = "";
      // console.log(value, objIndex, "objIndex");

      // if (objIndex !== -1) {
      //   // this.form[y]["queryType"] = this.searchMoreForm[objIndex]["queryType"];
      //   // this.searchMoreForm[objIndex][] = this.form[y]["value"];
      //   // this.$set(this.searchData);
      //   this.$set(
      //     this.searchData["QueryParams"],
      //     y,
      //     JSON.parse(JSON.stringify(this.searchMoreForm[objIndex]))
      //   );
      //   // if (this.searchData.hasOwnProperty(value)) {
      //   //   this.searchData["QueryParams"][y][value] = this.searchData[value];
      //   // }
      // }
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
::v-deep .el-form-item {
  height: 100% !important;
}
::v-deep .el-form-item__content {
  width: 100% !important;
  height: 100% !important;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 150px;
  // margin-right: 10px !important;
}
::v-deep .el-date-editor {
  width: 100% !important;
  // margin-right: 10px !important;
}
.FormDiv {
  width: 150px;
}
</style>
