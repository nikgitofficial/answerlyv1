// src/components/CookieBanner.jsx
import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Slide } from "@mui/material";

const COOKIE_KEY = "cookieConsent";

const CookieBanner = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_KEY);
    if (!consent) setOpen(true);
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_KEY, "accepted");
    setOpen(false);
  };

  const handleDecline = () => {
    localStorage.setItem(COOKIE_KEY, "declined");
    setOpen(false);
  };

  if (!open) return null;

  return (
    <Slide direction="up" in={open} mountOnEnter unmountOnExit>
      <Box
        sx={{
          position: "fixed",
          bottom: 16,
          left: 16,
          right: 16,
          zIndex: 9999,
          p: 3,
          borderRadius: 3,
          backgroundColor: "background.paper",
          boxShadow: 6,
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Typography variant="body1" color="text.primary" sx={{ flex: 1 }}>
          We use cookies to improve your experience and analyze traffic. By
          continuing, you agree to our use of cookies.
        </Typography>
        <Box sx={{ display: "flex", gap: 1, mt: { xs: 1, sm: 0 } }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAccept}
            sx={{ borderRadius: 2 }}
          >
            Accept
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleDecline}
            sx={{ borderRadius: 2 }}
          >
            Decline
          </Button>
        </Box>
      </Box>
    </Slide>
  );
};

export default CookieBanner;
