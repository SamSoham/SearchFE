import { Button, IconButton, Stack, TextField, Typography } from "@mui/material";
import { VolumeUp } from "@mui/icons-material";
import { useSpeechSynthesis } from "react-speech-kit";
import axios from "axios";
import { useState } from "react";

export default function Home(){
    const { speak } = useSpeechSynthesis();
    const [query,setQuery] = useState('')
    const [info,setInfo] = useState(null)

    async function getData(query) {
        try {
         if(query.length>0){
            const response = await axios({
                method: 'post',
                url: `http://localhost:5000/`,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "*",
                    "x-requested-with": "XMLHttpRequest",
                  },
                crossdomain: true ,
                data: {query: query},
              });
              setInfo(response.data)
              //console.log(response.data)
         }
        } catch (error) {
          console.error(error);
        }
      }

    return(
        <Stack alignItems="center" justifyContent="center" minHeight="100vh">
            <Stack gap="16px" maxWidth="500px" sx={{minWidth:"450px"}}>
                <Typography>Product Search</Typography>
                <TextField
                 variant="outlined"
                 label="Write the Product Name"
                 value={query}
                 onChange={(e)=>setQuery(e.target.value)}
                />
                <Button variant="contained" onClick={()=>getData(query)}>Search</Button>
                {
                 info && info.shopping_results[0] &&
                  <Stack direction="row" alignItems="center">
                  <img src={info.shopping_results[0].thumbnail} alt="Product Thumbnail" width="200px" />
                  <Stack direction="column">
                  <Typography>The price of {info.shopping_results[0].title} is {info.shopping_results[0].price}</Typography>
                  <IconButton sx={{width:"50px"}} onClick={() => speak({ text: `The price of ${info.shopping_results[0].title} is ${info.shopping_results[0].price}`})}>
                    <VolumeUp/>
                  </IconButton>
                  </Stack>
                </Stack>
                }
                {
                  info && !info.shopping_results[0] && <Stack>
                  <Typography>No shopping ads found for {query}</Typography>
                  </Stack>
                }
            </Stack>
        </Stack>
    )
}