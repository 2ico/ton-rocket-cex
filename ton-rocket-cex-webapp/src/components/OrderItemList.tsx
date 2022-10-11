import { Box } from "@mui/system"
import { OrderItem } from "@/components/OrderItem"
import { Order } from "@/api/types"
import { useQuery } from "react-query"

interface UserOrderLstPromp {
    userOrders: Order[],
    onClick: (id: number) => void
}

const OrderItemList = ({userOrders, onClick} : UserOrderLstPromp) 
    : JSX.Element => 
{
    // TODO: add filter by base currency
    return (
        <Box>
            {userOrders.map((order) => (
                <OrderItem
                    key={order.id}
                    order={order}
                    onClick={onClick}
                />
            ))}
        </Box>
    )
}

export { OrderItemList }