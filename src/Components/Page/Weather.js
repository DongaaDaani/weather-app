import react from 'react'
import Axios from 'axios';
import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import { Modal } from "react-bootstrap";


export default function Weather(props) {

    const APIKEY ="c3189249f4afdf526538f6f3f81e3750";
    const [weather, setWeather] = useState({})

    const getCityInformation = async () => {
        const res = await Axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${props.city.lat}&lon=${props.city.lon}&appid=${APIKEY}`)
        setWeather(res.data)
    }

    useEffect(() => {
        getCityInformation(); 
    }, [props]);


    return (
        <Modal {...props} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title >
                    {weather.name?weather.name:""}, {weather.sys?weather.sys.country:""}  Időjárás
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>
                    <img src={`http://openweathermap.org/img/wn/${weather.weather?weather.weather[0].icon:""}@2x.png`} />
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Hőmérséklet</th>
                                <th>Szél sebesség</th>
                                <th>Felhő</th>
                                <th>Légnyomás</th>
                                <th>Égbolt</th>
                                <th>Leírás</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{weather.main? Math.round((weather.main.temp - 273.15) * 10) / 10:""} °C</td>
                                <td>{weather.wind?weather.wind.speed:""} m/s</td>
                                <td>{weather.clouds?weather.clouds.all:""} %</td>
                                <td>{weather.main?weather.main.pressure:""} Hpa</td>
                                <td>{weather.weather?weather.weather[0].main:""}</td>
                                <td>{weather.weather?weather.weather[0].description:""}</td>
                            </tr>
                        </tbody>
                    </Table>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={props.onHide}>
                    Back
                </Button>
            </Modal.Footer>
        </Modal>
    )
}