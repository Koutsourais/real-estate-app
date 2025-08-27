import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { fetchPropertyBySlug } from "@/lib/wp";
import { notFound } from "next/navigation";
import PropertyGallery from "@/components/PropertyGallery";

function decodeSafe(s: string) {
  try { return decodeURIComponent(s); } catch { return s; }
}

// βοηθός: αφαιρεί όλες τις <img> από HTML
function stripImages(html: string) {
  return html.replace(/<img[^>]*>/gi, "");
}

type PageProps = { params: { slug: string } };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const data = await fetchPropertyBySlug(decodeSafe(params.slug));
  if (!data) return { title: "Ακίνητο | Δεν βρέθηκε" };

  const title = data.title || "Ακίνητο";
  const region = data.acf?.region ? ` | ${data.acf.region}` : "";
  const primaryImage =
    (Array.isArray(data.images) && data.images[0]?.url) ||
    data.acf?.image?.url ||
    undefined;

  return {
    title: `${title}${region} | Ακίνητα`,
    description: data.raw?.excerpt?.rendered
      ? (data.raw.excerpt.rendered as string).replace(/<[^>]+>/g, "").slice(0, 160)
      : `${title}${region}`,
    openGraph: {
      title: `${title}${region}`,
      images: primaryImage ? [{ url: primaryImage }] : [],
    },
  };
}

export default async function PropertyPage({ params }: PageProps) {
  const slug = decodeSafe(params.slug);
  const data = await fetchPropertyBySlug(slug);

  if (!data) notFound();

  const { title, contentHtml, acf, images = [] } = data as any;

  const price =
    acf?.price !== undefined && acf?.price !== ""
      ? Number(String(acf.price).replace(/[^\d.]/g, "")).toLocaleString("el-GR")
      : null;

  const heroUrl =
    images[0]?.url || acf?.image?.url || null;

  // καθαρίζουμε το HTML από <img>
  const cleanHtml = contentHtml ? stripImages(contentHtml) : "";

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <div className="mb-4">
        <Link href="/" className="text-sm text-blue-600 hover:underline">
          ← Πίσω στη λίστα
        </Link>
      </div>

      <div className="bg-white border rounded-2xl shadow-md overflow-hidden">
        {/* HERO εικόνα */}
        {heroUrl && (
          <div className="w-full h-56 sm:h-72 md:h-80 relative">
            <Image
              src={heroUrl}
              alt={acf?.image?.alt || title || "Ακίνητο"}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* --- GALLERY κάτω από HERO --- */}
        {Array.isArray(images) && images.length > 1 && (
          <div className="px-6 pt-4">
            <PropertyGallery images={images.slice(1)} />
          </div>
        )}

        {/* Info section */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <h1 className="text-2xl font-bold mb-2">{title || "Χωρίς τίτλο"}</h1>

            <div className="text-gray-700 space-y-2 mb-4">
              {price && (
                <p className="text-2xl font-semibold text-green-700">
                  {price} €
                </p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                {acf?.region && <p>📍 Περιοχή: <span className="font-medium">{acf.region}</span></p>}
                {acf?.ad_type && <p>🏷️ Τύπος Αγγελίας: <span className="font-medium">{acf.ad_type}</span></p>}
                {acf?.real_estate_type && <p>🏠 Τύπος Ακινήτου: <span className="font-medium">{acf.real_estate_type}</span></p>}
                {acf?.area && <p>📐 Εμβαδόν: <span className="font-medium">{acf.area} m²</span></p>}
                {acf?.bedrooms && String(acf.bedrooms).trim() !== "" && (
                  <p>🛏️ Υ/Δ: <span className="font-medium">{acf.bedrooms}</span></p>
                )}
              </div>
            </div>

            {/* Περιγραφή χωρίς εικόνες */}
            {cleanHtml && (
              <article
                className="prose prose-sm sm:prose base max-w-none"
                dangerouslySetInnerHTML={{ __html: cleanHtml }}
              />
            )}
          </div>

          {/* Sidebar actions */}
          <aside className="lg:col-span-1">
            <div className="border rounded-xl p-4 space-y-3">
              <h2 className="font-semibold">Ενδιαφέρομαι</h2>
              <p className="text-sm text-gray-600">
                Επικοινώνησε για περισσότερες πληροφορίες ή για ραντεβού επίσκεψης.
              </p>
              <Link
                href={`mailto:info@koutsourais.com?subject=${encodeURIComponent(
                  "Ενδιαφέρον για: " + (title || "")
                )}`}
                className="inline-block w-full text-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Ζητήστε πληροφορίες
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
