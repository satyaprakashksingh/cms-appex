import axios from "axios";
import {
  Dialog,
  DialogTitle,
  IconButton,
  DialogContent,
  Button,
  FormControlLabel,
  Checkbox,
  Box,
  Alert,
} from "@mui/material";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import "./index.css";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import packageJson from "../../../package.json";

export interface LoginProps {
  open: boolean;
  onClose: () => void;
}

const apiBase = packageJson.apiBase;

export default function LoginComponent(props: LoginProps) {
  const [invalidUser, setInvalidUser] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { open, onClose } = props;
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>(
    localStorage.getItem("CMS-uid") || ""
  );
  const [password, setPassword] = useState<string>(
    localStorage.getItem("CMS-pwd") || ""
  );

  const handleClose = () => {
    onClose();
  };

  async function onsubmit() {
    if(rememberMe){
      localStorage.setItem("CMS-uid", userId);
      localStorage.setItem("CMS-pwd", password);
    }
    const data = {
      uid: userId,
      passkey: password,
    };
    const res = await axios.post(`${apiBase}/login`, data);
    if (res.data.length == 0) {
      setInvalidUser(true);
    } else {
      localStorage.setItem("user", JSON.stringify(res.data[0]));
    }
    onClose();
  }

  function isValid(): boolean {
    if ((userId.trim() === "" || password.trim() === ""))
      return false;
    return true;
  }

  return (
    <Dialog
      onClose={handleClose}
      hideBackdrop={true}
      aria-labelledby="simple-dialog-title"
      open={open}
      className="Dialog"
      PaperProps={{
        style: {
          background: "rgba(255, 255, 255, 0.9)",
          width: "350px",
        },
      }}
    >
      <DialogTitle>
        Log in
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
        <label htmlFor="email" className="InputLabel">
          Email
        </label>
        <input
          id="email"
          className="InputBox"
          required
          onChange={(e) => setUserId(e.target.value)}
          type="email"
          name="email"
          value={userId}
        />
        <br />
        <label htmlFor="password" className="InputLabel">
          Password
        </label>
        <input
          id="password"
          className="InputBox"
          onChange={(e) => setPassword(e.target.value)}
          type={showPassword ? "text" : "password"}
          name="password"
          value={password}
          placeholder="at least 8 characters"
        />
        <FormControlLabel
          control={
            <Checkbox
              icon={<CheckCircleOutlineIcon />}
              checkedIcon={<CheckCircleIcon />}
              checked={rememberMe}
              onChange={(event) => setRememberMe(event.target.checked)}
            />
          }
          label="Remember me"
        />
        {invalidUser ? <Alert severity="error">Invalid User!</Alert> : ""}
        <Button
          variant="contained"
          disabled={!isValid()}
          fullWidth
          onClick={onsubmit}
        >
          Login
        </Button>
      </DialogContent>
    </Dialog>
  );
}
