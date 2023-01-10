import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import { getPeopleInfoListAsync } from "../../store/slices/peopleSlice";
import {
  getRecordsByPersonIdAsync,
  changeRecordStatus,
  selectRecordStatus,
  selectTmpPhaseGroup,
  selectCurrentPersonId,
  resetTmpPhaseById,
  setShowAdding,
  selectShowAdding,
  selectRecordId,
  resetRecordId,
} from "../../store/slices/recordSlice";
import { Card, Button, InputNumber, Popconfirm } from "antd";
import { RecordInter, PhaseInter } from "../../interface/RecordInterface";
import { App as globalAntd } from "antd";
import Phase from "../Phase/Phase";
import axios from "axios";

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const staticFunction = globalAntd.useApp();
  const message = staticFunction.message;
  const recordStatus: "default" | "add" | "edit" =
    useSelector(selectRecordStatus);
  const showAdding: boolean = useSelector(selectShowAdding);
  const tmpPhaseGroup: PhaseInter[] = useSelector(selectTmpPhaseGroup);
  const currentPersonId: number | undefined = useSelector(
    selectCurrentPersonId
  );
  const record_id: number | undefined = useSelector(selectRecordId);
  const [discount, setDiscount] = useState<number | null>(0);
  const [vacationLength, setVacationLength] = useState(0);
  const [spent, setSpent] = useState(0);

  const onDiscountChange = (value: number | null): void | undefined => {
    setDiscount(value);
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
        new Date(phase["end_at"] as Date).valueOf() -
        new Date(phase["start_at"] as Date).valueOf();
      duration = Math.floor(duration / 1000 / 60 / 60 / 24) + 1;
      // 不计算带有delete_tage的休假天数
      total += phase["delete_tag"] ? 0 : duration;
      setVacationLength(total);
    });
  };

  useEffect(() => {
    setVacationLength(0);
    calcVacationLength(tmpPhaseGroup);
  }, [tmpPhaseGroup]);

  const addRecord = () => {
    dispatch(changeRecordStatus("add"));
  };

  const showPhaseForm = () => {
    if (tmpPhaseGroup.length >= 3) {
      message.error("休假日程不能超过3段");
      return;
    }
    dispatch(setShowAdding(false));
    console.log(tmpPhaseGroup);
  };

  const submitRecord = async () => {
    // 遍历tmpPhaseGroup，计算不算带delete_tag的phase数量
    let count = 0;
    for (let i = 0; i < tmpPhaseGroup.length; i++) {
      if (tmpPhaseGroup[i]["delete_tag"]) continue;
      count++;
    }
    if (count < 1) {
      message.error("请添加日程");
      return;
    }
    const data: RecordInter = {
      person_id: currentPersonId as number,
      discount: discount as number,
      phase: tmpPhaseGroup,
      duration: vacationLength,
    };
    let res: any;
    if (recordStatus === "add") {
      res = await axios.post("/record/add", data);
    }
    if (recordStatus === "edit") {
      res = await axios.put(`/record/${record_id as number}`, data);
    }
    // 修改当前休假人的spent_vacation
    // await axios.patch(`/people/${currentPersonId}/${currentPersonInfo.spent_holiday + }`)
    if (res.data.message) {
      message.error(res.data.message);
    }
    // 刷新Timeline
    dispatch(getRecordsByPersonIdAsync(currentPersonId as number));
    // 关闭表单，显示添加日程
    dispatch(setShowAdding(true));
    // 关闭添加或编辑，显示添加休假记录
    dispatch(changeRecordStatus("default"));
    // 重置tmpPhaseGroup
    dispatch(resetTmpPhaseById());
    if (recordStatus === "edit") {
      // 重置recordId为undefined
      dispatch(resetRecordId());
    }
    message.success("修改成功");
  };

  const submitAddRecordAbandon = () => {
    dispatch(setShowAdding(true));
    dispatch(changeRecordStatus("default"));
    dispatch(resetTmpPhaseById());
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
                  dispatch(setShowAdding(true));
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
                dispatch(setShowAdding(true));
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
            {recordStatus === "add" ? (
              <>
                <Button type="primary" onClick={submitRecord}>
                  提交休假记录
                </Button>
                <Popconfirm
                  placement="top"
                  title="放弃提交休假记录"
                  description="放弃后数据将不会被保存"
                  onConfirm={submitAddRecordAbandon}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button type="primary" danger>
                    放弃提交
                  </Button>
                </Popconfirm>
              </>
            ) : (
              <>
                <Button type="primary" onClick={submitRecord}>
                  提交休假记录
                </Button>
                <Popconfirm
                  placement="top"
                  title="放弃提交休假记录"
                  description="放弃后数据将不会被保存"
                  onConfirm={submitAddRecordAbandon}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button type="primary" danger>
                    放弃提交
                  </Button>
                </Popconfirm>
              </>
            )}
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
