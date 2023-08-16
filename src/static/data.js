import GC from "@grapecity/spread-sheets";
const spreadNS = GC.Spread.Sheets;
// Define highlight cell types
// export class HighlightColumnItemsCellType {
//     constructor() {
//         this.RADIUS = 10;
//         this.HIGHLIGHT_COLOR = "rgb(40, 171, 240)";
//         this.NORMAL_COLOR = "rgb(128, 255, 255)";
//         this.HIGHLIGHT_TIP = "Remove highlight.";
//         this.NORMAL_TIP = "Highlight negative numbers.";

//         spreadNS.CellTypes.ColumnHeader.apply(this);
//     }
// }
// HighlightColumnItemsCellType.prototype = new spreadNS.CellTypes.ColumnHeader();
// HighlightColumnItemsCellType.prototype.paint = function (ctx, value, x, y, width, height, style, context) {
//     spreadNS.CellTypes.ColumnHeader.prototype.paint.apply(this, arguments);

//     var tag = context.sheet.getTag(context.row, context.col, context.sheetArea);
//     var RADIUS = this.RADIUS;
//     ctx.save();
//     ctx.beginPath();
//     ctx.arc(x + width - RADIUS, y + height / 2, RADIUS / 2, 0, Math.PI * 2);
//     ctx.fillStyle = (tag && tag.color) || this.NORMAL_COLOR;
//     ctx.fill();
//     ctx.restore();
// };
// HighlightColumnItemsCellType.prototype.getHitInfo = function (x, y, cellStyle, cellRect, context) {
//     var RADIUS = this.RADIUS;
//     var centerX = cellRect.x + cellRect.width - RADIUS,
//             centerY = cellRect.y + cellRect.height / 2;
//     var hitInfo = {x: x, y: y, row: context.row, col: context.col, cellRect: cellRect, sheetArea: context.sheetArea, sheet: context.sheet};
//     if (Math.abs(x - centerX) <= RADIUS && Math.abs(y - centerY) <= RADIUS) {
//         hitInfo.isReservedLocation = true;
//     }
//     return hitInfo;
// };
// HighlightColumnItemsCellType.prototype.processMouseDown = function (hitInfo) {
//     this._hideTip();
// };
// HighlightColumnItemsCellType.prototype.processMouseMove = function (hitInfo) {
//     if (hitInfo.isReservedLocation) {
//         var sheet = hitInfo.sheet;
//         var offset = {
//             top:sheet.getParent().getHost().offsetTop,
//             left:sheet.getParent().getHost().offsetLeft
//         }
//         var tag = sheet.getTag(hitInfo.row, hitInfo.col, hitInfo.sheetArea);
//         this._showTip(offset.top + hitInfo.y + 20, offset.left + hitInfo.x + 20, (tag && tag.tip) || this.NORMAL_TIP);
//     } else {
//         this._hideTip();
//     }
// };
// HighlightColumnItemsCellType.prototype.processMouseUp = function (hitInfo) {
//     if (hitInfo.isReservedLocation) {
//         var sheet = hitInfo.sheet;
//         var tag = sheet.getTag(hitInfo.row, hitInfo.col, hitInfo.sheetArea);
//         if (!tag) {//first time
//             tag = {color: this.HIGHLIGHT_COLOR, tip: this.HIGHLIGHT_TIP};
//             sheet.setTag(hitInfo.row, hitInfo.col, tag, hitInfo.sheetArea);

//             var style = new spreadNS.Style();
//             style.foreColor = "red";
//             var ranges = [new spreadNS.Range(-1, hitInfo.col, -1, 1)];

//             var rule = sheet.conditionalFormats.addCellValueRule(spreadNS.ConditionalFormatting.ComparisonOperators.lessThan, 0, 0, style, ranges);

//             tag.rule = rule;
//             tag.isHighlighed = true;
//         } else if (!tag.isHighlighed) {
//             tag.color = this.HIGHLIGHT_COLOR;
//             tag.tip = this.HIGHLIGHT_TIP;

//             sheet.conditionalFormats.addRule(tag.rule);

