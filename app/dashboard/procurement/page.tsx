"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Search, Plus, Printer, Mail, Eye, Edit, Send, CheckCircle, XCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type POStatus = "draft" | "sent" | "delivered" | "closed"

interface PurchaseOrder {
  id: string
  supplier: string
  supplierId: string
  items: Array<{
    name: string
    quantity: number
    unitPrice: number
  }>
  totalAmount: number
  status: POStatus
  createdDate: string
  expectedDeliveryDate: string
  paymentTerms: string
  notes: string
  supplierPerformance: number
}

const mockSuppliers = [
  { id: "SUP-001", name: "MediSupply Ltd", performance: 95, deliveryRate: 98 },
  { id: "SUP-002", name: "PharmaCorp", performance: 88, deliveryRate: 92 },
  { id: "SUP-003", name: "HealthCare Supplies", performance: 92, deliveryRate: 95 },
  { id: "SUP-004", name: "Global Pharma", performance: 85, deliveryRate: 88 },
]

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
]

export default function PurchaseOrdersPage() {
  const [orders, setOrders] = useState(mockOrders)
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null)
  const [statusFilter, setStatusFilter] = useState<POStatus | "all">("all")
  const [newOrder, setNewOrder] = useState({
    supplier: "",
    items: [{ name: "", quantity: "", unitPrice: "" }],
    expectedDeliveryDate: "",
    paymentTerms: "Net 30",
    notes: "",
  })

  const addItemField = () => {
    setNewOrder({
      ...newOrder,
      items: [...newOrder.items, { name: "", quantity: "", unitPrice: "" }],
    })
  }

  const removeItemField = (index: number) => {
    const items = newOrder.items.filter((_, i) => i !== index)
    setNewOrder({ ...newOrder, items })
  }

  const updateItemField = (index: number, field: string, value: string) => {
    const items = [...newOrder.items]
    items[index] = { ...items[index], [field]: value }
    setNewOrder({ ...newOrder, items })
  }

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault()
    const supplier = mockSuppliers.find((s) => s.id === newOrder.supplier)
    if (!supplier) return

    const items = newOrder.items.map((item) => ({
      name: item.name,
      quantity: Number.parseInt(item.quantity),
      unitPrice: Number.parseFloat(item.unitPrice),
    }))

    const totalAmount = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)

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
    }

    setOrders([order, ...orders])
    setNewOrder({
      supplier: "",
      items: [{ name: "", quantity: "", unitPrice: "" }],
      expectedDeliveryDate: "",
      paymentTerms: "Net 30",
      notes: "",
    })
    setShowForm(false)
  }

  const updateOrderStatus = (orderId: string, newStatus: POStatus) => {
    setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))
  }

  const handlePrintPO = (order: PurchaseOrder) => {
    alert(`Printing PO ${order.id}...\nThis would generate a PDF in production.`)
  }

  const handleEmailPO = (order: PurchaseOrder) => {
    alert(`Sending PO ${order.id} to ${order.supplier}...\nThis would send an email in production.`)
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === "all" || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: POStatus) => {
    const variants: Record<POStatus, { variant: any; className: string }> = {
      draft: { variant: "secondary", className: "bg-gray-500" },
      sent: { variant: "default", className: "bg-blue-500" },
      delivered: { variant: "default", className: "bg-green-500" },
      closed: { variant: "outline", className: "" },
    }
    return variants[status]
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Purchase Orders</h1>
          <p className="text-muted-foreground mt-1">Create and manage purchase orders sent to suppliers</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          New Purchase Order
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Purchase Order</CardTitle>
            <CardDescription>Fill in the details to generate a new PO</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitOrder} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="supplier">Supplier *</Label>
                  <Select value={newOrder.supplier} onValueChange={(value) => setNewOrder({ ...newOrder, supplier: value })}>
                    <SelectTrigger id="supplier">
                      <SelectValue placeholder="Select supplier (sorted by performance)" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockSuppliers
                        .sort((a, b) => b.performance - a.performance)
                        .map((supplier) => (
                          <SelectItem key={supplier.id} value={supplier.id}>
                            {supplier.name} (Performance: {supplier.performance}%)
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
                    onChange={(e) => setNewOrder({ ...newOrder, expectedDeliveryDate: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentTerms">Payment Terms *</Label>
                  <Select
                    value={newOrder.paymentTerms}
                    onValueChange={(value) => setNewOrder({ ...newOrder, paymentTerms: value })}
                  >
                    <SelectTrigger id="paymentTerms">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Net 15">Net 15 Days</SelectItem>
                      <SelectItem value="Net 30">Net 30 Days</SelectItem>
                      <SelectItem value="Net 45">Net 45 Days</SelectItem>
                      <SelectItem value="Net 60">Net 60 Days</SelectItem>
                      <SelectItem value="Due on Receipt">Due on Receipt</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Order Items *</Label>
                  <Button type="button" size="sm" variant="outline" onClick={addItemField}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Item
                  </Button>
                </div>

                {newOrder.items.map((item, index) => (
                  <div key={index} className="grid gap-3 md:grid-cols-4 p-3 border rounded-lg">
                    <div className="space-y-1 md:col-span-2">
                      <Input
                        placeholder="Item name"
                        value={item.name}
                        onChange={(e) => updateItemField(index, "name", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <Input
                        type="number"
                        placeholder="Quantity"
                        value={item.quantity}
                        onChange={(e) => updateItemField(index, "quantity", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-1 flex gap-2">
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Unit Price ($)"
                        value={item.unitPrice}
                        onChange={(e) => updateItemField(index, "unitPrice", e.target.value)}
                        required
                      />
                      {newOrder.items.length > 1 && (
                        <Button type="button" size="icon" variant="ghost" onClick={() => removeItemField(index)}>
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
                  onChange={(e) => setNewOrder({ ...newOrder, notes: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit">Create Purchase Order</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
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
              <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
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
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">PO ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Supplier</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Items</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Total Amount</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Delivery Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-border last:border-0">
                    <td className="py-3 px-4 text-sm font-medium text-foreground">{order.id}</td>
                    <td className="py-3 px-4 text-sm text-foreground">{order.supplier}</td>
                    <td className="py-3 px-4 text-sm text-foreground">{order.items.length} item(s)</td>
                    <td className="py-3 px-4 text-sm text-foreground">${order.totalAmount.toFixed(2)}</td>
                    <td className="py-3 px-4 text-sm text-foreground">{order.expectedDeliveryDate}</td>
                    <td className="py-3 px-4">
                      <Badge variant={getStatusBadge(order.status).variant} className={getStatusBadge(order.status).className}>
                        {order.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-1">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" onClick={() => setSelectedOrder(order)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Purchase Order Details - {order.id}</DialogTitle>
                              <DialogDescription>Complete purchase order information</DialogDescription>
                            </DialogHeader>
                            {selectedOrder && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-muted-foreground">Supplier</Label>
                                    <p className="font-medium">{selectedOrder.supplier}</p>
                                  </div>
                                  <div>
                                    <Label className="text-muted-foreground">Status</Label>
                                    <div className="mt-1">
                                      <Badge
                                        variant={getStatusBadge(selectedOrder.status).variant}
                                        className={getStatusBadge(selectedOrder.status).className}
                                      >
                                        {selectedOrder.status.toUpperCase()}
                                      </Badge>
                                    </div>
                                  </div>
                                  <div>
                                    <Label className="text-muted-foreground">Created Date</Label>
                                    <p className="font-medium">{selectedOrder.createdDate}</p>
                                  </div>
                                  <div>
                                    <Label className="text-muted-foreground">Expected Delivery</Label>
                                    <p className="font-medium">{selectedOrder.expectedDeliveryDate}</p>
                                  </div>
                                  <div>
                                    <Label className="text-muted-foreground">Payment Terms</Label>
                                    <p className="font-medium">{selectedOrder.paymentTerms}</p>
                                  </div>
                                  <div>
                                    <Label className="text-muted-foreground">Total Amount</Label>
                                    <p className="font-medium text-lg">${selectedOrder.totalAmount.toFixed(2)}</p>
                                  </div>
                                </div>

                                <div>
                                  <Label className="text-muted-foreground">Order Items</Label>
                                  <div className="mt-2 border rounded-lg overflow-hidden">
                                    <table className="w-full">
                                      <thead className="bg-muted">
                                        <tr>
                                          <th className="text-left py-2 px-3 text-sm font-medium">Item Name</th>
                                          <th className="text-right py-2 px-3 text-sm font-medium">Quantity</th>
                                          <th className="text-right py-2 px-3 text-sm font-medium">Unit Price</th>
                                          <th className="text-right py-2 px-3 text-sm font-medium">Total</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {selectedOrder.items.map((item, idx) => (
                                          <tr key={idx} className="border-t">
                                            <td className="py-2 px-3 text-sm">{item.name}</td>
                                            <td className="py-2 px-3 text-sm text-right">{item.quantity}</td>
                                            <td className="py-2 px-3 text-sm text-right">${item.unitPrice.toFixed(2)}</td>
                                            <td className="py-2 px-3 text-sm text-right font-medium">
                                              ${(item.quantity * item.unitPrice).toFixed(2)}
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>

                                {selectedOrder.notes && (
                                  <div>
                                    <Label className="text-muted-foreground">Notes</Label>
                                    <p className="mt-1 text-sm">{selectedOrder.notes}</p>
                                  </div>
                                )}

                                <div className="flex gap-2 pt-4 border-t">
                                  <Button size="sm" variant="outline" onClick={() => handlePrintPO(selectedOrder)}>
                                    <Printer className="h-4 w-4 mr-2" />
                                    Print PO
                                  </Button>
                                  <Button size="sm" variant="outline" onClick={() => handleEmailPO(selectedOrder)}>
                                    <Mail className="h-4 w-4 mr-2" />
                                    Email to Supplier
                                  </Button>
                                  {selectedOrder.status === "draft" && (
                                    <Button size="sm" onClick={() => updateOrderStatus(selectedOrder.id, "sent")}>
                                      <Send className="h-4 w-4 mr-2" />
                                      Send to Supplier
                                    </Button>
                                  )}
                                  {selectedOrder.status === "sent" && (
                                    <Button size="sm" onClick={() => updateOrderStatus(selectedOrder.id, "delivered")}>
                                      <CheckCircle className="h-4 w-4 mr-2" />
                                      Mark as Delivered
                                    </Button>
                                  )}
                                  {selectedOrder.status === "delivered" && (
                                    <Button size="sm" onClick={() => updateOrderStatus(selectedOrder.id, "closed")}>
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
                          <Button size="sm" onClick={() => updateOrderStatus(order.id, "sent")}>
                            <Send className="h-3 w-3" />
                          </Button>
                        )}
                        {order.status === "sent" && (
                          <Button size="sm" variant="default" onClick={() => updateOrderStatus(order.id, "delivered")}>
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
    </div>
  )
}
