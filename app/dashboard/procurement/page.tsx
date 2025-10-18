"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Plus } from "lucide-react"

const mockOrders = [
  {
    id: "PO-001",
    supplier: "MediSupply Ltd",
    item: "Paracetamol 500mg",
    quantity: 1000,
    status: "pending",
    date: "2025-01-08",
  },
  {
    id: "PO-002",
    supplier: "PharmaCorp",
    item: "Amoxicillin 250mg",
    quantity: 500,
    status: "approved",
    date: "2025-01-07",
  },
  {
    id: "PO-003",
    supplier: "HealthCare Supplies",
    item: "Ibuprofen 400mg",
    quantity: 750,
    status: "pending",
    date: "2025-01-06",
  },
  {
    id: "PO-004",
    supplier: "MediSupply Ltd",
    item: "Aspirin 100mg",
    quantity: 2000,
    status: "delivered",
    date: "2025-01-05",
  },
  {
    id: "PO-005",
    supplier: "Global Pharma",
    item: "Metformin 500mg",
    quantity: 1500,
    status: "approved",
    date: "2025-01-04",
  },
]

const suppliers = ["MediSupply Ltd", "PharmaCorp", "HealthCare Supplies", "Global Pharma"]

export default function ProcurementPage() {
  const [orders, setOrders] = useState(mockOrders)
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [newOrder, setNewOrder] = useState({
    item: "",
    quantity: "",
    supplier: "",
  })

  const handleApprove = (orderId: string) => {
    setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: "approved" } : order)))
  }

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault()
    const order = {
      id: `PO-${String(orders.length + 1).padStart(3, "0")}`,
      supplier: newOrder.supplier,
      item: newOrder.item,
      quantity: Number.parseInt(newOrder.quantity),
      status: "pending" as const,
      date: new Date().toISOString().split("T")[0],
    }
    setOrders([order, ...orders])
    setNewOrder({ item: "", quantity: "", supplier: "" })
    setShowForm(false)
  }

  const filteredOrders = orders.filter(
    (order) =>
      order.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Procurement Management</h1>
          <p className="text-muted-foreground mt-1">Manage supplier orders and approvals</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          New Order
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Order</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitOrder} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="item">Item Name</Label>
                  <Input
                    id="item"
                    placeholder="Enter item name"
                    value={newOrder.item}
                    onChange={(e) => setNewOrder({ ...newOrder, item: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="Enter quantity"
                    value={newOrder.quantity}
                    onChange={(e) => setNewOrder({ ...newOrder, quantity: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supplier">Supplier</Label>
                  <Select
                    value={newOrder.supplier}
                    onValueChange={(value) => setNewOrder({ ...newOrder, supplier: value })}
                  >
                    <SelectTrigger id="supplier">
                      <SelectValue placeholder="Select supplier" />
                    </SelectTrigger>
                    <SelectContent>
                      {suppliers.map((supplier) => (
                        <SelectItem key={supplier} value={supplier}>
                          {supplier}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit">Submit Order</Button>
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
          <div className="flex items-center justify-between">
            <CardTitle>Purchase Orders</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Order ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Supplier</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Item</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Quantity</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-border last:border-0">
                    <td className="py-3 px-4 text-sm font-medium text-foreground">{order.id}</td>
                    <td className="py-3 px-4 text-sm text-foreground">{order.supplier}</td>
                    <td className="py-3 px-4 text-sm text-foreground">{order.item}</td>
                    <td className="py-3 px-4 text-sm text-foreground">{order.quantity}</td>
                    <td className="py-3 px-4 text-sm text-foreground">{order.date}</td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          order.status === "approved" ? "default" : order.status === "pending" ? "secondary" : "outline"
                        }
                      >
                        {order.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      {order.status === "pending" && (
                        <Button size="sm" onClick={() => handleApprove(order.id)}>
                          Approve
                        </Button>
                      )}
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
