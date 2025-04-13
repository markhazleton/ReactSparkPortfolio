import React, { useState, useEffect } from 'react';
import { 
  GeoAlt, 
  Thermometer, 
  Droplet, 
  Wind, 
  Eye, 
  CloudFill, 
  Calendar3, 
  Clock, 
  Search,
  ExclamationTriangle,
  ArrowClockwise
} from 'react-bootstrap-icons';
import MapComponent from './MapComponent';

const WeatherForecast: React.FC = () => {
  const [city, setCity] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Load recent searches from localStorage on component mount
  useEffect(() => {
    const savedSearches = localStorage.getItem('weatherSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
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
    } catch (err: any) {
      if (err.message === '429') {
        setError('Maximum request limit reached. Please try again later.');
      } else {
        setError(`Failed to fetch weather data: ${err.message}`);
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
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-primary text-white">
              <h2 className="h4 mb-0">
                <Thermometer className="me-2" /> Weather Forecast
              </h2>
            </div>
            <div className="card-body">
              <form>
                <div className="input-group mb-3">
                  <span className="input-group-text bg-light">
                    <Search />
                  </span>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Enter city or zip code"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <button
                    className="btn btn-primary"
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
                  <small className="text-muted d-block mb-2">Recent searches:</small>
                  <div className="d-flex flex-wrap gap-2">
                    {recentSearches.map((location, index) => (
                      <button
                        key={index}
                        className="btn btn-sm btn-outline-secondary"
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

              {/* Weather data */}
              {weatherData && (
                <div className="mt-4">
                  <div className="card border-primary mb-4">
                    <div className="card-header bg-primary text-white">
                      <h3 className="h5 mb-0 d-flex align-items-center">
                        <GeoAlt className="me-2" />
                        Weather in {weatherData.location.name}
                      </h3>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-6 mb-4 mb-md-0">
                          <div className="d-flex align-items-center mb-4">
                            <div className="display-4 me-3">
                              {weatherData.currentConditions.temperature.toFixed(1)}°F
                            </div>
                            <div>
                              <div className="h5">{weatherData.currentConditions.conditionsDescription}</div>
                              <div className="text-muted">
                                Feels like {weatherData.currentConditions.feelsLike?.toFixed(1) || '--'}°F
                              </div>
                            </div>
                          </div>

                          <div className="row g-3">
                            <div className="col-6">
                              <div className="d-flex align-items-center">
                                <Droplet className="text-primary me-2" />
                                <div>
                                  <div className="text-muted small">Humidity</div>
                                  <div>{weatherData.currentConditions.humidity}%</div>
                                </div>
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="d-flex align-items-center">
                                <CloudFill className="text-primary me-2" />
                                <div>
                                  <div className="text-muted small">Cloud Cover</div>
                                  <div>{weatherData.currentConditions.cloudCover}%</div>
                                </div>
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="d-flex align-items-center">
                                <Wind className="text-primary me-2" />
                                <div>
                                  <div className="text-muted small">Wind</div>
                                  <div>
                                    {weatherData.currentConditions.windSpeed.toFixed(1)} mph
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="d-flex align-items-center">
                                <Eye className="text-primary me-2" />
                                <div>
                                  <div className="text-muted small">Visibility</div>
                                  <div>
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
                    <div className="card-footer bg-white text-muted small">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <Calendar3 className="me-1" /> 
                          Last updated: {new Date(weatherData.fetchTime).toLocaleString()}
                        </div>
                        <button 
                          className="btn btn-sm btn-outline-secondary d-flex align-items-center"
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
        </div>
      </div>
    </div>
  );
};

export default WeatherForecast;