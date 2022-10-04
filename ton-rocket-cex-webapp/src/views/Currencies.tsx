import { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom'

import SwipeableViews from 'react-swipeable-views';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Pairs from '@/components/Pairs';
import { getBaseCurrencies } from "@/api/currencies";
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import SearchBar from '@/components/SearchBar';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';

import telegramHooks from '@/hooks/telegram';



interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}


export default function Trade() {
  //TODO if currency is set, setBaseCurrency to that value
  const theme = useTheme()
  const { currency } = useParams()
  const [tabValue, setTabValue] = useState(0);
  const [baseCurrency, setBaseCurrency] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const {isReady, telegram} = telegramHooks();
  
  useEffect(() => {
      if(isReady){
      telegram.MainButton.setParams({
        color: telegram.themeParams.button_color,
        text: "Select currency pair"
      });
    }
    }, [telegram, isReady]);
  

  //if currency is selected, select right tab
  
  const { data, error, isLoading } = useQuery('baseCurrencies', getBaseCurrencies, {
  onSuccess: (data) => {
    let baseCurrencies = data.data.results;
    setBaseCurrency(baseCurrencies[0]);
  }});
  
  if (isLoading) return (
    <Backdrop open sx={{ color: '#fff', zIndex: (theme: { zIndex: { drawer: number; }; }) => theme.zIndex.drawer + 1 }} >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
  if (error) return <div>Error loading currencies</div>;
  
  let baseCurrencies : Array<any> = data.data.results;
  const handleChange = (event: React.SyntheticEvent, newValue: any) => {
    setTabValue(newValue);
    // I wanted to use useEffect but is doesnt work
    setBaseCurrency(baseCurrencies[newValue]);  
  };

  const handleChangeIndex = (index: number) => {
    setTabValue(index);
    //TODO useEffect
    setBaseCurrency(baseCurrencies[index]);  
  };

  const handleChangeSearchBar = (event: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
    const value = event.target.value;
    setSearchQuery(value);
  } 
  const handleSelectionChangePairs = (pair: string) => {
    //TODO
    let isValid = !!pair;
    if(isValid)
      telegram.MainButton.enable()
    else
      telegram.MainButton.disable()
  }
  
  // useEffect(()=>{
  //     baseCurrencies = data.data.results;
  //     setBaseCurrency(baseCurrencies[0]);  
  //   }, [data])

  //TODO check if this is good design
  // setBaseCurrency(baseCurrencies[0]);
  
  return (
    <Box>
    <Box position="sticky">
      <Tabs
        value={tabValue}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons
        allowScrollButtonsMobile
        aria-label="base currencies"
      >

        {baseCurrencies.map((currency, index): JSX.Element => (
          <Tab
            key={currency.currency}
            label={currency.name}
            value={index}
          />
        ))}
      </Tabs>
    <SearchBar sx={{mr: 4}} onChange={handleChangeSearchBar} />
    </Box>
    <Box>
    <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={tabValue}
        onChangeIndex={handleChangeIndex}
        >
          {baseCurrencies.map((currency, index): JSX.Element => (
            <TabPanel value={tabValue} index={index} dir={theme.direction}>
            <Pairs baseCurrency={baseCurrency} searchQuery={searchQuery} onSelectionChange={handleSelectionChangePairs}/>
         </TabPanel>
        ))}
      </SwipeableViews>
    </Box>
    </Box>
  );
}

// function PairPicker() {
//   // Fetcher function
//   const getBaseCurrencies = async () => {
//     return await axios.get('https://pay.ton-rocket.com/currencies/available');
//   }
//   const getAvailableCurrencies = async () => {
//     return await axios.get('https://pay.ton-rocket.com/currencies/available');
//   };
  
//   const { data: baseCurrencies, error, isLoading } = useQuery('baseCurrencies', getAvailableCurrencies);
//   const { data: availableCurrencies, error, isLoading } = useQuery('availableCurrencies', getAvailableCurrencies);
//   // Error and Loading states
//   if (error) return <div>Request Failed</div>;
//   if (isLoading) return <div>Loading...</div>;
//   // Show the response if everything is fine
//   console.log(availableCurrencies.;results)
//   return (
//     <div>
//       <h4>Available currencies:</h4>
//       <div>
//         {availableCurrencies.data.results.map((currency: any): JSX.Element => (
//           <li
//             key={currency}
//             className="list-group-item list-group-item-primary"
//           >
//             {currency.name}
//           </li>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default PairPicker;