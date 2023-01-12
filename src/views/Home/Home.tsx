import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import {
  getTodayPhasesAsync,
  selecTodayPhases,
} from "../../store/slices/phaseSlice";
import {
  selectPeopleInfoWithEverything,
  getPeopleInfoWithEverythingAsync,
} from "../../store/slices/peopleSlice";
import { Card, Col, Table, Row, Progress } from "antd";
import { App as globalAntd } from "antd";
import type { ColumnsType } from "antd/es/table";
import style from "./home.module.scss";
import { TodayPhaseInter } from "../../interface/PhaseInterface";
import { PersonInfoWithEverythingInter } from "../../interface/PeopleInterface";
import MyProgress from "../../components/Progress/Progress";
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
  return { percent, duration, spent };
};

const getLeaveRate = (
  peopleInfo: PersonInfoWithEverythingInter[]
): {
  officer: number;
  sergent: number;
  civilian: number;
} => {
  // 1.分别统计干部、战士、文职的总应休天数
  // 2.分别统计干部、战士、文职的总已休假天数
  // 3.返回休假率
  let officer_total: number = 0;
  let sergent_total: number = 0;
  let civilian_total: number = 0;
  let officer_spent: number = 0;
  let sergent_spent: number = 0;
  let civilian_spent: number = 0;
  peopleInfo.map((personinfo) => {
    let spent: number = 0;
    personinfo.record.map((_record) => {
      return _record.phase.map((_phase) => {
        let duration =
          new Date(_phase.end_at as Date).valueOf() -
          new Date(_phase.start_at as Date).valueOf();
        duration = Math.floor(duration / 1000 / 60 / 60 / 24) + 1;
        spent += duration;
        return _phase;
      });
    });
    // 统计应休与已休天数
    if (personinfo.catagory === 0) {
      // 干部
      officer_total += personinfo.total_holiday as number;
      officer_spent += spent;
    } else if (personinfo.catagory === 1) {
      // 战士
      sergent_total += personinfo.total_holiday as number;
      sergent_spent += spent;
    } else {
      // 文职
      civilian_total += personinfo.total_holiday as number;
      civilian_spent += spent;
    }
    return personinfo;
  });
  return {
    officer: Math.ceil((officer_spent / officer_total) * 100),
    sergent: Math.ceil((sergent_spent / sergent_total) * 100),
    civilian: Math.ceil((civilian_spent / civilian_total) * 100),
  };
};

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const staticFunction = globalAntd.useApp();
  const message = staticFunction.message;
  const todayPhases: TodayPhaseInter[] = useSelector(selecTodayPhases);
  const data: TodayPhaseInter[] = todayPhases;
  const peopleInfo: PersonInfoWithEverythingInter[] = useSelector(
    selectPeopleInfoWithEverything
  );

  useEffect(() => {
    dispatch(getTodayPhasesAsync());
    dispatch(getPeopleInfoWithEverythingAsync());
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
            <Progress
              strokeLinecap="butt"
              type="circle"
              percent={getLeaveRate(peopleInfo).officer}
            />
          </Card>
          <Card className={style.dashboard}>
            <p>战士休假率</p>
            <Progress
              strokeLinecap="butt"
              type="circle"
              percent={getLeaveRate(peopleInfo).sergent}
            />
          </Card>
          <Card className={style.dashboard}>
            <p>文职休假率</p>
            <Progress
              strokeLinecap="butt"
              type="circle"
              percent={getLeaveRate(peopleInfo).civilian}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default App;
