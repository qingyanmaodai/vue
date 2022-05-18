
//excel表格导出功能
function export2Excel(columns, list, excelName) {
    require.ensure([], () => {
        const { export_json_to_excel } = require('@/verb/Export2Excel');
        let tHeader = []
        let filterVal = []
        columns.forEach(item => {
            tHeader.push(item.label)
            filterVal.push(item.param || item.prop)
        })
        const data = list.map(v => filterVal.map(j => v[j]))
        export_json_to_excel(tHeader, data, excelName);
    })
}

import XLSX from "xlsx";

export function import2Excel(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = e.target.result;
            this.wb = XLSX.read(data, {
                type: "binary",
            });
            const result = [];

            this.wb.SheetNames.forEach((sheetName) => {
                result.push({
                    sheetName: sheetName,
                    sheet: XLSX.utils.sheet_to_json(this.wb.Sheets[sheetName]),
                });
            });
            resolve(result);
        };
        reader.readAsBinaryString(file.raw);
    });
}

export default export2Excel
