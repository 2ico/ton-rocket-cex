import CustomToolbar from "@/components/CustomToolbar";
import MenuLayout from "@/components/MenuLayout";
import { Box } from "@mui/material";
import WebApp from "@twa-dev/sdk";
import { useTranslation } from "react-i18next";

export default function Settings() {
    const { t } = useTranslation();
    WebApp.disableClosingConfirmation();


    return (
        <MenuLayout location="/settings" title={t("settings")}></MenuLayout>
    );
}