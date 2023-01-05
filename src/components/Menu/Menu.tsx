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

interface StringToIconInter {
  [IconName: string]: ReactNode
}

const stringToIconMap: StringToIconInter = {
  "AppstoreOutlined": <AppstoreOutlined></AppstoreOutlined>,
  "ContainerOutlined": <ContainerOutlined></ContainerOutlined>,
  "DesktopOutlined": <DesktopOutlined></DesktopOutlined>,
  "MailOutlined": <MailOutlined></MailOutlined>
}

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const menuList: MenuItemInter[] = useSelector(selectMenuList);
  const [newList, setNewList] = useState<MenuItemInter[]>([])
  //   const [menuList, setMenuList] = useState<MenuItemInter[]>([])
  useEffect(() => {
    dispatch(getMenuListAsync());
    console.log(menuList);
  }, [dispatch]);
  useEffect(() => {
    const a = menuList.map((item) => {
      return Object.assign({}, item, {
        key: item.id,
        icon: stringToIconMap[(item.icon) as string]
      });
    });
    setNewList(a);
  }, [menuList]);
  return (
    <div style={{ width: 256 }}>
      <Menu
        defaultSelectedKeys={["1"]}
        defaultOpenKeys={["sub1"]}
        mode="inline"
        theme="dark"
        items={newList as any}
      />
    </div>
  );
};

export default App;
