import { EllipsisOutlined } from '@ant-design/icons';
import { CheckCard } from '@ant-design/pro-components';
import { Dropdown, message, Modal } from 'antd';
import { useState } from 'react';

const StyleList = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const handleMenuClick = (key, item) => {
    if (key === '1') {
      setItemToDelete(item);
      setIsModalVisible(true);
    }
  };

  const handleDelete = () => {
    console.log('Deleting item:', itemToDelete);
    setIsModalVisible(false);
    message.success('Item deleted successfully!');
  };

  return (
    <>
      <CheckCard.Group
        onChange={(value) => {
          console.log('value', value);
        }}
        defaultValue="A"
      >
        <CheckCard
          title="Card A"
          size={'small'}
          description="选项一"
          value="A"
          extra={
            <Dropdown
              placement="topCenter"
              menu={{
                onClick: ({ key, domEvent }) => {
                  domEvent.stopPropagation();
                  handleMenuClick(key, 'Card A');
                },
                items: [
                  {
                    label: '删除',
                    key: '1',
                  },
                ],
              }}
            >
              <EllipsisOutlined
                style={{ fontSize: 22, color: 'rgba(0,0,0,0.5)' }}
                onClick={(e) => e.stopPropagation()}
              />
            </Dropdown>
          }
        />
        <CheckCard
          title="Card B"
          size={'small'}
          description="选项二"
          value="B"
          extra={
            <Dropdown
              placement="topCenter"
              menu={{
                onClick: ({ key, domEvent }) => {
                  domEvent.stopPropagation();
                  handleMenuClick(key, 'Card B');
                },
                items: [
                  {
                    label: '删除',
                    key: '1',
                  },
                ],
              }}
            >
              <EllipsisOutlined
                style={{ fontSize: 22, color: 'rgba(0,0,0,0.5)' }}
                onClick={(e) => e.stopPropagation()}
              />
            </Dropdown>
          }
        />
        <CheckCard
          title="Card C"
          size={'small'}
          description="选项三，这是一个不可选项"
          value="C"
          extra={
            <Dropdown
              placement="topCenter"
              menu={{
                onClick: ({ key, domEvent }) => {
                  domEvent.stopPropagation();
                  handleMenuClick(key, 'Card C');
                },
                items: [
                  {
                    label: '删除',
                    key: '1',
                  },
                ],
              }}
            >
              <EllipsisOutlined
                style={{ fontSize: 22, color: 'rgba(0,0,0,0.5)' }}
                onClick={(e) => e.stopPropagation()}
              />
            </Dropdown>
          }
        />
      </CheckCard.Group>
      <Modal
        title="删除服务样式"
        open={isModalVisible}
        onOk={handleDelete}
        onCancel={() => setIsModalVisible(false)}
        okText="确认"
        cancelText="取消"
      >
        <p>你确定要删除 {itemToDelete} 吗？</p>
      </Modal>
    </>
  );
};

export default StyleList;
