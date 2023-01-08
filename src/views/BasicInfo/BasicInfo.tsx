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
import { PersonInfoInter } from "../../interface/PeopleInterface";
import { DivisionInter } from "../../interface/DivisionInterface";

const { Panel } = Collapse;

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const peopleInfoByDivision = useSelector(selectPeopleInfoByDivison);
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
          <Panel header={division.name} key={division.id as number}>
            <div className={style["card-container"]}>
              {(division.people as any).map(
                (person: PersonInfoInter | DivisionInter) => (
                  <BasicInfoCard
                    personinfo={person}
                    key={person.id}
                    division_id={division.id}
                  />
                )
              )}
              <BasicInfoCard
                initialStatus="+"
                division_id={division.id}
              ></BasicInfoCard>
            </div>
          </Panel>
        );
      })}
    </Collapse>
  );
};

export default App;
