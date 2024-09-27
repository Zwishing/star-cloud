import { deleteItems, getHomeItems, getPreviousItems, newFolder } from '@/services/source/files';
import { Source } from '@/services/source/typings';
import { useBoolean, useRequest } from 'ahooks';
import { message } from 'antd';
import { useEffect, useState } from 'react';
import DeleteModal from './DeleteModal';
import FileList from './FileList';
import FileSystemHeader from './FileSystemHeader';
import FileUploadModal from './FileUploadModal';
import FolderModal from './FolderModal';

const FileSystem: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<string[]>(['']);
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedFile, setSelectedFile] = useState<string[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [key, setKey] = useState<string>('');
  const [path,setPath] = useState<string[]>(['/vector']);

  const [folderModalVisible, { setTrue: setFolderModalOpen, setFalse: setFolderModalClose }] =
    useBoolean(false);
  const [uploadModalVisible, { setTrue: setUploadModalOpen, setFalse: setUploadModalClose }] =
    useBoolean(false);
  const [deleteModalVisible, { setTrue: setDeleteModalOpen, setFalse: setDeleteModalClose }] =
    useBoolean(false);

  const [data, setData] = useState<Source.Item[]>([]);

  // Fetch home data
  const { run: fetchHomeData } = useRequest(() => getHomeItems({ sourceCategory: 'vector' }), {
    manual: true,
    onSuccess: (result) => {
      setKey(result.data.key);
      setCurrentPath([result.data.key]);
      setData(result.data.items); // Update the data state here
    },
    onError: (err) => {
      console.error('获取数据出错:', err.message);
    },
  });

  // Fetch previous items
  const { run: fetchPreviousItems } = useRequest((params) => getPreviousItems(params), {
    manual: true,
    onSuccess: (resp) => {
      if (resp.code === 200) {
        setData(resp.data.items);
        setCurrentPath((prev) => {
          const newDir = [...prev];
          newDir.pop();
          return newDir;
        });
      }
    },
    onError: (err) => {
      console.error('获取数据出错:', err);
    },
  });

  // Create new folder
  const { run: createNewFolder } = useRequest((folder) => newFolder(folder), {
    manual: true,
    onSuccess: (item) => {
      if (item.code === 200) {
        setData((prevData) => [...prevData, item.data]); // Update the data state
      }
    },
    onError: () => {
      message.error('文件夹创建失败');
    },
  });

  // Delete items
  const { run: handleDeleteItems } = useRequest((params) => deleteItems(params), {
    manual: true,
    onSuccess: (resp) => {
      if (resp.code === 200) {
        setData((prevData) => prevData.filter((item) => !selectedFile.includes(item.key)));
        setSelectedFile([]);
      }
      setDeleteModalClose();
    },
    onError: () => {
      message.error('删除失败');
    },
  });

  const handleOkNewFolder = () => {
    if (newFolderName.trim()) {
      const folder: Source.NewFolderReq = {
        sourceCategory: 'vector',
        key,
        name: newFolderName,
        path: `${path.join('')}/${newFolderName}`,
      };

      setNewFolderName('');
      setFolderModalClose();
      createNewFolder(folder); // Trigger new folder creation
    } else {
      message.error('文件夹名称不能为空');
    }
  };

  const handleDeleteOk = () => {
    handleDeleteItems({ key: selectedFile, sourceCategory: 'vector' }); // Trigger deletion
  };

  const handleBackButtonClick = () => {
    fetchPreviousItems({ key, sourceCategory: 'vector' }); // Call fetchPreviousItems with parameters
  };

  const handleHomeButtonClick = () => {
    fetchHomeData(); // Fetch home data
  };

  useEffect(() => {
    fetchHomeData(); // Fetch initial home data
  }, []);

  return (
    <div>
      <FileSystemHeader
        currentPath={currentPath}
        handleHomeButtonClick={handleHomeButtonClick}
        handleBackButtonClick={handleBackButtonClick}
        handleAddFolder={setFolderModalOpen}
        setUploadModalVisible={setUploadModalOpen}
        searchKeyword={searchKeyword}
        setSearchKeyword={setSearchKeyword}
      />
      <FileList
        data={data}
        currentPath={currentPath}
        setData={setData} // Pass setData to child for updates
        setSelectedFile={setSelectedFile}
        setDeleteModalOpen={setDeleteModalOpen}
        setCurrentPath={setCurrentPath}
        setKey={setKey}
        setPath={setPath}
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
      <FileUploadModal visible={uploadModalVisible} keyId={key} onCancel={setUploadModalClose} />
    </div>
  );
};

export default FileSystem;
