import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home.jsx";
import Signup from "../pages/Signup.jsx";
import Login from "../pages/Login.jsx";
import Profile from "../pages/profile.jsx";
import LoginRoute from "../components/LoginRoute.jsx";

export const router = createBrowserRouter([
    { path : "/",
      element: <App/>,
      children:[
        {
            path : "/",
            element: <Signup/>
        },
        {
            path: "/login",
            element: <Login/>
        },
        {
            path: "/home", 
            element: <LoginRoute><Home/></LoginRoute>
        },
        {
            path: "/profile", 
            element: <LoginRoute><Profile/></LoginRoute>
        }
      ]  
    }
]);