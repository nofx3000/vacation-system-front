import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import {
  getTodayPhasesAsync,
  selecTodayPhases,
  getAllInfoAsync,
  selecAllInfo,
} from "../../store/slices/phaseSlice";
import { Card, Col, Table, Row, Progress } from "antd";
import { App as globalAntd } from "antd";
import type { ColumnsType } from "antd/es/table";
import style from "./home.module.scss";
import { TodayPhaseInter } from "../../interface/PhaseInterface";
import MyProgress from "../../components/Progress/Progress";
import dateformat from "dateformat";
import { AllInfoInter } from "../../interface/AllInfoInterface";

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
      <MyProgress percent={calcPercent(phase.start_at, phase.end_at).percent}>
        <span style={{ marginRight: "1vw" }}>
          {dateformat(phase.start_at, "yyyy-mm-dd")}——
          {dateformat(phase.end_at, "yyyy-mm-dd")}
        </span>
        <span>
          {"(" +
            calcPercent(phase.start_at, phase.end_at).spent +
            "天/" +
            calcPercent(phase.start_at, phase.end_at).duration +
            "天)"}
        </span>
      </MyProgress>
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

const calcPercent = (
  start: any,
  end: any
): { percent: number; duration: number; spent: number } => {
  let duration = new Date(end).valueOf() - new Date(start).valueOf();
  duration = duration / 1000 / 60 / 60 / 24 + 1;
  let spent = new Date().valueOf() - new Date(start).valueOf();
  spent = Math.floor(spent / 1000 / 60 / 60 / 24 + 1);
  const percent = Math.ceil((spent / duration) * 100);
  console.log(duration, spent, percent);
  return { percent, duration, spent };
};

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const staticFunction = globalAntd.useApp();
  const message = staticFunction.message;
  const todayPhases: TodayPhaseInter[] = useSelector(selecTodayPhases);
  const allInfo: AllInfoInter = useSelector(selecAllInfo);
  const data: TodayPhaseInter[] = todayPhases;
  useEffect(() => {
    dispatch(getTodayPhasesAsync());
    dispatch(getAllInfoAsync());
    console.log(todayPhases);
  }, [dispatch]);

  return (
    <>
      <Row>
        <Col span={18}>
          <Card className={style.card}>
            <span className={style.title}>当前休假信息一览表</span>
            <Table
              columns={columns}
              dataSource={data}
              className={style.table}
            />
          </Card>
        </Col>
        <Col span={6} className={style["dashboard-area"]}>
          <Card className={style.dashboard}>
            <p>干部休假率</p>
            <Progress strokeLinecap="butt" type="circle" percent={75} />
          </Card>
          <Card className={style.dashboard}>
            <p>战士休假率</p>
            <Progress strokeLinecap="butt" type="circle" percent={75} />
          </Card>
          <Card className={style.dashboard}>
            <p>文职休假率</p>
            <Progress strokeLinecap="butt" type="circle" percent={75} />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default App;
