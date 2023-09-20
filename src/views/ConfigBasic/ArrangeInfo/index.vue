<!--排班信息-->
<template>
  <div class="APSContainer flex_flex" v-loading="adminLoading">
    <div class="admin_left">
      <ComCheckboxTree
        ref="asideRef"
        :treeData="treeData"
        :treeHeight="treeHeight"
        :title="'车间级信息'"
        :nodekey="'OrganizeID'"
        :treeProps="treeProps"
        @searchTree="searchTree"
        @check="check"
      />
    </div>
    <div class="admin_container">
      <div>
        <div class="admin_content">
          <div class="bgFFF">
            <div class="admin_head flex_row_spaceBtn" ref="headRef">
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
                    v-for="(item, y) in WorkingTimesIDs"
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
                  >是否循环大小周</el-radio
                >
              </div>
              <div>
                <el-button
                  type="success"
                  plain
                  size="mini"
                  :disabled="!isEdit"
                  @click="saveWork"
                  >保存</el-button
                >
              </div>
            </div>
            <div class="margin_lr10">
              <ux-grid size="mini" ref="plxTable" :row-key="true">
                <ux-table-column field="empty" title="" width="160">
                </ux-table-column>
                <ux-table-column
                  v-for="(item, index) in tableHeader"
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
              注意：若是大小周轮流来，请勾选循环大小周，上班人数为0或空，统一取组织人数，如有不规则排班，请选择线别进入排班日历更改，最新的数据将会覆盖旧排班。
            </div>
            <div class="margin_top15 hr-line-dashed"></div>
            <div>
              <div class="admin_head flex_between" ref="headRef">
                <div class="flex">
                  <div class="tree_text">排班日历</div>
                  <el-divider direction="vertical"></el-divider>
                  <el-select
                    size="mini"
                    v-model="WorkingTimesID2"
                    filterable
                    placeholder="批量设置班次"
                    @change="changeWorkingTimesID2"
                  >
                    <el-option
                      v-for="(item, y) in WorkingTimesIDs"
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
                  >保存</el-button
                >
              </div>
              <div class="margin_lr10">
                <el-calendar
                  class="arrange_calendar__body"
                  v-model="calendarMonth"
                >
                  <template slot="dateCell" slot-scope="{ data }">
                    <div :class="data.isSelected ? 'is-selected' : ''">
                      <span v-if="calenderData.length === 0">
                        {{ data.day.split("-").slice(1).join("-") }}
                      </span>
                    </div>
                    <div v-for="(item, index) in calenderData" :key="index">
                      <div
                        class="flex_between"
                        v-if="item.WorkingDate.indexOf(data.day) != -1"
                      >
                        <span>
                          {{ data.day.split("-").slice(1).join("-") }}
                        </span>
                        <el-checkbox
                          v-model="item.ElementDeleteFlag"
                          :true-label="1"
                          :false-label="0"
                        >
                          <span>休</span>
                        </el-checkbox>
                      </div>
                      <div v-if="item.WorkingDate.indexOf(data.day) != -1">
                        <el-row class="text_row">
                          <el-col :span="12"> 班次： </el-col>
                          <el-col :span="12">
                            <el-select
                              size="mini"
                              clearable
                              filterable
                              v-model="item.WorkingTimesID"
                              placeholder=""
                              :disabled="item.ElementDeleteFlag === 1"
                            >
                              <el-option
                                v-for="(item, y) in WorkingTimesIDs"
                                :key="y"
                                :label="item.WorkingTimesName"
                                :value="item.WorkingTimesID"
                              ></el-option>
                            </el-select>
                          </el-col>
                        </el-row>
                        <el-row class="text_row">
                          <el-col :span="12"> 上班人数： </el-col>
                          <el-col :span="12">
                            <el-input
                              size="mini"
                              type="number"
                              v-model="item.Peoples"
                              :disabled="item.ElementDeleteFlag === 1"
                            ></el-input>
                          </el-col>
                        </el-row>
                        <el-row class="text_row">
                          <el-col :span="12"> 总时长： </el-col>
                          <el-col :span="12">
                            <el-input
                              size="mini"
                              type="number"
                              v-model="item.TotalHours"
                              :disabled="item.ElementDeleteFlag === 1"
                            ></el-input>
                          </el-col>
                        </el-row>
                        <el-row class="text_row">
                          <el-col :span="12"> 加班时长： </el-col>
                          <el-col :span="12">
                            <el-input
                              size="mini"
                              type="number"
                              v-model="item.OverTime"
                              :disabled="item.ElementDeleteFlag === 1"
                              @input="totalHoursChange(item)"
                            ></el-input>
                          </el-col>
                        </el-row>
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
      calendarMonth: new Date(),
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
      currentMonth: this.zero(new Date().getMonth() + 1),
      currentYear: new Date().getFullYear(),
      treeListTmp: [],
      treeHeight: "790px",
      lines: [],
      days: 0, //当月天数
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
          this.currentYear = new Date(newValue).getFullYear();
          this.days = this.getDays(this.currentYear, this.currentMonth); // 判断当前月有多少天
          let firstYearMonth = `${this.currentYear}-${this.currentMonth}-01`;
          let lastYearMonth = `${this.currentYear}-${this.currentMonth}-${this.days}`;
          this.formSearchs[0].datas["WorkingDate"] = [
            firstYearMonth,
            lastYearMonth,
          ];
          if (
            new Date(newValue).getMonth() + 1 !==
            new Date(oldValue).getMonth() + 1
          ) {
            this.getTableData(this.formSearchs[0].datas, 0);
          }
        }
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
    totalTimesChange(scope) {
      if (scope.rowIndex != 0) {
        // 上班/加班时间发生改变时计算累加时长
        let name = "Week" + scope.columnIndex;
        let workTimes = this.tableData[1][name] ? this.tableData[1][name] : 0;
        let overTimes = this.tableData[2][name] ? this.tableData[2][name] : 0;
        this.tableData[3][name] = parseFloat(workTimes) + parseFloat(overTimes);
      }
    },
    //累计时长计算
    totalHoursChange(item) {
      item.TotalHours = parseFloat(item.WorkHour) + parseFloat(item.OverTime);
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
    setCalender(Year, Month) {
      this.days = this.getDays(Year, Month); // 判断当前月有多少天
      let WorkingTimesID = "";
      if (this.WorkingTimesIDs.length != 0) {
        WorkingTimesID = this.WorkingTimesIDs[0].WorkingTimesID;
      }
      let firstYearMonth = String(Year) + "-" + String(Month) + "-" + +"01";
      let lastYearMonth = String(Year) + "-" + String(Month) + "-" + this.days;
      this.formSearchs[0].datas["WorkingDate"] = [
        firstYearMonth,
        lastYearMonth,
      ];
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
        this.treeData = JSON.parse(JSON.stringify(data));
        this.treeListTmp = this.treeData;
        this.adminLoading = false;
        this.formSearchs[0].datas["dicID"] = 97;
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
    // 复选框状态改变的时候进行
    check() {
      this.lines = this.$refs.asideRef.$refs.asideTree
        .getCheckedNodes()
        .filter((x) => {
          return x.OrganizeTypeID == 6;
        });
      if (this.lines.length > 1 || this.lines.length == 0) {
        this.cicleName(0, true);
        if (this.lines.length == 0) {
          this.calenderData = [];
        }
      } else if (this.lines.length == 1) {
        this.cicleName(this.lines[0].TotalPeoples, false);
      }
      if (this.lines.length == 1) {
        this.formSearchs[0].datas["OrganizeID"] = this.lines[0].OrganizeID;
        this.getTableData(this.formSearchs[0].datas, 0);
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
      if (this.largeOrSmall == "小周") {
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
      if (this.largeOrSmall == "小周") {
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
      if (this.lines == 0 || this.lines > 1) {
        this.$message.error("请选择仅限一条班次！");
        this.WorkingTimesID2 = null;
        return;
      }
      const newData = this.WorkingTimesIDs.find(
        (x) => x.WorkingTimesID === val
      );
      this.calenderData.forEach((item) => {
        if (item.ElementDeleteFlag === 0) {
          item.TotalHours = newData.TotalHour;
          item.OverTime = newData.OverTimeHour;
          item.WorkingTimesID = val;
        }
      });
    },
    // 获取这个班次的具体时间
    async getTableData(form, remarkTb) {
      this.$set(this.tableLoading, remarkTb, true);
      form["rows"] = this.days;
      form["page"] = this.tablePagination[remarkTb].pageIndex;
      let res = await GetSearchData(form);
      const { result, data, count, msg } = res.data;
      if (result) {
        this.calenderData = [];
        //对没有返回的值进行默认值处理
        for (let i = 0; i < this.days; i++) {
          const date = `${this.currentYear}-${this.currentMonth}-${this.zero(
            i + 1
          )}`;
          const found = data.find((obj) => obj.WorkingDate === date);
          if (found) {
            found["ElementDeleteFlag"] = 0;
            this.calenderData.push(found); // 如果找到了，直接添加到结果数组中
          } else {
            // 如果没有找到，则根据日期生成一个新的对象
            this.calenderData.push({
              ElementDeleteFlag: 1,
              WorkingDate: date,
              dicID: 97,
              OverTime: "",
              Peoples: "",
              WorkHour: "",
              WorkingTimesID: "",
              TotalHours: "",
              OrganizeID: this.formSearchs[0].datas["OrganizeID"],
            });
          }
        }
        console.log(this.calenderData, "this.calenderData");
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
            //对数据进行筛选
            const resultArr = this.calenderData.filter((item) => {
              return item.ElementDeleteFlag === 0 || item.WorkingTimesDetailID;
            });
            let res = await SaveData(resultArr);
            const { result, data, count, msg } = res.data;
            if (result) {
              _this.adminLoading = false;
              _this.$message({
                message: msg,
                type: "success",
                dangerouslyUseHTMLString: true,
              });
              this.getTableData(this.formSearchs[0].datas, 0);
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
    // 点击是否循环大小周
    clickitem(val) {
      val == this.IsCicle ? (this.IsCicle = false) : (this.IsCicle = true);
    },
  },
};
</script>
<style lang="scss" scoped></style>
