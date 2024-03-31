import {upload} from '@/services/sources/upload';
import {useEffect, useRef, useState} from "react";
import {UploadFile, message} from "antd";

export default function Upload(){
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploadStatus,setUploadStatus] = useState([]);
  const isMounted = useRef(false);
  useEffect(()=>{
    // 第一次不执行
    if (!isMounted.current){
      isMounted.current=true
    }else{
      // 发送上传
      fileList.forEach((file)=>{
        upload(file, {
          onUploadProgress: function (progressEvent: { loaded: number; total: number; }) {
            setUploadStatus(
              
              // percent:Math.floor(progressEvent.loaded / progressEvent.total*100)
            )
          }
        })
          .then((res) => {
            return res.fileList;
          })
          .then(() => {
            message.success('upload successfully.');
          })
          .catch(() => {
            message.error('upload failed.');
          })
          .finally(() => {
            console.log("结束")
          });
      })
      
    }  
  },[fileList])
    return {
      fileList,
      setFileList,
      uploadStatus
    };
};
