import { Box, Button, Link, Stack, Toolbar, Typography } from "@mui/material";
import { LandingPageAppBar } from "components/AppBar/LandingPageAppBar";
import { Background } from "components/Background/Background";
import searchPreview from "../../search-preview.png";
import tswift from "../../tswift.png";
import microwave from "../../microwave.png";
import curtains from "../../curtains.png";
import { useIsMobile } from "hooks/useIsMobile";
import { useEffect, useState } from "react";
import {
  useTrackMatomoPageView,
  useTrackMatomoEvent,
} from "hooks/useTrackWithMatomo";

export function SearchLandingPage() {
  useTrackMatomoPageView({ documentTitle: "Search Landing Page" });
  const isMobile = useIsMobile();

  return (
    <Background>
      <LandingPageAppBar />
      <Toolbar sx={{ mb: 2 }} />
      <Box display="flex" flexDirection="column" justifyContent="center">
        <Stack direction={{ md: "column", lg: "row" }} spacing={1}>
          <Stack
            direction="column"
            spacing={3}
            maxWidth={750}
            justifyContent="center"
          >
            <Typography variant="h3">
              Tap into over <strong>9 billion</strong> annual Web searches
            </Typography>
            <Typography variant="subtitle1" fontSize="18px">
              Book a 30-minute meeting with a Brave Search specialist to discuss
              a free test campaign and see how Brave Ads can perform for your
              business.
            </Typography>
            <BookAMeetingButton />
            {isMobile && (
              <Box display="flex" alignSelf="center">
                <img src={searchPreview} width="100%" height={400} />
              </Box>
            )}
            <Stack
              direction={{ md: "column", lg: "row" }}
              gap={"20px"}
              mt={5}
              justifyContent="space-between"
            >
              <SearchTalkingPoint
                title="Incremental"
                description="Reach audiences who don’t use other search engines and block ads on most sites."
              />
              <SearchTalkingPoint
                title="As effective as Google"
                description="Brave Search Ads convert as well as, or better than Google Search ad clicks."
              />
              <SearchTalkingPoint
                title="Risk Free"
                description="Get a free one-month test to see how Search Ads perform for your brand."
              />
            </Stack>
          </Stack>
          {!isMobile && <SearchImageCarousel />}
        </Stack>
      </Box>
    </Background>
  );
}

function BookAMeetingButton() {
  const { trackMatomoEvent } = useTrackMatomoEvent();

  return (
    <Stack direction="column" spacing={1}>
      <Button
        variant="contained"
        color="primary"
        size="medium"
        onClick={() => {
          trackMatomoEvent("search", "book-a-meeting");
          window.open(
            "https://calendar.google.com/calendar/u/0/appointments/AcZssZ2sEAG3kPSlTKpGd48pYAa2zTd-QpI2L2ewxao=",
            "_blank",
            "noopener",
          );
        }}
        sx={{ maxWidth: "200px", padding: 1.5 }}
      >
        Book a meeting
      </Button>
      <Typography>
        Or email{" "}
        <Link
          color="primary"
          variant="inherit"
          href="mailto:searchads@brave.com"
        >
          searchads@brave.com
        </Link>
      </Typography>
    </Stack>
  );
}

function SearchTalkingPoint(props: { title: string; description: string }) {
  return (
    <Stack spacing={1} maxWidth={500}>
      <Typography variant="h6">{props.title}</Typography>
      <Typography variant="body1">{props.description}</Typography>
    </Stack>
  );
}

function SearchImageCarousel() {
  const images = [tswift, microwave, curtains];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 10_000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box display="flex" width="550px">
      <img
        src={images[(currentIndex + 2) % images.length]}
        style={{
          transform: "translateX(10%) translateY(-10%)",
          transition: "opacity 3s ease",
          height: "450px",
          width: "550px",
          opacity: 0.4,
        }}
      />
      <img
        src={images[(currentIndex + 1) % images.length]}
        style={{
          transform: "translateX(-95%)",
          height: "450px",
          width: "550px",
          opacity: 0.6,
        }}
      />
      <img
        src={images[currentIndex]}
        style={{
          transform: "translateX(-200%) translateY(10%)",
          transition: "opacity 3s ease",
          height: "450px",
          width: "550px",
          opacity: 1,
        }}
      />
    </Box>
  );
}
