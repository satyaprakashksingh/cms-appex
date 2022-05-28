import React, { useEffect } from "react";
import axios from "axios";
import "./App.css";
import {
  AppBar,
  Button,
  FormControlLabel,
  IconButton,
  Switch,
  Toolbar,
  Typography,
} from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import { Container } from "@mui/system";
import BlogData from "./models/BlogData";
import Blog from "./components/Blog";
import LoginComponent from "./components/LoginComponent";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import AddBlog from "./components/AddBlog";
import packageJson from "../package.json";

const apiBase = packageJson.apiBase;

function App() {
  let userData: any | null = localStorage.getItem("user");
  userData = userData ? JSON.parse(userData) : null;
  const [isLogin, setIsLogin] = React.useState<boolean>(
    userData ? true : false
  );
  const [loginDialog, setLoginDialog] = React.useState(false);
  const [blogDialog, setBlogDialog] = React.useState(false);
  const [Admin, setAdmin] = React.useState(
    userData && userData["isAdmin"] == 1 ? true : false
  );
  const [blogs, setBlogs] = React.useState<BlogData[]>([]);
  const [checked, setChecked] = React.useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    if (!checked) getPendingData();
    else getData();
  };

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const res = await axios.get(`${apiBase}/home`);
    setBlogs(res.data as BlogData[]);
    console.log(res);
  };

  const getPendingData = async () => {
    const res = await axios.get(`${apiBase}/post/pending`);
    setBlogs(res.data as BlogData[]);
    console.log(res);
  };

  const showLoginDialog = () => {
    setLoginDialog(true);
  };

  const hideLoginDialog = () => {
    let userData: any | null = localStorage.getItem("user");
    userData = userData ? JSON.parse(userData) : null;
    setIsLogin(userData !== null);
    setLoginDialog(false);
  };

  const reloadData = () => {
    if (!checked) getPendingData();
    else getData();
  };

  const showBlogDialog = () => {
    setBlogDialog(true);
  };

  const hideBlogDialog = () => {
    getData();
    setBlogDialog(false);
  };

  const Logout = () => {
    setIsLogin(false);
    localStorage.removeItem("user");
    userData = null;
  };

  return (
    <div className="App">
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Contains Management System
          </Typography>
          {isLogin ? (
            <>
              <IconButton
                size="small"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={showBlogDialog}
                sx={{ marginRight: "10px" }}
                color="inherit"
              >
                <AddCircleIcon />
                Add Blog
              </IconButton>
              <IconButton
                size="small"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={Logout}
                color="inherit"
              >
                <LogoutIcon />
                Logout
              </IconButton>
            </>
          ) : (
            <IconButton
              size="small"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={showLoginDialog}
              color="inherit"
            >
              <LoginIcon />
              Login
            </IconButton>
          )}
        </Toolbar>
      </AppBar>
      <AddBlog open={blogDialog} onClose={hideBlogDialog} />
      <LoginComponent open={loginDialog} onClose={hideLoginDialog} />
      <Container sx={{ marginTop: "100px" }}>
        {Admin ? (
          <FormControlLabel
            control={
              <Switch
                checked={checked}
                onChange={handleChange}
                inputProps={{ "aria-label": "Pending" }}
              />
            }
            label="Pending"
          />
        ) : (
          ""
        )}
        {blogs.map((blog) => (
          <Blog blog={blog} reload={reloadData}></Blog>
        ))}
      </Container>
    </div>
  );
}

export default App;
