import { useState } from 'react';
import { useQuery } from 'react-query';
import { Currency, CurrencyPair } from '@/api/types';

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Money from '@mui/icons-material/Money';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import { getAvailablePairs } from "@/api/currencies";
import { formatPriceChange } from "@/utils/utils";
import { Avatar, Divider, Grid, Typography } from '@mui/material';
import React from 'react';

//TODO improve efficiency
const searchFilter = (pair: CurrencyPair, searchQuery: string) => {
  if (!searchQuery) return true;
  const searchQueryLower = searchQuery.toLowerCase();
  const baseNameLower = pair.base_name.toLowerCase();
  const baseCurrencyLower = pair.base_currency.toLowerCase();
  const quoteNameLower = pair.quote_name.toLowerCase();
  const quoteCurrencyLower = pair.quote_currency.toLowerCase();
  let pairStrings = [baseNameLower, baseCurrencyLower, quoteNameLower, quoteCurrencyLower, baseNameLower + '/' + quoteNameLower, baseNameLower + '_' + quoteNameLower, baseNameLower + '-' + quoteNameLower, baseNameLower + ' ' + quoteNameLower, baseCurrencyLower + '/' + quoteCurrencyLower, baseCurrencyLower + '_' + quoteCurrencyLower, baseCurrencyLower + '-' + quoteCurrencyLower, baseCurrencyLower + ' ' + quoteCurrencyLower];
  return pairStrings.some(x => x.includes(searchQueryLower))
}

function Pairs(props: { quoteCurrencies: Currency[] | null, searchQuery: string, onSelectionChange: any }) {

  const [selectedPair, setSelectedTradeCurrency] = useState<string | null>(null);

  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    pairString: string,
  ) => {
    if (selectedPair === pairString) {
      setSelectedTradeCurrency(null)
      props.onSelectionChange("")
    }
    else {
      setSelectedTradeCurrency(pairString);
      //TODO validate tradeCurrency
      //let pair = makeUrlPair(quoteCurrency.currency, pairString)
      props.onSelectionChange(pairString)
    }
  };


  if (props.quoteCurrencies === null) return <div>No currency selected...</div>;
  const quoteCurrencies: Currency[] = props.quoteCurrencies;

  const { data: availablePairs, error, isLoading } = useQuery('availableCurrencies', () => getAvailablePairs(quoteCurrencies));
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
                  <ListItem sx={{ position: "relative" }} disablePadding key={pairString} alignItems="flex-start">
                    <ListItemButton component="div" sx={{ px: 4 }} selected={selectedPair === pairString}
                      onClick={(event) => handleListItemClick(event, pairString)} >
                      <ListItemAvatar sx={{
                          "img" : {objectFit: "contain"}
                      }}>
                        <Avatar alt={`${pair.base_name} icon`} src="https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=023" />
                      </ListItemAvatar>
                      <ListItemText sx={{ flexBasis: "200px" }} primary={pair.base_name + "/" + pair.quote_name}
                        secondary={
                          <React.Fragment>
                            {pair.market_price.toPrecision(4)}
                          </React.Fragment>
                        }
                      />
                      {/* <Box flexGrow={1.5} flexShrink={1} flexBasis="auto">PRICE GRAPH</Box> */}
                      <Box flexGrow={1.5} flexShrink={1} flexBasis="auto">
                        <Grid container spacing={0.5} color={(pair.change_daily >0)? "success.main" : "error.main"}>
                          <Grid item>
                            24h
                          </Grid>
                          <Grid item>
                            {formatPriceChange(pair.change_daily)}
                          </Grid>
                        </Grid>
                      </Box>
                      <Box flexGrow={1.5} flexShrink={1} flexBasis="auto">
                        <Grid container spacing={0.5} color={(pair.change_daily >0)? "success.main" : "error.main"}>
                          <Grid item>
                            7d
                          </Grid>
                          <Grid item>
                            {formatPriceChange(pair.change_weekly)}
                          </Grid>
                        </Grid>
                      </Box>
                    </ListItemButton>
                  </ListItem>
                  <Divider sx={{ ml: 4 }} />
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