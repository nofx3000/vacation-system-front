import { createBrowserRouter, RouterProvider } from "react-router-dom";
import JwtAuth from "../utils/JwtAuth";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <div>Login</div>,
  },
  {
    path: "/",
    element: (
      <JwtAuth>
        <div>Hello world!</div>
      </JwtAuth>
    ),
  },
]);

export default function Router() {
  return <RouterProvider router={router}></RouterProvider>;
}
