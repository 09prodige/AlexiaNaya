// Server component — fetches data then delegates to client component
import { getCategoriesData } from '@/lib/getPortfolio';
import HomeClient from '@/components/HomeClient';

export default async function Home() {
  const categories = await getCategoriesData();
  return <HomeClient categories={categories} />;
}
