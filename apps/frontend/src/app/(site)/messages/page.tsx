
export const dynamic = 'force-dynamic';

import {Metadata} from "next";
import { isGeneralServerSide } from '@gitroom/helpers/utils/is.general.server.side';

export const metadata: Metadata = {
  title: `${isGeneralServerSide() ? 'Smart Create' : 'Gitroom'} Berichten`,
  description: '',
}

export default async function Index() {
  return (
     <div className="bg-customColor3 h-[951px] flex flex-col rounded-[4px] border border-customColor6">
       <div className="bg-customColor8 h-[64px]" />
       <div className="flex-1 flex justify-center items-center text-[20px]">
         Selecteer een gesprek en begin te chatten
       </div>
     </div>
  );
}
