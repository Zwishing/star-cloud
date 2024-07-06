import { Button, Checkbox, Col, Empty, List, Row, Tag } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { useState } from 'react';
import FileListActions from './FileListActions';

const FileList = ({
  data,
  currentPath,
  setCurrentPath,
  setSelectedFile,
  setPublishModalVisible,
  setDeleteModalVisible,
}) => {
  const [selectedKey, setSelectedKey] = useState(null);
  const [hoveredKey, setHoveredKey] = useState(null);

  const renderListItem = (item) => {
    const onItemClick = () => {
      if (item.type === 'folder' && selectedKey !== item.key) {
        setCurrentPath([...currentPath, item.key]);
      }
    };

    const showPublishModal = (e: { stopPropagation: () => void }) => {
      e.stopPropagation();
      setSelectedFile(item);
      setPublishModalVisible(true);
    };

    const showDeleteModal = (e: { stopPropagation: () => void }) => {
      e.stopPropagation();
      setSelectedFile(item);
      setDeleteModalVisible(true);
    };

    const handleCheckedChange = (e: CheckboxChangeEvent) => {
      // e.stopPropagation(); // 阻止事件冒泡
      const { value } = e.target;
      setSelectedKey((prevKey) => (prevKey === value ? null : value));
      setSelectedFile((prevItem: { key: any }) => (prevItem?.key === item.key ? null : item));
    };

    return (
      <List.Item
        key={item.key}
        onClick={onItemClick}
        style={{
          cursor: 'pointer',
          background:
            selectedKey === item.key ? '#e6f7ff' : hoveredKey === item.key ? '#f0f0f0' : 'inherit',
        }}
        onMouseEnter={() => setHoveredKey(item.key)}
        onMouseLeave={() => setHoveredKey(null)}
      >
        <Row gutter={16} style={{ width: '100%' }}>
          <Col flex="3">
            <Row align="middle">
              <Col style={{ width: 32 }}>
                {hoveredKey === item.key || selectedKey === item.key ? (
                  <Checkbox
                    checked={selectedKey === item.key}
                    onChange={(e) => handleCheckedChange(e)}
                    value={item.key}
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <div style={{ width: 32 }} />
                )}
              </Col>
              <Col>
                {item.icon} {item.title}
              </Col>
            </Row>
          </Col>
          <Col flex="2">{item.size}</Col>
          <Col flex="3">{item.modifiedTime}</Col>
          <Col flex="2">{item.type === 'file' ? <Tag color="red">未发布</Tag> : null}</Col>
          <Col flex="2">
            {item.type === 'file' ? (
              <>
                <Button type="link" size="small" onClick={showPublishModal}>
                  发布
                </Button>
                <Button type="link" size="small" onClick={showDeleteModal}>
                  删除
                </Button>
              </>
            ) : null}
          </Col>
        </Row>
        {item.children && item.children.length === 0 && currentPath.includes(item.key) && (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="无数据" />
        )}
      </List.Item>
    );
  };

  return (
    <>
      <List
        size="large"
        header={
          <div
            style={{
              fontWeight: 'bold',
            }}
          >
            <Row gutter={16} justify="center" align="middle">
              <Col flex="3">名称</Col>
              <Col flex="2">大小</Col>
              <Col flex="3">修改日期</Col>
              <Col flex="2">状态</Col>
              <Col flex="2"></Col>
            </Row>
          </div>
        }
        bordered
        itemLayout="horizontal"
        dataSource={data}
        renderItem={renderListItem}
      />
      {selectedKey && (
        <FileListActions
          showPublishModal={undefined}
          showDeleteModal={undefined}
          handleCancelSelection={undefined}
        />
      )}
    </>
  );
};

export default FileList;
