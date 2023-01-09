import React, { useEffect, ReactNode } from "react";
import { SmileOutlined } from "@ant-design/icons";
import { Timeline, Tag } from "antd";
import { RecordInter, PhaseInter } from "../../interface/RecordInterface";
import TimelineItem from "antd/es/timeline/TimelineItem";

interface TimeLineProps {
  records?: RecordInter[];
}

const App: React.FC<TimeLineProps> = (props: TimeLineProps) => {
  useEffect(() => {
    console.log(props.records);
  }, [props]);

  const formatDate = (date: any) => {
    return date.slice(0, 10)
  }

  const getPhaseStatus = (start_at: Date, end_at: Date): ReactNode => {
    const now: number = new Date().valueOf()
    const start: number = new Date(start_at).valueOf()
    const end: number = new Date(end_at).valueOf()
    console.log(now, start, end);
    
    if (now < start ) {
      return <Tag color="blue">未开始</Tag>
    } else if ( now > end ) {
      return <Tag>已结束</Tag>
    } else {
      return <Tag color="green">进行中</Tag>
    }
  }

  const renderTimelineItem = (record: RecordInter, index: number): ReactNode => {
    if (record.phase) {
      return (
        <Timeline.Item color="green" key={record.id}>
          <p>第{index + 1}次休假</p>
          {record.phase.map((item) => {
            return (
              <div key={item.id}>
                <p>
                  {formatDate((item.start_at as Date).valueOf())}——
                  {formatDate((item.end_at as Date).valueOf())}: {getPhaseStatus(item.start_at as Date, item.end_at as Date)}
                </p>
                <p>
                {item.destination}{" "}{item.address}
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
        {(props.records as any).map((record: RecordInter, index: number) => 
        {
          return renderTimelineItem(record, index);
        })}
      </Timeline>
    </>
  );
};

export default App;
