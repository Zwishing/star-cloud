import { request } from '@umijs/max';
import { Source } from './typings';

/** 获取数据 */
export async function getSourceItems(params: Source.ItemsParams, options?: { [p: string]: any }) {
  return request<Source.ItemsResp>(`/v1/source/${params.sourceCategory}/items`, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function addSourceItem(
  params: Source.ItemsParams,
  body: Source.Item,
  options?: { [p: string]: any },
) {
  return request<Source.ItemsResp>(`/v1/source/${params.sourceCategory}/add`, {
    method: 'POST',
    params: {
      ...params,
    },
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function newFolder(body: Source.NewFolderReq, options?: { [p: string]: any }) {
  return request<Source.ItemResp>(`/v1/source/${body.sourceCategory}/newFolder`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
