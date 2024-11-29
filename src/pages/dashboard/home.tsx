import { Card } from '@/components/ui/card';
import { Users, Calendar, AlertCircle } from 'lucide-react';

const stats = [
  {
    name: 'Total Suppliers',
    value: '48',
    icon: Users,
    change: '+4.75%',
    changeType: 'positive',
  },
  {
    name: 'Active Events',
    value: '12',
    icon: Calendar,
    change: '+54.02%',
    changeType: 'positive',
  },
  {
    name: 'Pending Tasks',
    value: '23',
    icon: AlertCircle,
    change: '-12.45%',
    changeType: 'negative',
  },
];

export default function DashboardHome() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back! Here's what's happening with your events today.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.name} className="px-4 py-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Icon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">
                        {stat.value}
                      </div>
                    </dd>
                  </dl>
                </div>
                <div className="ml-5">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      stat.changeType === 'positive'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}