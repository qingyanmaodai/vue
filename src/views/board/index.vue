<template>
  <div id="app">
    <div class="el-header">
      <div class="logo"></div>
      <h1>JG-APS物料采购看板</h1>
      <div class="showTime">{{ todayDate }}</div>
    </div>
    <div class="mainbox">
      <div class="row1">
        <div class="panel two line">
          <div class="chartHead">
            <h2>待生产订单</h2>
          </div>
          <div class="chart1">
            <div class="tableHead">
              <span
                :style="{ width: item.width }"
                :key="item.label"
                v-for="item in tableColumn[0]"
                >{{ item.label }}</span
              >
            </div>
          </div>
          <div class="panel-footer"></div>
        </div>
        <div class="panel two pie">
          <div class="chartHead">
            <h2>物料需求汇总</h2>
          </div>
          <div class="chart1"></div>
          <div class="panel-footer"></div>
        </div>
      </div>
      <div class="row2">
        <div class="panel three circle">
          <div class="chartHead">
            <h2>物料需求车间</h2>
          </div>
          <div class="chart2"></div>
          <div class="panel-footer"></div>
        </div>
        <div class="panel three circle">
          <div class="chartHead">
            <h2>缺料TOP6</h2>
          </div>
          <div class="chart2"></div>
          <div class="panel-footer"></div>
        </div>
        <div class="panel three bar1">
          <div class="chartHead">
            <h2>采购申请概览</h2>
          </div>
          <div id="rule">
            <div class="list" id="list">
              <p><span>汉族</span><span>24471085人</span><span>98.39%</span></p>
              <p><span>蒙古族</span><span>21097人</span><span>0.08%</span></p>
              <p><span>回族</span><span>84925人</span><span>0.34%</span></p>
              <p><span>藏族</span><span>5749人</span><span>0.02%</span></p>
              <p><span>维吾尔族</span><span>10039人</span><span>0.04%</span></p>
              <p><span>苗族</span><span>38916人</span><span>0.16%</span></p>
              <p><span>彝族</span><span>21952人</span><span>0.09%</span></p>
              <p><span>壮族</span><span>27531人</span><span>0.11%</span></p>
              <p><span>布依族</span><span>9914人</span><span>0.04%</span></p>
              <p><span>朝鲜族</span><span>25404人</span><span>0.1%</span></p>
              <p><span>满族</span><span>43197人</span><span>0.17%</span></p>
              <p><span>侗族</span><span>11870人</span><span>0.05%</span></p>
              <p><span>瑶族</span><span>6309人</span><span>0.03%</span></p>
              <p><span>白族</span><span>7299人</span><span>0.03%</span></p>
              <p><span>土家族</span><span>41807人</span><span>0.17%</span></p>
              <p><span>哈尼族</span><span>8573人</span><span>0.03%</span></p>
              <p><span>哈萨克族</span><span>1695人</span><span>0.01%</span></p>
              <p><span>傣族</span><span>3445人</span><span>0.01%</span></p>
              <p><span>黎族</span><span>3192人</span><span>0.01%</span></p>
              <p><span>傈僳族</span><span>1619人</span><span>0.01%</span></p>
              <p><span>佤族</span><span>2888人</span><span>0.01%</span></p>
              <p><span>畲族</span><span>4476人</span><span>0.02%</span></p>
              <p><span>高山族</span><span>89人</span><span></span></p>
              <p><span>拉祜族</span><span>1234人</span><span></span></p>
              <p><span>水族</span><span>1215人</span><span></span></p>
              <p><span>东乡族</span><span>1078人</span><span></span></p>
              <p><span>纳西族</span><span>532人</span><span></span></p>
              <p><span>景颇族</span><span>598人</span><span></span></p>
              <p><span>柯尔克孜族</span><span>196人</span><span></span></p>
              <p><span>土族</span><span>603人</span><span></span></p>
              <p><span>达斡尔族</span><span>879人</span><span></span></p>
              <p><span>仫佬族</span><span>1140人</span><span></span></p>
              <p><span>羌族</span><span>821人</span><span></span></p>
              <p><span>布朗族</span><span>315人</span><span></span></p>
              <p><span>撒拉族</span><span>1361人</span><span>0.01%</span></p>
              <p><span>毛南族</span><span>349人</span><span></span></p>
              <p><span>仡佬族</span><span>3138人</span><span>0.01%</span></p>
              <p><span>锡伯族</span><span>1181人</span><span></span></p>
              <p><span>阿昌族</span><span>232人</span><span></span></p>
              <p><span>普米族</span><span>65人</span><span></span></p>
              <p><span>塔吉克族</span><span>48人</span><span></span></p>
              <p><span>怒族</span><span>44人</span><span></span></p>
              <p><span>乌孜别克族</span><span>50人</span><span></span></p>
              <p><span>俄罗斯族</span><span>286人</span><span></span></p>
              <p><span>鄂温克族</span><span>126人</span><span></span></p>
              <p><span>德昂族</span><span>70人</span><span></span></p>
              <p><span>保安族</span><span>32人</span><span></span></p>
              <p><span>裕固族</span><span>44人</span><span></span></p>
              <p><span>京族</span><span>49人</span><span></span></p>
              <p><span>塔塔尔族</span><span>13人</span><span></span></p>
              <p><span>独龙族</span><span>11人</span><span></span></p>
              <p><span>鄂伦春族</span><span>81人</span><span></span></p>
              <p><span>赫哲族</span><span>50人</span><span></span></p>
              <p><span>门巴族</span><span>25人</span><span></span></p>
              <p><span>珞巴族</span><span>6人</span><span></span></p>
              <p><span>基诺族</span><span>46人</span><span></span></p>
              <p>
                <span>未定族称人口</span><span>1775人</span><span>0.01%</span>
              </p>
              <p><span>入籍</span><span>131人</span><span></span></p>
            </div>
            <div class="list2" id="list2"></div>
          </div>
          <div class="panel-footer"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Board",
  data() {
    return {
      todayDate: "",
      tableColumn: [
        [
          { label: "部门", width: "20%" },
          { label: "规格", width: "40%" },
          { label: "待生产日期", width: "8%" },
          { label: "订单数", width: "8%" },
          { label: "生产数", width: "8%" },
          { label: "检测结果", width: "8%" },
          { label: "齐套率", width: "8%" },
        ],
        [
          { label: "父件物料号" },
          { label: "物料编码" },
          { label: "物料名称" },
          { label: "需求数量" },
          { label: "订单在制" },
          { label: "库存数" },
          { label: "待检数" },
          { label: "冻结数" },
          { label: "请购需求" },
        ],
        [
          { label: "物料名称" },
          { label: "申请日期" },
          { label: "申请数量" },
          { label: "到货数量" },
          { label: "未清数量" },
          { label: "申请交期" },
        ],
      ],
    };
  },
  components: {},
  watch: {},
  created() {
    this.todayDate = this.showtime();
  },
  methods: {
    showtime() {
      const now = new Date();
      const year = now.getFullYear(); // 获取当前年份
      const month = now.getMonth() + 1; // 获取当前月份，注意月份从 0 开始，所以要加 1
      const day = now.getDate(); // 获取当前日期
      const weekDay = now.getDay(); // 获取当前星期几，0 表示星期天，1 表示星期一，以此类推
      const weekDayNames = [
        "星期日",
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六",
      ];
      const weekDayName = weekDayNames[weekDay]; // 获取星期几的名称
      return `${year}年${month}月${day}日 ${weekDayName}`;
    },
  },
};
</script>

