import HeaderClient from "@/components/client/header";
import FooterClient from "@/components/client/footer";

export default function ClientLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    // Layout cho client - có Header/Footer
    return (
        <>
            <HeaderClient />
            {children}
            <FooterClient />
        </>
    );
}
