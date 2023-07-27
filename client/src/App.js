import React, { useState } from "react";
import { Upload, Button, message, Space, Divider, Select, Image } from "antd";
import { InboxOutlined, DownloadOutlined, UploadOutlined } from "@ant-design/icons"
import logo from "../src/assets/images/konverta.png";

function App() {

  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [pdf, setPDF] = useState("");

  const sizeOptions = [
    {
      label: "A4",
      value: "A4"
    },
    {
      label: "A5",
      value: "A5"
    }
  ]

  const handleUpload = async () => {

    const formData = new FormData();

    fileList.forEach((file) => {
      formData.append("files[]", file);
    });

    setUploading(true);

    const url = "http://localhost:8080/api/imgtopdf";
    const options = {
      method: "POST",
      body: formData,
    }

    const response = await fetch(url, options);

    const data = await response.json();

    if(data.success) {
      setFileList([]);
      setPDF(data.pdf)
      message.success("Upload successfully.");
    } else {
      message.error("Upload failed.")
    }

    setUploading(false);

  }

  const props = {
    name: "file",
    beforeUpload: (file) => {
      setFileList([...fileList, file]);
      return false;
    },
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    fileList,
  }

  return (
    <div style={{ display: 'block', margin: "auto", width: "50%" }}>
      <Space direction="vertical" style={{ width: "100%" }}>
        <Image width={200} src={logo} preview={false} />
        <Divider />
        <Upload.Dragger {...props}>
        <p className="ant-upload-drag-icon">
        <InboxOutlined />
        </p>
        <p className="ant-upload-text">Click or drag file to this area to upload</p>
        <p className="ant-upload-hint">
         Convert JPG and PNG to PDF
        </p>
        </Upload.Dragger>

        <Divider />
        <Space>
          <Button icon={<UploadOutlined />} type="primary" size="large" disabled={fileList.length === 0 ? true : false} onClick={handleUpload} loading={uploading}>{uploading ? "Converting" : "Convert"}</Button>

          {/* <Select type="primary" defaultValue="Select Size" options={sizeOptions} /> */}

          <Button disabled={pdf === "" ? true : false} icon={<DownloadOutlined />} type="primary" shape="round" size="large" href={"http://localhost:8080/pdf/" + pdf} target="__blank">Download PDF</Button>
        </Space>
      </Space>
    </div>
  );
}

export default App;
