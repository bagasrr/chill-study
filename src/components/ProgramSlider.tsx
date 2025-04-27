import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import ProgramCard from "./ProgramCard";
import SwiperNavButton from "./NavArrow";
import { useFetchData } from "@/lib/hooks/useFetchData";
import { Kelas } from "@prisma/client";

export default function CustomSwiper() {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const { data: kelas } = useFetchData<Kelas[]>("/api/kelas");

  return (
    <div className="relative w-full md:w-1/2 px-4 py-10  text-white">
      <div className="absolute -top-5 right-5 z-10 flex gap-2">
        <SwiperNavButton direction="prev" buttonRef={prevRef} />
        <SwiperNavButton direction="next" buttonRef={nextRef} />
      </div>

      {/* Panah kanan */}
      <Swiper
        modules={[Navigation, Pagination]}
        slidesPerView="auto" // penting biar kita bisa atur lebar masing2 slide
        spaceBetween={20} // jarak antar slide
        centeredSlides={false} // biar slide gak di tengah, jadi terlihat sebelahnya
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        pagination={{
          el: ".custom-pagination",
          clickable: true,
          renderBullet: (index, className) => {
            return `<span class="${className} w-3 h-3 inline-block rounded-full bg-slate-400 mx-1"></span>`;
          },
        }}
        onBeforeInit={(swiper) => {
          if (swiper.params?.navigation && typeof swiper.params.navigation === "object") {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
          }
        }}
      >
        {kelas?.map((program, index) => (
          <SwiperSlide
            key={index}
            style={{ width: "90%", maxWidth: "768px" }} // atur ukuran tiap slide biar sisa ruang terlihat
          >
            <ProgramCard
              thumbnail={program.thumbnail ?? ""} // provide a default value when thumbnail is null
              title={program.title}
              deskripsi={program.deskripsi ?? ""}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Pagination */}
      <div className="custom-pagination mt-6 flex justify-center" />
    </div>
  );
}
