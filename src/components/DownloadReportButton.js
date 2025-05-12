import React, { useState } from 'react';
import { Button, CircularProgress, Alert } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

export default function DownloadReportButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const downloadReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'https://fire-h0u2.onrender.com'}/api/reports/pdf`);
      if (!response.ok) {
        throw new Error(`Failed to download report: ${response.statusText}`);
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'safedrive_report.pdf');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        startIcon={<DownloadIcon />}
        onClick={downloadReport}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : 'Download PDF Report'}
      </Button>
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
    </>
  );
}
