import { useState } from 'react';
import { trpc } from '../../utils/trpc';

type UrlObject = {
  url: string;
  slug: string;
};

function UrlForm() {
  const [urlObject, setUrlObject] = useState<UrlObject>({ url: '', slug: '' });

  const slugAvailable = trpc.useQuery(["fetchUrl", { slug: urlObject.slug }]);

  const addUrl = trpc.useMutation(["addUrl"]);
  console.log(addUrl.status);

  return(
    <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      addUrl.mutate({...urlObject});
    }}>
      <input
        type="text"
        onChange={e => setUrlObject({...urlObject, slug: e.target.value.toLowerCase()})}
        value={urlObject.slug}
        required
      />
      <input
        type="text"
        onChange={e=> setUrlObject({...urlObject, url: e.target.value})}
        value={urlObject.url}
      />
      <input type="submit" value="add url" />
    </form>
  );
}

export default UrlForm;