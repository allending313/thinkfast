import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  type TooltipProps,
} from "recharts";
import type { GameScore, GameConfig } from "../types/game.types";
import type { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";

interface ScoreChartProps {
  scores: GameScore[];
  config: GameConfig;
  maxAttempts?: number;
  maxDays?: number;
}

interface ChartDataPoint {
  label: string;
  score: number;
  date: string;
  count?: number; // Only for daily averages
}

type ChartMode = "attempts" | "daily";

const ScoreChart: React.FC<ScoreChartProps> = ({
  scores,
  config,
  maxAttempts = 20,
  maxDays = 30,
}) => {
  const [chartMode, setChartMode] = useState<ChartMode>("attempts");

  // Helper function to get date string (YYYY-MM-DD)
  const getDateString = (timestamp: number): string => {
    return new Date(timestamp).toISOString().split("T")[0];
  };

  // Prepare chart data based on mode
  const chartData: ChartDataPoint[] = (() => {
    if (chartMode === "attempts") {
      return scores
        .sort((a, b) => a.timestamp - b.timestamp)
        .slice(-maxAttempts)
        .map((score, index) => ({
          label: `${index + 1}`,
          score: score.score,
          date: new Date(score.timestamp).toLocaleDateString(),
        }));
    } else {
      // Daily averages mode
      const scoresByDate = scores.reduce((acc, score) => {
        const dateKey = getDateString(score.timestamp);
        if (!acc[dateKey]) {
          acc[dateKey] = [];
        }
        acc[dateKey].push(score);
        return acc;
      }, {} as Record<string, GameScore[]>);

      return Object.entries(scoresByDate)
        .sort(([a], [b]) => a.localeCompare(b)) // Sort by date
        .slice(-maxDays) // Take last N days
        .map(([dateKey, dayScores]) => {
          const avgScore =
            dayScores.reduce((sum, s) => sum + s.score, 0) / dayScores.length;
          return {
            label: new Date(dateKey).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            }),
            score: Math.round(avgScore * 10) / 10, // Round to 1 decimal
            date: new Date(dateKey).toLocaleDateString(),
            count: dayScores.length,
          };
        });
    }
  })();

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          {chartMode === "attempts" ? (
            <>
              <p className="text-sm text-gray-600">Attempt #{label}</p>
              <p className="text-sm font-medium text-gray-800">
                Score: {data.score} {config.scoreUnit}
              </p>
              <p className="text-xs text-gray-500">{data.date}</p>
            </>
          ) : (
            <>
              <p className="text-sm text-gray-600">{data.date}</p>
              <p className="text-sm font-medium text-gray-800">
                Avg: {data.score} {config.scoreUnit}
              </p>
              <p className="text-xs text-gray-500">
                {data.count} attempt{data.count !== 1 ? "s" : ""}
              </p>
            </>
          )}
        </div>
      );
    }
    return null;
  };

  // Determine line color based on score type
  const lineColor = config.isHigherBetter ? "#10B981" : "#F59E0B";

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-sm font-medium text-gray-700">
          Score Progression ({chartData.length}{" "}
          {chartMode === "attempts" ? "attempts" : "days"})
        </h4>
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setChartMode("attempts")}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
              chartMode === "attempts"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Attempts
          </button>
          <button
            onClick={() => setChartMode("daily")}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
              chartMode === "daily"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Daily Avg
          </button>
        </div>
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="label"
              stroke="#6B7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#6B7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}${config.scoreUnit}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="score"
              stroke={lineColor}
              strokeWidth={2}
              dot={{
                fill: lineColor,
                strokeWidth: 0,
                r: 4,
              }}
              activeDot={{
                r: 6,
                stroke: lineColor,
                strokeWidth: 2,
                fill: "white",
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ScoreChart;
