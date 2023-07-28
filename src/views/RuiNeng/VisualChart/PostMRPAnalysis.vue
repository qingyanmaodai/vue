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
                <div class="textHead">
                  <div class="title">{{ headCard[0]["title"] }}</div>
                  <div class="content">
                    <img v-if="parseInt(headCard[0]['changeNum']) >= 0"
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAACpF6WWAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAGsSURBVHgBpZW9TgJBEMfnPvgQk+MaGpEnsNB3sICe2JhYmGh8AN6AWguDMRaGWJPQQ2GrvSZaYsTKWAAG4QjcOrO3h3q3t5vgP5nMsh8/Zm9u5gxIEGMsjS6LRt5GM2gabY42Q/syDGMuO2tIYBY6V8B0mqKNEL5IhCIwh84ByZ8p5AvwJAYVwDysrkEINgXQEhH+R47gBFAIIlRfuXFZg8ZFTbGDWC4fID2FPgM64HiMNtGB0/TWEH1NCWzelDkwFIGvrvcUJzKmMspWewveP85j88NBna8poJZ0qdstQe+liWmMJ5CxPF/r3G5KTlphpcRVLveB2VU+fnqow2xe4WPD7MP2TjC/URhJTpoEZYngyu4b98+PP4dT9t1yXi6frr8AnRastBw7Tle3m6AeaKF+8Ozo6keHHc1uj6BT5ZY2Zpn5QaSucwZ6TUysV2pjs8Qtvdc697n1Uzg5boEGSO3QFj8GaAWIJowqCUsEisUqHOzfa4CU8E+Av12KKsuF1bXsUtF+SmB9c4lHOJT201/gsA1mQS9PAJM7fwSeEmDqDdFvFME8keSYvgEgyZnv7NknkgAAAABJRU5ErkJggg==" />
                    <img v-else
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAACpF6WWAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAIbSURBVHgBrZXPbtNAEMa/tY3TIiylAg5UHAyCXnoxpFRC6iHwAu4DIKW5FEWc+iScUAUcSt4gPXE1h16aVLZ6C0hRpaIUiX+WgmiTxl7Ga2zFjd0tFZ/kZDM7+8vs7OyYoUBW+20VCmwwXgWHSaYyPT4YDsCZg4A3veV1L28tm4K5mya4tgVOMKl4C6Nww3vcOJi0Khng3uYaQtW9GFDEtApdda3O61rGmgFC3cJlxfmat/S8mULFlqMI47xdVj5GwYMoFfH2Q/VlHnDl9gLshQquzxoXYNL6UrxTZu2+saDCLfK071cwb8yhc9RDmx6pwuCJApXVzvNJQEu37mL+2hykUjRboaxWz/Pp//qJwehEjJ+ai5CKKkehD1Pm9+33QHwb+ow8WgYzOijpiQ+DcTq+U74pcy9riEohB1xSNeialo4TRZEapRkxHgxP8qC+BsboLnPr7IxOIPtehQCzGfuNqwaeLa4Q8Bjbn/bSfKfioDrlcPL+LnJ+39vPbD3RcDwWc1PASIw5CsLxNgr0/XiAncOPU/adz10xl6tg1FS8Rw2HTsxBgbo/+gTupr/b/R7ZjvKdOW95yy+8+ARYUAcvvvv7Xw8px1fEuPOl8Fb5OA03BC6x/M8ulfZTr9J4RwmpIy6xf5E/CcxEmuhvG4y61qqMJirnNKif7fysyN/afUXdS6+JtwCbeEdRHUZlwxhvuQ/XP+St/QMIONIPfffW1AAAAABJRU5ErkJggg==" />
                    <div class="changeNum" :class="parseInt(headCard[0]['changeNum']) < 0 ? 'loss' : ''
                      ">
                      {{ headCard[0]["changeNum"] }}
                    </div>
                  </div>
                </div>
                <div class="statusNum">
                  {{ headCard[0]["statusNum"] }}
                </div>
              </div>
            </div>
            <div class="box green">
              <div class="icon">
                <img :src="headCard[1]['icon']" />
              </div>
              <div class="textBox">
                <div class="textHead">
                  <div class="title">{{ headCard[1]["title"] }}</div>
                  <div class="content">
                    <img v-if="parseInt(headCard[1]['changeNum']) >= 0"
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAACpF6WWAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAGsSURBVHgBpZW9TgJBEMfnPvgQk+MaGpEnsNB3sICe2JhYmGh8AN6AWguDMRaGWJPQQ2GrvSZaYsTKWAAG4QjcOrO3h3q3t5vgP5nMsh8/Zm9u5gxIEGMsjS6LRt5GM2gabY42Q/syDGMuO2tIYBY6V8B0mqKNEL5IhCIwh84ByZ8p5AvwJAYVwDysrkEINgXQEhH+R47gBFAIIlRfuXFZg8ZFTbGDWC4fID2FPgM64HiMNtGB0/TWEH1NCWzelDkwFIGvrvcUJzKmMspWewveP85j88NBna8poJZ0qdstQe+liWmMJ5CxPF/r3G5KTlphpcRVLveB2VU+fnqow2xe4WPD7MP2TjC/URhJTpoEZYngyu4b98+PP4dT9t1yXi6frr8AnRastBw7Tle3m6AeaKF+8Ozo6keHHc1uj6BT5ZY2Zpn5QaSucwZ6TUysV2pjs8Qtvdc697n1Uzg5boEGSO3QFj8GaAWIJowqCUsEisUqHOzfa4CU8E+Av12KKsuF1bXsUtF+SmB9c4lHOJT201/gsA1mQS9PAJM7fwSeEmDqDdFvFME8keSYvgEgyZnv7NknkgAAAABJRU5ErkJggg==" />
                    <img v-else
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAACpF6WWAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAIbSURBVHgBrZXPbtNAEMa/tY3TIiylAg5UHAyCXnoxpFRC6iHwAu4DIKW5FEWc+iScUAUcSt4gPXE1h16aVLZ6C0hRpaIUiX+WgmiTxl7Ga2zFjd0tFZ/kZDM7+8vs7OyYoUBW+20VCmwwXgWHSaYyPT4YDsCZg4A3veV1L28tm4K5mya4tgVOMKl4C6Nww3vcOJi0Khng3uYaQtW9GFDEtApdda3O61rGmgFC3cJlxfmat/S8mULFlqMI47xdVj5GwYMoFfH2Q/VlHnDl9gLshQquzxoXYNL6UrxTZu2+saDCLfK071cwb8yhc9RDmx6pwuCJApXVzvNJQEu37mL+2hykUjRboaxWz/Pp//qJwehEjJ+ai5CKKkehD1Pm9+33QHwb+ow8WgYzOijpiQ+DcTq+U74pcy9riEohB1xSNeialo4TRZEapRkxHgxP8qC+BsboLnPr7IxOIPtehQCzGfuNqwaeLa4Q8Bjbn/bSfKfioDrlcPL+LnJ+39vPbD3RcDwWc1PASIw5CsLxNgr0/XiAncOPU/adz10xl6tg1FS8Rw2HTsxBgbo/+gTupr/b/R7ZjvKdOW95yy+8+ARYUAcvvvv7Xw8px1fEuPOl8Fb5OA03BC6x/M8ulfZTr9J4RwmpIy6xf5E/CcxEmuhvG4y61qqMJirnNKif7fysyN/afUXdS6+JtwCbeEdRHUZlwxhvuQ/XP+St/QMIONIPfffW1AAAAABJRU5ErkJggg==" />
                    <div class="changeNum" :class="parseInt(headCard[1]['changeNum']) < 0 ? 'loss' : ''
                      ">
                      {{ headCard[1]["changeNum"] }}
                    </div>
                  </div>
                </div>
                <div class="statusNum">
                  {{ headCard[1]["statusNum"] }}
                </div>
              </div>
            </div>
            <div class="box purple">
              <div class="icon">
                <img :src="headCard[2]['icon']" />
              </div>
              <div class="textBox">
                <div class="textHead">
                  <div class="title">{{ headCard[2]["title"] }}</div>
                  <div class="content">
                    <img v-if="parseInt(headCard[2]['changeNum']) >= 0"
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAACpF6WWAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAGsSURBVHgBpZW9TgJBEMfnPvgQk+MaGpEnsNB3sICe2JhYmGh8AN6AWguDMRaGWJPQQ2GrvSZaYsTKWAAG4QjcOrO3h3q3t5vgP5nMsh8/Zm9u5gxIEGMsjS6LRt5GM2gabY42Q/syDGMuO2tIYBY6V8B0mqKNEL5IhCIwh84ByZ8p5AvwJAYVwDysrkEINgXQEhH+R47gBFAIIlRfuXFZg8ZFTbGDWC4fID2FPgM64HiMNtGB0/TWEH1NCWzelDkwFIGvrvcUJzKmMspWewveP85j88NBna8poJZ0qdstQe+liWmMJ5CxPF/r3G5KTlphpcRVLveB2VU+fnqow2xe4WPD7MP2TjC/URhJTpoEZYngyu4b98+PP4dT9t1yXi6frr8AnRastBw7Tle3m6AeaKF+8Ozo6keHHc1uj6BT5ZY2Zpn5QaSucwZ6TUysV2pjs8Qtvdc697n1Uzg5boEGSO3QFj8GaAWIJowqCUsEisUqHOzfa4CU8E+Av12KKsuF1bXsUtF+SmB9c4lHOJT201/gsA1mQS9PAJM7fwSeEmDqDdFvFME8keSYvgEgyZnv7NknkgAAAABJRU5ErkJggg==" />
                    <img v-else
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAACpF6WWAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAIbSURBVHgBrZXPbtNAEMa/tY3TIiylAg5UHAyCXnoxpFRC6iHwAu4DIKW5FEWc+iScUAUcSt4gPXE1h16aVLZ6C0hRpaIUiX+WgmiTxl7Ga2zFjd0tFZ/kZDM7+8vs7OyYoUBW+20VCmwwXgWHSaYyPT4YDsCZg4A3veV1L28tm4K5mya4tgVOMKl4C6Nww3vcOJi0Khng3uYaQtW9GFDEtApdda3O61rGmgFC3cJlxfmat/S8mULFlqMI47xdVj5GwYMoFfH2Q/VlHnDl9gLshQquzxoXYNL6UrxTZu2+saDCLfK071cwb8yhc9RDmx6pwuCJApXVzvNJQEu37mL+2hykUjRboaxWz/Pp//qJwehEjJ+ai5CKKkehD1Pm9+33QHwb+ow8WgYzOijpiQ+DcTq+U74pcy9riEohB1xSNeialo4TRZEapRkxHgxP8qC+BsboLnPr7IxOIPtehQCzGfuNqwaeLa4Q8Bjbn/bSfKfioDrlcPL+LnJ+39vPbD3RcDwWc1PASIw5CsLxNgr0/XiAncOPU/adz10xl6tg1FS8Rw2HTsxBgbo/+gTupr/b/R7ZjvKdOW95yy+8+ARYUAcvvvv7Xw8px1fEuPOl8Fb5OA03BC6x/M8ulfZTr9J4RwmpIy6xf5E/CcxEmuhvG4y61qqMJirnNKif7fysyN/afUXdS6+JtwCbeEdRHUZlwxhvuQ/XP+St/QMIONIPfffW1AAAAABJRU5ErkJggg==" />
                    <div class="changeNum">{{ headCard[2]["changeNum"] }}</div>
                  </div>
                </div>
                <div class="statusNum">{{ headCard[2]["statusNum"] }}</div>
              </div>
            </div>
            <div class="box red">
              <div class="icon">
                <img :src="headCard[3]['icon']" />
              </div>

              <div class="textBox">
                <div class="textHead">
                  <div class="title">{{ headCard[3]["title"] }}</div>
                  <div class="content">
                    <img v-if="parseInt(headCard[3]['changeNum']) >= 0"
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAACpF6WWAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAGsSURBVHgBpZW9TgJBEMfnPvgQk+MaGpEnsNB3sICe2JhYmGh8AN6AWguDMRaGWJPQQ2GrvSZaYsTKWAAG4QjcOrO3h3q3t5vgP5nMsh8/Zm9u5gxIEGMsjS6LRt5GM2gabY42Q/syDGMuO2tIYBY6V8B0mqKNEL5IhCIwh84ByZ8p5AvwJAYVwDysrkEINgXQEhH+R47gBFAIIlRfuXFZg8ZFTbGDWC4fID2FPgM64HiMNtGB0/TWEH1NCWzelDkwFIGvrvcUJzKmMspWewveP85j88NBna8poJZ0qdstQe+liWmMJ5CxPF/r3G5KTlphpcRVLveB2VU+fnqow2xe4WPD7MP2TjC/URhJTpoEZYngyu4b98+PP4dT9t1yXi6frr8AnRastBw7Tle3m6AeaKF+8Ozo6keHHc1uj6BT5ZY2Zpn5QaSucwZ6TUysV2pjs8Qtvdc697n1Uzg5boEGSO3QFj8GaAWIJowqCUsEisUqHOzfa4CU8E+Av12KKsuF1bXsUtF+SmB9c4lHOJT201/gsA1mQS9PAJM7fwSeEmDqDdFvFME8keSYvgEgyZnv7NknkgAAAABJRU5ErkJggg==" />
                    <img v-else
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAACpF6WWAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAIbSURBVHgBrZXPbtNAEMa/tY3TIiylAg5UHAyCXnoxpFRC6iHwAu4DIKW5FEWc+iScUAUcSt4gPXE1h16aVLZ6C0hRpaIUiX+WgmiTxl7Ga2zFjd0tFZ/kZDM7+8vs7OyYoUBW+20VCmwwXgWHSaYyPT4YDsCZg4A3veV1L28tm4K5mya4tgVOMKl4C6Nww3vcOJi0Khng3uYaQtW9GFDEtApdda3O61rGmgFC3cJlxfmat/S8mULFlqMI47xdVj5GwYMoFfH2Q/VlHnDl9gLshQquzxoXYNL6UrxTZu2+saDCLfK071cwb8yhc9RDmx6pwuCJApXVzvNJQEu37mL+2hykUjRboaxWz/Pp//qJwehEjJ+ai5CKKkehD1Pm9+33QHwb+ow8WgYzOijpiQ+DcTq+U74pcy9riEohB1xSNeialo4TRZEapRkxHgxP8qC+BsboLnPr7IxOIPtehQCzGfuNqwaeLa4Q8Bjbn/bSfKfioDrlcPL+LnJ+39vPbD3RcDwWc1PASIw5CsLxNgr0/XiAncOPU/adz10xl6tg1FS8Rw2HTsxBgbo/+gTupr/b/R7ZjvKdOW95yy+8+ARYUAcvvvv7Xw8px1fEuPOl8Fb5OA03BC6x/M8ulfZTr9J4RwmpIy6xf5E/CcxEmuhvG4y61qqMJirnNKif7fysyN/afUXdS6+JtwCbeEdRHUZlwxhvuQ/XP+St/QMIONIPfffW1AAAAABJRU5ErkJggg==" />
                    <div class="changeNum">{{ headCard[3]["changeNum"] }}</div>
                  </div>
                </div>
                <div class="statusNum">{{ headCard[3]["statusNum"] }}</div>
              </div>
            </div>
          </div>
          <div class="itemCard">
            <div class="echartHead">
              <div class="echartTitle">近七日库存+在途超订金额统计</div>
            </div>
            <div class="echartBody" ref="chart1"></div>
          </div>
        </div>
        <div class="rightCard">
          <div class="itemCard">
            <div class="echartHead">
              <div class="echartTitle">库存耗用分析</div>
              <el-button-group>
                <el-button :class="{
                  select: selected1Index === 0,
                }" size="small" @click="handleConsumeBtnClick(0)">
                  预计消耗
                </el-button>
                <el-button :class="{
                  select: selected1Index === 1,
                }" size="small" @click="handleConsumeBtnClick(1)">
                  预计超额
                </el-button>
              </el-button-group>
            </div>
            <div class="echartBody" ref="chart2"></div>
          </div>
        </div>
      </div>
      <div class="echartCard">
        <div class="rowChart2">
          <div class="itemCard">
            <div class="echartHead">
              <div class="echartTitle">异常物料超订金额</div>
            </div>
            <div class="echartBody" ref="chart3"></div>
          </div>
          <div class="itemCard">
            <div class="echartHead">
              <div class="echartTitle">数据统计</div>
              <el-button-group>
                <el-button :class="{
                  select: selected2Index === 0,
                }" size="small" @click="handleDayBtnClick(0)">
                  今日
                </el-button>
                <el-button :class="{
                  select: selected2Index === 1,
                }" size="small" @click="handleDayBtnClick(1)">
                  昨日
                </el-button>
              </el-button-group>
            </div>
            <div class="echartBody" ref="chart4"></div>
          </div>
        </div>
      </div>
      <div class="listCard">
        <div class="container" v-loading="adminLoading">
          <div class="admin_head" ref="headRef">
            <ComSearch ref="searchRef" :searchData="formSearchs[0].datas" :searchForm="formSearchs[0].forms" :remark="0"
              :btnForm="btnForm" @btnClick="btnClick" />
          </div>
          <div>
            <div class="admin_content">
              <div class="ant-table-title">
                <el-row>
                  <el-col :span="4"><span class="title">{{ "表格title" }}</span></el-col>
                  <el-col :span="20" class="flex_flex_end">
                    <el-divider direction="vertical"></el-divider>
                    <el-tooltip class="item" effect="dark" content="刷新" placement="bottom">
                      <span class="right_icon">
                        <span @click="refrshPage" role="img" aria-label="redo" class="anticon anticon-redo icon_size"><svg
                            class="" data-icon="redo" width="1em" height="1em" fill="currentColor" aria-hidden="true"
                            viewBox="64 64 896 896" focusable="false">
                            <path
                              d="M758.2 839.1C851.8 765.9 912 651.9 912 523.9 912 303 733.5 124.3 512.6 124 291.4 123.7 112 302.8 112 523.9c0 125.2 57.5 236.9 147.6 310.2 3.5 2.8 8.6 2.2 11.4-1.3l39.4-50.5c2.7-3.4 2.1-8.3-1.2-11.1-8.1-6.6-15.9-13.7-23.4-21.2a318.64 318.64 0 01-68.6-101.7C200.4 609 192 567.1 192 523.9s8.4-85.1 25.1-124.5c16.1-38.1 39.2-72.3 68.6-101.7 29.4-29.4 63.6-52.5 101.7-68.6C426.9 212.4 468.8 204 512 204s85.1 8.4 124.5 25.1c38.1 16.1 72.3 39.2 101.7 68.6 29.4 29.4 52.5 63.6 68.6 101.7 16.7 39.4 25.1 81.3 25.1 124.5s-8.4 85.1-25.1 124.5a318.64 318.64 0 01-68.6 101.7c-9.3 9.3-19.1 18-29.3 26L668.2 724a8 8 0 00-14.1 3l-39.6 162.2c-1.2 5 2.6 9.9 7.7 9.9l167 .8c6.7 0 10.5-7.7 6.3-12.9l-37.3-47.9z">
                            </path>
                          </svg></span>
                      </span>
                    </el-tooltip>
                    <el-divider direction="vertical"></el-divider>
                    <el-tooltip effect="dark" content="列设置" placement="bottom">
                      <span class="right_icon">
                        <span role="img" aria-label="setting" class="anticon anticon-setting icon_size"><svg class=""
                            data-icon="setting" width="1em" height="1em" fill="currentColor" aria-hidden="true"
                            viewBox="64 64 896 896" focusable="false">
                            <path
                              d="M924.8 625.7l-65.5-56c3.1-19 4.7-38.4 4.7-57.8s-1.6-38.8-4.7-57.8l65.5-56a32.03 32.03 0 009.3-35.2l-.9-2.6a443.74 443.74 0 00-79.7-137.9l-1.8-2.1a32.12 32.12 0 00-35.1-9.5l-81.3 28.9c-30-24.6-63.5-44-99.7-57.6l-15.7-85a32.05 32.05 0 00-25.8-25.7l-2.7-.5c-52.1-9.4-106.9-9.4-159 0l-2.7.5a32.05 32.05 0 00-25.8 25.7l-15.8 85.4a351.86 351.86 0 00-99 57.4l-81.9-29.1a32 32 0 00-35.1 9.5l-1.8 2.1a446.02 446.02 0 00-79.7 137.9l-.9 2.6c-4.5 12.5-.8 26.5 9.3 35.2l66.3 56.6c-3.1 18.8-4.6 38-4.6 57.1 0 19.2 1.5 38.4 4.6 57.1L99 625.5a32.03 32.03 0 00-9.3 35.2l.9 2.6c18.1 50.4 44.9 96.9 79.7 137.9l1.8 2.1a32.12 32.12 0 0035.1 9.5l81.9-29.1c29.8 24.5 63.1 43.9 99 57.4l15.8 85.4a32.05 32.05 0 0025.8 25.7l2.7.5a449.4 449.4 0 00159 0l2.7-.5a32.05 32.05 0 0025.8-25.7l15.7-85a350 350 0 0099.7-57.6l81.3 28.9a32 32 0 0035.1-9.5l1.8-2.1c34.8-41.1 61.6-87.5 79.7-137.9l.9-2.6c4.5-12.3.8-26.3-9.3-35zM788.3 465.9c2.5 15.1 3.8 30.6 3.8 46.1s-1.3 31-3.8 46.1l-6.6 40.1 74.7 63.9a370.03 370.03 0 01-42.6 73.6L721 702.8l-31.4 25.8c-23.9 19.6-50.5 35-79.3 45.8l-38.1 14.3-17.9 97a377.5 377.5 0 01-85 0l-17.9-97.2-37.8-14.5c-28.5-10.8-55-26.2-78.7-45.7l-31.4-25.9-93.4 33.2c-17-22.9-31.2-47.6-42.6-73.6l75.5-64.5-6.5-40c-2.4-14.9-3.7-30.3-3.7-45.5 0-15.3 1.2-30.6 3.7-45.5l6.5-40-75.5-64.5c11.3-26.1 25.6-50.7 42.6-73.6l93.4 33.2 31.4-25.9c23.7-19.5 50.2-34.9 78.7-45.7l37.9-14.3 17.9-97.2c28.1-3.2 56.8-3.2 85 0l17.9 97 38.1 14.3c28.7 10.8 55.4 26.2 79.3 45.8l31.4 25.8 92.8-32.9c17 22.9 31.2 47.6 42.6 73.6L781.8 426l6.5 39.9zM512 326c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm79.2 255.2A111.6 111.6 0 01512 614c-29.9 0-58-11.7-79.2-32.8A111.6 111.6 0 01400 502c0-29.9 11.7-58 32.8-79.2C454 401.6 482.1 390 512 390c29.9 0 58 11.6 79.2 32.8A111.6 111.6 0 01624 502c0 29.9-11.7 58-32.8 79.2z">
                            </path>
                          </svg></span>
                      </span>
                    </el-tooltip>
                  </el-col>
                </el-row>
              </div>
              <ComVxeTable :rowKey="'RowNumber'" :height="height" :tableData="tableData[0]" :tableHeader="tableColumns[0]"
                :tableLoading="tableLoading[0]" :remark="0" :sysID="ID" :isEdit="isEdit" :isClear="isClear[0]"
                :hasSelect="isSelect" :pagination="tablePagination[0]" @selectfun="selectFun"
                @handleRowClick="handleRowClick" @pageChange="pageChange" @pageSize="pageSize" @sortChange="sortChange" />
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
  name: "PostMRPAnalysis",
  components: {
    ComSearch,
    ComVxeTable,
  },
  data() {
    return {
      headCard: [
        {
          icon: "data:image/png;base64,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",
          title: "今日库存金额",
          statusNum: "￥42,140,00000000000000000",
          changeNum: "+4500",
          iconStatus: true,
        },
        {
          icon: "data:image/png;base64,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",
          title: "今日在途金额",
          statusNum: "￥42,140,000",
          changeNum: "-4500",
          iconStatus: false,
        },
        {
          icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAuCAYAAABXuSs3AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAVqSURBVHgB1Vk9bBxFFH5vdh07OPgHKyADts41QnEoQ8G5ozQVdHFD2qTAJdgRLQW0NLFL08RUVMhOk5azREGXJRZEgiQ+R1j+O9/jzc3Pvt3z+WbO+IdPutu9uZ3db95872dmEU6JLaIRgKNZALzBnwo3TRPoNhhx1yBgxgf+UI0/jwAOa6N4NYNTAKEHGLLN29x9lklWoQfwYNb5HkujmC5DD4girgk3oXmPO90FYdFTIiOA5TFMFmM6BRPfosMqQfKAp7oCZ4MMgRZDZ6ArcWvlRWvlMwc/51sAdX8Usd7lus5g0hXW8EO28jScL9j6BzMnOXBH4pb02hlKoxtOJH8s8UtA2qEj+TbiWtNM+pdLQNoCaxw6Z8qaV+XLtCNeHtIa2r+aC+XWgsWfU2NOAT6AS4gjaM5cx75197tA/CU1n4RY+/vd3+AVNUx3QnEbe07i3P5HfB0e0zaZDMCng29BAFjv6qaTTOpaX9DRYgjplb0n8NXOhiWsPPkWMUzygZD9j68xpM2xlexlG39vHh3AF0MT3R5dYcnoXHIfQGicb3MbAvD48K+cNKE/R/cbxIAKbYZofl1OfrOxH/JoPZH3TJ1kiWttBzsklYgJImYgzrL5ESEx7X4miuQjKg9b3FniCaggaxuULOmIiA+W5VGSD5Hy1s9nIAw8+Fl9TE2yaVZDO04kg3Cr7zpIx8wdzyrPEbQDlfoG4aRkf793ZRDCQVUtF2SZzPK4H8L/CDzkuTQB/IgiOj0+eM5RYBeKunThDdpDHsg2+1grDbRtE0k/3Bq4BhHUp1P9ZQNvEFZ2Nzkk/iGciuerEBqLYdBo3obM4/TPZ58NjkURZ4lVUmrFxxhInSpPWJJBVPYa5Qm3aR3EoMKjiqOuLR5Xl5CI094pfTJhIohFS4uZoNIMYWGGojCiIjsYKxYsLMKgzaDDqs/Gcxm7zRHFDLjBEJ0DcQ0Xh8tW1YQm09fg5zc/gDvX3rZSEaTtrLiBU+8Wb92lHtNBOqXMmGQJfD081YoSP+1uif8dOZv2ffZ02u+JOEYRd7okymXirDj/+iR8PDAGX9Z/5/rj0LQ7Z7WO2WZpEokrHFnK3WoxkYVkNMA8Srzfd40rvMlWwTSEKcwPveuH6qTxw04dnjYawpnNoCgmkRgWmY4qWUwXWd1Ji33OmtaYSPthfvidY/tOplfg7otnvi8660dKhXvW0iOgDRXR0WTHPMk45/xm+09Y+ecleAtb7coFxK/7+z6SIOUxP17jap1TfrLKRVbwcg1BOqfyKf1p44Bl0vAxXGZRFOWvIw1CahRJfA/2NpRZCukNyDCQDXsgnMyHRxkmRXzPnVIVEhEUElUwg/Vx3q5ouTPfcjW0m9YlisVAnpCUH5TMjFhKUD7xiJIgRuN85RKAj0NqGYLjOYq0X4zH0uIkBuOWeFSI3eWVUhAytynaIq7lgq3Nxu6YSAeMFUsWk6VAPoi8jpEOLStH/f+HV/tDHq39acmd+6HG7GCt7HBNzs4oa2y/GoLcgcluUyBIB8TCAnpYIdwZCSppszcwmWojrvE374Hz+nMNLiH0qkfunRdyrd4pokDJnCc0p/KGf5tXWMmsXcCeeCdk27yDNdVt01M76j7gJ2DelF00sn3eZp465u1Exzj0jLct+i94Y1+THu+wsd+xnhxH5I44czGWx9pJpDVOLIQ1eQ5lN8/TYfWzttlg411e4AanLLN3rhbO9nWh4pCHj0Iujq0n9Xb0As/C3H84gLq28itQ301h+GosfrFnYWYA9GvxKvQEWmcDrNa5Tooh7NAzcQcdfQYAbvC7oyq2Yj9WoLgUrJsP8hKRuBxVNf7xYy9kJf4FVaRmWeIc5toAAAAASUVORK5CYII=",
          title: "超订金额",
          statusNum: "￥42,140,000",
          changeNum: "+4500",
          iconStatus: true,
        },
        {
          icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAuCAYAAABXuSs3AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAVXSURBVHgBzZlLbBtFGMf/s7HT5tE2oYBano6EeEt1L1yohJMzKqkEJw4xvcABiYK4x71x4FHEFSmJxBWawB0Sml5ACAcVCU5YcEFtoUmcxLWd7PSb3Z3dmX3YM07z+Eubzc7O7Pzmm2++eZhhl+Kcj6Ben0Qud4YeCpRSpOSR4JKqgdPlOFVsby8hn6+ygYEadiGGHuTBNhpTgDtJQCX0Io5F9PXNUgPm0IOswD3grY1LVOw96BbtXYzVsOPOsWPHKlbFTDPyer2EPmfGd4c9kGgAcyqmPeB0yyCszDfqV+CwH/YM2q+oAHdnlm9sfMbv3Onamx0tzhuNArh7lT5axH7Kt/54pwGcCR5A762VO6kLfCr4gUNLdYBP+LgXOQ4DNCD9/mqazycH5+ZG5VBARyrShDUdT9RchUZ0mVJmcBjl8nGK9YvyUQff2vyrq7UbDeDnn4DmXVEiSmdcv0O5h7Wk/D/yIPAsBa2jg+go4e/N1lk2OroqHnPhZzbrFSPoTz8BVv8PALl/92Dc4M6Vd7Ih6jslr8w3SvBvVzrDC7b+fjFjXxaPkY8zZwrddOOGD+1VzKMrDq2lKw2Qdwd649ZuAivL6C5+SQ5UD9zzbZMBKS0tK4VSuQoNBVTL5+o95cg0SmpuwUAjOHJkKgSnv92t7bc4BTQOHcCE8MF1dICqPQnNlcLLhTZeOsmlFalA9icbi6Wpo7oD9K6Pu4QEPP048MFHwIWLusXjjTcRQ0m4Sw7tdpFWfYaFuBgkOjh4yoUI7BGCLn/oD7yVa0h1KVvl8685yDmvWBUKLQod4gFygzff8e8s6PrTj0XQ818S+PWkS2lGMJSDogiHFiu/lPAnIU49CjxHnzpFsDMfA4ODEfSCAg2ejPVM6SkjDFbIUf6CcQHVh8OKA5A/fgW+/xaYOA9cDIAldHVZ7yEgObCtxD2LF2yK6L4Zc5ul7/yBWjrv5/Esvaz3DItZvDdfH8nBShkDUHWhxQWK97f8uPznL9BnUKW3GE9xnb0CV90khEGy2z0rq2nKuzRoZg8vOnbVqoScxuWkIScbpFhfHcAyzYnDWg7MnsE1kKBSJ249BVptjJwlWVp+K9VytFysGm8cxp6mSl4F4stTeU9bviZCn9KY8Jn0xPMwFhfg4DXjAnc3qX9uZ1TOM0DV6NMhmjSfhLEcVHPYdleMp/x//6GYfD0FJuYime/ikUTJd+Ih4KmXzDg4W3SwszMPU409kw0d+i+S4yAtgqj5xLsXx40x0GqtON5WiNEBpIkKBD75Fu1YTmZYDkgsW+MNURstruNk6QlaNR5/2AhBHJYScy2I4w5Z3S0ZFSye8680XfsG+PFrJCMG3V9+HTj3Bu6DZsUfH7zZnEN/vgLbE1gxQ679h3Agrt5MuoeQ+H+d3v39exRFhKVPGFo5Uo0ND895n5QpvLE5TUcAFdjoi/cJ6DYi91AnHCC5F1XSjtAC7N2vYCdWYUNDl3VwsQntz9MSz2LR9RttDNZuBd/kwSYjAA2/nhEyhU+/MAEL1djQ8Jh80M9VxBm4OE4+jOIoSzcR0gK4d1LEcAWHTcSkQvtJMQUuI6y+v2fi2aqh1Q5PsKQSU6aXodW+4BU4eAno8Ti0UOa6jCxfCCxfwMFIQtfSXmYuUrwCVBAHY/lqJ2ihjqurAP7svg5YUVcXaD+bofj6eplWkdPYO9ehX577yvSzyZJJZuu9RzDDlnG/GsA5LfIcsnLr87RBmCX7TZOsT/RAjo6md/OTOOfz9Nv+nA2wVM/gYf1e9Ok/Q9N4CSL2+wdMhSiDsCgjMNoiMtptuTTw2u2FXmBV3QPUgMSfzXTxswAAAABJRU5ErkJggg==",
          title: "超订计划金额",
          statusNum: "￥42,140,000",
          changeNum: "+4500",
          iconStatus: true,
        },
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
          forms: [],
        },
      ],

      //echart部分
      chartData1: [],
      chartData2: [[], []],
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
    // this.ID = parseInt(routeBtn.meta.dicID);
    this.getTableHeader();
  },
  activated() { },
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
    ];
    await this.getEcharts();
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
          textStyle: {
            fontSize: fontSize(14),
          },
          tooltip: {
            trigger: "axis",
            formatter: function (params, ticket, callback) {
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
            },
          },
          grid: {
            containLabel: true,
          },
          legend: {
            data: ["库存金额", "在途金额"],
          },
          xAxis: [
            {
              type: "category",
              axisTick: {
                alignWithLabel: true,
                show: false,
              },
              data: [
                "9月1日",
                "9月2日",
                "9月3日",
                "9月4日",
                "9月5日",
                "9月6日",
                "9月7日",
              ],
              axisLine: {
                show: true,
                lineStyle: {
                  color: "#CCCCCC",
                },
              },
              axisLabel: {
                textStyle: {
                  color: "#666666", // 设置文字颜色为灰色
                  fontSize: fontSize(14),
                },
              },
            },
          ],
          dataZoom: [
            {
              type: "slider",
              xAxisIndex: 0,
              filterMode: "empty",
              start: 0,
              end: 100,
            },
            {
              type: "inside",
              xAxisIndex: 0,
              filterMode: "empty",
              start: 0,
              end: 100,
            },
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
                fontSize: fontSize(14),
              },
              axisLabel: {
                formatter: "{value}",
                textStyle: {
                  color: "#666666", // 设置文字颜色为灰色
                  fontSize: fontSize(14),
                },
              },
              axisLine: {
                show: true,
                lineStyle: {
                  color: "#CCCCCC",
                },
              },
              axisTick: {
                show: false,
              },
              splitLine: {
                show: false,
                lineStyle: {
                  color: ["#CCCCCC"],
                },
              },
            },
            {
              type: "value",
              name: "增长率",
              position: "right",
              min: function (value) {
                return value.min * 2;
              },
              max: function (value) {
                return value.max * 2;
              },
              nameTextStyle: {
                align: "right",
                color: "#666",
                fontWeight: "bold",
                fontSize: fontSize(14),
              },
              axisLabel: {
                formatter: "{value}%",
                textStyle: {
                  color: "#666666", // 设置文字颜色为灰色
                  fontSize: fontSize(14),
                },
              },
              axisLine: {
                show: true,
                lineStyle: {
                  color: "#CCCCCC",
                },
              },
              axisTick: {
                show: false,
              },
              splitLine: {
                show: false,
                lineStyle: {
                  color: ["#CCCCCC"],
                },
              },
            },
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
                  formatter: function (params) {
                    return params.data.toFixed() + "%";
                  },
                },
              },
              lineStyle: {
                normal: {
                  // width: 3,
                  shadowColor: "#5964FE",
                  // shadowBlur: 10,
                  // shadowOffsetY: 10
                },
              },
              itemStyle: {
                color: "#5964FE",
              },
              data: [0, -25.0, 5.56, -21.05, 33.33, -10.0, -33.33],
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
                  formatter: function (params) {
                    return params.data.toFixed() + "%";
                  },
                },
              },
              lineStyle: {
                normal: {
                  // width: 3,
                  shadowColor: "#33CB90",
                  // shadowBlur: 10,
                  // shadowOffsetY: 10
                },
              },
              itemStyle: {
                color: "#33CB90",
              },
              data: [0, -23.81, -43.75, -11.11, 137.5, -42.11, -36.36],
            },
            {
              name: "库存金额",
              type: "bar",
              yAxisIndex: 0,
              label: {
                normal: {
                  show: true,
                  position: "top",
                },
              },
              barWidth: fontSize(20),
              data: [1200, 900, 950, 750, 1000, 900, 600],
              itemStyle: {
                color: "#5964FE",
              },
            },
            {
              name: "在途金额",
              type: "bar",
              yAxisIndex: 0,
              label: {
                normal: {
                  show: true,
                  position: "top",
                },
              },
              barWidth: fontSize(20),
              data: [2100, 1600, 900, 800, 1900, 1100, 700],
              itemStyle: {
                color: "#33CB90",
              },
            },
          ],
        },
        {
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b}: {c}",
          },
          textStyle: {
            fontSize: fontSize(14),
          },
          grid: {
            left: "8%",
            right: "8%",
            bottom: "10%",
            containLabel: true,
          },
          legend: {
            data: ["估算库存", "预计消耗"],
            bottom: "0",
            textStyle: {
              color: "#666",
            },
          },
          xAxis: {
            show: false,
            type: "value",
            max: function (value) {
              return value.max * 1.2;
            },
            splitLine: {
              lineStyle: {
                color: "rgba(255,255,255,0.2)",
              },
            },
            axisTick: {
              show: false,
            },
            axisLine: {
              //  改变x轴颜色
              lineStyle: {
                color: "#3c4654",
              },
            },
            axisLabel: {
              //  改变x轴字体颜色和大小
              textStyle: {
                color: "#666",
              },
            },
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
                fontSize: fontSize(14),
              },
              splitLine: {
                show: true,
              },
              axisTick: {
                show: false,
              },
              axisLine: {
                show: false,
                //  改变y轴颜色
                lineStyle: {
                  color: "#3c4654",
                },
              },
              axisLabel: {
                //  改变y轴字体颜色和大小
                //formatter: '{value} m³ ', //  给y轴添加单位
                textStyle: {
                  color: "#666",
                  fontSize: fontSize(12),
                },
              },
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
                fontSize: fontSize(14),
              },
              axisTick: "none",
              axisLine: "none",
              show: true,
              axisLabel: {
                textStyle: {
                  color: "#666",
                  fontSize: fontSize(12),
                },
              },
              data: [200, 200, 200, 100, 100, 400, 100],
            },
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
                      color: "#666666",
                    },
                  },
                  color: "#0084BD",
                  borderWidth: 0,
                  // barBorderRadius: [0, 30, 30, 0] //圆角大小
                },
              },
              data: [1000, 600, 1000, 900, 800, 1000, 500],
              barWidth: fontSize(10),
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
                      color: "#666666",
                    },
                  },
                  color: "#E87171",
                  borderWidth: 0,
                  // barBorderRadius: [0, 30, 30, 0] //圆角大小
                },
              },
              data: [800, 400, 800, 800, 700, 600, 400],
              barWidth: fontSize(10),
            },
          ],
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
              fontStyle: "normal",
            },
          },
          grid: {
            left: "2%",
            right: "2%",
            bottom: "10%",
            containLabel: true,
          },
          legend: {
            //图例组件，颜色和名字
            bottom: "0",
            itemGap: fontSize(72),
            itemWidth: fontSize(12),
            itemHeight: fontSize(12),
            data: [
              {
                name: "昨日",
              },
              {
                name: "今日",
              },
            ],
            textStyle: {
              color: "#666666",
              fontStyle: "normal",
              fontSize: fontSize(14),
            },
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
                "采购员A",
              ],
              axisLabel: {
                //坐标轴刻度标签的相关设置。
                interval: 0, //设置为 1，表示『隔一个标签显示一个标签』
                margin: fontSize(12),
                textStyle: {
                  color: "#666666",
                  fontStyle: "normal",
                  fontSize: fontSize(14),
                },
              },
              axisTick: {
                //坐标轴刻度相关设置。
                show: false,
              },
              axisLine: {
                //坐标轴轴线相关设置
                lineStyle: {
                  color: "#D9DFF3",
                },
              },
              splitLine: {
                //坐标轴在 grid 区域中的分隔线。
                show: false,
              },
            },
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
                  fontSize: fontSize(12),
                },
              },
              nameTextStyle: {
                fontWeight: "bold",
                fontSize: fontSize(14),
                align: "right",
                color: "#333",
              },
              axisLine: {
                show: true,
                lineStyle: {
                  color: "#D9DFF3",
                },
              },
              axisTick: {
                show: false,
              },
              splitLine: {
                show: true,
                lineStyle: {
                  color: ["#F5F7FE"],
                },
              },
            },
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
                15600, 17500, 20000, 8000, 24500, 17500, 12500, 21000, 15000,
                5100,
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
                    fontSize: fontSize(8),
                  },
                },
              },
              itemStyle: {
                normal: {
                  show: true,
                  color: "#01E197",
                  barBorderRadius: [50, 50, 0, 0],
                  borderWidth: 0,
                },
              },
            },
            {
              name: "今日",
              type: "bar",
              data: [
                12500, 18000, 16000, 7500, 28000, 14800, 8000, 18000, 17000,
                5000,
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
                    fontSize: fontSize(8),
                  },
                },
              },
              itemStyle: {
                normal: {
                  show: true,
                  color: "#1A8CDD",
                  barBorderRadius: [40, 40, 0, 0],
                  borderWidth: 0,
                },
              },
            },
          ],
        },
        {
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b}: {c} ({d}%)",
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
              fontSize: fontSize(14),
            },
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
                  formatter: "{c}",
                },
              },
              data: [
                { value: 1244, name: "异常超订金额" },
                { value: 254, name: "正常超订金额" },
              ],
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
        .catch((_) => { });
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
            if (n.children && n.children.length != 0) {
              n.children.forEach((x) => {
                this.verifyDta(x);
              });
            }
          });

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
        this.adminLoading = false;
        if (this.newTag != -1) {
          this.tableColumns.splice(this.newTag, 1);
        }
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
          dangerouslyUseHTMLString: true,
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
        console.log(this.chartData1, "this.chartData2[0]");
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
  },
};
</script>
<style lang="scss" scoped>
* {
  box-sizing: border-box;
}

