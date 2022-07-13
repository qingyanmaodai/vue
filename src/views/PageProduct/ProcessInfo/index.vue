<template>
  <div
    class="container"
    v-loading="adminLoading"
  >
    <div class="up_admin">
      <div
        class="admin_head"
        ref="headRef"
      >
        <ComSearch
          ref="searchRef"
          :searchData="formSearchs[0].datas"
          :searchForm="formSearchs[0].forms"
          :remark="0"
          :isLoading="isLoading[0]"
          :btnForm="btnForm[0]"
          @btnClick="btnClick"
        />
      </div>
      <div>
        <div class="admin_content">
          <div class="ant-table-title">
            <el-row>
              <el-col :span="4"><span class="title">{{ title }}</span></el-col>
              <el-col
                :span="20"
                class="flex_flex_end"
              >
                <el-button
                  type="primary"
                  size="mini"
                  @click="openCategory"
                >新增工艺</el-button>
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
          <ComUmyTable
            :rowKey="'RowNumber'"
            :height="height"
            :tableData="tableData[0]"
            :tableHeader="tableColumns[0]"
            :tableLoading="tableLoading[0]"
            :remark="0"
            :isEdit="isEdit"
            @selectfun="selectFun"
            :sysID="1177"
            :hasSelect="true"
            :isClear="isClear[0]"
            :pagination="tablePagination[0]"
            @handleRowClick="handleRowClick"
            @pageChange="pageChange"
            @pageSize="pageSize"
            @sortChange="sortChange"
          />
        </div>
      </div>
    </div>

    <div
      class="down_admin"
      ref="down_admin"
    >
      <div>
        <div class="admin_content">
          <div class="ant-table-title">
            <el-row>
              <el-col :span="4"><span class="title">{{ title2 }}</span></el-col>
              <el-col
                :span="20"
                class="flex_flex_end"
              >
                <span v-show="labelStatus2 == 1">
                  <el-button
                    type="primary"
                    size="mini"
                    @click="openProcess"
                  >新增工序</el-button>
                  <el-divider direction="vertical"></el-divider>
                  <el-button
                    type="warning"
                    size="mini"
                    @click="saveGroupProcess"
                  >保存工艺工序</el-button>
                </span>
                <span v-show="labelStatus2 == 2">
                  <el-radio
                    v-model="loseCategory"
                    :label="0"
                    @click.native.prevent="clickitem(1)"
                  >缺失工艺</el-radio>
                  <el-divider direction="vertical"></el-divider>
                  <el-button
                    type="primary"
                    size="mini"
                    @click="setContact"
                  >建立关联</el-button>
                </span>
                <span v-show="labelStatus2 == 3">
                  <el-button
                    type="primary"
                    size="mini"
                  >保存</el-button>
                </span>
                <el-divider direction="vertical"></el-divider>
                <div
                  :class="labelStatus2 == item.value ? 'statusActive cursor' : 'cursor'"
                  v-for="(item, y) in Status2"
                  :key="y"
                >
                  <span @click="changeStatus2(item, y)">{{ item.label }}</span>
                  <el-divider direction="vertical"></el-divider>
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="fill_width">
            <div v-show="labelStatus2 == 1">
              <div class="admin_head">
                <ComSearch
                  ref="searchRef1"
                  :searchData="formSearchs[4].datas"
                  :searchForm="formSearchs[4].forms"
                  :remark="4"
                  :isLoading="isLoading[4]"
                  :btnForm="btnForm[4]"
                  @btnClick="btnClick"
                />
              </div>
              <div class="flex">
                <div class="down_right_admin">
                  <ComUmyTable
                    :rowKey="'RowNumber'"
                    :height="'281px'"
                    :tableData="tableData[1]"
                    :tableHeader="tableColumns[1]"
                    :tableLoading="tableLoading[1]"
                    :remark="1"
                    :isEdit="isEdit"
                    :sysID="1186"
                    :isEditDel="true"
                    :isClear="isClear[1]"
                    @editRow="editRow"
                    @delRow="delRow"
                    :pagination="tablePagination[1]"
                    @pageChange="pageChange"
                    @pageSize="pageSize"
                    @sortChange="sortChange"
                  />
                </div>
                <div class="down_center_admin">
                  <i
                    class="icon07jiantouxiangzuofill icon_img"
                    @click="addProcess"
                  ></i>
                </div>
                <div class="down_left_admin">
                  <ComUmyTable
                    :rowKey="'RowNumber'"
                    :height="'281px'"
                    :tableData="tableData[4]"
                    :tableHeader="tableColumns[4]"
                    :tableLoading="tableLoading[4]"
                    :remark="4"
                    :isEdit="isEdit"
                    :hasSelect="true"
                    :sysID="1182"
                    :isClear="isClear[4]"
                    :pagination="tablePagination[4]"
                    @pageChange="pageChange"
                    @pageSize="pageSize"
                    @selectfun="selectFun"
                    @sortChange="sortChange"
                  />
                </div>
              </div>
            </div>
          </div>
          <div v-show="labelStatus2 == 2">
            <div class="admin_head">
              <ComSearch
                ref="searchRef2"
                :searchData="formSearchs[2].datas"
                :searchForm="formSearchs[2].forms"
                :remark="2"
                :isLoading="isLoading[2]"
                :btnForm="btnForm[2]"
                @btnClick="btnClick"
              />
            </div>
            <ComUmyTable
              :rowKey="'RowNumber'"
              :height="'281px'"
              :tableData="tableData[2]"
              :tableHeader="tableColumns[2]"
              :tableLoading="tableLoading[2]"
              :remark="2"
              :isEdit="isEdit"
              :sysID="1180"
              :hasSelect="true"
              :isClear="isClear[2]"
              :pagination="tablePagination[2]"
              @selectfun="selectFun"
              @pageChange="pageChange"
              @pageSize="pageSize"
              @sortChange="sortChange"
            />
          </div>
          <div v-show="labelStatus2 == 3">
            <div class="admin_head">
              <ComSearch
                ref="searchRef1"
                :searchData="formSearchs[3].datas"
                :searchForm="formSearchs[3].forms"
                :remark="3"
                :isLoading="isLoading[3]"
                :btnForm="btnForm[3]"
                @btnClick="btnClick"
              />
            </div>
            <!-- <div class="admin_head">
              <ComSearch
                ref="searchRef3"
                :searchData="formSearchs[3].datas"
                :searchForm="formSearchs[3].forms"
                :remark="3"
                :isLoading="isLoading[3]"
                :btnForm="btnForm[3]"
                @btnClick="btnClick"
              />
            </div> -->
            <ComUmyTable
              :rowKey="'RowNumber'"
              :height="'281px'"
              :tableData="tableData[3]"
              :tableHeader="tableColumns[3]"
              :tableLoading="tableLoading[3]"
              :remark="3"
              :sysID="15"
              :isEdit="isEdit"
              :isClear="isClear[3]"
              :pagination="tablePagination[3]"
              @pageChange="pageChange"
              @pageSize="pageSize"
              @sortChange="sortChange"
            />
          </div>
        </div>
      </div>
    </div>

    <ComFormDialog
      ref="categoryForm"
      :title="'新增工艺'"
      :dialogShow="categoryDialog"
      :formData="formData"
      :formRules="formRules"
      :formController="formController"
      @dialogBtnClick="dialogBtnClick"
    />
    <ComFormDialog
      ref="processForm"
      :title="'新增工序'"
      :dialogShow="processDialog"
      :formData="formData2"
      :formRules="formRules2"
      :formController="formController2"
      @dialogBtnClick="dialogBtnClick2"
    />
  </div>
