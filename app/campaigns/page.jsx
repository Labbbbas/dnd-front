'use client'

import { useState } from 'react';
import { TextField, MenuItem, FormControl, InputLabel, Select, Button, Grid, Typography, Box } from '@mui/material';
import Head from 'next/head';

export default function CampaignPage() {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        dungeonMaster: '',
        status: 'ongoing',
        playerCharacters: '',
        startDate: '',
        endDate: '',
        worldSetting: '',
        questLog: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
        ...formData,
        [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Campaign data submitted:', formData);
    };

    return (
        <>
            <Head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
                <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet"/>
            </Head>
        
            <Box
                sx={{
                    backgroundImage: 'url("https://preview.redd.it/2ggctvfdseta1.jpg?auto=webp&s=b23bf7239b1045cc9d1fd887a845364d594a7420")', // Background image
                    backgroundSize: 'cover', 
                    backgroundPosition: 'center', 
                    display: 'flex',
                    alignItems: 'center', 
                    justifyContent: 'center', 
                }}
            >
                <Box
                    sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.7)', 
                    padding: 4,
                    margin: '30px',
                    borderRadius: '8px',
                    width: '100%',
                    maxWidth: 600, 
                    boxShadow: 3, // shadow
                    height: 'auto',
                    color: 'black',
                    }}
                >
                    <Typography
                    variant="h4"
                    sx={{
                        textAlign: 'center',
                        fontWeight: 'bold',
                        marginBottom: 4,
                        fontFamily: '"Playfair Display", serif',
                        fontWeight: 600,
                        fontSize: '36px',
                    }}
                    >
                    CREAR CAMPAÑA
                    </Typography>
                    
                    <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Nombre"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: 'black', 
                                        borderWidth: 2,
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'black', 
                                        borderWidth: 2,
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: 'black',
                                        borderWidth: 2,
                                    },
                                },
                                '& .MuiInputBase-input': {
                                    color: 'black',
                                },
                                '& .MuiInputLabel-root': {
                                    color: 'black', 
                                    fontWeight: 'bold',
                                },
                                '& .Mui-focused .MuiInputBase-input': {
                                    color: 'black',
                                }
                            }}
                        />
                        </Grid>
                        <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Descripción"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: 'black', 
                                        borderWidth: 2,
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'black', 
                                        borderWidth: 2,
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: 'black', 
                                        borderWidth: 2,
                                    },
                                    },
                                    '& .MuiInputBase-input': {
                                    color: 'black', 
                                    },
                                    '& .MuiInputLabel-root': {
                                    color: 'black', 
                                    fontWeight: 'bold',
                                    }
                            }}
                        />
                        </Grid>
                        <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Dungeon Master"
                            name="dungeonMaster"
                            value={formData.dungeonMaster}
                            onChange={handleChange}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: 'black', 
                                        borderWidth: 2,
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'black', 
                                        borderWidth: 2,
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: 'black', 
                                        borderWidth: 2,
                                    },
                                    },
                                    '& .MuiInputBase-input': {
                                    color: 'black', 
                                    },
                                    '& .MuiInputLabel-root': {
                                    color: 'black', 
                                    fontWeight: 'bold',
                                    }
                            }}
                        />
                        </Grid>
                        <Grid item xs={12}>
                        <FormControl
                            fullWidth
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: 'black', 
                                        borderWidth: 2,
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'black', 
                                        borderWidth: 2,
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: 'black', 
                                        borderWidth: 2,
                                    },
                                    },
                                    '& .MuiInputBase-input': {
                                    color: 'black', 
                                    },
                                    '& .MuiInputLabel-root': {
                                    color: 'black', 
                                    fontWeight: 'bold',
                                    }
                            }}
                        >
                            <InputLabel>Status</InputLabel>
                            <Select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            >
                                <MenuItem value="ongoing">En proceso</MenuItem>
                                <MenuItem value="completed">Completado</MenuItem>
                                <MenuItem value="paused">En pausa</MenuItem>
                            </Select>
                        </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Player Characters"
                            name="playerCharacters"
                            value={formData.playerCharacters}
                            onChange={handleChange}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: 'black', 
                                        borderWidth: 2,
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'black', 
                                        borderWidth: 2,
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: 'black', 
                                        borderWidth: 2,
                                    },
                                    },
                                    '& .MuiInputBase-input': {
                                    color: 'black', 
                                    },
                                    '& .MuiInputLabel-root': {
                                    color: 'black', 
                                    fontWeight: 'bold',
                                    }
                            }}
                        />
                        </Grid>
                        <Grid container item xs={12} spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                            fullWidth
                            label="Fecha de Inicio"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleChange}
                            type="date"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: 'black', 
                                        borderWidth: 2,
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'black', 
                                        borderWidth: 2,
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: 'black', 
                                        borderWidth: 2,
                                    },
                                    },
                                    '& .MuiInputBase-input': {
                                    color: 'black', 
                                    },
                                    '& .MuiInputLabel-root': {
                                    color: 'black', 
                                    fontWeight: 'bold',
                                    }
                            }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                            fullWidth
                            label="Fecha Fin"
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleChange}
                            type="date"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: 'black',
                                        borderWidth: 2,
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'black', 
                                        borderWidth: 2,
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: 'black', 
                                        borderWidth: 2,
                                    },
                                    },
                                    '& .MuiInputBase-input': {
                                    color: 'black', 
                                    },
                                    '& .MuiInputLabel-root': {
                                    color: 'black', 
                                    fontWeight: 'bold',
                                    }
                            }}
                            />
                        </Grid>
                        </Grid>
                        <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="World/Setting"
                            name="worldSetting"
                            value={formData.worldSetting}
                            onChange={handleChange}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: 'black', 
                                        borderWidth: 2,
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'black', 
                                        borderWidth: 2,
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: 'black', 
                                        borderWidth: 2,
                                    },
                                    },
                                    '& .MuiInputBase-input': {
                                    color: 'black', 
                                    },
                                    '& .MuiInputLabel-root': {
                                    color: 'black', 
                                    fontWeight: 'bold',
                                    }
                            }}
                        />
                        </Grid>
                        <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Quest Log"
                            name="questLog"
                            value={formData.questLog}
                            onChange={handleChange}
                            multiline
                            rows={4}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: 'black', 
                                        borderWidth: 2,
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'black', 
                                        borderWidth: 2,
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: 'black', 
                                        borderWidth: 2,
                                    },
                                    },
                                    '& .MuiInputBase-input': {
                                    color: 'black', 
                                    },
                                    '& .MuiInputLabel-root': {
                                    color: 'black', 
                                    fontWeight: 'bold',
                                    }
                            }}
                        />
                        </Grid>
                        <Grid item xs={12}>
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            type="submit"
                            sx={{
                                backgroundColor: 'black',
                                color: 'white',
                                fontWeight: 'bold',
                                '&:hover':{
                                    backgroundColor: '#333'
                                }
                            }}
                        >
                            Crear Campaña
                        </Button>
                        </Grid>
                    </Grid>
                    </form>
                </Box>
            </Box>
        </>
    );
}
