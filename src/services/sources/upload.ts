// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';
import {UploadFile} from "antd";

/** 获取数据上传 */
export async function upload(body: File, options?: { [p: string]: any }) {
  return request('/api/upload', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
