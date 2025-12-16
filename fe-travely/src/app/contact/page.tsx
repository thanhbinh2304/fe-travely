"use client";

import FooterPageLayout from "@/components/FooterPageLayout";

const ContactIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M4 4h16v16H4V4z" stroke="white" strokeWidth="1.6"/>
    <path d="M4 8l8 6 8-6" stroke="white" strokeWidth="1.6"/>
  </svg>
);

function InfoCard({
  title,
  value,
  sub,
}: { title: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-slate-100 p-4">
      <div className="text-sm text-slate-500">{title}</div>
      <div className="mt-1 font-semibold text-[#1a2b49]">{value}</div>
      {sub ? <div className="mt-1 text-slate-600 text-sm">{sub}</div> : null}
    </div>
  );
}

export default function ContactPage() {
  return (
    <FooterPageLayout
      title="Liên hệ"
      subtitle="Gửi yêu cầu hỗ trợ hoặc góp ý — Travely sẽ phản hồi sớm nhất có thể."
      icon={<ContactIcon />}
      aside={
        <div>
          <h3 className="text-lg font-semibold text-[#1a2b49]">Thông tin liên hệ</h3>
          <div className="mt-4 space-y-3">
            <InfoCard title="Email" value="support@travely.vn" sub="Phản hồi trong giờ hành chính" />
            <InfoCard title="Hotline" value="1900 1234" sub="Thứ 2 – Thứ 6 (8:00 – 17:30)" />
            <InfoCard title="Địa chỉ" value="Hà Nội, Việt Nam" sub="Văn phòng Travely" />
          </div>
        </div>
      }
    >
      <p>
        Bạn có thể liên hệ qua email/hotline hoặc gửi form bên dưới. Chúng tôi ưu tiên xử lý
        các vấn đề liên quan đến đăng nhập, thanh toán, booking và hoàn/huỷ.
      </p>

      <div className="not-prose mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form (UI only) */}
        <div className="rounded-2xl border border-slate-100 p-5">
          <div className="font-semibold text-[#1a2b49] text-lg">Gửi yêu cầu</div>
          <div className="mt-4 grid grid-cols-1 gap-3">
            <input
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-[#1a2b49]/20"
              placeholder="Họ và tên"
            />
            <input
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-[#1a2b49]/20"
              placeholder="Email"
            />
            <input
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-[#1a2b49]/20"
              placeholder="Số điện thoại (tuỳ chọn)"
            />
            <select
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-[#1a2b49]/20"
              defaultValue="support"
            >
              <option value="support">Hỗ trợ kỹ thuật</option>
              <option value="booking">Vấn đề booking</option>
              <option value="payment">Thanh toán</option>
              <option value="feedback">Góp ý</option>
            </select>
            <textarea
              className="w-full min-h-[120px] rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-[#1a2b49]/20"
              placeholder="Nội dung"
            />
            <button
              type="button"
              className="mt-2 inline-flex items-center justify-center rounded-xl bg-[#1a2b49] px-4 py-3 text-white font-medium hover:opacity-95"
              onClick={() => alert("Demo UI: Chưa nối API gửi liên hệ.")}
            >
              Gửi yêu cầu
            </button>
            <div className="text-xs text-slate-500 leading-5">
              * Đây là form giao diện (demo). Nếu bạn muốn, mình nối API lưu liên hệ vào DB luôn.
            </div>
          </div>
        </div>

        {/* Map / Image */}
        <div className="rounded-2xl overflow-hidden border border-slate-100">
          <iframe
            title="Travely location"
            className="w-full h-[360px]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps?q=Hanoi%20Vietnam&output=embed"
          />
        </div>
      </div>
    </FooterPageLayout>
  );
}
