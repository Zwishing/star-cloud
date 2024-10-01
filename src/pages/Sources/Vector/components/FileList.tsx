import { FolderIcon, ZipIcon } from '@/components/Icon';
import { Source } from '@/services/source/typings';
import { formatFileSize } from '@/util/util';
import { FileTextTwoTone } from '@ant-design/icons';
import { useModel } from '@umijs/max';
import { useSize } from 'ahooks';
import { Button, Empty, Flex, Space, Table } from 'antd';
import { useRef } from 'react';
import './FileList.css';
import FileListActions from './FileListActions';

interface FileListProps {
  selectedRowKeys: string[];
  setSelectedRowKeys: (selecteKey: string[]) => void;
  setDeleteModalOpen: () => void;
}

const FileList: React.FC<FileListProps> = ({
  selectedRowKeys,
  setSelectedRowKeys,
  setDeleteModalOpen,
}) => {
  // const [tableHeight, setTableHeight] = useState<number>(0);
  const tableRef = useRef<HTMLDivElement | null>(null);
  const size = useSize(tableRef);

  const availableHeight =
    tableRef.current && size ? size.height - tableRef.current.getBoundingClientRect().top - 90 : 0;
  const tableHeight = availableHeight > 0 ? availableHeight : 0;

  const { setNextDir } = useModel('CurrentDirModel', (model) => ({
    setNextDir: model.setNextDir,
  }));

  const { items, fetchNextItems } = useModel('SourceItemModel', (model) => ({
    items: model.items,
    fetchNextItems: model.fetchNextItems,
  }));

  // useEffect(() => {
  //   const calculateHeight = () => {
  //     if (tableRef.current) {
  //       const availableHeight =
  //         window.innerHeight - tableRef.current.getBoundingClientRect().top - 90; // Adjust for margin
  //       setTableHeight(availableHeight > 0 ? availableHeight : 0);
  //     }
  //   };

  //   calculateHeight();
  //   window.addEventListener('resize', calculateHeight);
  //   return () => {
  //     window.removeEventListener('resize', calculateHeight);
  //   };
  // }, []);

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
    columnWidth: 48,
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys as string[]);
    },
    selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT, Table.SELECTION_NONE],
  };

  return (
    <Flex gap="middle" vertical>
      {selectedRowKeys.length > 0 && (
        <Flex align="center" gap="middle">
          <Button type="link" onClick={() => setSelectedRowKeys([])}>
            取消选择
          </Button>
          {`已选择${selectedRowKeys.length}项`}
        </Flex>
      )}
      <div ref={tableRef}>
        <Table
          rowKey="key"
          columns={columns}
          dataSource={items}
          pagination={false}
          rowSelection={rowSelection}
          style={{
            borderRadius: '12px',
            overflow: 'hidden',
          }}
          scroll={{ y: tableHeight }} // Dynamic scroll height
          locale={{
            emptyText: <Empty description="无数据" />,
          }}
          virtual
        />
        {selectedRowKeys.length > 0 && <FileListActions openDeleteModal={setDeleteModalOpen} />}
      </div>
    </Flex>
  );
};

export default FileList;
