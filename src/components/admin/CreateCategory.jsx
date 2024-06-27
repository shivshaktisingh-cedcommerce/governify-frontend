import { Button, Input } from "antd";
import { useState } from "react";
import { fetcher } from "../../utils/helper";
import { toast } from "react-toastify";

export const CreateCategory = ({
  setShowSkeleton,
  setLoading,
  loading,
  setModalOpen,
}) => {
  const data = JSON.parse(sessionStorage.getItem("settings"));

  const [categoryData, setCategoryData] = useState({
    title: "",
    description: "",
    icon: "",
  });

  const handleCreateCategory = async () => {
    setLoading(true);
    let method = "POST";
    let url = "governify/admin/serviceCategories/create";
    let payload = JSON.stringify(categoryData);
    try {
      const response = await fetcher(url, method, payload);
      if (response.status) {
        setShowSkeleton(true);
        setModalOpen(false);
        toast.success("Category Created Successfully.");
        setCategoryData({
          title: "",
          description: "",
          icon: "",
        });
      } else {
        toast.error(response.message);
      }
    } catch (err) {
      toast.error("Error");
      console.log(err, "error");
    }
    setLoading(false);
  };

  return (
    <div
      title="status visibility manage"
      style={{ maxWidth: "550px", width: "100%", marginTop: "25px" }}
    >
      <div>
        <div
          className="text-white"
          style={{ backgroundColor: data.head_title_color }}
        >
          <p
            className="p-2 m-0 fs-5"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <strong>Create Category</strong>
            <span style={{ display: "flex", alignItems: "center" }}>
              <a
                className="fs_14"
                style={{ textDecoration: "none" }}
                target="_blank"
                rel="noreferrer"
                href="https://icons.getbootstrap.com/"
              >
                Go to Icon's library{" "}
              </a>
            </span>
          </p>
        </div>
        <div
          className="form_wrapper border border-success p-4 primary-shadow"
          style={{ overflowY: "auto" }}
        >
          <div>
            <Input
              placeholder="Category Title"
              value={categoryData.title}
              onChange={(e) =>
                setCategoryData({ ...categoryData, title: e.target.value })
              }
              addonBefore="Title"
            />
          </div>
          <div>
            <Input
              placeholder="Category Icon"
              className="mt-16"
              value={categoryData.icon}
              onChange={(e) =>
                setCategoryData({ ...categoryData, icon: e.target.value })
              }
              addonBefore="Icon"
            />
          </div>
          <div>
            <Input
              placeholder="Category Description"
              className="mt-16"
              value={categoryData.description}
              onChange={(e) =>
                setCategoryData({
                  ...categoryData,
                  description: e.target.value,
                })
              }
              addonBefore="Description"
            />
          </div>
          <div
            className="mt-16"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <Button
              style={{
                background: data.button_bg,
                color: "#fff",
                border: "none",
              }}
              className="fw-700"
              onClick={handleCreateCategory}
              loading={loading}
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
