import { Price } from "@/types";

export const getURL = () => {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to the site URL in production env.
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
    'http://localhost:3000/'; 

  // Confirm if URL includes HTTPS, add it if it doesn't.
  url = url.includes('http') ? url : `https://${url}`
  // Include trailing slash if URL doesn't already have it.
  url = url.charAt(url.length - 1) === '/' ? url : `${url}/`

  return url;
}

export const postData = async ({
  url, data
}: {
  url: string; 
  data?: { price: Price}
}) => {
  console.log('POST REQUEST',  url, data);
  
  const res: Response = await fetch(url, {
    method: 'POST',
    headers: new Headers({ 'Content-Type': 'application/json'}),
    credentials: 'same-origin',
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    console.log('Error in POST', {url, data, res});
    throw new Error(res.statusText);
  }

  return res.json();
}

export const toDateTime = (secs: number) => {
  var t = new Date('1970-01-01T00:30:00Z'); // Unix epoch start 
  t.setSeconds(secs);
  return t;
};