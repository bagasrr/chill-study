// file: app/dashboard/kelas/[kelasnama]/materi/[id]/page.tsx (VERSI FINAL)

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { Typography, Skeleton, Paper, Button, Divider } from "@mui/material";
import { Videocam as VideoIcon, PictureAsPdf as PdfIcon, Download as DownloadIcon } from "@mui/icons-material";
import toast from "react-hot-toast";

// Komponen & Fungsi Helper
import VideoPlayer from "@/components/MediaPlayer/VideoPlayer";
import { saveProgress } from "@/lib/api/progress";

// Definisikan tipe data yang sesuai dengan model Prisma
interface MateriContent {
  id: string;
  type: "VIDEO" | "PDF";
  title: string;
  url: string;
  weight: number;
}

interface MateriDetail {
  id: string;
  title: string;
  content: string;
  contents: MateriContent[];
}

const MateriDetailPage = () => {
  const { id: materiId } = useParams<{ id: string }>();

  // State
  const [materiDetail, setMateriDetail] = useState<MateriDetail | null>(null);
  const [mainVideo, setMainVideo] = useState<MateriContent | null>(null);
  const [attachments, setAttachments] = useState<MateriContent[]>([]);
  const [activePdfUrl, setActivePdfUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVideoProgressSaved, setIsVideoProgressSaved] = useState(false);

  useEffect(() => {
    if (!materiId) return;

    const fetchMateriDetail = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`/api/${materiId}/details/materi`);
        console.log(res.data);
        const data: MateriDetail = res.data;
        setMateriDetail(data);
        setIsVideoProgressSaved(false);

        const allContents = data.contents || [];
        const firstVideoIndex = allContents.findIndex((c) => c.type === "VIDEO");

        if (firstVideoIndex !== -1) {
          const video = allContents[firstVideoIndex];
          setMainVideo(video);
          setAttachments(allContents.filter((_, index) => index !== firstVideoIndex));
        } else {
          setMainVideo(null);
          setAttachments(allContents);
        }
      } catch (err) {
        console.error("Gagal mengambil detail materi:", err);
        toast.error("Gagal memuat materi.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMateriDetail();
  }, [materiId]);

  const handleVideoEnd = (contentId: string) => {
    saveProgress(contentId)
      .then(() => toast.success("Video telah ditandai selesai!"))
      .catch(() => toast.error("Gagal menyimpan progress."));
  };

  const handleVideoPlay = () => {
    if (mainVideo && !isVideoProgressSaved) {
      saveProgress(mainVideo.id)
        .then(() => {
          console.log(`Progress disimpan untuk video: ${mainVideo.title}`);
          toast.success("Progress video dimulai!");
          setIsVideoProgressSaved(true);
        })
        .catch(console.error);
    }
  };

  const handleAttachmentClick = (attachment: MateriContent) => {
    if (attachment.type === "PDF") {
      const newUrl = activePdfUrl === attachment.url ? null : attachment.url;
      setActivePdfUrl(newUrl);
      if (newUrl) {
        saveProgress(attachment.id)
          .then(() => toast.success("Progress PDF dimulai!"))
          .catch(console.error);
      }
    } else if (attachment.type === "VIDEO") {
      window.open(attachment.url, "_blank");
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 md:p-8">
        <Skeleton variant="text" width="60%" height={48} />
        <Skeleton variant="rectangular" sx={{ mt: 2 }} width="100%" height={450} />
        <Skeleton variant="text" sx={{ mt: 4 }} width="80%" />
        <Skeleton variant="text" width="70%" />
      </div>
    );
  }

  if (!materiDetail) {
    return <Typography className="p-8 text-center">Materi tidak ditemukan.</Typography>;
  }

  return (
    <div className="p-4 md:p-6 bg-white rounded-lg shadow-md">
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: "bold" }}>
        {materiDetail.title}
      </Typography>
      <Divider sx={{ mb: 3 }} />

      {mainVideo ? (
        <div className="mb-6 rounded-lg overflow-hidden">
          <VideoPlayer key={mainVideo.id} videoId={mainVideo.url} onPlay={handleVideoPlay} onEnd={() => handleVideoEnd(mainVideo.id)} />
        </div>
      ) : (
        <Paper elevation={0} sx={{ p: 4, mb: 4, bgcolor: "grey.100", textAlign: "center", borderRadius: "8px" }}>
          <Typography>Tidak ada video utama untuk materi ini.</Typography>
        </Paper>
      )}

      {materiDetail.content && (
        <div className="prose max-w-none mb-8 text-gray-700">
          <Typography variant="body1">{materiDetail.content}</Typography>
        </div>
      )}

      {attachments.length > 0 && (
        <div className="mb-6">
          <Typography variant="h6" sx={{ fontWeight: "bold" }} gutterBottom>
            Lampiran & Materi Tambahan
          </Typography>
          <div className="flex flex-col gap-3">
            {attachments.map((att) => (
              <Paper key={att.id} variant="outlined" className="flex items-center justify-between p-3">
                <div className="flex items-center gap-3">
                  {att.type === "VIDEO" ? <VideoIcon color="action" /> : <PdfIcon color="error" />}
                  <Typography>{att.title}</Typography>
                </div>
                <Button variant="contained" size="small" startIcon={att.type === "PDF" ? undefined : <DownloadIcon />} onClick={() => handleAttachmentClick(att)}>
                  {att.type === "PDF" ? "Lihat" : "Download"}
                </Button>
              </Paper>
            ))}
          </div>
        </div>
      )}

      {activePdfUrl && (
        <div>
          <iframe src={activePdfUrl} className="w-full h-[80vh] border rounded-md" title="PDF Viewer" />
        </div>
      )}
    </div>
  );
};

export default MateriDetailPage;
