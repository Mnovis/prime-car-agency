import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { LogOut, Plus, Pencil, Trash2, Upload } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

const vehicleSchema = z.object({
  name: z.string().trim().min(1, "Nome é obrigatório").max(100),
  model: z.string().trim().min(1, "Modelo é obrigatório").max(100),
  brand: z.string().trim().min(1, "Marca é obrigatória").max(50),
  year: z.number().min(1900).max(2030),
  km: z.number().min(0),
  price: z.number().min(0),
  description: z.string().trim().max(1000).optional(),
});

const Admin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    model: "",
    brand: "",
    year: new Date().getFullYear(),
    km: 0,
    price: 0,
    description: "",
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/auth");
      }
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const { data: vehicles, isLoading } = useQuery({
    queryKey: ["admin-vehicles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const resetForm = () => {
    setFormData({
      name: "",
      model: "",
      brand: "",
      year: new Date().getFullYear(),
      km: 0,
      price: 0,
      description: "",
    });
    setImageFile(null);
    setEditingId(null);
    setShowForm(false);
  };

  const uploadImage = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('vehicle-images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('vehicle-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      const validated = vehicleSchema.parse(formData);
      
      let imageUrl = null;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const vehicleData: any = {
        ...validated,
        ...(imageUrl && { image_url: imageUrl }),
      };

      if (editingId) {
        const { error } = await supabase
          .from("vehicles")
          .update(vehicleData)
          .eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("vehicles")
          .insert([vehicleData]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-vehicles"] });
      toast.success(editingId ? "Veículo atualizado!" : "Veículo adicionado!");
      resetForm();
    },
    onError: (error) => {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("Erro ao salvar veículo");
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("vehicles")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-vehicles"] });
      toast.success("Veículo removido!");
    },
    onError: () => {
      toast.error("Erro ao remover veículo");
    },
  });

  const handleEdit = (vehicle: any) => {
    setFormData({
      name: vehicle.name,
      model: vehicle.model,
      brand: vehicle.brand,
      year: vehicle.year,
      km: vehicle.km,
      price: vehicle.price,
      description: vehicle.description || "",
    });
    setEditingId(vehicle.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja remover este veículo?")) {
      deleteMutation.mutate(id);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-foreground">Painel Administrativo</h1>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>

        {/* Add Vehicle Button */}
        {!showForm && (
          <Button onClick={() => setShowForm(true)} className="mb-6">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Veículo
          </Button>
        )}

        {/* Form */}
        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>
                {editingId ? "Editar Veículo" : "Adicionar Novo Veículo"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(); }} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Nome *</label>
                    <Input
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      maxLength={100}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Modelo *</label>
                    <Input
                      required
                      value={formData.model}
                      onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                      maxLength={100}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Marca *</label>
                    <Input
                      required
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      maxLength={50}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Ano *</label>
                    <Input
                      type="number"
                      required
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                      min={1900}
                      max={2030}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Quilometragem *</label>
                    <Input
                      type="number"
                      required
                      value={formData.km}
                      onChange={(e) => setFormData({ ...formData, km: parseInt(e.target.value) })}
                      min={0}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Preço (R$) *</label>
                    <Input
                      type="number"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                      min={0}
                      step={0.01}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Descrição</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    maxLength={1000}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Imagem do Veículo
                  </label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    className="mt-2"
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={saveMutation.isPending}>
                    {saveMutation.isPending ? "Salvando..." : (editingId ? "Atualizar" : "Adicionar")}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Vehicles List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Veículos Cadastrados</h2>
          
          {isLoading ? (
            <div className="grid grid-cols-1 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-card rounded-lg animate-pulse" />
              ))}
            </div>
          ) : vehicles && vehicles.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {vehicles.map((vehicle) => (
                <Card key={vehicle.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {vehicle.image_url && (
                          <img
                            src={vehicle.image_url}
                            alt={vehicle.name}
                            className="w-24 h-24 object-cover rounded-lg"
                          />
                        )}
                        <div>
                          <h3 className="text-lg font-bold text-foreground">
                            {vehicle.name} - {vehicle.model}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {vehicle.brand} | {vehicle.year} | {vehicle.km.toLocaleString()} km
                          </p>
                          <p className="text-lg font-bold text-primary mt-1">
                            {new Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(vehicle.price)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(vehicle)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(vehicle.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">
                  Nenhum veículo cadastrado ainda. Clique em "Adicionar Veículo" para começar.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
