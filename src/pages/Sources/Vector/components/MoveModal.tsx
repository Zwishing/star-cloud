// MoveModal.jsx
import { CheckCircleFilled, CloseCircleFilled, FolderFilled } from '@ant-design/icons';
import { Breadcrumb, Button, Col, Input, List, Modal, Row, message } from 'antd';
import { useState } from 'react';

const MoveModal = ({ visible, onCancel, onMove }) => {
  // Example folder structure
  const [currentFolder, setCurrentFolder] = useState(null);
  const [breadcrumbs, setBreadcrumbs] = useState([{ title: '首页', key: '-1' }]);
  const [selectedKey, setSelectedKey] = useState(null);
  const [hoveredKey, setHoveredKey] = useState(null);
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const folderData = [
    {
      title: 'Folder 1',
      key: '1',
      type: 'folder',
      icon: <FolderFilled style={{ color: '#1890ff' }} />,
      size: '10 KB',
      modifiedTime: '2024-06-17',
      children: [
        {
          title: 'File 1',
          key: '3',
          type: 'file',
          icon: <FolderFilled style={{ color: '#1890ff' }} />,
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
          title: 'File 2',
          key: '4',
          type: 'file',
          icon: <FolderFilled style={{ color: '#1890ff' }} />,
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
  ];

  const handleItemClick = (item) => {
    setCurrentFolder(item);
    setSelectedKey(item.key);
    // Update breadcrumbs
    const newBreadcrumbs = [...breadcrumbs, { title: item.title, key: item.key }];
    setBreadcrumbs(newBreadcrumbs);
  };

  const handleBreadcrumbClick = (index) => {
    if (index === -1) {
      setCurrentFolder(null);
      setBreadcrumbs([{ title: '首页', key: '-1' }]);
      setSelectedKey(null);
    } else {
      const newBreadcrumbs = breadcrumbs.slice(0, index + 1);
      setCurrentFolder(folderData[index]);
      setBreadcrumbs(newBreadcrumbs);
      setSelectedKey(folderData[index].key);
    }
  };

  const handleItemMouseEnter = (key) => {
    setHoveredKey(key);
  };

  const handleItemMouseLeave = () => {
    setHoveredKey(null);
  };

  const handleNewFolderClick = () => {
    setShowNewFolderInput(true);
  };

  const handleNewFolderCancel = () => {
    setShowNewFolderInput(false);
    setNewFolderName('');
  };

  const handleNewFolderConfirm = () => {
    if (newFolderName.trim() === '') {
      message.error('文件夹名称不能为空');
      return;
    }

    const newFolder = {
      title: newFolderName.trim(),
      key: Date.now().toString(), // Generate a unique key (in real scenarios, use a proper unique key generator)
      type: 'folder',
      icon: <FolderFilled style={{ color: '#1890ff' }} />,
      size: '0 KB', // Assuming initial size is 0 KB
      modifiedTime: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
      children: [], // Empty children array for new folder
    };

    if (currentFolder) {
      setCurrentFolder({ ...currentFolder, children: [...currentFolder.children, newFolder] });
    } else {
      // Add new folder to top level folderData
      folderData.push(newFolder);
    }

    message.success('新建文件夹成功');
    setNewFolderName('');
    setShowNewFolderInput(false);
  };

  const renderFolderContent = () => {
    return (
      <>
        <div style={{ borderBottom: '1px solid #e8e8e8', marginBottom: 16 }}></div>
        <Breadcrumb style={{ marginBottom: 16 }}>
          {breadcrumbs.map((item, index) => (
            <Breadcrumb.Item
              key={item.key}
              onClick={() => handleBreadcrumbClick(index)}
              style={{ cursor: 'pointer' }}
            >
              {item.title}
            </Breadcrumb.Item>
          ))}
        </Breadcrumb>
        <List
          split={false}
          dataSource={currentFolder ? currentFolder.children : folderData}
          renderItem={(item) => (
            <List.Item
              onClick={() => handleItemClick(item)}
              onMouseEnter={() => handleItemMouseEnter(item.key)}
              onMouseLeave={handleItemMouseLeave}
              style={{
                backgroundColor:
                  item.key === selectedKey
                    ? '#e6f7ff'
                    : hoveredKey === item.key
                    ? '#f0f0f0'
                    : 'transparent',
                cursor: 'pointer',
                borderRadius: 4, // Add border radius for highlighted items
                padding: '8px 16px', // Adjust padding for better appearance
              }}
            >
              <List.Item.Meta avatar={item.icon} title={<a href="#">{item.title}</a>} />
            </List.Item>
          )}
        />
        {showNewFolderInput && (
          <Row gutter={16}>
            <Col span={18}>
              <Input
                placeholder="请输入文件夹名称"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
              />
            </Col>
            <Col span={6}>
              <Button.Group>
                <Button
                  type="text"
                  onClick={handleNewFolderConfirm}
                  icon={<CheckCircleFilled style={{ color: '#1890ff' }} />}
                ></Button>
                <Button
                  type="text"
                  onClick={handleNewFolderCancel}
                  icon={<CloseCircleFilled style={{ color: '#1890ff' }} />}
                ></Button>
              </Button.Group>
            </Col>
          </Row>
        )}
      </>
    );
  };

  return (
    <Modal
      title="移动到"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Row justify={'space-between'} key="footer-row">
          <Col>
            <Button key="newFolder" onClick={handleNewFolderClick}>
              新建文件夹
            </Button>
          </Col>
          <Col>
            <Row justify={'space-between'}>
              <Col>
                <Button key="back" onClick={onCancel}>
                  取消
                </Button>
              </Col>
              <Col>&nbsp;&nbsp;&nbsp;</Col>
              <Col>
                <Button key="move" type="primary" onClick={onMove}>
                  移动到此处
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>,
      ]}
    >
      {renderFolderContent()}
    </Modal>
  );
};

export default MoveModal;
