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
import { Divider } from '@mui/material';

const searchFilter = (pair: CurrencyPair, searchQuery: string) => {
  if (!searchQuery) return true;
  console.log(searchQuery)
  const searchQueryLower = searchQuery.toLowerCase();
  const baseNameLower = pair.base_name.toLowerCase();
  const baseCurrencyLower = pair.base_currency.toLowerCase();
  const quoteNameLower = pair.quote_name.toLowerCase();
  const quoteCurrencyLower = pair.quote_currency.toLowerCase();
  let pairStrings = [baseNameLower, baseCurrencyLower, quoteNameLower, quoteCurrencyLower, baseNameLower + '/'  + quoteNameLower, baseNameLower + '_'  + quoteNameLower, baseNameLower + '-' + quoteNameLower, baseNameLower + ' ' + quoteNameLower, baseCurrencyLower + '/' + quoteCurrencyLower, baseCurrencyLower + '_' + quoteCurrencyLower, baseCurrencyLower + '-' + quoteCurrencyLower, baseCurrencyLower + ' ' + quoteCurrencyLower];
  return pairStrings.some(x => x.includes(searchQueryLower))
}

function Pairs(props: { quoteCurrency: Currency | null, searchQuery: string, onSelectionChange: any }) {

  const [selectedPair, setSelectedTradeCurrency] = useState<string | null>(null);

  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    pairString: string,
  ) => {
    if(selectedPair === pairString){
      setSelectedTradeCurrency(null)
      props.onSelectionChange("")
    }
    else {
      setSelectedTradeCurrency(pairString);
      //TODO validate tradeCurrency
      let pair = makeUrlPair(quoteCurrency.currency, pairString)
      props.onSelectionChange(pair)
    }
  };


  if (props.quoteCurrency === null) return <div>No currency selected...</div>;
  const quoteCurrency: Currency = props.quoteCurrency;

  const { data: availablePairs, error, isLoading } = useQuery('availableCurrencies', () => getAvailablePairs(quoteCurrency));
  // Error and Loading states
  if (error) return <div>Request Failed</div>;
  if (isLoading) return <div>Loading...</div>;
  // Show the response if everything is fine
  return (
    <div>
      <Box sx={{ width: '100%' }}>
      {/* <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
      Available pairs
      </Typography> */}
      
        <nav aria-label="currency pairs list">
          <List>
            {availablePairs.data.results.filter((elem: CurrencyPair) => searchFilter(elem, props.searchQuery)).map((pair: CurrencyPair): JSX.Element => {
                let pairString = pair.base_currency + "_" + pair.quote_currency;
                return (
                <div>
                <ListItem disablePadding key={pairString}     >
                  <ListItemButton component="div" sx={{ px: 4}} selected={selectedPair === pairString}
                onClick={(event) => handleListItemClick(event, pairString)} >
                    <ListItemText
                      primary={pair.base_name + "/" + pair.quote_name}/>
                  </ListItemButton>
                </ListItem>
                <Divider sx={{ml: 4}}/>
                </div>
              )
              })
            }
          </List>
        </nav>
      </Box>
    </div>
  );
}

export default Pairs;