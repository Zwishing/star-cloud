import { FolderIcon } from '@/components/Icon';
import { getNextItems } from '@/services/source/files';
import { Source } from '@/services/source/typings'; // Import defined types
import { FileTextTwoTone } from '@ant-design/icons';
import { Checkbox, Empty, Space, Table } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { useState } from 'react';
import './FileList.css';
import FileListActions from './FileListActions';

const FileList = ({
  data,
  currentPath,
  setData,
  setKey,
  setCurrentPath,
  setSelectedFile,
  setPublishModalVisible,
  setDeleteModalVisible,
}) => {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const handleRowClick = async (item: Source.Item) => {
    if (item.type === 'folder') {
      try {
        const resp = await getNextItems({ key: item.key, sourceCategory: 'vector' });
        setData(resp.data.items); // Set fetched data to state
        setKey(item.key);
        setCurrentPath((prevPath: string[]) => [...prevPath, item.key]);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleCheckedChange = (e: CheckboxChangeEvent, item: Source.Item) => {
    const { value } = e.target;
    setSelectedKey((prevKey) => (prevKey === value ? null : value));
    // 根据选中状态，更新 selectedFile
    if (value) {
      // 如果选中，添加 key 到 selectedFile
      setSelectedFile((prev: string[]) => [item.key]);
    }
  };

  const columns = [
    {
      title: '',
      dataIndex: 'key',
      width: 10,
      align: 'center',
      render: (key: string, item: Source.Item) => (
        <Checkbox
          checked={selectedKey === key}
          onChange={(e) => handleCheckedChange(e, item)}
          value={key}
          onClick={(e) => e.stopPropagation()}
        />
      ),
    },
    {
      title: '名称',
      dataIndex: 'name',
      render: (name: string, item: Source.Item) => (
        <Space onClick={() => handleRowClick(item)} style={{ cursor: 'pointer' }}>
          {item.type === 'folder' ? <FolderIcon /> : <FileTextTwoTone />}
          {name}
        </Space>
      ),
    },
    {
      title: '大小',
      dataIndex: 'size',
      render: (size: number) => `${(size / 1024 / 1024).toFixed(2)} MB`,
    },
    {
      title: '修改日期',
      dataIndex: 'lastModified',
    },
  ];

  return (
    <>
      <Table
        rowKey="key"
        columns={columns}
        dataSource={data}
        pagination={false}
        style={{
          borderRadius: '12px', // Adjust the overall table border-radius
          overflow: 'hidden', // Ensure the corners are rounded properly
        }}
        // rowClassName={(record, index) => (index % 2 === 0 ? 'even-row' : 'odd-row')}
        locale={{
          emptyText: <Empty description="无数据" />,
        }}
      />
      {selectedKey && (
        <FileListActions
          showPublishModal={undefined}
          showDeleteModal={setDeleteModalVisible}
          handleCancelSelection={undefined}
        />
      )}
    </>
  );
};

export default FileList;
