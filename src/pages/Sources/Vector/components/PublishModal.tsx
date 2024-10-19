import { Source } from '@/services/source/typings';
import { formatFileSize, removeFileExtension } from '@/util/util';
import { ProForm, ProFormRadio, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import { Button, Checkbox, Flex, Input, Modal, Steps, message,Typography, Form, Select } from 'antd';
import { Divider } from 'rc-menu';
import { useState } from 'react';

const CheckboxGroup  = Checkbox.Group;


interface PublishModalProps{
  visible: boolean;
  handleOk: () => void;
  handleCancel: () => void;
  selectedItems: Source.Item[];
}

const PublishModal:React.FC<PublishModalProps> = ({ visible, handleOk, handleCancel, selectedItems }) => {


  return (
    <Modal
      title="发布服务"
      open={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          取消
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk}>
          确定
        </Button>
      ]}
    >
    {/* <Divider/> */}
      <Form style={{ marginTop: '24px' }}>
        <Form.Item
          label="数据源"
          name="fileName"
          initialValue={selectedItems[0]?.name}
        >
          <Input
            placeholder="数据源"
            suffix={formatFileSize(selectedItems[0]?.size)}
            disabled={true}
          />
        </Form.Item>
        <Form.Item
          label="服务名称"
          required={ true }
          name="serviceName"

          initialValue={removeFileExtension(selectedItems[0]?.name)}
        >
          <Input
            placeholder="服务名称"
            showCount maxLength={20}
          />
        </Form.Item>
        <Form.Item
          label="服务类型"
          required={ true }
          name="serviceType"
          initialValue={['矢量瓦片','要素服务']}
        >
        <Select
          mode="multiple"
          style={{ width: '100%' }}
          placeholder="请选择服务类型"
          options={[
            { value: '矢量瓦片', label: '矢量瓦片' },
            { value: '要素服务', label: '要素服务' },
            { value: '要素服务', label: '要素服务' }
          ]}
        />
        </Form.Item>
        <Form.Item
          label="服务描述"
          name="serviceDescription"
        >
          <Input.TextArea
            placeholder="请输入服务描述（选填）"
            showCount maxLength={100}
            rows={4}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PublishModal;
