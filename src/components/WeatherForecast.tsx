import React, { useState, useEffect } from 'react';
import { 
  GeoAlt, 
  Thermometer, 
  Droplet, 
  Wind, 
  Eye, 
  CloudFill, 
  Calendar3, 
  Search,
  ExclamationTriangle,
  ArrowClockwise,
  InfoCircle
} from 'react-bootstrap-icons';
import MapComponent from './MapComponent';
import { useTheme } from '../contexts/ThemeContext';

// Define a type for weather data to avoid using 'any'
interface WeatherData {
  success: boolean;
  location: {
    name: string;
    latitude: number;
    longitude: number;
  };
  currentConditions: {
    temperature: number;
    feelsLike?: number;
    conditionsDescription: string;
    humidity: number;
    cloudCover: number;
    windSpeed: number;
    visibility: number;
  };
  fetchTime: string;
}

// Type for storing multiple weather data
interface WeatherResults {
  [city: string]: WeatherData;
}

const WeatherForecast: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [city, setCity] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [initialWeatherData, setInitialWeatherData] = useState<WeatherResults>({});
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Load recent searches from localStorage on component mount
  useEffect(() => {
    const savedSearches = localStorage.getItem('weatherSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    } else {
      // Set default cities if no recent searches exist
      const defaultCities = ['Dallas', 'Wichita'];
      setRecentSearches(defaultCities);
      localStorage.setItem('weatherSearches', JSON.stringify(defaultCities));
    }
  }, []);

  // Load default city weather on initial render
  useEffect(() => {
    const defaultCities = ['Dallas', 'Wichita'];
    
    const fetchInitialWeather = async () => {
      setInitialLoading(true);
      
      try {
        const results: WeatherResults = {};
        
        // Fetch weather for both cities in parallel
        await Promise.all(
          defaultCities.map(async (defaultCity) => {
            try {
              const response = await fetch(
                `https://webspark.markhazleton.com/api/asyncspark/openweatherapi/weather?location=${defaultCity}`
              );
              
              if (!response.ok) {
                throw new Error(`Error fetching ${defaultCity} weather: ${response.status}`);
              }
              
              const data = await response.json();
              if (data.success) {
                results[defaultCity] = data;
              }
            } catch (error) {
              console.error(`Failed to fetch weather for ${defaultCity}:`, error);
            }
          })
        );
        
        setInitialWeatherData(results);
      } catch (err) {
        console.error('Error fetching initial weather data:', err);
      } finally {
        setInitialLoading(false);
      }
    };
    
    fetchInitialWeather();
  }, []);

  // Save recent searches to localStorage
  const saveSearch = (location: string) => {
    if (!location || recentSearches.includes(location)) return;
    
    const updatedSearches = [location, ...recentSearches.slice(0, 4)];
    setRecentSearches(updatedSearches);
    localStorage.setItem('weatherSearches', JSON.stringify(updatedSearches));
  };

  const fetchWeather = async (searchCity: string = city) => {
    if (!searchCity) return;

    setLoading(true);
    setError('');
    setWeatherData(null);

    try {
      const response = await fetch(
        `https://webspark.markhazleton.com/api/asyncspark/openweatherapi/weather?location=${searchCity}`
      );

      if (response.status === 429) {
        throw new Error('429');
      }

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        setWeatherData(data);
        saveSearch(searchCity);
      } else {
        setError('Failed to fetch weather data. Please try again.');
      }
    } catch (err: Error | unknown) {
      if (err instanceof Error) {
        if (err.message === '429') {
          setError('Maximum request limit reached. Please try again later.');
        } else {
          setError(`Failed to fetch weather data: ${err.message}`);
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      fetchWeather();
    }
  };

  const handleRecentSearch = (location: string) => {
    setCity(location);
    fetchWeather(location);
  };

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-lg-8 mx-auto">
          <div className={`card shadow-sm ${isDark ? 'border-secondary' : 'border-0'} mb-4`}>
            <div className={`card-header ${isDark ? 'bg-dark text-light' : 'bg-primary text-white'}`}>
              <h1 className="h4 mb-0">
                <Thermometer className="me-2" /> Weather Forecast
              </h1>
            </div>
            <div className={`card-body ${isDark ? 'bg-dark text-light' : ''}`}>
              <form>
                <div className="input-group mb-3">
                  <span className={`input-group-text ${isDark ? 'bg-dark text-light border-secondary' : 'bg-light'}`}>
                    <Search />
                  </span>
                  <input
                    type="text"
                    className={`form-control form-control-lg ${isDark ? 'bg-dark text-light border-secondary' : ''}`}
                    placeholder="Enter city or zip code"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <button
                    className={`btn ${isDark ? 'btn-outline-light' : 'btn-primary'}`}
                    type="button"
                    onClick={() => fetchWeather()}
                    disabled={!city || loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Loading...
                      </>
                    ) : (
                      <>Get Forecast</>
                    )}
                  </button>
                </div>
              </form>
              
              {/* Recent searches */}
              {recentSearches.length > 0 && (
                <div className="mb-4">
                  <small className={`${isDark ? 'text-light-emphasis' : 'text-secondary'} d-block mb-2`}>Recent searches:</small>
                  <div className="d-flex flex-wrap gap-2">
                    {recentSearches.map((location, index) => (
                      <button
                        key={index}
                        className={`btn btn-sm ${isDark ? 'btn-outline-light' : 'btn-outline-secondary'}`}
                        onClick={() => handleRecentSearch(location)}
                      >
                        {location}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Error message */}
              {error && (
                <div className="alert alert-danger d-flex align-items-center" role="alert">
                  <ExclamationTriangle className="me-2 flex-shrink-0" />
                  <div>{error}</div>
                </div>
              )}

              {/* Default Cities Weather Data */}
              {!weatherData && !error && (
                <>
                  {initialLoading ? (
                    <div className="text-center my-5">
                      <div className={`spinner-border ${isDark ? 'text-light' : 'text-primary'}`} role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <p className={`mt-3 ${isDark ? '' : 'text-dark'}`}>Loading weather for default cities...</p>
                    </div>
                  ) : (
                    <div className="mt-4">
                      <h3 className={`h5 mb-3 ${isDark ? '' : 'text-dark'}`}>Default Cities Weather</h3>
                      <div className="row">
                        {Object.keys(initialWeatherData).map((cityName) => {
                          const data = initialWeatherData[cityName];
                          return (
                            <div className="col-md-6 mb-4" key={cityName}>
                              <div className={`card h-100 ${isDark ? 'bg-dark text-light border-primary' : 'border-primary'}`}>
                                <div className={`card-header ${isDark ? 'bg-dark border-primary' : 'bg-primary'}`}>
                                  <h4 className="h6 mb-0 d-flex align-items-center text-white">
                                    <GeoAlt className="me-2" />
                                    Weather in {data.location.name}
                                  </h4>
                                </div>
                                <div className="card-body">
                                  <div className="d-flex align-items-center mb-3">
                                    <div className={`h2 me-2 ${isDark ? '' : 'text-dark'}`}>
                                      {data.currentConditions.temperature.toFixed(1)}°F
                                    </div>
                                    <div>
                                      <div className={isDark ? '' : 'text-dark'}>{data.currentConditions.conditionsDescription}</div>
                                      <div className={`small ${isDark ? 'text-light-emphasis' : 'text-secondary'}`}>
                                        Feels like {data.currentConditions.feelsLike?.toFixed(1) || '--'}°F
                                      </div>
                                    </div>
                                  </div>
                                  <div className="row g-2 small">
                                    <div className="col-6">
                                      <div className="d-flex align-items-center">
                                        <Droplet className={`${isDark ? 'text-light' : 'text-primary'} me-1`} />
                                        <div>
                                          <div className={isDark ? 'text-light-emphasis' : 'text-secondary'}>Humidity</div>
                                          <div className={isDark ? '' : 'text-dark'}>{data.currentConditions.humidity}%</div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-6">
                                      <div className="d-flex align-items-center">
                                        <Wind className={`${isDark ? 'text-light' : 'text-primary'} me-1`} />
                                        <div>
                                          <div className={isDark ? 'text-light-emphasis' : 'text-secondary'}>Wind</div>
                                          <div className={isDark ? '' : 'text-dark'}>{data.currentConditions.windSpeed.toFixed(1)} mph</div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className={`card-footer border-top-0 text-center ${isDark ? 'bg-dark' : 'bg-white'}`}>
                                  <button
                                    className={`btn ${isDark ? 'btn-outline-light' : 'btn-outline-primary'} btn-sm`}
                                    onClick={() => handleRecentSearch(cityName)}
                                  >
                                    <ArrowClockwise className="me-1" /> Refresh
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Weather data */}
              {weatherData && (
                <div className="mt-4">
                  <div className={`card ${isDark ? 'bg-dark text-light border-primary' : 'border-primary'} mb-4`}>
                    <div className={`card-header ${isDark ? 'bg-dark border-primary' : 'bg-primary'}`}>
                      <h3 className="h5 mb-0 d-flex align-items-center text-white">
                        <GeoAlt className="me-2" />
                        Weather in {weatherData.location.name}
                      </h3>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-6 mb-4 mb-md-0">
                          <div className="d-flex align-items-center mb-4">
                            <div className={`display-4 me-3 ${isDark ? '' : 'text-dark'}`}>
                              {weatherData.currentConditions.temperature.toFixed(1)}°F
                            </div>
                            <div>
                              <div className={`h5 ${isDark ? '' : 'text-dark'}`}>{weatherData.currentConditions.conditionsDescription}</div>
                              <div className={isDark ? 'text-light-emphasis' : 'text-secondary'}>
                                Feels like {weatherData.currentConditions.feelsLike?.toFixed(1) || '--'}°F
                              </div>
                            </div>
                          </div>

                          <div className="row g-3">
                            <div className="col-6">
                              <div className="d-flex align-items-center">
                                <Droplet className={`${isDark ? 'text-light' : 'text-primary'} me-2`} />
                                <div>
                                  <div className={`small ${isDark ? 'text-light-emphasis' : 'text-secondary'}`}>Humidity</div>
                                  <div className={isDark ? '' : 'text-dark'}>{weatherData.currentConditions.humidity}%</div>
                                </div>
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="d-flex align-items-center">
                                <CloudFill className={`${isDark ? 'text-light' : 'text-primary'} me-2`} />
                                <div>
                                  <div className={`small ${isDark ? 'text-light-emphasis' : 'text-secondary'}`}>Cloud Cover</div>
                                  <div className={isDark ? '' : 'text-dark'}>{weatherData.currentConditions.cloudCover}%</div>
                                </div>
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="d-flex align-items-center">
                                <Wind className={`${isDark ? 'text-light' : 'text-primary'} me-2`} />
                                <div>
                                  <div className={`small ${isDark ? 'text-light-emphasis' : 'text-secondary'}`}>Wind</div>
                                  <div className={isDark ? '' : 'text-dark'}>
                                    {weatherData.currentConditions.windSpeed.toFixed(1)} mph
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="d-flex align-items-center">
                                <Eye className={`${isDark ? 'text-light' : 'text-primary'} me-2`} />
                                <div>
                                  <div className={`small ${isDark ? 'text-light-emphasis' : 'text-secondary'}`}>Visibility</div>
                                  <div className={isDark ? '' : 'text-dark'}>
                                    {weatherData.currentConditions.visibility.toFixed(1)} mi
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="rounded overflow-hidden shadow-sm map-container">
                            <MapComponent
                              latitude={weatherData.location.latitude}
                              longitude={weatherData.location.longitude}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={`card-footer ${isDark ? 'bg-dark border-secondary' : 'bg-white'} small`}>
                      <div className="d-flex justify-content-between align-items-center">
                        <div className={isDark ? 'text-light-emphasis' : 'text-secondary'}>
                          <Calendar3 className="me-1" /> 
                          Last updated: {new Date(weatherData.fetchTime).toLocaleString()}
                        </div>
                        <button 
                          className={`btn btn-sm ${isDark ? 'btn-outline-light' : 'btn-outline-secondary'} d-flex align-items-center`}
                          onClick={() => fetchWeather(weatherData.location.name)}
                        >
                          <ArrowClockwise className="me-1" /> Refresh
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* SEO-friendly Information Section */}
          <div className={`card shadow-sm ${isDark ? 'bg-dark text-light border-secondary' : 'border-0'} mb-4`}>
            <div className={`card-header ${isDark ? 'bg-dark border-secondary' : 'bg-light'}`}>
              <h2 className={`h5 mb-0 d-flex align-items-center ${isDark ? 'text-light' : 'text-dark'}`}>
                <InfoCircle className="me-2" /> About Our Weather Forecast Tool
              </h2>
            </div>
            <div className="card-body">
              <h3 className={`h6 ${isDark ? '' : 'text-dark'}`}>How It Works</h3>
              <p className={isDark ? '' : 'text-dark'}>
                Our weather forecast tool provides real-time weather data for cities across the globe. Simply enter a city name 
                or zip code in the search box above to get instant access to current weather conditions. 
                Our default cities include Dallas and Wichita, but you can search for any location worldwide.
              </p>
              
              <h3 className={`h6 ${isDark ? '' : 'text-dark'}`}>Data Source</h3>
              <p className={isDark ? '' : 'text-dark'}>
                The weather data displayed on this page is powered by the OpenWeather API, accessed through our secure backend service. 
                When you search for a location, a request is sent to our secured WebSpark API service, which then fetches 
                the most up-to-date weather information while keeping API credentials protected.
              </p>
              
              <h3 className={`h6 ${isDark ? '' : 'text-dark'}`}>Features</h3>
              <div className="row">
                <div className="col-md-6">
                  <ul className={isDark ? '' : 'text-dark'}>
                    <li>Current temperature and "feels like" temperature</li>
                    <li>Weather condition descriptions (Clear, Cloudy, Rain, etc.)</li>
                    <li>Humidity percentage</li>
                    <li>Cloud cover percentage</li>
                  </ul>
                </div>
                <div className="col-md-6">
                  <ul className={isDark ? '' : 'text-dark'}>
                    <li>Wind speed in miles per hour</li>
                    <li>Visibility distance in miles</li>
                    <li>Interactive map showing the location</li>
                    <li>Recent search history saved locally for quick access</li>
                  </ul>
                </div>
              </div>
              
              <h3 className={`h6 ${isDark ? '' : 'text-dark'}`}>Implementation Details</h3>
              <p className={isDark ? '' : 'text-dark'}>
                This weather forecast tool is built using React with TypeScript. It utilizes React hooks for state management 
                and localStorage for persisting your recent searches. The interactive map is implemented using a custom MapComponent 
                that pinpoints the exact coordinates of the queried location. All weather data is updated in real-time 
                whenever you search for a new location or refresh an existing one.
              </p>
              
              <h3 className={`h6 ${isDark ? '' : 'text-dark'}`}>Usage Tips</h3>
              <p className={isDark ? '' : 'text-dark'}>
                To get the most accurate forecast, enter a specific city name. You can also include the state or country 
                for more precise results (e.g., "Dallas, TX" or "Paris, France"). Your recent searches are saved 
                for convenience, allowing you to quickly check weather updates for your frequently visited locations.
              </p>
              
              <div className={`mt-4 border-top pt-3 ${isDark ? 'border-secondary' : ''}`}>
                <small className={isDark ? 'text-light-emphasis' : 'text-secondary'}>
                  Last updated: April 14, 2025. Weather data is refreshed each time you perform a search or click the refresh button.
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherForecast;