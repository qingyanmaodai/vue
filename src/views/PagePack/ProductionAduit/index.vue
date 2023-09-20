<!--特殊报工维护-->
<template>
  <div class="APSContainer" v-loading="adminLoading">
    <div class="admin_head" ref="headRef">
      <div v-for="(item, i) in 3" :key="i">
        <ComSearch
          v-show="labelStatus1 == i"
          ref="searchRef"
          :searchData="formSearchs[i].datas"
          :searchForm="formSearchs[i].forms"
          :remark="i"
          :signName="labelStatus1"
          :isLoading="isLoading"
          :btnForm="btnForm"
          @btnClick="btnClick"
        />
      </div>
    </div>
    <div>
      <div class="admin_content">
        <div class="ant-table-title">
          <el-row>
            <el-col :span="4"
              ><span class="title">{{ title }}</span></el-col
            >
            <el-col :span="20" class="flex_flex_end">
              <el-button
                type="primary"
                size="small"
                @click="openProduct"
                v-show="labelStatus1 == 0"
                >新增报工</el-button
              >
              <el-divider direction="vertical"></el-divider>
              <div v-for="(item, y) in Status1" :key="y">
                <span
                  @click="changeStatus(item, y)"
                  :class="labelStatus1 == y ? 'statusActive cursor' : 'cursor'"
                  >{{ item.label }}</span
                >
                <el-divider direction="vertical"></el-divider>
              </div>
            </el-col>
          </el-row>
        </div>
        <div v-for="(item2, i2) in 3" :key="i2">
          <ComUmyTable
            v-show="labelStatus1 == i2"
            :rowKey="'RowNumber'"
            :height="labelStatus1 == 2 ? height1 : height"
            :tableData="tableData[i2]"
            :tableHeader="tableColumns[i2]"
            :hasSelect="hasSelect[i2]"
            :tableLoading="tableLoading[i2]"
            :remark="i2"
            :sysID="sysID[i2].ID"
            :isClear="isClear[i2]"
            :isEdit="isEdit[i2]"
            :pagination="tablePagination[i2]"
            @handleRowClick="handleRowClick"
            @pageChange="pageChange"
            @pageSize="pageSize"
            @sortChange="sortChange"
            @selectfun="selectFun"
          />
        </div>
      </div>
    </div>
    <div
      :class="labelStatus1 === 2 ? 'footer2_content' : 'footer_content'"
      ref="footerRef"
    >
      <el-row>
        <el-col :span="22">
          <el-form label-width="100px">
            <el-form-item label="日期：" prop="ProducedDate">
              <el-input
                disabled
                v-model="currentRow[labelStatus1].ProducedDate"
                type="text"
                size="small"
              ></el-input>
            </el-form-item>
            <el-form-item label="拉线：" prop="LineName">
              <el-input
                disabled
                v-model="currentRow[labelStatus1].LineName"
                type="text"
                size="small"
              ></el-input>
            </el-form-item>
            <el-form-item
              v-show="labelStatus1 == 0"
              label="人员："
              prop="UserPeople"
            >
              <el-select
                clearable
                filterable
                :multiple="multiple"
                v-model="currentRow[labelStatus1].UserPeople"
                size="small"
                style="width: 100%"
              >
                <el-option
                  v-for="(item, i) in userData"
                  :key="i"
                  :label="item.Name"
                  :value="item.Account"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              v-show="labelStatus1 == 2"
              label="人员："
              prop="Peoples"
            >
              <el-input
                v-model="currentRow[labelStatus1].Peoples"
                size="small"
                readonly
                type="text"
                @click.native="clickDialog"
                class="presonDialog"
              ></el-input>
            </el-form-item>
            <el-form-item
              v-show="labelStatus1 == 1"
              label="人员："
              prop="Peoples"
            >
              <el-input
                v-model="currentRow[labelStatus1].Peoples"
                size="small"
                disabled
                type="text"
              ></el-input>
            </el-form-item>
            <el-form-item label="提报人：" prop="ModifiedByName">
              <el-input
                disabled
                v-model="currentRow[labelStatus1].ModifiedByName"
                type="text"
                size="small"
                style="width: 100%"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="代码："
              prop="MaterialName"
              v-show="labelStatus1 == 0 || labelStatus1 == 1"
            >
              <el-input
                disabled
                v-model="currentRow[labelStatus1].MaterialName"
                type="text"
                size="small"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="代码："
              prop="MaterialName"
              v-show="labelStatus1 == 2"
            >
              <el-autocomplete
                size="small"
                style="width: 100%"
                v-model="currentRow[labelStatus1].MaterialName"
                :fetch-suggestions="fetchsuggertions"
                @select="getEditProData"
              >
                <template slot-scope="{ item }">
                  <div style="border-bottom: 1px dashed #8c8e8e">
                    <el-form label-width="60px" inline>
                      <el-form-item
                        style="margin-bottom: 5px"
                        label="产品名称："
                        ><span style="color: orange">{{
                          item.MaterialName
                        }}</span>
                      </el-form-item>
                      <el-form-item style="margin-bottom: 5px" label="工艺："
                        ><span style="color: orange">{{
                          item.ProcessGroupName
                        }}</span>
                      </el-form-item>
                    </el-form>
                  </div>
                </template>
              </el-autocomplete>
            </el-form-item>
            <el-form-item
              label="二级工序："
              prop="ProcessName"
              v-show="labelStatus1 == 2"
              style="width: 40%"
            >
              <el-select
                id="multipleSelct"
                style="width: 100%"
                clearable
                filterable
                multiple
                v-model="currentRow[labelStatus1].ProcessName"
                size="small"
                @change="processChang"
              >
                <el-option
                  v-for="(item, i) in LevelTwoProcessList"
                  :key="i"
                  :label="item.LevelTwoProcessName"
                  :value="item.LevelTwoProcessName"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="计划数："
              v-show="labelStatus1 == 0"
              prop="PlanQty"
            >
              <el-input
                disabled
                v-model="currentRow[labelStatus1].PlanQty"
                type="text"
                size="small"
                clearable
              ></el-input>
            </el-form-item>

            <el-form-item label="报工数：" prop="ProducedQty">
              <el-input
                :disabled="tag == 1"
                v-model="currentRow[labelStatus1].ProducedQty"
                type="text"
                size="small"
                clearable
              ></el-input>
            </el-form-item>

            <el-form-item
              label="确认数："
              prop="ConfirmQty"
              v-show="labelStatus1 == 1 || labelStatus1 == 2"
            >
              <el-input
                v-model="currentRow[labelStatus1].ConfirmQty"
                type="text"
                size="small"
                clearable
              ></el-input>
            </el-form-item>

            <el-form-item label="计时：" prop="TotalHours">
              <el-input
                :disabled="tag == 1"
                v-model="currentRow[labelStatus1].TotalHours"
                type="text"
                size="small"
                clearable
              ></el-input>
            </el-form-item>

            <el-form-item
              label="确认计时："
              prop="ConfirmTotalHours"
              v-show="labelStatus1 == 1 || labelStatus1 == 2"
            >
              <el-input
                v-model="currentRow[labelStatus1].ConfirmTotalHours"
                type="text"
                size="small"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item
              label="长度："
              prop="ProductLength"
              v-show="labelStatus1 == 2"
            >
              <el-input
                v-model="currentRow[labelStatus1].ProductLength"
                type="text"
                size="small"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item
              label="集体备注："
              prop="Extend1"
              v-show="
                currentRow[labelStatus1].OrganizeType === '集体' &&
                labelStatus1 == 2
              "
            >
              <el-input
                v-model="currentRow[labelStatus1].Extend1"
                type="text"
                size="small"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item
              label="个人备注："
              prop="Extend2"
              v-show="
                currentRow[labelStatus1].OrganizeType === '个人' &&
                labelStatus1 == 2
              "
            >
              <el-input
                v-model="currentRow[labelStatus1].Extend2"
                type="text"
                size="small"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item
              label="补备注："
              prop="Remark1"
              v-show="labelStatus1 == 0 || labelStatus1 == 1"
            >
              <el-input
                v-model="currentRow[labelStatus1].Remark2"
                type="text"
                size="small"
                clearable
              ></el-input>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="2">
          <el-button
            type="primary"
            v-show="labelStatus1 == 0"
            @click="setProduction"
            >报工</el-button
          >
          <el-button type="primary" v-show="labelStatus1 == 1" @click="setAduit"
            >审批</el-button
          >
          <el-button
            type="primary"
            v-show="labelStatus1 == 2"
            @click="saveProduction"
            >保存</el-button
          >
        </el-col>
      </el-row>
    </div>

    <el-dialog title="新增报工" width="30%" :visible.sync="dialogProduct">
      <div>
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
          @submit.native.prevent
        >
          <el-form-item label="报工日期：" prop="ProducedDate">
            <el-date-picker
              style="width: 100%"
              v-model="ruleForm.ProducedDate"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="报工日期"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="线别：" prop="LineName">
            <el-select
              style="width: 100%"
              clearable
              filterable
              v-model="ruleForm.LineName"
              size="small"
              @change="changeLine"
            >
              <el-option
                v-for="(item2, i) in lines"
                :key="i"
                :label="item2.OrganizeName"
                :value="item2.OrganizeID"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="产品：" prop="MaterialName">
            <el-autocomplete
              size="small"
              style="width: 100%"
              v-model="ruleForm.MaterialName"
              :fetch-suggestions="fetchsuggertions"
              @select="getRemote"
            >
              <template slot-scope="{ item }">
                <div style="border-bottom: 1px dashed #8c8e8e">
                  <el-form label-width="100px" inline>
                    <el-form-item style="margin-bottom: 5px" label="产品名称："
                      ><span style="color: orange">{{
                        item.MaterialName
                      }}</span>
                    </el-form-item>
                    <el-form-item style="margin-bottom: 5px" label="工艺："
                      ><span style="color: orange">{{
                        item.ProcessGroupName
                      }}</span>
                    </el-form-item>
                  </el-form>
                </div>
              </template>
            </el-autocomplete>
          </el-form-item>
          <el-form-item label="生产人员：" prop="UserPeople">
            <el-select
              style="width: 100%"
              clearable
              filterable
              :multiple="multiple_2"
              v-model="ruleForm.UserPeople"
              size="small"
            >
              <el-option
                v-for="(item2, i) in userData"
                :key="i"
                :label="item2.Name"
                :value="item2.Account"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="二级工序：" prop="LevelTwoProcessID">
            <el-select
              style="width: 100%"
              clearable
              filterable
              v-model="ruleForm.LevelTwoProcessID"
              size="small"
            >
              <el-option
                v-for="(item, i) in LevelTwoProcessList"
                :key="i"
                :label="item.LevelTwoProcessName"
                :value="item.LevelTwoProcessID"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="报工数量：" prop="ProducedQty">
            <el-input
              style="width: 100%"
              type="number"
              v-model="ruleForm.ProducedQty"
              size="small"
            ></el-input>
          </el-form-item>
          <el-form-item label="计时：" prop="TotalHours">
            <el-input
              style="width: 100%"
              type="number"
              v-model="ruleForm.TotalHours"
              size="small"
            ></el-input>
          </el-form-item>
          <el-form-item label="备注：" prop="Remark3">
            <el-input
              style="width: 100%"
              type="textarea"
              v-model="ruleForm.Remark3"
              size="small"
              maxlength="500"
              placeholder="限制500字符"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogProduct = false">取 消</el-button>
        <el-button type="primary" @click="sureAdd">确定</el-button>
      </div>
    </el-dialog>

    <!-- 人员的选择 -->
    <el-dialog title="修改人员" width="50%" :visible.sync="dialogPreson">
      <el-table
        ref="multipleTable"
        :data="userData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        :highlight-current-row="!multiple"
        @current-change="handleCurrentChange"
      >
        <el-table-column type="selection" width="55" v-if="multiple">
        </el-table-column>
        <el-table-column prop="OrganizeName" label="组织" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="Name" label="姓名" width="120">
        </el-table-column>
      </el-table>
      <div style="margin-top: 20px">
        <el-button @click.native="toggleSelection(false)">取消</el-button>
        <el-button @click.native="toggleSelection(true)">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
