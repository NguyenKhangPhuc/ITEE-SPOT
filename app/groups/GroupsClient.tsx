
'use client'
import Link from "next/link"
import { EVENT_STATUS } from "../types/enum"
import { EventGroups, GroupEvents, UserGroupsWithEvent } from "../types/group"
import Image from "next/image";
import { createClient } from "../utils/supabase/client";
import GroupSection from "./GroupSection";
const GroupsClient = ({ groupsWithEvents }: { groupsWithEvents: Array<UserGroupsWithEvent> }) => {
    const supabase = createClient()
    const handleGetUrl = (imagePath: string) => {
        const { data } = supabase.storage.from('attachments').getPublicUrl(imagePath);

        return data.publicUrl;
    }


    return (
        <div className="w-full flex flex-col gap-8 mt-5  min-h-screen">
            {groupsWithEvents?.map((item, index) => (
                <div key={`groups_event ${index}`}>
                    <GroupSection item={item} handleGetUrl={handleGetUrl} />
                </div>

            ))}
        </div>
    )
}

export default GroupsClient