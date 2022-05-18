import request from '@/utils/request'
// 分配拉线退回
export function BackOrderNo2(data) {
    return request({
        url: '/APSAPI/BackOrderNo2',
        method: 'POST',
        data
    })
}
// 指派任务到日计划
export function SaveSchedulingV2(data) {
    return request({
        url: '/APSAPI/SaveSchedulingV2',
        method: 'POST',
        data
    })
}

// 计算开拉期
export function computedStartDate(data) {
    return request({
        url: '/APSAPI/computedStartDate',
        method: 'POST',
        data
    })
}

// 保存日计划
export function SaveMOPlanStep4(data) {
    return request({
        url: '/APSAPI/SaveMOPlanStep4',
        method: 'POST',
        data
    })
}

// 下达到日计划
export function SaveMOPlanStep2(data) {
    return request({
        url: '/APSAPI/MOPlanStep2',
        method: 'POST',
        data
    })
}

// 齐套计算
export function OrderPlanMaterialForm(data) {
    return request({
        url: '/APSAPI/OrderPlanMaterialFormV3',
        method: 'POST',
        data
    })
}