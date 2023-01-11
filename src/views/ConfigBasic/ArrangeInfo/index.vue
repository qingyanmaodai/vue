<!--排班信息-->
<template>
  <div
    class="container flex_flex"
    v-loading="adminLoading"
  >
    <div class="admin_left">
      <ComCheckboxTree
        ref="asideRef"
        :treeData="treeData"
        :treeHeight="treeHeight"
        :title="'车间级信息'"
        :nodekey="'OrganizeID'"
        :treeProps="treeProps"
        @searchTree="searchTree"
        @handleNodeClick="handleNodeClick"
        @check="check"
      />
    </div>
    <div class="admin_container">
      <div>
        <div class="admin_content">
          <div class="ant-table-title">
            <el-row>
              <el-col :span="4"></el-col>
              <el-col
                :span="20"
                class="flex_flex_end"
              >
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
          <div
            v-show="labelStatus1 == 0"
            class="bgFFF"
          >
            <div
              class="admin_head flex_row_spaceBtn"
              ref="headRef"
            >
              <div class="flex">
                <div class="tree_text">排班配置</div>
                <el-divider direction="vertical"></el-divider>
                <el-radio-group
                  v-model="largeOrSmall"
                  size="mini"
                  @change="changeRadio"
                >
                  <el-radio-button label="大周"></el-radio-button>
                  <el-radio-button label="小周"></el-radio-button>
                </el-radio-group>
                <el-divider direction="vertical"></el-divider>
                <el-date-picker
                  size="mini"
                  v-model="dataPicker"
                  type="daterange"
                  align="right"
                  unlink-panels
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :picker-options="pickerOptions"
                >
                </el-date-picker>
                <el-divider direction="vertical"></el-divider>
                <el-select
                  size="mini"
                  v-model="WorkingTimesID"
                  filterable
                  placeholder="选择班次"
                  @change="changeWorkingTimesID"
                >
                  <el-option
                    v-for="(item,y) in WorkingTimesIDs"
                    :key="y"
                    :label="item.WorkingTimesName"
                    :value="item.WorkingTimesID"
                  >
                  </el-option>
                </el-select>
                <el-divider direction="vertical"></el-divider>
                <el-radio
                  v-model="IsCicle"
                  :label="true"
                  @click.native.prevent="clickitem(true)"
                >是否循环大小周</el-radio>
              </div>
              <div>
                <el-button
                  type="success"
                  plain
                  size="mini"
                  :disabled="!isEdit"
                  @click="saveWork"
                >保存</el-button>
              </div>
            </div>
            <div class="margin_lr10">
              <ux-grid
                size="mini"
                ref="plxTable"
                :row-key="true"
              >
                <ux-table-column
                  field="empty"
                  title=""
                  width="160"
                >
                </ux-table-column>
                <ux-table-column
                  v-for="(item,index) in tableHeader"
                  :key="index"
                  :title="item.label"
                  :field="item.prop"
                >
                  <template slot-scope="scope">
                    <el-input
                      type="number"
                      size="mini"
                      v-model="scope.row[item.prop]"
                      :disabled="scope.row['disabled']"
                      @input="totalTimesChange(scope)"
                    ></el-input>
                  </template>
                </ux-table-column>
              </ux-grid>
            </div>
            <div class="margin_lr10 margin_top5 notice">
              注意：默认按大周（周一至周六），小周（周一至周五），如若是大小周轮流来，请勾选循环大小周，上班人数为0或空，统一取组织人数，如有不规则排班，请选择线别进入排班日历更改，最新的数据将会覆盖旧排班。
            </div>
            <div class="margin_top15 hr-line-dashed"></div>
            <div>
              <div
                class="admin_head flex_between"
                ref="headRef"
              >
                <div class="flex">
                  <div class="tree_text">
                    排班日历
                  </div>
                  <el-divider direction="vertical"></el-divider>
                  <el-select
                    size="mini"
                    v-model="WorkingTimesID2"
                    filterable
                    placeholder="批量设置班次"
                    @change="changeWorkingTimesID2"
                  >
                    <el-option
                      v-for="(item,y) in WorkingTimesIDs"
                      :key="y"
                      :label="item.WorkingTimesName"
                      :value="item.WorkingTimesID"
                    >
                    </el-option>
                  </el-select>
                  <el-divider direction="vertical"></el-divider>
                  <div class="notice">
                    注意：选择具体的线别才能修改排班日历，切换月份前要先保存哦~
                  </div>
                  <el-divider direction="vertical"></el-divider>
                </div>
                <el-button
                  type="success"
                  plain
                  size="mini"
                  :disabled="!isEdit"
                  @click="saveOnlyWeek"
                >保存</el-button>
              </div>
              <div class="margin_lr10">
                <el-calendar
                  class="arrange_calendar__body"
                  v-model="calendarMonth"
                >
                  <template
                    slot="dateCell"
                    slot-scope="{data}"
                  >
                    <div :class="data.isSelected ? 'is-selected' : ''">
                      <div class="flex_between">
                        <span> {{ data.day.split('-').slice(1).join('-') }} </span>
                        <el-checkbox
                          v-model="calenderData[Number(data.day.split('-').slice(2).join('-'))-1]['IsRest']"
                          @change="(val)=>clearInput(val,Number(data.day.split('-').slice(2).join('-'))-1)"
                        >
                          <span>休</span>
                        </el-checkbox>
                      </div>
                    </div>
                    <div>
                      <el-row class="text_row">
                        <el-col :span="12">
                          班次：
                        </el-col>
                        <el-col :span="12">
                          <el-select
                            size="mini"
                            clearable
                            filterable
                            v-model="calenderData[Number(data.day.split('-').slice(2).join('-'))-1].WorkingTimesID"
                          >
                            <el-option
                              v-for="(item,y) in WorkingTimesIDs"
                              :key="y"
                              :label="item.WorkingTimesName"
                              :value="item.WorkingTimesID"
                            ></el-option>

                          </el-select>
                        </el-col>
                      </el-row>
                      <el-row class="text_row">
                        <el-col :span="12">
                          上班人数：
                        </el-col>
                        <el-col :span="12">
                          <el-input
                            size="mini"
                            type="number"
                            :disabled="calenderData[Number(data.day.split('-').slice(2).join('-'))-1]['Disabled']"
                            v-model="calenderData[Number(data.day.split('-').slice(2).join('-'))-1].Peoples"
                          ></el-input>
                        </el-col>
                      </el-row>
                      <el-row class="text_row">
                        <el-col :span="12">
                          上班时长：
                        </el-col>
                        <el-col :span="12">
                          <el-input
                            size="mini"
                            type="number"
                            :disabled="calenderData[Number(data.day.split('-').slice(2).join('-'))-1]['Disabled']"
                            v-model="calenderData[Number(data.day.split('-').slice(2).join('-'))-1].WorkTime"
                          ></el-input>
                        </el-col>
                      </el-row>
                      <el-row class="text_row">
                        <el-col :span="12">
                          加班时长：
                        </el-col>
                        <el-col :span="12">
                          <el-input
                            size="mini"
                            type="number"
                            :disabled="calenderData[Number(data.day.split('-').slice(2).join('-'))-1]['Disabled']"
                            v-model="calenderData[Number(data.day.split('-').slice(2).join('-'))-1].OverTime"
                          ></el-input>
                        </el-col>
                      </el-row>
                    </div>

                  </template>
                </el-calendar>
              </div>
            </div>
          </div>
          <div
            v-show="labelStatus1 == 1"
            class="bgFFF"
          >
            <div
              class="admin_head flex_between"
              ref="headRef"
            >
              <div class="notice">
                注意：切换月份前要先保存哦~
              </div>
              <el-button
                type="success"
                plain
                size="mini"
                :disabled="!isEdit"
                @click="saveOnlyWeekRest"
              >保存</el-button>
            </div>
            <div class="margin_lr10">
              <el-calendar
                class="arrange_calendar__body2"
                v-model="calendarMonth2"
              >
                <template
                  slot="dateCell"
                  slot-scope="{data}"
                >
                  <div :class="data.isSelected ? 'is-selected' : ''">
                    <div class="flex_between">
                      <span> {{ data.day.split('-').slice(1).join('-') }}</span>
                    </div>
                    <div class="flex_row_center">
                      <el-checkbox
                        size="medium "
                        v-model="calenderData2[Number(data.day.split('-').slice(2).join('-'))-1]['IsRest']"
                        class="largeCheckbox"
                      >
                        <span>休</span>
                      </el-checkbox>
                    </div>
                  </div>
                </template>
              </el-calendar>
            </div>

          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
