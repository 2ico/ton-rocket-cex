import { Backdrop, CircularProgress } from "@mui/material";
import {Component} from "react";

export default class CustomBackdrop extends Component {
    render() {
      return (
      <Backdrop open sx={{ color: '#fff', zIndex: (theme: { zIndex: { drawer: number; }; }) => theme.zIndex.drawer + 1 }} >
        <CircularProgress color="inherit" />
      </Backdrop>
      );
    }
}

