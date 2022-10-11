import { MouseEvent } from 'react';
import IconButton, { IconButtonClasses } from '@mui/material/IconButton';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';

type ButtonProp = {
    onClick: () => void,
    isPlusButton: boolean,
    isDisabled?: boolean,
}; 
  
// you can choose annotate the return type so an error is raised if you accidentally return some other type
const IncrementButton = ({ onClick, isPlusButton, isDisabled=false }: ButtonProp): JSX.Element => 
{
    const handleMouseEvent = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        e.stopPropagation()
        onClick();
    };

    return (
        <>
            <IconButton color="primary" sx={{ p: '10px', flex : 1}}
                disabled={isDisabled} onMouseDown={handleMouseEvent}
            >
                {isPlusButton ? <AddIcon /> : <RemoveIcon />}
            </IconButton>
        </>
    )
}

export default IncrementButton