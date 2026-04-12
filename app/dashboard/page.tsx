import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserLinks } from "@/lib/db/links";
import { LinksList } from "@/components/LinksList";
import { CreateLinkDialog } from "@/components/CreateLinkDialog";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const links = await getUserLinks(userId);

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Your Links</h1>
            <p className="text-gray-400">Manage all your shortened links here</p>
          </div>
          <CreateLinkDialog />
        </div>

        <LinksList links={links} />
      </div>
    </div>
  );
}
