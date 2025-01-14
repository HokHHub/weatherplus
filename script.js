// ИКОНКИ
let humidity = document.querySelector('.more__img_humidity')
let wind = document.querySelector('.more__img_wind')
let pressure = document.querySelector('.more__img_pressure')
let uv = document.querySelector('.more__img_uv')
let sunriseAndSunset = document.querySelectorAll('.weather__sun_ico')

// 1 БЛОК
let mainCity = document.querySelector('.information__city')
let time = document.querySelector('.information__time')
let date = document.querySelector('.information__date')
let hedSearch = document.querySelector('.header__search')
let tumbler = document.querySelector('.switchtheme__tumbler')

// 2 БЛОК !!!
let mainTemp = document.querySelector('.weather__temp')
let feelTemp = document.querySelector('.weather__feel_temp')

let sun = document.querySelectorAll('.weather__sun_subtext')
// [0] - sunrise
// [1] - sunset


let weatherICO = document.querySelector('.weather__simple_ico')
let weatherINFO = document.querySelector('.weather__simple_text')

let switchText = document.querySelector('.switchtheme__mode')

let extraINFO = document.querySelectorAll('.more__text')
// [0] - Humidity
// [1] - Wind
// [2] - Pressure
// [3] - UV


// FORECAST !!!
let blockImg = document.querySelectorAll('.block__img')
let blockText = document.querySelectorAll('.block__text')
let blockDate = document.querySelectorAll('.block__date')


// HOURLY FORECAST !!!
let blockHour = document.querySelectorAll('.block__hour')
let blockICO = document.querySelectorAll('.block__ico')
let blockNavigate = document.querySelectorAll('.block__navigate')
let blockTemp = document.querySelectorAll('.block__temp')
let blockWind = document.querySelectorAll('.block__wind')
let block = document.querySelectorAll('.blocks__block')


let form = document.querySelector('.form')
let input = document.querySelector('.form__input')

let switchTheme = document.querySelector('.switchtheme__ellipse')

let goSearch = document.querySelector('.form__img')

let ellipse = document.querySelector('.switchtheme__ellipse')

let toLocation = document.querySelector('.header__button')


// API
let api = 'd47083b2cf007ead6de0f6fb9902daf3'
let IPapi = 'at_BDy7TyouEuDcUa28z5Bi5DgrL3Kn5'

let darkQuery = "(prefers-color-scheme: dark)";
let isDark = window.matchMedia(darkQuery).matches;



getForecastWeatherByCityName('Moscow')
getWeatherByCityName('Moscow')

function enableLocation(data) {

    toLocation.addEventListener('click', () => {
        let lat = data.coords.latitude
        let lon = data.coords.longitude

        getWeatherByCoords(lat, lon)
        getCityNameByCoords(lat, lon)
    })
}

function disableLocation() {
    toLocation.addEventListener('click', () => {
        getCityByIP()
    })
}

navigator.geolocation.getCurrentPosition(enableLocation, disableLocation);

function convertUNIX(dt, sunrise, sunset, timezone) {
    let date = new Date();
    let now_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(),
        date.getUTCDate(), date.getUTCHours(),
        date.getUTCMinutes(), date.getUTCSeconds());

    date = new Date(now_utc);

    let utc = date.toISOString();

    let hour = utc.substring(11, 13)
    let minuts = utc.substring(14, 16)
    hour = Number(hour)
    let tet = Number(hour) + Number(timezone / 60 / 60)
    if ((hour + (timezone / 60 / 60)) >= 24) {
        hour -= 24
        time.innerText = ('0' + Number(hour) + (timezone / 60 / 60)) + ':' + minuts
    } else if (String(tet)[1] == undefined) {
        time.innerText = ('0' + (Number(hour) + (timezone / 60 / 60))) + ':' + minuts
    } else {
        time.innerText = (Number(hour) + (timezone / 60 / 60)) + ':' + minuts
    }


    let dateSunrise = new Date(sunrise * 1000)
    let hoursSunrise = dateSunrise.getHours()
    let minutesSunrise = dateSunrise.getMinutes()
    sun[0].innerText = hoursSunrise + ':' + minutesSunrise + ' AM'

    let dateSunset = new Date(sunset * 1000)
    let hoursSunset = dateSunset.getHours()
    let minutesSunset = dateSunset.getMinutes()
    sun[1].innerText = hoursSunset + ':' + minutesSunset + ' AM'
}

