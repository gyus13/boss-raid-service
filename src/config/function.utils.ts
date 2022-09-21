/**
 * description : response를 만들어 주는 함수, result에 들어갈 것이 없다면 undefined 입력해야함
 * @param response
 * @param data
 * @returns object
 */
export function makeResponse(response: any, data: any | any[] | undefined) {
  response.result = data;
  return response;
}

// expiredDate 생성
export function defaultCurrentDateTime(currentTime, raidDatas) {
  return currentTime.setMinutes(
    currentTime.getMinutes() + Number(raidDatas.bossRaidLimitSeconds) / 60,
  );
}

export function generateDateFormatComponent() {
  const date = new Date();
  return date;
}
