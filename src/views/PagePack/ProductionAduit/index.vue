<!--特殊报工维护-->
<template>
  <div class="container" v-loading="adminLoading">
    <div class="admin_head" ref="headRef">
      <div v-for="(item, i) in 2" :key="i">
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
              <el-button type="primary" size="small" @click="openProduct"
                >新增报工</el-button
              >
              <el-divider direction="vertical"></el-divider>
              <div
                :class="labelStatus1 == y ? 'statusActive cursor' : 'cursor'"
                v-for="(item, y) in Status1"
                :key="y"
              >
                <span @click="changeStatus(item, y, 1)">{{ item.label }}</span>
                <el-divider direction="vertical"></el-divider>
              </div>
            </el-col>
          </el-row>
        </div>
        <div v-for="(item2, i2) in 2" :key="i2">
          <ComUmyTable
            v-show="labelStatus1 == i2"
            :rowKey="'RowNumber'"
            :height="height"
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
    <div class="footer_content" ref="footerRef">
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
            <el-form-item v-show="labelStatus1 == 0" label="人员：" prop="UserPeople">
              <el-select
                clearable
                filterable
                :multiple="multiple"
                v-model="currentRow[0].UserPeople"
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
            <el-form-item v-show="labelStatus1 == 1" label="人员：" prop="Peoples">
              <el-input
                v-model="currentRow[1].Peoples"
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
            <el-form-item label="代码：" prop="MaterialName">
              <el-input
                disabled
                v-model="currentRow[labelStatus1].MaterialName"
                type="text"
                size="small"
              ></el-input>
            </el-form-item>
            <el-form-item label="计划数：" v-show="labelStatus1 == 0" prop="PlanQty">
              <el-input
                disabled
                v-model="currentRow[0].PlanQty"
                type="text"
                size="small"
              ></el-input>
            </el-form-item>

            <el-form-item label="报工数：" prop="ProducedQty">
              <el-input
                :disabled="tag == 1"
                v-model="currentRow[labelStatus1].ProducedQty"
                type="text"
                size="small"
              ></el-input>
            </el-form-item>

            <el-form-item label="确认数：" prop="ConfirmQty" v-show="labelStatus1 == 1">
              <el-input
                v-model="currentRow[1].ConfirmQty"
                type="text"
                size="small"
              ></el-input>
            </el-form-item>

            <el-form-item label="计时：" prop="TotalHours">
              <el-input
                :disabled="tag == 1"
                v-model="currentRow[labelStatus1].TotalHours"
                type="text"
                size="small"
              ></el-input>
            </el-form-item>

            <el-form-item
              label="确认计时："
              prop="ConfirmTotalHours"
              v-show="labelStatus1 == 1"
            >
              <el-input
                v-model="currentRow[1].ConfirmTotalHours"
                type="text"
                size="small"
              ></el-input>
            </el-form-item>

            <el-form-item label="补备注：" prop="Remark1">
              <el-input
                v-model="currentRow[labelStatus1].Remark2"
                type="text"
                size="small"
              ></el-input>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" v-show="labelStatus1 == 0" @click="setProduction"
            >报工</el-button
          >
          <el-button type="primary" v-show="labelStatus1 == 1" @click="setAduit"
            >审批</el-button
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
                      ><span style="color: orange">{{ item.MaterialName }}</span>
                    </el-form-item>
                    <el-form-item style="margin-bottom: 5px" label="工艺："
                      ><span style="color: orange">{{ item.ProcessGroupName }}</span>
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
  </div>
</template>

<script>
var _this;
import ComSearch from "@/components/ComSearch";
import ComUmyTable from "@/components/ComUmyTable";
import { GetHeader, GetSearchData, ExportData, GetSearch, SaveData } from "@/api/Common";
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
        Remark3:'',//新增报工备注
      },
      rules: {
        ProducedDate: [{ required: true, message: "报工日期必填", trigger: "change" }],
        MaterialName: [{ required: true, message: "产品名称必填", trigger: "change" }],
        LineName: [{ required: true, message: "线别名称必填", trigger: "change" }],
        UserPeople: [{ required: true, message: "生产人员称必填", trigger: "change" }],
        // ProducedQty: [
        //   { required: true, message: "报工数量必填", trigger: "blur" },
        // ],
      },
      ////////////////// Search /////////////////
      multiple: true,
      title: "计划列表",
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
      ],
      sysID: [{ ID: 6720 }, { ID: 6704 }],
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
        },
      ],
      tableData: [[], []],
      tableColumns: [[], []],
      tableLoading: [false, false],
      isClear: [false, false],
      tablePagination: [
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
      ],
      isSelect: false,
      adminLoading: false,
      selectionData: [[], []],
      currentRow: [{}, {}],
      lines: [],
      userInfo: {},
      dialogProduct: false,
      hasSelect: [false, true],
      multiple_2: false,
      isEdit: [true, false],
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
    // 获取线别
    async getLineData() {
      let form = {};
      form["rows"] = 0;
      form["dicID"] = 3026;
      form["OrganizeTypeID"] = 6;
      let res = await GetSearchData(form);
      const { result, data, count, msg } = res.data;
      if (result) {
        this.lines = data;
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
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
      this.formSearchs[remarkTb].datas["ProductionStatus"] = this.Status1[
        this.labelStatus1
      ].value;
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
            if (n.childrens && n.children.length != 0) {
              n.childrens.forEach((x) => {
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
      } else {
        this.title = "审核超期列表";
      }
      // if (this.tableData[index].length == 0) {
      //   this.dataSearch(index);
      // }
    },
    // 单击
    handleRowClick(row) {
      // 获取线下面的人
      // 判断是集体还是个人
      let newRow = this.lines.filter((x) => {
        return x.OrganizeID == row.LineID;
      });
      console.log('this.lines',this.lines)
      this.getUserData(newRow[0].OrganizeID);
      if (newRow[0].OrganizeType == "集体") {
        this.multiple = true;
      } else {
        this.multiple = false;
      }
      if (this.labelStatus1 == 0) {
        this.tag = 0;
        this.$set(this.currentRow[0], "UserPeople", null);
        this.currentRow[this.labelStatus1]["ModifiedByName"] = this.userInfo.Name;
        this.currentRow[this.labelStatus1]["ModifiedBy"] = this.userInfo.Account;
        for (let name in row) {
          this.$set(this.currentRow[0], name, row[name]);
        }
        this.$set(this.currentRow[0], "ProducedDate", row.PlanDay);
        this.$set(this.currentRow[0], "dicID", 6704);
        this.$set(this.currentRow[0], "Status", 2);
        this.$set(this.currentRow[0], "ProducedQty", null);
      } else {
        this.tag = 1;
        this.currentRow[this.labelStatus1]["ModifiedByName"] = this.userInfo.Name;
        for (let name in row) {
          this.$set(this.currentRow[1], name, row[name]);
        }
        this.$set(this.currentRow[1], "ConfirmQty", null);
        this.$set(this.currentRow[1], "dicID", 6704);
        this.$set(this.currentRow[1], "Status", 2);
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
                obj["Remark2"] = _this.currentRow[0].newTinyProcessData.join(",");
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
              obj2["Remark2"] = _this.currentRow[0].newTinyProcessData.join(",");
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
      if (!this.currentRow[1].ConfirmQty && !this.currentRow[1].ConfirmTotalHours) {
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
        form["ProcessID"] = this.ProcessID;
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

.el-autocomplete-suggestion {
  width: 400px !important;
}
</style>
