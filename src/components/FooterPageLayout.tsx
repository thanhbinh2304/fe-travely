import Link from "next/link";
import React from "react";

function IconCircle({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-11 w-11 rounded-xl bg-white/10 ring-1 ring-white/15 flex items-center justify-center">
      {children}
    </div>
  );
}

export default function FooterPageLayout({
  title,
  subtitle,
  icon,
  crumbs,
  children,
  aside,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  crumbs?: { label: string; href?: string }[];
  children: React.ReactNode;
  aside?: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f6f8fc]">
      {/* HERO */}
      <div className="relative overflow-hidden bg-[#0f1f3a]">
        <div className="absolute inset-0 opacity-60">
          <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[#2b6fff] blur-3xl" />
          <div className="absolute -bottom-40 -right-40 h-[28rem] w-[28rem] rounded-full bg-[#a855f7] blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 pt-8 pb-10">
          {/* breadcrumb */}
          <div className="text-sm text-white/75">
            {(crumbs ?? [{ label: "Trang chủ", href: "/" }, { label: title }]).map(
              (c, idx, arr) => (
                <span key={idx}>
                  {c.href ? (
                    <Link className="hover:text-white" href={c.href}>
                      {c.label}
                    </Link>
                  ) : (
                    <span className="text-white">{c.label}</span>
                  )}
                  {idx < arr.length - 1 ? <span className="mx-2">/</span> : null}
                </span>
              )
            )}
          </div>

          <div className="mt-6 flex items-start gap-4">
            {icon ? <IconCircle>{icon}</IconCircle> : null}

            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">{title}</h1>
              {subtitle ? (
                <p className="mt-2 max-w-2xl text-white/80 leading-7">
                  {subtitle}
                </p>
              ) : null}
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/"
                  className="px-4 py-2 rounded-lg bg-white text-[#0f1f3a] font-medium hover:bg-white/90"
                >
                  Về trang chủ
                </Link>
                <Link
                  href="/contact"
                  className="px-4 py-2 rounded-lg bg-white/10 text-white ring-1 ring-white/20 hover:bg-white/15"
                >
                  Liên hệ hỗ trợ
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="-mt-10">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <main className="lg:col-span-8">
              <div className="bg-white rounded-2xl shadow-sm ring-1 ring-black/5 p-6 md:p-8">
                <div className="prose prose-slate max-w-none">
                  {children}
                </div>
              </div>
            </main>

            <aside className="lg:col-span-4 space-y-6">
              {/* default aside */}
              <div className="bg-white rounded-2xl shadow-sm ring-1 ring-black/5 p-6">
                <h3 className="text-lg font-semibold text-[#1a2b49]">Truy cập nhanh</h3>
                <div className="mt-4 space-y-2">
                  <Link className="block text-[#1a2b49] hover:underline" href="/about">
                    Về chúng tôi
                  </Link>
                  <Link className="block text-[#1a2b49] hover:underline" href="/privacy">
                    Chính sách bảo mật
                  </Link>
                  <Link className="block text-[#1a2b49] hover:underline" href="/terms">
                    Điều khoản & Điều kiện
                  </Link>
                  <Link className="block text-[#1a2b49] hover:underline" href="/contact">
                    Liên hệ
                  </Link>
                </div>
              </div>

              {aside ? (
                <div className="bg-white rounded-2xl shadow-sm ring-1 ring-black/5 p-6">
                  {aside}
                </div>
              ) : null}

              <div className="rounded-2xl p-6 bg-[#1a2b49] text-white">
                <h3 className="text-lg font-semibold">Bạn cần hỗ trợ ngay?</h3>
                <p className="mt-2 text-white/85 leading-7">
                  Gửi yêu cầu, Travely sẽ phản hồi trong giờ hành chính.
                </p>
                <Link
                  href="/contact"
                  className="mt-4 inline-block px-4 py-2 rounded-lg bg-white text-[#1a2b49] font-medium hover:bg-white/90"
                >
                  Tạo yêu cầu hỗ trợ
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
