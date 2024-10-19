// @ts-ignore
/* eslint-disable */

declare namespace User {
  type CurrentUser = {
    name?: string;
    avatar?: string;
    userId?: string;
    phoneNumber?: string;
  };


  type LoginResult = {
    code: number;
    data: {
      userId: string;
      token:string
    };
    msg?: string;
  };

  type LoginType = 'username' | 'email' | 'phone';

  type LoginParams = {
    userAccount: string;
    password: string;
    // autoLogin?: boolean;
    category?: LoginType;
  };

  type ErrorResponse = {
    /** 业务约定的错误码 */
    errorCode: string;
    /** 业务上的错误信息 */
    errorMessage?: string;
    /** 业务上的请求是否成功 */
    success?: boolean;
  };

}
