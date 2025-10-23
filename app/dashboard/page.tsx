"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Package, ShoppingCart, TrendingUp, AlertTriangle, Users, ArrowUpRight, ArrowDownRight, Activity } from "lucide-react"

const mockMetrics = [
  {
    title: "Inventory Items",
    value: "1,234",
    change: "-3.2%",
    icon: Package,
    trend: "down",
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-950/20",
    iconColor: "text-purple-600 dark:text-purple-400",
  },
  {
    title: "Pending Orders",
    value: "45",
    change: "+5.1%",
    icon: ShoppingCart,
    trend: "up",
    color: "from-orange-500 to-orange-600",
    bgColor: "bg-orange-50 dark:bg-orange-950/20",
    iconColor: "text-orange-600 dark:text-orange-400",
  },
  {
    title: "Low Stock Items",
    value: "23",
    change: "+8.3%",
    icon: AlertTriangle,
    trend: "up",
    color: "from-red-500 to-red-600",
    bgColor: "bg-red-50 dark:bg-red-950/20",
    iconColor: "text-red-600 dark:text-red-400",
  },
  {
    title: "Monthly Revenue",
    value: "LKR 8,750,000",
    change: "+18.2%",
    icon: TrendingUp,
    trend: "up",
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-50 dark:bg-green-950/20",
    iconColor: "text-green-600 dark:text-green-400",
  },
]

const recentActivities = [
  { id: 1, action: "New order placed", user: "Pharmacist A", time: "5 minutes ago", type: "order" },
  { id: 2, action: "Stock updated", user: "Manager B", time: "15 minutes ago", type: "inventory" },
  { id: 3, action: "Payment received", user: "Admin", time: "1 hour ago", type: "payment" },
  { id: 4, action: "Employee approved", user: "HR Manager", time: "2 hours ago", type: "hr" },
  { id: 5, action: "Report generated", user: "Manager C", time: "3 hours ago", type: "report" },
]

const activityColors = {
  order: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
  inventory: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300",
  payment: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300",
  hr: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300",
  report: "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300",
}

export default function DashboardPage() {
  const [user] = useState({ name: "Admin User" })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-700 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            Dashboard
          </h3>
          
        </div>

        {/* Metrics Grid */}
        <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {mockMetrics.map((metric, index) => (
            <Card 
              key={metric.title} 
              className=" overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white dark:bg-slate-900"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    {metric.title}
                  </CardTitle>
                  <div className={`p-2 rounded-xl ${metric.bgColor}`}>
                    <metric.icon className={`h-5 w-5 ${metric.iconColor}`} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900 dark:text-white">
                  {metric.value}
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                      metric.trend === "up"
                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                        : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                    }`}
                  >
                    {metric.trend === "up" ? (
                      <ArrowUpRight className="h-3 w-3" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3" />
                    )}
                    {metric.change}
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">vs last month</span>
                </div>
              </CardContent>
             
            </Card>
          ))}
        </div>

        {/* Recent Activities */}
        <Card className="border-0 shadow-lg bg-white dark:bg-slate-900">
          <CardHeader className="border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              
              <CardTitle className="text-xl font-bold text-slate-700 dark:text-white">
                Recent Activities
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200"
                >
                  <div className={`flex-shrink-0 w-2 h-2 rounded-full ${activityColors[activity.type as keyof typeof activityColors]}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                      {activity.action}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      by <span className="font-medium">{activity.user}</span>
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-slate-700 px-3 py-1 rounded-full">
                      {activity.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}