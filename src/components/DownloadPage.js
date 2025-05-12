import React, { useState } from 'react';
import DownloadReportButton from './DownloadReportButton';
import { Container, Typography, Box, Paper, Stack, Button, Tooltip, LinearProgress } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

const BACKEND_BASE_URL = process.env.REACT_APP_API_URL || 'https://fire-h0u2.onrender.com';

export default function DownloadPage() {
  const [loading, setLoading] = useState({
    sensor: false,
    accident: false,
    stats: false,
  });

  const downloadFile = async (url, filename, key) => {
    try {
      setLoading(prev => ({ ...prev, [key]: true }));
      const response = await fetch(BACKEND_BASE_URL + url);
      if (!response.ok) {
        throw new Error(`Failed to download file: ${response.statusText}`);
      }
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download file.');
    } finally {
      setLoading(prev => ({ ...prev, [key]: false }));
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6, mb: 6 }}>
      <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
        Download Reports
      </Typography>
      <Typography variant="subtitle1" align="center" color="text.secondary" gutterBottom>
        Select a report below to download the latest data in Excel format.
      </Typography>
      <Stack spacing={4} sx={{ mt: 4 }}>
        <Paper elevation={6} sx={{ p: 3, borderRadius: 3 }}>
          <DownloadReportButton />
        </Paper>
        <Paper elevation={6} sx={{ p: 3, borderRadius: 3 }}>
          <Tooltip title="Download sensor data in Excel format">
            <Box>
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={() => downloadFile('/api/reports/sensor-excel', 'sensor_data.xlsx', 'sensor')}
                fullWidth
                disabled={loading.sensor}
                size="large"
                sx={{ fontWeight: 'medium' }}
              >
                {loading.sensor ? 'Downloading...' : 'Download Sensor Data Excel'}
              </Button>
              {loading.sensor && <LinearProgress sx={{ mt: 1, borderRadius: 1 }} />}
            </Box>
          </Tooltip>
        </Paper>
        <Paper elevation={6} sx={{ p: 3, borderRadius: 3 }}>
          <Tooltip title="Download accident events data in Excel format">
            <Box>
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={() => downloadFile('/api/reports/accident-excel', 'accident_events.xlsx', 'accident')}
                fullWidth
                disabled={loading.accident}
                size="large"
                sx={{ fontWeight: 'medium' }}
              >
                {loading.accident ? 'Downloading...' : 'Download Accident Events Excel'}
              </Button>
              {loading.accident && <LinearProgress sx={{ mt: 1, borderRadius: 1 }} />}
            </Box>
          </Tooltip>
        </Paper>
        <Paper elevation={6} sx={{ p: 3, borderRadius: 3 }}>
          <Tooltip title="Download statistics report in Excel format">
            <Box>
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={() => downloadFile('/api/reports/stats-excel', 'statistics_report.xlsx', 'stats')}
                fullWidth
                disabled={loading.stats}
                size="large"
                sx={{ fontWeight: 'medium' }}
              >
                {loading.stats ? 'Downloading...' : 'Download Statistics Report Excel'}
              </Button>
              {loading.stats && <LinearProgress sx={{ mt: 1, borderRadius: 1 }} />}
            </Box>
          </Tooltip>
        </Paper>
      </Stack>
    </Container>
  );
}
