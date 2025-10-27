"use client";

import { useState, useEffect } from "react";
import {
  Package,
  ShoppingCart,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const allMetrics = [
  {
    title: "Inventory Items",
    value: "1,234",
    change: "-3.2%",
    icon: Package,
    trend: "down",
    bgColor: "bg-purple-50 dark:bg-purple-950/20",
    iconColor: "text-purple-600 dark:text-purple-400",
    roles: ["pharmacist", "manager", "admin"],
  },
  {
    title: "Pending Orders",
    value: "45",
    change: "+5.1%",
    icon: ShoppingCart,
    trend: "up",
    bgColor: "bg-orange-50 dark:bg-orange-950/20",
    iconColor: "text-orange-600 dark:text-orange-400",
    roles: ["pharmacist", "manager", "admin"],
  },
  {
    title: "Low Stock Items",
    value: "23",
    change: "+8.3%",
    icon: AlertTriangle,
    trend: "up",
    bgColor: "bg-red-50 dark:bg-red-950/20",
    iconColor: "text-red-600 dark:text-red-400",
    roles: ["pharmacist", "manager", "admin"],
  },
  {
    title: "Monthly Revenue",
    value: "LKR 8,750,000",
    change: "+18.2%",
    icon: TrendingUp,
    trend: "up",
    bgColor: "bg-green-50 dark:bg-green-950/20",
    iconColor: "text-green-600 dark:text-green-400",
    roles: ["manager", "admin"],
  },
];

const recentActivities = [
  { id: 1, action: "New order placed", user: "Pharmacist A", time: "5 minutes ago", type: "order" },
  { id: 2, action: "Stock updated", user: "Manager B", time: "15 minutes ago", type: "inventory" },
  { id: 3, action: "Payment received", user: "Admin", time: "1 hour ago", type: "payment" },
];

const pharmacyData = [
  { id: "M001", name: "Paracetamol 500mg", stock: 120, supplier: "Supplier A", price: "LKR 50" },
  { id: "M002", name: "Amoxicillin 250mg", stock: 80, supplier: "Supplier B", price: "LKR 120" },
  { id: "M003", name: "Vitamin C 1000mg", stock: 200, supplier: "Supplier C", price: "LKR 80" },
];

const activityColors = {
  order: "bg-blue-600 dark:bg-blue-600 text-blue-700 dark:text-blue-300",
  inventory: "bg-purple-600 dark:bg-purple-600 text-purple-700 dark:text-purple-300",
  payment: "bg-green-600 dark:bg-green-600 text-green-700 dark:text-green-300",
};

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [metrics, setMetrics] = useState(allMetrics);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      
      // Filter metrics based on user role
      const filteredMetrics = allMetrics.filter(metric => 
        metric.roles.includes(parsedUser.role)
      );
      setMetrics(filteredMetrics);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-600 to-slate-700 dark:from-white dark:to-slate-300">
          Dashboard
        </h3>

        {/* Metrics Grid */}
        <div className={`grid gap-4 sm:grid-cols-2 ${metrics.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'}`}>
          {metrics.map((metric, idx) => (
            <div
              key={metric.title}
              className="p-4 flex flex-col justify-between rounded-2xl shadow-lg bg-white dark:bg-slate-900 hover:shadow-xl transition-all duration-300"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  {metric.title}
                </span>
                <div className={`p-2 rounded-xl ${metric.bgColor}`}>
                  <metric.icon className={`h-5 w-5 ${metric.iconColor}`} />
                </div>
              </div>
              <div className="flex items-center justify-between mt-4">
                <span className="text-2xl font-bold text-slate-900 dark:text-white">
                  {metric.value}
                </span>
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
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activities */}
        <div className="rounded-2xl shadow-lg bg-white dark:bg-slate-900">
          <div className="border-b border-slate-200 dark:border-slate-700 p-4">
            <h4 className="text-lg font-bold text-slate-600 dark:text-white">
              Recent Activities
            </h4>
          </div>
          <div className="p-4 space-y-2">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200"
              >
                <div
                  className={`flex-shrink-0 w-2 h-2 rounded-full ${
                    activityColors[activity.type as keyof typeof activityColors]
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                    {activity.action}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    <span>{activity.user}</span>
                    <span>•</span>
                    <span>{activity.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pharmacy Inventory Table */}
        <div className="rounded-2xl shadow-lg bg-white dark:bg-slate-900 p-4">
          <h4 className="text-lg font-bold text-slate-700 dark:text-white mb-4">
            Pharmacy Inventory
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-600 dark:text-slate-300">
              <thead className="text-xs uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400">
                <tr>
                  <th className="px-4 py-2 rounded-l-lg">Item ID</th>
                  <th className="px-4 py-2">Medicine</th>
                  <th className="px-4 py-2">Stock</th>
                  <th className="px-4 py-2">Supplier</th>
                  <th className="px-4 py-2 rounded-r-lg">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {pharmacyData.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="px-4 py-2">{item.id}</td>
                    <td className="px-4 py-2">{item.name}</td>
                    <td className="px-4 py-2">{item.stock}</td>
                    <td className="px-4 py-2">{item.supplier}</td>
                    <td className="px-4 py-2">{item.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
