import { FileOutlined, FolderFilled } from '@ant-design/icons';
import { message } from 'antd';
import { useState } from 'react';

import DeleteModal from './DeleteModal';
import FileList from './FileList';
import FileSystemHeader from './FileSystemHeader';
import FileUploadModal from './FileUploadModal';
import FolderModal from './FolderModal';

const FileSystem = () => {
  const [currentPath, setCurrentPath] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [publishModalVisible, setPublishModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [uploads, setUploads] = useState([]);
  const [data, setData] = useState([
    {
      title: 'Folder 1',
      key: '1',
      type: 'folder',
      icon: <FolderFilled style={{ color: '#1890ff' }} />,
      size: '10 KB',
      modifiedTime: '2024-06-17',
      children: [
        {
          title: 'File 1.txt',
          type: 'file',
          key: '3',
          icon: <FileOutlined />,
          size: '10 KB',
          modifiedTime: '2024-06-17',
        },
      ],
    },
    {
      title: 'Folder 2',
      key: '2',
      type: 'folder',
      icon: <FolderFilled style={{ color: '#1890ff' }} />,
      size: '10 KB',
      modifiedTime: '2024-06-17',
      children: [
        {
          title: 'File 2.jpg',
          key: '4',
          type: 'file',
          icon: <FileOutlined />,
          size: '20 KB',
          modifiedTime: '2024-06-16',
        },
        {
          title: 'Empty Folder',
          key: '5',
          type: 'folder',
          icon: <FolderFilled style={{ color: '#1890ff' }} />,
          size: '0 KB',
          modifiedTime: '2024-06-17',
          children: [],
        },
      ],
    },
  ]);

  const handleAddFolder = () => {
    setModalVisible(true);
  };

  const handleUpload = ({ name, formData }) => {
    const upload = { name, progress: 0 };
    setUploads([...uploads, upload]);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploads((prevUploads) => {
        const updatedUploads = prevUploads.map((item) =>
          item.name === name ? { ...item, progress: item.progress + 10 } : item,
        );
        if (updatedUploads.find((item) => item.name === name).progress >= 100) {
          clearInterval(interval);
        }
        return updatedUploads;
      });
    }, 500);
  };

  const handleOk = () => {
    if (newFolderName.trim()) {
      const newData = [...data];
      let currentDir = newData;

      currentPath.forEach((key) => {
        currentDir = currentDir.find((item) => item.key === key).children;
      });

      currentDir.push({
        title: newFolderName,
        type: 'folder',
        key: `${Date.now()}`,
        icon: <FolderFilled style={{ color: '#1890ff' }} />,
        size: '0 KB',
        modifiedTime: '2024-06-17',
        children: [],
      });
      setData(newData);
      setNewFolderName('');
      setModalVisible(false);
    } else {
      message.error('Folder name cannot be empty');
    }
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const handlePublishOk = () => {
    message.success(`文件 ${selectedFile.title} 已发布`);
    setPublishModalVisible(false);
  };

  const handlePublishCancel = () => {
    setPublishModalVisible(false);
  };

  const handleDeleteOk = () => {
    const newData = [...data];
    let currentDir = newData;

    currentPath.forEach((key) => {
      currentDir = currentDir.find((item) => item.key === key).children;
    });

    const index = currentDir.findIndex((item) => item.key === selectedFile.key);
    currentDir.splice(index, 1);
    setData(newData);
    setDeleteModalVisible(false);
  };

  const handleDeleteCancel = () => {
    setDeleteModalVisible(false);
  };

  const handleBackButtonClick = () => {
    if (currentPath.length > 0) {
      setCurrentPath(currentPath.slice(0, -1));
    }
  };

  const handleHomeButtonClick = () => {
    setCurrentPath([]);
  };

  const filteredData = (items, keyword) => {
    if (!keyword) return items;
    return items.filter((item) => {
      if (item.type === 'folder') {
        item.children = filteredData(item.children, keyword);
      }
      return (
        item.title.toLowerCase().includes(keyword.toLowerCase()) ||
        (item.children && item.children.length > 0)
      );
    });
  };

  let currentDir = data;
  currentPath.forEach((key) => {
    currentDir = currentDir.find((item) => item.key === key).children;
  });

  currentDir = filteredData(currentDir, searchKeyword);

  return (
    <div>
      <FileSystemHeader
        currentPath={currentPath}
        handleHomeButtonClick={handleHomeButtonClick}
        handleBackButtonClick={handleBackButtonClick}
        handleAddFolder={handleAddFolder}
        setUploadModalVisible={setUploadModalVisible}
        searchKeyword={searchKeyword}
        setSearchKeyword={setSearchKeyword}
      />

      <FileList
        data={currentDir}
        currentPath={currentPath}
        setCurrentPath={setCurrentPath}
        setSelectedFile={setSelectedFile}
        setPublishModalVisible={setPublishModalVisible}
        setDeleteModalVisible={setDeleteModalVisible}
      />

      <FolderModal
        visible={modalVisible}
        handleOk={handleOk}
        handleCancel={handleCancel}
        newFolderName={newFolderName}
        setNewFolderName={setNewFolderName}
      />

      {/* <PublishModal
        visible={publishModalVisible}
        handleOk={handlePublishOk}
        handleCancel={handlePublishCancel}
        selectedFile={selectedFile}
      /> */}

      <DeleteModal
        visible={deleteModalVisible}
        handleOk={handleDeleteOk}
        handleCancel={handleDeleteCancel}
        selectedFile={selectedFile}
      />

      <FileUploadModal
        visible={uploadModalVisible}
        onCancel={() => setUploadModalVisible(false)}
        onUpload={handleUpload}
      />
    </div>
  );
};

export default FileSystem;
