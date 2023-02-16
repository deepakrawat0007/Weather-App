import { useState, useEffect } from "react";
import spinner from "../Assets/Spinner-0.5s-164px.svg"
import Rain from "../Assets/rain.jpeg"
import Snow from "../Assets/snow.jpg"
import Haze from "../Assets/haze.jpg"
import Clear from "../Assets/clear.jpg"
import Drizzle from "../Assets/drizzle.jpeg"
import Thunderstorm from "../Assets/thunder.avif"
import Clouds from "../Assets/clouds.jpg"
import axios from "axios";
import "./view.css";

const WeatherView = () => {

    const [input, setInput] = useState("Delhi")
    const [value, setValue] = useState("")
    const [icon, setIcon] = useState(Haze)
    const [favList, setFavList] = useState(() => {
        const storedList = localStorage.getItem("location");
        return storedList ? JSON.parse(storedList) : [];
    });

    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const getimage = (param) => {
        switch (param) {
            case "Clouds":
                return setIcon(Clouds);
            case "Clear":
                return setIcon(Clear);
            case "Snow":
                return setIcon(Snow);
            case "Rain":
                return setIcon(Rain);
            case "Drizzle":
                return setIcon(Drizzle);
            case "Thunderstorm":
                return setIcon(Thunderstorm);
            default:
                return setIcon(Haze);
        }
    }

    useEffect(() => {
        if (localStorage.getItem("location")) {
            setFavList(JSON.parse(localStorage.getItem("location")));
        }
    }, [setFavList]);

    useEffect(() => {
        axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${input}&appid=915357abec378f3096e852cbe755a3af`)
            .then((res) => {
                // console.log(res.data)
                setLoading(false)
                setData(res.data)
                getimage(res.data.weather[0].main)
            })
            .catch((e) => {
                // console.log(e.message)
                setLoading(false)
                alert(e.message)
            })
    }, [input])

    const handleSearch = () => {
        // console.log(input)
        setInput(value)
        setValue("")
        setLoading(true)
        axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${input}&appid=915357abec378f3096e852cbe755a3af`)
            .then((res) => {
                // console.log(res.data)
                setLoading(false)
                setData(res.data)
                getimage(res.data.weather[0].main)

            })
            .catch((e) => {
                // console.log(e.message)
                setLoading(false)
                alert(e.message)

            })

    }
    const getdate = () => {
        let d = new Date()
        let date = d.getDate()
        let year = d.getFullYear()
        let month = d.toLocaleString("default", { month: "long" })
        let day = d.toLocaleString("default", { weekday: "long" })
        return `${day} , ${month}  ${date} / ${year}`
    }
    useEffect(() => {
        localStorage.setItem("location", JSON.stringify(favList));
    }, [favList]);

    const AddFav = (name) => {
        const newFavList = [...favList, { value: name }];
        setFavList(newFavList);
    };

    const findWeather = (index) => {
        favList.map((location, idx) => {
            if (idx === index) {
                setInput(location.value)
            }
        })
    }
   

        const handleDelete = (index) => {
          const newFavList = [...favList];
          newFavList.splice(index, 1);
          setFavList(newFavList);
          localStorage.setItem('location', JSON.stringify(newFavList));
        }

    return (
        <div className="container">
            <div className="wrapper" style={{ backgroundImage: `url(${icon})`, backgroundSize: "cover" }}>
                <div className="Search">
                    <input placeholder="Please Enter Location" onChange={(e) => { setValue(e.target.value) }} />
                    <button onClick={handleSearch}><i className="fas fa-search fa-2x"></i></button>

                </div>

                {loading ? (<img className="spinner" src={spinner} alt="..Loading.." />) :
                    <div className="cards">
                        <div className="top-head">
                            <h1>{data.name}</h1>
                            <button onClick={() => { AddFav(data.name) }}><i className="fas fa-heart fa-2x"></i></button>
                            <p>{getdate()}
                            </p>
                        </div>
                        <div className="temp">
                            <img width={150} height={150} className="icons" src={`http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`} />
                            <h1>{(data.main.temp - 273.15).toFixed(2)}&deg;C</h1>
                            <p>{data.weather[0].main}</p>
                            <p>MIN:{(data.main.temp_min - 273.15).toFixed(2)} &deg;C | MAX:{(data.main.temp_max - 273.15).toFixed(2)} &deg;C</p>

                        </div>


                    </div>}
                <div className="cards">
                    <h1>::Favourite Locations::</h1>
                    {favList?.map((location, index) => {
                        return (
                            <div key={index} className="temp2">
                                <p onClick={() => { findWeather(index) }}>{location.value}</p>
                                <button onClick={() => {handleDelete(index)}}><i className="fas fa-trash fa-2x"></i></button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>

    )
}

export default WeatherView;