import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, Fade, Grow } from '@mui/material';
import LiveSensorCard from './LiveSensorCard';
import StatsCards from './StatsCards';
import DownloadReportButton from './DownloadReportButton';
import HeartRateCard from './HeartRateCard';
import AccidentImpactTable from './AccidentImpactTable';
import ConnectionStatusButton from './ConnectionStatusButton';
import RealTimeSensor from './RealTimeSensor';
import StatusBar from './StatusBar';
import PredictiveRiskCard from './PredictiveRiskCard';
import SensorHistory from './SensorHistory';  // Added import
import api from '../api'; // Import the API module

function AnimatedStat({ children, delay = 0 }) {
  return (
    <Grow in timeout={800} style={{ transitionDelay: `${delay}ms` }}>
      <Box>{children}</Box>
    </Grow>
  );
}

export default function DashboardHome() {
  const [show, setShow] = useState(false);
  const [sensorData, setSensorData] = useState(null);
  const previousEngineState = React.useRef(null);

  useEffect(() => {
    setShow(true);
  }, []);

  useEffect(() => {
    const isEngineRunning = (lcdDisplay) => {
      if (!lcdDisplay) return false;
      return lcdDisplay.includes('Engine: RUNNING');
    };

    const fetchData = async () => {
      try {
        const data = await api.getLatestSensorData();
        // Check if engine state changed from running to stopped
        const currentEngineRunning = isEngineRunning(data.lcd_display);
        if (previousEngineState.current === true && currentEngineRunning === false) {
          console.log('Engine stopped! Saving sensor data...');
          // Here you can implement saving logic if needed
        }
        previousEngineState.current = currentEngineRunning;
        setSensorData(data);
      } catch (err) {
        console.error('Error fetching sensor data:', err);
      }
    };
    fetchData();
    const id = setInterval(fetchData, 1000);
    return () => clearInterval(id);
  }, []);

  // Dummy location and timestamp for demonstration
  const lat = 5.6545;
  const lng = -0.1869;
  const timestamp = new Date().toISOString();

  return (
      <Fade in={show} timeout={700}>
        <Box
          sx={{
            minHeight: '100vh',
            background: '#fff',
            py: 8,
            px: { xs: 3, md: 10 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            position: 'relative',
          }}
        >
          {/* Animated Divider Top */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: 90,
              overflow: 'hidden',
              zIndex: 1,
            }}
          >
            <svg
              viewBox="0 0 1440 90"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ width: '100%', height: '100%' }}
            >
              <path
                d="M0,50 Q720,140 1440,50 L1440,0 L0,0 Z"
                fill="#fff"
                opacity="0.7"
              >
                <animate
                  attributeName="d"
                  values="M0,50 Q720,140 1440,50 L1440,0 L0,0 Z;M0,35 Q720,100 1440,35 L1440,0 L0,0 Z;M0,50 Q720,140 1440,50 L1440,0 L0,0 Z"
                  dur="8s"
                  repeatCount="indefinite"
                />
              </path>
            </svg>
          </Box>
          {/* Homepage topic/title - centered with space above */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mt: 6,
              mb: 2,
            }}
          >
            <Typography
              variant="h2"
              fontWeight="bold"
              sx={{
                letterSpacing: 2,
                textAlign: 'center',
                textShadow: '0 4px 16px #2c5364',
                color: '#1976d2',
              }}
            >
              SafeDrive Public Safety Dashboard
            </Typography>
          </Box>
          {/* Image, Message, and Connection Status Button - responsive layout */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
              mb: 3,
            }}
          >
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTG2BJIdWAZI4w_mCWYb_HzGCNAgcBlL-Bf9CqaKoSjMgtlqXo&s"
              alt="Two Cars Crash"
              style={{
                height: 200,
                width: 320,
                borderRadius: 12,
                boxShadow: '0 4px 18px #aaa',
                objectFit: 'cover',
                maxWidth: '90vw',
              }}
            />
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                height: { xs: 'auto', sm: 200 },
                justifyContent: 'flex-end',
                alignItems: 'flex-end',
                ml: { xs: 0, sm: 2 },
                mt: { xs: 2, sm: 0 },
                width: { xs: '100%', sm: 'auto' },
              }}
            >
              <Box
                sx={{
                  background: '#000',
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  width: { xs: '100%', sm: 260 },
                  textAlign: { xs: 'center', sm: 'right' },
                  mb: 2,
                }}
              >
                <Typography
                  sx={{
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: 22,
                    letterSpacing: 1.2,
                  }}
                >
                  Life is precious. Drive Safe. Arrive Alive!
                </Typography>
              </Box>
              <Box sx={{ alignSelf: { xs: 'center', sm: 'flex-start' }, mt: 'auto' }}>
                <ConnectionStatusButton />
              </Box>
            </Box>
          </Box>
          {/* Animated Divider Middle */}
          <Box
            sx={{
              width: '100%',
              maxWidth: 1400,
              mt: 3,
              mb: 6,
              position: 'relative',
              zIndex: 2,
            }}
          >
            <svg
              viewBox="0 0 1440 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ width: '100%', height: '40px', display: 'block' }}
            >
              <path
                d="M0,30 Q720,80 1440,30"
                stroke="#1e3c72"
                strokeWidth="3"
                fill="none"
              >
                <animate
                  attributeName="d"
                  values="M0,30 Q720,80 1440,30;M0,15 Q720,40 1440,15;M0,30 Q720,80 1440,30"
                  dur="7s"
                  repeatCount="indefinite"
                />
              </path>
            </svg>
          </Box>
          {/* Main sensor widgets row with LiveSensorCard wider and CarTracker removed */}
          <Grid
            container
            spacing={5}
            justifyContent="center"
            alignItems="stretch"
            sx={{ maxWidth: 1400, mb: 3, zIndex: 2 }}
          >
            <Grid item xs={12} md={8}>
              <AnimatedStat delay={350}>
                <Card
                  sx={{
                    minHeight: 200,
                    minWidth: 200,
                    maxWidth: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 5,
                    boxShadow: 10,
                    background:
                      'linear-gradient(135deg,#232526 0%,#2c5364 100%)',
                    transition:
                      'transform 0.4s cubic-bezier(.25,1.25,.5,1.1), box-shadow 0.4s',
                    ':hover': {
                      transform: 'scale(1.09) rotate(-2deg)',
                      boxShadow: '0 8px 24px #0f2027cc',
                      background:
                        'linear-gradient(135deg,#2c5364 0%,#232526 100%)',
                    },
                    m: 'auto',
                    p: 2,
                  }}
                >
                  <LiveSensorCard sensorData={sensorData} />
                </Card>
              </AnimatedStat>
            </Grid>
            <Grid item xs={12} md={4}>
              <AnimatedStat delay={400}>
                <Card
                  sx={{
                    minHeight: 320,
                    minWidth: 320,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 5,
                    boxShadow: 12,
                    background:
                      'linear-gradient(135deg,#232526 0%,#2c5364 100%)',
                    transition:
                      'transform 0.4s cubic-bezier(.25,1.25,.5,1.1), box-shadow 0.4s',
                    ':hover': {
                      transform: 'scale(1.11) rotate(3deg)',
                      boxShadow: '0 12px 36px #0f2027cc',
                      background:
                        'linear-gradient(135deg,#2c5364 0%,#232526 100%)',
                    },
                    m: 'auto',
                    p: 3,
                  }}
                >
                  <HeartRateCard />
                </Card>
              </AnimatedStat>
            </Grid>
          </Grid>
          {/* Add RealTimeSensor component below LiveSensorCard */}
          <Grid
            container
            spacing={5}
            justifyContent="center"
            alignItems="stretch"
            sx={{ maxWidth: 1400, mb: 3, zIndex: 2 }}
          >
            <Grid item xs={12} md={12}>
              <AnimatedStat delay={450}>
                <Card
                  sx={{
                    minHeight: 400,
                    minWidth: 400,
                    maxWidth: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 5,
                    boxShadow: 10,
                    background:
                      'linear-gradient(135deg,#1a237e 0%,#283593 100%)',
                    transition:
                      'transform 0.4s cubic-bezier(.25,1.25,.5,1.1), box-shadow 0.4s',
                    ':hover': {
                      transform: 'scale(1.09) rotate(-2deg)',
                      boxShadow: '0 8px 24px #0f2027cc',
                    },
                    m: 'auto',
                    p: 2,
                    color: '#fff',
                  }}
                >
                  <SensorHistory />
                </Card>
              </AnimatedStat>
            </Grid>
          </Grid>
        </Box>
      </Fade>
  );
}
