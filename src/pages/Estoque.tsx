import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VehicleCard from "@/components/VehicleCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

const Estoque = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [brandFilter, setBrandFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");

  const { data: vehicles, isLoading } = useQuery({
    queryKey: ["vehicles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  // Get unique brands
  const brands = vehicles 
    ? Array.from(new Set(vehicles.map(v => v.brand))).sort()
    : [];

  // Filter vehicles
  const filteredVehicles = vehicles?.filter(vehicle => {
    const matchesSearch = 
      vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesBrand = brandFilter === "all" || vehicle.brand === brandFilter;
    
    const matchesYear = 
      yearFilter === "all" ||
      (yearFilter === "new" && vehicle.year >= 2022) ||
      (yearFilter === "used" && vehicle.year < 2022);
    
    const matchesPrice = 
      priceFilter === "all" ||
      (priceFilter === "low" && vehicle.price < 50000) ||
      (priceFilter === "mid" && vehicle.price >= 50000 && vehicle.price < 100000) ||
      (priceFilter === "high" && vehicle.price >= 100000);

    return matchesSearch && matchesBrand && matchesYear && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Nosso Estoque
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore nossa seleção premium de veículos
            </p>
          </div>

          {/* Filters */}
          <div className="bg-card rounded-lg border border-border p-6 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar veículo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={brandFilter} onValueChange={setBrandFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as marcas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as marcas</SelectItem>
                  {brands.map(brand => (
                    <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={yearFilter} onValueChange={setYearFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os anos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os anos</SelectItem>
                  <SelectItem value="new">2022 ou mais novo</SelectItem>
                  <SelectItem value="used">Antes de 2022</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priceFilter} onValueChange={setPriceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Faixa de preço" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os preços</SelectItem>
                  <SelectItem value="low">Até R$ 50.000</SelectItem>
                  <SelectItem value="mid">R$ 50.000 - R$ 100.000</SelectItem>
                  <SelectItem value="high">Acima de R$ 100.000</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-96 bg-card rounded-lg animate-pulse" />
              ))}
            </div>
          ) : filteredVehicles && filteredVehicles.length > 0 ? (
            <>
              <p className="text-muted-foreground mb-6">
                {filteredVehicles.length} veículo(s) encontrado(s)
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredVehicles.map((vehicle) => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground">
                Nenhum veículo encontrado com os filtros selecionados.
              </p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Estoque;
