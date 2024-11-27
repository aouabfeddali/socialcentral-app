
export const dynamic = 'force-dynamic';

import {Login} from "@gitroom/frontend/components/auth/login";
import {Metadata} from "next";
import { isGeneralServerSide } from '@gitroom/helpers/utils/is.general.server.side';

export const metadata: Metadata = {
  title: `${isGeneralServerSide() ? 'Smart Create' : 'Gitroom'} Inloggen`,
  description: '',
};

export default async function Auth() {
    return (
        <Login />
    );
}
