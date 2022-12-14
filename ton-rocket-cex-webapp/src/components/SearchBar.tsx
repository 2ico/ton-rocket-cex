import * as React from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Search from '@mui/icons-material/Search'
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import Box from '@mui/material/Box';
import { SxProps, Theme } from '@mui/material';

// import SearchIcon from '@mui/icons-material/Search';

export default function SearchBar(props: {sx?: SxProps<Theme>, onChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> }) {
  return (

    <Box sx={props.sx}>
    <FormControl variant="standard" sx={{ m: 1, mt: 3, width: '100%'}}>
      {/* <FormHelperText id="search-helper-text">Search pair</FormHelperText> */}
      <Input 
        autoFocus
        // value={values.weight}
        onChange={props.onChange}
        placeholder="Search pair"
        endAdornment={<InputAdornment position="end"><Search /></InputAdornment>}
        aria-describedby="input-search-bar"
      />
    </FormControl>
    </Box>
  );
}