var _this;
import ComSearch from "@/components/ComSearch";
import ComCheckboxTree from "@/components/ComCheckboxTree";
import ComUmyTable from "@/components/ComUmyTable";
import {
  GetHeader,
  GetSearchData,
  ExportData,
  SaveData,
  GetSearch,
  GetWorkTimeData,
  GetOrgData,
  SaveWorkingTimes,
  SaveLineWorkingTimes,
} from "@/api/Common";
import ComFormDialog from "@/components/ComFormDialog";
import { mapState } from "vuex";
export default {
  name: "ArrangeInfo",
  components: {
    ComSearch,
    ComCheckboxTree,
    ComUmyTable,
    ComFormDialog,
  },
  data() {
    return {
      adminLoading: false,
      labelStatus1: 0,
      Status1: [
        { label: "上班", value: 0 },
        { label: "休假", value: 1 },
      ],
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      dataPicker: "",
      largeOrSmall: "大周",
      WorkingTimesID: "",
      WorkingTimesID2: "",
      IsCicle: false,
      WorkingTimesIDs: [],
      tableData: [
        {
          empty: "上班人数",
          Week1: "",
          Week2: "",
          Week3: "",
          Week4: "",
          Week5: "",
          Week6: "",
          Week7: "",
          disabled: false,
        },
        {
          empty: "上班时长",
          Week1: "",
          Week2: "",
          Week3: "",
          Week4: "",
          Week5: "",
          Week6: "",
          Week7: "",
          disabled: false,
        },
        {
          empty: "加班时长",
          Week1: "",
          Week2: "",
          Week3: "",
          Week4: "",
          Week5: "",
          Week6: "",
          Week7: "",
          disabled: false,
        },
        {
          empty: "累计时长",
          Week1: "",
          Week2: "",
          Week3: "",
          Week4: "",
          Week5: "",
          Week6: "",
          Week7: "",
          disabled: true,
        },
      ],
      tableHeader: [
        { label: "周一", prop: "Week1" },
        { label: "周二", prop: "Week2" },
        { label: "周三", prop: "Week3" },
        { label: "周四", prop: "Week4" },
        { label: "周五", prop: "Week5" },
        { label: "周六", prop: "Week6" },
        { label: "周日", prop: "Week7" },
      ],
      calenderData: [],
      calenderData2: [],
      calendarMonth: new Date(),
      calendarMonth2: new Date(),
      selectionLines: [],
      //////////////左侧树节点//////////////
      treeData: [],
      treeProps: {
        label: "OrganizeName",
        children: "children",
      },
      ////////////////// Search /////////////////
      title: this.$route.meta.title,
      drawerTitle: "新增人员",
      drawer: false,
      delData: [[]],
      formSearchs: [
        {
          datas: {},
          forms: [],
        },
      ],
      parmsBtn: [
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
          Params: { dataName: "delData" },
          Icon: "",
        },
      ],
      btnForm: [],
      tableColumns: [[]],
      tableLoading: [false],
      isClear: [false],
      tablePagination: [{ pageIndex: 1, pageSize: 30, pageTotal: 0 }],
      height: "707px",
      showPagination: true,
      tagRemark: 0,
      isEdit: false,
      clickData: {},
      currentMonth: new Date().getMonth() + 1,
      currentMonth2: new Date().getMonth() + 1,
      treeListTmp: [],
      treeHeight: "790px",
      lines: [],
    };
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo,
    }),
  },
  watch: {
    calendarMonth: {
      handler(newValue, oldValue) {
        if (this.lines.length == 1) {
          this.currentMonth = this.zero(new Date(newValue).getMonth() + 1);
          let currentYear = new Date(newValue).getFullYear();
          let YearMonth = String(currentYear) + String(this.currentMonth);
          let YearMonth2 =
            String(currentYear) + "-" + String(this.currentMonth) + "01";
          this.setCalender(
            currentYear,
            this.currentMonth,
            YearMonth,
            YearMonth2
          );
        }
      },
      deep: true,
    },
    calendarMonth2: {
      handler(newValue, oldValue) {
        this.currentMonth2 = new Date(newValue).getMonth() + 1;
        // 切换数据
      },
      deep: true,
    },
  },
  created() {
    _this = this;
    this.adminLoading = true;
    let Year = new Date().getFullYear();
    let Month = this.zero(new Date().getMonth() + 1);
    this.judgeBtn();
    this.getOrgData();
    this.setCalender(Year, Month);
    this.getWorkingTimes();
  },
  mounted() {
    this.$refs.plxTable.reloadData(this.tableData);
    setTimeout(() => {
      this.setHeight();
    }, 450);
  },
  methods: {
    //累计时长计算
    totalTimesChange(scope){
      if(scope.rowIndex!=0){
        // 上班/加班时间发生改变时计算累加时长
        let name = "Week" + scope.columnIndex;
        let workTimes =this.tableData[1][name]?this.tableData[1][name]:0
        let overTimes = this.tableData[2][name]?this.tableData[2][name]:0
        this.tableData[3][name] = parseFloat(workTimes) + parseFloat(overTimes);
      }
    },
    getDays(year, month) {
      let days = new Date(year, month, 0).getDate();
      return days;
    },
    searchTree(msg) {
      this.treeData = [];
      let treeListTmp = JSON.parse(JSON.stringify(this.treeListTmp));
      let tmp = msg
        ? this.rebuildData(msg, treeListTmp)
        : JSON.parse(JSON.stringify(treeListTmp));
      this.treeData.push(...tmp);
    },
    rebuildData(value, arr) {
      if (!arr) {
        return [];
      }
      let newarr = [];
      if (Object.prototype.toString.call(arr) === "[object Array]") {
        arr.forEach((element) => {
          if (element.OrganizeName.indexOf(value) > -1) {
            // const ab = this.rebuildData(value, element.children);
            const obj = {
              ...element,
              children: element.children,
            };
            newarr.push(obj);
          } else {
            if (element.children && element.children.length > 0) {
              const ab = this.rebuildData(value, element.children);
              const obj = {
                ...element,
                children: ab,
              };
              if (ab && ab.length > 0) {
                newarr.push(obj);
              }
            }
          }
        });
      }
      return newarr;
    },
    // 添加属性
    setCalender(Year, Month, YearMonth, YearMonth2) {
      let days = this.getDays(Year, Month); // 判断当前月有多少天
      let WorkingTimesID = "";
      if (this.WorkingTimesIDs.length != 0) {
        WorkingTimesID = this.WorkingTimesIDs[0].WorkingTimesID;
      }
      for (var i = 1; i <= days; i++) {
        let obj = {};
        obj["IsRest"] = false;
        obj["Peoples"] = 0;
        obj["WorkTime"] = 0;
        obj["OverTime"] = 0;
        obj["WorkingTimesID"] = WorkingTimesID;
        this.calenderData.push(obj);
        this.calenderData2.push(obj);
      }
      if (YearMonth) {
        // 切换数据
        this.searchWorkTime(
          YearMonth,
          YearMonth2,
          this.lines[0].OrganizeID,
          95
        );
      }
    },
    // 获取组织
    async getOrgData() {
      this.treeListTmp = [];
      this.treeData = [];
      let form = {
        OrganizeIDs: this.userInfo.CenterID,
        OrganizeID: this.userInfo.OrganizeID,
        dicID: 3026,
        Status: 1,
      };
      let res = await GetOrgData(form);
      const { result, data, count, msg } = res.data;
      if (result) {
        this.treeData = data;
        this.treeListTmp = data;
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
      this.$set(this, "isEdit", permission);
    },
    // 高度控制
    setHeight() {
      this.treeHeight = document.documentElement.clientHeight - 150 + "px";
      let headHeight = this.$refs.headRef.offsetHeight;

      let rem =
        document.documentElement.clientHeight -
        headHeight -
        this.$store.getters.reduceHeight;
      let newHeight = rem + "px";
      this.$set(this, "height", newHeight);
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
      this.$set(this.isClear, remarkTb, true);
      this.$set(this.tableLoading, remarkTb, true);
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
    // 保存
    async dataSave(remarkTb, index) {
      let res = await SaveData(this.tableData[remarkTb]);
      const { datas, forms, result, msg } = res.data;
      if (result) {
        this.$message({
          message: msg,
          type: "success",
          dangerouslyUseHTMLString: true,
        });

        this.dataSearch(remarkTb);
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
    },
    // 单击行
    handleRowClick(row, remarkTb) {
      this.delData[remarkTb] = [];
      this.delData[remarkTb].push(row);
    },
    // 删除
    async dataDel(remarkTb, index, parms) {
      let res = null;
      let newData = [];
      if (parms && parms.dataName) {
        if (this[parms.dataName][remarkTb].length == 0) {
          this.$message.error("请单击需要操作的数据！");
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
          _this.generalSaveData(newData, remarkTb, index);
        })
        .catch((_) => {});
    },
    // 通用直接保存
    async generalSaveData(newData, remarkTb, index) {
      let res = await SaveData(newData);
      const { result, data, count, msg } = res.data;
      if (result) {
        this.dataSearch(remarkTb);
        this.$message({
          message: msg,
          type: "success",
          dangerouslyUseHTMLString: true,
        });
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
    },
    // 单击出来组织人员
    handleNodeClick(data, node) {
      this.clickData = data;
    },
    check(data) {
      this.lines = this.$refs.asideRef.$refs.asideTree
        .getCheckedNodes()
        .filter((x) => {
          return x.OrganizeTypeID == 6;
        });
      if (this.lines.length > 1 || this.lines.length == 0) {
        this.cicleName(0, true);
      } else if (this.lines.length == 1) {
        this.cicleName(this.lines[0].TotalPeoples, false);
      }
      if (this.lines.length == 1) {
        let YearMonth =
          String(this.calendarMonth.getFullYear()) +
          this.zero(this.calendarMonth.getMonth() + 1);
        let YearMonth2 =
          this.calendarMonth.getFullYear() +
          "-" +
          (this.calendarMonth.getMonth() + 1) +
          "-" +
          "01";
        this.searchWorkTime(
          YearMonth,
          YearMonth2,
          this.lines[0].OrganizeID,
          95
        );
      }
    },
    // 查询线别排班
    async searchWorkTime(YearMonth, YearMonth2, OrganizeID, dicID) {
      let obj = {
        YearMonth: YearMonth,
        YearMonth2: YearMonth2,
        OrganizeID: OrganizeID,
        dicID: dicID,
      };
      let res = await GetWorkTimeData(obj);
      const { result, data, count, msg } = res.data;
      if (result) {
        data.some((x, i) => {
          for (var name in x) {
            this.$set(this.calenderData[i], name, x[name]);
          }
        });
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
    },
    zero(num) {
      if (Number(num) < 10) {
        return "0" + num;
      } else {
        return num;
      }
    },
    cicleName(val, tag) {
      let index = 8;
      if (this.largeOrSmall == "大周") {
        index = 7;
      } else {
        index = 6;
      }
      for (var i = 1; i < index; i++) {
        let name = "Week" + i;
        this.tableData[0][name] = val;
        this.tableData[0].disabled = tag;
      }
    },
    ////////////////////////////事件///////////////
    // 切换状态
    changeStatus(item, index) {
      this.labelStatus1 = index;
    },
    // 切换大小周
    changeRadio() {
      this.clearTable();
      this.changeWorkingTimesID(this.WorkingTimesID);
    },
    //选择班次
    changeWorkingTimesID(val) {
      // 获取选中的数据
      let TotalPeoples = null;
      if (this.lines.length == 1) {
        TotalPeoples = this.lines[0].TotalPeoples;
      }
      if (this.lines == 0) {
        this.$message.error("请选择要配置班次的线别！");
        this.WorkingTimesID = null;
        return;
      }
      let newData = this.WorkingTimesIDs.filter((x) => {
        return x.WorkingTimesID == val;
      });
      let index = 0;
      if (this.largeOrSmall == "大周") {
        index = 7;
      } else {
        index = 6;
      }
      for (var i = 1; i < index; i++) {
        let name = "Week" + i;
        this.tableData[1][name] = newData[0].WorkHour;
        this.tableData[2][name] = newData[0].OverTimeHour;
        this.tableData[3][name] =
          parseFloat(newData[0].WorkHour) + parseFloat(newData[0].OverTimeHour);
        if (!TotalPeoples) {
          this.tableData[0][name] = 0;
          // this.tableData[0].disabled = true;
        } else {
          this.tableData[0][name] = TotalPeoples;
          // this.tableData[0].disabled = false;
        }
      }
    },
    //批量设置单个日历班次
    changeWorkingTimesID2(val) {
      this.calenderData.forEach((x) => {
        x.WorkingTimesID = val;
      });
    },
    // 获取这个班次的具体时间
    getTypeData() {},
    // 获取班次
    async getWorkingTimes() {
      let res = await GetSearchData({ dicID: 5033 });
      const { result, data, count, msg } = res.data;
      if (result) {
        this.WorkingTimesIDs = data;
        if (data.length != 0) {
          this.calenderData.forEach((x) => {
            x.WorkingTimesID = data[0].WorkingTimesID;
          });
        }
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
    },
    // 保存排班
    saveWork() {
      let submitData = [];
      if (this.lines.length == 0) {
        this.$message.error("请勾选左侧的线别！");
      } else if (!this.dataPicker) {
        this.$message.error("请选择要配置的日期范围！");
      } else if (!this.WorkingTimesID) {
        this.$message.error("请选择班次！");
      } else {
        this.$confirm("确定要保存配置的排班吗？")
          .then((_) => {
            let BSDay = 1;
            if (_this.largeOrSmall == "小周") {
              BSDay = 0;
            }
            _this.lines.forEach((x) => {
              let obj = {};
              obj["OrganizeID"] = x.OrganizeID;
              obj["WorkingTimesID"] = _this.WorkingTimesID;
              obj["StartDate"] = _this.dataPicker[0];
              obj["EndDate"] = _this.dataPicker[1];
              obj["IsBSDay"] = _this.IsCicle;
              obj["BSDay"] = BSDay;
              obj["children"] = [];
              for (var i = 1; i < 8; i++) {
                let obj2 = {};
                let name = "Week" + i;
                if (i == 7) {
                  obj2["WeekDay"] = 0;
                } else {
                  obj2["WeekDay"] = i;
                }
                if (_this.tableData[0][name]) {
                  obj2["Peoples"] = _this.tableData[0][name];
                } else {
                  obj2["Peoples"] = x.TotalPeoples;
                }
                obj2["H1"] = _this.tableData[1][name];
                obj2["H2"] = _this.tableData[2][name];
                obj["children"].push(obj2);
              }
              submitData.push(obj);
            });
            this.saveArrangeInfo(submitData);
          })
          .catch((_) => {});
      }
    },
    // 清空表格数据
    clearTable() {
      for (var i = 1; i < 8; i++) {
        let name = "Week" + i;
        this.tableData[0][name] = null;
        this.tableData[1][name] = null;
        this.tableData[2][name] = null;
        this.tableData[3][name] = null;
      }
    },
    // 保存排班设置
    async saveArrangeInfo(submitData) {
      this.adminLoading = true;
      let res = await SaveWorkingTimes(submitData);
      const { result, data, count, msg } = res.data;
      if (result) {
       // this.largeOrSmall = null;
        this.dataPicker = [];
        this.WorkingTimesID = null;
        this.IsCicle = false;
        this.clearTable();
        this.adminLoading = false;
        this.$refs.asideRef.$refs.asideTree.setCheckedKeys([]);
        this.$message({
          message: msg,
          type: "success",
          dangerouslyUseHTMLString: true,
        });
      } else {
        this.adminLoading = false;
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
    },
    // 保存单条线的设置  SaveCalendarData  有删除与插入的例子
    async saveOnlyWeek() {
      let obj = {};
      this.lines = this.$refs.asideRef.$refs.asideTree
        .getCheckedNodes()
        .filter((x) => {
          return x.OrganizeTypeID == 6;
        });
      if (this.lines.length == 0 || this.lines.length > 1) {
        this.$message.error("仅限勾选一条线别保存排班配置！");
      } else {
        this.$confirm("确定要保存当前线别的月份排班吗？")
          .then(async (_) => {
            obj["OrganizeID"] = _this.lines[0].OrganizeID;
            obj["YearMonth"] = YearMonth;
            let YearMonth =
              String(_this.calendarMonth.getFullYear()) +
              _this.zero(_this.calendarMonth.getMonth() + 1);
            _this.calenderData.forEach((x) => {
              x.WorkingTimesDetailID = "";
              x.OrganizeID = _this.lines[0].OrganizeID;
              x.YearMonth = YearMonth;
            });
            obj["submitData"] = _this.calenderData;
            // return;
            let res = await SaveLineWorkingTimes(obj);
            const { result, data, count, msg } = res.data;
            if (result) {
              _this.adminLoading = false;
              _this.$message({
                message: msg,
                type: "success",
                dangerouslyUseHTMLString: true,
              });
            } else {
              _this.adminLoading = false;
              _this.$message({
                message: msg,
                type: "error",
                dangerouslyUseHTMLString: true,
              });
            }
          })
          .catch((_) => {});
      }
    },
    // 保存单条线的休假
    saveOnlyWeekRest() {},
    // 点击是否循环大小周
    clickitem(val) {
      val == this.IsCicle ? (this.IsCicle = false) : (this.IsCicle = true);
    },
    // 计算累计工时
    computedTime() {},
    // 点击休息清空上班时间加班时间
    clearInput(val, index) {
      if (val) {
        this.$set(this.calenderData[index], "OverTime", 0);
        this.$set(this.calenderData[index], "WorkTime", 0);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
</style>