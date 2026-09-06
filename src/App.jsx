import Nav from "./components/Nav.jsx";
import Hero from "./components/Hero.jsx";
import Projects from "./components/Projects.jsx";
import Experience from "./components/Experience.jsx";
import FabLab from "./components/FabLab.jsx";
import Workshops from "./components/Workshops.jsx";
import Skills from "./components/Skills.jsx";
import Contact from "./components/Contact.jsx";
import Footer from "./components/Footer.jsx";

const SECTIONS = [
  { id: "work", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "lab", label: "Fab Lab" },
  { id: "hardware", label: "Hardware" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
];

export default function App() {
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <Nav sections={SECTIONS} />
      <main id="main">
        <Hero />
        <Projects />
        <Experience />
        <FabLab />
        <Workshops />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
