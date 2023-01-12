import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RangePickerProps } from "antd/es/date-picker";
import dayjs from "dayjs";
import { AppDispatch } from "../../store/store";
import { PhaseInter } from "../../interface/RecordInterface";
import {
  addTmpPhaseGroup,
  delTmpPhaseById,
  editTmpPhaseById,
  selectRecordId,
  setDeleteTag,
  selectTmpPhaseGroup,
} from "../../store/slices/recordSlice";
import {
  Button,
  Form,
  Input,
  Card,
  Col,
  Row,
  DatePicker,
  Popconfirm,
} from "antd";
import style from "./phase.module.scss";
import dateformat from "dateformat";
const { RangePicker } = DatePicker;

type PhaseStatusType = "default" | "add" | "edit";

interface PhaseProps {
  initialStatus: PhaseStatusType;
  showAddingButton: () => void;
  phaseData?: PhaseInter;
  indexInTmpGroup?: number;
}

const App: React.FC<PhaseProps> = (props) => {
  const dispatch = useDispatch<AppDispatch>();
  const [phaseStatus, setPhaseStatus] = useState<PhaseStatusType>(
    props.initialStatus
  );
  const [phaseId, setPhaseId] = useState<number | undefined>(undefined);
  const record_id: number | undefined = useSelector(selectRecordId);
  const tmpPhaseGroup = useSelector(selectTmpPhaseGroup);

  const formatPhase = (phase: any) => {
    // console.log(phase.time[0]["$d"] instanceof Date); // true
    phase["start_at"] = phase.time[0]["$d"];
    phase["end_at"] = phase.time[1]["$d"];
    delete phase.time;
    return phase;
  };

  const onFinish = (values: any) => {
    if (phaseStatus === "add") {
      const formatedPhase: PhaseInter = formatPhase(values);
      // 存储的日期形式是Date对象， valueOf得到时间戳（number）
      dispatch(addTmpPhaseGroup(formatedPhase));
      props.showAddingButton();
    } else if (phaseStatus === "edit") {
      values.id = phaseId;
      values["record_id"] = record_id;
      const formatedPhase: PhaseInter = formatPhase(values);
      dispatch(
        editTmpPhaseById({
          index: props.indexInTmpGroup,
          data: formatedPhase,
        })
      );
    }
  };

  const formatDate = (date: any) => {
    if (typeof date === "number") {
      // 添加或修改完的是时间戳number
      // return new Date(date).toString()
      return dateformat(new Date(date), "yyyy-mm-dd");
      // return moment(new Date(date), "YYYY-MM-DD")
    }
    return date.slice(0, 10);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const handleAddAbandon = () => {
    props.showAddingButton();
  };

  const handleEditPhase = (id: number) => {
    setPhaseStatus("edit");
    setPhaseId(id);
  };

  const handleDeletePhase = () => {
    const index = props.indexInTmpGroup;
    // 添加时删除直接从tmpPhaseGroup中删除
    if (phaseStatus === "add") {
      dispatch(delTmpPhaseById(index));
      return;
    }
    // 修改时删除把对应index的tmpPhase的delete_tag属性设成true
    if (phaseStatus === "default") {
      dispatch(setDeleteTag(index));
    }
  };

  const handleEditAbandon = () => {
    setPhaseStatus("default");
  };

  const calcDuration = (start_at: number, end_at: number) => {
    let duration: any;
    // if (typeof start_at === "string" && typeof end_at === "string") {
    //   return start_at;
    // }
    duration = end_at - start_at;
    duration = Math.floor(duration / 1000 / 60 / 60 / 24) + 1;
    // return duration;
    return duration;
  };

  // 返回禁用date之前的日期范围函数
  const getDisabledDate = () => {
    // 如果tmpPhaseGroup为空， 则不设置禁用日期
    if (tmpPhaseGroup.length < 1) {
      return undefined;
    }
    // 将tmpPhaseGroup的最后一个phase的结束日期设置为禁用日期的起点
    const disabledDate: RangePickerProps["disabledDate"] = (current) => {
      return current < dayjs(tmpPhaseGroup[tmpPhaseGroup.length - 1].end_at);
    };
    return disabledDate;
  };

  const render = (phaseStatus: PhaseStatusType) => {
    if (phaseStatus === "default") {
      let phaseData = props.phaseData as PhaseInter;
      return (
        <div>
          <Row>
            <Col span={12}>
              {formatDate((phaseData["start_at"] as Date).valueOf())} ——{" "}
              {formatDate((phaseData["end_at"] as Date).valueOf())}
            </Col>
            <Col span={12}>
              休假地点：{phaseData.destination}
              {phaseData.address}
            </Col>
          </Row>
          <Row>
            <Col span={12}>交通工具：{phaseData.traffic}</Col>
            <Col span={12}>电话：{phaseData.tel}</Col>
          </Row>
          <Row>
            <Col span={12}>紧急联系人电话： {phaseData.emergency_tel}</Col>
            <Col span={12}>
              共
              {calcDuration(
                (phaseData["start_at"] as Date).valueOf(),
                (phaseData["end_at"] as Date).valueOf()
              )}
              天
            </Col>
          </Row>
          <Row>
            <Col span={12}>备注：{phaseData.comment}</Col>
            <Col span={12}>
              <div className={style["btn-area"]}>
                <Button
                  type="primary"
                  onClick={() => {
                    handleEditPhase(phaseData.id as number);
                  }}
                >
                  修改
                </Button>
                <Popconfirm
                  placement="top"
                  title="删除日程"
                  description="删除后数据无法恢复"
                  onConfirm={handleEditAbandon}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button type="primary" onClick={handleDeletePhase} danger>
                    删除
                  </Button>
                </Popconfirm>
              </div>
            </Col>
          </Row>
        </div>
      );
    } else {
      return (
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={phaseStatus === "edit" ? props.phaseData : {}}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Row>
            <Col span={12}>
              <Form.Item
                label="休假地点"
                name="destination"
                rules={[{ required: true, message: "请选择休假地点!" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="详细地址"
                name="address"
                rules={[{ required: true, message: "请填写休假地址!" }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item
                label="休假时间"
                name="time"
                rules={[{ required: true, message: "请选择休假时间!" }]}
              >
                {/* 如果当前为add，禁用时间为tmpGroup里最后一个phase的结束时间，
                    如果当前为edit，则不进行禁用
                */}
                <RangePicker
                  disabledDate={
                    phaseStatus === "add" ? getDisabledDate() : () => false
                  }
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="联系电话"
                name="tel"
                rules={[{ required: true, message: "填写联系电话!" }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item
                label="交通工具"
                name="traffic"
                rules={[{ required: true, message: "请填写交通工具!" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="紧急联系人电话"
                name="emergency_tel"
                rules={[{ required: true, message: "填写紧急联系人电话!" }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label="备注" name="comment">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <div className={style["btn-area"]}>
                {phaseStatus === "add" ? (
                  <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                      添加
                    </Button>
                    <Popconfirm
                      placement="top"
                      title="放弃添加休假日程"
                      description="放弃后数据将不会被保存"
                      onConfirm={handleAddAbandon}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button type="primary" danger>
                        放弃
                      </Button>
                    </Popconfirm>
                  </Form.Item>
                ) : (
                  <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                      修改
                    </Button>
                    <Popconfirm
                      placement="top"
                      title="放弃添加休假日程"
                      description="放弃后数据将不会被保存"
                      onConfirm={handleEditAbandon}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button type="primary" danger>
                        放弃
                      </Button>
                    </Popconfirm>
                  </Form.Item>
                )}
              </div>
            </Col>
          </Row>
        </Form>
      );
    }
  };
  // 如果default状态下有delete_tag就不渲染
  return phaseStatus === "default" && (props.phaseData as any)["delete_tag"] ? (
    <></>
  ) : (
    <Card className={style["phase-card"]}>{render(phaseStatus)}</Card>
  );
};

export default App;
