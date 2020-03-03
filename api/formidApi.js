import { get, post} from './fetch.js';
import regeneratorRuntime from '../utils/runtime.js';

export function postFormId(formidString){
    return post('', {formid: formidString})
}