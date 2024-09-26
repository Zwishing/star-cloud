import { upload } from '@/services/source/files';
import { Source } from '@/services/source/typings';
import { validateZipShapefile } from '@/util/util';
import { FileOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Input, Modal, Progress, Table, Upload, message } from 'antd';
import type { UploadChangeParam, UploadFile } from 'antd/es/upload/interface';
import React, { useState } from 'react';

interface FileUploadModalProps {
  visible: boolean;
  keyId: string;
  onCancel: () => void;
}

const { Dragger } = Upload;

interface UploadItem {
  key: string; // Unique key for the table
  fileName: string;
  fileSize: number;
  progress: number;
  status: 'uploading' | 'done' | 'error';
  uploadTime: number; // Time taken for upload
}

const FileUploadModal: React.FC<FileUploadModalProps> = ({ visible, keyId, onCancel }) => {
  const [file, setFile] = useState<UploadFile | null>(null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadItems, setUploadItems] = useState<UploadItem[]>([]); // Track upload items

  const handleFileChange = async ({ file, fileList }: UploadChangeParam<UploadFile>) => {
    setFileList(fileList); // Update fileList

    if (file) {
      if (file.name.toLowerCase().endsWith('.zip')) {
        const fileObject = file.originFileObj;
        const validationResult = await validateZipShapefile(fileObject);
        if (!validationResult.isValid) {
          message.error(validationResult.error);
          return;
        } else if (validationResult.shpCount > 1) {
          message.error('不支持包含多个 .shp 文件的 zip 上传');
          return;
        }
      }
      setFile(file);
      setFileName(file.name);
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
    const fileObject = file.originFileObj;
    if (fileObject) {
      const uploadReq: Source.UploadReq = {
        sourceCategory: 'vector',
        key: keyId,
        name: fileName,
        file: fileObject,
      };

      // Add new upload item to the list with initial progress and status
      const newUploadItem: UploadItem = {
        key: fileName, // Use fileName as key (ensure it's unique)
        fileName: fileName,
        fileSize: fileObject.size, // Size of the file
        progress: 0,
        status: 'uploading',
        uploadTime: 0, // Initialize upload time
      };
      setUploadItems((prev) => [...prev, newUploadItem]);

      // Clear the fileList before starting the upload
      setFileList([]);

      const startTime = Date.now(); // Start time for upload

      try {
        await upload(uploadReq, {
          onUploadProgress: (event: ProgressEvent) => {
            if (event.lengthComputable) {
              const percent = Math.round((event.loaded / event.total) * 100);
              setUploadItems((prev) => {
                const updatedItems = [...prev];
                const itemIndex = updatedItems.findIndex((item) => item.fileName === fileName);
                if (itemIndex !== -1) {
                  updatedItems[itemIndex].progress = percent; // Update the progress
                  updatedItems[itemIndex].uploadTime = Math.ceil((Date.now() - startTime) / 1000); // Round up the upload time
                }
                return updatedItems;
              });
            }
          },
        });

        // Update the status to done
        setUploadItems((prev) => {
          const updatedItems = [...prev];
          const itemIndex = updatedItems.findIndex((item) => item.fileName === fileName);
          if (itemIndex !== -1) {
            updatedItems[itemIndex].status = 'done'; // Update status to done
          }
          return updatedItems;
        });

        message.success(`${fileName} 上传成功`);

        // Reset file and file name
        setFile(null);
        setFileName('');
      } catch (error) {
        message.error('文件上传失败');
        // Update the status to error
        setUploadItems((prev) => {
          const updatedItems = [...prev];
          const itemIndex = updatedItems.findIndex((item) => item.fileName === fileName);
          if (itemIndex !== -1) {
            updatedItems[itemIndex].status = 'error'; // Update status to error
          }
          return updatedItems;
        });
      } finally {
        setUploading(false);
      }
    } else {
      message.error('文件对象不可用');
    }
  };

  const beforeUpload = async (file: UploadFile): Promise<boolean> => {
    const accept = '.zip,.geojson';

    const isFileTypeValid = accept
      .split(',')
      .some((type) => file.name.toLowerCase().endsWith(type));
    if (!isFileTypeValid) {
      message.error(`上传类型不支持，支持的类型为：${accept}`);
      return false;
    }
    return true;
  };

  const handleCancel = () => {
    setFileName('');
    setFile(null);
    setFileList([]);
    onCancel();
  };

  const handleRemove = () => {
    setFileName('');
    setFile(null);
    setFileList([]);
  };

  // Define columns for the table
  const columns = [
    {
      title: '文件名',
      dataIndex: 'fileName',
      render: (text: string) => (
        <span>
          <FileOutlined style={{ marginRight: 8 }} />
          {text}
        </span>
      ),
      width: '40%', // Adjust width of file name column
    },
    {
      title: '文件大小',
      dataIndex: 'fileSize',
      render: (text: number) => `${(text / 1024).toFixed(2)} KB`, // Convert to KB
      width: '15%', // Adjust width of size column
    },
    {
      title: '进度',
      dataIndex: 'progress',
      render: (percent: number) => (
        <Progress percent={percent} status={percent === 100 ? 'success' : 'active'} />
      ),
      width: '25%', // Adjust width of progress column
    },
    {
      title: '上传用时',
      dataIndex: 'uploadTime',
      render: (time: number) => `${time} 秒`, // Keep one significant digit
      width: '15%', // Adjust width of upload time column
    },
  ];

  return (
    <Modal
      title="上传文件"
      open={visible}
      onCancel={handleCancel}
      footer={[
        <Button type="primary" key="cancel" onClick={handleCancel}>
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
      width={800} // Set modal width to 800px
    >
      <Input
        placeholder="文件名"
        value={fileName}
        onChange={handleFileNameChange}
        disabled={true}
        style={{ marginBottom: 16 }}
      />
      <Dragger
        accept=".zip,.geojson"
        fileList={fileList}
        onChange={handleFileChange}
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
      <Table
        dataSource={uploadItems}
        columns={columns}
        pagination={false}
        style={{ marginTop: 16 }}
        rowKey="key" // Specify unique key for each row
        components={{
          header: {
            cell: (
              props: React.JSX.IntrinsicAttributes &
                React.ClassAttributes<HTMLTableHeaderCellElement> &
                React.ThHTMLAttributes<HTMLTableHeaderCellElement>,
            ) => <th style={{ height: '32px', lineHeight: '32px' }} {...props} />,
          },
        }}
      />
    </Modal>
  );
};

export default FileUploadModal;
