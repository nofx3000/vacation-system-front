import React, { ReactNode } from "react";
import { Progress } from "antd";

interface ProgressProps {
  percent: number;
  children: ReactNode;
}

const App: React.FC<ProgressProps> = (props) => {
  const { percent, children } = props;
  return (
    <>
      <p>{children}</p>
      <Progress percent={percent} />
      {/* <Progress percent={50} status="active" /> */}
      {/* <Progress percent={70} status="exception" /> */}
    </>
  );
};

export default App;
