import { Navigate } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function JwtAuth(props: any) {
  const navigate = useNavigate();
  const token = window.localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" />;
  }
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  const res = axios.get("/users/verify");
  res
    .then((data) => {
      console.log(data);
    })
    .catch((err) => {
      console.log(err);
      navigate("/login");
    });

  return props.children;
}
