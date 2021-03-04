import axios from 'axios';

const USER_API_BASE_URL = "http://localhost:8000/indicator";
const USER_API_BASE_URL_FORIGN = "http://localhost:8000/indicator/exeForeign";
const USER_API_BASE_URL_KOR = "http://localhost:8000/indicator/exeKorList";
const USER_API_BASE_URL_ONE_EURUSD = "http://localhost:8000/indicator/labelDalOneList";
const USER_API_BASE_URL_CHART_EURUSD = "http://localhost:8000/indicator/labelDalAllList";
const USER_API_BASE_URL_CHART = "http://localhost:8000/indicator/chart";
const USER_API_BASE_URL_INDI1 = "http://localhost:8000/indicator/indi1";
const USER_API_BASE_URL_INDI2 = "http://localhost:8000/indicator/indi2";
const USER_API_BASE_URL_CORRABS = "http://localhost:8000/indicator/corrAbs";


class IndApiService {

    //국외 환율 정보 리스트
    exeForeignList() {
         return axios.get(USER_API_BASE_URL_FORIGN);
     }
    
    //국내 환율 정보 리스트
    exeKorList() {
        return axios.get(USER_API_BASE_URL_KOR);
    }

    //목록페이지 차트_EURUSD
    labelDalAllList() {
        return axios.get(USER_API_BASE_URL_CHART_EURUSD);
    }

    //1일의 EURUSD 수치
     labelDalOneList() {
        return axios.get(USER_API_BASE_URL_ONE_EURUSD);
    }

    //차트데이터-국내환율
    chartIndi(num) {
        num = parseInt(num);
        return axios.get(USER_API_BASE_URL_CHART + '/' + num);
    }

    //차트데이터-해외환율
    chartIndiExeFor(symbol, num) {
        num = parseInt(num);
        return axios.get(USER_API_BASE_URL_CHART  + '/' + symbol + '/' + num);
    }

   //지표-유형1(국제금,WTI)
   indicators1(tableName, num) {
    num = parseInt(num);
    return axios.get(USER_API_BASE_URL_INDI1  + '/' + tableName + '/' + num);
    }

    //지표-유형2(미10년,미2년,달러인덱스,비트코인)
    indicators2(tableName, num) {
    num = parseInt(num);
    return axios.get(USER_API_BASE_URL_INDI2  + '/' + tableName + '/' + num);
    }

    //상관관계 절대값으로 최상위값 표현
    corrAbs(indi, num) {
    num = parseInt(num);
    return axios.get(USER_API_BASE_URL_CORRABS  + '/' + indi + '/' + num);
    }



    //차트라벨_EURUSD
    //labelDalAllList() {
    //    return axios.get(USER_API_BASE_URL_LABEL_EURUSD);
    //}

    // fetchUserByID(userID) {
    //     return axios.get(USER_API_BASE_URL + '/' + userID);
    // }

    // deleteUser(userID) {
    //     return axios.delete(USER_API_BASE_URL + '/' + userID);
    // }

    // addUser(user) {
    //     return axios.post(USER_API_BASE_URL, user);
    // }

    // editUser(user) {
    //     return axios.put(USER_API_BASE_URL + '/' + user.id, user)
    // }
 
}

export default new IndApiService();