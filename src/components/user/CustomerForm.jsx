import React, { useState, useEffect } from "react";
import { Button, Flex, Input, Upload, Checkbox } from "antd";
import { fetcher } from "../../utils/helper";
import { Loader } from "../common/Loader";
import { Submit } from "../../assets/image";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";

export const CustomerForm = ({
  formData,
  serviceTitle,
  loading,
  setLoading,
  categoryName,
}) => {
  const data = JSON.parse(sessionStorage.getItem("settings")) || {
    image:
      "https://onboardify.tasc360.com/uploads/governify/1718271730_1718195689_Products%20Logo%20(1).png",
    site_bg: "#ffffff",
    button_bg: "#5ac063",
    banner_bg: "#5ac063",
    banner_content:
      "Hire an attitude, not just experience and qualification. Greg Savage.",
    header_bg: "#f7f7f7",
    head_title_color: "#5ac063",
  };
  const [formDetails, setFormDetails] = useState(formData.form_data);
  const [imageData, setImageData] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [idForImage, setIdForImage] = useState("");
  const [isSingleSelectEnable, setSingleSelect] = useState({
    enable: false,
    value: "",
  });
  const [isUploadEnable, setIsUploadEnable] = useState({
    enable: false,
    required: false,
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const props = {
    multiple: true,
    onRemove: (file) => {},
    beforeUpload: (file) => {
      return false;
    },
  };

  const handleFileChange = async (event, index) => {
    const files = event.file;

    if (files) {
      let reader = new FileReader();
      reader.onload = (function (theFile) {
        return function (event) {
          const tempFormData = [...formDetails];
          let tempImageData = [];
          tempFormData.forEach((item) => {
            if (item.type === "Document" || item.type === "image") {
              if (item.value == undefined) {
                tempImageData = [];
              } else {
                tempImageData = item.value;
              }
            }
          });
          tempImageData.push({ file: files, file_name: files.name });
          tempFormData.forEach((item) => {
            if (item.type === "Document" || item.type === "image") {
              item.value = tempImageData;
            }
          });
          setFormDetails(tempFormData);
        };
      })(files);

      reader.readAsDataURL(files);
    }
  };

  const getUploadLabel = (item) => {
    let newItem = item.split("\n");
    const data = newItem.map((subItem, index) => (
      <li style={{ color: "#2c2e38", fontSize: "13px" }} key={index}>
        {subItem}
      </li>
    ));
    return <ul>{data}</ul>;
  };

  const uploadImage = async (image, idForImage) => {
    let formData = new FormData();
    formData.append("item_id", idForImage);
    formData.append("file_name", image.file_name);
    formData.append("file", image.file);
  
    let token = sessionStorage.getItem("token");
    try {
      const response = await axios.post(
        "https://onboardify.tasc360.com/incorpify/uploadMondayFiles",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.status !== 200) {
        throw new Error("Network response was not ok");
      }
      
      return response.data.success; // Assuming the API returns a success field
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      return false;
    }
  };
  

  const uploadAllImage = async (imageData, idForImage) => {
    const uploadPromises = imageData.map((image) =>
      uploadImage(image, idForImage)
    );
    const results = await Promise.all(uploadPromises);

    return results.every((result) => result === true);
  };

  const handleSubmitAll = async () => {
    try {
      const response1 = await handleSubmit();
      const id = response1.response.response.data.create_item.id;
      const tempImageData = [];

      if (isUploadEnable.enable) {
       
        formDetails.forEach((item) => {
          if (item.type === "image" || item.type === "Document") {
            if (item.value.length > 0) {
              item.value.forEach((subItem) => {
                tempImageData.push({
                  file: subItem.file,
                  file_name: subItem.file_name, // Corrected from subItem.file_name to fileName
                  item_id: id,
                });
              });
            }
          }
        });

     
      }
      const response2 = await uploadAllImage(tempImageData, id);
      console.log(response2, "uploadAllImage response");

      if (!isUploadEnable.enable) {
        if (response1.status) {
          setFormSubmitted(true);
        }
      }else{
        if(response2){
          setFormSubmitted(true);
        }
      }
    } catch (error) {
      console.error("Error in handleSubmitAll:", error);
    }
  };

  const handleSubmit = async () => {
    let complete = false;
    let tempFormData = [];
    formDetails.forEach((item) => {
      if (item.type !== "image") {
        if (item.required && (item.value === "" || item.value === undefined)) {
          complete = true;
        } else {
          tempFormData.push({ [item.label]: item.value });
        }
      }
    });

    if (complete) {
      return;
    }
    let method = "POST";
    let url = "governify/customer/createRequestDashboard";
    let payload = JSON.stringify({
      form_data: tempFormData,
      service_request: serviceTitle,
      service_category: categoryName,
    });

    try {
      const response = await fetcher(url, method, payload);
      if (response.status) {
        setIdForImage(response.response.response.data.create_item.id);
        return response;
      }
    } catch (err) {
      console.log(err, "err");
    }
  };

  // Assuming you call handleSubmitAll somewhere in your code to trigger the process

  const handleChangeValue = (e, index) => {
    let updatedData = [...formDetails];
    updatedData[index].value = e.target.value;
    setFormDetails(updatedData);
  };

  const onChangeCheckBox = (e, index) => {
    let singleSelect = false;
    formData.form_data.forEach((item) => {
      if (item.type === "CheckBox") {
        singleSelect = item.singleSelect;
      }
    });

    if (singleSelect) {
      if (e.length > 0) {
        const newValues = e.filter(
          (item) => !isSingleSelectEnable.value.includes(item)
        );

        // If there are new values, update the form data and the state
        if (newValues.length > 0) {
          formData.form_data[index].value = newValues[0];
          setSingleSelect({ ...isSingleSelectEnable, value: newValues });
        }
      } else {
        formData.form_data[index].value = "";
        setSingleSelect({ ...isSingleSelectEnable, value: [] });
      }
    } else {
      formData.form_data[index].value = e.join(",");
      setSingleSelect({ ...isSingleSelectEnable, value: e });
    }
  };

  const checkDisable = () => {
    let flag = false;
    formDetails.forEach((item) => {
      if (
        item.type === "textArea" &&
        (item.value === undefined ||
          item.value === null ||
          item.value === "") &&
        item.required
      ) {
        flag = true;
      } else if (
        item.type === "CheckBox" &&
        (item.value === "" ||
          item.value === null ||
          item.value === undefined) &&
        item.required
      ) {
        flag = true;
      } else if (
        (item.type === "image" || item.type === "Document") &&
        item.value !== undefined &&
        item.value !== null &&
        item.value.length === 0 &&
        item.required
      ) {
        flag = true;
      }
    });

    return flag;
  };

  const getCheckBoxOptions = (options) => {
    const tempData = options.map((item) => ({
      label: item,
      value: item,
    }));
    return tempData;
  };

  useEffect(() => {
    let flag = false;
    let required = false;
    let singleSelect = false;
    formData.form_data.forEach((item) => {
      if (item.type === "image" || item.type === "Document") {
        flag = true;
        required = item.required;
      }
      if (item.type === "CheckBox") {
        singleSelect = true;
      }
    });
    setIsUploadEnable({ enable: flag, required: required });
    setSingleSelect({ enable: singleSelect, value: "" });
  }, []);

  useEffect(() => {
    setIsButtonDisabled(checkDisable());
  }, [formDetails, imageData, isSingleSelectEnable]);

  return (
    <div
      className="customer-form-container"
      style={{ maxWidth: "550px", width: "100%", marginTop: "25px" }}
      key={imageData.length}
    >
      {loading && <Loader />}

      {formSubmitted ? (
        <div>
          Thank you for submitting the form! We appreciate your time and effort.
          We'll get back to you shortly. Have a great day!
        </div>
      ) : (
        <>
          {" "}
          <div className="form-header">{serviceTitle}</div>
          <div
            className="w-divider-component-wrapper divider-component-wrapper_XE2"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="3000px"
              height="33"
              style={{ width: "12%" }}
            >
              <path
                d="M0 16.5 L3000 16.5"
                style={{
                  fill: "none",
                  stroke: data.button_bg,
                  strokeWidth: "3px",
                }}
              ></path>
            </svg>
          </div>
          <div className="form-header-description">
            Please fill out the form to proceed with the needed action to
            provide you with this service
          </div>
          <Flex
            vertical
            gap={15}
            className="pt-5"
            style={{ paddingBottom: "20px" }}
          >
            {formData.form_data.map((item, index) => {
              if (item.type === "textArea") {
                return (
                  <div
                    className="form-field"
                    style={{ display: "flex" }}
                    key={item.key}
                  >
                    <Input
                      style={{
                        fontSize: "13px",
                      }}
                      size="large"
                      variant="filled"
                      placeholder={
                        item.required ? item.label + " *" : item.label
                      }
                      onChange={(e) => handleChangeValue(e, index)}
                    />
                  </div>
                );
              } else if (item.type === "CheckBox") {
                const data = item;
                const options = getCheckBoxOptions(data.subLabel.split(","));
                if (isSingleSelectEnable.enable) {
                  return (
                    <div
                      key={data.key}
                      style={{
                        background: "#0000000A",
                        padding: "10px",
                        borderRadius: "10px",
                      }}
                    >
                      <p style={{ color: "#2C2E38", fontSize: "13px" }}>
                        {data.label} {item.required && " *"}
                      </p>
                      <Checkbox.Group
                        style={{ fontSize: "13px" }}
                        options={options}
                        onChange={(e) => onChangeCheckBox(e, index)}
                        value={isSingleSelectEnable.value}
                      />
                    </div>
                  );
                } else {
                  return (
                    <div
                      key={data.key}
                      style={{
                        background: "#0000000A",
                        padding: "10px",
                        borderRadius: "10px",
                      }}
                    >
                      <p style={{ color: "#2C2E38", fontSize: "13px" }}>
                        {data.label} {item.required && " *"}
                      </p>
                      <Checkbox.Group
                        style={{ fontSize: "13px" }}
                        options={options}
                        onChange={(e) => onChangeCheckBox(e, index)}
                      />
                    </div>
                  );
                }
              } else {
                return (
                  <div
                    key={imageData.length}
                    className="form-field"
                    style={{
                      background: "#0000000A",
                      padding: "10px",
                      borderRadius: "10px",
                      color: "#2c2e38",
                    }}
                  >
                    <label
                      htmlFor={`upload-${index}`}
                      style={{ color: "#2c2e38", fontSize: "13px" }}
                    >
                      {item.label || "Upload the following documents"}{" "}
                      {item.required && " *"}
                    </label>
                    <div>{getUploadLabel(item.subLabel)}</div>

                    <Upload
                      {...props}
                      onChange={(e) => handleFileChange(e, index)}
                    >
                      <Button
                        icon={<UploadOutlined />}
                        style={{ fontSize: "13px", color: "#2c2e38" }}
                      >
                        Click to Upload
                      </Button>
                    </Upload>
                  </div>
                );
              }
            })}
          </Flex>
          <div className="w-100 d-flex justify-content-center">
            <Button
              disabled={isButtonDisabled}
              size="large"
              style={{
                width: "100%",
                border: "none",
                background: isButtonDisabled ? "#ecedf5" : data.button_bg,
                color: isButtonDisabled ? "#32333861" : "#fff",
              }}
              icon={<Submit />}
              onClick={handleSubmitAll}
            >
              <span
                style={{
                  fontSize: "15px",
                  fontFamily: "montserrat, sans-serif",
                }}
              >
                Submit
              </span>
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
