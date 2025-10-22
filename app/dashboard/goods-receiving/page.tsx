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
import { Search, Package, AlertTriangle, CheckCircle, Upload, Eye, FileText, XCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type ReceivingStatus = "pending" | "partial" | "completed" | "discrepancy"
type DiscrepancyType = "shortage" | "damage" | "quality-issue" | "wrong-item"

interface PurchaseOrder {
  id: string
  supplier: string
  items: Array<{
    name: string
    orderedQuantity: number
    receivedQuantity: number
  }>
  expectedDeliveryDate: string
  status: "sent" | "delivered"
}

interface GoodsReceipt {
  id: string
  poId: string
  supplier: string
  receivedDate: string
  items: Array<{
    name: string
    orderedQuantity: number
    receivedQuantity: number
    acceptedQuantity: number
    rejectedQuantity: number
    notes: string
  }>
  status: ReceivingStatus
  discrepancies: Array<{
    type: DiscrepancyType
    item: string
    description: string
  }>
  deliveryNoteUrl?: string
  invoiceUrl?: string
  inspector: string
  notes: string
}

const mockPendingPOs: PurchaseOrder[] = [
  {
    id: "PO-001",
    supplier: "MediSupply Ltd",
    items: [
      { name: "Paracetamol 500mg", orderedQuantity: 1000, receivedQuantity: 0 },
      { name: "Aspirin 100mg", orderedQuantity: 500, receivedQuantity: 0 },
    ],
    expectedDeliveryDate: "2025-01-15",
    status: "sent",
  },
  {
    id: "PO-002",
    supplier: "PharmaCorp",
    items: [{ name: "Amoxicillin 250mg", orderedQuantity: 500, receivedQuantity: 0 }],
    expectedDeliveryDate: "2025-01-20",
    status: "sent",
  },
]

const mockReceipts: GoodsReceipt[] = [
  {
    id: "GR-001",
    poId: "PO-004",
    supplier: "MediSupply Ltd",
    receivedDate: "2025-01-10",
    items: [
      {
        name: "Metformin 500mg",
        orderedQuantity: 1500,
        receivedQuantity: 1500,
        acceptedQuantity: 1500,
        rejectedQuantity: 0,
        notes: "Quality verified",
      },
      {
        name: "Atorvastatin 20mg",
        orderedQuantity: 800,
        receivedQuantity: 800,
        acceptedQuantity: 800,
        rejectedQuantity: 0,
        notes: "All good",
      },
    ],
    status: "completed",
    discrepancies: [],
    deliveryNoteUrl: "/docs/dn-001.pdf",
    invoiceUrl: "/docs/inv-001.pdf",
    inspector: "John Smith",
    notes: "Delivery on time, all items verified",
  },
  {
    id: "GR-002",
    poId: "PO-003",
    supplier: "HealthCare Supplies",
    receivedDate: "2025-01-12",
    items: [
      {
        name: "Ibuprofen 400mg",
        orderedQuantity: 750,
        receivedQuantity: 700,
        acceptedQuantity: 680,
        rejectedQuantity: 20,
        notes: "20 units damaged packaging",
      },
    ],
    status: "discrepancy",
    discrepancies: [
      {
        type: "shortage",
        item: "Ibuprofen 400mg",
        description: "Received 700 units instead of 750 ordered. 50 units short.",
      },
      {
        type: "damage",
        item: "Ibuprofen 400mg",
        description: "20 units with damaged packaging, rejected.",
      },
    ],
    deliveryNoteUrl: "/docs/dn-002.pdf",
    inspector: "Sarah Johnson",
    notes: "Contacted supplier about shortage and damaged goods",
  },
]

export default function GoodsReceivingPage() {
  const [pendingPOs] = useState(mockPendingPOs)
  const [receipts, setReceipts] = useState(mockReceipts)
  const [searchTerm, setSearchTerm] = useState("")
  const [showReceivingForm, setShowReceivingForm] = useState(false)
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null)
  const [selectedReceipt, setSelectedReceipt] = useState<GoodsReceipt | null>(null)
  const [receivingData, setReceivingData] = useState({
    items: [] as Array<{
      name: string
      orderedQuantity: number
      receivedQuantity: string
      acceptedQuantity: string
      rejectedQuantity: string
      notes: string
    }>,
    discrepancies: [] as Array<{ type: DiscrepancyType; item: string; description: string }>,
    inspector: "",
    notes: "",
    deliveryNote: null as File | null,
    invoice: null as File | null,
  })

  const startReceiving = (po: PurchaseOrder) => {
    setSelectedPO(po)
    setReceivingData({
      items: po.items.map((item) => ({
        name: item.name,
        orderedQuantity: item.orderedQuantity,
        receivedQuantity: "",
        acceptedQuantity: "",
        rejectedQuantity: "0",
        notes: "",
      })),
      discrepancies: [],
      inspector: "",
      notes: "",
      deliveryNote: null,
      invoice: null,
    })
    setShowReceivingForm(true)
  }

  const updateItemField = (index: number, field: string, value: string) => {
    const items = [...receivingData.items]
    items[index] = { ...items[index], [field]: value }

    // Auto-calculate accepted quantity
    if (field === "receivedQuantity" || field === "rejectedQuantity") {
      const received = Number.parseInt(items[index].receivedQuantity || "0")
      const rejected = Number.parseInt(items[index].rejectedQuantity || "0")
      items[index].acceptedQuantity = String(Math.max(0, received - rejected))
    }

    setReceivingData({ ...receivingData, items })
  }

  const addDiscrepancy = () => {
    setReceivingData({
      ...receivingData,
      discrepancies: [
        ...receivingData.discrepancies,
        { type: "shortage" as DiscrepancyType, item: "", description: "" },
      ],
    })
  }

  const updateDiscrepancy = (index: number, field: string, value: string) => {
    const discrepancies = [...receivingData.discrepancies]
    discrepancies[index] = { ...discrepancies[index], [field]: value }
    setReceivingData({ ...receivingData, discrepancies })
  }

  const removeDiscrepancy = (index: number) => {
    const discrepancies = receivingData.discrepancies.filter((_, i) => i !== index)
    setReceivingData({ ...receivingData, discrepancies })
  }

  const handleFileUpload = (type: "deliveryNote" | "invoice", file: File | null) => {
    setReceivingData({ ...receivingData, [type]: file })
  }

  const handleSubmitReceipt = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPO) return

    // Determine status
    let status: ReceivingStatus = "completed"
    const hasDiscrepancies = receivingData.discrepancies.length > 0
    const allItemsReceived = receivingData.items.every(
      (item) => Number.parseInt(item.receivedQuantity) === item.orderedQuantity,
    )

    if (hasDiscrepancies) {
      status = "discrepancy"
    } else if (!allItemsReceived) {
      status = "partial"
    }

    const receipt: GoodsReceipt = {
      id: `GR-${String(receipts.length + 1).padStart(3, "0")}`,
      poId: selectedPO.id,
      supplier: selectedPO.supplier,
      receivedDate: new Date().toISOString().split("T")[0],
      items: receivingData.items.map((item) => ({
        name: item.name,
        orderedQuantity: item.orderedQuantity,
        receivedQuantity: Number.parseInt(item.receivedQuantity),
        acceptedQuantity: Number.parseInt(item.acceptedQuantity),
        rejectedQuantity: Number.parseInt(item.rejectedQuantity),
        notes: item.notes,
      })),
      status,
      discrepancies: receivingData.discrepancies,
      deliveryNoteUrl: receivingData.deliveryNote ? `/docs/dn-${Date.now()}.pdf` : undefined,
      invoiceUrl: receivingData.invoice ? `/docs/inv-${Date.now()}.pdf` : undefined,
      inspector: receivingData.inspector,
      notes: receivingData.notes,
    }

    setReceipts([receipt, ...receipts])
    setShowReceivingForm(false)
    setSelectedPO(null)

    // Show success message
    alert(
      `Goods receipt ${receipt.id} created successfully!\n\nInventory would be automatically updated in production.\n\nStatus: ${status.toUpperCase()}`,
    )
  }

  const filteredReceipts = receipts.filter(
    (receipt) =>
      receipt.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receipt.poId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receipt.supplier.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusBadge = (status: ReceivingStatus) => {
    const variants: Record<ReceivingStatus, { variant: any; className: string }> = {
      pending: { variant: "secondary", className: "bg-yellow-500" },
      partial: { variant: "default", className: "bg-orange-500" },
      completed: { variant: "default", className: "bg-green-500" },
      discrepancy: { variant: "destructive", className: "bg-red-500" },
    }
    return variants[status]
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Goods Receiving</h1>
          <p className="text-muted-foreground mt-1">Record and verify incoming deliveries against purchase orders</p>
        </div>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">Pending Deliveries ({pendingPOs.length})</TabsTrigger>
          <TabsTrigger value="received">Received Goods ({receipts.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Expected Deliveries</CardTitle>
              <CardDescription>Purchase orders awaiting delivery</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingPOs.map((po) => (
                  <div key={po.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{po.id}</h3>
                        <p className="text-sm text-muted-foreground">{po.supplier}</p>
                      </div>
                      <Badge variant="outline">Expected: {po.expectedDeliveryDate}</Badge>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-muted-foreground text-xs">Items:</Label>
                      {po.items.map((item, idx) => (
                        <div key={idx} className="text-sm">
                          • {item.name} - Quantity: {item.orderedQuantity}
                        </div>
                      ))}
                    </div>
                    <Button onClick={() => startReceiving(po)} className="w-full">
                      <Package className="h-4 w-4 mr-2" />
                      Record Delivery
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="received" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Goods Receipt History</CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search receipts..."
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
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Receipt ID</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">PO ID</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Supplier</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Received Date</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Items</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReceipts.map((receipt) => (
                      <tr key={receipt.id} className="border-b border-border last:border-0">
                        <td className="py-3 px-4 text-sm font-medium text-foreground">{receipt.id}</td>
                        <td className="py-3 px-4 text-sm text-foreground">{receipt.poId}</td>
                        <td className="py-3 px-4 text-sm text-foreground">{receipt.supplier}</td>
                        <td className="py-3 px-4 text-sm text-foreground">{receipt.receivedDate}</td>
                        <td className="py-3 px-4 text-sm text-foreground">{receipt.items.length} item(s)</td>
                        <td className="py-3 px-4">
                          <Badge
                            variant={getStatusBadge(receipt.status).variant}
                            className={getStatusBadge(receipt.status).className}
                          >
                            {receipt.status.toUpperCase()}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline" onClick={() => setSelectedReceipt(receipt)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Goods Receipt Details - {receipt.id}</DialogTitle>
                                <DialogDescription>Complete receiving information and verification results</DialogDescription>
                              </DialogHeader>
                              {selectedReceipt && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label className="text-muted-foreground">Purchase Order</Label>
                                      <p className="font-medium">{selectedReceipt.poId}</p>
                                    </div>
                                    <div>
                                      <Label className="text-muted-foreground">Supplier</Label>
                                      <p className="font-medium">{selectedReceipt.supplier}</p>
                                    </div>
                                    <div>
                                      <Label className="text-muted-foreground">Received Date</Label>
                                      <p className="font-medium">{selectedReceipt.receivedDate}</p>
                                    </div>
                                    <div>
                                      <Label className="text-muted-foreground">Inspector</Label>
                                      <p className="font-medium">{selectedReceipt.inspector}</p>
                                    </div>
                                    <div className="col-span-2">
                                      <Label className="text-muted-foreground">Status</Label>
                                      <div className="mt-1">
                                        <Badge
                                          variant={getStatusBadge(selectedReceipt.status).variant}
                                          className={getStatusBadge(selectedReceipt.status).className}
                                        >
                                          {selectedReceipt.status.toUpperCase()}
                                        </Badge>
                                      </div>
                                    </div>
                                  </div>

                                  <div>
                                    <Label className="text-muted-foreground">Items Received</Label>
                                    <div className="mt-2 border rounded-lg overflow-hidden">
                                      <table className="w-full">
                                        <thead className="bg-muted">
                                          <tr>
                                            <th className="text-left py-2 px-3 text-sm font-medium">Item</th>
                                            <th className="text-right py-2 px-3 text-sm font-medium">Ordered</th>
                                            <th className="text-right py-2 px-3 text-sm font-medium">Received</th>
                                            <th className="text-right py-2 px-3 text-sm font-medium">Accepted</th>
                                            <th className="text-right py-2 px-3 text-sm font-medium">Rejected</th>
                                            <th className="text-left py-2 px-3 text-sm font-medium">Notes</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {selectedReceipt.items.map((item, idx) => (
                                            <tr key={idx} className="border-t">
                                              <td className="py-2 px-3 text-sm">{item.name}</td>
                                              <td className="py-2 px-3 text-sm text-right">{item.orderedQuantity}</td>
                                              <td className="py-2 px-3 text-sm text-right">{item.receivedQuantity}</td>
                                              <td className="py-2 px-3 text-sm text-right text-green-600 font-medium">
                                                {item.acceptedQuantity}
                                              </td>
                                              <td className="py-2 px-3 text-sm text-right text-red-600 font-medium">
                                                {item.rejectedQuantity}
                                              </td>
                                              <td className="py-2 px-3 text-sm">{item.notes || "-"}</td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>

                                  {selectedReceipt.discrepancies.length > 0 && (
                                    <div>
                                      <Label className="text-muted-foreground flex items-center gap-2">
                                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                                        Discrepancies Found
                                      </Label>
                                      <div className="mt-2 space-y-2">
                                        {selectedReceipt.discrepancies.map((disc, idx) => (
                                          <div key={idx} className="border border-yellow-600 rounded-lg p-3 bg-yellow-50 dark:bg-yellow-950">
                                            <div className="flex items-start gap-2">
                                              <Badge variant="outline" className="mt-0.5">
                                                {disc.type}
                                              </Badge>
                                              <div className="flex-1">
                                                <p className="font-medium text-sm">{disc.item}</p>
                                                <p className="text-sm text-muted-foreground">{disc.description}</p>
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {selectedReceipt.notes && (
                                    <div>
                                      <Label className="text-muted-foreground">Inspector Notes</Label>
                                      <p className="mt-1 text-sm">{selectedReceipt.notes}</p>
                                    </div>
                                  )}

                                  <div>
                                    <Label className="text-muted-foreground">Documents</Label>
                                    <div className="mt-2 flex gap-2">
                                      {selectedReceipt.deliveryNoteUrl && (
                                        <Button size="sm" variant="outline">
                                          <FileText className="h-4 w-4 mr-2" />
                                          Delivery Note
                                        </Button>
                                      )}
                                      {selectedReceipt.invoiceUrl && (
                                        <Button size="sm" variant="outline">
                                          <FileText className="h-4 w-4 mr-2" />
                                          Invoice
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
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

      {/* Receiving Form Dialog */}
      <Dialog open={showReceivingForm} onOpenChange={setShowReceivingForm}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Record Goods Receipt</DialogTitle>
            <DialogDescription>
              Purchase Order: {selectedPO?.id} - {selectedPO?.supplier}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitReceipt} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="inspector">Inspector Name *</Label>
                <Input
                  id="inspector"
                  placeholder="Enter inspector name"
                  value={receivingData.inspector}
                  onChange={(e) => setReceivingData({ ...receivingData, inspector: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <Label>Items Verification *</Label>
              <div className="mt-2 space-y-3">
                {receivingData.items.map((item, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="font-medium">{item.name}</div>
                    <div className="grid gap-3 md:grid-cols-4">
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Ordered Qty</Label>
                        <Input value={item.orderedQuantity} disabled />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Received Qty *</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={item.receivedQuantity}
                          onChange={(e) => updateItemField(index, "receivedQuantity", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Rejected Qty</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={item.rejectedQuantity}
                          onChange={(e) => updateItemField(index, "rejectedQuantity", e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Accepted Qty</Label>
                        <Input value={item.acceptedQuantity} disabled className="bg-green-50 dark:bg-green-950" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Item Notes</Label>
                      <Input
                        placeholder="Any observations about this item..."
                        value={item.notes}
                        onChange={(e) => updateItemField(index, "notes", e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Discrepancies (if any)</Label>
                <Button type="button" size="sm" variant="outline" onClick={addDiscrepancy}>
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Add Discrepancy
                </Button>
              </div>
              <div className="space-y-2">
                {receivingData.discrepancies.map((disc, index) => (
                  <div key={index} className="border border-yellow-600 rounded-lg p-3 space-y-2">
                    <div className="grid gap-2 md:grid-cols-3">
                      <Select
                        value={disc.type}
                        onValueChange={(value) => updateDiscrepancy(index, "type", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="shortage">Shortage</SelectItem>
                          <SelectItem value="damage">Damage</SelectItem>
                          <SelectItem value="quality-issue">Quality Issue</SelectItem>
                          <SelectItem value="wrong-item">Wrong Item</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        placeholder="Item name"
                        value={disc.item}
                        onChange={(e) => updateDiscrepancy(index, "item", e.target.value)}
                      />
                      <Button type="button" size="icon" variant="ghost" onClick={() => removeDiscrepancy(index)}>
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                    <Textarea
                      placeholder="Describe the discrepancy..."
                      value={disc.description}
                      onChange={(e) => updateDiscrepancy(index, "description", e.target.value)}
                      rows={2}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="deliveryNote">Upload Delivery Note (PDF)</Label>
                <Input
                  id="deliveryNote"
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleFileUpload("deliveryNote", e.target.files?.[0] || null)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="invoice">Upload Invoice (PDF)</Label>
                <Input
                  id="invoice"
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleFileUpload("invoice", e.target.files?.[0] || null)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">General Notes</Label>
              <Textarea
                id="notes"
                placeholder="Add any additional notes about this delivery..."
                value={receivingData.notes}
                onChange={(e) => setReceivingData({ ...receivingData, notes: e.target.value })}
                rows={3}
              />
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <Button type="submit">
                <CheckCircle className="h-4 w-4 mr-2" />
                Complete Goods Receipt
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowReceivingForm(false)
                  setSelectedPO(null)
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
