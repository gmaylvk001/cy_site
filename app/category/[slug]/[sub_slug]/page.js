import CategoryComponent from "@/components/category/[slug]/[sub_slug]/page";

function toAbsoluteUrl(baseUrl, value) {
  if (!value) return null;
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  return value.startsWith("/") ? `${baseUrl}${value}` : `${baseUrl}/${value}`;
}

async function getSubCategoryData(slug, subSlug) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  try {
    const [subCategoryRes, parentCategoryRes] = await Promise.all([
      fetch(`${baseUrl}/api/categories/${slug}/${subSlug}`, {
        cache: "no-store",
      }),
      fetch(`${baseUrl}/api/categories/${slug}`, {
        cache: "no-store",
      }),
    ]);

    const subCategoryData = subCategoryRes.ok ? await subCategoryRes.json() : null;
    const parentCategoryData = parentCategoryRes.ok
      ? await parentCategoryRes.json()
      : null;

    return {
      subCategoryData,
      parentCategoryData,
    };
  } catch {
    return {
      subCategoryData: null,
      parentCategoryData: null,
    };
  }
}

export async function generateMetadata({ params }) {
  const { slug, sub_slug: subSlug } = params;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const { subCategoryData } = await getSubCategoryData(slug, subSlug);
  const category = subCategoryData?.category;

  if (!category) {
    return {
      title: "Category Not Found",
      description: "This category does not exist",
    };
  }

  const title = category.meta_title || category.category_name;
  const description =
    category.meta_description ||
    category.category_description ||
    `Browse products in ${category.category_name}`;
  const image = toAbsoluteUrl(baseUrl, category.image);
  const canonicalUrl = `${baseUrl}/category/${slug}/${subSlug}`;

  return {
    title,
    description,
    keywords: category.meta_keyword || "",
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      images: image ? [image] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : [],
    },
  };
}

export default async function Page({ params }) {
  const { slug, sub_slug: subSlug } = params;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const { subCategoryData, parentCategoryData } = await getSubCategoryData(
    slug,
    subSlug
  );

  const category = subCategoryData?.category;
  const parentCategory = parentCategoryData?.main_category;
  const products = subCategoryData?.products || [];

  const categorySchema = category
    ? {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "@id": `${baseUrl}/category/${slug}/${subSlug}`,
        name: category.category_name,
        description:
          category.meta_description || category.category_description || "",
        url: `${baseUrl}/category/${slug}/${subSlug}`,
        image: toAbsoluteUrl(baseUrl, category.image) || undefined,
        mainEntity: {
          "@type": "ItemList",
          itemListElement: products.slice(0, 50).map((product, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: `${baseUrl}/product/${product.slug}`,
            name: product.name,
            image:
              product.images?.length > 0
                ? toAbsoluteUrl(baseUrl, `/uploads/products/${product.images[0]}`)
                : undefined,
          })),
        },
      }
    : null;

  const breadcrumbSchema = category
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: baseUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: parentCategory?.category_name || slug,
            item: `${baseUrl}/category/${slug}`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: category.category_name,
            item: `${baseUrl}/category/${slug}/${subSlug}`,
          },
        ],
      }
    : null;

  return (
    <>
      {categorySchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(categorySchema) }}
        />
      )}
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}
      <CategoryComponent params={params} />
    </>
  );
}
