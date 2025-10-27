"use client";

import type React from "react";

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Search, Plus, Printer, Mail, Eye, Edit, Send, CheckCircle, XCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type POStatus = "draft" | "sent" | "delivered" | "closed"
type RequestStatus = "pending" | "approved" | "declined"

interface PurchaseOrder {
  id: string;
  supplier: string;
  supplierId: string;
  items: Array<{
    name: string;
    quantity: number;
    unitPrice: number;
  }>;
  totalAmount: number;
  status: POStatus;
  createdDate: string;
  expectedDeliveryDate: string;
  paymentTerms: string;
  notes: string;
  supplierPerformance: number;
}

interface PurchaseRequest {
  id: string
  requestedBy: string
  department: string
  items: Array<{
    name: string
    quantity: number
    estimatedUnitPrice: number
  }>
  totalEstimate: number
  status: RequestStatus
  requestDate: string
  requiredBy: string
  priority: "low" | "medium" | "high" | "urgent"
  justification: string
}

const mockSuppliers = [
  { id: "SUP-001", name: "MediSupply Ltd", performance: 95, deliveryRate: 98 },
  { id: "SUP-002", name: "PharmaCorp", performance: 88, deliveryRate: 92 },
  {
    id: "SUP-003",
    name: "HealthCare Supplies",
    performance: 92,
    deliveryRate: 95,
  },
  { id: "SUP-004", name: "Global Pharma", performance: 85, deliveryRate: 88 },
];

const mockOrders: PurchaseOrder[] = [
  {
    id: "PO-001",
    supplier: "MediSupply Ltd",
    supplierId: "SUP-001",
    items: [
      { name: "Paracetamol 500mg", quantity: 1000, unitPrice: 0.15 },
      { name: "Aspirin 100mg", quantity: 500, unitPrice: 0.12 },
    ],
    totalAmount: 210,
    status: "sent",
    createdDate: "2025-01-08",
    expectedDeliveryDate: "2025-01-15",
    paymentTerms: "Net 30",
    notes: "Urgent delivery required",
    supplierPerformance: 95,
  },
  {
    id: "PO-002",
    supplier: "PharmaCorp",
    supplierId: "SUP-002",
    items: [{ name: "Amoxicillin 250mg", quantity: 500, unitPrice: 0.45 }],
    totalAmount: 225,
    status: "draft",
    createdDate: "2025-01-07",
    expectedDeliveryDate: "2025-01-20",
    paymentTerms: "Net 45",
    notes: "",
    supplierPerformance: 88,
  },
  {
    id: "PO-003",
    supplier: "HealthCare Supplies",
    supplierId: "SUP-003",
    items: [{ name: "Ibuprofen 400mg", quantity: 750, unitPrice: 0.28 }],
    totalAmount: 210,
    status: "delivered",
    createdDate: "2025-01-06",
    expectedDeliveryDate: "2025-01-12",
    paymentTerms: "Net 30",
    notes: "",
    supplierPerformance: 92,
  },
  {
    id: "PO-004",
    supplier: "MediSupply Ltd",
    supplierId: "SUP-001",
    items: [
      { name: "Metformin 500mg", quantity: 1500, unitPrice: 0.22 },
      { name: "Atorvastatin 20mg", quantity: 800, unitPrice: 0.55 },
    ],
    totalAmount: 770,
    status: "closed",
    createdDate: "2025-01-05",
    expectedDeliveryDate: "2025-01-10",
    paymentTerms: "Net 30",
    notes: "Quality verified and stock updated",
    supplierPerformance: 95,
  },
];

