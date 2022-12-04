<!--研发打样复期-->
<template>
    <div
      class="container flex_flex"
      v-loading="adminLoading"
    >
      <el-container>
        <el-main style="padding:0;margin:0">
          <div
            class="admin_container_2"
            style="width:100%"
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
                :btnForm="btnForm"
                @btnClick="btnClick"
              />
            </div>
            <div>
              <div class="admin_content">
                <div class="ant-table-title">
                  <el-row>
                    <el-col :span="4">
  
                      <span class="title">
                        <!-- <i
                          class="el-icon-d-arrow-left"
                          v-show="showAside"
                          @click="showAside = !showAside"
                        ></i> -->
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
                  @selectfun="selectFun"
                 
                  @toPage="usingSearch"
                  @sortChange="sortChange"
                />
              </div>
            </div>
          </div>
        </el-main>
      </el-container>
      <el-dialog
        title="料品可用量查询"
        :visible.sync="dialogShow"
        width="50%"
      >
        <div
          class="container"
          style="background-color: #f0f2f5;"
        >
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
  import { Handler } from "mockjs";
  export default {
    name: "DevelopProofingReply",
    components: {
      ComSearch,
      ComAsideTree,
      ComVxeTable,
      ComReportTable,
      ComFormDialog,
    },
    data() {
      return {
        dialogShow: false,
        EditDisabled: false,
        height1: "360px",
        labelStatus1: 0,
        Status1: [
          { label: "全部", value: "" },
          { label: "待复期", value: 0 },
          { label: "复期超时", value: 5 },
          { label: "三天内即将到期", value: 4 },
          { label: "已复期", value: [1, 2, 3, 4, 5] },
          { label: "复期异常", value: 2 },
          { label: "复期变更", value: 3 },
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
            datas: {},
            forms: [],
          },
          {
            datas: {},
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
          {
            ButtonCode: "save",
            BtnName: "取消",
            Type: "danger",
            Ghost: true,
            Size: "small",
            Methods: "cancelSave",
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
        sysID: [{ ID: 7862 }, { ID: 6751 }],
        userInfo: {},
        IsPurchaseBoss: false,
        footerLabel: [""],
      };
    },
    computed: {},
    created() {
      _this = this;
      // this.userInfo = this.$store.getters.userInfo;
      // if (
      //   this.userInfo.RoleMap.findIndex((a) => a.RoleID == "R2201120001") != -1
      // ) {
      //   this.getSupplierData("", 1);
      // } else {
      //   this.getSupplierData(this.userInfo.Account, 0);
      // }
      this.getData()
      this.getTableHeader();
      this.judgeBtn();
    },
    mounted() {
      setTimeout(() => {
        this.setHeight();
      }, 500);
    },
    methods: {
      getData(){
         this.formSearchs[0].datas["PMCRemark"] = [
            "试产",
            "试产/车间生产",
          ];
          this.formSearchs[0].datas["dicID"] = this.sysID[0].ID;
          this.getTableData(this.formSearchs[0].datas, 0);
      },
      // 获取查询到的所有欠料数
      async getTotalOweNum() {
        let form = JSON.parse(JSON.stringify(this.formSearchs[0].datas));
        form["fields"] = "isnull(sum(RealOweQty),0) as RealOweQty";
        form["rows"] = 0;
        let res = await GetSearchData(form);
        const { result, data, msg } = res.data;
        if (result) {
          let StringValue =
            "当前查询结果【欠料合计：" + `${data[0].RealOweQty}` + "】";
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
      // 获取供应商
      async getSupplierData(Account, tag) {
        this.treeData = [];
        this.treeListTmp = [];
        let form = {
          dicID: 7922,
          Account: Account,
          rows: 0,
        };
        let num = 0;
        let res = await GetSearchData(form);
        const { result, data, count, msg } = res.data;
        if (result) {
          let newTree = [];
          if (data.length != 0) {
            if (Account) {
              data.forEach((a) => {
                num += parseInt(a.SumCount);
                a["SupplierNameCount"] = a.SupplierName + "(" + a.SumCount + ")";
                newTree.push(a);
              });
            } else if (tag == 1) {
              data.forEach((a) => {
                let newIndex = -1;
                newIndex = newTree.findIndex((c) => c.SupplierID == a.SupplierID);
                if (newIndex == -1) {
                  num += parseInt(a.SumCount);
                  a["SupplierNameCount"] =
                    a.SupplierName + "(" + a.SumCount + ")";
                  newTree.push(a);
                }
              });
            }
          }
          this.treeData = JSON.parse(JSON.stringify(newTree));
  
          // this.treeData.unshift({
          //   SupplierID: -1,
          //   SupplierName: "",
          //   SupplierNameCount: "全部" + "(" + num + ")",
          // });
  
          this.formSearchs[0].datas["PMCRemark"] = [
            "试产",
            "试产/车间生产",
          ];
          this.formSearchs[0].datas["dicID"] = this.sysID[0].ID;
          this.treeListTmp = this.treeData;
          if (this.treeData.length < 2) {
            return;
          }
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
        this.$set(this, "btnForm", newBtn);
        this.$set(this, "isEdit", permission);
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
            if (!x.ReplyQty || parseFloat(x.ReplyQty) == 0) {
              flag = 1;
            }
            if (x.EditDisabled && !x.SecondReplyDate) {
              flag = 1;
            }
            if (!x.EditDisabled && !x.ReplyDate) {
              flag = 1;
            }
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
              if (n.childrens && n.children.length != 0) {
                n.childrens.forEach((x) => {
                  this.verifyData(x);
                });
              }
            });
            this.$set(this.tableColumns, i, m);
            // this.tableColumns[i] = [
            //     {
            //         "label": "单据类型",
            //         "prop": "JudgeResult",
            //         "propName": null,
            //         "width": "100",
            //         "fix": null,
            //         "sortable": "custom",
            //         "active": null,
            //         "icon": null,
            //         "button": null,
            //         "component": null,
            //         "isEdit": false,
            //         "isMerge": false,
            //         "dicID": "7862",
            //         "isLook": false,
            //         "children": null,
            //         "routerName": false,
            //         "cellStyle": false,
            //         "prop2": null,
            //         "left": 0,
            //         "align": "left",
            //         "render": null,
            //         "className": null,
            //         "extend1": null,
            //         "extend2": null,
            //         "extend3": null,
            //         "extend4": null,
            //         "extend5": null,
            //         "extend6": null,
            //         "ValidType": null,
            //         "pageSize": 32,
            //         "formater": null,
            //         "DataType": "nvarchar",
            //         "FixCount": 1,
            //         "appWidth": null,
            //         "items": null,
            //         "IsSelect": false,
            //         "name": "JudgeResult",
            //         "displayName": "单据类型",
            //         "size": 100,
            //         "cellType": null,
            //         "ControlType": "combobox",
            //         "DataSourceName": null,
            //         "DataSourceID": "D2201110001",
            //         "Required": false
            //     },
            //     {
            //         "label": "单据编号",
            //         "prop": "SalesOrderNo",
            //         "propName": null,
            //         "width": "100",
            //         "fix": null,
            //         "sortable": "custom",
            //         "active": null,
            //         "icon": null,
            //         "button": null,
            //         "component": null,
            //         "isEdit": false,
            //         "isMerge": false,
            //         "dicID": "7862",
            //         "isLook": false,
            //         "children": null,
            //         "routerName": false,
            //         "cellStyle": false,
            //         "prop2": null,
            //         "left": 0,
            //         "align": "left",
            //         "render": null,
            //         "className": null,
            //         "extend1": null,
            //         "extend2": null,
            //         "extend3": null,
            //         "extend4": null,
            //         "extend5": null,
            //         "extend6": null,
            //         "ValidType": null,
            //         "pageSize": 32,
            //         "formater": null,
            //         "DataType": "nvarchar",
            //         "FixCount": 1,
            //         "appWidth": null,
            //         "items": null,
            //         "IsSelect": false,
            //         "name": "SalesOrderNo",
            //         "displayName": "单据编号",
            //         "size": 100,
            //         "cellType": null,
            //         "ControlType": "textbox",
            //         "DataSourceName": null,
            //         "DataSourceID": null,
            //         "Required": false
            //     },
            //     {
            //         "label": "数据状态",
            //         "prop": "ProductName",
            //         "propName": null,
            //         "width": "100",
            //         "fix": null,
            //         "sortable": "custom",
            //         "active": null,
            //         "icon": null,
            //         "button": null,
            //         "component": null,
            //         "isEdit": false,
            //         "isMerge": false,
            //         "dicID": "7862",
            //         "isLook": false,
            //         "children": null,
            //         "routerName": false,
            //         "cellStyle": false,
            //         "prop2": null,
            //         "left": 0,
            //         "align": "left",
            //         "render": null,
            //         "className": null,
            //         "extend1": null,
            //         "extend2": null,
            //         "extend3": null,
            //         "extend4": null,
            //         "extend5": null,
            //         "extend6": null,
            //         "ValidType": null,
            //         "pageSize": 32,
            //         "formater": null,
            //         "DataType": "nvarchar",
            //         "FixCount": 1,
            //         "appWidth": null,
            //         "items": null,
            //         "IsSelect": false,
            //         "name": "ProductName",
            //         "displayName": "数据状态",
            //         "size": 100,
            //         "cellType": null,
            //         "ControlType": "textbox",
            //         "DataSourceName": null,
            //         "DataSourceID": null,
            //         "Required": false
            //     },
            //     {
            //         "label": "申请人",
            //         "prop": "POTracker",
            //         "propName": null,
            //         "width": "80",
            //         "fix": null,
            //         "sortable": "custom",
            //         "active": null,
            //         "icon": null,
            //         "button": null,
            //         "component": null,
            //         "isEdit": false,
            //         "isMerge": false,
            //         "dicID": "7862",
            //         "isLook": false,
            //         "children": null,
            //         "routerName": false,
            //         "cellStyle": false,
            //         "prop2": null,
            //         "left": 0,
            //         "align": "left",
            //         "render": null,
            //         "className": null,
            //         "extend1": null,
            //         "extend2": null,
            //         "extend3": null,
            //         "extend4": null,
            //         "extend5": null,
            //         "extend6": null,
            //         "ValidType": null,
            //         "pageSize": 32,
            //         "formater": null,
            //         "DataType": "varchar",
            //         "FixCount": 1,
            //         "appWidth": null,
            //         "items": null,
            //         "IsSelect": false,
            //         "name": "POTracker",
            //         "displayName": "申请人",
            //         "size": 80,
            //         "cellType": null,
            //         "ControlType": "textbox",
            //         "DataSourceName": null,
            //         "DataSourceID": null,
            //         "Required": false
            //     },
            //     {
            //         "label": "申请日期",
            //         "prop": "PrepareDate",
            //         "propName": null,
            //         "width": "110",
            //         "fix": null,
            //         "sortable": "custom",
            //         "active": null,
            //         "icon": null,
            //         "button": null,
            //         "component": null,
            //         "isEdit": false,
            //         "isMerge": false,
            //         "dicID": "7862",
            //         "isLook": false,
            //         "children": null,
            //         "routerName": false,
            //         "cellStyle": false,
            //         "prop2": null,
            //         "left": 0,
            //         "align": "left",
            //         "render": null,
            //         "className": null,
            //         "extend1": null,
            //         "extend2": null,
            //         "extend3": null,
            //         "extend4": null,
            //         "extend5": null,
            //         "extend6": null,
            //         "ValidType": null,
            //         "pageSize": 32,
            //         "formater": null,
            //         "DataType": "nvarchar",
            //         "FixCount": 1,
            //         "appWidth": null,
            //         "items": null,
            //         "IsSelect": false,
            //         "name": "PrepareDate",
            //         "displayName": "申请日期",
            //         "size": 110,
            //         "cellType": null,
            //         "ControlType": "textbox",
            //         "DataSourceName": null,
            //         "DataSourceID": null,
            //         "Required": false
            //     },
            //     {
            //         "label": "审核人",
            //         "prop": "POTracker",
            //         "propName": null,
            //         "width": "130",
            //         "fix": null,
            //         "sortable": "custom",
            //         "active": null,
            //         "icon": null,
            //         "button": null,
            //         "component": null,
            //         "isEdit": false,
            //         "isMerge": false,
            //         "dicID": "7862",
            //         "isLook": false,
            //         "children": null,
            //         "routerName": false,
            //         "cellStyle": false,
            //         "prop2": null,
            //         "left": 0,
            //         "align": "left",
            //         "render": null,
            //         "className": null,
            //         "extend1": null,
            //         "extend2": null,
            //         "extend3": null,
            //         "extend4": null,
            //         "extend5": null,
            //         "extend6": null,
            //         "ValidType": null,
            //         "pageSize": 32,
            //         "formater": null,
            //         "DataType": "nvarchar",
            //         "FixCount": 1,
            //         "appWidth": null,
            //         "items": null,
            //         "IsSelect": false,
            //         "name": "POTracker",
            //         "displayName": "审核人",
            //         "size": 130,
            //         "cellType": null,
            //         "ControlType": "textbox",
            //         "DataSourceName": null,
            //         "DataSourceID": null,
            //         "Required": false
            //     },
            //     {
            //         "label": "审核日期",
            //         "prop": "SetReplyDate",
            //         "propName": null,
            //         "width": "100",
            //         "fix": null,
            //         "sortable": "custom",
            //         "active": null,
            //         "icon": null,
            //         "button": null,
            //         "component": null,
            //         "isEdit": false,
            //         "isMerge": false,
            //         "dicID": "7862",
            //         "isLook": false,
            //         "children": null,
            //         "routerName": false,
            //         "cellStyle": false,
            //         "prop2": null,
            //         "left": 0,
            //         "align": "left",
            //         "render": null,
            //         "className": null,
            //         "extend1": null,
            //         "extend2": null,
            //         "extend3": null,
            //         "extend4": null,
            //         "extend5": null,
            //         "extend6": null,
            //         "ValidType": null,
            //         "pageSize": 32,
            //         "formater": null,
            //         "DataType": "decimal",
            //         "FixCount": 1,
            //         "appWidth": null,
            //         "items": null,
            //         "IsSelect": false,
            //         "name": "SetReplyDate",
            //         "displayName": "审核日期",
            //         "size": 100,
            //         "cellType": null,
            //         "ControlType": "numberbox",
            //         "DataSourceName": null,
            //         "DataSourceID": null,
            //         "Required": false
            //     },
            //     {
            //         "label": "机型（成品料号）",
            //         "prop": "Code",
            //         "propName": null,
            //         "width": "140",
            //         "fix": null,
            //         "sortable": "custom",
            //         "active": null,
            //         "icon": null,
            //         "button": null,
            //         "component": null,
            //         "isEdit": false,
            //         "isMerge": false,
            //         "dicID": "7862",
            //         "isLook": false,
            //         "children": null,
            //         "routerName": false,
            //         "cellStyle": false,
            //         "prop2": null,
            //         "left": 0,
            //         "align": "left",
            //         "render": null,
            //         "className": null,
            //         "extend1": null,
            //         "extend2": null,
            //         "extend3": null,
            //         "extend4": null,
            //         "extend5": null,
            //         "extend6": null,
            //         "ValidType": null,
            //         "pageSize": 32,
            //         "formater": null,
            //         "DataType": "decimal",
            //         "FixCount": 1,
            //         "appWidth": null,
            //         "items": null,
            //         "IsSelect": false,
            //         "name": "Code",
            //         "displayName": "机型（成品料号）",
            //         "size": 140,
            //         "cellType": null,
            //         "ControlType": "numberbox",
            //         "DataSourceName": null,
            //         "DataSourceID": null,
            //         "Required": false
            //     },
            //     {
            //         "label": "供应商简称",
            //         "prop": "POSuplierName",
            //         "propName": null,
            //         "width": "100",
            //         "fix": null,
            //         "sortable": "custom",
            //         "active": null,
            //         "icon": null,
            //         "button": null,
            //         "component": null,
            //         "isEdit": false,
            //         "isMerge": false,
            //         "dicID": "7862",
            //         "isLook": false,
            //         "children": null,
            //         "routerName": false,
            //         "cellStyle": false,
            //         "prop2": null,
            //         "left": 0,
            //         "align": "left",
            //         "render": null,
            //         "className": null,
            //         "extend1": null,
            //         "extend2": null,
            //         "extend3": null,
            //         "extend4": null,
            //         "extend5": null,
            //         "extend6": null,
            //         "ValidType": null,
            //         "pageSize": 32,
            //         "formater": null,
            //         "DataType": "decimal",
            //         "FixCount": 1,
            //         "appWidth": null,
            //         "items": null,
            //         "IsSelect": false,
            //         "name": "POSuplierName",
            //         "displayName": "供应商简称",
            //         "size": 100,
            //         "cellType": null,
            //         "ControlType": "numberbox",
            //         "DataSourceName": null,
            //         "DataSourceID": null,
            //         "Required": false
            //     },
            //     {
            //         "label": "物料编码",
            //         "prop": "Code",
            //         "propName": null,
            //         "width": "100",
            //         "fix": null,
            //         "sortable": "custom",
            //         "active": null,
            //         "icon": null,
            //         "button": null,
            //         "component": null,
            //         "isEdit": false,
            //         "isMerge": false,
            //         "dicID": "7862",
            //         "isLook": false,
            //         "children": null,
            //         "routerName": false,
            //         "cellStyle": false,
            //         "prop2": null,
            //         "left": 0,
            //         "align": "left",
            //         "render": null,
            //         "className": null,
            //         "extend1": null,
            //         "extend2": null,
            //         "extend3": null,
            //         "extend4": null,
            //         "extend5": null,
            //         "extend6": null,
            //         "ValidType": null,
            //         "pageSize": 32,
            //         "formater": null,
            //         "DataType": "decimal",
            //         "FixCount": 1,
            //         "appWidth": null,
            //         "items": null,
            //         "IsSelect": false,
            //         "name": "Code",
            //         "displayName": "物料编码",
            //         "size": 100,
            //         "cellType": null,
            //         "ControlType": "numberbox",
            //         "DataSourceName": null,
            //         "DataSourceID": null,
            //         "Required": false
            //     },
            //     {
            //         "label": "物料名称",
            //         "prop": "MaterialName",
            //         "propName": null,
            //         "width": "100",
            //         "fix": null,
            //         "sortable": "custom",
            //         "active": null,
            //         "icon": null,
            //         "button": null,
            //         "component": null,
            //         "isEdit": false,
            //         "isMerge": false,
            //         "dicID": "7862",
            //         "isLook": false,
            //         "children": null,
            //         "routerName": false,
            //         "cellStyle": false,
            //         "prop2": null,
            //         "left": 0,
            //         "align": "left",
            //         "render": null,
            //         "className": null,
            //         "extend1": null,
            //         "extend2": null,
            //         "extend3": null,
            //         "extend4": null,
            //         "extend5": null,
            //         "extend6": null,
            //         "ValidType": null,
            //         "pageSize": 32,
            //         "formater": null,
            //         "DataType": "decimal",
            //         "FixCount": 1,
            //         "appWidth": null,
            //         "items": null,
            //         "IsSelect": false,
            //         "name": "MaterialName",
            //         "displayName": "物料名称",
            //         "size": 100,
            //         "cellType": null,
            //         "ControlType": "numberbox",
            //         "DataSourceName": null,
            //         "DataSourceID": null,
            //         "Required": false
            //     },
            //     {
            //         "label": "规格型号",
            //         "prop": "Spec",
            //         "propName": null,
            //         "width": "100",
            //         "fix": null,
            //         "sortable": "custom",
            //         "active": null,
            //         "icon": null,
            //         "button": null,
            //         "component": null,
            //         "isEdit": false,
            //         "isMerge": false,
            //         "dicID": "7862",
            //         "isLook": false,
            //         "children": null,
            //         "routerName": false,
            //         "cellStyle": false,
            //         "prop2": null,
            //         "left": 0,
            //         "align": "left",
            //         "render": null,
            //         "className": null,
            //         "extend1": null,
            //         "extend2": null,
            //         "extend3": null,
            //         "extend4": null,
            //         "extend5": null,
            //         "extend6": null,
            //         "ValidType": null,
            //         "pageSize": 32,
            //         "formater": null,
            //         "DataType": "decimal",
            //         "FixCount": 1,
            //         "appWidth": null,
            //         "items": null,
            //         "IsSelect": false,
            //         "name": "Spec",
            //         "displayName": "规格型号",
            //         "size": 100,
            //         "cellType": null,
            //         "ControlType": "numberbox",
            //         "DataSourceName": null,
            //         "DataSourceID": null,
            //         "Required": false
            //     },
            //     {
            //         "label": "申请数量",
            //         "prop": "DemandQty",
            //         "propName": null,
            //         "width": "100",
            //         "fix": null,
            //         "sortable": "custom",
            //         "active": null,
            //         "icon": null,
            //         "button": null,
            //         "component": null,
            //         "isEdit": false,
            //         "isMerge": false,
            //         "dicID": "7862",
            //         "isLook": false,
            //         "children": null,
            //         "routerName": false,
            //         "cellStyle": false,
            //         "prop2": null,
            //         "left": 0,
            //         "align": "left",
            //         "render": null,
            //         "className": null,
            //         "extend1": null,
            //         "extend2": null,
            //         "extend3": null,
            //         "extend4": null,
            //         "extend5": null,
            //         "extend6": null,
            //         "ValidType": null,
            //         "pageSize": 32,
            //         "formater": null,
            //         "DataType": "decimal",
            //         "FixCount": 1,
            //         "appWidth": null,
            //         "items": null,
            //         "IsSelect": false,
            //         "name": "DemandQty",
            //         "displayName": "申请数量",
            //         "size": 100,
            //         "cellType": null,
            //         "ControlType": "numberbox",
            //         "DataSourceName": null,
            //         "DataSourceID": null,
            //         "Required": false
            //     },
            //     {
            //         "label": "批准数量",
            //         "prop": "DemandQty",
            //         "propName": null,
            //         "width": "100",
            //         "fix": null,
            //         "sortable": "custom",
            //         "active": null,
            //         "icon": null,
            //         "button": null,
            //         "component": null,
            //         "isEdit": false,
            //         "isMerge": false,
            //         "dicID": "7862",
            //         "isLook": false,
            //         "children": null,
            //         "routerName": false,
            //         "cellStyle": false,
            //         "prop2": null,
            //         "left": 0,
            //         "align": "left",
            //         "render": null,
            //         "className": null,
            //         "extend1": null,
            //         "extend2": null,
            //         "extend3": null,
            //         "extend4": null,
            //         "extend5": null,
            //         "extend6": null,
            //         "ValidType": null,
            //         "pageSize": 32,
            //         "formater": null,
            //         "DataType": "datetime",
            //         "FixCount": 1,
            //         "appWidth": null,
            //         "items": null,
            //         "IsSelect": false,
            //         "name": "DemandQty",
            //         "displayName": "批准数量",
            //         "size": 100,
            //         "cellType": null,
            //         "ControlType": "datebox",
            //         "DataSourceName": null,
            //         "DataSourceID": null,
            //         "Required": false
            //     },
            //     {
            //         "label": "剩余数量（未下单）",
            //         "prop": "DemandQty",
            //         "propName": null,
            //         "width": "150",
            //         "fix": null,
            //         "sortable": "custom",
            //         "active": null,
            //         "icon": null,
            //         "button": null,
            //         // "component": {
            //         //     "inputType": "number"
            //         // },
            //         "isEdit": false,
            //         "isMerge": false,
            //         "dicID": "7862",
            //         "isLook": false,
            //         "children": null,
            //         "routerName": false,
            //         "cellStyle": false,
            //         "prop2": null,
            //         "left": 0,
            //         "align": "left",
            //         "render": null,
            //         "className": null,
            //         "extend1": null,
            //         "extend2": null,
            //         "extend3": null,
            //         "extend4": null,
            //         "extend5": null,
            //         "extend6": null,
            //         "ValidType": null,
            //         "pageSize": 32,
            //         "formater": null,
            //         "DataType": "decimal",
            //         "FixCount": 1,
            //         "appWidth": null,
            //         "items": null,
            //         "IsSelect": false,
            //         "name": "DemandQty",
            //         "displayName": "剩余数量（未下单）",
            //         "size": 150,
            //         "cellType": null,
            //         "ControlType": "numberbox",
            //         "DataSourceName": null,
            //         "DataSourceID": null,
            //         "Required": false
            //     },
            //     {
            //         "label": "到货日期（要求）",
            //         "prop": "PrepareDate",
            //         "propName": null,
            //         "width": "150",
            //         "fix": null,
            //         "sortable": "custom",
            //         "active": null,
            //         "icon": null,
            //         "button": null,
            //         // "component": {
            //         //     "type": "date"
            //         // },
            //         "isEdit": false,
            //         "isMerge": false,
            //         "dicID": "7862",
            //         "isLook": false,
            //         "children": null,
            //         "routerName": false,
            //         "cellStyle": false,
            //         "prop2": null,
            //         "left": 0,
            //         "align": "left",
            //         "render": null,
            //         "className": null,
            //         "extend1": null,
            //         "extend2": null,
            //         "extend3": null,
            //         "extend4": null,
            //         "extend5": null,
            //         "extend6": null,
            //         "ValidType": null,
            //         "pageSize": 32,
            //         "formater": null,
            //         "DataType": "datetime",
            //         "FixCount": 1,
            //         "appWidth": null,
            //         "items": null,
            //         "IsSelect": false,
            //         "name": "PrepareDate",
            //         "displayName": "到货日期（要求）",
            //         "size": 150,
            //         "cellType": null,
            //         "ControlType": "datebox",
            //         "DataSourceName": null,
            //         "DataSourceID": null,
            //         "Required": false
            //     },
            //     {
            //         "label": "库存",
            //         "prop": "StockQty",
            //         "propName": null,
            //         "width": "100",
            //         "fix": null,
            //         "sortable": "custom",
            //         "active": null,
            //         "icon": null,
            //         "button": null,
            //         // "component": {
            //         //     "type": "date"
            //         // },
            //         "isEdit": false,
            //         "isMerge": false,
            //         "dicID": "7862",
            //         "isLook": false,
            //         "children": null,
            //         "routerName": false,
            //         "cellStyle": false,
            //         "prop2": null,
            //         "left": 0,
            //         "align": "left",
            //         "render": null,
            //         "className": null,
            //         "extend1": null,
            //         "extend2": null,
            //         "extend3": null,
            //         "extend4": null,
            //         "extend5": null,
            //         "extend6": null,
            //         "ValidType": null,
            //         "pageSize": 32,
            //         "formater": null,
            //         "DataType": "datetime",
            //         "FixCount": 1,
            //         "appWidth": null,
            //         "items": null,
            //         "IsSelect": false,
            //         "name": "StockQty",
            //         "displayName": "库存",
            //         "size": 100,
            //         "cellType": null,
            //         "ControlType": "datebox",
            //         "DataSourceName": null,
            //         "DataSourceID": null,
            //         "Required": false
            //     },
            //     {
            //         "label": "采购订单",
            //         "prop": "mo",
            //         "propName": null,
            //         "width": "100",
            //         "fix": null,
            //         "sortable": "custom",
            //         "active": null,
            //         "icon": null,
            //         "button": null,
            //         // "component": {
            //         //     "type": "input",
            //         //     "inputType": "text"
            //         // },
            //         "isEdit":false,
            //         "isMerge": false,
            //         "dicID": "7862",
            //         "isLook": false,
            //         "children": null,
            //         "routerName": false,
            //         "cellStyle": false,
            //         "prop2": null,
            //         "left": 0,
            //         "align": "left",
            //         "render": null,
            //         "className": null,
            //         "extend1": null,
            //         "extend2": null,
            //         "extend3": null,
            //         "extend4": null,
            //         "extend5": null,
            //         "extend6": null,
            //         "ValidType": null,
            //         "pageSize": 32,
            //         "formater": null,
            //         "DataType": "nvarchar",
            //         "FixCount": 1,
            //         "appWidth": null,
            //         "items": null,
            //         "IsSelect": false,
            //         "name": "mo",
            //         "displayName": "采购订单",
            //         "size": 100,
            //         "cellType": null,
            //         "ControlType": "textbox",
            //         "DataSourceName": null,
            //         "DataSourceID": null,
            //         "Required": false
            //     },
            //     {
            //         "label": "入库数量",
            //         "prop": "InQty",
            //         "propName": null,
            //         "width": "110",
            //         "fix": null,
            //         "sortable": "custom",
            //         "active": null,
            //         "icon": null,
            //         "button": null,
            //         "component": null,
            //         "isEdit": false,
            //         "isMerge": false,
            //         "dicID": "7862",
            //         "isLook": false,
            //         "children": null,
            //         "routerName": false,
            //         "cellStyle": false,
            //         "prop2": null,
            //         "left": 0,
            //         "align": "left",
            //         "render": null,
            //         "className": null,
            //         "extend1": null,
            //         "extend2": null,
            //         "extend3": null,
            //         "extend4": null,
            //         "extend5": null,
            //         "extend6": null,
            //         "ValidType": null,
            //         "pageSize": 32,
            //         "formater": null,
            //         "DataType": "datetime",
            //         "FixCount": 1,
            //         "appWidth": null,
            //         "items": null,
            //         "IsSelect": false,
            //         "name": "InQty",
            //         "displayName": "入库数量",
            //         "size": 110,
            //         "cellType": null,
            //         "ControlType": "datebox",
            //         "DataSourceName": null,
            //         "DataSourceID": null,
            //         "Required": false
            //     },
            //     {
            //         "label": "入库日期",
            //         "prop": "SalesOrderNo",
            //         "propName": null,
            //         "width": "100",
            //         "fix": null,
            //         "sortable": "custom",
            //         "active": null,
            //         "icon": null,
            //         "button": null,
            //         "component": null,
            //         "isEdit": false,
            //         "isMerge": false,
            //         "dicID": "7862",
            //         "isLook": false,
            //         "children": null,
            //         "routerName": false,
            //         "cellStyle": false,
            //         "prop2": null,
            //         "left": 0,
            //         "align": "left",
            //         "render": null,
            //         "className": null,
            //         "extend1": null,
            //         "extend2": null,
            //         "extend3": null,
            //         "extend4": null,
            //         "extend5": null,
            //         "extend6": null,
            //         "ValidType": null,
            //         "pageSize": 32,
            //         "formater": null,
            //         "DataType": "varchar",
            //         "FixCount": 1,
            //         "appWidth": null,
            //         "items": null,
            //         "IsSelect": false,
            //         "name": "SalesOrderNo",
            //         "displayName": "入库日期",
            //         "size": 100,
            //         "cellType": null,
            //         "ControlType": "textbox",
            //         "DataSourceName": null,
            //         "DataSourceID": null,
            //         "Required": false
            //     },
            //     {
            //         "label": "供方复期",
            //         "prop": "FirstReplyDate",
            //         "propName": null,
            //         "width": "120",
            //         "fix": null,
            //         "sortable": "custom",
            //         "active": null,
            //         "icon": null,
            //         "button": null,
            //         "component": null,
            //         "isEdit": false,
            //         "isMerge": false,
            //         "dicID": "7862",
            //         "isLook": false,
            //         "children": null,
            //         "routerName": false,
            //         "cellStyle": false,
            //         "prop2": null,
            //         "left": 0,
            //         "align": "left",
            //         "render": null,
            //         "className": null,
            //         "extend1": null,
            //         "extend2": null,
            //         "extend3": null,
            //         "extend4": null,
            //         "extend5": null,
            //         "extend6": null,
            //         "ValidType": null,
            //         "pageSize": 32,
            //         "formater": null,
            //         "DataType": "varchar",
            //         "FixCount": 1,
            //         "appWidth": null,
            //         "items": null,
            //         "IsSelect": false,
            //         "name": "FirstReplyDate",
            //         "displayName": "供方复期",
            //         "size": 120,
            //         "cellType": null,
            //         "ControlType": "textbox",
            //         "DataSourceName": null,
            //         "DataSourceID": null,
            //         "Required": false
            //     },
            //     {
            //         "label": "第一次修正",
            //         "prop": "Name",
            //         "propName": null,
            //         "width": "100",
            //         "fix": null,
            //         "sortable": "custom",
            //         "active": null,
            //         "icon": null,
            //         "button": null,
            //         "component": null,
            //         "isEdit": false,
            //         "isMerge": false,
            //         "dicID": "7862",
            //         "isLook": false,
            //         "children": null,
            //         "routerName": false,
            //         "cellStyle": false,
            //         "prop2": null,
            //         "left": 0,
            //         "align": "left",
            //         "render": null,
            //         "className": null,
            //         "extend1": null,
            //         "extend2": null,
            //         "extend3": null,
            //         "extend4": null,
            //         "extend5": null,
            //         "extend6": null,
            //         "ValidType": null,
            //         "pageSize": 32,
            //         "formater": null,
            //         "DataType": "varchar",
            //         "FixCount": 1,
            //         "appWidth": null,
            //         "items": null,
            //         "IsSelect": false,
            //         "name": "Name",
            //         "displayName": "第一次修正",
            //         "size": 100,
            //         "cellType": null,
            //         "ControlType": "textbox",
            //         "DataSourceName": null,
            //         "DataSourceID": null,
            //         "Required": false
            //     },
            //     {
            //         "label": "第二次修正",
            //         "prop": "SurplusQty",
            //         "propName": null,
            //         "width": "100",
            //         "fix": null,
            //         "sortable": "custom",
            //         "active": null,
            //         "icon": null,
            //         "button": null,
            //         "component": null,
            //         "isEdit": false,
            //         "isMerge": false,
            //         "dicID": "7862",
            //         "isLook": false,
            //         "children": null,
            //         "routerName": false,
            //         "cellStyle": false,
            //         "prop2": null,
            //         "left": 0,
            //         "align": "left",
            //         "render": null,
            //         "className": null,
            //         "extend1": null,
            //         "extend2": null,
            //         "extend3": null,
            //         "extend4": null,
            //         "extend5": null,
            //         "extend6": null,
            //         "ValidType": null,
            //         "pageSize": 32,
            //         "formater": null,
            //         "DataType": "decimal",
            //         "FixCount": 1,
            //         "appWidth": null,
            //         "items": null,
            //         "IsSelect": false,
            //         "name": "SurplusQty",
            //         "displayName": "第二次修正",
            //         "size": 100,
            //         "cellType": null,
            //         "ControlType": "numberbox",
            //         "DataSourceName": null,
            //         "DataSourceID": null,
            //         "Required": false
            //     },
            //     {
            //         "label": "备注",
            //         "prop": "Remark",
            //         "propName": null,
            //         "width": "90",
            //         "fix": null,
            //         "sortable": "custom",
            //         "active": null,
            //         "icon": null,
            //         "button": null,
            //         "component": null,
            //         "isEdit": false,
            //         "isMerge": false,
            //         "dicID": "7862",
            //         "isLook": false,
            //         "children": null,
            //         "routerName": false,
            //         "cellStyle": false,
            //         "prop2": null,
            //         "left": 0,
            //         "align": "left",
            //         "render": null,
            //         "className": null,
            //         "extend1": null,
            //         "extend2": null,
            //         "extend3": null,
            //         "extend4": null,
            //         "extend5": null,
            //         "extend6": null,
            //         "ValidType": null,
            //         "pageSize": 32,
            //         "formater": null,
            //         "DataType": "nvarchar",
            //         "FixCount": 1,
            //         "appWidth": null,
            //         "items": null,
            //         "IsSelect": false,
            //         "name": "Remark",
            //         "displayName": "备注",
            //         "size": 90,
            //         "cellType": null,
            //         "ControlType": "textbox",
            //         "DataSourceName": null,
            //         "DataSourceID": null,
            //         "Required": false
            //     },
            //     {
            //         "label": "此物料打样次数（当年）",
            //         "prop": "num",
            //         "propName": null,
            //         "width": "180",
            //         "fix": null,
            //         "sortable": "custom",
            //         "active": null,
            //         "icon": null,
            //         "button": null,
            //         "component": null,
            //         "isEdit": false,
            //         "isMerge": false,
            //         "dicID": "7862",
            //         "isLook": false,
            //         "children": null,
            //         "routerName": false,
            //         "cellStyle": false,
            //         "prop2": null,
            //         "left": 0,
            //         "align": "left",
            //         "render": null,
            //         "className": null,
            //         "extend1": null,
            //         "extend2": null,
            //         "extend3": null,
            //         "extend4": null,
            //         "extend5": null,
            //         "extend6": null,
            //         "ValidType": null,
            //         "pageSize": 32,
            //         "formater": null,
            //         "DataType": "decimal",
            //         "FixCount": 1,
            //         "appWidth": null,
            //         "items": null,
            //         "IsSelect": false,
            //         "name": "num",
            //         "displayName": "此物料打样次数（当年）",
            //         "size": 180,
            //         "cellType": null,
            //         "ControlType": "numberbox",
            //         "DataSourceName": null,
            //         "DataSourceID": null,
            //         "Required": false
            //     },
            //     {
            //         "label": "业务终止",
            //         "prop": "SalesRealOweNum",
            //         "propName": null,
            //         "width": "100",
            //         "fix": null,
            //         "sortable": "custom",
            //         "active": null,
            //         "icon": null,
            //         "button": null,
            //         "component": null,
            //         "isEdit": false,
            //         "isMerge": false,
            //         "dicID": "7862",
            //         "isLook": false,
            //         "children": null,
            //         "routerName": false,
            //         "cellStyle": false,
            //         "prop2": null,
            //         "left": 0,
            //         "align": "left",
            //         "render": null,
            //         "className": null,
            //         "extend1": null,
            //         "extend2": null,
            //         "extend3": null,
            //         "extend4": null,
            //         "extend5": null,
            //         "extend6": null,
            //         "ValidType": null,
            //         "pageSize": 32,
            //         "formater": null,
            //         "DataType": "int",
            //         "FixCount": 1,
            //         "appWidth": null,
            //         "items": null,
            //         "IsSelect": false,
            //         "name": "SalesRealOweNum",
            //         "displayName": "业务终止",
            //         "size": 100,
            //         "cellType": null,
            //         "ControlType": "numberbox",
            //         "DataSourceName": null,
            //         "DataSourceID": null,
            //         "Required": false
            //     },
            //     {
            //         "label": "关闭状态",
            //         "prop": "status2",
            //         "propName": null,
            //         "width": "85",
            //         "fix": null,
            //         "sortable": "custom",
            //         "active": null,
            //         "icon": null,
            //         "button": null,
            //         "component": null,
            //         "isEdit": false,
            //         "isMerge": false,
            //         "dicID": "7862",
            //         "isLook": false,
            //         "children": null,
            //         "routerName": false,
            //         "cellStyle": false,
            //         "prop2": null,
            //         "left": 0,
            //         "align": "left",
            //         "render": null,
            //         "className": null,
            //         "extend1": null,
            //         "extend2": null,
            //         "extend3": null,
            //         "extend4": null,
            //         "extend5": null,
            //         "extend6": null,
            //         "ValidType": null,
            //         "pageSize": 32,
            //         "formater": null,
            //         "DataType": "datetime",
            //         "FixCount": 1,
            //         "appWidth": null,
            //         "items": null,
            //         "IsSelect": false,
            //         "name": "status2",
            //         "displayName": "关闭状态",
            //         "size": 85,
            //         "cellType": null,
            //         "ControlType": "datebox",
            //         "DataSourceName": null,
            //         "DataSourceID": null,
            //         "Required": false
            //     },
            //     {
            //         "label": "需求单据编号",
            //         "prop": "po",
            //         "propName": null,
            //         "width": "120",
            //         "fix": null,
            //         "sortable": "custom",
            //         "active": null,
            //         "icon": null,
            //         "button": null,
            //         "component": null,
            //         "isEdit": false,
            //         "isMerge": false,
            //         "dicID": "7862",
            //         "isLook": false,
            //         "children": null,
            //         "routerName": false,
            //         "cellStyle": false,
            //         "prop2": null,
            //         "left": 0,
            //         "align": "left",
            //         "render": null,
            //         "className": null,
            //         "extend1": null,
            //         "extend2": null,
            //         "extend3": null,
            //         "extend4": null,
            //         "extend5": null,
            //         "extend6": null,
            //         "ValidType": null,
            //         "pageSize": 32,
            //         "formater": null,
            //         "DataType": "datetime",
            //         "FixCount": 1,
            //         "appWidth": null,
            //         "items": null,
            //         "IsSelect": false,
            //         "name": "po",
            //         "displayName": "需求单据编号",
            //         "size": 120,
            //         "cellType": null,
            //         "ControlType": "datebox",
            //         "DataSourceName": null,
            //         "DataSourceID": null,
            //         "Required": false
            //     },
            //     {
            //         "label": "状态",
            //         "prop": "status3",
            //         "propName": null,
            //         "width": "80",
            //         "fix": null,
            //         "sortable": "custom",
            //         "active": null,
            //         "icon": null,
            //         "button": null,
            //         "component": null,
            //         "isEdit": false,
            //         "isMerge": false,
            //         "dicID": "7862",
            //         "isLook": false,
            //         "children": null,
            //         "routerName": false,
            //         "cellStyle": false,
            //         "prop2": null,
            //         "left": 0,
            //         "align": "left",
            //         "render": null,
            //         "className": null,
            //         "extend1": null,
            //         "extend2": null,
            //         "extend3": null,
            //         "extend4": null,
            //         "extend5": null,
            //         "extend6": null,
            //         "ValidType": null,
            //         "pageSize": 32,
            //         "formater": null,
            //         "DataType": "nvarchar",
            //         "FixCount": 1,
            //         "appWidth": null,
            //         "items": null,
            //         "IsSelect": false,
            //         "name": "status3",
            //         "displayName": "状态",
            //         "size": 80,
            //         "cellType": null,
            //         "ControlType": "textbox",
            //         "DataSourceName": null,
            //         "DataSourceID": null,
            //         "Required": false
            //     },
            //     {
            //         "label": "供方复期时间",
            //         "prop": "SetReplyTime",
            //         "propName": null,
            //         "width": "120",
            //         "fix": null,
            //         "sortable": "custom",
            //         "active": null,
            //         "icon": null,
            //         "button": null,
            //         "component": null,
            //         "isEdit": false,
            //         "isMerge": false,
            //         "dicID": "7862",
            //         "isLook": false,
            //         "children": null,
            //         "routerName": false,
            //         "cellStyle": false,
            //         "prop2": null,
            //         "left": 0,
            //         "align": "left",
            //         "render": null,
            //         "className": null,
            //         "extend1": null,
            //         "extend2": null,
            //         "extend3": null,
            //         "extend4": null,
            //         "extend5": null,
            //         "extend6": null,
            //         "ValidType": null,
            //         "pageSize": 32,
            //         "formater": null,
            //         "DataType": "datetime",
            //         "FixCount": 1,
            //         "appWidth": null,
            //         "items": null,
            //         "IsSelect": false,
            //         "name": "SetReplyTime",
            //         "displayName": "供方复期时间",
            //         "size": 120,
            //         "cellType": null,
            //         "ControlType": "datebox",
            //         "DataSourceName": null,
            //         "DataSourceID": null,
            //         "Required": false
            //     },
            //     {
            //         "label": "复期更新时间",
            //         "prop": "ValidReplyDate",
            //         "propName": null,
            //         "width": "120",
            //         "fix": null,
            //         "sortable": "custom",
            //         "active": null,
            //         "icon": null,
            //         "button": null,
            //         "component": null,
            //         "isEdit": false,
            //         "isMerge": false,
            //         "dicID": "7862",
            //         "isLook": false,
            //         "children": null,
            //         "routerName": false,
            //         "cellStyle": false,
            //         "prop2": null,
            //         "left": 0,
            //         "align": "left",
            //         "render": null,
            //         "className": null,
            //         "extend1": null,
            //         "extend2": null,
            //         "extend3": null,
            //         "extend4": null,
            //         "extend5": null,
            //         "extend6": null,
            //         "ValidType": null,
            //         "pageSize": 32,
            //         "formater": null,
            //         "DataType": "datetime",
            //         "FixCount": 1,
            //         "appWidth": null,
            //         "items": null,
            //         "IsSelect": false,
            //         "name": "ValidReplyDate",
            //         "displayName": "复期更新时间",
            //         "size": 120,
            //         "cellType": null,
            //         "ControlType": "datebox",
            //         "DataSourceName": null,
            //         "DataSourceID": null,
            //         "Required": false
            //     },
            // ]
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
            this.getTotalOweNum();
          });
        }
        
        console.log('this.tableColumns',this.tableColumns)
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
        // this.$set(this.tablePagination[remarkTb], "pageTotal", 15);
        // this.tableData[remarkTb] = [
        //     {
        //         "RowNumber": 1,
        //         "isChecked": false,
        //         "JudgeResult": "打样采购申请",
        //         "POSuplierName": "吉华,",
        //         "ProductName": "已审核",
        //         "Code": "32300666",
        //         "MaterialName": "15度透镜",
        //         "Spec": "PMMA，15度",
        //         "StockQty": 0,
        //         "StockQty1": null,
        //         "StockQty2": null,
        //         "OncheckQty": 0,
        //         "OnloadQty": 4,
        //         "RealOweQty": 2,
        //         "StockQtyAllocationPrepare": 2,
        //         "LastDate": "2022-08-04",
        //         "ReplyQty": 2,
        //         "ReplyDate": "2022-08-23",
        //         "SecondReplyDate": "",
        //         "Remark4": "已找研发拿了2个给试产8-25",
        //         "DemandReplyDate": "2022-08-25 11:04:29",
        //         "PODocs": "CGDD220620080,CGDD220811021,",
        //         "SalesOrderNo": "2022-12-06",
        //         "IsReplyStatusName": "是",
        //         "SurplusQty": null,
        //         "PMCRemark": "试产/厂内",
        //         "DemandQty": 240,
        //         "SalesRealOweNum": '正常',
        //         "PrepareDate": "2022-04-19",
        //         "PODate": "2022-06-20 16:48:16",
        //         "POTracker": "韩琴",
        //         "SetReplyDate": "2022-08-22 11:04:29",
        //         "ValidReplyDate": "2022-08-23",
        //         "Extend11": "0",
        //         "IssueDate": "",
        //         "InDate": "",
        //         "InQty": 36,
        //         "WorkShopName": "二车间",
        //         "Remark5": "待检",
        //         "WarehouseName": "成品仓",
        //         "EditDisabled": 0,
        //         "ReqQty": null,
        //         "IsReplyStatusOther": 5,
        //         "Extend1": "采购足",
        //         "Remark6": "已复期，复期异常，",
        //         "FirstReplyDate": "2022-08-23 20:44:01",
        //         "InspectDate": "2022-04-20 14:01:56",
        //         "IsReplyStatus": 1,
        //         "IssueType": "直接发料      ",
        //         "LastReplyDate": "",
        //         "MaterialFormID": "524962",
        //         "MaterialID": 140226,
        //         "MaterialProp": "外购",
        //         "OweQty": -2,
        //         "Qty": 10,
        //         "SalesOrderDetailID": "116055",
        //         "ShortQty": null,
        //         "UnIssuedQty": 2,
        //         "dicID": 7862,
        //         "update": true,
        //         "JudgeResultText": "采购足",
        //         'status2':'未关闭',
        //         'status3':'是否取消订单',
        //         'SetReplyTime':48,
        //         "复期": [
        //             {
        //                 "title": "采购足",
        //                 "value": "采购足",
        //                 "label": "采购足",
        //                 "text": "采购足"
        //             },
        //             {
        //                 "title": "未下单",
        //                 "value": "未下单",
        //                 "label": "未下单",
        //                 "text": "未下单"
        //             },
        //             {
        //                 "title": "申购不足",
        //                 "value": "申购不足",
        //                 "label": "申购不足",
        //                 "text": "申购不足"
        //             },
        //             {
        //                 "title": "交期冲突",
        //                 "value": "交期冲突",
        //                 "label": "交期冲突",
        //                 "text": "交期冲突"
        //             },
        //             {
        //                 "title": "待复期",
        //                 "value": "待复期",
        //                 "label": "待复期",
        //                 "text": "待复期"
        //             },
        //             {
        //                 "title": "数量不足",
        //                 "value": "数量不足",
        //                 "label": "数量不足",
        //                 "text": "数量不足"
        //             },
        //             {
        //                 "title": "满足",
        //                 "value": "满足",
        //                 "label": "满足",
        //                 "text": "满足"
        //             }
        //         ]
        //     },
        //     {
        //         "RowNumber": 2,
        //         "isChecked": false,
        //         "JudgeResult": "打样委外采购申请",
        //         "POSuplierName": "无供应商,",
        //         "ProductName": "已审核",
        //         "Code": "52001918",
        //         "MaterialName": "停用：GV-M16QZ 雾化板 纸板",
        //         "Spec": "停用：1000*75mm，A3A加强120g，黄色纸板，3层纸",
        //         "StockQty": 0,
        //         "StockQty1": null,
        //         "StockQty2": null,
        //         "OncheckQty": 0,
        //         "OnloadQty": null,
        //         "RealOweQty": 30,
        //         "StockQtyAllocationPrepare": 30,
        //         "LastDate": "2022-07-30",
        //         "ReplyQty": 30,
        //         "ReplyDate": "2022-08-24",
        //         "SecondReplyDate": "",
        //         "Remark4": null,
        //         "DemandReplyDate": "2022-08-25 14:33:46",
        //         "PODocs": null,
        //         "SalesOrderNo": "2022-12-06",
        //         "IsReplyStatusName": "是",
        //         "SurplusQty": null,
        //         "PMCRemark": "试产/厂内",
        //         "DemandQty": 55,
        //         "SalesRealOweNum": '正常',
        //         "PrepareDate": "2022-04-22",
        //         "PODate": "",
        //         "POTracker": "黄山娜",
        //         "SetReplyDate": "2022-08-22 14:33:46",
        //         "ValidReplyDate": "2022-08-24",
        //         "Extend11": "10",
        //         "IssueDate": "",
        //         "InDate": "",
        //         "InQty": 36,
        //         "WorkShopName": "二车间",
        //         "Remark5": "待检",
        //         "WarehouseName": "成品仓",
        //         "EditDisabled": 0,
        //         "ReqQty": null,
        //         "IsReplyStatusOther": 5,
        //         "Extend1": "申购不足",
        //         "Remark6": "已复期，复期异常，",
        //         "FirstReplyDate": "2022-08-24 09:08:11",
        //         "InspectDate": "2022-04-23 08:00:46",
        //         "IsReplyStatus": 1,
        //         "IssueType": "直接发料      ",
        //         "LastReplyDate": "",
        //         "MaterialFormID": "527354",
        //         "MaterialID": 146438,
        //         "MaterialProp": "外购",
        //         "OweQty": -30,
        //         "Qty": 55,
        //         "SalesOrderDetailID": "114847",
        //         "ShortQty": null,
        //         "UnIssuedQty": 30,
        //         "dicID": 7862,
        //         "update": true,
        //         "JudgeResultText": "申购不足",
        //         'status2':'未关闭',
        //         'status3':'是否取消订单',
        //         'SetReplyTime':'',
        //         "复期": [
        //             {
        //                 "title": "采购足",
        //                 "value": "采购足",
        //                 "label": "采购足",
        //                 "text": "采购足"
        //             },
        //             {
        //                 "title": "未下单",
        //                 "value": "未下单",
        //                 "label": "未下单",
        //                 "text": "未下单"
        //             },
        //             {
        //                 "title": "申购不足",
        //                 "value": "申购不足",
        //                 "label": "申购不足",
        //                 "text": "申购不足"
        //             },
        //             {
        //                 "title": "交期冲突",
        //                 "value": "交期冲突",
        //                 "label": "交期冲突",
        //                 "text": "交期冲突"
        //             },
        //             {
        //                 "title": "待复期",
        //                 "value": "待复期",
        //                 "label": "待复期",
        //                 "text": "待复期"
        //             },
        //             {
        //                 "title": "数量不足",
        //                 "value": "数量不足",
        //                 "label": "数量不足",
        //                 "text": "数量不足"
        //             },
        //             {
        //                 "title": "满足",
        //                 "value": "满足",
        //                 "label": "满足",
        //                 "text": "满足"
        //             }
        //         ]
        //     },
        //     {
        //         "RowNumber": 3,
        //         "isChecked": false,
        //         "JudgeResult": "打样大货申请",
        //         "POSuplierName": "泓天,",
        //         "ProductName": "未审核",
        //         "Code": "61106142",
        //         "MaterialName": "后盖透风网压板（烤漆件）",
        //         "Spec": "1.5MM铁板，半光细黑砂户外漆，EK-M1500P HR",
        //         "StockQty": 0,
        //         "StockQty1": null,
        //         "StockQty2": null,
        //         "OncheckQty": 4,
        //         "OnloadQty": 4,
        //         "RealOweQty": 4,
        //         "StockQtyAllocationPrepare": 4,
        //         "LastDate": "2022-07-28",
        //         "ReplyQty": 4,
        //         "ReplyDate": "2022-08-31",
        //         "SecondReplyDate": "",
        //         "Remark4": null,
        //         "DemandReplyDate": "2022-08-28 21:34:28",
        //         "PODocs": "CGDD220829095,",
        //         "SalesOrderNo": "2022-12-06",
        //         "IsReplyStatusName": "是",
        //         "SurplusQty": null,
        //         "PMCRemark": "试产/三车间",
        //         "DemandQty": 280,
        //         "SalesRealOweNum": '正常',
        //         "PrepareDate": "2022-05-04",
        //         "PODate": "2022-08-29 14:19:45",
        //         "POTracker": "黄山娜",
        //         "SetReplyDate": "2022-08-25 21:34:28",
        //         "ValidReplyDate": "2022-08-31",
        //         "Extend11": "7",
        //         "IssueDate": "",
        //         "InDate": "2022-08-30 15:14:45",
        //         "InQty": 36,
        //         "WorkShopName": "三车间",
        //         "Remark5": "待检",
        //         "WarehouseName": "成品仓",
        //         "EditDisabled": 0,
        //         "ReqQty": null,
        //         "IsReplyStatusOther": 5,
        //         "Extend1": "采购足",
        //         "Remark6": "已复期，复期超时，复期异常，",
        //         "FirstReplyDate": "2022-08-29 20:08:34",
        //         "InspectDate": "2022-05-06 16:25:23",
        //         "IsReplyStatus": 1,
        //         "IssueType": "直接发料      ",
        //         "LastReplyDate": "",
        //         "MaterialFormID": "536353",
        //         "MaterialID": 153609,
        //         "MaterialProp": "外购",
        //         "OweQty": 0,
        //         "Qty": 140,
        //         "SalesOrderDetailID": "116948",
        //         "ShortQty": null,
        //         "UnIssuedQty": 4,
        //         "dicID": 7862,
        //         "update": true,
        //         "JudgeResultText": "采购足",
        //         'status2':'关闭',
        //         'status3':'是否取消订单',
        //         'SetReplyTime':'',
        //         "复期": [
        //             {
        //                 "title": "采购足",
        //                 "value": "采购足",
        //                 "label": "采购足",
        //                 "text": "采购足"
        //             },
        //             {
        //                 "title": "未下单",
        //                 "value": "未下单",
        //                 "label": "未下单",
        //                 "text": "未下单"
        //             },
        //             {
        //                 "title": "申购不足",
        //                 "value": "申购不足",
        //                 "label": "申购不足",
        //                 "text": "申购不足"
        //             },
        //             {
        //                 "title": "交期冲突",
        //                 "value": "交期冲突",
        //                 "label": "交期冲突",
        //                 "text": "交期冲突"
        //             },
        //             {
        //                 "title": "待复期",
        //                 "value": "待复期",
        //                 "label": "待复期",
        //                 "text": "待复期"
        //             },
        //             {
        //                 "title": "数量不足",
        //                 "value": "数量不足",
        //                 "label": "数量不足",
        //                 "text": "数量不足"
        //             },
        //             {
        //                 "title": "满足",
        //                 "value": "满足",
        //                 "label": "满足",
        //                 "text": "满足"
        //             }
        //         ]
        //     },
        //     {
        //         "RowNumber": 1,
        //         "isChecked": false,
        //         "JudgeResult": "打样采购申请",
        //         "POSuplierName": "吉华,",
        //         "ProductName": "已审核",
        //         "Code": "32300666",
        //         "MaterialName": "15度透镜",
        //         "Spec": "PMMA，15度",
        //         "StockQty": 0,
        //         "StockQty1": null,
        //         "StockQty2": null,
        //         "OncheckQty": 0,
        //         "OnloadQty": 4,
        //         "RealOweQty": 2,
        //         "StockQtyAllocationPrepare": 2,
        //         "LastDate": "2022-08-04",
        //         "ReplyQty": 2,
        //         "ReplyDate": "2022-08-23",
        //         "SecondReplyDate": "",
        //         "Remark4": "已找研发拿了2个给试产8-25",
        //         "DemandReplyDate": "2022-08-25 11:04:29",
        //         "PODocs": "CGDD220620080,CGDD220811021,",
        //         "SalesOrderNo": "2022-12-06",
        //         "IsReplyStatusName": "是",
        //         "SurplusQty": null,
        //         "PMCRemark": "试产/厂内",
        //         "DemandQty": 240,
        //         "SalesRealOweNum": '正常',
        //         "PrepareDate": "2022-04-19",
        //         "PODate": "2022-06-20 16:48:16",
        //         "POTracker": "韩琴",
        //         "SetReplyDate": "2022-08-22 11:04:29",
        //         "ValidReplyDate": "2022-08-23",
        //         "Extend11": "0",
        //         "IssueDate": "",
        //         "InDate": "",
        //         "InQty": 36,
        //         "WorkShopName": "二车间",
        //         "Remark5": "待检",
        //         "WarehouseName": "成品仓",
        //         "EditDisabled": 0,
        //         "ReqQty": null,
        //         "IsReplyStatusOther": 5,
        //         "Extend1": "采购足",
        //         "Remark6": "已复期，复期异常，",
        //         "FirstReplyDate": "2022-08-23 20:44:01",
        //         "InspectDate": "2022-04-20 14:01:56",
        //         "IsReplyStatus": 1,
        //         "IssueType": "直接发料      ",
        //         "LastReplyDate": "",
        //         "MaterialFormID": "524962",
        //         "MaterialID": 140226,
        //         "MaterialProp": "外购",
        //         "OweQty": -2,
        //         "Qty": 10,
        //         "SalesOrderDetailID": "116055",
        //         "ShortQty": null,
        //         "UnIssuedQty": 2,
        //         "dicID": 7862,
        //         "update": true,
        //         "JudgeResultText": "采购足",
        //         'status2':'未关闭',
        //         'status3':'是否取消订单',
        //         'SetReplyTime':48,
        //         "复期": [
        //             {
        //                 "title": "采购足",
        //                 "value": "采购足",
        //                 "label": "采购足",
        //                 "text": "采购足"
        //             },
        //             {
        //                 "title": "未下单",
        //                 "value": "未下单",
        //                 "label": "未下单",
        //                 "text": "未下单"
        //             },
        //             {
        //                 "title": "申购不足",
        //                 "value": "申购不足",
        //                 "label": "申购不足",
        //                 "text": "申购不足"
        //             },
        //             {
        //                 "title": "交期冲突",
        //                 "value": "交期冲突",
        //                 "label": "交期冲突",
        //                 "text": "交期冲突"
        //             },
        //             {
        //                 "title": "待复期",
        //                 "value": "待复期",
        //                 "label": "待复期",
        //                 "text": "待复期"
        //             },
        //             {
        //                 "title": "数量不足",
        //                 "value": "数量不足",
        //                 "label": "数量不足",
        //                 "text": "数量不足"
        //             },
        //             {
        //                 "title": "满足",
        //                 "value": "满足",
        //                 "label": "满足",
        //                 "text": "满足"
        //             }
        //         ]
        //     },
        //     {
        //         "RowNumber": 2,
        //         "isChecked": false,
        //         "JudgeResult": "打样委外采购申请",
        //         "POSuplierName": "无供应商,",
        //         "ProductName": "已审核",
        //         "Code": "52001918",
        //         "MaterialName": "停用：GV-M16QZ 雾化板 纸板",
        //         "Spec": "停用：1000*75mm，A3A加强120g，黄色纸板，3层纸",
        //         "StockQty": 0,
        //         "StockQty1": null,
        //         "StockQty2": null,
        //         "OncheckQty": 0,
        //         "OnloadQty": null,
        //         "RealOweQty": 30,
        //         "StockQtyAllocationPrepare": 30,
        //         "LastDate": "2022-07-30",
        //         "ReplyQty": 30,
        //         "ReplyDate": "2022-08-24",
        //         "SecondReplyDate": "",
        //         "Remark4": null,
        //         "DemandReplyDate": "2022-08-25 14:33:46",
        //         "PODocs": null,
        //         "SalesOrderNo": "2022-12-06",
        //         "IsReplyStatusName": "是",
        //         "SurplusQty": null,
        //         "PMCRemark": "试产/厂内",
        //         "DemandQty": 55,
        //         "SalesRealOweNum": '正常',
        //         "PrepareDate": "2022-04-22",
        //         "PODate": "",
        //         "POTracker": "黄山娜",
        //         "SetReplyDate": "2022-08-22 14:33:46",
        //         "ValidReplyDate": "2022-08-24",
        //         "Extend11": "10",
        //         "IssueDate": "",
        //         "InDate": "",
        //         "InQty": 36,
        //         "WorkShopName": "二车间",
        //         "Remark5": "待检",
        //         "WarehouseName": "成品仓",
        //         "EditDisabled": 0,
        //         "ReqQty": null,
        //         "IsReplyStatusOther": 5,
        //         "Extend1": "申购不足",
        //         "Remark6": "已复期，复期异常，",
        //         "FirstReplyDate": "2022-08-24 09:08:11",
        //         "InspectDate": "2022-04-23 08:00:46",
        //         "IsReplyStatus": 1,
        //         "IssueType": "直接发料      ",
        //         "LastReplyDate": "",
        //         "MaterialFormID": "527354",
        //         "MaterialID": 146438,
        //         "MaterialProp": "外购",
        //         "OweQty": -30,
        //         "Qty": 55,
        //         "SalesOrderDetailID": "114847",
        //         "ShortQty": null,
        //         "UnIssuedQty": 30,
        //         "dicID": 7862,
        //         "update": true,
        //         "JudgeResultText": "申购不足",
        //         'status2':'未关闭',
        //         'status3':'是否取消订单',
        //         'SetReplyTime':'',
        //         "复期": [
        //             {
        //                 "title": "采购足",
        //                 "value": "采购足",
        //                 "label": "采购足",
        //                 "text": "采购足"
        //             },
        //             {
        //                 "title": "未下单",
        //                 "value": "未下单",
        //                 "label": "未下单",
        //                 "text": "未下单"
        //             },
        //             {
        //                 "title": "申购不足",
        //                 "value": "申购不足",
        //                 "label": "申购不足",
        //                 "text": "申购不足"
        //             },
        //             {
        //                 "title": "交期冲突",
        //                 "value": "交期冲突",
        //                 "label": "交期冲突",
        //                 "text": "交期冲突"
        //             },
        //             {
        //                 "title": "待复期",
        //                 "value": "待复期",
        //                 "label": "待复期",
        //                 "text": "待复期"
        //             },
        //             {
        //                 "title": "数量不足",
        //                 "value": "数量不足",
        //                 "label": "数量不足",
        //                 "text": "数量不足"
        //             },
        //             {
        //                 "title": "满足",
        //                 "value": "满足",
        //                 "label": "满足",
        //                 "text": "满足"
        //             }
        //         ]
        //     },
        //     {
        //         "RowNumber": 3,
        //         "isChecked": false,
        //         "JudgeResult": "打样大货申请",
        //         "POSuplierName": "泓天,",
        //         "ProductName": "未审核",
        //         "Code": "61106142",
        //         "MaterialName": "后盖透风网压板（烤漆件）",
        //         "Spec": "1.5MM铁板，半光细黑砂户外漆，EK-M1500P HR",
        //         "StockQty": 0,
        //         "StockQty1": null,
        //         "StockQty2": null,
        //         "OncheckQty": 4,
        //         "OnloadQty": 4,
        //         "RealOweQty": 4,
        //         "StockQtyAllocationPrepare": 4,
        //         "LastDate": "2022-07-28",
        //         "ReplyQty": 4,
        //         "ReplyDate": "2022-08-31",
        //         "SecondReplyDate": "",
        //         "Remark4": null,
        //         "DemandReplyDate": "2022-08-28 21:34:28",
        //         "PODocs": "CGDD220829095,",
        //         "SalesOrderNo": "2022-12-06",
        //         "IsReplyStatusName": "是",
        //         "SurplusQty": null,
        //         "PMCRemark": "试产/三车间",
        //         "DemandQty": 280,
        //         "SalesRealOweNum": '正常',
        //         "PrepareDate": "2022-05-04",
        //         "PODate": "2022-08-29 14:19:45",
        //         "POTracker": "黄山娜",
        //         "SetReplyDate": "2022-08-25 21:34:28",
        //         "ValidReplyDate": "2022-08-31",
        //         "Extend11": "7",
        //         "IssueDate": "",
        //         "InDate": "2022-08-30 15:14:45",
        //         "InQty": 36,
        //         "WorkShopName": "三车间",
        //         "Remark5": "待检",
        //         "WarehouseName": "成品仓",
        //         "EditDisabled": 0,
        //         "ReqQty": null,
        //         "IsReplyStatusOther": 5,
        //         "Extend1": "采购足",
        //         "Remark6": "已复期，复期超时，复期异常，",
        //         "FirstReplyDate": "2022-08-29 20:08:34",
        //         "InspectDate": "2022-05-06 16:25:23",
        //         "IsReplyStatus": 1,
        //         "IssueType": "直接发料      ",
        //         "LastReplyDate": "",
        //         "MaterialFormID": "536353",
        //         "MaterialID": 153609,
        //         "MaterialProp": "外购",
        //         "OweQty": 0,
        //         "Qty": 140,
        //         "SalesOrderDetailID": "116948",
        //         "ShortQty": null,
        //         "UnIssuedQty": 4,
        //         "dicID": 7862,
        //         "update": true,
        //         "JudgeResultText": "采购足",
        //         'status2':'关闭',
        //         'status3':'是否取消订单',
        //         'SetReplyTime':'',
        //         "复期": [
        //             {
        //                 "title": "采购足",
        //                 "value": "采购足",
        //                 "label": "采购足",
        //                 "text": "采购足"
        //             },
        //             {
        //                 "title": "未下单",
        //                 "value": "未下单",
        //                 "label": "未下单",
        //                 "text": "未下单"
        //             },
        //             {
        //                 "title": "申购不足",
        //                 "value": "申购不足",
        //                 "label": "申购不足",
        //                 "text": "申购不足"
        //             },
        //             {
        //                 "title": "交期冲突",
        //                 "value": "交期冲突",
        //                 "label": "交期冲突",
        //                 "text": "交期冲突"
        //             },
        //             {
        //                 "title": "待复期",
        //                 "value": "待复期",
        //                 "label": "待复期",
        //                 "text": "待复期"
        //             },
        //             {
        //                 "title": "数量不足",
        //                 "value": "数量不足",
        //                 "label": "数量不足",
        //                 "text": "数量不足"
        //             },
        //             {
        //                 "title": "满足",
        //                 "value": "满足",
        //                 "label": "满足",
        //                 "text": "满足"
        //             }
        //         ]
        //     },
        //     {
        //         "RowNumber": 1,
        //         "isChecked": false,
        //         "JudgeResult": "打样采购申请",
        //         "POSuplierName": "吉华,",
        //         "ProductName": "已审核",
        //         "Code": "32300666",
        //         "MaterialName": "15度透镜",
        //         "Spec": "PMMA，15度",
        //         "StockQty": 0,
        //         "StockQty1": null,
        //         "StockQty2": null,
        //         "OncheckQty": 0,
        //         "OnloadQty": 4,
        //         "RealOweQty": 2,
        //         "StockQtyAllocationPrepare": 2,
        //         "LastDate": "2022-08-04",
        //         "ReplyQty": 2,
        //         "ReplyDate": "2022-08-23",
        //         "SecondReplyDate": "",
        //         "Remark4": "已找研发拿了2个给试产8-25",
        //         "DemandReplyDate": "2022-08-25 11:04:29",
        //         "PODocs": "CGDD220620080,CGDD220811021,",
        //         "SalesOrderNo": "2022-12-06",
        //         "IsReplyStatusName": "是",
        //         "SurplusQty": null,
        //         "PMCRemark": "试产/厂内",
        //         "DemandQty": 240,
        //         "SalesRealOweNum": '正常',
        //         "PrepareDate": "2022-04-19",
        //         "PODate": "2022-06-20 16:48:16",
        //         "POTracker": "韩琴",
        //         "SetReplyDate": "2022-08-22 11:04:29",
        //         "ValidReplyDate": "2022-08-23",
        //         "Extend11": "0",
        //         "IssueDate": "",
        //         "InDate": "",
        //         "InQty": 36,
        //         "WorkShopName": "二车间",
        //         "Remark5": "待检",
        //         "WarehouseName": "成品仓",
        //         "EditDisabled": 0,
        //         "ReqQty": null,
        //         "IsReplyStatusOther": 5,
        //         "Extend1": "采购足",
        //         "Remark6": "已复期，复期异常，",
        //         "FirstReplyDate": "2022-08-23 20:44:01",
        //         "InspectDate": "2022-04-20 14:01:56",
        //         "IsReplyStatus": 1,
        //         "IssueType": "直接发料      ",
        //         "LastReplyDate": "",
        //         "MaterialFormID": "524962",
        //         "MaterialID": 140226,
        //         "MaterialProp": "外购",
        //         "OweQty": -2,
        //         "Qty": 10,
        //         "SalesOrderDetailID": "116055",
        //         "ShortQty": null,
        //         "UnIssuedQty": 2,
        //         "dicID": 7862,
        //         "update": true,
        //         "JudgeResultText": "采购足",
        //         'status2':'未关闭',
        //         'status3':'是否取消订单',
        //         'SetReplyTime':48,
        //         "复期": [
        //             {
        //                 "title": "采购足",
        //                 "value": "采购足",
        //                 "label": "采购足",
        //                 "text": "采购足"
        //             },
        //             {
        //                 "title": "未下单",
        //                 "value": "未下单",
        //                 "label": "未下单",
        //                 "text": "未下单"
        //             },
        //             {
        //                 "title": "申购不足",
        //                 "value": "申购不足",
        //                 "label": "申购不足",
        //                 "text": "申购不足"
        //             },
        //             {
        //                 "title": "交期冲突",
        //                 "value": "交期冲突",
        //                 "label": "交期冲突",
        //                 "text": "交期冲突"
        //             },
        //             {
        //                 "title": "待复期",
        //                 "value": "待复期",
        //                 "label": "待复期",
        //                 "text": "待复期"
        //             },
        //             {
        //                 "title": "数量不足",
        //                 "value": "数量不足",
        //                 "label": "数量不足",
        //                 "text": "数量不足"
        //             },
        //             {
        //                 "title": "满足",
        //                 "value": "满足",
        //                 "label": "满足",
        //                 "text": "满足"
        //             }
        //         ]
        //     },
        //     {
        //         "RowNumber": 2,
        //         "isChecked": false,
        //         "JudgeResult": "打样委外采购申请",
        //         "POSuplierName": "无供应商,",
        //         "ProductName": "已审核",
        //         "Code": "52001918",
        //         "MaterialName": "停用：GV-M16QZ 雾化板 纸板",
        //         "Spec": "停用：1000*75mm，A3A加强120g，黄色纸板，3层纸",
        //         "StockQty": 0,
        //         "StockQty1": null,
        //         "StockQty2": null,
        //         "OncheckQty": 0,
        //         "OnloadQty": null,
        //         "RealOweQty": 30,
        //         "StockQtyAllocationPrepare": 30,
        //         "LastDate": "2022-07-30",
        //         "ReplyQty": 30,
        //         "ReplyDate": "2022-08-24",
        //         "SecondReplyDate": "",
        //         "Remark4": null,
        //         "DemandReplyDate": "2022-08-25 14:33:46",
        //         "PODocs": null,
        //         "SalesOrderNo": "2022-12-06",
        //         "IsReplyStatusName": "是",
        //         "SurplusQty": null,
        //         "PMCRemark": "试产/厂内",
        //         "DemandQty": 55,
        //         "SalesRealOweNum": '正常',
        //         "PrepareDate": "2022-04-22",
        //         "PODate": "",
        //         "POTracker": "黄山娜",
        //         "SetReplyDate": "2022-08-22 14:33:46",
        //         "ValidReplyDate": "2022-08-24",
        //         "Extend11": "10",
        //         "IssueDate": "",
        //         "InDate": "",
        //         "InQty": 36,
        //         "WorkShopName": "二车间",
        //         "Remark5": "待检",
        //         "WarehouseName": "成品仓",
        //         "EditDisabled": 0,
        //         "ReqQty": null,
        //         "IsReplyStatusOther": 5,
        //         "Extend1": "申购不足",
        //         "Remark6": "已复期，复期异常，",
        //         "FirstReplyDate": "2022-08-24 09:08:11",
        //         "InspectDate": "2022-04-23 08:00:46",
        //         "IsReplyStatus": 1,
        //         "IssueType": "直接发料      ",
        //         "LastReplyDate": "",
        //         "MaterialFormID": "527354",
        //         "MaterialID": 146438,
        //         "MaterialProp": "外购",
        //         "OweQty": -30,
        //         "Qty": 55,
        //         "SalesOrderDetailID": "114847",
        //         "ShortQty": null,
        //         "UnIssuedQty": 30,
        //         "dicID": 7862,
        //         "update": true,
        //         "JudgeResultText": "申购不足",
        //         'status2':'未关闭',
        //         'status3':'是否取消订单',
        //         'SetReplyTime':'',
        //         "复期": [
        //             {
        //                 "title": "采购足",
        //                 "value": "采购足",
        //                 "label": "采购足",
        //                 "text": "采购足"
        //             },
        //             {
        //                 "title": "未下单",
        //                 "value": "未下单",
        //                 "label": "未下单",
        //                 "text": "未下单"
        //             },
        //             {
        //                 "title": "申购不足",
        //                 "value": "申购不足",
        //                 "label": "申购不足",
        //                 "text": "申购不足"
        //             },
        //             {
        //                 "title": "交期冲突",
        //                 "value": "交期冲突",
        //                 "label": "交期冲突",
        //                 "text": "交期冲突"
        //             },
        //             {
        //                 "title": "待复期",
        //                 "value": "待复期",
        //                 "label": "待复期",
        //                 "text": "待复期"
        //             },
        //             {
        //                 "title": "数量不足",
        //                 "value": "数量不足",
        //                 "label": "数量不足",
        //                 "text": "数量不足"
        //             },
        //             {
        //                 "title": "满足",
        //                 "value": "满足",
        //                 "label": "满足",
        //                 "text": "满足"
        //             }
        //         ]
        //     },
        //     {
        //         "RowNumber": 3,
        //         "isChecked": false,
        //         "JudgeResult": "打样大货申请",
        //         "POSuplierName": "泓天,",
        //         "ProductName": "未审核",
        //         "Code": "61106142",
        //         "MaterialName": "后盖透风网压板（烤漆件）",
        //         "Spec": "1.5MM铁板，半光细黑砂户外漆，EK-M1500P HR",
        //         "StockQty": 0,
        //         "StockQty1": null,
        //         "StockQty2": null,
        //         "OncheckQty": 4,
        //         "OnloadQty": 4,
        //         "RealOweQty": 4,
        //         "StockQtyAllocationPrepare": 4,
        //         "LastDate": "2022-07-28",
        //         "ReplyQty": 4,
        //         "ReplyDate": "2022-08-31",
        //         "SecondReplyDate": "",
        //         "Remark4": null,
        //         "DemandReplyDate": "2022-08-28 21:34:28",
        //         "PODocs": "CGDD220829095,",
        //         "SalesOrderNo": "2022-12-06",
        //         "IsReplyStatusName": "是",
        //         "SurplusQty": null,
        //         "PMCRemark": "试产/三车间",
        //         "DemandQty": 280,
        //         "SalesRealOweNum": '正常',
        //         "PrepareDate": "2022-05-04",
        //         "PODate": "2022-08-29 14:19:45",
        //         "POTracker": "黄山娜",
        //         "SetReplyDate": "2022-08-25 21:34:28",
        //         "ValidReplyDate": "2022-08-31",
        //         "Extend11": "7",
        //         "IssueDate": "",
        //         "InDate": "2022-08-30 15:14:45",
        //         "InQty": 36,
        //         "WorkShopName": "三车间",
        //         "Remark5": "待检",
        //         "WarehouseName": "成品仓",
        //         "EditDisabled": 0,
        //         "ReqQty": null,
        //         "IsReplyStatusOther": 5,
        //         "Extend1": "采购足",
        //         "Remark6": "已复期，复期超时，复期异常，",
        //         "FirstReplyDate": "2022-08-29 20:08:34",
        //         "InspectDate": "2022-05-06 16:25:23",
        //         "IsReplyStatus": 1,
        //         "IssueType": "直接发料      ",
        //         "LastReplyDate": "",
        //         "MaterialFormID": "536353",
        //         "MaterialID": 153609,
        //         "MaterialProp": "外购",
        //         "OweQty": 0,
        //         "Qty": 140,
        //         "SalesOrderDetailID": "116948",
        //         "ShortQty": null,
        //         "UnIssuedQty": 4,
        //         "dicID": 7862,
        //         "update": true,
        //         "JudgeResultText": "采购足",
        //         'status2':'关闭',
        //         'status3':'是否取消订单',
        //         'SetReplyTime':'',
        //         "复期": [
        //             {
        //                 "title": "采购足",
        //                 "value": "采购足",
        //                 "label": "采购足",
        //                 "text": "采购足"
        //             },
        //             {
        //                 "title": "未下单",
        //                 "value": "未下单",
        //                 "label": "未下单",
        //                 "text": "未下单"
        //             },
        //             {
        //                 "title": "申购不足",
        //                 "value": "申购不足",
        //                 "label": "申购不足",
        //                 "text": "申购不足"
        //             },
        //             {
        //                 "title": "交期冲突",
        //                 "value": "交期冲突",
        //                 "label": "交期冲突",
        //                 "text": "交期冲突"
        //             },
        //             {
        //                 "title": "待复期",
        //                 "value": "待复期",
        //                 "label": "待复期",
        //                 "text": "待复期"
        //             },
        //             {
        //                 "title": "数量不足",
        //                 "value": "数量不足",
        //                 "label": "数量不足",
        //                 "text": "数量不足"
        //             },
        //             {
        //                 "title": "满足",
        //                 "value": "满足",
        //                 "label": "满足",
        //                 "text": "满足"
        //             }
        //         ]
        //     },
        //     {
        //         "RowNumber": 1,
        //         "isChecked": false,
        //         "JudgeResult": "打样采购申请",
        //         "POSuplierName": "吉华,",
        //         "ProductName": "已审核",
        //         "Code": "32300666",
        //         "MaterialName": "15度透镜",
        //         "Spec": "PMMA，15度",
        //         "StockQty": 0,
        //         "StockQty1": null,
        //         "StockQty2": null,
        //         "OncheckQty": 0,
        //         "OnloadQty": 4,
        //         "RealOweQty": 2,
        //         "StockQtyAllocationPrepare": 2,
        //         "LastDate": "2022-08-04",
        //         "ReplyQty": 2,
        //         "ReplyDate": "2022-08-23",
        //         "SecondReplyDate": "",
        //         "Remark4": "已找研发拿了2个给试产8-25",
        //         "DemandReplyDate": "2022-08-25 11:04:29",
        //         "PODocs": "CGDD220620080,CGDD220811021,",
        //         "SalesOrderNo": "2022-12-06",
        //         "IsReplyStatusName": "是",
        //         "SurplusQty": null,
        //         "PMCRemark": "试产/厂内",
        //         "DemandQty": 240,
        //         "SalesRealOweNum": '正常',
        //         "PrepareDate": "2022-04-19",
        //         "PODate": "2022-06-20 16:48:16",
        //         "POTracker": "韩琴",
        //         "SetReplyDate": "2022-08-22 11:04:29",
        //         "ValidReplyDate": "2022-08-23",
        //         "Extend11": "0",
        //         "IssueDate": "",
        //         "InDate": "",
        //         "InQty": 36,
        //         "WorkShopName": "二车间",
        //         "Remark5": "待检",
        //         "WarehouseName": "成品仓",
        //         "EditDisabled": 0,
        //         "ReqQty": null,
        //         "IsReplyStatusOther": 5,
        //         "Extend1": "采购足",
        //         "Remark6": "已复期，复期异常，",
        //         "FirstReplyDate": "2022-08-23 20:44:01",
        //         "InspectDate": "2022-04-20 14:01:56",
        //         "IsReplyStatus": 1,
        //         "IssueType": "直接发料      ",
        //         "LastReplyDate": "",
        //         "MaterialFormID": "524962",
        //         "MaterialID": 140226,
        //         "MaterialProp": "外购",
        //         "OweQty": -2,
        //         "Qty": 10,
        //         "SalesOrderDetailID": "116055",
        //         "ShortQty": null,
        //         "UnIssuedQty": 2,
        //         "dicID": 7862,
        //         "update": true,
        //         "JudgeResultText": "采购足",
        //         'status2':'未关闭',
        //         'status3':'是否取消订单',
        //         'SetReplyTime':48,
        //         "复期": [
        //             {
        //                 "title": "采购足",
        //                 "value": "采购足",
        //                 "label": "采购足",
        //                 "text": "采购足"
        //             },
        //             {
        //                 "title": "未下单",
        //                 "value": "未下单",
        //                 "label": "未下单",
        //                 "text": "未下单"
        //             },
        //             {
        //                 "title": "申购不足",
        //                 "value": "申购不足",
        //                 "label": "申购不足",
        //                 "text": "申购不足"
        //             },
        //             {
        //                 "title": "交期冲突",
        //                 "value": "交期冲突",
        //                 "label": "交期冲突",
        //                 "text": "交期冲突"
        //             },
        //             {
        //                 "title": "待复期",
        //                 "value": "待复期",
        //                 "label": "待复期",
        //                 "text": "待复期"
        //             },
        //             {
        //                 "title": "数量不足",
        //                 "value": "数量不足",
        //                 "label": "数量不足",
        //                 "text": "数量不足"
        //             },
        //             {
        //                 "title": "满足",
        //                 "value": "满足",
        //                 "label": "满足",
        //                 "text": "满足"
        //             }
        //         ]
        //     },
        //     {
        //         "RowNumber": 2,
        //         "isChecked": false,
        //         "JudgeResult": "打样委外采购申请",
        //         "POSuplierName": "无供应商,",
        //         "ProductName": "已审核",
        //         "Code": "52001918",
        //         "MaterialName": "停用：GV-M16QZ 雾化板 纸板",
        //         "Spec": "停用：1000*75mm，A3A加强120g，黄色纸板，3层纸",
        //         "StockQty": 0,
        //         "StockQty1": null,
        //         "StockQty2": null,
        //         "OncheckQty": 0,
        //         "OnloadQty": null,
        //         "RealOweQty": 30,
        //         "StockQtyAllocationPrepare": 30,
        //         "LastDate": "2022-07-30",
        //         "ReplyQty": 30,
        //         "ReplyDate": "2022-08-24",
        //         "SecondReplyDate": "",
        //         "Remark4": null,
        //         "DemandReplyDate": "2022-08-25 14:33:46",
        //         "PODocs": null,
        //         "SalesOrderNo": "2022-12-06",
        //         "IsReplyStatusName": "是",
        //         "SurplusQty": null,
        //         "PMCRemark": "试产/厂内",
        //         "DemandQty": 55,
        //         "SalesRealOweNum": '正常',
        //         "PrepareDate": "2022-04-22",
        //         "PODate": "",
        //         "POTracker": "黄山娜",
        //         "SetReplyDate": "2022-08-22 14:33:46",
        //         "ValidReplyDate": "2022-08-24",
        //         "Extend11": "10",
        //         "IssueDate": "",
        //         "InDate": "",
        //         "InQty": 36,
        //         "WorkShopName": "二车间",
        //         "Remark5": "待检",
        //         "WarehouseName": "成品仓",
        //         "EditDisabled": 0,
        //         "ReqQty": null,
        //         "IsReplyStatusOther": 5,
        //         "Extend1": "申购不足",
        //         "Remark6": "已复期，复期异常，",
        //         "FirstReplyDate": "2022-08-24 09:08:11",
        //         "InspectDate": "2022-04-23 08:00:46",
        //         "IsReplyStatus": 1,
        //         "IssueType": "直接发料      ",
        //         "LastReplyDate": "",
        //         "MaterialFormID": "527354",
        //         "MaterialID": 146438,
        //         "MaterialProp": "外购",
        //         "OweQty": -30,
        //         "Qty": 55,
        //         "SalesOrderDetailID": "114847",
        //         "ShortQty": null,
        //         "UnIssuedQty": 30,
        //         "dicID": 7862,
        //         "update": true,
        //         "JudgeResultText": "申购不足",
        //         'status2':'未关闭',
        //         'status3':'是否取消订单',
        //         'SetReplyTime':'',
        //         "复期": [
        //             {
        //                 "title": "采购足",
        //                 "value": "采购足",
        //                 "label": "采购足",
        //                 "text": "采购足"
        //             },
        //             {
        //                 "title": "未下单",
        //                 "value": "未下单",
        //                 "label": "未下单",
        //                 "text": "未下单"
        //             },
        //             {
        //                 "title": "申购不足",
        //                 "value": "申购不足",
        //                 "label": "申购不足",
        //                 "text": "申购不足"
        //             },
        //             {
        //                 "title": "交期冲突",
        //                 "value": "交期冲突",
        //                 "label": "交期冲突",
        //                 "text": "交期冲突"
        //             },
        //             {
        //                 "title": "待复期",
        //                 "value": "待复期",
        //                 "label": "待复期",
        //                 "text": "待复期"
        //             },
        //             {
        //                 "title": "数量不足",
        //                 "value": "数量不足",
        //                 "label": "数量不足",
        //                 "text": "数量不足"
        //             },
        //             {
        //                 "title": "满足",
        //                 "value": "满足",
        //                 "label": "满足",
        //                 "text": "满足"
        //             }
        //         ]
        //     },
        //     {
        //         "RowNumber": 3,
        //         "isChecked": false,
        //         "JudgeResult": "打样大货申请",
        //         "POSuplierName": "泓天,",
        //         "ProductName": "未审核",
        //         "Code": "61106142",
        //         "MaterialName": "后盖透风网压板（烤漆件）",
        //         "Spec": "1.5MM铁板，半光细黑砂户外漆，EK-M1500P HR",
        //         "StockQty": 0,
        //         "StockQty1": null,
        //         "StockQty2": null,
        //         "OncheckQty": 4,
        //         "OnloadQty": 4,
        //         "RealOweQty": 4,
        //         "StockQtyAllocationPrepare": 4,
        //         "LastDate": "2022-07-28",
        //         "ReplyQty": 4,
        //         "ReplyDate": "2022-08-31",
        //         "SecondReplyDate": "",
        //         "Remark4": null,
        //         "DemandReplyDate": "2022-08-28 21:34:28",
        //         "PODocs": "CGDD220829095,",
        //         "SalesOrderNo": "2022-12-06",
        //         "IsReplyStatusName": "是",
        //         "SurplusQty": null,
        //         "PMCRemark": "试产/三车间",
        //         "DemandQty": 280,
        //         "SalesRealOweNum": '正常',
        //         "PrepareDate": "2022-05-04",
        //         "PODate": "2022-08-29 14:19:45",
        //         "POTracker": "黄山娜",
        //         "SetReplyDate": "2022-08-25 21:34:28",
        //         "ValidReplyDate": "2022-08-31",
        //         "Extend11": "7",
        //         "IssueDate": "",
        //         "InDate": "2022-08-30 15:14:45",
        //         "InQty": 36,
        //         "WorkShopName": "三车间",
        //         "Remark5": "待检",
        //         "WarehouseName": "成品仓",
        //         "EditDisabled": 0,
        //         "ReqQty": null,
        //         "IsReplyStatusOther": 5,
        //         "Extend1": "采购足",
        //         "Remark6": "已复期，复期超时，复期异常，",
        //         "FirstReplyDate": "2022-08-29 20:08:34",
        //         "InspectDate": "2022-05-06 16:25:23",
        //         "IsReplyStatus": 1,
        //         "IssueType": "直接发料      ",
        //         "LastReplyDate": "",
        //         "MaterialFormID": "536353",
        //         "MaterialID": 153609,
        //         "MaterialProp": "外购",
        //         "OweQty": 0,
        //         "Qty": 140,
        //         "SalesOrderDetailID": "116948",
        //         "ShortQty": null,
        //         "UnIssuedQty": 4,
        //         "dicID": 7862,
        //         "update": true,
        //         "JudgeResultText": "采购足",
        //         'status2':'关闭',
        //         'status3':'是否取消订单',
        //         'SetReplyTime':'',
        //         "复期": [
        //             {
        //                 "title": "采购足",
        //                 "value": "采购足",
        //                 "label": "采购足",
        //                 "text": "采购足"
        //             },
        //             {
        //                 "title": "未下单",
        //                 "value": "未下单",
        //                 "label": "未下单",
        //                 "text": "未下单"
        //             },
        //             {
        //                 "title": "申购不足",
        //                 "value": "申购不足",
        //                 "label": "申购不足",
        //                 "text": "申购不足"
        //             },
        //             {
        //                 "title": "交期冲突",
        //                 "value": "交期冲突",
        //                 "label": "交期冲突",
        //                 "text": "交期冲突"
        //             },
        //             {
        //                 "title": "待复期",
        //                 "value": "待复期",
        //                 "label": "待复期",
        //                 "text": "待复期"
        //             },
        //             {
        //                 "title": "数量不足",
        //                 "value": "数量不足",
        //                 "label": "数量不足",
        //                 "text": "数量不足"
        //             },
        //             {
        //                 "title": "满足",
        //                 "value": "满足",
        //                 "label": "满足",
        //                 "text": "满足"
        //             }
        //         ]
        //     },
        //     {
        //         "RowNumber": 1,
        //         "isChecked": false,
        //         "JudgeResult": "打样采购申请",
        //         "POSuplierName": "吉华,",
        //         "ProductName": "已审核",
        //         "Code": "32300666",
        //         "MaterialName": "15度透镜",
        //         "Spec": "PMMA，15度",
        //         "StockQty": 0,
        //         "StockQty1": null,
        //         "StockQty2": null,
        //         "OncheckQty": 0,
        //         "OnloadQty": 4,
        //         "RealOweQty": 2,
        //         "StockQtyAllocationPrepare": 2,
        //         "LastDate": "2022-08-04",
        //         "ReplyQty": 2,
        //         "ReplyDate": "2022-08-23",
        //         "SecondReplyDate": "",
        //         "Remark4": "已找研发拿了2个给试产8-25",
        //         "DemandReplyDate": "2022-08-25 11:04:29",
        //         "PODocs": "CGDD220620080,CGDD220811021,",
        //         "SalesOrderNo": "2022-12-06",
        //         "IsReplyStatusName": "是",
        //         "SurplusQty": null,
        //         "PMCRemark": "试产/厂内",
        //         "DemandQty": 240,
        //         "SalesRealOweNum": '正常',
        //         "PrepareDate": "2022-04-19",
        //         "PODate": "2022-06-20 16:48:16",
        //         "POTracker": "韩琴",
        //         "SetReplyDate": "2022-08-22 11:04:29",
        //         "ValidReplyDate": "2022-08-23",
        //         "Extend11": "0",
        //         "IssueDate": "",
        //         "InDate": "",
        //         "InQty": 36,
        //         "WorkShopName": "二车间",
        //         "Remark5": "待检",
        //         "WarehouseName": "成品仓",
        //         "EditDisabled": 0,
        //         "ReqQty": null,
        //         "IsReplyStatusOther": 5,
        //         "Extend1": "采购足",
        //         "Remark6": "已复期，复期异常，",
        //         "FirstReplyDate": "2022-08-23 20:44:01",
        //         "InspectDate": "2022-04-20 14:01:56",
        //         "IsReplyStatus": 1,
        //         "IssueType": "直接发料      ",
        //         "LastReplyDate": "",
        //         "MaterialFormID": "524962",
        //         "MaterialID": 140226,
        //         "MaterialProp": "外购",
        //         "OweQty": -2,
        //         "Qty": 10,
        //         "SalesOrderDetailID": "116055",
        //         "ShortQty": null,
        //         "UnIssuedQty": 2,
        //         "dicID": 7862,
        //         "update": true,
        //         "JudgeResultText": "采购足",
        //         'status2':'未关闭',
        //         'status3':'是否取消订单',
        //         'SetReplyTime':48,
        //         "复期": [
        //             {
        //                 "title": "采购足",
        //                 "value": "采购足",
        //                 "label": "采购足",
        //                 "text": "采购足"
        //             },
        //             {
        //                 "title": "未下单",
        //                 "value": "未下单",
        //                 "label": "未下单",
        //                 "text": "未下单"
        //             },
        //             {
        //                 "title": "申购不足",
        //                 "value": "申购不足",
        //                 "label": "申购不足",
        //                 "text": "申购不足"
        //             },
        //             {
        //                 "title": "交期冲突",
        //                 "value": "交期冲突",
        //                 "label": "交期冲突",
        //                 "text": "交期冲突"
        //             },
        //             {
        //                 "title": "待复期",
        //                 "value": "待复期",
        //                 "label": "待复期",
        //                 "text": "待复期"
        //             },
        //             {
        //                 "title": "数量不足",
        //                 "value": "数量不足",
        //                 "label": "数量不足",
        //                 "text": "数量不足"
        //             },
        //             {
        //                 "title": "满足",
        //                 "value": "满足",
        //                 "label": "满足",
        //                 "text": "满足"
        //             }
        //         ]
        //     },
        //     {
        //         "RowNumber": 2,
        //         "isChecked": false,
        //         "JudgeResult": "打样委外采购申请",
        //         "POSuplierName": "无供应商,",
        //         "ProductName": "已审核",
        //         "Code": "52001918",
        //         "MaterialName": "停用：GV-M16QZ 雾化板 纸板",
        //         "Spec": "停用：1000*75mm，A3A加强120g，黄色纸板，3层纸",
        //         "StockQty": 0,
        //         "StockQty1": null,
        //         "StockQty2": null,
        //         "OncheckQty": 0,
        //         "OnloadQty": null,
        //         "RealOweQty": 30,
        //         "StockQtyAllocationPrepare": 30,
        //         "LastDate": "2022-07-30",
        //         "ReplyQty": 30,
        //         "ReplyDate": "2022-08-24",
        //         "SecondReplyDate": "",
        //         "Remark4": null,
        //         "DemandReplyDate": "2022-08-25 14:33:46",
        //         "PODocs": null,
        //         "SalesOrderNo": "2022-12-06",
        //         "IsReplyStatusName": "是",
        //         "SurplusQty": null,
        //         "PMCRemark": "试产/厂内",
        //         "DemandQty": 55,
        //         "SalesRealOweNum": '正常',
        //         "PrepareDate": "2022-04-22",
        //         "PODate": "",
        //         "POTracker": "黄山娜",
        //         "SetReplyDate": "2022-08-22 14:33:46",
        //         "ValidReplyDate": "2022-08-24",
        //         "Extend11": "10",
        //         "IssueDate": "",
        //         "InDate": "",
        //         "InQty": 36,
        //         "WorkShopName": "二车间",
        //         "Remark5": "待检",
        //         "WarehouseName": "成品仓",
        //         "EditDisabled": 0,
        //         "ReqQty": null,
        //         "IsReplyStatusOther": 5,
        //         "Extend1": "申购不足",
        //         "Remark6": "已复期，复期异常，",
        //         "FirstReplyDate": "2022-08-24 09:08:11",
        //         "InspectDate": "2022-04-23 08:00:46",
        //         "IsReplyStatus": 1,
        //         "IssueType": "直接发料      ",
        //         "LastReplyDate": "",
        //         "MaterialFormID": "527354",
        //         "MaterialID": 146438,
        //         "MaterialProp": "外购",
        //         "OweQty": -30,
        //         "Qty": 55,
        //         "SalesOrderDetailID": "114847",
        //         "ShortQty": null,
        //         "UnIssuedQty": 30,
        //         "dicID": 7862,
        //         "update": true,
        //         "JudgeResultText": "申购不足",
        //         'status2':'未关闭',
        //         'status3':'是否取消订单',
        //         'SetReplyTime':'',
        //         "复期": [
        //             {
        //                 "title": "采购足",
        //                 "value": "采购足",
        //                 "label": "采购足",
        //                 "text": "采购足"
        //             },
        //             {
        //                 "title": "未下单",
        //                 "value": "未下单",
        //                 "label": "未下单",
        //                 "text": "未下单"
        //             },
        //             {
        //                 "title": "申购不足",
        //                 "value": "申购不足",
        //                 "label": "申购不足",
        //                 "text": "申购不足"
        //             },
        //             {
        //                 "title": "交期冲突",
        //                 "value": "交期冲突",
        //                 "label": "交期冲突",
        //                 "text": "交期冲突"
        //             },
        //             {
        //                 "title": "待复期",
        //                 "value": "待复期",
        //                 "label": "待复期",
        //                 "text": "待复期"
        //             },
        //             {
        //                 "title": "数量不足",
        //                 "value": "数量不足",
        //                 "label": "数量不足",
        //                 "text": "数量不足"
        //             },
        //             {
        //                 "title": "满足",
        //                 "value": "满足",
        //                 "label": "满足",
        //                 "text": "满足"
        //             }
        //         ]
        //     },
        //     {
        //         "RowNumber": 3,
        //         "isChecked": false,
        //         "JudgeResult": "打样大货申请",
        //         "POSuplierName": "泓天,",
        //         "ProductName": "未审核",
        //         "Code": "61106142",
        //         "MaterialName": "后盖透风网压板（烤漆件）",
        //         "Spec": "1.5MM铁板，半光细黑砂户外漆，EK-M1500P HR",
        //         "StockQty": 0,
        //         "StockQty1": null,
        //         "StockQty2": null,
        //         "OncheckQty": 4,
        //         "OnloadQty": 4,
        //         "RealOweQty": 4,
        //         "StockQtyAllocationPrepare": 4,
        //         "LastDate": "2022-07-28",
        //         "ReplyQty": 4,
        //         "ReplyDate": "2022-08-31",
        //         "SecondReplyDate": "",
        //         "Remark4": null,
        //         "DemandReplyDate": "2022-08-28 21:34:28",
        //         "PODocs": "CGDD220829095,",
        //         "SalesOrderNo": "2022-12-06",
        //         "IsReplyStatusName": "是",
        //         "SurplusQty": null,
        //         "PMCRemark": "试产/三车间",
        //         "DemandQty": 280,
        //         "SalesRealOweNum": '正常',
        //         "PrepareDate": "2022-05-04",
        //         "PODate": "2022-08-29 14:19:45",
        //         "POTracker": "黄山娜",
        //         "SetReplyDate": "2022-08-25 21:34:28",
        //         "ValidReplyDate": "2022-08-31",
        //         "Extend11": "7",
        //         "IssueDate": "",
        //         "InDate": "2022-08-30 15:14:45",
        //         "InQty": 36,
        //         "WorkShopName": "三车间",
        //         "Remark5": "待检",
        //         "WarehouseName": "成品仓",
        //         "EditDisabled": 0,
        //         "ReqQty": null,
        //         "IsReplyStatusOther": 5,
        //         "Extend1": "采购足",
        //         "Remark6": "已复期，复期超时，复期异常，",
        //         "FirstReplyDate": "2022-08-29 20:08:34",
        //         "InspectDate": "2022-05-06 16:25:23",
        //         "IsReplyStatus": 1,
        //         "IssueType": "直接发料      ",
        //         "LastReplyDate": "",
        //         "MaterialFormID": "536353",
        //         "MaterialID": 153609,
        //         "MaterialProp": "外购",
        //         "OweQty": 0,
        //         "Qty": 140,
        //         "SalesOrderDetailID": "116948",
        //         "ShortQty": null,
        //         "UnIssuedQty": 4,
        //         "dicID": 7862,
        //         "update": true,
        //         "JudgeResultText": "采购足",
        //         'status2':'关闭',
        //         'status3':'是否取消订单',
        //         'SetReplyTime':'',
        //         "复期": [
        //             {
        //                 "title": "采购足",
        //                 "value": "采购足",
        //                 "label": "采购足",
        //                 "text": "采购足"
        //             },
        //             {
        //                 "title": "未下单",
        //                 "value": "未下单",
        //                 "label": "未下单",
        //                 "text": "未下单"
        //             },
        //             {
        //                 "title": "申购不足",
        //                 "value": "申购不足",
        //                 "label": "申购不足",
        //                 "text": "申购不足"
        //             },
        //             {
        //                 "title": "交期冲突",
        //                 "value": "交期冲突",
        //                 "label": "交期冲突",
        //                 "text": "交期冲突"
        //             },
        //             {
        //                 "title": "待复期",
        //                 "value": "待复期",
        //                 "label": "待复期",
        //                 "text": "待复期"
        //             },
        //             {
        //                 "title": "数量不足",
        //                 "value": "数量不足",
        //                 "label": "数量不足",
        //                 "text": "数量不足"
        //             },
        //             {
        //                 "title": "满足",
        //                 "value": "满足",
        //                 "label": "满足",
        //                 "text": "满足"
        //             }
        //         ]
        //     },
        // ]
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
      },
      // 改变状态
      changeStatus(x, index) {
        this.labelStatus1 = index;
        this.formSearchs[0].datas["IsReplyStatusOther"] = x.value;
        this.dataSearch(0);
      },
      // 可用量查询
      usingSearch(row, prop) {
        this.formSearchs[1].datas["MaterialID"] = row.MaterialID;
        this.formSearchs[1].datas["Remark1"] = "送货";
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
        } else {
          this.adminLoading = false;
          this.$message({
            message: msg,
            type: "error",
            dangerouslyUseHTMLString: true,
          });
        }
      },
      // 取消
      async cancelSave(remarkTb, index) {
        if (this.selectionData[remarkTb].length == 0) {
          this.$message.error("请选择需要取消的数据！");
          return;
        } else {
            this.$confirm("确定要取消吗？")
          .then(async(_) => {
            _this.selectionData[remarkTb].map((item)=>{
                // 取消修改状态为未复期
                item['IsReplyStatusOther'] = 0
            })
            let newData = _this.selectionData[remarkTb]
            _this.generalSaveData(newData, remarkTb)
          })
          .catch((_) => {});
        }
      },
    },
  };
  </script>
  