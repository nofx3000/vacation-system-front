import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import {
  getTodayPhasesAsync,
  selecTodayPhases,
} from "../../store/slices/phaseSlice";
import { Card, Row, Col, Space, Table, Tag } from "antd";
import { App as globalAntd } from "antd";
import type { ColumnsType } from "antd/es/table";
import style from "./home.module.scss";
import { TodayPhaseInter } from "../../interface/PhaseInterface";
import Progress from "../../components/Progress/Progress";
import dateformat from "dateformat";

const columns: ColumnsType<TodayPhaseInter> = [
  {
    title: "姓名",
    dataIndex: "name",
    key: "name",
    render: (_, { record: { people } }) => <span>{people.name}</span>,
  },
  {
    title: "休假地点",
    dataIndex: "destination",
    key: "destination",
    render: (_, phase) => (
      <span>
        {phase.destination}——{phase.address}
      </span>
    ),
  },
  {
    title: "休假进度",
    dataIndex: "progress",
    key: "progress",
    render: (_, phase) => (
      <Progress percent={calcPercent(phase.start_at, phase.end_at)}>
        {dateformat(phase.start_at, "yyyy-mm-dd")}——
        {dateformat(phase.end_at, "yyyy-mm-dd")}
      </Progress>
    ),
  },
  {
    title: "电话",
    dataIndex: "tel",
    key: "tel",
    render: (_, phase) => <span>{phase.tel}</span>,
  },
  {
    title: "紧急联系人",
    dataIndex: "emergency_tel",
    key: "emergency_tel",
    render: (_, phase) => <span>{phase.emergency_tel}</span>,
  },
  {
    title: "备注",
    dataIndex: "comment",
    key: "comment",
    render: (_, phase) => <span>{phase.comment ? phase.comment : "无"}</span>,
  },
];

const calcPercent = (start: any, end: any): number => {
  let duration = new Date(end).valueOf() - new Date(start).valueOf();
  duration = duration / 1000 / 60 / 60 / 24 + 1;
  let spent = new Date().valueOf() - new Date(start).valueOf();
  spent = Math.floor(spent / 1000 / 60 / 60 / 24 + 1);
  const percent = Math.ceil((spent / duration) * 100);
  console.log(duration, spent, percent);
  return percent;
};

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const staticFunction = globalAntd.useApp();
  const message = staticFunction.message;
  const todayPhases: TodayPhaseInter[] = useSelector(selecTodayPhases);
  const data: TodayPhaseInter[] = todayPhases;
  useEffect(() => {
    dispatch(getTodayPhasesAsync());
    console.log(todayPhases);
  }, [dispatch]);

  return (
    <>
      <Col span={18}>
        <Card className={style.card}>
          <Table columns={columns} dataSource={data} />
        </Card>
      </Col>
      <Col span={6}></Col>
    </>
  );
};

export default App;