const mockRequests: PurchaseRequest[] = [
  {
    id: "PR-001",
    requestedBy: "Dr. Sarah Johnson",
    department: "Emergency Department",
    items: [
      { name: "Paracetamol 500mg", quantity: 2000, estimatedUnitPrice: 0.15 },
      { name: "Ibuprofen 400mg", quantity: 1500, estimatedUnitPrice: 0.28 },
    ],
    totalEstimate: 720,
    status: "pending",
    requestDate: "2025-10-25",
    requiredBy: "2025-11-05",
    priority: "urgent",
    justification: "Current stock running critically low. Need immediate replenishment for patient care.",
  },
  {
    id: "PR-002",
    requestedBy: "Dr. Michael Chen",
    department: "Cardiology",
    items: [
      { name: "Atorvastatin 20mg", quantity: 1000, estimatedUnitPrice: 0.55 },
      { name: "Metoprolol 50mg", quantity: 800, estimatedUnitPrice: 0.32 },
    ],
    totalEstimate: 806,
    status: "pending",
    requestDate: "2025-10-24",
    requiredBy: "2025-11-10",
    priority: "high",
    justification: "Regular stock replenishment for chronic disease management program.",
  },
  {
    id: "PR-003",
    requestedBy: "Nurse Emma Williams",
    department: "General Ward",
    items: [
      { name: "Bandages (5cm x 5m)", quantity: 500, estimatedUnitPrice: 1.2 },
      { name: "Gauze Pads", quantity: 1000, estimatedUnitPrice: 0.5 },
    ],
    totalEstimate: 1100,
    status: "pending",
    requestDate: "2025-10-23",
    requiredBy: "2025-11-15",
    priority: "medium",
    justification: "Routine supplies for wound care and dressing changes.",
  },
  {
    id: "PR-004",
    requestedBy: "Dr. James Wilson",
    department: "Pediatrics",
    items: [
      { name: "Amoxicillin Suspension 250mg/5ml", quantity: 200, estimatedUnitPrice: 3.5 },
    ],
    totalEstimate: 700,
    status: "approved",
    requestDate: "2025-10-20",
    requiredBy: "2025-11-01",
    priority: "high",
    justification: "Increased cases of bacterial infections in pediatric patients.",
  },
  {
    id: "PR-005",
    requestedBy: "Dr. Lisa Anderson",
    department: "Surgery",
    items: [
      { name: "Surgical Gloves (Size M)", quantity: 5000, estimatedUnitPrice: 0.25 },
    ],
    totalEstimate: 1250,
    status: "declined",
    requestDate: "2025-10-18",
    requiredBy: "2025-10-30",
    priority: "low",
    justification: "Stock replenishment.",
  },
]

