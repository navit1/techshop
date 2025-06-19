import { useState, useEffect } from 'react';
import { Product } from '@/types'; // Assuming Product type is defined here
import { ProductGrid } from '@/components/products/ProductGrid'; // Assuming ProductGrid component exists
import { useLanguage } from '@/contexts/LanguageProvider'; // Assuming useLanguage context exists

/**
 * Client component for handling product search results.
 * Accepts searchParams as props from Next.js App Router page.
 */
export default function SearchResultHandlerClient({ searchParams }: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // Normalize the query parameter, handling string or array cases
  const rawQuery = searchParams.query;
  const searchQuery = Array.isArray(rawQuery)
    ? rawQuery.join(' ')
    : rawQuery || '';

  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { translate } = useLanguage(); // Using translation context

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/search?query=${encodeURIComponent(searchQuery)}`
        );
        if (!response.ok) {
          throw new Error(translate('search.errorFetchingResults'));
        }

        const data: Product[] = await response.json();
        setSearchResults(data);
      } catch (err) {
        console.error('Error fetching search results:', err);
        setError(
          typeof err === 'string' ? err : translate('search.errorFetchingResults')
        );
      } finally {
        setLoading(false);
      }
    };

    if (searchQuery.trim() !== '') {
      fetchSearchResults();
    } else {
      setSearchResults([]);
      setLoading(false);
    }
  }, [searchQuery, translate]); // Include translation function in deps

  // Render loading state
  if (loading) {
    return <p>{translate('search.loading')}</p>;
  }

  // Render error state
  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  // Prompt to enter a query
  if (searchQuery.trim() === '') {
    return <p>{translate('search.enterQuery')}</p>;
  }

  // No results found
  if (searchResults.length === 0) {
    return <p>{translate('search.noResults', { query: searchQuery })}</p>;
  }

  // Render results
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">
        {translate('search.resultsFor', { query: searchQuery })}
      </h2>
      <ProductGrid products={searchResults} />
    </div>
  );
}
