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
                  {{ tableData[0][0]['Prop'] }}
                </div>
                <div class="textHead">
                  <div class="title">{{ headCard[0]['title'] }}</div>
                </div>
              </div>
            </div>
            <div class="box green">
              <div class="icon">
                <img :src="headCard[1]['icon']" />
              </div>
              <div class="textBox">
                <div class="statusNum">
                  {{ tableData[0][1]['Prop'] }}
                </div>
                <div class="textHead">
                  <div class="title">{{ headCard[1]['title'] }}</div>
                </div>
              </div>
            </div>
            <div class="box purple">
              <div class="icon">
                <img :src="headCard[2]['icon']" />
              </div>
              <div class="textBox">
                <div class="statusNum">{{ tableData[0][2]['Prop'] }}</div>
                <div class="textHead">
                  <div class="title">{{ headCard[2]['title'] }}</div>
                </div>
              </div>
            </div>
            <div class="box red">
              <div class="icon">
                <img :src="headCard[3]['icon']" />
              </div>
              <div class="textBox">
                <div class="statusNum">{{ tableData[0][3]['Prop'] }}</div>
                <div class="textHead">
                  <div class="title">{{ headCard[3]['title'] }}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="secondCard">
            <div class="itemCard1">
              <div class="echartHead">
                <div class="echartTitle">{{ result1[1]['label'] }}</div>
              </div>
              <div class="echartBody" ref="chart1"></div>
            </div>
            <div class="itemCard2">
              <div class="itemCard">
                <div class="echartHead">
                  <div class="echartTitle">{{ result1[2]['label'] }}</div>
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
                <div class="echartBody" ref="chart2"></div>
              </div>
              <div class="itemCard">
                <div class="echartHead">
                  <div class="echartTitle">{{ result1[3]['label'] }}</div>
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
                <div class="echartBody" ref="chart3"></div>
              </div>
            </div>
          </div>
          <div class="thirdCard">
            <div class="itemCard">
              <div class="echartHead">
                <div class="echartTitle">{{ result1[4]['label'] }}</div>
              </div>
              <div class="echartBody">
                <ComReportTable
                  :isToolbar="false"
                  :showFooter="true"
                  :isShowFooter="false"
                  :isFooterRemark="false"
                  :includeFields="[
                    'Qty',
                    'ReportQty',
                    'OutStockQty',
                    'StockQtyDiff',
                  ]"
                  ref="PurchaseRequisition"
                  :isEdit="false"
                  :remark="4"
                  :IsIndex="false"
                  :height="'100%'"
                  :row-key="'RowNumber'"
                  :sysID="sysID[4]['ID']"
                  :table-data="tableData[4]"
                  :table-header="tableColumns[4]"
                  :table-loading="tableLoading[4]"
                  :pagination="tablePagination[4]"
                  @pageChange="pageChange"
                  @pageSize="pageSize"
                  @sortChange="sortChange"
                >
                </ComReportTable>
              </div>
            </div>
            <div class="itemCard">
              <div class="echartHead">
                <div class="echartTitle">{{ result1[5]['label'] }}</div>
              </div>
              <div class="echartBody">
                <ComReportTable
                  :isToolbar="false"
                  :showFooter="false"
                  :isShowFooter="false"
                  ref="PurchaseRequisition"
                  :isEdit="false"
                  :remark="5"
                  :IsIndex="false"
                  :height="'100%'"
                  :row-key="'RowNumber'"
                  :sysID="sysID[5]['ID']"
                  :table-data="tableData[5]"
                  :table-header="tableColumns[5]"
                  :table-loading="tableLoading[5]"
                  :pagination="tablePagination[5]"
                  @pageChange="pageChange"
                  @pageSize="pageSize"
                  @sortChange="sortChange"
                  :cellStyle="cellStyle7"
                >
                </ComReportTable>
              </div>
            </div>
          </div>
        </div>
        <div class="rightCard">
          <div class="firstCard">
            <div class="itemCard">
              <div class="echartHead">
                <div class="echartTitle">{{ result1[6]['label'] }}</div>
              </div>
              <div class="echartBody">
                <div class="xnode">
                  <div class="triangle">产品缺失工艺</div>
                  <div></div>
                  <div>{{ tableData[9][0]['C1'] }}</div>
                </div>
                <div class="xnode">
                  <div class="triangle">工艺缺失</div>
                  <div></div>
                  <div>{{ tableData[9][0]['C1'] }}</div>
                </div>
                <div class="xnode">
                  <div class="triangle">产能缺失</div>
                  <div></div>
                  <div>{{ tableData[10][0]['C1'] }}</div>
                </div>
                <div class="xnode">
                  <div class="triangle">排班未配置</div>
                  <div></div>
                  <div>{{ tableData[11][0]['C1'] }}</div>
                </div>
                <div class="xnode">
                  <div class="triangle">库存预警</div>
                  <div></div>
                  <div>{{ tableData[12][0]['C1'] }}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="secondCard">
            <div class="itemCard">
              <div class="echartHead">
                <div class="echartTitle">{{ result1[7]['label'] }}</div>
                <!-- <el-button-group>
                  <el-button
                    :class="{
                      select: selected1Index === 0,
                    }"
                    size="small"
                    @click="handleConsumeBtnClick(0)"
                  >
                    预计消耗
                  </el-button>
                  <el-button
                    :class="{
                      select: selected1Index === 1,
                    }"
                    size="small"
                    @click="handleConsumeBtnClick(1)"
                  >
                    预计超额
                  </el-button>
                </el-button-group> -->
              </div>
              <div class="echartBody" ref="chart4"></div>
            </div>
          </div>
          <div class="thirdCard">
            <div class="itemCard">
              <div class="echartHead">
                <div class="echartTitle">{{ result1[8]['label'] }}</div>
              </div>
              <div class="echartBody" ref="chart5"></div>
            </div>
          </div>
        </div>
      </div>
      <!-- <div class="listCard">
        <div class="APSContainer" v-loading="adminLoading">
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
import ComSearch from '@/components/ComSearch';
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
  name: 'index2',
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
          statusNum: '3,841',
          changeNum: '+4500',
          iconStatus: true,
        },
        {
          icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAYAAACohjseAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAPQSURBVHgB5Zo9bxNBEIZfHzYhOAkgJNKHPj+Anp6IFokSlBZBT4tEiUQbQYmUlEj08C/og8SHFDvEdhwzr2832du7OHe7c/7ikcZnTXzRvTezs58NKDMajRpyaTnWFEvErnk/HRo7E+uLDRqNRh/KNKCAEbUi1kYqKvT/jsR6Yici9i8UiBJohK0hFabyshwYXUb0SMQOEUjQQ9UsrIiO2HGI0MoPJ+KYincwHWEuFHdUNXVLP6SJ2obYTcyWLlKhozI/LiVQxLECMmotzAeM5s8yKXulQCPuLvJlftaUEjlR4ByLs1wp8lKBCyDOMlFkUuQ0BWURxJFxfTDPnCO55KYNLIY4C4vfetEfcgLlTaxi9l1BCG3TR2fICDTtbh2Lyy0/Vf0IMnKLlJo+fPa262jaLyZ6awhjR+yR2CZ0OBT7IvYR1WGqdu1I5zyc4rwtl1VU54mxOngvdoDqcCjHAXomRa8jjAeojx2E0bZtcZyipnKGtj03578hfeuhsIk8E9tGHAwcA9azbTAkNYv4gLT9hMJ72e7eIB6+rJ5N0dD09OkinpgX5NJkmibyQXHTnrxOAwavNf7A8tKkwBXoodEPavWlpMUio5meL8TeIhxW5OfQYyxQc2jGt69RAbVIilacl4lrCZacJnR5hbQfYyf7zvO56Vvk20Xaj6qmubbAQ8d8X9Hv2p6v6/miaUhHfw9x7XAPF6WdD9gx332fXeqv4qPopwhnyAiWWiEuSRv5CMT4YjllkdHck2MUbKpp+GI5YwRPocdLse9I0+yT52PK7k3wPTZX1xdLnwIH0IPCNpFd+rC+zSt8W7ioolqcssgwTVloQodsbpHRJqbInMmyxWEiH9wj14zivMCt8PN+kKmhMellu7LdxHYJH1N1a4IvhoxAVlJ2F7Ezi9e46NQ/ez63eBT5ds1Vo8gM7U7wWCDTVNoi317sqjYj5I9QrM9tp/eRLzLbzt9i6dkv7rpoaLGps8gwbXdRnR92O+18NmGKTQfV2Ud9fEV1MsdO/MH2MdJGXiWKB+aeh9Bdut9H9VVtCsucwsgJkVS9gfTAwSLyxz9mkpvwyg9OoDsenBadojM0l83o2RY1x6h1w9QsrB+FAk3B+WVunHfsIYTCad//e4zEstQHgSxzKJKTg98qR7ksZqTjrpfMChaTjuphPBezWcox67SjSUGMWq/KTaEHYinOCq0bCmPUumWj5hJ7pNmezOAOlXZEo4RZ1HaWTOpymLcS8X8phHNTjqT6McIstezsml1jbqza3WNG1x/Yc6REAQPzndeBhiiXf9lhRWO5QrhCAAAAAElFTkSuQmCC',
          title: '已汇报数量',
          statusNum: '2,840',
          changeNum: '-4500',
          iconStatus: false,
        },
        {
          icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAYAAACohjseAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAQOSURBVHgB5Zq9TxtBEMWfDYYQA0oUCVKHOqQmPT30SGnTI+WPiJSe1KGHPj2pQ2roIcqHhJ2AjXHm3e2i5Xz23c7u2Tj8pPHXnU/3bmZnd2e3hsj0+/2avDUcmxWri81kTu0ZuxHriHVrtVoHkakhAkbUvFgTqSjtdftiV2KXIvYvIhAk0AhbRCosysNyoHfp0QsR24MS1U1VLCyPltgfjVDvmxNxDMWnGI8wF4q78A3d0jdpvLYs9hiTpY1UaL/MyaUEijhmQHqtgfsBvfmjTMgWCjTinmEwzU+aUiJHCrzH4iyFIocKnAJxlpEi63k/moQyDeJIkh/MPQ9QH/KnZUyHOAuT31LegQGB8iQWMPmuQEPT9NF3uOPWyO2Oo5w1sQ2xdbHn5jfCvuzE2LHYF8SB7fC720dmBdLNiwiDIraNNUv+50zss7EzhMFBQMt+uRVovLeCMChqB+WFZaG4faRCtXD6dW696Ap8Im8L0PNWbAtxOBTbg55bL7pJZg56dhFPHMy1dqGnabuNRKDJnNrEQs9tIj6b5toaqGvOfiDa0ORNxPRcli3or58kSytQE56rSBNK1WiT1izDtC4vFKeZvNJ7q6geemIb/tB5jeQFOmK2O3YL7RHHGaYqL1LgPPx5jXjeY7/3QezdiHPoxTX4k3hQE57riMO+MbJRcG7R8TwaeQXZMrxAOK64HRQnrFfwp64VqAkXF19xRDOMnKlDR5kGPyxpaMQR1SRAK7AICngjdprzu0acGq3AdsHxI6TVaGZGKzJUXAsKKFBT9y+as71HmoisSHYDoZ47hT89CixVIc5wXHCc7cUVaed3IWF5An+uKVCzJndU4hxXJAltc9/gzw0XJ6/hD8OF7bAom1qRrLmEDO3YJMo81CwderALfxh2ByXPpcjQcau2hJGEKD2oaYcsKxRl0xjYgpQvN1wSr8sLizRaL35C9TD7aiptXAq/7Qe1njg0VhVsBtrwvCOQmVQTpmQPYWW+YfCaH6GjZ1eCE4EmTFUjBQM78piePDDX1HJlP7h1UYpdQdjaO7Ml+zrtZJhNhe069GGd2+W0bOmeKX0JYVDcJvxqNhR2YCw0M+eX7kkkL7qwtPES6fyR5i6+MDN+RToIOEGcLmdgMXRAiIh8hHTDwTTyO7vNZGC6JCdcYjwdeGxaeXtohs0HGcOaMeqkYEjm9gK5Ak238RO6ueK4se0utx9/uNtILP/1RiDLPRTJycGvKFu5LKaPtFsoJwmTSSvqZjwXs1jK0c64vUlB9NqVz5+0G2IpzgqtGgqj19plveYSuqWZQhm2XKGK7dEgYZZou3ZN6HKYNx9wXQrh3JQjqU6IMEsl25LNqjEXVu3qMb07mznN1oK65jPfuzFEufwD3aFHrIhsWHoAAAAASUVORK5CYII=',
          title: '已出库数量',
          statusNum: '45.21%',
          changeNum: '+4500',
          iconStatus: true,
        },
        {
          icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAYAAACohjseAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAARrSURBVHgB5Zo9UBNBFMf/CQmIBPyaIdbY02tPD31mbBlbHUtnoHSkdYZae+zptccaa3FGZYYETEKI+8/tJsdlL7f3dvOlv5nHHbnL5f739t57+1FAYLrdbkFtyjErKSsqW0ic2tF2o6ylrF0oFFoITAEB0KKWlK0gEiW9bldZU9kfJfYKAfASqIVVEAkL8rBi0Lv06IUS24EQ0U2NWZiNurJLidDcN6fEsSk+wGSExaG4i7xN1/kmtdfWlN3FdGkgEtp1OdlJoBLHCEivlTEb0Js/XZpspkAt7hGGw/y0cRI5UuAMizNkikwVOAfiDCNFFm0f6oAyD+JILz7oex6imPKlNcyHOAOD36rtwJBA9SSWMf1UIGFF5+hb3BKo37tVzC/3kk21lDiBngvdNKvKNvW2qj87U3aqt98QDt47y8e6+aAvUHuvgjDwR3a0rWScS5HH2s4Q4LeVloapdPruVB/eV5tl+FODmzAbH7X5wlKu58W4wHX4NU82vzfKnsAPevE1/LzJTvQPerEXZHTk9BX3Fv7i4teqQg51LZod4tM0Q9zQOK7ZiydG4CLkhBZnME1eSokpY0H9oThpYmdAeTbiON+jr4geYCXl+CGipm07/lBvT5AfxpcmPSjt4/EJ10YcZxR7oWxP2UHKOfsYpIg0tiGLyKREgUuQsZVxvKGN2CIi0wGTfTXjWvTsDmSUKVA6tpIl0Hj4qbLdxLEjDPKdyzu8DRllVjKS9LABt8Bia8L02qHe33W8TkWflzc3Fm0jzi48hgze4L7ep/g8ntlEfhaKkLGB/PB9NBUKm20t5/dFqUgqUPJjHxCJ43d38399sgLzwoDyCVG4H1dhYIUCJeP+eV72LxhEzFeQi5MU3x0KdBohFv4Yz3un903KkCLpGF9ToGROzqV0Mt0eBhcm6mRQYfVyCPeH9R35uWEevEZ+eFO88VEl1AEGQSUp7jMG5RvPySqqpUMbLXqwDRlHI47xnaOXTbcn+SDihbVLnXkMGb0mSg9K3kNGxQZG3xA9YwsqTNovETVdl5QhEXjDKfFeHaq6TBzFlvQJa7AnbDYn9iYk1UcS6TjNlRJ4bgTeQTQ9JuE9ZJWNC3z3nkPGOSdLTaJnJJU0U7KHMMN9SUwUltAxM8E9geofjkLVISPEKFjoazbNTrxUu4TciyFFnga4Vt9Ztzq76l1k+Padm0gLPFkwIsc7wlL6g74kKZAeXYf/CgozDLGF7NrTCDtCetpxZWgydEiIZ0S1wREzioyPApxpO0HYd/c8uczE6iklkhOg0pGsaVFX4i6SH6b1B9mGJTXqtGCTtGYBq0CdNn5B1lecNOa9s2aA/3cZieGfXghkmEGR7OL9DrKUy6BzpFlCOU0YTOpBF+PF0ZOlrHYm7U0Koteaeb4kXRBLcUbouKEweq3h6rU4vkuazcoMzlCF9qiXMEOwVbu66bLMW4LfonT2TVmTtnyEGcayLFnPGnNidVH/Br2bXHRkxoLaep/bdghRcf4CDSBerRoxXgcAAAAASUVORK5CYII=',
          title: '现有库存数量',
          statusNum: '34.24%',
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
        [{ Prop: null }, { Prop: null }, { Prop: null }, { Prop: null }],
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
      isClear: [false, false, false, false, false, false, false, false],
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
          datas: {
            OweQty: 0,
          },
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
      result1: [
        { label: null, fields: null, groupby: null },
        { label: null, fields: null, groupby: null },
        { label: null, fields: null, groupby: null },
        { label: null, fields: null, groupby: null },
        { label: null, fields: null, groupby: null },
        { label: null, fields: null, groupby: null },
        { label: null, fields: null, groupby: null },
        { label: null, fields: null, groupby: null },
        { label: null, fields: null, groupby: null },
      ],
      sysID: [
        { ID: 7917 },
        { ID: 5170 },
        { ID: 5170 },
        { ID: 5170 },
        { ID: 7918 },
        { ID: 7919 },
        { ID: 5170 },
        { ID: 5170 },
        { ID: 5170 },
      ],
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
    this.chart = [
      this.$refs.chart1,
      this.$refs.chart2,
      this.$refs.chart3,
      this.$refs.chart4,
      this.$refs.chart5,
    ];
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
          grid: {
            containLabel: true,
            bottom: 0,
            left: fontSize(10),
            right: fontSize(10),
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow',
            },
          },
          legend: {
            top: '0',
            data: ['计划数', '完成数'],
            itemWidth: fontSize(14),
            itemHeight: fontSize(14),
          },
          xAxis: {
            // name: "班级",
            triggerEvent: true,
            data: this.tableData[1].map((item) => item['Name1']),
            axisLabel: {
              interval: 1,
              show: true,
              textStyle: {
                color: '#000',
              },
            },
            axisLine: {
              lineStyle: {
                show: false,
                color: '#F3F3F3',
                width: 2,
              },
            },
          },
          yAxis: [
            {
              name: '单位:万',
              type: 'value',
              nameTextStyle: {
                color: '#444444',
              },
              axisLabel: {
                interval: 0,
                show: true,
                textStyle: {
                  color: '#444444',
                },
              },
              axisLine: {
                show: false,
                // lineStyle: {
                //   color: "#F3F3F3",
                //   width: 2
                // }
              },
              axisTick: {
                show: false,
              },
              splitLine: {
                lineStyle: {
                  type: 'dashed',
                  color: '#E9E9E9',
                },
              },
            },
          ],
          series: [
            {
              name: '计划数',
              type: 'bar',
              silent: true,
              itemStyle: {
                normal: {
                  color: '#578FFB',
                },
              },
              data: this.tableData[1].map((item) => item['S1']),
            },
            {
              name: '完成数',
              type: 'bar',
              silent: true,
              itemStyle: {
                normal: {
                  color: '#23CF9C',
                },
              },
              data: this.tableData[1].map((item) => item['S2']),
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
            data: this.tableData[2].map((item) => item['Name1']),
          },
          grid: {
            containLabel: true,
          },
          series: [
            {
              type: 'pie',
              selectedMode: 'single',
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
                position: 'inner',
                formatter: '{d}%',
                show: true,
                color: '#fff',
                textBorderColor: 'inherit',
                textBorderWidth: 1,
                fontSize: fontSize(12),
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
              labelLine: {
                normal: {
                  show: false,
                },
              },
              data: this.tableData[2].map((item) => {
                return {
                  value: item['S1'],
                  name: item['Name1'],
                };
              }),
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
            data: this.tableData[3].map((item) => item['Name1']),
          },
          grid: {
            containLabel: true,
          },
          series: [
            {
              type: 'pie',
              selectedMode: 'single',
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
                position: 'inner',
                formatter: '{d}%',
                show: true,
                color: '#fff',
                textBorderColor: 'inherit',
                textBorderWidth: 1,
                fontSize: fontSize(12),
                formatter: function (params) {
                  // let percent = 0;
                  // let total = 0;
                  // for (var i = 0; i < this.tableData[3].length; i++) {
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
              labelLine: {
                normal: {
                  show: false,
                },
              },
              data: this.tableData[3].map((item) => {
                return {
                  value: item['S1'],
                  name: item['Name1'],
                };
              }),
            },
          ],
        },
        {
          grid: {
            containLabel: true,
            bottom: 0,
            left: fontSize(10),
            right: fontSize(10),
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow',
            },
          },
          legend: {
            top: '0',
            data: ['计划数', '完成数'],
            itemWidth: fontSize(14),
            itemHeight: fontSize(14),
          },
          xAxis: {
            // name: "班级",
            triggerEvent: true,
            data: this.tableData[7].map((item) => item['Name1']),
            axisLabel: {
              interval: 0,
              show: true,
              textStyle: {
                color: '#000',
              },
            },
            axisLine: {
              lineStyle: {
                show: false,
                color: '#F3F3F3',
                width: 2,
              },
            },
          },
          yAxis: [
            {
              name: '单位:万',
              type: 'value',
              nameTextStyle: {
                color: '#444444',
              },
              axisLabel: {
                interval: 0,
                show: true,
                textStyle: {
                  color: '#444444',
                },
              },
              axisLine: {
                show: false,
                // lineStyle: {
                //   color: "#F3F3F3",
                //   width: 2
                // }
              },
              axisTick: {
                show: false,
              },
              splitLine: {
                lineStyle: {
                  type: 'dashed',
                  color: '#E9E9E9',
                },
              },
            },
          ],
          series: [
            {
              name: '计划数',
              type: 'bar',
              silent: true,
              barWidth: fontSize(14),
              itemStyle: {
                normal: {
                  color: '#578FFB',
                },
              },
              data: this.tableData[7].map((item) => item['S1']),
            },
            {
              name: '完成数',
              type: 'bar',
              silent: true,
              barWidth: fontSize(14),
              itemStyle: {
                normal: {
                  color: '#23CF9C',
                },
              },
              data: this.tableData[7].map((item) => item['S2']),
            },
          ],
        },
        {
          backgroundColor: '#fff',
          color: [
            '#0090FF',
            '#36CE9E',
            '#FFC005',
            '#FF515A',
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
              name: '计划数',
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
                        color: '#0090FF30',
                      },
                      {
                        offset: 1,
                        color: '#0090FF10',
                      },
                    ],
                    false,
                  ),
                  shadowColor: '#0090FF10',
                  shadowBlur: 10,
                },
              },
              data: [100, 138, 350, 173, 180, 150, 180, 230],
            },
            {
              name: '生产数',
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
                        color: '#36CE9E30',
                      },
                      {
                        offset: 1,
                        color: '#36CE9E10',
                      },
                    ],
                    false,
                  ),
                  shadowColor: '#36CE9E10',
                  shadowBlur: 10,
                },
              },
              data: [233, 233, 200, 180, 199, 233, 210, 180],
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
      let rea = await GetSearchData({
        dicID: 7914,
        rows: 0,
        page: 1,
      });
      const { data: data1, result: result1, msg: msg1 } = rea.data;

      if (result1) {
        this.sysID = data1.map((item) => {
          return {
            ID: item.sysID,
          };
        });
        this.result1 = data1.map((item) => {
          return {
            label: item.label,
            fields: item.fields,
            groupby: item.groupby,
          };
        });
      }
      let res = await GetHeader(this.sysID);
      const { datas, forms, result, msg } = res.data;

      if (result) {
        // 获取每个表头
        datas.some((m, i) => {
          m.some((n, j) => {
            // 进行验证
            // this.verifyDta(n);
            // if (n.children && n.children.length != 0) {
            //   n.children.forEach((x) => {
            //     this.verifyDta(x);
            //   });
            // }
            // if (j === 1 && ) {
            //   this.tablePagination[i]["pageSize"] = n["pageSize"];
            // }
          });
        });
        // 获取查询的初始化字段 组件 按钮

        await Promise.all(
          forms.map(async (x, z) => {
            this.$set(this.formSearchs[z].datas, 'dicID', this.sysID[z].ID);
            if (this.result1[z].fields) {
              this.$set(
                this.formSearchs[z].datas,
                'fields',
                this.result1[z].fields,
              );
            }
            if (this.result1[z].groupby) {
              this.$set(
                this.formSearchs[z].datas,
                'groupby',
                this.result1[z].groupby,
              );
            }
            if (z === 7) {
              this.formSearchs[z].datas['PlanDay'] = this.$moment()
                .subtract(1, 'days')
                .format('YYYY-MM-DD');
              // this.formSearchs[z].datas["PlanDay"] = this.currentDate;
            }
            if (z === 5) {
              this.formSearchs[z].datas['DemandDate'] = [
                this.currentDate,
                this.$moment().add(2, 'days').format('YYYY-MM-DD'),
              ];
            }
            if (this.sysID[z].ID) {
              await this.getTableData(this.formSearchs[z].datas, z);
            }
          }),
        );
        this.adminLoading = false;
        await this.getEcharts();
      }
    },
    // 验证数据
    // verifyDta(n) {
    //   for (let name in n) {
    //     if (
    //       (name == "component" && n[name]) ||
    //       (name == "button" && n[name]) ||
    //       (name == "active" && n[name])
    //     ) {
    //       n[name] = eval("(" + n[name] + ")");
    //     }
    //   }
    // },
    // 获取表格数据
    async getTableData(form, remarkTb) {
      this.$set(this.tableLoading, remarkTb, true);
      form['rows'] = this.tablePagination[remarkTb].pageSize;
      form['page'] = this.tablePagination[remarkTb].pageIndex;
      let res = await GetSearchData(form);
      const { result, data, count, msg, Columns } = res.data;
      if (remarkTb === 0 && res.data) {
        data.map((item, index) => {
          this.headCard[index]['title'] = item['Label'];
        });

        // headCard[0]['title'] = data
      }
      if (remarkTb === 4) {
        this.tableColumns[4] = Columns[0];
      }
      if (remarkTb === 5) {
        this.tableColumns[5] = Columns[0];
      }
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
.el-container {
}
.el-main {
  padding: 16px;
  height: calc(100vh - 80px);
  overflow: hidden;

  .firstNode {
    display: flex;
    justify-content: space-between;
    height: 100%;
    .leftCard {
      width: 70%;
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
        // margin-right: 10px;
        overflow: hidden;

        .itemCard {
          height: 100%;
          // flex-grow: 1;
          border-radius: 4px;
          background: #ffffff;
          display: flex;
          flex-direction: column;
          margin-right: 10px;
          width: 50%;
          overflow: hidden;

          .echartBody {
            height: calc(100% - 60px);
            overflow: auto;
            overflow: hidden;
          }
          .echartBody::-webkit-scrollbar {
            display: none;
          }
        }
        .itemCard:nth-child(2) {
          margin-right: 0px;
          overflow: hidden;
        }
      }
    }
    .rightCard {
      width: 30%;
      display: flex;
      flex-direction: column;
      .firstCard {
        height: 30%;
        margin-bottom: 10px;
        .itemCard {
          height: 100%;
          border-radius: 4px;
          background: #ffffff;
          display: flex;
          flex-direction: column;
          width: 100%;
          .xnode {
            width: 100%;
            height: 20%;
            padding: 0 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: #444444;
            font-size: 12px;
            // .triangle
          }
          .xnode div:nth-child(1) {
            padding-left: 20px;
            width: 30%;
            position: relative;
          }
          .xnode div:nth-child(1)::before {
            content: ''; /* 伪元素的内容为空 */
            position: absolute; /* 将伪元素设置为绝对定位 */
            top: 50%;
            left: 0; /* 将伪元素向左偏移 50% */
            transform: translateY(-50%) translateX(-50%); /* 通过 transform 属性向左平移自身宽度的一半 */
            display: inline-block; /* 将伪元素设置为行内块元素 */
            width: 10px;
            height: 10px;
            background: #8598ff;
            border-radius: 50%;
          }
          .xnode:nth-child(2) div:nth-child(1)::before {
            background: #f9921a;
          }
          .xnode:nth-child(3) div:nth-child(1)::before {
            background: #43b8fa;
          }
          .xnode:nth-child(4) div:nth-child(1)::before {
            background: #fa43f2;
          }
          .xnode:nth-child(5) div:nth-child(1)::before {
            background: #2dd87b;
          }

          .xnode div:nth-child(2) {
            width: 50%;
            border: 1px dashed #c0c0c0;
          }
          .xnode div:nth-child(3) {
            width: 20%;
            text-align: right;
          }
        }
      }
      .secondCard {
        height: 35%;
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
        height: 35%;

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
</style>