export default function PurchaseOrdersPage() {
  const searchParams = useSearchParams()
  const [orders, setOrders] = useState(mockOrders)
  const [requests, setRequests] = useState(mockRequests)
  const [searchTerm, setSearchTerm] = useState("")
  const [requestSearchTerm, setRequestSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null)
  const [selectedRequest, setSelectedRequest] = useState<PurchaseRequest | null>(null)
  const [statusFilter, setStatusFilter] = useState<POStatus | "all">("all")
  const [requestStatusFilter, setRequestStatusFilter] = useState<RequestStatus | "all">("all")
  const [confirmAction, setConfirmAction] = useState<{
    type: "send" | "deliver" | "close" | null
    orderId: string | null
  }>({ type: null, orderId: null })
  const [confirmRequestAction, setConfirmRequestAction] = useState<{
    type: "approve" | "decline" | null
    requestId: string | null
  }>({ type: null, requestId: null })
  const [newOrder, setNewOrder] = useState({
    supplier: "",
    items: [{ name: "", quantity: "", unitPrice: "" }],
    expectedDeliveryDate: "",
    paymentTerms: "Net 30",
    notes: "",
  });

  // Auto-fill form from stock page query parameters
  useEffect(() => {
    const itemName = searchParams.get("item");
    const currentQuantity = searchParams.get("quantity");
    const reorderLevel = searchParams.get("reorderLevel");
    const itemId = searchParams.get("itemId");

    if (itemName) {
      // Calculate suggested order quantity (difference between reorder level and current stock)
      const suggestedQuantity = reorderLevel && currentQuantity 
        ? Math.max(Number(reorderLevel) - Number(currentQuantity), 0)
        : "";

      setNewOrder({
        supplier: "",
        items: [{ 
          name: itemName, 
          quantity: suggestedQuantity.toString(), 
          unitPrice: "" 
        }],
        expectedDeliveryDate: "",
        paymentTerms: "Net 30",
        notes: itemId 
          ? `Reorder for low stock item (ID: ${itemId}). Current stock: ${currentQuantity}, Reorder level: ${reorderLevel}`
          : "",
      });
      setShowForm(true);
    }
  }, [searchParams]);

  const addItemField = () => {
    setNewOrder({
      ...newOrder,
      items: [...newOrder.items, { name: "", quantity: "", unitPrice: "" }],
    });
  };

  const removeItemField = (index: number) => {
    const items = newOrder.items.filter((_, i) => i !== index);
    setNewOrder({ ...newOrder, items });
  };

  const updateItemField = (index: number, field: string, value: string) => {
    const items = [...newOrder.items];
    items[index] = { ...items[index], [field]: value };
    setNewOrder({ ...newOrder, items });
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const supplier = mockSuppliers.find((s) => s.id === newOrder.supplier);
    if (!supplier) return;

    const items = newOrder.items.map((item) => ({
      name: item.name,
      quantity: Number.parseInt(item.quantity),
      unitPrice: Number.parseFloat(item.unitPrice),
    }));

    const totalAmount = items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    );

    const order: PurchaseOrder = {
      id: `PO-${String(orders.length + 1).padStart(3, "0")}`,
      supplier: supplier.name,
      supplierId: supplier.id,
      items,
      totalAmount,
      status: "draft",
      createdDate: new Date().toISOString().split("T")[0],
      expectedDeliveryDate: newOrder.expectedDeliveryDate,
      paymentTerms: newOrder.paymentTerms,
      notes: newOrder.notes,
      supplierPerformance: supplier.performance,
    };

    setOrders([order, ...orders]);
    setNewOrder({
      supplier: "",
      items: [{ name: "", quantity: "", unitPrice: "" }],
      expectedDeliveryDate: "",
      paymentTerms: "Net 30",
      notes: "",
    });
    setShowForm(false);
  };

  const updateOrderStatus = (orderId: string, newStatus: POStatus) => {
    setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))
    setConfirmAction({ type: null, orderId: null })
  }

  const handleConfirmAction = () => {
    if (confirmAction.orderId && confirmAction.type) {
      switch (confirmAction.type) {
        case "send":
          updateOrderStatus(confirmAction.orderId, "sent")
          break
        case "deliver":
          updateOrderStatus(confirmAction.orderId, "delivered")
          break
        case "close":
          updateOrderStatus(confirmAction.orderId, "closed")
          break
      }
    }
  }

  const handlePrintPO = (order: PurchaseOrder) => {
    alert(
      `Printing PO ${order.id}...\nThis would generate a PDF in production.`
    );
  };

  const handleEmailPO = (order: PurchaseOrder) => {
    alert(
      `Sending PO ${order.id} to ${order.supplier}...\nThis would send an email in production.`
    );
  };

  const handleApproveRequest = (requestId: string) => {
    setRequests(requests.map((req) => (req.id === requestId ? { ...req, status: "approved" as RequestStatus } : req)))
    setConfirmRequestAction({ type: null, requestId: null })
  }

  const handleDeclineRequest = (requestId: string) => {
    setRequests(requests.map((req) => (req.id === requestId ? { ...req, status: "declined" as RequestStatus } : req)))
    setConfirmRequestAction({ type: null, requestId: null })
  }

  const handleConfirmRequestAction = () => {
    if (confirmRequestAction.requestId && confirmRequestAction.type) {
      switch (confirmRequestAction.type) {
        case "approve":
          handleApproveRequest(confirmRequestAction.requestId)
          break
        case "decline":
          handleDeclineRequest(confirmRequestAction.requestId)
          break
      }
    }
  }

  const convertRequestToPO = (request: PurchaseRequest) => {
    // In production, this would open the PO form with pre-filled data from the request
    alert(`Converting ${request.id} to Purchase Order...\nThis would pre-fill the PO form in production.`)
    setShowForm(true)
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.id.toLowerCase().includes(requestSearchTerm.toLowerCase()) ||
      request.requestedBy.toLowerCase().includes(requestSearchTerm.toLowerCase()) ||
      request.department.toLowerCase().includes(requestSearchTerm.toLowerCase()) ||
      request.items.some((item) => item.name.toLowerCase().includes(requestSearchTerm.toLowerCase()))

    const matchesStatus = requestStatusFilter === "all" || request.status === requestStatusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: POStatus) => {
    const variants: Record<POStatus, { variant: any; className: string }> = {
      draft: { variant: "secondary", className: "bg-gray-500" },
      sent: { variant: "default", className: "bg-blue-500" },
      delivered: { variant: "default", className: "bg-green-500" },
      closed: { variant: "outline", className: "" },
    };
    return variants[status];
  };

  const getRequestStatusBadge = (status: RequestStatus) => {
    const variants: Record<RequestStatus, { variant: any; className: string }> = {
      pending: { variant: "secondary", className: "bg-yellow-500" },
      approved: { variant: "default", className: "bg-green-500" },
      declined: { variant: "destructive", className: "bg-red-500" },
    }
    return variants[status]
  }

  const getPriorityBadge = (priority: "low" | "medium" | "high" | "urgent") => {
    const variants = {
      low: { variant: "outline" as const, className: "border-gray-400 text-gray-400" },
      medium: { variant: "secondary" as const, className: "bg-blue-500" },
      high: { variant: "default" as const, className: "bg-orange-500" },
      urgent: { variant: "destructive" as const, className: "bg-red-600" },
    }
    return variants[priority]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6 flex items-center justify-between">
        <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-600 to-slate-700 dark:from-white dark:to-slate-300">
          Purchase Orders
        </h3>

        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          New Purchase Order
        </Button>
      </div>

      <Tabs defaultValue="requests" className="space-y-6">
        <TabsList>
          <TabsTrigger value="requests">
            Purchase Requests
            {requests.filter((r) => r.status === "pending").length > 0 && (
              <Badge className="ml-2 bg-yellow-500">{requests.filter((r) => r.status === "pending").length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="orders">Purchase Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <CardTitle>Purchase Requests</CardTitle>
                  <CardDescription>Review and approve purchase requests from departments</CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search requests..."
                      className="pl-8"
                      value={requestSearchTerm}
                      onChange={(e) => setRequestSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={requestStatusFilter} onValueChange={(value: any) => setRequestStatusFilter(value)}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="declined">Declined</SelectItem>
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
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Request ID</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Requested By</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Department</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Items</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Est. Amount (LKR)</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Required By</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Priority</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRequests.map((request) => (
                      <tr key={request.id} className="border-b border-border last:border-0">
                        <td className="py-3 px-4 text-sm font-medium text-foreground">{request.id}</td>
                        <td className="py-3 px-4 text-sm text-foreground">{request.requestedBy}</td>
                        <td className="py-3 px-4 text-sm text-foreground">{request.department}</td>
                        <td className="py-3 px-4 text-sm text-foreground">{request.items.length} item(s)</td>
                        <td className="py-3 px-4 text-sm text-foreground">LKR {request.totalEstimate.toFixed(2)}</td>
                        <td className="py-3 px-4 text-sm text-foreground">{request.requiredBy}</td>
                        <td className="py-3 px-4">
                          <Badge
                            variant={getPriorityBadge(request.priority).variant}
                            className={getPriorityBadge(request.priority).className}
                          >
                            {request.priority.toUpperCase()}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Badge
                            variant={getRequestStatusBadge(request.status).variant}
                            className={getRequestStatusBadge(request.status).className}
                          >
                            {request.status.toUpperCase()}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-1">
                            <Dialog>
                              <DialogTrigger asChild>
                                  <Button size="sm" variant="outline" onClick={() => setSelectedRequest(request)} title="View Request" aria-label={`View request ${request.id}`}>
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Purchase Request Details - {request.id}</DialogTitle>
                                  <DialogDescription>Complete purchase request information</DialogDescription>
                                </DialogHeader>
                                {selectedRequest && (
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label className="text-muted-foreground">Requested By</Label>
                                        <p className="font-medium">{selectedRequest.requestedBy}</p>
                                      </div>
                                      <div>
                                        <Label className="text-muted-foreground">Department</Label>
                                        <p className="font-medium">{selectedRequest.department}</p>
                                      </div>
                                      <div>
                                        <Label className="text-muted-foreground">Status</Label>
                                        <div className="mt-1">
                                          <Badge
                                            variant={getRequestStatusBadge(selectedRequest.status).variant}
                                            className={getRequestStatusBadge(selectedRequest.status).className}
                                          >
                                            {selectedRequest.status.toUpperCase()}
                                          </Badge>
                                        </div>
                                      </div>
                                      <div>
                                        <Label className="text-muted-foreground">Priority</Label>
                                        <div className="mt-1">
                                          <Badge
                                            variant={getPriorityBadge(selectedRequest.priority).variant}
                                            className={getPriorityBadge(selectedRequest.priority).className}
                                          >
                                            {selectedRequest.priority.toUpperCase()}
                                          </Badge>
                                        </div>
                                      </div>
                                      <div>
                                        <Label className="text-muted-foreground">Request Date</Label>
                                        <p className="font-medium">{selectedRequest.requestDate}</p>
                                      </div>
                                      <div>
                                        <Label className="text-muted-foreground">Required By</Label>
                                        <p className="font-medium">{selectedRequest.requiredBy}</p>
                                      </div>
                                      <div>
                                        <Label className="text-muted-foreground">Estimated Total</Label>
                                        <p className="font-medium text-lg">LKR {selectedRequest.totalEstimate.toFixed(2)}</p>
                                      </div>
                                    </div>

                                    <div>
                                      <Label className="text-muted-foreground">Requested Items</Label>
                                      <div className="mt-2 border rounded-lg overflow-hidden">
                                        <table className="w-full">
                                          <thead className="bg-muted">
                                            <tr>
                                              <th className="text-left py-2 px-3 text-sm font-medium">Item Name</th>
                                              <th className="text-right py-2 px-3 text-sm font-medium">Quantity</th>
                                              <th className="text-right py-2 px-3 text-sm font-medium">Est. Unit Price</th>
                                              <th className="text-right py-2 px-3 text-sm font-medium">Est. Total</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {selectedRequest.items.map((item, idx) => (
                                              <tr key={idx} className="border-t">
                                                <td className="py-2 px-3 text-sm">{item.name}</td>
                                                <td className="py-2 px-3 text-sm text-right">{item.quantity}</td>
                                                <td className="py-2 px-3 text-sm text-right">
                                                  LKR {item.estimatedUnitPrice.toFixed(2)}
                                                </td>
                                                <td className="py-2 px-3 text-sm text-right font-medium">
                                                  LKR {(item.quantity * item.estimatedUnitPrice).toFixed(2)}
                                                </td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>

                                    <div>
                                      <Label className="text-muted-foreground">Justification</Label>
                                      <p className="mt-1 text-sm">{selectedRequest.justification}</p>
                                    </div>

                                    <div className="flex gap-2 pt-4 border-t">
                                      {selectedRequest.status === "pending" && (
                                        <>
                                          <Button
                                            size="sm"
                                            onClick={() =>
                                              setConfirmRequestAction({ type: "approve", requestId: selectedRequest.id })
                                            }
                                          >
                                            <CheckCircle className="h-4 w-4 mr-2" />
                                            Approve Request
                                          </Button>
                                          <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() =>
                                              setConfirmRequestAction({ type: "decline", requestId: selectedRequest.id })
                                            }
                                          >
                                            <XCircle className="h-4 w-4 mr-2" />
                                            Decline Request
                                          </Button>
                                        </>
                                      )}
                                      {selectedRequest.status === "approved" && (
                                        <Button size="sm" onClick={() => convertRequestToPO(selectedRequest)}>
                                          <Plus className="h-4 w-4 mr-2" />
                                          Convert to Purchase Order
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>

                            {request.status === "pending" && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => setConfirmRequestAction({ type: "approve", requestId: request.id })}
                                  title="Approve"
                                  aria-label={`Approve request ${request.id}`}
                                >
                                  <CheckCircle className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => setConfirmRequestAction({ type: "decline", requestId: request.id })}
                                  title="Decline"
                                  aria-label={`Decline request ${request.id}`}
                                >
                                  <XCircle className="h-3 w-3" />
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Purchase Order</CardTitle>
            <CardDescription>
              Fill in the details to generate a new PO
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitOrder} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="supplier">Supplier *</Label>
                  <Select
                    value={newOrder.supplier}
                    onValueChange={(value) =>
                      setNewOrder({ ...newOrder, supplier: value })
                    }
                  >
                    <SelectTrigger id="supplier">
                      <SelectValue placeholder="Select supplier (sorted by performance)" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockSuppliers
                        .sort((a, b) => b.performance - a.performance)
                        .map((supplier) => (
                          <SelectItem key={supplier.id} value={supplier.id}>
                            {supplier.name} (Performance: {supplier.performance}
                            %)
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deliveryDate">Expected Delivery Date *</Label>
                  <Input
                    id="deliveryDate"
                    type="date"
                    value={newOrder.expectedDeliveryDate}
                    onChange={(e) =>
                      setNewOrder({
                        ...newOrder,
                        expectedDeliveryDate: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentTerms">Payment Terms *</Label>
                  <Select
                    value={newOrder.paymentTerms}
                    onValueChange={(value) =>
                      setNewOrder({ ...newOrder, paymentTerms: value })
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

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Order Items *</Label>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={addItemField}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Item
                  </Button>
                </div>

                {newOrder.items.map((item, index) => (
                  <div
                    key={index}
                    className="grid gap-3 md:grid-cols-4 p-3 border rounded-lg"
                  >
                    <div className="space-y-1 md:col-span-2">
                      <Input
                        placeholder="Item name"
                        value={item.name}
                        onChange={(e) =>
                          updateItemField(index, "name", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <Input
                        type="number"
                        placeholder="Quantity"
                        value={item.quantity}
                        onChange={(e) =>
                          updateItemField(index, "quantity", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div className="space-y-1 flex gap-2">
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Unit Price (LKR)"
                        value={item.unitPrice}
                        onChange={(e) =>
                          updateItemField(index, "unitPrice", e.target.value)
                        }
                        required
                      />
                      {newOrder.items.length > 1 && (
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          onClick={() => removeItemField(index)}
                          title="Remove item"
                          aria-label={`Remove item ${index + 1}`}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes / Special Instructions</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any special instructions or notes..."
                  value={newOrder.notes}
                  onChange={(e) =>
                    setNewOrder({ ...newOrder, notes: e.target.value })
                  }
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit">Create Purchase Order</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card className="mt-8">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle>All Purchase Orders</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders..."
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
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
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
                    PO ID
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Supplier
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Items
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Total Amount (LKR)
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Delivery Date
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
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-border last:border-0"
                  >
                    <td className="py-3 px-4 text-sm font-medium text-foreground">
                      {order.id}
                    </td>
                    <td className="py-3 px-4 text-sm text-foreground">
                      {order.supplier}
                    </td>
                    <td className="py-3 px-4 text-sm text-foreground">
                      {order.items.length} item(s)
                    </td>
                    <td className="py-3 px-4 text-sm text-foreground">
                      LKR {order.totalAmount.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-sm text-foreground">
                      {order.expectedDeliveryDate}
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={getStatusBadge(order.status).variant}
                        className={getStatusBadge(order.status).className}
                      >
                        {order.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-1">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedOrder(order)}
                              title="View Order"
                              aria-label={`View order ${order.id}`}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>
                                Purchase Order Details - {order.id}
                              </DialogTitle>
                              <DialogDescription>
                                Complete purchase order information
                              </DialogDescription>
                            </DialogHeader>
                            {selectedOrder && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-muted-foreground">
                                      Supplier
                                    </Label>
                                    <p className="font-medium">
                                      {selectedOrder.supplier}
                                    </p>
                                  </div>
                                  <div>
                                    <Label className="text-muted-foreground">
                                      Status
                                    </Label>
                                    <div className="mt-1">
                                      <Badge
                                        variant={
                                          getStatusBadge(selectedOrder.status)
                                            .variant
                                        }
                                        className={
                                          getStatusBadge(selectedOrder.status)
                                            .className
                                        }
                                      >
                                        {selectedOrder.status.toUpperCase()}
                                      </Badge>
                                    </div>
                                  </div>
                                  <div>
                                    <Label className="text-muted-foreground">
                                      Created Date
                                    </Label>
                                    <p className="font-medium">
                                      {selectedOrder.createdDate}
                                    </p>
                                  </div>
                                  <div>
                                    <Label className="text-muted-foreground">
                                      Expected Delivery
                                    </Label>
                                    <p className="font-medium">
                                      {selectedOrder.expectedDeliveryDate}
                                    </p>
                                  </div>
                                  <div>
                                    <Label className="text-muted-foreground">
                                      Payment Terms
                                    </Label>
                                    <p className="font-medium">
                                      {selectedOrder.paymentTerms}
                                    </p>
                                  </div>
                                  <div>
                                    <Label className="text-muted-foreground">
                                      Total Amount
                                    </Label>
                                    <p className="font-medium text-lg">
                                      LKR {selectedOrder.totalAmount.toFixed(2)}
                                    </p>
                                  </div>
                                </div>

                                <div>
                                  <Label className="text-muted-foreground">
                                    Order Items
                                  </Label>
                                  <div className="mt-2 border rounded-lg overflow-hidden">
                                    <table className="w-full">
                                      <thead className="bg-muted">
                                        <tr>
                                          <th className="text-left py-2 px-3 text-sm font-medium">
                                            Item Name
                                          </th>
                                          <th className="text-right py-2 px-3 text-sm font-medium">
                                            Quantity
                                          </th>
                                          <th className="text-right py-2 px-3 text-sm font-medium">
                                            Unit Price
                                          </th>
                                          <th className="text-right py-2 px-3 text-sm font-medium">
                                            Total
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {selectedOrder.items.map(
                                          (item, idx) => (
                                            <tr key={idx} className="border-t">
                                              <td className="py-2 px-3 text-sm">
                                                {item.name}
                                              </td>
                                              <td className="py-2 px-3 text-sm text-right">
                                                {item.quantity}
                                              </td>
                                              <td className="py-2 px-3 text-sm text-right">
                                                LKR {item.unitPrice.toFixed(2)}
                                              </td>
                                              <td className="py-2 px-3 text-sm text-right font-medium">
                                                LKR{" "}
                                                {(
                                                  item.quantity * item.unitPrice
                                                ).toFixed(2)}
                                              </td>
                                            </tr>
                                          )
                                        )}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>

                                {selectedOrder.notes && (
                                  <div>
                                    <Label className="text-muted-foreground">
                                      Notes
                                    </Label>
                                    <p className="mt-1 text-sm">
                                      {selectedOrder.notes}
                                    </p>
                                  </div>
                                )}

                                <div className="flex gap-2 pt-4 border-t">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handlePrintPO(selectedOrder)}
                                  >
                                    <Printer className="h-4 w-4 mr-2" />
                                    Print PO
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleEmailPO(selectedOrder)}
                                  >
                                    <Mail className="h-4 w-4 mr-2" />
                                    Email to Supplier
                                  </Button>
                                  {selectedOrder.status === "draft" && (
                                    <Button
                                      size="sm"
                                      onClick={() => setConfirmAction({ type: "send", orderId: selectedOrder.id })}
                                      title="Send"
                                      aria-label={`Send order ${selectedOrder.id}`}
                                    >
                                      <Send className="h-4 w-4 mr-2" />
                                      Send to Supplier
                                    </Button>
                                  )}
                                  {selectedOrder.status === "sent" && (
                                    <Button
                                      size="sm"
                                      onClick={() => setConfirmAction({ type: "deliver", orderId: selectedOrder.id })}
                                      title="Mark as Delivered"
                                      aria-label={`Mark order ${selectedOrder.id} as delivered`}
                                    >
                                      <CheckCircle className="h-4 w-4 mr-2" />
                                      Mark as Delivered
                                    </Button>
                                  )}
                                  {selectedOrder.status === "delivered" && (
                                    <Button
                                      size="sm"
                                      onClick={() => setConfirmAction({ type: "close", orderId: selectedOrder.id })}
                                      title="Close"
                                      aria-label={`Close order ${selectedOrder.id}`}
                                    >
                                      <CheckCircle className="h-4 w-4 mr-2" />
                                      Close PO
                                    </Button>
                                  )}
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        {order.status === "draft" && (
                          <Button size="sm" onClick={() => setConfirmAction({ type: "send", orderId: order.id })} title="Send" aria-label={`Send order ${order.id}`}>
                            <Send className="h-3 w-3" />
                          </Button>
                        )}
                        {order.status === "sent" && (
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => setConfirmAction({ type: "deliver", orderId: order.id })}
                            title="Mark Delivered"
                            aria-label={`Mark order ${order.id} as delivered`}
                          >
                            <CheckCircle className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
        </TabsContent>
      </Tabs>

      <AlertDialog open={confirmAction.type !== null} onOpenChange={() => setConfirmAction({ type: null, orderId: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmAction.type === "send" && "Confirm Send Order"}
              {confirmAction.type === "deliver" && "Confirm Delivery"}
              {confirmAction.type === "close" && "Confirm Close Order"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmAction.type === "send" &&
                "Are you sure you want to send this purchase order to the supplier? This action will change the order status to 'Sent'."}
              {confirmAction.type === "deliver" &&
                "Are you sure you want to mark this order as delivered? This confirms that you have received the items from the supplier."}
              {confirmAction.type === "close" &&
                "Are you sure you want to close this purchase order? This action indicates that all processes related to this order are complete."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmAction}>
              {confirmAction.type === "send" && "Send Order"}
              {confirmAction.type === "deliver" && "Confirm Delivery"}
              {confirmAction.type === "close" && "Close Order"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={confirmRequestAction.type !== null}
        onOpenChange={() => setConfirmRequestAction({ type: null, requestId: null })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmRequestAction.type === "approve" && "Confirm Approve Request"}
              {confirmRequestAction.type === "decline" && "Confirm Decline Request"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmRequestAction.type === "approve" &&
                "Are you sure you want to approve this purchase request? This will allow the request to be converted into a purchase order."}
              {confirmRequestAction.type === "decline" &&
                "Are you sure you want to decline this purchase request? This action will reject the request and it cannot be processed further."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmRequestAction}
              className={confirmRequestAction.type === "decline" ? "bg-destructive hover:bg-destructive/90" : ""}
            >
              {confirmRequestAction.type === "approve" && "Approve Request"}
              {confirmRequestAction.type === "decline" && "Decline Request"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
