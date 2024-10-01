import { Input, Modal } from 'antd';

interface FolderModalProps{
  visible:boolean;
  handleOk:()=>void;
  handleCancel:()=>void;
  newFolderName:string;
  setNewFolderName:(name:string)=>void;
}

const FolderModal:React.FC<FolderModalProps> = ({ visible, handleOk, handleCancel, newFolderName, setNewFolderName }) => (
  <Modal title="新建文件夹" open={visible} onOk={handleOk} onCancel={handleCancel}>
    <Input
      value={newFolderName}
      onChange={(e) => setNewFolderName(e.target.value)}
      placeholder="请输入文件夹名称"
    />
  </Modal>
);

export default FolderModal;
