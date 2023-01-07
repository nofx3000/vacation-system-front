import React, { useState } from "react";
import {
  selectPeopleInfoByDivison,
  getPeopleInfoListAsync,
} from "../../store/slices/peopleSlice";
import style from "./basicinfo.module.scss";
import { Collapse } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import { useEffect } from "react";
import BasicInfoCard from "../../components/BasicInfoCard/BasicInfoCard";

const { Panel } = Collapse;

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const peopleInfoByDivision = useSelector(selectPeopleInfoByDivison);
  const [isAdding, setIsAdding] = useState(false);
  useEffect(() => {
    dispatch(getPeopleInfoListAsync());
  }, []);

  const onChange = (key: string | string[]) => {
    console.log(key);
  };

  return (
    <Collapse defaultActiveKey={["1"]} onChange={onChange}>
      {peopleInfoByDivision.map((division) => {
        return (
          <Panel
            header={division.name}
            key={division.id as number}
            className={style.panel}
          >
            <div className={style["card-container"]}>
              {division.people.map((person) => (
                <BasicInfoCard personinfo={person} key={person.id} />
              ))}
              {isAdding ? (
                <BasicInfoCard initialStatus="add"></BasicInfoCard>
              ) : (
                <div
                  onClick={() => {
                    setIsAdding(true);
                  }}
                >
                  +++++
                </div>
              )}
            </div>
          </Panel>
        );
      })}
    </Collapse>
  );
};

export default App;
