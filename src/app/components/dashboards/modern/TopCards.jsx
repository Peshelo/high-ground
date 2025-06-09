'use client';
import Image from "next/image";
import { Box, CardContent, Grid, Icon, Typography } from "@mui/material";
import { Report } from "@mui/icons-material";


const topcards = [
  {
    icon: '/images/svgs/icon-user-male.svg',
    title: "My Compliance",
    digits: "96",
    bgcolor: "primary",
  },
  {
    icon: '/images/svgs/icon-briefcase.svg',
    title: "My HRI",
    digits: "3,650",
    bgcolor: "primary",
  },
  {
    icon: '/images/svgs/icon-mailbox.svg',
    title: "Critical- Services",
    digits: "356",
    bgcolor: "secondary",
  },
  {
    icon: '/images/svgs/icon-favorites.svg',
    title: "Business Plan",
    digits: "696",
    bgcolor: "primary",
  },
  {
    icon: '/images/svgs/icon-speech-bubble.svg',
    title: "Actions",
    digits: "2",
    bgcolor: "primary",
  },
  {
    icon: '/images/svgs/icon-connect.svg',
    title: "Audit Details",
    digits: "59",
    bgcolor: "primary",
  },
   {
    icon: '/images/svgs/icon-connect.svg',
    title: "Audit Findings",
    digits: "59",
    bgcolor: "primary",
  },
   {
    icon: '/images/svgs/icon-connect.svg',
    title: "Compliance",
    digits: "59",
    bgcolor: "primary",
  },
];

const TopCards = () => {
  return (
    <Grid container  spacing={3} mt={1}>
      {topcards.map((topcard, i) => (
        <Grid item xs={12} sm={4} lg={2} key={i}>
          <Box bgcolor={topcard.bgcolor + ".light"} textAlign="center">
            <CardContent >
              <Typography
                color={topcard.bgcolor + ".main"}
                mt={1}
                variant="subtitle1"
                fontWeight={600}
              >
                {topcard.title}
              </Typography>
              <Typography
                color={topcard.bgcolor + ".main"}
                variant="body1"
                fontWeight={600}
              >
                {topcard.digits}
              </Typography>
            </CardContent>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

export default TopCards;
