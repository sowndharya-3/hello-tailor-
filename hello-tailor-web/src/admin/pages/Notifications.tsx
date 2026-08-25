import { useState } from 'react';
import { Send, Clock } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import StatusBadge from '../components/ui/StatusBadge';
import DataTable, { type Column } from '../components/ui/DataTable';
import SegmentedControl from '../components/ui/SegmentedControl';
import { useToast } from '../components/ui/Toast';
import { useStore } from '@/store/useStore';
import type { AdminNotification } from '@/store/types';

const targets: AdminNotification['target'][] = ['All Customers', 'All Tailors', 'Premium Members', 'Specific Tailor', 'Specific Customer'];

export default function Notifications() {
  const { show } = useToast();
  const history = useStore((s) => s.adminNotifications);
  const sendNotification = useStore((s) => s.sendNotification);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [target, setTarget] = useState<AdminNotification['target']>('All Customers');
  const [sendMode, setSendMode] = useState('Send Now');
  const [scheduleDate, setScheduleDate] = useState('');

  function handleSend() {
    if (!title || !message) {
      show('error', 'Title and message are required.');
      return;
    }
    const record: AdminNotification = {
      id: `NTF-${history.length + 1}`,
      title, message, target,
      sentDate: sendMode === 'Send Now' ? new Date().toISOString().slice(0, 10) : (scheduleDate || new Date().toISOString().slice(0, 10)),
      status: sendMode === 'Send Now' ? 'Sent' : 'Scheduled',
      recipients: target === 'All Customers' ? 14200 : target === 'All Tailors' ? 980 : Math.floor(Math.random() * 3000) + 1,
    };
    sendNotification(record);
    show('success', sendMode === 'Send Now' ? 'Notification sent successfully.' : 'Notification scheduled successfully.');
    setTitle(''); setMessage('');
  }

  const columns: Column<AdminNotification>[] = [
    { key: 'title', header: 'Title' },
    { key: 'target', header: 'Target' },
    { key: 'recipients', header: 'Recipients', sortValue: (n) => n.recipients, render: (n) => n.recipients.toLocaleString('en-IN') },
    { key: 'sentDate', header: 'Date', sortValue: (n) => n.sentDate },
    { key: 'status', header: 'Status', render: (n) => <StatusBadge status={n.status} /> },
  ];

  return (
    <div>
      <PageHeader title="Notification Management" description="Compose and track push notifications" />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <Card className="xl:col-span-1">
          <h3 className="mb-4 text-base font-semibold text-ht-navy">Compose Notification</h3>
          <div className="flex flex-col gap-4">
            <Input label="Title" placeholder="e.g. Festive Season Offer!" value={title} onChange={(e) => setTitle(e.target.value)} />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-ht-text">Message</label>
              <textarea rows={4} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Write your notification message..." className="w-full rounded-xl border border-ht-border px-3.5 py-2.5 text-sm outline-none focus:border-ht-ocean focus:ring-2 focus:ring-ht-ocean/20" />
            </div>
            <Select label="Target Audience" value={target} onChange={(e) => setTarget(e.target.value as AdminNotification['target'])} options={targets.map((t) => ({ label: t, value: t }))} />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ht-text">Delivery</label>
              <SegmentedControl options={['Send Now', 'Schedule']} active={sendMode} onChange={setSendMode} />
            </div>
            {sendMode === 'Schedule' && (
              <Input label="Schedule Date & Time" type="datetime-local" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} />
            )}
            <Button icon={sendMode === 'Send Now' ? <Send size={16} /> : <Clock size={16} />} onClick={handleSend}>
              {sendMode === 'Send Now' ? 'Send Notification' : 'Schedule Notification'}
            </Button>
          </div>
        </Card>

        <Card className="xl:col-span-2" padded={false}>
          <div className="p-5 pb-0">
            <h3 className="text-base font-semibold text-ht-navy">Sent History</h3>
          </div>
          <div className="p-5">
            <DataTable columns={columns} rows={history} rowKey={(n) => n.id} emptyTitle="No Notifications Sent" />
          </div>
        </Card>
      </div>
    </div>
  );
}
