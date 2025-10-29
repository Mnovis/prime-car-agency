import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Car } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const sellVehicleSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres").max(100),
  email: z.string().email("Email inválido"),
  phone: z.string().min(10, "Telefone inválido"),
  vehicle_name: z.string().min(3, "Nome do veículo é obrigatório"),
  vehicle_km: z.number().min(0, "KM inválido"),
  desired_price: z.number().min(0, "Valor inválido"),
  observation: z.string().max(500).optional(),
});

const VenderVeiculo = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    vehicle_name: "",
    vehicle_km: "",
    desired_price: "",
    observation: "",
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const validatedData = sellVehicleSchema.parse({
        ...formData,
        vehicle_km: Number(formData.vehicle_km),
        desired_price: Number(formData.desired_price),
      });

      // Upload images
      const imageUrls: string[] = [];
      for (const image of images) {
        const fileExt = image.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("vehicle-sale-images")
          .upload(fileName, image);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from("vehicle-sale-images")
          .getPublicUrl(fileName);

        imageUrls.push(publicUrl);
      }

      // Insert into database
      const { error } = await supabase.from("vehicle_sale_requests").insert({
        seller_name: validatedData.name,
        seller_email: validatedData.email,
        seller_phone: validatedData.phone,
        vehicle_name: validatedData.vehicle_name,
        vehicle_km: validatedData.vehicle_km,
        desired_price: validatedData.desired_price,
        observation: validatedData.observation,
        images: imageUrls,
      });

      if (error) throw error;

      toast({
        title: "Solicitação enviada!",
        description: "Entraremos em contato em breve.",
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        vehicle_name: "",
        vehicle_km: "",
        desired_price: "",
        observation: "",
      });
      setImages([]);
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <Car className="w-16 h-16 text-primary mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Venda seu Veículo
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Temos a solução completa para você vender seu veículo ganhando mais. 
              Garantimos um pagamento 100% seguro e disponibilizamos um consultor 
              especialista que cuidará de sua venda do início ao fim.
            </p>
          </div>

          {/* Form */}
          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Dados Pessoais */}
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                    Dados Pessoais
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <div className="md:col-span-2">
                      <Label htmlFor="phone">Seu Telefone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Dados do Veículo */}
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-4">
                    Dados do Veículo
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="vehicle_name">Veículo</Label>
                      <Input
                        id="vehicle_name"
                        placeholder="Ex: Chevrolet Onix LTZ 2020"
                        value={formData.vehicle_name}
                        onChange={(e) => setFormData({ ...formData, vehicle_name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="vehicle_km">KM do Veículo</Label>
                        <Input
                          id="vehicle_km"
                          type="number"
                          value={formData.vehicle_km}
                          onChange={(e) => setFormData({ ...formData, vehicle_km: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="desired_price">Valor Desejado</Label>
                        <Input
                          id="desired_price"
                          type="number"
                          value={formData.desired_price}
                          onChange={(e) => setFormData({ ...formData, desired_price: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="observation">Observação</Label>
                      <Textarea
                        id="observation"
                        rows={4}
                        value={formData.observation}
                        onChange={(e) => setFormData({ ...formData, observation: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Upload de Fotos */}
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-4">
                    Fotos do Veículo
                  </h2>
                  <div className="border-3 border-dashed border-border rounded-lg p-8 text-center">
                    <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <Label htmlFor="images" className="cursor-pointer">
                      <span className="text-primary font-medium">
                        Clique para selecionar
                      </span>
                      <span className="text-muted-foreground"> ou arraste e solte as fotos aqui</span>
                    </Label>
                    <Input
                      id="images"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    {images.length > 0 && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {images.length} arquivo(s) selecionado(s)
                      </p>
                    )}
                  </div>
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Enviando..." : "Enviar Solicitação"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default VenderVeiculo;
