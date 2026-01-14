import { useMemo } from 'react';
import type { Solve } from "../../types/cubes";
import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '../ui/tooltip';

interface ActivityHeatmapProps {
  solves: Solve[];
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function ActivityHeatmap({ solves }: ActivityHeatmapProps) {
  const { data, weeks, maxCount } = useMemo(() => {
    const today = new Date();
    const oneYearAgo = new Date(today);
    oneYearAgo.setFullYear(today.getFullYear() - 1);
    
    // Create a map of date -> count
    const countMap = new Map<string, number>();
    
    solves.forEach(solve => {
      const date = new Date(solve.timestamp).toISOString().split('T')[0];
      countMap.set(date, (countMap.get(date) || 0) + 1);
    });

    // Generate all dates for the past year
    const dates: { date: string; count: number; dayOfWeek: number }[] = [];
    const current = new Date(oneYearAgo);
    
    // Start from Sunday of the week
    current.setDate(current.getDate() - current.getDay());
    
    while (current <= today) {
      const dateStr = current.toISOString().split('T')[0];
      dates.push({
        date: dateStr,
        count: countMap.get(dateStr) || 0,
        dayOfWeek: current.getDay(),
      });
      current.setDate(current.getDate() + 1);
    }

    // Group by weeks
    const weeks: typeof dates[] = [];
    for (let i = 0; i < dates.length; i += 7) {
      weeks.push(dates.slice(i, i + 7));
    }

    const maxCount = Math.max(1, ...dates.map(d => d.count));

    return { data: dates, weeks, maxCount };
  }, [solves]);

  const getColor = (count: number) => {
    if (count === 0) return 'bg-muted/30';
    const intensity = Math.min(count / maxCount, 1);
    if (intensity <= 0.25) return 'bg-primary/25';
    if (intensity <= 0.5) return 'bg-primary/50';
    if (intensity <= 0.75) return 'bg-primary/75';
    return 'bg-primary';
  };

  const getMonthLabels = () => {
    const labels: { month: string; weekIndex: number }[] = [];
    let lastMonth = -1;
    
    weeks.forEach((week, weekIndex) => {
      const firstDay = week[0];
      if (firstDay) {
        const month = new Date(firstDay.date).getMonth();
        if (month !== lastMonth) {
          labels.push({ month: MONTHS[month], weekIndex });
          lastMonth = month;
        }
      }
    });
    
    return labels;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="gradient-card p-4 sm:p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Activity
        </h3>
        <span className="text-xs text-muted-foreground">
          {solves.length} total solves this year
        </span>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[700px]">
          {/* Month labels */}
          <div className="flex mb-1 ml-8">
            {getMonthLabels().map(({ month, weekIndex }) => (
              <span
                key={`${month}-${weekIndex}`}
                className="text-xs text-muted-foreground"
                style={{ marginLeft: weekIndex === 0 ? 0 : `${(weekIndex - (getMonthLabels().findIndex(l => l.month === month && l.weekIndex === weekIndex) > 0 ? getMonthLabels()[getMonthLabels().findIndex(l => l.month === month && l.weekIndex === weekIndex) - 1].weekIndex : 0)) * 13 - 20}px` }}
              >
                {month}
              </span>
            ))}
          </div>

          <div className="flex gap-0.5">
            {/* Day labels */}
            <div className="flex flex-col gap-0.5 mr-2">
              {DAYS.map((day, i) => (
                <span
                  key={day}
                  className="text-xs text-muted-foreground h-[11px] leading-[11px]"
                  style={{ visibility: i % 2 === 1 ? 'visible' : 'hidden' }}
                >
                  {day}
                </span>
              ))}
            </div>

            {/* Heatmap grid */}
            <TooltipProvider delayDuration={100}>
              <div className="flex gap-0.5">
                {weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-0.5">
                    {week.map((day) => (
                      <Tooltip key={day.date}>
                        <TooltipTrigger asChild>
                          <div
                            className={`w-[11px] h-[11px] rounded-sm ${getColor(day.count)} cursor-pointer transition-transform hover:scale-125`}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="font-medium">{day.count} solves</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(day.date).toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                ))}
              </div>
            </TooltipProvider>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
            <span>Less</span>
            <div className="flex gap-0.5">
              <div className="w-[11px] h-[11px] rounded-sm bg-muted/30" />
              <div className="w-[11px] h-[11px] rounded-sm bg-primary/25" />
              <div className="w-[11px] h-[11px] rounded-sm bg-primary/50" />
              <div className="w-[11px] h-[11px] rounded-sm bg-primary/75" />
              <div className="w-[11px] h-[11px] rounded-sm bg-primary" />
            </div>
            <span>More</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
