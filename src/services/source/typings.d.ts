// @ts-ignore
/* eslint-disable */

export declare namespace Source {
  type SourceCategory = 'vector' | 'imagery';

  type UploadReq = {
    sourceCategory: SourceCategory;
    key: string;
    name: string;
    file: File; // 添加文件字段
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

  type DeleteItems = {
    key: string[];
    sourceCategory: SourceCategory;
  };

  type HomeItemsParams = {
    sourceCategory: SourceCategory;
  };

  type NewFolderReq = {
    sourceCategory: SourceCategory;
    key: string;
    name: string;
    path: string;
  };
}
