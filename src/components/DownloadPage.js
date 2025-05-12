import React from 'react';
import DownloadReportButton from './DownloadReportButton';
import { Container, Typography, Box, Paper, Stack, Button, Tooltip } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

export default function DownloadPage() {
  const downloadFile = async (url, filename) => {
    try {
      const response = await fetch(url);
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
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Download Reports
      </Typography>
      <Stack spacing={3} sx={{ mt: 3 }}>
        <Paper elevation={3} sx={{ p: 2 }}>
          <DownloadReportButton />
        </Paper>
        <Paper elevation={3} sx={{ p: 2 }}>
          <Tooltip title="Download sensor data in Excel format">
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={() => downloadFile('/api/reports/sensor-excel', 'sensor_data.xlsx')}
              fullWidth
            >
              Download Sensor Data Excel
            </Button>
          </Tooltip>
        </Paper>
        <Paper elevation={3} sx={{ p: 2 }}>
          <Tooltip title="Download accident events data in Excel format">
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={() => downloadFile('/api/reports/accident-excel', 'accident_events.xlsx')}
              fullWidth
            >
              Download Accident Events Excel
            </Button>
          </Tooltip>
        </Paper>
        <Paper elevation={3} sx={{ p: 2 }}>
          <Tooltip title="Download statistics report in Excel format">
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={() => downloadFile('/api/reports/stats-excel', 'statistics_report.xlsx')}
              fullWidth
            >
              Download Statistics Report Excel
            </Button>
          </Tooltip>
        </Paper>
      </Stack>
    </Container>
  );
}
