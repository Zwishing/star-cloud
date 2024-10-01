import { Source } from '@/services/source/typings';
import { useBoolean } from 'ahooks';
import { UploadFile, message } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useModel } from 'umi';
import DeleteModal from './DeleteModal';
import FileList from './FileList';
import FileSystemHeader from './FileSystemHeader';
import FileUploadModal from './FileUploadModal';
import FolderModal from './FolderModal';
import UploadNotification from './UploadNotification';

const SourceCategory = 'vector';

const FileSystem: React.FC = () => {
  const [newFolderName, setNewFolderName] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [folderModalVisible, { setTrue: setFolderModalOpen, setFalse: setFolderModalClose }] =
    useBoolean(false);
  const [uploadModalVisible, { setTrue: setUploadModalOpen, setFalse: setUploadModalClose }] =
    useBoolean(false);
  const [deleteModalVisible, { setTrue: setDeleteModalOpen, setFalse: setDeleteModalClose }] =
    useBoolean(false);

  const [uploadListVisible, setUploadListVisible] = useState(false);

  const uploadNotificationRef = useRef<any>(); // 定义 uploadNotificationRef 的类型

  const { currentDir, setHomeDir, setPrevDir, getCurentKey, getFirstKey } = useModel(
    'CurrentDirModel',
    (model) => ({
      currentDir: model.currentDir,
      setHomeDir: model.setHomeDir,
      setPrevDir: model.setPrevDir,
      getCurentKey: model.getCurentKey,
      getFirstKey: model.getFirstKey,
    }),
  );

  const {
    items,
    fetchHomeItems, // 获取首页项目的函数
    fetchPrevItems, // 获取上一页项目的函数
    createNewFolder,
    handleDeleteItems,
  } = useModel('SourceItemModel', (model) => ({
    items: model.items,
    setItems: model.setItems, // 从模型中获取项目列表
    fetchHomeItems: model.fetchHomeItems, // 从模型中获取获取首页项目的函数
    fetchPrevItems: model.fetchPrevItems, // 从模型中获取获取上一页项目的函数
    createNewFolder: model.createNewFolder,
    handleDeleteItems: model.handleDeleteItems,
  }));

  const handleOkNewFolder = () => {
    if (newFolderName.trim()) {
      const folder: Source.NewFolderReq = {
        sourceCategory: SourceCategory,
        key: getCurentKey(),
        name: newFolderName,
        path: `${currentDir.path.join('')}/${newFolderName}`,
      };

      setNewFolderName('');
      setFolderModalClose();
      createNewFolder(folder);
    } else {
      message.error('文件夹名称不能为空');
    }
  };

  const handleDeleteOk = () => {
    handleDeleteItems({ key: selectedRowKeys, sourceCategory: SourceCategory });
    setSelectedRowKeys([]);
    setDeleteModalClose();
  };

  const handleBackButtonClick = () => {
    fetchPrevItems({
      key: getCurentKey(),
      sourceCategory: SourceCategory,
    });
    setPrevDir();
  };

  const handleHomeButtonClick = () => {
    fetchHomeItems({
      key: getFirstKey(),
      sourceCategory: SourceCategory,
    });
    setHomeDir(items[0].parentKey);
  };

  const handleUploadStart = (file: UploadFile) => {
    // 将上传文件的逻辑传递给 UploadNotification
    setUploadListVisible(true);

    if (uploadNotificationRef.current) {
      uploadNotificationRef.current.handleUploadStart(file);
    }

    

  };

  useEffect(() => {
    fetchHomeItems({
      key: getFirstKey(),
      sourceCategory: SourceCategory,
    });
    setHomeDir();
  }, []);

  return (
    <div>
      <FileSystemHeader
        handleHomeButtonClick={handleHomeButtonClick}
        handleBackButtonClick={handleBackButtonClick}
        handleAddFolder={setFolderModalOpen}
        setUploadModalVisible={setUploadModalOpen}
        searchKeyword={searchKeyword}
        setSearchKeyword={setSearchKeyword}
      />
      <FileList
        selectedRowKeys={selectedRowKeys}
        setSelectedRowKeys={setSelectedRowKeys}
        setDeleteModalOpen={setDeleteModalOpen}
      />
      <FolderModal
        visible={folderModalVisible}
        handleOk={handleOkNewFolder}
        handleCancel={setFolderModalClose}
        newFolderName={newFolderName}
        setNewFolderName={setNewFolderName}
      />
      <DeleteModal
        visible={deleteModalVisible}
        handleOk={handleDeleteOk}
        handleCancel={setDeleteModalClose}
      />

      <FileUploadModal
        visible={uploadModalVisible}
        onUploadStart={handleUploadStart}
        onCancel={setUploadModalClose}
      />
      <UploadNotification
        visible={uploadListVisible}
        onVisible={setUploadListVisible}
        ref={uploadNotificationRef}
      />
    </div>
  );
};

export default FileSystem;
