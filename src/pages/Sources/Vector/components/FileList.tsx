import { FolderIcon, ZipIcon } from '@/components/Icon'; // Import the required icons
import { getNextItems } from '@/services/source/files';
import { Source } from '@/services/source/typings';
import { FileTextTwoTone } from '@ant-design/icons';
import { Button, Empty, Space, Table } from 'antd';
import { useEffect, useState } from 'react';
import './FileList.css';
import FileListActions from './FileListActions';

const FileList = ({
  data,
  currentPath,
  setData,
  setKey,
  setCurrentPath,
  setSelectedFile,
  // setPublishModalVisible,
  setDeleteModalOpen,
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  useEffect(() => {
    // Update selected files based on selectedRowKeys
    setSelectedFile(selectedRowKeys);
  }, [selectedRowKeys, setSelectedFile]);

  const handleRowClick = async (item: Source.Item) => {
    if (item.type === 'folder') {
      try {
        const resp = await getNextItems({ key: item.key, sourceCategory: 'vector' });
        setData(resp.data.items);
        setKey(item.key);
        setCurrentPath((prevPath: string[]) => [...prevPath, item.key]);
      } catch (error) {
        console.error(error);
      }
    }
  };

  // Function to format file size
  const formatFileSize = (size: number) => {
    if (size === 0) return '0 KB';
    if (size >= 1024 * 1024 * 1024) {
      return `${(size / (1024 * 1024 * 1024)).toFixed(1)} GB`;
    } else if (size >= 1024 * 1024) {
      return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    } else {
      return `${(size / 1024).toFixed(1)} KB`;
    }
  };

  // Function to determine the icon based on file type
  const getIconByFileType = (item: Source.Item) => {
    if (item.type === 'folder') {
      return <FolderIcon />;
    }
    const fileExtension = item.name.split('.').pop()?.toLowerCase();
    if (fileExtension === 'zip') {
      return <ZipIcon />;
    }
    // Add more conditions for different file types and return respective icons
  
    return <FileTextTwoTone />; // Default icon for other file types
  };

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      render: (name: string, item: Source.Item) => (
        <Space onClick={() => handleRowClick(item)} style={{ cursor: 'pointer' }}>
          {getIconByFileType(item)}
          {name}
        </Space>
      ),
      sorter: (a: Source.Item, b: Source.Item) => a.name.localeCompare(b.name),
    },
    {
      title: '大小',
      dataIndex: 'size',
      render: (size: number) => formatFileSize(size),
      sorter: (a: Source.Item, b: Source.Item) => a.size - b.size,
    },
    {
      title: '修改日期',
      dataIndex: 'lastModified',
      sorter: (a: Source.Item, b: Source.Item) =>
        new Date(a.lastModified).getTime() - new Date(b.lastModified).getTime(),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys as string[]);
    },
  };

  const handleClearSelection = () => {
    setSelectedRowKeys([]);
  };

  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        {selectedRowKeys.length > 0 && <span>选中 {selectedRowKeys.length} 项</span>}
        {selectedRowKeys.length > 0 && (
          <Button type="link" onClick={handleClearSelection}>
            清除选择
          </Button>
        )}
      </div>
      <Table
        rowKey="key"
        columns={columns}
        dataSource={data}
        pagination={false}
        rowSelection={rowSelection}
        style={{
          borderRadius: '12px',
          overflow: 'hidden',
        }}
        locale={{
          emptyText: <Empty description="无数据" />,
        }}
      />
      {selectedRowKeys.length > 0 && (
        <FileListActions
          // showPublishModal={undefined}
          openDeleteModal={setDeleteModalOpen}
          // handleCancelSelection={undefined}
        />
      )}
    </>
  );
};

export default FileList;
