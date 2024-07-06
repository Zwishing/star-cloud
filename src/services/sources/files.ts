import { request } from '@umijs/max';

/** 获取数据 */
export async function getItems(params: API.ItemParams, options?: { [p: string]: any }) {
  return request<API.ItemsResult>('/api/source/items', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
