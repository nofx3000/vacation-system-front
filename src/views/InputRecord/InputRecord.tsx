import React, { useEffect } from "react";
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
} from "../../store/slices/recordSlice";
import { Cascader, Layout } from "antd";
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

  const onPersonChange = (value: any) => {
    if (!value) {
      dispatch(resetTmpPhaseById());
      dispatch(setShowAdding(true));
      dispatch(changeRecordStatus("default"));
      dispatch(resetRecordsByPersonId());
      dispatch(resetCurrentPerson());
      return;
    }
    const id: number = value[1];
    dispatch(resetTmpPhaseById());
    dispatch(setShowAdding(true));
    dispatch(changeRecordStatus("default"));
    dispatch(getRecordsByPersonIdAsync(id));
    dispatch(setCurrentPersonId(id));
  };

  useEffect(() => {
    dispatch(getPeopleInfoListAsync());
  }, [dispatch]);

  const formatPeopleInfo = (
    arr: DivisionInter[] | PersonInfoInter[]
  ): Option[] | any => {
    if (arr.length < 1) return
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

  return (
    <>
      <Layout>
        <Header className={style.header}>
          <span>选择休假人: </span>
          <Cascader
            options={formatPeopleInfo(peopleinfo)}
            onChange={onPersonChange}
            placeholder="Please select"
          />
        </Header>
        <Layout>
          <Content className={style.content}>
            <Record></Record>
          </Content>
          <Sider theme="light" className={style.sider}>
            {recordsByPersonId.length > 0 ? (
              <TimeLine records={recordsByPersonId}></TimeLine>
            ) : (
              <span>暂无休假记录</span>
            )}
          </Sider>
        </Layout>
      </Layout>
    </>
  );
};

export default App;
