<template>
  <div class="APSContainer" v-loading="adminLoading">
    <div class="admin_head" ref="headRef">
      <ComSearch
        ref="searchRef"
        :searchData="formSearchs[tagRemark].datas"
        :searchForm="formSearchs[tagRemark].forms"
        :remark="tagRemark"
        :signName="labelStatus1"
        :isLoading="isLoading"
        :btnForm="btnForm"
        @btnClick="btnClick"
      />
    </div>
    <!-- 图表 -->
    <div>
      <div class="admin_content">
        <div class="gstc-wrapper" id="gstc" ref="gstc">
          <div
            slot="header"
            class="ganttHeader"
            style="display: flex; align-items: center"
          >
            <!-- 高度滑块 -->
            <div
              style="
                margin-right: 20px;
                display: flex;
                flex-direction: row;
                align-items: center;
              "
            >
              <span>单元格高度</span>
              <el-slider
                v-model="customHightSize"
                :min="30"
                :max="100"
                :step="10"
                :show-tooltip="false"
                @input="changeHeight"
                style="width: 200px; margin-left: 10px"
              ></el-slider>
            </div>
            <!-- 宽度滑块 -->
            <div
              style="
                margin-right: 20px;
                display: flex;
                flex-direction: row;
                align-items: center;
              "
            >
              <span>单元格宽度</span>
              <el-slider
                v-model="customWidthSize"
                :min="0"
                :max="4"
                :step="0.5"
                :show-tooltip="false"
                @input="changeWidth"
                style="width: 200px; margin-left: 10px"
              ></el-slider>
            </div>
          </div>
        </div>
        <div>
          <div class="flex_row_spaceBtn pagination">
            <div>
              <span @click="toPageSetting" class="primaryColor cursor"
                >SysID:{{ sysID[tagRemark].ID }}
              </span>
            </div>
            <div class="flex">
              共{{ tablePagination[tagRemark].pageTotal }}条
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import GSTC from './plugin/gstc.esm.min.js';
// import GSTC from "gantt-schedule-timeline-calendar/dist/gstc.wasm.esm.min.js";
import 'gantt-schedule-timeline-calendar/dist/style.css';
import { Plugin as TimelinePointer } from 'gantt-schedule-timeline-calendar/dist/plugins/timeline-pointer.esm.min.js';
// import { Plugin as Selection } from "gantt-schedule-timeline-calendar/dist/plugins/selection.esm.min.js";
// import { Plugin as ItemResizing } from "gantt-schedule-timeline-calendar/dist/plugins/item-resizing.esm.min.js";
// import { Plugin as ItemMovement } from "gantt-schedule-timeline-calendar/dist/plugins/item-movement.esm.min.js";
import { Plugin as CalendarScroll } from 'gantt-schedule-timeline-calendar/dist/plugins/calendar-scroll.esm.min.js';
import { Plugin as ProgressBar } from 'gantt-schedule-timeline-calendar/dist/plugins/progress-bar.esm.min.js';
import { Plugin as TimeBookmarks } from 'gantt-schedule-timeline-calendar/dist/plugins/time-bookmarks.esm.min.js';
import { Plugin as DependencyLines } from 'gantt-schedule-timeline-calendar/dist/plugins/dependency-lines.esm.min.js';
import ComSearch from '@/components/ComSearch';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css'; // optional for styling
import { GetHeader, GetSearchData, GetSearch, ExportData } from '@/api/Common';
let gstc, state, that;
globalThis.GSTC = gstc; //全局对象
globalThis.state = state; //全局对象
const dateApi = GSTC.api.date;
// 设置时间标签
const bookmarks = {
  now: {
    time: GSTC.api.date().valueOf(),
    label: 'Now',
    style: {
      background: '#3498DB',
    },
  },
};

