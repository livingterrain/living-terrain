import { redirect } from "next/navigation";

/** Legacy preview route — cinematic experience now lives at /observatory. */
export default function ObservatoryCinematicPage() {
  redirect("/observatory");
}
