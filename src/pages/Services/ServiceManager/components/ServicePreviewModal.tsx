import { Modal } from 'antd';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useEffect, useRef } from 'react';

const ServicePreviewModal = ({ service, visible, onClose }) => {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    if (visible && mapContainerRef.current) {
      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: 'https://api.maptiler.com/maps/satellite/style.json?key=TxU619ucqUp8F321k2JK',
        center: [120, 36],
        zoom: 3,
      });

      map.on('load', () => {
        // 在地图加载完成后执行的操作
      });

      return () => {
        map.remove();
      };
    }
  }, [visible, service]);

  return (
    <Modal
      title={`预览服务：${service.name}`}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={1200}
      destroyOnClose
    >
      <div ref={mapContainerRef} style={{ width: '100%', height: 600 }} />
    </Modal>
  );
};

export default ServicePreviewModal;
