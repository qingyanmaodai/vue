export default function isObjEmpty(obj) {
  let keyArr = [],
    valueArr = [],
    isObjEmptyCount = 0;
  for (let key in obj) {
    keyArr.push(key);
    valueArr.push(obj[key]);
  }
  valueArr.forEach((item) => {
    if (item == "") {
      isObjEmptyCount++;
    }
  });
  if (keyArr.length == isObjEmptyCount) return true;
  else return false;
}
