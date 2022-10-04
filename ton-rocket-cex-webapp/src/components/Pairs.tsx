import { useState } from 'react';
import { useQuery } from 'react-query';
import { Currency, CurrencyPair } from '@/api/types';

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import { getAvailablePairs } from "@/api/currencies";
import { makeUrlPair } from "@/utils/utils";

const searchFilter = (elem: CurrencyPair, searchQuery: string) => {
  if (!searchQuery) return true;
  console.log(searchQuery)
  let searchQueryLower = searchQuery.toLowerCase();
  return elem.currency.toLowerCase().includes(searchQueryLower) || elem.name.toLowerCase().includes(searchQueryLower)
}

function Pairs(props: { baseCurrency: Currency | null, searchQuery: string, onSelectionChange: any }) {

  const [selectedTradeCurrency, setSelectedTradeCurrency] = useState<string>("");

  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    currencyString: string,
  ) => {
    setSelectedTradeCurrency(currencyString);
    //TODO validate tradeCurrency
    let pair = makeUrlPair(baseCurrency.currency, currencyString)
    props.onSelectionChange(pair)
  };


  if (props.baseCurrency === null) return <div>No currency selected...</div>;
  const baseCurrency: Currency = props.baseCurrency;

  const { data: availablePairs, error, isLoading } = useQuery('availableCurrencies', () => getAvailablePairs(baseCurrency));
  // Error and Loading states
  if (error) return <div>Request Failed</div>;
  if (isLoading) return <div>Loading...</div>;
  // Show the response if everything is fine
  return (
    <div>
      <Box sx={{ width: '100%' }}>
        {/* <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
      Available pairs
      </Typography>
       */}
        <nav aria-label="currency pairs list">
          <List>
            {availablePairs.data.results.filter((elem: CurrencyPair) => searchFilter(elem, props.searchQuery)).map((currency: any): JSX.Element => (
              <ListItem disablePadding key={currency.currency}     >
                <ListItemButton component="div" sx={{ px: 4}} selected={selectedTradeCurrency === currency.currency}
              onClick={(event) => handleListItemClick(event, currency.currency)} >
                  <ListItemText
                    primary={baseCurrency.name + "/" + currency.name}/>
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