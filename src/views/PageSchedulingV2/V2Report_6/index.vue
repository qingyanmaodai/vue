<!--复期明细表-->
<template>
  <div
    class="container flex_flex"
    v-loading="adminLoading"
  >
    <el-container>
      <el-aside
        v-show="showAside"
        style="width:auto"
      >

        <div class="admin_left_2">

          <div>
            <div class="flex px-2 py-1.5 border-b-1 tree_Head">
              <span class="tree_text">采购员</span>
            </div>
            <el-tree
              class="tree-line"
              :indent="0"
              ref="asideTreeRef_two"
              node-key="Label"
              default-expand-all
              :data="treeData2"
              :props="treeProps2"
              :style="{ height: '' + treeHeight + '', overflow: 'auto' }"
              style="height: 300px; overflow: auto"
              highlight-current
              :expand-on-click-node="false"
              @node-click="handleNodeClick2"
            ></el-tree>
          </div>

          <div>
            <div class="flex px-2 py-1.5 border-b-1 tree_Head">
              <span class="tree_text">状态</span>
            </div>
            <el-tree
              class="tree-line asideTree2"
              :indent="0"
              ref="asideTreeRef"
              node-key="Label2"
              :data="treeData"
              :props="treeProps"
              :style="{ height: '' + treeHeight + '', overflow: 'auto' }"
              highlight-current
              :expand-on-click-node="true"
              @node-click="handleNodeClick"
            ></el-tree>
          </div>

        </div>

      </el-aside>
      <el-main style="padding:0;margin:0">
        <div
          class="admin_container_2"
          style="width: 100%;"
        >
          <div
            class="admin_head"
            ref="headRef"
          >
            <ComSearch
              ref="searchRef"
              :searchData="formSearchs[0].datas"
              :searchForm="formSearchs[0].forms"
              :remark="0"
              :isLoading="isLoading"
              :btnForm="btnForm"
              @btnClick="btnClick"
            />
          </div>
          <div>
            <div class="admin_content">
              <div class="ant-table-title">
                <el-row>
                  <el-col :span="4">
                    <span class="title"> <i
                        class="el-icon-d-arrow-left"
                        v-show="showAside"
                        @click="showAside = !showAside"
                      ></i>
                      <i
                        class="el-icon-d-arrow-right"
                        v-show="!showAside"
                        @click="showAside = !showAside"
                      ></i>{{ title }}</span>
                  </el-col>
                  <el-col
                    :span="20"
                    class="flex_flex_end"
                  >
                  </el-col>
                </el-row>
              </div>
              <ComReportTable
                :rowKey="'RowNumber'"
                :height="height"
                :tableData="tableData[0]"
                :tableHeader="tableColumns[0]"
                :tableLoading="tableLoading[0]"
                :remark="0"
                :cellStyle="cellStyle"
                :sysID="sysID[0].ID"
                :isClear="isClear[0]"
                :pagination="tablePagination[0]"
                @pageChange="pageChange"
                @pageSize="pageSize"
                @sortChange="sortChange"
                @filterChange="filterChange"
              />
            </div>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
