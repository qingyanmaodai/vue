import ElementUI from 'element-ui';
export default function approval(val, multipleSelection, check, drap) {
    if (val == "审核") {
        if (multipleSelection.length == 0) {
            ElementUI.Message({
                message: '请选择需要审核的数据！',
                type: 'error'
            });
        } else if (multipleSelection.length > 1) {
            ElementUI.Message({
                message: '请选择一条数据进行操作！',
                type: 'error'
            });
        } else if (multipleSelection.length == 1) {
            if (multipleSelection[0].State == 1) {
                //审核
                check();
            } else if (multipleSelection[0].State == 2) {
                ElementUI.Message({
                    message: `单据【${multipleSelection[0].PurchaseOrderNo}】已审核！`,
                    type: 'warning'
                });
            } else if (multipleSelection[0].State == 0) {
                ElementUI.Message({
                    message: `单据【${multipleSelection[0].PurchaseOrderNo}】未提交！`,
                    type: 'warning'
                });
            } else if (multipleSelection[0].State == 3) {
                ElementUI.Message({
                    message: `单据【${multipleSelection[0].PurchaseOrderNo}】已作废！`,
                    type: 'warning'
                });
            }
        }
    } else if (val == "弃审") {
        if (multipleSelection.length == 0) {
            ElementUI.Message({
                message: '请选择需要反审核的数据！',
                type: 'error'
            });
        } else if (multipleSelection.length > 1) {
            ElementUI.Message({
                message: '请选择一条数据进行操作！',
                type: 'error'
            });
        } else if (multipleSelection.length == 1) {
            if (multipleSelection[0].state == 0) {
                ElementUI.Message({
                    message: `单据【${multipleSelection[0].PurchaseOrderNo}】未提交！`,
                    type: 'warning'
                });
            } else if (multipleSelection[0].state == 1) {
                ElementUI.Message({
                    message: `单据【${multipleSelection[0].PurchaseOrderNo}】未审核！`,
                    type: 'warning'
                });
            } else if (multipleSelection[0].state == 2) {
                //弃审
                drap();
            } else if (multipleSelection[0].state == 3) {
                ElementUI.Message({
                    message: `单据【${multipleSelection[0].PurchaseOrderNo}】已作废！`,
                    type: 'warning'
                });
            }
        }
    }
}