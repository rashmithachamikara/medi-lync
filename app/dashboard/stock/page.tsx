"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, ShoppingCart, PackageOpen, MapPin } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const generateMockStock = () => {
  const items = [
    "Paracetamol 500mg",
    "Amoxicillin 250mg",
    "Ibuprofen 400mg",
    "Aspirin 100mg",
    "Metformin 500mg",
    "Omeprazole 20mg",
    "Atorvastatin 10mg",
    "Losartan 50mg",
    "Amlodipine 5mg",
    "Cetirizine 10mg",
    "Ranitidine 150mg",
    "Diclofenac 50mg",
    "Lisinopril 10mg",
    "Simvastatin 20mg",
    "Gabapentin 300mg",
    "Hydrochlorothiazide 25mg",
    "Azithromycin 500mg",
    "Ciprofloxacin 500mg",
  ];
  
  // Generate locations for 6 shelves (A-F) with 4 layers (1-4) each
  const locations: string[] = [];
  const shelves = ["A", "B", "C", "D", "E", "F"];
  const layers = [1, 2, 3, 4];
  
  shelves.forEach(shelf => {
    layers.forEach(layer => {
      locations.push(`Shelf ${shelf}${layer}`);
    });
  });
  
  locations.push("Cold Storage 1", "Cold Storage 2");

  return items.map((item, index) => ({
    id: `STK-${String(index + 1).padStart(3, "0")}`,
    name: item,
    quantity: Math.floor(Math.random() * 500) + 50,
    location: locations[Math.floor(Math.random() * locations.length)],
    status: Math.random() > 0.7 ? "low" : "normal",
    reorderLevel: 100,
  }));
};

type StockItem = {
  id: string;
  name: string;
  quantity: number;
  location: string;
  status: string;
  reorderLevel: number;
};

type Shelf = {
  id: string;
  name: string;
  layers: number;
};

type ColdStorage = {
  id: string;
  name: string;
};

