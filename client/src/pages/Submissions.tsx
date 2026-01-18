import PortalLayout from "@/components/PortalLayout";

export default function Submissions() {
  return (
    <PortalLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Project Submissions</h1>
          <p className="text-gray-600 mt-2">Manage your team's project submissions</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-600">Project submissions will be available soon</p>
        </div>
      </div>
    </PortalLayout>
  );
}
