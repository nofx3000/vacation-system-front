import React, { ReactNode, useEffect, useState } from "react";
import {
  AppstoreOutlined,
  ContainerOutlined,
  DesktopOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import { Button, Menu } from "antd";
import type { MenuProps } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import { selectMenuList, getMenuListAsync } from "../../store/slices/menuSlice";
interface MenuItemInter {
  id: number;
  label: string;
  path: string;
  icon: string | ReactNode;
  type?: string;
  children?: any;
  key?: number;
}

const items: MenuProps["items"] = [];

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const menuList: MenuItemInter[] = useSelector(selectMenuList);
  //   const [menuList, setMenuList] = useState<MenuItemInter[]>([])
  useEffect(() => {
    dispatch(getMenuListAsync());
    console.log(menuList);
  }, [dispatch]);
  useEffect(() => {
    console.log("menuList changed", menuList);
    menuList.map((item) => {
      item.key = item.id;
      return item;
    });
  }, [menuList]);
  return (
    <div style={{ width: 256 }}>
      <Menu
        defaultSelectedKeys={["1"]}
        defaultOpenKeys={["sub1"]}
        mode="inline"
        theme="dark"
        items={menuList as any}
      />
    </div>
  );
};

export default App;
