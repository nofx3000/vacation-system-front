import React, { useEffect } from "react";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import {
  selectPeopleInfoWithEverything,
  getPeopleInfoWithEverythingAsync,
} from "../../store/slices/peopleSlice";
import { PersonInfoWithEverythingInter } from "../../interface/PeopleInterface";

const columns: ColumnsType<PersonInfoWithEverythingInter> = [
  {
    title: "姓名",
    dataIndex: "name",
    key: "name",
    render: (_, personeInfo) => <a>{personeInfo.name}</a>,
  },
  {
    title: "中队",
    dataIndex: "division",
    key: "division",
    render: (_, personeInfo) => (
      <a>{personeInfo.division ? personeInfo.division.name : null}</a>
    ),
  },
  {
    title: "应休天数",
    dataIndex: "total_holiday",
    key: "total_holiday",
    render: (_, personeInfo) => <a>{personeInfo.total_holiday}</a>,
  },
  {
    title: "已休天数",
    dataIndex: "spent",
    key: "spent",
    render: (_, personeInfo) => <a>{personeInfo.spent}</a>,
  },
  {
    title: "休假次数",
    dataIndex: "times",
    key: "times",
    render: (_, personeInfo) => <a>{personeInfo.record.length}</a>,
  },
];

const calcSpent = (
  peopleInfo: PersonInfoWithEverythingInter[]
): PersonInfoWithEverythingInter[] => {
  // 1.计算每个人的已休假天数（遍历个人phases）(在原数据上添加新属性spent，并返回新的数据)
  const newPeopleInfo = peopleInfo.map((personinfo) => {
    let spent: number = 0;
    personinfo.record.forEach((_record) => {
      _record.phase.forEach((_phase) => {
        let duration =
          new Date(_phase.end_at as Date).valueOf() -
          new Date(_phase.start_at as Date).valueOf();
        duration = Math.floor(duration / 1000 / 60 / 60 / 24) + 1;
        spent += duration;
      });
      spent -= _record.discount ? _record.discount : 0;
    });
    return Object.assign({}, personinfo, { spent });
  });
  return newPeopleInfo;
};

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const peopleInfo: PersonInfoWithEverythingInter[] = useSelector(
    selectPeopleInfoWithEverything
  );
  useEffect(() => {
    dispatch(getPeopleInfoWithEverythingAsync());
  }, [dispatch]);

  const data: PersonInfoWithEverythingInter[] = calcSpent(peopleInfo);
  return <Table columns={columns} dataSource={data} />;
};

export default App;
