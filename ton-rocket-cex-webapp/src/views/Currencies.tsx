import { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom'

import SwipeableViews from 'react-swipeable-views';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Pairs from '@/components/Pairs';
import TabPanel from '@/components/TabPanel';
import { getBaseCurrencies } from "@/api/currencies";
import { useTheme } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";
import Typography from '@mui/material/Typography';
import SearchBar from '@/components/SearchBar';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';

import telegramHooks from '@/hooks/telegram';
import CustomToolbar from '@/components/CustomToolbar';


export default function Trade() {
  //TODO if currency is set, setBaseCurrency to that value
  const theme = useTheme()
  const { currency } = useParams()
  const [tabValue, setTabValue] = useState(0);
  const [baseCurrency, setBaseCurrency] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [pair, setPair] = useState<string|null>(null);
  let navigate = useNavigate();
  const {isReady, telegram} = telegramHooks();
  
  const { data, error, isLoading } = useQuery('baseCurrencies', getBaseCurrencies, {
  onSuccess: (data) => {
    let baseCurrencies = data.data.results;
    setBaseCurrency(baseCurrencies[0]);
  }});

  let baseCurrencies : Array<any> | null = null;

  useEffect(() => {
    if(baseCurrencies == null) return
    setBaseCurrency(baseCurrencies[tabValue]);
  }, [tabValue, baseCurrencies])

  useEffect(() => {
      if(!isReady) return
        // @ts-ignore
        telegram.BackButton.hide()
        telegram.MainButton.setParams({
          color: telegram.themeParams.button_color,
          text: "CONTINUE",
          is_visible: false,
          is_active: true,
        });
    }, [telegram, isReady]);
  
    useEffect( () => {
      if(!isReady) return

      const handleMainButton = () => {
        //TOOD validate pair
        // moveNavigation to /trade/
          // @ts-ignore
        // telegram.showPopup({title: "Pair", message: pair})
        if(pair){ 
          navigate("/trade/"+pair, 
            { state: { test: 1 } }
          );
        }
      }

      telegram.MainButton.onClick(handleMainButton)

      let isValid = !!pair;
      if(isValid){
        console.log("show MainButton")
        telegram.MainButton.show()
      }else{
        console.log("hide MainButton")
        telegram.MainButton.hide()
      }
    }, [pair, telegram, isReady]);

  //if currency is selected, select right tab
  
  
  if (isLoading) return (
    <Backdrop open sx={{ color: '#fff', zIndex: (theme: { zIndex: { drawer: number; }; }) => theme.zIndex.drawer + 1 }} >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
  if (error) return <div>Error loading currencies</div>;

  baseCurrencies = data.data.results;
  
  const handleChange = (event: React.SyntheticEvent, newValue: any) => {
    setTabValue(newValue);
    setPair(null);
  };

  const handleChangeIndex = (index: number) => {
    setTabValue(index);
    setPair(null);
  };

  const handleChangeSearchBar = (event: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
    const value = event.target.value;
    setSearchQuery(value);
  } 
  const handleSelectionChangePairs = (pair: string | null) => {
    console.log("setting pair to: "+pair)
    setPair(pair);
  }
  
  // useEffect(()=>{
  //     baseCurrencies = data.data.results;
  //     setBaseCurrency(baseCurrencies[0]);  
  //   }, [data])

  //TODO check if this is good design
  // setBaseCurrency(baseCurrencies[0]);
  
  return (
    <Box>
      <CustomToolbar>Pick a pair</CustomToolbar>
      <Box>
        <Tabs
          value={tabValue}
          onChange={handleChange}
          variant="scrollable"
          // scrollButtons
          // allowScrollButtonsMobile
          aria-label="base currencies"
        >

          {baseCurrencies?.map((currency, index): JSX.Element => (
            <Tab
              key={currency.currency}
              label={currency.name}
              value={index}
            />
          ))}
        </Tabs>
      <SearchBar sx={{mx: 4}} onChange={handleChangeSearchBar} />
      </Box>
      <Box>
      <SwipeableViews
          marginWidth={0}
          cellPadding={0}
          marginHeight={0}
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={tabValue}
          onChangeIndex={handleChangeIndex}
          >
            {baseCurrencies?.map((currency, index): JSX.Element => (
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