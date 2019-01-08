import {UtilsBase} from "./UtilsBase";

export default class ArrayApi {

  /**
   * 提取数组一个字段的数组
   * @param data
   * @param attr
   * @returns {Array}
   */
    getFieldValue(data, attr){
        let result = [];
        data = data || [];

        for (let i = 0, l = data.length; i < l; i++){
            result.push(data[i][attr]);
        }
        return result;
    }

  /**
   * 提取数组元素中某些字段
   * @param data
   * @param keys {String|Array}
   * @returns {Array}
   */
    getFieldsValue(data, keys){
        let result = [], obj, copy, h, j, temp;

        if (!(keys instanceof Array)){
            keys = [keys];
        }

        for (let i = 0, l = data.length; i < l; i++) {
            obj = data[i];
            copy = {};
            result.push(copy);

            for (h = 0, j = keys.length; h < j; h++) {
                temp = obj[keys[h]];
                copy[keys[h]] = temp;
            }
        }
        return result;
    }

  /**
   * 搜索复杂的数据结构的数组
   * 返回index，未找到返回-1
   * @param data
   * @param filed
   * @param value
   * @returns {number}
   */
    indexByFieldValue(array, filed, value){
        let l = array.length, index = -1;
        for (let i = 0; i < l; i++){
            if (UtilsBase.checkIsEqual(array[i][filed], value)){
                index = i;
                break;
            }
        }
        return index;
    }
}
