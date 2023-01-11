import React, { ReactNode } from "react";
import { Progress } from "antd";
import style from "./progress.module.scss";

interface ProgressProps {
  percent: number;
  children: ReactNode;
}

const App: React.FC<ProgressProps> = (props) => {
  const { percent, children } = props;
  return (
    <>
      <p className={style.info}>{children}</p>
      <Progress
        percent={percent}
        status="normal"
        strokeColor={{ "0%": "#108ee9", "100%": "#87d068" }}
      ></Progress>
    </>
  );
};

export default App;
