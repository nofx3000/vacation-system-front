import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import { PhaseInter } from "../../interface/RecordInterface";
import {
  addTmpPhaseGroup,
  delTmpPhaseById,
  editTmpPhaseById,
  selectRecordId,
  setDeleteTag,
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

  const formatPhase = (phase: any) => {
    console.log("}}}}}}}}}", phase);
    phase["start_at"] = phase.time[0]["$d"];
    phase["end_at"] = phase.time[1]["$d"];
    delete phase.time;
    return phase;
  };

  const onFinish = (values: any) => {
    if (phaseStatus === "add") {
      const formatedPhase: PhaseInter = formatPhase(values);
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

  const render = (phaseStatus: PhaseStatusType) => {
    if (phaseStatus === "default") {
      let phaseData = props.phaseData as PhaseInter;
      return (
        <div>
          <p>{phaseData.destination}</p>
          <p>{phaseData.address}</p>
          <p>{(phaseData["start_at"] as Date).valueOf()}</p>
          <p>{(phaseData["end_at"] as Date).valueOf()}</p>
          <Button
            type="primary"
            onClick={() => {
              handleEditPhase(phaseData.id as number);
            }}
          >
            修改
          </Button>
          <Button type="primary" onClick={handleDeletePhase} danger>
            删除
          </Button>
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
                <RangePicker />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="联系电话" name="tel">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label="交通工具" name="traffic">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="紧急联系人电话" name="emergency_tel">
                <Input />
              </Form.Item>
            </Col>
          </Row>
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
        </Form>
      );
    }
  };
  // 如果default状态下有delete_tag就不渲染
  return phaseStatus === "default" && (props.phaseData as any)["delete_tag"] ? (
    <></>
  ) : (
    <Card>{render(phaseStatus)}</Card>
  );
};

export default App;
