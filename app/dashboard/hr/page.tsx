"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Search,
  UserPlus,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  TrendingUp,
  Calendar,
  Edit,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  DollarSign,
} from "lucide-react";
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const roles = [
  "Pharmacist",
  "Manager",
  "Medical Rep",
  "Admin",
  "Cashier",
  "Stock Keeper",
];

const departments = ["Pharmacy", "Administration", "Sales", "Inventory", "HR"];

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  status: "active" | "inactive";
  pendingApprovals: number;
  address: string;
  joinDate: string;
  salary: number;
  emergencyContact: string;
  emergencyPhone: string;
}

interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  leaveType: "annual" | "sick" | "personal" | "unpaid";
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: "pending" | "approved" | "rejected";
  submittedDate: string;
  approvedBy?: string;
  approvedDate?: string;
  rejectionReason?: string;
}

interface PromotionRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  currentPosition: string;
  currentDepartment: string;
  proposedPosition: string;
  proposedDepartment: string;
  proposedSalary: number;
  currentSalary: number;
  justification: string;
  status: "pending" | "approved" | "rejected";
  submittedDate: string;
  submittedBy: string;
  approvedBy?: string;
  approvedDate?: string;
  rejectionReason?: string;
}

const mockLeaveRequests: LeaveRequest[] = [
  {
    id: "LR-001",
    employeeId: "EMP-001",
    employeeName: "Nimal Silva",
    department: "Pharmacy",
    leaveType: "annual",
    startDate: "2025-02-01",
    endDate: "2025-02-05",
    days: 5,
    reason: "Family vacation",
    status: "pending",
    submittedDate: "2025-01-20",
  },
  {
    id: "LR-002",
    employeeId: "EMP-003",
    employeeName: "Kumari Perera",
    department: "Sales",
    leaveType: "sick",
    startDate: "2025-01-22",
    endDate: "2025-01-23",
    days: 2,
    reason: "Medical appointment",
    status: "pending",
    submittedDate: "2025-01-21",
  },
  {
    id: "LR-003",
    employeeId: "EMP-005",
    employeeName: "Rajesh Jayawardena",
    department: "Inventory",
    leaveType: "personal",
    startDate: "2025-02-10",
    endDate: "2025-02-12",
    days: 3,
    reason: "Personal matters",
    status: "approved",
    submittedDate: "2025-01-15",
    approvedBy: "HR Manager",
    approvedDate: "2025-01-16",
  },
];

const mockPromotionRequests: PromotionRequest[] = [
  {
    id: "PR-001",
    employeeId: "EMP-002",
    employeeName: "Saman Fernando",
    currentPosition: "Pharmacist",
    currentDepartment: "Pharmacy",
    proposedPosition: "Senior Pharmacist",
    proposedDepartment: "Pharmacy",
    currentSalary: 75000,
    proposedSalary: 90000,
    justification:
      "Exceptional performance over 3 years, completed advanced certifications, consistently receives excellent patient feedback.",
    status: "pending",
    submittedDate: "2025-01-18",
    submittedBy: "Pharmacy Manager",
  },
  {
    id: "PR-002",
    employeeId: "EMP-004",
    employeeName: "Priya Wickramasinghe",
    currentPosition: "Cashier",
    currentDepartment: "Administration",
    proposedPosition: "Senior Cashier",
    proposedDepartment: "Administration",
    currentSalary: 45000,
    proposedSalary: 55000,
    justification:
      "2 years of service, improved cash handling accuracy, trains new staff.",
    status: "pending",
    submittedDate: "2025-01-19",
    submittedBy: "Admin Manager",
  },
];

