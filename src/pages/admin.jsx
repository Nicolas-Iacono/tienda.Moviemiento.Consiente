import { Grid2} from '@mui/material';
import ProductoForm from '@/components/formProduct';
const AdminPage = () => {

  return (
    <Grid2 sx={{ padding:{xs:"20px 0px", md:"20px"}, fontFamily: 'Arial, sans-serif', color:"white", display:"flex", flexDirection:"column",marginTop: {xs:"0", md:"0rem"}, height:"140vh"}}>
      
    


          <Grid2 sx={{width:"100%", display:"flex", flexDirection:"column", height:"auto",}}>
           

            <Grid2  sx={{width:{xs:"100%", md:"80%"},height:{xs:"auto", md:"80%"},display:"flex", justifyContent:"center", alignItems:"flex-start", position:"absolute" }}>

              <ProductoForm/>


              </Grid2>
          </Grid2>
     

    </Grid2>
  );
};

export default AdminPage;
