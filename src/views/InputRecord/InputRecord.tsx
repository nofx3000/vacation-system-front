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
  changeRecordStatus,
  setCurrentPersonId,
  resetTmpPhaseById,
  resetRecordsByPersonId,
  setShowAdding,
  resetCurrentPerson,
  getPersonInfoAsync,
  selectCurrentPersonInfo,
  selectCurrentPersonId,
  setCurrentDivisionId,
  selectCurrentDivisionId,
} from "../../store/slices/recordSlice";
import { Cascader, Layout, Tag } from "antd";
import { PersonInfoInter } from "../../interface/PeopleInterface";
import { DivisionInter } from "../../interface/DivisionInterface";
import { RecordInter } from "../../interface/RecordInterface";
import TimeLine from "../../components/TimeLine/TimeLine";
import style from "./input-record.module.scss";
import Record from "../../components/Record/Record";
const { Header, Sider, Content } = Layout;

interface Option {
  value: string | number;
  label: string;
  children?: any[];
}

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const peopleinfo: PersonInfoInter[] = useSelector(selectPeopleInfoByDivison);
  const recordsByPersonId: RecordInter[] = useSelector(selectRecordsByPersonId);
  const currentPersonId = useSelector(selectCurrentPersonId);
  const currentDivisionId = useSelector(selectCurrentDivisionId);
  const currentPeronInfo = useSelector(selectCurrentPersonInfo);
  const onPersonChange = async (value: any) => {
    if (!value) {
      dispatch(resetTmpPhaseById());
      dispatch(setShowAdding(true));
      dispatch(changeRecordStatus("default"));
      dispatch(resetRecordsByPersonId());
      dispatch(resetCurrentPerson());
      return;
    }
    dispatch(resetTmpPhaseById());
    dispatch(setShowAdding(true));
    dispatch(changeRecordStatus("default"));
    dispatch(setCurrentDivisionId(value[0]));
    dispatch(getRecordsByPersonIdAsync(value[1]));
    dispatch(setCurrentPersonId(value[1]));
  };

  useEffect(() => {
    dispatch(getPeopleInfoListAsync());
    console.log(formatPeopleInfo(peopleinfo));
  }, [dispatch]);

  useEffect(() => {
    if (currentPersonId) {
      dispatch(getPersonInfoAsync(currentPersonId));
    }
  }, [currentPersonId]);
  const formatPeopleInfo = (
    arr: DivisionInter[] | PersonInfoInter[]
  ): Option[] | any => {
    if (arr.length < 1) return;
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

  const calcSpentVacation = (records: RecordInter[]) => {
    let spent = 0;
    records.forEach((record: RecordInter) => {
      spent += (record.duration as number) - (record.discount as number);
    });
    return spent;
  };

  return (
    <>
      <Layout>
        <Header className={style.header}>
          <span>???????????????: </span>
          <Cascader
            defaultValue={
              currentDivisionId && currentPersonId
                ? [currentDivisionId, currentPersonId]
                : undefined
            }
            options={formatPeopleInfo(peopleinfo)}
            onChange={onPersonChange}
            placeholder="Please select"
          />
          <Tag>
            ?????????????????????
            {currentPeronInfo?.total_holiday
              ? currentPeronInfo?.total_holiday
              : ""}
            ???
          </Tag>
          <Tag>??????????????????{calcSpentVacation(recordsByPersonId)}???</Tag>
        </Header>
        <Layout>
          <Content className={style.content}>
            <Record></Record>
          </Content>
          <Sider theme="light" className={style.sider}>
            {recordsByPersonId.length > 0 ? (
              <TimeLine records={recordsByPersonId}></TimeLine>
            ) : (
              <span>??????????????????</span>
            )}
          </Sider>
        </Layout>
      </Layout>
    </>
  );
};

export default App;
