// src/components/QuestionSetView.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axios";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Stack,
  Button,
  useTheme,
  useMediaQuery,
  Divider,
  Fade,
  TextField,
  Tooltip,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from "@mui/material";

const QuestionSetView = () => {
  const { slug } = useParams();
  const [setData, setSetData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [userName, setUserName] = useState("");
  const [userAvailable, setUserAvailable] = useState(null);
  const [checkingUser, setCheckingUser] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchSet = async () => {
      try {
        const res = await axios.get(`/question-sets/${slug}`);
        setSetData(res.data);
      } catch (err) {
        console.error("Error fetching question set:", err);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchSet();
  }, [slug]);

  useEffect(() => {
    const checkUser = async () => {
      if (!userName.trim()) {
        setUserAvailable(null);
        return;
      }
      setCheckingUser(true);
      try {
        const res = await axios.get(`/question-sets/${slug}/answers`);
        const exists = res.data.answers.some(
          (ans) => (ans.user ? ans.user.name : ans.userName) === userName
        );
        setUserAvailable(!exists);
      } catch (err) {
        console.error("Error checking username:", err);
        setUserAvailable(null);
      } finally {
        setCheckingUser(false);
      }
    };
    const debounce = setTimeout(checkUser, 500);
    return () => clearTimeout(debounce);
  }, [userName, slug]);

  const handleChange = (qId, option) => {
    setAnswers((prev) => ({ ...prev, [qId]: option }));
  };

  const allQuestionsAnswered = setData
    ? setData.questions.every((q) => answers[q._id])
    : false;

  const handleSubmit = async () => {
    if (!userName.trim()) {
      alert("Please enter your name before submitting.");
      return;
    }
    if (!allQuestionsAnswered) {
      alert("Please answer all questions before submitting.");
      return;
    }
    if (userAvailable === false) {
      alert("Username already exists. Please choose a different name.");
      return;
    }

    try {
      await axios.post(`/question-sets/${slug}/answers`, { answers, userName });

      if (setData.title.toLowerCase() !== "survey") {
        let correctCount = 0;
        setData.questions.forEach((q) => {
          if (answers[q._id] === q.answer) correctCount += 1;
        });
        const percentage = ((correctCount / setData.questions.length) * 100).toFixed(2);
        setScore({ correct: correctCount, total: setData.questions.length, percentage });
      }

      setSubmitted(true);
    } catch (err) {
      console.error("Error submitting answers:", err);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" mt={8}>
        <CircularProgress size={60} color="primary" />
      </Box>
    );
  }

  if (!setData) {
    return (
      <Typography color="error" textAlign="center" mt={8} variant="h6">
        Question set not found.
      </Typography>
    );
  }

  let disabledReason = "";
  if (!userName.trim()) disabledReason = "Please enter your name";
  else if (!allQuestionsAnswered) disabledReason = "Answer all questions before submitting";
  else if (userAvailable === false) disabledReason = "Username already exists";

  return (
    <Box p={isMobile ? 2 : 5} maxWidth="800px" mx="auto">
      <Paper
        elevation={6}
        sx={{
          p: isMobile ? 3 : 5,
          borderRadius: 4,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        {/* Title */}
        <Typography
          variant={isMobile ? "h5" : "h4"}
          fontWeight={700}
          gutterBottom
          textAlign="center"
        >
          {setData.title || "Question Set"}
        </Typography>

        {/* Created By & Date */}
        <Stack
          direction={isMobile ? "column" : "row"}
          justifyContent="space-between"
          alignItems={isMobile ? "flex-start" : "center"}
          spacing={1}
          sx={{ mb: 4 }}
        >
          <Typography variant="body2" color="textSecondary">
            Created by: {setData.user?.email || (setData.userName ? setData.userName : "Anonymous")}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Date Created: {new Date(setData.createdAt).toLocaleDateString()}
          </Typography>
        </Stack>

        <Divider sx={{ mb: 4 }} />

        {submitted ? (
          <Fade in={submitted}>
            <Box textAlign="center" mt={3}>
              <Typography variant="h6" color="success.main" gutterBottom>
                🎉 Thank you, <b>{userName}</b>, for submitting!
              </Typography>
              {setData.title.toLowerCase() !== "survey" && score && (
                <Typography variant="h6" mt={2}>
                  You scored <b>{score.correct}</b> / <b>{score.total}</b> (
                  <b>{score.percentage}%</b>)
                </Typography>
              )}
              <Button
                sx={{ mt: 4 }}
                variant="outlined"
                color="primary"
                onClick={() => {
                  setAnswers({});
                  setSubmitted(false);
                  setScore(null);
                  setUserName("");
                  setUserAvailable(null);
                }}
              >
                Retry
              </Button>
            </Box>
          </Fade>
        ) : (
          <Stack spacing={5}>
            {/* User Name Input */}
            <TextField
              fullWidth
              label="Your Name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  borderColor:
                    userAvailable === null
                      ? undefined
                      : userAvailable
                      ? "green"
                      : "red",
                },
              }}
            />
            {userAvailable === false && (
              <Typography color="error" variant="caption">
                Username already exists
              </Typography>
            )}
            {userAvailable && userName && (
              <Typography color="success.main" variant="caption">
                Username available
              </Typography>
            )}

            {/* Questions */}
            {setData.questions?.map((q, idx) => (
              <Paper
                key={q._id}
                elevation={2}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  backgroundColor: theme.palette.background.default,
                  transition: "0.2s",
                  "&:hover": { boxShadow: theme.shadows[4] },
                }}
              >
                <Typography
                  variant={isMobile ? "subtitle1" : "h6"}
                  fontWeight={600}
                  gutterBottom
                  mb={2}
                >
                  {idx + 1}. {q.text}
                </Typography>

                <FormControl component="fieldset">
                  <RadioGroup
                    value={answers[q._id] || ""}
                    onChange={(e) => handleChange(q._id, e.target.value)}
                  >
                    {q.options.map((opt, i) => (
                      <FormControlLabel
                        key={i}
                        value={opt}
                        control={<Radio color="primary" />}
                        label={opt}
                        sx={{
                          mb: 1,
                          "& .MuiFormControlLabel-label": {
                            fontWeight: 500,
                          },
                        }}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              </Paper>
            ))}

            {/* Submit Button */}
            <Box textAlign={isMobile ? "center" : "right"}>
              <Tooltip title={disabledReason || ""} arrow>
                <span>
                  <Button
                    variant="contained"
                    color="primary"
                    size={isMobile ? "medium" : "large"}
                    sx={{ py: 1.5, px: 5, fontWeight: 600, mt: 2 }}
                    onClick={handleSubmit}
                    disabled={
                      !userName.trim() ||
                      !allQuestionsAnswered ||
                      userAvailable === false ||
                      checkingUser
                    }
                  >
                    Submit Answers
                  </Button>
                </span>
              </Tooltip>
            </Box>
          </Stack>
        )}
      </Paper>
    </Box>
  );
};

export default QuestionSetView;
