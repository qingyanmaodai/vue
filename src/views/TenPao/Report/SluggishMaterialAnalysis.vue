<!--表格-->
<template>
  <el-container>
    <el-main>
      <div class="firstNode">
        <div class="leftCard">
          <div class="headCard">
            <div class="box">
              <div class="textBox">
                <div class="headNumber">
                  <div class="leftContent">
                    <img
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAALCAYAAABLcGxfAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACbSURBVHgBzY+9DYNADIXtEwMwQhpIidggI6TharJBMkEuEyQboLT52SEbnGgD7MAAYIMQQvwcSHS8yvZ7n2UDGOTGUrlaKpOHpjADXxuT8Pb3X2oW2Gt5JsH3/oyJL6n/eUwARwchCIjAIAIKM+/77ICl8BjCnT7aFlpRDdjNBsbD4CTkX1vmRVmcJk87ccD9PvHeg4yAldogUAFK2jH2vdTmVQAAAABJRU5ErkJggg=="
                    />
                    <div class="changeNum">
                      {{ headCard[0]["changeNum"] }}
                    </div>
                  </div>
                  <div class="statusNum">
                    {{ tableData[0][0]["S1"] }}
                  </div>
                  <div class="rightContent">
                    <img
                      v-if="parseInt(headCard[1]['changeNum']) >= 0"
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAALCAYAAABLcGxfAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACbSURBVHgBzY+9DYNADIXtEwMwQhpIidggI6TharJBMkEuEyQboLT52SEbnGgD7MAAYIMQQvwcSHS8yvZ7n2UDGOTGUrlaKpOHpjADXxuT8Pb3X2oW2Gt5JsH3/oyJL6n/eUwARwchCIjAIAIKM+/77ICl8BjCnT7aFlpRDdjNBsbD4CTkX1vmRVmcJk87ccD9PvHeg4yAldogUAFK2jH2vdTmVQAAAABJRU5ErkJggg=="
                    />
                    <img
                      v-else
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAALCAYAAABLcGxfAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACBSURBVHgBzZDvDUAwFMT7TGAkgyC1ARMwAhP4v4eRLMB5mpIWqfjmkiZ37e+a9pG4CHEMM1PXkZk98VE/LBCk9AVQs/fVDhDYBE3azewTNQFEkeRQO69eFknj2J4jc5Y0bP2B+r7h52Q3eF3TA7YKulQyUBhwQcNQiTchDPN9PZ1tJsUwo0mf0xkAAAAASUVORK5CYII="
                    />
                    <div
                      class="changeNum"
                      :class="
                        parseInt(headCard[1]['changeNum']) < 0 ? 'loss' : ''
                      "
                    >
                      {{ headCard[1]["changeNum"] }}
                    </div>
                  </div>
                </div>
                <div class="textHead">
                  <div class="title">{{ headCard[1]["title"] }}</div>
                </div>
              </div>
            </div>
            <div class="box">
              <div class="textBox">
                <div class="headNumber">
                  <div class="leftContent">
                    <img
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAALCAYAAABLcGxfAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACbSURBVHgBzY+9DYNADIXtEwMwQhpIidggI6TharJBMkEuEyQboLT52SEbnGgD7MAAYIMQQvwcSHS8yvZ7n2UDGOTGUrlaKpOHpjADXxuT8Pb3X2oW2Gt5JsH3/oyJL6n/eUwARwchCIjAIAIKM+/77ICl8BjCnT7aFlpRDdjNBsbD4CTkX1vmRVmcJk87ccD9PvHeg4yAldogUAFK2jH2vdTmVQAAAABJRU5ErkJggg=="
                    />
                    <div class="changeNum">
                      {{ headCard[0]["changeNum"] }}
                    </div>
                  </div>
                  <div class="statusNum">
                    {{ tableData[0][0]["S1"] }}
                  </div>
                  <div class="rightContent">
                    <img
                      v-if="parseInt(headCard[1]['changeNum']) >= 0"
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAALCAYAAABLcGxfAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACbSURBVHgBzY+9DYNADIXtEwMwQhpIidggI6TharJBMkEuEyQboLT52SEbnGgD7MAAYIMQQvwcSHS8yvZ7n2UDGOTGUrlaKpOHpjADXxuT8Pb3X2oW2Gt5JsH3/oyJL6n/eUwARwchCIjAIAIKM+/77ICl8BjCnT7aFlpRDdjNBsbD4CTkX1vmRVmcJk87ccD9PvHeg4yAldogUAFK2jH2vdTmVQAAAABJRU5ErkJggg=="
                    />
                    <img
                      v-else
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAALCAYAAABLcGxfAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACBSURBVHgBzZDvDUAwFMT7TGAkgyC1ARMwAhP4v4eRLMB5mpIWqfjmkiZ37e+a9pG4CHEMM1PXkZk98VE/LBCk9AVQs/fVDhDYBE3azewTNQFEkeRQO69eFknj2J4jc5Y0bP2B+r7h52Q3eF3TA7YKulQyUBhwQcNQiTchDPN9PZ1tJsUwo0mf0xkAAAAASUVORK5CYII="
                    />
                    <div
                      class="changeNum"
                      :class="
                        parseInt(headCard[1]['changeNum']) < 0 ? 'loss' : ''
                      "
                    >
                      {{ headCard[1]["changeNum"] }}
                    </div>
                  </div>
                </div>
                <div class="textHead">
                  <div class="title">{{ headCard[1]["title"] }}</div>
                </div>
              </div>
            </div>
            <div class="box">
              <div class="textBox">
                <div class="headNumber">
                  <div class="leftContent">
                    <img
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAALCAYAAABLcGxfAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACbSURBVHgBzY+9DYNADIXtEwMwQhpIidggI6TharJBMkEuEyQboLT52SEbnGgD7MAAYIMQQvwcSHS8yvZ7n2UDGOTGUrlaKpOHpjADXxuT8Pb3X2oW2Gt5JsH3/oyJL6n/eUwARwchCIjAIAIKM+/77ICl8BjCnT7aFlpRDdjNBsbD4CTkX1vmRVmcJk87ccD9PvHeg4yAldogUAFK2jH2vdTmVQAAAABJRU5ErkJggg=="
                    />
                    <div class="changeNum">
                      {{ headCard[0]["changeNum"] }}
                    </div>
                  </div>
                  <div class="statusNum">
                    {{ tableData[0][0]["S1"] }}
                  </div>
                  <div class="rightContent">
                    <img
                      v-if="parseInt(headCard[1]['changeNum']) >= 0"
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAALCAYAAABLcGxfAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACbSURBVHgBzY+9DYNADIXtEwMwQhpIidggI6TharJBMkEuEyQboLT52SEbnGgD7MAAYIMQQvwcSHS8yvZ7n2UDGOTGUrlaKpOHpjADXxuT8Pb3X2oW2Gt5JsH3/oyJL6n/eUwARwchCIjAIAIKM+/77ICl8BjCnT7aFlpRDdjNBsbD4CTkX1vmRVmcJk87ccD9PvHeg4yAldogUAFK2jH2vdTmVQAAAABJRU5ErkJggg=="
                    />
                    <img
                      v-else
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAALCAYAAABLcGxfAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACBSURBVHgBzZDvDUAwFMT7TGAkgyC1ARMwAhP4v4eRLMB5mpIWqfjmkiZ37e+a9pG4CHEMM1PXkZk98VE/LBCk9AVQs/fVDhDYBE3azewTNQFEkeRQO69eFknj2J4jc5Y0bP2B+r7h52Q3eF3TA7YKulQyUBhwQcNQiTchDPN9PZ1tJsUwo0mf0xkAAAAASUVORK5CYII="
                    />
                    <div
                      class="changeNum"
                      :class="
                        parseInt(headCard[1]['changeNum']) < 0 ? 'loss' : ''
                      "
                    >
                      {{ headCard[1]["changeNum"] }}
                    </div>
                  </div>
                </div>
                <div class="textHead">
                  <div class="title">{{ headCard[1]["title"] }}</div>
                </div>
              </div>
            </div>
            <div class="box">
              <div class="textBox">
                <div class="headNumber">
                  <div class="leftContent">
                    <img
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAALCAYAAABLcGxfAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACbSURBVHgBzY+9DYNADIXtEwMwQhpIidggI6TharJBMkEuEyQboLT52SEbnGgD7MAAYIMQQvwcSHS8yvZ7n2UDGOTGUrlaKpOHpjADXxuT8Pb3X2oW2Gt5JsH3/oyJL6n/eUwARwchCIjAIAIKM+/77ICl8BjCnT7aFlpRDdjNBsbD4CTkX1vmRVmcJk87ccD9PvHeg4yAldogUAFK2jH2vdTmVQAAAABJRU5ErkJggg=="
                    />
                    <div class="changeNum">
                      {{ headCard[0]["changeNum"] }}
                    </div>
                  </div>
                  <div class="statusNum">
                    {{ tableData[0][0]["S1"] }}
                  </div>
                  <div class="rightContent">
                    <img
                      v-if="parseInt(headCard[1]['changeNum']) >= 0"
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAALCAYAAABLcGxfAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACbSURBVHgBzY+9DYNADIXtEwMwQhpIidggI6TharJBMkEuEyQboLT52SEbnGgD7MAAYIMQQvwcSHS8yvZ7n2UDGOTGUrlaKpOHpjADXxuT8Pb3X2oW2Gt5JsH3/oyJL6n/eUwARwchCIjAIAIKM+/77ICl8BjCnT7aFlpRDdjNBsbD4CTkX1vmRVmcJk87ccD9PvHeg4yAldogUAFK2jH2vdTmVQAAAABJRU5ErkJggg=="
                    />
                    <img
                      v-else
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAALCAYAAABLcGxfAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACBSURBVHgBzZDvDUAwFMT7TGAkgyC1ARMwAhP4v4eRLMB5mpIWqfjmkiZ37e+a9pG4CHEMM1PXkZk98VE/LBCk9AVQs/fVDhDYBE3azewTNQFEkeRQO69eFknj2J4jc5Y0bP2B+r7h52Q3eF3TA7YKulQyUBhwQcNQiTchDPN9PZ1tJsUwo0mf0xkAAAAASUVORK5CYII="
                    />
                    <div
                      class="changeNum"
                      :class="
                        parseInt(headCard[1]['changeNum']) < 0 ? 'loss' : ''
                      "
                    >
                      {{ headCard[1]["changeNum"] }}
                    </div>
                  </div>
                </div>
                <div class="textHead">
                  <div class="title">{{ headCard[1]["title"] }}</div>
                </div>
              </div>
            </div>
            <div class="box">
              <div class="textBox">
                <div class="headNumber">
                  <div class="leftContent">
                    <img
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAALCAYAAABLcGxfAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACbSURBVHgBzY+9DYNADIXtEwMwQhpIidggI6TharJBMkEuEyQboLT52SEbnGgD7MAAYIMQQvwcSHS8yvZ7n2UDGOTGUrlaKpOHpjADXxuT8Pb3X2oW2Gt5JsH3/oyJL6n/eUwARwchCIjAIAIKM+/77ICl8BjCnT7aFlpRDdjNBsbD4CTkX1vmRVmcJk87ccD9PvHeg4yAldogUAFK2jH2vdTmVQAAAABJRU5ErkJggg=="
                    />
                    <div class="changeNum">
                      {{ headCard[0]["changeNum"] }}
                    </div>
                  </div>
                  <div class="statusNum">
                    {{ tableData[0][0]["S1"] }}
                  </div>
                  <div class="rightContent">
                    <img
                      v-if="parseInt(headCard[1]['changeNum']) >= 0"
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAALCAYAAABLcGxfAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACbSURBVHgBzY+9DYNADIXtEwMwQhpIidggI6TharJBMkEuEyQboLT52SEbnGgD7MAAYIMQQvwcSHS8yvZ7n2UDGOTGUrlaKpOHpjADXxuT8Pb3X2oW2Gt5JsH3/oyJL6n/eUwARwchCIjAIAIKM+/77ICl8BjCnT7aFlpRDdjNBsbD4CTkX1vmRVmcJk87ccD9PvHeg4yAldogUAFK2jH2vdTmVQAAAABJRU5ErkJggg=="
                    />
                    <img
                      v-else
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAALCAYAAABLcGxfAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACBSURBVHgBzZDvDUAwFMT7TGAkgyC1ARMwAhP4v4eRLMB5mpIWqfjmkiZ37e+a9pG4CHEMM1PXkZk98VE/LBCk9AVQs/fVDhDYBE3azewTNQFEkeRQO69eFknj2J4jc5Y0bP2B+r7h52Q3eF3TA7YKulQyUBhwQcNQiTchDPN9PZ1tJsUwo0mf0xkAAAAASUVORK5CYII="
                    />
                    <div
                      class="changeNum"
                      :class="
                        parseInt(headCard[1]['changeNum']) < 0 ? 'loss' : ''
                      "
                    >
                      {{ headCard[1]["changeNum"] }}
                    </div>
                  </div>
                </div>
                <div class="textHead">
                  <div class="title">{{ headCard[1]["title"] }}</div>
                </div>
              </div>
            </div>
            <div class="box">
              <div class="textBox">
                <div class="headNumber">
                  <div class="leftContent">
                    <img
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAALCAYAAABLcGxfAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACbSURBVHgBzY+9DYNADIXtEwMwQhpIidggI6TharJBMkEuEyQboLT52SEbnGgD7MAAYIMQQvwcSHS8yvZ7n2UDGOTGUrlaKpOHpjADXxuT8Pb3X2oW2Gt5JsH3/oyJL6n/eUwARwchCIjAIAIKM+/77ICl8BjCnT7aFlpRDdjNBsbD4CTkX1vmRVmcJk87ccD9PvHeg4yAldogUAFK2jH2vdTmVQAAAABJRU5ErkJggg=="
                    />
                    <div class="changeNum">
                      {{ headCard[0]["changeNum"] }}
                    </div>
                  </div>
                  <div class="statusNum">
                    {{ tableData[0][0]["S1"] }}
                  </div>
                  <div class="rightContent">
                    <img
                      v-if="parseInt(headCard[1]['changeNum']) >= 0"
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAALCAYAAABLcGxfAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACbSURBVHgBzY+9DYNADIXtEwMwQhpIidggI6TharJBMkEuEyQboLT52SEbnGgD7MAAYIMQQvwcSHS8yvZ7n2UDGOTGUrlaKpOHpjADXxuT8Pb3X2oW2Gt5JsH3/oyJL6n/eUwARwchCIjAIAIKM+/77ICl8BjCnT7aFlpRDdjNBsbD4CTkX1vmRVmcJk87ccD9PvHeg4yAldogUAFK2jH2vdTmVQAAAABJRU5ErkJggg=="
                    />
                    <img
                      v-else
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAALCAYAAABLcGxfAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACBSURBVHgBzZDvDUAwFMT7TGAkgyC1ARMwAhP4v4eRLMB5mpIWqfjmkiZ37e+a9pG4CHEMM1PXkZk98VE/LBCk9AVQs/fVDhDYBE3azewTNQFEkeRQO69eFknj2J4jc5Y0bP2B+r7h52Q3eF3TA7YKulQyUBhwQcNQiTchDPN9PZ1tJsUwo0mf0xkAAAAASUVORK5CYII="
                    />
                    <div
                      class="changeNum"
                      :class="
                        parseInt(headCard[1]['changeNum']) < 0 ? 'loss' : ''
                      "
                    >
                      {{ headCard[1]["changeNum"] }}
                    </div>
                  </div>
                </div>
                <div class="textHead">
                  <div class="title">{{ headCard[1]["title"] }}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="thirdCard">
            <div class="itemCard">
              <div class="echartHead">
                <div class="echartTitle">业务要货汇总</div>
                <el-tabs
                  v-model="selectedIndex"
                  @tab-click="handleClick"
                  :stretch="true"
                >
                  <el-tab-pane label="日报表" name="0"></el-tab-pane>
                  <el-tab-pane label="月报表" name="1"></el-tab-pane>
                </el-tabs>
              </div>
              <div class="echartBody">
                <ComReportTable
                  :isToolbar="false"
                  :showFooter="false"
                  ref="PurchaseRequisition"
                  :isEdit="false"
                  :remark="6"
                  :IsIndex="false"
                  :height="'100%'"
                  :row-key="'RowNumber'"
                  :sysID="sysID[6]['ID']"
                  :table-data="tableData[6]"
                  :table-header="tableColumns[6]"
                  :table-loading="tableLoading[6]"
                  :pagination="tablePagination[6]"
                  @pageChange="pageChange"
                  @pageSize="pageSize"
                  @sortChange="sortChange"
                >
                </ComReportTable>
                <!-- <vue-seamless-scroll :data="tableData[0]" class="height: 100%;">
                  <ul class="item">
                    <li v-for="(item, index) in listData" :key="index">
                      <span class="title" v-text="item.title"></span>
                      <span class="date" v-text="item.date"></span>
                    </li>
                  </ul>
                </vue-seamless-scroll> -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
