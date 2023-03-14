export default {
  // 判断按钮权限
  judgeBtn(thisWay, routeBtn) {
    let _this = thisWay;
    if (routeBtn && routeBtn.length > 0)
      routeBtn.some(item => {
        if (item.ButtonCode == "edit") {
          _this.$set(_this, "isEdit", true);
        }
        if (item.ButtonCode == "add") {
          _this.$set(_this, "isAdd", true);
        }
      });
    _this.$set(_this, "btnForm", routeBtn);
  }
};