form.addEventListener('submit', (event) => {
    event.preventDefault()

    if (input.value != '') {
        getWeatherByCityName(input.value)
        getForecastWeatherByCityName(input.value)
    }
})

goSearch.addEventListener('click', () => {
    if (input.value != '') {
        getWeatherByCityName(input.value)
        getForecastWeatherByCityName(input.value)
    }
})

function renderContent(data) {
    if (data.weather != undefined) {
        mainCity.innerText = data.name
        convertUNIX(data.dt, data.sys.sunrise, data.sys.sunset, data.timezone)
        let today = new Date();
        today = String(today)

        date.innerText = today.substring(0, 3) + 'day' + ', ' + today.substring(8, 10) + ' ' + today.substring(4, 7)

        mainTemp.innerText = Math.floor(data.main.temp) + '°C'
        feelTemp.innerText = Math.floor(data.main.feels_like) + '°C'

        extraINFO[0].innerText = data.main.humidity + '%'
        extraINFO[1].innerText = Math.round(data.wind.speed, 0) + 'km/h'
        extraINFO[2].innerText = data.main.pressure + 'hPa'

        weatherINFO.innerText = data.weather[0].main
        weatherICO.setAttribute('src', `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`)
    }

}

function renderForecast(data) {
    if (data.list != undefined) {
        
        let index = 0
        while (index <= 4) {
            

            blockHour[index].innerText = (data.list[index].dt_txt).substring(11, 16)
            blockWind[index].innerText = Math.round(data.list[index].wind.speed, 0) + 'km/h'
            blockTemp[index].innerText = Math.round(data.list[index].main.temp) + '°C'
            blockNavigate[index].style.transform = `rotate( ${data.list[index].wind.deg}deg)`
            blockICO[index].setAttribute('src', `https://openweathermap.org/img/wn/${data.list[index].weather[0].icon}@2x.png`)


            let currentTheme = document.body.className;

            index += 1

        }

        if (switchText.innerText == 'Light Mode') {
            index = 0
            while (index <= 4) {
    
                let hour = blockHour[index].innerHTML.substring(0, 2)
    
                if (hour[0] == '0') {
    
                    hour = hour.substring(1, 2)
                    hour = Number(hour)
    
                    if (hour <= 18 && hour >= 6) {
                        block[index].classList.add('orange')
                    } else {
                        block[index].classList.add('dark')
                    }
                } else if (hour <= 18 && hour >= 6) {
                    block[index].classList.add('orange')
                } else {
                    block[index].classList.add('dark')
                }
                index += 1
            }
        }
        

        index = 0
        let i = 0
        while (index <= 40) {
            blockText[i].innerText = Math.round(data.list[index].main.temp, 0) + '°C'
            let today = new Date(data.list[index].dt * 1000);

            today = String(today)

            blockImg[i].setAttribute('src', `https://openweathermap.org/img/wn/${data.list[index].weather[0].icon}@2x.png`)
            let days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
            let indexDays = 0
            if (today.substring(0, 3) == 'Mon') {
                indexDays = 0
            } else if (today.substring(0, 3) == 'Tue') {
                indexDays = 1
            }
            else if (today.substring(0, 3) == 'Wed') {
                indexDays = 2
            }
            else if (today.substring(0, 3) == 'Thu') {
                indexDays = 3
            }
            else if (today.substring(0, 3) == 'Fri') {
                indexDays = 4
            }
            else if (today.substring(0, 3) == 'Sat') {
                indexDays = 5
            }
            else if (today.substring(0, 3) == 'Sub') {
                indexDays = 6
            }
            blockDate[i].innerText = days[indexDays] + ', ' + today.substring(8, 10) + ' ' + today.substring(4, 7)
            index += 8
            if (i != 4) {
                i += 1
            }
        }
    }



}

