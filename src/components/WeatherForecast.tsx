import React, { useState } from 'react';
import { Container, Form, Button, Card, Row, Col, Spinner } from 'react-bootstrap';
import MapComponent from './MapComponent';  // Import the MapComponent

const WeatherForecast: React.FC = () => {
  const [city, setCity] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const fetchWeather = async () => {
    setLoading(true);
    setError('');  // Reset error message before fetching
    setWeatherData(null);  // Clear previous weather data

    try {
      const response = await fetch(
        `https://webspark.markhazleton.com/api/asyncspark/openweatherapi/weather?location=${city}`
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        setWeatherData(data);
      } else {
        setError('Failed to fetch weather data. Please try again.');
      }
    } catch (err: any) {
      setError(`Failed to fetch weather data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4">Weather Forecast</h1>
      <Form>
        <Row className="mb-3">
          <Col md={8}>
            <Form.Control 
              type="text" 
              placeholder="Enter city" 
              value={city} 
              onChange={(e) => setCity(e.target.value)} 
            />
          </Col>
          <Col md={4}>
            <Button 
              variant="primary" 
              onClick={fetchWeather}
              disabled={!city || loading}
            >
              {loading ? <Spinner animation="border" size="sm" /> : 'Get Forecast'}
            </Button>
          </Col>
        </Row>
      </Form>

      {/* Error message */}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Weather data */}
      {weatherData && (
        <>
          <Card className="mt-4 shadow border-primary">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0 text-white">
                <i className="bi bi-geo-alt-fill"></i> Weather in {weatherData.location.name}
              </h5>
            </Card.Header>
            <Card.Body className="bg-light">
              <Row>
                <Col md={6}>
                <Row>
                <Col md={6}>
                  <p><strong>Temperature:</strong> {weatherData.currentConditions.temperature.toFixed(1)}°F</p>
                  <p><strong>Conditions:</strong> {weatherData.currentConditions.conditionsDescription}</p>
                  <p><strong>Humidity:</strong> {weatherData.currentConditions.humidity}%</p>
                </Col>
                <Col md={6}>
                  <p><strong>Pressure:</strong> {weatherData.currentConditions.pressure.toFixed(2)} hPa</p>
                  <p><strong>Wind:</strong> {weatherData.currentConditions.windSpeed.toFixed(1)} mph, {weatherData.currentConditions.windDirection.name}</p>
                  <p><strong>Visibility:</strong> {weatherData.currentConditions.visibility.toFixed(1)} miles</p>
                </Col>
              </Row>
              <Row className="mt-3">
                <Col>
                  <p><strong>Cloud Cover:</strong> {weatherData.currentConditions.cloudCover}%</p>
                  <p><strong>Last Observed:</strong> {new Date(weatherData.observationTimeUtc).toLocaleTimeString()} UTC</p>
                </Col>
              </Row>
                </Col>
                <Col md={6}>
                <h5>Location Map</h5>
                <MapComponent 
                  latitude={weatherData.location.latitude} 
                  longitude={weatherData.location.longitude}   />
                </Col>
              </Row>


            </Card.Body>
            <Card.Footer className="text-muted">
              Data fetched at {new Date(weatherData.fetchTime).toLocaleString()}
            </Card.Footer>
          </Card>

        </>
      )}
    </Container>
  );
};

export default WeatherForecast;
