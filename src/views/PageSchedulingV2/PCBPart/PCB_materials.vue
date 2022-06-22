<!-- PCB备料
<template>
    <div
    class="container"
    v-loading="adminLoading"
  >
    <div
      class="admin_head"
      ref="headRef"
    >
      <ComSearch
        ref="searchRef"
        :searchData="formSearchs[currentIndex].datas"
        :searchForm="formSearchs[currentIndex].forms"
        :remark="currentIndex"
        :isLoading="isLoading[currentIndex]"
        :btnForm="btnForm"
        @btnClick="btnClick"
        :signName="0"
        :defaultShow="false"
      />
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
            </el-col>
          </el-row>
        </div>
        <div
          class="flex_column"
          :style="{'height':height}"
        >
          <div
            class="spreadContainer"
            v-loading="tableLoading[0]"
          >
            <gc-spread-sheets
              class="sample-spreadsheets"
              @workbookInitialized="initSpread"
            >
              <gc-worksheet></gc-worksheet>
            </gc-spread-sheets>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "PCB_materials",
  components: {
    ComSearch,
  },
  data() {
    return {
        adminLoading:false,//加载状态
        currentIndex:0,//当前下标
        isLoading: [false],//每个表查询条件加载
        }
    }
}
</script> -->