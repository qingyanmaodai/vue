<!--表格-->
<template>
  <div class="flex_column content_height APS">
    <div class="firstNode">
      <div class="rightCard">
        <div class="secondCard">
          <div class="itemCard">
            <div class="echartHead">
              <div class="echartTitle">各部门分布</div>
            </div>
            <div class="echartBody" ref="chart1"></div>
          </div>
        </div>
        <div class="headCard">
          <div class="box">
            <svg-icon icon-class="Documentation" class="Documentation" />
            <div class="textBox">
              <div class="statusNum">1,857</div>
              <div class="textHead">
                <div class="title">今日累计异常次数</div>
              </div>
            </div>
          </div>
        </div>
        <div class="thirdCard">
          <div class="itemCard">
            <div class="echartHead">
              <div class="echartTitle">异常原因占比</div>
            </div>
            <div class="echartBody" ref="chart2"></div>
          </div>
        </div>
      </div>
      <div class="leftCard APSContainer">
        <div class="admin_head_2" ref="headRef">
          <ComSearch
            ref="searchRef"
            :searchData="formSearchs[0].datas"
            :searchForm="formSearchs[0].forms"
            :remark="0"
            :isLoading="isLoading"
            :btnForm="btnForm"
            :signName="0"
            :Region="3"
            @btnClick="btnClick"
          />
        </div>
        <div v-for="item in [0]" :key="item" class="admin_content flex_grow">
          <ComVxeTable
            :ref="`tableRef${item}`"
            :rowKey="'RowNumber'"
            height="100%"
            :isToolbar="false"
            :isEdit="isEdit[0]"
            :tableData="tableData[0]"
            :tableHeader="tableColumns[0]"
            :tableLoading="tableLoading[0]"
            :remark="0"
            :sysID="sysID[0]['ID']"
            :isClear="isClear[0]"
            :hasSelect="hasSelect[item]"
            :pagination="tablePagination[0]"
            @pageChange="pageChange"
            @handleRowClick="handleRowClick"
            @pageSize="pageSize"
            @sortChange="sortChange"
            @selectfun="selectFun"
            :keepSource="true"
            :footerContent="true"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
