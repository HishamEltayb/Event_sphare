import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    companyName: 'EventSphere Agency',
    email: 'contact@eventsphere.com',
    phone: '+1 (555) 123-4567',
    address: '123 Event Street, Suite 100, New York, NY 10001',
  });

  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    supplierAlerts: true,
    eventReminders: true,
    taskDeadlines: true,
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement profile update
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Company Profile</h3>
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Company Name
              </label>
              <Input
                value={profile.companyName}
                onChange={(e) =>
                  setProfile({ ...profile, companyName: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <Input
                type="email"
                value={profile.email}
                onChange={(e) =>
                  setProfile({ ...profile, email: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <Input
                value={profile.phone}
                onChange={(e) =>
                  setProfile({ ...profile, phone: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <Input
                value={profile.address}
                onChange={(e) =>
                  setProfile({ ...profile, address: e.target.value })
                }
              />
            </div>
            <Button type="submit">Save Changes</Button>
          </form>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Notification Preferences</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">
                  Email Updates
                </h4>
                <p className="text-sm text-gray-500">
                  Receive updates about your account
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifications.emailUpdates}
                onChange={(e) =>
                  setNotifications({
                    ...notifications,
                    emailUpdates: e.target.checked,
                  })
                }
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">
                  Supplier Alerts
                </h4>
                <p className="text-sm text-gray-500">
                  Get notified about supplier updates
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifications.supplierAlerts}
                onChange={(e) =>
                  setNotifications({
                    ...notifications,
                    supplierAlerts: e.target.checked,
                  })
                }
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">
                  Event Reminders
                </h4>
                <p className="text-sm text-gray-500">
                  Receive event deadline reminders
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifications.eventReminders}
                onChange={(e) =>
                  setNotifications({
                    ...notifications,
                    eventReminders: e.target.checked,
                  })
                }
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">
                  Task Deadlines
                </h4>
                <p className="text-sm text-gray-500">
                  Get notified about upcoming task deadlines
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifications.taskDeadlines}
                onChange={(e) =>
                  setNotifications({
                    ...notifications,
                    taskDeadlines: e.target.checked,
                  })
                }
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}