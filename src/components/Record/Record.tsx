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
  selectRecordStatus,
  selectTmpPhaseGroup,
  selectCurrentPersonId,
  setCurrentPersonId,
  resetTmpPhaseById,
  resetRecordsByPersonId,
} from "../../store/slices/recordSlice";
import { Cascader, Layout, Card, Button, InputNumber } from "antd";
import { PersonInfoInter } from "../../interface/PeopleInterface";
import { DivisionInter } from "../../interface/DivisionInterface";
import { RecordInter, PhaseInter } from "../../interface/RecordInterface";
import TimeLine from "../TimeLine/TimeLine";
import { App as globalAntd } from "antd";
import Phase from "../Phase/Phase";
import axios from "axios";
const { Header, Sider, Content } = Layout;

interface Option {
  value: string | number;
  label: string;
  children?: any[];
}

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const staticFunction = globalAntd.useApp();
  const message = staticFunction.message;
  const peopleinfo: PersonInfoInter[] = useSelector(selectPeopleInfoByDivison);
  const recordsByPersonId: RecordInter[] = useSelector(selectRecordsByPersonId);
  const recordStatus: "default" | "add" | "edit" =
    useSelector(selectRecordStatus);
  const tmpPhaseGroup: PhaseInter[] = useSelector(selectTmpPhaseGroup);
  const currentPersonId: number | undefined = useSelector(
    selectCurrentPersonId
  );
  const [showAdding, setShowAdding] = useState(true);
  const [discount, setDiscount] = useState<number | null>(0);
  const [vacationLength, setVacationLength] = useState(0);
  const [spent, setSpent] = useState(0);

  const onDiscountChange = (value: number | null): void | undefined => {
    setDiscount(value);
  };

  const onPersonChange = (value: any) => {
    if (!value) {
      dispatch(resetTmpPhaseById());
      setShowAdding(true);
      dispatch(changeRecordStatus("default"));
      dispatch(resetRecordsByPersonId());
      return;
    }
    const id: number = value[1];
    dispatch(getRecordsByPersonIdAsync(id));
    dispatch(setCurrentPersonId(id));
    dispatch(resetTmpPhaseById());
    setShowAdding(true);
    dispatch(changeRecordStatus("default"));
  };

  useEffect(() => {
    dispatch(getPeopleInfoListAsync());
  }, [dispatch]);

  useEffect(() => {
    setSpent(vacationLength - (discount as number));
  }, [vacationLength, discount]);

  const calcVacationLength = (phaseGroup: PhaseInter[]) => {
    let duration: number;
    let total: number = 0;
    phaseGroup.forEach((phase) => {
      duration =
        (phase["end_at"] as Date).valueOf() -
        (phase["start_at"] as Date).valueOf();
      duration = duration / 1000 / 60 / 60 / 24 + 1;
      total += duration;
      setVacationLength(total);
    });
  };

  useEffect(() => {
    setVacationLength(0);
    console.log("phase group changed");
    calcVacationLength(tmpPhaseGroup);
  }, [tmpPhaseGroup]);

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

  const addRecord = () => {
    dispatch(changeRecordStatus("add"));
  };

  const showPhaseForm = () => {
    if (tmpPhaseGroup.length >= 3) {
      message.error("休假日程不能超过3段");
      return;
    }
    setShowAdding(false);
    console.log(tmpPhaseGroup);
  };

  const submitRecord = async () => {
    if (tmpPhaseGroup.length < 1) {
      message.error("请添加日程");
      return;
    }
    const data: RecordInter = {
      person_id: currentPersonId as number,
      discount: discount as number,
      phase: tmpPhaseGroup,
    };
    const res = await axios.post("/record/add", data);
    console.log(res.data);
    if (res.data.message) {
      message.error(res.data.message);
    }
    dispatch(getRecordsByPersonIdAsync(currentPersonId as number));
    setShowAdding(true);
    dispatch(changeRecordStatus("default"));
    dispatch(resetTmpPhaseById());
    message.success("添加成功");
  };

  const render = () => {
    if (recordStatus === "default") {
      if (currentPersonId) {
        return <span onClick={addRecord}>+添加休假记录</span>;
      } else {
        return <span>请选择休假人</span>;
      }
    } else {
      return (
        <div>
          {tmpPhaseGroup.map((phase, index) => {
            return (
              <Phase
                initialStatus="default"
                indexInTmpGroup={index}
                phaseData={phase}
                key={Math.random()}
                showAddingButton={() => {
                  setShowAdding(true);
                }}
              ></Phase>
            );
          })}
          {showAdding ? (
            <div onClick={showPhaseForm}>+</div>
          ) : (
            <Phase
              initialStatus="add"
              key={Math.random()}
              showAddingButton={() => {
                setShowAdding(true);
              }}
            ></Phase>
          )}
          <p>休假天数: {vacationLength}天</p>
          <span>
            减免假期天数：
            <InputNumber
              min={0}
              max={vacationLength}
              onChange={onDiscountChange}
              defaultValue={0}
            ></InputNumber>
            天
          </span>
          <p>实际扣除天数: {spent}天</p>
          <div>
            <Button type="primary" onClick={submitRecord}>
              提交休假记录
            </Button>
            <Button type="primary" danger>
              放弃提交
            </Button>
          </div>
        </div>
      );
    }
  };
  return (
    <>
      <Card>{render()}</Card>
    </>
  );
};

export default App;
