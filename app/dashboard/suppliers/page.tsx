"use client";

import type React from "react";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Search,
  Plus,
  Edit,
  Star,
  AlertCircle,
  Package,
  DollarSign,
  Eye,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  paymentTerms: string;
  category: string;
  status: "active" | "inactive" | "flagged";
  performanceScore: number;
  onTimeDeliveryRate: number;
  qualityRating: number;
  totalOrders: number;
  totalSpent: number;
  averageDeliveryTime: number;
  lastOrderDate: string;
  notes: string;
  registeredDate: string;
}

interface PurchaseHistory {
  poId: string;
  date: string;
  items: string[];
  amount: number;
  deliveryStatus: "on-time" | "late" | "early";
  qualityRating: number;
}

const mockSuppliers: Supplier[] = [
  {
    id: "SUP-001",
    name: "MediSupply Ltd",
    contactPerson: "John Anderson",
    email: "john@medisupply.com",
    phone: "+1-555-0101",
    address: "123 Medical Plaza, Healthcare City, HC 12345",
    paymentTerms: "Net 30",
    category: "Pharmaceuticals",
    status: "active",
    performanceScore: 95,
    onTimeDeliveryRate: 98,
    qualityRating: 4.8,
    totalOrders: 156,
    totalSpent: 485000,
    averageDeliveryTime: 3.2,
    lastOrderDate: "2025-01-08",
    notes: "Reliable supplier, excellent quality control",
    registeredDate: "2023-01-15",
  },
  {
    id: "SUP-002",
    name: "PharmaCorp",
    contactPerson: "Sarah Mitchell",
    email: "s.mitchell@pharmacorp.com",
    phone: "+1-555-0102",
    address: "456 Pharma Street, Medicine Town, MT 54321",
    paymentTerms: "Net 45",
    category: "Pharmaceuticals",
    status: "active",
    performanceScore: 88,
    onTimeDeliveryRate: 92,
    qualityRating: 4.4,
    totalOrders: 98,
    totalSpent: 298000,
    averageDeliveryTime: 4.5,
    lastOrderDate: "2025-01-07",
    notes: "Good pricing, occasional delays",
    registeredDate: "2023-03-22",
  },
  {
    id: "SUP-003",
    name: "HealthCare Supplies",
    contactPerson: "Michael Chen",
    email: "mchen@hcsupplies.com",
    phone: "+1-555-0103",
    address: "789 Supply Avenue, Health District, HD 67890",
    paymentTerms: "Net 30",
    category: "Medical Equipment",
    status: "active",
    performanceScore: 92,
    onTimeDeliveryRate: 95,
    qualityRating: 4.6,
    totalOrders: 127,
    totalSpent: 356000,
    averageDeliveryTime: 3.8,
    lastOrderDate: "2025-01-06",
    notes: "Excellent customer service",
    registeredDate: "2023-02-10",
  },
  {
    id: "SUP-004",
    name: "Global Pharma",
    contactPerson: "Emma Williams",
    email: "ewilliams@globalpharma.com",
    phone: "+1-555-0104",
    address: "321 Global Way, International City, IC 13579",
    paymentTerms: "Net 60",
    category: "Pharmaceuticals",
    status: "flagged",
    performanceScore: 72,
    onTimeDeliveryRate: 78,
    qualityRating: 3.8,
    totalOrders: 45,
    totalSpent: 125000,
    averageDeliveryTime: 6.2,
    lastOrderDate: "2024-12-20",
    notes: "Frequent quality issues, multiple late deliveries. Under review.",
    registeredDate: "2024-06-05",
  },
];

