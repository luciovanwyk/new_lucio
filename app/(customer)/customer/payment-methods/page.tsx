// src/app/settings/payment/page.tsx (Example Location)
 // Adjust path if needed (@ points to src)
import React from 'react';
import PaymentMethodsManager from './_components/PaymentMethod';

// This can likely remain a Server Component
export default function PaymentSettingsPage() {
  return (
    <div>
      {/* Optional: Add page-level layout, titles, etc. */}
      {/* <h1 className="text-3xl font-bold mb-6">Manage Payment Methods</h1> */}

      {/* Render the component that handles all the logic */}
      <PaymentMethodsManager />

      {/* Optional: Add other content related to this page */}
    </div>
  );
}
