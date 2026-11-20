import { BarChart2 } from 'lucide-react'
import { PanelSection } from '../Components/PanelSection'
import { useGetUgl } from '@/services/uglService'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { useMemo } from 'react'

export function StatsSection() {
  const { data: uglsRaw = [] } = useGetUgl()

  // Préparer les données pour le graphique "Répartition par chef-lieu (ou région)"
  const pieData = useMemo(() => {
    const counts = new Map<string, number>()
    uglsRaw.forEach(ugl => {
      const locationName = ugl.chef_lieu_ugl?.intitule_loca || 'Non défini'
      counts.set(locationName, (counts.get(locationName) || 0) + 1)
    })
    
    // Convertir en tableau pour Recharts et trier
    return Array.from(counts.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
  }, [uglsRaw])

  // Couleurs pour le pie chart (adaptées pour contraster avec le fond vert de la barre latérale)
  const COLORS = ['#FCD116', '#ffffff', '#3b82f6', '#f97316', '#a78bfa', '#2dd4bf', '#f43f5e']

  const renderLegendText = (value: string) => {
    return <span style={{ color: '#ffffff', fontWeight: 500, marginLeft: '4px' }}>{value}</span>
  }

  return (
    <PanelSection title="Statistiques" icon={BarChart2} defaultOpen={false}>
      {pieData.length > 0 ? (
        <div className="mt-2 pt-1 pb-4">
          <p className="text-[11px] font-bold text-white uppercase mb-4 tracking-wider text-center">
            Répartition des UGL par chef-lieu
          </p>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="45%"
                  innerRadius={40}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.85)', 
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '6px',
                    fontSize: '12px',
                    color: '#fff',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
                  }}
                  itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                />
                <Legend 
                  formatter={renderLegendText}
                  iconType="circle"
                  wrapperStyle={{ paddingTop: '10px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="text-xs text-white/40 italic p-4 text-center">
          Aucune donnée à afficher
        </div>
      )}
    </PanelSection>
  )
}
