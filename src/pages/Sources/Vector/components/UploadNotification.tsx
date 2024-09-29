import { upload } from '@/services/source/files';
import { Source } from '@/services/source/typings';
import { formatFileSize } from '@/util/util';
import {
  BellOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  CloseOutlined,
  LoadingOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { useModel } from '@umijs/max';
import { Alert, Button, Col, Divider, Flex, FloatButton, Popover, Progress, Row, Tag } from 'antd';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import './UploadNotification.css';

interface UploadProps {
  id: number; // Unique ID
  name: string;
  size: number;
  status: string;
  errorMessage: string;
  progress: number;
}

interface UploadListProps extends UploadProps {
  onClose: (id: number) => void; // Pass the ID to the onClose function
}

const UploadList: React.FC<UploadListProps> = ({
  id,
  name,
  size,
  status,
  errorMessage,
  progress,
  onClose,
}) => {
  const handleClose = () => {
    onClose(id); // Use the unique ID to close the specific upload
  };

  return (
    <div className="upload-list">
      <Row justify="space-between" gutter={8} className="status-row">
        <Col>
          {status === 'uploading' && (
            <Tag icon={<LoadingOutlined />} color="orange">
              上传中
            </Tag>
          )}
          {status === 'processing' && (
            <Tag icon={<SyncOutlined spin />} color="processing">
              处理中
            </Tag>
          )}
          {status === 'success' && (
            <Tag icon={<CheckCircleOutlined />} color="success">
              成功
            </Tag>
          )}
          {status === 'error' && (
            <Tag icon={<CloseCircleOutlined />} color="error">
              错误
            </Tag>
          )}
        </Col>
        <Col>
          {(status === 'success' || status === 'error') && (
            <Button type="link" size="small" icon={<CloseOutlined />} onClick={handleClose} />
          )}
        </Col>
      </Row>
      <Row justify="space-between" className="file-info-row">
        <Col>
          <b>{name}</b>
        </Col>
        <Col>{formatFileSize(size)}</Col>
      </Row>
      <Row className="progress-row">
        <Col span={24}>
          {status === 'error' ? (
            <Alert message={errorMessage} type="error" showIcon />
          ) : (
            <Progress size={[400, 6]} percent={progress} />
          )}
        </Col>
      </Row>
    </div>
  );
};

interface UploadNotification {
  visible: boolean;
  onVisible: (visible: boolean) => void;
  keyId: string;
}

const UploadNotification = forwardRef(({ keyId, visible, onVisible }: UploadNotification, ref) => {
  const [popoverVisible, setPopoverVisible] = useState<boolean>(false);
  const [uploads, setUploads] = useState<UploadProps[]>([]);

  const { setItems } = useModel('SourceItemModel', (model) => ({
    setItems: model.setItems,
  }));

  const handleUploadStart = async (file: File) => {
    const uniqueId = new Date().getTime() + Math.random(); // Generate a unique ID
    const newUpload: UploadProps = {
      id: uniqueId, // Add unique ID here
      name: file.name,
      size: file.size ?? 0,
      status: 'uploading',
      errorMessage: '',
      progress: 0,
    };
    setUploads((prev) => [...prev, newUpload]);
    setPopoverVisible(true);
    if (!file) {
      return;
    }
    const uploadReq: Source.UploadReq = {
      sourceCategory: 'vector',
      key: keyId,
      name: file.name,
      file: file, // Use the actual File object
    };

    try {
      const resp = await upload(uploadReq, {
        onUploadProgress: (event: { lengthComputable: any; loaded: number; total: number }) => {
          if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100);
            setUploads((prev) =>
              prev.map((upload) =>
                upload.id === uniqueId ? { ...upload, progress: percent } : upload,
              ),
            );
            if (percent === 100) {
              setUploads((prev) =>
                prev.map((upload) =>
                  upload.id === uniqueId
                    ? { ...upload, status: 'processing', progress: 100 }
                    : upload,
                ),
              );
            }
          }
        },
      });

      if (resp.code === 200) {
        const item: Source.Item = {
          parentKey: keyId,
          name: file.name,
          key: resp.data.key,
          type: 'file',
          path: '',
          size: file.size,
          lastModified: file.lastModified.toString(),
        };
        setItems((prev) => [...prev, item]);
      }
      handleUploadSuccess(uniqueId);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '发生未知错误';
      setUploads((prev) =>
        prev.map((upload) =>
          upload.id === uniqueId
            ? { ...upload, status: 'error', errorMessage: errorMessage, progress: 0 }
            : upload,
        ),
      );
    }
  };

  const handleUploadSuccess = (id: number) => {
    setUploads((prev) =>
      prev.map((upload) =>
        upload.id === id ? { ...upload, status: 'success', progress: 100 } : upload,
      ),
    );
  };

  useImperativeHandle(ref, () => ({
    handleUploadStart,
  }));

  const handleClear = () => {
    setUploads([]);
    setPopoverVisible(false);
    onVisible(false);
  };

  const handleClose = (id: number) => {
    if (uploads.length === 1) {
      setPopoverVisible(false);
      onVisible(false);
    }
    setUploads((prev) => prev.filter((upload) => upload.id !== id)); // Remove the specific upload
  };

  const content = (
    <div>
      <Divider style={{ margin: '8px 0' }} />
      <Flex gap="middle" align="flex-end" vertical>
        <Button type="link" size="small" onClick={handleClear}>
          清空并关闭
        </Button>
      </Flex>

      {uploads.map((upload) => (
        <UploadList key={upload.id} {...upload} onClose={handleClose} /> // Pass onClose with ID
      ))}
    </div>
  );

  return (
    <Popover
      placement="leftBottom"
      title={'通知'}
      content={content}
      trigger="click"
      open={popoverVisible}
      onOpenChange={setPopoverVisible}
    >
      <FloatButton
        badge={{ count: uploads.length }}
        icon={<BellOutlined />}
        style={{ visibility: visible ? 'visible' : 'hidden' }}
      />
    </Popover>
  );
});

export default UploadNotification;
