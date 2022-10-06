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
    <>
        <IconButton color="primary" sx={{ p: '10px', flex : 1}}
            onClick={onClick} disabled={isDisabled}
        >
            {isPlusButton ? <AddIcon /> : <RemoveIcon />}
        </IconButton>
    </>

export default IncrementButton