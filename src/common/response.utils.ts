//200 OK - 요청 성공
// 201 Created - 요청에 따른 새로운 리소스 생성 성공
// 204 No Content - 요청은 성공했지만 딱히 보내줄 내용이 없음
// 400 Bad Request - 잘못된 요청
// 401 Unauthorized - 비인증 요청
// 403 Forbidden - 비승인 요청
// 404 Not Found - 존재하지 않는 리소스에 대한 요청
// 500 Internal Server Error - 서버 에러
// 503 Service Unavailable - 서비스가 이용 불가능함

export const response = {
  SUCCESS: {
    isSuccess: true,
    code: 200,
    message: '성공',
  },
  UNAUTHORIZED: {
    isSuccess: false,
    code: 401,
    message: '인증되지 않은 권한입니다',
  },
  NON_EXIST_USER: {
    isSuccess: false,
    code: 404,
    message: '유저가 존재하지 않습니다.',
  },
  NON_EXIST_RAID_RECORD: {
    isSuccess: false,
    code: 404,
    message: '레이드 기록이 존재하지 않습니다.',
  },
  NOT_ACCESS_RAID: {
    isSuccess: false,
    code: 403,
    message: '현재 접속 할 수 없습니다.',
  },
  ERROR: {
    isSuccess: false,
    code: 500,
    message: '서버 에러 입니다.',
  },
};
