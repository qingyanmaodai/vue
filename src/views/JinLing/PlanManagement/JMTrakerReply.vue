<!--采购回复-->
<template>
  <div class="APSContainer flex_flex" v-loading="adminLoading">
    <el-container>
      <el-aside v-show="showAside" style="width: auto">
        <div class="admin_left_2" style="height: 100%; overflow: hidden">
          <div>
            <div class="flex px-2 py-1.5 border-b-1 tree_Head">
              <span class="tree_text">供应商</span>
            </div>
            <el-tree
              class="tree-line"
              :indent="0"
              ref="asideTree"
              node-key="SupplierID"
              :data="treeData"
              :props="treeProps"
              :style="{ height: '' + treeHeight + '', overflow: 'auto' }"
              highlight-current
              :expand-on-click-node="false"
              @node-click="handleNodeClick"
            ></el-tree>
          </div>
        </div>
      </el-aside>
      <el-main style="padding: 0; margin: 0">
        <div class="admin_container_2" style="width: 100%">
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
                    <span>采购员：{{ formSearchs[0].datas["POTracker"] }}</span>
                    <el-divider direction="vertical"></el-divider>
                    <el-date-picker
                      v-model="ReplyDate"
                      type="date"
                      size="small"
                      value-format="yyyy-MM-dd"
                      placeholder="复期"
                    >
                    </el-date-picker>
                    <el-divider direction="vertical"></el-divider>
                    <el-button
                      type="primary"
                      size="mini"
                      @click="changeDate(0)"
                    >
                      批量回复日期
                    </el-button>
                    <el-divider direction="vertical"></el-divider>
                    <el-button
                      type="warning"
                      size="mini"
                      @click="changeDate(1)"
                    >
                      批量二次回复日期
                    </el-button>
                    <el-divider direction="vertical"></el-divider>
                    <el-button
                      type="success "
                      size="mini"
                      @click="refreshPOTraker"
                    >
                      同步更新采购员
                    </el-button>
                    <el-divider direction="vertical"></el-divider>
                    <div v-for="(item, y) in Status1" :key="y">
                      <span
                        @click="changeStatus(item, y)"
                        :class="
                          labelStatus1 == y ? 'statusActive cursor' : 'cursor'
                        "
                        >{{ item.label }}</span
                      >
                      <el-divider direction="vertical"></el-divider>
                    </div>
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
                :sysID="sysID[0].ID"
                :hasSelect="true"
                :isEdit="isEdit"
                :cellStyle="cellStyle"
                :tableRowClassName="tableRowClassName"
                :isClear="isClear[0]"
                :pagination="tablePagination[0]"
                @pageChange="pageChange"
                @pageSize="pageSize"
                :footerLabel="footerLabel[0]"
                @selectfun="selectFun"
                @toPage="usingSearch"
                @sortChange="sortChange"
              />
            </div>
          </div>
        </div>
      </el-main>
    </el-container>
    <el-dialog title="料品可用量查询" :visible.sync="dialogShow" width="50%">
      <div class="APSContainer" style="background-color: #f0f2f5">
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
  SaveData,
  GetServerTime,
  GetOrgData,
  UpdateOrderBomPOTracker,
} from "@/api/Common";
import ComFormDialog from "@/components/ComFormDialog";
import { mapState } from "vuex";
export default {
  name: "JMTrakerReply",
  components: {
    ComSearch,
    ComAsideTree,
    ComVxeTable,
    ComReportTable,
    ComFormDialog,
  },
  data() {
    return {
      footerLabel: [""],
      dialogShow: false,
      EditDisabled: false,
      height1: "360px",
      labelStatus1: 0,
      Status1: [
        // { label: "全部", value: "" },
        // { label: "待复期", value: 0 },
        // { label: "复期超时", value: 5 },
        // { label: "三天内即将到期", value: 4 },
        // { label: "已复期", value: [1, 2, 3, 4, 5] },
        // { label: "复期异常", value: 2 },
        // { label: "复期变更", value: 3 },
        { label: "全部", value: "" },
        { label: "未复期", value: 1 },
        { label: "复期不满足", value: 2 },
        { label: "逾期未交", value: 3 },
      ],
      //////////////左侧树节点//////////////
      showAside: true,
      ReplyDate: "",
      treeProps: {
        label: "SupplierNameCount",
        children: "children",
      },
      treeData: [],
      treeListTmp: [],
      ////////////////// Search /////////////////
      title: this.$route.meta.title,
      delData: [[]],
      formSearchs: [
        {
          datas: {
            MFGOrganizeID: 162, // 江门组织ID
            OrganizeID: 162, // 江门组织ID,可能是上面字段，可能下面字段
          },
          forms: [],
        },
        {
          datas: {
            MFGOrganizeID: 162, // 江门组织ID
            OrganizeID: 162, // 江门组织ID,可能是上面字段，可能下面字段
          },
          forms: [],
        },
      ],
      parmsBtn: [
        {
          ButtonCode: "save",
          BtnName: "保存",
          Type: "success",
          Ghost: true,
          Size: "small",
          Methods: "allSave",
          Icon: "",
        },
      ],
      selectionData: [[], []],
      btnForm: [],
      tableData: [[], []],
      tableColumns: [[], []],
      tableLoading: [false, false],
      isClear: [false, false],
      tablePagination: [
        { pageIndex: 1, pageSize: 500, pageTotal: 0 },
        { pageIndex: 1, pageSize: 500, pageTotal: 0 },
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
      sysID: [{ ID: 7850 }, { ID: 6751 }],
      userInfo: {},
      IsPurchaseBoss: false,
      isBoss: false,
    };
  },
  computed: {},
  created() {
    _this = this;
    this.userInfo = this.$store.getters.userInfo;
    this.judgeBtn();
  },
  mounted() {
    setTimeout(() => {
      this.setHeight();
    }, 500);
  },
  methods: {
    // 获取查询到的所有欠料数
    async getTotalOweNum() {
      let form = JSON.parse(JSON.stringify(this.formSearchs[0].datas));
      form["fields"] = "isnull(sum(OweQty),0) as OweQty";
      form["rows"] = 0;
      let res = await GetSearchData(form);
      const { result, data, msg } = res.data;
      if (result) {
        let StringValue =
          "当前查询结果【欠料合计：" + `${data[0].OweQty}` + "】";
        this.$set(this.footerLabel, 0, StringValue);
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
    },
    searchTree(msg) {
      this.treeData = [];
      let treeListTmp = JSON.parse(JSON.stringify(this.treeListTmp));
      let tmp = msg
        ? this.rebuildData(msg, treeListTmp)
        : JSON.parse(JSON.stringify(treeListTmp));
      this.treeData.push(...tmp);
    },
    rebuildData(value, arr) {
      if (!arr) {
        return [];
      }
      let newarr = [];
      if (Object.prototype.toString.call(arr) === "[object Array]") {
        arr.forEach((element) => {
          if (element.SupplierName.indexOf(value) > -1) {
            // const ab = this.rebuildData(value, element.children);
            const obj = {
              ...element,
              children: element.children,
            };
            newarr.push(obj);
          } else {
            if (element.children && element.children.length > 0) {
              const ab = this.rebuildData(value, element.children);
              const obj = {
                ...element,
                children: ab,
              };
              if (ab && ab.length > 0) {
                newarr.push(obj);
              }
            }
          }
        });
      }
      return newarr;
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
        this.fileList.findIndex((item) => item.url === file.url),
        1
      );
    },
    // 获取供应商数据
    async getSupplierData(POTracker) {
      this.treeData = [];
      this.treeListTmp = [];
      let form = {
        dicID: 7853,
        POTracker: POTracker,
      };
      let num = 0;
      let res = await GetSearchData(form);
      const { result, data, count, msg } = res.data;
      if (result) {
        let newTree = [];
        if (data.length != 0) {
          data.forEach((a) => {
            num += parseInt(a.SumCount);
            let sum = 0;
            if (a.SupplierName == "众诺") {
            }
            data.forEach((b) => {
              if (b.SupplierName == a.SupplierName) {
                sum += b.SumCount;
              }
            });
            a["SupplierNameCount"] = a.SupplierName + "(" + sum + ")";
            let newIndex = -1;
            newIndex = newTree.findIndex(
              (c) => c.SupplierName == a.SupplierName
            );
            if (newIndex == -1) {
              newTree.push(a);
            }
          });
        }
        this.treeData = JSON.parse(JSON.stringify(newTree));
        // this.treeData.unshift({
        //   SupplierID: -1,
        //   SupplierName: "",
        //   SupplierNameCount: "全部" + "(" + num + ")",
        // });
        this.treeListTmp = this.treeData;
        this.getTableData(this.formSearchs[0].datas, 0);
        if (data.length != 0) {
          this.$nextTick(function () {
            _this.$refs.asideTree.setCurrentKey(-1);
          });
        }
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
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
      // 采购员或者采购主管
      let newIndex = this.userInfo.RoleMap.findIndex(
        (a) => a.RoleID == "R2106240003" || a.RoleID == "R2106240002"
      );

      if (newIndex != -1) {
        /// 只有是采购员角色才可以编辑
        this.$set(this, "btnForm", newBtn);
        this.$set(this, "isEdit", permission);
      }
      let newIndex2 = this.userInfo.RoleMap.findIndex(
        (a) => a.RoleID == "R2106240002"
      );
      if (newIndex2 != -1) {
        this.IsPurchaseBoss = true;
      }

      // 超级采购
      let newIndex3 = this.userInfo.RoleMap.findIndex(
        (a) => a.RoleID == "R2201110001"
      );
      if (newIndex3 != -1) {
        this.$set(this, "btnForm", newBtn);
        this.$set(this, "isEdit", permission);
        this.isBoss = true;
      } else {
        this.isBoss = false;
      }
      this.getTableHeader();
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
            this.formSearchs[remarkTb].forms.forEach((element) => {
              if (element.prop === name) {
                this.formSearchs[remarkTb].datas[name] = null;
              }
            });
          }
        }
      }
    },
    // 获取服务器时间
    async getServerDate(remarkTb, index) {
      let res = await GetServerTime();
      const { result, data, msg } = res.data;
      if (result) {
        let submitData = [];
        _this.tableData[0].forEach((x) => {
          let MaterialFormID = x.MaterialFormID.split(",");
          MaterialFormID.forEach((b, i) => {
            let obj = JSON.parse(JSON.stringify(x));
            obj["MaterialFormID"] = b;
            if (!obj.ReplyDate && !obj.SecondReplyDate) {
              obj.IsReplyStatus = 0;
            } else {
              obj.IsReplyStatus = 1;
            }
            // 判断如果是第一次填复期，写进日期 ，如果是第一次填二次复期，写进日期
            if (obj.tag_1 == 1 && obj.ReplyDate) {
              obj.FirstReplyDate = data;
            }
            if (obj.tag_2 == 1 && obj.SecondReplyDate) {
              obj.LastReplyDate = data;
            }
            submitData.push(obj);
          });
        });
        _this.generalSaveData(submitData, 0);
      } else {
      }
    },
    // 整表保存
    allSave(remarkTb, index) {
      this.getServerDate(remarkTb, index);
    },
    // 保存
    async dataSave(remarkTb, index) {
      let submitData = [];
      let flag = 0;
      if (this.selectionData[0].length == 0) {
        this.$message.error("请选择需要提交的数据！");
        return;
      } else {
        this.selectionData[0].forEach((x) => {
          // if (!x.ReplyQty || parseFloat(x.ReplyQty) == 0) {
          //   flag = 1;
          // }
          // if (x.EditDisabled && !x.SecondReplyDate) {
          //   flag = 1;
          // }
          // if (!x.EditDisabled && !x.ReplyDate) {
          //   flag = 1;
          // }
          let obj = JSON.parse(JSON.stringify(x));
          obj["IsReplyStatus"] = 1;
          submitData.push(obj);
        });
      }
      if (flag == 1) {
        this.$message.error("请检查是否填写了回货数与一次日期，或二次复期！");
        return;
      }
      this.$confirm("确定要回复吗？")
        .then((_) => {
          _this.generalSaveData(submitData, 0);
        })
        .catch((_) => {});
    },
    // 单击行
    handleRowClick(row, remarkTb) {
      this.delData[remarkTb] = [];
      this.delData[remarkTb].push(row);
    },
    // 删除
    async dataDel(remarkTb, index, parms) {
      let res = null;
      let newData = [];
      if (parms && parms.dataName) {
        if (this[parms.dataName][remarkTb].length == 0) {
          this.$message.error("请单击需要操作的数据！");
        } else {
          this[parms.dataName][remarkTb].forEach((x) => {
            let obj = x;
            obj["ElementDeleteFlag"] = 1;
            newData.push(obj);
          });
        }
      } else {
        this.tableData[remarkTb].forEach((y) => {
          let obj2 = y;
          obj2["ElementDeleteFlag"] = 1;
          newData.push(obj2);
        });
      }
      this.$confirm("确定要删除的【" + newData.length + "】数据吗？")
        .then((_) => {
          _this.generalSaveData(newData, remarkTb, index);
        })
        .catch((_) => {});
    },
    // 通用直接保存
    async generalSaveData(newData, remarkTb, index) {
      if (newData.length == 0) {
        this.$message.error("没有提交保存的数据！");
        return;
      }
      this.adminLoading = true;
      let res = await SaveData(newData);
      const { result, data, count, msg } = res.data;
      if (result) {
        this.dataSearch(remarkTb);
        this.adminLoading = false;
        this.$message({
          message: msg,
          type: "success",
          dangerouslyUseHTMLString: true,
        });
      } else {
        this.adminLoading = false;
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
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
            this.verifyData(n);
            if (n.children && n.children.length != 0) {
              n.children.forEach((x) => {
                this.verifyData(x);
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
        this.getTotalOweNum();
        if (this.isBoss) {
          this.getSupplierData("");
          return;
        }
        if (this.IsPurchaseBoss) {
          this.formSearchs[0].datas["POTracker"] = "无采购员";
          this.getSupplierData("无采购员");
        } else if (this.isEdit) {
          this.formSearchs[0].datas["POTracker"] = this.userInfo.Name;
          this.getSupplierData(this.userInfo.Name);
        } else {
          this.getSupplierData("");
        }
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
        this.getTotalOweNum();
        if (data.length != 0) {
          data.forEach((x) => {
            if (!x.IsReplyStatus) {
              x.ReplyQty = x.RealOweQty;
            }
            if (!x.ReplyDate) {
              this.$set(x, "tag_1", 1);
            }
            if (!x.SecondReplyDate) {
              this.$set(x, "tag_2", 1);
            }
            if (x.EditDisabled) {
              this.$set(x, "EditDisabled", true);
            } else {
              this.$set(x, "EditDisabled", false);
            }
          });
        }
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
    // 单击出来供应商人员
    handleNodeClick(data, node) {
      this.clickData = data;
      this.$set(
        this.formSearchs[0].datas,
        "POSuplierName",
        data.SupplierName == "全部" ? "" : data.SupplierName
      );
      this.dataSearch(0);
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
    // 选择数据
    selectFun(data, remarkTb, row) {
      this.selectionData[remarkTb] = data;
    },
    // 批量复期
    changeDate(val) {
      if (this.selectionData[0].length == 0) {
        this.$message.error("请选择需要批量填写交期的数据！");
      } else {
        if (val == 0) {
          this.selectionData[0].forEach((a) => {
            if (!a.EditDisabled) {
              a.ReplyDate = this.ReplyDate;
            }
          });
        } else {
          this.selectionData[0].forEach((a) => {
            a.SecondReplyDate = this.ReplyDate;
          });
        }
      }
    },
    tableRowClassName({ row, rowIndex }) {
      // let className = "";
      // if (row["JudgeResult"] == "交期冲突") {
      //   className += "bgRedColor";
      // }
      // return className;
    },
    // 行内列样式
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
        row["JudgeResult"] == "在途不足"
      ) {
        return {
          background: "#ffced6",
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

      if (column.property == "OncheckQty") {
        if (
          parseFloat(row.OncheckQty) >=
          parseFloat(row.StockQtyAllocationPrepare)
        ) {
          return {
            background: "#9fff9f",
          };
        }
      }
    },
    // 改变状态
    changeStatus(x, index) {
      this.labelStatus1 = index;
      // this.formSearchs[0].datas["Remark6"] = x.label+"，";
      this.formSearchs[0].datas["ReplyStatus"] = x.label;
      if (x.label == "全部") {
        // this.formSearchs[0].datas["Remark6"] = "";
        this.formSearchs[0].datas["ReplyStatus"] = "";
      }
      this.dataSearch(0);
    },
    // 可用量查询
    usingSearch(row, prop) {
      this.formSearchs[1].datas["MaterialID"] = row.MaterialID;
      // this.formSearchs[1].datas["Remark1"] = "送货";
      this.dataSearch(1);
      this.dialogShow = true;
    },
    // 同步采购员
    async refreshPOTraker() {
      this.adminLoading = true;
      let res = await UpdateOrderBomPOTracker();
      const { result, msg } = res.data;
      if (result) {
        this.adminLoading = false;
        this.$message({
          message: msg,
          type: "success",
          dangerouslyUseHTMLString: true,
        });
        if (this.isBoss) {
          this.getSupplierData("");
          return;
        }
        if (this.IsPurchaseBoss) {
          this.formSearchs[0].datas["POTracker"] = "无采购员";
          this.getSupplierData("无采购员");
        } else if (this.isEdit) {
          this.formSearchs[0].datas["POTracker"] = this.userInfo.Name;
          this.getSupplierData(this.userInfo.Name);
        } else {
          this.getSupplierData("");
        }
      } else {
        this.adminLoading = false;
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
