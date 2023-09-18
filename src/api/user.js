import request from "@/utils/request";
import { getToken } from "@/utils/auth";
export function NEWLOGIN(data) {
  return request({
    url: "/Login/CheckAccount",
    method: "post",
    data,
    // CheckAccountJson
    transformRequest: [
      function (data) {
        let ret = "";
        for (let it in data) {
          ret +=
            encodeURIComponent(it) + "=" + encodeURIComponent(data[it]) + "&";
        }
        ret = ret.substring(0, ret.lastIndexOf("&"));
        return ret;
      },
    ],
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
}

export function OrgData(data) {
  return request({
    url: "/APSAPI/GetOrganize",
    method: "post",
    data,
    headers: {
      "Content-Type": "application/json",
    },
  });
}


export function CheckSSO(data) {
  return request({
    url: "/APSAPI/CheckSSO",
    method: "post",
    data,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
