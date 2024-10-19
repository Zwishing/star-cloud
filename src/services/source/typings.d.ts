// @ts-ignore
/* eslint-disable */

export declare namespace Source {
  type SourceCategory = 'vector' | 'imagery';

  type ServiceCategory = 'mvt' | 'feature';

  type UploadReq = {
    sourceCategory: SourceCategory;
    key: string;
    name: string;
    file: File; // 添加文件字段
  };

  type UploadResp = {
    code: number;
    data: {
      key: string;
    };
    msg: string;
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

  type PublishReq = {
    serviceName: string;
    sourceCategory: SourceCategory;
    sourceKey: string;
    serviceCategory: ServiceCategory[];
    description: string;
  }
}
