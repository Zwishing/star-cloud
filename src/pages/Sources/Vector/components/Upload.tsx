import { CloudUploadOutlined } from '@ant-design/icons';
import { Upload as AntdUpload, UploadProps, UploadFile, Modal, ModalProps, message, Progress} from 'antd';
import React,{ useImperativeHandle, useState } from 'react';
import {upload} from '@/services/sources/upload';
import {useModel} from "@umijs/max";

const { Dragger } = AntdUpload;

/**
 * 实现数据上传功能
 * @param open
 * @param onCancel
 * @param onOk
 * @constructor
 */
const Upload:React.FC = React.forwardRef((props,ref) => {
  const [open,setOpen] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const { handleFileList} = useModel('uploadModel',(model)=>({
    handleFileList:model.setFileList
  }));
  useImperativeHandle(
    ref,
    ()=>({openModal:()=>setOpen(true)}))
  const draggerProps: UploadProps = {
    accept:".zip,.geojson,.GEOJSON",
    // 删除上传的内容
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    // 显示上传列表
    beforeUpload: (file) => {
      setFileList([...fileList, file]);
      return false;
    },
    fileList,
  };

  const handleUpload = () => {
    // fileList.forEach((file)=>{
    //   upload(file, {
    //     onUploadProgress: function (progressEvent: { loaded: number; total: number; }) {
    //       onOk(file,Math.floor(progressEvent.loaded / progressEvent.total*100))
    //     }
    //   })
    //     .then((res) => {
    //       return res.fileList;
    //     })
    //     .then(() => {
    //       setFileList([]);
    //       message.success('upload successfully.');
    //     })
    //     .catch(() => {
    //       message.error('upload failed.');
    //     })
    //     .finally(() => {
    //       console.log("结束")
    //     });
    // })
    handleFileList(fileList)
  };
  const handleCancel =()=>{
    // setFileList([])
    // onCancel(false)
    setOpen(false)
  }

  const handleOk = ()=>{
    setFileList([])
    // onCancel(false)
    setOpen(false)
    // onOk(fileList)
    handleUpload()
  }

    return (
        <Modal
            title="上传数据"
            open = {open}
            onCancel={handleCancel}
            onOk={handleOk}
        >
            <Dragger {...draggerProps}

            >
              <p className="ant-upload-drag-icon">
                <CloudUploadOutlined />
              </p>
              <p className="ant-upload-text">点击或者拖拽文件上传</p>
              <p className="ant-upload-hint">
                支持上传GeoJSON、Shapefile(zip压缩包)文件
              </p>
            </Dragger>
          {/*<Progress percent={percent}></Progress>*/}
        </Modal>
        );
  });

export default Upload;
