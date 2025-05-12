import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, CircularProgress, Box } from '@mui/material';

const API_URL = process.env.REACT_APP_API_URL || "https://fire-h0u2.onrender.com";

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

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Predictive Risk Score
        </Typography>
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
        <Typography variant="body2" gutterBottom>
          Accidents in area (last 7 days): {riskData.accidentsCount}
        </Typography>
        <Typography variant="body2" gutterBottom>
          Sensor events in area (last 7 days): {riskData.sensorEventsCount}
        </Typography>
        <Typography variant="body2">Current weather: {riskData.weatherCondition}</Typography>
      </CardContent>
    </Card>
  );
}
