import Typography from '@mui/material/Typography'
import PageContainer from "@/app/components/container/PageContainer";
import DashboardCard from "@/app/components/shared/DashboardCard";
import PBTRiskMatrix from '@/app/components/risk-managment/RiskRatingMatrix';

export default function SamplePage() {
  return (
    <PageContainer title="Sample Page" description="this is Sample page">
      <DashboardCard title="Sample Page">
        <Typography>This page is for testing</Typography>
        <PBTRiskMatrix/>
      </DashboardCard>
    </PageContainer>
  );
};

export const metadata = { title: "My Page" };
