import React, { useState } from 'react';
import { trpc } from '../../utils/trpc';
import debounce from 'debounce';

type UrlShortcut = {
  url: string;
  slug: string;
};

function UrlForm() {

  const [shortcut, setShortcut] = useState<UrlShortcut>({ url: '', slug: '' });
  const [urlInputActivated, setUrlInputActivated] = useState(false);

  const addUrl = trpc.useMutation(["addUrl"]);
  // const slugAvailable = trpc.useQuery(["fetchUrl", { slug: shortcut.slug }]);

  // TODO: implement proper URL validation
  function isValidURL(url: string) {
    try { new URL(url) }
    catch (_) { return false }
    return true;
  }

  function handleURLInput(e: React.ChangeEvent<HTMLInputElement>) {
    const url = e.target.value;
    setUrlInputActivated(true);
    if (isValidURL(url)) {
      setShortcut({...shortcut, url: url});
    } else {
      setShortcut({...shortcut, url: ''});
    }
  }

  return(

    <form
      onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        addUrl.mutate({ ...shortcut });
      }}
      className="crtFont flex flex-col"
    >

      <p className="slate">URL</p>
      <input
        type="text"
        className={`p-[10px]
          ${!urlInputActivated || shortcut.url ? 'emerald bg-neutral-900' : 'rose bg-neutral-900'}
       `}
        onChange = { debounce(handleURLInput, 300) }
        required
      />

      <p className="slate">SLUG</p>
      <input
        type="text"
        className="p-[10px] bg-neutral-900" 
        required
      />

      <input
        type="submit"
        value="ADD URL"
        className="p-[10px] emerald bg-emerald-900"
      />

    </form>

  );
}

export default UrlForm;