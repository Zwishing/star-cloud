import { request } from '@umijs/max';

/** 获取数据上传 */
export async function upload(body: File, options?: { [p: string]: any }) {
  return request('/api/upload', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
