import CustomToolbar from "@/components/CustomToolbar";
import MenuLayout from "@/components/MenuLayout";
import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import { OrderItemList } from "@/components/OrderItemList";
import { useQuery } from 'react-query';
import { getUserOrders } from "@/api/currencies"
import CustomBackdrop from "@/components/CustomBackdrop";


export default function Orders() {
    const { t } = useTranslation();
    // const navigate = useNavigate();

    const { data, error, isLoading } = useQuery("userOrders", getUserOrders);

    if (isLoading) 
        return (<CustomBackdrop />);
    else if (error) 
        return <div>Error loading orderbook</div>;
    
    const userOrders = data.data.results

    return (
        <MenuLayout location="/orders" title={t("order_history")}>
            <OrderItemList 
                userOrders={userOrders}
                onClick={(x) => console.log(x)}
            />
        </MenuLayout>
    )
}