import {
  ArrowLeftOutlined,
  HomeOutlined,
  PlusOutlined,
  SearchOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { Button, Col, Input, Row } from 'antd';

interface FileSystemHeaderProps {
  currentPath: string[]; // The current path in the file system as an array of strings
  searchKeyword: string; // The current search keyword
  setSearchKeyword: (keyword: string) => void; // Function to update the search keyword
  handleHomeButtonClick: () => void; // Function to handle home button click
  handleBackButtonClick: () => void; // Function to handle back button click
  handleAddFolder: () => void; // Function to handle adding a new folder
  setUploadModalVisible: (visible: boolean) => void; // Function to control the visibility of the upload modal
}

const FileSystemHeader:React.FC<FileSystemHeaderProps> =({
    currentPath, searchKeyword, setSearchKeyword, handleHomeButtonClick, handleBackButtonClick, handleAddFolder, setUploadModalVisible,
})=> {
    return (
        <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col flex="auto">
                <Button
                    type="primary"
                    icon={<HomeOutlined />}
                    disabled={currentPath.length === 1}
                    onClick={handleHomeButtonClick}
                >
                    首页
                </Button>
                <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={handleBackButtonClick}
                    disabled={currentPath.length === 1}
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
                    onChange={(e) => setSearchKeyword(e.target.value)} />
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
}

export default FileSystemHeader;
