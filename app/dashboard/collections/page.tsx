"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Search, Download } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

const mockCollections = [
  { id: "COL-001", customer: "City Hospital", amount: 125000, dueDate: "2025-01-15", status: "pending" },
  { id: "COL-002", customer: "Green Clinic", amount: 45000, dueDate: "2025-01-12", status: "overdue" },
  { id: "COL-003", customer: "Health Center", amount: 78000, dueDate: "2025-01-20", status: "pending" },
  { id: "COL-004", customer: "Medical Plaza", amount: 92000, dueDate: "2025-01-10", status: "approved" },
  { id: "COL-005", customer: "Wellness Clinic", amount: 56000, dueDate: "2025-01-18", status: "pending" },
]

export default function CollectionsPage() {
  const [collections, setCollections] = useState(mockCollections)
  const [searchTerm, setSearchTerm] = useState("")
  const [paymentAmount, setPaymentAmount] = useState("")
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null)

  const handleApprove = (collectionId: string) => {
    setCollections(collections.map((col) => (col.id === collectionId ? { ...col, status: "approved" } : col)))
  }

  const handleRecordPayment = () => {
    if (selectedCollection && paymentAmount) {
      handleApprove(selectedCollection)
      setPaymentAmount("")
      setSelectedCollection(null)
    }
  }

  const filteredCollections = collections.filter(
    (col) =>
      col.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      col.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const totalOutstanding = collections
    .filter((col) => col.status === "pending" || col.status === "overdue")
    .reduce((sum, col) => sum + col.amount, 0)

  const totalOverdue = collections.filter((col) => col.status === "overdue").reduce((sum, col) => sum + col.amount, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Collection Management</h1>
          <p className="text-muted-foreground mt-1">Track payments and receivables</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Generate Report
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Outstanding</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">LKR {totalOutstanding.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Overdue Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">LKR {totalOverdue.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Collections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {collections.filter((col) => col.status === "pending").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Outstanding Collections</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search collections..."
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
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Collection ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Customer</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Amount (LKR)</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Due Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCollections.map((collection) => (
                  <tr key={collection.id} className="border-b border-border last:border-0">
                    <td className="py-3 px-4 text-sm font-medium text-foreground">{collection.id}</td>
                    <td className="py-3 px-4 text-sm text-foreground">{collection.customer}</td>
                    <td className="py-3 px-4 text-sm text-foreground">{collection.amount.toLocaleString()}</td>
                    <td className="py-3 px-4 text-sm text-foreground">{collection.dueDate}</td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          collection.status === "approved"
                            ? "default"
                            : collection.status === "overdue"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {collection.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      {collection.status !== "approved" && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" onClick={() => setSelectedCollection(collection.id)}>
                              Record Payment
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Record Payment</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <Label>Collection ID</Label>
                                <Input value={collection.id} disabled />
                              </div>
                              <div className="space-y-2">
                                <Label>Customer</Label>
                                <Input value={collection.customer} disabled />
                              </div>
                              <div className="space-y-2">
                                <Label>Amount Due (LKR)</Label>
                                <Input value={collection.amount.toLocaleString()} disabled />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="payment-amount">Payment Amount (LKR)</Label>
                                <Input
                                  id="payment-amount"
                                  type="number"
                                  placeholder="Enter payment amount"
                                  value={paymentAmount}
                                  onChange={(e) => setPaymentAmount(e.target.value)}
                                />
                              </div>
                              <Button onClick={handleRecordPayment} className="w-full">
                                Confirm Payment
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
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
