import { useIntl } from '@umijs/max';
import { Button, message, notification } from 'antd';
import defaultSettings from '../config/defaultSettings';

const { pwa } = defaultSettings; // 从默认设置中获取 PWA 配置
const isHttps = document.location.protocol === 'https:'; // 检查当前协议是否为 HTTPS

const clearCache = () => {
  // 清除所有缓存
  if (window.caches) {
    caches
      .keys()
      .then((keys) => {
        keys.forEach((key) => {
          caches.delete(key);
        });
      })
      .catch((e) => console.log(e)); // 处理错误
  }
};

// 如果 PWA 配置为 true
if (pwa) {
  // 当离线时通知用户
  window.addEventListener('sw.offline', () => {
    message.warning(useIntl().formatMessage({ id: 'app.pwa.offline' })); // 使用国际化消息
  });

  // 当 Service Worker 更新时，弹出提示
  window.addEventListener('sw.updated', (event: Event) => {
    const e = event as CustomEvent;
    const reloadSW = async () => {
      // 检查是否有等待中的 Service Worker
      // https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration
      const worker = e.detail && e.detail.waiting;
      if (!worker) {
        return true;
      }
      // 使用 MessageChannel 发送 skip-waiting 事件给等待中的 Service Worker
      await new Promise((resolve, reject) => {
        const channel = new MessageChannel();
        channel.port1.onmessage = (msgEvent) => {
          if (msgEvent.data.error) {
            reject(msgEvent.data.error);
          } else {
            resolve(msgEvent.data);
          }
        };
        worker.postMessage({ type: 'skip-waiting' }, [channel.port2]);
      });

      clearCache(); // 清除缓存
      window.location.reload(); // 刷新页面
      return true;
    };
    const key = `open${Date.now()}`;
    const btn = (
      <Button
        type="primary"
        onClick={() => {
          notification.destroy(key); // 销毁当前通知
          reloadSW(); // 重新加载 Service Worker
        }}
      >
        {useIntl().formatMessage({ id: 'app.pwa.serviceworker.updated.ok' })} // 使用国际化消息
      </Button>
    );
    notification.open({
      message: useIntl().formatMessage({ id: 'app.pwa.serviceworker.updated' }), // 使用国际化消息
      description: useIntl().formatMessage({ id: 'app.pwa.serviceworker.updated.hint' }), // 使用国际化消息
      btn,
      key,
      onClose: async () => null,
    });
  });
} else if ('serviceWorker' in navigator && isHttps) {
  // 如果 PWA 配置为 false，且支持 Service Worker 且使用 HTTPS 协议
  // 注销 Service Worker
  const { serviceWorker } = navigator;
  if (serviceWorker.getRegistrations) {
    serviceWorker.getRegistrations().then((sws) => {
      sws.forEach((sw) => {
        sw.unregister(); // 注销所有 Service Worker
      });
    });
  }
  serviceWorker.getRegistration().then((sw) => {
    if (sw) sw.unregister(); // 注销当前的 Service Worker
  });

  clearCache(); // 清除缓存
}
