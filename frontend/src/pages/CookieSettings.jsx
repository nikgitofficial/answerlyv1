// src/pages/CookieSettings.jsx
import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  FormControlLabel,
  Switch,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";

const cookieCategories = [
  { key: "necessary", label: "Necessary Cookies", description: "These cookies are essential for the website to function properly.", default: true, disabled: true },
  { key: "preferences", label: "Preferences Cookies", description: "Store your preferences and settings to improve user experience." },
  { key: "analytics", label: "Analytics Cookies", description: "Help us understand how you use the site to improve functionality and content." },
  { key: "marketing", label: "Marketing Cookies", description: "Used to deliver relevant ads and marketing campaigns." },
];

const CookieSettings = () => {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));
  const [settings, setSettings] = useState(() =>
    cookieCategories.reduce((acc, cat) => {
      acc[cat.key] = cat.default || false;
      return acc;
    }, {})
  );

  const handleToggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    console.log("Saved cookie settings:", settings);
    alert("Your cookie preferences have been saved!");
  };

  return (
    <Container maxWidth="md" sx={{ mt: 10, mb: 10 }}>
      <Box sx={{ textAlign: "center", mb: 8 }}>
        <Typography variant={isSm ? "h4" : "h3"} fontWeight="bold" gutterBottom>
          Cookie Settings
        </Typography>
        <Typography variant={isSm ? "body1" : "h6"} color="text.secondary" sx={{ maxWidth: 650, mx: "auto" }}>
          Manage your cookie preferences to control what information is collected while you use our site. You can update your choices anytime.
        </Typography>
      </Box>

      <Grid container spacing={4} justifyContent="center">
        {cookieCategories.map((category) => (
          <Grid item xs={12} key={category.key}>
            <Card
              sx={{
                p: 3,
                borderRadius: 4,
                backdropFilter: "blur(6px)",
                backgroundColor: "rgba(255,255,255,0.9)",
                boxShadow: 4,
                transition: "transform 0.3s, box-shadow 0.3s",
                "&:hover": { transform: "translateY(-3px)", boxShadow: 6 },
              }}
            >
              <CardContent sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings[category.key]}
                      onChange={() => handleToggle(category.key)}
                      color="primary"
                      disabled={category.disabled || false}
                    />
                  }
                  label={<Typography fontWeight="bold">{category.label}</Typography>}
                />
                <Typography color="text.secondary">{category.description}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ textAlign: "center", mt: 6 }}>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          onClick={handleSave}
          sx={{ px: 6, py: 1.5, borderRadius: 3, boxShadow: 4 }}
        >
          Save Preferences
        </Button>
      </Box>
    </Container>
  );
};

export default CookieSettings;
