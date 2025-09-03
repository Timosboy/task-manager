import SampleChart from '../components/SampleChart'

const data = [
  { name: 'Ene', value: 12 },
  { name: 'Feb', value: 18 },
  { name: 'Mar', value: 8 },
  { name: 'Abr', value: 22 },
]

export default function ChartPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Chart (Demo)</h1>
      <p className="text-gray-600 mb-4">
        Demostración de <strong>Recharts</strong> con datos ficticios de tareas
        completadas por mes.
      </p>
      <SampleChart data={data} />
    </div>
  )
}