let _this;
import ComSearch from '@/components/ComSearch/AdvancedSearch';
import ComVxeTable from '@/components/ComVxeTable';
import ComReportTable from '@/components/ComReportTable';
import * as echarts from 'echarts';
import { debounce } from 'lodash';
import {
  GetHeader,
  GetSearchData,
  ExportData,
  SaveData,
  GetSearch,
} from '@/api/Common';
export default {
  name: 'RNPlanExecutionException',
  components: {
    ComSearch,
    ComVxeTable,
    ComReportTable,
  },
  data() {
    return {
      headCard: [
        {
          icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAYAAACohjseAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAASfSURBVHgB5Zo7TBtBEIbH5pWEhxJFwqmhp0oTevogpYyUNj0SXRSlRaJMlD60kahDlQZ6+tCbKAEJCA9jnPl9M2ZZn+3dubWNk08azpzv1vvvzL63RIlpNBolvkw4Ns5WZhvzHq2L3bBdsdVKpdIVJaZECRBRU2zTlImypttgu2S7YLHnlIBCAkXYDGXCkhSWA7wLj56w2DoZMWWqz8LyOGX7YxEanTkWh1B8QoMR5gJxJ7GhG5xJ8doc2yMaLmeUCW2EPBwkkMWhBYTXJuh+AG/+CgnZngJF3FNqb+aHTZDIrgLvsTilp8iOAkdAnNJVZDnvpjQooyAONNsHyXMb5Q4vzdFoiFPQ+M3mfTHu3+CSeEjhXQE6+lUxfN5n25JrLEtsr+ValTQ+U9YtBOWF837JoXrp3rzj1sh6B0EbbIs5322y7VA4L9je59z/wbZO4SJRD3+6faQfovBcUXFgieJY7nB/UX5nmsIY859teVC8N987jWYCn9gqzj2U9B5lIYbwWpfrtGS+4j1flXcO5HNFhOC6Je8seOmHehLTr0P1oivwMV8eBiSwxrbS4ceRQQyMF+m2PvUCdQ3hvEvZAL4qVwh2RW6JhYChHPJxRyC8FxKeX+k2DPyShUAUQGyIAnjzA2UCgS8SGX4VmFbLi806KC1naLfgxjjCUsXBqwhdizgAIR/pNjogaNf5fobCga5J/QBCQlNxuwCEYUWu8Fy3xuBM3q12eWZG0nnppKscUBzNAlGBk+Hv3akHyKz2X71An7ZOYfXoLWUedQvjC8UxjtHNGP+BuJg5Hn4UpYnlhC3JTEj47Ml7aICWA55/zvaOssLfZvtOcaB9ucRIxjLH2xVDOFWoP6DQEKqbZGccITpFNiBshfoL0g/t5POYgEDr2soqDYYivzORtyAbirU7iKVIlJStAlE/FmgwoCpYw3SsTDYGJU4xN2RWgYPmGRmxCrSUaOicLikQaFn3r0Y+jwGBjisthXNKNuoQGLRC7BEj0J3moEUMGdb5WAVeQ6BlTw4CQ0LOF7dG8ejQ0MINBF6TjV5rLinEAcsClnIFgTWysdvjuxTiQMzilc+1etBSD/epc+lixqBj1SLidPnQwg22xJvjUJ4yYakwZk6oYLi2Qf3jDcW32Mo5CzzWftDaR+lCbz9AulZxoLkArALRklrCVDNSpJ7ksUPFCq6uO8FNgfwPVqGsfQ3ApHSb0rBDxSa5oLV87y4bQuw8Fdt7Ryeu+xSxoJpg3SVFQR3qdpq/N4Fp0CwVQ1fDQudxEKbdSpE6p7QWfYEvMIUXFQhFK+su3cOzEIQMoIHCCOUbpRuIt22GtglhkQ8oO3Awihz7x0zapkv8wAUNaWpTkNO8MzSd5oMIIesYdRggJHN7gVyB0m38JttccdBovcvtx//fYyTKP30QSLmHIjHFO0pylEuRPlKPUA4TNCanSQ/juchmKUY7g/YmBB35x0R6YT0QC3EqtN9AGLx2Fuo1l6JHmiEUYYsdqtQeLSRMSXZqV0IXw7ypAulCCOamGEldFRGm9OVYsuwaY2N1Un4D3vWPjelaUE0+41pLIcrlL1wxaqCRnNtbAAAAAElFTkSuQmCC',
          title: '业务要货总量',
          Prop: '3,841',
          changeNum: '+4500',
          iconStatus: true,
        },
        {
          icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAYAAACohjseAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAPQSURBVHgB5Zo9bxNBEIZfHzYhOAkgJNKHPj+Anp6IFokSlBZBT4tEiUQbQYmUlEj08C/og8SHFDvEdhwzr2832du7OHe7c/7ikcZnTXzRvTezs58NKDMajRpyaTnWFEvErnk/HRo7E+uLDRqNRh/KNKCAEbUi1kYqKvT/jsR6Yici9i8UiBJohK0hFabyshwYXUb0SMQOEUjQQ9UsrIiO2HGI0MoPJ+KYincwHWEuFHdUNXVLP6SJ2obYTcyWLlKhozI/LiVQxLECMmotzAeM5s8yKXulQCPuLvJlftaUEjlR4ByLs1wp8lKBCyDOMlFkUuQ0BWURxJFxfTDPnCO55KYNLIY4C4vfetEfcgLlTaxi9l1BCG3TR2fICDTtbh2Lyy0/Vf0IMnKLlJo+fPa262jaLyZ6awhjR+yR2CZ0OBT7IvYR1WGqdu1I5zyc4rwtl1VU54mxOngvdoDqcCjHAXomRa8jjAeojx2E0bZtcZyipnKGtj03578hfeuhsIk8E9tGHAwcA9azbTAkNYv4gLT9hMJ72e7eIB6+rJ5N0dD09OkinpgX5NJkmibyQXHTnrxOAwavNf7A8tKkwBXoodEPavWlpMUio5meL8TeIhxW5OfQYyxQc2jGt69RAbVIilacl4lrCZacJnR5hbQfYyf7zvO56Vvk20Xaj6qmubbAQ8d8X9Hv2p6v6/miaUhHfw9x7XAPF6WdD9gx332fXeqv4qPopwhnyAiWWiEuSRv5CMT4YjllkdHck2MUbKpp+GI5YwRPocdLse9I0+yT52PK7k3wPTZX1xdLnwIH0IPCNpFd+rC+zSt8W7ioolqcssgwTVloQodsbpHRJqbInMmyxWEiH9wj14zivMCt8PN+kKmhMellu7LdxHYJH1N1a4IvhoxAVlJ2F7Ezi9e46NQ/ez63eBT5ds1Vo8gM7U7wWCDTVNoi317sqjYj5I9QrM9tp/eRLzLbzt9i6dkv7rpoaLGps8gwbXdRnR92O+18NmGKTQfV2Ud9fEV1MsdO/MH2MdJGXiWKB+aeh9Bdut9H9VVtCsucwsgJkVS9gfTAwSLyxz9mkpvwyg9OoDsenBadojM0l83o2RY1x6h1w9QsrB+FAk3B+WVunHfsIYTCad//e4zEstQHgSxzKJKTg98qR7ksZqTjrpfMChaTjuphPBezWcox67SjSUGMWq/KTaEHYinOCq0bCmPUumWj5hJ7pNmezOAOlXZEo4RZ1HaWTOpymLcS8X8phHNTjqT6McIstezsml1jbqza3WNG1x/Yc6REAQPzndeBhiiXf9lhRWO5QrhCAAAAAElFTkSuQmCC',
          title: '已汇报数量',
          Prop: '2,840',
          changeNum: '-4500',
          iconStatus: false,
        },
        {
          icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAYAAACohjseAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAQOSURBVHgB5Zq9TxtBEMWfDYYQA0oUCVKHOqQmPT30SGnTI+WPiJSe1KGHPj2pQ2roIcqHhJ2AjXHm3e2i5Xz23c7u2Tj8pPHXnU/3bmZnd2e3hsj0+/2avDUcmxWri81kTu0ZuxHriHVrtVoHkakhAkbUvFgTqSjtdftiV2KXIvYvIhAk0AhbRCosysNyoHfp0QsR24MS1U1VLCyPltgfjVDvmxNxDMWnGI8wF4q78A3d0jdpvLYs9hiTpY1UaL/MyaUEijhmQHqtgfsBvfmjTMgWCjTinmEwzU+aUiJHCrzH4iyFIocKnAJxlpEi63k/moQyDeJIkh/MPQ9QH/KnZUyHOAuT31LegQGB8iQWMPmuQEPT9NF3uOPWyO2Oo5w1sQ2xdbHn5jfCvuzE2LHYF8SB7fC720dmBdLNiwiDIraNNUv+50zss7EzhMFBQMt+uRVovLeCMChqB+WFZaG4faRCtXD6dW696Ap8Im8L0PNWbAtxOBTbg55bL7pJZg56dhFPHMy1dqGnabuNRKDJnNrEQs9tIj6b5toaqGvOfiDa0ORNxPRcli3or58kSytQE56rSBNK1WiT1izDtC4vFKeZvNJ7q6geemIb/tB5jeQFOmK2O3YL7RHHGaYqL1LgPPx5jXjeY7/3QezdiHPoxTX4k3hQE57riMO+MbJRcG7R8TwaeQXZMrxAOK64HRQnrFfwp64VqAkXF19xRDOMnKlDR5kGPyxpaMQR1SRAK7AICngjdprzu0acGq3AdsHxI6TVaGZGKzJUXAsKKFBT9y+as71HmoisSHYDoZ47hT89CixVIc5wXHCc7cUVaed3IWF5An+uKVCzJndU4hxXJAltc9/gzw0XJ6/hD8OF7bAom1qRrLmEDO3YJMo81CwderALfxh2ByXPpcjQcau2hJGEKD2oaYcsKxRl0xjYgpQvN1wSr8sLizRaL35C9TD7aiptXAq/7Qe1njg0VhVsBtrwvCOQmVQTpmQPYWW+YfCaH6GjZ1eCE4EmTFUjBQM78piePDDX1HJlP7h1UYpdQdjaO7Ml+zrtZJhNhe069GGd2+W0bOmeKX0JYVDcJvxqNhR2YCw0M+eX7kkkL7qwtPES6fyR5i6+MDN+RToIOEGcLmdgMXRAiIh8hHTDwTTyO7vNZGC6JCdcYjwdeGxaeXtohs0HGcOaMeqkYEjm9gK5Ak238RO6ueK4se0utx9/uNtILP/1RiDLPRTJycGvKFu5LKaPtFsoJwmTSSvqZjwXs1jK0c64vUlB9NqVz5+0G2IpzgqtGgqj19plveYSuqWZQhm2XKGK7dEgYZZou3ZN6HKYNx9wXQrh3JQjqU6IMEsl25LNqjEXVu3qMb07mznN1oK65jPfuzFEufwD3aFHrIhsWHoAAAAASUVORK5CYII=',
          title: '已出库数量',
          Prop: '45.21%',
          changeNum: '+4500',
          iconStatus: true,
        },
        {
          icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAYAAACohjseAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAARrSURBVHgB5Zo9UBNBFMf/CQmIBPyaIdbY02tPD31mbBlbHUtnoHSkdYZae+zptccaa3FGZYYETEKI+8/tJsdlL7f3dvOlv5nHHbnL5f739t57+1FAYLrdbkFtyjErKSsqW0ic2tF2o6ylrF0oFFoITAEB0KKWlK0gEiW9bldZU9kfJfYKAfASqIVVEAkL8rBi0Lv06IUS24EQ0U2NWZiNurJLidDcN6fEsSk+wGSExaG4i7xN1/kmtdfWlN3FdGkgEtp1OdlJoBLHCEivlTEb0Js/XZpspkAt7hGGw/y0cRI5UuAMizNkikwVOAfiDCNFFm0f6oAyD+JILz7oex6imPKlNcyHOAOD36rtwJBA9SSWMf1UIGFF5+hb3BKo37tVzC/3kk21lDiBngvdNKvKNvW2qj87U3aqt98QDt47y8e6+aAvUHuvgjDwR3a0rWScS5HH2s4Q4LeVloapdPruVB/eV5tl+FODmzAbH7X5wlKu58W4wHX4NU82vzfKnsAPevE1/LzJTvQPerEXZHTk9BX3Fv7i4teqQg51LZod4tM0Q9zQOK7ZiydG4CLkhBZnME1eSokpY0H9oThpYmdAeTbiON+jr4geYCXl+CGipm07/lBvT5AfxpcmPSjt4/EJ10YcZxR7oWxP2UHKOfsYpIg0tiGLyKREgUuQsZVxvKGN2CIi0wGTfTXjWvTsDmSUKVA6tpIl0Hj4qbLdxLEjDPKdyzu8DRllVjKS9LABt8Bia8L02qHe33W8TkWflzc3Fm0jzi48hgze4L7ep/g8ntlEfhaKkLGB/PB9NBUKm20t5/dFqUgqUPJjHxCJ43d38399sgLzwoDyCVG4H1dhYIUCJeP+eV72LxhEzFeQi5MU3x0KdBohFv4Yz3un903KkCLpGF9ToGROzqV0Mt0eBhcm6mRQYfVyCPeH9R35uWEevEZ+eFO88VEl1AEGQSUp7jMG5RvPySqqpUMbLXqwDRlHI47xnaOXTbcn+SDihbVLnXkMGb0mSg9K3kNGxQZG3xA9YwsqTNovETVdl5QhEXjDKfFeHaq6TBzFlvQJa7AnbDYn9iYk1UcS6TjNlRJ4bgTeQTQ9JuE9ZJWNC3z3nkPGOSdLTaJnJJU0U7KHMMN9SUwUltAxM8E9geofjkLVISPEKFjoazbNTrxUu4TciyFFnga4Vt9Ztzq76l1k+Padm0gLPFkwIsc7wlL6g74kKZAeXYf/CgozDLGF7NrTCDtCetpxZWgydEiIZ0S1wREzioyPApxpO0HYd/c8uczE6iklkhOg0pGsaVFX4i6SH6b1B9mGJTXqtGCTtGYBq0CdNn5B1lecNOa9s2aA/3cZieGfXghkmEGR7OL9DrKUy6BzpFlCOU0YTOpBF+PF0ZOlrHYm7U0Koteaeb4kXRBLcUbouKEweq3h6rU4vkuazcoMzlCF9qiXMEOwVbu66bLMW4LfonT2TVmTtnyEGcayLFnPGnNidVH/Br2bXHRkxoLaep/bdghRcf4CDSBerRoxXgcAAAAASUVORK5CYII=',
          title: '现有库存数量',
          Prop: '34.24%',
          changeNum: '+4500',
          iconStatus: true,
        },
      ],
      ID: 9046,
      isEdit: false,
      isSelect: false,
      adminLoading: false,
      // height: "700px",
      newTag: -1,
      btnForm: [],
      tableData: [
        [
          { Prop: '53,64' },
          { Prop: '21,03' },
          { Prop: '52,03' },
          { Prop: '-15.22' },
        ],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [{ C1: '' }],
        [{ C1: '' }],
        [{ C1: '' }],
        [{ C1: '' }],
        [{ C1: '' }],
      ],
      tableColumns: [[], [], [], [], [], [], [], []],
      tableLoading: [false, false, false, false, false, false, false, false],
      isLoading: false,
      isClear: [false, false, false, false, false, false, false, false],
      hasSelect: [false, false, false, false, false, false, false, false],
      Region: [6, 6, 6, 6, 6, 6, 6, 6],
      tablePagination: [
        { pageIndex: 1, pageSize: 0, pageTotal: 0 },
        { pageIndex: 1, pageSize: 15, pageTotal: 0 },
        { pageIndex: 1, pageSize: 15, pageTotal: 0 },
        { pageIndex: 1, pageSize: 100, pageTotal: 0 },
        { pageIndex: 1, pageSize: 100, pageTotal: 0 },
        { pageIndex: 1, pageSize: 100, pageTotal: 0 },
        { pageIndex: 1, pageSize: 0, pageTotal: 0 },
        { pageIndex: 1, pageSize: 0, pageTotal: 0 },
        { pageIndex: 1, pageSize: 0, pageTotal: 0 },
        { pageIndex: 1, pageSize: 0, pageTotal: 0 },
        { pageIndex: 1, pageSize: 0, pageTotal: 0 },
        { pageIndex: 1, pageSize: 0, pageTotal: 0 },
        { pageIndex: 1, pageSize: 0, pageTotal: 0 },
      ],
      formSearchs: [
        {
          datas: {},
          forms: [],
        },
        {
          datas: {
            fields:
              "SUM(PlanQty) as S1,sum(HasQty) AS S2,FORMAT(PlanDay,'MM-dd') as PlanDay",
            groupby: "FORMAT(PlanDay,'MM-dd')",
            // sort: "PlanDay desc",
          },
          forms: [],
        },
        {
          datas: {
            fields: 'SUM(PlanQty) AS S1,WorkShopName',
            groupby: 'WorkShopName',
            // PlanDay: this.currentDate,
          },
          forms: [],
        },
      ],
      sysID: [{ ID: 7921 }, { ID: 5170 }, { ID: 5170 }],
      label: [{ label: null }, { label: null }, { label: null }],
      currentDate: '',
      //echart部分
      chart: [],
      chartOptions: [],
      handleWindowResizeDebounced: null,
      selected1Index: 0,
      selected2Index: 0,
    };
  },
  watch: {},
  created() {
    _this = this;
    let routeBtn = this.$route;
    // 获取所有按钮
    this.btnForm = this.$route.meta.btns;
    this.judgeBtn(this.btnForm);
    this.currentDate = this.$moment().format('YYYY-MM-DD');
    this.getTableHeader();
  },
  activated() {},
  async mounted() {
    // var style = window.getComputedStyle("echartBody");
    //初始化图表;
    this.chart = [this.$refs.chart1, this.$refs.chart2];
    // 在窗口大小变化时，调用 resize 方法重新渲染图表
    this.handleWindowResizeDebounced = debounce(this.handleWindowResize, 200); //设置防抖
    window.addEventListener('resize', this.handleWindowResizeDebounced);
  },
  methods: {
    //按钮权限
    judgeBtn(routeBtn) {
      if (routeBtn && routeBtn.length > 0)
        routeBtn.some((item, index) => {
          if (item.ButtonCode == 'save') {
            this.$set(this, 'isEdit', true);
          }
        });
      this.$set(this, 'btnForm', routeBtn);
    },
    // 渲染echart图
    barData(id, option) {
      // echarts.dispose(id);
      echarts.init(id).setOption(option);
    },
    async getEcharts() {
      //获取屏幕宽度并计算比例
      function fontSize(res) {
        let clientWidth =
          window.innerWidth ||
          document.documentElement.clientWidth ||
          document.body.clientWidth;
        if (!clientWidth) return;
        return res * (clientWidth / 1920);
      }
      this.chartOptions = [
        {
          backgroundColor: '#fff',
          color: [
            '#23CF9C',
            '#578FFB',
            '#6E40F2',
            '#FF61E6',
            '#8B5CFF',
            '#00CA69',
          ],
          legend: {
            top: '0%',
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow',
            },
          },
          grid: {
            left: fontSize(10),
            right: fontSize(10),
            bottom: fontSize(10),
            containLabel: true,
          },
          xAxis: [
            {
              type: 'category',
              boundaryGap: false,
              axisLabel: {
                formatter: '{value}月',
                textStyle: {
                  color: '#333',
                },
              },
              axisLine: {
                lineStyle: {
                  color: '#D9D9D9',
                },
              },
              data: ['1', '2', '3', '4', '5', '6', '7', '8'],
            },
          ],
          yAxis: [
            {
              type: 'value',
              name: '单位：万',
              axisLabel: {
                textStyle: {
                  color: '#666',
                },
              },
              nameTextStyle: {
                color: '#666',
                fontSize: 12,
                lineHeight: 40,
              },
              splitLine: {
                lineStyle: {
                  type: 'dashed',
                  color: '#E9E9E9',
                },
              },
              axisLine: {
                show: false,
              },
              axisTick: {
                show: false,
              },
            },
          ],
          series: [
            {
              name: '电子车间',
              type: 'line',
              smooth: true,
              // showSymbol: false,/
              symbolSize: 8,
              zlevel: 3,
              areaStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(
                    0,
                    0,
                    0,
                    1,
                    [
                      {
                        offset: 0,
                        color: '#23CF9C30',
                      },
                      {
                        offset: 1,
                        color: '#23CF9C10',
                      },
                    ],
                    false,
                  ),
                  shadowColor: '#23CF9C10',
                  shadowBlur: 10,
                },
              },
              data: [100, 138, 350, 173, 180, 150, 180, 230],
            },
            {
              name: '整机车间(宁波)',
              type: 'line',
              smooth: true,
              // showSymbol: false,
              symbolSize: 8,
              zlevel: 3,
              areaStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(
                    0,
                    0,
                    0,
                    1,
                    [
                      {
                        offset: 0,
                        color: '#578FFB30',
                      },
                      {
                        offset: 1,
                        color: '#578FFB10',
                      },
                    ],
                    false,
                  ),
                  shadowColor: '#578FFB10',
                  shadowBlur: 10,
                },
              },
              data: [233, 233, 200, 180, 199, 233, 210, 180],
            },
            {
              name: '整机车间(新昌)',
              type: 'line',
              smooth: true,
              // showSymbol: false,
              symbolSize: 8,
              zlevel: 3,
              areaStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(
                    0,
                    0,
                    0,
                    1,
                    [
                      {
                        offset: 0,
                        color: '#6E40F230',
                      },
                      {
                        offset: 1,
                        color: '#6E40F210',
                      },
                    ],
                    false,
                  ),
                  shadowColor: '#6E40F210',
                  shadowBlur: 10,
                },
              },
              data: [400, 300, 250, 140, 289, 13, 320, 180],
            },
            {
              name: '宁波瑞能',
              type: 'line',
              smooth: true,
              // showSymbol: false,
              symbolSize: 8,
              zlevel: 3,
              areaStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(
                    0,
                    0,
                    0,
                    1,
                    [
                      {
                        offset: 0,
                        color: '#FF61E630',
                      },
                      {
                        offset: 1,
                        color: '#FF61E610',
                      },
                    ],
                    false,
                  ),
                  shadowColor: '#FF61E610',
                  shadowBlur: 10,
                },
              },
              data: [20, 525, 241, 321, 58, 122, 75, 243],
            },
          ],
        },
        {
          backgroundColor: '#fff',
          // title: {
          //   text: "注册资金",
          //   subtext: "2016年",
          //   x: "center",
          //   y: "center",
          //   textStyle: {
          //     fontWeight: "normal",
          //     fontSize: 16
          //   }
          // },
          tooltip: {
            trigger: 'item',
            formatter: '{b}:({d}%)',
          },
          legend: {
            top: '0',
            left: 'center',
            orient: 'horizontal',
            // right: "0%",
            // bottom: "0",
            itemWidth: fontSize(10),
            itemHeight: fontSize(10),
            textStyle: {
              fontSize: fontSize(12),
            },
            itemStyle: {
              borderRadius: '50%', // 将图例项的形状设定为圆形
            },
            data: this.tableData[2].map((item) => item['WorkShopName']),
          },
          grid: {
            containLabel: true,
          },
          series: [
            {
              type: 'pie',
              // selectedMode: "single",
              radius: ['30%', '60%'],
              color: [
                '#23CF9C',
                '#578FFB',
                '#6E40F2',
                '#FF61E6',
                '#E82074',
                '#FBA806',
              ],
              center: ['50%', '60%'],
              label: {
                normal: {
                  position: 'inner',
                  formatter: '{d}%',
                  show: true,
                  fontSize: fontSize(10),
                  lineHeight: 15,
                  formatter: function (params) {
                    // let percent = 0;
                    // let total = 0;
                    // for (var i = 0; i < this.tableData[2].length; i++) {
                    //   total += scaleData[i].value;
                    // }
                    // percent = ((params.value / total) * 100).toFixed(0);
                    if (params.name !== '') {
                      // return params.name + '\n' + params.data.data;
                      if (params.name.length > 4) {
                        return (
                          params.name.slice(
                            0,
                            Math.ceil(params.name.length / 2),
                          ) +
                          '\n' +
                          params.name.slice(Math.ceil(params.name.length / 2)) +
                          '\n' +
                          params.percent +
                          '%'
                        );
                      } else {
                        return params.name + params.percent + '%';
                      }
                    } else {
                      return '';
                    }
                  },
                },
                textStyle: {
                  color: '#fff',
                  fontSize: fontSize(12),
                },
              },
              labelLine: {
                normal: {
                  show: false,
                },
              },
              data: this.tableData[2].map((item) => {
                return {
                  value: item['S1'],
                  name: item['WorkShopName'],
                };
              }),
            },
          ],
        },
      ];
      this.chart.map((item, index) => {
        this.barData(item, this.chartOptions[index]);
      });
      // 调用 resize 方法重新渲染图表
      setTimeout(() => {
        this.chart.map((item) => {
          echarts.init(item).resize();
        });
      }, 100);
    },
    handleWindowResize() {
      this.getEcharts();
    },
    handleConsumeBtnClick(index) {
      if (
        (index === 0 && this.selected1Index === 0) ||
        (index === 1 && this.selected1Index === 1)
      ) {
        // 如果用户已经选择了“预计消耗”按钮，那么不做任何操作
        return;
      } else {
        this.selected1Index = index;
        if (index === 0) {
          // 调用第一个方法
          // your code here
        } else {
          // 调用第二个方法
          // your code here
        }
      }
    },
    handleDayBtnClick(index) {
      if (
        (index === 0 && this.selected2Index === 0) ||
        (index === 1 && this.selected2Index === 1)
      ) {
        // 如果用户已经选择了“预计消耗”按钮，那么不做任何操作
        return;
      } else {
        this.selected2Index = index;
        if (index === 0) {
          // 调用第一个方法
          // your code here
        } else {
          // 调用第二个方法
          // your code here
        }
      }
    },
    // 高度控制
    setHeight() {
      let headHeight = this.$refs.headRef.offsetHeight;

      let rem =
        document.documentElement.clientHeight -
        headHeight -
        this.$store.getters.reduceHeight;
      let newHeight = rem + 'px';
      this.$set(this, 'height', newHeight);
    },
    // 第几页
    pageChange(val, remarkTb, filtertb) {
      this.$set(this.tablePagination[remarkTb], 'pageIndex', val);
      this.getTableData(this.formSearchs[remarkTb].datas, remarkTb);
    },
    // 页数
    pageSize(val, remarkTb, filtertb) {
      this.$set(this.tablePagination[remarkTb], 'pageSize', val);
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
        if (order === 'desc') {
          this.formSearchs[remarkTb].datas['sort'] = prop + ' DESC';
        } else {
          this.formSearchs[remarkTb].datas['sort'] = prop + ' ASC';
        }
      } else {
        this.formSearchs[remarkTb].datas['sort'] = null;
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
        if (name != 'dicID') {
          this.formSearchs[remarkTb].datas[name] = null;
        }
      }
    },
    // 导出
    async dataExport(remarkTb) {
      this.adminLoading = true;
      let form = JSON.parse(JSON.stringify(this.formSearchs[remarkTb].datas));
      form['rows'] = 0;
      let res = await ExportData(form);
      this.adminLoading = false;
      this.$store.dispatch('user/exportData', res.data);
    },
    selectFun(data, remarkTb, row) {
      this.selectionData[remarkTb] = data;
    },
    // 删除
    async dataDel(remarkTb, index, parms) {
      let res = null;
      let newData = [];
      if (this.selectionData[remarkTb].length == 0) {
        this.$message.error('请单击需要操作的数据！');
        return;
      } else {
        this.selectionData[remarkTb].forEach((x) => {
          let obj = x;
          obj['ElementDeleteFlag'] = 1;
          newData.push(obj);
        });
      }
      this.$confirm('确定要删除的【' + newData.length + '】数据吗？')
        .then((_) => {
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
    async dataSave(remarkTb, index, parms, newData) {
      let res = null;
      this.adminLoading = true;
      if (newData && newData.length != 0) {
        res = await SaveData(newData);
      } else {
        res = await SaveData(this.tableData[remarkTb]);
      }
      const { datas, forms, result, msg } = res.data;
      if (result) {
        this.$message({
          message: msg,
          type: 'success',
          dangerouslyUseHTMLString: true,
        });
        this.dataSearch(remarkTb);
        this.$set(this, 'adminLoading', false);
      } else {
        this.$message({
          message: msg,
          type: 'error',
          dangerouslyUseHTMLString: true,
        });
        this.$set(this, 'adminLoading', false);
      }
    },
    // 获取表头数据
    async getTableHeader() {
      let res = await GetHeader(this.sysID);
      const { datas, forms, result, msg, formsAll } = res.data;
      if (result) {
        // 获取每个表头
        datas.some((m, i) => {
          m.some((n, index) => {
            // 进行验证
            this.verifyDta(n);
            if (n.children && n.children.length != 0) {
              n.children.forEach((x) => {
                this.verifyDta(x);
              });
            }
            if (index === 1) {
              this.tablePagination[i]['pageSize'] = n['pageSize'];
              this.hasSelect[i] = n['IsSelect'];
              this.Region[i] = n['Region'] ? n['Region'] : this.Region[i];
            }
          });
          // 获取查询的初始化字段 组件 按钮
          forms.some((x, z) => {
            this.$set(this.formSearchs[z].datas, 'dicID', this.sysID[z].ID);
            x.forEach((y) => {
              if (y.prop && y.value) {
                this.$set(this.formSearchs[z].datas, [y.prop], y.value);
              } else {
                this.$set(this.formSearchs[z].datas, [y.prop], '');
              }
            });
            this.$set(this.formSearchs[z], 'forms', x);
            this.$set(this.formSearchs[z], 'formsAll', formsAll[z]);
          });
          this.$set(this.tableColumns, i, m);
        });
        // 获取查询的初始化字段 组件 按钮
        await Promise.all(
          forms.map(async (x, z) => {
            this.$set(this.formSearchs[z].datas, 'dicID', this.sysID[z].ID);
            x.forEach((y) => {
              if (y.prop && y.value) {
                this.$set(this.formSearchs[z].datas, [y.prop], y.value);
              } else {
                this.$set(this.formSearchs[z].datas, [y.prop], '');
              }
            });
            await this.getTableData(this.formSearchs[z].datas, z);
          }),
        );
        this.adminLoading = false;
        await this.getEcharts();
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
    // 获取表格数据
    async getTableData(form, remarkTb) {
      this.$set(this.tableLoading, remarkTb, true);
      form['rows'] = this.tablePagination[remarkTb].pageSize;
      form['page'] = this.tablePagination[remarkTb].pageIndex;
      let res = await GetSearchData(form);
      const { result, data, count, msg, Columns } = res.data;
      if (result) {
        this.$set(this.tableData, remarkTb, data);
        this.$set(this.tablePagination[remarkTb], 'pageTotal', count);
      } else {
        this.$message({
          message: msg,
          type: 'error',
          dangerouslyUseHTMLString: true,
        });
      }
      this.$set(this.tableLoading, remarkTb, false);
    },
    // 刷新页面
    refrshPage() {
      this.$store.dispatch('tagsView/delCachedView', this.$route).then(() => {
        const { fullPath } = this.$route;
        this.$nextTick(() => {
          this.$router.replace({
            path: '/redirect' + fullPath,
          });
        });
      });
    },
    hexToRgba(hex, opacity) {
      let rgbaColor = '';
      let reg = /^#[\da-f]{6}$/i;
      if (reg.test(hex)) {
        rgbaColor = `rgba(${parseInt('0x' + hex.slice(1, 3))},${parseInt(
          '0x' + hex.slice(3, 5),
        )},${parseInt('0x' + hex.slice(5, 7))},${opacity})`;
      }
      return rgbaColor;
    },
    // 行内样式
    cellStyle7({ row, column }) {
      if (column.property == 'OweQty') {
        if (row['OweQty'] < 0) {
          return {
            color: 'red',
          };
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
.APS {
  padding: 10px;
  overflow: hidden;

  .firstNode {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    .leftCard {
      width: 100%;
      height: 55%;
      background: #fff;
      margin-right: 10px;
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    .rightCard {
      width: 100%;
      height: 45%;
      display: flex;
      margin-bottom: 10px;
      .headCard {
        width: 20%;
        height: 100%;
        border-radius: 4px;
        background: #ffffff;
        display: grid;
        justify-self: center;
        align-self: center;
        border-radius: 4px;
        margin-right: 10px;
        box-shadow: 1px 1px 10px rgba(122, 125, 255, 0.1);

        // display: flex;
        // justify-content: space-between;
        margin-right: 10px;
        .box {
          display: flex;
          flex-direction: column;
          // width: calc(25% - 16px);
          width: 100%;
          height: 100%;
          align-items: center;
          justify-content: space-between;

          // border: 1px solid #d5d6ff;
          padding: 40px 10px 40px 10px;
          .textBox {
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .textHead {
              display: flex;
              justify-content: center;
              align-items: center;
              .title {
                font-family: PingFang SC;
                font-weight: 400;
                font-size: 14px;
                color: #979797;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
            }
            .statusNum {
              font-family: PingFang SC;
              font-size: 60px;
              font-weight: 500;
              text-align: center;
              color: #000000;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
        }
      }
      .secondCard {
        width: 50%;
        height: 100%;
        margin-right: 10px;
        .itemCard {
          height: 100%;
          border-radius: 4px;
          background: #ffffff;
          display: flex;
          flex-direction: column;
          width: 100%;
        }
      }
      .thirdCard {
        width: 30%;
        .itemCard {
          height: 100%;
          border-radius: 4px;
          background: #ffffff;
          display: flex;
          flex-direction: column;
          width: 100%;
        }
      }
    }
  }

  .echartHead {
    padding: 0px 20px;
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .echartTitle {
      padding-left: 10px;
      position: relative;
      font-weight: 400;
      font-size: 14px;
      color: #333333;
      font-weight: bold;
    }
    .el-button {
      border-radius: 6px !important;
    }
    .select,
    .el-button:focus,
    .el-button:hover {
      color: #fff;
      border-color: #5c67fd;
      background-color: #5c67fd;
    }
  }
  .echartTitle::before {
    content: ''; /* 伪元素的内容为空 */
    position: absolute; /* 将伪元素设置为绝对定位 */
    top: 50%;
    left: 0; /* 将伪元素向左偏移 50% */
    transform: translateY(-50%) translateX(-50%); /* 通过 transform 属性向左平移自身宽度的一半 */
    display: inline-block; /* 将伪元素设置为行内块元素 */
    width: 4px;
    height: 20px;
    background: #8598ff;
    border-radius: 2px;
    margin-right: 10px;
  }
  .echartBody {
    // height: 480px;
    flex-grow: 1;
    padding: 10px;
    width: 100%;
    // height: 100%;
  }
  .box:hover,
  .itemCard:hover,
  .itemCard1:hover {
    box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.2);
  }
  .APSContainer {
    padding: 0;
  }
}
.Documentation {
  height: 80px;
  width: 80px;
}
</style>
