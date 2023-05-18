<!--表格-->
<template>
  <el-container>
    <el-main>
      <div class="firstNode">
        <div class="leftCard">
          <div class="headCard">
            <div class="box blue">
              <div class="icon">
                <img :src="headCard[0]['icon']" />
              </div>
              <div class="textBox">
                <div class="statusNum">
                  {{ headCard[0]["statusNum"] }}
                </div>
                <div class="textHead">
                  <div class="title">{{ headCard[0]["title"] }}</div>
                </div>
              </div>
            </div>
            <div class="box green">
              <div class="icon">
                <img :src="headCard[1]['icon']" />
              </div>
              <div class="textBox">
                <div class="statusNum">
                  {{ headCard[1]["statusNum"] }}
                </div>
                <div class="textHead">
                  <div class="title">{{ headCard[1]["title"] }}</div>
                </div>
              </div>
            </div>
            <div class="box purple">
              <div class="icon">
                <img :src="headCard[2]['icon']" />
              </div>
              <div class="textBox">
                <div class="statusNum">{{ headCard[2]["statusNum"] }}</div>
                <div class="textHead">
                  <div class="title">{{ headCard[2]["title"] }}</div>
                </div>
              </div>
            </div>
            <div class="box red">
              <div class="icon">
                <img :src="headCard[3]['icon']" />
              </div>
              <div class="textBox">
                <div class="statusNum">{{ headCard[3]["statusNum"] }}</div>
                <div class="textHead">
                  <div class="title">{{ headCard[3]["title"] }}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="secondCard">
            <div class="itemCard1">
              <div class="echartHead">
                <div class="echartTitle">近15日达成率趋势</div>
              </div>
              <div class="echartBody" ref="chart1"></div>
            </div>
            <div class="itemCard2">
              <div class="itemCard">
                <div class="echartHead">
                  <div class="echartTitle">今日工序达成占比</div>
                  <!-- <el-button-group>
                    <el-button
                      :class="{
                        select: selected2Index === 0
                      }"
                      size="small"
                      @click="handleDayBtnClick(0)"
                    >
                      今日
                    </el-button>
                    <el-button
                      :class="{
                        select: selected2Index === 1
                      }"
                      size="small"
                      @click="handleDayBtnClick(1)"
                    >
                      昨日
                    </el-button>
                  </el-button-group> -->
                </div>
                <div class="echartBody" ref="chart4"></div>
              </div>
              <div class="itemCard">
                <div class="echartHead">
                  <div class="echartTitle">物料到货情况</div>
                  <!-- <el-button-group>
                    <el-button
                      :class="{
                        select: selected2Index === 0
                      }"
                      size="small"
                      @click="handleDayBtnClick(0)"
                    >
                      今日
                    </el-button>
                    <el-button
                      :class="{
                        select: selected2Index === 1
                      }"
                      size="small"
                      @click="handleDayBtnClick(1)"
                    >
                      昨日
                    </el-button>
                  </el-button-group> -->
                </div>
                <div class="echartBody" ref="chart4"></div>
              </div>
            </div>
          </div>
          <div class="thirdCard">
            <div class="itemCard"></div>
            <div class="itemCard"></div>
          </div>
        </div>
        <div class="rightCard">
          <div class="firstCard">
            <div class="itemCard">
              <div class="echartHead">
                <div class="echartTitle">待办事项清单</div>
              </div>
              <div class="echartBody" ref="chart3"></div>
            </div>
          </div>
          <div class="secondCard">
            <div class="itemCard">
              <div class="echartHead">
                <div class="echartTitle">昨日计划达成对比</div>
                <el-button-group>
                  <el-button
                    :class="{
                      select: selected1Index === 0
                    }"
                    size="small"
                    @click="handleConsumeBtnClick(0)"
                  >
                    预计消耗
                  </el-button>
                  <el-button
                    :class="{
                      select: selected1Index === 1
                    }"
                    size="small"
                    @click="handleConsumeBtnClick(1)"
                  >
                    预计超额
                  </el-button>
                </el-button-group>
              </div>
              <div class="echartBody" ref="chart2"></div>
            </div>
          </div>
          <div class="thirdCard">
            <div class="itemCard">
              <div class="echartHead">
                <div class="echartTitle">今日生产情况</div>
              </div>
              <div class="echartBody" ref="chart5"></div>
            </div>
          </div>
        </div>
      </div>
      <!-- <div class="listCard">
        <div class="container" v-loading="adminLoading">
          <div class="admin_head" ref="headRef">
            <ComSearch
              ref="searchRef"
              :searchData="formSearchs[0].datas"
              :searchForm="formSearchs[0].forms"
              :remark="0"
              :btnForm="btnForm"
              @btnClick="btnClick"
            />
          </div>
          <div>
            <div class="admin_content">
              <div class="ant-table-title">
                <el-row>
                  <el-col :span="4"
                    ><span class="title">{{ "表格title" }}</span></el-col
                  >
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
                    <el-tooltip
                      effect="dark"
                      content="列设置"
                      placement="bottom"
                    >
                      <span class="right_icon">
                        <span
                          role="img"
                          aria-label="setting"
                          class="anticon anticon-setting icon_size"
                          ><svg
                            class=""
                            data-icon="setting"
                            width="1em"
                            height="1em"
                            fill="currentColor"
                            aria-hidden="true"
                            viewBox="64 64 896 896"
                            focusable="false"
                          >
                            <path
                              d="M924.8 625.7l-65.5-56c3.1-19 4.7-38.4 4.7-57.8s-1.6-38.8-4.7-57.8l65.5-56a32.03 32.03 0 009.3-35.2l-.9-2.6a443.74 443.74 0 00-79.7-137.9l-1.8-2.1a32.12 32.12 0 00-35.1-9.5l-81.3 28.9c-30-24.6-63.5-44-99.7-57.6l-15.7-85a32.05 32.05 0 00-25.8-25.7l-2.7-.5c-52.1-9.4-106.9-9.4-159 0l-2.7.5a32.05 32.05 0 00-25.8 25.7l-15.8 85.4a351.86 351.86 0 00-99 57.4l-81.9-29.1a32 32 0 00-35.1 9.5l-1.8 2.1a446.02 446.02 0 00-79.7 137.9l-.9 2.6c-4.5 12.5-.8 26.5 9.3 35.2l66.3 56.6c-3.1 18.8-4.6 38-4.6 57.1 0 19.2 1.5 38.4 4.6 57.1L99 625.5a32.03 32.03 0 00-9.3 35.2l.9 2.6c18.1 50.4 44.9 96.9 79.7 137.9l1.8 2.1a32.12 32.12 0 0035.1 9.5l81.9-29.1c29.8 24.5 63.1 43.9 99 57.4l15.8 85.4a32.05 32.05 0 0025.8 25.7l2.7.5a449.4 449.4 0 00159 0l2.7-.5a32.05 32.05 0 0025.8-25.7l15.7-85a350 350 0 0099.7-57.6l81.3 28.9a32 32 0 0035.1-9.5l1.8-2.1c34.8-41.1 61.6-87.5 79.7-137.9l.9-2.6c4.5-12.3.8-26.3-9.3-35zM788.3 465.9c2.5 15.1 3.8 30.6 3.8 46.1s-1.3 31-3.8 46.1l-6.6 40.1 74.7 63.9a370.03 370.03 0 01-42.6 73.6L721 702.8l-31.4 25.8c-23.9 19.6-50.5 35-79.3 45.8l-38.1 14.3-17.9 97a377.5 377.5 0 01-85 0l-17.9-97.2-37.8-14.5c-28.5-10.8-55-26.2-78.7-45.7l-31.4-25.9-93.4 33.2c-17-22.9-31.2-47.6-42.6-73.6l75.5-64.5-6.5-40c-2.4-14.9-3.7-30.3-3.7-45.5 0-15.3 1.2-30.6 3.7-45.5l6.5-40-75.5-64.5c11.3-26.1 25.6-50.7 42.6-73.6l93.4 33.2 31.4-25.9c23.7-19.5 50.2-34.9 78.7-45.7l37.9-14.3 17.9-97.2c28.1-3.2 56.8-3.2 85 0l17.9 97 38.1 14.3c28.7 10.8 55.4 26.2 79.3 45.8l31.4 25.8 92.8-32.9c17 22.9 31.2 47.6 42.6 73.6L781.8 426l6.5 39.9zM512 326c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm79.2 255.2A111.6 111.6 0 01512 614c-29.9 0-58-11.7-79.2-32.8A111.6 111.6 0 01400 502c0-29.9 11.7-58 32.8-79.2C454 401.6 482.1 390 512 390c29.9 0 58 11.6 79.2 32.8A111.6 111.6 0 01624 502c0 29.9-11.7 58-32.8 79.2z"
                            ></path></svg
                        ></span>
                      </span>
                    </el-tooltip>
                  </el-col>
                </el-row>
              </div>
              <ComVxeTable
                :rowKey="'RowNumber'"
                :height="height"
                :tableData="tableData[0]"
                :tableHeader="tableColumns[0]"
                :tableLoading="tableLoading[0]"
                :remark="0"
                :sysID="ID"
                :isEdit="isEdit"
                :isClear="isClear[0]"
                :hasSelect="isSelect"
                :pagination="tablePagination[0]"
                @selectfun="selectFun"
                @handleRowClick="handleRowClick"
                @pageChange="pageChange"
                @pageSize="pageSize"
                @sortChange="sortChange"
              />
            </div>
          </div>
        </div></div
    > -->
    </el-main>
  </el-container>
