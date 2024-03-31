import {CheckCircleOutlined, CloseOutlined, DeleteOutlined, SyncOutlined} from "@ant-design/icons";
import {Popover, List, Progress, FloatButton, Tag, Flex, Button} from "antd";
import { useState } from "react";
import {useModel} from "@umijs/max";

const UploadProgress:React.FC=()=>{

    const [open,setOpen] = useState(true)
    const {fileList, uploadStatus} = useModel('uploadModel')

    return (
    <Popover
      content={
        <div style={{width:400}}>
            <List
            itemLayout="vertical"
            header={
            <Flex justify="space-between">
              <span><b>上传</b></span>
              <Button
                    type="text"
                    icon={<CloseOutlined />}
                    shape="circle"
                    size = "small">
              </Button>
            </Flex>
          }
            size="small"
            // grid={{column:1}}
            bordered
            dataSource={fileList}
            renderItem={(item) => (
              <List.Item>
                {/* <Upload
                 action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                 listType="picture"
                 defaultFileList={[{
                  uid: '0',
                  name: item,
                  status: 'uploading',
                  percent: 33,
                }]}
                ></Upload> */}
                {/* <List.Item.Meta
                  // avatar={<Avatar src={item.picture.large} />}
                  title={item}
                  // description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                /> */}
                <span><b>{item.name}</b></span>
                <Flex justify="space-between">
                  {/* {
                    uploadStatus===100?(<Tag icon={<CheckCircleOutlined />} color="success">已完成</Tag>):(<Tag icon={<SyncOutlined spin />} color="processing">上传中</Tag>)
                  } */}
                  <Button
                    type="dashed"
                    icon={<DeleteOutlined />}
                    shape="circle"
                    size = "small">
                  </Button>
                </Flex>

                {/* <p>{item}</p> */}
                <Progress
                  showInfo
                  percent={10}></Progress>
              </List.Item>
            )}
          />
        </div>
    }
      title="上传进度"
      trigger="click"
      open={open}
      placement = "leftBottom"

    //   onOpenChange={handleOpenChange}
    >
    <FloatButton
      badge= {{count:1}}
      onClick={()=>setOpen(!open)}>

    </FloatButton>
    </Popover>
    )
}
export default UploadProgress;
