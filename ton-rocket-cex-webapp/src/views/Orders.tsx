import CustomToolbar from "@/components/CustomToolbar";
import MenuLayout from "@/components/MenuLayout";
import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function Orders() {
    const { t } = useTranslation();
    // const navigate = useNavigate();
    return (
        <MenuLayout location="/orders" title={t("order_history")}>
            TODO
        </MenuLayout>
    )
}