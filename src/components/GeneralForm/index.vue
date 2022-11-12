<template>
  <!--  form表单头部控件  -->
  <div>
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      label-width="95px"
      class="dialogForm"
      inline
      @submit.native.prevent
    >
      <el-form-item
        v-for="(newItem, index) in formController"
        :key="index"
        :label="newItem.label"
        :prop="newItem.prop"
      >
        <el-input
          v-model="ruleForm[newItem.prop]"
          v-if="newItem.component.type == 'input'"
          :type="newItem.component.inputType || 'text'"
          :rows="1"
          size="small"
          :class="newItem.component.className"
          :disabled="newItem.disabled"
        />
        <el-input
          size="small"
          v-model="ruleForm[newItem.prop]"
          v-else-if="newItem.component.type == 'dialog'"
          :disabled="newItem.disabled"
          :class="newItem.component.className"
          @focus="openInnerDialog(newItem.component.methods)"
        >
          <i
            slot="suffix"
            class="el-icon-search"
          ></i>
        </el-input>
        <el-select
          size="small"
          :class="newItem.component.className"
          v-model="ruleForm[newItem.prop]"
          placeholder="请选择"
          v-else-if="newItem.component.type == 'select'"
          :disabled="newItem.disabled"
          @change="(val)=>operation(newItem.methods,val)"
        >
          <el-option
            v-for="(item2, index2) in newItem.select"
            :key="index2"
            :label="item2.label"
            :value="item2.value"
          />
        </el-select>
        <el-select
          size="small"
          ref="formRef"
          :class="newItem.component.className"
          v-else-if="newItem.component.type == 'selectTree'"
          v-model="ruleForm[newItem.prop]"
          :clearable="true"
        >
          <el-option
            :value="ruleForm[newItem.prop]"
            :label="ruleForm[newItem.prop]"
          >
            <el-tree
              ref="selectTree"
              :props="newItem.treeProps"
              :data="newItem.treeData"
              :class="newItem.component.className"
              :expand-on-click-node="false"
              default-expand-all
              @node-click="selectHandleNodeClick"
            ></el-tree>
          </el-option>
        </el-select>
        <el-select
          size="small"
          ref="formRef2"
          v-else-if="newItem.component.type == 'selectTreeLoad'"
          v-model="ruleForm[newItem.prop]"
          :class="newItem.component.className"
          :clearable="true"
        >
          <el-option
            :value="ruleForm[newItem.prop]"
            :label="ruleForm[newItem.prop]"
          >
            <el-tree
              ref="selectTreeLoad"
              :props="newItem.treeProps"
              :load="loadNode"
              lazy
              :accordion="true"
              :indent="0"
              @node-click="selectHandleNodeClick2"
            ></el-tree>
          </el-option>
        </el-select>
        <el-date-picker
          size="small"
          :class="newItem.component.className"
          v-else-if="newItem.component.type == 'monthDate'"
          v-model="ruleForm[newItem.prop]"
          :picker-options="pickerOptions"
          value-format="yyyyMM"
          format="yyyy-MM"
          style="width: 100%"
          :disabled="newItem.disabled"
          type="month"
          placeholder="选择月"
        >
        </el-date-picker>
        <el-date-picker
          size="small"
          :class="newItem.component.className"
          v-else-if="newItem.component.type == 'date'"
          v-model="ruleForm[newItem.prop]"
          type="date"
          placeholder="选择日期"
          style="width: 100%"
          :disabled="newItem.disabled"
          value-format="yyyy-MM-dd"
        />
        <el-autocomplete
          size="small"
          v-else-if="newItem.component.type=='autocomplete'"
          style="width:100%"
          v-model="ruleForm[newItem.prop]"
          :fetch-suggestions="((queryString,cb)=>{fetchSuggertions(queryString,cb,newItem.methods)})"
          @select="item => getRemote(item,newItem.methods)"
        >
          <template slot-scope="{ item }">
            <div style="border-bottom: 1px dashed #8c8e8e;">
              <el-form
                label-width="100px"
                inline
              >
                <el-form-item
                  style="margin-bottom:5px"
                  :label="newItem.label"
                ><span style="color:orange">{{ item[newItem.prop] }}</span> </el-form-item>
                <el-form-item
                  style="margin-bottom:5px"
                  :label="newItem.label2"
                ><span style="color:orange">{{ item[newItem.prop2]}}</span> </el-form-item>
              </el-form>
            </div>
          </template>
        </el-autocomplete>

        <el-switch
          v-model="ruleForm[newItem.prop]"
          v-else-if="newItem.component.type == 'switch'"
          :disabled="newItem.disabled"
          :active-color="newItem.component.activeColor"
          :inactive-color="newItem.component.inactiveColor"
          :active-value="newItem.component.activeValue"
          :inactive-value="newItem.component.inactiveValue"
        />
        <el-checkbox
          v-else-if="newItem.component.type == 'checkbox'"
          v-model="ruleForm[newItem.prop]"
        ></el-checkbox>
        <el-checkbox-group
          v-else-if="newItem.component.type == 'checkboxGroup'"
          v-for="(item2, index2) in newItem.checkbox"
          :key="index2"
          v-model="ruleForm[newItem.prop]"
          :disabled="newItem.disabled"
        >
          <el-checkbox
            :label="newItem.label"
            name="type"
          />
        </el-checkbox-group>
        <el-radio-group
          v-else-if="newItem.component.type == 'radio'"
          v-for="(item2, index2) in newItem.checkbox"
          :key="index2"
          v-model="ruleForm[newItem.prop]"
          :disabled="newItem.disabled"
        >
          <el-radio label="item2.label" />
        </el-radio-group>
        <el-input
          v-model="ruleForm[newItem.prop]"
          type="textarea"
          v-else-if="newItem.component.type == 'textarea'"
          :disabled="newItem.disabled"
        />
        <el-upload
          v-else-if="newItem.component.type == 'upload'"
          class="upload-demo"
          drag
          action
          multiple
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            将文件拖到此处，或
            <em>点击上传</em>
          </div>
          <div
            class="el-upload__tip"
            slot="tip"
          >
            只能上传jpg/png文件，且不超过500kb
          </div>
        </el-upload>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  components: {},
  props: {
    formController: {
      type: Array,
      default: function () {
        return [];
      },
    },
    ruleForm: {
      type: Object,
      default: function () {
        return {};
      },
    },
    rules: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          let date = new Date();
          return (
            time.getMonth() > date.getMonth() ||
            time.getMonth() < date.getMonth() - 2
          );
        },
      },
    };
  },
  computed: {},
  watch: {},
  mounted() {},
  created() {
  },
  methods: {
    //选中树的节点
    selectHandleNodeClick(data, node) {
      this.$emit("getCategoryName", data, node);
    },
    selectHandleNodeClick2(data, node) {
      this.$emit("getTreeName", data, node);
    },
    openInnerDialog(methods, data, node) {
      this.$emit(methods, data, node);
    },
    //懒加载
    loadNode(node, resolve) {
      if (node.level == 0) {
        this.$emit("loadfirstnode", resolve);
      }
      if (node.level >= 1) {
        this.$emit("loadchildnode", node, resolve);
      }
    },
    // 操作选择的数据
    operation(methods, val) {
      if (methods) {
        this.$emit("methods", val);
      }
    },
    // 远程搜索
    fetchSuggertions(val, cb, methods) {
      this.$emit("fetchSuggertions", val, cb, methods);
    },
    // 获取远程搜索数据
    getRemote(newItem, methods) {
      this.$emit("getRemote", newItem, methods);
    },
  },
};
</script>
<style lang="scss" scoped>
.dialogForm ::v-deep .el-form-item__content {
  // width: calc(100% - 90px);
  width: 70%;
  margin: 0 !important;
}
// .dialogForm ::v-deep .el-input__inner {
//   height: 34px;
//   line-height: 34px;
// }
// .dialogForm ::v-deep .el-icon-search {
//   color: #fff;
//   position: relative;
//   z-index: 2;
//   font-size: 20px;
// }
.dialogForm {
  // ::v-deep .el-input__suffix {
  //   width: 30px;
  //   height: 34px;
  //   margin-top: 2px;
  //   margin-right: -4px;
  //   background: #409eff;
  //   cursor: pointer;
  // }
  // ::v-deep .el-select__caret::before {
  //   color: #ffffff !important;
  // }
}
// .dialogForm ::v-deep input::-webkit-outer-spin-button,
// .dialogForm ::v-deep input::-webkit-inner-spin-button {
//   -webkit-appearance: none !important;
// }
.dialogForm ::v-deep input[type="number"] {
  -moz-appearance: textfield;
}
.dialogForm ::v-deep .el-select {
  width: 100%;
}
</style>
