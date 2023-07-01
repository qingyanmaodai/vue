<!--补焊报工-->
<template>
  <div
    class="container"
    v-loading="adminLoading"
  >
    <div
      class="admin_head"
      ref="headRef"
    >
      <div
        v-for="(item,i) in 3"
        :key="i"
        v-show="labelStatus1 == i"
      >
        <ComSearch
          ref="searchRef"
          :searchData="formSearchs[i].datas"
          :searchForm="formSearchs[i].forms"
          :remark="i"
          :signName="labelStatus1"
          :isLoading="isLoading"
          :btnForm="btnForm"
          @btnClick="btnClick"
        />
      </div>
    </div>
    <div>
      <div class="admin_content">
        <div class="ant-table-title">
          <el-row>
            <el-col :span="4"><span class="title">{{ title }}</span></el-col>
            <el-col
              :span="20"
              class="flex_flex_end"
            >
              <div
                :class="labelStatus1 == y ? 'statusActive cursor' : 'cursor'"
                v-for="(item, y) in Status1"
                :key="y"
              >
                <span @click="changeStatus(item, y)">{{ item.label }}</span>
                <el-divider direction="vertical"></el-divider>
              </div>
            </el-col>
          </el-row>
        </div>
        <div
          v-for="(x,y) in 3"
          :key="y"
          v-show="labelStatus1 == y"
        >
          <ComVxeTable
            :rowKey="'RowNumber'"
            :height="height"
            :tableData="tableData[y]"
            :tableHeader="tableColumns[y]"
            :hasSelect="hasSelect[y]"
            :tableLoading="tableLoading[y]"
            :remark="y"
            :sysID="sysID[y].ID"
            :isClear="isClear[y]"
            :cellStyle="cellStyle0"
            :pagination="tablePagination[y]"
             @selectfun="selectFun"
            @pageChange="pageChange"
            @pageSize="pageSize"
            @sortChange="sortChange"
          />
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import ComSearch from "@/components/ComSearch";
import ComVxeTable from "@/components/ComVxeTable";
import { GetHeader, GetSearchData, ExportData, SaveData } from "@/api/Common";
import { Alert } from 'element-ui';
export default {
  name: "PCBPlanProduction_BH",
  components: {
    ComSearch,
    ComVxeTable,
  },
  data() {
    return {
      ////////////////// Search /////////////////
      labelStatus1: 0,
      hasSelect: [true, true, false],
      Status1: [
        {
          label: "日计划",
          value: 0,
        },
        {
          label: "报工记录",
          value: 1,
        },
        {
          label: "历史报工记录",
          value: 2,
        },
      ],
      title: this.$route.meta.title,
      dialogVisible: false,
      drawer: false,
      formSearchs: [
        {
          datas: {ProcessName:'SMT'},
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
      parmsBtn: [
        // {
        //   ButtonCode: "save",
        //   BtnName: "提交报工",
        //   Type: "success",
        //   Ghost: true,
        //   Size: "small",
        //   signName: 0,
        //   Methods: "addData",
        //   Icon: "",
        // },
        {
          ButtonCode: "save",
          BtnName: "保存",
          Type: "success",
          Ghost: true,
          Size: "small",
          signName: 1,
          Methods: "dataSave",
          Icon: "",
        },
      ],
      btnForm: [],
      tableData: [[], [], []],
      tableColumns: [[], [], []],
      tableLoading: [false, false, false],
      isClear: [false, false, false],
      tablePagination: [
        {
          pageIndex: 1,
          pageSize: 0,
          pageTotal: 0,
        },
        {
          pageIndex: 1,
          pageSize: 200,
          pageTotal: 0,
        },
        {
          pageIndex: 1,
          pageSize: 200,
          pageTotal: 0,
        },
      ],
      height: "707px",
      showPagination: true,
      tagRemark: 0,
      isLoading: false,
      adminLoading: false,
      parseForm: {},
      parseSearch: false,
      sysID: [
        {
          ID: 6688,
        },
        {
            ID: 7907,
          },
          {
            ID: 7909,
          },
      ],
      selectionData: [[], [], []],
      currentDay:
        new Date().getFullYear() +
        (new Date().getMonth() + 1) +
        new Date().getDate(),
    };
  },
  watch: {},
  created() {
    this.getTableHeader();
    this.judgeBtn();
  },
  mounted() {
    setTimeout(() => {
      this.setHeight();
    }, 450);
  },
  methods: {
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
    // 行内样式 红ff7b7b 黄fdfd8f 绿9fff9f
    cellStyle0({ row, column }) {},
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
    // 保存
    async dataSave(remarkTb) {
      if (this.tableData[0].length == 0) {
        this.$message.error("暂无可保存的数据！");
      } else {
        let flag = this.tableData[0].map((a) => {
          !a.ProducedQty || parseFloat(a.ProducedQty == 0);
        }); // 判断必填报工数
        if (flag.length == 0) {
          for (let item of this.tableData[0].values()) {
            item["dicID"] = 5586;
            item["ProducedDate"] = item.PlanDay;
          }
          console.log(this.tableData[0]);
          let res = await SaveData(this.tableData[0]);
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
        }
      }
    },
    // 获取表头数据
    async getTableHeader() {
      let IDs = this.sysID;
      let res = await GetHeader(IDs);
      const { datas, forms, result, msg } = res.data;
      if (result) {
        // 获取每个表头
        datas.some((m, i) => {
          m.forEach((n) => {
            // 进行验证
            this.verifyDta(n);
            if (n.childrens && n.children.length != 0) {
              n.childrens.forEach((x) => {
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
        this.formSearchs[0].datas["ProcessID"] = "P202009092233413";
        this.formSearchs[1].datas["ProducedDate"] = this.currentDay;
        this.dataSearch(0);
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
        form["ProcessID"]="P202009092233413";
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
    // 改变状态
    changeStatus(item, index) {
      this.labelStatus1 = index;
      if (this.tableData[index].length == 0) {
        this.dataSearch(index);
      }
    },
    // 选择数据
    selectFun(data, remarkTb, row) {
   
      this.selectionData[remarkTb] = data;
    },
    async addData(val) {
      if (this.selectionData[0].length == 0) {
        this.$message.error("请选择需要操作的数据！");
      } else {
        let newData = JSON.parse(JSON.stringify(this.selectionData[0]));
        // this.$refs.dialog_1.$refs.vxeTable.clearCheckboxRow();
        // this.selectionData[0] = [];
        for(var a of newData)
        {
    if (a["ProductionQty"] > a["ProcessOweQty"]) {
            this.$message.error("报工数不能大于欠数！");
            return;
          }
          a["dicID"] = 5586;
          a["ProducedDate"] = a.PlanDay;
        }
        
        this.adminLoading = true;
        let res = await SaveData(newData);
        this.adminLoading = false;
        if (res.data.result) {
          this.dataSearch(0);
          this.dataSearch(1);
        } else {
          this.$message.error(res.data.msg);
        }
      }
    },
    // 添加数据
    // async addData(val) {
    //   if (this.selectionData[1].length == 0) {
    //     this.$message.error("请选择需要操作的数据！");
    //   } else {

    //     let newData = JSON.parse(JSON.stringify(this.selectionData[1]));
    //     this.$refs.dialog_1.$refs.vxeTable.clearCheckboxRow();
    //     this.selectionData[1] = [];
    //     newData.forEach((a) => {

    //       if (a["ProductionQty"] > a["ProcessOweQty"]) {
    //         this.$message.error("报工数不能大于欠数！");
    //         return;
    //       }
    //       a["dicID"] = 5586;
    //       a["ProducedDate"] = a.PlanDay;
    //       // if (
    //       //   this.tableData[0].findIndex((b) => b.DayPlanID == a.DayPlanID) == -1
    //       // ) {
    //       //   a["update"] = true;
    //       //  // a["ProductionQty"]=a["HasQty"]

    //       //   this.tableData[0].push(a);
    //       // }
    //     });
    //     this.adminLoading = true;
    //     let res = await SaveData(newData);
    //     this.adminLoading = false;
    //     if (res.data.result) {
    //       this.dialogVisible = val;
    //       this.dataSearch(1)
    //       this.dataSearch(0)
    //     } else {
    //       this.$message.error(res.data.msg);
    //     }

    //   }
    // },
  },
};
</script>
