import { get, post} from './fetch.js';
import regeneratorRuntime from '../utils/runtime';  // 这个是处理按async\await的

// 例子
export const authLogin = ()=>{
    return get('xxx', {}, '加载中')
}