<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

// html {
//   width: 100%;
//   height: 100%;
// }
#app {
  font-family: Arial, Helvetica, sans-serif;
  margin: 0;
  padding: 0;
  /*  背景图定位 / 背景图尺寸  cover 完全铺满容器  contain 完整显示在容器内 */
  // background: url(../images/bg.jpg) no-repeat #000;
  background-color: #060765;
  background-size: cover;
  width: 100%;
  height: 100%;
}
.el-header {
  position: relative;
  height: 90px;
  background: url(./headBg.png) no-repeat top center;
  background-size: 100% 100%;
  .logo {
    position: absolute;
    height: 29px;
    width: 131px;
    left: 104px;
    top: 20px;
    background: url(./FSZM.png) no-repeat;
    background-size: 100% 100%;
  }
  h1 {
    font-size: 38px;
    color: #fff;
    text-align: center;
    height: 90px;
    font-weight: 600;
    line-height: 90px;
  }
  .showTime {
    position: absolute;
    height: 28px;
    right: 87px;
    top: 20px;
    color: #89bfff;
    font-weight: 400;
    line-height: 28px;
  }
}
.mainbox {
  width: 100%;
  height: calc(100% - 90px);
  // min-width: 1024px;
  // max-width: 1920px;
  padding: 0 20px 20px 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .row1 {
    width: 100%;
    display: flex;
    justify-content: space-between;
    height: 64%;
  }
  .row2 {
    width: 100%;
    overflow: hidden;
    display: flex;
    justify-content: space-between;
    height: 34%;
  }
}
.panel {
  position: relative;
  &.two {
    width: 49.5%;
    height: 100%;
  }
  &.three {
    width: 32.5%;
    height: 100%;
  }
  border: 1px solid rgba(73, 109, 204, 0.7);
  background: radial-gradient(
      58.45% 153.7% at 7.24% 1.57%,
      rgba(16, 17, 131, 0.7) 0%,
      rgba(6, 7, 101, 0.7) 100%
    )
    /* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */;
  box-shadow: inset 0px 0px 10px #455ac7;
  margin-bottom: 10px;
  .panel-footer {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    &::before {
      position: absolute;
      bottom: 0;
      left: 0;
      content: "";
      width: 10px;
      height: 10px;
      border-bottom: 2px solid #67d1ff;
      border-left: 2px solid #67d1ff;
    }
    &::after {
      position: absolute;
      bottom: 0;
      right: 0;
      content: "";
      width: 10px;
      height: 10px;
      border-bottom: 2px solid #67d1ff;
      border-right: 2px solid #67d1ff;
    }
  }
  .chartHead {
    width: 100%;
    height: 55px;
    background: url(./chartHead.png) no-repeat;
    background-size: 100% 100%;
  }
  h2 {
    height: 100%;
    line-height: 55px;
    padding-left: 25px;
    color: #fff;
    font-size: 22px;
    font-weight: 400;
  }
  .chart1 {
    padding: 0 12px;
    height: 570px;
  }
  .chart2 {
    padding: 0 12px;
    height: 230px;
  }
  .tableHead {
    span {
      color: #00ffff;
      font-weight: 400;
      font-size: 18px;
    }
    width: 100%;
    height: 50px;
    background: rgba(0, 255, 255, 0.2);
  }
}
// .no {
//   background: rgba(101, 132, 226, 0.1);
//   padding: 0.1875rem;
//   .no-hd {
//     position: relative;
//     border: 1px solid rgba(25, 186, 139, 0.17);
//     &::before {
//       content: "";
//       position: absolute;
//       width: 30px;
//       height: 10px;
//       border-top: 2px solid #67d1ff;
//       border-left: 2px solid #67d1ff;
//       top: 0;
//       left: 0;
//     }
//     &::after {
//       content: "";
//       position: absolute;
//       width: 30px;
//       height: 10px;
//       border-bottom: 2px solid #67d1ff;
//       border-right: 2px solid #67d1ff;
//       right: 0;
//       bottom: 0;
//     }
//     ul {
//       display: flex;
//       li {
//         position: relative;
//         flex: 1;
//         text-align: center;
//         height: 1rem;
//         line-height: 1rem;
//         font-size: 0.875rem;
//         color: #ffeb7b;
//         padding: 0.05rem 0;
//         font-family: electronicFont;
//         font-weight: bold;
//         &:first-child::after {
//           content: "";
//           position: absolute;
//           height: 50%;
//           width: 1px;
//           background: rgba(255, 255, 255, 0.2);
//           right: 0;
//           top: 25%;
//         }
//       }
//     }
//   }
//   .no-bd ul {
//     display: flex;
//     li {
//       flex: 1;
//       height: 0.5rem;
//       line-height: 0.5rem;
//       text-align: center;
//       font-size: 0.225rem;
//       color: rgba(255, 255, 255, 0.7);
//       padding-top: 0.125rem;
//     }
//   }
// }
// .map {
//   position: relative;
//   height: 10.125rem;
//   .chart {
//     position: absolute;
//     top: 0;
//     left: 0;
//     z-index: 5;
//     height: 10.125rem;
//     width: 100%;
//   }
//   .map1,
//   .map2,
//   .map3 {
//     position: absolute;
//     top: 50%;
//     left: 50%;
//     transform: translate(-50%, -50%);
//     width: 6.475rem;
//     height: 6.475rem;
//     background: url(../images/map.png) no-repeat;
//     background-size: 100% 100%;
//     opacity: 0.3;
//   }
//   .map2 {
//     width: 8.0375rem;
//     height: 8.0375rem;
//     background-image: url(../images/lbx.png);
//     opacity: 0.6;
//     animation: rotate 15s linear infinite;
//     z-index: 2;
//   }
//   .map3 {
//     width: 7.075rem;
//     height: 7.075rem;
//     background-image: url(../images/jt.png);
//     animation: rotate1 10s linear infinite;
//   }

//   @keyframes rotate {
//     from {
//       transform: translate(-50%, -50%) rotate(0deg);
//     }
//     to {
//       transform: translate(-50%, -50%) rotate(360deg);
//     }
//   }
//   @keyframes rotate1 {
//     from {
//       transform: translate(-50%, -50%) rotate(0deg);
//     }
//     to {
//       transform: translate(-50%, -50%) rotate(-360deg);
//     }
//   }
// }

// @media screen and (max-width: 1024px) {
//   html {
//     font-size: 42px !important;
//   }
// }
// @media screen and (min-width: 1920) {
//   html {
//     font-size: 80px !important;
//   }
// }

// #rule {
//   max-height: 90%;
//   overflow-y: hidden;
//   margin-top: 2%;
// }
// #list p {
//   display: flex;
//   color: rgba(255, 255, 255, 0.7);
//   font-size: 0.2rem;
//   margin-bottom: 0.2rem;
// }
// #list p span {
//   flex: 1;
//   text-align: center;
// }
// #list2 p {
//   display: flex;
//   color: rgba(255, 255, 255, 0.7);
//   font-size: 0.2rem;
//   margin-bottom: 0.2rem;
// }
// #list2 p span {
//   flex: 1;
//   text-align: center;
// }
</style>
