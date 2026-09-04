import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import Hero from "@/sections/Hero";
import ElDesafio from "@/sections/ElDesafio";
import ElProblemaInvisible from "@/sections/ElProblemaInvisible";
import LaPregunta from "@/sections/LaPregunta";
import Precisur from "@/sections/Precisur";
import Ecosistema from "@/sections/Ecosistema";
import Simulacion from "@/sections/Simulacion";
import Evidencia from "@/sections/Evidencia";
import SmartSpray from "@/sections/SmartSpray";
import DeSoftwareACampo from "@/sections/DeSoftwareACampo";
import OportunidadParaUruguay from "@/sections/OportunidadParaUruguay";
import LlamadoColaboracion from "@/sections/LlamadoColaboracion";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Header />
      <main>
        <Hero />
        <ElDesafio />
        <ElProblemaInvisible />
        <LaPregunta />
        <Precisur />
        <Ecosistema />
        <Simulacion />
        <Evidencia />
        <SmartSpray />
        <DeSoftwareACampo />
        <OportunidadParaUruguay />
        <LlamadoColaboracion />
      </main>
      <Footer />
    </>
  );
}
