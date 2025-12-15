import FooterPageLayout from "@/components/FooterPageLayout";

const ShieldIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 2l8 4v6c0 5-3.5 9.5-8 10-4.5-.5-8-5-8-10V6l8-4z"
      stroke="white"
      strokeWidth="1.6"
    />
    <path d="M9 12l2 2 4-5" stroke="white" strokeWidth="1.6" />
  </svg>
);

function Block({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="not-prose">
      <h2 className="text-xl font-semibold text-[#1a2b49]">{title}</h2>
      <div className="mt-3 text-slate-700 leading-7">{children}</div>
    </section>
  );
}

function InfoCard({
  title,
  desc,
}: {
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-xl border border-slate-100 p-4 hover:border-slate-200 transition">
      <div className="font-semibold text-[#1a2b49]">{title}</div>
      <div className="mt-1 text-slate-600 leading-7">{desc}</div>
    </div>
  );
}

export default function PrivacyPage() {
  return (
    <FooterPageLayout
      title="Chính sách bảo mật"
      subtitle="Travely cam kết bảo vệ dữ liệu cá nhân và minh bạch trong việc thu thập – sử dụng – lưu trữ thông tin."
      icon={<ShieldIcon />}
      aside={
        <div>
          <h3 className="text-lg font-semibold text-[#1a2b49]">Tóm tắt nhanh</h3>
          <div className="mt-4 space-y-3">
            <InfoCard
              title="Thu thập tối thiểu"
              desc="Chỉ thu thập thông tin cần thiết để tạo tài khoản, đặt tour và hỗ trợ."
            />
            <InfoCard
              title="Không bán dữ liệu"
              desc="Travely không bán/cho thuê dữ liệu cá nhân cho bên thứ ba."
            />
            <InfoCard
              title="Bạn có quyền kiểm soát"
              desc="Bạn có thể yêu cầu xem, chỉnh sửa hoặc xoá dữ liệu theo quy định."
            />
          </div>
        </div>
      }
    >
      <p>
        Chính sách này mô tả cách Travely thu thập, sử dụng và bảo vệ thông tin của người dùng khi sử dụng nền tảng.
        Bằng việc truy cập hoặc sử dụng dịch vụ, bạn đồng ý với các nội dung dưới đây.
      </p>

      <div className="not-prose mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoCard
          title="Dữ liệu tài khoản"
          desc="Tên người dùng, email, mật khẩu (được mã hoá), thông tin đăng nhập qua Google (nếu dùng social login)."
        />
        <InfoCard
          title="Dữ liệu đặt tour"
          desc="Thông tin booking, số lượng khách, thời gian, trạng thái và lịch sử thanh toán (nếu có)."
        />
        <InfoCard
          title="Dữ liệu hỗ trợ"
          desc="Nội dung yêu cầu hỗ trợ, phản hồi, thông báo hệ thống để phục vụ chăm sóc khách hàng."
        />
        <InfoCard
          title="Dữ liệu kỹ thuật"
          desc="Một số thông tin kỹ thuật cơ bản (trình duyệt, thời gian truy cập) để cải thiện trải nghiệm."
        />
      </div>

      <div className="mt-10 space-y-8">
        <Block title="1. Mục đích thu thập và sử dụng">
          <ul className="list-disc pl-6">
            <li>Tạo và quản lý tài khoản người dùng.</li>
            <li>Xử lý đặt tour, thanh toán và xác nhận booking.</li>
            <li>Gửi thông báo liên quan đơn hàng, cập nhật dịch vụ.</li>
            <li>Hỗ trợ khách hàng và xử lý khiếu nại (nếu có).</li>
            <li>Phân tích, cải thiện chất lượng sản phẩm/dịch vụ.</li>
          </ul>
        </Block>

        <Block title="2. Chia sẻ thông tin">
          <p>
            Travely có thể chia sẻ dữ liệu trong phạm vi cần thiết để cung cấp dịch vụ (ví dụ: nhà cung cấp tour),
            hoặc theo yêu cầu của cơ quan có thẩm quyền theo quy định pháp luật. Ngoài các trường hợp này,
            Travely không chia sẻ dữ liệu cá nhân khi chưa có sự đồng ý của người dùng.
          </p>
        </Block>

        <Block title="3. Lưu trữ và bảo mật">
          <ul className="list-disc pl-6">
            <li>Mật khẩu được mã hoá (hash) trước khi lưu.</li>
            <li>Giới hạn quyền truy cập dữ liệu theo vai trò (Admin/User).</li>
            <li>Ghi nhận hoạt động hệ thống để phục vụ kiểm tra và khắc phục sự cố.</li>
          </ul>
        </Block>

        <Block title="4. Quyền của người dùng">
          <ul className="list-disc pl-6">
            <li>Yêu cầu xem/chỉnh sửa thông tin cá nhân.</li>
            <li>Yêu cầu xoá tài khoản/dữ liệu theo điều kiện áp dụng.</li>
            <li>Từ chối nhận một số thông báo marketing (nếu có).</li>
          </ul>
          <p className="mt-2">
            Bạn có thể gửi yêu cầu qua trang <a className="text-[#1a2b49] underline" href="/contact">Liên hệ</a>.
          </p>
        </Block>

        <Block title="5. Thay đổi chính sách">
          <p>
            Travely có thể cập nhật chính sách theo thời gian để phù hợp vận hành và quy định.
            Bản cập nhật sẽ được hiển thị trên website. Bạn nên kiểm tra định kỳ để nắm thông tin mới nhất.
          </p>
        </Block>
      </div>
    </FooterPageLayout>
  );
}
