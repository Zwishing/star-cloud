// @ts-ignore
/* eslint-disable */

export declare namespace Source {
  type SourceCategory = 'vector' | 'imagery';

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
    parentKey: string;
    name: string;
    key: string;
    type: 'file' | 'folder';
    path: string;
    size: number;
    lastModified: string;
  };

  type ItemsResp = {
    code: number;
    data: {
      key: string;
      items: Item[];
    };
    msg: string;
  };

  type ItemResp = {
    code: number;
    data: Item;
    msg: string;
  };

  type ItemsParams = {
    key: string;
    sourceCategory: SourceCategory;
  };

  type NewFolderReq = {
    sourceCategory: SourceCategory;
    key: string;
    name: string;
    path: string;
  };
}
