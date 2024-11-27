
export const dynamic = 'force-dynamic';

import {Forgot} from "@gitroom/frontend/components/auth/forgot";
import {Metadata} from "next";
import { isGeneralServerSide } from '@gitroom/helpers/utils/is.general.server.side';

export const metadata: Metadata = {
  title: `${isGeneralServerSide() ? 'Smart Create' : 'Gitroom'} Wachtwoord Vergeten`,
  description: '',
};

export default async function Auth() {
    return (
        <Forgot />
    );
}
