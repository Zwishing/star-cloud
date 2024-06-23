import { Collapse, Form, Layout, Tabs, theme } from 'antd';
import React, { useState } from 'react';

const { Sider } = Layout;
const { Panel } = Collapse;
const { TabPane } = Tabs;

const StyleSetting: React.FC = () => {
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
    <Sider
      width="40vh"
      style={{
        background: colorBgContainer,
        border: '1px solid #f0f0f0', // 浅色边框
        padding: '16px',
      }}
    >
      <Tabs defaultActiveKey="1" tabPosition="top" style={{ marginBottom: 16 }}>
        <TabPane tab="字体设置" key="1">
          <Collapse
            bordered={true} // 不显示默认边框
            defaultActiveKey={['1', '2', '3']} // 默认展开所有面板
            expandIconPosition="right" // 折叠图标位于右侧
            collapsible="icon"
            size="small"
          >
            <Panel header="字体大小" key="1">
              <p>设置字体大小</p>
            </Panel>
            <Panel header="字体颜色" key="2">
              <p>设置字体颜色</p>
            </Panel>
            <Panel header="其他字体设置" key="3">
              <p>其他字体样式设置</p>
            </Panel>
          </Collapse>
        </TabPane>
        <TabPane tab="背景设置" key="2">
          <Collapse
            bordered={true} // 不显示默认边框
            defaultActiveKey={['4', '5']} // 默认展开所有面板
            expandIconPosition="right" // 折叠图标位于右侧
          >
            <Panel header="背景图片" key="4">
              <p>设置背景图片</p>
            </Panel>
            <Panel header="背景颜色" key="5">
              <p>设置背景颜色</p>
            </Panel>
          </Collapse>
        </TabPane>
      </Tabs>
    </Sider>
  );
};

export default StyleSetting;
