<template>
  <!-- <card> -->
    <div  class="container" v-loading="adminLoading">
      <div class="admin_head" ref="headRef">
        <!-- <div v-for="(item,i) in 3" :key="i" v-show="labelStatus1 == i"> -->
          <ComSearch ref="searchRef" :searchData="formSearchs[tagRemark].datas" :searchForm="formSearchs[tagRemark].forms" :remark="tagRemark"
            :signName="labelStatus1" :isLoading="isLoading" :btnForm="btnForm" @btnClick="btnClick" />
        <!-- </div> -->
      </div>
      <!-- <div>
        <div class="toolbox" id="toolbox">
          列显示/隐藏:
          <label><input type="checkbox" id="id" checked /> 序号</label>
          <label
            ><input type="checkbox" id="billNo" checked /> 订单跟踪号</label
          >
          <label><input type="checkbox" id="pType" checked /> 工序大类</label>
          <label
            ><input type="checkbox" id="detailCode" checked /> 任务单号</label
          >
          <label><input type="checkbox" id="invCode" checked /> 存货编码</label>
          <label><input type="checkbox" id="invName" checked /> 存货名称</label>
          <label><input type="checkbox" id="produceQty" /> 计划数量</label>
          <label><input type="checkbox" id="confirmQty" /> 完成数量</label>
          <label
            ><input type="checkbox" id="completionRate" checked /> 完成率</label
          >
           
        </div>
      </div> -->
      <!-- 图表 -->
    <div>
      <div  class="admin_content">
        <div class="gstc-wrapper" id="gstc" ref="gstc"></div>
        <!-- <div id="gen"><div>... 数据加载中，请等待 ...</div></div> -->
        <div>
            <div
              class="flex_row_spaceBtn pagination"
            >
              <div>
                <span
                  @click="toPageSetting"
                  class="primaryColor cursor"
                >SysID:{{ sysID[tagRemark].ID }}
                </span>
              </div>
              <div class="flex">
                <el-pagination
                  background
                  @size-change="handleSizeChange"
                  :current-page="tablePagination[tagRemark].pageIndex"
                  :page-sizes="[
                    10,
                    20,
                    30,
                    50,
                    100,
                    150,
                    200,
                    250,
                    300,
                    350,
                    500,
                    400,
                    800,
                    1000,
                    1500,
                    2000,
                    3000,
                    4000,
                    5000
                  ]"
                  :page-size="tablePagination[tagRemark].pageSize"
                  :total="tablePagination[tagRemark].pageTotal"
                  @current-change="pageChange"
                  layout="total, sizes, prev, pager, next,jumper"
                >
                </el-pagination>
              </div>
            </div>
        </div>
      </div>
    </div>
    

    <!-- <JgPage ref="JgPage" :total="totalCount" @getData="getData" /> -->
  <!-- </card> -->
    </div>
    
</template>

<script>
import GSTC from "./plugin/gstc.esm.min.js";
// import GSTC from "gantt-schedule-timeline-calendar/dist/gstc.wasm.esm.min.js";
import "gantt-schedule-timeline-calendar/dist/style.css";
import { Plugin as TimelinePointer } from "gantt-schedule-timeline-calendar/dist/plugins/timeline-pointer.esm.min.js";
// import { Plugin as Selection } from "gantt-schedule-timeline-calendar/dist/plugins/selection.esm.min.js";
// import { Plugin as ItemResizing } from "gantt-schedule-timeline-calendar/dist/plugins/item-resizing.esm.min.js";
// import { Plugin as ItemMovement } from "gantt-schedule-timeline-calendar/dist/plugins/item-movement.esm.min.js";
import { Plugin as CalendarScroll } from "gantt-schedule-timeline-calendar/dist/plugins/calendar-scroll.esm.min.js";
import { Plugin as ProgressBar } from "gantt-schedule-timeline-calendar/dist/plugins/progress-bar.esm.min.js";
import { Plugin as TimeBookmarks } from "gantt-schedule-timeline-calendar/dist/plugins/time-bookmarks.esm.min.js";
import { Plugin as DependencyLines } from "gantt-schedule-timeline-calendar/dist/plugins/dependency-lines.esm.min.js";
// import dayjs from "../../"
// import dayjs from 
// import JgSelect from "@/components/jg-select/index";
// import JgVxeTable from "@/components/jg-vxe-table-new";
// import JgPage from "@/BASEMODULE/components/jg-page";
import { getAllDate } from "@/utils/formatDate";
import ComSearch from "@/components/ComSearch";
import {
    GetHeader,
    GetSearchData
  } from "@/api/Common";
let gstc, state, that;
globalThis.GSTC = gstc; //全局对象
globalThis.state = state; //全局对象
const dateApi = GSTC.api.date;
// 设置时间标签
const bookmarks = {
  now: {
    time: GSTC.api.date().valueOf(),
    label: "Now",
    style: {
      background: "#3498DB",
    },
  },
};
// 进度条左上角的圆点点击事件
function itemSlot(vido, props) {
  const { onChange, html, cache } = vido;
  let position;
  function updatePosition() {
    if (props && props.itemData) {
      position = props.itemData.position;
    }
  }
  updatePosition();
  onChange((changedProps) => {
    props = changedProps;
    updatePosition();
  });

  function onClick(ev) {
    ev.stopPropagation();
    ev.preventDefault();
    if (props.item.pType != null) {
      let obj = that.$_.filter(
        that.$store.getters.getDicItemsType("DETAILED_PLAN"),
        { dicCode: props.item.pType }
      )[0];
      props.item.pTypeName = obj && obj.dicName ? obj.dicName : "";
    }
    that.$Modal.info({
      title: "订单明细",
      content: `<p>订单跟踪号：${props.item.billNo ? props.item.billNo : ""}</p>
      <p>工序大类：${props.item.pTypeName}</p>
      <p>任务单号：${props.item.detailCode ? props.item.detailCode : ""}</p>
      <p>存货编码：${props.item.invCode ? props.item.invCode : ""}</p>
      <p>存货名称：${props.item.invName ? props.item.invName : ""}</p>
      <p>计划数量：${props.item.PlanQty >= 0 ? props.item.PlanQty : 0}</p>
      <p>完成数量：${
        props.item.confirmQty >= 0 ? props.item.confirmQty : 0
      }</p>
      <p>完成率：${
        props.item.ConfirmQty >= 0 && props.item.PlanQty >= 0
          ? (props.item.ConfirmQty / props.item.PlanQty) * 100
          : 0
      }
      </p>
       <p>计划开始时间：${props.item.startTime ? props.item.startTime: ""}</p>
      <p>计划结束时间：${props.item.endTime ? props.item.endTime:""}</p>`,
    });
  }
  // onClick()
  // return render function
  return (content) =>
    cache(
      props && props.item
        ? html`${content}${html`<div
            class=${props.item ? "dot" : ""}
            data-gstcid=${props.item.id}
            data-type="chart-timeline-items-row-item"
            title="订单明细"
            @click="${onClick}"
          ></div>`}`
        : null
    );
}
const days = [
  {
    zoomTo: 100, // we want to display this format for all zoom levels until 100
    period: 'day',
    periodIncrement: 1,
    format({ timeStart }) {
      // return timeStart.format('DD MMMM YYYY (dddd)'); // full list of formats: https://day.js.org/docs/en/display/format
      return timeStart.format('MM/DD');
    },
  },
];

const hours = [
  {
    zoomTo: 19, // we want to display this format for all zoom levels until 100
    period: 'hour',
    periodIncrement: 4,
    main: true,
    format({ timeStart }) {
      return timeStart.format('HH'); // full list of formats: https://day.js.org/docs/en/display/format
    },
  },
];

