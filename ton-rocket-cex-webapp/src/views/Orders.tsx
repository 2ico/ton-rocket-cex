import CustomToolbar from "@/components/CustomToolbar";
import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function Orders() {
    const { t } = useTranslation();
    // const navigate = useNavigate();
    return (
        <Box height={'100vh'} overflow={'scroll'}> {/* TODO overflow hidden */} 
            <Box>
                <CustomToolbar location="/orders">{t("order_history")}</CustomToolbar>
            </Box>
            <Box>

            </Box>
        </Box>
    )
}