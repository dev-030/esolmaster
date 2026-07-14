import { TranstackProvider } from "@/provider/TranstackProvider";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <TranstackProvider>{children}</TranstackProvider>;
}
