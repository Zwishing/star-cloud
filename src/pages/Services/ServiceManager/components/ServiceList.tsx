import { Col, Row } from 'antd';
import ServiceCard from './ServiceCard';

const ServiceList = ({ services, onPreview, onDelete }) => {
  return (
    <Row gutter={[8, 8]}>
      {services.map((service) => (
        <Col key={service.key} xs={24} sm={12} md={8} lg={6} xl={4}>
          <ServiceCard service={service} onPreview={() => onPreview(service)} onDelete={onDelete} />
        </Col>
      ))}
    </Row>
  );
};

export default ServiceList;
