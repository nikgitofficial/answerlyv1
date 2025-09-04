import React, { useState } from "react";
import axios from "../api/axios";
import {
  Box,
  Container,
  Grid,
  Stack,
  Typography,
  IconButton,
  Link as MUILink,
  Divider,
  Rating,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";

export default function UserFooter() {
  const year = new Date().getFullYear();

  // ⭐ Rating states
  const [ratingValue, setRatingValue] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleRateUs = async () => {
    if (ratingValue === 0) {
      setModalMessage("Please select a rating first!");
      setModalOpen(true);
      return;
    }
    try {
      const res = await axios.post("/rate", { rating: ratingValue });
      setModalMessage(res.data.msg || "Thanks for your rating!");
      setModalOpen(true);
      setRatingValue(0);
    } catch (err) {
      setModalMessage(err.response?.data?.msg || "Failed to submit rating");
      setModalOpen(true);
    }
  };

  const handleCloseModal = () => setModalOpen(false);

  return (
    <Box
      component="footer"
      sx={{
        mt: 6,
        pt: 6,
        pb: 4,
        color: "#FFFFFF",
        backgroundColor: "#1b5e20",
        width: "100%",
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Stack spacing={1.5}>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                Welcome Back!
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Manage your questionnaires, view analytics, and stay connected.
              </Typography>

              {/* ⭐ Rate Us section */}
              <Stack direction="row" spacing={1} alignItems="center" sx={{ pt: 1 }}>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Rate Us:
                </Typography>
                <Rating
                  name="rate-us"
                  value={ratingValue}
                  onChange={(e, newValue) => setRatingValue(newValue)}
                  sx={{ color: "#FFD700" }}
                />
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleRateUs}
                  sx={{
                    ml: 1,
                    bgcolor: "#FFD700",
                    color: "#2e7d32",
                    "&:hover": { bgcolor: "#FFC107" },
                  }}
                >
                  Submit
                </Button>
              </Stack>

              {/* Social Icons */}
              <Stack direction="row" spacing={1}>
                {[FacebookIcon, TwitterIcon, LinkedInIcon, GitHubIcon].map(
                  (Icon, idx) => (
                    <IconButton
                      key={idx}
                      aria-label="social"
                      size="small"
                      sx={{ color: "#FFFFFF", "&:hover": { color: "#FFD700" } }}
                    >
                      <Icon fontSize="small" />
                    </IconButton>
                  )
                )}
              </Stack>
            </Stack>
          </Grid>

          <Grid item xs={12} md={6}>
            <Stack spacing={1.5}>
              <Typography variant="overline" sx={{ fontWeight: 800, opacity: 0.8 }}>
                Quick Links
              </Typography>
              <Stack direction="row" spacing={2}>
                {[
                  { label: "Dashboard", href: "/home" },
                  { label: "My Questionnaires", href: "/create-question" },
                  { label: "Responses", href: "/responses" },
                  { label: "Analytics", href: "/analytics" },
                ].map((link) => (
                  <MUILink
                    key={link.label}
                    href={link.href}
                    sx={{ color: "#FFFFFF", "&:hover": { color: "#FFD700" } }}
                  >
                    {link.label}
                  </MUILink>
                ))}
              </Stack>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: "rgba(255,255,255,0.3)" }} />

        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
  © {year} Answerly. All rights reserved. | Created by Nikko MP
</Typography>

          <Stack direction="row" spacing={2}>
            {[
              { label: "Settings", href: "/settings" },
              { label: "Support", href: "/support" },
              { label: "Profile", href: "/profile" },
            ].map((link) => (
              <MUILink
                key={link.label}
                href={link.href}
                sx={{ color: "#FFFFFF", "&:hover": { color: "#FFD700" } }}
              >
                {link.label}
              </MUILink>
            ))}
          </Stack>
        </Stack>

        {/* ⭐ Rating Modal */}
        <Dialog open={modalOpen} onClose={handleCloseModal}>
          <DialogTitle>Message</DialogTitle>
          <DialogContent>
            <Typography>{modalMessage}</Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCloseModal}
              variant="contained"
              sx={{
                bgcolor: "#2e7d32",
                color: "#FFF",
                "&:hover": { bgcolor: "#1b4d21" },
              }}
            >
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}