const mockPurchaseHistory: Record<string, PurchaseHistory[]> = {
  "SUP-001": [
    {
      poId: "PO-001",
      date: "2025-01-08",
      items: ["Paracetamol 500mg", "Aspirin 100mg"],
      amount: 3200,
      deliveryStatus: "on-time",
      qualityRating: 5,
    },
    {
      poId: "PO-004",
      date: "2025-01-05",
      items: ["Metformin 500mg", "Atorvastatin 20mg"],
      amount: 5400,
      deliveryStatus: "early",
      qualityRating: 5,
    },
  ],
  "SUP-002": [
    {
      poId: "PO-002",
      date: "2025-01-07",
      items: ["Amoxicillin 250mg"],
      amount: 2250,
      deliveryStatus: "late",
      qualityRating: 4,
    },
  ],
  "SUP-003": [
    {
      poId: "PO-003",
      date: "2025-01-06",
      items: ["Ibuprofen 400mg"],
      amount: 2100,
      deliveryStatus: "on-time",
      qualityRating: 4,
    },
  ],
  "SUP-004": [],
};

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState(mockSuppliers);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive" | "flagged"
  >("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null
  );
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<Partial<Supplier>>({
    name: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    paymentTerms: "Net 30",
    category: "Pharmaceuticals",
    notes: "",
  });

  const resetForm = () => {
    setFormData({
      name: "",
      contactPerson: "",
      email: "",
      phone: "",
      address: "",
      paymentTerms: "Net 30",
      category: "Pharmaceuticals",
      notes: "",
    });
    setEditMode(false);
  };

  const handleAddSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    const newSupplier: Supplier = {
      id: `SUP-${String(suppliers.length + 1).padStart(3, "0")}`,
      name: formData.name!,
      contactPerson: formData.contactPerson!,
      email: formData.email!,
      phone: formData.phone!,
      address: formData.address!,
      paymentTerms: formData.paymentTerms!,
      category: formData.category!,
      status: "active",
      performanceScore: 0,
      onTimeDeliveryRate: 0,
      qualityRating: 0,
      totalOrders: 0,
      totalSpent: 0,
      averageDeliveryTime: 0,
      lastOrderDate: "-",
      notes: formData.notes || "",
      registeredDate: new Date().toISOString().split("T")[0],
    };
    setSuppliers([newSupplier, ...suppliers]);
    setShowAddForm(false);
    resetForm();
  };

  const handleEditSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSupplier) return;

    setSuppliers(
      suppliers.map((s) =>
        s.id === selectedSupplier.id
          ? {
              ...s,
              name: formData.name!,
              contactPerson: formData.contactPerson!,
              email: formData.email!,
              phone: formData.phone!,
              address: formData.address!,
              paymentTerms: formData.paymentTerms!,
              category: formData.category!,
              notes: formData.notes!,
            }
          : s
      )
    );
    setEditMode(false);
    resetForm();
  };

  const startEdit = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setFormData({
      name: supplier.name,
      contactPerson: supplier.contactPerson,
      email: supplier.email,
      phone: supplier.phone,
      address: supplier.address,
      paymentTerms: supplier.paymentTerms,
      category: supplier.category,
      notes: supplier.notes,
    });
    setEditMode(true);
  };

  const toggleSupplierStatus = (
    supplierId: string,
    newStatus: "active" | "inactive" | "flagged"
  ) => {
    setSuppliers(
      suppliers.map((s) =>
        s.id === supplierId ? { ...s, status: newStatus } : s
      )
    );
  };

  const filteredSuppliers = suppliers.filter((supplier) => {
    const matchesSearch =
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || supplier.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 75) return "text-yellow-600";
    return "text-red-600";
  };

  const getStatusBadge = (status: "active" | "inactive" | "flagged") => {
    const variants = {
      active: { variant: "default" as const, className: "bg-green-500" },
      inactive: { variant: "secondary" as const, className: "bg-gray-500" },
      flagged: { variant: "destructive" as const, className: "bg-red-500" },
    };
    return variants[status];
  };

  const getDeliveryStatusBadge = (status: "on-time" | "late" | "early") => {
    const variants = {
      "on-time": { variant: "default" as const, className: "bg-green-500" },
      late: { variant: "destructive" as const, className: "bg-red-500" },
      early: { variant: "default" as const, className: "bg-blue-500" },
    };
    return variants[status];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6">
      {/* Header section */}
      <div className="max-w-7xl mx-auto space-y-6 mb-6">
        {" "}
        {/* Added mb-6 */}
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-600 to-slate-700 dark:from-white dark:to-slate-300">
            Supplier Management
          </h3>
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Supplier
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="max-w-7xl mx-auto mb-6">
        {" "}
        {/* Added mb-6 */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Suppliers
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{suppliers.length}</div>
              <p className="text-xs text-muted-foreground">
                {suppliers.filter((s) => s.status === "active").length} active
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                LKR{" "}
                {(
                  suppliers.reduce((sum, s) => sum + s.totalSpent, 0) / 1000
                ).toFixed(0)}
                K
              </div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Flagged Suppliers
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {suppliers.filter((s) => s.status === "flagged").length}
              </div>
              <p className="text-xs text-muted-foreground">
                Requires attention
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Supplier Table */}
      <div className="max-w-7xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <CardTitle>All Suppliers</CardTitle>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search suppliers..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select
                  value={statusFilter}
                  onValueChange={(value: any) => setStatusFilter(value)}
                >
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="flagged">Flagged</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Supplier ID
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Name
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Contact
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Category
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Total Orders
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Last Order
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
                  {filteredSuppliers.map((supplier) => (
                    <tr
                      key={supplier.id}
                      className="border-b border-border last:border-0"
                    >
                      <td className="py-3 px-4 text-sm font-medium text-foreground">
                        {supplier.id}
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {supplier.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {supplier.contactPerson}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-sm text-foreground">
                            {supplier.email}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {supplier.phone}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-foreground">
                        {supplier.category}
                      </td>
                      <td className="py-3 px-4 text-sm font-medium text-foreground">
                        {supplier.totalOrders}
                      </td>
                      <td className="py-3 px-4 text-sm text-foreground">
                        {supplier.lastOrderDate}
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={getStatusBadge(supplier.status).variant}
                          className={getStatusBadge(supplier.status).className}
                        >
                          {supplier.status.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-1">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedSupplier(supplier)}
                                title="View Details"
                                aria-label={`View details for ${supplier.name}`}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>
                                  Supplier Details - {supplier.name}
                                </DialogTitle>
                                <DialogDescription>
                                  Complete supplier information and performance
                                  history
                                </DialogDescription>
                              </DialogHeader>
                              {selectedSupplier && (
                                <Tabs defaultValue="info" className="space-y-4">
                                  <TabsList>
                                    <TabsTrigger value="info">
                                      Information
                                    </TabsTrigger>
                                    <TabsTrigger value="performance">
                                      Performance
                                    </TabsTrigger>
                                    <TabsTrigger value="history">
                                      Purchase History
                                    </TabsTrigger>
                                  </TabsList>

                                  <TabsContent
                                    value="info"
                                    className="space-y-4"
                                  >
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label className="text-muted-foreground">
                                          Supplier ID
                                        </Label>
                                        <p className="font-medium">
                                          {selectedSupplier.id}
                                        </p>
                                      </div>
                                      <div>
                                        <Label className="text-muted-foreground">
                                          Status
                                        </Label>
                                        <div className="mt-1">
                                          <Badge
                                            variant={
                                              getStatusBadge(
                                                selectedSupplier.status
                                              ).variant
                                            }
                                            className={
                                              getStatusBadge(
                                                selectedSupplier.status
                                              ).className
                                            }
                                          >
                                            {selectedSupplier.status.toUpperCase()}
                                          </Badge>
                                        </div>
                                      </div>
                                      <div>
                                        <Label className="text-muted-foreground">
                                          Company Name
                                        </Label>
                                        <p className="font-medium">
                                          {selectedSupplier.name}
                                        </p>
                                      </div>
                                      <div>
                                        <Label className="text-muted-foreground">
                                          Contact Person
                                        </Label>
                                        <p className="font-medium">
                                          {selectedSupplier.contactPerson}
                                        </p>
                                      </div>
                                      <div>
                                        <Label className="text-muted-foreground">
                                          Email
                                        </Label>
                                        <p className="font-medium">
                                          {selectedSupplier.email}
                                        </p>
                                      </div>
                                      <div>
                                        <Label className="text-muted-foreground">
                                          Phone
                                        </Label>
                                        <p className="font-medium">
                                          {selectedSupplier.phone}
                                        </p>
                                      </div>
                                      <div className="col-span-2">
                                        <Label className="text-muted-foreground">
                                          Address
                                        </Label>
                                        <p className="font-medium">
                                          {selectedSupplier.address}
                                        </p>
                                      </div>
                                      <div>
                                        <Label className="text-muted-foreground">
                                          Category
                                        </Label>
                                        <p className="font-medium">
                                          {selectedSupplier.category}
                                        </p>
                                      </div>
                                      <div>
                                        <Label className="text-muted-foreground">
                                          Payment Terms
                                        </Label>
                                        <p className="font-medium">
                                          {selectedSupplier.paymentTerms}
                                        </p>
                                      </div>
                                      <div>
                                        <Label className="text-muted-foreground">
                                          Registered Since
                                        </Label>
                                        <p className="font-medium">
                                          {selectedSupplier.registeredDate}
                                        </p>
                                      </div>
                                    </div>

                                    {selectedSupplier.notes && (
                                      <div>
                                        <Label className="text-muted-foreground">
                                          Notes
                                        </Label>
                                        <p className="mt-1 text-sm">
                                          {selectedSupplier.notes}
                                        </p>
                                      </div>
                                    )}

                                    <div className="flex gap-2 pt-4 border-t">
                                      <Button
                                        size="sm"
                                        onClick={() =>
                                          startEdit(selectedSupplier)
                                        }
                                      >
                                        <Edit className="h-4 w-4 mr-2" />
                                        Edit Details
                                      </Button>
                                      {selectedSupplier.status === "active" && (
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() =>
                                            toggleSupplierStatus(
                                              selectedSupplier.id,
                                              "flagged"
                                            )
                                          }
                                        >
                                          <AlertCircle className="h-4 w-4 mr-2" />
                                          Flag Supplier
                                        </Button>
                                      )}
                                      {selectedSupplier.status ===
                                        "flagged" && (
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() =>
                                            toggleSupplierStatus(
                                              selectedSupplier.id,
                                              "active"
                                            )
                                          }
                                        >
                                          Remove Flag
                                        </Button>
                                      )}
                                    </div>
                                  </TabsContent>

                                  <TabsContent
                                    value="performance"
                                    className="space-y-4"
                                  >
                                    <div className="grid gap-4 md:grid-cols-2">
                                      <Card>
                                        <CardHeader>
                                          <CardTitle className="text-sm">
                                            Overall Performance Score
                                          </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                          <div
                                            className={`text-3xl font-bold ${getPerformanceColor(
                                              selectedSupplier.performanceScore
                                            )}`}
                                          >
                                            {selectedSupplier.performanceScore}%
                                          </div>
                                        </CardContent>
                                      </Card>
                                      <Card>
                                        <CardHeader>
                                          <CardTitle className="text-sm">
                                            On-Time Delivery Rate
                                          </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                          <div className="text-3xl font-bold">
                                            {
                                              selectedSupplier.onTimeDeliveryRate
                                            }
                                            %
                                          </div>
                                        </CardContent>
                                      </Card>
                                      <Card>
                                        <CardHeader>
                                          <CardTitle className="text-sm">
                                            Quality Rating
                                          </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                          <div className="flex items-center gap-2">
                                            <span className="text-3xl font-bold">
                                              {selectedSupplier.qualityRating}
                                            </span>
                                            <div className="flex">
                                              {[...Array(5)].map((_, i) => (
                                                <Star
                                                  key={i}
                                                  className={`h-5 w-5 ${
                                                    i <
                                                    Math.round(
                                                      selectedSupplier.qualityRating
                                                    )
                                                      ? "fill-yellow-400 text-yellow-400"
                                                      : "text-gray-300"
                                                  }`}
                                                />
                                              ))}
                                            </div>
                                          </div>
                                        </CardContent>
                                      </Card>
                                      <Card>
                                        <CardHeader>
                                          <CardTitle className="text-sm">
                                            Avg Delivery Time
                                          </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                          <div className="text-3xl font-bold">
                                            {
                                              selectedSupplier.averageDeliveryTime
                                            }
                                            <span className="text-lg text-muted-foreground ml-1">
                                              days
                                            </span>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-2">
                                      <div className="border rounded-lg p-4">
                                        <Label className="text-muted-foreground">
                                          Total Orders
                                        </Label>
                                        <p className="text-2xl font-bold mt-1">
                                          {selectedSupplier.totalOrders}
                                        </p>
                                      </div>
                                      <div className="border rounded-lg p-4">
                                        <Label className="text-muted-foreground">
                                          Total Spent
                                        </Label>
                                        <p className="text-2xl font-bold mt-1">
                                          LKR{" "}
                                          {selectedSupplier.totalSpent.toLocaleString()}
                                        </p>
                                      </div>
                                    </div>
                                  </TabsContent>

                                  <TabsContent
                                    value="history"
                                    className="space-y-4"
                                  >
                                    <div>
                                      <Label className="text-muted-foreground">
                                        Recent Purchase Orders
                                      </Label>
                                      {mockPurchaseHistory[selectedSupplier.id]
                                        ?.length > 0 ? (
                                        <div className="mt-2 border rounded-lg overflow-hidden">
                                          <table className="w-full">
                                            <thead className="bg-muted">
                                              <tr>
                                                <th className="text-left py-2 px-3 text-sm font-medium">
                                                  PO ID
                                                </th>
                                                <th className="text-left py-2 px-3 text-sm font-medium">
                                                  Date
                                                </th>
                                                <th className="text-left py-2 px-3 text-sm font-medium">
                                                  Items
                                                </th>
                                                <th className="text-right py-2 px-3 text-sm font-medium">
                                                  Amount (LKR)
                                                </th>
                                                <th className="text-left py-2 px-3 text-sm font-medium">
                                                  Delivery
                                                </th>
                                                <th className="text-left py-2 px-3 text-sm font-medium">
                                                  Quality
                                                </th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              {mockPurchaseHistory[
                                                selectedSupplier.id
                                              ].map((history, idx) => (
                                                <tr
                                                  key={idx}
                                                  className="border-t"
                                                >
                                                  <td className="py-2 px-3 text-sm font-medium">
                                                    {history.poId}
                                                  </td>
                                                  <td className="py-2 px-3 text-sm">
                                                    {history.date}
                                                  </td>
                                                  <td className="py-2 px-3 text-sm">
                                                    {history.items.join(", ")}
                                                  </td>
                                                  <td className="py-2 px-3 text-sm text-right">
                                                    LKR{" "}
                                                    {history.amount.toLocaleString()}
                                                  </td>
                                                  <td className="py-2 px-3">
                                                    <Badge
                                                      variant={
                                                        getDeliveryStatusBadge(
                                                          history.deliveryStatus
                                                        ).variant
                                                      }
                                                      className={
                                                        getDeliveryStatusBadge(
                                                          history.deliveryStatus
                                                        ).className
                                                      }
                                                    >
                                                      {history.deliveryStatus}
                                                    </Badge>
                                                  </td>
                                                  <td className="py-2 px-3">
                                                    <div className="flex">
                                                      {[...Array(5)].map(
                                                        (_, i) => (
                                                          <Star
                                                            key={i}
                                                            className={`h-3 w-3 ${
                                                              i <
                                                              history.qualityRating
                                                                ? "fill-yellow-400 text-yellow-400"
                                                                : "text-gray-300"
                                                            }`}
                                                          />
                                                        )
                                                      )}
                                                    </div>
                                                  </td>
                                                </tr>
                                              ))}
                                            </tbody>
                                          </table>
                                        </div>
                                      ) : (
                                        <p className="text-sm text-muted-foreground mt-2">
                                          No purchase history available
                                        </p>
                                      )}
                                    </div>
                                  </TabsContent>
                                </Tabs>
                              )}
                            </DialogContent>
                          </Dialog>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => startEdit(supplier)}
                            title="Edit"
                            aria-label={`Edit ${supplier.name}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Supplier Dialog */}
      <Dialog
        open={showAddForm || editMode}
        onOpenChange={(open) => !open && (setShowAddForm(false), resetForm())}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editMode ? "Edit Supplier" : "Add New Supplier"}
            </DialogTitle>
            <DialogDescription>
              {editMode
                ? "Update supplier information"
                : "Enter supplier details to add to database"}
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={editMode ? handleEditSupplier : handleAddSupplier}
            className="space-y-4"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Company Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter company name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPerson">Contact Person *</Label>
                <Input
                  id="contactPerson"
                  placeholder="Enter contact name"
                  value={formData.contactPerson}
                  onChange={(e) =>
                    setFormData({ ...formData, contactPerson: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  placeholder="+1-555-0000"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  placeholder="Full address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger id="category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pharmaceuticals">
                      Pharmaceuticals
                    </SelectItem>
                    <SelectItem value="Medical Equipment">
                      Medical Equipment
                    </SelectItem>
                    <SelectItem value="Surgical Supplies">
                      Surgical Supplies
                    </SelectItem>
                    <SelectItem value="Lab Equipment">Lab Equipment</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentTerms">Payment Terms *</Label>
                <Select
                  value={formData.paymentTerms}
                  onValueChange={(value) =>
                    setFormData({ ...formData, paymentTerms: value })
                  }
                >
                  <SelectTrigger id="paymentTerms">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Net 15">Net 15 Days</SelectItem>
                    <SelectItem value="Net 30">Net 30 Days</SelectItem>
                    <SelectItem value="Net 45">Net 45 Days</SelectItem>
                    <SelectItem value="Net 60">Net 60 Days</SelectItem>
                    <SelectItem value="Due on Receipt">
                      Due on Receipt
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Any additional notes about this supplier..."
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                rows={3}
              />
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <Button type="submit">
                {editMode ? "Update Supplier" : "Add Supplier"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowAddForm(false);
                  setEditMode(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
