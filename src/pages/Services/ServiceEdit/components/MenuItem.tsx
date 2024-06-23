import { Flex } from 'antd';
import React from 'react';

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  selected: boolean;
  hovered: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  label,
  onClick,
  onMouseEnter,
  onMouseLeave,
  selected,
  hovered,
}) => {
  return (
    <Flex
      vertical
      align="center"
      gap="small"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        padding: '8px 0',
        cursor: 'pointer',
        background: selected ? '#1890ff' : hovered ? '#f0f2f5' : 'transparent',
        color: selected ? '#fff' : 'rgba(0, 0, 0, 0.65)',
        textAlign: 'center',
        marginBottom: 16,
        borderRadius: 4,
        marginTop: 8,
        marginLeft: 8,
        marginRight: 8,
      }}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </Flex>
  );
};

export default MenuItem;
