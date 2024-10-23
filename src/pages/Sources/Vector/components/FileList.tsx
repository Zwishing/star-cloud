import { FolderIcon, ZipIcon } from '@/components/Icon';
import { Source } from '@/services/source/typings';
import { formatFileSize } from '@/util/util';
import { CheckCircleOutlined, CloseCircleOutlined, FileTextTwoTone, SyncOutlined, WarningOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';
import { useSize } from 'ahooks';
import { Button, Empty, Flex, Space, Table, Tag, Timeline } from 'antd';
import { useRef } from 'react';
import './FileList.css';
import FileListActions from './FileListActions';

interface FileListProps {
  selectedRow: Source.Item[];
  setSelectedRow: (selectedItems: Source.Item[]) => void;
  setDeleteModalOpen: () => void;
  setPublishModalOpen:() => void;
}

const FileList: React.FC<FileListProps> = ({
  selectedRow,
  setSelectedRow,
  setDeleteModalOpen,
  setPublishModalOpen
}) => {
  const tableRef = useRef<HTMLDivElement | null>(null);

  const { setNextDir } = useModel('CurrentDirModel', (model) => ({
    setNextDir: model.setNextDir,
  }));

  const { items, fetchNextItems } = useModel('SourceItemModel', (model) => ({
    items: model.items,
    fetchNextItems: model.fetchNextItems,
  }));

  const handleRowClick = async (item: Source.Item) => {
    if (item.type === 'folder') {
      fetchNextItems({ key: item.key, sourceCategory: 'vector' });
      setNextDir(item.key, item.name);
    }
  };

  const getIconByFileType = (item: Source.Item) => {
    if (item.type === 'folder') {
      return <FolderIcon />;
    }
    const fileExtension = item.name.split('.').pop()?.toLowerCase();
    if (fileExtension === 'zip') {
      return <ZipIcon />;
    }
    return <FileTextTwoTone />;
  };

  const expandedRowRender = () => {
    const timelineItems = [
      { children: '开始上传', color: 'green', label: '2023-06-01 10:00:00' },
      { children: '上传完成', color: 'blue', label: '2023-06-01 10:05:00' },
      { children: '开始质检', color: 'gray', label: '2023-06-01 10:10:00' },
      { children: '质检完成', color: 'green', label: '2023-06-01 10:15:00' },
      { children: '开始发布', color: 'blue', label: '2023-06-01 10:20:00' },
      { children: '发布完成', color: 'gray', label: '2023-06-01 10:25:00' },
    ];

    return (
      <Timeline
        items={timelineItems}
        mode="alternate"
      />
    );
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
      title: '数量',
      dataIndex: 'fileCount',
      render: (fileCount: number | undefined, item: Source.Item) => {
        if (item.type === 'folder' || item.name.toLowerCase().endsWith('.zip')) {
          return fileCount || '-';
        }
        return '-';
      },
    },
    {
      title: '修改日期',
      dataIndex: 'lastModified',
      sorter: (a: Source.Item, b: Source.Item) =>
        new Date(a.lastModified).getTime() - new Date(b.lastModified).getTime(),
    },
    {
      title: '状态',
      key: 'tags',
      dataIndex: 'tags',
      render: () => (
        <span>
          <Tag icon={<CheckCircleOutlined />} color="success">发布完成</Tag>
          <Tag icon={<SyncOutlined spin />} color="processing">质检中</Tag>
          <Tag icon={<CloseCircleOutlined />} color="error">质检失败</Tag>
          <Tag icon={<WarningOutlined />} color="warning">警告</Tag>
        </span>
      ),
    },
  ];

  const rowSelection = {
    columnWidth: 48,
    selectedRowKeys: selectedRow.map(item => item.key),
    onChange: (_: React.Key[], selectedRows: Source.Item[]) => {
      setSelectedRow(selectedRows);
    },
    selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT, Table.SELECTION_NONE],
  };

  return (
    <Flex gap="middle" vertical>
      {selectedRow.length > 0 && (
        <Flex align="center" gap="middle">
          <Button type="link" onClick={() => setSelectedRow([])}>
            取消选择
          </Button>
          {`已选择${selectedRow.length}项`}
        </Flex>
      )}
      <div ref={tableRef}>
        <Table
          rowKey="key"
          columns={columns}
          dataSource={items}
          pagination={false}
          rowSelection={rowSelection}
          expandable={{
            expandedRowRender,
            rowExpandable: (record) => record.type !== 'folder',
          }}
          style={{
            borderRadius: '12px',
            overflow: 'hidden',
          }}
          locale={{
            emptyText: <Empty description="无数据" />,
          }}
        />
        {selectedRow.length > 0 &&
          <FileListActions
          openDeleteModal={setDeleteModalOpen}
          openPublishModal={setPublishModalOpen}
          selectedRow={selectedRow}/>}
      </div>
    </Flex>
  );
};

export default FileList;