//             tag.isHighlighed = true;
//         } else {
//             tag.color = this.NORMAL_COLOR;
//             tag.tip = this.NORMAL_TIP;

//             sheet.conditionalFormats.removeRule(tag.rule);

//             tag.isHighlighed = false;
//         }

//         var offset = {
//             top:sheet.getParent().getHost().offsetTop,
//             left:sheet.getParent().getHost().offsetLeft
//         }
//         this._showTip(offset.top + hitInfo.y + 20, offset.left + hitInfo.x + 20, (tag && tag.tip) || this.NORMAL_TIP);
//     }
// };
// HighlightColumnItemsCellType.prototype.processMouseEnter = function (hitInfo) {

// };
// HighlightColumnItemsCellType.prototype.processMouseLeave = function (hitInfo) {
//     this._hideTip();
// };
// HighlightColumnItemsCellType.prototype._showTip = function (top, left, tip) {
//     if (!this._tipElement) {
//         var span = document.createElement("span");
//         span.style.position = "absolute";
//         span.style.background = "#EEEEEE";
//         span.style.border = "1px solid black";
//         span.style.boxShadow = "5px 5px 5px rgba(0,0,0,0.4)";
//         span.style.fontSize = "14px";
//         document.body.insertBefore(span, null);
//         this._tipElement = span;
//     }
//     var tipElement = this._tipElement;
//     tipElement.textContent = tip;
//     var spanStyle = tipElement.style;
//     spanStyle.top = top + "px";
//     spanStyle.left = left + "px";
// };
// HighlightColumnItemsCellType.prototype._hideTip = function () {
//     if (this._tipElement) {
//         document.body.removeChild(this._tipElement);
//         this._tipElement = undefined;
//     }
// };

// export class HighlightRowItemsCellType {
//     constructor() {
//         this.RADIUS = 10;
//         this.HIGHLIGHT_COLOR = "rgb(40, 171, 240)";
//         this.NORMAL_COLOR = "rgb(128, 255, 255)";
//         this.HIGHLIGHT_TIP = "Remove highlight.";
//         this.NORMAL_TIP = "Highlight negative numbers.";

//         spreadNS.CellTypes.RowHeader.apply(this);
//     }
// }

// HighlightRowItemsCellType.prototype = new spreadNS.CellTypes.RowHeader();
// HighlightRowItemsCellType.prototype.paint = function (ctx, value, x, y, width, height, style, context) {
//     spreadNS.CellTypes.RowHeader.prototype.paint.apply(this, arguments);

//     var tag = context.sheet.getTag(context.row, context.col, context.sheetArea);
//     var RADIUS = this.RADIUS;
//     ctx.save();
//     ctx.beginPath();
//     ctx.arc(x + width - RADIUS, y + height / 2, RADIUS / 2, 0, Math.PI * 2);
//     ctx.fillStyle = (tag && tag.color) || this.NORMAL_COLOR;
//     ctx.fill();
//     ctx.restore();
// };
// HighlightRowItemsCellType.prototype.getHitInfo = function (x, y, cellStyle, cellRect, context) {
//     var RADIUS = this.RADIUS;
//     var centerX = cellRect.x + cellRect.width - RADIUS, centerY = cellRect.y + cellRect.height / 2;
//     var hitInfo = {x: x, y: y, row: context.row, col: context.col, cellRect: cellRect, sheetArea: context.sheetArea, sheet: context.sheet};
//     if (Math.abs(x - centerX) <= RADIUS && Math.abs(y - centerY) <= RADIUS) {
//         hitInfo.isReservedLocation = true;
//     }
//     return hitInfo;
// };
// HighlightRowItemsCellType.prototype.processMouseDown = function (hitInfo) {
//     this._hideTip();
// };
// HighlightRowItemsCellType.prototype.processMouseMove = function (hitInfo) {
//     if (hitInfo.isReservedLocation) {
//         var sheet = hitInfo.sheet;
//         var offset = {
//             top:sheet.getParent().getHost().offsetTop,
//             left:sheet.getParent().getHost().offsetLeft
//         }
//         var tag = sheet.getTag(hitInfo.row, hitInfo.col, hitInfo.sheetArea);
//         this._showTip(offset.top + hitInfo.y + 20, offset.left + hitInfo.x + 20, (tag && tag.tip) || this.NORMAL_TIP);
//     } else {
//         this._hideTip();
//     }
// };
// HighlightRowItemsCellType.prototype.processMouseUp = function (hitInfo) {
//     if (hitInfo.isReservedLocation) {
//         var sheet = hitInfo.sheet;
//         var tag = sheet.getTag(hitInfo.row, hitInfo.col, hitInfo.sheetArea);
//         if (!tag) {//first time
//             tag = {color: this.HIGHLIGHT_COLOR, tip: this.HIGHLIGHT_TIP};
//             sheet.setTag(hitInfo.row, hitInfo.col, tag, hitInfo.sheetArea);

