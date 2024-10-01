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

interface UploadNotificationProps {
  visible: boolean;
  onVisible: (visible: boolean) => void;
}

const UploadNotification: React.FC<UploadNotificationProps> = forwardRef(
  ({ visible, onVisible }, ref) => {
    const [popoverVisible, setPopoverVisible] = useState<boolean>(false);
    const [uploads, setUploads] = useState<UploadProps[]>([]);

    const { uploadFile } = useModel('SourceItemModel', (model) => ({
      uploadFile: model.uploadFile,
    }));

    const { getCurentKey } = useModel('CurrentDirModel', (model) => ({
      getCurentKey: model.getCurentKey,
    }));

    const handleUploadStart = async (file: File) => {
      if (!file) return;
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

      const uploadReq: Source.UploadReq = {
        sourceCategory: 'vector',
        key: getCurentKey(),
        name: file.name,
        file: file, // Use the actual File object
      };

      const onUploadProgress = (event: {
        lengthComputable: any;
        loaded: number;
        total: number;
      }) => {
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
      };

      const handleUploadState = (id: number, state: string, errorMessage: string = '') => {
        setUploads((prev) =>
          prev.map((upload) =>
            upload.id === id
              ? {
                  ...upload,
                  status: state,
                  progress: state === 'success' ? 100 : state === 'error' ? 0 : upload.progress,
                  errorMessage: state === 'error' ? errorMessage : '',
                }
              : upload,
          ),
        );
      };

      uploadFile(uploadReq, {
        onUploadProgress: onUploadProgress,
        onSuccess: () => {
          handleUploadState(uniqueId, 'success', '');
        },
        onError: (err) => {
          handleUploadState(uniqueId, 'error', err.message);
        },
      });
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
  },
);

export default UploadNotification;
