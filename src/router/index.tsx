import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import JwtAuth from "../utils/JwtAuth";
import Login from "../views/Login/Login";
import Index from "../views/Index/Index";
import BasicInfo from "../views/BasicInfo/BasicInfo";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: (
      <JwtAuth>
        <Index />
      </JwtAuth>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/home"></Navigate>,
      },
      {
        path: "/home",
        element: <div>home</div>,
      },
      {
        path: "/basic-info",
        element: <BasicInfo />,
      },
      {
        path: "/input-record",
        element: <div>input-record</div>,
      },
      {
        path: "/check-info",
        element: <div>check-info</div>,
      },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router}></RouterProvider>;
}
