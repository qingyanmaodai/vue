<template>
  <div class="demo">
    <div style="display: flex">
      <el-button
        :style="design.style || { display: 'none' }"
        plain
        type="primary"
        size="small"
        @click="displayDesign"
        >{{ design.name }}</el-button
      >
      <el-button
        :style="print.style || { display: 'none' }"
        plain
        type="warning"
        size="small"
        @click="printPreview"
        >{{ print.name }}</el-button
      >
      <el-button
        :style="setup.style || { display: 'none' }"
        plain
        type="success"
        size="small"
        @click="displaySetup"
        >{{ setup.name }}</el-button
      >
      <el-button
        :style="data.style || { display: 'none' }"
        plain
        type="primary"
        size="small"
        @click="getProgramData"
        >{{ data.name }}</el-button
      >
      <el-button
        :style="code.style || { display: 'none' }"
        plain
        type="primary"
        size="small"
        @click="getProgramCode"
        >{{ code.name }}</el-button
      >
      <el-button
        :style="version.style || { display: 'none' }"
        plain
        type="primary"
        size="small"
        @click="getVersion"
        >{{ version.name }}</el-button
      >
    </div>
    <object
      id="LODOP_OB"
      classid="clsid:2105C259-1E0C-4534-8141-A753534CB4CA"
      width="800"
      height="400"
      :hidden="true"
    >
      <embed
        id="LODOP_EM"
        type="application/x-print-lodop"
        width="820"
        height="450"
        pluginspage="install_lodop64.exe"
      />
    </object>
    <div :hidden="true">
      <textarea rows="5" cols="100" v-model="ProgramDataTMP"></textarea>
    </div>
    <div :hidden="true">
      <textarea rows="5" cols="100" v-model="ProgramCodesTMP"></textarea>
    </div>
  </div>
</template>

