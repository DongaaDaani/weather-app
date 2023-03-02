import react from 'react'
import Axios from 'axios';
import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import { Line } from "react-chartjs-2";
import { CategoryScale } from 'chart.js';
import Chart from 'chart.js/auto';
import { Modal } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom"

export default function Forecast(props) {


    const APIKEY = "c3189249f4afdf526538f6f3f81e3750";
    const months = ["Jan", "Feb", "Marc", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let navigate = useNavigate()
    const location = useLocation();

    const [forecast, setForecast] = useState([])
    const [input, setInput] = useState([])

    const getForecastInformation = async () => {
        setInput(JSON.parse(localStorage.getItem(['forecast'])))
        const res = await Axios.get(`https://api.openweathermap.org/data/2.5/forecast/daily?lat=${JSON.parse(localStorage.getItem(['forecast'])).lat}&lon=${JSON.parse(localStorage.getItem(['forecast'])).lon}&cnt=16&appid=${APIKEY}`)
        setForecast(res.data.list)
    }

    useEffect(() => {
        getForecastInformation();
    }, [props]);

    return (
        <Modal {...props} show={
            location.search === `?${JSON.parse(localStorage.getItem(['forecast'])) ? JSON.parse(localStorage.getItem(['forecast'])).name.normalize("NFD").replace(/[\u0300-\u036f]/g, "") : ""}`
        }
            fullscreen={true} centered>
            <Modal.Header closeButton onClick={() => navigate("./")}>
                <Modal.Title >
                    {input ? input.name : ""}, {input ? input.country : ""} előrejelzés
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div width="30%" className='container d-flex justify-content-center'>
                    <Line
                        options={{
                            plugins: {
                                title: {
                                    display: true,
                                    //  text: props.city.name
                                },
                                legend: {
                                    display: false
                                }
                            }
                        }}
                        datasetIdKey='id'
                        height="6%"
                        width="25%"
                        data={{
                            labels: forecast.map((item) => new Date(item.dt * 1000).getDate() + " " + months[new Date(item.dt * 1000).getMonth()]),
                            datasets: [
                                {
                                    id: 1,
                                    label: '',
                                    data: forecast.map((item) => Math.round((item.temp.min - 273.15) * 10) / 10),
                                },
                                {
                                    id: 2,
                                    label: '',
                                    data: forecast.map((item) => Math.round((item.temp.max - 273.15) * 10) / 10),
                                },
                            ],
                        }}
                    />
                </div>


                <div className='container d-flex justify-content-center'>
                    <Table className="text-center" bordered striped hover >
                        <thead>
                            <tr>

                                {forecast.map((item) =>
                                    <td>
                                        <th>{months[new Date(item.dt * 1000).getMonth()]} {new Date(item.dt * 1000).getDate()}</th>
                                    </td>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                {forecast.map((item) =>
                                    <td>
                                        <tr>{item.weather[0].main} </tr>
                                        <tr> <img width={60} src={`http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`} /> </tr>
                                        <tr>{Math.round((item.temp.max - 273.15) * 10) / 10}°C  </tr>
                                        <tr>{Math.round((item.temp.min - 273.15) * 10) / 10}°C </tr>
                                    </td>
                                )}
                            </tr>
                        </tbody>
                    </Table>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={() => { props.onHide(); navigate("./") }}>
                    Vissza
                </Button>
            </Modal.Footer>
        </Modal>
    )
}