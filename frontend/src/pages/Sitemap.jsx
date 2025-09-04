// src/pages/Sitemap.jsx
import React from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  List,
  ListItem,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Link } from "react-router-dom";

const sitemapSections = [
  {
    title: "Main Pages",
    links: [
      { label: "Home", path: "/" },
      { label: "About", path: "/about" },
      { label: "Contact", path: "/contact" },
      { label: "Careers", path: "/careers" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", path: "/blog" },
      { label: "Docs", path: "/docs" },
      { label: "Guidelines", path: "/guidelines" },
      { label: "FAQ", path: "/faq" },
    ],
  },
  {
    title: "Policies",
    links: [
      { label: "Privacy Policy", path: "/privacy" },
      { label: "Terms of Service", path: "/terms" },
      { label: "Security", path: "/security" },
      { label: "Accessibility", path: "/accessibility" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "Community Page", path: "/community" },
      { label: "Status", path: "/status" },
      { label: "Sitemap", path: "/sitemap" },
    ],
  },
];

const Sitemap = () => {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Container maxWidth="lg" sx={{ mt: 10, mb: 10 }}>
      {/* Hero Section */}
      <Box sx={{ textAlign: "center", mb: 10 }}>
        <Typography variant={isSm ? "h4" : "h3"} fontWeight="bold" gutterBottom>
          Sitemap
        </Typography>
        <Typography
          variant={isSm ? "body1" : "h6"}
          color="text.secondary"
          sx={{ maxWidth: 700, mx: "auto" }}
        >
          Quickly navigate through all sections of our website. Find what you’re looking for in just a few clicks.
        </Typography>
      </Box>

      {/* Sitemap Sections */}
      <Grid container spacing={6} justifyContent="center">
        {sitemapSections.map((section, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
              {section.title}
            </Typography>
            <List>
              {section.links.map((link, i) => (
                <ListItem key={i} sx={{ py: 0.5 }}>
                  <ListItemText
                    primary={
                      <Link
                        to={link.path}
                        style={{
                          textDecoration: "none",
                          color: theme.palette.text.primary,
                          transition: "color 0.3s",
                        }}
                        onMouseEnter={(e) => (e.target.style.color = theme.palette.secondary.main)}
                        onMouseLeave={(e) => (e.target.style.color = theme.palette.text.primary)}
                      >
                        {link.label}
                      </Link>
                    }
                  />
                </ListItem>
              ))}
            </List>
            {index < sitemapSections.length - 1 && <Divider sx={{ mt: 2 }} />}
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Sitemap;
