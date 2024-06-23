import { Modal } from 'antd';

const DeleteModal = ({ visible, handleOk, handleCancel, selectedFile }) => (
  <Modal title="删除文件" open={visible} onOk={handleOk} onCancel={handleCancel}>
    <p>确定要删除文件 {selectedFile?.title} 吗？</p>
  </Modal>
);

export default DeleteModal;
