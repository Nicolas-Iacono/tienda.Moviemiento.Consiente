import { Button, } from '@mui/material';
import { styled } from '@mui/material/styles';

const BtnAd = styled(Button) (({theme}) =>  ({
  backgroundColor: "orange",
  width:"8rem",
  height:"2rem",
  color:"black",
  
}));



export default function CustomBtnAd({ children }) {
  return (
    <BtnAd justifyContent="center" alignItems="center">
      {children}
    </BtnAd>
  );
}