// 鼠标移上去显示内容
function setTippyContent(element, data) {
  if (!gstc) return;
  if ((!data || !data.item) && element._tippy) return element._tippy.destroy();
  const itemData = gstc.api.getItemData(data.item.id);
  if (!itemData && element._tippy) return element._tippy.destroy();
  if (itemData && itemData.detached && element._tippy)
    return element._tippy.destroy();
  // @ts-ignore
  if (itemData && !itemData.detached && !element._tippy)
    tippy(element, { trigger: 'mouseenter click', allowHTML: true });
  if (!element._tippy) return;
  const tooltipContent = `
      <p>资源名称：${data.item.LineName ? data.item.LineName : ''}</p>
      <p>生产订单：${data.item.OrderNo ? data.item.OrderNo : ''}</p>
      <p>工段名称：${
        data.item.ProcessPartName ? data.item.ProcessPartName : ''
      }</p>
      <p>物料编码：${data.item.Code ? data.item.Code : ''}</p>
      <p>物料规格：${data.item.Spec ? data.item.Spec : ''}</p>
      </p>
      <p>开始时间：${data.item.StartTime ? data.item.StartTime : ''}</p>
      <p>结束时间：${data.item.EndTime ? data.item.EndTime : ''}</p>
      <p>订单数量：${data.item.PlanQty ? data.item.PlanQty : ''}</p>
      `;
  element._tippy.setContent(tooltipContent);
}

// 鼠标移上去显示事件
function itemTippy(element, data) {
  setTippyContent(element, data);
  return {
    update(element, data) {
      if (element._tippy) element._tippy.destroy();
      setTippyContent(element, data);
    },
    destroy(element, data) {
      if (element._tippy) element._tippy.destroy();
    },
  };
}

const days = [
  {
    zoomTo: 20, // we want to display this format for all zoom levels until 100
    period: 'day',
    periodIncrement: 1,
    format({ timeStart }) {
      // return timeStart.format('DD MMMM YYYY (dddd)'); // full list of formats: https://day.js.org/docs/en/display/format
      return timeStart.format('YYYY/MM/DD');
    },
  },
  {
    zoomTo: 21, // we want to display this format for all zoom levels until 100
    period: 'month',
    periodIncrement: 1,
    format({ timeStart }) {
      // return timeStart.format('DD MMMM YYYY (dddd)'); // full list of formats: https://day.js.org/docs/en/display/format
      return timeStart.format('YYYY/MM');
    },
  },
  {
    zoomTo: 26, // we want to display this format for all zoom levels until 100
    period: 'year',
    periodIncrement: 1,
    format({ timeStart }) {
      // return timeStart.format('DD MMMM YYYY (dddd)'); // full list of formats: https://day.js.org/docs/en/display/format
      return timeStart.format('YYYY');
    },
  },
  {
    zoomTo: 100, // we want to display this format for all zoom levels until 100
    period: 'day',
    periodIncrement: 1,
    format({ timeStart }) {
      // return timeStart.format('DD MMMM YYYY (dddd)'); // full list of formats: https://day.js.org/docs/en/display/format
      return timeStart.format('YYYY/MM/DD');
    },
  },
];

const hours = [
  {
    zoomTo: 16.5, // we want to display this format for all zoom levels until 100
    period: 'hour',
    periodIncrement: 1,
    main: true,
    format({ timeStart }) {
      return timeStart.format('HH'); // full list of formats: https://day.js.org/docs/en/display/format
    },
  },
  {
    zoomTo: 17, // we want to display this format for all zoom levels until 100
    period: 'hour',
    periodIncrement: 2,
    main: true,
    format({ timeStart }) {
      return timeStart.format('HH'); // full list of formats: https://day.js.org/docs/en/display/format
    },
  },
  {
    zoomTo: 17.5, // we want to display this format for all zoom levels until 100
    period: 'hour',
    periodIncrement: 3,
    main: true,
    format({ timeStart }) {
      return timeStart.format('HH'); // full list of formats: https://day.js.org/docs/en/display/format
    },
  },
  {
    zoomTo: 18, // we want to display this format for all zoom levels until 100
    period: 'hour',
    periodIncrement: 4,
    main: true,
    format({ timeStart }) {
      return timeStart.format('HH'); // full list of formats: https://day.js.org/docs/en/display/format
    },
  },
  {
    zoomTo: 18.5, // we want to display this format for all zoom levels until 100
    period: 'hour',
    periodIncrement: 6,
    main: true,
    format({ timeStart }) {
      return timeStart.format('HH'); // full list of formats: https://day.js.org/docs/en/display/format
    },
  },
  {
    zoomTo: 19, // we want to display this format for all zoom levels until 100
    period: 'hour',
    periodIncrement: 8,
    main: true,
    format({ timeStart }) {
      return timeStart.format('HH'); // full list of formats: https://day.js.org/docs/en/display/format
    },
  },
  {
    zoomTo: 19.5, // we want to display this format for all zoom levels until 100
    period: 'hour',
    periodIncrement: 12,
    main: true,
    format({ timeStart }) {
      return timeStart.format('HH'); // full list of formats: https://day.js.org/docs/en/display/format
    },
  },
  {
    zoomTo: 21, // we want to display this format for all zoom levels until 100
    period: 'day',
    periodIncrement: 1,
    main: true,
    format({ timeStart }) {
      return timeStart.format('DD'); // full list of formats: https://day.js.org/docs/en/display/format
    },
  },
  {
    zoomTo: 26, // we want to display this format for all zoom levels until 100
    period: 'month',
    periodIncrement: 1,
    main: true,
    format({ timeStart }) {
      return timeStart.format('MM'); // full list of formats: https://day.js.org/docs/en/display/format
    },
  },
];

