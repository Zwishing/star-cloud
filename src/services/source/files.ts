import { request } from '@umijs/max';
import { Source } from './typings';

/** 获取数据 */
export async function getSourceItems(params: Source.ItemParams, options?: { [p: string]: any }) {
  return request<Source.ItemsResult>(`/v1/source/${params.sourceType}/items`, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
