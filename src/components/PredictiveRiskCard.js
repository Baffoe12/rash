import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, CircularProgress, Box } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = process.env.REACT_APP_API_URL || "https://fire-h0u2.onrender.com";

const weatherIcons = {
  'clear sky': 'https://openweathermap.org/img/wn/01d.png',
  'few clouds': 'https://openweathermap.org/img/wn/02d.png',
  'scattered clouds': 'https://openweathermap.org/img/wn/03d.png',
  'broken clouds': 'https://openweathermap.org/img/wn/04d.png',
  'shower rain': 'https://openweathermap.org/img/wn/09d.png',
  rain: 'https://openweathermap.org/img/wn/10d.png',
  thunderstorm: 'https://openweathermap.org/img/wn/11d.png',
  snow: 'https://openweathermap.org/img/wn/13d.png',
  mist: 'https://openweathermap.org/img/wn/50d.png',
};

function getWeatherIcon(condition) {
  if (!condition) return null;
  const key = condition.toLowerCase();
  for (const iconKey in weatherIcons) {
    if (key.includes(iconKey)) {
      return weatherIcons[iconKey];
    }
  }
  return null;
}

export default function PredictiveRiskCard({ lat, lng, timestamp }) {
  const [riskData, setRiskData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchRiskData() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          API_URL + '/api/predictive-risk?lat=' + lat + '&lng=' + lng + '&timestamp=' + timestamp
        );
        if (!response.ok) {
          throw new Error('Failed to fetch risk data');
        }
        const data = await response.json();
        setRiskData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (lat && lng && timestamp) {
      fetchRiskData();
    }
  }, [lat, lng, timestamp]);

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={100}>
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent>
          <Typography color="error">Error: {error}</Typography>
        </CardContent>
      </Card>
    );
  }

  if (!riskData) {
    return null;
  }

  const weatherIcon = getWeatherIcon(riskData.weatherCondition);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Predictive Risk Score
            </Typography>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{ display: 'inline-block' }}
            >
              <Typography
                variant="h4"
                color={
                  riskData.riskScore > 70
                    ? 'error'
                    : riskData.riskScore > 40
                    ? 'warning.main'
                    : 'success.main'
                }
              >
                {riskData.riskScore}%
              </Typography>
            </motion.div>
            <Typography variant="body2" gutterBottom>
              Accidents in area (last 7 days): {riskData.accidentsCount}
            </Typography>
            <Typography variant="body2" gutterBottom>
              Sensor events in area (last 7 days): {riskData.sensorEventsCount}
            </Typography>
            <Box display="flex" alignItems="center" gap={1} sx={{ position: 'relative' }}>
              {weatherIcon && (
                <img
                  src={weatherIcon}
                  alt={riskData.weatherCondition}
                  style={{ width: 24, height: 24 }}
                />
              )}
              <Typography variant="body2">Current weather: {riskData.weatherCondition}</Typography>
              <img
                src="https://cdn-icons-png.flaticon.com/512/565/565547.png"
                alt="Risk Icon"
                style={{
                  position: 'absolute',
                  right: 0,
                  top: -10,
                  width: 40,
                  height: 40,
                  opacity: 0.3,
                  pointerEvents: 'none',
                }}
              />
            </Box>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
