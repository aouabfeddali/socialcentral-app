
export const dynamic = 'force-dynamic';

import { BillingComponent } from '@gitroom/frontend/components/billing/billing.component';
import { Metadata } from 'next';
import { isGeneralServerSide } from '@gitroom/helpers/utils/is.general.server.side';

export const metadata: Metadata = {
  title: `${isGeneralServerSide() ? 'Smart Create' : 'Gitroom'} Facturering`,
  description: '',
};

export default async function Page() {
  return <BillingComponent />;
}
