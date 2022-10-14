import { Order, OrderType, OrderAction } from "@/api/types"
import { Box } from "@mui/system"
import { IconButton, ListItemIcon, Typography } from "@mui/material";
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import { Cancel, TrendingDown, TrendingUp } from "@mui/icons-material";
import React from "react";

interface OrderItemProp {
    order: Order,
    onCancel: (id: number) => void
}

const OrderItem = ({ order, onCancel } : OrderItemProp) 
    : JSX.Element => 
{
    return (
        <Box>
            <ListItem
                sx={{ width: "100%", pl: 4, flexWrap: 'wrap' }}
                secondaryAction = {
                    <IconButton color="primary" onClick={() => onCancel(order.id)}>
                        <Cancel />
                    </IconButton>
                }
            >
                <Box flexBasis={"32px"} sx={{ pr: 2, color: (order.orderAction == OrderAction.Buy ? "rgb(49, 181, 69)" : "#FF4C4C")}}>
                <ListItemIcon sx={{minWidth: "0px"}}>
                    { order.orderAction == OrderAction.Buy ? <TrendingUp sx={{color: "rgb(49, 181, 69)"}}/> : <TrendingDown sx={{color: "#FF4C4C"}}/> }
                </ListItemIcon>
                <Typography color="inherit">{order.orderAction}</Typography>
                </Box>
                <ListItemText sx={{flexBasis: "72px"}} primary={order.pair.base_name+"/"+order.pair.quote_name}/>
                <ListItemText sx={{flexBasis: "48px"}} primary={<React.Fragment>{order.price.toNumber().toPrecision(5)}</React.Fragment>} secondary={order.orderType}/>
                <ListItemText sx={{flexBasis: "60px"}} primary={<React.Fragment>{order.amount.toNumber().toPrecision(5)} {order.pair.base_name}</React.Fragment>}/>
            </ListItem>
        </Box>
    )
}

export { OrderItem }