import { API_HOST } from '../libs/config';
import { GET } from '../libs/request';
import { getImageShape, formatTime } from '../utils/util';

export default {

    //广告数据
    getAdsData (params) {
        return GET(API_HOST, params, 'RANGE_ADSREST').then(result => {
            if (result && result.code === 200 && result.data) {
                if (result.data.imgInfo) {
                    result.data.imgInfo.url = getImageShape(result.data.imgInfo.url, params.width, params.height, 1);
                }   
            }
            return result;
        }).catch(error => {

            return error;
        })
    }
}