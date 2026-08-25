// Ported from hello-tailor-app/app/(tailor)/profile/pricing.tsx.
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ScreenHeader from '@/components/ui/ScreenHeader';
import Button from '@/components/ui/Button';
import { PriceListEditor } from '../components/PriceListEditor';
import { useMyTailor, useStore } from '@/store/useStore';
import type { PriceEntry } from '@/store/useStore';

export default function Pricing() {
  const tailor = useMyTailor();
  const myPrices = useStore((s) => s.myPrices);
  const setPrices = useStore((s) => s.setPrices);
  const [prices, setLocalPrices] = useState<PriceEntry[]>(myPrices);
  const navigate = useNavigate();

  const onSave = () => {
    setPrices(prices);
    navigate(-1);
  };

  return (
    <div>
      <ScreenHeader title="Price List" />
      <div className="mx-auto max-w-2xl px-4 py-4 sm:px-6">
        <PriceListEditor categoryIds={tailor.categories} prices={prices} onChange={setLocalPrices} />
      </div>
      <div className="mx-auto max-w-2xl px-4 pb-6 sm:px-6">
        <Button label="Save Changes" onClick={onSave} />
      </div>
    </div>
  );
}
