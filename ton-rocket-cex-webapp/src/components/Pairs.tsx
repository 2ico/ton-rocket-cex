import { useState } from 'react';
import { useQuery } from 'react-query';
import {Currency, CurrencyPair } from '@/api/types';

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import {getAvailablePairs} from "@/api/currencies";

import SearchBar from "@/components/SearchBar";


const searchFilter = (elem: CurrencyPair, searchQuery: string) => {
  if(!searchQuery) return true;
  let searchQueryLower = searchQuery.toLowerCase();
  return  elem.currency.toLowerCase().includes(searchQueryLower) || elem.name.toLowerCase().includes(searchQueryLower)
}

function Pairs(props: { baseCurrency: Currency | null; }) {
  
  const [searchQuery, setSearchQuery] = useState("");

  if(props.baseCurrency === null) return <div>No currency selected...</div>;
  let baseCurrency: Currency = props.baseCurrency;

  const { data: availablePairs, error, isLoading } = useQuery('availableCurrencies', () => getAvailablePairs(baseCurrency));
  // Error and Loading states
  if (error) return <div>Request Failed</div>;
  if (isLoading) return <div>Loading...</div>;
  // Show the response if everything is fine
  return (
    <div>
      <Box>
      {/* <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
      Available pairs
      </Typography>
       */}
      <SearchBar />
      <nav aria-label="currency pairs list">
        <List>
           {availablePairs.data.results.filter((elem: CurrencyPair) => searchFilter(elem, searchQuery)).map((currency: any): JSX.Element => (
            <ListItem disablePadding key={currency.currency}>
              <ListItemButton component="a" href="#simple-list">
                <ListItemText primary={baseCurrency.name + "/" + currency.name} />
              </ListItemButton>
            </ListItem>
        ))}
        </List>
      </nav>
    </Box>
    </div>
  );
}

export default Pairs;