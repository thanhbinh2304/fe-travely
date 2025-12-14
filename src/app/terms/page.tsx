import FooterPageLayout from "@/components/FooterPageLayout";

const FileIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M6 2h8l4 4v16H6V2z" stroke="white" strokeWidth="1.6" />
    <path d="M14 2v6h6" stroke="white" strokeWidth="1.6" />
    <path d="M8 12h8M8 16h8" stroke="white" strokeWidth="1.6" />
  </svg>
);

function Section({
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

function Pill({
  title,
  desc,
}: {
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-xl border border-slate-100 p-4">
      <div className="font-semibold text-[#1a2b49]">{title}</div>
      <div className="mt-1 text-slate-600 leading-7">{desc}</div>
    </div>
  );
}

export default function TermsPage() {
  return (
    <FooterPageLayout
      title="Điều khoản & Điều kiện"
      subtitle="Các quy định khi sử dụng Travely. Vui lòng đọc kỹ để đảm bảo quyền lợi của bạn."
      icon={<FileIcon />}
      aside={
        <div>
          <h3 className="text-lg font-semibold text-[#1a2b49]">Điểm chính</h3>
          <div className="mt-4 space-y-3">
            <Pill
              title="Tài khoản"
              desc="Bạn chịu trách nhiệm bảo mật thông tin đăng nhập và tính chính xác của dữ liệu cung cấp."
            />
            <Pill
              title="Booking"
              desc="Trạng thái booking/hoàn huỷ phụ thuộc quy định của nhà cung cấp và chính sách hệ thống."
            />
            <Pill
              title="Nội dung"
              desc="Không sử dụng nền tảng cho hành vi vi phạm pháp luật hoặc gây ảnh hưởng hệ thống."
            />
          </div>
        </div>
      }
    >
      <p>
        Điều khoản này quy định quyền và nghĩa vụ của người dùng khi truy cập và sử dụng nền tảng Travely.
        Nếu bạn không đồng ý với bất kỳ nội dung nào, vui lòng ngừng sử dụng dịch vụ.
      </p>

      <div className="not-prose mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Pill
          title="Vai trò Travely"
          desc="Travely đóng vai trò nền tảng kết nối và hỗ trợ đặt tour, không phải đơn vị trực tiếp tổ chức mọi tour."
        />
        <Pill
          title="Phạm vi dịch vụ"
          desc="Cung cấp tìm kiếm tour, đặt tour, quản lý booking, thông báo, thanh toán (nếu triển khai)."
        />
      </div>

      <div className="mt-10 space-y-8">
        <Section title="1. Điều kiện sử dụng">
          <ul className="list-disc pl-6">
            <li>Người dùng cung cấp thông tin chính xác khi đăng ký và đặt tour.</li>
            <li>Không sử dụng nền tảng để gian lận, phá hoại hoặc truy cập trái phép.</li>
            <li>Tuân thủ quy định pháp luật và quy định của nhà cung cấp tour.</li>
          </ul>
        </Section>

        <Section title="2. Tài khoản và bảo mật">
          <p>
            Bạn có trách nhiệm bảo mật tài khoản và mật khẩu của mình. Travely không chịu trách nhiệm
            cho các rủi ro phát sinh khi bạn chia sẻ thông tin đăng nhập cho bên thứ ba.
          </p>
        </Section>

        <Section title="3. Đặt tour và thanh toán">
          <ul className="list-disc pl-6">
            <li>Thông tin giá và lịch trình được hiển thị theo dữ liệu hệ thống và/hoặc nhà cung cấp.</li>
            <li>Thanh toán (nếu có) được xử lý theo phương thức Travely hỗ trợ tại thời điểm đặt.</li>
            <li>Người dùng cần kiểm tra kỹ thông tin trước khi xác nhận booking.</li>
          </ul>
        </Section>

        <Section title="4. Hoàn/huỷ và thay đổi booking">
          <p>
            Chính sách hoàn/huỷ phụ thuộc trạng thái booking và quy định của nhà cung cấp.
            Travely sẽ hiển thị trạng thái và hỗ trợ bạn gửi yêu cầu khi cần thiết.
          </p>
        </Section>

        <Section title="5. Giới hạn trách nhiệm">
          <p>
            Travely nỗ lực đảm bảo nền tảng hoạt động ổn định, tuy nhiên có thể phát sinh gián đoạn
            do bảo trì hoặc sự cố kỹ thuật. Travely không chịu trách nhiệm cho thiệt hại gián tiếp
            phát sinh ngoài phạm vi kiểm soát hợp lý.
          </p>
        </Section>

        <Section title="6. Liên hệ & khiếu nại">
          <p>
            Nếu có thắc mắc hoặc khiếu nại, bạn vui lòng gửi qua trang{" "}
            <a className="text-[#1a2b49] underline" href="/contact">Liên hệ</a>{" "}
            để được hỗ trợ.
          </p>
        </Section>
      </div>
    </FooterPageLayout>
  );
}
