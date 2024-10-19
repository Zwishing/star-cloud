// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';
import {hashPassword} from '@/util/util'

/** 获取当前的用户 GET /v1/user/currentUser */
export async function currentUser(options?: { [key: string]: any }) {
  return request<{
    data: User.CurrentUser;
  }>('/v1/user/currentUser', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 退出登录接口 POST /api/login/outLogin */
export async function outLogin(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/login/outLogin', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 登录接口 POST /v1/user/login */
export async function login(body: User.LoginParams, options?: { [key: string]: any }) {

  // 给秘密加入MD5加密
  // const password = hashPassword(body.password);
  // body = {...body,password}

  return request<User.LoginResult>('/v1/user/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}



