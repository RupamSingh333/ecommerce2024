import * as React from 'react';
import { useState, useContext, useEffect } from "react";
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';


export default function AddressForm(props) {

    const { setcompleteAddress, setActiveStep } = props;

    const [address, setAddress] = useState({
        address: "",
        city: "",
        state: "",
        postalCode: ""
    });

    const [errorFields, seterrorFields] = useState({
        address: false,
        city: false,
        state: false,
        postalCode: false
    });

    const handleSubmit = async (e) => {

        if (address.address == '' || address.city == '' || address.state == '' || address.postalCode == '') {
            seterrorFields({
                address: (address.address) ? false : true,
                city: (address.city) ? false : true,
                state: (address.state) ? false : true,
                postalCode: (address.postalCode) ? false : true
            })
        } else {
            seterrorFields({
                address: false,
                city: false,
                state: false,
                postalCode: false
            });
            setcompleteAddress(address);
            setActiveStep((cur) => {
                return cur + 1;
            });
        }
    };

    const handleInput = (e) => {
        let name = e.target.name;
        let value = e.target.value;

        setAddress({
            ...address,
            [name]: value,
        })
    };


    return (
        <React.Fragment>
            <Typography variant="h4" gutterBottom>
                Shipping address
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <TextField
                        required
                        id="address"
                        name="address"
                        label="Address"
                        fullWidth
                        autoComplete="shipping address-line1"
                        variant="standard"
                        value={address.address}
                        error={errorFields.address}
                        onChange={handleInput}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        id="city"
                        name="city"
                        label="City"
                        fullWidth
                        autoComplete="shipping address-level2"
                        variant="standard"
                        value={address.city}
                        error={errorFields.city}
                        onChange={handleInput}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        id="state"
                        name="state"
                        label="State/Province/Region"
                        fullWidth
                        variant="standard"
                        value={address.state}
                        error={errorFields.state}
                        onChange={handleInput}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        id="postalCode"
                        name="postalCode"
                        label="Zip / Postal code"
                        fullWidth
                        autoComplete="shipping postal-code"
                        variant="standard"
                        value={address.postalCode}
                        error={errorFields.postalCode}
                        onChange={handleInput}
                    />
                </Grid>

                <Grid item xs={12}>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            variant="contained"
                            sx={{ mt: 3, ml: 1 }}
                            onClick={handleSubmit}
                        >Next
                        </Button>
                    </Box>
                </Grid>

            </Grid>
        </React.Fragment>
    );
}