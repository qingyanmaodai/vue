<!--菜单设置-->
<template>
  <div class="APSContainer" v-loading="adminLoading">
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
    <div>
      <div class="admin_content">
        <div class="ant-table-title">
          <el-row>
            <el-col :span="4"
              ><span class="title">{{ title }}</span></el-col
            >
            <el-col :span="20" class="flex_flex_end">
              <el-button type="primary" size="mini" @click="openDrawer"
                >新增异常</el-button
              >
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
            </el-col>
          </el-row>
        </div>
        <ComUmyTable
          :rowKey="'RowNumber'"
          :height="height"
          :tableData="tableData[0]"
          :tableHeader="tableColumns[0]"
          :tableLoading="tableLoading[0]"
          :remark="0"
          :sysID="sysID"
          :isEdit="true"
          :isClear="isClear[0]"
          :pagination="tablePagination[0]"
          @handleRowClick="handleRowClick"
          @pageChange="pageChange"
          @pageSize="pageSize"
          @sortChange="sortChange"
        />
      </div>
    </div>

    <el-drawer :title="drawerTitle" :visible.sync="dialogShow" direction="rtl">
      <div class="drawer_body">
        <el-form label-width="90px">
          <el-row>
            <el-col :span="24">
              <el-form-item label="类型" prop="">
                <el-radio-group v-model="Type" size="small">
                  <el-radio-button label="生产异常"></el-radio-button>
                  <el-radio-button label="达成异常"></el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-form
          v-show="Type == '生产异常'"
          :model="abnormalForm[0]"
          :rules="abnormalRules[0]"
          ref="abnormalForm"
          label-width="90px"
          class="demo-ruleForm"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item label="编码" prop="AbnormalCode">
                <el-input
                  v-model="abnormalForm[0].AbnormalCode"
                  type="text"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="异常名称" prop="AbnormalReason">
                <el-input
                  v-model="abnormalForm[0].AbnormalReason"
                  type="text"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="APS工序" prop="ProcessID">
                <el-select
                  ref="formRef"
                  v-model="abnormalForm[0].ProcessID"
                  clearable
                  filterable
                  multiple
                >
                  <el-option
                    v-for="(item, x) in processData"
                    :key="x"
                    :value="item.ProcessID"
                    :label="item.ProcessName"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="细分工序" prop="TinyProcessID">
                <el-select
                  ref="formRef"
                  v-model="abnormalForm[0].TinyProcessID"
                  clearable
                  filterable
                  multiple
                >
                  <el-option
                    v-for="(item, x) in tinyProcessData"
                    :key="x"
                    :value="item.TinyProcessID"
                    :label="item.TinyProcessName"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="备注" prop="Remark1">
                <el-input
                  v-model="abnormalForm[1].Remark1"
                  type="textarea"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-form
          v-show="Type == '达成异常'"
          :model="abnormalForm[1]"
          :rules="abnormalRules[1]"
          ref="abnormalForm2"
          label-width="90px"
          class="demo-ruleForm"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item label="编码" prop="AbnormalCode">
                <el-input
                  v-model="abnormalForm[1].AbnormalCode"
                  type="text"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="异常名称" prop="AbnormalReason">
                <el-input
                  v-model="abnormalForm[1].AbnormalReason"
                  type="text"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="大类" prop="BigType">
                <el-input
                  v-model="abnormalForm[1].BigType"
                  type="text"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="备注" prop="Remark1">
                <el-input
                  v-model="abnormalForm[1].Remark1"
                  type="textarea"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="drawer_footer">
        <el-button plain size="small" @click="dialogShow = false"
          >取消</el-button
        >
        <el-button
          type="primary"
          size="small"
          @click="sureAdd"
          :loading="sureLoading"
          >确认</el-button
        >
      </div>
    </el-drawer>
  </div>
</template>

