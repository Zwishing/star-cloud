import React from 'react';
import folder from '../../../public/icons/folder.svg';
import shp from '../../../public/icons/shp.svg'; // 替换为你的 SHP 图标路径
import tif from '../../../public/icons/tif.svg'; // 替换为你的 TIFF 图标路径
import zip from '../../../public/icons/zip.svg'; // 替换为你的 ZIP 图标路径

const FolderIcon: React.FC = () => {
  return <img src={folder} width="24" height="24" alt="Folder Icon" />;
};

const ShpIcon: React.FC = () => {
  return <img src={shp} width="24" height="24" alt="SHP Icon" />;
};

const TifIcon: React.FC = () => {
  return <img src={tif} width="24" height="24" alt="TIFF Icon" />;
};

const ZipIcon: React.FC = () => {
  return <img src={zip} width="24" height="24" alt="ZIP Icon" />;
};

// 导出所有图标组件
export { FolderIcon, ShpIcon, TifIcon, ZipIcon };
