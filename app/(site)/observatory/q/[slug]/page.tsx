import { redirect } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

/** Legacy living-field URLs → V1 investigations */
export default async function ObservatoryQRedirect({ params }: Props) {
  const { slug } = await params;
  redirect(`/observatory/${slug}`);
}
