// Ported from hello-tailor-app/app/(tailor)/(tabs)/profile.tsx.
import { Link, useNavigate } from 'react-router-dom';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { useMyTailor, useStore } from '@/store/useStore';

function Row({ icon, label, to }: { icon: string; label: string; to: string }) {
  return (
    <Link to={to} className="flex items-center gap-3 border-b border-ht-border px-5 py-3.5 last:border-b-0">
      <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-ht-info-bg">{icon}</span>
      <span className="flex-1 text-[14px] font-medium text-ht-text">{label}</span>
      <span className="text-ht-text-secondary">›</span>
    </Link>
  );
}

export default function Profile() {
  const tailor = useMyTailor();
  const switchRole = useStore((s) => s.switchRole);
  const logout = useStore((s) => s.logout);
  const navigate = useNavigate();

  const completion = Math.round(
    ([
      !!tailor.about,
      tailor.gallery.length > 0,
      tailor.categories.length > 0,
      tailor.services.length > 0,
      !!tailor.locality,
      tailor.experienceYears > 0,
    ].filter(Boolean).length /
      6) *
      100,
  );

  return (
    <div className="pb-10">
      <div className="relative h-[180px] bg-ht-navy">
        <img src={tailor.cover} alt="" className="h-full w-full object-cover" />
        {/* Gradient fade (not a flat tint) so the transition into the avatar zone reads as
            deliberate rather than the banner and avatar visually colliding at a hard edge. */}
        <div className="absolute inset-0 bg-gradient-to-t from-ht-navy/70 via-ht-navy/10 to-transparent" />
      </div>

      <div className="-mt-12 flex flex-col items-center px-4">
        <img
          src={tailor.image}
          alt=""
          className="h-[96px] w-[96px] rounded-full border-4 border-white object-cover shadow-[0_4px_14px_rgba(23,59,87,0.25)]"
        />
        <p className="mt-3 text-[19px] font-semibold text-ht-text">{tailor.name}</p>
        <p className="text-[13px] text-ht-text-secondary">{tailor.shopName}</p>
        <div className="mt-1.5 flex gap-2">
          {tailor.verified && <Badge label="Verified" tone="success" />}
          {tailor.membership !== 'None' && <Badge label={`${tailor.membership} Member`} tone="gold" />}
        </div>
      </div>

      <div className="mx-auto mt-6 max-w-2xl px-4 sm:px-6">
        <Card>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[13px] font-medium text-ht-text-secondary">Profile completion</p>
            <p className="text-[13px] font-semibold text-ht-ocean">{completion}%</p>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-ht-disabled-bg">
            <div className="h-2 rounded-full bg-ht-success" style={{ width: `${completion}%` }} />
          </div>
        </Card>

        <Card className="mt-4">
          <p className="text-[13px] leading-relaxed text-ht-text">{tailor.about}</p>
          <div className="mt-3 grid grid-cols-3 gap-2 border-t border-ht-border pt-3">
            <MetaItem label="Experience" value={`${tailor.experienceYears} yrs`} />
            <MetaItem label="Starting at" value={`₹${tailor.startingPrice}`} />
            <MetaItem label="Delivery" value={`${tailor.deliveryDays} days`} />
          </div>
        </Card>

        <h2 className="mb-2 mt-6 font-semibold text-ht-text">Shop Profile</h2>
        <Card className="p-0">
          <Row icon="✏️" label="Edit Shop Details" to="/tailor/profile/edit" />
          <Row icon="📍" label="Shop Location" to="/tailor/profile/location" />
          <Row icon="🕐" label="Working Hours" to="/tailor/profile/hours" />
          <Row icon="🏷️" label="Stitching Categories" to="/tailor/profile/categories" />
          <Row icon="💵" label="Price List" to="/tailor/profile/pricing" />
          <Row icon="⚙️" label="Order Settings" to="/tailor/profile/settings" />
          <Row icon="🖼️" label="Shop & Portfolio Photos" to="/tailor/profile/photos" />
        </Card>

        <h2 className="mb-2 mt-6 font-semibold text-ht-text">Grow Your Business</h2>
        <Card className="p-0">
          <Row icon="💎" label="Membership Plans" to="/tailor/membership" />
          <Row icon="📣" label="Advertise Your Shop" to="/tailor/advertise" />
          <Row icon="⭐" label="Featured Listing" to="/tailor/featured" />
          <Row icon="💬" label="Customer Reviews" to="/tailor/reviews" />
        </Card>

        <h2 className="mb-2 mt-6 font-semibold text-ht-text">Categories You Offer</h2>
        <Card>
          <div className="flex flex-wrap gap-2">
            {tailor.categories.map((name) => (
              <Badge key={name} label={name} tone="info" />
            ))}
          </div>
        </Card>

        <button onClick={() => { switchRole(); navigate('/role-select', { replace: true }); }} className="mt-8 flex w-full items-center justify-center gap-2 py-3.5 text-[14px] font-semibold text-ht-ocean">
          🔀 Switch Role
        </button>
        <button
          onClick={() => { logout(); navigate('/login', { replace: true }); }}
          className="flex w-full items-center justify-center gap-2 py-3.5 text-[14px] font-semibold text-ht-error"
        >
          🚪 Log Out
        </button>
      </div>
    </div>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-semibold text-ht-text">{value}</p>
      <p className="mt-0.5 text-[11px] text-ht-text-secondary">{label}</p>
    </div>
  );
}
