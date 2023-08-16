<!--分配拉线-->
<template>
  <div class="container" v-loading="adminLoading">
    <div class="up_admin">
      <div class="admin_head" ref="headRef">
        <ComSearch
          ref="searchRef"
          :searchData="formSearchs[0].datas"
          :searchForm="formSearchs[0].forms"
          :remark="0"
          :isLoading="isLoading[0]"
          :btnForm="btnForm[0]"
          @btnClick="btnClick"
        />
      </div>
      <div>
        <div class="admin_content">
          <div class="ant-table-title">
            <el-row>
              <el-col :span="3"
                ><span class="title">{{ title }}</span></el-col
              >
              <el-col :span="21" class="flex_flex_end">
                <el-radio-group v-model="isJudje" @change="changeRadio">
                  <el-radio :label="0">多对一模式</el-radio>
                  <el-radio :label="1">一对多模式</el-radio>
                  <el-radio :label="2">一对一模式</el-radio>
                </el-radio-group>
                <el-divider direction="vertical"></el-divider>
                <div
                  :class="tagProcess == y ? 'statusActive cursor' : 'cursor'"
                  v-for="(item, y) in processs"
                  :key="y"
                >
                  <span @click="TagSearchDataProcess('tagProcess', item, y)"
                    >{{ item.ProcessName }}
                    <el-divider direction="vertical"></el-divider>
                  </span>
                </div>
              </el-col>
            </el-row>
          </div>
          <ComUmyTable
            v-for="(x, y) in domainList"
            :key="y"
            v-show="y == tagProcess"
            :ref="`domainRef${y}`"
            :rowKey="'RowNumber'"
            :height="'335px'"
            :tableData="domainList[y]"
            :tableHeader="tableColumns[0]"
            :tableLoading="domainLoading[y]"
            :remark="0"
            :isMultiple="isMultiple"
            :sysID="6657"
            :hasSelect="true"
            :pagination="domainPagination[y]"
            @pageChange="domainPagechange"
            @pageSize="domainpageSize"
            @sortChange="domainsortchange"
            @selectfun="domainselctfun"
          />
        </div>
      </div>
    </div>

    <div class="down_admin">
      <div>
        <div class="admin_content">
          <div class="ant-table-title">
            <el-row>
              <el-col :span="4"
                ><span class="title">{{ title2 }}</span></el-col
              >
              <el-col :span="20" class="flex_flex_end">
                <el-button size="mini" type="primary" @click="domainComputed"
                  >计算开拉期</el-button
                >
                <el-divider direction="vertical"></el-divider>
                <el-button size="mini" type="success" @click="domainScheduling"
                  >指派任务到日计划中</el-button
                >
              </el-col>
            </el-row>
          </div>

          <ComUmyTable
            v-for="(m, n) in domainList2"
            :key="n"
            v-show="n == tagProcess"
            :ref="`domainRef2${n}`"
            :rowKey="'RowNumber'"
            :height="height2"
            :tableData="domainList2[n]"
            :tableHeader="tableColumns[1]"
            :remark="1"
            :isMultiple="isMultiple2"
            :sysID="6658"
            :showPagination="false"
            :hasSelect="true"
            :pagination="domainPagination2[n]"
            @editDate="editDate"
            @selectfun="domainselctfun2"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