export default {
  name: "order-gantt-chart-index",
  components: {
    // JgSelect,
    // JgVxeTable,
    // JgPage,
    ComSearch,
  },
  data() {
    return {
      colData:{},
      labelStatus1: 0,
      formSearchs: [{
          datas: {},
          forms: [],
        },
      ],
      tagRemark: 0,
      isLoading: false,
      sysID: [{ID: 6723}],
      btnForm: [],
      parmsBtn: [],
      adminLoading: false,
      tableData: [
          []
      ],
      tableColumns: [
        []
      ],
      tableLoading: [false,],
      isClear: [false,],
      tablePagination: [{
          pageIndex: 1,
          pageSize: 0,
          pageTotal: 0,
        },
      ],
      num: 0,
      itemsData: {}, //右侧项目集合
      rowsData: {}, //行数据集合
      config: {
        innerHeight: 450, //以像素为单位的图表高度
        // headerHeight:70,//标题和日历的高度（以像素为单位）
        // autoInnerHeight: true, //如果要在组件大小的父元素更改时自动计算 innerHeight
        licenseKey: "111",
        plugins: [
          TimelinePointer(), //时间线指针插件，必须在selection, resizing and movement之前
          // Selection(), //区域选择单元格填充颜色
          // ItemResizing(), //项目大小调整插件点击有显示进度拖动按钮，必须在movement之前
          // ItemMovement(),//拖动插件
          CalendarScroll(),
          // HighlightWeekends(),//周末列高亮插件
          ProgressBar(), //进度
          TimeBookmarks({ bookmarks }), //时间书标签插件
          DependencyLines(), //依赖先插件
          // ItemTypes(),进度条类型
        ],
        list: {
          toggle: {
            display: true, //显示或隐藏列表切换，默认true
          },
          row: {
            height: 30,
          },
          // 行属性
          rows: this.rowsData ? this.rowsData : {},
          // 列定义
          columns: {
            data: this.colData?this.colData :{},
            // {
            //   id: {
            //     id: "id",
            //     data: "id",
            //     width: 50,
            //     header: {
            //       content: "序号",
            //     },
            //     hidden: false,
            //   },
            //   billNo: {
            //     id: "billNo",
            //     data: "billNo",
            //     width: 130,
            //     header: {
            //       content: "订单跟踪号",
            //     },
            //     hidden: false,
            //     // expander: true,
            //     // sortable: "order",
            //     // activeColumnId:'order'
            //   },
            //   pType: {
            //     id: "pType",
            //     data: ({ row }) => {
            //       if (row.pType != null) {
            //         let obj = this.$_.filter(
            //           this.$store.getters.getDicItemsType("DETAILED_PLAN"),
            //           { dicCode: row.pType }
            //         )[0];
            //         return obj && obj.dicName ? obj.dicName : "";
            //       }
            //     }, //字段,
            //     width: 80,
            //     header: {
            //       content: "工序大类",
            //     },
            //     hidden: false,
            //     // sortable: "order",
            //     // activeColumnId:'order'
            //   },
            //   detailCode: {
            //     id: "detailCode",
            //     data: "detailCode",
            //     width: 80,

            //     header: {
            //       content: "任务单号",
            //     },
            //     hidden: false,
            //     // sortable: "label",
            //     // hidden:true,//隐藏列
            //   },
            //   invCode: {
            //     id: "invCode",
            //     data: "invCode",
            //     width: 80,
            //     header: {
            //       content: "存货编码",
            //     },
            //     hidden: false,
            //     // sortable: "label",
            //     // hidden:true,//隐藏列
                
            //   },
            //   invName: {
            //     id: "invName",
            //     data: "invName",
            //     width: 80,
            //     header: {
            //       content: "存货名称",
            //     },
            //     hidden: false,
            //     // sortable: "label",
            //     // hidden:true,//隐藏列
            //   },
            //   produceQty: {
            //     id: "produceQty",
            //     data: "produceQty",
            //     width: 80,
            //     header: {
            //       content: "计划数量",
            //     },
            //     hidden: true,
            //     // sortable: "label",
            //     // hidden:true,//隐藏列、
            //   },
            //   confirmQty: {
            //     id: "confirmQty",
            //     data: "confirmQty",
            //     width: 80,
            //     header: {
            //       content: "完成数量",
            //     },
            //     hidden: true,
            //     // sortable: "label",
            //     // hidden:true,//隐藏列
                
            //   },
            //   completionRate: {
            //     id: "completionRate",
            //     data: "completionRate",
            //     width: 80,
            //     header: {
            //       content: "完成率(%)",
            //     },
            //     hidden: false,
                
            //   },
            // },
            resizer: {
              // width: 5000,
              // dots: 100,
            },
            // minWidth: 10,
          },
        },
        chart: {
          // calendarLevels: [ bottom],
          calendarLevels: [days, hours],
          time: {
            // period: 'hour',
            // top: 10,
            // calculatedZoomMode: true,
            // type:'milestone',
            overlap: false,
            // height:10,
            // 时间轴开始截至，
            from: 0, //设置左侧的特定时间
            to: 0, //设置右侧的特定时间
            zoom: 19, // 10-22 缩放，默认 Shift + 滚轮， 默认缩放展示时间粒度， 一共有 小时、天、周、月、年
          },
          item: {
            gap: {
              top: 4,
              bottom: 4,
            },
          },
          items: this.itemsData ? this.itemsData : {},
          grid: {
            cell: {
              onCreate: [this.onCellCreateVacation],
            },
          },
          scroll: {
            vertical: { precise: true },
            horizontal: { precise: true },
          },
          slots: {},
          // spacing:100,
        },
        locale: {
          name: "zh",
          Now: "Now",
          // "X-Scale": "调整X时间轴：",
          // "Y-Scale": "调整Y时间轴：",
          // "Task list width": "列表栏宽度：",
          // "Before/After": "前后距离：",
          // "Display task list": "列表栏",
          weekdays: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
          months: [
            "一月",
            "二月",
            "三月",
            "四月",
            "五月",
            "六月",
            "七月",
            "八月",
            "九月",
            "十月",
            "十一月",
            "十二月",
          ],
        },
        actions: {},
        slots: {
          "chart-timeline-items-row-item": { outer: [itemSlot] },
        },
      },
      orderList: [],
      treeData: [],
      strokeColor: "#BFEFFF",
      plGanttColumns: [
        { width: 40, title: "序号", fixed: "left", type: "seq" },
        {
          minWidth: 100,
          title: "订单跟踪号",
          field: "billNo",
          sortable: true,
        },
        {
          minWidth: 100,
          title: "工序类型",
          field: "pName",
          sortable: true,
        },
        {
          minWidth: 100,
          title: "任务单号",
          field: "detailCode",
          sortable: true,
        },
        {
          minWidth: 100,
          title: "存货编码",
          field: "invCode",
          sortable: true,
        },
        {
          minWidth: 100,
          title: "存货名称",
          field: "invName",
          sortable: true,
        },
        {
          minWidth: 100,
          title: "计划数量",
          field: "PlanQty",
          sortable: true,
        },
        {
          minWidth: 100,
          title: "完成数量",
          field: "confirmQty",
          sortable: true,
        },
        {
          minWidth: 100,
          title: "完成率(%)",
          field: "completionRate",
          sortable: true,
        },
      ],
      rowPlCode: "",
      formSearch: {
        selectValue: null,
        inputValue: null,
        planOverTime: null,
        planStartTime: null,
      },
      plParams: {
        params: { useStatus: 0 },
      },
      plColumns: [
        { title: "主资源编码", key: "plCode" },
        { title: "主资源名称", key: "plName" },
      ],
      plValue: [],
      tableOptions: {
        rowId: "eid",
        toolbarConfig: {
          perfect: true,
          zoom: true,
          slots: {
            // 自定义工具栏模板
            tools: "toolbar_tools",
            // 自定义插槽模板
            buttons: "toolbar_buttons",
          },
        },
      },
      pageSize: 10,
      current: 1,
      totalCount: 0,
      tableHeight: 443,
      tableData: [],
      columns: [
        { width: 40, title: "序号", fixed: "left", type: "seq" },
        {
          minWidth: 150,
          title: "订单跟踪号",
          field: "billNo",
          sortable: true,
        },
        { width: 100, title: "工序类型", field: "pName", sortable: true },
        {
          minWidth: 150,
          title: "任务单号",
          field: "detailCode",
          sortable: true,
        },
        {
          minWidth: 150,
          title: "存货编码",
          field: "invCode",
          sortable: true,
        },
        {
          minWidth: 150,
          title: "存货名称",
          field: "invName",
          sortable: true,
        },
        {
          minWidth: 200,
          title: "规格型号",
          field: "invStd",
          sortable: true,
        },
        {
          width: 80,
          title: "计划数量",
          field: "PlanQty",
          sortable: true,
        },
        {
          width: 80,
          title: "完成数量",
          field: "ConfirmQty",
          sortable: true,
        },
        {
          width: 80,
          title: "完成率(%)",
          field: "completionRate",
          sortable: true,
          formatter: ({ row }) => {
            if (row.ConfirmQty >= 0 && row.PlanQty >= 0) {
              return (row.ConfirmQty / row.PlanQty) * 100;
            }
          },
        },
        {
          width: 150,
          title: "计划开始时间",
          field: "planStartTime",
          sortable: true,
          formatter: ({ row }) => {
            return row.planStartTime
              ? this.$moment(row.planStartTime).format("YYYY-MM-DD HH:mm:ss")
              : "";
          },
        },
        {
          width: 150,
          title: "计划结束时间",
          field: "planOverTime",
          sortable: true,
          formatter: ({ row }) => {
            return row.planOverTime
              ? this.$moment(row.planOverTime).format("YYYY-MM-DD HH:mm:ss")
              : "";
          },
        },
        {
          minWidth: 150,
          title: "主资源名称",
          field: "plName",
          sortable: true,
        },
        {
          minWidth: 150,
          title: "机台/线体名称",
          field: "pmName",
          sortable: true,
        },
        {
          minWidth: 150,
          title: "模具名称",
          field: "pplName",
          sortable: true,
        },
      ],
      updataTableHeight: this.$_.debounce(() => {
        // this.computTableHeight(true);
      }),
    };
  },
  created() {
    this.judgeBtn();
    this.getTableHeader()
  },
  mounted() {
    that = this;
    //初始化计划开始时间和结束时间为当前时间开始的一个月查询范围
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let startDate = `${year}-${month}-${day}`;
    date.setMonth(month); //设置为当前月份，得到是n+1月份
    year = date.getFullYear();
    month = date.getMonth() + 1;
    day = date.getDate();
    let endDate = `${year}-${month}-${day}`;
    this.formSearch.planStartTime = startDate;
    this.formSearch.planOverTime = endDate;
    // 初始化组件并将其挂载到 DOM
    // 监听窗口变动
    // this.$nextTick(this.computTableHeight);
    this.computTableHeight();
    
    // window.addEventListener("resize", this.updataTableHeight);

    this.config.innerHeight = this.tableHeight;
    state = GSTC.api.stateFromConfig(this.config);
    gstc = GSTC({
      element: this.$refs["gstc"],
      state,
    });
    this.getData();
    // 列显示隐藏
    let allCheck = true;
    // 序号显示隐藏的触发事件
    // document.getElementById("id").addEventListener("change", (ev) => {
    //   this.config.list.columns.data.id.hidden = !ev.target.checked;
    //   state.update("config.list.columns.data.id.hidden", () => {
    //     return !ev.target.checked;
    //   });
    //   // 触发每个切换按钮时，需要判断当前是否全隐藏状态，如果全部隐藏不显示全局切换按钮，否则显示
    //   allCheck = false;
    //   for (let obj in this.config.list.columns.data) {
    //     if (!this.config.list.columns.data[obj].hidden) {
    //       allCheck = true;
    //       break;
    //     }
    //   }
    //   state.update("config.list.toggle.display", () => {
    //     return allCheck;
    //   });
    // });
    // // 机台显示隐藏的触发事件
    // document.getElementById("billNo").addEventListener("change", (ev) => {
    //   this.config.list.columns.data.billNo.hidden = !ev.target.checked;
    //   state.update("config.list.columns.data.billNo.hidden", () => {
    //     return !ev.target.checked;
    //   });
    //   allCheck = false;
    //   for (let obj in this.config.list.columns.data) {
    //     if (!this.config.list.columns.data[obj].hidden) {
    //       allCheck = true;
    //       break;
    //     }
    //   }
    //   state.update("config.list.toggle.display", () => {
    //     return allCheck;
    //   });
    // });
    // // 主资源显示隐藏的触发事件
    // document.getElementById("pType").addEventListener("change", (ev) => {
    //   this.config.list.columns.data.pType.hidden = !ev.target.checked;
    //   state.update("config.list.columns.data.pType.hidden", () => {
    //     return !ev.target.checked;
    //   });
    //   allCheck = false;
    //   for (let obj in this.config.list.columns.data) {
    //     if (!this.config.list.columns.data[obj].hidden) {
    //       allCheck = true;
    //       break;
    //     }
    //   }
    //   state.update("config.list.toggle.display", () => {
    //     return allCheck;
    //   });
    // });
    // document.getElementById("detailCode").addEventListener("change", (ev) => {
    //   this.config.list.columns.data.detailCode.hidden = !ev.target.checked;
    //   state.update("config.list.columns.data.detailCode.hidden", () => {
    //     return !ev.target.checked;
    //   });
    //   allCheck = false;
    //   for (let obj in this.config.list.columns.data) {
    //     if (!this.config.list.columns.data[obj].hidden) {
    //       allCheck = true;
    //       break;
    //     }
    //   }
    //   state.update("config.list.toggle.display", () => {
    //     return allCheck;
    //   });
    // });
    // document.getElementById("invCode").addEventListener("change", (ev) => {
    //   this.config.list.columns.data.invCode.hidden = !ev.target.checked;
    //   state.update("config.list.columns.data.invCode.hidden", () => {
    //     return !ev.target.checked;
    //   });
    //   allCheck = false;
    //   for (let obj in this.config.list.columns.data) {
    //     if (!this.config.list.columns.data[obj].hidden) {
    //       allCheck = true;
    //       break;
    //     }
    //   }
    //   state.update("config.list.toggle.display", () => {
    //     return allCheck;
    //   });
    // });
    // document.getElementById("invName").addEventListener("change", (ev) => {
    //   this.config.list.columns.data.invName.hidden = !ev.target.checked;
    //   state.update("config.list.columns.data.invName.hidden", () => {
    //     return !ev.target.checked;
    //   });
    //   allCheck = false;
    //   for (let obj in this.config.list.columns.data) {
    //     if (!this.config.list.columns.data[obj].hidden) {
    //       allCheck = true;
    //       break;
    //     }
    //   }
    //   state.update("config.list.toggle.display", () => {
    //     return allCheck;
    //   });
    // });
    // document.getElementById("produceQty").addEventListener("change", (ev) => {
    //   this.config.list.columns.data.produceQty.hidden = !ev.target.checked;
    //   state.update("config.list.columns.data.produceQty.hidden", () => {
    //     return !ev.target.checked;
    //   });
    //   allCheck = false;
    //   for (let obj in this.config.list.columns.data) {
    //     if (!this.config.list.columns.data[obj].hidden) {
    //       allCheck = true;
    //       break;
    //     }
    //   }
    //   state.update("config.list.toggle.display", () => {
    //     return allCheck;
    //   });
    // });
    // document.getElementById("completedQty").addEventListener("change", (ev) => {
    //   this.config.list.columns.data.completedQty.hidden = !ev.target.checked;
    //   state.update("config.list.columns.data.completedQty.hidden", () => {
    //     return !ev.target.checked;
    //   });
    //   allCheck = false;
    //   for (let obj in this.config.list.columns.data) {
    //     if (!this.config.list.columns.data[obj].hidden) {
    //       allCheck = true;
    //       break;
    //     }
    //   }
    //   state.update("config.list.toggle.display", () => {
    //     return allCheck;
    //   });
    // });
    // document
    //   .getElementById("completionRate")
    //   .addEventListener("change", (ev) => {
    //     this.config.list.columns.data.completionRate.hidden =
    //       !ev.target.checked;
    //     state.update("config.list.columns.data.completionRate.hidden", () => {
    //       return !ev.target.checked;
    //     });
    //     allCheck = false;
    //     for (let obj in this.config.list.columns.data) {
    //       if (!this.config.list.columns.data[obj].hidden) {
    //         allCheck = true;
    //         break;
    //       }
    //     }
    //     state.update("config.list.toggle.display", () => {
    //       return allCheck;
    //     });
    //   });
  },
  beforeUnmount() {
    if (gstc) gstc.destroy();
  },
  methods: {
    // 假日标记，rows写入非工作日，属性必填，值可为空，否则报错
    onCellCreateVacation({ time, row, vido, content }) {
      if (
        row.vacations &&
        row.vacations.includes(time.leftGlobalDate.format("YYYY-MM-DD"))
      ) {
        return vido.html`<div title="休息日" style="height:100%"><div style="
        font-size: 14px;
        background: #eee;
        color: red;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;"
        ></div></div>${content}`;
      }
      return content;
    },
    // 随机色
    getRandomColor() {
      let color = "#" + Math.random().toString(16).substr(-6);
      if (color === "#fffff") {
        color = "#1EBC61";
      } else if (color === "#000000") {
        color = "#0EAC51";
      }
      this.strokeColor = color;
      return color;
    },
    // 配置发生改变更新
    configUpdate(minStartTime, maxEndTime) {
      setTimeout(() => {
        state.update("config", (config) => {
          config.list.rows = this.rowsData;
          config.chart.items = this.itemsData;
          config.chart.time.from = minStartTime;
          config.chart.time.to = dateApi(this.$moment(this.formSearch.planOverTime).format("YYYY-MM-DD")).valueOf();
          config.chart.time.to = dateApi(this.formSearch.planOverTime).valueOf();
          config.list.columns.data = this.colData
          console.log('config',config)
          return config;
        });
        if (this.num == 0) {
          // 刷新
          gstc.reload();
          this.num++;
        }
      }, 0);
    },
    // 后端拿到的数据没有不零和计算得到的getAllDate格式不一样需要转化
    timeFormat(date) {
      let y = date.getFullYear(); // 年
      let m = date.getMonth() + 1; // 月
      let d = date.getDate(); // 日
      // if (num === 1) {
      //   d = date.getDate();
      // }
      m = m < 10 ? "0" + m : m;
      d = d < 10 ? "0" + d : d;
      return y + "-" + m + "-" + d;
    },
    // 递归树结构并成一层结构
    handleTree(data) {
      return data.filter((item) => {
        // 默认为多工序
        // item.multiProcess = true
        this.treeData.push(item);
        if (item.level === 1 && item.children && item.children.length === 1) {
          item.singProcess = true;
        }
        if (item.children && item.children.length) {
          // item.rowNum = _.uniqueId('rowNum_')

          item.children.forEach((element) => {
            if (!element.level) {
              element.level = item.level + 1;
              element.rowNum = _.uniqueId("rowNum_");
            }
            //如果父级为单工序，子级也属于单工序，不需要连线属性
            if (item.singProcess) {
              element.singProcess = item.singProcess;
            }
            // debugger
          });
          //判断是否单工序，单工序不需要连接线

          // item.children = this.handleTree(item.children);
        }
        return true;
      });
    },
    // 主表甘特图查询数据
    async getData(pageIndex = 1, pageRows = 10) {
      let self = this;
      if (self.formSearch.inputValue && !self.formSearch.selectValue) {
        //查询时必须有查询条件支撑才能查到对应数据先做判断拦截
        self.$Message.warning("输入框输入内容时，需要选择查询条件!");
        return;
      }
      let options = {
        url: "/api/plan/jgaps-detailed-scheduling/order-gantt-Chart",
        params: {
          params: {
            planStartTime: '',
            planOverTime: '',
          },
          pageIndex,
          pageRows,
        },
      };
      if (self.formSearch.inputValue && self.formSearch.selectValue) {
        // 传入动态查询条件字段,此代码导致控制台报错，未找到解决方法
        options.params.params[self.formSearch.selectValue] = _.cloneDeep(
          self.formSearch.inputValue
        );
      }
      self.treeData = [];
      self.rowsData = {};
      self.itemsData = {};
      let minStartTime = 0;
      let maxEndTime = 0;
    //   // 参数1和参数2获取开始到结束期间的所有日期
      let allDates = getAllDate(
        options.params.params.planStartTime,
        options.params.params.planOverTime
      );
    //   let res = await HttpUtil.requestData(options);
      let res = {
        data:{
  "preIndex": 1,
  "curIndex": 1,
  "nextIndex": 1,
  "pageSize": 10,
  "count": 7,
  "pagesCount": 1,
  "data": [
    {
      "PlanQty": 100,
      "color": "#446C00",
      "children": [
        {
          "PlanQty": 100,
          "color": "#446C00",
          "children": [
            {
              "scheduleType": null,
              "OrderNo": "20220716000004",
              "depCode": null,
              "depName": null,
              "proModel": null,
              "Code": "10080000005B",
              "invName": "多功能烤盘汤锅组件/米白色",
              "invStd": null,
              "unitId": null,
              "unitName": null,
              "cusCode": null,
              "cusName": null,
              "orderPriority": null,
              "billNo": "5101-220315004",
              "deliveryDate": null,
              "factoryDeliveryDate": null,
              "demandQty": null,
              "produceCode": null,
              "demandType": null,
              "emergencyInsertion": null,
              "appointSchedulingStartDate": null,
              "planStartTime": null,
              "planOverTime": null,
              "businessStatus": null,
              "actStaTime": null,
              "actCptTime": null,
              "deviationDays": null,
              "detailScId": null,
              "detailCode": "20220716000004-1-1",
              "progressStatus": null,
              "workingProcedure": null,
              "plCode": "CSX001",
              "plName": "生产A线",
              "startTime": "2022-07-19 08:53:29",
              "endTime": "2022-07-19 09:23:29",
              "transferTime": null,
              "prepareTime": null,
              "processTime": null,
              "processBatch": null,
              "waitTime": null,
              "transportMode": null,
              "transportBatch": null,
              "continueMode": null,
              "finishRate": null,
              "wasteQty": null,
              "hangUpStatus": null,
              "occupiedCapacity": null,
              "PlanQty": 100,
              "produceInvCode": null,
              "releaseStatus": null,
              "produceInvName": null,
              "level": null,
              "locking": null,
              "ConfirmQty": 0,
              "proInvCode": null,
              "apsModelCode": null,
              "kittingState": null,
              "materialHelpCode": null,
              "erpStatus": null,
              "releaseStatusAll": null,
              "salesOrderCode": null,
              "remark": null,
              "routeType": null,
              "remarks": null,
              "totalProQty": null,
              "proQty": null,
              "orderNumber": null,
              "unCompletedQty": null,
              "completionRate": null,
              "kittingOrder": null,
              "kittingQty": null,
              "expectStartDate": null,
              "erpCreationDate": null,
              "isFormalDetails": null,
              "dailyTime": null,
              "pCode": null,
              "pName": null,
              "preAssembledStatus": null,
              "pType": null,
              "pmName": null,
              "pplName": null,
              "calendar": [
                "2022-7-19",
                "2022-7-20",
                "2022-7-21",
                "2022-7-22",
                "2022-7-23",
                "2022-7-25",
                "2022-7-26",
                "2022-7-27",
                "2022-7-28",
                "2022-7-29",
                "2022-7-30",
                "2022-8-1",
                "2022-8-2",
                "2022-8-3",
                "2022-8-4"
              ],
              "color": "#446C00",
              "dataSource": null,
              "orderPushCheckResult": null,
              "operationType": null,
              "processName": null,
              "changePlCode": null,
              "changePlName": null,
              "dirId": null,
              "billId": null,
              "pbrId": null,
              "invId": null,
              "plId": null,
              "depId": null,
              "oper": null,
              "endType": null,
              "pmCode": null,
              "pplCode": null,
              "changePmCode": null,
              "changePplCode": null,
              "preassembled": null
            }
          ],
          "pType": null,
          "startTime": "2022-07-19 08:53:29",
          "endTime": "2022-07-19 09:23:29",
          "billNo": "5101-220315004",
          "ConfirmQty": 0
        }
      ],
      "startTime": "2022-07-19 08:53:29",
      "invName": "多功能烤盘汤锅组件/米白色",
      "endTime": "2022-07-19 09:23:29",
      "Code": "10080000005B",
      "billNo": "5101-220315004",
      "ConfirmQty": 0
    },
    {
      "PlanQty": 30,
      "color": "#083BF9",
      "children": [
        {
          "PlanQty": 30,
          "color": "#083BF9",
          "children": [
            {
              "scheduleType": null,
              "OrderNo": "20220716000003",
              "depCode": null,
              "depName": null,
              "proModel": null,
              "Code": "10070000001A",
              "invName": "空气烤炸杯烤盘组件",
              "invStd": null,
              "unitId": null,
              "unitName": null,
              "cusCode": null,
              "cusName": null,
              "orderPriority": null,
              "billNo": "5101-220315002",
              "deliveryDate": null,
              "factoryDeliveryDate": null,
              "demandQty": null,
              "produceCode": null,
              "demandType": null,
              "emergencyInsertion": null,
              "appointSchedulingStartDate": null,
              "planStartTime": null,
              "planOverTime": null,
              "businessStatus": null,
              "actStaTime": null,
              "actCptTime": null,
              "deviationDays": null,
              "detailScId": null,
              "detailCode": "20220716000003-1-1",
              "progressStatus": null,
              "workingProcedure": null,
              "plCode": "CSX001",
              "plName": "生产A线",
              "startTime": "2022-07-19 09:23:30",
              "endTime": "2022-07-19 09:32:30",
              "transferTime": null,
              "prepareTime": null,
              "processTime": null,
              "processBatch": null,
              "waitTime": null,
              "transportMode": null,
              "transportBatch": null,
              "continueMode": null,
              "finishRate": null,
              "wasteQty": null,
              "hangUpStatus": null,
              "occupiedCapacity": null,
              "PlanQty": 30,
              "produceInvCode": null,
              "releaseStatus": null,
              "produceInvName": null,
              "level": null,
              "locking": null,
              "ConfirmQty": 0,
              "proInvCode": null,
              "apsModelCode": null,
              "kittingState": null,
              "materialHelpCode": null,
              "erpStatus": null,
              "releaseStatusAll": null,
              "salesOrderCode": null,
              "remark": null,
              "routeType": null,
              "remarks": null,
              "totalProQty": null,
              "proQty": null,
              "orderNumber": null,
              "unCompletedQty": null,
              "completionRate": null,
              "kittingOrder": null,
              "kittingQty": null,
              "expectStartDate": null,
              "erpCreationDate": null,
              "isFormalDetails": null,
              "dailyTime": null,
              "pCode": "ZZX001",
              "pName": "总装线开工",
              "preAssembledStatus": null,
              "pType": null,
              "pmName": null,
              "pplName": null,
              "calendar": [
                "2022-7-19",
                "2022-7-20",
                "2022-7-21",
                "2022-7-22",
                "2022-7-23",
                "2022-7-25",
                "2022-7-26",
                "2022-7-27",
                "2022-7-28",
                "2022-7-29",
                "2022-7-30",
                "2022-8-1",
                "2022-8-2",
                "2022-8-3",
                "2022-8-4"
              ],
              "color": "#083BF9",
              "dataSource": null,
              "orderPushCheckResult": null,
              "operationType": null,
              "processName": null,
              "changePlCode": null,
              "changePlName": null,
              "dirId": null,
              "billId": null,
              "pbrId": null,
              "invId": null,
              "plId": null,
              "depId": null,
              "oper": null,
              "endType": null,
              "pmCode": null,
              "pplCode": null,
              "changePmCode": null,
              "changePplCode": null,
              "preassembled": null
            }
          ],
          "pType": null,
          "startTime": "2022-07-19 09:23:30",
          "endTime": "2022-07-19 09:32:30",
          "billNo": "5101-220315002",
          "ConfirmQty": 0
        }
      ],
      "startTime": "2022-07-19 09:23:30",
      "invName": "空气烤炸杯烤盘组件",
      "endTime": "2022-07-19 09:32:30",
      "Code": "10070000001A",
      "billNo": "5101-220315002",
      "ConfirmQty": 0
    },
    {
      "PlanQty": 15,
      "color": "#D62175",
      "children": [
        {
          "PlanQty": 15,
          "color": "#D62175",
          "children": [
            {
              "scheduleType": null,
              "OrderNo": "20220716000005",
              "depCode": null,
              "depName": null,
              "proModel": null,
              "Code": "10010000055A",
              "invName": "韩国-EMK无烟烤盘(配件)",
              "invStd": null,
              "unitId": null,
              "unitName": null,
              "cusCode": null,
              "cusName": null,
              "orderPriority": null,
              "billNo": "5101-220422001",
              "deliveryDate": null,
              "factoryDeliveryDate": null,
              "demandQty": null,
              "produceCode": null,
              "demandType": null,
              "emergencyInsertion": null,
              "appointSchedulingStartDate": null,
              "planStartTime": null,
              "planOverTime": null,
              "businessStatus": null,
              "actStaTime": null,
              "actCptTime": null,
              "deviationDays": null,
              "detailScId": null,
              "detailCode": "20220716000005-1-1",
              "progressStatus": null,
              "workingProcedure": null,
              "plCode": "CSX001",
              "plName": "生产A线",
              "startTime": "2022-07-19 09:32:31",
              "endTime": "2022-07-19 09:37:01",
              "transferTime": null,
              "prepareTime": null,
              "processTime": null,
              "processBatch": null,
              "waitTime": null,
              "transportMode": null,
              "transportBatch": null,
              "continueMode": null,
              "finishRate": null,
              "wasteQty": null,
              "hangUpStatus": null,
              "occupiedCapacity": null,
              "PlanQty": 15,
              "produceInvCode": null,
              "releaseStatus": null,
              "produceInvName": null,
              "level": null,
              "locking": null,
              "ConfirmQty": 0,
              "proInvCode": null,
              "apsModelCode": null,
              "kittingState": null,
              "materialHelpCode": null,
              "erpStatus": null,
              "releaseStatusAll": null,
              "salesOrderCode": null,
              "remark": null,
              "routeType": null,
              "remarks": null,
              "totalProQty": null,
              "proQty": null,
              "orderNumber": null,
              "unCompletedQty": null,
              "completionRate": null,
              "kittingOrder": null,
              "kittingQty": null,
              "expectStartDate": null,
              "erpCreationDate": null,
              "isFormalDetails": null,
              "dailyTime": null,
              "pCode": "ZZX001",
              "pName": "总装线开工",
              "preAssembledStatus": null,
              "pType": null,
              "pmName": null,
              "pplName": null,
              "calendar": [
                "2022-7-19",
                "2022-7-20",
                "2022-7-21",
                "2022-7-22",
                "2022-7-23",
                "2022-7-25",
                "2022-7-26",
                "2022-7-27",
                "2022-7-28",
                "2022-7-29",
                "2022-7-30",
                "2022-8-1",
                "2022-8-2",
                "2022-8-3",
                "2022-8-4"
              ],
              "color": "#D62175",
              "dataSource": null,
              "orderPushCheckResult": null,
              "operationType": null,
              "processName": null,
              "changePlCode": null,
              "changePlName": null,
              "dirId": null,
              "billId": null,
              "pbrId": null,
              "invId": null,
              "plId": null,
              "depId": null,
              "oper": null,
              "endType": null,
              "pmCode": null,
              "pplCode": null,
              "changePmCode": null,
              "changePplCode": null,
              "preassembled": null
            }
          ],
          "pType": null,
          "startTime": "2022-07-19 09:32:31",
          "endTime": "2022-07-19 09:37:01",
          "billNo": "5101-220422001",
          "ConfirmQty": 0
        }
      ],
      "startTime": "2022-07-19 09:32:31",
      "invName": "韩国-EMK无烟烤盘(配件)",
      "endTime": "2022-07-19 09:37:01",
      "Code": "10010000055A",
      "billNo": "5101-220422001",
      "ConfirmQty": 0
    },
    {
      "PlanQty": 690,
      "color": "#F390C9",
      "children": [
        {
          "PlanQty": 690,
          "color": "#F390C9",
          "children": [
            {
              "scheduleType": null,
              "OrderNo": "20220716000011",
              "depCode": null,
              "depName": null,
              "proModel": null,
              "Code": "10220010001A",
              "invName": "AF702109机械玻璃空气烤炸锅/大宇",
              "invStd": null,
              "unitId": null,
              "unitName": null,
              "cusCode": null,
              "cusName": null,
              "orderPriority": null,
              "billNo": "5101-220606001",
              "deliveryDate": null,
              "factoryDeliveryDate": null,
              "demandQty": null,
              "produceCode": null,
              "demandType": null,
              "emergencyInsertion": null,
              "appointSchedulingStartDate": null,
              "planStartTime": null,
              "planOverTime": null,
              "businessStatus": null,
              "actStaTime": null,
              "actCptTime": null,
              "deviationDays": null,
              "detailScId": null,
              "detailCode": "20220716000011-1-1",
              "progressStatus": null,
              "workingProcedure": null,
              "plCode": "CSX001",
              "plName": "生产A线",
              "startTime": "2022-07-19 09:37:02",
              "endTime": "2022-07-19 15:04:02",
              "transferTime": null,
              "prepareTime": null,
              "processTime": null,
              "processBatch": null,
              "waitTime": null,
              "transportMode": null,
              "transportBatch": null,
              "continueMode": null,
              "finishRate": null,
              "wasteQty": null,
              "hangUpStatus": null,
              "occupiedCapacity": null,
              "PlanQty": 690,
              "produceInvCode": null,
              "releaseStatus": null,
              "produceInvName": null,
              "level": null,
              "locking": null,
              "ConfirmQty": 0,
              "proInvCode": null,
              "apsModelCode": null,
              "kittingState": null,
              "materialHelpCode": null,
              "erpStatus": null,
              "releaseStatusAll": null,
              "salesOrderCode": null,
              "remark": null,
              "routeType": null,
              "remarks": null,
              "totalProQty": null,
              "proQty": null,
              "orderNumber": null,
              "unCompletedQty": null,
              "completionRate": null,
              "kittingOrder": null,
              "kittingQty": null,
              "expectStartDate": null,
              "erpCreationDate": null,
              "isFormalDetails": null,
              "dailyTime": null,
              "pCode": null,
              "pName": null,
              "preAssembledStatus": null,
              "pType": null,
              "pmName": null,
              "pplName": null,
              "calendar": [
                "2022-7-19",
                "2022-7-20",
                "2022-7-21",
                "2022-7-22",
                "2022-7-23",
                "2022-7-25",
                "2022-7-26",
                "2022-7-27",
                "2022-7-28",
                "2022-7-29",
                "2022-7-30",
                "2022-8-1",
                "2022-8-2",
                "2022-8-3",
                "2022-8-4"
              ],
              "color": "#F390C9",
              "dataSource": null,
              "orderPushCheckResult": null,
              "operationType": null,
              "processName": null,
              "changePlCode": null,
              "changePlName": null,
              "dirId": null,
              "billId": null,
              "pbrId": null,
              "invId": null,
              "plId": null,
              "depId": null,
              "oper": null,
              "endType": null,
              "pmCode": null,
              "pplCode": null,
              "changePmCode": null,
              "changePplCode": null,
              "preassembled": null
            }
          ],
          "pType": null,
          "startTime": "2022-07-19 09:37:02",
          "endTime": "2022-07-19 15:04:02",
          "billNo": "5101-220606001",
          "ConfirmQty": 0
        }
      ],
      "startTime": "2022-07-19 09:37:02",
      "invName": "AF702109机械玻璃空气烤炸锅/大宇",
      "endTime": "2022-07-19 15:04:02",
      "Code": "10220010001A",
      "billNo": "5101-220606001",
      "ConfirmQty": 0
    },
    {
      "PlanQty": 63,
      "color": "#D29419",
      "children": [
        {
          "PlanQty": 63,
          "color": "#D29419",
          "children": [
            {
              "scheduleType": null,
              "OrderNo": "20220716000016",
              "depCode": null,
              "depName": null,
              "proModel": null,
              "Code": "10010010004E",
              "invName": "无烟烤盘（澳洲/（彩盒外箱）新程序V1",
              "invStd": null,
              "unitId": null,
              "unitName": null,
              "cusCode": null,
              "cusName": null,
              "orderPriority": null,
              "billNo": "5101-220616002",
              "deliveryDate": null,
              "factoryDeliveryDate": null,
              "demandQty": null,
              "produceCode": null,
              "demandType": null,
              "emergencyInsertion": null,
              "appointSchedulingStartDate": null,
              "planStartTime": null,
              "planOverTime": null,
              "businessStatus": null,
              "actStaTime": null,
              "actCptTime": null,
              "deviationDays": null,
              "detailScId": null,
              "detailCode": "20220716000016-1-1",
              "progressStatus": null,
              "workingProcedure": null,
              "plCode": "CSX001",
              "plName": "生产A线",
              "startTime": "2022-07-19 15:04:03",
              "endTime": "2022-07-19 15:22:57",
              "transferTime": null,
              "prepareTime": null,
              "processTime": null,
              "processBatch": null,
              "waitTime": null,
              "transportMode": null,
              "transportBatch": null,
              "continueMode": null,
              "finishRate": null,
              "wasteQty": null,
              "hangUpStatus": null,
              "occupiedCapacity": null,
              "PlanQty": 63,
              "produceInvCode": null,
              "releaseStatus": null,
              "produceInvName": null,
              "level": null,
              "locking": null,
              "ConfirmQty": 9,
              "proInvCode": null,
              "apsModelCode": null,
              "kittingState": null,
              "materialHelpCode": null,
              "erpStatus": null,
              "releaseStatusAll": null,
              "salesOrderCode": null,
              "remark": null,
              "routeType": null,
              "remarks": null,
              "totalProQty": null,
              "proQty": null,
              "orderNumber": null,
              "unCompletedQty": null,
              "completionRate": null,
              "kittingOrder": null,
              "kittingQty": null,
              "expectStartDate": null,
              "erpCreationDate": null,
              "isFormalDetails": null,
              "dailyTime": null,
              "pCode": null,
              "pName": null,
              "preAssembledStatus": null,
              "pType": null,
              "pmName": null,
              "pplName": null,
              "calendar": [
                "2022-7-19",
                "2022-7-20",
                "2022-7-21",
                "2022-7-22",
                "2022-7-23",
                "2022-7-25",
                "2022-7-26",
                "2022-7-27",
                "2022-7-28",
                "2022-7-29",
                "2022-7-30",
                "2022-8-1",
                "2022-8-2",
                "2022-8-3",
                "2022-8-4"
              ],
              "color": "#D29419",
              "dataSource": null,
              "orderPushCheckResult": null,
              "operationType": null,
              "processName": null,
              "changePlCode": null,
              "changePlName": null,
              "dirId": null,
              "billId": null,
              "pbrId": null,
              "invId": null,
              "plId": null,
              "depId": null,
              "oper": null,
              "endType": null,
              "pmCode": null,
              "pplCode": null,
              "changePmCode": null,
              "changePplCode": null,
              "preassembled": null
            }
          ],
          "pType": null,
          "startTime": "2022-07-19 15:04:03",
          "endTime": "2022-07-19 15:22:57",
          "billNo": "5101-220616002",
          "ConfirmQty": 9
        }
      ],
      "startTime": "2022-07-19 15:04:03",
      "invName": "无烟烤盘（澳洲/（彩盒外箱）新程序V1",
      "endTime": "2022-07-19 15:22:57",
      "Code": "10010010004E",
      "billNo": "5101-220616002",
      "ConfirmQty": 9
    },
    {
      "PlanQty": 553,
      "color": "#47E4A1",
      "children": [
        {
          "PlanQty": 553,
          "color": "#47E4A1",
          "children": [
            {
              "scheduleType": null,
              "OrderNo": "20220716000015",
              "depCode": null,
              "depName": null,
              "proModel": null,
              "Code": "10010010004D",
              "invName": "无烟烤盘（澳洲/（彩盒外箱）新程序/V1",
              "invStd": null,
              "unitId": null,
              "unitName": null,
              "cusCode": null,
              "cusName": null,
              "orderPriority": null,
              "billNo": "5101-220616001",
              "deliveryDate": null,
              "factoryDeliveryDate": null,
              "demandQty": null,
              "produceCode": null,
              "demandType": null,
              "emergencyInsertion": null,
              "appointSchedulingStartDate": null,
              "planStartTime": null,
              "planOverTime": null,
              "businessStatus": null,
              "actStaTime": null,
              "actCptTime": null,
              "deviationDays": null,
              "detailScId": null,
              "detailCode": "20220716000015-1-1",
              "progressStatus": null,
              "workingProcedure": null,
              "plCode": "CSX001",
              "plName": "生产A线",
              "startTime": "2022-07-19 15:22:58",
              "endTime": "2022-07-19 19:08:52",
              "transferTime": null,
              "prepareTime": null,
              "processTime": null,
              "processBatch": null,
              "waitTime": null,
              "transportMode": null,
              "transportBatch": null,
              "continueMode": null,
              "finishRate": null,
              "wasteQty": null,
              "hangUpStatus": null,
              "occupiedCapacity": null,
              "PlanQty": 553,
              "produceInvCode": null,
              "releaseStatus": null,
              "produceInvName": null,
              "level": null,
              "locking": null,
              "ConfirmQty": 140,
              "proInvCode": null,
              "apsModelCode": null,
              "kittingState": null,
              "materialHelpCode": null,
              "erpStatus": null,
              "releaseStatusAll": null,
              "salesOrderCode": null,
              "remark": null,
              "routeType": null,
              "remarks": null,
              "totalProQty": null,
              "proQty": null,
              "orderNumber": null,
              "unCompletedQty": null,
              "completionRate": null,
              "kittingOrder": null,
              "kittingQty": null,
              "expectStartDate": null,
              "erpCreationDate": null,
              "isFormalDetails": null,
              "dailyTime": null,
              "pCode": null,
              "pName": null,
              "preAssembledStatus": null,
              "pType": null,
              "pmName": null,
              "pplName": null,
              "calendar": [
                "2022-7-19",
                "2022-7-20",
                "2022-7-21",
                "2022-7-22",
                "2022-7-23",
                "2022-7-25",
                "2022-7-26",
                "2022-7-27",
                "2022-7-28",
                "2022-7-29",
                "2022-7-30",
                "2022-8-1",
                "2022-8-2",
                "2022-8-3",
                "2022-8-4"
              ],
              "color": "#47E4A1",
              "dataSource": null,
              "orderPushCheckResult": null,
              "operationType": null,
              "processName": null,
              "changePlCode": null,
              "changePlName": null,
              "dirId": null,
              "billId": null,
              "pbrId": null,
              "invId": null,
              "plId": null,
              "depId": null,
              "oper": null,
              "endType": null,
              "pmCode": null,
              "pplCode": null,
              "changePmCode": null,
              "changePplCode": null,
              "preassembled": null
            }
          ],
          "pType": null,
          "startTime": "2022-07-19 15:22:58",
          "endTime": "2022-07-19 19:08:52",
          "billNo": "5101-220616001",
          "ConfirmQty": 140
        }
      ],
      "startTime": "2022-07-19 15:22:58",
      "invName": "无烟烤盘（澳洲/（彩盒外箱）新程序/V1",
      "endTime": "2022-07-19 19:08:52",
      "Code": "10010010004D",
      "billNo": "5101-220616001",
      "ConfirmQty": 140
    },
    {
      "PlanQty": 3000,
      "color": "#279B58",
      "children": [
        {
          "PlanQty": 3000,
          "color": "#279B58",
          "children": [
            {
              "scheduleType": null,
              "OrderNo": "20220716000019",
              "depCode": null,
              "depName": null,
              "proModel": null,
              "Code": "10140080001A",
              "invName": "SG201922-A无烟烤盘-米白+灰色/杜邦山姆会员店",
              "invStd": null,
              "unitId": null,
              "unitName": null,
              "cusCode": null,
              "cusName": null,
              "orderPriority": null,
              "billNo": "5101-220706005",
              "deliveryDate": null,
              "factoryDeliveryDate": null,
              "demandQty": null,
              "produceCode": null,
              "demandType": null,
              "emergencyInsertion": null,
              "appointSchedulingStartDate": null,
              "planStartTime": null,
              "planOverTime": null,
              "businessStatus": null,
              "actStaTime": null,
              "actCptTime": null,
              "deviationDays": null,
              "detailScId": null,
              "detailCode": "20220716000019-1-1",
              "progressStatus": null,
              "workingProcedure": null,
              "plCode": "CSX001",
              "plName": "生产A线",
              "startTime": "2022-07-19 19:08:53",
              "endTime": "2022-07-21 09:08:53",
              "transferTime": null,
              "prepareTime": null,
              "processTime": null,
              "processBatch": null,
              "waitTime": null,
              "transportMode": null,
              "transportBatch": null,
              "continueMode": null,
              "finishRate": null,
              "wasteQty": null,
              "hangUpStatus": null,
              "occupiedCapacity": null,
              "PlanQty": 3000,
              "produceInvCode": null,
              "releaseStatus": null,
              "produceInvName": null,
              "level": null,
              "locking": null,
              "ConfirmQty": 0,
              "proInvCode": null,
              "apsModelCode": null,
              "kittingState": null,
              "materialHelpCode": null,
              "erpStatus": null,
              "releaseStatusAll": null,
              "salesOrderCode": null,
              "remark": null,
              "routeType": null,
              "remarks": null,
              "totalProQty": null,
              "proQty": null,
              "orderNumber": null,
              "unCompletedQty": null,
              "completionRate": null,
              "kittingOrder": null,
              "kittingQty": null,
              "expectStartDate": null,
              "erpCreationDate": null,
              "isFormalDetails": null,
              "dailyTime": null,
              "pCode": null,
              "pName": null,
              "preAssembledStatus": null,
              "pType": null,
              "pmName": null,
              "pplName": null,
              "calendar": [
                "2022-7-19",
                "2022-7-20",
                "2022-7-21",
                "2022-7-22",
                "2022-7-23",
                "2022-7-25",
                "2022-7-26",
                "2022-7-27",
                "2022-7-28",
                "2022-7-29",
                "2022-7-30",
                "2022-8-1",
                "2022-8-2",
                "2022-8-3",
                "2022-8-4"
              ],
              "color": "#279B58",
              "dataSource": null,
              "orderPushCheckResult": null,
              "operationType": null,
              "processName": null,
              "changePlCode": null,
              "changePlName": null,
              "dirId": null,
              "billId": null,
              "pbrId": null,
              "invId": null,
              "plId": null,
              "depId": null,
              "oper": null,
              "endType": null,
              "pmCode": null,
              "pplCode": null,
              "changePmCode": null,
              "changePplCode": null,
              "preassembled": null
            }
          ],
          "pType": null,
          "startTime": "2022-07-19 19:08:53",
          "endTime": "2022-07-21 09:08:53",
          "billNo": "5101-220706005",
          "ConfirmQty": 0
        }
      ],
      "startTime": "2022-07-19 19:08:53",
      "invName": "SG201922-A无烟烤盘-米白+灰色/杜邦山姆会员店",
      "endTime": "2022-07-21 09:08:53",
      "Code": "10140080001A",
      "billNo": "5101-220706005",
      "ConfirmQty": 0
    }
  ],
  "firstIndex": 1,
  "lastIndex": 1
        },
        code:200
      }
      console.log('res',res)
      try {
        if (res.code == 200 && res.data.data != null) {
          
          self.totalCount = res.data.count;
          self.current = res.data.curIndex;
          self.pageSize = res.data.pageSize;
          if (res.data.data.length) {
            console.log('res.data.data',res.data.data)
            const date = GSTC.api.date;
            // 递归拿到合并的数据
            let dataList = _.cloneDeep(res.data.data);
            dataList.forEach((item, index) => {
              item.seq = index + (self.current - 1) * self.pageSize + 1;
              item.level = 1;
              // 开始时间和结束时间转为时间戳进行大小比较
              if (item.startTime) {
                let curMin = date(item.startTime).valueOf();
                curMin < minStartTime ? (minStartTime = curMin) : 0;
              }
              if (item.endTime) {
                let curMax = date(item.endTime).valueOf();
                curMax > maxEndTime ? (maxEndTime = curMax) : 0;
              }
            });
            self.$nextTick(() => {
              self.handleTree(_.cloneDeep(dataList));
              let list = self.treeData;
              let elmentList = self.treeData;
              for (let i = 0; i < list.length; i++) {
                list[i].id = i + (self.current - 1) * self.pageSize + 1;
                list[i].dependant = [];
                list[i].vacations = [];
                // 此循环给子级赋值父级id
                for (let x = 0; x < elmentList.length; x++) {
                  elmentList[x].id = x + (self.current - 1) * self.pageSize + 1;
                  if (
                    elmentList[x].billNo === list[i].billNo &&
                    !list[i].seq &&
                    elmentList[x].level === list[i].level - 1
                  ) {
                    if (list[i].pType && list[i].level != 2) {
                      if (elmentList[x].pType === list[i].pType) {
                        if (list[i].detailCode) {
                          if (list[i].detailCode === list[i].detailCode) {
                            list[i]["parentId"] = elmentList[x].id;
                          }
                        } else {
                          list[i]["parentId"] = elmentList[x].id;
                        }
                      }
                    } else {
                      list[i]["parentId"] = elmentList[x].id;
                    }
                  }
                  //取下一级相同订单的级别连线id
                  // if (
                  //   elmentList[x].billNo === list[i].billNo &&
                  //   elmentList[x].level === list[i].level + 1 &&
                  //   !list[i].singProcess
                  // ) {
                  //   if (list[i].pType) {
                  //     if (elmentList[x].pType === list[i].pType) {
                  //       if (!list[i].dependant.includes(elmentList[x].id)) {
                  //         list[i].dependant.push(elmentList[x].id);
                  //       }
                  //     }
                  //   } else {
                  //     if (!list[i].dependant.includes(elmentList[x].id)) {
                  //       list[i].dependant.push(elmentList[x].id);
                  //     }
                  //   }
                  // }
                  // 针对树结构阶梯式连线
                  if (
                    elmentList[x].billNo === list[i].billNo &&
                    elmentList[x].id === list[i].id + 1 &&
                    !list[i].singProcess
                  ) {
                    
                        list[i].dependant.push(elmentList[x].id);
                    
                  }
                  if (
                    elmentList[x].billNo === list[i].billNo &&
                    elmentList[x].calendar &&
                    elmentList[x].pType === list[i].pType
                  ) {
                    //后端返回的日期格式不一致需要转化
                    if (
                      elmentList[x].calendar &&
                      elmentList[x].calendar.length
                    ) {
                      for (let q = 0; q < elmentList[x].calendar.length; q++) {
                        elmentList[x].calendar[q] = self.timeFormat(
                          new Date(elmentList[x].calendar[q])
                        );
                      }
                      for (let p = 0; p < allDates.length; p++) {
                        if (!elmentList[x].calendar.includes(allDates[p])) {
                          list[i].vacations.push(allDates[p]);
                        }
                      }
                    }
                  }
                }
                //甘特图左侧展示数据
                let rowsObj = {
                  [list[i].id]: {
                    seq: list[i].seq, //列序号
                    id: list[i].id.toString(),
                    rowId: list[i].id.toString(),
                    parentId: list[i].parentId,
                    label: list[i].billNo, //进度条中显示的内容
                    billNo: list[i].pType ? "" : list[i].billNo, //为了阶梯式展示，有工序大类不展示订单跟踪号
                    pName: list[i].pName,
                    detailCode: list[i].detailCode,
                    Code: list[i].Code,
                    invName: list[i].invName,
                    PlanQty: list[i].PlanQty,
                    ConfirmQty: list[i].ConfirmQty,
                    OrderNo: list[i].OrderNo,
                    pType: list[i].detailCode ? "" : list[i].pType, //为了阶梯式展示，有订单跟踪号不展示工序大类
                    startTime:list[i].startTime?this.$moment(list[i].startTime).format("YYYY-MM-DD HH:mm:ss"):'',
                    endTime:list[i].endTime?this.$moment(list[i].endTime).format("YYYY-MM-DD HH:mm:ss"):'',
                    time: {
                      start: list[i].startTime
                        ? date(list[i].startTime).valueOf()
                        : "",
                      end: list[i].endTime
                        ? date(list[i].endTime).valueOf()
                        : "",
                    },
                    completionRate:
                      list[i].ConfirmQty >= 0 && list[i].PlanQty >= 0
                        ? parseFloat(
                            (
                              (list[i].ConfirmQty / list[i].PlanQty) *
                              100
                            ).toFixed(2)
                          )
                        : 0, //百分比
                    vacations: list[i].vacations, //非工作日
                    expanded: true, //默认子级展开
                    gap: {
                      //项目间的垂直间距，必写，不然会报错
                      top: 0,
                      bottom: 0,
                    },
                  },
                };
                // 甘特图右侧展示内容
                let itemsObj = {
                  [list[i].id]: {
                    seq: list[i].seq, //列序号
                    id: list[i].id.toString(),
                    rowId: list[i].id.toString(),
                    parentId: list[i].parentId,
                    label: list[i].billNo, //进度条中显示的内容
                    billNo: list[i].billNo,
                    pName: list[i].pName,
                    detailCode: list[i].detailCode,
                    Code: list[i].Code,
                    invName: list[i].invName,
                    PlanQty: list[i].PlanQty,
                    ConfirmQty: list[i].ConfirmQty,
                    OrderNo: list[i].OrderNo,
                    pType: list[i].pType,
                    startTime:list[i].startTime?this.$moment(list[i].startTime).format("YYYY-MM-DD HH:mm:ss"):'',
                    endTime:list[i].endTime?this.$moment(list[i].endTime).format("YYYY-MM-DD HH:mm:ss"):'',
                    time: {
                      start: list[i].startTime
                        ? date(list[i].startTime).valueOf()
                        : "",
                      end: list[i].endTime
                        ? date(list[i].endTime).valueOf()
                        : "",
                    },
                    progress:
                      list[i].confirmQty >= 0 && list[i].PlanQty >= 0
                        ? parseFloat(
                            (
                              (list[i].confirmQty / list[i].PlanQty) *
                              100
                            ).toFixed(2)
                          )
                        : 0, //进度条百分比
                    vacations: list[i].vacations, //非工作日
                    type: "milestone", //类型task、milestone、project
                    // collapsed: true, //树结构默认收缩
                    style: {
                      background: list[i].color,
                    },
                    dependant: list[i].dependant, //在父级写入连接的子级
                    gap: {
                      //项目之间的垂直间隙
                      top: 4,
                      bottom: 4,
                    },
                  },
                };
                
                self.itemsData = _.assign(self.itemsData, itemsObj);
                self.rowsData = _.assign(self.rowsData, rowsObj);
                self.config.list.rows = self.rowsData;
                self.config.chart.items = self.itemsData;
                self.config.chart.time.from = minStartTime;
                self.config.chart.time.to = date(self.$moment(self.formSearch.planOverTime).format("YYYY-MM-DD")).valueOf();;
                console.log('self.config',JSON.stringify(self.config))
              }
            });
            // });
          }
        }
        // 更新图表配置
        this.$nextTick(()=>{
          self.configUpdate(minStartTime, maxEndTime);
        })
        
      } catch (error) {
        if (error) {
          // 更新图表配置
          self.configUpdate(minStartTime, maxEndTime);
        }
      }
    },
    // 动态计算表格高度
    computTableHeight() {
      // const contentH =
      //   document.getElementsByClassName("main-container")[0].offsetHeight;
      // const height = contentH - 200;
      // this.tableHeight = height < 200 ? 200 : height;
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
    // 判断按钮权限
      judgeBtn() {
        let routeBtn = this.$route.meta.btns;
        let newBtn = [];
        let permission = false;

        if (routeBtn.length != 0) {
          routeBtn.forEach((x) => {
            // alert(x.ButtonCode)
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
      // 获取表头数据
      async getTableHeader() {
        let IDs = this.sysID;
        let res = await GetHeader(IDs);
        const {
          datas,
          forms,
          result,
          msg
        } = res.data;
        if (result) {
          // 获取每个表头
          let list = []
          let obj = {}
          datas.some((m, i) => {
            m.forEach((n) => {
              // 进行验证
              this.verifyDta(n);
              if (n.childrens && n.children.length != 0) {
                n.childrens.forEach((x) => {
                  this.verifyDta(x);
                });
              }
              // for(let obj in n){
              //   if(){

              //   }
              // }
              // let name= n['prop']
              obj = 
                {
                [n['prop']]:{
                id: n['prop'],
                data: n['prop'],
                width: Number(n['width']),
                header: {
                  content: n['label'],
                },
                hidden: true,
                }
              }
              this.colData = Object.assign(this.colData,obj)
              // this.$nextTick(()=>{
              //   setTimeout(() => {
              // state.update("config", (config) => {
              //   config.list.columns.data = Object.assign(config.list.columns.data,obj)
              //   this.config.list.columns.data = config.list.columns.data 
              //   console.log('config',config.list.columns)
              //   return config;
              // });
              // },10000)
              // })
              
              
            });
            this.$set(this.tableColumns, i, m);
            
            // console.log('this.config.list.columns.data',this.config.list.columns.data)
            console.log('this.colData',this.colData)
            
            
            // billNo: {
            //     id: "billNo",
            //     data: "billNo",
            //     width: 130,
            //     header: {
            //       content: "订单跟踪号",
            //     },
            //     hidden: false,
            //     // expander: true,
            //     // sortable: "order",
            //     // activeColumnId:'order'
            //   },
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
          // this.formSearchs[1].datas["ProducedDate"] = this.currentDay;
          this.dataSearch(0);
          // this.$nextTick(()=>{
          //   list.forEach(item=>{
          //     // setTimeout(() => {
          //     state.update("config", (config) => {
          //       config.list.columns.data = Object.assign(config.list.columns.data,item)
          //       this.config.list.columns.data = config.list.columns.data 
          //       console.log('config',config.list.columns)
          //       return config;
          //     });
              
          //   // }, 0);
          //   })
            
          // })
          // this.$forceUpdate()
          // this.$nextTick(()=>{
          //   this.config.list.columns.data = {...this.config.list.columns.data}
          // })
          
        }
      },
      // 验证数据
    verifyDta(n) {
      // if (n.prop == "ShortQty") {
      //   return;
      // }
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
      // 获取表格数据
      async getTableData(form, remarkTb) {
        this.$set(this.tableLoading, remarkTb, true);
        form["rows"] = this.tablePagination[remarkTb].pageSize;
        form["page"] = this.tablePagination[remarkTb].pageIndex;
        let res = await GetSearchData(form);
        const {
          result,
          data,
          count,
          msg
        } = res.data;
        if (result) {
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
      // 第几页
      pageChange(val, remarkTb, filtertb) {
        this.$set(this.tablePagination[remarkTb], "pageIndex", val);
        this.getTableData(this.formSearchs[remarkTb].datas, remarkTb);
      },
      // 页数
      handleSizeChange(val, remarkTb, filtertb) {
        this.$set(this.tablePagination[remarkTb], "pageSize", val);
        this.getTableData(this.formSearchs[remarkTb].datas, remarkTb);
      },
    // 跳转至页面配置
    toPageSetting() {
      this.$router.push({
        name: "FieldInfo",
        params: { ID: this.sysID },
      });
      
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .gstc__scroll-bar--vertical {
    -ms-flex-negative: 0;
    flex-shrink: 0;
    position: initial;
    right: 0;
}
.select ::v-deep .ivu-select-placeholder {
  color: #fff;
}
.select ::v-deep .ivu-icon {
  color: #fff;
}
::v-deep .gstc {
  border: 1px solid #e8eaec;
}
// 进度条圆角
::v-deep .gstc__chart-timeline-items-row-item {
  border-radius: 4px;
}
// 插件自带默认当天列标黄，不需要去除颜色
::v-deep .gstc__chart-timeline-grid-row-cell.current {
  background: #fff;
}
// 点击图标颜色
::v-deep .dot {
  width: 12px;
  height: 12px;
  position: absolute;
  background: #00bb7c;
  border-radius: 100%;
  cursor: pointer;
  z-index: 3;
  left: 0px;
}
::v-deep .active {
  background: #a2f7c3;
}
.input ::v-deep .ivu-select-placeholder {
  color: #fff;
}
.input ::v-deep .ivu-icon {
  color: #fff;
}
//列标题居中
::v-deep .gstc__list-column-header-resizer-container {
  text-align: center;
}
//列内容居中
::v-deep .gstc__list-column-row-content {
  text-align: center;
}
// 圆点点击事件生效
::v-deep .gstc__chart-timeline-items-row {
  pointer-events: auto !important;
}
::v-deep .gstc__chart-calendar-date-content--day{
  font-size: 16px !important;
}
::v-deep .gstc__chart-calendar-dates--level-1{
  font-size: 13px;
}
</style>