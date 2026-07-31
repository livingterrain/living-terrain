import { redirect } from "next/navigation";

/** Legacy prototype route — Atlas now lives at /atlas */
export default function AtlasV1Redirect() {
  redirect("/atlas");
}
