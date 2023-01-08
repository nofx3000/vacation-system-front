import React, { useEffect, ReactNode } from "react";
import { SmileOutlined } from "@ant-design/icons";
import { Timeline } from "antd";
import { RecordInter, PhaseInter } from "../../interface/RecordInterface";
import TimelineItem from "antd/es/timeline/TimelineItem";

interface TimeLineProps {
  records?: RecordInter[];
}

const App: React.FC<TimeLineProps> = (props: TimeLineProps) => {
  useEffect(() => {
    console.log(props.records);
  }, [props]);

  const renderTimelineItem = (record: RecordInter): ReactNode => {
    if (record.phase) {
      return (
        <Timeline.Item color="green" key={record.id}>
          {record.phase.map((item) => {
            return (
              <div>
                <span>{item.destination}</span>
                <span>{item.start_at.valueOf()}</span>
                <span>{item.end_at.valueOf()}</span>
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
      {props.records ? (
        <Timeline>
          {(props.records as any).map((record: RecordInter) => {
            return renderTimelineItem(record);
          })}
        </Timeline>
      ) : (
        <div>无</div>
      )}
    </>
  );
};

export default App;
