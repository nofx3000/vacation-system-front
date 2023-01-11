import React, { useEffect } from "react";
import { Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import { selecAllInfo, getAllInfoAsync } from "../../store/slices/phaseSlice";
import { AllInfoInter } from "../../interface/AllInfoInterface";
import dateformat from "dateformat";

const columns: ColumnsType<AllInfoInter> = [
  {
    title: "姓名",
    dataIndex: "name",
    key: "name",
    render: (_, allInfo) => <a>{1}</a>,
  },
];

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const allInfo: AllInfoInter = useSelector(selecAllInfo);
  useEffect(() => {
    dispatch(getAllInfoAsync());
  }, [dispatch]);

  const data: AllInfoInter = allInfo;
  return <Table columns={columns} dataSource={data} />;
};

export default App;
