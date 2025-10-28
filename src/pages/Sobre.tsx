import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Award, Users, TrendingUp, Shield } from "lucide-react";

const Sobre = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          {/* Hero */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Sobre a Prime Motors
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Excelência em veículos premium desde 2020
            </p>
          </div>

          {/* Story */}
          <div className="max-w-4xl mx-auto mb-20">
            <div className="bg-card rounded-lg border border-border p-8 md:p-12">
              <h2 className="text-3xl font-bold text-foreground mb-6">Nossa História</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  A Prime Motors nasceu com a missão de revolucionar o mercado de veículos premium 
                  no Brasil. Fundada em 2020, nossa empresa se dedica a oferecer os melhores 
                  automóveis com qualidade garantida e atendimento personalizado.
                </p>
                <p>
                  Com uma equipe altamente qualificada e apaixonada por automóveis, trabalhamos 
                  incansavelmente para selecionar apenas os melhores veículos do mercado. Cada 
                  carro passa por uma rigorosa inspeção de qualidade antes de ser disponibilizado 
                  para venda.
                </p>
                <p>
                  Nosso compromisso é com a excelência e a satisfação total de nossos clientes. 
                  Acreditamos que comprar um carro deve ser uma experiência prazerosa e sem 
                  preocupações, por isso oferecemos todo o suporte necessário em cada etapa do 
                  processo.
                </p>
              </div>
            </div>
          </div>

          {/* Values */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">
              Nossos Valores
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-card rounded-lg border border-border p-6 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Qualidade</h3>
                <p className="text-muted-foreground">
                  Apenas os melhores veículos selecionados com critério
                </p>
              </div>

              <div className="bg-card rounded-lg border border-border p-6 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Atendimento</h3>
                <p className="text-muted-foreground">
                  Equipe especializada pronta para te ajudar
                </p>
              </div>

              <div className="bg-card rounded-lg border border-border p-6 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Confiança</h3>
                <p className="text-muted-foreground">
                  Transparência e honestidade em todas as negociações
                </p>
              </div>

              <div className="bg-card rounded-lg border border-border p-6 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Inovação</h3>
                <p className="text-muted-foreground">
                  Sempre buscando as melhores soluções para você
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-card rounded-lg border border-border p-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-5xl font-bold text-primary mb-2">500+</div>
                <div className="text-muted-foreground">Veículos Vendidos</div>
              </div>
              <div>
                <div className="text-5xl font-bold text-primary mb-2">98%</div>
                <div className="text-muted-foreground">Clientes Satisfeitos</div>
              </div>
              <div>
                <div className="text-5xl font-bold text-primary mb-2">5</div>
                <div className="text-muted-foreground">Anos de Experiência</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Sobre;
