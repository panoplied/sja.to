import React, { useState } from 'react';
import { trpc } from '../../utils/trpc';
import debounce from 'debounce';

type UrlShortcut = {
  url: string;
  slug: string;
};

function UrlForm() {

  // "Virtual" URL value used for visual validation only
  const [urlValue, setUrlValue] = useState('');
  
  // Real URL and slug values are stored in shortcut object
  const [shortcut, setShortcut] = useState<UrlShortcut>({ url: '', slug: '' });

  // Routine status states
  const [urlInputActivated, setUrlInputActivated] = useState(false);
  const [urlConfirmed, setUrlConfirmed] = useState(false);

  // DB comms
  const addUrl = trpc.useMutation(["addUrl"]);
  const slugAvailable = trpc.useQuery(["fetchUrl", { slug: shortcut.slug }]);


  // TODO: implement proper URL validation
  function isValidURL(url: string) {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  }

  // Handles visual URL validation
  function handleURLInput(e: React.ChangeEvent<HTMLInputElement>) {
    const url = e.target.value;
    setUrlInputActivated(true);
    if (isValidURL(url)) {
      setUrlValue(url);
    } else {
      setUrlValue('');
    }
  }

  // Handles real URL confirmation (UrlShortcut object state setting)
  // Switches form rendering based on urlConfirmed state
  function handleURLConfirm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const urlElement = e.currentTarget.elements[0] as HTMLInputElement | null;  // TS is a mess
    if (urlElement != null) {

      const url = urlElement.value;
      if (isValidURL(url)) {
        // Set real URL state
        setShortcut({ ...shortcut, url: url });
        // Set urlConfirmed state flag for conditional rendering for the whole form
        setUrlConfirmed(true);
      }

    }
  }

  if (!urlConfirmed) {
    return(

      <form
        className="crtFont flex flex-col"
        spellCheck="false"
        onSubmit={handleURLConfirm}
      >

        <input
          type="text"
          id="url"  // Need this ID to get the url in the confirmation handler
          className={`p-[10px] text-center border-2 bg-black
            focus:outline-none focus:placeholder-transparent focus:border-emerald-200 focus:ring-2 focus:ring-emerald-200
            ${!urlInputActivated || urlValue ?
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
          type="submit"
          value="CONFIRM ->"
          className="p-[10px] mt-[30px] emerald border-2 
          focus:outline-none focus:ring-2 focus:ring-emerald-200
          active:bg-emerald-700
          bg-emerald-900 border-t-emerald-300 border-l-emerald-300 border-b-emerald-500 border-r-emerald-500 cursor-pointer
          disabled:bg-stone-900 disabled:border-t-stone-700 disabled:border-l-stone-700 disabled:border-b-stone-800 disabled:border-r-stone-800 disabled:text-stone-400 disabled:cursor-not-allowed" 
          disabled = { urlValue === '' || !urlInputActivated }
        />

      </form>

    );
  }
  
  else {
    console.log(shortcut.url);
    return(

      <form
        className="crtFont flex flex-col"
        onSubmit = { (e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          addUrl.mutate({ ...shortcut });
        }}
      >
        <div className="p-[10px] text-center border-2 bg-black border-emerald-400 selection:bg-emerald-900 selection:text-emerald-100">
          <span className="green">https://sja.to/</span>
          <span className="emerald">slug-part-of-the-url</span>
        </div>
        {/* <input
          type="text"
          className={`p-[10px] text-center border-2 bg-black`}
        /> */}
      </form>

    );
  }

}

export default UrlForm;