// Rack Shelf Visualization Component
const RackShelfVisualization = ({ 
  stock, 
  shelves,
  coldStorageUnits,
  onRemoveShelf,
  onRemoveColdStorage,
}: { 
  stock: StockItem[]; 
  shelves: Shelf[];
  coldStorageUnits: ColdStorage[];
  onRemoveShelf: (shelfId: string) => void;
  onRemoveColdStorage: (storageId: string) => void;
}) => {

  const getItemsInLocation = (location: string) => {
    return stock.filter((item) => item.location === location);
  };

  const getLocationColor = (location: string) => {
    const items = getItemsInLocation(location);
    if (items.length === 0) return "bg-slate-100 dark:bg-slate-800";
    const hasLowStock = items.some((item) => item.status === "low");
    if (hasLowStock) return "bg-red-100 dark:bg-red-900/30 border-red-400";
    return "bg-green-100 dark:bg-green-900/30 border-green-400";
  };

  const canRemoveShelf = (shelf: Shelf) => {
    // Check if any layer of this shelf has stock
    for (let layer = 1; layer <= shelf.layers; layer++) {
      const location = `Shelf ${shelf.name}${layer}`;
      if (getItemsInLocation(location).length > 0) {
        return false;
      }
    }
    return true;
  };

  const canRemoveColdStorage = (storageName: string) => {
    return getItemsInLocation(storageName).length === 0;
  };

  return (
    <div className="space-y-6">
      {/* Main Racks */}
      <div>
        <h4 className="text-sm font-semibold mb-4 flex items-center gap-2">
          <PackageOpen className="h-4 w-4" />
          Main Storage Racks
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shelves.map((shelf) => {
            const layers = Array.from({ length: shelf.layers }, (_, i) => shelf.layers - i); // Top to bottom
            const removable = canRemoveShelf(shelf);
            
            return (
              <div key={shelf.id} className="space-y-2">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-center font-semibold text-sm text-muted-foreground">
                    {shelf.name}
                  </div>
                  {removable && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveShelf(shelf.id)}
                      className="h-6 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                    >
                      Remove
                    </Button>
                  )}
                </div>
                {layers.map((layer) => {
                  const location = `Shelf ${shelf.name}${layer}`;
                  const items = getItemsInLocation(location);
                  const totalQty = items.reduce(
                    (sum, item) => sum + item.quantity,
                    0
                  );

                  return (
                    <div
                      key={layer}
                      className={`border-2 rounded-lg p-3 transition-all hover:shadow-md ${getLocationColor(
                        location
                      )}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{location}</span>
                        <Badge variant="outline" className="text-xs">
                          {items.length} items
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Total: {totalQty} units
                      </div>
                      {items.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {items.slice(0, 2).map((item) => (
                            <div
                              key={item.id}
                              className="text-xs truncate bg-white/50 dark:bg-slate-900/50 px-2 py-1 rounded"
                            >
                              {item.name} ({item.quantity})
                            </div>
                          ))}
                          {items.length > 2 && (
                            <div className="text-xs text-muted-foreground">
                              +{items.length - 2} more...
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Cold Storage */}
      <div>
        <h4 className="text-sm font-semibold mb-4 flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Cold Storage
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {coldStorageUnits.map((storage) => {
            const items = getItemsInLocation(storage.name);
            const totalQty = items.reduce(
              (sum, item) => sum + item.quantity,
              0
            );
            const removable = canRemoveColdStorage(storage.name);

            return (
              <div
                key={storage.id}
                className={`border-2 rounded-lg p-4 transition-all hover:shadow-md ${getLocationColor(
                  storage.name
                )}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{storage.name}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {items.length} items
                    </Badge>
                    {removable && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveColdStorage(storage.id)}
                        className="h-6 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mb-2">
                  Total: {totalQty} units
                </div>
                {items.length > 0 && (
                  <div className="space-y-1">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="text-xs truncate bg-white/50 dark:bg-slate-900/50 px-2 py-1 rounded"
                      >
                        {item.name} ({item.quantity})
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-100 dark:bg-green-900/30 border-2 border-green-400 rounded"></div>
          <span>Normal Stock</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-100 dark:bg-red-900/30 border-2 border-red-400 rounded"></div>
          <span>Low Stock</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-slate-100 dark:bg-slate-800 border-2 rounded"></div>
          <span>Empty</span>
        </div>
      </div>
    </div>
  );
};

export default function StockPage() {
  const router = useRouter();
  const [stock, setStock] = useState(generateMockStock());
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLocation, setFilterLocation] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Initialize default shelves (A-F with 4 layers each)
  const [shelves, setShelves] = useState<Shelf[]>([
    { id: "shelf-a", name: "A", layers: 4 },
    { id: "shelf-b", name: "B", layers: 4 },
    { id: "shelf-c", name: "C", layers: 4 },
    { id: "shelf-d", name: "D", layers: 4 },
    { id: "shelf-e", name: "E", layers: 4 },
    { id: "shelf-f", name: "F", layers: 4 },
  ]);

  // Initialize default cold storage units
  const [coldStorageUnits, setColdStorageUnits] = useState<ColdStorage[]>([
    { id: "cold-1", name: "Cold Storage 1" },
    { id: "cold-2", name: "Cold Storage 2" },
  ]);

  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isAddShelfDialogOpen, setIsAddShelfDialogOpen] = useState(false);
  const [isAddColdStorageDialogOpen, setIsAddColdStorageDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<StockItem | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    location: "",
    reorderLevel: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Shelf form states
  const [shelfFormData, setShelfFormData] = useState({
    name: "",
    layers: "4",
  });
  const [shelfFormErrors, setShelfFormErrors] = useState<Record<string, string>>({});

  // Cold storage form states
  const [coldStorageFormData, setColdStorageFormData] = useState({
    name: "",
  });
  const [coldStorageFormErrors, setColdStorageFormErrors] = useState<Record<string, string>>({});

  // Generate all available locations based on current shelves and cold storage
  const getAllLocations = () => {
    const locations: string[] = [];
    shelves.forEach(shelf => {
      for (let layer = 1; layer <= shelf.layers; layer++) {
        locations.push(`Shelf ${shelf.name}${layer}`);
      }
    });
    coldStorageUnits.forEach(storage => {
      locations.push(storage.name);
    });
    return locations;
  };

  const allLocations = getAllLocations();

  const filteredStock = stock.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation =
      filterLocation === "all" || item.location === filterLocation;
    const matchesStatus =
      filterStatus === "all" || item.status === filterStatus;
    return matchesSearch && matchesLocation && matchesStatus;
  });

  const totalPages = Math.ceil(filteredStock.length / itemsPerPage);
  const paginatedStock = filteredStock.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const locations = [...new Set(stock.map((item) => item.location))];

  // Form validation
  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = "Item name is required";
    } else if (formData.name.length < 3) {
      errors.name = "Item name must be at least 3 characters";
    }

    if (!formData.quantity) {
      errors.quantity = "Quantity is required";
    } else if (parseInt(formData.quantity) < 0) {
      errors.quantity = "Quantity cannot be negative";
    } else if (!Number.isInteger(Number(formData.quantity))) {
      errors.quantity = "Quantity must be a whole number";
    }

    if (!formData.location) {
      errors.location = "Location is required";
    }

    if (!formData.reorderLevel) {
      errors.reorderLevel = "Reorder level is required";
    } else if (parseInt(formData.reorderLevel) < 0) {
      errors.reorderLevel = "Reorder level cannot be negative";
    } else if (!Number.isInteger(Number(formData.reorderLevel))) {
      errors.reorderLevel = "Reorder level must be a whole number";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      quantity: "",
      location: "",
      reorderLevel: "",
    });
    setFormErrors({});
  };

  // Handle add stock
  const handleAddStock = () => {
    if (!validateForm()) return;

    const newItem: StockItem = {
      id: `STK-${String(stock.length + 1).padStart(3, "0")}`,
      name: formData.name,
      quantity: parseInt(formData.quantity),
      location: formData.location,
      status:
        parseInt(formData.quantity) < parseInt(formData.reorderLevel)
          ? "low"
          : "normal",
      reorderLevel: parseInt(formData.reorderLevel),
    };

    setStock([...stock, newItem]);
    setIsAddDialogOpen(false);
    resetForm();
  };

  // Handle update stock
  const handleUpdateStock = () => {
    if (!validateForm() || !selectedItem) return;

    const updatedStock = stock.map((item) =>
      item.id === selectedItem.id
        ? {
            ...item,
            name: formData.name,
            quantity: parseInt(formData.quantity),
            location: formData.location,
            status:
              parseInt(formData.quantity) < parseInt(formData.reorderLevel)
                ? "low"
                : "normal",
            reorderLevel: parseInt(formData.reorderLevel),
          }
        : item
    );

    setStock(updatedStock);
    setIsUpdateDialogOpen(false);
    setSelectedItem(null);
    resetForm();
  };

  // Open update dialog with item data
  const openUpdateDialog = (item: StockItem) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      quantity: item.quantity.toString(),
      location: item.location,
      reorderLevel: item.reorderLevel.toString(),
    });
    setIsUpdateDialogOpen(true);
  };

  // Open add dialog
  const openAddDialog = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };

  // Validate shelf form
  const validateShelfForm = () => {
    const errors: Record<string, string> = {};

    if (!shelfFormData.name.trim()) {
      errors.name = "Shelf name is required";
    } else if (shelfFormData.name.length > 3) {
      errors.name = "Shelf name must be 3 characters or less";
    } else if (!/^[A-Z0-9]+$/i.test(shelfFormData.name)) {
      errors.name = "Shelf name must contain only letters and numbers";
    } else if (shelves.some(s => s.name.toLowerCase() === shelfFormData.name.toLowerCase())) {
      errors.name = "A shelf with this name already exists";
    }

    if (!shelfFormData.layers) {
      errors.layers = "Number of layers is required";
    } else if (parseInt(shelfFormData.layers) < 1) {
      errors.layers = "Must have at least 1 layer";
    } else if (parseInt(shelfFormData.layers) > 10) {
      errors.layers = "Maximum 10 layers allowed";
    } else if (!Number.isInteger(Number(shelfFormData.layers))) {
      errors.layers = "Layers must be a whole number";
    }

    setShelfFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Reset shelf form
  const resetShelfForm = () => {
    setShelfFormData({
      name: "",
      layers: "4",
    });
    setShelfFormErrors({});
  };

  // Handle add shelf
  const handleAddShelf = () => {
    if (!validateShelfForm()) return;

    const newShelf: Shelf = {
      id: `shelf-${shelfFormData.name.toLowerCase()}-${Date.now()}`,
      name: shelfFormData.name.toUpperCase(),
      layers: parseInt(shelfFormData.layers),
    };

    setShelves([...shelves, newShelf]);
    setIsAddShelfDialogOpen(false);
    resetShelfForm();
  };

  // Open add shelf dialog
  const openAddShelfDialog = () => {
    resetShelfForm();
    setIsAddShelfDialogOpen(true);
  };

  // Validate cold storage form
  const validateColdStorageForm = () => {
    const errors: Record<string, string> = {};

    if (!coldStorageFormData.name.trim()) {
      errors.name = "Cold storage name is required";
    } else if (coldStorageFormData.name.length < 3) {
      errors.name = "Name must be at least 3 characters";
    } else if (coldStorageUnits.some(s => s.name.toLowerCase() === coldStorageFormData.name.toLowerCase())) {
      errors.name = "A cold storage unit with this name already exists";
    }

    setColdStorageFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Reset cold storage form
  const resetColdStorageForm = () => {
    setColdStorageFormData({
      name: "",
    });
    setColdStorageFormErrors({});
  };

  // Handle add cold storage
  const handleAddColdStorage = () => {
    if (!validateColdStorageForm()) return;

    const newColdStorage: ColdStorage = {
      id: `cold-${Date.now()}`,
      name: coldStorageFormData.name,
    };

    setColdStorageUnits([...coldStorageUnits, newColdStorage]);
    setIsAddColdStorageDialogOpen(false);
    resetColdStorageForm();
  };

  // Open add cold storage dialog
  const openAddColdStorageDialog = () => {
    resetColdStorageForm();
    setIsAddColdStorageDialogOpen(true);
  };

  // Handle remove shelf
  const handleRemoveShelf = (shelfId: string) => {
    const shelf = shelves.find(s => s.id === shelfId);
    if (!shelf) return;

    // Check if any layer has stock
    for (let layer = 1; layer <= shelf.layers; layer++) {
      const location = `Shelf ${shelf.name}${layer}`;
      if (stock.some(item => item.location === location)) {
        alert(`Cannot remove shelf ${shelf.name}: It contains stock items. Please relocate all items first.`);
        return;
      }
    }

    if (confirm(`Are you sure you want to remove shelf ${shelf.name}?`)) {
      setShelves(shelves.filter(s => s.id !== shelfId));
    }
  };

  // Handle remove cold storage
  const handleRemoveColdStorage = (storageId: string) => {
    const storage = coldStorageUnits.find(s => s.id === storageId);
    if (!storage) return;

    if (stock.some(item => item.location === storage.name)) {
      alert(`Cannot remove ${storage.name}: It contains stock items. Please relocate all items first.`);
      return;
    }

    if (confirm(`Are you sure you want to remove ${storage.name}?`)) {
      setColdStorageUnits(coldStorageUnits.filter(s => s.id !== storageId));
    }
  };

  const handleOrderRequest = (item: StockItem) => {
    // Redirect to purchase orders page with item data as query params
    router.push(
      `/dashboard/purchaseOrders?item=${encodeURIComponent(item.name)}&quantity=${item.quantity}&reorderLevel=${item.reorderLevel}&itemId=${item.id}`
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6">
      {/* Header section */}
      <div className="max-w-7xl mx-auto space-y-6 flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-600 to-slate-700 dark:from-white dark:to-slate-300">
          Stock Control
        </h3>

        <Button onClick={openAddDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Add Stock
        </Button>
      </div>

      {/* Stock Level Summary */}
      <div className="max-w-7xl mx-auto mb-6">
        {" "}
        {/* Added mb-6 margin bottom */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {stock.length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Low Stock Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {stock.filter((item) => item.status === "low").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Quantity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {stock
                  .reduce((sum, item) => sum + item.quantity, 0)
                  .toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="max-w-7xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Stock Management</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="inventory" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="inventory">Inventory Table</TabsTrigger>
                <TabsTrigger value="location">Location View</TabsTrigger>
              </TabsList>

              <TabsContent value="inventory" className="space-y-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <div className="relative w-full sm:w-64">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search items..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Select
                      value={filterLocation}
                      onValueChange={setFilterLocation}
                    >
                      <SelectTrigger className="w-full sm:w-40">
                        <SelectValue placeholder="Location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Locations</SelectItem>
                        {locations.map((location) => (
                          <SelectItem key={location} value={location}>
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={filterStatus}
                      onValueChange={setFilterStatus}
                    >
                      <SelectTrigger className="w-full sm:w-32">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="low">Low Stock</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          Item ID
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          Item Name
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          Quantity
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          Location
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          Status
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedStock.map((item) => (
                        <tr
                          key={item.id}
                          className="border-b border-border last:border-0"
                        >
                          <td className="py-3 px-4 text-sm font-medium text-foreground">
                            {item.id}
                          </td>
                          <td className="py-3 px-4 text-sm text-foreground">
                            {item.name}
                          </td>
                          <td className="py-3 px-4 text-sm text-foreground">
                            {item.quantity}
                          </td>
                          <td className="py-3 px-4 text-sm text-foreground">
                            {item.location}
                          </td>
                          <td className="py-3 px-4">
                            <Badge
                              variant={
                                item.status === "low"
                                  ? "destructive"
                                  : "default"
                              }
                            >
                              {item.status === "low" ? "Low Stock" : "Normal"}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openUpdateDialog(item)}
                              >
                                Update
                              </Button>
                              {item.status === "low" && (
                                <Button
                                  size="sm"
                                  variant="default"
                                  onClick={() => handleOrderRequest(item)}
                                >
                                  <ShoppingCart className="h-4 w-4 mr-1" />
                                  Order
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                    {Math.min(
                      currentPage * itemsPerPage,
                      filteredStock.length
                    )}{" "}
                    of {filteredStock.length} items
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="location">
                <div className="space-y-4">
                  <div className="flex justify-end gap-2">
                    <Button onClick={openAddShelfDialog} variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Shelf
                    </Button>
                    <Button onClick={openAddColdStorageDialog} variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Cold Storage
                    </Button>
                  </div>
                  <RackShelfVisualization 
                    stock={stock} 
                    shelves={shelves}
                    coldStorageUnits={coldStorageUnits}
                    onRemoveShelf={handleRemoveShelf}
                    onRemoveColdStorage={handleRemoveColdStorage}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Add Stock Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Stock Item</DialogTitle>
            <DialogDescription>
              Add a new item to your inventory. Fill in all required fields.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="add-name">
                Item Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="add-name"
                placeholder="e.g., Paracetamol 500mg"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              {formErrors.name && (
                <p className="text-sm text-red-500">{formErrors.name}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="add-quantity">
                  Quantity <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="add-quantity"
                  type="number"
                  placeholder="0"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: e.target.value })
                  }
                />
                {formErrors.quantity && (
                  <p className="text-sm text-red-500">{formErrors.quantity}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-reorder">
                  Reorder Level <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="add-reorder"
                  type="number"
                  placeholder="0"
                  value={formData.reorderLevel}
                  onChange={(e) =>
                    setFormData({ ...formData, reorderLevel: e.target.value })
                  }
                />
                {formErrors.reorderLevel && (
                  <p className="text-sm text-red-500">
                    {formErrors.reorderLevel}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-location">
                Storage Location <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.location}
                onValueChange={(value) =>
                  setFormData({ ...formData, location: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a location" />
                </SelectTrigger>
                <SelectContent>
                  <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">
                    Main Racks
                  </div>
                  {shelves.map((shelf) => (
                    <div key={shelf.id}>
                      {Array.from({ length: shelf.layers }, (_, i) => i + 1).map((layer) => {
                        const location = `Shelf ${shelf.name}${layer}`;
                        return (
                          <SelectItem key={location} value={location}>
                            {location}
                          </SelectItem>
                        );
                      })}
                    </div>
                  ))}
                  {coldStorageUnits.length > 0 && (
                    <>
                      <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">
                        Cold Storage
                      </div>
                      {coldStorageUnits.map((storage) => (
                        <SelectItem key={storage.id} value={storage.name}>
                          {storage.name}
                        </SelectItem>
                      ))}
                    </>
                  )}
                </SelectContent>
              </Select>
              {formErrors.location && (
                <p className="text-sm text-red-500">{formErrors.location}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddDialogOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleAddStock}>Add Item</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Stock Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Update Stock Item</DialogTitle>
            <DialogDescription>
              Update the details of {selectedItem?.name}. You can change
              quantity, location, and reorder level.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="update-name">
                Item Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="update-name"
                placeholder="e.g., Paracetamol 500mg"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              {formErrors.name && (
                <p className="text-sm text-red-500">{formErrors.name}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="update-quantity">
                  Quantity <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="update-quantity"
                  type="number"
                  placeholder="0"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: e.target.value })
                  }
                />
                {formErrors.quantity && (
                  <p className="text-sm text-red-500">{formErrors.quantity}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="update-reorder">
                  Reorder Level <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="update-reorder"
                  type="number"
                  placeholder="0"
                  value={formData.reorderLevel}
                  onChange={(e) =>
                    setFormData({ ...formData, reorderLevel: e.target.value })
                  }
                />
                {formErrors.reorderLevel && (
                  <p className="text-sm text-red-500">
                    {formErrors.reorderLevel}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="update-location">
                Storage Location <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.location}
                onValueChange={(value) =>
                  setFormData({ ...formData, location: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a location" />
                </SelectTrigger>
                <SelectContent>
                  <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">
                    Main Racks
                  </div>
                  {shelves.map((shelf) => (
                    <div key={shelf.id}>
                      {Array.from({ length: shelf.layers }, (_, i) => i + 1).map((layer) => {
                        const location = `Shelf ${shelf.name}${layer}`;
                        return (
                          <SelectItem key={location} value={location}>
                            {location}
                          </SelectItem>
                        );
                      })}
                    </div>
                  ))}
                  {coldStorageUnits.length > 0 && (
                    <>
                      <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">
                        Cold Storage
                      </div>
                      {coldStorageUnits.map((storage) => (
                        <SelectItem key={storage.id} value={storage.name}>
                          {storage.name}
                        </SelectItem>
                      ))}
                    </>
                  )}
                </SelectContent>
              </Select>
              {formErrors.location && (
                <p className="text-sm text-red-500">{formErrors.location}</p>
              )}
            </div>
            {selectedItem && (
              <div className="rounded-lg bg-muted p-3 text-sm">
                <p className="font-medium">Current Location:</p>
                <p className="text-muted-foreground">{selectedItem.location}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsUpdateDialogOpen(false);
                setSelectedItem(null);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateStock}>Update Item</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Shelf Dialog */}
      <Dialog open={isAddShelfDialogOpen} onOpenChange={setIsAddShelfDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Add New Shelf</DialogTitle>
            <DialogDescription>
              Create a new storage shelf with custom name and number of layers.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="shelf-name">
                Shelf Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="shelf-name"
                placeholder="e.g., G or X1"
                maxLength={3}
                value={shelfFormData.name}
                onChange={(e) =>
                  setShelfFormData({ ...shelfFormData, name: e.target.value.toUpperCase() })
                }
              />
              {shelfFormErrors.name && (
                <p className="text-sm text-red-500">{shelfFormErrors.name}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Use 1-3 letters/numbers (e.g., A, G, X1, Z2)
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="shelf-layers">
                Number of Layers <span className="text-red-500">*</span>
              </Label>
              <Input
                id="shelf-layers"
                type="number"
                min="1"
                max="10"
                placeholder="4"
                value={shelfFormData.layers}
                onChange={(e) =>
                  setShelfFormData({ ...shelfFormData, layers: e.target.value })
                }
              />
              {shelfFormErrors.layers && (
                <p className="text-sm text-red-500">{shelfFormErrors.layers}</p>
              )}
              <p className="text-xs text-muted-foreground">
                How many layers this shelf will have (1-10)
              </p>
            </div>
            <div className="rounded-lg bg-muted p-3 text-sm">
              <p className="font-medium mb-1">Preview:</p>
              <p className="text-muted-foreground">
                {shelfFormData.name
                  ? `Shelf ${shelfFormData.name.toUpperCase()}1, Shelf ${shelfFormData.name.toUpperCase()}2, ...`
                  : "Enter a shelf name to see preview"}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddShelfDialogOpen(false);
                resetShelfForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleAddShelf}>Add Shelf</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Cold Storage Dialog */}
      <Dialog open={isAddColdStorageDialogOpen} onOpenChange={setIsAddColdStorageDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Add Cold Storage Unit</DialogTitle>
            <DialogDescription>
              Create a new cold storage unit with a custom name.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="cold-storage-name">
                Cold Storage Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="cold-storage-name"
                placeholder="e.g., Cold Storage 3 or Freezer Unit A"
                value={coldStorageFormData.name}
                onChange={(e) =>
                  setColdStorageFormData({ ...coldStorageFormData, name: e.target.value })
                }
              />
              {coldStorageFormErrors.name && (
                <p className="text-sm text-red-500">{coldStorageFormErrors.name}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Enter a descriptive name for the cold storage unit
              </p>
            </div>
            <div className="rounded-lg bg-muted p-3 text-sm">
              <p className="font-medium mb-1">Examples:</p>
              <ul className="text-muted-foreground text-xs space-y-1">
                <li>• Cold Storage 3</li>
                <li>• Freezer Unit A</li>
                <li>• Vaccine Storage</li>
                <li>• Temperature Controlled Zone 1</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddColdStorageDialogOpen(false);
                resetColdStorageForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleAddColdStorage}>Add Cold Storage</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
