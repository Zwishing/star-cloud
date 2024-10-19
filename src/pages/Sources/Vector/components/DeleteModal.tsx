import { Button, Modal } from 'antd';

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
}) => (
  <Modal title="删除文件" open={visible} onOk={handleOk} onCancel={handleCancel}
  footer={[
    <Button key="cancel" onClick={handleCancel}>
      取消
    </Button>,
    <Button key="submit" type="primary" onClick={handleOk}>
      确定
    </Button>
  ]}>
    <p>确定要删除文件吗？</p>
  </Modal>
);

export default DeleteModal;