</template>

<script>
var _this;
import ComSearch from "@/components/ComSearch";
import ComUmyTable from "@/components/ComUmyTable";
import ComFormDialog from "@/components/ComFormDialog";
import {
  GetHeader,
  GetSearchData,
  ExportData,
  SaveData,
  UpdateProcess,
} from "@/api/Common";
export default {
  name: "ProcessInfo",
  components: {
    ComSearch,
    ComUmyTable,
    ComFormDialog,
  },
  data() {
    return {
      ////////////////// Search /////////////////
      loseCategory: 1,
      categoryDialog: false,
      processDialog: false,
      adminLoading: false,
      title: this.$route.meta.title,
      title2: "工序列表",
      drawer: false,
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
        {
          datas: {},
          forms: [],
        },
        {
          datas: {},
          forms: [],
        },
      ],
      btnForm: [[], [], [], [], []],
      parmsBtn: [
        [
          {
            ButtonCode: "save",
            BtnName: "保存",
            Type: "success",
            Ghost: true,
            Size: "small",
            Methods: "dataSave",
            Icon: "",
          },
          {
            ButtonCode: "delete",
            BtnName: "删除",
            Type: "danger",
            Ghost: true,
            Size: "small",
            Methods: "dataDel",
            Params: { dataName: "selectionData" },
            Icon: "",
          },
        ],
        [],
        [],
        [
          {
            ButtonCode: "save",
            BtnName: "保存",
            Type: "success",
            Ghost: true,
            Size: "small",
            Methods: "dataSave",
            Icon: "",
            Params: {},
          },
        ],
        [
          {
            ButtonCode: "save",
            BtnName: "保存",
            Type: "success",
            Ghost: true,
            Size: "small",
            Methods: "dataSave",
            Icon: "",
          },
          {
            ButtonCode: "delete",
            BtnName: "删除",
            Type: "danger",
            Ghost: true,
            Size: "small",
            Methods: "dataDel",
            Params: { dataName: "selectionData" },
            Icon: "",
          },
        ],
      ],
      selectionData: [[], [], [], [], []],
      scrollTop: 0,
      tableData: [[], [], [], [], []],
      tableColumns: [[], [], [], [], []],
      tableLoading: [false, false, false, false, false],
      isClear: [false, false, false, false, false],
      tablePagination: [
        { pageIndex: 1, pageSize: 50, pageTotal: 0 },
        { pageIndex: 1, pageSize: 50, pageTotal: 0 },
        { pageIndex: 1, pageSize: 50, pageTotal: 0 },
        { pageIndex: 1, pageSize: 50, pageTotal: 0 },
        { pageIndex: 1, pageSize: 50, pageTotal: 0 },
      ],
      delData: [[], [], [], [], []],
      height: "300px",
      showPagination: true,
      tagRemark: 0,
      isLoading: [false, false, false, false, false],
      isEdit: false,
      Status1: [
        { label: "全部", value: "" },
        { label: "未配工序", value: "" },
      ],
      Status2: [
        { label: "配置工序", value: 1, title: "工序列表" },
        { label: "关联产品", value: 2, title: "产品列表" },
        { label: "工序产能", value: 3, title: "工序产能列表" },
      ],
      labelStatus1: 0,
      labelStatus2: 1,
      currentRow: "",
      //////////////新增弹框//////////////
      formData: {
        ProcessGroupName: "",
        ProcessGroupID: "",
        Remark1: "",
        Status: 1,
        dicID: 1175,
      },
      formData2: {
        PorcessName: "",
        ProcessID: "",
        SchedulingType: "",
        IsScheduling: true,
        IsAcquisition: true,
        Status: 1,
        dicID: 1182,
      },
      formController: [
        { label: "工艺名称", prop: "ProcessGroupName", type: "input" },
        { label: "发料方式", prop: "Remark1", type: "input" },
        {
          label: "状态",
          prop: "Status",
          type: "radioGroupLabel",
          radioGroups: [
            { label: "启用", value: 1 },
            { label: "禁用", value: 0 },
          ],
        },
      ],
      formController2: [
        { label: "工序名称", prop: "ProcessName", type: "input" },
        {
          label: "排产方式",
          prop: "SchedulingType",
          type: "select",
          select: [
            { label: "产线", value: "产线" },
            { label: "机台", value: "机台" },
            { label: "机模", value: "机模" },
          ],
        },
        {
          label: "是否排产",
          prop: "IsScheduling",
          type: "switch",
        },
        {
          label: "是否采集",
          prop: "IsAcquisition",
          type: "switch",
        },
        {
          label: "状态",
          prop: "Status",
          type: "radioGroupLabel",
          radioGroups: [
            { label: "启用", value: 1 },
            { label: "禁用", value: 0 },
          ],
        },
      ],
      formRules: {
        ProcessGroupName: [
          { required: true, message: "工艺名称为必填项", trigger: "blur" },
        ],
      },
      formRules2: {
        ProcessGroupName: [
          { required: true, message: "工序名称为必填项", trigger: "blur" },
        ],
        SchedulingType: [
          { required: true, message: "排产方式为必填项", trigger: "change" },
        ],
      },
    };
  },
  watch: {},
  created() {
    _this = this;
    this.adminLoading = true;
    this.judgeBtn();
    this.getTableHeader();
  },
  mounted() {
    setTimeout(() => {
      _this.setHeight();
    }, 400);
  },
  methods: {
    // 判断按钮权限
    judgeBtn() {
      let routeBtn = this.$route.meta.btns;
      let permission = false;
      if (routeBtn.length != 0) {
        for (var i = 0; i < 5; i++) {
          let newBtn = [];
          let newData = [];
          routeBtn.forEach((x) => {
            if (x.ButtonCode == "edit") {
              permission = true;
            }
            if (this.parmsBtn[i].length != 0) {
              newData = this.parmsBtn[i].filter((y) => {
                return x.ButtonCode == y.ButtonCode;
              });
            }
            if (newData.length != 0) {
              newBtn = newBtn.concat(newData);
            }
          });
          this.$set(this.btnForm, i, newBtn);
        }
      }
      this.$set(this, "isEdit", permission);
    },
    // 高度控制
    setHeight() {
      let headHeight = this.$refs.down_admin.offsetHeight;
      let headHeight2 = this.$refs.headRef.offsetHeight;
      let newHeight = null;
      let rem =
        document.documentElement.clientHeight -
        headHeight -
        headHeight2 -
        this.$store.getters.reduceHeight;
      if (this.$store.getters.reduceHeight == 138) {
        newHeight = rem - 7 + "px";
      } else {
        newHeight = rem - 10 + "px";
      }
      this.height = newHeight;
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
    // 滚动
    scroll({ scrollTop, scrollLeft }) {
      this.scrollTop = scrollTop;
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
    // 选择数据
    selectFun(data, remarkTb, row) {
      this.selectionData[remarkTb] = data;
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
      }, 200);
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
      this.isLoading[remarkTb] = true;
      let form = JSON.parse(JSON.stringify(this.formSearchs[remarkTb].datas));
      form["rows"] = 0;
      let res = await ExportData(form);
      this.isLoading[remarkTb] = false;
      this.$store.dispatch("user/exportData", res.data);
    },
    // 删除
    async dataDel(remarkTb, index, parms) {
      let res = null;
      let newData = [];
      if (parms && parms.dataName) {
        if (this[parms.dataName][remarkTb].length == 0) {
          this.$message.error("请勾选需要操作的数据！");
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
          _this.$set(_this.btnForm[remarkTb][index], "isLoading", true);
          _this.generalSaveData(newData, remarkTb, index);
        })
        .catch((_) => {});
    },
    // 通用直接保存
    async generalSaveData(newData, remarkTb, index) {
      this.adminLoading = true;
      let res = await SaveData(newData);
      const { result, data, count, msg } = res.data;
      if (result) {
        this.dataSearch(remarkTb);
        this.$message({
          message: msg,
          type: "success",
          dangerouslyUseHTMLString: true,
        });
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
    // 特殊接口保存
    async specialSave(remarkTb, index) {
      let res = null;
      this.adminLoading = true;
      res = await SaveSalesPlan(this.tableData[remarkTb]);
      const { result, data, count, msg } = res.data;
      this.dataSearch(0);
      if (result) {
        this.$message({
          message: msg,
          type: "success",
          dangerouslyUseHTMLString: true,
        });

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
    // 保存
    async dataSave(remarkTb, index, parms) {
      let newData = [];
      if (parms && parms.dataName) {
        if (this.selectionData[remarkTb].length == 0) {
          this.$message.error("请选择需要操作的数据！");
          return;
        } else {
          newData = this.selectionData[remarkTb];
        }
      } else {
        newData = this.tableData[remarkTb];
      }
      let newData_2 = [];
      if (remarkTb == 4) {
        newData.forEach((x) => {
          let obj = JSON.parse(JSON.stringify(x));
          // 二级工序的新增跟删除
          if (obj.LevelIDs.length == 0) {
            if (obj.ToList.length != 0) {
              // 全删
              obj.ToList.forEach((y, j) => {
                let row = {};
                row["ElementDeleteFlag"] = 1;
                row["dicID"] = 7900;
                row["ProcessConcatLevelTwoID"] =
                  obj.ProcessConcatLevelTwoIDs[j];
                newData_2.push(row);
              });
            } else {
              return true;
            }
          } else {
            if (obj.ToList.length == 0) {
              // 全增
              obj.LevelIDs.forEach((y) => {
                let row = {};
                row["ProcessID"] = obj.ProcessID;
                row["LevelTwoProcessID"] = y;
                let newTag = obj["二级工序"].filter(
                  (v) => v.LevelTwoProcessID == y
                );
                row["LevelTwoProcessName"] = newTag[0].LevelTwoProcessName;
                row["dicID"] = 7900;
                newData_2.push(row);
              });
            } else {
              let Data1 = obj.LevelIDs.filter(
                (w) => !obj.ToList.some((q) => q == w)
              ); //新增
              let Data2 = obj.ToList.filter(
                (c) => !obj.LevelIDs.some((z) => c == z)
              ); //删除
              if (Data1.length != 0) {
                Data1.forEach((a) => {
                  let row1 = {};
                  row1["LevelTwoProcessID"] = a;
                  row1["ProcessID"] = obj.ProcessID;
                  let newTag = obj["二级工序"].filter(
                    (v) => v.LevelTwoProcessID == a
                  );
                  row1["LevelTwoProcessName"] = newTag[0].LevelTwoProcessName;
                  row1["dicID"] = 7900;
                  newData_2.push(row1);
                });
              }
              if (Data2.length != 0) {
                Data2.forEach((b) => {
                  let row2 = {};
                  let newIndex = obj.ToList.findIndex((w) => {
                    return w == b;
                  });
                  debugger;
                  row2["ElementDeleteFlag"] = 1;
                  row2["ProcessConcatLevelTwoID"] =
                    obj.ProcessConcatLevelTwoIDs[newIndex];
                  row2["dicID"] = 7900;
                  newData_2.push(row2);
                });
              }
            }
          }
        });
      }
      newData = newData.concat(newData_2);
      this.adminLoading = true;
      let res = await SaveData(newData);
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
      let IDs = [
        { ID: 1177 },
        { ID: 1186 },
        { ID: 1180 },
        { ID: 15 },
        { ID: 1182 },
      ];
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
          // 判断查询的长度
          x.forEach((y) => {
            if (y.prop && y.value) {
              this.$set(this.formSearchs[z].datas, [y.prop], y.value);
            } else {
              this.$set(this.formSearchs[z].datas, [y.prop], "");
            }
          });
          this.$set(this.formSearchs[z], "forms", x);
        });
        this.adminLoading = false;
        this.getTableData(this.formSearchs[0].datas, 0);
        this.getTableData(this.formSearchs[4].datas, 4);
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
      // this.getAutoHeader(IDs);
    },
    // 获取动态日期表头
    async getAutoHeader(IDs) {
      let resTwo = await GetHeaderTwo(IDs);
      const { datas, dresult, msg } = resTwo.data;
      if (dresult) {
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
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
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
      const { result, data, count, msg, Columns } = res.data;
      if (result) {
        if (remarkTb == 4) {
          if (data.length != 0) {
            data.forEach((a) => {
              if (a.LevelIDs) {
                a.LevelIDs = a.LevelIDs.split(",");
                a.LevelIDs = JSON.parse("[" + String(a.LevelIDs) + "]");
                this.$set(a, "ToList", a.LevelIDs);
              } else {
                a.LevelIDs = [];
                this.$set(a, "ToList", []);
              }

              if (a.ProcessConcatLevelTwoIDs) {
                a.ProcessConcatLevelTwoIDs = a.ProcessConcatLevelTwoIDs.split(
                  ","
                );
              } else {
                a.ProcessConcatLevelTwoIDs = [];
              }
            });
          }
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
    // 改变状态
    changeStatus(item, index) {
      this.labelStatus1 = index;
      if (index == 0) {
        this.formSearchs[0].datas["ProcessCount"] = "";
      } else {
        this.formSearchs[0].datas["ProcessCount"] = 0;
      }
      this.dataSearch(0);
    },
    // 改变状态
    changeStatus2(item, index) {
      this.labelStatus2 = item.value;
      this.title2 = item.title;
      if (this.tableData[item.value].length == 0) {
        this.dataSearch(item.value);
      }
    },
    // 单击获取工艺
    handleRowClick(row, remarkTb) {
      this.currentRow = row;
      this.formSearchs[1].datas["ProcessGroupID"] = row.ProcessGroupID;
      this.dataSearch(1);
    },
    // 新增工艺
    openCategory() {
      this.categoryDialog = true;
    },
    openProcess() {
      this.processDialog = true;
    },
    // 切换缺失工艺
    clickitem(val) {
      val == this.loseCategory
        ? (this.loseCategory = 0)
        : (this.loseCategory = 1);
      if (this.loseCategory == 0) {
        this.formSearchs[2].datas["ProcessCount"] = 0;
      } else {
        this.formSearchs[2].datas["ProcessCount"] = "";
      }
      this.dataSearch(2);
    },
    // 工艺弹框确定添加
    async dialogBtnClick(val) {
      if (val) {
        let res = await SaveData([this.formData]);
        const { result, data, count, msg } = res.data;
        if (result) {
          this.$message({
            message: msg,
            type: "success",
            dangerouslyUseHTMLString: true,
          });
          this.dataSearch(0);
        } else {
          this.$message({
            message: msg,
            type: "error",
            dangerouslyUseHTMLString: true,
          });
        }
        this.categoryDialog = false;
      } else {
        _this.$refs.categoryForm.$refs.formData.resetFields();
        _this.categoryDialog = false;
      }
    },
    // 工序弹框确定添加
    async dialogBtnClick2(val) {
      if (val) {
        let res = await SaveData([this.formData2]);
        const { result, data, count, msg } = res.data;
        if (result) {
          this.$message({
            message: msg,
            type: "success",
            dangerouslyUseHTMLString: true,
          });
          this.dataSearch(4);
        } else {
          this.$message({
            message: msg,
            type: "error",
            dangerouslyUseHTMLString: true,
          });
        }
        this.processDialog = false;
      } else {
        _this.$refs.processForm.$refs.formData.resetFields();
        _this.processDialog = false;
      }
    },
    // 向右往工艺添加工序
    addProcess() {
      if (this.selectionData[4].length == 0) {
        this.$message.error("请勾选工序！");
      } else if (!this.currentRow) {
        this.$message.error("请单击选择工艺！");
      } else {
        this.selectionData[4].forEach((x) => {
          if (
            this.tableData[0].findIndex((y) => {
              return x.ProcessID == y.ProcessID;
            }) == -1
          ) {
            let obj = JSON.parse(JSON.stringify(x));
            obj["ProcessGroupInfoID"] = "";
            obj["IsAdd"] = true;
            obj["dicID"] = 1176;
            obj["ProcessGroupID"] = this.currentRow.ProcessGroupID;
            obj["ProcessGroupName"] = this.currentRow.ProcessGroupName;
            obj["ProcessGroupName"] = this.currentRow.ProcessGroupName;
            obj["IsScheduling"] = true;
            this.tableData[1].unshift(obj);
          }
        });
      }
    },
    // 保存工艺工序
    saveGroupProcess() {
      let childrens = [];
    console.log( this.tableData[1]);
      this.tableData[1].forEach((x) => {
      //  if (x.IsAdd) 
        {
          childrens.push(x);
        }
      });
      this.currentRow["childrens"] = childrens;
      this.currentRow["dicID"] = 1175;
      let newData = [];
      newData.push(this.currentRow);
      this.generalSaveData(newData, 1, 0);
    },
    // 保存返回结果自己处理事件
    async returnResultData(newData) {
      let res = await SaveData(newData);
      return res;
    },
    // 产品与工艺关联
    setContact() {
      if (this.selectionData[2].length == 0) {
        this.$message.error("请勾选产品！");
      } else if (!this.currentRow) {
        this.$message.error("请单击选择工艺！");
      } else {
        this.selectionData[2].some((x, i) => {
          let obj = {
            materialID: x.MaterialID,
            processGroupID: this.currentRow.ProcessGroupID,
          };
          this.submitData(obj, i);
        });
      }
    },
    // 提交配置的工艺
    async submitData(obj, i) {
      let res = await UpdateProcess(obj);
      const { result, data, count, msg } = res.data;
      if (result) {
        if (i == this.selectionData[2].length - 1) {
          this.$message({
            message: msg,
            type: "success",
            dangerouslyUseHTMLString: true,
          });
          this.dataSearch(2);
        }
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
    },
    // 编辑
    editRow(row, index, remarkTb) {
      this.$set(row, "update", true);
    },
    // 删除
    delRow(row, index, remarkTb) {
      if (row["IsAdd"]) {
        this.tableData[remarkTb].splice(index, 1);
      } else {
        this.$confirm("有新添加的工序要先保存哟，确定要删除这条数据吗？")
          .then((_) => {
            let childrens = [];
            row["ElementDeleteFlag"] = 1;
            row["ProcessGroupID"] = this.currentRow.ProcessGroupID;
            this.currentRow["childrens"] = childrens;
            let newData = [];
            newData.push(_this.currentRow);
            _this.generalSaveData(newData, 2, 0);
          })
          .catch((_) => {});
      }
    },
  },
};
</script>    