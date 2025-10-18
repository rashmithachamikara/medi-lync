"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Package, ShoppingCart, TrendingUp, AlertTriangle, Users } from "lucide-react"

const mockMetrics = [
  {
    title: "Total Sales",
    value: "LKR 2,450,000",
    change: "+12.5%",
    icon: DollarSign,
    trend: "up",
  },
  {
    title: "Inventory Items",
    value: "1,234",
    change: "-3.2%",
    icon: Package,
    trend: "down",
  },
  {
    title: "Pending Orders",
    value: "45",
    change: "+5.1%",
    icon: ShoppingCart,
    trend: "up",
  },
  {
    title: "Low Stock Items",
    value: "23",
    change: "+8.3%",
    icon: AlertTriangle,
    trend: "up",
  },
  {
    title: "Monthly Revenue",
    value: "LKR 8,750,000",
    change: "+18.2%",
    icon: TrendingUp,
    trend: "up",
  },
  {
    title: "Active Employees",
    value: "48",
    change: "+2.1%",
    icon: Users,
    trend: "up",
  },
]

const recentActivities = [
  { id: 1, action: "New order placed", user: "Pharmacist A", time: "5 minutes ago" },
  { id: 2, action: "Stock updated", user: "Manager B", time: "15 minutes ago" },
  { id: 3, action: "Payment received", user: "Admin", time: "1 hour ago" },
  { id: 4, action: "Employee approved", user: "HR Manager", time: "2 hours ago" },
  { id: 5, action: "Report generated", user: "Manager C", time: "3 hours ago" },
]

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-1">Welcome back, {user?.name}! Here's what's happening today.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockMetrics.map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{metric.title}</CardTitle>
              <metric.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{metric.value}</div>
              <p
                className={`text-xs mt-1 ${metric.trend === "up" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
              >
                {metric.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between py-2 border-b border-border last:border-0"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">by {activity.user}</p>
                </div>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
