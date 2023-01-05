import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  selectToken,
  selectUserinfo,
  verifyTokenAsync,
} from "../store/slices/userinfoSlice";

export default function JwtAuth(props: any) {
  // 1.浏览器是否有token
  // 2.redux是否有userinfo
  // 3.userinfo的exp时间是否过期（exp*1000）
  // 4.axios——verify
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = window.localStorage.getItem("token");
  if (!token) {
    navigate("/login");
  }
  axios.defaults.headers["authorization"] = token;
  async function verify() {
    try {
      const res = await axios.get("/users/verify1");
      console.log(res);
    } catch (err) {
      console.log(err);
      navigate("/login");
    }
  }
  verify();
  return props.children;
}
