import react from 'react'
import Axios from 'axios';
import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import Weather from './Weather.js';
import Forecast from './Forecast.js';
import { useNavigate } from "react-router-dom"
import { Search } from 'react-bootstrap-icons';

export default function City() {

    const APIKEY = "c3189249f4afdf526538f6f3f81e3750";
    let navigate = useNavigate()

    //Get Data from Server
    const [cityInput, setCityInput] = useState("")
    const [cities, setCities] = useState(JSON.parse(localStorage.getItem(['cities'])) ? JSON.parse(localStorage.getItem(['cities'])) : []);
    const [loadPage, setLoadPage] = useState(false)

    //Modal Visibility Dialog Variable
    const [weatherModalShow, setWeatherModalShow] = useState(false)
    const [forecastModalShow, setForecastModalShow] = useState(false)

    //Button selected Item
    const [selectedCity, setSelectedCity] = useState({})

    const weatherModalClose = () => setWeatherModalShow(false);
    const forecastModalClose = () => setForecastModalShow(false);

    const addCityList = async (item) => {
        let array = cities
        var validCity = true
        
        if(typeof item[0] === 'undefined'){
            alert("Nem található a város!")
            var validCity = false
        }
        
        array.map((arr) => {
            if (arr[0].name == item[0].name) {
                alert('Korábban hozzáadtad a listához ezt a várost!')
                validCity = false
            }
        })

        if (array.length == 10) {
            alert('A Maximális város szám megtelt, kérem töröljön a listából!')
        }
    
        if (array && validCity == true && array.length < 10) {
            array.push(item)
            localStorage.setItem('cities', JSON.stringify(array));
        }
      
        setCities(array)
        setLoadPage(!loadPage)
    }


    const removeCity = (list, name) => {
        list = list.filter((item) => item[0].name !== name)
        localStorage.setItem('cities', JSON.stringify(list));
        setCities(list)
        alert("Sikeresen törölted " + name + " várost a listából!")
    };


    const getCityInformation = async () => {
        const res = await Axios.get(`https://api.openweathermap.org/geo/1.0/direct?q=${cityInput}&limit=1&appid=${APIKEY}`)
        addCityList(res.data)
    }

    return (
        <div>
            <InputGroup size="lg" className="mb-5" style={{ width: '18rem' }}>
                <Form.Control
                    onChange={e => setCityInput(e.target.value)}
                    aria-label="Small"
                    placeholder='City name'
                    aria-describedby="inputGroup-sizing-sm"
                />
                <Button onClick={() => getCityInformation()}><Search /></Button>
            </InputGroup>
            <h1 className="text-center">Városok</h1>

            <Table className="text-center" striped bordered hover>
                <thead>
                    <tr>
                        <th>Név</th>
                        <th>Szélesség</th>
                        <th>Magasság</th>
                        <th>Ország</th>
                        <th>Művelet</th>
                    </tr>
                </thead>
                <tbody>
                    {cities.map((city) =>
                        <tr>
                            <td>{city[0].name}</td>
                            <td>{city[0].lon}°</td>
                            <td>{city[0].lat}°</td>
                            <td>{city[0].country}</td>

                            <td><Button variant="success"
                                onClick={() => {
                                    setSelectedCity(city[0]);
                                    setWeatherModalShow(true)
                                }}>Időjárás</Button>

                                <Button variant="outline-primary"
                                    onClick={() => {
                                        localStorage.setItem('forecast', JSON.stringify(city[0]));
                                        setForecastModalShow(true);
                                        navigate(`?${city[0].name.normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`);
                                    }} >Előrejelzés</Button>

                                <Button variant="danger"
                                    onClick={() => removeCity(cities, city[0].name
                                    )}>Törlés</Button>
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
            <Weather city={selectedCity} show={weatherModalShow} onHide={weatherModalClose} />
            <Forecast show={forecastModalShow} onHide={forecastModalClose} />
        </div>
    )
}