const generateMockEmployees = (): Employee[] => {
  const firstNames = [
    "Nimal",
    "Saman",
    "Kumari",
    "Priya",
    "Rajesh",
    "Dilini",
    "Kasun",
    "Sanduni",
    "Amal",
    "Thilini",
  ];
  const lastNames = [
    "Silva",
    "Fernando",
    "Perera",
    "Jayawardena",
    "Wickramasinghe",
    "Gunasekara",
    "Dissanayake",
    "Mendis",
  ];

  const streets = ["Galle Road", "Kandy Road", "Main Street", "Park Avenue", "Station Road"];
  const cities = ["Colombo", "Kandy", "Galle", "Negombo", "Kurunegala"];

  return Array.from({ length: 48 }, (_, i) => {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const role = roles[Math.floor(Math.random() * roles.length)];

    return {
      id: `EMP-${String(i + 1).padStart(3, "0")}`,
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@medilync.com`,
      phone: `+94 ${70 + Math.floor(Math.random() * 8)}${Math.floor(Math.random() * 10000000).toString().padStart(7, "0")}`,
      role,
      department: departments[Math.floor(Math.random() * departments.length)],
      status: Math.random() > 0.1 ? "active" : "inactive",
      pendingApprovals: Math.random() > 0.7 ? Math.floor(Math.random() * 3) + 1 : 0,
      address: `${Math.floor(Math.random() * 200) + 1}, ${streets[Math.floor(Math.random() * streets.length)]}, ${cities[Math.floor(Math.random() * cities.length)]}`,
      joinDate: `20${18 + Math.floor(Math.random() * 7)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, "0")}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, "0")}`,
      salary: 40000 + Math.floor(Math.random() * 100000),
      emergencyContact: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
      emergencyPhone: `+94 ${70 + Math.floor(Math.random() * 8)}${Math.floor(Math.random() * 10000000).toString().padStart(7, "0")}`,
    };
  });
};

export default function HRPage() {
  const { toast } = useToast();
  const [employees, setEmployees] = useState(generateMockEmployees());
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [user, setUser] = useState<any>(null);

  const [leaveRequests, setLeaveRequests] = useState(mockLeaveRequests);
  const [promotionRequests, setPromotionRequests] = useState(
    mockPromotionRequests
  );
  const [selectedLeaveRequest, setSelectedLeaveRequest] =
    useState<LeaveRequest | null>(null);
  const [selectedPromotionRequest, setSelectedPromotionRequest] =
    useState<PromotionRequest | null>(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalType, setApprovalType] = useState<"leave" | "promotion" | null>(
    null
  );
  const [rejectionReason, setRejectionReason] = useState("");

  // Employee form states
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [employeeForm, setEmployeeForm] = useState<Partial<Employee>>({
    name: "",
    email: "",
    phone: "",
    role: "",
    department: "",
    status: "active",
    address: "",
    salary: 0,
    emergencyContact: "",
    emergencyPhone: "",
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || emp.role === filterRole;
    const matchesStatus = filterStatus === "all" || emp.status === filterStatus;

    // Managers only see their department
    if (user?.role === "manager") {
      return (
        matchesSearch &&
        matchesRole &&
        matchesStatus &&
        emp.department === "Pharmacy"
      );
    }

    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalPendingApprovals = employees.reduce(
    (sum, emp) => sum + emp.pendingApprovals,
    0
  );

  const pendingLeaveCount = leaveRequests.filter(
    (r) => r.status === "pending"
  ).length;
  const pendingPromotionCount = promotionRequests.filter(
    (r) => r.status === "pending"
  ).length;

  const handleLeaveApproval = (
    requestId: string,
    action: "approve" | "reject"
  ) => {
    setLeaveRequests((prev) =>
      prev.map((req) =>
        req.id === requestId
          ? {
            ...req,
            status: action === "approve" ? "approved" : "rejected",
            approvedBy: "Current User",
            approvedDate: new Date().toISOString().split("T")[0],
            rejectionReason:
              action === "reject" ? rejectionReason : undefined,
          }
          : req
      )
    );

    toast({
      title: action === "approve" ? "Leave Approved" : "Leave Rejected",
      description: `Leave request ${requestId} has been ${action === "approve" ? "approved" : "rejected"
        }.`,
    });

    setShowApprovalModal(false);
    setSelectedLeaveRequest(null);
    setRejectionReason("");
  };

  const handlePromotionApproval = (
    requestId: string,
    action: "approve" | "reject"
  ) => {
    setPromotionRequests((prev) =>
      prev.map((req) =>
        req.id === requestId
          ? {
            ...req,
            status: action === "approve" ? "approved" : "rejected",
            approvedBy: "Current User",
            approvedDate: new Date().toISOString().split("T")[0],
            rejectionReason:
              action === "reject" ? rejectionReason : undefined,
          }
          : req
      )
    );

    toast({
      title: action === "approve" ? "Promotion Approved" : "Promotion Rejected",
      description: `Promotion request ${requestId} has been ${action === "approve" ? "approved" : "rejected"
        }.`,
    });

    setShowApprovalModal(false);
    setSelectedPromotionRequest(null);
    setRejectionReason("");
  };

  const openApprovalModal = (
    type: "leave" | "promotion",
    request: LeaveRequest | PromotionRequest
  ) => {
    setApprovalType(type);
    if (type === "leave") {
      setSelectedLeaveRequest(request as LeaveRequest);
    } else {
      setSelectedPromotionRequest(request as PromotionRequest);
    }
    setShowApprovalModal(true);
  };

  const getStatusBadge = (status: "pending" | "approved" | "rejected") => {
    const variants = {
      pending: { variant: "secondary" as const, className: "bg-yellow-500" },
      approved: { variant: "default" as const, className: "bg-green-500" },
      rejected: { variant: "destructive" as const, className: "bg-red-500" },
    };
    return variants[status];
  };

  const getLeaveTypeBadge = (type: string) => {
    const variants: Record<string, { className: string }> = {
      annual: { className: "bg-blue-500" },
      sick: { className: "bg-orange-500" },
      personal: { className: "bg-purple-500" },
      unpaid: { className: "bg-gray-500" },
    };
    return variants[type] || variants.unpaid;
  };

  // Employee management functions
  const openAddEmployeeModal = () => {
    setEmployeeForm({
      name: "",
      email: "",
      phone: "",
      role: "",
      department: "",
      status: "active",
      address: "",
      salary: 0,
      emergencyContact: "",
      emergencyPhone: "",
    });
    setShowAddEmployeeModal(true);
  };

  const openViewEmployeeModal = (employee: Employee) => {
    setSelectedEmployee(employee);
    setEmployeeForm(employee);
    setIsEditMode(false);
    setShowEmployeeModal(true);
  };

  const handleAddEmployee = () => {
    const newEmployee: Employee = {
      ...employeeForm as Employee,
      id: `EMP-${String(employees.length + 1).padStart(3, "0")}`,
      pendingApprovals: 0,
      joinDate: new Date().toISOString().split("T")[0],
    };

    setEmployees([...employees, newEmployee]);

    toast({
      title: "Employee Added",
      description: `${newEmployee.name} has been successfully added to the system.`,
    });

    setShowAddEmployeeModal(false);
  };

  const handleUpdateEmployee = () => {
    if (!selectedEmployee) return;

    setEmployees(
      employees.map((emp) =>
        emp.id === selectedEmployee.id ? { ...employeeForm as Employee, id: selectedEmployee.id, pendingApprovals: selectedEmployee.pendingApprovals, joinDate: selectedEmployee.joinDate } : emp
      )
    );

    toast({
      title: "Employee Updated",
      description: `${employeeForm.name}'s information has been successfully updated.`,
    });

    setIsEditMode(false);
    setSelectedEmployee({ ...employeeForm as Employee, id: selectedEmployee.id, pendingApprovals: selectedEmployee.pendingApprovals, joinDate: selectedEmployee.joinDate });
  };

  const handleDeleteEmployee = (employeeId: string) => {
    if (confirm("Are you sure you want to delete this employee?")) {
      setEmployees(employees.filter((emp) => emp.id !== employeeId));

      toast({
        title: "Employee Deleted",
        description: "Employee has been removed from the system.",
      });

      setShowEmployeeModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-600 to-slate-700 dark:from-white dark:to-slate-300">
            HR Management
          </h3>

          {user?.role === "admin" && (
            <Button onClick={openAddEmployeeModal}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Employee
            </Button>
          )}
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Employees
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {employees.length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {employees.filter((emp) => emp.status === "active").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Leave
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {pendingLeaveCount}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Promotions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {pendingPromotionCount}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Approvals Section */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Approvals</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="leave" className="space-y-4">
              <TabsList>
                <TabsTrigger value="leave">
                  Leave Requests
                  {pendingLeaveCount > 0 && (
                    <Badge className="ml-2 bg-yellow-500">
                      {pendingLeaveCount}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="promotions">
                  Promotion Requests
                  {pendingPromotionCount > 0 && (
                    <Badge className="ml-2 bg-yellow-500">
                      {pendingPromotionCount}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="leave" className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          Request ID
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          Employee
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          Department
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          Leave Type
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          Dates
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          Days
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
                      {leaveRequests.map((request) => (
                        <tr
                          key={request.id}
                          className="border-b border-border last:border-0"
                        >
                          <td className="py-3 px-4 text-sm font-medium text-foreground">
                            {request.id}
                          </td>
                          <td className="py-3 px-4">
                            <div>
                              <p className="text-sm font-medium text-foreground">
                                {request.employeeName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {request.employeeId}
                              </p>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm text-foreground">
                            {request.department}
                          </td>
                          <td className="py-3 px-4">
                            <Badge
                              variant="default"
                              className={
                                getLeaveTypeBadge(request.leaveType).className
                              }
                            >
                              {request.leaveType.toUpperCase()}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-sm">
                              <p className="text-foreground">
                                {request.startDate}
                              </p>
                              <p className="text-muted-foreground">
                                to {request.endDate}
                              </p>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm font-medium text-foreground">
                            {request.days}
                          </td>
                          <td className="py-3 px-4">
                            <Badge
                              variant={getStatusBadge(request.status).variant}
                              className={
                                getStatusBadge(request.status).className
                              }
                            >
                              {request.status.toUpperCase()}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openApprovalModal("leave", request)}
                              disabled={request.status !== "pending"}
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              Review
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {leaveRequests.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No leave requests found
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="promotions" className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          Request ID
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          Employee
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          Current Position
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          Proposed Position
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          Salary Change
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          Submitted By
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
                      {promotionRequests.map((request) => (
                        <tr
                          key={request.id}
                          className="border-b border-border last:border-0"
                        >
                          <td className="py-3 px-4 text-sm font-medium text-foreground">
                            {request.id}
                          </td>
                          <td className="py-3 px-4">
                            <div>
                              <p className="text-sm font-medium text-foreground">
                                {request.employeeName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {request.employeeId}
                              </p>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-sm">
                              <p className="text-foreground">
                                {request.currentPosition}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {request.currentDepartment}
                              </p>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-sm">
                              <p className="text-foreground font-medium">
                                {request.proposedPosition}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {request.proposedDepartment}
                              </p>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-sm">
                              <p className="text-muted-foreground line-through">
                                LKR {request.currentSalary.toLocaleString()}
                              </p>
                              <p className="text-green-600 font-medium">
                                LKR {request.proposedSalary.toLocaleString()}
                              </p>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm text-foreground">
                            {request.submittedBy}
                          </td>
                          <td className="py-3 px-4">
                            <Badge
                              variant={getStatusBadge(request.status).variant}
                              className={
                                getStatusBadge(request.status).className
                              }
                            >
                              {request.status.toUpperCase()}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                openApprovalModal("promotion", request)
                              }
                              disabled={request.status !== "pending"}
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              Review
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {promotionRequests.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No promotion requests found
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Employee Directory Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <CardTitle>Employee Directory</CardTitle>
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search employees..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={filterRole} onValueChange={setFilterRole}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    {roles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full sm:w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
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
                      Employee ID
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Name
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Role
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Department
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Approvals
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map((employee) => (
                    <tr
                      key={employee.id}
                      className="border-b border-border last:border-0"
                    >
                      <td className="py-3 px-4 text-sm font-medium text-foreground">
                        {employee.id}
                      </td>
                      <td className="py-3 px-4 text-sm text-foreground">
                        {employee.name}
                      </td>
                      <td className="py-3 px-4 text-sm text-foreground">
                        {employee.role}
                      </td>
                      <td className="py-3 px-4 text-sm text-foreground">
                        {employee.department}
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            employee.status === "active"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {employee.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        {employee.pendingApprovals > 0 && (
                          <Badge variant="outline">
                            {employee.pendingApprovals} pending
                          </Badge>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openViewEmployeeModal(employee)}
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Approval Modal */}
        <Dialog open={showApprovalModal} onOpenChange={setShowApprovalModal}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {approvalType === "leave"
                  ? "Leave Request Details"
                  : "Promotion Request Details"}
              </DialogTitle>
              <DialogDescription>
                Review and approve or reject this request
              </DialogDescription>
            </DialogHeader>

            {approvalType === "leave" && selectedLeaveRequest && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Request ID</Label>
                    <p className="font-medium mt-1">{selectedLeaveRequest.id}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Status</Label>
                    <div className="mt-1">
                      <Badge
                        variant={
                          getStatusBadge(selectedLeaveRequest.status).variant
                        }
                        className={
                          getStatusBadge(selectedLeaveRequest.status).className
                        }
                      >
                        {selectedLeaveRequest.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">
                      Employee Name
                    </Label>
                    <p className="font-medium mt-1">
                      {selectedLeaveRequest.employeeName}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Employee ID</Label>
                    <p className="font-medium mt-1">
                      {selectedLeaveRequest.employeeId}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Department</Label>
                    <p className="font-medium mt-1">
                      {selectedLeaveRequest.department}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Leave Type</Label>
                    <div className="mt-1">
                      <Badge
                        variant="default"
                        className={
                          getLeaveTypeBadge(selectedLeaveRequest.leaveType)
                            .className
                        }
                      >
                        {selectedLeaveRequest.leaveType.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Start Date</Label>
                    <p className="font-medium mt-1">
                      {selectedLeaveRequest.startDate}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">End Date</Label>
                    <p className="font-medium mt-1">{selectedLeaveRequest.endDate}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Total Days</Label>
                    <p className="font-medium text-lg mt-1">
                      {selectedLeaveRequest.days} days
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">
                      Submitted Date
                    </Label>
                    <p className="font-medium mt-1">
                      {selectedLeaveRequest.submittedDate}
                    </p>
                  </div>
                </div>

                <div>
                  <Label className="text-muted-foreground">Reason</Label>
                  <p className="mt-2 text-sm p-3 bg-muted rounded-md">
                    {selectedLeaveRequest.reason}
                  </p>
                </div>

                {selectedLeaveRequest.status === "approved" && (
                  <div className="border rounded-lg p-4 bg-green-50 dark:bg-green-950">
                    <p className="text-sm font-medium text-green-900 dark:text-green-100">
                      Approved by {selectedLeaveRequest.approvedBy} on{" "}
                      {selectedLeaveRequest.approvedDate}
                    </p>
                  </div>
                )}

                {selectedLeaveRequest.status === "rejected" && (
                  <div className="border rounded-lg p-4 bg-red-50 dark:bg-red-950">
                    <p className="text-sm font-medium text-red-900 dark:text-red-100 mb-2">
                      Rejected by {selectedLeaveRequest.approvedBy} on{" "}
                      {selectedLeaveRequest.approvedDate}
                    </p>
                    {selectedLeaveRequest.rejectionReason && (
                      <p className="text-sm text-red-800 dark:text-red-200">
                        Reason: {selectedLeaveRequest.rejectionReason}
                      </p>
                    )}
                  </div>
                )}

                {selectedLeaveRequest.status === "pending" && (
                  <div className="space-y-4 pt-4 border-t">
                    <div className="space-y-2">
                      <Label htmlFor="rejection-reason">
                        Rejection Reason (Optional - only if rejecting)
                      </Label>
                      <Textarea
                        id="rejection-reason"
                        placeholder="Provide a reason if rejecting this request..."
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        rows={3}
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        onClick={() =>
                          handleLeaveApproval(selectedLeaveRequest.id, "approve")
                        }
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve Leave
                      </Button>
                      <Button
                        onClick={() =>
                          handleLeaveApproval(selectedLeaveRequest.id, "reject")
                        }
                        variant="destructive"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject Leave
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowApprovalModal(false);
                          setRejectionReason("");
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {approvalType === "promotion" && selectedPromotionRequest && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Request ID</Label>
                    <p className="font-medium mt-1">{selectedPromotionRequest.id}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Status</Label>
                    <div className="mt-1">
                      <Badge
                        variant={
                          getStatusBadge(selectedPromotionRequest.status)
                            .variant
                        }
                        className={
                          getStatusBadge(selectedPromotionRequest.status)
                            .className
                        }
                      >
                        {selectedPromotionRequest.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">
                      Employee Name
                    </Label>
                    <p className="font-medium mt-1">
                      {selectedPromotionRequest.employeeName}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Employee ID</Label>
                    <p className="font-medium mt-1">
                      {selectedPromotionRequest.employeeId}
                    </p>
                  </div>
                </div>

                <div className="border rounded-lg p-4 bg-muted/50">
                  <h4 className="font-semibold mb-3">Current Position</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground">Position</Label>
                      <p className="font-medium mt-1">
                        {selectedPromotionRequest.currentPosition}
                      </p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Department</Label>
                      <p className="font-medium mt-1">
                        {selectedPromotionRequest.currentDepartment}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <Label className="text-muted-foreground">
                        Current Salary
                      </Label>
                      <p className="font-medium text-lg mt-1">
                        LKR{" "}
                        {selectedPromotionRequest.currentSalary.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4 bg-blue-50 dark:bg-blue-950">
                  <h4 className="font-semibold mb-3 text-blue-900 dark:text-blue-100">
                    Proposed Position
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground">Position</Label>
                      <p className="font-medium text-blue-900 dark:text-blue-100 mt-1">
                        {selectedPromotionRequest.proposedPosition}
                      </p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Department</Label>
                      <p className="font-medium text-blue-900 dark:text-blue-100 mt-1">
                        {selectedPromotionRequest.proposedDepartment}
                      </p>
                    </div>
                    <div className="col-span-1 md:col-span-2">
                      <Label className="text-muted-foreground">
                        Proposed Salary
                      </Label>
                      <p className="font-medium text-lg text-green-600 dark:text-green-400 mt-1">
                        LKR{" "}
                        {selectedPromotionRequest.proposedSalary.toLocaleString()}
                        <span className="text-sm ml-2">
                          (+LKR{" "}
                          {(
                            selectedPromotionRequest.proposedSalary -
                            selectedPromotionRequest.currentSalary
                          ).toLocaleString()}
                          )
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-muted-foreground">Justification</Label>
                  <p className="mt-2 text-sm p-3 bg-muted rounded-md">
                    {selectedPromotionRequest.justification}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">
                      Submitted By
                    </Label>
                    <p className="font-medium mt-1">
                      {selectedPromotionRequest.submittedBy}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">
                      Submitted Date
                    </Label>
                    <p className="font-medium mt-1">
                      {selectedPromotionRequest.submittedDate}
                    </p>
                  </div>
                </div>

                {selectedPromotionRequest.status === "approved" && (
                  <div className="border rounded-lg p-4 bg-green-50 dark:bg-green-950">
                    <p className="text-sm font-medium text-green-900 dark:text-green-100">
                      Approved by {selectedPromotionRequest.approvedBy} on{" "}
                      {selectedPromotionRequest.approvedDate}
                    </p>
                  </div>
                )}

                {selectedPromotionRequest.status === "rejected" && (
                  <div className="border rounded-lg p-4 bg-red-50 dark:bg-red-950">
                    <p className="text-sm font-medium text-red-900 dark:text-red-100 mb-2">
                      Rejected by {selectedPromotionRequest.approvedBy} on{" "}
                      {selectedPromotionRequest.approvedDate}
                    </p>
                    {selectedPromotionRequest.rejectionReason && (
                      <p className="text-sm text-red-800 dark:text-red-200">
                        Reason: {selectedPromotionRequest.rejectionReason}
                      </p>
                    )}
                  </div>
                )}

                {selectedPromotionRequest.status === "pending" && (
                  <div className="space-y-4 pt-4 border-t">
                    <div className="space-y-2">
                      <Label htmlFor="rejection-reason">
                        Rejection Reason (Optional - only if rejecting)
                      </Label>
                      <Textarea
                        id="rejection-reason"
                        placeholder="Provide a reason if rejecting this request..."
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        rows={3}
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        onClick={() =>
                          handlePromotionApproval(
                            selectedPromotionRequest.id,
                            "approve"
                          )
                        }
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve Promotion
                      </Button>
                      <Button
                        onClick={() =>
                          handlePromotionApproval(
                            selectedPromotionRequest.id,
                            "reject"
                          )
                        }
                        variant="destructive"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject Promotion
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowApprovalModal(false);
                          setRejectionReason("");
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Add Employee Modal */}
        <Dialog open={showAddEmployeeModal} onOpenChange={setShowAddEmployeeModal}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
              <DialogDescription>
                Fill in the employee information below
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-1 md:col-span-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="Enter full name"
                    className="mt-1"
                    value={employeeForm.name}
                    onChange={(e) =>
                      setEmployeeForm({ ...employeeForm, name: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="employee@medilync.com"
                      className="pl-10"
                      value={employeeForm.email}
                      onChange={(e) =>
                        setEmployeeForm({ ...employeeForm, email: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <div className="relative mt-1">
                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      placeholder="+94 71 234 5678"
                      className="pl-10"
                      value={employeeForm.phone}
                      onChange={(e) =>
                        setEmployeeForm({ ...employeeForm, phone: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="role">Role *</Label>
                  <Select
                    value={employeeForm.role}
                    onValueChange={(value) =>
                      setEmployeeForm({ ...employeeForm, role: value })
                    }
                  >
                    <SelectTrigger id="role" className="mt-1">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="department">Department *</Label>
                  <Select
                    value={employeeForm.department}
                    onValueChange={(value) =>
                      setEmployeeForm({ ...employeeForm, department: value })
                    }
                  >
                    <SelectTrigger id="department" className="mt-1">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="salary">Salary (LKR) *</Label>
                  <div className="relative mt-1">
                    <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="salary"
                      type="number"
                      placeholder="50000"
                      className="pl-10"
                      value={employeeForm.salary || ""}
                      onChange={(e) =>
                        setEmployeeForm({
                          ...employeeForm,
                          salary: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="status">Status *</Label>
                  <Select
                    value={employeeForm.status}
                    onValueChange={(value: "active" | "inactive") =>
                      setEmployeeForm({ ...employeeForm, status: value })
                    }
                  >
                    <SelectTrigger id="status" className="mt-1">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="col-span-1 md:col-span-2">
                  <Label htmlFor="address">Address *</Label>
                  <div className="relative mt-1">
                    <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="address"
                      placeholder="123, Main Street, Colombo"
                      className="pl-10"
                      value={employeeForm.address}
                      onChange={(e) =>
                        setEmployeeForm({ ...employeeForm, address: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="emergencyContact">Emergency Contact Name *</Label>
                  <Input
                    id="emergencyContact"
                    placeholder="Contact person name"
                    className="mt-1"
                    value={employeeForm.emergencyContact}
                    onChange={(e) =>
                      setEmployeeForm({
                        ...employeeForm,
                        emergencyContact: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="emergencyPhone">Emergency Contact Phone *</Label>
                  <div className="relative mt-1">
                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="emergencyPhone"
                      placeholder="+94 71 234 5678"
                      className="pl-10"
                      value={employeeForm.emergencyPhone}
                      onChange={(e) =>
                        setEmployeeForm({
                          ...employeeForm,
                          emergencyPhone: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
                <Button onClick={handleAddEmployee} className="bg-green-600 hover:bg-green-700">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Employee
                </Button>
                <Button variant="outline" onClick={() => setShowAddEmployeeModal(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* View/Edit Employee Modal */}
        <Dialog open={showEmployeeModal} onOpenChange={setShowEmployeeModal}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {isEditMode ? "Edit Employee" : "Employee Details"}
              </DialogTitle>
              <DialogDescription>
                {isEditMode
                  ? "Update employee information below"
                  : "View and manage employee information"}
              </DialogDescription>
            </DialogHeader>

            {selectedEmployee && (
              <div className="space-y-6">
                {/* Header Section */}
                {!isEditMode && (
                  <div className="flex items-start justify-between border-b pb-4">
                    <div>
                      <h3 className="text-2xl font-bold">{selectedEmployee.name}</h3>
                      <p className="text-muted-foreground">{selectedEmployee.id}</p>
                      <div className="flex gap-2 mt-2">
                        <Badge
                          variant={
                            selectedEmployee.status === "active"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {selectedEmployee.status.toUpperCase()}
                        </Badge>
                        <Badge variant="outline">{selectedEmployee.role}</Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditMode(true)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                  </div>
                )}

                {/* Form Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <div className="col-span-1 md:col-span-2">
                    <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      <Briefcase className="h-5 w-5" />
                      Personal Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Full Name</Label>
                        {isEditMode ? (
                          <Input
                            className="mt-1"
                            value={employeeForm.name}
                            onChange={(e) =>
                              setEmployeeForm({ ...employeeForm, name: e.target.value })
                            }
                          />
                        ) : (
                          <p className="font-medium mt-1">{selectedEmployee.name}</p>
                        )}
                      </div>

                      <div>
                        <Label>Employee ID</Label>
                        <p className="font-medium mt-1">{selectedEmployee.id}</p>
                      </div>

                      <div>
                        <Label>Email</Label>
                        {isEditMode ? (
                          <div className="relative mt-1">
                            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              className="pl-10"
                              value={employeeForm.email}
                              onChange={(e) =>
                                setEmployeeForm({ ...employeeForm, email: e.target.value })
                              }
                            />
                          </div>
                        ) : (
                          <div className="mt-1">
                            <p className="font-medium flex items-center gap-2">
                              <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0 -mt-5" />
                              <span className=" break-words w-48">{selectedEmployee.email}</span>
                            </p>
                          </div>
                        )}
                      </div>

                      <div>
                        <Label>Phone</Label>
                        {isEditMode ? (
                          <div className="relative mt-1">
                            <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              className="pl-10"
                              value={employeeForm.phone}
                              onChange={(e) =>
                                setEmployeeForm({ ...employeeForm, phone: e.target.value })
                              }
                            />
                          </div>
                        ) : (
                          <div className="mt-1">
                            <p className="font-medium flex items-center gap-2">
                              <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                              <span>{selectedEmployee.phone}</span>
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="col-span-1 md:col-span-2">
                        <Label>Address</Label>
                        {isEditMode ? (
                          <div className="relative mt-1">
                            <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              className="pl-10"
                              value={employeeForm.address}
                              onChange={(e) =>
                                setEmployeeForm({ ...employeeForm, address: e.target.value })
                              }
                            />
                          </div>
                        ) : (
                          <div className="mt-1">
                            <p className="font-medium flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                              <span>{selectedEmployee.address}</span>
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Employment Information */}
                  <div className="col-span-1 md:col-span-2">
                    <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      <Briefcase className="h-5 w-5" />
                      Employment Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Role</Label>
                        {isEditMode ? (
                          <Select
                            value={employeeForm.role}
                            onValueChange={(value) =>
                              setEmployeeForm({ ...employeeForm, role: value })
                            }
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {roles.map((role) => (
                                <SelectItem key={role} value={role}>
                                  {role}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <p className="font-medium mt-1">{selectedEmployee.role}</p>
                        )}
                      </div>

                      <div>
                        <Label>Department</Label>
                        {isEditMode ? (
                          <Select
                            value={employeeForm.department}
                            onValueChange={(value) =>
                              setEmployeeForm({ ...employeeForm, department: value })
                            }
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {departments.map((dept) => (
                                <SelectItem key={dept} value={dept}>
                                  {dept}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <p className="font-medium mt-1">
                            {selectedEmployee.department}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label>Status</Label>
                        {isEditMode ? (
                          <Select
                            value={employeeForm.status}
                            onValueChange={(value: "active" | "inactive") =>
                              setEmployeeForm({ ...employeeForm, status: value })
                            }
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <Badge
                            className="mt-1"
                            variant={
                              selectedEmployee.status === "active"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {selectedEmployee.status.toUpperCase()}
                          </Badge>
                        )}
                      </div>

                      <div>
                        <Label>Join Date</Label>
                        <p className="font-medium mt-1 flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {selectedEmployee.joinDate}
                        </p>
                      </div>

                      <div>
                        <Label>Salary</Label>
                        {isEditMode ? (
                          <div className="relative mt-1">
                            <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="number"
                              className="pl-10"
                              value={employeeForm.salary || ""}
                              onChange={(e) =>
                                setEmployeeForm({
                                  ...employeeForm,
                                  salary: parseInt(e.target.value) || 0,
                                })
                              }
                            />
                          </div>
                        ) : (
                          <p className="font-medium mt-1 text-green-600">
                            LKR {selectedEmployee.salary.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div className="col-span-1 md:col-span-2">
                    <h4 className="font-semibold text-lg mb-4">Emergency Contact</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Contact Name</Label>
                        {isEditMode ? (
                          <Input
                            className="mt-1"
                            value={employeeForm.emergencyContact}
                            onChange={(e) =>
                              setEmployeeForm({
                                ...employeeForm,
                                emergencyContact: e.target.value,
                              })
                            }
                          />
                        ) : (
                          <p className="font-medium mt-1">
                            {selectedEmployee.emergencyContact}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label>Contact Phone</Label>
                        {isEditMode ? (
                          <div className="relative mt-1">
                            <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              className="pl-10"
                              value={employeeForm.emergencyPhone}
                              onChange={(e) =>
                                setEmployeeForm({
                                  ...employeeForm,
                                  emergencyPhone: e.target.value,
                                })
                              }
                            />
                          </div>
                        ) : (
                          <div className="mt-1">
                            <p className="font-medium flex items-center gap-2">
                              <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                              <span>{selectedEmployee.emergencyPhone}</span>
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
                  {isEditMode ? (
                    <>
                      <Button
                        onClick={handleUpdateEmployee}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsEditMode(false);
                          setEmployeeForm(selectedEmployee);
                        }}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => setIsEditMode(true)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Employee
                      </Button>
                      {user?.role === "admin" && (
                        <Button
                          variant="destructive"
                          onClick={() => handleDeleteEmployee(selectedEmployee.id)}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Delete Employee
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        onClick={() => setShowEmployeeModal(false)}
                      >
                        Close
                      </Button>
                    </>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
