import { Grid } from "@mui/material"
import CustomToolbar from "@/components/CustomToolbar"
import { BackButton } from '@twa-dev/sdk/react';
import { FC } from "react"
import { useNavigate } from "react-router-dom";

const MenuLayout: FC<{children?: React.ReactNode, title: string, location: string }> = ({children, title, location}) => {
    const navigate = useNavigate();
    return (
    <Grid container height={'100vh'} direction={"column"} flexWrap={"nowrap"}>
        {location != "/" &&
            <BackButton onClick={() => navigate("/")} />
        }
    <Grid item>
        <CustomToolbar location={location}>{title}</CustomToolbar>
    </Grid>
    <Grid item flex={1} sx={{overflowY: "scroll"}}>
    {children}
    </Grid>
    </Grid>
    )
}

export default MenuLayout;