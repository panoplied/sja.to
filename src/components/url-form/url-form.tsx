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

  return(
    <form
      onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      addUrl.mutate({...urlObject});
    }}
      className="crtFont"
    >
      <p className="slate">URL</p>
      <input
        type="text"
        onChange={e => setUrlObject({...urlObject, url: e.target.value})}
        value={urlObject.url}
        required
        className="bg-stone-900 emerald p-[10px]"
      /><br /><br />
      <p className="slate">SLUG</p>
      <input
        type="text"
        onChange={e => setUrlObject({...urlObject, slug: e.target.value})}
        value={urlObject.slug}
        required
        className="bg-stone-900 emerald p-[10px]"
      />
      <br /><br />
      <input
        type="submit"
        value="ADD URL"
        className="bg-emerald-900 emerald p-[10px]"
      />
    </form>
  );
}

export default UrlForm;