var _this;
import ComSearch from "@/components/ComSearch";
import ComUmyTable from "@/components/ComUmyTable";
import {
  GetHeader,
  GetSearchData,
  ExportData,
  GetSearch,
  SaveData,
} from "@/api/Common";
import { OneStepReleaseByOrder } from "@/api/PageSale";
import { Row } from "element-ui";
export default {
  name: "ProductionAduit",
  components: {
    ComSearch,
    ComUmyTable,
  },
  data() {
    return {
      TwoLevelProceData: [],
      dialogPreson: false,
      multipleSelection: [],
      height1: "707px",
      LevelTwoProcessList: [], //二级工序集合
      ProcessID: "",
      ruleForm: {
        ProcessID: "",
        ProducedDate: "",
        ProducedQty: "",
        dicID: 6704,
        Status: 2,
        LineID: "",
        LineName: "",
        ConfirmQty: "",
        MaterialID: "",
        MaterialName: "",
        UserPeople: "",
        ProcessGroupName: "",
        childrens: [],
        TotalHours: "",
        Remark3: "", //新增报工备注
        LevelTwoProcessID: "", //二级工序id
      },
      rules: {
        ProducedDate: [
          { required: true, message: "报工日期必填", trigger: "change" },
        ],
        MaterialName: [
          { required: true, message: "产品名称必填", trigger: "change" },
        ],
        LineName: [
          { required: true, message: "线别名称必填", trigger: "change" },
        ],
        UserPeople: [
          { required: true, message: "生产人员称必填", trigger: "change" },
        ],
        // ProducedQty: [
        //   { required: true, message: "报工数量必填", trigger: "blur" },
        // ],
      },
      ////////////////// Search /////////////////
      multiple: true,
      title: this.$route.meta.title,
      drawer: false,
      tag: 0,
      userData: [],
      formSearchs: [
        {
          datas: {},
          forms: [],
        },
        {
          datas: {},
          forms: [],
        },
        {
          datas: {},
          forms: [],
        },
      ],
      sysID: [{ ID: 6720 }, { ID: 6704 }, { ID: 6704 }],
      btnForm: [],
      parmsBtn: [
        {
          ButtonCode: "save",
          BtnName: "批量审批",
          Type: "success",
          Ghost: true,
          Size: "small",
          Methods: "aduitMoreData",
          Icon: "",
          Params: "",
          signName: "1",
        },
      ],
      tableData: [[], []],
      tableColumns: [[], []],
      tableLoading: [false, false],
      isClear: [false, false],
      tablePagination: [
        { pageIndex: 1, pageSize: 200, pageTotal: 0 },
        { pageIndex: 1, pageSize: 200, pageTotal: 0 },
        { pageIndex: 1, pageSize: 200, pageTotal: 0 },
      ],
      height: "707px",
      showPagination: true,
      tagRemark: 0,
      isLoading: false,
      labelStatus1: 0,
      Status1: [
        { label: "报工", value: 0 },
        { label: "审批", value: 1 },
        { label: "更改报工", value: 2 },
      ],
      isSelect: false,
      adminLoading: false,
      selectionData: [[], [], []],
      currentRow: [{}, {}, {}],
      lines: [],
      userInfo: {},
      dialogProduct: false,
      hasSelect: [false, true, false],
      multiple_2: false,
      isEdit: [true, false, false],
    };
  },
  watch: {},
  created() {
    _this = this;
    this.userInfo = this.$store.getters.userInfo;
    this.getTableHeader();
    this.getLineData();
    this.adminLoading = true;
    this.judgeBtn();
  },
  mounted() {
    setTimeout(() => {
      this.setHeight();
    }, 450);
  },
  methods: {
    // 人员类型为个人时单选
    handleCurrentChange(row) {
      this.multipleSelection = [row];
    },
    // 二级工序改变
    processChang(val) {
      if (val && val.length) {
        this.$set(
          this.currentRow[this.labelStatus1],
          "LevelTwoProcessName",
          val.join(",")
        );
      } else {
        this.$set(
          this.currentRow[this.labelStatus1],
          "LevelTwoProcessName",
          ""
        );
      }
    },
    // 点击人员弹框
    clickDialog() {
      // this.multipleSelection = []
      if (this.multipleSelection.length) {
        _this.$refs.multipleTable.clearSelection();
      }
      if (this.currentRow[this.labelStatus1]["OrganizeID"]) {
        this.dialogPreson = true;

        if (this.currentRow[this.labelStatus1]["UserPeople"]) {
          let list =
            this.currentRow[this.labelStatus1]["UserPeople"].split(",");
          if (this.multiple) {
            this.$nextTick(() => {
              this.userData.forEach((item) => {
                list.forEach((ele) => {
                  if (item.Name === ele) {
                    _this.$refs.multipleTable.toggleRowSelection(item);
                  }
                });
              });
            });
          } else {
            this.$nextTick(() => {
              this.userData.forEach((item) => {
                if (item.Name === list[0]) {
                  _this.$refs.multipleTable.setCurrentRow(item);
                }
              });
            });
          }
        }
        // this.currentRow[this.labelStatus1], "UserPeople"
      }
    },
    //确定选项
    toggleSelection(status) {
      let list = [];
      if (status) {
        if (this.multipleSelection.length) {
          this.multipleSelection.forEach((item) => {
            list.push(item.Name);
          });
        }
        this.$set(
          this.currentRow[this.labelStatus1],
          "Peoples",
          list.join(",")
        );
        this.$set(
          this.currentRow[this.labelStatus1],
          "UserPeople",
          list.join(",")
        );
      }
      this.dialogPreson = false;
    },
    //获取选中的人员
    handleSelectionChange(selection) {
      this.multipleSelection = selection;
    },
    // 获取线别
    async getLineData() {
      let form = {};
      form["rows"] = 0;
      form["dicID"] = 3026;
      form["OrganizeTypeID"] = 6;
      this.adminLoading = true;
      let res = await GetSearchData(form);
      const { result, data, count, msg } = res.data;
      if (result) {
        this.lines = data;
        this.adminLoading = false;
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
        this.adminLoading = false;
      }
    },
    async getUserData(OrganizeID) {
      this.userData = [];
      let form = {};
      form["rows"] = 0;
      form["dicID"] = 3007;
      form["OrganizeID"] = OrganizeID;
      form["OrganizeTypeID"] = 6;
      let res = await GetSearchData(form);
      const { result, data, count, msg } = res.data;
      if (result) {
        this.userData = data;
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
    },
    // 判断按钮权限
    judgeBtn() {
      let routeBtn = this.$route.meta.btns;
      let newBtn = [];
      let permission = false;
      if (routeBtn.length != 0) {
        routeBtn.forEach((x) => {
          if (x.ButtonCode == "edit") {
            permission = true;
          }
          let newData = this.parmsBtn.filter((y) => {
            return x.ButtonCode == y.ButtonCode;
          });
          if (newData.length != 0) {
            newBtn = newBtn.concat(newData);
          }
        });
      }
      this.$set(this, "btnForm", newBtn);
    },
    // 高度控制
    setHeight() {
      let headHeight = this.$refs.headRef.offsetHeight;
      let footerHeight = this.$refs.footerRef.offsetHeight;

      let rem =
        document.documentElement.clientHeight -
        footerHeight -
        headHeight -
        this.$store.getters.reduceHeight;
      let newHeight = rem + 20 + "px";
      this.height1 = rem - 50 + "px";
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
    // 选择数据
    selectFun(data, remarkTb, row) {
      this.selectionData[remarkTb] = data;
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
      this.formSearchs[remarkTb].datas["ProductionStatus"] =
        this.Status1[this.labelStatus1].value;
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
    // 获取表头数据
    async getTableHeader() {
      let IDs = this.sysID;
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
        this.formSearchs[1].datas["ApprovalStatus"] = "过期";
        this.adminLoading = false;
        // this.getTableData(this.formSearchs[0].datas, 0);
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
          data.forEach((a) => {
            let newTinyProcessData = [];
            if (a.TinyProcesss) {
              let TinyProcessData = a.TinyProcesss.split(",");
              TinyProcessData.forEach((b) => {
                newTinyProcessData.push({ label: b, value: b });
              });
              this.$set(a, "newTinyProcessList", newTinyProcessData);
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
    ////////////////其他事件///////////////
    // 改变状态
    changeStatus(item, index) {
      this.labelStatus1 = index;
      if (index == 0) {
        this.title = "计划列表";
      } else if (index == 1) {
        this.title = "审核超期列表";
      } else if (index == 2) {
        this.title = "报工列表";
      }
      // if (this.tableData[index].length == 0) {
      //   this.dataSearch(index);
      // }
    },
    // 单击
    async handleRowClick(row) {
      // 获取线下面的人
      // 判断是集体还是个人
      let newRow = this.lines.filter((x) => {
        return x.OrganizeID == row.LineID;
      });
      if (newRow[0]["OrganizeID"]) {
        this.$set(
          this.currentRow[this.labelStatus1],
          "OrganizeID",
          newRow[0].OrganizeID
        );
        await this.getUserData(newRow[0].OrganizeID);
      }
      if (newRow[0].OrganizeType == "集体") {
        this.multiple = true;
      } else {
        this.multiple = false;
      }
      if (this.labelStatus1 == 0) {
        this.tag = 0;
        this.$set(this.currentRow[this.labelStatus1], "UserPeople", null);
        this.currentRow[this.labelStatus1]["ModifiedByName"] =
          this.userInfo.Name;
        this.currentRow[this.labelStatus1]["ModifiedBy"] =
          this.userInfo.Account;
        for (let name in row) {
          this.$set(this.currentRow[this.labelStatus1], name, row[name]);
        }
        this.$set(
          this.currentRow[this.labelStatus1],
          "ProducedDate",
          row.PlanDay
        );
        this.$set(this.currentRow[this.labelStatus1], "dicID", 6704);
        this.$set(this.currentRow[this.labelStatus1], "Status", 2);
        this.$set(this.currentRow[this.labelStatus1], "ProducedQty", null);
      } else if (this.labelStatus1 == 1) {
        this.tag = 1;
        this.currentRow[this.labelStatus1]["ModifiedByName"] =
          this.userInfo.Name;
        for (let name in row) {
          this.$set(this.currentRow[this.labelStatus1], name, row[name]);
        }
        this.$set(this.currentRow[this.labelStatus1], "ConfirmQty", null);
        this.$set(this.currentRow[this.labelStatus1], "dicID", 6704);
        this.$set(this.currentRow[this.labelStatus1], "Status", 2);
      } else if (this.labelStatus1 == 2) {
        this.tag = 2;
        for (let name in row) {
          this.$set(this.currentRow[this.labelStatus1], name, row[name]);
        }
        this.$set(this.currentRow[this.labelStatus1], "dicID", 6704);
        await this.getLevelTwoProcessData(row.ProcessID);
        await this.getTwoLevelProceData(row.ID);
        this.currentRow[this.labelStatus1]["ModifiedByName"] =
          this.userInfo.Name;
        this.currentRow[this.labelStatus1]["ModifiedBy"] =
          this.userInfo.Account;
        this.$set(
          this.currentRow[this.labelStatus1],
          "UserPeople",
          row.Peoples
        );
        this.$set(
          this.currentRow[this.labelStatus1],
          "ProcessName",
          row.LevelTwoProcessName ? row.LevelTwoProcessName.split(",") : []
        );
        this.$set(
          this.currentRow[this.labelStatus1],
          "LevelTwoProcessName",
          row.LevelTwoProcessName
        );
      }
    },
    // 报工
    setProduction() {
      if (this.multiple) {
        if (
          this.currentRow[0].UserPeople.length == 0 ||
          parseFloat(this.currentRow[0].ProducedQty > 0)
        ) {
          this.$message.error("请检查报工人员与报工数是否填写！");
          return;
        }
      } else {
        if (
          !this.currentRow[0].UserPeople ||
          parseFloat(this.currentRow[0].ProducedQty > 0)
        ) {
          this.$message.error("请检查报工人员与报工数是否填写！");
          return;
        }
      }

      this.$confirm("确定提交吗？")
        .then(() => {
          let childrens = [];
          if (_this.multiple) {
            _this.currentRow[0].UserPeople.forEach((y) => {
              let obj = {};
              obj["ProducedQty"] = _this.currentRow[0]["ProducedQty"];
              obj["ConfirmQty"] = _this.currentRow[0]["ProducedQty"];
              obj["TotalHours"] = _this.currentRow[0]["TotalHours"];
              obj["ConfirmTotalHours"] = _this.currentRow[0]["TotalHours"];
              obj["dicID"] = 6710;
              obj["Status"] = 2;
              obj["Account"] = y;
              if (_this.currentRow[0].newTinyProcessData) {
                obj["Remark2"] =
                  _this.currentRow[0].newTinyProcessData.join(",");
              }
              childrens.push(obj);
            });
          } else {
            let obj2 = {};
            obj2["ProducedQty"] = _this.currentRow[0]["ProducedQty"];
            obj2["ConfirmQty"] = _this.currentRow[0]["ProducedQty"];
            obj2["TotalHours"] = _this.currentRow[0]["TotalHours"];
            obj2["ConfirmTotalHours"] = _this.currentRow[0]["TotalHours"];
            obj2["dicID"] = 6710;
            obj2["Status"] = 2;
            obj2["Account"] = _this.currentRow[0].UserPeople;
            if (_this.currentRow[0].newTinyProcessData) {
              obj2["Remark2"] =
                _this.currentRow[0].newTinyProcessData.join(",");
            }
            childrens.push(obj2);
          }
          _this.$set(
            _this.currentRow[0],
            "ConfirmQty",
            _this.currentRow[0]["ProducedQty"]
          );
          _this.$set(
            _this.currentRow[0],
            "ConfirmTotalHours",
            _this.currentRow[0]["TotalHours"]
          );
          _this.$set(_this.currentRow[0], "childrens", childrens);
          let submitData = [];
          submitData.push(_this.currentRow[0]);
          _this.dataSave(submitData, 0);
        })
        .catch(() => {});
    },
    // 批量审批
    aduitMoreData() {
      if (this.selectionData[1].length != 0) {
        this.selectionData[1].forEach((a) => {
          a.Status = 2;
          a.ConfirmQty = a.ProducedQty;
          a.ConfirmTotalHours = a.TotalHours;
        });
        _this.dataSave(this.selectionData[1], 1);
      } else {
        this.$message.error("请勾选需要批量审批的数据！");
      }
    },
    // 审批
    setAduit() {
      if (
        !this.currentRow[1].ConfirmQty &&
        !this.currentRow[1].ConfirmTotalHours
      ) {
        this.$message.error("请检查是否填写了确认值！");
        return;
      }
      this.$confirm("确定提交吗？")
        .then(() => {
          let submitData = [];
          _this.currentRow[1].Status = 2;
          submitData.push(_this.currentRow[1]);
          _this.dataSave(submitData, 1);
        })
        .catch(() => {});
    },
    // 保存数据
    async dataSave(submitData, index) {
      this.adminLoading = true;
      let res = await SaveData(submitData);
      const { result, data, count, msg } = res.data;
      if (result) {
        this.adminLoading = false;
        this.$message({
          message: msg,
          type: "success",
          dangerouslyUseHTMLString: true,
        });
        if (index == 2) {
          _this.dataSearch(0);
          for (var name in this.ruleForm) {
            this.$set(this.ruleForm, name, "");
          }
          return;
        }
        console.log("index", index);
        _this.dataSearch(index);
        for (var name in this.currentRow[index]) {
          this.$set(this.currentRow[index], name, "");
        }
      } else {
        this.adminLoading = false;
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
    },
    // 新增报工
    openProduct() {
      this.dialogProduct = true;
    },
    // 确定新增
    sureAdd() {
      _this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          this.$confirm("确定新增吗？")
            .then(() => {
              if (!_this.ruleForm.ProcessGroupName) {
                _this.$message.error("该产品没用工艺，请先配置工艺再选择！");
              } else if (!_this.ruleForm.MaterialID) {
                _this.$message.error("该产品无效！");
              } else if (!_this.ruleForm.LineID) {
                _this.$message.error("该线别无效！");
              } else {
                if (!this.ruleForm.ProducedQty && !this.ruleForm.TotalHours) {
                  this.$message.error("报工数和计时数必填一个！");
                  return;
                }
                let childrens = [];
                let TotalHours = "";
                if (this.ruleForm.TotalHours) {
                  TotalHours =
                    this.ruleForm.TotalHours / _this.ruleForm.UserPeople.length;
                }
                _this.ruleForm.UserPeople.forEach((y) => {
                  let obj = {};
                  obj["ProducedQty"] = _this.ruleForm["ProducedQty"];
                  obj["ConfirmQty"] = _this.ruleForm["ProducedQty"];
                  obj["TotalHours"] = TotalHours;
                  obj["ConfirmTotalHours"] = TotalHours;
                  obj["dicID"] = 6710;
                  obj["Status"] = 2;
                  obj["Account"] = y;
                  childrens.push(obj);
                });
                _this.ruleForm.ProcessID = _this.ProcessID;
                _this.ruleForm.dicID = 6704;
                _this.ruleForm.Status = 2;
                _this.ruleForm.ConfirmQty = _this.ruleForm["ProducedQty"];
                _this.ruleForm.ConfirmTotalHours = _this.ruleForm["TotalHours"];
                _this.ruleForm.childrens = childrens;
                let submitData = [];
                submitData.push(_this.ruleForm);
                _this.dataSave(submitData, 2);
                _this.dialogProduct = false;
              }
            })
            .catch(() => {});
        }
      });
    },
    // 远程搜索
    async fetchsuggertions(val, cb) {
      if (val) {
        let form = {};
        form["rows"] = 100;
        form["dicID"] = 1180;
        form["ProcessID"] =
          this.labelStatus1 == 2
            ? this.currentRow[this.labelStatus1]["ProcessID"]
            : this.ProcessID;
        form["MaterialName"] = val;
        let res = await GetSearch(form, "/APSAPI/SearchMaterialByLine");
        const { result, data, count, msg } = res.data;
        if (result) {
          cb(data);
        } else {
          this.$message({
            message: msg,
            type: "error",
            dangerouslyUseHTMLString: true,
          });
        }
      }
    },
    // 获取远程搜索数据
    getRemote(item) {
      this.ruleForm.MaterialID = item.MaterialID;
      this.ruleForm.MaterialName = item.MaterialName;
      this.ruleForm.ProcessGroupName = item.ProcessGroupName;
    },
    // 更改报工栏获取远程搜索数据
    getEditProData(item) {
      this.currentRow[this.labelStatus1]["MaterialID"] = item.MaterialID;
      this.currentRow[this.labelStatus1]["MaterialName"] = item.MaterialName;
      this.currentRow[this.labelStatus1]["ProcessGroupName"] =
        item.ProcessGroupName;
    },
    // 选中线别
    async changeLine(val) {
      if (val) {
        let newObj = this.lines.filter((x) => {
          return x.OrganizeID == val;
        });
        this.ruleForm.LineID = newObj[0].OrganizeID;
        if (newObj[0].OrganizeType == "集体") {
          this.multiple_2 = true;
        } else {
          this.multiple_2 = true;
        }
        this.getUserData(newObj[0].OrganizeID);
        // 获取线别的工序
        let form = {};
        form["OrganizeID"] = newObj[0].OrganizeID;
        form["dicID"] = 3026;
        let res = await GetSearchData(form);
        const { result, data, count, msg } = res.data;
        if (result) {
          let ProcessIDs = data[0].ProcessIDs;
          let ProcessID = [];
          if (ProcessIDs) {
            ProcessID = ProcessIDs.split(",");
          }
          this.ProcessID = ProcessID[0];
          // 获取二级工序
          this.getLevelTwoProcessData(this.ProcessID);
        } else {
          this.$message({
            message: msg,
            type: "error",
            dangerouslyUseHTMLString: true,
          });
        }
      } else {
        this.ruleForm.LineID = "";
      }
    },
    //通过线别工序获取二级工序
    async getLevelTwoProcessData(ProcessID) {
      this.LevelTwoProcessList = [];
      let form = {};
      form["dicID"] = 7900;
      form["ProcessID"] = ProcessID;
      let res = await GetSearchData(form);
      const { result, data, count, msg } = res.data;
      if (result) {
        this.LevelTwoProcessList = data;
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
    },
    // 更改报工工序查询
    async getTwoLevelProceData(ID) {
      let form = {};
      form["dicID"] = 6710;
      form["ID"] = ID;
      form["rows"] = 0;
      let res = await GetSearchData(form);
      const { result, data, count, msg } = res.data;
      if (result) {
        console.log("data", data);
        this.TwoLevelProceData = data;
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
    },
    // 更改报工工序保存
    async saveProceData(ProcessNames) {
      if (this.TwoLevelProceData.length) {
        this.TwoLevelProceData.forEach((item) => {
          item.Remark2 = ProcessNames;
        });
        let res = await SaveData(this.TwoLevelProceData);
        const { result, data, count, msg } = res.data;
        if (result) {
          console.log("data", data);
          if (data.length) {
            data.forEach((item) => {
              item.Remark2 = ProcessNames;
            });
          }
          this.dataSearch(2);
          for (var name in this.currentRow[2]) {
            this.$set(this.currentRow[2], name, "");
          }
        } else {
          this.$message({
            message: msg,
            type: "error",
            dangerouslyUseHTMLString: true,
          });
        }
      }
    },
    // 修改报工
    saveProduction() {
      var date = new Date();
      //获取1天前的日期
      var time1 = new Date(date.getTime() - 24 * 60 * 60 * 1000);
      var year1 = time1.getFullYear();
      var month1 = time1.getMonth() + 1;
      if (month1 < 10) {
        month1 = "0" + month1;
      }
      var day1 = time1.getDate();
      if (day1 < 10) {
        day1 = "0" + day1;
      }
      var date1 = year1 + "-" + month1 + "-" + day1;

      // //获取2天前的日期
      var time2 = new Date(date.getTime() - 2 * 24 * 60 * 60 * 1000);
      var year2 = time2.getFullYear();
      var month2 = time2.getMonth() + 1;
      if (month2 < 10) {
        month2 = "0" + month2;
      }
      var day2 = time2.getDate();
      if (day2 < 10) {
        day2 = "0" + day2;
      }
      var date2 = year2 + "-" + month2 + "-" + day2;

      //获取3天前的日期
      var time3 = new Date(date.getTime() - 3 * 24 * 60 * 60 * 1000);
      var year3 = time3.getFullYear();
      var month3 = time3.getMonth() + 1;
      if (month3 < 10) {
        month3 = "0" + month3;
      }
      var day3 = time3.getDate();
      if (day3 < 10) {
        day3 = "0" + day3;
      }
      var date3 = year3 + "-" + month3 + "-" + day3;

      //获取4天前的日期
      var time4 = new Date(date.getTime() - 4 * 24 * 60 * 60 * 1000);
      var year4 = time4.getFullYear();
      var month4 = time4.getMonth() + 1;
      if (month4 < 10) {
        month4 = "0" + month4;
      }
      var day4 = time4.getDate();
      if (day4 < 10) {
        day4 = "0" + day4;
      }
      var date4 = year4 + "-" + month4 + "-" + day4;

      //获取5天前的日期
      var time5 = new Date(date.getTime() - 5 * 24 * 60 * 60 * 1000);
      var year5 = time5.getFullYear();
      var month5 = time5.getMonth() + 1;
      if (month5 < 10) {
        month5 = "0" + month5;
      }
      var day5 = time5.getDate();
      if (day5 < 10) {
        day5 = "0" + day5;
      }
      var date5 = year5 + "-" + month5 + "-" + day5;

      //获取6天前的日期
      var time6 = new Date(date.getTime() - 6 * 24 * 60 * 60 * 1000);
      var year6 = time6.getFullYear();
      var month6 = time6.getMonth() + 1;
      if (month6 < 10) {
        month6 = "0" + month6;
      }
      var day6 = time6.getDate();
      if (day6 < 10) {
        day6 = "0" + day6;
      }
      var date6 = year6 + "-" + month6 + "-" + day6;

      //获取7天前的日期
      var time7 = new Date(date.getTime() - 7 * 24 * 60 * 60 * 1000);
      var year7 = time7.getFullYear();
      var month7 = time7.getMonth() + 1;
      if (month7 < 10) {
        month7 = "0" + month7;
      }
      var day7 = time7.getDate();
      if (day7 < 10) {
        day7 = "0" + day7;
      }
      var date7 = year7 + "-" + month7 + "-" + day7;

      //获取当天的日期
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      if (month < 10) {
        month = "0" + month;
      }
      var day = date.getDate();
      if (day < 10) {
        day = "0" + day;
      }
      var date0 = year + "-" + month + "-" + day;
      var date5 = year5 + "-" + month5 + "-" + day5;
      var date6 = year6 + "-" + month6 + "-" + day6;
      var date7 = year7 + "-" + month7 + "-" + day7;
      //只能修改T-7天的报工数据
      let list = [date6, date5, date4, date3, date2, date1, date0];
      if (!list.includes(this.currentRow[this.labelStatus1]["ProducedDate"])) {
        this.$message.error(
          "只能修改日期范围为" + date6 + " ~ " + date0 + "的报工数据！"
        );
        return;
      }

      if (this.multiple) {
        if (
          !this.currentRow[this.labelStatus1].UserPeople ||
          this.currentRow[this.labelStatus1].UserPeople.length == 0 ||
          parseFloat(this.currentRow[this.labelStatus1].ProducedQty > 0)
        ) {
          this.$message.error("请检查报工人员与报工数是否填写！");
          return;
        }
      } else {
        if (
          !this.currentRow[this.labelStatus1].UserPeople ||
          parseFloat(this.currentRow[this.labelStatus1].ProducedQty > 0)
        ) {
          this.$message.error("请检查报工人员与报工数是否填写！");
          return;
        }
      }
      this.$confirm("确定保存吗？")
        .then(() => {
          _this.saveProceData(
            _this.currentRow[this.labelStatus1].LevelTwoProcessName
          );
          _this.dataSave([_this.currentRow[this.labelStatus1]], 2);
        })
        .catch(() => {});
    },
  },
};
</script>
<style lang="scss" scoped>
.footer_content {
  height: 90px;
  // background: #ffe8bd;
  background: #ffffff;

  ::v-deep .el-input__inner {
    // border: 1px solid #5f96b0 !important;
    background: yellow;
    color: #101010 !important;
  }
  ::v-deep .el-input.is-disabled .el-input__inner {
    background-color: #f5f7fa !important;
    border-color: #e4e7ed;
    color: #c0c4cc;
    cursor: not-allowed;
  }

  .el-form-item {
    width: 20%;
    float: left;
    margin-bottom: 5px;
  }

  .el-button {
    width: 80%;
    margin: auto 10%;
    height: 60px;
  }
}

.footer2_content {
  height: 150px;
  // background: #ffe8bd;
  background: #ffffff;

  ::v-deep .el-input__inner {
    // border: 1px solid #5f96b0 !important;
    background: yellow;
    color: #101010 !important;
  }
  ::v-deep .el-input.is-disabled .el-input__inner {
    background-color: #f5f7fa !important;
    border-color: #e4e7ed;
    color: #c0c4cc;
    cursor: not-allowed;
  }

  .el-form-item {
    width: 20%;
    float: left;
    margin-bottom: 5px;
  }

  .el-button {
    width: 80%;
    margin: auto 10%;
    height: 60px;
  }
}
::v-deep .el-select #multipleSelct.el-input__inner {
  height: 2.5rem !important;
}

.el-autocomplete-suggestion {
  width: 400px !important;
}
.presonDialog:hover {
  cursor: pointer;
}
</style>
