'use client';
import Breadcrumb from '../layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import ProductTableList from '@/app/components/apps/ecommerce/ProductTableList/ProductTableList';
import BlankCard from '@/app/components/shared/BlankCard';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Risks',
  },
];

const EcomProductList = () => {
  return (
    <PageContainer title="Risks" description="View and manage risks in the system">
      {/* breadcrumb */}
      <Breadcrumb title="Risks" items={BCrumb} />
      <BlankCard>
        {/* ------------------------------------------- */}
        {/* Left part */}
        {/* ------------------------------------------- */}
        <ProductTableList />
      </BlankCard>
    </PageContainer>
  );
};

export default EcomProductList;
