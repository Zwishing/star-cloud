import { formatFileSize, validateZipShapefile } from '@/util/util';
import { UploadOutlined } from '@ant-design/icons';
import { Alert, Button, Flex, Input, Modal, Upload } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import React, { useState } from 'react';

interface FileUploadModalProps {
  visible: boolean;
  onCancel: () => void;
  onUploadStart: (file: UploadFile) => void;
}

const { Dragger } = Upload;

const FileUploadModal: React.FC<FileUploadModalProps> = ({ visible, onCancel, onUploadStart }) => {
  // const [file, setFile] = useState<UploadFile | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleFileNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileName(e.target.value);
  };


  const beforeUpload = (file: UploadFile): boolean => {
    if (file) {
      if (file.name.toLowerCase().endsWith('.zip')) {
        validateZipShapefile(file).then((validationResult) => {
          if (!validationResult.isValid) {
            setErrorMessage(validationResult.error);
            setFileList([]); // Clear fileList on validation error
            return;
          } else if (validationResult.shpCount > 1) {
            setErrorMessage(`${file.name}中包含多个shapefile文件,目前只支持单个zipshapefile`);
            setFileList([]); // Clear fileList on validation error
            return;
          }
        });
      }
      setFileList([file]);
      setFileName(file.name);
    } else {
      setFileName('');
      setFileList([]);
    }
    return false;
  };

  const handleCancel = () => {
    setFileName('');
    setErrorMessage(null);
    onCancel();
    setFileList([]);
  };

  const handleRemove = () => {
    setFileName('');
    setErrorMessage(null);
    setFileList([]);
  };

  const handleUpload = () => {
    if (fileList.length !== 0) {
      onUploadStart(fileList[0]);
    }
    handleCancel();
  };

  return (
    <Modal
      title="上传文件"
      open={visible}
      onCancel={handleCancel}
      footer={[
        <Button type="primary" key="cancel" onClick={handleCancel}>
          取消
        </Button>,
        <Button key="upload" type="primary" onClick={handleUpload} disabled={fileList.length === 0}>
          上传
        </Button>,
      ]}
      width={800}
    >
      <Flex gap="middle" vertical>
        <Input
          placeholder="文件名称"
          value={fileName}
          onChange={handleFileNameChange}
          suffix={fileList.length !== 0 && formatFileSize(fileList[0].size)}
          disabled={true}
          style={{ marginBottom: 16 }}
        />
        <Dragger
          accept=".zip,.geojson"
          // onChange={handleFileChange}
          fileList={fileList}
          beforeUpload={beforeUpload}
          showUploadList={true}
          multiple={false}
          maxCount={1}
          onRemove={handleRemove}
        >
          <p className="ant-upload-drag-icon">
            <UploadOutlined />
          </p>
          <p className="ant-upload-text">点击或拖拽文件到此区域进行上传</p>
          <p className="ant-upload-hint">支持上传GeoJSON、Shapefile(zip压缩包)文件</p>
        </Dragger>
        {errorMessage ? (
          <Alert message="错误" description={errorMessage} type="error" showIcon />
        ) : null}
      </Flex>
    </Modal>
  );
};

export default FileUploadModal;
