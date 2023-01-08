import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import {
  getPeopleInfoListAsync,
  selectPeopleInfoByDivison,
} from "../../store/slices/peopleSlice";
import {
  getRecordsByPersonIdAsync,
  selectRecordsByPersonId,
} from "../../store/slices/recordSlice";
import { Cascader, Layout } from "antd";
import { PersonInfoInter } from "../../interface/PeopleInterface";
import { DivisionInter } from "../../interface/DivisionInterface";
import TimeLine from "../../components/TimeLine/TimeLine";
import style from "./input-record.module.scss";
const { Header, Sider, Content } = Layout;

interface Option {
  value: string | number;
  label: string;
  children?: any[];
}

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const peopleinfo = useSelector(selectPeopleInfoByDivison);
  const recordsByPersonId = useSelector(selectRecordsByPersonId);

  const onChange = (value: any) => {
    const id = value[1];
    dispatch(getRecordsByPersonIdAsync(id));
  };

  const formatPeopleInfo = (
    arr: DivisionInter[] | PersonInfoInter[]
  ): Option[] | any => {
    return arr.map((data: DivisionInter | PersonInfoInter) => {
      if (!(data as any).people)
        return { value: data.id as number, label: data.name as string };
      const formatedPersonInfo: Option = {
        value: data.id as number,
        label: data.name as string,
        children: (data as any).people
          ? formatPeopleInfo((data as any).people)
          : null,
      };
      return formatedPersonInfo;
    });
  };

  useEffect(() => {
    dispatch(getPeopleInfoListAsync());
  }, [dispatch]);

  useEffect(() => {
    console.log(recordsByPersonId);
  }, [recordsByPersonId]);

  return (
    <>
      <Layout>
        <Header className={style.header}>
          <span>选择休假人: </span>
          <Cascader
            options={formatPeopleInfo(peopleinfo)}
            onChange={onChange}
            placeholder="Please select"
          />
        </Header>
        <Layout>
          <Content className={style.content}></Content>
          <Sider theme="light" className={style.sider}>
            <TimeLine records={recordsByPersonId}></TimeLine>
          </Sider>
        </Layout>
      </Layout>
    </>
  );
};

export default App;
