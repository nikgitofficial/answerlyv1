// src/pages/FAQ.jsx
import React, { useRef, useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const faqList = [
  {
    question: "How do I create a questionnaire?",
    answer:
      "Simply sign up or log in, go to your dashboard, and click on 'Create Questionnaire'. Follow the prompts to add questions, select types, and customize the appearance.",
  },
  {
    question: "Can I share my questionnaire with others?",
    answer:
      "Yes! Once your questionnaire is ready, you can share it via a unique link or embed it in your website or email.",
  },
  {
    question: "How is my data secured?",
    answer:
      "All user data is encrypted and stored securely. We follow industry best practices for data privacy and security.",
  },
  {
    question: "Can I analyze responses in real-time?",
    answer:
      "Absolutely. Our platform provides instant analytics and visual insights for every questionnaire response.",
  },
  {
    question: "Is there a mobile-friendly version?",
    answer:
      "Yes. The platform is fully responsive and works seamlessly on desktops, tablets, and smartphones.",
  },
];

// FadeUpOnScroll wrapper
const FadeUpOnScroll = ({ children, threshold = 0.2, delay = 0 }) => {
  const ref = useRef();
  const [isVisible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          observer.unobserve(ref.current);
        }
      },
      { threshold }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold, delay]);

  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(40px)",
        transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
      }}
    >
      {children}
    </div>
  );
};

const FAQ = () => {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Container maxWidth="md" sx={{ mt: 10, mb: 10 }}>
      {/* Hero Section */}
      <FadeUpOnScroll>
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Typography variant={isSm ? "h4" : "h3"} fontWeight="bold" gutterBottom>
            Frequently Asked Questions
          </Typography>
          <Typography
            variant={isSm ? "body1" : "h6"}
            color="text.secondary"
            sx={{ maxWidth: 600, mx: "auto" }}
          >
            Find answers to common questions about using our platform. If you need further help,
            contact our support team.
          </Typography>
        </Box>
      </FadeUpOnScroll>

      {/* FAQ Section */}
      <Box>
        {faqList.map((item, index) => (
          <FadeUpOnScroll key={index} delay={index * 100}>
            <Accordion
              sx={{
                mb: 3,
                borderRadius: 3,
                boxShadow: 3,
                transition: "transform 0.3s, box-shadow 0.3s",
                "&:hover": { transform: "translateY(-2px)", boxShadow: 6 },
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6" fontWeight="bold">
                  {item.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography color="text.secondary">{item.answer}</Typography>
              </AccordionDetails>
            </Accordion>
          </FadeUpOnScroll>
        ))}
      </Box>

      {/* Call to Action */}
      <FadeUpOnScroll delay={500}>
        <Box sx={{ textAlign: "center", mt: 10 }}>
          <Typography variant={isSm ? "h5" : "h4"} fontWeight="bold" gutterBottom>
            Still have questions?
          </Typography>
          <Typography
            variant={isSm ? "body1" : "h6"}
            color="text.secondary"
            sx={{ maxWidth: 600, mx: "auto", mb: 4 }}
          >
            Reach out to our support team and we'll be happy to help you.
          </Typography>
      <Button
  variant="contained"
  size="large"
  sx={{
    px: 6,
    py: 1.5,
    borderRadius: 3,
    background: "linear-gradient(90deg, #087f23, #4CAF50)", // green gradient
    color: "#fff",
    "&:hover": {
      background: "linear-gradient(90deg, #065a18, #388E3C)", // darker green on hover
    },
  }}
>
  Contact Support
</Button>
        </Box>
      </FadeUpOnScroll>
    </Container>
  );
};

export default FAQ;
