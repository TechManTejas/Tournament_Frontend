import {
  clearUserDataFromStorage,
  getUserDataFromStorage,
} from "../utils/storage";
import { Button } from "antd";
import { LogoutOutlined } from "@ant-design/icons";

export const Profile = () => {
  const handleLogout = () => {
    clearUserDataFromStorage();
    window.location.href = "/";
  };

  const user = getUserDataFromStorage()?.user;

  return (
    <div className="flex items-center justify-center min-h-full">
      <div className="flex flex-col  w-[500px] bg-white">
        <div className="flex items-center justify-between p-4 bg-gray-900 text-white">
          <div className="flex items-center ">
            <i className="fa-regular fa-circle-user text-2xl pr-2"></i>
            <p className="text-2xl">{user?.username}</p>
          </div>

          <Button
            icon={<LogoutOutlined />}
            danger
            type="dashed"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>

        <hr />

        <div className="px-4">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center">
              <i className="fa-regular fa-user text-xl pr-4"></i>
              <p className="text-gray-500">Full Name</p>
            </div>
            <p className="text-xs bg-green-500 p-2 text-white px-4 rounded-2xl">
              {user?.first_name} {user?.last_name}
            </p>
          </div>

          <hr />

          <div className="flex items-center justify-between py-2">
            <div className="flex items-center">
              <i className="fa-regular fa-paper-plane text-xl pr-4"></i>
              <p className="text-gray-500">Email Address</p>
            </div>
            <p className="text-xs bg-green-500 p-2 text-white px-4 rounded-2xl">
              {user?.email}
            </p>
          </div>

          <hr />

          <div className="flex  items-center justify-between py-2">
            <div className="flex items-center">
              <i className="fa-regular fa-flag text-xl pr-4"></i>
              <p className="text-gray-500">Your Role</p>
            </div>
            <p className="text-xs bg-green-500 p-2  text-white px-4 rounded-2xl">
              {user?.role}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
