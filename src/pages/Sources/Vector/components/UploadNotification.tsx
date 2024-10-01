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
import React, { forwardRef, useCallback, useImperativeHandle, useState } from 'react';
import { v4 as uuidv4 } from 'uuid'; // Import uuid for unique ID generation
import './UploadNotification.css';

type UploadProps = {
  id: string; // Change to string for UUID
  name: string;
  size: number;
  status: 'uploading' | 'success' | 'error' | 'processing';
  errorMessage: string;
  progress: number;
};

interface UploadListProps extends UploadProps {
  onClose: (id: string) => void; // Use string for ID
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
    onClose(id);
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

const UploadNotification = forwardRef(({visible, onVisible }: UploadNotificationProps, ref) => {
  const [popoverVisible, setPopoverVisible] = useState<boolean>(false);
  const [uploads, setUploads] = useState<UploadProps[]>([]);
  const { uploadFile } = useModel('SourceItemModel', (model) => ({
    uploadFile: model.uploadFile
  }));

  const { getCurentKey } = useModel('CurrentDirModel', (model) => ({
    getCurentKey: model.getCurentKey,
  }));

  

  const handleUploadStart = async (file: File) => {
    if (!file) return;

    const uniqueId = uuidv4(); // Use uuid for unique ID
    const newUpload: UploadProps = {
      id: uniqueId,
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
      file: file,
    };

    try {
      const resp = await upload(uploadReq, {
        onUploadProgress: (event: ProgressEvent) => {
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
    } catch (error) {
      const errorMessage = (error as Error).message || '发生未知错误';
    const onUploadProgress = (event: { lengthComputable: any; loaded: number; total: number })=>{
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
    }

    const handleUploadState = (id: number, state: string, errorMessage: string = '') => {
      setUploads((prev) =>
        prev.map((upload) =>
          upload.id === uniqueId
            ? { ...upload, status: 'error', errorMessage, progress: 0 }
            : upload,
        ),
          upload.id === id
            ? {
                ...upload,
                status: state,
                progress: state === 'success' ? 100 : state === 'error' ? 0 : upload.progress,
                errorMessage: state === 'error' ? errorMessage : '',
              }
            : upload
        )
      );
    };

  const handleUploadSuccess = useCallback((id: string) => {
    setUploads((prev) =>
      prev.map((upload) =>
        upload.id === id ? { ...upload, status: 'success', progress: 100 } : upload,
      ),
    );
  }, []);

  useImperativeHandle(ref, () => ({
    handleUploadStart,
  }));

  const handleClear = useCallback(() => {
    setUploads([]);
    setPopoverVisible(false);
    onVisible(false);
  }, [onVisible]);

  const handleClose = useCallback(
    (id: string) => {
      if (uploads.length === 1) {
        setPopoverVisible(false);
        onVisible(false);
      }
      setUploads((prev) => prev.filter((upload) => upload.id !== id));
    },
    [uploads, onVisible],
  );

  const content = (
    <div>
      <Divider style={{ margin: '8px 0' }} />
      <Flex gap="middle" align="flex-end" vertical>
        <Button type="link" size="small" onClick={handleClear}>
          清空并关闭
        </Button>
      </Flex>
      {uploads.map((upload) => (
        <UploadList key={upload.id} {...upload} onClose={handleClose} />
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
