import { HighlightTwoTone } from '@ant-design/icons';
import { useModel } from '@umijs/max';
import { Layout, theme } from 'antd';
import React, { useState } from 'react';
import MenuItem from './MenuItem'; // 引入之前创建的 MenuItem 组件

const { Sider } = Layout;

const items = [{ key: '2', icon: <HighlightTwoTone style={{ fontSize: 24 }} /> }];

const CustomMenu: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const items = [{ key: '2', icon: <HighlightTwoTone style={{ fontSize: 24 }} /> }];

  const { setVisible } = useModel('SidebarPanelModel', (model) => ({
    setVisible: model.setVisible,
  }));
  const toggleSidebar = () => {
    setVisible((prev: boolean) => !prev); // 切换 SidebarPanel 的显示与隐藏状态
  };

  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>('2');

  const handleItemClick = (key: string) => {
    setSelectedItem((prev) => (prev === key ? null : key));
    // 可以在这里添加处理逻辑，根据选项执行相应的操作
    toggleSidebar();
  };

  return (
    <Sider
      width={80}
      style={{
        background: colorBgContainer,
        position: 'relative',
      }}
      collapsedWidth={80}
      collapsible={false}
      trigger={null}
    >
      {items.map((item) => (
        <MenuItem
          key={item.key}
          icon={item.icon}
          label={'样式'}
          onClick={() => handleItemClick(item.key)}
          onMouseEnter={() => setHoveredItem(item.key)}
          onMouseLeave={() => setHoveredItem(null)}
          selected={selectedItem === item.key}
          hovered={hoveredItem === item.key}
        />
      ))}
    </Sider>
  );
};

export default CustomMenu;
