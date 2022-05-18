import request from '@/utils/request'
// 销售订单下达
export function OneStepReleaseByOrder(data) {
    return request({
        url: '/APSAPI/OneStepReleaseByOrder',
        method: 'POST',
        data
    })
}

// 保存月销售计划
export function SaveSalesPlan(data) {
    return request({
        url: '/APSAPI/SaveSalesPlan',
        method: 'POST',
        data
    })
}

// 解析
export function SysData(data) {
    return request({
        url: '/APSAPI/Analysis',
        method: 'POST',
        data
    })
}

// 处理 销售计划导入保存
export function SaveSalesPlanDay(data) {
    return request({
        url: '/APSAPI/SaveSalesPlanDay',
        method: 'POST',
        data
    })
}