var _this;
import ComSearch from "@/components/ComSearch";
import ComUmyTable from "@/components/ComUmyTable";
import ComVxeTable from "@/components/ComVxeTable";
import {
  GetHeader,
  GetSearchData,
  ExportData,
  UpdateProcess,
  SaveData,
} from "@/api/Common";
import {
  OneStepReleaseByOrder,
  SaveSchedulingV2,
  computedStartDate,
} from "@/api/PageTwoScheduling";
export default {
  name: "LineInfo",
  components: {
    ComSearch,
    ComUmyTable,
    ComVxeTable,
  },
  data() {
    return {
      adminLoading: false,
      domainList: [],
      domainList2: [],
      domainLoading: [],
      domainPagination: [],
      domainPagination2: [],
      domainselection: [],
      domainselection2: [],
      isMultiple: true,
      isMultiple2: false,
      isJudje: 0,
      tagProcess: 1,
      processs: [],
      signName10: 31,
      ////////////////// Search /////////////////
      title: "1.请选择要指派的工序任务",
      title2: "2.请选择匹配的生产资源",
      drawer: false,
      formSearchs: [
        {
          datas: {},
          forms: [],
        },
        {
          datas: {},
          forms: [],
        },
      ],
      btnForm: [],
      parmsBtn: [
        {
          ButtonCode: "backOrder",
          BtnName: "退回",
          Type: "danger",
          Ghost: true,
          Size: "small",
          Methods: "returnHasSetData",
          Icon: "",
          isLoading: false,
          signName: 2,
        },
      ],
      tableData: [[], []],
      tableColumns: [[], []],
      tableLoading: [false, false],
      isClear: [false, false],
      tablePagination: [
        { pageIndex: 1, pageSize: 200, pageTotal: 0 },
        { pageIndex: 1, pageSize: 0, pageTotal: 0 },
      ],
      height: "707px",
      height2: "200px",
      tagRemark: 0,
      isLoading: false,
      isEdit: false,
    };
  },
  watch: {},
  created() {
    _this = this;
    this.adminLoading = true;
    this.judgeBtn();
    this.getTableHeader();
    this.getProcesssData();
  },
  mounted() {
    setTimeout(() => {
      this.setHeight();
    }, 600);
  },
  methods: {
    // 高度控制
    setHeight() {
      let headHeight = this.$refs.headRef.offsetHeight;
      let newHeight = null;
      let rem =
        (document.documentElement.clientHeight -
          headHeight -
          this.$store.getters.reduceHeight) /
        2;
      if (this.$store.getters.reduceHeight == 138) {
        newHeight = rem - 105 + "px";
      } else {
        newHeight = rem - 72 + "px";
      }
      this.height2 = newHeight;
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
      if (this.domainList[this.tagProcess].length == 0 || remarkTb == 0) {
        this.domainPagination[this.tagProcess].pageIndex = 1;
        let newRef = "domainRef" + this.tagProcess;
        if (this.$refs[newRef]) {
          this.$refs[newRef][0].$refs.plxTable.clearSelection();
        }
        this.getFirstData(this.formSearchs[0].datas, this.tagProcess);
        this.getUsingLineData();
      } else {
        return;
      }
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
    // 获取表头数据
    async getTableHeader() {
      let IDs = [{ ID: 6657 }, { ID: 6658 }];
      let res = await GetHeader(IDs);
      const { datas, forms, result, msg } = res.data;
      if (result) {
        // 获取每个表头
        datas.some((m, i) => {
          m.forEach((n) => {
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
    async getFirstData(form, index) {
      form["dicID"] = 6657;
      form["rows"] = this.domainPagination[index].pageSize;
      form["page"] = this.domainPagination[index].pageIndex;
      this.domainLoading[index] = true;
      this.domainList[index] = [];
      let res = await GetSearchData(form);
      const { result, data, count, msg } = res.data;
      if (result) {
        _this.$set(_this.domainList, index, data);
        _this.$set(_this.domainPagination[index], "pageTotal", count);
        _this.domainLoading[index] = false;
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
        _this.domainLoading[index] = false;
      }
    },

    ////////////////////其他事件////////////////////
    // 退回 分配拉线
    returnHasSetData() {
      if (this.domainselection[this.tagProcess].length == 0) {
        this.$message.error("未选择需要退回的数据！");
      } else {
        this.$confirm(
          "此操作仅在未排到日计划时生效。如已排到日计划需要在日计划手工删除后才会生效！",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        )
          .then(async () => {
            let res = await BackOrderNo2(form);
            const { result, data, count, msg } = res.data;
            if (result) {
              _this.$message({
                message: msg,
                type: "success",
                dangerouslyUseHTMLString: true,
              });
              let newRef = "domainRef" + _this.tagProcess;
              if (_this.$refs[newRef]) {
                _this.$refs[newRef][0].$refs.plxTable.clearSelection();
              }
              _this.getFirstData(_this.formSearchs[0].datas, _this.tagProcess);
            } else {
              this.$message({
                message: msg,
                type: "error",
                dangerouslyUseHTMLString: true,
              });
            }
          })
          .catch(() => {});
      }
    },
    // 切换模式
    changeRadio(val) {
      this.$confirm("切换模式会清空选中的数据,请注意！")
        .then(() => {
          _this.isJudje = val;
          for (var i = 0; i < _this.processs.length; i++) {
            let newRef = "domainRef" + i;
            let newRef2 = "domainRef2" + i;
            if (_this.$refs[newRef].length != 0) {
              _this.$refs[newRef][0].$refs.plxTable.clearSelection();
            }
            if (_this.$refs[newRef2].length != 0) {
              _this.$refs[newRef2][0].$refs.plxTable.clearSelection();
            }
            _this.domainselection[i] = [];
            _this.domainselection2[i] = [];
            _this.domainList2[i].forEach((m) => {
              m.DistributionQty = null;
              m.StartDate = null;
              m.EndDate = null;
            });
          }
          if (val == 0) {
            _this.isMultiple = true;
            _this.$set(_this, "isMultiple2", false);
          } else if (val == 1) {
            _this.isMultiple = false;
            _this.$set(_this, "isMultiple2", true);
          } else {
            _this.isMultiple = false;
            _this.$set(this, "isMultiple2", false);
          }
        })
        .catch(() => {
          if (this.isMultiple && !this.isMultiple2) {
            this.isJudje = 0;
          } else if (!this.isMultiple && this.isMultiple2) {
            this.isJudje = 1;
          } else {
            this.isJudje = 2;
          }
        });
    },
    // 计算开拉期
    async domainComputed() {
      if (this.domainselection[this.tagProcess].length == 0) {
        this.$message.warning("请先选择工序任务！");
        return;
      } else if (this.domainselection[this.tagProcess].length == 0) {
        this.$message.warning("请先选择生产线！");
        return;
      } else {
        let newFlag = 0;
        this.domainselection2[this.tagProcess].some((x) => {
          //  if (x.StartDate && x.DistributionQty) {
          if (x.DistributionQty) {
          } else {
            this.$message.warning(x.OrganizeName + "分配数！");
            newFlag = 1;
            return true;
          }
        });
        if (newFlag == 1) {
          return;
        }
        let newData = [];
        let newDistribute = 0;

        if (this.isJudje == 1) {
          // 1对多
          let num = 0;
          this.domainselection2[this.tagProcess].forEach((x) => {
            num += parseFloat(x.DistributionQty);
          });
          if (
            num > parseFloat(this.domainselection[this.tagProcess][0].PlanQty)
          ) {
            this.$message.warning("分配数总计大于计划数！");
            return;
          } else {
            this.domainselection2[this.tagProcess].forEach((x) => {
              let obj = JSON.parse(
                JSON.stringify(this.domainselection[this.tagProcess][0])
              );
              obj.StartDate = x.StartDate;
              obj.DistributionQty = x.DistributionQty;
              obj["TotalPeoples"] = x.TotalPeoples;
              obj["LineID"] = x.OrganizeID;
              obj["RowNumber"] = x.RowNumber;
              newData.push(obj);
            });
          }
        } else {
          // 多对1跟1对1

          this.domainselection[this.tagProcess].forEach((x) => {
            newDistribute += parseFloat(x.PlanQty);
            let obj = x;
            obj["StartDate"] =
              this.domainselection2[this.tagProcess][0].StartDate;
            obj["TotalPeoples"] =
              this.domainselection2[this.tagProcess][0].TotalPeoples;
            obj["LineID"] =
              this.domainselection2[this.tagProcess][0].OrganizeID;
            newData.push(obj);
          });
        }

        let res = await computedStartDate(newData);
        const { result, data, count, msg } = res.data;
        if (result) {
          if (_this.isJudje == 0 || _this.isJudje == 2) {
            let maxDate = null;
            let ExpectTime = 0;
            data.some((m) => {
              let newRow = _this.domainselection[_this.tagProcess].filter(
                (n) => {
                  return n.RowNumber == m.RowNumber;
                }
              );
              if (newRow) {
                // 只更新完工日期
                newRow[0].EndDate = m.EndDate;
                newRow[0].StartDate = m.StartDate;
                newRow[0].ExpectTime = m.ExpectTime;
                // newRow[0].ProcessingHour = m.ExpectTime;
                //for (name in m) {
                //    newRow[0][name] = m[name]
                //}
              }
              if (
                maxDate &&
                new Date(m.EndDate).getTime() < new Date(maxDate).getTime()
              ) {
                maxDate = maxDate;
              } else {
                maxDate = m.EndDate;
              }
              ExpectTime += parseFloat(m.ExpectTime);
            });
            _this.domainselection2[_this.tagProcess][0].ProcessingHour =
              ExpectTime;
            _this.domainselection2[_this.tagProcess][0].EndDate = maxDate;
          } else if (_this.isJudje == 1) {
            let maxDate = null;
            data.forEach((m) => {
              if (
                maxDate &&
                new Date(m.EndDate).getTime() < new Date(maxDate).getTime()
              ) {
                maxDate = maxDate;
              } else {
                maxDate = m.EndDate;
              }
              let newIndex = _this.domainselection2[_this.tagProcess].findIndex(
                (n) => {
                  return n.OrganizeID == m.LineID;
                }
              );
              if (newIndex != -1) {
                _this.domainselection2[_this.tagProcess][newIndex].EndDate =
                  m.EndDate;
              }
            });
            _this.domainselection[_this.tagProcess][0].EndDate = maxDate;
          } else {
            _this.domainselection2[_this.tagProcess][0].EndDate =
              data[0].EndDate;
            _this.domainselection[_this.tagProcess][0].EndDate =
              data[0].EndDate;
          }
        } else {
          this.$message({
            message: msg,
            type: "error",
            dangerouslyUseHTMLString: true,
          });
          _this.adminLoading = false;
        }
      }
    },
    // 任务指派
    async domainScheduling() {
      debugger;
      if (this.domainselection[this.tagProcess].length == 0) {
        this.$message.warning("请先选择工序任务！");
        return;
      } else if (this.domainselection[this.tagProcess].length == 0) {
        this.$message.warning("请先选择生产线！");
        return;
      } else {
        let flag = 0;
        let newData = [];
        if (this.isJudje == 1) {
          // 1对多
          if (this.domainselection[this.tagProcess][0].EndDate) {
            this.domainselection2[this.tagProcess].some((x) => {
              if (x.EndDate) {
                let obj = JSON.parse(
                  JSON.stringify(this.domainselection[this.tagProcess][0])
                );
                obj["StartDate"] = x.StartDate;
                obj["EndDate"] = x.EndDate;
                obj["DistributionQty"] = x.DistributionQty;
                obj["TotalPeoples"] = x.TotalPeoples;
                obj["LineID"] = x.OrganizeID;
                obj["LineName"] = x.OrganizeName;

                newData.push(obj);
              } else {
                this.$message.warning(x.OrganizeName + "无完工日期！");
                flag = 1;
                return true;
              }
            });
          } else {
            this.$message.warning("该工序任务无完工日期！");
            return;
          }
        } else {
          if (this.domainselection2[this.tagProcess][0].EndDate) {
            this.domainselection[this.tagProcess].some((x) => {
              if (x.EndDate) {
                this.domainselection2[this.tagProcess].some((y) => {
                  let obj2 = y;
                  x["LineID"] = y.OrganizeID;
                  x["LineName"] = y.OrganizeName;
                  newData.push(x);
                });
              } else {
                this.$message.warning(x.OrderNo + "无完工日期！");
                flag = 1;
                return true;
              }
            });
          } else {
            this.$message.warning("更改线请重新计算开工期再指派！");
            return;
          }
        }
        if (flag == 0) {
          this.adminLoading = true;
          let res = await SaveSchedulingV2(newData);

          const { result, data, count, msg } = res.data;
          if (result) {
            _this.$message({
              message: msg,
              type: "success",
              dangerouslyUseHTMLString: true,
            });
            let newRef = "domainRef" + _this.tagProcess;
            let newRef2 = "domainRef2" + _this.tagProcess;
            _this.$refs[newRef][0].$refs.plxTable.clearSelection();
            _this.$refs[newRef2][0].$refs.plxTable.clearSelection();
            _this.dataSearch(0);
            _this.adminLoading = false;
          } else {
            this.$message({
              message: msg,
              type: "error",
              dangerouslyUseHTMLString: true,
            });
            _this.adminLoading = false;
          }
        }
      }
    },
    // 获取工序
    async getProcesssData() {
      let res = await GetSearchData({ dicID: 6659 });
      const { result, data, count, msg } = res.data;
      if (result) {
        _this.$set(_this, "processs", data);
        _this.processs.unshift({ ProcessID: "", ProcessName: "全部" });
        if (_this.processs.length != 0) {
          // 创建数据
          _this.createdData(data.length);
          _this.getUsingLineData();
        }
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
    },
    // 创建数据
    createdData(length) {
      for (var i = 0; i < length; i++) {
        this.$set(this.domainList, i, []);
        this.$set(this.domainList2, i, []);
        this.$set(this.domainselection, i, []);
        this.$set(this.domainselection2, i, []);
        this.$set(this.domainLoading, i, false);
        this.$set(this.domainPagination, i, {
          pageTotal: 0,
          pageIndex: 1,
          pageSize: 32,
        });
        this.$set(this.domainPagination2, i, { pageTotal: 0 });
      }
      this.formSearchs[0].datas.ProcessID = this.processs[1].ProcessID;
      this.getFirstData(this.formSearchs[0].datas, 1);
      this.adminLoading = false;
    },
    // 获取生产线
    async getUsingLineData() {
      let res = await GetSearchData({ dicID: 6658 });
      const { result, data, count, msg } = res.data;
      if (result) {
        console.log(_this.processs);
        console.log(data);
        _this.processs.some((m, index) => {
          if (index == 0) {
            _this.domainList2[0] = [];
          } else {
            let newData = [];
            newData = data.filter((n) => {
              return n.ProcessID == m.ProcessID;
            });
            _this.$set(_this.domainList2, index, newData);
            _this.$set(
              _this.domainPagination2[index],
              "pageTotal",
              newData.length
            );
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
    // 编辑日期
    editDate(row, value, prop, index) {
      if (this.domainselection[this.tagProcess].length == 0) {
        this.$message.error("请先选择要指派的工序任务！");
        row[prop] = "";
      }
      if (this.domainselection2[this.tagProcess].length == 0) {
        this.$message.error("请先选择生产线！");
        row[prop] = "";
      }
    },
    // 分页
    domainpageSize(val) {
      this.$set(this.domainPagination[this.tagProcess], "pageSize", val);
      this.getFirstData(this.formSearchs[0].datas, this.tagProcess);
    },
    domainPagechange(val) {
      this.$set(this.domainPagination[this.tagProcess], "pageIndex", val);
      this.getFirstData(this.formSearchs[0].datas, this.tagProcess);
    },
    // 排序
    domainsortchange(order, prop, remarkTb, filtertb, row, index) {
      if (filtertb == -100) {
        // 改变父表格的行数据
        this.changeTableRowData(remarkTb, row, index);
        return;
      }
      if (order) {
        if (order === "descending") {
          this.formSearchs[0].datas["sort"] = prop + " DESC";
        } else {
          this.formSearchs[0].datas["sort"] = prop + " ASC";
        }
      } else {
        this.formSearchs[0].datas["sort"] = null;
      }
      this.formSearchs[0].datas["ProcessID"] =
        this.processs[this.tagProcess].ProcessID;
      this.getFirstData(this.formSearchs[0].datas, this.tagProcess);
    },
    // 改变父组件表格行数据
    changeTableRowData(remarkTb, row, index) {
      for (var name in row) {
        this.$set(this.tableDatas[remarkTb][index], name, row[name]);
      }
    },
    // 选择数据
    domainselctfun(data, remarkTb, row) {
      this.domainselection[this.tagProcess] = data;
      if (this.isJudje == 1) {
        this.domainList[this.tagProcess].forEach((n) => {
          n.EndDate = null;
        });
      } else if (this.isJudje == 0) {
        let num = 0;
        this.domainselection[this.tagProcess].forEach((m) => {
          debugger;
          num += parseFloat(m.DistributionQty);
        });
        if (this.domainselection2[this.tagProcess].length != 0) {
          this.domainselection2[this.tagProcess][0].DistributionQty = num;
          this.domainselection2[this.tagProcess][0].StartDate = "";
        }
      }
      // 选择数据就将最小工序开拉期放进线别的工序开拉期
      this.setMinStartDate();
    },
    // 选择数据
    domainselctfun2(data, remarkTb, row) {
      this.$set(this.domainselection2, this.tagProcess, data);
      if (data[0]) {
        if (this.isJudje != 1) {
          this.domainList2[this.tagProcess].forEach((n) => {
            n.StartDate = null;
            n.EndDate = null;
          });
          if (this.isJudje == 0) {
            if (this.domainselection[this.tagProcess].length != 0) {
              let num = 0;
              this.domainselection[this.tagProcess].forEach((m) => {
                num += parseFloat(m.DistributionQty);
              });
              data[0].DistributionQty = num;
            }
          } else {
            data[0].DistributionQty =
              this.domainselection[this.tagProcess][0].DistributionQty;
          }
        }
      }
      // 选择数据就将最小工序开拉期放进线别的工序开拉期
      this.setMinStartDate();
    },
    // 切换工序
    TagSearchDataProcess(name, item, index) {
      setTimeout(() => {
        _this.formSearchs[0].datas["ProcessID"] = item.ProcessID;
        _this.search();
        _this[name] = index;
      }, 200);
    },
    //查询
    search(type) {
      if (this.domainList[this.tagProcess].length == 0 || type == 1) {
        this.domainPagination[this.tagProcess].pageIndex = 1;
        let newRef = "domainRef" + this.tagProcess;
        if (this.$refs[newRef]) {
          this.$refs[newRef][0].$refs.plxTable.clearSelection();
        }
        this.getFirstData(this.formSearchs[0].datas, this.tagProcess);
        this.getUsingLineData();
      } else {
        return;
      }
    },
    // 放上工序开拉期限制
    setMinStartDate() {
      let minDate = null;
      if (this.domainselection[this.tagProcess].length != 0) {
        this.domainselection[this.tagProcess].forEach((m) => {
          if (m.PreStartDate) {
            if (
              minDate &&
              new Date(m.PreStartDate).getTime() > new Date(minDate).getTime()
            ) {
              minDate = minDate;
            } else {
              minDate = m.PreStartDate;
            }
          }
        });
      }
      if (minDate) {
        if (this.domainselection2[this.tagProcess].length != 0) {
          this.domainselection2[this.tagProcess].forEach((n) => {
            this.$set(n, "PreStartDate", minDate);
          });
        }
      }
    },
  },
};
</script>
