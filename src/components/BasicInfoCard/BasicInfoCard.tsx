import React, { ReactElement, useState } from "react";
import { Card, Button, Input, Form, Select, Radio, InputNumber } from "antd";
import { PersonInfoInter } from "../../interface/PeopleInterface";
import style from "./basicinfo-card.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import { addPersonInfoAsync } from "../../store/slices/peopleSlice";

interface CardProps {
  personinfo?: PersonInfoInter;
  initialStatus?: CardStatus;
}

type CardStatus = "data" | "edit" | "add";

const App: React.FC<CardProps> = (props) => {
  const dispatch = useDispatch<AppDispatch>();

  const [status, setStatus] = useState<CardStatus>(
    props.initialStatus as CardStatus
  );

  let { personinfo: tmp } = props;
  const personinfo = tmp as any;

  const onAddFinish = (values: any) => {
    dispatch(addPersonInfoAsync(values));
    console.log("Success:", values);
  };
  const onAddFailed = (values: any) => {
    console.log("Success:", values);
  };
  const onEidtFinish = (values: any) => {
    console.log("Success:", values);
  };

  const onEditFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const renderByStatus = (status: CardStatus) => {
    if (status === "data") {
      return (
        <div>
          <p>类别：{personinfo.catatory}</p>
          <p>干龄：{personinfo.work_age}</p>
          <p>婚姻状况：{personinfo.married}</p>
          <p>夫妻异地：{personinfo.not_with_partner}</p>
          <p>父母异地：{personinfo.not_with_parent}</p>
          <p>应休天数：{personinfo.total_holiday}</p>
          <p>已休天数：{personinfo.spent_holiday}</p>
          <div className={style["button-area"]}>
            <Button
              type="primary"
              onClick={() => {
                setStatus("edit");
              }}
            >
              编辑
            </Button>
            <Button danger>删除</Button>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={
              status === "edit"
                ? props.personinfo
                : { total_holiday: 20, spent_holiday: 0 }
            }
            onFinish={status === "add" ? onAddFinish : onEidtFinish}
            onFinishFailed={status === "add" ? onAddFailed : onEditFailed}
            autoComplete="off"
          >
            <Form.Item
              label="姓名"
              name="username"
              rules={[{ required: true, message: "请输入姓名" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="类别"
              name="catagory"
              rules={[{ required: true, message: "请选择人员类别" }]}
            >
              <Select>
                <Select.Option value={0}>干部</Select.Option>
                <Select.Option value={1}>军士</Select.Option>
                <Select.Option value={2}>文职</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="婚姻状况"
              name="married"
              rules={[{ required: true, message: "请选择婚姻状况" }]}
            >
              <Radio.Group>
                <Radio value={true}> 是 </Radio>
                <Radio value={false}> 否 </Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              label="夫妻异地"
              name="not_with_partner"
              rules={[{ required: true, message: "请选择是否夫妻异地" }]}
            >
              <Radio.Group>
                <Radio value={true}> 是 </Radio>
                <Radio value={false}> 否 </Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              label="父母异地"
              name="not_with_parent"
              rules={[{ required: true, message: "请选择是否父母异地" }]}
            >
              <Radio.Group>
                <Radio value={true}> 是 </Radio>
                <Radio value={false}> 否 </Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              label="本年假期"
              name="total_holiday"
              rules={[{ required: true, message: "请输入本年假期天数" }]}
            >
              <InputNumber />
            </Form.Item>
            <Form.Item
              label="已休假期"
              name="spent_holiday"
              rules={[{ required: true, message: "请输入已休假期天数" }]}
            >
              <InputNumber />
            </Form.Item>
            <Form.Item label="备注" name="comment">
              <Input />
            </Form.Item>
            {status === "add" ? (
              <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit">
                  添加
                </Button>
                <Button type="primary" danger>
                  放弃
                </Button>
              </Form.Item>
            ) : (
              <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit">
                  保存
                </Button>
                <Button type="primary" danger>
                  放弃修改
                </Button>
              </Form.Item>
            )}
          </Form>
        </div>
      );
    }
  };
  return (
    <div className={`site-card-border-less-wrapper ${style["card-wraper"]}`}>
      <Card
        title={status === "add" ? "添加休假人" : personinfo.name}
        bordered={false}
        className={style.card}
      >
        {/* {isEdit ? (
          
        ) : (
          
        )}
        {isEdit ? (
          <div className={style["button-area"]}>
            <Button type="primary">保存</Button>
            <Button danger>放弃修改</Button>
          </div>
        ) : (
          <div className={style["button-area"]}>
            <Button
              type="primary"
              onClick={() => {
                setIsEdit("edit");
              }}
            >
              编辑
            </Button>
            <Button danger>删除</Button>
          </div>
        )} */}
        {renderByStatus(status)}
      </Card>
    </div>
  );
};

App.defaultProps = {
  initialStatus: "data",
};

export default App;
