import { Order, OrderType } from "@/api/types"
import { Box } from "@mui/system"
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from "@mui/material";
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';

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
            <ListItem 
                sx={{ width: "100%" }}
                secondaryAction = {
                    <IconButton color="primary" onMouseDown={() => onClick(order.id)}>
                        <DeleteIcon />
                    </IconButton>
                }
            >
                <ListItemText sx = {{ display: "table",  border: "1px solid", padding: "10px" }}>
                    <ListItemText style={{display: "table-cell" }}> {order.baseCurrency.name} </ListItemText>
                    <ListItemText style={{display: "table-cell", paddingLeft: "10px"}}> {order.pair.name} </ListItemText>
                    <ListItemText style={{display: "table-cell", paddingLeft: "10px"}}> {order.orderAction} </ListItemText>
                    <ListItemText style={{display: "table-cell", paddingLeft: "10px"}}> {order.amount.toNumber()} </ListItemText>
                    <ListItemText style={{display: "table-cell", paddingLeft: "10px"}}> {order.orderType} </ListItemText>
                    {priceDiv}
                </ListItemText>
            </ListItem>
        </Box>
    )
}

export { OrderItem }