//             var style = new spreadNS.Style();
//             style.foreColor = "red";
//             var ranges = [new spreadNS.Range(hitInfo.row, -1, 1, -1)];

//             var rule = sheet.conditionalFormats.addCellValueRule(spreadNS.ConditionalFormatting.ComparisonOperators.lessThan, 0, 0, style, ranges);

//             tag.rule = rule;
//             tag.isHighlighed = true;
//         } else if (!tag.isHighlighed) {
//             tag.color = this.HIGHLIGHT_COLOR;
//             tag.tip = this.HIGHLIGHT_TIP;

//             sheet.conditionalFormats.addRule(tag.rule);

//             tag.isHighlighed = true;
//         } else {
//             tag.color = this.NORMAL_COLOR;
//             tag.tip = this.NORMAL_TIP;

//             sheet.conditionalFormats.removeRule(tag.rule);

//             tag.isHighlighed = false;
//         }

//         var offset = {
//             top:sheet.getParent().getHost().offsetTop,
//             left:sheet.getParent().getHost().offsetLeft
//         }
//         this._showTip(offset.top + hitInfo.y + 20, offset.left + hitInfo.x + 20, (tag && tag.tip) || this.NORMAL_TIP);
//     }
// };
// HighlightRowItemsCellType.prototype.processMouseEnter = function (hitInfo) {

// };
// HighlightRowItemsCellType.prototype.processMouseLeave = function (hitInfo) {
//     this._hideTip();
// };
// HighlightRowItemsCellType.prototype._showTip = function (top, left, tip) {
//     if (!this._tipElement) {
//         var span = document.createElement("span");
//         span.style.position = "absolute";
//         span.style.background = "#EEEEEE";
//         span.style.border = "1px solid black";
//         span.style.boxShadow = "5px 5px 5px rgba(0,0,0,0.4)";
//         span.style.fontSize = "14px";
//         document.body.insertBefore(span, null);
//         this._tipElement = span;
//     }
//     var tipElement = this._tipElement;
//     tipElement.textContent = tip;
//     var spanStyle = tipElement.style;
//     spanStyle.top = top + "px";
//     spanStyle.left = left + "px";
// };
// HighlightRowItemsCellType.prototype._hideTip = function () {
//     if (this._tipElement) {
//         document.body.removeChild(this._tipElement);
//         this._tipElement = undefined;
//     }
// };

// // Define button cell type
// export class TopItemsCellType {
//     constructor(count) {
//         spreadNS.CellTypes.Button.apply(this);
//         count = +count || 10;
//         if (!count || isNaN(count) || count < 0) {
//             count = 10;
//         }
//         this.count = count;
//         this.text("Top " + count);
//     }
// }

// TopItemsCellType.prototype = new spreadNS.CellTypes.Button();
// TopItemsCellType.prototype.getHitInfo = function (x, y, cellStyle, cellRect, context) {
//     var self = this;
//     var leftX = cellRect.x + self.marginLeft(),
//             rightX = cellRect.x + cellRect.width - self.marginRight(),
//             topY = cellRect.y + self.marginTop(),
//             bottomY = cellRect.y + cellRect.height - self.marginBottom();
//     var info = {x: x, y: y, row: context.row, col: context.col, cellRect: cellRect, sheetArea: context.sheetArea, sheet: context.sheet};
//     if (leftX <= x && x <= rightX && topY <= y && y <= bottomY) {
//         info.isReservedLocation = true;
//     }
//     return info;
// };

