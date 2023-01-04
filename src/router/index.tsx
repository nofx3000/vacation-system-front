import { createBrowserRouter, RouterProvider } from "react-router-dom";
import JwtAuth from "../utils/JwtAuth";
import Login from "../views/Login/Login";
import Index from "../views/Index/Index";

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
  },
]);

export default function Router() {
  return <RouterProvider router={router}></RouterProvider>;
}
