import { redirect } from "next/navigation";

/** Predetermined threads retired — navigate by living question. */
export default function ObservatoryThreadRedirect() {
  redirect("/observatory");
}
