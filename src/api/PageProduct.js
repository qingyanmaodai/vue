import request from '@/utils/request'
// 获取BOM 
export function GetBOM(data) {
    return request({
        url: '/APSAPI/GetBOM',
        method: 'POST',
        data
    })
}