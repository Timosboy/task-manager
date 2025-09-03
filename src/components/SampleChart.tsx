import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'

type Point = { name: string; value: number }

export default function SampleChart({ data }: { data: Point[] }) {
  return (
    <div className="w-full max-w-sm">
      <ResponsiveContainer width="100%" height={260}>
        <LineChart
          data={data}
          margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" dot />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
