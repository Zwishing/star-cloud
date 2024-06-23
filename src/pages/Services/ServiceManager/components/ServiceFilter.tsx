import { Button, Col, DatePicker, Input, Row, Select, Space } from 'antd';
import { useState } from 'react';

const { Search } = Input;
const { Option } = Select;

const categories = ['全部', '矢量', '影像', '地形', '点云'];

const ServiceFilter = ({ onSearch, onFilterType, onFilterDateRange }) => {
  const [selectedCategory, setSelectedCategory] = useState('全部');

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div style={{ background: '#fff', padding: 16, borderRadius: 8, marginBottom: 8 }}>
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col span={24}>
          <Space>
            <span>数据类别:</span>
            {categories.map((category) => (
              <Button
                key={category}
                type={selectedCategory === category ? 'primary' : 'default'}
                onClick={() => handleCategoryClick(category)}
              >
                {category}
              </Button>
            ))}
          </Space>
        </Col>
      </Row>
      <Row gutter={[16, 16]} align="middle">
        <Col span={8}>
          <Space>
            <span>服务名称:</span>
            <Search placeholder="搜索服务名称" onSearch={onSearch} enterButton />
          </Space>
        </Col>
        <Col span={8}>
          <Space>
            <span>服务类别:</span>
            <Select placeholder="选择服务类别" onChange={onFilterType}>
              <Option value="type1">类别 1</Option>
              <Option value="type2">类别 2</Option>
              <Option value="type3">类别 3</Option>
            </Select>
          </Space>
        </Col>
        <Col span={8}>
          <Space>
            <span>发布时间:</span>
            <DatePicker.RangePicker
              placeholder={['开始日期', '结束日期']}
              onChange={onFilterDateRange}
            />
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default ServiceFilter;
