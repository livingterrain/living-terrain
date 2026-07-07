import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function LibrarySlugRedirect({ params }: PageProps) {
  const { slug } = await params;
  redirect(`/atlas/${slug}`);
}
