import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import {FC} from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/context/storeUserSelection";
import { generateParams } from '@/utils/utils'

const CustomToolbar: FC<{children?: React.ReactNode, location: string }> = ({children, location}) => {  
    const { t } = useTranslation();
    // var currentLocation = this.props.location.pathname
    const hideButtons = location in ["/settings"]
    const filters = useSelector((state : RootState) => state.filterParam.value)

      return (
        <AppBar position="relative">
        <Toolbar>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1, textAlign: "left" }}>
            {children}
          </Typography>
        {location == "/orders" || hideButtons ||
          <Button color="inherit" component={Link} to={"/orders" + generateParams(filters)}>{t("order_history")}</Button>
        }
        </Toolbar>
      </AppBar>
      );
};


export default CustomToolbar;