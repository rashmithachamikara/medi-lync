"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Download, TrendingUp, TrendingDown, DollarSign, Package, Users, ShoppingCart } from "lucide-react"
import {
  Line,
  LineChart,
  Bar,
  BarChart,
  Area,
  AreaChart,
  Pie,
  PieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const monthlyTurnover = [
  { month: "Jul", revenue: 6500000, expenses: 4200000, profit: 2300000 },
  { month: "Aug", revenue: 7200000, expenses: 4500000, profit: 2700000 },
  { month: "Sep", revenue: 6800000, expenses: 4300000, profit: 2500000 },
  { month: "Oct", revenue: 8100000, expenses: 4800000, profit: 3300000 },
  { month: "Nov", revenue: 8500000, expenses: 5000000, profit: 3500000 },
  { month: "Dec", revenue: 9200000, expenses: 5400000, profit: 3800000 },
]

const salesByCategory = [
  { name: "Prescription", value: 45, amount: 20700000, color: "hsl(var(--chart-1))", orders: 1850, growth: 12.5 },
  { name: "OTC Medicines", value: 30, amount: 13800000, color: "hsl(var(--chart-2))", orders: 1240, growth: 8.3 },
  { name: "Supplements", value: 15, amount: 6900000, color: "hsl(var(--chart-3))", orders: 580, growth: 15.2 },
  { name: "Medical Devices", value: 10, amount: 4600000, color: "hsl(var(--chart-4))", orders: 320, growth: 5.8 },
]

const branchPerformance = [
  { branch: "Main Branch", sales: 3500000, orders: 450, growth: 15.2 },
  { branch: "Colombo", sales: 2800000, orders: 380, growth: 12.8 },
  { branch: "Kandy", sales: 2200000, orders: 320, growth: 8.5 },
  { branch: "Galle", sales: 1900000, orders: 280, growth: 6.3 },
]

const topProducts = [
  { name: "Paracetamol 500mg", units: 2450, revenue: 735000, margin: 28 },
  { name: "Amoxicillin 250mg", units: 1890, revenue: 945000, margin: 32 },
  { name: "Vitamin D3", units: 1650, revenue: 825000, margin: 35 },
  { name: "Omeprazole 20mg", units: 1420, revenue: 852000, margin: 30 },
  { name: "Metformin 500mg", units: 1280, revenue: 640000, margin: 25 },
]

const inventoryTurnover = [
  { month: "Jul", turnoverRate: 4.2, daysInStock: 86 },
  { month: "Aug", turnoverRate: 4.5, daysInStock: 80 },
  { month: "Sep", turnoverRate: 4.1, daysInStock: 88 },
  { month: "Oct", turnoverRate: 4.8, daysInStock: 75 },
  { month: "Nov", turnoverRate: 5.1, daysInStock: 71 },
  { month: "Dec", turnoverRate: 5.4, daysInStock: 67 },
]

const supplierPerformance = [
  { supplier: "MediSupply Ltd", onTime: 95, quality: 98, value: 8500000 },
  { supplier: "PharmaCorp", onTime: 88, quality: 95, value: 6200000 },
  { supplier: "HealthDistributors", onTime: 92, quality: 97, value: 5800000 },
  { supplier: "Global Pharma", onTime: 85, quality: 93, value: 4100000 },
]

const stockAlerts = [
  { category: "Critical", count: 12, percentage: 15, color: "hsl(0, 84%, 60%)" },
  { category: "Low", count: 28, percentage: 35, color: "hsl(36, 100%, 50%)" },
  { category: "Optimal", count: 40, percentage: 50, color: "hsl(142, 71%, 45%)" },
]

const stockBreakdown = [
  { id: 1, name: "Paracetamol 500mg", status: "Critical", quantity: 5, reorderLevel: 50, location: "Shelf A1" },
  { id: 2, name: "Amoxicillin 250mg", status: "Critical", quantity: 8, reorderLevel: 40, location: "Shelf B2" },
  { id: 3, name: "Ibuprofen 400mg", status: "Low", quantity: 15, reorderLevel: 30, location: "Shelf A3" },
  { id: 4, name: "Vitamin D3", status: "Low", quantity: 22, reorderLevel: 35, location: "Shelf C1" },
  { id: 5, name: "Omeprazole 20mg", status: "Optimal", quantity: 85, reorderLevel: 40, location: "Shelf B1" },
]

const dailySalesTrend = [
  { day: "Mon", sales: 1250000, orders: 185 },
  { day: "Tue", sales: 1180000, orders: 172 },
  { day: "Wed", sales: 1320000, orders: 198 },
  { day: "Thu", sales: 1290000, orders: 191 },
  { day: "Fri", sales: 1450000, orders: 215 },
  { day: "Sat", sales: 1680000, orders: 248 },
  { day: "Sun", sales: 980000, orders: 142 },
]

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics & Reporting</h1>
          <p className="text-muted-foreground mt-1">Business insights and performance metrics</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="last-6-months">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last-month">Last Month</SelectItem>
              <SelectItem value="last-3-months">Last 3 Months</SelectItem>
              <SelectItem value="last-6-months">Last 6 Months</SelectItem>
              <SelectItem value="last-year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">LKR 46.3M</div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +18.2% from last period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Order Value</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">LKR 32,450</div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">+5.4% from last period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">1,430</div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">+12.3% from last period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">892</div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">+8.7% from last period</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Revenue, Expenses & Profit</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              revenue: {
                label: "Revenue",
                color: "hsl(var(--chart-1))",
              },
              expenses: {
                label: "Expenses",
                color: "hsl(0, 84%, 60%)",
              },
              profit: {
                label: "Profit",
                color: "hsl(142, 71%, 45%)",
              },
            }}
            className="h-[350px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTurnover}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--color-revenue)"
                  fill="url(#colorRevenue)"
                  strokeWidth={2}
                  name="Revenue (LKR)"
                />
                <Area
                  type="monotone"
                  dataKey="profit"
                  stroke="var(--color-profit)"
                  fill="url(#colorProfit)"
                  strokeWidth={2}
                  name="Profit (LKR)"
                />
                <Line
                  type="monotone"
                  dataKey="expenses"
                  stroke="var(--color-expenses)"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Expenses (LKR)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Daily Sales Trend (This Week)</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              sales: {
                label: "Sales",
                color: "hsl(var(--chart-1))",
              },
              orders: {
                label: "Orders",
                color: "hsl(var(--chart-3))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailySalesTrend}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="day" className="text-xs" />
                <YAxis yAxisId="left" className="text-xs" />
                <YAxis yAxisId="right" orientation="right" className="text-xs" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="sales"
                  fill="var(--color-sales)"
                  name="Sales (LKR)"
                  radius={[4, 4, 0, 0]}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="orders"
                  stroke="var(--color-orders)"
                  strokeWidth={2}
                  name="Orders"
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Sales by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Sales Distribution by Category</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <ChartContainer
              config={{
                prescription: {
                  label: "Prescription",
                  color: "hsl(var(--chart-1))",
                },
                otc: {
                  label: "OTC Medicines",
                  color: "hsl(var(--chart-2))",
                },
                supplements: {
                  label: "Supplements",
                  color: "hsl(var(--chart-3))",
                },
                devices: {
                  label: "Medical Devices",
                  color: "hsl(var(--chart-4))",
                },
              }}
              className="h-[280px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={salesByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {salesByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload
                        return (
                          <div className="bg-background border border-border rounded-lg p-2 shadow-lg">
                            <p className="font-medium text-foreground">{data.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Revenue: LKR {(data.amount / 1000000).toFixed(1)}M
                            </p>
                            <p className="text-sm text-muted-foreground">Share: {data.value}%</p>
                            <p className="text-sm text-muted-foreground">Orders: {data.orders}</p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>

            <div className="space-y-3">
              {salesByCategory.map((category, index) => (
                <div key={index} className="p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                      <span className="font-medium text-sm text-foreground">{category.name}</span>
                    </div>
                    <span className="text-xs font-semibold text-muted-foreground">{category.value}%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      LKR {(category.amount / 1000000).toFixed(1)}M • {category.orders} orders
                    </span>
                    <span className="text-green-600 dark:text-green-400 font-medium">+{category.growth}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Stock Level Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <ChartContainer
              config={{
                critical: {
                  label: "Critical",
                  color: "hsl(0, 84%, 60%)",
                },
                low: {
                  label: "Low",
                  color: "hsl(36, 100%, 50%)",
                },
                optimal: {
                  label: "Optimal",
                  color: "hsl(142, 71%, 45%)",
                },
              }}
              className="h-[250px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stockAlerts}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="percentage"
                    label={({ category, percentage }) => `${category}: ${percentage}%`}
                  >
                    {stockAlerts.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>

            <div className="grid grid-cols-3 gap-2">
              {stockAlerts.map((alert, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg border"
                  style={{ borderColor: alert.color, backgroundColor: `${alert.color}15` }}
                >
                  <div className="text-xs font-medium text-muted-foreground">{alert.category}</div>
                  <div className="text-lg font-bold mt-1" style={{ color: alert.color }}>
                    {alert.count}
                  </div>
                  <div className="text-xs text-muted-foreground">{alert.percentage}% of stock</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Stock Items by Status</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">Items requiring attention or monitoring</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Product Name</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-center py-3 px-4 font-medium text-muted-foreground">Current Qty</th>
                  <th className="text-center py-3 px-4 font-medium text-muted-foreground">Reorder Level</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Location</th>
                </tr>
              </thead>
              <tbody>
                {stockBreakdown.map((item) => {
                  const statusColor =
                    item.status === "Critical"
                      ? "hsl(0, 84%, 60%)"
                      : item.status === "Low"
                        ? "hsl(36, 100%, 50%)"
                        : "hsl(142, 71%, 45%)"
                  return (
                    <tr key={item.id} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4 text-foreground">{item.name}</td>
                      <td className="py-3 px-4">
                        <span
                          className="px-2 py-1 rounded-full text-xs font-medium text-white"
                          style={{ backgroundColor: statusColor }}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-medium text-foreground">{item.quantity}</td>
                      <td className="py-3 px-4 text-center text-muted-foreground">{item.reorderLevel}</td>
                      <td className="py-3 px-4 text-muted-foreground">{item.location}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Inventory Turnover Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              turnoverRate: {
                label: "Turnover Rate",
                color: "hsl(var(--chart-1))",
              },
              daysInStock: {
                label: "Days in Stock",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={inventoryTurnover}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis yAxisId="left" className="text-xs" />
                <YAxis yAxisId="right" orientation="right" className="text-xs" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="turnoverRate"
                  stroke="var(--color-turnoverRate)"
                  strokeWidth={3}
                  name="Turnover Rate"
                  dot={{ r: 5, fill: "var(--color-turnoverRate)", stroke: "var(--color-turnoverRate)", strokeWidth: 2 }}
                  activeDot={{ r: 7 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="daysInStock"
                  stroke="var(--color-daysInStock)"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Avg Days in Stock"
                  dot={{ r: 5, fill: "var(--color-daysInStock)", stroke: "var(--color-daysInStock)", strokeWidth: 2 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Branch Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Branch Performance Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                sales: {
                  label: "Sales",
                  color: "hsl(var(--chart-1))",
                },
                orders: {
                  label: "Orders",
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={branchPerformance} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis type="number" className="text-xs" />
                  <YAxis dataKey="branch" type="category" className="text-xs" width={100} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="sales" fill="var(--color-sales)" name="Sales (LKR)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">{product.name}</span>
                    <span className="text-muted-foreground">{product.units} units</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${(product.units / 2450) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-20 text-right">
                      LKR {(product.revenue / 1000).toFixed(0)}K
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Margin: {product.margin}%</span>
                    {product.margin >= 30 ? (
                      <span className="text-green-600 dark:text-green-400 flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        High margin
                      </span>
                    ) : (
                      <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
                        <TrendingDown className="h-3 w-3" />
                        Low margin
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Supplier Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              onTime: {
                label: "On-Time Delivery %",
                color: "hsl(var(--chart-1))",
              },
              quality: {
                label: "Quality Score %",
                color: "hsl(var(--chart-3))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={supplierPerformance}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="supplier" className="text-xs" angle={-15} textAnchor="end" height={80} />
                <YAxis className="text-xs" domain={[0, 100]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="onTime" fill="var(--color-onTime)" name="On-Time Delivery %" radius={[4, 4, 0, 0]} />
                <Bar dataKey="quality" fill="var(--color-quality)" name="Quality Score %" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
