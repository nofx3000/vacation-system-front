import React from "react";
import { Layout } from "antd";
import style from "./index.module.scss";
import { Outlet } from "react-router-dom";

const { Header, Sider, Content } = Layout;

const App: React.FC = () => {
  return (
    <Layout>
      <Header className={style.header}>Header</Header>
      <Layout>
        <Sider className={style.sider}>Sider</Sider>
        <Content className={style.content}>
          <Outlet></Outlet>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
