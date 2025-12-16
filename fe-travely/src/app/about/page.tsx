import FooterPageLayout from "@/components/FooterPageLayout";

const AboutIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M12 2l3 7h7l-5.5 4.2L18.5 21 12 16.8 5.5 21l2-7.8L2 9h7l3-7z" stroke="white" strokeWidth="1.6"/>
  </svg>
);

function Feature({
  title,
  desc,
}: { title: string; desc: string }) {
  return (
    <div className="not-prose rounded-xl border border-slate-100 p-4 hover:border-slate-200 transition">
      <div className="font-semibold text-[#1a2b49]">{title}</div>
      <div className="mt-1 text-slate-600 leading-7">{desc}</div>
    </div>
  );
}

export default function AboutPage() {
  return (
    <FooterPageLayout
      title="Về Travely"
      subtitle="Nền tảng đặt tour trực tuyến giúp bạn khám phá, so sánh và đặt trải nghiệm du lịch nhanh chóng — minh bạch — an toàn."
      icon={<AboutIcon />}
    >
      <p>
        Travely được xây dựng để tối ưu hành trình từ lúc bạn tìm kiếm tour, xem lịch trình,
        so sánh giá, đến khi đặt tour và theo dõi trạng thái booking.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <Feature
          title="Minh bạch thông tin"
          desc="Hiển thị rõ giá người lớn/trẻ em, số lượng chỗ, thời gian khởi hành – kết thúc và hình ảnh tour."
        />
        <Feature
          title="Đặt tour nhanh"
          desc="Quy trình booking gọn, dễ theo dõi trạng thái: pending / confirmed / completed / cancelled."
        />
        <Feature
          title="Hỗ trợ khách hàng"
          desc="Kênh hỗ trợ qua email/hotline, đồng thời cập nhật thông báo cho người dùng."
        />
      </div>

      <h2 className="mt-10">Sứ mệnh</h2>
      <p>
        Mang đến trải nghiệm đặt tour trực tuyến đơn giản, đáng tin cậy; giúp người dùng
        yên tâm lên kế hoạch và tận hưởng chuyến đi.
      </p>

      <h2 className="mt-8">Tầm nhìn</h2>
      <p>
        Trở thành nền tảng trải nghiệm du lịch trực tuyến được người dùng Việt Nam ưu tiên lựa chọn.
      </p>
    </FooterPageLayout>
  );
}
