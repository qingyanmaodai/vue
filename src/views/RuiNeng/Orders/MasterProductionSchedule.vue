<!--采购回复-->
<template>
  <div class="container flex_flex" v-loading="adminLoading">
    <el-container>
      <el-main style="padding:0;margin:0">
        <div class="admin_container_2" style="width:100%">
          <div class="admin_head" ref="headRef">
            <div
              v-for="i in [0, 1, 2, 3, 4]"
              :key="i"
              v-show="labelStatus1 == i"
            >
              <ComSearch
                ref="searchRef"
                :searchData="formSearchs[i].datas"
                :searchForm="formSearchs[i].forms"
                :remark="i"
                :isLoading="isLoading"
                :btnForm="btnForm"
                :signName="labelStatus1"
                @btnClick="btnClick"
              />
            </div>
          </div>
          <div>
            <div class="admin_content">
              <div class="ant-table-title">
                <el-row>
                  <el-col :span="4">
                    <i
                      class="el-icon-d-arrow-left"
                      v-show="showAside"
                      @click="showAside = !showAside"
                    ></i>
                    <i
                      class="el-icon-d-arrow-right"
                      v-show="!showAside"
                      @click="showAside = !showAside"
                    ></i>
                    <span class="title">{{ title }}</span>
                  </el-col>
                  <el-col :span="20" class="flex_flex_end">
                    <el-divider direction="vertical"></el-divider>
                    <div
                      :class="
                        labelStatus1 == y ? 'statusActive cursor' : 'cursor'
                      "
                      v-for="(item, y) in Status1"
                      :key="y"
                    >
                      <span @click="changeStatus(item, y)">{{
                        item.label
                      }}</span>
                      <el-divider direction="vertical"></el-divider>
                    </div>
                  </el-col>
                </el-row>
              </div>
              <div
                v-for="item in [0, 1, 2, 3, 4]"
                :key="item"
                v-show="labelStatus1 == item"
              >
                <ComVxeTable
                  :rowKey="'RowNumber'"
                  :ref="`tableRef${item}`"
                  :height="height"
                  :tableData="tableData[item]"
                  :tableHeader="tableColumns[item]"
                  :tableLoading="tableLoading[item]"
                  :isEdit="isEdit"
                  :hasSelect="hasSelect[item]"
                  :remark="item"
                  :cellStyle="cellStyle"
                  :sysID="sysID[item].ID"
                  :isClear="isClear[item]"
                  :footerLabel="footerLabel[item]"
                  :pagination="tablePagination[item]"
                  @pageChange="pageChange"
                  @pageSize="pageSize"
                  @selectfun="selectFun"
                  @sortChange="sortChange"
                />
              </div>
            </div>
          </div>
        </div>
      </el-main>
    </el-container>
    <el-dialog title="料品可用量查询" :visible.sync="dialogShow" width="50%">
      <div class="container" style="background-color: #f0f2f5;">
        <div class="admin_content">
          采购单
          <ComReportTable
            :rowKey="'RowNumber'"
            :height="height1"
            :tableData="tableData[1]"
            :tableHeader="tableColumns[1]"
            :tableLoading="tableLoading[1]"
            :remark="1"
            :sysID="sysID[1].ID"
            :isClear="isClear[1]"
            :showFooter="true"
            :pagination="tablePagination[1]"
            @pageChange="pageChange"
            @pageSize="pageSize"
            @sortChange="sortChange"
          />
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
var _this;
import XLSX from "xlsx";
import ComSearch from "@/components/ComSearch";
import ComAsideTree from "@/components/ComAsideTree";
import ComVxeTable from "@/components/ComVxeTable";
import ComReportTable from "@/components/ComReportTable";
import {
  GetHeader,
  GetSearchData,
  ExportData,
  GetSearch,
  SaveData,
  GetServerTime,
  GetOrgData,
  UpdateOrderBomPOTracker
} from "@/api/Common";
import ComFormDialog from "@/components/ComFormDialog";
export default {
  name: "MasterProductionSchedule",
  components: {
    ComSearch,
    ComAsideTree,
    ComVxeTable,
    ComReportTable,
    ComFormDialog
  },
  data() {
    return {
      CurrentSendQty: "",
      isLoading: false,
      hasSelect: [true, true, true, true, true],
      footerLabel: [""],
      dialogShow: false,
      height1: "360px",
      labelStatus1: 1,
      Status1: [
        { label: "分配数量", value: -1 },
        { label: "数量+时间+线体", value: 0 },
        { label: "数量+时间+线体+托盘", value: "" },
        { label: "综合分析", value: "" },
        { label: "全部", value: 1 }
      ],
      //////////////左侧树节点//////////////
      showAside: true,
      ReplyDate: "",
      ////////////////// Search /////////////////
      title: this.$route.meta.title,
      delData: [[]],
      formSearchs: [
        {
          datas: {},
          forms: []
        },
        {
          datas: {},
          forms: []
        },
        {
          datas: {},
          forms: []
        },
        {
          datas: {},
          forms: []
        },
        {
          datas: {},
          forms: []
        }
      ],
      selectionData: [[], [], [], [], []],
      btnForm: [],
      tableData: [[], [], [], [], []],
      tableColumns: [[], [], [], [], []],
      tableLoading: [false, false, false, false, false],
      isClear: [false, false, false, false, false],
      tablePagination: [
        { pageIndex: 1, pageSize: 1000, pageTotal: 0 },
        { pageIndex: 1, pageSize: 1000, pageTotal: 0 },
        { pageIndex: 1, pageSize: 1000, pageTotal: 0 },
        { pageIndex: 1, pageSize: 1000, pageTotal: 0 },
        { pageIndex: 1, pageSize: 1000, pageTotal: 0 }
      ],
      height: "707px",
      treeHeight: "765px",
      showPagination: true,
      tagRemark: 0,
      isEdit: false,
      clickData: {},
      isUpdate: true,
      adminLoading: false,
      dialogImport: false,
      fileList: [],
      file: [],
      sysID: [
        { ID: 10075 },
        { ID: 10075 },
        { ID: 10075 },
        { ID: 10075 },
        { ID: 10075 }
      ],
      userInfo: {}
    };
  },
  computed: {},
  created() {
    _this = this;
    this.userInfo = this.$store.getters.userInfo;
    // 获取所有按钮
    this.btnForm = this.$route.meta.btns;
    this.$common.judgeBtn(this, this.btnForm);
    this.getTableHeader();
  },
  mounted() {
    setTimeout(() => {
      this.setHeight();
    }, 500);
  },
  methods: {
    // 导出
    async dataExport(remarkTb) {
      this.adminLoading = true;
      let form = JSON.parse(JSON.stringify(this.formSearchs[remarkTb].datas));
      form["rows"] = 0;
      let res = await ExportData(form);
      this.adminLoading = false;
      this.$store.dispatch("user/exportData", res.data);
    },
    handleChanged(file, fileList) {
      var ext = file.name.substring(file.name.lastIndexOf(".") + 1);
      const extension = ext === "xlsx" || ext === "xls";
      if (!extension) {
        this.$message.error("上传文件格式只能为xlsx/xls");
        // 取消时在文件列表中删除该文件
        this.$refs.upload.handleRemove(file);
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 50;
      if (!isLt2M) {
        this.$message.error("上传文件大小不能超过 50MB!");
        // 取消时在文件列表中删除该文件
        this.$refs.upload.handleRemove(file);
        return false;
      } else {
        this.file = file;
        this.fileList = fileList;
      }
    },
    handleRemove(file) {
      this.fileList.splice(
        this.fileList.findIndex(item => item.url === file.url),
        1
      );
    },
    // 高度控制
    setHeight() {
      this.treeHeight = document.documentElement.clientHeight - 150 + "px";
      let headHeight = this.$refs.headRef.offsetHeight;

      let rem =
        document.documentElement.clientHeight -
        headHeight -
        this.$store.getters.reduceHeight;
      let newHeight = rem + "px";
      this.$set(this, "height", newHeight);
    },
    // 编辑行
    editRow(row) {},
    // 删除行
    delRow(row) {},
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
      this.$set(this.isClear, remarkTb, true);
      this.$set(this.tableLoading, remarkTb, true);
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
          if (this.formSearchs[remarkTb].forms.length) {
            // 判断是否是页面显示的查询条件，是的字段才清空
            this.formSearchs[remarkTb].forms.forEach(element => {
              if (element.prop === name) {
                this.formSearchs[remarkTb].datas[name] = null;
              }
            });
          }
        }
      }
    },
    // 保存
    async dataSave(remarkTb, index, parms, newData) {
      let res = null;
      this.adminLoading = true;
      if (remarkTb !== 3) {
      } else {
        if (newData && newData.length != 0) {
          res = await GetSearch(newData, "/APSAPI/SaveData10075");
        } else {
          res = await GetSearch(
            this.tableData[remarkTb],
            "/APSAPI/SaveData10075"
          );
        }
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
    // 从月计划更新
    async monthUpdata(remarkTb, index) {
      if (this.selectionData[remarkTb].length == 0) {
        this.$message.error("请选择需要提交的数据！");
        return;
      } else {
        let res = await GetSearch(
          this.selectionData[remarkTb],
          "/APSAPI/SaveData10075FromMonth"
        );
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
      }
    },
    // 删除
    // async dataDel(remarkTb, index, parms) {
    //   let res = null;
    //   let newData = [];
    //   if (parms && parms.dataName) {
    //     if (this[parms.dataName][remarkTb].length == 0) {
    //       this.$message.error("请单击需要操作的数据！");
    //     } else {
    //       this[parms.dataName][remarkTb].forEach(x => {
    //         let obj = x;
    //         obj["ElementDeleteFlag"] = 1;
    //         newData.push(obj);
    //       });
    //     }
    //   } else {
    //     this.tableData[remarkTb].forEach(y => {
    //       let obj2 = y;
    //       obj2["ElementDeleteFlag"] = 1;
    //       newData.push(obj2);
    //     });
    //   }
    //   this.$confirm("确定要删除的【" + newData.length + "】数据吗？")
    //     .then(_ => {
    //       _this.generalSaveData(newData, remarkTb, index);
    //     })
    //     .catch(_ => {});
    // },
    // 通用直接保存
    // async generalSaveData(newData, remarkTb, index) {
    //   if (newData.length == 0) {
    //     this.$message.error("没有提交保存的数据！");
    //     return;
    //   }
    //   this.adminLoading = true;
    //   let res = await SaveData(newData);
    //   const { result, data, count, msg } = res.data;
    //   if (result) {
    //     this.dataSearch(remarkTb);
    //     this.adminLoading = false;
    //     this.$message({
    //       message: msg,
    //       type: "success",
    //       dangerouslyUseHTMLString: true
    //     });
    //   } else {
    //     this.adminLoading = false;
    //     this.$message({
    //       message: msg,
    //       type: "error",
    //       dangerouslyUseHTMLString: true
    //     });
    //   }
    // },
    // 获取表头数据
    async getTableHeader() {
      let IDs = this.sysID;
      let res = await GetHeader(IDs);
      const { datas, forms, result, msg } = res.data;
      if (result) {
        // 获取每个表头
        datas.some((m, i) => {
          if (i == 1) {
            m.forEach(n => {
              // 进行验证
              this.verifyData(n);
              if (n.childrens && n.children.length != 0) {
                n.childrens.forEach(x => {
                  this.verifyData(x);
                });
              }
              if (n.label === '') {
                
              }
            });
          } else {
            m.forEach(n => {
              // 进行验证
              this.verifyData(n);
              if (n.childrens && n.children.length != 0) {
                n.childrens.forEach(x => {
                  this.verifyData(x);
                });
              }
            });
          }
          this.$set(this.tableColumns, i, m);
        });
        // 获取查询的初始化字段 组件 按钮
        forms.some((x, z) => {
          this.$set(this.formSearchs[z].datas, "dicID", IDs[z].ID);
          if (z !== 0) {
            this.$set(
              this.formSearchs[z].datas,
              "Account",
              this.userInfo.Account
            );
          }
          x.forEach(y => {
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
    verifyData(n) {
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
    // 选择数据
    selectFun(data, remarkTb, row) {
      this.selectionData[remarkTb] = data;
    },
    // 行内列样式
    cellStyle({ row, column }) {
      if (
        column.property == "JudgeResult" &&
        row["JudgeResult"] == "缺采购单"
      ) {
        return {
          background: "#ff7b7b"
        };
      } else if (
        column.property == "JudgeResult" &&
        row["JudgeResult"] == "在途不足"
      ) {
        return {
          background: "#ffced6"
        };
      } else if (
        column.property == "JudgeResult" &&
        row["JudgeResult"] == "待复期"
      ) {
        return {
          background: "#fdfd8f"
        };
      } else if (
        (column.property == "JudgeResult" && row["JudgeResult"] == "满足") ||
        (column.property == "IsReplyStatusName" &&
          row["IsReplyStatusName"] == "是")
      ) {
        return {
          background: "#9fff9f"
        };
      }

      if (column.property == "OnloadQty") {
        return {
          color: "blue"
        };
      }
      if (column.property == "RealOweQty") {
        return {
          color: "red"
        };
      }
      if (
        column.property == "ReplyQty" &&
        parseFloat(row.ReplyQty) < parseFloat(row.RealOweQty)
      ) {
        return {
          background: "#ff7b7b"
        };
      }

      if (row.ReplyDate && !row.SecondReplyDate) {
        if (
          column.property == "ReplyDate" &&
          new Date(row.ReplyDate).getTime() > new Date(row.LastDate).getTime()
        ) {
          return {
            background: "#ff7b7b"
          };
        }
      }

      if (row.SecondReplyDate) {
        if (
          column.property == "SecondReplyDate" &&
          new Date(row.SecondReplyDate).getTime() >
            new Date(row.LastDate).getTime()
        ) {
          return {
            background: "#ff7b7b"
          };
        }
      }

      if (column.property == "OncheckQty") {
        if (
          parseFloat(row.OncheckQty) >=
          parseFloat(row.StockQtyAllocationPrepare)
        ) {
          return {
            background: "#9fff9f"
          };
        }
      }
    },
    // 改变状态
    changeStatus(item, index) {
      this.labelStatus1 = index;
      if (this.tableData[index].length == 0) {
        this.dataSearch(index);
      }
    }
  }
};
</script>
