import { getSourceItems,newFolder } from '@/services/source/files'; // 导入获取数据的服务函数
import { Source } from '@/services/source/typings'; // 导入定义的类型
import { message } from 'antd';
import { useEffect, useState } from 'react';
import DeleteModal from './DeleteModal';
import FileList from './FileList';
import FileSystemHeader from './FileSystemHeader';
import FileUploadModal from './FileUploadModal';
import FolderModal from './FolderModal';

const FileSystem = () => {
  // 状态变量
  const [currentPath, setCurrentPath] = useState<string[]>([]); // 当前路径数组
  const [modalVisible, setModalVisible] = useState(false); // 模态框可见状态
  const [newFolderName, setNewFolderName] = useState(''); // 新文件夹名称
  const [_, setPublishModalVisible] = useState(false); // 发布模态框可见状态
  const [deleteModalVisible, setDeleteModalVisible] = useState(false); // 删除模态框可见状态
  const [selectedFile, setSelectedFile] = useState<Source.Item | null>(null); // 选中的文件状态
  const [searchKeyword, setSearchKeyword] = useState(''); // 搜索关键词状态
  const [uploadModalVisible, setUploadModalVisible] = useState(false); // 上传模态框可见状态
  const [uploads, setUploads] = useState<any[]>([]);
  const [key, setKey] = useState<string>("");// 上传文件状态数组
  const [path, setPath] = useState<string>("/vector");
  
  // 用于存储从API获取的数据
  const [data, setData] = useState<Source.Item[]>([]);

  // useEffect钩子，在组件挂载时获取数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await getSourceItems({ "key": key, "sourceCategory": "vector"}); // 调用获取数据的函数
        setData(resp.data.items); // 将获取的数据设置到状态中
        setKey(resp.data.key)
      } catch (error) {
        console.error('获取数据出错:', error); // 如果获取数据失败，输出错误信息
      }
    };
    fetchData(); // 调用获取数据的函数
  }, []); // 空依赖数组确保仅在组件挂载时执行一次

  // 处理添加文件夹的函数
  const handleAddFolder = () => {
    setModalVisible(true); // 显示添加文件夹的模态框
  };

  // 处理上传文件的函数
  const handleUpload = ({ name, formData }: { name: string; formData: FormData }) => {
    const upload = { name, progress: 0 }; // 初始化上传对象，包含名称和进度
    setUploads([...uploads, upload]); // 添加新的上传对象到上传数组中

    // 模拟上传进度
    const interval = setInterval(() => {
      setUploads((prevUploads) => {
        // 更新上传数组中的进度
        const updatedUploads = prevUploads.map((item) =>
          item.name === name ? { ...item, progress: item.progress + 10 } : item,
        );
        // 如果上传完成，清除定时器
        if (updatedUploads.find((item) => item.name === name).progress >= 100) {
          clearInterval(interval);
        }
        return updatedUploads; // 返回更新后的上传数组
      });
    }, 500); // 模拟的上传间隔时间
  };

  // 处理添加文件夹模态框中确定按钮的函数
  const handleOkAddFolder = async () => {
    if (newFolderName.trim()) {
      const newData = [...data]; // 创建数据副本
      let currentDir = newData;
      const folder :Source.NewFolderReq=  {
        sourceCategory: 'vector',
        key:   key,
        name: newFolderName,
        path: `${path}/${newFolderName}`,
      }
      
      setData(newData); // 更新状态中的数据
      setNewFolderName(''); // 清空新文件夹名称输入框
      setModalVisible(false); // 隐藏模态框
      try {
        const item = await newFolder(folder)
        if (item.code === 200) {
          // 将新文件夹添加到当前目录
          currentDir.push(item.data);
        } 
      } catch(error) { 
          message.error("文件夹创建失败")
      }
    } else {
      message.error('文件夹名称不能为空'); // 如果文件夹名称为空，显示错误消息
    }
  };

  // 处理取消按钮的函数
  const handleCancel = () => {
    setModalVisible(false); // 隐藏模态框
  };

  // 处理发布模态框中确定按钮的函数
  const handlePublishOk = () => {
    if (selectedFile) {
      message.success(`文件 ${selectedFile.name} 已发布`); // 显示成功发布的消息
    }
    setPublishModalVisible(false); // 隐藏发布模态框
  };

  // 处理发布模态框中取消按钮的函数
  const handlePublishCancel = () => {
    setPublishModalVisible(false); // 隐藏发布模态框
  };

  // 处理删除模态框中确定按钮的函数
  const handleDeleteOk = () => {
    const newData = [...data]; // 创建数据副本
    let currentDir = newData;

    // 在当前目录中找到选中文件的索引并删除
    const index = currentDir.findIndex((item) => item.key === selectedFile?.key);
    currentDir.splice(index, 1);

    setData(newData); // 更新状态中的数据
    setDeleteModalVisible(false); // 隐藏删除模态框
  };

  // 处理删除模态框中取消按钮的函数
  const handleDeleteCancel = () => {
    setDeleteModalVisible(false); // 隐藏删除模态框
  };

  // 处理返回按钮的函数
  const handleBackButtonClick = () => {
    if (currentPath.length > 0) {
      setCurrentPath(currentPath.slice(0, -1)); // 移除当前路径数组中的最后一项
    }
  };

  // 处理主页按钮的函数（重置当前路径）
  const handleHomeButtonClick = () => {
    setCurrentPath([]); // 设置当前路径为空数组
  };

  // 根据搜索关键词过滤数据的函数
  const filteredData = (items: typings.API.Item[], keyword: string): typings.API.Item[] => {
    if (!keyword) return items; // 如果关键词为空，返回所有项

    return items.filter((item) => {
      // 如果项的标题包含关键词或有子项，则返回true
      return item.name.toLowerCase().includes(keyword.toLowerCase());
    });
  };

  let currentDir = data; // 初始化当前目录为从API获取的数据

  currentDir = filteredData(currentDir, searchKeyword); // 根据搜索关键词过滤当前目录

  // 渲染FileSystem组件的JSX
  return (
    <div>
      {/* 渲染FileSystemHeader组件，并传递props */}
      <FileSystemHeader
        currentPath={currentPath}
        handleHomeButtonClick={handleHomeButtonClick}
        handleBackButtonClick={handleBackButtonClick}
        handleAddFolder={handleAddFolder}
        setUploadModalVisible={setUploadModalVisible}
        searchKeyword={searchKeyword}
        setSearchKeyword={setSearchKeyword}
      />

      {/* 渲染FileList组件，并传递props */}
      <FileList
        data={currentDir}
        currentPath={currentPath}
        setCurrentPath={setCurrentPath}
        setSelectedFile={setSelectedFile}
        setPublishModalVisible={setPublishModalVisible}
        setDeleteModalVisible={setDeleteModalVisible}
      />

      {/* 渲染FolderModal组件，并传递props */}
      <FolderModal
        visible={modalVisible}
        handleOk={handleOkAddFolder}
        handleCancel={handleCancel}
        newFolderName={newFolderName}
        setNewFolderName={setNewFolderName}
      />

      {/* 渲染DeleteModal组件，并传递props */}
      <DeleteModal
        visible={deleteModalVisible}
        handleOk={handleDeleteOk}
        handleCancel={handleDeleteCancel}
        selectedFile={selectedFile}
      />

      {/* 渲染FileUploadModal组件，并传递props */}
      <FileUploadModal
        visible={uploadModalVisible}
        onCancel={() => setUploadModalVisible(false)}
        onUpload={handleUpload}
      />
    </div>
  );
};

export default FileSystem;
