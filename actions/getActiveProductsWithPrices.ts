import { ProductsWithPrice } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";


const getActiveProductsWithPrices = async (): Promise<ProductsWithPrice[]> => {
  // create Supabase client for server operations
  const supabase = createServerComponentClient({
    cookies: cookies // used for auth or session management
  });

  const { data, error } = await supabase
    .from('products')
    .select('*, prices(*)')
    .eq('active', true)
    .eq('prices.active', true)
    .order('metadata->index')
    .order('unit_amount', { referencedTable: 'prices' }); // was originally depracated, changed from foreignTable to referencedTable
    
    if (error) {
      console.log(error);
    }

    return (data as any) || [];
}

export default getActiveProductsWithPrices;