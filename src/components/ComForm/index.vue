<template>
    <!--  form表单控件  -->
    <div>
        <el-form
            ref="formData"
            :model="formData"
            :rules="formRules"
            :label-width="labelWidth"
            class="comForm"
            @submit.native.prevent
        >
        <el-row  v-for="(a, i) in rowNum"
          :key="i">
        <el-col :span="newItem.colSpan||colSpan"  v-for="(newItem, index) in formController.slice((i)*initCol, (i+1) * initCol)" :key="index">
            <el-form-item
          
          :label="newItem.label"
          :prop="newItem.prop"
          v-show="!newItem.IsShow"
          :label-width="labelWidthItem"
        >
          <el-input
            size="small"
            v-model="formData[newItem.prop]"
            v-if="newItem.type == 'input'"
            :type="newItem.inputType || 'text'"
            :rows="1"
            :placeholder="newItem.placeholder"
            :disabled="newItem.disabled"
          />
          <el-input
            size="small"
            v-model="formData[newItem.prop]"
            v-else-if="newItem.type == 'dialog'"
            :disabled="newItem.disabled"
            :placeholder="newItem.placeholder"
            @focus="openInnerDialog(newItem.methods)"
          >
            <i
              slot="suffix"
              class="el-icon-search"
            ></i>
          </el-input>
          <el-select
            class="fill_width"
            size="small"
            :placeholder="newItem.placeholder"
            v-model="formData[newItem.prop]"
            v-else-if="newItem.type == 'select'"
            :clearable="true"
            :multiple="newItem.multiple"
            filterable
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
            class="fill_width"
            size="small"
            ref="formTreeRef"
            filterable
            v-else-if="newItem.type == 'selectTree'"
            v-model="formData[newItem.prop]"
            :placeholder="newItem.placeholder"
            :clearable="true"
          >
            <el-option
              :value="formData[newItem.prop]"
              :label="formData[newItem.prop]"
            >
              <el-tree
                ref="treeRef"
                :props="newItem.treeProps"
                :data="newItem.treeData"
                :expand-on-click-node="false"
                @node-click="selectHandleNodeClick"
              ></el-tree>
            </el-option>
          </el-select>
          <el-select
            class="fill_width"
            ref="formTreeloadRef"
            size="small"
            v-else-if="newItem.type == 'selectTreeLoad'"
            v-model="formData[newItem.prop]"
            :clearable="true"
            filterable
          >
            <el-option
              :value="formData[newItem.prop]"
              :label="formData[newItem.prop]"
            >
              <el-tree
                ref="treeLoadRef"
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
            class="fill_width"
            size="small"
            v-else-if="newItem.type == 'monthDate'"
            v-model="formData[newItem.prop]"
            value-format="yyyyMM"
            format="yyyy-MM"
            style="width: 100%"
            :disabled="newItem.disabled"
            type="month"
            placeholder="选择月"
          >
          </el-date-picker>
          <el-date-picker
            class="fill_width"
            size="small"
            v-else-if="newItem.type == 'date'"
            v-model="formData[newItem.prop]"
            type="date"
            placeholder="选择日期"
            style="width: 100%"
            :disabled="newItem.disabled"
          />
          <el-autocomplete
            size="small"
            v-else-if="newItem.type=='autocomplete'"
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
            v-model="formData[newItem.prop]"
            v-else-if="newItem.type == 'switch'"
            :disabled="newItem.disabled"
            :active-color="newItem.activeColor"
            :inactive-color="newItem.inactiveColor"
            :active-value="newItem.activeValue"
            :inactive-value="newItem.inactiveValue"
          />
          <el-time-select
            style="width:100%"
            v-else-if="newItem.type == 'time'"
            v-model="formData[newItem.prop]"
            :picker-options="{
    start: '00:00',
    step: '00:15',
    end: '24:00'
  }"
            placeholder=""
          >
          </el-time-select>

          <el-checkbox
            v-else-if="newItem.type == 'checkbox'"
            v-model="formData[newItem.prop]"
          ></el-checkbox>
          <el-checkbox-group
            v-else-if="newItem.type == 'checkboxGroup'"
            v-for="(item2, index2) in newItem.checkbox"
            :key="index2"
            v-model="formData[newItem.prop]"
            :disabled="newItem.disabled"
          >
            <el-checkbox
              :label="newItem.label"
              name="type"
            />
          </el-checkbox-group>
          <el-radio-group
            v-else-if="newItem.type == 'radioGroupLabel'"
            v-model="formData[newItem.prop]"
          >
            <el-radio
              v-for="(item2, index2) in newItem.radioGroups"
              :key="index2"
              :label="item2.value"
            >{{ item2.label }}</el-radio>
          </el-radio-group>

          <el-radio-group
            v-else-if="newItem.type == 'radioGroupValue'"
            v-model="formData[newItem.prop]"
            :disabled="newItem.disabled"
          >
            <el-radio
              v-for="(item2, index2) in newItem.radioGroups"
              :key="index2"
              :label="item2.value"
            />
          </el-radio-group>
          <el-input
            v-model="formData[newItem.prop]"
            type="textarea"
            v-else-if="newItem.type == 'textarea'"
            :disabled="newItem.disabled"
          />
          <el-upload
            v-else-if="newItem.type == 'upload'"
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
        </el-col>
        </el-row>
      </el-form>
      <!-- <el-divider/> -->
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
      formData: {
        type: Object,
        default: function () {
          return {};
        },
      },
      formRules: {
        type: Object,
        default: function () {
          return {};
        },
      },
      //每行展示的列数
      initCol:{
        type:Number,
        default:4,
      },
      //栅格占据的列数
      colSpan:{
        type:Number,
        default:8,
      },
      //表单域标签的的宽度
      labelWidth:{
        type:String,
        default:'100px'
      },
      //单个文本框标签的的宽度
      labelWidthItem:{
        type:String,
        default:'100px'
      }
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
    watch: {
        formController: {
            handler: function (val, oldVal) {
                console.log('formController',this.formController)
                // this.row = this.formController.length <= 6 ? 0 : 1;
                this.rowNum = Math.ceil(this.formController.length /this.initCol ); // 有几行
                // this.tag = this.formController.length % 7;
                // this.col = 24 - 3 * this.tag;
                // this.col2 = 24 - 3 * this.tag;
                // if (this.formController.length == 7 || this.circle >= 2) {
                // this.isSpread = true;
                // this.tagRemark = 0;
                // }
            },
            // 深度观察监听
            immediate: true,
            deep: true,
        },
    },
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
  .comForm ::v-deep input[type="number"] {
    -moz-appearance: textfield;
  }
  .comForm ::v-deep .el-select {
    width: 100%;
  }
  </style>
  