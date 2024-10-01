import {
  deleteItems,
  getHomeItems,
  getNextItems,
  getPreviousItems,
  newFolder,
  upload,
} from '@/services/source/files'; // 导入获取首页、下一页和上一页项目的API函数
import { Source } from '@/services/source/typings'; // 导入类型定义
import { useRequest } from 'ahooks'; // 导入ahooks的useRequest
import { message } from 'antd';
import { useState } from 'react'; // 导入React的useState

export default function SourceItem() {
  const [items, setItems] = useState<Source.Item[]>([]); // 存储获取到的项目列表，初始化为空数组
  // 获取首页项目的请求
  const { run: fetchHomeItems } = useRequest(
    (param: Source.ItemsParams) => getHomeItems({ sourceCategory: param.sourceCategory }),
    {
      manual: true,
      onSuccess: (resp) => {
        if (resp.code === 200) {
          setItems(resp.data.items); // 更新项目列表
        }
      },
      onError: (err) => {
        message.error(`获取数据出错:${err.message}`); // 设置错误信息
      },
    },
  );

  // 获取下一页项目的请求
  const { run: fetchNextItems } = useRequest((param: Source.ItemsParams) => getNextItems(param), {
    manual: true,
    onSuccess: (resp) => {
      if (resp.code === 200) {
        setItems(resp.data.items); // 更新项目列表
      }
    },
    onError: (err) => {
      message.error(`获取数据出错:${err.message}`); // 设置错误信息
    },
  });

  // 获取上一页项目的请求
  const { run: fetchPrevItems } = useRequest(
    (param: Source.ItemsParams) => getPreviousItems(param),
    {
      manual: true,
      onSuccess: (resp) => {
        if (resp.code === 200) {
          setItems(resp.data.items); // 更新项目列表
        }
      },
      onError: (err) => {
        message.error(`获取数据出错:${err.message}`); // 设置错误信息
      },
    },
  );

  const { run: createNewFolder } = useRequest((folder) => newFolder(folder), {
    manual: true,
    onSuccess: (item) => {
      if (item.code === 200) {
        setItems((prevData: any) => [...prevData, item.data]);
      }
    },
    onError: () => {
      message.error('文件夹创建失败');
    },
  });

  const { run: handleDeleteItems } = useRequest(
    (params: Source.DeleteItems) => deleteItems(params),
    {
      manual: true,
      onSuccess: (resp, params) => {
        if (resp.code === 200) {
          setItems((prevData) => prevData.filter((item) => !params[0].key.includes(item.key)));
        }
      },
      onError: () => {
        message.error('删除失败');
      },
    },
  );

  // 根据key获取项目
  const getItemsByKey = (param: Source.ItemsParams) => {
    if (param.key) {
      fetchNextItems(param); // 调用获取下一页项目的函数
    } else {
      fetchHomeItems(param); // 如果key为空，则获取首页项目
    }
  };

  const { run: uploadFile } = useRequest((param: Source.UploadReq, options: {
      onUploadProgress: (progressEvent: any) => void,
      onSuccess:(resp:any)=>void,
      onError:(err:Error)=>void
    }) => upload(param, {onUploadProgress: options.onUploadProgress}), {
      manual: true,
      onSuccess: (resp, params) => {
        params[1].onSuccess(resp)
        getItemsByKey({
          key:params[0].key,
          sourceCategory:params[0].sourceCategory,
        })
      },
      onError: (err,params) => {
        params[1].onError(err)
      },
    });

  

  // 返回的内容
  return {
    items,
    setItems,
    fetchHomeItems,
    fetchNextItems,
    fetchPrevItems,
    getItemsByKey,
    createNewFolder,
    handleDeleteItems,
    uploadFile,
  };
}
