export default function Footer() {
  return (
    <footer className="bg-precisur-dark-900 border-t border-precisur-dark-600/30">
      <div className="max-w-7xl mx-auto px-6 py-10 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded bg-precisur-green/20 border border-precisur-green/40 flex items-center justify-center">
                <span className="text-precisur-green font-mono text-sm font-bold">
                  P
                </span>
              </div>
              <span className="font-heading text-lg font-semibold tracking-tight">
                PRECISUR
              </span>
            </div>
            <p className="text-sm text-foreground/50 leading-relaxed max-w-xs">
              Tecnología para entender lo que ocurre antes de aplicar.
              Agricultura de precisión desarrollada en Uruguay.
            </p>
          </div>

          <div>
            <h4 className="font-heading text-sm font-semibold text-foreground/70 mb-4 uppercase tracking-wider">
              Plataforma
            </h4>
            <ul className="space-y-2 text-sm text-foreground/50">
              <li>
                <a href="#simulacion" className="hover:text-precisur-green transition-colors">
                  Simulación de Deriva
                </a>
              </li>
              <li>
                <a href="#smart-spray" className="hover:text-precisur-green transition-colors">
                  Smart Spray
                </a>
              </li>
              <li>
                <a href="#evidencia" className="hover:text-precisur-green transition-colors">
                  Evidencia Técnica
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-sm font-semibold text-foreground/70 mb-4 uppercase tracking-wider">
              Contacto
            </h4>
            <ul className="space-y-2 text-sm text-foreground/50">
              <li>
                <a href="#colaboracion" className="hover:text-precisur-green transition-colors">
                  Oportunidades de Colaboración
                </a>
              </li>
              <li>
                <span className="text-foreground/30">danielmalandevitta09@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-precisur-dark-600/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-foreground/30">
            © 2026 Precisur. Iniciativa tecnológica uruguaya.
          </p>
          <p className="text-xs text-foreground/30 font-mono">
            Simulación · Meteorología · Geografía · Ingeniería
          </p>
        </div>
      </div>
    </footer>
  );
}
