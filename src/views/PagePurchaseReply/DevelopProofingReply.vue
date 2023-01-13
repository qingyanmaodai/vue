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
                        placeholder="日期选择"
                      >
                      </el-date-picker>
                      <el-divider direction="vertical"></el-divider>
                      <el-button
                        v-for="(ele,i) in parmsBtn2" :key="ele.BtnName"
                        :type="ele.Type"
                        :size="ele.Size"
                        @click="btnClick(ele.Methods, ele.Params,i)"
                        
                      >
                        {{ ele.BtnName }}
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
    UpdateOrderBomPOTracker,
  } from "@/api/Common";
  import ComFormDialog from "@/components/ComFormDialog";
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
          { label: "已复期", value: [1, 2, 3, 4, 5] },
          // { label: "全部", value: "" },
          // { label: "待复期", value: 0 },
          // { label: "复期超时", value: 5 },
          // { label: "三天内即将到期", value: 4 },
          // { label: "已复期", value: [1, 2, 3, 4, 5] },
          // { label: "复期异常", value: 2 },
          // { label: "复期变更", value: 3 },
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
            ButtonCode: "noPass",
            BtnName: "取消",
            Type: "danger",
            Ghost: true,
            Size: "small",
            Methods: "cancelSave",
            Icon: "",
          },
        ],
        parmsBtn2: [
          {
            ButtonCode: "save",
            BtnName: "批量回复日期",
            Type: "primary",
            Ghost: true,
            Size: "small",
            Methods: "changeDate",
            Icon: "",
            Params:{val:0},
          },
          // {
          //   ButtonCode: "save",
          //   BtnName: "批量二次回复日期",
          //   Type: "warning",
          //   Ghost: true,
          //   Size: "small",
          //   Methods: "changeDate",
          //   Icon: "",
          //   Params:{val:1}
          // },
          {
            ButtonCode: "syncSave",
            BtnName: "同步更新采购员",
            Type: "success",
            Ghost: true,
            Size: "small",
            Methods: "refreshPOTraker",
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
        sysID: [{ ID: 9023 }],
        userInfo: {},
        IsPurchaseBoss: false,
        footerLabel: [""],
        RoleMapStatus:false,
      };
    },
    computed: {},
    created() {
      _this = this;
      this.getTableHeader();
      this.judgeBtn();
      let RoleMapList  = this.$store.getters.userInfo.RoleMap
      if(RoleMapList.length){
        RoleMapList.forEach(item=>{
          if(item.RoleID==='R2106240002'){
            this.RoleMapStatus = true
            return
          }
        })
      }
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
          this.fileList.findIndex((item) => item.url === file.url),
          1
        );
      },
      // 判断按钮权限
      judgeBtn() {
        let routeBtn = this.$route.meta.btns;
        let newBtn = [];
        let permission = false;
        let newBtn2 = []
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
            let newData2 = this.parmsBtn2.filter((y) => {
              return x.ButtonCode == y.ButtonCode;
            });
            if (newData2.length != 0) {
              newBtn2 = newBtn2.concat(newData2);
            }
          });
        }
        this.$set(this, "btnForm", newBtn);
        this.$set(this, "isEdit", permission);
        this.$set(this, "parmsBtn2", newBtn2);
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
              if (!obj.ReplyDateM1 && !obj.ReplyDateM2) {
                obj.IsReplyStatus = 0;
              } else {
                obj.IsReplyStatus = 1;
              }
              // 判断如果是第一次填复期，写进日期 ，如果是第一次填二次复期，写进日期
              // if (obj.tag_1 == 1 && obj.ReplyDateM1) {
              //   obj.FirstReplyDate = data;
              // }
              // if (obj.tag_2 == 1 && obj.ReplyDateM2) {
              //   obj.LastReplyDate = data;
              // }
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
      // 单击行
      handleRowClick(row, remarkTb) {
        this.delData[remarkTb] = [];
        this.delData[remarkTb].push(row);
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
          this.getTableData(this.formSearchs[0].datas, 0);
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
        let { result, data, count, msg } = res.data;
        if (result) {
          if (data.length != 0) {
            // data = [
            // {
            //     "RowNumber": 1,
            //     "isChecked": false,
            //     "JudgeResult": "打样采购申请",
            //     "POSuplierName": "吉华,",
            //     "ProductName": "已审核",
            //     "Code": "32300666",
            //     "MaterialName": "15度透镜",
            //     "Spec": "PMMA，15度",
            //     "StockQty": 0,
            //     "StockQty1": null,
            //     "StockQty2": null,
            //     "OncheckQty": 0,
            //     "OnloadQty": 4,
            //     "RealOweQty": 2,
            //     "StockQtyAllocationPrepare": 2,
            //     "LastDate": "2022-08-04",
            //     "ReplyQty": 2,
            //     "ReplyDateM1": "2022-08-04",
            //     "ReplyDateM2": "2022-08-04",
            //     "ReplyDate":'2022-08-04',
            //     "Remark4": "已找研发拿了2个给试产8-25",
            //     "DemandReplyDate": "2022-08-25 11:04:29",
            //     "PODocs": "CGDD220620080,CGDD220811021,",
            //     "SalesOrderNo": "2022-12-06",
            //     "IsReplyStatusName": "是",
            //     "SurplusQty": null,
            //     "PMCRemark": "试产/厂内",
            //     "DemandQty": 240,
            //     "SalesRealOweNum": '正常',
            //     "PrepareDate": "2022-04-19",
            //     "PODate": "2022-06-20 16:48:16",
            //     "POTracker": "韩琴",
            //     "SetReplyDate": "2022-08-22 11:04:29",
            //     "ValidReplyDate": "2022-08-23",
            //     "Extend11": "0",
            //     "IssueDate": "",
            //     "InDate": "",
            //     "InQty": 36,
            //     "WorkShopName": "二车间",
            //     "Remark5": "待检",
            //     "WarehouseName": "成品仓",
            //     "EditDisabled": 0,
            //     "ReqQty": null,
            //     "ReplyStatus": 5,
            //     "Extend1": "采购足",
            //     "Remark6": "已复期，复期异常，",
            //     "FirstReplyDate": "2022-08-23 20:44:01",
            //     "InspectDate": "2022-04-20 14:01:56",
            //     "IsReplyStatus": 1,
            //     "IssueType": "直接发料      ",
            //     "LastReplyDate": "",
            //     "MaterialFormID": "524962",
            //     "MaterialID": 140226,
            //     "MaterialProp": "外购",
            //     "OweQty": -2,
            //     "Qty": 10,
            //     "SalesOrderDetailID": "116055",
            //     "ShortQty": null,
            //     "UnIssuedQty": 2,
            //     "dicID": 9023,
            //     "update": true,
            //     "JudgeResultText": "采购足",
            //     'status2':'未关闭',
            //     'status3':'是否取消订单',
            //     'SetReplyTime':48,
            //     "复期": [
            //         {
            //             "title": "采购足",
            //             "value": "采购足",
            //             "label": "采购足",
            //             "text": "采购足"
            //         },
            //         {
            //             "title": "未下单",
            //             "value": "未下单",
            //             "label": "未下单",
            //             "text": "未下单"
            //         },
            //         {
            //             "title": "申购不足",
            //             "value": "申购不足",
            //             "label": "申购不足",
            //             "text": "申购不足"
            //         },
            //         {
            //             "title": "交期冲突",
            //             "value": "交期冲突",
            //             "label": "交期冲突",
            //             "text": "交期冲突"
            //         },
            //         {
            //             "title": "待复期",
            //             "value": "待复期",
            //             "label": "待复期",
            //             "text": "待复期"
            //         },
            //         {
            //             "title": "数量不足",
            //             "value": "数量不足",
            //             "label": "数量不足",
            //             "text": "数量不足"
            //         },
            //         {
            //             "title": "满足",
            //             "value": "满足",
            //             "label": "满足",
            //             "text": "满足"
            //         }
            //     ]
            // },
            // {
            //     "RowNumber": 2,
            //     "isChecked": false,
            //     "JudgeResult": "打样委外采购申请",
            //     "POSuplierName": "无供应商,",
            //     "ProductName": "已审核",
            //     "Code": "52001918",
            //     "MaterialName": "停用：GV-M16QZ 雾化板 纸板",
            //     "Spec": "停用：1000*75mm，A3A加强120g，黄色纸板，3层纸",
            //     "StockQty": 0,
            //     "StockQty1": null,
            //     "StockQty2": null,
            //     "OncheckQty": 0,
            //     "OnloadQty": null,
            //     "RealOweQty": 30,
            //     "StockQtyAllocationPrepare": 30,
            //     "LastDate": "2022-07-30",
            //     "ReplyQty": 30,
            //     "ReplyDateM1": "2022-08-24",
            //     "ReplyDateM2": "",
            //     "ReplyDate":"2022-08-24",
            //     "Remark4": null,
            //     "DemandReplyDate": "2022-08-25 14:33:46",
            //     "PODocs": null,
            //     "SalesOrderNo": "2022-12-06",
            //     "IsReplyStatusName": "是",
            //     "SurplusQty": null,
            //     "PMCRemark": "试产/厂内",
            //     "DemandQty": 55,
            //     "SalesRealOweNum": '正常',
            //     "PrepareDate": "2022-04-22",
            //     "PODate": "",
            //     "POTracker": "黄山娜",
            //     "SetReplyDate": "2022-08-22 14:33:46",
            //     "ValidReplyDate": "2022-08-24",
            //     "Extend11": "10",
            //     "IssueDate": "",
            //     "InDate": "",
            //     "InQty": 36,
            //     "WorkShopName": "二车间",
            //     "Remark5": "待检",
            //     "WarehouseName": "成品仓",
            //     "EditDisabled": 0,
            //     "ReqQty": null,
            //     "ReplyStatus": 5,
            //     "Extend1": "申购不足",
            //     "Remark6": "已复期，复期异常，",
            //     "FirstReplyDate": "2022-08-24 09:08:11",
            //     "InspectDate": "2022-04-23 08:00:46",
            //     "IsReplyStatus": 1,
            //     "IssueType": "直接发料      ",
            //     "LastReplyDate": "",
            //     "MaterialFormID": "527354",
            //     "MaterialID": 146438,
            //     "MaterialProp": "外购",
            //     "OweQty": -30,
            //     "Qty": 55,
            //     "SalesOrderDetailID": "114847",
            //     "ShortQty": null,
            //     "UnIssuedQty": 30,
            //     "dicID": 9023,
            //     "update": true,
            //     "JudgeResultText": "申购不足",
            //     'status2':'未关闭',
            //     'status3':'是否取消订单',
            //     'SetReplyTime':'',
            //     "复期": [
            //         {
            //             "title": "采购足",
            //             "value": "采购足",
            //             "label": "采购足",
            //             "text": "采购足"
            //         },
            //         {
            //             "title": "未下单",
            //             "value": "未下单",
            //             "label": "未下单",
            //             "text": "未下单"
            //         },
            //         {
            //             "title": "申购不足",
            //             "value": "申购不足",
            //             "label": "申购不足",
            //             "text": "申购不足"
            //         },
            //         {
            //             "title": "交期冲突",
            //             "value": "交期冲突",
            //             "label": "交期冲突",
            //             "text": "交期冲突"
            //         },
            //         {
            //             "title": "待复期",
            //             "value": "待复期",
            //             "label": "待复期",
            //             "text": "待复期"
            //         },
            //         {
            //             "title": "数量不足",
            //             "value": "数量不足",
            //             "label": "数量不足",
            //             "text": "数量不足"
            //         },
            //         {
            //             "title": "满足",
            //             "value": "满足",
            //             "label": "满足",
            //             "text": "满足"
            //         }
            //     ]
            // },
            // {
            //     "RowNumber": 3,
            //     "isChecked": false,
            //     "JudgeResult": "打样大货申请",
            //     "POSuplierName": "泓天,",
            //     "ProductName": "未审核",
            //     "Code": "61106142",
            //     "MaterialName": "后盖透风网压板（烤漆件）",
            //     "Spec": "1.5MM铁板，半光细黑砂户外漆，EK-M1500P HR",
            //     "StockQty": 0,
            //     "StockQty1": null,
            //     "StockQty2": null,
            //     "OncheckQty": 4,
            //     "OnloadQty": 4,
            //     "RealOweQty": 4,
            //     "StockQtyAllocationPrepare": 4,
            //     "LastDate": "2022-07-28",
            //     "ReplyQty": 4,
            //     "ReplyDateM1": "",
            //     "ReplyDateM2": "",
            //     "ReplyDate":"2022-07-28",
            //     "Remark4": null,
            //     "DemandReplyDate": "2022-08-28 21:34:28",
            //     "PODocs": "CGDD220829095,",
            //     "SalesOrderNo": "2022-12-06",
            //     "IsReplyStatusName": "是",
            //     "SurplusQty": null,
            //     "PMCRemark": "试产/三车间",
            //     "DemandQty": 280,
            //     "SalesRealOweNum": '正常',
            //     "PrepareDate": "2022-05-04",
            //     "PODate": "2022-08-29 14:19:45",
            //     "POTracker": "黄山娜",
            //     "SetReplyDate": "2022-08-25 21:34:28",
            //     "ValidReplyDate": "2022-08-31",
            //     "Extend11": "7",
            //     "IssueDate": "",
            //     "InDate": "2022-08-30 15:14:45",
            //     "InQty": 36,
            //     "WorkShopName": "三车间",
            //     "Remark5": "待检",
            //     "WarehouseName": "成品仓",
            //     "EditDisabled": 0,
            //     "ReqQty": null,
            //     "ReplyStatus": 5,
            //     "Extend1": "采购足",
            //     "Remark6": "已复期，复期超时，复期异常，",
            //     "FirstReplyDate": "2022-08-29 20:08:34",
            //     "InspectDate": "2022-05-06 16:25:23",
            //     "IsReplyStatus": 1,
            //     "IssueType": "直接发料      ",
            //     "LastReplyDate": "",
            //     "MaterialFormID": "536353",
            //     "MaterialID": 153609,
            //     "MaterialProp": "外购",
            //     "OweQty": 0,
            //     "Qty": 140,
            //     "SalesOrderDetailID": "116948",
            //     "ShortQty": null,
            //     "UnIssuedQty": 4,
            //     "dicID": 9023,
            //     "update": true,
            //     "JudgeResultText": "采购足",
            //     'status2':'关闭',
            //     'status3':'是否取消订单',
            //     'SetReplyTime':'',
            //     "复期": [
            //         {
            //             "title": "采购足",
            //             "value": "采购足",
            //             "label": "采购足",
            //             "text": "采购足"
            //         },
            //         {
            //             "title": "未下单",
            //             "value": "未下单",
            //             "label": "未下单",
            //             "text": "未下单"
            //         },
            //         {
            //             "title": "申购不足",
            //             "value": "申购不足",
            //             "label": "申购不足",
            //             "text": "申购不足"
            //         },
            //         {
            //             "title": "交期冲突",
            //             "value": "交期冲突",
            //             "label": "交期冲突",
            //             "text": "交期冲突"
            //         },
            //         {
            //             "title": "待复期",
            //             "value": "待复期",
            //             "label": "待复期",
            //             "text": "待复期"
            //         },
            //         {
            //             "title": "数量不足",
            //             "value": "数量不足",
            //             "label": "数量不足",
            //             "text": "数量不足"
            //         },
            //         {
            //             "title": "满足",
            //             "value": "满足",
            //             "label": "满足",
            //             "text": "满足"
            //         }
            //     ]
            // },
            // {
            //     "RowNumber": 1,
            //     "isChecked": false,
            //     "JudgeResult": "打样采购申请",
            //     "POSuplierName": "吉华,",
            //     "ProductName": "已审核",
            //     "Code": "32300666",
            //     "MaterialName": "15度透镜",
            //     "Spec": "PMMA，15度",
            //     "StockQty": 0,
            //     "StockQty1": null,
            //     "StockQty2": null,
            //     "OncheckQty": 0,
            //     "OnloadQty": 4,
            //     "RealOweQty": 2,
            //     "StockQtyAllocationPrepare": 2,
            //     "LastDate": "2022-08-04",
            //     "ReplyQty": 2,
            //     "ReplyDateM1": "",
            //     "ReplyDateM2": "",
            //     "Remark4": "已找研发拿了2个给试产8-25",
            //     "DemandReplyDate": "2022-08-25 11:04:29",
            //     "PODocs": "CGDD220620080,CGDD220811021,",
            //     "SalesOrderNo": "2022-12-06",
            //     "IsReplyStatusName": "是",
            //     "SurplusQty": null,
            //     "PMCRemark": "试产/厂内",
            //     "DemandQty": 240,
            //     "SalesRealOweNum": '正常',
            //     "PrepareDate": "2022-04-19",
            //     "PODate": "2022-06-20 16:48:16",
            //     "POTracker": "韩琴",
            //     "SetReplyDate": "2022-08-22 11:04:29",
            //     "ValidReplyDate": "2022-08-23",
            //     "Extend11": "0",
            //     "IssueDate": "",
            //     "InDate": "",
            //     "InQty": 36,
            //     "WorkShopName": "二车间",
            //     "Remark5": "待检",
            //     "WarehouseName": "成品仓",
            //     "EditDisabled": 0,
            //     "ReqQty": null,
            //     "ReplyStatus": 5,
            //     "Extend1": "采购足",
            //     "Remark6": "已复期，复期异常，",
            //     "FirstReplyDate": "2022-08-23 20:44:01",
            //     "InspectDate": "2022-04-20 14:01:56",
            //     "IsReplyStatus": 1,
            //     "IssueType": "直接发料      ",
            //     "LastReplyDate": "",
            //     "MaterialFormID": "524962",
            //     "MaterialID": 140226,
            //     "MaterialProp": "外购",
            //     "OweQty": -2,
            //     "Qty": 10,
            //     "SalesOrderDetailID": "116055",
            //     "ShortQty": null,
            //     "UnIssuedQty": 2,
            //     "dicID": 9023,
            //     "update": true,
            //     "JudgeResultText": "采购足",
            //     'status2':'未关闭',
            //     'status3':'是否取消订单',
            //     'SetReplyTime':48,
            //     "复期": [
            //         {
            //             "title": "采购足",
            //             "value": "采购足",
            //             "label": "采购足",
            //             "text": "采购足"
            //         },
            //         {
            //             "title": "未下单",
            //             "value": "未下单",
            //             "label": "未下单",
            //             "text": "未下单"
            //         },
            //         {
            //             "title": "申购不足",
            //             "value": "申购不足",
            //             "label": "申购不足",
            //             "text": "申购不足"
            //         },
            //         {
            //             "title": "交期冲突",
            //             "value": "交期冲突",
            //             "label": "交期冲突",
            //             "text": "交期冲突"
            //         },
            //         {
            //             "title": "待复期",
            //             "value": "待复期",
            //             "label": "待复期",
            //             "text": "待复期"
            //         },
            //         {
            //             "title": "数量不足",
            //             "value": "数量不足",
            //             "label": "数量不足",
            //             "text": "数量不足"
            //         },
            //         {
            //             "title": "满足",
            //             "value": "满足",
            //             "label": "满足",
            //             "text": "满足"
            //         }
            //     ]
            // },
            // {
            //     "RowNumber": 2,
            //     "isChecked": false,
            //     "JudgeResult": "打样委外采购申请",
            //     "POSuplierName": "无供应商,",
            //     "ProductName": "已审核",
            //     "Code": "52001918",
            //     "MaterialName": "停用：GV-M16QZ 雾化板 纸板",
            //     "Spec": "停用：1000*75mm，A3A加强120g，黄色纸板，3层纸",
            //     "StockQty": 0,
            //     "StockQty1": null,
            //     "StockQty2": null,
            //     "OncheckQty": 0,
            //     "OnloadQty": null,
            //     "RealOweQty": 30,
            //     "StockQtyAllocationPrepare": 30,
            //     "LastDate": "2022-07-30",
            //     "ReplyQty": 30,
            //     "ReplyDateM1": "2022-08-24",
            //     "ReplyDateM2": "",
            //     "Remark4": null,
            //     "DemandReplyDate": "2022-08-25 14:33:46",
            //     "PODocs": null,
            //     "SalesOrderNo": "2022-12-06",
            //     "IsReplyStatusName": "是",
            //     "SurplusQty": null,
            //     "PMCRemark": "试产/厂内",
            //     "DemandQty": 55,
            //     "SalesRealOweNum": '正常',
            //     "PrepareDate": "2022-04-22",
            //     "PODate": "",
            //     "POTracker": "黄山娜",
            //     "SetReplyDate": "2022-08-22 14:33:46",
            //     "ValidReplyDate": "2022-08-24",
            //     "Extend11": "10",
            //     "IssueDate": "",
            //     "InDate": "",
            //     "InQty": 36,
            //     "WorkShopName": "二车间",
            //     "Remark5": "待检",
            //     "WarehouseName": "成品仓",
            //     "EditDisabled": 0,
            //     "ReqQty": null,
            //     "ReplyStatus": 5,
            //     "Extend1": "申购不足",
            //     "Remark6": "已复期，复期异常，",
            //     "FirstReplyDate": "2022-08-24 09:08:11",
            //     "InspectDate": "2022-04-23 08:00:46",
            //     "IsReplyStatus": 1,
            //     "IssueType": "直接发料      ",
            //     "LastReplyDate": "",
            //     "MaterialFormID": "527354",
            //     "MaterialID": 146438,
            //     "MaterialProp": "外购",
            //     "OweQty": -30,
            //     "Qty": 55,
            //     "SalesOrderDetailID": "114847",
            //     "ShortQty": null,
            //     "UnIssuedQty": 30,
            //     "dicID": 9023,
            //     "update": true,
            //     "JudgeResultText": "申购不足",
            //     'status2':'未关闭',
            //     'status3':'是否取消订单',
            //     'SetReplyTime':'',
            //     "复期": [
            //         {
            //             "title": "采购足",
            //             "value": "采购足",
            //             "label": "采购足",
            //             "text": "采购足"
            //         },
            //         {
            //             "title": "未下单",
            //             "value": "未下单",
            //             "label": "未下单",
            //             "text": "未下单"
            //         },
            //         {
            //             "title": "申购不足",
            //             "value": "申购不足",
            //             "label": "申购不足",
            //             "text": "申购不足"
            //         },
            //         {
            //             "title": "交期冲突",
            //             "value": "交期冲突",
            //             "label": "交期冲突",
            //             "text": "交期冲突"
            //         },
            //         {
            //             "title": "待复期",
            //             "value": "待复期",
            //             "label": "待复期",
            //             "text": "待复期"
            //         },
            //         {
            //             "title": "数量不足",
            //             "value": "数量不足",
            //             "label": "数量不足",
            //             "text": "数量不足"
            //         },
            //         {
            //             "title": "满足",
            //             "value": "满足",
            //             "label": "满足",
            //             "text": "满足"
            //         }
            //     ]
            // },
            // {
            //     "RowNumber": 3,
            //     "isChecked": false,
            //     "JudgeResult": "打样大货申请",
            //     "POSuplierName": "泓天,",
            //     "ProductName": "未审核",
            //     "Code": "61106142",
            //     "MaterialName": "后盖透风网压板（烤漆件）",
            //     "Spec": "1.5MM铁板，半光细黑砂户外漆，EK-M1500P HR",
            //     "StockQty": 0,
            //     "StockQty1": null,
            //     "StockQty2": null,
            //     "OncheckQty": 4,
            //     "OnloadQty": 4,
            //     "RealOweQty": 4,
            //     "StockQtyAllocationPrepare": 4,
            //     "LastDate": "2022-07-28",
            //     "ReplyQty": 4,
            //     "ReplyDateM1": "2022-08-31",
            //     "ReplyDateM2": "",
            //     "Remark4": null,
            //     "DemandReplyDate": "2022-08-28 21:34:28",
            //     "PODocs": "CGDD220829095,",
            //     "SalesOrderNo": "2022-12-06",
            //     "IsReplyStatusName": "是",
            //     "SurplusQty": null,
            //     "PMCRemark": "试产/三车间",
            //     "DemandQty": 280,
            //     "SalesRealOweNum": '正常',
            //     "PrepareDate": "2022-05-04",
            //     "PODate": "2022-08-29 14:19:45",
            //     "POTracker": "黄山娜",
            //     "SetReplyDate": "2022-08-25 21:34:28",
            //     "ValidReplyDate": "2022-08-31",
            //     "Extend11": "7",
            //     "IssueDate": "",
            //     "InDate": "2022-08-30 15:14:45",
            //     "InQty": 36,
            //     "WorkShopName": "三车间",
            //     "Remark5": "待检",
            //     "WarehouseName": "成品仓",
            //     "EditDisabled": 0,
            //     "ReqQty": null,
            //     "ReplyStatus": 5,
            //     "Extend1": "采购足",
            //     "Remark6": "已复期，复期超时，复期异常，",
            //     "FirstReplyDate": "2022-08-29 20:08:34",
            //     "InspectDate": "2022-05-06 16:25:23",
            //     "IsReplyStatus": 1,
            //     "IssueType": "直接发料      ",
            //     "LastReplyDate": "",
            //     "MaterialFormID": "536353",
            //     "MaterialID": 153609,
            //     "MaterialProp": "外购",
            //     "OweQty": 0,
            //     "Qty": 140,
            //     "SalesOrderDetailID": "116948",
            //     "ShortQty": null,
            //     "UnIssuedQty": 4,
            //     "dicID": 9023,
            //     "update": true,
            //     "JudgeResultText": "采购足",
            //     'status2':'关闭',
            //     'status3':'是否取消订单',
            //     'SetReplyTime':'',
            //     "复期": [
            //         {
            //             "title": "采购足",
            //             "value": "采购足",
            //             "label": "采购足",
            //             "text": "采购足"
            //         },
            //         {
            //             "title": "未下单",
            //             "value": "未下单",
            //             "label": "未下单",
            //             "text": "未下单"
            //         },
            //         {
            //             "title": "申购不足",
            //             "value": "申购不足",
            //             "label": "申购不足",
            //             "text": "申购不足"
            //         },
            //         {
            //             "title": "交期冲突",
            //             "value": "交期冲突",
            //             "label": "交期冲突",
            //             "text": "交期冲突"
            //         },
            //         {
            //             "title": "待复期",
            //             "value": "待复期",
            //             "label": "待复期",
            //             "text": "待复期"
            //         },
            //         {
            //             "title": "数量不足",
            //             "value": "数量不足",
            //             "label": "数量不足",
            //             "text": "数量不足"
            //         },
            //         {
            //             "title": "满足",
            //             "value": "满足",
            //             "label": "满足",
            //             "text": "满足"
            //         }
            //     ]
            // },
            // {
            //     "RowNumber": 1,
            //     "isChecked": false,
            //     "JudgeResult": "打样采购申请",
            //     "POSuplierName": "吉华,",
            //     "ProductName": "已审核",
            //     "Code": "32300666",
            //     "MaterialName": "15度透镜",
            //     "Spec": "PMMA，15度",
            //     "StockQty": 0,
            //     "StockQty1": null,
            //     "StockQty2": null,
            //     "OncheckQty": 0,
            //     "OnloadQty": 4,
            //     "RealOweQty": 2,
            //     "StockQtyAllocationPrepare": 2,
            //     "LastDate": "2022-08-04",
            //     "ReplyQty": 2,
            //     "ReplyDateM1": "2022-08-23",
            //     "ReplyDateM2": "",
            //     "Remark4": "已找研发拿了2个给试产8-25",
            //     "DemandReplyDate": "2022-08-25 11:04:29",
            //     "PODocs": "CGDD220620080,CGDD220811021,",
            //     "SalesOrderNo": "2022-12-06",
            //     "IsReplyStatusName": "是",
            //     "SurplusQty": null,
            //     "PMCRemark": "试产/厂内",
            //     "DemandQty": 240,
            //     "SalesRealOweNum": '正常',
            //     "PrepareDate": "2022-04-19",
            //     "PODate": "2022-06-20 16:48:16",
            //     "POTracker": "韩琴",
            //     "SetReplyDate": "2022-08-22 11:04:29",
            //     "ValidReplyDate": "2022-08-23",
            //     "Extend11": "0",
            //     "IssueDate": "",
            //     "InDate": "",
            //     "InQty": 36,
            //     "WorkShopName": "二车间",
            //     "Remark5": "待检",
            //     "WarehouseName": "成品仓",
            //     "EditDisabled": 0,
            //     "ReqQty": null,
            //     "ReplyStatus": 5,
            //     "Extend1": "采购足",
            //     "Remark6": "已复期，复期异常，",
            //     "FirstReplyDate": "2022-08-23 20:44:01",
            //     "InspectDate": "2022-04-20 14:01:56",
            //     "IsReplyStatus": 1,
            //     "IssueType": "直接发料      ",
            //     "LastReplyDate": "",
            //     "MaterialFormID": "524962",
            //     "MaterialID": 140226,
            //     "MaterialProp": "外购",
            //     "OweQty": -2,
            //     "Qty": 10,
            //     "SalesOrderDetailID": "116055",
            //     "ShortQty": null,
            //     "UnIssuedQty": 2,
            //     "dicID": 9023,
            //     "update": true,
            //     "JudgeResultText": "采购足",
            //     'status2':'未关闭',
            //     'status3':'是否取消订单',
            //     'SetReplyTime':48,
            //     "复期": [
            //         {
            //             "title": "采购足",
            //             "value": "采购足",
            //             "label": "采购足",
            //             "text": "采购足"
            //         },
            //         {
            //             "title": "未下单",
            //             "value": "未下单",
            //             "label": "未下单",
            //             "text": "未下单"
            //         },
            //         {
            //             "title": "申购不足",
            //             "value": "申购不足",
            //             "label": "申购不足",
            //             "text": "申购不足"
            //         },
            //         {
            //             "title": "交期冲突",
            //             "value": "交期冲突",
            //             "label": "交期冲突",
            //             "text": "交期冲突"
            //         },
            //         {
            //             "title": "待复期",
            //             "value": "待复期",
            //             "label": "待复期",
            //             "text": "待复期"
            //         },
            //         {
            //             "title": "数量不足",
            //             "value": "数量不足",
            //             "label": "数量不足",
            //             "text": "数量不足"
            //         },
            //         {
            //             "title": "满足",
            //             "value": "满足",
            //             "label": "满足",
            //             "text": "满足"
            //         }
            //     ]
            // },
            // {
            //     "RowNumber": 2,
            //     "isChecked": false,
            //     "JudgeResult": "打样委外采购申请",
            //     "POSuplierName": "无供应商,",
            //     "ProductName": "已审核",
            //     "Code": "52001918",
            //     "MaterialName": "停用：GV-M16QZ 雾化板 纸板",
            //     "Spec": "停用：1000*75mm，A3A加强120g，黄色纸板，3层纸",
            //     "StockQty": 0,
            //     "StockQty1": null,
            //     "StockQty2": null,
            //     "OncheckQty": 0,
            //     "OnloadQty": null,
            //     "RealOweQty": 30,
            //     "StockQtyAllocationPrepare": 30,
            //     "LastDate": "2022-07-30",
            //     "ReplyQty": 30,
            //     "ReplyDateM1": "2022-08-24",
            //     "ReplyDateM2": "",
            //     "Remark4": null,
            //     "DemandReplyDate": "2022-08-25 14:33:46",
            //     "PODocs": null,
            //     "SalesOrderNo": "2022-12-06",
            //     "IsReplyStatusName": "是",
            //     "SurplusQty": null,
            //     "PMCRemark": "试产/厂内",
            //     "DemandQty": 55,
            //     "SalesRealOweNum": '正常',
            //     "PrepareDate": "2022-04-22",
            //     "PODate": "",
            //     "POTracker": "黄山娜",
            //     "SetReplyDate": "2022-08-22 14:33:46",
            //     "ValidReplyDate": "2022-08-24",
            //     "Extend11": "10",
            //     "IssueDate": "",
            //     "InDate": "",
            //     "InQty": 36,
            //     "WorkShopName": "二车间",
            //     "Remark5": "待检",
            //     "WarehouseName": "成品仓",
            //     "EditDisabled": 0,
            //     "ReqQty": null,
            //     "ReplyStatus": 5,
            //     "Extend1": "申购不足",
            //     "Remark6": "已复期，复期异常，",
            //     "FirstReplyDate": "2022-08-24 09:08:11",
            //     "InspectDate": "2022-04-23 08:00:46",
            //     "IsReplyStatus": 1,
            //     "IssueType": "直接发料      ",
            //     "LastReplyDate": "",
            //     "MaterialFormID": "527354",
            //     "MaterialID": 146438,
            //     "MaterialProp": "外购",
            //     "OweQty": -30,
            //     "Qty": 55,
            //     "SalesOrderDetailID": "114847",
            //     "ShortQty": null,
            //     "UnIssuedQty": 30,
            //     "dicID": 9023,
            //     "update": true,
            //     "JudgeResultText": "申购不足",
            //     'status2':'未关闭',
            //     'status3':'是否取消订单',
            //     'SetReplyTime':'',
            //     "复期": [
            //         {
            //             "title": "采购足",
            //             "value": "采购足",
            //             "label": "采购足",
            //             "text": "采购足"
            //         },
            //         {
            //             "title": "未下单",
            //             "value": "未下单",
            //             "label": "未下单",
            //             "text": "未下单"
            //         },
            //         {
            //             "title": "申购不足",
            //             "value": "申购不足",
            //             "label": "申购不足",
            //             "text": "申购不足"
            //         },
            //         {
            //             "title": "交期冲突",
            //             "value": "交期冲突",
            //             "label": "交期冲突",
            //             "text": "交期冲突"
            //         },
            //         {
            //             "title": "待复期",
            //             "value": "待复期",
            //             "label": "待复期",
            //             "text": "待复期"
            //         },
            //         {
            //             "title": "数量不足",
            //             "value": "数量不足",
            //             "label": "数量不足",
            //             "text": "数量不足"
            //         },
            //         {
            //             "title": "满足",
            //             "value": "满足",
            //             "label": "满足",
            //             "text": "满足"
            //         }
            //     ]
            // },
            // {
            //     "RowNumber": 3,
            //     "isChecked": false,
            //     "JudgeResult": "打样大货申请",
            //     "POSuplierName": "泓天,",
            //     "ProductName": "未审核",
            //     "Code": "61106142",
            //     "MaterialName": "后盖透风网压板（烤漆件）",
            //     "Spec": "1.5MM铁板，半光细黑砂户外漆，EK-M1500P HR",
            //     "StockQty": 0,
            //     "StockQty1": null,
            //     "StockQty2": null,
            //     "OncheckQty": 4,
            //     "OnloadQty": 4,
            //     "RealOweQty": 4,
            //     "StockQtyAllocationPrepare": 4,
            //     "LastDate": "2022-07-28",
            //     "ReplyQty": 4,
            //     "ReplyDateM1": "2022-08-31",
            //     "ReplyDateM2": "",
            //     "Remark4": null,
            //     "DemandReplyDate": "2022-08-28 21:34:28",
            //     "PODocs": "CGDD220829095,",
            //     "SalesOrderNo": "2022-12-06",
            //     "IsReplyStatusName": "是",
            //     "SurplusQty": null,
            //     "PMCRemark": "试产/三车间",
            //     "DemandQty": 280,
            //     "SalesRealOweNum": '正常',
            //     "PrepareDate": "2022-05-04",
            //     "PODate": "2022-08-29 14:19:45",
            //     "POTracker": "黄山娜",
            //     "SetReplyDate": "2022-08-25 21:34:28",
            //     "ValidReplyDate": "2022-08-31",
            //     "Extend11": "7",
            //     "IssueDate": "",
            //     "InDate": "2022-08-30 15:14:45",
            //     "InQty": 36,
            //     "WorkShopName": "三车间",
            //     "Remark5": "待检",
            //     "WarehouseName": "成品仓",
            //     "EditDisabled": 0,
            //     "ReqQty": null,
            //     "ReplyStatus": 5,
            //     "Extend1": "采购足",
            //     "Remark6": "已复期，复期超时，复期异常，",
            //     "FirstReplyDate": "2022-08-29 20:08:34",
            //     "InspectDate": "2022-05-06 16:25:23",
            //     "IsReplyStatus": 1,
            //     "IssueType": "直接发料      ",
            //     "LastReplyDate": "",
            //     "MaterialFormID": "536353",
            //     "MaterialID": 153609,
            //     "MaterialProp": "外购",
            //     "OweQty": 0,
            //     "Qty": 140,
            //     "SalesOrderDetailID": "116948",
            //     "ShortQty": null,
            //     "UnIssuedQty": 4,
            //     "dicID": 9023,
            //     "update": true,
            //     "JudgeResultText": "采购足",
            //     'status2':'关闭',
            //     'status3':'是否取消订单',
            //     'SetReplyTime':'',
            //     "复期": [
            //         {
            //             "title": "采购足",
            //             "value": "采购足",
            //             "label": "采购足",
            //             "text": "采购足"
            //         },
            //         {
            //             "title": "未下单",
            //             "value": "未下单",
            //             "label": "未下单",
            //             "text": "未下单"
            //         },
            //         {
            //             "title": "申购不足",
            //             "value": "申购不足",
            //             "label": "申购不足",
            //             "text": "申购不足"
            //         },
            //         {
            //             "title": "交期冲突",
            //             "value": "交期冲突",
            //             "label": "交期冲突",
            //             "text": "交期冲突"
            //         },
            //         {
            //             "title": "待复期",
            //             "value": "待复期",
            //             "label": "待复期",
            //             "text": "待复期"
            //         },
            //         {
            //             "title": "数量不足",
            //             "value": "数量不足",
            //             "label": "数量不足",
            //             "text": "数量不足"
            //         },
            //         {
            //             "title": "满足",
            //             "value": "满足",
            //             "label": "满足",
            //             "text": "满足"
            //         }
            //     ]
            // },
            // {
            //     "RowNumber": 1,
            //     "isChecked": false,
            //     "JudgeResult": "打样采购申请",
            //     "POSuplierName": "吉华,",
            //     "ProductName": "已审核",
            //     "Code": "32300666",
            //     "MaterialName": "15度透镜",
            //     "Spec": "PMMA，15度",
            //     "StockQty": 0,
            //     "StockQty1": null,
            //     "StockQty2": null,
            //     "OncheckQty": 0,
            //     "OnloadQty": 4,
            //     "RealOweQty": 2,
            //     "StockQtyAllocationPrepare": 2,
            //     "LastDate": "2022-08-04",
            //     "ReplyQty": 2,
            //     "ReplyDateM1": "2022-08-23",
            //     "ReplyDateM2": "",
            //     "Remark4": "已找研发拿了2个给试产8-25",
            //     "DemandReplyDate": "2022-08-25 11:04:29",
            //     "PODocs": "CGDD220620080,CGDD220811021,",
            //     "SalesOrderNo": "2022-12-06",
            //     "IsReplyStatusName": "是",
            //     "SurplusQty": null,
            //     "PMCRemark": "试产/厂内",
            //     "DemandQty": 240,
            //     "SalesRealOweNum": '正常',
            //     "PrepareDate": "2022-04-19",
            //     "PODate": "2022-06-20 16:48:16",
            //     "POTracker": "韩琴",
            //     "SetReplyDate": "2022-08-22 11:04:29",
            //     "ValidReplyDate": "2022-08-23",
            //     "Extend11": "0",
            //     "IssueDate": "",
            //     "InDate": "",
            //     "InQty": 36,
            //     "WorkShopName": "二车间",
            //     "Remark5": "待检",
            //     "WarehouseName": "成品仓",
            //     "EditDisabled": 0,
            //     "ReqQty": null,
            //     "ReplyStatus": 5,
            //     "Extend1": "采购足",
            //     "Remark6": "已复期，复期异常，",
            //     "FirstReplyDate": "2022-08-23 20:44:01",
            //     "InspectDate": "2022-04-20 14:01:56",
            //     "IsReplyStatus": 1,
            //     "IssueType": "直接发料      ",
            //     "LastReplyDate": "",
            //     "MaterialFormID": "524962",
            //     "MaterialID": 140226,
            //     "MaterialProp": "外购",
            //     "OweQty": -2,
            //     "Qty": 10,
            //     "SalesOrderDetailID": "116055",
            //     "ShortQty": null,
            //     "UnIssuedQty": 2,
            //     "dicID": 9023,
            //     "update": true,
            //     "JudgeResultText": "采购足",
            //     'status2':'未关闭',
            //     'status3':'是否取消订单',
            //     'SetReplyTime':48,
            //     "复期": [
            //         {
            //             "title": "采购足",
            //             "value": "采购足",
            //             "label": "采购足",
            //             "text": "采购足"
            //         },
            //         {
            //             "title": "未下单",
            //             "value": "未下单",
            //             "label": "未下单",
            //             "text": "未下单"
            //         },
            //         {
            //             "title": "申购不足",
            //             "value": "申购不足",
            //             "label": "申购不足",
            //             "text": "申购不足"
            //         },
            //         {
            //             "title": "交期冲突",
            //             "value": "交期冲突",
            //             "label": "交期冲突",
            //             "text": "交期冲突"
            //         },
            //         {
            //             "title": "待复期",
            //             "value": "待复期",
            //             "label": "待复期",
            //             "text": "待复期"
            //         },
            //         {
            //             "title": "数量不足",
            //             "value": "数量不足",
            //             "label": "数量不足",
            //             "text": "数量不足"
            //         },
            //         {
            //             "title": "满足",
            //             "value": "满足",
            //             "label": "满足",
            //             "text": "满足"
            //         }
            //     ]
            // },
            // {
            //     "RowNumber": 2,
            //     "isChecked": false,
            //     "JudgeResult": "打样委外采购申请",
            //     "POSuplierName": "无供应商,",
            //     "ProductName": "已审核",
            //     "Code": "52001918",
            //     "MaterialName": "停用：GV-M16QZ 雾化板 纸板",
            //     "Spec": "停用：1000*75mm，A3A加强120g，黄色纸板，3层纸",
            //     "StockQty": 0,
            //     "StockQty1": null,
            //     "StockQty2": null,
            //     "OncheckQty": 0,
            //     "OnloadQty": null,
            //     "RealOweQty": 30,
            //     "StockQtyAllocationPrepare": 30,
            //     "LastDate": "2022-07-30",
            //     "ReplyQty": 30,
            //     "ReplyDateM1": "2022-08-24",
            //     "ReplyDateM2": "",
            //     "Remark4": null,
            //     "DemandReplyDate": "2022-08-25 14:33:46",
            //     "PODocs": null,
            //     "SalesOrderNo": "2022-12-06",
            //     "IsReplyStatusName": "是",
            //     "SurplusQty": null,
            //     "PMCRemark": "试产/厂内",
            //     "DemandQty": 55,
            //     "SalesRealOweNum": '正常',
            //     "PrepareDate": "2022-04-22",
            //     "PODate": "",
            //     "POTracker": "黄山娜",
            //     "SetReplyDate": "2022-08-22 14:33:46",
            //     "ValidReplyDate": "2022-08-24",
            //     "Extend11": "10",
            //     "IssueDate": "",
            //     "InDate": "",
            //     "InQty": 36,
            //     "WorkShopName": "二车间",
            //     "Remark5": "待检",
            //     "WarehouseName": "成品仓",
            //     "EditDisabled": 0,
            //     "ReqQty": null,
            //     "ReplyStatus": 5,
            //     "Extend1": "申购不足",
            //     "Remark6": "已复期，复期异常，",
            //     "FirstReplyDate": "2022-08-24 09:08:11",
            //     "InspectDate": "2022-04-23 08:00:46",
            //     "IsReplyStatus": 1,
            //     "IssueType": "直接发料      ",
            //     "LastReplyDate": "",
            //     "MaterialFormID": "527354",
            //     "MaterialID": 146438,
            //     "MaterialProp": "外购",
            //     "OweQty": -30,
            //     "Qty": 55,
            //     "SalesOrderDetailID": "114847",
            //     "ShortQty": null,
            //     "UnIssuedQty": 30,
            //     "dicID": 9023,
            //     "update": true,
            //     "JudgeResultText": "申购不足",
            //     'status2':'未关闭',
            //     'status3':'是否取消订单',
            //     'SetReplyTime':'',
            //     "复期": [
            //         {
            //             "title": "采购足",
            //             "value": "采购足",
            //             "label": "采购足",
            //             "text": "采购足"
            //         },
            //         {
            //             "title": "未下单",
            //             "value": "未下单",
            //             "label": "未下单",
            //             "text": "未下单"
            //         },
            //         {
            //             "title": "申购不足",
            //             "value": "申购不足",
            //             "label": "申购不足",
            //             "text": "申购不足"
            //         },
            //         {
            //             "title": "交期冲突",
            //             "value": "交期冲突",
            //             "label": "交期冲突",
            //             "text": "交期冲突"
            //         },
            //         {
            //             "title": "待复期",
            //             "value": "待复期",
            //             "label": "待复期",
            //             "text": "待复期"
            //         },
            //         {
            //             "title": "数量不足",
            //             "value": "数量不足",
            //             "label": "数量不足",
            //             "text": "数量不足"
            //         },
            //         {
            //             "title": "满足",
            //             "value": "满足",
            //             "label": "满足",
            //             "text": "满足"
            //         }
            //     ]
            // },
            // {
            //     "RowNumber": 3,
            //     "isChecked": false,
            //     "JudgeResult": "打样大货申请",
            //     "POSuplierName": "泓天,",
            //     "ProductName": "未审核",
            //     "Code": "61106142",
            //     "MaterialName": "后盖透风网压板（烤漆件）",
            //     "Spec": "1.5MM铁板，半光细黑砂户外漆，EK-M1500P HR",
            //     "StockQty": 0,
            //     "StockQty1": null,
            //     "StockQty2": null,
            //     "OncheckQty": 4,
            //     "OnloadQty": 4,
            //     "RealOweQty": 4,
            //     "StockQtyAllocationPrepare": 4,
            //     "LastDate": "2022-07-28",
            //     "ReplyQty": 4,
            //     "ReplyDateM1": "2022-08-31",
            //     "ReplyDateM2": "",
            //     "Remark4": null,
            //     "DemandReplyDate": "2022-08-28 21:34:28",
            //     "PODocs": "CGDD220829095,",
            //     "SalesOrderNo": "2022-12-06",
            //     "IsReplyStatusName": "是",
            //     "SurplusQty": null,
            //     "PMCRemark": "试产/三车间",
            //     "DemandQty": 280,
            //     "SalesRealOweNum": '正常',
            //     "PrepareDate": "2022-05-04",
            //     "PODate": "2022-08-29 14:19:45",
            //     "POTracker": "黄山娜",
            //     "SetReplyDate": "2022-08-25 21:34:28",
            //     "ValidReplyDate": "2022-08-31",
            //     "Extend11": "7",
            //     "IssueDate": "",
            //     "InDate": "2022-08-30 15:14:45",
            //     "InQty": 36,
            //     "WorkShopName": "三车间",
            //     "Remark5": "待检",
            //     "WarehouseName": "成品仓",
            //     "EditDisabled": 0,
            //     "ReqQty": null,
            //     "ReplyStatus": 5,
            //     "Extend1": "采购足",
            //     "Remark6": "已复期，复期超时，复期异常，",
            //     "FirstReplyDate": "2022-08-29 20:08:34",
            //     "InspectDate": "2022-05-06 16:25:23",
            //     "IsReplyStatus": 1,
            //     "IssueType": "直接发料      ",
            //     "LastReplyDate": "",
            //     "MaterialFormID": "536353",
            //     "MaterialID": 153609,
            //     "MaterialProp": "外购",
            //     "OweQty": 0,
            //     "Qty": 140,
            //     "SalesOrderDetailID": "116948",
            //     "ShortQty": null,
            //     "UnIssuedQty": 4,
            //     "dicID": 9023,
            //     "update": true,
            //     "JudgeResultText": "采购足",
            //     'status2':'关闭',
            //     'status3':'是否取消订单',
            //     'SetReplyTime':'',
            //     "复期": [
            //         {
            //             "title": "采购足",
            //             "value": "采购足",
            //             "label": "采购足",
            //             "text": "采购足"
            //         },
            //         {
            //             "title": "未下单",
            //             "value": "未下单",
            //             "label": "未下单",
            //             "text": "未下单"
            //         },
            //         {
            //             "title": "申购不足",
            //             "value": "申购不足",
            //             "label": "申购不足",
            //             "text": "申购不足"
            //         },
            //         {
            //             "title": "交期冲突",
            //             "value": "交期冲突",
            //             "label": "交期冲突",
            //             "text": "交期冲突"
            //         },
            //         {
            //             "title": "待复期",
            //             "value": "待复期",
            //             "label": "待复期",
            //             "text": "待复期"
            //         },
            //         {
            //             "title": "数量不足",
            //             "value": "数量不足",
            //             "label": "数量不足",
            //             "text": "数量不足"
            //         },
            //         {
            //             "title": "满足",
            //             "value": "满足",
            //             "label": "满足",
            //             "text": "满足"
            //         }
            //     ]
            // },
            // {
            //     "RowNumber": 1,
            //     "isChecked": false,
            //     "JudgeResult": "打样采购申请",
            //     "POSuplierName": "吉华,",
            //     "ProductName": "已审核",
            //     "Code": "32300666",
            //     "MaterialName": "15度透镜",
            //     "Spec": "PMMA，15度",
            //     "StockQty": 0,
            //     "StockQty1": null,
            //     "StockQty2": null,
            //     "OncheckQty": 0,
            //     "OnloadQty": 4,
            //     "RealOweQty": 2,
            //     "StockQtyAllocationPrepare": 2,
            //     "LastDate": "2022-08-04",
            //     "ReplyQty": 2,
            //     "ReplyDateM1": "2022-08-23",
            //     "ReplyDateM2": "",
            //     "Remark4": "已找研发拿了2个给试产8-25",
            //     "DemandReplyDate": "2022-08-25 11:04:29",
            //     "PODocs": "CGDD220620080,CGDD220811021,",
            //     "SalesOrderNo": "2022-12-06",
            //     "IsReplyStatusName": "是",
            //     "SurplusQty": null,
            //     "PMCRemark": "试产/厂内",
            //     "DemandQty": 240,
            //     "SalesRealOweNum": '正常',
            //     "PrepareDate": "2022-04-19",
            //     "PODate": "2022-06-20 16:48:16",
            //     "POTracker": "韩琴",
            //     "SetReplyDate": "2022-08-22 11:04:29",
            //     "ValidReplyDate": "2022-08-23",
            //     "Extend11": "0",
            //     "IssueDate": "",
            //     "InDate": "",
            //     "InQty": 36,
            //     "WorkShopName": "二车间",
            //     "Remark5": "待检",
            //     "WarehouseName": "成品仓",
            //     "EditDisabled": 0,
            //     "ReqQty": null,
            //     "ReplyStatus": 5,
            //     "Extend1": "采购足",
            //     "Remark6": "已复期，复期异常，",
            //     "FirstReplyDate": "2022-08-23 20:44:01",
            //     "InspectDate": "2022-04-20 14:01:56",
            //     "IsReplyStatus": 1,
            //     "IssueType": "直接发料      ",
            //     "LastReplyDate": "",
            //     "MaterialFormID": "524962",
            //     "MaterialID": 140226,
            //     "MaterialProp": "外购",
            //     "OweQty": -2,
            //     "Qty": 10,
            //     "SalesOrderDetailID": "116055",
            //     "ShortQty": null,
            //     "UnIssuedQty": 2,
            //     "dicID": 9023,
            //     "update": true,
            //     "JudgeResultText": "采购足",
            //     'status2':'未关闭',
            //     'status3':'是否取消订单',
            //     'SetReplyTime':48,
            //     "复期": [
            //         {
            //             "title": "采购足",
            //             "value": "采购足",
            //             "label": "采购足",
            //             "text": "采购足"
            //         },
            //         {
            //             "title": "未下单",
            //             "value": "未下单",
            //             "label": "未下单",
            //             "text": "未下单"
            //         },
            //         {
            //             "title": "申购不足",
            //             "value": "申购不足",
            //             "label": "申购不足",
            //             "text": "申购不足"
            //         },
            //         {
            //             "title": "交期冲突",
            //             "value": "交期冲突",
            //             "label": "交期冲突",
            //             "text": "交期冲突"
            //         },
            //         {
            //             "title": "待复期",
            //             "value": "待复期",
            //             "label": "待复期",
            //             "text": "待复期"
            //         },
            //         {
            //             "title": "数量不足",
            //             "value": "数量不足",
            //             "label": "数量不足",
            //             "text": "数量不足"
            //         },
            //         {
            //             "title": "满足",
            //             "value": "满足",
            //             "label": "满足",
            //             "text": "满足"
            //         }
            //     ]
            // },
            // {
            //     "RowNumber": 2,
            //     "isChecked": false,
            //     "JudgeResult": "打样委外采购申请",
            //     "POSuplierName": "无供应商,",
            //     "ProductName": "已审核",
            //     "Code": "52001918",
            //     "MaterialName": "停用：GV-M16QZ 雾化板 纸板",
            //     "Spec": "停用：1000*75mm，A3A加强120g，黄色纸板，3层纸",
            //     "StockQty": 0,
            //     "StockQty1": null,
            //     "StockQty2": null,
            //     "OncheckQty": 0,
            //     "OnloadQty": null,
            //     "RealOweQty": 30,
            //     "StockQtyAllocationPrepare": 30,
            //     "LastDate": "2022-07-30",
            //     "ReplyQty": 30,
            //     "ReplyDateM1": "2022-08-24",
            //     "ReplyDateM2": "",
            //     "Remark4": null,
            //     "DemandReplyDate": "2022-08-25 14:33:46",
            //     "PODocs": null,
            //     "SalesOrderNo": "2022-12-06",
            //     "IsReplyStatusName": "是",
            //     "SurplusQty": null,
            //     "PMCRemark": "试产/厂内",
            //     "DemandQty": 55,
            //     "SalesRealOweNum": '正常',
            //     "PrepareDate": "2022-04-22",
            //     "PODate": "",
            //     "POTracker": "黄山娜",
            //     "SetReplyDate": "2022-08-22 14:33:46",
            //     "ValidReplyDate": "2022-08-24",
            //     "Extend11": "10",
            //     "IssueDate": "",
            //     "InDate": "",
            //     "InQty": 36,
            //     "WorkShopName": "二车间",
            //     "Remark5": "待检",
            //     "WarehouseName": "成品仓",
            //     "EditDisabled": 0,
            //     "ReqQty": null,
            //     "ReplyStatus": 5,
            //     "Extend1": "申购不足",
            //     "Remark6": "已复期，复期异常，",
            //     "FirstReplyDate": "2022-08-24 09:08:11",
            //     "InspectDate": "2022-04-23 08:00:46",
            //     "IsReplyStatus": 1,
            //     "IssueType": "直接发料      ",
            //     "LastReplyDate": "",
            //     "MaterialFormID": "527354",
            //     "MaterialID": 146438,
            //     "MaterialProp": "外购",
            //     "OweQty": -30,
            //     "Qty": 55,
            //     "SalesOrderDetailID": "114847",
            //     "ShortQty": null,
            //     "UnIssuedQty": 30,
            //     "dicID": 9023,
            //     "update": true,
            //     "JudgeResultText": "申购不足",
            //     'status2':'未关闭',
            //     'status3':'是否取消订单',
            //     'SetReplyTime':'',
            //     "复期": [
            //         {
            //             "title": "采购足",
            //             "value": "采购足",
            //             "label": "采购足",
            //             "text": "采购足"
            //         },
            //         {
            //             "title": "未下单",
            //             "value": "未下单",
            //             "label": "未下单",
            //             "text": "未下单"
            //         },
            //         {
            //             "title": "申购不足",
            //             "value": "申购不足",
            //             "label": "申购不足",
            //             "text": "申购不足"
            //         },
            //         {
            //             "title": "交期冲突",
            //             "value": "交期冲突",
            //             "label": "交期冲突",
            //             "text": "交期冲突"
            //         },
            //         {
            //             "title": "待复期",
            //             "value": "待复期",
            //             "label": "待复期",
            //             "text": "待复期"
            //         },
            //         {
            //             "title": "数量不足",
            //             "value": "数量不足",
            //             "label": "数量不足",
            //             "text": "数量不足"
            //         },
            //         {
            //             "title": "满足",
            //             "value": "满足",
            //             "label": "满足",
            //             "text": "满足"
            //         }
            //     ]
            // },
            // {
            //     "RowNumber": 3,
            //     "isChecked": false,
            //     "JudgeResult": "打样大货申请",
            //     "POSuplierName": "泓天,",
            //     "ProductName": "未审核",
            //     "Code": "61106142",
            //     "MaterialName": "后盖透风网压板（烤漆件）",
            //     "Spec": "1.5MM铁板，半光细黑砂户外漆，EK-M1500P HR",
            //     "StockQty": 0,
            //     "StockQty1": null,
            //     "StockQty2": null,
            //     "OncheckQty": 4,
            //     "OnloadQty": 4,
            //     "RealOweQty": 4,
            //     "StockQtyAllocationPrepare": 4,
            //     "LastDate": "2022-07-28",
            //     "ReplyQty": 4,
            //     "ReplyDateM1": "2022-08-31",
            //     "ReplyDateM2": "",
            //     "Remark4": null,
            //     "DemandReplyDate": "2022-08-28 21:34:28",
            //     "PODocs": "CGDD220829095,",
            //     "SalesOrderNo": "2022-12-06",
            //     "IsReplyStatusName": "是",
            //     "SurplusQty": null,
            //     "PMCRemark": "试产/三车间",
            //     "DemandQty": 280,
            //     "SalesRealOweNum": '正常',
            //     "PrepareDate": "2022-05-04",
            //     "PODate": "2022-08-29 14:19:45",
            //     "POTracker": "黄山娜",
            //     "SetReplyDate": "2022-08-25 21:34:28",
            //     "ValidReplyDate": "2022-08-31",
            //     "Extend11": "7",
            //     "IssueDate": "",
            //     "InDate": "2022-08-30 15:14:45",
            //     "InQty": 36,
            //     "WorkShopName": "三车间",
            //     "Remark5": "待检",
            //     "WarehouseName": "成品仓",
            //     "EditDisabled": 0,
            //     "ReqQty": null,
            //     "ReplyStatus": 5,
            //     "Extend1": "采购足",
            //     "Remark6": "已复期，复期超时，复期异常，",
            //     "FirstReplyDate": "2022-08-29 20:08:34",
            //     "InspectDate": "2022-05-06 16:25:23",
            //     "IsReplyStatus": 1,
            //     "IssueType": "直接发料      ",
            //     "LastReplyDate": "",
            //     "MaterialFormID": "536353",
            //     "MaterialID": 153609,
            //     "MaterialProp": "外购",
            //     "OweQty": 0,
            //     "Qty": 140,
            //     "SalesOrderDetailID": "116948",
            //     "ShortQty": null,
            //     "UnIssuedQty": 4,
            //     "dicID": 9023,
            //     "update": true,
            //     "JudgeResultText": "采购足",
            //     'status2':'关闭',
            //     'status3':'是否取消订单',
            //     'SetReplyTime':'',
            //     "复期": [
            //         {
            //             "title": "采购足",
            //             "value": "采购足",
            //             "label": "采购足",
            //             "text": "采购足"
            //         },
            //         {
            //             "title": "未下单",
            //             "value": "未下单",
            //             "label": "未下单",
            //             "text": "未下单"
            //         },
            //         {
            //             "title": "申购不足",
            //             "value": "申购不足",
            //             "label": "申购不足",
            //             "text": "申购不足"
            //         },
            //         {
            //             "title": "交期冲突",
            //             "value": "交期冲突",
            //             "label": "交期冲突",
            //             "text": "交期冲突"
            //         },
            //         {
            //             "title": "待复期",
            //             "value": "待复期",
            //             "label": "待复期",
            //             "text": "待复期"
            //         },
            //         {
            //             "title": "数量不足",
            //             "value": "数量不足",
            //             "label": "数量不足",
            //             "text": "数量不足"
            //         },
            //         {
            //             "title": "满足",
            //             "value": "满足",
            //             "label": "满足",
            //             "text": "满足"
            //         }
            //     ]
            // },
            // ]
            data.forEach((x) => {
              // if (!x.ReplyDateM1) {
              //   this.$set(x, "tag_1", 1);
              // }
              // if (!x.ReplyDateM2&&!x.ReplyDateM2) {
              //   this.$set(x, "tag_2", 1);
              // }
              this.tableColumns[0].forEach((item)=>{
                if (!this.RoleMapStatus) {
                  if(item['prop'] ==='ReplyDate'||item['prop'] ==='ReplyDateM1'||item['prop'] ==='ReplyDateM2'){
                    item['component']['ReplyDate'] = 'disabled1'
                    item['component']['ReplyDateM1'] = 'disabled2'
                    item['component']['ReplyDateM2'] = 'disabled3'
                  }
                  if(item['prop'] ==='ReplyDate'&&x.ReplyDate){
                    this.$set(x, "disabled1", true)
                    if(!x.ReplyDateM1){
                      this.$set(x, "disabled3", true)
                    }
                    console.log('1')
                  }else if(item['prop'] ==='ReplyDate'&&!x.ReplyDate){
                    this.$set(x, "disabled2", true)
                    this.$set(x, "disabled3", true)
                    console.log('2')
                  }else if(item['prop'] ==='ReplyDateM1'&&x.ReplyDateM1){
                    this.$set(x, "disabled1", true)
                    this.$set(x, "disabled2", true)
                    console.log('3')
                  }
                  else if(item['prop'] ==='ReplyDateM2'&&x.ReplyDateM2){
                    this.$set(x, "disabled1", true)
                    this.$set(x, "disabled2", true)
                    this.$set(x, "disabled3", true)
                    console.log('4')
                  }else if(item['prop'] ==='ReplyDateM2'&&!x.ReplyDateM2){
                    if(!x.ReplyDate){
                      this.$set(x, "disabled3", true)
                    }else if(!x.ReplyDateM1){
                      this.$set(x, "disabled3", true)
                    }
                    console.log('4')
                  }
                }
                //如果超期并维护了原因禁用
                // if(item['prop'] ==='ReplyDate'&&x.ReplyDate){
                //   item['component']['ReplyDateM2'] = 'disabled4'
                //   this.$set(x, "disabled4", true)
                // }
              })
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
      changeDate(remarkTb, index, parms) {
        let val = parms.val
        if (this.selectionData[0].length == 0) {
          this.$message.error("请选择需要批量填写日期的数据！");
        } else {
          this.selectionData[0].forEach((a) => {
              // 没禁用的才赋值
              if (!a.disabled1) {
                a.ReplyDate = this.ReplyDate;
              }
              if (!a.disabled2) {
                a.ReplyDateM1 = this.ReplyDate;
              }
              if (!a.disabled3) {
                a.ReplyDateM2 = this.ReplyDate;
              }
          });
          // if (val == 0) {
          //   this.selectionData[0].forEach((a) => {
          //     // 没禁用的才赋值
          //     if (!a.disabled2) {
          //       a.ReplyDateM1 = this.ReplyDate;
          //     }
          //   });
          // } else {
          //   this.selectionData[0].forEach((a) => {
          //     // 没禁用的才赋值
          //     if(!a.disabled3){
          //       a.ReplyDateM2 = this.ReplyDate;
          //     }
              
          //   });
          // }
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

      },
      // 改变状态
      changeStatus(x, index) {
        this.labelStatus1 = index;
        this.formSearchs[0].datas["ReplyStatus"] = x.value;
        this.dataSearch(0);
      },
      // 可用量查询
      usingSearch(row, prop) {
        // this.formSearchs[1].datas["MaterialID"] = row.MaterialID;
        // this.formSearchs[1].datas["Remark1"] = "送货";
        // this.dataSearch(1);
        // this.dialogShow = true;
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
                // 取消修改状态
                item['Status'] = 3
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
  