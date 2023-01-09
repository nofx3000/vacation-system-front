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
                <span>
                  {(item.start_at as Date).valueOf()}——
                  {(item.end_at as Date).valueOf()}:{item.destination}{" "}
                  {item.address}
                </span>
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
        {(props.records as any).map((record: RecordInter) => {
          return renderTimelineItem(record);
        })}
      </Timeline>
    </>
  );
};

export default App;