export default {
  name: 'resource-gantt-chart-index',
  components: {
    ComSearch,
  },
  data() {
    return {
      weekStartDate: '',
      weekEndDate: '',
      beforeDay: '',
      afterDay: '',
      customHightSize: 30,
      customWidthSize: 2,
      colData: {},
      labelStatus1: 0,
      formSearchs: [
        {
          datas: {},
          forms: [],
        },
      ],
      tagRemark: 0,
      isLoading: false,
      sysID: [{ ID: 5168 }],
      btnForm: [],
      parmsBtn: [],
      adminLoading: false,
      tableData: [[]],
      tableLoading: [false],
      isClear: [false],
      tablePagination: [
        {
          pageIndex: 1,
          pageSize: 0,
          pageTotal: 0,
        },
      ],
      num: 0,
      itemsData: {}, //右侧项目集合
      rowsData: {}, //行数据集合
      config: {
        innerHeight: 900, //以像素为单位的图表高度
        // headerHeight:70,//标题和日历的高度（以像素为单位）
        // autoInnerHeight: true, //如果要在组件大小的父元素更改时自动计算 innerHeight
        licenseKey: '111',
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
            data: this.colData ? this.colData : {},
            resizer: {},
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
            zoom: 18.5, // 10-22 缩放，默认 Shift + 滚轮， 默认缩放展示时间粒度， 一共有 小时、天、周、月、年
          },
          item: {
            gap: {
              top: 4,
              bottom: 4,
            },
            height: 100, // 行高
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
        },
        locale: {
          name: 'zh',
          Now: 'Now',
          // "X-Scale": "调整X时间轴：",
          // "Y-Scale": "调整Y时间轴：",
          // "Task list width": "列表栏宽度：",
          // "Before/After": "前后距离：",
          // "Display task list": "列表栏",
          weekdays: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
          months: [
            '一月',
            '二月',
            '三月',
            '四月',
            '五月',
            '六月',
            '七月',
            '八月',
            '九月',
            '十月',
            '十一月',
            '十二月',
          ],
        },
        actions: {
          'chart-timeline-items-row-item': [itemTippy],
        },
        slots: {},
      },
      treeData: [],
      strokeColor: '#BFEFFF',
      tableHeight: 443,
      updataTableHeight: this.$_.debounce(() => {
        this.computTableHeight(true);
      }),
    };
  },
  created() {
    window.addEventListener('resize', this.updataTableHeight);
  },
  async mounted() {
    that = this;
    await this.computTableHeight();
    await this.judgeBtn();
    await this.getTableHeader();
    this.$nextTick(() => {
      this.config.innerHeight = this.tableHeight;
      state = GSTC.api.stateFromConfig(this.config);
      gstc = GSTC({
        element: this.$refs['gstc'],
        state,
      });
    });
  },
  beforeUnmount() {
    if (gstc) gstc.destroy();
  },
  methods: {
    getWeek(n, type) {
      // 周
      let now = new Date();
      let day = now.getDay(); //返回星期几的某一天;
      if (!type) {
        if (n == 1) {
          let dayNumber = day == 0 ? 0 : 7 - day;
          now.setDate(now.getDate() + dayNumber + 1);
        } else if (n == -1) {
          let dayNumber = day == 0 ? 6 : day - 1;
          now.setDate(now.getDate() - dayNumber - 7);
        } else {
          let dayNumber = day == 0 ? 6 : day - 1;
          now.setDate(now.getDate() - dayNumber);
        }
      } else {
        if (n == 1) {
          let dayNumber = day == 0 ? 0 : 7 - day;
          now.setDate(now.getDate() + dayNumber + 1 + 6); // 在周开始的日期上+6天=周结束
        } else if (n == -1) {
          let dayNumber = day == 0 ? 6 : day - 1;
          now.setDate(now.getDate() - dayNumber - 7 + 6);
        } else {
          let dayNumber = day == 0 ? 0 : 7 - day;
          now.setDate(now.getDate() + dayNumber);
        }
      }
      let date = now.getDate();
      let month = now.getMonth() + 1;

      let s =
        now.getFullYear() +
        '-' +
        (month < 10 ? '0' + month : month) +
        '-' +
        (date < 10 ? '0' + date : date);
      return s;
    },
    // 假日标记，rows写入非工作日，属性必填，值可为空，否则报错
    onCellCreateVacation({ time, row, vido, content }) {
      if (
        row.vacations &&
        row.vacations.includes(time.leftGlobalDate.format('YYYY-MM-DD'))
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
      var color = '#';
      for (var i = 0; i < 6; i++)
        color += parseInt(Math.random() * 16).toString(16);
      if (color === '#fffff') {
        color = '#1EBC61';
      } else if (color === '#000000') {
        color = '#0EAC51';
      }
      this.strokeColor = color;
      return color;
    },
    // 配置发生改变更新
    configUpdate(minStartTime, maxEndTime) {
      setTimeout(() => {
        state.update('config', (config) => {
          config.list.rows = this.rowsData;
          config.chart.items = this.itemsData;
          config.chart.time.from = dateApi(minStartTime).valueOf();
          config.chart.time.to = dateApi(maxEndTime).endOf('day').valueOf();
          config.innerHeight = this.tableHeight;
          config.list.columns.data = this.colData;
          config.chart.item.height = this.customHightSize;
          return config;
        });
        if (this.num == 0) {
          // 初始化刷新即可
          // 配置加载完刷新
          gstc.reload();
          this.num++;
        }
      }, 0);
    },
    // 主表甘特图查询数据
    async getTableData(form, remarkTb) {
      const self = this;
      self.adminLoading = true;
      self.$set(self.tableLoading, remarkTb, true);
      form['rows'] = 0;
      form['page'] = self.tablePagination[remarkTb].pageIndex;
      let res = await GetSearch(form, '/APSAPI/GetGantt');
      const { result, data, count, msg, content } = res.data;
      self.treeData = [];
      self.rowsData = {};
      self.itemsData = {};
      try {
        if (result) {
          if (data.length) {
            const date = GSTC.api.date;
            // 赋值条数
            self.$set(self.tablePagination[remarkTb], 'pageTotal', data.length);

            self.$nextTick(() => {
              let list = _.cloneDeep(data);

              let num = 0;
              for (let i = 0; i < list.length; i++) {
                // 设置默认值
                list[i].id = list[i].RowNumber;
                list[i].dependant = [];
                list[i].vacations = list[i].calendar;
                //甘特图左侧展示数据
                let rowsObj = {
                  [list[i].id]: {
                    seq: list[i].RowNumber, //列序号
                    id: list[i].id.toString(),
                    label: list[i].OrderNo, //进度条中显示的内容
                    LineName: list[i].LineName,
                    OrderNo: list[i].OrderNo,
                    Code: list[i].Code,
                    Spec: list[i].Spec,
                    ProcessPartName: list[i].ProcessPartName,
                    PlanQty: list[i].PlanQty,
                    HasQty: list[i].HasQty,
                    StartDate: list[i].StartDate
                      ? self.$moment(list[i].StartDate).format('YYYY-MM-DD')
                      : '',
                    StartTime: list[i].StartTime
                      ? self
                          .$moment(list[i].StartTime)
                          .format('YYYY-MM-DD HH:mm:ss')
                      : '',
                    EndTime: list[i].EndTime
                      ? self
                          .$moment(list[i].EndTime)
                          .format('YYYY-MM-DD HH:mm:ss')
                      : '',
                    time: {
                      start: list[i].StartTime
                        ? date(list[i].StartTime).valueOf()
                        : '',
                      end: list[i].EndTime
                        ? date(list[i].EndTime).valueOf()
                        : '',
                    },
                    // progress:list[x].Exend1?list[x].Exend1: 0, //进度条百分比
                    vacations: list[i].vacations, //非工作日
                    type: 'milestone', //类型task、milestone、project
                    // collapsed: true, //树结构默认收缩
                    style: {
                      background: list[i].bgCodor,
                    },
                    // dependant: children[x].dependant, //在父级写入连接的子级
                    gap: {
                      //项目间的垂直间距，必写，不然会报错
                      top: 0,
                      bottom: 0,
                    },
                  },
                };
                self.rowsData = _.assign(self.rowsData, rowsObj);

                // 甘特图右侧展示内容
                if (list[i].OrderNoList.length) {
                  let children = list[i].OrderNoList;

                  for (let x = 0; x < children.length; x++) {
                    num++;
                    // 取随机色
                    let color = self.getRandomColor();
                    children[x].bgCodor = color;
                    let itemsObj = {
                      [num]: {
                        seq: children[x].RowNumber, //列序号
                        id: num,
                        rowId: list[i].id.toString(),
                        label: children[x].OrderNo, //进度条中显示的内容
                        LineName: children[x].LineName,
                        OrderNo: children[x].OrderNo,
                        Code: children[x].Code,
                        Spec: children[x].Spec,
                        ProcessPartName: children[x].ProcessPartName,
                        PlanQty: children[x].PlanQty,
                        HasQty: children[x].HasQty,
                        OrderNo: children[x].OrderNo,
                        StartDate: children[x].StartDate
                          ? self
                              .$moment(children[x].StartDate)
                              .format('YYYY-MM-DD')
                          : '',
                        StartTime: children[x].StartTime
                          ? self
                              .$moment(children[x].StartTime)
                              .format('YYYY-MM-DD HH:mm:ss')
                          : '',
                        EndTime: children[x].EndTime
                          ? self
                              .$moment(children[x].EndTime)
                              .format('YYYY-MM-DD HH:mm:ss')
                          : '',
                        time: {
                          start: children[x].StartTime
                            ? date(children[x].StartTime).valueOf()
                            : '',
                          end: children[x].EndTime
                            ? date(children[x].EndTime).valueOf()
                            : '',
                        },
                        progress: children[x].Exend1 ? children[x].Exend1 : 0, //进度条百分比
                        vacations: list[i].vacations, //非工作日
                        type: 'milestone', //类型task、milestone、project
                        // collapsed: true, //树结构默认收缩
                        style: {
                          background: children[x].bgCodor,
                        },
                        // dependant: children[x].dependant, //在父级写入连接的子级
                        gap: {
                          //项目之间的垂直间隙
                          top: 4,
                          bottom: 4,
                        },
                      },
                    };
                    self.itemsData = _.assign(self.itemsData, itemsObj);
                  }
                }
              }
              // 赋值，用于改变高度时更新作用
              self.treeData = list;
            });
          }
          // 更新图表配置
          self.$nextTick(() => {
            self.configUpdate(self.beforeDay, self.afterDay);
            self.adminLoading = false;
          });
        } else {
          self.$message({
            message: msg,
            type: 'error',
            dangerouslyUseHTMLString: true,
          });
        }
      } catch (error) {
        if (error) {
          // 更新图表配置
          self.configUpdate(self.beforeDay, self.afterDay);
          self.adminLoading = false;
        }
      }
    },
    // 动态计算表格高度
    computTableHeight() {
      const contentH =
        document.getElementsByClassName('main-container')[0].offsetHeight;
      const height = contentH - 300;
      this.tableHeight = height < 200 ? 800 : height;
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
    // 导出
    async dataExport(remarkTb) {
      this.adminLoading = true;
      let form = JSON.parse(JSON.stringify(this.formSearchs[remarkTb].datas));
      form['rows'] = 0;
      debugger;
      let res = await ExportData(form);
      this.adminLoading = false;
      this.$store.dispatch('user/exportData', res.data);
    },
    // 重置
    dataReset(remarkTb) {
      for (let name in this.formSearchs[remarkTb].datas) {
        if (name != 'dicID') {
          if (this.formSearchs[remarkTb].forms.length) {
            // 判断是否是页面显示的查询条件，是的字段才清空
            this.formSearchs[remarkTb].forms.forEach((element) => {
              if (element.prop === name) {
                this.formSearchs[remarkTb].datas[name] = null;
              }
            });
          }
        }
      }
    },
    // 判断按钮权限
    judgeBtn() {
      let routeBtn = this.$route.meta.btns;
      let newBtn = [];
      if (routeBtn.length != 0) {
        routeBtn.forEach((x) => {
          if (x.ButtonCode == 'edit') {
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
      this.$set(this, 'btnForm', newBtn);
    },
    // 获取表头数据
    async getTableHeader() {
      this.colData = {};
      let IDs = this.sysID;
      let res = await GetHeader(IDs);
      const { datas, forms, result, msg } = res.data;
      if (result) {
        // 获取每个表头
        let obj = {};
        datas.some((m, i) => {
          m.forEach((n) => {
            // 进行验证
            this.verifyDta(n);
            if (n.children && n.children.length != 0) {
              n.children.forEach((x) => {
                this.verifyDta(x);
              });
            }
            obj = {
              [n['prop']]: {
                id: n['prop'],
                data: n['prop'],
                width: Number(n['width']),
                header: {
                  content: n['label'],
                },
                hidden: false,
              },
            };
            this.colData = Object.assign(this.colData, obj);
          });
        });
        // 获取查询的初始化字段 组件 按钮
        forms.some((x, z) => {
          this.$set(this.formSearchs[z].datas, 'dicID', IDs[z].ID);
          x.forEach((y) => {
            if (y.prop && y.value) {
              this.$set(this.formSearchs[z].datas, [y.prop], y.value);
            } else {
              this.$set(this.formSearchs[z].datas, [y.prop], '');
            }
          });
          this.$set(this.formSearchs[z], 'forms', x);
        });
        // 初始化时默认上线日期
        // this.weekStartDate = this.getWeek(0, 0); // 获取本周开始日期
        // this.weekEndDate = this.getWeek(0, 1); // 获取本周结束日期
        this.weekStartDate = this.$moment().format('YYYY-MM-DD'); // 获取本周开始日期
        this.weekEndDate = this.$moment().add(30, 'days').format('YYYY-MM-DD'); // 获取本周结束日期
        this.formSearchs[this.tagRemark].datas['StartDate'] = [];
        this.formSearchs[this.tagRemark].datas['StartDate'][0] =
          this.weekStartDate;
        this.formSearchs[this.tagRemark].datas['StartDate'][1] =
          this.weekEndDate;
        await this.dataSearch(0);
      }
    },
    // 验证数据
    verifyDta(n) {
      for (let name in n) {
        if (
          (name == 'component' && n[name]) ||
          (name == 'button' && n[name]) ||
          (name == 'active' && n[name])
        ) {
          n[name] = eval('(' + n[name] + ')');
        }
      }
    },
    // 查询
    dataSearch(remarkTb) {
      if (!this.formSearchs[remarkTb].datas['StartDate']) {
        this.$message.error('请选择上线日期！');
        return;
      }
      //每次查询获取图标日期
      this.beforeDay = this.formSearchs[remarkTb].datas['StartDate'][0];
      this.afterDay = this.formSearchs[remarkTb].datas['StartDate'][1];
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
    // 跳转至页面配置
    toPageSetting() {
      this.$router.push({
        name: 'FieldInfo',
        params: { ID: this.sysID[this.tagRemark].ID },
      });
    },
    changeHeight(val) {
      if (this.num > 0) {
        let height = val;
        height = val;
        this.config.chart.item.height = val;
        state.update('config.chart', (chart) => {
          chart.item.height = height;
          return chart;
        });
        this.refresh();
      }
    },
    changeWidth(val) {
      if (this.num > 0) {
        let zoom = this.config.chart.time.zoom;
        if (val == 0) {
          //年跟月间隔不规则，需要定值
          zoom = 25;
        } else if (val == 0.5) {
          //月跟日间隔不规则，需要定值
          zoom = 21;
        } else if (zoom == 19.5) {
          zoom -= val;
        } else {
          zoom = 20.5;
          zoom -= val;
        }
        this.$nextTick(() => {
          state.update('config.chart', (chart) => {
            chart.time.zoom = zoom;
            return chart;
          });
        });
        console.log('zoom', zoom);
        console.log('customWidthSize', this.customWidthSize);
      }
    },
    refresh() {
      try {
        var dataList = _.cloneDeep(this.treeData);
        this.$nextTick(() => {
          const date = GSTC.api.date;
          let list = dataList;
          let num = 0;
          for (let i = 0; i < list.length; i++) {
            // 设置默认值
            list[i].id = list[i].RowNumber;
            list[i].dependant = [];
            list[i].vacations = list[i].calendar;
            //甘特图左侧展示数据
            let rowsObj = {
              [list[i].id]: {
                seq: list[i].RowNumber, //列序号
                id: list[i].id.toString(),
                label: list[i].OrderNo, //进度条中显示的内容
                LineName: list[i].LineName,
                OrderNo: list[i].OrderNo,
                Code: list[i].Code,
                Spec: list[i].Spec,
                ProcessPartName: list[i].ProcessPartName,
                PlanQty: list[i].PlanQty,
                HasQty: list[i].HasQty,
                StartDate: list[i].StartDate
                  ? this.$moment(list[i].StartDate).format('YYYY-MM-DD')
                  : '',
                StartTime: list[i].StartTime
                  ? this.$moment(list[i].StartTime).format(
                      'YYYY-MM-DD HH:mm:ss',
                    )
                  : '',
                EndTime: list[i].EndTime
                  ? this.$moment(list[i].EndTime).format('YYYY-MM-DD HH:mm:ss')
                  : '',
                time: {
                  start: list[i].StartTime
                    ? date(list[i].StartTime).valueOf()
                    : '',
                  end: list[i].EndTime ? date(list[i].EndTime).valueOf() : '',
                },
                // progress:list[x].Exend1?list[x].Exend1: 0, //进度条百分比
                vacations: list[i].vacations, //非工作日
                type: 'milestone', //类型task、milestone、project
                // collapsed: true, //树结构默认收缩
                style: {
                  background: list[i].bgCodor,
                },
                // dependant: children[x].dependant, //在父级写入连接的子级
                gap: {
                  //项目间的垂直间距，必写，不然会报错
                  top: 0,
                  bottom: 0,
                },
              },
            };
            this.rowsData = _.assign(this.rowsData, rowsObj);

            // 甘特图右侧展示内容
            if (list[i].OrderNoList.length) {
              let children = list[i].OrderNoList;

              for (let x = 0; x < children.length; x++) {
                num++;
                console.log('children[x]', children[x]);
                let itemsObj = {
                  [num]: {
                    seq: children[x].RowNumber, //列序号
                    id: num,
                    rowId: list[i].id.toString(),
                    label: children[x].OrderNo, //进度条中显示的内容
                    LineName: children[x].LineName,
                    OrderNo: children[x].OrderNo,
                    Code: children[x].Code,
                    Spec: children[x].Spec,
                    ProcessPartName: children[x].ProcessPartName,
                    PlanQty: children[x].PlanQty,
                    HasQty: children[x].HasQty,
                    OrderNo: children[x].OrderNo,
                    StartDate: children[x].StartDate
                      ? this.$moment(children[x].StartDate).format('YYYY-MM-DD')
                      : '',
                    StartTime: children[x].StartTime
                      ? this.$moment(children[x].StartTime).format(
                          'YYYY-MM-DD HH:mm:ss',
                        )
                      : '',
                    EndTime: children[x].EndTime
                      ? this.$moment(children[x].EndTime).format(
                          'YYYY-MM-DD HH:mm:ss',
                        )
                      : '',
                    time: {
                      start: children[x].StartTime
                        ? date(children[x].StartTime).valueOf()
                        : '',
                      end: children[x].EndTime
                        ? date(children[x].EndTime).valueOf()
                        : '',
                    },
                    progress: children[x].Exend1 ? children[x].Exend1 : 0, //进度条百分比
                    vacations: list[i].vacations, //非工作日
                    type: 'milestone', //类型task、milestone、project
                    // collapsed: true, //树结构默认收缩
                    style: {
                      background: children[x].bgCodor,
                    },
                    // dependant: children[x].dependant, //在父级写入连接的子级
                    gap: {
                      //项目之间的垂直间隙
                      top: 4,
                      bottom: 4,
                    },
                  },
                };
                this.itemsData = _.assign(this.itemsData, itemsObj);
              }
            }
          }
        });
        // 更新图表配置
        this.$nextTick(() => {
          this.configUpdate(this.beforeDay, this.afterDay);
        });
      } catch (error) {}
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
::v-deep .gstc__chart-calendar-date-content--day {
  font-size: 16px !important;
}
::v-deep .gstc__chart-calendar-dates--level-1 {
  font-size: 13px;
}
// 滚动条显示高度
::v-deep .gstc__scroll-bar {
  height: 20px !important;
}
.admin_content {
  height: 100% !important;
  overflow: auto;
}
// 滚动条宽度
::v-deep .gstc__scroll-bar-inner--vertical {
  width: 20px !important;
  top: 0px;
  right: 0px !important;
}
// 滚动条高度
::v-deep .gstc__scroll-bar-inner--horizontal {
  height: 20px !important;
}
</style>
