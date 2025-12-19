"use client"

import * as React from "react"
import { Label, Pie, PieChart } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "../ui/chart"

const chartData = [
  { company: "tech", employees: 15, fill: "#3B82F6" },
  { company: "global", employees: 12, fill: "#06B6D4" },
  { company: "digital", employees: 8, fill: "#10B981" },
  { company: "data", employees: 7, fill: "#F59E0B" },
  { company: "software", employees: 6, fill: "#EF4444" },
  { company: "consulting", employees: 5, fill: "#8B5CF6" },
  { company: "finance", employees: 4, fill: "#EC4899" },
  { company: "marketing", employees: 3, fill: "#F97316" },
  { company: "others", employees: 10, fill: "#84CC16" },
]

const chartConfig = {
  employees: {
    label: "Employees",
  },
  tech: {
    label: "Tech Solutions Inc.",
    color: "hsl(var(--chart-1))",
  },
  global: {
    label: "Global Innovations Ltd.",
    color: "hsl(var(--chart-2))",
  },
  digital: {
    label: "Digital Ventures",
    color: "hsl(var(--chart-3))",
  },
  data: {
    label: "Data Analytics Pro",
    color: "hsl(var(--chart-4))",
  },
  software: {
    label: "Software Dynamics",
    color: "hsl(var(--chart-5))",
  },
  consulting: {
    label: "Business Consulting",
    color: "#10B981",
  },
  finance: {
    label: "Finance Corp",
    color: "#F59E0B",
  },
  marketing: {
    label: "Marketing Hub",
    color: "#EF4444",
  },
  others: {
    label: "Others",
    color: "#8B5CF6",
  },
} satisfies ChartConfig

export function CompanyDistributionChart() {
  const totalEmployees = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.employees, 0)
  }, [])

  return (
    <div className="bg-white shadow-xl rounded-xl p-6">
      <div className="mb-4 border-b border-gray-100 pb-4">
        <h2 className="text-2xl font-bold text-gray-900">Company Distribution</h2>
        <p className="text-sm text-gray-500 mt-1">Employee distribution across companies</p>
      </div>
      <div className="p-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-64"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="employees"
              nameKey="company"
              innerRadius={60}
              stroke="none"
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="text-3xl font-bold"
                          fill="#3B82F6"
                        >
                          {totalEmployees}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          fill="#6366F1"
                        >
                          Total Employees
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </div>
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="grid grid-cols-2 gap-3 text-sm">
          {chartData.map((item) => {
            const percentage = ((item.employees / totalEmployees) * 100).toFixed(1)
            const companyName = chartConfig[item.company as keyof typeof chartConfig]?.label || item.company
            return (
             
              <div key={item.company} className="flex justify-between ml-10 items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }}></div>
                  <span className="text-gray-700">{companyName}</span>
                </div>
                <div className="text-right mr-20">
                  <div className="font-semibold text-gray-900">{item.employees}</div>
                  <div className="text-xs text-gray-500">{percentage}%</div>
                </div>
              </div>
            )
          })}
        </div>

        {/* total Employees */}
        {/* <div className="mt-4 pt-3 border-t border-gray-100 text-center">
          <div className="text-sm font-medium text-gray-600">Total Employees</div>
          <div className="text-2xl font-bold text-gray-900">{totalEmployees}</div>
        </div> */}
      </div>
    </div>
  )
}