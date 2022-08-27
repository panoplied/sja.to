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
  const [urlConfirmed, setUrlConfirmed] = useState(false);

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

  if (!urlConfirmed) {
    return(

      <form className="crtFont flex flex-col" spellCheck="false">

        <input
          type="text"
          className={`p-[10px] text-center border-2 bg-black
            focus:outline-none focus:placeholder-transparent focus:border-emerald-200
            ${!urlInputActivated || shortcut.url ?
              ('emerald border-emerald-400 selection:bg-emerald-900 selection:text-emerald-100 caret-emerald-200') :
              ('red border-red-500 selection:bg-red-900 selection:text-red-100 caret-red-200')
            }
          `}
          placeholder="ENTER URL"
          onChange = { debounce(handleURLInput, 500) }
          onFocus = { e => { e.target.placeholder = '' } }
          onBlur = { e => { e.target.placeholder = 'ENTER URL' } }
          required
        />

        <input
          type="button"
          value="CONFIRM ->"
          className="p-[10px] mt-[30px] emerald border-2 
          bg-emerald-900 border-t-emerald-300 border-l-emerald-300 border-b-emerald-500 border-r-emerald-500 cursor-pointer
          disabled:bg-stone-900 disabled:border-t-stone-700 disabled:border-l-stone-700 disabled:border-b-stone-800 disabled:border-r-stone-800 disabled:text-stone-400 disabled:cursor-not-allowed" 
          disabled = { shortcut.url === '' || !urlInputActivated }
          onClick = { e => { console.log( shortcut.url )}}
        />

      </form>

    );
  }
  
  else {
    return(

      <form
        onSubmit = { (e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          addUrl.mutate({ ...shortcut });
        }}
      >
      </form>

    );
  }

}

export default UrlForm;