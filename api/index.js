import { get, post} from './fetch.js';
import regeneratorRuntime from '../utils/runtime';  // 这个是处理按async\await的

// 例子
export const getList = (client_id)=>{
    return get('xxx', {client_id}, '加载中')
}
