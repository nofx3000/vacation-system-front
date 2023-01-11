import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState, AppDispatch, AppThunk } from "../store";
import { TodayPhaseInter } from "../../interface/PhaseInterface";
import { AllInfoInter } from "../../interface/AllInfoInterface";
import axios from "axios";

export interface PhaseState {
  todayPhases: TodayPhaseInter[];
  allInfo: AllInfoInter;
}

const initialState: PhaseState = {
  todayPhases: [],
  allInfo: [],
};

export const getTodayPhasesAsync = createAsyncThunk(
  "phase/getTodayPhases",
  async () => {
    const res = await axios.get("/phase/today");
    // The value we return becomes the `fulfilled` action payload
    return res.data.data;
  }
);

export const getAllInfoAsync = createAsyncThunk(
  "phase/getAllInfo",
  async () => {
    const res = await axios.get("/all");
    // The value we return becomes the `fulfilled` action payload
    return res.data.data;
  }
);

export const PhaseSlice = createSlice({
  name: "phase",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {},
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {
    builder.addCase(getTodayPhasesAsync.fulfilled, (state, action) => {
      state.todayPhases = action.payload;
    });
    builder.addCase(getTodayPhasesAsync.rejected, (state, action) => {
      console.log("rejected");
      throw Error("todayPhase failed to get");
    });
    builder.addCase(getAllInfoAsync.fulfilled, (state, action) => {
      state.allInfo = action.payload;
    });
    builder.addCase(getAllInfoAsync.rejected, (state, action) => {
      console.log("rejected");
      throw Error("allinfo failed to get");
    });
  },
});

// !!!CAUTION!!! select中state后面要接reducer名，而不是slice名
export const selecTodayPhases = (state: RootState) =>
  state.phaseReducer.todayPhases;

export const selecAllInfo = (state: RootState) => state.phaseReducer.allInfo;

export default PhaseSlice.reducer;
