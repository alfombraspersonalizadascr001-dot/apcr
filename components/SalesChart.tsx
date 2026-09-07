'use client';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

interface SalesChartProps {
  data7Days: { date: string; count: number; revenue: number }[];
}

export function SalesChart({ data7Days }: SalesChartProps) {
  // Revertimos el array si es necesario para que muestre de más antiguo a más reciente
  // Array.from() que hicimos genera de más antiguo a más reciente, así que validemos.
  const data = {
    labels: data7Days.map(d => d.date),
    datasets: [
      {
        type: 'bar' as const,
        label: 'Cantidad Vendida',
        data: data7Days.map(d => d.count),
        backgroundColor: 'rgba(99, 102, 241, 0.8)', // Indigo 500
        borderColor: 'rgb(79, 70, 229)',
        borderWidth: 2,
        borderRadius: 4,
        yAxisID: 'y',
        order: 2,
      },
      {
        type: 'line' as const,
        label: 'Monto Vendido (CRC)',
        data: data7Days.map(d => d.revenue),
        backgroundColor: 'rgba(16, 185, 129, 0.2)', // Emerald
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 3,
        pointBackgroundColor: 'rgb(16, 185, 129)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: true,
        yAxisID: 'y1',
        order: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          boxWidth: 8,
          font: { weight: 'bold' as const }
        }
      },
      title: {
        display: false,
      },
      tooltip: {
        padding: 12,
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleFont: { size: 14, weight: 'bold' as const },
        bodyFont: { size: 13 },
        cornerRadius: 8,
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.datasetIndex === 1) { // Revenue
              label += new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC', minimumFractionDigits: 0 }).format(context.raw);
            } else {
              label += context.raw + ' uds';
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: { weight: 'bold' as const, size: 11 }
        }
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Unidades',
          font: { size: 10, weight: 'bold' as const }
        },
        grid: {
          color: 'rgba(0,0,0,0.05)',
        },
        ticks: {
          stepSize: 1,
        }
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: 'Ingresos',
          font: { size: 10, weight: 'bold' as const }
        },
        grid: {
          drawOnChartArea: false, // only want the grid lines for one axis to show up
        },
        ticks: {
          callback: function(value: any) {
            return '¢' + value.toLocaleString();
          }
        }
      },
    },
  };

  return (
    <div className="w-full h-full">
      <Chart type="bar" data={data as any} options={options as any} />
    </div>
  );
}