</template>

<script>
let _this;
import ComSearch from "@/components/ComSearch";
import ComVxeTable from "@/components/ComVxeTable";
import * as echarts from "echarts";
import { debounce } from "lodash";
import {
  GetHeader,
  GetSearchData,
  ExportData,
  SaveData,
  GetSearch
} from "@/api/Common";
export default {
  name: "PostMRPAnalysis",
  components: {
    ComSearch,
    ComVxeTable
  },
  data() {
    return {
      headCard: [
        {
          icon:
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAYAAACohjseAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAASfSURBVHgB5Zo7TBtBEIbH5pWEhxJFwqmhp0oTevogpYyUNj0SXRSlRaJMlD60kahDlQZ6+tCbKAEJCA9jnPl9M2ZZn+3dubWNk08azpzv1vvvzL63RIlpNBolvkw4Ns5WZhvzHq2L3bBdsdVKpdIVJaZECRBRU2zTlImypttgu2S7YLHnlIBCAkXYDGXCkhSWA7wLj56w2DoZMWWqz8LyOGX7YxEanTkWh1B8QoMR5gJxJ7GhG5xJ8doc2yMaLmeUCW2EPBwkkMWhBYTXJuh+AG/+CgnZngJF3FNqb+aHTZDIrgLvsTilp8iOAkdAnNJVZDnvpjQooyAONNsHyXMb5Q4vzdFoiFPQ+M3mfTHu3+CSeEjhXQE6+lUxfN5n25JrLEtsr+ValTQ+U9YtBOWF837JoXrp3rzj1sh6B0EbbIs5322y7VA4L9je59z/wbZO4SJRD3+6faQfovBcUXFgieJY7nB/UX5nmsIY859teVC8N987jWYCn9gqzj2U9B5lIYbwWpfrtGS+4j1flXcO5HNFhOC6Je8seOmHehLTr0P1oivwMV8eBiSwxrbS4ceRQQyMF+m2PvUCdQ3hvEvZAL4qVwh2RW6JhYChHPJxRyC8FxKeX+k2DPyShUAUQGyIAnjzA2UCgS8SGX4VmFbLi806KC1naLfgxjjCUsXBqwhdizgAIR/pNjogaNf5fobCga5J/QBCQlNxuwCEYUWu8Fy3xuBM3q12eWZG0nnppKscUBzNAlGBk+Hv3akHyKz2X71An7ZOYfXoLWUedQvjC8UxjtHNGP+BuJg5Hn4UpYnlhC3JTEj47Ml7aICWA55/zvaOssLfZvtOcaB9ucRIxjLH2xVDOFWoP6DQEKqbZGccITpFNiBshfoL0g/t5POYgEDr2soqDYYivzORtyAbirU7iKVIlJStAlE/FmgwoCpYw3SsTDYGJU4xN2RWgYPmGRmxCrSUaOicLikQaFn3r0Y+jwGBjisthXNKNuoQGLRC7BEj0J3moEUMGdb5WAVeQ6BlTw4CQ0LOF7dG8ejQ0MINBF6TjV5rLinEAcsClnIFgTWysdvjuxTiQMzilc+1etBSD/epc+lixqBj1SLidPnQwg22xJvjUJ4yYakwZk6oYLi2Qf3jDcW32Mo5CzzWftDaR+lCbz9AulZxoLkArALRklrCVDNSpJ7ksUPFCq6uO8FNgfwPVqGsfQ3ApHSb0rBDxSa5oLV87y4bQuw8Fdt7Ryeu+xSxoJpg3SVFQR3qdpq/N4Fp0CwVQ1fDQudxEKbdSpE6p7QWfYEvMIUXFQhFK+su3cOzEIQMoIHCCOUbpRuIt22GtglhkQ8oO3Awihz7x0zapkv8wAUNaWpTkNO8MzSd5oMIIesYdRggJHN7gVyB0m38JttccdBovcvtx//fYyTKP30QSLmHIjHFO0pylEuRPlKPUA4TNCanSQ/juchmKUY7g/YmBB35x0R6YT0QC3EqtN9AGLx2Fuo1l6JHmiEUYYsdqtQeLSRMSXZqV0IXw7ypAulCCOamGEldFRGm9OVYsuwaY2N1Un4D3vWPjelaUE0+41pLIcrlL1wxaqCRnNtbAAAAAElFTkSuQmCC",
          title: "今日库存金额",
          statusNum: "3,841",
          changeNum: "+4500",
          iconStatus: true
        },
        {
          icon:
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAYAAACohjseAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAPQSURBVHgB5Zo9bxNBEIZfHzYhOAkgJNKHPj+Anp6IFokSlBZBT4tEiUQbQYmUlEj08C/og8SHFDvEdhwzr2832du7OHe7c/7ikcZnTXzRvTezs58NKDMajRpyaTnWFEvErnk/HRo7E+uLDRqNRh/KNKCAEbUi1kYqKvT/jsR6Yici9i8UiBJohK0hFabyshwYXUb0SMQOEUjQQ9UsrIiO2HGI0MoPJ+KYincwHWEuFHdUNXVLP6SJ2obYTcyWLlKhozI/LiVQxLECMmotzAeM5s8yKXulQCPuLvJlftaUEjlR4ByLs1wp8lKBCyDOMlFkUuQ0BWURxJFxfTDPnCO55KYNLIY4C4vfetEfcgLlTaxi9l1BCG3TR2fICDTtbh2Lyy0/Vf0IMnKLlJo+fPa262jaLyZ6awhjR+yR2CZ0OBT7IvYR1WGqdu1I5zyc4rwtl1VU54mxOngvdoDqcCjHAXomRa8jjAeojx2E0bZtcZyipnKGtj03578hfeuhsIk8E9tGHAwcA9azbTAkNYv4gLT9hMJ72e7eIB6+rJ5N0dD09OkinpgX5NJkmibyQXHTnrxOAwavNf7A8tKkwBXoodEPavWlpMUio5meL8TeIhxW5OfQYyxQc2jGt69RAbVIilacl4lrCZacJnR5hbQfYyf7zvO56Vvk20Xaj6qmubbAQ8d8X9Hv2p6v6/miaUhHfw9x7XAPF6WdD9gx332fXeqv4qPopwhnyAiWWiEuSRv5CMT4YjllkdHck2MUbKpp+GI5YwRPocdLse9I0+yT52PK7k3wPTZX1xdLnwIH0IPCNpFd+rC+zSt8W7ioolqcssgwTVloQodsbpHRJqbInMmyxWEiH9wj14zivMCt8PN+kKmhMellu7LdxHYJH1N1a4IvhoxAVlJ2F7Ezi9e46NQ/ez63eBT5ds1Vo8gM7U7wWCDTVNoi317sqjYj5I9QrM9tp/eRLzLbzt9i6dkv7rpoaLGps8gwbXdRnR92O+18NmGKTQfV2Ud9fEV1MsdO/MH2MdJGXiWKB+aeh9Bdut9H9VVtCsucwsgJkVS9gfTAwSLyxz9mkpvwyg9OoDsenBadojM0l83o2RY1x6h1w9QsrB+FAk3B+WVunHfsIYTCad//e4zEstQHgSxzKJKTg98qR7ksZqTjrpfMChaTjuphPBezWcox67SjSUGMWq/KTaEHYinOCq0bCmPUumWj5hJ7pNmezOAOlXZEo4RZ1HaWTOpymLcS8X8phHNTjqT6McIstezsml1jbqza3WNG1x/Yc6REAQPzndeBhiiXf9lhRWO5QrhCAAAAAElFTkSuQmCC",
          title: "今日在途金额",
          statusNum: "2,840",
          changeNum: "-4500",
          iconStatus: false
        },
        {
          icon:
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAYAAACohjseAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAQOSURBVHgB5Zq9TxtBEMWfDYYQA0oUCVKHOqQmPT30SGnTI+WPiJSe1KGHPj2pQ2roIcqHhJ2AjXHm3e2i5Xz23c7u2Tj8pPHXnU/3bmZnd2e3hsj0+/2avDUcmxWri81kTu0ZuxHriHVrtVoHkakhAkbUvFgTqSjtdftiV2KXIvYvIhAk0AhbRCosysNyoHfp0QsR24MS1U1VLCyPltgfjVDvmxNxDMWnGI8wF4q78A3d0jdpvLYs9hiTpY1UaL/MyaUEijhmQHqtgfsBvfmjTMgWCjTinmEwzU+aUiJHCrzH4iyFIocKnAJxlpEi63k/moQyDeJIkh/MPQ9QH/KnZUyHOAuT31LegQGB8iQWMPmuQEPT9NF3uOPWyO2Oo5w1sQ2xdbHn5jfCvuzE2LHYF8SB7fC720dmBdLNiwiDIraNNUv+50zss7EzhMFBQMt+uRVovLeCMChqB+WFZaG4faRCtXD6dW696Ap8Im8L0PNWbAtxOBTbg55bL7pJZg56dhFPHMy1dqGnabuNRKDJnNrEQs9tIj6b5toaqGvOfiDa0ORNxPRcli3or58kSytQE56rSBNK1WiT1izDtC4vFKeZvNJ7q6geemIb/tB5jeQFOmK2O3YL7RHHGaYqL1LgPPx5jXjeY7/3QezdiHPoxTX4k3hQE57riMO+MbJRcG7R8TwaeQXZMrxAOK64HRQnrFfwp64VqAkXF19xRDOMnKlDR5kGPyxpaMQR1SRAK7AICngjdprzu0acGq3AdsHxI6TVaGZGKzJUXAsKKFBT9y+as71HmoisSHYDoZ47hT89CixVIc5wXHCc7cUVaed3IWF5An+uKVCzJndU4hxXJAltc9/gzw0XJ6/hD8OF7bAom1qRrLmEDO3YJMo81CwderALfxh2ByXPpcjQcau2hJGEKD2oaYcsKxRl0xjYgpQvN1wSr8sLizRaL35C9TD7aiptXAq/7Qe1njg0VhVsBtrwvCOQmVQTpmQPYWW+YfCaH6GjZ1eCE4EmTFUjBQM78piePDDX1HJlP7h1UYpdQdjaO7Ml+zrtZJhNhe069GGd2+W0bOmeKX0JYVDcJvxqNhR2YCw0M+eX7kkkL7qwtPES6fyR5i6+MDN+RToIOEGcLmdgMXRAiIh8hHTDwTTyO7vNZGC6JCdcYjwdeGxaeXtohs0HGcOaMeqkYEjm9gK5Ak238RO6ueK4se0utx9/uNtILP/1RiDLPRTJycGvKFu5LKaPtFsoJwmTSSvqZjwXs1jK0c64vUlB9NqVz5+0G2IpzgqtGgqj19plveYSuqWZQhm2XKGK7dEgYZZou3ZN6HKYNx9wXQrh3JQjqU6IMEsl25LNqjEXVu3qMb07mznN1oK65jPfuzFEufwD3aFHrIhsWHoAAAAASUVORK5CYII=",
          title: "超订金额",
          statusNum: "45.21%",
          changeNum: "+4500",
          iconStatus: true
        },
        {
          icon:
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAYAAACohjseAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAARrSURBVHgB5Zo9UBNBFMf/CQmIBPyaIdbY02tPD31mbBlbHUtnoHSkdYZae+zptccaa3FGZYYETEKI+8/tJsdlL7f3dvOlv5nHHbnL5f739t57+1FAYLrdbkFtyjErKSsqW0ic2tF2o6ylrF0oFFoITAEB0KKWlK0gEiW9bldZU9kfJfYKAfASqIVVEAkL8rBi0Lv06IUS24EQ0U2NWZiNurJLidDcN6fEsSk+wGSExaG4i7xN1/kmtdfWlN3FdGkgEtp1OdlJoBLHCEivlTEb0Js/XZpspkAt7hGGw/y0cRI5UuAMizNkikwVOAfiDCNFFm0f6oAyD+JILz7oex6imPKlNcyHOAOD36rtwJBA9SSWMf1UIGFF5+hb3BKo37tVzC/3kk21lDiBngvdNKvKNvW2qj87U3aqt98QDt47y8e6+aAvUHuvgjDwR3a0rWScS5HH2s4Q4LeVloapdPruVB/eV5tl+FODmzAbH7X5wlKu58W4wHX4NU82vzfKnsAPevE1/LzJTvQPerEXZHTk9BX3Fv7i4teqQg51LZod4tM0Q9zQOK7ZiydG4CLkhBZnME1eSokpY0H9oThpYmdAeTbiON+jr4geYCXl+CGipm07/lBvT5AfxpcmPSjt4/EJ10YcZxR7oWxP2UHKOfsYpIg0tiGLyKREgUuQsZVxvKGN2CIi0wGTfTXjWvTsDmSUKVA6tpIl0Hj4qbLdxLEjDPKdyzu8DRllVjKS9LABt8Bia8L02qHe33W8TkWflzc3Fm0jzi48hgze4L7ep/g8ntlEfhaKkLGB/PB9NBUKm20t5/dFqUgqUPJjHxCJ43d38399sgLzwoDyCVG4H1dhYIUCJeP+eV72LxhEzFeQi5MU3x0KdBohFv4Yz3un903KkCLpGF9ToGROzqV0Mt0eBhcm6mRQYfVyCPeH9R35uWEevEZ+eFO88VEl1AEGQSUp7jMG5RvPySqqpUMbLXqwDRlHI47xnaOXTbcn+SDihbVLnXkMGb0mSg9K3kNGxQZG3xA9YwsqTNovETVdl5QhEXjDKfFeHaq6TBzFlvQJa7AnbDYn9iYk1UcS6TjNlRJ4bgTeQTQ9JuE9ZJWNC3z3nkPGOSdLTaJnJJU0U7KHMMN9SUwUltAxM8E9geofjkLVISPEKFjoazbNTrxUu4TciyFFnga4Vt9Ztzq76l1k+Padm0gLPFkwIsc7wlL6g74kKZAeXYf/CgozDLGF7NrTCDtCetpxZWgydEiIZ0S1wREzioyPApxpO0HYd/c8uczE6iklkhOg0pGsaVFX4i6SH6b1B9mGJTXqtGCTtGYBq0CdNn5B1lecNOa9s2aA/3cZieGfXghkmEGR7OL9DrKUy6BzpFlCOU0YTOpBF+PF0ZOlrHYm7U0Koteaeb4kXRBLcUbouKEweq3h6rU4vkuazcoMzlCF9qiXMEOwVbu66bLMW4LfonT2TVmTtnyEGcayLFnPGnNidVH/Br2bXHRkxoLaep/bdghRcf4CDSBerRoxXgcAAAAASUVORK5CYII=",
          title: "超订计划金额",
          statusNum: "34.24%",
          changeNum: "+4500",
          iconStatus: true
        }
      ],
      ID: 9046,
      isEdit: false,
      isSelect: false,
      adminLoading: false,
      height: "700px",
      newTag: -1,
      btnForm: [],
      tableData: [[]],
      tableColumns: [[]],
      tableLoading: [false],
      isClear: [false],
      tablePagination: [{ pageIndex: 1, pageSize: 100, pageTotal: 0 }],
      formSearchs: [
        {
          datas: {},
          forms: []
        }
      ],

      //echart部分
      chartData1: [],
      chartData2: [[], []],
      chart: [],
      chartOptions: [],
      handleWindowResizeDebounced: null,
      selected1Index: 0,
      selected2Index: 0
    };
  },
  watch: {},
  created() {
    _this = this;
    let routeBtn = this.$route;
    // 获取所有按钮
    this.btnForm = this.$route.meta.btns;
    this.$common.judgeBtn(this, this.btnForm);
    // this.ID = parseInt(routeBtn.meta.dicID);
    this.getTableHeader();
  },
  activated() {},
  async mounted() {
    await this.getEchartsData1();
    await this.getEchartsData2();
    // await this.getEchartsData3();
    // await this.getEchartsData4();
    //初始化图表;
    this.chart = [
      this.$refs.chart1,
      this.$refs.chart2,
      this.$refs.chart3,
      this.$refs.chart4,
      this.$refs.chart5
    ];
    await this.getEcharts();
    // 在窗口大小变化时，调用 resize 方法重新渲染图表
    this.handleWindowResizeDebounced = debounce(this.handleWindowResize, 200); //设置防抖
    window.addEventListener("resize", this.handleWindowResizeDebounced);
  },
  methods: {
    // 渲染echart图
    barData(id, option) {
      // echarts.dispose(id);
      echarts.init(id).setOption(option);
    },
    getEcharts() {
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
          textStyle: {
            fontSize: fontSize(14)
          },
          tooltip: {
            trigger: "axis",
            formatter: function(params, ticket, callback) {
              var res = params[0].name;

              for (var i = 0, l = params.length; i < l; i++) {
                if (params[i].seriesType === "line") {
                  res +=
                    "<br/>" +
                    params[i].seriesName +
                    " : " +
                    (params[i].value ? params[i].value : "-") +
                    "%";
                } else {
                  res +=
                    "<br/>" +
                    params[i].seriesName +
                    " : " +
                    (params[i].value ? params[i].value : "-") +
                    "个";
                }
              }
              return res;
            }
          },
          grid: {
            containLabel: true
          },
          legend: {
            data: ["库存金额", "在途金额"]
          },
          xAxis: [
            {
              type: "category",
              axisTick: {
                alignWithLabel: true,
                show: false
              },
              data: [
                "9月1日",
                "9月2日",
                "9月3日",
                "9月4日",
                "9月5日",
                "9月6日",
                "9月7日"
              ],
              axisLine: {
                show: true,
                lineStyle: {
                  color: "#CCCCCC"
                }
              },
              axisLabel: {
                textStyle: {
                  color: "#666666", // 设置文字颜色为灰色
                  fontSize: fontSize(14)
                }
              }
            }
          ],
          dataZoom: [
            {
              type: "slider",
              xAxisIndex: 0,
              filterMode: "empty",
              start: 0,
              end: 100
            },
            {
              type: "inside",
              xAxisIndex: 0,
              filterMode: "empty",
              start: 0,
              end: 100
            }
          ],
          yAxis: [
            {
              type: "value",
              name: "个数",
              position: "left",
              nameTextStyle: {
                align: "right",
                color: "#666",
                fontWeight: "bold",
                fontSize: fontSize(14)
              },
              axisLabel: {
                formatter: "{value}",
                textStyle: {
                  color: "#666666", // 设置文字颜色为灰色
                  fontSize: fontSize(14)
                }
              },
              axisLine: {
                show: true,
                lineStyle: {
                  color: "#CCCCCC"
                }
              },
              axisTick: {
                show: false
              },
              splitLine: {
                show: false,
                lineStyle: {
                  color: ["#CCCCCC"]
                }
              }
            },
            {
              type: "value",
              name: "增长率",
              position: "right",
              min: function(value) {
                return value.min * 2;
              },
              max: function(value) {
                return value.max * 2;
              },
              nameTextStyle: {
                align: "right",
                color: "#666",
                fontWeight: "bold",
                fontSize: fontSize(14)
              },
              axisLabel: {
                formatter: "{value}%",
                textStyle: {
                  color: "#666666", // 设置文字颜色为灰色
                  fontSize: fontSize(14)
                }
              },
              axisLine: {
                show: true,
                lineStyle: {
                  color: "#CCCCCC"
                }
              },
              axisTick: {
                show: false
              },
              splitLine: {
                show: false,
                lineStyle: {
                  color: ["#CCCCCC"]
                }
              }
            }
          ],
          series: [
            {
              name: "库存金额",
              type: "line",
              yAxisIndex: 1,
              label: {
                normal: {
                  show: true,
                  position: "top",
                  color: "#666",
                  formatter: function(params) {
                    return params.data.toFixed() + "%";
                  }
                }
              },
              lineStyle: {
                normal: {
                  // width: 3,
                  shadowColor: "#5964FE"
                  // shadowBlur: 10,
                  // shadowOffsetY: 10
                }
              },
              itemStyle: {
                color: "#5964FE"
              },
              data: [0, -25.0, 5.56, -21.05, 33.33, -10.0, -33.33]
            },
            {
              name: "在途金额",
              type: "line",
              yAxisIndex: 1,

              label: {
                normal: {
                  show: true,
                  position: "top",
                  color: "#666",
                  formatter: function(params) {
                    return params.data.toFixed() + "%";
                  }
                }
              },
              lineStyle: {
                normal: {
                  // width: 3,
                  shadowColor: "#33CB90"
                  // shadowBlur: 10,
                  // shadowOffsetY: 10
                }
              },
              itemStyle: {
                color: "#33CB90"
              },
              data: [0, -23.81, -43.75, -11.11, 137.5, -42.11, -36.36]
            },
            {
              name: "库存金额",
              type: "bar",
              yAxisIndex: 0,
              label: {
                normal: {
                  show: true,
                  position: "top"
                }
              },
              barWidth: fontSize(20),
              data: [1200, 900, 950, 750, 1000, 900, 600],
              itemStyle: {
                color: "#5964FE"
              }
            },
            {
              name: "在途金额",
              type: "bar",
              yAxisIndex: 0,
              label: {
                normal: {
                  show: true,
                  position: "top"
                }
              },
              barWidth: fontSize(20),
              data: [2100, 1600, 900, 800, 1900, 1100, 700],
              itemStyle: {
                color: "#33CB90"
              }
            }
          ]
        },
        {
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b}: {c}"
          },
          textStyle: {
            fontSize: fontSize(14)
          },
          grid: {
            left: "8%",
            right: "8%",
            bottom: "10%",
            containLabel: true
          },
          legend: {
            data: ["估算库存", "预计消耗"],
            bottom: "0",
            textStyle: {
              color: "#666"
            }
          },
          xAxis: {
            show: false,
            type: "value",
            max: function(value) {
              return value.max * 1.2;
            },
            splitLine: {
              lineStyle: {
                color: "rgba(255,255,255,0.2)"
              }
            },
            axisTick: {
              show: false
            },
            axisLine: {
              //  改变x轴颜色
              lineStyle: {
                color: "#3c4654"
              }
            },
            axisLabel: {
              //  改变x轴字体颜色和大小
              textStyle: {
                color: "#666"
              }
            }
          },
          yAxis: [
            {
              type: "category",
              name: "日期",
              inverse: true,
              data: ["3月1", "3月2", "3月3", "3月4", "3月5", "3月6", "3月7"],
              nameLocation: "start",
              nameTextStyle: {
                align: "right",
                color: "#333",
                fontWeight: "bold",
                fontSize: fontSize(14)
              },
              splitLine: {
                show: true
              },
              axisTick: {
                show: false
              },
              axisLine: {
                show: false,
                //  改变y轴颜色
                lineStyle: {
                  color: "#3c4654"
                }
              },
              axisLabel: {
                //  改变y轴字体颜色和大小
                //formatter: '{value} m³ ', //  给y轴添加单位
                textStyle: {
                  color: "#666",
                  fontSize: fontSize(12)
                }
              }
            },
            {
              type: "category",
              inverse: true,
              name: "预计库存结余",
              nameLocation: "start",
              nameTextStyle: {
                align: "center",
                color: "#333",
                fontWeight: "bold",
                fontSize: fontSize(14)
              },
              axisTick: "none",
              axisLine: "none",
              show: true,
              axisLabel: {
                textStyle: {
                  color: "#666",
                  fontSize: fontSize(12)
                }
              },
              data: [200, 200, 200, 100, 100, 400, 100]
            }
          ],
          series: [
            {
              type: "bar",
              name: "估算库存",
              itemStyle: {
                normal: {
                  label: {
                    show: true, //开启显示
                    position: "right", //在上方显示
                    textStyle: {
                      //数值样式
                      color: "#666666"
                    }
                  },
                  color: "#0084BD",
                  borderWidth: 0
                  // barBorderRadius: [0, 30, 30, 0] //圆角大小
                }
              },
              data: [1000, 600, 1000, 900, 800, 1000, 500],
              barWidth: fontSize(10)
            },
            {
              type: "bar",
              name: "预计消耗",
              itemStyle: {
                normal: {
                  label: {
                    show: true, //开启显示
                    position: "right", //在上方显示
                    textStyle: {
                      //数值样式
                      color: "#666666"
                    }
                  },
                  color: "#E87171",
                  borderWidth: 0
                  // barBorderRadius: [0, 30, 30, 0] //圆角大小
                }
              },
              data: [800, 400, 800, 800, 700, 600, 400],
              barWidth: fontSize(10)
            }
          ]
        },
        {
          tooltip: {
            //提示框组件
            trigger: "axis",
            formatter: "{b}<br />{a0}: {c0}<br />{a1}: {c1}",
            // axisPointer: {
            //   type: "shadow",
            //   label: {
            //     backgroundColor: "#6a7985"
            //   }
            // },
            textStyle: {
              color: "#fff",
              fontStyle: "normal"
            }
          },
          grid: {
            left: "2%",
            right: "2%",
            bottom: "10%",
            containLabel: true
          },
          legend: {
            //图例组件，颜色和名字
            bottom: "0",
            itemGap: fontSize(72),
            itemWidth: fontSize(12),
            itemHeight: fontSize(12),
            data: [
              {
                name: "昨日"
              },
              {
                name: "今日"
              }
            ],
            textStyle: {
              color: "#666666",
              fontStyle: "normal",
              fontSize: fontSize(14)
            }
          },
          xAxis: [
            {
              type: "category",
              //	boundaryGap: true,//坐标轴两边留白
              data: [
                "采购员1",
                "采购员2",
                "采购员3",
                "采购员4",
                "采购员5",
                "采购员6",
                "采购员7",
                "采购员8",
                "采购员9",
                "采购员A"
              ],
              axisLabel: {
                //坐标轴刻度标签的相关设置。
                interval: 0, //设置为 1，表示『隔一个标签显示一个标签』
                margin: fontSize(12),
                textStyle: {
                  color: "#666666",
                  fontStyle: "normal",
                  fontSize: fontSize(14)
                }
              },
              axisTick: {
                //坐标轴刻度相关设置。
                show: false
              },
              axisLine: {
                //坐标轴轴线相关设置
                lineStyle: {
                  color: "#D9DFF3"
                }
              },
              splitLine: {
                //坐标轴在 grid 区域中的分隔线。
                show: false
              }
            }
          ],
          yAxis: [
            {
              type: "value",
              name: "金额",
              splitNumber: 5,
              axisLabel: {
                textStyle: {
                  color: "#a8aab0",
                  fontStyle: "normal",
                  fontSize: fontSize(12)
                }
              },
              nameTextStyle: {
                fontWeight: "bold",
                fontSize: fontSize(14),
                align: "right",
                color: "#333"
              },
              axisLine: {
                show: true,
                lineStyle: {
                  color: "#D9DFF3"
                }
              },
              axisTick: {
                show: false
              },
              splitLine: {
                show: true,
                lineStyle: {
                  color: ["#F5F7FE"]
                }
              }
            }
          ],
          // dataZoom: [
          //   {
          //     show: true,
          //     height: fontSize(15),
          //     xAxisIndex: [0],
          //     bottom: 0,
          //     start: 0,
          //     end: 100,
          //     handleSize: "100%",
          //     handleStyle: {
          //       color: "#d3dee5"
          //     },
          //     textStyle: {
          //       color: "#666"
          //     },
          //     borderColor: "#90979c"
          //   },
          //   {
          //     type: "inside",
          //     show: true,
          //     height: fontSize(15),
          //     start: 0,
          //     end: 100
          //   }
          // ],
          series: [
            {
              name: "昨日",
              type: "bar",
              data: [
                15600,
                17500,
                20000,
                8000,
                24500,
                17500,
                12500,
                21000,
                15000,
                5100
              ],
              barWidth: fontSize(20),
              barGap: 0, //柱间距离
              label: {
                //图形上的文本标签
                normal: {
                  show: true,
                  position: "top",
                  textStyle: {
                    color: "#01E197",
                    fontStyle: "normal",
                    fontSize: fontSize(8)
                  }
                }
              },
              itemStyle: {
                normal: {
                  show: true,
                  color: "#01E197",
                  barBorderRadius: [50, 50, 0, 0],
                  borderWidth: 0
                }
              }
            },
            {
              name: "今日",
              type: "bar",
              data: [
                12500,
                18000,
                16000,
                7500,
                28000,
                14800,
                8000,
                18000,
                17000,
                5000
              ],
              barWidth: fontSize(20),
              barGap: 0, //柱间距离
              label: {
                //图形上的文本标签
                normal: {
                  show: true,
                  position: "top",
                  textStyle: {
                    color: "#1A8CDD",
                    fontStyle: "normal",
                    fontSize: fontSize(8)
                  }
                }
              },
              itemStyle: {
                normal: {
                  show: true,
                  color: "#1A8CDD",
                  barBorderRadius: [40, 40, 0, 0],
                  borderWidth: 0
                }
              }
            }
          ]
        },
        {
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b}: {c} ({d}%)"
          },
          legend: {
            orient: "horizontal",
            top: 0,
            itemWidth: fontSize(14),
            itemHeight: fontSize(14),
            align: "left",
            itemGap: fontSize(100),
            data: ["异常超订金额", "正常超订金额"],
            textStyle: {
              color: "#999999",
              fontSize: fontSize(14)
            }
          },
          series: [
            {
              name: "数据统计",
              type: "pie",
              hoverAnimation: false,
              legendHoverLink: false,
              radius: ["40%", "55%"],
              color: ["#6866F8", "#FE4E4E"],
              label: {
                normal: {
                  fontSize: fontSize(20),
                  // position: "inner",
                  formatter: "{c}"
                }
              },
              data: [
                { value: 1244, name: "异常超订金额" },
                { value: 254, name: "正常超订金额" }
              ]
            }
          ]
        },
        {
          backgroundColor: "#fff",
          color: [
            "#0090FF",
            "#36CE9E",
            "#FFC005",
            "#FF515A",
            "#8B5CFF",
            "#00CA69"
          ],
          legend: {
            top: "0%"
          },
          tooltip: {
            trigger: "axis",
            extraCssText:
              "background: #fff; border-radius: 0;box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);color: #333;",
            axisPointer: {
              type: "shadow",
              shadowStyle: {
                color: "#ffffff",
                shadowColor: "rgba(225,225,225,1)",
                shadowBlur: 10
              }
            }
          },
          grid: {
            left: "10px",
            right: "10px",
            bottom: "10px",
            containLabel: true
          },
          xAxis: [
            {
              type: "category",
              boundaryGap: false,
              axisLabel: {
                formatter: "{value}月",
                textStyle: {
                  color: "#333"
                }
              },
              axisLine: {
                lineStyle: {
                  color: "#D9D9D9"
                }
              },
              data: ["1", "2", "3", "4", "5", "6", "7", "8"]
            }
          ],
          yAxis: [
            {
              type: "value",
              name: "单位：万",
              axisLabel: {
                textStyle: {
                  color: "#666"
                }
              },
              nameTextStyle: {
                color: "#666",
                fontSize: 12,
                lineHeight: 40
              },
              splitLine: {
                lineStyle: {
                  type: "dashed",
                  color: "#E9E9E9"
                }
              },
              axisLine: {
                show: false
              },
              axisTick: {
                show: false
              }
            }
          ],
          series: [
            {
              name: "计划数",
              type: "line",
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
                        color: "#0090FF30"
                      },
                      {
                        offset: 1,
                        color: "#0090FF10"
                      }
                    ],
                    false
                  ),
                  shadowColor: "#0090FF10",
                  shadowBlur: 10
                }
              },
              data: [100, 138, 350, 173, 180, 150, 180, 230]
            },
            {
              name: "生产数",
              type: "line",
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
                        color: "#36CE9E30"
                      },
                      {
                        offset: 1,
                        color: "#36CE9E10"
                      }
                    ],
                    false
                  ),
                  shadowColor: "#36CE9E10",
                  shadowBlur: 10
                }
              },
              data: [233, 233, 200, 180, 199, 233, 210, 180]
            }
          ]
        }
      ];
      this.chart.map((item, index) => {
        this.barData(item, this.chartOptions[index]);
      });
      // 调用 resize 方法重新渲染图表
      setTimeout(() => {
        this.chart.map(item => {
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
    selectFun(data, remarkTb, row) {
      this.selectionData[remarkTb] = data;
    },
    // 删除
    async dataDel(remarkTb, index, parms) {
      let res = null;
      let newData = [];
      if (this.selectionData[remarkTb].length == 0) {
        this.$message.error("请单击需要操作的数据！");
        return;
      } else {
        this.selectionData[remarkTb].forEach(x => {
          let obj = x;
          obj["ElementDeleteFlag"] = 1;
          newData.push(obj);
        });
      }
      this.$confirm("确定要删除的【" + newData.length + "】数据吗？")
        .then(_ => {
          _this.dataSave(remarkTb, index, null, newData);
        })
        .catch(_ => {});
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
          type: "success",
          dangerouslyUseHTMLString: true
        });
        this.dataSearch(remarkTb);
        this.$set(this, "adminLoading", false);
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true
        });
        this.$set(this, "adminLoading", false);
      }
    },
    // 获取表头数据
    async getTableHeader() {
      let IDs = [{ ID: this.ID }];
      let res = await GetHeader(IDs);
      const { datas, forms, result, msg } = res.data;
      if (datas.length > 0) {
        this.tablePagination[0].pageSize = datas[0][0].pageSize;
      }

      if (result) {
        // 获取每个表头
        datas.some((m, i) => {
          m.some((n, j) => {
            this.isSelect = n.IsSelect;
            if (n.prop == "Operation" || n.label == "操作") {
              this.newTag = j;
              return true;
            }
            // 进行验证
            this.verifyDta(n);
            if (n.childrens && n.children.length != 0) {
              n.childrens.forEach(x => {
                this.verifyDta(x);
              });
            }
          });

          this.$set(this.tableColumns, i, m);
        });
        // 获取查询的初始化字段 组件 按钮
        forms.some((x, z) => {
          this.$set(this.formSearchs[z].datas, "dicID", IDs[z].ID);
          x.forEach(y => {
            if (y.prop && y.value) {
              this.$set(this.formSearchs[z].datas, [y.prop], y.value);
            } else {
              this.$set(this.formSearchs[z].datas, [y.prop], "");
            }
          });
          this.$set(this.formSearchs[z], "forms", x);
        });
        this.adminLoading = false;
        if (this.newTag != -1) {
          this.tableColumns.splice(this.newTag, 1);
        }
        // if (sessionStorage.getItem("dicIDForm" + this.ID)) {
        //   let tmp = JSON.parse(sessionStorage.getItem("dicIDForm" + this.ID));

        //   if (tmp.dicID) {
        //     this.formSearchs[0].datas = tmp;
        //   }
        // }
        this.formSearchs[0].datas["dicID"] = this.ID;
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
        this.$set(this.tableData, remarkTb, data);
        this.$set(this.tablePagination[remarkTb], "pageTotal", count);
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true
        });
      }
      this.$set(this.tableLoading, remarkTb, false);
    },
    // 刷新页面
    refrshPage() {
      this.$store.dispatch("tagsView/delCachedView", this.$route).then(() => {
        const { fullPath } = this.$route;
        this.$nextTick(() => {
          this.$router.replace({
            path: "/redirect" + fullPath
          });
        });
      });
    },
    async getEchartsData1() {
      let res = await GetSearchData(
        {
          dicID: 9037,
          groupby: "Dept",
          fields: "SUM(DemandQty) as DemandQty,Dept",
          sort: "DemandQty desc"
        },
        "6E8BF76C6BA5B0D8"
      );
      const { result, data, msg } = res.data;
      if (result) {
        this.chartTotal1 = data.reduce(
          (accumulator, current) => accumulator + current.DemandQty,
          0
        );
        this.chartData1 = data.map(item => ({
          value: item.DemandQty,
          name: item.Dept
        }));
        console.log(this.chartData1, "this.chartData2[0]");
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true
        });
      }
    },
    async getEchartsData2() {
      let res = await GetSearchData(
        {
          dicID: 9062,
          sort: "OweQty",
          page: 1,
          rows: 6
        },
        "6E8BF76C6BA5B0D8"
      );
      const { result, data, msg } = res.data;
      if (result) {
        this.chartData2[0] = data.map(item => item.MaterialName.split(" ")[0]);
        this.chartData2[1] = data.map(item => item.OweQty);
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true
        });
      }
    },
    hexToRgba(hex, opacity) {
      let rgbaColor = "";
      let reg = /^#[\da-f]{6}$/i;
      if (reg.test(hex)) {
        rgbaColor = `rgba(${parseInt("0x" + hex.slice(1, 3))},${parseInt(
          "0x" + hex.slice(3, 5)
        )},${parseInt("0x" + hex.slice(5, 7))},${opacity})`;
      }
      return rgbaColor;
    }
  }
};
</script>
<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
.el-container {
}
.el-main {
  padding: 16px;
  height: calc(100vh - 80px);

  .firstNode {
    display: flex;
    justify-content: space-between;
    height: 100%;
    .leftCard {
      width: 66%;
      margin-right: 10px;
      display: flex;
      flex-direction: column;
      .headCard {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
        .box {
          display: flex;
          // width: calc(25% - 16px);
          width: 25%;
          height: 100px;
          // border: 1px solid #d5d6ff;
          box-shadow: 1px 1px 10px rgba(122, 125, 255, 0.1);
          border-radius: 4px;
          margin-right: 10px;

          .icon {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 40%;
            img {
              width: 56px;
              height: 56px;
            }
          }
          .textBox {
            width: 60%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 16px 0px 22px 0px;
            .textHead {
              display: flex;
              justify-content: space-between;
              align-items: center;
              .title {
                font-weight: 400;
                font-size: 12px;
                line-height: 12px;
                color: #ffffff;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
              .content {
                display: flex;
                align-items: center;
                img {
                  width: 22px;
                  height: 22px;
                  margin-right: 10px;
                }
                .changeNum {
                  font-weight: 400;
                  font-size: 10px;
                  color: #ff878a;
                }
                .loss {
                  color: #a4ffbd;
                }
              }
            }
            .statusNum {
              // text-align: center;
              font-size: 26px;
              font-weight: 400;
              color: #ffffff;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
        }
        .box:last-child {
          margin-right: 0px;
        }
        .blue {
          background: linear-gradient(276.93deg, #148bbe 2.4%, #26d57b 98.41%);
        }
        .green {
          background: linear-gradient(97.22deg, #63a4f1 0%, #5f55d8 100%);
        }
        .purple {
          background: linear-gradient(96.96deg, #9462fe 2.34%, #c4319b 100%);
        }
        .red {
          background: linear-gradient(276.92deg, #e43167 2.93%, #fa68b7 100%);
        }
      }
      .secondCard {
        width: 100%;
        height: 335px;
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
        .itemCard1 {
          height: 335px;
          width: 50%;
          border-radius: 4px;
          background: #ffffff;
          display: flex;
          flex-direction: column;
          margin-right: 10px;
        }
        .itemCard2 {
          width: 50%;
          height: 335px;
          display: flex;
          justify-content: space-between;
          .itemCard {
            height: 335px;
            border-radius: 4px;
            width: 50%;
            background: #ffffff;
            display: flex;
            flex-direction: column;
          }
          .itemCard:nth-child(1) {
            margin-right: 10px;
          }
        }
      }
      .thirdCard {
        flex-grow: 1;
        display: flex;
        .itemCard {
          height: 100%;
          border-radius: 4px;
          background: #ffffff;
          display: flex;
          flex-direction: column;
          width: 100%;
        }
        .itemCard:nth-child(1) {
          margin-right: 10px;
        }
      }
    }
    .rightCard {
      height: 100%;
      width: 34%;
      display: flex;
      flex-direction: column;
      .firstCard {
        height: 29%;
        margin-bottom: 10px;
        .itemCard {
          height: 100%;
          border-radius: 4px;
          background: #ffffff;
          display: flex;
          flex-direction: column;
          width: 100%;
        }
      }
      .secondCard {
        height: 40%;
        margin-bottom: 10px;
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
        height: 40%;
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
    height: 60px;
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
    content: ""; /* 伪元素的内容为空 */
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
    flex: 1;
    padding: 10px;
    width: 100%;
    height: 100%;
  }
  .box:hover,
  .itemCard:hover {
    box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.2);
  }
  .container {
    padding: 0;
  }
}
</style>
