import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Footer, Header, PageNotFound } from './components';
import { Home, RoomDetails, Login, Register, MyBookings, TermsConditions, Disclaimer, PrivacyPolicy, Sitemap, Payment } from './pages';

function App() {
  return (
    <main>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/room/:id" element={<RoomDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/terms-conditions" element={<TermsConditions />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/sitemap" element={<Sitemap />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </main>
  );
}

export default App;
