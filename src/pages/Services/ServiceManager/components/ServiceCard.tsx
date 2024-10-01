// 更新 ServiceCard 组件
import { DeleteOutlined, EditOutlined, SettingOutlined } from '@ant-design/icons';
import { Card } from 'antd';
import { Link } from 'umi';

const { Meta } = Card;

const ServiceCard = ({ service, onDelete, onPreview }) => {
  return (
    <Card
      hoverable
      //   style={{ margin: '16px 8px' }}
      cover={<img alt={service.name} src={service.image} style={{ objectFit: 'cover' }} />}
      actions={[
        // eslint-disable-next-line react/jsx-key
        <SettingOutlined onClick={() => onPreview(service)} />,
        <Link
          to={{ pathname: '/services/edit', search: `?key=${service.key}` }}
          key="edit"
          target="_blank"
        >
          <EditOutlined key="edit" />
        </Link>,
        // eslint-disable-next-line react/jsx-key
        <SettingOutlined />,
        <DeleteOutlined key="delete" onClick={() => onDelete(service)} />,
      ]}
      size={'small'}
    >
      <Meta description={service.name} />
    </Card>
  );
};

export default ServiceCard;
