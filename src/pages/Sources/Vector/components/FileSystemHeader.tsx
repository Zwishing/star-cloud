import {
  ArrowLeftOutlined,
  HomeOutlined,
  PlusOutlined,
  SearchOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { Button, Col, Input, Row } from 'antd';

const FileSystemHeader = ({
  currentPath,
  searchKeyword,
  setSearchKeyword,
  handleHomeButtonClick,
  handleBackButtonClick,
  handleAddFolder,
  setUploadModalVisible,
}) => {
  return (
    <Row gutter={16} style={{ marginBottom: 16 }}>
      <Col flex="auto">
        <Button
          type="primary"
          icon={<HomeOutlined />}
          disabled={currentPath.length === 0}
          onClick={handleHomeButtonClick}
        >
          首页
        </Button>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={handleBackButtonClick}
          disabled={currentPath.length === 0}
          style={{ marginLeft: 8 }}
        >
          返回上一级
        </Button>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddFolder}
          style={{ marginLeft: 8 }}
        >
          新建文件夹
        </Button>
      </Col>
      <Col>
        <Input
          prefix={<SearchOutlined />}
          placeholder="搜索文件或文件夹"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
      </Col>
      <Col>
        <Button
          type="primary"
          icon={<UploadOutlined />}
          onClick={() => setUploadModalVisible(true)}
        >
          上传
        </Button>
      </Col>
    </Row>
  );
};

export default FileSystemHeader;
