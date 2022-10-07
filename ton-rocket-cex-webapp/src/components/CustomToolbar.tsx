import { AppBar, Toolbar, Typography } from "@mui/material";
import {FC} from "react";

const CustomBackdrop: FC<{children?: React.ReactNode }> = ({children}) => {
     
      return (
        <AppBar position="relative">
        <Toolbar>
          <Typography variant="h6" component="div">
            {children}
          </Typography>
        </Toolbar>
      </AppBar>
      );
};


export default CustomBackdrop;