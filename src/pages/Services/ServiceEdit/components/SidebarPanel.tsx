import { Button, Col, Divider, Form, Input, Layout, Modal, Row, theme } from 'antd';
import React, { useState } from 'react';
import './SidebarPanel.css'; // 引入自定义的 CSS 文件
import StyleList from './StyleList';

const { Sider } = Layout;
const { TextArea } = Input;

const SidebarPanel: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const handleAddStyle = () => {
    form.validateFields().then((values) => {
      console.log('样式名称:', values.styleName);
      form.resetFields();
      setVisible(false);
    });
  };

  return (
    <>
      <Sider
        width="30vh"
        style={{
          background: colorBgContainer,
          border: '1px solid #ddd',
          padding: '16px',
        }}
      >
        <Row justify="space-between" align="middle">
          <Col>
            <div>
              <b>服务样式</b>
            </div>
          </Col>
          <Col>
            <Button onClick={() => setVisible(true)}>新增样式</Button>
          </Col>
        </Row>
        <Divider style={{ marginTop: 12 }} />
        <StyleList />
      </Sider>
      <Modal
        title="新增样式"
        open={visible}
        onOk={handleAddStyle}
        onCancel={() => setVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="styleName"
            label="样式名称"
            rules={[{ required: true, message: '请输入样式名称' }]}
          >
            <Input placeholder="请输入样式名称" />
          </Form.Item>
          <Form.Item name="styleDescription" label="样式描述" rules={[{ required: false }]}>
            <TextArea placeholder="请输入样式描述" rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default SidebarPanel;
