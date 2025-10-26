"use client";
import type React from "react";
import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Download,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  Plus,
  Eye,
  FileText,
  Edit,
  Trash2,
  Calendar,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
const generateMockCollections = () => [
  {
    id: "INV-2024-001",
    customer: "City General Hospital",
    customerType: "Hospital",
    invoiceDate: "2024-09-15",
    dueDate: "2024-10-15",
    invoiceAmount: 125000,
    amountPaid: 50000,
    outstandingAmount: 75000,
    daysOverdue: 71,
    agingBracket: "61-90",
    status: "overdue",
    assignedTo: "John Doe",
    priority: "high",
    lastContactDate: "2024-12-20",
    nextFollowUpDate: "2024-12-27",
    paymentTerms: "Net 30",
    creditLimit: 200000,
    paymentHistory: [
      {
        date: "2024-10-01",
        amount: 50000,
        method: "Check",
        receipt: "RCP-001",
      },
    ],
  },
  {
    id: "INV-2024-002",
    customer: "Green Clinic",
    customerType: "Clinic",
    invoiceDate: "2024-10-05",
    dueDate: "2024-11-05",
    invoiceAmount: 45000,
    amountPaid: 0,
    outstandingAmount: 45000,
    daysOverdue: 51,
    agingBracket: "31-60",
    status: "overdue",
    assignedTo: "Jane Smith",
    priority: "high",
    lastContactDate: "2024-12-18",
    nextFollowUpDate: "2024-12-25",
    paymentTerms: "Net 30",
    creditLimit: 100000,
    paymentHistory: [],
  },
  {
    id: "INV-2024-003",
    customer: "Health Center",
    customerType: "Pharmacy",
    invoiceDate: "2024-10-20",
    dueDate: "2024-11-20",
    invoiceAmount: 78000,
    amountPaid: 78000,
    outstandingAmount: 0,
    daysOverdue: 0,
    agingBracket: "0-30",
    status: "paid",
    assignedTo: "John Doe",
    priority: "low",
    lastContactDate: "2024-11-20",
    nextFollowUpDate: null,
    paymentTerms: "Net 30",
    creditLimit: 150000,
    paymentHistory: [
      {
        date: "2024-11-20",
        amount: 78000,
        method: "Bank Transfer",
        receipt: "RCP-002",
      },
    ],
  },
  {
    id: "INV-2024-004",
    customer: "Medical Plaza",
    customerType: "Hospital",
    invoiceDate: "2024-11-01",
    dueDate: "2024-12-01",
    invoiceAmount: 92000,
    amountPaid: 30000,
    outstandingAmount: 62000,
    daysOverdue: 24,
    agingBracket: "0-30",
    status: "partial",
    assignedTo: "Jane Smith",
    priority: "medium",
    lastContactDate: "2024-12-22",
    nextFollowUpDate: "2024-12-28",
    paymentTerms: "Net 30",
    creditLimit: 180000,
    paymentHistory: [
      { date: "2024-12-01", amount: 30000, method: "Cash", receipt: "RCP-003" },
    ],
  },
  {
    id: "INV-2024-005",
    customer: "Wellness Clinic",
    customerType: "Clinic",
    invoiceDate: "2024-11-10",
    dueDate: "2024-12-10",
    invoiceAmount: 56000,
    amountPaid: 0,
    outstandingAmount: 56000,
    daysOverdue: 15,
    agingBracket: "0-30",
    status: "pending",
    assignedTo: "John Doe",
    priority: "medium",
    lastContactDate: "2024-12-20",
    nextFollowUpDate: "2024-12-26",
    paymentTerms: "Net 30",
    creditLimit: 120000,
    paymentHistory: [],
  },
  {
    id: "INV-2024-006",
    customer: "City Distributor",
    customerType: "Distributor",
    invoiceDate: "2024-11-15",
    dueDate: "2024-12-15",
    invoiceAmount: 150000,
    amountPaid: 0,
    outstandingAmount: 150000,
    daysOverdue: 10,
    agingBracket: "0-30",
    status: "pending",
    assignedTo: "Jane Smith",
    priority: "low",
    lastContactDate: "2024-12-21",
    nextFollowUpDate: "2024-12-29",
    paymentTerms: "Net 45",
    creditLimit: 300000,
    paymentHistory: [],
  },
  {
    id: "INV-2024-007",
    customer: "City General Hospital",
    customerType: "Hospital",
    invoiceDate: "2024-11-20",
    dueDate: "2024-12-20",
    invoiceAmount: 85000,
    amountPaid: 0,
    outstandingAmount: 85000,
    daysOverdue: 5,
    agingBracket: "0-30",
    status: "pending",
    assignedTo: "John Doe",
    priority: "medium",
    lastContactDate: "2024-12-23",
    nextFollowUpDate: "2024-12-30",
    paymentTerms: "Net 30",
    creditLimit: 200000,
    paymentHistory: [],
  },
];

const statusConfig = {
  paid: {
    color: "bg-green-100 dark:bg-green-900/30",
    text: "text-green-800 dark:text-green-300",
    label: "Paid",
    icon: CheckCircle2,
  },
  pending: {
    color: "bg-yellow-100 dark:bg-yellow-900/30",
    text: "text-yellow-800 dark:text-yellow-300",
    label: "Pending",
    icon: Clock,
  },
  overdue: {
    color: "bg-red-100 dark:bg-red-900/30",
    text: "text-red-800 dark:text-red-300",
    label: "Overdue",
    icon: AlertCircle,
  },
  partial: {
    color: "bg-blue-100 dark:bg-blue-900/30",
    text: "text-blue-800 dark:text-blue-300",
    label: "Partial",
    icon: TrendingUp,
  },
};

type SortField =
  | "id"
  | "customer"
  | "invoiceAmount"
  | "outstandingAmount"
  | "dueDate"
  | "daysOverdue"
  | "assignedTo";
type SortOrder = "asc" | "desc";

