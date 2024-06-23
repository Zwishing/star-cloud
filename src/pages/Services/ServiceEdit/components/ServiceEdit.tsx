import { useModel } from '@umijs/max';
import { Button, Col, Layout, Row, theme } from 'antd';
import React from 'react';
import CustomMenu from './CustomMenu';
import Map from './Map';
import SidebarPanel from './SidebarPanel';
import RightSider from './StyleSetting';

const { Header, Content } = Layout;

const ServiceEdit: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const { visible } = useModel('SidebarPanelModel', (model) => ({
    visible: model.visible,
  })); // 使用 useModel 创建状态管理

  const handleSave = () => {
    // 保存服务配置逻辑
    console.log('保存按钮点击');
  };

  const handleCancel = () => {
    // 取消逻辑
    console.log('取消按钮点击');
  };

  return (
    <Layout style={{ maxHeight: '100vh', overflow: 'hidden' }}>
      <div style={{ background: '#001529', padding: 0, height: 40, lineHeight: '40px' }}>
        <Row justify={'space-evenly'}>
          <Col span={4}>
            <span style={{ flex: 1, color: 'white', fontSize: 16, marginLeft: 16 }}>
              <b>Tinamic 服务配置</b>
            </span>
          </Col>
          <Col span={16}></Col>
          <Col span={4}>
            <Button type="primary" size="small" onClick={handleSave}>
              保存
            </Button>
          </Col>
        </Row>
      </div>
      <Layout>
        <CustomMenu /> {/* 将 setState 传递给 CustomMenu */}
        {visible && <SidebarPanel />}
        <Layout style={{ padding: '0 6px 6px', flex: 1 }}>
          <Content
            style={{
              padding: 6,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              maxHeight: 'calc(100vh - 40px)', // 减去 Header 的高度
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Map />
          </Content>
        </Layout>
        <RightSider />
      </Layout>
    </Layout>
  );
};

export default ServiceEdit;
