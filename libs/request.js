import Promise from '../vendors/es6-promise';
import { APP_VERSION, CLIENT_TYPE, PRIVATE_KEY, API_VERSIONS, URL_PATH, USE_JAVA} from '../libs/config';
import objectAssign from '../vendors/object-assign';
import trimObject from '../utils/trimObject';
import queryString from '../vendors/query-string';
import md5 from '../vendors/md5';

const app = getApp();

function request (method = 'GET') {
    return function (url, params = {}, requestType) {
        return new Promise(function(resolve, reject) {
            // 处理params参数
            params.v = API_VERSIONS[requestType];
            
            if (USE_JAVA[requestType] === 'java'){
                url = url + '/yohomars' + URL_PATH[requestType]
              } else{
                url = url + '/api/v' + API_VERSIONS[requestType] + URL_PATH[requestType]
            }

            let body = _createBody(params);
            let queryStrigPair = _signParam(body,true);
            let data = '';

            url = url + '?' + queryStrigPair; // 拼接参数
            
            let header = {
                'Content-Type': 'application/x-www-form-urlencoded',
                // 'x-mars-verify' : resultString,
                //'Cookies': 'JSESSIONID=' + sessionkey,
            }

            wx.request({
                url,
                data,
                method,
                header: header,
                success: function(res) {
                    let statusCode = res.statusCode,
                        errMsg = res.errMsg,
                        data = res.data;

                    if (statusCode == 200) {
                        resolve(data);
                    } else {
                        let code = statusCode;
                        let message = res.data.message ? res.data.message : '';
                        let data = res.data.data || {};
                        reject({code, message, data});
                    }
                },
                fail: function(err) {
                    let code = err.code ? err.code : 800;
                    let message = err.message ? err.message : '';
                    reject({code, message});
                }
            })
        })
    }
}

function _createBody(body) {
    let defaultBody = _publicParams();
    let newBody = objectAssign(defaultBody, body);
    return newBody;
}

function _publicParams() {
    let app_version = APP_VERSION;
    let os_version = '';
    let client_type = CLIENT_TYPE;
    let screen_size = '';
    let privateKey = PRIVATE_KEY;
    let lang = 'zh';
    try {
        let res = wx.getSystemInfoSync();
        screen_size = res.windowWidth + 'x' + res.windowHeight;
        os_version = res.version;
    } catch (e) {
        // Do something when catch error
    }

    return {
        app_version,
        os_version,
        client_type,
        screen_size,
        lang,
    };
}

function _signParam(params,opt) {
    let private_key = PRIVATE_KEY;
    let allParams = objectAssign(params, {private_key});

    allParams = trimObject(allParams);	// 去除首尾空格
    let paramsPair = queryString.stringify(allParams, {encode: false});
    let client_secret = md5(paramsPair);

    delete allParams.private_key;

    let resultParams = objectAssign(allParams, {client_secret});
    let resultString;
    if (opt === true){
        resultString = queryString.stringify(resultParams,{encode: true});
    }else{
        resultString = queryString.stringify(resultParams,{encode: false});
    }
    return resultString;
}

export const GET = request('GET','');