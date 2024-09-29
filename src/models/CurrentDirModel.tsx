import { useState } from 'react';

interface CurrentDirProps {
  keys: string[]; // 存储当前目录的键
  path: string[]; // 存储当前目录的路径
}

// 定义初始目录结构
const VectorHomeDir = {
  keys: [''],
  path: ['/vector'], // 初始路径为 '/vector'
};

export default function CurrentDir() {
  // 使用 useState 钩子来管理当前目录状态
  const [currentDir, setCurrentDir] = useState<CurrentDirProps>(VectorHomeDir);

  // 设置主页目录，接收可选的 key 参数
  const setHomeDir = (key?: string) => {
    setCurrentDir((prev) => ({
      keys: key ? [key] : prev.keys, // 如果有传入的 key，则使用它，否则保留原来的 keys
      path: VectorHomeDir.path, // 保持原始 path
    }));
  };

  // 设置下一个目录，接收 key 和 path 参数
  const setNextDir = (key: string, path: string) => {
    // 确保路径以 '/' 开头
    const newPath = path.startsWith('/') ? path : `/${path}`;
    setCurrentDir((prev) => ({
      keys: [...prev.keys, key], // 添加新的 key
      path: [...prev.path, newPath], // 添加新的路径
    }));
  };

  // 返回到上一个目录
  const setPrevDir = () => {
    setCurrentDir((prev) => {
      // 确保当前路径有上级目录
      if (prev.path.length > 1) {
        const [newKeys, newPath] = [prev.keys.slice(0, -1), prev.path.slice(0, -1)];
        return { keys: newKeys, path: newPath }; // 返回新的 keys 和 path
      }
      return prev; // 如果没有上级目录，保持不变
    });
  };

  const setDirByIndex = (index: number) => {
    setCurrentDir((prev) => {
      // 检查索引是否有效
      if (index >= 0 && index < prev.keys.length) {
        return {
          keys: prev.keys.slice(0, index + 1), // 截取到指定索引的 keys
          path: prev.path.slice(0, index + 1), // 截取到指定索引的 path
        };
      }
      return prev; // 如果索引无效，保持不变
    });
  };

  const getCurentKey = () => currentDir.keys[currentDir.keys.length - 1];

  const getFirstKey = () => currentDir.keys[0];

  const getKeyByIndex = (index: number) => {
    if (index >= 0 && index < currentDir.keys.length) {
      return currentDir.keys[index];
    }
    return getCurentKey();
  };

  return {
    currentDir,
    setHomeDir,
    setNextDir,
    setPrevDir,
    setDirByIndex,
    getCurentKey,
    getFirstKey,
    getKeyByIndex,
  };
}
