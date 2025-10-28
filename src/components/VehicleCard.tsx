import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Gauge, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VehicleCardProps {
  vehicle: {
    id: string;
    name: string;
    model: string;
    year: number;
    km: number;
    price: number;
    brand: string;
    image_url?: string;
  };
  onViewDetails?: (id: string) => void;
}

const VehicleCard = ({ vehicle, onViewDetails }: VehicleCardProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const formatKm = (km: number) => {
    return new Intl.NumberFormat("pt-BR").format(km) + " km";
  };

  return (
    <Card className="group overflow-hidden bg-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(220,38,38,0.15)]">
      <div className="relative overflow-hidden aspect-[16/10]">
        <img
          src={vehicle.image_url || "/placeholder.svg"}
          alt={`${vehicle.name} ${vehicle.model}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground">
          {vehicle.brand}
        </Badge>
      </div>
      
      <CardContent className="p-6">
        <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
          {vehicle.name}
        </h3>
        <p className="text-sm text-muted-foreground mb-4">{vehicle.model}</p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 text-primary" />
            <span>{vehicle.year}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Gauge className="w-4 h-4 text-primary" />
            <span>{formatKm(vehicle.km)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-primary" />
            <span className="text-2xl font-bold text-primary">
              {formatPrice(vehicle.price)}
            </span>
          </div>
          {onViewDetails && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewDetails(vehicle.id)}
              className="hover:bg-primary/10 hover:text-primary"
            >
              Detalhes
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VehicleCard;
