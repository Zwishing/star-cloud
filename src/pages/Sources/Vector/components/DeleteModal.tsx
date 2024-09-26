import { Modal } from 'antd';

interface DeleteModalProps {
  visible: boolean;
  handleOk: () => void;
  handleCancel: () => void;
  selectedFile?: { title: string }; // Adjust this type based on your actual structure
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  visible,
  handleOk,
  handleCancel,
  selectedFile,
}) => (
  <Modal title="删除文件" open={visible} onOk={handleOk} onCancel={handleCancel}>
    <p>确定要删除文件 {selectedFile?.title} 吗？</p>
  </Modal>
);

export default DeleteModal;
