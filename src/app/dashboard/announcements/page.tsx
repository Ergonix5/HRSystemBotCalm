import AnnouncementsHeader from "../../../components/AnnouncementsHeader/AnnouncementsHeader";
import AnnouncementsList from "./../../../components/AnnouncementsHeader/AnnouncementsList";
import AnnouncementsFooter from "./../../../components/AnnouncementsHeader/AnnouncementsFooter";

export default function AnnouncementsPage() {
  return (
    <div className="flex h-screen flex-col bg-gray-50 border border-gray">
      {/* Header */}
      <div className="p-6">
        <AnnouncementsHeader />
      </div>

      {/* Scrollable Content */}
      <div className="flex flex-1 flex-col overflow-hidden px-6">
        <p className="mb-3 text-sm text-black font-semibold">
          Showing 7 announcements
        </p>

        {/* Inner Scroll Area */}
        <div className="flex-1 overflow-y-auto pr-2">
          <AnnouncementsList />
        </div>
      </div>

      {/* Fixed Footer */}
      <AnnouncementsFooter total={7} highPriority={0} active={0} expiringSoon={0} />
    </div>
  );
}
