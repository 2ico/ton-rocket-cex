import { Order, OrderType } from "@/api/types"
import { Box } from "@mui/system"
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from "@mui/material";

interface OrderItemProp {
    order: Order,
    onClick: (id: number) => void
}

const OrderItem = ({ order, onClick } : OrderItemProp) 
    : JSX.Element => 
{
    const priceDiv = (order.orderType != OrderType.Market) ?
        <div style={{display: "table-cell", paddingLeft: "10px"}}> {order.price.toNumber()} </div> : 
        <div style={{display: "table-cell", paddingLeft: "10px"}}>  </div>

    return (
        <Box>
            <Box display={"flex"} padding={"10px"} border={"1px solid"} >
                <Box sx = {{ flex:1 }}>
                    <Box sx = {{ display: "table" }}>
                        <div style={{display: "table-cell", paddingLeft: "10px"}}> {order.baseCurrency.name} </div>
                        <div style={{display: "table-cell", paddingLeft: "10px"}}> {order.orderAction} </div>
                        <div style={{display: "table-cell", paddingLeft: "10px"}}> {order.amount.toNumber()} </div>
                        <div style={{display: "table-cell", paddingLeft: "10px"}}> {order.orderType} </div>
                        {priceDiv}
                    </Box>
                </Box>
                <Box sx = {{ flex: 1 }}>
                    <IconButton color="primary"
                        onMouseDown={() => onClick(order.id)}>
                        <DeleteIcon />
                    </IconButton>
                </Box>
            </Box>
        </Box>
    )
}

export { OrderItem }