import { upload } from '@/services/source/files';
import { CloudUploadOutlined } from '@ant-design/icons';
import { Upload as AntUpload, FloatButton, Popover, UploadProps, message } from 'antd';
import { useState } from 'react';
const { Dragger } = AntUpload;

const Upload: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(0);
  const draggerProps: UploadProps = {
    accept: '.zip,.geojson',
    // // 显示上传列表
    // action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
    customRequest: async (info) => {
      const name = info.file.name;
      const size = info.file.size;
      const resp = await upload({ file: info.file, key: '', sourceCategory: 'vector' });
    },
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
      }
      if (status === 'done') {
        setUploading((c) => c - 1);
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
    onRemove: () => {
      setUploading((c) => c - 1);
    },
    beforeUpload: () => {
      setUploading((c) => c + 1);
    },
  };

  return (
    <Popover
      content={
        <div>
          <Dragger {...draggerProps}>
            <p className="ant-upload-drag-icon">
              <CloudUploadOutlined />
            </p>
            <p className="ant-upload-text">点击或者拖拽文件上传</p>
            <p className="ant-upload-hint">支持上传GeoJSON、Shapefile(zip压缩包)文件</p>
          </Dragger>
        </div>
      }
      title="上传数据"
      trigger="click"
      open={open}
      placement="leftBottom"

      //   onOpenChange={handleOpenChange}
    >
      <FloatButton
        type="primary"
        badge={{ count: uploading }}
        onClick={() => setOpen(!open)}
        icon={<CloudUploadOutlined />}
      ></FloatButton>
    </Popover>
  );
};
export default Upload;