async function getCityNameByCoords(lat, lon) {
    const geo = await fetch(`http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&appid=${api}`)
    const data = await geo.json()

    getForecastWeatherByCityName(data[0].name)
}

async function getWeatherByCityName(cityName) {
    const geo = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${api}`)
    const data = await geo.json()
    renderContent(data)

}

async function getCityByIP() {
    const getIP = await fetch('https://api64.ipify.org?format=json')
    const IP = await getIP.json()

    const geo = await fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=${IPapi}&ipAddress=${IP.ip}`)
    const data = await geo.json()

    getWeatherByCityName(data.location.city)
    getForecastWeatherByCityName(data.location.city)
}

async function getForecastWeatherByCityName(cityName) {
    const geo = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&cnt=40&appid=${api}`)
    const data = await geo.json()

    renderForecast(data)

}

async function getWeatherByCoords(lat, lon) {
    const geo = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${api}`)
    const data = await geo.json()
    renderContent(data)

}

switchTheme.addEventListener('click', () => {
    let currentTheme = document.body.className;
    if (currentTheme === 'light-theme') {
        toDark()

    } else {
        toLight()
        }
    }
)

function toDark() {
    document.body.className = 'dark-theme';
    document.documentElement.style.setProperty('--theme-color', '#444');
    document.documentElement.style.setProperty('--textTheme-color', '#FFF');
    document.documentElement.style.setProperty('--rgbaTheme-color', 'rgba(255, 255, 255, 0.80)');
    document.documentElement.style.setProperty('--hourlyTheme-color', '#373636');
    document.documentElement.style.setProperty('--input-color', 'rgba(255, 255, 255, 0.6)');
    switchText.innerText = 'Dark Mode'

    hedSearch.classList.remove('borderBlack')
    tumbler.classList.remove('borderBlackRadius')

    let index = 0
    while (index <= 4) {
        block[index].classList.remove('dark')
        block[index].classList.remove('orange')
        index += 1
    }

    ellipse.classList.remove('switchtheme__ellipse_light')

    humidity.setAttribute('src', './icons/white/humidity.png')
    wind.setAttribute('src', './icons/white/wind.png')
    pressure.setAttribute('src', './icons/white/pressure.png')
    uv.setAttribute('src', './icons/white/uv.png')
    sunriseAndSunset[0].setAttribute('src', './icons/white/sunrise.png')
    sunriseAndSunset[1].setAttribute('src', './icons/white/sunset.png')
}

function toLight() {
    document.body.className = 'light-theme';
    document.documentElement.style.setProperty('--theme-color', '#D9D9D9');
    document.documentElement.style.setProperty('--textTheme-color', '#292929');
    document.documentElement.style.setProperty('--rgbaTheme-color', '#292929');
    document.documentElement.style.setProperty('--input-color', '#292929');
    switchText.innerText = 'Light Mode'

    hedSearch.classList.add('borderBlack')
    tumbler.classList.add('borderBlackRadius')


    ellipse.classList.add('switchtheme__ellipse_light')
    humidity.setAttribute('src', './icons/black/humidity.png')
    wind.setAttribute('src', './icons/black/wind.png')
    pressure.setAttribute('src', './icons/black/pressure.png')
    uv.setAttribute('src', './icons/black/uv.png')
    sunriseAndSunset[0].setAttribute('src', './icons/black/sunrise.png')
    sunriseAndSunset[1].setAttribute('src', './icons/black/sunset.png')
}
 
if (isDark) {
   toDark()
} else if (!isDark) {
    toLight()
}