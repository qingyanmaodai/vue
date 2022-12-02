<template>
  <div class="container">
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
    <div class="admin_content">
      <div class="ant-table-title">
        <el-row>
          <el-col :span="4"><span class="title">进度</span></el-col>
          <el-col :span="20" class="flex_flex_end">
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
      <div
        ref="gantt"
        class="gantt-container"
        :style="{ height: height }"
      ></div>
      <div class="flex_flex_end">
        <el-pagination
          background
          @size-change="(val) => pageSize(val, 0)"
          :current-page="tablePagination[0].pageIndex"
          :page-sizes="[
            32, 50, 100, 200, 300, 500, 700, 900, 1200, 1500, 1000, 2000, 3000,
            4000, 5000,
          ]"
          :page-size="tablePagination[0].pageSize"
          :total="tablePagination[0].pageTotal"
          @current-change="(val) => pageChange(val, 0)"
          layout="total, sizes, prev, pager, next,jumper"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
var _this;
import ComSearch from "@/components/ComSearch";
import { GetHeader, GetSearchData, ExportData, GetSearch } from "@/api/Common";
import gantt from "dhtmlx-gantt";
import "dhtmlx-gantt/codebase/skins/dhtmlxgantt_terrace.css";
export default {
  name: "GanttTest",
  data() {
    return {
      formSearchs: [
        {
          datas: {},
          forms: [],
        },
      ],
      height: "740px",
      btnForm: [],
      parmsBtn: [
        {
          ButtonCode: "save",
          BtnName: "保存",
          Type: "success",
          Methods: "saveJsonData",
          Params: "",
        },
      ],
      isLoading: false,
      tableData: [[]],
      tableColumns: [[]],
      tableLoading: [false],
      isClear: [false],
      tablePagination: [{ pageIndex: 1, pageSize: 200, pageTotal: 0 }],
      // 甘特图配置
      tasks: {
        data: [
          {
            id: 11,
            task_name: "主任务",
            type: gantt.config.types.project,
            progress: 0.6,
            open: true,
          },

          {
            id: 12,
            task_name: "Task #1",
            start_date: "03-04-2022",
            duration: "5", // 持续时间5天，即结束日期4月8号
            parent: "11",
            progress: 1,
            open: true,
          },
          {
            id: 13,
            task_name: "Task #2",
            start_date: "03-04-2022",
            type: gantt.config.types.project,
            parent: "11",
            progress: 0.5,
            open: true,
          },
          {
            id: 14,
            task_name: "Task #3",
            start_date: "02-04-2022",
            duration: "6",
            parent: "11",
            progress: 0.8,
            open: true,
          },
          {
            id: 15,
            task_name: "Task #4",
            type: gantt.config.types.project,
            parent: "11",
            progress: 0.2,
            open: true,
          },
          {
            id: 16,
            task_name: "Final milestone",
            start_date: "15-04-2022",
            type: gantt.config.types.milestone,
            parent: "11",
            progress: 0,
            open: true,
          },

          {
            id: 17,
            task_name: "Task #2.1",
            start_date: "03-04-2022",
            duration: "2",
            parent: "13",
            progress: 1,
            open: true,
          },
          {
            id: 18,
            task_name: "Task #2.2",
            start_date: "06-04-2022",
            duration: "3",
            parent: "13",
            progress: 0.8,
            open: true,
          },
          {
            id: 19,
            task_name: "Task #2.3",
            start_date: "10-04-2022",
            duration: "4",
            parent: "13",
            progress: 0.2,
            open: true,
          },
          {
            id: 20,
            task_name: "Task #2.4",
            start_date: "10-04-2022",
            duration: "4",
            parent: "13",
            progress: 0,
            open: true,
          },
          {
            id: 21,
            task_name: "Task #4.1",
            start_date: "03-04-2022",
            duration: "4",
            parent: "15",
            progress: 0.5,
            open: true,
          },
          {
            id: 22,
            task_name: "Task #4.2",
            start_date: "03-04-2022",
            duration: "4",
            parent: "15",
            progress: 0.1,
            open: true,
          },
          {
            id: 23,
            task_name: "Mediate milestone",
            start_date: "14-04-2022",
            type: gantt.config.types.milestone,
            parent: "15",
            progress: 0,
            open: true,
          },
        ],
        // 连接线 source来源，target目标
        links: [
          { id: "10", source: "11", target: "12", type: "1" },
          { id: "11", source: "11", target: "13", type: "1" },
          { id: "12", source: "11", target: "14", type: "1" },
          { id: "13", source: "11", target: "15", type: "1" },
          { id: "14", source: "23", target: "16", type: "0" },
          { id: "15", source: "13", target: "17", type: "1" },
          { id: "16", source: "17", target: "18", type: "0" },
          { id: "17", source: "18", target: "19", type: "0" },
          { id: "18", source: "19", target: "20", type: "0" },
          { id: "19", source: "15", target: "21", type: "2" },
          { id: "20", source: "15", target: "22", type: "2" },
          { id: "21", source: "15", target: "23", type: "0" },
        ],
      },
    };
  },
  created() {
    _this = this;
    this.judgeBtn();
    this.getTableHeader();
  },
  mounted() {
    setTimeout(() => {
      this.setHeight();
    }, 350);
  },
  methods: {
    // 判断按钮权限
    judgeBtn() {
      let routeBtn = this.$route.meta.btns;
      let newBtn = [];
      if (routeBtn.length != 0) {
        routeBtn.forEach((x) => {
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
    // 获取表头数据
    async getTableHeader() {
      let IDs = [{ ID: 5158 }];
      let res = await GetHeader(IDs);
      const { datas, forms, result, msg } = res.data;
      if (result) {
        // 获取每个表头
        datas.some((m, i) => {
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
        console.log(this.tableColumns[0]);
        this.getTableData(this.formSearchs[0].datas, 0);
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
        this.$set(this.tableData, remarkTb, data);
        this.$set(this.tablePagination[remarkTb], "pageTotal", count);
        this.tableData[remarkTb] = data;
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
      this.$set(this.tableLoading, remarkTb, false);
    },
    setHeight() {
      let headHeight = this.$refs.headRef.offsetHeight;
      let rem =
        document.documentElement.clientHeight -
        headHeight -
        this.$store.getters.reduceHeight;
      let newHeight = rem + 33 + "px";
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
    // 刷新页面
    refrshPage() {},
    saveJsonData() {
      let jsonData = gantt.serialize();
      console.log(jsonData);
    },
    // 甘特图渲染
    init() {
      // 自动延长时间刻度
      gantt.config.fit_tasks = true;
      // 允许拖放
      gantt.config.drag_project = true;
      // 定义时间格式
      gantt.config.scales = [
        { unit: "month", step: 1, date: "%F, %Y" },
        { unit: "day", step: 1, date: "%j, %D" },
      ];
      // 添加弹窗属性
      gantt.config.lightbox.sections = [
        {
          name: "description",
          height: 70,
          map_to: "task_name",
          type: "textarea",
          focus: true,
        },
        { name: "type", type: "typeselect", map_to: "type" },
        { name: "time", type: "duration", map_to: "auto" },
      ];
      // 设置中文
      gantt.i18n.setLocale("cn");
      // 自定义表头
      gantt.config.columns = [
        {
          name: "task_name",
          tree: true,
          width: 160,
          align: "center",
          label: "任务名称",
          resize: true,
        },
        {
          name: "start_date",
          align: "center",
          label: "开始日期",
          width: 120,
          resize: true,
        },
        {
          name: "end_date",
          align: "center",
          label: "结束日期",
          width: 80,
          resize: true,
        },
        {
          name: "duration",
          align: "center",
          label: "持续天数",
          width: 80,
          resize: true,
        },
        {
          name: "add",
          align: "center",
          label: "",
          width: 80,
          resize: true,
        },
      ];
      //自适应甘特图的尺寸大小, 使得在不出现滚动条的情况下, 显示全部任务
      gantt.config.autosize = true;
      // 自定义时间轴显示内容
      gantt.templates.task_text = function (start, end, task) {
        return task.task_name + "(" + task.duration + "天)";
      };
      //时间轴图表中，如果不设置，只有行边框，区分上下的任务，设置之后带有列的边框，整个时间轴变成格子状。
      gantt.config.show_task_cells = true;
      //当task的长度改变时，自动调整图表坐标轴区间用于适配task的长度
      gantt.config.fit_tasks = true;
      // 时间X轴高度
      gantt.config.scale_height = 60;
      //时间轴图表中，甘特图的高度
      gantt.config.row_height = 36;
      //时间轴图表中，任务条形图的高度
      gantt.config.bar_height = 20;
      //从后端过来的数据格式化 设置有问题
      //   gantt.config.xml_date = "%Y-%m-%d";
      //鼠标悬浮
      gantt.templates.tooltip_text = function (start, end, task) {
        return "<span style='font-size: 14px'>" + task.toolTipsTxt + "</span>";
      };

      gantt.templates.scale_cell_class = function (date) {
        if (date.getDay() == 0 || date.getDay() == 6) {
          return "weekend";
        }
      };

      //任务条上的文字大小 以及取消border自带样式
      gantt.templates.task_class = function (start, end, item) {
        return item.$level == 0 ? "firstLevelTask" : "secondLevelTask";
      };

      // 初始化
      gantt.init(this.$refs.gantt);
      // 数据解析
      gantt.parse(this.tasks);
    },
  },
};
</script>
<style lang="scss" scoped>
.gantt-container {
  width: 100%;
}
.weekend {
  color: blue;
}
.firstLevelTask {
  border: none;
  ::v-deep .gantt_task_content {
    font-weight: bold;
    font-size: 13px;
    color: blue !important;
  }
}
.secondLevelTask {
  border: none;
  color: red;
}
</style>