let _this;
import ComSearch from "@/components/ComSearch";
import ComVxeTable from "@/components/ComVxeTable";
import ComReportTable from "@/components/ComReportTable";
import ComReportTable2 from "@/components/ComReportTable";
import * as echarts from "echarts";
import { debounce } from "lodash";
import {
  GetHeader,
  GetSearchData,
  ExportData,
  SaveData,
  GetSearch,
} from "@/api/Common";
export default {
  name: "SluggishMaterialAnalysis",
  components: {
    ComSearch,
    ComVxeTable,
    ComReportTable,
    ComReportTable2,
  },
  data() {
    return {
      headCard: [
        {
          icon: "data:image/png;base64,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",
          title: "制造一部当日达成率",
          statusNum: "3,841",
          changeNum: "+4500",
          iconStatus: true,
        },
        {
          icon: "data:image/png;base64,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",
          title: "制造二部当日达成率",
          statusNum: "2,840",
          changeNum: "-4500",
          iconStatus: false,
        },
        {
          icon: "data:image/png;base64,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",
          title: "制造三部当日达成率",
          statusNum: "45.21%",
          changeNum: "+4500",
          iconStatus: true,
        },
        {
          icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAYAAACohjseAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAVZSURBVHgB1ZpLTxtXFMfPveNHXJGIQjeEthqrNAgpFKNk0XYTk2UTKY3aLqsmnwDWlSrgE5R8grSbblopSH0si7NoV41qlEUlSGW3scIGWxaggD2Pk3MuDDHgx/j6DpifZBjNjEf37/O45547AgxTKOCge8HNxARO+QgZ/ggBg4BgH7lRQJH+FOl81ZKYc1Gsvj8Sz4FhBBiARXkJLwsSZwViBoEE6Q2miiBylsDl9EjiezBATwKVtRL1OSnErK6oVghAsq7Iybq3mE6niqCJlsAohTUDERdjdf87HaFdC3z2f+1TERMPT0NYI2xR+kEXunXd0AJVnMWdBZAwC2cIDXhpqxZfnE6Lasj7O1PY2LU933pEd2egD1DWrPkzYVy2o0AW56O1Qi5pQx8RVmRbgf0qLiCMyJYC+11cQCeRstlJTijnQRxDhYHtJqxHf9OYm11vKpCz5XkQF0ClYOZS0plveu34iWel+j2S/RDOIZ6Ld8ffTS43njsi8LzEXSs4HrdqienGOTLWeIPry3tkbhsMs/bCg5WnHpTKPpS3UZ17e1jAB7YFH43HYPiikZpfxeOlCy4XIovBucMnq8kcrQIY5pe/HPjtidvy+hCJuzkZUx8j0PJrux5PB1Y8TDI+WPNgmN+fum3FMRWy6E9/OrD+wgcj0NrzwIqK11kUIQsGeVlDJTAsvz5xwBTo41wwbSiBnDlNJ5Z1irvKQbyFYY0sWCqHv78tZMXBlHeDD5VAIcUdMMzaRvcux8nIFJ7vz/H/AxfFLBimtNm9NcrbhuKQoV4Qu6lc33Cyp714bcVuDcxBbjoQ28tI7n5BBJQq3VuwsmMoBg+QljUlfV9kwTCrBZes0f1gjSYahtxUojDvnqmkBF2GBsAYPhXhNBK0wTBXLkuYmbSgW25dj8MbSTNlG0NPGpQnOs6G+OLjBFky/GDfeUvCrWuGyrXX2Pq+FIKZq+GtOHPVuDhFpAJvk8t9ci3e8b7Pydofjnfv0mGIVCBz+3r75RDH683JaMQxcn+XJ1qGBoTWNQMUKcmE6xDrwgvc9TZ16ep/vlp5RAS3+zEPEcHF87c/t6+/uCBYonvK21GIxGpMCsh7Bp/NbQmuSFYLXlvLHf0Owjc/7Kl45DbGFH1MtDEE7TWK9ee7WWFZK9AjPMgf/6iHFtUJFvtlNtGTUEuIrFBN3qRT6GVFwe7Frlgx7Gbcr/n6s6RedUO9mbHRxJsyTc0ZGlZPcVja9IyLY/iZlR3QQ2CO/6l50JJyCXqgrDuIEPCPp4UQqgG8P9HvWo/5BQDQZDe6NK8JFscOdoKVQHZTUqxtxVQyusl6+KJGsYUiFxweflvuxR7oWvHKZctYd/rocyWMDnf/XKfunexsM/9uOPOIuACa8FRR3vJV62GTGkiV7f3+aNCKOD6ZBz8Kl2t8nErSsmlYKquxMJ3sKWj8740mmws0MWWcLVh0aDN0omEz9IiDqykD8T6cV4RYmDi203sigsdGk8tU4vQ0bZwF6MPSWJN3aJqmKFmLsQ9HVoSbB4s7Tnyx2ZWmAtlVHeHdpcMi9D37cdfqxaC2aeof2jOMoyrEbehLTiaV43TMw/0rsrM4pmOZMDGSKpK7zkAfuSsi5MOIY0LVQSzSqsWn+yG7crbcqcdDiWO6LhXWaLNUSuDtbhtOl6rn4v3jr4l0QquA5LhM+PIrpIkVoqdK5dfSVj3xIOwrlI30VCGrBMQvL+zv79tglp6EBRhbArDrWhLvIKjtON1aloXkESXFmfW4F2EBkSzkChvODV9gBnyk3WPBYm04aeEiKCtRxWRBnvbx8tW92KoJUY28AhIzawm7Nj9QAAAAAElFTkSuQmCC",
          title: "制造四部当日达成率",
          statusNum: "34.24%",
          changeNum: "+4500",
          iconStatus: true,
        },
        {
          icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAYAAACohjseAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAQdSURBVHgB5Zs9b9NQFIbfexu+WlQsJCrE5AgQQgykCyvhFwADM2GFofyDJjNLWFiBFQa6dG76C9oObaW2ajyB1FbI/RRtY5tzbuzipGnj2E5jm0dK4m/57Tn33HvPPRWIGade19BoFJDLPYZtF+A4BQih0Sm97VKDzhl0zoSUNbpnQdy/X0PMCMSAEmVZRXrRCdplURrCwGIdp0bPmRL5/FfEQCSBSphtv6cXmwgt6iyEMFyxFRJrICShBPZVWCdsu0Iu/yWM0J4FOmtrL+iv+vlChPlhiwpR7tV1Awt0rVamzQkMlip2dipifNwMcnEggSROJ4v9UBExCTSt+SyIy3YV6IqboY+OJBFQ5LkCEyvOI4DIMwUmXpxHF5Gy00EVUNIgjuF3tKwfztxcx6jeUaCKlmkQ5yFEAaOjkx1PtR+gfq5EN3xGGmk0XooHD6b8h1oEpqbdnQW3x+3tcX8f2eqitl1KrTiG3310tGUgcmJBZT3briP9mDTSyXtWzJ0ctu1JROTIoAnA/n7g64du3UJubAwxo7lWrPDOPwuur9ejuOf+zAx+f/rU0z1yZAR36B4xPIyYObGiaoMqckZse3+WltArNln7qN6XVqFB057yRjPICPEcWcOy3vOPJ7CIrEGdP49upLO6WrzwyevFoOH69YJU2a8Bcri4iL4h5eMcdQ9FDJDt799xvLmJG69e9aPLIAs2c5YDg7uKg1oNv969w863b4gVykDIQQ/NtFIJI8Wi2mZr/nz7Fsc0YIgFMh5HUR0DJEejmZtkvdsfPigXtchdd6anERO6REK4pNM4mdph3CRGYL/4LwQayC6GVCs6WYWW57ibmEdWIeNJGs5kVyBQk7yyiqxCxuPB9nxG26FJ2e5ZSV8sLotuWuMvb8JbRUg47dDY2FC/YWjQ0Izv54/lPsM5OFD7kXAclQBWSSd3LaIeZuK7MTmJwxD5mCBcefQIY+UyQmCIu3fzvKHShuymJLJKAsvokWtPnsDa2kI/GKZnh6TmbfgTv6GtmDiOjvLi4UODN0/GoirYRGiLCaLsiWPaB9sfU95lGGS9liqMFoHKirb9BmmFYojfesyp6ZK4d4/DaxpdtUrvfqqGpvN8UMoKuWqaOn+Da2c6negoULnq4eFLpGOuyO3u2VmFQeeXkSwv67h8eQYDTkydQ1NcW7vz070QKLkiu4pjuuZk1APoQUiSu/IkPYA4JlDSST1IynEkI7pWsbsbSBzTeznlykoJQ0O83K3jYjFpcv6mvUykG+EKYrldXr362i2v7DccHbmE8mPQEko/0UqamwGIrVlE/BaNJMwjlqJ0xnVdXgovghcfw2GqAOI4VeztzUYR5hGbQD809Xqq/qWAxfLyXHMFS2+7jIvOTXfENK+ye6a5EIcoP38BijDaHz4AIv8AAAAASUVORK5CYII=",
          title: "惠州基地当日达成率",
          statusNum: "34.24%",
          changeNum: "+4500",
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
        [{ S1: "89.2%", S2: "94.2%", S3: "85.3%", S4: "92.4%" }],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [{ C1: "" }],
        [{ C1: "" }],
        [{ C1: "" }],
        [{ C1: "" }],
        [{ C1: "" }],
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
        { pageIndex: 1, pageSize: 15, pageTotal: 0 },
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
          datas: {
            fields:
              "SUM(Qty) AS S1 ,SUM(ReportQty) AS S2,SUM(OutStockQty) AS S3,SUM(StockQtyDiff) AS S4",
          },
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
            fields: "SUM(PlanQty) AS S1,ProcessName",
            groupby: "ProcessName",
            // PlanDay: this.currentDate,
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
          datas: {
            fields: "SUM(PlanQty) AS S1,SUM(HasQty) as S2,ProcessName",
            groupby: "ProcessName",
          },
          forms: [],
        },
        {
          datas: {
            fields:
              "ProductType,InnerModel,SUM(Qty) AS Qty ,SUM(ReportQty) AS ReportQty,SUM(OutStockQty) AS OutStockQty,SUM(StockQtyDiff) AS StockQtyDiff",
            groupby: "ProductType,InnerModel",
            sort: "ProductType,InnerModel",
          },
          forms: [],
        },
        {
          datas: {
            fields: "DemandDate,LineName,ProductName,MaterialName,Code,OweQty",
            OweQty: 0,
            sort: "DemandDate desc",
          },
          forms: [],
        },
        {
          datas: {
            fields: "COUNT(*) AS C1",
          },
          forms: [],
        },
        {
          datas: {
            fields: "COUNT(*) AS C1",
          },
          forms: [],
        },
        {
          datas: {
            fields: "COUNT(*) AS C1",
          },
          forms: [],
        },
        {
          datas: {
            fields: "COUNT(*) AS C1",
            ConfigInfo: "未配置",
          },
          forms: [],
        },
        {
          datas: {
            fields: "SUM(CASE WHEN E2<0 THEN 1 ELSE 0 END) as C1",
          },
          forms: [],
        },
      ],
      sysID: [
        {
          ID: 10108,
        },
        { ID: 5170 },
        { ID: 5170 },
        { ID: 5170 },
        { ID: 7804 },
        { ID: 5170 },
        { ID: 10108 },
        { ID: 5157 },
        { ID: 7844 },
        { ID: 7920 },
        { ID: 7776 },
        { ID: 7922 },
        { ID: 7804 },
      ],
      currentDate: "",
      //echart部分
      // chartData1: [],
      // chartData2: [[], []],
      chart: [],
      chartOptions: [],
      handleWindowResizeDebounced: null,
      selectedIndex: 0,
    };
  },
  watch: {},
  created() {
    _this = this;
    let routeBtn = this.$route;
    // 获取所有按钮
    this.btnForm = this.$route.meta.btns;
    this.judgeBtn(this.btnForm);
    this.currentDate = this.$moment().format("YYYY-MM-DD");
    // this.getTableHeader();
  },
  activated() {},
  async mounted() {
    // var style = window.getComputedStyle("echartBody");
    // console.log(style, "style");
    // await this.getEchartsData1();
    // await this.getEchartsData2();
    // await this.getEchartsData3();
    // await this.getEchartsData4();
    //初始化图表;
    this.chart = [null, null, null, this.$refs.chart4, this.$refs.chart5];
    this.getEcharts();

    // 在窗口大小变化时，调用 resize 方法重新渲染图表
    this.handleWindowResizeDebounced = debounce(this.handleWindowResize, 200); //设置防抖
    window.addEventListener("resize", this.handleWindowResizeDebounced);
  },
  methods: {
    judgeBtn(routeBtn) {
      if (routeBtn && routeBtn.length > 0)
        routeBtn.some((item, index) => {
          if (item.ButtonCode == "save") {
            this.$set(this, "isEdit", true);
          }
        });
      this.$set(this, "btnForm", routeBtn);
    },
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
          grid: {
            containLabel: true,
            bottom: 0,
            left: fontSize(10),
            right: fontSize(10),
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "shadow",
            },
          },
          legend: {
            top: "0",
            data: ["计划数", "完成数"],
            itemWidth: fontSize(14),
            itemHeight: fontSize(14),
          },
          xAxis: {
            // name: "班级",
            triggerEvent: true,
            data: this.tableData[1].map((item) => item["PlanDay"]),
            axisLabel: {
              interval: 1,
              show: true,
              textStyle: {
                color: "#000",
              },
            },
            axisLine: {
              lineStyle: {
                show: false,
                color: "#F3F3F3",
                width: 2,
              },
            },
          },
          yAxis: [
            {
              name: "单位:万",
              type: "value",
              nameTextStyle: {
                color: "#444444",
              },
              axisLabel: {
                interval: 0,
                show: true,
                textStyle: {
                  color: "#444444",
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
                  type: "dashed",
                  color: "#E9E9E9",
                },
              },
            },
          ],
          series: [
            {
              name: "计划数",
              type: "bar",
              silent: true,
              itemStyle: {
                normal: {
                  color: "#578FFB",
                },
              },
              data: this.tableData[1].map((item) => item["S1"]),
            },
            {
              name: "完成数",
              type: "bar",
              silent: true,
              itemStyle: {
                normal: {
                  color: "#23CF9C",
                },
              },
              data: this.tableData[1].map((item) => item["S2"]),
            },
          ],
        },
        {
          backgroundColor: "#fff",
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
          // tooltip: {
          //   show: false,
          //   trigger: "item",
          //   formatter: "{b}: {c} ({d}%)"
          // },
          legend: {
            type: "scroll",
            orient: "vertical",
            right: "0%",
            top: "center",
            itemWidth: fontSize(10),
            itemHeight: fontSize(10),
            textStyle: {
              fontSize: fontSize(12),
            },
            itemStyle: {
              borderRadius: "50%", // 将图例项的形状设定为圆形
            },
            data: this.tableData[2].map((item) => item["ProcessName"]),
          },
          grid: {
            containLabel: true,
          },
          series: [
            {
              type: "pie",
              // selectedMode: "single",
              radius: ["30%", "60%"],
              color: [
                "#23CF9C",
                "#578FFB",
                "#6E40F2",
                "#FF61E6",
                "#E82074",
                "#FBA806",
              ],
              center: ["30%", "50%"],
              label: {
                normal: {
                  position: "inner",
                  formatter: "{d}%",
                },
                textStyle: {
                  color: "#fff",
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
                  value: item["S1"],
                  name: item["ProcessName"],
                };
              }),
            },
          ],
        },
        {
          backgroundColor: "#fff",
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
          // tooltip: {
          //   show: false,
          //   trigger: "item",
          //   formatter: "{b}: {c} ({d}%)"
          // },
          legend: {
            type: "scroll",
            orient: "vertical",
            right: "0%",
            top: "center",
            itemWidth: fontSize(10),
            itemHeight: fontSize(10),
            textStyle: {
              fontSize: fontSize(12),
            },
            itemStyle: {
              borderRadius: "50%", // 将图例项的形状设定为圆形
            },
            data: [
              "回货周期<6天",
              "6天<回货周期<15天",
              "15天<回货周期<30天",
              "回货周期>30天",
              "灌胶老练",
              "印刷",
            ],
          },
          grid: {
            containLabel: true,
          },
          series: [
            {
              type: "pie",
              // selectedMode: "single",
              radius: ["10%", "40%"],
              color: [
                "#23CF9C",
                "#578FFB",
                "#6E40F2",
                "#FF61E6",
                "#E82074",
                "#FBA806",
              ],
              center: ["25%", "50%"],
              label: {
                normal: {
                  position: "inner",
                  formatter: "{d}%",
                  fontSize: fontSize(8),
                  color: "#fff",
                },
              },
              labelLine: {
                normal: {
                  show: false,
                },
              },
              data: [
                {
                  value: 3661,
                  name: "回货周期<6天",
                },
                {
                  value: 5713,
                  name: "6天<回货周期<15天",
                },
                {
                  value: 9938,
                  name: "15天<回货周期<30天",
                },
                {
                  value: 17623,
                  name: "回货周期>30天",
                },
              ],
            },
          ],
        },
        {
          // title: {
          //   text: "雷达图",
          //   top: 10,
          //   left: "center",
          //   textStyle: {
          //     fontSize: 18,
          //     fontWeight: 400,
          //   },
          // },
          backgroundColor: "#fff", // 背景色，默认无背景。
          color: ["#ff5e5e"], // 调色盘颜色列表。
          textStyle: {
            // 全局字体样式
            color: "#444444",
            fontSize: fontSize(14),
          },
          // legend: {
          //   bottom: 0,
          //   left: "center",
          //   itemBorderRadius: 8,
          //   data: [
          //     "Chars Bosh",
          //   ],
          // },
          tooltip: {
            // 提示框组件
            trigger: "item", // 触发类型 可选为：'axis' | 'item' | 'none'
            axisPointer: {
              // 坐标轴指示器，坐标轴触发有效
              type: "line", // 默认为直线，可选为：'line' | 'shadow'
              shadowStyle: {
                color: "rgba(204, 214, 235, 0.247059)",
              },
            },
          },
          radar: {
            // shape: 'circle',
            splitNumber: 4,
            grid: {
              left: fontSize(10),
              right: fontSize(10),
              bottom: fontSize(10),
              containLabel: true,
            },
            splitArea: {
              show: false,
            },
            splitLine: {
              lineStyle: {
                color: ["#eae9e9"],
              },
            },
            axisLine: {
              lineStyle: {
                color: "#eae9e9",
              },
            },
            indicator: [
              {
                name: "欠料",
                max: 100,
              },
              {
                name: "人员不够",
                max: 100,
              },
              {
                name: "机械故障",
                max: 100,
              },
              {
                name: "模具异常",
                max: 100,
              },
              {
                name: "来料不良",
                max: 100,
              },
            ],
          },
          series: [
            {
              name: "雷达图",
              type: "radar",
              symbol: "none",
              areaStyle: {
                normal: {
                  opacity: 0.4,
                },
              },
              itemStyle: {
                normal: {
                  lineStyle: {
                    width: 2,
                  },
                },
                emphasis: {
                  areaStyle: {
                    opacity: 4,
                  },
                },
              },
              data: [
                {
                  value: [50, 46, 80, 30, 60],
                },
              ],
            },
          ],
        },
        {
          backgroundColor: "#fff",
          color: [
            "#0090FF",
            "#36CE9E",
            "#FFC005",
            "#FF515A",
            "#8B5CFF",
            "#00CA69",
          ],
          legend: {
            top: "0%",
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "shadow",
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
              type: "category",
              boundaryGap: false,
              axisLabel: {
                formatter: "{value}月",
                textStyle: {
                  color: "#333",
                },
              },
              axisLine: {
                lineStyle: {
                  color: "#D9D9D9",
                },
              },
              data: ["1", "2", "3", "4", "5", "6", "7", "8"],
            },
          ],
          yAxis: [
            {
              type: "value",
              name: "单位：万",
              axisLabel: {
                textStyle: {
                  color: "#666",
                },
              },
              nameTextStyle: {
                color: "#666",
                fontSize: 12,
                lineHeight: 40,
              },
              splitLine: {
                lineStyle: {
                  type: "dashed",
                  color: "#E9E9E9",
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
                        color: "#0090FF30",
                      },
                      {
                        offset: 1,
                        color: "#0090FF10",
                      },
                    ],
                    false
                  ),
                  shadowColor: "#0090FF10",
                  shadowBlur: 10,
                },
              },
              data: [100, 138, 350, 173, 180, 150, 180, 230],
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
                        color: "#36CE9E30",
                      },
                      {
                        offset: 1,
                        color: "#36CE9E10",
                      },
                    ],
                    false
                  ),
                  shadowColor: "#36CE9E10",
                  shadowBlur: 10,
                },
              },
              data: [233, 233, 200, 180, 199, 233, 210, 180],
            },
          ],
        },
      ];
      this.chart.map((item, index) => {
        if (item) {
          this.barData(item, this.chartOptions[index]);
        }
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
    handleClick(tab, event) {
      console.log(tab, event);
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
        this.selectionData[remarkTb].forEach((x) => {
          let obj = x;
          obj["ElementDeleteFlag"] = 1;
          newData.push(obj);
        });
      }
      this.$confirm("确定要删除的【" + newData.length + "】数据吗？")
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
          type: "success",
          dangerouslyUseHTMLString: true,
        });
        this.dataSearch(remarkTb);
        this.$set(this, "adminLoading", false);
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
        this.$set(this, "adminLoading", false);
      }
    },
    // 获取表头数据
    async getTableHeader() {
      let IDs = this.sysID;
      let res = await GetHeader(IDs);
      const { datas, forms, result, msg } = res.data;
      if (datas.length > 0) {
        this.tablePagination[0].pageSize = datas[0][1].pageSize;
      }

      if (result) {
        // 获取每个表头
        // datas.some((m, i) => {
        //   m.some((n, j) => {
        //     // 进行验证
        //     this.verifyDta(n);
        //     if (n.children && n.children.length != 0) {
        //       n.children.forEach((x) => {
        //         this.verifyDta(x);
        //       });
        //     }
        //   });

        //   this.$set(this.tableColumns, i, m);
        // });
        // 获取查询的初始化字段 组件 按钮
        forms.some((x, z) => {
          this.$set(this.formSearchs[z].datas, "dicID", IDs[z].ID);
          if (z === 2) {
            this.formSearchs[z].datas["PlanDay"] = this.currentDate;
          }
          if (z === 5) {
            this.formSearchs[z].datas["PlanDay"] = this.$moment()
              .subtract(1, "days")
              .format("YYYY-MM-DD");
            // this.formSearchs[z].datas["PlanDay"] = this.currentDate;
          }
          if (z === 7) {
            this.formSearchs[z].datas["DemandDate"] = [
              this.currentDate,
              this.$moment().add(2, "days").format("YYYY-MM-DD"),
            ];
          }
          // x.forEach((y) => {
          //   if (y.prop && y.value) {
          //     this.$set(this.formSearchs[z].datas, [y.prop], y.value);
          //   } else {
          //     this.$set(this.formSearchs[z].datas, [y.prop], "");
          //   }
          // });
          // this.$set(this.formSearchs[z], "forms", x);
          this.getTableData(this.formSearchs[z].datas, z);
          this.adminLoading = false;
        });
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
      // if (this.tableData[remarkTb].length === 0) {
      //   this.tablePagination[remarkTb]["pageSize"] =
      //     this.tableColumns[remarkTb][1]["pageSize"];
      // } else {
      form["rows"] = this.tablePagination[remarkTb].pageSize;
      // }
      // form["rows"] = this.tablePagination[remarkTb].pageSize;
      form["page"] = this.tablePagination[remarkTb].pageIndex;
      let res = await GetSearchData(form);
      const { result, data, count, msg, Columns } = res.data;
      if (remarkTb === 0) {
        data[0]["S1"] = data[0]["S1"].toLocaleString();
        data[0]["S2"] = data[0]["S2"].toLocaleString();
        data[0]["S3"] = data[0]["S3"].toLocaleString();
        data[0]["S4"] = data[0]["S4"].toLocaleString();
      }
      if (remarkTb === 6) {
        this.tableColumns[6] = [
          {
            label: "品类",
            prop: "ProductType",
            width: 80,
          },
          {
            label: "内部型号",
            prop: "InnerModel",
            width: 100,
          },
          {
            label: "数量",
            prop: "Qty",
            width: 80,
          },
          {
            label: "汇报数",
            prop: "ReportQty",
            width: 80,
          },
          {
            label: "出库数",
            prop: "OutStockQty",
            width: 80,
          },
          {
            label: "库存数",
            prop: "StockQtyDiff",
            width: 80,
          },
        ];
        // Columns[0].filter((x) => {
        //   return Object.keys(data[0]).some((y) => {
        //     return x['prop'] === y;
        //   });
        // });
      }
      if (remarkTb === 7) {
        this.tableColumns[7] = [
          {
            label: "计划日期",
            prop: "DemandDate",
            width: 80,
          },
          {
            label: "产线",
            prop: "LineName",
            width: 60,
          },
          {
            label: "产品型号",
            prop: "ProductName",
            width: 100,
          },
          {
            label: "物料编码",
            prop: "Code",
            width: 80,
          },
          {
            label: "物料名称",
            prop: "MaterialName",
            width: 100,
          },
          {
            label: "欠数",
            prop: "OweQty",
            width: 80,
          },
        ];
        // Columns[0].filter((x) => {
        //   return Object.keys(data[0]).some((y) => {
        //     return x['prop'] === y;
        //   });
        // });
      }
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
      await this.getEcharts();

      this.$set(this.tableLoading, remarkTb, false);
      console.log(this.tableData, 11111);
    },
    // 刷新页面
    refrshPage() {
      this.$store.dispatch("tagsView/delCachedView", this.$route).then(() => {
        const { fullPath } = this.$route;
        this.$nextTick(() => {
          this.$router.replace({
            path: "/redirect" + fullPath,
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
          sort: "DemandQty desc",
        },
        "6E8BF76C6BA5B0D8"
      );
      const { result, data, msg } = res.data;
      if (result) {
        this.chartTotal1 = data.reduce(
          (accumulator, current) => accumulator + current.DemandQty,
          0
        );
        this.chartData1 = data.map((item) => ({
          value: item.DemandQty,
          name: item.Dept,
        }));
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
    },
    async getEchartsData2() {
      let res = await GetSearchData(
        {
          dicID: 9062,
          sort: "OweQty",
          page: 1,
          rows: 6,
        },
        "6E8BF76C6BA5B0D8"
      );
      const { result, data, msg } = res.data;
      if (result) {
        this.chartData2[0] = data.map(
          (item) => item.MaterialName.split(" ")[0]
        );
        this.chartData2[1] = data.map((item) => item.OweQty);
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
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
    },
    // 行内样式
    cellStyle7({ row, column }) {
      if (column.property == "OweQty") {
        if (row["OweQty"] < 0) {
          return {
            color: "red",
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
      width: 100%;
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
          width: 500px;
          height: 160px;
          // border: 1px solid #d5d6ff;
          background: #ffffff;
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
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            .textHead {
              display: flex;
              justify-content: space-between;
              align-items: center;

              .title {
                font-weight: 400;
                font-size: 12px;
                color: #7d7d7d;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
            }

            .headNumber {
              display: flex;
              justify-content: flex-start;
              // align-items: center;
              height: 40px;
              margin-bottom: 10px;

              .statusNum {
                // text-align: center;
                margin: auto;
                font-size: 30px;
                font-weight: 400;
                color: #000000;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }

              .leftContent,
              .rightContent {
                display: flex;
                align-items: center;

                img {
                  width: 12px;
                  height: 11px;
                  margin-right: 2px;
                }

                .changeNum {
                  font-weight: 400;
                  font-size: 10px;
                  color: #a4ffbd;
                }

                .loss {
                  color: #ff878a;
                }
              }

              .leftContent {
                visibility: hidden;
              }
            }
          }
        }

        .box:last-child {
          margin-right: 0px;
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
          // margin-right: 10px;
          width: 100%;
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

        // .itemCard:nth-child(2) {
        //   margin-right: 0px;
        //   overflow: hidden;
        // }
      }
    }

    .rightCard {
      width: 34%;
      display: flex;
      flex-direction: column;

      .firstCard {
        height: 160px;
        margin-bottom: 10px;

        .box {
          display: flex;
          // width: calc(25% - 16px);
          width: 100%;
          height: 160px;
          // border: 1px solid #d5d6ff;
          background: #ffffff;
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
            justify-content: center;

            .textHead {
              display: flex;
              justify-content: space-between;
              align-items: center;

              .title {
                font-weight: 400;
                font-size: 14px;
                color: #7d7d7d;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
            }

            .headNumber {
              display: flex;
              // justify-content: center;
              align-items: stretch;
              height: 40px;
              margin-bottom: 10px;

              .statusNum {
                // text-align: center;
                font-size: 32px;
                font-weight: 400;
                color: #000000;
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
                  margin-right: 2px;
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
          }
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
        flex-grow: 1;

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
    content: "";
    /* 伪元素的内容为空 */
    position: absolute;
    /* 将伪元素设置为绝对定位 */
    top: 50%;
    left: 0;
    /* 将伪元素向左偏移 50% */
    transform: translateY(-50%) translateX(-50%);
    /* 通过 transform 属性向左平移自身宽度的一半 */
    display: inline-block;
    /* 将伪元素设置为行内块元素 */
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

  .container {
    padding: 0;
  }

  ::v-deep .el-tabs__item {
    padding: 5px;
    /* 设置为0或调整合适的数值 */
  }
}
</style>
