import SiteLayout from "./(site)/layout";
import SiteNotFound from "./(site)/not-found";

/** Unmatched URLs fall outside the (site) group, so wrap them in its chrome. */
export default function NotFound() {
  return (
    <SiteLayout>
      <SiteNotFound />
    </SiteLayout>
  );
}
