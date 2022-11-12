<!-- 搜索表单 -->
<template>
  <div class="flex">
    <el-form
      ref="searchData"
      :model="searchData"
      class="demo-form-inline"
      inline
      style="padding:0 5px;"
      @submit.native.prevent
    >
      <el-form-item
        v-for="(item) in searchForm"
        :label="item.label+'：'"
        :key="item.prop"
        :prop="item.prop"
      >
        <!-- 输入框 -->

        <template v-if="item.type =='Input'">
          <el-input
            v-model="searchData[item.prop]"
            @keyup.enter.native="operation(item.methods,searchData)"
          ></el-input>
        </template>
        <template v-else-if="item.type=='Select'">
          <el-select
            v-model="searchData[item.prop]"
            filterable
            @change="operation(item.methods,searchData[item.prop],item.prop)"
            clearable
          >
            <el-option
              v-for="(op,index) in item.options"
              :label="op.label"
              :value="op.value"
              :key="index"
            >
            </el-option>
          </el-select>
        </template>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon=""
          size="small"
          @click="operation('changesearch')"
        >查询
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          type="info"
          icon=""
          size="small"
          @click="operation('changeresetform')"
        >导出
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
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
    };
  },
  created() {},
  mounted() {},
  watch: {
    searchForm: {
      handler: function (val, oldVal) {
        this.searchForm = val;
        this.circle = Math.ceil(this.searchForm.length / 6);
        this.tag = this.searchForm.length % 6;
        this.col = 24 - 4 * this.tag;
        if (this.circle >= 2) {
          this.isSpread = true;
          this.tagRemark = 0;
        }
      },
      // 深度观察监听
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
      this.$emit("btnClick", methods, params, index, this.remark);
    },
  },
};
</script>