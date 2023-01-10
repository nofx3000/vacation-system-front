import React, { useEffect, ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import { Timeline, Tag, Button, Popconfirm } from "antd";
import { RecordInter } from "../../interface/RecordInterface";
import { App as globalAntd } from "antd";
import {
  getRecordByIdAsync,
  changeRecordStatus,
  getRecordsByPersonIdAsync,
  selectCurrentPersonId,
  setShowAdding
} from "../../store/slices/recordSlice";
import axios from "axios";
import style from './timeline.module.scss'

interface TimeLineProps {
  records?: RecordInter[];
}

const App: React.FC<TimeLineProps> = (props: TimeLineProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const staticFunction = globalAntd.useApp();
  const message = staticFunction.message;
  const currentPersonId = useSelector(selectCurrentPersonId);
  const formatDate = (date: any) => {
    return date.slice(0, 10);
  };

  const getPhaseStatus = (start_at: Date, end_at: Date): ReactNode => {
    const now: number = new Date().valueOf();
    const start: number = new Date(start_at).valueOf();
    const end: number = new Date(end_at).valueOf();
    if (now < start) {
      return <Tag color="blue">未开始</Tag>;
    } else if (now > end) {
      return <Tag>已结束</Tag>;
    } else {
      return <Tag color="green">进行中</Tag>;
    }
  };

  const handleEditRecord = (id: number) => {
    dispatch(getRecordByIdAsync(id));
    dispatch(changeRecordStatus("edit"));
    dispatch(setShowAdding(true))
  };

  const handleDeleteRecord = async (id: number) => {
    const res = await axios.delete(`/record/${id}`);
    if (res.data.message) {
      message.error(res.data.message);
    }
    dispatch(getRecordsByPersonIdAsync(currentPersonId as number));
    message.success("删除成功");
  };

  const renderTimelineItem = (
    record: RecordInter,
    index: number
  ): ReactNode => {
    if (record.phase) {
      return (
        <Timeline.Item color="green" key={record.id}>
            第{index + 1}次休假{" "}
            <div className={style["btn-area"]}>
              <Button
              size="small"
              type="primary"
              onClick={() => {
                handleEditRecord(record.id as number);
              }}
            >
              修改
            </Button>
            <Popconfirm
              placement="top"
              title="删除休假记录"
              description="记录删除后无法找回"
              onConfirm={() => {
                handleDeleteRecord(record.id as number);
              }}
              okText="Yes"
              cancelText="No"
            >
              <Button size="small" type="primary" danger>
                删除
              </Button>
            </Popconfirm>
            
          </div>
          {record.phase.map((item) => {
            return (
              <div key={item.id}>
                <p>
                  {formatDate((item.start_at as Date).valueOf())}——
                  {formatDate((item.end_at as Date).valueOf())}:{" "}
                  {getPhaseStatus(item.start_at as Date, item.end_at as Date)}
                </p>
                <p>
                  {item.destination} {item.address}
                </p>
              </div>
            );
          })}
        </Timeline.Item>
      );
    } else {
      return (
        <Timeline.Item color="green" key={record.id}>
          <span>无日程</span>
        </Timeline.Item>
      );
    }
  };

  return (
    <>
      <Timeline>
        {(props.records as any).map((record: RecordInter, index: number) => {
          return renderTimelineItem(record, index);
        })}
      </Timeline>
    </>
  );
};

export default App;
