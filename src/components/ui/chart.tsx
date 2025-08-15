"use client"

import * as React from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Label,
  LabelList,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Sector,
  Tooltip,
  XAxis,
  YAxis,
  type BarProps,
  type CartesianGridProps,
  type CellProps,
  type LabelListProps,
  type LabelProps,
  type LineProps,
  type PieProps,
  type PolarAngleAxisProps,
  type PolarGridProps,
  type PolarRadiusAxisProps,
  type RadarProps,
  type RadialBarProps,
  type ResponsiveContainerProps,
  type ScatterProps,
  type SectorProps,
  type TooltipProps,
  type XAxisProps,
  type YAxisProps,
} from "recharts"

import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

/* -----------------------------------------------------------------------------
 * Chart
 * -------------------------------------------------------------------------- */

// Helper to sync gradients with the parent chart
const GRADIENT_ID_PREFIX = "recharts-gradient-"
function useChartId(id?: string) {
  const generatedId = React.useId()
  return id ?? generatedId
}
function useGradientId(id?: string) {
  const chartId = useChartId(id)
  return `${GRADIENT_ID_PREFIX}${chartId}`
}

type ChartContextProps = {
  chartId: string
  config: ChartConfig
}

const ChartContext = React.createContext<ChartContextProps | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />")
  }

  return context
}

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    config: ChartConfig
    children: React.ComponentProps<typeof ResponsiveContainer>["children"]
  }
>(({ id, className, children, config, ...props }, ref) => {
  const chartId = useChartId(id)
  const gradientId = useGradientId(chartId)

  const contextValue = React.useMemo(
    () => ({
      chartId,
      config,
    }),
    [chartId, config]
  )

  return (
    <ChartContext.Provider value={contextValue}>
      <div
        ref={ref}
        data-chart-container={chartId}
        className={cn(
          "recharts-wrapper group/container flex aspect-video justify-center text-xs",
          className
        )}
        {...props}
      >
        <ResponsiveContainer>
          <>
            <defs>
              {Object.entries(config).map(([key, value]) => {
                if (value.gradient) {
                  return (
                    <linearGradient
                      key={key}
                      id={gradientId}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={value.gradient}
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor={value.gradient}
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  )
                }
                return null
              })}
            </defs>
            {children}
          </>
        </ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
})
ChartContainer.displayName = "Chart"

type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode
    icon?: React.ComponentType<{ className?: string; style?: React.CSSProperties }>
  } & (
    | {
        color?: string
        gradient?: never
      }
    | {
        color?: never
        gradient?: string
      }
  )
}

/* -----------------------------------------------------------------------------
 * Chart Legend
 * -------------------------------------------------------------------------- */

const ChartLegend = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    payload: any[]
    nameKey?: string
    onMouseEnter?: (data: any) => void
    onMouseLeave?: (data: any) => void
  }
>(
  (
    { className, payload, nameKey = "dataKey", onMouseEnter, onMouseLeave },
    ref
  ) => {
    const { config } = useChart()

    if (!payload || !payload.length) {
      return null
    }

    return (
      <div
        ref={ref}
        className={cn(
          "recharts-legend flex items-center justify-end gap-4 text-sm text-muted-foreground",
          className
        )}
      >
        {payload.map((item) => {
          const key = `${item[nameKey]}`
          const itemConfig = config[key]

          if (!itemConfig) {
            return null
          }

          const color = itemConfig.color ?? item.color
          const Icon = itemConfig.icon

          return (
            <div
              key={item.value}
              className="recharts-legend-item group/item flex items-center gap-1.5"
              onMouseEnter={() => onMouseEnter?.(item)}
              onMouseLeave={() => onMouseLeave?.(item)}
            >
              <div
                className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                style={{
                  backgroundColor: color,
                }}
              />
              <div className="recharts-legend-item-text flex-1 space-x-1 whitespace-nowrap">
                {Icon ? (
                  <Icon
                    className="inline-block h-4 w-4"
                    style={{
                      color: color,
                    }}
                  />
                ) : null}
                <span>{itemConfig.label ?? item.value}</span>
              </div>
            </div>
          )
        })}
      </div>
    )
  }
)
ChartLegend.displayName = "ChartLegend"

