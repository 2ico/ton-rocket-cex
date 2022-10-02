import { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom'
import axios from 'axios';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Pairs from '@/components/Pairs';
import { getBaseCurrencies } from "@/api/currencies";

export default function Trade() {
  //TODO if currency is set, setBaseCurrency to that value
  const { currency } = useParams()
  const [tabValue, setTabValue] = useState(0);
  const [baseCurrency, setBaseCurrency] = useState(null);
  //if currency is selected, select right tab
  
  const { data, error, isLoading } = useQuery('baseCurrencies', getBaseCurrencies, {
  onSuccess: (data) => {
    let baseCurrencies = data.data.results;
    setBaseCurrency(baseCurrencies[0]);
  }});
  
  if (isLoading) return (<div>Loading...</div>);
  if (error) return <div>Error loading currencies</div>;
  
  let baseCurrencies : Array<any> = data.data.results;
  const handleChange = (event: React.SyntheticEvent, newValue: any) => {
    setTabValue(newValue);
    // I wanted to use useEffect but is doesnt work
    setBaseCurrency(baseCurrencies[newValue]);  
  };

  
  // useEffect(()=>{
  //     baseCurrencies = data.data.results;
  //     setBaseCurrency(baseCurrencies[0]);  
  //   }, [data])

  //TODO check if this is good design
  // setBaseCurrency(baseCurrencies[0]);
  
  
  return (
    <div>
    <Box>
      <Tabs
        value={tabValue}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
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
    </Box>
    <Pairs baseCurrency={baseCurrency} />
    </div>
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