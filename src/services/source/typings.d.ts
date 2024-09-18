// @ts-ignore
/* eslint-disable */

export declare namespace Source {
  type Upload = {
    bucket?: string;
    key?: string;
    policy?: string;
    url?: string;
    algorithm?: string;
    credential?: string;
    date?: string;
    signature?: string;
  };

  type Item = {
    name: string;
    key: string;
    type: 'file' | 'folder';
    path: string;
    size?: number;
    lastModified?: string;
  };

  type ItemsResult = {
    code: number;
    data: Item[];
    msg: string;
  };

  type ItemParams = {
    sourceType: 'vector' | 'imagery';
    path: string;
  };
}
