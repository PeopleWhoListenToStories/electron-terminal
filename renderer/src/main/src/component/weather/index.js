import React, { useEffect, useState } from 'react'
import img0 from '../../assets/weather/b0.png' // 晴
import img2 from '../../assets/weather/b2.png' // 阴
import img5 from '../../assets/weather/b5.png' // 多云转晴
import img6 from '../../assets/weather/b6.png' // 雾
import img7 from '../../assets/weather/b7.png' // 小雨
import img11 from '../../assets/weather/b11.png' // 雷
import img12 from '../../assets/weather/b12.png' //
import img15 from '../../assets/weather/xue.png' // 雪
import img16 from '../../assets/weather/bingbao.png' // 冰雹
import './index.scss';

const data = {
  "cityid": "101120101",
  "city": "济南",
  "update_time": "20:55",
  "wea": "晴",
  "week": "周五",
  "wea_img": "qing",
  "tem": "11",
  "tem_day": "17",
  "tem_night": "7",
  "win": "东南风 ",
  "win_speed": "1级",
  "win_meter": "小于12km/h",
  "air": "73"
}

const Weather = (props) => {
  const [weatherState, setWeatherState] = useState({})
  const [imageSrc, setImageSrc] = useState('')
  const [hideWeather, setHideWeather] = useState(false)

  useEffect(() => {
    sessionStorage.setItem('weatherJson', JSON.stringify(data))
    const weatherJson = JSON.parse(sessionStorage.getItem('weatherJson'))
    if (weatherJson) {
      setWeatherState(weatherJson)
    } else {
      console.log('需要调接口获取数据啦。。。')
    }
    return () => { }
  }, [])

  useEffect(() => {
    formatImage(weatherState.wea_img) // xue、lei、shachen、wu、bingbao、yun、yu、yin、qing
    return () => { }
  }, [weatherState])

  function formatImage(value) {
    console.log('values....', value)
    // xue、lei、shachen、wu、bingbao、yun、yu、yin、qing
    switch (value) {
      case 'qing':
        setImageSrc(img0)
        break
      case 'yin':
        setImageSrc(img2)
        break
      case 'yun':
        setImageSrc(img5)
        break
      case 'wu':
        setImageSrc(img6)
        break
      case 'shachen':
        setImageSrc(img12)
        break
      case 'lei':
        setImageSrc(img11)
        break
      case 'yu':
        setImageSrc(img7)
        break
      case 'xue':
        setImageSrc(img15)
        break
      case 'bingbao':
        setImageSrc(img16)
        break
      default:
        setImageSrc('')
        break
    }
  }
  return (
    <div className={hideWeather ? 'hideWeather weather' : ' showWeather weather'} title={hideWeather ? "点击出现" : "点击滑走"} style={props.styleOptions} onClick={(e) => { setHideWeather(!hideWeather) }}>
      <div className="weather-tem">
        {weatherState.tem}<span className="weather-du">°C</span>
        <span> {weatherState.wea} </span>
        <span> {weatherState.win} </span>
        <span className="weather-img" >
          {/* <iframe src="http://i.tianqi.com/?c=code&id=50&icon=1&num=1&site=10" sandbox="allow-same-origin allow-scripts allow-forms" width="40" height="40" scrolling="no" frameborder="0" allowtransparency="true" ></iframe> */}
          <img src={imageSrc} alt="天气图片" />
        </span>
      </div>
      <div className="date">
        <div className="today">{props.dateTime}  {props.dateExtName}<span className="today-week"> {weatherState.week} </span></div>
        {/* <div className="today-title">
          <span>{weatherState.week}</span>
          <span>{weatherState.wea}</span>
        </div> */}
      </div>
      {/* <div className="time">{time}</div> */}
    </div >
  )
}
export default Weather

