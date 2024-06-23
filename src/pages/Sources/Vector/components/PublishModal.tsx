import { ProForm, ProFormRadio, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import { Button, Modal, Steps, message } from 'antd';
import { useState } from 'react';

const { Step } = Steps;

const PublishModal = ({ visible, handleOk, handleCancel, selectedFile }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: '选择发布类型',
      content: (
        <ProForm>
          <ProFormRadio.Group
            name="publishType"
            label="发布类型"
            options={[
              { label: '公开', value: 'public' },
              { label: '私密', value: 'private' },
            ]}
            rules={[{ required: true, message: '请选择发布类型' }]}
          />
        </ProForm>
      ),
    },
    {
      title: '选择发布目标',
      content: (
        <ProForm>
          <ProFormSelect
            name="publishTarget"
            label="发布目标"
            options={[
              { label: '目标 1', value: 'target1' },
              { label: '目标 2', value: 'target2' },
            ]}
            rules={[{ required: true, message: '请选择发布目标' }]}
          />
        </ProForm>
      ),
    },
    {
      title: '确认发布信息',
      content: (
        <ProForm>
          <ProFormText
            name="fileName"
            label="文件名称"
            initialValue={selectedFile?.title}
            disabled
          />
          <ProFormText name="publishType" label="发布类型" initialValue="public" disabled />
          <ProFormText name="publishTarget" label="发布目标" initialValue="target1" disabled />
        </ProForm>
      ),
    },
  ];

  const next = () => {
    setCurrentStep(currentStep + 1);
  };

  const prev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleFinish = () => {
    message.success('发布成功');
    handleOk();
  };

  return (
    <Modal
      title="发布文件"
      visible={visible}
      onCancel={handleCancel}
      footer={[
        currentStep > 0 && (
          <Button key="back" onClick={prev}>
            上一步
          </Button>
        ),
        currentStep < steps.length - 1 && (
          <Button key="next" type="primary" onClick={next}>
            下一步
          </Button>
        ),
        currentStep === steps.length - 1 && (
          <Button key="submit" type="primary" onClick={handleFinish}>
            确认发布
          </Button>
        ),
      ]}
    >
      <Steps current={currentStep}>
        {steps.map((step, index) => (
          <Step key={index} title={step.title} />
        ))}
      </Steps>
      <div style={{ marginTop: 24 }}>{steps[currentStep].content}</div>
    </Modal>
  );
};

export default PublishModal;
