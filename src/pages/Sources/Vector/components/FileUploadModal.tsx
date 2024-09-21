import { UploadOutlined } from '@ant-design/icons';
import { Button, Input, Modal, Progress, Upload, message } from 'antd';
import { useState } from 'react';

const { Dragger } = Upload;

const FileUploadModal = ({ visible, onCancel, onUpload }) => {
  const [fileList, setFileList] = useState([]);
  const [fileName, setFileName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = ({ file, fileList }) => {
    setFileList(fileList);
    if (fileList.length > 0) {
      const currentFile = fileList[fileList.length - 1];
      const nameWithoutExtension = currentFile.name.replace(/\.[^/.]+$/, '');
      setFileName(nameWithoutExtension);
    } else {
      setFileName('');
    }
  };

  const handleFileNameChange = (e) => {
    setFileName(e.target.value);
  };

  const handleUpload = () => {
    if (fileList.length === 0) {
      message.error('请选择文件');
      return;
    }

    if (!fileName.trim()) {
      message.error('请输入文件名');
      return;
    }

    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append('files', file.originFileObj);
    });
    formData.append('fileName', fileName);

    setUploading(true);
    setProgress(0);

    // Simulating upload process
    onUpload(formData)
      .then(() => {
        setUploading(false);
        setProgress(100);
        setFileList([]);
        setFileName('');
        message.success('文件上传成功');
      })
      .catch(() => {
        setUploading(false);
        setProgress(0);
        message.error('文件上传失败');
      });
  };

  const beforeUpload = (file) => {
    const accept = '.zip,.geojson,.tif,.tiff,.img,.las';
    const isFileTypeValid = accept
      .split(',')
      .some((type) => file.name.toLowerCase().endsWith(type));
    if (!isFileTypeValid) {
      message.error(`上传类型不支持，支持的类型为：${accept}`);
    }
    return isFileTypeValid;
  };

  return (
    <Modal
      title="上传文件"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button type="primary" key="cancel" onClick={onCancel}>
          取消
        </Button>,
        <Button
          key="upload"
          type="primary"
          onClick={handleUpload}
          disabled={fileList.length === 0 || !fileName.trim() || uploading}
        >
          上传
        </Button>,
      ]}
    >
      <Input
        placeholder="输入文件名"
        value={fileName}
        onChange={handleFileNameChange}
        style={{ marginBottom: 16 }}
      />
      <Dragger
        accept=".zip,.geojson,.tif,.tiff,.img,.las"
        fileList={fileList}
        onChange={handleFileChange}
        beforeUpload={beforeUpload}
        showUploadList={true}
        maxCount={1}
      >
        <p className="ant-upload-drag-icon">
          <UploadOutlined />
        </p>
        <p className="ant-upload-text">点击或拖拽文件到此区域进行上传</p>
        <p className="ant-upload-hint">
          支持单个或批量上传。严禁上传公司数据或其他带有敏感信息的文件
        </p>
      </Dragger>
      {uploading && <Progress percent={progress} style={{ marginTop: 16 }} />}
    </Modal>
  );
};

export default FileUploadModal;
