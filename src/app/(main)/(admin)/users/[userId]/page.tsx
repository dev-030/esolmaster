import { UserInfo } from "@/webcomponents/admin";

export interface UserPageProps {
    params: Promise<{ userId: string }>;
}

export default async function UserPage({params}: UserPageProps) {
    const { userId } = await params;

    return <UserInfo id={userId} />;
}