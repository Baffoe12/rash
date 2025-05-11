import React from 'react';
import DownloadReportButton from './DownloadReportButton';
import { Container, Typography, Box, Divider, Button } from '@mui/material';

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
      <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <DownloadReportButton />
        <Button variant="contained" onClick={() => downloadFile('/api/reports/sensor-excel', 'sensor_data.xlsx')}>
          Download Sensor Data Excel
        </Button>
        <Button variant="contained" onClick={() => downloadFile('/api/reports/accident-excel', 'accident_events.xlsx')}>
          Download Accident Events Excel
        </Button>
        <Button variant="contained" onClick={() => downloadFile('/api/reports/stats-excel', 'statistics_report.xlsx')}>
          Download Statistics Report Excel
        </Button>
      </Box>
    </Container>
  );
}
