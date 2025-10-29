import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Gauge, DollarSign, ArrowLeft, MessageSquare, CreditCard } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const proposalSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(10, "Telefone inválido"),
  message: z.string().min(10, "Mensagem muito curta"),
});

const VehicleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [showFinancingForm, setShowFinancingForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const { data: vehicle, isLoading } = useQuery({
    queryKey: ["vehicle", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .eq("id", id)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  const { data: vehicleImages } = useQuery({
    queryKey: ["vehicle-images", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vehicle_images")
        .select("*")
        .eq("vehicle_id", id)
        .order("display_order", { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const formatKm = (km: number) => {
    return new Intl.NumberFormat("pt-BR").format(km) + " km";
  };

  const handleSubmitProposal = async (e: React.FormEvent, type: "purchase" | "financing") => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const validatedData = proposalSchema.parse(formData);

      const { error } = await supabase.from("vehicle_proposals").insert({
        vehicle_id: id,
        type,
        customer_name: validatedData.name,
        customer_email: validatedData.email,
        customer_phone: validatedData.phone,
        message: validatedData.message,
      });

      if (error) throw error;

      toast({
        title: "Proposta enviada!",
        description: "Entraremos em contato em breve.",
      });

      setFormData({ name: "", email: "", phone: "", message: "" });
      setShowProposalForm(false);
      setShowFinancingForm(false);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Erro de validação",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erro ao enviar",
          description: "Tente novamente mais tarde.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 pb-20">
          <div className="container mx-auto px-4">
            <div className="animate-pulse">
              <div className="h-96 bg-card rounded-lg mb-8" />
              <div className="h-64 bg-card rounded-lg" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 pb-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold text-foreground mb-4">Veículo não encontrado</h1>
            <Button onClick={() => navigate("/estoque")}>Voltar ao Estoque</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const images = vehicleImages && vehicleImages.length > 0 
    ? vehicleImages.map(img => img.image_url)
    : [vehicle.image_url || "/placeholder.svg"];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Gallery */}
            <div>
              <div className="aspect-[16/10] rounded-lg overflow-hidden mb-4">
                <img
                  src={images[selectedImageIndex]}
                  alt={`${vehicle.name} ${vehicle.model}`}
                  className="w-full h-full object-cover"
                />
              </div>
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-3 transition-all ${
                        selectedImageIndex === index
                          ? "border-primary"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${vehicle.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Vehicle Info */}
            <div>
              <div className="mb-6">
                <h1 className="text-4xl font-bold text-foreground mb-2">
                  {vehicle.name}
                </h1>
                <p className="text-xl text-muted-foreground">{vehicle.model}</p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 text-lg">
                  <Calendar className="w-6 h-6 text-primary" />
                  <span className="text-foreground font-medium">{vehicle.year}</span>
                </div>
                <div className="flex items-center gap-3 text-lg">
                  <Gauge className="w-6 h-6 text-primary" />
                  <span className="text-foreground font-medium">{formatKm(vehicle.km)}</span>
                </div>
                <div className="flex items-center gap-3 text-lg">
                  <DollarSign className="w-6 h-6 text-primary" />
                  <span className="text-3xl font-bold text-primary">
                    {formatPrice(vehicle.price)}
                  </span>
                </div>
              </div>

              {vehicle.description && (
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-foreground mb-3">Descrição</h2>
                  <p className="text-muted-foreground leading-relaxed">{vehicle.description}</p>
                </div>
              )}

              <div className="space-y-3">
                <Button
                  size="lg"
                  className="w-full"
                  onClick={() => setShowProposalForm(!showProposalForm)}
                >
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Enviar Proposta de Compra
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowFinancingForm(!showFinancingForm)}
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  Solicitar Financiamento
                </Button>
              </div>
            </div>
          </div>

          {/* Proposal Form */}
          {(showProposalForm || showFinancingForm) && (
            <Card className="mt-8 max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>
                  {showProposalForm ? "Enviar Proposta de Compra" : "Solicitar Financiamento"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => handleSubmitProposal(e, showProposalForm ? "purchase" : "financing")} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Seu Nome</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Seu Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Seu Telefone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="message">Mensagem</Label>
                    <Textarea
                      id="message"
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button type="submit" className="flex-1" disabled={isSubmitting}>
                      {isSubmitting ? "Enviando..." : "Enviar"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowProposalForm(false);
                        setShowFinancingForm(false);
                      }}
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default VehicleDetails;
