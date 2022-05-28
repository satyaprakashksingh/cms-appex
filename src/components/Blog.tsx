import axios from "axios";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Typography,
} from "@mui/material";
import React from "react";
import BlogData from "../models/BlogData";
import packageJson from "../../package.json";

interface BlogInfo {
  blog: BlogData;
  reload: () => void;
}

const apiBase = packageJson.apiBase;

function Blog({ blog, reload }: BlogInfo) {
  let userData: any | null = localStorage.getItem("user");
  userData = userData ? JSON.parse(userData) : null;
  const [isAdmin, setIsAdmin] = React.useState<boolean>(
    userData && userData["isAdmin"] == 1 ? true : false
  );

  const updateData = async (status: string) => {
    const data = {
      status: status,
      id: blog.id,
    };
    const res = await axios.put(`${apiBase}/review`, data);
   
    reload();
  };

  return (
    <Container sx={{ margin: "25px 10px" }}>
      <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {blog.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {blog.content}
          </Typography>
        </CardContent>
        {blog.status == "pending" && isAdmin ? (
          <CardActions>
            <Button size="small" onClick={() => updateData("approved")}>
              Approve
            </Button>
            <Button size="small" onClick={() => updateData("discard")}>
              Discard
            </Button>
          </CardActions>
        ) : (
          ""
        )}
      </Card>
    </Container>
  );
}

export default Blog;