export default function CollectionsPage() {
  const [user, setUser] = useState<any>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const [collections, setCollections] = useState(generateMockCollections());
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [selectedCollection, setSelectedCollection] = useState<string | null>(
    null
  );
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [sortField, setSortField] = useState<SortField>("dueDate");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [showNewCollectionDialog, setShowNewCollectionDialog] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState<"excel" | "pdf">(
    "excel"
  );
  const [selectedInvoicesForBulk, setSelectedInvoicesForBulk] = useState<
    Map<string, Set<string>>
  >(new Map());
  const [bulkPaymentAmount, setBulkPaymentAmount] = useState("");
  const [bulkPaymentMethod, setBulkPaymentMethod] = useState("Cash");
  const [bulkPaymentCustomer, setBulkPaymentCustomer] = useState<string | null>(
    null
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showBulkPaymentDialog, setShowBulkPaymentDialog] = useState(false);

  // Notification state
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [newCollection, setNewCollection] = useState({
    customer: "",
    customerType: "",
    invoiceAmount: "",
    dueDate: new Date(),
    assignedTo: "",
    priority: "medium",
  });

  const [filters, setFilters] = useState({
    customerType: "all",
    status: "all",
    agingBracket: "all",
    priority: "all",
    assignedTo: "all",
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      // Check if user has required role (Administrator, Pharmacist, or Manager)
      const allowedRoles = ["admin", "pharmacist", "manager"];
      const userRole = parsedUser.role?.toLowerCase();

      if (allowedRoles.includes(userRole)) {
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    }
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [notification]);

  // Show notification helper
  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
  };

  // Reset form state
  const resetForm = () => {
    setNewCollection({
      customer: "",
      customerType: "",
      invoiceAmount: "",
      dueDate: new Date(),
      assignedTo: "",
      priority: "medium",
    });
    setEditingId(null);
  };

  const uniqueCustomerTypes = useMemo(
    () => [...new Set(collections.map((c) => c.customerType))],
    [collections]
  );
  const uniqueAssignees = useMemo(
    () => [...new Set(collections.map((c) => c.assignedTo))],
    [collections]
  );
  const uniqueCustomers = useMemo(
    () => [...new Set(collections.map((c) => c.customer))],
    [collections]
  );

  const customerSuggestions = useMemo(() => {
    if (!newCollection.customer.trim()) return [];
    return uniqueCustomers.filter((c) =>
      c.toLowerCase().includes(newCollection.customer.toLowerCase())
    );
  }, [newCollection.customer, uniqueCustomers]);

  const assigneeSuggestions = useMemo(() => {
    if (!newCollection.assignedTo.trim()) return [];
    return uniqueAssignees.filter((a) =>
      a.toLowerCase().includes(newCollection.assignedTo.toLowerCase())
    );
  }, [newCollection.assignedTo, uniqueAssignees]);

  // Auto-fetch customer type when customer is selected
  const handleCustomerChange = (customerName: string) => {
    setNewCollection({ ...newCollection, customer: customerName });

    // Find existing customer and auto-fill customer type
    const existingCustomer = collections.find(
      (c) => c.customer.toLowerCase() === customerName.toLowerCase()
    );
    if (existingCustomer && existingCustomer.customerType) {
      setNewCollection((prev) => ({
        ...prev,
        customer: customerName,
        customerType: existingCustomer.customerType,
      }));
    }
  };

  const filteredCollections = useMemo(() => {
    return collections.filter((col) => {
      const matchesSearch =
        col.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        col.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCustomerType =
        filters.customerType === "all" ||
        col.customerType === filters.customerType;
      const matchesStatus =
        filters.status === "all" || col.status === filters.status;
      const matchesAgingBracket =
        filters.agingBracket === "all" ||
        col.agingBracket === filters.agingBracket;
      const matchesPriority =
        filters.priority === "all" || col.priority === filters.priority;
      const matchesAssignedTo =
        filters.assignedTo === "all" || col.assignedTo === filters.assignedTo;
      return (
        matchesSearch &&
        matchesCustomerType &&
        matchesStatus &&
        matchesAgingBracket &&
        matchesPriority &&
        matchesAssignedTo
      );
    });
  }, [collections, searchTerm, filters]);

  const sortedCollections = useMemo(() => {
    const sorted = [...filteredCollections].sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];
      if (typeof aVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = (bVal as string).toLowerCase();
      }
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredCollections, sortField, sortOrder]);

  const metrics = useMemo(() => {
    const outstanding = collections.filter((c) => c.status !== "paid");
    const overdue = collections.filter((c) => c.status === "overdue");
    const partial = collections.filter((c) => c.status === "partial");
    return {
      totalOutstanding: outstanding.reduce(
        (sum, c) => sum + c.outstandingAmount,
        0
      ),
      totalOverdue: overdue.reduce((sum, c) => sum + c.outstandingAmount, 0),
      overdueCount: overdue.length,
      collectionRate:
        collections.length > 0
          ? (
              (collections.filter((c) => c.status === "paid").length /
                collections.length) *
              100
            ).toFixed(1)
          : 0,
      partialPayments: partial.length,
      avgDaysToPayment:
        collections.length > 0
          ? Math.round(
              collections.reduce((sum, c) => sum + c.daysOverdue, 0) /
                collections.length
            )
          : 0,
    };
  }, [collections]);

  const activeFilterCount = useMemo(() => {
    return Object.values(filters).filter((v) => v !== "all").length;
  }, [filters]);

  const handleRecordPayment = () => {
    if (!selectedCollection) {
      showNotification("error", "Please select a collection");
      return;
    }
    if (!paymentAmount.trim()) {
      showNotification("error", "Payment amount is required");
      return;
    }
    const amount = Number.parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) {
      showNotification("error", "Payment amount must be greater than zero");
      return;
    }
    const collection = collections.find((c) => c.id === selectedCollection);
    if (!collection) {
      showNotification("error", "Collection not found");
      return;
    }
    if (amount > collection.outstandingAmount) {
      showNotification(
        "error",
        `Payment amount cannot exceed outstanding amount (LKR ${collection.outstandingAmount.toLocaleString()})`
      );
      return;
    }

    const newOutstanding = Math.max(0, collection.outstandingAmount - amount);
    const newStatus = newOutstanding === 0 ? "paid" : "partial";

    setCollections(
      collections.map((col) =>
        col.id === selectedCollection
          ? {
              ...col,
              amountPaid: col.amountPaid + amount,
              outstandingAmount: newOutstanding,
              status: newStatus,
              paymentHistory: [
                ...col.paymentHistory,
                {
                  date: new Date().toISOString().split("T")[0],
                  amount,
                  method: paymentMethod,
                  receipt: `RCP-${Math.floor(Math.random() * 10000)}`,
                },
              ],
            }
          : col
      )
    );

    showNotification(
      "success",
      `Payment of LKR ${amount.toLocaleString()} recorded successfully`
    );
    setPaymentAmount("");
    setPaymentMethod("Cash");
    setSelectedCollection(null);
    setShowPaymentDialog(false);
  };

  const handleBulkPayment = () => {
    if (
      !bulkPaymentCustomer ||
      !selectedInvoicesForBulk.get(bulkPaymentCustomer)?.size
    ) {
      showNotification("error", "Please select at least one invoice");
      return;
    }
    if (!bulkPaymentAmount.trim()) {
      showNotification("error", "Payment amount is required");
      return;
    }
    const amount = Number.parseFloat(bulkPaymentAmount);
    if (isNaN(amount) || amount <= 0) {
      showNotification("error", "Payment amount must be greater than zero");
      return;
    }

    const selectedInvoices =
      selectedInvoicesForBulk.get(bulkPaymentCustomer) || new Set();
    const totalOutstanding = Array.from(selectedInvoices).reduce((sum, id) => {
      const col = collections.find((c) => c.id === id);
      return sum + (col?.outstandingAmount || 0);
    }, 0);

    if (amount > totalOutstanding) {
      showNotification(
        "error",
        `Payment amount cannot exceed total outstanding (LKR ${totalOutstanding.toLocaleString()})`
      );
      return;
    }

    let remainingAmount = amount;
    const updatedCollections = collections.map((col) => {
      if (selectedInvoices.has(col.id) && remainingAmount > 0) {
        const paymentForThisInvoice = Math.min(
          remainingAmount,
          col.outstandingAmount
        );
        remainingAmount -= paymentForThisInvoice;
        const newOutstanding = Math.max(
          0,
          col.outstandingAmount - paymentForThisInvoice
        );
        const newStatus = newOutstanding === 0 ? "paid" : "partial";

        return {
          ...col,
          amountPaid: col.amountPaid + paymentForThisInvoice,
          outstandingAmount: newOutstanding,
          status: newStatus,
          paymentHistory: [
            ...col.paymentHistory,
            {
              date: new Date().toISOString().split("T")[0],
              amount: paymentForThisInvoice,
              method: bulkPaymentMethod,
              receipt: `RCP-${Math.floor(Math.random() * 10000)}`,
            },
          ],
        };
      }
      return col;
    });

    setCollections(updatedCollections);
    showNotification(
      "success",
      `Bulk payment of LKR ${amount.toLocaleString()} recorded successfully across ${
        selectedInvoices.size
      } invoices`
    );
    setBulkPaymentAmount("");
    setBulkPaymentMethod("Cash");
    setSelectedInvoicesForBulk(new Map());
    setBulkPaymentCustomer(null);
    setShowBulkPaymentDialog(false);
  };

  const handleBulkCheckboxChange = (
    invoiceId: string,
    customerId: string,
    checked: boolean
  ) => {
    const newMap = new Map(selectedInvoicesForBulk);

    if (checked) {
      // If this is the first selection, set the customer
      if (newMap.size === 0) {
        setBulkPaymentCustomer(customerId);
        newMap.set(customerId, new Set([invoiceId]));
      }
      // If selecting from the same customer
      else if (newMap.has(customerId)) {
        const invoices = newMap.get(customerId) || new Set();
        invoices.add(invoiceId);
        newMap.set(customerId, invoices);
      }
      // If trying to select from a different customer
      else {
        showNotification(
          "error",
          "You can only select invoices from the same customer for bulk payment"
        );
        return;
      }
    } else {
      const invoices = newMap.get(customerId);
      if (invoices) {
        invoices.delete(invoiceId);
        if (invoices.size === 0) {
          newMap.delete(customerId);
          setBulkPaymentCustomer(null);
        } else {
          newMap.set(customerId, invoices);
        }
      }
    }

    setSelectedInvoicesForBulk(newMap);
  };

  const validateCollection = () => {
    if (!newCollection.customer.trim()) {
      showNotification("error", "Customer name is required");
      return false;
    }
    if (newCollection.customer.trim().length < 3) {
      showNotification("error", "Customer name must be at least 3 characters");
      return false;
    }
    if (!newCollection.customerType) {
      showNotification("error", "Customer type is required");
      return false;
    }
    if (!newCollection.invoiceAmount) {
      showNotification("error", "Invoice amount is required");
      return false;
    }
    const amount = Number.parseFloat(newCollection.invoiceAmount);
    if (isNaN(amount) || amount <= 0) {
      showNotification(
        "error",
        "Invoice amount must be a valid positive number"
      );
      return false;
    }
    if (!newCollection.dueDate) {
      showNotification("error", "Due date is required");
      return false;
    }
    const dueDate = new Date(newCollection.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (dueDate < today) {
      showNotification("error", "Due date cannot be in the past");
      return false;
    }
    if (!newCollection.assignedTo.trim()) {
      showNotification("error", "Assigned staff is required");
      return false;
    }
    if (newCollection.assignedTo.trim().length < 2) {
      showNotification("error", "Staff name must be at least 2 characters");
      return false;
    }
    return true;
  };

  const handleSubmitCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCollection()) return;

    if (editingId) {
      setCollections(
        collections.map((col) =>
          col.id === editingId
            ? {
                ...col,
                customer: newCollection.customer,
                customerType: newCollection.customerType,
                invoiceAmount: Number.parseFloat(newCollection.invoiceAmount),
                dueDate: format(newCollection.dueDate, "yyyy-MM-dd"),
                assignedTo: newCollection.assignedTo,
                priority: newCollection.priority as "high" | "medium" | "low",
              }
            : col
        )
      );
      showNotification(
        "success",
        `Collection ${editingId} updated successfully`
      );
    } else {
      const newId = `INV-${new Date().getFullYear()}-${String(
        collections.length + 1
      ).padStart(3, "0")}`;
      const invoiceDate = new Date().toISOString().split("T")[0];
      const collection = {
        id: newId,
        customer: newCollection.customer,
        customerType: newCollection.customerType,
        invoiceDate,
        dueDate: format(newCollection.dueDate, "yyyy-MM-dd"),
        invoiceAmount: Number.parseFloat(newCollection.invoiceAmount),
        amountPaid: 0,
        outstandingAmount: Number.parseFloat(newCollection.invoiceAmount),
        daysOverdue: 0,
        agingBracket: "0-30",
        status: "pending" as const,
        assignedTo: newCollection.assignedTo,
        priority: newCollection.priority as "high" | "medium" | "low",
        lastContactDate: invoiceDate,
        nextFollowUpDate: new Date(
          new Date().getTime() + 7 * 24 * 60 * 60 * 1000
        )
          .toISOString()
          .split("T")[0],
        paymentTerms: "Net 30",
        creditLimit: 200000,
        paymentHistory: [],
      };
      setCollections([collection, ...collections]);
      showNotification("success", `Collection ${newId} created successfully`);
    }

    resetForm();
    setShowNewCollectionDialog(false);
    setShowEditDialog(false);
  };

  const handleEdit = (collection: (typeof collections)[0]) => {
    setEditingId(collection.id);
    setNewCollection({
      customer: collection.customer,
      customerType: collection.customerType,
      invoiceAmount: collection.invoiceAmount.toString(),
      dueDate: new Date(collection.dueDate),
      assignedTo: collection.assignedTo,
      priority: collection.priority,
    });
    setShowEditDialog(true);
  };

  const handleDelete = (id: string) => {
    setCollections(collections.filter((c) => c.id !== id));
    setDeleteConfirmId(null);
    showNotification("success", `Collection ${id} deleted successfully`);
  };

  const resetFilters = () => {
    setFilters({
      customerType: "all",
      status: "all",
      agingBracket: "all",
      priority: "all",
      assignedTo: "all",
    });
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const downloadReport = () => {
    if (downloadFormat === "excel") {
      downloadExcel();
    } else {
      downloadPdf();
    }
  };

  const downloadExcel = () => {
    const headers = [
      "Invoice ID",
      "Customer",
      "Type",
      "Outstanding",
      "Due Date",
      "Status",
      "Assigned To",
    ];
    const rows = sortedCollections.map((col) => [
      col.id,
      col.customer,
      col.customerType,
      col.outstandingAmount,
      col.dueDate,
      col.status,
      col.assignedTo,
    ]);
    const csvContent = [
      ["COLLECTION MANAGEMENT REPORT"],
      [`Generated: ${new Date().toLocaleDateString()}`],
      [],
      ["SUMMARY"],
      ["Total Outstanding", `LKR ${metrics.totalOutstanding.toLocaleString()}`],
      ["Total Overdue", `LKR ${metrics.totalOverdue.toLocaleString()}`],
      ["Collection Rate", `${metrics.collectionRate}%`],
      ["Overdue Invoices", metrics.overdueCount],
      [],
      [headers.join(",")],
      ...rows.map((row) => row.join(",")),
    ]
      .map((row) => (Array.isArray(row) ? row.join(",") : row))
      .join("\n");
    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/csv;charset=utf-8," + encodeURIComponent(csvContent)
    );
    element.setAttribute(
      "download",
      `collection-report-${new Date().toISOString().split("T")[0]}.csv`
    );
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    setShowPdfPreview(false);
  };

  const downloadPdf = () => {
    const content = `
COLLECTION MANAGEMENT REPORT
Generated: ${new Date().toLocaleDateString()}

SUMMARY
Total Outstanding: LKR ${metrics.totalOutstanding.toLocaleString()}
Total Overdue: LKR ${metrics.totalOverdue.toLocaleString()}
Collection Rate: ${metrics.collectionRate}%
Overdue Invoices: ${metrics.overdueCount}

OUTSTANDING COLLECTIONS
${sortedCollections
  .map(
    (col) => `
Invoice: ${col.id}
Customer: ${col.customer}
Amount: LKR ${col.outstandingAmount.toLocaleString()}
Due Date: ${col.dueDate}
Status: ${col.status}
Assigned To: ${col.assignedTo}
---`
  )
  .join("\n")}
    `;
    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(content)
    );
    element.setAttribute(
      "download",
      `collection-report-${new Date().toISOString().split("T")[0]}.txt`
    );
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    setShowPdfPreview(false);
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortOrder === "asc" ? "↑" : "↓";
  };

  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertCircle className="h-5 w-5" />
              Access Denied
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              You do not have permission to access the Collection Management
              module. This page is restricted to Administrators, Pharmacists,
              and Managers only.
            </p>
            <p className="text-xs text-muted-foreground">
              If you believe this is an error, please contact your system
              administrator.
            </p>
            <Button
              onClick={() => (window.location.href = "/dashboard")}
              className="w-full"
            >
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Global Notification Toast */}
      {notification && (
        <div
          role="alert"
          aria-live="assertive"
          className={`fixed top-4 right-4 w-auto min-w-[300px] max-w-md z-[9999] shadow-2xl rounded-lg overflow-hidden animate-in slide-in-from-right-5 fade-in duration-300 ${
            notification.type === "success"
              ? "bg-green-500 dark:bg-green-600"
              : "bg-red-500 dark:bg-red-600"
          }`}
        >
          <div className="flex items-start gap-3 p-4">
            <div className="flex-shrink-0 rounded-full bg-white/20 p-1.5">
              {notification.type === "success" ? (
                <CheckCircle2 className="h-5 w-5 text-white" />
              ) : (
                <AlertCircle className="h-5 w-5 text-white" />
              )}
            </div>
            <div className="flex-1 pt-0.5">
              <p className="text-sm font-semibold text-white">
                {notification.type === "success" ? "Success" : "Error"}
              </p>
              <p className="text-sm text-white/90 mt-0.5">
                {notification.message}
              </p>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="flex-shrink-0 rounded-md p-1 hover:bg-white/20 transition-colors text-white"
              aria-label="Dismiss notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Collection Management
          </h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            Track payments and receivables
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => setShowPdfPreview(true)}
            className="w-full sm:w-auto"
          >
            <Download className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
          <Dialog
            open={showNewCollectionDialog}
            onOpenChange={(open) => {
              setShowNewCollectionDialog(open);
              if (!open) resetForm();
            }}
          >
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                New Collection
              </Button>
            </DialogTrigger>
            <DialogContent className="w-full max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Collection</DialogTitle>
              </DialogHeader>
              <form
                onSubmit={handleSubmitCollection}
                className="space-y-4 py-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="customer">
                    Customer Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="customer"
                    placeholder="Enter customer name"
                    value={newCollection.customer}
                    onChange={(e) => handleCustomerChange(e.target.value)}
                    list="customer-suggestions"
                  />
                  {customerSuggestions.length > 0 && (
                    <datalist id="customer-suggestions">
                      {customerSuggestions.map((customer) => (
                        <option key={customer} value={customer} />
                      ))}
                    </datalist>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerType">
                    Customer Type <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={newCollection.customerType}
                    onValueChange={(value) =>
                      setNewCollection({
                        ...newCollection,
                        customerType: value,
                      })
                    }
                  >
                    <SelectTrigger id="customerType">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Hospital">Hospital</SelectItem>
                      <SelectItem value="Clinic">Clinic</SelectItem>
                      <SelectItem value="Pharmacy">Pharmacy</SelectItem>
                      <SelectItem value="Distributor">Distributor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invoiceAmount">
                    Invoice Amount (LKR) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="invoiceAmount"
                    type="number"
                    placeholder="Enter amount"
                    value={newCollection.invoiceAmount}
                    onChange={(e) =>
                      setNewCollection({
                        ...newCollection,
                        invoiceAmount: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dueDate">
                    Due Date <span className="text-red-500">*</span>
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal bg-transparent"
                        id="dueDate"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {newCollection.dueDate
                          ? format(newCollection.dueDate, "PPP")
                          : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={newCollection.dueDate}
                        onSelect={(date) =>
                          setNewCollection({
                            ...newCollection,
                            dueDate: date || new Date(),
                          })
                        }
                        disabled={(date) => {
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          return date < today;
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assignedTo">
                    Assigned To <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="assignedTo"
                    placeholder="Enter staff name"
                    value={newCollection.assignedTo}
                    onChange={(e) =>
                      setNewCollection({
                        ...newCollection,
                        assignedTo: e.target.value,
                      })
                    }
                    list="assignee-suggestions"
                  />
                  {assigneeSuggestions.length > 0 && (
                    <datalist id="assignee-suggestions">
                      {assigneeSuggestions.map((assignee) => (
                        <option key={assignee} value={assignee} />
                      ))}
                    </datalist>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={newCollection.priority}
                    onValueChange={(value) =>
                      setNewCollection({ ...newCollection, priority: value })
                    }
                  >
                    <SelectTrigger id="priority">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    Create Collection
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowNewCollectionDialog(false);
                      resetForm();
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
              Total Outstanding
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-foreground">
              LKR {metrics.totalOutstanding.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {filteredCollections.filter((c) => c.status !== "paid").length}{" "}
              invoices
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
              Overdue Amount
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-red-600 dark:text-red-400">
              LKR {metrics.totalOverdue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {metrics.overdueCount} overdue invoices
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
              Collection Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-green-600 dark:text-green-400">
              {metrics.collectionRate}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {collections.filter((c) => c.status === "paid").length} paid
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
              Partial Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400">
              {metrics.partialPayments}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Awaiting completion
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Outstanding Collections Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle className="text-lg md:text-xl">
                Outstanding Collections
              </CardTitle>
              <div className="relative flex-1 sm:flex-none sm:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by ID or customer..."
                  className="pl-8 text-sm h-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Fixed Filters - Full Width & Responsive */}
            <div className="flex flex-col gap-3 border-t pt-4">
              <div className="flex flex-col sm:flex-row flex-wrap gap-2 w-full">
                {/* Customer Type Filter */}
                <div className="flex-1 min-w-[160px]">
                  <Select
                    value={filters.customerType}
                    onValueChange={(value) =>
                      setFilters({ ...filters, customerType: value })
                    }
                  >
                    <SelectTrigger className="h-10 text-xs w-full">
                      <SelectValue placeholder="Customer Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {uniqueCustomerTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Status Filter */}
                <div className="flex-1 min-w-[160px]">
                  <Select
                    value={filters.status}
                    onValueChange={(value) =>
                      setFilters({ ...filters, status: value })
                    }
                  >
                    <SelectTrigger className="h-10 text-xs w-full">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                      <SelectItem value="partial">Partial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Aging Bracket Filter */}
                <div className="flex-1 min-w-[160px]">
                  <Select
                    value={filters.agingBracket}
                    onValueChange={(value) =>
                      setFilters({ ...filters, agingBracket: value })
                    }
                  >
                    <SelectTrigger className="h-10 text-xs w-full">
                      <SelectValue placeholder="Aging Period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Aging</SelectItem>
                      <SelectItem value="0-30">0-30 Days</SelectItem>
                      <SelectItem value="31-60">31-60 Days</SelectItem>
                      <SelectItem value="61-90">61-90 Days</SelectItem>
                      <SelectItem value="90+">90+ Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Priority Filter */}
                <div className="flex-1 min-w-[160px]">
                  <Select
                    value={filters.priority}
                    onValueChange={(value) =>
                      setFilters({ ...filters, priority: value })
                    }
                  >
                    <SelectTrigger className="h-10 text-xs w-full">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priorities</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Assigned To Filter */}
                <div className="flex-1 min-w-[160px]">
                  <Select
                    value={filters.assignedTo}
                    onValueChange={(value) =>
                      setFilters({ ...filters, assignedTo: value })
                    }
                  >
                    <SelectTrigger className="h-10 text-xs w-full">
                      <SelectValue placeholder="Assigned To" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Assignees</SelectItem>
                      {uniqueAssignees.map((assignee) => (
                        <SelectItem key={assignee} value={assignee}>
                          {assignee}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Active Filter Tags */}
              {activeFilterCount > 0 && (
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-xs text-muted-foreground font-medium">
                    Active filters:
                  </span>
                  {Object.entries(filters).map(([key, value]) => {
                    if (value !== "all") {
                      return (
                        <Badge
                          key={key}
                          variant="secondary"
                          className="text-xs px-2 py-1"
                        >
                          {key === "customerType" && "Type"}
                          {key === "status" && "Status"}
                          {key === "agingBracket" && "Aging"}
                          {key === "priority" && "Priority"}
                          {key === "assignedTo" && "Assignee"}: {value}
                          <button
                            onClick={() =>
                              setFilters({ ...filters, [key]: "all" })
                            }
                            className="ml-1 hover:text-destructive transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      );
                    }
                    return null;
                  })}
                  <Button
                    variant="link"
                    size="sm"
                    onClick={resetFilters}
                    className="h-6 text-xs text-muted-foreground hover:text-foreground"
                  >
                    Reset Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs md:text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-2 md:px-4 font-medium text-muted-foreground w-8">
                    <Checkbox
                      checked={
                        sortedCollections.length > 0 &&
                        sortedCollections.filter((c) => c.status !== "paid")
                          .length > 0 &&
                        bulkPaymentCustomer !== null &&
                        sortedCollections
                          .filter(
                            (c) =>
                              c.customer === bulkPaymentCustomer &&
                              c.status !== "paid"
                          )
                          .every((c) =>
                            selectedInvoicesForBulk.get(c.customer)?.has(c.id)
                          )
                      }
                      onCheckedChange={(checked) => {
                        if (checked) {
                          // Select all unpaid invoices from the first customer
                          const firstUnpaidCustomer = sortedCollections.find(
                            (c) => c.status !== "paid"
                          )?.customer;
                          if (firstUnpaidCustomer) {
                            const invoices = new Set(
                              sortedCollections
                                .filter(
                                  (c) =>
                                    c.customer === firstUnpaidCustomer &&
                                    c.status !== "paid"
                                )
                                .map((c) => c.id)
                            );
                            const newMap = new Map();
                            newMap.set(firstUnpaidCustomer, invoices);
                            setSelectedInvoicesForBulk(newMap);
                            setBulkPaymentCustomer(firstUnpaidCustomer);
                          }
                        } else {
                          setSelectedInvoicesForBulk(new Map());
                          setBulkPaymentCustomer(null);
                        }
                      }}
                    />
                  </th>
                  <th
                    className="text-left py-3 px-2 md:px-4 font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                    onClick={() => handleSort("id")}
                  >
                    <div className="flex items-center gap-1">
                      <span className="hidden sm:inline">Invoice ID</span>
                      <span className="sm:hidden">ID</span>
                      <span className="text-xs font-bold">
                        {getSortIcon("id")}
                      </span>
                    </div>
                  </th>
                  <th
                    className="text-left py-3 px-2 md:px-4 font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                    onClick={() => handleSort("customer")}
                  >
                    <div className="flex items-center gap-1">
                      Customer
                      <span className="text-xs font-bold">
                        {getSortIcon("customer")}
                      </span>
                    </div>
                  </th>
                  <th className="text-left py-3 px-2 md:px-4 font-medium text-muted-foreground hidden sm:table-cell">
                    Type
                  </th>
                  <th
                    className="text-right py-3 px-2 md:px-4 font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                    onClick={() => handleSort("outstandingAmount")}
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span className="hidden sm:inline">Outstanding</span>
                      <span className="sm:hidden">Amt</span>
                      <span className="text-xs font-bold">
                        {getSortIcon("outstandingAmount")}
                      </span>
                    </div>
                  </th>
                  <th
                    className="text-left py-3 px-2 md:px-4 font-medium text-muted-foreground hidden md:table-cell cursor-pointer hover:text-foreground transition-colors"
                    onClick={() => handleSort("dueDate")}
                  >
                    <div className="flex items-center gap-1">
                      Due Date
                      <span className="text-xs font-bold">
                        {getSortIcon("dueDate")}
                      </span>
                    </div>
                  </th>
                  <th className="text-left py-3 px-2 md:px-4 font-medium text-muted-foreground hidden lg:table-cell">
                    Aging
                  </th>
                  <th className="text-left py-3 px-2 md:px-4 font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="text-left py-3 px-2 md:px-4 font-medium text-muted-foreground hidden xl:table-cell">
                    Priority
                  </th>
                  <th
                    className="text-left py-3 px-2 md:px-4 font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors hidden lg:table-cell"
                    onClick={() => handleSort("assignedTo")}
                  >
                    <div className="flex items-center gap-1">
                      Assigned To
                      <span className="text-xs font-bold">
                        {getSortIcon("assignedTo")}
                      </span>
                    </div>
                  </th>
                  <th className="text-left py-3 px-2 md:px-4 font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedCollections.length > 0 ? (
                  sortedCollections.map((collection) => {
                    const statusConfig_ =
                      statusConfig[
                        collection.status as keyof typeof statusConfig
                      ];
                    const isSelected =
                      selectedInvoicesForBulk
                        .get(collection.customer)
                        ?.has(collection.id) || false;
                    const canSelect =
                      collection.status !== "paid" &&
                      (selectedInvoicesForBulk.size === 0 ||
                        bulkPaymentCustomer === collection.customer);

                    return (
                      <tr
                        key={collection.id}
                        className={`border-b border-border last:border-0 hover:bg-muted/50 transition-colors ${
                          isSelected ? "bg-blue-50 dark:bg-blue-950/20" : ""
                        }`}
                      >
                        <td className="py-3 px-2 md:px-4">
                          {canSelect && (
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={(checked) => {
                                handleBulkCheckboxChange(
                                  collection.id,
                                  collection.customer,
                                  !!checked
                                );
                              }}
                            />
                          )}
                        </td>
                        <td className="py-3 px-2 md:px-4 font-medium text-foreground text-xs md:text-sm">
                          {collection.id}
                        </td>
                        <td className="py-3 px-2 md:px-4 text-foreground text-xs md:text-sm">
                          {collection.customer}
                        </td>
                        <td className="py-3 px-2 md:px-4 text-foreground text-xs hidden sm:table-cell">
                          {collection.customerType}
                        </td>
                        <td className="py-3 px-2 md:px-4 text-right font-medium text-foreground text-xs md:text-sm">
                          LKR {collection.outstandingAmount.toLocaleString()}
                        </td>
                        <td className="py-3 px-2 md:px-4 text-foreground text-xs hidden md:table-cell">
                          {collection.dueDate}
                        </td>
                        <td className="py-3 px-2 md:px-4 hidden lg:table-cell">
                          <Badge variant="outline" className="text-xs">
                            {collection.agingBracket}d
                          </Badge>
                        </td>
                        <td className="py-3 px-2 md:px-4">
                          <Badge
                            className={`${statusConfig_.color} ${statusConfig_.text} text-xs`}
                          >
                            {statusConfig_.label}
                          </Badge>
                        </td>
                        <td className="py-3 px-2 md:px-4 hidden xl:table-cell">
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              collection.priority === "high"
                                ? "border-red-300 text-red-700 dark:border-red-700 dark:text-red-400"
                                : collection.priority === "medium"
                                ? "border-yellow-300 text-yellow-700 dark:border-yellow-700 dark:text-yellow-400"
                                : "border-green-300 text-green-700 dark:border-green-700 dark:text-green-400"
                            }`}
                          >
                            {collection.priority}
                          </Badge>
                        </td>
                        <td className="py-3 px-2 md:px-4 text-sm text-foreground hidden lg:table-cell">
                          {collection.assignedTo}
                        </td>
                        <td className="py-3 px-2 md:px-4">
                          <div className="flex gap-1">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  title="View invoice details"
                                  className="h-8 w-8 p-0"
                                >
                                  <Eye className="h-3 w-3 md:h-4 md:w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle className="text-lg md:text-xl">
                                    Invoice Details - {collection.id}
                                  </DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                                    <div>
                                      <p className="text-xs md:text-sm text-muted-foreground">
                                        Customer
                                      </p>
                                      <p className="font-medium text-sm md:text-base">
                                        {collection.customer}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-xs md:text-sm text-muted-foreground">
                                        Customer Type
                                      </p>
                                      <p className="font-medium text-sm md:text-base">
                                        {collection.customerType}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-xs md:text-sm text-muted-foreground">
                                        Invoice Date
                                      </p>
                                      <p className="font-medium text-sm md:text-base">
                                        {collection.invoiceDate}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-xs md:text-sm text-muted-foreground">
                                        Due Date
                                      </p>
                                      <p className="font-medium text-sm md:text-base">
                                        {collection.dueDate}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-xs md:text-sm text-muted-foreground">
                                        Invoice Amount
                                      </p>
                                      <p className="font-medium text-sm md:text-base">
                                        LKR{" "}
                                        {collection.invoiceAmount.toLocaleString()}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-xs md:text-sm text-muted-foreground">
                                        Amount Paid
                                      </p>
                                      <p className="font-medium text-sm md:text-base">
                                        LKR{" "}
                                        {collection.amountPaid.toLocaleString()}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-xs md:text-sm text-muted-foreground">
                                        Outstanding
                                      </p>
                                      <p className="font-medium text-sm md:text-base text-red-600 dark:text-red-400">
                                        LKR{" "}
                                        {collection.outstandingAmount.toLocaleString()}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-xs md:text-sm text-muted-foreground">
                                        Credit Limit
                                      </p>
                                      <p className="font-medium text-sm md:text-base">
                                        LKR{" "}
                                        {collection.creditLimit.toLocaleString()}
                                      </p>
                                    </div>
                                  </div>
                                  {collection.paymentHistory.length > 0 && (
                                    <div className="border-t pt-4">
                                      <h4 className="font-medium mb-3 text-sm md:text-base">
                                        Payment History
                                      </h4>
                                      <div className="space-y-2">
                                        {collection.paymentHistory.map(
                                          (payment, idx) => (
                                            <div
                                              key={idx}
                                              className="p-3 border rounded text-xs md:text-sm"
                                            >
                                              <div className="flex justify-between">
                                                <span className="font-medium">
                                                  {payment.date}
                                                </span>
                                                <span className="font-medium">
                                                  LKR{" "}
                                                  {payment.amount.toLocaleString()}
                                                </span>
                                              </div>
                                              <div className="text-muted-foreground text-xs mt-1">
                                                Method: {payment.method} |
                                                Receipt: {payment.receipt}
                                              </div>
                                            </div>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  )}
                                  <div className="border-t">
                                    {collection.outstandingAmount > 0 && (
                                      <Button
                                        size="sm"
                                        onClick={() => {
                                          setSelectedCollection(collection.id);
                                          setShowPaymentDialog(true);
                                        }}
                                        className="h-8 text-xs md:text-sm px-2 md:px-3 w-full mt-4"
                                      >
                                        Record Payment
                                      </Button>
                                    )}
                                    <div className="pt-4 flex flex-col sm:flex-row gap-2">
                                      <Button
                                        variant="outline"
                                        className="flex-1 text-xs md:text-sm bg-transparent"
                                        onClick={() => {
                                          const content = `
INVOICE DETAILS
Invoice ID: ${collection.id}
Customer: ${collection.customer}
Customer Type: ${collection.customerType}

DATES
Invoice Date: ${collection.invoiceDate}
Due Date: ${collection.dueDate}

AMOUNTS
Invoice Amount: LKR ${collection.invoiceAmount.toLocaleString()}
Amount Paid: LKR ${collection.amountPaid.toLocaleString()}
Outstanding: LKR ${collection.outstandingAmount.toLocaleString()}
Credit Limit: LKR ${collection.creditLimit.toLocaleString()}

PAYMENT HISTORY
${
  collection.paymentHistory.length > 0
    ? collection.paymentHistory
        .map(
          (p) =>
            `Date: ${
              p.date
            } | Amount: LKR ${p.amount.toLocaleString()} | Method: ${
              p.method
            } | Receipt: ${p.receipt}`
        )
        .join("\n")
    : "No payments recorded"
}
                                        `;
                                          const element =
                                            document.createElement("a");
                                          element.setAttribute(
                                            "href",
                                            "data:text/plain;charset=utf-8," +
                                              encodeURIComponent(content)
                                          );
                                          element.setAttribute(
                                            "download",
                                            `invoice-${collection.id}.txt`
                                          );
                                          element.style.display = "none";
                                          document.body.appendChild(element);
                                          element.click();
                                          document.body.removeChild(element);
                                        }}
                                      >
                                        <FileText className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                                        Download Invoice
                                      </Button>
                                      {collection.outstandingAmount > 0 && (
                                        <>
                                          <Button
                                            variant="outline"
                                            className="flex-1 text-xs md:text-sm bg-transparent"
                                            onClick={() => {
                                              handleEdit(collection);
                                            }}
                                          >
                                            <Edit className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                                            Edit
                                          </Button>
                                          <Dialog
                                            open={
                                              deleteConfirmId === collection.id
                                            }
                                            onOpenChange={(open) => {
                                              if (!open)
                                                setDeleteConfirmId(null);
                                            }}
                                          >
                                            <DialogTrigger asChild>
                                              <Button
                                                variant="outline"
                                                className="flex-1 text-xs md:text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 bg-transparent"
                                                onClick={() =>
                                                  setDeleteConfirmId(
                                                    collection.id
                                                  )
                                                }
                                              >
                                                <Trash2 className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                                                Delete
                                              </Button>
                                            </DialogTrigger>
                                            <DialogContent className="w-full max-w-sm">
                                              <DialogHeader>
                                                <DialogTitle>
                                                  Delete Collection
                                                </DialogTitle>
                                              </DialogHeader>
                                              <p className="text-sm text-muted-foreground py-4">
                                                Are you sure you want to delete
                                                collection {collection.id}? This
                                                action cannot be undone.
                                              </p>
                                              <div className="flex gap-2 justify-end">
                                                <Button
                                                  variant="outline"
                                                  onClick={() =>
                                                    setDeleteConfirmId(null)
                                                  }
                                                  className="text-xs md:text-sm"
                                                >
                                                  Cancel
                                                </Button>
                                                <Button
                                                  variant="destructive"
                                                  onClick={() =>
                                                    handleDelete(collection.id)
                                                  }
                                                  className="text-xs md:text-sm"
                                                >
                                                  Delete
                                                </Button>
                                              </div>
                                            </DialogContent>
                                          </Dialog>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            {collection.outstandingAmount > 0 && (
                              <Dialog
                                open={
                                  showPaymentDialog &&
                                  selectedCollection === collection.id
                                }
                                onOpenChange={(open) => {
                                  setShowPaymentDialog(open);
                                  if (!open) {
                                    setPaymentAmount("");
                                    setPaymentMethod("Cash");
                                    setSelectedCollection(null);
                                  }
                                }}
                              >
                                <DialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    onClick={() => {
                                      setSelectedCollection(collection.id);
                                      setShowPaymentDialog(true);
                                    }}
                                    className="h-8 text-xs md:text-sm px-2 md:px-3"
                                  >
                                    Record Payment
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="w-full max-w-md">
                                  <DialogHeader>
                                    <DialogTitle>Record Payment</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                      <Label className="text-xs md:text-sm">
                                        Invoice ID
                                      </Label>
                                      <Input
                                        value={collection.id}
                                        disabled
                                        className="text-xs md:text-sm"
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label className="text-xs md:text-sm">
                                        Customer
                                      </Label>
                                      <Input
                                        value={collection.customer}
                                        disabled
                                        className="text-xs md:text-sm"
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label className="text-xs md:text-sm">
                                        Outstanding Amount (LKR)
                                      </Label>
                                      <Input
                                        value={collection.outstandingAmount.toLocaleString()}
                                        disabled
                                        className="text-xs md:text-sm"
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label
                                        htmlFor="payment-amount"
                                        className="text-xs md:text-sm"
                                      >
                                        Payment Amount (LKR){" "}
                                        <span className="text-red-500">*</span>
                                      </Label>
                                      <Input
                                        id="payment-amount"
                                        type="number"
                                        placeholder="Enter payment amount"
                                        value={paymentAmount}
                                        onChange={(e) =>
                                          setPaymentAmount(e.target.value)
                                        }
                                        className="text-xs md:text-sm"
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label
                                        htmlFor="payment-method"
                                        className="text-xs md:text-sm"
                                      >
                                        Payment Method
                                      </Label>
                                      <Select
                                        value={paymentMethod}
                                        onValueChange={setPaymentMethod}
                                      >
                                        <SelectTrigger
                                          id="payment-method"
                                          className="text-xs md:text-sm"
                                        >
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="Cash">
                                            Cash
                                          </SelectItem>
                                          <SelectItem value="Check">
                                            Check
                                          </SelectItem>
                                          <SelectItem value="Bank Transfer">
                                            Bank Transfer
                                          </SelectItem>
                                          <SelectItem value="Card">
                                            Card
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="flex gap-2 pt-4">
                                      <Button
                                        onClick={handleRecordPayment}
                                        className="flex-1 text-xs md:text-sm"
                                      >
                                        Confirm Payment
                                      </Button>
                                      <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                          setShowPaymentDialog(false);
                                          setPaymentAmount("");
                                          setPaymentMethod("Cash");
                                          setSelectedCollection(null);
                                        }}
                                        className="flex-1 text-xs md:text-sm"
                                      >
                                        Cancel
                                      </Button>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={11} className="py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <AlertCircle className="h-8 w-8 text-muted-foreground" />
                        <p className="text-muted-foreground text-sm">
                          No collections found matching your filters
                        </p>
                        {activeFilterCount > 0 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={resetFilters}
                            className="mt-2 bg-transparent"
                          >
                            Clear Filters
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Bulk Payment Footer */}
          {selectedInvoicesForBulk.size > 0 && bulkPaymentCustomer && (
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    {
                      Array.from(
                        selectedInvoicesForBulk.get(bulkPaymentCustomer) ||
                          new Set()
                      ).length
                    }{" "}
                    invoice(s) selected
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                    Customer: <strong>{bulkPaymentCustomer}</strong> | Total
                    Outstanding: LKR{" "}
                    {Array.from(
                      (selectedInvoicesForBulk.get(
                        bulkPaymentCustomer
                      ) as Set<string>) || new Set()
                    )
                      .reduce((sum, id) => {
                        const col = collections.find((c) => c.id === id);
                        return sum + (col?.outstandingAmount || 0);
                      }, 0)
                      .toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Dialog
                    open={showBulkPaymentDialog}
                    onOpenChange={(open) => {
                      setShowBulkPaymentDialog(open);
                      if (!open) {
                        setBulkPaymentAmount("");
                        setBulkPaymentMethod("Cash");
                      }
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        className="flex-1 sm:flex-none text-xs md:text-sm"
                      >
                        Record Bulk Payment
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="w-full max-w-md max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Record Bulk Payment</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label className="text-xs md:text-sm font-medium">
                            Customer
                          </Label>
                          <Input
                            value={bulkPaymentCustomer || ""}
                            disabled
                            className="text-xs md:text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs md:text-sm font-medium">
                            Selected Invoices
                          </Label>
                          <div className="border rounded-lg p-3 space-y-2 max-h-48 overflow-y-auto bg-muted/30">
                            {sortedCollections
                              .filter(
                                (c) =>
                                  c.customer === bulkPaymentCustomer &&
                                  selectedInvoicesForBulk
                                    .get(bulkPaymentCustomer)
                                    ?.has(c.id)
                              )
                              .map((col) => (
                                <div
                                  key={col.id}
                                  className="flex items-center justify-between text-xs md:text-sm p-2 bg-background rounded"
                                >
                                  <span className="font-medium">{col.id}</span>
                                  <span>
                                    LKR {col.outstandingAmount.toLocaleString()}
                                  </span>
                                </div>
                              ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs md:text-sm">
                            Total Outstanding (Selected)
                          </Label>
                          <Input
                            value={`LKR ${Array.from(
                              (selectedInvoicesForBulk.get(
                                bulkPaymentCustomer
                              ) as Set<string>) || new Set()
                            )
                              .reduce((sum, id) => {
                                const col = collections.find(
                                  (c) => c.id === id
                                );
                                return sum + (col?.outstandingAmount || 0);
                              }, 0)
                              .toLocaleString()}`}
                            disabled
                            className="text-xs md:text-sm font-medium"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="bulk-payment-amount"
                            className="text-xs md:text-sm"
                          >
                            Payment Amount (LKR){" "}
                            <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="bulk-payment-amount"
                            type="number"
                            placeholder="Enter payment amount"
                            value={bulkPaymentAmount}
                            onChange={(e) =>
                              setBulkPaymentAmount(e.target.value)
                            }
                            className="text-xs md:text-sm"
                          />
                          <p className="text-xs text-muted-foreground">
                            Payment will be distributed across selected invoices
                          </p>
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="bulk-payment-method"
                            className="text-xs md:text-sm"
                          >
                            Payment Method
                          </Label>
                          <Select
                            value={bulkPaymentMethod}
                            onValueChange={setBulkPaymentMethod}
                          >
                            <SelectTrigger
                              id="bulk-payment-method"
                              className="text-xs md:text-sm"
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Cash">Cash</SelectItem>
                              <SelectItem value="Check">Check</SelectItem>
                              <SelectItem value="Bank Transfer">
                                Bank Transfer
                              </SelectItem>
                              <SelectItem value="Card">Card</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex gap-2 pt-4">
                          <Button
                            onClick={handleBulkPayment}
                            className="flex-1 text-xs md:text-sm"
                          >
                            Confirm Bulk Payment
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setShowBulkPaymentDialog(false);
                              setBulkPaymentAmount("");
                              setBulkPaymentMethod("Cash");
                            }}
                            className="flex-1 text-xs md:text-sm"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedInvoicesForBulk(new Map());
                      setBulkPaymentCustomer(null);
                    }}
                    className="flex-1 sm:flex-none text-xs md:text-sm"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Clear Selection
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog
        open={showEditDialog}
        onOpenChange={(open) => {
          setShowEditDialog(open);
          if (!open) resetForm();
        }}
      >
        <DialogContent className="w-full max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Collection</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitCollection} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-customer">
                Customer Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-customer"
                placeholder="Enter customer name"
                value={newCollection.customer}
                onChange={(e) => handleCustomerChange(e.target.value)}
                list="edit-customer-suggestions"
              />
              {customerSuggestions.length > 0 && (
                <datalist id="edit-customer-suggestions">
                  {customerSuggestions.map((customer) => (
                    <option key={customer} value={customer} />
                  ))}
                </datalist>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-customerType">
                Customer Type <span className="text-red-500">*</span>
              </Label>
              <Select
                value={newCollection.customerType}
                onValueChange={(value) =>
                  setNewCollection({ ...newCollection, customerType: value })
                }
              >
                <SelectTrigger id="edit-customerType">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Hospital">Hospital</SelectItem>
                  <SelectItem value="Clinic">Clinic</SelectItem>
                  <SelectItem value="Pharmacy">Pharmacy</SelectItem>
                  <SelectItem value="Distributor">Distributor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-invoiceAmount">
                Invoice Amount (LKR) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-invoiceAmount"
                type="number"
                placeholder="Enter amount"
                value={newCollection.invoiceAmount}
                onChange={(e) =>
                  setNewCollection({
                    ...newCollection,
                    invoiceAmount: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-dueDate">
                Due Date <span className="text-red-500">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal bg-transparent"
                    id="edit-dueDate"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {newCollection.dueDate
                      ? format(newCollection.dueDate, "PPP")
                      : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={newCollection.dueDate}
                    onSelect={(date) =>
                      setNewCollection({
                        ...newCollection,
                        dueDate: date || new Date(),
                      })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-assignedTo">
                Assigned To <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-assignedTo"
                placeholder="Enter staff name"
                value={newCollection.assignedTo}
                onChange={(e) =>
                  setNewCollection({
                    ...newCollection,
                    assignedTo: e.target.value,
                  })
                }
                list="edit-assignee-suggestions"
              />
              {assigneeSuggestions.length > 0 && (
                <datalist id="edit-assignee-suggestions">
                  {assigneeSuggestions.map((assignee) => (
                    <option key={assignee} value={assignee} />
                  ))}
                </datalist>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-priority">Priority</Label>
              <Select
                value={newCollection.priority}
                onValueChange={(value) =>
                  setNewCollection({ ...newCollection, priority: value })
                }
              >
                <SelectTrigger id="edit-priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 pt-4">
              <Button type="submit" className="flex-1">
                Update Collection
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowEditDialog(false);
                  resetForm();
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Report Preview Dialog */}
      <Dialog open={showPdfPreview} onOpenChange={setShowPdfPreview}>
        <DialogContent className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg md:text-xl">
              Collection Report Preview
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4 bg-white dark:bg-slate-950 p-4 md:p-6 rounded border">
            <div className="text-center border-b pb-4">
              <h2 className="text-xl md:text-2xl font-bold">
                COLLECTION MANAGEMENT REPORT
              </h2>
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                Generated: {new Date().toLocaleDateString()}
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-base md:text-lg">SUMMARY</h3>
              <div className="grid grid-cols-2 gap-4 text-xs md:text-sm">
                <div>
                  <p className="text-gray-600 dark:text-gray-400">
                    Total Outstanding
                  </p>
                  <p className="font-bold">
                    LKR {metrics.totalOutstanding.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">
                    Total Overdue
                  </p>
                  <p className="font-bold text-red-600">
                    LKR {metrics.totalOverdue.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">
                    Collection Rate
                  </p>
                  <p className="font-bold text-green-600">
                    {metrics.collectionRate}%
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">
                    Overdue Invoices
                  </p>
                  <p className="font-bold">{metrics.overdueCount}</p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-base md:text-lg">
                OUTSTANDING COLLECTIONS
              </h3>
              <div className="space-y-2 text-xs md:text-sm max-h-96 overflow-y-auto">
                {sortedCollections.slice(0, 20).map((col) => (
                  <div key={col.id} className="border-b pb-2">
                    <div className="flex justify-between">
                      <span className="font-medium">
                        {col.id} - {col.customer}
                      </span>
                      <span className="font-bold">
                        LKR {col.outstandingAmount.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-gray-600 dark:text-gray-400 text-xs">
                      Due: {col.dueDate} | Status: {col.status} | Assigned:{" "}
                      {col.assignedTo}
                    </div>
                  </div>
                ))}
                {sortedCollections.length > 20 && (
                  <p className="text-center text-muted-foreground italic">
                    ... and {sortedCollections.length - 20} more collections
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 justify-end pt-4">
            <Button
              variant="outline"
              onClick={() => setShowPdfPreview(false)}
              className="text-xs md:text-sm"
            >
              Close
            </Button>
            <Select
              value={downloadFormat}
              onValueChange={(value: any) => setDownloadFormat(value)}
            >
              <SelectTrigger className="w-full sm:w-32 text-xs md:text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="excel">Excel (.csv)</SelectItem>
                <SelectItem value="pdf">Text (.txt)</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={downloadReport} className="text-xs md:text-sm">
              <Download className="h-3 w-3 md:h-4 md:w-4 mr-2" />
              Download
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
