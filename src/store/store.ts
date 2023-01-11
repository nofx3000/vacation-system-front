import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { getDefaultMiddleware } from "@reduxjs/toolkit";

import userinfoReducer from "./slices/userinfoSlice";
import menuReducer from "./slices/menuSlice";
import peopleReducer from "./slices/peopleSlice";
import recordReducer from "./slices/recordSlice";
import phaseReducer from "./slices/phaseSlice";
const store = configureStore({
  reducer: {
    userinfoReducer,
    menuReducer,
    peopleReducer,
    recordReducer,
    phaseReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export default store;
