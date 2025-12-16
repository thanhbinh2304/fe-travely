import HeaderClient from "@/components/client/header";
import FooterClient from "@/components/client/footer";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <HeaderClient />
      {children}
      <FooterClient />
    </>
  );
}
