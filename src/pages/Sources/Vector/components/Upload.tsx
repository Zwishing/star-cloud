import { retrievePostUrl } from '@/services/sources/upload';
import { CloudUploadOutlined } from '@ant-design/icons';
import { request } from '@umijs/max';
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
    customRequest: (info) => {
      const name = info.file.name;
      const size = info.file.size;
      retrievePostUrl({ fileName: name, size: size })
        .then((resp) => {
          // 上传至minio
          request(resp)
            .then()
            .catch((error) => {})
            .finally(() => {});
        })
        .catch((error) => {})
        .finally(() => {});
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
