import { Car, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo e Descrição */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                <Car className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Prime Motors</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Sua agência de confiança para veículos premium. 
              Excelência e qualidade desde 2020.
            </p>
          </div>

          {/* Links Rápidos */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Links Rápidos</h4>
            <div className="space-y-2">
              <Link to="/" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Início
              </Link>
              <Link to="/estoque" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Estoque
              </Link>
              <Link to="/sobre" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Sobre
              </Link>
              <Link to="/contato" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Contato
              </Link>
            </div>
          </div>

          {/* Contato */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Contato</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4 text-primary" />
                <span>(11) 9999-9999</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4 text-primary" />
                <span>contato@primemotors.com</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary" />
                <span>São Paulo, SP</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 Prime Motors. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