.el-main {
  padding: 16px;

  .firstNode {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;

    .leftCard {
      width: 70%;
      margin-right: 16px;

      .headCard {
        display: flex;
        justify-content: space-between;
        margin-bottom: 16px;

        .box {
          display: flex;
          // width: calc(25% - 16px);
          width: calc(25% - 16px);
          height: 160px;
          border: 1px solid #d5d6ff;
          box-shadow: 1px 1px 10px rgba(122, 125, 255, 0.1);
          border-radius: 14px;

          .icon {
            display: flex;
            justify-content: flex-end;
            width: 20%;
            padding: 40px 0px 0px 0px;

            img {
              width: 40px;
              height: 40px;
            }
          }

          .textBox {
            width: 80%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 40px 0px 40px 0px;

            .textHead {
              padding: 0 20px;
              display: flex;
              justify-content: space-between;
              align-items: center;

              .title {
                font-weight: 400;
                font-size: 20px;
                line-height: 25px;
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
              padding: 0 20px;
              font-size: 26px;
              font-weight: 400;
              color: #ffffff;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
        }

        .blue {
          background: linear-gradient(270.06deg,
              #2e56e6 1.04%,
              rgba(0, 56, 255, 0.42) 125.5%);
        }

        .green {
          background: linear-gradient(270.35deg,
              #01c283 2.09%,
              rgba(1, 194, 131, 0.6) 99.72%);
        }

        .purple {
          background: linear-gradient(269.62deg,
              #7b3afe 0.33%,
              rgba(136, 77, 255, 0.62) 99.7%);
        }

        .red {
          background: linear-gradient(270.08deg,
              #ee4264 0.89%,
              rgba(255, 112, 140, 0.83) 99.94%);
        }
      }

      .itemCard {
        height: 520px;
        border-radius: 14px;
        background: #ffffff;
        display: flex;
        flex-direction: column;
        width: 100%;
      }
    }

    .rightCard {
      width: 30%;

      .itemCard {
        height: 100%;
        border-radius: 14px;
        background: #ffffff;
        display: flex;
        flex-direction: column;
        width: 100%;
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
      font-size: 20px;
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
    flex: 1;
    padding: 20px;
    width: 100%;
  }

  .rowChart2 {
    justify-content: space-between;
    margin-bottom: 16px;
    display: flex;

    .itemCard {
      height: 468px;
      border-radius: 14px;
      background: #ffffff;
      display: flex;
      flex-direction: column;
      width: 100%;
    }

    .itemCard:nth-child(1) {
      width: 70%;
      margin-right: 16px;
    }

    .itemCard:nth-child(2) {
      width: 30%;
    }
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