/* -----------------------------------------------------------------------------
 * Chart Tooltip
 * -------------------------------------------------------------------------- */

type ChartTooltipContentProps = {
  active?: boolean
  payload?: any[]
  label?: string | number
  className?: string
  indicator?: "line" | "dot" | "dashed"
  hideLabel?: boolean
  hideIndicator?: boolean
  labelFormatter?: (label: string, payload: any[]) => React.ReactNode
  valueFormatter?: (value: number, name: any, item: any) => React.ReactNode
  nameFormatter?: (name: any, item: any) => React.ReactNode
}

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  ChartTooltipContentProps
>(({
  active,
  payload,
  label,
  className,
  indicator = "dot",
  hideLabel = false,
  hideIndicator = false,
  labelFormatter,
  nameFormatter,
  valueFormatter,
}, ref) => {
  const { config } = useChart()

  if (!active || !payload || payload.length === 0) {
    return null
  }

  const renderLabel = () => {
    if (hideLabel || !label) {
      return null
    }

    if (labelFormatter) {
      return labelFormatter(label.toString(), payload)
    }

    return <CardTitle>{label}</CardTitle>
  }

  return (
    <Card
      ref={ref}
      className={cn(
        "recharts-tooltip-content group/tooltip min-w-[8rem] overflow-hidden rounded-lg border bg-background p-2 text-sm shadow-lg animate-in fade-in-0 zoom-in-95",
        className
      )}
    >
      <div className="recharts-tooltip-label p-1 font-medium">
        {renderLabel()}
      </div>
      <div className="recharts-tooltip-items grid gap-1.5 p-1">
        {payload.map((item, index) => {
          const key = `${item.name}`
          const itemConfig = config[key]
          const color = itemConfig?.color ?? item.color
          const Icon = itemConfig?.icon

          const renderIndicator = () => {
            if (hideIndicator) {
              return null
            }

            return (
              <div
                className={cn(
                  "recharts-tooltip-indicator h-2.5 w-2.5 shrink-0 rounded-[2px] border",
                  {
                    "border-background": indicator === "dot",
                    "bg-transparent": indicator !== "dot",
                    "border-dashed": indicator === "dashed",
                  }
                )}
                style={{
                  backgroundColor: indicator === "dot" ? color : "transparent",
                  borderColor: color,
                }}
              />
            )
          }

          return (
            <div
              key={item.dataKey}
              className="recharts-tooltip-item flex items-center gap-1.5"
            >
              {renderIndicator()}
              <div className="recharts-tooltip-item-name flex flex-1 items-center gap-1.5">
                {Icon ? <Icon className="h-4 w-4" style={{ color }} /> : null}
                {nameFormatter
                  ? nameFormatter(item.name, item)
                  : itemConfig?.label ?? item.name}
              </div>
              <div className="recharts-tooltip-item-value ml-auto font-mono font-medium tabular-nums">
                {valueFormatter
                  ? valueFormatter(
                      item.value as number,
                      item.name,
                      item
                    )
                  : item.value}
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
})
ChartTooltipContent.displayName = "ChartTooltipContent"

export {
  ChartContainer,
  ChartLegend,
  ChartTooltipContent,
  // Re-export all recharts components
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Label,
  LabelList,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Sector,
  Tooltip,
  XAxis,
  YAxis,
}
export type {
  BarProps,
  CartesianGridProps,
  CellProps,
  ChartConfig,
  LabelListProps,
  LabelProps,
  LineProps,
  PieProps,
  PolarAngleAxisProps,
  PolarGridProps,
  PolarRadiusAxisProps,
  RadarProps,
  RadialBarProps,
  ResponsiveContainerProps,
  ScatterProps,
  SectorProps,
  TooltipProps,
  XAxisProps,
  YAxisProps,
}