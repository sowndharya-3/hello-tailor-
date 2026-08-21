import { useState } from 'react';
import { Save } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useToast } from '../components/ui/Toast';

export default function Settings() {
  const { show } = useToast();
  const [gstEnabled, setGstEnabled] = useState(true);
  const [gstNumber, setGstNumber] = useState('27ABCDE1234F1Z5');
  const [gstRate, setGstRate] = useState('18');
  const [supportEmail, setSupportEmail] = useState('support@hellotailor.in');
  const [supportPhone, setSupportPhone] = useState('+91 98765 43210');
  const [appName, setAppName] = useState('Hello Tailor');

  return (
    <div>
      <PageHeader title="Settings" description="General configuration and invoicing preferences" />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <Card>
          <h3 className="mb-4 text-base font-semibold text-navy">GST Invoice Settings</h3>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between rounded-xl border border-border p-3.5">
              <div>
                <div className="text-sm font-semibold text-text-primary">Enable GST on Invoices</div>
                <div className="text-xs text-text-secondary">Applies GST to all customer-facing invoices</div>
              </div>
              <button onClick={() => setGstEnabled((v) => !v)} className={`inline-flex h-6 w-11 items-center rounded-full transition-colors ${gstEnabled ? 'bg-success' : 'bg-disabled-bg'}`}>
                <span className={`h-5 w-5 rounded-full bg-white shadow transition-transform ${gstEnabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </div>
            <Input label="GSTIN Number" value={gstNumber} onChange={(e) => setGstNumber(e.target.value)} disabled={!gstEnabled} />
            <Input label="GST Rate (%)" type="number" value={gstRate} onChange={(e) => setGstRate(e.target.value)} disabled={!gstEnabled} />
            <Button icon={<Save size={16} />} onClick={() => show('success', 'GST settings saved.')}>Save GST Settings</Button>
          </div>
        </Card>

        <Card>
          <h3 className="mb-4 text-base font-semibold text-navy">General Configuration</h3>
          <div className="flex flex-col gap-4">
            <Input label="Platform Name" value={appName} onChange={(e) => setAppName(e.target.value)} />
            <Input label="Support Email" value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} />
            <Input label="Support Phone" value={supportPhone} onChange={(e) => setSupportPhone(e.target.value)} />
            <Button variant="secondary" icon={<Save size={16} />} onClick={() => show('success', 'General settings saved.')}>Save Changes</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
