import { request } from '@umijs/max';
import { Source } from './typings';

/** 获取数据 */
export async function getNextItems(params: Source.ItemsParams, options?: { [p: string]: any }) {
  return request<Source.ItemsResp>(`/v1/source/${params.sourceCategory}/nextItems`, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function getPreviousItems(params: Source.ItemsParams, options?: { [p: string]: any }) {
  return request<Source.ItemsResp>(`/v1/source/${params.sourceCategory}/previousItems`, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function getHomeItems(params: Source.HomeItemsParams, options?: { [p: string]: any }) {
  return request<Source.ItemsResp>(`/v1/source/${params.sourceCategory}/homeItems`, {
    method: 'GET',
    params: {
      ...params,
    },
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

export async function upload(body: Source.UploadReq, options?: { [p: string]: any }) {
  const formData = new FormData();

  // 将文件和其他数据添加到 FormData
  formData.append('file', body.file); // 上传文件
  formData.append('sourceCategory', body.sourceCategory);
  formData.append('key', body.key);
  formData.append('name', body.name);
  return request<Source.ItemsResp>(`/v1/source/${body.sourceCategory}/upload`, {
    method: 'POST',
    data: formData,
    ...(options || {}),
  });
}

export async function deleteItems(params: Source.DeleteItems, options?: { [p: string]: any }) {
  return request<Source.ItemsResp>(`/v1/source/${params.sourceCategory}/deleteItems`, {
    method: 'DELETE',
    params: {
      key: params.key.join(','), // 将数组转为以逗号分隔的字符串
    },
    ...(options || {}),
  });
}
