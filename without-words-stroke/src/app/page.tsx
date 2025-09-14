import { Layout } from '../components/layout';
import { HeroSection } from '../components/sections/HeroSection';
import { SymptomsPrevention } from '../components/sections/SymptomsPrevention';

/**
 * 🎯 Главная страница Without Words Stroke
 * Живой логотип, SOS кнопка, симптомы и профилактика
 */
export default function Home() {
  return (
    <Layout>
      <HeroSection />
      <SymptomsPrevention />
    </Layout>
  );
}