var _this;
import ComSearch from "@/components/ComSearch";
import ComReportTable from "@/components/ComReportTable";
import { GetHeader, GetSearchData, ExportData } from "@/api/Common";
export default {
  name: "V2Report_6",
  components: {
    ComSearch,
    ComReportTable,
  },
  data() {
    return {
      treeProps: {
        label: "Label",
        children: "children",
      },
      treeProps2: {
        label: "Label",
        children: "children",
      },
      treeData: [
        {
          IsReplyStatusOther: "",
          Label: "全部",
          Label2: "全部",
        },
        {
          IsReplyStatusOther: 0,
          Label: "待复期",
          Label2: "待复期",
        },
        {
          IsReplyStatusOther: [1, 2, 3, 4, 5],
          Label: "已复期",
          Label2: "已复期",
        },
        {
          IsReplyStatusOther: 2,
          Label: "复期异常",
          Label2: "复期异常",
        },
        {
          IsReplyStatusOther: 3,
          Label: "复期变更",
          Label2: "复期变更",
        },
      ],
      treeData2: [],
      ////////////////// Search /////////////////
      treeHeight: "",
      showAside: true,
      title: this.$route.meta.title,
      drawer: false,
      formSearchs: [
        {
          datas: {},
          forms: [],
        },
      ],
      btnForm: [],
      tableData: [[]],
      tableColumns: [[]],
      tableLoading: [false],
      isClear: [false],
      tablePagination: [{ pageIndex: 1, pageSize: 3000, pageTotal: 0 }],
      height: "707px",
      showPagination: true,
      tagRemark: 0,
      isLoading: false,
      adminLoading: false,
      parseForm: {},
      parseSearch: false,
      sysID: [{ ID: 7850 }],
      POTrackerReplyData: [],
      asideLoading: false,
    };
  },
  watch: {},
  created() {
    _this = this;
    this.getTableHeader();
  },
  mounted() {
    setTimeout(() => {
      this.setHeight();
    }, 450);
  },
  methods: {
    // 筛选
    filterChange(val,property,remark){
      this.formSearchs[remark].datas[property] = val
      this.dataSearch(remark)
    },
    cellStyle({ row, column }) {
      if (
        column.property == "JudgeResult" &&
        row["JudgeResult"] == "缺采购单"
      ) {
        return {
          background: "#ff7b7b",
        };
      } else if (
        column.property == "JudgeResult" &&
        row["JudgeResult"] == "待复期"
      ) {
        return {
          background: "#fdfd8f",
        };
      }
      // else if (
      //   column.property == "JudgeResult" &&
      //   row["JudgeResult"] == "交期冲突"
      // ) {
      //   return {
      //     background: "red",
      //   };
      // }
      else if (
        (column.property == "JudgeResult" && row["JudgeResult"] == "满足") ||
        (column.property == "IsReplyStatusName" &&
          row["IsReplyStatusName"] == "是")
      ) {
        return {
          background: "#9fff9f",
        };
      }

      if (column.property == "OnloadQty") {
        return {
          color: "blue",
        };
      }
      if (column.property == "RealOweQty") {
        return {
          color: "red",
        };
      }
      if (
        column.property == "ReplyQty" &&
        parseFloat(row.ReplyQty) < parseFloat(row.RealOweQty)
      ) {
        return {
          background: "#ff7b7b",
        };
      }

      if (row.ReplyDate && !row.SecondReplyDate) {
        if (
          column.property == "ReplyDate" &&
          new Date(row.ReplyDate).getTime() > new Date(row.LastDate).getTime()
        ) {
          return {
            background: "#ff7b7b",
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
            background: "#ff7b7b",
          };
        }
      }
    },
    // 高度控制
    setHeight() {
      let headHeight = this.$refs.headRef.offsetHeight;
      this.treeHeight =
        (document.documentElement.clientHeight - 172) / 2 + "px";
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
      console.log('this.formSearchs[remarkTb].datas',this.formSearchs[remarkTb].datas)
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
          if(this.formSearchs[remarkTb].forms.length){
            // 判断是否是页面显示的查询条件，是的字段才清空
            this.formSearchs[remarkTb].forms.forEach((element)=>{
              if(element.prop===name){
                this.formSearchs[remarkTb].datas[name] = null;
              }
            })
          }
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
    dataSave(remarkTb) {},
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
        this.$refs.asideTreeRef.setCurrentKey("全部");
        this.getPOTrackerReplyData(null, "全部");
      }
    },
    
    // 获取采购员对应的项数
    async getPOTrackerReplyData(IsReplyStatusOther, Label) {
      let form = {};
      form["rows"] = 0;
      form["dicID"] = 7866;
      let res = await GetSearchData(form);
      const { result, data, count, msg } = res.data;
      if (result) {
        this.getPOTracker(IsReplyStatusOther, Label);
        this.POTrackerReplyData = data;
        _this.treeData2 = [];
        if (data.length != 0) {
          data.forEach((a) => {
            a["Label"] = a.POTracker;
            _this.treeData2.push(a);
          });
          this.treeData2.unshift({ Label: "全部", POTracker: "" });
        }
      } else {
        _this.asideLoading = false;
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
    },
    // 获取对应的采购员
    async getPOTracker(val, Label) {
      let form = {};
      form["rows"] = 0;
      form["dicID"] = 7862;
      //form["IsReplyStatusOther"] = val;
      form["fields"] = "IsReplyStatusOther,POTracker";
      form["groupby"] = "IsReplyStatusOther,POTracker";
      form["sort"] = "IsReplyStatusOther";
      let res = await GetSearchData(form);
 
      const { result, data, count, msg } = res.data;
      if (result) {
        // _this.treeData2 = [];
        if (data.length != 0) {
          // data.forEach((a) => {
          //   if (
          //     _this.treeData2.findIndex((b) => b.POTracker == a.POTracker) == -1
          //   ) {
          //     a["Label"] = a.POTracker;
          //     _this.treeData2.push(a);
          //   }
          // });
          // this.treeData2.unshift({ Label: "全部", POTracker: "" });
          let TotalCount = 0;
          let Count_0 = 0;
          let Count_1 = 0;
          let Count_2 = 0;
          let Count_3 = 0;
          if (this.POTrackerReplyData.length != 0) {
            this.POTrackerReplyData.forEach((a) => {
              TotalCount += parseInt(a.TotalCount);
              Count_0 += parseInt(a.Count_0);
              Count_1 += parseInt(a.Count_1);
              Count_2 += parseInt(a.Count_2);
              Count_3 += parseInt(a.Count_3);
            });
          }
          this.POTrackerReplyData.push({
            POTracker: "",
            TotalCount: TotalCount,
            Count_0: Count_0,
            Count_1: Count_1,
            Count_2: Count_2,
            Count_3: Count_3,
          });

          _this.$set(
            _this.treeData[0],
            "Label",
            this.treeData[0].Label2 + `(${TotalCount})`
          );
          _this.$set(
            _this.treeData[1],
            "Label",
            this.treeData[1].Label2 + `(${Count_0})`
          );
          _this.$set(
            _this.treeData[2],
            "Label",
            this.treeData[2].Label2 + `(${Count_1})`
          );
          _this.$set(
            _this.treeData[3],
            "Label",
            this.treeData[3].Label2 + `(${Count_2})`
          );
          _this.$set(
            _this.treeData[4],
            "Label",
            this.treeData[4].Label2 + `(${Count_3})`
          );

          // this.treeData2.forEach((x) => {
          //   let newTag = this.POTrackerReplyData.findIndex(
          //     (c) => c.POTracker == x.POTracker
          //   );
          //   if (newTag != -1) {
          //     if (Label == "全部") {
          //       x["Label"] =
          //         x.Label + `(${this.POTrackerReplyData[newTag].TotalCount})`;
          //     } else if (Label == "待复期") {
          //       x["Label"] =
          //         x.Label + `(${this.POTrackerReplyData[newTag].Count_0})`;
          //     } else if (Label == "已复期") {
          //       x["Label"] =
          //         x.Label + `(${this.POTrackerReplyData[newTag].Count_1})`;
          //     } else if (Label == "复期异常") {
          //       x["Label"] =
          //         x.Label + `(${this.POTrackerReplyData[newTag].Count_2})`;
          //     } else if (Label == "复期变更") {
          //       x["Label"] =
          //         x.Label + `(${this.POTrackerReplyData[newTag].Count_3})`;
          //     }
          //   }
          // });
          this.$nextTick(() => {
            _this.$refs.asideTreeRef_two.setCurrentKey(
              _this.treeData2[0].Label
            );
          });
          _this.formSearchs[0].datas["POTracker"] =
            _this.treeData2[0].POTracker;
          _this.dataSearch(0);
          _this.asideLoading = false;
        }
      } else {
        _this.asideLoading = false;
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
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
    // 单击状态
    handleNodeClick(data, node) {
      //  if (this.asideLoading) {
      //   this.$message.error("上一笔还在查询中，请稍后！");
      //   return;
      // }
      // this.asideLoading = true;
      
      this.$set(
        this.formSearchs[0].datas,
        "Remark6",
        data.Label2+"，"
      );
    
      // this.getPOTrackerReplyData(data.IsReplyStatusOther, data.Label);
      this.dataSearch(0);
    },
    // 单击采购员
    handleNodeClick2(data, node) {
      this.$set(this.formSearchs[0].datas, "POTracker", data.POTracker);
      // 单击将数量赋值上去
      let newTag = this.POTrackerReplyData.findIndex(
        (c) => c.POTracker == data.POTracker
      );
      _this.$set(
        _this.treeData[0],
        "Label",
        this.treeData[0].Label2 +
          `(${this.POTrackerReplyData[newTag].TotalCount})`
      );
      _this.$set(
        _this.treeData[1],
        "Label",
        this.treeData[1].Label2 + `(${this.POTrackerReplyData[newTag].Count_0})`
      );
      _this.$set(
        _this.treeData[2],
        "Label",
        this.treeData[2].Label2 + `(${this.POTrackerReplyData[newTag].Count_1})`
      );
      _this.$set(
        _this.treeData[3],
        "Label",
        this.treeData[3].Label2 + `(${this.POTrackerReplyData[newTag].Count_2})`
      );
      _this.$set(
        _this.treeData[4],
        "Label",
        this.treeData[4].Label2 + `(${this.POTrackerReplyData[newTag].Count_3})`
      );
      this.dataSearch(0);
    },
  },
};
</script>
<style lang="scss" scoped>
.container .el-tree {
  margin-bottom: 0 !important;
}
</style>