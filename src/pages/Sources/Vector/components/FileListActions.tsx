// FileListActions.jsx
import { CloseOutlined, DeleteOutlined, ExportOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Popover } from 'antd';
import { useState } from 'react';
import MoveModal from './MoveModal';

const FileListActions = ({ showPublishModal, showDeleteModal, handleCancelSelection }) => {
  const [moveModalVisible, setMoveModalVisible] = useState(false);

  const handleMoveModalCancel = () => {
    setMoveModalVisible(false);
  };

  const handleMoveModalOk = () => {
    // Implement move logic here
    setMoveModalVisible(false);
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          padding: '8px 16px',
          borderRadius: 8,
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
          height: 48, // Reduced height for the background
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center', // Center align the buttons horizontally
        }}
      >
        <Button.Group>
          <Popover placement="top" content="发布">
            <Button type="text" icon={<UploadOutlined />} onClick={showPublishModal} />
          </Popover>

          <Popover placement="top" content="删除">
            <Button type="text" icon={<DeleteOutlined />} onClick={showDeleteModal} />
          </Popover>

          <Popover placement="top" content="移动">
            <Button
              type="text"
              icon={<ExportOutlined />}
              onClick={() => setMoveModalVisible(true)}
            />
          </Popover>

          <Popover placement="top" content="取消多选">
            <Button type="text" icon={<CloseOutlined />} onClick={handleCancelSelection} />
          </Popover>
        </Button.Group>

        {/* Move Modal */}
        <MoveModal
          visible={moveModalVisible}
          onCancel={handleMoveModalCancel}
          onMove={handleMoveModalOk}
        />
      </div>
    </div>
  );
};

export default FileListActions;
