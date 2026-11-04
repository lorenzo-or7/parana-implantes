import { ThemeProvider } from './theme/ThemeContext';
import { BookingProvider } from './booking/BookingContext';
import { BookingDialog } from './booking/BookingDialog';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Intro } from './components/Intro';
import { Treatments } from './components/Treatments';
import { Experience } from './components/Experience';
import { History } from './components/History';
import { Professionals } from './components/Professionals';
import { Reviews } from './components/Reviews';
import { BookingCta } from './components/BookingCta';
import { Visit } from './components/Visit';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <ThemeProvider>
      <BookingProvider>
        <a className="skip-link" href="#conteudo">
          Pular para o conteúdo
        </a>
        <Navbar />
        <main id="conteudo" tabIndex={-1}>
          <Hero />
          <Intro />
          <Treatments />
          <Experience />
          <History />
          <Professionals />
          <Reviews />
          <BookingCta />
          <Visit />
        </main>
        <Footer />
        <BookingDialog />
      </BookingProvider>
    </ThemeProvider>
  );
}
