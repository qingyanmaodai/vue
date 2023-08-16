<template>
  <div class="container" v-loading="adminLoading">
    <div class="admin_head" ref="headRef">
      <div class="ant-table-title">
        <el-row>
          <el-col :span="4"
            ><span class="title">{{ title }}</span></el-col
          >
        </el-row>
      </div>
      <ComVxeTable
        :rowKey="'RowNumber'"
        :height="height"
        :tableData="tableData[tagRemark]"
        :tableHeader="tableColumns[tagRemark]"
        :tableLoading="tableLoading[tagRemark]"
        :remark="tagRemark"
        :isEdit="isEdit"
        :isClear="isClear[tagRemark]"
        :hasSelect="isSelect"
        :pagination="tablePagination[tagRemark]"
        :showPagination="false"
        @toPage="toPage"
      />
    </div>
  </div>
</template>
<script>
var _this;
import ComVxeTable from "@/components/ComVxeTable";
export default {
  name: "KanbanManagesAddresses",
  components: {
    ComVxeTable,
  },
  data() {
    return {
      title: this.$route.meta.title,
      adminLoading: false,
      height: "707px",
      tableData: [[]],
      tableColumns: [[]],
      tableLoading: [false],
      isClear: [false],
      tablePagination: [{ pageIndex: 1, pageSize: 1000, pageTotal: 0 }],
      sysID: [{ ID: 8993 }],
      isSelect: false,
      isEdit: false,
      tagRemark: 0,
    };
  },
  mounted() {
    _this = this;
    let apsurl = localStorage.getItem("apsurl");
    console.log("apsurl", apsurl);
    this.tableColumns[this.tagRemark] = [
      { label: "序号", prop: "id", width: "60" },
      { label: "产线ID", prop: "LineID", width: "150", sortable: "custom" },
      { label: "产线名称", prop: "LineName", width: "150", sortable: "custom" },
      {
        label: "制造部",
        prop: "OrganizeName",
        width: "150",
        sortable: "custom",
      },
      {
        label: "看板地址",
        prop: "url",
        width: "500",
        sortable: "custom",
        routerName: true,
      },
    ];
    this.tableData[this.tagRemark] = [
      {
        id: 1,
        LineID: 1207,
        LineName: "66机柜线",
        OrganizeName: "制二部",
        Addresses: "/APSReport/ProPlan.html",
      },
      {
        id: 2,
        LineID: 1211,
        LineName: "1020工厂-1C",
        OrganizeName: "制二部",
        Addresses: "/APSReport/ProPlan.html",
      },
      {
        id: 3,
        LineID: 193,
        LineName: "三三/EPS线",
        OrganizeName: "制二部",
        Addresses: "/APSReport/ProPlan.html",
      },
      {
        id: 4,
        LineID: 194,
        LineName: "直流屏线",
        OrganizeName: "制二部",
        Addresses: "/APSReport/ProPlan.html",
      },
      {
        id: 5,
        LineID: 195,
        LineName: "充电桩线",
        OrganizeName: "制二部",
        Addresses: "/APSReport/ProPlan.html",
      },
      {
        id: 6,
        LineID: 196,
        LineName: "66模块线",
        OrganizeName: "制二部",
        Addresses: "/APSReport/ProPlan.html",
      },
      {
        id: 7,
        LineID: 197,
        LineName: "储能线",
        OrganizeName: "制二部",
        Addresses: "/APSReport/ProPlan.html",
      },
      {
        id: 8,
        LineID: 1209,
        LineName: "1020工厂-1A",
        OrganizeName: "制二部",
        Addresses: "/APSReport/ProPlan.html",
      },
      {
        id: 9,
        LineID: 1210,
        LineName: "1020工厂1B",
        OrganizeName: "制二部",
        Addresses: "/APSReport/ProPlan.html",
      },
      {
        id: 10,
        LineID: 1206,
        LineName: "800单机线",
        OrganizeName: "制三部",
        Addresses: "/APSReport/ProPlan.html",
      },
      {
        id: 11,
        LineID: 200,
        LineName: "光伏小功率1线",
        OrganizeName: "制三部",
        Addresses: "/APSReport/ProPlan.html",
      },
      {
        id: 12,
        LineID: 201,
        LineName: "光伏小功率2线",
        OrganizeName: "制三部",
        Addresses: "/APSReport/ProPlan.html",
      },
      {
        id: 13,
        LineID: 202,
        LineName: "光伏小功率单机线",
        OrganizeName: "制三部",
        Addresses: "/APSReport/ProPlan.html",
      },
      {
        id: 14,
        LineID: 203,
        LineName: "800流水线",
        OrganizeName: "制三部",
        Addresses: "/APSReport/ProPlan.html",
      },
      {
        id: 15,
        LineID: 1213,
        LineName: "1020工厂-2A",
        OrganizeName: "制三部",
        Addresses: "/APSReport/ProPlan.html",
      },
      {
        id: 16,
        LineID: 1202,
        LineName: "单机线",
        OrganizeName: "制四部",
        Addresses: "/APSReport/ProPlan.html",
      },
      {
        id: 17,
        LineID: 207,
        LineName: "A1",
        OrganizeName: "制四部",
        Addresses: "/APSReport/ProPlan.html",
      },
      {
        id: 18,
        LineID: 208,
        LineName: "A2",
        OrganizeName: "制四部",
        Addresses: "/APSReport/ProPlan.html",
      },
      {
        id: 19,
        LineID: 209,
        LineName: "B1",
        OrganizeName: "制四部",
        Addresses: "/APSReport/ProPlan.html",
      },
      {
        id: 20,
        LineID: 210,
        LineName: "B2",
        OrganizeName: "制四部",
        Addresses: "/APSReport/ProPlan.html",
      },
      {
        id: 21,
        LineID: 211,
        LineName: "C2",
        OrganizeName: "制四部",
        Addresses: "/APSReport/ProPlan.html",
      },
      {
        id: 22,
        LineID: 212,
        LineName: "900",
        OrganizeName: "制四部",
        Addresses: "/APSReport/ProPlan.html",
      },
      {
        id: 23,
        LineID: 1214,
        LineName: "1020工厂-2B",
        OrganizeName: "制四部",
        Addresses: "/APSReport/ProPlan.html",
      },
      {
        id: 24,
        LineID: 215,
        LineName: "流水线A",
        OrganizeName: "制五部",
        Addresses: "/APSReport/ProPlan.html",
      },
      {
        id: 25,
        LineID: 216,
        LineName: "单机线B",
        OrganizeName: "制五部",
        Addresses: "/APSReport/ProPlan.html",
      },
      {
        id: 26,
        LineID: 1212,
        LineName: "1020工厂-1D",
        OrganizeName: "制五部",
        Addresses: "/APSReport/ProPlan.html",
      },
      {
        id: 27,
        LineID: 218,
        LineName: "下线",
        OrganizeName: "制五部",
        Addresses: "/APSReport/ProPlan.html",
      },
      {
        id: 28,
        LineID: 1216,
        LineName: "SMT/D",
        OrganizeName: "制一部",
        Addresses: "/APSReport/ProPlan.html",
      },
      {
        id: 29,
        LineID: 1218,
        LineName: "AI/B",
        OrganizeName: "制一部",
        Addresses: "/APSReport/ProPlan.html",
      },
      {
        id: 30,
        LineID: 188,
        LineName: "制一部A线",
        OrganizeName: "制一部",
        Addresses: "/APSReport/ProPlan.html",
      },
      {
        id: 31,
        LineID: 190,
        LineName: "制一部C线",
        OrganizeName: "制一部",
        Addresses: "/APSReport/ProPlan.html",
      },
      {
        id: 32,
        LineID: 191,
        LineName: "制一部D线",
        OrganizeName: "制一部",
        Addresses: "/APSReport/ProPlan.html",
      },
      {
        id: 33,
        LineID: 1204,
        LineName: "AI/A",
        OrganizeName: "制一部",
        Addresses: "/APSReport/ProPlan.html",
      },
      {
        id: 34,
        LineID: 1215,
        LineName: "SMT/C",
        OrganizeName: "制一部",
        Addresses: "/APSReport/ProPlan.html",
      },
      {
        id: 35,
        LineID: 1217,
        LineName: "SMT/E",
        OrganizeName: "制一部",
        Addresses: "/APSReport/ProPlan.html",
      },
      {
        id: 36,
        LineID: 1219,
        LineName: "AI/C",
        OrganizeName: "制一部",
        Addresses: "/APSReport/ProPlan.html",
      },
      {
        id: 37,
        LineID: 1220,
        LineName: "AI/D",
        OrganizeName: "制一部",
        Addresses: "/APSReport/ProPlan.html",
      },
      {
        id: 38,
        LineID: 1221,
        LineName: "AI/E",
        OrganizeName: "制一部",
        Addresses: "/APSReport/ProPlan.html",
      },
      {
        id: 39,
        LineID: 185,
        LineName: "SMT/A",
        OrganizeName: "制一部",
        Addresses: "/APSReport/ProPlan.html",
      },
      {
        id: 40,
        LineID: 186,
        LineName: "SMT/B",
        OrganizeName: "制一部",
        Addresses: "/APSReport/ProPlan.html",
      },
      {
        id: 41,
        LineID: 189,
        LineName: "制一部B线",
        OrganizeName: "制一部",
        Addresses: "/APSReport/ProPlan.html",
      },
      {
        id: 42,
        LineID: 179,
        LineName: "制一部",
        OrganizeName: "制一部",
        Addresses: "/APSReport/ProPlan.html",
      },
      {
        id: 43,
        LineID: 180,
        LineName: "制二部",
        OrganizeName: "制二部",
        Addresses: "/APSReport/ProPlan.html",
      },
      {
        id: 44,
        LineID: 181,
        LineName: "制三部",
        OrganizeName: "制三部",
        Addresses: "/APSReport/ProPlan.html",
      },
      {
        id: 45,
        LineID: 182,
        LineName: "制四部",
        OrganizeName: "制四部",
        Addresses: "/APSReport/ProPlan.html",
      },
      {
        id: 46,
        LineID: 183,
        LineName: "制五部",
        OrganizeName: "制五部",
        Addresses: "/APSReport/ProPlan.html",
      },
      {
        id: 47,
        LineID: 184,
        LineName: "制七部",
        OrganizeName: "制七部",
        Addresses: "/APSReport/ProPlan.html",
      },
      {
        id: 48,
        LineID: "",
        LineName: "综合看板",
        OrganizeName: "易事特",
        Addresses: "/APSReport/index2.html",
      },
    ];
    if (this.tableData[this.tagRemark].length) {
      this.tableData[this.tagRemark].map((item) => {
        if (item.LineID) {
          item["url"] = apsurl + item.Addresses + "?ID=" + item.LineID;
        } else {
          item["url"] = apsurl + item.Addresses;
        }
      });
    }
    this.tablePagination[this.tagRemark].pageTotal =
      this.tableData[this.tagRemark].length;
    // this.$set(this.tableColumns, this.tagRemark, this.tableColumns);
    // this.$set(this.tableData, this.tagRemark, this.tableData);
    setTimeout(() => {
      this.setHeight();
    }, 450);
  },
  created() {},
  methods: {
    // 高度控制
    setHeight() {
      //   let headHeight = this.$refs.headRef.offsetHeight;

      let rem =
        document.documentElement.clientHeight -
        this.$store.getters.reduceHeight;
      let newHeight = rem + "px";
      this.$set(this, "height", newHeight);
    },
    // 新窗口打開看板
    toPage(row, prop) {
      window.open(row.url);
    },
  },
};
</script>
