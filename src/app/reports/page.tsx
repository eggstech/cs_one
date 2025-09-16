
'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ArrowDown,
  ArrowUp,
  Circle,
  Clock,
  PhoneMissed,
  Smile,
  ThumbsDown,
  ThumbsUp,
  TrendingUp,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Progress } from '@/components/ui/progress';

const fcrData = [
  { month: 'Jan', percentage: 75 },
  { month: 'Feb', percentage: 78 },
  { month: 'Mar', percentage: 80 },
  { month: 'Apr', percentage: 82 },
  { month: 'May', percentage: 85 },
  { month: 'Jun', percentage: 84 },
];

const chartConfig: ChartConfig = {
  percentage: {
    label: 'FCR (%)',
    color: 'hsl(var(--chart-1))',
  },
};

const csatData = [
  { name: 'Excellent', value: 400, fill: 'hsl(var(--chart-2))' },
  { name: 'Good', value: 300, fill: 'hsl(var(--chart-1))' },
  { name: 'Neutral', value: 200, fill: 'hsl(var(--chart-4))' },
  { name: 'Bad', value: 100, fill: 'hsl(var(--chart-5))' },
];

export default function ReportsPage() {
  const metrics = [
    {
      title: 'Thời gian Xử lý Trung bình (AHT)',
      value: '4m 32s',
      change: '+2.5%',
      changeType: 'bad',
      description: 'So với tháng trước',
      icon: <Clock className="size-6 text-muted-foreground" />,
    },
    {
      title: 'Tỷ lệ Giải quyết trong Lần gọi Đầu tiên (FCR)',
      value: '84%',
      change: '+5%',
      changeType: 'good',
      description: 'So với tháng trước',
      icon: <TrendingUp className="size-6 text-muted-foreground" />,
    },
    {
      title: 'Tỷ lệ Cuộc gọi Nhỡ',
      value: '3.2%',
      change: '-1.2%',
      changeType: 'good',
      description: 'So với tháng trước',
      icon: <PhoneMissed className="size-6 text-muted-foreground" />,
    },
    {
      title: 'Điểm Hài lòng Khách hàng (CSAT)',
      value: '92%',
      change: '+1.8%',
      changeType: 'good',
      description: 'Dựa trên 500 phản hồi',
      icon: <Smile className="size-6 text-muted-foreground" />,
    },
  ];

  const npsData = {
    promoters: 68,
    passives: 22,
    detractors: 10,
  };
  const npsScore = Math.round(
    (npsData.promoters / 100) * 100 - (npsData.detractors / 100) * 100
  );

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">
            Key performance indicators for the contact center.
          </p>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
              {metric.icon}
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <span
                  className={`flex items-center gap-0.5 ${
                    metric.changeType === 'good'
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {metric.changeType === 'good' ? (
                    <ArrowUp className="size-3" />
                  ) : (
                    <ArrowDown className="size-3" />
                  )}
                  {metric.change}
                </span>
                {metric.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>First Call Resolution (FCR) Trend</CardTitle>
            <CardDescription>
              Tỷ lệ các vấn đề được giải quyết trong lần tương tác đầu tiên.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-64 w-full">
              <LineChart data={fcrData}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <Line
                  dataKey="percentage"
                  type="monotone"
                  stroke="var(--color-percentage)"
                  strokeWidth={2}
                  dot={true}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Customer Satisfaction (CSAT)</CardTitle>
            <CardDescription>Phân phối điểm hài lòng của khách hàng.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center gap-4">
            <div className="text-5xl font-bold tracking-tighter">92%</div>
            <p className="text-sm text-muted-foreground">Overall Satisfaction</p>
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={csatData} layout="vertical" margin={{ left: 10 }}>
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="name"
                  hide
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  cursor={{ fill: 'transparent' }}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar
                  dataKey="value"
                  stackId="a"
                  radius={[5, 5, 5, 5]}
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex w-full justify-around text-xs">
              {csatData.map((item) => (
                <div key={item.name} className="flex items-center gap-1.5">
                  <Circle className="size-2" style={{ fill: item.fill }} />
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Chỉ số Thiện cảm Khách hàng (NPS)</CardTitle>
            <CardDescription>Mức độ khách hàng sẵn sàng giới thiệu.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-5xl font-bold tracking-tighter">
                {npsScore}
              </span>
              <span className="text-muted-foreground">/ 100</span>
            </div>
            <div className="space-y-2">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-medium text-green-600">
                  <span>Promoters</span>
                  <span>{npsData.promoters}%</span>
                </div>
                <Progress value={npsData.promoters} className="h-2" />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-medium text-yellow-500">
                  <span>Passives</span>
                  <span>{npsData.passives}%</span>
                </div>
                <Progress value={npsData.passives} className="h-2" />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-medium text-red-600">
                  <span>Detractors</span>
                  <span>{npsData.detractors}%</span>
                </div>
                <Progress value={npsData.detractors} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
         <Card>
          <CardHeader>
            <CardTitle>Mức độ Dịch vụ (Service Level)</CardTitle>
            <CardDescription>Tỷ lệ cuộc gọi được trả lời trong ngưỡng.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center gap-4">
             <div className="text-5xl font-bold tracking-tighter">95.4%</div>
             <p className="text-sm text-muted-foreground">within 20 seconds</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader>
            <CardTitle>Điểm Đánh giá Chất lượng (QA Score)</CardTitle>
            <CardDescription>Điểm trung bình từ đánh giá chất lượng nội bộ.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center gap-4">
             <div className="text-5xl font-bold tracking-tighter">98.1</div>
             <p className="text-sm text-muted-foreground">out of 100</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
