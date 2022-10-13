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

import WebApp from '@twa-dev/sdk'
import { MainButton } from '@twa-dev/sdk/react';

import CustomToolbar from '@/components/CustomToolbar';
import { useTranslation } from 'react-i18next';
import MenuLayout from '@/components/MenuLayout';
import { Currency } from '@/api/types';


export default function Trade() {
  //TODO if currency is set, setBaseCurrency to that value
  const { t } = useTranslation();
  const theme = useTheme()
  const { currency } = useParams()
  const [tabValue, setTabValue] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [pair, setPair] = useState<string|null>(null);
  let navigate = useNavigate();
  
  const { data, error, isLoading } = useQuery('baseCurrencies', getBaseCurrencies, {
  // onSuccess: (data) => {
  //   let baseCurrencies = data.data.results;
  //   setQuoteCurrency(baseCurrencies[0]);
  // }
  });

  let quoteCurrencies : Array<Currency> | null = null;
  
  // useEffect(() => {
  //   if(quoteCurrencies == null) return
  //   setQuoteCurrency(quoteCurrencies[tabValue]);
  // }, [tabValue, quoteCurrencies])

  function handleMainButton() {
    if(pair){ 
      navigate("/trade/"+pair);
    }
    console.log("handleMainButton pressed")
  }
  
  let showMainButton = false;

  useEffect( () => {
    showMainButton = !!pair;
  }, [pair]);

  if (isLoading) return (
    <Backdrop open sx={{ color: '#fff', zIndex: (theme: { zIndex: { drawer: number; }; }) => theme.zIndex.drawer + 1 }} >
      <CircularProgress color="inherit" />
    </Backdrop>
  );

  if (error) return <div>{t("error_loading_currencies")}</div>;

  quoteCurrencies = data.data.results;
  
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
      <MenuLayout location="/" title={t("select_a_pair")}>
      <Box>
        <Tabs
          value={tabValue}
          onChange={handleChange}
          variant="scrollable"
          // scrollButtons
          // allowScrollButtonsMobile
          aria-label="base currencies"
        >
          <Tab key="*" label="All" value={0} />
          {quoteCurrencies?.map((currency, index): JSX.Element => (
            <Tab
              key={currency.currency}
              label={currency.name}
              value={index+1}
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
          <TabPanel value={tabValue} index={0} dir={theme.direction}>
              <Pairs quoteCurrencies={quoteCurrencies} searchQuery={searchQuery} onSelectionChange={handleSelectionChangePairs}/>
          </TabPanel>
            {quoteCurrencies?.map((currency, index): JSX.Element => (
            <TabPanel value={tabValue} index={index+1} dir={theme.direction}>
              <Pairs quoteCurrencies={[currency]} searchQuery={searchQuery} onSelectionChange={handleSelectionChangePairs}/>
          </TabPanel>
          ))}
        </SwipeableViews>
      </Box>
      {pair &&
        <MainButton onClick={handleMainButton} text={t("CONTINUE")} color={WebApp.themeParams.button_color}/>
      }
    </MenuLayout>
  );
}