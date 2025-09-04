import React from "react";
import {
  Box,
  Container,
  Grid,
  Stack,
  Typography,
  IconButton,
  Link as MUILink,
  Divider,
  TextField,
  Button,
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';

export default function Footer() {
  const year = new Date().getFullYear();

  const handleSubscribe = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    console.log("Subscribe:", email);
  };

  return (
    <Box
      component="footer"
      sx={{
        position: "relative",
        mt: { xs: 6, md: 10 },
        pt: { xs: 6, md: 8 },
        pb: { xs: 4, md: 6 },
        color: "#FFFFFF", // white text
        backgroundColor: "#2e7d32",
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      <Container maxWidth="lg" sx={{ position: "relative" }}>
        {/* Top: Brand + Newsletter */}
        <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center">
          <Grid item xs={12} md={5}>
            <Stack spacing={1.5}>
              <Typography
                variant="h5"
                sx={{ fontWeight: 800, letterSpacing: 0.4 }}
              >
                Answerly
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Create, share, and analyze questionnaires easily. Modern, fast,
                and user-friendly.
              </Typography>
              <Stack direction="row" spacing={1} sx={{ pt: 1 }}>
                {[
                  { icon: FacebookIcon, href: "https://www.facebook.com/nikkomirafuentespaceno", label: "Facebook" },
                  { icon: TwitterIcon, href: "https://twitter.com/yourprofile", label: "Twitter" },
                  { icon: InstagramIcon, href: "https://www.instagram.com/yourprofile", label: "Instagram" },
                  { icon: YouTubeIcon, href: "https://www.youtube.com/yourchannel", label: "YouTube" },
                  { icon: LinkedInIcon, href: "https://www.linkedin.com/in/yourprofile", label: "LinkedIn" },
                  { icon: GitHubIcon, href: "https://github.com/nikgitofficial", label: "GitHub" },
                  { icon: EmailOutlinedIcon, href: "mailto:nickforjobacc@gmail.com", label: "Email" },
                ].map((item, idx) => (
                  <a key={idx} href={item.href} target="_blank" rel="noopener noreferrer">
                    <IconButton
                      aria-label={item.label}
                      size="small"
                      sx={{ color: "#FFFFFF", "&:hover": { color: "#FFD700" } }} // yellow hover
                    >
                      <item.icon fontSize="small" />
                    </IconButton>
                  </a>
                ))}
              </Stack>
            </Stack>
          </Grid>

          <Grid item xs={12} md={7}>
            <Box
              component="form"
              onSubmit={handleSubscribe}
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "stretch", sm: "center" },
                gap: 1.5,
                p: 2,
                borderRadius: 3,
                backgroundColor: "rgba(255,255,255,0.1)", // slight transparent on green
                border: "1px solid",
                borderColor: "rgba(255,255,255,0.3)",
              }}
            >
              <TextField
                name="email"
                type="email"
                label="Get updates & tips"
                fullWidth
                required
                placeholder="you@example.com"
                autoComplete="email"
                sx={{
                  input: { color: "#FFFFFF" },
                  label: { color: "#FFFFFF" },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "rgba(255,255,255,0.5)" },
                    "&:hover fieldset": { borderColor: "#FFD700" },
                    "&.Mui-focused fieldset": { borderColor: "#FFD700" },
                  },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{
                  px: 3,
                  fontWeight: 700,
                  borderRadius: 2,
                  bgcolor: "#FFD700",
                  color: "#2e7d32",
                  "&:hover": { bgcolor: "#FFC107" },
                }}
              >
                Subscribe
              </Button>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: { xs: 4, md: 6 }, borderColor: "rgba(255,255,255,0.3)" }} />

        {/* Middle: Link columns */}
        <Grid container spacing={{ xs: 3, md: 6 }}>
          {[
            { title: "App", links: [
              { label: "Create Questionnaire", href: "/login" },
              { label: "My Questionnaires", href: "/login" },
              { label: "Responses", href: "/responses" },
              { label: "Analytics", href: "/analytics" },
            ]},
            { title: "Resources", links: [
              { label: "Docs", href: "/docs" },
              { label: "Guides", href: "/guides" },
              { label: "FAQ", href: "/faq" },
              { label: "Community", href: "/community" },
            ]},
            { title: "Company", links: [
              { label: "About", href: "/about" },
              { label: "Blog", href: "/blog" },
              { label: "Careers", href: "/careers" },
              { label: "Contact", href: "/contact" },
            ]},
            { title: "Legal", links: [
              { label: "Privacy", href: "/privacy" },
              { label: "Terms", href: "/terms" },
              { label: "Security", href: "/security" },
              { label: "Status", href: "/status" },
            ]},
          ].map((col, idx) => (
            <Grid key={idx} item xs={12} sm={6} md={3}>
              <FooterColumn title={col.title} links={col.links} />
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: { xs: 4, md: 6 }, borderColor: "rgba(255,255,255,0.3)" }} />

        {/* Bottom: Badge + Meta */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "flex-start", sm: "center" }}
          justifyContent="space-between"
          spacing={2}
        >
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            © {year} Answerly. All rights reserved.
          </Typography>

          <Stack direction="row" spacing={2}>
            {[
              { label: "Accessibility", href: "/accessibility" },
              { label: "Sitemap", href: "/sitemap" },
              { label: "Cookie Settings", href: "/cookies" },
            ].map((link) => (
              <MUILink
                key={link.label}
                href={link.href}
                variant="body2"
                sx={{
                  color: "#FFFFFF",
                  "&:hover": { color: "#FFD700" },
                }}
              >
                {link.label}
              </MUILink>
            ))}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}

function FooterColumn({ title, links }) {
  return (
    <Stack spacing={1.5}>
      <Typography variant="overline" sx={{ fontWeight: 800, color: "#FFFFFF", opacity: 0.8 }}>
        {title}
      </Typography>
      <Stack component="nav" spacing={1}>
        {links.map((link) => (
          <MUILink
            key={link.label}
            href={link.href}
            variant="body2"
            sx={{
              color: "#FFFFFF",
              fontWeight: 500,
              textDecoration: "none",
              opacity: 0.9,
              "&:hover": { color: "#FFD700", opacity: 1 },
            }}
          >
            {link.label}
          </MUILink>
        ))}
      </Stack>
    </Stack>
  );
}
