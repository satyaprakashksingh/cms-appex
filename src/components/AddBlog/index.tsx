import axios from "axios";
import {
  Dialog,
  DialogTitle,
  IconButton,
  DialogContent,
  Button,
  TextField,
} from "@mui/material";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import packageJson from "../../../package.json";

export interface LoginProps {
  open: boolean;
  onClose: () => void;
}

const apiBase = packageJson.apiBase;

export default function AddBlog(props: LoginProps) {
  const { open, onClose } = props;
  const [Title, setTitle] = useState<string>("");
  const [Content, setContent] = useState<string>("");
  let loggedInUser: any | null = localStorage.getItem("user");
  loggedInUser = loggedInUser ? JSON.parse(loggedInUser) : null;

  const handleClose = () => {
    onClose();
  };

  async function onsubmit() {
    if (loggedInUser) {
      const data = {
        uid: loggedInUser["uid"],
        title: Title,
        content: Content,
        status: "pending",
      };
      const res = await axios.post(`${apiBase}/write`, data);
    
      onClose();
    }
  }

  function isValid(): boolean {
    if (Title.trim() === "" || Content.trim() === "") return false;
    return true;
  }

  const handleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleChangeContent = (event: React.ChangeEvent<HTMLInputElement>) => {
    setContent(event.target.value);
  };

  return (
    <Dialog
      onClose={handleClose}
      hideBackdrop={true}
      open={open}
      PaperProps={{
        style: {
          background: "rgba(255, 255, 255, 0.9)",
        },
      }}
    >
      <DialogTitle>
        add post
        <IconButton
          aria-label="close"
          onClick={onClose}
          style={{
            position: "absolute",
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <TextField
          label="Title"
          variant="standard"
          sx={{ width: "100%", marginBottom: "10px" }}
          value={Title}
          onChange={handleChangeTitle}
        />
        <TextField
          label="Content"
          variant="standard"
          sx={{ width: "100%", marginBottom: "10px" }}
          multiline
          minRows={4}
          value={Content}
          onChange={handleChangeContent}
        />
        <Button
          variant="contained"
          disabled={!isValid()}
          fullWidth
          onClick={onsubmit}
          sx={{ marginBottom: "10px" }}
          color="success"
        >
          Submit
        </Button>
        <br />
        <Button
          variant="contained"
          onClick={handleClose}
          fullWidth
          color="error"
        >
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
}
