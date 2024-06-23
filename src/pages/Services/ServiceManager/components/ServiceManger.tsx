import { message, Pagination } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import ServiceFilter from './ServiceFilter';
import ServiceList from './ServiceList';
import ServicePreviewModal from './ServicePreviewModal';

const ServiceManager: React.FC = () => {
  const [services, setServices] = useState([
    {
      key: '1',
      name: '服务 1',
      description: '这是服务 1 的描述',
      image: 'https://via.placeholder.com/300x160',
      category: 'category1',
      type: 'type1',
      date: '2023-06-01',
    },
    {
      key: '2',
      name: '服务 2',
      description: '这是服务 2 的描述',
      image: 'https://via.placeholder.com/300x160',
      category: 'category2',
      type: 'type2',
      date: '2023-06-15',
    },
    {
      key: '3',
      name: '服务 2',
      description: '这是服务 2 的描述',
      image: 'https://via.placeholder.com/300x160',
      category: 'category2',
      type: 'type2',
      date: '2023-06-15',
    },
    {
      key: '4',
      name: '服务 2',
      description: '这是服务 2 的描述',
      image: 'https://via.placeholder.com/300x160',
      category: 'category2',
      type: 'type2',
      date: '2023-06-15',
    },
    {
      key: '5',
      name: '服务 2',
      description: '这是服务 2 的描述',
      image: 'https://via.placeholder.com/300x160',
      category: 'category2',
      type: 'type2',
      date: '2023-06-15',
    },
    {
      key: '6',
      name: '服务 2',
      description: '这是服务 2 的描述',
      image: 'https://via.placeholder.com/300x160',
      category: 'category2',
      type: 'type2',
      date: '2023-06-15',
    },
    {
      key: '7',
      name: '服务 2',
      description: '这是服务 2 的描述',
      image: 'https://via.placeholder.com/300x160',
      category: 'category2',
      type: 'type2',
      date: '2023-06-15',
    },
    // 添加更多服务
  ]);

  const [filteredServices, setFilteredServices] = useState(services);
  const [currentPage, setCurrentPage] = useState(1);
  const [openPreview, setOpenPreview] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const handlePreview = (service) => {
    message.info(`预览服务: ${service.name}`);
    setSelectedService(service); // 设置当前选中的服务
    setOpenPreview(true);
  };

  const pageSize = 12;

  useEffect(() => {
    setFilteredServices(services);
  }, [services]);

  useEffect(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    setFilteredServices(services.slice(startIndex, endIndex));
  }, [currentPage, services]);

  const handleSearch = (value) => {
    setFilteredServices(services.filter((service) => service.name.includes(value)));
    setCurrentPage(1); // 搜索时返回第一页
  };

  const handleFilterCategory = (value) => {
    setFilteredServices(services.filter((service) => service.category === value));
    setCurrentPage(1); // 筛选时返回第一页
  };

  const handleFilterType = (value) => {
    setFilteredServices(services.filter((service) => service.type === value));
    setCurrentPage(1); // 筛选时返回第一页
  };

  const handleFilterDateRange = (dates) => {
    if (dates) {
      const [start, end] = dates;
      setFilteredServices(
        services.filter((service) => {
          const serviceDate = moment(service.date);
          return serviceDate.isBetween(start, end, 'days', '[]');
        }),
      );
      setCurrentPage(1); // 筛选时返回第一页
    } else {
      setFilteredServices(services);
    }
  };

  const handleDelete = (service) => {
    setServices(services.filter((s) => s.key !== service.key));
    message.success(`服务已删除: ${service.name}`);
    setCurrentPage(1); // 删除后返回第一页
  };

  const handleConfigure = (service) => {
    message.info(`配置服务: ${service.name}`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <ServiceFilter
        onSearch={handleSearch}
        onFilterCategory={handleFilterCategory}
        onFilterType={handleFilterType}
        onFilterDateRange={handleFilterDateRange}
      />

      <ServiceList
        services={filteredServices}
        onPreview={handlePreview}
        onDelete={handleDelete}
        onConfigure={handleConfigure}
      />
      {openPreview && (
        <ServicePreviewModal
          visible={openPreview}
          onClose={() => setOpenPreview(false)}
          service={selectedService}
        />
      )}
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={services.length}
        onChange={handlePageChange}
        style={{ marginTop: 16, textAlign: 'center' }}
      />
    </div>
  );
};

export default ServiceManager;