// Define checkbox cell type
export function HeaderCheckBoxCellType() {
  // constructor(value) {
  GC.Spread.Sheets.CellTypes.CheckBox.apply(this);
  // value = +value || 0;
  // if (!value || isNaN(value) || value < 0) {
  //     value = 0;
  // }
  // this.value = value;
  this.caption("选择");
  // }
}
// export class HeaderCheckBoxCellType {
//     constructor(value) {
//         spreadNS.CellTypes.CheckBox.apply(this);
//         value = +value || 0;
//         if (!value || isNaN(value) || value < 0) {
//             value = 0;
//         }
//         this.value = value;
//         this.caption("选择");
//     }
// }

HeaderCheckBoxCellType.prototype = new spreadNS.CellTypes.CheckBox();
var basePaint = spreadNS.CellTypes.CheckBox.prototype.paint;
HeaderCheckBoxCellType.prototype.paint = function (
  ctx,
  value,
  x,
  y,
  width,
  height,
  style,
  context
) {
  var tag = !!(
    context.sheet.getTag(context.row, context.col, context.sheetArea) || false
  );

  basePaint.apply(this, [ctx, tag, x, y, width, height, style, context]);
};
HeaderCheckBoxCellType.prototype.getHitInfo = function (
  x,
  y,
  cellStyle,
  cellRect,
  context
) {
  if (context) {
    return {
      x: x,
      y: y,
      row: context.row,
      col: context.col,
      cellRect: cellRect,
      sheetArea: context.sheetArea,
      isReservedLocation: true,
      sheet: context.sheet,
    };
  }
  return null;
};

HeaderCheckBoxCellType.prototype.processMouseDown = function (hitInfo) {
  this._isMouseDown = true;

  // var sheet = hitInfo.sheet;
  // let  allData = sheet.getDataSource();
  //     allData.some((x,i) => {
  //         // sheet.setValue(i, 0,!x.isChecked);
  //         x.isChecked = !x.isChecked;
  //     });
};
HeaderCheckBoxCellType.prototype.processMouseUp = function (hitInfo) {
  if (this._isMouseDown) {
    this.doFilter(hitInfo);
    this._isMouseDown = false;
  }
  return true;
};
// 选择数据
HeaderCheckBoxCellType.prototype.doFilter = function (hitInfo) {
  var value = this.value,
    sheet = hitInfo.sheet,
    row = hitInfo.row,
    col = hitInfo.col,
    sheetArea = hitInfo.sheetArea;
  var tag = sheet.getTag(row, col, sheetArea);
  sheet.setTag(row, col, !tag, sheetArea);
  // var rowFilter = new spreadNS.Filter.HideRowFilter(new spreadNS.Range(-1, col, -1, 1));
  // sheet.rowFilter(rowFilter);
  // rowFilter.filterButtonVisible(false);
  // var condition = new spreadNS.ConditionalFormatting.Condition(spreadNS.ConditionalFormatting.ConditionType.numberCondition, {
  //     compareType: spreadNS.ConditionalFormatting.GeneralComparisonOperators.greaterThan,
  //     expected: value
  // });
  // rowFilter.addFilterItem(col, condition);

  //   var sheet = hitInfo.sheet;
  // let  allData = sheet.getDataSource();

  var sheet = hitInfo.sheet;
  let allData = sheet.getDataSource();
  let newData = [];
  if (!tag) {
    allData.forEach((element) => {
      newData.push(true);
    });
  } else {
    allData.forEach((element) => {
      newData.push(false);
    });
  }
  sheet.setArray(0, 0, newData);
};

// Define hyperlink cell type
// export class SortHyperlinkCellType {
//     constructor() {
//         spreadNS.CellTypes.HyperLink.apply(this);
//         this.text("Sort");
//     }
// }

