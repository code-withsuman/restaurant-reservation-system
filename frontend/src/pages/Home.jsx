import React, { useEffect } from "react";
import Navbar from "../components/Header/Navbar";
import Footer from "../components/Footer";

// Homepage Sections
import Hero from "../components/Home/Hero";
import FeaturedDishes from "../components/Home/FeaturedDishes";
import AboutUs from "../components/Home/AboutUs";
import WhyChooseUs from "../components/Home/WhyChooseUs";
import MenuSection from "../components/Home/MenuSection";
import SpecialOffers from "../components/Home/SpecialOffers";
import Gallery from "../components/Home/Gallery";
import Chefs from "../components/Home/Chefs";
import Testimonials from "../components/Home/Testimonials";
import Statistics from "../components/Home/Statistics";
import ContactSection from "../components/Home/ContactSection";

export default function Home({ section }) {
  useEffect(() => {
    const rawPath = window.location.pathname.replace("/", "");
    const target = section || rawPath;
    if (target && target !== "home" && target !== "") {
      const targetId = target === "dishes" ? "featured" : target === "our-menu" || target === "menu-page" ? "menu" : target;
      const elem = document.getElementById(targetId);
      if (elem) {
        setTimeout(() => {
          elem.scrollIntoView({ behavior: "smooth" });
        }, 150);
      }
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [section]);

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* 1. Header / Navigation */}
      <Navbar />

      {/* 2. Hero Banner */}
      <Hero />

      {/* 3. Featured Dishes */}
      <FeaturedDishes />

      {/* 4. About Us */}
      <AboutUs />

      {/* 5. Why Choose Us */}
      <WhyChooseUs />

      {/* 6. Our Menu */}
      <MenuSection />

      {/* 7. Special Offers */}
      <SpecialOffers />

      {/* 8. Gallery */}
      <Gallery />

      {/* 9. Meet Our Chefs */}
      <Chefs />

      {/* 10. Testimonials */}
      <Testimonials />

      {/* 11. Statistics */}
      <Statistics />

      {/* 12. Contact & Map */}
      <ContactSection />

      {/* 13. Footer */}
      <Footer />
    </div>
  );
}
