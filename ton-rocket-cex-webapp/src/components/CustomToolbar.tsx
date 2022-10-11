import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import {FC} from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { BackButton } from '@twa-dev/sdk/react';

const CustomToolbar: FC<{children?: React.ReactNode, location: string }> = ({children, location}) => {  
    const { t } = useTranslation();
    const navigate = useNavigate();
    // var currentLocation = this.props.location.pathname
    const hideButtons = location in ["/settings"]
      return (
        <AppBar position="relative">
        <BackButton onClick={() => navigate("/")}/>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: "left" }}>
            {children}
          </Typography>
        {location == "/orders" || hideButtons ||
          <Button color="inherit" component={Link} to="/orders">{t("order_history")}</Button>
        }
        </Toolbar>
      </AppBar>
      );
};


export default CustomToolbar;