// SortHyperlinkCellType.prototype = new spreadNS.CellTypes.HyperLink();
// SortHyperlinkCellType.prototype.getHitInfo = function (x, y, cellStyle, cellRect, context) {
//     if (context) {
//         return {
//             x: x,
//             y: y,
//             row: context.row,
//             col: context.col,
//             cellRect: cellRect,
//             cellStyle: cellStyle,
//             sheetArea: context.sheetArea,
//             isReservedLocation: true,
//             sheet: context.sheet
//         };
//     }
//     return null;
// };
// SortHyperlinkCellType.prototype.processMouseDown = function (hitInfo) {

// };
// SortHyperlinkCellType.prototype.processMouseMove = function (hitInfo) {

// };
// SortHyperlinkCellType.prototype.processMouseUp = function (hitInfo) {
//     var sheet = hitInfo.sheet, sheetArea = hitInfo.sheetArea,
//             row = hitInfo.row, col = hitInfo.col;

//     var tag = !(sheet.getTag(row, col, sheetArea) || false);

//     sheet.setTag(row, col, tag, sheetArea);

//     sheet.sortRange(0, 0, sheet.getRowCount(), sheet.getColumnCount(), true, [{
//         index: col,
//         ascending: tag
//     }]);

// };
// SortHyperlinkCellType.prototype.processMouseEnter = function (hitInfo) {

// };
// SortHyperlinkCellType.prototype.processMouseLeave = function (hitInfo) {

// };

// export function MyCheckBoxCellType() {
// 	GC.Spread.Sheets.CellTypes.CheckBox.apply(this);
// 	this.caption("All");
// }
// MyCheckBoxCellType.prototype = new GC.Spread.Sheets.CellTypes.CheckBox();
// var basePaint = GC.Spread.Sheets.CellTypes.CheckBox.prototype.paint;
// MyCheckBoxCellType.prototype.paint = function(ctx, value, x, y, width, height, style, context) {

// 	//var tag = context.sheet.getColumn(context.col,context.sheetArea).tag();
// 	var tag = context.sheet.getTag(context.row, context.col, context.sheetArea);
// 	if (tag !== true) {
// 		tag = false;
// 	}
// 	basePaint.apply(this, [ctx, tag, x, y, width, height, style, context]);
// };
// MyCheckBoxCellType.prototype.getHitInfo = function(x, y, cellStyle, cellRect, context) {
// 	if (context) {
// 		return {
// 			x: x,
// 			y: y,
// 			row: context.row,
// 			col: context.col,
// 			cellRect: cellRect,
// 			sheetArea: context.sheetArea,
// 			isReservedLocation: true,
// 			sheet: context.sheet
// 		};
// 	}
// 	return null;
// };

// MyCheckBoxCellType.prototype.processMouseUp = function(hitInfo) {

// 	var sheet = hitInfo.sheet,
// 		row = hitInfo.row,
// 		col = hitInfo.col,
// 		sheetArea = hitInfo.sheetArea;

// 	if (sheet.getCell(0, 0, GC.Spread.Sheets.SheetArea.colHeader).locked() && sheet.options.isProtected) {
// 		return;
// 	}

// 	var tag = sheet.getTag(row, col, sheetArea);
// 	//var tag = sheet.getColumn(col,sheetArea).tag();
// 	if (tag === undefined || tag === null) { //first time
// 		sheet.setTag(row, col, true, sheetArea);
// 		//sheet.getColumn(col,sheetArea).tag(true)
// 	} else {
// 		sheet.setTag(row, col, !tag, sheetArea);
// 		//sheet.getColumn(col,sheetArea).tag(!tag)
// 	}
// 	//add your code here
// 	tag = sheet.getTag(row, col, sheetArea);
// 	//tag = sheet.getColumn(col,sheetArea).tag();
// 	// sheet.setValue(-1, 0, tag);
// 	sheet.suspendPaint();
// 	for (var i = 0; i < sheet.getRowCount(); i++) {
// 		var cell = sheet.getCell(i, col);
// 		if (cell.cellType() instanceof GC.Spread.Sheets.CellTypes.CheckBox) {
// 			cell.value(tag);
// 		}
// 	}
// 	sheet.resumePaint();
// };
