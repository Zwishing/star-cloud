import { upload } from '@/services/source/files';
import { Source } from '@/services/source/typings';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Input, Modal, Progress, Upload, message } from 'antd';
import type { UploadChangeParam, UploadFile } from 'antd/es/upload/interface';
import React, { useState } from 'react';

interface FileUploadModalProps {
  visible: boolean;
  keyId: string;
  onCancel: () => void;
}

const { Dragger } = Upload;

const FileUploadModal: React.FC<FileUploadModalProps> = ({ visible, keyId, onCancel }) => {
  const [file, setFile] = useState<UploadFile | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  const handleFileChange = ({ file }: UploadChangeParam<UploadFile>) => {
    if (file) {
      setFile(file);
      const nameWithoutExtension = file.name.replace(/\.[^/.]+$/, '');
      setFileName(nameWithoutExtension);
    } else {
      setFile(null);
      setFileName('');
    }
  };

  const handleFileNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileName(e.target.value);
  };

  const handleUpload = async () => {
    if (!file) {
      message.error('请选择文件');
      return;
    }

    if (!fileName.trim()) {
      message.error('请输入文件名');
      return;
    }

    const fileObject = file.originFileObj; // This is of type RcFile | undefined
    if (fileObject) {
      const uploadReq: Source.UploadReq = {
        sourceCategory: 'vector',
        key: keyId,
        name: fileName,
        file: fileObject,
      };
      setUploading(true);
      setProgress(0);
      try {
        const controller = new AbortController();
        const { signal } = controller;

        const uploadPromise = upload(uploadReq, {
          signal,
          onUploadProgress: (event: ProgressEvent) => {
            if (event.lengthComputable) {
              const percent = Math.round((event.loaded / event.total) * 100);
              setProgress(percent);
            }
          },
        });

        await uploadPromise;

        setUploading(false);
        setProgress(100);
        message.success('文件上传成功');
      } catch (error) {
        setUploading(false);
        setProgress(0);
        message.error('文件上传失败');
      }
    } else {
      message.error('文件对象不可用');
      return;
    }
  };

  const beforeUpload = (file: UploadFile) => {
    const accept = '.zip,.geojson';
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
          disabled={!file || !fileName.trim() || uploading}
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
        fileList={file ? [{ ...file, percent: progress }] : []} // Show upload progress
        onChange={handleFileChange}
        beforeUpload={beforeUpload}
        showUploadList={true} // Enable upload list display
        multiple={false} // Ensure only one file can be uploaded
      >
        <p className="ant-upload-drag-icon">
          <UploadOutlined />
        </p>
        <p className="ant-upload-text">点击或拖拽文件到此区域进行上传</p>
        <p className="ant-upload-hint">
          支持单个文件上传。严禁上传公司数据或其他带有敏感信息的文件
        </p>
      </Dragger>
      {uploading && <Progress percent={progress} style={{ marginTop: 16 }} />}
    </Modal>
  );
};

export default FileUploadModal;
