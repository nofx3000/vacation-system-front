import React from "react";
import { Layout } from "antd";
import style from "./index.module.scss";

const { Header, Footer, Sider, Content } = Layout;

const App: React.FC = () => {
  return (
    <Layout>
      <Header>Header</Header>
      <Layout>
        <Sider>Sider</Sider>
        <Content>Content</Content>
      </Layout>
      <Footer>Footer</Footer>
    </Layout>
  );
};

export default App;