<script>
var _this;
import ComSearch from "@/components/ComSearch";
import ComUmyTable from "@/components/ComUmyTable";
import ComFormDialog from "@/components/ComFormDialog";
import { GetHeader, GetSearchData, ExportData, SaveData } from "@/api/Common";
import { number } from "echarts/lib/export";
export default {
  name: "BadReasonInfo",
  components: {
    ComSearch,
    ComUmyTable,
    ComFormDialog,
  },
  data() {
    return {
      title: this.$route.meta.title,
      Type: "生产异常",
      sureLoading: false,
      drawerTitle: "新增异常原因",
      adminLoading: false,
      processData: [],
      tinyProcessData: [],
      abnormalForm: [
        {
          AbnormalReasonID: "",
          AbnormalCode: "",
          AbnormalReason: "",
          BigType: "生产",
          BadAbnormalType: 1,
          Remark1: "",
          dicID: 7779,
        },
        {
          AbnormalReasonID: "",
          AbnormalCode: "",
          AbnormalReason: "",
          BigType: "",
          BadAbnormalType: 2,
          Remark1: "",
          dicID: 7779,
        },
      ],
      abnormalRules: [
        {
          AbnormalReason: [
            { required: true, message: "异常名称为必填项", trigger: "blur" },
          ],
          AbnormalCode: [
            { required: true, message: "异常编码为必填项", trigger: "blur" },
          ],
        },
        {
          AbnormalReason: [
            { required: true, message: "异常名称为必填项", trigger: "blur" },
          ],
          AbnormalCode: [
            { required: true, message: "异常编码为必填项", trigger: "blur" },
          ],
        },
      ],
      ////////////////// Search /////////////////
      sysID: 7779,
      drawer: false,
      delData: [[]],
      formSearchs: [
        {
          datas: {},
          forms: [],
        },
      ],
      btnForm: [
        {
          ButtonCode: "save",
          BtnName: "保存",
          isLoading: false,
          Methods: "dataSave",
          Type: "success",
          Icon: "",
          Size: "small",
        },
        {
          ButtonCode: "delete",
          BtnName: "删除",
          isLoading: false,
          Methods: "dataDel",
          Type: "danger",
          Icon: "",
          Size: "small",
          Params: { dataName: "delData" },
        },
      ],
      tableData: [[]],
      tableColumns: [[]],
      tableLoading: [false],
      isClear: [false],
      tablePagination: [{ pageIndex: 1, pageSize: 50, pageTotal: 0 }],
      height: "707px",
      showPagination: true,
      tagRemark: 0,
      isLoading: false,
      //////////////新增弹框//////////////
      dialogShow: false,
    };
  },
  watch: {},
  created() {
    _this = this;
    this.getTinyProcessData();
    this.getProcessData();
    this.getTableHeader();
  },
  mounted() {
    setTimeout(() => {
      this.setHeight();
    }, 450);
  },
  methods: {
    // 获取细小工序
    async getTinyProcessData() {
      let form = {};
      form["rows"] = 0;
      form["dicID"] = 7774;
      let res = await GetSearchData(form);
      const { result, data, count, msg } = res.data;
      if (result) {
        this.tinyProcessData = data;
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
    },
    // 获取工序
    async getProcessData() {
      let form = {};
      form["rows"] = 0;
      form["dicID"] = 14;
      let res = await GetSearchData(form);
      const { result, data, count, msg } = res.data;
      if (result) {
        this.processData = data;
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
    },
    // 高度控制
    setHeight() {
      let headHeight = this.$refs.headRef.offsetHeight;

      let rem =
        document.documentElement.clientHeight -
        headHeight -
        this.$store.getters.reduceHeight;
      let newHeight = rem + "px";
      this.$set(this, "height", newHeight);
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
      this.$set(this.isClear, remarkTb, true);
      this.tablePagination[remarkTb].pageIndex = 1;
      this.getTableData(this.formSearchs[remarkTb].datas, remarkTb);
      setTimeout(() => {
        this.$set(this.isClear, remarkTb, false);
      });
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
      if (parms && parms.dataName) {
        if (this[parms.dataName][remarkTb].length == 0) {
          this.$message.error("请单击需要操作的数据！");
          return;
        } else {
          this[parms.dataName][remarkTb].forEach((x) => {
            let obj = x;
            obj["ElementDeleteFlag"] = 1;
            newData.push(obj);
          });
        }
      } else {
        this.tableData[remarkTb].forEach((y) => {
          let obj2 = y;
          obj2["ElementDeleteFlag"] = 1;
          newData.push(obj2);
        });
      }
      this.$confirm("确定要删除的【" + newData.length + "】数据吗？")
        .then((_) => {
          _this.$set(_this.btnForm[index], "isLoading", true);
          _this.dataSave(remarkTb, index, null, newData);
        })
        .catch((_) => {});
    },
    // 单击行
    handleRowClick(row, remarkTb) {
      this.delData[remarkTb] = [];
      this.delData[remarkTb].push(row);
    },
    // 保存
    async dataSave(remarkTb, index, parms) {
      this.adminLoading = true;
      let submitData = [];
      if (this.tableData[0].length != 0) {
        this.tableData[0].forEach((x) => {
          if (x.update) {
            let childrens = [];
            // 判断有没有新增的细小工序与工序的改动
            let ProcessIDTemporary = x.ProcessIDTemporary;
            let TinyProcessIDTemporary = x.TinyProcessIDTemporary;
            let newData1 = x.ProcessID.filter(
              (x3) => !ProcessIDTemporary.some((y) => y == x3)
            ); //新增
            let newData2 = ProcessIDTemporary.filter(
              (c) => !x.ProcessID.some((z) => c == z)
            ); //删除

            let newData3 = x.TinyProcessID.filter(
              (x1) => !TinyProcessIDTemporary.some((y1) => y1 == x1)
            ); //新增
            let newData4 = TinyProcessIDTemporary.filter(
              (c1) => !x.TinyProcessID.some((z1) => c1 == z1)
            ); //删除
            if (newData1.length != 0) {
              newData1.forEach((a) => {
                let obj1 = {};
                obj1["dicID"] = 7771;
                obj1["ProcessID"] = a;
                childrens.push(obj1);
              });
            }
            if (newData2.length != 0) {
              newData2.forEach((b) => {
                let newIndex2 = ProcessIDTemporary.findIndex((e) => e == b);
                let obj2 = {};
                obj2["dicID"] = 7771;
                obj2["ElementDeleteFlag"] = 1;
                obj2["AbnormalApsProcessID"] = parseInt(
                  x.AbnormalApsProcessID[newIndex2]
                );
                childrens.push(obj2);
              });
            }

            if (newData3.length != 0) {
              newData3.forEach((c) => {
                let obj3 = {};
                obj3["dicID"] = 7772;
                obj3["TinyProcessID"] = c;
                childrens.push(obj3);
              });
            }
            if (newData4.length != 0) {
              newData4.forEach((d) => {
                let obj4 = {};
                let newIndex4 = TinyProcessIDTemporary.findIndex((f) => f == d);
                obj4["dicID"] = 7772;
                obj4["ElementDeleteFlag"] = 1;
                obj4["AbnormalTinyProcessID"] = parseInt(
                  x.AbnormalTinyProcessID[newIndex4]
                );
                childrens.push(obj4);
              });
            }
            x["childrens"] = childrens;
            submitData.push(x);
          }
        });
      }
      debugger;
      if (submitData.length == 0) {
        this.$message.error("没有可提交的数据！");
        return;
      }
      let res = await SaveData(submitData);
      const { datas, forms, result, msg } = res.data;
      if (result) {
        this.adminLoading = false;
        this.$message({
          message: msg,
          type: "success",
          dangerouslyUseHTMLString: true,
        });
        this.dataSearch(remarkTb);
      } else {
        this.adminLoading = false;
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
    },
    // 获取表头数据
    async getTableHeader() {
      let IDs = [{ ID: this.sysID }];
      let res = await GetHeader(IDs);
      const { datas, forms, result, msg } = res.data;
      if (result) {
        // 获取每个表头
        datas.some((m, i) => {
          m.forEach((n) => {
            // 进行验证
            this.verifyDta(n);
            if (n.children && n.children.length != 0) {
              n.children.forEach((x) => {
                this.verifyDta(x);
              });
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
        this.getTableData(this.formSearchs[0].datas, 0);
      }
    },
    // 验证数据
    verifyDta(n) {
      for (let name in n) {
        if (
          (name == "component" && n[name]) ||
          (name == "button" && n[name]) ||
          (name == "active" && n[name])
        ) {
          n[name] = eval("(" + n[name] + ")");
        }
      }
    },
    // 获取表格数据
    async getTableData(form, remarkTb) {
      this.$set(this.tableLoading, remarkTb, true);
      form["rows"] = this.tablePagination[remarkTb].pageSize;
      form["page"] = this.tablePagination[remarkTb].pageIndex;
      let res = await GetSearchData(form);
      const { result, data, count, msg } = res.data;
      if (result) {
        if (data.length != 0) {
          data.forEach((x) => {
            if (x.ProcessID) {
              let ProcessIDString = JSON.parse(
                JSON.stringify(x.ProcessID)
              ).split(",");
              if (ProcessIDString.length != 0) {
                ProcessIDString.forEach((b) => {
                  b = String(b);
                });
              }
              this.$set(x, "ProcessID", ProcessIDString);
              this.$set(x, "ProcessIDTemporary", ProcessIDString);
            } else {
              this.$set(x, "ProcessID", []);
              this.$set(x, "ProcessIDTemporary", []);
            }
            if (x.TinyProcessID) {
              let TinyProcessIDString = JSON.parse(
                JSON.stringify(x.TinyProcessID)
              ).split(",");
              let TinyProcessIDString2 = [];
              if (TinyProcessIDString.length != 0) {
                TinyProcessIDString.forEach((a) => {
                  TinyProcessIDString2.push(parseInt(a));
                });
              }
              this.$set(x, "TinyProcessID", TinyProcessIDString2);
              this.$set(x, "TinyProcessIDTemporary", TinyProcessIDString2);
            } else {
              this.$set(x, "TinyProcessID", []);
              this.$set(x, "TinyProcessIDTemporary", []);
            }
          });
        }
        this.$set(this.tableData, remarkTb, data);
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
    // 点击新增菜单或按钮
    openDrawer() {
      this.dialogShow = true;
      this.$refs.abnormalForm.resetFields();
      this.$refs.abnormalForm2.resetFields();
    },
    // 弹框确定添加
    async sureAdd() {
      let submitData = [];
      if (this.Type == "生产异常") {
        // 工序和细小工序放进childrens
        let obj = this.abnormalForm[0];
        let newData1 = this.abnormalForm[0].ProcessID;
        let newData2 = this.abnormalForm[0].TinyProcessID;
        let childrens = [];
        if (newData1.length != 0) {
          newData1.forEach((x) => {
            let newObj = {};
            newObj["dicID"] = 7771;
            newObj["ProcessID"] = x;
            childrens.push(newObj);
          });
        }
        if (newData2.length != 0) {
          newData2.forEach((y) => {
            let newObj2 = {};
            newObj2["dicID"] = 7772;
            newObj2["TinyProcessID"] = y;
            childrens.push(newObj2);
          });
        }
        obj["childrens"] = childrens;
        submitData.push(obj);
      } else {
        submitData.push(this.abnormalForm[1]);
      }
      let res = await SaveData(submitData);
      const { result, data, count, msg } = res.data;
      if (result) {
        this.$message({
          message: msg,
          type: "success",
          dangerouslyUseHTMLString: true,
        });
        this.dialogShow = false;
        this.dataSearch(0);
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
        this.dialogShow = false;
      }
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
  },
};
</script>
