import { useState } from "react";
import { useGalleryItems } from "../../hooks/useGallery";
import { useClubs } from "../../hooks/useClubs";
import { FormSelect } from "../../components/ui/FormField";
import { Pagination } from "../../components/ui/Pagination";
import { EmptyState } from "../../components/ui/EmptyState";
import { Skeleton } from "../../components/ui/Skeleton";

export function Gallery() {
  const [selectedClubId, setSelectedClubId] = useState<string>("");
  const [page, setPage] = useState(1);
  const limit = 9; // Grid display limit

  // Load clubs for filtering
  const { data: clubsData } = useClubs({ limit: 100 });
  const clubOptions = [
    { value: "", label: "All Clubs" },
    ...(clubsData?.items.map((club) => ({
      value: club.id,
      label: club.name,
    })) || []),
  ];

  // Load gallery items
  const { data: galleryData, isLoading, isError } = useGalleryItems({
    clubId: selectedClubId || undefined,
    page,
    limit,
  });

  const handleClubChange = (clubId: string) => {
    setSelectedClubId(clubId);
    setPage(1);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 animate-fade-in">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <span className="eyebrow">Moments & Memories</span>
          <h1 className="mt-2 text-4xl tracking-tight" style={{color: '#0A0A0A', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800}}>Community Gallery</h1>
          <p className="mt-2 text-sm" style={{color: '#555555'}}>
            A visual showcase of events, workshops, hackathons, and activities across student communities.
          </p>
        </div>

        <div className="w-full sm:w-64">
          <FormSelect
            label="Filter by Club"
            name="clubFilter"
            value={selectedClubId}
            onChange={(e) => handleClubChange(e.target.value)}
            options={clubOptions}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square" />
          ))}
        </div>
      ) : isError ? (
        <div className="surface border-2 border-ink p-6 text-center bg-white rounded-none shadow-brutal">
          <p className="text-sm text-[#FF3B3B] font-bold">Failed to load gallery images.</p>
        </div>
      ) : !galleryData || galleryData.items.length === 0 ? (
        <EmptyState title="No images found" description="Try selecting a different club filter or upload some images first." />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {galleryData.items.map((item) => {
              const matchedClub = clubsData?.items.find((c) => c.id === item.clubId);
              return (
                <div
                  key={item.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '2px solid #0A0A0A',
                    boxShadow: '4px 4px 0px #0A0A0A',
                    borderRadius: 0,
                  }}
                  className="group overflow-hidden"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.caption || "Gallery image"}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=800&q=80";
                      }}
                    />
                    {matchedClub && (
                      <span
                        style={{
                          backgroundColor: '#0A0A0A',
                          color: '#C8F135',
                          border: '1.5px solid #0A0A0A',
                          fontFamily: 'DM Sans, sans-serif',
                          fontSize: 9,
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                          padding: '2px 6px',
                          borderRadius: 0,
                        }}
                        className="absolute left-3 top-3"
                      >
                        {matchedClub.name}
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <p style={{ color: '#0A0A0A' }} className="text-sm font-semibold line-clamp-2 min-h-[2.5rem]">
                      {item.caption || "No description provided."}
                    </p>
                    <div style={{ borderTop: '2px solid #0A0A0A', marginTop: 16, paddingTop: 12 }} className="flex items-center justify-between text-[11px] text-muted">
                      <span>Uploaded by {item.createdBy?.name || "Member"}</span>
                      <span className="font-mono">{new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8">
            <Pagination pagination={galleryData.pagination} onPageChange={setPage} />
          </div>
        </>
      )}
    </div>
  );
}
