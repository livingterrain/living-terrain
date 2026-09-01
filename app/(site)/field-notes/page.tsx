import { redirect } from "next/navigation";

/**
 * Field Notes index — quarantined from public Shelves.
 * Underlying note routes remain; data is not deleted.
 */
export default function FieldNotesPage() {
  redirect("/inquiry");
}
