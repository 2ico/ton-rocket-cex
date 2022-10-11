import CustomToolbar from "@/components/CustomToolbar";
import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function Settings() {
    const { t } = useTranslation();

    return (
        <Box height={'100vh'} overflow={'scroll'}> {/* TODO overflow hidden */} 
            <Box>
                <CustomToolbar location="/settings">{t("settings")}</CustomToolbar>
            </Box>
            <Box>

            </Box>
        </Box>
    );
}