<script>
import { Handler } from "mockjs";
import { lopdopHtml, getLodop } from "./LodopFuncs";
var LODOP = null;
var that = null;
function checkString(str, defaultValue) {
  if (str === "" || str == null || str == undefined) {
    return defaultValue;
  }
  return str;
}
export default {
  name: "demo",
  props: {
    design: {
      type: Object,
      default: function () {
        return {
          name: "打印设计",
        };
      },
    },
    print: {
      type: Object,
      default: function () {
        return {
          name: "打印",
        };
      },
    },
    setup: {
      type: Object,
      default: function () {
        return {
          name: "打印维护",
        };
      },
    },
    data: {
      type: Object,
      default: function () {
        return {
          name: "生成模板",
        };
      },
    },
    code: {
      type: Object,
      default: function () {
        return {
          name: "生成代码",
        };
      },
    },
    version: {
      type: Object,
      default: function () {
        return {
          name: "获取版本号",
        };
      },
    },
    template: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  data() {
    return {
      IsChanged: false,
      IsDesgined: false,
      ProgramDataTMP: null,
      ProgramCodesTMP: null,
    };
  },
  watch: {
    ProgramCodesTMP: {
      handler(n, o) {
        if (n == o) {
          return;
        }
        if (n) {
          var strRegex = new RegExp("LODOP.*\\([\\s\\S]*?\\);", "gi");
          var strRegexValue = n.match(strRegex);
          var newProgramCodesArr = [];
          for (var i = 2; i <= strRegexValue.length - 1; i++) {
            newProgramCodesArr.push(strRegexValue[i] + "\r\n");
          }
          let newProgramCodes = newProgramCodesArr.join("");
          this.$emit("ProgramCodesChanged", newProgramCodes);
        }
      },
      deep: true,
    },
    template: {
      handler(n, o) {
        var strRegex = new RegExp("LODOP.*\\([\\s\\S]*?\\);", "gi");
        var strRegexValue = n.ProgramCodes.match(strRegex);
        if (strRegexValue == null) {
          strRegexValue = [];
        }
        var newProgramCodesArr = [];
        for (var i = 0; i <= strRegexValue.length - 1; i++) {
          newProgramCodesArr.push(strRegexValue[i] + "\r\n");
        }
        let newProgramCodes =
          `LODOP.PRINT_INITA('${n.Top || 0}','${n.Left || 0}','${
            n.Width || "210mm"
          }','${n.Height || "279mm"}','${n.ObjectName || "打印单"}');\n` +
          `LODOP.SET_PRINT_MODE('PROGRAM_CONTENT_BYVAR', true);\n` +
          newProgramCodesArr.join("");
        this.ProgramCodesTMP = newProgramCodes;
        this.IsChanged = true;
      },
      deep: true,
    },
  },
  mounted() {
    that = this;
  },
  methods: {
    // 打印
    printPreview() {
      debugger;
      if (LODOP == null) {
        LODOP = getLodop();
      }
      if (!LODOP) {
        this.$alert(lopdopHtml, "提示", {
          dangerouslyUseHTMLString: true,
        });
        return;
      }
      var resolveFun = function () {
        eval(that.ProgramCodesTMP);
        LODOP.PREVIEW();
      };
      this.getProgramCode(resolveFun);
    },
    // 打印维护
    displaySetup() {
      var resolveFun = function () {
        eval(that.ProgramCodesTMP);
        LODOP.SET_SHOW_MODE("DESIGN_IN_BROWSE", 1);
        LODOP.PRINT_SETUP();
      };
      this.getProgramCode(resolveFun);
    },
    // 打印设计
    displayDesign() {
      if (LODOP == null) {
        this.createPage();
        LODOP.SET_SHOW_MODE("DESIGN_IN_BROWSE", 1);
        LODOP.PRINT_DESIGN();
      } else {
        this.IsDesgined = !this.IsChanged;
        var resolveFun = function () {
          eval(that.ProgramCodesTMP);
          LODOP.SET_SHOW_MODE("DESIGN_IN_BROWSE", 1);
          LODOP.PRINT_DESIGN();
        };
        this.getProgramCode(resolveFun);
      }
    },
    createPage() {
      LODOP = getLodop(
        document.getElementById("LODOP_OB"),
        document.getElementById("LODOP_EM")
      );
      if (!LODOP) {
        this.$alert(lopdopHtml, "提示", {
          dangerouslyUseHTMLString: true,
        });
        return;
      }
      if (
        this.ProgramCodesTMP === "" ||
        this.ProgramCodesTMP == null ||
        this.ProgramCodesTMP == undefined
      ) {
        LODOP.PRINT_INITA(
          this.template.Top || 0,
          this.template.Left || 0,
          this.template.Width || "210mm",
          this.template.Height || "279mm",
          this.template.ObjectName || "打印单"
        );
        LODOP.SET_PRINT_MODE("PROGRAM_CONTENT_BYVAR", true);
      } else {
        eval(this.ProgramCodesTMP);
      }
    },
    // 生成模板
    async getProgramData(resolveFun) {
      LODOP =
        LODOP == null
          ? getLodop(
              document.getElementById("LODOP_OB"),
              document.getElementById("LODOP_EM")
            )
          : LODOP;
      if (!LODOP) {
        this.$alert(lopdopHtml, "提示", {
          dangerouslyUseHTMLString: true,
        });
        return;
      }
      var TaskID1;
      LODOP.On_Return_Remain = true;
      if (LODOP.CVERSION)
        LODOP.On_Return = function (TaskID, Value) {
          if (TaskID == TaskID1) {
            that.ProgramDataTMP = Value;
            if (resolveFun != null && resolveFun != undefined) {
              resolveFun();
            }
          }
        };
      TaskID1 = LODOP.GET_VALUE("ProgramData", 0); //获得文档式模板
    },
    // 获取程序代码
    getProgramCode(resolveFun) {
      LODOP =
        LODOP == null
          ? getLodop(
              document.getElementById("LODOP_OB"),
              document.getElementById("LODOP_EM")
            )
          : LODOP;
      if (!LODOP) {
        this.$alert(lopdopHtml, "提示", {
          dangerouslyUseHTMLString: true,
        });
        return;
      }
      let TaskID1 = null;
      LODOP.On_Return_Remain = true;
      if (LODOP.CVERSION)
        LODOP.On_Return = function (TaskID, Value) {
          if (TaskID == TaskID1) {
            if (that.IsDesgined) {
              that.ProgramCodesTMP = Value;
              that.IsDesgined = false;
            } else {
              that.IsChanged = false;
            }
            if (
              resolveFun != null &&
              resolveFun != undefined &&
              typeof resolveFun === "function"
            ) {
              resolveFun();
            } else if (typeof resolveFun != "function") {
              that.ProgramCodesTMP = Value;
              that.evalProgramCode();
            }
          }
        };
      TaskID1 = LODOP.GET_VALUE("ProgramCodes", 0); //获得代码
    },
    // Eval
    evalProgramCode() {
      eval(this.ProgramCodesTMP);
    },
    // 获取版本号
    getVersion() {
      alert(LODOP.VERSION);
    },
  },
};
</script>
<style scoped></style>
