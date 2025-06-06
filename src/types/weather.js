/**
 * @typedef {Object} WeatherData
 * @property {CurrentWeather} current
 * @property {Forecast} forecast
 * @property {Location} location
 */

/**
 * @typedef {Object} CurrentWeather
 * @property {Condition} condition
 * @property {number} feelslike_c
 * @property {number} feelslike_f
 * @property {number} humidity
 * @property {number} is_day
 * @property {string} last_updated
 * @property {number} precip_in
 * @property {number} precip_mm
 * @property {number} pressure_in
 * @property {number} pressure_mb
 * @property {number} temp_c
 * @property {number} temp_f
 * @property {number} uv
 * @property {number} vis_km
 * @property {number} vis_miles
 * @property {number} wind_degree
 * @property {string} wind_dir
 * @property {number} wind_kph
 * @property {number} wind_mph
 * @property {AirQuality} [air_quality]
 */

/**
 * @typedef {Object} Condition
 * @property {string} text
 * @property {string} icon
 * @property {number} code
 */

/**
 * @typedef {Object} AirQuality
 * @property {number} co
 * @property {number} no2
 * @property {number} o3
 * @property {number} pm2_5
 * @property {number} pm10
 * @property {number} so2
 */

/**
 * @typedef {Object} Forecast
 * @property {ForecastDay[]} forecastday
 */

/**
 * @typedef {Object} ForecastDay
 * @property {string} date
 * @property {number} date_epoch
 * @property {Day} day
 * @property {Astro} astro
 * @property {Hour[]} hour
 */

/**
 * @typedef {Object} Day
 * @property {number} maxtemp_c
 * @property {number} maxtemp_f
 * @property {number} mintemp_c
 * @property {number} mintemp_f
 * @property {number} avgtemp_c
 * @property {number} avgtemp_f
 * @property {number} maxwind_mph
 * @property {number} maxwind_kph
 * @property {number} totalprecip_mm
 * @property {number} totalprecip_in
 * @property {number} totalsnow_cm
 * @property {number} avgvis_km
 * @property {number} avgvis_miles
 * @property {number} avghumidity
 * @property {number} daily_will_it_rain
 * @property {number} daily_chance_of_rain
 * @property {number} daily_will_it_snow
 * @property {number} daily_chance_of_snow
 * @property {Condition} condition
 * @property {number} uv
 */

/**
 * @typedef {Object} Astro
 * @property {string} sunrise
 * @property {string} sunset
 * @property {string} moonrise
 * @property {string} moonset
 * @property {string} moon_phase
 * @property {string} moon_illumination
 * @property {number} is_moon_up
 * @property {number} is_sun_up
 */

/**
 * @typedef {Object} Hour
 * @property {number} time_epoch
 * @property {string} time
 * @property {number} temp_c
 * @property {number} temp_f
 * @property {number} is_day
 * @property {Condition} condition
 * @property {number} wind_mph
 * @property {number} wind_kph
 * @property {number} wind_degree
 * @property {string} wind_dir
 * @property {number} pressure_mb
 * @property {number} pressure_in
 * @property {number} precip_mm
 * @property {number} precip_in
 * @property {number} humidity
 * @property {number} cloud
 * @property {number} feelslike_c
 * @property {number} feelslike_f
 * @property {number} windchill_c
 * @property {number} windchill_f
 * @property {number} heatindex_c
 * @property {number} heatindex_f
 * @property {number} dewpoint_c
 * @property {number} dewpoint_f
 * @property {number} will_it_rain
 * @property {number} chance_of_rain
 * @property {number} will_it_snow
 * @property {number} chance_of_snow
 * @property {number} vis_km
 * @property {number} vis_miles
 * @property {number} gust_mph
 * @property {number} gust_kph
 * @property {number} uv
 */

/**
 * @typedef {Object} Location
 * @property {string} name
 * @property {string} region
 * @property {string} country
 * @property {number} lat
 * @property {number} lon
 * @property {string} tz_id
 * @property {number} localtime_epoch
 * @property {string} localtime
 */

/**
 * @typedef {'metric' | 'imperial'} UnitSystem
 */