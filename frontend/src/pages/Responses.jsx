// src/pages/Responses.jsx
import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  IconButton,
  Pagination,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import api from "../api/axios";

// Fade-up-on-scroll wrapper
const FadeUpOnScroll = ({ children, delay = 0 }) => {
  const ref = React.useRef();
  const [isVisible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          observer.unobserve(ref.current);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(30px)",
        transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
      }}
    >
      {children}
    </div>
  );
};

const Responses = () => {
  const [responses, setResponses] = useState([]);
  const [filteredResponses, setFilteredResponses] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const ITEMS_PER_PAGE = 6;

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        setLoading(true);
        const res = await api.get("/responses"); // your endpoint
        setResponses(res.data);
        setFilteredResponses(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchResponses();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    const filtered = responses.filter(
      (r) =>
        r.userName.toLowerCase().includes(value) ||
        r.questionnaireTitle.toLowerCase().includes(value)
    );
    setFilteredResponses(filtered);
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const paginatedResponses = filteredResponses.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Responses
      </Typography>

      <TextField
        placeholder="Search by user or questionnaire..."
        fullWidth
        value={search}
        onChange={handleSearch}
        sx={{ mb: 6 }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton>
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {paginatedResponses.length === 0 ? (
            <Typography variant="body1" color="text.secondary" sx={{ mt: 4 }}>
              No responses found.
            </Typography>
          ) : (
            <Grid container spacing={4}>
              {paginatedResponses.map((response, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <FadeUpOnScroll delay={index * 100}>
                    <Card
                      sx={{
                        p: 3,
                        borderRadius: 3,
                        boxShadow: 4,
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        transition: "transform 0.3s, box-shadow 0.3s",
                        "&:hover": { transform: "translateY(-4px)", boxShadow: 7 },
                      }}
                    >
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                          {response.userName}
                        </Typography>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          {response.questionnaireTitle}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          {response.answerSummary || "No details provided."}
                        </Typography>
                      </CardContent>
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 2 }}>
                        Submitted: {new Date(response.createdAt).toLocaleDateString()}
                      </Typography>
                    </Card>
                  </FadeUpOnScroll>
                </Grid>
              ))}
            </Grid>
          )}

          {filteredResponses.length > ITEMS_PER_PAGE && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
              <Pagination
                count={Math.ceil(filteredResponses.length / ITEMS_PER_PAGE)}
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default Responses;
